"""Cut digit boxes out of scanned count sheets — same steps as public/js/count-sheet.js (csReadPage/csReadDigitBox).

Used to build real-handwriting training data for the digit model:
    python scripts/countsheet_extract.py <scan.pdf|page.png ...> <out_dir>
For every page it writes rows.png (enlarged rows for labelling) and digits.npz
(canonical 28x28 inputs + page/row/box positions). Labels go in labels.json (see train-digit-model.py).
"""
import json, os, sys
import numpy as np
from scipy import ndimage

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from importlib import import_module
train = import_module('train-digit-model')  # canonicalize() — same preprocessing as training and the browser

# geometry: must match CS in public/js/count-sheet.js
W_MM = 210
FID, FIDS = 8, {'TL': (14, 14), 'TR': (196, 14), 'BL': (14, 283), 'BR': (196, 283)}
BITS_Y, BITS_X, BIT_W, BIT_STEP, BIT_COUNT = 30, 22, 4, 5.5, 16
ROW_Y0, ROW_H, ROWS = 46, 11, 20
COL_DIGITS, DIGITS, BOX_W, BOX_H = 130, 6, 9, 9
INSET = 1.1
PROCS = ['BW', 'LC', 'CW', 'CW_EXPORT', 'AI']


def load_pages(paths):
    pages = []
    for p in paths:
        if p.lower().endswith('.pdf'):
            import fitz
            doc = fitz.open(p)
            for i, page in enumerate(doc):
                pix = page.get_pixmap(dpi=200)
                a = np.frombuffer(pix.samples, np.uint8).reshape(pix.height, pix.width, pix.n)[..., :3]
                pages.append((f'{os.path.basename(p)}#{i + 1}', a))
        else:
            from PIL import Image
            pages.append((os.path.basename(p), np.asarray(Image.open(p).convert('RGB'))))
    return pages


def gray(a):
    a = a.astype(np.float32) / 255
    return 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]


def find_fiducials(g):
    h, w = g.shape
    paper = np.percentile(g[::7, ::7], 90)
    mask = g < paper * 0.5
    lab, n = ndimage.label(mask)
    s = FID * min(w, h) / W_MM
    cands = []
    for i, sl in enumerate(ndimage.find_objects(lab)):
        bh, bw = sl[0].stop - sl[0].start, sl[1].stop - sl[1].start
        if not (s * 0.65 < bw < s * 1.6 and s * 0.65 < bh < s * 1.6 and 0.7 < bw / bh < 1.4):
            continue
        area = (lab[sl] == i + 1).sum()
        fill = area / (bw * bh)
        if fill > 0.5:
            cands.append({'cx': (sl[1].start + sl[1].stop - 1) / 2, 'cy': (sl[0].start + sl[0].stop - 1) / 2, 'fill': fill})
    picked = []
    for X, Y in [(0, 0), (w, 0), (0, h), (w, h)]:
        picked.append(min(cands, key=lambda c: np.hypot(c['cx'] - X, c['cy'] - Y)))
    if len({id(p) for p in picked}) != 4:
        return None
    rings = [c for c in picked if c['fill'] < 0.85]
    if len(rings) != 1:
        return None
    tl = rings[0]
    others = [c for c in picked if c is not tl]
    br = max(others, key=lambda c: np.hypot(c['cx'] - tl['cx'], c['cy'] - tl['cy']))
    p, q = [c for c in others if c is not br]
    cross = (p['cx'] - tl['cx']) * (q['cy'] - tl['cy']) - (p['cy'] - tl['cy']) * (q['cx'] - tl['cx'])
    tr, bl = (p, q) if cross > 0 else (q, p)
    return {'TL': (tl['cx'], tl['cy']), 'TR': (tr['cx'], tr['cy']), 'BL': (bl['cx'], bl['cy']), 'BR': (br['cx'], br['cy']), 'paper': paper}


def homography(src, dst):
    A, b = [], []
    for (x, y), (u, v) in zip(src, dst):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); b.append(v)
    H = np.linalg.solve(np.array(A, float), np.array(b, float))
    return lambda x, y: ((H[0] * x + H[1] * y + H[2]) / (H[6] * x + H[7] * y + 1), (H[3] * x + H[4] * y + H[5]) / (H[6] * x + H[7] * y + 1))


def warp(g, hmap, x, y, wmm, hmm, res):
    W, Hh = round(wmm * res), round(hmm * res)
    cc, rr = np.meshgrid((np.arange(W) + 0.5) / res + x, (np.arange(Hh) + 0.5) / res + y)
    u, v = hmap(cc, rr)
    return ndimage.map_coordinates(g, [v, u], order=1, cval=1.0).astype(np.float32)


def ink_map(crop, paper):
    """ความเข้มหมึกแบบปรับตามช่อง: เทียบกับจุดที่เข้มที่สุดในช่องนั้น ปากกาจาง/เข้มได้เส้นต่อเนื่องเท่ากัน
    (ต้องตรงกับ csInkMap ใน public/js/count-sheet.js)"""
    darkest = float(np.percentile(crop, 0.5))
    contrast = paper - darkest
    if contrast < 0.18:  # ไม่มีหมึกเลย (มีแต่กระดาษ/เส้นขอบจางๆ)
        return None, None
    top = paper - contrast * 0.25
    ink = np.clip((top - crop) / (contrast * 0.55), 0, 1)
    return ink, ink > 0.3


def read_digit_box(g, hmap, x, y, paper):
    crop = warp(g, hmap, x + INSET, y + INSET, BOX_W - 2 * INSET, BOX_H - 2 * INSET, 10)
    h, w = crop.shape
    ink, mask = ink_map(crop, paper)
    if ink is None:
        return None, crop
    lab, n = ndimage.label(mask)
    keep = np.zeros(n + 1, bool)
    for i, sl in enumerate(ndimage.find_objects(lab)):
        area = (lab[sl] == i + 1).sum()
        if area < 6:
            continue
        y0, y1, x0, x1 = sl[0].start, sl[0].stop - 1, sl[1].start, sl[1].stop - 1
        bh, bw = y1 - y0 + 1, x1 - x0 + 1
        touch_tb, touch_lr = y0 == 0 or y1 == h - 1, x0 == 0 or x1 == w - 1
        if touch_tb and bh <= h * 0.15 and bw >= w * 0.4:
            continue
        if touch_lr and bw <= 3 and bh >= h * 0.4:
            continue
        keep[i + 1] = True
    drop = (lab > 0) & ~keep[lab]
    ink[drop] = 0
    m2 = mask & keep[lab]
    total = m2.sum()
    if total < 22:
        return None, crop
    ys, xs = np.nonzero(m2)
    if xs.max() - xs.min() < 3 and ys.max() - ys.min() < 8:
        return None, crop
    return (train.canonicalize(ink[None])[0], ink), crop


def read_page(a):
    g = gray(a)
    f = find_fiducials(g)
    if not f:
        return None
    names = ['TL', 'TR', 'BL', 'BR']
    hmap = homography([FIDS[n] for n in names], [f[n] for n in names])
    bits = []
    for i in range(BIT_COUNT):
        c = warp(g, hmap, BITS_X + i * BIT_STEP + 0.8, BITS_Y + 0.8, BIT_W - 1.6, BIT_W - 1.6, 6)
        bits.append(1 if (c < f['paper'] * 0.5).mean() > 0.5 else 0)
    v = 0
    for b in bits[:15]:
        v = (v << 1) | b
    page_id = {'filter': PROCS[v >> 12] if (v >> 12) < len(PROCS) else '?', 'page': (v >> 8) & 0xf, 'parity_ok': sum(bits[:15]) % 2 == bits[15]}
    rows = []
    for r in range(ROWS):
        y = ROW_Y0 + r * ROW_H
        digits, crops = [], []
        for d in range(DIGITS):
            res, crop = read_digit_box(g, hmap, COL_DIGITS + d * BOX_W, y + 1, f['paper'])
            digits.append(res); crops.append(crop)
        rows.append({'digits': digits, 'strip': warp(g, hmap, COL_DIGITS - 1, y, DIGITS * BOX_W + 2, ROW_H, 8)})
    return page_id, rows


def main():
    *inputs, out = sys.argv[1:]
    os.makedirs(out, exist_ok=True)
    from PIL import Image, ImageDraw
    allx, allink, meta = [], [], []
    for name, a in load_pages(inputs):
        res = read_page(a)
        if not res:
            print(name, 'fiducials not found'); continue
        pid, rows = res
        used = [r for r in range(ROWS) if any(x is not None for x in rows[r]['digits'])]
        print(name, pid, 'rows with ink:', len(used))
        # รูปขยายแถวที่มีลายมือ ไว้ให้คนอ่านแล้วใส่คำตอบ
        if used:
            strips = [rows[r]['strip'] for r in used]
            sh, sw = strips[0].shape
            sheet = Image.new('L', (sw * 2 + 70, sh * 2 * len(used)), 255)
            dr = ImageDraw.Draw(sheet)
            for k, (r, s) in enumerate(zip(used, strips)):
                im = Image.fromarray((np.clip(s, 0, 1) * 255).astype(np.uint8)).resize((sw * 2, sh * 2))
                sheet.paste(im, (70, k * sh * 2))
                dr.text((4, k * sh * 2 + sh - 6), f'r{r + 1:02d}', fill=0)
            tag = f"{pid['filter']}_p{pid['page'] + 1}"
            sheet.save(os.path.join(out, f'{tag}.png'))
        for r in used:
            for d, res in enumerate(rows[r]['digits']):
                if res is not None:
                    allx.append(res[0]); allink.append(res[1]); meta.append({'src': name, 'filter': pid['filter'], 'page': pid['page'] + 1, 'row': r + 1, 'box': d + 1})
    np.savez_compressed(os.path.join(out, 'digits.npz'), x=np.array(allx, np.float32), ink=np.array(allink, np.float32))
    json.dump(meta, open(os.path.join(out, 'digits_meta.json'), 'w'), ensure_ascii=False, indent=0)
    print('digits:', len(allx))


if __name__ == '__main__':
    main()

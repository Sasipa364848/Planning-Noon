"""Train the offline handwritten-digit model used by the stock count-sheet reader.

Usage: python scripts/train-digit-model.py <mnist_dir>
Writes public/models/digits.bin (float32 weights) + public/models/digits.json (layer shapes).

Every digit goes through canonicalize() before training — public/js/count-sheet.js (csCanonicalize) does the
exact same steps in the browser: crop -> fit 40px -> binarize -> skeletonize -> redraw at fixed stroke width ->
halve to 24px -> centre of mass at (14,14) in 28x28. Pen thickness then no longer matters.
"""
import gzip, json, os, sys
from multiprocessing import Pool
import numpy as np
from scipy import ndimage

rng = np.random.default_rng(42)

FIT, CANVAS = 40, 48
DISK = np.array([[0, 1, 1, 1, 0], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [0, 1, 1, 1, 0]], bool)


def fit48(img):
    ys, xs = np.nonzero(img > 0.3)
    out = np.zeros((CANVAS, CANVAS), bool)
    if len(ys) == 0:
        return out
    crop = img[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    h, w = crop.shape
    s = FIT / max(h, w)
    th, tw = max(1, round(h * s)), max(1, round(w * s))
    z = ndimage.zoom(crop, (th / h, tw / w), order=1)[:th, :tw]
    y0, x0 = (CANVAS - z.shape[0]) // 2, (CANVAS - z.shape[1]) // 2
    out[y0:y0 + z.shape[0], x0:x0 + z.shape[1]] = z > 0.4
    return out


def zhang_suen(b):
    """Vectorised Zhang-Suen thinning over a batch (N,H,W) of bool images."""
    img = np.pad(b, ((0, 0), (1, 1), (1, 1))).astype(np.uint8)
    while True:
        changed = False
        for step in (0, 1):
            P = img
            p2, p3, p4 = P[:, :-2, 1:-1], P[:, :-2, 2:], P[:, 1:-1, 2:]
            p5, p6, p7 = P[:, 2:, 2:], P[:, 2:, 1:-1], P[:, 2:, :-2]
            p8, p9 = P[:, 1:-1, :-2], P[:, :-2, :-2]
            c = P[:, 1:-1, 1:-1]
            seq = [p2, p3, p4, p5, p6, p7, p8, p9, p2]
            B = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9
            A = sum(((seq[k] == 0) & (seq[k + 1] == 1)).astype(np.uint8) for k in range(8))
            if step == 0:
                m = (p2 * p4 * p6 == 0) & (p4 * p6 * p8 == 0)
            else:
                m = (p2 * p4 * p8 == 0) & (p2 * p6 * p8 == 0)
            rem = (c == 1) & (B >= 2) & (B <= 6) & (A == 1) & m
            if rem.any():
                changed = True
                img[:, 1:-1, 1:-1][rem] = 0
        if not changed:
            break
    return img[:, 1:-1, 1:-1].astype(bool)


def canonicalize(batch):
    b = np.stack([fit48(i) for i in batch])
    sk = zhang_suen(b)
    th = np.stack([ndimage.binary_dilation(s, DISK) for s in sk]).astype(np.float32)
    small = th.reshape(-1, 24, 2, 24, 2).mean((2, 4))
    out = np.zeros((len(batch), 28, 28), np.float32)
    for i, s in enumerate(small):
        tot = s.sum()
        if tot == 0:
            continue
        yy, xx = np.indices(s.shape)
        cy, cx = (s * yy).sum() / tot, (s * xx).sum() / tot
        oy, ox = int(np.floor(14 - cy)), int(np.floor(14 - cx))
        for r in range(24):
            Y = r + oy
            if 0 <= Y < 28:
                lo, hi = max(0, -ox), min(24, 28 - ox)
                if lo < hi:
                    out[i, Y, lo + ox:hi + ox] = s[r, lo:hi]
    return out.reshape(-1, 784)


def augment(img, rng):
    ang = np.deg2rad(rng.uniform(-14, 14))
    sc = rng.uniform(0.85, 1.15)
    shear = rng.uniform(-0.25, 0.25)
    asp = rng.uniform(0.8, 1.2)
    m = np.array([[np.cos(ang), -np.sin(ang)], [np.sin(ang), np.cos(ang)]]) @ np.array([[1, shear], [0, 1]]) @ np.diag([1, asp]) / sc
    c = (np.array(img.shape) - 1) / 2
    return ndimage.affine_transform(img, m, offset=c - m @ c, order=1)


def prep_chunk(args):
    imgs, seed = args
    if seed is None:
        return canonicalize(imgs)
    r = np.random.default_rng(seed)
    return canonicalize(np.stack([augment(i, r) for i in imgs]))


def prep(pool, imgs, seed=None):
    chunks = np.array_split(imgs, 64)
    seeds = [None] * 64 if seed is None else [seed * 1000 + k for k in range(64)]
    return np.concatenate(pool.map(prep_chunk, list(zip(chunks, seeds))))


def load(mnist_dir, name, header, shape):
    with gzip.open(os.path.join(mnist_dir, name), 'rb') as f:
        return np.frombuffer(f.read(), np.uint8, offset=header).reshape(shape)


if __name__ == '__main__':
    import argparse
    ap = argparse.ArgumentParser()
    ap.add_argument('mnist_dir')
    ap.add_argument('--real', help='npz ลายมือจริงจากใบนับ (ink, y, filt) — ดู scripts/countsheet_extract.py')
    ap.add_argument('--holdout', help='กันลายมือจริงของ process นี้ไว้วัดผล ไม่ใช้เทรน (เช่น AI)')
    ap.add_argument('--init', help='เริ่มจากโมเดลเดิมในโฟลเดอร์นี้ (fine-tune) แทนสุ่มใหม่')
    ap.add_argument('--epochs', type=int, default=12)
    ap.add_argument('--real-repeat', type=int, default=40, help='ใช้ลายมือจริงซ้ำกี่รอบต่อ epoch (แต่ละรอบบิด/ย่อขยายไม่เหมือนกัน)')
    ap.add_argument('--out', default=os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'models'))
    args = ap.parse_args()

    xtr = load(args.mnist_dir, 'train-images-idx3-ubyte.gz', 16, (-1, 28, 28)).astype(np.float32) / 255
    ytr = load(args.mnist_dir, 'train-labels-idx1-ubyte.gz', 8, (-1,))
    xte = load(args.mnist_dir, 't10k-images-idx3-ubyte.gz', 16, (-1, 28, 28)).astype(np.float32) / 255
    yte = load(args.mnist_dir, 't10k-labels-idx1-ubyte.gz', 8, (-1,))
    pool = Pool(min(16, os.cpu_count() or 4))
    print('canonicalizing test set...', flush=True)
    xte_c = prep(pool, xte)

    real_tr = real_ho = None
    if args.real:
        rd = np.load(args.real)
        ho = rd['filt'] == args.holdout if args.holdout else np.zeros(len(rd['y']), bool)
        real_tr = (rd['ink'][~ho], rd['y'][~ho])
        if ho.any():
            real_ho = (prep(pool, rd['ink'][ho]), rd['y'][ho])
        print(f'real handwriting: train {len(real_tr[1])}, holdout {int(ho.sum())}', flush=True)

    sizes = [784, 512, 256, 10]
    if args.init:
        buf = np.fromfile(os.path.join(args.init, 'digits.bin'), '<f4'); off = 0; W = []; B = []
        for a_, b_ in zip(sizes[:-1], sizes[1:]):
            W.append(buf[off:off + a_ * b_].reshape(a_, b_).copy()); off += a_ * b_
            B.append(buf[off:off + b_].copy()); off += b_
    else:
        W = [rng.normal(0, np.sqrt(2 / a_), (a_, b_)).astype(np.float32) for a_, b_ in zip(sizes[:-1], sizes[1:])]
        B = [np.zeros(b_, np.float32) for b_ in sizes[1:]]
    params = W + B
    m_ = [np.zeros_like(p) for p in params]
    v_ = [np.zeros_like(p) for p in params]
    t = 0

    def forward(x, train=False):
        acts = [x]
        for i in range(len(W)):
            z = acts[-1] @ W[i] + B[i]
            if i < len(W) - 1:
                z = np.maximum(z, 0)
                if train:
                    z *= (rng.random(z.shape) > 0.2) / 0.8
            acts.append(z)
        return acts

    def report(tag):
        acc = (forward(xte_c)[-1].argmax(1) == yte).mean()
        msg = f'{tag} mnist_acc={acc:.4f}'
        if real_ho is not None:
            P = forward(real_ho[0])[-1]
            P = np.exp(P - P.max(1, keepdims=True)); P /= P.sum(1, keepdims=True)
            pred, conf = P.argmax(1), P.max(1)
            ok = pred == real_ho[1]
            msg += f' | holdout_real_acc={ok.mean():.3f} wrong_confident={int((~ok & (conf >= 0.9)).sum())} flagged={int((conf < 0.9).sum())}/{len(ok)}'
        print(msg, flush=True)
        return acc

    report('before')
    base_lr = 3e-4 if args.init else 1e-3
    bs = 128
    for ep in range(args.epochs):
        lr = base_lr * (0.5 ** (ep // 4))
        xa, ya = prep(pool, xtr, seed=ep + 1), ytr
        if real_tr is not None:
            reps = np.repeat(np.arange(len(real_tr[1])), args.real_repeat)
            xr = prep(pool, real_tr[0][reps], seed=500 + ep)
            xa, ya = np.concatenate([xa, xr]), np.concatenate([ya, real_tr[1][reps]])
        perm = rng.permutation(len(xa))
        for s in range(0, len(xa), bs):
            idx = perm[s:s + bs]
            x, y = xa[idx], ya[idx]
            acts = forward(x, train=True)
            logits = acts[-1]
            p = np.exp(logits - logits.max(1, keepdims=True))
            p /= p.sum(1, keepdims=True)
            g = p
            g[np.arange(len(y)), y] -= 1
            g /= len(y)
            gW, gB = [None] * len(W), [None] * len(W)
            for i in reversed(range(len(W))):
                gW[i] = acts[i].T @ g
                gB[i] = g.sum(0)
                if i > 0:
                    g = (g @ W[i].T) * (acts[i] > 0)
            t += 1
            for k, (p_, gr) in enumerate(zip(params, gW + gB)):
                m_[k] = 0.9 * m_[k] + 0.1 * gr
                v_[k] = 0.999 * v_[k] + 0.001 * gr * gr
                p_ -= lr * (m_[k] / (1 - 0.9 ** t)) / (np.sqrt(v_[k] / (1 - 0.999 ** t)) + 1e-8)
        acc = report(f'epoch {ep + 1}/{args.epochs} lr={lr:.0e}')

    os.makedirs(args.out, exist_ok=True)
    with open(os.path.join(args.out, 'digits.bin'), 'wb') as f:
        for w, b in zip(W, B):
            f.write(w.astype('<f4').tobytes())
            f.write(b.astype('<f4').tobytes())
    with open(os.path.join(args.out, 'digits.json'), 'w') as f:
        json.dump({'layers': [[a_, b_] for a_, b_ in zip(sizes[:-1], sizes[1:])], 'input': 28, 'preprocess': 'skeleton-v1', 'testAccuracy': float(acc),
                   'realSamples': 0 if real_tr is None else int(len(real_tr[1]))}, f)
    print('saved to', os.path.abspath(args.out))

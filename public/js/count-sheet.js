// ใบนับสต็อกแบบสแกนได้ + ตัวอ่านใบนับในเบราว์เซอร์ (ไม่ส่งข้อมูลออกนอกเครื่อง)
// ใบนับวางทุกอย่างตามพิกัด mm ตายตัว (CS) มีจุดมาร์ค 4 มุมไว้จัดแนวภาพสแกน — มุมซ้ายบนเป็นวงแหวน ใช้บอกทิศถ้าสแกนกลับหัว/ตะแคง
// แถบบิตใต้หัวกระดาษเก็บ process + หน้า + checksum รายชื่อ Model ไว้ ตอนอ่านจะรู้ว่าเป็นใบของแท็บไหน หน้าไหน และรายชื่อเปลี่ยนไปหลังพิมพ์หรือเปล่า

const CS = {
    W: 210, H: 297,
    FID: 8, FID_HOLE: 4.5,
    FIDS: { TL: [14, 14], TR: [196, 14], BL: [14, 283], BR: [196, 283] },
    BITS_Y: 30, BITS_X: 22, BIT_W: 4, BIT_STEP: 5.5, BIT_COUNT: 16,
    HEAD_Y: 38, ROW_Y0: 46, ROW_H: 11, ROWS: 20,
    COL_CODE: 22, COL_MODEL: 38, COL_LAST: 104, COL_DIGITS: 130,
    DIGITS: 6, BOX_W: 9, BOX_H: 9,
};
const CS_PROC_INDEX = { BW: 0, LC: 1, CW: 2, CW_EXPORT: 3, AI: 4 };
const CS_PROC_BY_INDEX = Object.keys(CS_PROC_INDEX);

function csRowsHash(rows) {
    let h = 2166136261;
    rows.map(r => r.stockKey).join('|').split('').forEach(ch => { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619) >>> 0; });
    return h & 0xff;
}
function csEncodeBits(filter, page, hash) {
    const v = (CS_PROC_INDEX[filter] << 12) | ((page & 0xf) << 8) | (hash & 0xff);
    const bits = [];
    for (let i = 14; i >= 0; i--) bits.push((v >> i) & 1);
    bits.push(bits.reduce((a, b) => a ^ b, 0));
    return bits;
}
function csDecodeBits(bits) {
    if (bits.slice(0, 15).reduce((a, b) => a ^ b, 0) !== bits[15]) return null;
    let v = 0;
    for (let i = 0; i < 15; i++) v = (v << 1) | bits[i];
    const proc = CS_PROC_BY_INDEX[v >> 12];
    if (!proc) return null;
    return { filter: proc, page: (v >> 8) & 0xf, hash: v & 0xff };
}
function csPageChunks(rows) {
    const pages = [];
    for (let i = 0; i < rows.length; i += CS.ROWS) pages.push(rows.slice(i, i + CS.ROWS));
    return pages;
}

// ===== ใบนับแบบใหม่ (v2): 1 process ต่อ 1 แผ่น (แถวเตี้ยลงตามจำนวน Model) + ช่อง "แก้ไข" 2 ช่องท้ายแถว =====
// มีสี่เหลี่ยมทึบที่หัวกระดาษ (MARK) บอกว่าเป็นแบบใหม่ — ใบแบบเก่า (CS ด้านบน) ยังอ่านได้ตามเดิม
// แถบบิตเก็บ process + หน้า + จำนวนแถวของหน้านั้น (ใช้คำนวณความสูงแถวตอนอ่าน) + checksum รายชื่อ Model
const CS2 = {
    MARK: { x: 110, y: 11, s: 5 },
    BITS_Y: 30, BITS_X: 22, BIT_W: 3.4, BIT_STEP: 4.4, BIT_COUNT: 21,
    HEAD_Y: 38, ROW_Y0: 46, ROW_AREA: 220, ROW_H_MAX: 11, MAX_ROWS: 28,
    COL_CODE: 22, COL_MODEL: 36, COL_LAST: 96, COL_DIGITS: 116, DIGITS: 6, BOX_W: 8,
    COL_FIX: 172, FIX: 2,
};
function cs2RowH(n) { return Math.min(CS2.ROW_H_MAX, CS2.ROW_AREA / Math.max(n, 1)); }
// จัดหน้าแบบไม่ตัดกลุ่ม: ปกติทั้ง process อยู่แผ่นเดียว — ถ้าเกิน MAX_ROWS ค่อยขึ้นแผ่นใหม่ทีละกลุ่ม
function cs2Paginate(rows) {
    const groups = [];
    rows.forEach(r => { if (!groups.length || groups[groups.length - 1][0].groupId !== r.groupId) groups.push([]); groups[groups.length - 1].push(r); });
    const pages = [[]];
    groups.forEach(g => {
        let cur = pages[pages.length - 1];
        if (cur.length && cur.length + g.length > CS2.MAX_ROWS) { cur = []; pages.push(cur); }
        g.forEach(r => { if (cur.length === CS2.MAX_ROWS) { cur = []; pages.push(cur); } cur.push(r); });
    });
    return pages;
}
function cs2EncodeBits(filter, page, nRows, hash) {
    const v = (CS_PROC_INDEX[filter] << 17) | ((page & 0xf) << 13) | ((nRows & 0x1f) << 8) | (hash & 0xff);
    const bits = [];
    for (let i = 19; i >= 0; i--) bits.push((v >> i) & 1);
    bits.push(bits.reduce((a, b) => a ^ b, 0));
    return bits;
}
function cs2DecodeBits(bits) {
    if (bits.slice(0, 20).reduce((a, b) => a ^ b, 0) !== bits[20]) return null;
    let v = 0;
    for (let i = 0; i < 20; i++) v = (v << 1) | bits[i];
    const proc = CS_PROC_BY_INDEX[v >> 17];
    const nRows = (v >> 8) & 0x1f;
    if (!proc || !nRows) return null;
    return { filter: proc, page: (v >> 13) & 0xf, nRows, hash: v & 0xff };
}

// ===================== พิมพ์ใบนับ =====================
function printStockCountSheet() {
    const filter = stockProcessFilter;
    const rows = buildCountSheetRows(filter);
    if (rows.length === 0) { showToast('ไม่มี Model ในแท็บนี้', 'info'); return; }
    if (cs2Paginate(rows).length > 16) { showToast('Model เยอะเกินกว่าจะพิมพ์ในใบนับเดียว (เกิน 16 หน้า)', 'error'); return; }
    const docHtml = csBuildSheetHtml(filter, rows);
    const old = document.getElementById('countSheetFrame');
    if (old) old.remove();
    const frame = document.createElement('iframe');
    frame.id = 'countSheetFrame';
    frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;';
    document.body.appendChild(frame);
    const doc = frame.contentWindow.document;
    doc.open(); doc.write(docHtml); doc.close();
    setTimeout(() => { frame.contentWindow.focus(); frame.contentWindow.print(); }, 200);
}

function csBuildSheetHtml(filter, rows) {
    const pages = cs2Paginate(rows);
    const now = new Date();
    const printedAt = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    const mm = v => `${+v.toFixed(3)}mm`;
    const abs = (x, y, w, h) => `left:${mm(x)};top:${mm(y)};width:${mm(w)};height:${mm(h)};`;
    const L = CS2;
    const right = L.COL_FIX + L.FIX * L.BOX_W;

    const pageHtml = pages.map((pageRows, p) => {
        const rowH = cs2RowH(pageRows.length);
        const boxH = rowH - 2;
        const bits = cs2EncodeBits(filter, p, pageRows.length, csRowsHash(pageRows));
        const fid = (name) => {
            const [cx, cy] = CS.FIDS[name];
            const hole = name === 'TL' ? `<div class="fid-hole" style="${abs((CS.FID - CS.FID_HOLE) / 2, (CS.FID - CS.FID_HOLE) / 2, CS.FID_HOLE, CS.FID_HOLE)}"></div>` : '';
            return `<div class="fid" style="${abs(cx - CS.FID / 2, cy - CS.FID / 2, CS.FID, CS.FID)}">${hole}</div>`;
        };
        let lastGroup = null;
        const rowsHtml = pageRows.map((r, i) => {
            const y = L.ROW_Y0 + i * rowH;
            const showGroup = r.groupId !== lastGroup;
            lastGroup = r.groupId;
            const last = r.stockRec.value !== '' && r.stockRec.value != null ? (parseFloat(r.stockRec.value) || 0).toLocaleString() : '-';
            const boxes = Array.from({ length: L.DIGITS }, (_, d) =>
                `<div class="dbox" style="${abs(L.COL_DIGITS + d * L.BOX_W, y + 1, L.BOX_W, boxH)}"></div>`).join('');
            const fixes = Array.from({ length: L.FIX }, (_, d) =>
                `<div class="dbox fix" style="${abs(L.COL_FIX + d * L.BOX_W, y + 1, L.BOX_W, boxH)}"></div>`).join('');
            return `<div class="rowline" style="${abs(L.COL_CODE, y + rowH, right - L.COL_CODE, 0)}"></div>
                <div class="t code" style="${abs(L.COL_CODE, y, 14, rowH)}">${r.code}</div>
                <div class="t model" style="${abs(L.COL_MODEL, y, L.COL_LAST - L.COL_MODEL - 2, rowH)}">${showGroup ? `<span class="grp">${escapeHtml(r.groupLabel)}</span>` : ''}<span>${escapeHtml(r.displayModel)}</span></div>
                <div class="t last" style="${abs(L.COL_LAST, y, 18, rowH)}">${last}</div>${boxes}${fixes}`;
        }).join('');
        const bitsHtml = bits.map((b, i) => `<div class="bit${b ? ' on' : ''}" style="${abs(L.BITS_X + i * L.BIT_STEP, L.BITS_Y, L.BIT_W, L.BIT_W)}"></div>`).join('');
        return `<div class="page">
            ${['TL', 'TR', 'BL', 'BR'].map(fid).join('')}
            <div class="mark" style="${abs(L.MARK.x, L.MARK.y, L.MARK.s, L.MARK.s)}"></div>
            <div class="t" style="${abs(24, 10, 84, 16)}"><b style="font-size:15pt">ใบนับสต็อก — ${countSheetLabel(filter)}</b><br><span style="font-size:9pt">DSST · Production Plan · หน้า ${p + 1}/${pages.length}</span></div>
            <div class="t" style="${abs(124, 10, 64, 18)};font-size:10pt;line-height:2">วันที่ ______________<br>ผู้นับ ______________</div>
            ${bitsHtml}
            <div class="t hint" style="${abs(118, 28.5, 72, 8)}"><span>เขียนตัวเลข 1 หลักต่อ 1 ช่อง ชิดซ้าย · ไม่ได้นับเว้นว่าง</span><span><b>เขียนผิด:</b> ระบายช่องที่ผิดให้ทึบ ■ แล้วเขียนตัวที่ถูกในช่อง "แก้ไข"</span></div>
            <div class="t head" style="${abs(L.COL_CODE, L.HEAD_Y, 14, 7)}">รหัส</div>
            <div class="t head" style="${abs(L.COL_MODEL, L.HEAD_Y, 50, 7)}">Model</div>
            <div class="t head" style="${abs(L.COL_LAST, L.HEAD_Y, 18, 7)};justify-content:flex-end">นับครั้งก่อน</div>
            <div class="t head" style="${abs(L.COL_DIGITS, L.HEAD_Y, L.DIGITS * L.BOX_W, 7)}">จำนวนที่นับได้</div>
            <div class="t head fixhead" style="${abs(L.COL_FIX, L.HEAD_Y, L.FIX * L.BOX_W, 7)}">แก้ไข</div>
            <div class="rowline dark" style="${abs(L.COL_CODE, L.ROW_Y0, right - L.COL_CODE, 0)}"></div>
            ${rowsHtml}
            <div class="t foot" style="${abs(24, 268, 164, 6)}">ทั้งหมด ${rows.length} รายการ · พิมพ์จากระบบ ${printedAt} · ห้ามย่อ/ขยายตอนพิมพ์ (ใช้ขนาดจริง 100%)</div>
        </div>`;
    }).join('');

    const docHtml = `<!doctype html><html><head><meta charset="utf-8"><title>ใบนับสต็อก ${countSheetLabel(filter)}</title><style>
        @page { size: A4 portrait; margin: 0; }
        * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        body { margin: 0; font-family: 'Prompt','Segoe UI',Tahoma,sans-serif; color: #000; }
        .page { position: relative; width: 210mm; height: 297mm; overflow: hidden; page-break-after: always; }
        .page:last-child { page-break-after: auto; }
        .page > div { position: absolute; }
        .fid, .mark { background: #000; }
        .fid .fid-hole { position: absolute; background: #fff; }
        .bit { border: 0.2mm solid #999; }
        .bit.on { background: #000; border-color: #000; }
        .t { display: flex; flex-direction: column; justify-content: center; font-size: 10pt; line-height: 1.2; overflow: hidden; }
        .t.code { font-family: Consolas, monospace; font-weight: 700; font-size: 11pt; }
        .t.model span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .t.model .grp { font-size: 7pt; color: #555; }
        .t.last { align-items: flex-end; color: #444; }
        .t.head { font-size: 8.5pt; font-weight: 700; color: #333; flex-direction: row; align-items: center; }
        .t.head.fixhead { justify-content: center; color: #b45309; }
        .t.hint { font-size: 7pt; color: #444; line-height: 1.35; }
        .t.foot { font-size: 8pt; color: #444; }
        .rowline { border-top: 0.2mm solid #bbb; }
        .rowline.dark { border-top: 0.3mm solid #000; }
        .dbox { border: 0.25mm solid #b0b0b0; }
        .dbox + .dbox { border-left-width: 0; }
        .dbox.fix { border-color: #e0a060; background: #fff8ee; }
    </style></head><body>${pageHtml}</body></html>`;
    return docHtml;
}

// ===================== โมเดลอ่านตัวเลข =====================
let csModel = null;
async function csLoadModel() {
    if (csModel) return csModel;
    const [meta, buf] = await Promise.all([
        fetch('models/digits.json').then(r => r.json()),
        fetch('models/digits.bin').then(r => r.arrayBuffer()),
    ]);
    const all = new Float32Array(buf);
    let off = 0;
    const layers = meta.layers.map(([a, b]) => {
        const W = all.subarray(off, off + a * b); off += a * b;
        const B = all.subarray(off, off + b); off += b;
        return { a, b, W, B };
    });
    csModel = layers;
    return layers;
}
function csPredict(input) {
    let x = input;
    csModel.forEach((L, li) => {
        const out = new Float32Array(L.b);
        out.set(L.B);
        for (let i = 0; i < L.a; i++) {
            const xi = x[i];
            if (xi === 0) continue;
            const row = i * L.b;
            for (let j = 0; j < L.b; j++) out[j] += xi * L.W[row + j];
        }
        if (li < csModel.length - 1) for (let j = 0; j < L.b; j++) if (out[j] < 0) out[j] = 0;
        x = out;
    });
    let max = -Infinity, arg = 0;
    for (let j = 0; j < x.length; j++) if (x[j] > max) { max = x[j]; arg = j; }
    let sum = 0;
    for (let j = 0; j < x.length; j++) sum += Math.exp(x[j] - max);
    return { digit: arg, conf: 1 / sum };
}

// ทำให้ตัวเลขเป็นรูปแบบมาตรฐานก่อนป้อนโมเดล — ต้องตรงกับ canonicalize() ใน scripts/train-digit-model.py ทุกขั้น
// ย่อให้ด้านยาวสุด 40px -> ทำเป็นขาวดำ -> หาโครงเส้น (Zhang-Suen) -> วาดเส้นใหม่หนาเท่ากันเสมอ -> ย่อครึ่ง -> วางกลาง 28x28 ตามจุดศูนย์ถ่วง
// ผลคือหัวปากกาเล็ก/ใหญ่ หรือสแกนเข้ม/จาง ไม่มีผลกับการอ่าน
const CS_DISK = [[0, 1, 1, 1, 0], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [1, 1, 1, 1, 1], [0, 1, 1, 1, 0]];
function csCanonicalize(ink, w, h) {
    let x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let i = 0; i < ink.length; i++) if (ink[i] > 0.3) { const x = i % w, y = (i - x) / w; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    if (x1 < 0) return null;
    const ch = y1 - y0 + 1, cw = x1 - x0 + 1, s = 40 / Math.max(ch, cw);
    const th = Math.max(1, Math.round(ch * s)), tw = Math.max(1, Math.round(cw * s));
    const N = 48, b = new Uint8Array(N * N);
    const oy0 = Math.floor((N - th) / 2), ox0 = Math.floor((N - tw) / 2);
    const at = (x, y) => ink[(y0 + y) * w + (x0 + x)];
    for (let r = 0; r < th; r++) for (let c = 0; c < tw; c++) {
        const sy = th > 1 ? r * (ch - 1) / (th - 1) : 0, sx = tw > 1 ? c * (cw - 1) / (tw - 1) : 0;
        const iy = Math.min(ch - 1, Math.floor(sy)), ix = Math.min(cw - 1, Math.floor(sx));
        const fy = sy - iy, fx = sx - ix, iy1 = Math.min(ch - 1, iy + 1), ix1 = Math.min(cw - 1, ix + 1);
        const v = at(ix, iy) * (1 - fx) * (1 - fy) + at(ix1, iy) * fx * (1 - fy) + at(ix, iy1) * (1 - fx) * fy + at(ix1, iy1) * fx * fy;
        if (v > 0.4) b[(oy0 + r) * N + ox0 + c] = 1;
    }
    // Zhang-Suen thinning
    const P = (x, y) => (x < 0 || y < 0 || x >= N || y >= N) ? 0 : b[y * N + x];
    for (let changed = true; changed;) {
        changed = false;
        for (let step = 0; step < 2; step++) {
            const rem = [];
            for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
                if (!b[y * N + x]) continue;
                const p = [P(x, y - 1), P(x + 1, y - 1), P(x + 1, y), P(x + 1, y + 1), P(x, y + 1), P(x - 1, y + 1), P(x - 1, y), P(x - 1, y - 1)];
                const B = p.reduce((a, v) => a + v, 0);
                if (B < 2 || B > 6) continue;
                let A = 0;
                for (let k = 0; k < 8; k++) if (p[k] === 0 && p[(k + 1) % 8] === 1) A++;
                if (A !== 1) continue;
                const [p2, , p4, , p6, , p8] = p;
                if (step === 0 ? (p2 * p4 * p6 === 0 && p4 * p6 * p8 === 0) : (p2 * p4 * p8 === 0 && p2 * p6 * p8 === 0)) rem.push(y * N + x);
            }
            if (rem.length) { changed = true; rem.forEach(i => { b[i] = 0; }); }
        }
    }
    const thick = new Uint8Array(N * N);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
        if (!b[y * N + x]) continue;
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
            const X = x + dx, Y = y + dy;
            if (CS_DISK[dy + 2][dx + 2] && X >= 0 && Y >= 0 && X < N && Y < N) thick[Y * N + X] = 1;
        }
    }
    const small = new Float32Array(24 * 24);
    let tot = 0, cy = 0, cx = 0;
    for (let r = 0; r < 24; r++) for (let c = 0; c < 24; c++) {
        const v = (thick[(2 * r) * N + 2 * c] + thick[(2 * r) * N + 2 * c + 1] + thick[(2 * r + 1) * N + 2 * c] + thick[(2 * r + 1) * N + 2 * c + 1]) / 4;
        small[r * 24 + c] = v; tot += v; cy += v * r; cx += v * c;
    }
    const out = new Float32Array(784);
    if (!tot) return out;
    const oy = Math.floor(14 - cy / tot), ox = Math.floor(14 - cx / tot);
    for (let r = 0; r < 24; r++) for (let c = 0; c < 24; c++) {
        const Y = r + oy, X = c + ox;
        if (Y >= 0 && Y < 28 && X >= 0 && X < 28) out[Y * 28 + X] = small[r * 24 + c];
    }
    return out;
}

// ===================== อ่านภาพสแกน =====================
async function csLoadPdfJs() {
    if (window._pdfjs) return window._pdfjs;
    const lib = await import('../vendor/pdfjs/pdf.min.mjs');
    lib.GlobalWorkerOptions.workerSrc = 'vendor/pdfjs/pdf.worker.min.mjs';
    window._pdfjs = lib;
    return lib;
}
// คืนรายการ canvas หนึ่งอันต่อหนึ่งหน้า (PDF หลายหน้า / รูปหลายไฟล์)
async function csFilesToCanvases(files) {
    const canvases = [];
    for (const file of files) {
        if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
            const pdfjs = await csLoadPdfJs();
            const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
            for (let p = 1; p <= pdf.numPages; p++) {
                const page = await pdf.getPage(p);
                const vp1 = page.getViewport({ scale: 1 });
                const scale = 1800 / Math.min(vp1.width, vp1.height);
                const vp = page.getViewport({ scale });
                const c = document.createElement('canvas');
                c.width = Math.round(vp.width); c.height = Math.round(vp.height);
                const ctx = c.getContext('2d');
                ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
                // intent 'print' = ไม่ใช้ requestAnimationFrame ตอนวาด ถ้าผู้ใช้สลับไปแท็บอื่นระหว่างรอ จะยังอ่านต่อได้ ไม่ค้าง
                await page.render({ canvasContext: ctx, viewport: vp, intent: 'print' }).promise;
                canvases.push({ canvas: c, label: `${file.name} หน้า ${p}` });
            }
        } else {
            const img = await createImageBitmap(file);
            const scale = Math.min(1, 2400 / Math.max(img.width, img.height));
            const c = document.createElement('canvas');
            c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
            c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
            canvases.push({ canvas: c, label: file.name });
        }
    }
    return canvases;
}

function csGray(canvas) {
    const { width: w, height: h } = canvas;
    const data = canvas.getContext('2d', { willReadFrequently: true }).getImageData(0, 0, w, h).data;
    const g = new Float32Array(w * h);
    for (let i = 0, j = 0; i < g.length; i++, j += 4) g[i] = (0.299 * data[j] + 0.587 * data[j + 1] + 0.114 * data[j + 2]) / 255;
    return { g, w, h };
}
function csPercentile(arr, q, step = 7) {
    const hist = new Uint32Array(256);
    let n = 0;
    for (let i = 0; i < arr.length; i += step) { hist[Math.min(255, Math.max(0, Math.round(arr[i] * 255)))]++; n++; }
    let acc = 0;
    for (let k = 0; k < 256; k++) { acc += hist[k]; if (acc >= q * n) return k / 255; }
    return 1;
}
// connected components บน mask (Uint8Array) — คืน bbox/พื้นที่ของแต่ละก้อน
function csComponents(mask, w, h, minArea = 1) {
    const labels = new Int32Array(w * h);
    const comps = [];
    const stack = new Int32Array(w * h);
    let next = 1;
    for (let s = 0; s < mask.length; s++) {
        if (!mask[s] || labels[s]) continue;
        let sp = 0, area = 0, x0 = w, y0 = h, x1 = -1, y1 = -1;
        stack[sp++] = s; labels[s] = next;
        while (sp) {
            const p = stack[--sp];
            const x = p % w, y = (p - x) / w;
            area++;
            if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
            if (x > 0 && mask[p - 1] && !labels[p - 1]) { labels[p - 1] = next; stack[sp++] = p - 1; }
            if (x < w - 1 && mask[p + 1] && !labels[p + 1]) { labels[p + 1] = next; stack[sp++] = p + 1; }
            if (y > 0 && mask[p - w] && !labels[p - w]) { labels[p - w] = next; stack[sp++] = p - w; }
            if (y < h - 1 && mask[p + w] && !labels[p + w]) { labels[p + w] = next; stack[sp++] = p + w; }
        }
        if (area >= minArea) comps.push({ id: next, area, x0, y0, x1, y1, bw: x1 - x0 + 1, bh: y1 - y0 + 1 });
        next++;
    }
    return { comps, labels };
}

function csFindFiducials(img) {
    const { g, w, h } = img;
    const paper = csPercentile(g, 0.9);
    const mask = new Uint8Array(w * h);
    for (let i = 0; i < g.length; i++) mask[i] = g[i] < paper * 0.5 ? 1 : 0;
    const pxPerMm = Math.min(w, h) / CS.W;
    const s = CS.FID * pxPerMm;
    const { comps } = csComponents(mask, w, h, Math.round(s * s * 0.2));
    const cands = comps.filter(c => c.bw > s * 0.65 && c.bw < s * 1.6 && c.bh > s * 0.65 && c.bh < s * 1.6 && c.bw / c.bh > 0.7 && c.bw / c.bh < 1.4)
        .map(c => ({ ...c, fill: c.area / (c.bw * c.bh), cx: (c.x0 + c.x1) / 2, cy: (c.y0 + c.y1) / 2 }))
        .filter(c => c.fill > 0.5);
    const corners = [[0, 0], [w, 0], [0, h], [w, h]];
    const picked = corners.map(([X, Y]) => {
        let best = null, bd = Infinity;
        cands.forEach(c => { const d = Math.hypot(c.cx - X, c.cy - Y); if (d < bd) { bd = d; best = c; } });
        return best;
    });
    if (picked.some(p => !p) || new Set(picked).size !== 4) return null;
    const rings = picked.filter(c => c.fill < 0.85);
    if (rings.length !== 1) return null;
    const tl = rings[0];
    const others = picked.filter(c => c !== tl);
    const br = others.reduce((a, b) => Math.hypot(a.cx - tl.cx, a.cy - tl.cy) > Math.hypot(b.cx - tl.cx, b.cy - tl.cy) ? a : b);
    const [p, q] = others.filter(c => c !== br);
    const cross = (p.cx - tl.cx) * (q.cy - tl.cy) - (p.cy - tl.cy) * (q.cx - tl.cx);
    const tr = cross > 0 ? p : q, bl = cross > 0 ? q : p;
    return { TL: [tl.cx, tl.cy], TR: [tr.cx, tr.cy], BL: [bl.cx, bl.cy], BR: [br.cx, br.cy], paper };
}

// homography จากพิกัด mm บนกระดาษ -> พิกัด pixel ในภาพสแกน
function csHomography(src, dst) {
    const A = [], b = [];
    for (let i = 0; i < 4; i++) {
        const [x, y] = src[i], [u, v] = dst[i];
        A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]); b.push(u);
        A.push([0, 0, 0, x, y, 1, -v * x, -v * y]); b.push(v);
    }
    for (let c = 0; c < 8; c++) {
        let piv = c;
        for (let r = c + 1; r < 8; r++) if (Math.abs(A[r][c]) > Math.abs(A[piv][c])) piv = r;
        [A[c], A[piv]] = [A[piv], A[c]]; [b[c], b[piv]] = [b[piv], b[c]];
        for (let r = 0; r < 8; r++) {
            if (r === c) continue;
            const f = A[r][c] / A[c][c];
            for (let k = c; k < 8; k++) A[r][k] -= f * A[c][k];
            b[r] -= f * b[c];
        }
    }
    const H = b.map((v, i) => v / A[i][i]);
    return (x, y) => {
        const d = H[6] * x + H[7] * y + 1;
        return [(H[0] * x + H[1] * y + H[2]) / d, (H[3] * x + H[4] * y + H[5]) / d];
    };
}
function csSample(img, x, y) {
    const { g, w, h } = img;
    if (x < 0 || y < 0 || x >= w - 1 || y >= h - 1) return 1;
    const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0, i = y0 * w + x0;
    return g[i] * (1 - fx) * (1 - fy) + g[i + 1] * fx * (1 - fy) + g[i + w] * (1 - fx) * fy + g[i + w + 1] * fx * fy;
}
// ตัดพื้นที่สี่เหลี่ยม (หน่วย mm บนกระดาษ) ออกมาเป็นภาพตรงแนว ความละเอียด res px/mm
function csWarp(img, map, x, y, wmm, hmm, res) {
    const W = Math.round(wmm * res), H = Math.round(hmm * res);
    const out = new Float32Array(W * H);
    for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) {
        const [u, v] = map(x + (c + 0.5) / res, y + (r + 0.5) / res);
        out[r * W + c] = csSample(img, u, v);
    }
    return { g: out, w: W, h: H };
}

const CS_INSET = 1.1;
// ช่องที่ "ระบายทึบ" (บอกว่าเขียนผิด): หมึกกินพื้นที่เกินสัดส่วนนี้ของช่อง — ตัวเลขปกติกินราว 10–25%
const CS_FILLED_RATIO = 0.42;
// คืน null = ช่องว่าง, { filled: true } = ระบายทึบ, { digit, conf } = ตัวเลขที่อ่านได้
function csReadDigitBox(img, map, x, y, paper, bw = CS.BOX_W, bh = CS.BOX_H) {
    const res = 10;
    const crop = csWarp(img, map, x + CS_INSET, y + CS_INSET, bw - 2 * CS_INSET, bh - 2 * CS_INSET, res);
    const { g, w, h } = crop;
    // ความเข้มหมึกปรับตามช่อง: เทียบกับจุดเข้มสุดในช่องนั้น ปากกาลูกลื่นที่จางก็ได้เส้นต่อเนื่อง ไม่ขาดเป็นท่อนๆ
    // (ต้องตรงกับ ink_map() ใน scripts/countsheet_extract.py ที่ใช้เตรียมข้อมูลเทรน)
    const sorted = Float32Array.from(g).sort();
    const pos = 0.005 * (sorted.length - 1), lo = Math.floor(pos);
    const darkest = sorted[lo] + (sorted[Math.min(lo + 1, sorted.length - 1)] - sorted[lo]) * (pos - lo);
    const contrast = paper - darkest;
    if (contrast < 0.18) return null;
    const top = paper - contrast * 0.25;
    const ink = new Float32Array(w * h), mask = new Uint8Array(w * h);
    let inked = 0;
    for (let i = 0; i < g.length; i++) {
        ink[i] = Math.max(0, Math.min(1, (top - g[i]) / (contrast * 0.55)));
        mask[i] = ink[i] > 0.3 ? 1 : 0;
        inked += mask[i];
    }
    if (inked / (w * h) > CS_FILLED_RATIO) return { filled: true };
    const { comps, labels } = csComponents(mask, w, h, 6);
    // ทิ้งเส้นขอบช่องที่หลุดเข้ามา (ก้อนแบนยาวติดขอบภาพ) — ตัวเลขจริงไม่ค่อยมีรูปทรงแบบนี้
    const keep = new Set(comps.filter(c => {
        const touchTB = c.y0 === 0 || c.y1 === h - 1, touchLR = c.x0 === 0 || c.x1 === w - 1;
        if (touchTB && c.bh <= h * 0.15 && c.bw >= w * 0.4) return false;
        if (touchLR && c.bw <= 3 && c.bh >= h * 0.4) return false;
        return true;
    }).map(c => c.id));
    let total = 0, x0 = w, y0 = h, x1 = -1, y1 = -1;
    for (let i = 0; i < mask.length; i++) {
        if (labels[i] && !keep.has(labels[i])) { ink[i] = 0; continue; }
        if (!mask[i]) continue;
        total++;
        const cx = i % w, cy = (i - cx) / w;
        if (cx < x0) x0 = cx; if (cx > x1) x1 = cx; if (cy < y0) y0 = cy; if (cy > y1) y1 = cy;
    }
    if (total < 22 || (x1 - x0 < 3 && y1 - y0 < 8)) return null;
    const input = csCanonicalize(ink, w, h);
    if (!input) return null;
    return csPredict(input);
}

function csRowThumb(img, map, x, rowY, wmm, hmm) {
    const res = 6;
    const crop = csWarp(img, map, x, rowY, wmm, hmm, res);
    const c = document.createElement('canvas');
    c.width = crop.w; c.height = crop.h;
    const ctx = c.getContext('2d');
    const id = ctx.createImageData(crop.w, crop.h);
    for (let i = 0; i < crop.g.length; i++) { const v = Math.round(crop.g[i] * 255); id.data[i * 4] = id.data[i * 4 + 1] = id.data[i * 4 + 2] = v; id.data[i * 4 + 3] = 255; }
    ctx.putImageData(id, 0, 0);
    return c.toDataURL('image/png');
}

function csReadPage(canvas) {
    const img = csGray(canvas);
    const f = csFindFiducials(img);
    if (!f) return { error: 'หาจุดมาร์ค 4 มุมไม่เจอ (ต้องเป็นใบนับที่พิมพ์จากระบบ และสแกนให้เห็นครบทั้ง 4 มุม)' };
    const names = ['TL', 'TR', 'BL', 'BR'];
    const map = csHomography(names.map(n => CS.FIDS[n]), names.map(n => f[n]));
    const darkRatio = (x, y, w, h, res = 6) => {
        const crop = csWarp(img, map, x, y, w, h, res);
        let dark = 0;
        for (let k = 0; k < crop.g.length; k++) if (crop.g[k] < f.paper * 0.5) dark++;
        return dark / crop.g.length;
    };
    const readBits = (L) => Array.from({ length: L.BIT_COUNT }, (_, i) =>
        darkRatio(L.BITS_X + i * L.BIT_STEP + 0.6, L.BITS_Y + 0.6, L.BIT_W - 1.2, L.BIT_W - 1.2) > 0.5 ? 1 : 0);

    // แบบใหม่ (v2) มีสี่เหลี่ยมทึบที่หัวกระดาษ — ใบแบบเก่าตรงนั้นเป็นกระดาษเปล่า
    const m = CS2.MARK;
    if (darkRatio(m.x + 1, m.y + 1, m.s - 2, m.s - 2) > 0.6) {
        const id = cs2DecodeBits(readBits(CS2));
        if (!id) return { error: 'อ่านรหัสหน้ากระดาษไม่ได้ (แถบสี่เหลี่ยมใต้หัวกระดาษอาจเลอะหรือขาด)' };
        const L = CS2, rowH = cs2RowH(id.nRows), boxH = rowH - 2;
        const rows = [];
        for (let i = 0; i < id.nRows; i++) {
            const y = L.ROW_Y0 + i * rowH;
            const boxes = Array.from({ length: L.DIGITS }, (_, d) => csReadDigitBox(img, map, L.COL_DIGITS + d * L.BOX_W, y + 1, f.paper, L.BOX_W, boxH));
            const fixes = Array.from({ length: L.FIX }, (_, d) => csReadDigitBox(img, map, L.COL_FIX + d * L.BOX_W, y + 1, f.paper, L.BOX_W, boxH));
            const row = csResolveCorrections(boxes, fixes);
            const hasInk = boxes.some(Boolean) || fixes.some(Boolean);
            row.thumb = hasInk ? csRowThumb(img, map, L.COL_DIGITS - 1, y, L.COL_FIX + L.FIX * L.BOX_W - L.COL_DIGITS + 2, rowH) : null;
            rows.push(row);
        }
        return { ...id, version: 2, rows };
    }

    const id = csDecodeBits(readBits(CS));
    if (!id) return { error: 'อ่านรหัสหน้ากระดาษไม่ได้ (แถบสี่เหลี่ยมใต้หัวกระดาษอาจเลอะหรือขาด)' };
    const rows = [];
    for (let i = 0; i < CS.ROWS; i++) {
        const y = CS.ROW_Y0 + i * CS.ROW_H;
        const digits = [];
        for (let d = 0; d < CS.DIGITS; d++) digits.push(csReadDigitBox(img, map, CS.COL_DIGITS + d * CS.BOX_W, y + 1, f.paper));
        const row = csResolveCorrections(digits, []);
        row.thumb = digits.some(Boolean) ? csRowThumb(img, map, CS.COL_DIGITS - 1, y, CS.DIGITS * CS.BOX_W + 2, CS.ROW_H) : null;
        rows.push(row);
    }
    return { ...id, version: 1, rows };
}

// รวมช่องตัวเลขกับช่องแก้ไข: ช่องที่ระบายทึบ แทนด้วยตัวเลขในช่อง "แก้ไข" ตามลำดับซ้าย → ขวา
// คืน { digits: [ {digit, conf} | null ], error?: ข้อความ (ให้คนกรอกเอง), note?: ข้อความเตือนให้ตรวจ }
function csResolveCorrections(boxes, fixes) {
    const filledIdx = boxes.map((b, i) => (b && b.filled ? i : -1)).filter(i => i >= 0);
    const fixDigits = fixes.filter(f => f && !f.filled);
    if (fixes.some(f => f && f.filled)) return { digits: [], error: 'ช่องแก้ไขถูกระบายทึบ — ดูรูปแล้วกรอกเอง' };
    if (!filledIdx.length) {
        return { digits: boxes, note: fixDigits.length ? 'มีตัวเลขในช่องแก้ไข แต่ไม่มีช่องที่ระบาย — ตรวจอีกที' : null };
    }
    if (filledIdx.length > fixes.length || fixDigits.length !== filledIdx.length) {
        return { digits: [], error: `ระบายไว้ ${filledIdx.length} ช่อง แต่ช่องแก้ไขมี ${fixDigits.length} ตัว — ดูรูปแล้วกรอกเอง` };
    }
    const digits = boxes.slice();
    filledIdx.forEach((bi, k) => { digits[bi] = fixDigits[k]; });
    return { digits, note: 'มีการแก้ไขตัวเลข — ตรวจกับรูปอีกที', corrected: true };
}

const CS_MIN_CONF = 0.9;
// แจ้งข้อความอย่างเดียว (ปุ่มเดียว) — ใช้ showConfirmModal แล้วซ่อนปุ่มยกเลิก
function csNotice(message, items) {
    const p = showConfirmModal(message, false, 'รับทราบ', items);
    const cancel = document.getElementById('modalCancelBtn');
    if (cancel) cancel.style.display = 'none';
    return p;
}
async function readStockCountScan(input) {
    const files = Array.from(input.files || []);
    input.value = '';
    if (!files.length) return;
    if (!canEditProcess('Stock')) return;
    const overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'flex';
    try {
        await csLoadModel();
        const pages = await csFilesToCanvases(files);
        const results = [], errors = [];
        for (const pg of pages) {
            await new Promise(r => setTimeout(r, 0));
            const res = csReadPage(pg.canvas);
            if (res.error) errors.push(`${pg.label}: ${res.error}`); else results.push(res);
        }
        overlay.style.display = 'none';
        if (!results.length) { await csNotice('อ่านใบนับไม่ได้', errors); return; }

        // ไฟล์เดียวมีใบนับหลาย process ได้ — อ่านทุก process แล้วรวมไว้หน้าตรวจเดียว เรียงตามลำดับแท็บในหน้าสต็อก
        const byFilter = {};
        results.forEach(r => { (byFilter[r.filter] = byFilter[r.filter] || []).push(r); });
        const filters = Object.keys(CS_PROC_INDEX).filter(f => byFilter[f]);
        const warnings = [...errors];
        const prefill = {};
        const pageLabels = [];
        let offset = 0;
        filters.forEach(filter => {
            const label = countSheetLabel(filter);
            const sheetRows = buildCountSheetRows(filter);
            // ใบแบบเก่าแบ่งหน้าละ 20 แถวตายตัว ใบแบบใหม่แบ่งตามกลุ่ม (ทั้ง process แผ่นเดียว) — ต้องใช้วิธีแบ่งแบบเดียวกับตอนพิมพ์
            const chunksByVersion = { 1: csPageChunks(sheetRows), 2: cs2Paginate(sheetRows) };
            byFilter[filter].sort((x, y) => x.page - y.page).forEach(pr => {
                pageLabels.push(`${label} หน้า ${pr.page + 1}`);
                const chunks = chunksByVersion[pr.version];
                const chunk = chunks[pr.page];
                if (!chunk) { warnings.push(`${label} หน้า ${pr.page + 1}: ไม่มีหน้านี้ในรายชื่อ Model ปัจจุบันแล้ว`); return; }
                if (csRowsHash(chunk) !== pr.hash || (pr.nRows && pr.nRows !== chunk.length)) warnings.push(`${label} หน้า ${pr.page + 1}: รายชื่อ Model เปลี่ยนไปหลังพิมพ์ใบนับ — ตรวจทุกแถวให้ดี (หรือพิมพ์ใบนับใหม่)`);
                const pageStart = chunks.slice(0, pr.page).reduce((n, c) => n + c.length, 0);
                pr.rows.forEach((row, i) => {
                    if (i >= chunk.length) return;
                    const idx = offset + pageStart + i;
                    if (row.error) { prefill[idx] = { value: '', manual: true, msg: row.error, thumb: row.thumb }; return; }
                    const read = row.digits;
                    const firstIdx = read.findIndex(Boolean);
                    if (firstIdx < 0) {
                        if (row.thumb) prefill[idx] = { value: '', manual: true, msg: row.note || 'มีรอยเขียนแต่อ่านเป็นตัวเลขไม่ได้ — ดูรูปแล้วกรอกเอง', thumb: row.thumb };
                        return;
                    }
                    const lastIdx = read.length - 1 - [...read].reverse().findIndex(Boolean);
                    const gap = read.slice(firstIdx, lastIdx + 1).some(d => !d);
                    const value = read.filter(Boolean).map(d => d.digit).join('');
                    const conf = Math.min(...read.filter(Boolean).map(d => d.conf));
                    prefill[idx] = { value, uncertain: gap || conf < CS_MIN_CONF || !!row.note, msg: row.note || null, thumb: row.thumb };
                });
            });
            offset += sheetRows.length;
        });

        if (filters.length === 1 && filters[0] !== stockProcessFilter) openStockTab(filters[0]);
        const readCount = Object.keys(prefill).length;
        openStockCountEntry({ values: prefill, pages: pageLabels, filters });
        if (warnings.length) await csNotice(`อ่านได้ ${readCount} รายการ แต่มีข้อควรระวัง`, warnings);
    } catch (err) {
        console.error(err);
        overlay.style.display = 'none';
        showToast('อ่านไฟล์ไม่สำเร็จ: ' + err.message, 'error', 6000);
    }
}

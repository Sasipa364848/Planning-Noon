// === Configuration (โครงสร้างตาราง/กลุ่ม — เป็น logic การแสดงผล ไม่ใช่ข้อมูล จึงยังอยู่ฝั่ง client) ===
const processConfig = {
    BW: {
        title: "M/C Plan of BW process", hasCover: false,
        groups: [
            { id: 'bw_dg1_esd' },
            { id: 'bw_dg1', totals: [{ label: 'Total DG1 Normal', sum: ['bw_dg1_esd', 'bw_dg1'] }] },
            { id: 'bw_dg1_mini', totals: [{ label: 'Total DG1 Mini', sum: ['bw_dg1_mini'] }] },
            { id: 'bw_dg2_esd', totals: [{ label: 'Total DG2', sum: ['bw_dg2_esd'] }, { label: 'Grand Total', sum: ['bw_dg1_esd', 'bw_dg1', 'bw_dg1_mini', 'bw_dg2_esd'], isGrand: true }] }
        ]
    },
    LC: {
        title: "M/C Plan of LC process", hasCover: false,
        groups: [
            { id: 'lc_std_normal' },
            { id: 'lc_std_mini', totals: [{ label: 'Total Standard', sum: ['lc_std_normal', 'lc_std_mini'] }] },
            { id: 'lc_low_normal' },
            { id: 'lc_low_mini', totals: [{ label: 'Total Low', sum: ['lc_low_normal', 'lc_low_mini'] }, { label: 'Total DG1', sum: ['lc_std_normal', 'lc_std_mini', 'lc_low_normal', 'lc_low_mini'], isDg1: true }] },
            { id: 'lc_dg2', totals: [{ label: 'Total DG2', sum: ['lc_dg2'] }, { label: 'Grand Total', sum: ['lc_std_normal', 'lc_std_mini', 'lc_low_normal', 'lc_low_mini', 'lc_dg2'], isGrand: true }] }
        ]
    },
    CW: {
        title: "M/C Plan of CW process", hasCover: true,
        groups: [
            { id: 'cw_dg1_normal', totals: [{ isGroupTotal: true, sum: ['cw_dg1_normal'] }] },
            { id: 'cw_dg1_mini', totals: [{ isGroupTotal: true, sum: ['cw_dg1_mini'] }] },
            { id: 'cw_new_type_1', totals: [{ isGroupTotal: true, sum: ['cw_new_type_1'] }] },
            { id: 'cw_new_type_2', totals: [{ isGroupTotal: true, sum: ['cw_new_type_2'] }] },
            { id: 'cw_dg2_esd', totals: [{ label: 'Total', sum: ['cw_dg2_esd'] }, { label: 'Grand Total', sum: ['cw_dg1_normal', 'cw_dg1_mini', 'cw_new_type_1', 'cw_new_type_2', 'cw_dg2_esd'], isGrand: true }] }
        ]
    }
};

const ALL_GROUP_IDS = Object.values(processConfig).flatMap(cfg => cfg.groups.map(g => g.id));
const blueModels = ['G2', 'X2', 'S2', 'E4', 'W4', 'A2', 'F2', 'Y2', 'Z2', 'C2', 'E4 (DSTC)', 'E4 (DSS2)', 'Z1 (DSSI)', 'Z2 (DSTC)'];
const chartColors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#3b82f6', '#a855f7', '#84cc16', '#f97316', '#0ea5e9', '#d946ef', '#22c55e'];

// === Global State ===
let currentProcess = 'Stock';
let viewDays = 7;
// currentUser: null (ไม่ได้ login) หรือ {username, role: 'admin'|'process', processes: ['BW'|'LC'|'CW'|'Stock', ...]}
let currentUser = JSON.parse(sessionStorage.getItem('master_plan_user') || 'null');
let sessionPassword = sessionStorage.getItem('master_plan_pwd') || '';
let isAdmin = !!currentUser && currentUser.role === 'admin'; // ชื่อเดิมคงไว้ตามจุดที่ใช้ทั่วโค้ด = สิทธิ์ admin เต็ม (แก้ไขได้ทุกอย่าง)
let userProcesses = currentUser ? (currentUser.processes || []) : []; // process ที่ user แบบจำกัดสิทธิ์แก้ไขได้ เช่น ['BW'] หรือ ['Stock']
function canEditProcess(proc) { return isAdmin || userProcesses.includes(proc); }
let isDirty = false;
let chartInstances = {};
let pollTimer = null;

// ข้อมูลจริงทั้งหมดโหลดมาจาก server (แทน localStorage เดิม) — ดูฟังก์ชัน loadStateFromServer()
let modelState = {}, groupLabels = {}, cellData = {}, cellComments = {}, coverData = {}, coverColors = {}, revData = {}, groupParams = {}, hrsData = {}, timestamps = {}, lastEditor = {}, changeLog = [], announcements = [], stockData = {}, sourceMap = {}, plannedUsedData = {}, coverCodeColors = {};
// process ก่อนหน้าที่แต่ละ process ใช้วัตถุดิบมาจาก (LC มาจาก BW, CW ใช้ mat เดียวกับ LC แค่สวม cover ต่าง) — BW เป็นต้นทาง ไม่มี source
const PRECEDING_PROCESS = { LC: 'BW', CW: 'LC' };
let knownMaxSeq = null; // ใช้เทียบว่ามี log การอัปเดตใหม่เข้ามาระหว่างที่เราเปิดหน้านี้ค้างไว้หรือไม่
let lastSeenSeq = parseInt(localStorage.getItem('master_plan_last_seen_seq') || '0', 10);
let hideEmptyModels = localStorage.getItem('master_plan_hide_empty') === 'true';
let stockProcessFilter = 'All';

function setStockProcessFilter(proc, btn) {
    stockProcessFilter = proc;
    document.querySelectorAll('#stockProcessFilterGroup .toggle-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderStockPage();
}

function getParams(groupId) { return groupParams[groupId] || { oa: 80, mct: 2.5 }; }

// === ปุ่ม "ซ่อน Model ว่าง" บนหน้าจอปกติ (ไม่ใช่แค่ตอนพิมพ์) ===
function toggleHideEmptyModels() {
    hideEmptyModels = !hideEmptyModels;
    localStorage.setItem('master_plan_hide_empty', String(hideEmptyModels));
    updateHideEmptyBtnUI();
    if (currentProcess === 'Stock') renderStockPage();
    else if (currentProcess !== 'Overview') generateTable();
}
function updateHideEmptyBtnUI() {
    const btn = document.getElementById('hideEmptyBtn');
    if (btn) btn.classList.toggle('active', hideEmptyModels);
}

function calcPcs(mc, oa, mct, hrs) {
    if (!mc || mc <= 0 || mct <= 0 || hrs <= 0) return 0;
    let basePcs = (hrs * 3600) / mct;
    return Math.round(mc * (basePcs * (oa / 100)));
}

function formatDateHeader(date) { return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).replace(/ /g, '-'); }

// แยกชื่อโมเดล ("G3 (DSTC)") ออกเป็นชื่อหลัก ("G3") + ชนิด/ทูลลิ่ง ("DSTC") เพื่อโชว์แยกกันให้ดูสะอาดตา
// ตัดเฉพาะวงเล็บตัวสุดท้ายที่มีช่องว่างนำหน้า จึงไม่กระทบกับ "(Brown)"/"(Green)" ที่ติดชื่อแบบไม่มีช่องว่าง (ใช้แยกสีข้อความอยู่แล้ว)
function parseModelDisplay(fullName) {
    const m = fullName.match(/^(.*)\s\(([^)]+)\)$/);
    return m ? { base: m[1], variant: m[2] } : { base: fullName, variant: '' };
}

// รายชื่อโมเดลทั้งหมดของ process หนึ่ง (รวมทุกกลุ่ม) พร้อมชื่อกลุ่ม ไว้ใช้สร้าง dropdown เลือกแหล่งวัตถุดิบ
function getModelsForProcess(proc) {
    const list = [];
    processConfig[proc].groups.forEach(g => {
        (modelState[g.id] || []).forEach(m => list.push({ group: (groupLabels[g.id] || g.id).replace(/<br>/g, ' '), model: m }));
    });
    return list;
}

// ไล่สาย "แหล่งวัตถุดิบต้นทาง" ของโมเดลหนึ่ง ย้อนขึ้นไปสูงสุด 2 ชั้น เช่น CW -> LC -> BW
// คืนค่าเป็น array [{proc, model}, {proc, model, ratio}, ...] เรียงจากตัวเองไปหาต้นทาง
function resolveSourceChain(proc, model) {
    const chain = [{ proc, model }];
    let curProc = proc, curModel = model;
    for (let i = 0; i < 2; i++) {
        const entry = sourceMap[`${curProc}_${curModel}`];
        if (!entry || !entry.srcModel) break;
        chain.push({ proc: entry.srcProc, model: entry.srcModel, ratio: entry.ratio || 1 });
        curProc = entry.srcProc; curModel = entry.srcModel;
    }
    return chain;
}

// === จัดการแหล่งวัตถุดิบ (BOM) — เฉพาะ Admin, รวมทุกโมเดล LC/CW ไว้จัดการที่เดียว ===
function openManageBom() {
    if (!isAdmin) return;
    const targets = [];
    ['LC', 'CW'].forEach(proc => {
        processConfig[proc].groups.forEach(g => {
            (modelState[g.id] || []).forEach(m => targets.push({ proc, model: m }));
        });
    });
    renderManageBomModal(targets);
}

function renderManageBomModal(targets) {
    const root = document.getElementById('modalRoot');
    const rowsHtml = targets.map(t => {
        const key = `${t.proc}_${t.model}`;
        const srcProc = PRECEDING_PROCESS[t.proc];
        const options = getModelsForProcess(srcProc);
        const groups = [...new Set(options.map(o => o.group))];
        const current = sourceMap[key];
        // ถ้าเคยตั้งไว้แต่ชื่อโมเดลต้นทางถูกเปลี่ยน/ลบไปแล้ว (เช่นไปแก้ชื่อผ่าน Edit Model) จะหาใน options ไม่เจอ ต้องเตือนแยกจาก "ยังไม่เคยตั้ง"
        const isStale = current && !options.some(o => o.model === current.srcModel);
        const optionsHtml = groups.map(grp => `
            <optgroup label="${grp}">
                ${options.filter(o => o.group === grp).map(o => `<option value="${o.model}" ${current && current.srcModel === o.model ? 'selected' : ''}>${o.model}</option>`).join('')}
            </optgroup>`).join('');
        return `
            <tr class="${!current ? 'bom-row-unmapped' : isStale ? 'bom-row-stale' : ''}" data-key="${key}">
                <td style="font-size:12px; color:var(--text-secondary);">${t.proc}</td>
                <td class="col-model" style="font-weight:600;">${t.model}</td>
                <td>
                    ${isStale ? `<div style="font-size:11px; color:#b45309; margin-bottom:4px;"><i class="fas fa-triangle-exclamation"></i> เดิมชี้ไป "${current.srcModel}" ซึ่งไม่พบแล้ว (ถูกเปลี่ยนชื่อ/ลบ) กรุณาเลือกใหม่</div>` : ''}
                    <div style="display:flex; gap:6px; align-items:center;">
                        <select class="bom-source-select" onchange="updateBomMapping('${key}', '${srcProc}', this)" style="flex:1;">
                            <option value="">— ไม่ระบุ —</option>
                            ${optionsHtml}
                        </select>
                        <button class="bom-copy-btn" onclick="copyFromRowAbove(this)" title="ใช้ค่าจากแถวบน"><i class="fas fa-arrow-up"></i></button>
                    </div>
                </td>
                <td><input type="number" class="bom-ratio-input" min="0.01" step="0.01" value="${current ? current.ratio : 1}" onchange="updateBomRatio('${key}', this)" style="width:70px;"></td>
            </tr>`;
    }).join('');
    root.innerHTML = `
        <div class="modal-overlay" id="modalOverlay">
            <div class="modal-box modal-box-wide">
                <h3><i class="fas fa-diagram-project"></i> จัดการแหล่งวัตถุดิบ (BOM)</h3>
                <p style="font-size:12px; color:var(--text-secondary); margin:-8px 0 12px;">LC มาจาก BW, CW ใช้ mat เดียวกับ LC (สวม Cover ต่าง) — แถวสีส้มคือยังไม่ได้กำหนดแหล่งที่มา</p>
                <div style="max-height:55vh; overflow-y:auto;">
                    <table class="user-mgmt-table bom-table">
                        <thead><tr><th>Process</th><th>Model</th><th>แหล่งจาก</th><th>อัตราส่วน</th></tr></thead>
                        <tbody>${rowsHtml}</tbody>
                    </table>
                </div>
                <div class="modal-actions" style="margin-top:16px;">
                    <button class="modal-btn modal-btn-confirm" onclick="closeModal()">เสร็จสิ้น</button>
                </div>
            </div>
        </div>`;
    document.getElementById('modalOverlay').onclick = (e) => { if (e.target.id === 'modalOverlay') closeModal(); };
}

function updateBomMapping(key, srcProc, selectEl) {
    const val = selectEl.value;
    const tr = selectEl.closest('tr');
    if (!val) { delete sourceMap[key]; tr.classList.add('bom-row-unmapped'); tr.classList.remove('bom-row-stale'); }
    else {
        const ratioInp = tr.querySelector('.bom-ratio-input');
        sourceMap[key] = { srcProc, srcModel: val, ratio: parseFloat(ratioInp.value) || 1 };
        tr.classList.remove('bom-row-unmapped', 'bom-row-stale');
        const warnDiv = tr.querySelector('td div[style*="triangle-exclamation"]');
        if (warnDiv) warnDiv.remove();
    }
    markKeyDirty('sourceMap', key);
}

// คัดลอกแหล่งที่มา + อัตราส่วนจากแถวบนติดกัน มาใส่แถวนี้ — เร็วขึ้นตอนกรอกหลายโมเดลที่มาจากต้นทางเดียวกัน (เช่น G2/G2-Brown/X2_Auto มาจาก LC ตัวเดียวกัน)
function copyFromRowAbove(btn) {
    const tr = btn.closest('tr');
    const prevTr = tr.previousElementSibling;
    if (!prevTr) { showToast('ไม่มีแถวด้านบนให้คัดลอก', 'error'); return; }
    const prevSelect = prevTr.querySelector('.bom-source-select');
    if (!prevSelect || !prevSelect.value) { showToast('แถวบนยังไม่ได้กำหนดแหล่งที่มา', 'error'); return; }
    const select = tr.querySelector('.bom-source-select');
    const hasOption = Array.from(select.options).some(o => o.value === prevSelect.value);
    if (!hasOption) { showToast('แถวบนอยู่คนละกลุ่ม process ต้นทาง คัดลอกไม่ได้', 'error'); return; }
    const prevRatio = prevTr.querySelector('.bom-ratio-input');
    tr.querySelector('.bom-ratio-input').value = prevRatio.value;
    select.value = prevSelect.value;
    select.dispatchEvent(new Event('change'));
}

function updateBomRatio(key, inputEl) {
    if (!sourceMap[key]) return; // ยังไม่ได้เลือกแหล่งที่มา ยังไม่ต้องมีอัตราส่วน
    sourceMap[key].ratio = parseFloat(inputEl.value) || 1;
    markKeyDirty('sourceMap', key);
}

// ตั้งชื่อโมเดลแบบแยก 2 ช่อง (ชื่อหลัก + ชนิด/ทูลลิ่ง เช่น DSS2, EK, DSTC, Auto) — คืนค่า {base, variant} หรือ null ถ้ายกเลิก
// ส่วนแหล่งวัตถุดิบย้ายไปจัดการรวมที่เดียวที่เมนู "จัดการแหล่งวัตถุดิบ (BOM)" แทน (openManageBom)
function showModelNameModal(title, defaultBase = '', defaultVariant = '') {
    return new Promise(resolve => {
        const root = document.getElementById('modalRoot');
        root.innerHTML = `
            <div class="modal-overlay" id="modalOverlay">
                <div class="modal-box">
                    <h3>${title}</h3>
                    <input type="text" id="modelBaseInput" placeholder="ชื่อโมเดล เช่น G3" style="margin-bottom:10px;">
                    <input type="text" id="modelVariantInput" placeholder="ชนิด/ทูลลิ่ง (ถ้ามี) เช่น DSS2, EK, DSTC, Auto">
                    <div class="modal-actions" style="margin-top:16px;">
                        <button class="modal-btn modal-btn-cancel" id="modalCancelBtn">ยกเลิก</button>
                        <button class="modal-btn modal-btn-confirm" id="modalConfirmBtn">บันทึก</button>
                    </div>
                </div>
            </div>`;
        const baseInp = document.getElementById('modelBaseInput');
        const variantInp = document.getElementById('modelVariantInput');
        baseInp.value = defaultBase; variantInp.value = defaultVariant;
        baseInp.focus(); baseInp.select();
        const finish = (val) => { closeModal(); resolve(val); };
        const submit = () => finish({ base: baseInp.value.trim(), variant: variantInp.value.trim() });
        document.getElementById('modalConfirmBtn').onclick = submit;
        document.getElementById('modalCancelBtn').onclick = () => finish(null);
        document.getElementById('modalOverlay').onclick = (e) => { if (e.target.id === 'modalOverlay') finish(null); };
        [baseInp, variantInp].forEach(inp => inp.onkeydown = (e) => {
            if (e.key === 'Escape') finish(null);
            if (e.key === 'Enter') submit();
        });
    });
}

// === Toast & Modal (แทน alert/prompt/confirm ของเบราว์เซอร์ ให้ดูทันสมัยขึ้น) ===
function showToast(message, type = 'info', duration = 3500) {
    const container = document.getElementById('toastContainer');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    const icon = type === 'success' ? 'fa-circle-check' : type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-info';
    el.innerHTML = `<i class="fas ${icon}"></i><span></span>`;
    el.querySelector('span').innerText = message;
    container.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = 'opacity 0.3s'; setTimeout(() => el.remove(), 300); }, duration);
}

function closeModal() { document.getElementById('modalRoot').innerHTML = ''; }

function showPromptModal(title, defaultValue = '', options = {}) {
    const { password = false, confirmLabel = 'ตกลง', multiline = false } = options;
    return new Promise(resolve => {
        const root = document.getElementById('modalRoot');
        const fieldHtml = multiline
            ? `<textarea id="modalInput" rows="4" style="width:100%; padding:10px 12px; border:1px solid #dfe4ea; border-radius:10px; font-family:inherit; font-size:14px; outline:none; margin-bottom:16px; box-sizing:border-box; resize:vertical;"></textarea>`
            : `<input type="${password ? 'password' : 'text'}" id="modalInput" autocomplete="off">`;
        root.innerHTML = `
            <div class="modal-overlay" id="modalOverlay">
                <div class="modal-box">
                    <h3></h3>
                    ${fieldHtml}
                    <div class="modal-actions">
                        <button class="modal-btn modal-btn-cancel" id="modalCancelBtn">ยกเลิก</button>
                        <button class="modal-btn modal-btn-confirm" id="modalConfirmBtn"></button>
                    </div>
                </div>
            </div>`;
        root.querySelector('h3').innerText = title;
        root.querySelector('#modalConfirmBtn').innerText = confirmLabel;
        const input = document.getElementById('modalInput');
        input.value = defaultValue || '';
        input.focus();
        if (!multiline && input.select) input.select();
        const finish = (val) => { closeModal(); resolve(val); };
        document.getElementById('modalConfirmBtn').onclick = () => finish(input.value);
        document.getElementById('modalCancelBtn').onclick = () => finish(null);
        document.getElementById('modalOverlay').onclick = (e) => { if (e.target.id === 'modalOverlay') finish(null); };
        input.onkeydown = (e) => {
            if (e.key === 'Escape') finish(null);
            if (e.key === 'Enter' && !multiline) finish(input.value);
            if (e.key === 'Enter' && multiline && e.ctrlKey) finish(input.value);
        };
    });
}

function showConfirmModal(message, danger = false, confirmLabel = 'ยืนยัน') {
    return new Promise(resolve => {
        const root = document.getElementById('modalRoot');
        root.innerHTML = `
            <div class="modal-overlay" id="modalOverlay">
                <div class="modal-box">
                    <h3></h3>
                    <div class="modal-actions">
                        <button class="modal-btn modal-btn-cancel" id="modalCancelBtn">ยกเลิก</button>
                        <button class="modal-btn ${danger ? 'modal-btn-danger' : 'modal-btn-confirm'}" id="modalConfirmBtn"></button>
                    </div>
                </div>
            </div>`;
        root.querySelector('h3').innerText = message;
        root.querySelector('#modalConfirmBtn').innerText = confirmLabel;
        const finish = (val) => { closeModal(); resolve(val); };
        document.getElementById('modalConfirmBtn').onclick = () => finish(true);
        document.getElementById('modalCancelBtn').onclick = () => finish(false);
        document.getElementById('modalOverlay').onclick = (e) => { if (e.target.id === 'modalOverlay') finish(false); };
    });
}

// login แบบระบุ username + password (แทนรหัสผ่านเดียวใช้ร่วมกันแบบเดิม) — คืนค่า {username, password} หรือ null ถ้ายกเลิก
function showLoginModal() {
    return new Promise(resolve => {
        const root = document.getElementById('modalRoot');
        root.innerHTML = `
            <div class="modal-overlay" id="modalOverlay">
                <div class="modal-box">
                    <h3>เข้าสู่ระบบ</h3>
                    <input type="text" id="loginUsernameInput" placeholder="ชื่อผู้ใช้" autocomplete="off" style="margin-bottom:10px;">
                    <input type="password" id="loginPasswordInput" placeholder="รหัสผ่าน" autocomplete="off">
                    <div class="modal-actions">
                        <button class="modal-btn modal-btn-cancel" id="modalCancelBtn">ยกเลิก</button>
                        <button class="modal-btn modal-btn-confirm" id="modalConfirmBtn">เข้าสู่ระบบ</button>
                    </div>
                </div>
            </div>`;
        const userInp = document.getElementById('loginUsernameInput');
        const pwdInp = document.getElementById('loginPasswordInput');
        userInp.focus();
        const finish = (val) => { closeModal(); resolve(val); };
        const submit = () => finish({ username: userInp.value.trim(), password: pwdInp.value });
        document.getElementById('modalConfirmBtn').onclick = submit;
        document.getElementById('modalCancelBtn').onclick = () => finish(null);
        document.getElementById('modalOverlay').onclick = (e) => { if (e.target.id === 'modalOverlay') finish(null); };
        [userInp, pwdInp].forEach(inp => inp.onkeydown = (e) => {
            if (e.key === 'Escape') finish(null);
            if (e.key === 'Enter') submit();
        });
    });
}

// === Dirty / Save tracking ===
function markDirty() { isDirty = true; updateSaveButtonUI(); }

// เก็บว่า "key ไหนของ object ไหน" ถูกแก้จริงบ้างตั้งแต่เซฟครั้งล่าสุด — ใช้สร้าง patch ตอนบันทึก
// ส่งเฉพาะ key ที่แก้จริงไปทับที่ server (ไม่ใช่ก้อนข้อมูลทั้งหมด) กันปัญหา 2 คนบันทึกพร้อมกันแล้วข้อมูลของอีกฝ่ายหาย
// เพราะเครื่องที่ถือข้อมูลเก่ากว่าจะไม่มีทางไปทับ key ที่ตัวเองไม่ได้แตะเลย
let dirtyKeys = {}; // { cellData: Set(['BW_G3_25-Aug']), stockData: Set([...]), announcements: true, ... }
function markKeyDirty(objName, key) {
    if (!dirtyKeys[objName]) dirtyKeys[objName] = new Set();
    dirtyKeys[objName].add(key);
    markDirty();
}
// สร้าง patch {key: value} จาก object ปัจจุบันเทียบกับ key ที่ถูกแก้ไข — key ที่ถูกลบไปแล้ว (ไม่มีใน object แล้ว) ส่งเป็น null บอก server ให้ลบทิ้ง
function buildKeyPatch(sourceObj, keySet) {
    if (!keySet || keySet.size === 0) return undefined;
    const patch = {};
    keySet.forEach(k => { patch[k] = (k in sourceObj) ? sourceObj[k] : null; });
    return patch;
}

function updateSaveButtonUI() {
    const btn = document.getElementById('saveBtn');
    if (!btn) return;
    btn.disabled = !isDirty;
    btn.classList.toggle('dirty', isDirty);
}

async function saveToServer() {
    if (!currentUser || !isDirty) return;
    const btn = document.getElementById('saveBtn');
    const originalHtml = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> กำลังบันทึก...';
    // ส่งเฉพาะ key ที่แก้ไขจริงตั้งแต่เซฟครั้งล่าสุด (patch) ไม่ใช่ก้อนข้อมูลทั้งหมด — กันไปทับข้อมูลที่คนอื่นเพิ่งเซฟไว้ก่อนหน้า
    const patch = {};
    const PATCH_SOURCES = {
        modelState, groupLabels, cellData, cellComments, coverData, coverColors,
        coverCodeColors, revData, groupParams, hrsData, stockData, sourceMap, plannedUsedData
    };
    Object.keys(PATCH_SOURCES).forEach(objName => {
        const p = buildKeyPatch(PATCH_SOURCES[objName], dirtyKeys[objName]);
        if (p) patch[objName] = p;
    });
    if (dirtyKeys.announcements) patch.announcements = announcements; // เป็น array ไม่ใช่ {key:value} ส่งทั้งก้อน (แก้ได้แค่ Admin คนเดียวอยู่แล้ว)
    try {
        const res = await fetch('/api/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: currentUser.username,
                password: sessionPassword,
                editor: currentUser.username,
                process: currentProcess,
                state: patch
            })
        });
        const data = await res.json();
        if (data.ok) {
            isDirty = false;
            dirtyKeys = {};
            timestamps[currentProcess] = data.timestamp;
            lastEditor[currentProcess] = currentUser.username;
            if (data.changeEntry) {
                changeLog.push(data.changeEntry);
                if (knownMaxSeq !== null) knownMaxSeq = data.changeEntry.seq; // กันไม่ให้เด้งแจ้งเตือนซ้ำหาตัวเองตอน poll รอบถัดไป
                renderBellPanel();
            }
            updateTimestampUI();
            showToast(data.notified ? 'บันทึกสำเร็จ และแจ้งเตือนเข้า Teams แล้ว ✓' : 'บันทึกสำเร็จ ✓', 'success');
        } else {
            showToast(data.error || 'บันทึกไม่สำเร็จ', 'error');
            if (res.status === 401) { forceLogout(); }
        }
    } catch (e) {
        showToast('เชื่อมต่อ server ไม่ได้: ' + e.message, 'error');
    } finally {
        btn.innerHTML = originalHtml;
        updateSaveButtonUI();
    }
}

function forceLogout() {
    currentUser = null; isAdmin = false; userProcesses = []; sessionPassword = '';
    sessionStorage.removeItem('master_plan_user');
    sessionStorage.removeItem('master_plan_pwd');
    updateAdminUI();
    rerenderCurrentView();
}

// เรียก render function ที่ถูกต้องตามหน้าที่กำลังเปิดอยู่ (Overview/Stock/ตาราง BW-LC-CW)
// รวมไว้ที่เดียวกันไม่ให้พลาดเวลาเพิ่มหน้าใหม่ในอนาคต (บั๊กเดิม: ลืมเช็ค 'Stock' แล้วดันไปเรียก generateTable()
// ซึ่ง crash เพราะ processConfig['Stock'] ไม่มีจริง ทำให้ error หลุดไปโผล่เป็น "เชื่อมต่อ server ไม่ได้" ที่ผิดจุด)
function rerenderCurrentView() {
    if (currentProcess === 'Overview') renderOverview();
    else if (currentProcess === 'Stock') { renderStockPage(); renderAnnouncements(); }
    else generateTable();
}

// === Server sync ===
async function loadStateFromServer() {
    try {
        const res = await fetch('/api/state');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        modelState = data.modelState; groupLabels = data.groupLabels; cellData = data.cellData;
        cellComments = data.cellComments || {};
        coverData = data.coverData; coverColors = data.coverColors; revData = data.revData;
        groupParams = data.groupParams; hrsData = data.hrsData; timestamps = data.timestamps;
        lastEditor = data.lastEditor || {};
        changeLog = data.changeLog || [];
        announcements = data.announcements || [];
        stockData = data.stockData || {};
        sourceMap = data.sourceMap || {};
        plannedUsedData = data.plannedUsedData || {};
        coverCodeColors = data.coverCodeColors || {};
        if (currentProcess === 'Stock') renderAnnouncements();
        updateViewerCountUI(data.viewerCount);

        if (knownMaxSeq !== null) {
            const newEntries = changeLog.filter(e => e.seq > knownMaxSeq);
            // ถ้ามีหลายอัปเดตเข้ามาพร้อมกัน (เช่นตอนเปิดแท็บทิ้งไว้นาน) รวมเป็น toast เดียวแทนเด้งซ้อนกันหลายอัน
            if (newEntries.length > 1) {
                const procs = [...new Set(newEntries.map(e => e.process))].join(', ');
                showToast(`🔔 มี ${newEntries.length} การอัปเดตใหม่ (${procs})`, 'info', 6000);
                playPingSound();
            } else {
                newEntries.forEach(notifyUpdate);
            }
        }
        knownMaxSeq = changeLog.length > 0 ? Math.max(...changeLog.map(e => e.seq)) : 0;
        renderBellPanel();

        updateConnUI(true);
        return true;
    } catch (e) {
        updateConnUI(false);
        return false;
    }
}

// แจ้งเตือนในเว็บเองเมื่อมีคนกดบันทึกข้อมูล (ทดแทน Teams ที่บริษัทปิดสิทธิ์สร้าง Workflow ไว้)
// ทุกคนที่เปิดหน้าเว็บค้างไว้จะเห็น toast + ได้ยินเสียงภายในรอบ poll ถัดไป (สูงสุด ~15 วินาที)
// ระบุชัดเจนว่า process ไหน model อะไรบ้างที่ถูกอัปเดต
function notifyUpdate(entry) {
    const modelsText = entry.models.length > 0
        ? entry.models.slice(0, 3).join(', ') + (entry.models.length > 3 ? ` +${entry.models.length - 3}` : '')
        : 'มีการอัปเดตข้อมูล';
    showToast(`🔔 ${entry.process}: ${modelsText} โดย ${entry.editor}`, 'info', 6000);
    playPingSound();
}

function playPingSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator(); const g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(880, ctx.currentTime);
        g.gain.setValueAtTime(0.15, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        o.connect(g); g.connect(ctx.destination);
        o.start(); o.stop(ctx.currentTime + 0.35);
    } catch (e) { /* บาง browser บล็อกเสียงถ้ายังไม่มี interaction ใดๆ ในหน้านี้เลย ข้ามไปเงียบๆ */ }
}

// === Notification bell panel ===
function renderBellPanel() {
    const badge = document.getElementById('bellBadge');
    const list = document.getElementById('bellPanelList');
    if (!badge || !list) return;

    const unread = changeLog.filter(e => e.seq > lastSeenSeq).length;
    if (unread > 0) { badge.style.display = 'flex'; badge.innerText = unread > 99 ? '99+' : unread; }
    else { badge.style.display = 'none'; }

    if (changeLog.length === 0) {
        list.innerHTML = '<div class="bell-empty">ยังไม่มีการอัปเดต</div>';
        return;
    }
    const recent = [...changeLog].sort((a, b) => b.seq - a.seq).slice(0, 30);
    list.innerHTML = recent.map(e => `
        <div class="bell-item">
            <span class="bell-proc">${e.process}</span>
            <div class="bell-models">${e.models.length > 0 ? e.models.join(', ') : 'มีการอัปเดตข้อมูล'}</div>
            <div class="bell-meta">โดย ${e.editor} • ${e.time}</div>
        </div>
    `).join('');
}

function toggleBellPanel() {
    const panel = document.getElementById('bellPanel');
    const isOpen = panel.style.display !== 'none';
    panel.style.display = isOpen ? 'none' : 'block';
    if (!isOpen) {
        renderBellPanel();
        if (changeLog.length > 0) lastSeenSeq = Math.max(...changeLog.map(e => e.seq));
        localStorage.setItem('master_plan_last_seen_seq', String(lastSeenSeq));
        document.getElementById('bellBadge').style.display = 'none';
    }
}

document.addEventListener('click', (e) => {
    const wrap = document.querySelector('.bell-wrap');
    const panel = document.getElementById('bellPanel');
    if (wrap && panel && panel.style.display !== 'none' && !wrap.contains(e.target)) {
        panel.style.display = 'none';
    }
});

function toggleMoreMenu() {
    const panel = document.getElementById('moreMenuPanel');
    panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
}

document.addEventListener('click', (e) => {
    const wrap = document.querySelector('.more-menu-wrap');
    const panel = document.getElementById('moreMenuPanel');
    if (wrap && panel && panel.style.display !== 'none' && !wrap.contains(e.target)) {
        panel.style.display = 'none';
    }
});

function updateConnUI(ok) {
    const dot = document.getElementById('syncDot'); const txt = document.getElementById('syncStatusTxt');
    if (!dot) return;
    dot.classList.toggle('offline', !ok);
    txt.innerText = ok ? ('ซิงค์ล่าสุด ' + new Date().toLocaleTimeString('th-TH')) : 'ขาดการเชื่อมต่อ server';
}

function startPolling() {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(async () => {
        sendHeartbeat();
        if (isDirty) return; // มีงานที่ยังไม่บันทึก ไม่ดึงข้อมูลใหม่มาทับ
        const ok = await loadStateFromServer();
        if (ok) { if (currentProcess === 'Overview') renderOverview(); else if (currentProcess === 'Stock') { renderStockPage(); renderAnnouncements(); } else generateTable(); }
    }, 15000);
}

// === Core Application Routing ===
function handleDateChange() {
    if (currentProcess === 'Overview') renderOverview();
    else if (currentProcess === 'Stock') renderStockPage();
    else generateTable();
}

function switchProcess(process) {
    currentProcess = process;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tabBtn-${process}`).classList.add('active');

    const dateStr = document.getElementById('startDatePicker').value;
    const d = new Date(dateStr);
    document.getElementById('headerDisplayDate').innerText = formatDateHeader(d) + "-" + (d.getFullYear() + '').substring(2);

    // ซ่อนทุก container ก่อน แล้วค่อยเปิดเฉพาะอันที่ตรงกับ process นี้
    document.getElementById('overviewContainer').style.display = 'none';
    document.getElementById('announcementsCard').style.display = 'none';
    document.getElementById('tableContainer').style.display = 'none';
    document.getElementById('stockContainer').style.display = 'none';
    document.getElementById('viewToggleGroup').style.display = 'none';
    document.getElementById('revContainer').style.display = 'none';
    document.getElementById('printRevArea').style.display = 'none';
    document.getElementById('searchInput').style.display = 'none';
    document.getElementById('exportCsvBtn').style.display = 'none';
    document.getElementById('hideEmptyBtn').style.display = 'none';

    if (process === 'Overview') {
        // ไม่มีแท็บให้กดเข้าหน้านี้แล้ว (ย้ายไปรวมกับ Stock เป็นหน้าหลักแทน) — คงฟังก์ชันไว้เผื่อใช้งานภายหลัง เช่น โหมดจอรวม
        document.getElementById('pageTitle').innerHTML = `<i class="fas fa-chart-pie"></i> Daily Overview Dashboard`;
        document.getElementById('printTitle').innerText = `Daily Overview Dashboard`;
        document.getElementById('overviewContainer').style.display = 'flex';
        renderOverview();
    } else if (process === 'Stock') {
        document.getElementById('pageTitle').innerHTML = `<i class="fas fa-house"></i> Home — Inventory & Production Overview`;
        document.getElementById('printTitle').innerText = `Home — Inventory & Production Overview`;
        document.getElementById('stockContainer').style.display = 'block';
        document.getElementById('searchInput').style.display = 'inline-block';
        document.getElementById('searchInput').value = '';
        document.getElementById('hideEmptyBtn').style.display = 'flex';
        updateStockProblemsOnlyBtnUI();
        renderStockPage();
        renderAnnouncements();
    } else {
        document.getElementById('pageTitle').innerHTML = `<i class="fas fa-industry"></i> ${processConfig[process].title}`;
        document.getElementById('printTitle').innerText = processConfig[process].title;
        document.getElementById('tableContainer').style.display = 'block';
        document.getElementById('viewToggleGroup').style.display = 'flex';
        document.getElementById('revContainer').style.display = 'flex';
        document.getElementById('printRevArea').style.display = 'inline';
        document.getElementById('searchInput').style.display = 'inline-block';
        document.getElementById('searchInput').value = '';
        document.getElementById('exportCsvBtn').style.display = 'flex';
        document.getElementById('hideEmptyBtn').style.display = 'flex';

        document.getElementById('revInput').value = revData[process] || '00';
        document.getElementById('printRevTxt').innerText = revData[process] || '00';
        updateTimestampUI();
        generateTable();
    }
    updateAdminUI();
}

// === Dashboard Overview Functions ===
// นับตัวเลขไล่ขึ้นจาก 0 ถึงค่าจริงแบบ ease-out ให้หน้า Overview ดูมีชีวิตชีวาขึ้นตอนโหลด/เปลี่ยนวันที่
function animateCountUp(el, target, decimals = 1, duration = 600) {
    if (!el) return;
    const startTime = performance.now();
    function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.innerText = (target * eased).toFixed(decimals);
        if (progress < 1) requestAnimationFrame(tick);
        else el.innerText = target.toFixed(decimals);
    }
    requestAnimationFrame(tick);
}

// รวมจำนวนเครื่องทั้งหมดของ process ในวันที่กำหนด (ใช้ทั้งวันหลักและวันที่เอาไว้เทียบเทรนด์)
function computeGrandTotalMC(proc, dateKey) {
    let total = 0;
    processConfig[proc].groups.forEach(g => {
        (modelState[g.id] || []).forEach(m => {
            const v = parseFloat(cellData[`${proc}_${m}_${dateKey}`]);
            if (!isNaN(v) && v > 0) total += v;
        });
    });
    return total;
}

function trendCompareHtml(current, previous, label) {
    if (previous <= 0 || current <= 0) return '';
    const diffPct = ((current - previous) / previous) * 100;
    const cls = diffPct > 0.5 ? 'trend-up' : diffPct < -0.5 ? 'trend-down' : 'trend-flat';
    const icon = diffPct > 0.5 ? '▲' : diffPct < -0.5 ? '▼' : '—';
    return `<span class="trend-arrow ${cls}" title="${label}: ${previous.toFixed(1)}">${icon}${Math.abs(diffPct).toFixed(0)}% ${label}</span>`;
}

// === ประกาศ (หน้า Overview) — ทุกคนดูได้ แก้ไข/เพิ่ม/ลบได้เฉพาะ Admin ===
function renderAnnouncements() {
    const card = document.getElementById('announcementsCard');
    const list = document.getElementById('announcementsList');
    const addBtn = document.getElementById('addAnnouncementBtn');
    if (!card || !list) return;

    card.style.display = (announcements.length > 0 || isAdmin) ? 'block' : 'none';
    addBtn.style.display = isAdmin ? 'flex' : 'none';

    if (announcements.length === 0) {
        list.innerHTML = '<div class="announcement-empty">ยังไม่มีประกาศ</div>';
        return;
    }
    list.innerHTML = announcements.map(a => `
        <div class="announcement-item">
            <span class="announcement-text"></span>
            ${isAdmin ? `<div class="action-btns-inline no-print">
                <button class="btn-action btn-edit" onclick="editAnnouncement('${a.id}')" title="แก้ไข"><i class="fas fa-pencil-alt"></i></button>
                <button class="btn-action btn-del" onclick="deleteAnnouncement('${a.id}')" title="ลบ"><i class="fas fa-trash"></i></button>
            </div>` : ''}
        </div>
    `).join('');
    // ใส่ข้อความผ่าน innerText ทีละอันกันปัญหา HTML injection จากข้อความประกาศ
    list.querySelectorAll('.announcement-text').forEach((el, i) => { el.innerText = announcements[i].text; });
}

async function addAnnouncement() {
    if (!isAdmin) return;
    const text = await showPromptModal('เพิ่มประกาศใหม่', '', { multiline: true, confirmLabel: 'เพิ่ม' });
    if (!text || !text.trim()) return;
    announcements.push({ id: 'a' + Date.now(), text: text.trim() });
    dirtyKeys.announcements = true; markDirty();
    renderAnnouncements();
}

async function editAnnouncement(id) {
    if (!isAdmin) return;
    const item = announcements.find(a => a.id === id);
    if (!item) return;
    const text = await showPromptModal('แก้ไขประกาศ', item.text, { multiline: true, confirmLabel: 'บันทึก' });
    if (text === null) return;
    if (!text.trim()) announcements = announcements.filter(a => a.id !== id);
    else item.text = text.trim();
    dirtyKeys.announcements = true; markDirty();
    renderAnnouncements();
}

async function deleteAnnouncement(id) {
    if (!isAdmin) return;
    const ok = await showConfirmModal('ยืนยันลบประกาศนี้?', true, 'ลบ');
    if (!ok) return;
    announcements = announcements.filter(a => a.id !== id);
    dirtyKeys.announcements = true; markDirty();
    renderAnnouncements();
}

// === หน้า Stock / Inventory ===
// "Current Stock" และ "Planned Used" กรอกเองทั้งคู่ (เลขเดียวคงที่ ไม่อิงช่วงวันที่เลือก) ระบบคำนวณ Balance + สถานะให้เอง
function computeStockStatus(currentStock, plannedUsed, balance) {
    if (plannedUsed <= 0) return currentStock > 0 ? 'normal' : null;
    if (balance < 0) return 'critical';
    if (balance < plannedUsed * 0.2) return 'low';
    if (currentStock > plannedUsed * 3) return 'excess';
    return 'normal';
}

const STOCK_STATUS_LABEL = { normal: 'Normal', low: 'Low Stock', critical: 'Critical Low', excess: 'Excess Stock' };
const STOCK_URGENCY_RANK = { critical: 0, low: 1, normal: 2, excess: 3 };
let stockProblemsOnly = localStorage.getItem('master_plan_stock_problems_only') === 'true';

function toggleStockProblemsOnly() {
    stockProblemsOnly = !stockProblemsOnly;
    localStorage.setItem('master_plan_stock_problems_only', String(stockProblemsOnly));
    updateStockProblemsOnlyBtnUI();
    renderStockPage();
}
function updateStockProblemsOnlyBtnUI() {
    const btn = document.getElementById('stockProblemsOnlyBtn');
    if (btn) btn.classList.toggle('active', stockProblemsOnly);
}

// อ่านค่า Current Stock แบบรองรับของเก่าที่เคยเก็บเป็นตัวเลข/ข้อความเปล่าๆ (ไม่มี updatedBy/updatedAt)
function getStockRecord(stockKey) {
    const raw = stockData[stockKey];
    if (raw && typeof raw === 'object') return raw;
    return { value: raw || '', updatedBy: null, updatedAt: null };
}

function getPlannedUsedRecord(stockKey) {
    const raw = plannedUsedData[stockKey];
    if (raw && typeof raw === 'object') return raw;
    return { value: raw || '', updatedBy: null, updatedAt: null };
}

function formatStockUpdatedText(rec) {
    if (!rec.updatedAt) return '<span style="color:var(--text-muted);">-</span>';
    const d = new Date(rec.updatedAt);
    const dateText = d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' }) + ' ' + d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
    const daysAgo = Math.floor((Date.now() - d.getTime()) / 86400000);
    const staleClass = daysAgo >= 7 ? 'stock-updated-stale' : '';
    return `<span class="${staleClass}" title="โดย ${rec.updatedBy || 'ไม่ระบุชื่อ'}">${dateText}<br><span style="font-size:10px; color:var(--text-muted);">${rec.updatedBy || '-'}</span></span>`;
}

// จำสถานะพับ/กางของแต่ละกลุ่มที่ผู้ใช้กดเอง (จะจำไว้จนกว่าจะโหลดหน้าใหม่) — ถ้ายังไม่เคยกด ใช้ hasProblems เป็นค่าเริ่มต้น (กลุ่มที่มีปัญหากางไว้ก่อน)
let stockGroupOverrides = {};
function toggleStockGroup(groupId, defaultExpanded) {
    const currentlyExpanded = stockGroupOverrides.hasOwnProperty(groupId) ? stockGroupOverrides[groupId] : defaultExpanded;
    stockGroupOverrides[groupId] = !currentlyExpanded;
    renderStockPage();
}

function renderStockPage() {
    const rows = [];

    ['BW', 'LC', 'CW'].forEach(proc => {
        processConfig[proc].groups.forEach(g => {
            (modelState[g.id] || []).forEach(m => {
                const stockKey = `${proc}_${m}`;
                // Current Stock และ Planned Used กรอกเองทั้งคู่ หน่วย "จำนวนชิ้น (Pcs)" — Balance = Stock − Planned Used
                const stockRec = getStockRecord(stockKey);
                const currentStock = parseFloat(stockRec.value) || 0;
                const plannedUsedRec = getPlannedUsedRecord(stockKey);
                const plannedUsed = parseFloat(plannedUsedRec.value) || 0;
                const balance = currentStock - plannedUsed;
                rows.push({ proc, groupId: g.id, model: m, stockKey, stockRec, plannedUsedRec, currentStock, plannedUsed, balance, status: computeStockStatus(currentStock, plannedUsed, balance) });
            });
        });
    });
    const rowsByKey = {};
    rows.forEach(r => rowsByKey[`${r.proc}_${r.model}`] = r);

    let filteredRows = stockProcessFilter === 'All' ? rows : rows.filter(r => r.proc === stockProcessFilter);
    if (stockProblemsOnly) filteredRows = filteredRows.filter(r => r.status === 'critical' || r.status === 'low');
    if (hideEmptyModels) filteredRows = filteredRows.filter(r => r.status !== null);

    const tracked = filteredRows.filter(r => r.status !== null);
    const lowCount = tracked.filter(r => r.status === 'low' || r.status === 'critical').length;
    const normalCount = tracked.filter(r => r.status === 'normal').length;
    const optimalPct = tracked.length > 0 ? Math.round((normalCount / tracked.length) * 100) : 0;

    document.getElementById('stockKpiRow').innerHTML = `
        <div class="stock-kpi-card ${lowCount > 0 ? 'warn' : ''}">
            <div class="stock-kpi-label"><i class="fas fa-triangle-exclamation"></i> Low Stock Items</div>
            <div class="stock-kpi-value">${lowCount}</div>
        </div>
        <div class="stock-kpi-card good">
            <div class="stock-kpi-label"><i class="fas fa-chart-pie"></i> Optimal Stock</div>
            <div class="stock-kpi-value">${optimalPct}%</div>
        </div>
        <div class="stock-kpi-card">
            <div class="stock-kpi-label"><i class="fas fa-boxes-stacked"></i> Total Models Tracked</div>
            <div class="stock-kpi-value">${tracked.length}</div>
        </div>
    `;

    // กำลังค้นหาอยู่ (มีคำในช่องค้นหา) ให้กางทุกกลุ่มไว้ก่อน ไม่งั้นโมเดลที่ค้นหาเจอในกลุ่มที่พับไว้จะไม่โผล่มาให้เห็น
    const searchInput = document.getElementById('searchInput');
    const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';

    const canEditStock = canEditProcess('Stock');
    const table = document.getElementById('stockTable');
    table.querySelectorAll('tbody').forEach(tb => tb.remove());

    ['BW', 'LC', 'CW'].forEach(proc => {
        if (stockProcessFilter !== 'All' && stockProcessFilter !== proc) return;
        processConfig[proc].groups.forEach(g => {
            let groupRows = filteredRows.filter(r => r.groupId === g.id);
            if (groupRows.length === 0) return;
            // เรียงตัวที่มีปัญหา (Critical/Low) ขึ้นก่อนภายในกลุ่มเดียวกัน
            groupRows = [...groupRows].sort((a, b) => (STOCK_URGENCY_RANK[a.status] ?? 9) - (STOCK_URGENCY_RANK[b.status] ?? 9));

            const problemCount = groupRows.filter(r => r.status === 'critical' || r.status === 'low').length;
            const hasProblems = problemCount > 0;
            const expanded = searchQuery ? true : (stockGroupOverrides.hasOwnProperty(g.id) ? stockGroupOverrides[g.id] : hasProblems);
            const label = (groupLabels[g.id] || g.id).replace(/<br>/g, ' ');

            const groupTbody = document.createElement('tbody');
            groupTbody.id = `stock-tbody-${g.id}`;

            const headerTr = document.createElement('tr');
            headerTr.className = 'stock-group-header' + (hasProblems ? ' has-problems' : '');
            headerTr.onclick = () => toggleStockGroup(g.id, hasProblems);
            headerTr.innerHTML = `<td colspan="7">
                <i class="fas fa-chevron-${expanded ? 'down' : 'right'}"></i>
                <span class="stock-group-proc">${proc}</span>
                <strong>${label}</strong>
                <span class="stock-group-meta">${groupRows.length} model${groupRows.length > 1 ? 's' : ''}${hasProblems ? ` · ${problemCount} มีปัญหา` : ''}</span>
            </td>`;
            groupTbody.appendChild(headerTr);

            if (expanded) groupRows.forEach(r => {
                const tr = document.createElement('tr');
                tr.dataset.modelName = r.model;
                if (searchQuery && !r.model.toLowerCase().includes(searchQuery)) tr.style.opacity = '0.2';

                const statusHtml = r.status ? `<span class="stock-badge status-${r.status}">${STOCK_STATUS_LABEL[r.status]}</span>` : '<span style="color:var(--text-muted);">-</span>';
                const balanceText = (r.currentStock > 0 || r.plannedUsed > 0) ? r.balance.toLocaleString() : '-';
                const chain = resolveSourceChain(r.proc, r.model);
                const hasChain = chain.length > 1;

                tr.innerHTML = `
                    <td style="text-align:left; color:var(--text-secondary); font-size:12px;">${r.proc}</td>
                    <td class="col-model">${r.model}${hasChain ? `<button class="chain-toggle-btn" onclick="toggleStockChainRow(this)" title="ดูแหล่งวัตถุดิบต้นทาง"><i class="fas fa-diagram-project"></i></button>` : ''}</td>
                    <td></td>
                    <td style="font-size:11px;">${formatStockUpdatedText(r.stockRec)}</td>
                    <td></td>
                    <td class="${r.balance < 0 ? 'stock-balance-negative' : ''}">${balanceText}</td>
                    <td>${statusHtml}</td>
                `;

                const stockTd = tr.children[2];
                const inp = document.createElement('input');
                inp.type = 'number'; inp.className = 'stock-input'; inp.step = '1'; inp.placeholder = '-';
                inp.value = r.stockRec.value || '';
                if (!canEditStock) inp.readOnly = true;
                else {
                    // markDirty() ตั้งแต่เริ่มพิมพ์ (ไม่ใช่รอ blur/onchange) กัน poll ทุก 15 วิ มาทับข้อมูลที่กำลังพิมพ์ค้างอยู่
                    inp.oninput = markDirty;
                    inp.onchange = function () {
                        if (this.value.trim()) {
                            stockData[r.stockKey] = { value: this.value, updatedBy: currentUser.username, updatedAt: new Date().toISOString() };
                        } else delete stockData[r.stockKey];
                        markKeyDirty('stockData', r.stockKey); renderStockPage();
                    };
                }
                stockTd.appendChild(inp);

                const plannedTd = tr.children[4];
                const plannedInp = document.createElement('input');
                plannedInp.type = 'number'; plannedInp.className = 'stock-input'; plannedInp.step = '1'; plannedInp.placeholder = '-';
                plannedInp.value = r.plannedUsedRec.value || '';
                if (!canEditStock) plannedInp.readOnly = true;
                else {
                    plannedInp.oninput = markDirty;
                    plannedInp.onchange = function () {
                        if (this.value.trim()) {
                            plannedUsedData[r.stockKey] = { value: this.value, updatedBy: currentUser.username, updatedAt: new Date().toISOString() };
                        } else delete plannedUsedData[r.stockKey];
                        markKeyDirty('plannedUsedData', r.stockKey); renderStockPage();
                    };
                }
                plannedTd.appendChild(plannedInp);
                groupTbody.appendChild(tr);

                if (hasChain) {
                    const chainTr = document.createElement('tr');
                    chainTr.className = 'stock-chain-row'; chainTr.style.display = 'none';
                    const td = document.createElement('td'); td.colSpan = 7;
                    const boxesHtml = chain.map((link, i) => {
                        const linkRow = rowsByKey[`${link.proc}_${link.model}`];
                        const stockText = linkRow ? linkRow.currentStock.toLocaleString() : '-';
                        const balText = linkRow ? linkRow.balance.toLocaleString() : '-';
                        const arrowHtml = i > 0 ? `<div class="chain-arrow"><i class="fas fa-arrow-left"></i>${link.ratio && link.ratio !== 1 ? `<span class="chain-ratio">x${link.ratio}</span>` : ''}</div>` : '';
                        return `${arrowHtml}<div class="chain-box"><div class="chain-box-proc">${link.proc}</div><div class="chain-box-model">${link.model}</div><div class="chain-box-stat">Stock ${stockText} · Bal <span class="${linkRow && linkRow.balance < 0 ? 'stock-balance-negative' : ''}">${balText}</span></div></div>`;
                    }).join('');
                    td.innerHTML = `<div class="stock-chain-panel"><div class="stock-chain-boxes">${boxesHtml}</div></div>`;
                    chainTr.appendChild(td);
                    groupTbody.appendChild(chainTr);
                }
            });

            table.appendChild(groupTbody);
        });
    });
}

function toggleStockChainRow(btn) {
    const row = btn.closest('tr').nextElementSibling;
    if (row && row.classList.contains('stock-chain-row')) row.style.display = row.style.display === 'none' ? 'table-row' : 'none';
}

function renderOverview() {
    const targetDate = new Date(document.getElementById('startDatePicker').value);
    const dateKey = formatDateHeader(targetDate);
    const yesterday = new Date(targetDate); yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(targetDate); lastWeek.setDate(lastWeek.getDate() - 7);

    ['BW', 'LC', 'CW'].forEach(proc => {
        let labels = []; let data = []; let grandTotalMC = 0; let grandTotalPcs = 0; let topStamp = { name: '-', val: 0 };

        processConfig[proc].groups.forEach(g => {
            let p = getParams(g.id);
            let hrsKey = `${proc}_${g.id}_${dateKey}`; let dayHrs = parseFloat(hrsData[hrsKey]); if (isNaN(dayHrs)) dayHrs = 18;

            let models = modelState[g.id] || [];
            models.forEach(m => {
                let key = `${proc}_${m}_${dateKey}`;
                let val = parseFloat(cellData[key]);
                if (!isNaN(val) && val > 0) {
                    labels.push(m); data.push(val);
                    grandTotalMC += val;
                    grandTotalPcs += calcPcs(val, p.oa, p.mct, dayHrs);
                    if (val > topStamp.val) { topStamp.name = m; topStamp.val = val; }
                }
            });
        });

        drawChart(`chart-${proc}`, labels, data, proc);
        const centerEl = document.getElementById(`center-${proc}`);
        centerEl.innerHTML = `<span class="count-num">0.0</span><br><span style="font-size:12px; color:#636e72;">${grandTotalPcs.toLocaleString()} Pcs</span>`;
        animateCountUp(centerEl.querySelector('.count-num'), grandTotalMC);

        // เปรียบเทียบกับเมื่อวานและสัปดาห์ก่อน
        const yesterdayTotal = computeGrandTotalMC(proc, formatDateHeader(yesterday));
        const lastWeekTotal = computeGrandTotalMC(proc, formatDateHeader(lastWeek));
        const trendParts = [trendCompareHtml(grandTotalMC, yesterdayTotal, 'เทียบเมื่อวาน'), trendCompareHtml(grandTotalMC, lastWeekTotal, 'เทียบสัปดาห์ก่อน')].filter(Boolean);
        document.getElementById(`trend-${proc}`).innerHTML = trendParts.join(' &nbsp; ');

        let statHtml = `<strong>🔥 Top Stamp:</strong> <span style="color:var(--btn-primary); font-weight:600;">${topStamp.name}</span> (${topStamp.val > 0 ? topStamp.val.toFixed(1) : 0})<br>`;
        statHtml += `<strong>📊 Total Active Models:</strong> ${data.length}`;
        document.getElementById(`stat-${proc}`).innerHTML = data.length > 0 ? statHtml : 'No data recorded for this date.';
    });
}

function drawChart(canvasId, labels, data, procName) {
    if (typeof Chart === 'undefined') { document.getElementById(canvasId).parentElement.innerHTML = `<div style="padding:20px; color:#ff7675;">Chart.js failed to load.</div>`; return; }
    let ctx = document.getElementById(canvasId).getContext('2d');
    if (chartInstances[canvasId]) { chartInstances[canvasId].destroy(); }

    if (data.length === 0) {
        chartInstances[canvasId] = new Chart(ctx, { type: 'doughnut', data: { labels: ['No Data'], datasets: [{ data: [1], backgroundColor: ['#f1f2f6'] }] }, options: { cutout: '75%', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { enabled: false } } } });
        return;
    }

    chartInstances[canvasId] = new Chart(ctx, {
        type: 'doughnut', data: { labels: labels, datasets: [{ data: data, backgroundColor: chartColors, borderWidth: 2, borderColor: '#fff' }] },
        options: { cutout: '70%', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { callbacks: { label: function (c) { return ` ${c.label}: ${c.raw} m/c`; } } } }, animation: { animateScale: true, animateRotate: true } }
    });
}

// === Admin & Table Generation Functions ===
async function toggleAdmin() {
    if (currentUser) {
        if (isDirty) {
            // เดิมออกจากระบบแล้วละทิ้งข้อมูลที่ยังไม่ได้กดบันทึกทันที ทำให้ข้อมูลหาย (บั๊กที่ผู้ใช้แจ้ง)
            // เปลี่ยนเป็นบันทึกให้อัตโนมัติก่อนออกจากระบบเสมอ กันข้อมูลหาย
            const ok = await showConfirmModal('มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก ระบบจะบันทึกให้อัตโนมัติก่อนออกจากระบบ ยืนยันหรือไม่?', false, 'บันทึกแล้วออกจากระบบ');
            if (!ok) return;
            await saveToServer();
            if (isDirty) { showToast('บันทึกไม่สำเร็จ ยังไม่ออกจากระบบเพื่อป้องกันข้อมูลหาย', 'error'); return; }
        }
        forceLogout();
        await loadStateFromServer();
        isDirty = false; updateSaveButtonUI();
        rerenderCurrentView();
        return;
    }

    const cred = await showLoginModal();
    if (cred === null) return;
    let loginData;
    try {
        const res = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(cred) });
        loginData = await res.json();
    } catch (e) {
        showToast('เชื่อมต่อ server ไม่ได้', 'error');
        return;
    }
    // แยก try/catch ของ fetch ออกจากส่วน render ด้านล่าง — กันไม่ให้บั๊กตอน render (ถ้ามี)
    // ถูกจับเป็น "เชื่อมต่อ server ไม่ได้" ทั้งที่จริงๆ login สำเร็จแล้ว
    if (loginData.ok) {
        currentUser = { username: loginData.username, role: loginData.role, processes: loginData.processes || [] };
        isAdmin = currentUser.role === 'admin'; userProcesses = currentUser.processes;
        sessionPassword = cred.password;
        sessionStorage.setItem('master_plan_user', JSON.stringify(currentUser));
        sessionStorage.setItem('master_plan_pwd', cred.password);
        updateAdminUI();
        rerenderCurrentView();
        showToast(`เข้าสู่ระบบสำเร็จ (${isAdmin ? 'Admin' : currentUser.processes.join(', ')})`, 'success');
    } else {
        showToast('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง', 'error');
    }
}

function updateAdminUI() {
    let btn = document.getElementById('adminBtn'); let revInput = document.getElementById('revInput');
    let saveBtn = document.getElementById('saveBtn');
    const manageUsersBtn = document.getElementById('manageUsersBtn');
    const manageBomBtn = document.getElementById('manageBomBtn');
    if (isAdmin) {
        btn.innerHTML = '<i class="fas fa-unlock"></i> Admin Mode'; btn.classList.add('logged-in');
        revInput.removeAttribute('readonly'); revInput.style.background = '#fff';
        saveBtn.style.display = 'flex'; // โชว์ทุกหน้ารวมทั้ง Overview ด้วย (ไว้เซฟประกาศ/สต็อกที่แก้จากหน้านี้ได้)
        if (manageUsersBtn) manageUsersBtn.style.display = 'flex';
        if (manageBomBtn) manageBomBtn.style.display = 'flex';
    } else if (currentUser) {
        // login แบบจำกัดสิทธิ์ (แก้ไขได้เฉพาะ process ที่ได้รับมอบหมาย) — แก้ไขโครงสร้าง/Rev/Announcements ไม่ได้
        btn.innerHTML = `<i class="fas fa-unlock"></i> ${currentUser.username} (${currentUser.processes.join(', ')})`; btn.classList.add('logged-in');
        revInput.setAttribute('readonly', 'true'); revInput.style.background = '#f1f2f6';
        saveBtn.style.display = 'flex';
        if (manageUsersBtn) manageUsersBtn.style.display = 'none';
        if (manageBomBtn) manageBomBtn.style.display = 'none';
    } else {
        btn.innerHTML = '<i class="fas fa-lock"></i> Login'; btn.classList.remove('logged-in');
        revInput.setAttribute('readonly', 'true'); revInput.style.background = '#f1f2f6';
        saveBtn.style.display = 'none';
        if (manageUsersBtn) manageUsersBtn.style.display = 'none';
        if (manageBomBtn) manageBomBtn.style.display = 'none';
    }
    updateSaveButtonUI();
    if (currentProcess === 'Stock') renderAnnouncements();
}

// === จัดการผู้ใช้งาน (เฉพาะ Admin) ===
async function openManageUsers() {
    if (!isAdmin) return;
    let data;
    try {
        const res = await fetch('/api/users/list', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: currentUser.username, password: sessionPassword }) });
        data = await res.json();
    } catch (e) { showToast('เชื่อมต่อ server ไม่ได้', 'error'); return; }
    if (!data.ok) { showToast(data.error || 'โหลดรายชื่อผู้ใช้งานไม่สำเร็จ', 'error'); return; }
    renderManageUsersModal(data.users);
}

function renderManageUsersModal(usersList) {
    const root = document.getElementById('modalRoot');
    const rows = usersList.map(u => `
        <tr>
            <td>${u.username}</td>
            <td><span class="role-badge ${u.role === 'admin' ? 'role-admin' : ''}">${u.role === 'admin' ? 'Admin' : (u.processes.join(', ') || '-')}</span></td>
            <td style="text-align:right;">
                ${u.username !== currentUser.username ? `<button class="btn-action btn-del" onclick="deleteUserPrompt('${u.username}')" title="ลบ"><i class="fas fa-trash"></i></button>` : ''}
            </td>
        </tr>`).join('');
    root.innerHTML = `
        <div class="modal-overlay" id="modalOverlay">
            <div class="modal-box modal-box-wide">
                <h3><i class="fas fa-users-cog"></i> จัดการผู้ใช้งาน</h3>
                <table class="user-mgmt-table">
                    <thead><tr><th>ชื่อผู้ใช้</th><th>สิทธิ์</th><th></th></tr></thead>
                    <tbody>${rows || '<tr><td colspan="3">ไม่มี user</td></tr>'}</tbody>
                </table>
                <div class="user-mgmt-form">
                    <div class="field-row">
                        <input type="text" id="newUserUsername" placeholder="ชื่อผู้ใช้ใหม่">
                        <input type="password" id="newUserPassword" placeholder="รหัสผ่าน">
                    </div>
                    <select id="newUserRole" onchange="document.getElementById('newUserProcessGroup').style.display = this.value === 'admin' ? 'none' : 'flex';" style="padding:8px; border:1px solid var(--border-strong); border-radius:var(--radius-sm); font-family:inherit;">
                        <option value="process">แก้ไขได้เฉพาะ process ที่เลือก</option>
                        <option value="admin">Admin (สิทธิ์เต็ม)</option>
                    </select>
                    <div class="process-check-group" id="newUserProcessGroup">
                        <label><input type="checkbox" value="BW"> BW</label>
                        <label><input type="checkbox" value="LC"> LC</label>
                        <label><input type="checkbox" value="CW"> CW</label>
                        <label><input type="checkbox" value="Stock"> Stock</label>
                    </div>
                    <button class="modal-btn modal-btn-confirm" onclick="submitAddUser()" style="align-self:flex-start;"><i class="fas fa-plus"></i> เพิ่มผู้ใช้งาน</button>
                </div>
                <div class="modal-actions" style="margin-top:16px;">
                    <button class="modal-btn modal-btn-cancel" onclick="closeModal()">ปิด</button>
                </div>
            </div>
        </div>`;
    document.getElementById('modalOverlay').onclick = (e) => { if (e.target.id === 'modalOverlay') closeModal(); };
}

async function submitAddUser() {
    const newUsername = document.getElementById('newUserUsername').value.trim();
    const newPassword = document.getElementById('newUserPassword').value;
    const role = document.getElementById('newUserRole').value;
    const processes = Array.from(document.querySelectorAll('#newUserProcessGroup input:checked')).map(c => c.value);
    if (!newUsername || !newPassword) { showToast('กรอกชื่อผู้ใช้และรหัสผ่านให้ครบ', 'error'); return; }
    if (role === 'process' && processes.length === 0) { showToast('เลือกอย่างน้อย 1 process', 'error'); return; }
    try {
        const res = await fetch('/api/users/add', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: currentUser.username, password: sessionPassword, newUsername, newPassword, role, processes }) });
        const data = await res.json();
        if (data.ok) { showToast('เพิ่มผู้ใช้งานสำเร็จ', 'success'); openManageUsers(); }
        else showToast(data.error || 'เพิ่มผู้ใช้งานไม่สำเร็จ', 'error');
    } catch (e) { showToast('เชื่อมต่อ server ไม่ได้', 'error'); }
}

async function deleteUserPrompt(username) {
    const ok = await showConfirmModal(`ยืนยันลบผู้ใช้งาน "${username}"?`, true, 'ลบ');
    if (!ok) return;
    try {
        const res = await fetch('/api/users/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: currentUser.username, password: sessionPassword, targetUsername: username }) });
        const data = await res.json();
        if (data.ok) { showToast('ลบผู้ใช้งานสำเร็จ', 'success'); openManageUsers(); }
        else showToast(data.error || 'ลบไม่สำเร็จ', 'error');
    } catch (e) { showToast('เชื่อมต่อ server ไม่ได้', 'error'); }
}

function onRevChange() {
    if (!isAdmin) return;
    revData[currentProcess] = document.getElementById('revInput').value;
    document.getElementById('printRevTxt').innerText = revData[currentProcess];
    markKeyDirty('revData', currentProcess);
}

function updateTimestampUI() {
    let savedTime = (timestamps && timestamps[currentProcess]) || '-';
    document.getElementById('lastUpdateTxt').innerText = savedTime; document.getElementById('printUpdateTxt').innerText = savedTime;
}

function setViewDays(days) {
    viewDays = days;
    document.querySelectorAll('#viewToggleGroup .toggle-btn').forEach(b => b.classList.remove('active'));
    const idMap = { 1: 'btn1Day', 7: 'btn7Days', 30: 'btn30Days' };
    document.getElementById(idMap[days]).classList.add('active');
    rerenderCurrentView();
}

// สีของโมเดล/ช่อง Cover อ้างอิงจาก "รหัส Cover" เป็นหลัก (ตั้งสีครั้งเดียวต่อรหัส ใช้ซ้ำได้ทุกโมเดลที่ใช้ Cover รหัสเดียวกัน)
// เผื่อรหัสนี้ยังไม่เคยตั้งสีไว้ (หรือโมเดลยังไม่มีรหัส Cover) ใช้สีเดิมที่เคยตั้งไว้เฉพาะโมเดลนั้น (coverColors) เป็น fallback
function getCoverCodeColor(code) {
    return (code && coverCodeColors[code]) || null;
}

function updateCoverColor(modelName, color) {
    if (!isAdmin) return;
    const code = coverData[modelName];
    if (code) { coverCodeColors[code] = color; markKeyDirty('coverCodeColors', code); }
    else { coverColors[modelName] = color; markKeyDirty('coverColors', modelName); }
    generateTable(); // สีอาจกระทบหลายแถวที่ใช้รหัส Cover เดียวกัน ต้อง re-render ทั้งตาราง
}

// คืนคลาส CSS ของคอลัมน์วันที่ตามว่าเป็นวันหยุดและ/หรือวันนี้หรือไม่ (ใช้ซ้ำหลายจุดในตาราง)
function dayClasses(d, base) {
    const isWeekend = (d.getDay() === 0 || d.getDay() === 6);
    const isToday = formatDateHeader(d) === formatDateHeader(new Date());
    const cls = [base, isWeekend ? 'weekend-cell' : '', isToday ? 'today-cell' : ''];
    return cls.filter(Boolean).join(' ');
}

function generateTable() {
    const config = processConfig[currentProcess]; const startDate = new Date(document.getElementById('startDatePicker').value);
    let mainTable = document.getElementById('mainTable'); let tHead = document.getElementById('tableHead');
    mainTable.querySelectorAll('tbody').forEach(tb => tb.remove()); tHead.innerHTML = '';

    // คอลัมน์วันที่ใช้ min-width หน่วย px คงที่เสมอ (ไม่ใช่ % ของ viewDays) เพื่อให้เมื่อดูแบบ 1 เดือน (30 วัน)
    // ตารางขยายกว้างเกินจอแล้วเลื่อนซ้าย-ขวาได้ (.table-responsive มี overflow-x: auto อยู่แล้ว) แทนที่จะบีบคอลัมน์จนอ่านไม่ออก
    let groupWidth = "160px"; let modelWidth = "170px"; let coverWidth = config.hasCover ? "90px" : "0px"; let dateMinWidth = "68px";
    const todayKey = formatDateHeader(new Date());

    let trHead = document.createElement('tr');
    let headerStr = `<th style="background-color: var(--header-bg); border-right: none; min-width:${groupWidth};"></th><th style="background-color: var(--header-bg); min-width:${modelWidth};">Stamp/m/c</th>`;
    if (config.hasCover) headerStr += `<th style="background-color: var(--header-bg); min-width:${coverWidth};">Cover</th>`;
    for (let i = 0; i < viewDays; i++) {
        let d = new Date(startDate); d.setDate(d.getDate() + i);
        let isWeekend = (d.getDay() === 0 || d.getDay() === 6); let isToday = formatDateHeader(d) === todayKey;
        let cls = [isWeekend ? 'weekend-header' : '', isToday ? 'today-header' : ''].filter(Boolean).join(' ');
        headerStr += `<th class="${cls}" style="min-width:${dateMinWidth};">${formatDateHeader(d)}${isToday ? '<span class="today-badge">วันนี้</span>' : ''}</th>`;
    }
    trHead.innerHTML = headerStr; tHead.appendChild(trHead);

    config.groups.forEach(groupConfig => {
        let groupId = groupConfig.id; let groupTbody = document.createElement('tbody'); groupTbody.id = `tbody-${groupId}`;
        let models = modelState[groupId] || []; let rowCount = models.length;
        let p = getParams(groupId);

        let groupHtmlStr = groupLabels[groupId] || groupId;
        if (isAdmin) {
            groupHtmlStr += `<br><button class="btn-action btn-edit-type no-print" onclick="editGroup('${groupId}')"><i class="fas fa-edit"></i> Edit Type</button>`;
            groupHtmlStr += `<div class="param-box no-print">
                                <label>OA%:</label> <input type="number" step="1" value="${p.oa}" onchange="updateParam('${groupId}', 'oa', this.value)"><br>
                                <label>MCT:</label> <input type="number" step="0.1" value="${p.mct}" onchange="updateParam('${groupId}', 'mct', this.value)">
                             </div>`;
        }

        // --- 1. Generate Models ---
        models.forEach((modelName, index) => {
            let tr = document.createElement('tr');
            tr.className = index % 2 === 0 ? 'row-even' : 'row-odd';
            tr.dataset.modelName = modelName; // ชื่อเต็ม (รวม variant) ไว้ใช้ค้นหา แม้ตอนแสดงผลจะแยก base/variant ออกเป็นคนละ span
            if (index === 0) {
                let tdGroup = document.createElement('td'); tdGroup.className = 'col-group';
                tdGroup.rowSpan = rowCount + (isAdmin ? 2 : 0);
                tdGroup.style.borderTop = "1px solid var(--border-color)";
                tdGroup.innerHTML = groupHtmlStr; tr.appendChild(tdGroup);
            }

            let tdModel = document.createElement('td'); let isBlue = blueModels.includes(modelName);
            if (modelName === 'Q4 (DSS2)') tdModel.style.backgroundColor = '#f1f2f6';
            // สีชื่อโมเดลอ้างอิงจากสีของรหัส Cover เป็นหลัก (โมเดลที่ใช้ Cover รหัสเดียวกันจะได้สีเดียวกันอัตโนมัติ)
            const modelColor = getCoverCodeColor(coverData[modelName]) || coverColors[modelName];
            if (modelColor) tdModel.style.color = modelColor;
            tdModel.className = 'col-model' + (isBlue ? ' col-model-blue' : ''); if (index === 0) tdModel.style.borderTop = "1px solid var(--border-color)";
            const { base: modelBase, variant: modelVariant } = parseModelDisplay(modelName);
            tdModel.innerHTML = `<span class="model-text">${modelBase}</span>${modelVariant ? `<span class="model-variant-badge">${modelVariant}</span>` : ''}`;
            if (isAdmin) {
                tdModel.innerHTML += `<div class="action-btns no-print">
                    <button class="btn-action btn-edit" onclick="editModelName('${groupId}', '${modelName}')" title="Edit Model"><i class="fas fa-pencil-alt"></i></button>
                    <button class="btn-action btn-del" onclick="delModel('${groupId}', '${modelName}')" title="Delete Model"><i class="fas fa-trash"></i></button>
                </div>`;
            }
            tr.appendChild(tdModel);

            if (config.hasCover) {
                let tdCover = document.createElement('td'); if (index === 0) tdCover.style.borderTop = "1px solid var(--border-color)";
                let cColor = getCoverCodeColor(coverData[modelName]) || coverColors[modelName] || '#2d3436';
                let coverHtml = `<div style="display:flex; justify-content:center; align-items:center; gap:4px;">
                    <input type="text" id="cover_inp_${modelName}" class="cover-input" placeholder="-" value="${coverData[modelName] || ''}" style="color: ${cColor};" ${!isAdmin ? 'readonly' : ''}>`;
                if (isAdmin) {
                    coverHtml += `<input type="color" class="no-print cover-color-picker" value="${cColor}" onchange="updateCoverColor('${modelName}', this.value)" title="Change text color">`;
                }
                coverHtml += `</div>`;
                tdCover.innerHTML = coverHtml;

                if (isAdmin) {
                    let textInp = tdCover.querySelector('.cover-input');
                    textInp.oninput = markDirty; // กัน poll มาทับตอนกำลังพิมพ์อยู่ (ก่อน blur)
                    textInp.onchange = function () { coverData[modelName] = this.value; markKeyDirty('coverData', modelName); generateTable(); };
                }
                tr.appendChild(tdCover);
            }

            for (let i = 0; i < viewDays; i++) {
                let d = new Date(startDate); d.setDate(d.getDate() + i); let storageKey = `${currentProcess}_${modelName}_${formatDateHeader(d)}`;
                let td = document.createElement('td'); td.className = dayClasses(d, 'val-cell'); if (index === 0) td.style.borderTop = "1px solid var(--border-color)";

                let inpDate = document.createElement('input'); inpDate.type = 'number'; inpDate.step = '0.1'; inpDate.placeholder = '-';
                inpDate.className = `table-input input-${groupId}`; inpDate.value = cellData[storageKey] || '';
                let pcsSpan = document.createElement('span'); pcsSpan.className = 'cell-pcs-text';

                if (!canEditProcess(currentProcess)) inpDate.readOnly = true; else {
                    inpDate.oninput = markDirty; // กัน poll มาทับตอนกำลังพิมพ์อยู่ (ก่อน blur)
                    inpDate.onchange = function () { pushUndo(storageKey, cellData[storageKey] || ''); cellData[storageKey] = this.value; markKeyDirty('cellData', storageKey); calcTotals(); };
                    inpDate.onkeyup = calcTotals;
                    inpDate.onkeydown = function (e) { handleCellArrowNav(e, this); };
                }

                td.appendChild(inpDate); td.appendChild(pcsSpan);

                // คอมเมนต์ประจำช่อง (เหมือน note ใน Excel) — ติดไปด้วยตอนพิมพ์
                const comment = cellComments[storageKey];
                if (comment || isAdmin) {
                    let dot = document.createElement('span');
                    dot.className = 'comment-dot' + (comment ? ' has-comment' : ' no-print');
                    dot.title = comment || 'เพิ่มคอมเมนต์';
                    if (isAdmin) {
                        dot.onclick = async (e) => {
                            e.stopPropagation();
                            const val = await showPromptModal(`คอมเมนต์ — ${modelName} (${formatDateHeader(d)})`, cellComments[storageKey] || '', { multiline: true, confirmLabel: 'บันทึก' });
                            if (val === null) return;
                            if (val.trim()) cellComments[storageKey] = val.trim(); else delete cellComments[storageKey];
                            markKeyDirty('cellComments', storageKey); generateTable();
                        };
                    }
                    td.appendChild(dot);
                }
                if (comment) {
                    let commentText = document.createElement('span');
                    commentText.className = 'cell-comment-text';
                    commentText.innerText = comment;
                    td.appendChild(commentText);
                }

                tr.appendChild(td);
            }
            groupTbody.appendChild(tr);
        });

        // --- 2. Generate Add Model Button (Admin Only) ---
        if (isAdmin) {
            let trAdd = document.createElement('tr'); trAdd.className = 'no-print';
            if (rowCount === 0) {
                let tdGroup = document.createElement('td'); tdGroup.className = 'col-group'; tdGroup.rowSpan = 2;
                tdGroup.style.borderTop = "1px solid var(--border-color)";
                tdGroup.innerHTML = groupHtmlStr; trAdd.appendChild(tdGroup);
            }
            let tdAdd = document.createElement('td'); tdAdd.colSpan = config.hasCover ? 2 : 1; tdAdd.style.padding = '0'; if (rowCount === 0) tdAdd.style.borderTop = "1px solid var(--border-color)";
            tdAdd.innerHTML = `<button class="btn-action btn-add" onclick="addModel('${groupId}')"><i class="fas fa-plus"></i> Add Model</button>`; trAdd.appendChild(tdAdd);

            for (let i = 0; i < viewDays; i++) {
                let d = new Date(startDate); d.setDate(d.getDate() + i);
                let td = document.createElement('td'); td.className = dayClasses(d, 'val-cell'); if (rowCount === 0) td.style.borderTop = "1px solid var(--border-color)";
                trAdd.appendChild(td);
            }
            groupTbody.appendChild(trAdd);
        }

        // --- 3. Generate Hrs/Day Row (Admin Only) ---
        if (isAdmin) {
            let trHrs = document.createElement('tr'); trHrs.className = 'hrs-row';
            let tdHrsLabel = document.createElement('td'); tdHrsLabel.className = 'col-model'; tdHrsLabel.innerHTML = '<strong><i class="fas fa-clock"></i> Hrs/Day</strong>';
            if (config.hasCover) tdHrsLabel.colSpan = 2;
            if (rowCount === 0) tdHrsLabel.style.borderTop = "1px solid var(--border-color)";
            trHrs.appendChild(tdHrsLabel);

            for (let i = 0; i < viewDays; i++) {
                let d = new Date(startDate); d.setDate(d.getDate() + i);
                let dateKey = formatDateHeader(d); let storageKey = `${currentProcess}_${groupId}_${dateKey}`;

                let td = document.createElement('td'); td.className = dayClasses(d, 'val-cell');
                if (rowCount === 0) td.style.borderTop = "1px solid var(--border-color)";

                let inpHrs = document.createElement('input'); inpHrs.type = 'number'; inpHrs.step = '0.5';
                inpHrs.className = `table-input hrs-input-${groupId}`;
                inpHrs.value = hrsData[storageKey] || '18';

                inpHrs.oninput = markDirty; // กัน poll มาทับตอนกำลังพิมพ์อยู่ (ก่อน blur)
                inpHrs.onchange = function () { hrsData[storageKey] = this.value; markKeyDirty('hrsData', storageKey); calcTotals(); };
                inpHrs.onkeyup = calcTotals;

                td.appendChild(inpHrs); trHrs.appendChild(td);
            }
            groupTbody.appendChild(trHrs);
        }

        // --- 4. Generate Totals ---
        if (groupConfig.totals) {
            groupConfig.totals.forEach(tot => {
                let trTot = document.createElement('tr'); trTot.className = `total-row row-total ${tot.isDg1 ? 'row-total-dg1' : ''} ${tot.isGrand ? 'row-grand-total' : ''}`;
                let labelTd = document.createElement('td'); labelTd.colSpan = config.hasCover ? 3 : 2;

                let labelText = tot.isGroupTotal ? ("Total " + (groupLabels[groupId] || groupId).replace(/<br>/gi, ' ')) : tot.label;
                labelTd.innerText = labelText;
                labelTd.style.textAlign = config.hasCover ? 'left' : 'center'; if (config.hasCover) labelTd.style.paddingLeft = '15px'; trTot.appendChild(labelTd);

                for (let i = 0; i < viewDays; i++) { let d = new Date(startDate); d.setDate(d.getDate() + i); let valTd = document.createElement('td'); valTd.className = dayClasses(d, 'tot-cell'); valTd.dataset.sumGroups = tot.sum.join(','); valTd.innerText = '-'; trTot.appendChild(valTd); }
                groupTbody.appendChild(trTot);
            });
        }
        mainTable.appendChild(groupTbody);
    });
    calcTotals();
    applyStickyColumnOffsets();
    // Total ของ type ไหนมีข้อมูลจริงให้โชว์ ไม่มีข้อมูลเลยให้ซ่อน (เหมือน logic ตอนพิมพ์ PDF)
    if (hideEmptyModels) hideEmptyModelRows('hide-empty-live', true);
}

// วัดความกว้างจริงของคอลัมน์กลุ่ม แล้วเลื่อนคอลัมน์ Model ให้ชิดขวาคอลัมน์กลุ่มพอดีเวลา sticky ซ้าย
// (กันกรณีข้อความชื่อกลุ่มยาว/มีปุ่ม Edit Type ตอน Admin ทำให้คอลัมน์กว้างเกิน 160px ที่ตั้งไว้)
function applyStickyColumnOffsets() {
    const groupCell = document.querySelector('.col-group');
    if (!groupCell) return;
    const w = groupCell.offsetWidth;
    document.querySelectorAll('.col-model').forEach(el => el.style.left = w + 'px');
    const stampTh = document.querySelector('#tableHead th:nth-child(2)');
    if (stampTh) stampTh.style.left = w + 'px';
}

function calcTotals() {
    const startDate = new Date(document.getElementById('startDatePicker').value);

    ALL_GROUP_IDS.forEach(g => {
        let p = getParams(g);
        document.querySelectorAll(`.input-${g}`).forEach((inp, idx) => {
            let colIndex = idx % viewDays;
            let d = new Date(startDate); d.setDate(d.getDate() + colIndex);
            let storageKey = `${currentProcess}_${g}_${formatDateHeader(d)}`;

            let dayHrs = parseFloat(hrsData[storageKey]); if (isNaN(dayHrs)) dayHrs = 18;

            let val = parseFloat(inp.value);
            let span = inp.nextElementSibling;
            if (span && span.classList.contains('cell-pcs-text')) {
                if (!isNaN(val) && val > 0 && dayHrs > 0) span.innerText = calcPcs(val, p.oa, p.mct, dayHrs).toLocaleString();
                else span.innerText = '';
            }
        });
    });

    document.querySelectorAll('.total-row').forEach(row => {
        const isGrandTotal = row.classList.contains('row-grand-total');
        row.querySelectorAll('.tot-cell').forEach((cell, colIndex) => {
            let groupsToSum = cell.dataset.sumGroups.split(',');
            let totalMC = 0; let totalPcs = 0;

            groupsToSum.forEach(g => {
                let p = getParams(g);
                let d = new Date(startDate); d.setDate(d.getDate() + colIndex);
                let storageKey = `${currentProcess}_${g}_${formatDateHeader(d)}`;
                let dayHrs = parseFloat(hrsData[storageKey]); if (isNaN(dayHrs)) dayHrs = 18;

                let groupMC = 0;
                document.querySelectorAll(`.input-${g}`).forEach((inp, idx) => {
                    if (idx % viewDays === colIndex && inp.value.trim() !== '' && !isNaN(inp.value)) { groupMC += parseFloat(inp.value); }
                });
                totalMC += groupMC;
                if (groupMC > 0 && dayHrs > 0) { totalPcs += calcPcs(groupMC, p.oa, p.mct, dayHrs); }
            });

            let trendHtml = '';
            if (isGrandTotal && totalMC > 0) {
                const curDate = new Date(startDate); curDate.setDate(curDate.getDate() + colIndex);
                const prevDate = new Date(curDate); prevDate.setDate(prevDate.getDate() - 7);
                const prevTotal = sumModelsForDate(groupsToSum, prevDate);
                if (prevTotal > 0) {
                    const diffPct = ((totalMC - prevTotal) / prevTotal) * 100;
                    const cls = diffPct > 0.5 ? 'trend-up' : diffPct < -0.5 ? 'trend-down' : 'trend-flat';
                    const icon = diffPct > 0.5 ? '▲' : diffPct < -0.5 ? '▼' : '—';
                    trendHtml = `<span class="trend-arrow ${cls}" title="เทียบสัปดาห์ก่อน (${prevTotal.toFixed(1)})">${icon}${Math.abs(diffPct).toFixed(0)}%</span>`;
                }
            }

            if (totalMC > 0) cell.innerHTML = `${totalMC.toFixed(1)}${trendHtml}<br><span class="pcs-text">${totalPcs.toLocaleString()}</span>`;
            else cell.innerHTML = '-';
        });
    });
}

// รวมจำนวนเครื่องของทุก Model ในกลุ่มที่กำหนด สำหรับวันที่ระบุ (อ่านจาก cellData ตรงๆ ไม่พึ่ง DOM
// เพราะวันที่เทียบ เช่น สัปดาห์ก่อน อาจไม่อยู่ในช่วงคอลัมน์ที่กำลังแสดงผลอยู่ตอนนี้)
function sumModelsForDate(groupsToSum, date) {
    const dayKey = formatDateHeader(date);
    let total = 0;
    groupsToSum.forEach(g => {
        (modelState[g] || []).forEach(m => {
            const v = parseFloat(cellData[`${currentProcess}_${m}_${dayKey}`]);
            if (!isNaN(v)) total += v;
        });
    });
    return total;
}

// === Data Mutations (Admin) ===
async function editGroup(groupId) {
    if (!isAdmin) return;
    let current = (groupLabels[groupId] || '').split('<br>').join('\n');
    let newVal = await showPromptModal('แก้ไขชื่อประเภท (กด Enter เพื่อขึ้นบรรทัดใหม่)', current, { multiline: true, confirmLabel: 'บันทึกชื่อ' });
    if (newVal !== null && newVal.trim() !== '') {
        groupLabels[groupId] = newVal.split('\n').map(s => s.trim()).filter(Boolean).join('<br>');
        markKeyDirty('groupLabels', groupId); generateTable();
    }
}

function updateParam(groupId, field, value) {
    if (!isAdmin) return;
    if (!groupParams[groupId]) groupParams[groupId] = { oa: 80, mct: 2.5 };
    groupParams[groupId][field] = parseFloat(value) || 0;
    markKeyDirty('groupParams', groupId);
    generateTable();
}

async function editModelName(groupId, oldName) {
    if (!isAdmin) return;
    const { base: oldBase, variant: oldVariant } = parseModelDisplay(oldName);
    const result = await showModelNameModal('แก้ไข Model', oldBase, oldVariant);
    if (result === null || result.base === '') return;
    let newName = result.variant ? `${result.base} (${result.variant})` : result.base;
    if (newName === oldName) return;

    if (modelState[groupId].includes(newName)) {
        showToast(result.variant
            ? 'ชื่อ + ชนิด/ทูลลิ่งนี้มีอยู่แล้ว! ลองเปลี่ยนชนิดให้ต่างจากเดิม'
            : 'ชื่อนี้มีอยู่แล้ว! ถ้าเป็นสตัมป์เดียวกันแต่ Cover ต่างกัน ลองใส่ "ชนิด/ทูลลิ่ง" เพิ่มเพื่อแยกกัน เช่น รหัส Cover',
            'error');
        return;
    }

    let idx = modelState[groupId].indexOf(oldName);
    if (idx !== -1) {
        modelState[groupId][idx] = newName;
        markKeyDirty('modelState', groupId);

        Object.keys(cellData).forEach(k => {
            if (k.startsWith(`${currentProcess}_${oldName}_`)) {
                let newKey = k.replace(`${currentProcess}_${oldName}_`, `${currentProcess}_${newName}_`);
                cellData[newKey] = cellData[k]; delete cellData[k];
                markKeyDirty('cellData', k); markKeyDirty('cellData', newKey);
            }
        });

        if (coverData[oldName] !== undefined) {
            coverData[newName] = coverData[oldName]; delete coverData[oldName];
            markKeyDirty('coverData', oldName); markKeyDirty('coverData', newName);
        }
        if (coverColors[oldName] !== undefined) {
            coverColors[newName] = coverColors[oldName]; delete coverColors[oldName];
            markKeyDirty('coverColors', oldName); markKeyDirty('coverColors', newName);
        }
        // ย้าย mapping BOM ของตัวเองไปตามชื่อใหม่ (ตัวที่ชี้มาหาโมเดลนี้จาก process ถัดไปจะซ่อมให้ตอนเปิดจัดการ BOM แทน)
        const oldKey = `${currentProcess}_${oldName}`, newKey = `${currentProcess}_${newName}`;
        if (sourceMap[oldKey] !== undefined) {
            sourceMap[newKey] = sourceMap[oldKey]; delete sourceMap[oldKey];
            markKeyDirty('sourceMap', oldKey); markKeyDirty('sourceMap', newKey);
        }

        generateTable();
    }
}

async function addModel(groupId) {
    if (!isAdmin) return;
    const result = await showModelNameModal('เพิ่ม Model ใหม่');
    if (result === null || result.base === '') return;
    const name = result.variant ? `${result.base} (${result.variant})` : result.base;
    if (modelState[groupId].includes(name)) {
        showToast(result.variant
            ? 'ชื่อ + ชนิด/ทูลลิ่งนี้มีอยู่แล้ว! ลองเปลี่ยนชนิดให้ต่างจากเดิม'
            : 'ชื่อนี้มีอยู่แล้ว! ถ้าเป็นสตัมป์เดียวกันแต่ Cover ต่างกัน ลองใส่ "ชนิด/ทูลลิ่ง" เพิ่มเพื่อแยกกัน เช่น รหัส Cover',
            'error');
        return;
    }
    modelState[groupId].push(name);
    markKeyDirty('modelState', groupId); generateTable();
}

async function delModel(groupId, modelName) {
    if (!isAdmin) return;
    const ok = await showConfirmModal(`ยืนยันลบ Model "${modelName}" ?`, true, 'ลบ');
    if (!ok) return;
    modelState[groupId] = modelState[groupId].filter(m => m !== modelName);
    markKeyDirty('modelState', groupId);
    Object.keys(cellData).forEach(k => {
        if (k.startsWith(`${currentProcess}_${modelName}_`)) { delete cellData[k]; markKeyDirty('cellData', k); }
    });
    delete coverData[modelName]; markKeyDirty('coverData', modelName);
    delete sourceMap[`${currentProcess}_${modelName}`]; markKeyDirty('sourceMap', `${currentProcess}_${modelName}`);
    generateTable();
}

// คำนวณ zoom ให้เนื้อหาพอดี 1 หน้า A4 แนวนอนเสมอ ไม่ว่าจะเหลือกี่แถวหลังซ่อน Model ที่ไม่มีข้อมูล
// ใช้ CSS `zoom` (ไม่ใช่ transform) เพราะ zoom มีผลต่อการจัดหน้า/ตัดหน้าพิมพ์จริงในเบราว์เซอร์ตระกูล Chromium
function fitPrintToPage() {
    const el = document.querySelector('.dashboard-container');
    if (!el) return;
    el.style.zoom = '1';
    const naturalWidth = el.scrollWidth;
    const naturalHeight = el.scrollHeight;
    const pxPerMm = 96 / 25.4;
    const pageWidthPx = (297 - 10) * pxPerMm;  // A4 landscape - margin 5mm ต่อข้าง
    const pageHeightPx = (210 - 10) * pxPerMm;
    let scale = Math.min(pageWidthPx / naturalWidth, pageHeightPx / naturalHeight, 1);
    if (!isFinite(scale) || scale <= 0) scale = 1;
    el.style.zoom = scale;
}

// เตรียมหน้าให้พร้อมพิมพ์ (ซ่อน Model ว่าง + fit เข้า A4) — ใช้ร่วมกันทั้งตอนพิมพ์จริงและตอน preview ในโมดอล
// ซ่อนแถว Model ที่ไม่มีข้อมูล (ใช้ทั้งตอนพิมพ์และตอนกดปุ่ม "ซ่อน Model ว่าง" บนหน้าจอปกติ)
// hideClass = ชื่อ class ที่จะเติมให้แถวที่ต้องซ่อน, hideEmptyTotals = ให้ซ่อนแถว Total ที่ไม่มีค่าด้วยหรือไม่
function hideEmptyModelRows(hideClass, hideEmptyTotals) {
    document.querySelectorAll('#mainTable tbody').forEach(tbody => {
        let modelVisibleCount = 0; let visibleCount = 0; let firstVisibleRow = null; let groupCell = tbody.querySelector('.col-group');
        let rows = tbody.querySelectorAll('tr:not(.no-print)');

        rows.forEach(row => {
            if (row.classList.contains('total-row') || row.classList.contains('hrs-row')) return;
            // ต้องเจาะจงแค่ input.table-input (ช่องกรอกจำนวนเครื่องต่อวัน) เท่านั้น ไม่งั้นตอน Admin login
            // อยู่ ช่อง OA%/MCT ใน param-box (เป็น input type=number เหมือนกัน) จะถูกนับเป็น "มีข้อมูล" ไปด้วย
            let inputs = row.querySelectorAll('input.table-input[type="number"]'); let hasData = Array.from(inputs).some(inp => inp.value.trim() !== '' && parseFloat(inp.value) !== 0);
            if (!hasData && inputs.length > 0) row.classList.add(hideClass);
            else { modelVisibleCount++; visibleCount++; if (!firstVisibleRow) firstVisibleRow = row; }
        });

        // หมายเหตุ: ถ้ากลุ่มนี้ไม่มี Model ไหนมีข้อมูลเลย (modelVisibleCount===0) จะไม่ซ่อนทั้ง tbody
        // เพราะแถว Total/Grand Total อาจยังมีข้อมูลจากกลุ่มอื่นรวมอยู่ — ช่องชื่อกลุ่มจะถูกซ่อนไปเองเพราะ
        // อยู่ในแถว Model แถวแรกซึ่งถูกซ่อนอยู่แล้วเมื่อไม่มีข้อมูล
        if (modelVisibleCount > 0) {
            let hrsRow = tbody.querySelector('.hrs-row'); if (hrsRow) visibleCount++;
            if (groupCell) { groupCell.setAttribute('data-original-rowspan', groupCell.rowSpan); groupCell.rowSpan = visibleCount; if (firstVisibleRow && firstVisibleRow !== groupCell.parentElement) { firstVisibleRow.insertBefore(groupCell, firstVisibleRow.firstChild); groupCell.setAttribute('data-moved', 'true'); } }
        }
    });

    if (hideEmptyTotals) {
        // ซ่อนแถว Total/Grand Total ที่ไม่มีค่าเลยสักคอลัมน์ (โชว์ "-" ทุกช่อง) — ไม่มีประโยชน์ที่จะแสดง
        document.querySelectorAll('.total-row').forEach(row => {
            const cells = row.querySelectorAll('.tot-cell');
            const allEmpty = cells.length > 0 && Array.from(cells).every(c => c.innerText.trim() === '-' || c.innerText.trim() === '');
            if (allEmpty) row.classList.add(hideClass);
        });
    }
}

function prepareContentForPrint() {
    if (currentProcess !== 'Overview') hideEmptyModelRows('hide-on-print', true);
    fitPrintToPage();
}

function restoreContentAfterPrint() {
    document.querySelectorAll('.hide-on-print').forEach(el => el.classList.remove('hide-on-print'));
    document.querySelectorAll('#mainTable tbody').forEach(tbody => {
        let groupCell = tbody.querySelector('.col-group');
        if (groupCell) { if (groupCell.hasAttribute('data-original-rowspan')) groupCell.rowSpan = groupCell.getAttribute('data-original-rowspan'); if (groupCell.hasAttribute('data-moved')) { let firstRow = tbody.querySelector('tr'); firstRow.insertBefore(groupCell, firstRow.firstChild); groupCell.removeAttribute('data-moved'); } }
    });
    const el = document.querySelector('.dashboard-container');
    if (el) el.style.zoom = '';
}

window.addEventListener('beforeprint', prepareContentForPrint);
window.addEventListener('afterprint', restoreContentAfterPrint);

// === Viewer presence (แสดงจำนวนคนกำลังดูอยู่) ===
function getClientId() {
    let id = sessionStorage.getItem('master_plan_client_id');
    if (!id) { id = 'c' + Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem('master_plan_client_id', id); }
    return id;
}
async function sendHeartbeat() {
    try {
        const res = await fetch('/api/heartbeat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientId: getClientId() }) });
        const data = await res.json();
        updateViewerCountUI(data.viewerCount);
    } catch (e) { /* ไม่ใช่ฟีเจอร์สำคัญ ปล่อยเงียบถ้าพลาด */ }
}
function updateViewerCountUI(count) {
    const wrap = document.getElementById('viewerCount'); const num = document.getElementById('viewerCountNum');
    if (!wrap || !num || typeof count !== 'number') return;
    num.innerText = count;
    wrap.style.display = count >= 1 ? 'flex' : 'none';
}

// === ค้นหา/กรอง Model ===
function filterModels(query) {
    const q = query.trim().toLowerCase();
    if (currentProcess === 'Stock') {
        renderStockPage(); // การกรอง/ไฮไลต์ตามคำค้นหาทำอยู่ในนี้แล้ว (กางทุกกลุ่มให้อัตโนมัติตอนกำลังค้นหา)
        return;
    }
    document.querySelectorAll('#mainTable tbody tr').forEach(row => {
        if (row.classList.contains('total-row') || row.classList.contains('hrs-row') || row.classList.contains('no-print')) return;
        const name = row.dataset.modelName || '';
        if (!name) return;
        row.style.opacity = (!q || name.toLowerCase().includes(q)) ? '1' : '0.2';
    });
}

// === Undo / Redo สำหรับช่องจำนวนเครื่อง (Ctrl+Z / Ctrl+Y) ===
let undoStack = []; let redoStack = [];
function pushUndo(key, oldValue) {
    undoStack.push({ key, oldValue });
    if (undoStack.length > 50) undoStack.shift();
    redoStack = [];
}
function undoEdit() {
    if (!isAdmin || undoStack.length === 0) return;
    const op = undoStack.pop();
    redoStack.push({ key: op.key, oldValue: cellData[op.key] || '' });
    if (op.oldValue) cellData[op.key] = op.oldValue; else delete cellData[op.key];
    markKeyDirty('cellData', op.key); generateTable();
    showToast('เลิกทำ (Undo) แล้ว', 'info', 1800);
}
function redoEdit() {
    if (!isAdmin || redoStack.length === 0) return;
    const op = redoStack.pop();
    undoStack.push({ key: op.key, oldValue: cellData[op.key] || '' });
    if (op.oldValue) cellData[op.key] = op.oldValue; else delete cellData[op.key];
    markKeyDirty('cellData', op.key); generateTable();
    showToast('ทำซ้ำ (Redo) แล้ว', 'info', 1800);
}
document.addEventListener('keydown', (e) => {
    if (!isAdmin || document.querySelector('.modal-overlay')) return;
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && k === 'z') { e.preventDefault(); undoEdit(); }
    else if ((e.ctrlKey || e.metaKey) && (k === 'y' || (e.shiftKey && k === 'z'))) { e.preventDefault(); redoEdit(); }
});

// === เลื่อนช่องกรอกด้วยลูกศร แบบ Excel ===
function handleCellArrowNav(e, currentInput) {
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const allInputs = Array.from(document.querySelectorAll('#mainTable .table-input'));
    const idx = allInputs.indexOf(currentInput);
    if (idx === -1) return;
    let targetIdx = idx;
    if (e.key === 'ArrowLeft') targetIdx = idx - 1;
    else if (e.key === 'ArrowRight') targetIdx = idx + 1;
    else if (e.key === 'ArrowUp') targetIdx = idx - viewDays;
    else if (e.key === 'ArrowDown') targetIdx = idx + viewDays;
    const target = allInputs[targetIdx];
    if (target) { e.preventDefault(); target.focus(); target.select(); }
}

// === Export CSV (เปิดใน Excel ได้เลย) ===
function exportCSV() {
    const table = document.getElementById('mainTable');
    if (!table) return;
    const rows = [];
    table.querySelectorAll('tr').forEach(tr => {
        if (tr.classList.contains('no-print')) return;
        const cells = Array.from(tr.children).map(td => {
            let text = td.querySelector('input') ? td.querySelector('input').value : td.innerText.split('\n')[0];
            return `"${(text || '').replace(/"/g, '""')}"`;
        });
        rows.push(cells.join(','));
    });
    const csv = '﻿' + rows.join('\r\n'); // ใส่ BOM กัน Excel อ่านภาษาไทยเพี้ยน
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${currentProcess}_MC_Plan_${formatDateHeader(new Date(document.getElementById('startDatePicker').value))}.csv`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// === Preview ก่อนพิมพ์จริง ===
function openPrintPreview() {
    // Overview/Stock ยังไม่มี layout สำหรับ preview พิเศษ (ไม่มี Model ให้ซ่อน) พิมพ์ตรงได้เลย
    if (currentProcess === 'Overview' || currentProcess === 'Stock') { window.print(); return; }
    const root = document.getElementById('printPreviewRoot');
    const src = `${location.pathname}?process=${currentProcess}&viewDays=${viewDays}&forcePrintPreview=1`;
    root.innerHTML = `
        <div class="print-preview-overlay" id="printPreviewOverlay">
            <div class="print-preview-box">
                <div class="print-preview-header">
                    <h3><i class="fas fa-file-pdf"></i> ตัวอย่างก่อนพิมพ์ — ${processConfig[currentProcess].title}</h3>
                    <button class="btn-action" onclick="closePrintPreview()"><i class="fas fa-times"></i></button>
                </div>
                <div class="print-preview-body">
                    <iframe id="printPreviewIframe" src="${src}"></iframe>
                </div>
                <div class="print-preview-footer">
                    <button class="modal-btn modal-btn-cancel" onclick="closePrintPreview()">ปิด</button>
                    <button class="modal-btn modal-btn-confirm" onclick="confirmPrintFromPreview()"><i class="fas fa-print"></i> พิมพ์จริง</button>
                </div>
            </div>
        </div>`;
}
function closePrintPreview() { document.getElementById('printPreviewRoot').innerHTML = ''; }
function confirmPrintFromPreview() {
    const iframe = document.getElementById('printPreviewIframe');
    if (iframe && iframe.contentWindow) iframe.contentWindow.print();
}

// === โหมดจอรวม/ทีวี (Kiosk mode) — สลับแสดง Stock/BW/LC/CW วนอัตโนมัติ เหมาะติดจอหน้าไลน์ผลิต ===
let kioskTimer = null;
const KIOSK_ROTATE_SEQUENCE = ['Stock', 'BW', 'LC', 'CW'];
const KIOSK_ROTATE_MS = 12000;

function enterKioskMode() {
    document.body.classList.add('kiosk-mode');
    if (document.documentElement.requestFullscreen) { document.documentElement.requestFullscreen().catch(() => { /* ต้องมาจาก user gesture เท่านั้น ถ้าไม่ได้ก็ไม่เป็นไร */ }); }
    let idx = KIOSK_ROTATE_SEQUENCE.indexOf(currentProcess);
    if (idx === -1) idx = 0;
    if (kioskTimer) clearInterval(kioskTimer);
    kioskTimer = setInterval(() => {
        idx = (idx + 1) % KIOSK_ROTATE_SEQUENCE.length;
        switchProcess(KIOSK_ROTATE_SEQUENCE[idx]);
    }, KIOSK_ROTATE_MS);
    showToast('เข้าโหมดจอรวมแล้ว — กด Esc เพื่อออก', 'info', 3000);
}

function exitKioskMode() {
    document.body.classList.remove('kiosk-mode');
    if (kioskTimer) { clearInterval(kioskTimer); kioskTimer = null; }
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
}

function toggleKioskMode() {
    if (document.body.classList.contains('kiosk-mode')) exitKioskMode(); else enterKioskMode();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('kiosk-mode')) exitKioskMode();
});

// === Boot ===
async function boot() {
    const ok = await loadStateFromServer();
    if (!ok) showToast('เชื่อมต่อ server ไม่ได้ ตรวจสอบว่า server เปิดอยู่หรือไม่', 'error', 6000);
    document.getElementById('startDatePicker').addEventListener('change', handleDateChange);
    updateAdminUI();
    updateHideEmptyBtnUI();
    const params = new URLSearchParams(location.search);
    const requestedProcess = params.get('process');
    const startProcess = ['Overview', 'Stock', 'BW', 'LC', 'CW'].includes(requestedProcess) ? requestedProcess : 'Stock';
    const requestedViewDays = parseInt(params.get('viewDays'), 10);
    if ([1, 7, 30].includes(requestedViewDays)) viewDays = requestedViewDays;
    switchProcess(startProcess);
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'none';

    // โหมด preview ก่อนพิมพ์จริง — เปิดผ่าน iframe จาก openPrintPreview() โดยเพิ่ม query นี้
    // เป็น snapshot นิ่งๆ ไว้ดูก่อนพิมพ์เท่านั้น — "ไม่" เริ่ม polling/heartbeat เพราะถ้ามีข้อมูลใหม่เข้ามาแล้ว
    // generateTable() ถูกเรียกซ้ำ จะไปลบสถานะ hide-on-print ที่เพิ่งซ่อน Model/Total ว่างๆ ไว้ทิ้งไปเฉยๆ
    if (params.get('forcePrintPreview') === '1') {
        document.body.classList.add('print-preview-active');
        prepareContentForPrint();
        return;
    }

    startPolling();
    sendHeartbeat();

    // เปิดตรงเข้าโหมดจอรวมได้เลยผ่าน ?kiosk=1 — เหมาะสำหรับ bookmark ไว้ที่จอทีวี/จอรวมหน้าไลน์ผลิต
    if (params.get('kiosk') === '1') enterKioskMode();
}

boot().catch(e => console.error(e));

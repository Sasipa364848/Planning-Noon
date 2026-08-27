const fs = require('fs');
const path = require('path');
const express = require('express');
const bcrypt = require('bcryptjs');

const CONFIG_PATH = path.join(__dirname, 'config.json');
const DATA_PATH = path.join(__dirname, 'data', 'store.json');
const USERS_PATH = path.join(__dirname, 'users.json');

// ---- Default seed data (ย้ายมาจากค่าเริ่มต้นเดิมในไฟล์ HTML ตัวเก่า) ----
const defaultGroupLabels = {
    'bw_dg1_esd': 'DG1(ESD)', 'bw_dg1': 'DG1', 'bw_dg1_mini': 'DG1-Mini<br>(ESD)', 'bw_dg2_esd': 'DG2-ESD',
    'lc_std_normal': 'DG1-Normal<br>STD type', 'lc_std_mini': 'DG1-Mini STD<br>type', 'lc_low_normal': 'DG1-Normal<br>Low type', 'lc_low_mini': 'DG1-Mini Low<br>type', 'lc_dg2': 'DG2-ESD',
    'cw_dg1_normal': 'DG1-Normal Support Mold', 'cw_dg1_mini': 'DG1-Mini Support Mold',
    'cw_new_type_1': 'FET-K DG1 Normal', 'cw_new_type_2': 'FET-K DG1 Mini',
    'cw_dg2_esd': 'DG2 ESD'
};

const initialModels = {
    'bw_dg1_esd': ['E303-ESD', 'H302-ESD', 'Z300-ESD', 'E304-ESD'], 'bw_dg1': ['P303', 'E303', 'H302', 'E304'], 'bw_dg1_mini': ['E308 ESD', 'E309 ESD', 'E310 ESD'], 'bw_dg2_esd': ['L470-2'],
    'lc_std_normal': ['X3', 'G3', 'S3', 'Q4', 'S4', 'G4'], 'lc_std_mini': ['G2', 'G1', 'X1', 'X2', 'S2', 'S1'], 'lc_low_normal': ['D3', 'H3', 'E4', 'Z3', 'W4', 'Y3'], 'lc_low_mini': ['A2', 'F2', 'Y2', 'Y1', 'Z1', 'Z2', 'C2'], 'lc_dg2': ['2 (HD Evac)'],
    'cw_dg1_normal': ['D3', 'G3', 'G3-Brown', 'G4', 'X3', 'X3-Brown', 'S3', 'S3-Brown', 'H3'],
    'cw_dg1_mini': ['G2', 'G1', 'G2-Brown', 'X2_Auto', 'X2', 'X1', 'X2-Brown', 'S2_Yellow Auto', 'S2 (1)', 'S1', 'S2 (2)', 'S2-Green', 'Y1_กล่องดำ', 'Y1-Auto', 'Y2 กล่องดำ', 'A2', 'F2'],
    'cw_new_type_1': ['Z3 (EK)', 'H3 (DSS2)', 'X3 (DSS2)', 'G3 (DSTC)', 'G4 (DSS2)', 'S4 (DSS2)', 'S3 (DSS2)', 'S3 (DSTC)', 'E4 (DSS2)', 'E4 (DSTC)', 'W4 (DSTC)', 'Q4 (DSS2)'],
    'cw_new_type_2': ['G2 (FM61-4)', 'Z2 (EK)', 'Z1 (DSSI)', 'Z2 (DSTC)', 'C2(Brown) (DSS2)', 'C2(Green) (DSS2)', 'X2(Yellow) (DSTC)', 'X2(Green) (DSTC)', 'X1(Brown) (DSS2)'],
    'cw_dg2_esd': ['2-Cover_กล่องดำ', '2 Nocover', '2 Cover Auto', '2 No cover Auto']
};

const initialCovers = {
    'G3': 'E105', 'G4': 'E105', 'X3': 'E105', 'S3': 'E105',
    'G2': 'E118', 'G1': 'E118', 'G2-Brown': 'E117', 'X2_Auto': 'E118', 'X2': 'E118', 'X1': 'E118', 'X2-Brown': 'E117', 'S2_Yellow Auto': 'E118', 'S2 (1)': 'E118', 'S1': 'E118', 'S2 (2)': 'E117', 'S2-Green': 'E119', 'Y1_กล่องดำ': 'E120', 'Y1-Auto': 'E120', 'Y2 กล่องดำ': 'E120', 'A2': 'E121', 'F2': 'E120',
    'G2 (FM61-4)': 'E118', 'Z2 (EK)': 'E120', 'Z1 (DSSI)': 'E120', 'Z2 (DSTC)': 'E120', 'C2(Brown) (DSS2)': 'E120', 'C2(Green) (DSS2)': 'E121', 'X2(Yellow) (DSTC)': 'E118', 'X2(Green) (DSTC)': 'E119', 'X1(Brown) (DSS2)': 'E117',
    '2-Cover_กล่องดำ': 'Evac', '2 Cover Auto': 'Evac', '2 No cover Auto': 'Evac'
};

const initialCoverColors = {
    'G2-Brown': '#d35400', 'X2-Brown': '#d35400', 'S2 (2)': '#d35400', 'S2-Green': '#27ae60', 'Y1_กล่องดำ': '#d35400', 'Y2 กล่องดำ': '#d35400', 'A2': '#27ae60', 'F2': '#d35400',
    'C2(Brown) (DSS2)': '#d35400', 'C2(Green) (DSS2)': '#27ae60', 'X2(Green) (DSTC)': '#27ae60', 'X1(Brown) (DSS2)': '#d35400'
};

const PROCESS_TITLES = { BW: 'M/C Plan of BW process', LC: 'M/C Plan of LC process', CW: 'M/C Plan of CW process' };

function defaultState() {
    return {
        modelState: JSON.parse(JSON.stringify(initialModels)),
        groupLabels: JSON.parse(JSON.stringify(defaultGroupLabels)),
        cellData: {},
        cellComments: {},
        coverData: JSON.parse(JSON.stringify(initialCovers)),
        coverColors: JSON.parse(JSON.stringify(initialCoverColors)),
        revData: { LC: '00', BW: '00', CW: '00' },
        groupParams: {},
        hrsData: {},
        timestamps: { BW: '-', LC: '-', CW: '-' },
        lastEditor: { BW: '', LC: '', CW: '' },
        changeLog: [],
        changeLogSeq: 0,
        announcements: [],
        stockData: {},
        sourceMap: {},
        plannedUsedData: {},
        coverCodeColors: {}
    };
}

// key เดิมมีรูปแบบ `${process}_${modelName}_${day}` — ตัวชื่อ Model เองอาจมี "_" ปนอยู่ (เช่น 'X2_Auto')
// จึงตัดเอาแค่ตัวแรก (process) กับตัวสุดท้าย (day) ออก ที่เหลือตรงกลางคือชื่อ Model ทั้งหมด
function parseCellKey(key) {
    const parts = key.split('_');
    return { process: parts[0], model: parts.slice(1, -1).join('_'), day: parts[parts.length - 1] };
}

function defaultConfig() {
    return {
        port: 3000,
        adminPassword: 'changeme',
        teamsWebhookUrl: ''
    };
}

function loadJson(filePath, fallbackFn) {
    if (fs.existsSync(filePath)) {
        try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
        catch (e) { console.error(`อ่านไฟล์ ${filePath} ไม่ได้ (${e.message}) จะสร้างค่าเริ่มต้นใหม่`); }
    }
    const fallback = fallbackFn();
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf8');
    return fallback;
}

let state = loadJson(DATA_PATH, defaultState);
let config = loadJson(CONFIG_PATH, defaultConfig);

function saveState() {
    fs.writeFileSync(DATA_PATH, JSON.stringify(state, null, 2), 'utf8');
}

// ---- ระบบ user รายคน + บทบาท (แทนที่รหัสผ่านเดียวใช้ร่วมกันแบบเดิม) ----
// role: 'admin' เข้าถึง/แก้ไขได้ทุกอย่าง, 'process' แก้ไขได้เฉพาะ process ที่ระบุใน processes เช่น ['BW'] หรือ ['Stock']
const PROCESS_KEYS = ['BW', 'LC', 'CW', 'Stock'];

function saveUsers() {
    fs.writeFileSync(USERS_PATH, JSON.stringify(users, null, 2), 'utf8');
}

// ครั้งแรกที่รันหลังอัปเดต (ยังไม่มี users.json) ให้สร้าง user "admin" จากรหัสผ่านเดิมใน config.json
// เพื่อไม่ให้ของเดิมที่เคยใช้อยู่ล็อกอินไม่ได้
let users;
if (fs.existsSync(USERS_PATH)) {
    users = JSON.parse(fs.readFileSync(USERS_PATH, 'utf8'));
} else {
    users = [{ username: 'admin', passwordHash: bcrypt.hashSync(config.adminPassword || 'changeme', 10), role: 'admin', processes: [] }];
    saveUsers();
    console.log('[Users] สร้างไฟล์ users.json ใหม่ พร้อม user "admin" จากรหัสผ่านเดิมใน config.json');
}

function findUser(username) {
    return users.find(u => u.username === username);
}

function verifyCredentials(username, password) {
    const u = findUser(username);
    if (!u || typeof password !== 'string') return null;
    return bcrypt.compareSync(password, u.passwordHash) ? u : null;
}

// แยกว่า key ของ object แต่ละแบบ (cellData, hrsData, groupParams ฯลฯ) เป็นของ process ไหน
// ใช้ตอนกรองว่า user ที่ถูกจำกัดสิทธิ์ตาม process จะแก้ไขได้เฉพาะ key ของ process ตัวเองเท่านั้น
function deriveKeyProcess(objName, key) {
    if (objName === 'revData') return key; // key คือชื่อ process ('BW'/'LC'/'CW') ตรงๆ อยู่แล้ว
    if (objName === 'groupParams' || objName === 'modelState' || objName === 'groupLabels') {
        const lower = key.toLowerCase();
        if (lower.startsWith('bw')) return 'BW';
        if (lower.startsWith('lc')) return 'LC';
        if (lower.startsWith('cw')) return 'CW';
        return null;
    }
    // cellData, cellComments, hrsData: รูปแบบ key คือ `${proc}_...`
    return key.split('_')[0];
}

// รับ "patch" คือ object ที่มีเฉพาะ key ที่ client แก้ไขจริงรอบนี้เท่านั้น (ไม่ใช่ก้อนข้อมูลทั้งหมดเหมือนเดิม)
// ค่า null หมายถึง "ลบ key นี้ทิ้ง" (ผู้ใช้ลบข้อมูลในช่องนั้น) ส่วน key ที่ผู้ใช้ไม่ได้แตะจะไม่ปรากฏใน patch เลย
// เพราะรับแค่ patch จึงไม่ไปทับ/ลบ key อื่นที่ผู้ใช้อีกคนเพิ่งบันทึกไปก่อนหน้า (แก้ปัญหา 2 คนบันทึกพร้อมกันแล้วข้อมูลหาย)
function applyPatch(objName, patchObj) {
    if (!state[objName]) state[objName] = {};
    Object.keys(patchObj).forEach(k => {
        if (patchObj[k] === null) delete state[objName][k];
        else state[objName][k] = patchObj[k];
    });
}

// กรอง patch ให้เหลือเฉพาะ key ที่ derive แล้วตรงกับ process ที่ user คนนี้ได้รับมอบหมาย (ป้องกันชั้นที่ 2 ฝั่ง server แม้ client จะล็อกช่องไว้แล้วก็ตาม)
function filterPatchByProcess(objName, patchObj, allowedProcesses) {
    const filtered = {};
    Object.keys(patchObj).forEach(k => {
        const kProc = deriveKeyProcess(objName, k);
        if (kProc && allowedProcesses.includes(kProc)) filtered[k] = patchObj[k];
    });
    return filtered;
}

// เติม field ใหม่ที่เพิ่มเข้ามาทีหลัง (เช่น lastEditor, changeLog) ให้ไฟล์ data เก่าที่มีอยู่แล้วก่อนหน้านี้
// โดยไม่ไปแตะข้อมูลเดิมที่มีอยู่แล้ว — กันปัญหาฟีเจอร์ใหม่เงียบๆ ไม่ทำงานเพราะไฟล์เก่าไม่มี field นั้น
(function migrateState() {
    const defaults = defaultState();
    let changed = false;
    Object.keys(defaults).forEach(key => {
        if (!(key in state)) { state[key] = defaults[key]; changed = true; }
    });
    if (changed) saveState();
})();

async function notifyTeams(text) {
    if (!config.teamsWebhookUrl) {
        console.log('[Teams] ยังไม่ได้ตั้งค่า teamsWebhookUrl ใน config.json — ข้ามการแจ้งเตือน');
        return;
    }
    try {
        const res = await fetch(config.teamsWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        if (!res.ok) console.error('[Teams] ส่งแจ้งเตือนไม่สำเร็จ:', res.status, await res.text());
    } catch (e) {
        console.error('[Teams] ส่งแจ้งเตือนล้มเหลว:', e.message);
    }
}

// จำนวนคนที่กำลังเปิดหน้าเว็บอยู่ — เก็บใน memory เท่านั้น (ไม่บันทึกลงไฟล์ เพราะเป็นข้อมูลชั่วคราว)
// แต่ละ browser tab ส่ง heartbeat มาเรื่อยๆ ตอน poll ทุก 15 วินาที ถ้าเงียบไปเกิน 30 วินาทีถือว่าปิดหน้าไปแล้ว
const activeSessions = new Map(); // clientId -> lastSeen (ms epoch)
const VIEWER_TIMEOUT_MS = 30000;
function countActiveViewers() {
    const now = Date.now();
    for (const [id, lastSeen] of activeSessions) { if (now - lastSeen > VIEWER_TIMEOUT_MS) activeSessions.delete(id); }
    return activeSessions.size;
}

const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/heartbeat', (req, res) => {
    const { clientId } = req.body || {};
    if (clientId) activeSessions.set(clientId, Date.now());
    res.json({ ok: true, viewerCount: countActiveViewers() });
});

app.get('/api/state', (req, res) => {
    res.json({ ...state, viewerCount: countActiveViewers() });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body || {};
    const u = verifyCredentials(username, password);
    if (!u) return res.json({ ok: false });
    res.json({ ok: true, username: u.username, role: u.role, processes: u.processes || [] });
});

// จัดการ user (เฉพาะ admin) — ส่งรหัสผ่าน admin ของตัวเองมายืนยันตัวตนทุกครั้งเหมือน endpoint อื่นๆ ในระบบนี้
function requireAdmin(req, res) {
    const { username, password } = req.body || {};
    const u = verifyCredentials(username, password);
    if (!u || u.role !== 'admin') { res.status(401).json({ ok: false, error: 'ต้องเป็น Admin เท่านั้น' }); return null; }
    return u;
}

app.post('/api/users/list', (req, res) => {
    if (!requireAdmin(req, res)) return;
    res.json({ ok: true, users: users.map(u => ({ username: u.username, role: u.role, processes: u.processes || [] })) });
});

app.post('/api/users/add', (req, res) => {
    if (!requireAdmin(req, res)) return;
    const { newUsername, newPassword, role, processes } = req.body || {};
    if (!newUsername || !newPassword || !['admin', 'process'].includes(role)) {
        return res.status(400).json({ ok: false, error: 'ข้อมูล user ไม่ครบหรือไม่ถูกต้อง' });
    }
    if (findUser(newUsername)) return res.status(400).json({ ok: false, error: 'มีชื่อ user นี้อยู่แล้ว' });
    const validProcesses = Array.isArray(processes) ? processes.filter(p => PROCESS_KEYS.includes(p)) : [];
    users.push({ username: newUsername, passwordHash: bcrypt.hashSync(newPassword, 10), role, processes: role === 'admin' ? [] : validProcesses });
    saveUsers();
    res.json({ ok: true });
});

app.post('/api/users/update', (req, res) => {
    if (!requireAdmin(req, res)) return;
    const { targetUsername, newPassword, role, processes } = req.body || {};
    const target = findUser(targetUsername);
    if (!target) return res.status(404).json({ ok: false, error: 'ไม่พบ user นี้' });
    if (role) {
        if (!['admin', 'process'].includes(role)) return res.status(400).json({ ok: false, error: 'role ไม่ถูกต้อง' });
        target.role = role;
    }
    if (processes !== undefined) {
        target.processes = (target.role === 'admin') ? [] : (Array.isArray(processes) ? processes.filter(p => PROCESS_KEYS.includes(p)) : []);
    }
    if (newPassword) target.passwordHash = bcrypt.hashSync(newPassword, 10);
    saveUsers();
    res.json({ ok: true });
});

app.post('/api/users/delete', (req, res) => {
    const requester = requireAdmin(req, res);
    if (!requester) return;
    const { targetUsername } = req.body || {};
    if (targetUsername === requester.username) return res.status(400).json({ ok: false, error: 'ลบบัญชีตัวเองไม่ได้' });
    const remainingAdmins = users.filter(u => u.role === 'admin' && u.username !== targetUsername).length;
    if (remainingAdmins < 1) return res.status(400).json({ ok: false, error: 'ต้องมี Admin เหลืออย่างน้อย 1 คน' });
    users = users.filter(u => u.username !== targetUsername);
    saveUsers();
    res.json({ ok: true });
});

// key แบบ {key: value} ที่รับเป็น patch ได้ (ทั้งหมดนี้ patch ทีละ key ไม่ทับทั้ง object แล้ว)
const PATCHABLE_KEYS = ['modelState', 'groupLabels', 'cellData', 'cellComments', 'coverData', 'coverColors', 'coverCodeColors', 'revData', 'groupParams', 'hrsData', 'stockData', 'sourceMap', 'plannedUsedData'];
// key ที่ user แบบ 'process' (ไม่ใช่ admin) แก้ไขได้ตาม process ที่ได้รับมอบหมาย — coverData/coverColors/coverCodeColors/sourceMap เป็นเรื่องโครงสร้าง ให้ admin เท่านั้น
const PROCESS_SCOPED_KEYS = ['modelState', 'groupLabels', 'cellData', 'cellComments', 'revData', 'groupParams', 'hrsData'];

app.post('/api/save', (req, res) => {
    const { username, password, editor, process: proc, state: incoming } = req.body || {};
    const user = verifyCredentials(username, password);
    if (!user) {
        return res.status(401).json({ ok: false, error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณา Login ใหม่' });
    }
    if (!incoming || typeof incoming !== 'object') {
        return res.status(400).json({ ok: false, error: 'ไม่มีข้อมูลที่จะบันทึก' });
    }
    const isAdminUser = user.role === 'admin';
    if (!isAdminUser && !(proc && (user.processes || []).includes(proc))) {
        return res.status(403).json({ ok: false, error: `คุณไม่มีสิทธิ์แก้ไขข้อมูลส่วน ${proc || ''}` });
    }

    // หา Model ที่ค่าเปลี่ยนจริง ไว้ทำ log แจ้งเตือนแบบเจาะจงว่า model ไหนอัปเดต — ตอนนี้ incoming.cellData เป็น patch
    // (มีแค่ key ที่เปลี่ยนจริงอยู่แล้ว) จึงไม่ต้อง diff เทียบกับของเดิมอีกต่อไป
    const changedModels = new Set();
    if (incoming.cellData && typeof incoming.cellData === 'object') {
        Object.keys(incoming.cellData).forEach(key => {
            if (isAdminUser || deriveKeyProcess('cellData', key) === proc) changedModels.add(parseCellKey(key).model);
        });
    }

    if (isAdminUser) {
        PATCHABLE_KEYS.forEach(key => {
            if (incoming[key] && typeof incoming[key] === 'object') applyPatch(key, incoming[key]);
        });
        if (incoming.announcements) state.announcements = incoming.announcements; // ก้อนเล็ก แก้ได้แค่ admin คนเดียว ทับทั้งก้อนได้โดยไม่เสี่ยง
    } else {
        const allowed = user.processes || [];
        PROCESS_SCOPED_KEYS.forEach(key => {
            if (incoming[key] && typeof incoming[key] === 'object') applyPatch(key, filterPatchByProcess(key, incoming[key], allowed));
        });
        if (allowed.includes('Stock')) {
            if (incoming.stockData && typeof incoming.stockData === 'object') applyPatch('stockData', incoming.stockData);
            if (incoming.plannedUsedData && typeof incoming.plannedUsedData === 'object') applyPatch('plannedUsedData', incoming.plannedUsedData);
        }
        // coverData, coverColors, coverCodeColors, announcements, sourceMap (BOM): user แบบจำกัดสิทธิ์แก้ไขไม่ได้ ข้ามไปเงียบๆ
    }

    const now = new Date();
    const timeStr = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-GB');
    const who = (editor && editor.trim()) ? editor.trim() : 'ไม่ระบุชื่อ';
    if (proc && state.timestamps) state.timestamps[proc] = timeStr;
    if (proc && state.lastEditor) state.lastEditor[proc] = who;

    // สร้าง log ทุกครั้งที่มีการกดบันทึก แม้ค่าตัวเลขเครื่องจักรจะไม่เปลี่ยน (เช่น แก้แค่ Cover/Rev/Hrs)
    // เพื่อให้กระดิ่งแจ้งเตือนรู้เสมอว่า process ไหนถูกบันทึกไปเมื่อไหร่ โดยใคร
    let changeEntry = null;
    if (proc) {
        state.changeLogSeq = (state.changeLogSeq || 0) + 1;
        changeEntry = { seq: state.changeLogSeq, process: proc, models: Array.from(changedModels), editor: who, username: user.username, time: timeStr };
        state.changeLog = state.changeLog || [];
        state.changeLog.push(changeEntry);
        if (state.changeLog.length > 200) state.changeLog = state.changeLog.slice(-200);
    }

    saveState();
    const procTitle = PROCESS_TITLES[proc] || proc || 'ระบบ';
    const willNotify = !!config.teamsWebhookUrl;
    const modelsText = changedModels.size > 0 ? Array.from(changedModels).join(', ') : '';
    notifyTeams(`🔔 **Master M/C Plan** มีการอัปเดตข้อมูล\n\n- ส่วน: **${procTitle}**${modelsText ? `\n- Model: ${modelsText}` : ''}\n- โดย: ${who}\n- เวลา: ${timeStr}`);

    res.json({ ok: true, timestamp: timeStr, notified: willNotify, changeEntry });
});

app.post('/api/notify-test', async (req, res) => {
    await notifyTeams('✅ ทดสอบการเชื่อมต่อ Teams จาก Master M/C Plan Dashboard สำเร็จ');
    res.json({ ok: true });
});

app.listen(config.port, () => {
    console.log(`Master M/C Plan Dashboard กำลังทำงานที่ http://localhost:${config.port}`);
    console.log('ให้เครื่องอื่นในวง LAN/WiFi เดียวกันเข้าผ่าน IP ของเครื่องนี้ เช่น http://192.168.x.x:' + config.port);
});

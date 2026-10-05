const fs = require('fs');
const path = require('path');
const express = require('express');
const bcrypt = require('bcryptjs');
const repo = require('./db/repository');
const usersRepo = require('./db/users-repository');

const CONFIG_PATH = process.env.CONFIG_PATH ? path.resolve(process.env.CONFIG_PATH) : path.join(__dirname, 'config.json'); // เผื่อรัน instance ทดสอบคู่ขนานด้วย config แยก (เช่น ทดสอบ dbMode:mysql โดยไม่แตะ instance จริงที่รันอยู่)
const DATA_PATH = path.join(__dirname, 'data', 'store.json');
const USERS_PATH = path.join(__dirname, 'users.json');

// ---- Default seed data (ย้ายมาจากค่าเริ่มต้นเดิมในไฟล์ HTML ตัวเก่า) ----
const defaultGroupLabels = {
    'bw_dg1_esd': 'DG1(ESD)', 'bw_dg1': 'DG1', 'bw_dg1_mini': 'DG1-Mini<br>(ESD)', 'bw_dg2_esd': 'DG2-ESD',
    'lc_std_normal': 'DG1-Normal<br>STD type', 'lc_std_mini': 'DG1-Mini STD<br>type', 'lc_low_normal': 'DG1-Normal<br>Low type', 'lc_low_mini': 'DG1-Mini Low<br>type', 'lc_dg2': 'DG2-ESD',
    'cw_dg1_normal': 'DG1-Normal Support Mold', 'cw_dg1_mini': 'DG1-Mini Support Mold',
    'cw_new_type_1': 'FET-K DG1 Normal', 'cw_new_type_2': 'FET-K DG1 Mini',
    'cw_dg2_esd': 'DG2 ESD',
    'ai_t1_t3': 'M/C #T1~#T3', 'ai_i1': 'M/C I1'
};

// AI (Auto Insert): ชื่อ Model ในระบบเก็บเป็น "<groupId>::<ชื่อที่โชว์>" เสมอ (ฝั่ง client เป็นคนแปะ/ถอด prefix นี้)
// เพราะชีตต้นฉบับมี Model ชื่อเดียวกันซ้ำได้ในหลายกลุ่มเครื่อง (เช่น "AC-No cover_Auto" อยู่ทั้งกลุ่ม T1~T3 และ I1)
// แต่ต้องแยกข้อมูลรายวัน/สต็อก/Cover ของแต่ละกลุ่มออกจากกันอิสระ — ระบบเดิมอ้างอิงด้วยชื่อ Model เปล่าๆ ต่อ process เท่านั้น (ไม่รวมกลุ่ม) จึงต้องใส่ groupId เข้าไปในชื่อเพื่อกันชนกัน
const AI_INITIAL_MODELS = {
    'ai_t1_t3': ['AA-Cover', 'AH-Co cover_Auto', 'AK-Cover_Auto', 'AC-No cover_Auto', 'AC-Cover', 'AC-Cover_Auto', 'AD-Cover', 'AE-No cover', 'AE-No Cover_Auto', 'AE-Cover', 'AE-Cover_Auto', 'AF-MarkCover', 'AF-Cover', 'AF-Cover_Auto', 'AH-Cover', 'AK-Cover'].map(n => `ai_t1_t3::${n}`),
    'ai_i1': ['AB-No cover', 'AB-No cover_Auto', 'AC-No cover_Auto', 'AE-No cover', 'AE-No Cover_Auto'].map(n => `ai_i1::${n}`)
};

const initialModels = {
    'bw_dg1_esd': ['E303-ESD', 'H302-ESD', 'Z300-ESD', 'E304-ESD'], 'bw_dg1': ['P303', 'E303', 'H302', 'E304'], 'bw_dg1_mini': ['E308 ESD', 'E309 ESD', 'E310 ESD'], 'bw_dg2_esd': ['L470-2'],
    'lc_std_normal': ['X3', 'G3', 'S3', 'Q4', 'S4', 'G4'], 'lc_std_mini': ['G2', 'G1', 'X1', 'X2', 'S2', 'S1'], 'lc_low_normal': ['D3', 'H3', 'E4', 'Z3', 'W4', 'Y3'], 'lc_low_mini': ['A2', 'F2', 'Y2', 'Y1', 'Z1', 'Z2', 'C2'], 'lc_dg2': ['2 (HD Evac)'],
    'cw_dg1_normal': ['D3', 'G3', 'G3-Brown', 'G4', 'X3', 'X3-Brown', 'S3', 'S3-Brown', 'H3'],
    'cw_dg1_mini': ['G2', 'G1', 'G2-Brown', 'X2_Auto', 'X2', 'X1', 'X2-Brown', 'S2_Yellow Auto', 'S2 (1)', 'S1', 'S2 (2)', 'S2-Green', 'Y1_กล่องดำ', 'Y1-Auto', 'Y2 กล่องดำ', 'A2', 'F2'],
    'cw_new_type_1': ['Z3 (EK)', 'H3 (DSS2)', 'X3 (DSS2)', 'G3 (DSTC)', 'G4 (DSS2)', 'S4 (DSS2)', 'S3 (DSS2)', 'S3 (DSTC)', 'E4 (DSS2)', 'E4 (DSTC)', 'W4 (DSTC)', 'Q4 (DSS2)'],
    'cw_new_type_2': ['G2 (FM61-4)', 'Z2 (EK)', 'Z1 (DSSI)', 'Z2 (DSTC)', 'C2(Brown) (DSS2)', 'C2(Green) (DSS2)', 'X2(Yellow) (DSTC)', 'X2(Green) (DSTC)', 'X1(Brown) (DSS2)'],
    'cw_dg2_esd': ['2-Cover_กล่องดำ', '2 Nocover', '2 Cover Auto', '2 No cover Auto'],
    ...AI_INITIAL_MODELS
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


function defaultState() {
    return {
        modelState: JSON.parse(JSON.stringify(initialModels)),
        groupLabels: JSON.parse(JSON.stringify(defaultGroupLabels)),
        cellData: {},
        cellComments: {},
        coverData: JSON.parse(JSON.stringify(initialCovers)),
        coverColors: JSON.parse(JSON.stringify(initialCoverColors)),
        revData: { LC: '00', BW: '00', CW: '00', AI: '00' },
        groupParams: {},
        hrsData: {},
        timestamps: { BW: '-', LC: '-', CW: '-', AI: '-' },
        lastEditor: { BW: '', LC: '', CW: '', AI: '' },
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
        teamsWebhookUrl: '',
        appUrl: 'http://localhost:3000' // URL ที่ทีมใช้เปิดแดชบอร์ด — แนบไปในข้อความแจ้งเตือน Teams ให้กดเข้ามาดูได้เลย
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

function saveJson(filePath, obj) {
    fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
}

let config = loadJson(CONFIG_PATH, defaultConfig);
// dbMode: 'json' (ค่าเริ่มต้น เดิม) หรือ 'mysql' (ใหม่ — ดู db/repository.js, db/users-repository.js)
// เก็บ path เดิม (JSON) ไว้ครบทุกจุดโดยไม่แตะเลย เผื่อต้อง rollback แค่เปลี่ยนค่านี้กลับแล้ว restart
const DB_MODE = config.dbMode === 'mysql' ? 'mysql' : 'json';
console.log(`[DB] dbMode = ${DB_MODE}`);

let state = DB_MODE === 'json' ? loadJson(DATA_PATH, defaultState) : null;

function saveState() {
    saveJson(DATA_PATH, state);
}

// ธงด่วน (Urgent) ต่อ Model — เก็บแยกเป็นไฟล์ของตัวเองเสมอ ไม่ผ่านตาราง/state หลัก (ไม่ว่า dbMode จะเป็น json หรือ mysql)
// ตามคำขอ: ไม่อยากเพิ่มตารางใหม่ในฐานข้อมูล MySQL ที่ใช้งานจริงอยู่ (digital_transform_db เป็นฐานข้อมูลที่แชร์กับระบบอื่นด้วย)
// คีย์รูปแบบ "<process>_<ชื่อ Model>" เหมือน stockData/plannedUsedData (ดู public/js/app.js urgentKey())
const URGENT_MODELS_PATH = path.join(__dirname, 'data', 'urgent-models.json');
let urgentModels = loadJson(URGENT_MODELS_PATH, () => ({}));

// ช่องแผนที่ล็อกไว้ไม่ให้ Auto Plan เขียนทับ — key เดียวกับ cellData ("LC_<model>_<วันที่>") เก็บไฟล์แยกเหมือน urgentModels
const PLAN_LOCKS_PATH = path.join(__dirname, 'data', 'plan-locks.json');
let planLocks = loadJson(PLAN_LOCKS_PATH, () => ({}));

function saveUrgentModels() {
    saveJson(URGENT_MODELS_PATH, urgentModels);
}

// ประกาศเฉพาะกระบวนการ: mcplan_announcements (MySQL) มีแค่ id/text/sort_order ไม่มี column บอก process
// เก็บ mapping "id ประกาศ -> process" แยกไฟล์ของตัวเองเช่นเดียวกับ urgentModels ด้านบน กันไม่ต้องแก้ schema ตาราง
// announcements ทั้งก้อนบันทึกแบบ replace ทั้งอาเรย์เสมอ (ไม่ใช่ patch) จึงสร้าง map นี้ใหม่ทั้งก้อนทุกครั้งที่บันทึกเช่นกัน
const ANNOUNCEMENT_PROCESS_PATH = path.join(__dirname, 'data', 'announcement-process.json');
let announcementProcess = loadJson(ANNOUNCEMENT_PROCESS_PATH, () => ({}));

function saveAnnouncementProcess() {
    saveJson(ANNOUNCEMENT_PROCESS_PATH, announcementProcess);
}

function withAnnouncementProcess(list) {
    return (list || []).map(a => ({ ...a, process: announcementProcess[a.id] || null }));
}

// ---- ระบบ user รายคน + บทบาท (แทนที่รหัสผ่านเดียวใช้ร่วมกันแบบเดิม) ----
// role: 'admin' เข้าถึง/แก้ไขได้ทุกอย่าง, 'process' แก้ไขได้เฉพาะ process ที่ระบุใน processes เช่น ['BW'] หรือ ['Stock']
const PROCESS_KEYS = ['BW', 'LC', 'CW', 'AI', 'Stock'];

function saveUsers() {
    saveJson(USERS_PATH, users);
}

// ครั้งแรกที่รันหลังอัปเดต (ยังไม่มี users.json) ให้สร้าง user "admin" จากรหัสผ่านเดิมใน config.json
// เพื่อไม่ให้ของเดิมที่เคยใช้อยู่ล็อกอินไม่ได้ — เฉพาะโหมด JSON เท่านั้น โหมด MySQL ทำ seed แบบเดียวกันใน startServer() แทน
let users;
if (DB_MODE === 'json') {
    if (fs.existsSync(USERS_PATH)) {
        users = JSON.parse(fs.readFileSync(USERS_PATH, 'utf8'));
    } else {
        users = [{ username: 'admin', passwordHash: bcrypt.hashSync(config.adminPassword || 'changeme', 10), role: 'admin', processes: [] }];
        saveUsers();
        console.log('[Users] สร้างไฟล์ users.json ใหม่ พร้อม user "admin" จากรหัสผ่านเดิมใน config.json');
    }
}

async function findUser(username) {
    if (DB_MODE === 'mysql') return usersRepo.findUser(username);
    return users.find(u => u.username === username);
}

async function verifyCredentials(username, password) {
    if (DB_MODE === 'mysql') return usersRepo.verifyCredentials(username, password);
    const u = await findUser(username);
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
        if (lower.startsWith('ai')) return 'AI';
        return null;
    }
    // coverData/coverColors: key คือ "<process>::<ชื่อ Model>" (ก่อนหน้านี้เป็นชื่อ Model เปล่าๆ ไม่มี process
    // นำหน้าเลย ทำให้ filterPatchByProcess derive process ไม่ได้ ผู้ใช้ที่ถูกจำกัดสิทธิ์แค่ process เดียวจึงบันทึก
    // Cover ไม่ได้เลยแม้จะแก้ในหน้า process ของตัวเอง — แก้คีย์ให้มี process นำหน้าจริงแล้วด้วย)
    if (objName === 'coverData' || objName === 'coverColors') {
        const idx = key.indexOf('::');
        return idx === -1 ? null : key.slice(0, idx);
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

// migration IIFE ทั้งสองตัวนี้ทำงานกับ state (JSON) เท่านั้น — โหมด MySQL ไม่ต้องใช้ เพราะ schema
// ถูกออกแบบให้ตรงกับรูปแบบล่าสุดอยู่แล้วตั้งแต่ต้น (ดู scripts/migrate-to-mysql.js สำหรับการย้ายข้อมูลครั้งเดียว)
if (DB_MODE === 'json') {
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

    // Hrs/Day เดิมกรอกแยกรายกลุ่ม (${proc}_${groupId}_${day}) รวมมาเป็นรายวันต่อ process เดียว (${proc}_${day})
    // เพื่อไม่ให้ต้องกรอกซ้ำหลายที่ — ถ้ามีค่าเก่าหลายกลุ่มในวันเดียวกัน ใช้ค่าแรกที่เจอ (ปกติผู้ใช้กรอกค่าเดียวกันทุกกลุ่มอยู่แล้ว)
    (function migrateHrsDataToProcessLevel() {
        // เรียงยาวไปสั้น กัน groupId สั้นๆ ที่บังเอิญเป็น prefix ของตัวอื่น (เช่น "bw_dg1" เป็น prefix ของ "bw_dg1_mini")
        // จับคู่ผิดตัวก่อนที่จะได้ลองตัวที่ตรงกว่า
        const knownGroupIds = Object.keys(defaultGroupLabels).sort((a, b) => b.length - a.length);
        const oldHrs = state.hrsData || {};
        const newHrs = {};
        let changed = false;
        Object.keys(oldHrs).forEach(key => {
            let matched = false;
            for (const proc of ['BW', 'LC', 'CW']) {
                for (const gid of knownGroupIds) {
                    const prefix = `${proc}_${gid}_`;
                    if (key.startsWith(prefix)) {
                        const dateKey = key.slice(prefix.length);
                        const newKey = `${proc}_${dateKey}`;
                        if (!(newKey in newHrs)) newHrs[newKey] = oldHrs[key];
                        changed = true; matched = true;
                        break;
                    }
                }
                if (matched) break;
            }
            if (!matched) newHrs[key] = oldHrs[key]; // เป็นรูปแบบใหม่อยู่แล้ว (หรือรูปแบบที่ไม่รู้จัก) เก็บไว้เฉยๆ
        });
        if (changed) { state.hrsData = newHrs; saveState(); console.log('[Migrate] รวม Hrs/Day จากรายกลุ่มเป็นรายวันต่อ process เรียบร้อย'); }
    })();

    // เพิ่ม process ใหม่ "AI" (Auto Insert) — migrateState() ข้างบนเติมได้แค่ top-level key ที่หายไปทั้งอัน (เช่น stockData ทั้งก้อน)
    // แต่ modelState/groupLabels/revData/timestamps/lastEditor มีอยู่แล้วในไฟล์เดิม (ของ BW/LC/CW) จึงต้องเติม sub-key ของ AI เข้าไปเองแยกต่างหาก
    (function seedAIProcess() {
        let changed = false;
        Object.keys(AI_INITIAL_MODELS).forEach(gid => {
            if (!(gid in state.modelState)) { state.modelState[gid] = JSON.parse(JSON.stringify(AI_INITIAL_MODELS[gid])); changed = true; }
            if (!(gid in state.groupLabels)) { state.groupLabels[gid] = defaultGroupLabels[gid]; changed = true; }
        });
        if (!('AI' in state.revData)) { state.revData.AI = '00'; changed = true; }
        if (!('AI' in state.timestamps)) { state.timestamps.AI = '-'; changed = true; }
        if (!('AI' in state.lastEditor)) { state.lastEditor.AI = ''; changed = true; }
        if (changed) { saveState(); console.log('[Migrate] เพิ่ม process "AI" (Auto Insert) เรียบร้อย'); }
    })();

    // coverData/coverColors เดิมเก็บด้วยชื่อ Model เปล่าๆ ไม่แยก process — ถ้า process อื่นที่มี Cover เหมือนกัน (ตอนนี้คือ CW กับ AI)
    // บังเอิญมี Model ชื่อเดียวกัน จะไปทับ Cover กันเอง (เคยเจอแล้วจริงๆ ฝั่ง LC ที่ไม่มี Cover ของตัวเองด้วยซ้ำ แต่ดันโชว์สีของ CW)
    // แปลงคีย์เก่าให้เป็น "<process>::<ชื่อ Model>" ทั้งหมด — ก่อนหน้านี้มีแค่ CW ที่เขียน Cover จริง (เก็บด้วยชื่อเปล่าๆ)
    // ส่วน AI เก็บเป็น "<groupId>::<ชื่อ>" อยู่แล้ว (กันชื่อซ้ำข้ามกลุ่มของตัวเอง) แค่ยังไม่มี "AI::" นำหน้า
    (function migrateCoverDataToScopedKeys() {
        let changed = false;
        ['coverData', 'coverColors'].forEach(objName => {
            const old = state[objName] || {};
            const migrated = {};
            Object.keys(old).forEach(k => {
                let newKey;
                if (PROCESS_KEYS.some(p => k.startsWith(p + '::'))) {
                    newKey = k; // แปลงแล้ว (รันซ้ำได้ปลอดภัย) ไม่ต้องแตะ
                } else if (k.includes('::')) {
                    newKey = `AI::${k}`; // รูปแบบเก่าของ AI ("<groupId>::<ชื่อ>" ไม่มี process นำหน้า)
                    changed = true;
                } else {
                    newKey = `CW::${k}`; // ชื่อ Model เปล่าๆ — ก่อนมี AI มีแค่ CW เท่านั้นที่เขียน Cover จริง
                    changed = true;
                }
                if (newKey in migrated) console.warn(`[Migrate] ${objName} key ชนกันหลัง migrate: "${newKey}" (จาก "${k}") — ข้ามตัวซ้ำ ของเดิมยังอยู่`);
                else migrated[newKey] = old[k];
            });
            state[objName] = migrated;
        });
        if (changed) { saveState(); console.log('[Migrate] แปลง coverData/coverColors ให้แยกตาม process เรียบร้อย (กัน Model ชื่อซ้ำข้าม process ชนกัน)'); }
    })();
}

// Teams webhook สมัยใหม่ (Workflows / Power Automate) รับเฉพาะ Adaptive Card ไม่รับ {"text": "..."} แบบ Connector รุ่นเก่า
// (Microsoft ปิด Office 365 Connectors ไปแล้ว) — แตกข้อความทีละบรรทัดเป็น TextBlock เพื่อให้ขึ้นบรรทัดใหม่ถูกต้อง
// รองรับ markdown **ตัวหนา** ใน TextBlock อยู่แล้ว จึงส่งข้อความเดิมเข้าไปได้เลย
function buildAdaptiveCardPayload(text) {
    const body = String(text).split('\n').filter(l => l.trim() !== '').map((line, i) => ({
        type: 'TextBlock', text: line, wrap: true, spacing: i === 0 ? 'None' : 'Small'
    }));
    return {
        type: 'message',
        attachments: [{
            contentType: 'application/vnd.microsoft.card.adaptive',
            content: { $schema: 'http://adaptivecards.io/schemas/adaptive-card.json', type: 'AdaptiveCard', version: '1.4', body }
        }]
    };
}

async function notifyTeams(text) {
    if (!config.teamsWebhookUrl) {
        console.log('[Teams] ยังไม่ได้ตั้งค่า teamsWebhookUrl ใน config.json — ข้ามการแจ้งเตือน');
        return;
    }
    try {
        const res = await fetch(config.teamsWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(buildAdaptiveCardPayload(text))
        });
        if (!res.ok) console.error('[Teams] ส่งแจ้งเตือนไม่สำเร็จ:', res.status, await res.text());
        else console.log('[Teams] ส่งแจ้งเตือนสำเร็จ');
    } catch (e) {
        console.error('[Teams] ส่งแจ้งเตือนล้มเหลว:', e.message);
    }
}

// จำนวน+รายชื่อคนที่กำลังเปิดหน้าเว็บอยู่ — เก็บใน memory เท่านั้น (ไม่บันทึกลงไฟล์ เพราะเป็นข้อมูลชั่วคราว)
// แต่ละ browser tab ส่ง heartbeat มาเรื่อยๆ ตอน poll ทุก 15 วินาที ถ้าเงียบไปเกิน 30 วินาทีถือว่าปิดหน้าไปแล้ว
const activeSessions = new Map(); // clientId -> { lastSeen (ms epoch), username หรือ null ถ้ายังไม่ login }
const VIEWER_TIMEOUT_MS = 30000;
function pruneActiveSessions() {
    const now = Date.now();
    for (const [id, info] of activeSessions) { if (now - info.lastSeen > VIEWER_TIMEOUT_MS) activeSessions.delete(id); }
}
function countActiveViewers() { pruneActiveSessions(); return activeSessions.size; }
function listActiveViewers() { pruneActiveSessions(); return Array.from(activeSessions.values()).map(v => v.username || null); }

const app = express();
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/heartbeat', (req, res) => {
    const { clientId, username } = req.body || {};
    if (clientId) activeSessions.set(clientId, { lastSeen: Date.now(), username: username || null });
    res.json({ ok: true, viewerCount: countActiveViewers(), activeUsers: listActiveViewers() });
});

app.get('/api/state', async (req, res) => {
    if (DB_MODE === 'mysql') {
        try {
            const dbState = await repo.getFullState();
            return res.json({ ...dbState, announcements: withAnnouncementProcess(dbState.announcements), urgentModels, planLocks, viewerCount: countActiveViewers(), activeUsers: listActiveViewers() });
        } catch (e) {
            console.error('[MySQL] /api/state failed:', e);
            return res.status(500).json({ ok: false, error: 'อ่านข้อมูลจากฐานข้อมูลไม่สำเร็จ' });
        }
    }
    res.json({ ...state, announcements: withAnnouncementProcess(state.announcements), urgentModels, planLocks, viewerCount: countActiveViewers(), activeUsers: listActiveViewers() });
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body || {};
    const u = await verifyCredentials(username, password);
    if (!u) return res.json({ ok: false });
    res.json({ ok: true, username: u.username, role: u.role, processes: u.processes || [] });
});

// จัดการ user (เฉพาะ admin) — ส่งรหัสผ่าน admin ของตัวเองมายืนยันตัวตนทุกครั้งเหมือน endpoint อื่นๆ ในระบบนี้
async function requireAdmin(req, res) {
    const { username, password } = req.body || {};
    const u = await verifyCredentials(username, password);
    if (!u || u.role !== 'admin') { res.status(401).json({ ok: false, error: 'ต้องเป็น Admin เท่านั้น' }); return null; }
    return u;
}

app.post('/api/users/list', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    if (DB_MODE === 'mysql') {
        const list = await usersRepo.listUsers();
        return res.json({ ok: true, users: list.map(u => ({ username: u.username, role: u.role, processes: u.processes || [] })) });
    }
    res.json({ ok: true, users: users.map(u => ({ username: u.username, role: u.role, processes: u.processes || [] })) });
});

app.post('/api/users/add', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    const { newUsername, newPassword, role, processes } = req.body || {};
    if (!newUsername || !newPassword || !['admin', 'process'].includes(role)) {
        return res.status(400).json({ ok: false, error: 'ข้อมูล user ไม่ครบหรือไม่ถูกต้อง' });
    }
    if (await findUser(newUsername)) return res.status(400).json({ ok: false, error: 'มีชื่อ user นี้อยู่แล้ว' });
    if (DB_MODE === 'mysql') {
        await usersRepo.addUser(newUsername, newPassword, role, processes);
        return res.json({ ok: true });
    }
    const validProcesses = Array.isArray(processes) ? processes.filter(p => PROCESS_KEYS.includes(p)) : [];
    users.push({ username: newUsername, passwordHash: bcrypt.hashSync(newPassword, 10), role, processes: role === 'admin' ? [] : validProcesses });
    saveUsers();
    res.json({ ok: true });
});

app.post('/api/users/update', async (req, res) => {
    if (!(await requireAdmin(req, res))) return;
    const { targetUsername, newPassword, role, processes } = req.body || {};
    if (role && !['admin', 'process'].includes(role)) return res.status(400).json({ ok: false, error: 'role ไม่ถูกต้อง' });
    if (DB_MODE === 'mysql') {
        const ok = await usersRepo.updateUser(targetUsername, { newPassword, role, processes });
        if (!ok) return res.status(404).json({ ok: false, error: 'ไม่พบ user นี้' });
        return res.json({ ok: true });
    }
    const target = await findUser(targetUsername);
    if (!target) return res.status(404).json({ ok: false, error: 'ไม่พบ user นี้' });
    if (role) target.role = role;
    if (processes !== undefined) {
        target.processes = (target.role === 'admin') ? [] : (Array.isArray(processes) ? processes.filter(p => PROCESS_KEYS.includes(p)) : []);
    }
    if (newPassword) target.passwordHash = bcrypt.hashSync(newPassword, 10);
    saveUsers();
    res.json({ ok: true });
});

app.post('/api/users/delete', async (req, res) => {
    const requester = await requireAdmin(req, res);
    if (!requester) return;
    const { targetUsername } = req.body || {};
    if (targetUsername === requester.username) return res.status(400).json({ ok: false, error: 'ลบบัญชีตัวเองไม่ได้' });
    if (DB_MODE === 'mysql') {
        const remainingAdmins = await usersRepo.countAdmins(targetUsername);
        if (remainingAdmins < 1) return res.status(400).json({ ok: false, error: 'ต้องมี Admin เหลืออย่างน้อย 1 คน' });
        await usersRepo.deleteUser(targetUsername);
        return res.json({ ok: true });
    }
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

app.post('/api/save', async (req, res) => {
    const { username, password, editor, process: proc, state: incoming } = req.body || {};
    const user = await verifyCredentials(username, password);
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

    let timeStr, changeEntry;

    if (DB_MODE === 'mysql') {
        try {
            const result = await repo.applyStatePatch(incoming, { isAdmin: isAdminUser, allowedProcesses: user.processes || [], proc, editor, username: user.username, changedModels });
            changeEntry = result.changeEntry;
            timeStr = changeEntry ? changeEntry.time : (new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB'));
        } catch (e) {
            console.error('[MySQL] /api/save failed:', e);
            return res.status(500).json({ ok: false, error: 'บันทึกข้อมูลไม่สำเร็จ (ฐานข้อมูล)' });
        }
    } else {
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
        timeStr = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-GB');
        const who = (editor && editor.trim()) ? editor.trim() : 'ไม่ระบุชื่อ';
        if (proc && state.timestamps) state.timestamps[proc] = timeStr;
        if (proc && state.lastEditor) state.lastEditor[proc] = who;

        // สร้าง log ทุกครั้งที่มีการกดบันทึก แม้ค่าตัวเลขเครื่องจักรจะไม่เปลี่ยน (เช่น แก้แค่ Cover/Rev/Hrs)
        // เพื่อให้กระดิ่งแจ้งเตือนรู้เสมอว่า process ไหนถูกบันทึกไปเมื่อไหร่ โดยใคร
        changeEntry = null;
        if (proc) {
            state.changeLogSeq = (state.changeLogSeq || 0) + 1;
            changeEntry = { seq: state.changeLogSeq, process: proc, models: Array.from(changedModels), editor: who, username: user.username, time: timeStr };
            state.changeLog = state.changeLog || [];
            state.changeLog.push(changeEntry);
            if (state.changeLog.length > 200) state.changeLog = state.changeLog.slice(-200);
        }

        saveState();
    }

    // urgentModels/ประกาศ.process: เก็บแยกไฟล์ของตัวเองเสมอ (ดูเหตุผลตรง URGENT_MODELS_PATH ด้านบน) ไม่ผ่าน PATCHABLE_KEYS/repo.applyStatePatch — เฉพาะ Admin เท่านั้น (เหมือน coverData/sourceMap)
    // ทำ "หลัง" จากบันทึก state/DB สำเร็จแล้วเท่านั้น (ไม่ใช่ก่อน) กันเคส DB/state บันทึกไม่สำเร็จ (return 500 ไปแล้วด้านบน) แต่ไฟล์แยกนี้ดันเขียนไปแล้ว ทำให้ 2 ฝั่งข้อมูลไม่ตรงกัน
    if (isAdminUser && incoming.urgentModels && typeof incoming.urgentModels === 'object') {
        Object.keys(incoming.urgentModels).forEach(key => {
            const value = incoming.urgentModels[key];
            if (value === null) delete urgentModels[key]; else urgentModels[key] = value;
        });
        saveUrgentModels();
    }
    // ล็อกช่องแผน: Admin ทุกช่อง, ผู้แก้ไขแผนเฉพาะ process ที่ตัวเองได้สิทธิ์
    if (incoming.planLocks && typeof incoming.planLocks === 'object') {
        const allowed = user.processes || [];
        let touched = false;
        Object.keys(incoming.planLocks).forEach(key => {
            if (!isAdminUser && !allowed.includes(deriveKeyProcess('cellData', key))) return;
            if (incoming.planLocks[key] === null) delete planLocks[key]; else planLocks[key] = true;
            touched = true;
        });
        if (touched) saveJson(PLAN_LOCKS_PATH, planLocks);
    }
    if (isAdminUser && Array.isArray(incoming.announcements)) {
        const newMap = {};
        incoming.announcements.forEach(a => { if (a && a.id && a.process) newMap[a.id] = a.process; });
        announcementProcess = newMap;
        saveAnnouncementProcess();
    }

    // ไม่ยิงแจ้งเตือน Teams ทุกครั้งที่กดบันทึกแล้ว (ถี่เกินไปจนรบกวนทีม) — แจ้งเตือนเฉพาะตอนกดปุ่ม "ส่งแผนให้ทีม" เท่านั้น
    // ดู /api/notify-plan-ready ซึ่งส่งเฉพาะ process ที่แก้ไขจริงตั้งแต่ครั้งล่าสุดที่ส่ง
    res.json({ ok: true, timestamp: timeStr, notified: false, changeEntry });
});

app.post('/api/notify-test', async (req, res) => {
    await notifyTeams('✅ ทดสอบการเชื่อมต่อ Teams จาก Production Plan Dashboard สำเร็จ');
    res.json({ ok: true });
});

// ปุ่ม "ส่งแผนให้ทีม" — เฉพาะ Admin กดเอง (ต่างจาก notifyTeams ที่ยิงอัตโนมัติทุกครั้งที่บันทึกในฟังก์ชันด้านบน)
// ส่งเฉพาะ process ที่มีการบันทึกใหม่ตั้งแต่ครั้งล่าสุดที่ส่งเท่านั้น และเลข Rev นับแยกต่อ process (ดู repo.sendPlanUpdates)
// client ส่งมาแค่ยอด Total M/C ต่อ process (คำนวณด้วยสูตรเดียวกับการ์ด "Total M/C วันนี้" ที่มีอยู่แล้ว) กับ comment — ที่เหลือ server ตัดสินเองทั้งหมด
const PLAN_SEND_PROCESSES = ['BW', 'LC', 'CW', 'AI'];
app.post('/api/notify-plan-ready', async (req, res) => {
    const admin = await requireAdmin(req, res);
    if (!admin) return;
    const { mcByProcess, comment } = req.body || {};
    const who = admin.username;

    let result;
    if (DB_MODE === 'mysql') {
        try {
            result = await repo.sendPlanUpdates({ mcByProcess, comment, editor: who, username: who, appUrl: config.appUrl });
        } catch (e) {
            console.error('[MySQL] /api/notify-plan-ready failed:', e);
            return res.status(500).json({ ok: false, error: 'ส่งแผนไม่สำเร็จ (ฐานข้อมูล)' });
        }
    } else {
        // โหมด JSON — ตรรกะเดียวกับ repo.sendPlanUpdates ทุกประการ แค่อ่าน/เขียนกับ state ในหน่วยความจำแทน SQL
        const log = state.changeLog || [];
        const latestByKey = {};
        for (let i = log.length - 1; i >= 0; i--) { const e = log[i]; if (!(e.process in latestByKey)) latestByKey[e.process] = e; }

        const eligible = PLAN_SEND_PROCESSES.filter(p => {
            const lastEdit = latestByKey[p];
            if (!lastEdit) return false;
            const marker = latestByKey[`PlanSend:${p}`];
            return !marker || lastEdit.seq > marker.seq;
        });

        if (eligible.length === 0) {
            result = { sentProcesses: [], revByProcess: {}, message: null };
        } else {
            const now = new Date();
            const todayDate = now.toLocaleDateString('en-GB'); // DD/MM/YYYY
            const timeStr = todayDate + ' ' + now.toLocaleTimeString('en-GB');
            const revByProcess = {}; const lines = [];
            for (const proc of eligible) {
                const marker = latestByKey[`PlanSend:${proc}`];
                // Rev รีเซ็ตเป็น 00 ทุกวันใหม่ — ส่งครั้งแรกของวันคือ Rev.00 ส่งซ้ำวันเดียวกันนับต่อจากเลข Rev ปัจจุบัน
                // (ไม่ใช่จากประวัติการส่ง) เพื่อให้ Admin ที่พิมพ์แก้เลขเองในช่อง Rev มีผลจริง — เหมือนฝั่ง MySQL ทุกประการ
                const sentToday = marker && String(marker.time || '').split(' ')[0] === todayDate;
                const newRev = sentToday ? String(parseInt(state.revData[proc] || '0', 10) + 1).padStart(2, '0') : '00';
                revByProcess[proc] = newRev;
                state.revData[proc] = newRev;
                state.changeLogSeq = (state.changeLogSeq || 0) + 1;
                state.changeLog.push({ seq: state.changeLogSeq, process: `PlanSend:${proc}`, models: { rev: newRev }, editor: who, username: who, time: timeStr });
                const mc = mcByProcess && mcByProcess[proc] != null ? Number(mcByProcess[proc]) : 0;
                const link = config.appUrl ? ` — [เปิดดูแผน ${proc}](${config.appUrl}?process=${proc})` : '';
                lines.push(`**${proc}** — Total M/C วันนี้: ${mc.toLocaleString('en-US', { maximumFractionDigits: 1 })} | Rev.${newRev} | อัปเดตล่าสุด: ${(state.timestamps || {})[proc] || '-'} โดย ${(state.lastEditor || {})[proc] || '-'}${link}`);
            }
            if (state.changeLog.length > 200) state.changeLog = state.changeLog.slice(-200);
            let message = `📋 **แผนเครื่องจักรอัปเดต**\n\n${lines.join('\n')}\n\nส่งโดย: ${who}`;
            if (comment && comment.trim()) message += `\n\nหมายเหตุ: ${comment.trim()}`;
            saveState();
            result = { sentProcesses: eligible, revByProcess, message };
        }
    }

    if (result.sentProcesses.length === 0) return res.json({ ok: true, sentProcesses: [], notified: false });
    await notifyTeams(result.message);
    res.json({ ok: true, sentProcesses: result.sentProcesses, revByProcess: result.revByProcess, notified: !!config.teamsWebhookUrl });
});

async function startServer() {
    if (DB_MODE === 'mysql') {
        // เครื่องเพิ่งเปิด/รีสตาร์ท server จะถูกสั่งรันก่อนเน็ตบริษัทพร้อม (ENETUNREACH) — รอแล้วลองใหม่ทุก 10 วิ นานสุด 10 นาที แทนที่จะปิดตัวทันที
        const MAX_TRIES = 60;
        for (let attempt = 1; ; attempt++) {
            try {
                const seeded = await usersRepo.seedAdminIfEmpty(config.adminPassword);
                if (seeded) console.log('[Users] สร้าง user "admin" ใน MySQL จากรหัสผ่านเดิมใน config.json (ตาราง users ว่างเปล่าตอนเริ่มต้น)');
                break;
            } catch (e) {
                console.error(`[MySQL] เชื่อมต่อฐานข้อมูลไม่สำเร็จตอนเริ่มเซิร์ฟเวอร์ (ครั้งที่ ${attempt}/${MAX_TRIES}):`, e.message);
                if (attempt >= MAX_TRIES) {
                    console.error('[MySQL] ตรวจสอบ config.json -> mysql.{host,port,user,password,database} และว่า schema (db/schema.sql) ถูกสร้างไว้แล้วหรือยัง');
                    process.exit(1);
                }
                await new Promise(r => setTimeout(r, 10000));
            }
        }
    }
    app.listen(config.port, () => {
        console.log(`Production Plan Dashboard กำลังทำงานที่ http://localhost:${config.port}`);
        console.log('ให้เครื่องอื่นในวง LAN/WiFi เดียวกันเข้าผ่าน IP ของเครื่องนี้ เช่น http://192.168.x.x:' + config.port);
    });
}

startServer();

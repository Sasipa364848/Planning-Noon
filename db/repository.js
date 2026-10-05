// MySQL-backed data layer replacing the old loadJson()/state/saveState() approach in server.js.
// Preserves the exact same PATCHABLE_KEYS / PROCESS_SCOPED_KEYS / deriveKeyProcess / applyPatch
// semantics as the old JSON code (see server.js's pre-migration git history), just backed by SQL
// tables instead of one in-memory object. GET /api/state and POST /api/save keep the exact same
// request/response shapes, so public/js/app.js needs no changes for the migration itself.
//
// All tables live inside the shared `digital_transform_db` database (see db/schema.sql) and are
// prefixed `mcplan_` to avoid colliding with that database's own tables.
const { getPool } = require('./pool');

const PATCHABLE_KEYS = ['modelState', 'groupLabels', 'cellData', 'cellComments', 'coverData', 'coverColors', 'coverCodeColors', 'revData', 'groupParams', 'hrsData', 'stockData', 'sourceMap', 'plannedUsedData'];
const PROCESS_SCOPED_KEYS = ['modelState', 'groupLabels', 'cellData', 'cellComments', 'revData', 'groupParams', 'hrsData'];
const KNOWN_PROCESSES = ['BW', 'LC', 'CW', 'AI'];

// เดิม parseCellKey ใน server.js — ชื่อ Model เองอาจมี "_" ปนอยู่ (เช่น 'X2_Auto') จึงตัดเอาแค่ตัวแรก (process)
// กับตัวสุดท้าย (day) ออก ที่เหลือตรงกลางคือชื่อ Model ทั้งหมด (สำหรับ AI คือ "<groupId>::<ชื่อ>" ทั้งก้อน)
function parseCellKey(key) {
    const parts = key.split('_');
    return { process: parts[0], model: parts.slice(1, -1).join('_'), day: parts[parts.length - 1] };
}

// AI: ชื่อ Model ฝั่ง JSON/client เก็บเป็น "<groupId>::<ชื่อที่โชว์>" เสมอ (กันชื่อซ้ำข้ามกลุ่มของ AI เอง)
// แต่ใน DB ไม่ต้องใช้ trick นี้ เพราะ mcplan_models.group_id ให้ความ unique อยู่แล้วโดยธรรมชาติ (ดู schema.sql)
// ฟังก์ชันนี้แยก "<groupId>::<ชื่อ>" กลับเป็น {groupCode, displayName} — คืน groupCode เป็น null ถ้าไม่ใช่ AI/ไม่มี "::"
function splitAiComposite(process, rawName) {
    if (process !== 'AI') return { groupCode: null, displayName: rawName };
    const idx = rawName.indexOf('::');
    if (idx === -1) return { groupCode: null, displayName: rawName };
    return { groupCode: rawName.slice(0, idx), displayName: rawName.slice(idx + 2) };
}

// ด้านกลับ: ประกอบชื่อที่ใช้ในคีย์ JSON (cellData/stockData/coverData/modelState ฯลฯ) จากแถวใน DB
// AI ต้องแปะ groupCode:: กลับเข้าไปเสมอ ให้ตรงกับที่ public/js/app.js คาดหวัง — process อื่นใช้ชื่อเปล่าๆ ตามเดิม
function jsonModelName(info) {
    return info.process === 'AI' ? `${info.groupCode}::${info.name}` : info.name;
}

function deriveKeyProcess(objName, key) {
    if (objName === 'revData') return key;
    if (objName === 'groupParams' || objName === 'modelState' || objName === 'groupLabels') {
        const lower = key.toLowerCase();
        if (lower.startsWith('bw')) return 'BW';
        if (lower.startsWith('lc')) return 'LC';
        if (lower.startsWith('cw')) return 'CW';
        if (lower.startsWith('ai')) return 'AI';
        return null;
    }
    // coverData/coverColors: key คือ "<process>::<ชื่อ Model>" (ดู public/js/app.js coverKey()) — ไม่ใช่ชื่อเปล่าๆ อีกต่อไป
    if (objName === 'coverData' || objName === 'coverColors') {
        const idx = key.indexOf('::');
        return idx === -1 ? null : key.slice(0, idx);
    }
    // cellData, cellComments, hrsData, stockData, plannedUsedData, sourceMap: รูปแบบ key คือ `${proc}_...`
    return key.split('_')[0];
}

function filterPatchByProcess(objName, patchObj, allowedProcesses) {
    const filtered = {};
    Object.keys(patchObj).forEach(k => {
        const kProc = deriveKeyProcess(objName, k);
        if (kProc && allowedProcesses.includes(kProc)) filtered[k] = patchObj[k];
    });
    return filtered;
}

// "25-Aug" (no year) <-> a real DATE column. assumeYear pins the year for the round-trip, since the
// app's own key format never carried one; see the migration script for how the year gets chosen once.
function dateKeyToSqlDate(dateKey, assumeYear) {
    const m = /^(\d{1,2})-([A-Za-z]+)$/.exec(dateKey);
    if (!m) return null;
    const day = parseInt(m[1], 10);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const monthIdx = monthNames.findIndex(mn => mn.toLowerCase() === m[2].toLowerCase());
    if (monthIdx === -1 || isNaN(day)) return null;
    const d = new Date(assumeYear, monthIdx, day);
    // ปีล้น/เดือนล้นเช่น 31 ก.พ. จะถูก normalize ข้ามไปเดือนถัดไปโดย Date เอง เช็คย้อนกลับกันไว้กันวันที่ไม่มีจริงหลุดเข้ามา
    if (d.getMonth() !== monthIdx || d.getDate() !== day) return null;
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${d.getFullYear()}-${mm}-${dd}`;
}

// กลับด้าน: DATE column -> "25-Aug" ใช้ locale formatting เดียวกับฝั่ง client เป๊ะๆ (ทดสอบแล้วตรงกันแม้แต่ "1-Sept")
function sqlDateToDateKey(sqlDate) {
    // mysql2 คืนค่า DATE เป็น JS Date ในโซนเวลาเครื่อง server อยู่แล้ว (ไม่ใช่ string) เมื่อใช้ dateStrings:false (default)
    const d = sqlDate instanceof Date ? sqlDate : new Date(sqlDate);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }).replace(/ /g, '-');
}

// modelName ที่รับมาอาจเป็นชื่อเปล่า (BW/LC/CW) หรือ "<groupId>::<ชื่อ>" (AI) — สำหรับ AI ใช้ groupId จากคีย์
// นี้ตรงๆ เป็นตัวกรองกลุ่ม (แม่นกว่าการเดา เพราะ AI มีชื่อซ้ำข้ามกลุ่มได้จริง — ดู splitAiComposite ด้านบน)
async function resolveModelId(conn, process, modelName) {
    const { groupCode, displayName } = splitAiComposite(process, modelName);
    if (groupCode) {
        const [rows] = await conn.query(
            'SELECT mcplan_models.id FROM mcplan_models JOIN mcplan_groups ON mcplan_models.group_id = mcplan_groups.id WHERE mcplan_groups.code = ? AND mcplan_models.name = ? LIMIT 1',
            [groupCode, displayName]
        );
        return rows.length ? rows[0].id : null;
    }
    const [rows] = await conn.query(
        'SELECT mcplan_models.id FROM mcplan_models JOIN mcplan_groups ON mcplan_models.group_id = mcplan_groups.id WHERE mcplan_groups.process = ? AND mcplan_models.name = ? LIMIT 1',
        [process, displayName]
    );
    return rows.length ? rows[0].id : null;
}

async function resolveGroupId(conn, groupCode) {
    const [rows] = await conn.query('SELECT id FROM mcplan_groups WHERE code = ? LIMIT 1', [groupCode]);
    return rows.length ? rows[0].id : null;
}

// ---- GET /api/state: ประกอบ state object ก้อนเดียวกลับจากทุกตาราง ให้หน้าตาตรงกับของเดิมทุกประการ ----
async function getFullState() {
    const pool = getPool();

    const [groupRows] = await pool.query('SELECT id, code, process, label FROM mcplan_groups ORDER BY sort_order, id');
    const groupIdToCode = {}; groupRows.forEach(g => { groupIdToCode[g.id] = g.code; });

    const [modelRows] = await pool.query('SELECT id, group_id, name FROM mcplan_models ORDER BY group_id, sort_order, id');
    const modelIdToInfo = {}; // id -> {process, name, groupCode}
    const groupProcessById = {}; groupRows.forEach(g => { groupProcessById[g.id] = g.process; });

    const modelState = {};
    modelRows.forEach(m => {
        const code = groupIdToCode[m.group_id];
        const process = groupProcessById[m.group_id];
        if (!modelState[code]) modelState[code] = [];
        const info = { process, name: m.name, groupCode: code };
        modelState[code].push(jsonModelName(info)); // AI: ใส่ "<groupId>::<ชื่อ>" กลับเข้าไป ให้ตรงกับที่ client คาดหวัง
        modelIdToInfo[m.id] = info;
    });

    const groupLabels = {}; groupRows.forEach(g => { groupLabels[g.code] = g.label; });

    const groupParams = {};
    const [gpRows] = await pool.query('SELECT group_id, oa, mct FROM mcplan_group_params');
    gpRows.forEach(r => { groupParams[groupIdToCode[r.group_id]] = { oa: r.oa === null ? null : Number(r.oa), mct: r.mct === null ? null : Number(r.mct) }; });

    const cellData = {};
    const [cellRows] = await pool.query('SELECT model_id, plan_date, machine_qty FROM mcplan_plan_cells');
    cellRows.forEach(r => {
        const info = modelIdToInfo[r.model_id]; if (!info) return;
        cellData[`${info.process}_${jsonModelName(info)}_${sqlDateToDateKey(r.plan_date)}`] = r.machine_qty === null ? '' : r.machine_qty;
    });

    const cellComments = {};
    const [commentRows] = await pool.query('SELECT model_id, plan_date, comment FROM mcplan_plan_cell_comments');
    commentRows.forEach(r => {
        const info = modelIdToInfo[r.model_id]; if (!info) return;
        cellComments[`${info.process}_${jsonModelName(info)}_${sqlDateToDateKey(r.plan_date)}`] = r.comment || '';
    });

    const coverData = {};
    const [coverRows] = await pool.query('SELECT model_id, cover_code FROM mcplan_model_cover_code');
    coverRows.forEach(r => { const info = modelIdToInfo[r.model_id]; if (info) coverData[`${info.process}::${jsonModelName(info)}`] = r.cover_code; });

    const coverColors = {};
    const [coverColorRows] = await pool.query('SELECT model_id, color FROM mcplan_model_cover_color');
    coverColorRows.forEach(r => { const info = modelIdToInfo[r.model_id]; if (info) coverColors[`${info.process}::${jsonModelName(info)}`] = r.color; });

    const coverCodeColors = {};
    const [ccRows] = await pool.query('SELECT cover_code, color FROM mcplan_cover_code_colors');
    ccRows.forEach(r => { coverCodeColors[r.cover_code] = r.color; });

    const hrsData = {};
    const [hrsRows] = await pool.query('SELECT process_key, plan_date, hours FROM mcplan_process_hours');
    hrsRows.forEach(r => { hrsData[`${r.process_key}_${sqlDateToDateKey(r.plan_date)}`] = r.hours === null ? '' : String(r.hours); });

    const revData = {};
    const [revRows] = await pool.query('SELECT process_key, rev FROM mcplan_process_rev');
    revRows.forEach(r => { revData[r.process_key] = r.rev; });

    const timestamps = {}, lastEditor = {};
    const [statusRows] = await pool.query('SELECT process_key, last_saved_text, last_editor FROM mcplan_process_status');
    statusRows.forEach(r => { timestamps[r.process_key] = r.last_saved_text; lastEditor[r.process_key] = r.last_editor; });

    const stockData = {};
    const [stockRows] = await pool.query('SELECT model_id, qty, updated_by, updated_at FROM mcplan_model_stock');
    stockRows.forEach(r => { const info = modelIdToInfo[r.model_id]; if (info) stockData[`${info.process}_${jsonModelName(info)}`] = { value: r.qty, updatedBy: r.updated_by, updatedAt: r.updated_at ? r.updated_at.toISOString() : null }; });

    const plannedUsedData = {};
    const [plannedRows] = await pool.query('SELECT model_id, qty, updated_by, updated_at FROM mcplan_model_planned_used');
    plannedRows.forEach(r => { const info = modelIdToInfo[r.model_id]; if (info) plannedUsedData[`${info.process}_${jsonModelName(info)}`] = { value: r.qty, updatedBy: r.updated_by, updatedAt: r.updated_at ? r.updated_at.toISOString() : null }; });

    const sourceMap = {};
    const [srcRows] = await pool.query('SELECT dest_model_id, src_model_id, ratio FROM mcplan_model_source_map');
    srcRows.forEach(r => {
        const dest = modelIdToInfo[r.dest_model_id], src = modelIdToInfo[r.src_model_id];
        if (dest && src) sourceMap[`${dest.process}_${jsonModelName(dest)}`] = { srcProc: src.process, srcModel: jsonModelName(src), ratio: Number(r.ratio) };
    });

    const [annRows] = await pool.query('SELECT id, text FROM mcplan_announcements ORDER BY sort_order, id');
    const announcements = annRows.map(r => ({ id: r.id, text: r.text }));

    // เก็บ 200 รายการล่าสุดพอ ให้ payload ขนาดใกล้เคียงของเดิม แม้ตาราง change_log จะไม่ลบทิ้งจริงแล้วก็ตาม
    const [clRows] = await pool.query('SELECT seq, process_key, models_json, editor, username, time_text FROM mcplan_change_log ORDER BY seq DESC LIMIT 200');
    const changeLog = clRows.reverse().map(r => ({ seq: r.seq, process: r.process_key, models: r.models_json || [], editor: r.editor, username: r.username, time: r.time_text }));

    return { modelState, groupLabels, groupParams, cellData, cellComments, coverData, coverColors, coverCodeColors, hrsData, revData, timestamps, lastEditor, stockData, plannedUsedData, sourceMap, announcements, changeLog };
}

// ---- modelState patch: value คืออาเรย์ชื่อ Model ทั้งก้อนของกลุ่มนั้น ไม่ใช่ diff ทีละตัว ต้อง diff เอง ----
// ถ้าลบ 1 เพิ่ม 1 พอดี ถือเป็นการ "เปลี่ยนชื่อ" (rename) ใช้ model_id เดิม กัน cascade ลบข้อมูล stock/plan/cover
// ของ Model นั้นทิ้งไปโดยไม่ตั้งใจ (ซึ่งจะเกิดถ้า treat ทุกการเปลี่ยนแปลงเป็น delete-then-insert เสมอ)
// AI ส่ง array มาเป็นชื่อ composite "<groupId>::<ชื่อ>" เสมอ ต้องถอด prefix ออกก่อนเทียบ/เขียนลง DB (DB เก็บชื่อเปล่าๆ)
async function applyModelStatePatch(conn, groupCode, newNamesOrNull) {
    const groupId = await resolveGroupId(conn, groupCode);
    if (!groupId) return;
    const prefix = `${groupCode}::`;
    const stripAi = (n) => n.startsWith(prefix) ? n.slice(prefix.length) : n;
    const rawNewNames = newNamesOrNull === null ? [] : newNamesOrNull;
    const newNames = rawNewNames.map(stripAi);
    const [oldRows] = await conn.query('SELECT name FROM mcplan_models WHERE group_id = ? ORDER BY sort_order, id', [groupId]);
    const oldNames = oldRows.map(r => r.name);
    const added = newNames.filter(n => !oldNames.includes(n));
    const removed = oldNames.filter(n => !newNames.includes(n));

    if (added.length === 1 && removed.length === 1) {
        await conn.query('UPDATE mcplan_models SET name = ? WHERE group_id = ? AND name = ?', [added[0], groupId, removed[0]]);
    } else {
        for (const name of removed) await conn.query('DELETE FROM mcplan_models WHERE group_id = ? AND name = ?', [groupId, name]);
        for (const name of added) await conn.query('INSERT INTO mcplan_models (group_id, name) VALUES (?, ?)', [groupId, name]);
    }
    for (let i = 0; i < newNames.length; i++) {
        await conn.query('UPDATE mcplan_models SET sort_order = ? WHERE group_id = ? AND name = ?', [i, groupId, newNames[i]]);
    }
}

async function applyGroupLabelsPatch(conn, groupCode, labelOrNull) {
    const groupId = await resolveGroupId(conn, groupCode);
    if (!groupId) return;
    await conn.query('UPDATE mcplan_groups SET label = ? WHERE id = ?', [labelOrNull === null ? '' : labelOrNull, groupId]);
}

async function applyGroupParamsPatch(conn, groupCode, valueOrNull) {
    const groupId = await resolveGroupId(conn, groupCode);
    if (!groupId) return;
    if (valueOrNull === null) { await conn.query('DELETE FROM mcplan_group_params WHERE group_id = ?', [groupId]); return; }
    await conn.query('INSERT INTO mcplan_group_params (group_id, oa, mct) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE oa = VALUES(oa), mct = VALUES(mct)', [groupId, valueOrNull.oa, valueOrNull.mct]);
}

async function applyCellDataPatch(conn, table, key, valueOrNull, assumeYear) {
    const { process, model, day } = parseCellKey(key);
    const modelId = await resolveModelId(conn, process, model);
    if (!modelId) return; // key ที่ resolve ไม่ได้ (เช่น patch ซ้ำซ้อนของ Model ที่เพิ่งถูกลบไปในคำขอเดียวกัน) ข้ามไปเงียบๆ เหมือนของเดิม
    const sqlDate = dateKeyToSqlDate(day, assumeYear);
    if (!sqlDate) return;
    const col = table === 'mcplan_plan_cells' ? 'machine_qty' : 'comment';
    if (valueOrNull === null || valueOrNull === '') {
        await conn.query(`DELETE FROM ${table} WHERE model_id = ? AND plan_date = ?`, [modelId, sqlDate]);
    } else {
        await conn.query(`INSERT INTO ${table} (model_id, plan_date, ${col}) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE ${col} = VALUES(${col})`, [modelId, sqlDate, valueOrNull]);
    }
}

// key คือ "<process>::<ชื่อ Model>" (ดู public/js/app.js coverKey()) — resolve ตาม process จริงในคีย์
// ไม่ hardcode CW อีกต่อไป เพราะตอนนี้ AI ก็มี Cover เป็นของตัวเองด้วย
async function applyCoverPatch(conn, table, col, key, valueOrNull) {
    const idx = key.indexOf('::');
    if (idx === -1) return; // รูปแบบเก่า (ไม่มี process นำหน้า) ไม่รองรับแล้วหลัง migration
    const process = key.slice(0, idx), modelName = key.slice(idx + 2);
    const modelId = await resolveModelId(conn, process, modelName);
    if (!modelId) return;
    if (valueOrNull === null) { await conn.query(`DELETE FROM ${table} WHERE model_id = ?`, [modelId]); return; }
    await conn.query(`INSERT INTO ${table} (model_id, ${col}) VALUES (?, ?) ON DUPLICATE KEY UPDATE ${col} = VALUES(${col})`, [modelId, valueOrNull]);
}

async function applyCoverCodeColorsPatch(conn, coverCode, colorOrNull) {
    if (colorOrNull === null) { await conn.query('DELETE FROM mcplan_cover_code_colors WHERE cover_code = ?', [coverCode]); return; }
    await conn.query('INSERT INTO mcplan_cover_code_colors (cover_code, color) VALUES (?, ?) ON DUPLICATE KEY UPDATE color = VALUES(color)', [coverCode, colorOrNull]);
}

async function applyRevDataPatch(conn, processKey, revOrNull) {
    if (!KNOWN_PROCESSES.includes(processKey)) return;
    const rev = revOrNull === null ? '00' : revOrNull;
    await conn.query('INSERT INTO mcplan_process_rev (process_key, rev) VALUES (?, ?) ON DUPLICATE KEY UPDATE rev = VALUES(rev)', [processKey, rev]);
}

async function applyHrsDataPatch(conn, key, valueOrNull, assumeYear) {
    const [processKey, day] = [key.split('_')[0], key.slice(key.indexOf('_') + 1)];
    if (!KNOWN_PROCESSES.includes(processKey)) return;
    const sqlDate = dateKeyToSqlDate(day, assumeYear);
    if (!sqlDate) return;
    if (valueOrNull === null || valueOrNull === '') {
        await conn.query('DELETE FROM mcplan_process_hours WHERE process_key = ? AND plan_date = ?', [processKey, sqlDate]);
    } else {
        await conn.query('INSERT INTO mcplan_process_hours (process_key, plan_date, hours) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE hours = VALUES(hours)', [processKey, sqlDate, valueOrNull]);
    }
}

async function applyStockLikePatch(conn, table, key, valueOrNull) {
    const process = key.split('_')[0];
    const model = key.slice(key.indexOf('_') + 1);
    const modelId = await resolveModelId(conn, process, model);
    if (!modelId) return;
    if (valueOrNull === null) { await conn.query(`DELETE FROM ${table} WHERE model_id = ?`, [modelId]); return; }
    await conn.query(
        `INSERT INTO ${table} (model_id, qty, updated_by, updated_at) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE qty = VALUES(qty), updated_by = VALUES(updated_by), updated_at = VALUES(updated_at)`,
        [modelId, valueOrNull.value, valueOrNull.updatedBy || null, valueOrNull.updatedAt ? new Date(valueOrNull.updatedAt) : new Date()]
    );
}

async function applySourceMapPatch(conn, key, valueOrNull) {
    const process = key.split('_')[0];
    const model = key.slice(key.indexOf('_') + 1);
    const destId = await resolveModelId(conn, process, model);
    if (!destId) return;
    if (valueOrNull === null) { await conn.query('DELETE FROM mcplan_model_source_map WHERE dest_model_id = ?', [destId]); return; }
    const srcId = await resolveModelId(conn, valueOrNull.srcProc, valueOrNull.srcModel);
    if (!srcId) return; // ต้นทางไม่มีจริง (พิมพ์ผิด/ยังไม่มีข้อมูล) — ไม่ insert อ้างอิงมั่ว ต่างจากของเดิมที่เก็บได้แม้จะไม่มีจริง
    await conn.query(
        'INSERT INTO mcplan_model_source_map (dest_model_id, src_model_id, ratio) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE src_model_id = VALUES(src_model_id), ratio = VALUES(ratio)',
        [destId, srcId, valueOrNull.ratio]
    );
}

async function applyAnnouncementsReplace(conn, announcements) {
    await conn.query('DELETE FROM mcplan_announcements');
    for (let i = 0; i < announcements.length; i++) {
        const a = announcements[i];
        await conn.query('INSERT INTO mcplan_announcements (id, text, sort_order) VALUES (?, ?, ?)', [a.id, a.text, i]);
    }
}

// ---- POST /api/save: ใช้ transaction เดียวครอบทุก key ที่ patch รอบนี้ + timestamp/lastEditor/changeLog ----
// เดิม (JSON) เขียนทุกอย่างลงไฟล์เดียวกันด้วย saveState() ครั้งเดียว ตอนนี้ครอบด้วย transaction เดียวกันแทน
// เพื่อให้ยังคง atomic เหมือนเดิม (ถ้าพังกลางทาง ไม่มีอะไรถูกบันทึกครึ่งๆ กลางๆ)
// assumeYear: ปีที่จะผูกกับ key วันที่แบบไม่มีปี ("25-Aug") — ใช้ปีปัจจุบัน ณ ตอนบันทึกเป็นค่าเริ่มต้นเสมอ
async function applyStatePatch(patch, { isAdmin, allowedProcesses, proc, editor, username, changedModels }) {
    const pool = getPool();
    const conn = await pool.getConnection();
    const assumeYear = new Date().getFullYear();
    let changeEntry = null;
    try {
        await conn.beginTransaction();
        const keysToApply = isAdmin ? PATCHABLE_KEYS : PROCESS_SCOPED_KEYS;

        for (const objName of keysToApply) {
            if (!patch[objName] || typeof patch[objName] !== 'object') continue;
            const objPatch = isAdmin ? patch[objName] : filterPatchByProcess(objName, patch[objName], allowedProcesses || []);

            for (const key of Object.keys(objPatch)) {
                const value = objPatch[key];
                if (objName === 'modelState') await applyModelStatePatch(conn, key, value);
                else if (objName === 'groupLabels') await applyGroupLabelsPatch(conn, key, value);
                else if (objName === 'groupParams') await applyGroupParamsPatch(conn, key, value);
                else if (objName === 'cellData') await applyCellDataPatch(conn, 'mcplan_plan_cells', key, value, assumeYear);
                else if (objName === 'cellComments') await applyCellDataPatch(conn, 'mcplan_plan_cell_comments', key, value, assumeYear);
                else if (objName === 'coverData') await applyCoverPatch(conn, 'mcplan_model_cover_code', 'cover_code', key, value);
                else if (objName === 'coverColors') await applyCoverPatch(conn, 'mcplan_model_cover_color', 'color', key, value);
                else if (objName === 'coverCodeColors') await applyCoverCodeColorsPatch(conn, key, value);
                else if (objName === 'revData') await applyRevDataPatch(conn, key, value);
                else if (objName === 'hrsData') await applyHrsDataPatch(conn, key, value, assumeYear);
                else if (objName === 'stockData') await applyStockLikePatch(conn, 'mcplan_model_stock', key, value);
                else if (objName === 'plannedUsedData') await applyStockLikePatch(conn, 'mcplan_model_planned_used', key, value);
                else if (objName === 'sourceMap') await applySourceMapPatch(conn, key, value);
            }
        }

        // stockData/plannedUsedData ของ user แบบจำกัดสิทธิ์: อนุญาตเฉพาะถ้ามี 'Stock' อยู่ใน processes ของตัวเอง
        // (เหมือนของเดิม — ไม่ผ่าน filterPatchByProcess ปกติ เพราะ key เป็น process จริงของ Model ไม่ใช่ 'Stock')
        if (!isAdmin && (allowedProcesses || []).includes('Stock')) {
            for (const objName of ['stockData', 'plannedUsedData']) {
                if (!patch[objName] || typeof patch[objName] !== 'object') continue;
                for (const key of Object.keys(patch[objName])) {
                    const table = objName === 'stockData' ? 'mcplan_model_stock' : 'mcplan_model_planned_used';
                    await applyStockLikePatch(conn, table, key, patch[objName][key]);
                }
            }
        }

        if (isAdmin && patch.announcements && Array.isArray(patch.announcements)) {
            await applyAnnouncementsReplace(conn, patch.announcements);
        }

        if (proc) {
            const now = new Date();
            const timeStr = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString('en-GB');
            const who = (editor && editor.trim()) ? editor.trim() : 'ไม่ระบุชื่อ';
            await conn.query(
                'INSERT INTO mcplan_process_status (process_key, last_saved_text, last_editor) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE last_saved_text = VALUES(last_saved_text), last_editor = VALUES(last_editor)',
                [proc, timeStr, who]
            );
            const modelsArr = Array.from(changedModels || []);
            const [result] = await conn.query(
                'INSERT INTO mcplan_change_log (process_key, models_json, editor, username, time_text) VALUES (?, ?, ?, ?, ?)',
                [proc, JSON.stringify(modelsArr), who, username || null, timeStr]
            );
            changeEntry = { seq: result.insertId, process: proc, models: modelsArr, editor: who, username: username || null, time: timeStr };
        }

        await conn.commit();
        return { changeEntry };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}

const PLAN_SEND_PROCESSES = ['BW', 'LC', 'CW', 'AI'];

// ปุ่ม "ส่งแผนให้ทีม" — ส่งเฉพาะ process ที่มีการบันทึกจริงใหม่ตั้งแต่ครั้งล่าสุดที่ส่งเท่านั้น (ไม่ส่งซ้ำ process ที่ไม่มีอะไรเปลี่ยน)
// ใช้ mcplan_change_log เป็นตัวจำ 2 อย่างพร้อมกัน: แถวบันทึกจริง (process_key = 'BW'/'LC'/...) กับแถว marker ของการส่ง (process_key = 'PlanSend:BW' ฯลฯ)
// เทียบ seq ล่าสุดของทั้งคู่ต่อ process — ถ้าบันทึกจริงมี seq ใหม่กว่า marker ล่าสุด (หรือไม่เคยส่งมาก่อนเลย) แปลว่ามีของใหม่ให้ส่ง
// Rev ต่อ process นับจาก marker ตัวก่อนหน้าของ process นั้นเอง +1 (เริ่ม 00 ถ้าไม่เคยส่งมาก่อน) แล้วเขียนกลับไปที่ mcplan_process_rev ด้วย ให้ตรงกับที่โชว์บนหน้าตาราง
async function sendPlanUpdates({ mcByProcess, comment, editor, username, appUrl }) {
    const pool = getPool();
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();

        const allKeys = [...PLAN_SEND_PROCESSES, ...PLAN_SEND_PROCESSES.map(p => `PlanSend:${p}`)];
        const [rows] = await conn.query(
            'SELECT process_key, seq, models_json, time_text FROM mcplan_change_log WHERE process_key IN (?) ORDER BY seq DESC',
            [allKeys]
        );
        const latestByKey = {};
        rows.forEach(r => { if (!(r.process_key in latestByKey)) latestByKey[r.process_key] = r; }); // แถวแรกที่เจอต่อ key คือ seq สูงสุด (ORDER BY seq DESC)

        const eligible = PLAN_SEND_PROCESSES.filter(p => {
            const lastEdit = latestByKey[p];
            if (!lastEdit) return false; // ไม่เคยมีใครบันทึก process นี้เลย ไม่มีอะไรจะส่ง
            const marker = latestByKey[`PlanSend:${p}`];
            return !marker || lastEdit.seq > marker.seq;
        });

        if (eligible.length === 0) { await conn.rollback(); return { sentProcesses: [], revByProcess: {}, message: null }; }

        const [statusRows] = await conn.query('SELECT process_key, last_saved_text, last_editor FROM mcplan_process_status WHERE process_key IN (?)', [PLAN_SEND_PROCESSES]);
        const statusByProc = {}; statusRows.forEach(r => { statusByProc[r.process_key] = r; });

        const [revRows] = await conn.query('SELECT process_key, rev FROM mcplan_process_rev WHERE process_key IN (?)', [PLAN_SEND_PROCESSES]);
        const curRev = {}; revRows.forEach(r => { curRev[r.process_key] = r.rev; });

        const now = new Date();
        const todayDate = now.toLocaleDateString('en-GB'); // DD/MM/YYYY — รูปแบบเดียวกับส่วนหน้าของ time_text
        const timeStr = todayDate + ' ' + now.toLocaleTimeString('en-GB');
        const who = (editor && editor.trim()) ? editor.trim() : 'ไม่ระบุชื่อ';

        const revByProcess = {};
        const lines = [];
        for (const proc of eligible) {
            const marker = latestByKey[`PlanSend:${proc}`];
            // Rev รีเซ็ตเป็น 00 ทุกวันใหม่ — ส่งครั้งแรกของวันคือ Rev.00 ส่งซ้ำในวันเดียวกันค่อยนับขึ้น
            // ถ้าวันนี้เคยส่งแล้ว นับต่อจาก "เลข Rev ปัจจุบัน" ไม่ใช่จากประวัติการส่ง เพื่อให้ Admin ที่พิมพ์แก้เลขเองในช่อง Rev มีผลจริง
            const sentToday = marker && String(marker.time_text || '').split(' ')[0] === todayDate;
            const newRev = sentToday ? String(parseInt(curRev[proc] || '0', 10) + 1).padStart(2, '0') : '00';
            revByProcess[proc] = newRev;
            await conn.query('UPDATE mcplan_process_rev SET rev = ? WHERE process_key = ?', [newRev, proc]);
            await conn.query('INSERT INTO mcplan_change_log (process_key, models_json, editor, username, time_text) VALUES (?, ?, ?, ?, ?)',
                [`PlanSend:${proc}`, JSON.stringify({ rev: newRev }), who, username || null, timeStr]);
            const st = statusByProc[proc] || {};
            const mc = mcByProcess && mcByProcess[proc] != null ? Number(mcByProcess[proc]) : 0;
            // แนบลิงก์เจาะไปหน้า process นั้นตรงๆ (แอปรองรับ ?process=XX อยู่แล้ว) กดจาก Teams แล้วเปิดหน้าที่ถูกต้องได้เลย
            const link = appUrl ? ` — [เปิดดูแผน ${proc}](${appUrl}?process=${proc})` : '';
            lines.push(`**${proc}** — Total M/C วันนี้: ${mc.toLocaleString('en-US', { maximumFractionDigits: 1 })} | Rev.${newRev} | อัปเดตล่าสุด: ${st.last_saved_text || '-'} โดย ${st.last_editor || '-'}${link}`);
        }

        let message = `📋 **แผนเครื่องจักรอัปเดต**\n\n${lines.join('\n')}\n\nส่งโดย: ${who}`;
        if (comment && comment.trim()) message += `\n\nหมายเหตุ: ${comment.trim()}`;

        await conn.commit();
        return { sentProcesses: eligible, revByProcess, message };
    } catch (err) {
        await conn.rollback();
        throw err;
    } finally {
        conn.release();
    }
}

module.exports = {
    PATCHABLE_KEYS, PROCESS_SCOPED_KEYS, deriveKeyProcess, parseCellKey, filterPatchByProcess,
    getFullState, applyStatePatch, sendPlanUpdates,
    dateKeyToSqlDate, sqlDateToDateKey, // exported for the migration script's reuse
};

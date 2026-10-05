// One-time migration: reads data/store.json + users.json (read-only, never writes them) and
// populates the MySQL schema in db/schema.sql (tables live inside the shared digital_transform_db
// database, all prefixed `mcplan_`). Safe to run repeatedly with --dry-run (rolls back instead of
// committing) while iterating; run for real (no --dry-run) only once, during the planned cutover window.
//
// Usage:
//   node scripts/migrate-to-mysql.js --dry-run [--assume-year=2026]
//   node scripts/migrate-to-mysql.js [--assume-year=2026]      (real run)
//
// See C:\Users\dsst24073\.claude\plans\quirky-wishing-snowglobe.md for the original design rationale
// (written before the AI process existed — the model/cover handling below has since been updated to
// match the current app: AI models are stored client-side as "<groupId>::<display name>" to avoid a
// same-name collision across AI's own two groups, and coverData/coverColors keys are "<process>::<name>"
// instead of bare names, both fixed on the JSON side first — see server.js's migrateCoverDataToScopedKeys
// and seedAIProcess IIFEs — before this script was updated to match).

const fs = require('fs');
const path = require('path');
const { getPool } = require('../db/pool');
const { dateKeyToSqlDate, getFullState } = require('../db/repository');

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const assumeYearArg = args.find(a => a.startsWith('--assume-year='));
const ASSUME_YEAR = assumeYearArg ? parseInt(assumeYearArg.split('=')[1], 10) : new Date().getFullYear();

const DATA_PATH = path.join(__dirname, '..', 'data', 'store.json');
const USERS_PATH = path.join(__dirname, '..', 'users.json');
const KNOWN_PROCESSES = ['BW', 'LC', 'CW', 'AI'];

function deriveProcess(groupCode) {
    const lower = groupCode.toLowerCase();
    if (lower.startsWith('bw')) return 'BW';
    if (lower.startsWith('lc')) return 'LC';
    if (lower.startsWith('cw')) return 'CW';
    if (lower.startsWith('ai')) return 'AI';
    return null;
}

function parseCellKey(key) {
    const parts = key.split('_');
    return { process: parts[0], model: parts.slice(1, -1).join('_'), day: parts[parts.length - 1] };
}

// AI: ชื่อ Model ดิบใน JSON เป็น "<groupId>::<ชื่อที่โชว์>" เสมอ — DB ไม่ต้องใช้ trick นี้ (group_id ให้ unique
// อยู่แล้ว) จึงเก็บแค่ส่วนชื่อที่โชว์ลง mcplan_models.name ส่วน modelIdByProcessName (แผนที่ใน JS ระหว่าง migrate)
// ยังคง key ด้วยชื่อดิบเต็มๆ ("<process>::<groupId>::<ชื่อ>" สำหรับ AI) เพราะ cellData/stockData/coverData ใน
// JSON เดิมอ้างอิงด้วยชื่อดิบนั้น ไม่ใช่ชื่อที่ตัด prefix แล้ว
function aiDisplayName(process, rawName) {
    if (process !== 'AI') return rawName;
    const idx = rawName.indexOf('::');
    return idx === -1 ? rawName : rawName.slice(idx + 2);
}

async function main() {
    console.log(`[migrate] mode: ${DRY_RUN ? 'DRY RUN (will rollback)' : 'REAL RUN (will commit)'}, assumeYear=${ASSUME_YEAR}`);

    const store = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    const usersJson = fs.existsSync(USERS_PATH) ? JSON.parse(fs.readFileSync(USERS_PATH, 'utf8')) : [];

    const pool = getPool();
    const conn = await pool.getConnection();
    const report = { sourceMapUnresolved: [], dateKeysSeen: new Set() };

    try {
        await conn.beginTransaction();

        // 1-2. groups + models
        const groupCodes = Object.keys(Object.assign({}, store.modelState, store.groupLabels));
        const groupIdByCode = {};
        let gOrder = 0;
        for (const code of groupCodes) {
            const process = deriveProcess(code);
            if (!process) { console.warn(`[migrate] SKIP group "${code}": can't derive process from prefix`); continue; }
            const label = (store.groupLabels && store.groupLabels[code]) || '';
            const [result] = await conn.query('INSERT INTO mcplan_groups (code, process, label, sort_order) VALUES (?, ?, ?, ?)', [code, process, label, gOrder++]);
            groupIdByCode[code] = result.insertId;
        }
        console.log(`[migrate] mcplan_groups: ${Object.keys(groupIdByCode).length}`);

        const modelIdByProcessName = {}; // "PROC::<ชื่อดิบตามที่ JSON ใช้จริง>" -> id (สำหรับ AI ชื่อดิบคือ "<groupId>::<ชื่อ>")
        let modelCount = 0;
        for (const code of Object.keys(groupIdByCode)) {
            const groupId = groupIdByCode[code];
            const process = deriveProcess(code);
            const names = store.modelState[code] || [];
            for (let i = 0; i < names.length; i++) {
                const dbName = aiDisplayName(process, names[i]); // AI: ตัด "<groupId>::" ออกก่อนเก็บลง DB
                const [result] = await conn.query('INSERT INTO mcplan_models (group_id, name, sort_order) VALUES (?, ?, ?)', [groupId, dbName, i]);
                const mapKey = `${process}::${names[i]}`; // key ฝั่ง JS ใช้ชื่อดิบเดิม (มี groupId:: ติดมาด้วยถ้าเป็น AI)
                if (!(mapKey in modelIdByProcessName)) modelIdByProcessName[mapKey] = result.insertId;
                modelCount++;
            }
        }
        console.log(`[migrate] mcplan_models: ${modelCount}`);

        // 3. group_params
        let gpCount = 0;
        for (const code of Object.keys(store.groupParams || {})) {
            const groupId = groupIdByCode[code];
            if (!groupId) continue;
            const p = store.groupParams[code];
            await conn.query('INSERT INTO mcplan_group_params (group_id, oa, mct) VALUES (?, ?, ?)', [groupId, p.oa, p.mct]);
            gpCount++;
        }
        console.log(`[migrate] mcplan_group_params: ${gpCount}`);

        // 4. plan_cells / plan_cell_comments / process_hours
        let cellCount = 0, skippedCells = 0;
        for (const key of Object.keys(store.cellData || {})) {
            const { process, model, day } = parseCellKey(key);
            const modelId = modelIdByProcessName[`${process}::${model}`];
            const sqlDate = dateKeyToSqlDate(day, ASSUME_YEAR);
            report.dateKeysSeen.add(day);
            if (!modelId || !sqlDate) { skippedCells++; console.warn(`[migrate] SKIP cellData key "${key}": ${!modelId ? 'model not found' : 'bad date'}`); continue; }
            const val = store.cellData[key];
            if (val === '' || val === null || val === undefined) continue; // ค่าว่าง ไม่ต้อง insert แถวเปล่า
            await conn.query('INSERT INTO mcplan_plan_cells (model_id, plan_date, machine_qty) VALUES (?, ?, ?)', [modelId, sqlDate, val]);
            cellCount++;
        }
        console.log(`[migrate] mcplan_plan_cells: ${cellCount} (skipped ${skippedCells})`);

        let commentCount = 0;
        for (const key of Object.keys(store.cellComments || {})) {
            const { process, model, day } = parseCellKey(key);
            const modelId = modelIdByProcessName[`${process}::${model}`];
            const sqlDate = dateKeyToSqlDate(day, ASSUME_YEAR);
            if (!modelId || !sqlDate || !store.cellComments[key]) continue;
            await conn.query('INSERT INTO mcplan_plan_cell_comments (model_id, plan_date, comment) VALUES (?, ?, ?)', [modelId, sqlDate, store.cellComments[key]]);
            commentCount++;
        }
        console.log(`[migrate] mcplan_plan_cell_comments: ${commentCount}`);

        let hrsCount = 0;
        for (const key of Object.keys(store.hrsData || {})) {
            const idx = key.indexOf('_');
            const processKey = key.slice(0, idx), day = key.slice(idx + 1);
            const sqlDate = dateKeyToSqlDate(day, ASSUME_YEAR);
            report.dateKeysSeen.add(day);
            if (!KNOWN_PROCESSES.includes(processKey) || !sqlDate || store.hrsData[key] === '') continue;
            await conn.query('INSERT INTO mcplan_process_hours (process_key, plan_date, hours) VALUES (?, ?, ?)', [processKey, sqlDate, store.hrsData[key]]);
            hrsCount++;
        }
        console.log(`[migrate] mcplan_process_hours: ${hrsCount}`);
        console.log(`[migrate] distinct date keys seen (eyeball these before a real run!): ${JSON.stringify(Array.from(report.dateKeysSeen).sort())}`);

        // 5. model_cover_code / model_cover_color — key เป็น "<process>::<ชื่อดิบ>" อยู่แล้ว (แก้ที่ JSON-side
        // ไปก่อนหน้านี้ แยก process ชัดเจนในตัวคีย์เอง) จึง resolve ตรงๆ ผ่าน modelIdByProcessName ได้เลย
        // ไม่ต้องเดา/แก้ collision แบบสมัยที่ยังเป็นชื่อเปล่าๆ อีกต่อไป
        let coverCount = 0, coverSkipped = 0;
        for (const key of Object.keys(store.coverData || {})) {
            const idx = key.indexOf('::');
            if (idx === -1) { console.warn(`[migrate] SKIP coverData key "${key}": ไม่มี "::" คั่น process — ข้อมูลรูปแบบเก่า? เช็ค server.js migration ของ JSON ก่อน`); coverSkipped++; continue; }
            const modelId = modelIdByProcessName[key]; // key ทั้งก้อนตรงกับรูปแบบ mapKey พอดี
            if (!modelId) { console.warn(`[migrate] SKIP coverData key "${key}": ไม่พบ model`); coverSkipped++; continue; }
            await conn.query('INSERT INTO mcplan_model_cover_code (model_id, cover_code) VALUES (?, ?)', [modelId, store.coverData[key]]);
            coverCount++;
        }
        console.log(`[migrate] mcplan_model_cover_code: ${coverCount} (skipped ${coverSkipped})`);

        let coverColorCount = 0, coverColorSkipped = 0;
        for (const key of Object.keys(store.coverColors || {})) {
            const modelId = modelIdByProcessName[key];
            if (!modelId) { console.warn(`[migrate] SKIP coverColors key "${key}": ไม่พบ model (Model นี้อาจถูกเปลี่ยนชื่อ/ลบไปแล้ว ทิ้งค่าสีเก่าค้างไว้)`); coverColorSkipped++; continue; }
            await conn.query('INSERT INTO mcplan_model_cover_color (model_id, color) VALUES (?, ?)', [modelId, store.coverColors[key]]);
            coverColorCount++;
        }
        console.log(`[migrate] mcplan_model_cover_color: ${coverColorCount} (skipped ${coverColorSkipped})`);

        // 6. cover_code_colors, process_rev
        let ccCount = 0;
        for (const code of Object.keys(store.coverCodeColors || {})) {
            await conn.query('INSERT INTO mcplan_cover_code_colors (cover_code, color) VALUES (?, ?)', [code, store.coverCodeColors[code]]);
            ccCount++;
        }
        console.log(`[migrate] mcplan_cover_code_colors: ${ccCount}`);

        for (const proc of KNOWN_PROCESSES) {
            const rev = (store.revData && store.revData[proc]) || '00';
            await conn.query('INSERT INTO mcplan_process_rev (process_key, rev) VALUES (?, ?)', [proc, rev]);
        }
        console.log(`[migrate] mcplan_process_rev: ${KNOWN_PROCESSES.length}`);

        // 7. process_status
        const statusKeys = new Set([...Object.keys(store.timestamps || {}), ...Object.keys(store.lastEditor || {})]);
        for (const key of statusKeys) {
            await conn.query('INSERT INTO mcplan_process_status (process_key, last_saved_text, last_editor) VALUES (?, ?, ?)',
                [key, (store.timestamps || {})[key] || null, (store.lastEditor || {})[key] || null]);
        }
        console.log(`[migrate] mcplan_process_status: ${statusKeys.size}`);

        // 8. model_stock / model_planned_used
        let stockCount = 0;
        for (const key of Object.keys(store.stockData || {})) {
            const idx = key.indexOf('_'); const process = key.slice(0, idx), model = key.slice(idx + 1);
            const modelId = modelIdByProcessName[`${process}::${model}`];
            if (!modelId) { console.warn(`[migrate] SKIP stockData key "${key}": model not found`); continue; }
            const rec = store.stockData[key];
            await conn.query('INSERT INTO mcplan_model_stock (model_id, qty, updated_by, updated_at) VALUES (?, ?, ?, ?)',
                [modelId, rec.value, rec.updatedBy || null, rec.updatedAt ? new Date(rec.updatedAt) : null]);
            stockCount++;
        }
        console.log(`[migrate] mcplan_model_stock: ${stockCount}`);

        let plannedCount = 0;
        for (const key of Object.keys(store.plannedUsedData || {})) {
            const idx = key.indexOf('_'); const process = key.slice(0, idx), model = key.slice(idx + 1);
            const modelId = modelIdByProcessName[`${process}::${model}`];
            if (!modelId) { console.warn(`[migrate] SKIP plannedUsedData key "${key}": model not found`); continue; }
            const rec = store.plannedUsedData[key];
            await conn.query('INSERT INTO mcplan_model_planned_used (model_id, qty, updated_by, updated_at) VALUES (?, ?, ?, ?)',
                [modelId, rec.value, rec.updatedBy || null, rec.updatedAt ? new Date(rec.updatedAt) : null]);
            plannedCount++;
        }
        console.log(`[migrate] mcplan_model_planned_used: ${plannedCount}`);

        // 9. model_source_map — exact-name resolution only, no fuzzy matching; report anything unresolved
        let srcCount = 0;
        for (const key of Object.keys(store.sourceMap || {})) {
            const idx = key.indexOf('_'); const destProc = key.slice(0, idx), destModel = key.slice(idx + 1);
            const rec = store.sourceMap[key];
            const destId = modelIdByProcessName[`${destProc}::${destModel}`];
            const srcId = modelIdByProcessName[`${rec.srcProc}::${rec.srcModel}`];
            if (!destId || !srcId) {
                report.sourceMapUnresolved.push({ key, rec, destFound: !!destId, srcFound: !!srcId });
                console.warn(`[migrate] NEEDS MANUAL REVIEW — sourceMap "${key}" -> ${rec.srcProc}/${rec.srcModel}: ${!destId ? 'dest model not found' : 'src model not found'}. Skipped; re-link via the BOM admin UI after cutover.`);
                continue;
            }
            await conn.query('INSERT INTO mcplan_model_source_map (dest_model_id, src_model_id, ratio) VALUES (?, ?, ?)', [destId, srcId, rec.ratio]);
            srcCount++;
        }
        console.log(`[migrate] mcplan_model_source_map: ${srcCount} (${report.sourceMapUnresolved.length} need manual review)`);

        // 10. announcements, change_log
        const announcements = store.announcements || [];
        for (let i = 0; i < announcements.length; i++) {
            await conn.query('INSERT INTO mcplan_announcements (id, text, sort_order) VALUES (?, ?, ?)', [announcements[i].id, announcements[i].text, i]);
        }
        console.log(`[migrate] mcplan_announcements: ${announcements.length}`);

        const changeLog = store.changeLog || [];
        for (const entry of changeLog) {
            await conn.query('INSERT INTO mcplan_change_log (seq, process_key, models_json, editor, username, time_text) VALUES (?, ?, ?, ?, ?, ?)',
                [entry.seq, entry.process, JSON.stringify(entry.models || []), entry.editor || null, entry.username || null, entry.time || null]);
        }
        if (changeLog.length) await conn.query('ALTER TABLE mcplan_change_log AUTO_INCREMENT = ?', [Math.max(...changeLog.map(e => e.seq)) + 1]);
        console.log(`[migrate] mcplan_change_log: ${changeLog.length}`);

        // 11. users
        let userCount = 0;
        for (const u of usersJson) {
            await conn.query('INSERT INTO mcplan_users (username, password_hash, role, processes) VALUES (?, ?, ?, ?)',
                [u.username, u.passwordHash, u.role, JSON.stringify(u.processes || [])]);
            userCount++;
        }
        console.log(`[migrate] mcplan_users: ${userCount}`);

        if (DRY_RUN) {
            console.log('[migrate] --dry-run set: rolling back (nothing committed).');
            await conn.rollback();
        } else {
            await conn.commit();
            console.log('[migrate] COMMITTED.');
        }
    } catch (err) {
        await conn.rollback();
        console.error('[migrate] FAILED, rolled back:', err);
        process.exitCode = 1;
        return;
    } finally {
        conn.release();
    }

    if (report.sourceMapUnresolved.length) {
        console.log('\n[migrate] === sourceMap entries needing manual review ===');
        console.log(JSON.stringify(report.sourceMapUnresolved, null, 2));
    }

    // 12. verification pass — only meaningful on a real (committed) run against the target you intend to keep
    if (!DRY_RUN) {
        console.log('\n[migrate] Running verification pass (reconstructed MySQL state vs. original store.json)...');
        const reconstructed = await getFullState();
        const diff = deepDiffSummary(store, reconstructed, report);
        if (diff.length === 0) console.log('[migrate] VERIFICATION OK — no unexplained differences.');
        else { console.log('[migrate] VERIFICATION FOUND DIFFERENCES (review before trusting cutover):'); diff.forEach(d => console.log('  - ' + d)); }
    }
}

// เทียบเฉพาะจำนวน key ต่อ object แบบคร่าวๆ (ไม่ deep-equal ทุกค่า) — พอเพียงสำหรับเช็คว่าไม่มีอะไรหายไปทั้งกลุ่ม
function deepDiffSummary(original, reconstructed, report) {
    const diffs = [];
    const keys = ['modelState', 'groupLabels', 'cellData', 'cellComments', 'hrsData', 'revData', 'groupParams', 'stockData', 'plannedUsedData', 'announcements', 'coverCodeColors', 'coverData', 'coverColors'];
    for (const k of keys) {
        const oLen = original[k] ? (Array.isArray(original[k]) ? original[k].length : Object.keys(original[k]).length) : 0;
        const rLen = reconstructed[k] ? (Array.isArray(reconstructed[k]) ? reconstructed[k].length : Object.keys(reconstructed[k]).length) : 0;
        if (oLen !== rLen) diffs.push(`${k}: original has ${oLen} entries, reconstructed has ${rLen}`);
    }
    const oSrcLen = Object.keys(original.sourceMap || {}).length;
    const rSrcLen = Object.keys(reconstructed.sourceMap || {}).length;
    if (oSrcLen - report.sourceMapUnresolved.length !== rSrcLen) diffs.push(`sourceMap: original ${oSrcLen}, reconstructed ${rSrcLen}, unresolved ${report.sourceMapUnresolved.length} — counts don't add up, investigate`);
    return diffs;
}

main().then(() => process.exit(process.exitCode || 0)).catch(err => { console.error(err); process.exit(1); });

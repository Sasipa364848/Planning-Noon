// MySQL-backed replacement for the old users.json array + findUser/verifyCredentials/saveUsers logic.
const bcrypt = require('bcryptjs');
const { getPool } = require('./pool');

const PROCESS_KEYS = ['BW', 'LC', 'CW', 'AI', 'Stock'];

// mysql2 auto-parses JSON-typed columns เป็น JS array/object ให้อยู่แล้ว (ไม่ใช่ string) ตั้งแต่รุ่นที่ใช้อยู่นี้
// เผื่อพฤติกรรมต่างกันไปตามรุ่น เช็คให้ชัวร์ก่อนว่าเป็น string ค่อย JSON.parse ไม่งั้น parse ของที่ parse แล้วจะพัง
function rowToUser(row) {
    const processes = typeof row.processes === 'string' ? JSON.parse(row.processes || '[]') : (row.processes || []);
    return { username: row.username, passwordHash: row.password_hash, role: row.role, processes };
}

async function findUser(username) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT username, password_hash, role, processes FROM mcplan_users WHERE username = ? LIMIT 1', [username]);
    return rows.length ? rowToUser(rows[0]) : null;
}

async function listUsers() {
    const pool = getPool();
    const [rows] = await pool.query('SELECT username, password_hash, role, processes FROM mcplan_users ORDER BY id');
    return rows.map(rowToUser);
}

async function countAdmins(excludingUsername) {
    const pool = getPool();
    const [rows] = await pool.query(
        excludingUsername ? "SELECT COUNT(*) AS n FROM mcplan_users WHERE role='admin' AND username <> ?" : "SELECT COUNT(*) AS n FROM mcplan_users WHERE role='admin'",
        excludingUsername ? [excludingUsername] : []
    );
    return rows[0].n;
}

async function verifyCredentials(username, password) {
    const u = await findUser(username);
    if (!u || typeof password !== 'string') return null;
    return bcrypt.compareSync(password, u.passwordHash) ? u : null;
}

async function addUser(newUsername, newPassword, role, processes) {
    const validProcesses = Array.isArray(processes) ? processes.filter(p => PROCESS_KEYS.includes(p)) : [];
    const pool = getPool();
    await pool.query(
        'INSERT INTO mcplan_users (username, password_hash, role, processes) VALUES (?, ?, ?, ?)',
        [newUsername, bcrypt.hashSync(newPassword, 10), role, JSON.stringify(role === 'admin' ? [] : validProcesses)]
    );
}

async function updateUser(targetUsername, { newPassword, role, processes }) {
    const pool = getPool();
    const target = await findUser(targetUsername);
    if (!target) return false;
    const nextRole = role || target.role;
    const nextProcesses = (processes !== undefined)
        ? (nextRole === 'admin' ? [] : (Array.isArray(processes) ? processes.filter(p => PROCESS_KEYS.includes(p)) : []))
        : (nextRole === 'admin' ? [] : target.processes);
    const sets = ['role = ?', 'processes = ?'];
    const params = [nextRole, JSON.stringify(nextProcesses)];
    if (newPassword) { sets.push('password_hash = ?'); params.push(bcrypt.hashSync(newPassword, 10)); }
    params.push(targetUsername);
    await pool.query(`UPDATE mcplan_users SET ${sets.join(', ')} WHERE username = ?`, params);
    return true;
}

async function deleteUser(targetUsername) {
    const pool = getPool();
    await pool.query('DELETE FROM mcplan_users WHERE username = ?', [targetUsername]);
}

async function seedAdminIfEmpty(adminPassword) {
    const pool = getPool();
    const [rows] = await pool.query('SELECT COUNT(*) AS n FROM mcplan_users');
    if (rows[0].n > 0) return false;
    await pool.query(
        'INSERT INTO mcplan_users (username, password_hash, role, processes) VALUES (?, ?, ?, ?)',
        ['admin', bcrypt.hashSync(adminPassword || 'changeme', 10), 'admin', JSON.stringify([])]
    );
    return true;
}

module.exports = { PROCESS_KEYS, findUser, listUsers, countAdmins, verifyCredentials, addUser, updateUser, deleteUser, seedAdminIfEmpty };

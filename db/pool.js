// MySQL connection pool — single module-level pool shared by the whole app (server.js and scripts/*).
// Config precedence: environment variables override config.json, so credentials can be kept out of
// the checked-in config file if preferred (config.json's mysql.* fields exist as a fallback, matching
// how this app already keeps its other settings in config.json).
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');

function loadDbConfig() {
    const configPath = path.join(__dirname, '..', 'config.json');
    let fileCfg = {};
    if (fs.existsSync(configPath)) {
        try { fileCfg = JSON.parse(fs.readFileSync(configPath, 'utf8')).mysql || {}; } catch (e) { /* fall through to env/defaults */ }
    }
    return {
        host: process.env.DB_HOST || fileCfg.host || 'localhost',
        port: Number(process.env.DB_PORT || fileCfg.port || 3306),
        user: process.env.DB_USER || fileCfg.user || '',
        password: process.env.DB_PASSWORD || fileCfg.password || '',
        database: process.env.DB_NAME || fileCfg.database || 'mc_plan_dashboard',
    };
}

let pool = null;
function getPool() {
    if (!pool) {
        const cfg = loadDbConfig();
        pool = mysql.createPool({
            host: cfg.host,
            port: cfg.port,
            user: cfg.user,
            password: cfg.password,
            database: cfg.database,
            charset: 'utf8mb4_unicode_ci',
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            enableKeepAlive: true,
            keepAliveInitialDelay: 10000,
        });
        pool.on('error', (err) => console.error('[MySQL pool error]', err.code, err.message));
    }
    return pool;
}

module.exports = { getPool, loadDbConfig };

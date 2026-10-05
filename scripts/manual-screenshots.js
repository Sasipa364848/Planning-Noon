// ถ่ายภาพประกอบคู่มือ (public/manual.html) จากแอปจริงที่รันอยู่ — แก้หน้าตาแอปเมื่อไหร่ รันใหม่ภาพจะตรงทุกภาพ
// วิธีใช้: node scripts/manual-screenshots.js [http://localhost:3000]
// ต้องมี Google Chrome หรือ Microsoft Edge ในเครื่อง · ภาพบันทึกที่ public/img/manual/
const { spawn } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const BASE = process.argv[2] || 'http://localhost:3000';
const OUT = path.join(__dirname, '..', 'public', 'img', 'manual');
const PORT = 9333;
const BROWSERS = [
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
];

// โค้ดที่ฉีดเข้าหน้าเว็บ: วางวงกลมตัวเลขสีส้มที่มุมซ้ายบนของ element (ใช้ชี้ส่วนต่างๆ ในภาพ)
const MARK_FN = `window.__mark = (sel, n, dx = -10, dy = -10) => {
    const el = typeof sel === 'string' ? document.querySelector(sel) : sel;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const m = document.createElement('div');
    m.textContent = n;
    m.style.cssText = 'position:fixed;z-index:99999;width:24px;height:24px;border-radius:50%;background:#f97316;color:#fff;' +
        'font:700 13px Prompt,sans-serif;display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 3px #fff;' +
        'left:' + (r.left + dx) + 'px;top:' + (r.top + dy) + 'px;';
    document.body.appendChild(m);
};`;

const SHOTS = [
    {
        file: 'main-layout.png', url: '/?process=BW', width: 1440, height: 760,
        setup: `
            __mark('#tabBtn-Overview', 1, 2, 4);
            __mark('#dateNav', 2);
            __mark('#viewToggleGroup', 3);
            __mark('#searchBox', 4);
            __mark('#bellBtn', 5);
            __mark('#todayStatsRow', 6);
            __mark('#processAnnouncementsCard', 7);
            __mark('#planToolbar', 8);
            __mark(document.querySelector('#mainTable tr.grp-band'), 9);
            __mark(document.querySelector('#mainTable input.table-input[data-lvl="1"], #mainTable input.table-input[data-lvl="2"], #mainTable input.table-input[data-lvl="3"]'), 10, -14, -8);`,
    },
    {
        file: 'stock-table.png', url: '/?process=Stock', width: 1440, height: 900,
        clip: '#stockContainer',
        setup: `
            openStockTab('LC');
            processConfig.LC.groups.forEach(g => { stockGroupOverrides[g.id] = true; });
            renderStockPage();
            const ths = document.querySelectorAll('#stockTable thead th');
            __mark(ths[2], 1, 4, 4); __mark(ths[3], 2, 4, 4); __mark(ths[4], 3, 4, 4); __mark(ths[5], 4, 4, 4); __mark(ths[6], 5, 4, 4);
            __mark(document.querySelector('#stockTable .ship-src'), 6);
            __mark('#stockProcessFilterGroup', 7);`,
    },
    {
        file: 'home.png', url: '/?process=Overview', width: 1440, height: 900,
        setup: `
            const cards = document.querySelectorAll('.proc-card');
            __mark(cards[0], 1); __mark(cards[2], 2);
            __mark('#urgentPanel', 3); __mark('#daysSupplyPanel', 4); __mark('#heatPanel', 5);`,
    },
];

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
    const exe = BROWSERS.find(p => fs.existsSync(p));
    if (!exe) throw new Error('ไม่พบ Chrome หรือ Edge');
    fs.mkdirSync(OUT, { recursive: true });
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'manual-shots-'));
    const browser = spawn(exe, ['--headless=new', '--disable-gpu', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
    try {
        let pages;
        for (let i = 0; i < 40 && !pages; i++) {
            await sleep(250);
            pages = await fetch(`http://127.0.0.1:${PORT}/json/list`).then(r => r.json()).catch(() => null);
        }
        const page = pages.find(p => p.type === 'page');
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
        let id = 0;
        const pending = new Map();
        ws.onmessage = ev => {
            const msg = JSON.parse(ev.data);
            if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
        };
        const send = (method, params = {}) => new Promise(res => { const n = ++id; pending.set(n, res); ws.send(JSON.stringify({ id: n, method, params })); });
        const evaluate = async (expr) => {
            const r = await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
            if (r.result && r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || 'evaluate failed');
            return r.result?.result?.value;
        };

        for (const shot of SHOTS) {
            await send('Emulation.setDeviceMetricsOverride', { width: shot.width, height: shot.height, deviceScaleFactor: 1, mobile: false });
            await send('Page.navigate', { url: BASE + shot.url });
            await sleep(3500);
            await evaluate(MARK_FN + shot.setup + '; true');
            await sleep(400);
            let clip;
            if (shot.clip) {
                const rect = await evaluate(`(() => { const r = document.querySelector('${shot.clip}').getBoundingClientRect(); return { x: r.left - 8, y: r.top - 8, width: r.width + 16, height: Math.min(r.height + 16, ${shot.height} - r.top) }; })()`);
                clip = { ...rect, scale: 1 };
            }
            const shotRes = await send('Page.captureScreenshot', clip ? { format: 'png', clip } : { format: 'png' });
            fs.writeFileSync(path.join(OUT, shot.file), Buffer.from(shotRes.result.data, 'base64'));
            console.log('saved', shot.file);
        }
        ws.close();
    } finally {
        browser.kill();
        await sleep(500);
        fs.rmSync(profile, { recursive: true, force: true });
    }
}

main().catch(e => { console.error(e.message); process.exit(1); });

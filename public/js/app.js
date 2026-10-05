// === ภาษา (TH/EN) ===
// dict = ข้อความ UI คงที่ (เมนู/ปุ่ม/หัวตาราง/ป้ายสถานะ) เท่านั้น — ไม่รวมข้อมูลที่ผู้ใช้กรอกเอง (ชื่อ Model, ชื่อกลุ่ม, ประกาศ, คอมเมนต์) เพราะสิ่งเหล่านั้นคือข้อมูลจริง ไม่ใช่ UI ที่ควรแปล
let appLang = localStorage.getItem('master_plan_lang') === 'en' ? 'en' : 'th';
let darkMode = localStorage.getItem('master_plan_dark_mode') === 'true';
const I18N = {
    nav_home: { th: 'หน้าแรก', en: 'Home' },
    nav_stock: { th: 'สต็อก', en: 'Stock' },
    view_label: { th: 'มุมมอง', en: 'View' },
    hide_empty: { th: 'ซ่อน Model ว่าง', en: 'Hide empty models' },
    hide_empty_title: { th: 'ซ่อน Model ที่ไม่มีข้อมูล', en: 'Hide models with no data' },
    search_placeholder: { th: 'ค้นหา Model...', en: 'Search model...' },
    view_1day: { th: '1 วัน', en: '1 Day' },
    view_1week: { th: '1 สัปดาห์', en: '1 Week' },
    view_1month: { th: '1 เดือน', en: '1 Month' },
    edit_plan_label: { th: 'แก้ไขแผน', en: 'Edit plan' },
    save_btn: { th: 'บันทึก', en: 'Save' },
    undo_title: { th: 'เลิกทำ (Undo)', en: 'Undo' },
    redo_title: { th: 'ทำซ้ำ (Redo)', en: 'Redo' },
    notif_title: { th: 'การอัปเดตล่าสุด', en: 'Recent updates' },
    notif_label: { th: ' แจ้งเตือน', en: ' Notifications' },
    more_title: { th: 'ตัวเลือกเพิ่มเติม', en: 'More options' },
    more_label: { th: 'เพิ่มเติม', en: 'More' },
    io_section: { th: 'นำเข้า/ส่งออกข้อมูล', en: 'Import / Export' },
    export_csv: { th: 'ส่งออก CSV', en: 'Export CSV' },
    import_csv: { th: 'นำเข้า CSV', en: 'Import CSV' },
    export_pdf: { th: 'ส่งออก PDF', en: 'Export PDF' },
    clear_range: { th: 'ลบข้อมูลช่วงวันที่', en: 'Clear date range data' },
    kiosk_mode: { th: 'โหมดจอรวม/ทีวี', en: 'Kiosk / TV mode' },
    shortcuts_hint: { th: 'เคล็ดลับการใช้งาน', en: 'Usage tips' },
    login_btn: { th: 'เข้าสู่ระบบ', en: 'Login' },
    mark_all_read: { th: 'ทำเครื่องหมายว่าอ่านแล้ว', en: 'Mark all as read' },
    dark_mode_title: { th: 'สลับโหมดมืด', en: 'Toggle dark mode' },
    copy_prev_period: { th: 'คัดลอกจากช่วงก่อนหน้า', en: 'Copy from previous period' },
    copy_prev_period_title: { th: 'คัดลอกจำนวนเครื่องจากช่วงก่อนหน้า (ยาวเท่าที่กำลังดูอยู่) มาเป็นจุดตั้งต้น', en: "Copy machine counts from the previous period (same length as what you're viewing) as a starting point" },
    admin_mode_label: { th: 'โหมด Admin', en: 'Admin Mode' },
    admin_settings_title: { th: 'ตั้งค่าระบบ', en: 'System settings' },
    manage_users: { th: 'จัดการผู้ใช้งาน', en: 'Manage users' },
    manage_bom: { th: 'จัดการแหล่งวัตถุดิบ (BOM)', en: 'Manage material sources (BOM)' },
    test_teams: { th: 'ทดสอบแจ้งเตือน Teams', en: 'Test Teams notification' },
    send_plan: { th: 'ส่งแผนให้ทีม', en: 'Send plan to team' },
    send_plan_title: { th: 'ส่งแผนที่แก้ไขใหม่ให้ทีมทาง Teams', en: 'Send the updated plan to the team via Teams' },
    date_label: { th: 'วันที่', en: 'Date' },
    update_label: { th: 'อัปเดต', en: 'Update' },

    home_title: { th: 'หน้าแรก — ภาพรวมการผลิตและสต็อก', en: 'Home — Production & stock overview' },
    items_tracked: { th: 'รายการที่ติดตาม', en: 'tracked items' },
    stock_remaining_unit: { th: 'ชิ้นคงเหลือ', en: 'pcs remaining' },
    planned_used_prefix: { th: 'Shipment', en: 'Shipment' },
    no_planned_data: { th: 'ยังไม่มีข้อมูล Shipment', en: 'No shipment data yet' },
    no_data: { th: 'ยังไม่มีข้อมูล', en: 'No data' },
    no_issues: { th: 'ไม่มีปัญหา', en: 'No issues' },
    critical_word: { th: 'วิกฤต', en: 'critical' },
    low_stock_word: { th: 'สต็อกต่ำ', en: 'low stock' },
    donut_legend_label: { th: 'สีในวงโดนัท:', en: 'Donut colors:' },
    heat_panel_title: { th: 'แผนการผลิต 7 วันข้างหน้า (M/C ต่อวัน)', en: 'Next 7 days production plan (M/C per day)' },
    workload_panel_title: { th: 'ภาระงานรายวัน (M/C)', en: 'Daily workload (M/C)' },
    heat_dark_note: { th: 'สีเข้ม = วันที่งานหนัก', en: 'Darker = heavier workload day' },
    urgent_panel_title: { th: 'รายการวิกฤตด่วน', en: 'Urgent items' },
    view_all_stock: { th: 'ดูทั้งหมดที่สต็อก', en: 'View all in stock' },
    top_model_title: { th: 'Top Model ตามแผน 7 วันข้างหน้า', en: 'Top models — next 7 days plan' },
    no_production_data: { th: 'ยังไม่มีข้อมูลการผลิต', en: 'No production data yet' },
    total_plan_today_title: { th: 'แผนผลิตรวมของวันนี้', en: "Today's total production plan" },
    days_supply_title: { th: 'สต็อกจะหมดในกี่วัน (Days of supply)', en: 'Days of supply' },
    days_supply_note: { th: 'สต็อก ÷ Shipment', en: 'Stock ÷ Shipment' },
    no_calc_data: { th: 'ไม่มีรายการที่ใกล้หมดสต็อก (≤14 วัน)', en: 'No items running low (≤14 days)' },
    days_unit: { th: 'วัน', en: 'days' },

    nav_process_prefix: { th: 'กระบวนการ', en: '' },
    nav_process_suffix: { th: '', en: 'Process' },
    mc_today: { th: 'รวม M/C (วันนี้)', en: 'Total M/C (Today)' },
    plan_today: { th: 'รวมแผนผลิต (วันนี้)', en: 'Total Plan (Today)' },
    pcs_calc_note: { th: 'ชิ้น · คำนวณจาก OA% / MCT ของแต่ละกลุ่ม', en: 'pcs · calculated from each group\'s OA% / MCT' },
    models_planned: { th: 'Model ที่มีแผนในช่วงนี้', en: 'Models planned in this range' },

    stock_problems_only: { th: 'เฉพาะที่มีปัญหา', en: 'Problems only' },
    stock_select_all: { th: 'เลือกทั้งหมด', en: 'Select all' },
    stock_select_all_title: { th: 'เลือก Model ทั้งหมดที่กำลังกรองอยู่ตอนนี้ (ใช้เตรียมเคลียร์/ลบเป็นชุด)', en: 'Select every model currently in the filtered view (to prepare a bulk clear/delete)' },
    stock_clear_all: { th: 'ล้างสต็อกทุกกระบวนการ', en: 'Clear all stock' },
    stock_clear_all_title: { th: 'ล้างสต็อกปัจจุบัน + Shipment ของทุกกระบวนการรวดเดียว (Model ยังอยู่ครบ)', en: 'Clear current stock + shipment for every process at once (models are kept)' },
    stock_clear_all_confirm: { th: 'ยืนยันล้างข้อมูลสต็อก (สต็อกปัจจุบัน + Shipment) ของทุกกระบวนการ? ตัว Model ยังอยู่ครบ แค่ยอดว่างลง — ล้างแล้วย้อนกลับไม่ได้', en: 'Clear stock data (current stock + shipment) for every process? Models are kept, only the numbers are emptied — this cannot be undone' },
    stock_clear_all_btn: { th: 'ล้างทุกกระบวนการ', en: 'Clear all processes' },
    stock_clear_all_empty: { th: 'ยังไม่มีข้อมูลสต็อกให้ล้าง', en: 'No stock data to clear' },
    stock_clear_all_done: { th: 'ล้างข้อมูลสต็อกแล้ว', en: 'Stock data cleared for' },
    stock_problems_only_title: { th: 'โชว์เฉพาะ Model ที่สต็อกมีปัญหา (Low/Critical)', en: 'Show only models with stock problems (Low/Critical)' },
    count_sheet_print: { th: 'พิมพ์ใบนับ', en: 'Print count sheet' },
    count_sheet_print_title: { th: 'พิมพ์ใบนับสต็อกของแท็บนี้ ไว้เดินจดตัวเลข', en: 'Print a stock count sheet for this tab' },
    count_entry: { th: 'กรอกจากใบนับ', en: 'Enter from sheet' },
    lc_no_plan_today: { th: 'ไม่มีแผนวันนี้', en: 'no plan this day' },
    ship_auto_title: { th: 'คำนวณจากแผนผลิตของกระบวนการที่ใช้ (BW ← LC, LC ← CW) ในวันที่เลือก ตามความสัมพันธ์ใน BOM (เครื่อง × Hrs × 3600 ÷ MCT × OA% × อัตราส่วน)', en: 'Calculated from the consuming process plan (BW ← LC, LC ← CW) on the selected day via the BOM (M/C × Hrs × 3600 ÷ MCT × OA% × ratio)' },
    plan_title_short: { th: 'แผน M/C', en: 'M/C plan' },
    nav_plans_label: { th: 'แผนการผลิต', en: 'Production plans' },
    login_to_edit: { th: 'เข้าสู่ระบบเพื่อแก้ไข', en: 'Log in to edit' },
    date_prev_title: { th: 'ช่วงก่อนหน้า', en: 'Previous period' },
    date_next_title: { th: 'ช่วงถัดไป', en: 'Next period' },
    today_btn: { th: 'วันนี้', en: 'Today' },
    viewers_title: { th: 'คนที่กำลังเปิดหน้านี้อยู่', en: 'People viewing now' },
    collapse_all: { th: 'พับทุกกลุ่ม', en: 'Collapse all' },
    expand_all: { th: 'กางทุกกลุ่ม', en: 'Expand all' },
    weekend_label: { th: 'วันหยุด', en: 'Weekend' },
    table_hint: { th: 'คลิกช่องเพื่อแก้ · Enter/ลูกศร ไปช่องถัดไป', en: 'Click a cell to edit · Enter/arrows to move' },
    group_empty_collapsed: { th: 'ว่างในช่วงนี้ (พับไว้)', en: 'empty in this range (collapsed)' },
    announce_view_all: { th: 'ดูทั้งหมด', en: 'View all' },
    announce_collapse: { th: 'ย่อ', en: 'Collapse' },
    plan_7d_prefix: { th: 'แผน 7 วัน', en: '7-day plan' },
    stock_not_entered: { th: 'ยังไม่ได้กรอกสต็อก', en: 'No stock entered yet' },
    open_plan_hint: { th: 'คลิกเพื่อเปิดแผน', en: 'Click to open the plan' },
    auto_plan: { th: 'Auto Plan', en: 'Auto Plan' },
    manual_title: { th: 'คู่มือการใช้งาน', en: 'User manual' },
    undo_label: { th: 'เลิกทำ', en: 'Undo' },
    redo_label: { th: 'ทำซ้ำ', en: 'Redo' },
    auto_plan_title: { th: 'กรอกเครื่อง CW แล้วให้ระบบคำนวณ LC / BW ตาม BOM', en: 'Enter CW machines and let the system calculate LC / BW from the BOM' },
    count_scan: { th: 'อ่านจากใบสแกน', en: 'Read scanned sheet' },
    count_scan_title: { th: 'เลือกไฟล์สแกนใบนับ (PDF/รูป) ระบบจะอ่านตัวเลขแล้วกรอกให้ ตรวจก่อนบันทึก', en: 'Pick a scanned count sheet (PDF/image); numbers are read and filled in for review' },
    count_entry_title: { th: 'กรอกสต็อกที่นับได้จากใบนับ เรียงตามลำดับเดียวกัน กด Enter ไล่ลงไป', en: 'Type counted stock from the sheet in the same order, Enter moves down' },
    problems_suffix: { th: 'มีปัญหา', en: 'with problems' },
    th_current_stock_sub: { th: '(จำนวนชิ้น/Pcs)', en: '(Pcs)' },
    th_last_counted_sub: { th: '(เมื่อไหร่/ใคร)', en: '(when / by whom)' },
    th_planned_used_sub: { th: '(ชิ้น/Pcs — ที่ผูก BOM คิดจากแผนปลายทาง)', en: '(Pcs — BOM-linked models use the downstream plan)' },
    attention_list_title: { th: 'รายการที่ต้องดูก่อน', en: 'Items needing attention' },
    th_process: { th: 'กระบวนการ', en: 'Process' },
    th_current_stock: { th: 'สต็อกปัจจุบัน', en: 'Current stock' },
    th_last_counted: { th: 'นับล่าสุด', en: 'Last counted' },
    th_planned_used: { th: 'Shipment', en: 'Shipment' },
    th_balance: { th: 'คงเหลือ', en: 'Balance' },
    th_status: { th: 'ใช้ได้อีก', en: 'Days left' },
    models_selected_suffix: { th: 'Model ที่เลือก', en: 'models selected' },
    clear_stock_data: { th: 'เคลียร์ข้อมูลสต็อก', en: 'Clear stock data' },
    clear_stock_data_title: { th: 'เคลียร์สต็อกปัจจุบัน + Shipment ของ Model ที่เลือกไว้', en: 'Clear current stock + shipment for the selected models' },
    delete_model_bulk: { th: 'ลบ Model', en: 'Delete model' },
    delete_model_bulk_title: { th: 'ลบ Model ที่เลือกไว้ออกจากระบบถาวร', en: 'Permanently delete the selected models' },
    clear_selection: { th: 'ยกเลิกการเลือก', en: 'Clear selection' },
    clear_selection_title: { th: 'ยกเลิก Model ที่เลือกไว้ทั้งหมด', en: 'Deselect every selected model' },
    today_note: { th: 'วันนี้', en: 'Today' },
    few_label: { th: 'น้อย', en: 'Low' },
    many_label: { th: 'มาก', en: 'High' },
    pcs_unit: { th: 'ชิ้น', en: 'pcs' },
    pcs_unit_paren: { th: 'ชิ้น (Pcs)', en: 'Pcs' },
    machines_unit: { th: 'เครื่อง', en: 'units' },
    no_urgent_items: { th: 'ไม่มีรายการที่ต้องเร่งดำเนินการ', en: 'No urgent items right now' },
    items_count_suffix: { th: 'รายการ', en: 'items' },

    total_prefix: { th: 'รวม', en: 'Total' },
    sync_status_ok: { th: 'ซิงค์ล่าสุด', en: 'Last synced' },
    sync_status_offline: { th: 'ขาดการเชื่อมต่อ server', en: 'Lost connection to server' },
    connecting_status: { th: 'กำลังเชื่อมต่อ...', en: 'Connecting...' },
    still_empty_suffix: { th: 'รายการยังว่างในช่วงนี้', en: 'items still empty in this range' },
    peak_in_range_prefix: { th: 'สูงสุดในช่วงนี้', en: 'Peak in this range' },
    no_plan_in_range: { th: 'ยังไม่มีแผนในช่วงนี้', en: 'No plan in this range yet' },
    announcements_title: { th: 'ประกาศ', en: 'Announcements' },
    add_announcement: { th: 'เพิ่มประกาศ', en: 'Add announcement' },
    no_announcements: { th: 'ยังไม่มีประกาศ', en: 'No announcements yet' },
};
function t(key) { return (I18N[key] && I18N[key][appLang]) || (I18N[key] && I18N[key].th) || key; }
function procLabel(proc) { return appLang === 'en' ? `${proc} ${t('nav_process_suffix')}` : `${t('nav_process_prefix')} ${proc}`; }
function processPageTitle(proc) { return appLang === 'en' ? `M/C Plan of ${proc} process` : `แผนการผลิต M/C กระบวนการ ${proc}`; }
function setLang(lang) {
    if (lang !== 'th' && lang !== 'en') return;
    appLang = lang;
    localStorage.setItem('master_plan_lang', lang);
    updateLangBtnUI();
    applyStaticLangText();
    updatePageTitleForCurrentProcess();
    updateAdminUI();
    updateDateRangeLabel();
    rerenderCurrentView();
}
// อัปเดตแค่หัวข้อหน้า (pageTitle/printTitle) ตามภาษาปัจจุบัน — แยกจาก switchProcess() เพราะ switchProcess()
// มี side effect อื่นด้วย (เช่นเคลียร์ช่องค้นหา) ที่ไม่อยากให้เกิดขึ้นแค่เพราะสลับภาษา
function updatePageTitleForCurrentProcess() {
    if (currentProcess === 'Overview') {
        document.getElementById('pageTitle').innerHTML = `<i class="fas fa-house"></i> ${t('home_title')}`;
        document.getElementById('printTitle').innerText = t('home_title');
    } else if (currentProcess === 'Stock') {
        document.getElementById('pageTitle').innerHTML = `<i class="fas fa-boxes-stacked"></i> ${t('nav_stock')}`;
        document.getElementById('printTitle').innerText = t('nav_stock');
    } else if (processConfig[currentProcess]) {
        document.getElementById('pageTitle').innerHTML = `<span class="proc-dot proc-dot-${currentProcess}"></span> ${t('plan_title_short')} · ${currentProcess}`;
        document.getElementById('printTitle').innerText = processConfig[currentProcess].title;
    }
}
function updateLangBtnUI() {
    const thBtn = document.getElementById('langBtnTh'), enBtn = document.getElementById('langBtnEn');
    if (thBtn) thBtn.classList.toggle('active', appLang === 'th');
    if (enBtn) enBtn.classList.toggle('active', appLang === 'en');
}
function toggleDarkMode() {
    darkMode = !darkMode;
    localStorage.setItem('master_plan_dark_mode', String(darkMode));
    applyDarkMode();
}
function applyDarkMode() {
    document.body.classList.toggle('dark-mode', darkMode);
    const btn = document.getElementById('darkModeBtn');
    if (btn) { btn.classList.toggle('active', darkMode); btn.innerHTML = `<i class="fas ${darkMode ? 'fa-sun' : 'fa-moon'}"></i>`; }
}
// ข้อความ UI ที่เป็น HTML คงที่ (ไม่ได้ generate ด้วย JS) — หา element ด้วย data-i18n / data-i18n-title / data-i18n-placeholder แล้วเซ็ตข้อความตามภาษาปัจจุบัน
function applyStaticLangText() {
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.getAttribute('data-i18n')); });
    document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.getAttribute('data-i18n-title')); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.placeholder = t(el.getAttribute('data-i18n-placeholder')); });
    ['BW', 'LC', 'CW', 'AI'].forEach(p => {
        const el = document.getElementById(`navProcLabel-${p}`);
        if (el) el.textContent = procLabel(p);
    });
}

// === Configuration (โครงสร้างตาราง/กลุ่ม — เป็น logic การแสดงผล ไม่ใช่ข้อมูล จึงยังอยู่ฝั่ง client) ===
const processConfig = {
    BW: {
        titleSuffix: "BW", hasCover: false,
        groups: [
            { id: 'bw_dg1_esd' },
            { id: 'bw_dg1', totals: [{ label: { th: 'รวม DG1 Normal', en: 'Total DG1 Normal' }, sum: ['bw_dg1_esd', 'bw_dg1'] }] },
            { id: 'bw_dg1_mini', totals: [{ label: { th: 'รวม DG1 Mini', en: 'Total DG1 Mini' }, sum: ['bw_dg1_mini'] }] },
            { id: 'bw_dg2_esd', totals: [{ label: { th: 'รวม DG2', en: 'Total DG2' }, sum: ['bw_dg2_esd'] }, { label: { th: 'รวมทั้งหมด', en: 'Grand Total' }, sum: ['bw_dg1_esd', 'bw_dg1', 'bw_dg1_mini', 'bw_dg2_esd'], isGrand: true }] }
        ]
    },
    LC: {
        titleSuffix: "LC", hasCover: false,
        groups: [
            { id: 'lc_std_normal' },
            { id: 'lc_std_mini', totals: [{ label: { th: 'รวม Standard', en: 'Total Standard' }, sum: ['lc_std_normal', 'lc_std_mini'] }] },
            { id: 'lc_low_normal' },
            { id: 'lc_low_mini', totals: [{ label: { th: 'รวม Low', en: 'Total Low' }, sum: ['lc_low_normal', 'lc_low_mini'] }, { label: { th: 'รวม DG1', en: 'Total DG1' }, sum: ['lc_std_normal', 'lc_std_mini', 'lc_low_normal', 'lc_low_mini'], isDg1: true }] },
            { id: 'lc_dg2', totals: [{ label: { th: 'รวม DG2', en: 'Total DG2' }, sum: ['lc_dg2'] }, { label: { th: 'รวมทั้งหมด', en: 'Grand Total' }, sum: ['lc_std_normal', 'lc_std_mini', 'lc_low_normal', 'lc_low_mini', 'lc_dg2'], isGrand: true }] }
        ]
    },
    CW: {
        titleSuffix: "CW", hasCover: true,
        groups: [
            { id: 'cw_dg1_normal', totals: [{ isGroupTotal: true, sum: ['cw_dg1_normal'] }] },
            { id: 'cw_dg1_mini', totals: [{ isGroupTotal: true, sum: ['cw_dg1_mini'] }] },
            { id: 'cw_new_type_1', totals: [{ isGroupTotal: true, sum: ['cw_new_type_1'] }] },
            { id: 'cw_new_type_2', totals: [{ isGroupTotal: true, sum: ['cw_new_type_2'] }] },
            { id: 'cw_dg2_esd', totals: [{ label: { th: 'รวม', en: 'Total' }, sum: ['cw_dg2_esd'] }, { label: { th: 'รวมทั้งหมด', en: 'Grand Total' }, sum: ['cw_dg1_normal', 'cw_dg1_mini', 'cw_new_type_1', 'cw_new_type_2', 'cw_dg2_esd'], isGrand: true }] }
        ]
    },
    AI: {
        titleSuffix: "AI", hasCover: true,
        groups: [
            { id: 'ai_t1_t3', totals: [{ isGroupTotal: true, sum: ['ai_t1_t3'] }] },
            { id: 'ai_i1', totals: [{ label: { th: 'รวม', en: 'Total' }, sum: ['ai_i1'] }, { label: { th: 'รวมทั้งหมด', en: 'Grand Total' }, sum: ['ai_t1_t3', 'ai_i1'], isGrand: true }] }
        ]
    }
};
Object.keys(processConfig).forEach(p => {
    Object.defineProperty(processConfig[p], 'title', { get() { return processPageTitle(processConfig[p].titleSuffix); } });
});

// AI: Model ชื่อเดียวกันซ้ำได้ในหลายกลุ่มเครื่อง (เช่น "AC-No cover_Auto" อยู่ทั้งกลุ่ม T1~T3 และ I1 ตามชีตจริง)
// แต่ทุก key อื่น (cellData/coverData/stockData/...) ทั้งระบบอ้างอิงด้วย "ชื่อ Model เปล่าๆ" ต่อ process เดียว ไม่รวมกลุ่ม
// จึงเก็บชื่อ Model ของ AI เป็น "<groupId>::<ชื่อที่โชว์>" เสมอ (ทำให้ทุก key ข้างต้นแยกอิสระต่อกลุ่มโดยอัตโนมัติ โดยไม่ต้องแก้ logic อื่น)
// แล้วค่อยถอด prefix นี้ออกทุกจุดที่โชว์ชื่อให้คนดู (aiDisplayName) — ผู้ใช้จะไม่เห็น groupId ปนอยู่เลย
function aiCompositeName(groupId, displayName) { return `${groupId}::${displayName}`; }
function aiDisplayName(proc, rawName) {
    if (proc !== 'AI' || typeof rawName !== 'string') return rawName;
    const idx = rawName.indexOf('::');
    return idx === -1 ? rawName : rawName.slice(idx + 2);
}

const ALL_GROUP_IDS = Object.values(processConfig).flatMap(cfg => cfg.groups.map(g => g.id));
const blueModels = ['G2', 'X2', 'S2', 'E4', 'W4', 'A2', 'F2', 'Y2', 'Z2', 'C2', 'E4 (DSTC)', 'E4 (DSS2)', 'Z1 (DSSI)', 'Z2 (DSTC)'];

// === Global State ===
let currentProcess = 'Overview';
let viewDays = 7;
let printOrientation = 'landscape'; // ใช้โดย fitPrintToPage() + @page override — ตั้งจาก URL param ตอนเปิด print preview เท่านั้น
// currentUser: null (ไม่ได้ login) หรือ {username, role: 'admin'|'process', processes: ['BW'|'LC'|'CW'|'Stock', ...]}
let currentUser = JSON.parse(sessionStorage.getItem('master_plan_user') || 'null');
let sessionPassword = sessionStorage.getItem('master_plan_pwd') || '';
let isAdmin = !!currentUser && currentUser.role === 'admin'; // ชื่อเดิมคงไว้ตามจุดที่ใช้ทั่วโค้ด = สิทธิ์ admin เต็ม (แก้ไขได้ทุกอย่าง)
let userProcesses = currentUser ? (currentUser.processes || []) : []; // process ที่ user แบบจำกัดสิทธิ์แก้ไขได้ เช่น ['BW'] หรือ ['Stock']
function canEditProcess(proc) { return isAdmin || userProcesses.includes(proc); }
let isDirty = false;
let pollTimer = null;

// ข้อมูลจริงทั้งหมดโหลดมาจาก server (แทน localStorage เดิม) — ดูฟังก์ชัน loadStateFromServer()
let modelState = {}, groupLabels = {}, cellData = {}, cellComments = {}, coverData = {}, coverColors = {}, revData = {}, groupParams = {}, hrsData = {}, timestamps = {}, lastEditor = {}, changeLog = [], announcements = [], stockData = {}, sourceMap = {}, plannedUsedData = {}, coverCodeColors = {}, urgentModels = {};
// process ก่อนหน้าที่แต่ละ process ใช้วัตถุดิบมาจาก (LC มาจาก BW, CW ใช้ mat เดียวกับ LC แค่สวม cover ต่าง) — BW เป็นต้นทาง ไม่มี source
const PRECEDING_PROCESS = { LC: 'BW', CW: 'LC' };
let knownMaxSeq = null; // ใช้เทียบว่ามี log การอัปเดตใหม่เข้ามาระหว่างที่เราเปิดหน้านี้ค้างไว้หรือไม่
let lastSeenSeq = parseInt(localStorage.getItem('master_plan_last_seen_seq') || '0', 10);
let hideEmptyModels = localStorage.getItem('master_plan_hide_empty') === 'true';
let stockProcessFilter = 'BW'; // เอาตัวเลือก "ทั้งหมด" ออกแล้ว (รายการที่ต้องดูก่อนยาวเกินไป ซ้ำซ้อนกับ panel "Days of supply" ที่หน้าแรกที่ขยายไปแล้ว) ต้องเลือกทีละ process เสมอ
// "CW (Export)" ไม่ใช่ process จริงแยกต่างหาก (ยังคงเป็น process 'CW' เดิมในข้อมูล/สิทธิ์/หน้าตารางแผนผลิตทุกจุด)
// เป็นแค่ตัวกรอง/มุมมองระดับหน้าสต็อก+หน้าแรกเท่านั้น แยกงาน Export ออกมาดูต่างหากจาก CW ตัวอื่น
const CW_EXPORT_GROUP_IDS = ['cw_new_type_1', 'cw_new_type_2'];
// นับเฉพาะ Model ที่ลงท้ายด้วย "(Export)" จริงๆ เท่านั้น — ตัวที่เป็นงาน Mold ซึ่งอยู่ในกลุ่ม FET-K เดียวกัน
// (เช่น "Z3 EK (MOLD)", "G2 FM61 (Mold)", "Z2 EK (Mold)") ยังนับเป็นสต็อกของ CW ปกติเหมือนเดิม
function isCwExportModel(groupId, displayModel) {
    return CW_EXPORT_GROUP_IDS.includes(groupId) && /\(export\)\s*$/i.test(String(displayModel || ''));
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// สำหรับแปะค่าลงใน onclick="fn('...')" — escapeHtml เพียงอย่างเดียวไม่พอ เพราะ browser จะ decode HTML entity
// ของ attribute value ก่อนเอาไปรันเป็น JS เสมอ (เช่น &#39; จะกลับเป็น ' ก่อนแล้วค่อยรันเป็นโค้ด) ทำให้ยังหลุด string ของ JS ได้อยู่ดี
// ต้อง escape ระดับ JS string literal ก่อน (backslash แล้วค่อย quote) แล้วค่อย escapeHtml ทับอีกที ให้รอดทั้ง 2 ชั้น
function jsAttrEscape(str) {
    return escapeHtml(String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'"));
}

// เตือนก่อนปิด/รีเฟรชหน้าถ้ายังมีข้อมูลที่แก้ไว้แต่ยังไม่ได้กด "บันทึก" (ข้อความเองเบราว์เซอร์ยุคใหม่ไม่ให้กำหนดเอง แต่ preventDefault+returnValue ก็พอให้ขึ้น prompt ได้)
window.addEventListener('beforeunload', (e) => {
    if (isDirty) { e.preventDefault(); e.returnValue = ''; }
});

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

// แปลงเป็น YYYY-MM-DD ตามเวลาท้องถิ่นเครื่อง (ไม่ใช่ toISOString ที่แปลงเป็น UTC แล้ววันที่อาจเพี้ยนได้ใกล้เที่ยงคืน)
function toISODateLocal(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }

// เช็คว่าเป็นวันที่ที่มีอยู่จริงตามปฏิทิน ไม่ใช่แค่รูปแบบตัวเลขถูก (เช่น "2026-02-30" รูปแบบถูกแต่ไม่มีวันนี้จริง)
function isValidISODate(str) {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str);
    if (!m) return false;
    const year = Number(m[1]), month = Number(m[2]), day = Number(m[3]);
    const d = new Date(year, month - 1, day);
    return d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day;
}

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

// === Auto Plan: กรอกจำนวนเครื่อง CW แล้วให้ระบบคำนวณเป็นทอดๆ ว่า LC และ BW ต้องใช้กี่เครื่อง (ตามสาย BOM ใน sourceMap: CW -> LC -> BW) ===
// Pcs ต่อเครื่อง = Hrs × 3600 ÷ MCT × OA% (OA/MCT ตามกลุ่ม, Hrs/Day ตาม process รายวัน)
// ส่ง Pcs ที่ "ต้องการจริง" (ยังไม่ปัด) ต่อไปชั้นถัดไป ไม่ให้การปัดเครื่อง LC ขึ้นไปพอก demand ของ BW เกินจริง
// อายุงาน LC 14 วัน: LC ที่ CW ใช้วันที่ D ต้องผลิตในช่วง D-14 ถึง D ถ้าวันผลิตเป็นวันหยุด LC (Hrs/Day = 0) เลื่อนไปวันทำงานก่อนหน้า ไม่เกิน 14 วัน
// BW ผลิตวันเดียวกับ LC
const LC_SHELF_LIFE_DAYS = 14;

function findGroupOfModel(proc, model) {
    const g = processConfig[proc].groups.find(gr => (modelState[gr.id] || []).includes(model));
    return g ? g.id : null;
}
function procHrs(proc, dateKey) {
    const hrs = parseFloat(hrsData[`${proc}_${dateKey}`]);
    return isNaN(hrs) ? 18 : hrs;
}
function pcsPerMachine(proc, groupId, dateKey) {
    const p = getParams(groupId);
    const hrs = procHrs(proc, dateKey);
    if (p.mct <= 0 || hrs <= 0) return 0;
    return (hrs * 3600 / p.mct) * (p.oa / 100);
}
function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate() + n); return d; }

function cwDemandOnLc(dateKey, warnings) {
    const demand = {};
    processConfig.CW.groups.forEach(g => {
        (modelState[g.id] || []).forEach(m => {
            const mc = parseFloat(cellData[`CW_${m}_${dateKey}`]);
            if (isNaN(mc) || mc <= 0) return;
            const entry = sourceMap[`CW_${m}`];
            if (!entry || !entry.srcModel) { warnings.add(`CW "${m}" ยังไม่ได้กำหนดแหล่งวัตถุดิบ (BOM) จาก LC — ไม่ถูกนำไปคำนวณ`); return; }
            if (!findGroupOfModel('LC', entry.srcModel)) { warnings.add(`CW "${m}" ชี้ไป LC "${entry.srcModel}" ซึ่งไม่พบแล้ว (ถูกเปลี่ยนชื่อ/ลบ) — แก้ที่เมนู BOM`); return; }
            demand[entry.srcModel] = (demand[entry.srcModel] || 0) + mc * pcsPerMachine('CW', g.id, dateKey) * (entry.ratio || 1);
        });
    });
    return demand;
}

// คืนค่า { plan: { LC: { model: { dateKey: { pcs, mc, useBy } } }, BW: { model: { dateKey: { pcs, mc } } } }, warnings }
// rounding: 'half' = ปัดขึ้นทีละ 0.5 เครื่อง, 'whole' = ปัดขึ้นเป็นเครื่องเต็ม — leadDays: ผลิต LC ก่อน CW ใช้กี่วัน (0 = วันเดียวกัน)
function computeCascadePlan(startDate, days, rounding = 'half', leadDays = 0) {
    const plan = { LC: {}, BW: {} };
    const warnings = new Set();
    const roundMc = (mc) => {
        if (mc <= 0) return 0;
        const clean = Math.round(mc * 1e6) / 1e6; // กัน 2.0000000001 กลายเป็น 3 เครื่อง
        return rounding === 'whole' ? Math.ceil(clean) : Math.ceil(clean * 2) / 2;
    };
    leadDays = Math.max(0, Math.min(LC_SHELF_LIFE_DAYS, Math.floor(leadDays) || 0));
    const viewKeys = [];
    for (let i = 0; i < days; i++) viewKeys.push(formatDateHeader(addDays(startDate, i)));

    // 1) วันผลิต LC: ไล่ทุกวันที่ CW ใช้ LC ซึ่งอาจต้องผลิตในช่วงที่แสดง (มองไปข้างหน้าอีกเท่าอายุงาน)
    const lcPcs = {};
    for (let i = 0; i < days + LC_SHELF_LIFE_DAYS; i++) {
        const useDate = addDays(startDate, i);
        const useKey = formatDateHeader(useDate);
        const demand = cwDemandOnLc(useKey, warnings);
        Object.keys(demand).forEach(m => {
            let back = leadDays;
            while (back <= LC_SHELF_LIFE_DAYS && procHrs('LC', formatDateHeader(addDays(useDate, -back))) <= 0) back++;
            if (back > LC_SHELF_LIFE_DAYS) {
                if (i < days) warnings.add(`LC "${m}" ที่ CW ใช้วันที่ ${useKey} ไม่มีวันทำงาน LC ภายใน ${LC_SHELF_LIFE_DAYS} วันก่อนหน้า (Hrs/Day = 0 ทั้งหมด) — ผลิตไม่ทันอายุงาน`);
                return;
            }
            const buildIdx = i - back;
            if (buildIdx >= days) return;
            if (buildIdx < 0) {
                warnings.add(`LC "${m}" ที่ CW ใช้วันที่ ${useKey} ต้องผลิตวันที่ ${formatDateHeader(addDays(startDate, buildIdx))} ซึ่งอยู่ก่อนช่วงที่แสดง — ไม่ถูกใส่ในรอบนี้`);
                return;
            }
            const buildKey = viewKeys[buildIdx];
            if (!lcPcs[m]) lcPcs[m] = {};
            lcPcs[m][buildKey] = (lcPcs[m][buildKey] || 0) + demand[m];
        });
    }

    // 2) เครื่อง LC ต่อวัน แล้วส่ง demand ต่อไป BW วันเดียวกัน
    viewKeys.forEach((dateKey, idx) => {
        const bwDemand = {};
        Object.keys(lcPcs).forEach(m => {
            const pcs = lcPcs[m][dateKey];
            if (!pcs) return;
            const groupId = findGroupOfModel('LC', m);
            const perMc = pcsPerMachine('LC', groupId, dateKey);
            if (perMc <= 0) { warnings.add(`LC กลุ่ม ${(groupLabels[groupId] || groupId).replace(/<br>/g, ' ')} มี MCT เป็น 0 คำนวณจำนวนเครื่องไม่ได้`); return; }
            if (!plan.LC[m]) plan.LC[m] = {};
            plan.LC[m][dateKey] = { pcs: Math.round(pcs), mc: roundMc(pcs / perMc), useBy: formatDateHeader(addDays(startDate, idx + LC_SHELF_LIFE_DAYS)) };

            const entry = sourceMap[`LC_${m}`];
            if (!entry || !entry.srcModel) { warnings.add(`LC "${m}" ยังไม่ได้กำหนดแหล่งวัตถุดิบ (BOM) จาก BW — ไม่ถูกนำไปคำนวณ`); return; }
            if (!findGroupOfModel('BW', entry.srcModel)) { warnings.add(`LC "${m}" ชี้ไป BW "${entry.srcModel}" ซึ่งไม่พบแล้ว (ถูกเปลี่ยนชื่อ/ลบ) — แก้ที่เมนู BOM`); return; }
            bwDemand[entry.srcModel] = (bwDemand[entry.srcModel] || 0) + pcs * (entry.ratio || 1);
        });
        Object.keys(bwDemand).forEach(m => {
            const groupId = findGroupOfModel('BW', m);
            const perMc = pcsPerMachine('BW', groupId, dateKey);
            if (perMc <= 0) { warnings.add(`BW วันที่ ${dateKey} หยุด (Hrs/Day = 0) หรือกลุ่ม ${(groupLabels[groupId] || groupId).replace(/<br>/g, ' ')} มี MCT เป็น 0 แต่ LC ต้องใช้งาน — คำนวณจำนวนเครื่องไม่ได้`); return; }
            if (!plan.BW[m]) plan.BW[m] = {};
            plan.BW[m][dateKey] = { pcs: Math.round(bwDemand[m]), mc: roundMc(bwDemand[m] / perMc) };
        });
    });
    return { plan, warnings: Array.from(warnings) };
}

function getViewStartDate() { return new Date(document.getElementById('startDatePicker').value); }
function getViewDateKeys() {
    const startDate = getViewStartDate();
    const keys = [];
    for (let i = 0; i < viewDays; i++) keys.push(formatDateHeader(addDays(startDate, i)));
    return keys;
}

let autoPlanRounding = 'half';
let autoPlanClearOthers = false;
let autoPlanLeadDays = 0;
function openAutoPlan() {
    if (!canEditProcess('LC') && !canEditProcess('BW')) { showToast('ต้องมีสิทธิ์แก้ไข LC หรือ BW', 'error'); return; }
    renderAutoPlanModal();
}

function renderAutoPlanModal() {
    const dateKeys = getViewDateKeys();
    const { plan, warnings } = computeCascadePlan(getViewStartDate(), viewDays, autoPlanRounding, autoPlanLeadDays);
    const sections = ['LC', 'BW'].map(proc => {
        const rows = [];
        processConfig[proc].groups.forEach(g => {
            (modelState[g.id] || []).forEach(m => {
                if (!plan[proc][m]) return;
                const cells = dateKeys.map(dk => {
                    const v = plan[proc][m][dk];
                    const cur = parseFloat(cellData[`${proc}_${m}_${dk}`]) || 0;
                    if (!v) return `<td style="color:var(--text-muted);">-${cur > 0 ? `<br><span class="autoplan-old">เดิม ${cur}</span>` : ''}</td>`;
                    return `<td><strong>${v.mc}</strong><br><span class="autoplan-pcs">${v.pcs.toLocaleString()} pcs</span>${v.useBy ? `<br><span class="autoplan-pcs">ใช้ก่อน ${v.useBy}</span>` : ''}${cur > 0 && cur !== v.mc ? `<br><span class="autoplan-old">เดิม ${cur}</span>` : ''}</td>`;
                }).join('');
                rows.push(`<tr><td class="col-model" style="text-align:left;">${escapeHtml(aiDisplayName(proc, m))}</td>${cells}</tr>`);
            });
        });
        const editable = canEditProcess(proc);
        return `<h4 style="margin:14px 0 6px;">${proc} ${editable ? '' : '<span style="font-size:11px; color:var(--weekend-head-text);">(ไม่มีสิทธิ์แก้ไข — แสดงอย่างเดียว)</span>'}</h4>
            ${rows.length ? `<table class="user-mgmt-table autoplan-table"><thead><tr><th>Model</th>${dateKeys.map(dk => `<th>${dk}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table>`
                : '<div style="font-size:12px; color:var(--text-muted);">ไม่มีความต้องการในช่วงวันที่นี้</div>'}`;
    }).join('');
    const warnHtml = warnings.length ? `<div class="autoplan-warn"><i class="fas fa-triangle-exclamation"></i> ${warnings.map(w => `<div>${escapeHtml(w)}</div>`).join('')}</div>` : '';

    document.getElementById('modalRoot').innerHTML = `
        <div class="modal-overlay" id="modalOverlay">
            <div class="modal-box modal-box-wide autoplan-box">
                <h3><i class="fas fa-wand-magic-sparkles"></i> Auto Plan — คำนวณ LC / BW จากแผน CW</h3>
                <p style="font-size:12px; color:var(--text-secondary); margin:-8px 0 10px;">
                    ใช้จำนวนเครื่อง CW ที่กรอกไว้ (${dateKeys[0]} ถึง ${dateKeys[dateKeys.length - 1]}) × OA/MCT/Hrs แล้วไล่ตาม BOM (CW → LC → BW) และอัตราส่วน
                </p>
                <div class="autoplan-opts">
                    <label><input type="radio" name="apRound" ${autoPlanRounding === 'half' ? 'checked' : ''} onchange="autoPlanRounding='half'; renderAutoPlanModal();"> ปัดขึ้นทีละ 0.5 เครื่อง</label>
                    <label><input type="radio" name="apRound" ${autoPlanRounding === 'whole' ? 'checked' : ''} onchange="autoPlanRounding='whole'; renderAutoPlanModal();"> ปัดขึ้นเป็นเครื่องเต็ม</label>
                    <label><input type="checkbox" ${autoPlanClearOthers ? 'checked' : ''} onchange="autoPlanClearOthers=this.checked;"> ล้างค่าเดิมของ Model ที่ไม่มีความต้องการ</label>
                    <label>ผลิต LC ก่อน CW ใช้ <input type="number" min="0" max="${LC_SHELF_LIFE_DAYS}" step="1" value="${autoPlanLeadDays}" style="width:52px;" onchange="autoPlanLeadDays=Math.max(0, Math.min(${LC_SHELF_LIFE_DAYS}, parseInt(this.value, 10) || 0)); renderAutoPlanModal();"> วัน</label>
                </div>
                <div class="autoplan-note"><i class="fas fa-hourglass-half"></i> งาน LC มีอายุ ${LC_SHELF_LIFE_DAYS} วัน: ถ้าวันที่ต้องผลิต LC หยุด (Hrs/Day = 0) ระบบจะเลื่อนไปผลิตวันทำงานก่อนหน้า แต่ไม่เกิน ${LC_SHELF_LIFE_DAYS} วันก่อนที่ CW ใช้</div>
                ${warnHtml}
                <div style="max-height:50vh; overflow:auto;">${sections}</div>
                <div class="modal-actions" style="margin-top:16px;">
                    <button class="modal-btn modal-btn-cancel" onclick="closeModal()">ปิด</button>
                    <button class="modal-btn modal-btn-confirm" onclick="applyAutoPlan()"><i class="fas fa-check"></i> นำไปใส่ในแผน LC / BW</button>
                </div>
            </div>
        </div>`;
    document.getElementById('modalOverlay').onclick = (e) => { if (e.target.id === 'modalOverlay') closeModal(); };
}

// เขียนผลลงตาราง LC/BW บนหน้าจอเท่านั้น — ยังไม่บันทึกจนกว่าจะกดปุ่ม "บันทึก" ตามปกติ
function applyAutoPlan() {
    const dateKeys = getViewDateKeys();
    const { plan } = computeCascadePlan(getViewStartDate(), viewDays, autoPlanRounding, autoPlanLeadDays);
    let changed = 0;
    ['LC', 'BW'].forEach(proc => {
        if (!canEditProcess(proc)) return;
        processConfig[proc].groups.forEach(g => {
            (modelState[g.id] || []).forEach(m => {
                dateKeys.forEach(dk => {
                    const key = `${proc}_${m}_${dk}`;
                    const v = plan[proc][m] && plan[proc][m][dk];
                    let newVal;
                    if (v) newVal = String(v.mc);
                    else if (autoPlanClearOthers && cellData[key]) newVal = '';
                    else return;
                    if ((cellData[key] || '') === newVal) return;
                    pushUndo(key, cellData[key]);
                    if (newVal) cellData[key] = newVal; else delete cellData[key];
                    markKeyDirty('cellData', key);
                    changed++;
                });
            });
        });
    });
    closeModal();
    rerenderCurrentView();
    showToast(changed > 0 ? `ใส่แผนอัตโนมัติแล้ว ${changed} ช่อง — ตรวจสอบแล้วกด "บันทึก"` : 'ไม่มีช่องไหนเปลี่ยน', changed > 0 ? 'success' : 'info');
}

// === ส่งแผนเครื่องจักรให้ทีมผ่าน Teams — เฉพาะ Admin กดเอง ไม่ใช่ auto-send ทุกครั้งที่บันทึก ===
// ฝั่ง server เป็นคนตัดสินว่า process ไหนมีของใหม่ให้ส่งบ้าง (เทียบ seq การบันทึกจริงกับครั้งล่าสุดที่ส่ง) และคิดเลข Rev แยกต่อ process
// ที่นี่ส่งไปแค่ยอด Total M/C วันนี้ต่อ process (คำนวณด้วยสูตรเดียวกับการ์ดด้านบน) กับ comment ที่ผู้ใช้พิมพ์เพิ่ม
async function sendPlanToTeam() {
    if (!isAdmin) return;
    const todayKey = formatDateHeader(new Date());
    const mcByProcess = {};
    ['BW', 'LC', 'CW', 'AI'].forEach(proc => { mcByProcess[proc] = computeGrandTotalMC(proc, todayKey); });

    const comment = await showPromptModal(
        'ส่งแผนให้ทีมทาง Teams — จะส่งเฉพาะ process ที่มีการบันทึกใหม่ตั้งแต่ครั้งล่าสุดที่ส่ง (ใส่หมายเหตุเพิ่มได้ หรือเว้นว่างไว้ก็ได้)',
        '', { multiline: true, confirmLabel: 'ส่งเลย' }
    );
    if (comment === null) return; // กดยกเลิก

    try {
        const res = await fetch('/api/notify-plan-ready', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: currentUser.username, password: sessionPassword, mcByProcess, comment })
        });
        const data = await res.json();
        if (!data.ok) { showToast(data.error || 'ส่งไม่สำเร็จ', 'error'); return; }

        if (!data.sentProcesses || data.sentProcesses.length === 0) {
            showToast('ไม่มี process ไหนถูกแก้ไขใหม่ตั้งแต่ส่งครั้งล่าสุด — ไม่ต้องส่งซ้ำ', 'info', 5000);
            return;
        }

        // อัปเดตเลข Rev ในหน้าจอให้ตรงกับที่ server เพิ่งตั้งให้ทันที ไม่ต้องรอ poll รอบถัดไป
        Object.keys(data.revByProcess || {}).forEach(proc => { revData[proc] = data.revByProcess[proc]; });
        if (['BW', 'LC', 'CW', 'AI'].includes(currentProcess)) {
            document.getElementById('revInput').value = revData[currentProcess] || '00';
            document.getElementById('printRevTxt').innerText = revData[currentProcess] || '00';
        }

        const detail = data.sentProcesses.map(p => `${p} (Rev.${data.revByProcess[p]})`).join(', ');
        if (data.notified) showToast(`ส่งให้ทีมแล้ว: ${detail}`, 'success', 5000);
        else showToast(`บันทึก Rev แล้ว: ${detail} — แต่ยังไม่ได้ตั้งค่า Teams webhook ใน config.json จึงยังไม่ได้ส่งจริง`, 'error', 6000);
    } catch (e) {
        showToast('เชื่อมต่อ server ไม่ได้', 'error');
    }
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
                    ${isStale ? `<div style="font-size:11px; color:var(--weekend-head-text); margin-bottom:4px; overflow-wrap:break-word; word-break:break-word;"><i class="fas fa-triangle-exclamation"></i> เดิมชี้ไป "${current.srcModel}" ซึ่งไม่พบแล้ว (ถูกเปลี่ยนชื่อ/ลบ) กรุณาเลือกใหม่</div>` : ''}
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
                <button class="btn-action" onclick="autoMatchBom()" style="margin-bottom:12px;"><i class="fas fa-wand-magic-sparkles"></i> จับคู่อัตโนมัติ (ตามชื่อที่ตรงกัน)</button>
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

// จับคู่แถวที่ยังไม่ได้กำหนดแหล่งที่มา โดยจับจากชื่อ Model ที่ตรงกันเป๊ะกับ process ต้นทาง (เช่น CW's "G3" -> LC's "G3")
// ไม่ทับแถวที่กำหนดไว้แล้ว และไม่บันทึกอัตโนมัติแบบเงียบๆ — แค่เติม dropdown ให้ ผ่าน change event ปกติ (โค้ดเดียวกับตอนเลือกเอง) ให้ผู้ใช้เห็น/ตรวจทานในตารางก่อนกด "เสร็จสิ้น" เอง
function autoMatchBom() {
    let matched = 0, total = 0;
    document.querySelectorAll('#modalRoot tr[data-key]').forEach(tr => {
        const select = tr.querySelector('.bom-source-select');
        if (!select || select.value) return; // มีแหล่งที่มาอยู่แล้ว ไม่แตะ
        total++;
        const destModel = tr.querySelector('.col-model').textContent.trim();
        const hasExactMatch = Array.from(select.options).some(o => o.value === destModel);
        if (hasExactMatch) {
            select.value = destModel;
            select.dispatchEvent(new Event('change'));
            matched++;
        }
    });
    if (total === 0) showToast('ไม่มีรายการที่ต้องจับคู่แล้ว', 'info', 3000);
    else if (matched === 0) showToast('ไม่พบชื่อที่ตรงกันเป๊ะเลยสักรายการ ต้องเลือกเอง', 'info', 4000);
    else showToast(`จับคู่อัตโนมัติสำเร็จ ${matched} จาก ${total} รายการที่ยังไม่ได้ระบุ — ที่เหลือชื่อไม่ตรงเป๊ะ ต้องเลือกเอง`, 'success', 5000);
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
                    <p style="font-size:12px; color:var(--text-secondary); margin:8px 0 0;">ช่องที่ 2 ใส่เฉพาะกรณีมี Model ชื่อเดียวกันแต่คนละ Cover/ทูลลิ่ง — ใส่เพื่อแยกไม่ให้ชนกัน ถ้าไม่มีแบบนี้เว้นว่างได้เลย</p>
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

// ประกาศ: ข้อความ + เลือกได้ว่าจะให้เห็นทุกกระบวนการ (ทั่วไป) หรือเฉพาะกระบวนการเดียว — ใช้ทั้งตอนเพิ่มและแก้ไข
function showAnnouncementModal(title, defaultText = '', defaultProcess = '', confirmLabel = 'บันทึก') {
    return new Promise(resolve => {
        const root = document.getElementById('modalRoot');
        root.innerHTML = `
            <div class="modal-overlay" id="modalOverlay">
                <div class="modal-box">
                    <h3>${title}</h3>
                    <textarea id="annTextInput" rows="4" style="width:100%; padding:10px 12px; border:1px solid var(--border-strong); border-radius:10px; font-family:inherit; font-size:14px; outline:none; margin-bottom:10px; box-sizing:border-box; resize:vertical;"></textarea>
                    <label style="font-size:12px; color:var(--text-secondary); display:block; margin-bottom:4px;">แสดงให้เห็น</label>
                    <select id="annProcessInput" style="width:100%; padding:8px 10px; border:1px solid var(--border-strong); border-radius:10px; font-family:inherit; font-size:14px; outline:none; background:var(--card-bg); color:var(--text-main);">
                        <option value="">ทุกกระบวนการ (ทั่วไป)</option>
                        <option value="BW">เฉพาะกระบวนการ BW</option>
                        <option value="LC">เฉพาะกระบวนการ LC</option>
                        <option value="CW">เฉพาะกระบวนการ CW</option>
                        <option value="AI">เฉพาะกระบวนการ AI</option>
                    </select>
                    <p style="font-size:12px; color:var(--text-secondary); margin:8px 0 0;">ประกาศจะโชว์ที่หน้าแรกเสมอ ถ้าเลือกเฉพาะกระบวนการ จะติดไปกับหน้าตาราง/พิมพ์แผนของกระบวนการนั้นด้วย</p>
                    <div class="modal-actions" style="margin-top:16px;">
                        <button class="modal-btn modal-btn-cancel" id="modalCancelBtn">ยกเลิก</button>
                        <button class="modal-btn modal-btn-confirm" id="modalConfirmBtn">${confirmLabel}</button>
                    </div>
                </div>
            </div>`;
        const textInp = document.getElementById('annTextInput');
        const procInp = document.getElementById('annProcessInput');
        textInp.value = defaultText; procInp.value = defaultProcess || '';
        textInp.focus();
        const finish = (val) => { closeModal(); resolve(val); };
        const submit = () => finish({ text: textInp.value.trim(), process: procInp.value || null });
        document.getElementById('modalConfirmBtn').onclick = submit;
        document.getElementById('modalCancelBtn').onclick = () => finish(null);
        document.getElementById('modalOverlay').onclick = (e) => { if (e.target.id === 'modalOverlay') finish(null); };
        textInp.onkeydown = (e) => { if (e.key === 'Escape') finish(null); if (e.key === 'Enter' && e.ctrlKey) submit(); };
        procInp.onkeydown = (e) => { if (e.key === 'Escape') finish(null); };
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
            ? `<textarea id="modalInput" rows="4" style="width:100%; padding:10px 12px; border:1px solid var(--border-strong); border-radius:10px; font-family:inherit; font-size:14px; outline:none; margin-bottom:16px; box-sizing:border-box; resize:vertical;"></textarea>`
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

function showConfirmModal(message, danger = false, confirmLabel = 'ยืนยัน', previewItems = null) {
    return new Promise(resolve => {
        const root = document.getElementById('modalRoot');
        const previewHtml = previewItems && previewItems.length
            ? `<div class="modal-preview-list">${previewItems.map(i => `<div>${escapeHtml(i)}</div>`).join('')}</div>` : '';
        root.innerHTML = `
            <div class="modal-overlay" id="modalOverlay">
                <div class="modal-box">
                    <h3></h3>
                    ${previewHtml}
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

// โมดัลออกจากระบบตอนมีข้อมูลยังไม่ได้บันทึก — คืนค่า 'save' | 'discard' | null(ยกเลิก)
function showLogoutConfirmModal(message) {
    return new Promise(resolve => {
        const root = document.getElementById('modalRoot');
        root.innerHTML = `
            <div class="modal-overlay" id="modalOverlay">
                <div class="modal-box">
                    <h3></h3>
                    <div class="modal-actions" style="justify-content: space-between;">
                        <button class="modal-btn modal-btn-danger" id="modalDiscardBtn">ออกโดยไม่บันทึก</button>
                        <div style="display:flex; gap:8px;">
                            <button class="modal-btn modal-btn-cancel" id="modalCancelBtn">ยกเลิก</button>
                            <button class="modal-btn modal-btn-confirm" id="modalConfirmBtn">บันทึกแล้วออกจากระบบ</button>
                        </div>
                    </div>
                </div>
            </div>`;
        root.querySelector('h3').innerText = message;
        const finish = (val) => { closeModal(); resolve(val); };
        document.getElementById('modalConfirmBtn').onclick = () => finish('save');
        document.getElementById('modalDiscardBtn').onclick = () => finish('discard');
        document.getElementById('modalCancelBtn').onclick = () => finish(null);
        document.getElementById('modalOverlay').onclick = (e) => { if (e.target.id === 'modalOverlay') finish(null); };
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
        coverCodeColors, revData, groupParams, hrsData, stockData, sourceMap, plannedUsedData, urgentModels
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
    if (currentProcess === 'Overview') { renderOverview(); renderAnnouncements(); }
    else if (currentProcess === 'Stock') renderStockPage();
    else generateTable();
    updateNavBadges();
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
        urgentModels = data.urgentModels || {};
        if (currentProcess === 'Overview') renderAnnouncements();
        updateViewerCountUI(data.viewerCount, data.activeUsers);

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

// เมนู "เพิ่มเติม" กับ "แจ้งเตือน" ย้ายขึ้นไปอยู่แถวบนสุดที่ค่อนข้างแคบแล้ว เปิดออกมาแล้วอาจไปทับ/บังเนื้อหาข้างๆ จนอ่านสับสนว่าอันไหนคลิกได้
// เลยใส่ backdrop สีเข้มจางๆ คลุมทั้งหน้าไว้เบื้องหลังตอนเปิดเมนูพวกนี้ ให้ชัดเจนว่ากำลังเปิดป็อบอัพอยู่ (คลิกที่ backdrop = ปิดเมนู เหมือนคลิกข้างนอก)
function syncMenuBackdrop() {
    const anyOpen = ['bellPanel', 'moreMenuPanel'].some(id => {
        const p = document.getElementById(id); return p && p.style.display !== 'none';
    });
    const bd = document.getElementById('menuBackdrop');
    if (bd) bd.style.display = anyOpen ? 'block' : 'none';
}

function toggleBellPanel() {
    const panel = document.getElementById('bellPanel');
    const isOpen = panel.style.display !== 'none';
    panel.style.display = isOpen ? 'none' : 'block';
    // เปิดดูเฉยๆ ไม่ถือว่า "อ่านแล้ว" อัตโนมัติอีกต่อไป (เผื่อแค่เหลือบดูผ่านๆ ไม่ได้อ่านจริงทุกอัน) ต้องกดปุ่ม "ทำเครื่องหมายว่าอ่านแล้ว" เองถึงจะเคลียร์ badge
    if (!isOpen) renderBellPanel();
    syncMenuBackdrop();
}

function markAllNotificationsRead() {
    if (changeLog.length > 0) lastSeenSeq = Math.max(...changeLog.map(e => e.seq));
    localStorage.setItem('master_plan_last_seen_seq', String(lastSeenSeq));
    renderBellPanel();
}

document.addEventListener('click', (e) => {
    const wrap = document.querySelector('.bell-wrap');
    const panel = document.getElementById('bellPanel');
    if (wrap && panel && panel.style.display !== 'none' && !wrap.contains(e.target)) {
        panel.style.display = 'none';
        syncMenuBackdrop();
    }
});

function toggleMoreMenu() {
    const panel = document.getElementById('moreMenuPanel');
    panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
    syncMenuBackdrop();
}

document.addEventListener('click', (e) => {
    const wrap = document.querySelector('.more-menu-wrap');
    const panel = document.getElementById('moreMenuPanel');
    if (wrap && panel && panel.style.display !== 'none' && !wrap.contains(e.target)) {
        panel.style.display = 'none';
        syncMenuBackdrop();
    }
});

function updateConnUI(ok) {
    const dot = document.getElementById('syncDot'); const txt = document.getElementById('syncStatusTxt');
    if (!dot) return;
    dot.classList.toggle('offline', !ok);
    txt.innerText = ok ? (t('sync_status_ok') + ' ' + new Date().toLocaleTimeString(appLang === 'en' ? 'en-US' : 'th-TH')) : t('sync_status_offline');
}

function startPolling() {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(async () => {
        sendHeartbeat();
        if (isDirty) return; // มีงานที่ยังไม่บันทึก ไม่ดึงข้อมูลใหม่มาทับ
        const prevCellData = cellData; // เก็บ reference ของเดิมไว้เทียบหลัง loadStateFromServer (ซึ่งจะสร้าง object cellData ใหม่ทั้งก้อนมาแทนที่)
        const ok = await loadStateFromServer();
        if (ok) { rerenderCurrentView(); flashChangedCells(prevCellData, cellData); }
    }, 15000);
}

// ไฮไลต์ช่องที่มีคนอื่นแก้ค่าเข้ามาใหม่จาก poll รอบนี้ (จางหายไปเองหลัง 2.5 วิ) ให้เห็นความเปลี่ยนแปลงสดๆ โดยไม่ต้องเปิดกระดิ่งดู
// ใช้ได้เฉพาะหน้าตารางแผนผลิต (BW/LC/CW/AI) เท่านั้น เพราะอิง .table-input[data-cell-key] ที่ผูกกับ cellData โดยตรง
function flashChangedCells(prevData, newData) {
    if (currentProcess === 'Overview' || currentProcess === 'Stock') return;
    const prefix = `${currentProcess}_`;
    const changedKeys = new Set();
    Object.keys(newData).forEach(k => { if (k.startsWith(prefix) && newData[k] !== prevData[k]) changedKeys.add(k); });
    Object.keys(prevData).forEach(k => { if (k.startsWith(prefix) && !(k in newData)) changedKeys.add(k); });
    changedKeys.forEach(k => {
        const el = document.querySelector(`.table-input[data-cell-key="${CSS.escape(k)}"]`);
        if (el) { el.classList.add('cell-flash'); setTimeout(() => el.classList.remove('cell-flash'), 2500); }
    });
}

// === Core Application Routing ===
// ป้ายช่วงวันที่บนแถบด้านบน เช่น "5 – 11 ต.ค. 2026" — ใช้ปฏิทินสากล (ค.ศ.) ไม่ใช่ พ.ศ. ให้ตรงกับหัวตาราง
function updateDateRangeLabel() {
    const el = document.getElementById('dateRangeLabel');
    const val = document.getElementById('startDatePicker').value;
    if (!el || !val) return;
    const loc = appLang === 'en' ? 'en-GB' : 'th-TH-u-ca-gregory';
    const start = new Date(val);
    const isPlan = ['BW', 'LC', 'CW', 'AI'].includes(currentProcess);
    const days = isPlan ? viewDays : 1;
    if (days <= 1) {
        el.textContent = start.toLocaleDateString(loc, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
        return;
    }
    const end = new Date(start); end.setDate(end.getDate() + days - 1);
    const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();
    const left = sameMonth ? String(start.getDate()) : start.toLocaleDateString(loc, { day: 'numeric', month: 'short' });
    el.textContent = `${left} – ${end.toLocaleDateString(loc, { day: 'numeric', month: 'short', year: 'numeric' })}`;
}
function setStartDate(d) {
    document.getElementById('startDatePicker').value = toISODateLocal(d);
    handleDateChange();
}
function shiftDateRange(dir) {
    const d = new Date(document.getElementById('startDatePicker').value);
    const isPlan = ['BW', 'LC', 'CW', 'AI'].includes(currentProcess);
    d.setDate(d.getDate() + dir * (isPlan ? viewDays : 1));
    setStartDate(d);
}
function goToToday() { setStartDate(new Date()); }
function openStartDatePicker(e) {
    const inp = document.getElementById('startDatePicker');
    if (e.target === inp) return;
    e.preventDefault();
    try { inp.showPicker(); } catch (err) { inp.focus(); }
}

function handleDateChange() {
    updateDateRangeLabel();
    if (currentProcess === 'Overview') renderOverview();
    else if (currentProcess === 'Stock') renderStockPage();
    else generateTable();
}

// immediate=true ข้ามการโชว์ skeleton (ใช้ตอน boot() ที่มี loadingOverlay ของตัวเองคุมอยู่แล้ว และหน้า print preview
// ที่ต้องการให้ตารางถูกสร้างเสร็จแบบ synchronous ทันทีเพื่อให้ prepareContentForPrint() ทำงานถูกต้อง)
// ปกติ (คลิกเปลี่ยนแท็บ process เอง) จะโชว์ skeleton สั้นๆ ก่อนสร้างตารางจริง กันจอว่างวูบตอนสลับหน้า (ตารางใหญ่ๆ ใช้เวลาสร้างพอสมควร)
function switchProcess(process, immediate) {
    if (currentProcess === 'Stock' && process !== 'Stock' && stockSelectedModels.size > 0) stockSelectedModels.clear(); // เปลี่ยนหน้าออกจาก Stock แล้ว เคลียร์ที่เลือกไว้ กันค้างงงว่าทำไมยังติ๊กอยู่ตอนกลับมา
    currentProcess = process;
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tabBtn-${process}`).classList.add('active');

    const overlay = document.getElementById('loadingOverlay');
    const runSwitch = () => {
        switchProcessRender(process);
        if (overlay && !immediate) overlay.style.display = 'none';
    };
    if (immediate || !overlay) { runSwitch(); return; }
    overlay.style.display = 'flex';
    // ใช้ setTimeout ไม่ใช้ requestAnimationFrame — rAF จะถูก browser "หยุดรอเฉยๆ ไม่ยิงเลย" ตอนแท็บ/หน้าต่างไม่ได้ active
    // (เช่น สลับไปดูแท็บอื่นแวบหนึ่งแล้วกลับมาคลิก) ถ้าใช้ rAF แล้วเผลอไปเจอเคสนั้น จะกลายเป็นค้าง skeleton ค้างจอตลอดกาล
    // ไปไม่ถึงตารางจริงเลย — setTimeout ยังทำงานแม้แท็บไม่ active (อาจช้าลงบ้างแต่ไม่มีทางค้างค้างสนิทแบบ rAF)
    setTimeout(runSwitch, 0);
}

function switchProcessRender(process) {
    const dateStr = document.getElementById('startDatePicker').value;
    const d = new Date(dateStr);
    document.getElementById('headerDisplayDate').innerText = formatDateHeader(d) + "-" + (d.getFullYear() + '').substring(2);

    // ซ่อนทุก container ก่อน แล้วค่อยเปิดเฉพาะอันที่ตรงกับ process นี้
    document.getElementById('overviewContainer').style.display = 'none';
    document.getElementById('announcementsCard').style.display = 'none';
    document.getElementById('processAnnouncementsCard').style.display = 'none';
    document.getElementById('tableContainer').style.display = 'none';
    document.getElementById('stockContainer').style.display = 'none';
    document.getElementById('viewToggleGroup').style.display = 'none';
    document.getElementById('revContainer').style.display = 'none';
    document.getElementById('printRevArea').style.display = 'none';
    document.getElementById('searchInput').style.display = 'none';
    document.getElementById('exportCsvBtn').style.display = 'none';
    document.getElementById('importCsvBtn').style.display = 'none';
    document.getElementById('clearRangeBtn').style.display = 'none';
    document.getElementById('hideEmptyBtn').style.display = 'none';
    document.getElementById('todayStatsRow').style.display = 'none';
    document.getElementById('copyPrevPeriodBtn').style.display = 'none';
    document.getElementById('autoPlanBtn').style.display = 'none';
    document.getElementById('stockSelectAllBtn').style.display = 'none';
    document.getElementById('stockClearSelectionBtn').style.display = 'none';
    document.getElementById('stockBulkActionZone').style.display = 'none';
    document.getElementById('stockClearAllBtn').style.display = 'none';

    if (process === 'Overview') {
        // หน้า Home จริงๆ — ดูภาพรวมอย่างเดียว ไม่มีอะไรให้แก้ไข จึงไม่ผูกกับระบบสิทธิ์ผู้ใช้เลย (ดู PROCESS_KEYS ฝั่ง server.js)
        document.getElementById('pageTitle').innerHTML = `<i class="fas fa-house"></i> ${t('home_title')}`;
        document.getElementById('printTitle').innerText = t('home_title');
        document.getElementById('overviewContainer').style.display = 'block';
        renderOverview();
        renderAnnouncements();
    } else if (process === 'Stock') {
        document.getElementById('pageTitle').innerHTML = `<i class="fas fa-boxes-stacked"></i> ${t('nav_stock')}`;
        document.getElementById('printTitle').innerText = t('nav_stock');
        document.getElementById('stockContainer').style.display = 'block';
        document.getElementById('searchInput').style.display = 'inline-block';
        document.getElementById('searchInput').value = '';
        document.getElementById('hideEmptyBtn').style.display = 'flex';
        document.getElementById('stockSelectAllBtn').style.display = isAdmin ? 'flex' : 'none';
        document.getElementById('stockClearSelectionBtn').style.display = isAdmin ? 'flex' : 'none';
        document.getElementById('stockClearAllBtn').style.display = isAdmin ? 'flex' : 'none';
        updateStockProblemsOnlyBtnUI();
        renderStockPage();
    } else {
        document.getElementById('pageTitle').innerHTML = `<span class="proc-dot proc-dot-${process}"></span> ${t('plan_title_short')} · ${process}`;
        document.getElementById('printTitle').innerText = processConfig[process].title;
        document.getElementById('tableContainer').style.display = 'block';
        document.getElementById('viewToggleGroup').style.display = 'flex';
        document.getElementById('revContainer').style.display = 'flex';
        document.getElementById('printRevArea').style.display = 'inline';
        document.getElementById('searchInput').style.display = 'inline-block';
        document.getElementById('searchInput').value = '';
        document.getElementById('exportCsvBtn').style.display = 'flex';
        document.getElementById('importCsvBtn').style.display = isAdmin ? 'flex' : 'none';
        document.getElementById('clearRangeBtn').style.display = isAdmin ? 'flex' : 'none';
        document.getElementById('hideEmptyBtn').style.display = 'flex';
        document.getElementById('copyPrevPeriodBtn').style.display = canEditProcess(process) ? 'flex' : 'none';
        document.getElementById('autoPlanBtn').style.display = (canEditProcess('LC') || canEditProcess('BW')) ? 'flex' : 'none';

        document.getElementById('revInput').value = revData[process] || '00';
        document.getElementById('printRevTxt').innerText = revData[process] || '00';
        updateTimestampUI();
        generateTable();
    }
    // ปุ่มซ่อน Model ว่างใช้ร่วมกันทั้งหน้าแผนและหน้าสต็อก — ย้ายไปไว้ในแถบเครื่องมือของหน้าที่เปิดอยู่
    const hideBtn = document.getElementById('hideEmptyBtn');
    const toolbarHost = process === 'Stock' ? document.getElementById('stockToolbarRight') : document.getElementById('planToolbar');
    if (hideBtn && toolbarHost && hideBtn.parentElement !== toolbarHost) toolbarHost.prepend(hideBtn);
    document.getElementById('searchBox').style.display = document.getElementById('searchInput').style.display === 'none' ? 'none' : 'flex';
    updateDateRangeLabel();
    updateNavBadges();
    updateAdminUI();
}

// === Dashboard Overview Functions ===
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

// รวมจำนวนชิ้น (Pcs) ที่วางแผนทั้งหมดของ process ในวันที่กำหนด — ใช้ Hrs/Day รวมของทั้ง process วันนั้น (ไม่แยกราย group แล้ว)
function computeGrandTotalPcs(proc, dateKey) {
    let total = 0;
    let dayHrs = parseFloat(hrsData[`${proc}_${dateKey}`]); if (isNaN(dayHrs)) dayHrs = 18;
    processConfig[proc].groups.forEach(g => {
        const p = getParams(g.id);
        (modelState[g.id] || []).forEach(m => {
            const v = parseFloat(cellData[`${proc}_${m}_${dateKey}`]);
            if (!isNaN(v) && v > 0 && dayHrs > 0) total += calcPcs(v, p.oa, p.mct, dayHrs);
        });
    });
    return total;
}

// การ์ดตัวเลขสรุป "วันนี้" มุมขวาบนของหน้า Plan (BW/LC/CW เท่านั้น) — โชว์ตลอดไม่ว่าจะเลื่อนดูช่วงวันไหนอยู่ก็ตาม
function updateTodayStats() {
    const row = document.getElementById('todayStatsRow');
    if (!row) return;
    if (['BW', 'LC', 'CW', 'AI'].includes(currentProcess)) {
        const todayKey = formatDateHeader(new Date());
        document.getElementById('todayStatMC').innerText = computeGrandTotalMC(currentProcess, todayKey).toLocaleString(undefined, { maximumFractionDigits: 1 });
        document.getElementById('todayStatPcs').innerText = computeGrandTotalPcs(currentProcess, todayKey).toLocaleString();
        row.style.display = 'grid';
        renderProcessSummary();
    } else {
        row.style.display = 'none';
    }
}

// การ์ดสรุปด้านบนของหน้า process — จำนวน Model ที่มีแผน + กราฟภาระงานรายวันในช่วงที่เปิดอยู่
function renderProcessSummary() {
    const modelsEl = document.getElementById('todayStatModels');
    const weekEl = document.getElementById('weekLoadChart');
    if (!modelsEl || !weekEl) return;

    const startDate = new Date(document.getElementById('startDatePicker').value);
    const vals = dailyMcTotals(currentProcess, startDate, viewDays);

    let total = 0, active = 0;
    (processConfig[currentProcess].groups || []).forEach(g => {
        (modelState[g.id] || []).forEach(m => {
            total++;
            for (let i = 0; i < viewDays; i++) {
                const d = new Date(startDate); d.setDate(d.getDate() + i);
                if (parseFloat(cellData[`${currentProcess}_${m}_${formatDateHeader(d)}`]) > 0) { active++; break; }
            }
        });
    });
    modelsEl.innerHTML = `${active}<span style="font-size:14px;color:var(--text-muted);">/${total}</span>`;
    document.getElementById('todayStatModelsSub').innerText = `${total - active} ${t('still_empty_suffix')}`;

    const peak = Math.max(...vals, 0);
    const peakIdx = vals.indexOf(peak);
    const peakDate = new Date(startDate); peakDate.setDate(peakDate.getDate() + Math.max(peakIdx, 0));
    document.getElementById('todayStatMCSub').innerText = peak > 0 ? `${t('peak_in_range_prefix')} ${peak} ${t('machines_unit')} (${formatDateHeader(peakDate)})` : t('no_plan_in_range');

    const max = Math.max(...vals, 1);
    weekEl.innerHTML = `<div class="bars">${vals.map((v, i) => {
        const d = new Date(startDate); d.setDate(d.getDate() + i);
        const weekend = d.getDay() === 0 || d.getDay() === 6;
        const color = weekend ? 'var(--border-strong)' : (i === 0 ? 'var(--btn-primary-dark)' : 'var(--btn-primary)');
        return `<div class="bar-col" title="${formatDateHeader(d)}: ${v} เครื่อง">
            <div class="bar-val">${v || ''}</div>
            <div class="bar-track"><div class="bar-fill" style="height:${v ? Math.max(v / max * 100, 3) : 0}%;background:${color}"></div></div>
            <div class="bar-label">${d.getDate()}</div>
        </div>`;
    }).join('')}</div>`;
}

// === ประกาศ (หน้า Overview) — ทุกคนดูได้ แก้ไข/เพิ่ม/ลบได้เฉพาะ Admin ===
function renderAnnouncements() {
    const card = document.getElementById('announcementsCard');
    const list = document.getElementById('announcementsList');
    const addBtn = document.getElementById('addAnnouncementBtn');
    if (!card || !list) return;

    card.style.display = (announcements.length > 0 || isAdmin) ? 'flex' : 'none';
    addBtn.style.display = isAdmin ? 'flex' : 'none';

    if (announcements.length === 0) {
        list.innerHTML = '<div class="announcement-empty">ยังไม่มีประกาศ</div>';
        return;
    }
    list.innerHTML = announcements.map(a => `
        <div class="announcement-item">
            ${a.process ? `<span class="announcement-proc-tag">${a.process}</span>` : ''}
            <span class="announcement-text"></span>
            ${isAdmin ? `<div class="action-btns-inline no-print">
                <button class="btn-action btn-edit" onclick="editAnnouncement('${a.id}')" title="แก้ไข"><i class="fas fa-pencil-alt"></i></button>
                <button class="btn-action btn-del" onclick="deleteAnnouncement('${a.id}')" title="ลบ"><i class="fas fa-trash"></i></button>
            </div>` : ''}
        </div>
    `).join('');
    // ใส่ข้อความผ่าน innerText ทีละอันกันปัญหา HTML injection จากข้อความประกาศ
    list.querySelectorAll('.announcement-text').forEach((el, i) => { el.textContent = announcements[i].text; });
    updateAnnounceToggle(card, announcements.length);
}

// แถบประกาศย่อเหลือบรรทัดเดียว (ประกาศแรก) — กด "ดูทั้งหมด" เพื่อกางอ่านครบทุกอัน
function updateAnnounceToggle(card, count) {
    const btn = card.querySelector('.announce-toggle');
    if (!btn) return;
    const collapsed = card.classList.contains('collapsed');
    btn.textContent = collapsed ? `${t('announce_view_all')} (${count})` : t('announce_collapse');
}
function toggleAnnouncementsExpanded(btn) {
    const card = btn.closest('.announcements-card');
    card.classList.toggle('collapsed');
    updateAnnounceToggle(card, card.querySelectorAll('.announcement-item').length);
}

// ประกาศเฉพาะกระบวนการ — โชว์บนหน้าตาราง BW/LC/CW/AI (ไม่ใช่แค่หน้าแรก) และติดไปกับตอนพิมพ์/PDF ด้วยตามที่ขอ
// กรองเอาเฉพาะประกาศที่ระบุ process ตรงกับหน้านี้ + ประกาศทั่วไปที่ไม่ได้ระบุ process (แสดงทุกที่) — จัดการ (เพิ่ม/แก้/ลบ) ยังทำที่หน้าแรกจุดเดียว
function renderProcessAnnouncements() {
    const card = document.getElementById('processAnnouncementsCard');
    const list = document.getElementById('processAnnouncementsList');
    if (!card || !list) return;
    const relevant = announcements.filter(a => !a.process || a.process === currentProcess);
    card.style.display = relevant.length > 0 ? 'flex' : 'none';
    if (relevant.length === 0) { list.innerHTML = ''; return; }
    list.innerHTML = relevant.map(() => `<div class="announcement-item"><span class="announcement-text"></span></div>`).join('');
    list.querySelectorAll('.announcement-text').forEach((el, i) => { el.textContent = relevant[i].text; });
    updateAnnounceToggle(card, relevant.length);
}

async function addAnnouncement() {
    if (!isAdmin) return;
    const result = await showAnnouncementModal('เพิ่มประกาศใหม่', '', '', 'เพิ่ม');
    if (!result || !result.text) return;
    announcements.push({ id: 'a' + Date.now(), text: result.text, process: result.process });
    dirtyKeys.announcements = true; markDirty();
    renderAnnouncements();
}

async function editAnnouncement(id) {
    if (!isAdmin) return;
    const item = announcements.find(a => a.id === id);
    if (!item) return;
    const result = await showAnnouncementModal('แก้ไขประกาศ', item.text, item.process || '', 'บันทึก');
    if (result === null) return;
    if (!result.text) announcements = announcements.filter(a => a.id !== id);
    else { item.text = result.text; item.process = result.process; }
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

// สีของป้าย "จำนวนวันที่ใช้ได้" (คงเหลือ ÷ แผนการใช้ต่อวัน) — เกณฑ์เดียวกับ panel "Days of supply" ที่หน้าแรก ใช้ร่วมกันทั้ง 2 จุด
function daysSupplyStyle(days) {
    return days <= 5 ? 'background:var(--danger-soft);color:var(--danger)'
        : days <= 14 ? 'background:var(--warning-soft);color:var(--weekend-head-text)'
        : 'background:var(--success-soft);color:var(--success)';
}

const STOCK_STATUS_LABEL_I18N = {
    normal: { th: 'ปกติ', en: 'Normal' }, low: { th: 'ต่ำ', en: 'Low' },
    critical: { th: 'วิกฤต', en: 'Critical' }, excess: { th: 'เกิน', en: 'Excess' }
};
const STOCK_STATUS_LABEL = new Proxy({}, { get: (_, status) => STOCK_STATUS_LABEL_I18N[status] ? STOCK_STATUS_LABEL_I18N[status][appLang] : undefined });
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

// เลือกหลาย Model พร้อมกัน (หน้า Stock, Admin เท่านั้น) — ไว้ลบหลายตัว/เคลียร์ข้อมูลสต็อกหลายตัวทีเดียว แทนไล่ทำทีละตัว
// เก็บเป็น Map ของ {groupId, modelName} ตรงๆ (ไม่ join string ด้วย delimiter) กันปัญหากรณีชื่อ Model บังเอิญมีอักขระที่ใช้เป็นตัวคั่น
let stockSelectedModels = new Map(); // key: groupId + '::' + modelName -> { groupId, modelName }
function stockSelKey(groupId, modelName) { return groupId + '::' + modelName; }
function toggleStockSelect(groupId, modelName, checked) {
    const key = stockSelKey(groupId, modelName);
    if (checked) stockSelectedModels.set(key, { groupId, modelName }); else stockSelectedModels.delete(key);
    updateStockBulkBarUI();
}
function toggleStockSelectGroup(groupId, checked) {
    (modelState[groupId] || []).forEach(m => {
        const key = stockSelKey(groupId, m);
        if (checked) stockSelectedModels.set(key, { groupId, modelName: m }); else stockSelectedModels.delete(key);
    });
    renderStockPage();
}
function clearStockSelection() {
    stockSelectedModels.clear();
    renderStockPage();
}
// เลือก Model ทั้งหมดที่กำลังกรองอยู่ตอนนี้ (ตามแท็บ process + เฉพาะที่มีปัญหา + ซ่อน Model ว่าง ถ้าเปิดอยู่) — ใช้เตรียมก่อนกด
// "เคลียร์ข้อมูลสต็อก"/"ลบ Model" เป็นชุด เช่น เลือกแท็บเดียวแล้วกดเลือกทั้งหมด = เคลียร์ได้เฉพาะ process นั้น
function selectAllVisibleStockModels() {
    if (!isAdmin) return;
    const visible = filterStockRows(buildStockRows());
    visible.forEach(r => stockSelectedModels.set(stockSelKey(r.groupId, r.model), { groupId: r.groupId, modelName: r.model }));
    renderStockPage();
}

// ล้างข้อมูลสต็อก (สต็อกปัจจุบัน + Shipment) ของทุกกระบวนการรวดเดียว โดยไม่ต้องไปเลือกทีละแท็บ — ใช้ตอนเริ่มรอบนับสต็อกใหม่ทั้งโรงงาน
// ตัว Model ไม่ได้ถูกลบ แค่ยอดว่างลงเท่านั้น (เหมือน bulkClearSelectedStockData แต่ครอบคลุมทุกกระบวนการ)
async function clearAllStockData() {
    if (!isAdmin) return;
    const targets = buildStockRows().filter(r => stockData[r.stockKey] !== undefined || plannedUsedData[r.stockKey] !== undefined);
    if (targets.length === 0) { showToast(t('stock_clear_all_empty'), 'info'); return; }
    const byProc = {};
    targets.forEach(r => { byProc[r.proc] = (byProc[r.proc] || 0) + 1; });
    const previewList = Object.keys(byProc).map(p => `${p} — ${byProc[p]} Model`);
    const ok = await showConfirmModal(
        `${t('stock_clear_all_confirm')} (${targets.length} Model)`,
        true, t('stock_clear_all_btn'), previewList);
    if (!ok) return;
    targets.forEach(r => {
        if (stockData[r.stockKey] !== undefined) { delete stockData[r.stockKey]; markKeyDirty('stockData', r.stockKey); }
        if (plannedUsedData[r.stockKey] !== undefined) { delete plannedUsedData[r.stockKey]; markKeyDirty('plannedUsedData', r.stockKey); }
    });
    stockSelectedModels.clear();
    renderStockPage();
    showToast(`${t('stock_clear_all_done')} ${targets.length} Model`, 'success');
}
function updateStockBulkBarUI() {
    const bar = document.getElementById('stockBulkActionZone');
    if (!bar) return;
    const count = stockSelectedModels.size;
    bar.style.display = count > 0 ? 'flex' : 'none';
    const countEl = document.getElementById('stockBulkCount');
    if (countEl) countEl.innerText = count;
}
async function bulkDeleteSelectedModels() {
    if (!isAdmin || stockSelectedModels.size === 0) return;
    const count = stockSelectedModels.size;
    const previewList = Array.from(stockSelectedModels.values()).map(({ groupId, modelName }) => `${deriveProcessFromGroupId(groupId)} — ${aiDisplayName(deriveProcessFromGroupId(groupId), modelName)}`);
    const ok = await showConfirmModal(`ยืนยันลบ ${count} Model ที่เลือกไว้? การลบนี้ไม่สามารถ Undo ได้`, true, `ลบ ${count} Model`, previewList);
    if (!ok) return;
    stockSelectedModels.forEach(({ groupId, modelName }) => deleteModelCore(groupId, modelName));
    stockSelectedModels.clear();
    rerenderCurrentView();
}
async function bulkClearSelectedStockData() {
    if (!isAdmin || stockSelectedModels.size === 0) return;
    const count = stockSelectedModels.size;
    const previewList = Array.from(stockSelectedModels.values()).map(({ groupId, modelName }) => `${deriveProcessFromGroupId(groupId)} — ${aiDisplayName(deriveProcessFromGroupId(groupId), modelName)}`);
    const ok = await showConfirmModal(`ยืนยันเคลียร์ข้อมูลสต็อก (สต็อกปัจจุบัน/แผนการใช้) ของ ${count} Model ที่เลือกไว้? Model จะยังอยู่ แค่ยอดว่าง — การเคลียร์นี้ไม่สามารถ Undo ได้`, true, `เคลียร์ ${count} Model`, previewList);
    if (!ok) return;
    stockSelectedModels.forEach(({ groupId, modelName }) => {
        const proc = deriveProcessFromGroupId(groupId);
        const stockKey = `${proc}_${modelName}`;
        if (stockData[stockKey] !== undefined) { delete stockData[stockKey]; markKeyDirty('stockData', stockKey); }
        if (plannedUsedData[stockKey] !== undefined) { delete plannedUsedData[stockKey]; markKeyDirty('plannedUsedData', stockKey); }
    });
    stockSelectedModels.clear();
    renderStockPage();
}

// === ใบนับสต็อก + โหมดกรอกจากใบนับ ===
// ใบนับที่พิมพ์ออกไปกับหน้ากรอกต้องเรียงลำดับเดียวกันเป๊ะ (รหัส B-01, B-02...) — ใช้ฟังก์ชันนี้ร่วมกันทั้งสองที่
// ไม่สนตัวกรอง "เฉพาะที่มีปัญหา"/"ซ่อน Model ว่าง" เพราะตอนนับต้องนับครบทุก Model ของ process นั้น
const COUNT_SHEET_PREFIX = { BW: 'B', LC: 'L', CW: 'C', CW_EXPORT: 'E', AI: 'A' };
function countSheetLabel(filter) { return filter === 'CW_EXPORT' ? 'CW (Export)' : filter; }
function buildCountSheetRows(filter) {
    const all = buildStockRows();
    const rows = filter === 'CW_EXPORT' ? all.filter(r => r.proc === 'CW' && isCwExportModel(r.groupId, r.displayModel))
        : filter === 'CW' ? all.filter(r => r.proc === 'CW' && !isCwExportModel(r.groupId, r.displayModel))
        : all.filter(r => r.proc === filter);
    const prefix = COUNT_SHEET_PREFIX[filter] || filter[0];
    return rows.map((r, i) => ({ ...r, code: `${prefix}-${String(i + 1).padStart(2, '0')}`, groupLabel: (groupLabels[r.groupId] || r.groupId).replace(/<br>/g, ' ') }));
}

function parseCountValue(raw) {
    const s = String(raw).replace(/[,\s]/g, '');
    if (s === '') return { empty: true };
    if (!/^\d+(\.\d+)?$/.test(s)) return { invalid: true };
    return { value: s, num: parseFloat(s) };
}
// ต่างจากครั้งก่อนเกิน 5 เท่า (มาก/น้อยไป) = น่าจะพิมพ์ 0 เกินหรือขาด — เตือนเฉยๆ ยังบันทึกได้
function isOddCount(num, last) {
    if (!(last > 0)) return false;
    return num >= last * 5 || num <= last / 5;
}

// prefill (จากการอ่านใบนับที่สแกน): { values: { [rowIdx]: { value, uncertain, thumb } }, pages: [1,2] }
function openStockCountEntry(prefill = null) {
    if (!canEditProcess('Stock')) return;
    const pre = (prefill && prefill.values) || {};
    const scanned = !!prefill;
    const cols = scanned ? 6 : 5;
    const filter = stockProcessFilter;
    const rows = buildCountSheetRows(filter);
    if (rows.length === 0) { showToast('ไม่มี Model ในแท็บนี้', 'info'); return; }

    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay count-entry-overlay';
    overlay.id = 'countEntryOverlay';
    let lastGroup = null;
    const bodyHtml = rows.map((r, i) => {
        let html = '';
        if (r.groupId !== lastGroup) { lastGroup = r.groupId; html += `<tr class="ce-grp"><td colspan="${cols}">${escapeHtml(r.groupLabel)}</td></tr>`; }
        const hasLast = r.stockRec.value !== '' && r.stockRec.value != null;
        const lastNum = parseFloat(r.stockRec.value) || 0;
        return html + `<tr data-idx="${i}">
            <td class="ce-code">${r.code}</td>
            <td>${escapeHtml(r.displayModel)}</td>
            <td class="ce-num">${hasLast ? lastNum.toLocaleString() : '-'}</td>
            ${scanned ? `<td class="ce-thumb">${pre[i] && pre[i].thumb ? `<img src="${pre[i].thumb}" alt="">` : ''}</td>` : ''}
            <td><input type="text" inputmode="numeric" class="ce-inp" data-idx="${i}" autocomplete="off" value="${pre[i] ? escapeHtml(pre[i].value) : ''}"></td>
            <td class="ce-diff"></td>
        </tr>`;
    }).join('');
    overlay.innerHTML = `
        <div class="count-entry-box">
            <div class="ce-head">
                <div><div class="ce-title"><i class="fas ${scanned ? 'fa-file-import' : 'fa-keyboard'}"></i> ${scanned ? 'ตรวจผลอ่านใบนับ' : 'กรอกจากใบนับ'} — ${countSheetLabel(filter)}</div>
                ${scanned ? `<div class="ce-sub ce-scan-note">อ่านจากใบสแกนหน้า ${prefill.pages.join(', ')} แล้ว — เทียบตัวเลขกับรูปลายมือในแต่ละแถว ช่องสีเหลืองให้ตรวจเป็นพิเศษ</div>` : ''}
                <div class="ce-sub">พิมพ์ตัวเลขแล้วกด <span class="kbd">Enter</span> ลงบรรทัดถัดไป · <span class="kbd">↑</span><span class="kbd">↓</span> เลื่อนขึ้นลง · ช่องที่เว้นว่าง = ใช้ค่าเดิม</div></div>
                <div class="ce-progress"><span id="ceCount">0 / ${rows.length}</span><div class="ce-bar"><i id="ceBar"></i></div></div>
            </div>
            <div class="ce-table-wrap"><table class="ce-table">
                <thead><tr><th>รหัส</th><th>Model</th><th style="text-align:right">นับครั้งก่อน</th>${scanned ? '<th>ลายมือในใบนับ</th>' : ''}<th>นับได้</th><th>เทียบครั้งก่อน</th></tr></thead>
                <tbody>${bodyHtml}</tbody>
            </table></div>
            <div class="ce-foot">
                <span id="ceWarn" class="ce-warn"></span>
                <div style="display:flex; gap:8px;">
                    <button class="modal-btn modal-btn-cancel" id="ceCancelBtn">ยกเลิก</button>
                    <button class="modal-btn modal-btn-confirm" id="ceSaveBtn" disabled>บันทึก</button>
                </div>
            </div>
        </div>`;
    document.body.appendChild(overlay);

    const inputs = Array.from(overlay.querySelectorAll('.ce-inp'));
    const saveBtn = overlay.querySelector('#ceSaveBtn');

    // ค่าที่อ่านจากสแกนแล้วไม่มั่นใจ — ผู้ใช้แก้ช่องนั้นเองเมื่อไหร่ถือว่าตรวจแล้ว เลิกเตือน
    const uncertain = new Set(Object.keys(pre).filter(k => pre[k].uncertain).map(Number));
    const refresh = () => {
        let filled = 0, invalid = 0, odd = 0;
        inputs.forEach((inp, i) => {
            const r = rows[i];
            const diffTd = inp.closest('tr').querySelector('.ce-diff');
            const p = parseCountValue(inp.value);
            inp.classList.remove('done', 'odd', 'bad');
            diffTd.innerHTML = '';
            if (p.empty) return;
            if (p.invalid) { invalid++; inp.classList.add('bad'); diffTd.innerHTML = '<span class="ce-chip bad">ต้องเป็นตัวเลข</span>'; return; }
            filled++;
            const hasLast = r.stockRec.value !== '' && r.stockRec.value != null;
            if (uncertain.has(i)) {
                odd++; inp.classList.add('odd');
                diffTd.innerHTML = '<span class="ce-chip">อ่านลายมือไม่ชัด — ตรวจอีกที</span>';
            } else if (hasLast && isOddCount(p.num, r.currentStock)) {
                odd++; inp.classList.add('odd');
                diffTd.innerHTML = `<span class="ce-chip">ต่างจากครั้งก่อนมาก — ตรวจอีกที</span>`;
            } else {
                inp.classList.add('done');
                if (hasLast) {
                    const d = p.num - r.currentStock;
                    diffTd.innerHTML = `<span class="ce-d">${d > 0 ? '+' : d < 0 ? '−' : '±'}${Math.abs(d).toLocaleString()}</span>`;
                }
            }
        });
        overlay.querySelector('#ceCount').innerText = `${filled} / ${rows.length}`;
        overlay.querySelector('#ceBar').style.width = `${Math.round(filled / rows.length * 100)}%`;
        saveBtn.disabled = filled === 0 || invalid > 0;
        saveBtn.innerText = filled > 0 ? `บันทึก ${filled} รายการ` : 'บันทึก';
        overlay.querySelector('#ceWarn').innerText = invalid > 0 ? `มี ${invalid} ช่องที่ไม่ใช่ตัวเลข` : odd > 0 ? `มี ${odd} รายการที่ควรตรวจ (ยังบันทึกได้)` : '';
    };

    const focusAt = (i) => {
        if (i < 0) i = 0;
        if (i >= inputs.length) { saveBtn.disabled ? inputs[inputs.length - 1].focus() : saveBtn.focus(); return; }
        inputs[i].focus(); inputs[i].select();
    };
    const close = () => { overlay.remove(); document.removeEventListener('keydown', escHandler, true); };
    const hasEntries = () => inputs.some(inp => inp.value.trim() !== '');
    const tryCancel = async () => {
        if (hasEntries()) {
            overlay.style.visibility = 'hidden';
            const ok = await showConfirmModal('ยกเลิกการกรอก? ตัวเลขที่พิมพ์ไว้จะหายทั้งหมด', true, 'ยกเลิกการกรอก');
            overlay.style.visibility = '';
            if (!ok) { focusAt(inputs.findIndex(inp => inp.value.trim() === '')); return; }
        }
        close();
    };
    const escHandler = (e) => { if (e.key === 'Escape' && document.getElementById('countEntryOverlay') && !document.getElementById('modalOverlay')) { e.preventDefault(); tryCancel(); } };
    document.addEventListener('keydown', escHandler, true);

    // วางข้อความหลายบรรทัด: ถ้าแต่ละบรรทัดขึ้นต้นด้วยรหัส (เช่น "B-03 1200") จะลงช่องตามรหัส ไม่งั้นเติมไล่ลงจากช่องที่วาง (เหมือนวางคอลัมน์จาก Excel)
    const codeIndex = {};
    rows.forEach((r, i) => { codeIndex[r.code.toUpperCase()] = i; });
    const handlePaste = (e, startIdx) => {
        const text = (e.clipboardData || window.clipboardData).getData('text');
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l !== '');
        if (lines.length <= 1) return;
        e.preventDefault();
        const coded = lines.map(l => l.match(/^([A-Za-z]-\d+)\s*[,\t:=\s]\s*(.*)$/));
        let placed = 0, unknown = [];
        if (coded.every(m => m)) {
            coded.forEach(m => {
                const idx = codeIndex[m[1].toUpperCase()];
                if (idx === undefined) { unknown.push(m[1]); return; }
                inputs[idx].value = m[2].trim(); placed++;
            });
        } else {
            lines.forEach((l, k) => { const idx = startIdx + k; if (idx < inputs.length) { inputs[idx].value = l.split(/\t/)[0].trim(); placed++; } });
        }
        refresh();
        showToast(`วางแล้ว ${placed} รายการ${unknown.length ? ` · ไม่พบรหัส ${unknown.join(', ')}` : ''}`, unknown.length ? 'error' : 'success');
    };

    inputs.forEach((inp, i) => {
        inp.addEventListener('input', () => { uncertain.delete(i); refresh(); });
        inp.addEventListener('paste', (e) => handlePaste(e, i));
        inp.addEventListener('focus', () => { overlay.querySelectorAll('tr.ce-cur').forEach(tr => tr.classList.remove('ce-cur')); inp.closest('tr').classList.add('ce-cur'); });
        inp.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === 'ArrowDown') { e.preventDefault(); focusAt(e.shiftKey ? i - 1 : i + 1); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); focusAt(i - 1); }
        });
    });

    overlay.querySelector('#ceCancelBtn').onclick = tryCancel;
    saveBtn.onclick = () => {
        const now = new Date().toISOString();
        let count = 0;
        inputs.forEach((inp, i) => {
            const p = parseCountValue(inp.value);
            if (p.empty || p.invalid) return;
            const r = rows[i];
            stockData[r.stockKey] = { value: p.value, updatedBy: currentUser.username, updatedAt: now };
            markKeyDirty('stockData', r.stockKey);
            count++;
        });
        close();
        renderStockPage();
        if (count > 0) saveToServer();
    };

    refresh();
    focusAt(0);
}

// สีสถานะสต็อก (แถบสัดส่วนในการ์ดหน้าแรก) — ชุดเดียวกับป้ายสถานะในตาราง
const STOCK_DONUT_COLORS = { normal: '#16a34a', low: '#b45309', critical: '#dc2626', excess: '#6366f1' };

function simpleBarsHTML(items, unit, formatFn) {
    const max = Math.max(...items.map(i => i.value), 1);
    const fmt = formatFn || (v => Number.isInteger(v) ? v.toLocaleString() : v.toFixed(1));
    return `<div class="bars">${items.map(i => `
        <div class="bar-col" title="${i.label}: ${fmt(i.value)} ${unit || ''}">
            <div class="bar-val">${i.value ? fmt(i.value) : ''}</div>
            <div class="bar-track"><div class="bar-fill" style="height:${i.value ? Math.max(i.value / max * 100, 3) : 0}%;background:var(--btn-primary)"></div></div>
            <div class="bar-label">${i.label}</div>
        </div>`).join('')}</div>`;
}

// รวมจำนวนเครื่องต่อวันของกลุ่ม (group id) ที่ระบุ จาก cellData จริง — ใช้ modelState เป็นตัวตั้ง ไม่ไล่ key แบบ prefix
// รับ groupIds ตรงๆ (ไม่ใช่ process) เพื่อให้ใช้กับกลุ่มย่อยของ process ได้ด้วย เช่น "CW (Export)" ที่เป็นแค่บางกลุ่มของ CW ไม่ใช่ process แยก
function dailyMcTotalsForGroups(groupIds, startDate, days) {
    const out = new Array(days).fill(0);
    groupIds.forEach(gid => {
        const proc = deriveProcessFromGroupId(gid);
        (modelState[gid] || []).forEach(m => {
            for (let i = 0; i < days; i++) {
                const d = new Date(startDate); d.setDate(d.getDate() + i);
                const v = parseFloat(cellData[`${proc}_${m}_${formatDateHeader(d)}`]);
                if (!isNaN(v)) out[i] += v;
            }
        });
    });
    return out.map(v => Math.round(v * 10) / 10);
}

// รวมจำนวนเครื่องต่อวันของ process หนึ่ง จาก cellData จริง (ใช้ modelState เป็นตัวตั้ง ไม่ไล่ key แบบ prefix)
function dailyMcTotals(proc, startDate, days) {
    return dailyMcTotalsForGroups((processConfig[proc] ? processConfig[proc].groups : []).map(g => g.id), startDate, days);
}

// แผงกราฟใต้การ์ดสรุปในหน้า Home — ตารางความหนาแน่นของแผน, รายการวิกฤตด่วน, กราฟแท่งวันนี้, กิจกรรมล่าสุด
function renderHomePanels(procs, rows) {
    const startDate = new Date(document.getElementById('startDatePicker').value);
    const days = 7;
    const dateInfo = [];
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate); d.setDate(d.getDate() + i);
        dateInfo.push({ key: formatDateHeader(d), short: String(d.getDate()), weekend: d.getDay() === 0 || d.getDay() === 6 });
    }

    const series = procs.map(p => ({ p, vals: dailyMcTotals(p, startDate, days) }));
    const max = Math.max(...series.flatMap(s => s.vals), 1);

    document.getElementById('heatPanel').innerHTML = `
        <div class="panel-head">
            <p class="panel-title">${t('heat_panel_title')}</p>
            <span class="panel-note">${t('heat_dark_note')} · ${t('open_plan_hint')}</span>
        </div>
        <table class="heat">
            <thead><tr><th></th>${dateInfo.map((d, i) => `<th class="${d.weekend ? 'wk' : ''}">${d.short}${i === 0 ? `<br>${t('today_note')}` : ''}</th>`).join('')}</tr></thead>
            <tbody>${series.map(s => `<tr class="heat-row" onclick="switchProcess('${s.p}')" title="${t('open_plan_hint')}">
                <td class="rowlab">${s.p}</td>
                ${s.vals.map((v, i) => {
                    const ratio = v / max;
                    const bg = v === 0 ? 'var(--header-bg)' : `color-mix(in srgb, var(--btn-primary) ${Math.round(18 + ratio * 72)}%, var(--card-bg))`;
                    const fg = v === 0 ? 'var(--text-muted)' : (ratio > 0.55 ? '#fff' : 'var(--text-main)');
                    return `<td><div class="hcell" style="background:${bg};color:${fg}" title="${s.p} · ${dateInfo[i].key}: ${v} ${t('machines_unit')}">${v || '–'}</div></td>`;
                }).join('')}
            </tr>`).join('')}</tbody>
        </table>
        <div class="heat-scale">
            <span>${t('few_label')}</span>
            <i style="background:color-mix(in srgb, var(--btn-primary) 18%, var(--card-bg))"></i>
            <i style="background:color-mix(in srgb, var(--btn-primary) 45%, var(--card-bg))"></i>
            <i style="background:color-mix(in srgb, var(--btn-primary) 72%, var(--card-bg))"></i>
            <i style="background:var(--btn-primary)"></i>
            <span>${t('many_label')}</span>
        </div>`;

    // Total Plan (ชิ้น/Pcs) ไม่ใช่ Total M/C เพราะ M/C ซ้ำกับตัวเลขคอลัมน์ "วันนี้" ใน heatmap ด้านบนอยู่แล้ว
    // ใช้สูตรเดียวกับการ์ด "Total Plan (วันนี้)" ในหน้า process แต่ละหน้า (computeGrandTotalPcs) ตัวเลขจะตรงกันเป๊ะ
    const todayKey = dateInfo[0].key;
    document.getElementById('mcBarPanel').innerHTML = `
        <div class="panel-head">
            <p class="panel-title">${t('total_plan_today_title')}</p>
            <span class="panel-note">${t('pcs_unit_paren')}</span>
        </div>
        <div class="bar-chart-wrap">${simpleBarsHTML(procs.map(p => ({ label: p, value: computeGrandTotalPcs(p, todayKey) })), t('pcs_unit'))}</div>`;

    // รายการวิกฤตด่วน — เวอร์ชันย่อของ "รายการที่ต้องดูก่อน" ในหน้าสต็อก (ที่ย้ายไปอยู่หน้าสต็อกอย่างเดียวแล้ว)
    // เอากลับมาไว้ที่ Home แบบย่อ เพราะเป็นข้อมูลที่ควรเห็นได้ทันทีโดยไม่ต้องกดเข้าไปอีกหน้า
    const allUrgent = (rows || []).filter(r => r.status === 'critical' || r.status === 'low')
        .sort((a, b) => (STOCK_URGENCY_RANK[a.status] - STOCK_URGENCY_RANK[b.status]) || (a.balance - b.balance));
    const shownUrgent = allUrgent.slice(0, 4);
    document.getElementById('urgentPanel').innerHTML = `
        <div class="panel-head">
            <p class="panel-title">${t('urgent_panel_title')}</p>
            <span class="panel-note">${allUrgent.length} ${t('items_count_suffix')}</span>
        </div>
        ${shownUrgent.length === 0 ? `<div style="font-size:12px;color:var(--text-muted);">${t('no_urgent_items')}</div>`
            : shownUrgent.map(r => `
            <div class="stock-alert-row ${r.status === 'critical' ? 'stock-alert-critical' : ''}">
                <span class="stock-group-proc">${r.proc}</span>
                <div class="stock-alert-model">
                    <div class="stock-alert-model-name">${r.displayModel}</div>
                    <div class="stock-alert-model-group">${(groupLabels[r.groupId] || r.groupId).replace(/<br>/g, ' ')}</div>
                </div>
                <div class="stock-alert-status">${STOCK_STATUS_LABEL[r.status]}</div>
            </div>`).join('')}
        <button class="btn-action" style="width:100%; margin-top:auto; padding-top:10px; color:var(--btn-primary); font-weight:600; justify-content:center; display:flex; align-items:center; gap:6px;" onclick="switchProcess('Stock')">${t('view_all_stock')} <i class="fas fa-arrow-right"></i></button>`;

    // Top Model ตามแผนในช่วงที่กำลังดู (7 วันข้างหน้าเดียวกับตาราง heatmap ด้านบน) — เดิมรวมสะสมทั้งหมดตั้งแต่มีข้อมูล ซึ่งแทบไม่ขยับเปลี่ยนวันต่อวันเลย
    // เปลี่ยนมาสะท้อนสิ่งที่ "กำลังจะเกิดขึ้น" แทน ใช้วางแผนได้จริงกว่าว่าสัปดาห์นี้ต้องโฟกัส Model ไหน
    const periodDateKeys = new Set(dateInfo.map(d => d.key));
    const modelTotals = {};
    Object.keys(cellData).forEach(k => {
        const parts = k.split('_');
        const p = parts[0];
        if (!procs.includes(p)) return;
        const dateKey = parts[parts.length - 1];
        if (!periodDateKeys.has(dateKey)) return;
        const v = parseFloat(cellData[k]);
        if (isNaN(v) || v <= 0) return;
        const model = parts.slice(1, -1).join('_');
        const label = `${aiDisplayName(p, model)} (${p})`;
        modelTotals[label] = (modelTotals[label] || 0) + v;
    });
    const topModels = Object.entries(modelTotals).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const topMax = topModels.length ? topModels[0][1] : 1;
    document.getElementById('topModelPanel').innerHTML = `
        <div class="panel-head">
            <p class="panel-title">${t('top_model_title')}</p>
            <span class="panel-note">M/C</span>
        </div>
        ${topModels.length === 0 ? `<div style="font-size:12px;color:var(--text-muted);">${t('no_production_data')}</div>`
            : `<div class="hbar-list">${topModels.map(([label, val]) => `
            <div class="hbar-row">
                <span class="hbar-label" title="${label}">${label}</span>
                <div class="hbar-track"><div class="hbar-fill" style="width:${Math.max(val / topMax * 100, 2)}%"></div></div>
                <span class="hbar-num">${(Math.round(val * 10) / 10).toLocaleString()}</span>
            </div>`).join('')}</div>`}`;

    // สต็อกจะหมดในกี่วัน — สูตร: วันที่เหลือ = คงเหลือ ÷ Planned Used
    // โชว์ทุกตัวที่ ≤14 วัน (วิกฤต+ต่ำ) ทุก process พร้อมกันเลย ไม่จำกัดแค่ 4 อันดับแรกแล้ว (ดูรายละเอียดที่ปุ่ม "ดูทั้งหมดที่สต็อก" แทนไม่พอ ถ้ามีของเร่งด่วนหลายตัวพร้อมกัน)
    const daysSupply = (rows || [])
        .filter(r => r.daysLeft !== null && r.currentStock > 0)
        .map(r => ({ ...r, days: Math.max(r.daysLeft, 0) }))
        .filter(r => r.days <= 14)
        .sort((a, b) => a.days - b.days);
    document.getElementById('daysSupplyPanel').innerHTML = `
        <div class="panel-head">
            <p class="panel-title">${t('days_supply_title')}</p>
            <span class="panel-note">${t('days_supply_note')}</span>
        </div>
        ${daysSupply.length === 0 ? `<div style="font-size:12px;color:var(--text-muted);">${t('no_calc_data')}</div>`
            : `<div class="dos-list">${daysSupply.map(r => {
                const style = daysSupplyStyle(r.days);
                return `
            <div class="dos-row">
                <div><div class="dos-name">${r.displayModel}</div><div class="dos-sub">${r.proc} · ${(groupLabels[r.groupId] || r.groupId).replace(/<br>/g, ' ')}</div></div>
                <span class="dos-days" style="${style}">${r.days.toFixed(1)} ${t('days_unit')}</span>
            </div>`; }).join('')}</div>`}`;
}

// === Shipment ดึงจากแผนของกระบวนการที่ใช้ของตัวนี้ ตาม BOM (sourceMap: <ผู้ใช้>_<model> -> { srcProc, srcModel, ratio }) ===
// BW ถูก LC ใช้, LC ถูก CW ใช้ — ชิ้นที่ใช้ = เครื่องของผู้ใช้ × Hrs × 3600 ÷ MCT × OA% × อัตราส่วน BOM
// Model ที่ไม่มีใครผูก BOM มาใช้ ยังกรอก Shipment เองเหมือนเดิม
const SHIPMENT_CONSUMER = { BW: 'LC', LC: 'CW' };
function consumersFeeding(proc, model) {
    const consumer = SHIPMENT_CONSUMER[proc];
    if (!consumer) return [];
    return Object.keys(sourceMap)
        .filter(k => k.startsWith(consumer + '_') && sourceMap[k] && sourceMap[k].srcProc === proc && sourceMap[k].srcModel === model)
        .map(k => ({ proc: consumer, model: k.slice(consumer.length + 1), ratio: sourceMap[k].ratio || 1 }))
        .filter(l => findGroupOfModel(consumer, l.model));
}
function consumerUsageOnDate(links, dateKey) {
    let pcs = 0;
    const sources = [];
    links.forEach(l => {
        const mc = parseFloat(cellData[`${l.proc}_${l.model}_${dateKey}`]);
        if (isNaN(mc) || mc <= 0) return;
        const p = getParams(findGroupOfModel(l.proc, l.model));
        pcs += calcPcs(mc, p.oa, p.mct, procHrs(l.proc, dateKey)) * l.ratio;
        sources.push({ proc: l.proc, model: l.model, mc });
    });
    return { pcs: Math.round(pcs), sources };
}
// ใช้ได้อีกกี่วัน: ไล่หักตามแผนของผู้ใช้ทีละวันจากวันที่เลือก (วันที่ไม่ได้ใช้ก็นับเป็นวันเต็ม) — คืน null ถ้า 60 วันข้างหน้าไม่มีแผนเลย
function walkDaysOfSupply(stock, links, startDate) {
    let left = stock, days = 0, anyUsage = false;
    for (let i = 0; i < 60; i++) {
        const d = new Date(startDate); d.setDate(d.getDate() + i);
        const use = consumerUsageOnDate(links, formatDateHeader(d)).pcs;
        if (use > 0) anyUsage = true;
        if (use > left) return Math.round((days + left / use) * 10) / 10;
        left -= use; days++;
    }
    return anyUsage ? 60 : null;
}
function stockViewDate() {
    const v = document.getElementById('startDatePicker').value;
    return v ? new Date(v) : new Date();
}

// สร้างรายการ stock แบบดิบทุกแถวทุก process (ยังไม่กรอง) — ใช้ร่วมกันทั้ง renderStockPage() และ selectAllVisibleStockModels()
function buildStockRows() {
    const viewDate = stockViewDate();
    const viewKey = formatDateHeader(viewDate);
    const rows = [];
    ['BW', 'LC', 'CW', 'AI'].forEach(proc => {
        processConfig[proc].groups.forEach(g => {
            (modelState[g.id] || []).forEach(m => {
                const stockKey = `${proc}_${m}`;
                // Current Stock และ Planned Used กรอกเองทั้งคู่ หน่วย "จำนวนชิ้น (Pcs)" — Balance = Stock − Planned Used
                const stockRec = getStockRecord(stockKey);
                const currentStock = parseFloat(stockRec.value) || 0;
                const plannedUsedRec = getPlannedUsedRecord(stockKey);
                // BW ที่มี LC ผูก BOM / LC ที่มี CW ผูก BOM: Shipment = ชิ้นที่ปลายทางใช้ในวันที่เลือก (ไม่ใช้ค่าที่เคยกรอกเอง)
                const links = consumersFeeding(proc, m);
                const autoShipment = links.length > 0;
                const usage = autoShipment ? consumerUsageOnDate(links, viewKey) : null;
                const plannedUsed = autoShipment ? usage.pcs : (parseFloat(plannedUsedRec.value) || 0);
                const balance = currentStock - plannedUsed;
                const stockEntered = stockRec.value !== '' && stockRec.value != null;
                const daysLeft = autoShipment ? (stockEntered ? walkDaysOfSupply(currentStock, links, viewDate) : null)
                    : (plannedUsed > 0 ? Math.round(currentStock / plannedUsed * 10) / 10 : null);
                rows.push({ proc, groupId: g.id, model: m, displayModel: aiDisplayName(proc, m), stockKey, stockRec, plannedUsedRec, currentStock, plannedUsed, balance, daysLeft, autoShipment, shipmentSources: usage ? usage.sources : [], links, status: computeStockStatus(currentStock, plannedUsed, balance) });
            });
        });
    });
    return rows;
}

// กรอง rows ดิบตามตัวกรองที่กำลังเลือกอยู่ตอนนี้ (แท็บ process, เฉพาะที่มีปัญหา, ซ่อน Model ว่าง) — ใช้ร่วมกันเช่นกัน
function filterStockRows(rows) {
    let filteredRows = stockProcessFilter === 'CW_EXPORT' ? rows.filter(r => r.proc === 'CW' && isCwExportModel(r.groupId, r.displayModel))
        : stockProcessFilter === 'CW' ? rows.filter(r => r.proc === 'CW' && !isCwExportModel(r.groupId, r.displayModel))
        : rows.filter(r => r.proc === stockProcessFilter);
    if (stockProblemsOnly) filteredRows = filteredRows.filter(r => r.status === 'critical' || r.status === 'low');
    if (hideEmptyModels) filteredRows = filteredRows.filter(r => r.status !== null);
    return filteredRows;
}

function renderStockPage() {
    const rows = buildStockRows();
    const rowsByKey = {};
    rows.forEach(r => rowsByKey[`${r.proc}_${r.model}`] = r);

    let filteredRows = filterStockRows(rows);

    // แผง "รายการที่ต้องดูก่อน" — สรุปรายการ Low/Critical ที่หนักสุดในกลุ่ม/process ที่กรองอยู่ตอนนี้ ไว้ดูปุ๊บเจอปั๊บ ไม่ต้องไล่เปิดทีละกลุ่มด้านล่าง
    // จำกัดไว้ 5 รายการเสมอ (เดิมตอนเลือกแท็บ "ทั้งหมด" จะโชว์ไม่จำกัด แต่เอาแท็บนั้นออกไปแล้ว เพราะยาวเกินไปและซ้ำกับ panel "Days of supply" ที่หน้าแรก)
    const alertPanel = document.getElementById('stockAlertPanel');
    const alertRows = filteredRows.filter(r => r.status === 'critical' || r.status === 'low')
        .sort((a, b) => (STOCK_URGENCY_RANK[a.status] - STOCK_URGENCY_RANK[b.status]) || (a.balance - b.balance));

    if (alertRows.length === 0) {
        alertPanel.style.display = 'none';
    } else {
        const shownAlerts = alertRows.slice(0, 5);
        alertPanel.style.display = 'block';
        alertPanel.innerHTML = `
            <div class="stock-alert-title"><i class="fas fa-triangle-exclamation"></i> ${t('attention_list_title')}</div>
            ${shownAlerts.map(r => {
                const grpLabel = (groupLabels[r.groupId] || r.groupId).replace(/<br>/g, ' ');
                return `
            <div class="stock-alert-row ${r.status === 'critical' ? 'stock-alert-critical' : ''}">
                <span class="stock-group-proc">${r.proc}</span>
                <div class="stock-alert-model">
                    <div class="stock-alert-model-name">${r.displayModel}</div>
                    <div class="stock-alert-model-group">${grpLabel}</div>
                </div>
                <div class="stock-alert-stock">${r.currentStock.toLocaleString()}</div>
                <div class="stock-alert-balance">${r.balance.toLocaleString()}</div>
                <div class="stock-alert-status">${STOCK_STATUS_LABEL[r.status]}</div>
            </div>`;
            }).join('')}
        `;
    }

    // กำลังค้นหาอยู่ (มีคำในช่องค้นหา) ให้กางทุกกลุ่มไว้ก่อน ไม่งั้นโมเดลที่ค้นหาเจอในกลุ่มที่พับไว้จะไม่โผล่มาให้เห็น
    const searchInput = document.getElementById('searchInput');
    const searchQuery = searchInput ? searchInput.value.trim().toLowerCase() : '';

    // การ์ดสรุปย้ายไปหน้า Home แล้ว หน้านี้เหลือแค่ตารางกรอกข้อมูลจริง จึงโชว์ตารางเสมอไม่ว่าจะกรอง All หรือ process เดียว
    const stockTableWrap = document.getElementById('stockTableWrap');
    stockTableWrap.style.display = '';
    // จำตำแหน่งเลื่อนของตารางไว้ก่อนรื้อ tbody ทิ้งทั้งหมดด้านล่าง — ไม่งั้นพอกรอก Current Stock/Planned Used เสร็จ (onchange เรียก renderStockPage() ใหม่ทั้งฟังก์ชัน) ตารางจะเด้งกลับไปบรรทัดบนสุดทุกครั้ง ทั้งที่กำลังจะกรอกช่องถัดไปแถวเดิม
    const prevScrollTop = stockTableWrap.scrollTop;

    const canEditStock = canEditProcess('Stock');
    ['stockCountEntryBtn', 'stockScanReadBtn'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = canEditStock ? '' : 'none';
    });
    const table = document.getElementById('stockTable');
    table.querySelectorAll('tbody').forEach(tb => tb.remove());

    ['BW', 'LC', 'CW', 'AI'].forEach(proc => {
        const procMatchesFilter = stockProcessFilter === proc || (stockProcessFilter === 'CW_EXPORT' && proc === 'CW');
        if (!procMatchesFilter) return;
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

            // เทียบกับ groupRows (ที่ผ่านตัวกรองแล้ว) ไม่ใช่ modelState[g.id] ดิบๆ — ไม่งั้นตอนเปิด "ซ่อน Model ว่าง"/กรอง process อยู่
            // Model ที่ถูกซ่อนไว้ (ไม่โผล่เป็นแถวให้ติ๊กเลย) จะถูกนับรวมด้วย ทำให้กด "เลือกทั้งหมด" แล้วติ๊กครบทุกแถวที่เห็นจริงๆ แต่ checkbox หัวกลุ่มกลับโชว์ไม่ครบ
            const groupAllSelected = groupRows.length > 0 && groupRows.every(r => stockSelectedModels.has(stockSelKey(r.groupId, r.model)));

            const headerTr = document.createElement('tr');
            headerTr.className = 'stock-group-header' + (hasProblems ? ' has-problems' : '');
            headerTr.onclick = () => toggleStockGroup(g.id, hasProblems);
            headerTr.innerHTML = `<td colspan="7">
                ${isAdmin ? `<input type="checkbox" class="stock-select-cb" onclick="event.stopPropagation()" ${groupAllSelected ? 'checked' : ''} onchange="toggleStockSelectGroup('${g.id}', this.checked)" title="เลือกทั้งกลุ่ม">` : ''}
                <i class="fas fa-chevron-${expanded ? 'down' : 'right'}"></i>
                <span class="stock-group-proc">${proc}</span>
                <strong>${label}</strong>
                <span class="stock-group-meta">${groupRows.length} model${groupRows.length > 1 ? 's' : ''}${hasProblems ? ` · ${problemCount} ${t('problems_suffix')}` : ''}</span>
            </td>`;
            groupTbody.appendChild(headerTr);

            if (expanded) groupRows.forEach(r => {
                const tr = document.createElement('tr');
                tr.dataset.modelName = r.displayModel;
                if (searchQuery && !r.displayModel.toLowerCase().includes(searchQuery)) tr.style.opacity = '0.2';

                // คอลัมน์นี้โชว์ "จำนวนวันที่ใช้ได้" (คงเหลือ ÷ แผนการใช้ต่อวัน) แบบเดียวกับ panel "Days of supply" ที่หน้าแรก แทนป้ายสถานะ ปกติ/ต่ำ/วิกฤต เดิม
                // (r.status ยังคงคำนวณและใช้งานตามเดิมทุกจุดอื่น — แผงแจ้งเตือน/โดนัท/ตัวกรอง "เฉพาะที่มีปัญหา" — จุดนี้แค่เปลี่ยนวิธีแสดงผลเฉยๆ)
                const days = r.daysLeft;
                const daysText = days === null ? '' : (days >= 60 ? '60+' : days.toFixed(1));
                const statusHtml = days !== null ? `<span class="stock-badge" style="${daysSupplyStyle(days)}">${daysText} ${t('days_unit')}</span>` : '<span style="color:var(--text-muted);">-</span>';
                const balanceText = (r.currentStock > 0 || r.plannedUsed > 0) ? r.balance.toLocaleString() : '-';
                const chain = resolveSourceChain(r.proc, r.model);
                const hasChain = chain.length > 1;

                tr.innerHTML = `
                    <td style="text-align:left; color:var(--text-secondary); font-size:12px;">${r.proc}</td>
                    <td class="col-model">${isAdmin ? `<input type="checkbox" class="stock-select-cb" ${stockSelectedModels.has(stockSelKey(r.groupId, r.model)) ? 'checked' : ''} onchange="toggleStockSelect('${jsAttrEscape(r.groupId)}', '${jsAttrEscape(r.model)}', this.checked)">` : ''}${escapeHtml(r.displayModel)}${hasChain ? `<button class="chain-toggle-btn" onclick="toggleStockChainRow(this)" title="ดูแหล่งวัตถุดิบต้นทาง"><i class="fas fa-diagram-project"></i></button>` : ''}${isAdmin ? `<div class="action-btns no-print">
                        <button class="btn-action btn-edit" onclick="editModelName('${jsAttrEscape(r.groupId)}', '${jsAttrEscape(r.model)}')" title="แก้ไข Model"><i class="fas fa-pencil-alt"></i></button>
                        <button class="btn-action btn-del" onclick="delModel('${jsAttrEscape(r.groupId)}', '${jsAttrEscape(r.model)}')" title="ลบ Model"><i class="fas fa-trash"></i></button>
                    </div>` : ''}</td>
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
                if (r.autoShipment) {
                    // Shipment มาจากแผน LC ตาม BOM — แก้ที่แผน LC หรือ BOM ไม่ใช่ที่ช่องนี้
                    const srcText = r.shipmentSources.length
                        ? r.shipmentSources.map(x => `${x.proc} ${escapeHtml(aiDisplayName(x.proc, x.model))} · ${x.mc} M/C`).join(', ')
                        : `${r.links[0].proc} ${r.links.map(l => escapeHtml(aiDisplayName(l.proc, l.model))).join(', ')} · ${t('lc_no_plan_today')}`;
                    plannedTd.innerHTML = `<div class="ship-auto" title="${t('ship_auto_title')}"><span class="ship-num">${r.plannedUsed ? r.plannedUsed.toLocaleString() : '0'}</span><span class="ship-src"><i class="fas fa-link"></i> ${srcText}</span></div>`;
                    groupTbody.appendChild(tr);
                } else {
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
                }

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

            if (expanded && isAdmin) {
                const addTr = document.createElement('tr'); addTr.className = 'no-print';
                const addTd = document.createElement('td'); addTd.colSpan = 7; addTd.style.padding = '6px 16px';
                addTd.innerHTML = `<button class="btn-action btn-add" onclick="addModel('${g.id}')"><i class="fas fa-plus"></i> เพิ่ม Model</button>`;
                addTr.appendChild(addTd);
                groupTbody.appendChild(addTr);
            }

            table.appendChild(groupTbody);
        });
    });
    stockTableWrap.scrollTop = prevScrollTop;
    updateStockBulkBarUI();
}

// เปิดหน้าสต็อกที่แท็บของกระบวนการนั้นเลย (ไม่งั้นจะค้างแท็บที่เปิดไว้ล่าสุด เช่น BW)
function openStockTab(filter) {
    const btn = Array.from(document.querySelectorAll('#stockProcessFilterGroup .toggle-btn')).find(b => (b.getAttribute('onclick') || '').includes(`'${filter}'`));
    stockProcessFilter = filter;
    document.querySelectorAll('#stockProcessFilterGroup .toggle-btn').forEach(b => b.classList.toggle('active', b === btn));
    switchProcess('Stock');
}

function toggleStockChainRow(btn) {
    const row = btn.closest('tr').nextElementSibling;
    if (row && row.classList.contains('stock-chain-row')) row.style.display = row.style.display === 'none' ? 'table-row' : 'none';
}

// หน้า Home — สรุปสต็อกต่อ process (การ์ด+โดนัท), heatmap แผนการผลิต 7 วัน, กราฟ Total M/C วันนี้, กิจกรรมล่าสุด
// ดูอย่างเดียวทั้งหมด ไม่มีการแก้ไขข้อมูล จึงคำนวณจาก rows ทุก process เสมอ ไม่ขึ้นกับตัวกรองใดๆ (ไม่มีตัวกรองในหน้านี้ด้วย)
function renderOverview() {
    // ใช้ชุดเดียวกับหน้าสต็อก — Shipment ของ BW ที่ผูก LC ไว้คิดจากแผน LC เหมือนกันทั้ง 2 หน้า
    const rows = buildStockRows();

    const procs = ['BW', 'LC', 'CW', 'AI'];
    // การ์ด "CW (Export)" ไม่ใช่ process จริง (ดู isCwExportModel) — แยกงาน Export ออกมาจากการ์ด CW ปกติ วางไว้ก่อน AI เสมอ ให้ตรงกับลำดับแท็บในหน้าสต็อก
    const cardDefs = ['BW', 'LC', 'CW', 'CW_EXPORT', 'AI'];
    document.getElementById('overviewKpiRow').innerHTML = cardDefs.map(proc => {
        const procRows = proc === 'CW_EXPORT' ? rows.filter(r => r.proc === 'CW' && isCwExportModel(r.groupId, r.displayModel))
            : proc === 'CW' ? rows.filter(r => r.proc === 'CW' && !isCwExportModel(r.groupId, r.displayModel))
            : rows.filter(r => r.proc === proc);
        const tracked = procRows.filter(r => r.status !== null);
        const counts = {
            normal: tracked.filter(r => r.status === 'normal').length,
            low: tracked.filter(r => r.status === 'low').length,
            critical: tracked.filter(r => r.status === 'critical').length,
            excess: tracked.filter(r => r.status === 'excess').length,
        };
        const stock = procRows.reduce((sum, r) => sum + r.currentStock, 0);
        const plannedUsedTracked = procRows.filter(r => r.plannedUsed > 0);
        const plannedUsedSum = plannedUsedTracked.reduce((sum, r) => sum + r.plannedUsed, 0);
        const label = counts.critical > 0 ? `${counts.critical} ${t('critical_word')}` : counts.low > 0 ? `${counts.low} ${t('low_stock_word')}` : tracked.length === 0 ? t('no_data') : t('no_issues');
        const pillCls = counts.critical > 0 ? 's-bad' : counts.low > 0 ? 's-warn' : tracked.length === 0 ? 's-none' : 's-ok';
        const name = proc === 'CW_EXPORT' ? 'CW (Export)' : proc;
        const target = proc === 'CW_EXPORT' ? 'CW' : proc;
        // การ์ดที่ยังไม่มีสต็อกให้ดู โชว์แผน 7 วันข้างหน้าแทน (จำนวนเครื่องรวม) จะได้ไม่ใช่การ์ดว่างๆ
        const startDate = new Date(document.getElementById('startDatePicker').value);
        const keys7 = [];
        for (let i = 0; i < 7; i++) { const d = new Date(startDate); d.setDate(d.getDate() + i); keys7.push(formatDateHeader(d)); }
        const plan7 = procRows.reduce((sum, r) => sum + keys7.reduce((s2, dk) => s2 + (parseFloat(cellData[`${r.proc}_${r.model}_${dk}`]) || 0), 0), 0);
        const plan7Text = `${t('plan_7d_prefix')}: ${(Math.round(plan7 * 10) / 10).toLocaleString()} M/C`;
        if (tracked.length === 0 && stock === 0) {
            return `
        <div class="proc-card empty" onclick="switchProcess('${target}')" title="${t('open_plan_hint')}">
            <div class="pc-head"><span class="pname">${name}</span><span class="status-pill ${pillCls}">${label}</span></div>
            <div class="pc-empty">${t('stock_not_entered')}</div>
            <div class="pc-foot"><span>${plan7Text}</span></div>
        </div>`;
        }
        const total = Math.max(tracked.length, 1);
        const seg = (k) => counts[k] ? `<i style="width:${counts[k] / total * 100}%;background:${STOCK_DONUT_COLORS[k]}"></i>` : '';
        const daysLeft = plannedUsedSum > 0 ? stock / plannedUsedSum : null;
        return `
        <div class="proc-card" onclick="openStockTab('${proc}')" title="${t('view_all_stock')}">
            <div class="pc-head"><span class="pname">${name}</span><span class="status-pill ${pillCls}">${label}</span></div>
            <div class="pstock">${stock.toLocaleString()}<small>${t('stock_remaining_unit')}</small></div>
            <div class="pc-bar">${seg('normal')}${seg('low')}${seg('critical')}${seg('excess')}</div>
            <div class="pc-foot">
                <span>${plannedUsedTracked.length === 0 ? t('no_planned_data') : `${t('planned_used_prefix')} ${plannedUsedSum.toLocaleString()}`}</span>
                ${daysLeft !== null ? `<span>${daysLeft.toFixed(1)} ${t('days_unit')}</span>` : `<span>${plan7Text}</span>`}
            </div>
        </div>`;
    }).join('');

    renderHomePanels(procs, rows);
}

// ตัวเลขแดงข้างเมนู "สต็อก" = จำนวน Model ที่สต็อกต่ำ/วิกฤตอยู่ตอนนี้ (ทุก process) เห็นได้จากทุกหน้าโดยไม่ต้องเปิดหน้าสต็อก
function updateNavBadges() {
    const badge = document.getElementById('navStockBadge');
    if (!badge) return;
    const n = buildStockRows().filter(r => r.status === 'critical' || r.status === 'low').length;
    badge.textContent = n;
    badge.style.display = n > 0 ? '' : 'none';
}

// === Admin & Table Generation Functions ===
async function toggleAdmin() {
    if (currentUser) {
        if (isDirty) {
            // มีตัวเลือก: บันทึกแล้วออก / ออกโดยไม่บันทึก(ทิ้งข้อมูลที่แก้ไว้) / ยกเลิก
            const choice = await showLogoutConfirmModal('มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก ต้องการทำอย่างไร?');
            if (choice === null) return;
            if (choice === 'save') {
                await saveToServer();
                if (isDirty) { showToast('บันทึกไม่สำเร็จ ยังไม่ออกจากระบบเพื่อป้องกันข้อมูลหาย', 'error'); return; }
            } else if (choice === 'discard') {
                dirtyKeys = {};
                isDirty = false;
            }
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
    const adminSettingsSection = document.getElementById('adminSettingsSection');
    const sendPlanBtn = document.getElementById('sendPlanBtn');
    const undoRedoGroup = document.getElementById('undoRedoGroup');
    const editGroupDivider = document.getElementById('editGroupDivider');
    const shortcutsHintBtn = document.getElementById('shortcutsHintBtn');
    if (isAdmin) {
        btn.innerHTML = userPillHtml(currentUser ? currentUser.username : 'Admin', t('admin_mode_label')); btn.classList.add('logged-in');
        revInput.removeAttribute('readonly'); revInput.style.background = 'var(--card-bg)';
        saveBtn.style.display = 'flex'; // โชว์ทุกหน้ารวมทั้ง Overview ด้วย (ไว้เซฟประกาศ/สต็อกที่แก้จากหน้านี้ได้)
        if (adminSettingsSection) adminSettingsSection.style.display = 'block';
        if (sendPlanBtn) sendPlanBtn.style.display = 'flex';
        if (undoRedoGroup) undoRedoGroup.style.display = 'flex';
        if (editGroupDivider) editGroupDivider.style.display = 'block';
        if (shortcutsHintBtn) shortcutsHintBtn.style.display = 'flex';
    } else if (currentUser) {
        // login แบบจำกัดสิทธิ์ (แก้ไขได้เฉพาะ process ที่ได้รับมอบหมาย) — แก้ไขโครงสร้าง/Rev/Announcements ไม่ได้
        btn.innerHTML = userPillHtml(currentUser.username, currentUser.processes.join(', ')); btn.classList.add('logged-in');
        revInput.setAttribute('readonly', 'true'); revInput.style.background = 'var(--header-bg)';
        saveBtn.style.display = 'flex';
        if (adminSettingsSection) adminSettingsSection.style.display = 'none';
        if (sendPlanBtn) sendPlanBtn.style.display = 'none';
        if (undoRedoGroup) undoRedoGroup.style.display = 'none';
        if (editGroupDivider) editGroupDivider.style.display = 'block';
        if (shortcutsHintBtn) shortcutsHintBtn.style.display = 'none';
    } else {
        btn.innerHTML = `<i class="fas fa-lock"></i> <span class="login-label">${t('login_btn')}</span>`; btn.classList.remove('logged-in');
        revInput.setAttribute('readonly', 'true'); revInput.style.background = 'var(--header-bg)';
        saveBtn.style.display = 'none';
        if (adminSettingsSection) adminSettingsSection.style.display = 'none';
        if (sendPlanBtn) sendPlanBtn.style.display = 'none';
        if (undoRedoGroup) undoRedoGroup.style.display = 'none';
        if (editGroupDivider) editGroupDivider.style.display = 'none';
        if (shortcutsHintBtn) shortcutsHintBtn.style.display = 'none';
    }
    const loginHint = document.getElementById('sidebarLoginHint');
    if (loginHint) loginHint.style.display = currentUser ? 'none' : 'flex';
    updateUndoRedoBtnUI();
    updateSaveButtonUI();
    if (currentProcess === 'Overview') renderAnnouncements();
}

// ปุ่มผู้ใช้มุมขวาบน: วงกลมอักษรย่อ + ชื่อ + บทบาท/process ที่แก้ได้ (กดเพื่อออกจากระบบเหมือนเดิม)
function userPillHtml(name, sub) {
    const initials = String(name).trim().slice(0, 2).toUpperCase();
    return `<span class="user-avatar" title="${escapeHtml(name)} · ${escapeHtml(sub)}">${escapeHtml(initials)}</span><span class="login-label">${escapeHtml(name)}<small>${escapeHtml(sub)}</small></span>`;
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

let lastUsersList = [];
function renderManageUsersModal(usersList) {
    lastUsersList = usersList;
    const root = document.getElementById('modalRoot');
    const rows = usersList.map(u => `
        <tr>
            <td>${escapeHtml(u.username)}</td>
            <td><span class="role-badge ${u.role === 'admin' ? 'role-admin' : ''}">${u.role === 'admin' ? 'Admin' : (u.processes.join(', ') || '-')}</span></td>
            <td style="text-align:right; white-space:nowrap;">
                <button class="btn-action" onclick="openEditUser('${escapeHtml(u.username)}')" title="แก้ไข"><i class="fas fa-pen"></i></button>
                ${u.username !== currentUser.username ? `<button class="btn-action btn-del" onclick="deleteUserPrompt('${escapeHtml(u.username)}')" title="ลบ"><i class="fas fa-trash"></i></button>` : ''}
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
                        <label><input type="checkbox" value="AI"> AI</label>
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

function openEditUser(username) {
    const u = lastUsersList.find(x => x.username === username);
    if (!u) return;
    const root = document.getElementById('modalRoot');
    root.innerHTML = `
        <div class="modal-overlay" id="modalOverlay">
            <div class="modal-box">
                <h3><i class="fas fa-pen"></i> แก้ไขผู้ใช้งาน: ${escapeHtml(u.username)}</h3>
                <input type="password" id="editUserPassword" placeholder="รหัสผ่านใหม่ (เว้นว่าง = ไม่เปลี่ยน)" style="margin-bottom:10px;">
                <select id="editUserRole" onchange="document.getElementById('editUserProcessGroup').style.display = this.value === 'admin' ? 'none' : 'flex';" style="width:100%; padding:8px; border:1px solid var(--border-strong); border-radius:var(--radius-sm); font-family:inherit; margin-bottom:10px; box-sizing:border-box;">
                    <option value="process" ${u.role !== 'admin' ? 'selected' : ''}>แก้ไขได้เฉพาะ process ที่เลือก</option>
                    <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin (สิทธิ์เต็ม)</option>
                </select>
                <div class="process-check-group" id="editUserProcessGroup" style="display:${u.role === 'admin' ? 'none' : 'flex'};">
                    ${['BW', 'LC', 'CW', 'AI', 'Stock'].map(p => `<label><input type="checkbox" value="${p}" ${u.processes.includes(p) ? 'checked' : ''}> ${p}</label>`).join('')}
                </div>
                <div class="modal-actions" style="margin-top:16px;">
                    <button class="modal-btn modal-btn-cancel" id="modalCancelBtn">ยกเลิก</button>
                    <button class="modal-btn modal-btn-confirm" onclick="submitEditUser('${escapeHtml(u.username)}')">บันทึก</button>
                </div>
            </div>
        </div>`;
    document.getElementById('modalCancelBtn').onclick = () => openManageUsers();
    document.getElementById('modalOverlay').onclick = (e) => { if (e.target.id === 'modalOverlay') openManageUsers(); };
}

async function submitEditUser(username) {
    const newPassword = document.getElementById('editUserPassword').value;
    const role = document.getElementById('editUserRole').value;
    const processes = Array.from(document.querySelectorAll('#editUserProcessGroup input:checked')).map(c => c.value);
    if (role === 'process' && processes.length === 0) { showToast('เลือกอย่างน้อย 1 process', 'error'); return; }
    try {
        const body = { username: currentUser.username, password: sessionPassword, targetUsername: username, role, processes };
        if (newPassword) body.newPassword = newPassword;
        const res = await fetch('/api/users/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
        const data = await res.json();
        if (data.ok) { showToast('บันทึกการแก้ไขสำเร็จ', 'success'); openManageUsers(); }
        else showToast(data.error || 'บันทึกไม่สำเร็จ', 'error');
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

function showShortcutsHint() {
    toggleMoreMenu();
    const root = document.getElementById('modalRoot');
    root.innerHTML = `
        <div class="modal-overlay" id="modalOverlay">
            <div class="modal-box">
                <h3><i class="fas fa-circle-question"></i> เคล็ดลับการใช้งาน</h3>
                <div class="modal-preview-list">
                    <div>• ลากไอคอน ⋮⋮ ที่ชื่อ Model เพื่อจัดลำดับใหม่</div>
                    <div>• วางข้อมูลจาก Excel ได้ทั้งก้อน (Ctrl+V)</div>
                    <div>• Ctrl+Z เพื่อยกเลิกการแก้ไขล่าสุด, Ctrl+Y เพื่อทำซ้ำ (หรือกดปุ่มลูกศรข้างปุ่มบันทึก)</div>
                </div>
                <div class="modal-actions"><button class="modal-btn modal-btn-confirm" id="modalCancelBtn">ปิด</button></div>
            </div>
        </div>`;
    document.getElementById('modalCancelBtn').onclick = closeModal;
    document.getElementById('modalOverlay').onclick = (e) => { if (e.target.id === 'modalOverlay') closeModal(); };
}

async function testTeamsWebhook() {
    if (!isAdmin) return;
    try {
        const res = await fetch('/api/notify-test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) });
        const data = await res.json();
        showToast(data.ok ? 'ส่งข้อความทดสอบไป Teams แล้ว เช็คในช่องที่ตั้งค่าไว้' : 'ส่งไม่สำเร็จ', data.ok ? 'success' : 'error');
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
    updateDateRangeLabel();
    rerenderCurrentView();
}

// สีของโมเดล/ช่อง Cover อ้างอิงจาก "รหัส Cover" เป็นหลัก (ตั้งสีครั้งเดียวต่อรหัส ใช้ซ้ำได้ทุกโมเดลที่ใช้ Cover รหัสเดียวกัน)
// เผื่อรหัสนี้ยังไม่เคยตั้งสีไว้ (หรือโมเดลยังไม่มีรหัส Cover) ใช้สีเดิมที่เคยตั้งไว้เฉพาะโมเดลนั้น (coverColors) เป็น fallback
function getCoverCodeColor(code) {
    return (code && coverCodeColors[code]) || null;
}

// เลือกสีตัวอักษร (ดำ/ขาว) ให้อ่านออกบนพื้นหลังสีที่ Admin เลือกเอง — คำนวณความสว่างแบบ YIQ จากสีพื้นหลัง
function getContrastTextColor(hex) {
    if (!hex) return '#1f2937';
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16), g = parseInt(h.substring(2, 4), 16), b = parseInt(h.substring(4, 6), 16);
    if ([r, g, b].some(isNaN)) return '#1f2937';
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 150 ? '#1f2937' : '#ffffff';
}

// coverData/coverColors เก็บด้วยคีย์ "<process>::<ชื่อ Model>" (ไม่ใช่ชื่อ Model เปล่าๆ) กันกรณี Model ชื่อเดียวกันไปอยู่คนละ process ที่มี Cover ทั้งคู่ (เช่น CW กับ AI) แล้วสี/รหัส Cover ไปทับกันเอง
// สำหรับ AI ที่ modelName เก็บเป็น "<groupId>::<ชื่อ>" อยู่แล้ว (กันชื่อซ้ำข้ามกลุ่มในตัว AI เอง) คีย์นี้จะกลายเป็น "AI::<groupId>::<ชื่อ>" ซ้อนกัน 2 ชั้น ก็ยังใช้งานถูกต้องปกติ
function coverKey(proc, modelName) { return `${proc}::${modelName}`; }

// urgentModels: ธงด่วนต่อ Model (ไม่ผูกกับวันที่) — คีย์รูปแบบเดียวกับ stockData/plannedUsedData คือ "<process>_<ชื่อ Model>"
function urgentKey(proc, modelName) { return `${proc}_${modelName}`; }

function toggleUrgentModel(e, groupId, modelName) {
    e.stopPropagation();
    if (!isAdmin) return;
    const proc = deriveProcessFromGroupId(groupId);
    const key = urgentKey(proc, modelName);
    if (urgentModels[key]) delete urgentModels[key]; else urgentModels[key] = true;
    markKeyDirty('urgentModels', key);
    generateTable();
}

function updateCoverColor(modelName, color) {
    if (!isAdmin) return;
    const ck = coverKey(currentProcess, modelName); // Cover column มีแค่ในตาราง generateTable() ของ currentProcess เท่านั้น (ไม่มีในหน้า Stock) จึงอ้าง currentProcess ตรงๆ ได้
    const code = coverData[ck];
    if (code) { coverCodeColors[code] = color; markKeyDirty('coverCodeColors', code); }
    else { coverColors[ck] = color; markKeyDirty('coverColors', ck); }
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
    clearCellSelection(); // ตารางถูกสร้างใหม่ทั้งก้อน ช่อง input เดิมที่เคยลากเลือกไว้หายไปแล้ว เคลียร์การเลือกทิ้งกันอ้างอิง element ที่ไม่มีอยู่จริงค้าง
    renderProcessAnnouncements();
    const config = processConfig[currentProcess]; const startDate = new Date(document.getElementById('startDatePicker').value);
    let mainTable = document.getElementById('mainTable'); let tHead = document.getElementById('tableHead');
    mainTable.querySelectorAll('tbody').forEach(tb => tb.remove()); tHead.innerHTML = '';

    // คอลัมน์วันที่ใช้ min-width หน่วย px คงที่เสมอ (ไม่ใช่ % ของ viewDays) เพื่อให้เมื่อดูแบบ 1 เดือน (30 วัน)
    // ตารางขยายกว้างเกินจอแล้วเลื่อนซ้าย-ขวาได้ (.table-responsive มี overflow-x: auto อยู่แล้ว) แทนที่จะบีบคอลัมน์จนอ่านไม่ออก
    let modelWidth = "200px"; let coverWidth = config.hasCover ? "90px" : "0px"; let dateMinWidth = "68px";
    const todayKey = formatDateHeader(new Date());
    const labelCols = config.hasCover ? 2 : 1;
    const viewKeys = [];
    for (let i = 0; i < viewDays; i++) { const d = new Date(startDate); d.setDate(d.getDate() + i); viewKeys.push(formatDateHeader(d)); }

    let trHead = document.createElement('tr');
    let headerStr = `<th class="th-model" style="min-width:${modelWidth};">Model</th>`;
    if (config.hasCover) headerStr += `<th style="min-width:${coverWidth};">Cover</th>`;
    for (let i = 0; i < viewDays; i++) {
        let d = new Date(startDate); d.setDate(d.getDate() + i);
        let dateKey = viewKeys[i];
        let isWeekend = (d.getDay() === 0 || d.getDay() === 6); let isToday = dateKey === todayKey;
        let cls = [isWeekend ? 'weekend-header' : '', isToday ? 'today-header' : ''].filter(Boolean).join(' ');
        headerStr += `<th class="${cls}" style="min-width:${dateMinWidth};">${dateHeaderHtml(d, isToday)}</th>`;
    }
    trHead.innerHTML = headerStr; tHead.appendChild(trHead);
    const groupHasData = {};
    config.groups.forEach(g => { groupHasData[g.id] = (modelState[g.id] || []).some(m => viewKeys.some(dk => parseFloat(cellData[`${currentProcess}_${m}_${dk}`]) > 0)); });
    const anyGroupHasData = Object.values(groupHasData).some(Boolean);
    planGroupCollapsedState = {};

    // Hrs/Day ของทั้ง process รวมเป็นแถวเดียว (ไม่ต้องกรอกซ้ำทีละกลุ่มเหมือนเดิม) — ใช้ค่าเดียวกันคำนวณ Pcs ทุกกลุ่มใน process นี้
    if (isAdmin) {
        const hrsTbody = document.createElement('tbody'); hrsTbody.id = 'tbody-hrs-consolidated';
        const trHrs = document.createElement('tr'); trHrs.className = 'hrs-row';
        const tdHrsLabel = document.createElement('td'); tdHrsLabel.className = 'col-model hrs-label';
        tdHrsLabel.colSpan = labelCols;
        tdHrsLabel.style.borderTop = "1px solid var(--border-color)";
        tdHrsLabel.innerHTML = '<strong><i class="fas fa-clock"></i> Hrs/Day (ทั้ง process)</strong>';
        trHrs.appendChild(tdHrsLabel);

        for (let i = 0; i < viewDays; i++) {
            let d = new Date(startDate); d.setDate(d.getDate() + i);
            let dateKey = formatDateHeader(d); let hrsKey = `${currentProcess}_${dateKey}`;

            let td = document.createElement('td'); td.className = dayClasses(d, 'val-cell'); td.style.borderTop = "1px solid var(--border-color)";

            let inpHrs = document.createElement('input'); inpHrs.type = 'number'; inpHrs.step = '0.5';
            inpHrs.className = 'table-input hrs-input-all';
            inpHrs.value = hrsData[hrsKey] || '18';

            inpHrs.oninput = markDirty; // กัน poll มาทับตอนกำลังพิมพ์อยู่ (ก่อน blur)
            inpHrs.onchange = function () { hrsData[hrsKey] = this.value; markKeyDirty('hrsData', hrsKey); calcTotals(); };
            inpHrs.onkeyup = calcTotals;

            td.appendChild(inpHrs); trHrs.appendChild(td);
        }
        hrsTbody.appendChild(trHrs);
        mainTable.appendChild(hrsTbody);
    }

    config.groups.forEach(groupConfig => {
        let groupId = groupConfig.id; let groupTbody = document.createElement('tbody'); groupTbody.id = `tbody-${groupId}`;
        let models = modelState[groupId] || []; let rowCount = models.length;
        let p = getParams(groupId);

        // แถบหัวกลุ่ม (แทนคอลัมน์กลุ่มแบบ rowspan เดิม) — กดเพื่อพับ/กาง; กลุ่มที่ว่างทั้งช่วงพับไว้ให้เองถ้ากลุ่มอื่นมีแผนอยู่
        const collapsed = planGroupOverrides.hasOwnProperty(groupId) ? planGroupOverrides[groupId] : (!groupHasData[groupId] && anyGroupHasData);
        planGroupCollapsedState[groupId] = collapsed;
        const bandTr = document.createElement('tr');
        bandTr.className = 'grp-band';
        const bandTd = document.createElement('td');
        bandTd.colSpan = labelCols + viewDays;
        const groupName = (groupLabels[groupId] || groupId).replace(/<br>/gi, ' ');
        const emptyNote = collapsed && !groupHasData[groupId] ? ` · ${t('group_empty_collapsed')}` : '';
        bandTd.innerHTML = `<div class="grp-band-inner">
            <i class="fas fa-chevron-${collapsed ? 'right' : 'down'} grp-chevron no-print"></i>
            <span class="grp-name">${groupName}</span>
            <span class="grp-meta">${rowCount} Model${emptyNote}</span>
            ${isAdmin ? `<span class="grp-admin no-print">
                <button class="btn-edit-type" onclick="editGroup('${groupId}')"><i class="fas fa-pen"></i> แก้ไขประเภท</button>
                <label>OA% <input type="number" step="1" value="${p.oa}" onchange="updateParam('${groupId}', 'oa', this.value)"></label>
                <label>MCT <input type="number" step="0.1" value="${p.mct}" onchange="updateParam('${groupId}', 'mct', this.value)"></label>
            </span>` : ''}
        </div>`;
        bandTr.appendChild(bandTd);
        bandTr.onclick = (e) => {
            if (e.target.closest('input, button, label')) return;
            planGroupOverrides[groupId] = !collapsed;
            generateTable();
        };
        groupTbody.appendChild(bandTr);

        // --- 1. Generate Models ---
        models.forEach((modelName, index) => {
            let tr = document.createElement('tr');
            const isUrgent = !!urgentModels[urgentKey(currentProcess, modelName)];
            tr.className = (index % 2 === 0 ? 'row-even' : 'row-odd') + (isUrgent ? ' row-urgent' : '') + (collapsed ? ' grp-collapsed-row' : '');
            // AI: ชื่อเก็บจริงเป็น "<groupId>::<ชื่อที่โชว์>" (กันชื่อซ้ำข้ามกลุ่มชนกัน) — ใช้ displayName เฉพาะจุดที่โชว์ให้คนดู ส่วน modelName (ดิบ) ยังใช้ทำ key ข้อมูลทุกที่เหมือนเดิม
            const displayName = aiDisplayName(currentProcess, modelName);
            tr.dataset.modelName = displayName; // ชื่อเต็ม (รวม variant) ไว้ใช้ค้นหา แม้ตอนแสดงผลจะแยก base/variant ออกเป็นคนละ span

            let tdModel = document.createElement('td'); let isBlue = blueModels.includes(modelName);
            if (modelName === 'Q4 (DSS2)') tdModel.style.backgroundColor = '#f1f2f6';
            // สีชื่อโมเดลอ้างอิงจากสีของรหัส Cover เป็นหลัก (โมเดลที่ใช้ Cover รหัสเดียวกันจะได้สีเดียวกันอัตโนมัติ)
            // แสดงเป็นแถบสีซ้ายเซลล์ (เหมือนแถว Total) แทนป้ายพื้นหลังเต็ม/ตัวหนังสือสี — ดูไม่ลายตาเวลามีหลายแถวเรียงกัน แต่ยังกันมองไม่เห็นตอนสีอ่อนอย่างเหลืองได้
            // เฉพาะ process ที่มีคอลัมน์ Cover จริง (CW/AI) เท่านั้น — BW/LC ไม่มี Cover เป็นของตัวเอง แต่ coverData/coverColors เก็บด้วยชื่อ Model เปล่าๆ ข้าม process
            // ถ้า BW/LC มี Model ชื่อซ้ำกับ CW/AI (เช่น G3, X2) จะดันไปเห็นแถบสีของ CW/AI ทั้งที่ตัวเองไม่มี Cover เลย จึงต้องกันไว้แค่ process ที่มี hasCover เท่านั้น
            const modelColor = config.hasCover ? (getCoverCodeColor(coverData[coverKey(currentProcess, modelName)]) || coverColors[coverKey(currentProcess, modelName)]) : null;
            if (isUrgent) tdModel.style.borderLeft = '3px solid var(--danger)';
            else if (modelColor) tdModel.style.borderLeft = `3px solid ${modelColor}`;
            tdModel.className = 'col-model' + (isBlue ? ' col-model-blue' : ''); if (index === 0) tdModel.style.borderTop = "1px solid var(--border-color)";
            const { base: modelBase, variant: modelVariant } = parseModelDisplay(displayName);
            // ธงด่วน: ติดแล้วโชว์ badge "ด่วน" ตลอด (ติดไปกับพิมพ์/PDF ด้วย) กดที่ badge เพื่อยกเลิกได้เฉพาะ Admin
            // ยังไม่ติด: มีแค่ไอคอนจางๆ ให้ Admin กดติดธง (no-print เพราะไม่มีความหมายตอนพิมพ์)
            const urgentOnclick = `toggleUrgentModel(event, '${jsAttrEscape(groupId)}', '${jsAttrEscape(modelName)}')`;
            const urgentHtml = isUrgent
                ? `<span class="urgent-badge-text"${isAdmin ? ` onclick="${urgentOnclick}" title="กดเพื่อยกเลิกด่วน"` : ' title="ด่วน"'}><i class="fas fa-flag"></i> ด่วน</span>`
                : (isAdmin ? `<span class="urgent-flag-btn no-print" onclick="${urgentOnclick}" title="ทำเครื่องหมายด่วน"><i class="fas fa-flag"></i></span>` : '');
            tdModel.innerHTML = `${isAdmin ? `<span class="drag-handle no-print" title="ลากเพื่อจัดลำดับ"><i class="fas fa-grip-vertical"></i></span>` : ''}${urgentHtml}<span class="model-text">${escapeHtml(modelBase)}</span>${modelVariant ? `<span class="model-variant-badge">${escapeHtml(modelVariant)}</span>` : ''}`;
            if (isAdmin) {
                tdModel.innerHTML += `<div class="action-btns no-print">
                    <button class="btn-action btn-edit" onclick="editModelName('${jsAttrEscape(groupId)}', '${jsAttrEscape(modelName)}')" title="แก้ไข Model"><i class="fas fa-pencil-alt"></i></button>
                    <button class="btn-action btn-del" onclick="delModel('${jsAttrEscape(groupId)}', '${jsAttrEscape(modelName)}')" title="ลบ Model"><i class="fas fa-trash"></i></button>
                </div>`;
                // ลากจัดลำดับ Model ในกลุ่มเดียวกัน — ใช้ handle เล็กๆ แยกต่างหาก (ไม่ใช่ทั้งแถว) กันไปชนกับการคลิกปุ่ม/เลือกข้อความปกติ
                const dragHandle = tdModel.querySelector('.drag-handle');
                dragHandle.draggable = true;
                dragHandle.ondragstart = (e) => { e.dataTransfer.setData('text/plain', modelName); e.dataTransfer.effectAllowed = 'move'; };
                tr.ondragover = (e) => { e.preventDefault(); tr.classList.add('drag-over'); };
                tr.ondragleave = () => { tr.classList.remove('drag-over'); };
                tr.ondrop = (e) => { e.preventDefault(); tr.classList.remove('drag-over'); handleModelReorder(groupId, e.dataTransfer.getData('text/plain'), modelName); };
            }
            tr.appendChild(tdModel);

            if (config.hasCover) {
                let tdCover = document.createElement('td'); if (index === 0) tdCover.style.borderTop = "1px solid var(--border-color)";
                let ck = coverKey(currentProcess, modelName);
                // รหัส Cover (ข้อความสั้น) ใช้ป้ายพื้นหลังสีเต็ม อ่านง่ายและไม่ลายตาเพราะข้อความสั้น ต่างจากชื่อ Model ที่ยาวกว่าจึงใช้แถบสีซ้ายแทน
                let rawCoverColor = getCoverCodeColor(coverData[ck]) || coverColors[ck];
                let cColor = rawCoverColor || '#2d3436';
                let coverInputStyle = rawCoverColor ? `background-color:${rawCoverColor}; color:${getContrastTextColor(rawCoverColor)};` : `color:${cColor};`;
                let coverHtml = `<div style="display:flex; justify-content:center; align-items:center; gap:4px;">
                    <input type="text" id="cover_inp_${escapeHtml(modelName)}" class="cover-input" placeholder="-" value="${escapeHtml(coverData[ck] || '')}" style="${coverInputStyle}" ${!isAdmin ? 'readonly' : ''}>`;
                if (isAdmin) {
                    coverHtml += `<input type="color" class="no-print cover-color-picker" value="${cColor}" onchange="updateCoverColor('${jsAttrEscape(modelName)}', this.value)" title="เปลี่ยนสีตัวอักษร">`;
                }
                coverHtml += `</div>`;
                tdCover.innerHTML = coverHtml;

                if (isAdmin) {
                    let textInp = tdCover.querySelector('.cover-input');
                    textInp.oninput = markDirty; // กัน poll มาทับตอนกำลังพิมพ์อยู่ (ก่อน blur)
                    textInp.onchange = function () { coverData[ck] = this.value; markKeyDirty('coverData', ck); generateTable(); };
                }
                tr.appendChild(tdCover);
            }

            for (let i = 0; i < viewDays; i++) {
                let d = new Date(startDate); d.setDate(d.getDate() + i); let storageKey = `${currentProcess}_${modelName}_${formatDateHeader(d)}`;
                let td = document.createElement('td'); td.className = dayClasses(d, 'val-cell'); if (index === 0) td.style.borderTop = "1px solid var(--border-color)";

                let inpDate = document.createElement('input'); inpDate.type = 'number'; inpDate.step = '0.1'; inpDate.placeholder = '-';
                inpDate.className = `table-input input-${groupId}`; inpDate.value = cellData[storageKey] || '';
                inpDate.dataset.cellKey = storageKey; // ใช้หาช่องนี้กลับมาไฮไลต์ได้ทีหลัง เวลามีคนอื่นแก้ค่าเข้ามาใหม่จาก poll (ดู flashChangedCells)
                let pcsSpan = document.createElement('span'); pcsSpan.className = 'cell-pcs-text';

                if (!canEditProcess(currentProcess)) inpDate.readOnly = true; else {
                    inpDate.oninput = markDirty; // กัน poll มาทับตอนกำลังพิมพ์อยู่ (ก่อน blur)
                    inpDate.onchange = function () { pushUndo(storageKey, cellData[storageKey] || ''); cellData[storageKey] = this.value; markKeyDirty('cellData', storageKey); calcTotals(); };
                    inpDate.onkeyup = calcTotals;
                    inpDate.onkeydown = function (e) { handleCellArrowNav(e, this); };
                    inpDate.onpaste = function (e) { handleCellPaste(e, this); };
                    inpDate.onmousedown = function () { handleCellSelectStart(this); };
                    inpDate.onmouseenter = function () { handleCellSelectDrag(this); };
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
                            const val = await showPromptModal(`คอมเมนต์ — ${displayName} (${formatDateHeader(d)})`, cellComments[storageKey] || '', { multiline: true, confirmLabel: 'บันทึก' });
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
            let trAdd = document.createElement('tr'); trAdd.className = 'no-print add-model-row' + (collapsed ? ' grp-collapsed-row' : '');
            let tdAdd = document.createElement('td'); tdAdd.colSpan = labelCols; tdAdd.className = 'col-model'; tdAdd.style.padding = '0';
            tdAdd.innerHTML = `<button class="btn-action btn-add" onclick="addModel('${groupId}')"><i class="fas fa-plus"></i> เพิ่ม Model</button>`; trAdd.appendChild(tdAdd);

            for (let i = 0; i < viewDays; i++) {
                let d = new Date(startDate); d.setDate(d.getDate() + i);
                let td = document.createElement('td'); td.className = dayClasses(d, 'val-cell'); if (rowCount === 0) td.style.borderTop = "1px solid var(--border-color)";
                trAdd.appendChild(td);
            }
            groupTbody.appendChild(trAdd);
        }

        // --- 4. Generate Totals ---
        if (groupConfig.totals) {
            groupConfig.totals.forEach(tot => {
                let trTot = document.createElement('tr'); trTot.className = `total-row row-total ${tot.isDg1 ? 'row-total-dg1' : ''} ${tot.isGrand ? 'row-grand-total' : ''}`;
                let labelTd = document.createElement('td'); labelTd.colSpan = labelCols;

                let labelText = tot.isGroupTotal ? (t('total_prefix') + " " + (groupLabels[groupId] || groupId).replace(/<br>/gi, ' ')) : tot.label[appLang];
                labelTd.innerText = labelText;
                labelTd.className = 'col-model tot-label'; trTot.appendChild(labelTd);

                for (let i = 0; i < viewDays; i++) { let d = new Date(startDate); d.setDate(d.getDate() + i); let valTd = document.createElement('td'); valTd.className = dayClasses(d, 'tot-cell'); valTd.dataset.sumGroups = tot.sum.join(','); valTd.innerText = '-'; trTot.appendChild(valTd); }
                groupTbody.appendChild(trTot);
            });
        }
        mainTable.appendChild(groupTbody);
    });
    calcTotals();
    updateCollapseAllLabel();
    updateTodayStats();
    bindVerticalStickyScroll();
    syncVerticalSticky();
    // Total ของ type ไหนมีข้อมูลจริงให้โชว์ ไม่มีข้อมูลเลยให้ซ่อน (เหมือน logic ตอนพิมพ์ PDF)
    if (hideEmptyModels) hideEmptyModelRows('hide-empty-live', true);
}

// หัวตาราง (วันที่) + แถว Hrs/Day รวม ลอยค้างด้านบนตอนเลื่อนจอลง — ทำด้วย JS (transform) แทน CSS position:sticky ล้วนๆ
// เพราะเจอว่า browser ที่ใช้ทดสอบ ถ้า overflow-x และ overflow-y ของกล่องเลื่อนไม่ใช่ visible พร้อมกัน sticky แนวตั้งจะใช้ไม่ได้เลย
// (ข้อจำกัดของ overflow spec เอง ไม่ใช่การตั้งค่าผิด) วิธีนี้ยังคงให้เลื่อนแนวนอนดูวันที่เยอะๆ ได้ตามปกติ
function syncVerticalSticky() {
    const container = document.querySelector('#tableContainer .table-responsive');
    if (!container) return;
    const y = container.scrollTop;
    const offset = y > 0 ? `translateY(${y}px)` : '';
    document.querySelectorAll('#tableHead th').forEach(th => { th.style.transform = offset; });
    document.querySelectorAll('.hrs-row td').forEach(td => { td.style.transform = offset; });
}

function bindVerticalStickyScroll() {
    const container = document.querySelector('#tableContainer .table-responsive');
    if (!container || container.dataset.stickyBound) return;
    container.dataset.stickyBound = 'true';
    container.addEventListener('scroll', syncVerticalSticky);
}

// พับ/กางกลุ่มในตารางแผน — จำเฉพาะในหน้าที่เปิดอยู่ (ไม่ข้ามการรีเฟรช) ค่าเริ่มต้นดูที่ generateTable()
let planGroupOverrides = {};
let planGroupCollapsedState = {};
function updateCollapseAllLabel() {
    const label = document.getElementById('collapseAllLabel');
    if (!label) return;
    const anyExpanded = Object.values(planGroupCollapsedState).some(c => !c);
    label.textContent = t(anyExpanded ? 'collapse_all' : 'expand_all');
}
function toggleCollapseAllGroups() {
    const collapse = Object.values(planGroupCollapsedState).some(c => !c);
    Object.keys(planGroupCollapsedState).forEach(g => { planGroupOverrides[g] = collapse; });
    generateTable();
}

// หัวคอลัมน์วันที่: "5 ต.ค." + วันในสัปดาห์ตัวเล็ก (วันนี้ต่อท้ายด้วย "· วันนี้")
function dateHeaderHtml(d, isToday) {
    const loc = appLang === 'en' ? 'en-GB' : 'th-TH-u-ca-gregory';
    const main = d.toLocaleDateString(loc, { day: 'numeric', month: 'short' });
    const wd = d.toLocaleDateString(loc, { weekday: 'short' });
    return `${main}<small class="th-sub">${wd}${isToday ? ' · ' + t('today_note') : ''}</small>`;
}

function calcTotals() {
    const startDate = new Date(document.getElementById('startDatePicker').value);

    ALL_GROUP_IDS.forEach(g => {
        let p = getParams(g);
        document.querySelectorAll(`.input-${g}`).forEach((inp, idx) => {
            let colIndex = idx % viewDays;
            let d = new Date(startDate); d.setDate(d.getDate() + colIndex);
            let hrsKey = `${currentProcess}_${formatDateHeader(d)}`;

            let dayHrs = parseFloat(hrsData[hrsKey]); if (isNaN(dayHrs)) dayHrs = 18;

            let val = parseFloat(inp.value);
            // ระดับสีของช่อง: ยิ่งใช้เครื่องมากยิ่งเข้ม (ดู input.table-input[data-lvl] ใน CSS)
            inp.dataset.lvl = !isNaN(val) && val > 0 ? (val <= 1 ? '1' : val <= 3 ? '2' : '3') : '';
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
                let hrsKey = `${currentProcess}_${formatDateHeader(d)}`;
                let dayHrs = parseFloat(hrsData[hrsKey]); if (isNaN(dayHrs)) dayHrs = 18;

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

// หา process จริงของโมเดลจาก groupId (ไม่ใช้ currentProcess เพราะฟังก์ชันนี้อาจถูกเรียกจากหน้า Stock ที่ currentProcess เป็น 'Stock' ไม่ใช่ process จริงของโมเดล)
function deriveProcessFromGroupId(groupId) {
    if (groupId.startsWith('bw_')) return 'BW';
    if (groupId.startsWith('lc_')) return 'LC';
    if (groupId.startsWith('cw_')) return 'CW';
    if (groupId.startsWith('ai_')) return 'AI';
    return currentProcess; // สำรองไว้เผื่อกรณีไม่เข้ารูปแบบที่รู้จัก
}

// แยก cellData key แบบเดียวกับ parseCellKey ฝั่ง server (server.js) — ตัดเอาแค่ตัวแรก (process) กับตัวสุดท้าย (day)
// ออก ที่เหลือตรงกลางคือชื่อ Model ทั้งหมด (ต่างจากการเช็คด้วย .startsWith() เดิมที่ Model ชื่อเป็น prefix ของอีกตัว
// เช่น "X2" กับ "X2_Auto" จะชนกันได้ ลบ/เปลี่ยนชื่อผิดตัวไปด้วย)
function parseCellKeyExact(key) {
    const parts = key.split('_');
    if (parts.length < 3) return null;
    return { process: parts[0], model: parts.slice(1, -1).join('_'), day: parts[parts.length - 1] };
}

async function editModelName(groupId, oldName) {
    if (!isAdmin) return;
    const proc = deriveProcessFromGroupId(groupId);
    const { base: oldBase, variant: oldVariant } = parseModelDisplay(aiDisplayName(proc, oldName));
    const result = await showModelNameModal('แก้ไข Model', oldBase, oldVariant);
    if (result === null || result.base === '') return;
    let newName = result.variant ? `${result.base} (${result.variant})` : result.base;
    if (proc === 'AI') newName = aiCompositeName(groupId, newName); // เก็บจริงเป็น "<groupId>::<ชื่อ>" เสมอ กันชื่อซ้ำข้ามกลุ่ม
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
            const parsed = parseCellKeyExact(k);
            if (parsed && parsed.process === proc && parsed.model === oldName) {
                let newKey = `${proc}_${newName}_${parsed.day}`;
                cellData[newKey] = cellData[k]; delete cellData[k];
                markKeyDirty('cellData', k); markKeyDirty('cellData', newKey);
            }
        });

        const oldCk = coverKey(proc, oldName), newCk = coverKey(proc, newName);
        if (coverData[oldCk] !== undefined) {
            coverData[newCk] = coverData[oldCk]; delete coverData[oldCk];
            markKeyDirty('coverData', oldCk); markKeyDirty('coverData', newCk);
        }
        if (coverColors[oldCk] !== undefined) {
            coverColors[newCk] = coverColors[oldCk]; delete coverColors[oldCk];
            markKeyDirty('coverColors', oldCk); markKeyDirty('coverColors', newCk);
        }
        // ย้าย mapping BOM ของตัวเองไปตามชื่อใหม่ (ตัวที่ชี้มาหาโมเดลนี้จาก process ถัดไปจะซ่อมให้ตอนเปิดจัดการ BOM แทน)
        const oldKey = `${proc}_${oldName}`, newKey = `${proc}_${newName}`;
        if (sourceMap[oldKey] !== undefined) {
            sourceMap[newKey] = sourceMap[oldKey]; delete sourceMap[oldKey];
            markKeyDirty('sourceMap', oldKey); markKeyDirty('sourceMap', newKey);
        }
        if (urgentModels[oldKey] !== undefined) {
            urgentModels[newKey] = urgentModels[oldKey]; delete urgentModels[oldKey];
            markKeyDirty('urgentModels', oldKey); markKeyDirty('urgentModels', newKey);
        }

        rerenderCurrentView();
    }
}

async function addModel(groupId) {
    if (!isAdmin) return;
    const proc = deriveProcessFromGroupId(groupId);
    const result = await showModelNameModal('เพิ่ม Model ใหม่');
    if (result === null || result.base === '') return;
    let name = result.variant ? `${result.base} (${result.variant})` : result.base;
    if (proc === 'AI') name = aiCompositeName(groupId, name); // เก็บจริงเป็น "<groupId>::<ชื่อ>" เสมอ กันชื่อซ้ำข้ามกลุ่ม
    if (modelState[groupId].includes(name)) {
        showToast(result.variant
            ? 'ชื่อ + ชนิด/ทูลลิ่งนี้มีอยู่แล้ว! ลองเปลี่ยนชนิดให้ต่างจากเดิม'
            : 'ชื่อนี้มีอยู่แล้ว! ถ้าเป็นสตัมป์เดียวกันแต่ Cover ต่างกัน ลองใส่ "ชนิด/ทูลลิ่ง" เพิ่มเพื่อแยกกัน เช่น รหัส Cover',
            'error');
        return;
    }
    modelState[groupId].push(name);
    markKeyDirty('modelState', groupId); rerenderCurrentView(); // เผื่อกดเพิ่มจากหน้า Stock ด้วย (currentProcess อาจไม่ใช่ BW/LC/CW)
}

// ลากสลับลำดับ Model ในกลุ่มเดียวกัน (ลาก draggedName ไปวางที่ตำแหน่งของ targetName) — ไม่รองรับลากข้ามกลุ่ม เพื่อกันความสับสนว่า Model ควรอยู่กลุ่มไหน
function handleModelReorder(groupId, draggedName, targetName) {
    if (!isAdmin || !draggedName || draggedName === targetName) return;
    const arr = modelState[groupId];
    if (!arr) return;
    const fromIdx = arr.indexOf(draggedName);
    const toIdx = arr.indexOf(targetName);
    if (fromIdx === -1 || toIdx === -1) return; // draggedName มาจากกลุ่มอื่น (ไม่รองรับ) หรือหาไม่เจอ
    arr.splice(fromIdx, 1);
    arr.splice(toIdx, 0, draggedName);
    markKeyDirty('modelState', groupId);
    generateTable();
}

// ลบ Model ออกจากทุกที่ที่เกี่ยวข้อง (ใช้ร่วมกันทั้งลบทีละตัวและลบหลายตัวพร้อมกัน) — ไม่ re-render เอง ให้ผู้เรียกจัดการเอง (bulk delete จะ render รวดเดียวหลังลบครบ)
function deleteModelCore(groupId, modelName) {
    const proc = deriveProcessFromGroupId(groupId);
    modelState[groupId] = modelState[groupId].filter(m => m !== modelName);
    markKeyDirty('modelState', groupId);
    Object.keys(cellData).forEach(k => {
        const parsed = parseCellKeyExact(k);
        if (parsed && parsed.process === proc && parsed.model === modelName) { delete cellData[k]; markKeyDirty('cellData', k); }
    });
    // cellComments ใช้รูปแบบ key เดียวกับ cellData เป๊ะๆ แต่เดิมไม่เคยถูกลบตอนลบ Model เลย กลายเป็นคอมเมนต์กำพร้าค้างไว้
    // ถ้ามี Model ชื่อเดิมถูกเพิ่มกลับเข้ามาทีหลัง คอมเมนต์เก่าจะกลับมาโผล่ที่ช่องวันเดิมทั้งที่ไม่มีใครกรอกไว้จริง แก้ให้ลบด้วยเช่นกัน
    Object.keys(cellComments).forEach(k => {
        const parsed = parseCellKeyExact(k);
        if (parsed && parsed.process === proc && parsed.model === modelName) { delete cellComments[k]; markKeyDirty('cellComments', k); }
    });
    const ck = coverKey(proc, modelName);
    delete coverData[ck]; markKeyDirty('coverData', ck);
    // coverColors เดิมไม่เคยถูกลบตอนลบ Model เลย (ต่างจาก coverData) กลายเป็นข้อมูลกำพร้าค้างเหมือนที่ stockData เคยเป็น แก้ให้ลบด้วยเลย
    if (coverColors[ck] !== undefined) { delete coverColors[ck]; markKeyDirty('coverColors', ck); }
    delete sourceMap[`${proc}_${modelName}`]; markKeyDirty('sourceMap', `${proc}_${modelName}`);
    // เดิม delModel ไม่เคยลบข้อมูลสต็อกของ Model นี้ทิ้งเลย กลายเป็นข้อมูลกำพร้าค้างในระบบ (เจอตอนทำลบหลายตัวจากหน้า Stock) แก้ให้ลบด้วย
    const stockKey = `${proc}_${modelName}`;
    if (stockData[stockKey] !== undefined) { delete stockData[stockKey]; markKeyDirty('stockData', stockKey); }
    if (plannedUsedData[stockKey] !== undefined) { delete plannedUsedData[stockKey]; markKeyDirty('plannedUsedData', stockKey); }
    const uKey = urgentKey(proc, modelName);
    if (urgentModels[uKey] !== undefined) { delete urgentModels[uKey]; markKeyDirty('urgentModels', uKey); }
}

async function delModel(groupId, modelName) {
    if (!isAdmin) return;
    const ok = await showConfirmModal(`ยืนยันลบ Model "${aiDisplayName(deriveProcessFromGroupId(groupId), modelName)}" ?`, true, 'ลบ');
    if (!ok) return;
    deleteModelCore(groupId, modelName);
    rerenderCurrentView();
}

// === ลบข้อมูลเป็นช่วงวันที่ ===
function openClearRangeModal() {
    if (!isAdmin) return;
    const root = document.getElementById('modalRoot');
    const anchorISO = document.getElementById('startDatePicker').value || toISODateLocal(new Date());
    root.innerHTML = `
        <div class="modal-overlay" id="modalOverlay">
            <div class="modal-box">
                <h3><i class="fas fa-eraser"></i> ลบข้อมูลช่วงวันที่ (${currentProcess})</h3>
                <div style="display:flex; gap:10px; margin-bottom:10px;">
                    <input type="date" id="clearRangeFrom" style="flex:1; padding:8px; border:1px solid var(--border-strong); border-radius:var(--radius-sm); font-family:inherit;">
                    <input type="date" id="clearRangeTo" style="flex:1; padding:8px; border:1px solid var(--border-strong); border-radius:var(--radius-sm); font-family:inherit;">
                </div>
                <p style="font-size:12px; color:var(--text-secondary); margin:0 0 6px;">ลบเฉพาะจำนวนเครื่อง+คอมเมนต์ของ Model ที่มีอยู่ตอนนี้ใน ${currentProcess} — ตัว Model ยังอยู่ แค่ข้อมูลในช่วงวันที่เลือกจะว่าง (ดูรายการก่อนยืนยันอีกทีในขั้นถัดไป)</p>
                <div class="modal-actions">
                    <button class="modal-btn modal-btn-cancel" id="modalCancelBtn">ยกเลิก</button>
                    <button class="modal-btn modal-btn-confirm" onclick="previewClearRange()">ต่อไป</button>
                </div>
            </div>
        </div>`;
    document.getElementById('clearRangeFrom').value = anchorISO;
    document.getElementById('clearRangeTo').value = anchorISO;
    document.getElementById('modalCancelBtn').onclick = closeModal;
    document.getElementById('modalOverlay').onclick = (e) => { if (e.target.id === 'modalOverlay') closeModal(); };
}

async function previewClearRange() {
    const fromVal = document.getElementById('clearRangeFrom').value;
    const toVal = document.getElementById('clearRangeTo').value;
    if (!fromVal || !toVal) { showToast('เลือกวันที่ให้ครบทั้งสองช่อง', 'error'); return; }
    const from = new Date(fromVal + 'T00:00:00'); const to = new Date(toVal + 'T00:00:00');
    if (from > to) { showToast('วันที่เริ่มต้นต้องไม่เกินวันที่สิ้นสุด', 'error'); return; }
    const dayCount = Math.round((to - from) / 86400000) + 1;
    if (dayCount > 366) { showToast('ช่วงวันที่กว้างเกินไป (สูงสุด 1 ปี)', 'error'); return; }

    const dateKeys = [];
    for (let i = 0; i < dayCount; i++) { const d = new Date(from); d.setDate(d.getDate() + i); dateKeys.push(formatDateHeader(d)); }

    const config = processConfig[currentProcess];
    const countByDate = new Map(); const allKeys = [];
    config.groups.forEach(g => {
        (modelState[g.id] || []).forEach(m => {
            dateKeys.forEach(dateKey => {
                const storageKey = `${currentProcess}_${m}_${dateKey}`;
                if (cellData[storageKey]) { allKeys.push(storageKey); countByDate.set(dateKey, (countByDate.get(dateKey) || 0) + 1); }
            });
        });
    });

    if (allKeys.length === 0) { showToast('ไม่มีข้อมูลในช่วงวันที่นี้ให้ลบ', 'info'); return; }

    const previewList = dateKeys.filter(dk => countByDate.has(dk)).map(dk => `${dk} — ${countByDate.get(dk)} ช่อง`);
    const ok = await showConfirmModal(
        `ยืนยันลบข้อมูล ${currentProcess} ตั้งแต่ ${dateKeys[0]} ถึง ${dateKeys[dateKeys.length - 1]} รวม ${allKeys.length} ช่อง? (กด Ctrl+Z เพื่อ Undo ทีละช่องได้)`,
        true, `ลบ ${allKeys.length} ช่อง`, previewList
    );
    if (!ok) return;

    allKeys.forEach(k => {
        pushUndo(k, cellData[k]);
        delete cellData[k]; markKeyDirty('cellData', k);
        if (cellComments[k]) { delete cellComments[k]; markKeyDirty('cellComments', k); }
    });
    generateTable();
    showToast(`ลบข้อมูลแล้ว ${allKeys.length} ช่อง`, 'success');
}

// คัดลอกจำนวนเครื่องจากช่วงก่อนหน้า (ยาวเท่าที่กำลังดูอยู่ เช่นดู 1 สัปดาห์ก็ดึงจากสัปดาห์ก่อนหน้ามาเป็นจุดตั้งต้น) — สำหรับ Model ที่แผนซ้ำเดิมทุกรอบ ไม่ต้องพิมพ์ใหม่ทุกครั้ง
// ทับเฉพาะช่องที่ช่วงก่อนหน้ามีค่าอยู่จริงเท่านั้น ช่องที่ช่วงก่อนหน้าว่างจะไม่ไปลบของเดิมในช่วงปัจจุบันทิ้ง
async function copyFromPreviousPeriod() {
    if (!canEditProcess(currentProcess)) return;
    const config = processConfig[currentProcess];
    if (!config) return;
    const startDate = new Date(document.getElementById('startDatePicker').value);

    const curKeys = []; const prevKeys = [];
    for (let i = 0; i < viewDays; i++) {
        const cur = new Date(startDate); cur.setDate(cur.getDate() + i);
        const prev = new Date(startDate); prev.setDate(prev.getDate() - viewDays + i);
        curKeys.push(formatDateHeader(cur)); prevKeys.push(formatDateHeader(prev));
    }

    const changes = []; // { key, oldVal, newVal, model }
    config.groups.forEach(g => {
        (modelState[g.id] || []).forEach(m => {
            for (let i = 0; i < viewDays; i++) {
                const prevKey = `${currentProcess}_${m}_${prevKeys[i]}`;
                const prevVal = cellData[prevKey];
                if (prevVal === undefined || prevVal === '') continue;
                const curKey = `${currentProcess}_${m}_${curKeys[i]}`;
                if (cellData[curKey] === prevVal) continue; // ค่าตรงกันอยู่แล้ว ไม่ต้องนับ/แก้
                changes.push({ key: curKey, oldVal: cellData[curKey], newVal: prevVal, model: aiDisplayName(currentProcess, m) });
            }
        });
    });

    if (changes.length === 0) { showToast(`ไม่มีข้อมูลจากช่วงก่อนหน้า (${prevKeys[0]} ถึง ${prevKeys[prevKeys.length - 1]}) ให้คัดลอก`, 'info'); return; }

    const overwriteCount = changes.filter(c => c.oldVal !== undefined && c.oldVal !== '').length;
    const previewList = [...new Set(changes.map(c => c.model))].slice(0, 20);
    const ok = await showConfirmModal(
        `คัดลอกจำนวนเครื่องจากช่วง ${prevKeys[0]} ถึง ${prevKeys[prevKeys.length - 1]} มาใส่ ${curKeys[0]} ถึง ${curKeys[curKeys.length - 1]} รวม ${changes.length} ช่อง`
        + (overwriteCount > 0 ? ` (ทับของเดิม ${overwriteCount} ช่องที่มีค่าอยู่แล้ว — กด Ctrl+Z ได้ทีละช่องถ้าพลาด)` : ''),
        overwriteCount > 0, `คัดลอก ${changes.length} ช่อง`, previewList
    );
    if (!ok) return;

    changes.forEach(c => {
        pushUndo(c.key, c.oldVal);
        cellData[c.key] = c.newVal;
        markKeyDirty('cellData', c.key);
    });
    generateTable();
    showToast(`คัดลอกข้อมูลแล้ว ${changes.length} ช่อง`, 'success');
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
    // A4: 297x210mm - margin 5mm ต่อข้าง — สลับด้านยาว/สั้นตามแนวกระดาษที่เลือกในหน้า print preview
    const pageWidthPx = ((printOrientation === 'portrait' ? 210 : 297) - 10) * pxPerMm;
    const pageHeightPx = ((printOrientation === 'portrait' ? 297 : 210) - 10) * pxPerMm;
    let scale = Math.min(pageWidthPx / naturalWidth, pageHeightPx / naturalHeight, 1);
    if (!isFinite(scale) || scale <= 0) scale = 1;
    el.style.zoom = scale;
}

// ตั้ง @page ให้ตรงกับแนวกระดาษที่เลือก — ต้องแทรกเป็น <style> แยกเพราะ @page ไม่รับ class selector มาคุมเงื่อนไขได้ตรงๆ
function applyPrintOrientationCss(orientation) {
    let styleEl = document.getElementById('printOrientationOverride');
    if (!styleEl) { styleEl = document.createElement('style'); styleEl.id = 'printOrientationOverride'; document.head.appendChild(styleEl); }
    styleEl.textContent = orientation === 'portrait' ? '@media print { @page { size: A4 portrait; margin: 5mm; } }' : '';
}

// เตรียมหน้าให้พร้อมพิมพ์ (ซ่อน Model ว่าง + fit เข้า A4) — ใช้ร่วมกันทั้งตอนพิมพ์จริงและตอน preview ในโมดอล
// ซ่อนแถว Model ที่ไม่มีข้อมูล (ใช้ทั้งตอนพิมพ์และตอนกดปุ่ม "ซ่อน Model ว่าง" บนหน้าจอปกติ)
// hideClass = ชื่อ class ที่จะเติมให้แถวที่ต้องซ่อน, hideEmptyTotals = ให้ซ่อนแถว Total ที่ไม่มีค่าด้วยหรือไม่
function hideEmptyModelRows(hideClass, hideEmptyTotals) {
    document.querySelectorAll('#mainTable tbody').forEach(tbody => {
        let modelVisibleCount = 0;
        tbody.querySelectorAll('tr:not(.no-print)').forEach(row => {
            if (row.classList.contains('total-row') || row.classList.contains('hrs-row') || row.classList.contains('grp-band')) return;
            // ต้องเจาะจงแค่ input.table-input (ช่องกรอกจำนวนเครื่องต่อวัน) — ไม่งั้นช่อง OA%/MCT ในแถบหัวกลุ่มจะถูกนับเป็น "มีข้อมูล" ไปด้วย
            let inputs = row.querySelectorAll('input.table-input[type="number"]'); let hasData = Array.from(inputs).some(inp => inp.value.trim() !== '' && parseFloat(inp.value) !== 0);
            if (!hasData && inputs.length > 0) row.classList.add(hideClass);
            else modelVisibleCount++;
        });
        // กลุ่มที่ไม่เหลือ Model ให้เห็นเลย ซ่อนแถบหัวกลุ่มด้วย (แถว Total ยังอยู่ เพราะอาจรวมข้อมูลจากกลุ่มอื่น)
        const band = tbody.querySelector('tr.grp-band');
        if (band && modelVisibleCount === 0) band.classList.add(hideClass);
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
        const res = await fetch('/api/heartbeat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clientId: getClientId(), username: currentUser ? currentUser.username : null }) });
        const data = await res.json();
        updateViewerCountUI(data.viewerCount, data.activeUsers);
    } catch (e) { /* ไม่ใช่ฟีเจอร์สำคัญ ปล่อยเงียบถ้าพลาด */ }
}
let lastKnownActiveUsers = [];
function updateViewerCountUI(count, activeUsers) {
    const wrap = document.getElementById('viewerCount'); const num = document.getElementById('viewerCountNum');
    if (!wrap || !num || typeof count !== 'number') return;
    num.innerText = count;
    wrap.style.display = count >= 1 ? 'flex' : 'none';
    if (Array.isArray(activeUsers)) { lastKnownActiveUsers = activeUsers; renderViewerPanel(); }
}
function renderViewerPanel() {
    const list = document.getElementById('viewerPanelList');
    if (!list) return;
    if (lastKnownActiveUsers.length === 0) { list.innerHTML = '<div class="bell-empty">ไม่มีใครเปิดอยู่</div>'; return; }
    list.innerHTML = lastKnownActiveUsers.map(u => `
        <div class="viewer-item"><i class="fas fa-circle"></i> ${u ? `<span class="viewer-name">${u}</span>` : `<span class="viewer-anon">ไม่ได้ login</span>`}</div>
    `).join('');
}
function toggleViewerPanel() {
    const panel = document.getElementById('viewerPanel');
    if (!panel) return;
    const isOpen = panel.style.display !== 'none';
    panel.style.display = isOpen ? 'none' : 'block';
    if (!isOpen) renderViewerPanel();
}
document.addEventListener('click', (e) => {
    const wrap = document.getElementById('viewerCount');
    const panel = document.getElementById('viewerPanel');
    if (wrap && panel && panel.style.display !== 'none' && !wrap.contains(e.target)) panel.style.display = 'none';
});

// === ค้นหา/กรอง Model ===
function filterModels(query) {
    const q = query.trim().toLowerCase();
    if (currentProcess === 'Stock') {
        renderStockPage(); // การกรอง/ไฮไลต์ตามคำค้นหาทำอยู่ในนี้แล้ว (กางทุกกลุ่มให้อัตโนมัติตอนกำลังค้นหา)
        return;
    }
    // กำลังค้นหาอยู่ให้กางทุกกลุ่มชั่วคราว ไม่งั้น Model ที่ค้นเจอในกลุ่มที่พับไว้จะไม่โผล่
    document.getElementById('mainTable').classList.toggle('searching', !!q);
    document.querySelectorAll('#mainTable tbody tr').forEach(row => {
        if (row.classList.contains('total-row') || row.classList.contains('hrs-row') || row.classList.contains('no-print') || row.classList.contains('grp-band')) return;
        const name = row.dataset.modelName || '';
        if (!name) return;
        row.style.display = (!q || name.toLowerCase().includes(q)) ? '' : 'none';
    });
}

// === Undo / Redo สำหรับช่องจำนวนเครื่อง (Ctrl+Z / Ctrl+Y) ===
let undoStack = []; let redoStack = [];
function pushUndo(key, oldValue) {
    undoStack.push({ key, oldValue });
    if (undoStack.length > 50) undoStack.shift();
    redoStack = [];
    updateUndoRedoBtnUI();
}
function undoEdit() {
    if (!isAdmin || undoStack.length === 0) return;
    const op = undoStack.pop();
    redoStack.push({ key: op.key, oldValue: cellData[op.key] || '' });
    if (op.oldValue) cellData[op.key] = op.oldValue; else delete cellData[op.key];
    markKeyDirty('cellData', op.key); generateTable();
    showToast('เลิกทำ (Undo) แล้ว', 'info', 1800);
    updateUndoRedoBtnUI();
}
function redoEdit() {
    if (!isAdmin || redoStack.length === 0) return;
    const op = redoStack.pop();
    undoStack.push({ key: op.key, oldValue: cellData[op.key] || '' });
    if (op.oldValue) cellData[op.key] = op.oldValue; else delete cellData[op.key];
    markKeyDirty('cellData', op.key); generateTable();
    showToast('ทำซ้ำ (Redo) แล้ว', 'info', 1800);
    updateUndoRedoBtnUI();
}
function updateUndoRedoBtnUI() {
    const undoBtn = document.getElementById('undoBtn'); const redoBtn = document.getElementById('redoBtn');
    if (undoBtn) undoBtn.disabled = undoStack.length === 0;
    if (redoBtn) redoBtn.disabled = redoStack.length === 0;
}
document.addEventListener('keydown', (e) => {
    if (!isAdmin || document.querySelector('.modal-overlay')) return;
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && !e.shiftKey && k === 'z') { e.preventDefault(); undoEdit(); }
    else if ((e.ctrlKey || e.metaKey) && (k === 'y' || (e.shiftKey && k === 'z'))) { e.preventDefault(); redoEdit(); }
});

// Ctrl/Cmd+K โฟกัสช่องค้นหา Model ทันทีจากทุกที่ (ใช้ได้ทุกคน ไม่ต้อง login เพราะแค่ค้นหา/กรองข้อมูลดู ไม่ใช่แก้ไข)
// ใช้ได้เฉพาะหน้าที่มีช่องค้นหาแสดงอยู่จริง (Stock กับหน้า process ต่างๆ) หน้า Home ไม่มีช่องนี้เลยข้ามไป
document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() !== 'k' || !(e.ctrlKey || e.metaKey) || document.querySelector('.modal-overlay')) return;
    const search = document.getElementById('searchInput');
    if (!search || search.style.display === 'none') return;
    e.preventDefault();
    search.focus();
    search.select();
});

// === เลื่อนช่องกรอกด้วยลูกศร แบบ Excel ===
function handleCellArrowNav(e, currentInput) {
    // Enter ทำงานเหมือน ArrowDown (แบบ Excel) — เลื่อนโฟกัสลงแถวถัดไปในคอลัมน์เดียวกัน การ blur จากการเลื่อนโฟกัสจะยิง onchange บันทึกค่าเดิมให้เองอัตโนมัติ
    if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter'].includes(e.key)) return;
    // ตัดช่อง Hrs/Day รวมออก และตัดช่องของแถวที่ถูกซ่อนออกด้วย (เช่นตอนเปิด "ซ่อน Model ว่าง") ไม่งั้นลูกศรจะข้ามเกินแถวที่มองเห็นจริง
    const allInputs = Array.from(document.querySelectorAll('#mainTable .table-input:not(.hrs-input-all)'))
        .filter(inp => inp.offsetParent !== null);
    const idx = allInputs.indexOf(currentInput);
    if (idx === -1) return;
    let targetIdx = idx;
    if (e.key === 'ArrowLeft') targetIdx = idx - 1;
    else if (e.key === 'ArrowRight') targetIdx = idx + 1;
    else if (e.key === 'ArrowUp') targetIdx = idx - viewDays;
    else if (e.key === 'ArrowDown' || e.key === 'Enter') targetIdx = idx + viewDays;
    const target = allInputs[targetIdx];
    if (target) { e.preventDefault(); target.focus(); target.select(); }
}

// === เลือกหลายช่องพร้อมกันแบบ Excel (ลากคลุมด้วยเมาส์ ไฮไลต์สีฟ้า) แล้ว Ctrl+C/Ctrl+V ย้ายไปวันอื่นได้ทีเดียว ===
// ไม่ได้ทำเป็นลากแล้ววางตรงๆ (drag-and-drop) เพราะซับซ้อนและเสี่ยงชนกับการคลิกแก้ไขช่องปกติ — ใช้ Ctrl+C/V แทนซึ่งงานเดียวกับที่วาง Excel ทำได้อยู่แล้ว (handleCellPaste) เลยต่อยอดจากของเดิมได้เลย ไม่ต้องเขียนตรรกะวางใหม่
let cellSelectAnchor = null; // ช่องที่เริ่มลาก
let isCellSelecting = false; // true ระหว่างกดเมาส์ค้างอยู่ (ยังไม่ปล่อย)
let selectedCells = []; // ช่องที่ถูกเลือกอยู่ตอนนี้ เรียงตามแถว/คอลัมน์จริง (row-major) ให้ตรงกับ selectionCols เวลาสร้างข้อความ copy
let selectionCols = 0; // ความกว้าง (จำนวนคอลัมน์) ของสี่เหลี่ยมที่เลือกอยู่ ใช้ตัดขึ้นบรรทัดใหม่ตอน build ข้อความ copy

function getVisibleTableInputs() {
    return Array.from(document.querySelectorAll('#mainTable .table-input:not(.hrs-input-all)')).filter(inp => inp.offsetParent !== null);
}
function clearCellSelection() {
    selectedCells.forEach(el => el.classList.remove('cell-selected'));
    selectedCells = []; selectionCols = 0; cellSelectAnchor = null;
}
// เลือกเป็น "สี่เหลี่ยม" ระหว่าง anchor กับช่องที่ลากถึงตอนนี้ ไม่ใช่แค่ index ต่อเนื่องกัน เพราะลากข้ามแถวในคอลัมน์เดียวกัน index แบบเรียงจะห่างกันทีละ viewDays ไม่ติดกัน
function selectCellRange(startEl, endEl) {
    const all = getVisibleTableInputs();
    const startIdx = all.indexOf(startEl); const endIdx = all.indexOf(endEl);
    if (startIdx === -1 || endIdx === -1) return;
    const startRow = Math.floor(startIdx / viewDays), startCol = startIdx % viewDays;
    const endRow = Math.floor(endIdx / viewDays), endCol = endIdx % viewDays;
    const rowMin = Math.min(startRow, endRow), rowMax = Math.max(startRow, endRow);
    const colMin = Math.min(startCol, endCol), colMax = Math.max(startCol, endCol);
    selectedCells.forEach(el => el.classList.remove('cell-selected'));
    selectedCells = []; selectionCols = colMax - colMin + 1;
    for (let r = rowMin; r <= rowMax; r++) {
        for (let c = colMin; c <= colMax; c++) {
            const el = all[r * viewDays + c];
            if (el) { el.classList.add('cell-selected'); selectedCells.push(el); }
        }
    }
}
function handleCellSelectStart(el) {
    clearCellSelection();
    cellSelectAnchor = el; isCellSelecting = true;
}
function handleCellSelectDrag(el) {
    if (!isCellSelecting || !cellSelectAnchor) return;
    selectCellRange(cellSelectAnchor, el);
    if (selectedCells.length > 1 && document.activeElement && document.activeElement !== el) document.activeElement.blur(); // หลุดโฟกัสตัวพิมพ์ ไม่งั้นดูเหมือนกำลังจะพิมพ์ทับช่องเดียวทั้งที่เลือกไว้หลายช่อง
}
document.addEventListener('mouseup', () => { isCellSelecting = false; });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && selectedCells.length > 0) clearCellSelection(); });
document.addEventListener('copy', (e) => {
    if (selectedCells.length < 2 || !selectionCols || document.querySelector('.modal-overlay')) return; // ปล่อยให้ copy ปกติทำงานถ้าเลือกช่องเดียวหรือน้อยกว่านั้น (เช่น copy ข้อความในช่องตามปกติ)
    const clipboard = e.clipboardData || window.clipboardData;
    if (!clipboard) return; // เบราว์เซอร์/บริบทนี้ไม่ให้เขียน clipboard ผ่าน event นี้ (เช่นถูกยิง event จำลองไม่ใช่ copy จริงจากผู้ใช้) ปล่อยผ่านไปเงียบๆ ดีกว่า error
    e.preventDefault();
    const rows = [];
    for (let i = 0; i < selectedCells.length; i += selectionCols) rows.push(selectedCells.slice(i, i + selectionCols).map(el => el.value || '').join('\t'));
    clipboard.setData('text/plain', rows.join('\n'));
    showToast(`คัดลอก ${selectedCells.length} ช่องแล้ว — คลิกช่องปลายทาง (เช่นวันถัดไป) แล้ว Ctrl+V เพื่อวาง`, 'success', 3500);
});

// วางข้อมูลที่ copy มาจาก Excel ได้เลย (รองรับหลายช่อง/หลายแถวพร้อมกัน คั่นด้วย tab/newline แบบมาตรฐาน)
// เริ่มวางจากช่องที่กำลังโฟกัสอยู่ ไล่ขวา = วันถัดไป, ไล่ลง = โมเดลถัดไป (ลำดับเดียวกับปุ่มลูกศร)
function handleCellPaste(e, currentInput) {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text');
    if (!text) return;
    let rows = text.replace(/\r/g, '').split('\n');
    while (rows.length && rows[rows.length - 1] === '') rows.pop(); // Excel มักแถมบรรทัดว่างท้ายสุดมาด้วย
    // ตัดช่อง Hrs/Day รวมออก และตัดช่องของแถวที่ถูกซ่อนออกด้วย (เช่นตอนเปิด "ซ่อน Model ว่าง")
    // เพราะแถวที่ซ่อนแค่ display:none ไม่ได้หายไปจาก DOM จริง ถ้านับรวมไปด้วยจะทำให้นับตำแหน่งแถวผิด วางเลื่อนเกินไปกว่าที่ตั้งใจ
    // (เช่น ก็อปมา 2 แถวที่มองเห็น แต่ไปวางทับแถวที่ 3-4 แทน เพราะมีแถวซ่อนแทรกอยู่ระหว่างนั้นแล้วนับรวมไปด้วย)
    const allInputs = Array.from(document.querySelectorAll('#mainTable .table-input:not(.hrs-input-all)'))
        .filter(inp => inp.offsetParent !== null);
    const startIdx = allInputs.indexOf(currentInput);
    if (startIdx === -1) return;

    // ปิดการคำนวณ Pcs/Total ทีละช่องระหว่าง paste (ถ้าวางทีละร้อยช่องจะช้ามาก) คำนวณรวดเดียวหลังวางเสร็จแทน
    const realCalcTotals = calcTotals;
    calcTotals = function () { };
    try {
        rows.forEach((rowText, rOffset) => {
            rowText.split('\t').forEach((cellText, cOffset) => {
                const target = allInputs[startIdx + rOffset * viewDays + cOffset];
                const val = cellText.trim();
                if (!target || target.readOnly || val === '') return;
                target.value = val;
                if (target.onchange) target.onchange();
            });
        });
    } finally {
        calcTotals = realCalcTotals;
    }
    calcTotals();
}

// === Export CSV (เปิดใน Excel ได้เลย) ===
function exportCSV() {
    const table = document.getElementById('mainTable');
    if (!table) return;
    const rows = [];
    table.querySelectorAll('tr').forEach(tr => {
        if (tr.classList.contains('no-print')) return;
        const cells = Array.from(tr.children).map(td => {
            // เซลล์ชื่อ Model มีป้าย/ไอคอนอื่นแปะอยู่ด้วย (เช่น ธงด่วน, ตัว drag handle, ป้ายชนิด/ทูลลิ่ง) ต้องประกอบชื่อจาก
            // .model-text + .model-variant-badge เองตามรูปแบบเดียวกับ parseModelDisplay/aiDisplayName ("ฐาน (ชนิด)")
            // ไม่งั้น innerText ธรรมดาจะเอาข้อความป้ายอื่นมาต่อติดกับชื่อ Model ทำให้ export ผิดไปจากชื่อจริง แล้วนำเข้ากลับไม่ได้
            const modelTextEl = td.querySelector('.model-text');
            let text;
            if (modelTextEl) {
                const variantEl = td.querySelector('.model-variant-badge');
                text = variantEl ? `${modelTextEl.innerText} (${variantEl.innerText})` : modelTextEl.innerText;
            } else {
                text = td.querySelector('input') ? td.querySelector('input').value : td.innerText.split('\n')[0];
            }
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

// === Import CSV (เติมจำนวนเครื่องหลาย Model/วันทีเดียวจากไฟล์ที่เปิดแก้ใน Excel ได้) ===
// รูปแบบไฟล์ที่รองรับ: แถวแรกเป็นหัวคอลัมน์ "Model,<วันที่1>,<วันที่2>,..." (วันที่ต้องเป็นรูปแบบเดียวกับที่ตารางแสดง เช่น "27-Aug")
// แถวถัดไป: ชื่อ Model (ต้องตรงกับที่มีอยู่ในระบบเป๊ะๆ) ตามด้วยค่าจำนวนเครื่องของแต่ละวัน — แถว/คอลัมน์ที่จับคู่ไม่ได้จะถูกข้ามไปเงียบๆ ไม่ error ทั้งไฟล์
const CSV_DATE_HEADER_RE = /^\d{1,2}-[A-Za-z]{3,4}$/;
function triggerImportCSV() {
    if (!isAdmin) return;
    document.getElementById('importCsvFile').click();
}
function parseCsvLine(line) {
    const result = []; let cur = ''; let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
        const c = line[i];
        if (inQuotes) {
            if (c === '"') { if (line[i + 1] === '"') { cur += '"'; i++; } else { inQuotes = false; } }
            else cur += c;
        } else {
            if (c === '"') inQuotes = true;
            else if (c === ',') { result.push(cur); cur = ''; }
            else cur += c;
        }
    }
    result.push(cur);
    return result;
}
async function handleImportCSVFile(event) {
    const file = event.target.files[0];
    event.target.value = ''; // เคลียร์ไว้ กันเลือกไฟล์เดิมซ้ำแล้ว change ไม่ยิง
    if (!file || !isAdmin) return;

    const text = await file.text();
    const lines = text.replace(/^﻿/, '').split(/\r?\n/).filter(l => l.trim() !== '');
    if (lines.length < 2) { showToast('ไฟล์ไม่มีข้อมูล หรือรูปแบบไม่ถูกต้อง', 'error'); return; }

    const header = parseCsvLine(lines[0]);
    const dateCols = header.slice(1).map(d => d.trim());

    // AI: CSV แสดง/รับชื่อ Model แบบ display (ไม่มี groupId ปน) — ต้องแปลงกลับเป็นชื่อดิบก่อนเขียนลง cellData
    // หมายเหตุ: ถ้า Model ชื่อเดียวกัน (display) ซ้ำกันข้าม 2 กลุ่มของ AI ไฟล์ CSV จะแยกไม่ออกว่าหมายถึงกลุ่มไหน (ไม่มีคอลัมน์กลุ่มในไฟล์) จะจับคู่ได้แค่กลุ่มล่าสุดที่เจอ
    const knownModels = new Map(); // displayName -> ชื่อดิบจริงที่ใช้เป็น key
    processConfig[currentProcess].groups.forEach(g => (modelState[g.id] || []).forEach(m => knownModels.set(aiDisplayName(currentProcess, m), m)));

    const updates = []; // { key, value }
    let skippedModelRows = 0;
    for (let r = 1; r < lines.length; r++) {
        const cells = parseCsvLine(lines[r]);
        const modelName = (cells[0] || '').trim();
        if (!modelName) continue;
        const rawModel = knownModels.get(modelName);
        if (!rawModel) { skippedModelRows++; continue; }
        dateCols.forEach((dateKey, i) => {
            if (!CSV_DATE_HEADER_RE.test(dateKey)) return; // หัวคอลัมน์ไม่ใช่รูปแบบวันที่ที่รู้จัก ข้ามทั้งคอลัมน์ กันเขียนลง key มั่ว
            const raw = (cells[i + 1] || '').trim();
            if (raw === '' || isNaN(raw)) return; // ข้ามช่องว่าง/ไม่ใช่ตัวเลข ไม่เขียนทับด้วยค่าว่างโดยไม่ตั้งใจ
            updates.push({ key: `${currentProcess}_${rawModel}_${dateKey}`, value: raw });
        });
    }

    if (updates.length === 0) {
        showToast(`ไม่พบข้อมูลที่นำเข้าได้ (Model ที่จับคู่ไม่ได้ ${skippedModelRows} แถว) — เช็คว่าชื่อ Model และรูปแบบวันที่ตรงกับในระบบไหม`, 'error', 6000);
        return;
    }

    const skipMsg = skippedModelRows > 0 ? ` (ข้าม ${skippedModelRows} แถวที่จับคู่ Model ไม่ได้)` : '';
    const cellCountByModel = new Map();
    updates.forEach(({ key }) => {
        const parsed = parseCellKeyExact(key);
        const name = aiDisplayName(currentProcess, parsed.model);
        cellCountByModel.set(name, (cellCountByModel.get(name) || 0) + 1);
    });
    const previewList = Array.from(cellCountByModel.entries()).map(([name, n]) => `${name} — ${n} ช่อง`);
    const ok = await showConfirmModal(`พบข้อมูล ${updates.length} ช่อง จะนำเข้าทับข้อมูลเดิมในช่องที่ตรงกันหรือไม่?${skipMsg}`, true, 'นำเข้า', previewList);
    if (!ok) return;

    updates.forEach(({ key, value }) => {
        pushUndo(key, cellData[key] || '');
        cellData[key] = value;
        markKeyDirty('cellData', key);
    });
    generateTable();
    showToast(`นำเข้าข้อมูลสำเร็จ ${updates.length} ช่อง (Ctrl+Z ทีละช่องได้ถ้าต้องยกเลิก)`, 'success', 5000);
}

// === Preview ก่อนพิมพ์จริง ===
function openPrintPreview() {
    // Overview/Stock ยังไม่มี layout สำหรับ preview พิเศษ (ไม่มี Model ให้ซ่อน) พิมพ์ตรงได้เลย
    if (currentProcess === 'Overview' || currentProcess === 'Stock') { window.print(); return; }
    const root = document.getElementById('printPreviewRoot');
    printPreviewParams = { process: currentProcess, viewDays, startDate: document.getElementById('startDatePicker').value };
    root.innerHTML = `
        <div class="print-preview-overlay" id="printPreviewOverlay">
            <div class="print-preview-box">
                <div class="print-preview-header">
                    <h3><i class="fas fa-file-pdf"></i> ตัวอย่างก่อนพิมพ์ — ${processConfig[currentProcess].title}</h3>
                    <div class="toggle-btn-group">
                        <button class="toggle-btn active" id="orientBtn-landscape" onclick="setPrintPreviewOrientation('landscape')">แนวนอน</button>
                        <button class="toggle-btn" id="orientBtn-portrait" onclick="setPrintPreviewOrientation('portrait')">แนวตั้ง</button>
                    </div>
                    <button class="btn-action" onclick="closePrintPreview()"><i class="fas fa-times"></i></button>
                </div>
                <div class="print-preview-body">
                    <iframe id="printPreviewIframe" src="${buildPrintPreviewSrc('landscape')}"></iframe>
                </div>
                <div class="print-preview-footer">
                    <button class="modal-btn modal-btn-cancel" onclick="closePrintPreview()">ปิด</button>
                    <button class="modal-btn modal-btn-confirm" onclick="confirmPrintFromPreview()"><i class="fas fa-print"></i> พิมพ์จริง</button>
                </div>
            </div>
        </div>`;
}
let printPreviewParams = null; // { process, viewDays, startDate } ของ preview ที่เปิดอยู่ตอนนี้ — ใช้สร้าง src ใหม่ตอนสลับแนวกระดาษ
function buildPrintPreviewSrc(orientation) {
    const p = printPreviewParams;
    return `${location.pathname}?process=${p.process}&viewDays=${p.viewDays}&startDate=${encodeURIComponent(p.startDate)}&orientation=${orientation}&forcePrintPreview=1`;
}
function setPrintPreviewOrientation(o) {
    const iframe = document.getElementById('printPreviewIframe');
    if (!iframe || !printPreviewParams) return;
    iframe.src = buildPrintPreviewSrc(o);
    document.getElementById('orientBtn-landscape').classList.toggle('active', o === 'landscape');
    document.getElementById('orientBtn-portrait').classList.toggle('active', o === 'portrait');
}
function closePrintPreview() { document.getElementById('printPreviewRoot').innerHTML = ''; printPreviewParams = null; }
function confirmPrintFromPreview() {
    const iframe = document.getElementById('printPreviewIframe');
    if (iframe && iframe.contentWindow) iframe.contentWindow.print();
}

// === โหมดจอรวม/ทีวี (Kiosk mode) — ค้างแสดงเฉพาะ process ที่เปิดอยู่ตอนกดเข้าโหมดนี้ (ไม่วนสลับหน้าแล้ว) เหมาะติดจอหน้าไลน์ผลิต ===
let kioskTimer = null;
const KIOSK_REFIT_MS = 2000; // เช็คซ้ำเรื่อยๆ เผื่อข้อมูลอัปเดตจาก poll แล้วความสูงเนื้อหาเปลี่ยน จะได้ย่อ/ขยายตามให้พอดีจอเสมอ

// ย่อทั้งหน้า (zoom) ให้พอดีกับขนาดจอ ไม่ต้องเลื่อนจอเลื่อนเมาส์ดูส่วนที่เกิน — เหมือน fitPrintToPage() แต่ fit กับขนาดหน้าจอแทนขนาดกระดาษ A4
function fitKioskToScreen() {
    const el = document.querySelector('.dashboard-container');
    if (!el) return;
    el.style.zoom = '1';
    const naturalWidth = el.scrollWidth;
    const naturalHeight = el.scrollHeight;
    let scale = Math.min(window.innerWidth / naturalWidth, window.innerHeight / naturalHeight, 1);
    if (!isFinite(scale) || scale <= 0) scale = 1;
    el.style.zoom = scale * 0.97; // เผื่อ margin กันปัดเศษ/scrollbar เกินพิกเซลจนต้องเลื่อนจออยู่ดี
}

function enterKioskMode() {
    document.body.classList.add('kiosk-mode');
    // กันเผื่อไว้: ฉากหลังมืดของเมนู "เพิ่มเติม"/แจ้งเตือน อยู่นอก .app-sidebar (ไม่โดนซ่อนไปตาม sidebar ตอนเข้าโหมดจอรวม) ถ้าค้างเปิดอยู่จะกลายเป็นเทาทึบคลุมทั้งจอ
    document.querySelectorAll('#bellPanel, #moreMenuPanel').forEach(p => { p.style.display = 'none'; });
    syncMenuBackdrop();
    if (document.documentElement.requestFullscreen) { document.documentElement.requestFullscreen().catch(() => { /* ต้องมาจาก user gesture เท่านั้น ถ้าไม่ได้ก็ไม่เป็นไร */ }); }
    fitKioskToScreen();
    if (kioskTimer) clearInterval(kioskTimer);
    kioskTimer = setInterval(fitKioskToScreen, KIOSK_REFIT_MS);
    showToast('เข้าโหมดจอรวมแล้ว (เฉพาะหน้านี้) — กด Esc เพื่อออก', 'info', 3000);
}

function exitKioskMode() {
    document.body.classList.remove('kiosk-mode');
    if (kioskTimer) { clearInterval(kioskTimer); kioskTimer = null; }
    const el = document.querySelector('.dashboard-container');
    if (el) el.style.zoom = '';
    if (document.fullscreenElement && document.exitFullscreen) document.exitFullscreen().catch(() => {});
}

function toggleKioskMode() {
    if (document.body.classList.contains('kiosk-mode')) exitKioskMode(); else enterKioskMode();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('kiosk-mode')) exitKioskMode();
});

// === Boot ===
// เมนู/เครื่องมือทั้งหมดอยู่ใน sidebar ซ้าย แต่ยังเขียนไว้ใน .controls-area ที่เดิมใน HTML
// เพื่อให้ทุก id/onclick เดิมใช้ได้เหมือนเดิมทั้งหมด — ย้ายทั้งก้อนมาไว้ใน sidebar ตอนเปิดหน้าแทน
function mountControlsIntoSidebar() {
    const tools = document.getElementById('sidebarTools');
    const controls = document.querySelector('.controls-area');
    if (tools && controls) tools.appendChild(controls);
    // กดเลือกอะไรก็ตามในเมนู "เพิ่มเติม" (Export/Import/PDF/ลบข้อมูลช่วงวันที่/เคล็ดลับ) ให้เมนูปิดตัวเองไปด้วยเลย
    // ไม่งั้นถ้าการกระทำนั้นเปลี่ยนหน้าจอไปเยอะ (เช่นเคยมีปุ่มโหมดจอทีวีอยู่ตรงนี้มาก่อน) เมนู+ฉากหลังมืดจะค้างอยู่ทับหน้าใหม่โดยไม่มีอะไรไปปิดให้
    document.querySelectorAll('#moreMenuPanel .more-menu-item').forEach(btn => {
        btn.addEventListener('click', () => { document.getElementById('moreMenuPanel').style.display = 'none'; syncMenuBackdrop(); });
    });
}

function toggleSidebar() {
    document.getElementById('appSidebar').classList.toggle('open');
}

async function boot() {
    updateLangBtnUI();
    applyStaticLangText();
    applyDarkMode();
    mountControlsIntoSidebar();
    const ok = await loadStateFromServer();
    if (!ok) showToast('เชื่อมต่อ server ไม่ได้ ตรวจสอบว่า server เปิดอยู่หรือไม่', 'error', 6000);
    document.getElementById('startDatePicker').addEventListener('change', handleDateChange);
    updateAdminUI();
    updateHideEmptyBtnUI();
    const params = new URLSearchParams(location.search);
    const requestedProcess = params.get('process');
    const startProcess = ['Overview', 'Stock', 'BW', 'LC', 'CW', 'AI'].includes(requestedProcess) ? requestedProcess : 'Overview';
    const requestedViewDays = parseInt(params.get('viewDays'), 10);
    if ([1, 7, 30].includes(requestedViewDays)) viewDays = requestedViewDays;
    // ค่าเริ่มต้นของวันที่: ถ้ามี startDate ใน URL (มาจากหน้า print preview) ใช้ค่านั้น ไม่งั้น default เป็น "วันนี้" เสมอ
    // ทุกครั้งที่เปิดหน้าใหม่/รีเฟรช แทนที่จะค้างอยู่ที่ค่า value เริ่มต้นที่ตายตัวใน index.html ซึ่งจะเก่าไปเรื่อยๆ ตามวันที่ผ่านไป
    const requestedStartDate = params.get('startDate');
    if (requestedStartDate && isValidISODate(requestedStartDate)) {
        document.getElementById('startDatePicker').value = requestedStartDate;
    } else {
        document.getElementById('startDatePicker').value = toISODateLocal(new Date());
    }
    switchProcess(startProcess, true); // true = ข้าม skeleton, ให้สร้างตาราง/หน้าแรกแบบ synchronous ทันที (boot() คุม loadingOverlay เองอยู่แล้ว และ forcePrintPreview ด้านล่างต้องการตารางที่สร้างเสร็จแล้วจริงๆ)
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.style.display = 'none';

    // โหมด preview ก่อนพิมพ์จริง — เปิดผ่าน iframe จาก openPrintPreview() โดยเพิ่ม query นี้
    // เป็น snapshot นิ่งๆ ไว้ดูก่อนพิมพ์เท่านั้น — "ไม่" เริ่ม polling/heartbeat เพราะถ้ามีข้อมูลใหม่เข้ามาแล้ว
    // generateTable() ถูกเรียกซ้ำ จะไปลบสถานะ hide-on-print ที่เพิ่งซ่อน Model/Total ว่างๆ ไว้ทิ้งไปเฉยๆ
    if (params.get('forcePrintPreview') === '1') {
        printOrientation = params.get('orientation') === 'portrait' ? 'portrait' : 'landscape';
        applyPrintOrientationCss(printOrientation);
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

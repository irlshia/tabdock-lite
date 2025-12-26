// --- 1. 定数と初期設定 ---
const defaultRawData = "05:40,普通(多治見)\n05:58,普通(瑞浪)\n06:13,普通\n06:23,普通(多治見)\n06:33,普通(土岐市)\n06:43,快速\n06:52,普通(多治見)\n07:02,特急しなの(長野)\n07:11,普通(多治見)\n07:19,普通\n07:27,普通(高蔵寺)\n07:35,快速\n07:43,普通(多治見)\n07:51,普通(高蔵寺)\n08:02,特急しなの(長野)\n08:04,普通(高蔵寺)\n08:08,普通(神領)\n08:14,普通(多治見)\n08:18,普通(高蔵寺)\n08:22,普通\n08:26,普通(高蔵寺)\n08:34,普通\n08:43,普通(神領)\n08:52,普通(高蔵寺)\n09:02,特急しなの(長野)\n09:09,普通(多治見)\n09:16,普通(高蔵寺)\n09:23,普通(神領)\n09:31,快速\n09:36,普通(瑞浪)\n09:45,普通(高蔵寺)\n09:52,区間快速\n10:02,特急しなの(長野)\n10:10,普通(多治見)\n10:18,区間快速\n10:26,普通(高蔵寺)\n10:34,普通(多治見)\n10:42,区間快速\n10:52,普通(高蔵寺)\n11:02,特急しなの(長野)\n11:12,普通(多治見)\n11:22,区間快速\n11:32,普通(多治見)\n11:42,区間快速\n11:52,普通(高蔵寺)\n12:02,特急しなの(長野)\n12:12,普通(多治見)\n12:22,区間快速\n12:32,普通(多治見)\n12:42,区間快速\n12:52,普通(高蔵寺)\n13:02,特急しなの(長野)\n13:12,普通(多治見)\n13:22,区間快速\n13:32,普通(多治見)\n13:42,区間快速\n13:52,普通(高蔵寺)\n14:02,特急しなの(長野)\n14:12,普通(多治見)\n14:22,区間快速\n14:32,普通(多治見)\n14:42,区間快速\n14:52,普通(高蔵寺)\n15:02,特急しなの(長野)\n15:12,普通(多治見)\n15:20,区間快速\n15:28,普通(高蔵寺)\n15:36,普通(多治見)\n15:44,区間快速\n15:52,普通(高蔵寺)\n16:02,特急しなの(長野)\n16:09,普通(瑞浪)\n16:16,普通(高蔵寺)\n16:24,快速\n16:31,普通(多治見)\n16:38,普通(高蔵寺)\n16:45,快速\n16:52,普通(高蔵寺)\n17:07,普通(瀬戸口)\n17:13,快速\n17:20,普通(多治見)\n17:26,普通(高蔵寺)\n17:33,快速\n17:40,普通(多治見)\n17:42,普通(高蔵寺)\n17:48,快速\n17:53,普通(多治見)\n17:57,ホームライナー(瑞浪)\n18:07,普通(瀬戸口)\n18:13,快速\n18:20,普通(多治見)\n18:26,普通(高蔵寺)\n18:33,快速\n18:40,普通(多治見)\n18:42,普通(高蔵寺)\n18:48,快速\n18:54,普通(多治見)\n19:07,普通(瀬戸口)\n19:13,快速\n19:20,普通(多治見)\n19:26,普通(高蔵寺)\n19:33,快速\n19:40,普通(多治見)\n19:42,普通(高蔵寺)\n19:48,快速\n19:54,普通(多治見)\n20:07,普通(瀬戸口)\n20:13,快速\n20:20,普通(多治見)\n20:26,普通(高蔵寺)\n20:34,快速\n20:38,ホームライナー(瑞浪)\n20:42,普通(高蔵寺)\n20:48,快速\n20:54,普通(多治見)\n21:07,普通(高蔵寺)\n21:14,快速\n21:21,普通(瑞浪)\n21:28,普通(高蔵寺)\n21:36,普通(多治見)\n21:44,快速\n21:52,普通(土岐市)\n22:07,普通(高蔵寺)\n22:17,快速\n22:27,普通(瑞浪)\n22:37,普通(多治見)\n22:46,快速\n22:56,普通(土岐市)\n23:07,快速\n23:19,普通(多治見)\n23:31,普通(瑞浪)\n23:43,普通(多治見)\n23:57,普通(瑞浪)\n00:05,普通(高蔵寺)";

window.config = { userName: "User", city: "nagoya", rssUrl: "", stationName: "Next Trains" };
window.trainData = [];

// --- 2. 時刻表システム (独立管理) ---

window.loadTrainData = function () {
    const saved = localStorage.getItem('echo_train_data');
    if (saved) {
        window.trainData = JSON.parse(saved);
    } else {
        // 初期データがない場合は金山駅データを解析してセット
        window.trainData = defaultRawData.split('\n').map(line => {
            const [time, type] = line.split(',');
            return { time: (time || "").trim(), type: (type || "普通").trim() };
        }).filter(item => item.time.includes(':'));
        window.saveTrainData();
    }
    window.renderTouchTrainList();
    window.updateTrainSchedule();
};

window.saveTrainData = function () {
    window.trainData.sort((a, b) => a.time.localeCompare(b.time));
    localStorage.setItem('echo_train_data', JSON.stringify(window.trainData));
};

window.updateTrainSchedule = function () {
    const listContainer = document.getElementById('train-list');
    if (!listContainer) return;

    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const nextTrains = window.trainData
        .filter(train => train.time > currentTime)
        .sort((a, b) => a.time.localeCompare(b.time))
        .slice(0, 5);

    if (nextTrains.length === 0) {
        listContainer.innerHTML = '<div style="padding:20px; text-align:center; opacity:0.6; font-size:0.8rem; color:white;">本日の運行は終了しました</div>';
        return;
    }

    const newHtml = nextTrains.map(train => {
        const [h, m] = train.time.split(':');
        const trainTime = new Date();
        trainTime.setHours(parseInt(h), parseInt(m), 0);
        const diffMs = trainTime - now;
        const diffMin = Math.ceil(diffMs / 60000);

        let typeColor = "#999";
        if (train.type.includes("快速") || train.type.includes("区快")) typeColor = "#0072bc";
        else if (train.type.match(/特急|ライナー|ホームライナー/)) typeColor = "#e60012";

        return `
            <div class="train-item" style="border-left: 6px solid ${typeColor}; background: rgba(255,255,255,0.06); margin-bottom: 10px; padding: 15px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; color: white;">
                <div style="flex: 1;">
                    <div style="font-size: 0.8rem; color: ${typeColor}; font-weight: 800; letter-spacing: 0.05em;">${train.type}</div>
                    <div style="font-size: 1.8rem; font-weight: 900; line-height: 1.1;">${train.time}</div>
                </div>
                <div style="text-align: right; min-width: 80px;">
                    <div style="font-size: 0.75rem; opacity: 0.5; margin-bottom: -2px;">あと</div>
                    <div style="font-size: 1.4rem; font-weight: 800; color: ${diffMin <= 3 ? '#ff4757' : '#00ff88'};">
                        ${diffMin <= 0 ? '<span style="font-size:1.1rem">まもなく</span>' : diffMin + '<span style="font-size:0.8rem; margin-left:2px;">分</span>'}
                    </div>
                </div>
            </div>`;
    }).join('');

    if (listContainer.innerHTML !== newHtml) {
        listContainer.innerHTML = newHtml;
    }
};

window.addTrainFromTouch = function () {
    const timeInput = document.getElementById('input-train-time');
    const typeInput = document.getElementById('input-train-type');
    if (!timeInput || !timeInput.value) return;

    window.trainData.push({ time: timeInput.value, type: typeInput.value || "普通" });
    window.saveTrainData();
    window.renderTouchTrainList();
    window.updateTrainSchedule();
};

window.removeTrain = function (index) {
    window.trainData.splice(index, 1);
    window.saveTrainData();
    window.renderTouchTrainList();
    window.updateTrainSchedule();
};

window.renderTouchTrainList = function () {
    const listContainer = document.getElementById('touch-train-list');
    if (!listContainer) return;
    listContainer.innerHTML = window.trainData.length ? window.trainData.map((t, i) => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: white;">
            <span><strong>${t.time}</strong> [${t.type}]</span>
            <button onclick="removeTrain(${i})" style="background:none; border:none; color:#ff4757; cursor:pointer; font-weight:bold;">削除</button>
        </div>`).join('') : '<div style="color:#666; padding:10px;">登録なし</div>';
};

// --- 3. 一般設定システム (config) ---

window.loadSettings = function () {
    const saved = localStorage.getItem('echo_config');
    if (saved) window.config = JSON.parse(saved);

    const setV = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ""; };
    setV('set-username', window.config.userName);
    setV('set-city', window.config.city);
    setV('set-rss', window.config.rssUrl);
    setV('set-station', window.config.stationName);

    if (typeof applyConfig === 'function') applyConfig();
    if (typeof fetchWeather === 'function') fetchWeather();
};

window.autoSave = function () {
    const getV = (id) => document.getElementById(id) ? document.getElementById(id).value.trim() : "";
    window.config.userName = getV('set-username') || "User";
    window.config.city = getV('set-city') || "nagoya";
    window.config.rssUrl = getV('set-rss') || "";
    window.config.stationName = getV('set-station') || "";

    localStorage.setItem('echo_config', JSON.stringify(window.config));

    const loc = document.querySelector('.location');
    if (loc) loc.textContent = window.config.city;

    if (typeof applyConfig === 'function') applyConfig();
    if (typeof fetchWeather === 'function') fetchWeather();
    window.updateTrainSchedule();
};

// --- 4. 起動とタイマー ---

window.addEventListener('DOMContentLoaded', () => {
    window.loadSettings();
    window.loadTrainData();

    // 設定変更の監視
    ['set-username', 'set-city', 'set-rss', 'set-station'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', window.autoSave);
    });

    // 30秒ごとにカウントダウン更新
    setInterval(window.updateTrainSchedule, 30000);
});
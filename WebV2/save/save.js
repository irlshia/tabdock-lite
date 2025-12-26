// --- save.js ---

// グローバル変数の初期化
let config = { userName: "User", city: "Tokyo", rssUrl: "", stationName: "新宿駅" };
console.log("[Save] Script loaded. Default config initialized:", config);

/**
 * 設定のロード
 */
window.loadSettings = function () {
    console.log("[Save] loadSettings start");
    const saved = localStorage.getItem('echo_config');

    if (saved) {
        config = JSON.parse(saved);
        window.echoConfig = config;
        console.log("[Save] Data found in localStorage:", config);
    } else {
        console.log("[Save] No saved data found. Using defaults.");
    }

    // フォームへの反映
    const setVal = (id, value) => {
        const el = document.getElementById(id);
        if (el) {
            el.value = value || "";
            console.log(`[Save] Input updated: ${id} = "${el.value}"`);
        } else {
            console.warn(`[Save] Input element not found: ${id}`);
        }
    };

    setVal('set-username', config.userName);
    setVal('set-rss', config.rssUrl);
    setVal('set-city', config.city);
    setVal('set-station', config.stationName);

    // 画面表示（地域名）の初期同期
    const locationEl = document.querySelector('.location');
    if (locationEl) {
        locationEl.textContent = config.city;
        console.log("[Save] UI Location updated:", config.city);
    }

    console.log("[Save] loadSettings finished");
};

/**
 * 自動保存処理
 */
window.autoSave = function () {
    console.log("[Save] autoSave triggered");

    const getVal = (id) => {
        const el = document.getElementById(id);
        const val = el ? el.value.trim() : "";
        return val;
    };

    // フォームから値を取得して config を更新
    config.userName = getVal('set-username') || "User";
    config.rssUrl = getVal('set-rss');
    config.city = getVal('set-city') || "Tokyo";
    config.stationName = getVal('set-station') || "新宿駅";

    console.log("[Save] New values to save:", config);

    // ローカルストレージに保存
    localStorage.setItem('echo_config', JSON.stringify(config));
    window.echoConfig = config; // グローバル変数も同期
    console.log("[Save] localStorage.setItem completed");

    // 画面に即時反映
    const locationEl = document.querySelector('.location');
    if (locationEl) {
        locationEl.textContent = config.city;
        console.log("[Save] UI Location sync:", config.city);
    }

    // 各ウィジェットを即座に更新
    console.log("[Save] Triggering widget updates...");

    if (typeof fetchTodayEvent === 'function') {
        console.log("[Save] Calling fetchTodayEvent()");
        fetchTodayEvent();
    }
    if (typeof applyConfig === 'function') {
        console.log("[Save] Calling applyConfig()");
        applyConfig();
    }
    if (typeof fetchWeather === 'function') {
        console.log("[Save] Calling fetchWeather()");
        fetchWeather();
    }
    if (typeof updateTrainSchedule === 'function') {
        console.log("[Save] Calling updateTrainSchedule()");
        updateTrainSchedule();
    }

    console.log("[Save] autoSave finished");
};

/**
 * 自動保存の監視設定
 */
window.initAutoSave = function () {
    console.log("[Save] initAutoSave start");
    const ids = ['set-username', 'set-rss', 'set-city', 'set-station'];

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            console.log(`[Save] Attaching listeners to: ${id}`);
            // 重複登録防止のため一度消してから登録
            el.removeEventListener('input', window.autoSave);
            el.addEventListener('input', window.autoSave);

            el.removeEventListener('change', window.autoSave);
            el.addEventListener('change', window.autoSave);
        } else {
            console.warn(`[Save] Could not attach listener. Element not found: ${id}`);
        }
    });
    console.log("[Save] initAutoSave finished");
};
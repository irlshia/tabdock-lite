// --- settings.js (モーダル・タブ制御) ---

const modal = document.getElementById('settings-modal');

function toggleSettings() {
    console.log("[Settings] toggleSettings start");
    if (!modal) {
        console.error("[Settings] Error: #settings-modal not found");
        return;
    }

    const isVisible = modal.style.display === 'flex';
    modal.style.display = isVisible ? 'none' : 'flex';

    console.log("[Settings] Modal visibility changed to:", modal.style.display);
}

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            console.log("[Settings] Overlay clicked, closing modal");
            toggleSettings();
        }
    });
}

function switchTab(tabName, event) {
    console.log("[Settings] switchTab start:", tabName);

    // すべてのコンテンツを非表示に
    const contents = document.querySelectorAll('.tab-content');
    const navItems = document.querySelectorAll('.nav-item');

    console.log(`[Settings] Cleaning up ${contents.length} tabs and ${navItems.length} nav items`);

    contents.forEach(tab => tab.classList.remove('active'));
    navItems.forEach(nav => nav.classList.remove('active'));

    // 選択されたタブを表示
    const targetTab = document.getElementById('tab-' + tabName);
    if (targetTab) {
        targetTab.classList.add('active');
        console.log("[Settings] Tab content activated:", 'tab-' + tabName);
    } else {
        console.warn("[Settings] Warning: Target tab content not found:", 'tab-' + tabName);
    }

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
        console.log("[Settings] Nav item activated");
    }

    // 「情報」タブが選ばれたら中身を更新
    if (tabName === 'info') {
        console.log("[Settings] Info tab selected, triggering updateSystemInfo");
        updateSystemInfo();
    }

    console.log("[Settings] switchTab finished");
}

function updateSystemInfo() {
    console.log("[SystemInfo] updateSystemInfo start");

    // 稼働時間 (uptime)
    const uptimeEl = document.getElementById('sys-uptime');
    if (uptimeEl) {
        const now = new Date();
        uptimeEl.textContent = now.toLocaleTimeString();
        console.log("[SystemInfo] Uptime updated:", uptimeEl.textContent);
    } else {
        console.warn("[SystemInfo] #sys-uptime element not found");
    }

    // 解像度 (res)
    const resEl = document.getElementById('sys-res');
    if (resEl) {
        resEl.textContent = `${window.screen.width} x ${window.screen.height}`;
        console.log("[SystemInfo] Resolution updated:", resEl.textContent);
    } else {
        console.warn("[SystemInfo] #sys-res element not found");
    }

    // ユーザーエージェント (ua)
    const uaEl = document.getElementById('sys-ua');
    if (uaEl) {
        uaEl.textContent = navigator.userAgent;
        console.log("[SystemInfo] UA updated");
    } else {
        console.warn("[SystemInfo] #sys-ua element not found");
    }

    console.log("[SystemInfo] updateSystemInfo finished");
}
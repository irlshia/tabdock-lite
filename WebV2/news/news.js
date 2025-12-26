// --- news.js ---
// 変数が未定義なら初期化（二重宣言防止）
if (typeof newsHeadlines === 'undefined') window.newsHeadlines = [];
if (typeof newsIndex === 'undefined') window.newsIndex = 0;

async function applyConfig() {
    console.log("[News] applyConfig start");

    // 要素をその場で取得し直す（確実に存在を確認するため）
    const newsTextEl = document.getElementById('news-text');
    const cfg = window.echoConfig || window.config || { rssUrl: "" };

    if (!newsTextEl) {
        console.error("[News] #news-text not found in DOM");
        return;
    }

    if (!cfg.rssUrl) {
        console.warn("[News] RSS URL is empty.");
        newsTextEl.textContent = "RSS URLを設定してください";
        return;
    }

    try {
        const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(cfg.rssUrl)}`;
        const response = await fetch(proxyUrl);
        const xmlString = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        const items = xmlDoc.querySelectorAll("item");

        if (items.length > 0) {
            window.newsHeadlines = Array.from(items).map(i => i.querySelector("title").textContent);
            window.newsIndex = 0;
            newsTextEl.textContent = window.newsHeadlines[0];
            console.log("[News] Headlines loaded:", window.newsHeadlines.length);
        }
    } catch (e) {
        console.error("[News] RSS Error:", e);
    }
}

// ニュース切り替えのループ
setInterval(() => {
    // 実行のたびに要素をチェックする
    const newsCardEl = document.getElementById('news-card');
    const newsTextEl = document.getElementById('news-text');

    if (!newsCardEl || !newsTextEl || window.newsHeadlines.length <= 1) {
        // console.log("[News] Not ready to rotate (missing elements or headlines)");
        return;
    }

    console.log("[News] Rotating to next headline...");

    if (typeof gsap !== 'undefined') {
        gsap.to(newsCardEl, {
            opacity: 0, y: 5, duration: 0.5, onComplete: () => {
                window.newsIndex = (window.newsIndex + 1) % window.newsHeadlines.length;
                newsTextEl.textContent = window.newsHeadlines[window.newsIndex];
                gsap.to(newsCardEl, { opacity: 1, y: 0, duration: 0.5 });
            }
        });
    } else {
        window.newsIndex = (window.newsIndex + 1) % window.newsHeadlines.length;
        newsTextEl.textContent = window.newsHeadlines[window.newsIndex];
    }
}, 8000);

window.applyConfig = applyConfig;
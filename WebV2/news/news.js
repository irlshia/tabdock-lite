// --- news.js (修正版フルコード) ---

async function applyConfig() {
    console.log("[News] applyConfig start");

    // config の参照先を確認（window.config または window.echoConfig）
    const cfg = window.echoConfig || window.config || { rssUrl: "" };
    console.log("[News] Using RSS URL:", cfg.rssUrl);

    if (!cfg.rssUrl) {
        console.warn("[News] RSS URL is empty. Skipping fetch.");
        if (newsTextEl) newsTextEl.textContent = "RSS URLが設定されていません";
        return;
    }

    try {
        const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(cfg.rssUrl)}`;
        console.log("[News] Fetching from Proxy:", proxyUrl);

        const response = await fetch(proxyUrl);
        const xmlString = await response.text();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        const items = xmlDoc.querySelectorAll("item");

        console.log(`[News] XML parsed. Items found: ${items.length}`);

        if (items.length > 0) {
            newsHeadlines = Array.from(items).map(i => i.querySelector("title").textContent);
            newsIndex = 0;
            if (newsTextEl) {
                newsTextEl.textContent = newsHeadlines[0];
                console.log("[News] First headline set:", newsHeadlines[0]);
            }
        } else {
            console.warn("[News] No <item> tags found in XML");
        }
    } catch (e) {
        console.error("[News] RSS Error:", e);
        if (newsTextEl) newsTextEl.textContent = "ニュースの取得に失敗しました";
    }
}

// ニュース切り替えのループ
setInterval(() => {
    if (newsHeadlines.length <= 1) {
        // console.log("[News] Not enough headlines to rotate.");
        return;
    }

    console.log("[News] Rotating to next headline...");

    if (typeof gsap !== 'undefined') {
        gsap.to(newsCardEl, {
            opacity: 0, y: 5, duration: 0.5, onComplete: () => {
                newsIndex = (newsIndex + 1) % newsHeadlines.length;
                newsTextEl.textContent = newsHeadlines[newsIndex];
                gsap.to(newsCardEl, { opacity: 1, y: 0, duration: 0.5 });
                console.log(`[News] Displaying headline index: ${newsIndex}`);
            }
        });
    } else {
        // GSAPがない場合のフォールバック
        newsIndex = (newsIndex + 1) % newsHeadlines.length;
        newsTextEl.textContent = newsHeadlines[newsIndex];
    }
}, 8000);

// グローバルに関数を公開
window.applyConfig = applyConfig;
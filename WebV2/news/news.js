// --- news.js ---
window.newsHeadlines = window.newsHeadlines || [];
window.newsIndex = window.newsIndex || 0;

async function applyConfig() {
    console.log("[News] applyConfig start");

    // 関数が呼ばれた瞬間に、要素を直接探しに行く
    const newsTextEl = document.getElementById('news-text');
    const cfg = window.echoConfig || window.config || { rssUrl: "" };

    if (!newsTextEl) {
        console.error("[News] 致命的エラー: #news-text が見つかりません。HTMLを確認してください。");
        return;
    }

    if (!cfg.rssUrl) {
        console.warn("[News] RSS URL が空です。");
        newsTextEl.textContent = "RSS URLを設定してください";
        return;
    }

    try {
        // Xserverなどの本番環境では https:// 必須
        const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(cfg.rssUrl)}`;
        const response = await fetch(proxyUrl);
        const xmlString = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "text/xml");
        const items = xmlDoc.querySelectorAll("item");

        if (items.length > 0) {
            window.newsHeadlines = Array.from(items).map(i => i.querySelector("title").textContent);
            window.newsIndex = 0;
            // 変数定義を確認してから代入
            newsTextEl.textContent = window.newsHeadlines[0];
            console.log(`[News] 取得成功: ${window.newsHeadlines.length} 件`);
        }
    } catch (e) {
        console.error("[News] RSS取得エラー:", e);
        // ここでも直接探しに行く
        const el = document.getElementById('news-text');
        if (el) el.textContent = "ニュース取得に失敗しました";
    }
}

// ニュース切り替えループ
setInterval(() => {
    const newsCardEl = document.getElementById('news-card');
    const newsTextEl = document.getElementById('news-text');

    // 全ての準備が整っている場合のみアニメーション実行
    if (newsCardEl && newsTextEl && window.newsHeadlines && window.newsHeadlines.length > 1) {
        if (window.gsap) {
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
    }
}, 8000);

window.applyConfig = applyConfig;
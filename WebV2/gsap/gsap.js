// --- gsap.js ---
console.log("[GSAP] Script loaded.");

try {
    gsap.registerPlugin(ScrollTrigger);
    console.log("[GSAP] ScrollTrigger plugin registered.");
} catch (e) {
    console.error("[GSAP] Failed to register ScrollTrigger:", e);
}

// --- 基本設定 ---
// window.config が未定義の場合のみ初期化
if (!window.config) {
    window.config = {};
    console.log("[GSAP] window.config was undefined, initialized as empty object.");
} else {
    console.log("[GSAP] window.config already exists:", window.config);
}

const newsTextEl = document.getElementById('news-text');
const newsCardEl = document.getElementById('news-card');
let newsHeadlines = [];
let newsIndex = 0;

if (!window.startTime) {
    window.startTime = Date.now();
    console.log("[GSAP] startTime set:", window.startTime);
}

// --- GSAP アニメーション (初期読み込み) ---
function initAnimations() {
    console.log("[GSAP] initAnimations start");

    // 要素の存在確認
    const targets = [".container", ".clock-large", "#today-msg", ".search-wrapper", ".header", ".footer"];
    targets.forEach(selector => {
        const el = document.querySelector(selector);
        console.log(`[GSAP] Check element: ${selector} ->`, el ? "Found" : "NOT FOUND");
    });

    const tl = gsap.timeline({
        onComplete: () => console.log("[GSAP] Timeline animation completed")
    });

    tl.to(".container", { opacity: 1, duration: 1 })
        .from(".clock-large", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.5")
        .from("#today-msg", { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
        .from(".search-wrapper", { scale: 0.9, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(".header > *", { y: -20, opacity: 0, stagger: 0.2 }, "-=0.8")
        .from(".footer", { y: 20, opacity: 0 }, "-=0.4");

    // スクロール時のウィジェット表示アニメーション
    const cards = gsap.utils.toArray(".widget-card");
    console.log(`[GSAP] Found ${cards.length} widget cards for ScrollTrigger`);

    cards.forEach((card, index) => {
        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none none",
                onEnter: () => console.log(`[GSAP] ScrollTrigger: Card ${index} entered view`)
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    console.log("[GSAP] initAnimations finished setting up");
}

// 実行権限をグローバルに
window.initAnimations = initAnimations;
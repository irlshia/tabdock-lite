// --- weathertime.js ---

function updateTime() {
    console.log("[Time] updateTime start");
    const now = new Date();

    const clockEl = document.getElementById('clock');
    if (clockEl) {
        clockEl.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const dayNameEl = document.getElementById('day-name');
    const fullDateEl = document.getElementById('full-date');

    if (dayNameEl) dayNameEl.textContent = days[now.getDay()];
    if (fullDateEl) fullDateEl.textContent = `${months[now.getMonth()]} ${now.getDate()}`;

    console.log("[Time] updateTime finished", { hour: now.getHours(), min: now.getMinutes() });
}


async function fetchTodayEvent() {
    console.log("[Event] fetchTodayEvent start");

    // window.config を参照
    const cfg = window.config || { userName: "User" };
    console.log("[Event] Current window.config:", window.config);
    console.log("[Event] Using userName:", cfg.userName);

    const msgEl = document.getElementById('today-msg');
    if (!msgEl) {
        console.error("[Event] Error: #today-msg not found");
        return;
    }

    const now = new Date();
    const hr = now.getHours();
    const mmdd = String(now.getMonth() + 1).padStart(2, '0') + String(now.getDate()).padStart(2, '0');
    let greet = (hr >= 5 && hr < 11) ? "おはようございます" : (hr >= 18 || hr < 5) ? "こんばんは" : "こんにちは";

    try {
        const apiUrl = `https://corsproxy.io/?url=${encodeURIComponent('https://api.whatistoday.cyou/v3/anniv/' + mmdd)}`;
        console.log("[Event] Fetching from:", apiUrl);

        const res = await fetch(apiUrl);
        const data = await res.json();

        console.log("[Event] API response:", data);

        msgEl.innerHTML = `${greet}、${cfg.userName}さん<br><span style="font-size: 0.9rem; opacity: 0.8;">今日は「${data.anniv1 || "素敵な一日を"}」です</span>`;
        console.log("[Event] DOM updated successfully");
    } catch (e) {
        console.error("[Event] Fetch error:", e);
        msgEl.innerHTML = `${greet}、${cfg.userName}さん`;
    }
}

async function fetchWeather() {
    console.log("[Weather] fetchWeather start");

    // ここで window.echoConfig と window.config の不一致を確認
    const cfg = window.echoConfig || window.config || { city: "Tokyo" };
    const city = cfg.city;

    console.log("[Weather] Using config:", cfg);
    console.log("[Weather] Target city:", city);

    try {
        const geoUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`;
        console.log("[Weather] Geocoding request:", geoUrl);

        const geoRes = await fetch(geoUrl);
        const geoData = await geoRes.json();

        if (geoData.length > 0) {
            const { lat, lon } = geoData[0];
            console.log("[Weather] Geo coordinates found:", { lat, lon });

            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;
            console.log("[Weather] Weather API request:", weatherUrl);

            const wRes = await fetch(weatherUrl);
            const wData = await wRes.json();

            console.log("[Weather] Weather API response:", wData);

            const tempEl = document.getElementById('weather-temp');
            if (tempEl) {
                tempEl.textContent = `${Math.round(wData.current_weather.temperature)}°C`;
            }

            updateWeatherIcon(wData.current_weather.weathercode);

            const locEl = document.querySelector('.location');
            if (locEl) {
                locEl.textContent = city;
            }
            console.log("[Weather] UI updated successfully");
        } else {
            console.warn("[Weather] No location data found for:", city);
        }
    } catch (e) {
        console.error("[Weather] Error in fetchWeather:", e);
    }
}

function updateWeatherIcon(code) {
    console.log("[WeatherIcon] Updating with code:", code);
    const iconEl = document.getElementById('weather-icon');
    if (!iconEl) {
        console.warn("[WeatherIcon] #weather-icon not found");
        return;
    }

    if (code === 0) iconEl.className = "ri-sun-line";
    else if (code <= 3) iconEl.className = "ri-sun-cloudy-line";
    else if (code <= 67) iconEl.className = "ri-rainy-line";
    else iconEl.className = "ri-thunderstorms-line";

    console.log("[WeatherIcon] Class name set to:", iconEl.className);
}
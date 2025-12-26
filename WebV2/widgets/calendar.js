let currentViewDate = new Date();
let selectedDateKey = "";

function renderCalendar() {
    const grid = document.getElementById('cal-days');
    const monthLabel = document.getElementById('cal-month');
    if (!grid || !monthLabel) return;

    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    monthLabel.innerText = `${year} / ${month + 1}`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const events = JSON.parse(localStorage.getItem('calendar_events') || "{}");

    let html = ['S','M','T','W','T','F','S'].map(d => `<div class="cal-cell cal-head">${d}</div>`).join('');

    for (let i = 0; i < firstDay; i++) {
        html += `<div class="cal-cell"></div>`;
    }

    for (let date = 1; date <= lastDate; date++) {
        const dateKey = `${year}-${String(month + 1).padStart(2,'0')}-${String(date).padStart(2,'0')}`;
        const isToday = (new Date().toDateString() === new Date(year, month, date).toDateString());
        const isSelected = (dateKey === selectedDateKey);
        const hasEvent = events[dateKey] ? 'has-event' : '';

        html += `
            <div class="cal-cell cal-date ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasEvent}" 
                 onclick="selectDate('${dateKey}')">
                ${date}
            </div>`;
    }
    grid.innerHTML = html;
}

function selectDate(dateKey) {
    selectedDateKey = dateKey;
    const events = JSON.parse(localStorage.getItem('calendar_events') || "{}");
    
    const label = document.getElementById('selected-date-label');
    const editor = document.getElementById('event-editor');
    
    if (label && editor) {
        label.innerText = `Date: ${dateKey.replace(/-/g, '/')}`;
        
        const existingContent = document.getElementById('event-content-view');
        if (existingContent) existingContent.remove();

        const contentDiv = document.createElement('div');
        contentDiv.id = 'event-content-view';
        contentDiv.style.marginTop = '8px';

        if (events[dateKey]) {
            // 改行を <br> に変換して、複数行をそのまま表示
            const formattedText = events[dateKey].replace(/\n/g, '<br>');
            contentDiv.innerHTML = `
                <div style="font-size: 0.9rem; color: #fff; line-height: 1.5; word-break: break-all;">${formattedText}</div>
                <div style="font-size: 0.7rem; color: var(--text-sub); text-decoration: underline; cursor: pointer; margin-top: 12px;" onclick="openModal()">予定を編集・追加</div>
            `;
        } else {
            contentDiv.innerHTML = `
                <div style="font-size: 0.8rem; opacity: 0.4;">予定はありません</div>
                <div style="font-size: 0.7rem; color: var(--accent); cursor: pointer; margin-top: 10px;" onclick="openModal()">+ 予定を追加</div>
            `;
        }
        editor.appendChild(contentDiv);
    }
    renderCalendar();
}

// モーダル（別窓）を開く
function openModal() {
    if (!selectedDateKey) return;
    const events = JSON.parse(localStorage.getItem('calendar_events') || "{}");
    
    document.getElementById('modal-date-title').innerText = selectedDateKey;
    // textarea に値をセット
    document.getElementById('event-input').value = events[selectedDateKey] || "";
    document.getElementById('modal-overlay').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
}

function saveEvent() {
    const val = document.getElementById('event-input').value;
    const events = JSON.parse(localStorage.getItem('calendar_events') || "{}");
    
    if (val.trim() === "") {
        delete events[selectedDateKey];
    } else {
        events[selectedDateKey] = val; // 改行を含んだまま保存
    }
    
    localStorage.setItem('calendar_events', JSON.stringify(events));
    closeModal();
    selectDate(selectedDateKey);
}

function changeMonth(diff) {
    currentViewDate.setMonth(currentViewDate.getMonth() + diff);
    renderCalendar();
}

document.addEventListener('DOMContentLoaded', () => {
    renderCalendar();
    // 今日を初期選択
    const today = new Date();
    const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
    selectDate(todayKey);
});
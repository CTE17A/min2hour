let rawValue = "";

const inputDisplay = document.getElementById('inputDisplay');
const inputWrapper = document.getElementById('inputWrapper');
const mainRes = document.getElementById('mainRes');
const decRes = document.getElementById('decRes');
const digitCount = document.getElementById('digitCount');

function vibrate(ms = 12) {
    if (navigator.vibrate) navigator.vibrate(ms);
}

function formatNumberStr(val) {
    const parts = val.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(',');
}

function adjustFontSize(len) {
    if (len <= 9) inputDisplay.style.fontSize = "44px";
    else if (len <= 13) inputDisplay.style.fontSize = "34px";
    else if (len <= 18) inputDisplay.style.fontSize = "26px";
    else inputDisplay.style.fontSize = "22px";
}

function updateUI() {
    if (rawValue === "" || rawValue === "0") {
        inputDisplay.textContent = "0";
        inputDisplay.style.fontSize = "44px";
        inputDisplay.classList.add("placeholder");
        digitCount.textContent = "мин";
        mainRes.textContent = "0 ч 00 мин";
        decRes.textContent = "0 ч";
        return;
    }

    inputDisplay.classList.remove("placeholder");
    const formatted = formatNumberStr(rawValue);
    inputDisplay.textContent = formatted;
    adjustFontSize(formatted.length);
    digitCount.textContent = `${rawValue.replace('.', '').length} цифр`;

    inputWrapper.scrollLeft = inputWrapper.scrollWidth;

    const mins = parseFloat(rawValue);
    if (isNaN(mins) || !isFinite(mins)) {
        mainRes.textContent = "Слишком большое число";
        decRes.textContent = "∞";
        return;
    }

    const totalSeconds = Math.round(mins * 60);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    const dec = Math.round((mins / 60) * 100) / 100;

    const hStr = String(h).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    const mStr = String(m).padStart(2, '0');
    const sStr = String(s).padStart(2, '0');

    mainRes.textContent = s > 0 ? `${hStr} ч ${mStr} мин ${sStr} сек` : `${hStr} ч ${mStr} мин`;
    decRes.textContent = `${formatNumberStr(String(dec))} ч`;
}

function pressDigit(digit) {
    vibrate();
    if (rawValue === "0") {
        rawValue = digit;
    } else {
        rawValue += digit;
    }
    updateUI();
}

function pressDot() {
    vibrate();
    if (rawValue.includes('.')) return;
    rawValue = rawValue === "" ? "0." : rawValue + ".";
    updateUI();
}

function backspace() {
    vibrate(15);
    if (rawValue.length > 0) {
        rawValue = rawValue.slice(0, -1);
        if (rawValue === "0") rawValue = "";
        updateUI();
    }
}

function clearAll() {
    vibrate(25);
    rawValue = "";
    updateUI();
}

function addMinutes(amount) {
    vibrate(18);
    const current = parseFloat(rawValue) || 0;
    const sum = Math.round((current + amount) * 100) / 100;
    rawValue = String(sum);
    updateUI();
}

function copyResult(textId, badgeId) {
    vibrate(20);
    const text = document.getElementById(textId).textContent;
    
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        const badge = document.getElementById(badgeId);
        badge.textContent = "Скопировано!";
        badge.classList.add("copied");
        setTimeout(() => {
            badge.textContent = "Копировать";
            badge.classList.remove("copied");
        }, 1000);
    } catch (err) {}
    
    document.body.removeChild(textArea);
}

document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') pressDigit(e.key);
    else if (e.key === '.' || e.key === ',') pressDot();
    else if (e.key === 'Backspace') backspace();
    else if (e.key === 'Enter' || e.key === 'Escape' || e.key === 'Delete') clearAll();
});
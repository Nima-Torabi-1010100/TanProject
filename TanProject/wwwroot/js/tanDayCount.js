function getTanDayCount() {
    const joinDate = localStorage.getItem('tanJoinDate');
    if (!joinDate) return 1;

    const first = new Date(joinDate);
    const today = new Date();
    first.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return Math.round((today - first) / 86400000) + 1;
}

const onesOrdinal = ['', 'یکم', 'دوم', 'سوم', 'چهارم', 'پنجم', 'ششم', 'هفتم', 'هشتم', 'نهم'];
const teensOrdinal = ['دهم', 'یازدهم', 'دوازدهم', 'سیزدهم', 'چهاردهم', 'پانزدهم', 'شانزدهم', 'هفدهم', 'هجدهم', 'نوزدهم'];
const tensWord = ['', '', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
const tensOrdinal = ['', '', 'بیستم', 'سی‌ام', 'چهلم', 'پنجاهم', 'شصتم', 'هفتادم', 'هشتادم', 'نودم'];
const hundredsWord = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
const hundredsOrdinal = ['', 'صدم', 'دویستم', 'سیصدم', 'چهارصدم', 'پانصدم', 'ششصدم', 'هفتصدم', 'هشتصدم', 'نهصدم'];

function toPersianOrdinal(num) {
    if (num <= 0) return '';
    if (num === 1) return 'اولین';

    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    const ten = Math.floor(remainder / 10);
    const one = remainder % 10;

    let parts = [];

    if (remainder === 0) {
        parts.push(hundredsOrdinal[hundred]);
    } else {
        if (hundred > 0) parts.push(hundredsWord[hundred]);

        if (remainder < 10) parts.push(onesOrdinal[remainder]);
        else if (remainder < 20) parts.push(teensOrdinal[remainder - 10]);
        else if (one === 0) parts.push(tensOrdinal[ten]);
        else {
            parts.push(tensWord[ten]);
            parts.push(onesOrdinal[one]);
        }
    }

    return parts.join(' و ') + 'ین';
}
function toEnglishOrdinal(num) {
    const rem = num % 100;
    if (rem >= 11 && rem <= 13) return num + 'th';
    switch (num % 10) {
        case 1: return num + 'st';
        case 2: return num + 'nd';
        case 3: return num + 'rd';
        default: return num + 'th';
    }
}
function getOrdinal(num, lang) {
    return lang === 'fa' ? toPersianOrdinal(num) : toEnglishOrdinal(num);
}
(function renderTanDayCountBadge() {
    const userDayCount = document.getElementById('user-day-count');
    if (!userDayCount && !localStorage.getItem('userName')) return;
    const lang = document.documentElement.lang || 'fa';
    userDayCount.textContent = getOrdinal(getTanDayCount(), lang);
})();
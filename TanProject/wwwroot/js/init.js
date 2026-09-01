const STORAGE_KEYS = {
    THEME: 'tan-theme',
    LANG: 'preferred_lang',
    USER_NAME: 'userName',
    USER_AGE: 'userAge',
    JOIN_DATE: 'tanJoinDate',
    FEEDBACK: 'feedback'
};
(function requireProfileForProtectedPages() {
    const currentPath = window.location.pathname.replace(/\/$/, '');

    const nameAgeProtected = ['/BodyMapping', '/Chat', '/Reflection', '/Breathwork'];
    const sensationsProtected = ['/Chat'];

    const savedName = localStorage.getItem(STORAGE_KEYS.USER_NAME);
    const savedAge = localStorage.getItem(STORAGE_KEYS.USER_AGE);

    if (nameAgeProtected.some(p => currentPath.toLowerCase() === p.toLowerCase())) {
        if (!savedName || !savedAge) {
            window.location.replace('/Index');
            return;
        }
    }

    if (sensationsProtected.some(p => currentPath.toLowerCase() === p.toLowerCase())) {
        let sensations = [];
        try {
            sensations = JSON.parse(localStorage.getItem('tan_body_sensations')) || [];
        } catch (e) {
            sensations = [];
        }
        if (sensations.length === 0) {
            window.location.replace('/Index');
            return;
        }
    }
})();
(function () {
    const savedTheme = localStorage.getItem('tan-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);

    const savedLang = localStorage.getItem('preferred_lang') || 'fa';
    document.documentElement.lang = savedLang;
    document.documentElement.dir = (savedLang === 'fa') ? 'rtl' : 'ltr';
})();
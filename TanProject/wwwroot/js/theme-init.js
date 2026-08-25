(function () {
    const savedTheme = localStorage.getItem('tan-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);

    const savedLang = localStorage.getItem('preferred_lang') || 'fa';
    document.documentElement.lang = savedLang;
    document.documentElement.dir = (savedLang === 'fa') ? 'rtl' : 'ltr';
})();
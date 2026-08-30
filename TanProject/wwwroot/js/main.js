const FEEDBACK_LABELS = [
    'خیلی دور بود', 'کمی دور بود', 'نزدیک', 'خیلی نزدیک', 'دقیقاً همین بود'
];

let currentStep = 0;
let currentMessageIndex = 0;

(function () {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';

    updateThemeTooltip();

    const darkIcon = document.querySelector('.dark-icon');
    const lightIcon = document.querySelector('.light-icon');
    const savedName = localStorage.getItem(STORAGE_KEYS.USER_NAME);
    const savedAge = localStorage.getItem(STORAGE_KEYS.USER_AGE);


    if (darkIcon && currentTheme === 'light') {
        darkIcon.classList.add('active');
        lightIcon.classList.remove('active');
    }
    else if (lightIcon) {
        darkIcon.classList.remove('active');
        lightIcon.classList.add('active');
    }

    const profileWrapper = document.querySelector('.profile-wrapper');
    const profileNavLink = document.getElementById('profileNavBtn');
    const profileDropdownName = document.querySelector('.profile-dropdown__name');
    const userName = document.getElementById('user-name');
    const dashboardName = document.querySelector('.profile-card__name');

    if (profileDropdownName)
        profileDropdownName.textContent = savedName || 'دوست من ';
    if (userName)
        userName.textContent = savedName || 'دوست من ';
    if (dashboardName)
        dashboardName.textContent = savedName || 'دوست من';

    if (savedName && savedAge) {
        profileWrapper?.classList.add('is-visible');
        profileNavLink?.classList.remove('is-hidden');
    }

})();
function getCurrentLang() {
    return document.documentElement.lang || 'fa';
}
function getTranslations(section) {
    const lang = getCurrentLang();
    return translations[lang][section];
}
function syncThemeUI(theme) { }
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem(STORAGE_KEYS.THEME, newTheme);

    const darkIcon = document.querySelector('.dark-icon');
    const lightIcon = document.querySelector('.light-icon');
    if (darkIcon && newTheme === 'light') {
        darkIcon.classList.add('active');
        lightIcon.classList.remove('active');
    }
    else if (lightIcon) {
        darkIcon.classList.remove('active');
        lightIcon.classList.add('active');
    }

    updateThemeTooltip();
}

function updateThemeTooltip() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const currentLang = getCurrentLang();
    const tooltipEl = document.getElementById('dark-mode-btn__tooltip');

    if (!tooltipEl || !translations[currentLang]) return;

    const key = currentTheme === 'dark' ? 'themeLight' : 'themeDark';
    const translatedText = translations[currentLang]?.header?.[key];

    if (translatedText)
        tooltipEl.textContent = translatedText;
}

//==========
//Language
//==========
function changeLanguage(lang) {
    document.documentElement.dir = (lang === 'fa') ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;

    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const value = getValueFromKey(translations[lang], key);

        if (value && typeof value === 'string') {
            element.textContent = value;
        }
    });

    const attrElements = document.querySelectorAll('[data-i18n-attr]');
    attrElements.forEach(element => {
        const attrData = element.getAttribute('data-i18n-attr');
        if (!attrData) return;

        const [attrName, key] = attrData.split(':');
        const value = getValueFromKey(translations[lang], key);

        if (value && typeof value === 'string') {
            element.setAttribute(attrName.trim(), value);
        }
    });

    updateThemeTooltip();
    localStorage.setItem('preferred_lang', lang);
}

function getValueFromKey(obj, path) {
    if (!path) return null;
    return path.split('.').reduce((prev, curr) => {
        return (prev && prev[curr] !== undefined) ? prev[curr] : null;
    }, obj);
}

function toggleLanguage() {
    const currentLang = localStorage.getItem('preferred_lang') || 'fa';
    const newLang = (currentLang === 'fa') ? 'en' : 'fa';
    changeLanguage(newLang);
}

const savedLang = localStorage.getItem('preferred_lang') || 'fa';
changeLanguage(savedLang);

//==========
//Dorpdown Profile
//==========
const profileDropdown = document.querySelector('.profile-dropdown');
const profileBtn = document.querySelector('.profile-btn');

profileBtn?.addEventListener('click', () => {
    const isOpen = profileDropdown.classList.toggle('is-open');
    profileBtn.setAttribute('aria-expanded', isOpen);
});

//==========
//Menu
//==========
const kebabMenu = document.querySelector('.kebab-menu');
const menuToggle = document.querySelector('.menu-toggle');
const menuCover = document.getElementById('menu-cover');
const closeBtn = document.querySelector('.menu-cover__close');

menuToggle?.addEventListener('click', () => {
    menuCover?.classList.add('is-open');
    menuToggle.classList.add('is-open');
    menuCover?.removeAttribute('aria-hidden');
    closeBtn?.focus();
});


kebabMenu?.addEventListener('click', () => {
    menuCover?.classList.add('is-open');
    kebabMenu.classList.add('is-open');
    menuCover?.removeAttribute('aria-hidden');
    closeBtn?.focus();
});

closeBtn?.addEventListener('click', () => {
    menuCover?.classList.remove('is-open');
    menuToggle?.classList.remove('is-open');
    kebabMenu?.classList.remove('is-open');
    menuToggle?.focus();
});

//==========
// Sensation Intensity
//==========
const valenceSlider = document.getElementById('valence');
const arousalSlider = document.getElementById('arousal');

function updateSliderFill(slider) {
    if (!slider) return;
    const percent = slider.value;
    slider.style.background =
        `linear-gradient(to right, var(--color-ink) ${percent}%, #d1d1d1 ${percent}%)`;
}
if (valenceSlider) {
    updateSliderFill(valenceSlider);
    valenceSlider.addEventListener('input', () => {
        updateSliderFill(valenceSlider);
    });
}
if (arousalSlider) {
    updateSliderFill(arousalSlider);
    arousalSlider.addEventListener('input', () => {
        updateSliderFill(arousalSlider);
    });
}
updateSliderFill();

//==========
// Feedback Range
//==========
const feedbackRange = document.getElementById('feedback-range');
const sliderStatus = document.getElementById('slider-status');

function updateRange() {
    if (!feedbackRange) return;

    const val = parseInt(feedbackRange.value, 10);
    const index = Math.min(Math.floor(val / 20), FEEDBACK_LABELS.length - 1);

    sliderStatus.textContent = FEEDBACK_LABELS[index];
    console.log(val);
    feedbackRange.style.setProperty('--fill', val + '%');
}
feedbackRange?.addEventListener('input', updateRange);
updateRange();

//==========
// Chat
//==========
document.querySelectorAll('.chat__suggestion-chip').forEach(chip => {
    chip.addEventListener('click', () => {
        const input = document.getElementById('chat-input');
        if (!input) return;
        input.value = chip.dataset.value;
        input.focus();
    });
});

//==========
// Steps / Sections
//==========
const sections = document.querySelectorAll('.step-section');
function goToNextSection() {
    if (currentStep < sections.length - 1) {
        sections[currentStep].classList.add('hidden');
        currentStep++;
        sections[currentStep].classList.remove('hidden');
    }
}
function saveNameAndNext() {
    const nameInput = document.getElementById('username-input').value.trim();

    if (nameInput != "") {
        localStorage.setItem(STORAGE_KEYS.USER_NAME, nameInput);
        if (!localStorage.getItem(STORAGE_KEYS.JOIN_DATE)) {
            localStorage.setItem(STORAGE_KEYS.JOIN_DATE, new Date().toISOString().split('T')[0]);
        }
        initAgePicker();
        goToNextSection();
    }
    else {
        showAlert("لطفا نام خود را وارد کنید!");
    }
}
function saveAgeAndNext() {
    if (typeof selectedAgeValue !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.USER_AGE, selectedAgeValue);
    }

    const savedName = localStorage.getItem(STORAGE_KEYS.USER_NAME) || 'دوست من ';
    document.querySelector('.card')?.classList.remove('card');

    const nameSpan = document.getElementById('user-display-name');
    if (nameSpan) nameSpan.textContent = `${savedName}!`;

    document.querySelector('.next-btn')?.classList.remove('hidden');

    goToNextSection();
}

//==========
// Returning user: skip name/age
//==========
(function skipWelcomeIfReturning() {
    if (sections.length < 3) return;
    const savedName = localStorage.getItem(STORAGE_KEYS.USER_NAME);
    const savedAge = localStorage.getItem(STORAGE_KEYS.USER_AGE);

    if (savedName && savedAge) {
        sections[0].classList.add('hidden');
        sections[1].classList.add('hidden');
        sections[2].classList.remove('hidden');
        currentStep = 2;

        document.querySelector('.card')?.classList.remove('card');
        const nameSpan = document.getElementById('user-display-name');
        if (nameSpan) {
            nameSpan.textContent = savedName + '!';
        }
        const nextBtn = document.querySelector('.next-btn');
        if (nextBtn) {
            nextBtn.classList.remove('hidden');
            if (getCurrentLang() === 'en')
                nextBtn.classList.add('btn--english');
        };
    }
})();

function goToNextStep() {
    const dynamicTitle = document.querySelector('.dynamic-title__text');
    if (!dynamicTitle) return;

    const introMessages = getTranslations('breathIntro').messages;
    if (currentMessageIndex < introMessages.length) {
        animateText(dynamicTitle, introMessages[currentMessageIndex]);
        currentMessageIndex++;
    }
    else {
        window.location.href = '/Breathwork';
    }
}


function showAlert(message) {
    const customAlert = document.getElementById('customAlert');
    if (!customAlert) return;
    customAlert.querySelector('.custom-alert__message').textContent = message;
    customAlert.classList.add('active');
}

function closeAlert() {
    document.getElementById('customAlert')?.classList.remove('active');
}

function animateText(element, text) {
    element.classList.remove('fade-in');

    void element.offsetWidth;
    element.textContent = text;

    element.classList.add('fade-in');
}

//==========
//Dashboard
//==========
document.getElementById('deleteAllDataBtn')?.addEventListener('click', function () {
    document.cookie.split(';').forEach(function (cookie) {
        const eqPos = cookie.indexOf('=');
        const name = (eqPos > -1 ? cookie.substr(0, eqPos) : cookie).trim();
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/';
    });
    localStorage.clear();
    window.location.href = '/Index';
});
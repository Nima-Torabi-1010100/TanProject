//==========
//Theme
//==========
(function () {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';

    updateThemeTooltip();

    const darkIcon = document.querySelector('.dark-icon');
    const lightIcon = document.querySelector('.light-icon');

    if (darkIcon && currentTheme === 'light') {
        darkIcon.classList.add('active');
        lightIcon.classList.remove('active');
    }
    else if (lightIcon) {
        darkIcon.classList.remove('active');
        lightIcon.classList.add('active');
    }

    const userName = document.getElementById('user-name');
    if (userName)
        userName.textContent = localStorage.getItem("userName") || 'دوست من ';
})();
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('tan-theme', newTheme);

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
    const currentLang = document.documentElement.lang || 'fa';
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
        `linear-gradient(to right, #2e2031 ${percent}%, #e2e0e8 ${percent}%)`;
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
const labels =
    ['خیلی دور بود', 'کمی دور بود', 'نزدیک', 'خیلی نزدیک', 'دقیقاً همین بود'];

function updateRange() {
    if (!feedbackRange) return;

    const val = parseInt(feedbackRange.value, 10);
    const index = Math.min(Math.floor(val / 20), labels.length - 1);

    sliderStatus.textContent = labels[index];
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
let currentStep = 0;
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
        localStorage.setItem('userName', nameInput);
        initAgePicker();
        goToNextSection();
    }
    else {
        showAlert("لطفا نام خود را وارد کنید!");
    }
}
function saveAgeAndNext() {
    if (typeof selectedAgeValue !== 'undefined') {
        localStorage.setItem('userAge', selectedAgeValue);
    }
    const savedName = localStorage.getItem('userName') || 'دوست من ';
    const nameSpan = document.getElementById('user-display-name');
    if (nameSpan) {
        nameSpan.textContent = savedName + '!';
    }
    document.querySelector(".card").classList.remove("card");
    goToNextSection();

    const nextBtn = document.querySelector('.next-btn');
    if (nextBtn)
        nextBtn.classList.remove('hidden');
}

const introMessages = [
    "امروز قراره کمی به پیام‌های بدنت گوش بدیم.",
    "هیچ فشاری نیست، فقط چند دقیقه همراه من باش.",
    "وقتی آماده بودی، بریم سراغ تمرین تنفس."
];
let currentMessageIndex = 0;
function goToNextStep() {
    const dynamicTitle = document.querySelector('.dynamic-title__text');
    if (!dynamicTitle) return;

    if (currentMessageIndex < introMessages.length) {

        dynamicTitle.classList.remove('fade-in');

        void dynamicTitle.offsetWidth;

        dynamicTitle.textContent = introMessages[currentMessageIndex];

        dynamicTitle.classList.add('fade-in');

        currentMessageIndex++;
    }
    else {
        window.location.href = '/Breathwork';
    }
}

const customAlert = document.getElementById('customAlert');

function showAlert(message) {
    customAlert.querySelector('.custom-alert__message').textContent = message;
    customAlert.classList.add('active');
}

function closeAlert() {
    customAlert.classList.remove('active');
}

function animateText(element, text) {
    element.classList.remove('fade-in');

    void element.offsetWidth;
    element.textContent = text;

    element.classList.add('fade-in');
}
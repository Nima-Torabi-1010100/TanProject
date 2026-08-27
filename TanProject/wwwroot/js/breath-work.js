document.addEventListener('DOMContentLoaded', () => {
    const ballContainer = document.querySelector('.breathwork__ball');
    const ball = document.querySelector('.breathwork__ball img');
    const guideText = document.querySelector('.breathwork__guide h2');
    const counterText = document.querySelector('.breathwork__counter');
    const resetBtn = document.querySelector('.breathwork__reset-btn');
    const skipBtn = document.querySelector('.btn--primary');

    let cycleCount = 0;
    const maxCycles = 4;
    let timerTimeout = null;
    let isRunning = false;

    ballContainer.classList.add('idle');

    const introSteps = [
        { text: "با من همراه شو!", delay: 4000 },
        { text: "قراره تنفس جعبه‌ای انجام بدیم", delay: 2500 },
        { text: "هر مرحله ۴ ثانیه طول می‌کشه", delay: 3000 },
        { text: "همراه با بزرگ شدنم، به‌آرامی نفس بکش", delay: 3000 },
        { text: "نفس رو ۴ ثانیه نگه دار", delay: 3000 },
        { text: "همراه با کوچک شدنم، به‌آرامی نفس رو بیرون بده", delay: 3000 },
        { text: "۴ ثانیه مکث کن و دوباره تکرار کن", delay: 3000 },
        { text: "آماده‌ای؟ بریم...", delay: 2500 }
    ];

    let introIndex = 0;

    function runIntro() {
        if (introIndex < introSteps.length) {
            animateText(guideText, introSteps[introIndex].text);
            timerTimeout = setTimeout(() => {
                introIndex++;
                runIntro();
            }, introSteps[introIndex - 1]?.delay || 2000);
        } else {
            startBoxBreathing();
        }
    }

    runIntro();

    function startBoxBreathing() {
        isRunning = true;
        cycleCount = 1;
        ballContainer.classList.remove('idle');
        ball.style.transform = "scale(0.82)";
        executeCycle();
    }

    function executeCycle() {
        if (cycleCount > maxCycles) {
            finishBreathing();
            return;
        }
        const formatDigits = n => {
            const lang = document.documentElement.lang || 'fa';
            if (lang === 'fa') {
                return String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
            }
            return String(n);
        };
        counterText.textContent = `${formatDigits(maxCycles)} / ${formatDigits(cycleCount)}`;

        guideText.textContent = "به آرامی نفس بکش...";
        ball.style.transform = "scale(1)";

        timerTimeout = setTimeout(() => {

            guideText.textContent = "نفس را نگه دار...";

            timerTimeout = setTimeout(() => {

                guideText.textContent = "آرام نفس را بیرون بده...";
                ball.style.transform = "scale(0.82)";

                timerTimeout = setTimeout(() => {

                    guideText.textContent = "لحظه‌ای مکث کن...";

                    timerTimeout = setTimeout(() => {
                        cycleCount++;
                        executeCycle();
                    }, 4000);

                }, 4000);

            }, 4000);

        }, 4000);
    }

    function finishBreathing() {
        isRunning = false;
        guideText.textContent = "پایان تمرین. عالی بود!";
        ball.style.transform = "scale(0.82)";
        ballContainer.classList.add('idle');


        if (skipBtn) {
            skipBtn.textContent = "ورود به گام بعدی";
            skipBtn.onclick = () => window.location.href = '/BodyMapping';
        }
    }


    resetBtn.addEventListener('click', () => {
        clearTimeout(timerTimeout);
        ball.style.transform = "scale(0.82)";
        introIndex = 0;
        cycleCount = 0;
        counterText.textContent = `۱ / ۴`;
        ballContainer.classList.remove('idle');
        requestAnimationFrame(() => {
            ballContainer.classList.add('idle');
            skipBtn.textContent = "عبور از تمرین";
            runIntro();
        });
    });


    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            if (isRunning || introIndex < introSteps.length) {
                window.location.href = '/BodyMapping';
            }
        });
    }
});
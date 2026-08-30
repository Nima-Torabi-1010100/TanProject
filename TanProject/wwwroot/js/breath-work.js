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

    const introDelays = [4000, 2500, 3000, 3000, 3000, 3000, 3000, 2500];
    function getIntroSteps() {
        const texts = getTranslations('breathwork').steps;
        return texts.map((text, i) => ({ text, delay: introDelays[i] }));
    }

    let introIndex = 0;

    function runIntro() {
        const introSteps = getIntroSteps();
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
        const t = getTranslations('breathwork');
        counterText.textContent = `${formatDigits(maxCycles)} / ${formatDigits(cycleCount)}`;

        guideText.textContent = t.inhale;
        ball.style.transform = "scale(1)";

        timerTimeout = setTimeout(() => {

            guideText.textContent = t.hold;

            timerTimeout = setTimeout(() => {

                guideText.textContent = t.exhale;
                ball.style.transform = "scale(0.82)";

                timerTimeout = setTimeout(() => {

                    guideText.textContent = t.pause;

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
        const t = getTranslations('breathwork');
        guideText.textContent = t.finished;
        ball.style.transform = "scale(0.82)";
        ballContainer.classList.add('idle');


        if (skipBtn) {
            skipBtn.textContent = t.nextStepBtn;
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
            skipBtn.textContent = getTranslations('breathwork').skipBtn;
            runIntro();
        });
    });


    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            const introSteps = getIntroSteps();
            if (isRunning || introIndex < introSteps.length) {
                window.location.href = '/BodyMapping';
            }
        });
    }
});
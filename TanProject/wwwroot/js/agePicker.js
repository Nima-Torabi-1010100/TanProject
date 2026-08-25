let isAgePickerInitialized = false;
let selectedAgeValue = 15;

function initAgePicker() {
    if (isAgePickerInitialized) return;

    const MIN = 1, MAX = 99, DEFAULT = 15;
    const track = document.getElementById('track');
    const resultEl = document.getElementById('result');

    if (!track || !resultEl) return;

    const formatDigits = n => {
        const lang = document.documentElement.lang || 'fa';
        if (lang === 'fa') {
            return String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
        }
        return String(n);
    };

    track.innerHTML = '';
    for (let n = MIN; n <= MAX; n++) {
        const span = document.createElement('span');
        span.className = 'age-option';
        span.dataset.val = n;
        span.textContent = formatDigits(n);
        track.appendChild(span);
    }

    const options = [...track.children];
    let current = DEFAULT;

    function centerOn(n, smooth = true) {
        const el = options[n - MIN];
        if (!el) return;
        const trackRect = track.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const offset = (elRect.left + elRect.width / 2) - (trackRect.left + trackRect.width / 2);
        track.scrollTo({ left: track.scrollLeft + offset, behavior: smooth ? 'smooth' : 'auto' });
    }

    function setActive(n) {
        current = n;
        selectedAgeValue = n;
        options.forEach(o => o.classList.toggle('is-active', Number(o.dataset.val) === n));
        resultEl.textContent = formatDigits(n);
    }

    let scrollTimeout;
    track.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const trackRect = track.getBoundingClientRect();
            const centerX = trackRect.left + trackRect.width / 2;
            let closest = options[0], minDist = Infinity;
            options.forEach(o => {
                const r = o.getBoundingClientRect();
                const dist = Math.abs((r.left + r.width / 2) - centerX);
                if (dist < minDist) { minDist = dist; closest = o; }
            });
            setActive(Number(closest.dataset.val));
        }, 60);
    });

    track.addEventListener('click', e => {
        const el = e.target.closest('.age-option');
        if (!el) return;
        centerOn(Number(el.dataset.val));
    });

    let isDown = false, startX, startScroll;
    track.addEventListener('mousedown', e => {
        isDown = true;
        track.classList.add('is-dragging');
        startX = e.pageX;
        startScroll = track.scrollLeft;
    });
    window.addEventListener('mouseup', () => {
        if (!isDown) return;
        isDown = false;
        track.classList.remove('is-dragging');
        track.dispatchEvent(new Event('scroll'));
        setTimeout(() => centerOn(current), 50);
    });
    window.addEventListener('mousemove', e => {
        if (!isDown) return;
        track.scrollLeft = startScroll - (e.pageX - startX);
    });

    setTimeout(() => {
        centerOn(DEFAULT, false);
        setActive(DEFAULT);
    }, 50);

    isAgePickerInitialized = true;
}
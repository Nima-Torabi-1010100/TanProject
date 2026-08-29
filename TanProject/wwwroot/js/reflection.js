const CACHE_KEY = 'tan_reflection_result';
document.addEventListener("DOMContentLoaded", async () => {
    const image = document.querySelector('.reflection__img');
    const narrativeWrapper = document.querySelector('.reflection__narrative-wrapper');

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
        hideLoadingState(image, narrativeWrapper);
        renderReflection(JSON.parse(cached));
        return;
    }

    const history = JSON.parse(localStorage.getItem('tan_chat_history') || '[]');
    const bodyArea = localStorage.getItem('tan_body_sensations');
    if (history.length === 0 || !bodyArea) {
        window.location.href = '/';
        return;
    }

    showLoadingState(image, narrativeWrapper);

    try {
        const response = await fetch(window.location.pathname + '?handler=Generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': getAntiForgeryToken()
            },
            body: JSON.stringify({ messages: history, bodyArea })
        });

        if (!response.ok) {
            showErrorState(image, narrativeWrapper);
            return;
        }
        const data = await response.json();
        debugger;
        hideLoadingState(image, narrativeWrapper);
        renderReflection(data);

        saveToHistoryGallery(data);

        localStorage.setItem(CACHE_KEY, JSON.stringify(data));
        localStorage.removeItem('tan_chat_history');
        localStorage.removeItem('tan_body_sensations');
    } catch (err) {
        showErrorState();
        console.log(err);
    }
});

function renderReflection({ imageUrl, paragraphs }) {
    showImage(imageUrl);
    const narrative = document.querySelector('.reflection__narrative');

    document.querySelector('.reflection__head')?.classList.add('is-visible');
    document.querySelector('.reflection__narrative')?.classList.add('is-visible');
    document.querySelector('.reflection__action')?.classList.add('is-visible');
    narrative.innerHTML = '';
    paragraphs.forEach(text => {
        const p = document.createElement('p');
        p.textContent = text;
        narrative.appendChild(p);
    });
}
function getAntiForgeryToken() {
    return document.querySelector('input[name="__RequestVerificationToken"]')?.value || '';
}

function showLoadingState(image, narrativeW) {
    image?.classList.add('is-loading');
    narrativeW?.classList.add('is-loading');
}
function hideLoadingState(image, narrativeW) {
    image?.classList.remove('is-loading');
    narrativeW?.classList.remove('is-loading');
}
function showErrorState(image, narrativeW) {
    hideLoadingState(image, narrativeW);
}
function showImage(imageUrl) {
    const img = document.getElementById('reflection__image');
    img.src = imageUrl;
    img.style.display = 'block';
}

function saveToHistoryGallery(data) {
    const history = JSON.parse(
        localStorage.getItem('tan_reflection_history') || '[]'
    );

    const reflection = {
        imageUrl: data.imageUrl,
        date: getPersianDate(),
        tag: data.emotion
    };

    history.push(reflection);

    localStorage.setItem('tan_reflection_history', JSON.stringify(history));
}
function getPersianDate() {
    return new Intl.DateTimeFormat('fa-IR', {
        day: 'numeric',
        month: 'long'
    }).format(new Date());
}
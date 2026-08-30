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
            body: JSON.stringify({ messages: history, lang: getCurrentLang(), bodyArea })
        });

        if (!response.ok) {
            showErrorState(image, narrativeWrapper);
            return;
        }
        const data = await response.json();

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

document.querySelector('.reflection__action').addEventListener('click', async () => {
    const shareCard = document.getElementById('reflection-share-card');
    const shareImage = document.getElementById('share-card-image');
    const narrative = document.querySelector('.reflection__narrative');

    shareImage.src = document.getElementById('reflection__image').src;
    document.getElementById('share-card-narrative').innerHTML = narrative.innerHTML;

    await new Promise((resolve) => {
        if (shareImage.complete) {
            resolve();
        } else {
            shareImage.onload = resolve;
        }
    });

    const canvas = await html2canvas(shareCard, {
        backgroundColor: '#fff',
        scale: 2
    });

    canvas.toBlob(async (blob) => {
        const file = new File(
            [blob],
            'tan-reflection.png',
            { type: 'image/png' }
        );

        if (navigator.canShare?.({ files: [file] })) {
            await navigator.share({
                files: [file],
                title: 'تجربه‌ی تن'
            });
        } else {
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'tan-reflection.png';
            link.click();

            URL.revokeObjectURL(link.href);
        }
    }, 'image/png');
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


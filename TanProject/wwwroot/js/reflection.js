document.addEventListener("DOMContentLoaded", async () => {
    const history = JSON.parse(localStorage.getItem('tan_chat_history') || '[]');
    const bodyArea = localStorage.getItem('tan_body_sensations');
    if (history.length === 0 || !bodyArea) {
        window.location.href = '/';
        return;
    }

    /*    showLoadingState();*/

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
            showErrorState();
            return;
        }
        debugger;
        const data = await response.json();
        renderReflection(data);

        //saveToHistoryGallery(data);

        localStorage.removeItem('tan_chat_history');
    } catch (err) {
        showErrorState();
    }
});

function renderReflection({ imageUrl, paragraphs }) {
    document.getElementById('reflection__image').src = imageUrl;
    const narrative = document.querySelector('.reflection__narrative');
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
document.addEventListener("DOMContentLoaded", () => {
    const history = JSON.parse(
        localStorage.getItem('tan_reflection_history') || '[]'
    );

    renderGallery(history);
});
function renderGallery(history) {
    const gallery = document.querySelector('.gallery-card__grid');
    
    gallery.innerHTML = '';

    history.forEach(reflection => {
        const item = document.createElement('article');

        item.className = 'canvas-item d-flex flex-column align-center';

        item.innerHTML = `
        <div class="canvas-item__img">
            <img src="${reflection.imageUrl}">
        </div>

        <div class="canvas-item__wrapper d-flex justify-between">
            <span class="canvas-item__tag">${reflection.tag}</span>
            <span class="canvas-item__date">${reflection.date}</span>
        </div>
        `;

        gallery.appendChild(item);
    });
}

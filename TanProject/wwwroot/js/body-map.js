const CACHE_KEY = 'tan_reflection_result';
document.addEventListener('DOMContentLoaded', () => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached)
        localStorage.removeItem(CACHE_KEY);

    const instruction = document.querySelector('[data-i18n="bodyMapping.instruction1"]');
    const panel = document.querySelector('.sensation-panel');
    const panelTitle = document.getElementById('sensation-panel__title');
    const questionPrefix = document.querySelector('[data-i18n="bodyMapping.questionPrefix"]');
    const questionSuffix = document.querySelector('[data-i18n="bodyMapping.questionSuffix"]');
    const valenceSlider = document.getElementById('valence');
    const arousalSlider = document.getElementById('arousal');

    const nextBtn = document.querySelector('[data-action="next-step"]');
    const prevBtn = document.querySelector('[data-action="prev-step"]');
    const submitBtn = document.querySelector('[data-action="submit-sensation"]');
    const editBtn = document.querySelector('[data-action="edit-sensation"]');
    const removeBtn = document.querySelector('[data-action="remove-sensation"]');
    const resetBtn = document.querySelector('[data-action="reset-body-map"]');
    const dots = document.querySelectorAll('.sensation-panel__dot');

    const paginationTitle = document.querySelector(".sensation-panel__pagination");

    const isMobile = () => window.matchMedia('(max-width: 768px)').matches;
    const panelWrapper = document.getElementById('bodyMappingPanel');
    const handle = document.querySelector('.sensation-panel__handle');

    const continueBtn = document.getElementById('continue-btn');

    const STORAGE_KEY = 'tan_body_sensations';
    let sensationsList = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    let currentSelection = {
        partId: null,
        partName: null,
        type: null
    };
    let editingIndex = null

    document.querySelectorAll('.body-part').forEach(part => {
        part.addEventListener('click', () => {

            if (isMobile() && panelWrapper) {
                panelWrapper.classList.add('is-open');
            }

            const partKey = part.dataset.part;

            document.querySelectorAll('.body-part--selected')
                .forEach(el => el.classList.remove('body-part--selected'));
            part.classList.add('body-part--selected');

            currentSelection.partId = partKey;
            currentSelection.partName = getTranslations('bodyMapping').bodyParts[partKey] || partKey;
            showSelectedPartTitle(currentSelection.partName);

            setStep(1);
        });
    });

    document.querySelectorAll('.sensation-panel__option').forEach(option => {
        option.addEventListener('click', () => {

            document.querySelectorAll('.sensation-panel__option--selected')
                .forEach(el => el.classList.remove('sensation-panel__option--selected'));

            option.classList.add('sensation-panel__option--selected');

            currentSelection.type = option.dataset.sensation || option.textContent.trim();

            setStep(2);
        });
    });
    function getPartLabel(partId) {
        const lang = getCurrentLang();
        return translations[lang].bodyMapping.bodyParts[partId] || partId;
    }
    function updateNavButtons(stepNumber) {
        if (!nextBtn || !prevBtn) return;
        nextBtn.classList.toggle('is-visible', stepNumber === 1);
        prevBtn.classList.toggle('is-visible', stepNumber === 2);
        const recorded = getTranslations('bodyMapping').recordedAreas;
        paginationTitle?.style.setProperty('--before-content', stepNumber === 1 ? `"${recorded}"` : '""');
    }
    function updateActionButtons() {
        if (!editBtn || !removeBtn || !submitBtn) return;
        submitBtn.classList.toggle('is-visible', editingIndex === null);
        editBtn.classList.toggle('is-visible', editingIndex !== null);
        removeBtn.classList.toggle('is-visible', editingIndex !== null);
    }
    function setStep(stepNumber) {
        if (stepNumber === 2 && !currentSelection.partId) {
            resetCurrentSelection();
            showAlert(getTranslations("alerts").selectBodyPart);
            return;
        }
        if (stepNumber === 2 && !currentSelection.type) {
            showAlert(getTranslations("alerts").selectSensationType);
            return;
        }
        const currentLanguage = getCurrentLang();

        animateText(instruction,
            stepNumber === 1
                ? translations[currentLanguage].bodyMapping.instruction1
                : translations[currentLanguage].bodyMapping.instruction2
        )

        if (panel) panel.setAttribute('data-step', stepNumber.toString());
        updateNavButtons(stepNumber);
        applyLangClasses(currentLanguage);
    }

    nextBtn?.addEventListener('click', () => setStep(2));
    prevBtn?.addEventListener('click', () => setStep(1));

    submitBtn?.addEventListener('click', () => {

        if (!currentSelection.partId || !currentSelection.type) {
            showAlert(getTranslations("alerts").incompleteSensation);
            return;
        }
        if (sensationsList.length >= 5) {
            showAlert(getTranslations("alerts").maxSensationsReached);
            return;
        }

        const entry = {
            id: editingIndex !== null ? sensationsList[editingIndex].id : Date.now(),
            part: currentSelection.partId,
            partLabel: currentSelection.partName,
            sensation: currentSelection.type,
            valence: parseInt(valenceSlider?.value || 50, 10),
            arousal: parseInt(arousalSlider?.value || 50, 10)
        };

        sensationsList.push(entry);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(sensationsList));

        resetCurrentSelection();
        setStep(1);
        renderDots();
    });
    editBtn?.addEventListener('click', () => {
        if (editingIndex === null) return;

        if (!currentSelection.partId || !currentSelection.type) {
            showAlert(getTranslations("alerts").incompleteSensation);
            return;
        }

        sensationsList[editingIndex] = {
            ...sensationsList[editingIndex],
            part: currentSelection.partId,
            partLabel: currentSelection.partName,
            sensation: currentSelection.type,
            valence: parseInt(valenceSlider?.value || 50, 10),
            arousal: parseInt(arousalSlider?.value || 50, 10)
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sensationsList));

        resetCurrentSelection();
        setStep(1);
        renderDots();
    });
    removeBtn?.addEventListener('click', () => {
        if (editingIndex === null)
            return;

        sensationsList.splice(editingIndex, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sensationsList));

        resetCurrentSelection();
        setStep(1);
        renderDots();
    });

    resetBtn?.addEventListener('click', () => {
        localStorage.removeItem(STORAGE_KEY);
        sensationsList = [];

        resetCurrentSelection();
        setStep(1);
        renderDots();
    });

    function resetCurrentSelection() {
        currentSelection = { partId: null, partName: null, type: null };
        editingIndex = null;
        updateActionButtons();

        showPlaceholderTitle();
        if (valenceSlider) {
            valenceSlider.value = 50;
            updateSliderFill(valenceSlider);
        };
        if (arousalSlider) {
            arousalSlider.value = 50;
            updateSliderFill(arousalSlider);
        };
        document.querySelectorAll('.body-part--selected')
            .forEach(el => el.classList.remove('body-part--selected'));
        document.querySelectorAll('.sensation-panel__option--selected')
            .forEach(el => el.classList.remove('sensation-panel__option--selected'));
    }
    function showPlaceholderTitle() {
        if (questionPrefix) questionPrefix.style.display = 'none';
        if (questionSuffix) questionSuffix.style.display = 'none';
        if (panelTitle) panelTitle.textContent = getTranslations('bodyMapping').placeholder;
    }
    function showSelectedPartTitle(partName) {
        if (questionPrefix) questionPrefix.style.display = '';
        if (questionSuffix) questionSuffix.style.display = '';
        if (panelTitle) panelTitle.textContent = partName;
    }
    function renderDots() {
        dots.forEach((dot, i) => {
            const hasEntry = i < sensationsList.length;
            dot.classList.toggle('sensation-panel__dot--active', i < sensationsList.length);
            dot.classList.toggle('sensation-panel__dot--editing', i === editingIndex);
        });
    }
    function loadEntryIntoPanel(index) {
        const entry = sensationsList[index];
        if (!entry) return;

        editingIndex = index;
        currentSelection = {
            partId: entry.part,
            partName: entry.partLabel,
            type: entry.sensation
        };

        showSelectedPartTitle(entry.partLabel);
        if (valenceSlider) {
            valenceSlider.value = entry.valence
            updateSliderFill(valenceSlider);
        };
        if (arousalSlider) {
            arousalSlider.value = entry.arousal
            updateSliderFill(arousalSlider)
        };

        document.querySelectorAll('.body-part--selected')
            .forEach(el => el.classList.remove('body-part--selected'));
        document.querySelector(`.body-part[data-part="${entry.part}"]`)
            ?.classList.add('body-part--selected');

        document.querySelectorAll('.sensation-panel__option--selected')
            .forEach(el => el.classList.remove('sensation-panel__option--selected'));
        document.querySelector(`.sensation-panel__option[data-sensation="${entry.sensation}"]`)
            ?.classList.add('sensation-panel__option--selected');

        renderDots();
        updateActionButtons();
        setStep(2);
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            if (sensationsList[i]) {
                loadEntryIntoPanel(i);
            }
            else {
                showAlert(getTranslations("alerts").noSensationRegistered);
            }
        });
    });

    continueBtn?.addEventListener('click', () => {
        if (sensationsList.length === 0) {
            showAlert(getTranslations("alerts").needAtLeastOneSensation);
            return;
        }
        window.location.href = "/Chat";
    })

    if (panelWrapper || handle) {
        const CLOSE_THRESHOLD = 80;
        let startY = 0;
        let currentY = 0;
        let dragging = false;


        handle.addEventListener('pointerdown', (e) => {
            dragging = true;
            startY = e.clientY;
            currentY = 0;
            panelWrapper.style.transition = 'none';
            handle.setPointerCapture(e.pointerId);
        });

        handle.addEventListener('pointermove', (e) => {
            if (!dragging) return;
            currentY = Math.max(0, e.clientY - startY);
            panelWrapper.style.transform = `translateY(${currentY}px)`;
        });

        function endDrag() {
            if (!dragging) return;
            dragging = false;
            panelWrapper.style.transition = '';
            panelWrapper.style.transform = '';

            if (currentY > CLOSE_THRESHOLD) {
                panelWrapper.classList.remove('is-open');
            }
            currentY = 0;
        };
        handle.addEventListener('pointerup', endDrag);
        handle.addEventListener('pointercancel', endDrag);
    }

    resetCurrentSelection();
    renderDots();
    updateNavButtons(1);
    updateActionButtons();
});
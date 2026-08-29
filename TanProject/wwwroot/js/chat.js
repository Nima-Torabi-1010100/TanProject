(function () {
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const avatarTemplate = document.getElementById('chat-avatar-template');
    const finishBtn = document.querySelector('.chat__finish-btn');

    let history = [];

    function getAntiForgeryToken() {
        return document.querySelector('input[name="__RequestVerificationToken"]')?.value || '';
    }

    function createAvatar() {
        return avatarTemplate.content.firstElementChild.cloneNode(true);
    }
    function persistHistory() {
        localStorage.setItem('tan_chat_history', JSON.stringify(history));
    }
    function appendMessage(role, text) {
        const wrapper = document.createElement('div');
        wrapper.className = 'chat__message d-flex ' + (role === 'assistant' ? 'chat__message--ai' : 'chat__message--user');
        if (role === 'assistant') {
            wrapper.dataset.role = 'assistant';
            wrapper.appendChild(createAvatar());
        }
        const bubble = document.createElement('div');
        bubble.className = 'chat__bubble' + (role === 'user' ? ' chat__bubble--user' : '');
        bubble.textContent = text;
        wrapper.appendChild(bubble);
        chatMessages.appendChild(wrapper);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return wrapper;
    }

    function setLoading(isLoading) {
        chatSend.disabled = isLoading;
        chatInput.disabled = isLoading;
        if (isLoading) {
            appendMessage('assistant', '...').classList.add('chat__message--pending');
        } else {
            chatMessages.querySelector('.chat__message--pending')?.remove();
        }
    }

    function getUserContext() {
        let sensationsList = [];
        try {
            sensationsList = JSON.parse(localStorage.getItem('tan_body_sensations')) || [];
        } catch (e) {
            sensationsList = [];
        }
        return {
            userName: localStorage.getItem('userName') || '',
            userAge: localStorage.getItem('userAge') || '',
            sensationsList
        };
    }

    async function postJson(handler, body) {
        debugger;
        const res = await fetch(window.location.pathname + '?handler=' + handler, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'RequestVerificationToken': getAntiForgeryToken()
            },
            body: JSON.stringify(body)
        });
        const data = await res.json();
        console.log(data.reply);
        return { ok: res.ok, data };
    }

    async function startConversation() {
        setLoading(true);
        try {
            const { ok, data } = await postJson('StartConversation', getUserContext());
            setLoading(false);

            if (!ok) {
                appendMessage('assistant', data.reply || 'مشکلی پیش اومد.');
                return;
            }

            appendMessage('assistant', data.reply);
            history.push({ role: 'user', content: data.seed });
            history.push({ role: 'assistant', content: data.reply });
            persistHistory();
        } catch (err) {
            setLoading(false);
            appendMessage('assistant', 'اتصال برقرار نشد. دوباره امتحان کن.');
            console.error(err);
        }
    }

    async function sendMessage(text) {
        text = text.trim();
        if (!text) return;

        appendMessage('user', text);
        history.push({ role: 'user', content: text });
        persistHistory();
        chatInput.value = '';
        setLoading(true);

        try {
            const { ok, data } = await postJson('SendMessage', { messages: history });
            setLoading(false);

            if (!ok) {
                appendMessage('assistant', data.reply || 'مشکلی پیش اومد.');
                return;
            }

            appendMessage('assistant', data.reply);
            history.push({ role: 'assistant', content: data.reply });
            persistHistory();
        } catch (err) {
            setLoading(false);
            appendMessage('assistant', 'اتصال برقرار نشد. دوباره امتحان کن.');
            console.error(err);
        }
    }

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        sendMessage(chatInput.value);
    });

    finishBtn.addEventListener('click', () => {
        window.location.href = '/Reflection';
    })

    startConversation();
})();
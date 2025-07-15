// Gestionnaire du chat
class ChatManager {
    constructor() {
        this.sessionId = this.generateSessionId();
        this.setupEventListeners();
        this.apiUrl = '/api/chat/message';
    }

    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 9);
    }

    setupEventListeners() {
        const chatbotToggle = document.querySelector('.chatbot-toggle');
        const chatbotContainer = document.querySelector('.chatbot-container');
        const chatbotClose = document.querySelector('.chatbot-close');
        const chatInput = document.querySelector('.chatbot-input input');
        const sendButton = document.querySelector('.send-button');

        chatbotToggle.addEventListener('click', () => {
            chatbotContainer.classList.add('active');
            chatbotToggle.classList.add('active');
            setTimeout(() => chatInput.focus(), 300);
        });

        chatbotClose.addEventListener('click', () => {
            chatbotContainer.classList.remove('active');
            chatbotToggle.classList.remove('active');
        });

        sendButton.addEventListener('click', () => {
            this.sendMessage(chatInput.value);
        });

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage(chatInput.value);
            }
        });
    }

    async sendMessage(content) {
        if (!content.trim()) return;

        const messagesContainer = document.querySelector('.chatbot-messages');
        const typingIndicator = document.querySelector('.typing-indicator');
        const chatInput = document.querySelector('.chatbot-input input');

        // Afficher le message de l'utilisateur
        this.appendMessage(content, true);
        chatInput.value = '';

        // Afficher l'indicateur de frappe
        typingIndicator.style.display = 'flex';
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: content,
                    sessionId: this.sessionId,
                    isFromUser: true,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error('Erreur réseau');
            }

            const data = await response.json();
            
            // Cacher l'indicateur de frappe
            typingIndicator.style.display = 'none';
            
            // Afficher la réponse du bot
            this.appendMessage(data.content, false);
            
        } catch (error) {
            console.error('Erreur:', error);
            typingIndicator.style.display = 'none';
            this.appendMessage("Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard.", false);
        }
    }

    appendMessage(content, isFromUser) {
        const messagesContainer = document.querySelector('.chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isFromUser ? 'user-message' : 'bot-message'}`;
        messageDiv.textContent = content;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
}

// Initialiser le chat quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    window.chatManager = new ChatManager();
}); 
class ChatService {
    constructor() {
        this.API_URL = 'http://localhost:5150/api';
    }

    async sendMessage(content) {
        try {
            const token = localStorage.getItem('uranus_auth_token');
            if (!token) {
                window.location.href = '/login.html';
                return null;
            }

            const response = await fetch(`${this.API_URL}/chat/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content })
            });

            if (!response.ok) {
                if (response.status === 401) {
                    window.location.href = '/login.html';
                    return null;
                }
                throw new Error('Erreur lors de l\'envoi du message');
            }

            return await response.json();
        } catch (error) {
            console.error('Erreur:', error);
            throw error;
        }
    }

    async getChatHistory() {
        const token = localStorage.getItem('uranus_auth_token');
        if (!token) {
            window.location.href = '/login.html';
            return [];
        }

        const response = await fetch(`${this.API_URL}/chat/history`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 401) {
            localStorage.removeItem('uranus_auth_token');
            window.location.href = '/login.html';
            return [];
        }

        if (!response.ok) {
            throw new Error('Erreur lors du chargement de l\'historique');
        }

        return await response.json();
    }
}

class ChatUI {
    constructor() {
        this.chatService = new ChatService();
        this.messagesContainer = document.getElementById('chatMessages');
        this.chatForm = document.getElementById('chatForm');
        this.messageInput = document.getElementById('messageInput');
        this.suggestionButton = document.querySelector('.suggestion-button');
        this.suggestionsContainer = document.querySelector('.chat-suggestions');
        this.typingIndicator = document.querySelector('.typing-indicator');
        this.chatContainer = document.querySelector('.chat-container');
        
        this.setupEventListeners();
        this.setupSuggestions();
        this.setupParticlesEffect();
        this.loadChatHistory();
    }

    setupEventListeners() {
        this.chatForm.addEventListener('submit', this.handleSubmit.bind(this));
        this.suggestionButton.addEventListener('click', this.toggleSuggestions.bind(this));
        this.messageInput.addEventListener('focus', () => this.hideSuggestions());
        
        // Fermer les suggestions en cliquant en dehors
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.chat-suggestions') && !e.target.closest('.suggestion-button')) {
                this.hideSuggestions();
            }
        });

        // Gérer les suggestions
        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                this.messageInput.value = item.textContent;
                this.hideSuggestions();
                this.messageInput.focus();
            });
        });

        // Effet de particules
        this.chatContainer.addEventListener('mousemove', this.handleParticlesEffect.bind(this));
    }

    setupSuggestions() {
        const commonQuestions = [
            "Quels sont vos services de conseil ?",
            "Comment prendre rendez-vous ?",
            "Quelles sont vos certifications ?",
            "Où sont vos bureaux ?"
        ];

        this.suggestionsContainer.innerHTML = commonQuestions
            .map(q => `<div class="suggestion-item">${q}</div>`)
            .join('');
    }

    setupParticlesEffect() {
        this.chatContainer.style.position = 'relative';
    }

    handleParticlesEffect(e) {
        const rect = this.chatContainer.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / this.chatContainer.clientWidth) * 100;
        const y = ((e.clientY - rect.top) / this.chatContainer.clientHeight) * 100;
        this.chatContainer.style.setProperty('--x', `${x}%`);
        this.chatContainer.style.setProperty('--y', `${y}%`);
    }

    async handleSubmit(event) {
        event.preventDefault();
        const content = this.messageInput.value.trim();
        if (!content) return;

        // Ajouter le message de l'utilisateur avec animation
        this.addMessage(content, true);
        this.messageInput.value = '';
        this.messageInput.disabled = true;

        // Afficher l'indicateur de frappe
        this.showTypingIndicator();

        try {
            // Simuler un délai naturel de réponse
            await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 500));
            
            const response = await this.chatService.sendMessage(content);
            if (response) {
                // Masquer l'indicateur de frappe
                this.hideTypingIndicator();
                // Ajouter la réponse du chatbot avec animation
                this.addMessage(response.content, false);
            }
        } catch (error) {
            this.hideTypingIndicator();
            this.addErrorMessage("Désolé, je n'ai pas pu traiter votre demande. Veuillez réessayer.");
        } finally {
            this.messageInput.disabled = false;
            this.messageInput.focus();
        }
    }

    showTypingIndicator() {
        this.typingIndicator.style.display = 'inline-flex';
        this.messagesContainer.appendChild(this.typingIndicator);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.typingIndicator.style.display = 'none';
        if (this.typingIndicator.parentNode === this.messagesContainer) {
            this.messagesContainer.removeChild(this.typingIndicator);
        }
    }

    addMessage(content, isUser = false) {
        const messageElement = document.createElement('div');
        messageElement.className = `message message-${isUser ? 'user' : 'assistant'}`;
        
        const time = new Date().toLocaleTimeString('fr-FR', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        // Ajouter la classe loading pour l'animation de chargement
        if (!isUser) {
            messageElement.classList.add('loading');
        }
        
        messageElement.innerHTML = `
            <div class="message-content">
                <p>${this.escapeHtml(content)}</p>
            </div>
            <div class="message-time">${time}</div>
        `;

        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();

        // Retirer la classe loading après l'animation
        if (!isUser) {
            setTimeout(() => {
                messageElement.classList.remove('loading');
            }, 500);
        }
    }

    addErrorMessage(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'message message-error';
        errorElement.innerHTML = `
            <div class="message-content">
                <p>${this.escapeHtml(message)}</p>
            </div>
        `;
        this.messagesContainer.appendChild(errorElement);
        this.scrollToBottom();
    }

    toggleSuggestions() {
        const isVisible = this.suggestionsContainer.style.display === 'block';
        this.suggestionsContainer.style.display = isVisible ? 'none' : 'block';
    }

    hideSuggestions() {
        this.suggestionsContainer.style.display = 'none';
    }

    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    async loadChatHistory() {
        try {
            const messages = await this.chatService.getChatHistory();
            messages.reverse().forEach(message => this.addMessage(message.content));
            this.scrollToBottom();
        } catch (error) {
            console.error('Erreur:', error);
        }
    }
}

// Initialiser le chat
document.addEventListener('DOMContentLoaded', () => {
    new ChatUI();
}); 
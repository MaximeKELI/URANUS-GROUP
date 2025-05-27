class AuthService {
    constructor() {
        this.API_URL = 'http://localhost:5000/api';
    }

    async login(email, password) {
        const response = await fetch(`${this.API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Email ou mot de passe incorrect');
            }
            throw new Error('Erreur lors de la connexion');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        return data;
    }
}

class LoginUI {
    constructor() {
        this.authService = new AuthService();
        this.form = document.querySelector('.login-form');
        this.emailInput = document.querySelector('#email');
        this.passwordInput = document.querySelector('#password');
        this.errorMessage = document.querySelector('.error-message');
        this.submitButton = document.querySelector('.login-button');

        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value.trim();

        if (!email || !password) {
            this.showError('Veuillez remplir tous les champs');
            return;
        }

        this.setLoading(true);
        try {
            await this.authService.login(email, password);
            window.location.href = '/index.html';
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoading(false);
        }
    }

    showError(message) {
        this.errorMessage.textContent = message;
        this.errorMessage.classList.add('visible');
    }

    setLoading(isLoading) {
        this.submitButton.disabled = isLoading;
        this.emailInput.disabled = isLoading;
        this.passwordInput.disabled = isLoading;
        this.form.classList.toggle('loading', isLoading);
        this.submitButton.textContent = isLoading ? 'Connexion...' : 'Se connecter';
    }
}

// Initialiser l'interface de login
document.addEventListener('DOMContentLoaded', () => {
    new LoginUI();
}); 
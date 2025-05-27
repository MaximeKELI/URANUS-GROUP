class AuthService {
    constructor() {
        this.API_URL = 'http://localhost:5000/api';
        this.tokenKey = 'uranus_auth_token';
        this.refreshTokenKey = 'uranus_refresh_token';
    }

    async login(email, password, remember = false) {
        try {
            const response = await fetch(`${this.API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, remember })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Erreur lors de la connexion');
            }

            const { token, refreshToken } = await response.json();
            this.setTokens(token, refreshToken);
            return true;
        } catch (error) {
            console.error('Erreur de connexion:', error);
            throw error;
        }
    }

    async refreshToken() {
        const refreshToken = localStorage.getItem(this.refreshTokenKey);
        if (!refreshToken) {
            throw new Error('Pas de refresh token disponible');
        }

        try {
            const response = await fetch(`${this.API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ refreshToken })
            });

            if (!response.ok) {
                this.clearTokens();
                throw new Error('Impossible de rafraîchir le token');
            }

            const { token, newRefreshToken } = await response.json();
            this.setTokens(token, newRefreshToken);
            return token;
        } catch (error) {
            this.clearTokens();
            throw error;
        }
    }

    setTokens(token, refreshToken) {
        localStorage.setItem(this.tokenKey, token);
        if (refreshToken) {
            localStorage.setItem(this.refreshTokenKey, refreshToken);
        }
    }

    clearTokens() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    getToken() {
        return localStorage.getItem(this.tokenKey);
    }

    isAuthenticated() {
        return !!this.getToken();
    }
}

class AuthUI {
    constructor() {
        this.authService = new AuthService();
        this.form = document.getElementById('loginForm');
        this.emailInput = document.getElementById('email');
        this.passwordInput = document.getElementById('password');
        this.rememberInput = document.getElementById('remember');
        this.errorContainer = document.querySelector('.auth-error');
        this.submitButton = document.querySelector('.auth-button');
        this.togglePasswordButton = document.querySelector('.toggle-password');

        this.setupEventListeners();
        this.checkAuthentication();
    }

    setupEventListeners() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        this.togglePasswordButton.addEventListener('click', this.togglePasswordVisibility.bind(this));
    }

    checkAuthentication() {
        if (this.authService.isAuthenticated()) {
            window.location.href = '/index.html';
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;
        const remember = this.rememberInput.checked;

        this.clearError();
        this.setLoading(true);

        try {
            await this.authService.login(email, password, remember);
            window.location.href = '/index.html';
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoading(false);
        }
    }

    togglePasswordVisibility() {
        const type = this.passwordInput.type === 'password' ? 'text' : 'password';
        this.passwordInput.type = type;
        
        // Mettre à jour l'icône
        const icon = this.togglePasswordButton.querySelector('.eye-icon');
        icon.style.backgroundImage = type === 'password' 
            ? 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z\'%3E%3C/path%3E%3Ccircle cx=\'12\' cy=\'12\' r=\'3\'%3E%3C/circle%3E%3C/svg%3E")'
            : 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24\'%3E%3C/path%3E%3Cline x1=\'1\' y1=\'1\' x2=\'23\' y2=\'23\'%3E%3C/line%3E%3C/svg%3E")';
    }

    showError(message) {
        this.errorContainer.textContent = message;
        this.errorContainer.style.display = 'block';
    }

    clearError() {
        this.errorContainer.textContent = '';
        this.errorContainer.style.display = 'none';
    }

    setLoading(isLoading) {
        this.submitButton.disabled = isLoading;
        this.submitButton.textContent = isLoading ? 'Connexion...' : 'Se connecter';
    }
}

// Initialiser l'interface d'authentification
document.addEventListener('DOMContentLoaded', () => {
    new AuthUI();
}); 
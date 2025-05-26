// Gestion du menu mobile
const navLinks = document.getElementById("navLinks");

function showMenu() {
    navLinks.style.right = "0";
}

function hideMenu() {
    navLinks.style.right = "-200px";
}

// Split text animation pour le titre principal
document.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        text.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animationDelay = `${i * 0.05}s`;
            heroTitle.appendChild(span);
        });
    }
});

// Animation au scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            if (entry.target.classList.contains('service-card')) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        }
    });
}, observerOptions);

// Ajouter la classe section-animate à tous les éléments à animer
document.querySelectorAll('.service-section, .about-section, .news-section, .team-member, .stat-item').forEach(element => {
    element.classList.add('section-animate');
    observer.observe(element);
});

// Effet de parallaxe
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero, .service-hero, .about-hero');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Effet 3D sur les cartes
document.querySelectorAll('.service-card, .team-member').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    });
});

// Animation des particules
function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-bg';
    document.body.prepend(particlesContainer);

    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 2 + 1) + 's';
        particle.style.animationDelay = (Math.random() * 2) + 's';
        particlesContainer.appendChild(particle);
    }
}

// Initialisation des particules
createParticles();

// Animation smooth scroll améliorée
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.offsetTop;
            const offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Fermer le menu mobile lors du clic sur un lien
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            hideMenu();
        }
    });
});

// Gestion du formulaire de contact
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Récupération des données du formulaire
    const formData = new FormData(this);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    // Ici, vous pouvez ajouter le code pour envoyer les données à votre backend
    // Pour l'instant, on affiche juste une confirmation
    alert('Merci pour votre message ! Nous vous contacterons bientôt.');
    this.reset();
});

// Animation smooth scroll pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animation du header au chargement
window.addEventListener('load', () => {
    const hero = document.querySelector('.hero');
    hero.style.opacity = '0';
    hero.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        hero.style.transition = 'all 1s ease-out';
        hero.style.opacity = '1';
        hero.style.transform = 'translateY(0)';
    }, 100);
});

// Filtrage des actualités
const filterButtons = document.querySelectorAll('.filter-btn');
const newsCards = document.querySelectorAll('.news-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Retirer la classe active de tous les boutons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Ajouter la classe active au bouton cliqué
        button.classList.add('active');

        const filter = button.getAttribute('data-filter');

        newsCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Gestion de la newsletter
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        // Ici, vous pouvez ajouter le code pour envoyer l'email à votre backend
        alert('Merci de votre inscription à notre newsletter !');
        newsletterForm.reset();
    });
}

// Animation des cartes d'actualités au scroll
const newsCardsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

newsCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.5s ease-out';
    newsCardsObserver.observe(card);
});

// Système de prise de rendez-vous
class AppointmentSystem {
    constructor() {
        this.availableSlots = {};
        this.selectedService = null;
        this.selectedDate = null;
        this.selectedTime = null;
    }

    // Initialiser le calendrier
    initCalendar() {
        const calendar = document.getElementById('appointment-calendar');
        if (!calendar) return;

        // Configuration du calendrier
        const config = {
            minDate: "today",
            maxDate: new Date().fp_incr(30), // 30 jours à l'avance
            dateFormat: "Y-m-d",
            locale: "fr",
            onChange: (selectedDates) => {
                this.selectedDate = selectedDates[0];
                this.updateAvailableSlots();
            }
        };

        // Initialiser flatpickr
        flatpickr(calendar, config);
    }

    // Mettre à jour les créneaux disponibles
    updateAvailableSlots() {
        if (!this.selectedDate || !this.selectedService) return;

        // Simuler une requête API
        const slots = this.getAvailableSlots(this.selectedDate, this.selectedService);
        this.displayTimeSlots(slots);
    }

    // Afficher les créneaux horaires
    displayTimeSlots(slots) {
        const container = document.getElementById('time-slots');
        if (!container) return;

        container.innerHTML = '';
        slots.forEach(slot => {
            const button = document.createElement('button');
            button.className = 'time-slot';
            button.textContent = slot;
            button.onclick = () => this.selectTimeSlot(slot);
            container.appendChild(button);
        });
    }

    // Sélectionner un créneau
    selectTimeSlot(time) {
        this.selectedTime = time;
        this.updateSummary();
    }

    // Mettre à jour le résumé
    updateSummary() {
        const summary = document.getElementById('appointment-summary');
        if (!summary) return;

        summary.innerHTML = `
            <h3>Résumé de votre rendez-vous</h3>
            <p>Service : ${this.selectedService}</p>
            <p>Date : ${this.selectedDate.toLocaleDateString()}</p>
            <p>Heure : ${this.selectedTime}</p>
        `;
    }

    // Simuler la récupération des créneaux disponibles
    getAvailableSlots(date, service) {
        // En production, ceci serait une requête API
        return [
            "09:00", "10:00", "11:00", "14:00", "15:00", "16:00"
        ];
    }

    // Confirmer le rendez-vous
    confirmAppointment() {
        if (!this.selectedDate || !this.selectedTime || !this.selectedService) {
            alert('Veuillez sélectionner tous les éléments nécessaires');
            return;
        }

        // En production, ceci serait une requête API
        alert('Rendez-vous confirmé ! Vous recevrez un email de confirmation.');
    }
}

// Initialiser le système de rendez-vous
document.addEventListener('DOMContentLoaded', () => {
    const appointmentSystem = new AppointmentSystem();
    appointmentSystem.initCalendar();
}); 
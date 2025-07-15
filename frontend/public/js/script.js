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

// Animations au scroll
document.addEventListener('DOMContentLoaded', function() {
    // Observer pour les animations au scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    // Ajouter la classe fade-in à tous les éléments à animer
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });

    document.querySelectorAll('.service-card').forEach(card => {
        card.classList.add('fade-in');
        observer.observe(card);
    });

    // Système de particules
    const createParticles = () => {
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'particles';
        document.body.appendChild(particlesContainer);

        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = Math.random() * 5 + 'px';
            particle.style.height = particle.style.width;
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particlesContainer.appendChild(particle);
        }

        document.addEventListener('mousemove', (e) => {
            const particles = document.querySelectorAll('.particle');
            particles.forEach(particle => {
                const rect = particle.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                const deltaX = e.clientX - centerX;
                const deltaY = e.clientY - centerY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                
                if (distance < 100) {
                    const angle = Math.atan2(deltaY, deltaX);
                    const force = (100 - distance) / 100;
                    const moveX = Math.cos(angle) * force * 10;
                    const moveY = Math.sin(angle) * force * 10;
                    
                    particle.style.transform = `translate(${moveX}px, ${moveY}px)`;
                } else {
                    particle.style.transform = 'translate(0, 0)';
                }
            });
        });
    };

    createParticles();

    // Effet de parallaxe sur le hero
    const hero = document.querySelector('.hero');
    if (hero) {
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
            hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
    });
    }

    // Animation des cartes de service
    const cards = document.querySelectorAll('.service-card');
    cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
        
            card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) translateZ(10px)`;
    });
    
    card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });

    // Effet de vague sur les boutons
    const buttons = document.querySelectorAll('.cta-button');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const circle = document.createElement('span');
            circle.style.left = x + 'px';
            circle.style.top = y + 'px';
            circle.className = 'ripple';
            
            button.appendChild(circle);
            setTimeout(() => circle.remove(), 1000);
        });
    });
});

// Formulaire de contact
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const button = contactForm.querySelector('button');
        const originalContent = button.innerHTML;
        
        // Animation de chargement
        button.innerHTML = '<div class="loader-advanced"></div>';
        button.classList.add('loading');
        
        // Simuler l'envoi
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Animation de succès
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.classList.remove('loading');
        button.classList.add('success');
        
        setTimeout(() => {
            button.innerHTML = originalContent;
            button.classList.remove('success');
            contactForm.reset();
        }, 3000);
    });
}

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

// Gestion du menu mobile et animations de base
document.addEventListener('DOMContentLoaded', () => {
    // Code existant pour le menu mobile...

    // Custom Cursor
    const cursor = document.querySelector('.custom-cursor');
    const links = document.querySelectorAll('a, button');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    links.forEach(link => {
        link.addEventListener('mouseenter', () => cursor.classList.add('active'));
        link.addEventListener('mouseleave', () => cursor.classList.remove('active'));
    });

    // Scroll Progress
    const scrollProgress = document.querySelector('.scroll-progress');
    window.addEventListener('scroll', () => {
        const scrollPercent = (window.scrollY) / (document.documentElement.scrollHeight - window.innerHeight);
        scrollProgress.style.setProperty('--scroll-percent', scrollPercent);
    });

    // Magnetic Buttons
    document.querySelectorAll('.magnetic-button').forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) * 0.1;
            const deltaY = (y - centerY) * 0.1;
            
            button.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            button.style.setProperty('--mouse-x', x + 'px');
            button.style.setProperty('--mouse-y', y + 'px');
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = '';
        });
    });

    // Tilt Effect
    document.querySelectorAll('.tilt').forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    // Kinetic Typography
    document.querySelectorAll('.kinetic-text').forEach(text => {
        const chars = text.textContent.split('');
        text.textContent = '';
        chars.forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animationDelay = `${i * 0.1}s`;
            text.appendChild(span);
        });
    });

    // Reveal on Scroll
    const revealCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.1
    });

    document.querySelectorAll('.reveal-on-scroll').forEach(element => {
        revealObserver.observe(element);
    });

    // Parallax Effect
    document.querySelectorAll('.parallax-container').forEach(container => {
        const layers = container.querySelectorAll('.parallax-layer');
        
        window.addEventListener('scroll', () => {
            const rect = container.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const scrolled = window.pageYOffset;
                layers.forEach(layer => {
                    const depth = layer.getAttribute('data-depth') || -0.2;
                    const movement = -(scrolled * depth);
                    layer.style.transform = `translateY(${movement}px)`;
                });
            }
        });
    });

    // Mesh Gradient Animation
    document.querySelectorAll('.mesh-gradient').forEach(element => {
        let x = 0;
        let y = 0;
        let dx = 2;
        let dy = 2;

        function animate() {
            x += dx;
            y += dy;

            if (x >= 100 || x <= 0) dx *= -1;
            if (y >= 100 || y <= 0) dy *= -1;

            element.style.setProperty('--x', x + '%');
            element.style.setProperty('--y', y + '%');

            requestAnimationFrame(animate);
        }

        animate();
    });

    // Card 3D Effect
    document.querySelectorAll('.card-3d').forEach(card => {
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

    // Typing Effect
    document.querySelectorAll('.typing-effect').forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        let i = 0;

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, 50);
            }
        }

        type();
    });

    // Path Animation
    document.querySelectorAll('.path-animation').forEach(element => {
        element.innerHTML = `<svg viewBox="0 0 ${element.offsetWidth} ${element.offsetHeight}">
            <path d="M0,${element.offsetHeight/2} C${element.offsetWidth/4},${element.offsetHeight/2} ${element.offsetWidth*3/4},${element.offsetHeight/2} ${element.offsetWidth},${element.offsetHeight/2}">
            </path>
        </svg>`;
    });

    // Liquid Button Effect
    document.querySelectorAll('.liquid-button').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const circle = document.createElement('div');
            const diameter = Math.max(button.clientWidth, button.clientHeight);
            const radius = diameter / 2;
            
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - button.offsetLeft - radius}px`;
            circle.style.top = `${e.clientY - button.offsetTop - radius}px`;
            circle.classList.add('liquid-circle');
            
            button.appendChild(circle);
            
            setTimeout(() => circle.remove(), 1000);
        });
    });
});

// Glitch Text Effect
document.querySelectorAll('.glitch-text').forEach(text => {
    const content = text.getAttribute('data-text');
    text.setAttribute('data-text', content);
});

// Gestion des effets de lumière
document.addEventListener('DOMContentLoaded', () => {
    // Effet de suivi de la souris pour les cartes avec aura
    const cards = document.querySelectorAll('.card-aura');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / card.clientWidth) * 100;
            const y = ((e.clientY - rect.top) / card.clientHeight) * 100;
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });

    // Animation des particules lumineuses pour les boutons
    const sparkleButtons = document.querySelectorAll('.sparkle-button');
    sparkleButtons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            button.style.setProperty('--spark-x', `${x}px`);
            button.style.setProperty('--spark-y', `${y}px`);
        });
    });

    // Effet de focus pour les champs de formulaire
    const inputs = document.querySelectorAll('.input-glow');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.closest('.form-group')?.classList.add('focused');
        });
        input.addEventListener('blur', () => {
            input.closest('.form-group')?.classList.remove('focused');
        });
    });

    // Animation du logo flottant
    const floatingLogos = document.querySelectorAll('.floating-logo');
    floatingLogos.forEach(logo => {
        let rotation = 0;
        setInterval(() => {
            rotation += 1;
            const y = Math.sin(rotation * Math.PI / 180) * 10;
            logo.style.transform = `translateY(${y}px)`;
        }, 20);
    });

    // Effet de vague lumineuse pour le menu
    const navLinks = document.querySelectorAll('.nav-glow');
    navLinks.forEach(link => {
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left;
            link.style.setProperty('--x', `${x}px`);
        });
    });

    // Gestion du chat
    const chatButton = document.querySelector('.chat-button');
    const chatWindow = document.querySelector('.chat-window');
    
    if (chatButton && chatWindow) {
        chatButton.addEventListener('click', () => {
            chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
            if (chatWindow.style.display === 'flex') {
                chatWindow.classList.add('fade-in');
            }
        });
    }

    // Animation de défilement fluide
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Effet de parallaxe pour le hero
    window.addEventListener('scroll', () => {
        const hero = document.querySelector('.hero');
        if (hero) {
            const scroll = window.pageYOffset;
            hero.style.backgroundPositionY = `${scroll * 0.5}px`;
        }
    });

    // Animation au scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card-aura, .text-glow, .glow-effect').forEach(el => {
        observer.observe(el);
    });
});

// Gestion des animations et interactions
document.addEventListener('DOMContentLoaded', () => {
    // Variables
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Gestion du menu mobile
    menuToggle?.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Fermeture du menu au clic sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle?.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Animation au scroll
    const scrollAnimations = () => {
        const elements = document.querySelectorAll('.reveal');
        const windowHeight = window.innerHeight;

        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', scrollAnimations);
    scrollAnimations();

    // Gestion de la navbar au scroll
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Animation des statistiques
    const animateStats = () => {
        const stats = document.querySelectorAll('.stat-number');
        
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateStat = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateStat);
                } else {
                    stat.textContent = target;
                }
            };

            updateStat();
        });
    };

    // Observer pour les statistiques
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stats-section').forEach(section => {
        statsObserver.observe(section);
    });

    // Animation des cartes au hover
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // Smooth scroll pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Gestion du formulaire de contact
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            // Animation de chargement
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading"></span>';

            try {
                // Simuler l'envoi du formulaire
                await new Promise(resolve => setTimeout(resolve, 1500));

                // Animation de succès
                submitBtn.innerHTML = '<span class="success-animation">✓</span>';
                
                // Réinitialisation du formulaire
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    contactForm.reset();
                }, 2000);

            } catch (error) {
                submitBtn.innerHTML = 'Erreur';
                submitBtn.disabled = false;
            }
        });
    }

    // Animation du texte du hero
    const animateHeroText = () => {
        const heroTitle = document.querySelector('.hero-title');
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
    };

    animateHeroText();
});

// Fonction pour afficher le message de succès
function showSuccessMessage() {
    const successMessage = document.querySelector('.success-message');
    successMessage.style.display = 'flex';
    setTimeout(() => {
        successMessage.classList.add('show');
    }, 100);

    // Cacher le message après 3 secondes
    setTimeout(() => {
        successMessage.classList.add('hide');
        setTimeout(() => {
            successMessage.style.display = 'none';
            successMessage.classList.remove('show', 'hide');
        }, 500);
    }, 3000);
}

// Gestionnaire du formulaire de contact
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Simulation d'envoi de formulaire
    setTimeout(() => {
        showSuccessMessage();
        this.reset();
    }, 1000);
}); 
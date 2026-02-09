document.addEventListener('DOMContentLoaded', () => {
    
    // 1. REVEAL ON SCROLL
    const revealElements = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // 2. PARTICLES ANIMATION
    const canvas = document.getElementById('contactParticles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = canvas.offsetHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        let particles = [];
        class Particle {
            constructor() {
                this.init();
            }
            init() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 1.2 + 0.3;
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = Math.random() * 0.4 - 0.2;
                this.opacity = Math.random() * 0.4;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.init();
                }
            }
            draw() {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        for (let i = 0; i < 80; i++) particles.push(new Particle());

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        }
        animate();
    }

    // 3. FORM SUBMISSION
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            vehicle: formData.get('vehicle'),
            service: formData.get('service'),
            message: formData.get('message'),
            privacy: formData.get('privacy')
        };

        // Validate
        if (!data.name || !data.email || !data.message) {
            showStatus('error', 'Vul alle verplichte velden in.');
            return;
        }

        if (!data.privacy) {
            showStatus('error', 'U moet akkoord gaan met de privacyverklaring.');
            return;
        }

        // Disable button during submission
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.querySelector('.btn-text').textContent;
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Verzenden...';

        try {
            // Create mailto link as fallback
            const subject = `Contactaanvraag van ${data.name}`;
            const body = `
Naam: ${data.name}
E-mail: ${data.email}
Telefoon: ${data.phone || 'Niet opgegeven'}
Voertuig type: ${data.vehicle || 'Niet opgegeven'}
Gewenste dienst: ${data.service || 'Niet opgegeven'}

Bericht:
${data.message}
            `.trim();

            const mailtoLink = `mailto:mobiclean@telenet.be?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

            // Try to use a backend service if available (FormSubmit, FormSpree, etc.)
            // For now, we'll use FormSubmit as it's free and doesn't require setup
            const response = await fetch('https://formsubmit.co/ajax/mobiclean@telenet.be', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    vehicle: data.vehicle,
                    service: data.service,
                    message: data.message,
                    _subject: subject,
                    _template: 'table',
                    _captcha: 'false'
                })
            });

            if (response.ok) {
                showStatus('success', 'Bedankt! Uw bericht is succesvol verzonden. We nemen zo snel mogelijk contact met u op.');
                contactForm.reset();
            } else {
                throw new Error('Server error');
            }

        } catch (error) {
            console.error('Form submission error:', error);
            
            // Fallback: open email client
            showStatus('error', 'Er is een fout opgetreden. We openen uw e-mailprogramma...');
            
            setTimeout(() => {
                const subject = `Contactaanvraag van ${data.name}`;
                const body = `
Naam: ${data.name}
E-mail: ${data.email}
Telefoon: ${data.phone || 'Niet opgegeven'}
Voertuig type: ${data.vehicle || 'Niet opgegeven'}
Gewenste dienst: ${data.service || 'Niet opgegeven'}

Bericht:
${data.message}
                `.trim();

                window.location.href = `mailto:mobiclean@telenet.be?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            }, 2000);
        } finally {
            // Re-enable button
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = originalBtnText;
        }
    });

    function showStatus(type, message) {
        formStatus.className = `form-status ${type}`;
        formStatus.textContent = message;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            formStatus.style.display = 'none';
        }, 5000);
    }

    // 4. HEADER SCROLL EFFECT
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.padding = '10px 0';
            header.style.background = 'rgba(3, 30, 73, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.padding = '15px 0';
            header.style.background = 'rgba(3, 30, 73, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // 5. SMOOTH SCROLL FOR ANCHOR LINKS
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 6. FORM VALIDATION VISUAL FEEDBACK
    const inputs = contactForm.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value.trim() === '') {
                input.style.borderColor = 'rgba(238, 4, 5, 0.5)';
            } else {
                input.style.borderColor = 'rgba(46, 213, 115, 0.3)';
            }
        });

        input.addEventListener('focus', () => {
            input.style.borderColor = 'var(--strong-red)';
        });
    });

    // 7. EMAIL VALIDATION
    const emailInput = document.getElementById('email');
    emailInput.addEventListener('blur', () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value && !emailRegex.test(emailInput.value)) {
            emailInput.style.borderColor = 'rgba(238, 4, 5, 0.5)';
            showStatus('error', 'Voer een geldig e-mailadres in.');
        } else if (emailInput.value) {
            emailInput.style.borderColor = 'rgba(46, 213, 115, 0.3)';
        }
    });
});
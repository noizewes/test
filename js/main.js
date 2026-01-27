document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Reveal Observer (Schuift elementen omhoog bij scrollen)
    const observerOptions = {
        threshold: 0.15, // Iets later triggeren voor een beter visueel effect
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optioneel: stop met observeren na de eerste keer reveal
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 2. Luxe Muis Light-Effect & Smooth Parallax
    const heroTitle = document.querySelector('.hero h1');
    let ticking = false;

    window.addEventListener('mousemove', (e) => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                // Lichtstraal in achtergrond (Carbon Glow)
                const x = (e.clientX / window.innerWidth) * 100;
                const y = (e.clientY / window.innerHeight) * 100;
                document.body.style.setProperty('--mouse-x', `${x}%`);
                document.body.style.setProperty('--mouse-y', `${y}%`);

                // Subtiele parallax op de Hero titel
                if (heroTitle && window.innerWidth > 768) { // Alleen op desktop voor performance
                    const moveX = (window.innerWidth / 2 - e.clientX) / 50;
                    const moveY = (window.innerHeight / 2 - e.clientY) / 50;
                    
                    // Gebruik translate3d voor hardware acceleratie (soepeler)
                    heroTitle.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
                }
                
                ticking = false;
            });
            ticking = true;
        }
    });

    // 3. Header Scroll Effect (Optioneel: header wordt donkerder bij scroll)
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(5, 5, 5, 0.95)';
            header.style.padding = '10px 0';
        } else {
            header.style.background = 'rgba(5, 5, 5, 0.85)';
            header.style.padding = '15px 0';
        }
    });
});


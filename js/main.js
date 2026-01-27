document.addEventListener('DOMContentLoaded', () => {
    // Reveal effect op scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Subtiel zweef-effect op de muis
    window.addEventListener('mousemove', (e) => {
        const x = (window.innerWidth / 2 - e.pageX) / 50;
        const y = (window.innerHeight / 2 - e.pageY) / 50;
        const heroContent = document.querySelector('.hero-content');
        if(heroContent) {
            heroContent.style.transform = `translate(${x}px, ${y}px)`;
        }
    });
});
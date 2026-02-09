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

    // 2. LIGHTBOX FUNCTIONALITY
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.querySelector('.lightbox-prev');
    const nextBtn = document.querySelector('.lightbox-next');
    
    let currentImages = [];
    let currentIndex = 0;

    // Get all photo items
    const photoItems = document.querySelectorAll('.photo-item');
    
    photoItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            // Get all images from the same vehicle section
            const vehicleSection = item.closest('.vehicle-showcase');
            const sectionImages = vehicleSection.querySelectorAll('.photo-item');
            
            // Build array of image data
            currentImages = Array.from(sectionImages).map(photoItem => {
                const img = photoItem.querySelector('img');
                const label = photoItem.querySelector('.photo-label');
                return {
                    src: img.src,
                    alt: img.alt,
                    caption: label ? label.textContent : ''
                };
            });
            
            // Find the index of clicked image within its section
            currentIndex = Array.from(sectionImages).indexOf(item);
            
            openLightbox();
        });
    });

    function openLightbox() {
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateLightboxImage();
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    function updateLightboxImage() {
        if (currentImages.length > 0) {
            const current = currentImages[currentIndex];
            lightboxImg.src = current.src;
            lightboxImg.alt = current.alt;
            lightboxCaption.textContent = current.caption;
        }
    }

    function showPrevImage() {
        currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateLightboxImage();
    }

    function showNextImage() {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateLightboxImage();
    }

    // Event listeners
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    });

    // 3. HEADER SCROLL EFFECT
    let lastScroll = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.padding = '10px 0';
            header.style.background = 'rgba(3, 30, 73, 0.98)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.padding = '15px 0';
            header.style.background = 'rgba(3, 30, 73, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScroll = currentScroll;
    });

    // 4. SMOOTH SCROLL FOR ANCHOR LINKS
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. LAZY LOAD IMAGES (OPTIONAL ENHANCEMENT)
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
});
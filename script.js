// Intersection Observer for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => observer.observe(el));

    // Mouse movement interaction for the 3D card
    const heroVisual = document.querySelector('.hero-visual');
    const frontCard = document.querySelector('.front');
    const backCard = document.querySelector('.back');

    if (heroVisual && frontCard && backCard) {
        heroVisual.addEventListener('mousemove', (e) => {
            const rect = heroVisual.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            // Apply slight rotation based on cursor
            frontCard.style.transform = `translateZ(20px) rotateX(${rotateX + 10}deg) rotateY(${rotateY - 15}deg)`;
            backCard.style.transform = `translateZ(-20px) rotateX(${rotateX + 10}deg) rotateY(${rotateY - 15}deg) translateX(40px) translateY(40px)`;
        });

        heroVisual.addEventListener('mouseleave', () => {
            // Reset to default
            frontCard.style.transform = `translateZ(20px) rotateY(-15deg) rotateX(10deg)`;
            backCard.style.transform = `translateZ(-20px) rotateY(-15deg) rotateX(10deg) translateX(40px) translateY(40px)`;
            
            // Re-enable smooth transition when leaving
            frontCard.style.transition = 'transform 0.5s ease';
            backCard.style.transition = 'transform 0.5s ease';
            
            setTimeout(() => {
                frontCard.style.transition = 'none';
                backCard.style.transition = 'none';
            }, 500);
        });
    }
});

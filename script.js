// ==========================================
// Credica Landing Page — Interactions
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // --------------------
    // Scroll Animations
    // --------------------
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.scroll-animate');
    animatedElements.forEach(el => observer.observe(el));

    // --------------------
    // iPhone Screen Carousel
    // --------------------
    const screens = document.querySelectorAll('.app-screen');
    const dots = document.querySelectorAll('.screen-dot');
    const screenLabel = document.querySelector('.screen-label');
    const screenLabels = ['首頁總覽', '聯絡人管理', 'QR 名片交換', '人脈圖譜', '交換結果'];
    let currentScreen = 0;
    let carouselInterval = null;

    function showScreen(index) {
        screens.forEach(s => s.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        screens[index].classList.add('active');
        dots[index].classList.add('active');
        if (screenLabel) screenLabel.textContent = screenLabels[index];
        currentScreen = index;
    }

    function nextScreen() {
        showScreen((currentScreen + 1) % screens.length);
    }

    if (screens.length > 0) {
        carouselInterval = setInterval(nextScreen, 4000);

        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                clearInterval(carouselInterval);
                showScreen(parseInt(dot.dataset.dot));
                carouselInterval = setInterval(nextScreen, 4000);
            });
        });
    }

    // --------------------
    // Mobile Hamburger Menu
    // --------------------
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when clicking a link
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // --------------------
    // Navbar Background on Scroll
    // --------------------
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(3, 0, 20, 0.95)';
            } else {
                navbar.style.background = 'rgba(3, 0, 20, 0.85)';
            }
        }, { passive: true });
    }

    // --------------------
    // Smooth scroll for anchor links
    // --------------------
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --------------------
    // Contact Form → Email
    // --------------------
    const contactForm = document.getElementById('contactForm');
    const contactSuccess = document.getElementById('contactSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const company = document.getElementById('contactCompany').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            const subject = encodeURIComponent(`[Credica 網站留言] 來自 ${name}`);
            const body = encodeURIComponent(
                `姓名：${name}\n` +
                `Email：${email}\n` +
                (company ? `公司 / 組織：${company}\n` : '') +
                `\n留言內容：\n${message}`
            );

            // Open mailto link
            window.location.href = `mailto:william.tzeng@gmail.com?subject=${subject}&body=${body}`;

            // Show success state after a short delay
            setTimeout(() => {
                contactForm.style.display = 'none';
                document.querySelector('.contact-desc').style.display = 'none';
                contactSuccess.style.display = 'block';
            }, 500);
        });
    }
});

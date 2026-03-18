// ==========================================
// Credica Landing Page — Interactions
// ==========================================

document.addEventListener('DOMContentLoaded', () => {

    // --------------------
    // iPhone Screen Carousel
    // --------------------
    const screens = document.querySelectorAll('.app-screen');
    const dots = document.querySelectorAll('.screen-dot');
    const screenLabel = document.querySelector('.screen-label');
    let screenLabels = ['首頁總覽', '聯絡人管理', 'QR 名片交換', '人脈圖譜', '交換結果'];
    const screenLabelKeys = ['screen.label_home', 'screen.label_contacts', 'screen.label_exchange', 'screen.label_graph', 'screen.label_result'];

    // Allow i18n.js to update screen labels
    window.updateScreenLabels = function (translations) {
        if (!translations) return;
        screenLabelKeys.forEach(function (key, i) {
            var val = key.split('.').reduce(function (o, k) { return o && o[k]; }, translations);
            if (val) screenLabels[i] = val;
        });
        if (screenLabel) screenLabel.textContent = screenLabels[currentScreen];
    };
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
                const navHeight = document.querySelector('nav') ? document.querySelector('nav').offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

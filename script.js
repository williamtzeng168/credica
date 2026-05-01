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
    let screenLabels = ['首頁總覽', '我的組織', '活動行程', '憑證錢包', '統一 QR'];
    const screenLabelKeys = ['screen.label_home', 'screen.label_orgs', 'screen.label_events', 'screen.label_creds', 'screen.label_qr'];

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

    // --------------------
    // Section 2 — Vertical Scenes Tabs (R4-B-fix-3)
    // --------------------
    (function () {
        const sceneTabs = document.querySelectorAll('.scene-tab');
        const scenePhones = document.querySelectorAll('.scene-phone');
        const sceneDescs = document.querySelectorAll('.scene-desc');
        const sceneSection = document.getElementById('scenes');
        if (!sceneTabs.length || !sceneSection) return;

        let activeIdx = 0;
        let autoTimer = null;
        let userInteracted = false;

        function setActive(idx) {
            sceneTabs.forEach((t, i) => {
                t.classList.toggle('active', i === idx);
                t.setAttribute('aria-selected', i === idx ? 'true' : 'false');
            });
            scenePhones.forEach((p, i) => p.classList.toggle('active', i === idx));
            sceneDescs.forEach((d, i) => d.classList.toggle('active', i === idx));
            activeIdx = idx;
        }

        function startAutoRotate() {
            if (userInteracted || autoTimer) return;
            autoTimer = setInterval(() => {
                setActive((activeIdx + 1) % sceneTabs.length);
            }, 5000);
        }

        function stopAutoRotate() {
            if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
        }

        sceneTabs.forEach((tab, idx) => {
            tab.addEventListener('click', () => {
                userInteracted = true;
                stopAutoRotate();
                setActive(idx);
            });
        });

        if ('IntersectionObserver' in window) {
            const obs = new IntersectionObserver((entries) => {
                entries.forEach(e => {
                    if (e.isIntersecting && !userInteracted) startAutoRotate();
                    else stopAutoRotate();
                });
            }, { threshold: 0.3 });
            obs.observe(sceneSection);
        } else {
            startAutoRotate();
        }
    })();
});

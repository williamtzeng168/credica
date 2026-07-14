/* ============================================================
   nav.js — Credica 全站導覽列「單一來源」元件
   建立:2026-07-14(結構優先 A・共用 nav)

   用法:在每頁 <body> 開頭放一個掛載點,並於 </body> 前引入本檔:
     <div id="site-nav" data-active="business" data-cta="create"
          style="min-height:72px"></div>
     ...
     <script src="nav.js" defer></script>

   data-active: personal | business | enterprise | tutorial | about
                → 標記目前頁面(nav 連結加粗、行動選單 active)
   data-cta:    download | create | consult
                → 分眾主 CTA(個人版下載 App、組織建立、企業諮詢)

   本元件「自帶樣式」(literal Navy 色值,不依賴各頁 CSS 變數),
   可安全鋪到任何頁面。取代各頁手抄的 <nav> 與行動選單,
   nav 相關 CSS 與 hamburger JS 皆由本檔擁有。
   ============================================================ */
(function () {
  'use strict';

  var APP_STORE = 'https://apps.apple.com/tw/app/credica-%E5%8F%AF%E9%A9%97%E8%AD%89%E7%9A%84%E6%95%B8%E4%BD%8D%E5%90%8D%E7%89%87/id6760047580';
  var LOGIN = 'https://dashboard.credica.app';

  // 分眾主 CTA 設定
  var CTA = {
    download: { label: '下載 App', href: APP_STORE, target: '_blank', icon: 'download' },
    create:   { label: '免費建立組織', href: 'https://apply.credica.app/?plan=free', target: '_blank', icon: 'arrow' },
    consult:  { label: '預約諮詢', href: 'enterprise.html#contact', target: '_self', icon: 'arrow' }
  };

  // 全站導覽連結(順序固定)
  var LINKS = [
    { key: 'personal',   label: '個人版',   href: 'index.html' },
    { key: 'business',   label: '中小組織', href: 'business.html' },
    { key: 'enterprise', label: '企業方案', href: 'enterprise.html' },
    { key: 'tutorial',   label: '互動教學', href: 'tutorial.html' },
    { key: 'about',      label: '關於',     href: 'about.html' }
  ];

  var ICONS = {
    download: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>',
    arrow: '<svg fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
    login: '<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>'
  };

  var CSS = [
    '#site-nav{display:block}',
    '.credica-nav{position:sticky;top:0;left:0;right:0;z-index:100;padding:1rem 2.5rem;display:flex;align-items:center;justify-content:space-between;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);background:rgba(255,255,255,0.85);border-bottom:1px solid rgba(15,18,32,0.08);box-shadow:0 1px 3px rgba(0,0,0,0.04)}',
    '.credica-nav .logo{display:flex;align-items:center;gap:0.6rem;font-weight:700;font-size:1.4rem;letter-spacing:-0.03em;color:#0F1220;text-decoration:none}',
    '.credica-nav .nav-mid{display:flex;gap:2rem;flex:1;justify-content:center}',
    '.credica-nav .nav-mid a{color:rgba(15,18,32,0.55);text-decoration:none;font-size:0.95rem;font-weight:400;transition:color 0.2s}',
    '.credica-nav .nav-mid a:hover{color:#1E2951}',
    '.credica-nav .nav-mid a.active{color:#1E2951;font-weight:600}',
    '.credica-nav .nav-login{display:inline-flex;align-items:center;gap:0.4rem;margin-right:0.7rem;padding:0.6rem 1.3rem;background:transparent;color:#1E2951;border:1px solid rgba(15,18,32,0.08);border-radius:10px;font-size:0.95rem;font-weight:600;text-decoration:none;transition:all 0.2s}',
    '.credica-nav .nav-login:hover{border-color:#1E2951;background:rgba(30,41,81,0.05)}',
    '.credica-nav .nav-login svg{width:16px;height:16px}',
    '.credica-nav .nav-dl{display:flex;align-items:center;gap:0.5rem;padding:0.6rem 1.4rem;background:#1E2951;color:#fff;border:none;border-radius:10px;font-size:0.95rem;font-weight:600;cursor:pointer;transition:all 0.2s;text-decoration:none}',
    '.credica-nav .nav-dl:hover{background:#141B3B;transform:translateY(-1px);box-shadow:0 4px 20px rgba(30,41,81,0.3)}',
    '.credica-nav .nav-dl svg{width:16px;height:16px}',
    '.credica-nav .hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:8px;z-index:1001}',
    '.credica-nav .hamburger span{width:24px;height:2px;background:#0F1220;transition:all 0.3s ease;border-radius:2px}',
    '.credica-nav .hamburger.active span:nth-child(1){transform:rotate(45deg) translate(5px,5px)}',
    '.credica-nav .hamburger.active span:nth-child(2){opacity:0}',
    '.credica-nav .hamburger.active span:nth-child(3){transform:rotate(-45deg) translate(5px,-5px)}',
    '.credica-mobile-menu{display:none;position:fixed;top:0;left:0;width:100%;height:100vh;background:rgba(255,255,255,0.97);backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);z-index:999;flex-direction:column;justify-content:center;align-items:center;gap:32px;opacity:0;pointer-events:none;transition:opacity 0.3s ease}',
    '.credica-mobile-menu.active{opacity:1;pointer-events:all}',
    '.credica-mobile-menu a{color:#0F1220;text-decoration:none;font-size:1.4rem;font-weight:500;transition:color 0.3s ease}',
    '.credica-mobile-menu a:hover,.credica-mobile-menu a.active{color:#1E2951}',
    '@media (max-width:968px){.credica-nav{padding:1rem 1.5rem}.credica-nav .nav-mid{display:none}.credica-nav .nav-login{display:none}.credica-nav .hamburger{display:flex}.credica-mobile-menu{display:flex}}'
  ].join('');

  function esc(s) { return String(s); }

  function midLinks(active) {
    return LINKS.map(function (l) {
      var cls = l.key === active ? ' class="active"' : '';
      return '<a href="' + l.href + '"' + cls + '>' + esc(l.label) + '</a>';
    }).join('');
  }

  function render(mount) {
    var active = mount.getAttribute('data-active') || '';
    var ctaKey = mount.getAttribute('data-cta') || 'download';
    var cta = CTA[ctaKey] || CTA.download;

    var nav =
      '<nav class="credica-nav">' +
        '<a href="index.html" class="logo">' +
          '<img src="credica-wordmark.png" alt="Credica" style="height:40px;width:auto;display:block"></a>' +
        '<div class="nav-mid">' + midLinks(active) + '</div>' +
        '<button class="hamburger" aria-label="開啟選單" aria-expanded="false" aria-controls="credica-mobile-menu">' +
          '<span></span><span></span><span></span></button>' +
        '<a href="' + LOGIN + '" class="nav-login" target="_blank" rel="noopener">' + ICONS.login + '登入</a>' +
        '<a href="' + cta.href + '" class="nav-dl" target="' + cta.target + '"' +
          (cta.target === '_blank' ? ' rel="noopener"' : '') + '>' + ICONS[cta.icon] + esc(cta.label) + '</a>' +
      '</nav>';

    var menu =
      '<div class="credica-mobile-menu" id="credica-mobile-menu">' +
        midLinks(active) +
        '<a href="' + LOGIN + '" class="nav-dl" style="text-align:center;background:transparent;color:#1E2951;border:1px solid rgba(15,18,32,0.08);box-shadow:none;" target="_blank" rel="noopener">登入</a>' +
        '<a href="' + cta.href + '" class="nav-dl" style="text-align:center;" target="' + cta.target + '"' +
          (cta.target === '_blank' ? ' rel="noopener"' : '') + '>' + esc(cta.label) + '</a>' +
      '</div>';

    mount.innerHTML = nav + menu;
    mount.style.minHeight = '';

    // hamburger 開關(元件自持)
    var burger = mount.querySelector('.hamburger');
    var mobileMenu = mount.querySelector('.credica-mobile-menu');
    if (burger && mobileMenu) {
      burger.addEventListener('click', function () {
        var open = burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      mobileMenu.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          burger.classList.remove('active');
          mobileMenu.classList.remove('active');
          burger.setAttribute('aria-expanded', 'false');
        });
      });
      // Esc 關閉
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
          burger.classList.remove('active');
          mobileMenu.classList.remove('active');
          burger.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  function init() {
    var mount = document.getElementById('site-nav');
    if (!mount) return;
    if (!document.getElementById('credica-nav-style')) {
      var style = document.createElement('style');
      style.id = 'credica-nav-style';
      style.textContent = CSS;
      document.head.appendChild(style);
    }
    render(mount);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

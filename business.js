(function () {
  'use strict';

  var menuButton = document.querySelector('.menu-button');
  var mobileMenu = document.getElementById('mobile-nav');

  function setMenuOpen(open, restoreFocus) {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute('aria-expanded', open ? 'true' : 'false');
    menuButton.setAttribute('aria-label', open ? '關閉導覽選單' : '開啟導覽選單');
    menuButton.textContent = open ? '關閉' : '選單';
    mobileMenu.hidden = !open;
    if (!open && restoreFocus) menuButton.focus();
  }

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
    });
    mobileMenu.addEventListener('click', function (event) {
      if (event.target.closest('a')) setMenuOpen(false);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        setMenuOpen(false, true);
      }
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 820) setMenuOpen(false);
    });
  }

  var replayButton = document.getElementById('replay-flex');
  var flexConversation = document.getElementById('flex-conversation');
  if (replayButton && flexConversation) {
    replayButton.addEventListener('click', function () {
      flexConversation.classList.remove('is-replaying');
      void flexConversation.offsetWidth;
      flexConversation.classList.add('is-replaying');
      replayButton.textContent = '對話已重新播放';
      window.setTimeout(function () {
        replayButton.textContent = '重新播放對話';
      }, 1400);
    });
  }
})();

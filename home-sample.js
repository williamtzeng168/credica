(function () {
  'use strict';

  var button = document.querySelector('.menu-button');
  var menu = document.getElementById('mobile-nav');
  if (!button || !menu) return;

  function setOpen(open, restoreFocus) {
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
    button.setAttribute('aria-label', open ? '關閉導覽選單' : '開啟導覽選單');
    button.textContent = open ? '關閉' : '選單';
    menu.hidden = !open;
    if (!open && restoreFocus) button.focus();
  }

  button.addEventListener('click', function () {
    setOpen(button.getAttribute('aria-expanded') !== 'true');
  });

  menu.addEventListener('click', function (event) {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false, true);
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 820 && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false, false);
    }
  });
})();

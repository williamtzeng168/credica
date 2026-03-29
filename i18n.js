// ==========================================
// Credica Landing Page — i18n Engine (inline)
// ==========================================

(function () {
    'use strict';

    const SUPPORTED = ['zh-TW', 'zh-CN', 'en', 'ja', 'vi', 'th'];
    const DEFAULT = 'zh-TW';
    const KEY = 'credica-lang';
    const META = {
        'zh-TW': { flag: '🇹🇼', label: '繁中' },
        'zh-CN': { flag: '🇨🇳', label: '简中' },
        'en':    { flag: '🇺🇸', label: 'EN' },
        'ja':    { flag: '🇯🇵', label: '日本語' },
        'vi':    { flag: '🇻🇳', label: 'Tiếng Việt' },
        'th':    { flag: '🇹🇭', label: 'ไทย' }
    };

    // I18N_DATA is loaded from i18n-data.js (must be included before this script)
    function getTranslations(lang) {
        return (typeof I18N_DATA !== 'undefined') ? I18N_DATA[lang] : null;
    }

    function resolve(obj, key) {
        return key.split('.').reduce(function (o, k) {
            return o && o[k] !== undefined ? o[k] : null;
        }, obj);
    }

    function detect() {
        var stored = localStorage.getItem(KEY);
        if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;

        var langs = navigator.languages || [navigator.language || ''];
        for (var i = 0; i < langs.length; i++) {
            var l = langs[i];
            if (SUPPORTED.indexOf(l) !== -1) return l;
            if (l.indexOf('zh') === 0) {
                if (l.indexOf('Hans') !== -1 || l === 'zh-CN') return 'zh-CN';
                return 'zh-TW';
            }
            var p = l.substring(0, 2);
            for (var j = 0; j < SUPPORTED.length; j++) {
                if (SUPPORTED[j].substring(0, 2) === p) return SUPPORTED[j];
            }
        }
        return DEFAULT;
    }

    function apply(t) {
        if (!t) return;

        var title = resolve(t, 'meta.title');
        if (title) {
            document.title = title;
            var og = document.querySelector('meta[property="og:title"]');
            if (og) og.setAttribute('content', title);
        }
        var desc = resolve(t, 'meta.description');
        if (desc) {
            var m = document.querySelector('meta[name="description"]');
            if (m) m.setAttribute('content', desc);
            var ogd = document.querySelector('meta[property="og:description"]');
            if (ogd) ogd.setAttribute('content', desc);
        }

        var els = document.querySelectorAll('[data-i18n]');
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            var key = el.getAttribute('data-i18n');
            var val = resolve(t, key);
            if (val !== null) {
                if (val.indexOf('<a ') !== -1 || val.indexOf('<br') !== -1) {
                    el.innerHTML = val;
                } else {
                    el.textContent = val;
                }
            }
        }

        var phs = document.querySelectorAll('[data-i18n-placeholder]');
        for (var j = 0; j < phs.length; j++) {
            var ph = phs[j];
            var v = resolve(t, ph.getAttribute('data-i18n-placeholder'));
            if (v !== null) ph.setAttribute('placeholder', v);
        }

        if (typeof window.updateScreenLabels === 'function') {
            window.updateScreenLabels(t);
        }
    }

    function switchLang(lang) {
        if (SUPPORTED.indexOf(lang) === -1) return;
        localStorage.setItem(KEY, lang);
        document.documentElement.setAttribute('lang', lang);
        apply(getTranslations(lang));
        buildSwitcher(lang);
    }

    function buildSwitcher(current) {
        // Clean up old
        var old = document.getElementById('i18n-sw');
        if (old) old.remove();
        var oldM = document.getElementById('i18n-sw-m');
        if (oldM) oldM.remove();

        // Desktop switcher
        var sw = document.createElement('div');
        sw.id = 'i18n-sw';
        sw.className = 'i18n-sw';

        var btn = document.createElement('button');
        btn.className = 'i18n-btn';
        btn.innerHTML = META[current].flag + ' ' + META[current].label + ' ▾';
        sw.appendChild(btn);

        var dd = document.createElement('div');
        dd.className = 'i18n-dd';
        SUPPORTED.forEach(function (lang) {
            var opt = document.createElement('button');
            opt.className = 'i18n-opt' + (lang === current ? ' on' : '');
            opt.textContent = META[lang].flag + ' ' + META[lang].label;
            opt.onclick = function (e) { e.stopPropagation(); switchLang(lang); };
            dd.appendChild(opt);
        });
        sw.appendChild(dd);

        btn.onclick = function (e) { e.stopPropagation(); dd.classList.toggle('show'); };
        document.addEventListener('click', function () { dd.classList.remove('show'); });

        var navbar = document.querySelector('.navbar') || document.querySelector('nav');
        var cta = document.querySelector('.nav-cta') || document.querySelector('.nav-dl');
        if (navbar && cta) navbar.insertBefore(sw, cta);
        else if (navbar) navbar.appendChild(sw);

        // Mobile switcher
        var mm = document.querySelector('.mobile-menu');
        if (mm) {
            var msw = document.createElement('div');
            msw.id = 'i18n-sw-m';
            msw.className = 'i18n-sw-m';
            SUPPORTED.forEach(function (lang) {
                var mb = document.createElement('button');
                mb.className = 'i18n-mb' + (lang === current ? ' on' : '');
                mb.textContent = META[lang].flag;
                mb.title = META[lang].label;
                mb.onclick = function () { switchLang(lang); };
                msw.appendChild(mb);
            });
            mm.insertBefore(msw, mm.firstChild);
        }
    }

    function injectCSS() {
        var s = document.createElement('style');
        s.textContent =
            '.i18n-sw{position:relative;margin:0 8px;z-index:1000}' +
            '.i18n-btn{background:rgba(0,0,0,.04);border:1px solid rgba(0,0,0,.1);border-radius:8px;padding:6px 14px;color:var(--text-2,#475569);font-size:13px;cursor:pointer;display:flex;align-items:center;gap:4px;transition:all .2s;white-space:nowrap;font-family:inherit}' +
            '.i18n-btn:hover{background:rgba(79,70,229,.06);border-color:rgba(79,70,229,.2);color:var(--teal-b,#4F46E5)}' +
            '.i18n-dd{position:absolute;top:calc(100% + 6px);right:0;background:rgba(255,255,255,.97);border:1px solid rgba(0,0,0,.1);border-radius:10px;padding:4px;min-width:160px;display:none;box-shadow:0 8px 32px rgba(0,0,0,.12);backdrop-filter:blur(20px)}' +
            '.i18n-dd.show{display:block;animation:i18nFI .15s ease}' +
            '@keyframes i18nFI{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}' +
            '.i18n-opt{display:block;width:100%;text-align:left;background:none;border:none;color:var(--text-2,#475569);font-size:13px;padding:8px 12px;cursor:pointer;border-radius:6px;transition:all .15s;font-family:inherit}' +
            '.i18n-opt:hover{background:rgba(79,70,229,.06);color:var(--text,#1E293B)}' +
            '.i18n-opt.on{background:rgba(79,70,229,.1);color:var(--teal-b,#4F46E5)}' +
            '.i18n-sw-m{display:flex;gap:6px;padding:16px 24px 8px;flex-wrap:wrap}' +
            '.i18n-mb{background:rgba(0,0,0,.04);border:1px solid rgba(0,0,0,.08);border-radius:8px;padding:6px 10px;color:var(--text-2,#475569);font-size:16px;cursor:pointer;transition:all .15s}' +
            '.i18n-mb:hover{background:rgba(79,70,229,.06)}' +
            '.i18n-mb.on{background:rgba(79,70,229,.1);border-color:rgba(79,70,229,.3)}' +
            '@media(max-width:768px){.i18n-sw{display:none}}';
        document.head.appendChild(s);
    }

    function init() {
        injectCSS();
        var lang = detect();
        document.documentElement.setAttribute('lang', lang);
        // Only apply translations for non-default language (zh-TW is already in HTML)
        if (lang !== DEFAULT) {
            apply(getTranslations(lang));
        }
        buildSwitcher(lang);
    }

    window.i18n = { switchLanguage: switchLang };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

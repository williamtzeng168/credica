(function () {
  'use strict';

  var measurementId = 'G-VEPFXCYNHN';
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);

  var params = new URLSearchParams(window.location.search);
  var campaignSource = (params.get('utm_source') || '').toLowerCase();
  var referrerHost = '';
  try { referrerHost = document.referrer ? new URL(document.referrer).hostname.toLowerCase() : ''; } catch (error) {}

  var aiSource = '';
  if (campaignSource === 'chatgpt.com' || referrerHost === 'chatgpt.com') aiSource = 'chatgpt';
  else if (campaignSource.indexOf('perplexity') !== -1 || referrerHost.indexOf('perplexity.ai') !== -1) aiSource = 'perplexity';
  else if (campaignSource.indexOf('claude') !== -1 || referrerHost.indexOf('claude.ai') !== -1) aiSource = 'claude';
  else if (campaignSource.indexOf('gemini') !== -1 || referrerHost.indexOf('gemini.google.com') !== -1) aiSource = 'gemini';

  if (aiSource) {
    window.gtag('event', 'ai_referral', {
      ai_source: aiSource,
      landing_page: window.location.pathname
    });
  }

  var lcp = 0;
  var cls = 0;
  var inp = 0;
  var sent = false;

  function observe(type, callback, options) {
    if (!window.PerformanceObserver || !PerformanceObserver.supportedEntryTypes || PerformanceObserver.supportedEntryTypes.indexOf(type) === -1) return;
    try { new PerformanceObserver(callback).observe(options || { type: type, buffered: true }); } catch (error) {}
  }

  observe('largest-contentful-paint', function (list) {
    var entries = list.getEntries();
    if (entries.length) lcp = entries[entries.length - 1].startTime;
  });
  observe('layout-shift', function (list) {
    list.getEntries().forEach(function (entry) { if (!entry.hadRecentInput) cls += entry.value; });
  });
  observe('event', function (list) {
    list.getEntries().forEach(function (entry) { if (entry.duration > inp) inp = entry.duration; });
  }, { type: 'event', buffered: true, durationThreshold: 40 });

  function sendWebVitals() {
    if (sent) return;
    sent = true;
    if (lcp) window.gtag('event', 'web_vital', { metric_name: 'LCP', metric_value: Math.round(lcp), page_path: window.location.pathname });
    window.gtag('event', 'web_vital', { metric_name: 'CLS', metric_value: Math.round(cls * 1000), page_path: window.location.pathname });
    if (inp) window.gtag('event', 'web_vital', { metric_name: 'INP', metric_value: Math.round(inp), page_path: window.location.pathname });
  }

  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') sendWebVitals(); });
  window.addEventListener('pagehide', sendWebVitals, { once: true });

  window.addEventListener('load', function () {
    var analytics = document.createElement('script');
    analytics.async = true;
    analytics.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
    document.head.appendChild(analytics);
  }, { once: true });
})();

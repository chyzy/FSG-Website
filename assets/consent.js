// Cookie consent for flightsimgeeks.com: Google Consent Mode v2, basic implementation.
//
// Nothing from Google loads until the visitor clicks Accept — no request, no cookie. The
// choice is remembered in localStorage ("granted" / "denied"), and every footer has a
// "Cookie settings" button that brings the banner back, so consent can be withdrawn as
// easily as it was given. Withdrawing deletes the Google Analytics cookies.
//
// Every page loads this file with `defer` in place of the Google tag. 404.html loads it with
// data-banner="off": it only honours a choice made elsewhere and never asks.
//
// Changing what is collected or which cookies are set means updating section 06 of the
// privacy policy (privacy/index.html#website) in the same commit.
(function () {
  'use strict';

  var GA_ID = 'G-KZ9D2EBDB4';
  var STORAGE_KEY = 'fsg-consent';

  var script = document.currentScript;
  var bannerEnabled = !(script && script.dataset.banner === 'off');
  var privacyUrl = new URL('../privacy/#website', script ? script.src : location.href).href;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  function signals(state) {
    return {
      ad_storage: state,
      ad_user_data: state,
      ad_personalization: state,
      analytics_storage: state
    };
  }

  gtag('consent', 'default', signals('denied'));
  gtag('set', 'ads_data_redaction', true);

  function readChoice() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function saveChoice(choice) {
    try { localStorage.setItem(STORAGE_KEY, choice); } catch (e) { /* this page view only */ }
  }

  var tagLoaded = false;

  function loadTag() {
    if (tagLoaded) return;
    tagLoaded = true;
    // `config` goes in only now, after the update to "granted", so even the first page view
    // is measured with cookies rather than as an anonymous ping.
    gtag('js', new Date());
    gtag('config', GA_ID);
    var tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(tag);
  }

  // GA4 sets its cookies on the widest domain it can (".flightsimgeeks.com"), so every
  // variant has to be expired for the deletion to stick.
  function deleteAnalyticsCookies() {
    var host = location.hostname;
    var domains = ['', host, '.' + host];
    document.cookie.split(';').forEach(function (pair) {
      var name = pair.split('=')[0].trim();
      if (name !== '_ga' && name.indexOf('_ga_') !== 0) return;
      domains.forEach(function (domain) {
        document.cookie = name + '=; Max-Age=0; path=/' + (domain ? '; domain=' + domain : '');
      });
    });
  }

  function apply(choice) {
    gtag('consent', 'update', signals(choice));
    if (choice === 'granted') {
      loadTag();
    } else {
      deleteAnalyticsCookies();
    }
  }

  var stored = readChoice();
  if (stored === 'granted') apply('granted');

  if (!bannerEnabled) return;

  var banner = null;

  function buildBanner() {
    banner = document.createElement('div');
    banner.className = 'consent';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.hidden = true;
    banner.innerHTML =
      '<p class="consent-text">' +
        '<b>Can we get a cookie, please?</b> We\'d like to use Google Analytics to see how visitors ' +
        'find and use this site and to measure our ads. Nothing is loaded unless you accept. ' +
        'Thank you! ' +
        '<a href="' + privacyUrl + '">Privacy policy</a>' +
        '<span class="consent-current"></span>' +
      '</p>' +
      '<div class="consent-actions">' +
        '<button type="button" class="btn btn-ghost" data-choice="denied">Reject</button>' +
        '<button type="button" class="btn btn-ghost" data-choice="granted">Accept</button>' +
      '</div>';

    banner.addEventListener('click', function (event) {
      var button = event.target.closest('[data-choice]');
      if (!button) return;
      var choice = button.getAttribute('data-choice');
      saveChoice(choice);
      apply(choice);
      banner.hidden = true;
    });

    document.body.appendChild(banner);
  }

  function showBanner(fromSettings) {
    if (!banner) buildBanner();
    var current = readChoice();
    banner.querySelector('.consent-current').textContent =
      fromSettings && current ? 'Your current choice: ' + (current === 'granted' ? 'accepted.' : 'rejected.') : '';
    banner.hidden = false;
    if (fromSettings) banner.querySelector('[data-choice]').focus();
  }

  document.querySelectorAll('[data-consent-settings]').forEach(function (button) {
    button.addEventListener('click', function () { showBanner(true); });
  });

  if (stored !== 'granted' && stored !== 'denied') showBanner(false);
})();

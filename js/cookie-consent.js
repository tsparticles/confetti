(function () {
  const CONSENT_KEY = 'tsparticles-confetti/cookie-consent-v1';
  const GA_MEASUREMENT_ID = 'G-80MY3TZM79';
  const ADSENSE_CLIENT_ID = 'ca-pub-1784552607103901';

  const defaultConsent = {
    analytics: false,
    adsense: false,
  };

  let consent = readConsent();

  function readConsent() {
    try {
      const rawConsent = localStorage.getItem(CONSENT_KEY);

      if (!rawConsent) {
        return undefined;
      }

      const parsed = JSON.parse(rawConsent);

      return {
        analytics: !!parsed.analytics,
        adsense: !!parsed.adsense,
      };
    } catch (err) {
      console.warn('Cannot read cookie consent preferences.', err);

      return undefined;
    }
  }

  function writeConsent(nextConsent) {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(nextConsent));
  }

  function hasUserChoice() {
    return !!consent;
  }

  function loadScript(id, src, attributes) {
    if (document.getElementById(id)) {
      return;
    }

    const script = document.createElement('script');

    script.id = id;
    script.src = src;
    script.async = true;

    Object.entries(attributes || {}).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });

    document.head.appendChild(script);
  }

  function applyConsent(activeConsent) {
    if (activeConsent.analytics) {
      window.dataLayer = window.dataLayer || [];
      window.gtag =
        window.gtag ||
        function () {
          window.dataLayer.push(arguments);
        };

      window.gtag('js', new Date());
      window.gtag('config', GA_MEASUREMENT_ID);

      loadScript('ga-script', `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
    }

    if (activeConsent.adsense) {
      loadScript(
        'adsense-script',
        `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`,
        {
          crossorigin: 'anonymous',
        }
      );
    }
  }

  function closeBanner() {
    const banner = document.getElementById('cookieConsentBanner');

    if (banner) {
      banner.remove();
    }
  }

  function saveAndApply(nextConsent) {
    consent = nextConsent;
    writeConsent(nextConsent);
    applyConsent(nextConsent);
    closeBanner();
  }

  function createBanner() {
    if (document.getElementById('cookieConsentBanner')) {
      return;
    }

    const banner = document.createElement('div');
    const consentState = consent || defaultConsent;

    banner.id = 'cookieConsentBanner';
    banner.className = 'cookie-consent-banner';

    banner.innerHTML = `
      <div class="cookie-consent-content">
        <p class="cookie-consent-title">Cookie settings</p>
        <p class="cookie-consent-text">
          We use cookies for analytics and ads. You can accept all, reject all, or choose each category.
          Read the <a class="cookie-consent-link" href="/cookie-policy.html" target="_blank" rel="noopener noreferrer">cookie policy</a>.
        </p>
        <label class="cookie-consent-option">
          <input id="cookieConsentAnalytics" type="checkbox" ${
            consentState.analytics ? 'checked' : ''
          } />
          <span>Analytics</span>
        </label>
        <label class="cookie-consent-option">
          <input id="cookieConsentAdsense" type="checkbox" ${consentState.adsense ? 'checked' : ''} />
          <span>Google AdSense</span>
        </label>
        <div class="cookie-consent-actions">
          <button id="cookieConsentReject" type="button">Reject all</button>
          <button id="cookieConsentSave" type="button">Save preferences</button>
          <button id="cookieConsentAccept" type="button" class="cookie-consent-primary">Accept all</button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    document.getElementById('cookieConsentReject').addEventListener('click', () => {
      saveAndApply({ analytics: false, adsense: false });
    });

    document.getElementById('cookieConsentAccept').addEventListener('click', () => {
      saveAndApply({ analytics: true, adsense: true });
    });

    document.getElementById('cookieConsentSave').addEventListener('click', () => {
      saveAndApply({
        analytics: document.getElementById('cookieConsentAnalytics').checked,
        adsense: document.getElementById('cookieConsentAdsense').checked,
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (hasUserChoice()) {
      applyConsent(consent);
    } else {
      createBanner();
    }

    const preferencesButton = document.getElementById('cookiePreferencesButton');

    if (preferencesButton) {
      preferencesButton.addEventListener('click', () => {
        createBanner();
      });
    }
  });
})();

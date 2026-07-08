/* ==========================================================================
   ITERCARS - GDPR COOKIE CONSENT BANNER & GOOGLE CONSENT MODE V2
   ========================================================================== */
(function() {
  // Inietta CSS del Cookie Banner
  const style = document.createElement('style');
  style.innerHTML = `
    .cookie-banner-overlay {
      position: fixed;
      bottom: 24px;
      left: 24px;
      right: 24px;
      max-width: 540px;
      background: rgba(15, 18, 24, 0.94);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      border: 1px solid rgba(0, 146, 70, 0.4);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 146, 70, 0.15);
      z-index: 999999;
      display: flex;
      flex-direction: column;
      gap: 16px;
      color: #ffffff;
      font-family: var(--font-main, 'Inter', sans-serif);
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .cookie-banner-overlay.show {
      opacity: 1;
      transform: translateY(0);
    }
    .cookie-banner-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .cookie-icon {
      width: 42px;
      height: 42px;
      border-radius: 12px;
      background: rgba(0, 146, 70, 0.15);
      border: 1px solid rgba(0, 146, 70, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      color: #2ecc71;
      flex-shrink: 0;
      box-shadow: 0 0 15px rgba(46, 204, 113, 0.2);
    }
    .cookie-banner-title {
      font-size: 1.15rem;
      font-weight: 700;
      margin: 0;
      background: linear-gradient(135deg, #ffffff 0%, #a8b3cf 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .cookie-banner-text {
      font-size: 0.92rem;
      color: #a8b3cf;
      line-height: 1.55;
      margin: 0;
    }
    .cookie-banner-text strong {
      color: #ffffff;
    }
    .cookie-banner-buttons {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-wrap: wrap;
      margin-top: 4px;
    }
    .btn-cookie-accept {
      flex: 1;
      min-width: 140px;
      padding: 12px 20px;
      background: linear-gradient(135deg, #009246 0%, #00602e 100%);
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 0 20px rgba(0, 146, 70, 0.4);
      transition: all 0.25s ease;
    }
    .btn-cookie-accept:hover {
      transform: translateY(-2px);
      box-shadow: 0 0 30px rgba(0, 146, 70, 0.6);
      background: linear-gradient(135deg, #00ab52 0%, #007337 100%);
    }
    .btn-cookie-reject {
      padding: 12px 18px;
      background: rgba(255, 255, 255, 0.06);
      color: #a8b3cf;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      font-weight: 500;
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-cookie-reject:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.3);
    }
    .btn-cookie-policy {
      font-size: 0.85rem;
      color: #a8b3cf;
      text-decoration: underline;
      cursor: pointer;
      background: none;
      border: none;
      padding: 0;
      margin-left: auto;
    }
    .btn-cookie-policy:hover {
      color: #2ecc71;
    }
    @media (max-width: 600px) {
      .cookie-banner-overlay {
        bottom: 12px;
        left: 12px;
        right: 12px;
        padding: 18px;
      }
      .cookie-banner-buttons {
        flex-direction: column;
        align-items: stretch;
      }
      .btn-cookie-policy {
        margin: 8px auto 0;
      }
    }
  `;
  document.head.appendChild(style);

  // Controlla il consenso salvato
  const consent = localStorage.getItem('itercars_cookie_consent');
  
  // Funzione per creare e mostrare il banner
  function showBanner() {
    if (document.getElementById('itercarsCookieBanner')) return;

    const banner = document.createElement('div');
    banner.id = 'itercarsCookieBanner';
    banner.className = 'cookie-banner-overlay';
    banner.innerHTML = `
      <div class="cookie-banner-header">
        <div class="cookie-icon"><i class="ri-shield-keyhole-fill"></i></div>
        <div>
          <h4 class="cookie-banner-title">Riservatezza & Protezione Dati VIP</h4>
          <span style="font-size: 0.8rem; color: #2ecc71; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase;">Conforme Regolamento Europeo GDPR</span>
        </div>
      </div>
      <p class="cookie-banner-text">
        Per offrire un'esperienza di navigazione <strong>White-Glove</strong> adatta ai nostri standard di lusso e per analizzare il traffico al fine di ottimizzare la flotta (tramite <strong>Google Analytics 4</strong>), utilizziamo cookie tecnici e analitici.
      </p>
      <div class="cookie-banner-buttons">
        <button id="btnCookieAccept" class="btn-cookie-accept"><i class="ri-check-line"></i> Accetta Tutto</button>
        <button id="btnCookieReject" class="btn-cookie-reject">Solo Necessari</button>
        <button id="btnCookiePolicy" class="btn-cookie-policy">Informativa Privacy</button>
      </div>
    `;

    document.body.appendChild(banner);

    // Animazione di entrata
    setTimeout(() => {
      banner.classList.add('show');
    }, 100);

    // Gestione click
    document.getElementById('btnCookieAccept').addEventListener('click', () => {
      localStorage.setItem('itercars_cookie_consent', 'accepted');
      if (typeof gtag === 'function') {
        gtag('consent', 'update', {
          'analytics_storage': 'granted',
          'ad_storage': 'granted',
          'ad_user_data': 'granted',
          'ad_personalization': 'granted'
        });
      }
      closeBanner(banner);
      if (typeof showToast === 'function') {
        showToast("🔒 Preferenze salvate: Consento ai cookie analitici e di miglioramento servizi.");
      }
    });

    document.getElementById('btnCookieReject').addEventListener('click', () => {
      localStorage.setItem('itercars_cookie_consent', 'rejected');
      if (typeof gtag === 'function') {
        gtag('consent', 'update', {
          'analytics_storage': 'denied',
          'ad_storage': 'denied',
          'ad_user_data': 'denied',
          'ad_personalization': 'denied'
        });
      }
      closeBanner(banner);
      if (typeof showToast === 'function') {
        showToast("🛡️ Preferenze salvate: Attivi solo i cookie tecnici essenziali.");
      }
    });

    document.getElementById('btnCookiePolicy').addEventListener('click', () => {
      alert("Informativa Privacy & Cookie Policy ITERCARS:\\n\\nIn conformità al Regolamento Europeo (GDPR), i dati raccolti tramite Google Analytics 4 vengono utilizzati in forma anonimizzata ed esclusivamente per fini statistici e di miglioramento del servizio di noleggio supercar e brokerage.\\n\\nPuoi modificare o revocare il tuo consenso in qualsiasi momento cancellando i dati di navigazione o cliccando su Cookie Policy nel footer.");
    });
  }

  function closeBanner(banner) {
    banner.classList.remove('show');
    setTimeout(() => {
      if (banner && banner.parentNode) {
        banner.parentNode.removeChild(banner);
      }
    }, 400);
  }

  // Se il consenso non è ancora stato dato, mostra il banner al caricamento
  if (!consent) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }

  // Permetti di riaprire dal footer
  window.reopenCookieBanner = function(e) {
    if (e && e.preventDefault) e.preventDefault();
    showBanner();
  };

  // Aggancia automaticamente ai link 'Cookie Policy' nel footer se presenti
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('a').forEach(a => {
      if (a.textContent.toLowerCase().includes('cookie')) {
        a.href = "javascript:void(0)";
        a.addEventListener('click', window.reopenCookieBanner);
      }
    });
  });
})();

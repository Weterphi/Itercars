/* ==========================================================================
   ITERCARS - POPUP BANNER PROMO SCONTO 50% CORSO BROKER AUTO
   Integrazione Diretta con StratosHub CRM Webhook API
   Endpoint: https://europe-west1-stratoshub-2a295.cloudfunctions.net/ingestLead
   ========================================================================== */

(function () {
  'use strict';

  // Configurazione Endpoint CRM
  const CRM_WEBHOOK_URL = 'https://europe-west1-stratoshub-2a295.cloudfunctions.net/ingestLead';
  const STORAGE_KEY_SUBMITTED = 'itercars_promo_lead_submitted';
  const STORAGE_KEY_DISMISSED = 'itercars_promo_modal_dismissed';
  const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/6oUaEY3RHbE8a6v9xA0co01';

  const isAcademyPage =
    window.location.pathname.includes('academy') ||
    window.location.href.includes('academy') ||
    !!document.querySelector('.acd-hero, #academyPresentationSection');

  let pendingStripeRedirect = false;

  // Se l'utente ha già compilato e inviato il modulo in precedenza, non mostrare né popup né targhettina
  if (localStorage.getItem(STORAGE_KEY_SUBMITTED) === 'true') {
    window.openItercarsPromoModal = function (fromStripe) {
      if (fromStripe) {
        window.location.href = STRIPE_CHECKOUT_URL;
      }
    };
    return;
  }

  // Iniezione CSS Responsive ad Alta Definizione (Foto Verticale Piena Senza Spazi Vuoti & Targhettina Centrale)
  const styleEl = document.createElement('style');
  styleEl.id = 'itercars-promo-lead-styles';
  styleEl.innerHTML = `
    .itc-promo-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(3, 7, 18, 0.9);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      z-index: 9999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      box-sizing: border-box;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.35s;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    .itc-promo-overlay.itc-active {
      opacity: 1;
      visibility: visible;
    }

    .itc-promo-card {
      position: relative;
      width: 100%;
      max-width: 780px;
      max-height: 92vh;
      overflow: hidden;
      background: linear-gradient(165deg, rgba(17, 24, 39, 0.98) 0%, rgba(10, 14, 23, 1) 100%);
      border: 1px solid rgba(46, 204, 113, 0.45);
      border-radius: 22px;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 146, 70, 0.3), 0 0 2px rgba(46, 204, 113, 0.5);
      color: #ffffff;
      transform: scale(0.96) translateY(14px);
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      box-sizing: border-box;
      display: grid;
      grid-template-columns: 280px 1fr;
    }

    .itc-promo-overlay.itc-active .itc-promo-card {
      transform: scale(1) translateY(0);
    }

    .itc-promo-media {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 100%;
      overflow: hidden;
      background: #0a0e17;
      display: flex;
      flex-direction: column;
    }

    .itc-promo-media picture {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: block;
    }

    .itc-promo-img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center 25%;
      display: block;
      transition: transform 0.6s ease;
    }

    .itc-promo-card:hover .itc-promo-img {
      transform: scale(1.03);
    }

    .itc-media-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(10, 14, 23, 0.1) 0%, rgba(10, 14, 23, 0.4) 50%, rgba(10, 14, 23, 0.95) 100%);
      pointer-events: none;
      z-index: 1;
    }

    .itc-media-footer {
      position: absolute;
      bottom: 16px;
      left: 14px;
      right: 14px;
      z-index: 2;
    }

    .itc-media-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 10px;
      background: rgba(46, 204, 113, 0.2);
      border: 1px solid rgba(46, 204, 113, 0.45);
      border-radius: 50px;
      font-size: 0.68rem;
      font-weight: 800;
      color: #2ecc71;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 6px;
      backdrop-filter: blur(6px);
    }

    .itc-media-caption {
      font-size: 0.78rem;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.35;
      text-shadow: 0 2px 6px rgba(0,0,0,0.8);
      margin: 0;
    }

    .itc-promo-content {
      padding: 24px 26px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      background: radial-gradient(circle at top right, rgba(46, 204, 113, 0.08) 0%, transparent 70%);
      overflow-y: auto;
      max-height: 92vh;
    }

    .itc-promo-close {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #94a3b8;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.2rem;
      line-height: 1;
      transition: all 0.2s ease;
      z-index: 10;
    }

    .itc-promo-close:hover {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }

    .itc-promo-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 10px;
      background: rgba(46, 204, 113, 0.14);
      border: 1px solid rgba(46, 204, 113, 0.38);
      border-radius: 50px;
      font-size: 0.7rem;
      font-weight: 800;
      color: #2ecc71;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      align-self: flex-start;
      box-shadow: 0 0 12px rgba(46, 204, 113, 0.15);
    }

    .itc-promo-title {
      font-size: 1.3rem;
      font-weight: 900;
      line-height: 1.25;
      color: #ffffff;
      margin: 0 0 6px 0;
      letter-spacing: -0.015em;
    }

    .itc-promo-title span {
      background: linear-gradient(135deg, #2ecc71 0%, #a3e635 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .itc-promo-desc {
      font-size: 0.84rem;
      line-height: 1.45;
      color: #94a3b8;
      margin: 0 0 14px 0;
      font-weight: 400;
    }

    .itc-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px 10px;
      margin-bottom: 12px;
    }

    .itc-form-group {
      display: flex;
      flex-direction: column;
      gap: 4px;
      text-align: left;
    }

    .itc-form-label {
      font-size: 0.7rem;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }

    .itc-form-input {
      width: 100%;
      padding: 10px 12px;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 10px;
      color: #ffffff;
      font-size: 0.86rem;
      font-family: inherit;
      outline: none;
      transition: all 0.25s ease;
      box-sizing: border-box;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    }

    .itc-form-input:focus {
      border-color: #2ecc71;
      background: rgba(15, 23, 42, 0.98);
      box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.25), 0 0 20px rgba(46, 204, 113, 0.2);
    }

    .itc-form-input::placeholder {
      color: #64748b;
      font-size: 0.82rem;
    }

    .itc-privacy-box {
      margin: 10px 0 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      text-align: left;
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 10px;
      padding: 10px 12px;
    }

    .itc-checkbox-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      cursor: pointer;
    }

    .itc-checkbox-item input[type="checkbox"] {
      margin-top: 2px;
      width: 15px;
      height: 15px;
      accent-color: #2ecc71;
      cursor: pointer;
      flex-shrink: 0;
    }

    .itc-privacy-text-small {
      font-size: 0.72rem !important;
      font-weight: 400 !important;
      color: #94a3b8 !important;
      line-height: 1.4 !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .itc-privacy-text-small strong {
      color: #e2e8f0;
    }

    .itc-privacy-text-small a {
      color: #2ecc71;
      text-decoration: underline;
    }

    .itc-submit-btn {
      width: 100%;
      padding: 13px 20px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #009246 0%, #2ecc71 100%);
      color: #ffffff;
      font-size: 0.94rem;
      font-weight: 800;
      letter-spacing: 0.03em;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      box-shadow: 0 6px 22px rgba(46, 204, 113, 0.32);
      transition: all 0.25s ease;
    }

    .itc-submit-btn:hover {
      box-shadow: 0 8px 30px rgba(46, 204, 113, 0.48);
      transform: translateY(-1px);
    }

    .itc-submit-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .itc-legal-note {
      text-align: center;
      font-size: 0.72rem;
      color: #64748b;
      margin: 8px 0 0;
    }

    /* Targhettina Basso */
    .itc-sticky-tab {
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%) translateY(100%);
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(9, 13, 22, 1) 100%);
      border: 1px solid rgba(46, 204, 113, 0.55);
      border-bottom: none;
      border-radius: 12px 12px 0 0;
      box-shadow: 0 -8px 25px rgba(0, 0, 0, 0.7), 0 0 20px rgba(46, 204, 113, 0.3);
      padding: 9px 18px 8px 14px;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      z-index: 999998;
      font-family: inherit;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s, background 0.2s;
      outline: none;
    }

    .itc-sticky-tab.itc-tab-visible {
      transform: translateX(-50%) translateY(0);
    }

    .itc-sticky-tab:hover {
      background: linear-gradient(135deg, rgba(22, 34, 59, 0.98) 0%, rgba(13, 20, 36, 1) 100%);
      border-color: #2ecc71;
      box-shadow: 0 -10px 35px rgba(0, 0, 0, 0.85), 0 0 30px rgba(46, 204, 113, 0.45);
    }

    .itc-tab-icon {
      color: #2ecc71;
      font-size: 1rem;
      display: flex;
      align-items: center;
    }

    .itc-tab-badge {
      background: #2ecc71;
      color: #0c111d;
      font-weight: 900;
      font-size: 0.68rem;
      padding: 2px 6px;
      border-radius: 5px;
    }

    /* Adattamento Responsive Desktop e Grandi Schermi (1080p, 1440p, 4K) */
    @media (min-width: 1024px) {
      .itc-promo-card {
        max-width: 860px;
        grid-template-columns: 310px 1fr;
        border-radius: 24px;
      }
      .itc-promo-content {
        padding: 28px 32px;
      }
      .itc-promo-title {
        font-size: 1.45rem;
      }
      .itc-promo-desc {
        font-size: 0.9rem;
      }
      .itc-form-input {
        font-size: 0.92rem;
        padding: 11px 14px;
      }
      .itc-form-label {
        font-size: 0.74rem;
      }
      .itc-privacy-text-small {
        font-size: 0.74rem !important;
      }
      .itc-submit-btn {
        font-size: 1rem;
        padding: 14px 22px;
      }
    }

    @media (min-width: 1440px) {
      .itc-promo-card {
        max-width: 920px;
        grid-template-columns: 340px 1fr;
        border-radius: 26px;
      }
      .itc-promo-content {
        padding: 32px 36px;
      }
      .itc-promo-title {
        font-size: 1.6rem;
      }
      .itc-promo-desc {
        font-size: 0.95rem;
      }
      .itc-form-input {
        font-size: 0.98rem;
        padding: 12px 16px;
      }
      .itc-form-label {
        font-size: 0.78rem;
      }
      .itc-privacy-text-small {
        font-size: 0.78rem !important;
      }
      .itc-submit-btn {
        font-size: 1.05rem;
        padding: 15px 24px;
      }
    }

    @media (max-width: 640px) {
      .itc-promo-card {
        grid-template-columns: 1fr;
        max-width: 420px;
        margin: 10px;
        border-radius: 18px;
      }
      .itc-promo-media {
        height: 95px;
        min-height: 95px;
      }
      .itc-media-footer {
        bottom: 8px;
        left: 10px;
        right: 10px;
      }
      .itc-media-badge {
        font-size: 0.62rem;
        padding: 2px 7px;
        margin-bottom: 2px;
      }
      .itc-media-caption {
        font-size: 0.72rem;
      }
      .itc-promo-content {
        padding: 16px 16px;
        max-height: none;
      }
      .itc-promo-title {
        font-size: 1.12rem;
      }
      .itc-promo-desc {
        font-size: 0.75rem;
        margin-bottom: 10px;
      }
      .itc-form-input {
        padding: 8px 10px;
        font-size: 16px; /* Previene zoom iOS */
      }
      .itc-submit-btn {
        padding: 11px 16px;
        font-size: 0.84rem;
      }
    }
  `;
  document.head.appendChild(styleEl);

  // 1. Creazione DOM della Targhettina Verde Sticky Permanente (Centrale in Basso)
  const stickyTab = document.createElement('button');
  stickyTab.type = 'button';
  stickyTab.id = 'itcStickyPromoTab';
  stickyTab.className = 'itc-sticky-tab';
  stickyTab.setAttribute('aria-label', 'Ricevi Sconto Partecipazione Corso Broker Auto');
  stickyTab.innerHTML = `
    <div class="itc-tab-icon">
      <i class="ri-shield-star-fill"></i>
    </div>
    <span class="itc-tab-title">SCONTO PARTECIPAZIONE</span>
    <span class="itc-tab-badge">-50%</span>
  `;
  if (!isAcademyPage) {
    document.body.appendChild(stickyTab);
  }

  // 2. Creazione DOM del Modale con Foto Verticale Utente e Testi Diretti
  const modalContainer = document.createElement('div');
  modalContainer.id = 'itercarsPromoOverlay';
  modalContainer.className = 'itc-promo-overlay';
  modalContainer.innerHTML = `
    <div class="itc-promo-card" role="dialog" aria-modal="true" aria-labelledby="itcPromoTitle">
      <button type="button" class="itc-promo-close" id="itcPromoCloseBtn" aria-label="Chiudi popup">
        &times;
      </button>

      <!-- COLONNA MEDIA -->
      <div class="itc-promo-media">
        <picture>
          <img src="promo_broker.jpg" alt="Masterclass Broker Auto Itercars Academy" class="itc-promo-img" loading="eager" />
        </picture>
        <div class="itc-media-overlay"></div>
        <div class="itc-media-footer">
          <div class="itc-media-badge">
            <i class="ri-vip-crown-fill"></i> ITERCARS ACADEMY
          </div>
          <p class="itc-media-caption">
            Opportunità Esclusiva Masterclass.
          </p>
        </div>
      </div>

      <!-- COLONNA CONTENUTO -->
      <div class="itc-promo-content">
        <!-- VISTA FORM -->
        <div id="itcPromoFormWrapper">
          <div class="itc-promo-badge">
            <i class="ri-shield-star-fill"></i> ACCESSO RISERVATO • -50%
          </div>

          <h2 class="itc-promo-title" id="itcPromoTitle">
            Codice Sconto del <span>50%</span> Masterclass
          </h2>

          <p class="itc-promo-desc">
            Inserisci i tuoi recapiti per ricevere subito via email il codice sconto personale valido 7 giorni per la Masterclass Broker Supercar.
          </p>

          <form id="itcLeadPromoForm">
            <div class="itc-form-grid">
              <div class="itc-form-group">
                <label class="itc-form-label" for="itcLeadName">Nome e Cognome *</label>
                <input type="text" id="itcLeadName" name="name" class="itc-form-input" placeholder="Mario Rossi" required autocomplete="name" autocapitalize="words" />
              </div>

              <div class="itc-form-group">
                <label class="itc-form-label" for="itcLeadCity">Città *</label>
                <input type="text" id="itcLeadCity" name="city" class="itc-form-input" placeholder="Milano" required autocomplete="address-level2" autocapitalize="words" />
              </div>

              <div class="itc-form-group">
                <label class="itc-form-label" for="itcLeadPhone">Cellulare / WhatsApp *</label>
                <input type="tel" id="itcLeadPhone" name="tel" class="itc-form-input" placeholder="340 123 4567" required autocomplete="tel" inputmode="tel" />
              </div>

              <div class="itc-form-group">
                <label class="itc-form-label" for="itcLeadEmail">Email *</label>
                <input type="email" id="itcLeadEmail" name="email" class="itc-form-input" placeholder="mario.rossi@email.it" required autocomplete="email" autocapitalize="none" autocorrect="off" spellcheck="false" />
              </div>
            </div>

            <!-- CHECKBOX PRIVACY E MARKETING PROFESSIONALI -->
            <div class="itc-privacy-box">
              <label class="itc-checkbox-item">
                <input type="checkbox" id="itcConsentPrivacy" required checked />
                <p class="itc-privacy-text-small">
                  <strong>Informativa Privacy (GDPR UE 2016/679) *</strong>: Dichiaro di aver preso visione dell'Informativa Privacy e acconsento al trattamento dei miei dati personali per l'erogazione del codice sconto del 50% e l'assistenza personalizzata.
                </p>
              </label>

              <label class="itc-checkbox-item">
                <input type="checkbox" id="itcConsentMarketing" checked />
                <p class="itc-privacy-text-small">
                  <strong>Comunicazioni e Offerte Esclusive</strong>: Acconsento alla ricezione periodica di comunicazioni informative su corsi didattici, mandati flotta e opportunità riservate da ITERCARS (facoltativo, cancellazione in 1 clic).
                </p>
              </label>
            </div>

            <div id="itcFormError" style="display: none; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #ef4444; padding: 7px 10px; border-radius: 8px; font-size: 0.78rem; margin-bottom: 10px; text-align: center;"></div>

            <button type="submit" id="itcSubmitBtn" class="itc-submit-btn">
              <span>RICEVI IL TUO SCONTO DEL 50%</span>
              <i class="ri-arrow-right-line"></i>
            </button>

            <p class="itc-legal-note">
              Nessun vincolo di acquisto • Valido 7 giorni dall'attivazione
            </p>
          </form>
        </div>

        <!-- VISTA SUCCESSO -->
        <div id="itcPromoSuccessWrapper" class="itc-success-view" style="display: none; text-align: center; padding: 6px 0;">
          <div class="itc-success-icon" style="font-size: 2.4rem; color: #2ecc71; margin-bottom: 6px;">
            <i class="ri-checkbox-circle-fill"></i>
          </div>

          <h3 class="itc-success-title" style="font-size: 1.3rem; font-weight: 800; color: #ffffff; margin-bottom: 4px;">
            Richiesta Inviata con Successo!
          </h3>

          <p class="itc-success-text" style="font-size: 0.82rem; color: #94a3b8; line-height: 1.45; margin-bottom: 12px;">
            Il tuo codice sconto del <strong>50%</strong> è stato generato ed è ora attivo.<br>
            Copia inviata a: <strong id="itcDisplayEmail" style="color: #2ecc71;"></strong>
          </p>

          <div style="background: rgba(0, 146, 70, 0.12); border: 2px dashed rgba(46, 204, 113, 0.5); border-radius: 12px; padding: 12px; margin-bottom: 14px;">
            <span style="font-size: 0.68rem; font-weight: 800; color: #d4af37; letter-spacing: 1px; display: block; margin-bottom: 6px; text-transform: uppercase;">IL TUO CODICE SCONTO DEL 50%</span>
            
            <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 6px; flex-wrap: wrap;">
              <div id="itcDisplayCode" style="font-size: 1.45rem; font-weight: 900; letter-spacing: 2px; color: #2ecc71; font-family: monospace; background: rgba(0,0,0,0.5); padding: 6px 14px; border-radius: 8px; border: 1px solid rgba(46, 204, 113, 0.35);">
                GENERAZIONE...
              </div>
              <button type="button" id="itcCopyCodeBtn" style="background: rgba(46, 204, 113, 0.2); border: 1px solid rgba(46, 204, 113, 0.5); color: #2ecc71; padding: 6px 10px; border-radius: 8px; cursor: pointer; font-size: 0.78rem; font-weight: 700; transition: all 0.2s;" title="Copia codice">
                <i class="ri-file-copy-line"></i> Copia
              </button>
            </div>

            <p id="itcDisplayExpiry" style="font-size: 0.76rem; color: #f59e0b; margin: 6px 0 0; font-weight: 600;">
              <i class="ri-time-line"></i> Validità: 7 giorni a partire da oggi
            </p>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px;">
            <button type="button" id="itcSuccessCloseBtn" class="itc-submit-btn" style="background: linear-gradient(135deg, #009246 0%, #2ecc71 100%); cursor: pointer; font-size: 0.88rem; padding: 12px 18px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px;">
              <i class="ri-bank-card-fill"></i>
              <span>Procedi al Pagamento con Sconto 50%</span>
            </button>

            <button type="button" id="itcSuccessStayBtn" style="background: none; border: none; color: #94a3b8; font-size: 0.78rem; text-decoration: underline; cursor: pointer; padding: 3px; transition: color 0.2s;" onmouseover="this.style.color='#ffffff'" onmouseout="this.style.color='#94a3b8'">
              Oppure chiudi e continua a navigare sul sito
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modalContainer);

  let activeCheckoutUrl = STRIPE_CHECKOUT_URL;

  // Funzione Mostra Targhettina Verde Permanente
  function showStickyTab() {
    if (isAcademyPage) return;
    if (localStorage.getItem(STORAGE_KEY_SUBMITTED) === 'true') return;
    if (stickyTab) {
      stickyTab.classList.add('itc-tab-visible');
    }
  }

  // Funzione Nascondi Targhettina Verde
  function hideStickyTab() {
    if (stickyTab) {
      stickyTab.classList.remove('itc-tab-visible');
    }
  }

  // =========================================================================
  // SISTEMA AUTOFILL MULTI-LIVELLO: NATIVO DISPOSITIVO + CACHE CONDIVISA + URL
  // =========================================================================
  const CONTACT_CACHE_KEY = 'itercars_contact_cache';

  function getStoredContactInfo() {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlName = params.get('nome') || params.get('name') || '';
      const urlEmail = params.get('email') || params.get('mail') || '';
      const urlPhone = params.get('telefono') || params.get('phone') || params.get('tel') || params.get('cellulare') || '';
      const urlCity = params.get('citta') || params.get('city') || '';

      let localData = {};
      const raw = localStorage.getItem(CONTACT_CACHE_KEY);
      if (raw) {
        try { localData = JSON.parse(raw) || {}; } catch (e) {}
      }

      let stratData = {};
      const rawStrat = localStorage.getItem('stratoshub_contact_cache');
      if (rawStrat) {
        try { stratData = JSON.parse(rawStrat) || {}; } catch (e) {}
      }

      const altName = localStorage.getItem('itercars_user_name') || localStorage.getItem('stratoshub_user_name') || '';
      const altEmail = localStorage.getItem('itercars_user_email') || localStorage.getItem('stratoshub_user_email') || '';
      const altPhone = localStorage.getItem('itercars_user_phone') || localStorage.getItem('stratoshub_user_phone') || '';

      return {
        name: urlName || localData.name || stratData.name || altName || '',
        email: urlEmail || localData.email || stratData.email || altEmail || '',
        phone: urlPhone || localData.phone || stratData.phone || altPhone || '',
        city: urlCity || localData.city || stratData.city || ''
      };
    } catch (e) {
      return { name: '', email: '', phone: '', city: '' };
    }
  }

  function saveStoredContactInfo(info) {
    try {
      if (!info) return;
      const current = getStoredContactInfo();
      const updated = {
        name: (info.name !== undefined ? info.name : current.name).trim(),
        email: (info.email !== undefined ? info.email : current.email).trim(),
        phone: (info.phone !== undefined ? info.phone : current.phone).trim(),
        city: (info.city !== undefined ? info.city : current.city).trim(),
        updatedAt: Date.now()
      };
      if (updated.name || updated.email || updated.phone) {
        localStorage.setItem(CONTACT_CACHE_KEY, JSON.stringify(updated));
        localStorage.setItem('stratoshub_contact_cache', JSON.stringify(updated));
        if (updated.name) localStorage.setItem('itercars_user_name', updated.name);
        if (updated.email) localStorage.setItem('itercars_user_email', updated.email);
        if (updated.phone) localStorage.setItem('itercars_user_phone', updated.phone);
      }
    } catch (e) {}
  }

  function autoFillPromoFields() {
    const contact = getStoredContactInfo();
    const nameInput = document.getElementById('itcLeadName');
    const cityInput = document.getElementById('itcLeadCity');
    const phoneInput = document.getElementById('itcLeadPhone');
    const emailInput = document.getElementById('itcLeadEmail');

    if (nameInput && !nameInput.value && contact.name) {
      nameInput.value = contact.name;
    }
    if (cityInput && !cityInput.value && contact.city) {
      cityInput.value = contact.city;
    }
    if (phoneInput && !phoneInput.value && contact.phone) {
      phoneInput.value = contact.phone;
    }
    if (emailInput && !emailInput.value && contact.email) {
      emailInput.value = contact.email;
    }
  }

  // Funzione Apertura Modale
  function openPromoModal(fromStripe) {
    autoFillPromoFields();
    if (localStorage.getItem(STORAGE_KEY_SUBMITTED) === 'true') {
      if (fromStripe) {
        window.location.href = STRIPE_CHECKOUT_URL;
      }
      return;
    }
    if (fromStripe === true) {
      pendingStripeRedirect = true;
    }
    hideStickyTab();
    modalContainer.classList.add('itc-active');
  }

  // Funzione Chiusura Modale (quando si chiude senza compilare il form, torna sul sito tranquillamente!)
  function closePromoModal() {
    modalContainer.classList.remove('itc-active');
    sessionStorage.setItem(STORAGE_KEY_DISMISSED, 'true');
    pendingStripeRedirect = false;

    if (!isAcademyPage) {
      showStickyTab();
    }
  }

  // Event Listener Chiusura
  const closeBtn = document.getElementById('itcPromoCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', closePromoModal);

  const successCloseBtn = document.getElementById('itcSuccessCloseBtn');
  if (successCloseBtn) {
    successCloseBtn.addEventListener('click', function () {
      // Reindirizza direttamente a Stripe con il codice sconto automaticamente pre-applicato
      window.location.href = activeCheckoutUrl;
    });
  }

  const successStayBtn = document.getElementById('itcSuccessStayBtn');
  if (successStayBtn) {
    successStayBtn.addEventListener('click', function () {
      closePromoModal();
      hideStickyTab();
      if (stickyTab) stickyTab.remove();
    });
  }

  const copyBtn = document.getElementById('itcCopyCodeBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      const codeEl = document.getElementById('itcDisplayCode');
      const code = codeEl ? codeEl.textContent.trim() : '';
      if (navigator.clipboard && code) {
        navigator.clipboard.writeText(code).then(function () {
          copyBtn.innerHTML = '<i class="ri-check-line"></i> Copiato!';
          setTimeout(function () {
            copyBtn.innerHTML = '<i class="ri-file-copy-line"></i> Copia';
          }, 2000);
        });
      }
    });
  }

  // Event Listener Click sulla Targhettina Verde per riaprire il modale (solo se non su Academy)
  if (stickyTab && !isAcademyPage) {
    stickyTab.addEventListener('click', function () {
      openPromoModal();
    });
  }

  // Chiudi cliccando fuori dalla card
  modalContainer.addEventListener('click', function (e) {
    if (e.target === modalContainer) {
      closePromoModal();
    }
  });

  // Tasto ESC da tastiera
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modalContainer.classList.contains('itc-active')) {
      closePromoModal();
    }
  });

  // Gestione Invio Modulo
  const form = document.getElementById('itcLeadPromoForm');
  const submitBtn = document.getElementById('itcSubmitBtn');
  const errorBox = document.getElementById('itcFormError');
  const formWrapper = document.getElementById('itcPromoFormWrapper');
  const successWrapper = document.getElementById('itcPromoSuccessWrapper');

  // Helper per Validazione Numero Cellulare Italiano Reale
  function validateItalianPhone(raw) {
    if (!raw) return { valid: false, error: 'Inserisci il tuo numero di cellulare.' };
    const clean = raw.replace(/[\s\-\.\(\)\/]/g, '');
    let nat = clean;
    if (nat.startsWith('+39')) nat = nat.slice(3);
    else if (nat.startsWith('0039')) nat = nat.slice(4);
    else if (nat.startsWith('39') && nat.length > 10) nat = nat.slice(2);

    // Deve iniziare per 3 ed essere lungo 9 o 10 cifre
    if (!/^3\d{8,9}$/.test(nat)) {
      return { valid: false, error: 'Inserisci un numero di cellulare italiano valido (es. +39 340 1234567).' };
    }
    // Rifiuta numeri con tutte cifre uguali (es. 3333333333, 3000000000)
    if (/^(\d)\1+$/.test(nat)) {
      return { valid: false, error: 'Il numero di cellulare inserito non sembra valido.' };
    }
    // Rifiuta sequenze numeriche ovvie (es. 0123456789, 9876543210)
    if ('0123456789012345'.includes(nat) || '9876543210987654'.includes(nat) || '0123456789'.includes(nat.slice(1)) || '9876543210'.includes(nat.slice(1))) {
      return { valid: false, error: 'Il numero di cellulare inserito non sembra valido.' };
    }
    // Rifiuta placeholder comuni
    if (['3401234567', '3331234567', '3201234567', '3451234567', '3000000000', '3999999999'].includes(nat)) {
      return { valid: false, error: 'Inserisci un numero di cellulare reale.' };
    }
    return { valid: true, formatted: '+39 ' + nat.slice(0, 3) + ' ' + nat.slice(3) };
  }

  // Helper per Validazione Email Reale
  function validateRealEmail(raw) {
    if (!raw) return { valid: false, error: 'Inserisci il tuo indirizzo email.' };
    const email = raw.trim().toLowerCase();
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(email)) {
      return { valid: false, error: 'Inserisci un indirizzo email valido (es. mario.rossi@email.it).' };
    }
    const parts = email.split('@');
    if (parts.length !== 2) return { valid: false, error: 'Indirizzo email non valido.' };
    const user = parts[0];
    const domain = parts[1];
    const tld = domain.split('.').pop();
    if (!tld || tld.length < 2 || !/^[a-z]+$/.test(tld)) {
      return { valid: false, error: 'Dominio email non valido (es. .it, .com).' };
    }
    const fakeDomains = [
      'test.com', 'test.it', 'prova.it', 'prova.com', 'example.com', 'example.org',
      'fake.com', 'fake.it', 'mailinator.com', 'tempmail.com', 'yopmail.com', '10minutemail.com',
      'guerrillamail.com', 'dispostable.com', 'trashmail.com'
    ];
    if (fakeDomains.includes(domain)) {
      return { valid: false, error: 'Inserisci un indirizzo email reale e attivo.' };
    }
    const fakeUsers = ['test', 'prova', 'fake', 'asdf', 'admin', 'user', 'demo', 'temp', 'a', 'xyz', 'nessuno'];
    if (fakeUsers.includes(user)) {
      return { valid: false, error: 'Inserisci un indirizzo email reale.' };
    }
    return { valid: true, clean: email };
  }

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const name = document.getElementById('itcLeadName').value.trim();
      const city = document.getElementById('itcLeadCity').value.trim();
      const rawPhone = document.getElementById('itcLeadPhone').value.trim();
      const rawEmail = document.getElementById('itcLeadEmail').value.trim();
      const consentPrivacy = document.getElementById('itcConsentPrivacy').checked;
      const consentMarketing = document.getElementById('itcConsentMarketing').checked;

      // Reset errori
      errorBox.style.display = 'none';
      errorBox.textContent = '';

      if (!name || !city || !rawPhone || !rawEmail) {
        errorBox.textContent = 'Per favore, compila tutti i campi obbligatori.';
        errorBox.style.display = 'block';
        return;
      }

      if (name.length < 3 || !name.includes(' ')) {
        errorBox.textContent = 'Inserisci nome e cognome completi (es. Mario Rossi).';
        errorBox.style.display = 'block';
        return;
      }

      // Validazione rigorosa Numero Cellulare Italiano Reale
      const phoneCheck = validateItalianPhone(rawPhone);
      if (!phoneCheck.valid) {
        errorBox.textContent = phoneCheck.error;
        errorBox.style.display = 'block';
        document.getElementById('itcLeadPhone').focus();
        return;
      }

      // Validazione rigorosa Email Reale
      const emailCheck = validateRealEmail(rawEmail);
      if (!emailCheck.valid) {
        errorBox.textContent = emailCheck.error;
        errorBox.style.display = 'block';
        document.getElementById('itcLeadEmail').focus();
        return;
      }

      if (!consentPrivacy || !consentMarketing) {
        errorBox.textContent = 'È necessario accettare le condizioni di privacy e marketing per ricevere il bonus sconto.';
        errorBox.style.display = 'block';
        return;
      }

      // Stato di caricamento
      submitBtn.disabled = true;
      const originalBtnText = submitBtn.innerHTML;
      submitBtn.innerHTML = `<span>INVIO IN CORSO...</span> <i class="ri-loader-4-line ri-spin"></i>`;

      // Payload formattato per StratosHub CRM con telefono ed email normalizzati
      const leadPayload = {
        name: name,
        email: emailCheck.clean,
        phone: phoneCheck.formatted,
        city: city,
        interestTag: 'broker corso',
        notes: 'Richiesta Sconto Partecipazione 50% - Accesso Riservato Opportunità Privilegiata Itercars Academy - Valido 1 settimana',
        source: 'sito_web',
        campaignName: 'Accesso Riservato Opportunità Privilegiata',
        answers: {
          'Tipo Richiesta': 'Sconto 50% Masterclass Broker Auto',
          'Validità': '7 Giorni',
          'Informativa Privacy': 'Accettata (GDPR)'
        },
        sendDiscountCode: true
      };

      try {
        const response = await fetch(CRM_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(leadPayload)
        });

        const result = await response.json().catch(function () {
          return { success: response.ok };
        });

        if (response.ok && result.success !== false) {
          // Memorizza che l'utente ha completato la richiesta
          localStorage.setItem(STORAGE_KEY_SUBMITTED, 'true');
          saveStoredContactInfo({
            name: name,
            city: city,
            phone: phoneCheck.formatted,
            email: emailCheck.clean
          });
          pendingStripeRedirect = false;

          // Rimuovi la targhettina dal fondo
          hideStickyTab();
          if (stickyTab) stickyTab.remove();

          // Dati del codice generato da Stripe
          const discountCode = result.discountCode || 'BROKER50-PROMO';
          const checkoutUrl = result.checkoutUrl || ('https://buy.stripe.com/6oUaEY3RHbE8a6v9xA0co01?prefilled_promo_code=' + discountCode);
          activeCheckoutUrl = checkoutUrl;

          const codeDisplay = document.getElementById('itcDisplayCode');
          if (codeDisplay) codeDisplay.textContent = discountCode;

          const emailDisplay = document.getElementById('itcDisplayEmail');
          if (emailDisplay) emailDisplay.textContent = emailCheck.clean;

          const expiryDisplay = document.getElementById('itcDisplayExpiry');
          if (expiryDisplay) {
            const expDate = result.discountExpiresAt ? new Date(result.discountExpiresAt) : new Date(Date.now() + 7 * 86400000);
            const expStr = expDate.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
            expiryDisplay.innerHTML = `<i class="ri-time-line"></i> Il tuo codice ha <strong>validità di 7 giorni</strong> a partire da oggi (scadenza: <strong>${expStr}</strong>).`;
          }

          const directBtn = document.getElementById('itcDirectCheckoutBtn');
          if (directBtn) directBtn.href = checkoutUrl;

          // Mostra la schermata di ringraziamento e conferma (NON reindirizza l'utente a Stripe)
          formWrapper.style.display = 'none';
          successWrapper.style.display = 'block';
        } else {
          throw new Error(result.error || 'Errore durante la registrazione del contatto.');
        }
      } catch (err) {
        console.error('Errore invio lead a StratosHub CRM:', err);
        errorBox.textContent = 'Si è verificato un errore di connessione. Riprova tra poco oppure contattaci direttamente.';
        errorBox.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
      }
    });

    // Ascolto digitazione per memorizzazione immediata
    ['itcLeadName', 'itcLeadCity', 'itcLeadPhone', 'itcLeadEmail'].forEach(function (id) {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('blur', function () {
          saveStoredContactInfo({
            name: document.getElementById('itcLeadName')?.value,
            city: document.getElementById('itcLeadCity')?.value,
            phone: document.getElementById('itcLeadPhone')?.value,
            email: document.getElementById('itcLeadEmail')?.value
          });
        });
        el.addEventListener('change', function () {
          saveStoredContactInfo({
            name: document.getElementById('itcLeadName')?.value,
            city: document.getElementById('itcLeadCity')?.value,
            phone: document.getElementById('itcLeadPhone')?.value,
            email: document.getElementById('itcLeadEmail')?.value
          });
        });
      }
    });

    // Precompila campi se già disponibili
    autoFillPromoFields();
  }

  // APPARIZIONE AUTOMATICA: SOLO DOPO CHIUSURA COOKIE + 20 SECONDI DI NAVIGAZIONE
  const DELAY_AFTER_COOKIES_MS = 20000; // 20 secondi esatti per lasciar respirare e navigare l'utente

  function schedulePromoModal() {
    if (isAcademyPage) {
      // Su Academy il popup promozionale non deve mai apparire da solo su timer:
      // apparirà solo quando l'utente clicca un pulsante verso Stripe
      return;
    }
    if (localStorage.getItem(STORAGE_KEY_SUBMITTED) === 'true') {
      return;
    }
    if (sessionStorage.getItem(STORAGE_KEY_DISMISSED) === 'true') {
      showStickyTab();
      return;
    }

    // Timer di 20 secondi dopo che i cookie sono stati accettati/rifiutati
    setTimeout(function () {
      if (localStorage.getItem(STORAGE_KEY_SUBMITTED) === 'true') return;
      if (sessionStorage.getItem(STORAGE_KEY_DISMISSED) === 'true') return;
      openPromoModal();
    }, DELAY_AFTER_COOKIES_MS);
  }

  function initPromoTrigger() {
    if (isAcademyPage) {
      // Su Academy disabilitiamo l'apertura automatica legata ai cookie o timer
      return;
    }
    if (localStorage.getItem(STORAGE_KEY_SUBMITTED) === 'true') {
      return;
    }
    if (sessionStorage.getItem(STORAGE_KEY_DISMISSED) === 'true') {
      showStickyTab();
      return;
    }

    // Verifica se l'utente ha già preso una decisione sui cookie in precedenza
    const consent = localStorage.getItem('itercars_cookie_consent');
    const cookieBanner = document.getElementById('itercarsCookieBanner');

    // Se l'utente ha già interagito con i cookie in precedenza e il banner non è visibile
    if (consent && !cookieBanner) {
      // Lasciamo respirare l'utente per 20 secondi dal caricamento della pagina
      schedulePromoModal();
      return;
    }

    // Se il banner dei cookie è attivo/visibile:
    // Il modulo di contatto DEVE attendere che l'utente clicchi "Accetto" o "Solo Necessari"
    let triggered = false;
    function handleCookieBannerClosed() {
      if (triggered) return;
      triggered = true;
      // Avvia il timer di 20 secondi a partire dal momento in cui il banner dei cookie viene chiuso
      schedulePromoModal();
    }

    // Ascolto evento custom da cookie-banner.js
    window.addEventListener('itercars_cookie_consent_saved', handleCookieBannerClosed, { once: true });

    // Ascolto click diretto sui pulsanti di accettazione o rifiuto
    function attachCookieListeners() {
      const btnAccept = document.getElementById('btnCookieAccept');
      const btnReject = document.getElementById('btnCookieReject');

      if (btnAccept) btnAccept.addEventListener('click', handleCookieBannerClosed, { once: true });
      if (btnReject) btnReject.addEventListener('click', handleCookieBannerClosed, { once: true });

      if (!btnAccept && !btnReject && !consent) {
        const observer = new MutationObserver(function () {
          const bA = document.getElementById('btnCookieAccept');
          const bR = document.getElementById('btnCookieReject');
          if (bA || bR) {
            observer.disconnect();
            if (bA) bA.addEventListener('click', handleCookieBannerClosed, { once: true });
            if (bR) bR.addEventListener('click', handleCookieBannerClosed, { once: true });
          }
        });
        observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
      }
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', attachCookieListeners);
    } else {
      attachCookieListeners();
    }
  }

  if (document.readyState === 'complete') {
    initPromoTrigger();
  } else {
    window.addEventListener('load', initPromoTrigger);
  }

  // Espone la funzione nel caso si voglia aprire anche manualmente con un pulsante nel sito
  window.openItercarsPromoModal = openPromoModal;
})();

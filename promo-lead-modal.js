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

  // Se l'utente ha già compilato e inviato il modulo in precedenza, non mostrare né popup né targhettina
  if (localStorage.getItem(STORAGE_KEY_SUBMITTED) === 'true') {
    return;
  }

  // Iniezione CSS Responsive ad Alta Definizione (Foto Verticale Piena Senza Spazi Vuoti & Targhettina Centrale)
  const styleEl = document.createElement('style');
  styleEl.id = 'itercars-promo-modal-styles';
  styleEl.innerHTML = `
    .itc-promo-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(3, 7, 18, 0.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      z-index: 9999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.35s;
      box-sizing: border-box;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .itc-promo-overlay.itc-active {
      opacity: 1;
      visibility: visible;
    }

    .itc-promo-card {
      position: relative;
      width: 100%;
      max-width: 820px;
      max-height: 94vh;
      overflow: hidden;
      background: linear-gradient(165deg, rgba(17, 24, 39, 0.99) 0%, rgba(10, 14, 23, 1) 100%);
      border: 1px solid rgba(46, 204, 113, 0.45);
      border-radius: 24px;
      box-shadow: 0 25px 70px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 146, 70, 0.25);
      color: #ffffff;
      transform: scale(0.94) translateY(20px);
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      box-sizing: border-box;
      display: grid;
      grid-template-columns: 320px 1fr;
    }

    .itc-promo-overlay.itc-active .itc-promo-card {
      transform: scale(1) translateY(0);
    }

    /* Colonna Immagine Verticale Piena: riempie completamente l'altezza al 100% senza vuoti */
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
      transition: transform 0.8s ease;
    }

    .itc-promo-card:hover .itc-promo-img {
      transform: scale(1.04);
    }

    .itc-media-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(10, 14, 23, 0.1) 0%, rgba(10, 14, 23, 0.35) 45%, rgba(10, 14, 23, 0.95) 100%);
      pointer-events: none;
      z-index: 1;
    }

    .itc-media-footer {
      position: absolute;
      bottom: 20px;
      left: 18px;
      right: 18px;
      z-index: 2;
    }

    .itc-media-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px;
      background: rgba(46, 204, 113, 0.2);
      border: 1px solid rgba(46, 204, 113, 0.5);
      border-radius: 50px;
      font-size: 0.72rem;
      font-weight: 800;
      color: #2ecc71;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 8px;
      backdrop-filter: blur(8px);
    }

    .itc-media-caption {
      font-size: 0.84rem;
      font-weight: 700;
      color: #ffffff;
      line-height: 1.35;
      text-shadow: 0 2px 8px rgba(0,0,0,0.85);
    }

    /* Colonna Contenuti / Form (Scrollabile se necessario) */
    .itc-promo-content {
      padding: 30px 28px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      max-height: 94vh;
      overflow-y: auto;
      box-sizing: border-box;
    }

    .itc-promo-content::-webkit-scrollbar {
      width: 5px;
    }
    .itc-promo-content::-webkit-scrollbar-thumb {
      background: rgba(46, 204, 113, 0.35);
      border-radius: 10px;
    }

    .itc-promo-close {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.3rem;
      transition: all 0.2s ease;
      z-index: 10;
    }

    .itc-promo-close:hover {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.5);
      color: #ef4444;
      transform: rotate(90deg);
    }

    /* Targettina/Badge Sconto Centrale */
    .itc-promo-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 14px;
      background: rgba(46, 204, 113, 0.15);
      border: 1px solid rgba(46, 204, 113, 0.45);
      border-radius: 50px;
      font-size: 0.72rem;
      font-weight: 800;
      color: #2ecc71;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      margin-bottom: 8px;
      align-self: center;
    }

    /* Titolo Diretto e Centrale */
    .itc-promo-title {
      font-size: 1.45rem;
      font-weight: 900;
      line-height: 1.25;
      color: #ffffff;
      margin-bottom: 10px;
      letter-spacing: -0.015em;
      text-align: center;
    }

    .itc-promo-title span {
      background: linear-gradient(135deg, #2ecc71 0%, #a3e635 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    /* Testo Esplicativo di Partenariato */
    .itc-promo-desc {
      font-size: 0.88rem;
      line-height: 1.45;
      color: #cbd5e1;
      margin-bottom: 16px;
      font-weight: 500;
      text-align: center;
    }

    /* Griglia Form Responsive */
    .itc-form-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-bottom: 12px;
    }

    .itc-form-group {
      display: flex;
      flex-direction: column;
      gap: 3px;
      text-align: left;
    }

    .itc-form-label {
      font-size: 0.7rem;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .itc-form-input {
      width: 100%;
      padding: 10px 12px;
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 10px;
      color: #ffffff;
      font-size: 0.86rem;
      font-family: inherit;
      outline: none;
      transition: all 0.2s ease;
      box-sizing: border-box;
    }

    .itc-form-input:focus {
      border-color: #2ecc71;
      background: rgba(15, 23, 42, 0.98);
      box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.25);
    }

    .itc-form-input::placeholder {
      color: #64748b;
      font-size: 0.8rem;
    }

    /* Checkboxes Privacy e Marketing */
    .itc-privacy-box {
      margin-top: 6px;
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
      gap: 9px;
      text-align: left;
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

    /* SPECIFICA CRUCIALE: Lettere piccole e RIGOROSAMENTE NON IN GRASSETTO */
    .itc-privacy-text-small {
      font-size: 0.72rem !important;
      font-weight: 400 !important;
      color: #94a3b8 !important;
      line-height: 1.45 !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .itc-privacy-text-small a {
      color: #2ecc71;
      text-decoration: underline;
      font-weight: 400 !important;
    }

    .itc-privacy-text-small a:hover {
      color: #a3e635;
    }

    /* Pulsante Call to Action: "RICEVI SCONTO" */
    .itc-submit-btn {
      width: 100%;
      padding: 14px 20px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #009246 0%, #2ecc71 100%);
      color: #ffffff;
      font-size: 1.05rem;
      font-weight: 900;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 10px 25px rgba(0, 146, 70, 0.45);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .itc-submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 14px 32px rgba(46, 204, 113, 0.6);
      background: linear-gradient(135deg, #007336 0%, #2ecc71 100%);
    }

    .itc-submit-btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .itc-legal-note {
      text-align: center;
      font-size: 0.68rem;
      color: #64748b;
      margin-top: 10px;
    }

    /* Schermata di Ringraziamento / Successo */
    .itc-success-view {
      text-align: center;
      padding: 30px 16px;
    }

    .itc-success-icon {
      width: 60px;
      height: 60px;
      margin: 0 auto 16px;
      border-radius: 50%;
      background: rgba(46, 204, 113, 0.15);
      border: 1px solid rgba(46, 204, 113, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #2ecc71;
      font-size: 2rem;
    }

    .itc-success-title {
      font-size: 1.35rem;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 8px;
    }

    .itc-success-text {
      font-size: 0.88rem;
      color: #cbd5e1;
      line-height: 1.55;
      margin-bottom: 20px;
    }

    /* ==========================================================================
       TARGETTINA VERDE INCOLLATA AL MARGINE INFERIORE (CENTRALE NELLA PAGINA)
       Rigidamente centrata sia su Desktop che su Mobile
       ========================================================================== */
    .itc-sticky-tab {
      position: fixed;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999998;
      display: none;
      align-items: center;
      gap: 10px;
      padding: 12px 26px 11px 22px;
      background: linear-gradient(135deg, #009246 0%, #007336 35%, #2ecc71 100%);
      color: #ffffff;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 0.92rem;
      font-weight: 900;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      border: 1px solid rgba(255, 255, 255, 0.32);
      border-bottom: none;
      border-radius: 16px 16px 0 0;
      box-shadow: 0 -6px 28px rgba(0, 146, 70, 0.6), 0 -2px 10px rgba(0, 0, 0, 0.4);
      cursor: pointer;
      user-select: none;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      animation: itcTabPulse 3s infinite;
    }

    .itc-sticky-tab.itc-tab-visible {
      display: flex;
    }

    .itc-sticky-tab:hover {
      padding-bottom: 15px;
      transform: translateX(-50%) translateY(-4px);
      box-shadow: 0 -8px 34px rgba(46, 204, 113, 0.85), 0 -2px 12px rgba(0, 0, 0, 0.5);
      background: linear-gradient(135deg, #007336 0%, #2ecc71 100%);
    }

    .itc-tab-icon {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.95rem;
      color: #a3e635;
      flex-shrink: 0;
    }

    .itc-tab-title {
      white-space: nowrap;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    }

    .itc-tab-badge {
      padding: 2px 7px;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.25);
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 800;
      color: #a3e635;
      letter-spacing: 0.02em;
    }

    @keyframes itcTabPulse {
      0%, 100% {
        box-shadow: 0 -6px 22px rgba(0, 146, 70, 0.5), 0 -2px 10px rgba(0, 0, 0, 0.35);
      }
      50% {
        box-shadow: 0 -8px 30px rgba(46, 204, 113, 0.8), 0 0 16px rgba(163, 230, 53, 0.45);
      }
    }

    /* Ottimizzazione Mobile (< 768px) */
    @media (max-width: 768px) {
      .itc-promo-card {
        grid-template-columns: 1fr;
        max-width: 480px;
        border-radius: 20px;
        overflow-y: auto;
      }
      .itc-promo-media {
        min-height: 220px;
        height: 220px;
        position: relative;
      }
      .itc-promo-content {
        padding: 22px 18px;
        max-height: none;
        overflow-y: visible;
      }
      .itc-promo-title {
        font-size: 1.2rem;
        line-height: 1.25;
        margin-bottom: 8px;
      }
      .itc-form-grid {
        grid-template-columns: 1fr;
        gap: 9px;
      }
      .itc-submit-btn {
        padding: 13px 14px;
        font-size: 0.9rem;
        letter-spacing: 0.02em;
      }

      .itc-sticky-tab {
        padding: 10px 16px 9px 14px;
        font-size: 0.78rem;
        border-radius: 12px 12px 0 0;
      }
      .itc-sticky-tab:hover {
        transform: translateX(-50%) translateY(-3px);
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
  document.body.appendChild(stickyTab);

  // 2. Creazione DOM del Modale con Foto Verticale Utente e Testi Diretti
  const modalContainer = document.createElement('div');
  modalContainer.id = 'itercarsPromoOverlay';
  modalContainer.className = 'itc-promo-overlay';
  modalContainer.innerHTML = `
    <div class="itc-promo-card" role="dialog" aria-modal="true" aria-labelledby="itcPromoTitle">
      <button type="button" class="itc-promo-close" id="itcPromoCloseBtn" aria-label="Chiudi popup">
        &times;
      </button>

      <!-- COLONNA SINISTRA: IMMAGINE VERTICALE (SIGNORI CHE SI STRINGONO LA MANO) -->
      <div class="itc-promo-media">
        <picture>
          <img src="promo_broker.jpg" alt="Mentorship e Corso Broker Auto Itercars Academy" class="itc-promo-img" loading="eager" />
        </picture>
        <div class="itc-media-overlay"></div>
        <div class="itc-media-footer">
          <div class="itc-media-badge">
            <i class="ri-vip-crown-fill"></i> ITERCARS ACADEMY
          </div>
          <p class="itc-media-caption">
            Opportunità Privilegiata Broker Auto.
          </p>
        </div>
      </div>

      <!-- COLONNA DESTRA: CONTENUTO & FORM AD ALTO IMPATTO -->
      <div class="itc-promo-content">
        <!-- VISTA FORM PRINCIPALE -->
        <div id="itcPromoFormWrapper">
          <div class="itc-promo-badge">
            <i class="ri-shield-star-fill"></i> ACCESSO RISERVATO • SCONTO DEL 50%
          </div>

          <!-- TITOLO PRIVILEGIATO -->
          <h2 class="itc-promo-title" id="itcPromoTitle">
            Accesso Riservato all'<span>Opportunità Privilegiata</span>
          </h2>

          <p class="itc-promo-desc">
            Compila il modulo per ricevere via email il tuo codice sconto esclusivo per la partecipazione, valido per una settimana dall'attivazione.
          </p>

          <form id="itcLeadPromoForm">
            <div class="itc-form-grid">
              <div class="itc-form-group">
                <label class="itc-form-label" for="itcLeadName">Nome e Cognome *</label>
                <input type="text" id="itcLeadName" class="itc-form-input" placeholder="es. Mario Rossi" required autocomplete="name" />
              </div>

              <div class="itc-form-group">
                <label class="itc-form-label" for="itcLeadCity">Città *</label>
                <input type="text" id="itcLeadCity" class="itc-form-input" placeholder="es. Milano" required autocomplete="address-level2" />
              </div>

              <div class="itc-form-group">
                <label class="itc-form-label" for="itcLeadPhone">Cellulare / WhatsApp *</label>
                <input type="tel" id="itcLeadPhone" class="itc-form-input" placeholder="+39 340 123 4567" required autocomplete="tel" />
              </div>

              <div class="itc-form-group">
                <label class="itc-form-label" for="itcLeadEmail">Email *</label>
                <input type="email" id="itcLeadEmail" class="itc-form-input" placeholder="es. mario.rossi@email.it" required autocomplete="email" />
              </div>
            </div>

            <!-- CHECKBOX PRIVACY E MARKETING (LETTERE PICCOLE E RIGOROSAMENTE NON IN GRASSETTO) -->
            <div class="itc-privacy-box">
              <label class="itc-checkbox-item">
                <input type="checkbox" id="itcConsentPrivacy" required />
                <p class="itc-privacy-text-small">
                  Dichiaro di aver preso visione e di accettare la <a href="/privacy-policy.html" target="_blank" rel="noopener">Privacy Policy</a> e i <a href="/termini-di-servizio.html" target="_blank" rel="noopener">Termini di Servizio</a>.
                </p>
              </label>

              <label class="itc-checkbox-item">
                <input type="checkbox" id="itcConsentMarketing" required />
                <p class="itc-privacy-text-small">
                  acconsento espressamente all'utilizzo dei dati forniti (nome, email, numero di telefono e città) per finalità di marketing, comunicazioni commerciali, offerte promozionali e newsletter relative ai corsi ed ai servizi di itercars, conformemente alla normativa europea gdpr (ue 2016/679).
                </p>
              </label>
            </div>

            <div id="itcFormError" style="display: none; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.4); color: #ef4444; padding: 8px 12px; border-radius: 8px; font-size: 0.8rem; margin-bottom: 12px; text-align: center;"></div>

            <!-- TASTO VERDE CALL TO ACTION: RICEVI SCONTO PARTECIPAZIONE -->
            <button type="submit" id="itcSubmitBtn" class="itc-submit-btn">
              <span>RICEVI SCONTO PARTECIPAZIONE</span>
              <i class="ri-arrow-right-line"></i>
            </button>

            <p class="itc-legal-note">
              🔒 Invio sicuro e protetto in conformità al GDPR UE 2016/679. Nessun costo nascosto.
            </p>
          </form>
        </div>

        <!-- VISTA SUCCESSO E RINGRAZIAMENTO (POST INVIO - SENZA INDICAZIONI DI PREZZO) -->
        <div id="itcPromoSuccessWrapper" class="itc-success-view" style="display: none; text-align: center; padding: 10px 0;">
          <div class="itc-success-icon" style="font-size: 2.8rem; color: #2ecc71; margin-bottom: 8px;">
            <i class="ri-checkbox-circle-fill"></i>
          </div>

          <h3 class="itc-success-title" style="font-size: 1.45rem; font-weight: 800; color: #ffffff; margin-bottom: 6px;">
            Richiesta Inviata con Successo!
          </h3>

          <p class="itc-success-text" style="font-size: 0.88rem; color: #94a3b8; line-height: 1.5; margin-bottom: 16px;">
            Il tuo codice sconto del <strong>50%</strong> per la partecipazione è stato generato ed è ora attivo.<br>
            Abbiamo inviato una copia completa all'indirizzo <strong id="itcDisplayEmail" style="color: #2ecc71;"></strong>.
          </p>

          <!-- Box Codice Stripe Personale -->
          <div style="background: rgba(0, 146, 70, 0.12); border: 2px dashed rgba(46, 204, 113, 0.55); border-radius: 14px; padding: 16px; margin-bottom: 18px;">
            <span style="font-size: 0.72rem; font-weight: 800; color: #d4af37; letter-spacing: 1.2px; display: block; margin-bottom: 8px; text-transform: uppercase;">IL TUO CODICE SCONTO DEL 50%</span>
            
            <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px; flex-wrap: wrap;">
              <div id="itcDisplayCode" style="font-size: 1.65rem; font-weight: 900; letter-spacing: 2px; color: #2ecc71; font-family: monospace; background: rgba(0,0,0,0.5); padding: 8px 16px; border-radius: 8px; border: 1px solid rgba(46, 204, 113, 0.35);">
                GENERAZIONE...
              </div>
              <button type="button" id="itcCopyCodeBtn" style="background: rgba(46, 204, 113, 0.2); border: 1px solid rgba(46, 204, 113, 0.5); color: #2ecc71; padding: 8px 12px; border-radius: 8px; cursor: pointer; font-size: 0.8rem; font-weight: 700; transition: all 0.2s;" title="Copia codice">
                <i class="ri-file-copy-line"></i> Copia
              </button>
            </div>

            <p id="itcDisplayExpiry" style="font-size: 0.82rem; color: #f59e0b; margin-top: 10px; margin-bottom: 0; font-weight: 700;">
              ⏰ Il tuo codice ha validità di 7 giorni a partire da oggi.
            </p>
          </div>

          <!-- Azioni: Chiudi per continuare a navigare sul sito -->
          <div style="display: flex; flex-direction: column; gap: 10px;">
            <button type="button" id="itcSuccessCloseBtn" class="itc-submit-btn" style="background: linear-gradient(135deg, #009246 0%, #2ecc71 100%); cursor: pointer; font-size: 0.92rem; padding: 13px 20px;">
              <i class="ri-check-line"></i>
              <span>HO SALVATO IL CODICE, CONTINUA SUL SITO</span>
            </button>

            <!-- Link discreto facoltativo (apre in una nuova scheda senza abbandonare il sito) -->
            <a id="itcDirectCheckoutBtn" href="https://buy.stripe.com/6oUaEY3RHbE8a6v9xA0co01" target="_blank" rel="noopener" style="color: #94a3b8; font-size: 0.78rem; text-decoration: underline; transition: color 0.2s; padding: 4px;" onmouseover="this.style.color='#2ecc71'" onmouseout="this.style.color='#94a3b8'">
              Oppure procedi subito al modulo riservato con sconto pre-applicato ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modalContainer);

  // Funzione Mostra Targhettina Verde Permanente
  function showStickyTab() {
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

  // Funzione Apertura Modale
  function openPromoModal() {
    if (localStorage.getItem(STORAGE_KEY_SUBMITTED) === 'true') return;
    hideStickyTab();
    modalContainer.classList.add('itc-active');
  }

  // Funzione Chiusura Modale (fa apparire la targhettina verde permanente al margine inferiore)
  function closePromoModal() {
    modalContainer.classList.remove('itc-active');
    sessionStorage.setItem(STORAGE_KEY_DISMISSED, 'true');
    showStickyTab();
  }

  // Event Listener Chiusura
  const closeBtn = document.getElementById('itcPromoCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', closePromoModal);

  const successCloseBtn = document.getElementById('itcSuccessCloseBtn');
  if (successCloseBtn) successCloseBtn.addEventListener('click', function () {
    closePromoModal();
    hideStickyTab();
    if (stickyTab) stickyTab.remove();
  });

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

  // Event Listener Click sulla Targhettina Verde per riaprire il modale
  stickyTab.addEventListener('click', function () {
    openPromoModal();
  });

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

          // Rimuovi la targhettina dal fondo
          hideStickyTab();
          if (stickyTab) stickyTab.remove();

          // Dati del codice generato da Stripe
          const discountCode = result.discountCode || 'BROKER50-PROMO';
          const checkoutUrl = result.checkoutUrl || ('https://buy.stripe.com/6oUaEY3RHbE8a6v9xA0co01?prefilled_promo_code=' + discountCode);

          const codeDisplay = document.getElementById('itcDisplayCode');
          if (codeDisplay) codeDisplay.textContent = discountCode;

          const emailDisplay = document.getElementById('itcDisplayEmail');
          if (emailDisplay) emailDisplay.textContent = emailCheck.clean;

          const expiryDisplay = document.getElementById('itcDisplayExpiry');
          if (expiryDisplay) {
            const expDate = result.discountExpiresAt ? new Date(result.discountExpiresAt) : new Date(Date.now() + 7 * 86400000);
            const expStr = expDate.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
            expiryDisplay.innerHTML = `⏰ Il tuo codice ha <strong>validità di 7 giorni</strong> a partire da oggi (scadenza: <strong>${expStr}</strong>).`;
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
  }

  // APPARIZIONE AUTOMATICA
  window.addEventListener('load', function () {
    // Se ha già compilato, esci
    if (localStorage.getItem(STORAGE_KEY_SUBMITTED) === 'true') {
      return;
    }

    // Se l'utente lo aveva già chiuso in precedenza, mostra subito la targhettina permanente
    if (sessionStorage.getItem(STORAGE_KEY_DISMISSED) === 'true') {
      showStickyTab();
      return;
    }

    // Altrimenti per la prima visita, fai apparire il modale dopo 1.8 secondi
    setTimeout(function () {
      openPromoModal();
    }, 1800);
  });

  // Espone la funzione nel caso si voglia aprire anche manualmente con un pulsante nel sito
  window.openItercarsPromoModal = openPromoModal;
})();

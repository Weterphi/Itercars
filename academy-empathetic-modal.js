/* ==========================================================================
   ITERCARS ACADEMY - MODULO EMPATICO INTERATTIVO: PARTENARIATO O MASTERCLASS
   Appare immediatamente sulla pagina Academy sopra tutto (inclusi cookies).
   Se chiuso, mostra la targhetta sul margine sinistro ("Compila modulo").
   Comprende adattamento a schermi grandi e doppie spunte Privacy & Marketing.
   Integrazione con StratosHub CRM Webhook API
   Endpoint: https://europe-west1-stratoshub-2a295.cloudfunctions.net/ingestLead
   ========================================================================== */

(function () {
  'use strict';

  // Verifica che siamo sulla pagina Academy
  const isAcademy =
    window.location.pathname.includes('academy') ||
    window.location.href.includes('academy') ||
    document.querySelector('.acd-hero, #academyPresentationSection');

  if (!isAcademy) return;

  const STORAGE_SUBMITTED = 'itercars_academy_empathetic_submitted';
  const STORAGE_DISMISSED = 'itercars_academy_empathetic_dismissed';

  // Iniezione Stili CSS per il Modulo Empatico e la Targhetta Sinistra
  const styleEl = document.createElement('style');
  styleEl.id = 'itercars-empathetic-funnel-styles';
  styleEl.innerHTML = `
    .itc-emp-overlay {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      background: rgba(3, 7, 18, 0.92);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      z-index: 99999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.35s;
      box-sizing: border-box;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }

    .itc-emp-overlay.itc-emp-active {
      opacity: 1;
      visibility: visible;
    }

    .itc-emp-card {
      position: relative;
      width: 100%;
      max-width: 680px;
      background: linear-gradient(165deg, rgba(15, 23, 42, 0.99) 0%, rgba(9, 13, 22, 1) 100%);
      border: 1px solid rgba(46, 204, 113, 0.45);
      border-radius: 24px;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.95), 0 0 60px rgba(0, 146, 70, 0.25);
      color: #ffffff;
      transform: scale(0.95) translateY(20px);
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      box-sizing: border-box;
      overflow: hidden;
      margin: auto;
    }

    .itc-emp-overlay.itc-emp-active .itc-emp-card {
      transform: scale(1) translateY(0);
    }

    .itc-emp-header {
      padding: 18px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(0, 0, 0, 0.3);
    }

    .itc-emp-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .itc-emp-brand-icon {
      width: 40px;
      height: 40px;
      border-radius: 12px;
      background: rgba(46, 204, 113, 0.15);
      border: 1px solid rgba(46, 204, 113, 0.35);
      color: #2ecc71;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
    }

    .itc-emp-brand-title {
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.6px;
      color: #ffffff;
      text-transform: uppercase;
    }

    .itc-emp-brand-sub {
      font-size: 12px;
      color: #94a3b8;
    }

    .itc-emp-close {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 20px;
      transition: all 0.2s;
    }

    .itc-emp-close:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #ffffff;
    }

    .itc-emp-progress-bar-wrap {
      padding: 14px 24px 4px;
    }

    .itc-emp-progress-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 8px;
    }

    .itc-emp-progress-track {
      width: 100%;
      height: 6px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 99px;
      overflow: hidden;
    }

    .itc-emp-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #009245 0%, #2ecc71 100%);
      border-radius: 99px;
      transition: width 0.35s ease;
    }

    .itc-emp-body {
      padding: 24px;
    }

    .itc-emp-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 99px;
      background: rgba(46, 204, 113, 0.15);
      border: 1px solid rgba(46, 204, 113, 0.35);
      color: #2ecc71;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 14px;
    }

    .itc-emp-title {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.32;
      margin: 0 0 10px 0;
    }

    .itc-emp-desc {
      font-size: 14px;
      color: #94a3b8;
      line-height: 1.55;
      margin: 0 0 22px 0;
    }

    .itc-emp-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .itc-emp-option-btn {
      width: 100%;
      padding: 16px 20px;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #f1f5f9;
      font-size: 15px;
      font-weight: 700;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.2s ease;
      box-sizing: border-box;
      line-height: 1.4;
    }

    .itc-emp-option-btn:hover {
      background: rgba(46, 204, 113, 0.08);
      border-color: rgba(46, 204, 113, 0.5);
      color: #ffffff;
      transform: translateY(-1px);
    }

    .itc-emp-option-btn.itc-selected {
      background: rgba(46, 204, 113, 0.16);
      border-color: #2ecc71;
      color: #ffffff;
      box-shadow: 0 0 20px rgba(46, 204, 113, 0.2);
    }

    .itc-emp-opt-circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      flex-shrink: 0;
      margin-left: 12px;
      transition: all 0.2s;
    }

    .itc-emp-option-btn:hover .itc-emp-opt-circle {
      border-color: #2ecc71;
      background: #2ecc71;
      color: #0c111d;
    }

    .itc-emp-option-btn.itc-selected .itc-emp-opt-circle {
      border-color: #2ecc71;
      background: #2ecc71;
      color: #0c111d;
    }

    /* STEP 2: Validazione Radar */
    .itc-emp-scan-wrap {
      text-align: center;
      padding: 34px 14px;
    }

    .itc-emp-radar {
      position: relative;
      width: 74px;
      height: 74px;
      border-radius: 22px;
      background: linear-gradient(135deg, #009245 0%, #2ecc71 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 34px;
      margin: 0 auto 22px;
      box-shadow: 0 10px 30px rgba(46, 204, 113, 0.35);
    }

    .itc-emp-radar::after {
      content: '';
      position: absolute;
      inset: -6px;
      border-radius: 26px;
      border: 1px solid rgba(46, 204, 113, 0.4);
      animation: itcEmpPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    @keyframes itcEmpPing {
      0% { transform: scale(0.95); opacity: 0.8; }
      100% { transform: scale(1.3); opacity: 0; }
    }

    /* STEP 4: Form Fields */
    .itc-emp-field {
      margin-bottom: 16px;
    }

    .itc-emp-label {
      display: block;
      font-size: 13px;
      font-weight: 700;
      color: #cbd5e1;
      margin-bottom: 8px;
    }

    .itc-emp-input-wrap {
      position: relative;
    }

    .itc-emp-input {
      width: 100%;
      padding: 14px 16px 14px 42px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #ffffff;
      font-size: 15px;
      box-sizing: border-box;
      outline: none;
      transition: all 0.2s;
    }

    .itc-emp-input:focus {
      border-color: #2ecc71;
      background: rgba(255, 255, 255, 0.08);
      box-shadow: 0 0 15px rgba(46, 204, 113, 0.2);
    }

    .itc-emp-input-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
      font-size: 18px;
    }

    .itc-emp-summary {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 14px;
      padding: 14px 18px;
      font-size: 13px;
      color: #94a3b8;
      margin-bottom: 18px;
      line-height: 1.6;
    }

    .itc-emp-summary strong {
      color: #ffffff;
    }

    /* Checkboxes: Privacy e Marketing */
    .itc-emp-checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 14px;
      margin-bottom: 20px;
    }

    .itc-emp-privacy {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.5;
      cursor: pointer;
      user-select: none;
    }

    .itc-emp-privacy input[type="checkbox"] {
      width: 18px;
      height: 18px;
      margin-top: 2px;
      accent-color: #2ecc71;
      cursor: pointer;
      flex-shrink: 0;
    }

    .itc-emp-cta-btn {
      width: 100%;
      padding: 16px 26px;
      border-radius: 14px;
      background: linear-gradient(135deg, #009245 0%, #2ecc71 100%);
      color: #ffffff;
      font-size: 16px;
      font-weight: 800;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      box-shadow: 0 8px 25px rgba(0, 146, 70, 0.4);
      transition: all 0.2s ease;
    }

    .itc-emp-cta-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 30px rgba(0, 146, 70, 0.55);
    }

    .itc-emp-cta-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    .itc-emp-nav-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding-top: 18px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      margin-top: 22px;
    }

    .itc-emp-btn-back {
      padding: 12px 20px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #cbd5e1;
      font-size: 13px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }

    .itc-emp-btn-back:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
    }

    .itc-emp-error {
      padding: 12px 16px;
      border-radius: 12px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #fca5a5;
      font-size: 13px;
      font-weight: 600;
      margin-bottom: 16px;
      display: none;
    }

    /* ======================================================================
       TARGHETTA SUL MARGINE SINISTRO ("Compila modulo")
       ====================================================================== */
    .itc-emp-left-tab {
      position: fixed;
      left: 0;
      top: 50%;
      transform: translateY(-50%) translateX(-100%);
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(9, 13, 22, 1) 100%);
      border: 1px solid rgba(46, 204, 113, 0.55);
      border-left: none;
      border-radius: 0 16px 16px 0;
      box-shadow: 0 10px 35px rgba(0, 0, 0, 0.7), 0 0 25px rgba(46, 204, 113, 0.35);
      padding: 14px 18px 14px 12px;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      z-index: 9999999;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.4px;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s, background 0.2s, padding 0.2s;
      box-sizing: border-box;
      outline: none;
    }

    .itc-emp-left-tab.itc-tab-visible {
      transform: translateY(-50%) translateX(0);
    }

    /* Nasconde completamente la targhetta e il modulo quando la modale di login è aperta */
    body.login-modal-open .itc-emp-left-tab,
    body.login-modal-open #itcEmpLeftTab,
    body.login-modal-open .itc-emp-overlay,
    body.login-modal-open #itcEmpatheticOverlay,
    #academyLoginModal.active ~ .itc-emp-left-tab,
    #academyLoginModal.active ~ #itcEmpLeftTab,
    #academyLoginModal.active ~ .itc-emp-overlay,
    #academyLoginModal.active ~ #itcEmpatheticOverlay {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
      transform: translateY(-50%) translateX(-120%) !important;
    }

    .itc-emp-left-tab:hover {
      background: linear-gradient(135deg, rgba(22, 34, 59, 0.98) 0%, rgba(13, 20, 36, 1) 100%);
      border-color: #2ecc71;
      box-shadow: 0 14px 45px rgba(0, 0, 0, 0.85), 0 0 35px rgba(46, 204, 113, 0.5);
      padding-right: 22px;
    }

    .itc-emp-left-tab .itc-tab-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(46, 204, 113, 0.2);
      border: 1px solid rgba(46, 204, 113, 0.45);
      color: #2ecc71;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      flex-shrink: 0;
    }

    /* ======================================================================
       ADATTAMENTO RESPONSIVE PER DESKTOP & SCHERMI GRANDI (2K / 4K)
       ====================================================================== */
    @media (min-width: 1024px) {
      .itc-emp-card {
        max-width: 760px;
        border-radius: 28px;
      }

      .itc-emp-header {
        padding: 22px 32px;
      }

      .itc-emp-brand-icon {
        width: 44px;
        height: 44px;
        font-size: 22px;
        border-radius: 12px;
      }

      .itc-emp-brand-title {
        font-size: 15px;
        letter-spacing: 0.8px;
      }

      .itc-emp-brand-sub {
        font-size: 13px;
      }

      .itc-emp-close {
        width: 40px;
        height: 40px;
        font-size: 22px;
      }

      .itc-emp-progress-bar-wrap {
        padding: 18px 32px 6px;
      }

      .itc-emp-progress-meta {
        font-size: 13px;
      }

      .itc-emp-progress-track {
        height: 8px;
      }

      .itc-emp-body {
        padding: 32px;
      }

      .itc-emp-badge {
        font-size: 13px;
        padding: 6px 16px;
        margin-bottom: 16px;
      }

      .itc-emp-title {
        font-size: 26px;
        line-height: 1.35;
        margin-bottom: 12px;
      }

      .itc-emp-desc {
        font-size: 16px;
        line-height: 1.6;
        margin-bottom: 26px;
      }

      .itc-emp-option-btn {
        padding: 18px 24px;
        border-radius: 16px;
        font-size: 16px;
      }

      .itc-emp-opt-circle {
        width: 28px;
        height: 28px;
        font-size: 15px;
      }

      .itc-emp-label {
        font-size: 15px;
        margin-bottom: 10px;
      }

      .itc-emp-input {
        padding: 16px 18px 16px 48px;
        border-radius: 14px;
        font-size: 16px;
      }

      .itc-emp-input-icon {
        left: 16px;
        font-size: 20px;
      }

      .itc-emp-summary {
        padding: 16px 20px;
        font-size: 14px;
        margin-bottom: 22px;
        border-radius: 14px;
      }

      .itc-emp-privacy {
        font-size: 13px;
        gap: 12px;
      }

      .itc-emp-privacy input[type="checkbox"] {
        width: 20px;
        height: 20px;
      }

      .itc-emp-cta-btn {
        padding: 18px 28px;
        font-size: 17px;
        border-radius: 16px;
      }

      .itc-emp-btn-back {
        padding: 12px 22px;
        font-size: 14px;
        border-radius: 12px;
      }

      .itc-emp-left-tab {
        font-size: 15px;
        padding: 16px 22px 16px 14px;
        border-radius: 0 18px 18px 0;
      }

      .itc-emp-left-tab .itc-tab-icon {
        width: 36px;
        height: 36px;
        font-size: 18px;
      }
    }

    @media (min-width: 1440px) {
      .itc-emp-card {
        max-width: 820px;
      }

      .itc-emp-title {
        font-size: 29px;
      }

      .itc-emp-desc {
        font-size: 17px;
      }

      .itc-emp-option-btn {
        padding: 20px 26px;
        font-size: 17px;
      }

      .itc-emp-label {
        font-size: 16px;
      }

      .itc-emp-input {
        font-size: 17px;
        padding: 17px 20px 17px 50px;
      }
    }
  `;
  document.head.appendChild(styleEl);

  // 1. Creazione DOM della Targhetta a Sinistra ("Compila modulo")
  const leftTab = document.createElement('button');
  leftTab.type = 'button';
  leftTab.id = 'itcEmpLeftTab';
  leftTab.className = 'itc-emp-left-tab';
  leftTab.setAttribute('aria-label', 'Compila modulo candidatura ITERCARS Academy');
  leftTab.innerHTML = `
    <div class="itc-tab-icon">
      <i class="ri-survey-line"></i>
    </div>
    <span>Compila modulo</span>
  `;
  document.body.appendChild(leftTab);

  // 2. Creazione DOM Modale Empatico
  const overlay = document.createElement('div');
  overlay.className = 'itc-emp-overlay';
  overlay.id = 'itcEmpatheticOverlay';

  overlay.innerHTML = `
    <div class="itc-emp-card" id="itcEmpatheticCard" role="dialog" aria-modal="true">
      <!-- Header -->
      <div class="itc-emp-header">
        <div class="itc-emp-brand">
          <div class="itc-emp-brand-icon">
            <i class="ri-roadster-line"></i>
          </div>
          <div>
            <div class="itc-emp-brand-title">ITERCARS Academy</div>
            <div class="itc-emp-brand-sub">Masterclass &amp; Partenariato Operativo</div>
          </div>
        </div>
        <button type="button" class="itc-emp-close" id="itcEmpCloseBtn" title="Chiudi">
          <i class="ri-close-line"></i>
        </button>
      </div>

      <!-- Barra di Progresso -->
      <div class="itc-emp-progress-bar-wrap" id="itcEmpProgressWrap">
        <div class="itc-emp-progress-meta">
          <span id="itcEmpProgressLabel">Fase 1 di 3</span>
          <span id="itcEmpProgressPercent" style="color: #2ecc71; font-weight: 700;">33%</span>
        </div>
        <div class="itc-emp-progress-track">
          <div class="itc-emp-progress-fill" id="itcEmpProgressFill" style="width: 33%;"></div>
        </div>
      </div>

      <!-- Corpo del Modulo -->
      <div class="itc-emp-body">
        <div class="itc-emp-error" id="itcEmpErrorBox"></div>

        <!-- STEP 1: L'AGGANCIO (Partenariato o Masterclass) -->
        <div id="itcEmpStep1">
          <div class="itc-emp-badge">
            <i class="ri-shield-star-line"></i> Opportunità Riservata
          </div>
          <h3 class="itc-emp-title">
            Vuoi entrare nel business del Noleggio a Lungo Termine e Supercar?
          </h3>
          <p class="itc-emp-desc">
            Rispondi a 3 brevi domande per scoprire se il tuo profilo è idoneo per la Masterclass o per il Partenariato Operativo ITERCARS (richiede 30 secondi).
          </p>

          <label class="itc-emp-label">A quale percorso o collaborazione sei maggiormente interessato?</label>
          <div class="itc-emp-options">
            <button type="button" class="itc-emp-option-btn" data-step1="Masterclass Completa Broker Supercar">
              <span>Masterclass Completa Broker Supercar (Diventa Broker Indipendente)</span>
              <div class="itc-emp-opt-circle"><i class="ri-arrow-right-line"></i></div>
            </button>
            <button type="button" class="itc-emp-option-btn" data-step1="Partenariato Ufficiale ITERCARS">
              <span>Partenariato Ufficiale ITERCARS (Collabora con la nostra flotta e mandati)</span>
              <div class="itc-emp-opt-circle"><i class="ri-arrow-right-line"></i></div>
            </button>
            <button type="button" class="itc-emp-option-btn" data-step1="Entrambi (Formazione + Partnership Commerciale)">
              <span>Entrambi (Formazione + Partnership Commerciale Immediata)</span>
              <div class="itc-emp-opt-circle"><i class="ri-arrow-right-line"></i></div>
            </button>
          </div>
        </div>

        <!-- STEP 2: LA VALIDAZIONE (Transizione animata 2 secondi) -->
        <div id="itcEmpStep2" style="display: none;">
          <div class="itc-emp-scan-wrap">
            <div class="itc-emp-radar">
              <i class="ri-pulse-line"></i>
            </div>
            <div class="itc-emp-badge">
              <i class="ri-cpu-line"></i> Analisi Disponibilità &amp; Requisiti
            </div>
            <h4 style="font-size: 20px; font-weight: 800; color: #ffffff; line-height: 1.4; margin: 0 0 12px 0;">
              "Verifichiamo il tuo profilo e la disponibilità territoriale... Il mercato del noleggio luxury e del brokeraggio consente provvigioni elevate senza necessità di possedere i veicoli."
            </h4>
            <p style="font-size: 14px; color: #94a3b8; margin: 0 0 22px 0;">
              Analisi disponibilità posti riservati e tutor per l'edizione in corso...
            </p>

            <div style="width: 100%; max-width: 320px; height: 8px; background: rgba(255,255,255,0.08); border-radius: 99px; margin: 0 auto 14px; overflow: hidden;">
              <div id="itcEmpRadarBar" style="width: 0%; height: 100%; background: #2ecc71; border-radius: 99px; transition: width 0.1s linear;"></div>
            </div>
            <div id="itcEmpRadarPercent" style="font-size: 12px; color: #64748b; font-weight: 700;">0%</div>

            <div style="margin-top: 20px;">
              <button type="button" id="itcEmpSkipStep2" style="background: none; border: none; color: #94a3b8; font-size: 13px; text-decoration: underline; cursor: pointer;">
                Continua subito
              </button>
            </div>
          </div>
        </div>

        <!-- STEP 3: LA QUALIFICAZIONE -->
        <div id="itcEmpStep3" style="display: none;">
          <div class="itc-emp-badge">
            <i class="ri-user-star-line"></i> Profilazione Candidatura
          </div>
          <h3 class="itc-emp-title">Inquadriamo la tua situazione e disponibilità</h3>
          <p class="itc-emp-desc">
            Definisci la tua esperienza pregressa e il tempo a disposizione per strutturare il piano d'avvio.
          </p>

          <div style="margin-bottom: 22px;">
            <label class="itc-emp-label">Qual è la tua attuale esperienza nel settore vendite o automotive?</label>
            <div class="itc-emp-options">
              <button type="button" class="itc-emp-option-btn itc-q1-btn" data-q1="Parto da zero / Appassionato di auto">
                <span>Parto da zero / Appassionato di auto</span>
                <div class="itc-emp-opt-circle"><i class="ri-check-line"></i></div>
              </button>
              <button type="button" class="itc-emp-option-btn itc-q1-btn" data-q1="Ho esperienza commerciale / Vendite">
                <span>Ho esperienza commerciale / Vendite</span>
                <div class="itc-emp-opt-circle"><i class="ri-check-line"></i></div>
              </button>
              <button type="button" class="itc-emp-option-btn itc-q1-btn" data-q1="Opero già nel settore automotive o noleggi">
                <span>Opero già nel settore automotive o noleggi</span>
                <div class="itc-emp-opt-circle"><i class="ri-check-line"></i></div>
              </button>
            </div>
          </div>

          <div>
            <label class="itc-emp-label">Quanto tempo desideri dedicare a questa attività?</label>
            <div class="itc-emp-options">
              <button type="button" class="itc-emp-option-btn itc-q2-btn" data-q2="Part-time (Qualche ora a settimana)">
                <span>Part-time (Qualche ora a settimana per entrate extra)</span>
                <div class="itc-emp-opt-circle"><i class="ri-check-line"></i></div>
              </button>
              <button type="button" class="itc-emp-option-btn itc-q2-btn" data-q2="Full-time (Voglio creare la mia agenzia)">
                <span>Full-time (Voglio creare la mia agenzia o attività principale)</span>
                <div class="itc-emp-opt-circle"><i class="ri-check-line"></i></div>
              </button>
            </div>
          </div>

          <div class="itc-emp-nav-row">
            <button type="button" class="itc-emp-btn-back" id="itcEmpBackTo1">
              <i class="ri-arrow-left-line"></i> Indietro
            </button>
            <button type="button" class="itc-emp-cta-btn" id="itcEmpProceedTo4" style="width: auto; padding: 12px 24px; font-size: 14px;">
              <span>Procedi alla Candidatura</span> <i class="ri-arrow-right-line"></i>
            </button>
          </div>
        </div>

        <!-- STEP 4: LA RICOMPENSA E L'ACQUISIZIONE CON DOPPIA SPUNTA -->
        <div id="itcEmpStep4" style="display: none;">
          <form id="itcEmpLeadForm">
            <div class="itc-emp-badge">
              <i class="ri-checkbox-circle-line"></i> Profilo Idoneo
            </div>
            <h3 class="itc-emp-title">Ottimo! Il tuo profilo ha i requisiti per accedere al programma.</h3>
            <p class="itc-emp-desc">
              Un responsabile didattico o commerciale ITERCARS ti illustrerà il piano operativo, le provvigioni medie e le modalità di accesso.
            </p>

            <div class="itc-emp-summary">
              <div style="font-weight: 700; color: #2ecc71; margin-bottom: 4px;">Riepilogo della tua selezione:</div>
              <div>Percorso: <strong id="itcEmpSumPercorso">-</strong></div>
              <div>Esperienza: <strong id="itcEmpSumExp">-</strong> • Dedizione: <strong id="itcEmpSumTime">-</strong></div>
            </div>

            <div class="itc-emp-field">
              <label class="itc-emp-label">A chi dobbiamo intestare la candidatura? *</label>
              <div class="itc-emp-input-wrap">
                <i class="ri-user-line itc-emp-input-icon"></i>
                <input type="text" class="itc-emp-input" id="itcEmpName" required placeholder="es. Marco Rossi" />
              </div>
            </div>

            <div class="itc-emp-field">
              <label class="itc-emp-label">A quale email inviamo il programma e la documentazione? *</label>
              <div class="itc-emp-input-wrap">
                <i class="ri-mail-line itc-emp-input-icon"></i>
                <input type="email" class="itc-emp-input" id="itcEmpEmail" required placeholder="es. marco.rossi@email.it" />
              </div>
            </div>

            <div class="itc-emp-field">
              <label class="itc-emp-label">A quale numero preferisci ricevere il colloquio informativo? *</label>
              <div class="itc-emp-input-wrap">
                <i class="ri-phone-line itc-emp-input-icon"></i>
                <input type="tel" class="itc-emp-input" id="itcEmpPhone" required placeholder="Inserisci il tuo cellulare" />
              </div>
            </div>

            <!-- DOPPIE SPUNTE: PRIVACY POLICY & MARKETING -->
            <div class="itc-emp-checkbox-group">
              <!-- Spunta 1: Privacy Policy Obbligatoria -->
              <label class="itc-emp-privacy">
                <input type="checkbox" id="itcEmpPrivacy" required checked />
                <span>
                  <strong>Informativa Privacy *</strong>: Ho letto e accetto l'Informativa sul trattamento dei dati personali a norma del Regolamento UE 2016/679 (GDPR) per la gestione della candidatura gratuita. Nessun costo né vincolo contrattuale.
                </span>
              </label>

              <!-- Spunta 2: Marketing & Comunicazioni Riservate -->
              <label class="itc-emp-privacy">
                <input type="checkbox" id="itcEmpMarketing" checked />
                <span>
                  <strong>Consenso Marketing</strong>: Acconsento a ricevere comunicazioni informative, anteprime su mandati flotta e opportunità commerciali riservate da ITERCARS Academy via email o telefono.
                </span>
              </label>
            </div>

            <button type="submit" class="itc-emp-cta-btn" id="itcEmpSubmitBtn">
              <span>Invia la Mia Candidatura Gratuita</span> <i class="ri-send-plane-fill"></i>
            </button>

            <div style="text-align: center; font-size: 12px; color: #64748b; margin-top: 12px;">
              <i class="ri-lock-line"></i> Colloquio orientativo 100% gratuito e non vincolante
            </div>
          </form>
        </div>

        <!-- STEP 5: CONFERMA E SUCCESSO -->
        <div id="itcEmpStep5" style="display: none; text-align: center; padding: 24px 12px;">
          <div style="width: 68px; height: 68px; border-radius: 22px; background: rgba(46, 204, 113, 0.15); border: 1px solid #2ecc71; color: #2ecc71; display: flex; align-items: center; justify-content: center; font-size: 34px; margin: 0 auto 18px;">
            <i class="ri-check-double-line"></i>
          </div>

          <div class="itc-emp-badge">
            <i class="ri-checkbox-circle-fill"></i> Candidatura Registrata
          </div>

          <h3 class="itc-emp-title" id="itcEmpSuccessTitle">
            Candidatura registrata con successo!
          </h3>

          <p class="itc-emp-desc" id="itcEmpSuccessDesc" style="max-width: 460px; margin: 0 auto 26px;">
            Un responsabile ITERCARS esaminerà la tua richiesta e ti contatterà al numero indicato entro 24 ore lavorative.
          </p>

          <button type="button" class="itc-emp-cta-btn" id="itcEmpFinishBtn" style="max-width: 260px; margin: 0 auto;">
            <span>Chiudi e continua</span>
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Variabili di stato
  let step1Selection = '';
  let q1Selection = '';
  let q2Selection = '';

  const step1Box = document.getElementById('itcEmpStep1');
  const step2Box = document.getElementById('itcEmpStep2');
  const step3Box = document.getElementById('itcEmpStep3');
  const step4Box = document.getElementById('itcEmpStep4');
  const step5Box = document.getElementById('itcEmpStep5');
  const progressWrap = document.getElementById('itcEmpProgressWrap');
  const progressLabel = document.getElementById('itcEmpProgressLabel');
  const progressPercent = document.getElementById('itcEmpProgressPercent');
  const progressFill = document.getElementById('itcEmpProgressFill');
  const errorBox = document.getElementById('itcEmpErrorBox');

  function showError(msg) {
    if (!errorBox) return;
    errorBox.textContent = msg;
    errorBox.style.display = 'block';
  }

  function hideError() {
    if (!errorBox) return;
    errorBox.style.display = 'none';
    errorBox.textContent = '';
  }

  function setProgress(step, pct) {
    if (progressLabel) progressLabel.textContent = `Fase ${step} di 3`;
    if (progressPercent) progressPercent.textContent = `${pct}%`;
    if (progressFill) progressFill.style.width = `${pct}%`;
  }

  function isLoginModalOpen() {
    const loginModal = document.getElementById('academyLoginModal');
    if (!loginModal) return false;
    return (
      document.body.classList.contains('login-modal-open') ||
      loginModal.classList.contains('active') ||
      (loginModal.style.display && loginModal.style.display !== 'none' && loginModal.style.visibility !== 'hidden')
    );
  }

  // Gestione Targhetta a Sinistra
  function showLeftTab() {
    if (localStorage.getItem(STORAGE_SUBMITTED) === 'true') return;
    if (isLoginModalOpen()) return;
    if (leftTab) {
      leftTab.classList.add('itc-tab-visible');
    }
  }

  function hideLeftTab() {
    if (leftTab) {
      leftTab.classList.remove('itc-tab-visible');
    }
  }

  // Apertura modale empatico
  function openEmpatheticModal() {
    if (localStorage.getItem(STORAGE_SUBMITTED) === 'true') return;
    if (isLoginModalOpen()) return;
    hideLeftTab();
    overlay.classList.add('itc-emp-active');
  }

  // Chiusura modale empatico: fa apparire la targhetta a sinistra
  function closeEmpatheticModal() {
    overlay.classList.remove('itc-emp-active');
    sessionStorage.setItem(STORAGE_DISMISSED, 'true');
    if (!isLoginModalOpen()) {
      showLeftTab();
    }
  }

  let wasModalOpenBeforeLogin = false;

  function handleLoginModalOpened() {
    if (overlay && overlay.classList.contains('itc-emp-active')) {
      wasModalOpenBeforeLogin = true;
      overlay.classList.remove('itc-emp-active');
    }
    hideLeftTab();
  }

  function handleLoginModalClosed() {
    if (localStorage.getItem(STORAGE_SUBMITTED) === 'true') {
      hideLeftTab();
      if (overlay) overlay.classList.remove('itc-emp-active');
      return;
    }
    // Se non è stato compilato, riappare il modulo (se era aperto prima) oppure la targhetta
    setTimeout(function () {
      if (isLoginModalOpen()) return;
      if (wasModalOpenBeforeLogin) {
        wasModalOpenBeforeLogin = false;
        openEmpatheticModal();
      } else {
        showLeftTab();
      }
    }, 150);
  }

  window.onAcademyLoginModalOpen = handleLoginModalOpened;
  window.onAcademyLoginModalClose = handleLoginModalClosed;
  window.hideItercarsLeftTab = hideLeftTab;
  window.restoreItercarsLeftTab = function () {
    if (localStorage.getItem(STORAGE_SUBMITTED) === 'true') return;
    if (isLoginModalOpen()) return;
    showLeftTab();
  };

  function setupLoginModalObserver() {
    const loginModalEl = document.getElementById('academyLoginModal');
    if (!loginModalEl) return;
    let wasActive =
      loginModalEl.classList.contains('active') ||
      (loginModalEl.style.display && loginModalEl.style.display !== 'none' && loginModalEl.style.visibility !== 'hidden');

    if (wasActive) {
      handleLoginModalOpened();
    }

    const observer = new MutationObserver(function () {
      const isActive =
        loginModalEl.classList.contains('active') ||
        (loginModalEl.style.display && loginModalEl.style.display !== 'none' && loginModalEl.style.visibility !== 'hidden');
      if (isActive && !wasActive) {
        wasActive = true;
        document.body.classList.add('login-modal-open');
        handleLoginModalOpened();
      } else if (!isActive && wasActive) {
        wasActive = false;
        document.body.classList.remove('login-modal-open');
        handleLoginModalClosed();
      }
    });

    observer.observe(loginModalEl, { attributes: true, attributeFilter: ['class', 'style'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupLoginModalObserver);
  } else {
    setupLoginModalObserver();
  }

  // Event listener chiusura modale
  const closeBtn = document.getElementById('itcEmpCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeEmpatheticModal);

  // Click fuori dalla card
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      closeEmpatheticModal();
    }
  });

  // Tasto ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('itc-emp-active')) {
      closeEmpatheticModal();
    }
  });

  // Click sulla targhetta a sinistra per riaprire
  leftTab.addEventListener('click', function () {
    openEmpatheticModal();
  });

  // STEP 1 -> STEP 2
  const step1Buttons = overlay.querySelectorAll('[data-step1]');
  step1Buttons.forEach(btn => {
    btn.addEventListener('click', function () {
      step1Selection = this.getAttribute('data-step1') || '';
      hideError();

      step1Buttons.forEach(b => b.classList.remove('itc-selected'));
      this.classList.add('itc-selected');

      // Passaggio a Step 2 (Validazione animata 2 secondi)
      step1Box.style.display = 'none';
      step2Box.style.display = 'block';
      if (progressWrap) progressWrap.style.display = 'none';

      let currentRadar = 0;
      const radarBar = document.getElementById('itcEmpRadarBar');
      const radarTxt = document.getElementById('itcEmpRadarPercent');

      const radarInterval = setInterval(() => {
        currentRadar += 5;
        if (radarBar) radarBar.style.width = currentRadar + '%';
        if (radarTxt) radarTxt.textContent = currentRadar + '% completato';
        if (currentRadar >= 100) {
          clearInterval(radarInterval);
        }
      }, 95);

      const step2Timer = setTimeout(() => {
        clearInterval(radarInterval);
        goToStep3();
      }, 2100);

      const skipBtn = document.getElementById('itcEmpSkipStep2');
      if (skipBtn) {
        skipBtn.onclick = function () {
          clearTimeout(step2Timer);
          clearInterval(radarInterval);
          goToStep3();
        };
      }
    });
  });

  function goToStep3() {
    step2Box.style.display = 'none';
    step3Box.style.display = 'block';
    if (progressWrap) progressWrap.style.display = 'block';
    setProgress(2, 66);
  }

  // STEP 3 Selezioni
  const q1Buttons = overlay.querySelectorAll('.itc-q1-btn');
  q1Buttons.forEach(btn => {
    btn.addEventListener('click', function () {
      q1Buttons.forEach(b => b.classList.remove('itc-selected'));
      this.classList.add('itc-selected');
      q1Selection = this.getAttribute('data-q1') || '';
      hideError();
    });
  });

  const q2Buttons = overlay.querySelectorAll('.itc-q2-btn');
  q2Buttons.forEach(btn => {
    btn.addEventListener('click', function () {
      q2Buttons.forEach(b => b.classList.remove('itc-selected'));
      this.classList.add('itc-selected');
      q2Selection = this.getAttribute('data-q2') || '';
      hideError();
    });
  });

  const backTo1Btn = document.getElementById('itcEmpBackTo1');
  if (backTo1Btn) {
    backTo1Btn.addEventListener('click', function () {
      step3Box.style.display = 'none';
      step1Box.style.display = 'block';
      setProgress(1, 33);
      hideError();
    });
  }

  // STEP 3 -> STEP 4
  const proceedTo4Btn = document.getElementById('itcEmpProceedTo4');
  if (proceedTo4Btn) {
    proceedTo4Btn.addEventListener('click', function () {
      if (!q1Selection) {
        showError('Seleziona la tua attuale esperienza lavorativa o commerciale.');
        return;
      }
      if (!q2Selection) {
        showError('Indica quanto tempo desideri dedicare all\'attività.');
        return;
      }
      hideError();

      const sumPercorso = document.getElementById('itcEmpSumPercorso');
      const sumExp = document.getElementById('itcEmpSumExp');
      const sumTime = document.getElementById('itcEmpSumTime');

      if (sumPercorso) sumPercorso.textContent = step1Selection;
      if (sumExp) sumExp.textContent = q1Selection;
      if (sumTime) sumTime.textContent = q2Selection;

      step3Box.style.display = 'none';
      step4Box.style.display = 'block';
      setProgress(3, 95);
    });
  }

  // STEP 4: Invio Form Candidatura
  const form = document.getElementById('itcEmpLeadForm');
  const submitBtn = document.getElementById('itcEmpSubmitBtn');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      hideError();

      const name = document.getElementById('itcEmpName').value.trim();
      const email = document.getElementById('itcEmpEmail').value.trim();
      const phone = document.getElementById('itcEmpPhone').value.trim();
      const privacy = document.getElementById('itcEmpPrivacy').checked;
      const marketing = document.getElementById('itcEmpMarketing') ? document.getElementById('itcEmpMarketing').checked : false;

      if (!name || name.length < 2) {
        showError('Inserisci il tuo nome per completare la candidatura.');
        return;
      }

      if (!email || !email.includes('@') || email.length < 5) {
        showError('Inserisci un indirizzo email valido.');
        return;
      }

      if (!phone || phone.length < 6) {
        showError('Inserisci un recapito telefonico valido.');
        return;
      }

      if (!privacy) {
        showError('È necessario accettare l\'Informativa Privacy per procedere.');
        return;
      }

      submitBtn.disabled = true;
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> <span>Invio Candidatura in Corso...</span>';

      const payload = {
        name: name,
        email: email,
        phone: phone,
        city: 'Italia',
        interestTag: 'broker corso',
        source: 'sito_web',
        campaignName: 'Candidatura Partenariato / Masterclass ITERCARS',
        notes: `Percorso: ${step1Selection} | Esperienza: ${q1Selection} | Dedizione: ${q2Selection} | Consenso Marketing: ${marketing ? 'Si' : 'No'} | Candidatura ITERCARS Academy`,
        answers: {
          'Percorso Candidatura': step1Selection,
          'Esperienza Lavorativa': q1Selection,
          'Tempo / Dedizione': q2Selection,
          'Consenso Marketing': marketing ? 'Si (Autorizzato)' : 'No',
          'Informativa Privacy': 'Accettata (GDPR)'
        },
        marketingConsent: marketing
      };

      try {
        let success = false;
        let errMsg = '';

        try {
          const res = await fetch('https://europe-west1-stratoshub-2a295.cloudfunctions.net/ingestLead', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          if (res.ok) {
            success = true;
          } else {
            const data = await res.json().catch(() => null);
            if (data && data.error) errMsg = data.error;
          }
        } catch (fetchErr) {
          console.warn('Errore chiamata Cloud Function:', fetchErr);
        }

        if (success) {
          localStorage.setItem(STORAGE_SUBMITTED, 'true');
          sessionStorage.setItem(STORAGE_DISMISSED, 'true');

          hideLeftTab();
          if (leftTab) leftTab.remove();

          step4Box.style.display = 'none';
          if (progressWrap) progressWrap.style.display = 'none';
          step5Box.style.display = 'block';

          const successTitle = document.getElementById('itcEmpSuccessTitle');
          const successDesc = document.getElementById('itcEmpSuccessDesc');

          if (successTitle) successTitle.textContent = `Grazie ${name}, la tua candidatura è stata registrata!`;
          if (successDesc) {
            successDesc.innerHTML = `Un nostro responsabile didattico o commerciale esaminerà i tuoi requisiti e ti contatterà al numero <strong>${phone}</strong> inviando il programma all'indirizzo <strong>${email}</strong>.`;
          }

          const finishBtn = document.getElementById('itcEmpFinishBtn');
          if (finishBtn) {
            finishBtn.onclick = function () {
              overlay.classList.remove('itc-emp-active');
            };
          }
        } else {
          showError(errMsg || 'Si è verificato un errore momentaneo. Riprova tra poco.');
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      } catch (err) {
        console.error('Errore invio candidatura:', err);
        showError('Errore di connessione. Controlla la linea e riprova.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // APPARIZIONE IMMEDIATA: PRIMA COSA ASSOLUTA ALL'APERTURA DELLA PAGINA ACADEMY
  function initEmpatheticApp() {
    if (localStorage.getItem(STORAGE_SUBMITTED) === 'true') {
      return;
    }
    if (sessionStorage.getItem(STORAGE_DISMISSED) === 'true') {
      showLeftTab();
      return;
    }

    // Appare immediatamente sopra tutto
    openEmpatheticModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmpatheticApp);
  } else {
    initEmpatheticApp();
  }

  // Esporta funzioni per apertura e controllo manuale
  window.openItercarsEmpatheticModal = openEmpatheticModal;
  window.closeItercarsEmpatheticModal = closeEmpatheticModal;
})();

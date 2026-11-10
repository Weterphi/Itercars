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
      background: rgba(3, 7, 18, 0.9);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      z-index: 99999999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.3s;
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
      max-width: 620px;
      max-height: 92vh;
      background: linear-gradient(165deg, rgba(15, 23, 42, 0.98) 0%, rgba(9, 13, 22, 1) 100%);
      border: 1px solid rgba(46, 204, 113, 0.45);
      border-radius: 22px;
      box-shadow: 0 25px 80px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 146, 70, 0.28), 0 0 2px rgba(46, 204, 113, 0.5);
      color: #ffffff;
      transform: scale(0.96) translateY(14px);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-sizing: border-box;
      overflow-y: auto;
      overflow-x: hidden;
      margin: auto;
    }

    .itc-emp-overlay.itc-emp-active .itc-emp-card {
      transform: scale(1) translateY(0);
    }

    .itc-emp-header {
      padding: 16px 24px;
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
      width: 38px;
      height: 38px;
      border-radius: 11px;
      background: rgba(46, 204, 113, 0.15);
      border: 1px solid rgba(46, 204, 113, 0.4);
      color: #2ecc71;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 19px;
      box-shadow: 0 0 15px rgba(46, 204, 113, 0.2);
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
      width: 34px;
      height: 34px;
      border-radius: 9px;
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
      padding: 12px 24px 4px;
    }

    .itc-emp-progress-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 12px;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 6px;
    }

    .itc-emp-progress-track {
      width: 100%;
      height: 5px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 99px;
      overflow: hidden;
    }

    .itc-emp-progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #009245 0%, #2ecc71 100%);
      box-shadow: 0 0 10px rgba(46, 204, 113, 0.5);
      border-radius: 99px;
      transition: width 0.35s ease;
    }

    .itc-emp-body {
      padding: 22px 26px 26px;
    }

    .itc-emp-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 99px;
      background: rgba(46, 204, 113, 0.12);
      border: 1px solid rgba(46, 204, 113, 0.35);
      color: #2ecc71;
      font-size: 11.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
      box-shadow: 0 0 12px rgba(46, 204, 113, 0.15);
    }

    .itc-emp-title {
      font-size: 20px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.3;
      margin: 0 0 6px 0;
    }

    .itc-emp-desc {
      font-size: 13.5px;
      color: #94a3b8;
      line-height: 1.45;
      margin: 0 0 18px 0;
    }

    /* Illuminazione Luxury per le Domande */
    .itc-emp-question-aura {
      position: relative;
      padding: 16px;
      border-radius: 16px;
      background: radial-gradient(ellipse at 50% 0%, rgba(46, 204, 113, 0.12) 0%, rgba(15, 23, 42, 0.45) 75%);
      border: 1px solid rgba(46, 204, 113, 0.28);
      box-shadow: 0 4px 25px rgba(0, 0, 0, 0.35), 0 0 25px rgba(46, 204, 113, 0.12);
      margin-bottom: 16px;
    }

    .itc-emp-options {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .itc-emp-option-btn {
      width: 100%;
      padding: 13px 16px;
      border-radius: 13px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(15, 23, 42, 0.65) 100%);
      border: 1px solid rgba(46, 204, 113, 0.25);
      color: #f1f5f9;
      font-size: 14px;
      font-weight: 600;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      box-sizing: border-box;
      line-height: 1.35;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35), 0 0 10px rgba(46, 204, 113, 0.06);
    }

    .itc-emp-option-btn:hover {
      background: linear-gradient(135deg, rgba(46, 204, 113, 0.14) 0%, rgba(15, 23, 42, 0.85) 100%);
      border-color: #2ecc71;
      color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 8px 26px rgba(0, 0, 0, 0.5), 0 0 22px rgba(46, 204, 113, 0.35), inset 0 0 12px rgba(46, 204, 113, 0.12);
    }

    .itc-emp-option-btn.itc-selected {
      background: linear-gradient(135deg, rgba(46, 204, 113, 0.22) 0%, rgba(15, 23, 42, 0.95) 100%);
      border-color: #2ecc71;
      color: #ffffff;
      box-shadow: 0 8px 30px rgba(0, 0, 0, 0.6), 0 0 30px rgba(46, 204, 113, 0.5), inset 0 0 16px rgba(46, 204, 113, 0.2);
    }

    .itc-emp-opt-text {
      display: flex;
      flex-direction: column;
      gap: 3px;
      flex: 1;
    }

    .itc-emp-opt-title {
      font-size: 14px;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: 0.2px;
    }

    .itc-emp-opt-desc {
      font-size: 12px;
      font-weight: 400;
      color: #94a3b8;
      line-height: 1.35;
    }

    .itc-emp-opt-circle {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      flex-shrink: 0;
      transition: all 0.2s;
    }

    .itc-emp-option-btn:hover .itc-emp-opt-circle {
      border-color: #2ecc71;
      background: #2ecc71;
      color: #0c111d;
      box-shadow: 0 0 10px rgba(46, 204, 113, 0.6);
    }

    .itc-emp-option-btn.itc-selected .itc-emp-opt-circle {
      border-color: #2ecc71;
      background: #2ecc71;
      color: #0c111d;
      box-shadow: 0 0 12px rgba(46, 204, 113, 0.7);
    }

    .itc-emp-scan-wrap {
      text-align: center;
      padding: 24px 10px;
    }

    .itc-emp-radar {
      position: relative;
      width: 62px;
      height: 62px;
      border-radius: 20px;
      background: linear-gradient(135deg, #009245 0%, #2ecc71 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 28px;
      margin: 0 auto 16px;
      box-shadow: 0 10px 30px rgba(46, 204, 113, 0.4), 0 0 25px rgba(46, 204, 113, 0.3);
    }

    .itc-emp-radar::after {
      content: '';
      position: absolute;
      inset: -6px;
      border-radius: 24px;
      border: 1px solid rgba(46, 204, 113, 0.45);
      animation: itcEmpPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    @keyframes itcEmpPing {
      0% { transform: scale(0.95); opacity: 0.8; }
      100% { transform: scale(1.3); opacity: 0; }
    }

    .itc-emp-summary {
      padding: 10px 14px;
      background: rgba(46, 204, 113, 0.09);
      border: 1px solid rgba(46, 204, 113, 0.28);
      border-radius: 10px;
      font-size: 12.5px;
      color: #cbd5e1;
      margin-bottom: 14px;
      text-align: center;
    }

    .itc-emp-field {
      margin-bottom: 12px;
    }

    .itc-emp-label {
      font-size: 11.5px;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      margin-bottom: 5px;
      display: block;
    }

    .itc-emp-input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .itc-emp-input-icon {
      position: absolute;
      left: 14px;
      color: #2ecc71;
      font-size: 17px;
      pointer-events: none;
    }

    .itc-emp-input {
      width: 100%;
      padding: 11px 14px 11px 40px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 11px;
      color: #ffffff;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: all 0.25s ease;
      box-sizing: border-box;
    }

    .itc-emp-input:focus {
      background: rgba(15, 23, 42, 0.96);
      border-color: #2ecc71;
      box-shadow: 0 0 0 3px rgba(46, 204, 113, 0.25), 0 0 20px rgba(46, 204, 113, 0.2);
    }

    .itc-emp-checkbox-group {
      margin: 12px 0 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: rgba(0, 0, 0, 0.25);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 12px 14px;
    }

    .itc-emp-privacy {
      display: flex;
      align-items: flex-start;
      gap: 9px;
      cursor: pointer;
      font-size: 12px;
      color: #94a3b8;
      line-height: 1.45;
    }

    .itc-emp-privacy input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: #2ecc71;
      margin-top: 2px;
      flex-shrink: 0;
      cursor: pointer;
    }

    .itc-emp-privacy strong {
      color: #e2e8f0;
    }

    .itc-emp-cta-btn {
      width: 100%;
      padding: 13px 20px;
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #009245 0%, #2ecc71 100%);
      color: #ffffff;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      box-shadow: 0 6px 22px rgba(46, 204, 113, 0.32);
      transition: all 0.25s ease;
    }

    .itc-emp-cta-btn:hover {
      box-shadow: 0 8px 30px rgba(46, 204, 113, 0.48);
      transform: translateY(-1px);
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
      margin-top: 14px;
    }

    .itc-emp-btn-back {
      padding: 10px 16px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #94a3b8;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }

    .itc-emp-btn-back:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }

    .itc-emp-error {
      padding: 9px 13px;
      border-radius: 9px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #fca5a5;
      font-size: 12.5px;
      font-weight: 600;
      margin-bottom: 12px;
      display: none;
    }

    /* Targhetta Sinistra */
    .itc-emp-left-tab {
      position: fixed;
      left: 0;
      top: 50%;
      transform: translateY(-50%) translateX(-100%);
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.98) 0%, rgba(9, 13, 22, 1) 100%);
      border: 1px solid rgba(46, 204, 113, 0.55);
      border-left: none;
      border-radius: 0 14px 14px 0;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(46, 204, 113, 0.3);
      padding: 11px 15px 11px 9px;
      color: #ffffff;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      z-index: 9999999;
      font-family: inherit;
      font-size: 12.5px;
      font-weight: 800;
      letter-spacing: 0.3px;
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s, background 0.2s, padding 0.2s;
      box-sizing: border-box;
      outline: none;
    }

    .itc-emp-left-tab.itc-tab-visible {
      transform: translateY(-50%) translateX(0);
    }

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
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.85), 0 0 30px rgba(46, 204, 113, 0.45);
      padding-right: 18px;
    }

    .itc-emp-left-tab .itc-tab-icon {
      width: 26px;
      height: 26px;
      border-radius: 7px;
      background: rgba(46, 204, 113, 0.2);
      border: 1px solid rgba(46, 204, 113, 0.4);
      color: #2ecc71;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
    }

    /* Adattamento Responsive Desktop e Grandi Schermi (1080p, 1440p, 4K) */
    @media (min-width: 1024px) {
      .itc-emp-card {
        max-width: 680px;
        border-radius: 24px;
      }
      .itc-emp-header {
        padding: 18px 28px;
      }
      .itc-emp-brand-icon {
        width: 42px;
        height: 42px;
        font-size: 21px;
      }
      .itc-emp-brand-title {
        font-size: 15px;
      }
      .itc-emp-brand-sub {
        font-size: 12.5px;
      }
      .itc-emp-body {
        padding: 26px 32px 30px;
      }
      .itc-emp-title {
        font-size: 22px;
      }
      .itc-emp-desc {
        font-size: 14.5px;
      }
      .itc-emp-opt-title {
        font-size: 15px;
      }
      .itc-emp-opt-desc {
        font-size: 12.5px;
      }
      .itc-emp-option-btn {
        padding: 15px 18px;
      }
      .itc-emp-input {
        font-size: 15px;
        padding: 12px 14px 12px 42px;
      }
      .itc-emp-label {
        font-size: 12px;
      }
      .itc-emp-cta-btn {
        font-size: 15px;
        padding: 14px 22px;
      }
    }

    @media (min-width: 1440px) {
      .itc-emp-card {
        max-width: 740px;
        border-radius: 26px;
      }
      .itc-emp-header {
        padding: 20px 32px;
      }
      .itc-emp-body {
        padding: 30px 36px 36px;
      }
      .itc-emp-title {
        font-size: 24px;
      }
      .itc-emp-desc {
        font-size: 15px;
      }
      .itc-emp-opt-title {
        font-size: 16px;
      }
      .itc-emp-opt-desc {
        font-size: 13px;
      }
      .itc-emp-option-btn {
        padding: 16px 20px;
      }
      .itc-emp-input {
        font-size: 16px;
        padding: 14px 16px 14px 44px;
      }
      .itc-emp-label {
        font-size: 13px;
      }
      .itc-emp-cta-btn {
        font-size: 16px;
        padding: 16px 24px;
      }
    }

    @media (max-width: 640px) {
      .itc-emp-card {
        max-width: 100%;
        margin: 8px;
        border-radius: 18px;
      }
      .itc-emp-header {
        padding: 12px 16px;
      }
      .itc-emp-body {
        padding: 16px 16px 20px;
      }
      .itc-emp-title {
        font-size: 17px;
      }
      .itc-emp-input {
        font-size: 16px; /* Previene zoom iOS */
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
    <div class="itc-emp-card" role="dialog" aria-modal="true">
      <!-- HEADER COMPATTO -->
      <div class="itc-emp-header">
        <div class="itc-emp-brand">
          <div class="itc-emp-brand-icon">
            <i class="ri-vip-crown-fill"></i>
          </div>
          <div>
            <div class="itc-emp-brand-title">ITERCARS ACADEMY</div>
            <div class="itc-emp-brand-sub">Valutazione Candidatura</div>
          </div>
        </div>
        <button type="button" class="itc-emp-close" id="itcEmpCloseBtn" aria-label="Chiudi modulo">
          &times;
        </button>
      </div>

      <!-- PROGRESS TRACK -->
      <div class="itc-emp-progress-bar-wrap" id="itcEmpProgressWrap">
        <div class="itc-emp-progress-meta">
          <span id="itcEmpProgressLabel">Fase 1 di 3</span>
          <span id="itcEmpProgressPercent">33%</span>
        </div>
        <div class="itc-emp-progress-track">
          <div class="itc-emp-progress-fill" id="itcEmpProgressFill" style="width: 33%;"></div>
        </div>
      </div>

      <div class="itc-emp-body">
        <div class="itc-emp-error" id="itcEmpErrorBox"></div>

        <!-- STEP 1: L'AGGANCIO -->
        <div id="itcEmpStep1">
          <div class="itc-emp-badge">
            <i class="ri-shield-star-line"></i> Opportunità Riservata
          </div>
          <h3 class="itc-emp-title">
            Seleziona il tuo obiettivo primario
          </h3>
          <p class="itc-emp-desc">
            Verifica in pochi secondi i requisiti per accedere alla nostra flotta o avviare la tua attività indipendente.
          </p>

          <div class="itc-emp-question-aura">
            <div class="itc-emp-options">
              <button type="button" class="itc-emp-option-btn" data-step1="Masterclass Completa Broker Supercar">
                <div class="itc-emp-opt-text">
                  <span class="itc-emp-opt-title">Masterclass Broker Supercar</span>
                  <span class="itc-emp-opt-desc">Percorso formativo completo per operare come broker indipendente</span>
                </div>
                <div class="itc-emp-opt-circle"><i class="ri-arrow-right-line"></i></div>
              </button>
              <button type="button" class="itc-emp-option-btn" data-step1="Partenariato Ufficiale ITERCARS">
                <div class="itc-emp-opt-text">
                  <span class="itc-emp-opt-title">Partenariato Ufficiale ITERCARS</span>
                  <span class="itc-emp-opt-desc">Collaborazione diretta con la flotta e mandati di vendita/noleggio attivi</span>
                </div>
                <div class="itc-emp-opt-circle"><i class="ri-arrow-right-line"></i></div>
              </button>
              <button type="button" class="itc-emp-option-btn" data-step1="Entrambi (Formazione + Partnership Commerciale)">
                <div class="itc-emp-opt-text">
                  <span class="itc-emp-opt-title">Formazione Completa + Partenariato</span>
                  <span class="itc-emp-opt-desc">Masterclass operativa e partnership commerciale immediata con ITERCARS</span>
                </div>
                <div class="itc-emp-opt-circle"><i class="ri-arrow-right-line"></i></div>
              </button>
            </div>
          </div>
        </div>

        <!-- STEP 2: LA VALIDAZIONE -->
        <div id="itcEmpStep2" style="display: none;">
          <div class="itc-emp-scan-wrap">
            <div class="itc-emp-radar">
              <i class="ri-pulse-line"></i>
            </div>
            <div class="itc-emp-badge">
              <i class="ri-cpu-line"></i> Analisi Idoneità
            </div>
            <h4 style="font-size: 17px; font-weight: 800; color: #ffffff; line-height: 1.35; margin: 0 0 6px 0;">
              Verifica disponibilità posti e tutor in corso...
            </h4>
            <p style="font-size: 13px; color: #94a3b8; margin: 0 0 16px 0;">
              Assegnazione referente didattico per la sessione corrente.
            </p>

            <div style="width: 100%; max-width: 280px; height: 5px; background: rgba(255,255,255,0.08); border-radius: 99px; margin: 0 auto 10px; overflow: hidden;">
              <div id="itcEmpRadarBar" style="width: 0%; height: 100%; background: #2ecc71; border-radius: 99px; transition: width 0.1s linear;"></div>
            </div>
            <div id="itcEmpRadarPercent" style="font-size: 11px; color: #64748b; font-weight: 700;">0%</div>

            <div style="margin-top: 14px;">
              <button type="button" id="itcEmpSkipStep2" style="background: none; border: none; color: #94a3b8; font-size: 12.5px; text-decoration: underline; cursor: pointer;">
                Continua subito
              </button>
            </div>
          </div>
        </div>

        <!-- STEP 3: LA QUALIFICAZIONE -->
        <div id="itcEmpStep3" style="display: none;">
          <div class="itc-emp-badge">
            <i class="ri-user-star-line"></i> Profilazione Requisiti
          </div>
          <h3 class="itc-emp-title">Esperienza e disponibilità</h3>
          <p class="itc-emp-desc">
            Indica la tua situazione attuale per permetterci di calibrare il percorso su misura per te.
          </p>

          <div class="itc-emp-question-aura">
            <div style="margin-bottom: 14px;">
              <label class="itc-emp-label">Esperienza commerciale o automotive:</label>
              <div class="itc-emp-options">
                <button type="button" class="itc-emp-option-btn itc-q1-btn" data-q1="Parto da zero / Appassionato di auto">
                  <span>Parto da zero / Appassionato del mondo supercar</span>
                  <div class="itc-emp-opt-circle"><i class="ri-check-line"></i></div>
                </button>
                <button type="button" class="itc-emp-option-btn itc-q1-btn" data-q1="Ho esperienza commerciale / Vendite">
                  <span>Esperienza commerciale o vendita consulenziale</span>
                  <div class="itc-emp-opt-circle"><i class="ri-check-line"></i></div>
                </button>
                <button type="button" class="itc-emp-option-btn itc-q1-btn" data-q1="Opero già nel settore automotive o noleggi">
                  <span>Già operativo nel settore automotive o noleggi</span>
                  <div class="itc-emp-opt-circle"><i class="ri-check-line"></i></div>
                </button>
              </div>
            </div>

            <div>
              <label class="itc-emp-label">Tempo da dedicare all'attività:</label>
              <div class="itc-emp-options">
                <button type="button" class="itc-emp-option-btn itc-q2-btn" data-q2="Part-time (Qualche ora a settimana)">
                  <span>Part-time (entrate extra nel tempo libero)</span>
                  <div class="itc-emp-opt-circle"><i class="ri-check-line"></i></div>
                </button>
                <button type="button" class="itc-emp-option-btn itc-q2-btn" data-q2="Full-time (Voglio creare la mia agenzia)">
                  <span>Full-time (attività principale o sviluppo agenzia)</span>
                  <div class="itc-emp-opt-circle"><i class="ri-check-line"></i></div>
                </button>
              </div>
            </div>
          </div>

          <div class="itc-emp-nav-row">
            <button type="button" class="itc-emp-btn-back" id="itcEmpBackTo1">
              <i class="ri-arrow-left-line"></i> Indietro
            </button>
            <button type="button" class="itc-emp-cta-btn" id="itcEmpProceedTo4" style="width: auto; padding: 11px 22px; font-size: 13.5px;">
              <span>Continua</span> <i class="ri-arrow-right-line"></i>
            </button>
          </div>
        </div>

        <!-- STEP 4: LA RICOMPENSA E L'ACQUISIZIONE -->
        <div id="itcEmpStep4" style="display: none;">
          <form id="itcEmpLeadForm">
            <div class="itc-emp-badge">
              <i class="ri-checkbox-circle-line"></i> Requisiti Confermati
            </div>
            <h3 class="itc-emp-title">Ottimo! Profilo Compatibile</h3>
            <p class="itc-emp-desc">
              Ricevi gratuitamente il programma didattico, il piano provvigioni e le date disponibili con il nostro referente.
            </p>

            <div class="itc-emp-summary">
              <span id="itcEmpSumPercorso">-</span> • <span id="itcEmpSumExp">-</span> • <span id="itcEmpSumTime">-</span>
            </div>

            <div class="itc-emp-field">
              <label class="itc-emp-label">Nome e Cognome *</label>
              <div class="itc-emp-input-wrap">
                <i class="ri-user-line itc-emp-input-icon"></i>
                <input type="text" class="itc-emp-input" id="itcEmpName" name="name" autocomplete="name" autocapitalize="words" required placeholder="Mario Rossi" />
              </div>
            </div>

            <div class="itc-emp-field">
              <label class="itc-emp-label">Indirizzo Email *</label>
              <div class="itc-emp-input-wrap">
                <i class="ri-mail-line itc-emp-input-icon"></i>
                <input type="email" class="itc-emp-input" id="itcEmpEmail" name="email" autocomplete="email" autocapitalize="none" autocorrect="off" spellcheck="false" required placeholder="mario.rossi@email.it" />
              </div>
            </div>

            <div class="itc-emp-field">
              <label class="itc-emp-label">Cellulare / WhatsApp *</label>
              <div class="itc-emp-input-wrap">
                <i class="ri-phone-line itc-emp-input-icon"></i>
                <input type="tel" class="itc-emp-input" id="itcEmpPhone" name="tel" autocomplete="tel" inputmode="tel" required placeholder="340 123 4567" />
              </div>
            </div>

            <!-- DOPPIE SPUNTE PROFESSIONALI: PRIVACY POLICY & MARKETING -->
            <div class="itc-emp-checkbox-group">
              <!-- Spunta 1: Privacy Policy Obbligatoria -->
              <label class="itc-emp-privacy">
                <input type="checkbox" id="itcEmpPrivacy" required checked />
                <span>
                  <strong>Informativa sul Trattamento dei Dati Personali (GDPR UE 2016/679) *</strong>: 
                  Dichiaro di aver preso visione dell'Informativa Privacy e autorizzo ITERCARS al trattamento dei dati personali conferiti al solo scopo di valutare la mia candidatura e fornirmi il colloquio informativo gratuito e non vincolante.
                </span>
              </label>

              <!-- Spunta 2: Marketing & Opportunità Riservate -->
              <label class="itc-emp-privacy">
                <input type="checkbox" id="itcEmpMarketing" checked />
                <span>
                  <strong>Consenso Comunicazioni e Opportunità Esclusive</strong>: 
                  Acconsento alla ricezione periodica di approfondimenti didattici, anteprime sui mandati flotta e opportunità commerciali riservate da parte di ITERCARS Academy via email o telefono/WhatsApp. Consenso revocabile in ogni momento.
                </span>
              </label>
            </div>

            <button type="submit" class="itc-emp-cta-btn" id="itcEmpSubmitBtn">
              <span>Invia la Mia Candidatura Gratuita</span> <i class="ri-send-plane-fill"></i>
            </button>

            <div style="text-align: center; font-size: 11.5px; color: #64748b; margin-top: 10px;">
              <i class="ri-lock-line"></i> Consulenza orientativa 100% gratuita • Nessun vincolo contrattuale
            </div>
          </form>
        </div>

        <!-- STEP 5: CONFERMA E SUCCESSO -->
        <div id="itcEmpStep5" style="display: none; text-align: center; padding: 22px 10px;">
          <div style="width: 58px; height: 58px; border-radius: 18px; background: rgba(46, 204, 113, 0.15); border: 1px solid #2ecc71; color: #2ecc71; display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 14px; box-shadow: 0 0 25px rgba(46, 204, 113, 0.3);">
            <i class="ri-check-double-line"></i>
          </div>

          <div class="itc-emp-badge">
            <i class="ri-checkbox-circle-fill"></i> Candidatura Ricevuta
          </div>

          <h3 class="itc-emp-title" id="itcEmpSuccessTitle">
            Candidatura registrata con successo!
          </h3>

          <p class="itc-emp-desc" id="itcEmpSuccessDesc" style="max-width: 440px; margin: 0 auto 20px;">
            Un nostro responsabile didattico esaminerà la tua richiesta e ti contatterà al numero indicato entro 24 ore lavorative.
          </p>

          <button type="button" class="itc-emp-cta-btn" id="itcEmpFinishBtn" style="max-width: 220px; margin: 0 auto;">
            <span>Torna alla Pagina</span>
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

  // =========================================================================
  // SISTEMA PARAMETRI URL (Nessun pre-riempimento da cache o dati admin)
  // =========================================================================
  function getStoredContactInfo() {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlName = params.get('nome') || params.get('name') || '';
      const urlEmail = params.get('email') || params.get('mail') || '';
      const urlPhone = params.get('telefono') || params.get('phone') || params.get('tel') || params.get('cellulare') || '';
      const urlCity = params.get('citta') || params.get('city') || '';

      return {
        name: urlName.trim(),
        email: urlEmail.trim(),
        phone: urlPhone.trim(),
        city: urlCity.trim()
      };
    } catch (e) {
      return { name: '', email: '', phone: '', city: '' };
    }
  }

  function saveStoredContactInfo(info) {
    // Nessun salvataggio in cache globali o condivise per evitare conflitti tra utenti
  }

  function autoFillContactFields() {
    const contact = getStoredContactInfo();
    const nameInput = document.getElementById('itcEmpName');
    const emailInput = document.getElementById('itcEmpEmail');
    const phoneInput = document.getElementById('itcEmpPhone');

    // Compila i campi SOLO se passati esplicitamente via parametro URL (es. da inserzioni ADS)
    if (nameInput && !nameInput.value && contact.name) {
      nameInput.value = contact.name;
    }
    if (emailInput && !emailInput.value && contact.email) {
      emailInput.value = contact.email;
    }
    if (phoneInput && !phoneInput.value && contact.phone) {
      phoneInput.value = contact.phone;
    }
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
      autoFillContactFields();
    });
  }

  // Salvataggio automatico durante la digitazione
  ['itcEmpName', 'itcEmpEmail', 'itcEmpPhone'].forEach(function (id) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('blur', function () {
        saveStoredContactInfo({
          name: document.getElementById('itcEmpName')?.value,
          email: document.getElementById('itcEmpEmail')?.value,
          phone: document.getElementById('itcEmpPhone')?.value
        });
      });
      el.addEventListener('change', function () {
        saveStoredContactInfo({
          name: document.getElementById('itcEmpName')?.value,
          email: document.getElementById('itcEmpEmail')?.value,
          phone: document.getElementById('itcEmpPhone')?.value
        });
      });
    }
  });

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
          saveStoredContactInfo({ name, email, phone });

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
    autoFillContactFields();
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

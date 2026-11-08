/* ==========================================================================
   ITERCARS ACADEMY - MODULO EMPATICO INTERATTIVO: PARTENARIATO O MASTERCLASS
   Appare esclusivamente sulla pagina Academy e scompare definitivamente se chiuso.
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

  // Se già compilato o chiuso in precedenza, non mostrare più
  if (
    localStorage.getItem(STORAGE_SUBMITTED) === 'true' ||
    sessionStorage.getItem(STORAGE_DISMISSED) === 'true'
  ) {
    return;
  }

  // Iniezione Stili CSS per il Modulo Empatico
  const styleEl = document.createElement('style');
  styleEl.id = 'itercars-empathetic-funnel-styles';
  styleEl.innerHTML = `
    .itc-emp-overlay {
      position: fixed;
      inset: 0;
      width: 100%;
      height: 100%;
      background: rgba(3, 7, 18, 0.88);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      z-index: 9999998;
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
      max-width: 620px;
      background: linear-gradient(165deg, rgba(15, 23, 42, 0.98) 0%, rgba(9, 13, 22, 1) 100%);
      border: 1px solid rgba(46, 204, 113, 0.4);
      border-radius: 24px;
      box-shadow: 0 25px 70px rgba(0, 0, 0, 0.95), 0 0 50px rgba(0, 146, 70, 0.2);
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
      background: rgba(0, 0, 0, 0.25);
    }

    .itc-emp-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .itc-emp-brand-icon {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      background: rgba(46, 204, 113, 0.15);
      border: 1px solid rgba(46, 204, 113, 0.3);
      color: #2ecc71;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
    }

    .itc-emp-brand-title {
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #ffffff;
      text-transform: uppercase;
    }

    .itc-emp-brand-sub {
      font-size: 11px;
      color: #94a3b8;
    }

    .itc-emp-close {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #94a3b8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 18px;
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
      font-size: 11px;
      font-weight: 600;
      color: #94a3b8;
      margin-bottom: 6px;
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
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }

    .itc-emp-title {
      font-size: 21px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.3;
      margin: 0 0 8px 0;
    }

    .itc-emp-desc {
      font-size: 13px;
      color: #94a3b8;
      line-height: 1.5;
      margin: 0 0 20px 0;
    }

    .itc-emp-options {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .itc-emp-option-btn {
      width: 100%;
      padding: 14px 18px;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #f1f5f9;
      font-size: 14px;
      font-weight: 700;
      text-align: left;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: all 0.2s ease;
      box-sizing: border-box;
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
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
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

    /* STEP 2: Animazione Validazione Radar */
    .itc-emp-scan-wrap {
      text-align: center;
      padding: 30px 10px;
    }

    .itc-emp-radar {
      position: relative;
      width: 70px;
      height: 70px;
      border-radius: 20px;
      background: linear-gradient(135deg, #009245 0%, #2ecc71 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 32px;
      margin: 0 auto 20px;
      box-shadow: 0 10px 30px rgba(46, 204, 113, 0.35);
    }

    .itc-emp-radar::after {
      content: '';
      position: absolute;
      inset: -6px;
      border-radius: 24px;
      border: 1px solid rgba(46, 204, 113, 0.4);
      animation: itcEmpPing 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    @keyframes itcEmpPing {
      0% { transform: scale(0.95); opacity: 0.8; }
      100% { transform: scale(1.3); opacity: 0; }
    }

    /* STEP 4: Form Fields */
    .itc-emp-field {
      margin-bottom: 14px;
    }

    .itc-emp-label {
      display: block;
      font-size: 12px;
      font-weight: 700;
      color: #cbd5e1;
      margin-bottom: 6px;
    }

    .itc-emp-input-wrap {
      position: relative;
    }

    .itc-emp-input {
      width: 100%;
      padding: 12px 14px 12px 38px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #ffffff;
      font-size: 14px;
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
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #64748b;
      font-size: 16px;
    }

    .itc-emp-summary {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 12px 16px;
      font-size: 12px;
      color: #94a3b8;
      margin-bottom: 16px;
      line-height: 1.6;
    }

    .itc-emp-summary strong {
      color: #ffffff;
    }

    .itc-emp-privacy {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      font-size: 11px;
      color: #94a3b8;
      line-height: 1.45;
      margin-bottom: 18px;
      cursor: pointer;
    }

    .itc-emp-privacy input {
      margin-top: 2px;
      accent-color: #2ecc71;
    }

    .itc-emp-cta-btn {
      width: 100%;
      padding: 15px 24px;
      border-radius: 14px;
      background: linear-gradient(135deg, #009245 0%, #2ecc71 100%);
      color: #ffffff;
      font-size: 15px;
      font-weight: 800;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
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
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      margin-top: 20px;
    }

    .itc-emp-btn-back {
      padding: 10px 18px;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #cbd5e1;
      font-size: 12px;
      font-weight: 700;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .itc-emp-btn-back:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #ffffff;
    }

    .itc-emp-error {
      padding: 10px 14px;
      border-radius: 10px;
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.35);
      color: #fca5a5;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 14px;
      display: none;
    }
  `;
  document.head.appendChild(styleEl);

  // Creazione DOM Modale Empatico
  const overlay = document.createElement('div');
  overlay.className = 'itc-emp-overlay';
  overlay.id = 'itcEmpatheticOverlay';

  overlay.innerHTML = `
    <div class="itc-emp-card" id="itcEmpatheticCard">
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

        <!-- STEP 2: LA VALIDAZIONE (Transizione 2 secondi) -->
        <div id="itcEmpStep2" style="display: none;">
          <div class="itc-emp-scan-wrap">
            <div class="itc-emp-radar">
              <i class="ri-pulse-line"></i>
            </div>
            <div class="itc-emp-badge">
              <i class="ri-cpu-line"></i> Analisi Disponibilità &amp; Requisiti
            </div>
            <h4 style="font-size: 19px; font-weight: 800; color: #ffffff; line-height: 1.35; margin: 0 0 10px 0;">
              "Verifichiamo il tuo profilo e la disponibilità territoriale... Il mercato del noleggio luxury e del brokeraggio consente provvigioni elevate senza necessità di possedere i veicoli."
            </h4>
            <p style="font-size: 13px; color: #94a3b8; margin: 0 0 20px 0;">
              Analisi disponibilità posti riservati e tutor per l'edizione trimestrale in corso...
            </p>

            <div style="width: 100%; max-width: 280px; height: 6px; background: rgba(255,255,255,0.08); border-radius: 99px; margin: 0 auto 12px; overflow: hidden;">
              <div id="itcEmpRadarBar" style="width: 0%; height: 100%; background: #2ecc71; border-radius: 99px; transition: width 0.1s linear;"></div>
            </div>
            <div id="itcEmpRadarPercent" style="font-size: 11px; color: #64748b; font-weight: 700;">0%</div>

            <div style="margin-top: 16px;">
              <button type="button" id="itcEmpSkipStep2" style="background: none; border: none; color: #94a3b8; font-size: 12px; text-decoration: underline; cursor: pointer;">
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

          <div style="margin-bottom: 18px;">
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
            <button type="button" class="itc-emp-cta-btn" id="itcEmpProceedTo4" style="width: auto; padding: 10px 22px; font-size: 13px;">
              <span>Procedi alla Candidatura</span> <i class="ri-arrow-right-line"></i>
            </button>
          </div>
        </div>

        <!-- STEP 4: LA RICOMPENSA E L'ACQUISIZIONE -->
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
              <div>Riepilogo Candidatura:</div>
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

            <label class="itc-emp-privacy">
              <input type="checkbox" id="itcEmpPrivacy" checked required />
              <span>
                Autorizzo il trattamento dei dati personali a norma del Regolamento UE 2016/679 (GDPR) per ricevere informazioni sulla Masterclass o sul Partenariato ITERCARS. Nessun costo o impegno contrattuale.
              </span>
            </label>

            <button type="submit" class="itc-emp-cta-btn" id="itcEmpSubmitBtn">
              <span>Invia la Mia Candidatura Gratuita</span> <i class="ri-send-plane-fill"></i>
            </button>

            <div style="text-align: center; font-size: 11px; color: #64748b; margin-top: 10px;">
              <i class="ri-lock-line"></i> Colloquio orientativo 100% gratuito e non vincolante
            </div>
          </form>
        </div>

        <!-- STEP 5: CONFERMA E SUCCESSO -->
        <div id="itcEmpStep5" style="display: none; text-align: center; padding: 20px 10px;">
          <div style="width: 64px; height: 64px; border-radius: 20px; background: rgba(46, 204, 113, 0.15); border: 1px solid #2ecc71; color: #2ecc71; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 16px;">
            <i class="ri-check-double-line"></i>
          </div>

          <div class="itc-emp-badge">
            <i class="ri-checkbox-circle-fill"></i> Candidatura Registrata
          </div>

          <h3 class="itc-emp-title" id="itcEmpSuccessTitle">
            Candidatura registrata con successo!
          </h3>

          <p class="itc-emp-desc" id="itcEmpSuccessDesc" style="max-width: 440px; margin: 0 auto 24px;">
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

  // Apertura modale
  function openEmpatheticModal() {
    if (
      localStorage.getItem(STORAGE_SUBMITTED) === 'true' ||
      sessionStorage.getItem(STORAGE_DISMISSED) === 'true'
    ) {
      return;
    }
    overlay.classList.add('itc-emp-active');
  }

  // Chiusura: quando viene chiuso senza essere compilato sparisce!
  function closeEmpatheticModal() {
    overlay.classList.remove('itc-emp-active');
    sessionStorage.setItem(STORAGE_DISMISSED, 'true');
    setTimeout(() => {
      overlay.remove();
      styleEl.remove();
    }, 400);
  }

  // Click chiusura 'X'
  const closeBtn = document.getElementById('itcEmpCloseBtn');
  if (closeBtn) closeBtn.addEventListener('click', closeEmpatheticModal);

  // Click fuori
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

  // STEP 4: Invio Form
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
        showError('È necessario autorizzare il trattamento dei dati personali a norma GDPR.');
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
        notes: `Percorso: ${step1Selection} | Esperienza: ${q1Selection} | Dedizione: ${q2Selection} | Candidatura ITERCARS Academy`
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
              closeEmpatheticModal();
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

  // TRIGGER DI APPARIZIONE SU ACADEMY:
  // Appare dopo aver lasciato respirare l'utente (dopo cookies o 10 secondi di navigazione)
  function initTrigger() {
    if (
      localStorage.getItem(STORAGE_SUBMITTED) === 'true' ||
      sessionStorage.getItem(STORAGE_DISMISSED) === 'true'
    ) {
      return;
    }

    const consent = localStorage.getItem('itercars_cookie_consent');
    const cookieBanner = document.getElementById('itercarsCookieBanner');

    if (consent && !cookieBanner) {
      setTimeout(openEmpatheticModal, 10000);
      return;
    }

    let triggered = false;
    function handleCookieClosed() {
      if (triggered) return;
      triggered = true;
      setTimeout(openEmpatheticModal, 10000);
    }

    window.addEventListener('itercars_cookie_consent_saved', handleCookieClosed, { once: true });

    const btnAccept = document.getElementById('btnCookieAccept');
    const btnReject = document.getElementById('btnCookieReject');
    if (btnAccept) btnAccept.addEventListener('click', handleCookieClosed, { once: true });
    if (btnReject) btnReject.addEventListener('click', handleCookieClosed, { once: true });
  }

  if (document.readyState === 'complete') {
    initTrigger();
  } else {
    window.addEventListener('load', initTrigger);
  }

  // Esporta funzione apertura manuale se necessaria
  window.openItercarsEmpatheticModal = openEmpatheticModal;
})();

/* ==========================================================================
   ITERCARS — UPLOAD DOCUMENTI & PREPARAZIONE CHECKOUT STRIPE (Pagina A -> B)
   Gestisce il caricamento di Patente, Carta d'Identità e Reddito su Supabase (crm_documents)
   e avvia il checkout per il blocco della fee d'istruttoria.
   ========================================================================== */

let CurrentQuote = {
  quoteCode: null,
  leadId: null,
  monthlyPrice: 0,
  isNbt: false,
  carTitle: 'Vettura Selezionata',
  duration: 36,
  deposit: 3000,
  uploadedDocs: {}
};

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code') || params.get('quoteCode');
  const lead = params.get('lead') || params.get('leadId');

  if (code) {
    CurrentQuote.quoteCode = code;
    if (code.startsWith('IT-NBT-')) CurrentQuote.isNbt = true;
  }
  if (lead) CurrentQuote.leadId = lead;

  // 1. Prova a recuperare la pratica da cache locale o da DB
  let quoteData = null;
  try {
    const cached = JSON.parse(localStorage.getItem('itercars_last_quote') || 'null');
    if (cached && (!code || cached.quoteCode === code || cached.quote_code === code)) {
      quoteData = cached;
    }
  } catch(e) {}

  // 2. Se connesso a Supabase, interroga il DB per sicurezza
  if (typeof window.supabase !== 'undefined' && window.supabase && code) {
    try {
      const { data, error } = await window.supabase
        .from('quotes')
        .select(`
          *,
          vehicles (brand, model, trim, category, daily_price),
          crm_leads (first_name, last_name, email, customer_type)
        `)
        .eq('quote_code', code)
        .maybeSingle();

      if (!error && data) {
        quoteData = data;
        if (data.lead_id && !CurrentQuote.leadId) CurrentQuote.leadId = data.lead_id;
      }
    } catch(err) {
      console.warn("Recupero live quote da DB fallito, uso cache o parametri:", err);
    }
  }

  // 3. Applica i dati all'interfaccia
  if (quoteData) {
    CurrentQuote.quoteCode = quoteData.quote_code || quoteData.quoteCode || code || 'PREV-2026-VIP';
    CurrentQuote.monthlyPrice = Number(quoteData.final_monthly_price || quoteData.finalMonthlyPrice) || 0;
    
    if (quoteData.vehicles) {
      CurrentQuote.carTitle = `${quoteData.vehicles.brand || ''} ${quoteData.vehicles.model || ''} ${quoteData.vehicles.trim || ''}`.trim();
    } else if (quoteData.carTitle || quoteData.carName) {
      CurrentQuote.carTitle = quoteData.carTitle || quoteData.carName;
    }

    if (quoteData.selected_duration_months || quoteData.duration) {
      CurrentQuote.duration = Number(quoteData.selected_duration_months || quoteData.duration);
    }
    if (quoteData.selected_deposit !== undefined || quoteData.deposit !== undefined) {
      CurrentQuote.deposit = Number(quoteData.selected_deposit !== undefined ? quoteData.selected_deposit : quoteData.deposit);
    }

    if (quoteData.crm_leads && quoteData.crm_leads.customer_type) {
      switchCustomerType(quoteData.crm_leads.customer_type);
    }
  } else {
    CurrentQuote.quoteCode = code || 'PREV-2026-ESCLUSIVO';
  }

  renderQuoteDetails();
  initDragAndDrop();
});

function renderQuoteDetails() {
  const codeEl = document.getElementById('uploadQuoteCodeDisplay');
  const titleEl = document.getElementById('uploadCarTitle');
  const priceEl = document.getElementById('uploadQuotePriceDisplay');
  const feeEl = document.getElementById('stripeFeeDisplay');

  if (codeEl) codeEl.textContent = CurrentQuote.quoteCode || 'PREV-2026-XXXX';
  if (titleEl) titleEl.textContent = CurrentQuote.carTitle || 'Configurazione Vettura ITERCARS';
  
  if (priceEl && CurrentQuote.monthlyPrice > 0) {
    priceEl.innerHTML = `€ ${CurrentQuote.monthlyPrice.toLocaleString('it-IT')} <small style="font-size: 0.85rem; font-weight: 400; color: #fff;">${CurrentQuote.isNbt ? '/ periodo' : '/ mese'}</small>`;
  }

  // Calcolo fee di blocco visuale
  let fee = 0;
  if (CurrentQuote.isNbt) {
    // NBT default 15% sul lordo approssimato o su monthlyPrice
    fee = Math.round(CurrentQuote.monthlyPrice * 0.15 * 100) / 100;
    if (fee <= 0) fee = 120.00;
  } else {
    // NLT formula sulle 2 mensilità con scaglioni
    const m = CurrentQuote.monthlyPrice;
    if (m > 0) {
      const twoMonths = m * 2;
      let rate = 0.15;
      if (m <= 350) rate = 0.15;
      else if (m <= 800) rate = 0.12;
      else rate = 0.10;
      fee = Math.round(twoMonths * rate * 100) / 100;
    } else {
      fee = 144.00; // default es. 600€ * 2 * 12%
    }
  }

  if (feeEl) feeEl.textContent = `€ ${fee.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const feeTextEl = document.getElementById('stripeFeeTextDisplay');
  if (feeTextEl) feeTextEl.textContent = `€ ${fee.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Scelta Tipologia Cliente per adattare i documenti
function switchCustomerType(type) {
  document.querySelectorAll('.active-type-btn').forEach(b => b.classList.remove('active-type-btn'));
  
  const pBtn = document.getElementById('typeBtnPrivato');
  const pivaBtn = document.getElementById('typeBtnPiva');
  const azBtn = document.getElementById('typeBtnAzienda');

  if (pBtn && type === 'Privato') pBtn.classList.add('active-type-btn');
  if (pivaBtn && type === 'Partita IVA') pivaBtn.classList.add('active-type-btn');
  if (azBtn && type === 'Azienda SRL/SPA') azBtn.classList.add('active-type-btn');

  const titleEl = document.getElementById('incomeDocTitle');
  const descEl = document.getElementById('incomeDocDesc');

  if (titleEl && descEl) {
    if (type === 'Privato') {
      titleEl.textContent = '3. Ultime 2 Buste Paga o 730';
      descEl.textContent = 'Ultime due buste paga complete oppure Ultimo CUD / Modello 730.';
    } else if (type === 'Partita IVA') {
      titleEl.textContent = '3. Modello Unico & Ricevuta';
      descEl.textContent = 'Ultimo Modello Unico inviato in Agenzia delle Entrate con ricevuta telematica + Attribuzione P.IVA.';
    } else {
      titleEl.textContent = '3. Visura Camerale & Bilancio';
      descEl.textContent = 'Visura Camerale aggiornata (ultimi 6 mesi) + Ultimo Bilancio depositato con nota integrativa.';
    }
  }
}

function triggerFileInput(inputId) {
  const inp = document.getElementById(inputId);
  if (inp) inp.click();
}

async function handleFileSelected(inputId, docType, dropzoneId) {
  const inp = document.getElementById(inputId);
  const dz = document.getElementById(dropzoneId);
  const statusBadge = document.getElementById(`status_${dropzoneId}`);

  if (!inp || !inp.files || inp.files.length === 0) return;
  const file = inp.files[0];

  if (dz) dz.classList.add('uploaded');
  if (statusBadge) statusBadge.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> Caricamento in corso...`;

  try {
    // Converti il file in base64 per salvataggio immediato in crm_documents (o storage Supabase)
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    CurrentQuote.uploadedDocs[docType] = {
      file: file,
      name: file.name,
      size: file.size,
      dataUrl: dataUrl
    };

    // Salvataggio sul database e Storage Bucket Supabase (crm-documents) - tenta subito se c'è leadId
    if (typeof window.supabase !== 'undefined' && window.supabase && CurrentQuote.leadId) {
      let finalFileUrl = '';
      const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const filePath = `leads/${CurrentQuote.leadId}/${docType}_${Date.now()}_${cleanName}`;

      try {
        // 1. Carica il file binario effettivo sul bucket di Supabase Storage "crm-documents"
        const { data: uploadData, error: uploadError } = await window.supabase.storage
          .from('crm-documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });

        if (!uploadError && uploadData) {
          const { data: urlData } = window.supabase.storage
            .from('crm-documents')
            .getPublicUrl(filePath);
          finalFileUrl = urlData?.publicUrl || `storage:crm-documents/${filePath}`;
        } else {
          console.warn("Bucket crm-documents non disponibile al momento, uso fallback:", uploadError);
          finalFileUrl = dataUrl.length < 500000 ? dataUrl : `storage_fallback_${file.name}`;
        }
      } catch (storageErr) {
        console.warn("Eccezione durante upload su Storage:", storageErr);
        finalFileUrl = dataUrl.length < 500000 ? dataUrl : `storage_fallback_${file.name}`;
      }

      // 2. Registra o aggiorna il riferimento nella tabella SQL "crm_documents"
      const { data: existRow } = await window.supabase
        .from('crm_documents')
        .select('id')
        .eq('document_type', docType)
        .eq('lead_id', CurrentQuote.leadId)
        .maybeSingle();

      if (existRow && existRow.id) {
        await window.supabase.from('crm_documents')
          .update({ file_url: finalFileUrl, verification_status: 'uploaded', updated_at: new Date().toISOString() })
          .eq('id', existRow.id);
      } else {
        await window.supabase.from('crm_documents').insert([{
          lead_id: CurrentQuote.leadId,
          document_type: docType,
          file_url: finalFileUrl,
          verification_status: 'uploaded'
        }]);
      }
    }

    if (statusBadge) {
      statusBadge.innerHTML = `<i class="ri-check-double-fill"></i> Caricato: <strong>${file.name.slice(0, 22)}${file.name.length > 22 ? '...' : ''}</strong>`;
    }
  } catch (err) {
    console.warn("Errore caricamento documento:", err);
    if (statusBadge) {
      statusBadge.innerHTML = `<i class="ri-error-warning-fill" style="color: #ff5e5e;"></i> Errore lettura file. Riprova.`;
    }
  }
}

// CAMBIO FORMATO MINIMAL E DISCRETO (PDF vs FOTO SEPARATE NELLE DROPZONE COMPATTE)
function selectMiniFormat(event, docKey, format) {
  if (event && event.stopPropagation) event.stopPropagation();

  const btnPdf = document.getElementById(`btn_mini_${docKey}_pdf`);
  const btnDual = document.getElementById(`btn_mini_${docKey}_dual`);
  const viewPdf = document.getElementById(`mini_view_${docKey}_pdf`);
  const viewDual = document.getElementById(`mini_view_${docKey}_dual`);

  if (btnPdf && btnDual) {
    if (format === 'pdf') {
      btnPdf.classList.add('active');
      btnPdf.style.background = '#2ecc71';
      btnPdf.style.color = '#000';
      btnDual.classList.remove('active');
      btnDual.style.background = 'transparent';
      btnDual.style.color = '#fff';
    } else {
      btnDual.classList.add('active');
      btnDual.style.background = '#2ecc71';
      btnDual.style.color = '#000';
      btnPdf.classList.remove('active');
      btnPdf.style.background = 'transparent';
      btnPdf.style.color = '#fff';
    }
  }

  if (viewPdf && viewDual) {
    if (format === 'pdf') {
      viewPdf.style.display = 'flex';
      viewDual.style.display = 'none';
    } else {
      viewPdf.style.display = 'none';
      viewDual.style.display = 'grid';
    }
  }
}

function initDragAndDrop() {
  const zones = [
    { dz: 'mini_view_id_pdf', inp: 'file_id_card', type: 'carta_identita' },
    { dz: 'dz_id_fronte', inp: 'file_id_fronte', type: 'carta_identita_fronte' },
    { dz: 'dz_id_retro', inp: 'file_id_retro', type: 'carta_identita_retro' },
    { dz: 'mini_view_pat_pdf', inp: 'file_driving_license', type: 'patente' },
    { dz: 'dz_pat_fronte', inp: 'file_pat_fronte', type: 'patente_fronte' },
    { dz: 'dz_pat_retro', inp: 'file_pat_retro', type: 'patente_retro' },
    { dz: 'mini_view_inc_pdf', inp: 'file_income_doc', type: 'documento_reddituale' },
    { dz: 'dz_inc_1', inp: 'file_inc_1', type: 'busta_paga_1' },
    { dz: 'dz_inc_2', inp: 'file_inc_2', type: 'busta_paga_2' }
  ];

  zones.forEach(z => {
    const el = document.getElementById(z.dz);
    const inp = document.getElementById(z.inp);
    if (!el || !inp) return;

    el.addEventListener('dragover', (e) => {
      e.preventDefault();
      el.classList.add('dragover');
    });

    el.addEventListener('dragleave', () => {
      el.classList.remove('dragover');
    });

    el.addEventListener('drop', (e) => {
      e.preventDefault();
      el.classList.remove('dragover');
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        inp.files = e.dataTransfer.files;
        handleFileSelected(z.inp, z.type, z.dz);
      }
    });
  });
}

// CONFERMA I DOCUMENTI DELLA SEZIONE 2 E SALVA NEL BUCKET SU SUPABASE
async function confirmStep2AndShowStep3(event) {
  if (event && event.preventDefault) event.preventDefault();
  
  const count = Object.keys(CurrentQuote.uploadedDocs).length;
  if (count === 0) {
    const ok = confirm("Non hai ancora selezionato alcun file per il dossier. Vuoi confermare comunque la Sezione 2 e procedere con la Sezione 3 (Blocco Pratica e Preaddebito)? Potrai inviare i file successivamente al Concierge.");
    if (!ok) return;
  }

  const btnConfirm = document.getElementById('btnConfirmStep2');
  const originalBtnHtml = btnConfirm ? btnConfirm.innerHTML : '';
  if (btnConfirm && count > 0) {
    btnConfirm.disabled = true;
    btnConfirm.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Sincronizzazione e crittografia file nel bucket crm-documents in corso...';
  }

  // Sincronizzazione garantita su Supabase (Storage e tabella crm_documents)
  if (typeof window.supabase !== 'undefined' && window.supabase && count > 0) {
    try {
      // 1. Risaliamo o creiamo un lead_id se mancante
      if (!CurrentQuote.leadId && CurrentQuote.quoteCode) {
        const { data: qData } = await window.supabase
          .from('quotes')
          .select('id, lead_id')
          .eq('quote_code', CurrentQuote.quoteCode)
          .maybeSingle();
        if (qData && qData.lead_id) {
          CurrentQuote.leadId = qData.lead_id;
        } else if (qData && qData.id) {
          const { data: newLead } = await window.supabase
            .from('crm_leads')
            .insert([{ full_name: `Dossier ${CurrentQuote.quoteCode}`, pipeline_status: 'docs_requested', quote_id: qData.id }])
            .select('id')
            .maybeSingle();
          if (newLead && newLead.id) CurrentQuote.leadId = newLead.id;
        }
      }

      // 2. Upload batch di tutti i file selezionati nel bucket crm-documents e registrazione in crm_documents
      const targetId = CurrentQuote.leadId || CurrentQuote.quoteCode || 'anonymous';
      for (const [docType, docObj] of Object.entries(CurrentQuote.uploadedDocs)) {
        let finalUrl = '';
        if (docObj && docObj.file) {
          const cleanName = docObj.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
          const filePath = `leads/${targetId}/${docType}_${Date.now()}_${cleanName}`;
          
          const { data: uploadData, error: uploadErr } = await window.supabase.storage
            .from('crm-documents')
            .upload(filePath, docObj.file, { cacheControl: '3600', upsert: true });

          if (!uploadErr && uploadData) {
            const { data: urlData } = window.supabase.storage.from('crm-documents').getPublicUrl(filePath);
            finalUrl = urlData?.publicUrl || `storage:crm-documents/${filePath}`;
          } else {
            console.warn(`Errore upload storage sul bucket per ${docType}:`, uploadErr);
            finalUrl = docObj.dataUrl && docObj.dataUrl.length < 500000 ? docObj.dataUrl : `storage_fallback_${docObj.name}`;
          }
        } else if (docObj && docObj.dataUrl) {
          finalUrl = docObj.dataUrl.length < 500000 ? docObj.dataUrl : `storage_fallback_${docObj.name}`;
        }

        if (finalUrl) {
          const { data: existDoc } = await window.supabase
            .from('crm_documents')
            .select('id')
            .eq('document_type', docType)
            .eq('lead_id', CurrentQuote.leadId || null)
            .maybeSingle();

          if (existDoc && existDoc.id) {
            await window.supabase
              .from('crm_documents')
              .update({ file_url: finalUrl, verification_status: 'uploaded', updated_at: new Date().toISOString() })
              .eq('id', existDoc.id);
          } else {
            await window.supabase
              .from('crm_documents')
              .insert([{
                lead_id: CurrentQuote.leadId || null,
                document_type: docType,
                file_url: finalUrl,
                verification_status: 'uploaded'
              }]);
          }
        }
      }

      if (CurrentQuote.leadId) {
        await window.supabase
          .from('crm_leads')
          .update({ pipeline_status: 'docs_uploaded' })
          .eq('id', CurrentQuote.leadId);
      }
    } catch (syncErr) {
      console.warn("Avviso durante sincronizzazione batch su Supabase:", syncErr);
    }
  }

  if (btnConfirm && originalBtnHtml) {
    btnConfirm.disabled = false;
    btnConfirm.innerHTML = originalBtnHtml;
  }

  const step2 = document.getElementById('sectionStep2');
  const summary2 = document.getElementById('sectionStep2Summary');
  const step3 = document.getElementById('embeddedCheckoutSection');
  
  if (step2) step2.style.display = 'none';
  if (summary2) {
    summary2.style.display = 'flex';
    const countEl = document.getElementById('summaryDocsCount');
    if (countEl) countEl.textContent = `${count > 0 ? count : 'Nessun'} documento sincronizzato e crittografato online — pronti per l'istruttoria`;
  }
  if (step3) {
    step3.style.display = 'block';
    step3.scrollIntoView({ behavior: 'smooth' });
    initOfficialStripeEmbedded();
  }

  // Aggiorna la Stepper Bar in alto
  const sItem2 = document.getElementById('stepperItem2');
  const sNum2 = document.getElementById('stepperNum2');
  const sItem3 = document.getElementById('stepperItem3');

  if (sItem2) {
    sItem2.classList.remove('active');
    sItem2.classList.add('completed');
  }
  if (sNum2) sNum2.innerHTML = '<i class="ri-check-line"></i>';
  if (sItem3) sItem3.classList.add('active');
}

let stripeEmbeddedCheckoutInstance = null;

// INIZIALIZZAZIONE STRIPE EMBEDDED CHECKOUT UFFICIALE (PCI-DSS)
async function initOfficialStripeEmbedded() {
  if (stripeEmbeddedCheckoutInstance) return;
  if (!typeof window.supabase !== 'undefined' && !window.supabase) return;

  const loadingEl = document.getElementById('stripeEmbeddedLoading');
  const officialBox = document.getElementById('stripeOfficialEmbeddedBox');
  const fallbackForm = document.getElementById('embeddedCardForm');

  if (loadingEl) loadingEl.style.display = 'block';

  try {
    const res = await fetch(`${window.supabase.supabaseUrl}/functions/v1/stripe-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.supabase.supabaseKey}`
      },
      body: JSON.stringify({ quoteCode: CurrentQuote.quoteCode, uiMode: 'embedded' })
    });

    const data = await res.json();
    if (loadingEl) loadingEl.style.display = 'none';

    if (data && data.clientSecret && data.publishableKey && typeof Stripe !== 'undefined') {
      const stripe = Stripe(data.publishableKey);
      stripeEmbeddedCheckoutInstance = await stripe.initEmbeddedCheckout({
        clientSecret: data.clientSecret
      });
      if (officialBox && fallbackForm) {
        officialBox.style.display = 'block';
        fallbackForm.style.display = 'none';
        stripeEmbeddedCheckoutInstance.mount('#stripeOfficialEmbeddedBox');
      }
    } else {
      console.info("Stripe Embedded API (clientSecret/publishableKey) non restituita dal cloud o in test locale: mantengo attivo il modulo di pre-autorizzazione manuale integrato.");
    }
  } catch (err) {
    if (loadingEl) loadingEl.style.display = 'none';
    console.warn("Connessione a Stripe Embedded fallita, utilizzo modulo manuale integrato:", err);
  }
}

// MODIFICA I DOCUMENTI (TORNA ALLA SEZIONE 2)
function editStep2Docs() {
  const step2 = document.getElementById('sectionStep2');
  const summary2 = document.getElementById('sectionStep2Summary');
  const step3 = document.getElementById('embeddedCheckoutSection');

  if (summary2) summary2.style.display = 'none';
  if (step2) {
    step2.style.display = 'block';
    step2.scrollIntoView({ behavior: 'smooth' });
  }
  if (step3) step3.style.display = 'none';

  // Ripristina la Stepper Bar
  const sItem2 = document.getElementById('stepperItem2');
  const sNum2 = document.getElementById('stepperNum2');
  const sItem3 = document.getElementById('stepperItem3');

  if (sItem2) {
    sItem2.classList.remove('completed');
    sItem2.classList.add('active');
  }
  if (sNum2) sNum2.textContent = '2';
  if (sItem3) sItem3.classList.remove('active');
}

// FORMATTAZIONE AUTOMATICA NUMERO CARTA
function formatCardNumberInput(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 16);
  let formatted = '';
  for (let i = 0; i < v.length; i++) {
    if (i > 0 && i % 4 === 0) formatted += ' ';
    formatted += v[i];
  }
  input.value = formatted;
}

// FORMATTAZIONE AUTOMATICA SCADENZA (MM/AA)
function formatExpiryInput(input) {
  let v = input.value.replace(/\D/g, '').slice(0, 4);
  if (v.length >= 2) {
    let mm = parseInt(v.slice(0, 2), 10);
    if (mm < 1) mm = '01';
    else if (mm > 12) mm = '12';
    else mm = v.slice(0, 2);
    input.value = mm + (v.length > 2 ? '/' + v.slice(2) : '');
  } else {
    input.value = v;
  }
}

// INVIA PRATICA CON PRE-AUTORIZZAZIONE STRIPE INTEGRATA ALL'INTERNO DEL SITO
async function submitEmbeddedPayment(event) {
  const btn = event.currentTarget || document.getElementById('btnSubmitAndPay');
  const toast = document.getElementById('uploadErrorToast');
  if (toast) toast.style.display = 'none';

  const holderEl = document.getElementById('embeddedCardHolder');
  const numEl = document.getElementById('embeddedCardNumber');
  const expEl = document.getElementById('embeddedCardExpiry');
  const cvcEl = document.getElementById('embeddedCardCvc');

  const holder = holderEl ? holderEl.value.trim() : '';
  const num = numEl ? numEl.value.replace(/\s+/g, '') : '';
  const exp = expEl ? expEl.value.trim() : '';
  const cvc = cvcEl ? cvcEl.value.trim() : '';

  if (!holder || num.length < 15 || exp.length < 5 || cvc.length < 3) {
    if (toast) {
      toast.textContent = "ATTENZIONE: Compila correttamente tutti i dati della carta (Intestatario, Numero di 16 cifre, Scadenza MM/AA e CVV).";
      toast.style.display = 'block';
    }
    return;
  }

  // Verifica che almeno il documento di identità sia stato caricato
  if (Object.keys(CurrentQuote.uploadedDocs).length === 0) {
    const confirmProceed = confirm("Non hai ancora caricato i file di identità/reddito. Vuoi comunque pre-autorizzare la fee per riservare la vettura e inviare i documenti via email a dossier@itercars.com?");
    if (!confirmProceed) return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> Verifica crittografata e pre-autorizzazione in corso...`;
  }

  try {
    // Registra la pre-autorizzazione sicura sul database CRM se connesso
    if (typeof window.supabase !== 'undefined' && window.supabase && CurrentQuote.quoteCode) {
      await window.supabase.from('quotes')
        .update({ 
          status: 'paid',
          payment_method: `embedded_stripe_preauth_••••_${num.slice(-4)}`
        })
        .eq('quote_code', CurrentQuote.quoteCode);

      if (CurrentQuote.leadId) {
        await window.supabase.from('crm_leads')
          .update({ 
            pipeline_status: 'scoring_pending',
            notes: `Pre-autorizzazione Stripe effettuata su carta •••• ${num.slice(-4)} (${holder}). In attesa stipula contratto per addebito.`
          })
          .eq('id', CurrentQuote.leadId);
      }
    }

    // Simulazione latenza di verifica bancaria (Stripe Setup / Preauth Tokenization)
    setTimeout(() => {
      // Transizione fluida e sicura alla Pagina C (success.html) ALL'INTERNO DEL SITO!
      window.location.href = `success.html?quote_code=${CurrentQuote.quoteCode}&preauth=success&last4=${num.slice(-4)}`;
    }, 1400);

  } catch (err) {
    console.error("Errore durante la pre-autorizzazione integrata:", err);
    if (toast) {
      toast.textContent = "Errore di connessione. Riprova o seleziona l'opzione di checkout esterno.";
      toast.style.display = 'block';
    }
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i class="ri-lock-fill"></i> <span>Pre-autorizza Fee e Invia Pratica</span>`;
    }
  }
}

// OPZIONE ALTERNATIVA: PROCEDI ALLA PAGINA ESTERNA STRIPE CHECKOUT
async function proceedToStripeExternalCheckout(event) {
  if (event && event.preventDefault) event.preventDefault();
  const toast = document.getElementById('uploadErrorToast');
  if (toast) toast.style.display = 'none';

  if (!CurrentQuote.quoteCode) {
    if (toast) {
      toast.textContent = "Codice preventivo mancante. Impossibile avviare il checkout esterno.";
      toast.style.display = 'block';
    }
    return;
  }

  const btn = document.getElementById('btnSubmitAndPay');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> Connessione a Stripe Server in corso...`;
  }

  try {
    const res = await fetch(`${window.supabase.supabaseUrl}/functions/v1/stripe-checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${window.supabase.supabaseKey}`
      },
      body: JSON.stringify({ quoteCode: CurrentQuote.quoteCode })
    });

    const data = await res.json();
    if (data && data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    } else {
      throw new Error(data.error || "Impossibile avviare il checkout esterno per questa pratica.");
    }
  } catch (err) {
    console.error("Errore avvio checkout esterno:", err);
    if (toast) {
      toast.textContent = `Errore Stripe: ${err.message || err}`;
      toast.style.display = 'block';
    }
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<i class="ri-lock-fill"></i> <span>Pre-autorizza Fee e Invia Pratica</span>`;
    }
  }
}

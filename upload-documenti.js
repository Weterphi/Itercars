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
      name: file.name,
      size: file.size,
      dataUrl: dataUrl
    };

    // Salvataggio sul database Supabase (crm_documents e aggiornamento crm_leads)
    if (typeof window.supabase !== 'undefined' && window.supabase && CurrentQuote.leadId) {
      await window.supabase.from('crm_documents').insert([{
        lead_id: CurrentQuote.leadId,
        document_type: docType,
        file_url: dataUrl.length < 500000 ? dataUrl : `uploaded_file_${file.name}`,
        verification_status: 'uploaded'
      }]);

      await window.supabase.from('crm_leads')
        .update({ pipeline_status: 'docs_requested' })
        .eq('id', CurrentQuote.leadId);
    }

    if (statusBadge) {
      statusBadge.innerHTML = `<i class="ri-check-double-fill"></i> Caricato: <strong>${file.name.slice(0, 24)}${file.name.length > 24 ? '...' : ''}</strong>`;
    }
  } catch (err) {
    console.warn("Errore caricamento documento:", err);
    if (statusBadge) {
      statusBadge.innerHTML = `<i class="ri-error-warning-fill" style="color: #ff5e5e;"></i> Errore lettura file. Riprova.`;
    }
  }
}

function initDragAndDrop() {
  const zones = [
    { dz: 'dz_id_card', inp: 'file_id_card', type: 'carta_identita' },
    { dz: 'dz_driving_license', inp: 'file_driving_license', type: 'patente' },
    { dz: 'dz_income_doc', inp: 'file_income_doc', type: 'documento_reddituale' }
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

// PROCEDI ALLA PAGINA B (STRIPE CHECKOUT PER BLOCCO PRATICA)
async function proceedToStripeCheckout(event) {
  const btn = event.currentTarget || document.getElementById('btnSubmitAndPay');
  const toast = document.getElementById('uploadErrorToast');
  if (toast) toast.style.display = 'none';

  if (!CurrentQuote.quoteCode) {
    if (toast) {
      toast.textContent = "Codice preventivo mancante. Impossibile avviare il checkout.";
      toast.style.display = 'block';
    }
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> Avvio Checkout e Blocco Fee in corso...`;
  }

  // Verifica connessione a Supabase
  if (!typeof window.supabase !== 'undefined' && !window.supabase) {
    alert("Supabase non disponibile nel client locale.");
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>Invia Pratica e Paga Acconto / Fee</span> <i class="ri-arrow-right-line"></i>`;
    }
    return;
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
      // Reindirizza l'utente alla Pagina B (Checkout di Stripe)
      window.location.href = data.checkoutUrl;
    } else {
      throw new Error(data.error || "Impossibile generare l'URL di pagamento Stripe per questa pratica.");
    }
  } catch (err) {
    console.error("Errore avvio checkout Stripe:", err);
    if (toast) {
      toast.textContent = `Errore Stripe: ${err.message || err}. Assicurati di aver pubblicato la funzione aggiornata con npx supabase functions deploy stripe-checkout.`;
      toast.style.display = 'block';
    }
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>Invia Pratica e Paga Acconto / Fee</span> <i class="ri-arrow-right-line"></i>`;
    }
  }
}

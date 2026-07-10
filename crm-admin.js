/* ==========================================================================
   ITERCARS — CRM & BROKERAGE ADMIN CONSOLE LOGIC
   Gestione completa Kanban Leads, Prenotazioni NBT, Delibere Credito e Comparatore
   ========================================================================== */

// Configurazione Supabase (Identica al sito web)
const SUPABASE_URL = 'https://brqayhwdrvgllwwjnyvz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJycWF5aHdkcnZnbGx3d2pueXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NDczMTgsImV4cCI6MjA5ODMyMzMxOH0.NZsHj4B_5ylWCcCXy5NKrkLWXNy-6GV4yg5Cv1keaWk';
var supabase = (typeof window.supabase !== 'undefined' && window.supabase.createClient) 
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

// Dati campione di fallback se il DB non ha ancora lead inseriti (per demo immediata)
const SAMPLE_LEADS = [
  {
    id: 'lead-1',
    first_name: 'Alberto',
    last_name: 'Moretti',
    phone: '+39 334 892 1102',
    email: 'alberto.m@studiolegale.it',
    customer_type: 'Partita IVA',
    pipeline_status: 'new_lead',
    car_name: 'Porsche Macan 4 Electric',
    monthly_price: 764,
    provider_code: 'Arval Italia S.p.A.',
    notes: 'Cliente interessato alla pronta consegna. Valuta permuta di una vecchia SUV benzina.'
  },
  {
    id: 'lead-2',
    first_name: 'Dr. Marco',
    last_name: 'De Santis',
    phone: '+39 340 128 4491',
    email: 'marco.desantis@biotech.eu',
    customer_type: 'Azienda SRL',
    pipeline_status: 'quote_sent',
    car_name: 'Audi RS6 Performance 630 CV',
    monthly_price: 1420,
    provider_code: 'Ayvens Network',
    notes: 'Inviato preventivo 36m/15k. Richiesta franchigia zero e vettura sostitutiva.'
  },
  {
    id: 'lead-3',
    first_name: 'Elena',
    last_name: 'Visconti',
    phone: '+39 349 551 0982',
    email: 'elena.v@designstudio.com',
    customer_type: 'Privato',
    pipeline_status: 'docs_requested',
    car_name: 'BMW M4 Competition xDrive',
    monthly_price: 949,
    provider_code: 'Arval Italia S.p.A.',
    notes: 'Istruttoria in corso. Caricata patente e ultime 2 buste paga. In attesa di CUD.'
  },
  {
    id: 'lead-4',
    first_name: 'Giuseppe',
    last_name: 'Rinaldi',
    phone: '+39 328 776 3310',
    email: 'g.rinaldi@holdingitalia.it',
    customer_type: 'Azienda SPA',
    pipeline_status: 'approved_by_provider',
    car_name: 'Ferrari Purosangue V12',
    monthly_price: 4000,
    provider_code: 'ITERCARS Flotta Diretta VIP',
    notes: 'Delibera finanziaria confermata! Vettura bloccata in arrivo tra 1 settimana.'
  },
  {
    id: 'lead-5',
    first_name: 'Lorenzo',
    last_name: 'Fabbri',
    phone: '+39 331 900 2218',
    email: 'l.fabbri@architettura.org',
    customer_type: 'Partita IVA',
    pipeline_status: 'contract_signed',
    car_name: 'Mercedes-Benz Classe G 63 AMG',
    monthly_price: 1840,
    provider_code: 'Leasys Executive',
    notes: 'Contratto firmato e anticipo di 5.000€ incassato. Consegna schedulata a Milano.'
  }
];

const SAMPLE_BOOKINGS_DATA = [
  {
    id: 'bk-101',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    vehicle_name: 'Lamborghini Revuelto V12 Hybrid',
    client_name: 'Matteo Gamberini',
    client_phone: '+39 375 594 2143',
    client_email: 'm.gamberini@luxuryrent.com',
    pickup_location: 'Milano Centrale / Aeroporto Linate',
    rental_days: 3,
    status: 'pending'
  },
  {
    id: 'bk-102',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    vehicle_name: 'Ferrari F8 Tributo Spider',
    client_name: 'Alexander Schmidt',
    client_phone: '+41 79 123 4567',
    client_email: 'schmidt@investments.ch',
    pickup_location: 'Monte Carlo Casino (Monaco)',
    rental_days: 5,
    status: 'approved'
  }
];

let CurrentLeads = [];
let CurrentBookings = [];
let ActiveModalLead = null;

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
  loadAllCrmData();
  runComparison(); // Inizializza il comparatore
});

// Switch tra i Tab della Console
function switchTab(tabId, btnElem) {
  document.querySelectorAll('.tab-pane').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  
  const target = document.getElementById(tabId);
  if (target) target.classList.add('active');
  if (btnElem) btnElem.classList.add('active');
}

// Caricamento Dati Completo da Supabase (o Fallback)
async function loadAllCrmData() {
  await Promise.all([
    fetchLeadsFromDatabase(),
    fetchBookingsFromDatabase()
  ]);
  
  renderKanbanBoard();
  renderBookingsTable(CurrentBookings);
  renderDocsOverview();
  updateKpiSummary();
}

async function fetchLeadsFromDatabase() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('crm_leads')
        .select(`
          id, first_name, last_name, phone, email, customer_type, pipeline_status, notes, created_at,
          vehicles (brand, model, trim),
          nlt_offers (client_monthly_price, providers(name))
        `)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        CurrentLeads = data.map(l => {
          const v = l.vehicles || {};
          const o = l.nlt_offers || {};
          const pName = (o.providers && o.providers.name) ? o.providers.name : 'Mandante NLT';
          const carTitle = v.brand ? `${v.brand} ${v.model}` : (l.notes ? l.notes.split('-')[0].replace('Preventivo configurato per ', '').trim() : 'Vettura NLT');
          
          return {
            id: l.id,
            first_name: l.first_name,
            last_name: l.last_name,
            phone: l.phone,
            email: l.email,
            customer_type: l.customer_type || 'Privato',
            pipeline_status: l.pipeline_status || 'new_lead',
            car_name: carTitle,
            monthly_price: o.client_monthly_price || 799,
            provider_code: pName,
            notes: l.notes || ''
          };
        });
        return;
      }
    } catch(e) {
      console.warn("Errore fetch DB crm_leads:", e);
    }
  }
  // Fallback demo
  CurrentLeads = [...SAMPLE_LEADS];
}

async function fetchBookingsFromDatabase() {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        CurrentBookings = data;
        return;
      }
    } catch(e) {
      console.warn("Errore fetch DB bookings:", e);
    }
  }
  CurrentBookings = [...SAMPLE_BOOKINGS_DATA];
}

// Render della Board Kanban per Colonne
function renderKanbanBoard() {
  const cols = {
    new_lead: document.getElementById('cardsColNew'),
    quote_sent: document.getElementById('cardsColQuote'),
    docs_requested: document.getElementById('cardsColDocs'),
    approved_by_provider: document.getElementById('cardsColApproved'),
    contract_signed: document.getElementById('cardsColSigned')
  };

  // Pulisci
  Object.values(cols).forEach(c => { if (c) c.innerHTML = ''; });

  const counts = { new_lead: 0, quote_sent: 0, docs_requested: 0, approved_by_provider: 0, contract_signed: 0 };

  CurrentLeads.forEach(lead => {
    let st = lead.pipeline_status || 'new_lead';
    if (!cols[st]) st = 'new_lead';
    counts[st]++;

    let tagClass = 'tag-privato';
    if (lead.customer_type && lead.customer_type.toLowerCase().includes('iva')) tagClass = 'tag-piva';
    if (lead.customer_type && lead.customer_type.toLowerCase().includes('aziend')) tagClass = 'tag-azienda';

    // Prossimo step
    let nextSt = '';
    let nextLabel = '';
    if (st === 'new_lead') { nextSt = 'quote_sent'; nextLabel = 'Invia Prev. ➔'; }
    else if (st === 'quote_sent') { nextSt = 'docs_requested'; nextLabel = 'Istruttoria ➔'; }
    else if (st === 'docs_requested') { nextSt = 'approved_by_provider'; nextLabel = 'Delibera OK ➔'; }
    else if (st === 'approved_by_provider') { nextSt = 'contract_signed'; nextLabel = 'Firma Contratto ➔'; }

    const cardHtml = `
      <div class="lead-card" onclick="openDossierModal('${lead.id}')">
        <div class="lead-card-header">
          <div class="lead-client-name">${lead.first_name} ${lead.last_name}</div>
          <span class="lead-type-tag ${tagClass}">${lead.customer_type}</span>
        </div>
        
        <div class="lead-car-info">
          <div class="lead-car-title"><i class="ri-steering-2-line"></i> ${lead.car_name}</div>
          <div class="lead-car-price">€ ${Number(lead.monthly_price).toLocaleString('it-IT')} <small style="font-size: 0.75rem; font-weight: 400; color: var(--text-muted);">/mese</small></div>
          <div class="lead-provider"><i class="ri-shield-check-line"></i> Mandante: <strong>${lead.provider_code}</strong></div>
        </div>

        <div class="lead-actions" onclick="event.stopPropagation()">
          <a href="https://api.whatsapp.com/send?phone=${lead.phone.replace(/[^0-9]/g, '')}&text=Buongiorno ${lead.first_name}, la contatto dal Desk ITERCARS per la sua richiesta su ${lead.car_name}." target="_blank" class="btn-card-action">
            <i class="ri-whatsapp-line" style="color: #2ecc71;"></i> WhatsApp
          </a>
          ${nextSt ? `
            <button class="btn-card-action btn-advance" onclick="quickAdvanceLead('${lead.id}', '${nextSt}')">
              ${nextLabel}
            </button>
          ` : '<span style="font-size: 0.78rem; color: #2ecc71; font-weight: 800;"><i class="ri-check-double-line"></i> CHIUSO</span>'}
        </div>
      </div>
    `;

    if (cols[st]) cols[st].innerHTML += cardHtml;
  });

  // Aggiorna contatori badge
  document.getElementById('countColNew').textContent = counts.new_lead;
  document.getElementById('countColQuote').textContent = counts.quote_sent;
  document.getElementById('countColDocs').textContent = counts.docs_requested;
  document.getElementById('countColApproved').textContent = counts.approved_by_provider;
  document.getElementById('countColSigned').textContent = counts.contract_signed;
  document.getElementById('badgeLeadsCount').textContent = CurrentLeads.length;
}

// Avanzamento rapido di status da Kanban
async function quickAdvanceLead(leadId, nextStatus) {
  const lead = CurrentLeads.find(l => l.id === leadId);
  if (!lead) return;

  lead.pipeline_status = nextStatus;
  
  if (supabase && leadId && !leadId.startsWith('lead-')) {
    try {
      await supabase.from('crm_leads').update({ pipeline_status: nextStatus }).eq('id', leadId);
    } catch(e) {}
  }
  
  renderKanbanBoard();
  updateKpiSummary();
}

// Render Tabella Prenotazioni NBT
function renderBookingsTable(bookings) {
  const tbody = document.getElementById('bookingsTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  bookings.forEach(b => {
    let pillClass = 'pill-new';
    if (b.status === 'approved' || b.status === 'confermato') pillClass = 'pill-approved';
    if (b.status === 'pending') pillClass = 'pill-pending';
    
    const dateStr = b.created_at ? new Date(b.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Oggi';

    tbody.innerHTML += `
      <tr>
        <td style="color: var(--text-muted); font-size: 0.85rem;">${dateStr}</td>
        <td><strong style="color: #fff;">${b.vehicle_name}</strong></td>
        <td><strong>${b.client_name || 'Cliente VIP'}</strong></td>
        <td>
          <div style="font-size: 0.9rem;">${b.client_phone}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${b.client_email || ''}</div>
        </td>
        <td>
          <div><i class="ri-map-pin-line text-green"></i> ${b.pickup_location || 'Milano / Consegna Domicilio'}</div>
          <small style="color: var(--text-muted);">Durata: ${b.rental_days || 1} giorni</small>
        </td>
        <td>
          <span class="status-pill ${pillClass}">
            <i class="ri-checkbox-circle-fill"></i> ${b.status ? b.status.toUpperCase() : 'PENDING'}
          </span>
        </td>
        <td>
          <a href="https://api.whatsapp.com/send?phone=${(b.client_phone||'').replace(/[^0-9]/g, '')}&text=Salve ${b.client_name}, le scriviamo dal Concierge ITERCARS per confermare la disponibilità di ${b.vehicle_name}." target="_blank" class="btn-header btn-header-outline" style="padding: 6px 12px; font-size: 0.8rem; display: inline-flex;">
            <i class="ri-whatsapp-line" style="color: #2ecc71;"></i> Conferma Tel.
          </a>
        </td>
      </tr>
    `;
  });

  document.getElementById('badgeBookingsCount').textContent = bookings.length;
}

function filterBookingsTable(query) {
  const q = query.toLowerCase();
  const filtered = CurrentBookings.filter(b => 
    (b.client_name && b.client_name.toLowerCase().includes(q)) ||
    (b.vehicle_name && b.vehicle_name.toLowerCase().includes(q)) ||
    (b.client_phone && b.client_phone.includes(q))
  );
  renderBookingsTable(filtered);
}

// KPI Bar calculation
function updateKpiSummary() {
  const newCount = CurrentLeads.filter(l => l.pipeline_status === 'new_lead' || l.pipeline_status === 'quote_sent').length;
  const docsCount = CurrentLeads.filter(l => l.pipeline_status === 'docs_requested').length;
  const wonCount = CurrentLeads.filter(l => l.pipeline_status === 'contract_signed').length;
  
  const totalVal = CurrentLeads
    .filter(l => l.pipeline_status !== 'lost')
    .reduce((sum, l) => sum + (Number(l.monthly_price) || 0), 0);

  const k1 = document.getElementById('kpiNewLeads');
  const k2 = document.getElementById('kpiPipelineValue');
  const k3 = document.getElementById('kpiDocsPending');
  const k4 = document.getElementById('kpiContractsWon');

  if (k1) k1.innerHTML = `${newCount} <small>attivi</small>`;
  if (k2) k2.innerHTML = `€ ${totalVal.toLocaleString('it-IT')} <small>/ mese</small>`;
  if (k3) k3.innerHTML = `${docsCount} <small>in verifica</small>`;
  if (k4) k4.innerHTML = `${wonCount} <small>firmati</small>`;
}

// COMPARATORE MULTI-MANDANTE IN TEMPO REALE
const MANDANTI_LISTINI = {
  'porsche-macan': {
    name: 'Porsche Macan 4 Electric 408 CV',
    basePrices: { arval: 719, ayvens: 745, leasys: 780, itercars: 699 }
  },
  'audi-rs6': {
    name: 'Audi RS6 Performance 4.0 V8 630 CV',
    basePrices: { arval: 1380, ayvens: 1375, leasys: 1450, itercars: 1350 }
  },
  'bmw-m4': {
    name: 'BMW M4 Competition xDrive Coupé',
    basePrices: { arval: 904, ayvens: 920, leasys: 960, itercars: 885 }
  },
  'mercedes-g63': {
    name: 'Mercedes-Benz Classe G 63 AMG Biturbo',
    basePrices: { arval: 1795, ayvens: 1820, leasys: 1750, itercars: 1720 }
  },
  'ferrari-purosangue': {
    name: 'Ferrari Purosangue V12 Aspirato 725 CV',
    basePrices: { arval: 3950, ayvens: 4100, leasys: 4200, itercars: 3880 }
  }
};

function runComparison() {
  const carKey = document.getElementById('compareSelectCar').value;
  const duration = Number(document.getElementById('compareSelectDuration').value) || 48;
  const km = Number(document.getElementById('compareSelectKm').value) || 15000;
  const deposit = Number(document.getElementById('compareInputDeposit').value) || 3000;
  const markup = Number(document.getElementById('compareInputMarkup').value) || 45;

  const carInfo = MANDANTI_LISTINI[carKey] || MANDANTI_LISTINI['porsche-macan'];
  const container = document.getElementById('compareResultsContainer');
  if (!container) return;

  // Calcolo variazioni per durata e km
  let durMult = 1.0;
  if (duration === 36) durMult = 1.06;
  if (duration === 60) durMult = 0.94;

  const kmDelta = (km - 15000) / 5000 * 32.00; // €32 ogni 5.000 km aggiuntivi
  const depDelta = (3000 - deposit) / duration; // Ripartizione differenza anticipo

  const providers = [
    { code: 'arval', name: 'Arval Italia S.p.A.', logo: '🛡️', time: 'Pronta Consegna (3 sett.)', kasko: 'Franchigia 500€' },
    { code: 'ayvens', name: 'Ayvens Network (ALD/LeasePlan)', logo: '🌐', time: 'Ordine (4-6 sett.)', kasko: 'Franchigia 250€' },
    { code: 'leasys', name: 'Leasys Executive', logo: '⭐', time: 'Ordine Su Misura (8 sett.)', kasko: 'Franchigia 500€' },
    { code: 'itercars', name: 'ITERCARS Direct VIP Fleet', logo: '👑', time: 'Pronta Consegna Immediata', kasko: 'Kasko Integral ZERO 0€' }
  ];

  let calculatedOffers = providers.map(p => {
    let netPrice = (carInfo.basePrices[p.code] * durMult) + kmDelta + depDelta;
    let clientFinalPrice = Math.round(netPrice + markup);
    return { ...p, netPrice: Math.round(netPrice), clientPrice: clientFinalPrice };
  });

  // Ordina per prezzo cliente più conveniente
  calculatedOffers.sort((a, b) => a.clientPrice - b.clientPrice);

  container.innerHTML = '';
  calculatedOffers.forEach((o, index) => {
    const isBest = index === 0;
    container.innerHTML += `
      <div class="provider-offer-box ${isBest ? 'best-choice' : ''}">
        ${isBest ? '<span class="best-tag"><i class="ri-star-fill"></i> Best Offer / Margine Ottimizzato</span>' : ''}
        
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="font-size: 1.4rem;">${o.logo}</span>
            <span style="font-size: 0.8rem; color: var(--text-muted); background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 10px;">${o.time}</span>
          </div>
          <h4 style="font-size: 1.15rem; font-weight: 800; color: #fff; margin-bottom: 4px;">${o.name}</h4>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 16px;">Vettura: <strong>${carInfo.name}</strong></div>
          
          <div style="border-top: 1px dashed var(--border-glass); padding-top: 14px; margin-bottom: 16px; font-size: 0.9rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: var(--text-muted);">Costo Netto Mandante:</span>
              <span>€ ${o.netPrice} /m</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: var(--accent-green);">Fee / Ricarico Itercars:</span>
              <span style="color: var(--accent-green); font-weight: 700;">+ € ${markup} /m</span>
            </div>
            <div style="display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.82rem;">
              <span>Parametri:</span>
              <span>${duration}m • ${km.toLocaleString()} km • Anticipo €${deposit.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div>
          <div style="background: rgba(0,0,0,0.4); padding: 14px; border-radius: 12px; margin-bottom: 14px; text-align: center;">
            <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; display: block; font-weight: 700;">Canone Offerto al Cliente</span>
            <span style="font-size: 2.1rem; font-weight: 900; color: #2ecc71; line-height: 1.1;">€ ${o.clientPrice} <small style="font-size: 0.85rem; font-weight: 400; color: #fff;">/mese</small></span>
          </div>

          <button class="btn-header ${isBest ? 'btn-header-primary' : 'btn-header-outline'}" style="width: 100%; justify-content: center; height: 46px;" onclick="sendGeneratedComparisonQuote('${carInfo.name}', '${o.name}', '${duration}', '${km}', '${deposit}', '${o.clientPrice}')">
            <i class="ri-file-pdf-2-line"></i> Genera Preventivo PDF
          </button>
        </div>
      </div>
    `;
  });
}

function sendGeneratedComparisonQuote(carName, provider, months, km, deposit, price) {
  const msg = `👑 *ITERCARS PREVENTIVO UFFICIALE NLT*\n\nGentile Cliente, ecco la migliore proposta selezionata dal nostro Broker per la sua vettura:\n\n🚙 *${carName}*\n🛡️ Listino Mandante: *${provider}*\n📅 Durata: *${months} Mesi*\n🛣️ Chilometri: *${km} km/anno*\n💰 Anticipo: *€ ${deposit}*\n\n🔥 *Canone Tutto Incluso: € ${price} / mese (IVA esc.)*\n_Assicurazione RCA+Kasko, Manutenzione Full e Bollo compresi._\n\nDesidera ricevere il modulo d'istruttoria per bloccare la tariffa?`;
  window.open(`https://api.whatsapp.com/send?phone=393755942143&text=${encodeURIComponent(msg)}`, '_blank');
}

// Render Tabella Overview Documenti
function renderDocsOverview() {
  const container = document.getElementById('docsOverviewContainer');
  if (!container) return;

  const docsLeads = CurrentLeads.filter(l => l.pipeline_status === 'docs_requested' || l.pipeline_status === 'approved_by_provider' || l.pipeline_status === 'contract_signed');
  
  if (docsLeads.length === 0) {
    container.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 40px;">Nessuna istruttoria documentale in corso al momento.</div>';
    return;
  }

  let html = '<div style="display: flex; flex-direction: column; gap: 14px;">';
  docsLeads.forEach(l => {
    html += `
      <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-glass); border-radius: 14px; padding: 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div>
          <div style="font-weight: 800; font-size: 1.1rem; color: #fff;">${l.first_name} ${l.last_name} (${l.customer_type})</div>
          <div style="color: var(--accent-green); font-size: 0.9rem; margin-top: 4px;">Vettura: ${l.car_name} — Mandante: ${l.provider_code}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Contatti: ${l.phone} • ${l.email}</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <span style="background: rgba(241,196,15,0.2); color: #f1c40f; padding: 6px 14px; border-radius: 20px; font-size: 0.82rem; font-weight: 700;">
            <i class="ri-folder-shield-2-fill"></i> 4/5 Documenti Caricati
          </span>
          <button class="btn-header btn-header-outline" onclick="openDossierModal('${l.id}')"><i class="ri-eye-line"></i> Apri Dossier</button>
        </div>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
  document.getElementById('badgeDocsCount').textContent = docsLeads.length;
}

// GESTIONE MODALE DOSSIER CLIENTE
function openDossierModal(leadId) {
  const lead = CurrentLeads.find(l => l.id === leadId);
  if (!lead) return;
  ActiveModalLead = lead;

  document.getElementById('modalClientTitle').textContent = `Dossier: ${lead.first_name} ${lead.last_name}`;
  document.getElementById('modalClientSub').textContent = `${lead.customer_type} • ${lead.car_name} (€${lead.monthly_price}/m - ${lead.provider_code})`;
  document.getElementById('modalLeadNotes').value = lead.notes || '';
  document.getElementById('modalStatusSelect').value = lead.pipeline_status || 'new_lead';

  // Checklist documenti
  const docsList = [
    { name: 'Patente di Guida in corso di validità', status: 'Caricata OK', icon: 'ri-checkbox-circle-fill text-green', color: '#2ecc71' },
    { name: 'Carta d\'Identità o Passaporto', status: 'Caricata OK', icon: 'ri-checkbox-circle-fill text-green', color: '#2ecc71' },
    { name: 'Codice Fiscale / Tessera Sanitaria', status: 'Caricata OK', icon: 'ri-checkbox-circle-fill text-green', color: '#2ecc71' },
    { name: 'Reddito (Ultimo Modello Unico / 2 Buste Paga)', status: lead.pipeline_status === 'new_lead' ? 'Da Richiedere' : 'Verificato', icon: lead.pipeline_status === 'new_lead' ? 'ri-time-fill text-gold' : 'ri-checkbox-circle-fill text-green', color: lead.pipeline_status === 'new_lead' ? '#f1c40f' : '#2ecc71' },
    { name: 'Modulo Privacy & Trattamento Dati Itercars', status: 'Firmato Digitale', icon: 'ri-checkbox-circle-fill text-green', color: '#2ecc71' }
  ];

  const checkElem = document.getElementById('modalDocChecklist');
  checkElem.innerHTML = '';
  docsList.forEach(d => {
    checkElem.innerHTML += `
      <div class="doc-check-item">
        <div style="display: flex; align-items: center; gap: 10px;">
          <i class="${d.icon}" style="font-size: 1.3rem;"></i>
          <span style="font-weight: 600; color: #fff;">${d.name}</span>
        </div>
        <span style="color: ${d.color}; font-weight: 700; font-size: 0.85rem;">${d.status}</span>
      </div>
    `;
  });

  const modal = document.getElementById('dossierModal');
  if (modal) modal.classList.add('active');
}

function closeDossierModal() {
  const modal = document.getElementById('dossierModal');
  if (modal) modal.classList.remove('active');
}

async function saveLeadNotes() {
  if (!ActiveModalLead) return;
  const newNotes = document.getElementById('modalLeadNotes').value;
  ActiveModalLead.notes = newNotes;

  if (supabase && ActiveModalLead.id && !ActiveModalLead.id.startsWith('lead-')) {
    try {
      await supabase.from('crm_leads').update({ notes: newNotes }).eq('id', ActiveModalLead.id);
    } catch(e) {}
  }
  alert("✅ Note operative salvate nel dossier!");
}

async function updateLeadStatusFromModal() {
  if (!ActiveModalLead) return;
  const newSt = document.getElementById('modalStatusSelect').value;
  ActiveModalLead.pipeline_status = newSt;

  if (supabase && ActiveModalLead.id && !ActiveModalLead.id.startsWith('lead-')) {
    try {
      await supabase.from('crm_leads').update({ pipeline_status: newSt }).eq('id', ActiveModalLead.id);
    } catch(e) {}
  }

  closeDossierModal();
  renderKanbanBoard();
  renderDocsOverview();
  updateKpiSummary();
}

/* ==========================================================================
   GESTIONE AUTENTICAZIONE E LOGOUT ADMIN BROKER CONSOLE
   ========================================================================== */

function checkAdminAuth() {
  const overlay = document.getElementById('adminAuthOverlay');
  if (!overlay) return;

  // Controlla se l'amministratore ha già effettuato il login in questa sessione
  let isLogged = false;
  try {
    isLogged = sessionStorage.getItem('itercars_admin_logged') === 'true';
  } catch(e) {}

  if (isLogged) {
    overlay.classList.remove('active');
    overlay.style.display = 'none'; // Aggiunto
  } else {
    overlay.style.display = 'flex'; // Aggiunto
    overlay.classList.add('active');
  }
}

async function handleAdminLogin(event) {
  event.preventDefault();
  const email = document.getElementById('adminEmailInput').value.trim();
  const pass = document.getElementById('adminPasswordInput').value.trim();

  if (!email || !pass) {
    alert("⚠️ Inserisci Email e Password da Broker.");
    return;
  }

  // BYPASS RIMOSSO: Accesso consentito solo al CEO
  if (email.toLowerCase() === 'ceotoribio@itercars.com' && pass === 'Samana2026!') {
    unlockConsoleSuccess(email);
    return;
  } else {
    alert("❌ Accesso negato.\n\nSolo l'amministratore (ceotoribio@itercars.com) è autorizzato ad accedere.");
    return;
  }

  // 2. Verifica tramite tabella personalizzata `public.crm_admins` (Per futuri partner strategici)
  if (supabase) {
    try {
      const { data: dbAdmins, error: dbErr } = await supabase
        .from('crm_admins')
        .select('*')
        .eq('email', email.toLowerCase())
        .eq('password', pass);

      if (!dbErr && dbAdmins && dbAdmins.length > 0) {
        unlockConsoleSuccess(email);
        return;
      }
    } catch(e) {}

    // 3. Verifica tramite Supabase Auth (Se registrato nell'auth nativo di Supabase)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: pass
      });

      if (!error && data && data.user) {
        unlockConsoleSuccess(email);
        return;
      } else {
        alert("❌ Credenziali errate.\n\nPer ora solo il CEO è autorizzato (ceotoribio@itercars.com). In futuro potrai aggiungere i partner strategici nella tabella `crm_admins` del database!");
      }
    } catch(e) {
      alert("❌ Errore di verifica delle credenziali.");
    }
  } else {
    alert("❌ Connessione Supabase non disponibile e credenziali errate.");
  }
}

function unlockConsoleSuccess(userEmail) {
  try {
    sessionStorage.setItem('itercars_admin_logged', 'true');
    sessionStorage.setItem('itercars_admin_email', userEmail);
  } catch (e) {
    console.warn("sessionStorage non disponibile", e);
  }

  const overlay = document.getElementById('adminAuthOverlay');
  if (overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.classList.remove('active');
      overlay.style.display = 'none'; // Aggiunto per sicurezza
    }, 300);
  }

  // Aggiorna badge connessione con nome admin
  const statusEl = document.getElementById('connectionStatus');
  if (statusEl) {
    statusEl.innerHTML = `<span style="width: 8px; height: 8px; background: #2ecc71; border-radius: 50%; display: inline-block; box-shadow: 0 0 10px #2ecc71;"></span> BROKER ATTIVO: ${userEmail.split('@')[0].toUpperCase()}`;
  }
}

function adminLogout() {
  try {
    sessionStorage.removeItem('itercars_admin_logged');
    sessionStorage.removeItem('itercars_admin_email');
  } catch (e) {}
  
  if (supabase) {
    try { supabase.auth.signOut(); } catch(e) {}
  }
  const overlay = document.getElementById('adminAuthOverlay');
  if (overlay) {
    overlay.style.display = 'flex'; // Ripristina il display
    overlay.style.opacity = '1';
    overlay.classList.add('active');
  }
}


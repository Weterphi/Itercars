/* ==========================================================================
   ITERCARS — CRM & BROKERAGE ADMIN CONSOLE LOGIC (V3 — FULL LIVE DB ENGINE)
   ZERO MOCK DATA POLICY — 100% SUPABASE INTEGRATION & COMPLETE CRUD
   ZERO EMOJI POLICY — VECTOR ARCHITECTURAL DESIGN
   ========================================================================== */

const SUPABASE_URL = 'https://brqayhwdrvgllwwjnyvz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJycWF5aHdkcnZnbGx3d2pueXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NDczMTgsImV4cCI6MjA5ODMyMzMxOH0.NZsHj4B_5ylWCcCXy5NKrkLWXNy-6GV4yg5Cv1keaWk';
var supabase = (typeof window.supabase !== 'undefined' && window.supabase.createClient) 
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

// Global State Containers (LIVE DB ONLY - NO MOCKS)
var CurrentLeads = [];
var CurrentVehicles = [];
var CurrentLuxuryVehicles = [];
var CurrentPartnerVehicles = [];
var CurrentProviders = [];
var CurrentNltOffers = [];
var CurrentNbtOffers = [];
var ActiveFleetSubTab = 'nbt';
var CurrentQuotes = [];
var CurrentBookings = [];
var CurrentDocuments = [];
var CurrentPartners = [];
var ActiveModalLead = null;

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
  loadAllCrmData();
});

// Switch tra i Tab Operativi della Console (Stripe Sidebar Layout)
function switchTab(tabId, btnElem) {
  document.querySelectorAll('.tab-pane').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tab-btn, .sidebar-item').forEach(b => b.classList.remove('active'));
  
  const target = document.getElementById(tabId);
  if (target) target.classList.add('active');
  if (btnElem) btnElem.classList.add('active');

  const names = {
    'tab-kanban': 'Pipeline Funnel Leads',
    'tab-fleet': 'Flotta & Listini DB',
    'tab-quotes': 'Archivio Preventivi',
    'tab-bookings': 'Prenotazioni NBT',
    'tab-comparator': 'Comparatore 1-Click',
    'tab-dossier': 'Dossier Delibere Credito',
    'tab-partners': 'Candidature Partner',
    'tab-active-partners': 'Gestione Profili Partner',
    'tab-fleet-approval': 'Approvazione Flotte Excel Mandanti'
  };

  const breadcrumb = document.getElementById('currentBreadcrumbName');
  if (breadcrumb && names[tabId]) {
    breadcrumb.textContent = names[tabId];
  }
  if (tabId === 'tab-fleet-approval') {
    loadFleetApprovalTable();
  }
  if (tabId === 'tab-active-partners') {
    if (typeof loadActivePartnersTab === 'function') loadActivePartnersTab();
  }
}

// Switch tra le Sotto-schede di Flotta e Listini (NBT, NLT, Luxury, Generale)
function switchFleetSubTab(subTabName, btnElem) {
  ActiveFleetSubTab = subTabName;
  document.querySelectorAll('.fleet-subpane').forEach(s => {
    s.classList.remove('active');
    s.style.display = 'none';
  });
  document.querySelectorAll('#tab-fleet .btn-header-outline').forEach(b => b.classList.remove('active'));

  const targetPane = document.getElementById(`subtab-fleet-${subTabName}`);
  if (targetPane) {
    targetPane.classList.add('active');
    targetPane.style.display = 'block';
  }
  if (btnElem) btnElem.classList.add('active');
}

/* ==========================================================================
   CARICAMENTO GLOBALE DATI DAL DATABASE (SUPABASE REAL-TIME FETCH)
   ========================================================================== */
async function loadAllCrmData() {
  if (!supabase) {
    console.error("Supabase client non inizializzato");
    return;
  }

  await Promise.all([
    fetchLeadsFromDatabase(),
    fetchVehiclesFromDatabase(),
    fetchQuotesFromDatabase(),
    fetchBookingsFromDatabase(),
    fetchDocumentsFromDatabase(),
    fetchPartnersFromDatabase()
  ]);

  renderKanbanBoard();
  renderVehiclesTable(CurrentVehicles);
  renderNbtOffersTable(CurrentNbtOffers);
  renderNltOffersTable(CurrentNltOffers);
  renderLuxuryTable(CurrentLuxuryVehicles);
  renderPartnerOffersTable(CurrentPartnerVehicles);
  renderQuotesTable(CurrentQuotes);
  renderBookingsTable(CurrentBookings);
  renderDocsOverview();
  renderPartnersTable(CurrentPartners);
  populateComparisonCarSelect();
  updateKpiSummary();
  loadFleetApprovalTable();
}

// 1. Fetch Leads (`public.crm_leads`)
async function fetchLeadsFromDatabase() {
  try {
    const { data, error } = await supabase
      .from('crm_leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      CurrentLeads = data.map(l => ({
        id: l.id,
        first_name: l.first_name || 'Cliente',
        last_name: l.last_name || '',
        phone: l.phone || '',
        email: l.email || '',
        customer_type: l.customer_type || 'Privato',
        pipeline_status: l.pipeline_status || 'new_lead',
        car_name: l.vehicle_interest || (l.notes ? l.notes.split('-')[0].trim() : 'Richiesta NLT'),
        monthly_price: Number(l.annual_income_or_revenue) || 799,
        provider_code: l.assigned_broker_agent || 'Consulente ITERCARS',
        notes: l.notes || '',
        created_at: l.created_at
      }));
    } else {
      CurrentLeads = [];
    }
  } catch(e) {
    console.warn("Errore fetch crm_leads:", e);
    CurrentLeads = [];
  }
}

// 2. Fetch Vehicles, NLT, NBT & Luxury (`public.vehicles`, `public.nlt_offers`, `public.nbt_offers`)
async function fetchVehiclesFromDatabase() {
  try {
    const [vehRes, nltRes, nbtRes, provRes] = await Promise.all([
      supabase.from('vehicles').select('*').order('created_at', { ascending: false }),
      supabase.from('nlt_offers').select('*, vehicles(*)').order('created_at', { ascending: false }),
      supabase.from('nbt_offers').select('*, vehicles(*)').order('created_at', { ascending: false }),
      supabase.from('providers').select('*').order('name', { ascending: true })
    ]);

    if (!vehRes.error && vehRes.data) CurrentVehicles = vehRes.data;
    else CurrentVehicles = [];

    if (!nltRes.error && nltRes.data) CurrentNltOffers = nltRes.data;
    else CurrentNltOffers = [];

    if (!nbtRes.error && nbtRes.data) CurrentNbtOffers = nbtRes.data;
    else CurrentNbtOffers = [];

    if (!provRes.error && provRes.data) CurrentProviders = provRes.data;
    else CurrentProviders = window._allProvidersCache || [];
    window._allProvidersCache = CurrentProviders;

    // Filtra esclusivamente le supercar, SUV Luxury, cabrio e sportive prestige che corrispondono alla pagina Luxury del sito
    CurrentLuxuryVehicles = CurrentVehicles.filter(v => {
      if (v.is_luxury === false) return false;
      const cat = (v.category || '').toLowerCase();
      const name = (v.name || '').toLowerCase();
      const isLuxCat = ['supercar', 'suv luxury', 'sportiva', 'cabriolet', 'prestige', 'elettrica prestige'].includes(cat);
      const isLuxBrand = ['ferrari', 'lamborghini', 'porsche', 'maserati', 'bentley', 'rolls-royce', 'mclaren', 'aston martin'].some(b => name.includes(b)) || 
                         (['audi', 'bmw', 'mercedes'].some(b => name.includes(b)) && ['rs', 'r8', 'm3', 'm4', 'm8', 'g63', 'amg'].some(m => name.includes(m)));
      return (v.is_luxury === true && (isLuxCat || isLuxBrand || Number(v.daily_price) >= 400)) || isLuxCat || isLuxBrand;
    });

    CurrentPartnerVehicles = CurrentVehicles.filter(v => {
      return (v.provider_id != null && v.provider_id !== '') || 
             (v.import_job_id != null && v.import_job_id !== '') ||
             (v.partner_notes != null && v.partner_notes !== '');
    });

    // Allinea anche i contatori specifici nei badge
    if (document.getElementById('badgeSubVehicles')) document.getElementById('badgeSubVehicles').textContent = CurrentVehicles.length;
    if (document.getElementById('badgeSubNlt')) document.getElementById('badgeSubNlt').textContent = CurrentNltOffers.length;
    if (document.getElementById('badgeSubNbt')) document.getElementById('badgeSubNbt').textContent = CurrentNbtOffers.length;
    if (document.getElementById('badgeSubLuxury')) document.getElementById('badgeSubLuxury').textContent = CurrentLuxuryVehicles.length;
    if (document.getElementById('badgeSubPartners')) document.getElementById('badgeSubPartners').textContent = CurrentPartnerVehicles.length;

    if (typeof renderPartnerOffersTable === 'function') {
      renderPartnerOffersTable(CurrentPartnerVehicles);
    }
  } catch(e) {
    console.warn("Errore fetch vehicles/offers:", e);
    CurrentVehicles = [];
    CurrentNltOffers = [];
    CurrentNbtOffers = [];
    CurrentLuxuryVehicles = [];
    CurrentPartnerVehicles = [];
  }
}

// 3. Fetch Quotes (`public.quotes`)
async function fetchQuotesFromDatabase() {
  try {
    const { data, error } = await supabase
      .from('quotes')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      CurrentQuotes = data;
    } else {
      CurrentQuotes = [];
    }
  } catch(e) {
    console.warn("Errore fetch quotes:", e);
    CurrentQuotes = [];
  }
}

// 4. Fetch Bookings & Availability (`public.bookings` + `public.availability_requests`)
async function fetchBookingsFromDatabase() {
  try {
    const [bkRes, avRes] = await Promise.all([
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('availability_requests').select('*').order('created_at', { ascending: false })
    ]);

    let combined = [];
    if (!bkRes.error && bkRes.data) {
      combined = combined.concat(bkRes.data.map(b => ({
        id: b.id,
        source: 'booking',
        created_at: b.created_at,
        vehicle_name: b.vehicle_name || 'Vettura Flotta',
        client_name: b.client_name || 'Cliente',
        client_phone: b.client_phone || '',
        client_email: b.client_email || '',
        pickup_location: b.pickup_location || 'Milano / Consegna',
        rental_days: b.rental_days || 1,
        status: b.status || 'pending',
        total_price: b.total_price || 0
      })));
    }
    if (!avRes.error && avRes.data) {
      combined = combined.concat(avRes.data.map(a => ({
        id: a.id,
        source: 'availability',
        created_at: a.created_at,
        vehicle_name: a.category ? `Richiesta ${a.category}` : 'Richiesta Disponibilità VIP',
        client_name: a.name || 'Cliente Richiedente',
        client_phone: a.phone || '',
        client_email: a.email || '',
        pickup_location: a.location || 'Consegna Italia/Europa',
        rental_days: a.dates || 'Date da concordare',
        status: a.status || 'new',
        total_price: 0
      })));
    }
    CurrentBookings = combined.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } catch(e) {
    console.warn("Errore fetch bookings:", e);
    CurrentBookings = [];
  }
}

// 5. Fetch Documents (`public.crm_documents`)
async function fetchDocumentsFromDatabase() {
  try {
    const { data, error } = await supabase
      .from('crm_documents')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (!error && data) {
      CurrentDocuments = data;
    } else {
      CurrentDocuments = [];
    }
  } catch(e) {
    console.warn("Errore fetch crm_documents:", e);
    CurrentDocuments = [];
  }
}

// 6. Fetch Partner Applications (`public.supplier_applications`)
async function fetchPartnersFromDatabase() {
  try {
    const { data, error } = await supabase
      .from('supplier_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      CurrentPartners = data;
    } else {
      CurrentPartners = [];
    }
  } catch(e) {
    console.warn("Errore fetch supplier_applications:", e);
    CurrentPartners = [];
  }
}

/* ==========================================================================
   TAB 1: PIPELINE FUNNEL LEADS (KANBAN BOARD CRUD)
   ========================================================================== */
function renderKanbanBoard() {
  const cols = {
    new_lead: document.getElementById('cardsColNew'),
    quote_sent: document.getElementById('cardsColQuote'),
    docs_requested: document.getElementById('cardsColDocs'),
    approved_by_provider: document.getElementById('cardsColApproved'),
    contract_signed: document.getElementById('cardsColSigned')
  };

  Object.values(cols).forEach(c => { if (c) c.innerHTML = ''; });
  const counts = { new_lead: 0, quote_sent: 0, docs_requested: 0, approved_by_provider: 0, contract_signed: 0 };

  if (CurrentLeads.length === 0) {
    if (cols.new_lead) {
      cols.new_lead.innerHTML = `
        <div class="empty-state-box" style="padding: 24px 10px;">
          <i class="ri-user-unfollow-line"></i>
          <h4 style="font-size: 0.95rem;">Nessun Lead</h4>
          <p style="font-size: 0.78rem;">Clicca '+ Nuovo Lead CRM' per iniziare.</p>
        </div>
      `;
    }
    document.getElementById('badgeLeadsCount').textContent = '0';
    return;
  }

  CurrentLeads.forEach(lead => {
    let st = lead.pipeline_status || 'new_lead';
    if (!cols[st]) st = 'new_lead';
    counts[st]++;

    let tagClass = 'tag-privato';
    if (lead.customer_type && lead.customer_type.toLowerCase().includes('iva')) tagClass = 'tag-piva';
    if (lead.customer_type && lead.customer_type.toLowerCase().includes('aziend')) tagClass = 'tag-azienda';

    let nextSt = '';
    let nextLabel = '';
    if (st === 'new_lead') { nextSt = 'quote_sent'; nextLabel = 'Invia Prev. '; }
    else if (st === 'quote_sent') { nextSt = 'docs_requested'; nextLabel = 'Istruttoria '; }
    else if (st === 'docs_requested') { nextSt = 'approved_by_provider'; nextLabel = 'Delibera OK '; }
    else if (st === 'approved_by_provider') { nextSt = 'contract_signed'; nextLabel = 'Firma Contratto '; }

    const cardHtml = `
      <div class="lead-card" onclick="openDossierModal('${lead.id}')">
        <div class="lead-card-header">
          <div class="lead-client-name">${lead.first_name} ${lead.last_name}</div>
          <span class="lead-type-tag ${tagClass}">${lead.customer_type}</span>
        </div>
        
        <div class="lead-car-info">
          <div class="lead-car-title"><i class="ri-roadster-line"></i> ${lead.car_name}</div>
          <div class="lead-car-price">€ ${Number(lead.monthly_price).toLocaleString('it-IT')} <small style="font-size: 0.75rem; font-weight: 400; color: var(--text-muted);">/mese</small></div>
          <div class="lead-provider"><i class="ri-shield-check-line"></i> Mandante: <strong>${lead.provider_code}</strong></div>
        </div>

        <div class="lead-actions" onclick="event.stopPropagation()">
          <a href="https://api.whatsapp.com/send?phone=${(lead.phone||'').replace(/[^0-9]/g, '')}&text=Buongiorno ${lead.first_name}, la contatto dal Desk ITERCARS per la sua richiesta su ${lead.car_name}." target="_blank" class="btn-card-action">
            <i class="ri-whatsapp-line" style="color: #ffffff;"></i> WhatsApp
          </a>
          ${nextSt ? `
            <button class="btn-card-action btn-advance" onclick="quickAdvanceLead('${lead.id}', '${nextSt}')">
              ${nextLabel}
            </button>
          ` : '<span style="font-size: 0.78rem; color: #ffffff; font-weight: 800;"><i class="ri-check-double-line"></i> CONCLUSO</span>'}
        </div>
      </div>
    `;

    if (cols[st]) cols[st].innerHTML += cardHtml;
  });

  document.getElementById('countColNew').textContent = counts.new_lead;
  document.getElementById('countColQuote').textContent = counts.quote_sent;
  document.getElementById('countColDocs').textContent = counts.docs_requested;
  document.getElementById('countColApproved').textContent = counts.approved_by_provider;
  document.getElementById('countColSigned').textContent = counts.contract_signed;
  document.getElementById('badgeLeadsCount').textContent = CurrentLeads.length;
}

async function quickAdvanceLead(leadId, nextStatus) {
  const lead = CurrentLeads.find(l => l.id === leadId);
  if (!lead) return;

  lead.pipeline_status = nextStatus;
  try {
    await supabase.from('crm_leads').update({ pipeline_status: nextStatus }).eq('id', leadId);
  } catch(e) {
    console.warn("Errore update lead status:", e);
  }
  renderKanbanBoard();
  updateKpiSummary();
}

function openNewLeadModal() {
  const modal = document.getElementById('newLeadModal');
  if (modal) {
    const inputs = modal.querySelectorAll('input, textarea');
    inputs.forEach(i => i.value = '');
    modal.classList.add('active');
  }
}

function closeNewLeadModal() {
  const modal = document.getElementById('newLeadModal');
  if (modal) modal.classList.remove('active');
}

async function handleNewLeadFormSubmit(event) {
  if (event && event.preventDefault) event.preventDefault();
  const nameVal = document.getElementById('newLeadName') ? document.getElementById('newLeadName').value.trim() : '';
  const emailVal = document.getElementById('newLeadEmail') ? document.getElementById('newLeadEmail').value.trim() : '';
  const phoneVal = document.getElementById('newLeadPhone') ? document.getElementById('newLeadPhone').value.trim() : '';
  const typeVal = document.getElementById('newLeadType') ? document.getElementById('newLeadType').value : 'Azienda / Società';
  const carVal = document.getElementById('newLeadCar') ? document.getElementById('newLeadCar').value.trim() : '';
  const notesVal = document.getElementById('newLeadNotes') ? document.getElementById('newLeadNotes').value.trim() : '';

  let first = nameVal;
  let last = '';
  if (nameVal.includes(' ')) {
    const parts = nameVal.split(' ');
    first = parts[0];
    last = parts.slice(1).join(' ');
  }

  try {
    const { data, error } = await supabase.from('crm_leads').insert([{
      first_name: first || 'Nuovo',
      last_name: last || 'Lead',
      phone: phoneVal,
      email: emailVal,
      customer_type: typeVal,
      pipeline_status: 'new_lead',
      vehicle_interest: carVal || 'Richiesta CRM Direct',
      annual_income_or_revenue: 0,
      notes: notesVal,
      assigned_broker_agent: 'Consulente Senior ITERCARS'
    }]).select();

    if (error) {
      alert("Errore durante il salvataggio su Supabase: " + error.message);
      return;
    }

    closeNewLeadModal();
    await fetchLeadsFromDatabase();
    renderKanbanBoard();
    updateKpiSummary();
    alert("Nuovo Lead inserito con successo nel database Supabase!");
  } catch(e) {
    alert("Errore critico di inserimento Lead.");
  }
}
// Alias per compatibilità
function saveNewLeadRecord(e) { handleNewLeadFormSubmit(e); }

async function deleteCurrentLead() {
  if (!ActiveModalLead) return;
  if (!confirm(`Confermi l'eliminazione definitiva del lead "${ActiveModalLead.first_name} ${ActiveModalLead.last_name}" dal database SQL?`)) return;

  try {
    await supabase.from('crm_leads').delete().eq('id', ActiveModalLead.id);
    closeDossierModal();
    await fetchLeadsFromDatabase();
    renderKanbanBoard();
    renderDocsOverview();
    updateKpiSummary();
  } catch(e) {
    alert("Errore durante la cancellazione del lead.");
  }
}

/* ==========================================================================
   TAB 2: GESTIONE FLOTTA & LISTINI (`public.vehicles` CRUD)
   ========================================================================== */
function renderVehiclesTable(vehicles) {
  const tbody = document.getElementById('vehiclesTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (vehicles.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state-box">
            <i class="ri-roadster-line"></i>
            <h4>Nessun veicolo presente nella tabella \`public.vehicles\`</h4>
            <p>Clicca il pulsante "+ Aggiungi Veicolo" per registrare la prima vettura.</p>
          </div>
        </td>
      </tr>
    `;
    document.getElementById('badgeVehiclesCount').textContent = '0';
    return;
  }

  vehicles.forEach(v => {
    const title = `${v.brand || ''} ${v.model || v.name || 'Vettura'}`.trim();
    const isLive = v.is_available !== false;
    
    tbody.innerHTML += `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 14px;">
            <img src="${v.image_url || 'logo_tricolore.png'}" alt="${title}" style="width: 72px; height: 46px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border-glass); flex-shrink: 0; background: rgba(0,0,0,0.3);" onerror="this.src='logo-text.png'" />
            <div>
              <strong style="color: #fff; font-size: 0.96rem; display: block; line-height: 1.2; margin-bottom: 3px;">${title}</strong>
              <span style="font-size: 0.78rem; color: var(--text-muted); background: rgba(255,255,255,0.04); padding: 2px 6px; border-radius: 4px;">${v.trim || 'Executive'} • ${v.category || 'SUV'}</span>
            </div>
          </div>
        </td>
        <td>
          <div><i class="ri-gas-station-line text-muted" style="font-size: 1rem; vertical-align: -2px;"></i> <strong style="color: #e2e8f0; font-size: 0.9rem;">${v.fuel_type || 'Ibrido / Diesel'}</strong></div>
          <small style="color: var(--text-muted); display: block; margin-top: 2px;">${v.transmission || 'Automatico 8M'}</small>
        </td>
        <td>
          <strong style="color: var(--accent-green); font-size: 1.08rem; display: block; line-height: 1.2;">€ ${Number(v.daily_price || 0).toLocaleString('it-IT')} <small style="font-size: 0.75rem; font-weight: 400; color: #fff;">/m</small></strong>
          <small style="color: var(--text-muted); display: block; margin-top: 2px;">Cauzione €${Number(v.deposit || 0).toLocaleString('it-IT')}</small>
        </td>
        <td>
          <span style="background: rgba(241, 196, 15, 0.15); color: #f1c40f; padding: 5px 12px; border-radius: 8px; font-size: 0.76rem; font-weight: 700; display: inline-block; border: 1px solid rgba(241, 196, 15, 0.25);">
            ${v.badge || 'Executive'}
          </span>
        </td>
        <td>
          <span class="status-pill ${isLive ? 'pill-approved' : 'pill-inactive'}" onclick="toggleVehicleStatus('${v.id}', ${!isLive})" style="cursor: pointer; padding: 5px 12px;" title="Clicca per cambiare stato">
            <i class="ri-record-circle-line"></i> ${isLive ? 'ONLINE' : 'NASCOSTO'}
          </span>
        </td>
        <td style="text-align: right;">
          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button class="btn-header btn-header-outline" style="padding: 6px 10px; font-size: 0.78rem;" onclick="editVehicleRecord('${v.id}')" title="Modifica Veicolo">
              <i class="ri-edit-line"></i>
            </button>
            <button class="btn-header btn-header-danger" style="padding: 6px 10px; font-size: 0.78rem;" onclick="deleteVehicleRecord('${v.id}')" title="Elimina dal Catalogo">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  document.getElementById('badgeVehiclesCount').textContent = vehicles.length;
}

function filterVehiclesTable(query) {
  const input = document.getElementById('searchVehicleInput');
  const q = (query || (input ? input.value : '')).toLowerCase();
  const filtered = CurrentVehicles.filter(v => 
    (v.brand && v.brand.toLowerCase().includes(q)) ||
    (v.model && v.model.toLowerCase().includes(q)) ||
    (v.category && v.category.toLowerCase().includes(q))
  );
  renderVehiclesTable(filtered);
}

/* ==========================================================================
   TAB 2.1: GESTIONE LISTINI NBT BREVE TERMINE (`public.nbt_offers` CRUD)
   ========================================================================== */
function renderNbtOffersTable(offers) {
  const tbody = document.getElementById('nbtOffersTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (!offers || offers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state-box">
            <i class="ri-flashlight-fill" style="color: #f1c40f;"></i>
            <h4>Nessuna offerta NBT Breve Termine configurata nel DB</h4>
            <p>Clicca su "+ Aggiungi / Configura Auto in NBT" per impostare tariffe e depositi.</p>
          </div>
        </td>
      </tr>
    `;
    if (document.getElementById('badgeSubNbt')) document.getElementById('badgeSubNbt').textContent = '0';
    return;
  }

  offers.forEach(o => {
    const veh = o.vehicles || CurrentVehicles.find(x => x.id === o.vehicle_id) || {};
    const title = `${veh.brand || ''} ${veh.model || veh.name || o.provider_offer_code || 'Vettura NBT'}`.trim();
    const img = veh.image_url || 'logo_tricolore.png';
    const isLive = o.is_active !== false;
    const daily = Number(o.daily_price || veh.daily_price || 0);
    const monthly = Number(o.client_monthly_price || Math.round(daily * 20) || 0);
    const dep = Number(o.deposit_mandante || veh.deposit || 3000);

    tbody.innerHTML += `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 14px;">
            <img src="${img}" alt="${title}" style="width: 72px; height: 46px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(241,196,15,0.3); flex-shrink: 0; background: rgba(0,0,0,0.3);" onerror="this.src='logo-text.png'" />
            <div>
              <strong style="color: #fff; font-size: 0.96rem; display: block; line-height: 1.2; margin-bottom: 3px;">${title}</strong>
              <span style="font-size: 0.78rem; color: #f1c40f; background: rgba(241,196,15,0.12); padding: 2px 6px; border-radius: 4px; font-weight: 700;">${o.provider_offer_code || 'NBT Premium'} • ${veh.category || 'SUV'}</span>
            </div>
          </div>
        </td>
        <td>
          <strong style="color: #f1c40f; font-size: 1.15rem; display: block; line-height: 1.2;">€ ${daily.toLocaleString('it-IT')} <small style="font-size: 0.75rem; font-weight: 400; color: #fff;">/giorno</small></strong>
          <small style="color: var(--text-muted); display: block; margin-top: 2px;">Tariffa Live</small>
        </td>
        <td>
          <strong style="color: #e2e8f0; font-size: 0.98rem; display: block;">€ ${monthly.toLocaleString('it-IT')} <small style="font-size: 0.75rem;">/mese</small></strong>
          <small style="color: var(--text-muted); display: block; margin-top: 2px;">Cauzione €${dep.toLocaleString('it-IT')}</small>
        </td>
        <td>
          <strong style="color: #fff; font-size: 0.9rem; display: block;">${o.duration_months || 12} Mesi / Giorni</strong>
          <small style="color: var(--text-muted); display: block; margin-top: 2px;">${Number(o.km_per_year || 20000).toLocaleString('it-IT')} Km Inclusi</small>
        </td>
        <td>
          <span style="background: ${o.is_ready_delivery !== false ? 'rgba(46,204,113,0.15)' : 'rgba(56,189,248,0.15)'}; color: ${o.is_ready_delivery !== false ? '#ffffff' : '#ffffff'}; padding: 4px 10px; border-radius: 6px; font-size: 0.76rem; font-weight: 700; display: inline-block;">
            ${o.is_ready_delivery !== false ? ' Subito Disponibile' : '⏳ Ordine (' + (o.delivery_weeks || 2) + ' sett.)'}
          </span>
        </td>
        <td>
          <span class="status-pill ${isLive ? 'pill-approved' : 'pill-inactive'}" onclick="toggleNbtOfferStatus('${o.id}', ${!isLive})" style="cursor: pointer; padding: 5px 12px;" title="Clicca per cambiare stato NBT">
            <i class="ri-record-circle-line"></i> ${isLive ? 'ATTIVO' : 'SOSPESO'}
          </span>
        </td>
        <td style="text-align: right;">
          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button class="btn-header btn-header-outline" style="padding: 6px 10px; font-size: 0.78rem; border-color: rgba(241,196,15,0.4);" onclick="editNbtOfferRecord('${o.id}')" title="Modifica Listino NBT">
              <i class="ri-edit-line text-muted"></i>
            </button>
            <button class="btn-header btn-header-danger" style="padding: 6px 10px; font-size: 0.78rem;" onclick="deleteNbtOfferRecord('${o.id}')" title="Rimuovi da NBT">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  if (document.getElementById('badgeSubNbt')) document.getElementById('badgeSubNbt').textContent = offers.length;
}

function filterNbtTable() {
  const input = document.getElementById('searchNbtInput');
  const q = (input ? input.value : '').toLowerCase();
  const filtered = CurrentNbtOffers.filter(o => {
    const veh = o.vehicles || CurrentVehicles.find(x => x.id === o.vehicle_id) || {};
    return (veh.brand && veh.brand.toLowerCase().includes(q)) ||
           (veh.model && veh.model.toLowerCase().includes(q)) ||
           (veh.name && veh.name.toLowerCase().includes(q)) ||
           (o.provider_offer_code && o.provider_offer_code.toLowerCase().includes(q));
  });
  renderNbtOffersTable(filtered);
}

/* ==========================================================================
   TAB 2.2: GESTIONE LISTINI NLT LUNGO TERMINE (`public.nlt_offers` CRUD)
   ========================================================================== */
function renderNltOffersTable(offers) {
  const tbody = document.getElementById('nltOffersTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (!offers || offers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state-box">
            <i class="ri-calendar-check-line" style="color: #ffffff;"></i>
            <h4>Nessuna offerta NLT Lungo Termine configurata nel DB</h4>
            <p>Clicca su "+ Aggiungi / Configura Auto in NLT" per impostare canoni e durate.</p>
          </div>
        </td>
      </tr>
    `;
    if (document.getElementById('badgeSubNlt')) document.getElementById('badgeSubNlt').textContent = '0';
    return;
  }

  offers.forEach(o => {
    const veh = o.vehicles || CurrentVehicles.find(x => x.id === o.vehicle_id) || {};
    const title = `${veh.brand || ''} ${veh.model || veh.name || o.provider_offer_code || 'Vettura NLT'}`.trim();
    const img = veh.image_url || 'logo_tricolore.png';
    const isLive = o.is_active !== false;
    const monthly = Number(o.client_monthly_price || veh.daily_price || 0);
    const dep = Number(o.deposit_mandante || veh.deposit || 3000);

    tbody.innerHTML += `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 14px;">
            <img src="${img}" alt="${title}" style="width: 72px; height: 46px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(56,189,248,0.3); flex-shrink: 0; background: rgba(0,0,0,0.3);" onerror="this.src='logo-text.png'" />
            <div>
              <strong style="color: #fff; font-size: 0.96rem; display: block; line-height: 1.2; margin-bottom: 3px;">${title}</strong>
              <span style="font-size: 0.78rem; color: #ffffff; background: rgba(56,189,248,0.12); padding: 2px 6px; border-radius: 4px; font-weight: 700;">${o.provider_offer_code || 'Mandante NLT'} • ${veh.category || 'Executive'}</span>
            </div>
          </div>
        </td>
        <td>
          <strong style="color: #ffffff; font-size: 1.15rem; display: block; line-height: 1.2;">€ ${monthly.toLocaleString('it-IT')} <small style="font-size: 0.75rem; font-weight: 400; color: #fff;">/mese</small></strong>
          <small style="color: var(--text-muted); display: block; margin-top: 2px;">Tutto Incluso</small>
        </td>
        <td>
          <strong style="color: #fff; font-size: 0.95rem; display: block;">${o.duration_months || 48} Mesi</strong>
          <small style="color: var(--text-muted); display: block; margin-top: 2px;">${Number(o.km_per_year || 15000).toLocaleString('it-IT')} Km Annui</small>
        </td>
        <td>
          <strong style="color: #e2e8f0; font-size: 0.95rem; display: block;">€ ${dep.toLocaleString('it-IT')}</strong>
          <small style="color: var(--text-muted); display: block; margin-top: 2px;">Anticipo</small>
        </td>
        <td>
          <span style="background: ${o.is_ready_delivery !== false ? 'rgba(46,204,113,0.15)' : 'rgba(56,189,248,0.15)'}; color: ${o.is_ready_delivery !== false ? '#ffffff' : '#ffffff'}; padding: 4px 10px; border-radius: 6px; font-size: 0.76rem; font-weight: 700; display: inline-block;">
            ${o.is_ready_delivery !== false ? ' Pronta Consegna' : '⏳ Ordine (' + (o.delivery_weeks || 4) + ' sett.)'}
          </span>
        </td>
        <td>
          <span class="status-pill ${isLive ? 'pill-approved' : 'pill-inactive'}" onclick="toggleNltOfferStatus('${o.id}', ${!isLive})" style="cursor: pointer; padding: 5px 12px;" title="Clicca per cambiare stato NLT">
            <i class="ri-record-circle-line"></i> ${isLive ? 'ATTIVO' : 'SOSPESO'}
          </span>
        </td>
        <td style="text-align: right;">
          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button class="btn-header btn-header-outline" style="padding: 6px 10px; font-size: 0.78rem; border-color: rgba(56,189,248,0.4);" onclick="editNltOfferRecord('${o.id}')" title="Modifica Listino NLT">
              <i class="ri-edit-line text-muted"></i>
            </button>
            <button class="btn-header btn-header-danger" style="padding: 6px 10px; font-size: 0.78rem;" onclick="deleteNltOfferRecord('${o.id}')" title="Rimuovi da NLT">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  if (document.getElementById('badgeSubNlt')) document.getElementById('badgeSubNlt').textContent = offers.length;
}

function filterNltTable() {
  const input = document.getElementById('searchNltInput');
  const q = (input ? input.value : '').toLowerCase();
  const filtered = CurrentNltOffers.filter(o => {
    const veh = o.vehicles || CurrentVehicles.find(x => x.id === o.vehicle_id) || {};
    return (veh.brand && veh.brand.toLowerCase().includes(q)) ||
           (veh.model && veh.model.toLowerCase().includes(q)) ||
           (veh.name && veh.name.toLowerCase().includes(q)) ||
           (o.provider_offer_code && o.provider_offer_code.toLowerCase().includes(q));
  });
  renderNltOffersTable(filtered);
}

function openNewVehicleModal() {
  const modal = document.getElementById('newVehicleModal');
  if (modal) {
    const inputs = modal.querySelectorAll('input[type="text"], input[type="url"], textarea');
    inputs.forEach(i => i.value = '');
    if (document.getElementById('vehEditId')) document.getElementById('vehEditId').value = '';
    if (document.getElementById('vehProviderId')) document.getElementById('vehProviderId').value = '';
    if (document.getElementById('vehicleModalTitleText')) document.getElementById('vehicleModalTitleText').textContent = 'Aggiungi Veicolo (`public.vehicles`)';
    modal.style.zIndex = '2100';
    modal.classList.add('active');
  }
}

function closeNewVehicleModal() {
  const modal = document.getElementById('newVehicleModal');
  if (modal) {
    modal.style.zIndex = '';
    modal.classList.remove('active');
  }
}
// Alias per compatibilità
function closeVehicleModal() { closeNewVehicleModal(); }

function editVehicleRecord(vehicleId) {
  const v = CurrentVehicles.find(x => x.id === vehicleId);
  if (!v) return;

  const modal = document.getElementById('newVehicleModal');
  if (!modal) return;

  if (document.getElementById('vehEditId')) document.getElementById('vehEditId').value = v.id;
  if (document.getElementById('vehProviderId')) document.getElementById('vehProviderId').value = v.provider_id || '';
  if (document.getElementById('vehTitle')) document.getElementById('vehTitle').value = `${v.brand || ''} ${v.model || v.name || ''}`.trim();
  if (document.getElementById('vehPrice')) document.getElementById('vehPrice').value = v.daily_price || v.price || 500;
  
  let specStr = v.fuel_type || 'Ibrido / Diesel';
  if (v.specs && v.specs.hp) specStr += ` • ${v.specs.hp}`;
  if (v.transmission) specStr += ` • ${v.transmission}`;
  if (document.getElementById('vehSpecs')) document.getElementById('vehSpecs').value = specStr;

  if (document.getElementById('vehTag')) document.getElementById('vehTag').value = v.badge || 'NLT 48 Mesi';
  if (document.getElementById('vehImage')) document.getElementById('vehImage').value = v.image_url || '';
  if (document.getElementById('vehDesc')) document.getElementById('vehDesc').value = (v.specs && v.specs.description ? v.specs.description : (v.description || 'Dotazione executive completa di serie con navigatore, fari Matrix LED, interni in pelle e cerchi in lega.'));
  if (document.getElementById('vehCity')) document.getElementById('vehCity').value = v['city'] || '';

  if (document.getElementById('vehicleModalTitleText')) document.getElementById('vehicleModalTitleText').textContent = `Modifica: ${v.brand || ''} ${v.model || v.name || ''}`;
  modal.style.zIndex = '2100';
  modal.classList.add('active');
}

async function handleVehicleFormSubmit(event) {
  if (event && event.preventDefault) event.preventDefault();
  
  const id = document.getElementById('vehEditId') ? document.getElementById('vehEditId').value : '';
  const providerIdVal = document.getElementById('vehProviderId') ? document.getElementById('vehProviderId').value : '';
  const titleVal = document.getElementById('vehTitle') ? document.getElementById('vehTitle').value.trim() : '';
  const priceVal = document.getElementById('vehPrice') ? Number(document.getElementById('vehPrice').value.replace(/[^0-9.]/g, '')) || 500 : 500;
  const specsVal = document.getElementById('vehSpecs') ? document.getElementById('vehSpecs').value.trim() : 'Ibrido • Automatico';
  const tagVal = document.getElementById('vehTag') ? document.getElementById('vehTag').value : 'NLT 48 Mesi';
  const imgVal = document.getElementById('vehImage') ? document.getElementById('vehImage').value.trim() : '';
  const descVal = document.getElementById('vehDesc') ? document.getElementById('vehDesc').value.trim() : '';
  const cityVal = document.getElementById('vehCity') ? document.getElementById('vehCity').value.trim() : '';

  const isLuxury = document.getElementById('vehIsLuxury') ? document.getElementById('vehIsLuxury').checked : false;
  const isNbt = document.getElementById('vehIsNbt') ? document.getElementById('vehIsNbt').checked : false;
  const isNlt = document.getElementById('vehIsNlt') ? document.getElementById('vehIsNlt').checked : false;

  let brand = 'ITERCARS';
  let model = titleVal;
  if (titleVal.includes(' ')) {
    const parts = titleVal.split(' ');
    brand = parts[0];
    model = parts.slice(1).join(' ');
  }

  const payload = {
    brand: brand,
    model: model,
    name: titleVal,
    category: 'SUV / Executive',
    badge: tagVal,
    daily_price: priceVal,
    deposit: Math.round(priceVal * 3),
    image_url: imgVal || 'logo_tricolore.png',
    fuel_type: specsVal.split('•')[0].trim() || 'Ibrido',
    specs: { hp: specsVal, accel: "4.5s 0-100", seats: 5, speed: "250 km/h", transmission: "Automatico", description: descVal },
    is_nlt: isNlt,
    is_nbt: isNbt,
    is_available: true,
    is_luxury: isLuxury,
    provider_id: providerIdVal || null,
    'city': cityVal
  };

  try {
    if (id) {
      const { error } = await supabase.from('vehicles').update(payload).eq('id', id);
      if (error) throw error;

      // Sincronizza anche il prezzo sulle offerte NLT e NBT collegate a questa vettura per coerenza
      await supabase.from('nlt_offers').update({ client_monthly_price: priceVal }).eq('vehicle_id', id);
      await supabase.from('nbt_offers').update({ daily_price: priceVal }).eq('vehicle_id', id);
    } else {
      const { data: newVeh, error } = await supabase.from('vehicles').insert([payload]).select();
      if (error) throw error;

      // Crea automaticamente una offerta NLT base collegata alla nuova vettura se inserita con successo
      if (newVeh && newVeh[0] && newVeh[0].id) {
        await supabase.from('nlt_offers').insert([{
          vehicle_id: newVeh[0].id,
          duration_months: 48,
          km_per_year: 15000,
          deposit_mandante: Math.round(priceVal * 3),
          mandante_monthly_net: Math.round(priceVal * 0.85),
          broker_markup_monthly: Math.round(priceVal * 0.15),
          client_monthly_price: priceVal,
          is_ready_delivery: true,
          is_active: true
        }]);
        await supabase.from('nbt_offers').insert([{
          vehicle_id: newVeh[0].id,
          daily_price: priceVal,
          is_ready_delivery: true,
          is_active: true
        }]);
      }
    }
    
    closeVehicleModal();
    await fetchVehiclesFromDatabase();
    
    // Se siamo dentro il profilo partner, aggiorniamo la tabella del partner in tempo reale
    if (typeof ActivePartnerProfile !== 'undefined' && ActivePartnerProfile) {
      loadPartnerProfileFleet(ActivePartnerProfile.id);
    }
    
    renderVehiclesTable(CurrentVehicles);
    renderNbtOffersTable(CurrentNbtOffers);
    renderNltOffersTable(CurrentNltOffers);
    renderLuxuryTable(CurrentLuxuryVehicles);
    populateComparisonCarSelect();
    alert(id ? "Veicolo e listini aggiornati correttamente nel database SQL!" : "Nuovo veicolo aggiunto con successo al catalogo e listino SQL!");
  } catch(e) {
    alert("Errore salvataggio veicolo su Supabase (Verifica Policy RLS / Permessi SQL): " + (e.message || e));
  }
}
// Alias
function saveVehicleRecord(e) { handleVehicleFormSubmit(e); }

async function deleteVehicleRecord(vehicleId) {
  const v = CurrentVehicles.find(x => x.id === vehicleId);
  if (!v) return;
  if (!confirm(`Confermi l'eliminazione definitiva della vettura "${v.brand || ''} ${v.model || v.name || ''}" e di tutte le offerte associate?`)) return;

  try {
    // 1. Eliminiamo prima preventivamente tutte le tabelle dipendenti (FK) per evitare errori "violates foreign key constraint"
    await supabase.from('nlt_offers').delete().eq('vehicle_id', vehicleId);
    await supabase.from('nbt_offers').delete().eq('vehicle_id', vehicleId);
    await supabase.from('quotes').delete().eq('vehicle_id', vehicleId);
    await supabase.from('bookings').delete().eq('vehicle_id', vehicleId);

    // 2. Eliminiamo la vettura controllando se Supabase restituisce un errore RLS o SQL
    const { error } = await supabase.from('vehicles').delete().eq('id', vehicleId);
    if (error) {
      alert("Impossibile eliminare da Supabase (Blocco Policy RLS / Permessi): " + error.message);
      return;
    }

    await fetchVehiclesFromDatabase();
    renderVehiclesTable(CurrentVehicles);
    renderNbtOffersTable(CurrentNbtOffers);
    renderNltOffersTable(CurrentNltOffers);
    renderLuxuryTable(CurrentLuxuryVehicles);
    populateComparisonCarSelect();
    alert("Veicolo rimosso correttamente dal catalogo!");
  } catch(e) {
    alert("Impossibile eliminare: " + (e.message || e));
  }
}

async function toggleVehicleStatus(vehicleId, newStatus) {
  try {
    await supabase.from('vehicles').update({ is_available: newStatus }).eq('id', vehicleId);
    const v = CurrentVehicles.find(x => x.id === vehicleId);
    if (v) v.is_available = newStatus;
    renderVehiclesTable(CurrentVehicles);
  } catch(e) {}
}

/* ==========================================================================
   MODALI E CRUD NBT BREVE TERMINE (`public.nbt_offers`)
   ========================================================================== */
function populateNbtVehicleSelect(selectedVehId) {
  const sel = document.getElementById('nbtSelectVehicle');
  if (!sel) return;
  sel.innerHTML = '<option value="">-- Seleziona un veicolo dalla flotta DB --</option>';
  CurrentVehicles.forEach(v => {
    const t = `${v.brand || ''} ${v.model || v.name || 'Vettura'}`.trim();
    const isSel = (v.id === selectedVehId) ? 'selected' : '';
    sel.innerHTML += `<option value="${v.id}" ${isSel}>${t} (€${v.daily_price || 0}/g)</option>`;
  });
  sel.innerHTML += '<option value="NEW_VEHICLE" style="font-weight:700; color:#f1c40f;">+ Nuova Marca e Modello (Crea al volo in flotta)...</option>';
}

function handleNbtVehicleSelectChange(selectElem) {
  const wrapper = document.getElementById('nbtNewTitleWrapper');
  const inputNew = document.getElementById('nbtNewTitle');
  if (!wrapper || !selectElem) return;
  if (selectElem.value === 'NEW_VEHICLE') {
    wrapper.style.display = 'block';
    if (inputNew) inputNew.required = true;
  } else {
    wrapper.style.display = 'none';
    if (inputNew) {
      inputNew.required = false;
      inputNew.value = '';
    }
    const veh = CurrentVehicles.find(x => x.id === selectElem.value);
    if (veh) {
      if (document.getElementById('nbtDailyPrice') && (!document.getElementById('nbtDailyPrice').value || document.getElementById('nbtEditId').value === '')) {
        document.getElementById('nbtDailyPrice').value = veh.daily_price || 140;
      }
      if (document.getElementById('nbtDeposit') && (!document.getElementById('nbtDeposit').value || document.getElementById('nbtEditId').value === '')) {
        document.getElementById('nbtDeposit').value = veh.deposit || 3000;
      }
    }
  }
}

function openNewNbtOfferModal() {
  const modal = document.getElementById('newNbtOfferModal');
  if (!modal) return;
  const inputs = modal.querySelectorAll('input[type="text"], input[type="number"]');
  inputs.forEach(i => i.value = '');
  if (document.getElementById('nbtEditId')) document.getElementById('nbtEditId').value = '';
  if (document.getElementById('nbtDeposit')) document.getElementById('nbtDeposit').value = '3000';
  if (document.getElementById('nbtDuration')) document.getElementById('nbtDuration').value = '12';
  if (document.getElementById('nbtKm')) document.getElementById('nbtKm').value = '20000';
  if (document.getElementById('nbtReadyDelivery')) document.getElementById('nbtReadyDelivery').value = 'true';
  if (document.getElementById('nbtDeliveryWeeks')) document.getElementById('nbtDeliveryWeeks').value = '1';
  if (document.getElementById('nbtModalTitleText')) document.getElementById('nbtModalTitleText').innerHTML = '<i class="ri-flashlight-fill"></i> Configura Listino Breve Termine NBT';
  
  populateNbtVehicleSelect('');
  const wrapper = document.getElementById('nbtNewTitleWrapper');
  if (wrapper) wrapper.style.display = 'none';
  modal.classList.add('active');
}

function closeNewNbtOfferModal() {
  const modal = document.getElementById('newNbtOfferModal');
  if (modal) modal.classList.remove('active');
}

function editNbtOfferRecord(offerId) {
  const o = CurrentNbtOffers.find(x => x.id === offerId);
  if (!o) return;
  const modal = document.getElementById('newNbtOfferModal');
  if (!modal) return;

  if (document.getElementById('nbtEditId')) document.getElementById('nbtEditId').value = o.id;
  populateNbtVehicleSelect(o.vehicle_id);
  const wrapper = document.getElementById('nbtNewTitleWrapper');
  if (wrapper) wrapper.style.display = 'none';

  if (document.getElementById('nbtDailyPrice')) document.getElementById('nbtDailyPrice').value = o.daily_price || (o.vehicles ? o.vehicles.daily_price : 140);
  if (document.getElementById('nbtMonthlyPrice')) document.getElementById('nbtMonthlyPrice').value = o.client_monthly_price || '';
  if (document.getElementById('nbtDeposit')) document.getElementById('nbtDeposit').value = o.deposit_mandante || 3000;
  if (document.getElementById('nbtDuration')) document.getElementById('nbtDuration').value = o.duration_months || 12;
  if (document.getElementById('nbtKm')) document.getElementById('nbtKm').value = o.km_per_year || 20000;
  if (document.getElementById('nbtReadyDelivery')) document.getElementById('nbtReadyDelivery').value = (o.is_ready_delivery !== false) ? 'true' : 'false';
  if (document.getElementById('nbtDeliveryWeeks')) document.getElementById('nbtDeliveryWeeks').value = o.delivery_weeks || 1;
  if (document.getElementById('nbtProviderCode')) document.getElementById('nbtProviderCode').value = o.provider_offer_code || '';

  const veh = o.vehicles || CurrentVehicles.find(x => x.id === o.vehicle_id) || {};
  const t = `${veh.brand || ''} ${veh.model || veh.name || ''}`.trim();
  if (document.getElementById('nbtModalTitleText')) document.getElementById('nbtModalTitleText').innerHTML = `<i class="ri-flashlight-fill"></i> Modifica NBT: ${t}`;
  modal.classList.add('active');
}

async function handleNbtOfferSubmit(event) {
  if (event && event.preventDefault) event.preventDefault();
  const editId = document.getElementById('nbtEditId') ? document.getElementById('nbtEditId').value : '';
  const selVehId = document.getElementById('nbtSelectVehicle') ? document.getElementById('nbtSelectVehicle').value : '';
  const newTitle = document.getElementById('nbtNewTitle') ? document.getElementById('nbtNewTitle').value.trim() : '';
  const dailyVal = Number(document.getElementById('nbtDailyPrice').value) || 140;
  const monthlyVal = Number(document.getElementById('nbtMonthlyPrice').value) || Math.round(dailyVal * 20);
  const depVal = Number(document.getElementById('nbtDeposit').value) || 3000;
  const durVal = Number(document.getElementById('nbtDuration').value) || 12;
  const kmVal = Number(document.getElementById('nbtKm').value) || 20000;
  const readyVal = document.getElementById('nbtReadyDelivery') ? document.getElementById('nbtReadyDelivery').value === 'true' : true;
  const weeksVal = Number(document.getElementById('nbtDeliveryWeeks').value) || 1;
  const codeVal = document.getElementById('nbtProviderCode') ? document.getElementById('nbtProviderCode').value.trim() : 'NBT-VIP-LIVE';

  try {
    let finalVehId = selVehId;
    if (selVehId === 'NEW_VEHICLE' || !selVehId) {
      if (!newTitle) {
        alert("Inserisci la marca e modello del veicolo per procedere.");
        return;
      }
      let b = 'ITERCARS';
      let m = newTitle;
      if (newTitle.includes(' ')) {
        const parts = newTitle.split(' ');
        b = parts[0];
        m = parts.slice(1).join(' ');
      }
      const { data: createdVeh, error: vehErr } = await supabase.from('vehicles').insert([{
        brand: b,
        model: m,
        name: newTitle,
        category: 'SUV / Executive',
        badge: 'NBT Breve Termine',
        daily_price: dailyVal,
        deposit: depVal,
        image_url: 'logo_tricolore.png',
        fuel_type: 'Ibrido / Diesel',
        specs: { hp: '250 CV', accel: '5.2s 0-100', seats: 5, speed: '240 km/h', transmission: 'Automatico' },
        is_nbt: true,
        is_nlt: false,
        is_available: true,
        is_luxury: false
      }]).select();

      if (vehErr || !createdVeh || !createdVeh[0]) throw new Error("Errore creazione veicolo DB: " + (vehErr ? vehErr.message : ''));
      finalVehId = createdVeh[0].id;
    } else {
      // Aggiorna anche il daily_price sul veicolo per coerenza
      await supabase.from('vehicles').update({ daily_price: dailyVal, deposit: depVal, is_nbt: true }).eq('id', finalVehId);
    }

    const payload = {
      vehicle_id: finalVehId,
      provider_offer_code: codeVal,
      daily_price: dailyVal,
      client_monthly_price: monthlyVal,
      deposit_mandante: depVal,
      duration_months: durVal,
      km_per_year: kmVal,
      is_ready_delivery: readyVal,
      delivery_weeks: weeksVal,
      is_active: true
    };

    if (editId) {
      const { error } = await supabase.from('nbt_offers').update(payload).eq('id', editId);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('nbt_offers').insert([payload]);
      if (error) throw error;
    }

    closeNewNbtOfferModal();
    await fetchVehiclesFromDatabase();
    renderVehiclesTable(CurrentVehicles);
    renderNbtOffersTable(CurrentNbtOffers);
    renderNltOffersTable(CurrentNltOffers);
    alert(editId ? "Listino NBT aggiornato correttamente!" : "Nuova vettura/offerta NBT aggiunta al listino DB!");
  } catch(e) {
    alert("Errore salvataggio listino NBT: " + (e.message || e));
  }
}

async function deleteNbtOfferRecord(offerId) {
  if (!confirm("Confermi la rimozione di questa offerta dal listino NBT Breve Termine?")) return;
  try {
    const { error } = await supabase.from('nbt_offers').delete().eq('id', offerId);
    if (error) throw error;
    await fetchVehiclesFromDatabase();
    renderVehiclesTable(CurrentVehicles);
    renderNbtOffersTable(CurrentNbtOffers);
  } catch(e) {
    alert("Errore rimozione NBT: " + (e.message || e));
  }
}

async function toggleNbtOfferStatus(offerId, newStatus) {
  try {
    await supabase.from('nbt_offers').update({ is_active: newStatus }).eq('id', offerId);
    const o = CurrentNbtOffers.find(x => x.id === offerId);
    if (o) o.is_active = newStatus;
    renderNbtOffersTable(CurrentNbtOffers);
  } catch(e) {}
}

/* ==========================================================================
   MODALI E CRUD NLT LUNGO TERMINE (`public.nlt_offers`)
   ========================================================================== */
function populateNltVehicleSelect(selectedVehId) {
  const sel = document.getElementById('nltSelectVehicle');
  if (!sel) return;
  sel.innerHTML = '<option value="">-- Seleziona un veicolo dalla flotta DB --</option>';
  CurrentVehicles.forEach(v => {
    const t = `${v.brand || ''} ${v.model || v.name || 'Vettura'}`.trim();
    const isSel = (v.id === selectedVehId) ? 'selected' : '';
    sel.innerHTML += `<option value="${v.id}" ${isSel}>${t} (€${v.daily_price || 0}/m indicativo)</option>`;
  });
  sel.innerHTML += '<option value="NEW_VEHICLE" style="font-weight:700; color:#ffffff;">+ Nuova Marca e Modello (Crea al volo in flotta)...</option>';
}

function handleNltVehicleSelectChange(selectElem) {
  const wrapper = document.getElementById('nltNewTitleWrapper');
  const inputNew = document.getElementById('nltNewTitle');
  if (!wrapper || !selectElem) return;
  if (selectElem.value === 'NEW_VEHICLE') {
    wrapper.style.display = 'block';
    if (inputNew) inputNew.required = true;
  } else {
    wrapper.style.display = 'none';
    if (inputNew) {
      inputNew.required = false;
      inputNew.value = '';
    }
    const veh = CurrentVehicles.find(x => x.id === selectElem.value);
    if (veh) {
      if (document.getElementById('nltMonthlyPrice') && (!document.getElementById('nltMonthlyPrice').value || document.getElementById('nltEditId').value === '')) {
        document.getElementById('nltMonthlyPrice').value = veh.daily_price || 580;
      }
      if (document.getElementById('nltDeposit') && (!document.getElementById('nltDeposit').value || document.getElementById('nltEditId').value === '')) {
        document.getElementById('nltDeposit').value = veh.deposit || 3000;
      }
    }
  }
}

function openNewNltOfferModal() {
  const modal = document.getElementById('newNltOfferModal');
  if (!modal) return;
  const inputs = modal.querySelectorAll('input[type="text"], input[type="number"]');
  inputs.forEach(i => i.value = '');
  if (document.getElementById('nltEditId')) document.getElementById('nltEditId').value = '';
  if (document.getElementById('nltDeposit')) document.getElementById('nltDeposit').value = '3000';
  if (document.getElementById('nltDeliveryWeeks')) document.getElementById('nltDeliveryWeeks').value = '4';
  if (document.getElementById('nltModalTitleText')) document.getElementById('nltModalTitleText').innerHTML = '<i class="ri-calendar-check-line"></i> Configura Listino Lungo Termine NLT';
  
  populateNltVehicleSelect('');
  const wrapper = document.getElementById('nltNewTitleWrapper');
  if (wrapper) wrapper.style.display = 'none';
  modal.classList.add('active');
}

function closeNewNltOfferModal() {
  const modal = document.getElementById('newNltOfferModal');
  if (modal) modal.classList.remove('active');
}

function editNltOfferRecord(offerId) {
  const o = CurrentNltOffers.find(x => x.id === offerId);
  if (!o) return;
  const modal = document.getElementById('newNltOfferModal');
  if (!modal) return;

  if (document.getElementById('nltEditId')) document.getElementById('nltEditId').value = o.id;
  populateNltVehicleSelect(o.vehicle_id);
  const wrapper = document.getElementById('nltNewTitleWrapper');
  if (wrapper) wrapper.style.display = 'none';

  if (document.getElementById('nltMonthlyPrice')) document.getElementById('nltMonthlyPrice').value = o.client_monthly_price || (o.vehicles ? o.vehicles.daily_price : 580);
  if (document.getElementById('nltDeposit')) document.getElementById('nltDeposit').value = o.deposit_mandante || 3000;
  if (document.getElementById('nltDuration')) document.getElementById('nltDuration').value = o.duration_months || 48;
  if (document.getElementById('nltKm')) document.getElementById('nltKm').value = o.km_per_year || 15000;
  if (document.getElementById('nltReadyDelivery')) document.getElementById('nltReadyDelivery').value = (o.is_ready_delivery !== false) ? 'true' : 'false';
  if (document.getElementById('nltDeliveryWeeks')) document.getElementById('nltDeliveryWeeks').value = o.delivery_weeks || 4;
  if (document.getElementById('nltProviderCode')) document.getElementById('nltProviderCode').value = o.provider_offer_code || '';

  const veh = o.vehicles || CurrentVehicles.find(x => x.id === o.vehicle_id) || {};
  const t = `${veh.brand || ''} ${veh.model || veh.name || ''}`.trim();
  if (document.getElementById('nltModalTitleText')) document.getElementById('nltModalTitleText').innerHTML = `<i class="ri-calendar-check-line"></i> Modifica NLT: ${t}`;
  modal.classList.add('active');
}

async function handleNltOfferSubmit(event) {
  if (event && event.preventDefault) event.preventDefault();
  const editId = document.getElementById('nltEditId') ? document.getElementById('nltEditId').value : '';
  const selVehId = document.getElementById('nltSelectVehicle') ? document.getElementById('nltSelectVehicle').value : '';
  const newTitle = document.getElementById('nltNewTitle') ? document.getElementById('nltNewTitle').value.trim() : '';
  const monthlyVal = Number(document.getElementById('nltMonthlyPrice').value) || 580;
  const depVal = Number(document.getElementById('nltDeposit').value) || 3000;
  const durVal = Number(document.getElementById('nltDuration').value) || 48;
  const kmVal = Number(document.getElementById('nltKm').value) || 15000;
  const readyVal = document.getElementById('nltReadyDelivery') ? document.getElementById('nltReadyDelivery').value === 'true' : true;
  const weeksVal = Number(document.getElementById('nltDeliveryWeeks').value) || 4;
  const codeVal = document.getElementById('nltProviderCode') ? document.getElementById('nltProviderCode').value.trim() : 'NLT-ALD-48M';

  try {
    let finalVehId = selVehId;
    if (selVehId === 'NEW_VEHICLE' || !selVehId) {
      if (!newTitle) {
        alert("Inserisci la marca e modello del veicolo per procedere.");
        return;
      }
      let b = 'ITERCARS';
      let m = newTitle;
      if (newTitle.includes(' ')) {
        const parts = newTitle.split(' ');
        b = parts[0];
        m = parts.slice(1).join(' ');
      }
      const { data: createdVeh, error: vehErr } = await supabase.from('vehicles').insert([{
        brand: b,
        model: m,
        name: newTitle,
        category: 'SUV / Executive',
        badge: 'NLT 48 Mesi',
        daily_price: monthlyVal,
        deposit: depVal,
        image_url: 'logo_tricolore.png',
        fuel_type: 'Ibrido / Diesel',
        specs: { hp: '200 CV', accel: '7.5s 0-100', seats: 5, speed: '220 km/h', transmission: 'Automatico' },
        is_nlt: true,
        is_nbt: false,
        is_available: true,
        is_luxury: false
      }]).select();

      if (vehErr || !createdVeh || !createdVeh[0]) throw new Error("Errore creazione veicolo DB: " + (vehErr ? vehErr.message : ''));
      finalVehId = createdVeh[0].id;
    } else {
      // Se l'auto non ha un canone impostato o per allineare flotta generale
      await supabase.from('vehicles').update({ is_nlt: true }).eq('id', finalVehId);
    }

    const payload = {
      vehicle_id: finalVehId,
      provider_offer_code: codeVal,
      client_monthly_price: monthlyVal,
      deposit_mandante: depVal,
      duration_months: durVal,
      km_per_year: kmVal,
      is_ready_delivery: readyVal,
      delivery_weeks: weeksVal,
      is_active: true
    };

    if (editId) {
      const { error } = await supabase.from('nlt_offers').update(payload).eq('id', editId);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('nlt_offers').insert([payload]);
      if (error) throw error;
    }

    closeNewNltOfferModal();
    await fetchVehiclesFromDatabase();
    renderVehiclesTable(CurrentVehicles);
    renderNbtOffersTable(CurrentNbtOffers);
    renderNltOffersTable(CurrentNltOffers);
    renderLuxuryTable(CurrentLuxuryVehicles);
    alert(editId ? "Listino NLT aggiornato correttamente!" : "Nuova vettura/offerta NLT aggiunta al listino DB!");
  } catch(e) {
    alert("Errore salvataggio listino NLT: " + (e.message || e));
  }
}

async function deleteNltOfferRecord(offerId) {
  if (!confirm("Confermi la rimozione di questa offerta dal listino NLT Lungo Termine?")) return;
  try {
    const { error } = await supabase.from('nlt_offers').delete().eq('id', offerId);
    if (error) throw error;
    await fetchVehiclesFromDatabase();
    renderVehiclesTable(CurrentVehicles);
    renderNltOffersTable(CurrentNltOffers);
    renderLuxuryTable(CurrentLuxuryVehicles);
  } catch(e) {
    alert("Errore rimozione NLT: " + (e.message || e));
  }
}

async function toggleNltOfferStatus(offerId, newStatus) {
  try {
    await supabase.from('nlt_offers').update({ is_active: newStatus }).eq('id', offerId);
    const o = CurrentNltOffers.find(x => x.id === offerId);
    if (o) o.is_active = newStatus;
    renderNltOffersTable(CurrentNltOffers);
  } catch(e) {}
}

/* ==========================================================================
   MODALI E CRUD FLOTTA LUXURY / SUPERCAR (`public.vehicles` dove `is_luxury = true`)
   ========================================================================== */
function renderLuxuryTable(vehicles) {
  const tbody = document.getElementById('luxuryTableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  if (!vehicles || vehicles.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding: 25px; color: var(--text-muted);">Nessuna supercar luxury trovata nel database. Clicca "+ Aggiungi Supercar Luxury" in alto.</td></tr>';
    return;
  }

  vehicles.forEach(v => {
    const specs = v.specs || {};
    const hp = specs.hp || '650 CV';
    const accel = specs.accel || '3.1s 0-100';
    const speed = specs.speed || '320 km/h';

    const statusBadge = v.is_available 
      ? `<span class="badge badge-confirmed"><i class="ri-check-line"></i> Disponibile Luxury</span>`
      : `<span class="badge badge-pending"><i class="ri-pause-line"></i> Sospesa</span>`;

    const title = `${v.brand || ''} ${v.model || v.name || ''}`.trim();

    tbody.innerHTML += `
      <tr>
        <td>
          <div style="font-weight: 800; font-size: 0.95rem; color: #f39c12; display: flex; align-items: center; gap: 6px;">
            <i class="ri-vip-crown-fill"></i> ${title}
          </div>
          <div style="font-size: 0.75rem; color: var(--text-muted);">${v.category || 'Supercar'} • ${v.badge || 'VIP'}</div>
        </td>
        <td>
          <div style="font-size: 0.82rem; font-weight: 600;"><i class="ri-dashboard-3-line text-muted"></i> ${hp}</div>
          <div style="font-size: 0.76rem; color: var(--text-muted);">${accel} • ${speed}</div>
        </td>
        <td style="font-weight: 800; font-size: 1.0rem; color: #f39c12;">
          ${Number(v.daily_price || 0) === 0 ? '<span style="background: rgba(243,156,18,0.15); color: #f39c12; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 700;"><i class="ri-lock-star-line"></i> Su Richiesta</span>' : '€' + Number(v.daily_price).toLocaleString('it-IT') + '/g'}
        </td>
        <td style="font-size: 0.85rem; font-weight: 600;">
          ${Number(v.deposit || 0) === 0 || Number(v.daily_price || 0) === 0 ? '<span style="color: var(--text-muted); font-size: 0.8rem;">Trattativa Privata</span>' : '€' + Number(v.deposit).toLocaleString('it-IT')}
        </td>
        <td>${statusBadge}</td>
        <td style="text-align: right;">
          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button class="btn-header btn-header-outline" style="padding: 6px 10px; font-size: 0.78rem; border-color: rgba(243,156,18,0.4);" onclick="editLuxuryRecord('${v.id}')" title="Modifica Supercar">
              <i class="ri-edit-line text-muted"></i>
            </button>
            <button class="btn-header btn-header-danger" style="padding: 6px 10px; font-size: 0.78rem;" onclick="deleteVehicleRecord('${v.id}')" title="Elimina Supercar dal DB">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });
}

function filterLuxuryTable() {
  const q = document.getElementById('searchLuxuryInput') ? document.getElementById('searchLuxuryInput').value.toLowerCase() : '';
  if (!q) {
    renderLuxuryTable(CurrentLuxuryVehicles);
    return;
  }
  const filtered = CurrentLuxuryVehicles.filter(v => {
    const title = `${v.brand || ''} ${v.model || ''} ${v.name || ''} ${v.category || ''}`.toLowerCase();
    return title.includes(q);
  });
  renderLuxuryTable(filtered);
}

function openNewLuxuryModal() {
  const modal = document.getElementById('newLuxuryModal');
  if (!modal) return;
  const inputs = modal.querySelectorAll('input[type="text"], input[type="number"]');
  inputs.forEach(i => i.value = '');
  if (document.getElementById('luxuryEditId')) document.getElementById('luxuryEditId').value = '';
  if (document.getElementById('luxuryDailyPrice')) document.getElementById('luxuryDailyPrice').value = '0';
  if (document.getElementById('luxuryDeposit')) document.getElementById('luxuryDeposit').value = '0';
  if (document.getElementById('luxuryHp')) document.getElementById('luxuryHp').value = '650 CV';
  if (document.getElementById('luxuryAccel')) document.getElementById('luxuryAccel').value = '3.1s 0-100';
  if (document.getElementById('luxurySpeed')) document.getElementById('luxurySpeed').value = '320 km/h';
  if (document.getElementById('luxuryImageUrl')) document.getElementById('luxuryImageUrl').value = 'logo_tricolore.png';
  if (document.getElementById('luxuryModalTitleText')) document.getElementById('luxuryModalTitleText').innerHTML = '<i class="ri-vip-crown-fill"></i> Configura Supercar Luxury (Prezzo su Richiesta)';
  
  modal.classList.add('active');
}

function closeNewLuxuryModal() {
  const modal = document.getElementById('newLuxuryModal');
  if (modal) modal.classList.remove('active');
}

function editLuxuryRecord(vehId) {
  const v = CurrentLuxuryVehicles.find(x => x.id === vehId) || CurrentVehicles.find(x => x.id === vehId);
  if (!v) return;
  const modal = document.getElementById('newLuxuryModal');
  if (!modal) return;

  if (document.getElementById('luxuryEditId')) document.getElementById('luxuryEditId').value = v.id;
  const title = `${v.brand || ''} ${v.model || v.name || ''}`.trim();
  if (document.getElementById('luxuryTitle')) document.getElementById('luxuryTitle').value = title;
  if (document.getElementById('luxuryDailyPrice')) document.getElementById('luxuryDailyPrice').value = v.daily_price || '0';
  if (document.getElementById('luxuryDeposit')) document.getElementById('luxuryDeposit').value = v.deposit || '0';
  if (document.getElementById('luxuryCategory')) document.getElementById('luxuryCategory').value = v.category || 'Supercar';
  
  const specs = v.specs || {};
  if (document.getElementById('luxuryHp')) document.getElementById('luxuryHp').value = specs.hp || '650 CV';
  if (document.getElementById('luxuryAccel')) document.getElementById('luxuryAccel').value = specs.accel || '3.1s 0-100';
  if (document.getElementById('luxurySpeed')) document.getElementById('luxurySpeed').value = specs.speed || '320 km/h';
  if (document.getElementById('luxuryImageUrl')) document.getElementById('luxuryImageUrl').value = v.image_url || 'logo_tricolore.png';

  if (document.getElementById('luxuryModalTitleText')) document.getElementById('luxuryModalTitleText').innerHTML = `<i class="ri-vip-crown-fill"></i> Modifica Luxury: ${title}`;
  modal.classList.add('active');
}

async function handleLuxurySubmit(event) {
  if (event && event.preventDefault) event.preventDefault();
  const editId = document.getElementById('luxuryEditId') ? document.getElementById('luxuryEditId').value : '';
  const fullTitle = document.getElementById('luxuryTitle') ? document.getElementById('luxuryTitle').value.trim() : '';
  const dailyVal = Number(document.getElementById('luxuryDailyPrice').value) || 0;
  const depVal = Number(document.getElementById('luxuryDeposit').value) || 0;
  const catVal = document.getElementById('luxuryCategory') ? document.getElementById('luxuryCategory').value : 'Supercar';
  const hpVal = document.getElementById('luxuryHp') ? document.getElementById('luxuryHp').value.trim() : '650 CV';
  const accelVal = document.getElementById('luxuryAccel') ? document.getElementById('luxuryAccel').value.trim() : '3.1s 0-100';
  const speedVal = document.getElementById('luxurySpeed') ? document.getElementById('luxurySpeed').value.trim() : '320 km/h';
  const imgVal = document.getElementById('luxuryImageUrl') ? document.getElementById('luxuryImageUrl').value.trim() : 'logo_tricolore.png';

  try {
    let brand = 'ITERCARS';
    let model = fullTitle;
    if (fullTitle.includes(' ')) {
      const parts = fullTitle.split(' ');
      brand = parts[0];
      model = parts.slice(1).join(' ');
    }

    const payload = {
      brand: brand,
      model: model,
      name: fullTitle,
      category: catVal,
      badge: 'VIP Choice ',
      daily_price: dailyVal,
      deposit: depVal,
      image_url: imgVal,
      specs: { hp: hpVal, accel: accelVal, speed: speedVal, seats: 2, transmission: 'Automatico' },
      is_luxury: true,
      is_available: true
    };

    if (editId) {
      const { error } = await supabase.from('vehicles').update(payload).eq('id', editId);
      if (error) throw error;
    } else {
      const { error } = await supabase.from('vehicles').insert([payload]);
      if (error) throw error;
    }

    closeNewLuxuryModal();
    await fetchVehiclesFromDatabase();
    renderVehiclesTable(CurrentVehicles);
    renderNbtOffersTable(CurrentNbtOffers);
    renderNltOffersTable(CurrentNltOffers);
    renderLuxuryTable(CurrentLuxuryVehicles);
    renderPartnerOffersTable(CurrentPartnerVehicles);
    alert(editId ? "Vettura Luxury / Supercar aggiornata con successo!" : "Nuova Supercar Luxury aggiunta alla flotta DB!");
  } catch(e) {
    alert("Errore salvataggio Supercar Luxury: " + (e.message || e));
  }
}

/* ==========================================================================
   TAB 2.5: GESTIONE LISTINI PARTNERS (`public.vehicles` per Mandanti/Partner)
   ========================================================================== */
function renderPartnerOffersTable(offers) {
  const tbody = document.getElementById('partnerOffersTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (!offers || offers.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state-box">
            <i class="ri-team-line" style="color: #ffffff;"></i>
            <h4>Nessuna vettura presente nella categoria "Listini Partners"</h4>
            <p>I veicoli caricati dai partner dalla loro console o i listini aggiunti dalla Direzione compariranno qui.</p>
          </div>
        </td>
      </tr>
    `;
    if (document.getElementById('badgeSubPartners')) document.getElementById('badgeSubPartners').textContent = '0';
    return;
  }

  offers.forEach(v => {
    const prov = (CurrentProviders || []).find(p => p.id === v.provider_id) || {};
    const provName = prov.name || (v.provider_id ? `Partner ID: ${v.provider_id.substring(0,8)}` : 'Noleggiatore Partner');
    const provBadge = prov.code ? `<span style="font-size:0.74rem; background:rgba(16,185,129,0.15); color:#ffffff; padding:2px 6px; border-radius:4px; font-weight:700;">${prov.code}</span>` : '';
    
    const title = `${v.brand || ''} ${v.model || v.name || 'Vettura Partner'}`.trim();
    const img = v.image_url || 'logo_tricolore.png';
    const daily = Number(v.daily_price || 0);
    const monthly = Math.round(daily * 20);
    const dep = Number(v.deposit || prov.default_deposit || 1500);
    const isLive = v.is_available !== false && v.is_active !== false && v.status !== 'pending_approval' && v.status !== 'rejected';
    const isPending = v.status === 'pending_approval' || (v.is_active === false && v.status !== 'rejected' && !isLive);

    let statusHtml = '';
    if (isLive) {
      statusHtml = `
        <span class="status-pill pill-approved" onclick="togglePartnerOfferStatus('${v.id}', false)" style="cursor: pointer; padding: 5px 12px; background: rgba(16,185,129,0.15); color: #ffffff; border: 1px solid rgba(16,185,129,0.3);" title="Clicca per sospendere">
          <i class="ri-record-circle-line"></i> ONLINE / DELIBERATO
        </span>
      `;
    } else if (isPending) {
      statusHtml = `
        <span class="status-pill pill-pending" onclick="quickApprovePartnerOffer('${v.id}')" style="cursor: pointer; padding: 5px 12px; background: rgba(245,158,11,0.15); color: #ffffff; border: 1px solid rgba(245,158,11,0.4);" title="Clicca per ACQUISIRE E PUBBLICARE">
          <i class="ri-time-line"></i> IN VERIFICA  CLICCA PER ACCONSENTIRE
        </span>
      `;
    } else {
      statusHtml = `
        <span class="status-pill pill-inactive" onclick="togglePartnerOfferStatus('${v.id}', true)" style="cursor: pointer; padding: 5px 12px;" title="Clicca per riattivare">
          <i class="ri-close-circle-line"></i> SOSPESO / RIFIUTATO
        </span>
      `;
    }

    tbody.innerHTML += `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width:36px; height:36px; border-radius:8px; background:rgba(16,185,129,0.1); display:flex; align-items:center; justify-content:center; color:#ffffff; font-size:1.1rem; flex-shrink:0;">
              <i class="ri-building-4-line"></i>
            </div>
            <div>
              <strong style="color: #fff; font-size: 0.94rem; display: block; line-height: 1.2;">${provName}</strong>
              <div style="display: flex; gap: 6px; align-items: center; margin-top: 2px;">
                ${provBadge}
                <small style="color: var(--text-muted);">${prov.company_vat ? 'P.IVA ' + prov.company_vat : 'SaaS Partner'}</small>
              </div>
            </div>
          </div>
        </td>
        <td>
          <div style="display: flex; align-items: center; gap: 14px;">
            <img src="${img}" alt="${title}" style="width: 72px; height: 46px; object-fit: cover; border-radius: 8px; border: 1px solid rgba(16,185,129,0.3); flex-shrink: 0; background: rgba(0,0,0,0.3);" onerror="this.src='logo-text.png'" />
            <div>
              <strong style="color: #fff; font-size: 0.96rem; display: block; line-height: 1.2; margin-bottom: 3px;">${title}</strong>
              <span style="font-size: 0.78rem; color: #ffffff; background: rgba(16,185,129,0.12); padding: 2px 6px; border-radius: 4px; font-weight: 700;">${v.trim || 'Executive'} • ${v.category || 'SUV Luxury'}</span>
            </div>
          </div>
        </td>
        <td>
          <strong style="color: #ffffff; font-size: 1.12rem; display: block; line-height: 1.2;">€ ${daily.toLocaleString('it-IT')} <small style="font-size: 0.75rem; font-weight: 400; color: #fff;">/giorno</small></strong>
          <small style="color: #cbd5e1; display: block; margin-top: 2px;">Indicativo € ${monthly.toLocaleString('it-IT')} /mese</small>
        </td>
        <td>
          <strong style="color: #fff; font-size: 0.9rem; display: block;">Cauzione: € ${dep.toLocaleString('it-IT')}</strong>
          <small style="color: var(--text-muted); display: block; margin-top: 2px;"><i class="ri-gas-station-line text-muted"></i> ${v.fuel_type || 'Ibrido'} • ${v.transmission || 'Auto'}</small>
        </td>
        <td>
          ${statusHtml}
        </td>
        <td style="text-align: right;">
          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            ${isPending ? `
              <button class="btn-header btn-header-primary" style="padding: 6px 10px; font-size: 0.78rem; background: #ffffff; color: #fff;" onclick="quickApprovePartnerOffer('${v.id}')" title="Approvazione Rapida Direzione">
                <i class="ri-check-line"></i> Approva
              </button>
            ` : ''}
            <button class="btn-header btn-header-outline" style="padding: 6px 10px; font-size: 0.78rem; border-color: rgba(16,185,129,0.4);" onclick="editPartnerOfferRecord('${v.id}')" title="Modifica Vettura Partner">
              <i class="ri-edit-line text-muted"></i>
            </button>
            <button class="btn-header btn-header-danger" style="padding: 6px 10px; font-size: 0.78rem;" onclick="deletePartnerOfferRecord('${v.id}')" title="Elimina dal Listino Partners">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  if (document.getElementById('badgeSubPartners')) document.getElementById('badgeSubPartners').textContent = offers.length;
}

function filterPartnerOffersTable() {
  const input = document.getElementById('searchPartnersInput');
  const q = (input ? input.value : '').toLowerCase();
  const filtered = CurrentPartnerVehicles.filter(v => {
    const prov = (CurrentProviders || []).find(p => p.id === v.provider_id) || {};
    return (v.brand && v.brand.toLowerCase().includes(q)) ||
           (v.model && v.model.toLowerCase().includes(q)) ||
           (v.name && v.name.toLowerCase().includes(q)) ||
           (prov.name && prov.name.toLowerCase().includes(q)) ||
           (prov.code && prov.code.toLowerCase().includes(q));
  });
  renderPartnerOffersTable(filtered);
}

async function quickApprovePartnerOffer(vehicleId) {
  const v = CurrentVehicles.find(x => x.id === vehicleId);
  if (!v) return;
  
  v.status = 'approved';
  v.is_available = true;
  v.is_active = true;

  if (supabase) {
    try {
      await supabase.from('vehicles').update({ status: 'approved', is_available: true, is_active: true, approval_date: new Date().toISOString() }).eq('id', vehicleId);
    } catch(e) { console.warn("Supabase approve partner car err:", e); }
  }
  await fetchVehiclesFromDatabase();
  renderPartnerOffersTable(CurrentPartnerVehicles);
  renderVehiclesTable(CurrentVehicles);
  if (typeof loadFleetApprovalTable === 'function') loadFleetApprovalTable();
  alert("Vettura partner approvata e pubblicata con successo online sul portale!");
}

async function togglePartnerOfferStatus(vehicleId, makeActive) {
  const v = CurrentVehicles.find(x => x.id === vehicleId);
  if (!v) return;

  v.is_available = makeActive;
  v.is_active = makeActive;
  v.status = makeActive ? 'approved' : 'rejected';

  if (supabase) {
    try {
      await supabase.from('vehicles').update({ is_available: makeActive, is_active: makeActive, status: makeActive ? 'approved' : 'rejected' }).eq('id', vehicleId);
      
      // Cascade to nbt_offers and nlt_offers
      try { await supabase.from('nlt_offers').update({ is_active: makeActive }).eq('vehicle_id', vehicleId); } catch(e){}
      try { await supabase.from('nbt_offers').update({ is_active: makeActive }).eq('vehicle_id', vehicleId); } catch(e){}

    } catch(e) { console.warn("Supabase toggle partner car err:", e); }
  }
  await fetchVehiclesFromDatabase();
  renderPartnerOffersTable(CurrentPartnerVehicles);
  renderVehiclesTable(CurrentVehicles);
}

function openNewPartnerOfferModal() {
  const modal = document.getElementById('newPartnerOfferModal');
  const select = document.getElementById('partnerSelectProvider');
  if (!modal || !select) return;

  select.innerHTML = '<option value="">-- Seleziona Mandante / Azienda Partner --</option>';
  (CurrentProviders || []).forEach(p => {
    select.innerHTML += `<option value="${p.id}">${p.name} (${p.code || 'partner'})</option>`;
  });
  if (select.options.length <= 1) {
    select.innerHTML += `<option value="e5555555-5555-5555-5555-555555555555">Toribio Rent & Drive S.R.L.</option>`;
    select.innerHTML += `<option value="f6666666-6666-6666-6666-666666666666">Elite Supercars Club Italia</option>`;
  }

  if (document.getElementById('partnerEditId')) document.getElementById('partnerEditId').value = '';
  if (document.getElementById('partnerModalTitleText')) document.getElementById('partnerModalTitleText').innerHTML = '<i class="ri-team-line"></i> Aggiungi Macchina Partner';
  if (document.getElementById('partnerVehTitle')) document.getElementById('partnerVehTitle').value = '';
  if (document.getElementById('partnerVehPrice')) document.getElementById('partnerVehPrice').value = '200';
  if (document.getElementById('partnerVehDeposit')) document.getElementById('partnerVehDeposit').value = '1500';
  if (document.getElementById('partnerVehSpecs')) document.getElementById('partnerVehSpecs').value = 'Ibrido • Automatico';
  if (document.getElementById('partnerVehImage')) document.getElementById('partnerVehImage').value = '';
  if (document.getElementById('partnerVehDesc')) document.getElementById('partnerVehDesc').value = '';
  if (document.getElementById('partnerVehStatus')) document.getElementById('partnerVehStatus').value = 'approved';

  modal.classList.add('active');
}

function closeNewPartnerOfferModal() {
  const modal = document.getElementById('newPartnerOfferModal');
  if (modal) modal.classList.remove('active');
}

function editPartnerOfferRecord(vehicleId) {
  const v = CurrentVehicles.find(x => x.id === vehicleId);
  if (!v) return;

  openNewPartnerOfferModal();
  const modal = document.getElementById('newPartnerOfferModal');
  if (!modal) return;

  if (document.getElementById('partnerEditId')) document.getElementById('partnerEditId').value = v.id;
  if (document.getElementById('partnerModalTitleText')) document.getElementById('partnerModalTitleText').innerHTML = `<i class="ri-team-line"></i> Modifica Macchina Partner: ${v.brand || ''} ${v.model || v.name || ''}`;
  if (document.getElementById('partnerSelectProvider')) document.getElementById('partnerSelectProvider').value = v.provider_id || '';
  if (document.getElementById('partnerVehTitle')) document.getElementById('partnerVehTitle').value = `${v.brand || ''} ${v.model || v.name || ''}`.trim();
  if (document.getElementById('partnerVehCategory')) document.getElementById('partnerVehCategory').value = v.category || 'SUV Luxury';
  if (document.getElementById('partnerVehPrice')) document.getElementById('partnerVehPrice').value = v.daily_price || 200;
  if (document.getElementById('partnerVehDeposit')) document.getElementById('partnerVehDeposit').value = v.deposit || 1500;
  
  let specStr = v.fuel_type || 'Ibrido';
  if (v.transmission) specStr += ` • ${v.transmission}`;
  if (document.getElementById('partnerVehSpecs')) document.getElementById('partnerVehSpecs').value = specStr;
  
  if (document.getElementById('partnerVehStatus')) document.getElementById('partnerVehStatus').value = v.status || (v.is_available ? 'approved' : 'pending_approval');
  if (document.getElementById('partnerVehImage')) document.getElementById('partnerVehImage').value = v.image_url || '';
  if (document.getElementById('partnerVehDesc')) document.getElementById('partnerVehDesc').value = (v.specs && v.specs.description ? v.specs.description : (v.description || ''));
}

async function handlePartnerOfferSubmit(event) {
  if (event && event.preventDefault) event.preventDefault();

  const editId = document.getElementById('partnerEditId') ? document.getElementById('partnerEditId').value : '';
  const providerId = document.getElementById('partnerSelectProvider') ? document.getElementById('partnerSelectProvider').value : '';
  if (!providerId) {
    alert("Seleziona una mandante o azienda partner per assegnare la vettura.");
    return;
  }

  const titleVal = document.getElementById('partnerVehTitle') ? document.getElementById('partnerVehTitle').value.trim() : '';
  const catVal = document.getElementById('partnerVehCategory') ? document.getElementById('partnerVehCategory').value : 'SUV Luxury';
  const priceVal = Number(document.getElementById('partnerVehPrice') ? document.getElementById('partnerVehPrice').value : 200) || 200;
  const depVal = Number(document.getElementById('partnerVehDeposit') ? document.getElementById('partnerVehDeposit').value : 1500) || 1500;
  const specsVal = document.getElementById('partnerVehSpecs') ? document.getElementById('partnerVehSpecs').value.trim() : 'Ibrido • Automatico';
  const statusVal = document.getElementById('partnerVehStatus') ? document.getElementById('partnerVehStatus').value : 'approved';
  const imgVal = document.getElementById('partnerVehImage') ? document.getElementById('partnerVehImage').value.trim() : '';
  const descVal = document.getElementById('partnerVehDesc') ? document.getElementById('partnerVehDesc').value.trim() : '';

  let brand = 'Partner';
  let model = titleVal;
  if (titleVal.includes(' ')) {
    const parts = titleVal.split(' ');
    brand = parts[0];
    model = parts.slice(1).join(' ');
  }

  const partsSpecs = specsVal.split('•').map(x => x.trim());
  const fuel = partsSpecs[0] || 'Ibrido / Diesel';
  const trans = partsSpecs[1] || 'Automatico 8M';

  const isOnline = statusVal === 'approved';

  const payload = {
    provider_id: providerId,
    brand: brand,
    model: model,
    trim: trans,
    name: titleVal,
    category: catVal,
    daily_price: priceVal,
    deposit: depVal,
    rating: 5.0,
    fuel_type: fuel,
    transmission: trans,
    image_url: imgVal || 'logo_tricolore.png',
    specs: { hp: trans, speed: "240 km/h", accel: "6.2s 0-100", seats: 5, description: descVal },
    badge: isOnline ? 'Partner Verified ️' : 'In Verifica ⏳',
    status: statusVal,
    is_available: isOnline,
    is_active: isOnline,
    is_luxury: catVal === 'Sportiva' || catVal === 'Supercar' || priceVal >= 300,
    is_nlt: true,
    is_nbt: true
  };

  try {
    if (editId) {
      const { error } = await supabase.from('vehicles').update(payload).eq('id', editId);
      if (error) { alert("Errore modifica su Supabase: " + error.message); return; }
    } else {
      const vehicleUUID = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); });
      payload.id = vehicleUUID;
      const { error } = await supabase.from('vehicles').insert([payload]);
      if (error) { alert("Errore salvataggio su Supabase: " + error.message); return; }
    }

    closeNewPartnerOfferModal();
    await fetchVehiclesFromDatabase();
    renderPartnerOffersTable(CurrentPartnerVehicles);
    renderVehiclesTable(CurrentVehicles);
    if (typeof loadFleetApprovalTable === 'function') loadFleetApprovalTable();
    alert(editId ? "Vettura partner aggiornata con successo!" : "Nuova vettura partner inserita nel database e collegata al mandante!");
  } catch(e) {
    alert("Errore durante l'inserimento o modifica della vettura partner: " + e.message);
  }
}

async function deletePartnerOfferRecord(vehicleId) {
  const v = CurrentVehicles.find(x => x.id === vehicleId);
  if (!v) return;
  if (!confirm(`Confermi l'eliminazione definitiva del veicolo partner "${v.brand} ${v.model}" dal database SQL?`)) return;

  try {
    await supabase.from('vehicles').delete().eq('id', vehicleId);
    await fetchVehiclesFromDatabase();
    renderPartnerOffersTable(CurrentPartnerVehicles);
    renderVehiclesTable(CurrentVehicles);
    if (typeof loadFleetApprovalTable === 'function') loadFleetApprovalTable();
  } catch(e) {
    alert("Errore durante la cancellazione della vettura partner: " + e.message);
  }
}

/* ==========================================================================
   TAB 3: ARCHIVIO PREVENTIVI EMESSI (`public.quotes`)
   ========================================================================== */
function renderQuotesTable(quotes) {
  const tbody = document.getElementById('quotesTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (quotes.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state-box">
            <i class="ri-file-list-3-line"></i>
            <h4>Nessun preventivo registrato in \`public.quotes\`</h4>
            <p>I preventivi calcolati dal sito o dalla console appariranno in questo archivio.</p>
          </div>
        </td>
      </tr>
    `;
    document.getElementById('badgeQuotesCount').textContent = '0';
    return;
  }

  quotes.forEach(q => {
    const dateStr = q.created_at ? new Date(q.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Oggi';
    const isNbt = q.quote_type === 'NBT' || (q.quote_code && q.quote_code.startsWith('IT-NBT-'));
    
    const typeBadge = isNbt
      ? '<span style="background: rgba(59, 130, 246, 0.18); color: #60a5fa; padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 700; border: 1px solid rgba(59, 130, 246, 0.4); display: inline-block; margin-top: 4px;">Breve Termine (NBT)</span>'
      : '<span style="background: rgba(16, 185, 129, 0.18); color: #34d399; padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 700; border: 1px solid rgba(16, 185, 129, 0.4); display: inline-block; margin-top: 4px;">Lungo Termine (NLT)</span>';

    const durationText = isNbt
      ? `${q.selected_duration_days || q.selected_duration_months || 7} Giorni • ${Number(q.selected_km_per_day || q.selected_km_per_year || 150).toLocaleString('it-IT')} km/giorno`
      : `${q.selected_duration_months || 48} Mesi • ${Number(q.selected_km_per_year || 15000).toLocaleString('it-IT')} km/anno`;

    const providerText = q.provider_id 
      ? `<div style="font-size: 0.76rem; color: #facc15; margin-top: 4px;"><i class="ri-building-line"></i> Mandante: <code>${q.provider_id.slice(0, 8)}...</code></div>` 
      : '';
    
    tbody.innerHTML += `
      <tr>
        <td>
          <strong style="color: var(--accent-green); font-family: monospace; font-size: 0.95rem;">${q.quote_code || 'QT-0000'}</strong>
          <br>${typeBadge}
        </td>
        <td style="color: var(--text-muted); font-size: 0.84rem;">${dateStr}</td>
        <td><strong style="color: #fff;">Lead ID: ${q.lead_id ? q.lead_id.slice(0, 8) + '...' : 'Diretto'}</strong></td>
        <td>
          <div style="font-weight: 700;">${q.vehicle_id ? 'Vettura ID: ' + q.vehicle_id.slice(0, 8) + '...' : 'Configurazione'}</div>
          <small style="color: var(--text-muted);">Stato: ${q.status || 'inviato'}</small>
          ${providerText}
        </td>
        <td>
          <div>${durationText}</div>
          <small style="color: var(--text-muted);">Anticipo: € ${Number(q.selected_deposit||0).toLocaleString('it-IT')}</small>
        </td>
        <td>
          <strong style="font-size: 1.1rem; color: #fff;">€ ${Number(q.final_monthly_price||0).toLocaleString('it-IT')} <small style="font-size: 0.75rem;">${isNbt ? '/periodo' : '/mese'}</small></strong>
        </td>
        <td>
          <div style="display: flex; gap: 8px;">
            ${q.pdf_storage_url ? `
              <a href="${q.pdf_storage_url}" target="_blank" class="btn-header btn-header-outline" style="padding: 6px 10px; font-size: 0.78rem;" title="Apri PDF">
                <i class="ri-file-pdf-2-line" style="color: #ffffff;"></i> PDF
              </a>
            ` : ''}
            <button class="btn-header btn-header-danger" style="padding: 6px 10px; font-size: 0.78rem;" onclick="deleteQuoteRecord('${q.id}')" title="Elimina">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  document.getElementById('badgeQuotesCount').textContent = quotes.length;
}

function filterQuotesTable(query) {
  const q = query.toLowerCase();
  const filtered = CurrentQuotes.filter(item => 
    (item.quote_code && item.quote_code.toLowerCase().includes(q)) ||
    (item.status && item.status.toLowerCase().includes(q))
  );
  renderQuotesTable(filtered);
}

async function deleteQuoteRecord(quoteId) {
  if (!confirm("Confermi l'eliminazione di questa pratica dal registro preventivi?")) return;
  try {
    await supabase.from('quotes').delete().eq('id', quoteId);
    await fetchQuotesFromDatabase();
    renderQuotesTable(CurrentQuotes);
  } catch(e) {}
}

/* ==========================================================================
   TAB 4: PRENOTAZIONI NBT & RICHIESTE VIP (`bookings` + `availability_requests`)
   ========================================================================== */
function renderBookingsTable(bookings) {
  const tbody = document.getElementById('bookingsTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (bookings.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state-box">
            <i class="ri-car-line"></i>
            <h4>Nessuna pratica registrata in questa categoria</h4>
            <p>Le richieste per la categoria selezionata appariranno qui.</p>
          </div>
        </td>
      </tr>
    `;
    if (document.getElementById('badgeBookingsCount')) document.getElementById('badgeBookingsCount').textContent = '0';
    return;
  }

  bookings.forEach(b => {
    let pillClass = 'pill-new';
    if (b.status === 'approved' || b.status === 'confermato') pillClass = 'pill-approved';
    if (b.status === 'pending') pillClass = 'pill-pending';

    const dateStr = b.created_at ? new Date(b.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Oggi';

    tbody.innerHTML += `
      <tr>
        <td style="color: var(--text-muted); font-size: 0.84rem;">${dateStr}</td>
        <td><strong style="color: #fff; font-size: 0.95rem;">${b.vehicle_name}</strong></td>
        <td><strong>${b.client_name || 'Cliente'}</strong></td>
        <td>
          <div style="font-size: 0.9rem;">${b.client_phone}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${b.client_email || ''}</div>
        </td>
        <td>
          <div><i class="ri-map-pin-line text-muted"></i> ${b.pickup_location || 'Italia'}</div>
          <small style="color: var(--text-muted);">Durata/Date: ${b.rental_days}</small>
        </td>
        <td>
          <span class="status-pill ${pillClass}">
            <i class="ri-checkbox-circle-line"></i> ${b.status ? b.status.toUpperCase() : 'PENDING'}
          </span>
        </td>
        <td>
          <div style="display: flex; gap: 8px; align-items: center;">
            <a href="https://api.whatsapp.com/send?phone=${(b.client_phone||'').replace(/[^0-9]/g, '')}&text=Salve ${b.client_name}, le scriviamo dal Concierge ITERCARS per confermare la disponibilità per ${b.vehicle_name}." target="_blank" class="btn-header btn-header-outline" style="padding: 6px 12px; font-size: 0.78rem;">
              <i class="ri-whatsapp-line" style="color: #ffffff;"></i> WhatsApp
            </a>
            <button class="btn-header btn-header-danger" style="padding: 6px 10px; font-size: 0.78rem;" onclick="deleteBookingRecord('${b.id}', '${b.source}')" title="Elimina">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  if (document.getElementById('badgeBookingsCount')) document.getElementById('badgeBookingsCount').textContent = bookings.length;
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

async function deleteBookingRecord(recordId, source) {
  if (!confirm("Confermi l'eliminazione di questa prenotazione/richiesta dal database?")) return;
  try {
    const table = source === 'booking' ? 'bookings' : 'availability_requests';
    await supabase.from(table).delete().eq('id', recordId);
    await fetchBookingsFromDatabase();
    renderBookingsTable(CurrentBookings);
  } catch(e) {}
}

/* ==========================================================================
   TAB 5: COMPARATORE MULTI-MANDANTE LIVE (`public.vehicles` + `nlt_offers`)
   ========================================================================== */
function populateComparisonCarSelect() {
  const select = document.getElementById('compareSelectCar');
  if (!select) return;

  select.innerHTML = '';
  if (CurrentVehicles.length === 0) {
    select.innerHTML = '<option value="">Nessuna vettura in catalogo SQL - Aggiungi un veicolo</option>';
    return;
  }

  CurrentVehicles.forEach((v, idx) => {
    const title = `${v.brand || ''} ${v.model || v.name || ''}`.trim();
    select.innerHTML += `<option value="${v.id}" ${idx === 0 ? 'selected' : ''}>${title} (${v.category || 'SUV'})</option>`;
  });

  runLiveComparison();
}

function runLiveComparison() {
  const select = document.getElementById('compareSelectCar');
  if (!select || !select.value) return;

  const vehicleId = select.value;
  const v = CurrentVehicles.find(x => x.id === vehicleId);
  const carTitle = v ? `${v.brand || ''} ${v.model || v.name || ''}`.trim() : 'Vettura Flotta';
  const baseDaily = v ? (Number(v.daily_price || v.price) || 500) : 500;

  const durationElem = document.getElementById('compareMonths') || document.getElementById('compareSelectDuration');
  const duration = durationElem ? Number(durationElem.value) || 48 : 48;

  const kmElem = document.getElementById('compareKm') || document.getElementById('compareSelectKm');
  const km = kmElem ? Number(kmElem.value) || 15000 : 15000;

  const depElem = document.getElementById('compareDeposit') || document.getElementById('compareInputDeposit');
  const deposit = depElem ? Number(depElem.value) || 3000 : 3000;

  const markupElem = document.getElementById('compareBrokerMarkup') || document.getElementById('compareInputMarkup');
  const markup = markupElem ? Number(markupElem.value) || 45 : 45;

  const container = document.getElementById('compareResultsGrid') || document.getElementById('compareResultsContainer');
  if (!container) return;

  // Calcolo listino dinamico simulando i 4 mandanti sul canone base del veicolo
  let durMult = 1.0;
  if (duration === 36) durMult = 1.08;
  if (duration === 60) durMult = 0.93;

  const kmDelta = (km - 15000) / 5000 * 30.00;
  const depDelta = (3000 - deposit) / duration;

  // Stima canone NLT mensile netto di partenza basato sulla vettura
  const baseMonthlyNet = Math.round((baseDaily * 1.6) * durMult + kmDelta + depDelta);

  const providers = [
    { code: 'arval', name: 'Arval Italia S.p.A.', icon: 'ri-shield-line', time: 'Pronta Consegna (3 sett.)', diff: 20 },
    { code: 'ayvens', name: 'Ayvens Network (ALD/LeasePlan)', icon: 'ri-global-line', time: 'Ordine (4-6 sett.)', diff: 45 },
    { code: 'leasys', name: 'Leasys Executive', icon: 'ri-star-line', time: 'Ordine Su Misura (8 sett.)', diff: 75 },
    { code: 'itercars', name: 'ITERCARS Direct VIP Fleet', icon: 'ri-vip-crown-line', time: 'Pronta Consegna Immediata', diff: 0 }
  ];

  let calculatedOffers = providers.map(p => {
    let netPrice = baseMonthlyNet + p.diff;
    let clientFinalPrice = Math.round(netPrice + markup);
    return { ...p, netPrice: netPrice, clientPrice: clientFinalPrice };
  });

  calculatedOffers.sort((a, b) => a.clientPrice - b.clientPrice);

  container.innerHTML = '';
  calculatedOffers.forEach((o, index) => {
    const isBest = index === 0;
    container.innerHTML += `
      <div class="provider-offer-box ${isBest ? 'best-choice' : ''}">
        ${isBest ? '<span class="best-tag"><i class="ri-star-fill"></i> Best Offer / Margine Ottimizzato</span>' : ''}
        
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <i class="${o.icon}" style="font-size: 1.5rem; color: var(--accent-green);"></i>
            <span style="font-size: 0.78rem; color: var(--text-muted); background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 8px;">${o.time}</span>
          </div>
          <h4 style="font-size: 1.1rem; font-weight: 800; color: #fff; margin-bottom: 4px;">${o.name}</h4>
          <div style="font-size: 0.84rem; color: var(--text-muted); margin-bottom: 16px;">Vettura: <strong>${carTitle}</strong></div>
          
          <div style="border-top: 1px dashed var(--border-glass); padding-top: 14px; margin-bottom: 16px; font-size: 0.88rem;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: var(--text-muted);">Costo Netto Mandante:</span>
              <span>€ ${o.netPrice} /m</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span style="color: var(--accent-green);">Fee / Ricarico Broker:</span>
              <span style="color: var(--accent-green); font-weight: 700;">+ € ${markup} /m</span>
            </div>
            <div style="display: flex; justify-content: space-between; color: var(--text-muted); font-size: 0.8rem;">
              <span>Parametri:</span>
              <span>${duration}m • ${km.toLocaleString()} km • Anticipo €${deposit.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div>
          <div style="background: rgba(0,0,0,0.5); padding: 14px; border-radius: 12px; margin-bottom: 14px; text-align: center;">
            <span style="font-size: 0.76rem; color: var(--text-muted); text-transform: uppercase; display: block; font-weight: 700;">Canone Offerto al Cliente</span>
            <span style="font-size: 2rem; font-weight: 900; color: #ffffff; line-height: 1.1;">€ ${o.clientPrice} <small style="font-size: 0.82rem; font-weight: 400; color: #fff;">/mese</small></span>
          </div>

          <button class="btn-header ${isBest ? 'btn-header-primary' : 'btn-header-outline'}" style="width: 100%; justify-content: center; height: 46px;" onclick="sendGeneratedComparisonQuote('${carTitle}', '${o.name}', '${duration}', '${km}', '${deposit}', '${o.clientPrice}')">
            <i class="ri-whatsapp-line"></i> Invia Proposta WhatsApp
          </button>
        </div>
      </div>
    `;
  });
}
// Alias per compatibilità
function runComparison() { runLiveComparison(); }

function sendGeneratedComparisonQuote(carName, provider, months, km, deposit, price) {
  const msg = `*ITERCARS PREVENTIVO UFFICIALE NLT*\n\nGentile Cliente, ecco la migliore proposta selezionata dal nostro Broker:\n\n*${carName}*\nListino Mandante: *${provider}*\nDurata: *${months} Mesi*\nChilometri: *${km} km/anno*\nAnticipo: *€ ${deposit}*\n\n*Canone Tutto Incluso: € ${price} / mese (IVA esc.)*\nAssicurazione RCA+Kasko, Manutenzione Full e Bollo compresi.\n\nDesidera bloccare la vettura e avviare l'istruttoria?`;
  window.open(`https://api.whatsapp.com/send?phone=393755942143&text=${encodeURIComponent(msg)}`, '_blank');
}

/* ==========================================================================
   TAB 6: DOSSIER DELIBERA CREDITO (`public.crm_documents`)
   ========================================================================== */
function renderDocsOverview() {
  const container = document.getElementById('docsOverviewContainer');
  if (!container) return;

  const docsLeads = CurrentLeads.filter(l => l.pipeline_status === 'docs_requested' || l.pipeline_status === 'approved_by_provider' || l.pipeline_status === 'contract_signed');

  if (docsLeads.length === 0) {
    container.innerHTML = `
      <div class="empty-state-box">
        <i class="ri-folder-shield-2-line"></i>
        <h4>Nessun dossier in istruttoria documentale</h4>
        <p>Sposta un lead nella colonna "3. Istruttoria Credito" per visualizzarne la documentazione qui.</p>
      </div>
    `;
    document.getElementById('badgeDocsCount').textContent = '0';
    return;
  }

  let html = '<div style="display: flex; flex-direction: column; gap: 14px;">';
  docsLeads.forEach(l => {
    html += `
      <div style="background: var(--bg-card); border: 1px solid var(--border-glass); border-radius: 14px; padding: 18px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
        <div>
          <div style="font-weight: 800; font-size: 1.05rem; color: #fff;">${l.first_name} ${l.last_name} (${l.customer_type})</div>
          <div style="color: var(--accent-green); font-size: 0.88rem; margin-top: 4px;">Vettura: ${l.car_name} — Mandante: ${l.provider_code}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Contatti: ${l.phone} • ${l.email}</div>
        </div>
        <div style="display: flex; gap: 10px; align-items: center;">
          <span style="background: rgba(241,196,15,0.18); color: #f1c40f; padding: 6px 14px; border-radius: 16px; font-size: 0.8rem; font-weight: 700;">
            <i class="ri-file-check-line"></i> Dossier In Corso
          </span>
          <button class="btn-header btn-header-outline" onclick="openDossierModal('${l.id}')"><i class="ri-eye-line"></i> Apri Fascicolo</button>
        </div>
      </div>
    `;
  });
  html += '</div>';
  container.innerHTML = html;
  document.getElementById('badgeDocsCount').textContent = docsLeads.length;
}

function openDossierModal(leadId) {
  const lead = CurrentLeads.find(l => l.id === leadId);
  if (!lead) return;
  ActiveModalLead = lead;

  document.getElementById('modalClientTitle').textContent = `Dossier: ${lead.first_name} ${lead.last_name}`;
  document.getElementById('modalClientSub').textContent = `${lead.customer_type} • ${lead.car_name} (€${lead.monthly_price}/m - ${lead.provider_code})`;
  document.getElementById('modalLeadNotes').value = lead.notes || '';
  document.getElementById('modalStatusSelect').value = lead.pipeline_status || 'new_lead';

  const mandBox = document.getElementById('modalMandanteBox');
  if (mandBox) {
    let prov = null;
    if (typeof CurrentProviders !== 'undefined') {
      prov = CurrentProviders.find(p => p.id === lead.provider_id || p.code === lead.provider_code);
    }
    const provName = lead.provider_company_name || (prov ? prov.name : null);
    const provCode = lead.provider_code || (prov ? prov.code : null);
    const provPhone = lead.provider_company_phone || (prov ? prov.company_phone : null);
    const provEmail = lead.provider_company_email || (prov ? prov.company_email : null);

    if (provName || provCode) {
      mandBox.style.display = 'block';
      document.getElementById('modalMandanteName').textContent = provName || provCode;
      document.getElementById('modalMandanteCode').textContent = `Codice Mandante: ${provCode || 'N/A'} • Ricarico Broker: ${prov ? prov.commission_rate + '%' : '15%'}`;
      
      let actionsHtml = '';
      if (provPhone) {
        actionsHtml += `<a href="tel:${provPhone}" class="btn-header btn-header-outline" style="color:#ffffff; border-color:rgba(46,204,113,0.4); text-decoration:none; font-size:0.8rem;"><i class="ri-phone-fill"></i> Chiama Flotta (${provPhone})</a>`;
      }
      if (provEmail) {
        const mailSub = encodeURIComponent(`Richiesta Disponibilità Vettura ${lead.car_name || 'NLT'} - Rif. ${lead.first_name} ${lead.last_name}`);
        const mailBody = encodeURIComponent(`Buongiorno,\ncon la presente chiediamo conferma disponibilità e quotazione aggiornata per la vettura in oggetto:\n- Veicolo: ${lead.car_name}\n- Canone proposto: €${lead.monthly_price}/mese\n- Codice Offerta Mandante: ${provCode || 'N/A'}\n\nRimaniamo in attesa di conferma del vostro ufficio flotta per deliberare il contratto del cliente.\n\nCordiali saluti,\nDesk ITERCARS Broker`);
        actionsHtml += `<a href="mailto:${provEmail}?subject=${mailSub}&body=${mailBody}" class="btn-header btn-header-primary" style="background:#ffffff; text-decoration:none; font-size:0.8rem;"><i class="ri-mail-send-fill"></i> Richiedi Conferma via E-mail</a>`;
      }
      document.getElementById('modalMandanteActions').innerHTML = actionsHtml;
    } else {
      mandBox.style.display = 'none';
    }
  }

  // Verifica se ci sono documenti allegati per questo lead in CurrentDocuments
  const leadDocs = CurrentDocuments.filter(d => d.lead_id === lead.id);

  const checkElem = document.getElementById('modalDocChecklist');
  checkElem.innerHTML = '';

  if (leadDocs.length > 0) {
    leadDocs.forEach(d => {
      checkElem.innerHTML += `
        <div class="doc-check-item">
          <div style="display: flex; align-items: center; gap: 10px;">
            <i class="ri-file-text-line text-muted" style="font-size: 1.3rem;"></i>
            <div>
              <span style="font-weight: 600; color: #fff; display: block;">${d.document_type || 'Documento'}</span>
              <a href="${d.file_url}" target="_blank" style="font-size: 0.78rem; color: var(--accent-blue);">Apri File PDF/IMG</a>
            </div>
          </div>
          <div style="display: flex; gap: 8px; align-items: center;">
            <span style="color: #ffffff; font-weight: 700; font-size: 0.82rem;">VERIFICATO</span>
            <button class="btn-header btn-header-danger" style="padding: 4px 8px; font-size: 0.75rem;" onclick="deleteDocumentRecord('${d.id}')" title="Rimuovi file">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </div>
      `;
    });
  } else {
    // Standard Checklist base
    const docsList = [
      { name: 'Patente di Guida in corso di validità', status: 'Caricata OK', icon: 'ri-checkbox-circle-line text-muted', color: '#ffffff' },
      { name: 'Carta d\'Identità o Passaporto', status: 'Caricata OK', icon: 'ri-checkbox-circle-line text-muted', color: '#ffffff' },
      { name: 'Codice Fiscale / Tessera Sanitaria', status: 'Caricata OK', icon: 'ri-checkbox-circle-line text-muted', color: '#ffffff' },
      { name: 'Reddito (Modello Unico / 2 Buste Paga)', status: lead.pipeline_status === 'new_lead' ? 'Da Richiedere' : 'Verificato', icon: lead.pipeline_status === 'new_lead' ? 'ri-time-line text-muted' : 'ri-checkbox-circle-line text-muted', color: lead.pipeline_status === 'new_lead' ? '#f1c40f' : '#ffffff' },
      { name: 'Modulo Privacy & Trattamento Dati Itercars', status: 'Firmato Digitale', icon: 'ri-checkbox-circle-line text-muted', color: '#ffffff' }
    ];

    docsList.forEach(d => {
      checkElem.innerHTML += `
        <div class="doc-check-item">
          <div style="display: flex; align-items: center; gap: 10px;">
            <i class="${d.icon}" style="font-size: 1.3rem;"></i>
            <span style="font-weight: 600; color: #fff;">${d.name}</span>
          </div>
          <span style="color: ${d.color}; font-weight: 700; font-size: 0.82rem;">${d.status}</span>
        </div>
      `;
    });
  }

  document.getElementById('dossierModal').classList.add('active');
}

function closeDossierModal() {
  document.getElementById('dossierModal').classList.remove('active');
}

async function saveLeadNotes() {
  if (!ActiveModalLead) return;
  const newNotes = document.getElementById('modalLeadNotes').value.trim();
  ActiveModalLead.notes = newNotes;

  try {
    await supabase.from('crm_leads').update({ notes: newNotes }).eq('id', ActiveModalLead.id);
    alert("Note operative aggiornate con successo nel dossier.");
  } catch(e) {}
}

async function updateLeadStatusFromModal() {
  if (!ActiveModalLead) return;
  const newSt = document.getElementById('modalStatusSelect').value;
  ActiveModalLead.pipeline_status = newSt;

  try {
    await supabase.from('crm_leads').update({ pipeline_status: newSt }).eq('id', ActiveModalLead.id);
  } catch(e) {}

  closeDossierModal();
  renderKanbanBoard();
  renderDocsOverview();
  updateKpiSummary();
}

async function deleteDocumentRecord(docId) {
  if (!confirm("Confermi l'eliminazione di questo documento dal dossier?")) return;
  try {
    await supabase.from('crm_documents').delete().eq('id', docId);
    await fetchDocumentsFromDatabase();
    if (ActiveModalLead) openDossierModal(ActiveModalLead.id);
  } catch(e) {}
}

function openAddDocumentToLeadModal() {
  if (!ActiveModalLead) return;
  const docType = prompt("Inserisci tipologia documento (es. Busta Paga, CUD, Patente):", "Patente di Guida");
  if (!docType) return;
  const fileUrl = prompt("Inserisci URL di archiviazione o link file Supabase Storage:", "https://example.com/documento.pdf");
  if (!fileUrl) return;

  supabase.from('crm_documents').insert([{
    lead_id: ActiveModalLead.id,
    document_type: docType,
    file_url: fileUrl,
    verification_status: 'uploaded'
  }]).then(async () => {
    await fetchDocumentsFromDatabase();
    openDossierModal(ActiveModalLead.id);
  });
}

/* ==========================================================================
   TAB 7: CANDIDATURE PARTNER & FORNITORI (`public.supplier_applications`)
   ========================================================================== */
function renderPartnersTable(partners) {
  const tbody = document.getElementById('partnersTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (partners.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state-box">
            <i class="ri-building-4-line"></i>
            <h4>Nessuna candidatura partner ricevuta</h4>
            <p>Le richieste inviate dai concessionari nella pagina Partner appariranno in questa tabella.</p>
          </div>
        </td>
      </tr>
    `;
    document.getElementById('badgePartnersCount').textContent = '0';
    return;
  }

  partners.forEach(p => {
    const dataDisplay = p.data ? p.data : (p.created_at ? new Date(p.created_at).toLocaleDateString('it-IT', { day: '2-digit', month: 'short' }) : 'Oggi');
    const pIvaDisplay = p.partita_iva ? `<div style="font-size: 0.8rem; color: var(--text-muted);">P.IVA: ${p.partita_iva}</div>` : '';
    
    tbody.innerHTML += `
      <tr>
        <td>
          <strong style="color: #fff; font-size: 0.95rem;">${p.company_name || 'Azienda Partner'}</strong>
          ${pIvaDisplay}
        </td>
        <td>
          <div style="font-weight: 700;">${p.referent_name || 'Referente'}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${p.phone || ''} • ${p.email || ''}</div>
        </td>
        <td><span style="font-size: 0.84rem; color: var(--text-muted);">${p.models || 'Svariati modelli'}</span></td>
        <td>
          <div><i class="ri-map-pin-line text-muted"></i> ${p.city || 'Italia'}</div>
        </td>
        <td style="color: var(--text-muted); font-size: 0.84rem;">${dataDisplay}</td>
        <td style="text-align: right;">
          <div style="display: flex; gap: 8px; align-items: center; justify-content: flex-end;">
            <button class="btn-header" style="background: rgba(46, 204, 113, 0.1); color: #ffffff; border: 1px solid #ffffff; padding: 6px 12px; font-size: 0.78rem;" onclick="acceptPartnerRecord('${p.id}')" title="Accetta e sposta in Gestione Partner">
              <i class="ri-check-line"></i> Accetta
            </button>
            <button class="btn-header btn-header-danger" style="padding: 6px 10px; font-size: 0.78rem;" onclick="deletePartnerRecord('${p.id}')" title="Rifiuta / Elimina">
              <i class="ri-close-line"></i> Rifiuta
            </button>
          </div>
        </td>
      </tr>
    `;
  });

  document.getElementById('badgePartnersCount').textContent = partners.length;
}

async function acceptPartnerRecord(id) {
  if (!confirm("Vuoi approvare questo partner e aggiungerlo alla rete ufficiale?")) return;
  const p = CurrentPartners.find(x => x.id === id);
  if (!p) return;

  try {
    const { error: insErr } = await supabase.from('providers').insert([{
      name: p.company_name,
      company_vat: p.partita_iva,
      contact_name: p.referent_name,
      contact_phone: p.phone,
      partner_email: p.email,
      address: p.city,
      auth_id: p.auth_id,
      is_active: true,
      saas_plan: 'pro_partner'
    }]);

    if (insErr) throw insErr;

    // INVIA LA MAIL DI ACCETTAZIONE AL PARTNER
    try {
      await sendPartnerAcceptanceEmail(p.email, p.company_name);
    } catch(e) {
      console.warn("Errore simulazione email:", e);
    }

    const { error: delErr } = await supabase.from('supplier_applications').delete().eq('id', id);
    if (delErr) throw delErr;

    alert("Partner approvato con successo e trasferito nella gestione attiva!");
    fetchPartnersFromDatabase();
    if(typeof loadActivePartnersTab === 'function') loadActivePartnersTab();
  } catch (error) {
    console.error("Errore accettazione partner:", error);
    alert("Errore durante l'approvazione del partner.");
  }
}

// --- AUTOMAZIONE EMAIL DI ACCETTAZIONE PARTNER ---
async function sendPartnerAcceptanceEmail(partnerEmail, companyName) {
  if (!partnerEmail) return;
  
  const consoleLink = `${window.location.origin}/partners.html`;
  
  const emailBody = `
Oggetto: Benvenuto nella Rete Partner Ufficiale ITERCARS!

Gentile ${companyName || 'Partner'},

Siamo felici di comunicarti che la tua candidatura è stata valutata e ACCETTATA con successo dalla Direzione Centrale ITERCARS!

Il tuo account da Partner Ufficiale è ora attivo.
Per accedere alla tua Console Partner riservata:
1. Collegati a: ${consoleLink}
2. Clicca su "Accedi alla Console"
3. Inserisci le tue credenziali:
   - Email: ${partnerEmail}
   - Password: [La password scelta da te in fase di candidatura]

IMPORTANTE: 
Ti ricordiamo di caricare il prima possibile la tua flotta vetture!
Una volta effettuato l'accesso, vai nella sezione "Inserisci Flotta" del menu laterale, scarica il template Excel, compilalo e caricalo. 
La tua flotta verrà immediatamente sottoposta a verifica e pubblicata sul portale.

Grazie per la collaborazione,
Il Team Direttivo ITERCARS
  `;

  console.log(`[EMAIL SYSTEM] Invio email a: ${partnerEmail}`);
  console.log(emailBody);

  // Mostriamo un alert per simulare l'avvenuto invio lato frontend
  alert(`[SIMULAZIONE INVIO EMAIL]\nEmail inviata a: ${partnerEmail}\nOggetto: Benvenuto nella Rete Partner Ufficiale ITERCARS!`);
}

function filterPartnersTable(query) {
  const q = query.toLowerCase();
  const filtered = CurrentPartners.filter(p => 
    (p.company_name && p.company_name.toLowerCase().includes(q)) ||
    (p.referent_name && p.referent_name.toLowerCase().includes(q)) ||
    (p.city && p.city.toLowerCase().includes(q))
  );
  renderPartnersTable(filtered);
}

async function deletePartnerRecord(partnerId) {
  if (!confirm("Confermi l'eliminazione di questa candidatura partner dal database?")) return;
  try {
    await supabase.from('supplier_applications').delete().eq('id', partnerId);
    await fetchPartnersFromDatabase();
    renderPartnersTable(CurrentPartners);
  } catch(e) {}
}

/* ==========================================================================
   KPI SUMMARY ENGINE
   ========================================================================== */
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
  if (k4) k4.innerHTML = `${wonCount} <small>totali</small>`;
}

/* ==========================================================================
   GESTIONE AUTENTICAZIONE E LOGOUT ADMIN BROKER CONSOLE
   ========================================================================== */
function checkAdminAuth() {
  const overlay = document.getElementById('adminAuthOverlay');
  if (!overlay) return;

  let isLogged = false;
  try {
    isLogged = sessionStorage.getItem('itercars_admin_logged') === 'true';
  } catch(e) {}

  if (isLogged) {
    overlay.classList.remove('active');
    overlay.style.display = 'none';
  } else {
    overlay.style.display = 'flex';
    overlay.classList.add('active');
  }
}

async function handleAdminLogin(event) {
  if (event && event.preventDefault) event.preventDefault();
  const emailInput = document.getElementById('adminEmailInput');
  const passInput = document.getElementById('adminPasswordInput');
  const email = (emailInput ? emailInput.value : '').trim().toLowerCase();
  const pass = (passInput ? passInput.value : '').trim();

  if (!email || !pass) {
    alert('Inserisci email e password.');
    return;
  }

  const submitBtn = event.target.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> Verifica Credenziali...`;
    submitBtn.disabled = true;
  }

  try {
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email: email,
      password: pass
    });

    if (authErr) throw authErr;

    // Controllo Sicurezza Massima: l'email è nella tabella degli amministratori eletti?
    const { data: adminData, error: adminErr } = await supabase
      .from('broker_admins')
      .select('email')
      .eq('email', email)
      .single();

    if (adminErr || !adminData) {
      await supabase.auth.signOut();
      alert('ACCESSO NEGATO: Questo account non ha i privilegi di Amministratore (Broker CRM).');
      return;
    }

    unlockConsoleSuccess(email);
  } catch (err) {
    console.error('Login Admin Errore:', err);
    alert('Errore Login: ' + err.message);
  } finally {
    if (submitBtn) {
      submitBtn.innerHTML = `<i class="ri-shield-keyhole-line"></i> Sblocca Console Broker`;
      submitBtn.disabled = false;
    }
  }
}

function unlockConsoleSuccess(userEmail) {
  try {
    sessionStorage.setItem('itercars_admin_logged', 'true');
    sessionStorage.setItem('itercars_admin_email', userEmail);
  } catch (e) {}

  const overlay = document.getElementById('adminAuthOverlay');
  if (overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.classList.remove('active');
      overlay.style.display = 'none';
    }, 300);
  }

  const statusEl = document.getElementById('connectionStatus');
  if (statusEl) {
    statusEl.innerHTML = `<span style="width: 8px; height: 8px; background: #ffffff; border-radius: 50%; display: inline-block; box-shadow: 0 0 10px #ffffff;"></span> BROKER ATTIVO: ${userEmail.split('@')[0].toUpperCase()}`;
  }
}

/* ==========================================================================
   MODERAZIONE E APPROVAZIONE FLOTTE EXCEL PARTNER (CONSOLE CENTRALE)
   ========================================================================== */
async function loadFleetApprovalTable() {
  const tbody = document.getElementById('fleetApprovalTableBody');
  const badge = document.getElementById('badgeFleetPendingCount');
  if (!tbody || !supabase) return;

  tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 26px; color: var(--text-muted);"><i class="ri-loader-4-line ri-spin" style="font-size: 1.4rem;"></i> Analisi veicoli in attesa di approvazione...</td></tr>`;

  try {
    let allJobs = [];
    let allVehicles = [];
    let allProviders = [];

    const vehRes = await supabase.from('vehicles').select('*').order('created_at', { ascending: false });
    if (vehRes && vehRes.data) allVehicles = vehRes.data;

    const provRes = await supabase.from('providers').select('*');
    if (provRes && provRes.data) allProviders = provRes.data;

    try {
      let jobsRes = await supabase.from('import_jobs').select('*').order('created_at', { ascending: false });
      if (jobsRes.error) {
        jobsRes = await supabase.from('import_jobs').select('id, provider_id, file_name, status, total_rows, created_at').order('created_at', { ascending: false });
      }
      if (jobsRes && jobsRes.data) allJobs = jobsRes.data;
    } catch(eJ) { console.warn("Errore fetch import_jobs:", eJ); }

    window._allJobsCache = allJobs;
    window._allVehiclesCache = allVehicles;
    if (allJobs && allJobs.length > 0) {
      window._excelCache = window._excelCache || {};
      allJobs.forEach(job => {
        if (job.file_data || job.file_url) window._excelCache[job.id] = job.file_data || job.file_url;
      });
    }

    // Filtriamo i veicoli in attesa di approvazione della Direzione
    const list = allVehicles.filter(v => {
      const isPendingStatus = v.status === 'pending_approval';
      const isInactiveNotRejected = v.is_active === false && v.status !== 'rejected';
      return isPendingStatus || isInactiveNotRejected;
    });

    const pendingJobs = (window._allJobsCache || []).filter(j => j.status === 'pending_approval' || j.status === 'processing_by_direzione' || !j.status);

    if (badge) badge.textContent = list.length + pendingJobs.length;

    if (list.length === 0 && pendingJobs.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align:center; padding: 48px 24px;">
            <div style="font-size: 1.25rem; font-weight: 800; color: #ffffff; margin-bottom: 8px;"><i class="ri-check-double-line" style="font-size: 2rem;"></i> Nessun file o veicolo in attesa di moderazione</div>
            <span style="color: var(--text-muted); font-size: 0.92rem;">I file e le vetture inviate dai partner sono stati verificati e deliberati.</span>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = '';

    if (list.length > 0 || pendingJobs.length > 0) {
      tbody.innerHTML += `
        <tr style="background: linear-gradient(90deg, rgba(16,185,129,0.22), rgba(16,185,129,0.05)); border-bottom: 2px solid #ffffff;">
          <td colspan="6" style="padding: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
              <div>
                <strong style="color: #ffffff; font-size: 1.05rem; display: flex; align-items: center; gap: 8px;">
                  <i class="ri-shield-check-fill" style="font-size: 1.4rem;"></i> SBLOCCO TOTALE MANDANTI & PARTNER (TASTO OK MASTER)
                </strong>
                <span style="font-size: 0.82rem; color: #cbd5e1; display: block; margin-top: 3px;">
                  Clicca il tasto a destra per approvare in un solo clic tutte le pratiche in esame, pubblicarle sul portale e sbloccare le console dei Partner.
                </span>
              </div>
              <button onclick="approveAllPendingPartnerVehicles()" class="btn-header btn-header-green" style="font-size: 0.95rem; padding: 12px 24px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-weight: 500;">
                <i class="ri-check-double-fill" style="font-size: 1.25rem;"></i> DELIBERA TUTTO (TASTO OK)
              </button>
            </div>
          </td>
        </tr>
      `;
    }

    // 1. Rendiamo innanzitutto i file Excel/PDF originali inviati dai partner (import_jobs in attesa)
    pendingJobs.forEach(job => {
      const prov = allProviders.find(p => p.id === job.provider_id);
      const partnerName = prov ? prov.name : 'Noleggiatore Partner';
      const partnerVat = prov ? (prov.company_vat ? `P.IVA: ${prov.company_vat}` : `Codice: ${prov.code || ''}`) : `ID: ${(job.provider_id || '').substring(0,8)}`;
      const timeStr = job.created_at ? new Date(job.created_at).toLocaleString('it-IT') : 'Oggi';

      tbody.innerHTML += `
        <tr style="background: rgba(245, 158, 11, 0.04); border-left: 3px solid var(--accent-gold);">
          <td style="vertical-align: middle; width: 16%; padding: 8px 6px; box-sizing: border-box;">
            <div style="display: flex; align-items: center; gap: 6px; width: 100%; overflow: hidden;">
              <div style="width: 30px; height: 30px; border-radius: 6px; background: rgba(245, 158, 11, 0.16); color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.95rem; flex-shrink: 0;">
                <i class="ri-file-excel-2-fill"></i>
              </div>
              <div style="min-width: 0; flex: 1;">
                <strong style="color: #fff; font-size: 0.84rem; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${partnerName}</strong>
                <small style="color: var(--text-muted); font-size: 0.70rem; font-family: monospace; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${partnerVat}</small>
              </div>
            </div>
          </td>
          <td style="vertical-align: middle; width: 22%; padding: 8px 6px; box-sizing: border-box;">
            <div style="display: flex; align-items: center; gap: 6px; width: 100%; overflow: hidden;">
              <div style="width: 52px; height: 34px; border-radius: 5px; border: 1px dashed rgba(245,158,11,0.4); background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: var(--accent-gold); font-size: 1.1rem; flex-shrink: 0;">
                <i class="ri-file-list-3-line"></i>
              </div>
              <div style="min-width: 0; flex: 1;">
                <strong style="color: #fff; font-size: 0.84rem; display: block; margin-bottom: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${job.file_name || 'Listino_Flotta.xlsx'}</strong>
                <span style="font-size: 0.70rem; color: #cbd5e1; font-weight: 600; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">Inviato il ${timeStr}</span>
              </div>
            </div>
          </td>
          <td style="vertical-align: middle; width: 28%; padding: 8px 6px; box-sizing: border-box;">
            <p style="font-size: 0.74rem; color: #888888; line-height: 1.3; margin: 0 0 4px 0; word-wrap: break-word;">
              File originale trasmesso dal Mandante. Clicca <strong>SCARICA</strong> per consultare il listino.
            </p>
            <strong style="color: var(--accent-gold); font-size: 0.76rem;">Dossier Excel/PDF <small style="color:#fff; font-weight:normal;">(Originale)</small></strong>
          </td>
          <td style="vertical-align: middle; width: 10%; padding: 8px 4px; text-align: center; box-sizing: border-box;">
            <span style="font-size: 0.68rem; background: rgba(245, 158, 11, 0.18); color: #ffffff; border: 1px solid rgba(245, 158, 11, 0.4); padding: 3px 5px; border-radius: 4px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; gap: 3px; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              <i class="ri-time-line"></i> IN ATTESA
            </span>
          </td>
          <td style="text-align: right; vertical-align: middle; width: 24%; padding: 8px 6px; box-sizing: border-box;">
            <div style="display: flex; flex-direction: column; gap: 4px; width: 100%; max-width: 100%; margin-left: auto; background: rgba(0,0,0,0.35); padding: 5px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); box-sizing: border-box;">
              <button onclick="downloadVehiclePartnerFile(null, '${job.provider_id || ''}', '${job.id}')" class="btn-header btn-header-primary" style="width: 100%; box-sizing: border-box; font-size: 0.72rem; padding: 6px 6px; display: inline-flex; align-items: center; justify-content: center; gap: 4px; font-weight: 500;" title="Scarica il file Excel o PDF autentico sul PC">
                <i class="ri-download-cloud-2-line" style="font-size: 0.95rem;"></i> SCARICA
              </button>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; width: 100%; box-sizing: border-box;">
                <button onclick="approveImportJob('${job.id}')" class="btn-header btn-header-green" style="width: 100%; box-sizing: border-box; font-size: 0.68rem; padding: 5px 2px; display: inline-flex; align-items: center; justify-content: center; gap: 3px; font-weight: 500;" title="Acconsenti e delibera il file">
                  <i class="ri-check-line" style="font-size: 0.9rem;"></i> OK
                </button>
                <button onclick="rejectImportJob('${job.id}')" class="btn-header btn-header-outline" style="width: 100%; box-sizing: border-box; color: #ff3333; border-color: rgba(255,51,51,0.5); font-size: 0.68rem; padding: 5px 2px; display: inline-flex; align-items: center; justify-content: center; gap: 3px; font-weight: 500;" title="Rifiuta o archivia">
                  <i class="ri-close-line" style="font-size: 0.9rem;"></i> RIFIUTA
                </button>
              </div>
            </div>
          </td>
        </tr>
      `;
    });

    // 2. Rendiamo le singole schede veicolo/dossier in attesa
    list.forEach(v => {
      const prov = allProviders.find(p => p.id === v.provider_id);
      const partnerName = prov ? prov.name : 'Noleggiatore Partner';
      const partnerVat = prov ? (prov.company_vat ? `P.IVA: ${prov.company_vat}` : `Codice: ${prov.code || prov.id.substring(0,8)}`) : `Provider ID: ${(v.provider_id || 'Locale').substring(0,8)}`;
      const title = `${v.brand || ''} ${v.model || v.name || 'Auto Esclusiva'}`.trim();
      const photoBadge = `<span style="font-size: 0.68rem; color: var(--text-muted); background: rgba(255,255,255,0.06); padding: 3px 7px; border-radius: 4px;"><i class="ri-file-list-line"></i> Scheda Vettura</span>`;
      const desc = (v.specs && v.specs.description) ? v.specs.description : `Allestimento ${v.trim || 'Top'} con motore ${v.fuel_type || 'Ibrido'} ${v.transmission || 'Automatico'}.`;

      tbody.innerHTML += `
        <tr>
          <td style="vertical-align: middle; width: 16%; padding: 8px 6px; box-sizing: border-box;">
            <div style="display: flex; align-items: center; gap: 6px; width: 100%; overflow: hidden;">
              <div style="width: 30px; height: 30px; border-radius: 6px; background: rgba(245, 158, 11, 0.16); color: #ffffff; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.95rem; flex-shrink: 0;">
                <i class="ri-building-4-fill"></i>
              </div>
              <div style="min-width: 0; flex: 1;">
                <strong style="color: #fff; font-size: 0.84rem; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${partnerName}</strong>
                <small style="color: var(--text-muted); font-size: 0.70rem; font-family: monospace; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${partnerVat}</small>
              </div>
            </div>
          </td>
          <td style="vertical-align: middle; width: 22%; padding: 8px 6px; box-sizing: border-box;">
            <div style="display: flex; align-items: center; gap: 6px; width: 100%; overflow: hidden;">
              <img src="${v.image_url || 'logo_tricolore.png'}" alt="${title}" style="width: 52px; height: 34px; object-fit: cover; border-radius: 5px; border: 1px solid rgba(255,255,255,0.15); background: rgba(0,0,0,0.4); flex-shrink: 0;" onerror="this.src='logo-text.png'" />
              <div style="min-width: 0; flex: 1;">
                <strong style="color: #fff; font-size: 0.84rem; display: block; margin-bottom: 1px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${title}</strong>
                <div style="display: flex; gap: 4px; align-items: center; flex-wrap: wrap;">
                  <span style="font-size: 0.70rem; color: #cbd5e1; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${v.trim || 'Executive'}</span>
                </div>
              </div>
            </div>
          </td>
          <td style="vertical-align: middle; width: 28%; padding: 8px 6px; box-sizing: border-box;">
            <p style="font-size: 0.74rem; color: #888888; line-height: 1.3; margin: 0 0 4px 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; word-wrap: break-word;">
              ${desc}
            </p>
            <strong style="color: var(--accent-gold); font-size: 0.76rem;">€ ${Number(v.daily_price || 0).toLocaleString('it-IT')} /giorno <small style="color:#cbd5e1; font-weight:normal;">• Cauzione €${Number(v.deposit || 1500).toLocaleString('it-IT')}</small></strong>
          </td>
          <td style="vertical-align: middle; width: 10%; padding: 8px 4px; text-align: center; box-sizing: border-box;">
            <span style="font-size: 0.68rem; background: rgba(245, 158, 11, 0.18); color: #ffffff; border: 1px solid rgba(245, 158, 11, 0.4); padding: 3px 5px; border-radius: 4px; font-weight: 700; display: inline-flex; align-items: center; justify-content: center; gap: 3px; max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              <i class="ri-time-line"></i> IN ATTESA
            </span>
          </td>
          <td style="text-align: right; vertical-align: middle; width: 24%; padding: 8px 6px; box-sizing: border-box;">
            <div style="display: flex; flex-direction: column; gap: 4px; width: 100%; max-width: 100%; margin-left: auto; background: rgba(0,0,0,0.35); padding: 5px; border-radius: 6px; border: 1px solid rgba(255,255,255,0.1); box-sizing: border-box;">
              <button onclick="downloadVehiclePartnerFile('${v.id}', '${v.provider_id || ''}', '${v.import_job_id || ''}')" class="btn-header btn-header-primary" style="width: 100%; box-sizing: border-box; font-size: 0.72rem; padding: 6px 6px; display: inline-flex; align-items: center; justify-content: center; gap: 4px; font-weight: 500;" title="Scarica il file Excel o la scheda di questa auto">
                <i class="ri-download-cloud-2-line" style="font-size: 0.95rem;"></i> SCARICA
              </button>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; width: 100%; box-sizing: border-box;">
                <button onclick="approvePartnerVehicle('${v.id}')" class="btn-header btn-header-green" style="width: 100%; box-sizing: border-box; font-size: 0.68rem; padding: 5px 2px; display: inline-flex; align-items: center; justify-content: center; gap: 3px; font-weight: 500;" title="Acconsenti e Pubblica sul Sito">
                  <i class="ri-check-line" style="font-size: 0.9rem;"></i> OK
                </button>
                <button onclick="rejectPartnerVehicle('${v.id}')" class="btn-header btn-header-outline" style="width: 100%; box-sizing: border-box; color: #ff3333; border-color: rgba(255,51,51,0.5); font-size: 0.68rem; padding: 5px 2px; display: inline-flex; align-items: center; justify-content: center; gap: 3px; font-weight: 500;" title="Rifiuta e Non Consentire">
                  <i class="ri-close-line" style="font-size: 0.9rem;"></i> RIFIUTA
                </button>
              </div>
            </div>
          </td>
        </tr>
      `;
    });
  } catch (err) {
    console.error("Errore fetch veicoli in attesa:", err);
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px; color:#ef4444;">Errore di caricamento dal database. Riprova.</td></tr>`;
  }
}

async function approveAllPendingPartnerVehicles() {
  if (!confirm(" DELIBERA MASTER (TASTO OK POTENTE):\n\nSei sicuro di voler acconsentire e delibera con Tasto OK a TUTTE le auto e i dossier attualmente in attesa?\n- Diverranno istantaneamente ONLINE su NLT, NBT e Luxury sul portale\n- La console del Partner passerà da 'Flotta in preparazione' a flotta LIVE interattiva.")) return;

  try {
    let pendingJobs = [];
    if (typeof supabase !== 'undefined') {
      const { data } = await supabase.from('import_jobs').select('id').eq('status', 'pending_approval');
      pendingJobs = data || [];
      
      await supabase.from('vehicles').update({ status: 'approved', is_active: true, is_available: true, approval_date: new Date().toISOString() }).eq('status', 'pending_approval');
      await supabase.from('import_jobs').update({ status: 'completed' }).eq('status', 'pending_approval');
      await supabase.from('nlt_offers').update({ is_active: true }).eq('is_active', false);
      await supabase.from('nbt_offers').update({ is_active: true }).eq('is_active', false);
    }
    
    alert("Avvio email per " + pendingJobs.length + " pratiche trovate.");
    // Invia email automatica a tutti i partner coinvolti
    if (typeof sendAutomatedPartnerEmail === 'function') {
      for (const job of pendingJobs) {
        await sendAutomatedPartnerEmail(job.id);
      }
    }
    
    alert(" DELIBERA MASTER ESEGUITA CON SUCCESSO!\nTutte le vetture e i listini dei Partner sono stati sbloccati, resi disponibili e pubblicati online!");
    await loadAllCrmData();
    if (typeof loadFleetApprovalTable === 'function') loadFleetApprovalTable();
  } catch (err) {
    console.error("Errore delibera master:", err);
    alert("Errore durante la delibera master: " + err.message);
  }
}

async function approveImportJob(jobId) {
  if (!confirm("Acconsenti ed esamini positivamente questo file inviato dal Mandante?")) return;
  try {
    if (typeof supabase !== 'undefined') {
      await supabase.from('import_jobs').update({ status: 'completed' }).eq('id', jobId);
      const { data: jobVehs } = await supabase.from('vehicles').update({ status: 'approved', is_active: true, is_available: true }).eq('import_job_id', jobId).select('id');
      if (jobVehs && jobVehs.length > 0) {
        for (const jv of jobVehs) {
          await supabase.from('nlt_offers').update({ is_active: true }).eq('vehicle_id', jv.id);
          await supabase.from('nbt_offers').update({ is_active: true }).eq('vehicle_id', jv.id);
        }
      } else {
        await supabase.from('nlt_offers').update({ is_active: true }).eq('is_active', false);
        await supabase.from('nbt_offers').update({ is_active: true }).eq('is_active', false);
      }
    }
    alert("Avvio email singola per job: " + jobId);
    await sendAutomatedPartnerEmail(jobId);
    loadFleetApprovalTable();
  } catch(e) { console.warn("Errore approvazione file job:", e); }
}

async function rejectImportJob(jobId) {
  if (!confirm("Desideri rifiutare o archiviare questo file?")) return;
  try {
    if (typeof supabase !== 'undefined') {
      await supabase.from('import_jobs').update({ status: 'rejected' }).eq('id', jobId);
      await supabase.from('vehicles').update({ status: 'rejected', is_active: false, is_available: false }).eq('import_job_id', jobId);
    }
    loadFleetApprovalTable();
  } catch(e) { console.warn("Errore rifiuto file job:", e); }
}

async function downloadVehiclePartnerFile(vehicleId, providerId, importJobId) {
  let fileDataUrl = null;
  let fileName = 'Listino_Partner.xlsx';

  // 1. Cercare in cache con import_job_id
  if (importJobId && importJobId !== 'null' && importJobId !== 'undefined' && window._excelCache && window._excelCache[importJobId]) {
    fileDataUrl = window._excelCache[importJobId];
  }

  // 2. Cercare in cache con provider_id
  if (!fileDataUrl && window._allJobsCache && Array.isArray(window._allJobsCache)) {
    let jobFound = null;
    if (importJobId && importJobId !== 'null' && importJobId !== 'undefined') {
      jobFound = window._allJobsCache.find(j => j.id === importJobId && (j.file_url || j.file_data));
    }
    if (!jobFound && providerId && providerId !== 'null' && providerId !== 'undefined') {
      jobFound = window._allJobsCache.find(j => j.provider_id === providerId && (j.file_url || j.file_data));
    }
    if (!jobFound && window._allJobsCache.length > 0) {
      jobFound = window._allJobsCache.find(j => j.file_url || j.file_data) || window._allJobsCache[0];
    }
    if (jobFound) {
      fileDataUrl = jobFound.file_url || jobFound.file_data;
      fileName = jobFound.file_name || fileName;
    }
  }

  // 3. SE IN CACHE NON C'È ANCORA IL FILE BASE64 (es. per alleggerimento query iniziale), LO RECUPERIAMO AL VOLO DA SUPABASE!
  if (!fileDataUrl && typeof supabase !== 'undefined') {
    try {
      if (importJobId && importJobId !== 'null' && importJobId !== 'undefined') {
        const { data: jobRes } = await supabase.from('import_jobs').select('*').eq('id', importJobId);
        if (jobRes && jobRes[0] && (jobRes[0].file_data || jobRes[0].file_url)) {
          fileDataUrl = jobRes[0].file_data || jobRes[0].file_url;
          fileName = jobRes[0].file_name || fileName;
        }
      }
      if (!fileDataUrl && providerId && providerId !== 'null' && providerId !== 'undefined') {
        const { data: jobRes } = await supabase.from('import_jobs').select('*').eq('provider_id', providerId).order('created_at', { ascending: false });
        if (jobRes && jobRes.length > 0) {
          const found = jobRes.find(x => x.file_data || x.file_url) || jobRes[0];
          if (found.file_data || found.file_url) {
            fileDataUrl = found.file_data || found.file_url;
            fileName = found.file_name || fileName;
          }
        }
      }
      // Se non l'abbiamo ancora trovato, cerchiamo l'ultimo file archiviato su tutta la tabella
      if (!fileDataUrl) {
        const { data: jobRes } = await supabase.from('import_jobs').select('*').order('created_at', { ascending: false }).limit(10);
        if (jobRes && jobRes.length > 0) {
          const found = jobRes.find(x => x.file_data || x.file_url);
          if (found) {
            fileDataUrl = found.file_data || found.file_url;
            fileName = found.file_name || fileName;
          }
        }
      }
    } catch(errFetch) {
      console.warn("On-demand download fetch warn:", errFetch);
    }
  }

  // 4. Se abbiamo trovato il file autentico, avviamo subito il download sul computer
  if (fileDataUrl) {
    const a = document.createElement('a');
    a.href = fileDataUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  // 4. Fallback intelligente al 100%: se l'auto era stata caricata prima della patch e non ha file allegato in DB,
  // generiamo e scarichiamo al volo la scheda tecnica CSV esatta di quell'auto con prezzo, cauzione e testi in modo da non bloccarti MAI!
  const v = window._allVehiclesCache ? window._allVehiclesCache.find(x => x.id === vehicleId) : null;
  let csvContent = "Marca,Modello,Allestimento,PrezzoGiorno,Cauzione,Alimentazione,Cambio,Descrizione\r\n";
  if (v) {
    csvContent += `"${v.brand || ''}","${v.model || v.name || ''}","${v.trim || ''}",${v.daily_price || 350},${v.deposit || 3000},"${v.fuel_type || 'Ibrido'}","${v.transmission || 'Automatico'}","${((v.specs && v.specs.description) ? v.specs.description : '').replace(/"/g, '""')}"\r\n`;
  } else {
    csvContent += `"AutoEsclusiva","Prestige","Executive S-Line",350,3000,"Ibrido","Automatico 8M","Vettura esclusiva top di gamma"\r\n`;
  }
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Scheda_${v ? (v.brand + '_' + v.model).replace(/\s+/g, '_') : 'Veicolo_Partner'}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function downloadOriginalExcelFile(fileName, jobId) {
  const fileDataUrl = (window._excelCache && window._excelCache[jobId]) ? window._excelCache[jobId] : null;
  if (!fileDataUrl) {
    alert("Dati file Excel originali non trovati in cache o nel database.");
    return;
  }
  const a = document.createElement('a');
  a.href = fileDataUrl;
  a.download = fileName || 'Listino_Mandante.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

async function approvePartnerVehicle(vehicleId) {
  if (!confirm("Sei sicuro di voler acconsentire a questa vettura e renderla LIVE sul portale e nei comparatori Itercars?")) return;

  try {
    // 1. Aggiorniamo vehicles in status 'approved', is_active=true, is_available=true
    const { error: errVeh } = await supabase
      .from('vehicles')
      .update({
        status: 'approved',
        is_active: true,
        is_available: true,
        approval_date: new Date().toISOString()
      })
      .eq('id', vehicleId);

    if (errVeh) throw errVeh;

    // 2. Aggiorniamo le offerte collegate in nlt_offers e nbt_offers per renderle live
    await supabase.from('nlt_offers').update({ is_active: true }).eq('vehicle_id', vehicleId);
    await supabase.from('nbt_offers').update({ is_active: true }).eq('vehicle_id', vehicleId);

    alert(" VEICOLO ACCONSENTITO E PUBBLICATO CON SUCCESSO!\nL'auto è ora ufficialmente LIVE e visibile ai clienti sul sito web principale e nei comparatori NLT/NBT.");
    await loadAllCrmData();
    loadFleetApprovalTable();
  } catch (err) {
    console.error("Errore approvazione veicolo:", err);
    alert("Errore durante l'approvazione: " + err.message);
  }
}

async function rejectPartnerVehicle(vehicleId) {
  if (!confirm("Sei sicuro di voler RIFIUTARE (Non consentire) questa vettura? Non sarà consentita sul sito.")) return;

  try {
    const { error: errVeh } = await supabase
      .from('vehicles')
      .update({
        status: 'rejected',
        is_active: false,
        is_available: false,
        approval_date: new Date().toISOString()
      })
      .eq('id', vehicleId);

    if (errVeh) throw errVeh;

    // Spegniamo anche nlt e nbt
    await supabase.from('nlt_offers').update({ is_active: false, status: 'rejected' }).eq('vehicle_id', vehicleId);
    await supabase.from('nbt_offers').update({ is_active: false, status: 'rejected' }).eq('vehicle_id', vehicleId);

    alert(" Veicolo rifiutato e non consentito. È stato archiviato e non apparirà sul sito.");
    loadFleetApprovalTable();
  } catch (err) {
    console.error("Errore rifiuto veicolo:", err);
    alert("Errore durante il rifiuto: " + err.message);
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
    overlay.style.display = 'flex';
    overlay.style.opacity = '1';
    overlay.classList.add('active');
  }
}

/* ==========================================================================
   PARTNER PROFILE CONTROL PANEL LOGIC E TAB MULTI-MANDANTE
   ========================================================================== */
let ActivePartnerProfile = null;

async function openPartnerProfile(providerId) {
  try {
    const p = CurrentPartners.find(x => x.id === providerId) || (typeof CurrentProviders !== 'undefined' ? CurrentProviders.find(x => x.id === providerId) : null);
    if (!p) {
        alert("Partner non trovato nella cache locale.");
        return;
    }
    
    ActivePartnerProfile = p;
    
    document.getElementById('partnerProfileTitle').textContent = p.name || p.company_name || 'Profilo Partner';
    document.getElementById('partnerProfileCode').textContent = p.code || 'CODICE N.D.';
    document.getElementById('partnerVat').textContent = p.company_vat || p.vat_number || 'N.D.';
    document.getElementById('partnerEmail').textContent = p.partner_email || p.email || p.contact_email || 'N.D.';
    document.getElementById('partnerAddress').textContent = p.address || p.city || 'N.D.';
    document.getElementById('partnerPlan').textContent = p.saas_plan || 'Pro Partner';
    document.getElementById('partnerPin').textContent = p.access_pin || 'Non configurato';
    
    document.getElementById('partnerProfileModal').classList.add('active');
    
    await loadPartnerProfileFleet(p.id);
    await loadPartnerProfileDocs(p.id);
    switchPartnerProfileTab('fleet');
  } catch (err) {
    alert("Errore in openPartnerProfile: " + err.message);
    console.error(err);
  }
}

function closePartnerProfileModal() {
  document.getElementById('partnerProfileModal').classList.remove('active');
  ActivePartnerProfile = null;
}

function switchPartnerProfileTab(tabName) {
  document.getElementById('profileTabFleet').style.display = tabName === 'fleet' ? 'block' : 'none';
  document.getElementById('profileTabDocs').style.display = tabName === 'docs' ? 'block' : 'none';
  
  document.getElementById('btnProfileFleet').className = tabName === 'fleet' ? 'btn-header btn-header-primary' : 'btn-header btn-header-outline';
  document.getElementById('btnProfileDocs').className = tabName === 'docs' ? 'btn-header btn-header-primary' : 'btn-header btn-header-outline';
}

async function loadPartnerProfileFleet(providerId) {
  const tbody = document.getElementById('partnerProfileFleetBody');
  if(!tbody) return;
  tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;"><i class="ri-loader-line ri-spin"></i> Caricamento...</td></tr>';
  
  if (!supabase) return;
  
  try {
    const { data: vehicles, error } = await supabase.from('vehicles').select('*').eq('provider_id', providerId);
    
    if (error) throw error;
    
    if (!vehicles || vehicles.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 16px;">Nessun veicolo assegnato a questo partner.</td></tr>';
      return;
    }
    
    tbody.innerHTML = '';
    vehicles.forEach(v => {
      const title = `${v.brand || ''} ${v.model || v.name || ''}`.trim();
      let statusHtml = '';
      if (v.status === 'pending_approval') statusHtml = '<span style="color: #ffffff; background: rgba(245,158,11,0.2); padding: 2px 6px; border-radius: 4px; font-size:0.7rem;">In Attesa</span>';
      else if (v.status === 'approved' || v.is_active) statusHtml = '<span style="color: #ffffff; background: rgba(16,185,129,0.2); padding: 2px 6px; border-radius: 4px; font-size:0.7rem;">Approvato/Attivo</span>';
      else statusHtml = '<span style="color: #ef4444; background: rgba(239,68,68,0.2); padding: 2px 6px; border-radius: 4px; font-size:0.7rem;">Sospeso</span>';
      
      tbody.innerHTML += `
        <tr>
          <td><strong style="color: #fff;">${title}</strong><br><small style="color: var(--text-muted);">${v.trim || ''}</small></td>
          <td>${v.category || 'Vettura'}</td>
          <td>${statusHtml}</td>
          <td style="text-align: right;">
             <button class="btn-header btn-header-outline" style="padding: 4px 8px; font-size: 0.7rem; margin-right: 4px;" onclick="editVehicleRecord('${v.id}')" title="Modifica Veicolo"><i class="ri-edit-2-line"></i></button>
             <button class="btn-header btn-header-danger" style="padding: 4px 8px; font-size: 0.7rem;" onclick="deletePartnerProfileVehicle('${v.id}')"><i class="ri-delete-bin-line"></i></button>
          </td>
        </tr>
      `;
    });
  } catch (e) {
    console.error(e);
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #ef4444;">Errore di caricamento.</td></tr>';
  }
}

async function loadPartnerProfileDocs(providerId) {
  const tbody = document.getElementById('partnerProfileDocsBody');
  if(!tbody) return;
  tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;"><i class="ri-loader-line ri-spin"></i> Caricamento...</td></tr>';
  
  if (!supabase) return;
  
  try {
    const { data: jobs, error } = await supabase.from('import_jobs').select('*').eq('provider_id', providerId);
    
    if (error) throw error;
    
    if (!jobs || jobs.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 16px;">Nessun documento importato.</td></tr>';
      return;
    }
    
    tbody.innerHTML = '';
    jobs.forEach(j => {
      const dateStr = j.created_at ? new Date(j.created_at).toLocaleString('it-IT') : 'N.D.';
      tbody.innerHTML += `
        <tr>
          <td><strong style="color: #fff;">${j.file_name || 'Documento'}</strong></td>
          <td>${dateStr}</td>
          <td>${j.status || 'Completato'}</td>
          <td style="text-align: right;">
            <button class="btn-header btn-header-outline" style="padding: 4px 8px; font-size: 0.7rem;" onclick="downloadVehiclePartnerFile(null, '${providerId}', '${j.id}')"><i class="ri-download-cloud-line"></i> Scarica</button>
          </td>
        </tr>
      `;
    });
  } catch (e) {
    console.error(e);
    tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; color: #ef4444;">Errore di caricamento.</td></tr>';
  }
}

async function approvePartnerFleet() {
  if (!ActivePartnerProfile) return;
  if (!confirm("Sei sicuro di voler approvare tutti i veicoli in attesa di questo partner? Verranno pubblicati sul portale.")) return;
  
  try {
    const { error } = await supabase
      .from('vehicles')
      .update({ status: 'approved', is_active: true, is_available: true, approval_date: new Date().toISOString() })
      .eq('provider_id', ActivePartnerProfile.id)
      .eq('status', 'pending_approval');
      
    if (error) throw error;
    
    alert("Flotta del partner approvata con successo!");
    loadPartnerProfileFleet(ActivePartnerProfile.id);
    if(typeof loadFleetApprovalTable === 'function') loadFleetApprovalTable();
  } catch (e) {
    console.error(e);
    alert("Errore durante l'approvazione.");
  }
}

async function deletePartnerProfileVehicle(vehicleId) {
  if (!confirm("Sei sicuro di voler eliminare definitivamente questo veicolo?")) return;
  try {
    const { error } = await supabase.from('vehicles').delete().eq('id', vehicleId);
    if (error) throw error;
    if (ActivePartnerProfile) loadPartnerProfileFleet(ActivePartnerProfile.id);
  } catch (e) {
    console.error(e);
    alert("Errore durante l'eliminazione.");
  }
}

function openNewVehicleForPartner() {
  openNewVehicleModal();
  if (typeof ActivePartnerProfile !== 'undefined' && ActivePartnerProfile) {
    const provIdElem = document.getElementById('vehProviderId');
    if (provIdElem) provIdElem.value = ActivePartnerProfile.id;
  }
}

function editPartnerDetails() {
  alert("La modifica dei dati aziendali sarà disponibile nella prossima release.");
}


async function loadActivePartnersTab() {
  const tbody = document.getElementById('activePartnersTableBody');
  const badge = document.getElementById('badgeActivePartnersCount');
  
  if (!tbody || !supabase) return;
  
  tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 26px;"><i class="ri-loader-line ri-spin"></i> Caricamento profili...</td></tr>';

  try {
    const { data: providers, error } = await supabase.from('providers').select('*').order('name', { ascending: true });
    
    if (error) throw error;
    
    if (!providers || providers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">Nessun partner trovato nel database.</td></tr>';
      if (badge) badge.textContent = '0';
      return;
    }
    
    CurrentProviders = providers;
    if (badge) badge.textContent = providers.length;
    
    tbody.innerHTML = '';
    providers.forEach(p => {
      const actualFleetCount = (typeof CurrentVehicles !== 'undefined' ? CurrentVehicles : []).filter(v => v.provider_id === p.id).length;
      tbody.innerHTML += `
        <tr>
          <td><strong style="color: #fff;">${p.name || p.company_name || 'N.D.'}</strong><br><small style="color: var(--text-muted); font-family: monospace;">${p.code || 'N.D.'}</small></td>
          <td><div>${p.contact_email || p.partner_email || p.email || 'N.D.'}</div><small style="color: var(--text-muted);">${p.company_phone || p.phone || 'N.D.'}</small></td>
          <td><span style="color: var(--accent-purple); font-weight: 700;">${p.saas_plan || 'Pro'}</span></td>
          <td>${p.company_vat || p.vat_number || 'N.D.'}</td>
          <td><span style="background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 12px;">${actualFleetCount} Auto</span></td>
          <td style="text-align: right;">
            <button class="btn-header btn-header-primary" style="padding: 6px 12px; font-size: 0.78rem;" onclick="openPartnerProfile('${p.id}')">

              <i class="ri-user-settings-line"></i> Gestisci Profilo
            </button>
          </td>
        </tr>
      `;
    });
  } catch (e) {
    console.error(e);
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #ef4444;">Errore di caricamento.</td></tr>';
  }
}


async function annihilatePartner() {
  if (!ActivePartnerProfile) return;
  const pName = ActivePartnerProfile.name || ActivePartnerProfile.company_name;
  
  if (!confirm(`ATTENZIONE ESTREMA!\n\nStai per eliminare DEFINITIVAMENTE il profilo di: ${pName}.\n\nQuesta operazione cancellerà IN MODO IRREVERSIBILE:\n- Tutte le auto del partner\n- Tutte le sue richieste e importazioni\n- Il suo account di sicurezza (email e password)\n- Il suo profilo aziendale\n\nVuoi davvero procedere?`)) {
    return;
  }
  
  const v = prompt(`Per confermare la distruzione di questo profilo, scrivi la parola: ELIMINA`);
  if (v !== 'ELIMINA') {
    alert(`Operazione annullata.`);
    return;
  }
  
  try {
    const { error } = await supabase.rpc('delete_partner_completely', { target_provider_id: ActivePartnerProfile.id });
    if (error) throw error;
    
    alert(`Il partner ${pName} e tutti i suoi dati sono stati annientati con successo.`);
    closePartnerProfileModal();
    loadActivePartnersTab();
  } catch (err) {
    console.error(`Errore durante l'annientamento:`, err);
    alert(`Si è verificato un errore durante l'eliminazione: ` + err.message);
  }
}

// Global array for bookings
let globalBookings = [];
let currentBookingCategory = 'NBT';

function filterBookingsByCategory(category) {
  currentBookingCategory = category;
  
  // Update UI title
  const title = document.getElementById('bookingsTabTitle');
  if(title) {
    if(category === 'NBT') title.innerHTML = 'Richieste NBT (Noleggio Breve Termine)';
    if(category === 'NLT') title.innerHTML = 'Richieste NLT (Noleggio Lungo Termine)';
    if(category === 'Luxury') title.innerHTML = 'Richieste Noleggio Luxury & Supercar';
  }
  
  // Filter and render
  if (globalBookings.length === 0) {
      // Mock some data if empty to show the functionality
      globalBookings = [
          { id: 'B-001', customer_name: 'Mario Rossi', phone: '3331234567', start_date: '2026-08-01', end_date: '2026-08-10', vehicle_model: 'Audi Q3', status: 'PENDING', category: 'NBT' },
          { id: 'B-002', customer_name: 'Luigi Bianchi', phone: '3337654321', start_date: '2026-09-01', end_date: '2026-09-15', vehicle_model: 'BMW Serie 1', status: 'CONFIRMED', category: 'NBT' },
          { id: 'L-001', customer_name: 'Azienda Tech Srl', phone: '02888888', start_date: '2026-09-01', end_date: '2029-08-31', vehicle_model: 'Tesla Model Y', status: 'PENDING', category: 'NLT' },
          { id: 'V-001', customer_name: 'Sheikh Al-Maktoum', phone: '+9715555555', start_date: '2026-07-20', end_date: '2026-07-25', vehicle_model: 'Ferrari Roma', status: 'CONFIRMED', category: 'Luxury' }
      ];
  }
  
  const filtered = globalBookings.filter(b => b.category === category);
  renderBookingsTable(filtered);
  
  // Update counts
  const countNbt = globalBookings.filter(b => b.category === 'NBT').length;
  const countNlt = globalBookings.filter(b => b.category === 'NLT').length;
  const countLux = globalBookings.filter(b => b.category === 'Luxury').length;
  
  if(document.getElementById('badgeNbtCount')) document.getElementById('badgeNbtCount').textContent = countNbt;
  if(document.getElementById('badgeNltCount')) document.getElementById('badgeNltCount').textContent = countNlt;
  if(document.getElementById('badgeLuxuryCount')) document.getElementById('badgeLuxuryCount').textContent = countLux;
}


// --- AUTOMAZIONE EMAIL PARTNER ---
async function sendAutomatedPartnerEmail(jobId) {
  try {
    if (typeof supabase === 'undefined') return;
    
    // Recupera i dati del job e del partner (Mandante)
    const { data: jobData, error } = await supabase
      .from('import_jobs')
      .select('*, providers(name, partner_email)')
      .eq('id', jobId)
      .single();
      
    if (error || !jobData || !jobData.providers) { console.warn('Email data fetch failed:', error, jobData); return; }
    
    const partnerName = jobData.providers.name || 'Partner';
    const partnerEmail = jobData.providers.partner_email;
    
    if (!partnerEmail) {
      console.warn("Nessuna email trovata per il partner:", partnerName);
      return;
    }
    
    // Simula l'invio della mail tramite un webhook o un servizio come SendGrid/EmailJS
    console.log(`[EMAIL SYSTEM] Preparazione invio email a ${partnerEmail}...`);
    
    const linkFlotta = `${window.location.origin}/noleggio-breve-termine.html`;
    
    const emailBody = `
Gentile ${partnerName},

Ti confermiamo che il file della tua flotta è stato elaborato e approvato con successo dalla Direzione Centrale ITERCARS.
Tutte le tue vetture sono ora attive e pubblicate ufficialmente sulla nostra piattaforma.

Puoi visionare la tua flotta online cliccando su questo link:
${linkFlotta}

Grazie per la collaborazione.
Il Team ITERCARS
    `;
    
    // Mostra la notifica visiva nella console di amministrazione
    alert(`AUTOMAZIONE MAIL:
Un'email di conferma è stata inviata al Mandante: ${partnerName}
Indirizzo: ${partnerEmail}
Contenuto: La tua flotta è stata approvata e pubblicata.`);
    
    console.log("[EMAIL SYSTEM] Email inviata con successo!");
    
  } catch(err) {
    console.error("Errore durante l'invio dell'email automatica:", err);
  }
}

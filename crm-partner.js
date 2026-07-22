/* ==========================================================================
   ITERCARS — SAAS PARTNER CRM CONSOLE LOGIC (`crm-partner.js`)
   Engine Multi-Mandante & Noleggiatori per Gestione Flotta e Contratti
   ========================================================================== */

const SUPABASE_URL = 'https://brqayhwdrvgllwwjnyvz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJycWF5aHdkcnZnbGx3d2pueXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NDczMTgsImV4cCI6MjA5ODMyMzMxOH0.NZsHj4B_5ylWCcCXy5NKrkLWXNy-6GV4yg5Cv1keaWk';

var supabase = (typeof window.supabase !== 'undefined' && window.supabase.createClient) 
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

// Global State per il Partner Loggato
var CurrentPartner = null;
var PartnerVehicles = [];
var PartnerBookings = [];
var PartnerImportJobs = [];
var ActiveEditVehicleId = null;

// HD Studio Catalog locale per matching istantaneo sul drag & drop
const CLIENT_STUDIO_CATALOG = {
  "bmw serie 1": "bmw_serie_1_msport.webp",
  "bmw serie 3": "bmw_serie_3_touring.webp",
  "bmw m4": "bmw_m4_competition.webp",
  "bmw x1": "bmw_x1_xline.webp",
  "bmw x3": "bmw_x3_msport.webp",
  "bmw x5": "bmw_x5_msport.webp",
  "audi rs6": "audi_rs6_performance.webp",
  "audi rs3": "audi_rs3.webp",
  "audi q8": "audi_q8_sline.webp",
  "audi a5": "audi_a5_avant.webp",
  "porsche 911": "porsche-911-turbo.webp",
  "porsche macan": "porsche_macan.webp",
  "porsche cayenne": "porsche_cayenne.webp",
  "porsche 718": "porsche_718_spyder.webp",
  "mercedes": "mercedes_g63.webp",
  "maserati levante": "maserati_levante.webp",
  "maserati grecale": "maserati-mc20.webp",
  "ferrari 296": "ferrari-296-gts.webp",
  "ferrari purosangue": "ferrari_purosangue.webp",
  "lamborghini revuelto": "lamborghini-revuelto.webp",
  "lamborghini huracan": "lamborghini-huracan.webp",
  "lamborghini urus": "lamborghini_urus.webp",
  "alfa romeo stelvio": "category-suv.jpg"
};

document.addEventListener('DOMContentLoaded', () => {
  checkPartnerAuth();
  setupDropzoneListeners();
});

/* ==========================================================================
   1. AUTENTICAZIONE E LOGOUT PARTNER
   ========================================================================== */
async function checkPartnerAuth() {
  const saved = localStorage.getItem('itercars_partner_auth');
  const overlay = document.getElementById('partnerAuthOverlay');
  
  if (saved) {
    try {
      CurrentPartner = JSON.parse(saved);
      
      if (supabase && CurrentPartner && CurrentPartner.id) {
        const { data, error } = await supabase
          .from('providers')
          .select('id')
          .eq('id', CurrentPartner.id)
          .eq('is_active', true)
          .single();
          
        if (error || !data) {
          throw new Error("Partner eliminato o disattivato");
        }
      }
      
      if (overlay) overlay.classList.remove('active');
      if (supabase && supabase.auth) {
        try { await supabase.auth.getSession(); } catch(err){}
      }
      await loadPartnerDashboard();
      return;
    } catch(e) {
      localStorage.removeItem('itercars_partner_auth');
      CurrentPartner = null;
    }
  }

  if (overlay) overlay.classList.add('active');
}

async function handlePartnerLogin(event) {
  if (event && event.preventDefault) event.preventDefault();
  
  const emailInput = document.getElementById('partnerEmailInput');
  const passwordInput = document.getElementById('partnerPasswordInput');
  const emailVal = (emailInput ? emailInput.value : '').trim();
  const passwordVal = (passwordInput ? passwordInput.value : '');

  if (!emailVal || !passwordVal) {
    alert("Inserisci Email e Password.");
    return;
  }

  const submitBtn = event.target.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> Accesso in corso...`;
    submitBtn.disabled = true;
  }

  try {
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email: emailVal,
      password: passwordVal
    });

    if (authErr) throw authErr;

    const authId = authData.user.id;

    // Verify if this user is an approved partner in the providers table (using email to prevent lockout if Auth user is recreated)
    const { data: providerData, error: providerErr } = await supabase
      .from('providers')
      .select('*')
      .or(`auth_id.eq.${authId},partner_email.eq.${emailVal},contact_email.eq.${emailVal}`)
      .eq('is_active', true);

    if (providerErr || !providerData || providerData.length === 0) {
      // Not an approved partner
      await supabase.auth.signOut();
      alert("Accesso negato. L'account non risulta associato a un partner attivo. Contatta l'amministrazione.");
      return;
    }

    // Se l'ID auth è cambiato (es. l'utente ha ricreato l'account da Supabase), aggiorniamolo
    if (providerData[0].auth_id !== authId) {
      await supabase.from('providers').update({ auth_id: authId }).eq('id', providerData[0].id);
    }

    CurrentPartner = providerData[0];
    localStorage.setItem('itercars_partner_auth', JSON.stringify(CurrentPartner));
    const overlay = document.getElementById('partnerAuthOverlay');
    if (overlay) overlay.classList.remove('active');
    
    loadPartnerDashboard();
  } catch(e) {
    console.error("Auth error:", e);
    alert("Credenziali errate o errore di connessione.");
  } finally {
    if (submitBtn) {
      submitBtn.innerHTML = `<i class="ri-shield-user-line"></i> Accedi alla Tua Console Flotta`;
      submitBtn.disabled = false;
    }
  }
}

async function partnerLogout() {
  if (confirm("Desideri disconnettere la tua azienda dalla Console Partner?")) {
    await supabase.auth.signOut();
    localStorage.removeItem('itercars_partner_auth');
    CurrentPartner = null;
    window.location.reload();
  }
}
/* ==========================================================================
   2. SWITCH TRA I TABS DELLA CONSOLE PARTNER
   ========================================================================== */
function switchPartnerTab(tabId, btnElem) {
  document.querySelectorAll('.tab-pane').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
  
  const target = document.getElementById(tabId);
  if (target) target.classList.add('active');
  if (btnElem) btnElem.classList.add('active');

  const names = {
    'tab-myfleet': 'La Mia Flotta & Tasti Rapidi',
    'tab-import': 'Caricamento Excel & AI Studio',
    'tab-bookings': 'CRM & Prenotazioni',
    'tab-calendar': 'Calendario Flotta NBT',
    'tab-settings': 'Profilo e Condizioni Aziendali'
  };

  const breadcrumb = document.getElementById('partnerBreadcrumbName');
  if (breadcrumb && names[tabId]) {
    breadcrumb.textContent = names[tabId];
  }

  if (tabId === 'tab-import' && typeof loadPartnerImportsHistory === 'function') {
    loadPartnerImportsHistory();
  }
  
  if (tabId === 'tab-calendar' && typeof renderNbtCalendar === 'function') {
    renderNbtCalendar();
  }
}

/* ==========================================================================
   3. FETCH & RENDER DATI DEL PARTNER
   ========================================================================== */
async function loadPartnerDashboard() {
  if (!CurrentPartner) return;

  // Mostriamo nome, email e logo in sidebar e header
  if (document.getElementById('displayPartnerName')) document.getElementById('displayPartnerName').textContent = CurrentPartner.name || 'Società Partner';
  if (document.getElementById('displayPartnerPlan')) document.getElementById('displayPartnerPlan').textContent = (CurrentPartner.saas_plan || 'Pro Partner').toUpperCase();
  if (document.getElementById('settingCompanyName')) document.getElementById('settingCompanyName').value = CurrentPartner.name || '';
  if (document.getElementById('settingCompanyVat')) document.getElementById('settingCompanyVat').value = CurrentPartner.company_vat || '';
  if (document.getElementById('settingCompanyEmail')) document.getElementById('settingCompanyEmail').value = CurrentPartner.partner_email || CurrentPartner.contact_email || '';
  if (document.getElementById('settingDefaultDeposit')) document.getElementById('settingDefaultDeposit').value = CurrentPartner.default_deposit || '1500';
  if (document.getElementById('settingAddress')) document.getElementById('settingAddress').value = CurrentPartner.address || '';

  await Promise.all([
    fetchPartnerVehicles(),
    fetchPartnerBookings(),
    fetchPartnerImportJobs()
  ]);

  renderPartnerVehiclesTable();
  renderPartnerBookingsKanban();
  updatePartnerKpis();
}


async function fetchPartnerImportJobs() {
  if (!supabase || !CurrentPartner) return;
  try {
    const { data, error } = await supabase
      .from('import_jobs')
      .select('*')
      .eq('provider_id', CurrentPartner.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      PartnerImportJobs = data;
    } else {
      PartnerImportJobs = [];
    }
  } catch(e) {
    PartnerImportJobs = [];
  }
}

async function fetchPartnerVehicles() {
  if (!supabase || !CurrentPartner) return;
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('provider_id', CurrentPartner.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      PartnerVehicles = data;
    } else {
      PartnerVehicles = [];
    }
  } catch(e) {
    console.warn("Errore fetch flotta partner:", e);
    PartnerVehicles = [];
  }
}

async function fetchPartnerBookings() {
  if (!supabase || !CurrentPartner) return;
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('provider_id', CurrentPartner.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      PartnerBookings = data;
    } else {
      PartnerBookings = [];
    }
  } catch(e) {
    console.warn("Errore fetch contratti partner:", e);
    PartnerBookings = [];
  }
}

function updatePartnerKpis() {
  const totalFleet = PartnerVehicles.length;
  const activeFleet = PartnerVehicles.filter(v => v.is_available !== false).length;
  const activeBookings = PartnerBookings.length;
  const estimatedRev = PartnerVehicles.reduce((acc, v) => acc + (Number(v.daily_price) * 12 || 0), 0);

  if (document.getElementById('kpiTotalFleet')) document.getElementById('kpiTotalFleet').textContent = totalFleet;
  if (document.getElementById('kpiActiveFleet')) document.getElementById('kpiActiveFleet').textContent = activeFleet;
  if (document.getElementById('kpiBookingsCount')) document.getElementById('kpiBookingsCount').textContent = activeBookings;
  if (document.getElementById('kpiEstimatedValue')) document.getElementById('kpiEstimatedValue').textContent = `€ ${estimatedRev.toLocaleString('it-IT')}`;

  if (document.getElementById('badgeFleetCount')) document.getElementById('badgeFleetCount').textContent = totalFleet;
  if (document.getElementById('badgeBookingsCount')) document.getElementById('badgeBookingsCount').textContent = activeBookings;
}

/* ==========================================================================
   4. RENDER TABELLA FLOTTA CON TOGGLE SWITCH RAPIDI ( / )
   ========================================================================== */
function renderPartnerVehiclesTable() {
  const tbody = document.getElementById('partnerVehiclesTableBody');
  if (!tbody) return;

  tbody.innerHTML = '';
  
  let pendingJob = null;
  let rejectedJob = null;
  if (typeof PartnerImportJobs !== 'undefined' && Array.isArray(PartnerImportJobs)) {
    pendingJob = PartnerImportJobs.find(j => j.status === 'pending_approval' || j.status === 'processing_by_direzione' || !j.status);
    rejectedJob = PartnerImportJobs.find(j => j.status === 'rejected');
  }

  let bannerHtml = '';
  if (pendingJob) {
    bannerHtml = `
      <tr>
        <td colspan="6" style="padding: 0; border: none;">
          <div class="glass-card" style="margin: 10px 0 24px 0; border: 1px dashed var(--accent-gold); background: rgba(212, 175, 55, 0.05); padding: 22px; border-radius: 0px; display: flex; align-items: center; gap: 18px; text-align: left; cursor: default;">
            <i class="ri-time-line ri-spin" style="font-size: 2.8rem; color: var(--accent-gold); flex-shrink: 0;"></i>
            <div>
              <h4 style="margin: 0; color: var(--accent-gold); font-size: 1.15rem; font-weight: 700;">
                FILE INVIATO CON SUCCESSO
              </h4>
              <p style="margin: 6px 0 0 0; color: #fff; font-size: 0.88rem; line-height: 1.45;">
                In attesa di approvazione da parte della Direzione.
              </p>
            </div>
          </div>
        </td>
      </tr>
    `;
  } else if (rejectedJob) {
    bannerHtml = `
      <tr>
        <td colspan="6" style="padding: 0; border: none;">
          <div class="glass-card" style="margin: 10px 0 24px 0; border: 1px dashed #ef4444; background: rgba(239, 68, 68, 0.05); padding: 22px; border-radius: 0px; display: flex; align-items: center; gap: 18px; text-align: left; cursor: pointer;" onclick="switchPartnerTab('tab-import', document.querySelectorAll('.sidebar-item')[1])">
            <i class="ri-close-circle-line" style="font-size: 2.8rem; color: #ef4444; flex-shrink: 0;"></i>
            <div>
              <h4 style="margin: 0; color: #ef4444; font-size: 1.15rem; font-weight: 700;">
                FILE RIFIUTATO
              </h4>
              <p style="margin: 6px 0 0 0; color: #fff; font-size: 0.88rem; line-height: 1.45;">
                La tua flotta è stata rifiutata dalla Direzione. Clicca qui per ricaricare un nuovo file corretto.
              </p>
            </div>
          </div>
        </td>
      </tr>
    `;
  }

  if (PartnerVehicles.length === 0) {
    if (bannerHtml) {
      tbody.innerHTML = bannerHtml;
    } else {
      tbody.innerHTML = `
        <tr>
          <td colspan="6">
            <div class="upload-dropzone" style="margin: 20px 0; padding: 32px;" onclick="switchPartnerTab('tab-import', document.querySelectorAll('.sidebar-item')[1])">
              <i class="ri-upload-cloud-2-line" style="font-size: 2.4rem;"></i>
              <h4>La tua flotta è vuota</h4>
              <p style="margin-bottom: 0;">Clicca qui per caricare il tuo primo file Excel/CSV.</p>
            </div>
          </td>
        </tr>
      `;
    }
    return;
  }

  tbody.innerHTML = bannerHtml;

  const hasPending = PartnerVehicles.some(v => v.status === 'pending_approval');
  if (hasPending && !pendingJob) {
    const prepBanner = `
      <tr>
        <td colspan="6" style="padding: 0; border: none;">
          <div class="glass-card" style="margin: 10px 0 24px 0; border: 1px dashed var(--border-subtle); background: transparent; padding: 22px; border-radius: 0px; display: flex; align-items: center; gap: 18px; text-align: left;">
            <i class="ri-time-fill" style="font-size: 2.8rem; color: var(--text-muted); flex-shrink: 0;"></i>
            <div>
              <h4 style="margin: 0; color: #fff; font-size: 1.15rem; font-weight: 700; display: flex; align-items: center; gap: 8px;">
                FLOTTA IN PREPARAZIONE
              </h4>
              <p style="margin: 6px 0 0 0; color: var(--text-muted); font-size: 0.88rem; line-height: 1.45;">
                Le vetture sono in fase di calcolo e verifica tecnica.  
                Appena la Direzione sbloccherà le schede dalla Console Centrale, tutte le auto diverranno istantaneamente ONLINE.
              </p>
            </div>
          </div>
        </td>
      </tr>
    `;
    tbody.innerHTML += prepBanner;
  }

  PartnerVehicles.forEach(v => {
    const title = `${v.brand || ''} ${v.model || v.name || 'Auto Flotta'}`.trim();
    const isLive = v.is_available !== false && v.is_active !== false && v.status === 'approved';
    const isPending = v.status === 'pending_approval';
    const isRejected = v.status === 'rejected';
    const photoBadge = `<span style="font-size: 0.68rem; color: var(--text-muted); background: rgba(255,255,255,0.05); padding: 2px 6px; border-radius: 4px;"><i class="ri-file-list-line"></i> Scheda Vettura</span>`;

    let statusHtml = `
      <!-- INTERRUTTORE ISTANTANEO (TOGGLE SWITCH) -->
      <div class="toggle-wrapper" onclick="togglePartnerVehicleStatus('${v.id}', ${!isLive})" title="Clicca per commutare la disponibilità live">
        <div class="toggle-switch ${isLive ? 'active' : ''}">
          <div class="toggle-slider"></div>
        </div>
        <span class="toggle-label ${isLive ? 'available' : 'suspended'}">${isLive ? ' DISPONIBILE' : ' FUORI FLOTTA'}</span>
      </div>
    `;

    if (isPending) {
      statusHtml = `
        <div style="font-size: 0.76rem; color: #ffffff; background: transparent; border: 1px solid transparent; padding: 6px 12px; border-radius: 8px; font-weight: 700; display: inline-flex; align-items: center; gap: 8px; line-height: 1.25;">
          <i class="ri-time-line" style="font-size: 1.15rem;"></i>
          <div>
            <span>IN VERIFICA DIREZIONE</span><br>
            <small style="font-size: 0.68rem; font-weight: 500; color: var(--text-muted);">Inviato alla Console Centrale per OK</small>
          </div>
        </div>
      `;
    } else if (isRejected) {
      statusHtml = `
        <div style="font-size: 0.76rem; color: #ef4444; background: rgba(239, 68, 68, 0.16); border: 1px solid rgba(239, 68, 68, 0.4); padding: 6px 12px; border-radius: 8px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
          <i class="ri-close-circle-line" style="font-size: 1.15rem;"></i>
          <span>NON ACCONSENTITO / RIFIUTATO</span>
        </div>
      `;
    }

    const specsObj = typeof v.specs === 'string' ? JSON.parse(v.specs) : (v.specs || {});
    let delivBadgeHtml = `<span style="display:inline-block; margin-top:6px; font-size: 0.72rem; padding: 2px 6px; border-radius: 4px; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);"><i class="ri-rocket-fill"></i> Pronta Consegna</span>`;
    if (specsObj.delivery_type === 'date' || specsObj.delivery_date) {
      let formattedDate = specsObj.delivery_date;
      try { const p = formattedDate.split('-'); if (p.length === 3) formattedDate = `${p[2]}/${p[1]}/${p[0]}`; } catch(e){}
      delivBadgeHtml = `<span style="display:inline-block; margin-top:6px; font-size: 0.72rem; padding: 2px 6px; border-radius: 4px; background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3);"><i class="ri-calendar-event-line"></i> Dal ${formattedDate}</span>`;
    } else if (specsObj.delivery_type === 'weeks' || (specsObj.delivery_weeks && Number(specsObj.delivery_weeks) > 1) || (v.delivery_weeks && Number(v.delivery_weeks) > 1) || specsObj.is_ready_delivery === false || v.is_ready_delivery === false) {
      const w = specsObj.delivery_weeks || v.delivery_weeks || 4;
      delivBadgeHtml = `<span style="display:inline-block; margin-top:6px; font-size: 0.72rem; padding: 2px 6px; border-radius: 4px; background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3);"><i class="ri-time-line"></i> In ${w} sett.</span>`;
    }

    tbody.innerHTML += `
      <tr>
        <td>
          <div style="display: flex; align-items: center; gap: 14px;">
            <img src="${v.image_url || 'logo_tricolore.png'}" alt="${title}" style="width: 80px; height: 50px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border-subtle); flex-shrink: 0; background: rgba(0,0,0,0.3);" onerror="this.src='logo-text.png'" />
            <div>
              <strong style="color: #fff; font-size: 0.98rem; display: block; line-height: 1.2; margin-bottom: 4px;">${title}</strong>
              <div style="display: flex; gap: 6px; align-items: center;">
                <span style="font-size: 0.78rem; color: var(--text-muted);">${v.trim || 'Executive'}</span>
                ${photoBadge}
              </div>
            </div>
          </div>
        </td>
        <td>
          <div><strong style="color: #e2e8f0; font-size: 0.9rem;"><i class="ri-gas-station-line text-muted"></i> ${v.fuel_type || 'Ibrido'}</strong></div>
          <small style="color: var(--text-muted); display: block; margin-top: 2px;">${v.transmission || 'Automatico 8M'}</small>
        </td>
        <td>
          <strong style="color: var(--accent-gold); font-size: 1.12rem; display: block;">€ ${Number(v.daily_price || 0).toLocaleString('it-IT')} <small style="font-size: 0.75rem; color: #fff;">/giorno</small></strong>
          <small style="color: var(--text-muted); display: block; margin-top: 2px;">Cauzione €${Number(v.deposit || 1500).toLocaleString('it-IT')}</small>
          ${delivBadgeHtml}
        </td>
        <td>
          <span style="background: rgba(255,255,255,0.06); padding: 4px 10px; border-radius: 6px; font-size: 0.76rem; font-weight: 700; color: #cbd5e1;">
            ${v.category || 'SUV Luxury'}
          </span>
        </td>
        <td>
          ${statusHtml}
        </td>
        <td style="text-align: right;">
          <div style="display: flex; gap: 8px; justify-content: flex-end;">
            <button class="btn-header btn-header-outline" style="padding: 6px 10px; font-size: 0.78rem;" onclick="openEditTariffModal('${v.id}')" title="Modifica Tariffa">
              <i class="ri-edit-line text-muted"></i>
            </button>
            ${!isPending ? `
            <button class="btn-header btn-header-danger" style="padding: 6px 10px; font-size: 0.78rem;" onclick="deletePartnerVehicle('${v.id}')" title="Elimina dal CRM e dal Database">
              <i class="ri-delete-bin-line"></i>
            </button>
            ` : ''}
          </div>
        </td>
      </tr>
    `;
  });
}
// TOGGLE SWITCH HANDLER (ZERO LATENZA - OPTIMISTIC UI UPDATE)
async function togglePartnerVehicleStatus(vehicleId, newStatus) {
  const v = PartnerVehicles.find(x => x.id === vehicleId);
  if (!v) return;

  // 1. Optimistic UI update istantaneo per il partner
  v.is_available = newStatus;
  renderPartnerVehiclesTable();
  updatePartnerKpis();

  // 2. Sincronizzazione con il database Supabase
  if (supabase) {
    try {
      const { error } = await supabase
        .from('vehicles')
        .update({ is_available: newStatus, is_active: newStatus })
        .eq('id', vehicleId)
        .eq('provider_id', CurrentPartner.id);
      
      if (error) console.warn("Supabase toggle sync error:", error);
      
      // Cascade to nbt_offers and nlt_offers to hide them from nbt.html and nlt.html
      try { await supabase.from('nlt_offers').update({ is_active: newStatus }).eq('vehicle_id', vehicleId); } catch(e){}
      try { await supabase.from('nbt_offers').update({ is_active: newStatus }).eq('vehicle_id', vehicleId); } catch(e){}

    } catch(e) {
      console.warn("Errore rete toggle status:", e);
    }
  }
}

/* ==========================================================================
   5. DRAG & DROP FILE EXCEL/CSV & AI STUDIO SHOT ENGINE
   ========================================================================== */
function setupDropzoneListeners() {
  const dz = document.getElementById('fleetUploadDropzone');
  const input = document.getElementById('fleetFileInput');
  if (!dz || !input) return;

  dz.addEventListener('dragover', (e) => {
    e.preventDefault();
    dz.classList.add('dragover');
  });

  dz.addEventListener('dragleave', () => {
    dz.classList.remove('dragover');
  });

  dz.addEventListener('drop', (e) => {
    e.preventDefault();
    dz.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      selectPartnerFileForUpload(e.dataTransfer.files[0]);
    }
  });

  input.addEventListener('change', (e) => {
    if (e.target.files && e.target.files.length > 0) {
      selectPartnerFileForUpload(e.target.files[0]);
    }
  });
}

function selectPartnerFileForUpload(file) {
  if (!file) return;
  window._selectedPartnerFile = file;

  const box = document.getElementById('selectedFilePreviewBox');
  const nameDisp = document.getElementById('selectedFileNameDisplay');
  const sizeDisp = document.getElementById('selectedFileSizeDisplay');
  
  if (box && nameDisp && sizeDisp) {
    nameDisp.textContent = file.name;
    sizeDisp.textContent = Math.round(file.size / 1024) + ' KB • Pronto per l\'invio';
    box.style.display = 'block';
  }
}

async function submitSelectedPartnerFile() {
  const file = window._selectedPartnerFile;
  const categoryElem = document.getElementById('fleetUploadCategory');
  const uploadCategory = categoryElem ? categoryElem.value : 'Mista / Da Verificare';
  if (!file) {
    alert("Seleziona prima un file dal tuo computer o trascinalo nel riquadro.");
    return;
  }

  const terminal = document.getElementById('aiStudioLogTerminal');
  const termContent = document.getElementById('aiLogContent');
  if (terminal) terminal.style.display = 'block';
  if (termContent) termContent.innerHTML = '';

  function addLog(msg, type = 'info') {
    if (!termContent) return;
    const time = new Date().toLocaleTimeString('it-IT');
    let icon = '';
    if (type === 'warn') icon = '';
    if (type === 'success') icon = '';
    termContent.innerHTML += `<div class="ai-log-line ${type}"><span>[${time}] ${icon} ${msg}</span></div>`;
    termContent.scrollTop = termContent.scrollHeight;
  }

  addLog(`Preparazione trasmissione del file '${file.name}' (${Math.round(file.size / 1024)} KB)...`, 'info');

  if (!CurrentPartner || !CurrentPartner.id) {
    alert("Errore: devi effettuare l'accesso con le tue credenziali prima di poter inviare un file.");
    return;
  }

  const readerUrl = new FileReader();
  readerUrl.onload = async function(evtUrl) {
    const base64File = evtUrl.target.result;
    const jobId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => { const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); });

    try {
      addLog(`Sincronizzazione anagrafica Mandante ('${CurrentPartner.name}') con Supabase Cloud...`, 'info');
      await supabase.from('providers').upsert([{
        id: CurrentPartner.id,
        name: CurrentPartner.name || 'Mandante Partner',
        code: CurrentPartner.code || 'partner_srl_1',
        company_vat: CurrentPartner.company_vat || 'IT12345670158',
        saas_plan: CurrentPartner.saas_plan || 'pro_partner',
        partner_email: CurrentPartner.partner_email || 'partner@itercars.it'
      }], { onConflict: 'id' });

      addLog(`Invio sicuro del file alla Console Centrale in corso...`, 'info');
      let payload = {
        id: jobId,
        provider_id: CurrentPartner.id,
        file_name: file.name,
        file_data: base64File,
        file_url: base64File,
        status: 'pending_approval',
        total_rows: 0
      };

      let { error: jobErr } = await supabase.from('import_jobs').insert([payload]);

      // Se il database su Supabase non ha la colonna file_url, riproviamo senza file_url (salvando su file_data)
      if (jobErr && jobErr.message && jobErr.message.includes('file_url')) {
        addLog(`Adattamento automatico schema DB (senza colonna file_url)...`, 'info');
        delete payload.file_url;
        const res = await supabase.from('import_jobs').insert([payload]);
        jobErr = res.error;
      }
      // Se il database non ha la colonna file_data, riproviamo senza file_data
      if (jobErr && jobErr.message && jobErr.message.includes('file_data')) {
        addLog(`Adattamento automatico schema DB (senza colonna file_data)...`, 'info');
        delete payload.file_data;
        const res = await supabase.from('import_jobs').insert([payload]);
        jobErr = res.error;
      }
      // Se fallisce per altra colonna o struttura, tentativo minimale di garanzia
      if (jobErr) {
        const minPayload = {
          id: jobId,
          provider_id: CurrentPartner.id,
          file_name: file.name,
          status: 'pending_approval'
        };
        const minRes = await supabase.from('import_jobs').insert([minPayload]);
        if (!minRes.error) {
          jobErr = null;
          try { await supabase.from('import_jobs').update({ file_data: base64File }).eq('id', jobId); } catch(e){}
          try { await supabase.from('import_jobs').update({ file_url: base64File }).eq('id', jobId); } catch(e){}
        } else {
          jobErr = minRes.error;
        }
      }

      if (jobErr) {
        addLog(`Errore di trasmissione su Supabase: ${jobErr.message}`, 'warn');
        alert(`Errore durante l'invio del file: ${jobErr.message}\n\nSuggerimento: Esegui la query SQL in setup_partner_crm.sql sul tuo Supabase per allineare le colonne della tabella import_jobs.`);
      } else {
        addLog(` TRASMISSIONE COMPLETATA! Il file '${file.name}' inviato da '${CurrentPartner.name}' è arrivato alla Console Centrale.`, 'success');
        
        // Ora il backend processa direttamente l'import_job_id, non serve più creare un veicolo fittizio per l'Excel.

        if (typeof loadPartnerImportsHistory === 'function') loadPartnerImportsHistory();

        // Resettiamo il box
        window._selectedPartnerFile = null;
        const box = document.getElementById('selectedFilePreviewBox');
        if (box) box.style.display = 'none';

        setTimeout(() => {
          alert(`TRASMISSIONE COMPLETATA CON SUCCESSO!\n\nIl file della tua flotta ('${file.name}') è stato inviato in approvazione alla Direzione.`);
          // Aggiungiamo un ritardo minimo per assicurarci che l'upload appaia nella history prima dello switch
          setTimeout(async () => {
            if (typeof fetchPartnerImportJobs === 'function') await fetchPartnerImportJobs();
            renderPartnerVehiclesTable();
            switchPartnerTab('tab-myfleet', document.querySelectorAll('.sidebar-item')[0]);
          }, 100);
        }, 300);
      }
    } catch (errSync) {
      addLog(`Errore generale di invio: ${errSync.message || errSync}`, 'warn');
    }
  };
  readerUrl.readAsDataURL(file);
}

async function loadPartnerImportsHistory() {
  const container = document.getElementById('partnerImportsHistoryContainer');
  if (!container) return;
  if (!CurrentPartner || !CurrentPartner.id) {
    container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 16px;">Effettua l'accesso come Partner per visualizzare lo storico delle tue trasmissioni.</div>`;
    return;
  }

  container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 14px;"><i class="ri-loader-4-line ri-spin"></i> Verifica stato elaborazione flotta con la Direzione...</div>`;

  try {
    const { data: jobs, error } = await supabase
      .from('import_jobs')
      .select('*')
      .eq('provider_id', CurrentPartner.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (!jobs || jobs.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 18px; font-size: 0.9rem;">Nessun file o flotta inviata finora. Trascina sopra il tuo file Excel o PDF per avviare la prima presa in carico!</div>`;
      return;
    }

    container.innerHTML = '';
    jobs.forEach(job => {
      const timeStr = job.created_at ? new Date(job.created_at).toLocaleString('it-IT') : 'Oggi';
      const isProcessing = job.status === 'processing_by_direzione' || job.status === 'pending_approval' || !job.status;
      
      const badgeHtml = isProcessing ? `
        <div style="background: transparent; border: 1px solid transparent; color: #ffffff; padding: 6px 12px; border-radius: 8px; font-weight: 800; font-size: 0.78rem; display: flex; align-items: center; gap: 6px;">
          <i class="ri-time-line ri-spin"></i> IN ELABORAZIONE DA PARTE DELLA DIREZIONE
        </div>
      ` : `
        <div style="background: transparent; border: 1px solid transparent; color: #ffffff; padding: 6px 12px; border-radius: 8px; font-weight: 800; font-size: 0.78rem; display: flex; align-items: center; gap: 6px;">
          <i class="ri-check-double-line"></i> ELABORATO E PUBBLICATO SUL PORTALE
        </div>
      `;

      const statusDesc = isProcessing ? 
        `La tua flotta è stata presa in carico. L'ufficio di Direzione sta verificando il listino e il catalogo per la delibera.` : 
        `Vetture verificate e pubblicate con successo. Puoi consultarle nel tab 'La Mia Flotta'.`;

      container.innerHTML += `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 16px 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
          <div style="display: flex; align-items: center; gap: 14px; max-width: 580px;">
            <div style="width: 46px; height: 46px; border-radius: 12px; background: transparent; color: var(--accent-gold); display: flex; align-items: center; justify-content: center; font-size: 1.6rem; flex-shrink: 0;">
              <i class="ri-file-list-3-fill"></i>
            </div>
            <div>
              <div style="font-weight: 800; font-size: 1rem; color: #fff;">${job.file_name || 'Listino_Flotta.xlsx'}</div>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 3px;">Inviato il ${timeStr}</div>
              <div style="font-size: 0.8rem; color: #cbd5e1; margin-top: 6px; font-style: italic;">"${statusDesc}"</div>
            </div>
          </div>
          <div>
            ${badgeHtml}
          </div>
        </div>
      `;
    });
  } catch (err) {
    console.error("Errore fetch storico invii:", err);
    container.innerHTML = `<div style="text-align: center; color: #ef4444; padding: 14px;">Impossibile caricare lo storico in questo momento.</div>`;
  }
}

function processUploadedFleetFile(file) {
  if (!file) return;
  selectPartnerFileForUpload(file);
}

async function parseRowsAndIngestWithAI() {
  // Funzione legacy disabilitata come richiesto dall'utente: non viene eseguita alcuna estrazione né generazione AI.
}

/* ==========================================================================
   6. GESTIONE E RISPOSTA CONTRATTI / PRENOTAZIONI (`public.bookings`)
   ========================================================================== */
function renderPartnerBookingsKanban() {
  const colPending = document.getElementById('kanban-cards-pending');
  const colConfirmed = document.getElementById('kanban-cards-confirmed');
  const colDelivered = document.getElementById('kanban-cards-delivered');
  const colClosed = document.getElementById('kanban-cards-closed');

  if (!colPending || !colConfirmed || !colDelivered || !colClosed) return;

  colPending.innerHTML = '';
  colConfirmed.innerHTML = '';
  colDelivered.innerHTML = '';
  colClosed.innerHTML = '';

  let countPending = 0, countConfirmed = 0, countDelivered = 0, countClosed = 0;

  PartnerBookings.forEach(b => {
    const timeStr = new Date(b.created_at).toLocaleDateString('it-IT');
    const phoneClean = (b.client_phone || '').replace(/[^0-9]/g, '');
    const waLink = `https://api.whatsapp.com/send?phone=${phoneClean}&text=Buongiorno ${b.client_name}, la contatto per la conferma della sua prenotazione per ${b.vehicle_name}.`;

    const cardHtml = `
      <div class="kanban-card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <span style="font-size: 0.72rem; color: var(--text-muted);">#${b.id.substring(0, 8).toUpperCase()}</span>
          <span style="font-size: 0.72rem; color: var(--text-muted);">${timeStr}</span>
        </div>
        
        <div class="kanban-card-title">${b.client_name}</div>
        <div class="kanban-card-subtitle"><i class="ri-roadster-line"></i> ${b.vehicle_name}</div>
        
        <div class="kanban-card-price">€ ${Number(b.total_price || 0).toLocaleString('it-IT')} <span style="font-size:0.75rem; color:var(--text-muted); font-weight:400;">(${b.rental_days || 3} gg)</span></div>
        
        <div class="kanban-card-actions">
          <a href="${waLink}" target="_blank" class="btn-header btn-header-outline" style="justify-content: center; font-size: 0.78rem; padding: 6px;">
            <i class="ri-whatsapp-line" style="color: #25D366;"></i> Contatta
          </a>
          <select onchange="advanceBookingStatus('${b.id}', this.value)" class="admin-input" style="padding: 6px 10px; font-size: 0.76rem;">
            <option value="" disabled selected>Avanza Stato...</option>
            <option value="pending" ${b.status === 'pending' ? 'disabled' : ''}>Riporta In Valutazione</option>
            <option value="confirmed" ${b.status === 'confirmed' ? 'disabled' : ''}>Segna Confermato</option>
            <option value="delivered" ${b.status === 'delivered' ? 'disabled' : ''}>Segna Consegnato</option>
            <option value="closed" ${b.status === 'closed' ? 'disabled' : ''}>Segna Riconsegnato</option>
          </select>
        </div>
      </div>
    `;

    if (b.status === 'confirmed') {
      colConfirmed.innerHTML += cardHtml;
      countConfirmed++;
    } else if (b.status === 'delivered') {
      colDelivered.innerHTML += cardHtml;
      countDelivered++;
    } else if (b.status === 'closed') {
      colClosed.innerHTML += cardHtml;
      countClosed++;
    } else {
      // Default to pending
      colPending.innerHTML += cardHtml;
      countPending++;
    }
  });

  if(document.getElementById('count-pending')) document.getElementById('count-pending').textContent = countPending;
  if(document.getElementById('count-confirmed')) document.getElementById('count-confirmed').textContent = countConfirmed;
  if(document.getElementById('count-delivered')) document.getElementById('count-delivered').textContent = countDelivered;
  if(document.getElementById('count-closed')) document.getElementById('count-closed').textContent = countClosed;
}

async function advanceBookingStatus(bookingId, nextStatus) {
  if (!nextStatus) return;
  const bk = PartnerBookings.find(x => x.id === bookingId);
  if (bk) bk.status = nextStatus;
  renderPartnerBookingsKanban();

  if (supabase) {
    try {
      await supabase.from('bookings').update({ status: nextStatus }).eq('id', bookingId);
      
      // Sincronizza lo stato verso la CRM Admin se la prenotazione è collegata a un lead
      if (bk && bk.external_booking_ref) {
        let mappedLeadStatus = null;
        if (nextStatus === 'confirmed') mappedLeadStatus = 'approved_by_provider';
        else if (nextStatus === 'paid' || nextStatus === 'delivered' || nextStatus === 'closed') mappedLeadStatus = 'contract_signed';
        
        if (mappedLeadStatus) {
          await supabase.from('crm_leads').update({ pipeline_status: mappedLeadStatus }).eq('id', bk.external_booking_ref);
        }
      }
    } catch(e) { console.warn("Errore update booking status:", e); }
  }
}

/* ==========================================================================
   9. MOBILE SIDEBAR LOGIC
   ========================================================================== */
function toggleMobileSidebar() {
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.getElementById('mobileOverlay');
  if (sidebar) {
    sidebar.classList.toggle('open');
  }
  if (overlay) {
    overlay.classList.toggle('active');
  }
}

/* ==========================================================================
   7. MODIFICA TARIFFA VEICOLO MODAL
   ========================================================================== */
function toggleDeliveryFields() {
  const type = document.getElementById('editDeliveryType')?.value;
  const weeksBox = document.getElementById('editDeliveryWeeksBox');
  const dateBox = document.getElementById('editDeliveryDateBox');
  if (weeksBox) weeksBox.style.display = type === 'weeks' ? 'block' : 'none';
  if (dateBox) dateBox.style.display = type === 'date' ? 'block' : 'none';
}

function switchPricingTab(tab) {
  console.log("switchPricingTab called with:", tab);
  const currentInput = document.getElementById('currentPricingTab');
  if (currentInput) currentInput.value = tab;
  
  const btnNbt = document.getElementById('btnNbtTab');
  const btnNlt = document.getElementById('btnNltTab');
  const nbtContainer = document.getElementById('nbtPricingContainer');
  const nltContainer = document.getElementById('nltPricingContainer');
  
  if (!btnNbt || !btnNlt || !nbtContainer || !nltContainer) {
    console.warn("One or more tab elements missing in DOM!");
    return;
  }
  
  if (tab === 'nbt') {
    btnNbt.classList.add('active');
    btnNbt.style.borderColor = 'var(--accent-gold)';
    btnNbt.style.color = 'var(--accent-gold)';
    
    btnNlt.classList.remove('active');
    btnNlt.style.borderColor = 'rgba(255,255,255,0.15)';
    btnNlt.style.color = 'var(--text-muted)';
    
    nbtContainer.style.display = 'block';
    nltContainer.style.display = 'none';
  } else {
    btnNlt.classList.add('active');
    btnNlt.style.borderColor = 'var(--accent-gold)';
    btnNlt.style.color = 'var(--accent-gold)';
    
    btnNbt.classList.remove('active');
    btnNbt.style.borderColor = 'rgba(255,255,255,0.15)';
    btnNbt.style.color = 'var(--text-muted)';
    
    nltContainer.style.display = 'block';
    nbtContainer.style.display = 'none';
  }
}

async function openEditTariffModal(vehicleId) {
  const v = PartnerVehicles.find(x => x.id === vehicleId);
  if (!v) return;
  ActiveEditVehicleId = vehicleId;

  const modal = document.getElementById('editTariffModal');
  if (!modal) return;

  if (document.getElementById('modalVehTitle')) document.getElementById('modalVehTitle').textContent = `${v.brand} ${v.model} (${v.trim || ''})`;
  if (document.getElementById('editDailyPrice')) document.getElementById('editDailyPrice').value = v.daily_price || 150;
  if (document.getElementById('editDeposit')) document.getElementById('editDeposit').value = v.deposit || 1500;
  
  if (document.getElementById('editMonthlyPrice')) document.getElementById('editMonthlyPrice').value = Math.round((v.daily_price || 150) * 15);
  if (document.getElementById('editNltMonths')) document.getElementById('editNltMonths').value = 36;
  if (document.getElementById('editNltAdvance')) document.getElementById('editNltAdvance').value = 0;

  // Try to load NLT offers from DB if available
  if (supabase) {
    try {
      const { data: nltData } = await supabase.from('nlt_offers').select('*').eq('vehicle_id', vehicleId).single();
      if (nltData) {
        if (document.getElementById('editMonthlyPrice') && nltData.client_monthly_price) document.getElementById('editMonthlyPrice').value = nltData.client_monthly_price;
        if (document.getElementById('editNltMonths') && nltData.months) document.getElementById('editNltMonths').value = nltData.months;
        if (document.getElementById('editNltAdvance') && nltData.advance_payment !== undefined) document.getElementById('editNltAdvance').value = nltData.advance_payment;
      }
    } catch(e) {}
  }

  const specsObj = typeof v.specs === 'string' ? JSON.parse(v.specs) : (v.specs || {});
  const delivTypeElem = document.getElementById('editDeliveryType');
  const delivWeeksElem = document.getElementById('editDeliveryWeeks');
  const delivDateElem = document.getElementById('editDeliveryDate');

  if (delivTypeElem && delivWeeksElem && delivDateElem) {
    if (specsObj.delivery_type === 'date' || (specsObj.delivery_date && specsObj.delivery_date !== '')) {
      delivTypeElem.value = 'date';
      delivDateElem.value = specsObj.delivery_date || '';
      delivWeeksElem.value = specsObj.delivery_weeks || 4;
    } else if (specsObj.delivery_type === 'weeks' || (specsObj.delivery_weeks && Number(specsObj.delivery_weeks) > 1) || (v.delivery_weeks && Number(v.delivery_weeks) > 1) || specsObj.is_ready_delivery === false || v.is_ready_delivery === false) {
      delivTypeElem.value = 'weeks';
      delivWeeksElem.value = specsObj.delivery_weeks || v.delivery_weeks || 4;
      delivDateElem.value = specsObj.delivery_date || '';
    } else {
      delivTypeElem.value = 'ready';
      delivWeeksElem.value = 1;
      delivDateElem.value = '';
    }
    toggleDeliveryFields();
  }

  switchPricingTab('nbt'); // Default tab
  modal.classList.add('active');
}

function closeEditTariffModal() {
  const modal = document.getElementById('editTariffModal');
  if (modal) modal.classList.remove('active');
  ActiveEditVehicleId = null;
}

async function saveTariffChanges(event) {
  if (event && event.preventDefault) event.preventDefault();
  if (!ActiveEditVehicleId) return;

  const v = PartnerVehicles.find(x => x.id === ActiveEditVehicleId);
  if (!v) return;

  const rawDay = document.getElementById('editDailyPrice').value;
  const rawDep = document.getElementById('editDeposit').value;
  const newDay = rawDay !== '' ? Number(rawDay) : (v.daily_price !== undefined ? Number(v.daily_price) : 150);
  const newDep = rawDep !== '' ? Number(rawDep) : (v.deposit !== undefined ? Number(v.deposit) : 1500);

  const delivType = document.getElementById('editDeliveryType')?.value || 'ready';
  const delivWeeks = Number(document.getElementById('editDeliveryWeeks')?.value) || 4;
  const delivDate = document.getElementById('editDeliveryDate')?.value || '';

  const isReady = delivType === 'ready';
  const weeksVal = delivType === 'ready' ? 1 : (delivType === 'weeks' ? delivWeeks : 4);

  const updatedSpecs = Object.assign({}, typeof v.specs === 'string' ? JSON.parse(v.specs) : (v.specs || {}), {
    is_ready_delivery: isReady,
    delivery_type: delivType,
    delivery_weeks: weeksVal,
    delivery_date: delivType === 'date' ? delivDate : ''
  });

  const currentTab = document.getElementById('currentPricingTab')?.value || 'nbt';

  // Assicuriamoci che ci sia una sessione Supabase attiva prima dell'invio al DB
  if (supabase) {
    try {
      if (supabase.auth) {
        await supabase.auth.getSession();
      }
    } catch(errAuth) {}

    const submitBtn = event.target ? event.target.querySelector('button[type="submit"]') : null;
    const oldBtnText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> Salvataggio su DB in corso...`;
      submitBtn.disabled = true;
    }

    try {
      // 1. Aggiornamento tabella vehicles
      // Aggiorniamo sempre le info base del veicolo
      let { data: vehUpdated, error: vehErr } = await supabase
        .from('vehicles')
        .update({ daily_price: newDay, deposit: newDep, specs: updatedSpecs })
        .eq('id', ActiveEditVehicleId)
        .select();

      if (vehErr) {
        console.error("❌ Errore aggiornamento DB vehicles:", vehErr);
        if (submitBtn) { submitBtn.innerHTML = oldBtnText; submitBtn.disabled = false; }
        return;
      }

      // 2. Aggiornamento in base al tab selezionato
      if (currentTab === 'nbt') {
        let { data: nbtUpdated, error: nbtErr } = await supabase
          .from('nbt_offers')
          .update({ daily_price: newDay })
          .eq('vehicle_id', ActiveEditVehicleId)
          .select();

        if (nbtErr) {
          alert("Errore aggiornamento NBT (vehicle_id): " + nbtErr.message);
        }

        if (!nbtErr && (!nbtUpdated || nbtUpdated.length === 0)) {
          const res2 = await supabase.from('nbt_offers').update({ daily_price: newDay }).eq('id', ActiveEditVehicleId).select();
          nbtUpdated = res2.data;
          if (res2.error) alert("Errore aggiornamento NBT (id): " + res2.error.message);
        }

        if (!nbtUpdated || nbtUpdated.length === 0) {
          const { error: insErr } = await supabase.from('nbt_offers').insert([{
            vehicle_id: ActiveEditVehicleId,
            provider_id: CurrentPartner ? CurrentPartner.id : null,
            daily_price: newDay,
            is_active: true
          }]);
          if (insErr) alert("Errore inserimento NBT: " + insErr.message);
        }
      } else if (currentTab === 'nlt') {
        const newMonthly = Number(document.getElementById('editMonthlyPrice').value) || 0;

        let { data: nltUpdated, error: nltErr } = await supabase
          .from('nlt_offers')
          .update({ 
            client_monthly_price: newMonthly
          })
          .eq('vehicle_id', ActiveEditVehicleId)
          .select();
        
        if (nltErr) alert("Errore aggiornamento NLT (vehicle_id): " + nltErr.message);

        if (!nltErr && (!nltUpdated || nltUpdated.length === 0)) {
          const res2 = await supabase.from('nlt_offers').update({ client_monthly_price: newMonthly }).eq('id', ActiveEditVehicleId).select();
          nltUpdated = res2.data;
          if (res2.error) alert("Errore aggiornamento NLT (id): " + res2.error.message);
        }

        if (!nltUpdated || nltUpdated.length === 0) {
          const { error: insErr } = await supabase.from('nlt_offers').insert([{
            vehicle_id: ActiveEditVehicleId,
            provider_id: CurrentPartner ? CurrentPartner.id : null,
            client_monthly_price: newMonthly,
            is_active: true
          }]);
          if (insErr) alert("Errore inserimento NLT: " + insErr.message);
        }
      }

      console.log("✅ Tariffa e disponibilità salvate con successo sul database Supabase");
      
      // Aggiorna tabella localmente (optimistic UI)
      v.daily_price = newDay;
      v.deposit = newDep;
      v.specs = JSON.stringify(updatedSpecs);
      renderPartnerVehiclesTable();
      closeEditTariffModal();
    } catch(e) {
      console.error("Errore generale sync price:", e);
      alert("Errore durante la comunicazione con il database Supabase: " + e.message);
      if (submitBtn) { submitBtn.innerHTML = oldBtnText; submitBtn.disabled = false; }
      return;
    } finally {
      if (submitBtn) {
        submitBtn.innerHTML = oldBtnText;
        submitBtn.disabled = false;
      }
    }
  }

  // Applica modifica in memoria e chiudi il modale solo se il salvataggio o fallback è confermato
  v.daily_price = newDay;
  v.deposit = newDep;
  v.specs = updatedSpecs;
  v.is_ready_delivery = isReady;
  v.delivery_weeks = weeksVal;

  renderPartnerVehiclesTable();
  updatePartnerKpis();
  closeEditTariffModal();

  // Aggiornamento cache locale per riflesso istantaneo se la pagina NBT/NLT è aperta o in cache
  try {
    const nbtCache = JSON.parse(localStorage.getItem('itercars_nbt_cache') || '[]');
    let updatedCache = false;
    nbtCache.forEach(o => {
      if (String(o.id) === String(ActiveEditVehicleId) || String(o.vehicle_id) === String(ActiveEditVehicleId)) {
        o.nbtDailyPrice = newDay;
        o.baseDeposit = newDep;
        o.readyDelivery = isReady;
        o.deliveryWeeks = weeksVal;
        o.deliveryDate = delivType === 'date' ? delivDate : '';
        if (o.baseOffer) o.baseOffer.deposit = newDep;
        if (Array.isArray(o.variants)) {
          o.variants.forEach(varItem => varItem.deposit = newDep);
        }
        updatedCache = true;
      }
    });
    if (updatedCache) {
      localStorage.setItem('itercars_nbt_cache', JSON.stringify(nbtCache));
    }
    const nltCache = JSON.parse(localStorage.getItem('itercars_nlt_cache') || '[]');
    let updatedNltCache = false;
    nltCache.forEach(o => {
      if (String(o.id) === String(ActiveEditVehicleId) || String(o.vehicle_id) === String(ActiveEditVehicleId)) {
        o.basePrice = Math.round(newDay * 20);
        o.baseDeposit = newDep;
        o.readyDelivery = isReady;
        o.deliveryWeeks = weeksVal;
        o.deliveryDate = delivType === 'date' ? delivDate : '';
        updatedNltCache = true;
      }
    });
    if (updatedNltCache) {
      localStorage.setItem('itercars_nlt_cache', JSON.stringify(nltCache));
    }
    localStorage.setItem('itercars_force_refresh', String(Date.now()));
  } catch(e) {}
}

async function deletePartnerVehicle(vehicleId) {
  const v = PartnerVehicles.find(x => x.id === vehicleId);
  if (!v) return;
  if (!confirm(`Confermi la rimozione definitiva del veicolo "${v.brand} ${v.model}" dal tuo catalogo?`)) return;

  PartnerVehicles = PartnerVehicles.filter(x => x.id !== vehicleId);
  renderPartnerVehiclesTable();
  updatePartnerKpis();

  if (supabase) {
    try {
      await supabase.from('nlt_offers').delete().eq('vehicle_id', vehicleId);
      await supabase.from('nbt_offers').delete().eq('vehicle_id', vehicleId);
      await supabase.from('vehicles').delete().eq('id', vehicleId).eq('provider_id', CurrentPartner.id);
    } catch(e) { console.warn("Errore cancellazione:", e); }
  }
}

async function savePartnerProfile(event) {
  if (event && event.preventDefault) event.preventDefault();
  if (!CurrentPartner || !CurrentPartner.id) return;
  
  const compName = document.getElementById('settingCompanyName').value;
  const compVat = document.getElementById('settingCompanyVat').value;
  const compEmail = document.getElementById('settingCompanyEmail').value;
  const compDep = document.getElementById('settingDefaultDeposit').value;
  const compAddr = document.getElementById('settingAddress').value;

  CurrentPartner.name = compName;
  CurrentPartner.company_vat = compVat;
  CurrentPartner.partner_email = compEmail;
  CurrentPartner.contact_email = compEmail;
  CurrentPartner.default_deposit = compDep;
  CurrentPartner.address = compAddr;

  if (document.getElementById('displayPartnerName')) document.getElementById('displayPartnerName').textContent = compName;

  if (supabase) {
    try {
      await supabase.from('providers').update({
        name: compName,
        company_vat: compVat,
        partner_email: compEmail,
        contact_email: compEmail,
        default_deposit: compDep,
        address: compAddr
      }).eq('id', CurrentPartner.id);
      
      alert("Impostazioni profilo aggiornate con successo su Supabase Storage!");
    } catch(e) {
      console.warn("Errore save profile:", e);
      alert("Errore durante il salvataggio.");
    }
  }
  
  localStorage.setItem('itercars_partner_auth', JSON.stringify(CurrentPartner));
}


// Log initial boot



/* ==========================================================================
   PARTNER REGISTRATION & AUTH SWITCH
   ========================================================================== */
window.switchPartnerAuthMode = function(mode) {
  const loginBox = document.getElementById('partnerLoginBox');
  const regBox = document.getElementById('partnerRegFormBox');
  if (mode === 'register') {
    if(loginBox) loginBox.style.display = 'none';
    if(regBox) regBox.style.display = 'block';
  } else {
    if(loginBox) loginBox.style.display = 'block';
    if(regBox) regBox.style.display = 'none';
  }
};

window.handlePartnerReg = async function(event) {
  event.preventDefault();
  if (!supabase) {
    alert("Errore di connessione al database. Riprovare pi tardi.");
    return;
  }

  const companyName = document.getElementById('partRegCompany').value.trim();
  const vat = document.getElementById('partRegVat').value.trim();
  const contactName = document.getElementById('partRegName').value.trim();
  const phone = document.getElementById('partRegPhone').value.trim();
  const email = document.getElementById('partRegEmail').value.trim();
  const address = document.getElementById('partRegAddress').value.trim();
  const password = document.getElementById('partRegPassword').value;
  const passwordConfirm = document.getElementById('partRegPasswordConfirm').value;

  if (password !== passwordConfirm) {
    alert("Le password non coincidono.");
    return;
  }

  const submitBtn = event.target.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> <span>Invio in corso...</span>`;
    submitBtn.disabled = true;
  }

  try {
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: contactName,
          company: companyName,
          role: 'pending_partner'
        }
      }
    });

    if (authErr) throw authErr;
    const authId = authData.user ? authData.user.id : null;

    const { error: dbErr } = await supabase.from('supplier_applications').insert([{
      auth_id: authId,
      company_name: companyName,
      partita_iva: vat,
      referent_name: contactName,
      email: email,
      phone: phone,
      fleet_size: 'Non specificato',
      city: address,
      models: 'Richiesta dal popup CRM Partner',
      status: 'new',
      data: new Date().toLocaleString('it-IT')
    }]);

    if (dbErr) throw dbErr;
    
    // Invia email di notifica al CEO chiamando la Edge Function
    try {
      await supabase.functions.invoke('notify_new_partner', {
        body: {
          companyName,
          vat,
          contactName,
          phone,
          email,
          address
        }
      });
    } catch (fnErr) {
      console.warn("Errore nell'invio della notifica email (ma la registrazione  andata a buon fine):", fnErr);
    }

    await supabase.auth.signOut();

    alert("Richiesta inviata con successo! Il team ti contatter al pi presto. Non potrai accedere fino ad approvazione avvenuta.");
    window.switchPartnerAuthMode('login');
    event.target.reset();
  } catch (error) {
    console.error("Errore invio candidatura partner:", error);
    alert("Si  verificato un errore durante l'invio della richiesta: " + (error.message || "Riprova pi tardi."));
  } finally {
    if (submitBtn) {
      submitBtn.innerHTML = `<span>Invia Richiesta</span> <i class="ri-send-plane-fill"></i>`;
      submitBtn.disabled = false;
    }
  }
};

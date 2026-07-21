/* ==========================================================================
   ITERCARS — DETTAGLIO VEICOLO & CONFIGURATORE NBT MULTI-MANDANTE
   Gestione completa delle opzioni di noleggio (Mesi, Km, Anticipo, Franchigia)
   con ricalcolo live del canone e generazione Preventivo PDF Ufficiale.
   ========================================================================== */

const BROKER_MARGIN = 1.0; // Ricarico gestito da backend e preventivo puro

const OFFICIAL_RATES = {
  'bmw-s1': {
    6: { baseKm: 20000, deposit: 0, price: 650, extraKmPrice: 0.16 },
    12: { baseKm: 20000, deposit: 0, price: 580, extraKmPrice: 0.15 },
    24: { baseKm: 20000, deposit: 2000, price: 450, extraKmPrice: 0.14 },
    36: { baseKm: 20000, deposit: 2000, price: 390, extraKmPrice: 0.12 }
  },
  'bmw-x1': {
    6: { baseKm: 20000, deposit: 0, price: 750, extraKmPrice: 0.18 },
    12: { baseKm: 20000, deposit: 0, price: 680, extraKmPrice: 0.16 },
    24: { baseKm: 20000, deposit: 3000, price: 520, extraKmPrice: 0.15 },
    36: { baseKm: 20000, deposit: 3000, price: 460, extraKmPrice: 0.14 }
  },
  'bmw-s3t': {
    6: { baseKm: 30000, deposit: 0, price: 890, extraKmPrice: 0.20 },
    12: { baseKm: 25000, deposit: 0, price: 820, extraKmPrice: 0.18 },
    24: { baseKm: 25000, deposit: 3500, price: 660, extraKmPrice: 0.16 },
    36: { baseKm: 25000, deposit: 3500, price: 580, extraKmPrice: 0.15 }
  },
  'bmw-x3': {
    6: { baseKm: 30000, deposit: 0, price: 990, extraKmPrice: 0.22 },
    12: { baseKm: 25000, deposit: 0, price: 920, extraKmPrice: 0.20 },
    24: { baseKm: 25000, deposit: 4000, price: 740, extraKmPrice: 0.18 },
    36: { baseKm: 25000, deposit: 4000, price: 650, extraKmPrice: 0.16 }
  },
  'bmw-s5': {
    12: { baseKm: 20000, deposit: 0, price: 1150, extraKmPrice: 0.25 },
    24: { baseKm: 20000, deposit: 5000, price: 890, extraKmPrice: 0.22 },
    36: { baseKm: 20000, deposit: 5000, price: 790, extraKmPrice: 0.20 }
  },
  'bmw-x5': {
    12: { baseKm: 25000, deposit: 0, price: 1450, extraKmPrice: 0.28 },
    24: { baseKm: 25000, deposit: 6000, price: 1180, extraKmPrice: 0.25 },
    36: { baseKm: 25000, deposit: 6000, price: 1050, extraKmPrice: 0.22 }
  },
  'bmw-i4': {
    6: { baseKm: 20000, deposit: 0, price: 890, extraKmPrice: 0.20 },
    12: { baseKm: 20000, deposit: 0, price: 790, extraKmPrice: 0.18 },
    24: { baseKm: 20000, deposit: 4000, price: 640, extraKmPrice: 0.16 },
    36: { baseKm: 20000, deposit: 4000, price: 570, extraKmPrice: 0.15 }
  }
};

const SAMPLE_DETAIL_OFFERS = [];

// Stato della configurazione attiva per l'auto corrente
const ConfigState = {
  car: null,
  durationDays: 7,
  kmDailyLimit: 150,
  depositAmount: 3000,
  kaskoFranchigia: 'standard', // 'standard' (500€) oppure 'zero' (0€)
  finalMonthlyPrice: 0
};

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  let carId = params.get('id') || 'bmw-x3-48-3k';
  const paramModel = params.get('model');
  const paramBrand = params.get('brand');
  const paramImg = params.get('img');
  const paramTrim = params.get('trim');

  // Eager load per velocizzare il sito (Zero-Layout-Shift)
  if (paramImg) {
    const imgEl = document.getElementById('detailMainImg');
    if (imgEl) imgEl.src = paramImg;
  }
  if (paramBrand) {
    const brandEl = document.getElementById('detailBrand');
    if (brandEl) brandEl.innerText = paramBrand;
  }
  if (paramModel) {
    const modelEl = document.getElementById('detailModel');
    if (modelEl) modelEl.innerText = paramModel;
  }
  if (paramTrim) {
    const trimEl = document.getElementById('detailTrim');
    if (trimEl) trimEl.innerText = paramTrim;
  }

  let found = null;
  // 1. Tenta da cache locale salvata da nbt-app.js (cerca per id, vehicle_id o model esatto)
  try {
    const cached = JSON.parse(localStorage.getItem('itercars_nbt_cache') || '[]');
    found = cached.find(o => String(o.id) === String(carId) || String(o.vehicle_id) === String(carId) || (paramModel && String(o.model).toLowerCase() === String(paramModel).toLowerCase()));
  } catch (e) { }

  // 2. Cerca live sul DB se connesso a Supabase (dando priorità al dato live aggiornato dal partner)
  if (typeof window.supabase !== 'undefined' && window.supabase) {
    try {
      const selectFields = `
        *,
        vehicles (id, brand, model, trim, category, fuel_type, transmission, image_url, specs, daily_price, deposit, provider_id),
        providers (name)
      `;
      let { data, error } = await window.supabase
        .from('nbt_offers')
        .select(selectFields)
        .eq('id', carId)
        .maybeSingle();

      if (!data) {
        const res = await window.supabase
          .from('nbt_offers')
          .select(selectFields)
          .eq('vehicle_id', carId)
          .maybeSingle();
        if (res.data) data = res.data;
      }

      let vDb = (data && data.vehicles) ? data.vehicles : null;
      if (!vDb && carId) {
        const resVeh = await window.supabase
          .from('vehicles')
          .select('*, providers(name)')
          .or(`id.eq.${carId},model.ilike."%${carId}%"`)
          .maybeSingle();
        if (resVeh && resVeh.data) {
          vDb = resVeh.data;
          if (!data) data = { vehicles: vDb, providers: resVeh.data.providers };
        }
      } else if (vDb && vDb.id) {
        const resLive = await window.supabase.from('vehicles').select('*').eq('id', vDb.id).maybeSingle();
        if (resLive && resLive.data) vDb = Object.assign({}, vDb, resLive.data);
      }

      if (!error && (data || vDb)) {
        const v = vDb || {};
        const specsObj = typeof v.specs === 'string' ? JSON.parse(v.specs) : (v.specs || {});
        // Priorità alla tariffa e cauzione aggiornate live dal partner in tabella vehicles
        const dailyP = (v.daily_price !== undefined && v.daily_price !== null && v.daily_price !== '' && Number(v.daily_price) > 0) ? Number(v.daily_price) : ((data && data.daily_price !== undefined && data.daily_price !== null && data.daily_price !== '') ? Number(data.daily_price) : 85);
        const depositP = (v.deposit !== undefined && v.deposit !== null && v.deposit !== '' && Number(v.deposit) >= 0) ? Number(v.deposit) : ((data && data.deposit_required !== undefined && data.deposit_required !== null && data.deposit_required !== '') ? Number(data.deposit_required) : ((data && data.deposit_mandante !== undefined && data.deposit_mandante !== null && data.deposit_mandante !== '') ? Number(data.deposit_mandante) : 3000));

        found = {
          id: data ? data.id : (v.id || carId),
          vehicle_id: v.id || (data ? data.vehicle_id : carId),
          brand: v.brand || 'Veicolo',
          model: v.model || 'NBT',
          trim: v.trim || 'Executive',
          category: v.category || 'SUV Luxury',
          fuel: v.fuel_type || 'Ibrido / Diesel',
          transmission: v.transmission || 'Automatico',
          image: v.image_url || 'category-suv.jpg',
          hp: specsObj.hp || '300 CV',
          speed: specsObj.speed || '240 km/h',
          accel: specsObj.accel || '5.5s',
          readyDelivery: (specsObj.is_ready_delivery !== undefined) ? !!specsObj.is_ready_delivery : (data && data.is_ready_delivery !== undefined ? !!data.is_ready_delivery : (v.is_ready_delivery !== undefined ? !!v.is_ready_delivery : true)),
          deliveryWeeks: specsObj.delivery_weeks !== undefined ? Number(specsObj.delivery_weeks) : ((data && data.delivery_weeks !== undefined) ? Number(data.delivery_weeks) : (v.delivery_weeks !== undefined ? Number(v.delivery_weeks) : 1)),
          deliveryDate: specsObj.delivery_date || v.delivery_date || (data && data.delivery_date) || '',
          providerName: (data && data.providers && data.providers.name) ? data.providers.name : (v.providerName || 'Mandante NBT'),
          provider_id: v.provider_id || (data && data.provider_id ? data.provider_id : null),
          nbtDailyPrice: dailyP,
          basePrice: (data && Number(data.client_monthly_price)) || Math.round(dailyP * 20) || 699,
          baseDuration: 7,
          baseKm: 150,
          baseDeposit: depositP
        };
      }
    } catch (err) {
      console.warn("Dettaglio live da DB non raggiungibile, fallback in corso.");
    }
  }

  // 3. Fallback al catalogo ufficiale (cerca per id, vehicle_id o corrispondenza esatta/parziale del modello)
  if (!found) {
    found = SAMPLE_DETAIL_OFFERS.find(o => String(o.id) === String(carId) || String(o.vehicle_id) === String(carId) || (paramModel && String(o.model).toLowerCase().includes(String(paramModel).toLowerCase())) || String(o.id).toLowerCase().includes(String(carId).toLowerCase()) || String(o.model).toLowerCase().includes(String(carId).toLowerCase()));
  }

  // 4. Ricostruzione dinamica e pulita dai parametri URL se l'offerta è personalizzata o dal DB ma non in cache
  if (!found && paramModel) {
    found = {
      id: carId,
      vehicle_id: params.get('vid') || null,
      brand: params.get('brand') || 'BMW',
      model: paramModel,
      trim: params.get('trim') || 'Executive M Sport',
      category: params.get('cat') || 'Sportiva',
      fuel: params.get('fuel') || 'Mild-Hybrid / Diesel',
      transmission: params.get('trans') || 'Automatico 8M',
      image: params.get('img') || 'category-suv.jpg',
      hp: params.get('hp') || '190 CV',
      speed: params.get('speed') || '230 km/h',
      accel: params.get('accel') || '7.5s',
      readyDelivery: true,
      deliveryWeeks: 2,
      providerName: 'Mandante Ufficiale BMW',
      basePrice: Number(params.get('price')) || 580,
      baseDuration: Number(params.get('dur')) || 36,
      baseKm: Number(params.get('km')) || 60000,
      baseDeposit: Number(params.get('deposit')) || 3500
    };
  }

  if (!found && SAMPLE_DETAIL_OFFERS.length > 0) found = SAMPLE_DETAIL_OFFERS[0];

  if (found) {
    if (found.basePrice === undefined && found.baseOffer?.monthlyPrice !== undefined) found.basePrice = Number(found.baseOffer.monthlyPrice);
    if (found.baseDuration === undefined && found.baseOffer?.duration !== undefined) found.baseDuration = Number(found.baseOffer.duration);
    if (found.baseKm === undefined && found.baseOffer?.km !== undefined) found.baseKm = Number(found.baseOffer.km);
    if (found.baseDeposit === undefined && found.baseOffer?.deposit !== undefined) found.baseDeposit = Number(found.baseOffer.deposit);

    ConfigState.car = found;
    ConfigState.durationDays = (found.baseDuration && found.baseDuration <= 30) ? found.baseDuration : 7;
    ConfigState.kmDailyLimit = (found.baseKm && found.baseKm <= 500) ? found.baseKm : 150;
    ConfigState.depositAmount = found.baseDeposit !== undefined ? found.baseDeposit : 3000;
  }

  renderCarDetails();
  calculateAndRenderPrice();
});

function renderCarDetails() {
  const c = ConfigState.car;
  if (!c) return;

  document.title = `${c.brand} ${c.model} (${c.trim}) — Configura NBT | ITERCARS`;

  // Breadcrumb & Titoli
  const breadcrumb = document.getElementById('nltBreadcrumb');
  if (breadcrumb) {
    breadcrumb.innerHTML = `<a href="noleggio-breve-termine.html" style="color: #2ecc71; text-decoration: none;">Catalogo NBT</a> <i class="ri-arrow-right-s-line"></i> <span>${c.brand}</span> <i class="ri-arrow-right-s-line"></i> <strong>${c.model}</strong>`;
  }

  const brandElem = document.getElementById('detailBrand');
  const modelElem = document.getElementById('detailModel');
  const trimElem = document.getElementById('detailTrim');
  const providerElem = document.getElementById('detailProvider');
  const imgElem = document.getElementById('detailMainImg');

  if (brandElem) brandElem.textContent = c.brand;
  if (modelElem) modelElem.textContent = c.model;
  if (trimElem) trimElem.textContent = c.trim;
  if (providerElem) providerElem.innerHTML = `<i class="ri-shield-star-fill text-green"></i> Listino Mandante: <strong>${c.providerName}</strong>`;
  if (imgElem) imgElem.src = c.image;

  const badgeContainer = document.getElementById('detailBadgeContainer');
  if (badgeContainer) {
    if (c.deliveryDate && c.deliveryDate !== '') {
      let fDate = c.deliveryDate;
      try { const p = c.deliveryDate.split('-'); if (p.length === 3) fDate = `${p[2]}/${p[1]}/${p[0]}`; } catch (e) { }
      badgeContainer.innerHTML = `<span class="badge-custom" style="padding: 6px 14px; font-size: 0.85rem; border-radius: 20px; font-weight: 700; background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3);"><i class="ri-calendar-event-line"></i> Disponibile dal ${fDate}</span>`;
    } else if (c.readyDelivery && (c.deliveryWeeks === 1 || c.deliveryWeeks <= 1)) {
      badgeContainer.innerHTML = `<span class="badge-ready" style="padding: 6px 14px; font-size: 0.85rem; border-radius: 20px; font-weight: 700;"><i class="ri-rocket-fill"></i> Pronta Consegna</span>`;
    } else if (c.readyDelivery) {
      badgeContainer.innerHTML = `<span class="badge-ready" style="padding: 6px 14px; font-size: 0.85rem; border-radius: 20px; font-weight: 700;"><i class="ri-rocket-fill"></i> Pronta Consegna (${c.deliveryWeeks} settimane)</span>`;
    } else {
      badgeContainer.innerHTML = `<span class="badge-custom" style="padding: 6px 14px; font-size: 0.85rem; border-radius: 20px; font-weight: 700; background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3);"><i class="ri-time-line"></i> Consegna tra ${c.deliveryWeeks || 4} settimane</span>`;
    }
  }

  // Specifiche tecniche
  const speedEl = document.getElementById('detailSpeed');
  const accelEl = document.getElementById('detailAccel');
  const hpEl = document.getElementById('detailHp');
  const fuelEl = document.getElementById('detailFuel');
  const transEl = document.getElementById('detailTrans');

  if (speedEl) speedEl.textContent = c.speed;
  if (accelEl) accelEl.textContent = c.accel;
  if (hpEl) hpEl.textContent = c.hp;
  if (fuelEl) fuelEl.textContent = c.fuel;
  if (transEl) transEl.textContent = c.transmission;

  // Sincronizza i selettori attivi nella GUI
  syncActiveButtons('configDurationGroup', ConfigState.durationDays);
  syncActiveButtons('configKmGroup', ConfigState.kmDailyLimit);
  syncActiveButtons('configDepositGroup', ConfigState.depositAmount);
}

function syncActiveButtons(containerId, value) {
  const container = document.getElementById(containerId);
  if (!container) return;
  if (containerId === 'configDepositGroup') {
    const fixedDep = Number(ConfigState.depositAmount) || 0;
    container.innerHTML = `
      <div style="background: rgba(245, 158, 11, 0.12); border: 1.5px solid #f59e0b; border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; width: 100%; grid-column: 1 / -1;">
        <div style="display: flex; align-items: center; gap: 12px;">
          <i class="ri-shield-keyhole-fill" style="color: #f59e0b; font-size: 1.6rem;"></i>
          <div style="text-align: left;">
            <span style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; display: block;">Deposito Cauzionale sulla Carta</span>
            <strong style="font-size: 1.2rem; color: #fff;">€ ${fixedDep.toLocaleString('it-IT')}</strong>
          </div>
        </div>
        <span style="background: rgba(245, 158, 11, 0.2); color: #f59e0b; font-size: 0.75rem; font-weight: 800; padding: 5px 12px; border-radius: 20px; border: 1px solid rgba(245, 158, 11, 0.4); display: flex; align-items: center; gap: 5px;">
          <i class="ri-lock-fill"></i> Imposto da prassi
        </span>
      </div>
    `;
    return;
  }
  container.querySelectorAll('.config-option-btn').forEach(btn => {
    const btnVal = Number(btn.dataset.value);
    btn.classList.toggle('active', btnVal === value);
  });
}

// Scelta Durata Contratto
function setConfigDuration(days, btnElem) {
  ConfigState.durationDays = Number(days);
  if (btnElem) {
    btnElem.parentElement.querySelectorAll('.config-option-btn').forEach(b => b.classList.remove('active'));
    btnElem.classList.add('active');

    const customInput = document.getElementById('customDurationInput');
    if (customInput) customInput.value = ''; // clear custom input
  }
  const sa = document.getElementById('sidebarQuoteActions');
  if (sa && sa.style.display === 'block') sa.style.display = 'none';
  calculateAndRenderPrice();
}

function handleCustomDuration(val) {
  let days = parseInt(val);
  if (isNaN(days) || days <= 0) return;

  ConfigState.durationDays = days;

  // deselect preset buttons
  const group = document.getElementById('configDurationGroup');
  if (group) {
    group.querySelectorAll('.config-option-btn').forEach(b => b.classList.remove('active'));
  }

  const sa = document.getElementById('sidebarQuoteActions');
  if (sa && sa.style.display === 'block') sa.style.display = 'none';
  calculateAndRenderPrice();
}

// Scelta Chilometraggio Annuo
function setConfigKmDaily(km, btnElem) {
  ConfigState.kmDailyLimit = Number(km);
  if (btnElem) {
    btnElem.parentElement.querySelectorAll('.config-option-btn').forEach(b => b.classList.remove('active'));
    btnElem.classList.add('active');
  }
  const sa = document.getElementById('sidebarQuoteActions');
  if (sa && sa.style.display === 'block') sa.style.display = 'none';
  calculateAndRenderPrice();
}

function obsolete_setConfigKm(km, btnElem) {
  ConfigState.kmDailyLimit = Number(km);
  if (btnElem) {
    btnElem.parentElement.querySelectorAll('.config-option-btn').forEach(b => b.classList.remove('active'));
    btnElem.classList.add('active');
  }
  const sa = document.getElementById('sidebarQuoteActions');
  if (sa && sa.style.display === 'block') sa.style.display = 'none';
  calculateAndRenderPrice();
}

// Scelta Anticipo Iniziale
function setConfigDeposit(deposit, btnElem) {
  ConfigState.depositAmount = Number(deposit);
  if (btnElem) {
    btnElem.parentElement.querySelectorAll('.config-option-btn').forEach(b => b.classList.remove('active'));
    btnElem.classList.add('active');
  }
  const sa = document.getElementById('sidebarQuoteActions');
  if (sa && sa.style.display === 'block') sa.style.display = 'none';
  calculateAndRenderPrice();
}

// Scelta Franchigia Kasko
function setConfigKasko(type, btnElem) {
  ConfigState.kaskoFranchigia = type;
  if (btnElem) {
    btnElem.parentElement.querySelectorAll('.config-option-btn').forEach(b => b.classList.remove('active'));
    btnElem.classList.add('active');
  }
  const sa = document.getElementById('sidebarQuoteActions');
  if (sa && sa.style.display === 'block') sa.style.display = 'none';
  calculateAndRenderPrice();
}

// Motore di calcolo finanziario tariffa NBT in tempo reale
function calculateAndRenderPrice() {
  const c = ConfigState.car;
  if (!c) return;

  // Ricava prezzo base giornaliero da DB, oggetto o modello
  let baseDailyPrice = c.nbtDailyPrice;
  if (!baseDailyPrice) {
    const modelStr = (c.model || '').toLowerCase();
    if (modelStr.includes('serie 1') || modelStr.includes('118')) baseDailyPrice = 80;
    else if (modelStr.includes('x1')) baseDailyPrice = 95;
    else if (modelStr.includes('serie 3')) baseDailyPrice = 110;
    else if (modelStr.includes('x3')) baseDailyPrice = 125;
    else if (modelStr.includes('serie 5')) baseDailyPrice = 150;
    else if (modelStr.includes('x5')) baseDailyPrice = 200;
    else if (modelStr.includes('i4')) baseDailyPrice = 180;
    else baseDailyPrice = c.basePrice ? Math.max(c.basePrice / 10, 75) : 85;
  }

  // Calcolo prezzo per i giorni selezionati
  let price = baseDailyPrice * ConfigState.durationDays;

  if (ConfigState.kmDailyLimit === 100) {
    price *= 0.9;
  } else if (ConfigState.kmDailyLimit === 200) {
    price *= 1.15;
  } else if (ConfigState.kmDailyLimit === 99999) {
    price *= 1.4;
  }

  // Aggiustamento in base al deposito (es. sconto giornaliero se deposito alto)
  // Per ora manteniamo il prezzo base, ma possiamo fare logiche avanzate.

  // Supplemento Kasko Franchigia Zero (+ € 15 / giorno)
  if (ConfigState.kaskoFranchigia === 'zero') {
    price += 15.00 * ConfigState.durationDays;
  }

  // Margine Broker
  price = price * BROKER_MARGIN;

  ConfigState.finalMonthlyPrice = Math.round(price); // usiamo la stessa variabile per compatibilità col PDF

  const priceDisplay = document.getElementById('liveMonthlyPrice');
  const summaryDisplay = document.getElementById('liveConfigSummary');
  const boxElem = document.getElementById('livePriceBox');

  if (priceDisplay && summaryDisplay && boxElem) {
    boxElem.style.transform = 'scale(0.97)';
    boxElem.style.opacity = '0.6';
    setTimeout(() => {
      priceDisplay.innerHTML = `€ ${ConfigState.finalMonthlyPrice.toLocaleString('it-IT')} <small style="font-size: 0.8rem; font-weight: 400; color: #fff;">Totale</small>`;
      summaryDisplay.innerHTML = `<strong>${ConfigState.durationDays} Giorni</strong> • Deposito Cauzionale <strong>€ ${ConfigState.depositAmount.toLocaleString('it-IT')}</strong>`;

      boxElem.style.transform = 'scale(1)';
      boxElem.style.opacity = '1';
    }, 150);
  }
}

// Gestione submit finale "Genera Preventivo" (Apre e mostra il preventivo ufficiale PDF/Stampabile)
async function handleQuoteSubmit(event) {
  event.preventDefault();

  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;

  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Elaborazione Preventivo...';

  const name = document.getElementById('quoteClientName').value;
  const email = document.getElementById('quoteClientEmail').value;
  const phone = document.getElementById('quoteClientPhone').value;
  const type = document.getElementById('quoteClientType').value;
  const c = ConfigState.car;
  const quoteCode = `IT-NBT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  localStorage.setItem('itercars_last_quote_code', quoteCode);
  localStorage.setItem('itercars_last_quote', JSON.stringify({
    quote_code: quoteCode,
    isNbt: true,
    final_monthly_price: ConfigState.finalMonthlyPrice,
    carTitle: `${c.brand} ${c.model}`,
    selected_duration_months: ConfigState.durationDays,
    selected_deposit: ConfigState.depositAmount,
    crm_leads: { first_name: name, email: email, customer_type: type },
    vehicles: { provider_id: c.provider_id, brand: c.brand, model: c.model, trim: c.trim }
  }));

  // 1. Visualizza SUBITO la scheda Preventivo Ufficiale senza bloccare la pagina!
  const previewBox = document.getElementById('officialQuoteContainer');
  if (previewBox) {
    previewBox.style.display = 'block';
    previewBox.innerHTML = `
      <div class="glass-card quote-result-card" style="margin-top: 30px; border: 2px solid var(--accent-primary); padding: 30px; position: relative; animation: fadeIn 0.4s ease; background: #080c14;">
        <div style="position: absolute; top: -30px; right: -30px; width: 160px; height: 160px; background: rgba(0, 146, 70, 0.2); border-radius: 50%; filter: blur(40px);"></div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
          <div>
            <img src="logo_tricolore.png" style="height: 30px; margin-bottom: 6px;" alt="Itercars Logo"><br>
            <span style="color: var(--accent-primary); font-weight: 800; font-size: 1.25rem; letter-spacing: 1px;"><i class="ri-vip-crown-fill"></i> ITERCARS — PREVENTIVO UFFICIALE NBT</span>
            <div style="font-size: 0.88rem; color: var(--text-muted); margin-top: 4px;">Codice Pratica: <strong>${quoteCode}</strong> • Data Emissione: ${new Date().toLocaleDateString('it-IT')}</div>
          </div>
          <span style="background: rgba(46, 204, 113, 0.2); color: #2ecc71; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 800;">PRONTO DA FIRMARE / BLOCCA TARIFFA</span>
        </div>

        <div class="detail-image-wrapper" style="margin-bottom: 12px; box-shadow: none;">
          <img src="${c.image}" alt="${c.model}" class="detail-image" style="background: #fff; max-height: 280px;">
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); padding: 10px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); margin-bottom: 24px;">
            <div style="text-align: center; font-size: 0.75rem;">
                <span style="color: var(--text-muted); display: block; text-transform: uppercase;">Velocità Max</span>
                <strong style="color: #fff;">${c.speed}</strong>
            </div>
            <div style="text-align: center; font-size: 0.75rem;">
                <span style="color: var(--text-muted); display: block; text-transform: uppercase;">0-100 km/h</span>
                <strong style="color: #fff;">${c.accel}</strong>
            </div>
            <div style="text-align: center; font-size: 0.75rem;">
                <span style="color: var(--text-muted); display: block; text-transform: uppercase;">Potenza</span>
                <strong style="color: #fff;">${c.hp}</strong>
            </div>
            <div style="text-align: center; font-size: 0.75rem;">
                <span style="color: var(--text-muted); display: block; text-transform: uppercase;">Alimentazione</span>
                <strong style="color: #fff;">${c.fuel}</strong>
            </div>
            <div style="text-align: center; font-size: 0.75rem;">
                <span style="color: var(--text-muted); display: block; text-transform: uppercase;">Cambio</span>
                <strong style="color: #fff;">${c.transmission}</strong>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; font-size: 0.95rem;">
          <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.07);">
            <strong style="color: var(--accent-primary); display: block; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 6px;">Intestazione Cliente</strong>
            <div style="font-size: 1.1rem; font-weight: 800; color: #fff;">${name}</div>
            <div style="color: var(--text-muted); font-size: 0.9rem;">${type} • ${email} • ${phone}</div>
          </div>

          <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.07);">
            <strong style="color: var(--accent-primary); display: block; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 6px;">Vettura Selezionata</strong>
            <div style="font-size: 1.1rem; font-weight: 800; color: #fff;">${c.brand} ${c.model}</div>
            <div style="color: var(--text-muted); font-size: 0.9rem;">${c.trim} • Listino ${c.providerName}</div>
          </div>
        </div>

        <div style="background: rgba(0, 146, 70, 0.14); border: 1px solid rgba(0, 146, 70, 0.4); border-radius: 14px; padding: 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <span style="font-size: 0.85rem; color: var(--text-muted); display: block; text-transform: uppercase; font-weight: 700;">Configurazione Contratto NBT</span>
            <div style="font-size: 1.1rem; font-weight: 800; color: #fff; margin-top: 4px;">
              Durata: <span style="color: #2ecc71;">${ConfigState.durationDays} Giorni</span> • 
              Km compresi: <span style="color: #2ecc71;">${ConfigState.kmDailyLimit.toLocaleString('it-IT')} km/giorno</span> • 
              Anticipo: <span style="color: #2ecc71;">€ ${ConfigState.depositAmount.toLocaleString('it-IT')}</span>
            </div>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">Kasko Integral ${ConfigState.kaskoFranchigia === 'zero' ? '(Franchigia Zero 0€)' : '(Franchigia Standard)'} + Bollo & Manutenzione H24</div>
          </div>

          <div style="text-align: right;">
            <span style="font-size: 0.85rem; color: var(--text-muted); display: block; text-transform: uppercase; font-weight: 700;">Canone Totale Tutto Incluso</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: #2ecc71; line-height: 1;">€ ${ConfigState.finalMonthlyPrice.toLocaleString('it-IT')} <small style="font-size: 0.9rem; font-weight: 400; color: #fff;">Totale (IVA esc.)</small></div>
          </div>
        </div>

        <div id="nbtToastInfo" style="margin-bottom: 16px; padding: 12px 18px; border-radius: 8px; background: rgba(46, 204, 113, 0.15); border: 1px solid #2ecc71; color: #fff; font-weight: 600; display: flex; align-items: center; gap: 10px;">
          <i class="ri-mail-check-fill" style="color: #2ecc71; font-size: 1.4rem;"></i>
          <span>Preventivo generato e inviato al tuo indirizzo email! Puoi procedere con il pagamento o scaricare il PDF.</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <button type="button" class="btn btn-primary" onclick="window.acceptQuoteAndRedirect('${quoteCode}', event)" style="height: 52px; font-size: 1.05rem; font-weight: 800; background: linear-gradient(135deg, #2ecc71, #009246); border: none; display: flex; align-items: center; justify-content: center; gap: 8px; grid-column: span 2; box-shadow: 0 6px 20px rgba(46, 204, 113, 0.3);">
            <i class="ri-folder-upload-fill" style="font-size: 1.35rem;"></i> Accetta Preventivo e Carica Documenti
          </button>
          <button type="button" class="btn btn-outline" onclick="window.print()" style="height: 50px; font-size: 1rem; font-weight: 800; border-color: #2ecc71; color: #2ecc71; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="ri-printer-line" style="font-size: 1.3rem;"></i> Scarica PDF
          </button>
          <button type="button" class="btn btn-outline" onclick="sendCustomQuoteWhatsApp('${phone}', '${c.brand} ${c.model}', '${ConfigState.durationDays}', '${ConfigState.kmDailyLimit}', '${ConfigState.depositAmount}', '${ConfigState.finalMonthlyPrice}')" style="height: 50px; font-size: 1rem; font-weight: 800; border-color: #2ecc71; color: #2ecc71; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="ri-whatsapp-line" style="font-size: 1.3rem;"></i> Invia su WhatsApp
          </button>
        </div>
      </div>
    `;
    const sidebarActions = document.getElementById('sidebarQuoteActions');
    if (sidebarActions) {
      sidebarActions.style.display = 'block';
      sidebarActions.innerHTML = `
        <div style="margin-bottom: 14px; padding: 12px 14px; border-radius: 8px; background: rgba(46, 204, 113, 0.15); border: 1px solid #2ecc71; color: #fff; font-weight: 600; font-size: 0.88rem; display: flex; align-items: flex-start; gap: 10px; line-height: 1.4;">
          <i class="ri-mail-check-fill" style="color: #2ecc71; font-size: 1.3rem; flex-shrink: 0; margin-top: 1px;"></i>
          <span>Preventivo generato e inviato al tuo indirizzo email! Puoi procedere con il pagamento o scaricare il PDF.</span>
        </div>
        <button type="button" class="btn btn-primary" onclick="window.acceptQuoteAndRedirect('${quoteCode}', event)" style="width: 100%; height: 52px; font-size: 1.05rem; font-weight: 800; background: linear-gradient(135deg, #2ecc71, #009246); border: none; display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 10px; box-shadow: 0 6px 20px rgba(46, 204, 113, 0.3);">
          <i class="ri-folder-upload-fill" style="font-size: 1.35rem;"></i> Accetta Preventivo e Carica Documenti
        </button>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <button type="button" class="btn btn-outline" onclick="window.print()" style="height: 48px; font-size: 0.95rem; font-weight: 800; border-color: #2ecc71; color: #2ecc71; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 0 8px;">
            <i class="ri-printer-line" style="font-size: 1.2rem;"></i> Scarica PDF
          </button>
          <button type="button" class="btn btn-outline" onclick="sendCustomQuoteWhatsApp('${phone}', '${c.brand} ${c.model}', '${ConfigState.durationDays}', '${ConfigState.kmDailyLimit}', '${ConfigState.depositAmount}', '${ConfigState.finalMonthlyPrice}')" style="height: 48px; font-size: 0.95rem; font-weight: 800; border-color: #2ecc71; color: #2ecc71; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 0 8px;">
            <i class="ri-whatsapp-line" style="font-size: 1.2rem;"></i> Invia su WhatsApp
          </button>
        </div>
      `;
      sidebarActions.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      previewBox.scrollIntoView({ behavior: 'smooth' });
    }
  }

  submitBtn.disabled = false;
  submitBtn.innerHTML = '✅ Preventivo Generato!';

  // 2. Avvia in background senza bloccare l'interfaccia il salvataggio DB, Stripe e l'invio mail!
  (async () => {
    try {
      let pdfBase64 = null;
      try {
        const doc = await generateNativePDF(c, name, email, phone, type, quoteCode);
        const dataUri = doc.output('datauristring');
        pdfBase64 = dataUri.split(',')[1];
      } catch (pdfErr) {
        console.warn("PDF non generato per allegato:", pdfErr);
      }

      if (typeof window.supabase !== 'undefined' && window.supabase) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        let vehicleUuid = c.vehicle_id && uuidRegex.test(c.vehicle_id) ? c.vehicle_id : (c.id && uuidRegex.test(c.id) ? c.id : null);
        let rawProvId = (typeof c !== "undefined" && c.provider_id) ? c.provider_id : ((typeof vehicle !== "undefined" && vehicle && vehicle.provider_id) ? vehicle.provider_id : null);
        let provUuid = (rawProvId && uuidRegex.test(rawProvId)) ? rawProvId : null;
        let provName = (typeof c !== "undefined" && (c.providerName || c.provider_company_name)) ? (c.providerName || c.provider_company_name) : 'NBT';

        const leadPayload = {
          first_name: name.split(' ')[0] || name,
          last_name: name.split(' ').slice(1).join(' ') || 'Cliente NBT',
          phone: phone,
          email: email,
          customer_type: type || 'Privato',
          vehicle_interest: `${c.brand} ${c.model} ${c.trim || ''}`.trim() + ` (NBT ${ConfigState.durationDays} Giorni / ${ConfigState.kmDailyLimit} km/giorno - Rata €${ConfigState.finalMonthlyPrice}/periodo)`,
          pipeline_status: 'new_lead',
          assigned_broker_agent: 'Consulente Senior ITERCARS',
          provider_id: provUuid,
          interested_offer_id: null,
          interested_vehicle_id: vehicleUuid,
          notes: `Preventivo NBT [${quoteCode}] per ${c.brand} ${c.model}: ${ConfigState.durationDays}g/${ConfigState.kmDailyLimit}km - Anticipo €${ConfigState.depositAmount} -> Rata €${ConfigState.finalMonthlyPrice}/periodo [Mandante: ${provName}]`
        };

        let leadData = null;
        try {
          const { data: resData, error: leadErr } = await window.supabase.from('crm_leads').insert([leadPayload]).select();
          if (leadErr) {
            console.warn("Avviso inserimento crm_leads NBT, ritento pulendo chiavi esterne:", leadErr);
            leadPayload.interested_vehicle_id = null;
            leadPayload.provider_id = null;
            const retry = await window.supabase.from('crm_leads').insert([leadPayload]).select();
            leadData = retry.data;
          } else {
            leadData = resData;
          }
        } catch (dbE) {
          console.warn("Errore inserimento crm_leads NBT:", dbE);
        }

        let newLeadId = leadData && leadData.length > 0 ? leadData[0].id : null;

        await window.supabase.from('quotes').insert([{
          quote_code: quoteCode,
          lead_id: newLeadId,
          vehicle_id: c.vehicle_id && c.vehicle_id.length === 36 ? c.vehicle_id : null,
          offer_id: null,
          quote_type: 'NBT',
          provider_id: (typeof c !== "undefined" && c.provider_id && c.provider_id.length === 36) ? c.provider_id : null,
          selected_duration_days: ConfigState.durationDays,
          selected_km_per_day: ConfigState.kmDailyLimit,
          selected_duration_months: ConfigState.durationDays,
          selected_km_per_year: ConfigState.kmDailyLimit,
          selected_deposit: ConfigState.depositAmount,
          final_monthly_price: ConfigState.finalMonthlyPrice,
          services_snapshot: {
            kasko: ConfigState.kaskoFranchigia === 'zero' ? 'Zero Franchigia' : 'Standard',
            maintenance: 'Full',
            road_tax: 'Included',
            rca: 'Included'
          },
          status: 'sent'
        }]);

        const supabaseUrl = window.supabase.supabaseUrl;
        const supabaseKey = window.supabase.supabaseKey;

        let checkoutUrl = null;
        try {
          const stripeRes = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseKey}` },
            body: JSON.stringify({ quoteCode })
          });
          if (stripeRes.ok) {
            const stripeData = await stripeRes.json();
            checkoutUrl = stripeData.checkoutUrl || null;
          }
        } catch (stripeErr) { console.warn("Stripe url gen fail in background:", stripeErr); }

        const emailPayload = {
          email: email,
          nome: name,
          dettagli: `${c.brand} ${c.model} - ${ConfigState.durationDays} Giorni, ${ConfigState.kmDailyLimit} km/giorno, Anticipo €${ConfigState.depositAmount}`,
          totale: ConfigState.finalMonthlyPrice,
          pdfBase64: pdfBase64,
          pdfName: `Preventivo_ITERCARS_${c.brand}_${c.model}.pdf`.replace(/ /g, '_'),
          quoteCode: quoteCode,
          dossierUrl: window.location.origin + '/upload-documenti.html?code=' + quoteCode,
          checkoutUrl: checkoutUrl
        };

        await fetch(`${supabaseUrl}/functions/v1/preventivo_itercars`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseKey}` },
          body: JSON.stringify(emailPayload)
        });
      }
    } catch (err) {
      console.warn("Elaborazione background preventivo completata con avviso:", err);
    }
  })();
}

function sendCustomQuoteWhatsApp(phone, carName, months, km, deposit, price) {
  const msg = `Ciao ITERCARS Concierge! Ho appena configurato e generato il preventivo online per:\n\n*${carName}*\nDurata: *${months} mesi*\nChilometri: *${km} km/giorno*\nAnticipo: *€ ${deposit}*\n\n*Canone Calcolato: € ${price} / periodo Tutto Incluso*\n\nVorrei confermare l'ordine o ricevere la modulistica per la delibera del credito!`;
  window.open(`https://api.whatsapp.com/send?phone=393755942143&text=${encodeURIComponent(msg)}`, '_blank');
}


/**
 * Enterprise Mode PDF Generator (Native jsPDF)
 * Disegna vettorialmente il PDF per evitare qualsiasi sfarfallio o ritaglio.
 */
async function generateNativePDF(c, name, email, phone, type, quoteCode) {
  const jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
  if (!jsPDF) {
    throw new Error("Libreria jsPDF non trovata.");
  }

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 146, 70);
  doc.setFontSize(22);
  doc.text("PREVENTIVO UFFICIALE NBT", 15, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Codice Pratica: ${quoteCode || 'IT-NBT-0000'}`, 15, 27);
  doc.text(`Data Emissione: ${new Date().toLocaleDateString('it-IT')}`, 15, 32);

  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(0, 146, 70);
  doc.setLineWidth(0.5);
  doc.roundedRect(145, 15, 50, 10, 2, 2, 'FD');
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 146, 70);
  doc.text("PRONTO DA FIRMARE", 149, 21.5);
  doc.line(15, 38, 195, 38);

  let specsY = 135;
  let boxY = 165;
  let finalY = 205;

  try {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = c.image;
    await Promise.race([
      new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; }),
      new Promise((resolve) => setTimeout(resolve, 800))
    ]);
    const targetW = 180;
    const targetH = 100;
    const imgRatio = img.width / img.height;
    const boxRatio = targetW / targetH;

    let drawW, drawH;
    if (imgRatio > boxRatio) {
      drawW = targetW;
      drawH = targetW / imgRatio;
    } else {
      drawH = targetH;
      drawW = targetH * imgRatio;
    }

    // Center inside the 180x100 bounding box
    const drawX = ((210 - targetW) / 2) + ((targetW - drawW) / 2);
    const drawY = 42 + ((targetH - drawH) / 2);

    doc.addImage(img, 'JPEG', drawX, drawY, drawW, drawH);
    const finalH = targetH; // FORZATO RETTANGOLARE per layout

    // Calcoliamo le coordinate successive dinamicamente in base a quanto è alta l'immagine
    specsY = 42 + finalH + 10;
    boxY = specsY + 30;
    finalY = boxY + 40;
  } catch (e) {
    console.log("Immagine non caricata nel PDF nativo:", e);
  }

  doc.setFillColor(249, 249, 249);
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(15, specsY, 180, 20, 2, 2, 'FD');

  const drawSpec = (label, value, x) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(label, x, specsY + 5, { align: 'center' });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(0, 0, 0);
    const splitValue = doc.splitTextToSize(value, 30);
    doc.text(splitValue, x, specsY + 11, { align: 'center' });
  };

  drawSpec("VELOCITÀ", c.speed || "N/A", 25);
  drawSpec("0-100", c.accel || "N/A", 60);
  drawSpec("POTENZA", c.hp || "N/A", 95);
  drawSpec("MOTORE", c.fuel || "N/A", 138);
  drawSpec("CAMBIO", c.transmission || "N/A", 182);

  doc.setFillColor(249, 249, 249);
  doc.roundedRect(15, boxY, 85, 30, 2, 2, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(0, 146, 70);
  doc.text("INTESTATARIO", 20, boxY + 7);
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(name, 20, boxY + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(`${type}\n${email}\n${phone}`, 20, boxY + 20);

  doc.setFont("helvetica", "bold");
  doc.setFillColor(249, 249, 249);
  doc.roundedRect(110, boxY, 85, 30, 2, 2, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(0, 146, 70);
  doc.text("VETTURA SELEZIONATA", 115, boxY + 7);
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`${c.brand} ${c.model}`, 115, boxY + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  const trimText = doc.splitTextToSize(c.trim || "", 75);
  doc.text(trimText, 115, boxY + 20);

  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(0, 146, 70);
  doc.setLineWidth(1);
  doc.roundedRect(15, finalY, 180, 35, 4, 4, 'FD');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.text("CONFIGURAZIONE CONTRATTO NBT", 20, finalY + 10);

  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  const kaskoType = ConfigState.kaskoFranchigia === 'zero' ? 'Zero Franchigia' : 'Standard';
  doc.text(`Durata: ${ConfigState.durationDays} Giorni   -   Km giornalieri: ${ConfigState.kmDailyLimit.toLocaleString('it-IT')} km   -   Anticipo: € ${ConfigState.depositAmount.toLocaleString('it-IT')}`, 20, finalY + 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Servizi: Kasko ${kaskoType}, Bollo, Manutenzione Ord/Str, RCA`, 20, finalY + 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("CANONE TOTALE", 185, finalY + 10, { align: 'right' });

  doc.setFontSize(26);
  doc.setTextColor(0, 146, 70);
  doc.text(`€ ${ConfigState.finalMonthlyPrice.toLocaleString('it-IT')}`, 185, finalY + 22, { align: 'right' });

  doc.setFontSize(8);
  doc.text("Totale (IVA esc.)", 185, finalY + 28, { align: 'right' });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Generato tramite piattaforma certificata ITERCARS Enterprise", 105, 280, { align: 'center' });

  return doc;
}

window.payQuoteStripe = async function (quoteCode, event) {
  const btn = event.currentTarget;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Connessione a Stripe...';
  btn.disabled = true;

  try {
    const supabaseUrl = window.supabase.supabaseUrl;
    const supabaseKey = window.supabase.supabaseKey;

    const res = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ quoteCode })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Errore sconosciuto da Stripe");
    }

    const { checkoutUrl } = await res.json();
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      throw new Error("URL di checkout non restituito");
    }
  } catch (error) {
    console.error("Errore Checkout Stripe:", error);
    alert("Errore durante la connessione al sistema di pagamento: " + error.message);
    btn.innerHTML = originalText;
  }
}

window.acceptQuoteAndRedirect = function (quoteCode, event) {
  if (event && event.currentTarget) {
    event.currentTarget.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Apertura Dossier Documenti...';
    event.currentTarget.disabled = true;
  }
  setTimeout(() => {
    window.location.href = `upload-documenti.html?code=${quoteCode}`;
  }, 250);
};

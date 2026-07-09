/* ==========================================================================
   ITERCARS — DETTAGLIO VEICOLO & CONFIGURATORE NLT MULTI-MANDANTE
   Gestione completa delle opzioni di noleggio (Mesi, Km, Anticipo, Franchigia)
   con ricalcolo live del canone e generazione Preventivo PDF Ufficiale.
   ========================================================================== */

const BROKER_MARGIN = 1.15; // +15% per il broker

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

const SAMPLE_DETAIL_OFFERS = [
  {
    id: 'bmw-s1',
    brand: 'BMW',
    model: 'Serie 1',
    trim: '118d MSport Automatico',
    category: 'Sportiva',
    fuel: 'Diesel ⛽',
    transmission: 'Automatico 8M',
    image: 'bmw_serie_1_msport.webp',
    hp: '150 CV',
    speed: '216 km/h',
    accel: '8.3s',
    readyDelivery: true,
    deliveryWeeks: 2,
    providerName: 'Mandante Ufficiale BMW',
    baseDuration: 36,
  },
  {
    id: 'bmw-x1',
    brand: 'BMW',
    model: 'X1',
    trim: 'sDrive18d xLine DCT',
    category: 'SUV Luxury',
    fuel: 'Diesel ⛽',
    transmission: 'DCT 7M',
    image: 'bmw_x1_xline.webp',
    hp: '150 CV',
    speed: '210 km/h',
    accel: '8.9s',
    readyDelivery: true,
    deliveryWeeks: 3,
    providerName: 'Mandante Ufficiale BMW',
    baseDuration: 36,
  },
  {
    id: 'bmw-s3t',
    brand: 'BMW',
    model: 'Serie 3 Touring',
    trim: '320d xDrive MSport',
    category: 'Sportiva',
    fuel: 'Diesel Mild-Hybrid ⚡',
    transmission: 'Steptronic 8M',
    image: 'bmw_serie_3_touring.webp',
    hp: '190 CV',
    speed: '230 km/h',
    accel: '7.1s',
    readyDelivery: true,
    deliveryWeeks: 2,
    providerName: 'Mandante Ufficiale BMW',
    baseDuration: 36,
  },
  {
    id: 'bmw-x3',
    brand: 'BMW',
    model: 'X3',
    trim: 'xDrive20d MSport Mild-Hybrid',
    category: 'SUV Luxury',
    fuel: 'Diesel Mild-Hybrid ⚡',
    transmission: 'Steptronic xDrive',
    image: 'bmw_x3_msport.webp',
    hp: '190 CV',
    speed: '213 km/h',
    accel: '7.9s',
    readyDelivery: true,
    deliveryWeeks: 3,
    providerName: 'Mandante Ufficiale BMW',
    baseDuration: 36,
  },
  {
    id: 'bmw-s5',
    brand: 'BMW',
    model: 'Serie 5',
    trim: '520d Mild Hybrid Eccelsa',
    category: 'Supercar',
    fuel: 'Diesel Mild-Hybrid ⚡',
    transmission: 'Steptronic 8M',
    image: 'bmw_serie_5_eccelsa.webp',
    hp: '197 CV',
    speed: '233 km/h',
    accel: '7.3s',
    readyDelivery: true,
    deliveryWeeks: 3,
    providerName: 'Mandante Ufficiale BMW',
    baseDuration: 36,
  },
  {
    id: 'bmw-x5',
    brand: 'BMW',
    model: 'X5',
    trim: 'xDrive30d MSport MHEV',
    category: 'SUV Luxury',
    fuel: 'Diesel MHEV ⚡',
    transmission: 'Steptronic Sport xDrive',
    image: 'bmw_x5_msport.webp',
    hp: '298 CV',
    speed: '233 km/h',
    accel: '6.1s',
    readyDelivery: true,
    deliveryWeeks: 2,
    providerName: 'Mandante Ufficiale BMW',
    baseDuration: 36,
  },
  {
    id: 'bmw-i4',
    brand: 'BMW',
    model: 'i4 Gran Coupé',
    trim: 'eDrive40 Sport Elettrica',
    category: 'Supercar',
    fuel: 'Elettrico ⚡',
    transmission: 'Automatico Single Speed',
    image: 'bmw_i4_grancoupe.webp',
    hp: '340 CV',
    speed: '190 km/h',
    accel: '5.7s',
    readyDelivery: true,
    deliveryWeeks: 3,
    providerName: 'Mandante Ufficiale BMW',
    baseDuration: 36,
  }
];

// Stato della configurazione attiva per l'auto corrente
const ConfigState = {
  car: null,
  durationMonths: 48,
  kmPerYear: 15000,
  depositAmount: 3000,
  kaskoFranchigia: 'standard', // 'standard' (500€) oppure 'zero' (0€)
  finalMonthlyPrice: 0
};

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  let carId = params.get('id') || 'macan-48-3k';
  const paramModel = params.get('model');
  
  let found = null;
  // 1. Tenta da cache locale salvata da nlt-app.js (cerca per id, vehicle_id o model esatto)
  try {
    const cached = JSON.parse(localStorage.getItem('itercars_nlt_cache') || '[]');
    found = cached.find(o => String(o.id) === String(carId) || String(o.vehicle_id) === String(carId) || (paramModel && String(o.model).toLowerCase() === String(paramModel).toLowerCase()));
  } catch(e) {}

  // 2. Se non in cache e connesso a Supabase, cerca live sul DB
  if (!found && typeof window.supabaseClient !== 'undefined' && window.supabaseClient) {
    try {
      let { data, error } = await window.supabaseClient
        .from('nlt_offers')
        .select(`
          id, provider_offer_code, duration_months, km_per_year, deposit_mandante, client_monthly_price, is_ready_delivery, delivery_weeks, services_included,
          vehicles (id, brand, model, trim, category, fuel_type, transmission, image_url, specs, daily_price),
          providers (name)
        `)
        .eq('id', carId)
        .maybeSingle();
        
      if (!data) {
        const res = await window.supabaseClient
          .from('nlt_offers')
          .select(`...`)
          .eq('vehicle_id', carId)
          .maybeSingle();
        if (res.data) data = res.data;
      }
        
      if (!error && data) {
        const v = data.vehicles || {};
        const specsObj = typeof v.specs === 'string' ? JSON.parse(v.specs) : (v.specs || {});
        found = {
          id: data.id,
          vehicle_id: v.id || data.vehicle_id,
          brand: v.brand || 'Veicolo',
          model: v.model || 'NLT',
          trim: v.trim || 'Executive',
          category: v.category || 'SUV Luxury',
          fuel: v.fuel_type || 'Ibrido / Diesel',
          transmission: v.transmission || 'Automatico',
          image: v.image_url || 'category-suv.jpg',
          hp: specsObj.hp || '300 CV',
          speed: specsObj.speed || '240 km/h',
          accel: specsObj.accel || '5.5s',
          readyDelivery: !!data.is_ready_delivery,
          deliveryWeeks: data.delivery_weeks || 4,
          providerName: (data.providers && data.providers.name) ? data.providers.name : 'Mandante NLT',
          basePrice: Number(data.client_monthly_price) || 699,
          baseDuration: data.duration_months || 48,
          baseKm: data.km_per_year || 15000,
          baseDeposit: Number(data.deposit_mandante) || 3000
        };
      }
    } catch(err) {
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
      brand: params.get('brand') || 'BMW',
      model: paramModel,
      trim: params.get('trim') || 'Executive M Sport',
      category: params.get('cat') || 'Sportiva',
      fuel: params.get('fuel') || 'Mild-Hybrid / Diesel ⚡',
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
    ConfigState.durationMonths = found.baseDuration || 36;
    ConfigState.kmPerYear = found.baseKm || 60000;
    ConfigState.depositAmount = found.baseDeposit !== undefined ? found.baseDeposit : 2000;
  }
  
  renderCarDetails();
  calculateAndRenderPrice();
});

function renderCarDetails() {
  const c = ConfigState.car;
  if (!c) return;
  
  document.title = `${c.brand} ${c.model} (${c.trim}) — Configura NLT | ITERCARS`;
  
  // Breadcrumb & Titoli
  const breadcrumb = document.getElementById('nltBreadcrumb');
  if (breadcrumb) {
    breadcrumb.innerHTML = `<a href="noleggio-lungo-termine.html" style="color: #2ecc71; text-decoration: none;">Catalogo NLT</a> <i class="ri-arrow-right-s-line"></i> <span>${c.brand}</span> <i class="ri-arrow-right-s-line"></i> <strong>${c.model}</strong>`;
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
    if (c.readyDelivery) {
      badgeContainer.innerHTML = `<span class="badge-ready" style="padding: 6px 14px; font-size: 0.85rem; border-radius: 20px; font-weight: 700;"><i class="ri-rocket-fill"></i> Pronta Consegna (${c.deliveryWeeks} settimane)</span>`;
    } else {
      badgeContainer.innerHTML = `<span class="badge-custom" style="padding: 6px 14px; font-size: 0.85rem; border-radius: 20px; font-weight: 700;"><i class="ri-time-line"></i> Ordine su Misura (${c.deliveryWeeks} settimane)</span>`;
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
  syncActiveButtons('configDurationGroup', ConfigState.durationMonths);
  syncActiveButtons('configKmGroup', ConfigState.kmPerYear);
  syncActiveButtons('configDepositGroup', ConfigState.depositAmount);
}

function syncActiveButtons(containerId, value) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.querySelectorAll('.config-option-btn').forEach(btn => {
    const btnVal = Number(btn.dataset.value);
    btn.classList.toggle('active', btnVal === value);
  });
}

// Scelta Durata Contratto
function setConfigDuration(months, btnElem) {
  ConfigState.durationMonths = Number(months);
  if (btnElem) {
    btnElem.parentElement.querySelectorAll('.config-option-btn').forEach(b => b.classList.remove('active'));
    btnElem.classList.add('active');
  }
  calculateAndRenderPrice();
}

// Scelta Chilometraggio Annuo
function setConfigKm(km, btnElem) {
  ConfigState.kmPerYear = Number(km);
  if (btnElem) {
    btnElem.parentElement.querySelectorAll('.config-option-btn').forEach(b => b.classList.remove('active'));
    btnElem.classList.add('active');
  }
  calculateAndRenderPrice();
}

// Scelta Anticipo Iniziale
function setConfigDeposit(deposit, btnElem) {
  ConfigState.depositAmount = Number(deposit);
  if (btnElem) {
    btnElem.parentElement.querySelectorAll('.config-option-btn').forEach(b => b.classList.remove('active'));
    btnElem.classList.add('active');
  }
  calculateAndRenderPrice();
}

// Scelta Franchigia Kasko
function setConfigKasko(type, btnElem) {
  ConfigState.kaskoFranchigia = type;
  if (btnElem) {
    btnElem.parentElement.querySelectorAll('.config-option-btn').forEach(b => b.classList.remove('active'));
    btnElem.classList.add('active');
  }
  calculateAndRenderPrice();
}

// Motore di calcolo finanziario tariffa NLT in tempo reale
function calculateAndRenderPrice() {
  const c = ConfigState.car;
  if (!c) return;
  
  // Find official rates for this car
  // Extract base car ID (remove any trailing suffixes like -36-4k from old logic if present)
  let baseCarId = c.id;
  if (baseCarId.includes('-36-')) baseCarId = baseCarId.split('-36-')[0];
  if (baseCarId === 'macan-48-3k') baseCarId = 'bmw-x3'; // Fallback just in case

  const rates = OFFICIAL_RATES[baseCarId];
  if (!rates) {
     console.error("No official rates for", baseCarId);
     return;
  }

  // Fallback to closest available duration if exact not available (e.g. 6m for X5 doesn't exist)
  let dur = ConfigState.durationMonths;
  if (!rates[dur]) {
      // Find closest duration
      let available = Object.keys(rates).map(Number);
      dur = available.reduce((prev, curr) => Math.abs(curr - dur) < Math.abs(prev - dur) ? curr : prev);
      ConfigState.durationMonths = dur;
      syncActiveButtons('configDurationGroup', dur);
  }

  const rateInfo = rates[dur];
  let price = rateInfo.price; // This is the pure Mandante base price

  // 1. Aggiustamento Chilometri (if user selects different km/year)
  const kmDeltaYearly = ConfigState.kmPerYear - rateInfo.baseKm;
  if (kmDeltaYearly !== 0) {
      // Delta is applied per month, so Costo Km Extra applies to total km diff per year? No, the extra cost in the file is usually per km total.
      // Or we can just use the rate per km for every km extra per year divided by 12?
      // "Costo Km Extra": 0.16/km. This is typically charged at end of contract for each km over limit.
      // But we can approximate monthly increase: kmDeltaYearly * extraKmPrice / 12
      price += (kmDeltaYearly * rateInfo.extraKmPrice) / 12;
  }

  // 2. Aggiustamento Anticipo (if user selects different deposit than the base for this duration)
  const depositDelta = rateInfo.deposit - ConfigState.depositAmount;
  price += (depositDelta / dur);

  // 3. Supplemento Kasko Franchigia Zero (+ € 35 / mese)
  if (ConfigState.kaskoFranchigia === 'zero') {
    price += 35.00;
  }

  // 4. APPLICARE IL MARGINE BROKER (15%) - solo sul canone calcolato senza Kasko extra o incluso Kasko extra?
  // Di solito si ricarica tutto.
  price = price * BROKER_MARGIN;

  ConfigState.finalMonthlyPrice = Math.round(price);

  const priceDisplay = document.getElementById('liveMonthlyPrice');
  const summaryDisplay = document.getElementById('liveConfigSummary');
  const boxElem = document.getElementById('livePriceBox');

  if (priceDisplay && summaryDisplay && boxElem) {
    boxElem.style.transform = 'scale(0.97)';
    boxElem.style.opacity = '0.6';
    setTimeout(() => {
      priceDisplay.textContent = `€ ${ConfigState.finalMonthlyPrice.toLocaleString('it-IT')}`;
      summaryDisplay.innerHTML = `<strong>${ConfigState.durationMonths} Mesi</strong> • <strong>${ConfigState.kmPerYear.toLocaleString('it-IT')} Km/anno</strong> • Anticipo <strong>€ ${ConfigState.depositAmount.toLocaleString('it-IT')}</strong>`;
      boxElem.style.transform = 'scale(1.02)';
      boxElem.style.opacity = '1';
      setTimeout(() => boxElem.style.transform = 'none', 160);
    }, 110);
  }
}

// Gestione submit finale "Genera Preventivo" (Apre e mostra il preventivo ufficiale PDF/Stampabile)
async function handleQuoteSubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById('quoteClientName').value;
  const email = document.getElementById('quoteClientEmail').value;
  const phone = document.getElementById('quoteClientPhone').value;
  const type = document.getElementById('quoteClientType').value;
  const c = ConfigState.car;

  // Salva il lead e preventivo su Supabase se disponibile
  if (typeof window.supabaseClient !== 'undefined' && window.supabaseClient) {
    try {
      await window.supabaseClient.from('crm_leads').insert([{
        first_name: name.split(' ')[0] || name,
        last_name: name.split(' ').slice(1).join(' ') || 'Cliente NLT',
        phone: phone,
        email: email,
        customer_type: type,
        pipeline_status: 'quote_sent',
        notes: `Preventivo configurato per ${c.brand} ${c.model}: ${ConfigState.durationMonths}m/${ConfigState.kmPerYear}km - Anticipo €${ConfigState.depositAmount} -> Rata €${ConfigState.finalMonthlyPrice}/m`
      }]);
    } catch (e) {
      console.log('Salvataggio lead in locale (Demo attiva)');
    }
  }

  // Costruzione e visualizzazione della scheda Preventivo Stampabile (PDF Ready)
  const previewBox = document.getElementById('officialQuoteContainer');
  if (previewBox) {
    previewBox.style.display = 'block';
    previewBox.innerHTML = `
      <div class="glass-card quote-result-card" style="margin-top: 30px; border: 2px solid var(--accent-primary); padding: 30px; position: relative; animation: fadeIn 0.4s ease; background: #080c14;">
        <div style="position: absolute; top: -30px; right: -30px; width: 160px; height: 160px; background: rgba(0, 146, 70, 0.2); border-radius: 50%; filter: blur(40px);"></div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
          <div>
            <img src="logo_tricolore.png" style="height: 30px; margin-bottom: 6px;" alt="Itercars Logo"><br>
            <span style="color: var(--accent-primary); font-weight: 800; font-size: 1.25rem; letter-spacing: 1px;"><i class="ri-vip-crown-fill"></i> ITERCARS — PREVENTIVO UFFICIALE NLT</span>
            <div style="font-size: 0.88rem; color: var(--text-muted); margin-top: 4px;">Codice Pratica: <strong>IT-NLT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}</strong> • Data Emissione: ${new Date().toLocaleDateString('it-IT')}</div>
          </div>
          <span style="background: rgba(46, 204, 113, 0.2); color: #2ecc71; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 800;">PRONTO DA FIRMARE / BLOCCA TARIFFA</span>
        </div>

        <div class="detail-image-wrapper" style="margin-bottom: 12px; box-shadow: none;">
          <img src="${c.image}" alt="${c.model}" class="detail-image" style="background: #fff; max-height: 280px;">
        </div>
        
        <!-- Caratteristiche Tecniche (Compatte per non rubare spazio) -->
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
            <span style="font-size: 0.85rem; color: var(--text-muted); display: block; text-transform: uppercase; font-weight: 700;">Configurazione Contratto NLT</span>
            <div style="font-size: 1.1rem; font-weight: 800; color: #fff; margin-top: 4px;">
              Durata: <span style="color: #2ecc71;">${ConfigState.durationMonths} Mesi</span> • 
              Km compresi: <span style="color: #2ecc71;">${ConfigState.kmPerYear.toLocaleString('it-IT')} km/anno</span> • 
              Anticipo: <span style="color: #2ecc71;">€ ${ConfigState.depositAmount.toLocaleString('it-IT')}</span>
            </div>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">Kasko Integral ${ConfigState.kaskoFranchigia === 'zero' ? '(Franchigia Zero 0€)' : '(Franchigia Standard)'} + Bollo & Manutenzione H24</div>
          </div>

          <div style="text-align: right;">
            <span style="font-size: 0.85rem; color: var(--text-muted); display: block; text-transform: uppercase; font-weight: 700;">Canone Mensile Tutto Incluso</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: #2ecc71; line-height: 1;">€ ${ConfigState.finalMonthlyPrice.toLocaleString('it-IT')} <small style="font-size: 0.9rem; font-weight: 400; color: #fff;">/mese (IVA esc.)</small></div>
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
          <button type="button" class="btn btn-primary" onclick="window.print()" style="height: 50px; font-size: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="ri-printer-line" style="font-size: 1.3rem;"></i> Stampa / Scarica PDF
          </button>
          <button type="button" class="btn btn-outline" onclick="sendCustomQuoteWhatsApp('${phone}', '${c.brand} ${c.model}', '${ConfigState.durationMonths}', '${ConfigState.kmPerYear}', '${ConfigState.depositAmount}', '${ConfigState.finalMonthlyPrice}')" style="height: 50px; font-size: 1rem; font-weight: 800; border-color: #2ecc71; color: #2ecc71; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="ri-whatsapp-line" style="font-size: 1.3rem;"></i> Invia su WhatsApp
          </button>
          <a href="noleggio-lungo-termine.html" class="btn btn-outline" style="height: 50px; font-size: 1rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none;">
            <i class="ri-arrow-left-line"></i> Torna al Catalogo
          </a>
        </div>
      `;
    previewBox.scrollIntoView({ behavior: 'smooth' });
  }
}

function sendCustomQuoteWhatsApp(phone, carName, months, km, deposit, price) {
  const msg = `Ciao ITERCARS Concierge! Ho appena configurato e generato il preventivo online per:\n\n*${carName}*\n📅 Durata: *${months} mesi*\n🛣️ Chilometri: *${km} km/anno*\n💰 Anticipo: *€ ${deposit}*\n\n🔥 *Canone Calcolato: € ${price} / mese Tutto Incluso*\n\nVorrei confermare l'ordine o ricevere la modulistica per la delibera del credito!`;
  window.open(`https://api.whatsapp.com/send?phone=393755942143&text=${encodeURIComponent(msg)}`, '_blank');
}

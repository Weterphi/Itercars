/* ==========================================================================
   ITERCARS — DETTAGLIO VEICOLO & CONFIGURATORE NLT MULTI-MANDANTE
   Gestione completa delle opzioni di noleggio (Mesi, Km, Anticipo, Franchigia)
   con ricalcolo live del canone e generazione Preventivo PDF Ufficiale.
   ========================================================================== */

const BROKER_MARGIN = 1.0; // Rimosso doppio ricarico (+15%), le tariffe base e il backend hanno già il margine calcolato

const OFFICIAL_RATES = {
  '32226fdb-ba8c-4e46-8e21-e303e0a0fe3d': {
    6: { baseKm: 30000, kmTotal: 15000, deposit: 0, price: 650, extraKmPrice: 0.16, status: 'Disponibile' },
    12: { baseKm: 25000, kmTotal: 25000, deposit: 0, price: 580, extraKmPrice: 0.15, status: 'Disponibile' },
    24: { baseKm: 25000, kmTotal: 50000, deposit: 2000, price: 450, extraKmPrice: 0.14, status: 'Disponibile' },
    36: { baseKm: 25000, kmTotal: 75000, deposit: 2000, price: 390, extraKmPrice: 0.12, status: 'Disponibile' }
  },
  'bmw-s1': {
    6: { baseKm: 30000, kmTotal: 15000, deposit: 0, price: 650, extraKmPrice: 0.16, status: 'Disponibile' },
    12: { baseKm: 25000, kmTotal: 25000, deposit: 0, price: 580, extraKmPrice: 0.15, status: 'Disponibile' },
    24: { baseKm: 25000, kmTotal: 50000, deposit: 2000, price: 450, extraKmPrice: 0.14, status: 'Disponibile' },
    36: { baseKm: 25000, kmTotal: 75000, deposit: 2000, price: 390, extraKmPrice: 0.12, status: 'Disponibile' }
  },
  'ccaa728f-9b2d-4480-9f1c-76d7c97ccc79': {
    6: { baseKm: 30000, kmTotal: 15000, deposit: 0, price: 750, extraKmPrice: 0.18, status: 'Disponibile' },
    12: { baseKm: 25000, kmTotal: 25000, deposit: 0, price: 680, extraKmPrice: 0.16, status: 'Disponibile' },
    24: { baseKm: 25000, kmTotal: 50000, deposit: 3000, price: 520, extraKmPrice: 0.15, status: 'Disponibile' },
    36: { baseKm: 25000, kmTotal: 75000, deposit: 3000, price: 460, extraKmPrice: 0.14, status: 'Disponibile' }
  },
  'bmw-x1': {
    6: { baseKm: 30000, kmTotal: 15000, deposit: 0, price: 750, extraKmPrice: 0.18, status: 'Disponibile' },
    12: { baseKm: 25000, kmTotal: 25000, deposit: 0, price: 680, extraKmPrice: 0.16, status: 'Disponibile' },
    24: { baseKm: 25000, kmTotal: 50000, deposit: 3000, price: 520, extraKmPrice: 0.15, status: 'Disponibile' },
    36: { baseKm: 25000, kmTotal: 75000, deposit: 3000, price: 460, extraKmPrice: 0.14, status: 'Disponibile' }
  },
  'e3f556d9-8c52-43fd-9d81-ffb9c1551928': {
    6: { baseKm: 30000, kmTotal: 15000, deposit: 0, price: 890, extraKmPrice: 0.20, status: 'Disponibile' },
    12: { baseKm: 25000, kmTotal: 25000, deposit: 0, price: 820, extraKmPrice: 0.18, status: 'Disponibile' },
    24: { baseKm: 25000, kmTotal: 50000, deposit: 3500, price: 660, extraKmPrice: 0.16, status: 'In Arrivo' },
    36: { baseKm: 25000, kmTotal: 75000, deposit: 3500, price: 580, extraKmPrice: 0.15, status: 'Disponibile' }
  },
  'bmw-s3t': {
    6: { baseKm: 30000, kmTotal: 15000, deposit: 0, price: 890, extraKmPrice: 0.20, status: 'Disponibile' },
    12: { baseKm: 25000, kmTotal: 25000, deposit: 0, price: 820, extraKmPrice: 0.18, status: 'Disponibile' },
    24: { baseKm: 25000, kmTotal: 50000, deposit: 3500, price: 660, extraKmPrice: 0.16, status: 'In Arrivo' },
    36: { baseKm: 25000, kmTotal: 75000, deposit: 3500, price: 580, extraKmPrice: 0.15, status: 'Disponibile' }
  },
  '1933cb66-5804-45ef-b997-8e038059f0b4': {
    6: { baseKm: 30000, kmTotal: 15000, deposit: 0, price: 990, extraKmPrice: 0.22, status: 'Disponibile' },
    12: { baseKm: 25000, kmTotal: 25000, deposit: 0, price: 920, extraKmPrice: 0.20, status: 'Disponibile' },
    24: { baseKm: 25000, kmTotal: 50000, deposit: 4000, price: 740, extraKmPrice: 0.18, status: 'In Arrivo' },
    36: { baseKm: 25000, kmTotal: 75000, deposit: 4000, price: 650, extraKmPrice: 0.16, status: 'Disponibile' }
  },
  'bmw-x3': {
    6: { baseKm: 30000, kmTotal: 15000, deposit: 0, price: 990, extraKmPrice: 0.22, status: 'Disponibile' },
    12: { baseKm: 25000, kmTotal: 25000, deposit: 0, price: 920, extraKmPrice: 0.20, status: 'Disponibile' },
    24: { baseKm: 25000, kmTotal: 50000, deposit: 4000, price: 740, extraKmPrice: 0.18, status: 'In Arrivo' },
    36: { baseKm: 25000, kmTotal: 75000, deposit: 4000, price: 650, extraKmPrice: 0.16, status: 'Disponibile' }
  },
  '3b99316f-29bb-4392-86d3-98cc6e77485d': {
    12: { baseKm: 25000, kmTotal: 25000, deposit: 0, price: 1150, extraKmPrice: 0.25, status: 'Disponibile' },
    24: { baseKm: 25000, kmTotal: 50000, deposit: 5000, price: 890, extraKmPrice: 0.22, status: 'Disponibile' },
    36: { baseKm: 25000, kmTotal: 75000, deposit: 5000, price: 790, extraKmPrice: 0.20, status: 'Disponibile' }
  },
  'bmw-s5': {
    12: { baseKm: 25000, kmTotal: 25000, deposit: 0, price: 1150, extraKmPrice: 0.25, status: 'Disponibile' },
    24: { baseKm: 25000, kmTotal: 50000, deposit: 5000, price: 890, extraKmPrice: 0.22, status: 'Disponibile' },
    36: { baseKm: 25000, kmTotal: 75000, deposit: 5000, price: 790, extraKmPrice: 0.20, status: 'Disponibile' }
  },
  'f4c1e663-a663-4fba-81c1-8ed424caf0ba': {
    12: { baseKm: 25000, kmTotal: 25000, deposit: 0, price: 1450, extraKmPrice: 0.28, status: 'Disponibile' },
    24: { baseKm: 25000, kmTotal: 50000, deposit: 6000, price: 1180, extraKmPrice: 0.25, status: 'In Arrivo' },
    36: { baseKm: 25000, kmTotal: 75000, deposit: 6000, price: 1050, extraKmPrice: 0.22, status: 'Disponibile' }
  },
  'bmw-x5': {
    12: { baseKm: 25000, kmTotal: 25000, deposit: 0, price: 1450, extraKmPrice: 0.28, status: 'Disponibile' },
    24: { baseKm: 25000, kmTotal: 50000, deposit: 6000, price: 1180, extraKmPrice: 0.25, status: 'In Arrivo' },
    36: { baseKm: 25000, kmTotal: 75000, deposit: 6000, price: 1050, extraKmPrice: 0.22, status: 'Disponibile' }
  },
  'efce36a9-41fc-4285-a167-4badbcbbb2c6': {
    6: { baseKm: 30000, kmTotal: 15000, deposit: 0, price: 890, extraKmPrice: 0.20, status: 'Disponibile' },
    12: { baseKm: 25000, kmTotal: 25000, deposit: 0, price: 790, extraKmPrice: 0.18, status: 'Disponibile' },
    24: { baseKm: 25000, kmTotal: 50000, deposit: 4000, price: 640, extraKmPrice: 0.16, status: 'Disponibile' },
    36: { baseKm: 25000, kmTotal: 75000, deposit: 4000, price: 570, extraKmPrice: 0.15, status: 'Disponibile' }
  },
  'bmw-i4': {
    6: { baseKm: 30000, kmTotal: 15000, deposit: 0, price: 890, extraKmPrice: 0.20, status: 'Disponibile' },
    12: { baseKm: 25000, kmTotal: 25000, deposit: 0, price: 790, extraKmPrice: 0.18, status: 'Disponibile' },
    24: { baseKm: 25000, kmTotal: 50000, deposit: 4000, price: 640, extraKmPrice: 0.16, status: 'Disponibile' },
    36: { baseKm: 25000, kmTotal: 75000, deposit: 4000, price: 570, extraKmPrice: 0.15, status: 'Disponibile' }
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
    fuel: 'Diesel Mild-Hybrid',
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
    fuel: 'Diesel Mild-Hybrid',
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
    fuel: 'Diesel Mild-Hybrid',
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
    fuel: 'Diesel MHEV',
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
    fuel: 'Elettrico',
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
  let carId = params.get('id') || 'bmw-x3-48-3k';
  const paramModel = params.get('model');
  
  let found = null;
  // 1. Tenta da cache locale salvata da nlt-app.js (cerca per id, vehicle_id o model esatto)
  try {
    const cached = JSON.parse(localStorage.getItem('itercars_nlt_cache') || '[]');
    found = cached.find(o => String(o.id) === String(carId) || String(o.vehicle_id) === String(carId) || (paramModel && String(o.model).toLowerCase() === String(paramModel).toLowerCase()));
  } catch(e) {}

  // 2. Se non in cache e connesso a Supabase, cerca live sul DB
  if (!found && typeof window.supabase !== 'undefined' && window.supabase) {
    try {
      let { data, error } = await window.supabase
        .from('nlt_offers')
        .select(`
          id, provider_offer_code, duration_months, km_per_year, deposit_mandante, client_monthly_price, is_ready_delivery, delivery_weeks, services_included,
          vehicles (id, brand, model, trim, category, fuel_type, transmission, image_url, specs, daily_price),
          providers (name)
        `)
        .eq('id', carId)
        .maybeSingle();
        
      if (!data) {
        const res = await window.supabase
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
  
  // Renderizza i pacchetti rettangolari all-inclusive e aggiorna il canone
  renderRentalPackages();
}

function getRatesForCar(c) {
  if (!c) return OFFICIAL_RATES['bmw-s3t'];
  
  let baseCarId = String(c.id || '');
  if (baseCarId.includes('-36-')) baseCarId = baseCarId.split('-36-')[0];
  if (baseCarId === 'bmw-x3-48-3k') baseCarId = 'bmw-x3';
  
  let rates = OFFICIAL_RATES[baseCarId] || (c.vehicle_id ? OFFICIAL_RATES[String(c.vehicle_id)] : null);
  
  if (!rates && c.model) {
    const modelStr = String(c.model).toLowerCase();
    if (modelStr.includes('serie 1') || modelStr.includes('118')) rates = OFFICIAL_RATES['bmw-s1'];
    else if (modelStr.includes('x1')) rates = OFFICIAL_RATES['bmw-x1'];
    else if (modelStr.includes('serie 3')) rates = OFFICIAL_RATES['bmw-s3t'];
    else if (modelStr.includes('x3')) rates = OFFICIAL_RATES['bmw-x3'];
    else if (modelStr.includes('serie 5')) rates = OFFICIAL_RATES['bmw-s5'];
    else if (modelStr.includes('x5')) rates = OFFICIAL_RATES['bmw-x5'];
    else if (modelStr.includes('i4')) rates = OFFICIAL_RATES['bmw-i4'];
  }
  
  if (!rates) {
    // Generazione automatica di 4 pacchetti rettangolari (6, 12, 24, 36 mesi)
    const base = Number(c.basePrice) || 699;
    const baseDep = Number(c.baseDeposit !== undefined ? c.baseDeposit : 3000);
    rates = {
      6: { baseKm: 30000, kmTotal: 15000, deposit: 0, price: Math.round(base * 1.45), extraKmPrice: 0.20, status: 'Disponibile' },
      12: { baseKm: 25000, kmTotal: 25000, deposit: 0, price: Math.round(base * 1.25), extraKmPrice: 0.18, status: 'Disponibile' },
      24: { baseKm: 25000, kmTotal: 50000, deposit: baseDep, price: Math.round(base * 1.10), extraKmPrice: 0.16, status: 'Disponibile' },
      36: { baseKm: 25000, kmTotal: 75000, deposit: baseDep, price: Math.round(base), extraKmPrice: 0.15, status: 'Disponibile' }
    };
  }
  return rates;
}

function renderRentalPackages() {
  const container = document.getElementById('packagesListGrid');
  if (!container) return;
  
  const c = ConfigState.car;
  if (!c) return;
  
  const rates = getRatesForCar(c);
  const availableDurations = Object.keys(rates).map(Number).sort((a, b) => a - b);
  
  if (!availableDurations.includes(Number(ConfigState.durationMonths)) && availableDurations.length > 0) {
    ConfigState.durationMonths = availableDurations.includes(36) ? 36 : availableDurations[0];
  }
  
  const activeRate = rates[ConfigState.durationMonths] || rates[availableDurations[0]];
  if (activeRate) {
    const kmTot = activeRate.kmTotal || Math.round((activeRate.baseKm || 25000) * (ConfigState.durationMonths / 12));
    ConfigState.kmPerYear = kmTot;
    ConfigState.depositAmount = Number(activeRate.deposit || 0);
  }

  container.innerHTML = availableDurations.map(dur => {
    const r = rates[dur];
    const isSelected = Number(ConfigState.durationMonths) === dur;
    
    const kmTotal = r.kmTotal || Math.round((r.baseKm || 25000) * (dur / 12));
    const kmYearly = r.baseKm || Math.round(kmTotal * (12 / dur));
    
    const statusText = r.status || 'Disponibile';
    const statusClass = statusText.toLowerCase().includes('arrivo') ? 'status-inarrivo' : 'status-disponibile';
    const statusIcon = statusText.toLowerCase().includes('arrivo') ? 'ri-time-line' : 'ri-checkbox-circle-fill';
    
    const kmDisplayShort = dur === 12 
      ? `${kmTotal.toLocaleString('it-IT')} km`
      : `${Math.round(kmYearly).toLocaleString('it-IT')} km/anno`;
      
    const depositDisplay = r.deposit === 0 ? 'Anticipo 0 €' : `Anticipo € ${Number(r.deposit).toLocaleString('it-IT')}`;
    const displayPrice = Math.round((Number(r.price) + (ConfigState.kaskoFranchigia === 'zero' ? 35 : 0)) * BROKER_MARGIN);

    const selectCircleIcon = isSelected 
      ? `<i class="ri-radio-button-fill package-radio-icon selected"></i>` 
      : `<i class="ri-checkbox-blank-circle-line package-radio-icon"></i>`;

    return `
      <div class="package-option-card ${isSelected ? 'active' : ''}" onclick="selectRentalPackage(${dur})">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            ${selectCircleIcon}
            <div>
              <div style="font-size: 1.05rem; font-weight: 800; color: #fff; line-height: 1.25;">
                ${dur} mesi / ${kmDisplayShort}
              </div>
              <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 2px;">
                ${dur !== 12 ? `Totali ${kmTotal.toLocaleString('it-IT')} km nel contratto` : 'Chilometraggio annuo'}
              </div>
            </div>
          </div>
          <span class="package-status-badge ${statusClass}" style="padding: 3px 8px; font-size: 0.72rem;">
            <i class="${statusIcon}"></i> ${statusText}
          </span>
        </div>
        
        <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 10px; margin-top: 2px; display: flex; justify-content: space-between; align-items: baseline;">
          <div>
            <div style="font-size: 0.92rem; font-weight: 700; color: ${r.deposit === 0 ? '#f59e0b' : '#e2e8f0'};">
              ${depositDisplay}
            </div>
            ${r.extraKmPrice !== undefined ? `<div style="font-size: 0.72rem; color: var(--text-muted); margin-top: 2px;">Extra: € ${Number(r.extraKmPrice).toFixed(2).replace('.', ',')} / km</div>` : ''}
          </div>
          <div style="text-align: right;">
            <div style="font-size: 1.45rem; font-weight: 950; color: #2ecc71; line-height: 1;">
              € ${displayPrice.toLocaleString('it-IT')}<span style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted);">/mese*</span>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Scelta Pacchetto Noleggio (clic su blocco rettangolare)
function selectRentalPackage(dur) {
  const c = ConfigState.car;
  if (!c) return;
  
  const rates = getRatesForCar(c);
  const rateInfo = rates[dur] || rates[Object.keys(rates)[0]];
  if (!rateInfo) return;

  ConfigState.durationMonths = Number(dur);
  ConfigState.kmPerYear = rateInfo.kmTotal || Math.round((rateInfo.baseKm || 25000) * (dur / 12));
  ConfigState.depositAmount = Number(rateInfo.deposit || 0);
  
  const sa = document.getElementById('sidebarQuoteActions');
  if (sa && sa.style.display === 'block') sa.style.display = 'none';
  
  renderRentalPackages();
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
  
  renderRentalPackages();
  calculateAndRenderPrice();
}

// Motore di calcolo finanziario tariffa NLT
function calculateAndRenderPrice() {
  const c = ConfigState.car;
  if (!c) return;
  
  let dur = Number(ConfigState.durationMonths) || 36;
  const rates = getRatesForCar(c);
  const rateInfo = rates[dur] || rates[Object.keys(rates)[0]] || {
    baseKm: 25000,
    kmTotal: 75000,
    deposit: 3000,
    price: ConfigState.car?.basePrice || 699,
    extraKmPrice: 0.15,
    status: 'Disponibile'
  };

  const kmTotal = rateInfo.kmTotal || Math.round((rateInfo.baseKm || 25000) * (dur / 12));
  const kmYearly = rateInfo.baseKm || Math.round(kmTotal * (12 / dur));
  ConfigState.kmPerYear = kmTotal;
  ConfigState.depositAmount = Number(rateInfo.deposit || 0);

  let price = Number(rateInfo.price);
  if (ConfigState.kaskoFranchigia === 'zero') {
    price += 35.00;
  }
  price = price * BROKER_MARGIN;

  ConfigState.finalMonthlyPrice = Math.round(price);

  const priceDisplay = document.getElementById('liveMonthlyPrice');
  const summaryDisplay = document.getElementById('liveConfigSummary');
  const extraKmDisplay = document.getElementById('liveExtraKmInfo');
  const boxElem = document.getElementById('livePriceBox');

  if (priceDisplay && summaryDisplay && boxElem) {
    boxElem.style.transform = 'scale(0.97)';
    boxElem.style.opacity = '0.6';
    setTimeout(() => {
      priceDisplay.textContent = `€ ${ConfigState.finalMonthlyPrice.toLocaleString('it-IT')}`;
      const kmTextShown = dur === 12 
        ? `${kmTotal.toLocaleString('it-IT')} Km/anno`
        : `${kmTotal.toLocaleString('it-IT')} Km totali (${Math.round(kmYearly).toLocaleString('it-IT')}/anno)`;
      summaryDisplay.innerHTML = `<strong>${dur} Mesi</strong> • <strong>${kmTextShown}</strong> • Anticipo <strong>€ ${ConfigState.depositAmount.toLocaleString('it-IT')}</strong>`;
      if (extraKmDisplay && rateInfo.extraKmPrice !== undefined) {
        extraKmDisplay.innerHTML = `<i class="ri-information-line"></i> Costo Km Extra: € ${Number(rateInfo.extraKmPrice).toFixed(2).replace('.', ',')} / km`;
      }
      boxElem.style.transform = 'scale(1.02)';
      boxElem.style.opacity = '1';
      setTimeout(() => boxElem.style.transform = 'none', 160);
    }, 110);
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
  const quoteCode = `IT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  localStorage.setItem('itercars_last_quote_code', quoteCode);
  localStorage.setItem('itercars_last_quote', JSON.stringify({
    quote_code: quoteCode,
    final_monthly_price: ConfigState.finalMonthlyPrice,
    carTitle: `${c.brand} ${c.model} ${c.trim}`,
    selected_duration_months: ConfigState.durationMonths,
    selected_deposit: ConfigState.depositAmount,
    crm_leads: { first_name: name, email: email, customer_type: type }
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
            <span style="color: var(--accent-primary); font-weight: 800; font-size: 1.25rem; letter-spacing: 1px;"><i class="ri-vip-crown-fill"></i> ITERCARS — PREVENTIVO UFFICIALE NLT</span>
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
            <span style="font-size: 0.85rem; color: var(--text-muted); display: block; text-transform: uppercase; font-weight: 700;">Configurazione Contratto NLT</span>
            <div style="font-size: 1.1rem; font-weight: 800; color: #fff; margin-top: 4px;">
              Durata: <span style="color: #2ecc71;">${ConfigState.durationMonths} Mesi</span> • 
              Km compresi: <span style="color: #2ecc71;">${ConfigState.kmPerYear >= 35000 ? ConfigState.kmPerYear.toLocaleString('it-IT') + ' km totali (' + Math.round(ConfigState.kmPerYear / (ConfigState.durationMonths / 12)).toLocaleString('it-IT') + ' km/anno)' : ConfigState.kmPerYear.toLocaleString('it-IT') + ' km/anno'}</span> • 
              Anticipo: <span style="color: #2ecc71;">€ ${ConfigState.depositAmount.toLocaleString('it-IT')}</span>
            </div>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">Kasko Integral ${ConfigState.kaskoFranchigia === 'zero' ? '(Franchigia Zero 0€)' : '(Franchigia Standard)'} + Bollo & Manutenzione H24</div>
            <div style="font-size: 0.82rem; color: #f39c12; margin-top: 4px; font-weight: 600;"><i class="ri-information-line"></i> Costo Km Extra da tabella mandante compreso nel contratto</div>
          </div>

          <div style="text-align: right;">
            <span style="font-size: 0.85rem; color: var(--text-muted); display: block; text-transform: uppercase; font-weight: 700;">Canone Mensile Tutto Incluso</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: #2ecc71; line-height: 1;">€ ${ConfigState.finalMonthlyPrice.toLocaleString('it-IT')} <small style="font-size: 0.9rem; font-weight: 400; color: #fff;">/mese (IVA esc.)</small></div>
          </div>
        </div>

        <div id="nltToastInfo" style="margin-bottom: 16px; padding: 12px 18px; border-radius: 8px; background: rgba(46, 204, 113, 0.15); border: 1px solid #2ecc71; color: #fff; font-weight: 600; display: flex; align-items: center; gap: 10px;">
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
          <button type="button" class="btn btn-outline" onclick="sendCustomQuoteWhatsApp('${phone}', '${c.brand} ${c.model}', '${ConfigState.durationMonths}', '${ConfigState.kmPerYear}', '${ConfigState.depositAmount}', '${ConfigState.finalMonthlyPrice}')" style="height: 50px; font-size: 1rem; font-weight: 800; border-color: #2ecc71; color: #2ecc71; display: flex; align-items: center; justify-content: center; gap: 8px;">
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
          <button type="button" class="btn btn-outline" onclick="sendCustomQuoteWhatsApp('${phone}', '${c.brand} ${c.model}', '${ConfigState.durationMonths}', '${ConfigState.kmPerYear}', '${ConfigState.depositAmount}', '${ConfigState.finalMonthlyPrice}')" style="height: 48px; font-size: 0.95rem; font-weight: 800; border-color: #2ecc71; color: #2ecc71; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 0 8px;">
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
        let offerUuid = c.id && uuidRegex.test(c.id) ? c.id : null;
        let vehicleUuid = c.vehicle_id && uuidRegex.test(c.vehicle_id) ? c.vehicle_id : (offerUuid || null);

        const leadPayload = {
          first_name: name.split(' ')[0] || name,
          last_name: name.split(' ').slice(1).join(' ') || 'Cliente NLT',
          phone: phone,
          email: email,
          customer_type: type || 'Privato',
          vehicle_interest: `${c.brand} ${c.model} ${c.trim || ''}`.trim() + ` (${ConfigState.durationMonths} Mesi / ${ConfigState.kmPerYear} km/anno - Rata €${ConfigState.finalMonthlyPrice}/mese)`,
          pipeline_status: 'new_lead',
          assigned_broker_agent: 'Consulente Senior ITERCARS',
          interested_offer_id: offerUuid,
          interested_vehicle_id: vehicleUuid,
          notes: `Preventivo NLT [${quoteCode}] per ${c.brand} ${c.model}: ${ConfigState.durationMonths}m/${ConfigState.kmPerYear}km - Anticipo €${ConfigState.depositAmount} -> Rata €${ConfigState.finalMonthlyPrice}/mese`
        };

        let leadData = null;
        try {
          const { data: resData, error: leadErr } = await window.supabase.from('crm_leads').insert([leadPayload]).select();
          if (leadErr && (leadErr.code === '23503' || (leadErr.message && leadErr.message.toLowerCase().includes('foreign key')))) {
            leadPayload.interested_offer_id = null;
            leadPayload.interested_vehicle_id = null;
            const retry = await window.supabase.from('crm_leads').insert([leadPayload]).select();
            leadData = retry.data;
          } else {
            leadData = resData;
          }
        } catch (dbE) {
          console.warn("Errore inserimento crm_leads NLT:", dbE);
        }

        let newLeadId = leadData && leadData.length > 0 ? leadData[0].id : null;

        await window.supabase.from('quotes').insert([{
          quote_code: quoteCode,
          lead_id: newLeadId,
          vehicle_id: c.vehicle_id && c.vehicle_id.length === 36 ? c.vehicle_id : null,
          offer_id: c.id && c.id.length === 36 ? c.id : null,
          selected_duration_months: ConfigState.durationMonths,
          selected_km_per_year: ConfigState.kmPerYear,
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
           dettagli: `${c.brand} ${c.model} - ${ConfigState.durationMonths} Mesi, ${ConfigState.kmPerYear} km/anno, Anticipo €${ConfigState.depositAmount}`,
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
  const msg = `Ciao ITERCARS Concierge! Ho appena configurato e generato il preventivo online per:\n\n*${carName}*\n📅 Durata: *${months} mesi*\n🛣️ Chilometri: *${km} km/anno*\n💰 Anticipo: *€ ${deposit}*\n\n🔥 *Canone Calcolato: € ${price} / mese Tutto Incluso*\n\nVorrei confermare l'ordine o ricevere la modulistica per la delibera del credito!`;
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
  doc.text("PREVENTIVO UFFICIALE NLT", 15, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Codice Pratica: ${quoteCode || 'IT-NLT-0000'}`, 15, 27);
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
  doc.text("CONFIGURAZIONE CONTRATTO NLT", 20, finalY + 10);
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  const kaskoType = ConfigState.kaskoFranchigia === 'zero' ? 'Zero Franchigia' : 'Standard';
  doc.text(`Durata: ${ConfigState.durationMonths} Mesi   -   Km annui: ${ConfigState.kmPerYear.toLocaleString('it-IT')} km   -   Anticipo: € ${ConfigState.depositAmount.toLocaleString('it-IT')}`, 20, finalY + 18);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Servizi: Kasko ${kaskoType}, Bollo, Manutenzione Ord/Str, RCA`, 20, finalY + 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("CANONE MENSILE", 185, finalY + 10, { align: 'right' });
  
  doc.setFontSize(26);
  doc.setTextColor(0, 146, 70);
  doc.text(`€ ${ConfigState.finalMonthlyPrice.toLocaleString('it-IT')}`, 185, finalY + 22, { align: 'right' });
  
  doc.setFontSize(8);
  doc.text("/mese (IVA esc.)", 185, finalY + 28, { align: 'right' });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Generato tramite piattaforma certificata ITERCARS Enterprise", 105, 280, { align: 'center' });

  return doc;
}


async function payQuoteStripe(quoteCode, event) {
    if(!window.supabase || !window.supabase.supabaseUrl) {
        alert("Servizio Stripe non ancora attivo in questo ambiente locale (Supabase mancante).");
        return;
    }
    
    try {
        const btn = event.currentTarget;
        const originalHtml = btn.innerHTML;
        btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Preparazione Checkout...';
        btn.disabled = true;

        const res = await fetch(`${window.supabase.supabaseUrl}/functions/v1/stripe-checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.supabase.supabaseKey}`
            },
            body: JSON.stringify({ quoteCode })
        });
        
        const data = await res.json();
        
        if (data.checkoutUrl) {
            window.location.href = data.checkoutUrl;
        } else {
            alert('Errore Stripe: ' + (data.error || 'Impossibile avviare il checkout'));
            btn.innerHTML = originalHtml;
            btn.disabled = false;
        }
    } catch(err) {
        console.error(err);
        alert('Errore di rete con Stripe.');
        event.currentTarget.innerHTML = '<i class="ri-bank-card-line" style="font-size: 1.3rem;"></i> Paga Acconto e Prenota Vettura';
        event.currentTarget.disabled = false;
    }
}

window.acceptQuoteAndRedirect = function(quoteCode, event) {
    if (event && event.currentTarget) {
        event.currentTarget.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Apertura Dossier Documenti...';
        event.currentTarget.disabled = true;
    }
    setTimeout(() => {
        window.location.href = `upload-documenti.html?code=${quoteCode}`;
    }, 250);
};

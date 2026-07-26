/* ==========================================================================

   ITERCARS — NOLEGGIO LUNGO & BREVE TERMINE (NBT / NBT) CONTROLLER

   Gestione interattiva listini mandante, filtri dinamici, calcolatore rata

   in tempo reale e generazione preventivi 1-Click / Scoring.

   ========================================================================== */



// Stato globale dell'applicazione NBT/NBT

const NbtState = {

  mode: 'NBT', // 'NBT' (Breve Termine) oppure 'NBT' (Breve Termine)

  carSizeFilter: 'all',

  searchQuery: '',

  offers: []

};



// Dati d'esempio (Seed/Offline Fallback) sincronizzati con lo schema Supabase nbt_offers

const SAMPLE_OFFERS = [];



// Inizializzazione pagina

document.addEventListener('DOMContentLoaded', async () => {

  NbtState.offers = [];

  

  // Tenta di caricare da Supabase se disponibile, altrimenti usa offline seed

  await loadOffersFromDatabase();

  

  initFilterListeners();

  renderOffersGrid();

});



window.addEventListener('storage', (e) => {
  if (e.key === 'itercars_force_refresh' || e.key === 'itercars_nbt_cache') {
    loadOffersFromDatabase().then(() => renderOffersGrid());
  }
});

async function loadOffersFromDatabase() {
  if (typeof window.supabase !== 'undefined' && window.supabase) {
    try {
      // 1. Carica le offerte NBT dal database
      const params = new URLSearchParams(window.location.search);
      const cityFilter = params.get('city');

      const baseQuery = `
          *,
          vehicles!inner (id, brand, model, trim, category, fuel_type, transmission, image_url, specs, daily_price, deposit, city, macchina_piccola, macchina_media, macchina_grande),
          providers (id, name, logo_url)
        `;

      let query = window.supabase
        .from('nbt_offers')
        .select(baseQuery)
        .eq('is_active', true);

      if (cityFilter) {
        query = query.ilike('vehicles.city', `%${cityFilter}%`);
      }

      const { data, error } = await query;

      // 2. Carica in parallelo tutti i veicoli NBT live dalla flotta per catturare le modifiche dirette del partner
      const { data: vehList } = await window.supabase
        .from('vehicles')
        .select('*')
        .eq('is_available', true)
        .eq('is_nbt', true);

      const vehMap = {};
      if (vehList && Array.isArray(vehList)) {
        vehList.forEach(vh => { if (vh.id) vehMap[vh.id] = vh; });
      }

      if (!error && data && data.length > 0) {
        console.log('✅ Caricate offerte NBT da Supabase DB:', data.length);

        const mapped = data.map(o => {
          const vBase = o.vehicles || {};
          const v = (vehMap && vehMap[vBase.id || o.vehicle_id]) ? Object.assign({}, vBase, vehMap[vBase.id || o.vehicle_id]) : vBase;
          const pName = (o.providers && o.providers.name) ? o.providers.name : 'Mandante NBT';
          const specsObj = typeof v.specs === 'string' ? JSON.parse(v.specs) : (v.specs || {});

          // Diamo priorità assoluta ai prezzi salvati in tabella 'vehicles' (dove il Partner salva live le modifiche tariffarie)
          const dailyP = (v.daily_price !== undefined && v.daily_price !== null && v.daily_price !== '' && Number(v.daily_price) > 0) 
            ? Number(v.daily_price) 
            : ((o.daily_price !== undefined && o.daily_price !== null && o.daily_price !== '') ? Number(o.daily_price) : 120);

          const depositP = (v.deposit !== undefined && v.deposit !== null && v.deposit !== '' && Number(v.deposit) >= 0) 
            ? Number(v.deposit) 
            : ((o.deposit_required !== undefined && o.deposit_required !== null && o.deposit_required !== '') ? Number(o.deposit_required) : ((o.deposit_mandante !== undefined && o.deposit_mandante !== null && o.deposit_mandante !== '') ? Number(o.deposit_mandante) : 1500));

          const monthlyP = Math.round(dailyP * 20);

          const readyDeliv = (specsObj.is_ready_delivery !== undefined) ? !!specsObj.is_ready_delivery : (o.is_ready_delivery !== undefined ? !!o.is_ready_delivery : (v.is_ready_delivery !== undefined ? !!v.is_ready_delivery : true));
          const delivWeeks = specsObj.delivery_weeks !== undefined ? Number(specsObj.delivery_weeks) : (v.delivery_weeks !== undefined ? Number(v.delivery_weeks) : (o.delivery_weeks !== undefined ? Number(o.delivery_weeks) : 1));
          const delivDate = specsObj.delivery_date || v.delivery_date || o.delivery_date || '';

          return {
            id: o.id,
            vehicle_id: v.id || o.vehicle_id,
            brand: v.brand || 'Veicolo',
            model: v.model || 'NBT',
            trim: v.trim || 'Executive',
            category: v.category || 'SUV Luxury',
            macchina_piccola: o.macchina_piccola || v.macchina_piccola || false,
            macchina_media: o.macchina_media || v.macchina_media || false,
            macchina_grande: o.macchina_grande || v.macchina_grande || false,
            fuel: v.motore || v.fuel_type || 'Ibrido / Diesel',
            transmission: v.transmission || 'Automatico',
            image: v.image_url ? v.image_url.replace(/\.(png|jpg|jpeg)$/i, '.webp') : 'logo_fallback.png',
            hp: specsObj.hp || '300 CV',
            speed: specsObj.speed || '240 km/h',
            accel: specsObj.accel || '5.5s',
            readyDelivery: readyDeliv,
            deliveryWeeks: delivWeeks,
            deliveryDate: delivDate,
            providerName: pName,
            provider_id: o.provider_id || v.provider_id || null,
            nbtDailyPrice: dailyP,
            basePrice: monthlyP,
            baseDuration: 30,
            baseKm: (o.km_daily_limit || 150) * 30,
            baseDeposit: depositP,
            baseOffer: {
              duration: 30,
              km: (o.km_daily_limit || 150) * 30,
              deposit: depositP,
              monthlyPrice: monthlyP,
              zeroDepositPrice: Math.round(monthlyP + (depositP / 30))
            },
            variants: [
              { duration: 1, deposit: depositP, price: dailyP },
              { duration: 7, deposit: depositP, price: Math.round(dailyP * 6.5) },
              { duration: 15, deposit: depositP, price: Math.round(dailyP * 13) },
              { duration: 30, deposit: depositP, price: monthlyP }
            ],
            services: ['Assicurazione RCA & Kasko completa', 'Manutenzione Ordinaria e Straordinaria', 'Assistenza Stradale H24 ed Auto Sostitutiva', 'Tasse e Oneri Burocratici', 'Gestione Pneumatici']
          };
        });

        // Aggiungi anche eventuali veicoli live su 'vehicles' che non hanno ancora una riga in 'nbt_offers'
        if (vehList && Array.isArray(vehList)) {
          const existingVehIds = new Set(mapped.map(item => String(item.vehicle_id)));
          vehList.forEach(vh => {
            if (vh.is_nbt === true && vh.id && !existingVehIds.has(String(vh.id))) {
              const specsObj = typeof vh.specs === 'string' ? JSON.parse(vh.specs) : (vh.specs || {});
              const dPrice = Number(vh.daily_price) || 120;
              const depPrice = Number(vh.deposit) || 1500;
              const mPrice = Math.round(dPrice * 20);
              const readyDeliv = (specsObj.is_ready_delivery !== undefined) ? !!specsObj.is_ready_delivery : (vh.is_ready_delivery !== undefined ? !!vh.is_ready_delivery : true);
              const delivWeeks = specsObj.delivery_weeks !== undefined ? Number(specsObj.delivery_weeks) : (vh.delivery_weeks !== undefined ? Number(vh.delivery_weeks) : 1);
              const delivDate = specsObj.delivery_date || vh.delivery_date || '';
              mapped.push({
                id: vh.id,
                vehicle_id: vh.id,
                brand: vh.brand || 'Veicolo',
                model: vh.model || 'NBT',
                trim: vh.trim || 'Executive',
                category: vh.category || 'SUV Luxury',
                macchina_piccola: vh.macchina_piccola || false,
                macchina_media: vh.macchina_media || false,
                macchina_grande: vh.macchina_grande || false,
                fuel: vh.motore || vh.fuel_type || 'Ibrido / Diesel',
                transmission: vh.transmission || 'Automatico',
                image: vh.image_url ? vh.image_url.replace(/\.(png|jpg|jpeg)$/i, '.webp') : 'logo_fallback.png',
                hp: specsObj.hp || '300 CV',
                speed: specsObj.speed || '240 km/h',
                accel: specsObj.accel || '5.5s',
                readyDelivery: readyDeliv,
                deliveryWeeks: delivWeeks,
                deliveryDate: delivDate,
                providerName: 'Partner Flotta Live',
                provider_id: vh.provider_id || null,
                nbtDailyPrice: dPrice,
                basePrice: mPrice,
                baseDuration: 30,
                baseKm: 4500,
                baseDeposit: depPrice,
                baseOffer: {
                  duration: 30,
                  km: 4500,
                  deposit: depPrice,
                  monthlyPrice: mPrice,
                  zeroDepositPrice: Math.round(mPrice + (depPrice / 30))
                },
                variants: [
                  { duration: 1, deposit: depPrice, price: dPrice },
                  { duration: 7, deposit: depPrice, price: Math.round(dPrice * 6.5) },
                  { duration: 15, deposit: depPrice, price: Math.round(dPrice * 13) },
                  { duration: 30, deposit: depPrice, price: mPrice }
                ],
                services: ['Assicurazione RCA & Kasko completa', 'Manutenzione Ordinaria e Straordinaria', 'Assistenza Stradale H24 ed Auto Sostitutiva', 'Tasse e Oneri Burocratici', 'Gestione Pneumatici']
              });
            }
          });
        }

        if (mapped.length > 0) {
          // Prezzi e offerte NBT rigorosamente allineati al database in tempo reale
          NbtState.offers = mapped; populateDynamicFilters();
        } else {
          NbtState.offers = [];
        }
      } else if (vehList && vehList.length > 0) {
        const mappedVehs = vehList.filter(vh => vh.is_nbt === true).map(vh => {
          const specsObj = typeof vh.specs === 'string' ? JSON.parse(vh.specs) : (vh.specs || {});
          const dPrice = Number(vh.daily_price) || 120;
          const depPrice = Number(vh.deposit) || 1500;
          const mPrice = Math.round(dPrice * 20);
          const readyDeliv = (specsObj.is_ready_delivery !== undefined) ? !!specsObj.is_ready_delivery : (vh.is_ready_delivery !== undefined ? !!vh.is_ready_delivery : true);
          const delivWeeks = specsObj.delivery_weeks !== undefined ? Number(specsObj.delivery_weeks) : (vh.delivery_weeks !== undefined ? Number(vh.delivery_weeks) : 1);
          const delivDate = specsObj.delivery_date || vh.delivery_date || '';
          return {
            id: vh.id,
            vehicle_id: vh.id,
            brand: vh.brand || 'Veicolo',
            model: vh.model || 'NBT',
            trim: vh.trim || 'Executive',
            category: vh.category || 'SUV Luxury',
            macchina_piccola: vh.macchina_piccola || false,
            macchina_media: vh.macchina_media || false,
            macchina_grande: vh.macchina_grande || false,
            fuel: vh.motore || vh.fuel_type || 'Ibrido / Diesel',
            transmission: vh.transmission || 'Automatico',
            image: vh.image_url ? vh.image_url.replace(/\.(png|jpg|jpeg)$/i, '.webp') : 'logo_fallback.png',
            hp: specsObj.hp || '300 CV',
            speed: specsObj.speed || '240 km/h',
            accel: specsObj.accel || '5.5s',
            readyDelivery: readyDeliv,
            deliveryWeeks: delivWeeks,
            deliveryDate: delivDate,
            providerName: 'Partner Flotta Live',
            provider_id: vh.provider_id || null,
            nbtDailyPrice: dPrice,
            basePrice: mPrice,
            baseDuration: 30,
            baseKm: 4500,
            baseDeposit: depPrice,
            baseOffer: {
              duration: 30,
              km: 4500,
              deposit: depPrice,
              monthlyPrice: mPrice,
              zeroDepositPrice: Math.round(mPrice + (depPrice / 30))
            },
            variants: [
              { duration: 1, deposit: depPrice, price: dPrice },
              { duration: 7, deposit: depPrice, price: Math.round(dPrice * 6.5) },
              { duration: 15, deposit: depPrice, price: Math.round(dPrice * 13) },
              { duration: 30, deposit: depPrice, price: mPrice }
            ],
            services: ['Assicurazione RCA & Kasko completa', 'Manutenzione Ordinaria e Straordinaria', 'Assistenza Stradale H24 ed Auto Sostitutiva', 'Tasse e Oneri Burocratici', 'Gestione Pneumatici']
          };
        });
        NbtState.offers = mappedVehs; populateDynamicFilters();
      } else {
        NbtState.offers = [];
      }
    } catch (err) {
      console.warn('⚠️ Fallback offline: utilizzo catalogo NBT ufficiale mandante.');
      NbtState.offers = [];
    }
  } else {

    NbtState.offers = [];

  }



  // Normalizzazione campi base per garantire immediato e perfetto aggancio in nbt-dettaglio.js

  NbtState.offers.forEach(o => {

    if (o.basePrice === undefined && o.baseOffer?.monthlyPrice !== undefined) o.basePrice = Number(o.baseOffer.monthlyPrice);

    if (o.baseDuration === undefined && o.baseOffer?.duration !== undefined) o.baseDuration = Number(o.baseOffer.duration);

    if (o.baseKm === undefined && o.baseOffer?.km !== undefined) o.baseKm = Number(o.baseOffer.km);

    if (o.baseDeposit === undefined && o.baseOffer?.deposit !== undefined) o.baseDeposit = Number(o.baseOffer.deposit);

  });



  window.lastLoadedOffers = NbtState.offers;

  try { localStorage.setItem('itercars_nbt_cache', JSON.stringify(NbtState.offers)); } catch(e){}

}



// Switch tra Breve Termine (NBT) e Breve Termine (NBT)

function setRentalMode(mode) {

  NbtState.mode = mode;

  

  const nltBtn = document.getElementById('modeBtnNBT');

  const nbtBtn = document.getElementById('modeBtnNBT');

  const heroTitle = document.getElementById('nltHeroTitle');

  const heroSub = document.getElementById('nltHeroSub');

  const filterDurationGroup = document.getElementById('filterDurationGroup');

  const filterDepositGroup = document.getElementById('filterDepositGroup');

  

  if (mode === 'NBT') {

    if (nltBtn) nltBtn.classList.add('active-mode');

    if (nbtBtn) nbtBtn.classList.remove('active-mode');

    if (heroTitle) heroTitle.innerHTML = `Noleggio Auto <span class="text-gradient">Breve Termine (NBT)</span>`;

    if (heroSub) heroSub.textContent = `Canone fisso tutto incluso: Assicurazione Kasko, Manutenzione, Bollo e Soccorso 24/7 compresi.`;

    if (filterDurationGroup) filterDurationGroup.style.display = 'flex';

    if (filterDepositGroup) filterDepositGroup.style.display = 'flex';

  } else {

    if (nbtBtn) nbtBtn.classList.add('active-mode');

    if (nltBtn) nltBtn.classList.remove('active-mode');

    if (heroTitle) heroTitle.innerHTML = `Noleggio Auto <span class="text-gradient">Breve Termine (NBT)</span>`;

    if (heroSub) heroSub.textContent = `Noleggia da 1 a 30 giorni con consegna VIP al tuo hotel, villa o terminal jet privato.`;

    if (filterDurationGroup) filterDurationGroup.style.display = 'none';

    if (filterDepositGroup) filterDepositGroup.style.display = 'none';

  }

  

  renderOffersGrid();

}



// Inizializza i filtri della barra

function initFilterListeners() {
  window.setCarSizeFilter = function(size, btnElem) {
    if (NbtState.carSizeFilter === size) {
      NbtState.carSizeFilter = 'all';
      if (btnElem) btnElem.classList.remove('active');
    } else {
      NbtState.carSizeFilter = size;
      document.querySelectorAll('.filter-car-size').forEach(el => el.classList.remove('active'));
      if (btnElem) btnElem.classList.add('active');
    }
    renderOffersGrid();
  };
}



function triggerHeroSearch() {

  const heroInput = document.getElementById('heroSearchInput');

  if (heroInput) {

    NbtState.searchQuery = heroInput.value.toLowerCase().trim();

    const searchInput = document.getElementById('nltSearchInput');

    if (searchInput) searchInput.value = heroInput.value;

    renderOffersGrid();

  }

  const gridSection = document.getElementById('nbtGrid');

  if (gridSection) {

    gridSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

  }

}



function setDepositFilter(val, btnElem) {

  NbtState.depositFilter = val;

  document.querySelectorAll('.filter-pill-deposit').forEach(el => el.classList.remove('active'));

  if (btnElem) btnElem.classList.add('active');

  renderOffersGrid();

}



function setDurationFilter(val, btnElem) {

  NbtState.durationFilter = parseInt(val, 10);

  document.querySelectorAll('.filter-pill-duration').forEach(el => el.classList.remove('active'));

  if (btnElem) btnElem.classList.add('active');

  renderOffersGrid();

}



function setCategoryFilter(val, btnElem) {

  NbtState.categoryFilter = val;

  document.querySelectorAll('.filter-pill-category').forEach(el => el.classList.remove('active'));

  if (btnElem) btnElem.classList.add('active');

  renderOffersGrid();

}



function setVisualCategory(val, btnElem) {

  NbtState.visualCategory = val;

  document.querySelectorAll('.category-pill').forEach(el => el.classList.remove('active'));

  if (btnElem) btnElem.classList.add('active');

  renderOffersGrid();

}



function toggleReadyDelivery(btnElem) {

  NbtState.readyDeliveryOnly = !NbtState.readyDeliveryOnly;

  if (btnElem) btnElem.classList.toggle('active', NbtState.readyDeliveryOnly);

  renderOffersGrid();

}



// Trova la variante prezzo per una card specifica in base alla durata/anticipo scelti

function getCardPrice(offer, duration, depositMode) {

  if (NbtState.mode === 'NBT') {
    const days = duration || 1;
    const price = (offer.nbtDailyPrice || 120) * days;
    const dep = (offer.baseDeposit !== undefined && offer.baseDeposit !== null) ? offer.baseDeposit : (offer.baseOffer?.deposit || 1500);
    return { price: price, label: ' Totale (IVA esc.)', details: `${days} ${days === 1 ? "Giorno" : "Giorni"} • Deposito €${Number(dep).toLocaleString('it-IT')}` };
}


  

  // Cerchiamo nelle varianti della vettura

  const targetDuration = duration || NbtState.durationFilter;

  let targetDeposit = 3000;

  if (depositMode === '0' || NbtState.depositFilter === '0') targetDeposit = 0;

  else if (depositMode === '5000' || NbtState.depositFilter === '5000') targetDeposit = 5000;

  else if (NbtState.depositFilter === '3000') targetDeposit = 3000;

  

  const match = offer.variants.find(v => v.duration === targetDuration && (targetDeposit === 0 ? v.deposit === 0 : v.deposit > 0));

  if (match) {

    return {

      price: match.price,

      label: '€ / giorno (IVA esclusa)',

      details: `${match.duration} mesi — Anticipo € ${match.deposit.toLocaleString('it-IT')} — 15.000 km/anno`

    };

  }

  

  return {

    price: offer.baseOffer.monthlyPrice,

    label: '€ / giorno (Tutto Incluso)',

    details: `${offer.baseOffer.duration} mesi — Anticipo € ${offer.baseOffer.deposit.toLocaleString('it-IT')}`

  };

}



// Generazione dinamica della griglia

function renderOffersGrid() {

  const grid = document.getElementById('nbtGrid');

  const countDisplay = document.getElementById('offersCountText');

  if (!grid) return;

  

  // Filtraggio

  const filtered = NbtState.offers.filter(offer => {

    // Ricerca testuale

    if (NbtState.searchQuery) {

      const full = `${offer.brand} ${offer.model} ${offer.trim} ${offer.category}`.toLowerCase();

      if (!full.includes(NbtState.searchQuery)) return false;

    }

    // Filtro per dimensione auto
    if (NbtState.carSizeFilter !== 'all') {
      if (NbtState.carSizeFilter === 'piccola' && !offer.macchina_piccola) return false;
      if (NbtState.carSizeFilter === 'media' && !offer.macchina_media) return false;
      if (NbtState.carSizeFilter === 'grande' && !offer.macchina_grande) return false;
    }

    return true;

  });



  if (countDisplay) {

    countDisplay.textContent = filtered.length;

  }



  if (filtered.length === 0) {

    grid.innerHTML = `

      <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">

        <i class="ri-search-eye-line" style="font-size: 3.5rem; color: var(--accent-primary); margin-bottom: 16px; display: block;"></i>

        <h3 style="font-size: 1.5rem; margin-bottom: 8px;">Nessuna vettura corrisponde ai filtri selezionati</h3>

        <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 24px;">Prova ad aumentare il budget giornaliero, a selezionare un anticipo diverso o a rimuovere il filtro Pronta Consegna.</p>

        <button class="btn btn-outline" onclick="resetAllFilters()"><i class="ri-refresh-line"></i> Resetta tutti i filtri</button>

      </div>

    `;

    return;

  }



  try { localStorage.setItem('itercars_nbt_cache', JSON.stringify(NbtState.offers)); } catch(e){}



  grid.innerHTML = filtered.map(offer => {

    const priceInfo = getCardPrice(offer);

    let badgeText = `<span class="card-badge badge-ready"><i class="ri-rocket-fill"></i> Pronta Consegna</span>`;
    if (offer.deliveryDate && offer.deliveryDate !== '') {
      let fDate = offer.deliveryDate;
      try { const p = offer.deliveryDate.split('-'); if (p.length === 3) fDate = `${p[2]}/${p[1]}/${p[0]}`; } catch(e){}
      badgeText = `<span class="card-badge badge-custom" style="background: rgba(59, 130, 246, 0.15); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.3);"><i class="ri-calendar-event-line"></i> Disponibile dal ${fDate}</span>`;
    } else if (offer.readyDelivery && (offer.deliveryWeeks === 1 || offer.deliveryWeeks <= 1)) {
      badgeText = `<span class="card-badge badge-ready"><i class="ri-rocket-fill"></i> Pronta Consegna</span>`;
    } else if (offer.readyDelivery) {
      badgeText = `<span class="card-badge badge-ready"><i class="ri-rocket-fill"></i> Pronta Consegna (${offer.deliveryWeeks} sett.)</span>`;
    } else {
      badgeText = `<span class="card-badge badge-custom" style="background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3);"><i class="ri-time-line"></i> Consegna tra ${offer.deliveryWeeks || 4} sett.</span>`;
    }

      

    const depositZeroTag = offer.variants.some(v => v.deposit === 0)

      ? `<span class="card-badge badge-zero"><i class="ri-flashlight-fill"></i> Anticipo Zero Disponibile</span>` : '';



    return `

      <div class="glass-card nbt-card" id="card-${offer.id}">

        <div class="nbt-card-img-wrapper">

          <img src="${offer.image}" alt="${offer.brand} ${offer.model}" class="nbt-card-img" onerror="this.src='category-suv.jpg'">

          <div class="nbt-card-badges">

            ${badgeText}

            ${depositZeroTag}

          </div>

          <div class="nbt-provider-tag"><i class="ri-shield-star-fill"></i> Listino ${offer.providerName}</div>

        </div>



        <div class="nbt-card-body">

          <div class="nbt-card-header">

            <span class="nbt-brand-tag">${offer.brand}</span>

            <h3 class="nbt-model-title">${offer.model} <small style="font-size: 0.8rem; font-weight: 400; display: block; color: var(--text-muted);">${offer.trim}</small></h3>

          </div>



          <!-- Specifiche Veloci -->

          <div class="nbt-specs-row">

            <span><i class="ri-speed-up-line"></i> ${offer.hp}</span>

            <span><i class="ri-dashboard-2-line"></i> ${offer.accel} (0-100)</span>

            <span><i class="ri-gas-station-line"></i> ${offer.fuel}</span>

            <span><i class="ri-settings-4-line"></i> ${offer.transmission}</span>

          </div>



          <!-- Interruttore Rapido Mesi & Anticipo dentro la card (Solo in NBT) -->

          ${NbtState.mode === 'NBT' ? `

          <div class="card-interactive-selector">
<div class="card-selector-label">Scegli Durata Noleggio:</div>
<div class="card-duration-tabs">
<button class="card-tab active" onclick="updateSingleCardPrice('${offer.id}', 1, 'default', event)">1 Giorno</button>
<button class="card-tab" onclick="updateSingleCardPrice('${offer.id}', 2, 'default', event)">2 Giorni</button>
<button class="card-tab" onclick="updateSingleCardPrice('${offer.id}', 5, 'default', event)">5 Giorni</button>
</div>
</div>

          ` : ''}



          <!-- Box Rata Finale / Prezzo -->

          <div class="nbt-price-box" id="price-box-${offer.id}">

            <div class="nbt-price-num text-gradient">€ <span id="price-num-${offer.id}">${priceInfo.price.toLocaleString('it-IT')}</span></div>

            <div class="nbt-price-label">${priceInfo.label}</div>

            <div class="nbt-price-details" id="price-details-${offer.id}">${priceInfo.details}</div>

          </div>



          <!-- Elenco Servizi Inclusi -->

          <div class="nbt-services-list">

            ${offer.services.slice(0, 3).map(s => `<div><i class="ri-checkbox-circle-fill text-green"></i> <span>${s}</span></div>`).join('')}

            <div style="font-size: 0.75rem; color: var(--accent-primary); margin-top: 2px;">+ Bollo, Gestione Pratiche & Assistenza H24</div>

          </div>



          <!-- Pulsanti d'Azione -->

          <div class="nbt-card-actions">

            <a href="nbt-dettaglio.html?id=${offer.id}&vid=${offer.vehicle_id}&model=${encodeURIComponent(offer.model)}&brand=${encodeURIComponent(offer.brand)}&trim=${encodeURIComponent(offer.trim)}&img=${encodeURIComponent(offer.image)}&hp=${encodeURIComponent(offer.hp)}&speed=${encodeURIComponent(offer.speed)}&accel=${encodeURIComponent(offer.accel)}&price=${offer.basePrice || offer.baseOffer?.monthlyPrice || 699}&deposit=${offer.baseDeposit || offer.baseOffer?.deposit || 3000}&km=${offer.baseKm || offer.baseOffer?.km || 15000}&dur=${offer.baseDuration || offer.baseOffer?.duration || 48}&cat=${encodeURIComponent(offer.category || 'Luxury')}&fuel=${encodeURIComponent(offer.fuel || 'Ibrido / Diesel')}&trans=${encodeURIComponent(offer.transmission || 'Automatico')}&loc=${encodeURIComponent(document.getElementById('searchLocation') ? document.getElementById('searchLocation').value : '')}" class="btn btn-primary" style="flex: 1.4; padding: 12px 16px; font-weight: 700; text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 6px;">

              <span>Vedi Offerta</span> <i class="ri-arrow-right-up-line" style="font-size: 1.15rem;"></i>

            </a>

            <button type="button" class="btn btn-outline" onclick="openWhatsAppForCard('${offer.id}')" title="Contatta su WhatsApp" style="padding: 12px 14px; color: #2ecc71; border-color: rgba(46, 204, 113, 0.4);">

              <i class="ri-whatsapp-line" style="font-size: 1.3rem;"></i>

            </button>

          </div>

        </div>

      </div>

    `;

  }).join('');

}



// Calcolo istantaneo all'interno della singola card con animazione di ricalcolo

function updateSingleCardPrice(offerId, duration, depositMode, event) {

  const offer = NbtState.offers.find(o => o.id === offerId);

  if (!offer) return;



  // Evidenzia bottone cliccato

  const parentTabs = event.target.closest('.card-duration-tabs');

  if (parentTabs) {

    parentTabs.querySelectorAll('.card-tab').forEach(b => b.classList.remove('active', 'active-zero'));

    if (depositMode === '0') event.target.classList.add('active-zero');

    else event.target.classList.add('active');

  }



  const priceInfo = getCardPrice(offer, duration, depositMode);

  const numElem = document.getElementById(`price-num-${offerId}`);

  const detailsElem = document.getElementById(`price-details-${offerId}`);

  const boxElem = document.getElementById(`price-box-${offerId}`);



  if (numElem && detailsElem && boxElem) {

    boxElem.style.transform = 'scale(0.96)';

    boxElem.style.opacity = '0.5';

    setTimeout(() => {

      numElem.textContent = priceInfo.price.toLocaleString('it-IT');

      detailsElem.textContent = priceInfo.details;

      boxElem.style.transform = 'scale(1.03)';

      boxElem.style.opacity = '1';

      setTimeout(() => boxElem.style.transform = 'none', 180);

    }, 120);

  }

}



function resetAllFilters() {

  NbtState.maxBudget = 4000;

  NbtState.maxAnticipo = 15000;

  NbtState.brandFilter = 'all';

  NbtState.fuelFilter = 'all';

  NbtState.transmissionFilter = 'all';

  NbtState.depositFilter = 'all';

  NbtState.durationFilter = 48;

  NbtState.categoryFilter = 'all';

  NbtState.visualCategory = 'all';

  NbtState.readyDeliveryOnly = false;

  NbtState.carSizeFilter = 'all';

  NbtState.searchQuery = '';

  document.querySelectorAll('.filter-car-size').forEach(el => el.classList.remove('active'));

  

  const heroSearchInput = document.getElementById('heroSearchInput');

  if (heroSearchInput) heroSearchInput.value = '';

  const searchInput = document.getElementById('nltSearchInput');

  if (searchInput) searchInput.value = '';

  

  const bSlider = document.getElementById('heroBudgetSlider');

  if (bSlider) { bSlider.value = 4000; document.getElementById('budgetValueDisplayText').textContent = 'Illimitato'; }

  const aSlider = document.getElementById('heroAnticipoSlider');

  if (aSlider) { aSlider.value = 15000; document.getElementById('anticipoValueDisplayText').textContent = 'Qualsiasi'; }

  

  if (document.getElementById('filterMarca')) document.getElementById('filterMarca').value = 'all';

  if (document.getElementById('filterTipologia')) document.getElementById('filterTipologia').value = 'all';

  if (document.getElementById('filterAlimentazione')) document.getElementById('filterAlimentazione').value = 'all';

  if (document.getElementById('filterCambio')) document.getElementById('filterCambio').value = 'all';



  document.querySelectorAll('.category-pill').forEach((el, idx) => {

    if (idx === 0) el.classList.add('active');

    else el.classList.remove('active');

  });

  

  renderOffersGrid();

}



// Modale Preventivo 1-Click & Dossier Scoring

function openQuoteModal(offerId) {

  const offer = NbtState.offers.find(o => o.id === offerId);

  if (!offer) return;

  

  const priceInfo = getCardPrice(offer);

  

  const modal = document.getElementById('quoteModal');

  const title = document.getElementById('quoteModalCarTitle'); const img = document.getElementById('quoteModalImg'); if (img) img.src = offer.image;

  const subtitle = document.getElementById('quoteModalCarTrim');

  const priceDisplay = document.getElementById('quoteModalPriceText');

  const detailsDisplay = document.getElementById('quoteModalDetailsText');

  const imgElem = document.getElementById('quoteModalImg');

  const hiddenId = document.getElementById('quoteHiddenOfferId');



  if (title) title.textContent = `${offer.brand} ${offer.model}`;

  if (subtitle) subtitle.textContent = `${offer.trim} • Listino ${offer.providerName}`;

  if (priceDisplay) priceDisplay.innerHTML = `€ ${priceInfo.price.toLocaleString('it-IT')} <small style="font-size: 0.9rem; font-weight: 400; color: var(--text-muted);">${priceInfo.label}</small>`;

  if (detailsDisplay) detailsDisplay.textContent = priceInfo.details;

  if (imgElem) imgElem.src = offer.image;

  if (hiddenId) hiddenId.value = offer.id;



  // Anteprima servizi nella modale

  const sList = document.getElementById('quoteModalServicesList');

  if (sList) {

    sList.innerHTML = offer.services.map(s => `

      <div style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; color: var(--text-main);">

        <i class="ri-check-double-fill text-green" style="font-size: 1.1rem;"></i> <span>${s}</span>

      </div>

    `).join('');

  }



  if (modal) {

    modal.classList.add('open');

    modal.style.display = 'flex';

  }

}



function closeQuoteModal() {

  const modal = document.getElementById('quoteModal');

  if (modal) {

    modal.classList.remove('open');

    modal.style.display = 'none';

  }

}



// Invio modulo per generazione immediata PDF o invio pratica su Supabase

async function handleGeneratePDFSubmit(event) {

  event.preventDefault();

  const name = document.getElementById('quoteClientName').value;

  const email = document.getElementById('quoteClientEmail').value;

  const phone = document.getElementById('quoteClientPhone').value;

  const type = document.getElementById('quoteClientType').value;

  const offerId = document.getElementById('quoteHiddenOfferId').value;

  

  const offer = NbtState.offers.find(o => o.id === offerId);

  const priceInfo = getCardPrice(offer);



  // Salva il lead su Supabase crm_leads se connesso

  if (typeof window.supabase !== 'undefined' && window.supabase) {
    try {
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      let vehicleUuid = offer.vehicle_id && uuidRegex.test(offer.vehicle_id) ? offer.vehicle_id : (offer.id && uuidRegex.test(offer.id) ? offer.id : null);
      let rawProvId = offer.provider_id || (offer.vehicles && offer.vehicles.provider_id) || null;
      let provUuid = (rawProvId && uuidRegex.test(rawProvId)) ? rawProvId : null;
      let provName = offer.providerName || offer.provider_company_name || 'Mandante NBT';
      const locElem = document.getElementById('searchLocation');
      const locText = (locElem && locElem.value) ? ' [Località: ' + locElem.value + ']' : '';

      const leadPayload = {
        first_name: name.split(' ')[0] || name,
        last_name: name.split(' ').slice(1).join(' ') || 'Cliente NBT',
        phone: phone,
        email: email,
        customer_type: type || 'Privato',
        vehicle_interest: `${offer.brand} ${offer.model} ${offer.trim || ''}`.trim() + ` (${priceInfo.details || ''} - Rata €${priceInfo.price}/giorno)`,
        pipeline_status: 'new_lead',
        assigned_broker_agent: 'Consulente Senior ITERCARS',
        provider_id: provUuid,
        interested_offer_id: null,
        interested_vehicle_id: vehicleUuid,
        notes: `Preventivo 1-Click NBT per ${offer.brand} ${offer.model}: ${priceInfo.details} - Canone ${priceInfo.price} €/periodo [Mandante: ${provName}]`
      };

      const { error: leadErr } = await window.supabase.from('crm_leads').insert([leadPayload]);
      if (leadErr) {
        console.warn("Avviso 1-click crm_leads NBT, ritento senza foreign keys:", leadErr);
        leadPayload.interested_vehicle_id = null;
        leadPayload.provider_id = null;
        await window.supabase.from('crm_leads').insert([leadPayload]);
      }
    } catch (e) {
      console.log('Salvataggio lead crm_leads NBT 1-click completato o con avviso in demo:', e);
    }
  }



  // Visualizza l'anteprima del preventivo stampabile su schermo (Emissione PDF 1-Click)

  const previewBox = document.getElementById('quotePdfPreviewBox');

  if (previewBox) {

    previewBox.style.display = 'block';

    previewBox.innerHTML = `

      <div id="quotePdfContent" style="background: #0b0f19; border: 2px solid var(--accent-primary); border-radius: 14px; padding: 24px; text-align: left; position: relative; overflow: hidden; margin-top: 16px; animation: fadeIn 0.3s ease;">

        <div style="position: absolute; top: -20px; right: -20px; width: 120px; height: 120px; background: rgba(0, 146, 70, 0.15); border-radius: 50%; filter: blur(30px);"></div>

        

        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 12px; margin-bottom: 16px;">

          <div>

            <span style="color: var(--accent-primary); font-weight: 800; font-size: 1.1rem;"><i class="ri-vip-crown-fill"></i> ITERCARS PREVENTIVO UFFICIALE</span>

            <div style="font-size: 0.8rem; color: var(--text-muted);">Codice Offerta: ${offer.baseOffer ? 'IT-NBT-2026-88' : 'IT-NBT-2026'} • Data: ${new Date().toLocaleDateString('it-IT')}</div>

          </div>

          <span style="background: rgba(46, 204, 113, 0.2); color: #2ecc71; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 700;">PRONTO DA FIRMARE</span>

        </div>



        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 16px; font-size: 0.9rem;">

          <div>

            <strong style="color: var(--text-muted); display: block; font-size: 0.8rem;">INTESTAZIONE CLIENTE:</strong>

            <span style="color: #fff; font-weight: 700;">${name}</span> (${type})<br>

            <span style="color: var(--text-muted);">${email} • ${phone}</span>

          </div>

          <div>

            <strong style="color: var(--text-muted); display: block; font-size: 0.8rem;">VETTURA SELEZIONATA:</strong>

            <span style="color: #fff; font-weight: 700;">${offer.brand} ${offer.model}</span><br>

            <span style="color: var(--text-muted);">${offer.trim}</span>

          </div>

        </div>



        <div style="background: rgba(0,0,0,0.4); border: 1px solid var(--border-glass); border-radius: 10px; padding: 14px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">

          <div>

            <span style="font-size: 0.8rem; color: var(--text-muted);">Configurazione: ${priceInfo.details}</span>

            <div style="font-size: 1.3rem; font-weight: 800; color: var(--accent-primary);">€ ${priceInfo.price.toLocaleString('it-IT')} <small style="font-size: 0.8rem; font-weight: 400; color: #fff;">${priceInfo.label}</small></div>

          </div>

          <div style="text-align: right; font-size: 0.8rem; color: #2ecc71;">

            ✔ Assicurazione Kasko VIP<br>✔ Bollo & Manutenzione<br>✔ Consegna Garantita

          </div>

        </div>



        <div style="display: flex; gap: 12px;" class="pdf-exclude">

          <button type="button" class="btn btn-outline" onclick="window.print()" style="flex: 1; height: 44px; font-size: 0.95rem;">

            <i class="ri-printer-line"></i> Stampa

          </button>

          <button type="button" class="btn btn-primary" onclick="downloadInstantPDF('${offer.id}')" style="flex: 2; height: 44px; font-size: 0.95rem; font-weight: 800;">

            <i class="ri-download-cloud-2-fill"></i> Scarica PDF Istantaneo

          </button>

        </div>

      </div>

    `;

    previewBox.scrollIntoView({ behavior: 'smooth' });

  }

}



async function downloadInstantPDF(offerId) {
  const offer = NbtState.offers.find(o => o.id === offerId);
  if (!offer) return;
  const priceInfo = getCardPrice(offer);
  
  const jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
  if (!jsPDF) {
    alert("Libreria PDF non trovata.");
    return;
  }

  const name = document.getElementById('quoteClientName').value || 'Cliente';
  const email = document.getElementById('quoteClientEmail').value || '';
  const phone = document.getElementById('quoteClientPhone').value || '';
  const type = document.getElementById('quoteClientType').value || '';

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 146, 70);
  doc.setFontSize(22);
  doc.text("PREVENTIVO UFFICIALE NBT", 15, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Codice Pratica: IT-NBT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`, 15, 27);
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
    img.src = offer.image;
    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
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
  
  drawSpec("VELOCITÀ", offer.speed || "N/A", 25);
  drawSpec("0-100", offer.accel || "N/A", 60);
  drawSpec("POTENZA", offer.hp || "N/A", 95);
  drawSpec("MOTORE", offer.fuel || "N/A", 138);
  drawSpec("CAMBIO", offer.transmission || "N/A", 182);

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
  doc.text(`${type}
${email}
${phone}`, 20, boxY + 20);

  doc.setFont("helvetica", "bold");
  doc.setFillColor(249, 249, 249);
  doc.roundedRect(110, boxY, 85, 30, 2, 2, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(0, 146, 70);
  doc.text("VETTURA SELEZIONATA", 115, boxY + 7);
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`${offer.brand} ${offer.model}`, 115, boxY + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  const trimText = doc.splitTextToSize(offer.trim || "", 75);
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
  doc.text(`Configurazione: ${priceInfo.details}`, 20, finalY + 18);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Servizi inclusi: Kasko, Manutenzione e Bollo.`, 20, finalY + 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("CANONE GIORNALIERO", 185, finalY + 10, { align: 'right' });
  
  doc.setFontSize(26);
  doc.setTextColor(0, 146, 70);
  doc.text(`€ ${priceInfo.price.toLocaleString('it-IT')}`, 185, finalY + 22, { align: 'right' });
  
  doc.setFontSize(8);
  doc.text("/giorno (IVA esc.)", 185, finalY + 28, { align: 'right' });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Generato tramite piattaforma certificata ITERCARS Enterprise", 105, 280, { align: 'center' });

  doc.save(`Preventivo_ITERCARS_${offer.brand}_${offer.model}.pdf`.replace(/ /g, '_'));
}




function openWhatsAppForCard(offerId) {

  const offer = NbtState.offers.find(o => o.id === offerId);

  if (!offer) return;

  const priceInfo = getCardPrice(offer);

  const msg = `Ciao ITERCARS Concierge! Vorrei maggiori informazioni sul Noleggio Breve Termine per *${offer.brand} ${offer.model} (${offer.trim})* con canone esposto a *€ ${priceInfo.price}/giorno*. È disponibile in pronta consegna?`;

  window.open(`https://api.whatsapp.com/send?phone=393755942143&text=${encodeURIComponent(msg)}`, '_blank');

}


function populateDynamicFilters() {
  const stateOffers = NbtState.offers;
  if (!stateOffers || stateOffers.length === 0) return;

  const brands = new Set();
  const categories = new Set();
  const fuels = new Set();
  const transmissions = new Set();

  stateOffers.forEach(o => {
    if (o.brand) brands.add(o.brand);
    if (o.category) categories.add(o.category);
    if (o.fuel) fuels.add(o.fuel);
    if (o.transmission) transmissions.add(o.transmission);
  });

  const updateSelect = (id, defaultLabel, itemsSet) => {
    const el = document.getElementById(id);
    if (!el) return;
    
    // Maintain current selected value if possible
    const currentVal = el.value;
    
    let html = `<option value="all" style="background: #111; color: #fff;">${defaultLabel}</option>`;
    Array.from(itemsSet).sort().forEach(item => {
      html += `<option value="${item}" style="background: #111; color: #fff;">${item}</option>`;
    });
    el.innerHTML = html;
    
    if (itemsSet.has(currentVal)) {
      el.value = currentVal;
    } else {
      el.value = 'all';
    }
  };

  updateSelect('filterMarca', 'Marca: Tutte', brands);
  updateSelect('filterTipologia', 'Cat: Tutte', categories);
  updateSelect('filterAlimentazione', 'Motore: Tutti', fuels);
  updateSelect('filterCambio', 'Cambio: Tutti', transmissions);
}

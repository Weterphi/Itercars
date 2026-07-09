import re
import codecs

js_path = r'c:\Users\alber\Desktop\LuxuryCar\nlt-dettaglio.js'

with codecs.open(js_path, 'r', 'utf-8') as f:
    content = f.read()

# Replace the SAMPLE_DETAIL_OFFERS
new_offers = """const BROKER_MARGIN = 1.15; // +15% per il broker

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
];"""

content = re.sub(r'const SAMPLE_DETAIL_OFFERS = \[.*?\];', new_offers, content, flags=re.DOTALL)

# Find calculateAndRenderPrice and replace its logic
new_calc = """function calculateAndRenderPrice() {
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
}"""

content = re.sub(r'function calculateAndRenderPrice\(\) \{.*?\}\n\}', new_calc + '\n', content, flags=re.DOTALL)
# One more try in case the regex missed it
content = re.sub(r'function calculateAndRenderPrice\(\) \{[\s\S]*?(?=\n// Gestione submit finale)', new_calc + '\n', content)

with codecs.open(js_path, 'w', 'utf-8') as f:
    f.write(content)

print("Updated JS file")

import re

with open('nbt-dettaglio.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. State changes
content = content.replace('durationMonths: 48,', 'durationDays: 7,')
content = content.replace('kmPerYear: 15000,\n  depositAmount: 3000,', 'depositAmount: 3000,')

# 2. Config functions
content = content.replace('function setConfigKm', 'function obsolete_setConfigKm')

# 3. Calculate price function replacement
new_calc = '''// Motore di calcolo finanziario tariffa NBT in tempo reale
function calculateAndRenderPrice() {
  const c = ConfigState.car;
  if (!c) return;

  // Prezzo base giornaliero (preso dai dati o calcolato dal mensile)
  let baseDailyPrice = c.nbtDailyPrice || (c.basePrice ? c.basePrice / 30 : 50);

  // Calcolo prezzo per i giorni selezionati
  let price = baseDailyPrice * ConfigState.durationDays;

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
'''
content = re.sub(r'// Motore di calcolo finanziario tariffa NBT in tempo reale\s*function calculateAndRenderPrice\(\) \{.*?(?=\n\}\n)\n\}\n', new_calc, content, flags=re.DOTALL)

# Also replace sync references
content = content.replace('ConfigState.durationMonths = dur;', 'ConfigState.durationDays = dur;')
content = content.replace('ConfigState.durationMonths', 'ConfigState.durationDays')

with open('nbt-dettaglio.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated nbt-dettaglio.js")

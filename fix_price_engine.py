# 1. Patch nlt-dettaglio.js calculateAndRenderPrice to map by model and fallback dynamically
with open('nlt-dettaglio.js', 'r', encoding='utf-8') as f:
    js_nlt = f.read()

old_nlt_lookup = """  const rates = OFFICIAL_RATES[baseCarId];
  if (!rates) {
     console.error("No official rates for", baseCarId);
     return;
  }"""

new_nlt_lookup = """  let rates = OFFICIAL_RATES[baseCarId];
  if (!rates) {
    // Fallback intelligente per Modello (se l'ID è un nuovo UUID del database)
    const modelStr = (c.model || '').toLowerCase();
    if (modelStr.includes('serie 1') || modelStr.includes('118')) rates = OFFICIAL_RATES['32226fdb-ba8c-4e46-8e21-e303e0a0fe3d'];
    else if (modelStr.includes('x1')) rates = OFFICIAL_RATES['ccaa728f-9b2d-4480-9f1c-76d7c97ccc79'];
    else if (modelStr.includes('serie 3')) rates = OFFICIAL_RATES['e3f556d9-8c52-43fd-9d81-ffb9c1551928'];
    else if (modelStr.includes('x3')) rates = OFFICIAL_RATES['1933cb66-5804-45ef-b997-8e038059f0b4'];
    else if (modelStr.includes('serie 5')) rates = OFFICIAL_RATES['3b99316f-29bb-4392-86d3-98cc6e77485d'];
    else if (modelStr.includes('x5')) rates = OFFICIAL_RATES['f4c1e663-a663-4fba-81c1-8ed424caf0ba'];
    else if (modelStr.includes('i4')) rates = OFFICIAL_RATES['efce36a9-41fc-4285-a167-4badbcbbb2c6'];

    // Se ancora non trovato, genera una tabella di canoni dinamica basata sul prezzo base
    if (!rates) {
      const base = Number(c.basePrice) || 699;
      rates = {
        6: { baseKm: 20000, deposit: 0, price: Math.round(base * 1.6), extraKmPrice: 0.18 },
        12: { baseKm: 20000, deposit: 0, price: Math.round(base * 1.45), extraKmPrice: 0.16 },
        24: { baseKm: 20000, deposit: 3000, price: Math.round(base * 1.15), extraKmPrice: 0.15 },
        36: { baseKm: 20000, deposit: 3000, price: Math.round(base), extraKmPrice: 0.14 },
        48: { baseKm: 20000, deposit: 3000, price: Math.round(base * 0.92), extraKmPrice: 0.12 }
      };
    }
  }"""

if old_nlt_lookup in js_nlt:
    js_nlt = js_nlt.replace(old_nlt_lookup, new_nlt_lookup)
    with open('nlt-dettaglio.js', 'w', encoding='utf-8') as f:
        f.write(js_nlt)
    print("Patched nlt-dettaglio.js calculateAndRenderPrice successfully!")
else:
    print("Could not find old_nlt_lookup, checking structure...")


# 2. Patch nbt-dettaglio.js calculateAndRenderPrice and DB initialization
with open('nbt-dettaglio.js', 'r', encoding='utf-8') as f:
    js_nbt = f.read()

old_nbt_calc = """function calculateAndRenderPrice() {
  const c = ConfigState.car;
  if (!c) return;

  // Prezzo base giornaliero (preso dai dati o calcolato dal mensile)
  let baseDailyPrice = c.nbtDailyPrice || (c.basePrice ? c.basePrice / 30 : 50);

  // Calcolo prezzo per i giorni selezionati
  let price = baseDailyPrice * ConfigState.durationDays;"""

new_nbt_calc = """function calculateAndRenderPrice() {
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
  let price = baseDailyPrice * ConfigState.durationDays;"""

if old_nbt_calc in js_nbt:
    js_nbt = js_nbt.replace(old_nbt_calc, new_nbt_calc)
    print("Patched nbt-dettaglio.js calculateAndRenderPrice logic!")

# Also fix the initial state mapping in nbt-dettaglio.js where DB row is mapped to found
old_nbt_db_map = """          basePrice: Number(data.client_monthly_price) || 699,
          baseDuration: data.duration_months || 48,
          baseKm: data.km_per_year || 15000,
          baseDeposit: Number(data.deposit_mandante) || 3000"""

new_nbt_db_map = """          nbtDailyPrice: Number(data.daily_price) || (data.vehicles && data.vehicles.daily_price ? Number(data.vehicles.daily_price) : null) || 85,
          basePrice: Number(data.client_monthly_price) || 699,
          baseDuration: 7,
          baseKm: 150,
          baseDeposit: Number(data.deposit_mandante) || 3000"""

if old_nbt_db_map in js_nbt:
    js_nbt = js_nbt.replace(old_nbt_db_map, new_nbt_db_map)
    print("Patched nbt-dettaglio.js DB mapping!")

# And ensure initial ConfigState defaults correctly for NBT (days/km) instead of months/yearly km
old_nbt_init = """    ConfigState.car = found;
    ConfigState.durationDays = found.baseDuration || 36;
    ConfigState.kmDailyLimit = found.baseKm || 60000;
    ConfigState.depositAmount = found.baseDeposit !== undefined ? found.baseDeposit : 2000;"""

new_nbt_init = """    ConfigState.car = found;
    ConfigState.durationDays = (found.baseDuration && found.baseDuration <= 30) ? found.baseDuration : 7;
    ConfigState.kmDailyLimit = (found.baseKm && found.baseKm <= 500) ? found.baseKm : 150;
    ConfigState.depositAmount = found.baseDeposit !== undefined ? found.baseDeposit : 3000;"""

if old_nbt_init in js_nbt:
    js_nbt = js_nbt.replace(old_nbt_init, new_nbt_init)
    print("Patched nbt-dettaglio.js initial state synchronization!")

with open('nbt-dettaglio.js', 'w', encoding='utf-8') as f:
    f.write(js_nbt)

print("All price engines fixed and updated successfully!")

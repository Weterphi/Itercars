import re

with open('nbt-dettaglio.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Update ConfigState
js = js.replace('depositAmount: 3000,', 'kmDailyLimit: 150,\n  depositAmount: 3000,')

# 2. Add setConfigKmDaily function before obsolete_setConfigKm
new_func = '''function setConfigKmDaily(km, btnElem) {
  ConfigState.kmDailyLimit = Number(km);
  if (btnElem) {
    btnElem.parentElement.querySelectorAll('.config-option-btn').forEach(b => b.classList.remove('active'));
    btnElem.classList.add('active');
  }
  calculateAndRenderPrice();
}

function obsolete_setConfigKm'''
js = js.replace('function obsolete_setConfigKm', new_func)

# 3. Update price calculation to account for kmDailyLimit
# Find calculateAndRenderPrice and add a multiplier logic for km.
# 100km -> price * 0.9, 150km -> price * 1, 200km -> price * 1.1, 99999 -> price * 1.3
calc_addon = '''  // Calcolo prezzo per i giorni selezionati
  let price = baseDailyPrice * ConfigState.durationDays;
  
  if (ConfigState.kmDailyLimit === 100) {
      price *= 0.9;
  } else if (ConfigState.kmDailyLimit === 200) {
      price *= 1.15;
  } else if (ConfigState.kmDailyLimit === 99999) {
      price *= 1.4;
  }'''
js = js.replace('  // Calcolo prezzo per i giorni selezionati\n  let price = baseDailyPrice * ConfigState.durationDays;', calc_addon)

# 4. Update the WhatsApp string to include daily KM
whatsapp_replacement = 'Durata: *${months} giorni*\\n Km Giornalieri: *${ConfigState.kmDailyLimit === 99999 ? "Illimitati" : ConfigState.kmDailyLimit + " Km/giorno"}*'
js = js.replace('Durata: *${months} giorni*', whatsapp_replacement)

# 5. Add KM Daily to PDF
pdf_km = '''// Durata
        doc.text("Durata Selezionata:", 20, 80);
        doc.setFont("helvetica", "bold");
        doc.text(`${ConfigState.durationDays} Giorni`, 100, 80);
        
        doc.setFont("helvetica", "normal");
        doc.text("Km Inclusi al Giorno:", 20, 90);
        doc.setFont("helvetica", "bold");
        doc.text(ConfigState.kmDailyLimit === 99999 ? "Illimitati" : `${ConfigState.kmDailyLimit} Km`, 100, 90);'''
        
js = re.sub(r'// Durata\s*doc\.text\("Durata Selezionata:", 20, 80\);\s*doc\.setFont\("helvetica", "bold"\);\s*doc\.text\(`\$\{ConfigState\.durationDays\} Giorni`, 100, 80\);', pdf_km, js, flags=re.DOTALL)

with open('nbt-dettaglio.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('Updated nbt-dettaglio.js')

import re

with open('nbt-dettaglio.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update Durata
old_durata = '''<!-- STEP 1: DURATA MESI -->
<div class="config-section">
<div class="config-section-title"><i class="ri-calendar-schedule-line"></i> 1. Durata Contratto (Mesi)</div>
<div class="config-options-grid-3" id="configDurationGroup">
<button type="button" class="config-option-btn" data-value="6" onclick="setConfigDuration(6, this)">6 Mesi<br><small style="font-weight: 400; font-size:0.7rem; color:var(--text-muted)">Mid-Term</small></button>
<button type="button" class="config-option-btn" data-value="12" onclick="setConfigDuration(12, this)">12 Mesi<br><small style="font-weight: 400; font-size:0.7rem; color:var(--text-muted)">Annuale</small></button>
<button type="button" class="config-option-btn" data-value="24" onclick="setConfigDuration(24, this)">24 Mesi<br><small style="font-weight: 400; font-size:0.7rem; color:var(--text-muted)">Biennale</small></button>
<button type="button" class="config-option-btn active" data-value="36" onclick="setConfigDuration(36, this)">36 Mesi<br><small style="font-weight: 400; font-size:0.7rem; color:#2ecc71">Consigliato</small></button>
</div>
</div>'''

new_durata = '''<!-- STEP 1: DURATA GIORNI -->
<div class="config-section">
<div class="config-section-title"><i class="ri-calendar-schedule-line"></i> 1. Durata (Giorni)</div>
<div class="config-options-grid-3" id="configDurationGroup">
<button type="button" class="config-option-btn" data-value="1" onclick="setConfigDuration(1, this)">1 Giorno</button>
<button type="button" class="config-option-btn" data-value="3" onclick="setConfigDuration(3, this)">3 Giorni</button>
<button type="button" class="config-option-btn active" data-value="7" onclick="setConfigDuration(7, this)">7 Giorni<br><small style="font-weight: 400; font-size:0.7rem; color:#2ecc71">Settimana</small></button>
<button type="button" class="config-option-btn" data-value="14" onclick="setConfigDuration(14, this)">14 Giorni</button>
<button type="button" class="config-option-btn" data-value="30" onclick="setConfigDuration(30, this)">30 Giorni<br><small style="font-weight: 400; font-size:0.7rem; color:var(--text-muted)">Mese</small></button>
</div>
</div>'''

content = content.replace(old_durata, new_durata)

# 2. Remove KM
km_section = re.search(r'<!-- STEP 2: CHILOMETRI ANNUI -->.*?</div>\s*</div>', content, re.DOTALL)
if km_section:
    content = content.replace(km_section.group(0), '')

# 3. Update Anticipo to Deposito
content = content.replace('3. Anticipo Iniziale / Permuta', '2. Deposito Cauzionale')
content = content.replace('<!-- STEP 3: ANTICIPO INIZIALE -->', '<!-- STEP 2: DEPOSITO CAUZIONALE -->')
content = content.replace('<!-- STEP 4: KASKO -->', '<!-- STEP 3: KASKO -->')
content = content.replace('4. Franchigia Kasko', '3. Franchigia Kasko')

with open('nbt-dettaglio.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated nbt-dettaglio.html')

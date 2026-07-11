import re

with open('nbt-app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Update card-interactive-selector HTML
old_selector = '''<div class="card-interactive-selector">

<div class="card-selector-label">Scegli Configurazione Rata:</div>

<div class="card-duration-tabs">

<button class="card-tab ${NbtState.durationFilter === 36 ? 'active' : ''}" onclick="updateSingleCardPrice('${offer.id}', 36, 'default', event)">36 Mesi</button>

<button class="card-tab ${NbtState.durationFilter === 48 ? 'active' : ''}" onclick="updateSingleCardPrice('${offer.id}', 48, 'default', event)">48 Mesi</button>

<button class="card-tab ${NbtState.depositFilter === '0' ? 'active-zero' : ''}" onclick="updateSingleCardPrice('${offer.id}', 48, '0', event)">⚡ 0€ Anticipo</button>

</div>

</div>'''

new_selector = '''<div class="card-interactive-selector">
<div class="card-selector-label">Scegli Durata Noleggio:</div>
<div class="card-duration-tabs">
<button class="card-tab active" onclick="updateSingleCardPrice('${offer.id}', 2, 'default', event)">2 Giorni</button>
<button class="card-tab" onclick="updateSingleCardPrice('${offer.id}', 5, 'default', event)">5 Giorni</button>
<button class="card-tab" onclick="updateSingleCardPrice('${offer.id}', 7, 'default', event)">7 Giorni</button>
</div>
</div>'''

# We have to be careful with spaces. Let's do regex replace or just replace substrings.
js = re.sub(r'<div class="card-interactive-selector">.*?</div>\s*</div>', new_selector, js, flags=re.DOTALL)

# 2. Update getCardPrice
old_get_price = '''if (NbtState.mode === 'NBT') {

return { price: offer.nbtDailyPrice, label: ' / giorno', details: 'Noleggio Breve (1-30 gg)' };

}'''

new_get_price = '''if (NbtState.mode === 'NBT') {
    const days = duration || 2;
    const price = offer.nbtDailyPrice * days;
    return { price: price, label: ' Totale (IVA esc.)', details: `${days} Giorni • Deposito €3.000` };
}'''

js = re.sub(r'if \(NbtState\.mode === \'NBT\'\) \{.*?\}', new_get_price, js, flags=re.DOTALL)

with open('nbt-app.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('Updated nbt-app.js cards')

import re

with open('nlt-dettaglio.js', 'r', encoding='utf-8') as f:
    js = f.read()

pattern = r'<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">.*?Torna al Catalogo\s*</a>\s*</div>'

new_grid = """<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
<button type="button" class="btn btn-primary" onclick="payQuoteStripe('${quoteCode}', event)" style="height: 50px; font-size: 1rem; font-weight: 800; background: linear-gradient(135deg, #635bff, #00d4ff); border: none; display: flex; align-items: center; justify-content: center; gap: 8px; grid-column: span 2;">
<i class="ri-bank-card-line" style="font-size: 1.3rem;"></i> Paga Acconto e Prenota Vettura
</button>
<button type="button" class="btn btn-primary" onclick="window.print()" style="height: 50px; font-size: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px;">
<i class="ri-printer-line" style="font-size: 1.3rem;"></i> Stampa / Scarica PDF
</button>
<button type="button" class="btn btn-outline" onclick="sendCustomQuoteWhatsApp('${phone}', '${c.brand} ${c.model}', '${ConfigState.durationMonths}', '${ConfigState.kmPerYear}', '${ConfigState.depositAmount}', '${ConfigState.finalMonthlyPrice}')" style="height: 50px; font-size: 1rem; font-weight: 800; border-color: #2ecc71; color: #2ecc71; display: flex; align-items: center; justify-content: center; gap: 8px;">
<i class="ri-whatsapp-line" style="font-size: 1.3rem;"></i> Invia su WhatsApp
</button>
<a href="noleggio-lungo-termine.html" class="btn btn-outline" style="height: 50px; font-size: 1rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; grid-column: span 2;">
<i class="ri-arrow-left-line"></i> Torna al Catalogo
</a>
</div>"""

js = re.sub(pattern, new_grid, js, flags=re.DOTALL)

with open('nlt-dettaglio.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('Regex replace done.')

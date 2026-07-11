import re

with open('nlt-dettaglio.js', 'r', encoding='utf-8') as f:
    js = f.read()

old_grid = """<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
<button type="button" class="btn btn-primary" onclick="window.print()" style="height: 50px; font-size: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px;">
<i class="ri-printer-line" style="font-size: 1.3rem;"></i> Stampa / Scarica PDF
</button>
<button type="button" class="btn btn-outline" onclick="sendCustomQuoteWhatsApp('${phone}', '${c.brand} ${c.model}', '${ConfigState.durationMonths}', '${ConfigState.kmPerYear}', '${ConfigState.depositAmount}', '${ConfigState.finalMonthlyPrice}')" style="height: 50px; font-size: 1rem; font-weight: 800; border-color: #2ecc71; color: #2ecc71; display: flex; align-items: center; justify-content: center; gap: 8px;">
<i class="ri-whatsapp-line" style="font-size: 1.3rem;"></i> Invia su WhatsApp
</button>
<a href="noleggio-lungo-termine.html" class="btn btn-outline" style="height: 50px; font-size: 1rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none;">
<i class="ri-arrow-left-line"></i> Torna al Catalogo
</a>
</div>"""

new_grid = """<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
<button type="button" class="btn btn-primary" onclick="payQuoteStripe('${quoteCode}', event)" style="height: 50px; font-size: 1rem; font-weight: 800; background: linear-gradient(135deg, #635bff, #00d4ff); border: none; display: flex; align-items: center; justify-content: center; gap: 8px; grid-column: span 2;">
<i class="ri-bank-card-line" style="font-size: 1.3rem;"></i> Paga Acconto e Prenota Vettura
</button>
<button type="button" class="btn btn-primary" onclick="window.print()" style="height: 50px; font-size: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px;">
<i class="ri-printer-line" style="font-size: 1.3rem;"></i> Stampa PDF
</button>
<button type="button" class="btn btn-outline" onclick="sendCustomQuoteWhatsApp('${phone}', '${c.brand} ${c.model}', '${ConfigState.durationMonths}', '${ConfigState.kmPerYear}', '${ConfigState.depositAmount}', '${ConfigState.finalMonthlyPrice}')" style="height: 50px; font-size: 1rem; font-weight: 800; border-color: #2ecc71; color: #2ecc71; display: flex; align-items: center; justify-content: center; gap: 8px;">
<i class="ri-whatsapp-line" style="font-size: 1.3rem;"></i> Invia su WhatsApp
</button>
<a href="noleggio-lungo-termine.html" class="btn btn-outline" style="height: 50px; font-size: 1rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; grid-column: span 2;">
<i class="ri-arrow-left-line"></i> Torna al Catalogo
</a>
</div>"""

if old_grid in js:
    js = js.replace(old_grid, new_grid)
else:
    print("Warning: old_grid not found")

pay_func = """
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
"""

if "function payQuoteStripe" not in js:
    js += '\n' + pay_func

with open('nlt-dettaglio.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('Updated nlt-dettaglio.js with Stripe button')


with open('nlt-dettaglio.js', 'r', encoding='utf-8') as f:
    js = f.read()

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
    print("Added payQuoteStripe")
else:
    print("Already added")

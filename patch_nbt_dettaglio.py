import re

with open('nbt-dettaglio.js', 'r', encoding='utf-8') as f:
    js = f.read()

# 1. Patch offer_id: null
old_insert = "offer_id: c.id && c.id.length === 36 ? c.id : null,"
new_insert = "offer_id: null, // NBT uses vehicle_id, avoid FK to nlt_offers"
js = js.replace(old_insert, new_insert)

# 2. Add Paga Acconto Button
old_buttons = """<button type="button" class="btn btn-primary" onclick="window.print()" style="height: 50px; font-size: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="ri-printer-line" style="font-size: 1.3rem;"></i> Stampa / Scarica PDF
          </button>
          <button type="button" class="btn btn-outline" onclick="sendCustomQuoteWhatsApp('${phone}', '${c.brand} ${c.model}', '${ConfigState.durationDays}', '${ConfigState.kmDailyLimit}', '${ConfigState.depositAmount}', '${ConfigState.finalMonthlyPrice}')" style="height: 50px; font-size: 1rem; font-weight: 800; border-color: #2ecc71; color: #2ecc71; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="ri-whatsapp-line" style="font-size: 1.3rem;"></i> Invia su WhatsApp
          </button>"""

new_buttons = """<button type="button" class="btn btn-primary" onclick="payQuoteStripe('${quoteCode}', event)" style="height: 50px; font-size: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="ri-secure-payment-line" style="font-size: 1.3rem;"></i> Paga Acconto e Prenota
          </button>
          <button type="button" class="btn btn-outline" onclick="window.print()" style="height: 50px; font-size: 1rem; font-weight: 800; border-color: #2ecc71; color: #2ecc71; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="ri-printer-line" style="font-size: 1.3rem;"></i> Scarica PDF
          </button>"""

if old_buttons in js:
    js = js.replace(old_buttons, new_buttons)
else:
    print("WARNING: Old buttons not found exactly as expected.")

# 3. Add payQuoteStripe function
pay_func = """
async function payQuoteStripe(quoteCode, event) {
  const btn = event.currentTarget;
  const originalText = btn.innerHTML;
  btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Connessione a Stripe...';
  btn.disabled = true;

  try {
    const supabaseUrl = window.supabase.supabaseUrl;
    const supabaseKey = window.supabase.supabaseKey;

    const res = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({ quoteCode })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "Errore sconosciuto da Stripe");
    }

    const { checkoutUrl } = await res.json();
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      throw new Error("URL di checkout non restituito");
    }
  } catch (error) {
    console.error("Errore Checkout Stripe:", error);
    alert("Errore durante la connessione al sistema di pagamento: " + error.message);
    btn.disabled = false;
    btn.innerHTML = originalText;
  }
}
"""

if "payQuoteStripe" not in js:
    js += "\n" + pay_func

with open('nbt-dettaglio.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Patched nbt-dettaglio.js")

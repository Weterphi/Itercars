with open('nbt-dettaglio.js', 'a', encoding='utf-8') as f:
    f.write("""
window.payQuoteStripe = async function(quoteCode, event) {
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
""")
print("Appended payQuoteStripe")

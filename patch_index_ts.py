import re

with open('supabase/functions/stripe-checkout/index.ts', 'r', encoding='utf-8') as f:
    ts = f.read()

# Replace the fee logic
old_logic = """    let markupValue = 45.00; // Valore di default/fallback se l'offerta non esiste a DB

    if (quote.offer_id) {
      const { data: offer, error: offerError } = await supabase
        .from("nlt_offers")
        .select("broker_markup_monthly")
        .eq("id", quote.offer_id)
        .single();
        
      if (!offerError && offer && offer.broker_markup_monthly) {
        markupValue = Number(offer.broker_markup_monthly);
      }
    }

    // La fee è il broker_markup_monthly moltiplicato per 2 (come richiesto)
    const feeAmount = markupValue * 2;

    if (feeAmount <= 0) {
      throw new Error("Invalid fee amount");
    }

    // Crea la sessione Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Acconto Pratica NLT (Rif. ${quote.quote_code})`,
              description: `Fee di avvio pratica per noleggio a lungo termine`,
            },
            unit_amount: Math.round(feeAmount * 100), // In centesimi
          },
          quantity: 1,
        },
      ],"""

new_logic = """    let feeAmount = 0;
    let productName = "";
    let productDesc = "";

    if (quote.quote_code.startsWith("IT-NBT-")) {
      // LOGICA BREVE TERMINE (NBT)
      if (!quote.vehicle_id) throw new Error("Missing vehicle_id for NBT quote");
      
      const { data: nbtOffer, error: nbtError } = await supabase
        .from("nbt_offers")
        .select("daily_price, provider_id")
        .eq("vehicle_id", quote.vehicle_id)
        .maybeSingle(); // maybeSingle because there might be multiple or zero, but we assume one active per vehicle

      if (nbtError || !nbtOffer) throw new Error("NBT Offer not found for this vehicle");

      const { data: provider, error: providerError } = await supabase
        .from("providers")
        .select("commission_rate")
        .eq("id", nbtOffer.provider_id)
        .single();

      if (providerError || !provider) throw new Error("Provider not found");

      const rental_days = quote.selected_duration_months || 1; // NBT saves days in duration_months
      const daily_price = Number(nbtOffer.daily_price);
      const commission_rate = Number(provider.commission_rate) || 15; // default 15% se non settato

      const gross_total = daily_price * rental_days;
      feeAmount = gross_total * (commission_rate / 100);

      productName = `Acconto Pratica NBT (Rif. ${quote.quote_code})`;
      productDesc = `Acconto prenotazione noleggio breve termine (${rental_days} giorni)`;

    } else {
      // LOGICA LUNGO TERMINE (NLT)
      let markupValue = 45.00;

      if (quote.offer_id) {
        const { data: offer, error: offerError } = await supabase
          .from("nlt_offers")
          .select("broker_markup_monthly")
          .eq("id", quote.offer_id)
          .single();
          
        if (!offerError && offer && offer.broker_markup_monthly) {
          markupValue = Number(offer.broker_markup_monthly);
        }
      }

      feeAmount = markupValue * 2;
      productName = `Acconto Pratica NLT (Rif. ${quote.quote_code})`;
      productDesc = `Fee di avvio pratica per noleggio a lungo termine`;
    }

    if (feeAmount <= 0) {
      throw new Error("Invalid fee amount");
    }

    // Crea la sessione Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: productName,
              description: productDesc,
            },
            unit_amount: Math.round(feeAmount * 100), // In centesimi
          },
          quantity: 1,
        },
      ],"""

ts = ts.replace(old_logic, new_logic)

with open('supabase/functions/stripe-checkout/index.ts', 'w', encoding='utf-8') as f:
    f.write(ts)

print("Patched index.ts for NBT")

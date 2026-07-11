import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "npm:stripe@14.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY_LIVE") || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Gestione preflight CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { quoteCode } = await req.json();
    if (!quoteCode) {
      throw new Error("Missing quoteCode");
    }

    // Inizializza il client Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Recupera la riga del preventivo (quote)
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("*, offer_id, vehicle_id")
      .eq("quote_code", quoteCode)
      .single();

    if (quoteError || !quote) {
      throw new Error("Quote not found");
    }

    // Recupera i dati dell'offerta (nlt_offers) per prendere il broker_markup_monthly
    let feeAmount = 0;
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
      // Il calcolo della provvigione / acconto di avvio pratica si effettua sul preventivo generato:
      // 1. Si prendono le prime 2 mensilità (final_monthly_price * 2)
      // 2. Si applica la percentuale corrispettiva in base alla rata mensile (<= 350€ -> 15%, <= 800€ -> 12%, > 800€ -> 10%)
      const monthlyPrice = Number(quote.final_monthly_price) || 0;

      if (monthlyPrice > 0) {
        const twoMonths = monthlyPrice * 2;
        let rate = 0.15;
        if (monthlyPrice <= 350) {
          rate = 0.15;
        } else if (monthlyPrice <= 800) {
          rate = 0.12;
        } else {
          rate = 0.10;
        }
        feeAmount = Math.round(twoMonths * rate * 100) / 100;
      } else {
        // Fallback se final_monthly_price non è disponibile nel record quote
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
      }

      productName = `Acconto Pratica NLT (Rif. ${quote.quote_code})`;
      productDesc = `Acconto avvio pratica NLT (${monthlyPrice > 0 ? `Canone preventivo: €${monthlyPrice}/mese` : 'Avvio pratica'})`;
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
      ],
      mode: "payment",
      payment_intent_data: {
        capture_method: "manual", // Preaddebito: blocca i soldi senza prelevarli fino alla stipula
        metadata: {
          quote_id: quote.id,
          quote_code: quote.quote_code,
          note: "Pre-autorizzazione fee istruttoria. Prelevato solo a delibera e stipula contratto."
        }
      },
      // Redirect URLS (questi possono essere personalizzati)
      success_url: `${req.headers.get("origin") || "http://localhost:8000"}/success.html?session_id={CHECKOUT_SESSION_ID}&quote_code=${quote.quote_code}`,
      cancel_url: `${req.headers.get("origin") || "http://localhost:8000"}/noleggio-lungo-termine.html`,
      metadata: {
        quote_id: quote.id,
        quote_code: quote.quote_code
      }
    });

    return new Response(
      JSON.stringify({ checkoutUrl: session.url }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

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
    let markupValue = 45.00; // Valore di default/fallback se l'offerta non esiste a DB

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
      ],
      mode: "payment",
      // Redirect URLS (questi possono essere personalizzati)
      success_url: `${req.headers.get("origin") || "http://localhost:8000"}/success.html?session_id={CHECKOUT_SESSION_ID}`,
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

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "npm:stripe@14.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY_LIVE") || Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    let event;
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (webhookSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      } catch (err) {
        console.error(`⚠️ Webhook signature verification failed:`, err.message);
        return new Response(JSON.stringify({ error: err.message }), { status: 400 });
      }
    } else {
      // Fallback senza verifica (se non è impostato il webhook secret su Supabase)
      event = JSON.parse(body);
    }

    // Ci basiamo solo su checkout.session.completed per non mandare due mail doppie
    if (event.type === 'checkout.session.completed') {
      const dataObject = event.data.object;
      const quoteCode = dataObject.metadata?.quote_code || "Codice non specificato";
      
      const resendApiKey = Deno.env.get("PREVENTIVO");
      if (resendApiKey) {
        const resendPayload = {
          from: "Itercars <info@itercars.com>",
          to: ["toribiowillie@gmail.com"],
          subject: `✅ Pagamento Ricevuto: Pratica ${quoteCode}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333;">
              <h2 style="color: #2ecc71;">Pagamento ricevuto con successo!</h2>
              <p>Stripe ha incassato l'importo di deposito (addebito diretto completato) per la vettura associata alla pratica <strong>${quoteCode}</strong>.</p>
              <p>Accedi alla dashboard Stripe o al CRM per procedere con i prossimi step dell'istruttoria.</p>
            </div>
          `
        };

        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify(resendPayload),
        });

        if (!res.ok) {
          console.error("Errore durante l'invio dell'email tramite Resend", await res.text());
        }
      }
    }

    return new Response(JSON.stringify({ received: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" }});
  } catch (err) {
    console.error("Errore generico Webhook:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: corsHeaders });
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "npm:stripe@14.0.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY_LIVE") || Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2023-10-16",
  httpClient: Stripe.createFetchHttpClient(),
});

// Questa è la chiave segreta del webhook (Webhook Endpoint Secret) dal pannello sviluppatori di Stripe
const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET_ACADEMY") || "";

serve(async (req) => {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return new Response("Missing stripe-signature", { status: 400 });
  }

  let event;
  try {
    const body = await req.text();
    event = await stripe.webhooks.constructEventAsync(body, signature, endpointSecret);
  } catch (err) {
    console.error(`⚠️ Webhook signature verification failed.`, err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Se l'evento è un pagamento di checkout completato
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    
    // Controlliamo che l'acquisto sia andato a buon fine (pagato per intero o tramite coupon 100%)
    if (session.payment_status === "paid") {
      const customerEmail = session.customer_details?.email;
      const customerName = session.customer_details?.name;

      if (customerEmail) {
        console.log(`Processing Academy purchase for ${customerEmail}`);
        
        // Inizializza il client Supabase con la Service Role Key (privilegi admin)
        const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Genera una password random (es: 8 caratteri alfanumerici)
        const generatePassword = () => Math.random().toString(36).slice(-8);
        const newPassword = generatePassword();

        // 1. Inserisci l'utente nella tabella academy_users
        const { data, error } = await supabase
          .from("academy_users")
          .insert([
            {
              email: customerEmail,
              password_hash: newPassword, // Memorizzata in chiaro nella colonna 'hash' per semplicità didattica, in prod usare bcrypt
              full_name: customerName || "Broker Academy",
              stripe_session_id: session.id
            }
          ])
          .select()
          .maybeSingle();

        if (error) {
          console.error("Errore inserimento utente Academy:", error);
          // Anche se fallisce (es. email già esistente), procediamo. In caso di duplicate key, magari l'utente ha ricomprato o aggiorniamo.
        }

        // 2. Invia l'email con le credenziali tramite Resend
        const resendApiKey = Deno.env.get("ACADEMY"); // Hai chiamato il segreto ACADEMY su Supabase
        if (resendApiKey) {
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              from: 'Itercars Academy <info@itercars.com>',
              to: [customerEmail],
              subject: 'Accesso Sbloccato: Benvenuto in Itercars Academy VIP',
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2>Benvenuto a Bordo, ${customerName || 'Broker'}!</h2>
                  <p>Il tuo pagamento è andato a buon fine. Ecco le tue credenziali riservate per accedere alla Masterclass:</p>
                  <ul style="background: #f4f4f4; padding: 20px; border-radius: 8px; list-style-type: none;">
                    <li style="margin-bottom: 10px;"><strong>URL di Accesso:</strong> <a href="https://www.itercars.com/academy.html#login">https://www.itercars.com/academy.html#login</a></li>
                    <li style="margin-bottom: 10px;"><strong>Email Utente:</strong> ${customerEmail}</li>
                    <li><strong>Password:</strong> <span style="background: #e2e8f0; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${newPassword}</span></li>
                  </ul>
                  <p>Ti consigliamo di conservare questa email con cura.</p>
                  <br>
                  <p>Il team Itercars</p>
                </div>
              `
            })
          });
          
          if (!resendResponse.ok) {
            console.error("Errore invio email Resend:", await resendResponse.text());
          } else {
            console.log(`Email di benvenuto inviata con successo a ${customerEmail}`);
          }
        } else {
            console.warn("Nessuna chiave RESEND_API_KEY trovata nei segreti Supabase. L'email non è stata inviata.");
        }
        console.log(`Credenziali create con successo per ${customerEmail}: password = ${newPassword}`);
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), { status: 200, headers: { "Content-Type": "application/json" } });
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, nomeAzienda } = await req.json()

    // Recupero della API Key di Resend salvata nei Secret
    const resendApiKey = Deno.env.get("PREVENTIVO")

    if (!resendApiKey) {
      throw new Error("Il Secret 'PREVENTIVO' non è configurato correttamente nella Edge Function.")
    }

    const consoleLink = "https://www.itercars.com/crm-partner.html";

    const resendPayload = {
      from: "Itercars Rete Partner <info@itercars.com>",
      to: [email],
      subject: `Benvenuto nella Rete Partner Ufficiale ITERCARS!`,
      html: `
        <div style="background-color: #f4f7f5; padding: 40px 15px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; min-height: 100%; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #e2ece6;">
            
            <div style="background-color: #2d6a4f; height: 6px;"></div>
            
            <div style="padding: 40px 35px;">
              <h2 style="color: #1b4332; font-size: 22px; margin-top: 0; margin-bottom: 20px; font-weight: 600;">
                Gentile ${nomeAzienda || 'Partner'},
              </h2>
              
              <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
                Siamo felici di comunicarti che la tua candidatura è stata valutata e <strong>ACCETTATA con successo</strong> dalla Direzione Centrale ITERCARS!
              </p>
              
              <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
                Il tuo account da Partner Ufficiale è ora attivo. Per accedere alla tua Console Partner riservata segui questi passaggi:
              </p>

              <div style="background-color: #f2f8f5; border-left: 4px solid #52b788; padding: 20px; border-radius: 6px; margin-bottom: 25px;">
                <ol style="color: #1b4332; font-size: 15px; line-height: 1.6; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Collegati a: <a href="${consoleLink}" style="color: #2d6a4f; font-weight: bold;">${consoleLink}</a></li>
                  <li style="margin-bottom: 8px;">Clicca su "Accedi alla Console"</li>
                  <li style="margin-bottom: 0;">Inserisci le tue credenziali:
                    <ul style="margin-top: 5px; padding-left: 15px;">
                      <li><strong>Email:</strong> ${email}</li>
                      <li><strong>Password:</strong> La password scelta da te in fase di candidatura</li>
                    </ul>
                  </li>
                </ol>
              </div>

              <div style="background-color: #ffffff; border: 1px dashed #e2ece6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <p style="color: #d97706; font-weight: 600; margin-top: 0; margin-bottom: 8px; font-size: 15px; display: flex; align-items: center;">
                  ⚠️ IMPORTANTE: Carica subito la tua flotta
                </p>
                <p style="color: #4a5568; font-size: 14px; line-height: 1.5; margin: 0;">
                  Ti ricordiamo di caricare il prima possibile la tua flotta vetture! Una volta effettuato l'accesso, vai nella sezione <strong>"Inserisci Flotta"</strong> del menu laterale, scarica il template, compilalo e caricalo. La tua flotta verrà immediatamente pubblicata sul portale.
                </p>
              </div>
              
              <p style="color: #2d6a4f; font-weight: 600; font-size: 15px; margin-top: 30px; margin-bottom: 0; line-height: 1.4;">
                Grazie per la collaborazione e benvenuto a bordo,<br>
                <span style="color: #1b4332; font-size: 16px; font-weight: 700;">Il Team Direttivo ITERCARS</span>
              </p>
            </div>
            
            <div style="background-color: #f9fafb; padding: 24px 35px; text-align: center; border-top: 1px solid #edf2f7;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.6;">
                Questa è una comunicazione automatica inviata da Itercars.<br>
                Se desideri ricevere supporto, rispondi a questa email o scrivi a <a href="mailto:info@itercars.com" style="color: #2d6a4f; text-decoration: none; font-weight: 600;">info@itercars.com</a>.
              </p>
            </div>
            
          </div>
        </div>
      `,
    };

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify(resendPayload),
    })

    const responseData = await res.json()

    return new Response(JSON.stringify(responseData), {
      status: res.status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Configurazione dei moduli CORS per permettere le chiamate dal frontend
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Gestione della richiesta preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Estrazione dei dati inviati dal frontend (ora accetta anche checkoutUrl e quoteCode)
    const { email, nome, dettagli, totale, pdfBase64, pdfName, checkoutUrl, quoteCode } = await req.json()

    // Recupero della API Key di Resend salvata nei Secret
    const resendApiKey = Deno.env.get("PREVENTIVO")

    if (!resendApiKey) {
      throw new Error("Il Secret 'PREVENTIVO' non è configurato correttamente nella Edge Function.")
    }

    // Blocco HTML del pulsante Stripe (appare solo se checkoutUrl è presente)
    const stripeButtonHtml = checkoutUrl ? `
      <div style="text-align: center; margin: 35px 0; padding: 25px 20px; background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 10px;">
        <p style="color: #1e293b; font-weight: 600; font-size: 16px; margin-top: 0; margin-bottom: 15px;">
          🚀 Vuoi confermare e bloccare subito questa vettura?
        </p>
        <a href="${checkoutUrl}" target="_blank" style="background: linear-gradient(135deg, #635bff, #00d4ff); color: #ffffff; padding: 16px 36px; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 8px; display: inline-block; box-shadow: 0 4px 14px rgba(99, 91, 255, 0.35); letter-spacing: 0.3px;">
          💳 Paga Acconto e Prenota Online
        </a>
        <p style="color: #64748b; font-size: 13px; margin-top: 12px; margin-bottom: 0; line-height: 1.5;">
          Pagamento sicuro 100% gestito da <strong>Stripe</strong>. L'importo copre l'acconto e avvia istantaneamente la pratica di noleggio (Rif. ${quoteCode || 'Preventivo'}).
        </p>
      </div>
    ` : '';

    // Costruiamo il payload (il "corpo" dell'email) da inviare a Resend
    const resendPayload = {
      from: "Richiesta preventivo <info@itercars.com>", 
      to: [email],
      subject: `Il tuo Preventivo Personalizzato Itercars - ${nome}`,
      html: `
        <div style="background-color: #f4f7f5; padding: 40px 15px; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; min-height: 100%; margin: 0;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.03); border: 1px solid #e2ece6;">
            
            <div style="background-color: #2d6a4f; height: 6px;"></div>
            
            <div style="padding: 40px 35px;">
              
              <h2 style="color: #1b4332; font-size: 22px; margin-top: 0; margin-bottom: 20px; font-weight: 600; letter-spacing: -0.5px;">
                Gentile ${nome},
              </h2>
              
              <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
                La ringraziamo per aver scelto <strong>Itercars</strong> e per l'interesse dimostrato nei confronti dei nostri servizi. Abbiamo preso in carico la Sua richiesta ed elaborato un preventivo personalizzato, formulato accuratamente sulla base delle Sue specifiche esigenze.
              </p>
              
              <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin-bottom: 30px;">
                Troverà il documento completo e dettagliato in allegato alla presente comunicazione. Di seguito Le riportiamo un breve riepilogo dei dati principali:
              </p>
              
              <div style="background-color: #f2f8f5; border-left: 4px solid #52b788; padding: 22px; border-radius: 6px; margin-bottom: 30px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding-bottom: 8px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600;">Dettaglio Servizio / Prodotto</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 20px; color: #1b4332; font-size: 16px; font-weight: 500; line-height: 1.4;">${dettagli}</td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 6px; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.8px; font-weight: 600;">Importo Totale Stimato</td>
                  </tr>
                  <tr>
                    <td style="color: #2d6a4f; font-size: 26px; font-weight: 700; letter-spacing: -0.5px;">€ ${totale}</td>
                  </tr>
                </table>
              </div>

              ${stripeButtonHtml}
              
              <div style="background-color: #ffffff; border: 1px solid #e2ece6; padding: 20px; border-radius: 8px; margin-bottom: 35px;">
                <p style="color: #1b4332; font-weight: 600; margin-top: 0; margin-bottom: 8px; font-size: 15px; display: flex; align-items: center;">
                  📌 Cosa succede ora?
                </p>
                <p style="color: #4a5568; font-size: 14px; line-height: 1.5; margin: 0;">
                  Un nostro consulente specializzato provvederà a <strong>ricontattarLa a breve</strong> (tramite telefono o email) per analizzare insieme la proposta, rispondere a ogni Suo eventuale dubbio e definire i dettagli operativi del servizio.
                </p>
              </div>
              
              <p style="color: #4a5568; font-size: 15px; line-height: 1.6; margin-bottom: 0;">
                Restiamo a Sua completa disposizione per qualsiasi ulteriore chiarimento.
              </p>
              
              <p style="color: #2d6a4f; font-weight: 600; font-size: 15px; margin-top: 30px; margin-bottom: 0; line-height: 1.4;">
                Cordiali saluti,<br>
                <span style="color: #1b4332; font-size: 16px; font-weight: 700;">Il Team Itercars</span>
              </p>
            </div>
            
            <div style="background-color: #f9fafb; padding: 24px 35px; text-align: center; border-top: 1px solid #edf2f7;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0; line-height: 1.6;">
                Questa è una comunicazione automatica inviata da Itercars.<br>
                Se desidera rispondere o modificare la richiesta, può farlo direttamente a questa email o scrivendo a <a href="mailto:info@itercars.com" style="color: #2d6a4f; text-decoration: none; font-weight: 600;">info@itercars.com</a>.
              </p>
            </div>
            
          </div>
        </div>
      `,
    };

    // Aggiungiamo l'allegato SOLO se il frontend ci ha inviato il PDF codificato
    if (pdfBase64 && pdfName) {
      resendPayload.attachments = [
        {
          filename: pdfName,
          content: pdfBase64
        }
      ];
    }

    // Chiamata all'API di Resend
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

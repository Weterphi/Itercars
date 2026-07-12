import os

# 1. Create supabase/functions/preventivo_itercars/index.ts
os.makedirs('supabase/functions/preventivo_itercars', exist_ok=True)

preventivo_ts = """import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    // Estrazione dei dati inviati dal frontend (ora accetta anche quoteCode e dossierUrl)
    const { email, nome, dettagli, totale, pdfBase64, pdfName, quoteCode, dossierUrl } = await req.json()

    // Recupero della API Key di Resend salvata nei Secret
    const resendApiKey = Deno.env.get("PREVENTIVO")

    if (!resendApiKey) {
      throw new Error("Il Secret 'PREVENTIVO' non è configurato correttamente nella Edge Function.")
    }

    // Calcolo URL del Dossier Pratica (se passato dal frontend o generato dal quoteCode)
    const finalDossierUrl = dossierUrl || (quoteCode ? `https://itercars.com/upload-documenti.html?code=${quoteCode}` : null);

    // Blocco HTML del pulsante per accedere al Dossier e caricare i documenti
    const dossierButtonHtml = finalDossierUrl ? `
      <div style="text-align: center; margin: 35px 0; padding: 25px 20px; background-color: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 10px;">
        <p style="color: #1e293b; font-weight: 600; font-size: 16px; margin-top: 0; margin-bottom: 15px;">
          🚀 Vuoi accettare il preventivo e avviare subito la pratica di delibera?
        </p>
        <a href="${finalDossierUrl}" target="_blank" style="background: linear-gradient(135deg, #2ecc71, #009246); color: #ffffff; padding: 16px 36px; font-size: 16px; font-weight: 700; text-decoration: none; border-radius: 8px; display: inline-block; box-shadow: 0 4px 14px rgba(46, 204, 113, 0.35); letter-spacing: 0.3px;">
          📂 Accetta Preventivo e Carica Documenti
        </a>
        <p style="color: #64748b; font-size: 13px; margin-top: 12px; margin-bottom: 0; line-height: 1.5;">
          Cliccando accederai al <strong>Portale Pratiche Itercars</strong> (Rif. ${quoteCode || 'Preventivo'}) per caricare in modo sicuro i documenti d'identità e reddito richiesti per bloccare la vettura.
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

              ${dossierButtonHtml}
              
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
"""

with open('supabase/functions/preventivo_itercars/index.ts', 'w', encoding='utf-8') as f:
    f.write(preventivo_ts)
print("Created supabase/functions/preventivo_itercars/index.ts")

# 2. Patch nbt-dettaglio.js and nlt-dettaglio.js to generate checkoutUrl and send it in emailPayload
def patch_js(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        js = f.read()

    old_block = """      if (true) {
        const emailPayload = {
           email: email,
           nome: name,
           dettagli: `${c.brand} ${c.model} - ${ConfigState.durationDays} Giorni, ${ConfigState.kmDailyLimit} km/giorno, Anticipo €${ConfigState.depositAmount}`,
           totale: ConfigState.finalMonthlyPrice,
           pdfBase64: pdfBase64,
           pdfName: `Preventivo_ITERCARS_${c.brand}_${c.model}.pdf`.replace(/ /g, '_')
        };"""
        
    old_block_nlt = """      if (true) {
        const emailPayload = {
           email: email,
           nome: name,
           dettagli: `${c.brand} ${c.model} - ${ConfigState.durationMonths} Mesi, ${ConfigState.kmPerYear} km/anno, Anticipo €${ConfigState.depositAmount}`,
           totale: ConfigState.finalMonthlyPrice,
           pdfBase64: pdfBase64,
           pdfName: `Preventivo_ITERCARS_${c.brand}_${c.model}.pdf`.replace(/ /g, '_')
        };"""

    new_block = """      if (true) {
        const supabaseUrl = window.supabase.supabaseUrl;
        const supabaseKey = window.supabase.supabaseKey;

        // Genera preventivamente il link Stripe Checkout per inserirlo nella mail
        let checkoutUrl = null;
        try {
          const stripeRes = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${supabaseKey}`
            },
            body: JSON.stringify({ quoteCode })
          });
          if (stripeRes.ok) {
            const stripeData = await stripeRes.json();
            checkoutUrl = stripeData.checkoutUrl || null;
          }
        } catch (stripeErr) {
          console.warn("Impossibile generare link Stripe per mail:", stripeErr);
        }

        const emailPayload = {
           email: email,
           nome: name,
           dettagli: `${c.brand} ${c.model} - ${ConfigState.durationDays || ConfigState.durationMonths} ${ConfigState.durationDays ? 'Giorni' : 'Mesi'}, ${ConfigState.kmDailyLimit || ConfigState.kmPerYear} ${ConfigState.kmDailyLimit ? 'km/giorno' : 'km/anno'}, Anticipo €${ConfigState.depositAmount}`,
           totale: ConfigState.finalMonthlyPrice,
           pdfBase64: pdfBase64,
           pdfName: `Preventivo_ITERCARS_${c.brand}_${c.model}.pdf`.replace(/ /g, '_'),
           quoteCode: quoteCode,
           checkoutUrl: checkoutUrl
        };"""

    if old_block in js:
        js = js.replace(old_block, new_block)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(js)
        print(f"Patched {filename} (NBT style)")
    elif old_block_nlt in js:
        js = js.replace(old_block_nlt, new_block)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(js)
        print(f"Patched {filename} (NLT style)")
    else:
        print(f"WARNING: Could not find exact email block in {filename}. Checking if already patched or slightly different.")

patch_js('nbt-dettaglio.js')
patch_js('nlt-dettaglio.js')

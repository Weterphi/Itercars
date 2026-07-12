import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const { 
      quoteCode = 'PREV-2026-ESCLUSIVO', 
      leadId = null, 
      nomeCliente = 'Richiedente', 
      tipoCliente = 'Privato', 
      auto = {}, 
      documenti = [], 
      mandanteEmail = 'toribiowillie@gmail.com' 
    } = await req.json()

    // Recupero API Key Resend dai Secrets (supporta sia PREVENTIVO che RESEND_API_KEY)
    const resendApiKey = Deno.env.get("PREVENTIVO") || Deno.env.get("RESEND_API_KEY")

    if (!resendApiKey) {
      throw new Error("API Key Resend (PREVENTIVO o RESEND_API_KEY) non configurata nei Secrets di Supabase.")
    }

    // Costruzione nome auto e canone
    const nomeVettura = auto.carTitle || `${auto.marca || ''} ${auto.modello || ''} ${auto.versione || ''}`.trim() || 'Vettura in Delibera';
    const canoneMese = auto.canone || auto.monthlyPrice || '0';
    const anticipo = auto.anticipo || auto.deposit || '0';

    // Allegati per Resend
    const resendAttachments: any[] = [];

    // Costruzione lista HTML dei documenti allegati
    let documentiListHtml = ''
    if (Array.isArray(documenti) && documenti.length > 0) {
      documentiListHtml = documenti.map((doc, idx) => {
        const docTitle = doc.document_type ? doc.document_type.toUpperCase().replace(/_/g, ' ') : `DOCUMENTO ${idx + 1}`
        
        // Se c'è un base64 (o dataUrl), prepariamo l'allegato per Resend
        if (doc.file_base64) {
          resendAttachments.push({
            filename: doc.file_name || `${docTitle}.pdf`,
            content: doc.file_base64
          });
        } else if (doc.dataUrl && doc.dataUrl.includes(',')) {
          resendAttachments.push({
            filename: doc.file_name || `${docTitle}.pdf`,
            content: doc.dataUrl.split(',')[1]
          });
        }

        const urlLink = doc.file_url && doc.file_url.startsWith('http') 
          ? `<a href="${doc.file_url}" target="_blank" style="background-color: #238636; color: #ffffff; font-weight: 700; text-decoration: none; padding: 6px 14px; border-radius: 6px; display: inline-block;">📥 Scarica ${docTitle}</a>` 
          : `<span style="color: #58a6ff; font-weight: 600;">Allegato alla mail (${doc.file_name || 'file.pdf'})</span>`
        
        return `
          <div style="background-color: #161b22; border: 1px solid #30363d; padding: 14px 18px; border-radius: 8px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <strong style="color: #ffffff; font-size: 15px; display: block;">✓ ${docTitle}</strong>
              <span style="color: #8b949e; font-size: 13px;">File: ${doc.file_name || 'documento.pdf'}</span>
            </div>
            <div style="margin-top: 4px;">
              ${urlLink}
            </div>
          </div>
        `
      }).join('')
    } else {
      documentiListHtml = `<p style="color: #8b949e; font-style: italic;">Documenti dossier verificati e caricati nel sistema.</p>`
    }

    const htmlEmail = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #0d1117; color: #ffffff; padding: 40px 20px; margin: 0;">
        <div style="max-width: 650px; margin: 0 auto; background-color: #161b22; border: 1px solid #30363d; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1f6feb, #238636); padding: 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; font-weight: 900; letter-spacing: 1px; color: #ffffff;">
              📂 NUOVO DOSSIER DI DELIBERA
            </h1>
            <p style="margin: 8px 0 0; font-size: 14px; color: #e6edf3; opacity: 0.9;">
              Pratica Pronta per Istruttoria — Rif. <strong>${quoteCode}</strong>
            </p>
          </div>

          <div style="padding: 35px 30px;">
            <!-- Dati Pratica e Cliente -->
            <h2 style="font-size: 18px; color: #58a6ff; border-bottom: 1px solid #21262d; padding-bottom: 10px; margin-top: 0;">
              👤 Anagrafica Richiedente
            </h2>
            <table style="width: 100%; margin-bottom: 25px; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #8b949e; width: 40%;">Numero Pratica:</td>
                <td style="padding: 8px 0; color: #ffffff; font-weight: 700; font-size: 16px;">${quoteCode}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8b949e;">Nome e Cognome / Ragione Sociale:</td>
                <td style="padding: 8px 0; color: #ffffff; font-weight: 700; font-size: 16px;">${nomeCliente}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #8b949e;">Tipologia Cliente:</td>
                <td style="padding: 8px 0; color: #3fb950; font-weight: 600; font-size: 15px;">${tipoCliente}</td>
              </tr>
            </table>

            <!-- Caratteristiche Vettura -->
            <h2 style="font-size: 18px; color: #58a6ff; border-bottom: 1px solid #21262d; padding-bottom: 10px; margin-top: 30px;">
              🚗 Vettura e Configurazione Selezionata
            </h2>
            <div style="background-color: #0d1117; border: 1px solid #30363d; border-radius: 12px; padding: 22px; margin-bottom: 30px;">
              <h3 style="margin: 0 0 15px; color: #ffffff; font-size: 20px; font-weight: 800;">
                ${nomeVettura}
              </h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; color: #8b949e;">Alimentazione / Cambio:</td>
                  <td style="padding: 6px 0; color: #ffffff; text-align: right; font-weight: 600;">${auto.alimentazione || 'N/D'} • ${auto.cambio || 'Automatico'}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #8b949e;">Durata / Km Annui:</td>
                  <td style="padding: 6px 0; color: #ffffff; text-align: right; font-weight: 600;">${auto.durata || '48'} Mesi • ${auto.km_annui || '15.000'} Km/anno</td>
                </tr>
                <tr style="border-top: 1px solid #21262d;">
                  <td style="padding-top: 14px; color: #8b949e; font-weight: 600; font-size: 15px;">Canone Mensile (NLT):</td>
                  <td style="padding-top: 14px; color: #3fb950; text-align: right; font-weight: 900; font-size: 20px;">
                    € ${canoneMese}/mese
                  </td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #8b949e;">Anticipo richiesto:</td>
                  <td style="padding: 4px 0; color: #ffffff; text-align: right; font-weight: 600;">
                    € ${anticipo}
                  </td>
                </tr>
              </table>
            </div>

            <!-- Dossier Documenti Allegati -->
            <h2 style="font-size: 18px; color: #3fb950; border-bottom: 1px solid #21262d; padding-bottom: 10px; margin-top: 30px;">
              📂 Documenti Dossier
            </h2>
            <p style="color: #8b949e; font-size: 13px; margin-bottom: 15px;">
              I file dei documenti sono scaricabili dai link sottostanti o allegati alla presente comunicazione:
            </p>
            
            <div style="margin-bottom: 20px;">
              ${documentiListHtml}
            </div>

          </div>

          <!-- Footer -->
          <div style="background-color: #0d1117; padding: 20px; text-align: center; border-top: 1px solid #21262d; font-size: 12px; color: #6e7681;">
            ITERCARS Marketplace — Sistema di Delibera Digitalizzata Multi-Mandante<br>
            Pratica trasmessa automaticamente al mandante designato (${mandanteEmail}).
          </div>

        </div>
      </div>
    `

    const resendPayload: any = {
      from: "Dossier Delibere Itercars <info@itercars.com>",
      to: [mandanteEmail],
      subject: `Nuovo dossier ${quoteCode}`,
      html: htmlEmail,
    }

    if (resendAttachments.length > 0) {
      resendPayload.attachments = resendAttachments;
    }

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

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
    const { companyName, vat, contactName, phone, email, address } = await req.json()

    const resendApiKey = Deno.env.get("PREVENTIVO")
    if (!resendApiKey) {
      throw new Error("Il Secret 'PREVENTIVO' non è configurato correttamente.")
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #000;">Nuova Richiesta Partner</h2>
        <p>È stata ricevuta una nuova richiesta per diventare Partner Itercars. Ecco i dettagli:</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Azienda:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${companyName}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Partita IVA:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${vat}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Referente:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${contactName}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Telefono:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${phone}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${email}</td></tr>
          <tr><td style="padding: 10px; border-bottom: 1px solid #ddd;"><strong>Indirizzo/Città:</strong></td><td style="padding: 10px; border-bottom: 1px solid #ddd;">${address}</td></tr>
        </table>
        <p style="margin-top: 30px;">Puoi approvare o rifiutare la richiesta dal pannello CRM Supabase (tabella 'supplier_applications' e gestione Auth).</p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: 'Itercars Notifiche <preventivi@itercars.com>',
        to: ['ceotoribio@itercars.com'],
        subject: `Nuova Richiesta Partner: ${companyName}`,
        html: htmlContent
      })
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(`Errore Resend API: ${errorText}`)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

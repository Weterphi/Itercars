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

    if (!email || !nomeAzienda) {
      throw new Error("Dati mancanti (email o nomeAzienda)")
    }

    const resendApiKey = Deno.env.get("PREVENTIVO")
    if (!resendApiKey) {
      throw new Error("Il Secret 'PREVENTIVO' non  configurato correttamente.")
    }

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: auto;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #000;">La tua flotta  ONLINE! \uD83D\uDE80</h1>
        </div>
        <p>Gentile <strong>${nomeAzienda}</strong>,</p>
        <p>Siamo felici di comunicarti che la nostra Direzione ha <strong>approvato e pubblicato con successo</strong> la tua flotta di auto sul sito ufficiale di ITERCARS.</p>
        <p>Le tue vetture sono ora Live, visibili ai nostri clienti, indicizzate nei nostri comparatori e pronte a ricevere prenotazioni!</p>
        <p>Accedi alla tua Console Partner per visualizzare e gestire in tempo reale tutte le auto attive, aggiornare i prezzi e gestire le richieste in arrivo.</p>
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://itercars.com/crm-partner.html" style="background-color: #2ecc71; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Accedi alla Console Partner</a>
        </div>
        <p style="margin-top: 40px; font-size: 12px; color: #777;">Per qualsiasi informazione, puoi rispondere a questa email o contattare il tuo referente ITERCARS dedicato.</p>
      </div>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${resendApiKey}`
      },
      body: JSON.stringify({
        from: 'Itercars Flotta <preventivi@itercars.com>',
        to: [email],
        subject: `La tua flotta  online su Itercars!`,
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

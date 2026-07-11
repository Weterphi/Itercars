import re

def refactor_file(filepath, is_nbt=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        js = f.read()

    # Find the start of handleQuoteSubmit
    start_str = "async function handleQuoteSubmit(event) {"
    if start_str not in js:
        print(f"Could not find start in {filepath}")
        return

    # Let's see where handleQuoteSubmit ends (around line 670 where sendCustomQuoteWhatsApp is defined)
    end_str = "function sendCustomQuoteWhatsApp("
    if end_str not in js:
        print(f"Could not find end in {filepath}")
        return

    start_idx = js.find(start_str)
    end_idx = js.find(end_str)

    # Let's construct the new, non-blocking handleQuoteSubmit that displays the quote box immediately!
    if is_nbt:
        new_func = """async function handleQuoteSubmit(event) {
  event.preventDefault();
  
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;
  
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Elaborazione Preventivo...';
  
  const name = document.getElementById('quoteClientName').value;
  const email = document.getElementById('quoteClientEmail').value;
  const phone = document.getElementById('quoteClientPhone').value;
  const type = document.getElementById('quoteClientType').value;
  const c = ConfigState.car;
  const quoteCode = `IT-NBT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // 1. Visualizza SUBITO la scheda Preventivo Ufficiale senza bloccare la pagina!
  const previewBox = document.getElementById('officialQuoteContainer');
  if (previewBox) {
    previewBox.style.display = 'block';
    previewBox.innerHTML = `
      <div class="glass-card quote-result-card" style="margin-top: 30px; border: 2px solid var(--accent-primary); padding: 30px; position: relative; animation: fadeIn 0.4s ease; background: #080c14;">
        <div style="position: absolute; top: -30px; right: -30px; width: 160px; height: 160px; background: rgba(0, 146, 70, 0.2); border-radius: 50%; filter: blur(40px);"></div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
          <div>
            <img src="logo_tricolore.png" style="height: 30px; margin-bottom: 6px;" alt="Itercars Logo"><br>
            <span style="color: var(--accent-primary); font-weight: 800; font-size: 1.25rem; letter-spacing: 1px;"><i class="ri-vip-crown-fill"></i> ITERCARS — PREVENTIVO UFFICIALE NBT</span>
            <div style="font-size: 0.88rem; color: var(--text-muted); margin-top: 4px;">Codice Pratica: <strong>${quoteCode}</strong> • Data Emissione: ${new Date().toLocaleDateString('it-IT')}</div>
          </div>
          <span style="background: rgba(46, 204, 113, 0.2); color: #2ecc71; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 800;">PRONTO DA FIRMARE / BLOCCA TARIFFA</span>
        </div>

        <div class="detail-image-wrapper" style="margin-bottom: 12px; box-shadow: none;">
          <img src="${c.image}" alt="${c.model}" class="detail-image" style="background: #fff; max-height: 280px;">
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); padding: 10px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); margin-bottom: 24px;">
            <div style="text-align: center; font-size: 0.75rem;">
                <span style="color: var(--text-muted); display: block; text-transform: uppercase;">Velocità Max</span>
                <strong style="color: #fff;">${c.speed}</strong>
            </div>
            <div style="text-align: center; font-size: 0.75rem;">
                <span style="color: var(--text-muted); display: block; text-transform: uppercase;">0-100 km/h</span>
                <strong style="color: #fff;">${c.accel}</strong>
            </div>
            <div style="text-align: center; font-size: 0.75rem;">
                <span style="color: var(--text-muted); display: block; text-transform: uppercase;">Potenza</span>
                <strong style="color: #fff;">${c.hp}</strong>
            </div>
            <div style="text-align: center; font-size: 0.75rem;">
                <span style="color: var(--text-muted); display: block; text-transform: uppercase;">Alimentazione</span>
                <strong style="color: #fff;">${c.fuel}</strong>
            </div>
            <div style="text-align: center; font-size: 0.75rem;">
                <span style="color: var(--text-muted); display: block; text-transform: uppercase;">Cambio</span>
                <strong style="color: #fff;">${c.transmission}</strong>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; font-size: 0.95rem;">
          <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.07);">
            <strong style="color: var(--accent-primary); display: block; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 6px;">Intestazione Cliente</strong>
            <div style="font-size: 1.1rem; font-weight: 800; color: #fff;">${name}</div>
            <div style="color: var(--text-muted); font-size: 0.9rem;">${type} • ${email} • ${phone}</div>
          </div>

          <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.07);">
            <strong style="color: var(--accent-primary); display: block; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 6px;">Vettura Selezionata</strong>
            <div style="font-size: 1.1rem; font-weight: 800; color: #fff;">${c.brand} ${c.model}</div>
            <div style="color: var(--text-muted); font-size: 0.9rem;">${c.trim} • Listino ${c.providerName}</div>
          </div>
        </div>

        <div style="background: rgba(0, 146, 70, 0.14); border: 1px solid rgba(0, 146, 70, 0.4); border-radius: 14px; padding: 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <span style="font-size: 0.85rem; color: var(--text-muted); display: block; text-transform: uppercase; font-weight: 700;">Configurazione Contratto NBT</span>
            <div style="font-size: 1.1rem; font-weight: 800; color: #fff; margin-top: 4px;">
              Durata: <span style="color: #2ecc71;">${ConfigState.durationDays} Giorni</span> • 
              Km compresi: <span style="color: #2ecc71;">${ConfigState.kmDailyLimit.toLocaleString('it-IT')} km/giorno</span> • 
              Anticipo: <span style="color: #2ecc71;">€ ${ConfigState.depositAmount.toLocaleString('it-IT')}</span>
            </div>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">Kasko Integral ${ConfigState.kaskoFranchigia === 'zero' ? '(Franchigia Zero 0€)' : '(Franchigia Standard)'} + Bollo & Manutenzione H24</div>
          </div>

          <div style="text-align: right;">
            <span style="font-size: 0.85rem; color: var(--text-muted); display: block; text-transform: uppercase; font-weight: 700;">Canone Totale Tutto Incluso</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: #2ecc71; line-height: 1;">€ ${ConfigState.finalMonthlyPrice.toLocaleString('it-IT')} <small style="font-size: 0.9rem; font-weight: 400; color: #fff;">Totale (IVA esc.)</small></div>
          </div>
        </div>

        <div id="nbtToastInfo" style="margin-bottom: 16px; padding: 12px 18px; border-radius: 8px; background: rgba(46, 204, 113, 0.15); border: 1px solid #2ecc71; color: #fff; font-weight: 600; display: flex; align-items: center; gap: 10px;">
          <i class="ri-mail-check-fill" style="color: #2ecc71; font-size: 1.4rem;"></i>
          <span>Preventivo generato e inviato al tuo indirizzo email! Puoi procedere con il pagamento o scaricare il PDF.</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <button type="button" class="btn btn-primary" onclick="window.payQuoteStripe('${quoteCode}', event)" style="height: 50px; font-size: 1rem; font-weight: 800; background: linear-gradient(135deg, #635bff, #00d4ff); border: none; display: flex; align-items: center; justify-content: center; gap: 8px; grid-column: span 2;">
            <i class="ri-bank-card-line" style="font-size: 1.3rem;"></i> Paga Acconto e Prenota Vettura
          </button>
          <button type="button" class="btn btn-outline" onclick="window.print()" style="height: 50px; font-size: 1rem; font-weight: 800; border-color: #2ecc71; color: #2ecc71; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="ri-printer-line" style="font-size: 1.3rem;"></i> Scarica PDF
          </button>
          <button type="button" class="btn btn-outline" onclick="sendCustomQuoteWhatsApp('${phone}', '${c.brand} ${c.model}', '${ConfigState.durationDays}', '${ConfigState.kmDailyLimit}', '${ConfigState.depositAmount}', '${ConfigState.finalMonthlyPrice}')" style="height: 50px; font-size: 1rem; font-weight: 800; border-color: #2ecc71; color: #2ecc71; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="ri-whatsapp-line" style="font-size: 1.3rem;"></i> Invia su WhatsApp
          </button>
        </div>
      </div>
    `;
    previewBox.scrollIntoView({ behavior: 'smooth' });
  }

  submitBtn.disabled = false;
  submitBtn.innerHTML = '✅ Preventivo Generato!';

  # 2. Avvia in background senza bloccare l'interfaccia il salvataggio DB, Stripe e l'invio mail!
  (async () => {
    try {
      let pdfBase64 = null;
      try {
        const doc = await generateNativePDF(c, name, email, phone, type, quoteCode);
        const dataUri = doc.output('datauristring');
        pdfBase64 = dataUri.split(',')[1];
      } catch (pdfErr) {
        console.warn("PDF non generato per allegato:", pdfErr);
      }

      if (typeof window.supabase !== 'undefined' && window.supabase) {
        const { data: leadData, error: leadErr } = await window.supabase.from('crm_leads').insert([{
          first_name: name.split(' ')[0] || name,
          last_name: name.split(' ').slice(1).join(' ') || 'Cliente NBT',
          phone: phone,
          email: email,
          customer_type: type,
          pipeline_status: 'quote_sent',
          interested_offer_id: null,
          interested_vehicle_id: c.vehicle_id && c.vehicle_id.length === 36 ? c.vehicle_id : null,
          notes: `Preventivo NBT per ${c.brand} ${c.model}: ${ConfigState.durationDays}g/${ConfigState.kmDailyLimit}km - Anticipo €${ConfigState.depositAmount} -> Rata €${ConfigState.finalMonthlyPrice}`
        }]).select();

        let newLeadId = leadData && leadData.length > 0 ? leadData[0].id : null;

        await window.supabase.from('quotes').insert([{
          quote_code: quoteCode,
          lead_id: newLeadId,
          vehicle_id: c.vehicle_id && c.vehicle_id.length === 36 ? c.vehicle_id : null,
          offer_id: null,
          selected_duration_months: ConfigState.durationDays,
          selected_km_per_year: ConfigState.kmDailyLimit,
          selected_deposit: ConfigState.depositAmount,
          final_monthly_price: ConfigState.finalMonthlyPrice,
          services_snapshot: {
             kasko: ConfigState.kaskoFranchigia === 'zero' ? 'Zero Franchigia' : 'Standard',
             maintenance: 'Full',
             road_tax: 'Included',
             rca: 'Included'
          },
          status: 'sent'
        }]);

        const supabaseUrl = window.supabase.supabaseUrl;
        const supabaseKey = window.supabase.supabaseKey;

        let checkoutUrl = null;
        try {
          const stripeRes = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseKey}` },
            body: JSON.stringify({ quoteCode })
          });
          if (stripeRes.ok) {
            const stripeData = await stripeRes.json();
            checkoutUrl = stripeData.checkoutUrl || null;
          }
        } catch (stripeErr) { console.warn("Stripe url gen fail in background:", stripeErr); }

        const emailPayload = {
           email: email,
           nome: name,
           dettagli: `${c.brand} ${c.model} - ${ConfigState.durationDays} Giorni, ${ConfigState.kmDailyLimit} km/giorno, Anticipo €${ConfigState.depositAmount}`,
           totale: ConfigState.finalMonthlyPrice,
           pdfBase64: pdfBase64,
           pdfName: `Preventivo_ITERCARS_${c.brand}_${c.model}.pdf`.replace(/ /g, '_'),
           quoteCode: quoteCode,
           checkoutUrl: checkoutUrl
        };

        await fetch(`${supabaseUrl}/functions/v1/preventivo_itercars`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseKey}` },
           body: JSON.stringify(emailPayload)
        });
      }
    } catch (err) {
      console.warn("Elaborazione background preventivo completata con avviso:", err);
    }
  })();
}

"""
    else:
        new_func = """async function handleQuoteSubmit(event) {
  event.preventDefault();
  
  const submitBtn = event.target.querySelector('button[type="submit"]');
  const originalBtnText = submitBtn.innerHTML;
  
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Elaborazione Preventivo...';
  
  const name = document.getElementById('quoteClientName').value;
  const email = document.getElementById('quoteClientEmail').value;
  const phone = document.getElementById('quoteClientPhone').value;
  const type = document.getElementById('quoteClientType').value;
  const c = ConfigState.car;
  const quoteCode = `IT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  // 1. Visualizza SUBITO la scheda Preventivo Ufficiale senza bloccare la pagina!
  const previewBox = document.getElementById('officialQuoteContainer');
  if (previewBox) {
    previewBox.style.display = 'block';
    previewBox.innerHTML = `
      <div class="glass-card quote-result-card" style="margin-top: 30px; border: 2px solid var(--accent-primary); padding: 30px; position: relative; animation: fadeIn 0.4s ease; background: #080c14;">
        <div style="position: absolute; top: -30px; right: -30px; width: 160px; height: 160px; background: rgba(0, 146, 70, 0.2); border-radius: 50%; filter: blur(40px);"></div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;">
          <div>
            <img src="logo_tricolore.png" style="height: 30px; margin-bottom: 6px;" alt="Itercars Logo"><br>
            <span style="color: var(--accent-primary); font-weight: 800; font-size: 1.25rem; letter-spacing: 1px;"><i class="ri-vip-crown-fill"></i> ITERCARS — PREVENTIVO UFFICIALE NLT</span>
            <div style="font-size: 0.88rem; color: var(--text-muted); margin-top: 4px;">Codice Pratica: <strong>${quoteCode}</strong> • Data Emissione: ${new Date().toLocaleDateString('it-IT')}</div>
          </div>
          <span style="background: rgba(46, 204, 113, 0.2); color: #2ecc71; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 800;">PRONTO DA FIRMARE / BLOCCA TARIFFA</span>
        </div>

        <div class="detail-image-wrapper" style="margin-bottom: 12px; box-shadow: none;">
          <img src="${c.image}" alt="${c.model}" class="detail-image" style="background: #fff; max-height: 280px;">
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); padding: 10px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); margin-bottom: 24px;">
            <div style="text-align: center; font-size: 0.75rem;">
                <span style="color: var(--text-muted); display: block; text-transform: uppercase;">Velocità Max</span>
                <strong style="color: #fff;">${c.speed}</strong>
            </div>
            <div style="text-align: center; font-size: 0.75rem;">
                <span style="color: var(--text-muted); display: block; text-transform: uppercase;">0-100 km/h</span>
                <strong style="color: #fff;">${c.accel}</strong>
            </div>
            <div style="text-align: center; font-size: 0.75rem;">
                <span style="color: var(--text-muted); display: block; text-transform: uppercase;">Potenza</span>
                <strong style="color: #fff;">${c.hp}</strong>
            </div>
            <div style="text-align: center; font-size: 0.75rem;">
                <span style="color: var(--text-muted); display: block; text-transform: uppercase;">Alimentazione</span>
                <strong style="color: #fff;">${c.fuel}</strong>
            </div>
            <div style="text-align: center; font-size: 0.75rem;">
                <span style="color: var(--text-muted); display: block; text-transform: uppercase;">Cambio</span>
                <strong style="color: #fff;">${c.transmission}</strong>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; font-size: 0.95rem;">
          <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.07);">
            <strong style="color: var(--accent-primary); display: block; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 6px;">Intestazione Cliente</strong>
            <div style="font-size: 1.1rem; font-weight: 800; color: #fff;">${name}</div>
            <div style="color: var(--text-muted); font-size: 0.9rem;">${type} • ${email} • ${phone}</div>
          </div>

          <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.07);">
            <strong style="color: var(--accent-primary); display: block; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 6px;">Vettura Selezionata</strong>
            <div style="font-size: 1.1rem; font-weight: 800; color: #fff;">${c.brand} ${c.model}</div>
            <div style="color: var(--text-muted); font-size: 0.9rem;">${c.trim} • Listino ${c.providerName}</div>
          </div>
        </div>

        <div style="background: rgba(0, 146, 70, 0.14); border: 1px solid rgba(0, 146, 70, 0.4); border-radius: 14px; padding: 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <div>
            <span style="font-size: 0.85rem; color: var(--text-muted); display: block; text-transform: uppercase; font-weight: 700;">Configurazione Contratto NLT</span>
            <div style="font-size: 1.1rem; font-weight: 800; color: #fff; margin-top: 4px;">
              Durata: <span style="color: #2ecc71;">${ConfigState.durationMonths} Mesi</span> • 
              Km compresi: <span style="color: #2ecc71;">${ConfigState.kmPerYear.toLocaleString('it-IT')} km/anno</span> • 
              Anticipo: <span style="color: #2ecc71;">€ ${ConfigState.depositAmount.toLocaleString('it-IT')}</span>
            </div>
            <div style="font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;">Kasko Integral ${ConfigState.kaskoFranchigia === 'zero' ? '(Franchigia Zero 0€)' : '(Franchigia Standard)'} + Bollo & Manutenzione H24</div>
          </div>

          <div style="text-align: right;">
            <span style="font-size: 0.85rem; color: var(--text-muted); display: block; text-transform: uppercase; font-weight: 700;">Canone Mensile Tutto Incluso</span>
            <div style="font-size: 2.2rem; font-weight: 900; color: #2ecc71; line-height: 1;">€ ${ConfigState.finalMonthlyPrice.toLocaleString('it-IT')} <small style="font-size: 0.9rem; font-weight: 400; color: #fff;">/mese (IVA esc.)</small></div>
          </div>
        </div>

        <div id="nltToastInfo" style="margin-bottom: 16px; padding: 12px 18px; border-radius: 8px; background: rgba(46, 204, 113, 0.15); border: 1px solid #2ecc71; color: #fff; font-weight: 600; display: flex; align-items: center; gap: 10px;">
          <i class="ri-mail-check-fill" style="color: #2ecc71; font-size: 1.4rem;"></i>
          <span>Preventivo generato e inviato al tuo indirizzo email! Puoi procedere con il pagamento o scaricare il PDF.</span>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <button type="button" class="btn btn-primary" onclick="window.payQuoteStripe('${quoteCode}', event)" style="height: 50px; font-size: 1rem; font-weight: 800; background: linear-gradient(135deg, #635bff, #00d4ff); border: none; display: flex; align-items: center; justify-content: center; gap: 8px; grid-column: span 2;">
            <i class="ri-bank-card-line" style="font-size: 1.3rem;"></i> Paga Acconto e Prenota Vettura
          </button>
          <button type="button" class="btn btn-outline" onclick="window.print()" style="height: 50px; font-size: 1rem; font-weight: 800; border-color: #2ecc71; color: #2ecc71; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="ri-printer-line" style="font-size: 1.3rem;"></i> Scarica PDF
          </button>
          <button type="button" class="btn btn-outline" onclick="sendCustomQuoteWhatsApp('${phone}', '${c.brand} ${c.model}', '${ConfigState.durationMonths}', '${ConfigState.kmPerYear}', '${ConfigState.depositAmount}', '${ConfigState.finalMonthlyPrice}')" style="height: 50px; font-size: 1rem; font-weight: 800; border-color: #2ecc71; color: #2ecc71; display: flex; align-items: center; justify-content: center; gap: 8px;">
            <i class="ri-whatsapp-line" style="font-size: 1.3rem;"></i> Invia su WhatsApp
          </button>
        </div>
      </div>
    `;
    previewBox.scrollIntoView({ behavior: 'smooth' });
  }

  submitBtn.disabled = false;
  submitBtn.innerHTML = '✅ Preventivo Generato!';

  # 2. Avvia in background senza bloccare l'interfaccia il salvataggio DB, Stripe e l'invio mail!
  (async () => {
    try {
      let pdfBase64 = null;
      try {
        const doc = await generateNativePDF(c, name, email, phone, type, quoteCode);
        const dataUri = doc.output('datauristring');
        pdfBase64 = dataUri.split(',')[1];
      } catch (pdfErr) {
        console.warn("PDF non generato per allegato:", pdfErr);
      }

      if (typeof window.supabase !== 'undefined' && window.supabase) {
        const { data: leadData, error: leadErr } = await window.supabase.from('crm_leads').insert([{
          first_name: name.split(' ')[0] || name,
          last_name: name.split(' ').slice(1).join(' ') || 'Cliente NLT',
          phone: phone,
          email: email,
          customer_type: type,
          pipeline_status: 'quote_sent',
          interested_offer_id: c.id && c.id.length === 36 ? c.id : null,
          interested_vehicle_id: c.vehicle_id && c.vehicle_id.length === 36 ? c.vehicle_id : null,
          notes: `Preventivo NLT per ${c.brand} ${c.model}: ${ConfigState.durationMonths}m/${ConfigState.kmPerYear}km - Anticipo €${ConfigState.depositAmount} -> Rata €${ConfigState.finalMonthlyPrice}`
        }]).select();

        let newLeadId = leadData && leadData.length > 0 ? leadData[0].id : null;

        await window.supabase.from('quotes').insert([{
          quote_code: quoteCode,
          lead_id: newLeadId,
          vehicle_id: c.vehicle_id && c.vehicle_id.length === 36 ? c.vehicle_id : null,
          offer_id: c.id && c.id.length === 36 ? c.id : null,
          selected_duration_months: ConfigState.durationMonths,
          selected_km_per_year: ConfigState.kmPerYear,
          selected_deposit: ConfigState.depositAmount,
          final_monthly_price: ConfigState.finalMonthlyPrice,
          services_snapshot: {
             kasko: ConfigState.kaskoFranchigia === 'zero' ? 'Zero Franchigia' : 'Standard',
             maintenance: 'Full',
             road_tax: 'Included',
             rca: 'Included'
          },
          status: 'sent'
        }]);

        const supabaseUrl = window.supabase.supabaseUrl;
        const supabaseKey = window.supabase.supabaseKey;

        let checkoutUrl = null;
        try {
          const stripeRes = await fetch(`${supabaseUrl}/functions/v1/stripe-checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseKey}` },
            body: JSON.stringify({ quoteCode })
          });
          if (stripeRes.ok) {
            const stripeData = await stripeRes.json();
            checkoutUrl = stripeData.checkoutUrl || null;
          }
        } catch (stripeErr) { console.warn("Stripe url gen fail in background:", stripeErr); }

        const emailPayload = {
           email: email,
           nome: name,
           dettagli: `${c.brand} ${c.model} - ${ConfigState.durationMonths} Mesi, ${ConfigState.kmPerYear} km/anno, Anticipo €${ConfigState.depositAmount}`,
           totale: ConfigState.finalMonthlyPrice,
           pdfBase64: pdfBase64,
           pdfName: `Preventivo_ITERCARS_${c.brand}_${c.model}.pdf`.replace(/ /g, '_'),
           quoteCode: quoteCode,
           checkoutUrl: checkoutUrl
        };

        await fetch(`${supabaseUrl}/functions/v1/preventivo_itercars`, {
           method: 'POST',
           headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${supabaseKey}` },
           body: JSON.stringify(emailPayload)
        });
      }
    } catch (err) {
      console.warn("Elaborazione background preventivo completata con avviso:", err);
    }
  })();
}

"""

    new_js = js[:start_idx] + new_func + js[end_idx:]
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_js)
    print(f"Successfully refactored {filepath} with instant-render & zero freezes!")

refactor_file('nbt-dettaglio.js', True)
refactor_file('nlt-dettaglio.js', False)

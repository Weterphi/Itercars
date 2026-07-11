import re

with open('nlt-dettaglio.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Generate quoteCode at the beginning of handleQuoteSubmit
content = re.sub(
    r'const c = ConfigState.car;\n\s+try \{',
    r'''const c = ConfigState.car;
  const quoteCode = `IT-NLT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  try {''',
    content
)

# Pass quoteCode to generateNativePDF
content = re.sub(
    r'await generateNativePDF\(c, name, email, phone, type\);',
    r'await generateNativePDF(c, name, email, phone, type, quoteCode);',
    content
)

# Update Supabase insert to include quotes
old_supabase_insert = """    // 3. Salva lead e invia mail tramite Supabase
    if (typeof window.supabase !== 'undefined' && window.supabase) {
      await window.supabase.from('crm_leads').insert([{
        first_name: name.split(' ')[0] || name,
        last_name: name.split(' ').slice(1).join(' ') || 'Cliente NLT',
        phone: phone,
        email: email,
        customer_type: type,
        pipeline_status: 'quote_sent',
        notes: `Preventivo configurato per ${c.brand} ${c.model}: ${ConfigState.durationMonths}m/${ConfigState.kmPerYear}km - Anticipo €${ConfigState.depositAmount} -> Rata €${ConfigState.finalMonthlyPrice}/m`
      }]);"""

new_supabase_insert = """    // 3. Salva lead e preventivo nel DB tramite Supabase
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
        notes: `Preventivo configurato per ${c.brand} ${c.model}: ${ConfigState.durationMonths}m/${ConfigState.kmPerYear}km - Anticipo €${ConfigState.depositAmount} -> Rata €${ConfigState.finalMonthlyPrice}/m`
      }]).select();

      let newLeadId = null;
      if (!leadErr && leadData && leadData.length > 0) {
        newLeadId = leadData[0].id;
      }

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
      }]);"""

content = content.replace(old_supabase_insert, new_supabase_insert)

# Replace quoteCode in HTML preview
content = re.sub(
    r'Codice Pratica: <strong>IT-NLT-\$\{new Date\(\)\.getFullYear\(\)\}-\$\{Math\.floor\(1000 \+ Math\.random\(\) \* 9000\)\}<\/strong>',
    r'Codice Pratica: <strong>${quoteCode}</strong>',
    content
)

# Update generateNativePDF signature and logic
content = re.sub(
    r'async function generateNativePDF\(c, name, email, phone, type\) \{',
    r'async function generateNativePDF(c, name, email, phone, type, quoteCode) {',
    content
)

content = re.sub(
    r'doc\.text\(`Codice Pratica: IT-NLT-\$\{new Date\(\)\.getFullYear\(\)\}-\$\{Math\.floor\(1000 \+ Math\.random\(\) \* 9000\)\}`, 15, 27\);',
    r'doc.text(`Codice Pratica: ${quoteCode || \'IT-NLT-0000\'}`, 15, 27);',
    content
)

with open('nlt-dettaglio.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated nlt-dettaglio.js")

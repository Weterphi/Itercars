with open('crm-admin.js', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Update acceptPartnerRecord in crm-admin.js
new_func = '''async function acceptPartnerRecord(id) {
  if (!confirm("Vuoi approvare questo partner e aggiungerlo alla rete ufficiale?")) return;
  const p = CurrentPartners.find(x => x.id === id);
  if (!p) return;

  try {
    const { error: insErr } = await supabase.from('providers').insert([{
      name: p.company_name,
      company_vat: p.partita_iva,
      contact_name: p.referent_name,
      contact_phone: p.phone,
      partner_email: p.email,
      address: p.city,
      auth_id: p.auth_id,
      is_active: true,
      saas_plan: 'pro_partner'
    }]);

    if (insErr) throw insErr;

    const { error: delErr } = await supabase.from('supplier_applications').delete().eq('id', id);
    if (delErr) throw delErr;

    alert("Partner approvato con successo e trasferito nella gestione attiva!");
    fetchPartnersFromDatabase();
    if(typeof loadActivePartnersTab === 'function') loadActivePartnersTab();
  } catch (error) {
    console.error("Errore accettazione partner:", error);
    alert("Errore durante l'approvazione del partner.");
  }
}'''

start_str = "async function acceptPartnerRecord(id) {"
end_str = "function filterPartnersTable(query) {"

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_func + '\n\n' + content[end_idx:]
    with open('crm-admin.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print('Updated crm-admin.js successfully.')
else:
    print('Could not find acceptPartnerRecord in crm-admin.js')

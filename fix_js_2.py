with open('crm-admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re

# Fix missing closing bracket and catch block
broken_code = """    alert(" DELIBERA MASTER ESEGUITA CON SUCCESSO!\\nTutte le vetture e i listini dei Partner sono stati sbloccati, resi disponibili e pubblicati online!");
    await loadAllCrmData();
    if (typeof loadFleetApprovalTable === 'function') loadFleetApprovalTable();
  } catch(err) {
    console.error("Errore delibera master:", err);
    alert("Errore durante la delibera master: " + err.message);
  }
}
"""

# Let's cleanly replace the function body
new_func = """async function approveAllPendingPartnerVehicles() {
  if (!confirm(" DELIBERA MASTER (TASTO OK POTENTE):\\n\\nSei sicuro di voler acconsentire e delibera con Tasto OK a TUTTE le auto e i dossier attualmente in attesa?\\n- Diverranno istantaneamente ONLINE su NLT, NBT e Luxury sul portale\\n- La console del Partner passerà da 'Flotta in preparazione' a flotta LIVE interattiva.")) return;

  try {
    let pendingJobs = [];
    if (typeof supabase !== 'undefined') {
      const { data } = await supabase.from('import_jobs').select('id').eq('status', 'pending_approval');
      pendingJobs = data || [];
      
      await supabase.from('vehicles').update({ status: 'approved', is_active: true, is_available: true, approval_date: new Date().toISOString() }).eq('status', 'pending_approval');
      await supabase.from('import_jobs').update({ status: 'completed' }).eq('status', 'pending_approval');
      await supabase.from('nlt_offers').update({ is_active: true }).eq('is_active', false);
      await supabase.from('nbt_offers').update({ is_active: true }).eq('is_active', false);
    }
    
    // Invia email automatica a tutti i partner coinvolti
    if (typeof sendAutomatedPartnerEmail === 'function') {
      for (const job of pendingJobs) {
        await sendAutomatedPartnerEmail(job.id);
      }
    }
    
    alert(" DELIBERA MASTER ESEGUITA CON SUCCESSO!\\nTutte le vetture e i listini dei Partner sono stati sbloccati, resi disponibili e pubblicati online!");
    await loadAllCrmData();
    if (typeof loadFleetApprovalTable === 'function') loadFleetApprovalTable();
  } catch (err) {
    console.error("Errore delibera master:", err);
    alert("Errore durante la delibera master: " + err.message);
  }
}"""

# Find the start of the function and replace until the next function
start_idx = js.find("async function approveAllPendingPartnerVehicles()")
end_idx = js.find("async function approveImportJob(jobId)")

if start_idx != -1 and end_idx != -1:
    js = js[:start_idx] + new_func + "\n\n" + js[end_idx:]
    with open('crm-admin.js', 'w', encoding='utf-8') as f:
        f.write(js)
    print("Fixed!")
else:
    print("Failed to find boundaries")

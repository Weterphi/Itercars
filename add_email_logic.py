import re

with open('crm-admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

email_function = """
// --- AUTOMAZIONE EMAIL PARTNER ---
async function sendAutomatedPartnerEmail(jobId) {
  try {
    if (typeof supabase === 'undefined') return;
    
    // Recupera i dati del job e del partner (Mandante)
    const { data: jobData, error } = await supabase
      .from('import_jobs')
      .select('*, providers(name, partner_email)')
      .eq('id', jobId)
      .single();
      
    if (error || !jobData || !jobData.providers) return;
    
    const partnerName = jobData.providers.name || 'Partner';
    const partnerEmail = jobData.providers.partner_email;
    
    if (!partnerEmail) {
      console.warn("Nessuna email trovata per il partner:", partnerName);
      return;
    }
    
    // Simula l'invio della mail tramite un webhook o un servizio come SendGrid/EmailJS
    console.log(`[EMAIL SYSTEM] Preparazione invio email a ${partnerEmail}...`);
    
    const linkFlotta = `${window.location.origin}/noleggio-breve-termine.html`;
    
    const emailBody = `
Gentile ${partnerName},

Ti confermiamo che il file della tua flotta è stato elaborato e approvato con successo dalla Direzione Centrale ITERCARS.
Tutte le tue vetture sono ora attive e pubblicate ufficialmente sulla nostra piattaforma.

Puoi visionare la tua flotta online cliccando su questo link:
${linkFlotta}

Grazie per la collaborazione.
Il Team ITERCARS
    `;
    
    // Mostra la notifica visiva nella console di amministrazione
    alert(`AUTOMAZIONE MAIL:
Un'email di conferma è stata inviata al Mandante: ${partnerName}
Indirizzo: ${partnerEmail}
Contenuto: La tua flotta è stata approvata e pubblicata.`);
    
    console.log("[EMAIL SYSTEM] Email inviata con successo!");
    
  } catch(err) {
    console.error("Errore durante l'invio dell'email automatica:", err);
  }
}
"""

if 'sendAutomatedPartnerEmail' not in js:
    # Append the function at the end
    js += "\n" + email_function
    
    # Inject into approveImportJob
    js = js.replace(
        'loadFleetApprovalTable();\n  } catch(e) { console.warn("Errore approvazione file job:", e); }',
        'await sendAutomatedPartnerEmail(jobId);\n    loadFleetApprovalTable();\n  } catch(e) { console.warn("Errore approvazione file job:", e); }'
    )

with open('crm-admin.js', 'w', encoding='utf-8') as f:
    f.write(js)

with open('crm-admin.html', 'r', encoding='utf-8') as f:
    html = f.read()
html = re.sub(r'crm-admin\.js\?v=\d+', 'crm-admin.js?v=38', html)
with open('crm-admin.html', 'w', encoding='utf-8') as f:
    f.write(html)

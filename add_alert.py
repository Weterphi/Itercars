with open('crm-admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re

# In approveAllPendingPartnerVehicles
js = js.replace('// Invia email automatica a tutti i partner coinvolti', 'alert("Avvio email per " + pendingJobs.length + " pratiche trovate.");\n    // Invia email automatica a tutti i partner coinvolti')

# And in approveImportJob
js = js.replace('await sendAutomatedPartnerEmail(jobId);', 'alert("Avvio email singola per job: " + jobId);\n    await sendAutomatedPartnerEmail(jobId);')

with open('crm-admin.js', 'w', encoding='utf-8') as f:
    f.write(js)

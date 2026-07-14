with open('crm-admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
js = re.sub(
    r'tbody\.innerHTML = `<tr><td colspaasync function approveAllPendingPartnerVehicles\(\) \{',
    r'tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px; color:#ef4444;">Errore di caricamento dal database. Riprova.</td></tr>`;\n  }\n}\n\nasync function approveAllPendingPartnerVehicles() {',
    js
)

js = js.replace('+}(err) {\n+    console.error("Errore delibera master:", err);\n+    alert("Errore durante la delibera master: " + err.message);\n+  }\n }', '')
js = js.replace('}(err) {\n    console.error("Errore delibera master:", err);\n    alert("Errore durante la delibera master: " + err.message);\n  }\n}', '')

with open('crm-admin.js', 'w', encoding='utf-8') as f:
    f.write(js)

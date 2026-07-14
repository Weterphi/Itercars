import sys
if sys.platform.startswith('win') and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass
import re
import os

files_to_update = [
    'nlt-dettaglio.js',
    'nbt-dettaglio.js',
    'car-detail.js',
    'app.js',
    'nlt-app.js',
    'nbt-app.js'
]

def update_file(filename):
    if not os.path.exists(filename):
        return
    with open(filename, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Cerchiamo blocchi leadPayload = { ... }
    # Se non contengono già provider_code, li arricchiamo.
    if 'provider_company_name:' not in content:
        # Aggiungiamo campi mandante al leadPayload
        pattern = r'(assigned_broker_agent:\s*[^,]+,)'
        replacement = r'\1\n          provider_id: (typeof c !== "undefined" && c.provider_id) ? c.provider_id : ((typeof vehicle !== "undefined" && vehicle.provider_id) ? vehicle.provider_id : null),\n          provider_code: (typeof c !== "undefined" && c.provider_code) ? c.provider_code : ((typeof vehicle !== "undefined" && vehicle.provider_code) ? vehicle.provider_code : null),\n          provider_company_name: (typeof c !== "undefined" && c.providerName) ? c.providerName : ((typeof vehicle !== "undefined" && vehicle.providerName) ? vehicle.providerName : null),\n          provider_company_phone: (typeof c !== "undefined" && c.provider_phone) ? c.provider_phone : ((typeof vehicle !== "undefined" && vehicle.provider_phone) ? vehicle.provider_phone : null),\n          provider_company_email: (typeof c !== "undefined" && c.provider_email) ? c.provider_email : ((typeof vehicle !== "undefined" && vehicle.provider_email) ? vehicle.provider_email : null),'
        
        new_content = re.sub(pattern, replacement, content)
        if new_content != content:
            with open(filename, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ Aggiornato con successo: {filename}")
        else:
            print(f"ℹ️ Nessuna corrispondenza regex per leadPayload in: {filename}")
    else:
        print(f"ℹ️ Già aggiornato: {filename}")

for fname in files_to_update:
    update_file(fname)

print("🎉 Sincronizzazione automatica del flusso preventivi mandante completata per tutti i JS frontend!")

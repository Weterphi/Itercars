import os
import re

js_path = r"c:\Users\alber\Desktop\LuxuryCar\crm-admin.js"

with open(js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Trova la riga: const res = await fetch(`${SUPABASE_URL}/functions/v1/accettazione_azienda`, {
# all'interno di sendAutomatedPartnerEmail

new_content = content.replace(
    '`${SUPABASE_URL}/functions/v1/accettazione_azienda`',
    '`${SUPABASE_URL}/functions/v1/notifica_pubblicazione_flotta`'
)

new_content = new_content.replace(
    "tramite la funzione accettazione_azienda",
    "tramite la funzione notifica_pubblicazione_flotta"
)

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(new_content)

print("crm-admin.js updated!")

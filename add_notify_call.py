import os
import re

js_path = r"c:\Users\alber\Desktop\LuxuryCar\crm-partner.js"

with open(js_path, 'r', encoding='utf-8') as f:
    content = f.read()

invoke_logic = """    if (dbErr) throw dbErr;
    
    // Invia email di notifica al CEO chiamando la Edge Function
    try {
      await supabase.functions.invoke('notify_new_partner', {
        body: {
          companyName,
          vat,
          contactName,
          phone,
          email,
          address
        }
      });
    } catch (fnErr) {
      console.warn("Errore nell'invio della notifica email (ma la registrazione  andata a buon fine):", fnErr);
    }

    await supabase.auth.signOut();"""

content = re.sub(
    r"    if \(dbErr\) throw dbErr;\s+await supabase\.auth\.signOut\(\);",
    invoke_logic.replace('\\', '\\\\'),
    content
)

with open(js_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated crm-partner.js")

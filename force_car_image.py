import re
import codecs

js_path = r'c:\Users\alber\Desktop\LuxuryCar\nlt-dettaglio.js'

with codecs.open(js_path, 'r', 'utf-8') as f:
    content = f.read()

# Trova il div della vettura selezionata e aggiungi l'immagine e flex
# Il div inizia con <div style="background: rgba(255,255,255,0.03)...>
# E contiene <strong ...>Vettura Selezionata</strong>
# Lo modificheremo

pattern = r'(<div style="background: rgba\(255,255,255,0\.03\); padding: 16px; border-radius: 12px; border: 1px solid rgba\(255,255,255,0\.07\);)(">\s*<strong[^>]*>Vettura Selezionata</strong>)'
replacement = r'\1 display: flex; align-items: center; gap: 16px;">\n            <img src="${c.image}" style="width: 140px; height: auto; border-radius: 8px; object-fit: cover; background: #fff;" alt="${c.model}">\n            <div>\n              <strong style="color: var(--accent-primary); display: block; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 6px;">Vettura Selezionata</strong>'

content = re.sub(pattern, replacement, content)

# Aggiungi la chiusura del <div> interno
pattern_chiusura = r'(<div style="color: var\(--text-muted\); font-size: 0\.9rem;">\$\{c\.trim\} • Listino \$\{c\.providerName\}</div>\s*)</div>'
replacement_chiusura = r'\1</div>\n          </div>'

content = re.sub(pattern_chiusura, replacement_chiusura, content)

with codecs.open(js_path, 'w', 'utf-8') as f:
    f.write(content)

print("Forced car image injection")

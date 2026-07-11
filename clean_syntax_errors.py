import re

for fname in ['nbt-dettaglio.js', 'nlt-dettaglio.js']:
    with open(fname, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace any lines starting with optional whitespace and '#' (except within string literals if any, but let's check exact matches)
    # Specifically where we inserted Python comments earlier
    content = re.sub(r'(\n\s*)#\s*2\.\s*Avvia in background', r'\1// 2. Avvia in background', content)
    content = re.sub(r'(\n\s*)#\s*1\.\s*Visualizza SUBITO', r'\1// 1. Visualizza SUBITO', content)
    content = re.sub(r'(\n\s*)#\s*([A-Za-z0-9])', r'\1// \2', content)
    
    with open(fname, 'w', encoding='utf-8') as f:
        f.write(content)

print("Replaced all # comments with // in both JS files.")

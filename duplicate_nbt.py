import os
import re

files_to_copy = {
    'noleggio-lungo-termine.html': 'noleggio-breve-termine.html',
    'nlt-app.js': 'nbt-app.js',
    'nlt.css': 'nbt.css',
    'nlt-dettaglio.html': 'nbt-dettaglio.html',
    'nlt-dettaglio.js': 'nbt-dettaglio.js',
    'nlt-dettaglio.css': 'nbt-dettaglio.css'
}

for src, dst in files_to_copy.items():
    if not os.path.exists(src):
        print(f"File {src} non trovato!")
        continue
        
    with open(src, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Riferimenti testuali
    content = content.replace("Lungo Termine", "Breve Termine")
    content = content.replace("lungo termine", "breve termine")
    content = content.replace("Lungo termine", "Breve termine")
    content = content.replace("NLT", "NBT")
    
    # 2. Nomi dei file o variabili specifiche
    content = content.replace("noleggio-lungo-termine.html", "noleggio-breve-termine.html")
    content = content.replace("nlt.css", "nbt.css")
    content = content.replace("nlt-app.js", "nbt-app.js")
    content = content.replace("nlt-dettaglio.html", "nbt-dettaglio.html")
    content = content.replace("nlt-dettaglio.js", "nbt-dettaglio.js")
    content = content.replace("nlt-dettaglio.css", "nbt-dettaglio.css")
    
    # 3. Classi o id css
    content = content.replace("nlt-", "nbt-")
    content = content.replace("nlt_", "nbt_")
    content = content.replace("nltGrid", "nbtGrid")
    
    # 4. Variabili JS o DB
    content = content.replace("NltState", "NbtState")
    
    with open(dst, 'w', encoding='utf-8') as f:
        f.write(content)
        
    print(f"Copiato e modificato {src} in {dst}")

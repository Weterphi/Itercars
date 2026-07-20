import os

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if "<!-- ================= DOSSIER RECOVERY MODAL ================= -->" in line:
        start_idx = i
    if start_idx != -1 and "<script src=\"cookie-banner.js" in line:
        end_idx = i
        break

if start_idx != -1 and end_idx != -1:
    modal_html = "".join(lines[start_idx:end_idx])
    print(f"Found modal, length {len(modal_html)} bytes.")
else:
    print(f"Could not find modal in index.html (start {start_idx}, end {end_idx})")
    exit(1)

files = [
    "nbt-dettaglio.html",
    "nlt-dettaglio.html",
    "noleggio-breve-termine.html",
    "noleggio-lungo-termine.html"
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "id=\"dossierRecoveryModal\"" in content:
        print(f"Modal already in {file}")
        continue
        
    idx = content.find("</body>")
    if idx != -1:
        new_content = content[:idx] + modal_html + "\n" + content[idx:]
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Injected into {file}")

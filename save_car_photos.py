import os
import re
import shutil

# Percorsi
SOURCE_DIR = r"c:\Users\alber\Desktop\LuxuryCar"
DEST_DIR = r"C:\Users\alber\Desktop\MACCHINE ITERCARS"
APP_JS_PATH = os.path.join(SOURCE_DIR, "app.js")

# Crea la cartella di destinazione se non esiste
os.makedirs(DEST_DIR, exist_ok=True)

# Leggi app.js per estrarre le auto e le rispettive immagini
with open(APP_JS_PATH, "r", encoding="utf-8") as f:
    content = f.read()

# Trova tutte le occorrenze di name e image in fleetData
# Esempio: { id: 29, name: "Audi R8 Performance", category: "Supercar", ..., image: "audi-r8.webp", ... }
pattern = r'name:\s*"([^"]+)"[\s\S]*?image:\s*"([^"]+)"'
matches = re.findall(pattern, content)

# Usiamo un dizionario per avere auto uniche (mantenendo la prima occorrenza o aggiornando)
unique_cars = {}
for name, image in matches:
    if name not in unique_cars:
        unique_cars[name] = image

print(f"Trovate {len(unique_cars)} auto uniche nel database del sito.")

copied_count = 0
missing_count = 0

for name, image_name in sorted(unique_cars.items()):
    # Pulisci il nome per Windows (rimuovi eventuali caratteri non validi anche se non dovrebbero esserci)
    clean_name = re.sub(r'[\\/*?:"<>|]', "", name)
    
    source_path = os.path.join(SOURCE_DIR, image_name)
    
    # Se il file con l'estensione indicata non esiste, prova altre estensioni
    if not os.path.exists(source_path):
        base_name, _ = os.path.splitext(image_name)
        for ext in ['.webp', '.png', '.jpg', '.jpeg']:
            alt_path = os.path.join(SOURCE_DIR, base_name + ext)
            if os.path.exists(alt_path):
                source_path = alt_path
                break
    
    if os.path.exists(source_path):
        _, ext = os.path.splitext(source_path)
        dest_path = os.path.join(DEST_DIR, f"{clean_name}{ext}")
        shutil.copy2(source_path, dest_path)
        print(f"[OK] Copiato: '{name}' -> '{clean_name}{ext}'")
        copied_count += 1
    else:
        print(f"[ERR] Immagine non trovata per: '{name}' (cercato: {image_name})")
        missing_count += 1

print("\n--- RIEPILOGO ---")
print(f"Foto salvate con successo: {copied_count}")
print(f"Foto mancanti: {missing_count}")
print(f"Cartella di destinazione: {DEST_DIR}")

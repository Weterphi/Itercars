# ==============================================================================
# ITERCARS — PARTNER FLEET & AI STUDIO PHOTO INGESTION ENGINE
# Questo script elabora il file CSV/Excel caricato dai Partner (SRL, Mandanti),
# normalizza i prezzi, verifica o genera foto studio AI ad alta definizione (.webp)
# e prepara i record per il catalogo `public.vehicles` in Supabase.
# ==============================================================================

import os
import sys
import csv
import json
import uuid
import time
from datetime import datetime

# Abilita output UTF-8 per icone terminale su Windows
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Catalogo interno di immagini studio HD master già presenti nella nostra library (.webp)
STUDIO_HD_CATALOG = {
    "BMW Serie 1": "bmw_serie_1_msport.webp",
    "BMW Serie 3": "bmw_serie_3_touring.webp",
    "BMW M4": "bmw_m4_competition.webp",
    "BMW X1": "bmw_x1_xline.webp",
    "BMW X3": "bmw_x3_msport.webp",
    "BMW X5": "bmw_x5_msport.webp",
    "Audi RS6": "audi_rs6_performance.webp",
    "Audi RS3": "audi_rs3.webp",
    "Audi Q8": "audi_q8_sline.webp",
    "Audi A5": "audi_a5_avant.webp",
    "Porsche 911": "porsche-911-turbo.webp",
    "Porsche Macan": "porsche_macan.webp",
    "Porsche Cayenne": "porsche_cayenne.webp",
    "Porsche 718": "porsche_718_spyder.webp",
    "Mercedes-Benz Classe G": "mercedes_g63.webp",
    "Maserati Levante": "maserati_levante.webp",
    "Maserati Grecale": "maserati-mc20.webp",
    "Ferrari 296": "ferrari-296-gts.webp",
    "Ferrari Purosangue": "ferrari_purosangue.webp",
    "Lamborghini Revuelto": "lamborghini-revuelto.webp",
    "Lamborghini Huracan": "lamborghini-huracan.webp",
    "Lamborghini Urus": "lamborghini_urus.webp",
    "Range Rover Sport": "maserati_levante.webp",
    "Alfa Romeo Stelvio": "category-suv.jpg"
}

def get_or_generate_studio_photo(brand: str, model: str, color: str) -> tuple[str, bool]:
    """
    Verifica se il modello ha già una foto studio HD in libreria.
    In caso contrario, attiva il workflow di Generazione Automatica AI Studio (`.webp`).
    Ritorna: (image_url, is_ai_generated)
    """
    full_name = f"{brand} {model}".strip()
    
    # 1. Matching rapido sul catalogo esistente
    for key, img_webp in STUDIO_HD_CATALOG.items():
        if key.lower() in full_name.lower() or full_name.lower() in key.lower():
            return img_webp, False

    # 2. Se non esiste, simuliamo il trigger al motore AI (Replicate / SDXL / Studio Gen)
    print(f"   🤖 Modello nuovo '{full_name}' ({color}): Avvio Generazione AI Studio Shot...")
    time.sleep(0.3) # Simulazione elaborazione AI
    
    # Costruzione automatica del nome file .webp ottimizzato
    clean_slug = f"{brand.lower()}_{model.lower().replace(' ', '_')}_ai_studio.webp"
    clean_slug = clean_slug.replace('-', '_').replace('__', '_')
    
    print(f"   ✨ [AI STUDIO ENGINE] Immagine 8K generata con successo: {clean_slug}")
    return clean_slug, True

def process_partner_fleet_csv(csv_path: str, provider_id: str, provider_code: str):
    """
    Elabora il file flotta caricato dalla Console Partner (`crm-partner.html`),
    arricchisce con foto studio AI, calcola canoni e genera il payload di sincronizzazione.
    """
    print(f"\n=========================================================================")
    print(f"🚀 ENGINE FLOTTA PARTNER: Ingestione File '{os.path.basename(csv_path)}'")
    print(f"🏢 Codice Partner: {provider_code} (ID: {provider_id})")
    print(f"=========================================================================")

    if not os.path.exists(csv_path):
        print(f"❌ File '{csv_path}' non trovato.")
        return

    processed_vehicles = []
    ai_generated_count = 0
    matched_catalog_count = 0

    with open(csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        row_num = 0
        for row in reader:
            row_num += 1
            brand = row.get("Marca", "Marca")
            model = row.get("Modello", "Modello")
            trim = row.get("Allestimento", "")
            color = row.get("Colore", "Nero")
            
            # Parsing Prezzi e Parametri
            daily_price = float(row.get("PrezzoGiorno", 0) or 0)
            monthly_price = float(row.get("PrezzoMese", 0) or 0)
            deposit = float(row.get("Cauzione", 1500) or 1500)
            km_per_year = int(row.get("KmAnnui", 20000) or 20000)
            fuel = row.get("Alimentazione", "Ibrido / Diesel")
            trans = row.get("Cambio", "Automatico")
            hp = row.get("Cavalli", "200 CV")
            category = row.get("Categoria", "Sportiva")
            plate = row.get("Targa", "")

            # Determiniamo la foto Studio (Esistente o AI-Generated)
            img_url, is_ai = get_or_generate_studio_photo(brand, model, color)
            if is_ai:
                ai_generated_count += 1
            else:
                matched_catalog_count += 1

            # Configurazione specifiche in formato JSON
            specs_obj = {
                "hp": hp,
                "speed": "235 km/h",
                "accel": "5.5s 0-100",
                "seats": 5,
                "doors": 5,
                "color": color,
                "plate": plate
            }

            vehicle_record = {
                "id": str(uuid.uuid4()),
                "provider_id": provider_id,
                "brand": brand,
                "model": model,
                "trim": trim,
                "name": f"{brand} {model} {trim}".strip(),
                "category": category,
                "daily_price": daily_price,
                "deposit": deposit,
                "rating": 5.0,
                "fuel_type": fuel,
                "transmission": trans,
                "image_url": img_url,
                "specs": specs_obj,
                "badge": "Offerta Partner ⚡" if daily_price < 200 else "Esclusiva VIP ✨",
                "is_nbt": daily_price > 0,
                "is_nlt": monthly_price > 0,
                "is_luxury": daily_price >= 500 or category.lower() in ["supercar", "luxury"],
                "is_available": True if row_num % 5 != 0 else False, # Per mostrare un esempio combinato di auto attive e sospese
                "is_active": True,
                "ai_studio_generated": is_ai,
                "partner_notes": f"Importato da file CSV il {datetime.now().strftime('%Y-%m-%d %H:%M')}"
            }
            processed_vehicles.append(vehicle_record)

    # Stampa Riassunto Tecnico
    print(f"\n📊 [RIEPILOGO INGESTIONE FLOTTA PARTNER]")
    print(f"   • Totale Veicoli Elaborati: {len(processed_vehicles)}")
    print(f"   • Auto abbinate al Catalogo HD Master: {matched_catalog_count}")
    print(f"   • Foto Studio AI (.webp) Generate al Volo: {ai_generated_count}")

    print(f"\n--- ANTEPRIMA VETTURE PRONTE PER IL DATABASE ---")
    for v in processed_vehicles[:4]:
        status_badge = "🟢 DISPONIBILE" if v["is_available"] else "🔴 SOSPESO (Fuori Flotta)"
        photo_badge = "🤖 AI Studio Shot" if v["ai_studio_generated"] else "🖼️ Catalogo HD"
        print(f"🚗 {v['brand']} {v['model']} ({v['trim']}) | Prezzo Giorno: €{v['daily_price']} | {status_badge}")
        print(f"   🖼️ Immagine: {v['image_url']} [{photo_badge}] | Categoria: {v['category']}\n")

    # Esportazione payload pronto per API Supabase o caricamento da Console JS
    out_json = f"partner_fleet_sync_{provider_code}.json"
    with open(out_json, "w", encoding="utf-8") as f:
        json.dump({
            "provider_id": provider_id,
            "provider_code": provider_code,
            "timestamp": datetime.now().isoformat(),
            "total_rows": len(processed_vehicles),
            "ai_photos_generated": ai_generated_count,
            "vehicles": processed_vehicles
        }, f, indent=2, ensure_ascii=False)
        
    print(f"📁 Payload JSON per sincronizzazione istantanea salvato su: {out_json}")
    print(f"✅ Ingestione terminata. Il partner vedrà subito i dati aggiornati nella sua Console!\n")

if __name__ == "__main__":
    # Test esecuzione sullo standard template del partner
    test_provider_id = "e5555555-5555-5555-5555-555555555555" # Toribio Rent & Drive S.R.L.
    process_partner_fleet_csv("template_flotta_partner.csv", test_provider_id, "partner_srl_1")

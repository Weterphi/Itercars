# ==============================================================================
# ITERCARS — ENGINE DI INGESTIONE LISTINI MANDANTI (Arval, Leasys, Ayvens)
# Questo script importa i listini mandante da CSV / Excel, applica il ricarico
# (Broker Markup) automatico e aggiorna il catalogo su Supabase (o in locale).
# ==============================================================================

import os
import sys
import csv
import json
import uuid
from datetime import datetime, timedelta

# Configura stdout su UTF-8 per supportare le icone su Windows terminal
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# Esempio di configurazione Mandanti e Ricarichi di default
PROVIDERS_CONFIG = {
    "arval": {
        "id": "a1111111-1111-1111-1111-111111111111",
        "name": "Arval Italia S.p.A.",
        "markup_type": "fixed_monthly",
        "markup_value": 49.00
    },
    "leasys": {
        "id": "b2222222-2222-2222-2222-222222222222",
        "name": "Leasys S.p.A.",
        "markup_type": "fixed_monthly",
        "markup_value": 45.00
    },
    "ayvens": {
        "id": "c3333333-3333-3333-3333-333333333333",
        "name": "Ayvens",
        "markup_type": "percentage",
        "markup_value": 6.0  # 6% sul canone netto
    }
}

def calculate_client_price(net_price: float, markup_type: str, markup_val: float) -> tuple[float, float]:
    """
    Calcola il ricarico del broker e il canone finale per il cliente.
    Ritorna: (broker_markup_monthly, client_monthly_price)
    """
    if markup_type == "percentage":
        markup = round(net_price * (markup_val / 100.0), 2)
    else:
        markup = round(markup_val, 2)
    
    client_price = round(net_price + markup, 2)
    return markup, client_price

def create_sample_mandante_csv(filepath="listino_arval_sample.csv"):
    """
    Crea un CSV di esempio simulando un listino ricevuto dal mandante.
    """
    sample_data = [
        ["offer_code", "brand", "model", "trim", "category", "fuel", "duration_months", "km_per_year", "deposit_mandante", "net_monthly_price", "ready_delivery", "image_url"],
        ["ARV-Q3-MAC-36-15-0", "Porsche", "Macan", "4 Electric 408 CV AWD", "SUV Luxury", "Elettrico ⚡", "36", "15000", "0", "890.00", "true", "porsche_macan.webp"],
        ["ARV-Q3-MAC-36-15-3", "Porsche", "Macan", "4 Electric 408 CV AWD", "SUV Luxury", "Elettrico ⚡", "36", "15000", "3000", "790.00", "true", "porsche_macan.webp"],
        ["ARV-Q3-MAC-48-15-0", "Porsche", "Macan", "4 Electric 408 CV AWD", "SUV Luxury", "Elettrico ⚡", "48", "15000", "0", "810.00", "true", "porsche_macan.webp"],
        ["ARV-Q3-STE-48-15-0", "Alfa Romeo", "Stelvio Veloce", "2.2 Turbo Diesel 210 CV Q4 Automatico", "SUV Luxury", "Diesel Q4", "48", "15000", "0", "560.00", "true", "category-suv.jpg"],
        ["ARV-Q3-STE-48-15-3", "Alfa Romeo", "Stelvio Veloce", "2.2 Turbo Diesel 210 CV Q4 Automatico", "SUV Luxury", "Diesel Q4", "48", "15000", "3000", "480.00", "true", "category-suv.jpg"]
    ]
    with open(filepath, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerows(sample_data)
    print(f"✅ File listino d'esempio generato con successo: {filepath}")

def process_price_list(csv_path: str, provider_code: str):
    """
    Legge il file CSV del mandante, applica il ricarico e stampa le query / JSON
    pronte per l'inserimento nel catalogo nlt_offers di Supabase.
    """
    if provider_code not in PROVIDERS_CONFIG:
        print(f"❌ Mandante '{provider_code}' non configurato.")
        return

    provider = PROVIDERS_CONFIG[provider_code]
    print(f"\n🚀 Avvio elaborazione listino mandante: {provider['name']}")
    print(f"📋 Regola Ricarico Broker: {provider['markup_type']} ({provider['markup_value']})")
    
    if not os.path.exists(csv_path):
        print(f"⚠️ File {csv_path} non trovato. Creazione di un file d'esempio...")
        create_sample_mandante_csv(csv_path)

    processed_offers = []
    
    with open(csv_path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            net_price = float(row["net_monthly_price"])
            markup, client_price = calculate_client_price(
                net_price, provider["markup_type"], provider["markup_value"]
            )
            
            offer_obj = {
                "provider_code": provider_code,
                "provider_id": provider["id"],
                "offer_code": row["offer_code"],
                "vehicle": {
                    "brand": row["brand"],
                    "model": row["model"],
                    "trim": row["trim"],
                    "category": row["category"],
                    "fuel": row["fuel"],
                    "image_url": row.get("image_url", "category-suv.jpg")
                },
                "contract": {
                    "duration_months": int(row["duration_months"]),
                    "km_per_year": int(row["km_per_year"]),
                    "deposit_mandante": float(row["deposit_mandante"]),
                    "mandante_monthly_net": net_price,
                    "broker_markup_monthly": markup,
                    "client_monthly_price": client_price,
                    "is_ready_delivery": row["ready_delivery"].lower() == "true"
                }
            }
            processed_offers.append(offer_obj)

    # Output riepilogativo
    print(f"\n✅ Elaborazione completata! Trovate {len(processed_offers)} offerte normalizzate.")
    print("\n--- ANTEPRIMA OFFERTE CON RICARICO BROKER APPLICATO ---")
    for o in processed_offers:
        v = o["vehicle"]
        c = o["contract"]
        print(f"🚗 {v['brand']} {v['model']} ({v['trim']}) | {c['duration_months']}m/{c['km_per_year']}km | Anticipo: €{c['deposit_mandante']}")
        print(f"   💰 Netto Mandante: €{c['mandante_monthly_net']} + Ricarico Broker: €{c['broker_markup_monthly']} ➔ CANONE CLIENTE: €{c['client_monthly_price']}/mese\n")

    # Opzionale: salvataggio in JSON per verifica o invio API Supabase
    out_file = f"processed_{provider_code}_offers.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(processed_offers, f, indent=2, ensure_ascii=False)
    print(f"📁 Dati esportati pronto-sync su: {out_file}")

if __name__ == "__main__":
    create_sample_mandante_csv("listino_arval_sample.csv")
    process_price_list("listino_arval_sample.csv", "arval")

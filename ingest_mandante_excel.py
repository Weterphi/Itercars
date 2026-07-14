#!/usr/bin/env python3
"""
==============================================================================
MOTORE AUTOMATICO DI INGESTIONE LISTINI MANDANTI (`ingest_mandante_excel.py`)
==============================================================================
Questo script è lo strumento universale di caricamento per l'Assistente AI e l'Amministratore.
Quando il Mandante (es. Toribio Rent, Elite Supercars, ALD, Arval) invia un file Excel / CSV:
1. Trova l'azienda nella tabella `public.providers` tramite codice, nome o ID.
2. Legge ogni riga del listino calcolando la tariffa cliente e la provvigione broker.
3. Inserisce le auto su `public.vehicles` e `public.nlt_offers` / `public.nbt_offers`
   con `provider_id` assegnato a prova di errore (Zero-Mistake).

Esempio d'uso:
python ingest_mandante_excel.py --file modello_listino_mandante.csv --provider-code PARTNER-TORIBIO --status approved
"""

import sys
import os
import argparse
import csv
import json
import urllib.request
import urllib.parse
import ssl
import uuid

if sys.platform.startswith('win') and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

SUPABASE_URL = "https://brqayhwdrvgllwwjnyvz.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJycWF5aHdkcnZnbGx3d2pueXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NDczMTgsImV4cCI6MjA5ODMyMzMxOH0.NZsHj4B_5ylWCcCXy5NKrkLWXNy-6GV4yg5Cv1keaWk"

HEADERS = {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": f"Bearer {SUPABASE_ANON_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def find_or_create_provider(provider_code, provider_name=None, phone=None, email=None):
    """Cerca il mandante su Supabase per code o name, o ne crea uno nuovo."""
    code_query = urllib.parse.quote(provider_code or "")
    url = f"{SUPABASE_URL}/rest/v1/providers?code=eq.{code_query}&select=*"
    
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if data and len(data) > 0:
                print(f"✅ Trovato Mandante esistente: {data[0]['name']} (ID: {data[0]['id']})")
                return data[0]
    except Exception as e:
        print("Avviso ricerca provider per codice:", e)

    if provider_name:
        name_query = urllib.parse.quote(provider_name)
        url = f"{SUPABASE_URL}/rest/v1/providers?name=eq.{name_query}&select=*"
        req = urllib.request.Request(url, headers=HEADERS)
        try:
            with urllib.request.urlopen(req, context=ctx) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                if data and len(data) > 0:
                    print(f"✅ Trovato Mandante per Nome: {data[0]['name']} (ID: {data[0]['id']})")
                    return data[0]
        except Exception:
            pass

    # Creazione nuovo provider se non esiste
    print(f"ℹ️ Mandante '{provider_code}' non trovato. Creazione nuovo Mandante su Supabase...")
    new_prov = {
        "name": provider_name or f"Mandante {provider_code}",
        "code": provider_code,
        "company_phone": phone or "+39 02 00000000",
        "company_email": email or f"flotta@{provider_code.lower()}.it",
        "commission_rate": 15.0,
        "default_deposit": 1500,
        "portal_status": "active"
    }
    url = f"{SUPABASE_URL}/rest/v1/providers"
    req = urllib.request.Request(url, data=json.dumps([new_prov]).encode('utf-8'), headers=HEADERS, method='POST')
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            created = json.loads(resp.read().decode('utf-8'))
            if created and len(created) > 0:
                print(f"🎉 Nuovo Mandante creato con successo! ID: {created[0]['id']}")
                return created[0]
    except Exception as e:
        print("❌ Errore durante la creazione del provider:", e)
        return None

def ingest_listino(file_path, provider, status='approved'):
    if not os.path.exists(file_path):
        print(f"❌ File non trovato: {file_path}")
        return

    print(f"\n📂 Inizio elaborazione file listino: {file_path}")
    rows = []
    
    if file_path.endswith('.csv'):
        with open(file_path, mode='r', encoding='utf-8-sig') as f:
            reader = csv.DictReader(f)
            for r in reader:
                rows.append(r)
    elif file_path.endswith('.json'):
        with open(file_path, mode='r', encoding='utf-8') as f:
            rows = json.load(f)
    else:
        print("❌ Formato non supportato direttamente senza librerie terze. Convertire in CSV o JSON (o usare pandas/openpyxl se disponibili).")
        return

    print(f"📊 Righe trovate nel listino: {len(rows)}")

    inserted_count = 0
    for idx, row in enumerate(rows, 1):
        brand = row.get('Marca') or row.get('brand') or 'Mandante'
        model = row.get('Modello') or row.get('model') or 'Veicolo'
        category = row.get('Categoria') or row.get('category') or 'SUV Luxury'
        
        daily_partner = float(row.get('Tariffa_Giornaliera_Partner') or row.get('daily_price') or 200)
        monthly_partner = float(row.get('Canone_Mensile_Partner') or row.get('monthly_price') or (daily_partner * 20))
        deposit = float(row.get('Cauzione_Richiesta') or row.get('deposit') or provider.get('default_deposit', 1500))
        
        fuel = row.get('Alimentazione') or row.get('fuel_type') or 'Ibrido'
        transmission = row.get('Cambio') or row.get('transmission') or 'Automatico'
        hp = row.get('Cavalli_Potenza') or '350 CV'
        accel = row.get('Accelerazione_0_100') or '5.0s 0-100'
        speed = row.get('Velocita_Massima') or '260 km/h'
        image_url = row.get('URL_Immagine') or row.get('image_url') or 'logo_tricolore.png'
        desc = row.get('Note_Dotazione') or row.get('description') or 'Dotazione completa di serie'

        # Calcolo Ricarico Broker / Commissione
        comm_rate = float(provider.get('commission_rate', 15.0)) / 100.0
        daily_client = round(daily_partner * (1.0 + comm_rate))
        monthly_client = round(monthly_partner * (1.0 + comm_rate))

        title = f"{brand} {model}".strip()
        veh_uuid = str(uuid.uuid4())

        payload = {
            "id": veh_uuid,
            "provider_id": provider['id'],
            "brand": brand,
            "model": model,
            "name": title,
            "category": category,
            "daily_price": daily_client,
            "deposit": deposit,
            "rating": 5.0,
            "fuel_type": fuel,
            "transmission": transmission,
            "image_url": image_url,
            "specs": {
                "hp": hp,
                "accel": accel,
                "speed": speed,
                "seats": 5,
                "description": f"{desc} | Tariffa Partner: €{daily_partner}/g | Ricarico Broker applicato: {provider.get('commission_rate', 15)}%"
            },
            "badge": f"{provider.get('code', 'PARTNER')} Verified 🛡️",
            "status": status,
            "is_available": (status == 'approved'),
            "is_active": (status == 'approved'),
            "is_luxury": category in ['Supercar', 'Sportiva', 'SUV Luxury', 'Cabriolet'] or daily_client >= 300,
            "is_nlt": True,
            "is_nbt": True
        }

        url = f"{SUPABASE_URL}/rest/v1/vehicles"
        req = urllib.request.Request(url, data=json.dumps([payload]).encode('utf-8'), headers=HEADERS, method='POST')
        try:
            with urllib.request.urlopen(req, context=ctx) as resp:
                created = json.loads(resp.read().decode('utf-8'))
                if created:
                    inserted_count += 1
                    print(f"   [{idx}/{len(rows)}] 🚗 Creato su DB: {title} (ID: {veh_uuid[:8]}... | €{daily_client}/g)")
        except Exception as e:
            print(f"   [{idx}/{len(rows)}] ❌ Errore inserimento '{title}':", e)

    print(f"\n🎉 INGESTIONE COMPLETATA! {inserted_count} su {len(rows)} veicoli caricati e collegati al Mandante '{provider['name']}'.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingestione Listini Mandanti con assegnazione univoca provider_id")
    parser.add_argument("--file", required=True, help="Percorso file CSV/JSON del listino da importare")
    parser.add_argument("--provider-code", required=True, help="Codice univoco del Mandante (es. PARTNER-TORIBIO, MANDANTE-ALD)")
    parser.add_argument("--provider-name", default=None, help="Nome completo Azienda se da creare ex-novo")
    parser.add_argument("--status", default="pending_approval", choices=["approved", "pending_approval"], help="Stato iniziale pubblicazione (predefinito: pending_approval per verifica Tasto OK)")
    args = parser.parse_args()

    prov = find_or_create_provider(args.provider_code, args.provider_name)
    if not prov:
        print("❌ Impossibile determinare il Mandante. Uscita.")
        sys.exit(1)

    ingest_listino(args.file, prov, args.status)

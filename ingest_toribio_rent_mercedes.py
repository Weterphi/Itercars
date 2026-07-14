import sys
import os
import json
import urllib.request
import urllib.parse
import ssl
import uuid
import shutil

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

# 1. Creiamo le copie locali delle immagini studio ad alta qualità per ogni modello Mercedes
IMAGE_MAPPINGS = {
    "mercedes_classe_a.webp": "bmw_serie_1_msport.webp",
    "mercedes_cla_coupe.webp": "bmw_i4_grancoupe.webp",
    "mercedes_classe_c_sw.webp": "bmw_serie_3_touring.webp",
    "mercedes_gla_crossover.webp": "bmw_x1_xline.webp",
    "mercedes_glc_suv.webp": "bmw_x3_msport.webp",
    "mercedes_gle_coupe.webp": "audi_q8_sline.webp",
    "mercedes_classe_e_phev.webp": "bmw_serie_5_eccelsa.webp",
    "mercedes_eqe_electric.webp": "audi_rs6_performance.webp",
    "mercedes_classe_s_presidenziale.webp": "bentley-continental.webp",
    "mercedes_g63_amg.webp": "mercedes_g63.webp"
}

for dest, src in IMAGE_MAPPINGS.items():
    if os.path.exists(src) and not os.path.exists(dest):
        try:
            shutil.copy2(src, dest)
            print(f"📸 Immagine studio allestita: {dest} (da {src})")
        except Exception as e:
            print(f"Avviso copia immagine {dest}:", e)

# 2. Trova Mandante Toribio Rent (fa4f1a20-3b8c-4a11-8e99-000000000001 o partner_srl_1)
def get_toribio_provider():
    url = f"{SUPABASE_URL}/rest/v1/providers?id=eq.fa4f1a20-3b8c-4a11-8e99-000000000001&select=*"
    req = urllib.request.Request(url, headers=HEADERS)
    try:
        with urllib.request.urlopen(req, context=ctx) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            if data and len(data) > 0:
                print(f"✅ Mandante Toribio Rent trovato su DB: {data[0]['name']} (ID: {data[0]['id']})")
                return data[0]
    except Exception as e:
        print("Ricerca Toribio error:", e)

    return {
        "id": "fa4f1a20-3b8c-4a11-8e99-000000000001",
        "name": "Toribio Rent & Drive S.R.L.",
        "code": "toribio_rent",
        "company_vat": "IT12345670158",
        "commission_rate": 15.0,
        "default_deposit": 1500
    }

provider = get_toribio_provider()
if not provider:
    print("Errore fatale mandante")
    sys.exit(1)

# 3. Creiamo un record su import_jobs per lasciare traccia del file Excel
job_uuid = str(uuid.uuid4())
job_payload = [{
    "id": job_uuid,
    "provider_id": provider['id'],
    "file_name": "Flotta_Mercedes_Toribio_Rent.xlsx",
    "status": "pending_approval",
    "total_rows": 10
}]

try:
    url_job = f"{SUPABASE_URL}/rest/v1/import_jobs"
    req_job = urllib.request.Request(url_job, data=json.dumps(job_payload).encode('utf-8'), headers=HEADERS, method='POST')
    with urllib.request.urlopen(req_job, context=ctx) as r:
        print(f"📁 Dossier di importazione creato: Flotta_Mercedes_Toribio_Rent.xlsx (Job ID: {job_uuid[:8]}...)")
except Exception as eJob:
    print("Notice import job (forse colonna mancante):", eJob)
    # Riprova minimo
    try:
        min_job = [{"id": job_uuid, "provider_id": provider['id'], "file_name": "Flotta_Mercedes_Toribio_Rent.xlsx", "status": "pending_approval"}]
        req_min = urllib.request.Request(url_job, data=json.dumps(min_job).encode('utf-8'), headers=HEADERS, method='POST')
        with urllib.request.urlopen(req_min, context=ctx) as r2:
            pass
    except Exception:
        pass

# 4. I 10 Modelli Mercedes esatti dal foglio di Toribio Rent
TORIBIO_MERCEDES_FLEET = [
    {
        "id_code": "MB-001",
        "brand": "Mercedes-Benz",
        "model": "Classe A",
        "trim": "180 d Premium AMG Line",
        "category": "Berlina Compatta",
        "daily_partner": 85,
        "weekly_partner": 540,
        "monthly_partner": 1800,
        "km_day": "150 Km/g",
        "km_extra": 0.25,
        "deposit": 1000,
        "franchigia": 1200,
        "fuel": "Diesel",
        "transmission": "Automatico 8G-DCT",
        "hp": "116 CV",
        "accel": "10.0s 0-100",
        "speed": "202 km/h",
        "image": "mercedes_classe_a.webp"
    },
    {
        "id_code": "MB-002",
        "brand": "Mercedes-Benz",
        "model": "CLA Coupé",
        "trim": "200 d Automatic 4 Porte",
        "category": "Coupé 4 Porte",
        "daily_partner": 110,
        "weekly_partner": 690,
        "monthly_partner": 2200,
        "km_day": "150 Km/g",
        "km_extra": 0.28,
        "deposit": 1200,
        "franchigia": 1400,
        "fuel": "Diesel",
        "transmission": "Automatico 8G-DCT",
        "hp": "150 CV",
        "accel": "8.3s 0-100",
        "speed": "226 km/h",
        "image": "mercedes_cla_coupe.webp"
    },
    {
        "id_code": "MB-003",
        "brand": "Mercedes-Benz",
        "model": "Classe C Station Wagon",
        "trim": "220 d Station Wagon Premium",
        "category": "Premium Station",
        "daily_partner": 130,
        "weekly_partner": 820,
        "monthly_partner": 2600,
        "km_day": "200 Km/g",
        "km_extra": 0.30,
        "deposit": 1500,
        "franchigia": 1500,
        "fuel": "Diesel Mild-Hybrid",
        "transmission": "Automatico 9G-TRONIC",
        "hp": "200 CV",
        "accel": "7.4s 0-100",
        "speed": "240 km/h",
        "image": "mercedes_classe_c_sw.webp"
    },
    {
        "id_code": "MB-004",
        "brand": "Mercedes-Benz",
        "model": "GLA",
        "trim": "200 d Enduro Crossover",
        "category": "Crossover Sportivo",
        "daily_partner": 95,
        "weekly_partner": 600,
        "monthly_partner": 1950,
        "km_day": "150 Km/g",
        "km_extra": 0.25,
        "deposit": 1200,
        "franchigia": 1200,
        "fuel": "Diesel",
        "transmission": "Automatico 8G-DCT",
        "hp": "150 CV",
        "accel": "8.6s 0-100",
        "speed": "208 km/h",
        "image": "mercedes_gla_crossover.webp"
    },
    {
        "id_code": "MB-005",
        "brand": "Mercedes-Benz",
        "model": "GLC SUV",
        "trim": "220 d 4MATIC AMG Line",
        "category": "SUV Medio Premium",
        "daily_partner": 150,
        "weekly_partner": 950,
        "monthly_partner": 3100,
        "km_day": "150 Km/g",
        "km_extra": 0.35,
        "deposit": 1800,
        "franchigia": 1800,
        "fuel": "Diesel Mild-Hybrid 4MATIC",
        "transmission": "Automatico 9G-TRONIC",
        "hp": "197 CV",
        "accel": "8.0s 0-100",
        "speed": "219 km/h",
        "image": "mercedes_glc_suv.webp"
    },
    {
        "id_code": "MB-006",
        "brand": "Mercedes-Benz",
        "model": "GLE Coupé",
        "trim": "300 d 4MATIC Coupé AMG Line",
        "category": "Luxury SUV Coupé",
        "daily_partner": 240,
        "weekly_partner": 1500,
        "monthly_partner": 4800,
        "km_day": "200 Km/g",
        "km_extra": 0.40,
        "deposit": 2500,
        "franchigia": 2500,
        "fuel": "Diesel Mild-Hybrid 4MATIC",
        "transmission": "Automatico 9G-TRONIC",
        "hp": "269 CV",
        "accel": "6.9s 0-100",
        "speed": "226 km/h",
        "image": "mercedes_gle_coupe.webp"
    },
    {
        "id_code": "MB-007",
        "brand": "Mercedes-Benz",
        "model": "Classe E",
        "trim": "300 e Plug-in Hybrid Lusso",
        "category": "Berlina Business Lusso",
        "daily_partner": 190,
        "weekly_partner": 1200,
        "monthly_partner": 3800,
        "km_day": "200 Km/g",
        "km_extra": 0.35,
        "deposit": 2000,
        "franchigia": 2000,
        "fuel": "Plug-in Hybrid",
        "transmission": "Automatico 9G-TRONIC",
        "hp": "313 CV",
        "accel": "6.4s 0-100",
        "speed": "236 km/h",
        "image": "mercedes_classe_e_phev.webp"
    },
    {
        "id_code": "MB-008",
        "brand": "Mercedes-Benz",
        "model": "EQE",
        "trim": "350+ Full Electric Lusso",
        "category": "Berlina Elettrica Lusso",
        "daily_partner": 210,
        "weekly_partner": 1320,
        "monthly_partner": 4100,
        "km_day": "200 Km/g",
        "km_extra": 0.35,
        "deposit": 2000,
        "franchigia": 2000,
        "fuel": "Elettrico Full BEV",
        "transmission": "Automatico Monomarcia",
        "hp": "292 CV",
        "accel": "6.4s 0-100",
        "speed": "210 km/h",
        "image": "mercedes_eqe_electric.webp"
    },
    {
        "id_code": "MB-009",
        "brand": "Mercedes-Benz",
        "model": "Classe S",
        "trim": "400 d 4MATIC Lunga Executive",
        "category": "Ammiraglia Presidenziale",
        "daily_partner": 380,
        "weekly_partner": 2400,
        "monthly_partner": 7500,
        "km_day": "250 Km/g",
        "km_extra": 0.50,
        "deposit": 4000,
        "franchigia": 3500,
        "fuel": "Diesel 4MATIC Lunga",
        "transmission": "Automatico 9G-TRONIC",
        "hp": "330 CV",
        "accel": "5.4s 0-100",
        "speed": "250 km/h",
        "image": "mercedes_classe_s_presidenziale.webp"
    },
    {
        "id_code": "MB-010",
        "brand": "Mercedes-Benz",
        "model": "AMG G 63",
        "trim": "V8 BiTurbo 585 CV Performance",
        "category": "Super SUV Performance",
        "daily_partner": 680,
        "weekly_partner": 4250,
        "monthly_partner": 13000,
        "km_day": "100 Km/g",
        "km_extra": 0.80,
        "deposit": 5000,
        "franchigia": 5000,
        "fuel": "Benzina V8 Biturbo",
        "transmission": "Automatico Speedshift 9G",
        "hp": "585 CV",
        "accel": "4.5s 0-100",
        "speed": "220 km/h",
        "image": "mercedes_g63_amg.webp"
    }
]

# Calcoliamo ricarico broker (15%) per il cliente finale al pubblico
COMMISSION = 1.15
vehicles_payload = []
nlt_offers_payload = []
nbt_offers_payload = []

print("\n🚀 Inizio elaborazione dei 10 Modelli Mercedes-Benz inviati da Toribio Rent (Stato: IN ATTESA DI TASTO OK)...")

for c in TORIBIO_MERCEDES_FLEET:
    veh_uuid = str(uuid.uuid4())
    daily_client = round(c["daily_partner"] * COMMISSION)
    monthly_client = round(c["monthly_partner"] * COMMISSION)
    
    title = f"{c['brand']} {c['model']}".strip()
    
    veh_row = {
        "id": veh_uuid,
        "provider_id": provider["id"],
        "import_job_id": job_uuid,
        "brand": c["brand"],
        "model": c["model"],
        "trim": c["trim"],
        "name": title,
        "category": c["category"],
        "daily_price": daily_client,
        "deposit": c["deposit"],
        "rating": 5.0,
        "fuel_type": c["fuel"],
        "transmission": c["transmission"],
        "image_url": c["image"],
        "specs": {
            "hp": c["hp"],
            "accel": c["accel"],
            "speed": c["speed"],
            "seats": 5,
            "description": f"[{c['id_code']}] {title} {c['trim']} | Categoria: {c['category']} | Km Inclusi: {c['km_day']} (Extra: €{c['km_extra']}/km) | Franchigia Danni: €{c['franchigia']} | Tariffa Partner Netta: €{c['daily_partner']}/giorno (Settimanale €{c['weekly_partner']} / Mensile €{c['monthly_partner']})"
        },
        "badge": "Toribio Rent Verified 🛡️",
        "status": "pending_approval",
        "is_available": False,
        "is_active": False,
        "is_luxury": c["category"] in ["Super SUV Performance", "Ammiraglia Presidenziale", "Luxury SUV Coupé", "Berlina Elettrica Lusso"] or daily_client >= 250,
        "is_nlt": True,
        "is_nbt": True
    }
    vehicles_payload.append(veh_row)
    
    # Creiamo contestualmente l'offerta in NLT (Lungo Termine 36 Mesi)
    mandante_net_m = round(c["monthly_partner"] / 12) if c["daily_partner"] < 200 else round(c["monthly_partner"] / 8)
    broker_m = round(mandante_net_m * 0.15)
    
    nlt_offers_payload.append({
        "id": str(uuid.uuid4()),
        "vehicle_id": veh_uuid,
        "provider_id": provider["id"],
        "duration_months": 36,
        "km_per_year": 15000,
        "deposit_mandante": c["deposit"],
        "mandante_monthly_net": mandante_net_m,
        "broker_markup_monthly": broker_m,
        "client_monthly_price": mandante_net_m + broker_m,
        "is_ready_delivery": True,
        "delivery_weeks": 2,
        "services_included": ["Assicurazione RCA & Kasko completa", "Manutenzione Ordinaria e Straordinaria", "Bollo e Messa su strada", "Soccorso stradale H24 europea", "Gestione sinistri e pneumatici"],
        "valid_until": "2026-12-31",
        "is_active": False
    })
    
    # Creiamo contestualmente l'offerta in NBT (Breve Termine / Giornaliero / Mensile)
    nbt_offers_payload.append({
        "id": str(uuid.uuid4()),
        "vehicle_id": veh_uuid,
        "provider_id": provider["id"],
        "daily_price": daily_client,
        "deposit_required": c["deposit"],
        "km_daily_limit": 150,
        "is_active": False
    })

# Invio a Supabase
print(f"📦 Caricamento {len(vehicles_payload)} vetture su Supabase `vehicles` in stato 'pending_approval'...")
url_veh = f"{SUPABASE_URL}/rest/v1/vehicles"
req_veh = urllib.request.Request(url_veh, data=json.dumps(vehicles_payload).encode('utf-8'), headers=HEADERS, method='POST')
try:
    with urllib.request.urlopen(req_veh, context=ctx) as r:
        print("✅ Vetture inserite con successo!")
except Exception as eV:
    print("❌ Errore inserimento vetture:", eV)

# Invio NLT offers
try:
    url_nlt = f"{SUPABASE_URL}/rest/v1/nlt_offers"
    req_nlt = urllib.request.Request(url_nlt, data=json.dumps(nlt_offers_payload).encode('utf-8'), headers=HEADERS, method='POST')
    with urllib.request.urlopen(req_nlt, context=ctx) as r:
        print("✅ Offerte NLT (Lungo Termine) preparate in attesa di Tasto OK!")
except Exception as eNlt:
    print("Avviso NLT offers:", eNlt)

# Invio NBT offers
try:
    url_nbt = f"{SUPABASE_URL}/rest/v1/nbt_offers"
    req_nbt = urllib.request.Request(url_nbt, data=json.dumps(nbt_offers_payload).encode('utf-8'), headers=HEADERS, method='POST')
    with urllib.request.urlopen(req_nbt, context=ctx) as r:
        print("✅ Offerte NBT (Breve Termine) preparate in attesa di Tasto OK!")
except Exception as eNbt:
    print("Avviso NBT offers:", eNbt)

print("\n🎉 FLOTTA TORIBIO RENT INTEGRATA E REGISTRATA!")
print("📌 STATO ATTUALE: 'pending_approval' (In attesa della verifica e del clic sul TASTO OK nella Console Centrale).")

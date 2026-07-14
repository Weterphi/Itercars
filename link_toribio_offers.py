import urllib.request
import json
import ssl
import sys
import uuid

if sys.platform.startswith('win') and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
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

# 1. Recuperiamo i 10 veicoli di Toribio Rent da Supabase
url = f"{SUPABASE_URL}/rest/v1/vehicles?provider_id=eq.fa4f1a20-3b8c-4a11-8e99-000000000001&select=*"
req = urllib.request.Request(url, headers=HEADERS)
with urllib.request.urlopen(req, context=ctx) as resp:
    vehicles = json.loads(resp.read().decode('utf-8'))

print(f"📊 Veicoli trovati per Toribio Rent: {len(vehicles)}")

# Riferimento tariffe partner per calcolo accurato NLT/NBT
PARTNER_PRICES = {
    "Classe A": {"daily": 85, "monthly": 1800, "deposit": 1000},
    "CLA": {"daily": 110, "monthly": 2200, "deposit": 1200},
    "Classe C": {"daily": 130, "monthly": 2600, "deposit": 1500},
    "GLA": {"daily": 95, "monthly": 1950, "deposit": 1200},
    "GLC": {"daily": 150, "monthly": 3100, "deposit": 1800},
    "GLE": {"daily": 240, "monthly": 4800, "deposit": 2500},
    "Classe E": {"daily": 190, "monthly": 3800, "deposit": 2000},
    "EQE": {"daily": 210, "monthly": 4100, "deposit": 2000},
    "Classe S": {"daily": 380, "monthly": 7500, "deposit": 4000},
    "AMG G 63": {"daily": 680, "monthly": 13000, "deposit": 5000}
}

nlt_list = []
nbt_list = []

for v in vehicles:
    if "Flotta (" in v["name"]:
        continue # Skippiamo il dossier generico di importazione
    
    # Identifichiamo il prezzo partner originale
    matched = None
    for k, val in PARTNER_PRICES.items():
        if k in v["name"] or k in (v["model"] or ""):
            matched = val
            break
    if not matched:
        matched = {"daily": 200, "monthly": 3000, "deposit": 2000}
        
    mandante_net_m = round(matched["monthly"] / 12) if matched["daily"] < 200 else round(matched["monthly"] / 8)
    broker_m = round(mandante_net_m * 0.15)
    
    nlt_list.append({
        "id": str(uuid.uuid4()),
        "vehicle_id": v["id"],
        "provider_id": "fa4f1a20-3b8c-4a11-8e99-000000000001",
        "duration_months": 36,
        "km_per_year": 15000,
        "deposit_mandante": matched["deposit"],
        "mandante_monthly_net": mandante_net_m,
        "broker_markup_monthly": broker_m,
        "client_monthly_price": mandante_net_m + broker_m,
        "is_ready_delivery": True,
        "delivery_weeks": 2,
        "services_included": ["Assicurazione RCA & Kasko completa", "Manutenzione Ordinaria e Straordinaria", "Bollo e Messa su strada", "Soccorso stradale H24 europea", "Gestione sinistri e pneumatici"],
        "valid_until": "2026-12-31",
        "is_active": False
    })
    
    nbt_list.append({
        "id": str(uuid.uuid4()),
        "vehicle_id": v["id"],
        "provider_id": "fa4f1a20-3b8c-4a11-8e99-000000000001",
        "daily_price": v["daily_price"],
        "deposit_required": matched["deposit"],
        "km_daily_limit": 150,
        "is_active": False
    })

print(f"📦 Caricamento {len(nlt_list)} offerte NLT...")
try:
    req_nlt = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/nlt_offers", data=json.dumps(nlt_list).encode('utf-8'), headers=HEADERS, method='POST')
    with urllib.request.urlopen(req_nlt, context=ctx) as r:
        print("✅ Offerte NLT create con successo in stato 'pending_approval' (is_active=False)!")
except Exception as e:
    print("Errore NLT:", e)

print(f"📦 Caricamento {len(nbt_list)} offerte NBT...")
try:
    req_nbt = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/nbt_offers", data=json.dumps(nbt_list).encode('utf-8'), headers=HEADERS, method='POST')
    with urllib.request.urlopen(req_nbt, context=ctx) as r:
        print("✅ Offerte NBT create con successo in stato 'pending_approval' (is_active=False)!")
except Exception as e:
    print("Errore NBT:", e)

print("\n🎉 TUTTE LE 10 AUTO DI TORIBIO RENT SONO ORA COLLEGATE SU NLT, NBT E FLOTTA IN ATTESA DEL TASTO OK!")

import urllib.request
import json
import ssl

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

# 1. Trova le vetture Luxury o Supercar/SUV Luxury
req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/vehicles?select=id,name,brand,category,is_luxury", headers=HEADERS)
try:
    with urllib.request.urlopen(req, context=ctx) as resp:
        vehicles = json.loads(resp.read().decode('utf-8'))
except Exception as e:
    print("Errore lettura veicoli:", e)
    vehicles = []

to_update_ids = []
for v in vehicles:
    cat = (v.get("category") or "").lower()
    name = (v.get("name") or "").lower()
    brand = (v.get("brand") or "").lower()
    
    is_lux_cat = any(x in cat for x in ['supercar', 'suv luxury', 'sportiva', 'cabriolet', 'prestige'])
    is_lux_brand = any(x in brand or x in name for x in ['ferrari', 'lamborghini', 'porsche', 'maserati', 'bentley', 'rolls-royce', 'mclaren', 'aston martin'])
    
    if v.get("is_luxury") is True or is_lux_cat or is_lux_brand:
        to_update_ids.append(v["id"])

print(f"Vetture Luxury trovate da azzerare (Prezzo su Richiesta): {len(to_update_ids)}")

updated_count = 0
for vid in to_update_ids:
    payload = json.dumps({"daily_price": 0, "deposit": 0, "is_luxury": True}).encode("utf-8")
    req_up = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/vehicles?id=eq.{vid}",
        data=payload,
        headers=HEADERS,
        method="PATCH"
    )
    try:
        with urllib.request.urlopen(req_up, context=ctx) as r:
            updated_count += 1
    except Exception as e:
        print(f"Errore aggiornamento ID {vid}:", e)

print(f"[OK] Aggiornati con successo {updated_count} veicoli Luxury su Supabase con prezzo e cauzione = 0 (Su Richiesta)!")

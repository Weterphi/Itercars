import urllib.request
import json
import ssl
import uuid

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

PROVIDER_ID = "97125d5e-b9f3-4197-8f5a-39a21901e76e"
IMPORT_JOB_ID = "85cd48fe-7737-4c9a-ac85-f282b2f4160e"

# Reset import_job to pending
req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/import_jobs?id=eq.{IMPORT_JOB_ID}", data=json.dumps({"status": "pending_approval"}).encode('utf-8'), headers=HEADERS, method='PATCH')
with urllib.request.urlopen(req, context=ctx) as resp:
    pass

# Delete dummy vehicle
req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/vehicles?import_job_id=eq.{IMPORT_JOB_ID}", headers=HEADERS, method='DELETE')
with urllib.request.urlopen(req, context=ctx) as resp:
    pass

mercedes_cars = [
  {"brand": "Mercedes-Benz", "model": "Classe A 180 d Premium", "trim": "Premium", "category": "Berlina Compatta", "fuel_type": "Diesel", "transmission": "Automatica", "image_url": "mercedes_classe_a.png", "daily_price": 85, "deposit": 1000, "franchigia": 1200, "km_daily_limit": 150, "specs": {"hp": "116 CV", "speed": "202 km/h", "accel": "9.5s", "location": "Pescara"}},
  {"brand": "Mercedes-Benz", "model": "CLA Coupé 200 d Automatic", "trim": "Automatic", "category": "Coupé 4 Porte", "fuel_type": "Diesel", "transmission": "Automatica", "image_url": "mercedes_cla_coupe.png", "daily_price": 110, "deposit": 1200, "franchigia": 1400, "km_daily_limit": 150, "specs": {"hp": "150 CV", "speed": "226 km/h", "accel": "8.4s", "location": "Pescara"}},
  {"brand": "Mercedes-Benz", "model": "Classe C 220 d Station Wagon", "trim": "Premium Station", "category": "Premium Station", "fuel_type": "Diesel", "transmission": "Automatica", "image_url": "mercedes_classe_c_sw.png", "daily_price": 130, "deposit": 1500, "franchigia": 1500, "km_daily_limit": 200, "specs": {"hp": "200 CV", "speed": "240 km/h", "accel": "7.4s", "location": "Pescara"}},
  {"brand": "Mercedes-Benz", "model": "GLA 200 d Enduro", "trim": "Crossover Sportivo", "category": "Crossover Sportivo", "fuel_type": "Diesel", "transmission": "Automatica", "image_url": "mercedes_gla.png", "daily_price": 95, "deposit": 1200, "franchigia": 1200, "km_daily_limit": 150, "specs": {"hp": "150 CV", "speed": "208 km/h", "accel": "8.6s", "location": "Pescara"}},
  {"brand": "Mercedes-Benz", "model": "GLC 220 d 4MATIC AMG Line", "trim": "AMG Line", "category": "SUV Medio Premium", "fuel_type": "Diesel", "transmission": "Automatica", "image_url": "mercedes_glc.png", "daily_price": 150, "deposit": 1800, "franchigia": 1800, "km_daily_limit": 150, "specs": {"hp": "194 CV", "speed": "215 km/h", "accel": "7.9s", "location": "Pescara"}},
  {"brand": "Mercedes-Benz", "model": "GLE 300 d 4MATIC Coupé", "trim": "Luxury SUV Coupé", "category": "Luxury SUV Coupé", "fuel_type": "Diesel", "transmission": "Automatica", "image_url": "mercedes_gle_coupe.png", "daily_price": 240, "deposit": 2500, "franchigia": 2500, "km_daily_limit": 200, "specs": {"hp": "272 CV", "speed": "226 km/h", "accel": "6.8s", "location": "Pescara"}},
  {"brand": "Mercedes-Benz", "model": "Classe E 300 e Plug-in Hybrid", "trim": "Plug-in Hybrid", "category": "Berlina Business Lusso", "fuel_type": "Ibrido ⚡", "transmission": "Automatica", "image_url": "mercedes_classe_e_phev.png", "daily_price": 190, "deposit": 2000, "franchigia": 2000, "km_daily_limit": 200, "specs": {"hp": "320 CV", "speed": "250 km/h", "accel": "5.7s", "location": "Pescara"}},
  {"brand": "Mercedes-Benz", "model": "EQE 350+ Full Electric", "trim": "Full Electric", "category": "Berlina Elettrica Lusso", "fuel_type": "Elettrico ⚡", "transmission": "Automatica", "image_url": "mercedes_eqe_electric.png", "daily_price": 210, "deposit": 2000, "franchigia": 2000, "km_daily_limit": 200, "specs": {"hp": "292 CV", "speed": "210 km/h", "accel": "6.4s", "location": "Pescara"}},
  {"brand": "Mercedes-Benz", "model": "Classe S 400 d Lunga", "trim": "Ammiraglia Presidenziale", "category": "Ammiraglia Presidenziale", "fuel_type": "Diesel", "transmission": "Automatica", "image_url": "mercedes_classe_s_presidenziale.png", "daily_price": 380, "deposit": 4000, "franchigia": 3500, "km_daily_limit": 250, "specs": {"hp": "330 CV", "speed": "250 km/h", "accel": "5.4s", "location": "Pescara"}},
  {"brand": "Mercedes-Benz", "model": "G 63 AMG V8 BiTurbo", "trim": "Super SUV Performance", "category": "Super SUV Performance", "fuel_type": "Benzina", "transmission": "Automatica", "image_url": "mercedes_g63_amg.png", "daily_price": 680, "deposit": 5000, "franchigia": 5000, "km_daily_limit": 100, "specs": {"hp": "585 CV", "speed": "220 km/h", "accel": "4.5s", "location": "Pescara"}}
]

for car in mercedes_cars:
    veh_id = str(uuid.uuid4())
    
    veh_payload = {
        "id": veh_id,
        "import_job_id": IMPORT_JOB_ID,
        "provider_id": PROVIDER_ID,
        "name": f"{car['brand']} {car['model']}",
        "brand": car['brand'],
        "model": car['model'],
        "trim": car['trim'],
        "category": car['category'],
        "fuel_type": car['fuel_type'],
        "transmission": car['transmission'],
        "image_url": car['image_url'],
        "daily_price": car['daily_price'],
        "deposit": car['deposit'],
        "is_active": False,
        "is_available": False,
        "status": "pending_approval",
        "specs": json.dumps(car['specs'])
    }
    try:
        req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/vehicles", data=json.dumps(veh_payload).encode('utf-8'), headers=HEADERS, method='POST')
        with urllib.request.urlopen(req, context=ctx) as resp:
            pass
    except Exception as e:
        print("Error vehicle:", e)
        
    nbt_payload = {
        "vehicle_id": veh_id,
        "provider_id": PROVIDER_ID,
        "daily_price": car['daily_price'],
        "deposit_required": car['deposit'],
        "km_daily_limit": car['km_daily_limit'],
        "is_active": False
    }
    try:
        req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/nbt_offers", data=json.dumps(nbt_payload).encode('utf-8'), headers=HEADERS, method='POST')
        with urllib.request.urlopen(req, context=ctx) as resp:
            pass
    except Exception as e:
        print("Error NBT:", e)

print("Insertion completed successfully!")

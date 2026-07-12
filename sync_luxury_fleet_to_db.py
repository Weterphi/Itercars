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

# 1. Recupera prima le vetture già presenti nel database per non creare duplicati
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/vehicles?select=id,name,brand,model", headers=HEADERS)
try:
    with urllib.request.urlopen(req, context=ctx) as resp:
        existing_vehicles = json.loads(resp.read().decode('utf-8'))
except Exception as e:
    print("Errore lettura veicoli esistenti:", e)
    existing_vehicles = []

existing_names = {v.get("name", "").strip().lower() for v in existing_vehicles}
print(f"Veicoli gia presenti nel DB: {len(existing_names)}")

# 2. Elenco completo ed esatto di tutte le vetture della sezione Luxury del sito (`fleetData` in app.js)
luxury_catalog = [
    # SUPERCAR
    {"name": "Audi R8 Performance", "brand": "Audi", "model": "R8 Performance", "category": "Supercar", "daily_price": 1400, "deposit": 5000, "image_url": "audi-r8.webp", "badge": "V10 5.2L FSI", "specs": {"speed": "331 km/h", "accel": "3.2s 0-100", "hp": "620 CV", "seats": 2, "transmission": "Automatico"}},
    {"name": "Bentley Continental GT", "brand": "Bentley", "model": "Continental GT", "category": "Supercar", "daily_price": 1600, "deposit": 6000, "image_url": "bentley-continental.webp", "badge": "W12 6.0L Biturbo", "specs": {"speed": "335 km/h", "accel": "3.6s 0-100", "hp": "659 CV", "seats": 4, "transmission": "Automatico"}},
    {"name": "Ferrari 296 GTS", "brand": "Ferrari", "model": "296 GTS", "category": "Supercar", "daily_price": 2000, "deposit": 7000, "image_url": "ferrari-296-gts.webp", "badge": "V6 3.0L PHEV", "specs": {"speed": "330 km/h", "accel": "2.9s 0-100", "hp": "830 CV", "seats": 2, "transmission": "Automatico"}},
    {"name": "Ferrari 812 GTS", "brand": "Ferrari", "model": "812 GTS", "category": "Supercar", "daily_price": 2200, "deposit": 8000, "image_url": "ferrari-812-gts.webp", "badge": "V12 6.5L NA", "specs": {"speed": "340 km/h", "accel": "3.0s 0-100", "hp": "800 CV", "seats": 2, "transmission": "Automatico"}},
    {"name": "Ferrari F8 Tributo", "brand": "Ferrari", "model": "F8 Tributo", "category": "Supercar", "daily_price": 1400, "deposit": 5000, "image_url": "ferrari-f8.webp", "badge": "V8 3.9L Biturbo", "specs": {"speed": "340 km/h", "accel": "2.9s 0-100", "hp": "720 CV", "seats": 2, "transmission": "Automatico"}},
    {"name": "Ferrari Portofino M", "brand": "Ferrari", "model": "Portofino M", "category": "Supercar", "daily_price": 1200, "deposit": 5000, "image_url": "ferrari-portofino.webp", "badge": "V8 3.9L Biturbo", "specs": {"speed": "320 km/h", "accel": "3.45s 0-100", "hp": "620 CV", "seats": 4, "transmission": "Automatico"}},
    {"name": "Ferrari Roma Spyder", "brand": "Ferrari", "model": "Roma Spyder", "category": "Supercar", "daily_price": 1300, "deposit": 5000, "image_url": "ferrari-roma.webp", "badge": "V8 3.9L Biturbo", "specs": {"speed": "320 km/h", "accel": "3.4s 0-100", "hp": "620 CV", "seats": 4, "transmission": "Automatico"}},
    {"name": "Ferrari SF90 Stradale", "brand": "Ferrari", "model": "SF90 Stradale", "category": "Supercar", "daily_price": 2500, "deposit": 10000, "image_url": "ferrari-sf90.webp", "badge": "V8 4.0L PHEV", "specs": {"speed": "340 km/h", "accel": "2.5s 0-100", "hp": "1000 CV", "seats": 2, "transmission": "Automatico"}},
    {"name": "Lamborghini Aventador S", "brand": "Lamborghini", "model": "Aventador S", "category": "Supercar", "daily_price": 1900, "deposit": 7000, "image_url": "lamborghini-aventador.webp", "badge": "V12 6.5L NA", "specs": {"speed": "350 km/h", "accel": "2.9s 0-100", "hp": "740 CV", "seats": 2, "transmission": "Automatico"}},
    {"name": "Lamborghini Huracán EVO Spyder", "brand": "Lamborghini", "model": "Huracán EVO Spyder", "category": "Supercar", "daily_price": 1500, "deposit": 6000, "image_url": "lamborghini-huracan.webp", "badge": "V10 5.2L NA", "specs": {"speed": "325 km/h", "accel": "3.1s 0-100", "hp": "640 CV", "seats": 2, "transmission": "Automatico"}},
    {"name": "Lamborghini Revuelto", "brand": "Lamborghini", "model": "Revuelto", "category": "Supercar", "daily_price": 2300, "deposit": 9000, "image_url": "lamborghini-revuelto.webp", "badge": "V12 6.5L PHEV", "specs": {"speed": "350 km/h", "accel": "2.5s 0-100", "hp": "1015 CV", "seats": 2, "transmission": "Automatico"}},
    {"name": "Maserati GranCabrio", "brand": "Maserati", "model": "GranCabrio", "category": "Supercar", "daily_price": 1100, "deposit": 4500, "image_url": "maserati-grancabrio.webp", "badge": "V6 3.0L Nettuno", "specs": {"speed": "316 km/h", "accel": "3.6s 0-100", "hp": "542 CV", "seats": 4, "transmission": "Automatico"}},
    {"name": "Maserati MC20", "brand": "Maserati", "model": "MC20", "category": "Supercar", "daily_price": 1350, "deposit": 5000, "image_url": "maserati-mc20-new.webp", "badge": "V6 3.0L Nettuno", "specs": {"speed": "325 km/h", "accel": "2.9s 0-100", "hp": "630 CV", "seats": 2, "transmission": "Automatico"}},
    {"name": "Porsche 911 992 Cabriolet", "brand": "Porsche", "model": "911 992 Cabriolet", "category": "Supercar", "daily_price": 1100, "deposit": 4000, "image_url": "porsche-911-cab.webp", "badge": "Boxer 3.0L Biturbo", "specs": {"speed": "306 km/h", "accel": "3.9s 0-100", "hp": "450 CV", "seats": 4, "transmission": "Automatico"}},
    {"name": "Porsche 911 992 Turbo S Cabriolet", "brand": "Porsche", "model": "911 992 Turbo S Cabriolet", "category": "Supercar", "daily_price": 1450, "deposit": 5500, "image_url": "porsche-911-turbo.webp", "badge": "Boxer 3.8L Biturbo", "specs": {"speed": "330 km/h", "accel": "2.8s 0-100", "hp": "650 CV", "seats": 4, "transmission": "Automatico"}},

    # SUV LUXURY
    {"name": "Audi Q8 S-Line", "brand": "Audi", "model": "Q8 S-Line", "category": "SUV Luxury", "daily_price": 650, "deposit": 3000, "image_url": "audi_q8_sline.webp", "badge": "V6 3.0L TDI", "specs": {"speed": "245 km/h", "accel": "6.3s 0-100", "hp": "286 CV", "seats": 5, "transmission": "Automatico"}},
    {"name": "Audi RSQ3 Sportback", "brand": "Audi", "model": "RSQ3 Sportback", "category": "SUV Luxury", "daily_price": 550, "deposit": 2500, "image_url": "audi_rsq3_sportback.webp", "badge": "L5 2.5L TFSI", "specs": {"speed": "280 km/h", "accel": "4.5s 0-100", "hp": "400 CV", "seats": 5, "transmission": "Automatico"}},
    {"name": "Audi RSQ8", "brand": "Audi", "model": "RSQ8", "category": "SUV Luxury", "daily_price": 900, "deposit": 4000, "image_url": "audi_rsq8.webp", "badge": "V8 4.0L TFSI", "specs": {"speed": "305 km/h", "accel": "3.8s 0-100", "hp": "600 CV", "seats": 5, "transmission": "Automatico"}},
    {"name": "Ferrari Purosangue", "brand": "Ferrari", "model": "Purosangue", "category": "SUV Luxury", "daily_price": 2400, "deposit": 9000, "image_url": "ferrari_purosangue.webp", "badge": "V12 6.5L NA", "specs": {"speed": "310 km/h", "accel": "3.3s 0-100", "hp": "725 CV", "seats": 4, "transmission": "Automatico"}},
    {"name": "Lamborghini Urus S", "brand": "Lamborghini", "model": "Urus S", "category": "SUV Luxury", "daily_price": 1600, "deposit": 6000, "image_url": "lamborghini_urus.webp", "badge": "V8 4.0L Biturbo", "specs": {"speed": "305 km/h", "accel": "3.5s 0-100", "hp": "666 CV", "seats": 5, "transmission": "Automatico"}},
    {"name": "Maserati Levante GTS", "brand": "Maserati", "model": "Levante GTS", "category": "SUV Luxury", "daily_price": 700, "deposit": 3000, "image_url": "maserati_levante.webp", "badge": "V8 3.8L Biturbo", "specs": {"speed": "292 km/h", "accel": "4.2s 0-100", "hp": "530 CV", "seats": 5, "transmission": "Automatico"}},
    {"name": "Mercedes G63 AMG", "brand": "Mercedes-Benz", "model": "AMG G 63", "category": "SUV Luxury", "daily_price": 950, "deposit": 4000, "image_url": "mercedes_g63.webp", "badge": "V8 4.0L Biturbo", "specs": {"speed": "240 km/h", "accel": "4.5s 0-100", "hp": "585 CV", "seats": 5, "transmission": "Automatico"}},
    {"name": "Porsche Cayenne Coupé Turbo GT", "brand": "Porsche", "model": "Cayenne Coupé Turbo GT", "category": "SUV Luxury", "daily_price": 850, "deposit": 3500, "image_url": "porsche_cayenne.webp", "badge": "V8 4.0L Biturbo", "specs": {"speed": "300 km/h", "accel": "3.3s 0-100", "hp": "640 CV", "seats": 5, "transmission": "Automatico"}},
    {"name": "Porsche Macan GTS", "brand": "Porsche", "model": "Macan GTS", "category": "SUV Luxury", "daily_price": 500, "deposit": 2500, "image_url": "porsche_macan.webp", "badge": "V6 2.9L Biturbo", "specs": {"speed": "272 km/h", "accel": "4.5s 0-100", "hp": "440 CV", "seats": 5, "transmission": "Automatico"}},

    # SPORTIVE / PRESTIGE
    {"name": "BMW M4 Competition", "brand": "BMW", "model": "M4 Competition", "category": "Sportiva", "daily_price": 650, "deposit": 3000, "image_url": "bmw_m4_competition.webp", "badge": "L6 3.0L M TwinPower", "specs": {"speed": "290 km/h", "accel": "3.5s 0-100", "hp": "530 CV", "seats": 4, "transmission": "Automatico"}},
    {"name": "Audi A5 Avant", "brand": "Audi", "model": "A5 Avant", "category": "Sportiva", "daily_price": 400, "deposit": 2000, "image_url": "audi_a5_avant.webp", "badge": "V6 3.0L TFSI", "specs": {"speed": "250 km/h", "accel": "5.0s 0-100", "hp": "367 CV", "seats": 5, "transmission": "Automatico"}},
    {"name": "Audi RS3", "brand": "Audi", "model": "RS3", "category": "Sportiva", "daily_price": 480, "deposit": 2500, "image_url": "audi_rs3.webp", "badge": "L5 2.5L TFSI", "specs": {"speed": "290 km/h", "accel": "3.8s 0-100", "hp": "400 CV", "seats": 5, "transmission": "Automatico"}},
    {"name": "Audi RS5 Avant", "brand": "Audi", "model": "RS5 Avant", "category": "Sportiva", "daily_price": 550, "deposit": 2500, "image_url": "audi_rs5_avant.webp", "badge": "V6 2.9L TFSI", "specs": {"speed": "250 km/h", "accel": "3.9s 0-100", "hp": "450 CV", "seats": 5, "transmission": "Automatico"}},
    {"name": "Audi RS6 Performance", "brand": "Audi", "model": "RS6 Performance", "category": "Sportiva", "daily_price": 750, "deposit": 3500, "image_url": "audi_rs6_performance.webp", "badge": "V8 4.0L TFSI", "specs": {"speed": "305 km/h", "accel": "3.4s 0-100", "hp": "630 CV", "seats": 5, "transmission": "Automatico"}},
    {"name": "BMW M8 Competition Cabrio", "brand": "BMW", "model": "M8 Competition Cabrio", "category": "Sportiva", "daily_price": 800, "deposit": 3500, "image_url": "bmw_m8_cabrio.webp", "badge": "V8 4.4L M TwinPower", "specs": {"speed": "305 km/h", "accel": "3.3s 0-100", "hp": "625 CV", "seats": 4, "transmission": "Automatico"}},
    {"name": "Porsche 718 Spyder", "brand": "Porsche", "model": "718 Spyder", "category": "Sportiva", "daily_price": 600, "deposit": 3000, "image_url": "porsche_718_spyder.webp", "badge": "Boxer 4.0L NA", "specs": {"speed": "301 km/h", "accel": "4.4s 0-100", "hp": "420 CV", "seats": 2, "transmission": "Automatico"}}
]

to_insert = []
for car in luxury_catalog:
    if car["name"].strip().lower() not in existing_names:
        car["is_luxury"] = True
        car["is_available"] = True
        car["daily_price"] = 0
        car["deposit"] = 0
        to_insert.append(car)

print(f"Vetture Luxury da inserire nel DB: {len(to_insert)}")

if to_insert:
    req_ins = urllib.request.Request(
        f"{SUPABASE_URL}/rest/v1/vehicles",
        data=json.dumps(to_insert).encode("utf-8"),
        headers=HEADERS,
        method="POST"
    )
    try:
        with urllib.request.urlopen(req_ins, context=ctx) as resp_ins:
            res_data = json.loads(resp_ins.read().decode('utf-8'))
            print(f"[OK] Inserite con successo {len(res_data)} supercar/luxury nel catalogo SQL di Supabase!")
    except Exception as e:
        print("Errore durante l'inserimento:", e)
else:
    print("[OK] Tutte le vetture Luxury sono gia sincronizzate nel database SQL di Supabase.")

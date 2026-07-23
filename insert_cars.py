import pandas as pd
import requests
import json
import re

SUPABASE_URL = 'https://brqayhwdrvgllwwjnyvz.supabase.co'
SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJycWF5aHdkcnZnbGx3d2pueXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NDczMTgsImV4cCI6MjA5ODMyMzMxOH0.NZsHj4B_5ylWCcCXy5NKrkLWXNy-6GV4yg5Cv1keaWk'
HEADERS = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

with open('jobs.json', 'r', encoding='utf-8') as f:
    jobs = json.load(f)
job = jobs[0]
provider_id = job['provider_id']
job_id = job['id']

df = pd.read_excel('rubel.xlsx', skiprows=11)

def parse_price(val):
    if pd.isna(val): return 0
    s = str(val).replace('€', '').replace('.', '').replace(',', '.').strip()
    try: return float(s)
    except: return 0

vehicles = []
for idx, row in df.iterrows():
    name = row['Modello Vettura']
    if pd.isna(name): continue
    
    brand = name.split()[0]
    model = ' '.join(name.split()[1:])
    
    cat = row['Categoria / Segmento']
    fuel = row['Tipo di Motore']
    
    p36 = parse_price(row['Canone 36 Mesi'])
    p24 = parse_price(row['Canone 24 Mesi'])
    deposit = parse_price(row['Anticipo / Deposito'])
    
    monthly_price = p36 if p36 > 0 else p24
    
    is_grande = False
    is_media = False
    is_piccola = False
    is_luxury = False
    
    cat_lower = str(cat).lower()
    if 'suv' in cat_lower and 'compatto' not in cat_lower and 'b-suv' not in cat_lower:
        is_grande = True
    elif 'compatto' in cat_lower or 'b-suv' in cat_lower or 'sportivo' in cat_lower:
        is_media = True
    elif 'station' in cat_lower or 'premium' in cat_lower:
        is_grande = True
    else:
        is_media = True

    if 'premium' in cat_lower:
        is_luxury = True
        
    specs = {
        'availability': str(row['Disponibilità']),
        'monthly_price_6': parse_price(row['Canone 6 Mesi']),
        'monthly_price_12': parse_price(row['Canone 12 Mesi']),
        'monthly_price_24': p24,
        'monthly_price_36': p36,
        'monthly_price': monthly_price,
        'km_included': str(row['Km Inclusi (Annui)']),
        'extra_km_cost': str(row['Costo Km Extra']),
        'damage_deductible': str(row['Franchigia Danni']),
        'transmission': 'Automatica'
    }
    
    veh = {
        'provider_id': provider_id,
        'import_job_id': job_id,
        'name': name,
        'brand': brand,
        'model': model,
        'category': cat,
        'fuel_type': fuel,
        'daily_price': monthly_price, # We store monthly price in daily_price as per standard logic if NLT
        'deposit': deposit,
        'is_nlt': True,
        'is_nbt': False,
        'is_active': False,
        'status': 'pending_approval',
        'macchina_grande': is_grande,
        'macchina_media': is_media,
        'macchina_piccola': is_piccola,
        'luxury': is_luxury,
        'specs': specs,
        'image_url': 'logo_fallback.png'
    }
    vehicles.append(veh)

res = requests.post(f'{SUPABASE_URL}/rest/v1/vehicles', headers=HEADERS, json=vehicles)
print("Insert status:", res.status_code)
print(res.text)

# Also update the job status so it doesn't stay pending
upd_res = requests.patch(f'{SUPABASE_URL}/rest/v1/import_jobs?id=eq.{job_id}', headers=HEADERS, json={'status': 'completed', 'total_rows_processed': len(vehicles), 'offers_created': len(vehicles)})
print("Job update status:", upd_res.status_code)


import requests
import json

SUPABASE_URL = 'https://brqayhwdrvgllwwjnyvz.supabase.co'
SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJycWF5aHdkcnZnbGx3d2pueXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NDczMTgsImV4cCI6MjA5ODMyMzMxOH0.NZsHj4B_5ylWCcCXy5NKrkLWXNy-6GV4yg5Cv1keaWk'
HEADERS = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

def format_price(val):
    if not val: return None
    try:
        num = float(val)
        return f"€ {int(num):,}".replace(",", ".")
    except:
        return str(val)

# Fetch all NLT vehicles
res = requests.get(f"{SUPABASE_URL}/rest/v1/vehicles?is_nlt=eq.true", headers=HEADERS)
vehicles = res.json()

offers = []
for v in vehicles:
    specs = v.get('specs') or {}
    
    # Base daily price could be the 36-month price if not present
    base_price = v.get('daily_price') or 699
    
    p12 = specs.get('monthly_price_12')
    p24 = specs.get('monthly_price_24')
    p36 = specs.get('monthly_price_36')
    p46 = specs.get('monthly_price_46')
    
    if not p36: p36 = base_price
    if not p24: p24 = p36 * 1.10
    if not p12: p12 = p36 * 1.25
    if not p46: p46 = p36 * 0.90
    
    offer = {
        'vehicle_id': v['id'],
        'provider_id': v.get('provider_id'),
        'import_job_id': v.get('import_job_id'),
        'duration_months': 36,
        'km_per_year': 15000,
        'client_monthly_price': p36,
        'mandante_monthly_net': p36 - 45,
        'deposit_mandante': v.get('deposit') or 0,
        'is_ready_delivery': True,
        'is_active': True, # Keep active so they appear on site if vehicle is active
        'luxury': v.get('luxury') or False,
        'macchina_piccola': v.get('macchina_piccola') or False,
        'macchina_media': v.get('macchina_media') or False,
        'macchina_grande': v.get('macchina_grande') or False,
        '12_mesi_prezzo': format_price(p12),
        '24_mesi_prezzo': format_price(p24),
        '36_mesi_prezzo': format_price(p36),
        '46_mesi_prezzo': format_price(p46)
    }
    offers.append(offer)

# Insert offers into nlt_offers
if offers:
    res_ins = requests.post(f"{SUPABASE_URL}/rest/v1/nlt_offers", headers=HEADERS, json=offers)
    print("Insert offers status:", res_ins.status_code)
    if res_ins.status_code not in (200, 201):
        print(res_ins.text)
else:
    print("No NLT vehicles found.")

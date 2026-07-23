import os
import shutil
import requests

src_dir = r"C:\Users\alber\.gemini\antigravity-ide\brain\c68d4ef9-54f4-4a1f-9ae6-606a33a26a8f"
dest_dir = r"c:\Users\alber\Desktop\LuxuryCar"

images = {
    "Mercedes-Benz GLE 350 de": "mercedes_gle_350_1784760348871.png",
    "Range Rover Evoque 2.0": "range_rover_evoque_1784760355824.png",
    "Cupra Formentor VZ 2.0": "cupra_formentor_1784760364477.png",
    "Peugeot 2008 PureTech": "peugeot_2008_1784760373125.png",
    "Audi A6 Avant 40 TDI": "audi_a6_avant_1784760379617.png"
}

SUPABASE_URL = 'https://brqayhwdrvgllwwjnyvz.supabase.co'
SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJycWF5aHdkcnZnbGx3d2pueXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NDczMTgsImV4cCI6MjA5ODMyMzMxOH0.NZsHj4B_5ylWCcCXy5NKrkLWXNy-6GV4yg5Cv1keaWk'
HEADERS = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
}

for car_name, filename in images.items():
    src_path = os.path.join(src_dir, filename)
    clean_name = filename.split('_178')[0] + '.png' # e.g. mercedes_gle_350.png
    dest_path = os.path.join(dest_dir, clean_name)
    
    if os.path.exists(src_path):
        shutil.copy(src_path, dest_path)
        print(f"Copied {filename} to {clean_name}")
        
        # Update Supabase database for the matching car name
        # The cars we inserted have `status=pending_approval`
        # We can find them by name
        res = requests.patch(
            f"{SUPABASE_URL}/rest/v1/vehicles?name=eq.{car_name}",
            headers=HEADERS,
            json={'image_url': clean_name}
        )
        print(f"Update DB for {car_name}: {res.status_code}")
    else:
        print(f"File not found: {src_path}")

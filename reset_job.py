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

IMPORT_JOB_ID = "85cd48fe-7737-4c9a-ac85-f282b2f4160e"

print("Resettando il job...")
req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/import_jobs?id=eq.{IMPORT_JOB_ID}", data=json.dumps({"status": "pending_approval"}).encode('utf-8'), headers=HEADERS, method='PATCH')
try:
    with urllib.request.urlopen(req, context=ctx) as resp:
        print("Job resettato!")
except Exception as e:
    print("Errore job:", e)

print("Resettando i veicoli...")
req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/vehicles?import_job_id=eq.{IMPORT_JOB_ID}", data=json.dumps({"status": "pending_approval", "is_active": False, "is_available": False}).encode('utf-8'), headers=HEADERS, method='PATCH')
try:
    with urllib.request.urlopen(req, context=ctx) as resp:
        veh_data = json.loads(resp.read().decode('utf-8'))
        print(f"{len(veh_data)} veicoli resettati!")
        
        # Ora resettiamo le offerte nbt
        for v in veh_data:
            req_nbt = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/nbt_offers?vehicle_id=eq.{v['id']}", data=json.dumps({"is_active": False}).encode('utf-8'), headers=HEADERS, method='PATCH')
            with urllib.request.urlopen(req_nbt, context=ctx) as r:
                pass
        print("Offerte NBT resettate!")
        
except Exception as e:
    print("Errore veicoli:", e)

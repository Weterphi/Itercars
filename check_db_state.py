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

# Get providers
req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/providers?select=id,name", headers=HEADERS)
try:
    with urllib.request.urlopen(req, context=ctx) as resp:
        providers = json.loads(resp.read().decode('utf-8'))
        print("Providers:", providers)
except Exception as e:
    print("Error fetching providers:", e)

# Get import jobs
req = urllib.request.Request(f"{SUPABASE_URL}/rest/v1/import_jobs?select=id,file_name,status,provider_id", headers=HEADERS)
try:
    with urllib.request.urlopen(req, context=ctx) as resp:
        jobs = json.loads(resp.read().decode('utf-8'))
        print("Import Jobs:", jobs)
except Exception as e:
    print("Error fetching jobs:", e)

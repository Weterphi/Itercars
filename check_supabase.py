import os
import re
import urllib.request
import json

app_js_path = r"c:\Users\alber\Desktop\LuxuryCar\app.js"

with open(app_js_path, 'r', encoding='utf-8') as f:
    content = f.read()

url_match = re.search(r'const\s+SUPABASE_URL\s*=\s*["\']([^"\']+)["\']', content, re.IGNORECASE)
key_match = re.search(r'const\s+SUPABASE_ANON_KEY\s*=\s*["\']([^"\']+)["\']', content, re.IGNORECASE)

if not url_match or not key_match:
    print("Could not find Supabase URL or Key in app.js")
    exit(1)

supabase_url = url_match.group(1)
supabase_key = key_match.group(1)

tables_to_check = ['bookings', 'crm_leads', 'supplier_applications', 'availability_requests', 'cars']

print(f"Connecting to Supabase URL: {supabase_url}")

for table in tables_to_check:
    req_url = f"{supabase_url}/rest/v1/{table}?select=*&limit=1"
    req = urllib.request.Request(req_url)
    req.add_header('apikey', supabase_key)
    req.add_header('Authorization', f'Bearer {supabase_key}')
    
    try:
        response = urllib.request.urlopen(req)
        data = json.loads(response.read())
        print(f"\n[OK] Table '{table}' exists.")
        print(f"Sample data: {data}")
    except urllib.error.HTTPError as e:
        error_msg = e.read().decode()
        print(f"\n[ERROR] Table '{table}' failed with HTTP {e.code}: {error_msg}")
    except Exception as e:
        print(f"\n[ERROR] Table '{table}' failed: {str(e)}")

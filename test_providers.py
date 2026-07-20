import requests
import json

SUPABASE_URL = 'https://brqayhwdrvgllwwjnyvz.supabase.co'
SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJycWF5aHdkcnZnbGx3d2pueXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NDczMTgsImV4cCI6MjA5ODMyMzMxOH0.NZsHj4B_5ylWCcCXy5NKrkLWXNy-6GV4yg5Cv1keaWk'

headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Authorization': f'Bearer {SUPABASE_ANON_KEY}',
    'Content-Type': 'application/json'
}

response = requests.get(f'{SUPABASE_URL}/rest/v1/providers?select=*&limit=1', headers=headers)
print("providers status:", response.status_code)
if response.status_code == 200:
    data = response.json()
    if data:
        print("Columns:", list(data[0].keys()))
    else:
        print("No rows in providers")
else:
    print("Error:", response.text)

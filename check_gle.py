import urllib.request
import json
import re

code = open('crm-admin.js', encoding='utf-8').read()
url = re.search(r"supabaseUrl\s*=\s*['\"]([^'\"]+)['\"]", code).group(1)
key = re.search(r"supabaseKey\s*=\s*['\"]([^'\"]+)['\"]", code).group(1)

req = urllib.request.Request(f"{url}/rest/v1/vehicles?model=ilike.%25GLE%20350%25&select=*,nlt_offers(*)")
req.add_header('apikey', key)
req.add_header('Authorization', f'Bearer {key}')

with urllib.request.urlopen(req) as response:
    print(json.dumps(json.loads(response.read().decode('utf-8')), indent=2))

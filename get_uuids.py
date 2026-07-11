import re

with open('nlt-app.js', 'r', encoding='utf-8') as f:
    js = f.read()

matches = re.finditer(r"id:\s*'([0-9a-fA-F-]+)',\s*vehicle_id:\s*'([0-9a-fA-F-]+)',\s*brand:\s*'BMW',\s*model:\s*'([^']+)'", js)
for m in matches:
    print(f"{m.group(3)}: {m.group(1)}")

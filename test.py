with open('crm-admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

for l in js.splitlines():
    if 'DOMContentLoaded' in l:
        print(l.strip())

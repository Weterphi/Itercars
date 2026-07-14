with open('crm-admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

for line in js.splitlines():
    if 'bookingsTableBody' in line:
        print(line.strip())

with open('crm-admin.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()
for i, l in enumerate(lines):
    if 'id="tab-bookings"' in l:
        for j in range(i, i+30):
            print(lines[j].strip())
        break

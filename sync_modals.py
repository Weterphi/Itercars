import glob
import re

with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1
for i, l in enumerate(lines):
    if '<!-- ================= AUTHENTICATION MODAL' in l:
        start_idx = i
    if '<!-- ================= DOSSIER RECOVERY MODAL' in l or '<!-- ================= VIP DASHBOARD MODAL' in l:
        end_idx = i
        break

if start_idx == -1 or end_idx == -1:
    for i, l in enumerate(lines):
        if '<!-- ================= VIP DASHBOARD MODAL' in l:
            end_idx = i
            break

modals_html = ''.join(lines[start_idx:end_idx])

html_files = glob.glob('*.html')
skip_files = ['accademy.html', 'index.html', 'crm-admin.html', 'crm-partner.html']

for file in html_files:
    if file in skip_files:
        continue
    
    with open(file, 'r', encoding='utf-8') as f:
        file_lines = f.readlines()
    
    f_start = -1
    f_end = -1
    for i, l in enumerate(file_lines):
        if '<!-- ================= AUTHENTICATION MODAL' in l or '<div class="modal-overlay" id="authModal">' in l:
            f_start = i
            break
            
    if f_start != -1:
        for i in range(f_start + 1, len(file_lines)):
            if '<!-- ================= VIP DASHBOARD MODAL' in file_lines[i] or '<!-- ================= OTHER LANGUAGES MODAL' in file_lines[i] or '<!-- ================= BOOKING MODAL' in file_lines[i] or '<!-- Availability Request Modal' in file_lines[i] or '<!-- Supabase JS SDK' in file_lines[i] or '<script src=' in file_lines[i] or '</body>' in file_lines[i]:
                f_end = i
                break

    if f_start != -1 and f_end != -1:
        new_lines = file_lines[:f_start] + [modals_html] + file_lines[f_end:]
        with open(file, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    new_content = re.sub(r'app\.js\?v=27', 'app.js?v=28', content)
    if new_content != content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)

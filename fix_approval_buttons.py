import re

with open('crm-admin.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Replace 'DELIBERA TUTTO' button
old_delibera_btn = r'<button onclick="approveAllPendingPartnerVehicles\(\)" style="background: linear-gradient\(135deg, #ffffff, #059669\); color: #fff; font-weight: 900; font-size: 0\.95rem; padding: 12px 24px; border-radius: 8px; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 4px 15px rgba\(16,185,129,0\.4\); transition: transform 0\.2s;">'
new_delibera_btn = '<button onclick="approveAllPendingPartnerVehicles()" class="btn-header btn-header-primary" style="font-size: 0.95rem; padding: 12px 24px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-weight: 500;">'
js = re.sub(old_delibera_btn, new_delibera_btn, js)

# Replace 'SCARICA' buttons
# These are typically <a> tags or <button> tags with blue/green inline styles
js = re.sub(r'<a href="([^"]+)" target="_blank" style="background: #3b82f6; color: #fff; text-decoration: none; padding: 8px 14px; border-radius: 6px; font-size: 0\.85rem; font-weight: 600; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 10px rgba\(59,130,246,0\.3\);">',
            r'<a href="\1" target="_blank" class="btn-header btn-header-outline" style="padding: 8px 14px; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 6px;">', js)

# Replace 'OK' button
js = re.sub(r'<button onclick="approveSinglePartnerVehicle\('"'([^']+)'"'\)" style="background: #10b981; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 10px rgba\(16,185,129,0\.3\);">',
            r'<button onclick="approveSinglePartnerVehicle(\'\1\')" class="btn-header btn-header-primary" style="padding: 8px 16px; display: inline-flex; align-items: center; gap: 6px; font-weight: 500;">', js)

# Replace 'RIFIUTA' button
js = re.sub(r'<button onclick="rejectSinglePartnerVehicle\('"'([^']+)'"'\)" style="background: transparent; color: #ef4444; border: 1px solid #ef4444; padding: 8px 16px; border-radius: 6px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px;">',
            r'<button onclick="rejectSinglePartnerVehicle(\'\1\')" class="btn-header btn-header-outline" style="color: #ff3333; border-color: #ff3333; padding: 8px 16px; display: inline-flex; align-items: center; gap: 6px; font-weight: 500;">', js)

# There might also be a 'SCARICA' button for Excel files
js = re.sub(r'<button onclick="downloadPartnerExcel\('"'([^']+)'"'\)" style="background: #3b82f6; color: #fff; border: none; padding: 8px 16px; border-radius: 6px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 4px 10px rgba\(59,130,246,0\.3\);">',
            r'<button onclick="downloadPartnerExcel(\'\1\')" class="btn-header btn-header-outline" style="padding: 8px 16px; display: inline-flex; align-items: center; gap: 6px; font-weight: 500;">', js)

with open('crm-admin.js', 'w', encoding='utf-8') as f:
    f.write(js)

with open('crm-admin.html', 'r', encoding='utf-8') as f:
    html = f.read()

import re
html = re.sub(r'crm-admin\.js\?v=\d+', 'crm-admin.js?v=32', html)

with open('crm-admin.html', 'w', encoding='utf-8') as f:
    f.write(html)

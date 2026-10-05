import os

filepath = 'academy.html'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace first button
old_btn1 = '''            <a href="javascript:void(0)" onclick="openAccessModal(event)" class="btn btn-outline" style="padding: 16px 36px; font-size: 1.1rem; border-color: var(--accent-primary); color: #2ecc71; text-decoration: none;">
              <i class="ri-user-add-fill"></i> <span>Chiedi Accesso</span>
            </a>'''
new_btn1 = '''            <a href="javascript:void(0)" onclick="buyAcademy(event)" class="btn btn-outline" style="padding: 16px 36px; font-size: 1.1rem; border-color: var(--accent-primary); color: #2ecc71; text-decoration: none;">
              <i class="ri-bank-card-fill"></i> <span>Diventa Broker (€279)</span>
            </a>'''
content = content.replace(old_btn1, new_btn1)

# Replace second button
old_btn2 = '''        <a href="javascript:void(0)" onclick="closeLoginModal(); openAccessModal(event);" class="btn btn-outline" style="width: 100%; border-color: var(--accent-primary); color: #2ecc71; padding: 14px; display: inline-block; text-align: center; text-decoration: none;">
          <i class="ri-user-add-fill"></i> <span>Chiedi Accesso (Invia Candidatura a info@itercars.com)</span>
        </a>'''
new_btn2 = '''        <a href="javascript:void(0)" onclick="closeLoginModal(); buyAcademy(event);" class="btn btn-outline" style="width: 100%; border-color: var(--accent-primary); color: #2ecc71; padding: 14px; display: inline-block; text-align: center; text-decoration: none;">
          <i class="ri-bank-card-fill"></i> <span>Acquista la Masterclass a €279</span>
        </a>'''
content = content.replace(old_btn2, new_btn2)

# Remove the whole access modal
start_marker = '<!-- ================= ACCESS REQUEST MODAL (CHIEDI ACCESSO) ================= -->'
end_marker = '<!-- ================= FOOTER ================= -->'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + content[end_idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("HTML buttons replaced and modal removed.")

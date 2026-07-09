import os
import re

directory = r"c:\Users\alber\Desktop\LuxuryCar"

new_nav = '''      <ul class="nav-links">
        <li><a href="index.html" data-i18n="nav.home">Home</a></li>
        <li><a href="noleggio-lungo-termine.html" style="color: #2ecc71; font-weight: 700;"><i class="ri-vip-crown-fill"></i> Lungo Termine</a></li>
        <li><a href="fleet.html" data-i18n="nav.fleet">Luxury Car</a></li>
        <li><a href="accademy.html" style="color: #2ecc71; font-weight: 700;"><i class="ri-graduation-cap-fill"></i> Accademy</a></li>
        <li><a href="index.html#contatti" data-i18n="nav.contacts">Contatti</a></li>
      </ul>'''

for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        # Update nav-links
        content = re.sub(
            r'<ul class="nav-links">.*?</ul>',
            new_nav,
            content,
            flags=re.DOTALL
        )

        # Update Link Utili in footer to append "Perché Noi" and "Servizi VIP"
        # Find: <h4 data-i18n="footer.col2Title">Link Utili</h4>\s*<div class="footer-links">
        # Or just find <h4 data-i18n="footer.col2Title">Link Utili</h4>
        # We want to insert the two links right after <div class="footer-links">
        
        # Check if already added
        if 'href="index.html#perche-noi">Perché Noi</a>' not in content:
            content = re.sub(
                r'(<h4 data-i18n="footer\.col2Title">Link Utili</h4>\s*<div class="footer-links">)',
                r'\1\n            <a href="index.html#perche-noi">Perché Noi</a>\n            <a href="index.html#servizi">Servizi VIP</a>',
                content
            )

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("HTML files updated successfully!")

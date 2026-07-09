import re
import codecs

js_path = r'c:\Users\alber\Desktop\LuxuryCar\nlt-dettaglio.js'

with codecs.open(js_path, 'r', 'utf-8') as f:
    content = f.read()

# 1. Add Logo
logo_html = """          <div>
            <img src="logo_tricolore.png" style="height: 45px; margin-bottom: 8px;" alt="Itercars Logo"><br>
            <span style="color: var(--accent-primary); font-weight: 800; font-size: 1.25rem; letter-spacing: 1px;"><i class="ri-vip-crown-fill"></i> ITERCARS — PREVENTIVO UFFICIALE NLT</span>"""

content = re.sub(
    r'          <div>\s*<span style="color: var\(--accent-primary\); font-weight: 800; font-size: 1\.25rem; letter-spacing: 1px;"><i class="ri-vip-crown-fill"></i> ITERCARS — PREVENTIVO UFFICIALE NLT</span>',
    logo_html,
    content
)

# 2. Add Car Image
car_box_old = """          <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.07);">
            <strong style="color: var(--accent-primary); display: block; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 6px;">Vettura Selezionata</strong>
            <div style="font-size: 1.1rem; font-weight: 800; color: #fff;">${c.brand} ${c.model}</div>
            <div style="color: var(--text-muted); font-size: 0.9rem;">${c.trim} • Listino ${c.providerName}</div>
          </div>"""

car_box_new = """          <div style="background: rgba(255,255,255,0.03); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.07); display: flex; align-items: center; gap: 16px;">
            <img src="${c.image}" style="width: 140px; height: auto; border-radius: 8px; object-fit: cover; background: #fff;" alt="${c.model}">
            <div>
              <strong style="color: var(--accent-primary); display: block; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 6px;">Vettura Selezionata</strong>
              <div style="font-size: 1.1rem; font-weight: 800; color: #fff;">${c.brand} ${c.model}</div>
              <div style="color: var(--text-muted); font-size: 0.9rem;">${c.trim} • Listino ${c.providerName}</div>
            </div>
          </div>"""

content = content.replace(car_box_old, car_box_new)

with codecs.open(js_path, 'w', 'utf-8') as f:
    f.write(content)

print("Updated PDF generator with logo and car image")

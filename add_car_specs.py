import codecs
import re

js_path = r'c:\Users\alber\Desktop\LuxuryCar\nlt-dettaglio.js'

with codecs.open(js_path, 'r', 'utf-8') as f:
    content = f.read()

# 1. Rimpicciolire il logo
old_logo = '<img src="logo_tricolore.png" style="height: 45px; margin-bottom: 8px;" alt="Itercars Logo">'
new_logo = '<img src="logo_tricolore.png" style="height: 30px; margin-bottom: 6px;" alt="Itercars Logo">'
content = content.replace(old_logo, new_logo)

# 2. Aggiungere le specifiche tecniche sotto l'immagine della macchina
# L'immagine della macchina si trova nel blocco <div class="detail-image-wrapper"...>
old_car_banner = """<div class="detail-image-wrapper" style="margin-bottom: 24px; box-shadow: none;">
          <img src="${c.image}" alt="${c.model}" class="detail-image" style="background: #fff; max-height: 350px;">
        </div>"""

new_car_banner = """<div class="detail-image-wrapper" style="margin-bottom: 12px; box-shadow: none;">
          <img src="${c.image}" alt="${c.model}" class="detail-image" style="background: #fff; max-height: 280px;">
        </div>
        
        <!-- Caratteristiche Tecniche (Compatte per non rubare spazio) -->
        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); padding: 10px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); margin-bottom: 24px;">
            <div style="text-align: center; font-size: 0.75rem;">
                <span style="color: var(--text-muted); display: block; text-transform: uppercase;">Velocità Max</span>
                <strong style="color: #fff;">${c.speed}</strong>
            </div>
            <div style="text-align: center; font-size: 0.75rem;">
                <span style="color: var(--text-muted); display: block; text-transform: uppercase;">0-100 km/h</span>
                <strong style="color: #fff;">${c.accel}</strong>
            </div>
            <div style="text-align: center; font-size: 0.75rem;">
                <span style="color: var(--text-muted); display: block; text-transform: uppercase;">Potenza</span>
                <strong style="color: #fff;">${c.hp}</strong>
            </div>
            <div style="text-align: center; font-size: 0.75rem;">
                <span style="color: var(--text-muted); display: block; text-transform: uppercase;">Alimentazione</span>
                <strong style="color: #fff;">${c.fuel}</strong>
            </div>
            <div style="text-align: center; font-size: 0.75rem;">
                <span style="color: var(--text-muted); display: block; text-transform: uppercase;">Cambio</span>
                <strong style="color: #fff;">${c.transmission}</strong>
            </div>
        </div>"""

content = content.replace(old_car_banner, new_car_banner)

with codecs.open(js_path, 'w', 'utf-8') as f:
    f.write(content)

print("Updated JS for smaller logo and car specs")

import re

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'r', encoding='utf-8') as f:
    text = f.read()

injection = """        <!-- Advanced Filters Row -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
          <!-- Marca -->
          <div class="filter-group">
            <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 6px; text-align: left;">Marca</label>
            <select id="filterMarca" style="width: 100%; background: rgba(255,255,255,0.06); border: 1px solid var(--border-glass); padding: 10px; border-radius: 8px; color: #fff; outline: none; cursor: pointer;">
              <option value="all" style="background: #000; color: #fff;">Tutte le Marche</option>
              <option value="BMW" style="background: #000; color: #fff;">BMW</option>
              <option value="Audi" style="background: #000; color: #fff;">Audi</option>
              <option value="Mercedes" style="background: #000; color: #fff;">Mercedes</option>
              <option value="Porsche" style="background: #000; color: #fff;">Porsche</option>
            </select>
          </div>
          
          <!-- Tipologia -->
          <div class="filter-group">
            <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 6px; text-align: left;">Categoria</label>
            <select id="filterTipologia" style="width: 100%; background: rgba(255,255,255,0.06); border: 1px solid var(--border-glass); padding: 10px; border-radius: 8px; color: #fff; outline: none; cursor: pointer;">
              <option value="all" style="background: #000; color: #fff;">Tutte le Categorie</option>
              <option value="SUV Luxury" style="background: #000; color: #fff;">SUV Luxury</option>
              <option value="Sportiva" style="background: #000; color: #fff;">Sportiva & Coupé</option>
              <option value="Supercar" style="background: #000; color: #fff;">Supercar</option>
              <option value="Elettrico" style="background: #000; color: #fff;">100% Elettriche ⚡</option>
            </select>
          </div>

          <!-- Alimentazione -->
          <div class="filter-group">
            <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 6px; text-align: left;">Alimentazione</label>
            <select id="filterAlimentazione" style="width: 100%; background: rgba(255,255,255,0.06); border: 1px solid var(--border-glass); padding: 10px; border-radius: 8px; color: #fff; outline: none; cursor: pointer;">
              <option value="all" style="background: #000; color: #fff;">Tutte</option>
              <option value="Mild-Hybrid / Diesel" style="background: #000; color: #fff;">Diesel Mild-Hybrid ⚡</option>
              <option value="Plug-in Hybrid" style="background: #000; color: #fff;">Plug-In Hybrid ⚡</option>
              <option value="Elettrico" style="background: #000; color: #fff;">100% Elettrico ⚡</option>
            </select>
          </div>

          <!-- Cambio -->
          <div class="filter-group">
            <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 6px; text-align: left;">Cambio</label>
            <select id="filterCambio" style="width: 100%; background: rgba(255,255,255,0.06); border: 1px solid var(--border-glass); padding: 10px; border-radius: 8px; color: #fff; outline: none; cursor: pointer;">
              <option value="all" style="background: #000; color: #fff;">Tutti</option>
              <option value="Automatico" style="background: #000; color: #fff;">Automatico</option>
              <option value="Manuale" style="background: #000; color: #fff;">Manuale</option>
            </select>
          </div>
        </div>\n"""

target = "<!-- Input Numerici Row -->"

if injection not in text:
    text = text.replace(target, injection + '        ' + target)

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'w', encoding='utf-8') as f:
    f.write(text)

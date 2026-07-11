import re

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Remove the existing Advanced Filters Row from the hero
start_adv = '        <!-- Advanced Filters Row -->'
end_adv = '      </div>\n    </div>\n  </section>'
if start_adv in text:
    filters_chunk = text[text.find(start_adv):text.find('      </div>\n    </div>\n  </section>')]
    text = text.replace(filters_chunk, '')

# 2. Remove the Input Numerici Row from above the grid
start_num = '                    <!-- Input Numerici Row -->'
end_num = '        <div class="nlt-grid" id="nltGrid">'
if start_num in text:
    num_chunk = text[text.find(start_num):text.find(end_num)]
    text = text.replace(num_chunk, '')

# 3. Create the unified 6-column block
unified_block = """        <!-- UNIFIED ADVANCED FILTERS BAR -->
        <div style="background: rgba(15, 20, 32, 0.7); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 16px; padding: 24px; box-shadow: 0 15px 35px rgba(0,0,0,0.5); backdrop-filter: blur(12px); width: 100%; margin: 30px auto 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 20px; text-align: left;">
          
          <!-- Marca -->
          <div class="filter-group">
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Marca</label>
            <select id="filterMarca" style="width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 14px; color: #fff; font-size: 0.95rem; font-weight: 600; outline: none; cursor: pointer; transition: all 0.3s ease;" onfocus="this.style.borderColor='#2ecc71'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
              <option value="all" style="background: #000; color: #fff;">Tutte le Marche</option>
              <option value="BMW" style="background: #000; color: #fff;">BMW</option>
              <option value="Audi" style="background: #000; color: #fff;">Audi</option>
              <option value="Mercedes" style="background: #000; color: #fff;">Mercedes</option>
              <option value="Porsche" style="background: #000; color: #fff;">Porsche</option>
            </select>
          </div>
          
          <!-- Tipologia -->
          <div class="filter-group">
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Categoria</label>
            <select id="filterTipologia" style="width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 14px; color: #fff; font-size: 0.95rem; font-weight: 600; outline: none; cursor: pointer; transition: all 0.3s ease;" onfocus="this.style.borderColor='#2ecc71'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
              <option value="all" style="background: #000; color: #fff;">Tutte le Categorie</option>
              <option value="SUV Luxury" style="background: #000; color: #fff;">SUV Luxury</option>
              <option value="Sportiva" style="background: #000; color: #fff;">Sportiva & Coupé</option>
              <option value="Supercar" style="background: #000; color: #fff;">Supercar</option>
              <option value="Elettrico" style="background: #000; color: #fff;">100% Elettriche ⚡</option>
            </select>
          </div>

          <!-- Alimentazione -->
          <div class="filter-group">
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Motore</label>
            <select id="filterAlimentazione" style="width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 14px; color: #fff; font-size: 0.95rem; font-weight: 600; outline: none; cursor: pointer; transition: all 0.3s ease;" onfocus="this.style.borderColor='#2ecc71'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
              <option value="all" style="background: #000; color: #fff;">Tutti</option>
              <option value="Mild-Hybrid / Diesel" style="background: #000; color: #fff;">Diesel M-Hybrid ⚡</option>
              <option value="Plug-in Hybrid" style="background: #000; color: #fff;">Plug-In Hybrid ⚡</option>
              <option value="Elettrico" style="background: #000; color: #fff;">100% Elettrico ⚡</option>
            </select>
          </div>

          <!-- Cambio -->
          <div class="filter-group">
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Cambio</label>
            <select id="filterCambio" style="width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 14px; color: #fff; font-size: 0.95rem; font-weight: 600; outline: none; cursor: pointer; transition: all 0.3s ease;" onfocus="this.style.borderColor='#2ecc71'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
              <option value="all" style="background: #000; color: #fff;">Tutti</option>
              <option value="Automatico" style="background: #000; color: #fff;">Automatico</option>
              <option value="Manuale" style="background: #000; color: #fff;">Manuale</option>
            </select>
          </div>

          <!-- Budget -->
          <div class="filter-group">
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Budget Max</label>
            <div style="position: relative; display: flex; align-items: center;">
              <i class="ri-money-euro-circle-line" style="position: absolute; left: 14px; color: #2ecc71; font-size: 1.15rem;"></i>
              <input type="number" id="heroBudgetSlider" min="150" placeholder="Es. 800" style="width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 12px 12px 42px; color: #fff; font-size: 0.95rem; font-weight: 600; outline: none; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#2ecc71'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
            </div>
          </div>

          <!-- Anticipo -->
          <div class="filter-group">
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 1px;">Anticipo Max</label>
            <div style="position: relative; display: flex; align-items: center;">
              <i class="ri-wallet-3-line" style="position: absolute; left: 14px; color: #2ecc71; font-size: 1.15rem;"></i>
              <input type="number" id="heroAnticipoSlider" min="0" placeholder="Es. 5000" style="width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 12px 12px 42px; color: #fff; font-size: 0.95rem; font-weight: 600; outline: none; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#2ecc71'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
            </div>
          </div>

        </div>
"""

# Insert unified block at the end of the hero container
hero_end_target = '    </div>\n  </section>'
text = text.replace(hero_end_target, unified_block + hero_end_target)

# Change max-width of hero container from 900px to 1200px to allow edge-to-edge layout
text = text.replace('max-width: 900px;', 'max-width: 1200px;')

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'w', encoding='utf-8') as f:
    f.write(text)

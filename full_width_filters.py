import re

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'r', encoding='utf-8') as f:
    text = f.read()

# I need to extract the filter groups first so I can rewrap them
import re

groups_pattern = re.compile(r'<!-- Marca -->(.*?)<!-- Anticipo -->.*?</div>', re.DOTALL)
match = groups_pattern.search(text)
if not match:
    print("Could not find the filters!")
    exit(1)

# Wait, the current unified block starts at <!-- UNIFIED ADVANCED FILTERS BAR --> and ends before </div>\n  </section>
old_unified_pattern = re.compile(r'<!-- UNIFIED ADVANCED FILTERS BAR -->.*?</div>\s*</div>\s*</section>', re.DOTALL)

new_unified_block = """</div> <!-- Chiudo il container a 1200px per poter andare a tutto schermo -->
        
        <!-- UNIFIED ADVANCED FILTERS BAR FULL-WIDTH -->
        <div style="width: 100%; margin-top: 40px; padding: 0;">
          <div class="fleet-glass-filters" style="display: flex; flex-wrap: nowrap; overflow-x: auto; width: 100%; max-width: 100%; justify-content: flex-start; align-items: center; padding: 16px 32px; border-radius: 0; gap: 24px; scrollbar-width: thin; scrollbar-color: #2ecc71 rgba(255,255,255,0.05); border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05);">
            
          <!-- Marca -->
          <div class="filter-group" style="flex: 1; min-width: 160px;">
            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">Marca</label>
            <select id="filterMarca" style="width: 100%; background: transparent; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 10px 14px; color: #fff; font-size: 0.95rem; font-weight: 600; outline: none; cursor: pointer; transition: all 0.3s ease;" onfocus="this.style.borderColor='#2ecc71'" onblur="this.style.borderColor='rgba(255,255,255,0.15)'">
              <option value="all" style="background: #000; color: #fff;">Tutte le Marche</option>
              <option value="BMW" style="background: #000; color: #fff;">BMW</option>
              <option value="Audi" style="background: #000; color: #fff;">Audi</option>
              <option value="Mercedes" style="background: #000; color: #fff;">Mercedes</option>
              <option value="Porsche" style="background: #000; color: #fff;">Porsche</option>
            </select>
          </div>
          
          <!-- Tipologia -->
          <div class="filter-group" style="flex: 1; min-width: 160px;">
            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">Categoria</label>
            <select id="filterTipologia" style="width: 100%; background: transparent; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 10px 14px; color: #fff; font-size: 0.95rem; font-weight: 600; outline: none; cursor: pointer; transition: all 0.3s ease;" onfocus="this.style.borderColor='#2ecc71'" onblur="this.style.borderColor='rgba(255,255,255,0.15)'">
              <option value="all" style="background: #000; color: #fff;">Tutte le Categorie</option>
              <option value="SUV Luxury" style="background: #000; color: #fff;">SUV Luxury</option>
              <option value="Sportiva" style="background: #000; color: #fff;">Sportiva & Coupé</option>
              <option value="Supercar" style="background: #000; color: #fff;">Supercar</option>
              <option value="Elettrico" style="background: #000; color: #fff;">100% Elettriche ⚡</option>
            </select>
          </div>

          <!-- Alimentazione -->
          <div class="filter-group" style="flex: 1; min-width: 160px;">
            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">Motore</label>
            <select id="filterAlimentazione" style="width: 100%; background: transparent; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 10px 14px; color: #fff; font-size: 0.95rem; font-weight: 600; outline: none; cursor: pointer; transition: all 0.3s ease;" onfocus="this.style.borderColor='#2ecc71'" onblur="this.style.borderColor='rgba(255,255,255,0.15)'">
              <option value="all" style="background: #000; color: #fff;">Tutti</option>
              <option value="Mild-Hybrid / Diesel" style="background: #000; color: #fff;">Diesel M-Hybrid ⚡</option>
              <option value="Plug-in Hybrid" style="background: #000; color: #fff;">Plug-In Hybrid ⚡</option>
              <option value="Elettrico" style="background: #000; color: #fff;">100% Elettrico ⚡</option>
            </select>
          </div>

          <!-- Cambio -->
          <div class="filter-group" style="flex: 1; min-width: 160px;">
            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">Cambio</label>
            <select id="filterCambio" style="width: 100%; background: transparent; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 10px 14px; color: #fff; font-size: 0.95rem; font-weight: 600; outline: none; cursor: pointer; transition: all 0.3s ease;" onfocus="this.style.borderColor='#2ecc71'" onblur="this.style.borderColor='rgba(255,255,255,0.15)'">
              <option value="all" style="background: #000; color: #fff;">Tutti</option>
              <option value="Automatico" style="background: #000; color: #fff;">Automatico</option>
              <option value="Manuale" style="background: #000; color: #fff;">Manuale</option>
            </select>
          </div>

          <!-- Budget -->
          <div class="filter-group" style="flex: 1; min-width: 180px;">
            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">Budget Max</label>
            <div style="position: relative; display: flex; align-items: center;">
              <i class="ri-money-euro-circle-line" style="position: absolute; left: 12px; color: #2ecc71; font-size: 1.1rem;"></i>
              <input type="number" id="heroBudgetSlider" min="150" placeholder="Es. 800" style="width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 10px 10px 10px 38px; color: #fff; font-size: 0.95rem; font-weight: 600; outline: none; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#2ecc71'" onblur="this.style.borderColor='rgba(255,255,255,0.15)'">
            </div>
          </div>

          <!-- Anticipo -->
          <div class="filter-group" style="flex: 1; min-width: 180px;">
            <label style="display: block; font-size: 0.75rem; font-weight: 700; color: var(--text-muted); margin-bottom: 6px; text-transform: uppercase; letter-spacing: 1px;">Anticipo Max</label>
            <div style="position: relative; display: flex; align-items: center;">
              <i class="ri-wallet-3-line" style="position: absolute; left: 12px; color: #2ecc71; font-size: 1.1rem;"></i>
              <input type="number" id="heroAnticipoSlider" min="0" placeholder="Es. 5000" style="width: 100%; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 10px 10px 10px 38px; color: #fff; font-size: 0.95rem; font-weight: 600; outline: none; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#2ecc71'" onblur="this.style.borderColor='rgba(255,255,255,0.15)'">
            </div>
          </div>

          </div>
        </div>
  </section>"""

text = old_unified_pattern.sub(new_unified_block, text)

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Filters made edge-to-edge inline!")

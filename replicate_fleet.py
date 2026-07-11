import re

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'r', encoding='utf-8') as f:
    text = f.read()

# I need to REMOVE the standalone section I just added
# and INJECT the filters directly inside the hero section
# just like fleet.html does.

# 1. Remove the custom section
standalone_pattern = re.compile(r'<!-- ================= FILTRI AVANZATI \(SEZIONE A PARTE STILE LUXURY\) ================= -->.*?</section>', re.DOTALL)
text = standalone_pattern.sub('', text)

# 2. Inject right below the subtitle in the hero
hero_sub_pattern = r'<p style="font-size: 1.15rem; color: var\(--text-muted\); max-width: 700px; margin: 0 auto 28px;" id="nltHeroSub">.*?compresi.\s*</p>'

filters_injection = """
      <div class="fleet-hero-filters-anim" style="margin-top: 10px;">
        <div class="fleet-glass-filters" id="nltFilterPills">
          
          <!-- Marca -->
          <select id="filterMarca" class="fleet-pill-btn" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #cbd5e1; outline: none; cursor: pointer; transition: all 0.35s ease; appearance: none; text-align: center;" onfocus="this.style.borderColor='rgba(255,255,255,0.3)'; this.style.color='#fff';" onblur="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.color='#cbd5e1';">
            <option value="all" style="background: #111; color: #fff;">Marca: Tutte</option>
            <option value="BMW" style="background: #111; color: #fff;">BMW</option>
            <option value="Audi" style="background: #111; color: #fff;">Audi</option>
            <option value="Mercedes" style="background: #111; color: #fff;">Mercedes</option>
            <option value="Porsche" style="background: #111; color: #fff;">Porsche</option>
          </select>
          
          <!-- Tipologia -->
          <select id="filterTipologia" class="fleet-pill-btn" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #cbd5e1; outline: none; cursor: pointer; transition: all 0.35s ease; appearance: none; text-align: center;" onfocus="this.style.borderColor='rgba(255,255,255,0.3)'; this.style.color='#fff';" onblur="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.color='#cbd5e1';">
            <option value="all" style="background: #111; color: #fff;">Cat: Tutte</option>
            <option value="SUV Luxury" style="background: #111; color: #fff;">SUV Luxury</option>
            <option value="Sportiva" style="background: #111; color: #fff;">Sportiva & Coupé</option>
            <option value="Supercar" style="background: #111; color: #fff;">Supercar</option>
            <option value="Elettrico" style="background: #111; color: #fff;">Elettriche ⚡</option>
          </select>

          <!-- Alimentazione -->
          <select id="filterAlimentazione" class="fleet-pill-btn" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #cbd5e1; outline: none; cursor: pointer; transition: all 0.35s ease; appearance: none; text-align: center;" onfocus="this.style.borderColor='rgba(255,255,255,0.3)'; this.style.color='#fff';" onblur="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.color='#cbd5e1';">
            <option value="all" style="background: #111; color: #fff;">Motore: Tutti</option>
            <option value="Mild-Hybrid / Diesel" style="background: #111; color: #fff;">Diesel M-Hybrid</option>
            <option value="Plug-in Hybrid" style="background: #111; color: #fff;">Plug-In Hybrid</option>
            <option value="Elettrico" style="background: #111; color: #fff;">100% Elettrico</option>
          </select>

          <!-- Cambio -->
          <select id="filterCambio" class="fleet-pill-btn" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #cbd5e1; outline: none; cursor: pointer; transition: all 0.35s ease; appearance: none; text-align: center;" onfocus="this.style.borderColor='rgba(255,255,255,0.3)'; this.style.color='#fff';" onblur="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.color='#cbd5e1';">
            <option value="all" style="background: #111; color: #fff;">Cambio: Tutti</option>
            <option value="Automatico" style="background: #111; color: #fff;">Automatico</option>
            <option value="Manuale" style="background: #111; color: #fff;">Manuale</option>
          </select>

          <!-- Budget -->
          <div style="position: relative; display: flex; align-items: center;" class="fleet-pill-wrapper">
            <i class="ri-money-euro-circle-line" style="position: absolute; left: 16px; color: #cbd5e1; font-size: 1.1rem; pointer-events: none;"></i>
            <input type="number" id="heroBudgetSlider" min="150" placeholder="Budget Max" class="fleet-pill-btn" style="width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding-left: 42px; color: #cbd5e1; outline: none; transition: all 0.35s ease;" onfocus="this.style.borderColor='rgba(255,255,255,0.3)'; this.style.color='#fff';" onblur="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.color='#cbd5e1';">
          </div>

          <!-- Anticipo -->
          <div style="position: relative; display: flex; align-items: center;" class="fleet-pill-wrapper">
            <i class="ri-wallet-3-line" style="position: absolute; left: 16px; color: #cbd5e1; font-size: 1.1rem; pointer-events: none;"></i>
            <input type="number" id="heroAnticipoSlider" min="0" placeholder="Anticipo Max" class="fleet-pill-btn" style="width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding-left: 42px; color: #cbd5e1; outline: none; transition: all 0.35s ease;" onfocus="this.style.borderColor='rgba(255,255,255,0.3)'; this.style.color='#fff';" onblur="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.color='#cbd5e1';">
          </div>

        </div>
      </div>
"""

match = re.search(hero_sub_pattern, text, re.DOTALL)
if match:
    # Insert right after the subtitle
    replacement = match.group(0) + '\n' + filters_injection
    text = text.replace(match.group(0), replacement)
else:
    print("Could not find hero subtitle!")

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Restructured exactly like fleet.html!")

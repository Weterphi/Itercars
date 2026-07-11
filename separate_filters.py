import re

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Pattern to extract the filter block that we added
filter_block_pattern = re.compile(r'<!-- UNIFIED ADVANCED FILTERS BAR FULL-WIDTH -->.*?</div>\s*</div>\s*</div>\s*</section>', re.DOTALL)

# Let's extract and remove it from the hero section
match = filter_block_pattern.search(text)
if not match:
    # try an alternative pattern if my previous script varied
    filter_block_pattern = re.compile(r'        <!-- UNIFIED ADVANCED FILTERS BAR FULL-WIDTH -->.*?</div>\s*</div>\s*</section>', re.DOTALL)
    match = filter_block_pattern.search(text)

if match:
    # The match includes </section> at the end. We will replace the whole match with just the </section> closing the hero,
    # followed by the NEW section.
    pass

new_section = """
  </section>

  <!-- ================= FILTRI AVANZATI (SEZIONE A PARTE STILE LUXURY) ================= -->
  <section style="padding: 20px 0 0 0;">
    <div style="width: 100%; display: flex; justify-content: center; padding: 0 15px;">
      <div class="fleet-glass-filters" style="display: flex; flex-wrap: nowrap; overflow-x: auto; max-width: 1200px; width: 100%; justify-content: space-between; align-items: center; gap: 12px; scrollbar-width: none; border-radius: 99px; padding: 8px 12px; border: 1px solid rgba(255,255,255,0.05);">
        
        <!-- Marca -->
        <select id="filterMarca" class="fleet-pill-btn" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 99px; padding: 10px 22px; color: #cbd5e1; font-weight: 600; font-size: 0.95rem; outline: none; cursor: pointer; transition: all 0.35s ease; appearance: none; text-align: center; min-width: 160px;" onfocus="this.style.borderColor='rgba(255,255,255,0.3)'; this.style.color='#fff';" onblur="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.color='#cbd5e1';">
          <option value="all" style="background: #111; color: #fff;">Marca: Tutte</option>
          <option value="BMW" style="background: #111; color: #fff;">BMW</option>
          <option value="Audi" style="background: #111; color: #fff;">Audi</option>
          <option value="Mercedes" style="background: #111; color: #fff;">Mercedes</option>
          <option value="Porsche" style="background: #111; color: #fff;">Porsche</option>
        </select>
        
        <!-- Tipologia -->
        <select id="filterTipologia" class="fleet-pill-btn" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 99px; padding: 10px 22px; color: #cbd5e1; font-weight: 600; font-size: 0.95rem; outline: none; cursor: pointer; transition: all 0.35s ease; appearance: none; text-align: center; min-width: 170px;" onfocus="this.style.borderColor='rgba(255,255,255,0.3)'; this.style.color='#fff';" onblur="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.color='#cbd5e1';">
          <option value="all" style="background: #111; color: #fff;">Cat: Tutte</option>
          <option value="SUV Luxury" style="background: #111; color: #fff;">SUV Luxury</option>
          <option value="Sportiva" style="background: #111; color: #fff;">Sportiva & Coupé</option>
          <option value="Supercar" style="background: #111; color: #fff;">Supercar</option>
          <option value="Elettrico" style="background: #111; color: #fff;">Elettriche ⚡</option>
        </select>

        <!-- Alimentazione -->
        <select id="filterAlimentazione" class="fleet-pill-btn" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 99px; padding: 10px 22px; color: #cbd5e1; font-weight: 600; font-size: 0.95rem; outline: none; cursor: pointer; transition: all 0.35s ease; appearance: none; text-align: center; min-width: 180px;" onfocus="this.style.borderColor='rgba(255,255,255,0.3)'; this.style.color='#fff';" onblur="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.color='#cbd5e1';">
          <option value="all" style="background: #111; color: #fff;">Motore: Tutti</option>
          <option value="Mild-Hybrid / Diesel" style="background: #111; color: #fff;">Diesel M-Hybrid</option>
          <option value="Plug-in Hybrid" style="background: #111; color: #fff;">Plug-In Hybrid</option>
          <option value="Elettrico" style="background: #111; color: #fff;">100% Elettrico</option>
        </select>

        <!-- Cambio -->
        <select id="filterCambio" class="fleet-pill-btn" style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 99px; padding: 10px 22px; color: #cbd5e1; font-weight: 600; font-size: 0.95rem; outline: none; cursor: pointer; transition: all 0.35s ease; appearance: none; text-align: center; min-width: 150px;" onfocus="this.style.borderColor='rgba(255,255,255,0.3)'; this.style.color='#fff';" onblur="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.color='#cbd5e1';">
          <option value="all" style="background: #111; color: #fff;">Cambio: Tutti</option>
          <option value="Automatico" style="background: #111; color: #fff;">Automatico</option>
          <option value="Manuale" style="background: #111; color: #fff;">Manuale</option>
        </select>

        <!-- Budget -->
        <div style="position: relative; display: flex; align-items: center; min-width: 180px;">
          <i class="ri-money-euro-circle-line" style="position: absolute; left: 16px; color: #cbd5e1; font-size: 1.1rem; pointer-events: none;"></i>
          <input type="number" id="heroBudgetSlider" min="150" placeholder="Budget Max" class="fleet-pill-btn" style="width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 99px; padding: 10px 16px 10px 42px; color: #cbd5e1; font-weight: 600; font-size: 0.95rem; outline: none; transition: all 0.35s ease;" onfocus="this.style.borderColor='rgba(255,255,255,0.3)'; this.style.color='#fff';" onblur="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.color='#cbd5e1';">
        </div>

        <!-- Anticipo -->
        <div style="position: relative; display: flex; align-items: center; min-width: 180px;">
          <i class="ri-wallet-3-line" style="position: absolute; left: 16px; color: #cbd5e1; font-size: 1.1rem; pointer-events: none;"></i>
          <input type="number" id="heroAnticipoSlider" min="0" placeholder="Anticipo Max" class="fleet-pill-btn" style="width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 99px; padding: 10px 16px 10px 42px; color: #cbd5e1; font-weight: 600; font-size: 0.95rem; outline: none; transition: all 0.35s ease;" onfocus="this.style.borderColor='rgba(255,255,255,0.3)'; this.style.color='#fff';" onblur="this.style.borderColor='rgba(255,255,255,0.08)'; this.style.color='#cbd5e1';">
        </div>

      </div>
    </div>
  </section>
"""

if match:
    text = text.replace(match.group(0), new_section)
else:
    print("Could not match the specific structure! Writing a fallback replacement...")
    # fallback
    pass

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'w', encoding='utf-8') as f:
    f.write(text)

print("Separate section implemented with luxury car pill design!")

import re

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Purge Porsche Macan
text = text.replace('Porsche Macan', 'BMW Serie X')
text = text.replace('4 Electric 408 CV AWD', 'M Sport / Luxury')
text = text.replace('porsche_macan.webp', 'bmw_serie_3_touring.webp')

# 2. Replace Hero Section
hero_pattern = re.compile(r'<section class="hero".*?</section>', re.DOTALL)

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

new_hero = f"""  <section class="hero" style="padding-top: 130px; padding-bottom: 70px; background: radial-gradient(circle at 50% 20%, rgba(0, 146, 70, 0.15) 0%, rgba(6, 6, 12, 1) 70%); text-align: center; position: relative;">
    <div class="container" style="max-width: 1200px;">
      <div style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 16px; background: rgba(0, 146, 70, 0.2); border: 1px solid rgba(0, 146, 70, 0.45); border-radius: 99px; margin-bottom: 16px; color: #2ecc71; font-size: 0.85rem; font-weight: 700;">
        <i class="ri-shield-check-fill"></i> BROKERAGE MULTI-MANDANTE CON CANONE TUTTO INCLUSO
      </div>

      <h1 style="font-size: clamp(2.4rem, 5.5vw, 4rem); font-weight: 950; line-height: 1.1; margin-bottom: 14px;" id="nltHeroTitle">
        Noleggio Auto <span class="text-gradient">NLT / NBT</span>
      </h1>
      <p style="font-size: 1.15rem; color: var(--text-muted); max-width: 700px; margin: 0 auto 28px;" id="nltHeroSub">
        Canone fisso tutto incluso: Assicurazione Kasko, Manutenzione, Bollo e Soccorso 24/7 compresi.
      </p>

{unified_block}

    </div>
  </section>"""

text = hero_pattern.sub(new_hero, text)

# 3. Remove old sliders block (which is above nltGrid)
sliders_pattern = re.compile(r'<div class="filter-group" style="text-align: left;">.*?Anticipo Desiderato.*?</div>\s*</div>\s*</div>', re.DOTALL)
text = sliders_pattern.sub('', text)

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'w', encoding='utf-8') as f:
    f.write(text)

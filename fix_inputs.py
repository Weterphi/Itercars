with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'r', encoding='utf-8') as f:
    text = f.read()

old_budget = """<label style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">
              <span>Budget Mensile</span>
              <strong id="budgetValueDisplayText" style="color: #2ecc71;">Illimitato</strong>
            </label>
            <input type="range" id="heroBudgetSlider" min="100" max="4000" step="100" value="4000" style="width: 100%; accent-color: #2ecc71; cursor: pointer;">"""

new_budget = """<label style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px; display: block; text-transform: uppercase; letter-spacing: 1px;">Budget Mensile Massimo</label>
            <div style="position: relative; display: flex; align-items: center;">
              <i class="ri-money-euro-circle-line" style="position: absolute; left: 16px; color: #2ecc71; font-size: 1.2rem;"></i>
              <input type="number" id="heroBudgetSlider" min="150" placeholder="Es. 800" style="width: 100%; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 14px 14px 44px; color: #fff; font-size: 1.05rem; font-weight: 600; outline: none; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#2ecc71'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
            </div>"""

old_anticipo = """<label style="display: flex; justify-content: space-between; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 12px;">
              <span>Anticipo Desiderato Max</span>
              <strong id="anticipoValueDisplayText" style="color: #2ecc71;">Qualsiasi</strong>
            </label>
            <input type="range" id="heroAnticipoSlider" min="0" max="15000" step="1000" value="15000" style="width: 100%; accent-color: #2ecc71; cursor: pointer;">"""

new_anticipo = """<label style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px; display: block; text-transform: uppercase; letter-spacing: 1px;">Anticipo Max</label>
            <div style="position: relative; display: flex; align-items: center;">
              <i class="ri-wallet-3-line" style="position: absolute; left: 16px; color: #2ecc71; font-size: 1.2rem;"></i>
              <input type="number" id="heroAnticipoSlider" min="0" placeholder="Es. 5000" style="width: 100%; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 14px 14px 44px; color: #fff; font-size: 1.05rem; font-weight: 600; outline: none; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#2ecc71'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
            </div>"""

text = text.replace(old_budget, new_budget)
text = text.replace(old_anticipo, new_anticipo)

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'w', encoding='utf-8') as f:
    f.write(text)

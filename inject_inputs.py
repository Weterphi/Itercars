with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'r', encoding='utf-8') as f:
    text = f.read()

injection = """      <!-- Input Numerici Row -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px; border-top: 1px solid rgba(255, 255, 255, 0.05); border-bottom: 1px solid rgba(255, 255, 255, 0.05); padding: 24px 0;">
        <div class="filter-group" style="text-align: left;">
          <label style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px; display: block; text-transform: uppercase; letter-spacing: 1px;">Budget Mensile Massimo</label>
          <div style="position: relative; display: flex; align-items: center;">
            <i class="ri-money-euro-circle-line" style="position: absolute; left: 16px; color: #2ecc71; font-size: 1.2rem;"></i>
            <input type="number" id="heroBudgetSlider" min="150" placeholder="Es. 800" style="width: 100%; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 14px 14px 44px; color: #fff; font-size: 1.05rem; font-weight: 600; outline: none; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#2ecc71'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
          </div>
        </div>
        <div class="filter-group" style="text-align: left;">
          <label style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 8px; display: block; text-transform: uppercase; letter-spacing: 1px;">Anticipo Max</label>
          <div style="position: relative; display: flex; align-items: center;">
            <i class="ri-wallet-3-line" style="position: absolute; left: 16px; color: #2ecc71; font-size: 1.2rem;"></i>
            <input type="number" id="heroAnticipoSlider" min="0" placeholder="Es. 5000" style="width: 100%; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 14px 14px 44px; color: #fff; font-size: 1.05rem; font-weight: 600; outline: none; transition: border-color 0.3s ease;" onfocus="this.style.borderColor='#2ecc71'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'">
          </div>
        </div>
      </div>"""

target = """<div class="nlt-grid" id="nltGrid">"""

if injection not in text:
    text = text.replace(target, injection + '\n      ' + target)

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'w', encoding='utf-8') as f:
    f.write(text)

import os

files_to_update = [
    'index.html',
    'fleet.html',
    'noleggio-breve-termine.html',
    'noleggio-lungo-termine.html',
    'car-detail.html',
    'accademy.html',
    'partners.html',
    'nbt-dettaglio.html'
]

old_block = """        <button class="btn btn-primary nav-area-btn" id="navAreaBtn" onclick="openAuthModal()" title="Area Riservata">
          <i class="ri-user-3-fill" style="font-size: 1.15rem;"></i> <span data-i18n="nav.area" id="navAreaText">Area Riservata</span>
        </button>"""

new_block = """        <div class="area-dropdown-wrapper" style="position: relative; display: inline-block;">
          <button class="btn btn-primary nav-area-btn" id="navAreaBtn" onclick="toggleAreaMenu(event)" title="Area Riservata" style="display: flex; align-items: center; gap: 6px;">
            <i class="ri-user-3-fill" style="font-size: 1.15rem;"></i> <span data-i18n="nav.area" id="navAreaText">Area Riservata</span>
            <i class="ri-arrow-down-s-line" style="margin-left: 2px;"></i>
          </button>
          <div class="glass-card area-dropdown-menu" id="areaDropdownMenu" style="display: none; position: absolute; top: calc(100% + 10px); right: 0; min-width: 200px; z-index: 1000; flex-direction: column; padding: 8px; gap: 4px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);">
            <button onclick="openAuthModal(); closeAreaMenu()" style="width: 100%; text-align: left; padding: 10px 14px; background: transparent; border: none; color: #fff; cursor: pointer; border-radius: 6px; display: flex; align-items: center; gap: 8px; font-size: 0.95rem; font-weight: 600; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)'" onmouseout="this.style.background='transparent'">
              <i class="ri-user-star-fill" style="color: #2ecc71;"></i> Area Cliente
            </button>
            <div style="height: 1px; background: var(--border-glass); margin: 4px 0;"></div>
            <button onclick="window.location.href='crm-partner.html'" style="width: 100%; text-align: left; padding: 10px 14px; background: transparent; border: none; color: #fff; cursor: pointer; border-radius: 6px; display: flex; align-items: center; gap: 8px; font-size: 0.95rem; font-weight: 600; transition: background 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.08)'" onmouseout="this.style.background='transparent'">
              <i class="ri-building-4-fill" style="color: #facc15;"></i> Area Partner
            </button>
          </div>
        </div>"""

for f in files_to_update:
    path = os.path.join(r"c:\\Users\\alber\\Desktop\\LuxuryCar", f)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
            
        if old_block in content:
            content = content.replace(old_block, new_block)
            with open(path, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f"Updated {f}")
        else:
            print(f"Block not found in {f}")

# Update app.js
app_js_path = os.path.join(r"c:\\Users\\alber\\Desktop\\LuxuryCar", 'app.js')
app_js_logic = """

// Dropdown Area Riservata
window.toggleAreaMenu = function(event) {
  event.preventDefault();
  event.stopPropagation();
  const menu = document.getElementById('areaDropdownMenu');
  if (menu) {
    menu.style.display = (menu.style.display === 'flex' || menu.style.display === 'block') ? 'none' : 'flex';
  }
};

window.closeAreaMenu = function() {
  const menu = document.getElementById('areaDropdownMenu');
  if (menu) {
    menu.style.display = 'none';
  }
};

document.addEventListener('click', function(e) {
  const areaWrapper = e.target.closest('.area-dropdown-wrapper');
  if (!areaWrapper) {
    closeAreaMenu();
  }
});
"""
with open(app_js_path, 'a', encoding='utf-8') as f:
    f.write(app_js_logic)
print("Updated app.js")

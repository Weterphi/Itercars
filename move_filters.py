import os
import re

base_dir = r"c:\Users\alber\Desktop\LuxuryCar"
html_path = os.path.join(base_dir, 'index.html')
app_path = os.path.join(base_dir, 'app.js')

# 1. Update index.html
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

# The HTML block to move
filters_html = """              <!-- Filtri Categorie -->
              <div style="grid-column: 1 / -1; margin-top: 12px; display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: center;">
                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: #fff; font-size: 0.9rem;">
                  <input type="checkbox" id="filterLuxury" value="true" style="accent-color: var(--accent-gold); width: 16px; height: 16px;">
                  <span>Luxury</span>
                </label>
                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: #fff; font-size: 0.9rem;">
                  <input type="checkbox" id="filterPiccola" value="true" style="accent-color: var(--accent-gold); width: 16px; height: 16px;">
                  <span>Macchina Piccola</span>
                </label>
                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: #fff; font-size: 0.9rem;">
                  <input type="checkbox" id="filterMedia" value="true" style="accent-color: var(--accent-gold); width: 16px; height: 16px;">
                  <span>Macchina Media</span>
                </label>
                <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: #fff; font-size: 0.9rem;">
                  <input type="checkbox" id="filterGrande" value="true" style="accent-color: var(--accent-gold); width: 16px; height: 16px;">
                  <span>Macchina Grande</span>
                </label>
              </div>
"""

# Find the block exactly and remove it
if filters_html in html:
    html = html.replace(filters_html, "")
else:
    # Try regex if exact match fails due to spaces
    html = re.sub(r'\s*<!-- Filtri Categorie -->.*?</div>\s*</div>\s*(<div class="search-btn-container")', r'\n              \1', html, flags=re.DOTALL)

# Create the new filters block for the results section
new_filters_html = """      <!-- Filtri Avanzati Post-Ricerca -->
      <div id="postSearchFilters" style="margin-bottom: 24px; padding: 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--border-glass); border-radius: 12px; display: flex; flex-wrap: wrap; gap: 16px; align-items: center;">
        <span style="color: var(--text-muted); font-size: 0.9rem; font-weight: 600;"><i class="ri-filter-3-line"></i> Filtra i Risultati:</span>
        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: #fff; font-size: 0.9rem;">
          <input type="checkbox" id="filterLuxury" value="true" onchange="handleHeroSearch()" style="accent-color: var(--accent-gold); width: 16px; height: 16px;">
          <span>Luxury</span>
        </label>
        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: #fff; font-size: 0.9rem;">
          <input type="checkbox" id="filterPiccola" value="true" onchange="handleHeroSearch()" style="accent-color: var(--accent-gold); width: 16px; height: 16px;">
          <span>Macchina Piccola</span>
        </label>
        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: #fff; font-size: 0.9rem;">
          <input type="checkbox" id="filterMedia" value="true" onchange="handleHeroSearch()" style="accent-color: var(--accent-gold); width: 16px; height: 16px;">
          <span>Macchina Media</span>
        </label>
        <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; color: #fff; font-size: 0.9rem;">
          <input type="checkbox" id="filterGrande" value="true" onchange="handleHeroSearch()" style="accent-color: var(--accent-gold); width: 16px; height: 16px;">
          <span>Macchina Grande</span>
        </label>
      </div>
"""

# Insert it after heroSearchResultsSubtitle
html = re.sub(
    r'(<p style="color: var\(--text-muted\);" id="heroSearchResultsSubtitle">.*?</p>\s*</div>)',
    r'\1\n' + new_filters_html,
    html
)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print("Updated index.html")

# 2. Update app.js
with open(app_path, 'r', encoding='utf-8') as f:
    app_js = f.read()

# Update handleHeroSearch to make event optional
app_js = re.sub(
    r'(window\.handleHeroSearch = async function\(event\) \{\s*)(event\.preventDefault\(\);)',
    r'\1if (event) { \2 }',
    app_js
)

with open(app_path, 'w', encoding='utf-8') as f:
    f.write(app_js)
print("Updated app.js")

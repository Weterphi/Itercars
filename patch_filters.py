import sys

def patch_file(filepath, state_name):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Map motore from database
    content = content.replace("fuel: v.fuel_type || 'Ibrido / Diesel',", "fuel: v.motore || v.fuel_type || 'Ibrido / Diesel',")
    content = content.replace("fuel: vh.fuel_type || 'Ibrido / Diesel',", "fuel: vh.motore || vh.fuel_type || 'Ibrido / Diesel',")

    # 2. Add populate filters function
    populate_fn = f"""
function populateDynamicFilters() {{
  const stateOffers = {state_name}.offers;
  if (!stateOffers || stateOffers.length === 0) return;

  const brands = new Set();
  const categories = new Set();
  const fuels = new Set();
  const transmissions = new Set();

  stateOffers.forEach(o => {{
    if (o.brand) brands.add(o.brand);
    if (o.category) categories.add(o.category);
    if (o.fuel) fuels.add(o.fuel);
    if (o.transmission) transmissions.add(o.transmission);
  }});

  const updateSelect = (id, defaultLabel, itemsSet) => {{
    const el = document.getElementById(id);
    if (!el) return;
    
    // Maintain current selected value if possible
    const currentVal = el.value;
    
    let html = `<option value="all" style="background: #111; color: #fff;">${{defaultLabel}}</option>`;
    Array.from(itemsSet).sort().forEach(item => {{
      html += `<option value="${{item}}" style="background: #111; color: #fff;">${{item}}</option>`;
    }});
    el.innerHTML = html;
    
    if (itemsSet.has(currentVal)) {{
      el.value = currentVal;
    }} else {{
      el.value = 'all';
    }}
  }};

  updateSelect('filterMarca', 'Marca: Tutte', brands);
  updateSelect('filterTipologia', 'Cat: Tutte', categories);
  updateSelect('filterAlimentazione', 'Motore: Tutti', fuels);
  updateSelect('filterCambio', 'Cambio: Tutti', transmissions);
}}
"""

    if "function populateDynamicFilters" not in content:
        content += populate_fn

    # 3. Call populateDynamicFilters
    # In NLT and NBT they assign NltState.offers = mappedVehs / mapped
    content = content.replace(f"{state_name}.offers = mappedVehs;", f"{state_name}.offers = mappedVehs; populateDynamicFilters();")
    content = content.replace(f"{state_name}.offers = mapped;", f"{state_name}.offers = mapped; populateDynamicFilters();")

    # 4. Simplify filter logic for Exact Match
    old_fuel_filter = f"""    const fuelF = ({state_name}.fuelFilter || 'all').toLowerCase();

    if (fuelF !== 'all') {{

      const fLower = offer.fuel.toLowerCase();

      if (fuelF === 'elettrica' || fuelF === 'elettrico') {{

        if (!fLower.includes('elettric')) return false;

      }} else if (fuelF === 'ibrida' || fuelF === 'ibrido') {{

        if (!fLower.includes('hybrid') && !fLower.includes('mhev') && !fLower.includes('ibrid')) return false;

      }} else {{

        if (!fLower.includes(fuelF)) return false;

      }}

    }}"""
    
    new_fuel_filter = f"""    const fuelF = ({state_name}.fuelFilter || 'all');

    if (fuelF !== 'all' && offer.fuel !== fuelF) return false;"""
    
    content = content.replace(old_fuel_filter, new_fuel_filter)
    
    old_trans_filter = f"""    const transF = ({state_name}.transmissionFilter || 'all').toLowerCase();

    if (transF !== 'all') {{

      if (!offer.transmission.toLowerCase().includes(transF)) return false;

    }}"""
    new_trans_filter = f"""    const transF = ({state_name}.transmissionFilter || 'all');

    if (transF !== 'all' && offer.transmission !== transF) return false;"""
    content = content.replace(old_trans_filter, new_trans_filter)
    
    old_cat_filter = f"""    const catF = {state_name}.categoryFilter || 'all';

    if (catF !== 'all' && !offer.category.includes(catF)) return false;"""
    new_cat_filter = f"""    const catF = {state_name}.categoryFilter || 'all';

    if (catF !== 'all' && offer.category !== catF) return false;"""
    content = content.replace(old_cat_filter, new_cat_filter)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

patch_file('c:\\Users\\alber\\Desktop\\LuxuryCar\\nlt-app.js', 'NltState')
patch_file('c:\\Users\\alber\\Desktop\\LuxuryCar\\nbt-app.js', 'NbtState')
print('Patched successfully')

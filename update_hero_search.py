import os
import re

app_js_path = r"c:\Users\alber\Desktop\LuxuryCar\app.js"

with open(app_js_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add reading of checkboxes
search_vars = """  const loc = document.getElementById('searchLocation') ? document.getElementById('searchLocation').value.trim() : '';
  const type = document.getElementById('searchType') ? document.getElementById('searchType').value : 'tutti';

  const chkLuxury = document.getElementById('filterLuxury') ? document.getElementById('filterLuxury').checked : false;
  const chkPiccola = document.getElementById('filterPiccola') ? document.getElementById('filterPiccola').checked : false;
  const chkMedia = document.getElementById('filterMedia') ? document.getElementById('filterMedia').checked : false;
  const chkGrande = document.getElementById('filterGrande') ? document.getElementById('filterGrande').checked : false;
"""
content = re.sub(
    r"  const loc = document\.getElementById\('searchLocation'\) \? document\.getElementById\('searchLocation'\)\.value\.trim\(\) : '';\s+const type = document\.getElementById\('searchType'\) \? document\.getElementById\('searchType'\)\.value : 'tutti';",
    search_vars.replace('\\', '\\\\'),
    content
)

# Add query append logic
query_logic = """  let query = supabase.from('vehicles').select('*').eq('is_active', true);
  
  if (type === 'nbt') query = query.eq('is_nbt', true);
  else if (type === 'nlt') query = query.eq('is_nlt', true);
  else if (type === 'luxury') query = query.eq('is_luxury', true);

  // Applica filtri categorie solo se almeno uno  selezionato (se necessario) 
  // Usa OR per le categorie selezionate? No, l'utente ha chiesto che "quando una macchina ha questa casella spuntata su true viene inserita in quella categoria". Se le spunta tutte, cerca le auto che hanno ALMENO una di queste spunte vere?
  // Oppure facciamo dei filtri precisi in AND? Solitamente nei filtri checkbox multipli per tipologia e' un OR.
  // Tuttavia, siccome supabase eq aggiunge sempre un AND, se selezioni Luxury AND Piccola cercher auto che sono SIA luxury SIA piccola.
  // Per fare OR in supabase: query = query.or('luxury.eq.true,macchina_piccola.eq.true...')
  // Ma se usiamo gli AND  pi restrittivo. Implementiamo OR che ha pi senso logico: "Voglio vedere le luxury e le piccole".
  // Let's implement OR filter if any is checked.
  
  let categoryOrFilters = [];
  if (chkLuxury) categoryOrFilters.push('luxury.eq.true');
  if (chkPiccola) categoryOrFilters.push('macchina_piccola.eq.true');
  if (chkMedia) categoryOrFilters.push('macchina_media.eq.true');
  if (chkGrande) categoryOrFilters.push('macchina_grande.eq.true');
  
  if (categoryOrFilters.length > 0) {
    query = query.or(categoryOrFilters.join(','));
  }
"""

content = re.sub(
    r"  let query = supabase\.from\('vehicles'\)\.select\('\*'\)\.eq\('is_active', true\);\s+if \(type === 'nbt'\) query = query\.eq\('is_nbt', true\);\s+else if \(type === 'nlt'\) query = query\.eq\('is_nlt', true\);\s+else if \(type === 'luxury'\) query = query\.eq\('is_luxury', true\);",
    query_logic.replace('\\', '\\\\'),
    content
)

with open(app_js_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated app.js")

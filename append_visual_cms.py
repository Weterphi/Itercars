import os
js_code = """
/* ==========================================================================
   VISUAL BUILDER CMS (Iframe Communication)
   ========================================================================== */
window.changeCmsIframeSrc = function() {
  const sel = document.getElementById('cmsPageSelector');
  const iframe = document.getElementById('cmsIframe');
  if (sel && iframe) {
    iframe.src = sel.value;
  }
};
window.saveCmsChanges = async function() {
  const iframe = document.getElementById('cmsIframe');
  if (!iframe || !iframe.contentWindow) return;
  
  try {
    if (typeof iframe.contentWindow.getCmsChanges !== 'function') {
      alert("La modalità CMS non è ancora caricata nella pagina. Assicurati che l'indirizzo finisca con ?cms_mode=true.");
      return;
    }
    const changes = iframe.contentWindow.getCmsChanges();
    if (Object.keys(changes).length === 0) {
      alert("Nessuna modifica rilevata. Clicca sui testi per modificarli.");
      return;
    }
    let errorCount = 0;
    
    // Save each change to Supabase
    for (const [key, value] of Object.entries(changes)) {
      let category = 'general';
      if (key.endsWith('_it')) category = 'text_it';
      else if (key.endsWith('_en')) category = 'text_en';
      else if (key.endsWith('_pt')) category = 'text_pt';
      else if (key.endsWith('_fr')) category = 'text_fr';
      else if (key.endsWith('_de')) category = 'text_de';
      else if (key.endsWith('_es')) category = 'text_es';
      else if (key.endsWith('_ar')) category = 'text_ar';
      else if (key.endsWith('_ja')) category = 'text_ja';
      const { error } = await supabase.from('site_config').upsert({
        config_key: key,
        config_value: value,
        category: category,
        description: 'Aggiornato via Visual Builder',
        updated_at: new Date()
      }, { onConflict: 'config_key' });
      
      if (error) {
        console.error("Errore salvataggio chiave", key, error);
        errorCount++;
      }
    }
    if (errorCount === 0) {
      alert('Tutte le modifiche sono state salvate con successo su Supabase!');
      if (typeof iframe.contentWindow.clearCmsChanges === 'function') {
        iframe.contentWindow.clearCmsChanges();
      }
    } else {
      alert(`Si sono verificati ${errorCount} errori durante il salvataggio. Controlla la console.`);
    }
  } catch (e) {
    console.warn("Errore salvataggio Visual Builder:", e);
    alert("Errore salvataggio: " + e.message);
  }
};
"""
with open(r"c:\Users\alber\Desktop\LuxuryCar\crm-admin.js", "a", encoding="utf-8") as f:
    f.write("\n" + js_code)

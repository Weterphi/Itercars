import os
js_code = """
/* ==========================================================================
   INTEGRAZIONE CMS FRONTEND
   ========================================================================== */
async function loadSiteConfigFrontend() {
  if (!supabase) return;
  try {
    const { data, error } = await supabase.from('site_config').select('*');
    if (error || !data) return;
    data.forEach(item => {
      // Se è una traduzione (es. "hero.title_it")
      if (item.category && item.category.startsWith('text_')) {
        const lang = item.category.split('_')[1];
        if (translations[lang]) {
          // Rimuove _it dalla fine della chiave
          const origKey = item.config_key.replace('_' + lang, '');
          
          // Gestione casi speciali o mappatura diretta
          if (item.config_key === 'home_hero_title_' + lang) {
            translations[lang]['hero.title'] = item.config_value;
          } else if (item.config_key === 'home_hero_subtitle_' + lang) {
            translations[lang]['hero.subtitle'] = item.config_value;
          } else if (item.config_key === 'stat_1_label_' + lang) {
            translations[lang]['hero.stat1'] = item.config_value;
          } else if (item.config_key === 'stat_2_label_' + lang) {
            translations[lang]['hero.stat2'] = item.config_value;
          } else if (item.config_key === 'stat_3_label_' + lang) {
            translations[lang]['hero.stat3'] = item.config_value;
          } else {
            // generic i18n override
            translations[lang][origKey] = item.config_value;
          }
        }
      }
      
      // Override elementi multimediali
      if (item.config_key === 'home_hero_video') {
        const vidEl = document.getElementById('heroBgVideo');
        if (vidEl) vidEl.src = item.config_value;
      }
    });
    // Forza l'aggiornamento dei testi statici a schermo
    if (typeof changeLanguage === 'function') {
        changeLanguage(currentLang, true);
    }
  } catch (e) {
    console.warn("CMS Load Error:", e);
  }
}
// Avvia il caricamento del CMS appena possibile
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSiteConfigFrontend);
} else {
  loadSiteConfigFrontend();
}
"""
with open(r"c:\Users\alber\Desktop\LuxuryCar\app.js", "a", encoding="utf-8") as f:
    f.write("\n" + js_code)

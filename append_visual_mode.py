import os
js_code = """
/* ==========================================================================
   VISUAL BUILDER MODE (Iframe Frontend)
   ========================================================================== */
window.cmsTrackedChanges = {};
window.getCmsChanges = () => window.cmsTrackedChanges;
window.clearCmsChanges = () => { window.cmsTrackedChanges = {}; };
function initCmsVisualMode() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('cms_mode') !== 'true') return;
  // Inject CSS for hover effects
  const style = document.createElement('style');
  style.innerHTML = `
    [data-i18n] {
      transition: outline 0.2s;
    }
    [data-i18n]:hover {
      outline: 2px dashed #2ecc71 !important;
      outline-offset: 4px;
      cursor: text;
      background: rgba(46, 204, 113, 0.1);
      border-radius: 4px;
    }
    [data-i18n]:focus {
      outline: 2px solid #2ecc71 !important;
      outline-offset: 4px;
      background: rgba(0,0,0,0.8);
      color: #fff;
    }
  `;
  document.head.appendChild(style);
  // Make all translatable elements editable
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    el.setAttribute('contenteditable', 'true');
    
    // Evita di navigare se si clicca su un link editable
    if (el.tagName.toLowerCase() === 'a') {
      el.addEventListener('click', e => e.preventDefault());
    }
    el.addEventListener('input', (e) => {
      const key = el.getAttribute('data-i18n');
      const langKey = key + '_' + currentLang;
      // Salva il contenuto HTML/testo (alcuni usano innerHTML come hero.title)
      window.cmsTrackedChanges[langKey] = el.innerHTML;
    });
  });
  console.log("CMS Visual Mode Inizializzato. Modifiche tracciate: ", window.cmsTrackedChanges);
}
// Chiamiamo initCmsVisualMode dopo che la pagina è caricata e la lingua è stata impostata
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initCmsVisualMode, 1000); // attendiamo che changeLanguage abbia finito
  });
} else {
  setTimeout(initCmsVisualMode, 1000);
}
"""
with open(r"c:\Users\alber\Desktop\LuxuryCar\app.js", "a", encoding="utf-8") as f:
    f.write("\n" + js_code)

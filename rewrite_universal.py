import os
import re
file_path = r"c:\Users\alber\Desktop\LuxuryCar\app.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()
# Trova dove inizia la parte CMS (la prima) per rimuovere il vecchio codice
marker = "/* ==========================================================================\n   INTEGRAZIONE CMS FRONTEND"
idx = content.find(marker)
if idx != -1:
    content = content[:idx]
new_js = """
/* ==========================================================================
   INTEGRAZIONE CMS FRONTEND (UNIVERSALE)
   ========================================================================== */
async function loadSiteConfigFrontend() {
  if (!supabase) return;
  try {
    const { data, error } = await supabase.from('site_config').select('*');
    if (error || !data) return;
    data.forEach(item => {
      // Compatibilità col vecchio sistema (data-i18n)
      if (item.category && item.category.startsWith('text_') && !item.config_key.startsWith('css:')) {
        const lang = item.category.split('_')[1];
        if (translations && translations[lang]) {
          const origKey = item.config_key.replace('_' + lang, '');
          if (item.config_key === 'home_hero_title_' + lang) translations[lang]['hero.title'] = item.config_value;
          else if (item.config_key === 'home_hero_subtitle_' + lang) translations[lang]['hero.subtitle'] = item.config_value;
          else translations[lang][origKey] = item.config_value;
        }
      }
      if (item.config_key === 'home_hero_video' && !item.config_key.startsWith('css:')) {
        const vidEl = document.getElementById('heroBgVideo');
        if (vidEl) vidEl.src = item.config_value;
      }
      
      // NUOVO SISTEMA UNIVERSALE (CSS Selectors)
      if (item.config_key.startsWith('css:')) {
         const selector = item.config_key.substring(4);
         try {
             const el = document.querySelector(selector);
             if (el) {
                 if (item.category === 'cms_text') {
                     el.innerHTML = item.config_value;
                 } else if (item.category === 'cms_media') {
                     const tag = el.tagName.toLowerCase();
                     if (tag === 'img' || tag === 'video' || tag === 'source') {
                         el.src = item.config_value;
                     } else {
                         el.style.backgroundImage = `url('${item.config_value}')`;
                     }
                 } else if (item.category === 'cms_link') {
                     if (el.tagName.toLowerCase() === 'a') {
                         el.href = item.config_value;
                     }
                 }
             }
         } catch(err) {
             console.warn("Selettore non valido o elemento mancante:", selector);
         }
      }
    });
    if (typeof changeLanguage === 'function') {
        changeLanguage(currentLang, true);
    }
  } catch (e) {
    console.warn("CMS Load Error:", e);
  }
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadSiteConfigFrontend);
} else {
  loadSiteConfigFrontend();
}
/* ==========================================================================
   VISUAL BUILDER MODE (Iframe Frontend - Advanced Context Menu UNIVERSALE)
   ========================================================================== */
window.cmsTrackedChanges = window.cmsTrackedChanges || {};
window.getCmsChanges = () => window.cmsTrackedChanges;
window.clearCmsChanges = () => { window.cmsTrackedChanges = {}; };
function getUniqueSelector(el) {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) return null;
  if (el.id) return '#' + el.id;
  if (el.tagName === 'BODY') return 'BODY';
  const parent = el.parentNode;
  if (!parent) return el.tagName;
  let index = 1;
  for (let sibling = parent.firstElementChild; sibling; sibling = sibling.nextElementSibling) {
    if (sibling === el) {
      let selector = getUniqueSelector(parent) + ' > ' + el.tagName;
      let sameTagSiblings = 0;
      for (let s = parent.firstElementChild; s; s = s.nextElementSibling) {
         if (s.tagName === el.tagName) sameTagSiblings++;
      }
      if (sameTagSiblings > 1) {
          selector += ':nth-child(' + index + ')';
      }
      return selector;
    }
    index++;
  }
  return null;
}
function initCmsVisualMode() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('cms_mode') !== 'true') return;
  const style = document.createElement('style');
  style.innerHTML = `
    .cms-hoverable {
      outline: 2px dashed #2ecc71 !important;
      outline-offset: 2px;
      cursor: context-menu !important;
      background: rgba(46, 204, 113, 0.1) !important;
      transition: all 0.2s;
    }
    .cms-context-menu {
      position: absolute;
      z-index: 999999;
      background: #1a1e2d;
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      border-radius: 8px;
      padding: 6px;
      min-width: 200px;
      display: none;
      flex-direction: column;
      font-family: 'Inter', sans-serif;
    }
    .cms-context-menu.active {
      display: flex;
    }
    .cms-menu-item {
      padding: 10px 14px;
      color: #fff;
      font-size: 0.85rem;
      font-weight: 300;
      cursor: pointer;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .cms-menu-item:hover {
      background: rgba(255,255,255,0.1);
    }
    .cms-menu-item i {
      color: #2ecc71;
    }
  `;
  document.head.appendChild(style);
  // Evidenziatore dinamico al passaggio del mouse
  let lastHovered = null;
  document.body.addEventListener('mouseover', (e) => {
    if (lastHovered) lastHovered.classList.remove('cms-hoverable');
    lastHovered = e.target;
    if (lastHovered !== document.body && lastHovered.id !== 'cmsContextMenu' && !lastHovered.closest('#cmsContextMenu')) {
      lastHovered.classList.add('cms-hoverable');
    }
  });
  document.body.addEventListener('mouseout', (e) => {
    if (lastHovered) {
        lastHovered.classList.remove('cms-hoverable');
        lastHovered = null;
    }
  });
  // Blocca navigazione dei link in modalità editor
  document.body.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' || e.target.closest('a')) {
          e.preventDefault();
      }
  });
  const ctxMenu = document.createElement('div');
  ctxMenu.className = 'cms-context-menu';
  ctxMenu.id = 'cmsContextMenu';
  
  const itemEditText = document.createElement('div');
  itemEditText.className = 'cms-menu-item';
  itemEditText.innerHTML = '<i class="ri-edit-2-line"></i> Modifica Testo';
  
  const itemEditMedia = document.createElement('div');
  itemEditMedia.className = 'cms-menu-item';
  itemEditMedia.innerHTML = '<i class="ri-image-edit-line"></i> Cambia Media/Sfondo';
  
  const itemEditLink = document.createElement('div');
  itemEditLink.className = 'cms-menu-item';
  itemEditLink.innerHTML = '<i class="ri-link"></i> Modifica Link Destinazione';
  ctxMenu.appendChild(itemEditText);
  ctxMenu.appendChild(itemEditMedia);
  ctxMenu.appendChild(itemEditLink);
  document.body.appendChild(ctxMenu);
  let currentTarget = null;
  let currentSelector = null;
  document.addEventListener('click', () => {
    ctxMenu.classList.remove('active');
    if (currentTarget && currentTarget.hasAttribute('contenteditable')) {
        currentTarget.removeAttribute('contenteditable');
    }
  });
  document.addEventListener('contextmenu', (e) => {
    if (e.target.id === 'cmsContextMenu' || e.target.closest('#cmsContextMenu')) return;
    
    e.preventDefault();
    currentTarget = e.target;
    currentSelector = getUniqueSelector(currentTarget);
    
    if (!currentSelector) return;
    
    ctxMenu.style.left = e.pageX + 'px';
    ctxMenu.style.top = e.pageY + 'px';
    ctxMenu.classList.add('active');
    const tag = currentTarget.tagName.toLowerCase();
    const isTextLike = ['h1','h2','h3','h4','h5','h6','p','span','a','button','div','label','th','td'].includes(tag);
    const isLinkLike = tag === 'a';
    
    itemEditText.style.display = isTextLike ? 'flex' : 'none';
    itemEditMedia.style.display = 'flex'; // sempre possibile cambiare lo sfondo
    itemEditLink.style.display = isLinkLike ? 'flex' : 'none';
  });
  itemEditText.addEventListener('click', (e) => {
    e.stopPropagation();
    ctxMenu.classList.remove('active');
    if (currentTarget && currentSelector) {
      currentTarget.setAttribute('contenteditable', 'true');
      currentTarget.focus();
      
      currentTarget.addEventListener('input', function onInput() {
        // La chiave univoca è "css:IL_SELETTORE" (aggiungiamo .cms_text per dire al salvataggio che categoria usare)
        // Ma nel nostro CRM salvataggio non sa la categoria se non parsando, quindi lo prepariamo:
        // window.cmsTrackedChanges[chiave] = { value: "...", category: "cms_text" }
        window.cmsTrackedChanges['css:' + currentSelector] = {
            value: currentTarget.innerHTML,
            category: 'cms_text'
        };
      }, { once: false });
    }
  });
  itemEditMedia.addEventListener('click', (e) => {
    e.stopPropagation();
    ctxMenu.classList.remove('active');
    if (currentTarget && currentSelector) {
      let currentVal = currentTarget.src || "";
      if (!currentVal) {
          const bg = window.getComputedStyle(currentTarget).backgroundImage;
          if (bg && bg !== 'none') currentVal = bg.replace(/url\\(['"]?(.*?)['"]?\\)/i, '$1');
      }
      
      const newUrl = prompt("Inserisci il nuovo URL (immagine o video):", currentVal);
      if (newUrl !== null && newUrl.trim() !== "") {
        const tag = currentTarget.tagName.toLowerCase();
        if (tag === 'img' || tag === 'video') {
            currentTarget.src = newUrl;
        } else {
            currentTarget.style.backgroundImage = `url('${newUrl}')`;
        }
        
        window.cmsTrackedChanges['css:' + currentSelector] = {
            value: newUrl,
            category: 'cms_media'
        };
      }
    }
  });
  itemEditLink.addEventListener('click', (e) => {
    e.stopPropagation();
    ctxMenu.classList.remove('active');
    if (currentTarget && currentSelector) {
      const newUrl = prompt("Inserisci il nuovo link di destinazione:", currentTarget.href || "");
      if (newUrl !== null && newUrl.trim() !== "") {
        currentTarget.href = newUrl;
        window.cmsTrackedChanges['css:' + currentSelector] = {
            value: newUrl,
            category: 'cms_link'
        };
      }
    }
  });
  console.log("CMS Visual Mode UNIVERSALE Inizializzato.");
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { setTimeout(initCmsVisualMode, 1000); });
} else {
  setTimeout(initCmsVisualMode, 1000);
}
"""
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content + "\n" + new_js)

import os
file_path = r"c:\Users\alber\Desktop\LuxuryCar\app.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()
# Trova dove inizia la parte CMS per rimuovere il vecchio codice
marker = "/* ==========================================================================\n   INTEGRAZIONE CMS FRONTEND (UNIVERSALE)"
idx = content.find(marker)
if idx != -1:
    content = content[:idx]
new_js = """
/* ==========================================================================
   INTEGRAZIONE CMS FRONTEND (UNIVERSALE & STRUTTURALE)
   ========================================================================== */
async function loadSiteConfigFrontend() {
  if (!supabase) return;
  try {
    const { data, error } = await supabase.from('site_config').select('*');
    if (error || !data) return;
    data.forEach(item => {
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
                 } else if (item.category === 'cms_html') {
                     el.outerHTML = item.config_value;
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
   VISUAL BUILDER MODE (Iframe Frontend - STRUTTURALE AVANZATO)
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
      outline: 2px dashed #3498db !important;
      outline-offset: 2px;
      cursor: context-menu !important;
      background: rgba(52, 152, 219, 0.1) !important;
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
      min-width: 220px;
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
      color: #3498db;
    }
    .cms-menu-divider {
      height: 1px;
      background: rgba(255,255,255,0.1);
      margin: 4px 0;
    }
  `;
  document.head.appendChild(style);
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
  const divider1 = document.createElement('div');
  divider1.className = 'cms-menu-divider';
  const itemMoveUp = document.createElement('div');
  itemMoveUp.className = 'cms-menu-item';
  itemMoveUp.innerHTML = '<i class="ri-arrow-up-line"></i> Sposta Prima / Sinistra';
  const itemMoveDown = document.createElement('div');
  itemMoveDown.className = 'cms-menu-item';
  itemMoveDown.innerHTML = '<i class="ri-arrow-down-line"></i> Sposta Dopo / Destra';
  const itemDelete = document.createElement('div');
  itemDelete.className = 'cms-menu-item';
  itemDelete.innerHTML = '<i class="ri-delete-bin-line" style="color:#ef4444;"></i> Elimina Elemento';
  const divider2 = document.createElement('div');
  divider2.className = 'cms-menu-divider';
  const itemSaveHtml = document.createElement('div');
  itemSaveHtml.className = 'cms-menu-item';
  itemSaveHtml.innerHTML = '<i class="ri-save-line" style="color:#f1c40f;"></i> <strong>Salva Struttura Globale</strong>';
  ctxMenu.appendChild(itemEditText);
  ctxMenu.appendChild(itemEditMedia);
  ctxMenu.appendChild(itemEditLink);
  ctxMenu.appendChild(divider1);
  ctxMenu.appendChild(itemMoveUp);
  ctxMenu.appendChild(itemMoveDown);
  ctxMenu.appendChild(itemDelete);
  ctxMenu.appendChild(divider2);
  ctxMenu.appendChild(itemSaveHtml);
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
    itemEditLink.style.display = isLinkLike ? 'flex' : 'none';
  });
  // Azioni Editor
  itemEditText.addEventListener('click', (e) => {
    e.stopPropagation(); ctxMenu.classList.remove('active');
    if (currentTarget && currentSelector) {
      currentTarget.setAttribute('contenteditable', 'true');
      currentTarget.focus();
      currentTarget.addEventListener('input', function onInput() {
        window.cmsTrackedChanges['css:' + currentSelector] = { value: currentTarget.innerHTML, category: 'cms_text' };
      }, { once: false });
    }
  });
  itemEditMedia.addEventListener('click', (e) => {
    e.stopPropagation(); ctxMenu.classList.remove('active');
    if (currentTarget && currentSelector) {
      let currentVal = currentTarget.src || "";
      if (!currentVal) {
          const bg = window.getComputedStyle(currentTarget).backgroundImage;
          if (bg && bg !== 'none') currentVal = bg.replace(/url\\(['"]?(.*?)['"]?\\)/i, '$1');
      }
      const newUrl = prompt("Inserisci il nuovo URL:", currentVal);
      if (newUrl !== null && newUrl.trim() !== "") {
        const tag = currentTarget.tagName.toLowerCase();
        if (tag === 'img' || tag === 'video') currentTarget.src = newUrl;
        else currentTarget.style.backgroundImage = `url('${newUrl}')`;
        window.cmsTrackedChanges['css:' + currentSelector] = { value: newUrl, category: 'cms_media' };
      }
    }
  });
  itemEditLink.addEventListener('click', (e) => {
    e.stopPropagation(); ctxMenu.classList.remove('active');
    if (currentTarget && currentSelector) {
      const newUrl = prompt("Inserisci il nuovo link:", currentTarget.href || "");
      if (newUrl !== null && newUrl.trim() !== "") {
        currentTarget.href = newUrl;
        window.cmsTrackedChanges['css:' + currentSelector] = { value: newUrl, category: 'cms_link' };
      }
    }
  });
  // Azioni Strutturali
  itemMoveUp.addEventListener('click', (e) => {
      e.stopPropagation(); ctxMenu.classList.remove('active');
      if (currentTarget && currentTarget.previousElementSibling) {
          currentTarget.parentNode.insertBefore(currentTarget, currentTarget.previousElementSibling);
      }
  });
  itemMoveDown.addEventListener('click', (e) => {
      e.stopPropagation(); ctxMenu.classList.remove('active');
      if (currentTarget && currentTarget.nextElementSibling) {
          currentTarget.parentNode.insertBefore(currentTarget.nextElementSibling, currentTarget);
      }
  });
  itemDelete.addEventListener('click', (e) => {
      e.stopPropagation(); ctxMenu.classList.remove('active');
      if (currentTarget) {
          if(confirm("Rimuovere questo elemento? (Per rendere la modifica permanente, dovrai fare Tasto Destro sul suo Contenitore e cliccare 'Salva Struttura Globale')")) {
             currentTarget.remove();
          }
      }
  });
  itemSaveHtml.addEventListener('click', (e) => {
      e.stopPropagation(); ctxMenu.classList.remove('active');
      if (currentTarget && currentSelector) {
          if (confirm("Vuoi salvare l'intera struttura HTML di questo blocco in Supabase? Questa modifica diventerà GLOBALE su tutto il sito per questo elemento (" + currentTarget.tagName + ").")) {
              const clone = currentTarget.cloneNode(true);
              const removeCmsStuff = (node) => {
                  if(node.classList) {
                      node.classList.remove('cms-hoverable');
                      if (node.classList.length === 0) node.removeAttribute('class');
                  }
                  if(node.hasAttribute('contenteditable')) node.removeAttribute('contenteditable');
                  if(node.id === 'cmsContextMenu' || (node.classList && node.classList.contains('cms-context-menu'))) {
                      node.remove();
                  }
              };
              removeCmsStuff(clone);
              clone.querySelectorAll('.cms-hoverable, [contenteditable], .cms-context-menu').forEach(removeCmsStuff);
              
              window.cmsTrackedChanges['css:' + currentSelector] = {
                  value: clone.outerHTML,
                  category: 'cms_html'
              };
              alert("Struttura salvata in memoria! Clicca 'Salva Modifiche Sito' nel CRM per confermarla sul Database.");
          }
      }
  });
  console.log("CMS Visual Mode STRUTTURALE Inizializzato.");
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { setTimeout(initCmsVisualMode, 1000); });
} else {
  setTimeout(initCmsVisualMode, 1000);
}
"""
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content + "\n" + new_js)

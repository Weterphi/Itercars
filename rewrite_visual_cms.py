import os
import re
file_path = r"c:\Users\alber\Desktop\LuxuryCar\app.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()
# Find the start of the VISUAL BUILDER MODE block and cut it out
marker = "/* ==========================================================================\n   VISUAL BUILDER MODE (Iframe Frontend)"
idx = content.find(marker)
if idx != -1:
    content = content[:idx]
new_js = """/* ==========================================================================
   VISUAL BUILDER MODE (Iframe Frontend - Advanced Context Menu)
   ========================================================================== */
window.cmsTrackedChanges = window.cmsTrackedChanges || {};
window.getCmsChanges = () => window.cmsTrackedChanges;
window.clearCmsChanges = () => { window.cmsTrackedChanges = {}; };
function initCmsVisualMode() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('cms_mode') !== 'true') return;
  // 1. Inject CSS for hover effects and context menu
  const style = document.createElement('style');
  style.innerHTML = `
    .cms-hoverable {
      transition: outline 0.2s;
    }
    .cms-hoverable:hover {
      outline: 2px dashed #2ecc71 !important;
      outline-offset: 4px;
      cursor: context-menu;
    }
    .cms-context-menu {
      position: absolute;
      z-index: 999999;
      background: #1a1e2d;
      border: 1px solid rgba(255,255,255,0.1);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      border-radius: 8px;
      padding: 6px;
      min-width: 180px;
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
  // 2. Create Context Menu DOM
  const ctxMenu = document.createElement('div');
  ctxMenu.className = 'cms-context-menu';
  ctxMenu.id = 'cmsContextMenu';
  
  const itemEditText = document.createElement('div');
  itemEditText.className = 'cms-menu-item';
  itemEditText.innerHTML = '<i class="ri-edit-2-line"></i> Modifica Testo';
  
  const itemEditMedia = document.createElement('div');
  itemEditMedia.className = 'cms-menu-item';
  itemEditMedia.innerHTML = '<i class="ri-image-edit-line"></i> Cambia Immagine/Video';
  
  ctxMenu.appendChild(itemEditText);
  ctxMenu.appendChild(itemEditMedia);
  document.body.appendChild(ctxMenu);
  let currentTarget = null;
  // 3. Close menu on outside click
  document.addEventListener('click', () => {
    ctxMenu.classList.remove('active');
    if (currentTarget && currentTarget.hasAttribute('contenteditable')) {
        // remove contenteditable if they click away
        currentTarget.removeAttribute('contenteditable');
    }
  });
  // 4. Mark hoverable elements
  const textElements = document.querySelectorAll('[data-i18n]');
  textElements.forEach(el => el.classList.add('cms-hoverable'));
  
  // Mark media elements (images and specific videos like heroBgVideo)
  document.querySelectorAll('img, video').forEach(el => el.classList.add('cms-hoverable'));
  // 5. Intercept Right Click
  document.addEventListener('contextmenu', (e) => {
    let target = e.target.closest('.cms-hoverable');
    if (!target) return; // let default happen or just block? we only care if they clicked an element we can edit
    e.preventDefault();
    currentTarget = target;
    
    // Position menu
    ctxMenu.style.left = e.pageX + 'px';
    ctxMenu.style.top = e.pageY + 'px';
    ctxMenu.classList.add('active');
    // Show/hide options based on element type
    const isText = target.hasAttribute('data-i18n');
    const isMedia = target.tagName.toLowerCase() === 'img' || target.tagName.toLowerCase() === 'video';
    itemEditText.style.display = isText ? 'flex' : 'none';
    itemEditMedia.style.display = isMedia || target.id === 'heroBgVideo' ? 'flex' : 'none';
  });
  // 6. Action: Edit Text
  itemEditText.addEventListener('click', (e) => {
    e.stopPropagation();
    ctxMenu.classList.remove('active');
    if (currentTarget) {
      currentTarget.setAttribute('contenteditable', 'true');
      currentTarget.focus();
      
      // Setup input listener to save to tracker
      currentTarget.addEventListener('input', function onInput() {
        const key = currentTarget.getAttribute('data-i18n');
        const langKey = key + '_' + currentLang;
        window.cmsTrackedChanges[langKey] = currentTarget.innerHTML;
      }, { once: false });
    }
  });
  // 7. Action: Edit Media
  itemEditMedia.addEventListener('click', (e) => {
    e.stopPropagation();
    ctxMenu.classList.remove('active');
    if (currentTarget) {
      const newUrl = prompt("Inserisci il nuovo URL per l'immagine o il video:", currentTarget.src || "");
      if (newUrl !== null && newUrl.trim() !== "") {
        currentTarget.src = newUrl;
        
        // Track the change. Note: Need a strategy for identifying images. 
        // For hero video, it has ID heroBgVideo.
        if (currentTarget.id === 'heroBgVideo') {
           window.cmsTrackedChanges['home_hero_video'] = newUrl;
        } else if (currentTarget.id) {
           window.cmsTrackedChanges['media_' + currentTarget.id] = newUrl;
        } else {
           alert("Attenzione: questo media non ha un ID, non può essere salvato globalmente nel CMS al momento. (Richiede configurazione su misura)");
        }
      }
    }
  });
  console.log("CMS Visual Mode (Right-Click) Inizializzato.");
}
// Chiamiamo initCmsVisualMode dopo che la pagina è caricata
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initCmsVisualMode, 1000);
  });
} else {
  setTimeout(initCmsVisualMode, 1000);
}
"""
with open(file_path, "w", encoding="utf-8") as f:
    f.write(content + "\n" + new_js)

import os
js_code = """
/* ==========================================================================
   GESTIONE SITO CMS (Gestione Contenuti Supabase)
   ========================================================================== */
async function loadSiteConfigCMS() {
  if (!supabase) return;
  const container = document.getElementById('cmsOverviewContainer');
  if (!container) return;
  container.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 20px;">Caricamento configurazione sito in corso...</div>';
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('*')
      .order('category', { ascending: true })
      .order('config_key', { ascending: true });
    if (error) throw error;
    if (!data || data.length === 0) {
      container.innerHTML = '<div class="empty-state-box"><i class="ri-settings-4-line"></i><h4>Nessuna configurazione trovata</h4><p>Non ci sono voci in site_config.</p></div>';
      return;
    }
    // Raggruppa per categoria
    const categories = {};
    data.forEach(item => {
      const cat = item.category || 'general';
      if (!categories[cat]) categories[cat] = [];
      categories[cat].push(item);
    });
    let html = '';
    for (const cat in categories) {
      html += `
        <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 16px; margin-bottom: 16px;">
          <h4 style="color: var(--accent-green); margin-bottom: 12px; font-weight: 400; text-transform: capitalize;"><i class="ri-folder-settings-line"></i> Categoria: ${cat}</h4>
          <div style="display: flex; flex-direction: column; gap: 12px;">
      `;
      categories[cat].forEach(item => {
        html += `
            <div style="display: flex; flex-direction: column; gap: 6px;">
              <div style="display: flex; justify-content: space-between;">
                <label style="color: #fff; font-size: 0.85rem; font-weight: 300;">${item.description || item.config_key} <span style="color: var(--text-muted); font-size: 0.7rem;">(${item.config_key})</span></label>
                <button onclick="saveCmsField('${item.config_key}')" class="btn-header btn-header-outline" style="padding: 2px 8px; font-size: 0.75rem; border-color: var(--accent-green); color: var(--accent-green);">Salva</button>
              </div>
              <textarea id="cms_field_${item.config_key}" rows="2" style="width: 100%; padding: 8px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 4px; font-family: monospace;">${item.config_value || ''}</textarea>
            </div>
        `;
      });
      html += `
          </div>
        </div>
      `;
    }
    
    container.innerHTML = html;
  } catch (e) {
    console.warn("Errore caricamento CMS:", e);
    container.innerHTML = '<div style="color: #ef4444; text-align: center; padding: 20px;">Errore durante il caricamento del CMS. Verifica le tabelle in Supabase.</div>';
  }
}
async function saveCmsField(key) {
  const el = document.getElementById('cms_field_' + key);
  if (!el) return;
  const newVal = el.value;
  try {
    const { error } = await supabase
      .from('site_config')
      .update({ config_value: newVal, updated_at: new Date() })
      .eq('config_key', key);
    if (error) throw error;
    
    // Mostra conferma visuale
    const originalBg = el.style.background;
    el.style.background = 'rgba(46, 204, 113, 0.2)';
    setTimeout(() => el.style.background = originalBg, 800);
  } catch (e) {
    console.warn("Errore salvataggio CMS:", e);
    alert("Errore salvataggio campo: " + e.message);
  }
}
"""
with open(r"c:\Users\alber\Desktop\LuxuryCar\crm-admin.js", "a", encoding="utf-8") as f:
    f.write("\n" + js_code)

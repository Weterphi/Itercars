import os
import re

base_dir = r"c:\Users\alber\Desktop\LuxuryCar"
public_html_files = [
    'index.html', 'fleet.html', 'noleggio-breve-termine.html', 
    'noleggio-lungo-termine.html', 'car-detail.html', 'accademy.html', 'partners.html'
]

# 1. REMOVE FROM PUBLIC HTML FILES
pattern_direct_access = re.compile(r'\s*<!-- ACCESSO DIRETTO PER NOLEGGIATORI E PARTNER MANDANTI -->.*?</div>\s*</div>', re.DOTALL)
pattern_partner_reg_view = re.compile(r'\s*<!-- PARTNER REGISTRATION VIEW -->.*?<div id="partnerRegFormBox".*?</form>\s*<div[^>]*>.*?</div>\s*</div>', re.DOTALL)

for f in public_html_files:
    path = os.path.join(base_dir, f)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as file:
            content = file.read()
        
        # Remove the direct access block. We need to be careful with the last </div>
        # Actually, let's use a more precise regex for the direct access block
        content = re.sub(r'\s*<!-- ACCESSO DIRETTO PER NOLEGGIATORI E PARTNER MANDANTI -->.*?Diventa partner</button>\s*</div>\s*</div>', '', content, flags=re.DOTALL)
        
        # Remove the partner reg view
        content = re.sub(r'\s*<!-- PARTNER REGISTRATION VIEW -->\s*<div id="partnerRegFormBox".*?Torna al Login</button>\s*</div>\s*</div>', '', content, flags=re.DOTALL)
        
        with open(path, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f"Cleaned {f}")

# 2. MODIFY CRM-PARTNER.HTML
crm_html_path = os.path.join(base_dir, 'crm-partner.html')
if os.path.exists(crm_html_path):
    with open(crm_html_path, 'r', encoding='utf-8') as file:
        crm_html = file.read()
        
    # Replace <div class="partner-auth-box"> with id
    crm_html = crm_html.replace('<div class="partner-auth-box">', '<div class="partner-auth-box" id="partnerLoginBox">')
    
    # Inject the switch button at the end of the form
    switch_html = """
      <div style="border-top: 1px dashed rgba(250, 204, 21, 0.4); padding-top: 12px; text-align: center; margin-top: 20px;">
        <span style="color: var(--text-muted); font-size: 0.85rem;">Non sei ancora partner?</span>
        <button type="button" onclick="switchPartnerAuthMode('register')" style="background: none; border: none; color: #facc15; font-weight: 700; cursor: pointer; margin-left: 6px; text-decoration: underline; font-size: 0.85rem;">Diventa partner</button>
      </div>
    </div>"""
    
    crm_html = re.sub(r'(<button type="submit"[^>]*>.*?</button>\s*</form>)', r'\1' + switch_html, crm_html, flags=re.DOTALL)
    
    # The second </div> is from the auth-box closing tag. Wait, I replaced </form> with </form> + switch_html. 
    # Actually, </form> is followed by </div> in the original file. Let's do it safely.
    
    # Inject the new registration box right before the closing </div> of partnerAuthOverlay
    reg_box_html = """
    <!-- PARTNER REGISTRATION VIEW -->
    <div class="partner-auth-box" id="partnerRegFormBox" style="display: none; max-width: 500px; max-height: 90vh; overflow-y: auto;">
      <h3 style="font-size: 1.6rem; margin-bottom: 8px; color: #facc15;"><i class="ri-hand-heart-fill text-gradient"></i> Diventa Partner</h3>
      <p style="color: var(--text-muted); margin-bottom: 20px; font-size: 0.9rem;">Compila il modulo per inviare la richiesta di adesione.</p>
      
      <form onsubmit="handlePartnerReg(event)" style="display: flex; flex-direction: column; gap: 14px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div class="form-group" style="text-align: left;">
            <label style="font-size: 0.74rem; font-weight: 300; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; display: block;">Nome Azienda *</label>
            <input type="text" class="admin-input" id="partRegCompany" required placeholder="Luxury SRL">
          </div>
          <div class="form-group" style="text-align: left;">
            <label style="font-size: 0.74rem; font-weight: 300; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; display: block;">Partita IVA *</label>
            <input type="text" class="admin-input" id="partRegVat" required placeholder="IT1234567890">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div class="form-group" style="text-align: left;">
            <label style="font-size: 0.74rem; font-weight: 300; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; display: block;">Referente *</label>
            <input type="text" class="admin-input" id="partRegName" required placeholder="Mario Rossi">
          </div>
          <div class="form-group" style="text-align: left;">
            <label style="font-size: 0.74rem; font-weight: 300; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; display: block;">Telefono *</label>
            <input type="tel" class="admin-input" id="partRegPhone" required placeholder="+39 340 0000000">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div class="form-group" style="text-align: left;">
            <label style="font-size: 0.74rem; font-weight: 300; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; display: block;">Email *</label>
            <input type="email" class="admin-input" id="partRegEmail" required placeholder="info@azienda.com">
          </div>
          <div class="form-group" style="text-align: left;">
            <label style="font-size: 0.74rem; font-weight: 300; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; display: block;">Città *</label>
            <input type="text" class="admin-input" id="partRegAddress" required placeholder="Milano">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div class="form-group" style="text-align: left;">
            <label style="font-size: 0.74rem; font-weight: 300; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; display: block;">Password *</label>
            <input type="password" class="admin-input" id="partRegPassword" required minlength="6" placeholder="••••••••">
          </div>
          <div class="form-group" style="text-align: left;">
            <label style="font-size: 0.74rem; font-weight: 300; color: var(--text-muted); text-transform: uppercase; margin-bottom: 6px; display: block;">Conferma *</label>
            <input type="password" class="admin-input" id="partRegPasswordConfirm" required minlength="6" placeholder="••••••••">
          </div>
        </div>

        <button type="submit" class="btn-header btn-header-primary" style="width: 100%; justify-content: center; height: 46px; font-size: 0.96rem; margin-top: 10px; border-color: #facc15; color: #111; background: #facc15;">
          <span>Invia Richiesta</span> <i class="ri-send-plane-fill"></i>
        </button>
      </form>

      <div style="text-align: center; margin-top: 20px; padding-top: 14px; border-top: 1px dashed rgba(255,255,255,0.1);">
        <span style="color: var(--text-muted); font-size: 0.95rem;">Vuoi accedere alla console?</span>
        <button type="button" onclick="switchPartnerAuthMode('login')" style="background: none; border: none; color: #facc15; font-weight: 600; cursor: pointer; margin-left: 6px; text-decoration: underline;">Torna al Login</button>
      </div>
    </div>
"""
    
    # Find the closing div of partnerAuthOverlay
    crm_html = re.sub(r'(</form>\s*</div>\s*</div>)', r'\1' + '\n' + reg_box_html, crm_html, count=1)
    
    # Wait, the previous replacement already added the switch_html and an extra `</div>`.
    # Let me reset and just do a manual string replace.
    with open(crm_html_path, 'r', encoding='utf-8') as file:
        crm_html_raw = file.read()
        
    crm_html_raw = crm_html_raw.replace('<div class="partner-auth-box">', '<div class="partner-auth-box" id="partnerLoginBox">')
    
    switch_html_proper = """      </form>
      <div style="border-top: 1px dashed rgba(250, 204, 21, 0.4); padding-top: 12px; text-align: center; margin-top: 20px;">
        <span style="color: var(--text-muted); font-size: 0.85rem;">Non sei ancora partner?</span>
        <button type="button" onclick="switchPartnerAuthMode('register')" style="background: none; border: none; color: #facc15; font-weight: 700; cursor: pointer; margin-left: 6px; text-decoration: underline; font-size: 0.85rem;">Diventa partner</button>
      </div>"""
      
    crm_html_raw = crm_html_raw.replace('</form>', switch_html_proper, 1)
    
    # Now append reg_box_html before the closing div of partnerAuthOverlay
    # The partnerAuthOverlay div ends right before the main container or body, but it's easier to replace `</div>\n  </div>\n\n  <div class="dashboard-layout">`
    # Let's just find the first `    </div>\n  </div>` which closes partnerLoginBox and partnerAuthOverlay.
    crm_html_raw = crm_html_raw.replace('    </div>\n  </div>', '    </div>\n' + reg_box_html + '\n  </div>', 1)

    with open(crm_html_path, 'w', encoding='utf-8') as file:
        file.write(crm_html_raw)
    print("Updated crm-partner.html")

# 3. APPEND JS LOGIC TO CRM-PARTNER.JS
crm_js_path = os.path.join(base_dir, 'crm-partner.js')
if os.path.exists(crm_js_path):
    js_code = """

/* ==========================================================================
   PARTNER REGISTRATION & AUTH SWITCH
   ========================================================================== */
window.switchPartnerAuthMode = function(mode) {
  const loginBox = document.getElementById('partnerLoginBox');
  const regBox = document.getElementById('partnerRegFormBox');
  if (mode === 'register') {
    if(loginBox) loginBox.style.display = 'none';
    if(regBox) regBox.style.display = 'block';
  } else {
    if(loginBox) loginBox.style.display = 'block';
    if(regBox) regBox.style.display = 'none';
  }
};

window.handlePartnerReg = async function(event) {
  event.preventDefault();
  if (!supabase) {
    alert("Errore di connessione al database. Riprovare pi tardi.");
    return;
  }

  const companyName = document.getElementById('partRegCompany').value.trim();
  const vat = document.getElementById('partRegVat').value.trim();
  const contactName = document.getElementById('partRegName').value.trim();
  const phone = document.getElementById('partRegPhone').value.trim();
  const email = document.getElementById('partRegEmail').value.trim();
  const address = document.getElementById('partRegAddress').value.trim();
  const password = document.getElementById('partRegPassword').value;
  const passwordConfirm = document.getElementById('partRegPasswordConfirm').value;

  if (password !== passwordConfirm) {
    alert("Le password non coincidono.");
    return;
  }

  const submitBtn = event.target.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> <span>Invio in corso...</span>`;
    submitBtn.disabled = true;
  }

  try {
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: contactName,
          company: companyName,
          role: 'pending_partner'
        }
      }
    });

    if (authErr) throw authErr;
    const authId = authData.user ? authData.user.id : null;

    const { error: dbErr } = await supabase.from('supplier_applications').insert([{
      auth_id: authId,
      company_name: companyName,
      partita_iva: vat,
      referent_name: contactName,
      email: email,
      phone: phone,
      fleet_size: 'Non specificato',
      city: address,
      models: 'Richiesta dal popup CRM Partner',
      status: 'new',
      data: new Date().toLocaleString('it-IT')
    }]);

    if (dbErr) throw dbErr;
    
    await supabase.auth.signOut();

    alert("Richiesta inviata con successo! Il team ti contatter al pi presto. Non potrai accedere fino ad approvazione avvenuta.");
    window.switchPartnerAuthMode('login');
    event.target.reset();
  } catch (error) {
    console.error("Errore invio candidatura partner:", error);
    alert("Si  verificato un errore durante l'invio della richiesta: " + (error.message || "Riprova pi tardi."));
  } finally {
    if (submitBtn) {
      submitBtn.innerHTML = `<span>Invia Richiesta</span> <i class="ri-send-plane-fill"></i>`;
      submitBtn.disabled = false;
    }
  }
};
"""
    with open(crm_js_path, 'a', encoding='utf-8') as file:
        file.write(js_code)
    print("Updated crm-partner.js")

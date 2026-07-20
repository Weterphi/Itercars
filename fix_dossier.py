import os

JS_CODE = """
// ==========================================
// DOSSIER RECOVERY MODAL LOGIC
// ==========================================
function openDossierRecoveryModal() {
  const modal = document.getElementById('dossierRecoveryModal');
  if (modal) {
    modal.classList.add('active');
  } else {
    console.error("Dossier Recovery Modal not found in DOM");
  }
}
window.openDossierRecoveryModal = openDossierRecoveryModal;

function closeDossierRecoveryModal() {
  const modal = document.getElementById('dossierRecoveryModal');
  if (modal) {
    modal.classList.remove('active');
  }
}
window.closeDossierRecoveryModal = closeDossierRecoveryModal;

async function handleDossierRecoverySubmit(e) {
  e.preventDefault();
  const code = document.getElementById('recoveryQuoteCodeInput')?.value.trim();
  const email = document.getElementById('recoveryEmailInput')?.value.trim();
  const errMsg = document.getElementById('recoveryErrorMsg');
  if (errMsg) errMsg.style.display = 'none';
  
  if (!code && !email) {
    if (errMsg) {
      errMsg.innerText = "Inserisci almeno il codice preventivo o l'email.";
      errMsg.style.display = 'block';
    }
    return;
  }
  
  // Fake loader / redirect for now, assuming actual Supabase logic is elsewhere or we just show a message
  const btn = e.target.querySelector('button[type="submit"]');
  if (btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Ricerca in corso...';
    btn.disabled = true;
    
    setTimeout(() => {
      btn.innerHTML = originalText;
      btn.disabled = false;
      if (errMsg) {
        errMsg.innerText = "Pratica non trovata o scaduta. Contatta il concierge.";
        errMsg.style.display = 'block';
      }
    }, 1500);
  }
}
window.handleDossierRecoverySubmit = handleDossierRecoverySubmit;
"""

def append_js():
    with open("app.js", "a", encoding="utf-8") as f:
        f.write("\n" + JS_CODE)
    print("Appended JS to app.js")

def inject_html_modals():
    # Read modals from index.html
    with open("index.html", "r", encoding="utf-8") as f:
        content = f.read()
    
    start_str = "<!-- ================= DOSSIER RECOVERY MODAL ================= -->"
    end_str = "<!-- Supabase JS SDK & App Scripts -->"
    
    # We find the index
    start_idx = content.find(start_str)
    if start_idx == -1:
        print("Could not find start of modals in index.html")
        return
        
    end_idx = content.find("<!-- ================= FOOTER", start_idx) # Actually the modal ends before footer? No, it's before supabase script
    # let's extract by string splitting:
    
    # Let's just find the end of autoRecoveryToast
    toast_end_str = "</div>\n\n  <!-- Supabase JS SDK"
    end_idx = content.find(toast_end_str)
    if end_idx == -1:
        end_idx = content.find("  <script src=\"https://cdn.jsdelivr.net/npm/@supabase/", start_idx)
    
    modals_html = content[start_idx:end_idx]
    
    files_to_patch = [
        "nbt-dettaglio.html",
        "nlt-dettaglio.html",
        "noleggio-breve-termine.html",
        "noleggio-lungo-termine.html"
    ]
    
    for filename in files_to_patch:
        with open(filename, "r", encoding="utf-8") as f:
            f_content = f.read()
            
        if "id=\"dossierRecoveryModal\"" in f_content:
            print(f"Modal already in {filename}")
            continue
            
        # Insert before `<div class="modal-overlay" id="authModal">` if exists
        auth_idx = f_content.find("<!-- ================= AUTHENTICATION MODAL ================= -->")
        if auth_idx != -1:
            new_content = f_content[:auth_idx] + "\n" + modals_html + "\n\n  " + f_content[auth_idx:]
        else:
            # Insert before <script src="https://cdn.jsdelivr...
            script_idx = f_content.find("<script src=\"https://cdn.jsdelivr.net/npm/@supabase/")
            if script_idx != -1:
                new_content = f_content[:script_idx] + "\n" + modals_html + "\n\n  " + f_content[script_idx:]
            else:
                body_end_idx = f_content.find("</body>")
                new_content = f_content[:body_end_idx] + "\n" + modals_html + "\n" + f_content[body_end_idx:]
                
        with open(filename, "w", encoding="utf-8") as f:
            f.write(new_content)
        print(f"Injected modals into {filename}")

if __name__ == "__main__":
    append_js()
    inject_html_modals()

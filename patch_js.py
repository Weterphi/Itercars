import re

filepath = 'academy.js'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace event listener
content = content.replace('''  // Listener di sicurezza per tutti i pulsanti "Chiedi Accesso"
  document.querySelectorAll('a[onclick*="openAccessModal"], button[onclick*="openAccessModal"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openAccessModal(e);
    });
  });''', '''  // Listener di sicurezza per i pulsanti di checkout Stripe Academy
  document.querySelectorAll('a[onclick*="buyAcademy"], button[onclick*="buyAcademy"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      buyAcademy(e);
    });
  });''')

# Now add buyAcademy function and remove access modal functions
# Finding start of access modal functions
idx = content.find('function openAccessModal')
if idx != -1:
    end_idx = content.find('// Disattiva sempre l\'audio di eventuali video all\'avvio')
    
    new_functions = '''function buyAcademy(event) {
  if(event) event.preventDefault();
  
  const btn = event.currentTarget || event.target.closest('a') || event.target.closest('button');
  if(!btn) return;

  const originalHtml = btn.innerHTML;
  btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> <span>Connessione a Stripe...</span>';
  
  setTimeout(() => {
    // QUI SI DOVREBBE REINDIRIZZARE A STRIPE (es. Stripe Payment Link)
    // window.location.href = "https://buy.stripe.com/test_123456789";
    
    // Per test/preview, simuliamo il successo dell'acquisto
    const wantsToBuy = confirm("SIMULAZIONE CHECKOUT STRIPE\\n\\nProdotto: Masterclass Itercars Academy\\nPrezzo: €279,00\\n\\nVuoi confermare l'acquisto?");
    
    if (wantsToBuy) {
      alert("✅ PAGAMENTO RIUSCITO!\\nLe tue credenziali sono: Nome Utente 'partner_vip', Password '12345'.\\nRiceverai una mail di conferma a breve.");
      btn.innerHTML = originalHtml;
      
      // Auto-login post acquisto
      localStorage.setItem('itercars_academy_user', 'partner_vip');
      showToast("Accesso Premium attivato!");
      setTimeout(() => { checkAuth(); }, 1000);
      
    } else {
      btn.innerHTML = originalHtml;
      showToast("Pagamento annullato.", true);
    }
  }, 1200);
}
window.buyAcademy = buyAcademy;

'''
    content = content[:idx] + new_functions + content[end_idx:]

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("academy.js patched!")

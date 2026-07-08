import os

OLD_GA_TAG = """<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-H6JBRXTWJL"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-H6JBRXTWJL');
  </script>"""

NEW_GA_TAG = """<head>
  <!-- Google tag (gtag.js) & Google Consent Mode v2 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-H6JBRXTWJL"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    // GDPR Google Consent Mode v2: controlla il consenso salvato
    const savedConsent = localStorage.getItem('itercars_cookie_consent');
    const isGranted = savedConsent === 'accepted' ? 'granted' : 'denied';
    gtag('consent', 'default', {
      'analytics_storage': isGranted,
      'ad_storage': isGranted,
      'ad_user_data': isGranted,
      'ad_personalization': isGranted
    });

    gtag('config', 'G-H6JBRXTWJL');
  </script>"""

BANNER_SCRIPT = '  <script src="cookie-banner.js?v=1"></script>\n</body>'

html_files = ["index.html", "fleet.html", "accademy.html", "car-detail.html", "partners.html"]
base_dir = r"c:\Users\alber\Desktop\LuxuryCar"

for filename in html_files:
    filepath = os.path.join(base_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Aggiorna GA4 con Google Consent Mode v2 se c'è la vecchia versione
        if OLD_GA_TAG in content:
            content = content.replace(OLD_GA_TAG, NEW_GA_TAG)
            print(f"[OK] Aggiornato GA4 a Consent Mode v2 in {filename}")
        elif NEW_GA_TAG in content:
            print(f"[SKIP] {filename} ha già Consent Mode v2.")
        
        # Aggiungi script cookie banner prima di </body> se non presente
        if "cookie-banner.js" not in content:
            content = content.replace("</body>", BANNER_SCRIPT)
            print(f"[OK] Aggiunto cookie-banner.js a {filename}")
        else:
            print(f"[SKIP] {filename} ha già cookie-banner.js.")
            
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
    else:
        print(f"[ERR] File non trovato: {filename}")

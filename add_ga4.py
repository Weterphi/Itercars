import os

GA_TAG = """<head>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-H6JBRXTWJL"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-H6JBRXTWJL');
  </script>"""

html_files = ["index.html", "fleet.html", "accademy.html", "car-detail.html", "partners.html"]
base_dir = r"c:\Users\alber\Desktop\LuxuryCar"

for filename in html_files:
    filepath = os.path.join(base_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        if "G-H6JBRXTWJL" in content:
            print(f"[SKIP] {filename} ha già il tag GA4.")
        else:
            # Sostituisci la prima occorrenza di <head>
            new_content = content.replace("<head>", GA_TAG, 1)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"[OK] Aggiunto tag GA4 a {filename}")
    else:
        print(f"[ERR] File non trovato: {filename}")

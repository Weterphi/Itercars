import os

CLARITY_TAG = """  <!-- Microsoft Clarity -->
  <script type="text/javascript">
    (function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "xj5lxydl3i");
    if (localStorage.getItem('itercars_cookie_consent') === 'accepted') {
      window.clarity('consent');
    }
  </script>"""

html_files = ["index.html", "fleet.html", "accademy.html", "car-detail.html", "partners.html"]
base_dir = r"c:\Users\alber\Desktop\LuxuryCar"

target_string = "gtag('config', 'G-H6JBRXTWJL');\n  </script>"

for filename in html_files:
    filepath = os.path.join(base_dir, filename)
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        if "xj5lxydl3i" in content:
            print(f"[SKIP] {filename} ha già Microsoft Clarity.")
        elif target_string in content:
            replacement = target_string + "\n" + CLARITY_TAG
            content = content.replace(target_string, replacement, 1)
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(content)
            print(f"[OK] Aggiunto Microsoft Clarity a {filename}")
        else:
            print(f"[WARN] Target non trovato in {filename}")
    else:
        print(f"[ERR] File non trovato: {filename}")

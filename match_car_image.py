import re
import codecs

js_path = r'c:\Users\alber\Desktop\LuxuryCar\nlt-dettaglio.js'

with codecs.open(js_path, 'r', 'utf-8') as f:
    content = f.read()

# Find the div we added previously
old_banner = r'<div style="width: 100%; height: 280px; margin-bottom: 24px; border-radius: 12px; overflow: hidden; border: 1px solid rgba\(255,255,255,0\.07\); background: #fff;">\s*<img src="\$\{c\.image\}" style="width: 100%; height: 100%; object-fit: contain; background: #fff;" alt="\$\{c\.model\}">\s*</div>'

# Replace with the exact HTML structure from the detail page
new_banner = """<div class="detail-image-wrapper" style="margin-bottom: 24px; box-shadow: none;">
          <img src="${c.image}" alt="${c.model}" class="detail-image" style="background: #fff; max-height: 350px;">
        </div>"""

content = re.sub(old_banner, new_banner, content)

with codecs.open(js_path, 'w', 'utf-8') as f:
    f.write(content)

print("Updated car image to match detail page style")

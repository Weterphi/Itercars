import re

filepath = r"c:\Users\alber\Desktop\LuxuryCar\app.js"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace all nav.fleet translations with "Luxury Car"
content = re.sub(r'("nav\.fleet"\s*:\s*)".*?"', r'\1"Luxury Car"', content)

# Replace all fleet.tag translations with "Luxury Car"
content = re.sub(r'("fleet\.tag"\s*:\s*)".*?"', r'\1"Luxury Car"', content)

# Replace "Categorie Flotta" -> "Categorie Luxury Car" in Italian
content = content.replace('"Categorie Flotta"', '"Categorie Luxury Car"')
# Replace "Fleet Categories" -> "Luxury Car Categories" in English
content = content.replace('"Fleet Categories"', '"Luxury Car Categories"')

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Translations in app.js updated successfully!")

with open(r'c:\Users\alber\Desktop\LuxuryCar\nlt-dettaglio.js', 'r', encoding='utf-8') as f:
    text = f.read()
new_text = text.replace("\\'Disponibile\\'", "'Disponibile'")
with open(r'c:\Users\alber\Desktop\LuxuryCar\nlt-dettaglio.js', 'w', encoding='utf-8') as f:
    f.write(new_text)

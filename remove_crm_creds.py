import codecs

html_path = r'c:\Users\alber\Desktop\LuxuryCar\crm-admin.html'

with codecs.open(html_path, 'r', 'utf-8') as f:
    content = f.read()

# Rimuovi value="ceotoribio@itercars.com"
content = content.replace('value="ceotoribio@itercars.com"', '')

# Rimuovi value="Samana2026!"
content = content.replace('value="Samana2026!"', '')

with codecs.open(html_path, 'w', 'utf-8') as f:
    f.write(content)

print("Removed pre-filled credentials from CRM console")

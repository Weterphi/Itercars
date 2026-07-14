with open('setup_partner_crm.sql', 'r', encoding='utf-8') as f:
    text = f.read()
if "\\'" in text:
    print("FOUND BACKSLASH QUOTE")
else:
    print("ALL CLEAN")

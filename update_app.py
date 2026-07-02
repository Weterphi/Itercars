import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

replacements = {
    'Audi Q8 S-Line': 'audi_q8_sline.png',
    'Audi RSQ3 Sportback': 'audi_rsq3_sportback.png',
    'Audi RSQ8': 'audi_rsq8.png',
    'Ferrari Purosangue': 'ferrari_purosangue.png',
    'Lamborghini Urus S': 'lamborghini_urus.png',
    'Maserati Levante GTS': 'maserati_levante.png',
    'Mercedes G63 AMG': 'mercedes_g63.png',
    'Porsche Cayenne Coupé Turbo GT': 'porsche_cayenne.png',
    'Porsche Macan GTS': 'porsche_macan.png',
    'Audi A5 Avant': 'audi_a5_avant.png',
    'Audi RS3': 'audi_rs3.png',
    'Audi RS5 Avant': 'audi_rs5_avant.png',
    'Audi RS6 Performance': 'audi_rs6_performance.png',
    'BMW M4 Competition': 'bmw_m4_competition.png',
    'BMW M8 Competition Cabrio': 'bmw_m8_cabrio.png',
    'Porsche 718 Spyder': 'porsche_718_spyder.png'
}

for car, img in replacements.items():
    pattern = re.compile(r'(name:\s*"' + re.escape(car) + r'".*?image:\s*")[^"]+(")', re.DOTALL)
    content = pattern.sub(r'\g<1>' + img + r'\g<2>', content)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)
print("Updated successfully")

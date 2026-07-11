import re

with open('nlt-dettaglio.js', 'r', encoding='utf-8') as f:
    js = f.read()

replacements = {
    "'bmw-s1':": "'32226fdb-ba8c-4e46-8e21-e303e0a0fe3d':",
    "'bmw-x1':": "'ccaa728f-9b2d-4480-9f1c-76d7c97ccc79':",
    "'bmw-s3t':": "'e3f556d9-8c52-43fd-9d81-ffb9c1551928':",
    "'bmw-x3':": "'1933cb66-5804-45ef-b997-8e038059f0b4':",
    "'bmw-s5':": "'3b99316f-29bb-4392-86d3-98cc6e77485d':",
    "'bmw-x5':": "'f4c1e663-a663-4fba-81c1-8ed424caf0ba':",
    "'bmw-i4':": "'efce36a9-41fc-4285-a167-4badbcbbb2c6':",
}

for old, new in replacements.items():
    js = js.replace(old, new)

# Also fix calculateAndRenderPrice
old_calc = '''let baseCarId = c.id;
    if (baseCarId.includes('-36-')) baseCarId = baseCarId.split('-36-')[0];
    if (baseCarId === 'bmw-x3-48-3k') baseCarId = 'bmw-x3'; // Fallback just in case'''
new_calc = '''let baseCarId = c.id;'''
js = js.replace(old_calc, new_calc)

with open('nlt-dettaglio.js', 'w', encoding='utf-8') as f:
    f.write(js)
    
print("Patched nlt-dettaglio.js")

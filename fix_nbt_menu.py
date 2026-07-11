import re

with open('index.html', 'r', encoding='utf-8') as f:
    idx_content = f.read()

nav_match = re.search(r'<ul class="nav-links">.*?</ul>', idx_content, re.DOTALL)
if nav_match:
    correct_nav = nav_match.group(0)
    
    for filename in ['noleggio-breve-termine.html', 'nbt-dettaglio.html']:
        with open(filename, 'r', encoding='utf-8') as f:
            content = f.read()
        content = re.sub(r'<ul class="nav-links">.*?</ul>', correct_nav, content, flags=re.DOTALL)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Fixed {filename}')

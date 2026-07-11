import glob

old_line = '<li><a href="noleggio-lungo-termine.html" style="color: #2ecc71; font-weight: 700;"><i class="ri-vip-crown-fill"></i> Lungo Termine</a></li>'
new_line = old_line + '\n        <li><a href="noleggio-breve-termine.html" style="color: #2ecc71; font-weight: 700;"><i class="ri-car-fill"></i> Breve Termine</a></li>'

for f in glob.glob('*.html'):
    try:
        with open(f, 'r', encoding='utf-8') as file:
            content = file.read()
        if old_line in content:
            content = content.replace(old_line, new_line)
            with open(f, 'w', encoding='utf-8') as file:
                file.write(content)
            print(f'Updated {f}')
    except Exception as e:
        print(f"Error processing {f}: {e}")

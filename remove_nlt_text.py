import re

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Remove the subtitle
subtitle_pattern = re.compile(r'<p style="font-size: 1\.15rem; color: var\(--text-muted\); max-width: 700px; margin: 0 auto 28px;" id="nltHeroSub">\s*Canone fisso tutto incluso: Assicurazione Kasko, Manutenzione, Bollo e Soccorso 24/7 compresi\.\s*</p>', re.DOTALL)
text = subtitle_pattern.sub('', text)

# Replace 'Luxury Car Noleggio Lungo Termine' with 'Luxury Car Lungo Termine'
text = text.replace('Luxury Car Noleggio Lungo Termine', 'Luxury Car Lungo Termine')

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'w', encoding='utf-8') as f:
    f.write(text)

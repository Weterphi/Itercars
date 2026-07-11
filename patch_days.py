import re

with open('nbt-app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Fix getCardPrice default to 1
js = js.replace('const days = duration || 2;', 'const days = duration || 1;')
js = js.replace("updateSingleCardPrice('${offer.id}', 2", "updateSingleCardPrice('${offer.id}', 1")
js = js.replace('2 Giorni</button>', '1 Giorno</button>')

js = js.replace("updateSingleCardPrice('${offer.id}', 5", "updateSingleCardPrice('${offer.id}', 2")
js = js.replace('5 Giorni</button>', '2 Giorni</button>')

js = js.replace("updateSingleCardPrice('${offer.id}', 7", "updateSingleCardPrice('${offer.id}', 5")
js = js.replace('7 Giorni</button>', '5 Giorni</button>')

# Fix details rendering to handle '1 Giorno' instead of '1 Giorni'
replacement = 'details: `${days} ${days === 1 ? "Giorno" : "Giorni"}'
js = js.replace('details: `${days} Giorni', replacement)

with open('nbt-app.js', 'w', encoding='utf-8') as f:
    f.write(js)
print('Updated nbt-app.js days')

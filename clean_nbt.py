with open('nbt-app.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Revert the specific injection
js = js.replace('NbtState.offers = mapped.concat(SAMPLE_OFFERS.filter(o => o.location === "Pescara"));', 'NbtState.offers = mapped;')

with open('nbt-app.js', 'w', encoding='utf-8') as f:
    f.write(js)

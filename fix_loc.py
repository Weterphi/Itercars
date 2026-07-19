with open('nbt-app.js', 'r', encoding='utf-8') as f:
    js = f.read()

js = js.replace("location: v.location || 'Roma',", "location: v.location || specsObj.location || 'Roma',")

with open('nbt-app.js', 'w', encoding='utf-8') as f:
    f.write(js)

import re

# 1. Patch nbt-app.js to include &vid=
with open('nbt-app.js', 'r', encoding='utf-8') as f:
    js_app = f.read()

# Replace the nbt-dettaglio.html?id=${offer.id} with nbt-dettaglio.html?id=${offer.id}&vid=${offer.vehicle_id}
js_app = js_app.replace('nbt-dettaglio.html?id=${offer.id}&model=', 'nbt-dettaglio.html?id=${offer.id}&vid=${offer.vehicle_id}&model=')

with open('nbt-app.js', 'w', encoding='utf-8') as f:
    f.write(js_app)


# 2. Patch nbt-dettaglio.js to read vid
with open('nbt-dettaglio.js', 'r', encoding='utf-8') as f:
    js_det = f.read()

# Find the block where it reconstructs the object from URL
target = """  if (!found && paramModel) {
    found = {
      id: carId,"""

replacement = """  if (!found && paramModel) {
    found = {
      id: carId,
      vehicle_id: params.get('vid') || null,"""

js_det = js_det.replace(target, replacement)

with open('nbt-dettaglio.js', 'w', encoding='utf-8') as f:
    f.write(js_det)

print("Patched nbt-app.js and nbt-dettaglio.js to pass vehicle_id (vid) in URL")

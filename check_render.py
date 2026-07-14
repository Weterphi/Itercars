with open('nbt-app.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
match = re.search(r'function renderOffers\([^{]*\{.*?(?:<div class="offer-card)[^`]*`', js, re.DOTALL)
if match:
    print(match.group(0)[-1000:])
else:
    print("renderOffers not found")

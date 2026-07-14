with open('nbt-app.js', 'r', encoding='utf-8') as f:
    js = f.read()

import re
match = re.search(r'function renderOffers\(.*?\{.*?\}', js, re.DOTALL)
if match:
    # Just print the first 1000 chars of renderOffers
    print(match.group(0)[:1000])
else:
    print('Not found')

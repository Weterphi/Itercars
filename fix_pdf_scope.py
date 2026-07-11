import re

files = [
    'c:/Users/alber/Desktop/LuxuryCar/nlt-dettaglio.js',
    'c:/Users/alber/Desktop/LuxuryCar/nlt-app.js'
]

for fp in files:
    with open(fp, 'r', encoding='utf-8') as f:
        text = f.read()

    # Define the pattern to find the try block that starts with `try {\n    const img = new Image();`
    # and replace `const specsY`, `const boxY`, `const finalY` with global assignments.
    
    # First, inject the declarations before `try { \n    const img = new Image();`
    text = text.replace('  try {\n    const img = new Image();', '  let specsY = 135;\n  let boxY = 165;\n  let finalY = 205;\n\n  try {\n    const img = new Image();')
    
    # Then remove the `const ` inside the try block
    text = text.replace('const specsY =', 'specsY =')
    text = text.replace('const boxY =', 'boxY =')
    text = text.replace('const finalY =', 'finalY =')

    with open(fp, 'w', encoding='utf-8') as f:
        f.write(text)

print('Done!')

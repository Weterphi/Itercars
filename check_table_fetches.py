import re

for fname in ['app.js', 'nlt-app.js', 'nbt-app.js', 'car-detail.js']:
    try:
        with open(fname, encoding='utf-8', errors='ignore') as f:
            content = f.read()
        tables = set(re.findall(r'from\([\'"]([^\'"]+)[\'"]\)', content))
        print(f"{fname} queries tables: {tables}")
    except Exception as e:
        print(f"Error reading {fname}: {e}")

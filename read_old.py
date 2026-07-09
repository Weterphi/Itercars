import codecs
import re

try:
    with codecs.open(r"c:\Users\alber\Desktop\LuxuryCar\app_old.js", "r", encoding="utf-16le", errors="replace") as f:
        content = f.read()

    match = re.search(r'(let\s+fleetData\s*=\s*\[.*?\];)', content, re.DOTALL)
    if match:
        with codecs.open(r"c:\Users\alber\Desktop\LuxuryCar\old_fleet.json", "w", encoding="utf-8") as out:
            out.write(match.group(1))
        print("Success")
    else:
        print("Not found")

except Exception as e:
    print("Error:", e)

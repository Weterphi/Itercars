import subprocess
import re

try:
    output = subprocess.check_output(['git', 'log', '-p', 'app.js'], cwd=r'c:\Users\alber\Desktop\LuxuryCar', encoding='utf-8', errors='replace')
    
    matches = re.findall(r'-\s*(let\s+fleetData\s*=\s*\[.*?\];)', output, re.DOTALL)
    if matches:
        print("Found old fleetData!")
        print(matches[0][:4000]) # print first 4000 chars
    else:
        print("Could not find old fleetData")
except Exception as e:
    print("Error:", e)

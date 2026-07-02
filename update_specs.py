import re

with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Highly accurate real-world specs for each car
real_specs = {
    'Audi R8 Performance': {'speed': '331 KM/H', 'accel': '3.2s', 'hp': '620 CV', 'badge': 'V10 5.2L FSI'},
    'Bentley Continental GT': {'speed': '335 KM/H', 'accel': '3.6s', 'hp': '659 CV', 'badge': 'W12 6.0L Biturbo'},
    'Ferrari 296 GTS': {'speed': '330 KM/H', 'accel': '2.9s', 'hp': '830 CV', 'badge': 'V6 3.0L PHEV'},
    'Ferrari 812 GTS': {'speed': '340 KM/H', 'accel': '3.0s', 'hp': '800 CV', 'badge': 'V12 6.5L NA'},
    'Ferrari F8 Tributo': {'speed': '340 KM/H', 'accel': '2.9s', 'hp': '720 CV', 'badge': 'V8 3.9L Biturbo'},
    'Ferrari Portofino M': {'speed': '320 KM/H', 'accel': '3.45s', 'hp': '620 CV', 'badge': 'V8 3.9L Biturbo'},
    'Ferrari Roma Spyder': {'speed': '320 KM/H', 'accel': '3.4s', 'hp': '620 CV', 'badge': 'V8 3.9L Biturbo'},
    'Ferrari SF90 Stradale': {'speed': '340 KM/H', 'accel': '2.5s', 'hp': '1000 CV', 'badge': 'V8 4.0L PHEV'},
    'Lamborghini Aventador S': {'speed': '350 KM/H', 'accel': '2.9s', 'hp': '740 CV', 'badge': 'V12 6.5L NA'},
    'Lamborghini Huracán EVO Spyder': {'speed': '325 KM/H', 'accel': '3.1s', 'hp': '640 CV', 'badge': 'V10 5.2L NA'},
    'Lamborghini Revuelto': {'speed': '350 KM/H', 'accel': '2.5s', 'hp': '1015 CV', 'badge': 'V12 6.5L PHEV'},
    'Maserati GranCabrio': {'speed': '316 KM/H', 'accel': '3.6s', 'hp': '542 CV', 'badge': 'V6 3.0L Nettuno'},
    'Maserati MC20': {'speed': '325 KM/H', 'accel': '2.9s', 'hp': '630 CV', 'badge': 'V6 3.0L Nettuno'},
    'Porsche 911 992 Cabriolet': {'speed': '306 KM/H', 'accel': '3.9s', 'hp': '450 CV', 'badge': 'Boxer 3.0L Biturbo'},
    'Porsche 911 992 Turbo S Cabriolet': {'speed': '330 KM/H', 'accel': '2.8s', 'hp': '650 CV', 'badge': 'Boxer 3.8L Biturbo'},
    
    'Audi Q8 S-Line': {'speed': '245 KM/H', 'accel': '6.3s', 'hp': '286 CV', 'badge': 'V6 3.0L TDI'},
    'Audi RSQ3 Sportback': {'speed': '280 KM/H', 'accel': '4.5s', 'hp': '400 CV', 'badge': 'L5 2.5L TFSI'},
    'Audi RSQ8': {'speed': '305 KM/H', 'accel': '3.8s', 'hp': '600 CV', 'badge': 'V8 4.0L TFSI'},
    'Ferrari Purosangue': {'speed': '310 KM/H', 'accel': '3.3s', 'hp': '725 CV', 'badge': 'V12 6.5L NA'},
    'Lamborghini Urus S': {'speed': '305 KM/H', 'accel': '3.5s', 'hp': '666 CV', 'badge': 'V8 4.0L Biturbo'},
    'Maserati Levante GTS': {'speed': '292 KM/H', 'accel': '4.2s', 'hp': '530 CV', 'badge': 'V8 3.8L Biturbo'},
    'Mercedes G63 AMG': {'speed': '240 KM/H', 'accel': '4.5s', 'hp': '585 CV', 'badge': 'V8 4.0L Biturbo'},
    'Porsche Cayenne Coupé Turbo GT': {'speed': '300 KM/H', 'accel': '3.3s', 'hp': '640 CV', 'badge': 'V8 4.0L Biturbo'},
    'Porsche Macan GTS': {'speed': '272 KM/H', 'accel': '4.5s', 'hp': '440 CV', 'badge': 'V6 2.9L Biturbo'},
    
    'Audi A5 Avant': {'speed': '250 KM/H', 'accel': '5.0s', 'hp': '367 CV', 'badge': 'V6 3.0L TFSI'}, # Approximating new S5 Avant for high tier
    'Audi RS3': {'speed': '290 KM/H', 'accel': '3.8s', 'hp': '400 CV', 'badge': 'L5 2.5L TFSI'},
    'Audi RS5 Avant': {'speed': '250 KM/H', 'accel': '3.9s', 'hp': '450 CV', 'badge': 'V6 2.9L TFSI'}, # Using current RS5 specs
    'Audi RS6 Performance': {'speed': '305 KM/H', 'accel': '3.4s', 'hp': '630 CV', 'badge': 'V8 4.0L TFSI'},
    'BMW M4 Competition': {'speed': '290 KM/H', 'accel': '3.5s', 'hp': '530 CV', 'badge': 'L6 3.0L M TwinPower'},
    'BMW M8 Competition Cabrio': {'speed': '305 KM/H', 'accel': '3.3s', 'hp': '625 CV', 'badge': 'V8 4.4L M TwinPower'},
    'Porsche 718 Spyder': {'speed': '301 KM/H', 'accel': '4.4s', 'hp': '420 CV', 'badge': 'Boxer 4.0L NA'},
}

for car_name, specs in real_specs.items():
    # Regex to find the object with this name and replace its specs and badge
    pattern = re.compile(
        r'(name:\s*"' + re.escape(car_name) + r'".*?specs:\s*\{\s*speed:\s*")[^"]+("\s*,\s*accel:\s*")[^"]+("\s*,\s*hp:\s*")[^"]+("\s*\}.*?badge:\s*")[^"]+(")',
        re.DOTALL
    )
    
    # Replacement string with real specs
    def replace_specs(match):
        return match.group(1) + specs['speed'] + match.group(2) + specs['accel'] + match.group(3) + specs['hp'] + match.group(4) + specs['badge'] + match.group(5)
    
    content = pattern.sub(replace_specs, content)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Real specs updated successfully!")

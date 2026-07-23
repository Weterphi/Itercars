import os
import glob

all_cities = [
    'Agrigento', 'Alessandria', 'Ancona', 'Aosta', 'Arezzo', 'Ascoli Piceno', 'Asti', 'Avellino', 'Bari', 'Barletta-Andria-Trani', 'Belluno', 'Benevento', 'Bergamo', 'Biella', 'Bologna', 'Bolzano', 'Brescia', 'Brindisi', 'Cagliari', 'Caltanissetta', 'Campobasso', 'Carbonia-Iglesias', 'Caserta', 'Catania', 'Catanzaro', 'Chieti', 'Como', 'Cosenza', 'Cremona', 'Crotone', 'Cuneo', 'Enna', 'Fermo', 'Ferrara', 'Firenze', 'Foggia', 'Forlì-Cesena', 'Frosinone', 'Genova', 'Gorizia', 'Grosseto', 'Imperia', 'Isernia', 'L\'Aquila', 'La Spezia', 'Latina', 'Lecce', 'Lecco', 'Livorno', 'Lodi', 'Lucca', 'Macerata', 'Mantova', 'Massa-Carrara', 'Matera', 'Medio Campidano', 'Messina', 'Milano', 'Modena', 'Monza e della Brianza', 'Napoli', 'Novara', 'Nuoro', 'Ogliastra', 'Olbia-Tempio', 'Oristano', 'Padova', 'Palermo', 'Parma', 'Pavia', 'Perugia', 'Pesaro e Urbino', 'Pescara', 'Piacenza', 'Pisa', 'Pistoia', 'Pordenone', 'Potenza', 'Prato', 'Ragusa', 'Ravenna', 'Reggio Calabria', 'Reggio Emilia', 'Rieti', 'Rimini', 'Roma', 'Rovigo', 'Salerno', 'Sassari', 'Savona', 'Siena', 'Siracusa', 'Sondrio', 'Taranto', 'Teramo', 'Terni', 'Torino', 'Trapani', 'Trento', 'Treviso', 'Trieste', 'Udine', 'Varese', 'Venezia', 'Verbano-Cusio-Ossola', 'Vercelli', 'Verona', 'Vibo Valentia', 'Vicenza', 'Viterbo'
]

featured_cities = ['Milano', 'Roma', 'Firenze', 'Venezia', 'Napoli', 'Torino', 'Bologna', 'Como']

remaining_cities = [c for c in all_cities if c not in featured_cities]

options_html = '<optgroup label=\"Tutte le Città\">\n'
for city in remaining_cities:
    options_html += f'                <option value=\"{city}\">{city}</option>\n'
options_html += '              </optgroup>'

for filename in ['index.html', 'noleggio-breve-termine.html', 'noleggio-lungo-termine.html']:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    start_str = '<optgroup label="Altre Città Premium">'
    end_str = '</optgroup>'
    
    start_idx = content.find(start_str)
    if start_idx != -1:
        end_idx = content.find(end_str, start_idx) + len(end_str)
        new_content = content[:start_idx] + options_html + content[end_idx:]
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated {filename}')
    else:
        print(f'Could not find target in {filename}')

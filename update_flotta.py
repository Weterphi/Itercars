import os

directory = r"c:\Users\alber\Desktop\LuxuryCar"

replacements = {
    "Categorie Flotta": "Categorie Luxury Car",
    "Flotta Elettrica": "Luxury Car Elettriche",
    "Catalogo Flotta Esclusiva": "Catalogo Luxury Car",
    "Sconto flotta riservato": "Sconto Luxury Car riservato",
    "Fornitori di Flotta": "Fornitori di Luxury Car",
    "Zero Costi di Flotta": "Zero Costi di Luxury Car",
    "Flotta Noleggio Lungo Termine": "Luxury Car Noleggio Lungo Termine"
}

for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        for old, new in replacements.items():
            content = content.replace(old, new)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)

print("Remaining 'Flotta' mentions replaced successfully!")

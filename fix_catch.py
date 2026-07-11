with open('c:/Users/alber/Desktop/LuxuryCar/nlt-dettaglio.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = """    const boxY = specsY + 30;
    const finalY = boxY + 40;
  doc.setFillColor(249, 249, 249);"""

replacement = """    const boxY = specsY + 30;
    const finalY = boxY + 40;
  } catch (e) {
    console.log("Immagine non caricata nel PDF nativo:", e);
  }

  doc.setFillColor(249, 249, 249);"""

text = text.replace(target, replacement)

with open('c:/Users/alber/Desktop/LuxuryCar/nlt-dettaglio.js', 'w', encoding='utf-8') as f:
    f.write(text)

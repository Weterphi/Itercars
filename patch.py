import re

with open(r'c:\Users\alber\Desktop\LuxuryCar\nlt-dettaglio.js', 'r', encoding='utf-8') as f:
    text = f.read()

target = """  if (!rates && c.model) {
    const modelStr = String(c.model).toLowerCase();
    if (modelStr.includes('serie 1') || modelStr.includes('118')) rates = OFFICIAL_RATES['bmw-s1'];
    else if (modelStr.includes('x1')) rates = OFFICIAL_RATES['bmw-x1'];
    else if (modelStr.includes('serie 3')) rates = OFFICIAL_RATES['bmw-s3t'];
    else if (modelStr.includes('x3')) rates = OFFICIAL_RATES['bmw-x3'];
    else if (modelStr.includes('serie 5')) rates = OFFICIAL_RATES['bmw-s5'];
    else if (modelStr.includes('x5')) rates = OFFICIAL_RATES['bmw-x5'];
    else if (modelStr.includes('i4')) rates = OFFICIAL_RATES['bmw-i4'];
  }

  if (!rates) {
    // Generazione automatica di 4 pacchetti rettangolari (6, 12, 24, 36 mesi)
    const base = Number(c.basePrice) || 699;
    const baseDep = Number(c.baseDeposit !== undefined ? c.baseDeposit : 3000);
    rates = {
      48: { baseKm: 25000, kmTotal: 100000, deposit: baseDep, price: Math.round(base * 0.90), extraKmPrice: 0.14, status: 'Disponibile' },
      12: { baseKm: 25000, kmTotal: 25000, deposit: 0, price: Math.round(base * 1.25), extraKmPrice: 0.18, status: 'Disponibile' },
      24: { baseKm: 25000, kmTotal: 50000, deposit: baseDep, price: Math.round(base * 1.10), extraKmPrice: 0.16, status: 'Disponibile' },
      36: { baseKm: 25000, kmTotal: 75000, deposit: baseDep, price: Math.round(base), extraKmPrice: 0.15, status: 'Disponibile' }
    };
  }"""

replacement = """
  function parsePrice(str, def) {
    if(!str || str === 'null') return def;
    let clean = String(str).replace(/[^0-9,.]/g, '').replace(',', '.');
    let val = parseFloat(clean);
    return isNaN(val) ? def : val;
  }

  if (c.p36 && c.p36 !== 'null' && c.p36 !== 'undefined') {
    const baseDep = Number(c.baseDeposit !== undefined ? c.baseDeposit : 3000);
    const defBase = Number(c.basePrice) || 699;
    rates = {
      12: { baseKm: 25000, kmTotal: 25000, deposit: 0, price: parsePrice(c.p12, Math.round(defBase * 1.25)), extraKmPrice: 0.18, status: 'Disponibile' },
      24: { baseKm: 25000, kmTotal: 50000, deposit: baseDep, price: parsePrice(c.p24, Math.round(defBase * 1.10)), extraKmPrice: 0.16, status: 'Disponibile' },
      36: { baseKm: 25000, kmTotal: 75000, deposit: baseDep, price: parsePrice(c.p36, Math.round(defBase)), extraKmPrice: 0.15, status: 'Disponibile' },
      48: { baseKm: 25000, kmTotal: 100000, deposit: baseDep, price: parsePrice(c.p46, Math.round(defBase * 0.90)), extraKmPrice: 0.14, status: 'Disponibile' }
    };
  } else {
    if (!rates && c.model) {
      const modelStr = String(c.model).toLowerCase();
      if (modelStr.includes('serie 1') || modelStr.includes('118')) rates = OFFICIAL_RATES['bmw-s1'];
      else if (modelStr.includes('x1')) rates = OFFICIAL_RATES['bmw-x1'];
      else if (modelStr.includes('serie 3')) rates = OFFICIAL_RATES['bmw-s3t'];
      else if (modelStr.includes('x3')) rates = OFFICIAL_RATES['bmw-x3'];
      else if (modelStr.includes('serie 5')) rates = OFFICIAL_RATES['bmw-s5'];
      else if (modelStr.includes('x5')) rates = OFFICIAL_RATES['bmw-x5'];
      else if (modelStr.includes('i4')) rates = OFFICIAL_RATES['bmw-i4'];
    }

    if (!rates) {
      const base = Number(c.basePrice) || 699;
      const baseDep = Number(c.baseDeposit !== undefined ? c.baseDeposit : 3000);
      rates = {
        12: { baseKm: 25000, kmTotal: 25000, deposit: 0, price: Math.round(base * 1.25), extraKmPrice: 0.18, status: 'Disponibile' },
        24: { baseKm: 25000, kmTotal: 50000, deposit: baseDep, price: Math.round(base * 1.10), extraKmPrice: 0.16, status: 'Disponibile' },
        36: { baseKm: 25000, kmTotal: 75000, deposit: baseDep, price: Math.round(base), extraKmPrice: 0.15, status: 'Disponibile' },
        48: { baseKm: 25000, kmTotal: 100000, deposit: baseDep, price: Math.round(base * 0.90), extraKmPrice: 0.14, status: 'Disponibile' }
      };
    }
  }
"""

new_text = text.replace(target, replacement.strip())

with open(r'c:\Users\alber\Desktop\LuxuryCar\nlt-dettaglio.js', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Updated nlt-dettaglio.js')

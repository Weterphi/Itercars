import re

file_path = r"c:\Users\alber\Desktop\LuxuryCar\nlt-dettaglio.js"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

new_offers = """const SAMPLE_DETAIL_OFFERS = [
  {
    id: 'bmw-s1-36-2k',
    brand: 'BMW',
    model: 'Serie 1',
    trim: '118d MSport Automatico',
    category: 'Sportiva',
    fuel: 'Diesel ⛽',
    transmission: 'Automatico 8M',
    image: 'bmw_serie_1_msport.webp',
    hp: '150 CV',
    speed: '216 km/h',
    accel: '8.3s',
    readyDelivery: true,
    deliveryWeeks: 2,
    providerName: 'Mandante Ufficiale BMW',
    basePrice: 390.00,
    baseDuration: 36,
    baseKm: 60000,
    baseDeposit: 2000
  },
  {
    id: 'bmw-x1-36-3k',
    brand: 'BMW',
    model: 'X1',
    trim: 'sDrive18d xLine DCT',
    category: 'SUV Luxury',
    fuel: 'Diesel ⛽',
    transmission: 'DCT 7M',
    image: 'bmw_x1_xline.webp',
    hp: '150 CV',
    speed: '210 km/h',
    accel: '8.9s',
    readyDelivery: true,
    deliveryWeeks: 3,
    providerName: 'Mandante Ufficiale BMW',
    basePrice: 460.00,
    baseDuration: 36,
    baseKm: 60000,
    baseDeposit: 3000
  },
  {
    id: 'bmw-s3t-36-35k',
    brand: 'BMW',
    model: 'Serie 3 Touring',
    trim: '320d xDrive MSport',
    category: 'Sportiva',
    fuel: 'Diesel Mild-Hybrid ⚡',
    transmission: 'Steptronic 8M',
    image: 'bmw_serie_3_touring.webp',
    hp: '190 CV',
    speed: '230 km/h',
    accel: '7.1s',
    readyDelivery: true,
    deliveryWeeks: 2,
    providerName: 'Mandante Ufficiale BMW',
    basePrice: 580.00,
    baseDuration: 36,
    baseKm: 75000,
    baseDeposit: 3500
  },
  {
    id: 'bmw-x3-36-4k',
    brand: 'BMW',
    model: 'X3',
    trim: 'xDrive20d MSport Mild-Hybrid',
    category: 'SUV Luxury',
    fuel: 'Diesel Mild-Hybrid ⚡',
    transmission: 'Steptronic xDrive',
    image: 'bmw_x3_msport.webp',
    hp: '190 CV',
    speed: '213 km/h',
    accel: '7.9s',
    readyDelivery: true,
    deliveryWeeks: 3,
    providerName: 'Mandante Ufficiale BMW',
    basePrice: 650.00,
    baseDuration: 36,
    baseKm: 75000,
    baseDeposit: 4000
  },
  {
    id: 'bmw-s5-36-5k',
    brand: 'BMW',
    model: 'Serie 5',
    trim: '520d Mild Hybrid Eccelsa',
    category: 'Supercar',
    fuel: 'Diesel Mild-Hybrid ⚡',
    transmission: 'Steptronic 8M',
    image: 'bmw_serie_5_eccelsa.webp',
    hp: '197 CV',
    speed: '233 km/h',
    accel: '7.3s',
    readyDelivery: true,
    deliveryWeeks: 3,
    providerName: 'Mandante Ufficiale BMW',
    basePrice: 790.00,
    baseDuration: 36,
    baseKm: 60000,
    baseDeposit: 5000
  },
  {
    id: 'bmw-x5-36-6k',
    brand: 'BMW',
    model: 'X5',
    trim: 'xDrive30d MSport MHEV',
    category: 'SUV Luxury',
    fuel: 'Diesel MHEV ⚡',
    transmission: 'Steptronic Sport xDrive',
    image: 'bmw_x5_msport.webp',
    hp: '298 CV',
    speed: '233 km/h',
    accel: '6.1s',
    readyDelivery: true,
    deliveryWeeks: 2,
    providerName: 'Mandante Ufficiale BMW',
    basePrice: 1050.00,
    baseDuration: 36,
    baseKm: 75000,
    baseDeposit: 6000
  },
  {
    id: 'bmw-i4-36-4k',
    brand: 'BMW',
    model: 'i4 Gran Coupé',
    trim: 'eDrive40 Sport Elettrica',
    category: 'Supercar',
    fuel: 'Elettrico ⚡',
    transmission: 'Automatico Single Speed',
    image: 'bmw_i4_grancoupe.webp',
    hp: '340 CV',
    speed: '190 km/h',
    accel: '5.7s',
    readyDelivery: true,
    deliveryWeeks: 3,
    providerName: 'Mandante Ufficiale BMW',
    basePrice: 570.00,
    baseDuration: 36,
    baseKm: 60000,
    baseDeposit: 4000
  }
];"""

pattern = r"const SAMPLE_DETAIL_OFFERS = \[\s*\{.*?\}\s*\];"
if re.search(pattern, content, re.DOTALL):
    updated = re.sub(pattern, new_offers, content, flags=re.DOTALL)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(updated)
    print("SAMPLE_DETAIL_OFFERS updated successfully!")
else:
    print("Could not match SAMPLE_DETAIL_OFFERS with regex.")

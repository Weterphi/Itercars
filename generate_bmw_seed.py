import re
import uuid

# Read JS file
with open('nlt-app.js', 'r', encoding='utf-8') as f:
    js_content = f.read()

# Generate UUIDs
mapping = {
    'bmw-01': str(uuid.uuid4()),
    'bmw-s1-36-2k': str(uuid.uuid4()),
    'bmw-02': str(uuid.uuid4()),
    'bmw-x1-36-3k': str(uuid.uuid4()),
    'bmw-03': str(uuid.uuid4()),
    'bmw-s3t-36-35k': str(uuid.uuid4()),
    'bmw-04': str(uuid.uuid4()),
    'bmw-x3-36-4k': str(uuid.uuid4()),
    'bmw-05': str(uuid.uuid4()),
    'bmw-s5-36-5k': str(uuid.uuid4()),
    'bmw-06': str(uuid.uuid4()),
    'bmw-x5-36-6k': str(uuid.uuid4()),
    'bmw-07': str(uuid.uuid4()),
    'bmw-i4-36-4k': str(uuid.uuid4()),
}

provider_uuid = str(uuid.uuid4())

# Build SQL
sql = f"-- Seed data for BMW NLT Offers\n"
sql += f"INSERT INTO providers (id, name, type, contact_email) VALUES ('{provider_uuid}', 'Mandante Ufficiale BMW', 'nlt', 'info@bmw.it') ON CONFLICT (id) DO NOTHING;\n\n"

cars = [
    ('bmw-01', 'bmw-s1-36-2k', 'BMW', 'Serie 1', '118d MSport Automatico', 'Diesel', 'Automatico 8M', 390.00, 390.00 * 0.15),
    ('bmw-02', 'bmw-x1-36-3k', 'BMW', 'X1', 'sDrive18d xLine DCT', 'Diesel', 'DCT 7M', 460.00, 460.00 * 0.12),
    ('bmw-03', 'bmw-s3t-36-35k', 'BMW', 'Serie 3 Touring', '320d xDrive MSport', 'Diesel Mild-Hybrid', 'Steptronic 8M', 580.00, 580.00 * 0.12),
    ('bmw-04', 'bmw-x3-36-4k', 'BMW', 'X3', 'xDrive20d MSport Mild-Hybrid', 'Diesel Mild-Hybrid', 'Steptronic xDrive', 650.00, 650.00 * 0.12),
    ('bmw-05', 'bmw-s5-36-5k', 'BMW', 'Serie 5', '520d Mild Hybrid Eccelsa', 'Diesel Mild-Hybrid', 'Steptronic 8M', 790.00, 790.00 * 0.12),
    ('bmw-06', 'bmw-x5-36-6k', 'BMW', 'X5', 'xDrive30d MSport MHEV', 'Diesel MHEV', 'Steptronic Sport xDrive', 1050.00, 1050.00 * 0.10),
    ('bmw-07', 'bmw-i4-36-4k', 'BMW', 'i4 Gran Coupé', 'eDrive40 Sport Elettrica', 'Elettrico', 'Automatico Single Speed', 570.00, 570.00 * 0.12),
]

for v_id, o_id, brand, model, trim, fuel, trans, client_price, markup in cars:
    v_uuid = mapping[v_id]
    o_uuid = mapping[o_id]
    
    # insert vehicle
    sql += f"INSERT INTO vehicles (id, brand, model, trim, fuel_type, transmission) VALUES ('{v_uuid}', '{brand}', '{model}', '{trim}', '{fuel}', '{trans}') ON CONFLICT (id) DO NOTHING;\n"
    
    # insert offer
    # Let's assume net price + markup = client_price. So net = client_price - markup.
    net = round(client_price - markup, 2)
    sql += f"INSERT INTO nlt_offers (id, vehicle_id, provider_id, mandante_monthly_net, broker_markup_monthly, client_monthly_price, base_duration_months, base_km_per_year, deposit_required) "
    sql += f"VALUES ('{o_uuid}', '{v_uuid}', '{provider_uuid}', {net}, {round(markup, 2)}, {client_price}, 36, 60000, 0) ON CONFLICT (id) DO NOTHING;\n\n"

with open('seed_bmw_nlt.sql', 'w', encoding='utf-8') as f:
    f.write(sql)

# Replace in JS
for old_id, new_id in mapping.items():
    js_content = js_content.replace(f"'{old_id}'", f"'{new_id}'")

with open('nlt-app.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Generated seed_bmw_nlt.sql and updated nlt-app.js")

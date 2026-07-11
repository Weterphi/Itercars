import re
import uuid

# Map of old vehicle_id to real UUIDs
vehicle_map = {
    'bmw-01': '7bfd5090-602b-4a21-abe9-9b7a1a69d5e5', # Serie 1
    'bmw-02': '74c10e2f-0b73-44d1-bd02-2a560e6b43e5', # X1
    'bmw-03': 'e9a6c3c8-261f-4a23-b20a-090ff2682849', # Serie 3
    'bmw-04': '0bdf55e4-abe5-4c2e-a34e-7e04ca5c1ecf', # X3
    'bmw-05': '7a9619bf-5c20-44ef-8368-3ee629e8773d', # Serie 5
    'bmw-06': 'f9ca5557-6685-4608-b991-bbc22513c68b', # X5
    'bmw-07': 'e41813c3-6193-4dbc-98a2-29cecf60b26c'  # i4
}

# 1. Update nbt-app.js
with open('nbt-app.js', 'r', encoding='utf-8') as f:
    js = f.read()

for old_id, real_uuid in vehicle_map.items():
    js = js.replace(f"vehicle_id: '{old_id}'", f"vehicle_id: '{real_uuid}'")

with open('nbt-app.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Updated nbt-app.js with real UUIDs")

# 2. Generate seed_bmw_nbt.sql
provider_id = 'ed073072-8b4c-424c-9001-b00e8082ac3c'

offers = [
    # id, vehicle_id, daily_price, base_duration_days
    (str(uuid.uuid4()), vehicle_map['bmw-01'], 80.00, 7),
    (str(uuid.uuid4()), vehicle_map['bmw-02'], 95.00, 7),
    (str(uuid.uuid4()), vehicle_map['bmw-03'], 110.00, 7),
    (str(uuid.uuid4()), vehicle_map['bmw-04'], 125.00, 7),
    (str(uuid.uuid4()), vehicle_map['bmw-05'], 150.00, 7),
    (str(uuid.uuid4()), vehicle_map['bmw-06'], 200.00, 7),
    (str(uuid.uuid4()), vehicle_map['bmw-07'], 180.00, 7)
]

sql = "-- NBT Offers Seed per BMW\n\n"
for offer in offers:
    # Assuming nbt_offers has id, vehicle_id, provider_id, daily_price
    # We will also insert client_monthly_price and duration_months as fallback in case UI uses them
    sql += f"INSERT INTO nbt_offers (id, vehicle_id, provider_id, daily_price) VALUES ('{offer[0]}', '{offer[1]}', '{provider_id}', {offer[2]}) ON CONFLICT (id) DO NOTHING;\n"

with open('seed_bmw_nbt.sql', 'w', encoding='utf-8') as f:
    f.write(sql)

print("Generated seed_bmw_nbt.sql")

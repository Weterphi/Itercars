-- Seed data for BMW NLT Offers
INSERT INTO providers (id, name, type, contact_email) VALUES ('ed073072-8b4c-424c-9001-b00e8082ac3c', 'Mandante Ufficiale BMW', 'nlt', 'info@bmw.it') ON CONFLICT (id) DO NOTHING;

INSERT INTO vehicles (id, brand, model, trim, fuel_type, transmission) VALUES ('7bfd5090-602b-4a21-abe9-9b7a1a69d5e5', 'BMW', 'Serie 1', '118d MSport Automatico', 'Diesel', 'Automatico 8M') ON CONFLICT (id) DO NOTHING;
INSERT INTO nlt_offers (id, vehicle_id, provider_id, mandante_monthly_net, broker_markup_monthly, client_monthly_price, base_duration_months, base_km_per_year, deposit_required) VALUES ('32226fdb-ba8c-4e46-8e21-e303e0a0fe3d', '7bfd5090-602b-4a21-abe9-9b7a1a69d5e5', 'ed073072-8b4c-424c-9001-b00e8082ac3c', 331.5, 58.5, 390.0, 36, 60000, 0) ON CONFLICT (id) DO NOTHING;

INSERT INTO vehicles (id, brand, model, trim, fuel_type, transmission) VALUES ('74c10e2f-0b73-44d1-bd02-2a560e6b43e5', 'BMW', 'X1', 'sDrive18d xLine DCT', 'Diesel', 'DCT 7M') ON CONFLICT (id) DO NOTHING;
INSERT INTO nlt_offers (id, vehicle_id, provider_id, mandante_monthly_net, broker_markup_monthly, client_monthly_price, base_duration_months, base_km_per_year, deposit_required) VALUES ('ccaa728f-9b2d-4480-9f1c-76d7c97ccc79', '74c10e2f-0b73-44d1-bd02-2a560e6b43e5', 'ed073072-8b4c-424c-9001-b00e8082ac3c', 404.8, 55.2, 460.0, 36, 60000, 0) ON CONFLICT (id) DO NOTHING;

INSERT INTO vehicles (id, brand, model, trim, fuel_type, transmission) VALUES ('e9a6c3c8-261f-4a23-b20a-090ff2682849', 'BMW', 'Serie 3 Touring', '320d xDrive MSport', 'Diesel Mild-Hybrid', 'Steptronic 8M') ON CONFLICT (id) DO NOTHING;
INSERT INTO nlt_offers (id, vehicle_id, provider_id, mandante_monthly_net, broker_markup_monthly, client_monthly_price, base_duration_months, base_km_per_year, deposit_required) VALUES ('e3f556d9-8c52-43fd-9d81-ffb9c1551928', 'e9a6c3c8-261f-4a23-b20a-090ff2682849', 'ed073072-8b4c-424c-9001-b00e8082ac3c', 510.4, 69.6, 580.0, 36, 60000, 0) ON CONFLICT (id) DO NOTHING;

INSERT INTO vehicles (id, brand, model, trim, fuel_type, transmission) VALUES ('0bdf55e4-abe5-4c2e-a34e-7e04ca5c1ecf', 'BMW', 'X3', 'xDrive20d MSport Mild-Hybrid', 'Diesel Mild-Hybrid', 'Steptronic xDrive') ON CONFLICT (id) DO NOTHING;
INSERT INTO nlt_offers (id, vehicle_id, provider_id, mandante_monthly_net, broker_markup_monthly, client_monthly_price, base_duration_months, base_km_per_year, deposit_required) VALUES ('1933cb66-5804-45ef-b997-8e038059f0b4', '0bdf55e4-abe5-4c2e-a34e-7e04ca5c1ecf', 'ed073072-8b4c-424c-9001-b00e8082ac3c', 572.0, 78.0, 650.0, 36, 60000, 0) ON CONFLICT (id) DO NOTHING;

INSERT INTO vehicles (id, brand, model, trim, fuel_type, transmission) VALUES ('7a9619bf-5c20-44ef-8368-3ee629e8773d', 'BMW', 'Serie 5', '520d Mild Hybrid Eccelsa', 'Diesel Mild-Hybrid', 'Steptronic 8M') ON CONFLICT (id) DO NOTHING;
INSERT INTO nlt_offers (id, vehicle_id, provider_id, mandante_monthly_net, broker_markup_monthly, client_monthly_price, base_duration_months, base_km_per_year, deposit_required) VALUES ('3b99316f-29bb-4392-86d3-98cc6e77485d', '7a9619bf-5c20-44ef-8368-3ee629e8773d', 'ed073072-8b4c-424c-9001-b00e8082ac3c', 695.2, 94.8, 790.0, 36, 60000, 0) ON CONFLICT (id) DO NOTHING;

INSERT INTO vehicles (id, brand, model, trim, fuel_type, transmission) VALUES ('f9ca5557-6685-4608-b991-bbc22513c68b', 'BMW', 'X5', 'xDrive30d MSport MHEV', 'Diesel MHEV', 'Steptronic Sport xDrive') ON CONFLICT (id) DO NOTHING;
INSERT INTO nlt_offers (id, vehicle_id, provider_id, mandante_monthly_net, broker_markup_monthly, client_monthly_price, base_duration_months, base_km_per_year, deposit_required) VALUES ('f4c1e663-a663-4fba-81c1-8ed424caf0ba', 'f9ca5557-6685-4608-b991-bbc22513c68b', 'ed073072-8b4c-424c-9001-b00e8082ac3c', 945.0, 105.0, 1050.0, 36, 60000, 0) ON CONFLICT (id) DO NOTHING;

INSERT INTO vehicles (id, brand, model, trim, fuel_type, transmission) VALUES ('e41813c3-6193-4dbc-98a2-29cecf60b26c', 'BMW', 'i4 Gran Coupé', 'eDrive40 Sport Elettrica', 'Elettrico', 'Automatico Single Speed') ON CONFLICT (id) DO NOTHING;
INSERT INTO nlt_offers (id, vehicle_id, provider_id, mandante_monthly_net, broker_markup_monthly, client_monthly_price, base_duration_months, base_km_per_year, deposit_required) VALUES ('efce36a9-41fc-4285-a167-4badbcbbb2c6', 'e41813c3-6193-4dbc-98a2-29cecf60b26c', 'ed073072-8b4c-424c-9001-b00e8082ac3c', 501.6, 68.4, 570.0, 36, 60000, 0) ON CONFLICT (id) DO NOTHING;


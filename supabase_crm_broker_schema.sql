-- ==========================================================================
-- ITERCARS — SUPABASE CRM & BROKERAGE DATABASE SCHEMA (NLT & NBT)
-- Piattaforma Multi-Mandante per Noleggio a Lungo Termine e Breve Termine
-- ==========================================================================

-- NOTE PER IL RESET PULITO:
-- Se hai già eseguito vecchi script e vuoi ripartire da zero in modo 100% pulito
-- senza conflitti, decommenta (rimuovi i --) alle 8 righe qui sotto prima di fare Run:
-- DROP TABLE IF EXISTS public.quotes CASCADE;
-- DROP TABLE IF EXISTS public.crm_documents CASCADE;
-- DROP TABLE IF EXISTS public.crm_leads CASCADE;
-- DROP TABLE IF EXISTS public.nbt_offers CASCADE;
-- DROP TABLE IF EXISTS public.nlt_offers CASCADE;
-- DROP TABLE IF EXISTS public.import_jobs CASCADE;
-- DROP TABLE IF EXISTS public.vehicles CASCADE;
-- DROP TABLE IF EXISTS public.providers CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================================================
-- 1. TABELLA MANDANTI & FORNITORI (providers) - Armonizzata con schema attuale
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50), -- 'arval', 'leasys', 'ayvens', 'drivalia', 'itercars_direct'
    name VARCHAR(255) NOT NULL,
    provider_type VARCHAR(50) DEFAULT 'external_api', -- 'external_api', 'mandante_nlt', 'flotta_proprietaria'
    default_markup_type VARCHAR(50) DEFAULT 'fixed_monthly', -- 'fixed_monthly' o 'percentage'
    default_markup_value NUMERIC(10,2) DEFAULT 45.00, -- Ricarico di default (es. 45€/mese o 5%)
    api_endpoint TEXT,
    api_key_ref VARCHAR(255),
    contact_email VARCHAR(255),
    commission_rate NUMERIC(10,2) DEFAULT 15.00,
    rating NUMERIC(3,1) DEFAULT 5.0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Allineamento automatico se la tabella esisteva già (retrocompatibilità totale):
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS code VARCHAR(50);
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS default_markup_type VARCHAR(50) DEFAULT 'fixed_monthly';
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS default_markup_value NUMERIC(10,2) DEFAULT 45.00;
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS api_key_ref VARCHAR(255);
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS commission_rate NUMERIC(10,2) DEFAULT 15.00;
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) DEFAULT 5.0;
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Assicura che code non sia nullo ed elimina duplicati prima della creazione dell'indice
UPDATE public.providers SET code = 'provider_' || SUBSTRING(id::text, 1, 8) WHERE code IS NULL OR code = '';
UPDATE public.providers 
SET code = COALESCE(code, 'provider') || '_' || SUBSTRING(id::text, 1, 8) 
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY code ORDER BY created_at) as rnum 
        FROM public.providers
    ) t WHERE t.rnum > 1
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_providers_code ON public.providers (code);

-- ==========================================================================
-- 2. TABELLA IMPORT JOBS (Storico Listini Importati dal Mandante)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.import_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
    file_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed', -- 'processing', 'completed', 'failed'
    total_rows_processed INTEGER DEFAULT 0,
    offers_created INTEGER DEFAULT 0,
    offers_deactivated INTEGER DEFAULT 0,
    imported_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================================================
-- 3. TABELLA CATALOGO MASTER VETTURE (vehicles) - Armonizzata 100% con schema attuale e NLT
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
    external_vehicle_id VARCHAR(255),
    name VARCHAR(255) DEFAULT 'Veicolo Itercars',
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    trim VARCHAR(255) NOT NULL, -- es. '2.0 TDI 150CV S-Line Automatico'
    category VARCHAR(50) NOT NULL, -- 'SUV Luxury', 'Supercar', 'Sportiva', 'Elettrica', 'Berlina'
    daily_price NUMERIC(10,2) DEFAULT 0.00,
    deposit NUMERIC(10,2) DEFAULT 0.00,
    rating NUMERIC(3,1) DEFAULT 5.0,
    fuel_type VARCHAR(50) DEFAULT 'Ibrido / Diesel', -- 'Diesel', 'Benzina', 'Ibrido Plug-in', 'Elettrico'
    transmission VARCHAR(50) DEFAULT 'Automatico',
    image_url TEXT NOT NULL,
    gallery_urls JSONB DEFAULT '[]'::jsonb,
    specs JSONB DEFAULT '{"hp": "200 CV", "speed": "230 km/h", "accel": "6.5s 0-100", "seats": 5, "doors": 5}'::jsonb,
    badge VARCHAR(100) DEFAULT 'Esclusiva ✨',
    is_nlt BOOLEAN DEFAULT true,
    is_nbt BOOLEAN DEFAULT true,
    is_luxury BOOLEAN DEFAULT true,
    is_available BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Allineamento automatico se la tabella vehicles esisteva già ed eventuale sblocco vincoli NOT NULL rigidi:
ALTER TABLE public.vehicles ALTER COLUMN name DROP NOT NULL;
ALTER TABLE public.vehicles ALTER COLUMN daily_price DROP NOT NULL;

ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS external_vehicle_id VARCHAR(255);
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS name VARCHAR(255) DEFAULT 'Veicolo Itercars';
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS brand VARCHAR(100) DEFAULT 'Itercars';
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS model VARCHAR(100) DEFAULT 'Model';
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS trim VARCHAR(255) DEFAULT 'Standard';
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'Luxury';
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS daily_price NUMERIC(10,2) DEFAULT 0.00;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS deposit NUMERIC(10,2) DEFAULT 0.00;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) DEFAULT 5.0;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS fuel_type VARCHAR(50) DEFAULT 'Ibrido / Diesel';
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS transmission VARCHAR(50) DEFAULT 'Automatico';
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS badge VARCHAR(100) DEFAULT 'Esclusiva ✨';
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS gallery_urls JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS is_nlt BOOLEAN DEFAULT true;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS is_nbt BOOLEAN DEFAULT true;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS is_luxury BOOLEAN DEFAULT true;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS is_available BOOLEAN DEFAULT true;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Retrocompatibilità e valorizzazione sicura sui record preesistenti:
UPDATE public.vehicles SET brand = COALESCE(NULLIF(brand, ''), 'Itercars') WHERE brand IS NULL OR brand = '';
UPDATE public.vehicles SET model = COALESCE(NULLIF(model, ''), COALESCE(NULLIF(name, ''), 'Model')) WHERE model IS NULL OR model = '';
UPDATE public.vehicles SET trim = COALESCE(NULLIF(trim, ''), 'Standard_' || SUBSTRING(id::text, 1, 8)) WHERE trim IS NULL OR trim = '';
UPDATE public.vehicles SET name = COALESCE(NULLIF(name, ''), brand || ' ' || model || ' ' || trim) WHERE name IS NULL OR name = '';
UPDATE public.vehicles SET daily_price = COALESCE(daily_price, 0.00) WHERE daily_price IS NULL;
UPDATE public.vehicles SET deposit = COALESCE(deposit, 0.00) WHERE deposit IS NULL;
UPDATE public.vehicles SET rating = COALESCE(rating, 5.0) WHERE rating IS NULL;

-- Sincronizza is_active con is_available per garantire retrocompatibilità al 100% con il sito e le vecchie API
UPDATE public.vehicles SET is_active = COALESCE(is_active, is_available, true);
UPDATE public.vehicles SET is_available = COALESCE(is_available, is_active, true);

-- Rende univoca la combinazione (brand, model, trim) sui record preesistenti (es. Ferrari F8 Tributo duplicate):
UPDATE public.vehicles 
SET trim = trim || '_' || SUBSTRING(id::text, 1, 8) 
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY brand, model, trim ORDER BY created_at) as rnum 
        FROM public.vehicles
    ) t WHERE t.rnum > 1
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_vehicles_brand_model_trim ON public.vehicles (brand, model, trim);

-- ==========================================================================
-- 4. TABELLA OFFERTE NLT MULTI-MANDANTE CON RICARICO BROKER (nlt_offers)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.nlt_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
    import_job_id UUID REFERENCES public.import_jobs(id) ON DELETE SET NULL,
    provider_offer_code VARCHAR(100), -- Codice univoco mandante (es. 'ARV-2026-X1-48M')
    
    -- Parametri Contrattuali
    duration_months INTEGER NOT NULL, -- 24, 36, 48, 60
    km_per_year INTEGER NOT NULL, -- 10000, 15000, 20000, 30000
    deposit_mandante NUMERIC(10,2) DEFAULT 0.00, -- Anticipo richiesto (0€, 3000€, 5000€)
    
    -- Composizione Prezzo
    mandante_monthly_net NUMERIC(10,2) NOT NULL, -- Prezzo di listino netto mandante
    broker_markup_monthly NUMERIC(10,2) DEFAULT 45.00, -- Ricarico / Provvigione Broker mensile
    client_monthly_price NUMERIC(10,2) NOT NULL, -- Prezzo finale esposto al cliente (€/mese)
    
    -- Disponibilità & Servizi
    is_ready_delivery BOOLEAN DEFAULT false, -- Pronta Consegna
    delivery_weeks INTEGER DEFAULT 4,
    services_included JSONB DEFAULT '["Assicurazione RCA & Kasko completa", "Manutenzione Ordinaria e Straordinaria", "Bollo e Messa su strada", "Soccorso stradale H24 europea", "Gestione sinistri e pneumatici"]'::jsonb,
    
    valid_until DATE DEFAULT (CURRENT_DATE + INTERVAL '60 days'),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.nlt_offers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- ==========================================================================
-- 5. TABELLA OFFERTE BREVE TERMINE NBT (nbt_offers)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.nbt_offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
    daily_price NUMERIC(10,2) NOT NULL,
    deposit_required NUMERIC(10,2) DEFAULT 1000.00,
    km_daily_limit INTEGER DEFAULT 150,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.nbt_offers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- ==========================================================================
-- 6. TABELLA ANAGRAFICA LEAD CRM & SCORING (crm_leads)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.crm_leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    customer_type VARCHAR(50) DEFAULT 'Privato', -- 'Privato', 'Partita IVA', 'Azienda SRL/SPA'
    fiscal_code_or_vat VARCHAR(100),
    annual_income_or_revenue NUMERIC(12,2),
    interested_offer_id UUID REFERENCES public.nlt_offers(id) ON DELETE SET NULL,
    interested_vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    
    -- Kanban Status del CRM
    pipeline_status VARCHAR(50) DEFAULT 'new_lead', 
    -- 'new_lead', 'quote_sent', 'docs_requested', 'scoring_pending', 'approved_by_provider', 'contract_signed', 'delivered'
    
    assigned_broker_agent VARCHAR(100) DEFAULT 'Consulente Senior ITERCARS',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    vehicle_interest TEXT
);

ALTER TABLE public.crm_leads ADD COLUMN IF NOT EXISTS vehicle_interest TEXT;

-- ==========================================================================
-- 7. TABELLA DOSSIER DOCUMENTI SCORING (crm_documents)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.crm_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.crm_leads(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- 'carta_identita', 'patente', 'visura_camerale', 'modello_unico_730', 'busta_paga', 'iban'
    file_url TEXT NOT NULL,
    verification_status VARCHAR(50) DEFAULT 'uploaded', -- 'uploaded', 'verified_ok', 'rejected'
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================================================
-- 8. TABELLA PREVENTIVI GENERATI IN 1-CLICK (quotes)
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.quotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quote_code VARCHAR(50) UNIQUE NOT NULL, -- es. 'PREV-2026-0089'
    lead_id UUID REFERENCES public.crm_leads(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    offer_id UUID REFERENCES public.nlt_offers(id) ON DELETE SET NULL,
    selected_duration_months INTEGER NOT NULL,
    selected_km_per_year INTEGER NOT NULL,
    selected_deposit NUMERIC(10,2) NOT NULL,
    final_monthly_price NUMERIC(10,2) NOT NULL,
    services_snapshot JSONB NOT NULL,
    pdf_storage_url TEXT,
    sent_via_whatsapp BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'sent', -- 'sent', 'viewed', 'accepted', 'expired'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ==========================================================================
-- ABILITAZIONE SICUREZZA RLS (Row Level Security)
-- ==========================================================================
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nlt_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nbt_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;

-- Pulizia vecchie politiche RLS se presenti
DROP POLICY IF EXISTS "Lettura pubblica veicoli disponibili" ON public.vehicles;
DROP POLICY IF EXISTS "Lettura pubblica fornitori" ON public.providers;
DROP POLICY IF EXISTS "Lettura pubblica veicoli" ON public.vehicles;
DROP POLICY IF EXISTS "Lettura pubblica offerte NLT" ON public.nlt_offers;
DROP POLICY IF EXISTS "Lettura pubblica offerte NBT" ON public.nbt_offers;
DROP POLICY IF EXISTS "Inserimento lead anonimo" ON public.crm_leads;
DROP POLICY IF EXISTS "Inserimento documenti anonimo" ON public.crm_documents;
DROP POLICY IF EXISTS "Inserimento quote anonimo" ON public.quotes;

-- Creazione nuove politiche per lettura pubblica del catalogo e listini attivi
CREATE POLICY "Lettura pubblica fornitori" ON public.providers FOR SELECT USING (is_active = true);
CREATE POLICY "Lettura pubblica veicoli" ON public.vehicles FOR SELECT USING (is_active = true);
CREATE POLICY "Lettura pubblica offerte NLT" ON public.nlt_offers FOR SELECT USING (is_active = true);
CREATE POLICY "Lettura pubblica offerte NBT" ON public.nbt_offers FOR SELECT USING (is_active = true);

-- Politiche per consentire l'inserimento di lead e preventivi dal sito web
CREATE POLICY "Inserimento lead anonimo" ON public.crm_leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Inserimento documenti anonimo" ON public.crm_documents FOR INSERT WITH CHECK (true);
CREATE POLICY "Inserimento quote anonimo" ON public.quotes FOR INSERT WITH CHECK (true);

-- ==========================================================================
-- INSERIMENTO DATI D'ESEMPIO (SEED DATA MANDANTI & FLOTTA NLT/NBT)
-- Utilizziamo ON CONFLICT (id) poiche la Primary Key è sempre vincolo univoco (Zero Errori 42P10)
-- ==========================================================================

-- Mandanti Partner
INSERT INTO public.providers (id, code, name, provider_type, default_markup_type, default_markup_value)
VALUES 
    ('a1111111-1111-1111-1111-111111111111', 'arval', 'Arval Italia S.p.A. (Gruppo BNP Paribas)', 'mandante_nlt', 'fixed_monthly', 49.00),
    ('b2222222-2222-2222-2222-222222222222', 'leasys', 'Leasys S.p.A. (Gruppo Stellantis & Crédit Agricole)', 'mandante_nlt', 'fixed_monthly', 45.00),
    ('c3333333-3333-3333-3333-333333333333', 'ayvens', 'Ayvens (Ex ALD Automotive & LeasePlan)', 'mandante_nlt', 'percentage', 6.00),
    ('d4444444-4444-4444-4444-444444444444', 'itercars_direct', 'ITERCARS Flotta Diretta Executive', 'flotta_proprietaria', 'fixed_monthly', 60.00)
ON CONFLICT (id) DO UPDATE SET 
    code = EXCLUDED.code, 
    name = EXCLUDED.name, 
    provider_type = EXCLUDED.provider_type, 
    default_markup_type = EXCLUDED.default_markup_type, 
    default_markup_value = EXCLUDED.default_markup_value, 
    is_active = true;

-- Inserimento Veicoli Master (armonizzato con tutte le colonne dello schema esistente e NLT)
INSERT INTO public.vehicles (id, name, brand, model, trim, category, daily_price, deposit, rating, fuel_type, transmission, image_url, specs, badge, is_nlt, is_nbt, is_luxury, is_available, is_active)
VALUES 
    ('10000000-0000-0000-0000-000000000001', 'Porsche Macan 4 Electric', 'Porsche', 'Macan', '4 Electric 408 CV AWD', 'SUV Luxury', 350.00, 1500.00, 5.0, 'Elettrico ⚡', 'Automatico', 'porsche_macan.webp', '{"hp": "408 CV", "speed": "220 km/h", "accel": "5.2s 0-100", "seats": 5}', 'Esclusiva ✨', true, true, true, true, true),
    ('10000000-0000-0000-0000-000000000002', 'Audi RS6 Avant Performance', 'Audi', 'RS6 Avant', 'Performance 4.0 TFSI V8 quattro', 'Sportiva', 750.00, 3000.00, 5.0, 'Ibrido Benzina', 'Automatico Tiptronic', 'audi_rs6_performance.webp', '{"hp": "630 CV", "speed": "305 km/h", "accel": "3.4s 0-100", "seats": 5}', 'Top Performance 🔥', true, true, true, true, true),
    ('10000000-0000-0000-0000-000000000003', 'Mercedes-Benz Classe G 63 AMG', 'Mercedes-Benz', 'Classe G 63 AMG', 'AMG V8 Biturbo 585 CV 4MATIC', 'SUV Luxury', 950.00, 4000.00, 5.0, 'Benzina V8 🔥', 'Automatico Speedshift', 'mercedes_g63.webp', '{"hp": "585 CV", "speed": "220 km/h", "accel": "4.5s 0-100", "seats": 5}', 'Esclusiva ✨', true, true, true, true, true),
    ('10000000-0000-0000-0000-000000000004', 'BMW M4 Competition xDrive', 'BMW', 'M4 Competition', 'xDrive Coupé 510 CV M Steptronic', 'Sportiva', 650.00, 2500.00, 5.0, 'Benzina TwinPower', 'Automatico M', 'bmw_m4_competition.webp', '{"hp": "510 CV", "speed": "290 km/h", "accel": "3.5s 0-100", "seats": 4}', 'Sportiva Racing 🏁', true, true, true, true, true),
    ('10000000-0000-0000-0000-000000000005', 'Range Rover Sport Dynamic SE', 'Range Rover', 'Sport', 'Dynamic SE D300 Mild-Hybrid AWD', 'SUV Luxury', 550.00, 2000.00, 5.0, 'Diesel MHEV', 'Automatico 8 Marce', 'maserati_levante.webp', '{"hp": "300 CV", "speed": "218 km/h", "accel": "6.6s 0-100", "seats": 5}', 'Esclusiva ✨', true, true, true, true, true),
    ('10000000-0000-0000-0000-000000000006', 'Maserati Grecale Folgore', 'Maserati', 'Grecale Folgore', '100% Elettrica 550 CV AWD Luxury', 'SUV Luxury', 600.00, 2500.00, 5.0, 'Elettrico ⚡', 'Automatico Single Speed', 'maserati-mc20.webp', '{"hp": "550 CV", "speed": "220 km/h", "accel": "4.1s 0-100", "seats": 5}', '100% Elettrica ⚡', true, true, true, true, true),
    ('10000000-0000-0000-0000-000000000007', 'Ferrari Purosangue V12', 'Ferrari', 'Purosangue', '6.5 V12 Aspirato 725 CV F1 AWD', 'Supercar', 2500.00, 10000.00, 5.0, 'Benzina V12 🏁', 'Automatico 8M', 'ferrari_purosangue.webp', '{"hp": "725 CV", "speed": "310 km/h", "accel": "3.3s 0-100", "seats": 4}', 'V12 Aspirato 👑', true, true, true, true, true),
    ('10000000-0000-0000-0000-000000000008', 'Alfa Romeo Stelvio Veloce', 'Alfa Romeo', 'Stelvio Veloce', '2.2 Turbo Diesel 210 CV Q4 Automatico', 'SUV Luxury', 160.00, 800.00, 4.8, 'Diesel Q4', 'Automatico AT8', 'category-suv.jpg', '{"hp": "210 CV", "speed": "215 km/h", "accel": "6.6s 0-100", "seats": 5}', 'Offerta NLT 🔥', true, true, false, true, true)
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    brand = EXCLUDED.brand, 
    model = EXCLUDED.model, 
    trim = EXCLUDED.trim, 
    category = EXCLUDED.category, 
    daily_price = EXCLUDED.daily_price,
    deposit = EXCLUDED.deposit,
    rating = EXCLUDED.rating,
    fuel_type = EXCLUDED.fuel_type, 
    transmission = EXCLUDED.transmission, 
    image_url = EXCLUDED.image_url, 
    specs = EXCLUDED.specs, 
    badge = EXCLUDED.badge,
    is_nlt = EXCLUDED.is_nlt, 
    is_nbt = EXCLUDED.is_nbt, 
    is_luxury = EXCLUDED.is_luxury, 
    is_available = EXCLUDED.is_available,
    is_active = true;

-- Inserimento Offerte NLT (Mesi x Km x Anticipi con Ricarico Broker)
INSERT INTO public.nlt_offers (vehicle_id, provider_id, provider_offer_code, duration_months, km_per_year, deposit_mandante, mandante_monthly_net, broker_markup_monthly, client_monthly_price, is_ready_delivery)
VALUES 
    -- 1. Porsche Macan (Arval)
    ('10000000-0000-0000-0000-000000000001', 'a1111111-1111-1111-1111-111111111111', 'ARV-MAC-48-15-5k', 48, 15000, 5000.00, 650.00, 49.00, 699.00, true),
    ('10000000-0000-0000-0000-000000000001', 'a1111111-1111-1111-1111-111111111111', 'ARV-MAC-48-15-3k', 48, 15000, 3000.00, 715.00, 49.00, 764.00, true),
    ('10000000-0000-0000-0000-000000000001', 'a1111111-1111-1111-1111-111111111111', 'ARV-MAC-48-15-0k', 48, 15000, 0.00, 810.00, 49.00, 859.00, true),
    
    -- 2. Audi RS6 Avant (Ayvens)
    ('10000000-0000-0000-0000-000000000002', 'c3333333-3333-3333-3333-333333333333', 'AYV-RS6-36-15-5k', 36, 15000, 5000.00, 1340.00, 80.00, 1420.00, true),
    ('10000000-0000-0000-0000-000000000002', 'c3333333-3333-3333-3333-333333333333', 'AYV-RS6-36-15-0k', 36, 15000, 0.00, 1490.00, 80.00, 1570.00, true),
    
    -- 3. Mercedes G63 AMG (Leasys)
    ('10000000-0000-0000-0000-000000000003', 'b2222222-2222-2222-2222-222222222222', 'LEA-G63-48-15-5k', 48, 15000, 5000.00, 1750.00, 90.00, 1840.00, false),
    ('10000000-0000-0000-0000-000000000003', 'b2222222-2222-2222-2222-222222222222', 'LEA-G63-48-15-0k', 48, 15000, 0.00, 1920.00, 90.00, 2010.00, false),
    
    -- 4. BMW M4 Competition (Arval)
    ('10000000-0000-0000-0000-000000000004', 'a1111111-1111-1111-1111-111111111111', 'ARV-M4-48-15-3k', 48, 15000, 3000.00, 890.00, 59.00, 949.00, true),
    ('10000000-0000-0000-0000-000000000004', 'a1111111-1111-1111-1111-111111111111', 'ARV-M4-48-15-0k', 48, 15000, 0.00, 970.00, 59.00, 1029.00, true),
    
    -- 5. Range Rover Sport (Leasys)
    ('10000000-0000-0000-0000-000000000005', 'b2222222-2222-2222-2222-222222222222', 'LEA-RRS-48-20-3k', 48, 20000, 3000.00, 920.00, 60.00, 980.00, true),
    
    -- 6. Maserati Grecale Folgore (Ayvens)
    ('10000000-0000-0000-0000-000000000006', 'c3333333-3333-3333-3333-333333333333', 'AYV-GRE-36-15-3k', 36, 15000, 3000.00, 780.00, 55.00, 835.00, true),
    
    -- 7. Ferrari Purosangue (Flotta Diretta / VIP Network)
    ('10000000-0000-0000-0000-000000000007', 'd4444444-4444-4444-4444-444444444444', 'ITE-PUR-24-10-5k', 24, 10000, 15000.00, 3800.00, 200.00, 4000.00, true),
    
    -- 8. Alfa Romeo Stelvio Veloce (Arval - entry luxury)
    ('10000000-0000-0000-0000-000000000008', 'a1111111-1111-1111-1111-111111111111', 'ARV-STE-48-15-3k', 48, 15000, 3000.00, 480.00, 39.00, 519.00, true),
    ('10000000-0000-0000-0000-000000000008', 'a1111111-1111-1111-1111-111111111111', 'ARV-STE-48-15-0k', 48, 15000, 0.00, 560.00, 39.00, 599.00, true)
ON CONFLICT DO NOTHING;

-- Inserimento Offerte Breve Termine NBT
INSERT INTO public.nbt_offers (vehicle_id, provider_id, daily_price, deposit_required, km_daily_limit)
VALUES 
    ('10000000-0000-0000-0000-000000000001', 'd4444444-4444-4444-4444-444444444444', 350.00, 1500.00, 200),
    ('10000000-0000-0000-0000-000000000002', 'd4444444-4444-4444-4444-444444444444', 750.00, 3000.00, 150),
    ('10000000-0000-0000-0000-000000000003', 'd4444444-4444-4444-4444-444444444444', 950.00, 4000.00, 150),
    ('10000000-0000-0000-0000-000000000004', 'd4444444-4444-4444-4444-444444444444', 650.00, 2500.00, 200),
    ('10000000-0000-0000-0000-000000000007', 'd4444444-4444-4444-4444-444444444444', 2500.00, 10000.00, 100),
    ('10000000-0000-0000-0000-000000000008', 'd4444444-4444-4444-4444-444444444444', 160.00, 800.00, 250)
ON CONFLICT DO NOTHING;


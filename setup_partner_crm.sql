-- =========================================================================================
-- ITERCARS — SAAS MULTI-TENANT PARTNER CRM DATABASE SETUP
-- Espansione per Console Mandanti, SRL, Concessionari e Autonoleggi (`crm-partner.html`)
-- =========================================================================================
-- Istruzioni per l'Esecuzione:
-- 1. Copia l'intero testo di questo script.
-- 2. Accedi alla Dashboard del tuo progetto Supabase.
-- 3. Clicca su "SQL Editor" nella barra laterale sinistra e apri una Nuova Query.
-- 4. Incolla questo codice e clicca sul bottone "Run".
-- =========================================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================================
-- 1. ESPANSIONE TABELLA MANDANTI / AZIENDE PARTNER (`public.providers`)
-- =========================================================================================
-- Aggiungiamo le colonne necessarie al login e alle impostazioni della Console Partner
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS access_pin VARCHAR(50); -- PIN rapido o Token (es. PARTNER-SRL-2026)
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS partner_email VARCHAR(255); -- Email per login dedicato
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS partner_password VARCHAR(255); -- Password del partner
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS logo_url TEXT; -- Logo aziendale (mostrato nei preventivi PDF)
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS company_vat VARCHAR(100); -- Partita IVA o Codice Fiscale
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS saas_plan VARCHAR(50) DEFAULT 'pro_partner'; -- 'starter', 'pro_partner', 'enterprise'
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS default_deposit NUMERIC(10,2) DEFAULT 1500.00; -- Cauzione standard del partner
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS address TEXT; -- Sede o zona di ritiro veicoli
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS contact_name VARCHAR(255); -- Nome referente
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50); -- Telefono aziendale / referente
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS auth_id UUID; -- ID Autenticazione crittografato Supabase
ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS fleet_count INTEGER DEFAULT 0; -- Contatore auto attive

-- Rendiamo univoci PIN e Email dove presenti
CREATE UNIQUE INDEX IF NOT EXISTS idx_providers_access_pin ON public.providers (access_pin) WHERE access_pin IS NOT NULL AND access_pin != '';
CREATE INDEX IF NOT EXISTS idx_providers_partner_email ON public.providers (partner_email);

-- =========================================================================================
-- 2. TABELLA CARICAMENTI EXCEL / CSV & FOTO AI (`public.import_jobs`)
-- =========================================================================================
CREATE TABLE IF NOT EXISTS public.import_jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT,
    status VARCHAR(50) DEFAULT 'completed', -- 'pending_ai', 'processing', 'completed', 'failed'
    total_rows INTEGER DEFAULT 0,
    ai_photos_generated INTEGER DEFAULT 0,
    log_messages JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.import_jobs ADD COLUMN IF NOT EXISTS ai_photos_generated INTEGER DEFAULT 0;
ALTER TABLE public.import_jobs ADD COLUMN IF NOT EXISTS log_messages JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.import_jobs ADD COLUMN IF NOT EXISTS file_url TEXT;
ALTER TABLE public.import_jobs ADD COLUMN IF NOT EXISTS file_data TEXT;

-- =========================================================================================
-- 3. ESPANSIONE E ARMONIZZAZIONE VEICOLI MULTI-TENANT (`public.vehicles`)
-- =========================================================================================
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS import_job_id UUID REFERENCES public.import_jobs(id) ON DELETE SET NULL;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS partner_notes TEXT; -- Annotazioni private del noleggiatore
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS ai_studio_generated BOOLEAN DEFAULT false; -- Vero se la foto è stata generata da AI
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'approved'; -- Stato approvazione ('pending_approval', 'approved', 'rejected')
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS approval_date TIMESTAMP WITH TIME ZONE;

-- Assicura l'indice su provider_id e status per garantire query istantanee in RLS e moderazione broker
CREATE INDEX IF NOT EXISTS idx_vehicles_provider_id ON public.vehicles (provider_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles (status);

-- =========================================================================================
-- 4. ESPANSIONE PRENOTAZIONI & CONTRATTI COLLEGATI AL MANDANTE (`public.bookings` e `crm_leads`)
-- =========================================================================================
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS partner_contract_url TEXT; -- URL del contratto PDF firmato con il cliente
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS partner_notes TEXT;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS rental_country VARCHAR(100) DEFAULT 'Italia'; -- Paese del noleggio (es. Italia, Regno Unito)

ALTER TABLE public.crm_leads ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON public.bookings (provider_id);
CREATE INDEX IF NOT EXISTS idx_crm_leads_provider_id ON public.crm_leads (provider_id);

ALTER TABLE public.import_jobs ADD COLUMN IF NOT EXISTS file_data TEXT; -- Contiene il file Excel/CSV (Base64) per il download dalla Console Centrale

-- =========================================================================================
-- 5. ABILITAZIONE SICUREZZA RLS & POLITICHE PER LA CONSOLE PARTNER
-- =========================================================================================
ALTER TABLE public.import_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nlt_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nbt_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lettura e inserimento import_jobs" ON public.import_jobs;
CREATE POLICY "Lettura e inserimento import_jobs" ON public.import_jobs FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permetti gestione totale su vehicles per partner" ON public.vehicles;
CREATE POLICY "Permetti gestione totale su vehicles per partner" ON public.vehicles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permetti gestione totale su nlt_offers" ON public.nlt_offers;
CREATE POLICY "Permetti gestione totale su nlt_offers" ON public.nlt_offers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permetti gestione totale su nbt_offers" ON public.nbt_offers;
CREATE POLICY "Permetti gestione totale su nbt_offers" ON public.nbt_offers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Permetti gestione totale su providers" ON public.providers;
CREATE POLICY "Permetti gestione totale su providers" ON public.providers FOR ALL USING (auth.uid() = auth_id OR auth.role() = 'service_role') WITH CHECK (auth.uid() = auth_id OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Permetti gestione totale su bookings" ON public.bookings;
CREATE POLICY "Permetti gestione totale su bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);

-- =========================================================================================
-- 6. INSERIMENTO CREdENZIALI DI ESEMPIO: 2 AZIENDE PARTNER SAAS (SRL E CONCESSIONARIO)
-- =========================================================================================

INSERT INTO public.providers (
    id, code, name, provider_type, access_pin, partner_email, partner_password, 
    logo_url, company_vat, saas_plan, default_deposit, default_markup_type, default_markup_value, address, is_active
) VALUES 
    (
        'e5555555-5555-5555-5555-555555555555', 
        'partner_srl_1', 
        'Toribio Rent & Drive S.R.L.', 
        'flotta_proprietaria', 
        'PARTNER-SRL-2026', 
        'srl@toribiomoters.it', 
        'Segreta2026!', 
        'logo_tricolore.png', 
        'IT12345670158', 
        'pro_partner', 
        1500.00, 
        'percentage', 
        15.00, 
        'Via Montenapoleone 18, Milano (MI)', 
        true
    ),
    (
        'f6666666-6666-6666-6666-666666666666', 
        'partner_luxury_2', 
        'Elite Supercars Club Italia', 
        'flotta_proprietaria', 
        'PARTNER-LUXURY-2026', 
        'info@elitesupercars.it', 
        'LuxuryClub2026!', 
        'logo-wheel.png', 
        'IT98765430159', 
        'enterprise', 
        3500.00, 
        'fixed_monthly', 
        80.00, 
        'Viale del Muro Torto 12, Roma (RM)', 
        true
    )
ON CONFLICT (id) DO UPDATE SET 
    access_pin = EXCLUDED.access_pin,
    partner_email = EXCLUDED.partner_email,
    partner_password = EXCLUDED.partner_password,
    logo_url = EXCLUDED.logo_url,
    company_vat = EXCLUDED.company_vat,
    saas_plan = EXCLUDED.saas_plan,
    default_deposit = EXCLUDED.default_deposit,
    address = EXCLUDED.address,
    is_active = true;

-- =========================================================================================
-- 7. INSERIMENTO VEICOLI INIZIALI ASSEGNATI AI 2 PARTNER DEMO
-- =========================================================================================

INSERT INTO public.vehicles (
    id, provider_id, brand, model, trim, name, category, daily_price, deposit, rating, 
    fuel_type, transmission, image_url, specs, badge, is_nbt, is_nlt, is_luxury, is_available, is_active, ai_studio_generated
) VALUES 
    -- 1. Veicoli di Toribio Rent & Drive S.R.L. (provider: e5555555...)
    (
        '20000000-0000-0000-0000-000000000001',
        'e5555555-5555-5555-5555-555555555555',
        'BMW',
        'Serie 1',
        'M Sport 120i 178CV Automatic',
        'BMW Serie 1 M Sport 120i',
        'Sportiva',
        110.00,
        1000.00,
        4.9,
        'Benzina Turbo',
        'Automatico Steptronic',
        'bmw_serie_1_msport.webp',
        '{"hp": "178 CV", "speed": "235 km/h", "accel": "7.0s 0-100", "seats": 5}'::jsonb,
        'Pronta Consegna ⚡',
        true, true, false, true, true, false
    ),
    (
        '20000000-0000-0000-0000-000000000002',
        'e5555555-5555-5555-5555-555555555555',
        'Audi',
        'Q8 S-Line',
        '50 TDI quattro 286CV Tiptronic',
        'Audi Q8 S-Line 50 TDI',
        'SUV Luxury',
        220.00,
        2000.00,
        5.0,
        'Diesel Mild-Hybrid',
        'Automatico 8 Marce',
        'audi_q8_sline.webp',
        '{"hp": "286 CV", "speed": "245 km/h", "accel": "6.1s 0-100", "seats": 5}'::jsonb,
        'Super Esclusiva ✨',
        true, true, true, true, true, false
    ),
    (
        '20000000-0000-0000-0000-000000000003',
        'e5555555-5555-5555-5555-555555555555',
        'Maserati',
        'Levante',
        'Modena GT Hybrid 330CV AWD',
        'Maserati Levante Modena GT',
        'SUV Luxury',
        280.00,
        2500.00,
        4.9,
        'Ibrido Benzina',
        'Automatico AT8',
        'maserati_levante.webp',
        '{"hp": "330 CV", "speed": "245 km/h", "accel": "6.0s 0-100", "seats": 5}'::jsonb,
        'Luxury SUV 🔥',
        true, true, true, false, true, false -- Impostato inizialmente come Sospeso per far provare il tasto Toggle al partner!
    ),

    -- 2. Veicoli di Elite Supercars Club Italia (provider: f6666666...)
    (
        '30000000-0000-0000-0000-000000000001',
        'f6666666-6666-6666-6666-666666666666',
        'Ferrari',
        '296 GTS',
        'Spider V6 Hybrid Plug-in 830 CV F1',
        'Ferrari 296 GTS Spider',
        'Supercar',
        1800.00,
        8000.00,
        5.0,
        'Ibrido V6 ⚡',
        'Automatico F1 8M',
        'ferrari-296-gts.webp',
        '{"hp": "830 CV", "speed": "330 km/h", "accel": "2.9s 0-100", "seats": 2}'::jsonb,
        'V6 Spider 830CV 👑',
        true, false, true, true, true, false
    ),
    (
        '30000000-0000-0000-0000-000000000002',
        'f6666666-6666-6666-6666-666666666666',
        'Lamborghini',
        'Revuelto',
        'V12 HPEV High Performance Electrified 1015 CV',
        'Lamborghini Revuelto V12',
        'Supercar',
        2800.00,
        12000.00,
        5.0,
        'Ibrido V12 🔥',
        'Automatico DCT 8 Marce',
        'lamborghini-revuelto.webp',
        '{"hp": "1015 CV", "speed": "350 km/h", "accel": "2.5s 0-100", "seats": 2}'::jsonb,
        'V12 1015 CV 🚀',
        true, false, true, true, true, true -- Segnato come foto AI ad alta definizione generata dallo studio!
    )
ON CONFLICT (id) DO UPDATE SET 
    provider_id = EXCLUDED.provider_id,
    brand = EXCLUDED.brand,
    model = EXCLUDED.model,
    trim = EXCLUDED.trim,
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    daily_price = EXCLUDED.daily_price,
    deposit = EXCLUDED.deposit,
    image_url = EXCLUDED.image_url,
    specs = EXCLUDED.specs,
    badge = EXCLUDED.badge,
    is_available = EXCLUDED.is_available,
    is_active = true;

-- =========================================================================================
-- 8. INSERIMENTO PRENOTAZIONI DEMO ASSEGNATE ALLA CONSOLE PARTNER (Toribio Rent S.R.L.)
-- =========================================================================================
INSERT INTO public.bookings (
    id, provider_id, vehicle_id, vehicle_name, client_name, client_phone, client_email, 
    pickup_location, rental_days, total_price, status, rental_country
) VALUES 
    (
        '40000000-0000-0000-0000-000000000001',
        'e5555555-5555-5555-5555-555555555555',
        '20000000-0000-0000-0000-000000000001',
        'BMW Serie 1 M Sport 120i',
        'Avv. Marco Rossi',
        '+39 347 9988771',
        'm.rossi@studiolegale.it',
        'Milano Centro - Linate Aeroporto',
        3,
        330.00,
        'confirmed',
        'Italia'
    ),
    (
        '40000000-0000-0000-0000-000000000002',
        'e5555555-5555-5555-5555-555555555555',
        '20000000-0000-0000-0000-000000000002',
        'Audi Q8 S-Line 50 TDI',
        'Dott.ssa Giulia Bianchi (CEO Tech Srl)',
        '+39 338 1122334',
        'g.bianchi@techinnovation.it',
        'Roma Fiumicino Aeroporto (FCO)',
        5,
        1100.00,
        'pending',
        'Italia'
    ),
    (
        '40000000-0000-0000-0000-000000000003',
        'f6666666-6666-6666-6666-666666666666',
        '30000000-0000-0000-0000-000000000001',
        'Ferrari 296 GTS Spider',
        'Lord Arthur Pendelton (VIP Guests)',
        '+44 7700 900077',
        'arthur.p@privatebanking.co.uk',
        'Villa d''Este - Lago di Como',
        2,
        3600.00,
        'confirmed',
        'Regno Unito'
    )
ON CONFLICT (id) DO UPDATE SET 
    provider_id = EXCLUDED.provider_id,
    vehicle_id = EXCLUDED.vehicle_id,
    client_name = EXCLUDED.client_name,
    status = EXCLUDED.status,
    total_price = EXCLUDED.total_price;

-- Aggiorniamo il contatore flotta di ciascun provider
UPDATE public.providers p
SET fleet_count = (SELECT COUNT(*) FROM public.vehicles v WHERE v.provider_id = p.id AND v.is_active = true)
WHERE p.id IN ('e5555555-5555-5555-5555-555555555555', 'f6666666-6666-6666-6666-666666666666');


-- AGGIORNAMENTI PER SICUREZZA MASSIMA
ALTER TABLE public.supplier_applications ADD COLUMN IF NOT EXISTS auth_id UUID;

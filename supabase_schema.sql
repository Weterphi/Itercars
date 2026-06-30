-- ==========================================================================
-- ITERCARS — SUPABASE DATABASE SCHEMA
-- Hub per Noleggio Auto di Lusso e Standard con supporto API Fornitori
-- ==========================================================================

-- Abilita estensione UUID se non presente
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TABELLA FORNITORI / PARTNER API (Providers)
-- Ospita i dati e le credenziali di integrazione API dei fornitori esterni
CREATE TABLE IF NOT EXISTS public.providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    provider_type VARCHAR(50) DEFAULT 'external_api', -- 'internal_fleet', 'external_api', 'broker'
    api_endpoint TEXT,
    api_key_ref VARCHAR(255), -- Riferimento sicuro a secret manager per chiave API
    contact_email VARCHAR(255),
    commission_rate NUMERIC(5,2) DEFAULT 15.00, -- Percentuale trattenuta dal marketplace
    rating NUMERIC(3,1) DEFAULT 5.0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. TABELLA VEICOLI (Vehicles)
-- Flotta centralizzata che unisce auto proprietarie e auto importate da API esterne
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
    external_vehicle_id VARCHAR(100), -- ID dell'auto nel sistema del fornitore esterno
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    category VARCHAR(50) NOT NULL, -- 'Supercar', 'SUV', 'Sportiva', 'Elettrica', 'Berlina', 'Economica'
    daily_price NUMERIC(10,2) NOT NULL,
    deposit NUMERIC(10,2) DEFAULT 0.00,
    rating NUMERIC(3,1) DEFAULT 5.0,
    image_url TEXT NOT NULL,
    specs JSONB DEFAULT '{"speed": "250 km/h", "accel": "4.5s 0-100", "hp": "400 CV", "seats": 4, "transmission": "Automatico"}'::jsonb,
    badge VARCHAR(50) DEFAULT 'Esclusiva ✨',
    is_luxury BOOLEAN DEFAULT true,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. TABELLA PRENOTAZIONI & PREVENTIVI (Bookings)
-- Traccia le richieste dei clienti e lo stato di sincronizzazione con i fornitori
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
    vehicle_name VARCHAR(255) NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(100) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    pickup_location VARCHAR(255),
    rental_country VARCHAR(100) DEFAULT 'Italia',
    pickup_date DATE,
    return_date DATE,
    rental_days INTEGER DEFAULT 1,
    extra_services JSONB DEFAULT '[]'::jsonb,
    total_price NUMERIC(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'completed', -- 'pending', 'confirmed_by_provider', 'cancelled', 'completed'
    external_booking_ref VARCHAR(100), -- Codice di conferma restituito dalle API del fornitore
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. ABILITAZIONE ROW LEVEL SECURITY (RLS) & POLITICHE PUBBLICHE (Per lettura flotta e invio lead)
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Politica per consentire la lettura pubblica dei fornitori attivi e veicoli disponibili
DROP POLICY IF EXISTS "Lettura pubblica veicoli disponibili" ON public.vehicles;
CREATE POLICY "Lettura pubblica veicoli disponibili" ON public.vehicles
    FOR SELECT USING (is_available = true);

DROP POLICY IF EXISTS "Lettura pubblica fornitori" ON public.providers;
CREATE POLICY "Lettura pubblica fornitori" ON public.providers
    FOR SELECT USING (is_active = true);

-- Politica per consentire a chiunque (anon) di inserire una nuova prenotazione dal modulo web
DROP POLICY IF EXISTS "Inserimento prenotazioni anonimo" ON public.bookings;
CREATE POLICY "Inserimento prenotazioni anonimo" ON public.bookings
    FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Lettura prenotazioni" ON public.bookings;
CREATE POLICY "Lettura prenotazioni" ON public.bookings
    FOR SELECT USING (true);

-- ==========================================================================
-- DATI INIZIALI DI ESEMPIO (SEED DATA)
-- ==========================================================================

-- Inserimento Fornitore Proprietario & Fornitore Esterno API
INSERT INTO public.providers (id, name, provider_type, contact_email)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'ITERCARS Flotta Diretta', 'internal_fleet', 'flotta@itercars.com'),
    ('22222222-2222-2222-2222-222222222222', 'EuroPrestige API Network', 'external_api', 'api-booking@europrestige.com')
ON CONFLICT DO NOTHING;

-- Inserimento Veicoli di Lusso & Standard
INSERT INTO public.vehicles (provider_id, name, brand, model, category, daily_price, rating, image_url, specs, badge, is_luxury)
VALUES 
    ('11111111-1111-1111-1111-111111111111', 'Ferrari F8 Tributo', 'Ferrari', 'F8 Tributo', 'Supercar', 1400.00, 4.9, 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=800&q=80', '{"speed": "340 km/h", "accel": "2.9s 0-100", "hp": "720 CV"}', 'Popolare 🔥', true),
    ('22222222-2222-2222-2222-222222222222', 'Lamborghini Revuelto', 'Lamborghini', 'Revuelto', 'Supercar', 1800.00, 5.0, 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=800&q=80', '{"speed": "350 km/h", "accel": "2.5s 0-100", "hp": "1015 CV"}', 'Nuovo Arrivo ✨', true),
    ('11111111-1111-1111-1111-111111111111', 'Porsche 911 GT3 RS', 'Porsche', '911 GT3 RS', 'Sportiva', 1100.00, 4.8, 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80', '{"speed": "296 km/h", "accel": "3.2s 0-100", "hp": "525 CV"}', 'Pista & Strada 🏁', true),
    ('22222222-2222-2222-2222-222222222222', 'Mercedes-AMG G 63', 'Mercedes-Benz', 'AMG G 63', 'SUV', 950.00, 4.9, 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=800&q=80', '{"speed": "220 km/h", "accel": "4.5s 0-100", "hp": "585 CV"}', 'VIP Choice 👑', true),
    ('11111111-1111-1111-1111-111111111111', 'Rolls-Royce Cullinan', 'Rolls-Royce', 'Cullinan', 'SUV', 2200.00, 5.0, 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&w=800&q=80', '{"speed": "250 km/h", "accel": "5.2s 0-100", "hp": "571 CV"}', 'Lusso Estremo 💎', true),
    ('22222222-2222-2222-2222-222222222222', 'Rimac Nevera / Taycan', 'Rimac', 'Nevera', 'Elettrica', 1300.00, 4.9, 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80', '{"speed": "412 km/h", "accel": "1.9s 0-100", "hp": "1914 CV"}', '100% Elettrica ⚡', true),
    ('22222222-2222-2222-2222-222222222222', 'Audi RS6 Avant', 'Audi', 'RS6', 'Sportiva', 750.00, 4.9, 'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?auto=format&fit=crop&w=800&q=80', '{"speed": "305 km/h", "accel": "3.6s 0-100", "hp": "600 CV"}', 'Partner API 🔌', true),
    ('22222222-2222-2222-2222-222222222222', 'BMW M3 Competition', 'BMW', 'M3', 'Berlina', 650.00, 4.8, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80', '{"speed": "290 km/h", "accel": "3.9s 0-100", "hp": "510 CV"}', 'Smart Deal 💼', false)
ON CONFLICT DO NOTHING;

-- ==========================================================================
-- 5. TABELLA UTENTI / PROFILI (Users & VIP Benefits)
-- Sincronizzata con Supabase Auth per la gestione dell'Area Riservata
-- ==========================================================================
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE,
    country VARCHAR(100),
    phone VARCHAR(100),
    email VARCHAR(255) UNIQUE NOT NULL,
    vip_level VARCHAR(50) DEFAULT 'Silver Member', -- 'Silver Member', 'Gold VIP', 'Platinum Ambassador'
    discount_rate NUMERIC(5,2) DEFAULT 5.00, -- 5% sconto base per gli iscritti
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Politiche di sicurezza per utenti
DROP POLICY IF EXISTS "Utenti leggono il proprio profilo" ON public.users;
CREATE POLICY "Utenti leggono il proprio profilo" ON public.users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Utenti aggiornano il proprio profilo" ON public.users;
CREATE POLICY "Utenti aggiornano il proprio profilo" ON public.users
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Inserimento profilo post-registrazione" ON public.users;
CREATE POLICY "Inserimento profilo post-registrazione" ON public.users
    FOR INSERT WITH CHECK (true);

-- Trigger automatico per sincronizzare auth.users con public.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, first_name, last_name, birth_date, country, phone, email, vip_level)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'first_name', 'Utente'),
    COALESCE(new.raw_user_meta_data->>'last_name', 'VIP'),
    NULLIF(new.raw_user_meta_data->>'birth_date', '')::date,
    COALESCE(new.raw_user_meta_data->>'country', 'Italia'),
    COALESCE(new.raw_user_meta_data->>'phone', ''),
    new.email,
    'Silver Member 👑'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==========================================
-- SCRIPT SQL: SETUP DATABASE ITERCARS CRM
-- ==========================================
-- Istruzioni:
-- 1. Copia tutto questo testo.
-- 2. Vai nella tua dashboard di Supabase.
-- 3. Clicca su "SQL Editor" nel menu a sinistra.
-- 4. Clicca "New query" e incolla questo testo.
-- 5. Clicca su "Run" per eseguire lo script.
-- ==========================================

-- 1. TABELLA: PRENOTAZIONI BREVE TERMINE (bookings)
CREATE TABLE IF NOT EXISTS public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    vehicle_name TEXT,
    client_name TEXT,
    client_phone TEXT,
    client_email TEXT,
    pickup_location TEXT,
    rental_days INTEGER DEFAULT 1,
    total_price NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'pending',
    rental_country TEXT,
    user_id UUID -- Opzionale, per collegare l'utente registrato
);

-- 2. TABELLA: CRM LEADS (crm_leads)
CREATE TABLE IF NOT EXISTS public.crm_leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    vehicle_interest TEXT,
    customer_type TEXT,
    notes TEXT,
    pipeline_status TEXT DEFAULT 'new',
    assigned_to TEXT
);

-- 3. TABELLA: CANDIDATURE FORNITORI FLOTTA (supplier_applications)
CREATE TABLE IF NOT EXISTS public.supplier_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    company_name TEXT,
    referent_name TEXT,
    email TEXT,
    phone TEXT,
    fleet_size TEXT,
    city TEXT,
    models TEXT,
    recipient_email TEXT,
    status TEXT DEFAULT 'new'
);

-- 4. TABELLA: RICHIESTE DISPONIBILITA' (availability_requests)
CREATE TABLE IF NOT EXISTS public.availability_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT,
    phone TEXT,
    email TEXT,
    notes TEXT,
    location TEXT,
    dates TEXT,
    category TEXT,
    status TEXT DEFAULT 'new'
);

-- ==========================================
-- REGOLE DI SICUREZZA (Row Level Security)
-- ==========================================
-- Abilitiamo RLS sulle tabelle
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_requests ENABLE ROW LEVEL SECURITY;

-- Creiamo policy per permettere agli utenti anonimi (il sito web) di INSERIRE nuovi dati
CREATE POLICY "Permetti inserimento anonimo su bookings" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Permetti inserimento anonimo su supplier_applications" ON public.supplier_applications FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Permetti inserimento anonimo su availability_requests" ON public.availability_requests FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Permetti inserimento anonimo su crm_leads" ON public.crm_leads FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Creiamo policy per permettere agli amministratori o utenti autenticati di LEGGERE e MODIFICARE i dati
-- Nota: In produzione questo andrebbe ristretto solo agli admin. Per ora apriamo la lettura a tutti per far funzionare il CRM.
CREATE POLICY "Permetti gestione totale su bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permetti gestione totale su crm_leads" ON public.crm_leads FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permetti gestione totale su supplier_applications" ON public.supplier_applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permetti gestione totale su availability_requests" ON public.availability_requests FOR ALL USING (true) WITH CHECK (true);

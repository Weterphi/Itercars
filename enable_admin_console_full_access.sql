-- ==============================================================================
-- ITERCARS — ABILITAZIONE ACCESSO COMPLETO (CRUD) DALLA CONSOLE ADMIN SQL
-- Risolve definitivamente i problemi di eliminazione, aggiunta e modifica prezzo
-- dovuti a Row Level Security (RLS) e ai vincoli di Foreign Key.
-- ==============================================================================

-- 1. ABILITAZIONE E CREAZIONE DI POLICY APERTE SU TUTTE LE TABELLE PRINCIPALI
-- Consente a `SUPABASE_ANON_KEY` (usata da crm-admin.js) di fare SELECT, INSERT, UPDATE ed ELIMINARE.

-- A) TABELLA VEHICLES (Vetture Flotta e Listino)
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow public read access" ON public.vehicles;
DROP POLICY IF EXISTS "Full access for all" ON public.vehicles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.vehicles;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.vehicles;
DROP POLICY IF EXISTS "Enable update for all users" ON public.vehicles;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.vehicles;
CREATE POLICY "Full access for all on vehicles" ON public.vehicles FOR ALL USING (true) WITH CHECK (true);

-- B) TABELLA NLT_OFFERS (Offerte Lungo Termine collegate alle auto)
ALTER TABLE public.nlt_offers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Full access for all on nlt_offers" ON public.nlt_offers;
CREATE POLICY "Full access for all on nlt_offers" ON public.nlt_offers FOR ALL USING (true) WITH CHECK (true);

-- C) TABELLA NBT_OFFERS (Offerte Breve Termine collegate alle auto)
ALTER TABLE public.nbt_offers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Full access for all on nbt_offers" ON public.nbt_offers;
CREATE POLICY "Full access for all on nbt_offers" ON public.nbt_offers FOR ALL USING (true) WITH CHECK (true);

-- D) TABELLA PROVIDERS (Mandanti e Fornitori)
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Full access for all on providers" ON public.providers;
CREATE POLICY "Full access for all on providers" ON public.providers FOR ALL USING (true) WITH CHECK (true);

-- E) TABELLA CRM_LEADS (Anagrafica Clienti CRM)
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Full access for all on crm_leads" ON public.crm_leads;
CREATE POLICY "Full access for all on crm_leads" ON public.crm_leads FOR ALL USING (true) WITH CHECK (true);

-- F) TABELLA CRM_DOCUMENTS (Documenti caricati dal cliente)
ALTER TABLE public.crm_documents ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Full access for all on crm_documents" ON public.crm_documents;
CREATE POLICY "Full access for all on crm_documents" ON public.crm_documents FOR ALL USING (true) WITH CHECK (true);

-- G) TABELLA QUOTES (Preventivi)
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Full access for all on quotes" ON public.quotes;
CREATE POLICY "Full access for all on quotes" ON public.quotes FOR ALL USING (true) WITH CHECK (true);

-- H) TABELLA BOOKINGS (Prenotazioni Noleggio)
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Full access for all on bookings" ON public.bookings;
CREATE POLICY "Full access for all on bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);

-- I) TABELLA SUPPLIER_APPLICATIONS & AVAILABILITY_REQUESTS
ALTER TABLE public.supplier_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Full access for all on supplier_applications" ON public.supplier_applications;
CREATE POLICY "Full access for all on supplier_applications" ON public.supplier_applications FOR ALL USING (true) WITH CHECK (true);

ALTER TABLE public.availability_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Full access for all on availability_requests" ON public.availability_requests;
CREATE POLICY "Full access for all on availability_requests" ON public.availability_requests FOR ALL USING (true) WITH CHECK (true);


-- 2. AGGIORNAMENTO VINCOLI FOREIGN KEY IN CON CASCATA (ON DELETE CASCADE)
-- In questo modo quando elimini una vettura da `public.vehicles`, le offerte (nlt_offers/nbt_offers)
-- o preventivi collegati a quell'ID vengono rimossi automaticamente senza generare errore di blocco FK.

DO $$
BEGIN
    -- Rimuovi vecchie FK se esistono e aggiungi con ON DELETE CASCADE per nlt_offers
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'nlt_offers_vehicle_id_fkey') THEN
        ALTER TABLE public.nlt_offers DROP CONSTRAINT nlt_offers_vehicle_id_fkey;
    END IF;
    ALTER TABLE public.nlt_offers ADD CONSTRAINT nlt_offers_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;

    -- FK per nbt_offers
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'nbt_offers_vehicle_id_fkey') THEN
        ALTER TABLE public.nbt_offers DROP CONSTRAINT nbt_offers_vehicle_id_fkey;
    END IF;
    ALTER TABLE public.nbt_offers ADD CONSTRAINT nbt_offers_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;

    -- FK per quotes
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'quotes_vehicle_id_fkey') THEN
        ALTER TABLE public.quotes DROP CONSTRAINT quotes_vehicle_id_fkey;
    END IF;
    ALTER TABLE public.quotes ADD CONSTRAINT quotes_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;

    -- FK per bookings
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'bookings_vehicle_id_fkey') THEN
        ALTER TABLE public.bookings DROP CONSTRAINT bookings_vehicle_id_fkey;
    END IF;
    ALTER TABLE public.bookings ADD CONSTRAINT bookings_vehicle_id_fkey FOREIGN KEY (vehicle_id) REFERENCES public.vehicles(id) ON DELETE CASCADE;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Avviso durante aggiornamento FK cascade: %', SQLERRM;
END $$;

-- 3. PERMESSI PUBBLICI ALLO SCHEMA
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- =========================================================================================
-- MASSIMA SICUREZZA CONSOLE BROKER (CRM ADMIN)
-- Istruzioni per l'Esecuzione:
-- 1. Copia l'intero testo di questo script.
-- 2. Apri la tua Dashboard Supabase -> SQL Editor.
-- 3. Incolla il codice e clicca su "Run".
-- =========================================================================================

-- 1. Creazione della Tabella degli Amministratori Eletti
CREATE TABLE IF NOT EXISTS public.broker_admins (
    email VARCHAR(255) PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Inseriamo gli amministratori di default
INSERT INTO public.broker_admins (email) VALUES 
('amministrazione@itercars.it'),
('ceotoribio@itercars.com'),
('admin@itercars.com')
ON CONFLICT (email) DO NOTHING;

-- 2. Creazione della Funzione di Sicurezza (Controlla se l'utente loggato è admin)
CREATE OR REPLACE FUNCTION is_admin() 
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.broker_admins WHERE email = (auth.jwt() ->> 'email')
  );
END;
$$;

-- 3. Abilitazione della Lettura Pubblica alla Tabella Admins 
-- (Serve per il controllo frontend, ma non si può modificare dal frontend)
ALTER TABLE public.broker_admins ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permetti lettura agli admin" ON public.broker_admins;
CREATE POLICY "Permetti lettura agli admin" ON public.broker_admins FOR SELECT USING (true);


-- =========================================================================================
-- 4. AGGIORNAMENTO SCUDI (RLS POLICIES) PER TUTTE LE TABELLE DEL CRM
--    Gli amministratori (is_admin() = true) avranno ora POTERE ASSOLUTO.
-- =========================================================================================

-- Gestione totale per i provider
DROP POLICY IF EXISTS "Permetti gestione totale su providers" ON public.providers;
CREATE POLICY "Permetti gestione totale su providers" ON public.providers 
FOR ALL USING (
  is_admin() OR auth.uid() = auth_id OR auth.role() = 'service_role'
) WITH CHECK (
  is_admin() OR auth.uid() = auth_id OR auth.role() = 'service_role'
);

-- Gestione totale per i veicoli
DROP POLICY IF EXISTS "Permetti gestione totale su vehicles per partner" ON public.vehicles;
CREATE POLICY "Permetti gestione totale su vehicles per partner" ON public.vehicles 
FOR ALL USING (
  is_admin() OR (auth.uid() IN (SELECT auth_id FROM public.providers WHERE id = provider_id)) OR provider_id IS NULL OR auth.role() = 'service_role'
) WITH CHECK (
  is_admin() OR (auth.uid() IN (SELECT auth_id FROM public.providers WHERE id = provider_id)) OR provider_id IS NULL OR auth.role() = 'service_role'
);

-- Gestione totale per le richieste pendenti
ALTER TABLE public.supplier_applications ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Lettura e modifica applicazioni" ON public.supplier_applications;
CREATE POLICY "Lettura e modifica applicazioni" ON public.supplier_applications 
FOR ALL USING (
  is_admin() OR auth.uid() = auth_id OR auth.role() = 'service_role'
) WITH CHECK (
  is_admin() OR auth.uid() = auth_id OR auth.role() = 'service_role'
);

-- Le offerte pubbliche NLT/NBT restano aperte in lettura, ma modificate solo dagli admin
DROP POLICY IF EXISTS "Permetti gestione totale su nlt_offers" ON public.nlt_offers;
CREATE POLICY "Permetti gestione totale su nlt_offers" ON public.nlt_offers 
FOR ALL USING (true) WITH CHECK (is_admin() OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Permetti gestione totale su nbt_offers" ON public.nbt_offers;
CREATE POLICY "Permetti gestione totale su nbt_offers" ON public.nbt_offers 
FOR ALL USING (true) WITH CHECK (is_admin() OR auth.role() = 'service_role');

-- Le prenotazioni possono essere gestite dagli admin o dal rispettivo partner
DROP POLICY IF EXISTS "Permetti gestione totale su bookings" ON public.bookings;
CREATE POLICY "Permetti gestione totale su bookings" ON public.bookings 
FOR ALL USING (
  is_admin() OR (auth.uid() IN (SELECT auth_id FROM public.providers WHERE id = provider_id)) OR provider_id IS NULL OR auth.role() = 'service_role'
) WITH CHECK (
  is_admin() OR (auth.uid() IN (SELECT auth_id FROM public.providers WHERE id = provider_id)) OR provider_id IS NULL OR auth.role() = 'service_role'
);

-- =========================================================================================
-- FUNZIONE DI SISTEMA: ANNIENTA PROFILO PARTNER E TUTTI I DATI COLLEGATI
-- Istruzioni per l'Esecuzione:
-- 1. Copia l'intero testo di questo script.
-- 2. Accedi alla Dashboard del tuo progetto Supabase -> SQL Editor.
-- 3. Incolla e clicca su "Run".
-- =========================================================================================

CREATE OR REPLACE FUNCTION delete_partner_completely(target_provider_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_auth_id UUID;
BEGIN
    -- 1. Trova l'ID di autenticazione del partner (se esiste)
    SELECT auth_id INTO target_auth_id FROM public.providers WHERE id = target_provider_id;

    -- 2. Elimina le auto del partner (vehicles)
    DELETE FROM public.vehicles WHERE provider_id = target_provider_id;

    -- 3. Elimina i log dei caricamenti AI/CSV del partner (import_jobs)
    DELETE FROM public.import_jobs WHERE provider_id = target_provider_id;

    -- 4. Setta NULL sulle prenotazioni associate a questo partner
    -- (Meglio non eliminare le prenotazioni per non alterare lo storico clienti)
    UPDATE public.bookings SET provider_id = NULL WHERE provider_id = target_provider_id;

    -- 5. Se il partner aveva richieste pendenti o vecchie, eliminale
    IF target_auth_id IS NOT NULL THEN
        DELETE FROM public.supplier_applications WHERE auth_id = target_auth_id;
    END IF;

    -- 6. Elimina il profilo aziendale (providers)
    DELETE FROM public.providers WHERE id = target_provider_id;

    -- 7. ELIMINA L'ACCOUNT CRITTOGRAFATO (auth.users)
    -- Questo permette alla sua email di tornare "libera" e distrugge ogni suo accesso
    IF target_auth_id IS NOT NULL THEN
        DELETE FROM auth.users WHERE id = target_auth_id;
    END IF;
    
END;
$$;

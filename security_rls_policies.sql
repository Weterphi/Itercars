-- ========================================================
-- ITERCARS SECURITY AUDIT: RLS (Row Level Security) SETUP
-- ========================================================
-- Istruzioni: Esegui questo script nel SQL Editor di Supabase.
-- Questo script blinderà il database impedendo agli hacker di
-- scaricare i dati dei clienti tramite chiavi anonime, ma
-- permetterà al sito web di continuare a creare preventivi.

-- 1. Attivazione RLS su tutte le tabelle principali
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE nlt_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

-- ========================================================
-- CRM LEADS (I dati sensibili dei clienti)
-- ========================================================
-- Chiunque (anon) può INSERIRE un nuovo lead (dal form del sito)
CREATE POLICY "Anon can insert leads" ON crm_leads FOR INSERT TO public WITH CHECK (true);

-- SOLO gli utenti AUTENTICATI (Admin/Partner) possono LEGGERE i leads
CREATE POLICY "Auth users can view leads" ON crm_leads FOR SELECT TO authenticated USING (true);

-- SOLO gli utenti AUTENTICATI possono AGGIORNARE/CANCELLARE i leads
CREATE POLICY "Auth users can update leads" ON crm_leads FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete leads" ON crm_leads FOR DELETE TO authenticated USING (true);

-- ========================================================
-- BOOKINGS (Contratti e prenotazioni)
-- ========================================================
-- Chiunque (anon) può INSERIRE una prenotazione (dopo il pagamento Stripe)
CREATE POLICY "Anon can insert bookings" ON bookings FOR INSERT TO public WITH CHECK (true);

-- SOLO gli utenti AUTENTICATI possono LEGGERE o MODIFICARE le prenotazioni
CREATE POLICY "Auth users can view bookings" ON bookings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth users can update bookings" ON bookings FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete bookings" ON bookings FOR DELETE TO authenticated USING (true);

-- ========================================================
-- QUOTES (Preventivi PDF e Calcoli)
-- ========================================================
-- Chiunque (anon) può CREARE un preventivo
CREATE POLICY "Anon can insert quotes" ON quotes FOR INSERT TO public WITH CHECK (true);

-- Chiunque (anon) può LEGGERE il proprio preventivo (utile per il resume del checkout)
-- Nota: se vuoi puoi stringere questo, ma al momento serve per visualizzare i dettagli del preventivo creato.
CREATE POLICY "Anon can view quotes" ON quotes FOR SELECT TO public USING (true);

-- Utenti autenticati possono fare tutto
CREATE POLICY "Auth users can update quotes" ON quotes FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete quotes" ON quotes FOR DELETE TO authenticated USING (true);

-- ========================================================
-- VEHICLES (Flotta Auto NBT/Luxury)
-- ========================================================
-- Chiunque può LEGGERE i veicoli (perché devono essere mostrati sul sito)
CREATE POLICY "Anon can view vehicles" ON vehicles FOR SELECT TO public USING (true);

-- Solo AUTENTICATI possono Inserire, Modificare o Eliminare
CREATE POLICY "Auth users can insert vehicles" ON vehicles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update vehicles" ON vehicles FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete vehicles" ON vehicles FOR DELETE TO authenticated USING (true);

-- ========================================================
-- NLT OFFERS (Flotta Auto Lungo Termine)
-- ========================================================
-- Chiunque può LEGGERE le offerte NLT
CREATE POLICY "Anon can view nlt_offers" ON nlt_offers FOR SELECT TO public USING (true);

-- Solo AUTENTICATI possono Inserire, Modificare o Eliminare
CREATE POLICY "Auth users can insert nlt_offers" ON nlt_offers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update nlt_offers" ON nlt_offers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete nlt_offers" ON nlt_offers FOR DELETE TO authenticated USING (true);

-- ========================================================
-- PROVIDERS (Aziende Partner)
-- ========================================================
-- Chiunque può LEGGERE i mandanti (spesso serve per mostrare "Listino X")
CREATE POLICY "Anon can view providers" ON providers FOR SELECT TO public USING (true);

-- Solo AUTENTICATI possono Inserire, Modificare o Eliminare
CREATE POLICY "Auth users can insert providers" ON providers FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Auth users can update providers" ON providers FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Auth users can delete providers" ON providers FOR DELETE TO authenticated USING (true);

-- Fine Configurazione Sicurezza RLS

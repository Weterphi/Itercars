-- ============================================================================
-- SQL AUTOMAZIONE TOTAL-FLOW MANDANTI & PREVENTIVI (`setup_mandanti_automation.sql`)
-- Assicura che tutte le tabelle (flotta, listini, lead e preventivi) abbiano
-- il collegamento diretto ed esplicito all'anagrafica del Mandante/Azienda.
-- ============================================================================

-- 1. TABELLA PROVIDERS (Verifica e aggiunta campi contatto completi)
CREATE TABLE IF NOT EXISTS public.providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  company_vat TEXT,
  company_address TEXT,
  company_phone TEXT,
  company_email TEXT,
  commission_rate NUMERIC DEFAULT 15.0,
  default_deposit NUMERIC DEFAULT 1500,
  portal_status TEXT DEFAULT 'active'
);

-- 2. TABELLA VEHICLES (Anagrafica flotta e supercar collegata al mandante)
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_vehicles_provider_id ON public.vehicles (provider_id);

-- 3. TABELLE OFFERTE NLT & NBT (Collegamento al mandante per listini)
ALTER TABLE public.nlt_offers ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL;
ALTER TABLE public.nbt_offers ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL;

-- 4. TABELLA LEAD E RICHIESTE PREVENTIVO (`crm_leads` e `quotes`)
-- Aggiungiamo sia la Foreign Key `provider_id` sia i campi testuali della scheda mandante
-- così al momento della richiesta preventivo avremo per sempre lo snapshot esatto dei contatti azienda!
ALTER TABLE public.crm_leads ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL;
ALTER TABLE public.crm_leads ADD COLUMN IF NOT EXISTS provider_code TEXT;
ALTER TABLE public.crm_leads ADD COLUMN IF NOT EXISTS provider_company_name TEXT;
ALTER TABLE public.crm_leads ADD COLUMN IF NOT EXISTS provider_company_phone TEXT;
ALTER TABLE public.crm_leads ADD COLUMN IF NOT EXISTS provider_company_email TEXT;
CREATE INDEX IF NOT EXISTS idx_crm_leads_provider_id ON public.crm_leads (provider_id);

ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS provider_code TEXT;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS provider_company_name TEXT;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS provider_company_phone TEXT;
ALTER TABLE public.quotes ADD COLUMN IF NOT EXISTS provider_company_email TEXT;
CREATE INDEX IF NOT EXISTS idx_quotes_provider_id ON public.quotes (provider_id);

-- 5. ABILITAZIONE POLICY RLS (Consenti inserimento preventivi da sito web sia anonimi che autenticati)
ALTER TABLE public.crm_leads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permetti inserimento anonimo su crm_leads" ON public.crm_leads;
CREATE POLICY "Permetti inserimento anonimo su crm_leads" ON public.crm_leads FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Permetti gestione totale su crm_leads" ON public.crm_leads;
CREATE POLICY "Permetti gestione totale su crm_leads" ON public.crm_leads FOR ALL TO authenticated, anon USING (true) WITH CHECK (true);

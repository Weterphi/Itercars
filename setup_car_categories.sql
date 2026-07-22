-- ==============================================================================
-- AGGIUNTA COLONNE CATEGORIE AUTO (LUXURY, PICCOLA, MEDIA, GRANDE)
-- ==============================================================================

-- Aggiunta colonne alla tabella 'vehicles' (Flotta Globale)
ALTER TABLE public.vehicles 
ADD COLUMN IF NOT EXISTS luxury boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS macchina_piccola boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS macchina_media boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS macchina_grande boolean DEFAULT false;

-- Aggiunta colonne alla tabella 'nlt_offers' (Noleggio Lungo Termine)
ALTER TABLE public.nlt_offers 
ADD COLUMN IF NOT EXISTS luxury boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS macchina_piccola boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS macchina_media boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS macchina_grande boolean DEFAULT false;

-- Aggiunta colonne alla tabella 'nbt_offers' (Noleggio Breve Termine)
ALTER TABLE public.nbt_offers 
ADD COLUMN IF NOT EXISTS luxury boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS macchina_piccola boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS macchina_media boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS macchina_grande boolean DEFAULT false;

-- NOTA: Puoi eseguire questo script nell'SQL Editor del tuo pannello Supabase.

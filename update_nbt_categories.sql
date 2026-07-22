-- ==============================================================================
-- IMPOSTA MACCHINA MEDIA (BERLINE) E GRANDE (SUV) PER IL BREVE TERMINE
-- ==============================================================================

-- Imposta "macchina_media = true" per tutte le auto della categoria Berlina destinate al noleggio breve termine
UPDATE public.vehicles
SET macchina_media = true
WHERE is_nbt = true AND category ILIKE '%Berlina%';

-- Imposta "macchina_grande = true" per tutte le auto della categoria SUV destinate al noleggio breve termine
UPDATE public.vehicles
SET macchina_grande = true
WHERE is_nbt = true AND category ILIKE '%SUV%';

-- Nel caso tu utilizzi anche le tabelle dedicate nbt_offers per caricare altre offerte:
-- UPDATE public.nbt_offers SET macchina_media = true WHERE category ILIKE '%Berlina%';
-- UPDATE public.nbt_offers SET macchina_grande = true WHERE category ILIKE '%SUV%';

-- NOTA: Copia e incolla questo script nell'SQL Editor del tuo pannello Supabase ed eseguilo.

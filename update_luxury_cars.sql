-- ==============================================================================
-- IMPOSTA 'luxury = true' PER LE AUTO APPARTENENTI ALLA CATEGORIA LUXURY
-- ==============================================================================

-- Se le tue auto di lusso sono definite dalla categoria 'Supercar' (come nei link del sito)
-- oppure avevano già la vecchia spunta 'is_luxury = true', puoi eseguire questo script:

UPDATE public.vehicles
SET luxury = true
WHERE category = 'Supercar' OR is_luxury = true;

-- Nel caso tu voglia farlo anche per le offerte NLT e NBT (se hanno le stesse colonne):
-- UPDATE public.nlt_offers SET luxury = true WHERE category = 'Supercar' OR is_luxury = true;
-- UPDATE public.nbt_offers SET luxury = true WHERE category = 'Supercar' OR is_luxury = true;

-- NOTA: Puoi eseguire questo script nell'SQL Editor del tuo pannello Supabase.

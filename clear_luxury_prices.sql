-- ==============================================================================
-- ITERCARS — AZZERA PREZZI E DEPOSITI PER LE VETTURE LUXURY / SUPERCAR
-- Imposta `daily_price = 0` e `deposit = 0` nel database `public.vehicles` per tutte
-- le auto di lusso, poichè le tariffe per queste categorie vanno su richiesta (Trattativa Riservata).
-- ==============================================================================

UPDATE public.vehicles
SET 
    daily_price = 0,
    deposit = 0
WHERE 
    is_luxury = true 
    OR category ILIKE ANY (ARRAY['%supercar%', '%suv luxury%', '%sportiva%', '%cabriolet%', '%prestige%'])
    OR brand ILIKE ANY (ARRAY['%ferrari%', '%lamborghini%', '%porsche%', '%maserati%', '%bentley%', '%rolls-royce%', '%mclaren%', '%aston martin%']);

-- Verifica immediata delle vetture aggiornate
SELECT id, brand, model, name, category, daily_price, deposit, is_luxury
FROM public.vehicles
WHERE is_luxury = true OR daily_price = 0
ORDER BY brand, name;

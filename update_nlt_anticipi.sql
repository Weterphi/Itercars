-- Aggiunta delle colonne anticipo per singolo scaglione mesi per NLT
ALTER TABLE public.nlt_offers
ADD COLUMN IF NOT EXISTS "12_mesi_anticipo" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "24_mesi_anticipo" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "36_mesi_anticipo" numeric DEFAULT 0,
ADD COLUMN IF NOT EXISTS "46_mesi_anticipo" numeric DEFAULT 0;

-- Opzionale: Popoliamo i nuovi campi con il valore attuale del deposit_mandante
UPDATE public.nlt_offers
SET "12_mesi_anticipo" = COALESCE(deposit_mandante, 0),
    "24_mesi_anticipo" = COALESCE(deposit_mandante, 0),
    "36_mesi_anticipo" = COALESCE(deposit_mandante, 0),
    "46_mesi_anticipo" = COALESCE(deposit_mandante, 0)
WHERE "12_mesi_anticipo" = 0 AND "24_mesi_anticipo" = 0;

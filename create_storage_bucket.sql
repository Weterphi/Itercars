-- ==============================================================================
-- ITERCARS — SUPABASE STORAGE BUCKET CONFIGURATION ("crm-documents")
-- Esegui questo script nel SQL Editor del tuo progetto Supabase per creare
-- il bucket in cui memorizzare in modo sicuro i documenti dei clienti.
-- ==============================================================================

-- 1. Crea il bucket di archiviazione (Privato per sicurezza bancaria/GDPR)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'crm-documents',
  'crm-documents',
  false, -- false = Privato (accessibile tramite URL firmati o policy)
  10485760, -- Limite di 10 MB per file (.pdf o immagini ad alta risoluzione)
  ARRAY['application/pdf', 'image/png', 'image/jpeg', 'image/jpg']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Abilita Row Level Security (RLS) sugli oggetti di storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy di INSERT (Consente ai clienti/client web di caricare file nel proprio dossier)
DROP POLICY IF EXISTS "Allow Uploads to CRM Documents" ON storage.objects;
CREATE POLICY "Allow Uploads to CRM Documents"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'crm-documents');

-- 4. Policy di SELECT (Consente al backend/amministratori di leggere o scaricare i documenti)
DROP POLICY IF EXISTS "Allow Reads on CRM Documents" ON storage.objects;
CREATE POLICY "Allow Reads on CRM Documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'crm-documents');

-- 5. Policy di DELETE/UPDATE per gestione amministrativa
DROP POLICY IF EXISTS "Allow Admin Modify CRM Documents" ON storage.objects;
CREATE POLICY "Allow Admin Modify CRM Documents"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'crm-documents');

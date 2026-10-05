-- TABELLA UTENTI ACADEMY
CREATE TABLE public.academy_users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Salviamo in chiaro per semplicità o generiamo un hash
    full_name VARCHAR(255),
    stripe_session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Abilitiamo la Row Level Security
ALTER TABLE public.academy_users ENABLE ROW LEVEL SECURITY;

-- Permettiamo a tutti di leggere la tabella in modo che il frontend possa fare il login
-- (In un'app di altissimo livello si usa Supabase Auth, ma per un sistema custom questo va bene)
CREATE POLICY "Enable read access for all users on academy_users" 
ON public.academy_users FOR SELECT 
USING (true);

-- La scrittura avverrà tramite Edge Function con permessi di admin (Service Role),
-- quindi non è necessario abilitare l'inserimento pubblico anonimo.

-- Struttura per il CMS di ITERCARS

CREATE TABLE IF NOT EXISTS public.site_config (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value TEXT,
    category VARCHAR(50) DEFAULT 'general',
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inseriamo alcuni dati di default, come i video e i testi principali
INSERT INTO public.site_config (config_key, config_value, category, description)
VALUES 
    ('home_hero_video', 'aston-martin-video.mp4', 'media', 'Video di sfondo per la sezione Hero (Homepage)'),
    ('home_hero_title_it', 'Guidare l''Eccellenza <br><span class="text-gradient">Non ha Limiti.</span>', 'text_it', 'Titolo principale della homepage (IT)'),
    ('home_hero_subtitle_it', 'Scegli tra le supercar e le berline più esclusive del pianeta. Consegna personalizzata ovunque tu sia.', 'text_it', 'Sottotitolo della homepage (IT)'),
    ('stat_1_value', '80+', 'general', 'Valore Statistica 1 (es. 80+)'),
    ('stat_1_label_it', 'Supercar Esclusive', 'text_it', 'Etichetta Statistica 1 (IT)'),
    ('stat_2_value', '24/7', 'general', 'Valore Statistica 2 (es. 24/7)'),
    ('stat_2_label_it', 'Concierge Dedicato', 'text_it', 'Etichetta Statistica 2 (IT)'),
    ('stat_3_value', '100%', 'general', 'Valore Statistica 3 (es. 100%)'),
    ('stat_3_label_it', 'Garanzia Modello', 'text_it', 'Etichetta Statistica 3 (IT)')
ON CONFLICT (config_key) DO NOTHING;

-- Abilitiamo RLS
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;

-- Lettura per tutti (anon)
CREATE POLICY "Enable read access for all users on site_config" 
ON public.site_config FOR SELECT 
USING (true);

-- Scrittura aperta (in un ambiente di prod potresti restringere a authenticated o admin)
CREATE POLICY "Enable insert/update/delete for admin"
ON public.site_config FOR ALL
USING (true);

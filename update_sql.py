with open('setup_partner_crm.sql', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Add auth_id to providers
content = content.replace(
    'ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50); -- Telefono aziendale / referente',
    'ALTER TABLE public.providers ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(50); -- Telefono aziendale / referente\nALTER TABLE public.providers ADD COLUMN IF NOT EXISTS auth_id UUID; -- ID Autenticazione crittografato Supabase'
)

# Replace the open provider policy with auth_id
content = content.replace(
    'CREATE POLICY "Permetti gestione totale su providers" ON public.providers FOR ALL USING (true) WITH CHECK (true);',
    'CREATE POLICY "Permetti gestione totale su providers" ON public.providers FOR ALL USING (auth.uid() = auth_id OR auth.role() = \'service_role\') WITH CHECK (auth.uid() = auth_id OR auth.role() = \'service_role\');'
)

if 'ALTER TABLE public.supplier_applications' not in content:
    content += "\n\n-- AGGIORNAMENTI PER SICUREZZA MASSIMA\nALTER TABLE public.supplier_applications ADD COLUMN IF NOT EXISTS auth_id UUID;\n"

with open('setup_partner_crm.sql', 'w', encoding='utf-8') as f:
    f.write(content)

print('SQL file updated.')

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const code = fs.readFileSync('crm-admin.js', 'utf8');
const urlMatch = code.match(/supabaseUrl\s*=\s*['"]([^'"]+)['"]/);
const keyMatch = code.match(/supabaseKey\s*=\s*['"]([^'"]+)['"]/);

if (urlMatch && keyMatch) {
  const supabase = createClient(urlMatch[1], keyMatch[1]);
  supabase.from('vehicles').select('*, nlt_offers(*)').ilike('model', '%GLE 350%').then(res => {
    console.log(JSON.stringify(res.data, null, 2));
  });
}

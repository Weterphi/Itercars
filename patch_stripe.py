import re

with open('supabase/functions/stripe-checkout/index.ts', 'r', encoding='utf-8') as f:
    ts = f.read()

ts = ts.replace('const { quoteId } = await req.json();', 'const { quoteCode } = await req.json();')
ts = ts.replace('if (!quoteId) {', 'if (!quoteCode) {')
ts = ts.replace('throw new Error("Missing quoteId");', 'throw new Error("Missing quoteCode");')
ts = ts.replace('.eq("id", quoteId)', '.eq("quote_code", quoteCode)')
ts = ts.replace('quote_id: quoteId,', 'quote_id: quote.id,')

with open('supabase/functions/stripe-checkout/index.ts', 'w', encoding='utf-8') as f:
    f.write(ts)
print('Updated edge function to use quoteCode')

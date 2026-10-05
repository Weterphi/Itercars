import os

files = [
    'supabase/functions/stripe-webhook-academy/index.ts',
    'supabase/functions/stripe-webhook/index.ts'
]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace constructEvent with await constructEventAsync
    if 'await stripe.webhooks.constructEventAsync' not in content:
        content = content.replace('stripe.webhooks.constructEvent(', 'await stripe.webhooks.constructEventAsync(')
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched {filepath}")
    else:
        print(f"Already patched {filepath}")

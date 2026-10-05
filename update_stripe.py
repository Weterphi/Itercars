import os

filepath = 'academy.js'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

start_marker = "    // QUI SI DOVREBBE REINDIRIZZARE A STRIPE (es. Stripe Payment Link)"
end_marker = "  }, 1200);"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker) + len(end_marker)

if start_idx != -1 and end_idx != -1:
    new_code = '''    // Reindirizzamento diretto al link di pagamento Stripe Reale
    window.location.href = "https://buy.stripe.com/6oUaEY3RHbE8a6v9xA0co01";
  }, 800);'''
    content = content[:start_idx] + new_code + content[end_idx:]

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Stripe link updated successfully.")
else:
    print("Could not find the target code block.")

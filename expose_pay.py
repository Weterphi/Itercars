import re

with open('nbt-dettaglio.js', 'r', encoding='utf-8') as f:
    js = f.read()

# Make sure we use window.payQuoteStripe
js = js.replace('async function payQuoteStripe(quoteCode, event) {', 'window.payQuoteStripe = async function(quoteCode, event) {')

with open('nbt-dettaglio.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Exposed payQuoteStripe to window in nbt-dettaglio.js")

import os

# --- 1. nlt-app.js and nbt-app.js ---
for filename in ['nlt-app.js', 'nbt-app.js']:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Link modification
    if 'nlt-app.js' in filename:
        old_href = "p46=${encodeURIComponent(offer.p46||'')}\""
        new_href = "p46=${encodeURIComponent(offer.p46||'')}&loc=${encodeURIComponent(document.getElementById('searchLocation') ? document.getElementById('searchLocation').value : '')}\""
        content = content.replace(old_href, new_href)
    else:
        old_href = "trans=${encodeURIComponent(offer.transmission || 'Automatico')}\""
        new_href = "trans=${encodeURIComponent(offer.transmission || 'Automatico')}&loc=${encodeURIComponent(document.getElementById('searchLocation') ? document.getElementById('searchLocation').value : '')}\""
        content = content.replace(old_href, new_href)

    # Loc text extraction
    old_prov = "let provName = offer.providerName || offer.provider_company_name || 'Mandante NLT';"
    new_prov = "let provName = offer.providerName || offer.provider_company_name || 'Mandante NLT';\n      const locElem = document.getElementById('searchLocation');\n      const locText = (locElem && locElem.value) ? ' [Località: ' + locElem.value + ']' : '';"
    if 'nbt-app.js' in filename:
        old_prov = "let provName = offer.providerName || offer.provider_company_name || 'Mandante NBT';"
        new_prov = "let provName = offer.providerName || offer.provider_company_name || 'Mandante NBT';\n      const locElem = document.getElementById('searchLocation');\n      const locText = (locElem && locElem.value) ? ' [Località: ' + locElem.value + ']' : '';"
    
    content = content.replace(old_prov, new_prov)

    # Lead updates
    if 'nlt-app.js' in filename:
        old_vi = "vehicle_interest: `${offer.brand} ${offer.model} ${offer.trim || ''}`.trim() + ` (${priceInfo.details || ''} - Rata €${priceInfo.price}/mese)`,"
        new_vi = "vehicle_interest: `${offer.brand} ${offer.model} ${offer.trim || ''}`.trim() + ` (${priceInfo.details || ''} - Rata €${priceInfo.price}/mese)` + locText,"
        content = content.replace(old_vi, new_vi)

        old_notes = "notes: `Preventivo 1-Click NLT per ${offer.brand} ${offer.model}: ${priceInfo.details} - Canone ${priceInfo.price} €/mese [Mandante: ${provName}]`\n      };"
        new_notes = "notes: `Preventivo 1-Click NLT per ${offer.brand} ${offer.model}: ${priceInfo.details} - Canone ${priceInfo.price} €/mese [Mandante: ${provName}]` + locText\n      };"
        content = content.replace(old_notes, new_notes)
    else:
        old_vi = "vehicle_interest: `${offer.brand} ${offer.model} ${offer.trim || ''}`.trim() + ` (${priceInfo.details || ''} - Rata €${priceInfo.price}/periodo)`,"
        new_vi = "vehicle_interest: `${offer.brand} ${offer.model} ${offer.trim || ''}`.trim() + ` (${priceInfo.details || ''} - Rata €${priceInfo.price}/periodo)` + locText,"
        content = content.replace(old_vi, new_vi)

        old_notes = "notes: `Preventivo 1-Click NBT per ${offer.brand} ${offer.model}: ${priceInfo.details} - Tariffa €${priceInfo.price} [Mandante: ${provName}]`\n      };"
        new_notes = "notes: `Preventivo 1-Click NBT per ${offer.brand} ${offer.model}: ${priceInfo.details} - Tariffa €${priceInfo.price} [Mandante: ${provName}]` + locText\n      };"
        content = content.replace(old_notes, new_notes)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated {filename}')

# --- 2. nlt-dettaglio.js and nbt-dettaglio.js ---
for filename in ['nlt-dettaglio.js', 'nbt-dettaglio.js']:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add paramLoc globally
    old_param = "const paramModel = params.get('model');"
    new_param = "const paramModel = params.get('model');\n  const paramLoc = params.get('loc') || '';"
    content = content.replace(old_param, new_param)

    # In handleQuoteSubmit, add it again as local var because function is global
    old_func = "async function handleQuoteSubmit(event) {"
    new_func = "async function handleQuoteSubmit(event) {\n  const paramLoc = new URLSearchParams(window.location.search).get('loc') || '';"
    content = content.replace(old_func, new_func)

    if 'nlt-dettaglio.js' in filename:
        old_det = "dettagli: `${c.brand} ${c.model} - ${ConfigState.durationMonths} Mesi, ${ConfigState.kmPerYear} km/anno, Anticipo €${ConfigState.depositAmount}`,"
        new_det = "dettagli: `${c.brand} ${c.model} - ${ConfigState.durationMonths} Mesi, ${ConfigState.kmPerYear} km/anno, Anticipo €${ConfigState.depositAmount}` + (paramLoc ? ` - Luogo di Ritiro: ${paramLoc}` : ''),"
        content = content.replace(old_det, new_det)

        old_vi = "vehicle_interest: `${c.brand} ${c.model} ${c.trim || ''}`.trim() + ` (${ConfigState.durationMonths} Mesi / ${ConfigState.kmPerYear} km/anno - Rata €${ConfigState.finalMonthlyPrice}/mese)`,"
        new_vi = "vehicle_interest: `${c.brand} ${c.model} ${c.trim || ''}`.trim() + ` (${ConfigState.durationMonths} Mesi / ${ConfigState.kmPerYear} km/anno - Rata €${ConfigState.finalMonthlyPrice}/mese)` + (paramLoc ? ` [Località: ${paramLoc}]` : ''),"
        content = content.replace(old_vi, new_vi)

        old_notes = "notes: `Preventivo NLT [${quoteCode}] per ${c.brand} ${c.model}: ${ConfigState.durationMonths}m/${ConfigState.kmPerYear}km - Anticipo €${ConfigState.depositAmount} -> Rata €${ConfigState.finalMonthlyPrice}/mese [Mandante: ${provName}]`\n        };"
        new_notes = "notes: `Preventivo NLT [${quoteCode}] per ${c.brand} ${c.model}: ${ConfigState.durationMonths}m/${ConfigState.kmPerYear}km - Anticipo €${ConfigState.depositAmount} -> Rata €${ConfigState.finalMonthlyPrice}/mese [Mandante: ${provName}]` + (paramLoc ? ` [Località: ${paramLoc}]` : '')\n        };"
        content = content.replace(old_notes, new_notes)
    else:
        old_det = "dettagli: `${c.brand} ${c.model} - ${ConfigState.durationDays} Giorni, ${ConfigState.kmDailyLimit} km/giorno, Anticipo €${ConfigState.depositAmount}`,"
        new_det = "dettagli: `${c.brand} ${c.model} - ${ConfigState.durationDays} Giorni, ${ConfigState.kmDailyLimit} km/giorno, Anticipo €${ConfigState.depositAmount}` + (paramLoc ? ` - Luogo di Ritiro: ${paramLoc}` : ''),"
        content = content.replace(old_det, new_det)

        old_vi = "vehicle_interest: `${c.brand} ${c.model} ${c.trim || ''}`.trim() + ` (${ConfigState.durationDays} Giorni / ${ConfigState.kmDailyLimit} km/giorno - Rata €${ConfigState.finalMonthlyPrice}/periodo)`,"
        new_vi = "vehicle_interest: `${c.brand} ${c.model} ${c.trim || ''}`.trim() + ` (${ConfigState.durationDays} Giorni / ${ConfigState.kmDailyLimit} km/giorno - Rata €${ConfigState.finalMonthlyPrice}/periodo)` + (paramLoc ? ` [Località: ${paramLoc}]` : ''),"
        content = content.replace(old_vi, new_vi)

        old_notes = "notes: `Preventivo NBT [${quoteCode}] per ${c.brand} ${c.model}: ${ConfigState.durationDays}g/${ConfigState.kmDailyLimit}km - Anticipo €${ConfigState.depositAmount} -> Rata €${ConfigState.finalMonthlyPrice}/periodo [Mandante: ${provName}]`\n        };"
        new_notes = "notes: `Preventivo NBT [${quoteCode}] per ${c.brand} ${c.model}: ${ConfigState.durationDays}g/${ConfigState.kmDailyLimit}km - Anticipo €${ConfigState.depositAmount} -> Rata €${ConfigState.finalMonthlyPrice}/periodo [Mandante: ${provName}]` + (paramLoc ? ` [Località: ${paramLoc}]` : '')\n        };"
        content = content.replace(old_notes, new_notes)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated {filename}')

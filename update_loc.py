import os
import re

for filename in ['nlt-app.js', 'nbt-app.js']:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find the a href that links to the dettaglio page
    # It looks like: href="nlt-dettaglio.html?id=${offer.id}..."
    if 'nlt-app.js' in filename:
        content = re.sub(r'href=\"nlt-dettaglio\.html\?id=\$\{offer\.id\}(.*?)\"', r'href="nlt-dettaglio.html?id=${offer.id}\1&loc=${encodeURIComponent(document.getElementById(\'searchLocation\') ? document.getElementById(\'searchLocation\').value : \'\')}"', content)
    else:
        content = re.sub(r'href=\"nbt-dettaglio\.html\?id=\$\{offer\.id\}(.*?)\"', r'href="nbt-dettaglio.html?id=${offer.id}\1&loc=${encodeURIComponent(document.getElementById(\'searchLocation\') ? document.getElementById(\'searchLocation\').value : \'\')}"', content)

    # For handleGeneratePDFSubmit, add location text
    # We will search for:
    # const provName = ...
    # And insert:
    # const locElem = document.getElementById('searchLocation'); const locText = (locElem && locElem.value) ? ' [Località: ' + locElem.value + ']' : '';
    
    rep1 = r'let provName = (.*?);'
    rep2 = r"let provName = \1;\n      const locElem = document.getElementById('searchLocation');\n      const locText = (locElem && locElem.value) ? ' [Località: ' + locElem.value + ']' : '';"
    content = re.sub(rep1, rep2, content)

    # Now replace vehicle_interest
    content = re.sub(r'vehicle_interest: `\$\{offer\.brand\}(.*?)\(.*?\)`,', r'vehicle_interest: `${offer.brand}\1` + locText,', content)

    # Now replace notes
    content = re.sub(r'notes: `Preventivo 1-Click(.*?)\`\n', r'notes: `Preventivo 1-Click\1` + locText\n', content)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated {filename}')

for filename in ['nlt-dettaglio.js', 'nbt-dettaglio.js']:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # In nlt-dettaglio.js and nbt-dettaglio.js, find where URL params are parsed and add loc
    # const paramModel = params.get('model');
    # Replace with: const paramModel = params.get('model'); const paramLoc = params.get('loc') || '';
    content = re.sub(r"const paramModel = params\.get\('model'\);", r"const paramModel = params.get('model');\n  const paramLoc = params.get('loc') || '';", content)

    # Now inside handleQuoteSubmit, find:
    # const emailPayload = {
    #   ...
    #   dettagli: `${c.brand} ${c.model} - ${ConfigState.durationMonths} Mesi, ${ConfigState.kmPerYear} km/anno, Anticipo €${ConfigState.depositAmount}`,
    # Replace with append paramLoc
    content = re.sub(r"dettagli: `\$\{c\.brand\} \$\{c\.model\} - \$\{ConfigState\.durationMonths\} Mesi, \$\{ConfigState\.kmPerYear\} km/anno, Anticipo €\$\{ConfigState\.depositAmount\}`", r"dettagli: `${c.brand} ${c.model} - ${ConfigState.durationMonths} Mesi, ${ConfigState.kmPerYear} km/anno, Anticipo €${ConfigState.depositAmount}` + (paramLoc ? ` - Luogo di Ritiro: ${paramLoc}` : '')", content)

    # Also update crm_leads in handleQuoteSubmit
    content = re.sub(r"vehicle_interest: `\$\{c\.brand\}(.*?)\(.*?\)`,", r"vehicle_interest: `${c.brand}\1` + (paramLoc ? ` [Località: ${paramLoc}]` : ''),", content)
    
    content = re.sub(r"notes: `Preventivo NLT \[\$\{quoteCode\}\](.*?)\`\n", r"notes: `Preventivo NLT [${quoteCode}]\1` + (paramLoc ? ` [Località: ${paramLoc}]` : '')\n", content)
    content = re.sub(r"notes: `Preventivo NBT \[\$\{quoteCode\}\](.*?)\`\n", r"notes: `Preventivo NBT [${quoteCode}]\1` + (paramLoc ? ` [Località: ${paramLoc}]` : '')\n", content)

    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated {filename}')

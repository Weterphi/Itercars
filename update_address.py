with open('app.js', 'r', encoding='utf-8') as f:
    content = f.read()

import re

# Insert the extraction of the address
new_content = content.replace(
    "const email = document.getElementById('partRegEmail').value.trim();",
    "const email = document.getElementById('partRegEmail').value.trim();\n  const address = document.getElementById('partRegAddress').value.trim();"
)

# Update the database insert mapping
new_content = new_content.replace(
    "fleet_size: 'Non specificato',\n      city: 'Non specificato',",
    "fleet_size: 'Non specificato',\n      city: address,"
)

if new_content != content:
    with open('app.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Updated app.js successfully.')
else:
    print('No changes made to app.js')

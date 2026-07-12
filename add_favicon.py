import glob
import re

files = glob.glob('*.html')
new_favicon_tags = """  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <link rel="icon" type="image/png" sizes="512x512" href="favicon-512x512.png">
  <link rel="icon" type="image/png" sizes="192x192" href="favicon-192x192.png">
  <link rel="icon" type="image/png" sizes="32x32" href="favicon-32x32.png">
  <link rel="shortcut icon" href="favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
"""

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove any existing favicon or apple-touch-icon links
    content = re.sub(r'^\s*<link rel="(shortcut )?icon".*?>\r?\n?', '', content, flags=re.MULTILINE | re.IGNORECASE)
    content = re.sub(r'^\s*<link rel="apple-touch-icon".*?>\r?\n?', '', content, flags=re.MULTILINE | re.IGNORECASE)
    
    # Insert new favicon tags right before </head>
    if '</head>' in content:
        content = content.replace('</head>', new_favicon_tags + '</head>')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print('Updated favicon in ' + file)
    else:
        print('Skipped (no </head>): ' + file)

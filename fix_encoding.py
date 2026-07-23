import os, glob

html_files = glob.glob('*.html')
for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # We replace 'â€”' with '-'
    old_char = "â€”"
    if old_char in content:
        content = content.replace(old_char, "-")
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        print(f'Fixed {f}')

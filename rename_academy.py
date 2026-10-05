import os
import glob
replacements = [
    ('academy.html', 'academy.html'),
    ('academy.css', 'academy.css'),
    ('academy.js', 'academy.js'),
    ('academy_bg.png', 'academy_bg.png'),
    ('academy_bg.webp', 'academy_bg.webp'),
    ('ACADEMY', 'ACADEMY'),
    ('Academy', 'Academy'),
    ('academy', 'academy')
]
files_to_check = []
for ext in ['*.html', '*.js', '*.css', '*.py']:
    files_to_check.extend(glob.glob(ext))
for filepath in files_to_check:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        new_content = content
        for old, new in replacements:
            new_content = new_content.replace(old, new)
            
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        pass
files_to_rename = [
    'academy.html', 'academy.css', 'academy.js', 
    'academy_bg.png', 'academy_bg.webp', 'update_academy.py'
]
for old_name in files_to_rename:
    if os.path.exists(old_name):
        new_name = old_name.replace('academy', 'academy')
        os.rename(old_name, new_name)
        print(f"Renamed {old_name} to {new_name}")

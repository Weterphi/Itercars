import glob

html_files = glob.glob('*.html')
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
        auth_count = content.count('id="authModal"')
        console_count = content.count('Console Mandante')
        print(f'{file}: authModal={auth_count}, Console={console_count}')

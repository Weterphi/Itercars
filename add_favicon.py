import glob

files = glob.glob('*.html')
favicon_tag = '  <link rel="icon" type="image/png" href="logo.png">\n'

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if '<link rel="icon"' not in content:
        content = content.replace('</head>', favicon_tag + '</head>')
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print('Updated ' + file)

import glob
for filepath in glob.glob('*.html') + glob.glob('*.js') + glob.glob('*.css') + glob.glob('*.py'):
    with open(filepath, 'rb') as f:
        content = f.read()
    
    # Replace \r\n\r\n with \r\n
    new_content = content.replace(b'\r\n\r\n', b'\r\n')
    # Replace \n\n with \n
    new_content = new_content.replace(b'\n\n', b'\n')
    if new_content != content:
        with open(filepath, 'wb') as f:
            f.write(new_content)
        print(f"Fixed newlines in {filepath}")

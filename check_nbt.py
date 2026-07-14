with open('noleggio-breve-termine.html', 'r', encoding='utf-8') as f:
    content = f.read()
    print('Console Mandante found:', 'Console Mandante' in content)
    print('authModal ID count:', content.count('id="authModal"'))
    print('openAuthModal count:', content.count('openAuthModal'))

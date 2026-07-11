import re

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'r', encoding='utf-8') as f:
    text = f.read()

# I will use a simple replace because the inline styles are exact strings
style_select = "style=\"background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); color: #cbd5e1; outline: none; cursor: pointer; transition: all 0.35s ease; appearance: none; text-align: center;\""
style_input = "style=\"width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); padding-left: 42px; color: #cbd5e1; outline: none; transition: all 0.35s ease;\""

# Clean select style
text = text.replace(style_select, "style=\"appearance: none; text-align: center;\"")

# Clean input style 
text = text.replace(style_input, "style=\"width: 100%; padding-left: 42px;\"")

# Clean focus/blur 
focus_blur = "onfocus=\"this.style.borderColor='rgba(255,255,255,0.3)'; this.style.color='#fff';\" onblur=\"this.style.borderColor='rgba(255,255,255,0.08)'; this.style.color='#cbd5e1';\""
text = text.replace(' ' + focus_blur, "")

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'w', encoding='utf-8') as f:
    f.write(text)

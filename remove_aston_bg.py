import re

with open('c:/Users/alber/Desktop/LuxuryCar/index.css', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the specific background-image block containing hero-bg.jpg
target_pattern = r"background-image:\s*linear-gradient\(180deg, rgba\(10, 14, 23, 0\.15\) 0%, rgba\(10, 14, 23, 0\.20\) 280px, rgba\(10, 14, 23, 0\.85\) 420px, #0a0e17 520px\),\s*url\('hero-bg\.jpg'\) !important;"
replacement = "background-image:\s*linear-gradient(180deg, rgba(10, 14, 23, 0.15) 0%, rgba(10, 14, 23, 0.20) 280px, rgba(10, 14, 23, 0.85) 420px, #0a0e17 520px) !important;"

text = re.sub(target_pattern, r"background-image:\n      linear-gradient(180deg, rgba(10, 14, 23, 0.15) 0%, rgba(10, 14, 23, 0.20) 280px, rgba(10, 14, 23, 0.85) 420px, #0a0e17 520px) !important;", text)

with open('c:/Users/alber/Desktop/LuxuryCar/index.css', 'w', encoding='utf-8') as f:
    f.write(text)

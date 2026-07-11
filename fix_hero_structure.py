import re

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'r', encoding='utf-8') as f:
    text = f.read()

# I want to change:
# <div class="container" style="max-width: 1200px;">
# to:
# <div class="container hero-content" style="max-width: 1200px; width: 100%;">
#   <div class="hero-text text-center" style="width: 100%;">

text = text.replace('<div class="container" style="max-width: 1200px;">', '<div class="container hero-content" style="max-width: 1200px; width: 100%;">\n      <div class="hero-text text-center" style="width: 100%;">')

# Then I need to close the <div class="hero-text text-center"> before the container closes.
# The container closes right before </section>

hero_end_pattern = re.compile(r'      </div>\s*</section>', re.DOTALL)
text = hero_end_pattern.sub('      </div>\n    </div>\n  </section>', text)

# Also, since I manually added margin-top: 60px to the badge, and .hero-text adds padding-top: 120px on mobile,
# this might be TOO much space. Let's revert the badge margin-top back to 20px.
text = text.replace('margin-top: 60px;', 'margin-top: 20px;')

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'w', encoding='utf-8') as f:
    f.write(text)

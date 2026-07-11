import re

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'r', encoding='utf-8') as f:
    text = f.read()

# First, insert the custom style for the mobile video background
style_block = """
  <style>
    .nlt-mobile-video {
      display: none !important;
    }
    @media (max-width: 768px) {
      .nlt-mobile-video {
        display: block !important;
      }
      .hero.nlt-hero {
        background: transparent !important;
      }
    }
  </style>
"""

# Insert the style block before </head>
text = text.replace('</head>', style_block + '</head>')

# Now, wrap the hero section and inject the video
hero_start_pattern = r'<section class="hero" style="padding-top: 160px; padding-bottom: 70px; background: radial-gradient\(circle at 50% 20%, rgba\(0, 146, 70, 0\.15\) 0%, rgba\(6, 6, 12, 1\) 70%\); text-align: center; position: relative;">'

new_hero_start = """  <div class="hero-bg-wrapper" style="position: relative; overflow: hidden; background: #06060c;">
    <video autoplay muted loop playsinline class="hero-bg-video nlt-mobile-video" volume="0" style="position: absolute; top: 50%; left: 50%; min-width: 100%; min-height: 100%; width: auto; height: auto; transform: translate(-50%, -50%); z-index: 0; object-fit: cover; filter: brightness(1.08) contrast(1.05);">
      <source src="brruu.mp4" type="video/mp4">
    </video>
    <div class="hero-bg-overlay nlt-mobile-video" style="background: linear-gradient(to bottom, rgba(6, 6, 12, 0) 0%, rgba(6, 6, 12, 0.4) 60%, #06060c 100%); position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 1;"></div>
    <section class="hero nlt-hero" style="padding-top: 160px; padding-bottom: 70px; background: radial-gradient(circle at 50% 20%, rgba(0, 146, 70, 0.15) 0%, rgba(6, 6, 12, 1) 70%); text-align: center; position: relative; z-index: 2;">"""

text = text.replace('<section class="hero" style="padding-top: 160px; padding-bottom: 70px; background: radial-gradient(circle at 50% 20%, rgba(0, 146, 70, 0.15) 0%, rgba(6, 6, 12, 1) 70%); text-align: center; position: relative;">', new_hero_start)

# Finally, we need to close the wrapper </div> after </section>
# But wait, there is a separate section for the filters now!
# In our previous step, the filters are in a NEW section right below the hero.
# Should the hero-bg-wrapper wrap ONLY the hero, or also the filters?
# In fleet.html, the hero-bg-wrapper wraps ONLY the hero. The filters are INSIDE the hero.
# But wait, in NLT I moved the filters to a separate section! No, I put them BACK inside the hero!
# "Ho spostato i filtri esattamente dove stanno quelli originali: dentro il contenitore principale, subito sotto il sottotitolo"
# Yes, they are inside the hero now!
# So the hero section ends at:
#       </div>
#     </div>
#   </section>
# So we need to add </div> after the first </section>!
# Since there are multiple </section> tags, we only want to append </div> to the ONE that closes the hero.

# The hero section ends with:
#           </div>
#         </div>
#       </div>
#     </div>
#   </section>
# 
#   <!-- ================= CARS CATALOG GRID ================= -->
# Let's replace the EXACT closing of the hero:
hero_end_pattern = r'  </section>\n\n  <!-- ================= CARS CATALOG GRID ================= -->'
new_hero_end = '  </section>\n  </div>\n\n  <!-- ================= CARS CATALOG GRID ================= -->'
text = re.sub(hero_end_pattern, new_hero_end, text)

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'w', encoding='utf-8') as f:
    f.write(text)

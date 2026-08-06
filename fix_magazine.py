# -*- coding: utf-8 -*-
import codecs
import re

with codecs.open('magazine.html', 'r', 'utf-8') as f:
    mag = f.read()

# Fix the Bento card image
mag = mag.replace('zeekr_9x_cover.png', 'zeekr_ai_action.png')

# Inject Hero Slide
zeekr_slide = '''
        <!-- Zeekr 9X Hero Slide -->
        <div class="swiper-slide mag-slide">
          <img src="zeekr_ai_action.png" alt="Zeekr 9X Hero" class="mag-slide-bg">
          <div class="mag-slide-overlay"></div>
          <div class="mag-slide-content">
            <span class="mag-slide-category" style="background: rgba(255, 50, 50, 0.2); color: #ff5555; border-color: rgba(255, 50, 50, 0.4);">New Release</span>
            <h1 class="mag-slide-title">Zeekr 9X: L'Egemone dell'Asfalto</h1>
            <p class="mag-slide-desc">La geografia del potere automobilistico sta subendo un terremoto di magnitudo altissima.</p>
            <a href="articolo-zeekr-9x.html" class="mag-slide-btn">Esplora Ora <i class="ri-arrow-right-line"></i></a>
          </div>
        </div>
'''

if '<!-- Zeekr 9X Hero Slide -->' not in mag:
    # Insert right after the Milano Noleggio slide ends
    # The Milano slide ends with </div> \n      </div> \n    </div> \n  </section>
    # We want to insert inside the <div class="swiper-wrapper">
    
    # Find the end of the Milano Noleggio slide
    milano_str = '<a href="articolo-milano-noleggio.html" class="mag-slide-btn">Esplora Ora <i class="ri-arrow-right-line"></i></a>\r\n          </div>\r\n        </div>'
    if milano_str not in mag:
        milano_str = milano_str.replace('\r\n', '\n')
    
    insert_pos = mag.find(milano_str)
    if insert_pos != -1:
        insert_pos += len(milano_str)
        mag = mag[:insert_pos] + zeekr_slide + mag[insert_pos:]
        
with codecs.open('magazine.html', 'w', 'utf-8') as f:
    f.write(mag)
    print("Magazine fixed successfully!")

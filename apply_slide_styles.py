# -*- coding: utf-8 -*-
import codecs
import os

# 1. DELETE OLD REAL IMAGES
old_images = [
    "zeekr_9x_cover.png",
    "zeekr_9x_sunset.png",
    "zeekr_9x_grey.png",
    "zeekr_9x_dash.jpg",
    "zeekr_9x_seats.png"
]
for img in old_images:
    try:
        os.remove(img)
    except Exception as e:
        print("Could not remove", img, e)

# 2. UPDATE ARTICOLO ZEEKR (Slides replacement)
with codecs.open('articolo-zeekr-9x.html', 'r', 'utf-8') as f:
    html = f.read()

new_slider = '''
  <section class="mag-hero-article">
    <div class="swiper immersive-swiper" id="articleSwiper">
      <div class="immersive-actions" style="z-index: 100;">
        <a href="magazine.html" class="esc-btn" title="Torna al Magazine">ESC</a>
        <button class="fullscreen-btn pulse-attention" id="fsToggleBtn" title="Schermo Intero">
          <i class="ri-fullscreen-line" id="fsIcon"></i>
        </button>
      </div>
      <div class="swiper-wrapper">
      
        <!-- SLIDE 1: Cover -->
        <section class="swiper-slide immersive-slide cover-layout" style="background: #04060a;">
          <img src="zeekr_ai_action.png" alt="Zeekr 9X" class="cover-bg">
          <div class="cover-overlay"></div>
          <div class="cover-content" style="text-align: center; max-width: 900px; padding: 0 5%; z-index:10;">
            <span class="mag-slide-category" style="background: rgba(255, 50, 50, 0.2); color: #ff5555; border: 1px solid rgba(255, 50, 50, 0.4); border-radius: 99px; padding: 5px 15px; font-weight: bold; margin-bottom: 20px; display: inline-block;">NEW RELEASE</span>
            <h1 class="article-title" style="font-size: 3.5rem; font-weight: 800; color: #fff; margin-bottom: 15px;">Zeekr 9X: L'Egemone dell'Asfalto</h1>
            <p style="font-size: 1.4rem; color: #cbd5e1; margin-bottom: 30px;">che Riscrive le Regole del Gioco</p>
            <div class="article-meta" style="color: #94a3b8; font-size: 0.95rem; display: flex; justify-content: center; gap: 20px;">
              <span><i class="ri-user-line"></i> Di Itercars</span>
              <span><i class="ri-calendar-line"></i> 31 Luglio 2026</span>
              <span><i class="ri-time-line"></i> 8 min read</span>
            </div>
            <div class="swipe-indicator" style="margin-top: 50px; animation: bounce 2s infinite;">
              <i class="ri-arrow-down-line" style="font-size: 2rem; color: rgba(255,255,255,0.5);"></i>
            </div>
          </div>
        </section>
        
        <!-- SLIDE 2: SPLIT SCREEN -->
        <section class="swiper-slide immersive-slide split-layout">
          <div class="split-image">
            <img src="zeekr_ai_grille.png" alt="Zeekr Grille">
          </div>
          <div class="split-content" style="z-index: 10;">
            <h2 style="font-size: 2.2rem; font-weight: 800; color: #fff; margin-bottom: 25px; line-height: 1.2;">Oltre le Vecchie Gerarchie</h2>
            <p style="color: #e2e8f0; font-size: 1.05rem; line-height: 1.6; margin-bottom: 15px;">Dimenticate le vecchie gerarchie, quelle che per decenni hanno dettato legge nei salotti buoni dell'automobilismo internazionale. Per generazioni, la formula del lusso su quattro ruote è stata declinata rigorosamente in tedesco o in inglese.</p>
            <p style="color: #e2e8f0; font-size: 1.05rem; line-height: 1.6; margin: 0;">Ma la strada non guarda in faccia al blasone, guarda ai risultati. Il nuovo heavyweight del settore è appena atterrato sul suolo europeo e non ha la minima intenzione di chiedere il permesso per sedersi al tavolo dei grandi.</p>
          </div>
        </section>
        
        <!-- SLIDE 3: PARADIGMA (TOP GLASS) -->
        <section class="swiper-slide immersive-slide" style="position: relative; background: #000; display: flex; align-items: center; justify-content: center;">
          <img src="zeekr_ai_action.png" alt="Zeekr Super Hybrid" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; filter: brightness(0.4); z-index: 1;">
          <div class="glass-responsive glass-top" style="position: absolute; z-index: 10; top: 0; left: 0; width: 100%; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(4px); padding: 25px 5%; border-bottom: 1px solid rgba(255, 255, 255, 0.1); text-align: center; box-sizing: border-box;">
            <h2 style="font-size: 2rem; font-weight: 800; color: #fff; margin-bottom: 10px;">897 Cavalli di Pura Violenza</h2>
            <p style="color: #cbd5e1; font-size: 1.1rem; line-height: 1.6; max-width: 1000px; margin: 0 auto;">Quando si parla di numeri, la 9X smonta la vecchia narrativa secondo cui le dimensioni massicce debbano necessariamente sacrificare le prestazioni brute. Sotto quella scocca imponente si nasconde una centrale elettrica di pura violenza: un sistema Super Hybrid EREV dove due motori elettrici erogano una potenza combinata di 897 cavalli.</p>
          </div>
        </section>
        
        <!-- SLIDE 4: ARMONIC LAYOUT RIGHT (BULLET POINTS) -->
        <section class="swiper-slide immersive-slide" style="position: relative; background: #000; width: 100%; height: 100%;">
          <img src="zeekr_ai_sunset.png" alt="Zeekr Charging" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; z-index: 1;">
          <div class="glass-responsive" style="position: absolute; right: 3%; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(12px); padding: 35px; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.15); max-width: 440px; text-align: left; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <h2 style="font-size: 2.2rem; font-weight: 800; color: #fff; margin-bottom: 25px; line-height: 1.2;">Un Pugno di Ferro in Guanto di Velluto</h2>
            <div style="display: flex; flex-direction: column; gap: 15px;">
              <p style="color: #e2e8f0; font-size: 1.05rem; line-height: 1.5; margin: 0;"><strong>Accelerazione Bruciante:</strong><br>Sradica la sua stessa massa da 0 a 100 km/h in appena 4,1 secondi.</p>
              <p style="color: #e2e8f0; font-size: 1.05rem; line-height: 1.5; margin: 0;"><strong>Architettura 900 Volt:</strong><br>Dal 10% all'80% di batteria in soli 9 minuti e mezzo. Il tempo di un caffè espresso.</p>
              <p style="color: #e2e8f0; font-size: 1.05rem; line-height: 1.5; margin: 0;"><strong>Autonomia Implacabile:</strong><br>Ciclo combinato fino a 737 chilometri per macinare distanze interregionali senza ansia.</p>
            </div>
          </div>
        </section>
        
        <!-- SLIDE 5: QUOTE -->
        <section class="swiper-slide immersive-slide cover-layout" style="background: #04060a;">
          <img src="zeekr_ai_grille.png" alt="Quote Background" class="cover-bg" style="opacity: 0.15; filter: grayscale(100%);">
          <div class="cover-content" style="max-width: 1200px; z-index: 10;">
            <h3 style="color: var(--accent-primary); font-size: 1.5rem; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px;">L'Egemone dell'Asfalto</h3>
            <div class="immersive-quote" style="font-size: 3rem; text-align: left; padding: 40px; border-left-width: 8px;">
              "La strada ha sempre chiesto risultati tangibili, presenza scenica e innovazione spietata. La Zeekr 9X ha risposto presente all'appello."
            </div>
          </div>
        </section>

        <!-- SLIDE 6: ARMONIC LAYOUT LEFT (INTERIOR) -->
        <section class="swiper-slide immersive-slide" style="position: relative; background: #000; width: 100%; height: 100%;">
          <img src="zeekr_ai_interior.png" alt="Zeekr Interior" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; object-position: left center; z-index: 1;">
          <div class="glass-responsive" style="position: absolute; left: 5%; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(12px); padding: 35px; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.15); max-width: 550px; text-align: left; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <h2 style="font-size: 2.2rem; font-weight: 800; color: #fff; margin-bottom: 20px; line-height: 1.2;">Lounge VIP & Silicon Valley</h2>
            <p style="color: #e2e8f0; font-size: 1.05rem; line-height: 1.6; margin-bottom: 15px;">I sedili "Nuvola Flottante" si trasformano in letti di prima classe. L'abitacolo è dominato da un doppio display OLED 3.5K e un mastodontico HUD in realtà aumentata da 47 pollici.</p>
            <p style="color: #e2e8f0; font-size: 1.05rem; line-height: 1.6; margin: 0;">Un cervello elettronico con doppi chip Snapdragon 8295 orchestra l'infotainment, mentre l'isolamento acustico è squarciato solo dall'impianto audio Naim da 4000 Watt.</p>
          </div>
        </section>

        <!-- SLIDE 7: FULL IMAGE -->
        <section class="swiper-slide immersive-slide cover-layout no-gold-dust">
          <img src="zeekr_ai_action.png" alt="Zeekr Finale" class="cover-bg" style="opacity: 1;">
        </section>

      </div>
      <!-- Add Pagination -->
      <div class="swiper-pagination"></div>
      <!-- Add Navigation -->
      <div class="swiper-button-next" style="color: rgba(255,255,255,0.3); right: 20px;"></div>
      <div class="swiper-button-prev" style="color: rgba(255,255,255,0.3); left: 20px;"></div>
    </div>
  </section>
'''

start_str = '<section class="mag-hero-article">'
end_str = '</section>'
start_idx = html.find(start_str)
end_idx = html.find(end_str, start_idx) + len(end_str)

if start_idx != -1 and end_idx != -1:
    html = html[:start_idx] + new_slider + html[end_idx:]
    
    gold_js = '''
    // Generatore di Scintille d'Oro (Gold Dust)
    const slides = document.querySelectorAll('.immersive-slide:not(.no-gold-dust)');
    slides.forEach(slide => {
      const container = document.createElement('div');
      container.className = 'gold-dust-container';
      for(let i=0; i<35; i++) {
        const spark = document.createElement('div');
        spark.className = 'gold-spark';
        spark.style.left = Math.random() * 100 + '%';
        spark.style.animationDelay = (Math.random() * 15) + 's';
        spark.style.animationDuration = (10 + Math.random() * 15) + 's';
        const size = (Math.random() * 2 + 1) + 'px';
        spark.style.width = size;
        spark.style.height = size;
        container.appendChild(spark);
      }
      slide.appendChild(container);
    });
'''
    if "gold-dust-container" not in html:
        html = html.replace('var articleSwiper = new Swiper', gold_js + '\n    var articleSwiper = new Swiper')

    with codecs.open('articolo-zeekr-9x.html', 'w', 'utf-8') as f:
        f.write(html)
        print("Updated Zeekr HTML slides!")


# 3. UPDATE MAGAZINE.HTML (Bento card + Hero slider)
with codecs.open('magazine.html', 'r', 'utf-8') as f:
    mag = f.read()

mag = mag.replace("zeekr_9x_cover.png", "zeekr_ai_action.png")

hero_zeekr_slide = '''
        <!-- HERO SLIDE ZEEKR -->
        <div class="swiper-slide mag-hero-slide">
          <img src="zeekr_ai_action.png" alt="Zeekr 9X Hero" class="mag-hero-bg">
          <div class="mag-hero-overlay"></div>
          <div class="mag-hero-content">
            <span class="mag-hero-tag">New Release</span>
            <h1 class="mag-hero-title">Zeekr 9X: L'Egemone dell'Asfalto</h1>
            <p class="mag-hero-subtitle">La geografia del potere automobilistico sta subendo un terremoto di magnitudo altissima.</p>
            <div class="mag-hero-meta">
              <span><i class="ri-user-line"></i> Itercars</span>
              <span><i class="ri-calendar-line"></i> 31 Luglio 2026</span>
            </div>
            <a href="articolo-zeekr-9x.html" class="mag-hero-btn">Leggi l'Articolo <i class="ri-arrow-right-line"></i></a>
          </div>
        </div>
'''

if '<!-- HERO SLIDE 2 -->' in mag:
    mag = mag.replace('<!-- HERO SLIDE 2 -->', hero_zeekr_slide + '\n        <!-- HERO SLIDE 2 -->')
    with codecs.open('magazine.html', 'w', 'utf-8') as f:
        f.write(mag)
        print("Updated Magazine hero slider!")


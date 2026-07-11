import re

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'r', encoding='utf-8') as f:
    text = f.read()

# Update the style block
old_style = """  <style>
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
  </style>"""

new_style = """  <style>
    .nlt-mobile-video { display: none !important; }
    .nlt-desktop-video { display: block !important; }
    .hero.nlt-hero { background: transparent !important; }
    @media (max-width: 768px) {
      .nlt-mobile-video { display: block !important; }
      .nlt-desktop-video { display: none !important; }
    }
  </style>"""

text = text.replace(old_style, new_style)

# Add the desktop video right before the mobile video
mobile_video_pattern = r'<video autoplay muted loop playsinline class="hero-bg-video nlt-mobile-video"'
desktop_video_inject = """<video autoplay muted loop playsinline class="hero-bg-video nlt-desktop-video" volume="0" style="position: absolute; top: 50%; left: 50%; min-width: 100%; min-height: 100%; width: auto; height: auto; transform: translate(-50%, -50%); z-index: 0; object-fit: cover; filter: brightness(1.08) contrast(1.05);">
      <source src="desktop_nlt_bg.mp4" type="video/mp4">
    </video>
    <video autoplay muted loop playsinline class="hero-bg-video nlt-mobile-video\""""

text = text.replace(mobile_video_pattern, desktop_video_inject)

# Remove the nlt-mobile-video class from the overlay so it applies to both
text = text.replace('<div class="hero-bg-overlay nlt-mobile-video"', '<div class="hero-bg-overlay"')

# Remove the inline background gradient from the hero section (it's already transparent via CSS, but cleaner to remove it)
text = text.replace('background: radial-gradient(circle at 50% 20%, rgba(0, 146, 70, 0.15) 0%, rgba(6, 6, 12, 1) 70%); ', '')

with open('c:/Users/alber/Desktop/LuxuryCar/noleggio-lungo-termine.html', 'w', encoding='utf-8') as f:
    f.write(text)

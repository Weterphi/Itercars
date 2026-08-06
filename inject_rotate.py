import re

with open('articolo-milano-noleggio.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. CSS
css = '''
    /* Rotate Prompt */
    .rotate-prompt {
      display: none;
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 0, 0, 0.95);
      z-index: 9999;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: white;
      text-align: center;
    }
    .rotate-prompt .rotate-icon {
      font-size: 4rem;
      margin-bottom: 20px;
      animation: rotatePhone 2s infinite ease-in-out;
    }
    @keyframes rotatePhone {
      0% { transform: rotate(0deg); }
      50% { transform: rotate(-90deg); }
      100% { transform: rotate(-90deg); }
    }
    .is-fullscreen-portrait .rotate-prompt {
      display: flex;
    }
'''
content = content.replace('</style>', css + '</style>')

# 2. HTML
html = '''
      <!-- Rotate Prompt for Mobile Fullscreen -->
      <div id="rotatePrompt" class="rotate-prompt">
        <i class="ri-smartphone-line rotate-icon"></i>
        <p style="font-size: 1.2rem; font-family: 'Outfit', sans-serif;">Ruota il telefono<br>per l'esperienza immersiva</p>
      </div>
'''
target = '''        </button>
      </div>'''
if target in content:
    content = content.replace(target, target + '\n' + html)

# 3. JS
js = '''
    function checkOrientationPrompt() {
      const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
      if (isFullscreen) {
        if (window.innerHeight > window.innerWidth) {
          swiperContainer.classList.add('is-fullscreen-portrait');
        } else {
          swiperContainer.classList.remove('is-fullscreen-portrait');
        }
      } else {
        swiperContainer.classList.remove('is-fullscreen-portrait');
      }
    }

    document.addEventListener('fullscreenchange', checkOrientationPrompt);
    document.addEventListener('webkitfullscreenchange', checkOrientationPrompt);
    window.addEventListener('resize', checkOrientationPrompt);
'''
target2 = "document.addEventListener('msfullscreenchange', updateFullscreenIcon);"
if target2 in content:
    content = content.replace(target2, target2 + '\n' + js)

with open('articolo-milano-noleggio.html', 'w', encoding='utf-8') as f:
    f.write(content)
print("done")

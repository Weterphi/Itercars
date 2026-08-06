import re

with open('articolo-milano-noleggio.html', 'r', encoding='utf-8') as f:
    content = f.read()

css = '''
    /* Pseudo Fullscreen Fallback (iOS) */
    .pseudo-fullscreen {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 999999 !important;
      background: #000 !important;
      margin: 0 !important;
    }
'''
content = content.replace('</style>', css + '</style>')

js_replacement = '''
    let isPseudoFullscreen = false;

    fsBtn.addEventListener('click', () => {
      const isNativeFs = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
      
      if (!isNativeFs && !isPseudoFullscreen) {
        let req = null;
        let canNative = false;
        
        if (swiperContainer.requestFullscreen) {
          req = swiperContainer.requestFullscreen();
          canNative = true;
        } else if (swiperContainer.webkitRequestFullscreen) { 
          try {
            req = swiperContainer.webkitRequestFullscreen();
            canNative = true;
          } catch(e) {}
        } else if (swiperContainer.msRequestFullscreen) { 
          req = swiperContainer.msRequestFullscreen();
          canNative = true;
        }

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        if (isIOS) canNative = false;

        if (!canNative) {
          swiperContainer.classList.add('pseudo-fullscreen');
          isPseudoFullscreen = true;
          updateFullscreenIcon();
        }

        const lockOrientation = () => {
          if (screen.orientation && screen.orientation.lock) {
            screen.orientation.lock('landscape').catch(err => console.log('Orientation lock failed:', err));
          }
        };

        if (req && req.then) {
          req.then(lockOrientation).catch(e => {
            swiperContainer.classList.add('pseudo-fullscreen');
            isPseudoFullscreen = true;
            updateFullscreenIcon();
          });
        } else {
          setTimeout(lockOrientation, 300);
        }
      } else {
        if (isPseudoFullscreen) {
          swiperContainer.classList.remove('pseudo-fullscreen');
          isPseudoFullscreen = false;
          updateFullscreenIcon();
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) { 
            document.webkitExitFullscreen();
          } else if (document.msExitFullscreen) { 
            document.msExitFullscreen();
          }
        }
        if (screen.orientation && screen.orientation.unlock) {
          screen.orientation.unlock();
        }
      }
    });

    function updateFullscreenIcon() {
      const isNativeFs = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
      const isFullscreen = isNativeFs || isPseudoFullscreen;
      
      if (isFullscreen) {
        fsIcon.classList.remove('ri-fullscreen-line');
        fsIcon.classList.add('ri-fullscreen-exit-line');
        fsBtn.style.background = 'rgba(239, 68, 68, 0.4)';
        fsBtn.style.borderColor = '#ef4444';
      } else {
        fsIcon.classList.remove('ri-fullscreen-exit-line');
        fsIcon.classList.add('ri-fullscreen-line');
        fsBtn.style.background = 'transparent';
        fsBtn.style.borderColor = 'transparent';
      }
      updateFsButtonState(isFullscreen);
    }

    document.addEventListener('fullscreenchange', updateFullscreenIcon);
    document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
    document.addEventListener('msfullscreenchange', updateFullscreenIcon);

    function updateFsButtonState(forcedState = null) {
      const isNativeFs = document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement;
      const isFullscreen = forcedState !== null ? forcedState : (isNativeFs || isPseudoFullscreen);
      
      if (isFullscreen) {
        fsBtn.classList.remove('pulse-attention', 'show-always');
      } else {
        if (articleSwiper.activeIndex === 0) {
          fsBtn.classList.add('pulse-attention');
          fsBtn.classList.remove('show-always');
        } else {
          fsBtn.classList.remove('pulse-attention');
          fsBtn.classList.add('show-always');
        }
      }
    }
'''

start_str = "fsBtn.addEventListener('click', () => {"
end_str = "      }\n    }"

start_idx = content.find(start_str)
end_idx = content.find(end_str, start_idx) + len(end_str)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + js_replacement + content[end_idx:]
    with open('articolo-milano-noleggio.html', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Done")
else:
    print("Not found")

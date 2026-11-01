/**
 * ITERCARS ACADEMY - HERO STORY SLIDER
 * Gestione dello slider interattivo del percorso di carriera e trasformazione VIP
 */

(function () {
  'use strict';

  let currentSlideIndex = 0;
  const totalSlides = 8;
  const slideDuration = 6500; // 6.5 secondi per slide
  let slideTimer = null;
  let isAutoplayRunning = true;
  let touchStartX = 0;
  let touchEndX = 0;

  // Riferimenti DOM
  const sliderEl = document.getElementById('academyStorySlider');
  const slidesWrapper = document.getElementById('acdSlidesWrapper');
  const progressBar = document.getElementById('acdSliderProgressBar');
  const counterCurrent = document.getElementById('acdCurrentSlideNum');
  const dotsContainer = document.getElementById('acdSliderDots');
  const playPauseBtn = document.getElementById('acdSliderPlayPause');

  if (!sliderEl || !slidesWrapper) return;

  const slides = slidesWrapper.querySelectorAll('.acd-story-slide');

  // Inizializza Dots
  function initDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < totalSlides; i++) {
      const dot = document.createElement('button');
      dot.className = 'acd-slider-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Vai a slide ${i + 1}`);
      dot.setAttribute('title', `Fase ${String(i + 1).padStart(2, '0')}`);
      dot.innerHTML = `<span class="dot-num">${String(i + 1).padStart(2, '0')}</span><span class="dot-bar"></span>`;
      dot.addEventListener('click', () => {
        goToSlide(i);
        restartAutoplay();
      });
      dotsContainer.appendChild(dot);
    }
  }

  // Mostra Slide
  function showSlide(index) {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentSlideIndex = index;

    // Aggiorna classi active sulle slide
    slides.forEach((slide, idx) => {
      if (idx === currentSlideIndex) {
        slide.classList.add('active');
        slide.setAttribute('aria-hidden', 'false');
      } else {
        slide.classList.remove('active');
        slide.setAttribute('aria-hidden', 'true');
      }
    });

    // Aggiorna Contatore
    if (counterCurrent) {
      counterCurrent.textContent = String(currentSlideIndex + 1).padStart(2, '0');
    }

    // Aggiorna Dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.acd-slider-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentSlideIndex);
      });
    }

    // Reset e riavvio animazione barra di progresso
    resetProgressBar();
  }

  // Reset Progress Bar
  function resetProgressBar() {
    if (!progressBar) return;
    progressBar.style.transition = 'none';
    progressBar.style.width = '0%';
    void progressBar.offsetWidth; // Trigger reflow
    if (isAutoplayRunning) {
      progressBar.style.transition = `width ${slideDuration}ms linear`;
      progressBar.style.width = '100%';
    }
  }

  // Navigazione
  window.nextAcademySlide = function () {
    showSlide(currentSlideIndex + 1);
    restartAutoplay();
  };

  window.prevAcademySlide = function () {
    showSlide(currentSlideIndex - 1);
    restartAutoplay();
  };

  function goToSlide(index) {
    showSlide(index);
  }

  // Autoplay
  function startAutoplay() {
    if (slideTimer) clearInterval(slideTimer);
    isAutoplayRunning = true;
    resetProgressBar();
    slideTimer = setInterval(() => {
      showSlide(currentSlideIndex + 1);
    }, slideDuration);
    if (playPauseBtn) {
      playPauseBtn.innerHTML = '<i class="ri-pause-line"></i>';
      playPauseBtn.setAttribute('aria-label', 'Metti in pausa');
      playPauseBtn.setAttribute('title', 'Pausa');
    }
  }

  function pauseAutoplay() {
    if (slideTimer) clearInterval(slideTimer);
    slideTimer = null;
    isAutoplayRunning = false;
    if (progressBar) {
      const computedWidth = window.getComputedStyle(progressBar).width;
      progressBar.style.transition = 'none';
      progressBar.style.width = computedWidth;
    }
    if (playPauseBtn) {
      playPauseBtn.innerHTML = '<i class="ri-play-line"></i>';
      playPauseBtn.setAttribute('aria-label', 'Riproduci');
      playPauseBtn.setAttribute('title', 'Riproduci');
    }
  }

  function restartAutoplay() {
    if (isAutoplayRunning) {
      startAutoplay();
    }
  }

  window.toggleAcademySliderAutoplay = function () {
    if (isAutoplayRunning) {
      pauseAutoplay();
    } else {
      startAutoplay();
    }
  };

  // Pausa all'hover sul desktop per consentire lettura rilassata
  sliderEl.addEventListener('mouseenter', () => {
    if (isAutoplayRunning) pauseAutoplay();
  });
  sliderEl.addEventListener('mouseleave', () => {
    if (!isAutoplayRunning && playPauseBtn && playPauseBtn.dataset.manualPause !== 'true') {
      startAutoplay();
    }
  });

  // Gestione Touch Swipe su Mobile
  sliderEl.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  sliderEl.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff < 0) {
        // Swipe a sinistra -> slide successiva
        window.nextAcademySlide();
      } else {
        // Swipe a destra -> slide precedente
        window.prevAcademySlide();
      }
    }
  }

  // Tasti freccia da tastiera quando il focus è vicino o nella pagina
  window.addEventListener('keydown', (e) => {
    if (document.activeElement && ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) {
      return;
    }
    if (e.key === 'ArrowRight') {
      window.nextAcademySlide();
    } else if (e.key === 'ArrowLeft') {
      window.prevAcademySlide();
    }
  });

  // Inizializzazione al caricamento
  initDots();
  showSlide(0);
  startAutoplay();

})();

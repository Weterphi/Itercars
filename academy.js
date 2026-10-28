/* ==========================================================================
   ITERCARS ACADEMY - COURSE LOGIC & VIP AUTHENTICATION
   ========================================================================== */

// 12 Lezioni del Corso VIP Masterclass
const courseLessons = [
  {
    id: 1,
    title: "Introduzione all'Ecosistema Itercars e Standard di Eccellenza",
    duration: "08:30",
    video: "/academy_videos/lesson_1.mp4",
    pdfUrl: "/academy_pdfs/lezione_1.pdf",
    desc: "Benvenuto nella Masterclass Itercars. In questa prima lezione fondamentale esploreremo la filosofia del brand, i valori fondanti e i rigorosi standard di qualità 'White-Glove' che definiscono l'esperienza di noleggio nel settore luxury ed exotics."
  },
  {
    id: 2,
    title: "Accoglienza VIP & Protocolli di Consegna White-Glove",
    duration: "12:15",
    video: "/academy_videos/lesson_2.mp4",
    pdfUrl: "/academy_pdfs/lezione_2.pdf",
    desc: "Scopri come gestire l'incontro iniziale con il cliente ad alto spendente. Dalla presentazione della vettura alla spiegazione delle funzionalità telemetriche, fino alla firma digitale su iPad del verbale di consegna in totale discrezione."
  },
  {
    id: 3,
    title: "Ispezione e Manutenzione Preventiva delle Supercar",
    duration: "14:50",
    video: "/academy_videos/lesson_3.mp4",
    pdfUrl: "/academy_pdfs/lezione_3.pdf",
    desc: "Le supercar richiedono una cura clinica. Analizzeremo la checklist pre-consegna: controllo pressione pneumatici ad alte prestazioni, verifica livelli fluidi speciali, ispezione freni carbo-ceramici e detailing carrozzeria al quarzo."
  },
  {
    id: 4,
    title: "Gestione della Telemetria e Sicurezza Flotta in Tempo Reale",
    duration: "10:20",
    video: "/academy_videos/lesson_4.mp4",
    pdfUrl: "/academy_pdfs/lezione_4.pdf",
    desc: "Come monitorare la flotta attraverso la centrale operativa Itercars. Utilizzo dei sistemi GPS geofencing, analisi del comportamento di guida (G-force e fuorigiri) e protocolli di intervento immediato in caso di anomalia."
  },
  {
    id: 5,
    title: "Massimizzare il Rendimento: Tariffe e Dynamic Pricing",
    duration: "16:40",
    video: "/academy_videos/lesson_5.mp4",
    pdfUrl: "/academy_pdfs/lezione_5.pdf",
    desc: "Impara a gestire l'algoritmo di tariffe dinamiche di Itercars in base alla stagionalità, ai grandi eventi (es. Gran Premio di Monza, Milano Fashion Week) e al tasso di occupazione della flotta per massimizzare il ROI."
  },
  {
    id: 6,
    title: "Il Segreto del Concierge 24/7 e Gestione Richieste Speciali",
    duration: "11:10",
    video: "/academy_videos/lesson_6.mp4",
    pdfUrl: "/academy_pdfs/lezione_6.pdf",
    desc: "I nostri clienti richiedono spesso servizi tailor-made: consegna in elicottero, yacht charter abbinato, scorta di sicurezza o prenotazioni in ristoranti 3 Stelle Michelin. Come coordinare il team Concierge in totale efficienza."
  },
  {
    id: 7,
    title: "Procedure di Sicurezza e Verifica Documentale Clienti Prestige",
    duration: "15:30",
    video: "/academy_videos/lesson_7.mp4",
    pdfUrl: "/academy_pdfs/lezione_7.pdf",
    desc: "Analisi approfondita dei protocolli KYC (Know Your Customer) per la protezione del patrimonio flotta. Verifica di patenti internazionali, controlli anti-frode e gestione dei depositi cauzionali tramite carta di credito ad alto plafond."
  },
  {
    id: 8,
    title: "Gestione Sinistri e Coperture Kasko Full-Risk: Prassi Operative",
    duration: "13:45",
    video: "/academy_videos/lesson_8.mp4",
    pdfUrl: "/academy_pdfs/lezione_8.pdf",
    desc: "Cosa fare in caso di danno lieve o sinistro stradale. La procedura di documentazione fotografica ad alta risoluzione, la denuncia assicurativa rapida e l'attivazione istantanea del servizio di auto sostitutiva Fly & Drive."
  },
  {
    id: 9,
    title: "Il Catalogo Sportiva e Cabrio: Specifiche e Segreti delle Vetture",
    duration: "18:00",
    video: "/academy_videos/lesson_9.mp4",
    pdfUrl: "/academy_pdfs/lezione_9.pdf",
    desc: "Focus tecnico sulle auto più richieste della flotta: dalla BMW M4 Competition alla Ferrari 812 GTS, fino alla Porsche 911 Turbo S. Come presentare le modalità di guida (Track, Sport, Wet) per emozionare il cliente in sicurezza."
  },
  {
    id: 10,
    title: "Partnership Esclusive, Hotel 5 Stelle ed Eventi di Lusso",
    duration: "09:50",
    video: "/academy_videos/lesson_10.mp4",
    pdfUrl: "/academy_pdfs/lezione_10.pdf",
    desc: "Come sviluppare reti territoriali con Hotel 5 Stelle Lusso, Resort esclusivi e Golf Club per posizionare le vetture Itercars direttamente negli hub di maggior prestigio e intercettare clientela internazionale di altissimo profilo."
  },
  {
    id: 11,
    title: "Programma Fedeltà Itercars Privilege & Retention del Cliente",
    duration: "14:15",
    video: "/academy_videos/lesson_11.mp4",
    pdfUrl: "/academy_pdfs/lezione_11.pdf",
    desc: "I clienti ricorrenti sono il cuore del business luxury. Scopri come funziona il programma di membership Itercars Privilege, l'assegnazione di upgrade gratuiti, inviti ad eventi di guida su pista e regali di fine anno personalizzati."
  },
  {
    id: 12,
    title: "Certificazione Finale ed Espansione Internazionale Flotta",
    duration: "20:00",
    video: "/academy_videos/lesson_12.mp4",
    pdfUrl: "/academy_pdfs/lezione_12.pdf",
    desc: "Ultima lezione del percorso Masterclass. Panoramica sulle opportunità di franchising ed espansione europea della flotta. Completando questo modulo, otterrai il Diploma Ufficiale Itercars Certified VIP Partner."
  }
];

// Stato del corso
let unlockedLesson = 1;
let currentLessonIndex = 0;
let loggedUser = null;
let maxWatchedTime = 0;
let videoSecuritySetup = false;

// Inizializzazione al caricamento del DOM
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();

  const loginForm = document.getElementById('academyLoginForm');
  if (loginForm) loginForm.addEventListener('submit', loginAcademy);

  const completeBtn = document.getElementById('completeLessonBtn');
  if (completeBtn) completeBtn.addEventListener('click', completeLesson);

  document.querySelectorAll('a[onclick*="buyAcademy"], button[onclick*="buyAcademy"]').forEach(btn => {
    btn.addEventListener('click', (e) => { e.preventDefault(); buyAcademy(e); });
  });

  document.querySelectorAll('a[onclick*="openLoginModal"], button[onclick*="openLoginModal"]').forEach(btn => {
    btn.addEventListener('click', (e) => { e.preventDefault(); openLoginModal(e); });
  });
});

// Controlla se l'utente è loggato
function checkAuth() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('preview') === 'true' || window.location.hash === '#dashboard' || window.location.hash === '#academyDashboardSection') {
    if (!localStorage.getItem('itercars_academy_user')) {
      localStorage.setItem('itercars_academy_user', 'Partner VIP (Anteprima)');
    }
  }

  if (params.get('submitted') === 'true') {
    setTimeout(() => { showToast("✅ richiesta di accesso inviata con successo!"); }, 500);
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  if (window.location.hash === '#login' && !localStorage.getItem('itercars_academy_user')) {
    setTimeout(() => { openLoginModal(); }, 100);
  }

  loggedUser = localStorage.getItem('itercars_academy_user');
  unlockedLesson = parseInt(localStorage.getItem('itercars_academy_unlocked')) || 1;

  const loginModal = document.getElementById('academyLoginModal');
  const dashboardSection = document.getElementById('academyDashboardSection');
  const presentationSection = document.getElementById('academyPresentationSection');
  const accessModal = document.getElementById('accessRequestModal');
  const siteHeader = document.getElementById('header');
  const siteFooter = document.getElementById('contatti');

  if (loggedUser) {
    if (loginModal) closeLoginModal();
    if (presentationSection) presentationSection.style.display = 'none';
    if (accessModal) closeAccessModal();
    if (dashboardSection) dashboardSection.style.display = 'block';
    if (siteHeader) siteHeader.style.display = 'none';
    if (siteFooter) siteFooter.style.display = 'none';

    const userSpan = document.getElementById('loggedUsername');
    if (userSpan) userSpan.textContent = loggedUser;
    initCourse();
  } else {
    if (presentationSection) presentationSection.style.display = 'block';
    if (loginModal) closeLoginModal();
    if (accessModal) closeAccessModal();
    if (dashboardSection) dashboardSection.style.display = 'none';
    if (siteHeader) siteHeader.style.display = 'block';
    if (siteFooter) siteFooter.style.display = 'block';
  }
}

// Login
async function loginAcademy(e) {
  e.preventDefault();
  const usernameInput = document.getElementById('academyUsername').value.trim();
  const passwordInput = document.getElementById('academyPassword').value.trim();
  if (!usernameInput || !passwordInput) {
    showToast('⚠️ Per favore inserisci sia l\'Email che la Password!', true);
    return;
  }

  const loginBtn = e.target.querySelector('button[type="submit"]');
  const originalBtnHtml = loginBtn ? loginBtn.innerHTML : '';
  if (loginBtn) loginBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> <span>Verifica in corso...</span>';

  try {
    if (typeof window.supabase !== 'undefined' && window.supabase) {
      const { data, error } = await window.supabase
        .from('academy_users')
        .select('*')
        .eq('email', usernameInput)
        .eq('password_hash', passwordInput)
        .maybeSingle();

      if (error || !data) {
        showToast('❌ Credenziali non valide o utente inesistente.', true);
        if (loginBtn) loginBtn.innerHTML = originalBtnHtml;
        return;
      }
      await window.supabase.from('academy_users').update({ last_login: new Date().toISOString() }).eq('id', data.id);
    } else {
      if (usernameInput !== 'partner_vip' || passwordInput !== '12345') {
        showToast('❌ Credenziali errate. Usa partner_vip / 12345 per il test locale.', true);
        if (loginBtn) loginBtn.innerHTML = originalBtnHtml;
        return;
      }
    }

    localStorage.setItem('itercars_academy_user', usernameInput);
    loggedUser = usernameInput;
    showToast(`✅ Benvenuto nell'Area Privata Academy, ${loggedUser}!`);

    const dashboardSection = document.getElementById('academyDashboardSection');
    const presentationSection = document.getElementById('academyPresentationSection');
    const siteHeader = document.getElementById('header');
    const siteFooter = document.getElementById('contatti');

    closeLoginModal();
    if (presentationSection) presentationSection.style.display = 'none';
    if (siteHeader) siteHeader.style.display = 'none';
    if (siteFooter) siteFooter.style.display = 'none';

    if (dashboardSection) {
      dashboardSection.style.display = 'block';
      dashboardSection.style.opacity = '0';
      setTimeout(() => {
        dashboardSection.style.transition = 'opacity 0.5s ease';
        dashboardSection.style.opacity = '1';
      }, 50);
    }

    const userSpan = document.getElementById('loggedUsername');
    if (userSpan) userSpan.textContent = loggedUser;
    initCourse();
    if (loginBtn) loginBtn.innerHTML = originalBtnHtml;

  } catch (err) {
    console.error("Errore durante il login", err);
    showToast('⚠️ Errore di connessione. Riprova più tardi.', true);
    if (loginBtn) loginBtn.innerHTML = originalBtnHtml;
  }
}

// Logout
function logoutAcademy() {
  localStorage.removeItem('itercars_academy_user');
  loggedUser = null;
  showToast("👋 Hai effettuato il logout dall'Area Privata.");
  checkAuth();
}

// Inizializza corso
function initCourse() {
  unlockedLesson = parseInt(localStorage.getItem('itercars_academy_unlocked')) || 1;
  currentLessonIndex = Math.min(unlockedLesson - 1, courseLessons.length - 1);
  setupVideoSecurity();
  renderPlaylist();
  renderCurrentLesson();
  updateProgressBar();
  if (typeof renderExamLauncher === 'function') renderExamLauncher();
}

// Renderizza Playlist
function renderPlaylist() {
  const container = document.getElementById('lessonsListContainer');
  if (!container) return; // Evita crash se l'HTML non è caricato

  container.innerHTML = '';
  courseLessons.forEach((lesson, index) => {
    const lessonNum = lesson.id;
    const isUnlocked = lessonNum <= unlockedLesson;
    const isCompleted = lessonNum < unlockedLesson;
    const isActive = index === currentLessonIndex;
    const card = document.createElement('div');

    card.className = `lesson-card ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`;

    let statusIcon = '<i class="ri-lock-2-fill text-muted"></i>';
    if (isCompleted) {
      statusIcon = '<i class="ri-checkbox-circle-fill" style="color: #2ecc71;"></i>';
    } else if (isUnlocked) {
      statusIcon = '<i class="ri-play-circle-fill" style="color: var(--accent-primary);"></i>';
    }

    card.innerHTML = `
      <div class="lesson-number">${isCompleted ? '✓' : lessonNum}</div>
      <div class="lesson-info">
        <h4>${lesson.title}</h4>
        <div class="lesson-meta">
          <span><i class="ri-time-line"></i> ${lesson.duration}</span>
          <span>•</span>
          <span>${isCompleted ? 'Superata' : isUnlocked ? 'Sbloccata' : 'Bloccata'}</span>
        </div>
      </div>
      <div class="lesson-status-icon">${statusIcon}</div>
    `;

    card.addEventListener('click', () => { selectLesson(index); });
    container.appendChild(card);
  });
}

// Renderizza Lezione Corrente e Player Video
function renderCurrentLesson() {
  const lesson = courseLessons[currentLessonIndex];
  if (!lesson) return;

  let savedTimes = JSON.parse(localStorage.getItem('itercars_academy_video_times')) || {};
  let savedTime = savedTimes[lesson.id] || 0;

  let maxTimes = JSON.parse(localStorage.getItem('itercars_academy_max_times')) || {};
  maxWatchedTime = maxTimes[lesson.id] || savedTime;

  setupVideoSecurity();
  const videoPlayer = document.getElementById('courseVideoPlayer');

  if (videoPlayer) {
    const savedVol = parseFloat(localStorage.getItem('itercars_academy_volume'));
    videoPlayer.muted = savedVol === 0;
    videoPlayer.volume = isNaN(savedVol) ? 1.0 : savedVol;

    // Converte il path MP4 in HLS per lo streaming
    const videoSrc = lesson.video.replace('/academy_videos/', '/academy_hls/').replace('.mp4', '.m3u8');
    const currentSrc = videoPlayer.getAttribute('data-src');

    if (currentSrc !== videoSrc) {
      videoPlayer.setAttribute('data-src', videoSrc);

      const onLoadedMetadata = () => {
        if (savedTime > 0 && savedTime < videoPlayer.duration - 2) {
          videoPlayer.currentTime = savedTime;
        }
        videoPlayer.removeEventListener('loadedmetadata', onLoadedMetadata);
      };

      // Controllo di compatibilità HLS o fallback nativo MP4
      if (window.Hls && Hls.isSupported() && videoSrc.includes('.m3u8')) {
        if (window.hlsPlayer) window.hlsPlayer.destroy();
        const hls = new Hls();
        window.hlsPlayer = hls;
        hls.loadSource(videoSrc);
        hls.attachMedia(videoPlayer);
        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          if (savedTime > 0) videoPlayer.currentTime = savedTime;
          videoPlayer.play().catch(err => console.log('Autoplay bloccato:', err));
        });
      } else if (videoPlayer.canPlayType('application/vnd.apple.mpegurl')) {
        videoPlayer.src = videoSrc;
        videoPlayer.addEventListener('loadedmetadata', onLoadedMetadata);
        videoPlayer.play().catch(err => console.log('Autoplay bloccato:', err));
      } else {
        videoPlayer.src = lesson.video; // Fallback diretto a MP4
        videoPlayer.addEventListener('loadedmetadata', onLoadedMetadata);
        videoPlayer.load();
        videoPlayer.play().catch(err => console.log('Autoplay bloccato:', err));
      }
    }
  }

  // Aggiorna Testi UI
  const titleEl = document.getElementById('currentLessonTitle');
  if (titleEl) titleEl.textContent = `Lezione ${lesson.id}: ${lesson.title}`;

  const descEl = document.getElementById('currentLessonDesc');
  if (descEl) descEl.textContent = lesson.desc;

  const statusBadge = document.getElementById('currentLessonStatusTag');
  if (statusBadge) {
    if (lesson.id < unlockedLesson) {
      statusBadge.className = 'lesson-status-tag tag-completed';
      statusBadge.innerHTML = '<i class="ri-checkbox-circle-fill"></i> Lezione Superata';
    } else {
      statusBadge.className = 'lesson-status-tag tag-uncompleted';
      statusBadge.innerHTML = '<i class="ri-time-fill"></i> Da Superare per Sbloccare la Successiva';
    }
  }

  const completeBtn = document.getElementById('completeLessonBtn');
  if (completeBtn) {
    if (lesson.id < unlockedLesson) {
      completeBtn.innerHTML = '<i class="ri-check-double-line"></i> Lezione Già Superata (Vedi Successiva <i class="ri-arrow-right-line"></i>)';
      completeBtn.style.background = 'rgba(255, 255, 255, 0.08)';
      completeBtn.style.border = '1px solid var(--border-glass)';
      completeBtn.style.opacity = '1';
      completeBtn.style.cursor = 'pointer';
    } else {
      completeBtn.innerHTML = '<i class="ri-lock-2-fill"></i> Guarda il video fino alla conclusione per sbloccare la successiva';
      completeBtn.style.background = 'rgba(0, 146, 70, 0.15)';
      completeBtn.style.border = '1px solid rgba(0, 146, 70, 0.4)';
      completeBtn.style.opacity = '0.85';
      completeBtn.style.cursor = 'not-allowed';
    }
  }

  document.querySelectorAll('.lesson-card').forEach((card, idx) => {
    if (idx === currentLessonIndex) card.classList.add('active');
    else card.classList.remove('active');
  });
}

// Seleziona Lezione
function selectLesson(index) {
  const targetLessonNum = index + 1;
  if (targetLessonNum > unlockedLesson) {
    showToast(`⚠️ Per aprire la Lezione ${targetLessonNum} devi prima superare la Lezione ${targetLessonNum - 1}!`, true);
    return;
  }
  currentLessonIndex = index;
  renderCurrentLesson();

  if (window.innerWidth <= 1024) {
    const videoCol = document.querySelector('.video-column');
    if (videoCol) videoCol.scrollIntoView({ behavior: 'smooth' });
  }
}

// Completamento
function completeLesson(autoCompleted = false) {
  const currentLessonNum = currentLessonIndex + 1;
  if (currentLessonNum === unlockedLesson) {
    const videoPlayer = document.getElementById('courseVideoPlayer');
    if (!autoCompleted && videoPlayer && videoPlayer.duration > 0 && videoPlayer.currentTime < (videoPlayer.duration * 0.98)) {
      showToast("⚠️ Sicurezza Academy: Devi guardare il video fino alla conclusione per sbloccare la lezione successiva!", true);
      return;
    }
    if (unlockedLesson < courseLessons.length) {
      unlockedLesson++;
      localStorage.setItem('itercars_academy_unlocked', unlockedLesson);
      showToast(`🏆 Congratulazioni! Lezione ${currentLessonNum} superata. Sbloccata Lezione ${unlockedLesson}!`);
      currentLessonIndex = unlockedLesson - 1;
    } else {
      showToast(`🎉 CONGRATULAZIONI ASSOLUTE! Hai superato tutte le 12 lezioni del Corso VIP Itercars!`);
      if (typeof onCourseCompleted === 'function') onCourseCompleted();
    }
    updateProgressBar();
    renderPlaylist();
    renderCurrentLesson();
  } else if (currentLessonNum < unlockedLesson) {
    if (currentLessonIndex < unlockedLesson - 1) {
      currentLessonIndex++;
      renderCurrentLesson();
    } else {
      showToast(`✅ Sei già all'ultima lezione sbloccata (Lezione ${unlockedLesson})!`);
    }
  }
}

// Aggiorna Barra Progressi
function updateProgressBar() {
  const progressText = document.getElementById('courseProgressText');
  const progressFill = document.getElementById('courseProgressFill');
  const completedCount = unlockedLesson - 1;
  const percentage = Math.round((completedCount / courseLessons.length) * 100);

  if (progressText) progressText.textContent = `${completedCount} di ${courseLessons.length} Lezioni Superate (${percentage}%)`;
  if (progressFill) progressFill.style.width = `${Math.max(percentage, 5)}%`;
}

// Resetta Progressi
function resetProgress() {
  if (confirm('Sei sicuro di voler resettare i progressi del corso e ricominciare dalla Lezione 1?')) {
    unlockedLesson = 1;
    currentLessonIndex = 0;
    maxWatchedTime = 0;
    localStorage.setItem('itercars_academy_unlocked', 1);
    localStorage.removeItem('itercars_academy_video_times');
    localStorage.removeItem('itercars_academy_max_times');

    updateProgressBar();
    renderPlaylist();
    renderCurrentLesson();
    showToast('🔄 Progressi resettati. Sei tornato alla Lezione 1.');
  }
}

window.toggleSettingsMenu = function (event) {
  event.stopPropagation();
  const menu = document.getElementById('settingsDropdownMenu');
  if (menu) menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'flex' : 'none';
};

document.addEventListener('click', (e) => {
  const menu = document.getElementById('settingsDropdownMenu');
  if (menu && menu.style.display === 'flex' && !e.target.closest('.settings-dropdown-wrapper')) {
    menu.style.display = 'none';
  }
});

window.toggleAudio = function () {
  const videoPlayer = document.getElementById('courseVideoPlayer');
  if (videoPlayer) {
    if (videoPlayer.volume > 0) {
      videoPlayer.volume = 0;
      videoPlayer.muted = true;
      localStorage.setItem('itercars_academy_volume', 0);
      document.getElementById('settingsAudioText').textContent = 'Audio Disabilitato';
      document.getElementById('settingsAudioIcon').className = 'ri-volume-mute-fill';
    } else {
      videoPlayer.volume = 1;
      videoPlayer.muted = false;
      localStorage.setItem('itercars_academy_volume', 1);
      document.getElementById('settingsAudioText').textContent = 'Audio Abilitato';
      document.getElementById('settingsAudioIcon').className = 'ri-volume-up-fill';
    }
  }
};

window.setVideoMode = function (mode) {
  const courseGrid = document.querySelector('.course-grid');
  const videoPlayer = document.getElementById('courseVideoPlayer');
  const videoControls = document.getElementById('videoViewControls');
  const videoContainer = document.querySelector('.video-player-container');
  const videoColumn = document.querySelector('.video-column');

  document.querySelectorAll('.view-mode-btn').forEach(btn => {
    btn.style.borderColor = 'var(--border-glass)';
    btn.classList.remove('active');
  });

  if (mode === 'normal') {
    if (videoColumn && videoControls && videoContainer) {
      videoColumn.insertBefore(videoContainer, videoColumn.firstChild);
      videoColumn.insertBefore(videoControls, videoContainer);
      videoContainer.style.width = '100%';
      videoContainer.style.marginBottom = '0';
    }
    document.getElementById('btnModeNormal').style.borderColor = 'var(--accent-primary)';
    document.getElementById('btnModeNormal').classList.add('active');
    if (document.fullscreenElement) document.exitFullscreen().catch(err => console.log(err));

  } else if (mode === 'theater') {
    if (courseGrid && videoControls && videoContainer) {
      courseGrid.parentNode.insertBefore(videoControls, courseGrid);
      courseGrid.parentNode.insertBefore(videoContainer, courseGrid);
      videoControls.style.marginBottom = '12px';
      videoContainer.style.width = '100%';
      videoContainer.style.marginBottom = '30px';
    }
    document.getElementById('btnModeTheater').style.borderColor = 'var(--accent-primary)';
    document.getElementById('btnModeTheater').classList.add('active');
    if (document.fullscreenElement) document.exitFullscreen().catch(err => console.log(err));

  } else if (mode === 'fullscreen') {
    if (videoPlayer) {
      if (videoPlayer.requestFullscreen) videoPlayer.requestFullscreen();
      else if (videoPlayer.webkitRequestFullscreen) videoPlayer.webkitRequestFullscreen();
      else if (videoPlayer.msRequestFullscreen) videoPlayer.msRequestFullscreen();
    }
    if (videoContainer && videoContainer.parentNode !== videoColumn) {
      document.getElementById('btnModeTheater').style.borderColor = 'var(--accent-primary)';
      document.getElementById('btnModeTheater').classList.add('active');
    } else {
      document.getElementById('btnModeNormal').style.borderColor = 'var(--accent-primary)';
      document.getElementById('btnModeNormal').classList.add('active');
    }
  }
};

function showToast(message, isError = false) {
  let toast = document.getElementById('academyToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'academyToast';
    document.body.appendChild(toast);
  }
  toast.className = `academy-toast ${isError ? 'error' : ''}`;
  toast.innerHTML = `<i class="ri-${isError ? 'error-warning-fill' : 'checkbox-circle-fill'}"></i> <span>${message}</span>`;

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => toast.classList.remove('show'), 4000);
}

function openLoginModal(event) {
  if (event && event.preventDefault) event.preventDefault();
  const modal = document.getElementById("academyLoginModal");
  if (modal) {
    modal.classList.add("active");
    modal.style.display = "flex";
    modal.style.opacity = "1";
    modal.style.visibility = "visible";
    modal.style.zIndex = "999999";
    document.body.style.overflow = "hidden";
  }
}
window.openLoginModal = openLoginModal;

function closeLoginModal() {
  const modal = document.getElementById("academyLoginModal");
  if (modal) {
    modal.classList.remove("active");
    modal.style.opacity = "0";
    modal.style.visibility = "hidden";
    document.body.style.overflow = "auto";
  }
}
window.closeLoginModal = closeLoginModal;

function buyAcademy(event) {
  if (event) event.preventDefault();
  const btn = event.currentTarget || event.target.closest('a') || event.target.closest('button');
  if (!btn) return;
  btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> <span>Connessione a Stripe...</span>';
  setTimeout(() => {
    window.location.href = "https://buy.stripe.com/6oUaEY3RHbE8a6v9xA0co01";
  }, 800);
}
window.buyAcademy = buyAcademy;

document.addEventListener("DOMContentLoaded", () => {
  const savedVol = parseFloat(localStorage.getItem('itercars_academy_volume'));
  const isMuted = savedVol === 0;

  if (isMuted) {
    const audioText = document.getElementById('settingsAudioText');
    const audioIcon = document.getElementById('settingsAudioIcon');
    if (audioText) audioText.textContent = 'Audio Disabilitato';
    if (audioIcon) audioIcon.className = 'ri-volume-mute-fill';
  }

  document.querySelectorAll("video").forEach(v => {
    if (v.id === 'courseVideoPlayer') {
      v.muted = isMuted;
      v.volume = isNaN(savedVol) ? 1.0 : savedVol;
    } else {
      v.muted = true;
      v.volume = 0;
    }
  });

  document.addEventListener("visibilitychange", () => {
    const video = document.getElementById('courseVideoPlayer');
    if (video) {
      if (document.hidden) {
        video.dataset.wasPausedByUser = video.paused ? "true" : "false";
      } else {
        if (video.dataset.wasPausedByUser === "true") video.pause();
        else video.play().catch(e => console.log(e));
      }
    }
  });

  const mainVideo = document.getElementById('courseVideoPlayer');
  if (mainVideo) {
    mainVideo.addEventListener('pause', () => {
      if (document.hidden && mainVideo.dataset.wasPausedByUser === "false") {
        mainVideo.play().catch(err => console.log('Sospensione forzata', err));
      }
    });
  }
});

function setupVideoSecurity() {
  const videoPlayer = document.getElementById('courseVideoPlayer');
  if (!videoPlayer || videoSecuritySetup) return;

  videoSecuritySetup = true;
  videoPlayer.addEventListener('timeupdate', () => {
    const currentLessonNum = currentLessonIndex + 1;
    if (!videoPlayer.seeking && videoPlayer.currentTime > 0) {
      let savedTimes = JSON.parse(localStorage.getItem('itercars_academy_video_times')) || {};
      let maxTimes = JSON.parse(localStorage.getItem('itercars_academy_max_times')) || {};

      if (currentLessonNum === unlockedLesson) {
        if (videoPlayer.currentTime > maxWatchedTime) {
          maxWatchedTime = videoPlayer.currentTime;
          maxTimes[currentLessonNum] = maxWatchedTime;
          localStorage.setItem('itercars_academy_max_times', JSON.stringify(maxTimes));
        }
      }
      savedTimes[currentLessonNum] = videoPlayer.currentTime;
      localStorage.setItem('itercars_academy_video_times', JSON.stringify(savedTimes));
    }
  });

  videoPlayer.addEventListener('seeking', () => {
    const currentLessonNum = currentLessonIndex + 1;
    if (currentLessonNum === unlockedLesson) {
      if (videoPlayer.currentTime > maxWatchedTime + 2) {
        videoPlayer.currentTime = maxWatchedTime;
        showToast("⚠️ Sicurezza Academy: Non puoi mandare avanti il video prima di averlo completato!", true);
      }
    }
  });

  videoPlayer.addEventListener('ended', () => {
    const currentLessonNum = currentLessonIndex + 1;
    if (currentLessonNum === unlockedLesson) {
      showToast("✅ Video concluso con successo! Sblocco della lezione in corso...");
      const completeBtn = document.getElementById('completeLessonBtn');
      if (completeBtn) {
        completeBtn.innerHTML = '<i class="ri-shield-check-fill"></i> Video Concluso! Sblocca Successiva <i class="ri-arrow-right-line"></i>';
        completeBtn.style.background = 'var(--accent-gradient)';
        completeBtn.style.border = 'none';
        completeBtn.style.boxShadow = 'var(--glow-emerald)';
        completeBtn.style.opacity = '1';
        completeBtn.style.cursor = 'pointer';
      }
      completeLesson(true);
    }
  });
}
window.setupVideoSecurity = setupVideoSecurity;

function downloadLessonPdf(event) {
  if (event && event.preventDefault) event.preventDefault();
  const lesson = courseLessons[currentLessonIndex];
  if (lesson && lesson.pdfUrl) {
    window.open(lesson.pdfUrl, '_blank');
  } else {
    showToast(`📄 I file PDF e i documenti tecnici della Lezione ${lesson ? lesson.id : ''} saranno pronti per il download non appena caricati!`);
  }
}
window.downloadLessonPdf = downloadLessonPdf;
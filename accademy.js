/* ==========================================================================
   ITERCARS ACADEMY - COURSE LOGIC & VIP AUTHENTICATION
   ========================================================================== */

// 12 Lezioni del Corso VIP Masterclass
const courseLessons = [
  {
    id: 1,
    title: "Introduzione all'Ecosistema Itercars e Standard di Eccellenza",
    duration: "08:30",
    video: "aston-martin-video.mp4",
    desc: "Benvenuto nella Masterclass Itercars. In questa prima lezione fondamentale esploreremo la filosofia del brand, i valori fondanti e i rigorosi standard di qualità 'White-Glove' che definiscono l'esperienza di noleggio nel settore luxury ed exotics."
  },
  {
    id: 2,
    title: "Accoglienza VIP & Protocolli di Consegna White-Glove",
    duration: "12:15",
    video: "video_promo_ragazza.mp4",
    desc: "Scopri come gestire l'incontro iniziale con il cliente ad alto spendente. Dalla presentazione della vettura alla spiegazione delle funzionalità telemetriche, fino alla firma digitale su iPad del verbale di consegna in totale discrezione."
  },
  {
    id: 3,
    title: "Ispezione e Manutenzione Preventiva delle Supercar",
    duration: "14:50",
    video: "temp_silent.mp4",
    desc: "Le supercar richiedono una cura clinica. Analizzeremo la checklist pre-consegna: controllo pressione pneumatici ad alte prestazioni, verifica livelli fluidi speciali, ispezione freni carbo-ceramici e detailing carrozzeria al quarzo."
  },
  {
    id: 4,
    title: "Gestione della Telemetria e Sicurezza Flotta in Tempo Reale",
    duration: "10:20",
    video: "aston-martin-video.mp4",
    desc: "Come monitorare la flotta attraverso la centrale operativa Itercars. Utilizzo dei sistemi GPS geofencing, analisi del comportamento di guida (G-force e fuorigiri) e protocolli di intervento immediato in caso di anomalia."
  },
  {
    id: 5,
    title: "Massimizzare il Rendimento: Tariffe e Dynamic Pricing",
    duration: "16:40",
    video: "video_promo_ragazza.mp4",
    desc: "Impara a gestire l'algoritmo di tariffe dinamiche di Itercars in base alla stagionalità, ai grandi eventi (es. Gran Premio di Monza, Milano Fashion Week) e al tasso di occupazione della flotta per massimizzare il ROI."
  },
  {
    id: 6,
    title: "Il Segreto del Concierge 24/7 e Gestione Richieste Speciali",
    duration: "11:10",
    video: "temp_silent.mp4",
    desc: "I nostri clienti richiedono spesso servizi tailor-made: consegna in elicottero, yacht charter abbinato, scorta di sicurezza o prenotazioni in ristoranti 3 Stelle Michelin. Come coordinare il team Concierge in totale efficienza."
  },
  {
    id: 7,
    title: "Procedure di Sicurezza e Verifica Documentale Clienti Prestige",
    duration: "15:30",
    video: "aston-martin-video.mp4",
    desc: "Analisi approfondita dei protocolli KYC (Know Your Customer) per la protezione del patrimonio flotta. Verifica di patenti internazionali, controlli anti-frode e gestione dei depositi cauzionali tramite carta di credito ad alto plafond."
  },
  {
    id: 8,
    title: "Gestione Sinistri e Coperture Kasko Full-Risk: Prassi Operative",
    duration: "13:45",
    video: "video_promo_ragazza.mp4",
    desc: "Cosa fare in caso di danno lieve o sinistro stradale. La procedura di documentazione fotografica ad alta risoluzione, la denuncia assicurativa rapida e l'attivazione istantanea del servizio di auto sostitutiva Fly & Drive."
  },
  {
    id: 9,
    title: "Il Catalogo Sportiva e Cabrio: Specifiche e Segreti delle Vetture",
    duration: "18:00",
    video: "temp_silent.mp4",
    desc: "Focus tecnico sulle auto più richieste della flotta: dalla BMW M4 Competition alla Ferrari 812 GTS, fino alla Porsche 911 Turbo S. Come presentare le modalità di guida (Track, Sport, Wet) per emozionare il cliente in sicurezza."
  },
  {
    id: 10,
    title: "Partnership Esclusive, Hotel 5 Stelle ed Eventi di Lusso",
    duration: "09:50",
    video: "aston-martin-video.mp4",
    desc: "Come sviluppare reti territoriali con Hotel 5 Stelle Lusso, Resort esclusivi e Golf Club per posizionare le vetture Itercars direttamente negli hub di maggior prestigio e intercettare clientela internazionale di altissimo profilo."
  },
  {
    id: 11,
    title: "Programma Fedeltà Itercars Privilege & Retention del Cliente",
    duration: "14:15",
    video: "video_promo_ragazza.mp4",
    desc: "I clienti ricorrenti sono il cuore del business luxury. Scopri come funziona il programma di membership Itercars Privilege, l'assegnazione di upgrade gratuiti, inviti ad eventi di guida su pista e regali di fine anno personalizzati."
  },
  {
    id: 12,
    title: "Certificazione Finale ed Espansione Internazionale Flotta",
    duration: "20:00",
    video: "temp_silent.mp4",
    desc: "Ultima lezione del percorso Masterclass. Panoramica sulle opportunità di franchising ed espansione europea della flotta. Completando questo modulo, otterrai il Diploma Ufficiale Itercars Certified VIP Partner."
  }
];

// Stato del corso
let unlockedLesson = 1;
let currentLessonIndex = 0;
let loggedUser = null;

// Inizializzazione al caricamento del DOM
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();

  // Listener per il form di login
  const loginForm = document.getElementById('academyLoginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', loginAcademy);
  }

  // Listener per completamento lezione
  const completeBtn = document.getElementById('completeLessonBtn');
  if (completeBtn) {
    completeBtn.addEventListener('click', completeLesson);
  }
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
    setTimeout(() => {
      showToast("✅ richiesta inviata correttamente");
    }, 500);
    if (window.history && window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }

  loggedUser = localStorage.getItem('itercars_academy_user');
  unlockedLesson = parseInt(localStorage.getItem('itercars_academy_unlocked')) || 1;

  const loginSection = document.getElementById('academyLoginSection');
  const dashboardSection = document.getElementById('academyDashboardSection');
  const presentationSection = document.getElementById('academyPresentationSection');
  const requestAccessSection = document.getElementById('richiediAccessoSection');

  if (loggedUser) {
    if (loginSection) loginSection.style.display = 'none';
    if (presentationSection) presentationSection.style.display = 'none';
    if (requestAccessSection) requestAccessSection.style.display = 'none';
    if (dashboardSection) dashboardSection.style.display = 'block';
    
    const userSpan = document.getElementById('loggedUsername');
    if (userSpan) userSpan.textContent = loggedUser;

    initCourse();
  } else {
    if (loginSection) loginSection.style.display = 'block';
    if (presentationSection) presentationSection.style.display = 'block';
    if (requestAccessSection) requestAccessSection.style.display = 'block';
    if (dashboardSection) dashboardSection.style.display = 'none';
  }
}

// Login
function loginAcademy(e) {
  e.preventDefault();
  const usernameInput = document.getElementById('academyUsername').value.trim();
  const passwordInput = document.getElementById('academyPassword').value.trim();

  if (!usernameInput || !passwordInput) {
    showToast('⚠️ Per favore inserisci sia il Nome Utente che la Password!', true);
    return;
  }

  // Effettua login VIP
  localStorage.setItem('itercars_academy_user', usernameInput);
  loggedUser = usernameInput;

  showToast(`✨ Benvenuto nell'Area Privata Academy, ${loggedUser}!`);
  
  // Transizione animata
  const loginSection = document.getElementById('academyLoginSection');
  const dashboardSection = document.getElementById('academyDashboardSection');
  const presentationSection = document.getElementById('academyPresentationSection');
  const requestAccessSection = document.getElementById('richiediAccessoSection');
  
  if (loginSection) loginSection.style.display = 'none';
  if (presentationSection) presentationSection.style.display = 'none';
  if (requestAccessSection) requestAccessSection.style.display = 'none';
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
}

// Logout
function logoutAcademy() {
  localStorage.removeItem('itercars_academy_user');
  loggedUser = null;
  showToast('🔒 Hai effettuato il logout dall'Area Privata.');
  checkAuth();
}

// Inizializza il corso e renderizza playlist
function initCourse() {
  unlockedLesson = parseInt(localStorage.getItem('itercars_academy_unlocked')) || 1;
  
  // Imposta la lezione corrente sull'ultima sbloccata (o la prima)
  currentLessonIndex = Math.min(unlockedLesson - 1, courseLessons.length - 1);
  
  renderPlaylist();
  renderCurrentLesson();
  updateProgressBar();
}

// Renderizza la colonna di sinistra con i 12 video
function renderPlaylist() {
  const container = document.getElementById('lessonsListContainer');
  if (!container) return;

  container.innerHTML = '';

  courseLessons.forEach((lesson, index) => {
    const lessonNum = lesson.id;
    const isUnlocked = lessonNum <= unlockedLesson;
    const isCompleted = lessonNum < unlockedLesson;
    const isActive = index === currentLessonIndex;

    const card = document.createElement('div');
    card.className = `lesson-card ${isActive ? 'active' : ''} ${!isUnlocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`;
    
    // Configura icona stato
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

    card.addEventListener('click', () => {
      selectLesson(index);
    });

    container.appendChild(card);
  });
}

// Renderizza la lezione corrente nel player centrale
function renderCurrentLesson() {
  const lesson = courseLessons[currentLessonIndex];
  if (!lesson) return;

  // Aggiorna video player
  const videoPlayer = document.getElementById('courseVideoPlayer');
  if (videoPlayer) {
    videoPlayer.muted = true;
    videoPlayer.volume = 0;
    const currentSrc = videoPlayer.getAttribute('src');
    if (currentSrc !== lesson.video) {
      videoPlayer.src = lesson.video;
      videoPlayer.load();
      videoPlayer.play().catch(err => console.log('Autoplay bloccato o in attesa di interazione:', err));
    }
  }

  // Aggiorna titoli e descrizione
  const titleEl = document.getElementById('currentLessonTitle');
  if (titleEl) titleEl.textContent = `Lezione ${lesson.id}: ${lesson.title}`;

  const descEl = document.getElementById('currentLessonDesc');
  if (descEl) descEl.textContent = lesson.desc;

  // Aggiorna Badge di Stato
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

  // Aggiorna pulsante di completamento
  const completeBtn = document.getElementById('completeLessonBtn');
  if (completeBtn) {
    if (lesson.id < unlockedLesson) {
      completeBtn.innerHTML = '<i class="ri-check-double-line"></i> Lezione Già Superata (Vedi Successiva <i class="ri-arrow-right-line"></i>)';
      completeBtn.style.background = 'rgba(255, 255, 255, 0.08)';
      completeBtn.style.border = '1px solid var(--border-glass)';
      completeBtn.style.boxShadow = 'none';
    } else {
      completeBtn.innerHTML = '<i class="ri-shield-check-fill"></i> Ho Superato Questa Lezione (Sblocca Successiva <i class="ri-arrow-right-line"></i>)';
      completeBtn.style.background = 'var(--accent-gradient)';
      completeBtn.style.border = 'none';
      completeBtn.style.boxShadow = 'var(--glow-emerald)';
    }
  }

  // Aggiorna evidenziazione nella playlist
  const cards = document.querySelectorAll('.lesson-card');
  cards.forEach((card, idx) => {
    if (idx === currentLessonIndex) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

// Selezione lezione
function selectLesson(index) {
  const targetLessonNum = index + 1;
  
  if (targetLessonNum > unlockedLesson) {
    showToast(`🔒 Per aprire la Lezione ${targetLessonNum} devi prima superare la Lezione ${targetLessonNum - 1}!`, true);
    return;
  }

  currentLessonIndex = index;
  renderCurrentLesson();
  
  // Scrolla dolcemente al video su mobile/tablet
  if (window.innerWidth <= 1024) {
    const videoCol = document.querySelector('.video-column');
    if (videoCol) videoCol.scrollIntoView({ behavior: 'smooth' });
  }
}

// Completamento Lezione
function completeLesson() {
  const currentLessonNum = currentLessonIndex + 1;

  if (currentLessonNum === unlockedLesson) {
    if (unlockedLesson < courseLessons.length) {
      unlockedLesson++;
      localStorage.setItem('itercars_academy_unlocked', unlockedLesson);
      
      showToast(`🎉 Congratulazioni! Lezione ${currentLessonNum} superata. Sbloccata Lezione ${unlockedLesson}!`);
      
      // Passa automaticamente alla successiva
      currentLessonIndex = unlockedLesson - 1;
    } else {
      showToast(`🏆 CONGRATULAZIONI ASSOLUTE! Hai superato tutte le 12 lezioni del Corso VIP Itercars!`);
    }
    
    updateProgressBar();
    renderPlaylist();
    renderCurrentLesson();
  } else if (currentLessonNum < unlockedLesson) {
    // Se era già superata, vai semplicemente alla successiva disponibile
    if (currentLessonIndex < unlockedLesson - 1) {
      currentLessonIndex++;
      renderCurrentLesson();
    } else {
      showToast(`✨ Sei già all'ultima lezione sbloccata (Lezione ${unlockedLesson})!`);
    }
  }
}

// Aggiorna barra di avanzamento
function updateProgressBar() {
  const progressText = document.getElementById('courseProgressText');
  const progressFill = document.getElementById('courseProgressFill');
  
  const completedCount = unlockedLesson - 1;
  const percentage = Math.round((completedCount / courseLessons.length) * 100);

  if (progressText) {
    progressText.textContent = `${completedCount} di ${courseLessons.length} Lezioni Superate (${percentage}%)`;
  }

  if (progressFill) {
    progressFill.style.width = `${Math.max(percentage, 5)}%`;
  }
}

// Resetta i progressi
function resetProgress() {
  if (confirm('Sei sicuro di voler resettare i progressi del corso e ricominciare dalla Lezione 1?')) {
    unlockedLesson = 1;
    currentLessonIndex = 0;
    localStorage.setItem('itercars_academy_unlocked', 1);
    
    updateProgressBar();
    renderPlaylist();
    renderCurrentLesson();
    
    showToast('🔄 Progressi resettati. Sei tornato alla Lezione 1.');
  }
}

// Toast Notification
function showToast(message, isError = false) {
  let toast = document.getElementById('academyToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'academyToast';
    document.body.appendChild(toast);
  }

  toast.className = `academy-toast ${isError ? 'error' : ''}`;
  toast.innerHTML = `<i class="ri-${isError ? 'error-warning-fill' : 'checkbox-circle-fill'}"></i> <span>${message}</span>`;
  
  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

/* ==========================================================================
   REQUEST ACCESS ON-PAGE FORM SUBMIT (CHIEDI ACCESSO)
   ========================================================================== */
function openAccessModal() {
  const section = document.getElementById("richiediAccessoSection");
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}
window.openAccessModal = openAccessModal;

function handleAccessRequestSubmit(event) {
  const name = document.getElementById('accReqName') ? document.getElementById('accReqName').value.trim() : '';
  const email = document.getElementById('accReqEmail') ? document.getElementById('accReqEmail').value.trim() : '';
  const phone = document.getElementById('accReqPhone') ? document.getElementById('accReqPhone').value.trim() : '';
  const age = document.getElementById('accReqAge') ? document.getElementById('accReqAge').value.trim() : '';
  const education = document.getElementById('accReqEducation') ? document.getElementById('accReqEducation').value.trim() : '';
  const job = document.getElementById('accReqJob') ? document.getElementById('accReqJob').value.trim() : '';

  if (!name || !email || !phone || !age || !education || !job) {
    if (event && event.preventDefault) event.preventDefault();
    showToast("⚠️ Attenzione: Tutti i campi del modulo sono obbligatori! Non è possibile saltare alcuna voce.", true);
    return false;
  }

  showToast("⏳ Invio candidatura di accesso VIP a info@itercars.com in corso...");

  // L'invio POST nativo avviene in background dentro l'iframe invisibile (target="hiddenIframe")
  // Senza mai ricaricare la pagina o aprire siti esterni!
  setTimeout(() => {
    showToast("✅ invio richiesta avvenuta con successo");
    const form = document.getElementById('requestAccessForm');
    const successBox = document.getElementById('requestAccessSuccessBox');
    if (form) {
      if (typeof form.reset === 'function') form.reset();
      form.style.display = 'none';
    }
    if (successBox) {
      successBox.style.display = 'block';
    }
  }, 500);

  return true;
}
window.handleAccessRequestSubmit = handleAccessRequestSubmit;

function resetRequestAccessFormView() {
  const form = document.getElementById('requestAccessForm');
  const successBox = document.getElementById('requestAccessSuccessBox');
  if (form) {
    form.style.display = 'flex';
  }
  if (successBox) {
    successBox.style.display = 'none';
  }
}
window.resetRequestAccessFormView = resetRequestAccessFormView;

// Disattiva sempre l'audio di eventuali video all'avvio
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("video").forEach(v => {
    v.muted = true;
    v.volume = 0;
  });
});


# -*- coding: utf-8 -*-
import codecs

html = '''<!DOCTYPE html>
<html lang="it">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zeekr 9X: L'Egemone dell'Asfalto | ITERCARS Magazine</title>
  <link href="https://cdn.jsdelivr.net/npm/remixicon@4.2.0/fonts/remixicon.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
  <link rel="stylesheet" href="index.css?v=50">
  <link rel="stylesheet" href="magazine.css">
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  <style>
    .article-table { width: 100%; border-collapse: collapse; margin: 40px 0; background: rgba(255, 255, 255, 0.03); border-radius: 12px; overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.1); }
    .article-table th { background: rgba(0, 146, 70, 0.15); color: var(--accent-primary); text-align: left; padding: 20px; font-weight: 700; font-size: 1.1rem; }
    .article-table td { padding: 20px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #d1d5db; vertical-align: top; }
    .article-table tr:last-child td { border-bottom: none; }
    .article-table tr:hover td { background: rgba(255, 255, 255, 0.05); }
    @media (max-width: 768px) {
      .glass-responsive { left: 50% !important; right: auto !important; transform: translate(-50%, -50%) !important; width: 92% !important; max-width: 100% !important; padding: 20px !important; text-align: center !important; border-radius: 12px !important; }
      .glass-responsive.glass-top { top: 0 !important; left: 0 !important; width: 100% !important; transform: none !important; border-radius: 0 !important; padding: 15px 5% !important; }
      .glass-responsive h2 { font-size: 1.6rem !important; margin-bottom: 15px !important; }
      .glass-responsive p { font-size: 0.95rem !important; }
      .article-title { font-size: 2.2rem !important; }
      .immersive-quote { font-size: 2rem !important; padding: 20px !important; }
    }
  </style>
</head>
<body class="magazine-body" style="background: #000;">
  <section class="mag-hero-article">
    <div class="swiper immersive-swiper" id="articleSwiper">
      <div class="immersive-actions" style="z-index: 100;">
        <a href="magazine.html" class="esc-btn" title="Torna al Magazine">ESC</a>
        <button class="fullscreen-btn pulse-attention" id="fsToggleBtn" title="Schermo Intero">
          <i class="ri-fullscreen-line" id="fsIcon"></i>
        </button>
      </div>
      <div class="swiper-wrapper">
        <section class="swiper-slide immersive-slide cover-layout" style="background: #04060a;">
          <img src="file:///C:/Users/alber/.gemini/antigravity-ide/brain/17a27086-1a90-4a6f-8f6b-11b73ae6fece/zeekr_exterior_front_1785534769204.png" alt="Zeekr 9X" class="cover-bg">
          <div class="cover-overlay"></div>
          <div class="cover-content" style="text-align: center; max-width: 900px; padding: 0 5%;">
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
        <section class="swiper-slide immersive-slide" style="position: relative;">
          <img src="file:///C:/Users/alber/.gemini/antigravity-ide/brain/17a27086-1a90-4a6f-8f6b-11b73ae6fece/zeekr_exterior_front_1785534769204.png" style="width: 100%; height: 100%; object-fit: cover;" alt="Zeekr Exterior">
          <div class="glass-responsive" style="position: absolute; left: 5%; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(12px); padding: 35px; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.15); max-width: 550px; text-align: left; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <h2 style="font-size: 2.2rem; color: #fff; margin-bottom: 15px; font-weight: 700;">Oltre le Vecchie Gerarchie</h2>
            <p style="color: #d1d5db; line-height: 1.7; font-size: 1.1rem;">
              Dimenticate le vecchie gerarchie, quelle che per decenni hanno dettato legge nei salotti buoni dell'automobilismo internazionale. Per generazioni, la formula del lusso su quattro ruote è stata una liturgia immutabile, declinata rigorosamente in tedesco o in inglese. Bastava sfoggiare tonnellate di pelle trapuntata a mano, piallature di radica e un possente motore V8 che bruciava ottani come se il domani non esistesse, per assicurarsi il rispetto in strada e i margini nei bilanci. Ma la strada non guarda in faccia al blasone, guarda ai risultati. E oggi, la geografia del potere automobilistico sta subendo un terremoto di magnitudo altissima.
            </p>
          </div>
        </section>
        <section class="swiper-slide immersive-slide" style="position: relative;">
          <img src="file:///C:/Users/alber/.gemini/antigravity-ide/brain/17a27086-1a90-4a6f-8f6b-11b73ae6fece/zeekr_performance_1785534786245.png" style="width: 100%; height: 100%; object-fit: cover;" alt="Zeekr Performance">
          <div class="glass-responsive glass-top" style="position: absolute; z-index: 10; top: 0; left: 0; width: 100%; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(8px); padding: 25px 5%; border-bottom: 1px solid rgba(255, 255, 255, 0.1); text-align: center; box-sizing: border-box;">
            <p style="color: #d1d5db; line-height: 1.6; font-size: 1.2rem; max-width: 1000px; margin: 0 auto;">
              Il nuovo heavyweight del settore è appena atterrato sul suolo europeo e non ha la minima intenzione di chiedere il permesso per sedersi al tavolo dei grandi. Zeekr, l'asso pigliatutto di Geely, ha deciso di calare il carico da novanta lanciando la Zeekr 9X. Non stiamo parlando del solito SUV elettrico di transizione. Ci troviamo di fronte a un leviatano di oltre cinque metri di lunghezza e quasi tre tonnellate di stazza, un manifesto di superiorità tecnologica che punta dritto alla giugulare di corazzate storiche come la Range Rover, la BMW X7 o la Mercedes Classe G.
            </p>
          </div>
        </section>
        <section class="swiper-slide immersive-slide" style="position: relative;">
          <img src="file:///C:/Users/alber/.gemini/antigravity-ide/brain/17a27086-1a90-4a6f-8f6b-11b73ae6fece/zeekr_performance_1785534786245.png" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6);" alt="Zeekr Engine">
          <div class="glass-responsive" style="position: absolute; right: 5%; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(12px); padding: 35px; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.15); max-width: 550px; text-align: left; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <h2 style="font-size: 2.2rem; color: #fff; margin-bottom: 15px; font-weight: 700;">897 Cavalli di Pura Violenza</h2>
            <p style="color: #d1d5db; line-height: 1.7; font-size: 1.1rem;">
              Quando si parla di numeri, la 9X smonta pezzo per pezzo la vecchia narrativa secondo cui le dimensioni massicce debbano necessariamente sacrificare le prestazioni brute. Sotto quella scocca imponente si nasconde una centrale elettrica di pura violenza. La configurazione scelta per dominare l'Europa è un sistema Super Hybrid EREV (veicolo elettrico ad autonomia estesa). Un motore termico da 2.0 litri turbo agisce esclusivamente come generatore instancabile per alimentare il pacco batterie. La trazione che morde l'asfalto è affidata a due motori elettrici che erogano una potenza combinata di 897 cavalli.
            </p>
          </div>
        </section>
        <section class="swiper-slide immersive-slide" style="position: relative;">
          <img src="file:///C:/Users/alber/.gemini/antigravity-ide/brain/17a27086-1a90-4a6f-8f6b-11b73ae6fece/zeekr_charging_1785534796442.png" style="width: 100%; height: 100%; object-fit: cover;" alt="Zeekr Charging">
          <div class="glass-responsive" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 10; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(12px); padding: 35px 45px; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.15); max-width: 700px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5); width: 90%;">
            <h2 style="font-size: 2.2rem; color: #fff; margin-bottom: 15px; font-weight: 700;">0-100 in 4,1 secondi. 900 Volt.</h2>
            <p style="color: #d1d5db; line-height: 1.7; font-size: 1.1rem;">
              Stiamo parlando di una brutalità ingegneristica che si traduce in un pugno di ferro in guanto di velluto. Quest'auto sradica la sua stessa massa portandoti da zero a cento chilometri orari in appena 4,1 secondi. È uno scatto bruciante da semaforo che ridicolizza supercar ben più blasonate. E per chi vive nel terrore dell'ansia da ricarica, la 9X risponde con un'architettura elettrica a 900 Volt: attaccandosi a una colonnina ultra-rapida, il pacco batterie passa dal dieci all'ottanta percento in soli 9 minuti e mezzo. Supportato da un'autonomia complessiva nel ciclo combinato che tocca i 737 chilometri.
            </p>
          </div>
        </section>
        <section class="swiper-slide immersive-slide" style="position: relative;">
          <img src="file:///C:/Users/alber/.gemini/antigravity-ide/brain/17a27086-1a90-4a6f-8f6b-11b73ae6fece/zeekr_interior_lounge_1785534777385.png" style="width: 100%; height: 100%; object-fit: cover;" alt="Zeekr Interior">
          <div class="glass-responsive" style="position: absolute; left: 5%; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(12px); padding: 35px; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.15); max-width: 500px; text-align: left; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <h2 style="font-size: 2.2rem; color: #fff; margin-bottom: 15px; font-weight: 700;">Lounge VIP & Silicon Valley</h2>
            <p style="color: #d1d5db; line-height: 1.7; font-size: 1.1rem;">
              Aprire le portiere di questa vettura significa varcare la soglia di un mondo dove i vecchi standard del lusso sono stati piallati. La configurazione a sei posti offre uno spazio vitale immenso. La plancia è dominata da un doppio display OLED con risoluzione 3.5K, mentre i passeggeri posteriori godono di un monitor da 17 pollici che scende dal tetto. Chi siede al volante gode di un mastodontico Head-Up Display in realtà aumentata da 47 pollici che proietta ogni informazione vitale direttamente sul parabrezza.
            </p>
          </div>
        </section>
        <section class="swiper-slide immersive-slide" style="position: relative;">
          <img src="file:///C:/Users/alber/.gemini/antigravity-ide/brain/17a27086-1a90-4a6f-8f6b-11b73ae6fece/zeekr_interior_lounge_1785534777385.png" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.7);" alt="Zeekr Seats">
          <div class="glass-responsive" style="position: absolute; right: 5%; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(12px); padding: 35px; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.15); max-width: 550px; text-align: left; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <h2 style="font-size: 2.2rem; color: #fff; margin-bottom: 15px; font-weight: 700;">Nuvola Flottante & Audio Naim</h2>
            <p style="color: #d1d5db; line-height: 1.7; font-size: 1.1rem;">
              I sedili, ribattezzati "Nuvola Flottante", sono veri e propri troni dotati di riscaldamento, ventilazione e funzioni di massaggio, permettendo alla seconda fila di trasformarsi in un letto di prima classe. L'isolamento acustico viene squarciato solo da un impianto audio Naim da quasi 4000 Watt e 32 altoparlanti. A orchestrare tutto c'è un cervello elettronico con doppi chip Qualcomm Snapdragon 8295 e processori Nvidia Drive Thor dedicati alla guida autonoma.
            </p>
          </div>
        </section>
      </div>
      <div class="swiper-pagination"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
  </section>
  <article class="mag-reading-section">
    <div class="reading-container">
      <div class="mag-article-interactions" style="margin-bottom: 40px; padding: 20px; background: rgba(255,255,255,0.02); border-radius: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.05);">
        <div class="interaction-likes">
          <button class="btn-like" id="likeBtn" style="background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #fff; display: flex; align-items: center; gap: 8px; font-size: 1.1rem; padding: 10px 20px; border-radius: 30px; cursor: pointer; transition: all 0.3s;">
            <i class="ri-heart-3-line" id="heartIcon"></i> <span id="likeCount">198</span>
          </button>
        </div>
        <div class="interaction-share">
          <button class="btn-share" id="shareBtn" style="background: var(--accent-primary); color: #fff; border: none; padding: 10px 20px; border-radius: 30px; display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer;">
            <i class="ri-share-forward-line"></i> Condividi l'Articolo
          </button>
        </div>
      </div>
      <h2 style="font-size: 2.5rem; margin-bottom: 25px; color: #fff;">Un Game-Changer per l'Asset-Light Brokering</h2>
      <p>
        È proprio qui, analizzando l'impatto sul mercato, che la questione si fa tremendamente seria e cambia le dinamiche del business. Un mezzo con queste specifiche non è solo l'ennesimo status symbol per ricchi annoiati; è uno strumento capace di riscrivere le regole del brokering automobilistico di altissimo livello. Quando si opera nel mercato del noleggio di lusso e dell'intermediazione, lavorare in maniera intelligente significa massimizzare i profitti minimizzando i costi fissi. L'approccio asset-light è la chiave per sopravvivere e dominare.
      </p>
      <p>
        Immaginate il potenziale di avere una Zeekr 9X posizionata strategicamente nel proprio shadow inventory. Non serve immobilizzare capitali enormi per riempire un autosalone fisico; basta avere la disponibilità virtuale, la garanzia di poter procurare questo specifico modello in tempi record. Quando il cliente di fascia alta, il CEO o l'artista di turno si stanca delle solite ammiraglie tedesche e cerca il vero game-changer per fare il suo ingresso in scena, questa è l'arma definitiva da sfoderare. Offrire una 9X significa garantire ai propri clienti non solo un veicolo, ma un'esperienza che unisce l'hype del prodotto rivoluzionario, le prestazioni di un'hypercar e il comfort di un jet privato, con un rapporto qualità-prezzo che attualmente sta facendo venire i sudori freddi ai consigli di amministrazione di mezza Europa.
      </p>
      <blockquote class="immersive-quote" style="margin: 40px 0; padding: 30px; border-left: 4px solid var(--accent-primary); font-size: 24px; font-weight: 300; font-style: italic; color: #fff; background: rgba(255,255,255,0.03);">
        "La strada ha sempre chiesto risultati tangibili, presenza scenica e innovazione spietata. La Zeekr 9X ha risposto presente all'appello, piazzando l'asticella a un'altezza vertiginosa."
      </blockquote>
      <p>
        Le vecchie case automobilistiche sono avvisate: vivere di rendita sulla propria storia non basta più. Il futuro è già parcheggiato qui fuori, e ha un aspetto formidabile.
      </p>
    </div>
  </article>
  <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css"></script>
  <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>
  <script>
    var articleSwiper = new Swiper('#articleSwiper', {
      direction: 'horizontal', slidesPerView: 1, spaceBetween: 0,
      keyboard: { enabled: true },
      pagination: { el: '.swiper-pagination', type: 'progressbar' },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      on: { slideChange: function () { updateFsButtonState(); } }
    });
    const fsBtn = document.getElementById('fsToggleBtn');
    const swiperContainer = document.getElementById('articleSwiper');
    const fsIcon = document.getElementById('fsIcon');
    
    fsBtn.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        if (swiperContainer.requestFullscreen) { swiperContainer.requestFullscreen();
        } else if (swiperContainer.webkitRequestFullscreen) { swiperContainer.webkitRequestFullscreen();
        } else if (swiperContainer.msRequestFullscreen) { swiperContainer.msRequestFullscreen(); }
      } else {
        if (document.exitFullscreen) { document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { document.msExitFullscreen(); }
      }
    });
    function updateFullscreenIcon() {
      if (document.fullscreenElement) {
        fsIcon.classList.remove('ri-fullscreen-line'); fsIcon.classList.add('ri-fullscreen-exit-line');
        fsBtn.style.background = 'rgba(239, 68, 68, 0.4)'; fsBtn.style.borderColor = '#ef4444';
      } else {
        fsIcon.classList.remove('ri-fullscreen-exit-line'); fsIcon.classList.add('ri-fullscreen-line');
        fsBtn.style.background = 'transparent'; fsBtn.style.borderColor = 'transparent';
      }
      updateFsButtonState();
    }
    document.addEventListener('fullscreenchange', updateFullscreenIcon);
    document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
    document.addEventListener('msfullscreenchange', updateFullscreenIcon);
    function updateFsButtonState() {
      if (document.fullscreenElement) {
        fsBtn.classList.remove('pulse-attention', 'show-always');
      } else {
        if (articleSwiper.activeIndex === 0) { fsBtn.classList.add('pulse-attention'); fsBtn.classList.remove('show-always'); }
        else { fsBtn.classList.remove('pulse-attention'); fsBtn.classList.add('show-always'); }
      }
    }
    const likeBtn = document.getElementById('likeBtn');
    const heartIcon = document.getElementById('heartIcon');
    const likeCountSpan = document.getElementById('likeCount');
    if (likeBtn && heartIcon && likeCountSpan) {
      let currentLikes = localStorage.getItem('article_likes_zeekr') ? parseInt(localStorage.getItem('article_likes_zeekr')) : 198;
      let hasLiked = localStorage.getItem('user_has_liked_zeekr') === 'true';
      likeCountSpan.textContent = currentLikes;
      if (hasLiked) { heartIcon.classList.replace('ri-heart-3-line', 'ri-heart-3-fill'); heartIcon.style.color = '#ef4444'; }
      likeBtn.addEventListener('click', () => {
        if (!hasLiked) { currentLikes++; hasLiked = true; localStorage.setItem('user_has_liked_zeekr', 'true'); heartIcon.classList.replace('ri-heart-3-line', 'ri-heart-3-fill'); heartIcon.style.color = '#ef4444'; }
        else { currentLikes--; hasLiked = false; localStorage.setItem('user_has_liked_zeekr', 'false'); heartIcon.classList.replace('ri-heart-3-fill', 'ri-heart-3-line'); heartIcon.style.color = '#fff'; }
        likeCountSpan.textContent = currentLikes; localStorage.setItem('article_likes_zeekr', currentLikes);
      });
    }
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
      shareBtn.addEventListener('click', async () => {
        try { if (navigator.share) { await navigator.share({ title: "Zeekr 9X: L'Egemone dell'Asfalto", text: "Leggi questo articolo sul nuovo SUV Zeekr 9X su Itercars Magazine.", url: window.location.href, }); }
        else { alert('Copia questo link per condividere: ' + window.location.href); } }
        catch (err) { console.log('Condivisione fallita o annullata', err); }
      });
    }
  </script>
</body>
</html>'''

with codecs.open('articolo-zeekr-9x.html', 'w', 'utf-8') as f:
    f.write(html)

with codecs.open('magazine.html', 'r', 'utf-8') as f:
    mag = f.read()

card = '''
      <!-- ZEEKR 9X ARTICLE -->
      <a href="articolo-zeekr-9x.html" class="mag-bento-card mag-card-tall">
        <img src="file:///C:/Users/alber/.gemini/antigravity-ide/brain/17a27086-1a90-4a6f-8f6b-11b73ae6fece/zeekr_exterior_front_1785534769204.png" alt="Zeekr 9X" class="mag-card-img">
        <div class="mag-card-overlay"></div>
        <div class="mag-card-content">
          <span class="mag-card-tag" style="background: rgba(255, 50, 50, 0.2); color: #ff5555; border: 1px solid rgba(255, 50, 50, 0.4);">New Release</span>
          <h3 class="mag-card-title">Zeekr 9X: L'Egemone dell'Asfalto che Riscrive le Regole</h3>
          <div class="mag-card-date">
            <i class="ri-calendar-line"></i> 31 Luglio 2026 • 8 min read
          </div>
          <!-- Card Actions -->
          <div class="card-actions" data-article-id="art-zeekr" style="position: absolute; bottom: 15px; right: 15px; display: flex; gap: 8px; z-index: 20;">
            <button class="btn-card-like" style="background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2); color: #fff; font-size: 0.95rem; cursor: pointer; display: flex; align-items: center; gap: 5px; padding: 5px 12px; border-radius: 20px; backdrop-filter: blur(5px); transition: all 0.2s;">
              <i class="ri-heart-3-line heart-icon"></i> <span class="like-count" style="font-family: 'Inter', sans-serif; font-weight:600;">198</span>
            </button>
            <button class="btn-card-share" style="background: rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.2); color: #fff; font-size: 1rem; cursor: pointer; display: flex; align-items: center; padding: 5px 10px; border-radius: 20px; backdrop-filter: blur(5px); transition: all 0.2s;" title="Condividi">
              <i class="ri-share-forward-line"></i>
            </button>
          </div>
        </div>
      </a>
'''

if '<!-- LATEST ARTICLE: MILANO NOLEGGIO -->' in mag:
    mag = mag.replace('<!-- LATEST ARTICLE: MILANO NOLEGGIO -->', card + '\n      <!-- LATEST ARTICLE: MILANO NOLEGGIO -->')
    with codecs.open('magazine.html', 'w', 'utf-8') as f:
        f.write(mag)

print("Done")

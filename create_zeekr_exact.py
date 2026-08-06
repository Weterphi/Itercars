# -*- coding: utf-8 -*-
import codecs
import re

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
    .glass-responsive {
      max-height: 85vh;
      overflow-y: auto;
    }
    /* Scrollbar minimalista per il box di testo */
    .glass-responsive::-webkit-scrollbar {
      width: 6px;
    }
    .glass-responsive::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05); 
    }
    .glass-responsive::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2); 
      border-radius: 10px;
    }
    
    @media (max-width: 768px) {
      .glass-responsive { left: 50% !important; right: auto !important; transform: translate(-50%, -50%) !important; width: 92% !important; max-width: 100% !important; padding: 20px !important; text-align: center !important; border-radius: 12px !important; }
      .glass-responsive.glass-top { top: 0 !important; left: 0 !important; width: 100% !important; transform: none !important; border-radius: 0 !important; padding: 15px 5% !important; }
      .glass-responsive h2 { font-size: 1.6rem !important; margin-bottom: 15px !important; }
      .glass-responsive p { font-size: 0.95rem !important; }
      .article-title { font-size: 2.2rem !important; }
    }
    .pseudo-fullscreen { position: fixed !important; top: 0 !important; left: 0 !important; width: 100vw !important; height: 100vh !important; z-index: 999999 !important; background: #000 !important; margin: 0 !important; }
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
          <img src="zeekr_9x_cover.png" alt="Zeekr 9X" class="cover-bg">
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
          <img src="zeekr_9x_cover.png" style="width: 100%; height: 100%; object-fit: cover;" alt="Zeekr Exterior">
          <div class="glass-responsive" style="position: absolute; left: 5%; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(12px); padding: 35px; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.15); max-width: 550px; text-align: left; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <p style="color: #d1d5db; line-height: 1.7; font-size: 1.1rem;">
              Dimenticate le vecchie gerarchie, quelle che per decenni hanno dettato legge nei salotti buoni dell'automobilismo internazionale. Per generazioni, la formula del lusso su quattro ruote è stata una liturgia immutabile, declinata rigorosamente in tedesco o in inglese. Bastava sfoggiare tonnellate di pelle trapuntata a mano, piallature di radica e un possente motore V8 che bruciava ottani come se il domani non esistesse, per assicurarsi il rispetto in strada e i margini nei bilanci. Ma la strada non guarda in faccia al blasone, guarda ai risultati. E oggi, la geografia del potere automobilistico sta subendo un terremoto di magnitudo altissima.
            </p>
          </div>
        </section>
        
        <section class="swiper-slide immersive-slide" style="position: relative;">
          <img src="zeekr_9x_sunset.png" style="width: 100%; height: 100%; object-fit: cover;" alt="Zeekr Sunset">
          <div class="glass-responsive glass-top" style="position: absolute; z-index: 10; top: 0; left: 0; width: 100%; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(8px); padding: 25px 5%; border-bottom: 1px solid rgba(255, 255, 255, 0.1); text-align: center; box-sizing: border-box;">
            <p style="color: #d1d5db; line-height: 1.6; font-size: 1.2rem; max-width: 1000px; margin: 0 auto;">
              Il nuovo heavyweight del settore è appena atterrato sul suolo europeo e non ha la minima intenzione di chiedere il permesso per sedersi al tavolo dei grandi. Zeekr, l'asso pigliatutto di Geely, ha deciso di calare il carico da novanta lanciando la Zeekr 9X. Non stiamo parlando del solito SUV elettrico di transizione, nato per compiacere le normative sulle emissioni. Ci troviamo di fronte a un leviatano di oltre cinque metri di lunghezza e quasi tre tonnellate di stazza, un manifesto di superiorità tecnologica che punta dritto alla giugulare di corazzate storiche come la Range Rover, la BMW X7 o la Mercedes Classe G. È alta ingegneria travestita da abito sartoriale, con un'attitudine puramente da strada e la spavalderia di chi sa di avere le carte vincenti in mano.
            </p>
          </div>
        </section>
        
        <section class="swiper-slide immersive-slide" style="position: relative;">
          <img src="zeekr_9x_grey.png" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.6);" alt="Zeekr Grey">
          <div class="glass-responsive" style="position: absolute; right: 5%; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(12px); padding: 35px; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.15); max-width: 550px; text-align: left; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <p style="color: #d1d5db; line-height: 1.7; font-size: 1.1rem;">
              Quando si parla di numeri, la 9X smonta pezzo per pezzo la vecchia narrativa secondo cui le dimensioni massicce debbano necessariamente sacrificare le prestazioni brute. Sotto quella scocca imponente si nasconde una centrale elettrica di pura violenza. La configurazione scelta per dominare l'Europa è un sistema Super Hybrid EREV, ovvero un veicolo elettrico ad autonomia estesa. In termini pratici, questo significa che sotto il cofano lavora un motore termico da 2.0 litri turbo che non ha il compito di far girare le ruote, ma agisce esclusivamente come un generatore instancabile per alimentare il pacco batterie. La vera spinta, la trazione vera e propria che morde l'asfalto, è affidata a due motori elettrici che erogano una potenza combinata di 897 cavalli.
            </p>
          </div>
        </section>
        
        <section class="swiper-slide immersive-slide" style="position: relative;">
          <img src="zeekr_9x_cover.png" style="width: 100%; height: 100%; object-fit: cover;" alt="Zeekr Action">
          <div class="glass-responsive" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 10; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(12px); padding: 35px 45px; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.15); max-width: 700px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5); width: 90%;">
            <p style="color: #d1d5db; line-height: 1.7; font-size: 1.1rem;">
              Stiamo parlando di una brutalità ingegneristica che si traduce in un pugno di ferro in guanto di velluto. Quest'auto sradica la sua stessa massa portandoti da zero a cento chilometri orari in appena 4,1 secondi. È uno scatto bruciante da semaforo che ridicolizza supercar ben più blasonate e leggere, ma tu lo stai eseguendo comodamente sprofondato in un salotto insonorizzato. E per chi vive nel terrore dell'ansia da ricarica, la 9X risponde con un'architettura elettrica a 900 Volt che cambia letteralmente il modo in cui percepiamo il tempo. Attaccandosi a una colonnina ultra-rapida, il pacco batterie passa dal dieci all'ottanta percento in soli nove minuti e mezzo. È il tempo di un caffè espresso, di una telefonata veloce per chiudere un deal, e sei di nuovo in pista, supportato da un'autonomia complessiva nel ciclo combinato che tocca i 737 chilometri. Puoi macinare distanze interregionali senza mai dover guardare con ansia l'indicatore sul cruscotto.
            </p>
          </div>
        </section>
        
        <section class="swiper-slide immersive-slide" style="position: relative;">
          <img src="zeekr_9x_dash.jpg" style="width: 100%; height: 100%; object-fit: cover;" alt="Zeekr Interior">
          <div class="glass-responsive" style="position: absolute; left: 5%; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(12px); padding: 35px; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.15); max-width: 500px; text-align: left; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <p style="color: #d1d5db; line-height: 1.7; font-size: 1.1rem;">
              Aprire le portiere di questa vettura significa varcare la soglia di un mondo dove i vecchi standard del lusso sono stati piallati e ricostruiti da zero. Il centro stile svedese ha concepito un abitacolo che è la fusione perfetta tra una lounge VIP esclusiva e un hub operativo della Silicon Valley. La configurazione a sei posti, disposti su tre file, offre uno spazio vitale immenso. Guidare o essere guidati diventa un'esperienza visiva e sensoriale totale. La plancia è dominata da un doppio display OLED con risoluzione 3.5K, mentre i passeggeri posteriori godono di un monitor da 17 pollici che scende elegantemente dal tetto. Ma è chi siede al volante a godere del pezzo forte: un mastodontico Head-Up Display in realtà aumentata da 47 pollici che proietta ogni singola informazione vitale, dalle traiettorie del navigatore agli ostacoli, direttamente sul parabrezza, fondendo il mondo digitale con l'asfalto reale.
            </p>
          </div>
        </section>
        
        <section class="swiper-slide immersive-slide" style="position: relative;">
          <img src="zeekr_9x_seats.png" style="width: 100%; height: 100%; object-fit: cover; filter: brightness(0.7);" alt="Zeekr Seats">
          <div class="glass-responsive" style="position: absolute; right: 5%; top: 50%; transform: translateY(-50%); z-index: 10; background: rgba(0, 0, 0, 0.65); backdrop-filter: blur(12px); padding: 35px; border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.15); max-width: 550px; text-align: left; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <p style="color: #d1d5db; line-height: 1.7; font-size: 1.1rem;">
              I sedili, ribattezzati non a caso "Nuvola Flottante", sono veri e propri troni dotati di riscaldamento, ventilazione e funzioni di massaggio avanzate, permettendo a chi viaggia nella seconda fila di reclinare la seduta fino a trasformarla in un letto di prima classe. L'isolamento acustico è degno di uno studio di registrazione, un silenzio di tomba che viene squarciato, solo quando lo decidi tu, da un impianto audio Naim da quasi quattromila Watt e 32 altoparlanti, capace di far vibrare la cassa toracica. A orchestrare tutta questa tecnologia c'è un cervello elettronico spaventoso, alimentato da doppi chip Qualcomm Snapdragon 8295 per l'infotainment e processori Nvidia Drive Thor dedicati esclusivamente alla gestione fluida e sicura della guida autonoma. Zero ritardi, zero incertezze, solo pura performance di calcolo.
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
      
      <p style="font-size: 1.15rem; line-height: 1.8; color: #e2e8f0; margin-bottom: 25px;">
        È proprio qui, analizzando l'impatto sul mercato, che la questione si fa tremendamente seria e cambia le dinamiche del business. Un mezzo con queste specifiche non è solo l'ennesimo status symbol per ricchi annoiati; è uno strumento capace di riscrivere le regole del brokering automobilistico di altissimo livello. Quando si opera nel mercato del noleggio di lusso e dell'intermediazione, lavorare in maniera intelligente significa massimizzare i profitti minimizzando i costi fissi. L'approccio asset-light è la chiave per sopravvivere e dominare.
      </p>
      
      <p style="font-size: 1.15rem; line-height: 1.8; color: #e2e8f0; margin-bottom: 25px;">
        Immaginate il potenziale di avere una Zeekr 9X posizionata strategicamente nel proprio shadow inventory. Non serve immobilizzare capitali enormi per riempire un autosalone fisico; basta avere la disponibilità virtuale, la garanzia di poter procurare questo specifico modello in tempi record. Quando il cliente di fascia alta, il CEO o l'artista di turno si stanca delle solite ammiraglie tedesche e cerca il vero game-changer per fare il suo ingresso in scena, questa è l'arma definitiva da sfoderare. Offrire una 9X significa garantire ai propri clienti non solo un veicolo, ma un'esperienza che unisce l'hype del prodotto rivoluzionario, le prestazioni di un'hypercar e il comfort di un jet privato, con un rapporto qualità-prezzo che attualmente sta facendo venire i sudori freddi ai consigli di amministrazione di mezza Europa.
      </p>
      
      <p style="font-size: 1.15rem; line-height: 1.8; color: #e2e8f0; margin-bottom: 25px;">
        La strada ha sempre chiesto risultati tangibili, presenza scenica e innovazione spietata. La Zeekr 9X ha risposto presente all'appello, entrando in scena con la forza di un uragano e piazzando l'asticella a un'altezza vertiginosa. Le vecchie case automobilistiche sono avvisate: vivere di rendita sulla propria storia non basta più. Il futuro è già parcheggiato qui fuori, e ha un aspetto formidabile.
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

# Replace the brain url in magazine.html with the local one
mag = re.sub(r'file:///C:/Users/alber/\.gemini/antigravity-ide/brain/[a-zA-Z0-9-]+/media__[0-9]+\.png', 'zeekr_9x_cover.png', mag)

with codecs.open('magazine.html', 'w', 'utf-8') as f:
    f.write(mag)

print("Article and magazine updated successfully.")

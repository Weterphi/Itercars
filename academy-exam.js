/* ==========================================================================
   ITERCARS ACADEMY - ESAME FINALE DI CERTIFICAZIONE (30 domande, soglia 60%)
   Domande estratte dalle slide delle 12 lezioni (academy_pdfs/)
   ========================================================================== */

const EXAM_PASS_PERCENT = 60;
const EXAM_STORAGE_KEY = 'itercars_academy_exam';

// [domanda, [opzioni], indice risposta corretta, lezione]
const examQuestions = [
  // Lezione 1 - Modello Asset-Light
  ["Nel modello di brokeraggio Asset-Light, qual è il vero asset del broker?", ["Il parco auto di proprietà", "L'informazione e il network di fornitori e relazioni B2B", "Lo showroom fisico", "Il magazzino ricambi"], 1, 1],
  ["Quali sono i tre asset intangibili che il cliente di fascia alta acquista?", ["Prezzo, Velocità, Garanzia", "Tempo, Status e Privacy", "Potenza, Design, Comfort", "Sconto, Rapidità, Assicurazione"], 1, 1],
  ["Rispetto al concessionario tradizionale, il broker Asset-Light ha:", ["Costi fissi enormi e alto rischio di svalutazione", "Costi operativi quasi nulli, zero rischio svalutazione e scalabilità globale", "Mercato limitato a quello locale", "Obbligo di acquistare lo stock"], 1, 1],
  // Lezione 2 - Fornitori
  ["Come si lavora con le boutique di Supercar (Ferrari, Lamborghini) in Italia?", ["Solo tramite API automatiche", "Su base relazionale: email, WhatsApp e accordi commerciali diretti", "Solo tramite programmi Affiliate", "Tramite aste online"], 1, 2],
  ["Cosa offrono aggregatori B2B come CarTrawler o Lyko?", ["Un unico punto di accesso tecnologico a migliaia di auto nel mondo", "Solo noleggio di yacht", "Finanziamenti per acquistare auto", "Assicurazioni Kasko"], 0, 2],
  ["Nel modello \"Tariffa Netta\" con il fornitore:", ["Il broker prende una percentuale fissa decisa dal fornitore", "Il broker ottiene una tariffa B2B confidenziale e applica liberamente il proprio markup", "Il cliente paga sempre il prezzo del fornitore", "Il fornitore decide il prezzo finale al cliente"], 1, 2],
  // Lezione 3 - Branding
  ["Nel modello Asset-Light, qual è l'unico asset tangibile per convincere il cliente?", ["L'auto nel piazzale", "L'immagine e la percezione del brand", "Il prezzo più basso del mercato", "Il numero di dipendenti"], 1, 3],
  ["Quale tono di voce va adottato nei testi ufficiali per sembrare un'azienda strutturata?", ["Usare l'\"Io\" per essere personali", "Usare il \"Noi\" e uno stile elegante e risolutivo", "Usare uno stile urgente con badge \"Sconto\"", "Usare lo slang dei social"], 1, 3],
  ["Quale caratteristica distingue l'approccio Premium da quello di massa?", ["Badge \"Offerta Lampo\" e colori sgargianti", "Esclusività e servizio, niente sconti visibili", "Competere sul prezzo più basso", "Testi lunghi e molto densi"], 1, 3],
  // Lezione 4 - Vetrina digitale AI
  ["Perché generare le foto delle auto con l'AI (Gemini) invece di prenderle da internet?", ["Per evitare rischi di denunce per violazione di copyright e costi dei fotografi", "Perché le foto web sono troppo grandi", "Perché è obbligatorio per legge", "Per risparmiare spazio sul server"], 0, 4],
  ["Qual è una regola corretta del \"Prompting Luxury\"?", ["Chiedere semplicemente \"una foto di una Ferrari\"", "Specificare luce, stile fotografico e ambientazione (es. golden hour, villa sul lago di Como)", "Usare sempre colori diversi per ogni post", "Evitare di indicare la location"], 1, 4],
  // Lezione 5 - Acquisizione VIP
  ["Quali dati vanno richiesti inizialmente in un form VIP per ridurre l'attrito?", ["Codice fiscale, IBAN e reddito", "Solo i dati essenziali: Nome, Email, Telefono", "Tutti i documenti d'identità", "Nessun dato"], 1, 5],
  ["Perché strutturare il form in più step (multi-step)?", ["Per rallentare l'utente", "Per sfruttare il micro-impegno: chi risponde alla prima domanda tende a completare", "Per raccogliere più dati inutili", "Per obblighi GDPR"], 1, 5],
  ["Qual è il vantaggio tecnico delle Lead Ads native su Instagram/Facebook?", ["I dati del cliente vengono pre-compilati automaticamente dal profilo", "Costano zero", "Non richiedono targeting", "Inviano automaticamente il contratto"], 0, 5],
  // Lezione 6 - Chiusura WhatsApp
  ["Entro quanto tempo un lead dovrebbe essere contattato per massimizzare la chiusura?", ["Entro 48 ore", "Entro 5-10 minuti dall'invio del form", "Entro una settimana", "Solo quando richiama lui"], 1, 6],
  ["Come va inviato un preventivo High-Ticket?", ["Scrivendo il prezzo direttamente in chat", "Come PDF elegante accompagnato da un messaggio vocale", "Tramite SMS", "Solo a voce al telefono"], 1, 6],
  ["Il cliente visualizza e non risponde. Cosa fare?", ["Scrivere subito \"Hai letto il preventivo?\"", "Attendere 48h e inviare un follow-up di valore senza menzionare il silenzio", "Abbassare immediatamente il prezzo", "Chiamarlo ripetutamente"], 1, 6],
  // Lezione 7 - Sourcing, contratti e pricing
  ["A cosa serve l'NCA (Non-Circumvention Agreement)?", ["A garantire l'assicurazione dell'auto", "A vietare al fornitore di acquisire direttamente i clienti portati dal broker", "A fissare il prezzo della cauzione", "A registrare la società"], 1, 7],
  ["Qual è il markup tipico del broker nel mercato del lusso sul prezzo netto B2B?", ["Dal 2% al 5%", "Dal 15% al 35%", "Dal 50% al 100%", "Nessun markup"], 1, 7],
  ["Perché il modello di pagamento \"Broker (In-House)\" è considerato il migliore?", ["Perché il cliente paga direttamente il fornitore", "Perché il broker incassa il 100% e mantiene il controllo su flusso di cassa e pricing", "Perché non richiede fatture", "Perché elimina la cauzione"], 1, 7],
  ["Che tipo di fornitore va preferito?", ["Chi sub-affitta auto di altri", "Chi è proprietario del parco auto", "Chi ha il prezzo più basso a prescindere", "Chi non firma contratti"], 1, 7],
  // Lezione 8 - Customer Journey
  ["Cosa prevede la \"Regola dei 60 Minuti\" nella consegna da remoto?", ["Il cliente deve arrivare un'ora prima", "Il fornitore deve essere sul luogo 1 ora prima e inviare foto/video dell'auto pronta", "La consegna deve durare al massimo 60 minuti", "Il broker chiama il cliente ogni ora"], 1, 8],
  ["Come gestire un volo del cliente in ritardo?", ["Chiedere al cliente quando atterrerà", "Monitorare con FlightRadar24, riprogrammare l'autista e rassicurare il cliente in anticipo", "Annullare la consegna", "Far attendere l'autista senza avvisare nessuno"], 1, 8],
  // Lezione 9 - Sourcing avanzato e cross-selling
  ["Se l'auto richiesta è irreperibile, il Top Broker:", ["Dice subito \"Non è disponibile\"", "Prende tempo e, se serve, propone un upgrade, mai un ripiego al ribasso", "Propone un'auto più economica", "Consiglia un concorrente"], 1, 9],
  ["Perché è fondamentale la \"Regola della Pluralità\" dei fornitori?", ["Per avere più fatture", "Perché un solo fornitore crea dipendenza; più opzioni danno potere contrattuale", "Perché è obbligatorio per legge", "Per ridurre il markup"], 1, 9],
  ["Qual è il momento migliore per proporre servizi complementari (cross-selling)?", ["Prima di presentare l'auto", "Dopo che il cliente ha confermato l'auto ed è soddisfatto", "Mai, rovina la vendita", "Solo dopo la riconsegna"], 1, 9],
  // Lezione 10 - API
  ["Per quale mercato si usano le connessioni API?", ["Per il brokeraggio di lusso High-Ticket", "Per il mercato Standard ad alto volume (utilitarie, berline medie)", "Solo per gli yacht", "Per le hypercar da collezione"], 1, 10],
  ["Qual è il requisito per ottenere le chiavi API da colossi come Sixt o Enterprise?", ["Basta essere persona fisica", "Avere una società registrata in Italia (Partita IVA, Visura Camerale) e contratti B2B", "Avere 10.000 follower", "Possedere almeno 10 auto"], 1, 10],
  // Lezione 11 - Network d'Elite
  ["Qual è la Referral Fee tipica da riconoscere ai partner (Gatekeeper)?", ["Tra il 10% e il 15% dell'utile netto", "Il 50% del fatturato", "Una cifra fissa anticipata", "Nessun compenso"], 0, 11],
  // Lezione 12 - Ritenzione e LTV
  ["Come si fidelizza il cliente nel lusso secondo il programma \"Members Only\"?", ["Con sconti progressivi", "Offrendo privilegi esclusivi (upgrade, priorità, zero deposito) invece di sconti", "Con coupon via email", "Aumentando il numero di newsletter"], 1, 12]
];

let examAnswers = [];
let examIndex = 0;

function getExamResult() {
  try { return JSON.parse(localStorage.getItem(EXAM_STORAGE_KEY)); } catch (e) { return null; }
}

function injectExamStyles() {
  if (document.getElementById('academyExamStyles')) return;
  const s = document.createElement('style');
  s.id = 'academyExamStyles';
  s.textContent = `
  .exam-overlay{position:fixed;inset:0;z-index:999999;background:rgba(5,8,7,.88);backdrop-filter:blur(14px);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:opacity .35s ease;font-family:inherit}
  .exam-overlay.show{opacity:1}
  .exam-card{width:100%;max-width:760px;max-height:92vh;overflow-y:auto;background:linear-gradient(160deg,rgba(22,28,25,.97),rgba(10,14,12,.98));border:1px solid rgba(46,204,113,.25);border-radius:20px;box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 40px rgba(46,204,113,.08);padding:36px;color:#f3f5f4;transform:translateY(20px);transition:transform .35s ease}
  .exam-overlay.show .exam-card{transform:translateY(0)}
  .exam-kicker{font-size:.75rem;letter-spacing:.18em;text-transform:uppercase;color:#2ecc71;font-weight:700;margin-bottom:10px;display:flex;align-items:center;gap:8px}
  .exam-card h2{font-size:1.7rem;margin:0 0 12px;line-height:1.25}
  .exam-card p.exam-sub{color:rgba(255,255,255,.65);line-height:1.6;margin:0 0 22px}
  .exam-progress{height:6px;background:rgba(255,255,255,.08);border-radius:10px;overflow:hidden;margin:6px 0 24px}
  .exam-progress-fill{height:100%;background:linear-gradient(90deg,#009246,#2ecc71);transition:width .35s ease}
  .exam-meta{display:flex;justify-content:space-between;font-size:.82rem;color:rgba(255,255,255,.55)}
  .exam-question{font-size:1.2rem;font-weight:600;line-height:1.45;margin:0 0 20px}
  .exam-options{display:flex;flex-direction:column;gap:12px}
  .exam-option{display:flex;align-items:center;gap:14px;text-align:left;width:100%;padding:15px 18px;border-radius:12px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.03);color:#f3f5f4;font-size:.98rem;cursor:pointer;transition:all .2s ease;font-family:inherit}
  .exam-option:hover{border-color:rgba(46,204,113,.5);background:rgba(46,204,113,.06);transform:translateX(3px)}
  .exam-option.selected{border-color:#2ecc71;background:rgba(46,204,113,.14);box-shadow:0 0 18px rgba(46,204,113,.15)}
  .exam-letter{flex:0 0 30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.07);font-weight:700;font-size:.85rem}
  .exam-option.selected .exam-letter{background:#2ecc71;color:#000}
  .exam-actions{display:flex;justify-content:space-between;gap:12px;margin-top:26px;flex-wrap:wrap}
  .exam-btn{padding:13px 24px;border-radius:10px;border:1px solid rgba(255,255,255,.15);background:rgba(255,255,255,.05);color:#fff;font-weight:600;cursor:pointer;font-size:.95rem;display:inline-flex;align-items:center;gap:8px;transition:all .2s ease;font-family:inherit}
  .exam-btn:hover:not(:disabled){background:rgba(255,255,255,.1)}
  .exam-btn:disabled{opacity:.4;cursor:not-allowed}
  .exam-btn.primary{background:linear-gradient(135deg,#009246,#2ecc71);border:none;color:#04140b;box-shadow:0 8px 24px rgba(46,204,113,.25)}
  .exam-btn.primary:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 12px 30px rgba(46,204,113,.35)}
  .exam-rules{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:0 0 26px}
  .exam-rule{padding:16px;border-radius:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);text-align:center}
  .exam-rule strong{display:block;font-size:1.5rem;color:#2ecc71}
  .exam-rule span{font-size:.8rem;color:rgba(255,255,255,.6)}
  .exam-score{width:150px;height:150px;border-radius:50%;margin:10px auto 22px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:2.4rem;font-weight:800}
  .exam-score small{font-size:.8rem;font-weight:500;opacity:.7}
  .exam-review{margin-top:24px;display:flex;flex-direction:column;gap:10px}
  .exam-review-item{padding:12px 14px;border-radius:10px;font-size:.88rem;line-height:1.5;background:rgba(255,255,255,.03);border-left:3px solid}
  .exam-review-item.ok{border-color:#2ecc71}
  .exam-review-item.ko{border-color:#e74c3c}
  .exam-review-item em{color:rgba(255,255,255,.55);font-style:normal}
  .exam-close{position:absolute;top:18px;right:22px;background:none;border:none;color:rgba(255,255,255,.5);font-size:1.5rem;cursor:pointer}
  .exam-launch{margin-top:16px;width:100%;justify-content:center}
  @media(max-width:600px){.exam-card{padding:24px}.exam-rules{grid-template-columns:1fr}.exam-card h2{font-size:1.35rem}}
  `;
  document.head.appendChild(s);
}

function getExamOverlay() {
  injectExamStyles();
  let ov = document.getElementById('academyExamOverlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'academyExamOverlay';
    ov.className = 'exam-overlay';
    ov.innerHTML = '<div class="exam-card" id="academyExamCard" style="position:relative"></div>';
    document.body.appendChild(ov);
    requestAnimationFrame(() => ov.classList.add('show'));
  }
  document.body.style.overflow = 'hidden';
  return document.getElementById('academyExamCard');
}

function closeExam() {
  const ov = document.getElementById('academyExamOverlay');
  if (!ov) return;
  ov.classList.remove('show');
  setTimeout(() => ov.remove(), 350);
  document.body.style.overflow = 'auto';
  renderExamLauncher();
}

function openExamIntro() {
  const card = getExamOverlay();
  const prev = getExamResult();
  card.innerHTML = `
    <button class="exam-close" id="examCloseBtn" aria-label="Chiudi"><i class="ri-close-line"></i></button>
    <div class="exam-kicker"><i class="ri-medal-fill"></i> Percorso completato</div>
    <h2>Esame Finale di Certificazione Itercars</h2>
    <p class="exam-sub">Complimenti, hai concluso tutte le 12 lezioni! Ora metti alla prova le competenze tecniche per strutturare il tuo business di brokeraggio luxury.</p>
    <div class="exam-rules">
      <div class="exam-rule"><strong>${examQuestions.length}</strong><span>Domande a risposta multipla</span></div>
      <div class="exam-rule"><strong>${EXAM_PASS_PERCENT}%</strong><span>Soglia minima per superarlo</span></div>
      <div class="exam-rule"><strong>12</strong><span>Lezioni coperte</span></div>
    </div>
    ${prev ? `<p class="exam-sub">Ultimo tentativo: <strong style="color:${prev.passed ? '#2ecc71' : '#e74c3c'}">${prev.percent}% – ${prev.passed ? 'Superato' : 'Non superato'}</strong></p>` : ''}
    <div class="exam-actions">
      <button class="exam-btn" id="examLaterBtn">Più tardi</button>
      <button class="exam-btn primary" id="examStartBtn"><i class="ri-play-fill"></i> Inizia il test</button>
    </div>`;
  document.getElementById('examCloseBtn').onclick = closeExam;
  document.getElementById('examLaterBtn').onclick = closeExam;
  document.getElementById('examStartBtn').onclick = startExam;
}

function startExam() {
  examAnswers = new Array(examQuestions.length).fill(null);
  examIndex = 0;
  renderExamQuestion();
}

function renderExamQuestion() {
  const card = getExamOverlay();
  const [q, opts, , lesson] = examQuestions[examIndex];
  const answered = examAnswers.filter(a => a !== null).length;
  const isLast = examIndex === examQuestions.length - 1;
  card.innerHTML = `
    <button class="exam-close" id="examCloseBtn" aria-label="Chiudi"><i class="ri-close-line"></i></button>
    <div class="exam-meta"><span>Domanda ${examIndex + 1} di ${examQuestions.length}</span><span>Lezione ${lesson} • ${answered} risposte date</span></div>
    <div class="exam-progress"><div class="exam-progress-fill" style="width:${((examIndex + 1) / examQuestions.length) * 100}%"></div></div>
    <p class="exam-question">${q}</p>
    <div class="exam-options">
      ${opts.map((o, i) => `<button class="exam-option ${examAnswers[examIndex] === i ? 'selected' : ''}" data-i="${i}" id="examOpt${i}"><span class="exam-letter">${'ABCD'[i]}</span><span>${o}</span></button>`).join('')}
    </div>
    <div class="exam-actions">
      <button class="exam-btn" id="examPrevBtn" ${examIndex === 0 ? 'disabled' : ''}><i class="ri-arrow-left-line"></i> Indietro</button>
      <button class="exam-btn primary" id="examNextBtn" ${examAnswers[examIndex] === null ? 'disabled' : ''}>${isLast ? '<i class="ri-check-double-line"></i> Consegna il test' : 'Avanti <i class="ri-arrow-right-line"></i>'}</button>
    </div>`;

  card.querySelectorAll('.exam-option').forEach(btn => {
    btn.onclick = () => {
      examAnswers[examIndex] = parseInt(btn.dataset.i);
      card.querySelectorAll('.exam-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      document.getElementById('examNextBtn').disabled = false;
    };
  });
  document.getElementById('examCloseBtn').onclick = () => {
    if (confirm('Vuoi abbandonare il test? Le risposte date andranno perse.')) closeExam();
  };
  document.getElementById('examPrevBtn').onclick = () => { if (examIndex > 0) { examIndex--; renderExamQuestion(); } };
  document.getElementById('examNextBtn').onclick = () => {
    if (examAnswers[examIndex] === null) return;
    if (isLast) submitExam();
    else { examIndex++; renderExamQuestion(); }
  };
}

function submitExam() {
  const correct = examQuestions.reduce((n, q, i) => n + (examAnswers[i] === q[2] ? 1 : 0), 0);
  const percent = Math.round((correct / examQuestions.length) * 100);
  const passed = percent >= EXAM_PASS_PERCENT;
  const result = { correct, total: examQuestions.length, percent, passed, date: new Date().toISOString() };
  // Mantiene il superamento se già ottenuto in passato
  const prev = getExamResult();
  if (!(prev && prev.passed && !passed)) localStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify(result));
  renderExamResult(result);
}

function renderExamResult(r) {
  const card = getExamOverlay();
  const color = r.passed ? '#2ecc71' : '#e74c3c';
  const review = examQuestions.map((q, i) => {
    const ok = examAnswers[i] === q[2];
    return `<div class="exam-review-item ${ok ? 'ok' : 'ko'}"><strong>${i + 1}. ${q[0]}</strong><br>
      ${ok ? `<em>✓ ${q[1][q[2]]}</em>` : `<em>La tua risposta: ${q[1][examAnswers[i]] ?? '—'}</em><br><span style="color:#2ecc71">Corretta: ${q[1][q[2]]}</span> <em>(Lezione ${q[3]})</em>`}</div>`;
  }).join('');
  card.innerHTML = `
    <button class="exam-close" id="examCloseBtn" aria-label="Chiudi"><i class="ri-close-line"></i></button>
    <div class="exam-kicker" style="color:${color}"><i class="ri-${r.passed ? 'award-fill' : 'error-warning-fill'}"></i> Esito esame</div>
    <h2>${r.passed ? 'Test superato! Sei un Itercars Certified Broker' : 'Test non superato'}</h2>
    <div class="exam-score" style="border:6px solid ${color};box-shadow:0 0 40px ${color}40;color:${color}">${r.percent}%<small>${r.correct}/${r.total} corrette</small></div>
    <p class="exam-sub" style="text-align:center">${r.passed
      ? 'Hai dimostrato di padroneggiare le competenze tecniche per strutturare il tuo business di brokeraggio. Il superamento è stato registrato.'
      : `Serve almeno il ${EXAM_PASS_PERCENT}% di risposte corrette. Ripassa le lezioni indicate qui sotto e riprova quando vuoi.`}</p>
    <div class="exam-actions" style="justify-content:center">
      ${r.passed ? '' : '<button class="exam-btn primary" id="examRetryBtn"><i class="ri-restart-line"></i> Riprova il test</button>'}
      <button class="exam-btn ${r.passed ? 'primary' : ''}" id="examDoneBtn">Chiudi</button>
    </div>
    <div class="exam-review">${review}</div>`;
  document.getElementById('examCloseBtn').onclick = closeExam;
  document.getElementById('examDoneBtn').onclick = closeExam;
  const retry = document.getElementById('examRetryBtn');
  if (retry) retry.onclick = startExam;
  if (typeof showToast === 'function') showToast(r.passed ? `🏆 Esame superato con il ${r.percent}%!` : `❌ Esame non superato (${r.percent}%). Riprova!`, !r.passed);
}

// Pulsante permanente nella dashboard quando tutte le lezioni sono completate
function renderExamLauncher() {
  const done = parseInt(localStorage.getItem('itercars_academy_course_completed')) === 1;
  let btn = document.getElementById('examLauncherBtn');
  if (!done) { if (btn) btn.remove(); return; }
  const anchor = document.getElementById('completeLessonBtn');
  if (!anchor) return;
  injectExamStyles();
  if (!btn) {
    btn = document.createElement('button');
    btn.id = 'examLauncherBtn';
    btn.className = 'exam-btn primary exam-launch';
    btn.onclick = openExamIntro;
    anchor.insertAdjacentElement('afterend', btn);
  }
  const r = getExamResult();
  btn.innerHTML = r && r.passed
    ? `<i class="ri-award-fill"></i> Esame Finale Superato (${r.percent}%) – Rivedi`
    : '<i class="ri-file-list-3-fill"></i> Accedi all\'Esame Finale (30 domande)';
}

function onCourseCompleted() {
  localStorage.setItem('itercars_academy_course_completed', 1);
  renderExamLauncher();
  setTimeout(openExamIntro, 1200);
}

window.openExamIntro = openExamIntro;
window.onCourseCompleted = onCourseCompleted;
window.renderExamLauncher = renderExamLauncher;

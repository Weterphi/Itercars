import codecs

css_path = r'c:\Users\alber\Desktop\LuxuryCar\nlt-dettaglio.css'

print_css = """

/* ==========================================================================
   STAMPA PREVENTIVO PDF
   ========================================================================== */
@media print {
  /* Nascondi tutto ciò che non serve */
  body * {
    visibility: hidden;
  }
  
  /* Ripristina la visibilità solo per il contenitore ufficiale e i suoi figli */
  #officialQuoteContainer, #officialQuoteContainer * {
    visibility: visible;
  }
  
  /* Posiziona il contenitore in cima alla pagina per una stampa pulita */
  #officialQuoteContainer {
    position: absolute !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    background: #fff !important;
  }
  
  /* Override degli stili scuri inline per la stampa (risparmio inchiostro, leggibilità massima) */
  .quote-result-card {
    background: #fff !important;
    color: #000 !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* Forza il testo nero ovunque all'interno del preventivo */
  #officialQuoteContainer div,
  #officialQuoteContainer span,
  #officialQuoteContainer strong {
    color: #000 !important;
  }
  
  /* Mantieni solo i colori d'accento (es. i prezzi o le etichette principali) */
  #officialQuoteContainer span[style*="color: var(--accent-primary)"],
  #officialQuoteContainer span[style*="color: #2ecc71"],
  #officialQuoteContainer div[style*="color: #2ecc71"] {
    color: #009246 !important;
  }

  /* Rendi gli sfondi semitrasparenti dei box molto più chiari o bordati per la carta */
  #officialQuoteContainer > div > div[style*="background: rgba(255,255,255,0.03)"] {
    background: #f9f9f9 !important;
    border: 1px solid #ccc !important;
  }
  
  #officialQuoteContainer > div > div[style*="background: rgba(0, 146, 70, 0.14)"] {
    background: #f0fdf4 !important;
    border: 2px solid #009246 !important;
  }

  /* Nascondi l'ombra verde sfocata di sfondo */
  #officialQuoteContainer > div > div[style*="filter: blur"] {
    display: none !important;
  }

  /* Nascondi i bottoni finali (Stampa, WhatsApp, Torna Indietro) in fase di stampa */
  #officialQuoteContainer .btn,
  #officialQuoteContainer button,
  #officialQuoteContainer a {
    display: none !important;
  }
  
  /* Rimuovi margini della pagina stampata */
  @page {
    margin: 1cm;
  }
}
"""

with codecs.open(css_path, 'a', 'utf-8') as f:
    f.write(print_css)

print("Appended print CSS")

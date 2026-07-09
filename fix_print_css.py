import re
import codecs

css_path = r'c:\Users\alber\Desktop\LuxuryCar\nlt-dettaglio.css'

with codecs.open(css_path, 'r', 'utf-8') as f:
    content = f.read()

# Rimuovi il vecchio blocco @media print se esiste
content = re.sub(r'/\* =+ \n\s*STAMPA PREVENTIVO PDF\n\s*=+ \*/\n@media print \{.*?\}\n\}', '', content, flags=re.DOTALL)
# Anche con un semplice @media print senza header
content = re.sub(r'@media print\s*\{[\s\S]*\}\n?$', '', content)

new_print_css = """

/* ==========================================================================
   STAMPA PREVENTIVO PDF
   ========================================================================== */
@media print {
  /* Disabilita completamente il layout della pagina per non lasciare pagine vuote */
  body {
    background: #fff !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  /* Nascondi tutto */
  body > * {
    display: none !important;
  }

  /* Mostra SOLO la section che contiene il preventivo */
  body > section.nlt-detail-header {
    display: block !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  
  /* All'interno della section, nascondi container e flexbox vari tranne il preventivo */
  .nlt-breadcrumb, .nlt-detail-grid {
    display: none !important;
  }

  #officialQuoteContainer {
    display: block !important;
    position: relative !important;
    left: 0 !important;
    top: 0 !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
    background: #fff !important;
    page-break-inside: avoid;
  }
  
  /* Forza la visualizzazione di immagini */
  img {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    display: block !important;
    max-width: 100% !important;
  }

  /* Override degli stili scuri inline */
  .quote-result-card {
    background: #fff !important;
    color: #000 !important;
    border: none !important;
    padding: 0 !important;
    margin: 0 !important;
    box-shadow: none !important;
  }

  /* Testi neri */
  #officialQuoteContainer div,
  #officialQuoteContainer span,
  #officialQuoteContainer strong {
    color: #000 !important;
  }
  
  /* Colori d'accento */
  #officialQuoteContainer span[style*="color: var(--accent-primary)"],
  #officialQuoteContainer span[style*="color: #2ecc71"],
  #officialQuoteContainer div[style*="color: #2ecc71"] {
    color: #009246 !important;
  }

  /* Sfondi leggeri */
  #officialQuoteContainer > div > div[style*="background: rgba(255,255,255,0.03)"] {
    background: #f9f9f9 !important;
    border: 1px solid #ccc !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  
  #officialQuoteContainer > div > div[style*="background: rgba(0, 146, 70, 0.14)"] {
    background: #f0fdf4 !important;
    border: 2px solid #009246 !important;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Rimuovi ombre */
  #officialQuoteContainer > div > div[style*="filter: blur"] {
    display: none !important;
  }

  /* Nascondi bottoni */
  #officialQuoteContainer .btn,
  #officialQuoteContainer button,
  #officialQuoteContainer a {
    display: none !important;
  }
  
  @page {
    margin: 1cm;
    size: auto;
  }
}
"""

with codecs.open(css_path, 'w', 'utf-8') as f:
    f.write(content + new_print_css)

print("Updated print CSS to fix pages and images")

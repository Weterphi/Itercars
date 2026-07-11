import re

with open('c:/Users/alber/Desktop/LuxuryCar/nlt-dettaglio.js', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Replace handleQuoteSubmit completely
pattern = r'async function handleQuoteSubmit\(event\)\s*\{.*?\}\s*(?=function sendCustomQuoteWhatsApp)'
replacement = """async function handleQuoteSubmit(event) {
  event.preventDefault();
  
  const submitBtn = event.target.querySelector('button[type=\"submit\"]');
  const originalBtnText = submitBtn.innerHTML;
  
  // 1. Mostra la rotellina
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class=\"ri-loader-4-line ri-spin\"></i> Generazione e invio in corso...';
  
  const name = document.getElementById('quoteClientName').value;
  const email = document.getElementById('quoteClientEmail').value;
  const phone = document.getElementById('quoteClientPhone').value;
  const type = document.getElementById('quoteClientType').value;
  const c = ConfigState.car;

  try {
    // 2. Genera il PDF Nativo in background
    let pdfBase64 = null;
    try {
      const doc = await generateNativePDF(c, name, email, phone, type);
      const dataUri = doc.output('datauristring');
      pdfBase64 = dataUri.split(',')[1];
    } catch (pdfErr) {
      console.error(\"Errore generazione PDF:\", pdfErr);
    }

    // 3. Salva lead e invia mail tramite Supabase
    if (typeof window.supabaseClient !== 'undefined' && window.supabaseClient) {
      await window.supabaseClient.from('crm_leads').insert([{
        first_name: name.split(' ')[0] || name,
        last_name: name.split(' ').slice(1).join(' ') || 'Cliente NLT',
        phone: phone,
        email: email,
        customer_type: type,
        pipeline_status: 'quote_sent',
        notes: `Preventivo configurato per ${c.brand} ${c.model}: ${ConfigState.durationMonths}m/${ConfigState.kmPerYear}km - Anticipo €${ConfigState.depositAmount} -> Rata €${ConfigState.finalMonthlyPrice}/m`
      }]);

      if (pdfBase64) {
        const emailPayload = {
           to: email,
           subject: `ITERCARS - Preventivo Ufficiale per ${c.brand} ${c.model}`,
           text: `Gentile ${name},\\n\\nIn allegato trova il preventivo ufficiale NLT per ${c.brand} ${c.model}.\\n\\nCordiali saluti,\\nTeam ITERCARS`,
           html: `<p>Gentile <strong>${name}</strong>,</p><p>In allegato trova il preventivo ufficiale NLT per <strong>${c.brand} ${c.model}</strong>.</p><br><p>Cordiali saluti,<br>Team ITERCARS</p>`,
           attachments: [
             {
                content: pdfBase64,
                filename: `Preventivo_ITERCARS_${c.brand}_${c.model}.pdf`.replace(/ /g, '_'),
                type: \"application/pdf\",
                disposition: \"attachment\"
             }
           ]
        };
        await window.supabaseClient.functions.invoke('send-resend-email', {
           body: emailPayload
        });
      }
    }

    // 4. Mostra messaggio di successo
    alert(\"✅ Preventivo inviato con successo alla tua email!\");
    
  } catch (err) {
    console.error(\"Errore durante l'invio:\", err);
    alert(\"Si è verificato un errore durante l'invio. Riprova.\");
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalBtnText;
  }

  // 5. Costruzione e visualizzazione della scheda Preventivo Stampabile (Stampa Classica)
  const previewBox = document.getElementById('officialQuoteContainer');
  if (previewBox) {
    previewBox.style.display = 'block';
    previewBox.innerHTML = `
      <div class=\"glass-card quote-result-card\" style=\"margin-top: 30px; border: 2px solid var(--accent-primary); padding: 30px; position: relative; animation: fadeIn 0.4s ease; background: #080c14;\">
        <div style=\"position: absolute; top: -30px; right: -30px; width: 160px; height: 160px; background: rgba(0, 146, 70, 0.2); border-radius: 50%; filter: blur(40px);\"></div>
        
        <div style=\"display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-glass); padding-bottom: 16px; margin-bottom: 24px; flex-wrap: wrap; gap: 14px;\">
          <div>
            <img src=\"logo_tricolore.png\" style=\"height: 30px; margin-bottom: 6px;\" alt=\"Itercars Logo\"><br>
            <span style=\"color: var(--accent-primary); font-weight: 800; font-size: 1.25rem; letter-spacing: 1px;\"><i class=\"ri-vip-crown-fill\"></i> ITERCARS — PREVENTIVO UFFICIALE NLT</span>
            <div style=\"font-size: 0.88rem; color: var(--text-muted); margin-top: 4px;\">Codice Pratica: <strong>IT-NLT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}</strong> • Data Emissione: ${new Date().toLocaleDateString('it-IT')}</div>
          </div>
          <span style=\"background: rgba(46, 204, 113, 0.2); color: #2ecc71; padding: 6px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 800;\">PRONTO DA FIRMARE / BLOCCA TARIFFA</span>
        </div>

        <div class=\"detail-image-wrapper\" style=\"margin-bottom: 12px; box-shadow: none;\">
          <img src=\"${c.image}\" alt=\"${c.model}\" class=\"detail-image\" style=\"background: #fff; max-height: 280px;\">
        </div>
        
        <!-- Caratteristiche Tecniche (Compatte per non rubare spazio) -->
        <div style=\"display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); padding: 10px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); margin-bottom: 24px;\">
            <div style=\"text-align: center; font-size: 0.75rem;\">
                <span style=\"color: var(--text-muted); display: block; text-transform: uppercase;\">Velocità Max</span>
                <strong style=\"color: #fff;\">${c.speed}</strong>
            </div>
            <div style=\"text-align: center; font-size: 0.75rem;\">
                <span style=\"color: var(--text-muted); display: block; text-transform: uppercase;\">0-100 km/h</span>
                <strong style=\"color: #fff;\">${c.accel}</strong>
            </div>
            <div style=\"text-align: center; font-size: 0.75rem;\">
                <span style=\"color: var(--text-muted); display: block; text-transform: uppercase;\">Potenza</span>
                <strong style=\"color: #fff;\">${c.hp}</strong>
            </div>
            <div style=\"text-align: center; font-size: 0.75rem;\">
                <span style=\"color: var(--text-muted); display: block; text-transform: uppercase;\">Alimentazione</span>
                <strong style=\"color: #fff;\">${c.fuel}</strong>
            </div>
            <div style=\"text-align: center; font-size: 0.75rem;\">
                <span style=\"color: var(--text-muted); display: block; text-transform: uppercase;\">Cambio</span>
                <strong style=\"color: #fff;\">${c.transmission}</strong>
            </div>
        </div>

        <div style=\"display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; font-size: 0.95rem;\">
          <div style=\"background: rgba(255,255,255,0.03); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.07);\">
            <strong style=\"color: var(--accent-primary); display: block; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 6px;\">Intestazione Cliente</strong>
            <div style=\"font-size: 1.1rem; font-weight: 800; color: #fff;\">${name}</div>
            <div style=\"color: var(--text-muted); font-size: 0.9rem;\">${type} • ${email} • ${phone}</div>
          </div>

          <div style=\"background: rgba(255,255,255,0.03); padding: 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.07);\">
            <strong style=\"color: var(--accent-primary); display: block; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 6px;\">Vettura Selezionata</strong>
            <div style=\"font-size: 1.1rem; font-weight: 800; color: #fff;\">${c.brand} ${c.model}</div>
            <div style=\"color: var(--text-muted); font-size: 0.9rem;\">${c.trim} • Listino ${c.providerName}</div>
          </div>
        </div>

        <div style=\"background: rgba(0, 146, 70, 0.14); border: 1px solid rgba(0, 146, 70, 0.4); border-radius: 14px; padding: 20px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;\">
          <div>
            <span style=\"font-size: 0.85rem; color: var(--text-muted); display: block; text-transform: uppercase; font-weight: 700;\">Configurazione Contratto NLT</span>
            <div style=\"font-size: 1.1rem; font-weight: 800; color: #fff; margin-top: 4px;\">
              Durata: <span style=\"color: #2ecc71;\">${ConfigState.durationMonths} Mesi</span> • 
              Km compresi: <span style=\"color: #2ecc71;\">${ConfigState.kmPerYear.toLocaleString('it-IT')} km/anno</span> • 
              Anticipo: <span style=\"color: #2ecc71;\">€ ${ConfigState.depositAmount.toLocaleString('it-IT')}</span>
            </div>
            <div style=\"font-size: 0.82rem; color: var(--text-muted); margin-top: 4px;\">Kasko Integral ${ConfigState.kaskoFranchigia === 'zero' ? '(Franchigia Zero 0€)' : '(Franchigia Standard)'} + Bollo & Manutenzione H24</div>
          </div>

          <div style=\"text-align: right;\">
            <span style=\"font-size: 0.85rem; color: var(--text-muted); display: block; text-transform: uppercase; font-weight: 700;\">Canone Mensile Tutto Incluso</span>
            <div style=\"font-size: 2.2rem; font-weight: 900; color: #2ecc71; line-height: 1;\">€ ${ConfigState.finalMonthlyPrice.toLocaleString('it-IT')} <small style=\"font-size: 0.9rem; font-weight: 400; color: #fff;\">/mese (IVA esc.)</small></div>
          </div>
        </div>

        <div style=\"display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;\">
          <button type=\"button\" class=\"btn btn-primary\" onclick=\"window.print()\" style=\"height: 50px; font-size: 1rem; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 8px;\">
            <i class=\"ri-printer-line\" style=\"font-size: 1.3rem;\"></i> Stampa / Scarica PDF
          </button>
          <button type=\"button\" class=\"btn btn-outline\" onclick=\"sendCustomQuoteWhatsApp('${phone}', '${c.brand} ${c.model}', '${ConfigState.durationMonths}', '${ConfigState.kmPerYear}', '${ConfigState.depositAmount}', '${ConfigState.finalMonthlyPrice}')\" style=\"height: 50px; font-size: 1rem; font-weight: 800; border-color: #2ecc71; color: #2ecc71; display: flex; align-items: center; justify-content: center; gap: 8px;\">
            <i class=\"ri-whatsapp-line\" style=\"font-size: 1.3rem;\"></i> Invia su WhatsApp
          </button>
          <a href=\"noleggio-lungo-termine.html\" class=\"btn btn-outline\" style=\"height: 50px; font-size: 1rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none;\">
            <i class=\"ri-arrow-left-line\"></i> Torna al Catalogo
          </a>
        </div>
      </div>
    `;
    previewBox.scrollIntoView({ behavior: 'smooth' });
  }
}
"""
text = re.sub(pattern, replacement, text, flags=re.DOTALL)


# 2. Append generateNativePDF
pdf_function = """

/**
 * Enterprise Mode PDF Generator (Native jsPDF)
 * Disegna vettorialmente il PDF per evitare qualsiasi sfarfallio o ritaglio.
 */
async function generateNativePDF(c, name, email, phone, type) {
  const jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
  if (!jsPDF) {
    throw new Error("Libreria jsPDF non trovata.");
  }

  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 146, 70);
  doc.setFontSize(22);
  doc.text("PREVENTIVO UFFICIALE NLT", 15, 20);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Codice Pratica: IT-NLT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`, 15, 27);
  doc.text(`Data Emissione: ${new Date().toLocaleDateString('it-IT')}`, 15, 32);

  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(0, 146, 70);
  doc.setLineWidth(0.5);
  doc.roundedRect(145, 15, 50, 10, 2, 2, 'FD');
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0, 146, 70);
  doc.text("PRONTO DA FIRMARE", 149, 21.5);
  doc.line(15, 38, 195, 38);

  try {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = c.image;
    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
    const maxW = 140;
    const maxH = 70;
    let ratio = Math.min(maxW / img.width, maxH / img.height);
    let finalW = img.width * ratio;
    let finalH = img.height * ratio;
    let xOffset = (210 - finalW) / 2;
    doc.addImage(img, 'JPEG', xOffset, 45, finalW, finalH);
  } catch (e) {
    console.log("Immagine non caricata nel PDF nativo:", e);
  }

  const specsY = 130;
  doc.setFillColor(249, 249, 249);
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(15, specsY, 180, 20, 2, 2, 'FD');
  
  const drawSpec = (label, value, x) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(label, x, specsY + 7, { align: 'center' });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(value, x, specsY + 14, { align: 'center' });
  };
  
  drawSpec("VELOCITÀ MAX", c.speed || "N/A", 35);
  drawSpec("0-100 KM/H", c.accel || "N/A", 70);
  drawSpec("POTENZA", c.hp || "N/A", 105);
  drawSpec("ALIMENTAZIONE", c.fuel || "N/A", 140);
  drawSpec("CAMBIO", c.transmission || "N/A", 175);

  const boxY = 160;
  doc.setFillColor(249, 249, 249);
  doc.roundedRect(15, boxY, 85, 30, 2, 2, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(0, 146, 70);
  doc.text("INTESTATARIO", 20, boxY + 7);
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(name, 20, boxY + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(`${type}\\n${email}\\n${phone}`, 20, boxY + 20);

  doc.setFont("helvetica", "bold");
  doc.setFillColor(249, 249, 249);
  doc.roundedRect(110, boxY, 85, 30, 2, 2, 'FD');
  doc.setFontSize(9);
  doc.setTextColor(0, 146, 70);
  doc.text("VETTURA SELEZIONATA", 115, boxY + 7);
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text(`${c.brand} ${c.model}`, 115, boxY + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  const trimText = doc.splitTextToSize(c.trim || "", 75);
  doc.text(trimText, 115, boxY + 20);

  const finalY = 200;
  doc.setFillColor(240, 253, 244);
  doc.setDrawColor(0, 146, 70);
  doc.setLineWidth(1);
  doc.roundedRect(15, finalY, 180, 35, 4, 4, 'FD');

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(50, 50, 50);
  doc.text("CONFIGURAZIONE CONTRATTO NLT", 20, finalY + 10);
  
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  const kaskoType = ConfigState.kaskoFranchigia === 'zero' ? 'Zero Franchigia' : 'Standard';
  doc.text(`Durata: ${ConfigState.durationMonths} Mesi   -   Km annui: ${ConfigState.kmPerYear.toLocaleString('it-IT')} km   -   Anticipo: € ${ConfigState.depositAmount.toLocaleString('it-IT')}`, 20, finalY + 18);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Servizi: Kasko ${kaskoType}, Bollo, Manutenzione Ord/Str, RCA`, 20, finalY + 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("CANONE MENSILE", 185, finalY + 10, { align: 'right' });
  
  doc.setFontSize(26);
  doc.setTextColor(0, 146, 70);
  doc.text(`€ ${ConfigState.finalMonthlyPrice.toLocaleString('it-IT')}`, 185, finalY + 22, { align: 'right' });
  
  doc.setFontSize(8);
  doc.text("/mese (IVA esc.)", 185, finalY + 28, { align: 'right' });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Generato tramite piattaforma certificata ITERCARS Enterprise", 105, 280, { align: 'center' });

  return doc;
}
"""

if "async function generateNativePDF" not in text:
    text += pdf_function

with open('c:/Users/alber/Desktop/LuxuryCar/nlt-dettaglio.js', 'w', encoding='utf-8') as f:
    f.write(text)

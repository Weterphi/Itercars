import re

with open('c:/Users/alber/Desktop/LuxuryCar/nlt-app.js', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace the onclick argument in handleGeneratePDFSubmit
text = text.replace(
    "onclick=\"downloadInstantPDF('${offer.brand} ${offer.model}')\"",
    "onclick=\"downloadInstantPDF('${offer.id}')\""
)

# Replace downloadInstantPDF implementation
pattern = r'function downloadInstantPDF\(carName\)\s*\{.*?\}(?=\s*function openWhatsAppForCard)'
replacement = """async function downloadInstantPDF(offerId) {
  const offer = NltState.offers.find(o => o.id === offerId);
  if (!offer) return;
  const priceInfo = getCardPrice(offer);
  
  const jsPDF = window.jspdf ? window.jspdf.jsPDF : window.jsPDF;
  if (!jsPDF) {
    alert("Libreria PDF non trovata.");
    return;
  }

  const name = document.getElementById('quoteClientName').value || 'Cliente';
  const email = document.getElementById('quoteClientEmail').value || '';
  const phone = document.getElementById('quoteClientPhone').value || '';
  const type = document.getElementById('quoteClientType').value || '';

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
    img.src = offer.image;
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
  
  drawSpec("VELOCITÀ MAX", offer.speed || "N/A", 35);
  drawSpec("0-100 KM/H", offer.accel || "N/A", 70);
  drawSpec("POTENZA", offer.hp || "N/A", 105);
  drawSpec("ALIMENTAZIONE", offer.fuel || "N/A", 140);
  drawSpec("CAMBIO", offer.transmission || "N/A", 175);

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
  doc.text(`${offer.brand} ${offer.model}`, 115, boxY + 14);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  const trimText = doc.splitTextToSize(offer.trim || "", 75);
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
  doc.text(`Configurazione: ${priceInfo.details}`, 20, finalY + 18);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Servizi inclusi: Kasko, Manutenzione e Bollo.`, 20, finalY + 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text("CANONE MENSILE", 185, finalY + 10, { align: 'right' });
  
  doc.setFontSize(26);
  doc.setTextColor(0, 146, 70);
  doc.text(`€ ${priceInfo.price.toLocaleString('it-IT')}`, 185, finalY + 22, { align: 'right' });
  
  doc.setFontSize(8);
  doc.text("/mese (IVA esc.)", 185, finalY + 28, { align: 'right' });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Generato tramite piattaforma certificata ITERCARS Enterprise", 105, 280, { align: 'center' });

  doc.save(`Preventivo_ITERCARS_${offer.brand}_${offer.model}.pdf`.replace(/ /g, '_'));
}
"""
text = re.sub(pattern, replacement, text, flags=re.DOTALL)

with open('c:/Users/alber/Desktop/LuxuryCar/nlt-app.js', 'w', encoding='utf-8') as f:
    f.write(text)

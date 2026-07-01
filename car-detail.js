/* ==========================================================================
   CAR DETAIL LOGIC
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Parsing the URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const carNameParam = urlParams.get('car');

  if (!carNameParam) {
    // Redirect back if no car is specified
    window.location.href = "index.html#flotta";
    return;
  }

  // Find the car in fleetData (which is loaded from app.js)
  const car = fleetData.find(c => c.name === carNameParam);

  if (!car) {
    // Car not found
    document.getElementById("detailCarName").innerText = "Veicolo non trovato";
    document.getElementById("detailDescription").innerText = "Siamo spiacenti, il veicolo richiesto non è al momento disponibile nella nostra flotta.";
    return;
  }

  // Populate the UI
  document.title = `${car.name} — Noleggio ITERCARS`;
  document.getElementById("detailCarName").innerText = car.name;
  document.getElementById("detailCarCategory").innerText = car.category;
  
  if (car.rating) {
    document.getElementById("detailCarRating").innerText = car.rating;
  }

  // Set the background image to match the home page hero
  const heroSection = document.getElementById("heroSection");
  if (heroSection) {
    heroSection.style.setProperty('--hero-bg', `url('${car.image}')`);
  }

  // Set the main presentation image
  const mainImage = document.getElementById("detailMainImage");
  if (mainImage) {
    mainImage.src = car.image;
    mainImage.alt = car.name;
  }

  // Badge rimosso
  const badgeContainer = document.getElementById("detailBadgeContainer");
  if (badgeContainer) badgeContainer.innerHTML = '';

  // Specs
  if (car.specs) {
    if (car.specs.speed) document.getElementById("specSpeed").innerText = car.specs.speed;
    if (car.specs.accel) document.getElementById("specAccel").innerText = car.specs.accel;
    if (car.specs.hp) document.getElementById("specHp").innerText = car.specs.hp;
  }

  // Motore
  const specEngine = document.getElementById("specEngine");
  if (specEngine) {
    specEngine.innerText = car.badge || "N/D";
  }

  // Posti (Calcolo intelligente in base a nome e categoria)
  let seats = "2";
  const nameLow = car.name.toLowerCase();
  const catLow = car.category.toLowerCase();
  
  if (catLow.includes("suv") || nameLow.includes("macan") || nameLow.includes("cayenne") || nameLow.includes("urus") || nameLow.includes("levante") || nameLow.includes("g63") || nameLow.includes("q8")) {
    seats = nameLow.includes("purosangue") ? "4" : "5";
  } else if (catLow.includes("berlin") || nameLow.includes("avant") || nameLow.includes("panamera") || nameLow.includes("amg gt 4") || nameLow.includes("m5") || nameLow.includes("rs3")) {
    seats = "5";
  } else if (nameLow.includes("roma") || nameLow.includes("portofino") || nameLow.includes("continental") || nameLow.includes("grancabrio") || nameLow.includes("911") || nameLow.includes("m8") || nameLow.includes("m4") || nameLow.includes("rs5")) {
    seats = "4";
  }
  
  const specSeats = document.getElementById("specSeats");
  if (specSeats) specSeats.innerText = seats;

  // Price
  document.getElementById("detailPrice").innerText = `€ ${car.price}`;
});

async function submitDetailBooking(event) {
  event.preventDefault();
  
  const carName = document.getElementById("detailCarName").innerText;
  const location = document.getElementById("detailLocation").value;
  const dateFrom = document.getElementById("detailDateFrom") ? document.getElementById("detailDateFrom").value : '';
  const dateTo = document.getElementById("detailDateTo") ? document.getElementById("detailDateTo").value : '';
  const name = document.getElementById("detailName").value;
  const email = document.getElementById("detailEmail") ? document.getElementById("detailEmail").value : '';
  const phone = document.getElementById("detailPhone").value;

  // Cache user data locally if available
  if (typeof cacheUserData === 'function') {
    cacheUserData(name, email, phone);
  }

  if (typeof showToast === 'function') {
    showToast(`⏳ Invio richiesta di disponibilità in corso per ${carName}...`);
  }
  
  const recipient = "info@itercars.com";
  
  if (typeof supabase !== 'undefined' && supabase) {
    try {
      supabase.from('availability_requests').insert([{
        name: name,
        phone: phone,
        email: email,
        notes: '',
        location: location,
        dates: `${dateFrom} al ${dateTo}`,
        category: `Modello: ${carName}`,
        status: 'new'
      }]).then(({ error }) => {
         if (error) console.warn("Supabase log:", error.message);
      });
    } catch(e) { console.warn(e); }
  }

  const payload = {
    _subject: `🚙 Nuova Prenotazione Auto (Da Pagina Dettaglio) — ${carName}`,
    _template: "table",
    _captcha: "false",
    "Veicolo Richiesto": carName,
    "Luogo di Ritiro": location,
    "Date Richieste": `${dateFrom} al ${dateTo}`,
    "Nome Cliente": name,
    "Telefono Cliente": phone,
    "Email Cliente": email
  };

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${recipient}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      if (typeof showToast === 'function') {
        showToast(`✨ Richiesta inviata con successo! Un concierge ti contatterà a breve al ${phone}.`);
      } else {
        alert(`Richiesta inviata per ${carName}. Ti contatteremo a breve.`);
      }
      document.getElementById("detailBookingForm").reset();
    }
  } catch (err) {
    console.warn("Fallback su mailto:", err);
    const subjectText = encodeURIComponent(`Richiesta Prenotazione — ${carName}`);
    const bodyText = encodeURIComponent(
      `Richiesta prenotazione da ITERCARS:\n\n• Veicolo: ${carName}\n• Luogo: ${location}\n• Date: ${dateFrom} al ${dateTo}\n• Nome: ${name}\n• Telefono: ${phone}\n• Email: ${email}\n`
    );
    setTimeout(() => {
      window.location.href = `mailto:${recipient}?subject=${subjectText}&body=${bodyText}`;
      document.getElementById("detailBookingForm").reset();
    }, 1000);
  }
}

/* ==========================================================================
   LIGHTBOX ZOOM LOGIC
   ========================================================================== */
function openLightbox() {
  const overlay = document.getElementById("lightboxOverlay");
  const img = document.getElementById("lightboxImage");
  const mainImageSrc = document.getElementById("detailMainImage").src;
  
  if (overlay && img && mainImageSrc) {
    img.src = mainImageSrc;
    overlay.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling
  }
}

function closeLightbox() {
  const overlay = document.getElementById("lightboxOverlay");
  if (overlay) {
    overlay.classList.remove("active");
    document.body.style.overflow = ""; // Restore scrolling
  }
}

// Chiudi col tasto ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeLightbox();
});

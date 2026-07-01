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

function submitDetailBooking(event) {
  event.preventDefault();
  
  const carName = document.getElementById("detailCarName").innerText;
  const location = document.getElementById("detailLocation").value;
  const name = document.getElementById("detailName").value;
  const phone = document.getElementById("detailPhone").value;

  // Use the showToast from app.js
  if (typeof showToast === 'function') {
    showToast(`✨ Richiesta inviata con successo per ${carName}! Un concierge ti contatterà a breve al ${phone}.`);
  } else {
    alert(`Richiesta inviata per ${carName}. Ti contatteremo a breve.`);
  }

  // Clear form
  document.getElementById("detailBookingForm").reset();
}

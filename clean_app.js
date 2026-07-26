/* ==========================================================================
   LUXURY CAR RENTAL - LOGIC & INTERACTIVITY (AutoRent Replica + Multi-Flag i18n)
   ========================================================================== */

// CONFIGURAZIONE SUPABASE CLIENT (ITERCARS Hub Database)
const SUPABASE_URL = 'https://brqayhwdrvgllwwjnyvz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJycWF5aHdkcnZnbGx3d2pueXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NDczMTgsImV4cCI6MjA5ODMyMzMxOH0.NZsHj4B_5ylWCcCXy5NKrkLWXNy-6GV4yg5Cv1keaWk';
var supabase = (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : window.supabase;
window.supabase = supabase;

const langFlags = {
  it: "­ƒç«­ƒç╣",
  en: "­ƒç¼­ƒçº",
  es: "­ƒç¬­ƒç©",
  fr: "­ƒç½­ƒçÀ",
  de: "­ƒç®­ƒç¬",
  ru: "­ƒçÀ­ƒç║",
  zh: "­ƒç¿­ƒç│",
  ar: "­ƒç©­ƒçª",
  ja: "­ƒç»­ƒçÁ",
  pt: "­ƒçÁ­ƒç╣"
};

// DIZIONARIO DI TRADUZIONE MULTILINGUA
const translations = {
  it: {
    "nav.home": "Home",
    "nav.fleet": "Luxury Car",
    "nav.why": "Perch├® Noi",
    "nav.vip": "Servizi VIP",
    "nav.contacts": "Contatti",
    "nav.area": "Area Riservata",
    "hero.badge": '<i class="ri-vip-crown-fill"></i> #1 MARKETPLACE DI NOLEGGIO AUTO PREMIUM',
    "hero.title": 'Guidare l\'Eccellenza <br><span class="text-gradient">Non ha Limiti.</span>',
    "hero.subtitle": "Scegli tra le supercar e le berline pi├╣ esclusive del pianeta. Consegna personalizzata ovunque tu sia.",
    "hero.btnDiscover": "Scopri i Veicoli",
    "hero.btnQuote": "Calcola Preventivo",
    "hero.stat1": "Supercar Esclusive",
    "hero.stat2": "Concierge Dedicato",
    "hero.stat3": "Garanzia Modello",
    "vip.title": "Garanzia Assicurativa VIP",
    "vip.subtitle": "Copertura 100% Inclusa",
    "vip.desc": "Ogni noleggio include assistenza stradale 24/7 con elicottero o supercar sostitutiva entro 60 minuti in tutta Europa.",
    "vip.check1": "Consegna in Villa",
    "vip.check2": "Zero Franchigia",
    "search.location": "Luogo di Ritiro",
    "search.locAny": "Qualsiasi Citt├á / Aeroporto",
    "search.dateFrom": "Data Ritiro",
    "search.dateTo": "Data Riconsegna",
    "search.category": "Categoria Auto",
    "search.catAll": "Tutte le Categorie",
    "search.btn": "Consulta Disponibilit├á",
    "fleet.tag": "Luxury Car",
    "fleet.title": 'Guidare l\'Eccellenza <br><span class="text-gradient">Non ha Limiti.</span>',
    "fleet.subtitle": "Scegli tra le supercar e le berline pi├╣ esclusive del pianeta. Consegna personalizzata ovunque tu sia.",
    "filter.all": "Tutti i Modelli",
    "why.tag": "I Nostri Vantaggi",
    "why.title": 'Perch├® Scegliere <span class="text-gold">ITERCARS</span>',
    "why.subtitle": "Ridefiniamo il concetto di autonoleggio combinando flotta proprietaria di prim'ordine e accoglienza a 5 stelle.",
    "why.box1Title": "Consegna Ovunque",
    "why.box1Desc": "Consegniamo la vettura direttamente al tuo hotel, villa privata o terminal jet privato con il nostro staff.",
    "why.box2Title": "Copertura Totale VIP",
    "why.box2Desc": "Viaggia in assoluta serenit├á con franchigia zero e copertura assicurativa completa su tutti i nostri veicoli.",
    "why.box3Title": "Concierge 24/7",
    "why.box3Desc": "Assistenza dedicata giorno e notte. Prenotazioni ristoranti, itinerari su misura e supporto tecnico immediato.",
    "why.box4Title": "Garanzia Modello",
    "why.box4Desc": "Nessuna sorpresa: riceverai esattamente la marca, il modello e la motorizzazione specificata al momento della prenotazione.",
    "modal.name": "Nome e Cognome *",
    "modal.phone": "Telefono / WhatsApp *",
    "modal.email": "Indirizzo Email *",
    "modal.days": "Giorni di Noleggio",
    "modal.extras": "Servizi Aggiuntivi",
    "modal.extra0": "Consegna Standard (Inclusa)",
    "modal.extra150": "Consegna in Villa / Aeroporto (+Ôé¼150)",
    "modal.extra300": "Autista Privato mezza giornata (+Ôé¼300)",
    "modal.estimate": "Stima Totale Preventivo:",
    "modal.kaskoInc": "Assicurazione Inclusa",
    "modal.btnConfirm": "Conferma Richiesta Prenotazione",
    "footer.desc": "Il marketplace di riferimento per il noleggio di auto di lusso, sportive ed esclusive in Italia e in Europa. Powered by passione e design.",
    "footer.col1Title": "Categorie Luxury Car",
    "footer.col2Title": "Link Utili",
    "footer.linkConditions": "Condizioni di Noleggio",
    "footer.linkFaq": "FAQ & Supporto",
    "footer.linkPartner": "Lavora con noi / Partner",
    "footer.col3Title": "Sede Legale & Contatti",
    "dynamic.cat": "Categoria",
    "dynamic.perDay": "/ giorno (Assic. inc.)",
    "dynamic.book": "Prenota",
    "dynamic.noVehicles": "Nessun veicolo trovato",
    "dynamic.tryChange": "Prova a cambiare i filtri di ricerca o la categoria.",
    "lang.other": "Altre lingue...",
    "lang.modalTitle": "Seleziona Lingua",
    "lang.modalSub": "Scegli la lingua di visualizzazione per il marketplace ITERCARS.",
    "toast.lang": "Lingua impostata su Italiano ­ƒç«­ƒç╣",
    "toast.bookingSuccess": "Ô£¿ Richiesta inviata con successo per {car}! Un concierge ti contatter├á a breve."
  },
  en: {
    "nav.home": "Home",
    "nav.fleet": "Luxury Car",
    "nav.why": "Why Us",
    "nav.vip": "VIP Services",
    "nav.contacts": "Contact",
    "nav.area": "VIP Lounge",
    "hero.badge": '<i class="ri-vip-crown-fill"></i> #1 PREMIUM LUXURY CAR RENTAL MARKETPLACE',
    "hero.title": 'Driving Excellence <br><span class="text-gradient">Has No Limits.</span>',
    "hero.subtitle": "Choose from the most exclusive supercars and sedans on the planet. Customized delivery wherever you are, full insurance coverage, and an unforgettable driving experience.",
    "hero.btnDiscover": "Discover Fleet",
    "hero.btnQuote": "Instant Quote",
    "hero.stat1": "Exclusive Supercars",
    "hero.stat2": "Dedicated Concierge",
    "hero.stat3": "Guaranteed Model",
    "vip.title": "VIP Insurance Guarantee",
    "vip.subtitle": "100% Coverage Included",
    "vip.desc": "Every rental includes 24/7 roadside assistance with helicopter or replacement supercar within 60 minutes across Europe.",
    "vip.check1": "Villa Delivery",
    "vip.check2": "Zero Deductible",
    "search.location": "Pickup Location",
    "search.locAny": "Any City / Airport",
    "search.dateFrom": "Pickup Date",
    "search.dateTo": "Return Date",
    "search.category": "Car Category",
    "search.catAll": "All Categories",
    "search.btn": "Search Cars",
    "fleet.tag": "Luxury Car",
    "fleet.title": 'Selected Vehicles for <span class="text-gradient">Pure Emotions</span>',
    "fleet.subtitle": "Choose the perfect model for your next business trip, exclusive weekend, or special event.",
    "filter.all": "All Models",
    "why.tag": "Our Advantages",
    "why.title": 'Why Choose <span class="text-gold">ITERCARS</span>',
    "why.subtitle": "Redefining car rental by combining a top-tier proprietary fleet with 5-star hospitality.",
    "why.box1Title": "Delivery Anywhere",
    "why.box1Desc": "We deliver the car directly to your hotel, private villa, or jet terminal with our professional staff.",
    "why.box2Title": "VIP Full Insurance",
    "why.box2Desc": "Travel in complete peace of mind with zero deductible and full insurance coverage on all our vehicles.",
    "why.box3Title": "24/7 Concierge",
    "why.box3Desc": "Dedicated assistance day and night. Restaurant bookings, tailored itineraries, and immediate technical support.",
    "why.box4Title": "Guaranteed Model",
    "why.box4Desc": "No surprises: you will receive exactly the brand, model, and engine specified when booking.",
    "modal.name": "Full Name *",
    "modal.phone": "Phone / WhatsApp *",
    "modal.email": "Email Address *",
    "modal.days": "Rental Days",
    "modal.extras": "Additional Services",
    "modal.extra0": "Standard Delivery (Included)",
    "modal.extra150": "Villa / Airport Delivery (+Ôé¼150)",
    "modal.extra300": "Private Driver half day (+Ôé¼300)",
    "modal.estimate": "Estimated Total Quote:",
    "modal.kaskoInc": "Insurance Included",
    "modal.btnConfirm": "Confirm Booking Request",
    "footer.desc": "The benchmark marketplace for renting luxury, sports, and exclusive cars in Italy and Europe. Powered by passion and design.",
    "footer.col1Title": "Luxury Car Categories",
    "footer.col2Title": "Useful Links",
    "footer.linkConditions": "Rental Conditions",
    "footer.linkFaq": "FAQ & Support",
    "footer.linkPartner": "Work with us / Partners",
    "footer.col3Title": "Main Headquarters",
    "dynamic.cat": "Category",
    "dynamic.perDay": "/ day (Insurance inc.)",
    "dynamic.book": "Book Now",
    "dynamic.noVehicles": "No vehicles found",
    "dynamic.tryChange": "Try changing search filters or category.",
    "lang.other": "Other languages...",
    "lang.modalTitle": "Select Language",
    "lang.modalSub": "Choose your preferred display language for ITERCARS marketplace.",
    "toast.lang": "Language set to English ­ƒç¼­ƒçº",
    "toast.bookingSuccess": "Ô£¿ Request successfully sent for {car}! A concierge will contact you shortly."
  },
  es: {
    "nav.home": "Inicio",
    "nav.fleet": "Luxury Car",
    "nav.why": "Por Qu├® Nosotros",
    "nav.vip": "Servicios VIP",
    "nav.contacts": "Contacto",
    "nav.area": "├ürea VIP",
    "hero.badge": '<i class="ri-vip-crown-fill"></i> #1 MARKETPLACE DE ALQUILER DE COCHES PREMIUM',
    "hero.title": 'Conducir la Excelencia <br><span class="text-gradient">No tiene L├¡mites.</span>',
    "hero.subtitle": "Elige entre los superdeportivos y berlinas m├ís exclusivos del planeta. Entrega personalizada donde est├®s, cobertura a todo riesgo y una experiencia inolvidable.",
    "hero.btnDiscover": "Descubrir Veh├¡culos",
    "hero.btnQuote": "Calcular Presupuesto",
    "hero.stat1": "Superdeportivos Exclusivos",
    "hero.stat2": "Conserje Dedicado",
    "hero.stat3": "Modelo Garantizado",
    "vip.title": "Garant├¡a VIP a Todo Riesgo",
    "vip.subtitle": "Cobertura 100% Incluida",
    "vip.desc": "Cada alquiler incluye asistencia en carretera 24/7 con helic├│ptero o superdeportivo de sustituci├│n en 60 minutos en toda Europa.",
    "vip.check1": "Entrega en Villa",
    "vip.check2": "Sin Franquicia",
    "search.location": "Lugar de Recogida",
    "search.locAny": "Cualquier Ciudad / Aeropuerto",
    "search.dateFrom": "Fecha Recogida",
    "search.dateTo": "Fecha Devoluci├│n",
    "search.category": "Categor├¡a",
    "search.catAll": "Todas las Categor├¡as",
    "search.btn": "Buscar Coches",
    "fleet.tag": "Luxury Car",
    "fleet.title": 'Veh├¡culos Seleccionados para <span class="text-gradient">Emociones Puras</span>',
    "fleet.subtitle": "Elige el modelo perfecto para tu pr├│ximo viaje de negocios, fin de semana exclusivo o evento especial.",
    "filter.all": "Todos los Modelos",
    "why.tag": "Nuestras Ventajas",
    "why.title": 'Por Qu├® Elegir <span class="text-gold">ITERCARS</span>',
    "why.subtitle": "Redefinimos el alquiler de coches combinando una flota propia de primer nivel con hospitalidad 5 estrellas.",
    "why.box1Title": "Entrega en Cualquier Lugar",
    "why.box1Desc": "Entregamos el veh├¡culo directamente en tu hotel, villa privada o terminal de jet privado con nuestro personal.",
    "why.box2Title": "Seguro VIP a Todo Riesgo",
    "why.box2Desc": "Viaja con absoluta tranquilidad con franquicia cero y cobertura completa en todos nuestros veh├¡culos.",
    "why.box3Title": "Conserje 24/7",
    "why.box3Desc": "Asistencia dedicada d├¡a y noche. Reservas en restaurantes, itinerarios a medida y soporte t├®cnico inmediato.",
    "why.box4Title": "Modelo Garantizado",
    "why.box4Desc": "Sin sorpresas: recibir├ís exactamente la marca, el modelo y el motor especificados al reservar.",
    "modal.name": "Nombre Completo *",
    "modal.phone": "Tel├®fono / WhatsApp *",
    "modal.email": "Correo Electr├│nico *",
    "modal.days": "D├¡as de Alquiler",
    "modal.extras": "Servicios Adicionales",
    "modal.extra0": "Entrega Est├índar (Incluida)",
    "modal.extra150": "Entrega Villa / Aeropuerto (+Ôé¼150)",
    "modal.extra300": "Chofer Privado medio d├¡a (+Ôé¼300)",
    "modal.estimate": "Presupuesto Total Estimado:",
    "modal.kaskoInc": "Seguro Incluido",
    "modal.btnConfirm": "Confirmar Solicitud",
    "footer.desc": "El marketplace de referencia para el alquiler de coches de lujo, deportivos y exclusivos en Italia y Europa. Impulsado por pasi├│n y dise├▒o.",
    "footer.col1Title": "Categor├¡as Flota",
    "footer.col2Title": "Enlaces ├Ütiles",
    "footer.linkConditions": "Condiciones de Alquiler",
    "footer.linkFaq": "Preguntas Frecuentes",
    "footer.linkPartner": "Trabaja con nosotros / Socios",
    "footer.col3Title": "Sedes Principales",
    "dynamic.cat": "Categor├¡a",
    "dynamic.perDay": "/ d├¡a (Seguro inc.)",
    "dynamic.book": "Reservar",
    "dynamic.noVehicles": "No se encontraron veh├¡culos",
    "dynamic.tryChange": "Prueba a cambiar los filtros de b├║squeda o categor├¡a.",
    "lang.other": "Otras idiomas...",
    "lang.modalTitle": "Seleccionar Idioma",
    "lang.modalSub": "Elige el idioma de visualizaci├│n para el marketplace ITERCARS.",
    "toast.lang": "Idioma configurado en Espa├▒ol ­ƒç¬­ƒç©",
    "toast.bookingSuccess": "Ô£¿ ┬íSolicitud enviada con ├®xito para {car}! Un conserje te contactar├í pronto."
  },
  fr: {
    "nav.home": "Accueil",
    "nav.fleet": "Luxury Car",
    "nav.why": "Pourquoi Nous",
    "nav.vip": "Services VIP",
    "nav.contacts": "Contact",
    "nav.area": "Espace VIP",
    "hero.badge": '<i class="ri-vip-crown-fill"></i> #1 MARKETPLACE DE LOCATION DE VOITURES DE LUXE',
    "hero.title": 'Conduire l\'Excellence <br><span class="text-gradient">Sans Limites.</span>',
    "hero.subtitle": "Choisissez parmi les supercars et berlines les plus exclusives de la plan├¿te. Livraison personnalis├®e o├╣ que vous soyez, assurance tous risques et une exp├®rience de conduite inoubliable.",
    "hero.btnDiscover": "D├®couvrir la Flotte",
    "hero.btnQuote": "Devis Instantan├®",
    "hero.stat1": "Supercars Exclusives",
    "hero.stat2": "Concierge D├®di├®",
    "hero.stat3": "Mod├¿le Garanti",
    "vip.title": "Garantie VIP Assurance",
    "vip.subtitle": "Couverture 100% Incluse",
    "vip.desc": "Chaque location comprend une assistance routi├¿re 24h/24 et 7j/7 avec h├®licopt├¿re ou supercar de remplacement en 60 minutes dans toute l'Europe.",
    "vip.check1": "Livraison en Villa",
    "vip.check2": "Z├®ro Franchise",
    "search.location": "Lieu de Prise",
    "search.locAny": "Toute Ville / A├®roport",
    "search.dateFrom": "Date de D├®part",
    "search.dateTo": "Date de Retour",
    "search.category": "Cat├®gorie",
    "search.catAll": "Toutes Cat├®gories",
    "search.btn": "Rechercher",
    "fleet.tag": "Luxury Car",
    "fleet.title": 'V├®hicules S├®lectionn├®s pour des <span class="text-gradient">├ëmotions Pures</span>',
    "fleet.subtitle": "Choisissez le mod├¿le parfait pour votre prochain voyage d'affaires, week-end exclusif ou ├®v├®nement sp├®cial.",
    "filter.all": "Tous les Mod├¿les",
    "why.tag": "Nos Avantages",
    "why.title": 'Pourquoi Choisir <span class="text-gold">ITERCARS</span>',
    "why.subtitle": "Red├®finir la location de voitures en combinant une flotte propri├®taire de premier ordre et un accueil 5 ├®toiles.",
    "why.box1Title": "Livraison Partout",
    "why.box1Desc": "Nous livrons la voiture directement ├á votre h├┤tel, villa priv├®e ou terminal de jet priv├® avec notre personnel.",
    "why.box2Title": "Assurance VIP Tous Risques",
    "why.box2Desc": "Voyagez en toute s├®r├®nit├® avec une franchise z├®ro et une couverture d'assurance compl├¿te sur tous nos v├®hicules.",
    "why.box3Title": "Concierge 24/7",
    "why.box3Desc": "Assistance d├®di├®e jour et nuit. R├®servations de restaurants, itin├®raires sur mesure et support technique imm├®diat.",
    "why.box4Title": "Mod├¿le Garanti",
    "why.box4Desc": "Pas de surprises : vous recevrez exactement la marque, le mod├¿le et la motorisation sp├®cifi├®s lors de la r├®servation.",
    "modal.name": "Nom Complet *",
    "modal.phone": "T├®l├®phone / WhatsApp *",
    "modal.email": "Adresse Email *",
    "modal.days": "Jours de Location",
    "modal.extras": "Services Additionnels",
    "modal.extra0": "Livraison Standard (Incluse)",
    "modal.extra150": "Livraison Villa / A├®roport (+Ôé¼150)",
    "modal.extra300": "Chauffeur Priv├® demi-journ├®e (+Ôé¼300)",
    "modal.estimate": "Estimation Totale Devis :",
    "modal.kaskoInc": "Assurance Incluse",
    "modal.btnConfirm": "Confirmer la Demande",
    "footer.desc": "La marketplace de r├®f├®rence pour la location de voitures de luxe, sportives et exclusives en Italie et en Europe. Propuls├® par la passion.",
    "footer.col1Title": "Cat├®gories Flotte",
    "footer.col2Title": "Liens Utiles",
    "footer.linkConditions": "Conditions de Location",
    "footer.linkFaq": "FAQ & Support",
    "footer.linkPartner": "Travailler avec nous / Partenaires",
    "footer.col3Title": "Si├¿ges Principaux",
    "dynamic.cat": "Cat├®gorie",
    "dynamic.perDay": "/ jour (Assurance inc.)",
    "dynamic.book": "R├®server",
    "dynamic.noVehicles": "Aucun v├®hicule trouv├®",
    "dynamic.tryChange": "Essayez de modifier les filtres de recherche ou la cat├®gorie.",
    "lang.other": "Autres langues...",
    "lang.modalTitle": "S├®lectionner la Langue",
    "lang.modalSub": "Choisissez votre langue d'affichage pour la marketplace ITERCARS.",
    "toast.lang": "Langue d├®finie sur Fran├ºais ­ƒç½­ƒçÀ",
    "toast.bookingSuccess": "Ô£¿ Demande envoy├®e avec succ├¿s pour {car} ! Un concierge vous contactera sous peu."
  },
  de: {
    "nav.home": "Startseite",
    "nav.fleet": "Luxury Car",
    "nav.why": "Warum Wir",
    "nav.vip": "VIP-Service",
    "nav.contacts": "Kontakt",
    "nav.area": "VIP Bereich",
    "hero.badge": '<i class="ri-vip-crown-fill"></i> #1 PREMIUMLUXUS-MIETWAGEN-MARKTPLATZ',
    "hero.title": 'Exzellenz fahren <br><span class="text-gradient">Kennt Keine Grenzen.</span>',
    "hero.subtitle": "W├ñhlen Sie aus den exklusivsten Supercars und Limousinen des Planeten. Individuelle Lieferung, wo immer Sie sind, Vollversicherung und ein unvergessliches Fahrerlebnis.",
    "hero.btnDiscover": "Fahrzeuge entdecken",
    "hero.btnQuote": "Sofortangebot",
    "hero.stat1": "Exklusive Supercars",
    "hero.stat2": "Engagierter Concierge",
    "hero.stat3": "Garantiertes Modell",
    "vip.title": "VIP-Versicherungsgarantie",
    "vip.subtitle": "100% Abdeckung Inklusive",
    "vip.desc": "Jede Miete beinhaltet 24/7 Pannenhilfe mit Hubschrauber oder Ersatz-Supercar innerhalb von 60 Minuten in ganz Europa.",
    "vip.check1": "Lieferung zur Villa",
    "vip.check2": "Keine Selbstbeteiligung",
    "search.location": "Abholort",
    "search.locAny": "Jede Stadt / Flughafen",
    "search.dateFrom": "Abholdatum",
    "search.dateTo": "R├╝ckgabedatum",
    "search.category": "Fahrzeugkategorie",
    "search.catAll": "Alle Kategorien",
    "search.btn": "Fahrzeug Suchen",
    "fleet.tag": "Luxury Car",
    "fleet.title": 'Ausgew├ñhlte Fahrzeuge f├╝r <span class="text-gradient">Reine Emotionen</span>',
    "fleet.subtitle": "W├ñhlen Sie das perfekte Modell f├╝r Ihre n├ñchste Gesch├ñftsreise, ein exklusives Wochenende oder ein besonderes Event.",
    "filter.all": "Alle Modelle",
    "why.tag": "Unsere Vorteile",
    "why.title": 'Warum <span class="text-gold">ITERCARS</span> W├ñhlen',
    "why.subtitle": "Wir definieren die Autovermietung neu, indem wir eine erstklassige eigene Flotte mit 5-Sterne-Gastfreundschaft kombinieren.",
    "why.box1Title": "Lieferung ├£berall",
    "why.box1Desc": "Wir liefern das Auto mit unserem Personal direkt an Ihr Hotel, Ihre Privatvilla oder Ihren Jet-Terminal.",
    "why.box2Title": "VIP Vollversicherung",
    "why.box2Desc": "Reisen Sie in absoluter Sorglosigkeit ohne Selbstbeteiligung und mit vollem Versicherungsschutz f├╝r alle unsere Fahrzeuge.",
    "why.box3Title": "24/7 Concierge",
    "why.box3Desc": "Engagierte Unterst├╝tzung Tag und Nacht. Restaurantbuchungen, ma├ƒgeschneiderte Reiserouten und sofortiger technischer Support.",
    "why.box4Title": "Garantiertes Modell",
    "why.box4Desc": "Keine ├£berraschungen: Sie erhalten genau die Marke, das Modell und den Motor, die Sie bei der Buchung angegeben haben.",
    "modal.name": "Vollst├ñndiger Name *",
    "modal.phone": "Telefon / WhatsApp *",
    "modal.email": "E-Mail-Adresse *",
    "modal.days": "Miettage",
    "modal.extras": "Zusatzleistungen",
    "modal.extra0": "Standardlieferung (Inklusive)",
    "modal.extra150": "Lieferung Villa / Flughafen (+Ôé¼150)",
    "modal.extra300": "Privatchauffeur halber Tag (+Ôé¼300)",
    "modal.estimate": "Gesch├ñtzter Gesamtbetrag:",
    "modal.kaskoInc": "Versicherung Inklusive",
    "modal.btnConfirm": "Buchungsanfrage Best├ñtigen",
    "footer.desc": "Der f├╝hrende Marktplatz f├╝r die Miete von Luxus-, Sport- und exklusiven Autos in Italien und Europa. Angetrieben von Leidenschaft und Design.",
    "footer.col1Title": "Flottenkategorien",
    "footer.col2Title": "N├╝tzliche Links",
    "footer.linkConditions": "Mietbedingungen",
    "footer.linkFaq": "FAQ & Support",
    "footer.linkPartner": "Arbeiten Sie mit uns / Partner",
    "footer.col3Title": "Hauptsitze",
    "dynamic.cat": "Kategorie",
    "dynamic.perDay": "/ Tag (Versicherung inkl.)",
    "dynamic.book": "Buchen",
    "dynamic.noVehicles": "Keine Fahrzeuge gefunden",
    "dynamic.tryChange": "Versuchen Sie, die Suchfilter oder Kategorie zu ├ñndern.",
    "lang.other": "Andere Sprachen...",
    "lang.modalTitle": "Sprache Ausw├ñhlen",
    "lang.modalSub": "W├ñhlen Sie Ihre bevorzugte Anzeigesprache f├╝r den ITERCARS-Marktplatz.",
    "toast.lang": "Sprache auf Deutsch eingestellt ­ƒç®­ƒç¬",
    "toast.bookingSuccess": "Ô£¿ Anfrage f├╝r {car} erfolgreich gesendet! Ein Concierge wird Sie in K├╝rze kontaktieren."
  },
  ru: {
    "nav.home": "ðôð╗ð░ð▓ð¢ð░ÐÅ",
    "nav.fleet": "Luxury Car",
    "nav.why": "ðƒÐÇðÁð©ð╝ÐâÐëðÁÐüÐéð▓ð░",
    "nav.vip": "VIP ðíðÁÐÇð▓ð©Ðü",
    "nav.contacts": "ðÜð¥ð¢Ðéð░ð║ÐéÐï",
    "nav.area": "VIP ðùð¥ð¢ð░",
    "hero.badge": '<i class="ri-vip-crown-fill"></i> #1 ð£ðÉðáðÜðòðóðƒðøðòðÖðí ðÉðáðòðØðöð½ ðƒðáðòð£ðÿðúð£ ðÉðÆðóð×ð£ð×ðæðÿðøðòðÖ',
    "hero.title": 'ðíð¥ð▓ðÁÐÇÐêðÁð¢ÐüÐéð▓ð¥ ðÀð░ ÐÇÐâð╗ðÁð╝ <br><span class="text-gradient">ðæðÁðÀ ðôÐÇð░ð¢ð©Ðå.</span>',
    "hero.subtitle": "ðÆÐïð▒ð©ÐÇð░ð╣ÐéðÁ ð©ðÀ Ðüð░ð╝ÐïÐà Ðìð║Ðüð║ð╗ÐÄðÀð©ð▓ð¢ÐïÐà ÐüÐâð┐ðÁÐÇð║ð░ÐÇð¥ð▓ ð© ÐüðÁð┤ð░ð¢ð¥ð▓ ð┐ð╗ð░ð¢ðÁÐéÐï. ðƒðÁÐÇÐüð¥ð¢ð░ð╗Ðîð¢ð░ÐÅ ð┤ð¥ÐüÐéð░ð▓ð║ð░ ð║Ðâð┤ð░ Ðâð│ð¥ð┤ð¢ð¥, ð┐ð¥ð╗ð¢ð░ÐÅ ÐüÐéÐÇð░Ðàð¥ð▓ð║ð░ ðÜðÉðíðÜð× ð© ð¢ðÁðÀð░ð▒Ðïð▓ð░ðÁð╝Ðïð╣ ð¥ð┐ÐïÐé.",
    "hero.btnDiscover": "ðíð╝ð¥ÐéÐÇðÁÐéÐî ðÉð▓Ðéð¥ð┐ð░ÐÇð║",
    "hero.btnQuote": "ðáð░ÐüÐüÐçð©Ðéð░ÐéÐî ðíÐéð¥ð©ð╝ð¥ÐüÐéÐî",
    "hero.stat1": "ð¡ð║Ðüð║ð╗ÐÄðÀð©ð▓ð¢ÐïðÁ ðíÐâð┐ðÁÐÇð║ð░ÐÇÐï",
    "hero.stat2": "ðøð©Ðçð¢Ðïð╣ ðÜð¥ð¢ÐüÐîðÁÐÇðÂ",
    "hero.stat3": "ðôð░ÐÇð░ð¢Ðéð©ÐÅ ð£ð¥ð┤ðÁð╗ð©",
    "vip.title": "VIP ðôð░ÐÇð░ð¢Ðéð©ÐÅ ðÜðÉðíðÜð×",
    "vip.subtitle": "100% ðƒð¥ð║ÐÇÐïÐéð©ðÁ ðÆð║ð╗ÐÄÐçðÁð¢ð¥",
    "vip.desc": "ðÜð░ðÂð┤ð░ÐÅ ð░ÐÇðÁð¢ð┤ð░ ð▓ð║ð╗ÐÄÐçð░ðÁÐé ð┐ð¥ð╝ð¥ÐëÐî ð¢ð░ ð┤ð¥ÐÇð¥ð│ðÁ 24/7 Ðü ð▓ðÁÐÇÐéð¥ð╗ðÁÐéð¥ð╝ ð©ð╗ð© ðÀð░ð╝ðÁð¢ð¥ð╣ ÐüÐâð┐ðÁÐÇð║ð░ÐÇð░ ð▓ ÐéðÁÐçðÁð¢ð©ðÁ 60 ð╝ð©ð¢ÐâÐé ð┐ð¥ ð▓ÐüðÁð╣ ðòð▓ÐÇð¥ð┐ðÁ.",
    "vip.check1": "ðöð¥ÐüÐéð░ð▓ð║ð░ ð║ ðÆð©ð╗ð╗ðÁ",
    "vip.check2": "ðæðÁðÀ ðñÐÇð░ð¢Ðêð©ðÀÐï",
    "search.location": "ð£ðÁÐüÐéð¥ ðƒð¥ð╗ÐâÐçðÁð¢ð©ÐÅ",
    "search.locAny": "ðøÐÄð▒ð¥ð╣ ðôð¥ÐÇð¥ð┤ / ðÉÐìÐÇð¥ð┐ð¥ÐÇÐé",
    "search.dateFrom": "ðöð░Ðéð░ ðƒð¥ð╗ÐâÐçðÁð¢ð©ÐÅ",
    "search.dateTo": "ðöð░Ðéð░ ðÆð¥ðÀð▓ÐÇð░Ðéð░",
    "search.category": "ðÜð░ÐéðÁð│ð¥ÐÇð©ÐÅ",
    "search.catAll": "ðÆÐüðÁ ðÜð░ÐéðÁð│ð¥ÐÇð©ð©",
    "search.btn": "ðØð░ð╣Ðéð© ðÉð▓Ðéð¥ð╝ð¥ð▒ð©ð╗Ðî",
    "fleet.tag": "Luxury Car",
    "fleet.title": 'ð×Ðéð▒ð¥ÐÇð¢ÐïðÁ ðÉð▓Ðéð¥ð╝ð¥ð▒ð©ð╗ð© ð┤ð╗ÐÅ <span class="text-gradient">ðºð©ÐüÐéÐïÐà ð¡ð╝ð¥Ðåð©ð╣</span>',
    "fleet.subtitle": "ðÆÐïð▒ðÁÐÇð©ÐéðÁ ð©ð┤ðÁð░ð╗Ðîð¢ÐâÐÄ ð╝ð¥ð┤ðÁð╗Ðî ð┤ð╗ÐÅ ð┤ðÁð╗ð¥ð▓ð¥ð╣ ð┐ð¥ðÁðÀð┤ð║ð©, Ðìð║Ðüð║ð╗ÐÄðÀð©ð▓ð¢ð¥ð│ð¥ Ðâð©ð║ðÁð¢ð┤ð░ ð©ð╗ð© ð¥Ðüð¥ð▒ð¥ð│ð¥ ð╝ðÁÐÇð¥ð┐ÐÇð©ÐÅÐéð©ÐÅ.",
    "filter.all": "ðÆÐüðÁ ð£ð¥ð┤ðÁð╗ð©",
    "why.tag": "ðØð░Ðêð© ðƒÐÇðÁð©ð╝ÐâÐëðÁÐüÐéð▓ð░",
    "why.title": 'ðƒð¥ÐçðÁð╝Ðâ ðÆÐïð▒ð©ÐÇð░ÐÄÐé <span class="text-gold">ITERCARS</span>',
    "why.subtitle": "ð£Ðï ð┐ðÁÐÇðÁð¥Ðüð╝ÐïÐüð╗ð©ð▓ð░ðÁð╝ ð░ÐÇðÁð¢ð┤Ðâ ð░ð▓Ðéð¥, ð¥ð▒ÐèðÁð┤ð©ð¢ÐÅÐÅ Ðüð¥ð▒ÐüÐéð▓ðÁð¢ð¢Ðïð╣ ð┐ð░ÐÇð║ ð▓ÐïÐüÐêðÁð│ð¥ ð║ð╗ð░ÐüÐüð░ Ðü 5-ðÀð▓ðÁðÀð┤ð¥Ðçð¢Ðïð╝ ÐüðÁÐÇð▓ð©Ðüð¥ð╝.",
    "why.box1Title": "ðöð¥ÐüÐéð░ð▓ð║ð░ ðÜÐâð┤ð░ ðúð│ð¥ð┤ð¢ð¥",
    "why.box1Desc": "ðöð¥ÐüÐéð░ð▓ð©ð╝ ð░ð▓Ðéð¥ð╝ð¥ð▒ð©ð╗Ðî ð┐ÐÇÐÅð╝ð¥ ð║ ð▓ð░ÐêðÁð╝Ðâ ð¥ÐéðÁð╗ÐÄ, Ðçð░ÐüÐéð¢ð¥ð╣ ð▓ð©ð╗ð╗ðÁ ð©ð╗ð© ÐéðÁÐÇð╝ð©ð¢ð░ð╗Ðâ ð▒ð©ðÀð¢ðÁÐü-ð░ð▓ð©ð░Ðåð©ð©.",
    "why.box2Title": "ðƒð¥ð╗ð¢ð░ÐÅ VIP ðíÐéÐÇð░Ðàð¥ð▓ð║ð░",
    "why.box2Desc": "ðƒÐâÐéðÁÐêðÁÐüÐéð▓Ðâð╣ÐéðÁ Ðü ð░ð▒Ðüð¥ð╗ÐÄÐéð¢Ðïð╝ Ðüð┐ð¥ð║ð¥ð╣ÐüÐéð▓ð©ðÁð╝ Ðü ð¢Ðâð╗ðÁð▓ð¥ð╣ ÐäÐÇð░ð¢Ðêð©ðÀð¥ð╣ ð© ð┐ð¥ð╗ð¢Ðïð╝ ÐüÐéÐÇð░Ðàð¥ð▓Ðïð╝ ð┐ð¥ð║ÐÇÐïÐéð©ðÁð╝.",
    "why.box3Title": "ðÜð¥ð¢ÐüÐîðÁÐÇðÂ 24/7",
    "why.box3Desc": "ðÜÐÇÐâð│ð╗ð¥ÐüÐâÐéð¥Ðçð¢ð░ÐÅ ð┐ð¥ð┤ð┤ðÁÐÇðÂð║ð░. ðæÐÇð¥ð¢ð©ÐÇð¥ð▓ð░ð¢ð©ðÁ ÐÇðÁÐüÐéð¥ÐÇð░ð¢ð¥ð▓, ð©ð¢ð┤ð©ð▓ð©ð┤Ðâð░ð╗Ðîð¢ÐïðÁ ð╝ð░ÐÇÐêÐÇÐâÐéÐï ð© ð╝ð│ð¢ð¥ð▓ðÁð¢ð¢ð░ÐÅ ð┐ð¥ð╝ð¥ÐëÐî.",
    "why.box4Title": "ðôð░ÐÇð░ð¢Ðéð©ÐÅ ð£ð¥ð┤ðÁð╗ð©",
    "why.box4Desc": "ðØð©ð║ð░ð║ð©Ðà ÐüÐÄÐÇð┐ÐÇð©ðÀð¥ð▓: ð▓Ðï ð┐ð¥ð╗ÐâÐçð©ÐéðÁ ð©ð╝ðÁð¢ð¢ð¥ ÐéÐâ ð╝ð░ÐÇð║Ðâ, ð╝ð¥ð┤ðÁð╗Ðî ð© ð┤ð▓ð©ð│ð░ÐéðÁð╗Ðî, ð║ð¥Ðéð¥ÐÇÐïðÁ Ðâð║ð░ðÀð░ð╗ð© ð┐ÐÇð© ð▒ÐÇð¥ð¢ð©ÐÇð¥ð▓ð░ð¢ð©ð©.",
    "modal.name": "ðñðÿð× *",
    "modal.phone": "ðóðÁð╗ðÁÐäð¥ð¢ / WhatsApp *",
    "modal.email": "ð¡ð╗ðÁð║ÐéÐÇð¥ð¢ð¢ð░ÐÅ ðƒð¥ÐçÐéð░ *",
    "modal.days": "ðöð¢ð© ðÉÐÇðÁð¢ð┤Ðï",
    "modal.extras": "ðöð¥ð┐ð¥ð╗ð¢ð©ÐéðÁð╗Ðîð¢ÐïðÁ ðúÐüð╗Ðâð│ð©",
    "modal.extra0": "ðíÐéð░ð¢ð┤ð░ÐÇÐéð¢ð░ÐÅ ð┤ð¥ÐüÐéð░ð▓ð║ð░ (ðÆð║ð╗ÐÄÐçðÁð¢ð¥)",
    "modal.extra150": "ðöð¥ÐüÐéð░ð▓ð║ð░ ð¢ð░ ðÆð©ð╗ð╗Ðâ / ðÉÐìÐÇð¥ð┐ð¥ÐÇÐé (+Ôé¼150)",
    "modal.extra300": "ðøð©Ðçð¢Ðïð╣ ðÆð¥ð┤ð©ÐéðÁð╗Ðî ð┐ð¥ð╗ð┤ð¢ÐÅ (+Ôé¼300)",
    "modal.estimate": "ð×ÐÇð©ðÁð¢Ðéð©ÐÇð¥ð▓ð¥Ðçð¢ð░ÐÅ ðíÐéð¥ð©ð╝ð¥ÐüÐéÐî:",
    "modal.kaskoInc": "ðíÐéÐÇð░Ðàð¥ð▓ð║ð░ ðÆð║ð╗ÐÄÐçðÁð¢ð░",
    "modal.btnConfirm": "ðƒð¥ð┤Ðéð▓ðÁÐÇð┤ð©ÐéÐî ðùð░ð┐ÐÇð¥Ðü ð▒ÐÇð¥ð¢ð©ÐÇð¥ð▓ð░ð¢ð©ÐÅ",
    "footer.desc": "ðÆðÁð┤ÐâÐëð©ð╣ ð╝ð░ÐÇð║ðÁÐéð┐ð╗ðÁð╣Ðü ð░ÐÇðÁð¢ð┤Ðï ð╗ÐÄð║Ðüð¥ð▓ÐïÐà, Ðüð┐ð¥ÐÇÐéð©ð▓ð¢ÐïÐà ð© Ðìð║Ðüð║ð╗ÐÄðÀð©ð▓ð¢ÐïÐà ð░ð▓Ðéð¥ð╝ð¥ð▒ð©ð╗ðÁð╣ ð▓ ðÿÐéð░ð╗ð©ð© ð© ðòð▓ÐÇð¥ð┐ðÁ. ðíð¥ðÀð┤ð░ð¢ð¥ Ðü ð╗ÐÄð▒ð¥ð▓ÐîÐÄ ð║ ð┤ð©ðÀð░ð╣ð¢Ðâ.",
    "footer.col1Title": "ðÜð░ÐéðÁð│ð¥ÐÇð©ð© ðÉð▓Ðéð¥",
    "footer.col2Title": "ðƒð¥ð╗ðÁðÀð¢ÐïðÁ ðíÐüÐïð╗ð║ð©",
    "footer.linkConditions": "ðúÐüð╗ð¥ð▓ð©ÐÅ ðÉÐÇðÁð¢ð┤Ðï",
    "footer.linkFaq": "ðÆð¥ð┐ÐÇð¥ÐüÐï ð© ðƒð¥ð┤ð┤ðÁÐÇðÂð║ð░",
    "footer.linkPartner": "ðíð¥ÐéÐÇÐâð┤ð¢ð©ÐçðÁÐüÐéð▓ð¥ / ðƒð░ÐÇÐéð¢ðÁÐÇÐï",
    "footer.col3Title": "ðôð╗ð░ð▓ð¢ÐïðÁ ð×Ðäð©ÐüÐï",
    "dynamic.cat": "ðÜð░ÐéðÁð│ð¥ÐÇð©ÐÅ",
    "dynamic.perDay": "/ ð┤ðÁð¢Ðî (ðíÐéÐÇð░Ðàð¥ð▓ð║ð░ ð▓ð║ð╗.)",
    "dynamic.book": "ðùð░ð▒ÐÇð¥ð¢ð©ÐÇð¥ð▓ð░ÐéÐî",
    "dynamic.noVehicles": "ðÉð▓Ðéð¥ð╝ð¥ð▒ð©ð╗ð© ð¢ðÁ ð¢ð░ð╣ð┤ðÁð¢Ðï",
    "dynamic.tryChange": "ðƒð¥ð┐ÐÇð¥ð▒Ðâð╣ÐéðÁ ð©ðÀð╝ðÁð¢ð©ÐéÐî Ðäð©ð╗ÐîÐéÐÇÐï ð┐ð¥ð©Ðüð║ð░ ð©ð╗ð© ð║ð░ÐéðÁð│ð¥ÐÇð©ÐÄ.",
    "lang.other": "ðöÐÇÐâð│ð©ðÁ ÐÅðÀÐïð║ð©...",
    "lang.modalTitle": "ðÆÐïð▒ðÁÐÇð©ÐéðÁ ð»ðÀÐïð║",
    "lang.modalSub": "ðÆÐïð▒ðÁÐÇð©ÐéðÁ ð┐ÐÇðÁð┤ð┐ð¥Ðçð©Ðéð░ðÁð╝Ðïð╣ ÐÅðÀÐïð║ ð¥Ðéð¥ð▒ÐÇð░ðÂðÁð¢ð©ÐÅ ð┤ð╗ÐÅ ð╝ð░ÐÇð║ðÁÐéð┐ð╗ðÁð╣Ðüð░ ITERCARS.",
    "toast.lang": "ð»ðÀÐïð║ ÐâÐüÐéð░ð¢ð¥ð▓ð╗ðÁð¢ ð¢ð░ ðáÐâÐüÐüð║ð©ð╣ ­ƒçÀ­ƒç║",
    "toast.bookingSuccess": "Ô£¿ ðùð░ð┐ÐÇð¥Ðü ÐâÐüð┐ðÁÐêð¢ð¥ ð¥Ðéð┐ÐÇð░ð▓ð╗ðÁð¢ ð┤ð╗ÐÅ {car}! ðÜð¥ð¢ÐüÐîðÁÐÇðÂ Ðüð║ð¥ÐÇð¥ Ðüð▓ÐÅðÂðÁÐéÐüÐÅ Ðü ð▓ð░ð╝ð©."
  },
  zh: {
    "nav.home": "ÚªûÚíÁ",
    "nav.fleet": "Luxury Car",
    "nav.why": "õ©║õ╗Çõ╣êÚÇëµï®µêæõ╗¼",
    "nav.vip": "VIP µ£ìÕèí",
    "nav.contacts": "Þüöþ│╗µû╣Õ╝Å",
    "nav.area": "VIP Þ┤ÁÕ«¥Õî║",
    "hero.badge": '<i class="ri-vip-crown-fill"></i> #1 Ú½ÿþ½»Þ▒¬ÕìÄµ▒¢Þ¢ªþºƒÞÁüÕ╣│ÕÅ░',
    "hero.title": 'Ú®¥Ú®¡ÕìôÞÂè <br><span class="text-gradient">µÄóþ┤óµùáþòîÒÇé</span>',
    "hero.subtitle": "õ╗ÄÕà¿þÉâµ£ÇÕ░èÞ┤ÁþÜäÞÂàþ║ºÞÀæÞ¢ªõ©ÄÞ▒¬ÕìÄÞ¢┐Þ¢ªõ©¡µîæÚÇëÒÇéµùáÞ«║Þ║½Õ£¿õ¢òÕñä´╝îõ©ôõ║║ÚÇüÞ¢ªõ©èÚù¿´╝îõ║½ÕÅùÕà¿ÚóØõ┐ØÚÖ®õ©ÄÚÜ¥Õ┐ÿÚ®¥Ú®Âõ¢ôÚ¬îÒÇé",
    "hero.btnDiscover": "µÄóþ┤óÞ¢ªÚÿƒ",
    "hero.btnQuote": "Õ«×µùÂµèÑõ╗À",
    "hero.stat1": "ÚíÂþ║ºÞÂàÞÀæ",
    "hero.stat2": "õ©ôÕ▒×þ«íÕ«Â",
    "hero.stat3": "Þ¢ªÕ×ïõ┐ØÞ»ü",
    "vip.title": "VIP Õà¿ÚÖ®õ┐ØÚÜ£",
    "vip.subtitle": "ÕîàÕÉ½ 100% Õà¿ÚóØõ┐ØÚÜ£",
    "vip.desc": "µ»Åµ¼íþºƒÞÁüÕØçÕîàÕÉ½µ¼ºµ┤▓Õà¿Õóâ 24/7 ÚüôÞÀ»µòæµÅ┤´╝î60ÕêåÚÆƒÕåàµÅÉõ¥øþø┤Õìçµ£║µêûµø┐µìóÞÂàÞÀæµ£ìÕèíÒÇé",
    "vip.check1": "Õê½ÕóàÚÇüÞ¢ª",
    "vip.check2": "ÚøÂÕàìÞÁöÚóØ",
    "search.location": "ÕÅûÞ¢ªÕ£░þé╣",
    "search.locAny": "õ╗╗µäÅÕƒÄÕ©é / µ£║Õ£║",
    "search.dateFrom": "ÕÅûÞ¢ªµùÑµ£ƒ",
    "search.dateTo": "Þ┐ÿÞ¢ªµùÑµ£ƒ",
    "search.category": "Þ¢ªÕ×ïþ▒╗Õê½",
    "search.catAll": "Õà¿Úâ¿þ▒╗Õê½",
    "search.btn": "µÉ£þ┤óÞ¢ªÞ¥å",
    "fleet.tag": "Luxury Car",
    "fleet.title": 'þ▓¥ÚÇëÕ║ºÚ®¥ õ©║<span class="text-gradient">þ║»þ▓╣µ┐Çµâà</span>ÞÇîþöƒ',
    "fleet.subtitle": "õ©║µé¿µÄÑõ©ïµØÑþÜäÕòåÕèíÕÀ«µùàÒÇüÕ░èõ║½Õæ¿µ£½µêûþë╣µ«èµ┤╗Õè¿ÚÇëµï®µ£ÇÕ«îþ¥ÄþÜäÕ║ºÚ®¥ÒÇé",
    "filter.all": "Õà¿Úâ¿Þ¢ªÕ×ï",
    "why.tag": "µá©Õ┐âõ╝ÿÕè┐",
    "why.title": 'õ©║õ╗Çõ╣êÚÇëµï® <span class="text-gold">ITERCARS</span>',
    "why.subtitle": "µêæõ╗¼Õ░åÚíÂÕ░ûþÜäÞç¬µ£ëÞ¢ªÚÿƒõ©Äõ║öµÿƒþ║ºÕ¥àÕ«óõ╣ïÚüôþ╗ôÕÉê´╝îÚçìµû░Õ«Üõ╣ëþºƒÞ¢ªõ¢ôÚ¬îÒÇé",
    "why.box1Title": "Õà¿Õóâõ©ôõ║║ÚÇüÞ¥¥",
    "why.box1Desc": "µêæõ╗¼þÜäõ©ôõ©ÜÕøóÚÿƒÕÅ»Õ░åÞ¢ªÞ¥åþø┤µÄÑÚÇüÕê░µé¿õ©ïµª╗þÜäÚàÆÕ║ùÒÇüþºüõ║║Õê½Õóàµêûþºüõ║║Úú×µ£║Þê¬þ½ÖµÑ╝ÒÇé",
    "why.box2Title": "VIP Õà¿ÚóØõ┐ØÚÖ®",
    "why.box2Desc": "µëÇµ£ëÞ¢ªÞ¥åÕØçõ║½µ£ëÚøÂÕàìÞÁöÚóØÕÅèÕà¿ÚóØõ┐ØÚÖ®õ┐ØÚÜ£´╝îÞ«®µé¿þÜäµùàþ¿ïÕ░¢õ║½µùáÕ┐ºÒÇé",
    "why.box3Title": "24/7 õ©ôÕ▒×þñ╝Õ«¥",
    "why.box3Desc": "Õà¿Õñ®ÕÇÖõ©ôÕ▒×ÕìÅÕè®ÒÇéÚñÉÕÄàÚóäÞ«óÒÇüÕ«ÜÕêÂÞíîþ¿ïÕ«ëµÄÆõ╗ÑÕÅèÕì│µùÂµèÇµ£»µö»µîüÒÇé",
    "why.box4Title": "þ╗ØÕ»╣Þ¢ªÕ×ïõ┐ØÞ»ü",
    "why.box4Desc": "þ╗ØµùáµäÅÕñû´╝Üµé¿µöÂÕê░þÜäÕ░åõ©ÄÚóäÞ«óµùÂµîçÕ«ÜþÜäÕôüþëîÒÇüÕ×ïÕÅÀÕÅèÕÅæÕè¿µ£║Úàìþ¢«Õ«îÕà¿õ©ÇÞç┤ÒÇé",
    "modal.name": "þ£ƒÕ«×ÕºôÕÉì *",
    "modal.phone": "þöÁÞ»Ø / Õ¥«õ┐í / WhatsApp *",
    "modal.email": "þöÁÕ¡ÉÚé«þ«▒ *",
    "modal.days": "þºƒÞÁüÕñ®µò░",
    "modal.extras": "Õó×ÕÇ╝µ£ìÕèí",
    "modal.extra0": "µáçÕçåÚÇüÞ¢ªµ£ìÕèí (ÕàìÞ┤╣)",
    "modal.extra150": "Õê½Õóà / µ£║Õ£║õ©ôÚÇü (+Ôé¼150)",
    "modal.extra300": "ÕìèµùÑþºüõ║║ÕÅ©µ£║µ£ìÕèí (+Ôé¼300)",
    "modal.estimate": "ÚóäÞ«íµÇ╗µèÑõ╗À:",
    "modal.kaskoInc": "ÕîàÕÉ½Õà¿ÚÖ®",
    "modal.btnConfirm": "µÅÉõ║ñÚóäÞ«óþö│Þ»À",
    "footer.desc": "µäÅÕñºÕê®ÕÅèµ¼ºµ┤▓ÚóåÕàêþÜäÞ▒¬ÕìÄµ▒¢Þ¢ªÒÇüÞÀæÞ¢ªÕÅèþ¿Çµ£ëÞ¢ªÕ×ïþºƒÞÁüµ£ìÕèíÕ╣│ÕÅ░ÒÇéþö▒þâ¡µâàõ©ÄÕìôÞÂèÞ«¥Þ«íÚ®▒Õè¿ÒÇé",
    "footer.col1Title": "Þ¢ªÚÿƒþ▒╗Õê½",
    "footer.col2Title": "Õ«×þö¿Úô¥µÄÑ",
    "footer.linkConditions": "þºƒÞÁüµØíµ¼¥",
    "footer.linkFaq": "Õ©©ÞºüÚù«Úóÿõ©Äµö»µîü",
    "footer.linkPartner": "ÕòåÕèíÕÉêõ¢£ / µïøÕòå",
    "footer.col3Title": "õ©╗ÞªüµÇ╗Úâ¿",
    "dynamic.cat": "þ▒╗Õê½",
    "dynamic.perDay": "/ Õñ® (ÕÉ½Õà¿ÚÖ®)",
    "dynamic.book": "þ½ïÕì│ÚóäÞ«ó",
    "dynamic.noVehicles": "µ£¬µë¥Õê░þ¼ªÕÉêµØíõ╗ÂþÜäÞ¢ªÞ¥å",
    "dynamic.tryChange": "Þ»ÀÕ░ØÞ»òþ¡øÚÇëÕàÂõ╗ûµÉ£þ┤óµØíõ╗Âµêûþ▒╗Õê½ÒÇé",
    "lang.other": "µø┤ÕñÜÞ»¡Þ¿Ç...",
    "lang.modalTitle": "ÚÇëµï®Þ»¡Þ¿Ç",
    "lang.modalSub": "ÚÇëµï®µé¿ÕüÅÕÑ¢þÜä ITERCARS Õ╣│ÕÅ░µÿ¥þñ║Þ»¡Þ¿ÇÒÇé",
    "toast.lang": "Þ»¡Þ¿ÇÕÀ▓ÕêçµìóÞç│ õ©¡µûç ­ƒç¿­ƒç│",
    "toast.bookingSuccess": "Ô£¿ {car} ÚóäÞ«óþö│Þ»ÀµÅÉõ║ñµêÉÕèƒ´╝üõ©ôÕ▒×þñ╝Õ«¥þ«íÕ«ÂÕ░åÕ¥êÕ┐½õ©Äµé¿Þüöþ│╗ÒÇé"
  },
  ar: {
    "nav.home": "Ïº┘äÏ▒Ïª┘èÏ│┘èÏ®",
    "nav.fleet": "Luxury Car",
    "nav.why": "┘ä┘àÏºÏ░Ïº ┘åÏ¡┘å",
    "nav.vip": "Ï«Ï»┘àÏºÏ¬ VIP",
    "nav.contacts": "ÏºÏ¬ÏÁ┘ä Ï¿┘åÏº",
    "nav.area": "ÏÁÏº┘äÏ® ┘âÏ¿ÏºÏ▒ Ïº┘äÏ┤Ï«ÏÁ┘èÏºÏ¬",
    "hero.badge": '<i class="ri-vip-crown-fill"></i> Ïº┘ä┘à┘åÏÁÏ® Ï▒┘é┘à 1 ┘äÏ¬ÏúÏ¼┘èÏ▒ Ïº┘äÏ│┘èÏºÏ▒ÏºÏ¬ Ïº┘ä┘üÏºÏ«Ï▒Ï®',
    "hero.title": '┘é┘èÏºÏ»Ï® Ïº┘äÏ¬┘à┘èÏ▓ <br><span class="text-gradient">Ï¿┘äÏº Ï¡Ï»┘êÏ».</span>',
    "hero.subtitle": "ÏºÏ«Ï¬Ï▒ ┘à┘å Ï¿┘è┘å Ïú┘âÏ½Ï▒ Ïº┘äÏ│┘èÏºÏ▒ÏºÏ¬ Ïº┘äÏ«ÏºÏ▒┘éÏ® ┘êÏ│┘èÏºÏ▒ÏºÏ¬ Ïº┘äÏ│┘èÏ»Ïº┘å Ï¡ÏÁÏ▒┘èÏ® Ï╣┘ä┘ë ┘êÏ¼┘ç Ïº┘äÏúÏ▒ÏÂ. Ï¬┘êÏÁ┘è┘ä ┘àÏ«ÏÁÏÁ Ïú┘è┘å┘àÏº ┘â┘åÏ¬Ïî Ï¬Ïú┘à┘è┘å Ï┤Ïº┘à┘ä ┘êÏ¬Ï¼Ï▒Ï¿Ï® ┘é┘èÏºÏ»Ï® ┘äÏº Ï¬┘Å┘åÏ│┘ë.",
    "hero.btnDiscover": "Ïº┘âÏ¬Ï┤┘ü Ïº┘äÏúÏ│ÏÀ┘ê┘ä",
    "hero.btnQuote": "Ï¬Ï│Ï╣┘èÏ▒ ┘ü┘êÏ▒┘è",
    "hero.stat1": "Ï│┘èÏºÏ▒ÏºÏ¬ Ï«ÏºÏ▒┘éÏ® Ï¡ÏÁÏ▒┘èÏ®",
    "hero.stat2": "Ï«Ï»┘àÏ® ┘â┘ê┘åÏ│┘èÏ▒Ï¼ ┘àÏ«ÏÁÏÁÏ®",
    "hero.stat3": "ÏÂ┘àÏº┘å Ïº┘ä┘à┘êÏ»┘è┘ä",
    "vip.title": "ÏÂ┘àÏº┘å Ïº┘äÏ¬Ïú┘à┘è┘å Ïº┘äÏ┤Ïº┘à┘ä VIP",
    "vip.subtitle": "Ï¬Ï║ÏÀ┘èÏ® Ï¿┘åÏ│Ï¿Ï® 100% ┘àÏ¬ÏÂ┘à┘åÏ®",
    "vip.desc": "┘â┘ä ÏÑ┘èÏ¼ÏºÏ▒ ┘èÏ┤┘à┘ä ┘àÏ│ÏºÏ╣Ï»Ï® Ï╣┘ä┘ë Ïº┘äÏÀÏ▒┘è┘é Ï╣┘ä┘ë ┘àÏ»ÏºÏ▒ 24 Ï│ÏºÏ╣Ï® ┘àÏ╣ ┘àÏ▒┘êÏ¡┘èÏ® Ïú┘ê Ï│┘èÏºÏ▒Ï® Ï¿Ï»┘è┘äÏ® Ï«ÏºÏ▒┘éÏ® Ï«┘äÏº┘ä 60 Ï»┘é┘è┘éÏ® ┘ü┘è Ï¼┘à┘èÏ╣ Ïú┘åÏ¡ÏºÏí Ïú┘êÏ▒┘êÏ¿Ïº.",
    "vip.check1": "Ï¬┘êÏÁ┘è┘ä ┘ä┘ä┘ü┘è┘äÏº",
    "vip.check2": "Ï¿Ï»┘ê┘å ┘åÏ│Ï¿Ï® Ï¬Ï¡┘à┘ä",
    "search.location": "┘à┘âÏº┘å Ïº┘äÏºÏ│Ï¬┘äÏº┘à",
    "search.locAny": "Ïú┘è ┘àÏ»┘è┘åÏ® / ┘àÏÀÏºÏ▒",
    "search.dateFrom": "Ï¬ÏºÏ▒┘èÏ« Ïº┘äÏºÏ│Ï¬┘äÏº┘à",
    "search.dateTo": "Ï¬ÏºÏ▒┘èÏ« Ïº┘äÏ╣┘êÏ»Ï®",
    "search.category": "┘üÏªÏ® Ïº┘äÏ│┘èÏºÏ▒Ï®",
    "search.catAll": "Ï¼┘à┘èÏ╣ Ïº┘ä┘üÏªÏºÏ¬",
    "search.btn": "ÏºÏ¿Ï¡Ï½ Ï╣┘å Ï│┘èÏºÏ▒Ï®",
    "fleet.tag": "Luxury Car",
    "fleet.title": 'Ï│┘èÏºÏ▒ÏºÏ¬ ┘àÏ«Ï¬ÏºÏ▒Ï® ┘à┘å ÏúÏ¼┘ä <span class="text-gradient">Ï╣┘êÏºÏÀ┘ü Ï«Ïº┘äÏÁÏ®</span>',
    "fleet.subtitle": "ÏºÏ«Ï¬Ï▒ Ïº┘ä┘à┘êÏ»┘è┘ä Ïº┘ä┘àÏ½Ïº┘ä┘è ┘äÏ▒Ï¡┘äÏ® Ï╣┘à┘ä┘â Ïº┘ä┘éÏºÏ»┘àÏ®Ïî Ï╣ÏÀ┘äÏ® ┘å┘çÏº┘èÏ® ÏúÏ│Ï¿┘êÏ╣ Ï¡ÏÁÏ▒┘èÏ® Ïú┘ê Ï¡Ï»Ï½ Ï«ÏºÏÁ.",
    "filter.all": "Ï¼┘à┘èÏ╣ Ïº┘ä┘à┘êÏ»┘è┘äÏºÏ¬",
    "why.tag": "┘àÏ▓Ïº┘èÏº┘åÏº",
    "why.title": '┘ä┘àÏºÏ░Ïº Ï¬Ï«Ï¬ÏºÏ▒ <span class="text-gold">ITERCARS</span>',
    "why.subtitle": "┘åÏ¡┘å ┘åÏ╣┘èÏ» Ï¬Ï╣Ï▒┘è┘ü Ï¬ÏúÏ¼┘èÏ▒ Ïº┘äÏ│┘èÏºÏ▒ÏºÏ¬ ┘à┘å Ï«┘äÏº┘ä Ïº┘äÏ¼┘àÏ╣ Ï¿┘è┘å ÏúÏ│ÏÀ┘ê┘ä Ï«ÏºÏÁ ┘à┘å Ïº┘äÏ»Ï▒Ï¼Ï® Ïº┘äÏú┘ê┘ä┘ë ┘àÏ╣ ÏÂ┘èÏº┘üÏ® 5 ┘åÏ¼┘ê┘à.",
    "why.box1Title": "Ïº┘äÏ¬┘êÏÁ┘è┘ä ┘ü┘è Ïú┘è ┘à┘âÏº┘å",
    "why.box1Desc": "┘å┘é┘ê┘à Ï¿Ï¬Ï│┘ä┘è┘à Ïº┘äÏ│┘èÏºÏ▒Ï® ┘àÏ¿ÏºÏ┤Ï▒Ï® ÏÑ┘ä┘ë ┘ü┘åÏ»┘é┘âÏî ┘ü┘è┘äÏ¬┘â Ïº┘äÏ«ÏºÏÁÏ®Ïî Ïú┘ê ÏÁÏº┘äÏ® Ïº┘äÏÀ┘èÏ▒Ïº┘å Ïº┘äÏ«ÏºÏÁ Ï╣Ï¿Ï▒ ┘üÏ▒┘è┘é┘åÏº.",
    "why.box2Title": "Ï¬Ïú┘à┘è┘å VIP Ï┤Ïº┘à┘ä",
    "why.box2Desc": "Ï│Ïº┘üÏ▒ Ï¿Ï▒ÏºÏ¡Ï® Ï¿Ïº┘ä Ï¬Ïº┘àÏ® ┘àÏ╣ ÏÑÏ╣┘üÏºÏí ┘âÏº┘à┘ä ┘à┘å Ï¬Ï¡┘à┘ä Ïº┘äÏúÏÂÏ▒ÏºÏ▒ ┘êÏ¬Ï║ÏÀ┘èÏ® Ï¬Ïú┘à┘è┘å┘èÏ® Ï┤Ïº┘à┘äÏ® Ï╣┘ä┘ë Ï¼┘à┘èÏ╣ Ï│┘èÏºÏ▒ÏºÏ¬┘åÏº.",
    "why.box3Title": "┘â┘ê┘åÏ│┘èÏ▒Ï¼ 24/7",
    "why.box3Desc": "┘àÏ│ÏºÏ╣Ï»Ï® ┘àÏ«ÏÁÏÁÏ® ┘ä┘è┘ä ┘å┘çÏºÏ▒. Ï¡Ï¼┘êÏ▓ÏºÏ¬ Ïº┘ä┘àÏÀÏºÏ╣┘àÏî ┘àÏ│ÏºÏ▒ÏºÏ¬ ┘àÏ«ÏÁÏÁÏ® ┘êÏ»Ï╣┘à ┘ü┘å┘è ┘ü┘êÏ▒┘è.",
    "why.box4Title": "ÏÂ┘àÏº┘å Ïº┘ä┘à┘êÏ»┘è┘ä Ïº┘ä┘àÏ¡Ï»Ï»",
    "why.box4Desc": "┘äÏº ┘à┘üÏºÏ¼ÏóÏ¬: Ï│Ï¬Ï│Ï¬┘ä┘à Ï¿Ïº┘äÏÂÏ¿ÏÀ ┘å┘üÏ│ Ïº┘äÏ╣┘äÏº┘àÏ® Ïº┘äÏ¬Ï¼ÏºÏ▒┘èÏ®Ïî Ïº┘ä┘à┘êÏ»┘è┘ä ┘êÏº┘ä┘àÏ¡Ï▒┘â Ïº┘ä┘àÏ¡Ï»Ï» Ï╣┘åÏ» Ïº┘äÏ¡Ï¼Ï▓.",
    "modal.name": "Ïº┘äÏºÏ│┘à Ïº┘ä┘âÏº┘à┘ä *",
    "modal.phone": "Ïº┘ä┘çÏºÏ¬┘ü / ┘êÏºÏ¬Ï│ÏºÏ¿ *",
    "modal.email": "Ïº┘äÏ¿Ï▒┘èÏ» Ïº┘äÏÑ┘ä┘âÏ¬Ï▒┘ê┘å┘è *",
    "modal.days": "Ïú┘èÏº┘à Ïº┘äÏÑ┘èÏ¼ÏºÏ▒",
    "modal.extras": "Ï«Ï»┘àÏºÏ¬ ÏÑÏÂÏº┘ü┘èÏ®",
    "modal.extra0": "Ïº┘äÏ¬┘êÏÁ┘è┘ä Ïº┘ä┘é┘èÏºÏ│┘è (┘àÏ¼Ïº┘åÏº┘ï)",
    "modal.extra150": "Ï¬┘êÏÁ┘è┘ä ┘ä┘ä┘ü┘è┘äÏº / Ïº┘ä┘àÏÀÏºÏ▒ (+Ôé¼150)",
    "modal.extra300": "Ï│ÏºÏª┘é Ï«ÏºÏÁ ┘ä┘åÏÁ┘ü ┘è┘ê┘à (+Ôé¼300)",
    "modal.estimate": "ÏÑÏ¼┘àÏº┘ä┘è Ïº┘äÏ¬Ï│Ï╣┘èÏ▒ Ïº┘ä┘à┘éÏ»Ï▒:",
    "modal.kaskoInc": "Ïº┘äÏ¬Ïú┘à┘è┘å ┘àÏ┤┘à┘ê┘ä",
    "modal.btnConfirm": "Ï¬Ïú┘â┘èÏ» ÏÀ┘äÏ¿ Ïº┘äÏ¡Ï¼Ï▓",
    "footer.desc": "Ïº┘ä┘à┘åÏÁÏ® Ïº┘äÏ▒ÏºÏªÏ»Ï® ┘äÏ¬ÏúÏ¼┘èÏ▒ Ïº┘äÏ│┘èÏºÏ▒ÏºÏ¬ Ïº┘ä┘üÏºÏ«Ï▒Ï®Ïî Ïº┘äÏ▒┘èÏºÏÂ┘èÏ® ┘êÏº┘äÏ¡ÏÁÏ▒┘èÏ® ┘ü┘è ÏÑ┘èÏÀÏº┘ä┘èÏº ┘êÏú┘êÏ▒┘êÏ¿Ïº. ┘àÏ»┘ü┘êÏ╣ Ï¿Ïº┘äÏ┤Ï║┘ü ┘êÏº┘äÏ¬ÏÁ┘à┘è┘à.",
    "footer.col1Title": "┘üÏªÏºÏ¬ Ïº┘äÏúÏ│ÏÀ┘ê┘ä",
    "footer.col2Title": "Ï▒┘êÏºÏ¿ÏÀ ┘à┘ü┘èÏ»Ï®",
    "footer.linkConditions": "Ï┤Ï▒┘êÏÀ Ïº┘äÏ¬ÏúÏ¼┘èÏ▒",
    "footer.linkFaq": "Ïº┘äÏúÏ│Ïª┘äÏ® Ïº┘äÏ┤ÏºÏªÏ╣Ï® ┘êÏº┘äÏ»Ï╣┘à",
    "footer.linkPartner": "ÏºÏ╣┘à┘ä ┘àÏ╣┘åÏº / Ï┤Ï▒┘âÏºÏí",
    "footer.col3Title": "Ïº┘ä┘à┘éÏ▒ Ïº┘äÏ▒Ïª┘èÏ│┘è",
    "dynamic.cat": "Ïº┘ä┘üÏªÏ®",
    "dynamic.perDay": "/ ┘è┘ê┘à (Ïº┘äÏ¬Ïú┘à┘è┘å ┘àÏ┤┘à┘ê┘ä)",
    "dynamic.book": "ÏºÏ¡Ï¼Ï▓ Ïº┘äÏó┘å",
    "dynamic.noVehicles": "┘ä┘à ┘èÏ¬┘à Ïº┘äÏ╣Ï½┘êÏ▒ Ï╣┘ä┘ë Ï│┘èÏºÏ▒ÏºÏ¬",
    "dynamic.tryChange": "Ï¡Ïº┘ê┘ä Ï¬Ï║┘è┘èÏ▒ ┘ü┘äÏºÏ¬Ï▒ Ïº┘äÏ¿Ï¡Ï½ Ïú┘ê Ïº┘ä┘üÏªÏ®.",
    "lang.other": "┘äÏ║ÏºÏ¬ ÏúÏ«Ï▒┘ë...",
    "lang.modalTitle": "ÏºÏ«Ï¬Ï▒ Ïº┘ä┘äÏ║Ï®",
    "lang.modalSub": "ÏºÏ«Ï¬Ï▒ ┘äÏ║Ï® Ïº┘äÏ╣Ï▒ÏÂ Ïº┘ä┘à┘üÏÂ┘äÏ® ┘äÏ»┘è┘â ┘ä┘à┘åÏÁÏ® ITERCARS.",
    "toast.lang": "Ï¬┘à Ï¬Ï╣┘è┘è┘å Ïº┘ä┘äÏ║Ï® ÏÑ┘ä┘ë Ïº┘äÏ╣Ï▒Ï¿┘èÏ® ­ƒç©­ƒçª",
    "toast.bookingSuccess": "Ô£¿ Ï¬┘à ÏÑÏ▒Ï│Ïº┘ä Ïº┘äÏÀ┘äÏ¿ Ï¿┘åÏ¼ÏºÏ¡ ┘ä┘Ç {car}! Ï│┘èÏ¬ÏÁ┘ä Ï¿┘â ┘üÏ▒┘è┘é Ïº┘ä┘â┘ê┘åÏ│┘èÏ▒Ï¼ ┘éÏ▒┘èÏ¿Ïº┘ï."
  },
  ja: {
    "nav.home": "ÒâøÒâ╝Òâá",
    "nav.fleet": "Luxury Car",
    "nav.why": "Úü©Òü░ÒéîÒéïþÉåþö▒",
    "nav.vip": "VIPÒéÁÒâ╝ÒâôÒé╣",
    "nav.contacts": "ÒüèÕòÅÒüäÕÉêÒéÅÒüø",
    "nav.area": "VIPÒâ®ÒéªÒâ│Òé©",
    "hero.badge": '<i class="ri-vip-crown-fill"></i> #1 Ú½ÿþ┤ÜÒâ®Òé░Òé©ÒâÑÒéóÒâ¬Òâ╝Òâ¼Òâ│Òé┐Òé½Òâ╝Òâ╗Òâ×Òâ╝Òé▒ÒââÒâêÒâùÒâ¼ÒéñÒé╣',
    "hero.title": 'ÕìôÞÂèÒüùÒüƒÒâëÒâ®ÒéñÒâôÒâ│Òé░ <br><span class="text-gradient">þäíÚÖÉÒü«ÕÅ»Þâ¢µÇºÒÇé</span>',
    "hero.subtitle": "õ©ûþòîÒüºµ£ÇÒééÕ©îÕ░æÒü¬Òé╣Òâ╝ÒâæÒâ╝Òé½Òâ╝ÒéäÚ½ÿþ┤ÜÒé╗ÒâÇÒâ│ÒüïÒéëÒüèÚü©Òü│ÒüÅÒüáÒüòÒüäÒÇéµîçÕ«ÜÕá┤µëÇÒü©Òü«Òé¬Òâ╝ÒâÇÒâ╝ÒâíÒéñÒâëÚàìÞ╗èÒÇüÕ«îÕà¿Þú£Õäƒõ┐ØÚÖ║ÒÇüÒüØÒüùÒüªÕ┐ÿÒéîÒéëÒéîÒü¬ÒüäÚüïÞ╗óõ¢ôÚ¿ôÒéÆÒÇé",
    "hero.btnDiscover": "Þ╗èõ©íÒéÆÞªïÒéï",
    "hero.btnQuote": "Õì│µÖéÞªïþ®ìÒééÒéè",
    "hero.stat1": "µ£ÇÚ½ÿÕ│░Òé╣Òâ╝ÒâæÒâ╝Òé½Òâ╝",
    "hero.stat2": "Õ░éÕ▒×Òé│Òâ│ÒéÀÒéºÒâ½Òé©ÒâÑ",
    "hero.stat3": "ÒâóÒâçÒâ½þó║þ┤ä",
    "vip.title": "VIPÒâòÒâ½Þú£Õäƒõ┐ØÞ¿╝",
    "vip.subtitle": "100%Þú£ÕäƒÞ¥╝Òü┐",
    "vip.desc": "ÒüÖÒü╣ÒüªÒü«Òâ¼Òâ│Òé┐Òâ½Òü½24µÖéÚûô365µùÑÒü«Òâ¡Òâ╝ÒâëÒéÁÒâ╝ÒâôÒé╣Òüîõ╗ÿÕ▒×ÒÇéÒâ¿Òâ╝Òâ¡ÒââÒâæÕà¿Õ£ƒÒüº60Õêåõ╗ÑÕåàÒü½ÒâÿÒâ¬Òé│ÒâùÒé┐Òâ╝Òü¥ÒüƒÒü»õ╗úµø┐Òé╣Òâ╝ÒâæÒâ╝Òé½Òâ╝ÒéÆµëïÚàìÒüùÒü¥ÒüÖÒÇé",
    "vip.check1": "ÕêÑÞìÿÒâ╗ÒâøÒâåÒâ½ÚàìÞ╗è",
    "vip.check2": "ÕàìÞ▓¼ÚíìÒé╝Òâ¡",
    "search.location": "ÚàìÞ╗èÕá┤µëÇ",
    "search.locAny": "ÒüÖÒü╣ÒüªÒü«Úâ¢Õ©éÒâ╗þ®║µ©»",
    "search.dateFrom": "Þ▓©Õç║µùÑ",
    "search.dateTo": "Þ┐öÕì┤µùÑ",
    "search.category": "Òé½ÒâåÒé┤Òâ¬Òâ╝",
    "search.catAll": "ÒüÖÒü╣ÒüªÒü«Òé½ÒâåÒé┤Òâ¬Òâ╝",
    "search.btn": "Þ╗èõ©íÒéÆµñ£þ┤ó",
    "fleet.tag": "Luxury Car",
    "fleet.title": 'þ┤öþ▓ïÒü¬µäƒÕïòÒéÆÕæ╝ÒüÂ <span class="text-gradient">ÕÄ│Úü©ÒüòÒéîÒüƒÕÉìÞ╗èÒüƒÒüí</span>',
    "fleet.subtitle": "µ¼íÒü«ÒâôÒé©ÒâìÒé╣Õç║Õ╝ÁÒÇüþë╣ÕêÑÒü¬ÚÇ▒µ£½ÒÇüÒü¥ÒüƒÒü»Þ¿ÿÕ┐ÁÒéñÒâÖÒâ│ÒâêÒü½µ£ÇÚü®Òü¬ÒâóÒâçÒâ½ÒéÆÒüèÚü©Òü│ÒüÅÒüáÒüòÒüäÒÇé",
    "filter.all": "ÒüÖÒü╣ÒüªÒü«ÒâóÒâçÒâ½",
    "why.tag": "Õ¢ôþñ¥Òü«Õ╝ÀÒü┐",
    "why.title": '<span class="text-gold">ITERCARS</span> ÒüîÚü©Òü░ÒéîÒéïþÉåþö▒',
    "why.subtitle": "µ£ÇÚ½ÿÕ│░Òü«Þç¬þñ¥õ┐Øµ£ëÒâòÒâ¬Òâ╝ÒâêÒü¿5ÒüñµÿƒÒü«ÒüèÒééÒüªÒü¬ÒüùÒéÆþÁäÒü┐ÕÉêÒéÅÒüøÒÇüÒâ¼Òâ│Òé┐Òé½Òâ╝Òü«µªéÕ┐ÁÒéÆÕåìÕ«Üþ¥®ÒüùÒü¥ÒüÖÒÇé",
    "why.box1Title": "Òü®ÒüôÒü©ÒüºÒééµîçÕ«ÜÚàìÞ╗è",
    "why.box1Desc": "Õ░éÚûÇÒé╣Òé┐ÒââÒâòÒüîÒüöµ╗×Õ£¿ÕàêÒü«ÒâøÒâåÒâ½ÒÇüÒâùÒâ®ÒéñÒâÖÒâ╝ÒâêÒâ┤ÒéúÒâ®ÒÇüÒü¥ÒüƒÒü»ÒâùÒâ®ÒéñÒâÖÒâ╝ÒâêÒé©ÒéºÒââÒâêÒü«Òé┐Òâ╝ÒâƒÒâèÒâ½Òü¥Òüºþø┤µÄÑÒüèÞ╗èÒéÆÒüèÕ▒èÒüæÒüùÒü¥ÒüÖÒÇé",
    "why.box2Title": "VIPÕ«ëÕ┐âÒâòÒâ½Þú£Õäƒ",
    "why.box2Desc": "ÒüÖÒü╣ÒüªÒü«Þ╗èõ©íÒü½ÕàìÞ▓¼ÚíìÒé╝Òâ¡Òü«Õ«îÕà¿õ┐ØÚÖ║Þú£ÕäƒÒüîÚü®þö¿ÒüòÒéîÒÇüþÁÂÕ»¥þÜäÒü¬Õ«ëÕ┐âµäƒÒü¿Òü¿ÒééÒü½ÒüèµùàÒéÆÒüèµÑ¢ÒüùÒü┐ÒüäÒüƒÒüáÒüæÒü¥ÒüÖÒÇé",
    "why.box3Title": "24µÖéÚûôÒé│Òâ│ÒéÀÒéºÒâ½Òé©ÒâÑ",
    "why.box3Desc": "µÿ╝Õñ£ÒéÆÕòÅÒéÅÒüÜÕ░éÕ▒×ÒéÁÒâØÒâ╝ÒâêÒÇéÒâ¼Òé╣ÒâêÒâ®Òâ│Òü«Òüöõ║êþ┤äÒÇüÒé¬Òâ╝ÒâÇÒâ╝ÒâíÒéñÒâëÒü«µùàþ¿ïµÅÉµíêÒÇüÕì│µÖéÒü«µèÇÞíôÒéÁÒâØÒâ╝ÒâêÒéÆµÅÉõ¥øÒüùÒü¥ÒüÖÒÇé",
    "why.box4Title": "þó║Õ«ƒÒü¬ÒâóÒâçÒâ½þó║þ┤ä",
    "why.box4Desc": "Ú®ÜÒüìÒü»ÒüéÒéèÒü¥ÒüøÒéô´╝ÜÒüöõ║êþ┤äµÖéÒü½µîçÕ«ÜÒüòÒéîÒüƒÒâûÒâ®Òâ│ÒâëÒÇüÒâóÒâçÒâ½ÒÇüÒé¿Òâ│Òé©Òâ│õ╗òµºÿÒü¿Õà¿ÒüÅÕÉîÒüÿÞ╗èõ©íÒéÆÒüèÕ▒èÒüæÒüùÒü¥ÒüÖÒÇé",
    "modal.name": "ÒüèÕÉìÕëì (ÒâòÒâ½ÒâìÒâ╝Òâá) *",
    "modal.phone": "ÒüèÚø╗Þ®▒þò¬ÕÅÀ / WhatsApp *",
    "modal.email": "ÒâíÒâ╝Òâ½ÒéóÒâëÒâ¼Òé╣ *",
    "modal.days": "ÒüöÕê®þö¿µùÑµò░",
    "modal.extras": "Þ┐¢ÕèáÒéÁÒâ╝ÒâôÒé╣",
    "modal.extra0": "µ¿Öµ║ûÚàìÞ╗èÒéÁÒâ╝ÒâôÒé╣ (þäíµûÖ)",
    "modal.extra150": "Òâ┤ÒéúÒâ®Òâ╗þ®║µ©»µîçÕ«ÜÚàìÞ╗è (+Ôé¼150)",
    "modal.extra300": "ÕìèµùÑÒâùÒâ®ÒéñÒâÖÒâ╝ÒâêÚüïÞ╗óµëï (+Ôé¼300)",
    "modal.estimate": "ÒüèÞªïþ®ìÒééÒéèþÀÅÚíì:",
    "modal.kaskoInc": "õ┐ØÚÖ║µûÖÞ¥╝Òü┐",
    "modal.btnConfirm": "õ║êþ┤äÒâ¬Òé»Òé¿Òé╣ÒâêÒéÆÚÇüõ┐í",
    "footer.desc": "ÒéñÒé┐Òâ¬ÒéóÒüèÒéêÒü│Òâ¿Òâ╝Òâ¡ÒââÒâæÒü½ÒüèÒüæÒéïÚ½ÿþ┤ÜÞ╗èÒÇüÒé╣ÒâØÒâ╝ÒâäÒé½Òâ╝ÒÇüÕ©îÕ░æÞ╗èÒü«Òâ¼Òâ│Òé┐Òâ½ÒéÆÒâ¬Òâ╝ÒâëÒüÖÒéïÒâ×Òâ╝Òé▒ÒââÒâêÒâùÒâ¼ÒéñÒé╣ÒÇéµâàþå▒Òü¿ÒâçÒéÂÒéñÒâ│Òü½ÒéêÒüúÒüªÚºåÕïòÒüòÒéîÒüªÒüäÒü¥ÒüÖÒÇé",
    "footer.col1Title": "Þ╗èõ©íÒé½ÒâåÒé┤Òâ¬Òâ╝",
    "footer.col2Title": "ÒüèÕ¢╣þ½ïÒüíÒâ¬Òâ│Òé»",
    "footer.linkConditions": "Òâ¼Òâ│Òé┐Òâ½Õê®þö¿ÞªÅþ┤ä",
    "footer.linkFaq": "ÒéêÒüÅÒüéÒéïÞ│¬ÕòÅÒü¿ÒéÁÒâØÒâ╝Òâê",
    "footer.linkPartner": "µÄíþö¿µâàÕá▒ / ÒâæÒâ╝ÒâêÒâèÒâ╝",
    "footer.col3Title": "õ©╗Þªüµïáþé╣",
    "dynamic.cat": "Òé½ÒâåÒé┤Òâ¬Òâ╝",
    "dynamic.perDay": "/ µùÑ (õ┐ØÚÖ║Þ¥╝Òü┐)",
    "dynamic.book": "õ║êþ┤äÒüÖÒéï",
    "dynamic.noVehicles": "µØíõ╗ÂÒü½ÕÉêÒüåÞ╗èõ©íÒüîÞªïÒüñÒüïÒéèÒü¥ÒüøÒéô",
    "dynamic.tryChange": "µñ£þ┤óµØíõ╗ÂÒéäÒé½ÒâåÒé┤Òâ¬Òâ╝ÒéÆÕñëµø┤ÒüùÒüªÒüèÞ®ªÒüùÒüÅÒüáÒüòÒüäÒÇé",
    "lang.other": "ÒüØÒü«õ╗ûÒü«Þ¿ÇÞ¬×...",
    "lang.modalTitle": "Þ¿ÇÞ¬×ÒéÆÚü©µè×",
    "lang.modalSub": "ITERCARS Òâ×Òâ╝Òé▒ÒââÒâêÒâùÒâ¼ÒéñÒé╣Òü«Þí¿þñ║Þ¿ÇÞ¬×ÒéÆÒüèÚü©Òü│ÒüÅÒüáÒüòÒüäÒÇé",
    "toast.lang": "µùÑµ£¼Þ¬× ­ƒç»­ƒçÁ Òü½Þ¿¡Õ«ÜÒüùÒü¥ÒüùÒüƒ",
    "toast.bookingSuccess": "Ô£¿ {car} Òü«õ║êþ┤äÒâ¬Òé»Òé¿Òé╣ÒâêÒüîµ¡úÕ©©Òü½ÚÇüõ┐íÒüòÒéîÒü¥ÒüùÒüƒ´╝üÒé│Òâ│ÒéÀÒéºÒâ½Òé©ÒâÑÒéêÒéèÚûôÒééÒü¬ÒüÅÒüöÚÇúþÁíÒüäÒüƒÒüùÒü¥ÒüÖÒÇé"
  },
  pt: {
    "nav.home": "In├¡cio",
    "nav.fleet": "Luxury Car",
    "nav.why": "Por Que N├│s",
    "nav.vip": "Servi├ºos VIP",
    "nav.contacts": "Contato",
    "nav.area": "├ürea VIP",
    "hero.badge": '<i class="ri-vip-crown-fill"></i> #1 MARKETPLACE DE ALUGUEL DE CARROS PREMIUM',
    "hero.title": 'Conduzir a Excel├¬ncia <br><span class="text-gradient">N├úo Tem Limites.</span>',
    "hero.subtitle": "Escolha entre os supercarros e sedans mais exclusivos do planeta. Entrega personalizada onde voc├¬ estiver, seguro total e uma experi├¬ncia inesquec├¡vel.",
    "hero.btnDiscover": "Descobrir Frota",
    "hero.btnQuote": "Or├ºamento Instant├óneo",
    "hero.stat1": "Supercarros Exclusivos",
    "hero.stat2": "Concierge Dedicado",
    "hero.stat3": "Modelo Garantido",
    "vip.title": "Garantia VIP Seguro Total",
    "vip.subtitle": "100% de Cobertura Inclu├¡da",
    "vip.desc": "Cada aluguel inclui assist├¬ncia 24/7 com helic├│ptero ou supercarro substituto em 60 minutos em toda a Europa.",
    "vip.check1": "Entrega em Villa",
    "vip.check2": "Franquia Zero",
    "search.location": "Local de Retirada",
    "search.locAny": "Qualquer Cidade / Aeroporto",
    "search.dateFrom": "Data Retirada",
    "search.dateTo": "Data Devolu├º├úo",
    "search.category": "Categoria",
    "search.catAll": "Todas as Categorias",
    "search.btn": "Buscar Carros",
    "fleet.tag": "Luxury Car",
    "fleet.title": 'Ve├¡culos Selecionados para <span class="text-gradient">Emo├º├Áes Puras</span>',
    "fleet.subtitle": "Escolha o modelo perfeito para sua pr├│xima viagem de neg├│cios, fim de semana exclusivo ou evento especial.",
    "filter.all": "Todos os Modelos",
    "why.tag": "Nossas Vantagens",
    "why.title": 'Por Que Escolher a <span class="text-gold">ITERCARS</span>',
    "why.subtitle": "Redefinimos o aluguel de carros combinando uma frota pr├│pria de excel├¬ncia com hospitalidade 5 estrelas.",
    "why.box1Title": "Entrega em Qualquer Lugar",
    "why.box1Desc": "Entregamos o ve├¡culo diretamente em seu hotel, villa privada ou terminal de jato privado com nossa equipe.",
    "why.box2Title": "Seguro VIP Total",
    "why.box2Desc": "Viaje com total tranquilidade com franquia zero e cobertura completa em todos os nossos ve├¡culos.",
    "why.box3Title": "Concierge 24/7",
    "why.box3Desc": "Assist├¬ncia dedicada dia e noite. Reservas em restaurantes, itiner├írios sob medida e suporte t├®cnico imediato.",
    "why.box4Title": "Modelo Garantido",
    "why.box4Desc": "Sem surpresas: voc├¬ receber├í exatamente a marca, modelo e motoriza├º├úo especificados ao reservar.",
    "modal.name": "Nome Completo *",
    "modal.phone": "Telefone / WhatsApp *",
    "modal.email": "E-mail *",
    "modal.days": "Dias de Aluguel",
    "modal.extras": "Servi├ºos Adicionais",
    "modal.extra0": "Entrega Padr├úo (Inclu├¡da)",
    "modal.extra150": "Entrega Villa / Aeroporto (+Ôé¼150)",
    "modal.extra300": "Motorista Privado meia di├íria (+Ôé¼300)",
    "modal.estimate": "Estimativa Total do Or├ºamento:",
    "modal.kaskoInc": "Seguro Inclu├¡do",
    "modal.btnConfirm": "Confirmar Solicita├º├úo",
    "footer.desc": "O marketplace de refer├¬ncia para o aluguel de carros de luxo, esportivos e exclusivos na It├ília e Europa. Movido pela paix├úo e design.",
    "footer.col1Title": "Categorias Frota",
    "footer.col2Title": "Links ├Üteis",
    "footer.linkConditions": "Condi├º├Áes de Aluguel",
    "footer.linkFaq": "FAQ & Suporte",
    "footer.linkPartner": "Trabalhe conosco / Parceiros",
    "footer.col3Title": "Sedes Principais",
    "dynamic.cat": "Categoria",
    "dynamic.perDay": "/ dia (Seguro inc.)",
    "dynamic.book": "Reservar",
    "dynamic.noVehicles": "Nenhum ve├¡culo encontrado",
    "dynamic.tryChange": "Tente alterar os filtros de busca ou categoria.",
    "lang.other": "Outras idiomas...",
    "lang.modalTitle": "Selecionar Idioma",
    "lang.modalSub": "Escolha o idioma de exibi├º├úo preferido para o marketplace ITERCARS.",
    "toast.lang": "Idioma configurado para Portugu├¬s ­ƒçÁ­ƒç╣",
    "toast.bookingSuccess": "Ô£¿ Solicita├º├úo enviada com sucesso para {car}! Um concierge entrar├í em contato em breve."
  }
};

let currentLang = localStorage.getItem('itercars_lang') || localStorage.getItem('luxdrive_lang') || 'it';

// Gestione Menu a tendina e Modale Lingue
function toggleLangMenu(event) {
  event.stopPropagation();
  const menu = document.getElementById('langDropdownMenu');
  if (menu) menu.classList.toggle('active');
}

window.addEventListener('click', () => {
  const menu = document.getElementById('langDropdownMenu');
  if (menu) menu.classList.remove('active');
});

function openOtherLangsModal() {
  const menu = document.getElementById('langDropdownMenu');
  if (menu) menu.classList.remove('active');
  const modal = document.getElementById('otherLangsModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = "hidden";
  }
}

function closeOtherLangsModal() {
  const modal = document.getElementById('otherLangsModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = "auto";
  }
}

function selectLang(lang) {
  closeOtherLangsModal();
  changeLanguage(lang);
}

// Funzione Cambio Lingua
function changeLanguage(lang, silent = false) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('itercars_lang', lang);

  // Aggiorna bandiera e codice sul pulsante del menu
  const flagEl = document.getElementById('currentLangFlag');
  const codeEl = document.getElementById('currentLangCode');
  if (flagEl) flagEl.innerText = langFlags[lang] || "­ƒç«­ƒç╣";
  if (codeEl) codeEl.innerText = lang.toUpperCase();

  // Se ├¿ arabo, imposta la direzione RTL (Right-to-Left) per un effetto WOW autentico
  if (lang === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
    document.body.style.textAlign = 'right';
  } else {
    document.documentElement.removeAttribute('dir');
    document.body.style.textAlign = 'left';
  }

  // Traduce elementi statici
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });

  // Re-render flotta con i testi dinamici tradotti
  const activeBtn = document.querySelector(".pill-btn.active");
  let filterCat = "tutti";
  if (activeBtn) {
    const text = activeBtn.innerText;
    if (text.includes("Supercar")) filterCat = "Supercar";
    else if (text.includes("SUV")) filterCat = "SUV";
    else if (text.includes("Sportiv") || text.includes("Sport")) filterCat = "Sportiva";
    else if (text.includes("Elettr") || text.includes("Electr")) filterCat = "Elettrica";
  }
  
  if (window.location.pathname.includes('fleet')) {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category') || 'Tutti';
    filterFleetPage(category);
  } else if (filterCat === "tutti") {
    const container = document.getElementById("fleetContainer") || document.getElementById("fleetGrid");
    if (container) container.innerHTML = "";
  } else {
    filterFleet(filterCat, null); // Usa la nuova logica per mostrare
  }

  if (!silent) {
    showToast(translations[lang]["toast.lang"] || `Lingua cambiata in ${lang.toUpperCase()} ${langFlags[lang] || ''}`);
  }
}

let fleetData = [];


// Registry of Fleet Providers (Fornitori)
const providersData = {
  "provider_1": {
    name: "Stefano",
    phone: "+393206144070",
    website: "https://mfitalyluxuryrent.com/",
    db_uuid: "11111111-1111-1111-1111-111111111111"
  }
};
window.providersData = providersData;

// Automatically assign provider_1 as default for all current cars in fleetData
fleetData = fleetData.map(car => {
  if (!car.provider) {
    car.provider = "provider_1";
  }
  return car;
});

let currentSelectedCarPrice = 0;

document.addEventListener("DOMContentLoaded", () => {
  changeLanguage(currentLang, true);
  setupScrollListener();
  if (typeof initAuthListener === 'function') initAuthListener();
  // Sincronizzazione obbligatoria in tempo reale tra sito e database SQL Supabase
  if (typeof loadFleetFromSupabase === 'function') loadFleetFromSupabase();
  
});

async function loadFleetFromSupabase() {
  if (typeof supabase !== 'undefined' && supabase) {
    try {
      const params = new URLSearchParams(window.location.search);
      const cityFilter = params.get('city');

      let query = supabase
        .from('vehicles')
        .select('*')
        .eq('is_active', true)
        .eq('is_luxury', true);

      if (cityFilter) {
        query = query.ilike('city', `%${cityFilter}%`);
      }

      const { data, error } = await query;

      if (!error && data && data.length > 0) {
        console.log("Ô£à Caricata flotta in tempo reale da Supabase DB:", data.length, "veicoli");
        const mappedCars = data.map(v => {
          let specsObj = {};
          if (typeof v.specs === 'string') {
            try { specsObj = JSON.parse(v.specs); } catch(e){}
          } else if (v.specs) {
            specsObj = v.specs;
          }
          const fullName = v.name || (v.brand ? `${v.brand} ${v.model}` : 'Veicolo Itercars');
          return {
            id: v.id,
            db_id: v.id,
            name: fullName,
            brand: v.brand || '',
            model: v.model || '',
            trim: v.trim || '',
            category: v.category || 'SUV Luxury',
            price: Number(v.daily_price) || 0,
            rating: String(v.rating || "5.0"),
            specs: {
              speed: specsObj.speed || '250 km/h',
              accel: specsObj.accel || '4.5s',
              hp: specsObj.hp || '400 CV'
            },
            image: v.image_url || 'category-suv.jpg',
            badge: v.badge || (v.fuel_type ? `${v.fuel_type} - ${v.transmission || 'Auto'}` : 'Esclusiva Ô£¿'),
            provider: v.provider_id || "provider_1",
            raw: v
          };
        });

        if (mappedCars.length > 0) {
          // I prezzi e le vetture sul sito DEVONO essere al 100% quelli del database (nessun mescolamento con mock offline o prezzi 0)
          fleetData = mappedCars;
          try { localStorage.setItem('itercars_fleet_cache', JSON.stringify(fleetData)); } catch(e){}
        } else {
          fleetData = []; // Azzera la flotta se il db ├¿ vuoto
          try { localStorage.removeItem('itercars_fleet_cache'); } catch(e){}
        }
      } else {
          fleetData = []; // Azzera la flotta se la query ritorna vuoto
          try { localStorage.removeItem('itercars_fleet_cache'); } catch(e){}
      }
    } catch (err) {
      console.warn("ÔÜá´©Å Query Supabase fallita o offline. Utilizzo catalogo locale di fallback.");
    }
  }

  try { localStorage.setItem('itercars_fleet_cache', JSON.stringify(fleetData)); } catch(e){}

  // Forza il rendering della flotta basato sui dati configurati o dal DB
  const activeBtn = document.querySelector(".pill-btn.active");
  let filterCat = "tutti";
  if (activeBtn) {
    const text = activeBtn.innerText;
    if (text.includes("Supercar")) filterCat = "Supercar";
    else if (text.includes("SUV")) filterCat = "SUV";
    else if (text.includes("Sportiv") || text.includes("Sport")) filterCat = "Sportiva";
    else if (text.includes("Elettr") || text.includes("Electr")) filterCat = "Elettrica";
  }
  
  if (window.location.pathname.includes('fleet')) {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category') || 'Tutti';
    filterFleetPage(category);
  } else if (filterCat === "tutti") {
    const container = document.getElementById("fleetContainer") || document.getElementById("fleetGrid");
    if (container) container.innerHTML = "";
  } else {
    filterFleet(filterCat, null);
  }
}

// Render della flotta auto
function renderFleet(cars) {
  const container = document.getElementById("fleetContainer") || document.getElementById("fleetGrid");
  if (!container) return;

  const dict = translations[currentLang] || translations.it;

  if (cars.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; background: rgba(255,255,255,0.02); border-radius: 20px;">
        <i class="ri-car-washing-line" style="font-size: 3rem; color: var(--text-muted);"></i>
        <h3 style="margin-top: 16px;">${dict["dynamic.noVehicles"]}</h3>
        <p style="color: var(--text-muted);">${dict["dynamic.tryChange"]}</p>
      </div>
    `;
    return;
  }

  // Group cars by category
  const categories = ["Supercar", "SUV Luxury", "Sportiva", "Cabriolet", "Berline e Sportive", "Luxury"];
  let html = "";

  categories.forEach(cat => {
    const catCars = cars.filter(car => {
      if (cat === "Berline e Sportive") return car.category === "Berline e Sportive" || car.category === "Berline" || (car.category === "Sportiva" && !cars.some(c => c.category === "Sportiva" && categories.indexOf("Sportiva") < categories.indexOf("Berline e Sportive")));
      return car.category === cat;
    });
    if (catCars.length > 0) {
      html += `
        <div class="fleet-category-section">
          <h2 class="fleet-category-title">${cat}</h2>
          <div class="fleet-grid">
            ${catCars.map(car => renderCarCard(car, dict)).join('')}
          </div>
        </div>
      `;
    }
  });

  // Handle any cars that don't fall into the 4 main categories just in case
  const otherCars = cars.filter(car => !categories.includes(car.category));
  if (otherCars.length > 0) {
    html += `
      <div class="fleet-category-section">
        <h2 class="fleet-category-title">Altri Veicoli</h2>
        <div class="fleet-grid">
          ${otherCars.map(car => renderCarCard(car, dict)).join('')}
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
  
  // Se stiamo riutilizzando lo stesso ID vecchio, cambiamo classe per sicurezza
  if (container.id === "fleetGrid") {
    container.style.display = "block"; // override CSS grid
  }
}

function renderCarCard(car, dict) {
  // Se ├¿ Noleggio a Breve Termine, usa la vera card NBT
  if (car.is_nbt && car.raw) {
    const offer = car.raw;
    let variants = [];
    if (typeof offer.variants === 'string') {
      try { variants = JSON.parse(offer.variants); } catch(e){}
    } else if (offer.variants) {
      variants = offer.variants;
    }
    
    // Trova il prezzo minimo e relativo anticipo
    let minPrice = offer.daily_price || 0;
    let minDeposit = offer.deposit || 0;
    if (variants && variants.length > 0) {
      let lowest = variants[0];
      variants.forEach(v => {
        if (v.price < lowest.price) lowest = v;
      });
      minPrice = lowest.price;
      minDeposit = lowest.deposit !== undefined ? lowest.deposit : minDeposit;
    }

    let badgeText = `<span class="card-badge badge-ready" style="font-size:0.7rem; padding:3px 8px; border-radius:4px; background:rgba(16, 185, 129, 0.15); color:#10b981; border:1px solid rgba(16, 185, 129, 0.3); position:absolute; top:10px; left:10px; z-index:2;"><i class="ri-rocket-fill"></i> Pronta Consegna</span>`;
    
    const depositZeroTag = (variants && variants.some(v => v.deposit === 0))
      ? `<span class="card-badge badge-zero" style="font-size:0.7rem; padding:3px 8px; border-radius:4px; background:rgba(212, 175, 55, 0.15); color:var(--accent-gold); border:1px solid rgba(212, 175, 55, 0.3); position:absolute; top:35px; left:10px; z-index:2;"><i class="ri-flashlight-fill"></i> Anticipo Zero Disponibile</span>` : '';

    return `
      <div class="glass-card nbt-card" style="display:flex; flex-direction:column; overflow:hidden; transition:transform 0.3s ease; height:100%;">
        <div class="nbt-card-img-wrapper" style="position:relative; width:100%; height:200px;">
          <img src="${offer.image_url || 'category-suv.jpg'}" alt="${offer.brand} ${offer.model}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='category-suv.jpg'">
          ${badgeText}
          ${depositZeroTag}
        </div>
        <div class="nbt-card-content" style="padding:20px; display:flex; flex-direction:column; flex:1;">
          <h3 style="margin:0 0 4px 0; font-size:1.2rem; color:#fff;">${offer.brand || ''} ${offer.model || offer.name || ''}</h3>
          <p style="margin:0 0 16px 0; font-size:0.9rem; color:var(--text-muted);">${offer.trim || ''}</p>
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px; margin-bottom:20px; font-size:0.8rem; color:var(--text-muted); text-align:center;">
            <div style="background:rgba(255,255,255,0.05); padding:8px 4px; border-radius:6px;"><i class="ri-gas-station-line" style="display:block; margin-bottom:4px; font-size:1.1rem;"></i> ${offer.fuel_type || 'Diesel'}</div>
            <div style="background:rgba(255,255,255,0.05); padding:8px 4px; border-radius:6px;"><i class="ri-steering-2-line" style="display:block; margin-bottom:4px; font-size:1.1rem;"></i> ${offer.transmission || 'Auto'}</div>
            <div style="background:rgba(255,255,255,0.05); padding:8px 4px; border-radius:6px;"><i class="ri-car-line" style="display:block; margin-bottom:4px; font-size:1.1rem;"></i> ${offer.category || 'SUV'}</div>
          </div>
          <div style="margin-top:auto; display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:16px;">
            <div>
              <div style="font-size:1.5rem; font-weight:700; color:#fff;">
                <span style="font-size:1rem; color:var(--text-muted);">Ôé¼</span>${minPrice}
                <span style="font-size:0.8rem; color:var(--text-muted); font-weight:400;">/giorno</span>
              </div>
              <div style="font-size:0.8rem; color:var(--text-muted); margin-top:4px;">
                ${minDeposit > 0 ? `Anticipo: Ôé¼${minDeposit}` : `<span style="color:var(--accent-gold);font-weight:600;"><i class="ri-flashlight-fill"></i> Anticipo Zero</span>`}
              </div>
            </div>
          </div>
          <a href="nbt-dettaglio.html?id=${offer.id}" class="btn btn-primary" style="width:100%; text-align:center; padding:12px; font-weight:600;">
            Personalizza e Prenota
          </a>
        </div>
      </div>
    `;
  }
  
  // Se ├¿ Noleggio a Lungo Termine, forziamo l'uso della card NLT (Image 1)
  if (car.is_nlt && car.raw && typeof window.generateNltCardHTML === 'function') {
    let nltOffer = null;
    
    // 1. Cerchiamo se c'├¿ un'offerta reale associata nel DB (caricata tramite la query heroSearch)
    if (car.raw.nlt_offers && car.raw.nlt_offers.length > 0) {
      const dbOffer = car.raw.nlt_offers.find(o => o.is_active !== false) || car.raw.nlt_offers[0];
      
      const v = car.raw;
      const specsObj = typeof v.specs === 'string' ? JSON.parse(v.specs || '{}') : (v.specs || {});
      
      let db36 = null;
      if (dbOffer['36_mesi_prezzo']) {
        let clean = String(dbOffer['36_mesi_prezzo']).replace(/[^0-9,.]/g, '').replace(',', '.');
        if (!isNaN(parseFloat(clean))) db36 = parseFloat(clean);
      }
      
      let monthlyP = db36 || ((dbOffer.client_monthly_price !== undefined && dbOffer.client_monthly_price !== null) ? Number(dbOffer.client_monthly_price) : 699);
      let depositP = (v.deposit !== undefined && v.deposit !== null) ? Number(v.deposit) : ((dbOffer.deposit_mandante !== undefined && dbOffer.deposit_mandante !== null) ? Number(dbOffer.deposit_mandante) : 3000);
      
      nltOffer = {
        id: dbOffer.id,
        vehicle_id: v.id,
        brand: v.brand || 'Veicolo',
        model: v.model || 'NLT',
        trim: v.trim || '',
        category: v.category || 'SUV Luxury',
        fuel: v.motore || v.fuel_type || 'Ibrido / Diesel',
        transmission: v.transmission || 'Automatico',
        image: car.image,
        hp: specsObj.hp || '300 CV',
        speed: specsObj.speed || '240 km/h',
        accel: specsObj.accel || '5.5s',
        readyDelivery: v.is_ready_delivery !== false,
        deliveryWeeks: v.delivery_weeks || 4,
        providerName: v.providerName || 'Mandante NLT',
        basePrice: monthlyP,
        baseDeposit: depositP,
        variants: [
          { duration: 36, deposit: depositP, price: Math.round(monthlyP * 1.06) },
          { duration: 36, deposit: 0, price: Math.round(monthlyP * 1.06 + (depositP / 36)) },
          { duration: 48, deposit: depositP, price: monthlyP },
          { duration: 48, deposit: 0, price: Math.round(monthlyP + (depositP / 48)) }
        ],
        services: ['Assicurazione RCA & Kasko completa', 'Manutenzione Ordinaria e Straordinaria', 'Bollo e Messa su strada', 'Soccorso stradale H24 europea', 'Gestione sinistri e pneumatici']
      };
    }
    
    // 2. Se non c'├¿ un'offerta nel DB, o la query non l'ha presa, creiamo un fallback perfetto che rispetti il VERO prezzo (daily_price o client_monthly_price)
    if (!nltOffer) {
      const v = car.raw;
      const specsObj = typeof v.specs === 'string' ? JSON.parse(v.specs || '{}') : (v.specs || {});
      
      // Calcoliamo il vero prezzo evitando monthly_price_36 che causava 1100Ôé¼
      let monthlyP = v.client_monthly_price ? Number(v.client_monthly_price) : (specsObj.monthly_price ? Number(specsObj.monthly_price) : (Number(car.price) || 699));
      let depositP = (v.deposit !== undefined && v.deposit !== null) ? Number(v.deposit) : 3000;
      
      nltOffer = {
        id: v.id,
        vehicle_id: v.id,
        brand: v.brand || 'Veicolo',
        model: v.model || 'NLT',
        trim: v.trim || '',
        category: v.category || 'SUV Luxury',
        fuel: v.motore || v.fuel_type || 'Ibrido / Diesel',
        transmission: v.transmission || 'Automatico',
        image: car.image,
        hp: specsObj.hp || '300 CV',
        speed: specsObj.speed || '240 km/h',
        accel: specsObj.accel || '5.5s',
        readyDelivery: v.is_ready_delivery !== false,
        deliveryWeeks: v.delivery_weeks || 4,
        providerName: v.providerName || 'Mandante NLT',
        basePrice: monthlyP,
        baseDeposit: depositP,
        variants: [
          { duration: 36, deposit: depositP, price: Math.round(monthlyP * 1.06) },
          { duration: 36, deposit: 0, price: Math.round(monthlyP * 1.06 + (depositP / 36)) },
          { duration: 48, deposit: depositP, price: monthlyP },
          { duration: 48, deposit: 0, price: Math.round(monthlyP + (depositP / 48)) }
        ],
        services: ['Assicurazione RCA & Kasko completa', 'Manutenzione Ordinaria e Straordinaria', 'Bollo e Messa su strada', 'Soccorso stradale H24 europea', 'Gestione sinistri e pneumatici']
      };
    }
    
    return window.generateNltCardHTML(nltOffer);
  }

  // Altrimenti, usa la card standard Luxury
  const cleanBadge = (car.badge || '').replace(/[\u1F600-\u1F64F\u1F300-\u1F5FF\u1F680-\u1F6FF\u1F1E6-\u1F1FF]/g, '').trim();
  let targetLink = `car-detail.html?v=4&car=${encodeURIComponent(car.name)}&id=${encodeURIComponent(car.id || car.db_id || '')}&cat=${encodeURIComponent(car.category || '')}&price=${car.price || 0}&img=${encodeURIComponent(car.image || '')}`;
  let priceText = car.price === 0 ? "Su Richiesta" : "Ôé¼ " + car.price;
  let periodText = car.price === 0 ? "" : (dict && dict["dynamic.perDay"] ? dict["dynamic.perDay"] : "/ Giorno");

  return `
    <div class="glass-card car-card">
      <a href="${targetLink}" style="display: block; position: relative;">
        <div class="car-image-container">
          <span class="car-badge">${cleanBadge}</span>
          <span class="car-rating"><i class="ri-star-fill"></i> ${car.rating}</span>
          <img src="${car.image}" alt="${car.name}" class="car-img" loading="lazy" onerror="this.onerror=null; this.src='logo_tricolore.png';">
        </div>
      </a>
      
      <div class="car-info">
        <h3 class="car-title">${car.name}</h3>
        <span class="car-type"><i class="ri-steering-2-line"></i> ${dict && dict["dynamic.cat"] ? dict["dynamic.cat"] : "Categoria"} ${car.category}</span>
        
        <div class="car-specs">
          <div class="spec-item">
            <i class="ri-speed-up-line"></i>
            <span>${car.specs.speed}</span>
          </div>
          <div class="spec-item">
            <i class="ri-timer-flash-line"></i>
            <span>${car.specs.accel}</span>
          </div>
          <div class="spec-item">
            <i class="ri-fire-line"></i>
            <span>${car.specs.hp}</span>
          </div>
        </div>
        
        <div class="car-footer">
          <div class="car-price">
            <span class="price-amount">${priceText}</span>
            <span class="price-period">${periodText}</span>
          </div>
          
          <a href="${targetLink}" class="btn btn-primary" style="padding: 10px 20px; text-decoration: none; display: flex; gap: 8px; align-items: center;">
            <span>${dict && dict["dynamic.book"] ? dict["dynamic.book"] : "Prenota Ora"}</span> <i class="ri-arrow-right-up-line"></i>
          </a>
        </div>
      </div>
    </div>`;
}
// Filtro Categorie (Pills)
function filterFleet(category, btnElement) {
  if (btnElement) {
    document.querySelectorAll(".pill-btn").forEach(btn => btn.classList.remove("active"));
    btnElement.classList.add("active");
  }

  if (category === "tutti") {
    const container = document.getElementById("fleetContainer") || document.getElementById("fleetGrid");
    if (container) container.innerHTML = "";
  } else {
    let filtered = [];
    if (category === "SUV") {
      filtered = fleetData.filter(car => car.category.includes("SUV"));
    } else if (category === "Sportiva") {
      filtered = fleetData.filter(car => car.category.includes("Sportiva"));
    } else if (category === "Cabrio") {
      filtered = fleetData.filter(car => car.category.includes("Cabriolet") || car.category.includes("Cabrio"));
    } else if (category === "Elettrica") {
      filtered = fleetData.filter(car => car.category.includes("Elettrica"));
    } else if (category === "Supercar") {
      filtered = fleetData.filter(car => car.category.includes("Supercar"));
    } else {
      filtered = fleetData.filter(car => car.category === category);
    }
    renderFleet(filtered);
    
    // Scroll alla griglia solo se siamo in home
    const grid = document.getElementById("fleetGrid");
    if (grid && !window.location.pathname.includes('fleet')) {
      grid.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
}

function filterFleetPage(category) {
  // Update URL without reloading
  const newUrl = window.location.pathname + (category !== 'Tutti' ? '?category=' + category : '');
  window.history.pushState({path:newUrl}, '', newUrl);

  // Update pills
  const pills = document.querySelectorAll('#fleetFilterPills .btn');
  if (pills.length > 0) {
    pills.forEach(btn => btn.classList.remove('active'));
    pills.forEach(btn => {
      if (btn.getAttribute('onclick').includes(category)) {
        btn.classList.add('active');
      }
    });
  }

  // Filter and render
  let filtered = [];
  if (category === "Tutti" || category === "tutti") {
    filtered = fleetData;
  } else if (category === "SUV") {
    filtered = fleetData.filter(car => car.category.includes("SUV"));
  } else if (category === "Sportiva") {
    filtered = fleetData.filter(car => car.category.includes("Sportiva") || car.category.includes("Berline"));
  } else if (category === "Cabrio") {
    filtered = fleetData.filter(car => car.category.includes("Cabriolet") || car.category.includes("Cabrio"));
  } else if (category === "Elettrica") {
    filtered = fleetData.filter(car => car.category.includes("Elettrica"));
  } else if (category === "Supercar") {
    filtered = fleetData.filter(car => car.category.includes("Supercar"));
  } else {
    filtered = fleetData.filter(car => car.category === category);
  }
  
  renderFleet(filtered);
}

// Ricerca dalla barra di ricerca
function handleSearch(event) {
  event.preventDefault();
  const location = document.getElementById("searchLocation").value;
  const category = document.getElementById("searchCategory").value;

  let filtered = fleetData;

  if (category && category !== "tutti") {
    filtered = filtered.filter(car => car.category === category);
  }

  renderFleet(filtered);
  
  // Scroll automatico alla flotta
  document.getElementById("flotta").scrollIntoView({ behavior: "smooth" });
  
  showToast(`Trovati ${filtered.length} veicoli`);
}

// Gestione Modale Prenotazione
function openModal(carName, price) {
  const modal = document.getElementById("bookingModal");
  const title = document.getElementById("modalTitle");
  const carInput = document.getElementById("modalCarName");
  const priceInput = document.getElementById("modalCarPrice");
  const carSelectionGroup = document.getElementById("carSelectionGroup");
  const carSelect = document.getElementById("modalCarSelect");

  if (carName.includes("Richiesta") || carName.includes("Consulenza")) {
    title.innerText = carName;
    if (carSelectionGroup) carSelectionGroup.style.display = "block";
    carInput.value = "Tutte le Auto";
    priceInput.value = 0;
    currentSelectedCarPrice = 0;

    if (carSelect && carSelect.options.length <= 1) {
      fleetData.forEach(car => {
        let opt = document.createElement("option");
        opt.value = car.name;
        opt.text = car.name;
        opt.dataset.price = car.price;
        carSelect.appendChild(opt);
      });
    }
    if (carSelect) carSelect.value = "Tutte le Auto";
  } else {
    if (carSelectionGroup) carSelectionGroup.style.display = "none";
    title.innerText = `Prenota: ${carName}`;
    carInput.value = carName;
    priceInput.value = price;
    currentSelectedCarPrice = price;
  }

  updatePriceCalculation();

  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

window.updateModalCarSelection = function() {
  const select = document.getElementById("modalCarSelect");
  if (!select) return;
  const selectedOption = select.options[select.selectedIndex];
  const carInput = document.getElementById("modalCarName");
  const priceInput = document.getElementById("modalCarPrice");
  
  if (select.value === "Tutte le Auto") {
    carInput.value = "Tutte le Auto";
    priceInput.value = 0;
    currentSelectedCarPrice = 0;
  } else {
    carInput.value = select.value;
    const p = parseFloat(selectedOption.dataset.price) || 0;
    priceInput.value = p;
    currentSelectedCarPrice = p;
  }
  updatePriceCalculation();
}

function closeModal() {
  const modal = document.getElementById("bookingModal");
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
}

function updatePriceCalculation() {
  const days = parseInt(document.getElementById("rentalDays").value) || 1;
  const extra = parseInt(document.getElementById("extraService").value) || 0;
  const totalDisplay = document.getElementById("totalPriceDisplay");

  let total = (currentSelectedCarPrice * days) + extra;
  if (currentSelectedCarPrice === 0) {
    totalDisplay.innerText = "Su Preventivo";
  } else {
    totalDisplay.innerText = `Ôé¼ ${total.toLocaleString('it-IT')}`;
  }
}

async function submitBooking(event) {
  event.preventDefault();
  const carName = document.getElementById("modalCarName").value;
  const carPrice = Number(document.getElementById("modalCarPrice").value) || 0;
  const days = parseInt(document.getElementById("rentalDays").value) || 1;
  const extraPrice = parseInt(document.getElementById("extraService").value) || 0;
  
  const clientName = document.getElementById("clientNameInput") ? document.getElementById("clientNameInput").value : "Anonimo";
  const clientPhone = document.getElementById("clientPhoneInput") ? document.getElementById("clientPhoneInput").value : "N/D";
  const clientEmail = document.getElementById("clientEmailInput") ? document.getElementById("clientEmailInput").value : "N/D";

  // Cache user data locally
  cacheUserData(clientName, clientEmail, clientPhone);

  const total = (carPrice * days) + extraPrice;
  const dict = translations[currentLang] || translations.it;

  // Cerca se l'auto selezionata corrisponde a una nel database
  let vehicleId = null;
  const foundCar = fleetData.find(c => c.name === carName);
  if (foundCar && typeof foundCar.id === 'string' && foundCar.id.length > 10) {
    vehicleId = foundCar.id;
  }

  // Risolvi il fornitore dell'auto
  const providerKey = foundCar && foundCar.provider ? foundCar.provider : "provider_1";
  const providerInfo = (typeof providersData !== 'undefined' ? providersData[providerKey] : null) || {
    name: "Stefano",
    phone: "+393206144070",
    website: "https://mfitalyluxuryrent.com/"
  };

  // Salva la prenotazione su Supabase Database
  if (supabase) {
    try {
      const locInput = document.getElementById("searchLocation");
      const chosenLoc = locInput && locInput.value ? locInput.value : "Milano Centrale";
      const userCountry = currentUser && currentUser.user_metadata ? currentUser.user_metadata.country : "Italia";

      const { error } = await supabase.from('bookings').insert([{
        user_id: currentUser ? currentUser.id : null,
        vehicle_id: vehicleId,
        vehicle_name: carName,
        client_name: clientName,
        client_phone: clientPhone,
        client_email: clientEmail,
        pickup_location: chosenLoc,
        rental_country: userCountry || "Italia",
        rental_days: days,
        extra_services: JSON.stringify([{ name: "Servizio Aggiuntivo", price: extraPrice }]),
        total_price: total,
        status: 'pending'
      }]);
      if (error) console.error("Errore salvataggio prenotazione su Supabase:", error);
      else console.log("Ô£à Prenotazione salvata con successo su Supabase!");
    } catch (err) {
      console.error("Errore connessione Supabase:", err);
    }
  }

  // Invia notifica email al gestore con i dettagli e il fornitore di flotta
  const recipient = "info@itercars.com";
  const payload = {
    _subject: `­ƒÜÖ Nuova Richiesta Noleggio (Da Modal) ÔÇö ${carName}`,
    _template: "table",
    _captcha: "false",
    "Veicolo Richiesto": carName,
    "Giorni di Noleggio": days,
    "Servizi Aggiuntivi": extraPrice > 0 ? `Selezionato (+Ôé¼${extraPrice})` : "Nessuno",
    "Stima Preventivo": `Ôé¼ ${total}`,
    "Nome Cliente": clientName,
    "Telefono Cliente": clientPhone,
    "Email Cliente": clientEmail,
    "Fornitore Flotta": `${providerInfo.name} (${providerInfo.phone}) ÔÇö ${providerInfo.website}`
  };

  try {
    await fetch(`https://formsubmit.co/ajax/${recipient}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.warn("Errore invio email FormSubmit:", err);
  }

  closeModal();
  let msg = dict["toast.bookingSuccess"].replace("{car}", carName);
  showToast(msg);
}

// Effetto Scroll Header
function setupScrollListener() {
  const header = document.getElementById("header");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

// Visualizzazione Toast Notifica
function showToast(message) {
  let toast = document.createElement("div");
  toast.style.position = "fixed";
  toast.style.bottom = "30px";
  toast.style.right = "30px";
  toast.style.background = "var(--accent-gradient)";
  toast.style.color = "#ffffff";
  toast.style.padding = "16px 24px";
  toast.style.borderRadius = "12px";
  toast.style.boxShadow = "0 10px 30px rgba(16, 185, 129, 0.4)";
  toast.style.zIndex = "3000";
  toast.style.fontWeight = "600";
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.gap = "10px";
  toast.style.animation = "fadeInUp 0.3s ease";
  toast.innerHTML = `<i class="ri-checkbox-circle-fill" style="font-size: 1.4rem;"></i> <span>${message}</span>`;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(10px)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   AUTHENTICATION & AREA RISERVATA LOGIC (Supabase Auth)
   ========================================================================== */
let currentUser = null;

async function initAuthListener() {
  if (!supabase) return;
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.user) {
      currentUser = session.user;
      updateNavAreaButton(currentUser);
    }
  } catch (err) {
    console.warn("Errore getSession Supabase:", err);
  }

  try {
    supabase.auth.onAuthStateChange((event, session) => {
      if (session && session.user) {
        currentUser = session.user;
        updateNavAreaButton(currentUser);
      } else {
        currentUser = null;
        resetNavAreaButton();
      }
    });
  } catch (err) {
    console.warn("Errore onAuthStateChange:", err);
  }
}

function updateNavAreaButton(user) {
  const navBtnText = document.getElementById("navAreaText");
  if (navBtnText) {
    const meta = user.user_metadata || {};
    const firstName = meta.first_name || '';
    const lastName = meta.last_name || '';
    let fullName = `${firstName} ${lastName}`.trim();
    if (!fullName) fullName = user.email.split('@')[0];
    navBtnText.innerText = `VIP: ${fullName}`;
  }
}

function resetNavAreaButton() {
  const navBtnText = document.getElementById("navAreaText");
  const dict = translations[currentLang] || translations.it;
  if (navBtnText) {
    navBtnText.innerText = dict["nav.area"] || "Area Riservata";
  }
}

function openAuthModal() {
  closeVipDashboardModal();
  if (currentUser) {
    openVipDashboardModal();
  } else {
    const modal = document.getElementById("authModal");
    if (modal) {
      switchAuthMode('login');
      modal.classList.add("active");
      document.body.style.overflow = "hidden";
    }
  }
}

function closeAuthModal() {
  const modal = document.getElementById("authModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

function switchAuthMode(mode) {
  const loginBox = document.getElementById("loginFormBox");
  const regBox = document.getElementById("registerFormBox");
  const partnerRegBox = document.getElementById("partnerRegFormBox");
  
  if (loginBox) loginBox.style.display = "none";
  if (regBox) regBox.style.display = "none";
  if (partnerRegBox) partnerRegBox.style.display = "none";

  if (mode === 'register') {
    if (regBox) regBox.style.display = "block";
  } else if (mode === 'partner_reg') {
    if (partnerRegBox) partnerRegBox.style.display = "block";
  } else {
    if (loginBox) loginBox.style.display = "block";
  }
}

async function handleLogin(event) {
  event.preventDefault();
  if (!supabase) {
    showToast("ÔÜá´©Å Connessione Supabase non attiva");
    return;
  }
  const email = document.getElementById("authLoginEmail").value;
  const password = document.getElementById("authLoginPassword").value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    showToast("ÔØî Errore Login: " + error.message);
  } else {
    showToast("Ô£¿ Accesso effettuato con successo!");
    closeAuthModal();
  }
}

async function handleRegister(event) {
  event.preventDefault();
  if (!supabase) {
    showToast("ÔÜá´©Å Connessione Supabase non attiva");
    return;
  }
  const firstName = document.getElementById("regFirstName").value;
  const lastName = document.getElementById("regLastName").value;
  const birthDate = document.getElementById("regBirthDate").value;
  const country = document.getElementById("regCountry").value;
  const email = document.getElementById("regEmail").value;
  const phone = document.getElementById("regPhone").value;
  const password = document.getElementById("regPassword").value;
  const confirmPassword = document.getElementById("regConfirmPassword").value;

  if (password !== confirmPassword) {
    showToast("ÔÜá´©Å Le due password non corrispondono!");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
        birth_date: birthDate,
        country: country,
        phone: phone
      }
    }
  });

  if (error) {
    showToast("ÔØî Errore Registrazione: " + error.message);
  } else {
    showToast("­ƒÄë Registrazione VIP completata! Benvenuto in ITERCARS.");
    closeAuthModal();
  }
}

async function openVipDashboardModal() {
  const modal = document.getElementById("vipDashboardModal");
  if (!modal || !currentUser) return;

  const meta = currentUser.user_metadata || {};
  const nameEl = document.getElementById("vipUserName");
  const emailEl = document.getElementById("vipUserEmail");
  
  if (nameEl) {
    const firstName = meta.first_name || '';
    const lastName = meta.last_name || '';
    let fullName = `${firstName} ${lastName}`.trim();
    if (!fullName) fullName = currentUser.email.split('@')[0];
    nameEl.innerText = `Benvenuto, ${fullName}`;
  }
  if (emailEl) emailEl.innerText = currentUser.email;

  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Carica storico noleggi e paesi visitati
  const container = document.getElementById("vipBookingsContainer");
  if (container) {
    container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 15px;">Caricamento storico in corso...</div>';
    
    let userBookings = [];
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .or(`client_email.eq.${currentUser.email},user_id.eq.${currentUser.id}`)
          .order('created_at', { ascending: false });
        if (!error && data) userBookings = data;
      } catch (e) {
        console.warn("Errore caricamento storico:", e);
      }
    }

    // Se l'utente ├¿ nuovo e non ha ancora noleggi nel DB, mostriamo storico VIP di esempio senza prezzi ed emoji
    if (userBookings.length === 0) {
      userBookings = [
        { vehicle_name: "Ferrari F8 Tributo", rental_country: "Italia", pickup_location: "Milano Centrale", rental_days: 3, status: "completed" },
        { vehicle_name: "Lamborghini Revuelto", rental_country: "Principato di Monaco", pickup_location: "Monte Carlo Casino", rental_days: 2, status: "completed" },
        { vehicle_name: "Rolls-Royce Cullinan", rental_country: "Svizzera", pickup_location: "Zurigo Aeroporto", rental_days: 4, status: "completed" }
      ];
    }

    let html = '';
    userBookings.forEach(b => {
      const country = b.rental_country || 'Italia';
      // Rimuoviamo eventuali emoji presenti nei dati salvati in precedenza
      const cleanCountry = country.replace(/[\u1F600-\u1F64F\u1F300-\u1F5FF\u1F680-\u1F6FF\u1F1E6-\u1F1FF]/g, '').trim();
      const loc = b.pickup_location || 'Sede Centrale';
      const badgeColor = b.status === 'completed' ? 'var(--accent-primary)' : '#f59e0b';
      const badgeText = b.status === 'completed' ? 'Completato' : 'In Lavorazione';

      html += `
        <div style="background: rgba(255,255,255,0.04); border: 1px solid var(--border-glass); border-radius: 12px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s ease;">
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <strong style="font-size: 1.05rem; color: var(--text-main); display: flex; align-items: center; gap: 8px;">
              <i class="ri-roadster-fill text-gold"></i> ${b.vehicle_name}
            </strong>
            <span style="font-size: 0.85rem; color: var(--text-muted);">
              <i class="ri-map-pin-line"></i> Paese: <strong style="color: #fff;">${cleanCountry}</strong> (${loc}) ÔÇó ${b.rental_days || 1} giorni
            </span>
          </div>
          <div style="text-align: right; display: flex; flex-direction: column; align-items: flex-end; gap: 4px;">
            <span style="font-size: 0.75rem; padding: 4px 10px; border-radius: 10px; background: rgba(16, 185, 129, 0.15); color: ${badgeColor}; border: 1px solid ${badgeColor}; font-weight: 600;">${badgeText}</span>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
  }
}

function closeVipDashboardModal() {
  const modal = document.getElementById("vipDashboardModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

async function handleLogout() {
  if (supabase) {
    try { await supabase.auth.signOut(); } catch(e) {}
  }
  currentUser = null;
  resetNavAreaButton();
  closeVipDashboardModal();
  showToast("­ƒæï Disconnessione effettuata");
}

// Rendiamo le funzioni globali sul window per garantire l'accesso dagli eventi onclick HTML
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthMode = switchAuthMode;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;

async function handlePartnerReg(event) {
  event.preventDefault();
  if (!supabase) {
    alert("Errore di connessione al database. Riprovare pi├╣ tardi.");
    return;
  }

  const companyName = document.getElementById('partRegCompany').value.trim();
  const vat = document.getElementById('partRegVat').value.trim();
  const contactName = document.getElementById('partRegName').value.trim();
  const phone = document.getElementById('partRegPhone').value.trim();
  const email = document.getElementById('partRegEmail').value.trim();
  const address = document.getElementById('partRegAddress').value.trim();
  const password = document.getElementById('partRegPassword').value;
  const passwordConfirm = document.getElementById('partRegPasswordConfirm').value;

  if (password !== passwordConfirm) {
    alert("Le password non coincidono.");
    return;
  }

  const submitBtn = event.target.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> <span>Invio in corso...</span>`;
    submitBtn.disabled = true;
  }

  try {
    // 1. Create Supabase Auth User
    const { data: authData, error: authErr } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          full_name: contactName,
          company: companyName,
          role: 'pending_partner'
        }
      }
    });

    if (authErr) throw authErr;

    const authId = authData.user ? authData.user.id : null;

    // 2. Insert into supplier_applications with auth_id
    const { error: dbErr } = await supabase.from('supplier_applications').insert([{
      auth_id: authId,
      company_name: companyName,
      partita_iva: vat,
      referent_name: contactName,
      email: email,
      phone: phone,
      fleet_size: 'Non specificato',
      city: address,
      models: 'Richiesta dal popup Area Riservata',
      status: 'new',
      data: new Date().toLocaleString('it-IT')
    }]);

    if (dbErr) throw dbErr;
    
    // Auto-logout the pending user so they don't access the VIP dashboard
    await supabase.auth.signOut();

    alert("Richiesta inviata con successo! Il team ti contatter├á al pi├╣ presto. Non potrai accedere fino ad approvazione avvenuta.");
    closeAuthModal();
    event.target.reset();
  } catch (error) {
    console.error("Errore invio candidatura partner:", error);
    alert("Si ├¿ verificato un errore durante l'invio della richiesta: " + (error.message || "Riprova pi├╣ tardi."));
  } finally {
    if (submitBtn) {
      submitBtn.innerHTML = `<span>Completa richiesta</span> <i class="ri-send-plane-fill"></i>`;
      submitBtn.disabled = false;
    }
  }
}
window.switchAuthMode = switchAuthMode;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;



// Added for Hero Search
window.handleHeroSearch = async function(event) {
  if (event) { event.preventDefault(); }
  const loc = document.getElementById('searchLocation') ? document.getElementById('searchLocation').value.trim() : '';
  const type = document.getElementById('searchType') ? document.getElementById('searchType').value : 'tutti';

  const chkLuxury = document.getElementById('filterLuxury') ? document.getElementById('filterLuxury').checked : false;
  const chkPiccola = document.getElementById('filterPiccola') ? document.getElementById('filterPiccola').checked : false;
  const chkMedia = document.getElementById('filterMedia') ? document.getElementById('filterMedia').checked : false;
  const chkGrande = document.getElementById('filterGrande') ? document.getElementById('filterGrande').checked : false;

  
  const resultsSection = document.getElementById("heroSearchResultsSection");
  const container = document.getElementById("heroSearchResultsGrid");
  const subtitle = document.getElementById("heroSearchResultsSubtitle");
  
  if (!container) return;
  
  // Rendi visibile la sezione risultati sotto la barra
  if (resultsSection) {
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
  }

  container.innerHTML = '<div style="text-align:center; padding: 40px; color: var(--text-muted); width: 100%;"><i class="ri-loader-4-line ri-spin" style="font-size: 2rem;"></i><p style="margin-top: 10px;">Ricerca veicoli in corso...</p></div>';

  if (!supabase) return;

  let query = supabase.from('vehicles').select('*, nlt_offers(*)').eq('is_active', true);
  
  if (type === 'nbt') query = query.eq('is_nbt', true);
  else if (type === 'nlt') query = query.eq('is_nlt', true);
  else if (type === 'luxury') query = query.eq('is_luxury', true);

  // Applica filtri categorie solo se almeno uno  selezionato (se necessario) 
  // Usa OR per le categorie selezionate? No, l'utente ha chiesto che "quando una macchina ha questa casella spuntata su true viene inserita in quella categoria". Se le spunta tutte, cerca le auto che hanno ALMENO una di queste spunte vere?
  // Oppure facciamo dei filtri precisi in AND? Solitamente nei filtri checkbox multipli per tipologia e' un OR.
  // Tuttavia, siccome supabase eq aggiunge sempre un AND, se selezioni Luxury AND Piccola cercher auto che sono SIA luxury SIA piccola.
  // Per fare OR in supabase: query = query.or('luxury.eq.true,macchina_piccola.eq.true...')
  // Ma se usiamo gli AND  pi restrittivo. Implementiamo OR che ha pi senso logico: "Voglio vedere le luxury e le piccole".
  // Let's implement OR filter if any is checked.
  
  let categoryOrFilters = [];
  if (chkLuxury) categoryOrFilters.push('luxury.eq.true');
  if (chkPiccola) categoryOrFilters.push('macchina_piccola.eq.true');
  if (chkMedia) categoryOrFilters.push('macchina_media.eq.true');
  if (chkGrande) categoryOrFilters.push('macchina_grande.eq.true');
  
  if (categoryOrFilters.length > 0) {
    query = query.or(categoryOrFilters.join(','));
  }


  if (loc) {
    query = query.ilike('city', `%${loc}%`);
  }

  const { data, error } = await query;
  
  container.innerHTML = '';
  
  if (error || !data || data.length === 0) {
    container.innerHTML = `<div style="text-align:center; padding: 40px; width: 100%;"><h3 style="color: var(--accent-primary);">Nessun Veicolo Trovato</h3><p style="color: var(--text-muted);">Non ci sono veicoli disponibili per la tua ricerca${loc ? ' a ' + loc : ''}. Prova a modificare i filtri.</p></div>`;
    if (subtitle) subtitle.textContent = "Nessun risultato trovato.";
    return;
  }

  if (subtitle) {
    subtitle.textContent = `Trovati ${data.length} veicoli corrispondenti alla tua ricerca.`;
  }

  const mappedCars = data.map(v => {
    let specsObj = {};
    if (typeof v.specs === 'string') {
      try { specsObj = JSON.parse(v.specs); } catch(e){}
    } else if (v.specs) {
      specsObj = v.specs;
    }
    const fullName = v.name || (v.brand ? `${v.brand} ${v.model}` : 'Veicolo Itercars');
    return {
      id: v.id,
      db_id: v.id,
      name: fullName,
      brand: v.brand || '',
      model: v.model || '',
      category: v.category || 'Luxury',
      price: v.daily_price || 0,
      rating: v.rating || '5.0',
      image: v.image_url || 'logo_tricolore.png',
      badge: v.badge || '',
      specs: {
        speed: specsObj.speed || "250 km/h",
        accel: specsObj.accel || "4.5s",
        hp: specsObj.hp || (v.fuel_type || "Ibrido")
      },
      is_nbt: !!v.is_nbt,
      is_nlt: !!v.is_nlt,
      is_luxury: !!v.is_luxury,
      raw: v
    };
  });

  mappedCars.forEach(car => {
    container.innerHTML += renderCarCard(car, translations[typeof currentLang !== 'undefined' ? currentLang : 'it'] || translations['it']);
  });
};

// --- MOBILE MENU TOGGLE ---
function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  const mobileMenuIcon = document.getElementById('mobileMenuIcon');
  if (navLinks) {
    navLinks.classList.toggle('mobile-open');
    if (mobileMenuIcon) {
      if (navLinks.classList.contains('mobile-open')) {
        mobileMenuIcon.classList.remove('ri-menu-line');
        mobileMenuIcon.classList.add('ri-close-line');
      } else {
        mobileMenuIcon.classList.remove('ri-close-line');
        mobileMenuIcon.classList.add('ri-menu-line');
      }
    }
  }
}
window.toggleMobileMenu = toggleMobileMenu;


// ==========================================
// DOSSIER RECOVERY MODAL LOGIC
// ==========================================
function openDossierRecoveryModal() {
  const modal = document.getElementById('dossierRecoveryModal');
  if (modal) {
    modal.classList.add('active');
  } else {
    console.error("Dossier Recovery Modal not found in DOM");
  }
}
window.openDossierRecoveryModal = openDossierRecoveryModal;

function closeDossierRecoveryModal() {
  const modal = document.getElementById('dossierRecoveryModal');
  if (modal) {
    modal.classList.remove('active');
  }
}
window.closeDossierRecoveryModal = closeDossierRecoveryModal;

async function handleDossierRecoverySubmit(e) {
  e.preventDefault();
  const code = document.getElementById('recoveryQuoteCodeInput')?.value.trim();
  const email = document.getElementById('recoveryEmailInput')?.value.trim();
  const errMsg = document.getElementById('recoveryErrorMsg');
  if (errMsg) errMsg.style.display = 'none';
  
  if (!code && !email) {
    if (errMsg) {
      errMsg.innerText = "Inserisci almeno il codice preventivo o l'email.";
      errMsg.style.display = 'block';
    }
    return;
  }
  
  const btn = e.target.querySelector('button[type="submit"]');
  if (btn) {
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Ricerca in corso...';
    btn.disabled = true;

    if (window.supabase) {
      try {
        let query = window.supabase.from('quotes').select('id, quote_code, vehicle_id, status').order('created_at', { ascending: false });
        if (code) {
          query = query.ilike('quote_code', `%${code}%`);
        } else if (email) {
          query = query.eq('client_email', email);
        }

        const { data, error } = await query.limit(1).maybeSingle();

        if (error || !data) {
          if (errMsg) {
            errMsg.innerText = "Pratica non trovata o scaduta. Assicurati che il codice o l'email siano corretti.";
            errMsg.style.display = 'block';
          }
        } else {
          // Salva in localStorage per comodit├á
          localStorage.setItem('itercars_last_quote_code', data.quote_code);
          
          // Reindirizza direttamente al caricamento documenti (Dossier)
          window.location.href = `upload-documenti.html?code=${data.quote_code}`;
        }
      } catch (err) {
        if (errMsg) {
          errMsg.innerText = "Errore di connessione. Riprova pi├╣ tardi.";
          errMsg.style.display = 'block';
        }
      }
    } else {
      if (errMsg) {
        errMsg.innerText = "Servizio temporaneamente non disponibile (DB disconnesso).";
        errMsg.style.display = 'block';
      }
    }

    btn.innerHTML = originalText;
    btn.disabled = false;
  }
}
window.handleDossierRecoverySubmit = handleDossierRecoverySubmit;


// Dropdown Area Riservata
window.toggleAreaMenu = function(event) {
  event.preventDefault();
  event.stopPropagation();
  const menu = document.getElementById('areaDropdownMenu');
  if (menu) {
    menu.style.display = (menu.style.display === 'flex' || menu.style.display === 'block') ? 'none' : 'flex';
  }
};

window.closeAreaMenu = function() {
  const menu = document.getElementById('areaDropdownMenu');
  if (menu) {
    menu.style.display = 'none';
  }
};

document.addEventListener('click', function(e) {
  const areaWrapper = e.target.closest('.area-dropdown-wrapper');
  if (!areaWrapper) {
    closeAreaMenu();
  }
});

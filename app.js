/* ==========================================================================
   LUXURY CAR RENTAL - LOGIC & INTERACTIVITY (AutoRent Replica + Multi-Flag i18n)
   ========================================================================== */

// CONFIGURAZIONE SUPABASE CLIENT (ITERCARS Hub Database)
const SUPABASE_URL = 'https://brqayhwdrvgllwwjnyvz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJycWF5aHdkcnZnbGx3d2pueXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3NDczMTgsImV4cCI6MjA5ODMyMzMxOH0.NZsHj4B_5ylWCcCXy5NKrkLWXNy-6GV4yg5Cv1keaWk';
var supabase = (typeof window.supabase !== 'undefined' && typeof window.supabase.createClient === 'function') ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : window.supabase;

const langFlags = {
  it: "🇮🇹",
  en: "🇬🇧",
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
  ru: "🇷🇺",
  zh: "🇨🇳",
  ar: "🇸🇦",
  ja: "🇯🇵",
  pt: "🇵🇹"
};

// DIZIONARIO DI TRADUZIONE MULTILINGUA
const translations = {
  it: {
    "nav.home": "Home",
    "nav.fleet": "La Flotta",
    "nav.why": "Perché Noi",
    "nav.vip": "Servizi VIP",
    "nav.contacts": "Contatti",
    "nav.area": "Area Riservata",
    "hero.badge": '<i class="ri-vip-crown-fill"></i> #1 MARKETPLACE DI NOLEGGIO AUTO PREMIUM',
    "hero.title": 'Guidare l\'Eccellenza <br><span class="text-gradient">Non ha Limiti.</span>',
    "hero.subtitle": "Scegli tra le supercar e le berline più esclusive del pianeta. Consegna personalizzata ovunque tu sia.",
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
    "search.locAny": "Qualsiasi Città / Aeroporto",
    "search.dateFrom": "Data Ritiro",
    "search.dateTo": "Data Riconsegna",
    "search.category": "Categoria Auto",
    "search.catAll": "Tutte le Categorie",
    "search.btn": "Consulta Disponibilità",
    "fleet.tag": "La Nostra Flotta",
    "fleet.title": 'Guidare l\'Eccellenza <br><span class="text-gradient">Non ha Limiti.</span>',
    "fleet.subtitle": "Scegli tra le supercar e le berline più esclusive del pianeta. Consegna personalizzata ovunque tu sia.",
    "filter.all": "Tutti i Modelli",
    "why.tag": "I Nostri Vantaggi",
    "why.title": 'Perché Scegliere <span class="text-gold">ITERCARS</span>',
    "why.subtitle": "Ridefiniamo il concetto di autonoleggio combinando flotta proprietaria di prim'ordine e accoglienza a 5 stelle.",
    "why.box1Title": "Consegna Ovunque",
    "why.box1Desc": "Consegniamo la vettura direttamente al tuo hotel, villa privata o terminal jet privato con il nostro staff.",
    "why.box2Title": "Copertura Totale VIP",
    "why.box2Desc": "Viaggia in assoluta serenità con franchigia zero e copertura assicurativa completa su tutti i nostri veicoli.",
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
    "modal.extra150": "Consegna in Villa / Aeroporto (+€150)",
    "modal.extra300": "Autista Privato mezza giornata (+€300)",
    "modal.estimate": "Stima Totale Preventivo:",
    "modal.kaskoInc": "Assicurazione Inclusa",
    "modal.btnConfirm": "Conferma Richiesta Prenotazione",
    "footer.desc": "Il marketplace di riferimento per il noleggio di auto di lusso, sportive ed esclusive in Italia e in Europa. Powered by passione e design.",
    "footer.col1Title": "Categorie Flotta",
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
    "toast.lang": "Lingua impostata su Italiano 🇮🇹",
    "toast.bookingSuccess": "✨ Richiesta inviata con successo per {car}! Un concierge ti contatterà a breve."
  },
  en: {
    "nav.home": "Home",
    "nav.fleet": "The Fleet",
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
    "fleet.tag": "Our Fleet",
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
    "modal.extra150": "Villa / Airport Delivery (+€150)",
    "modal.extra300": "Private Driver half day (+€300)",
    "modal.estimate": "Estimated Total Quote:",
    "modal.kaskoInc": "Insurance Included",
    "modal.btnConfirm": "Confirm Booking Request",
    "footer.desc": "The benchmark marketplace for renting luxury, sports, and exclusive cars in Italy and Europe. Powered by passion and design.",
    "footer.col1Title": "Fleet Categories",
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
    "toast.lang": "Language set to English 🇬🇧",
    "toast.bookingSuccess": "✨ Request successfully sent for {car}! A concierge will contact you shortly."
  },
  es: {
    "nav.home": "Inicio",
    "nav.fleet": "La Flota",
    "nav.why": "Por Qué Nosotros",
    "nav.vip": "Servicios VIP",
    "nav.contacts": "Contacto",
    "nav.area": "Área VIP",
    "hero.badge": '<i class="ri-vip-crown-fill"></i> #1 MARKETPLACE DE ALQUILER DE COCHES PREMIUM',
    "hero.title": 'Conducir la Excelencia <br><span class="text-gradient">No tiene Límites.</span>',
    "hero.subtitle": "Elige entre los superdeportivos y berlinas más exclusivos del planeta. Entrega personalizada donde estés, cobertura a todo riesgo y una experiencia inolvidable.",
    "hero.btnDiscover": "Descubrir Vehículos",
    "hero.btnQuote": "Calcular Presupuesto",
    "hero.stat1": "Superdeportivos Exclusivos",
    "hero.stat2": "Conserje Dedicado",
    "hero.stat3": "Modelo Garantizado",
    "vip.title": "Garantía VIP a Todo Riesgo",
    "vip.subtitle": "Cobertura 100% Incluida",
    "vip.desc": "Cada alquiler incluye asistencia en carretera 24/7 con helicóptero o superdeportivo de sustitución en 60 minutos en toda Europa.",
    "vip.check1": "Entrega en Villa",
    "vip.check2": "Sin Franquicia",
    "search.location": "Lugar de Recogida",
    "search.locAny": "Cualquier Ciudad / Aeropuerto",
    "search.dateFrom": "Fecha Recogida",
    "search.dateTo": "Fecha Devolución",
    "search.category": "Categoría",
    "search.catAll": "Todas las Categorías",
    "search.btn": "Buscar Coches",
    "fleet.tag": "Nuestra Flota",
    "fleet.title": 'Vehículos Seleccionados para <span class="text-gradient">Emociones Puras</span>',
    "fleet.subtitle": "Elige el modelo perfecto para tu próximo viaje de negocios, fin de semana exclusivo o evento especial.",
    "filter.all": "Todos los Modelos",
    "why.tag": "Nuestras Ventajas",
    "why.title": 'Por Qué Elegir <span class="text-gold">ITERCARS</span>',
    "why.subtitle": "Redefinimos el alquiler de coches combinando una flota propia de primer nivel con hospitalidad 5 estrellas.",
    "why.box1Title": "Entrega en Cualquier Lugar",
    "why.box1Desc": "Entregamos el vehículo directamente en tu hotel, villa privada o terminal de jet privado con nuestro personal.",
    "why.box2Title": "Seguro VIP a Todo Riesgo",
    "why.box2Desc": "Viaja con absoluta tranquilidad con franquicia cero y cobertura completa en todos nuestros vehículos.",
    "why.box3Title": "Conserje 24/7",
    "why.box3Desc": "Asistencia dedicada día y noche. Reservas en restaurantes, itinerarios a medida y soporte técnico inmediato.",
    "why.box4Title": "Modelo Garantizado",
    "why.box4Desc": "Sin sorpresas: recibirás exactamente la marca, el modelo y el motor especificados al reservar.",
    "modal.name": "Nombre Completo *",
    "modal.phone": "Teléfono / WhatsApp *",
    "modal.email": "Correo Electrónico *",
    "modal.days": "Días de Alquiler",
    "modal.extras": "Servicios Adicionales",
    "modal.extra0": "Entrega Estándar (Incluida)",
    "modal.extra150": "Entrega Villa / Aeropuerto (+€150)",
    "modal.extra300": "Chofer Privado medio día (+€300)",
    "modal.estimate": "Presupuesto Total Estimado:",
    "modal.kaskoInc": "Seguro Incluido",
    "modal.btnConfirm": "Confirmar Solicitud",
    "footer.desc": "El marketplace de referencia para el alquiler de coches de lujo, deportivos y exclusivos en Italia y Europa. Impulsado por pasión y diseño.",
    "footer.col1Title": "Categorías Flota",
    "footer.col2Title": "Enlaces Útiles",
    "footer.linkConditions": "Condiciones de Alquiler",
    "footer.linkFaq": "Preguntas Frecuentes",
    "footer.linkPartner": "Trabaja con nosotros / Socios",
    "footer.col3Title": "Sedes Principales",
    "dynamic.cat": "Categoría",
    "dynamic.perDay": "/ día (Seguro inc.)",
    "dynamic.book": "Reservar",
    "dynamic.noVehicles": "No se encontraron vehículos",
    "dynamic.tryChange": "Prueba a cambiar los filtros de búsqueda o categoría.",
    "lang.other": "Otras idiomas...",
    "lang.modalTitle": "Seleccionar Idioma",
    "lang.modalSub": "Elige el idioma de visualización para el marketplace ITERCARS.",
    "toast.lang": "Idioma configurado en Español 🇪🇸",
    "toast.bookingSuccess": "✨ ¡Solicitud enviada con éxito para {car}! Un conserje te contactará pronto."
  },
  fr: {
    "nav.home": "Accueil",
    "nav.fleet": "La Flotte",
    "nav.why": "Pourquoi Nous",
    "nav.vip": "Services VIP",
    "nav.contacts": "Contact",
    "nav.area": "Espace VIP",
    "hero.badge": '<i class="ri-vip-crown-fill"></i> #1 MARKETPLACE DE LOCATION DE VOITURES DE LUXE',
    "hero.title": 'Conduire l\'Excellence <br><span class="text-gradient">Sans Limites.</span>',
    "hero.subtitle": "Choisissez parmi les supercars et berlines les plus exclusives de la planète. Livraison personnalisée où que vous soyez, assurance tous risques et une expérience de conduite inoubliable.",
    "hero.btnDiscover": "Découvrir la Flotte",
    "hero.btnQuote": "Devis Instantané",
    "hero.stat1": "Supercars Exclusives",
    "hero.stat2": "Concierge Dédié",
    "hero.stat3": "Modèle Garanti",
    "vip.title": "Garantie VIP Assurance",
    "vip.subtitle": "Couverture 100% Incluse",
    "vip.desc": "Chaque location comprend une assistance routière 24h/24 et 7j/7 avec hélicoptère ou supercar de remplacement en 60 minutes dans toute l'Europe.",
    "vip.check1": "Livraison en Villa",
    "vip.check2": "Zéro Franchise",
    "search.location": "Lieu de Prise",
    "search.locAny": "Toute Ville / Aéroport",
    "search.dateFrom": "Date de Départ",
    "search.dateTo": "Date de Retour",
    "search.category": "Catégorie",
    "search.catAll": "Toutes Catégories",
    "search.btn": "Rechercher",
    "fleet.tag": "Notre Flotte",
    "fleet.title": 'Véhicules Sélectionnés pour des <span class="text-gradient">Émotions Pures</span>',
    "fleet.subtitle": "Choisissez le modèle parfait pour votre prochain voyage d'affaires, week-end exclusif ou événement spécial.",
    "filter.all": "Tous les Modèles",
    "why.tag": "Nos Avantages",
    "why.title": 'Pourquoi Choisir <span class="text-gold">ITERCARS</span>',
    "why.subtitle": "Redéfinir la location de voitures en combinant une flotte propriétaire de premier ordre et un accueil 5 étoiles.",
    "why.box1Title": "Livraison Partout",
    "why.box1Desc": "Nous livrons la voiture directement à votre hôtel, villa privée ou terminal de jet privé avec notre personnel.",
    "why.box2Title": "Assurance VIP Tous Risques",
    "why.box2Desc": "Voyagez en toute sérénité avec une franchise zéro et une couverture d'assurance complète sur tous nos véhicules.",
    "why.box3Title": "Concierge 24/7",
    "why.box3Desc": "Assistance dédiée jour et nuit. Réservations de restaurants, itinéraires sur mesure et support technique immédiat.",
    "why.box4Title": "Modèle Garanti",
    "why.box4Desc": "Pas de surprises : vous recevrez exactement la marque, le modèle et la motorisation spécifiés lors de la réservation.",
    "modal.name": "Nom Complet *",
    "modal.phone": "Téléphone / WhatsApp *",
    "modal.email": "Adresse Email *",
    "modal.days": "Jours de Location",
    "modal.extras": "Services Additionnels",
    "modal.extra0": "Livraison Standard (Incluse)",
    "modal.extra150": "Livraison Villa / Aéroport (+€150)",
    "modal.extra300": "Chauffeur Privé demi-journée (+€300)",
    "modal.estimate": "Estimation Totale Devis :",
    "modal.kaskoInc": "Assurance Incluse",
    "modal.btnConfirm": "Confirmer la Demande",
    "footer.desc": "La marketplace de référence pour la location de voitures de luxe, sportives et exclusives en Italie et en Europe. Propulsé par la passion.",
    "footer.col1Title": "Catégories Flotte",
    "footer.col2Title": "Liens Utiles",
    "footer.linkConditions": "Conditions de Location",
    "footer.linkFaq": "FAQ & Support",
    "footer.linkPartner": "Travailler avec nous / Partenaires",
    "footer.col3Title": "Sièges Principaux",
    "dynamic.cat": "Catégorie",
    "dynamic.perDay": "/ jour (Assurance inc.)",
    "dynamic.book": "Réserver",
    "dynamic.noVehicles": "Aucun véhicule trouvé",
    "dynamic.tryChange": "Essayez de modifier les filtres de recherche ou la catégorie.",
    "lang.other": "Autres langues...",
    "lang.modalTitle": "Sélectionner la Langue",
    "lang.modalSub": "Choisissez votre langue d'affichage pour la marketplace ITERCARS.",
    "toast.lang": "Langue définie sur Français 🇫🇷",
    "toast.bookingSuccess": "✨ Demande envoyée avec succès pour {car} ! Un concierge vous contactera sous peu."
  },
  de: {
    "nav.home": "Startseite",
    "nav.fleet": "Fahrzeugflotte",
    "nav.why": "Warum Wir",
    "nav.vip": "VIP-Service",
    "nav.contacts": "Kontakt",
    "nav.area": "VIP Bereich",
    "hero.badge": '<i class="ri-vip-crown-fill"></i> #1 PREMIUMLUXUS-MIETWAGEN-MARKTPLATZ',
    "hero.title": 'Exzellenz fahren <br><span class="text-gradient">Kennt Keine Grenzen.</span>',
    "hero.subtitle": "Wählen Sie aus den exklusivsten Supercars und Limousinen des Planeten. Individuelle Lieferung, wo immer Sie sind, Vollversicherung und ein unvergessliches Fahrerlebnis.",
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
    "search.dateTo": "Rückgabedatum",
    "search.category": "Fahrzeugkategorie",
    "search.catAll": "Alle Kategorien",
    "search.btn": "Fahrzeug Suchen",
    "fleet.tag": "Unsere Flotte",
    "fleet.title": 'Ausgewählte Fahrzeuge für <span class="text-gradient">Reine Emotionen</span>',
    "fleet.subtitle": "Wählen Sie das perfekte Modell für Ihre nächste Geschäftsreise, ein exklusives Wochenende oder ein besonderes Event.",
    "filter.all": "Alle Modelle",
    "why.tag": "Unsere Vorteile",
    "why.title": 'Warum <span class="text-gold">ITERCARS</span> Wählen',
    "why.subtitle": "Wir definieren die Autovermietung neu, indem wir eine erstklassige eigene Flotte mit 5-Sterne-Gastfreundschaft kombinieren.",
    "why.box1Title": "Lieferung Überall",
    "why.box1Desc": "Wir liefern das Auto mit unserem Personal direkt an Ihr Hotel, Ihre Privatvilla oder Ihren Jet-Terminal.",
    "why.box2Title": "VIP Vollversicherung",
    "why.box2Desc": "Reisen Sie in absoluter Sorglosigkeit ohne Selbstbeteiligung und mit vollem Versicherungsschutz für alle unsere Fahrzeuge.",
    "why.box3Title": "24/7 Concierge",
    "why.box3Desc": "Engagierte Unterstützung Tag und Nacht. Restaurantbuchungen, maßgeschneiderte Reiserouten und sofortiger technischer Support.",
    "why.box4Title": "Garantiertes Modell",
    "why.box4Desc": "Keine Überraschungen: Sie erhalten genau die Marke, das Modell und den Motor, die Sie bei der Buchung angegeben haben.",
    "modal.name": "Vollständiger Name *",
    "modal.phone": "Telefon / WhatsApp *",
    "modal.email": "E-Mail-Adresse *",
    "modal.days": "Miettage",
    "modal.extras": "Zusatzleistungen",
    "modal.extra0": "Standardlieferung (Inklusive)",
    "modal.extra150": "Lieferung Villa / Flughafen (+€150)",
    "modal.extra300": "Privatchauffeur halber Tag (+€300)",
    "modal.estimate": "Geschätzter Gesamtbetrag:",
    "modal.kaskoInc": "Versicherung Inklusive",
    "modal.btnConfirm": "Buchungsanfrage Bestätigen",
    "footer.desc": "Der führende Marktplatz für die Miete von Luxus-, Sport- und exklusiven Autos in Italien und Europa. Angetrieben von Leidenschaft und Design.",
    "footer.col1Title": "Flottenkategorien",
    "footer.col2Title": "Nützliche Links",
    "footer.linkConditions": "Mietbedingungen",
    "footer.linkFaq": "FAQ & Support",
    "footer.linkPartner": "Arbeiten Sie mit uns / Partner",
    "footer.col3Title": "Hauptsitze",
    "dynamic.cat": "Kategorie",
    "dynamic.perDay": "/ Tag (Versicherung inkl.)",
    "dynamic.book": "Buchen",
    "dynamic.noVehicles": "Keine Fahrzeuge gefunden",
    "dynamic.tryChange": "Versuchen Sie, die Suchfilter oder Kategorie zu ändern.",
    "lang.other": "Andere Sprachen...",
    "lang.modalTitle": "Sprache Auswählen",
    "lang.modalSub": "Wählen Sie Ihre bevorzugte Anzeigesprache für den ITERCARS-Marktplatz.",
    "toast.lang": "Sprache auf Deutsch eingestellt 🇩🇪",
    "toast.bookingSuccess": "✨ Anfrage für {car} erfolgreich gesendet! Ein Concierge wird Sie in Kürze kontaktieren."
  },
  ru: {
    "nav.home": "Главная",
    "nav.fleet": "Автопарк",
    "nav.why": "Преимущества",
    "nav.vip": "VIP Сервис",
    "nav.contacts": "Контакты",
    "nav.area": "VIP Зона",
    "hero.badge": '<i class="ri-vip-crown-fill"></i> #1 МАРКЕТПЛЕЙС АРЕНДЫ ПРЕМИУМ АВТОМОБИЛЕЙ',
    "hero.title": 'Совершенство за рулем <br><span class="text-gradient">Без Границ.</span>',
    "hero.subtitle": "Выбирайте из самых эксклюзивных суперкаров и седанов планеты. Персональная доставка куда угодно, полная страховка КАСКО и незабываемый опыт.",
    "hero.btnDiscover": "Смотреть Автопарк",
    "hero.btnQuote": "Рассчитать Стоимость",
    "hero.stat1": "Эксклюзивные Суперкары",
    "hero.stat2": "Личный Консьерж",
    "hero.stat3": "Гарантия Модели",
    "vip.title": "VIP Гарантия КАСКО",
    "vip.subtitle": "100% Покрытие Включено",
    "vip.desc": "Каждая аренда включает помощь на дороге 24/7 с вертолетом или заменой суперкара в течение 60 минут по всей Европе.",
    "vip.check1": "Доставка к Вилле",
    "vip.check2": "Без Франшизы",
    "search.location": "Место Получения",
    "search.locAny": "Любой Город / Аэропорт",
    "search.dateFrom": "Дата Получения",
    "search.dateTo": "Дата Возврата",
    "search.category": "Категория",
    "search.catAll": "Все Категории",
    "search.btn": "Найти Автомобиль",
    "fleet.tag": "Наш Автопарк",
    "fleet.title": 'Отборные Автомобили для <span class="text-gradient">Чистых Эмоций</span>',
    "fleet.subtitle": "Выберите идеальную модель для деловой поездки, эксклюзивного уикенда или особого мероприятия.",
    "filter.all": "Все Модели",
    "why.tag": "Наши Преимущества",
    "why.title": 'Почему Выбирают <span class="text-gold">ITERCARS</span>',
    "why.subtitle": "Мы переосмысливаем аренду авто, объединяя собственный парк высшего класса с 5-звездочным сервисом.",
    "why.box1Title": "Доставка Куда Угодно",
    "why.box1Desc": "Доставим автомобиль прямо к вашему отелю, частной вилле или терминалу бизнес-авиации.",
    "why.box2Title": "Полная VIP Страховка",
    "why.box2Desc": "Путешествуйте с абсолютным спокойствием с нулевой франшизой и полным страховым покрытием.",
    "why.box3Title": "Консьерж 24/7",
    "why.box3Desc": "Круглосуточная поддержка. Бронирование ресторанов, индивидуальные маршруты и мгновенная помощь.",
    "why.box4Title": "Гарантия Модели",
    "why.box4Desc": "Никаких сюрпризов: вы получите именно ту марку, модель и двигатель, которые указали при бронировании.",
    "modal.name": "ФИО *",
    "modal.phone": "Телефон / WhatsApp *",
    "modal.email": "Электронная Почта *",
    "modal.days": "Дни Аренды",
    "modal.extras": "Дополнительные Услуги",
    "modal.extra0": "Стандартная доставка (Включено)",
    "modal.extra150": "Доставка на Виллу / Аэропорт (+€150)",
    "modal.extra300": "Личный Водитель полдня (+€300)",
    "modal.estimate": "Ориентировочная Стоимость:",
    "modal.kaskoInc": "Страховка Включена",
    "modal.btnConfirm": "Подтвердить Запрос бронирования",
    "footer.desc": "Ведущий маркетплейс аренды люксовых, спортивных и эксклюзивных автомобилей в Италии и Европе. Создано с любовью к дизайну.",
    "footer.col1Title": "Категории Авто",
    "footer.col2Title": "Полезные Ссылки",
    "footer.linkConditions": "Условия Аренды",
    "footer.linkFaq": "Вопросы и Поддержка",
    "footer.linkPartner": "Сотрудничество / Партнеры",
    "footer.col3Title": "Главные Офисы",
    "dynamic.cat": "Категория",
    "dynamic.perDay": "/ день (Страховка вкл.)",
    "dynamic.book": "Забронировать",
    "dynamic.noVehicles": "Автомобили не найдены",
    "dynamic.tryChange": "Попробуйте изменить фильтры поиска или категорию.",
    "lang.other": "Другие языки...",
    "lang.modalTitle": "Выберите Язык",
    "lang.modalSub": "Выберите предпочитаемый язык отображения для маркетплейса ITERCARS.",
    "toast.lang": "Язык установлен на Русский 🇷🇺",
    "toast.bookingSuccess": "✨ Запрос успешно отправлен для {car}! Консьерж скоро свяжется с вами."
  },
  zh: {
    "nav.home": "首页",
    "nav.fleet": "尊享车队",
    "nav.why": "为什么选择我们",
    "nav.vip": "VIP 服务",
    "nav.contacts": "联系方式",
    "nav.area": "VIP 贵宾区",
    "hero.badge": '<i class="ri-vip-crown-fill"></i> #1 高端豪华汽车租赁平台',
    "hero.title": '驾驭卓越 <br><span class="text-gradient">探索无界。</span>',
    "hero.subtitle": "从全球最尊贵的超级跑车与豪华轿车中挑选。无论身在何处，专人送车上门，享受全额保险与难忘驾驶体验。",
    "hero.btnDiscover": "探索车队",
    "hero.btnQuote": "实时报价",
    "hero.stat1": "顶级超跑",
    "hero.stat2": "专属管家",
    "hero.stat3": "车型保证",
    "vip.title": "VIP 全险保障",
    "vip.subtitle": "包含 100% 全额保障",
    "vip.desc": "每次租赁均包含欧洲全境 24/7 道路救援，60分钟内提供直升机或替换超跑服务。",
    "vip.check1": "别墅送车",
    "vip.check2": "零免赔额",
    "search.location": "取车地点",
    "search.locAny": "任意城市 / 机场",
    "search.dateFrom": "取车日期",
    "search.dateTo": "还车日期",
    "search.category": "车型类别",
    "search.catAll": "全部类别",
    "search.btn": "搜索车辆",
    "fleet.tag": "我们的车队",
    "fleet.title": '精选座驾 为<span class="text-gradient">纯粹激情</span>而生',
    "fleet.subtitle": "为您接下来的商务差旅、尊享周末或特殊活动选择最完美的座驾。",
    "filter.all": "全部车型",
    "why.tag": "核心优势",
    "why.title": '为什么选择 <span class="text-gold">ITERCARS</span>',
    "why.subtitle": "我们将顶尖的自有车队与五星级待客之道结合，重新定义租车体验。",
    "why.box1Title": "全境专人送达",
    "why.box1Desc": "我们的专业团队可将车辆直接送到您下榻的酒店、私人别墅或私人飞机航站楼。",
    "why.box2Title": "VIP 全额保险",
    "why.box2Desc": "所有车辆均享有零免赔额及全额保险保障，让您的旅程尽享无忧。",
    "why.box3Title": "24/7 专属礼宾",
    "why.box3Desc": "全天候专属协助。餐厅预订、定制行程安排以及即时技术支持。",
    "why.box4Title": "绝对车型保证",
    "why.box4Desc": "绝无意外：您收到的将与预订时指定的品牌、型号及发动机配置完全一致。",
    "modal.name": "真实姓名 *",
    "modal.phone": "电话 / 微信 / WhatsApp *",
    "modal.email": "电子邮箱 *",
    "modal.days": "租赁天数",
    "modal.extras": "增值服务",
    "modal.extra0": "标准送车服务 (免费)",
    "modal.extra150": "别墅 / 机场专送 (+€150)",
    "modal.extra300": "半日私人司机服务 (+€300)",
    "modal.estimate": "预计总报价:",
    "modal.kaskoInc": "包含全险",
    "modal.btnConfirm": "提交预订申请",
    "footer.desc": "意大利及欧洲领先的豪华汽车、跑车及稀有车型租赁服务平台。由热情与卓越设计驱动。",
    "footer.col1Title": "车队类别",
    "footer.col2Title": "实用链接",
    "footer.linkConditions": "租赁条款",
    "footer.linkFaq": "常见问题与支持",
    "footer.linkPartner": "商务合作 / 招商",
    "footer.col3Title": "主要总部",
    "dynamic.cat": "类别",
    "dynamic.perDay": "/ 天 (含全险)",
    "dynamic.book": "立即预订",
    "dynamic.noVehicles": "未找到符合条件的车辆",
    "dynamic.tryChange": "请尝试筛选其他搜索条件或类别。",
    "lang.other": "更多语言...",
    "lang.modalTitle": "选择语言",
    "lang.modalSub": "选择您偏好的 ITERCARS 平台显示语言。",
    "toast.lang": "语言已切换至 中文 🇨🇳",
    "toast.bookingSuccess": "✨ {car} 预订申请提交成功！专属礼宾管家将很快与您联系。"
  },
  ar: {
    "nav.home": "الرئيسية",
    "nav.fleet": "أسطولنا",
    "nav.why": "لماذا نحن",
    "nav.vip": "خدمات VIP",
    "nav.contacts": "اتصل بنا",
    "nav.area": "صالة كبار الشخصيات",
    "hero.badge": '<i class="ri-vip-crown-fill"></i> المنصة رقم 1 لتأجير السيارات الفاخرة',
    "hero.title": 'قيادة التميز <br><span class="text-gradient">بلا حدود.</span>',
    "hero.subtitle": "اختر من بين أكثر السيارات الخارقة وسيارات السيدان حصرية على وجه الأرض. توصيل مخصص أينما كنت، تأمين شامل وتجربة قيادة لا تُنسى.",
    "hero.btnDiscover": "اكتشف الأسطول",
    "hero.btnQuote": "تسعير فوري",
    "hero.stat1": "سيارات خارقة حصرية",
    "hero.stat2": "خدمة كونسيرج مخصصة",
    "hero.stat3": "ضمان الموديل",
    "vip.title": "ضمان التأمين الشامل VIP",
    "vip.subtitle": "تغطية بنسبة 100% متضمنة",
    "vip.desc": "كل إيجار يشمل مساعدة على الطريق على مدار 24 ساعة مع مروحية أو سيارة بديلة خارقة خلال 60 دقيقة في جميع أنحاء أوروبا.",
    "vip.check1": "توصيل للفيلا",
    "vip.check2": "بدون نسبة تحمل",
    "search.location": "مكان الاستلام",
    "search.locAny": "أي مدينة / مطار",
    "search.dateFrom": "تاريخ الاستلام",
    "search.dateTo": "تاريخ العودة",
    "search.category": "فئة السيارة",
    "search.catAll": "جميع الفئات",
    "search.btn": "ابحث عن سيارة",
    "fleet.tag": "أسطولنا الفاخر",
    "fleet.title": 'سيارات مختارة من أجل <span class="text-gradient">عواطف خالصة</span>',
    "fleet.subtitle": "اختر الموديل المثالي لرحلة عملك القادمة، عطلة نهاية أسبوع حصرية أو حدث خاص.",
    "filter.all": "جميع الموديلات",
    "why.tag": "مزايانا",
    "why.title": 'لماذا تختار <span class="text-gold">ITERCARS</span>',
    "why.subtitle": "نحن نعيد تعريف تأجير السيارات من خلال الجمع بين أسطول خاص من الدرجة الأولى مع ضيافة 5 نجوم.",
    "why.box1Title": "التوصيل في أي مكان",
    "why.box1Desc": "نقوم بتسليم السيارة مباشرة إلى فندقك، فيلتك الخاصة، أو صالة الطيران الخاص عبر فريقنا.",
    "why.box2Title": "تأمين VIP شامل",
    "why.box2Desc": "سافر براحة بال تامة مع إعفاء كامل من تحمل الأضرار وتغطية تأمينية شاملة على جميع سياراتنا.",
    "why.box3Title": "كونسيرج 24/7",
    "why.box3Desc": "مساعدة مخصصة ليل نهار. حجوزات المطاعم، مسارات مخصصة ودعم فني فوري.",
    "why.box4Title": "ضمان الموديل المحدد",
    "why.box4Desc": "لا مفاجآت: ستستلم بالضبط نفس العلامة التجارية، الموديل والمحرك المحدد عند الحجز.",
    "modal.name": "الاسم الكامل *",
    "modal.phone": "الهاتف / واتساب *",
    "modal.email": "البريد الإلكتروني *",
    "modal.days": "أيام الإيجار",
    "modal.extras": "خدمات إضافية",
    "modal.extra0": "التوصيل القياسي (مجاناً)",
    "modal.extra150": "توصيل للفيلا / المطار (+€150)",
    "modal.extra300": "سائق خاص لنصف يوم (+€300)",
    "modal.estimate": "إجمالي التسعير المقدر:",
    "modal.kaskoInc": "التأمين مشمول",
    "modal.btnConfirm": "تأكيد طلب الحجز",
    "footer.desc": "المنصة الرائدة لتأجير السيارات الفاخرة، الرياضية والحصرية في إيطاليا وأوروبا. مدفوع بالشغف والتصميم.",
    "footer.col1Title": "فئات الأسطول",
    "footer.col2Title": "روابط مفيدة",
    "footer.linkConditions": "شروط التأجير",
    "footer.linkFaq": "الأسئلة الشائعة والدعم",
    "footer.linkPartner": "اعمل معنا / شركاء",
    "footer.col3Title": "المقر الرئيسي",
    "dynamic.cat": "الفئة",
    "dynamic.perDay": "/ يوم (التأمين مشمول)",
    "dynamic.book": "احجز الآن",
    "dynamic.noVehicles": "لم يتم العثور على سيارات",
    "dynamic.tryChange": "حاول تغيير فلاتر البحث أو الفئة.",
    "lang.other": "لغات أخرى...",
    "lang.modalTitle": "اختر اللغة",
    "lang.modalSub": "اختر لغة العرض المفضلة لديك لمنصة ITERCARS.",
    "toast.lang": "تم تعيين اللغة إلى العربية 🇸🇦",
    "toast.bookingSuccess": "✨ تم إرسال الطلب بنجاح لـ {car}! سيتصل بك فريق الكونسيرج قريباً."
  },
  ja: {
    "nav.home": "ホーム",
    "nav.fleet": "車両ラインナップ",
    "nav.why": "選ばれる理由",
    "nav.vip": "VIPサービス",
    "nav.contacts": "お問い合わせ",
    "nav.area": "VIPラウンジ",
    "hero.badge": '<i class="ri-vip-crown-fill"></i> #1 高級ラグジュアリーレンタカー・マーケットプレイス',
    "hero.title": '卓越したドライビング <br><span class="text-gradient">無限の可能性。</span>',
    "hero.subtitle": "世界で最も希少なスーパーカーや高級セダンからお選びください。指定場所へのオーダーメイド配車、完全補償保険、そして忘れられない運転体験を。",
    "hero.btnDiscover": "車両を見る",
    "hero.btnQuote": "即時見積もり",
    "hero.stat1": "最高峰スーパーカー",
    "hero.stat2": "専属コンシェルジュ",
    "hero.stat3": "モデル確約",
    "vip.title": "VIPフル補償保証",
    "vip.subtitle": "100%補償込み",
    "vip.desc": "すべてのレンタルに24時間365日のロードサービスが付属。ヨーロッパ全土で60分以内にヘリコプターまたは代替スーパーカーを手配します。",
    "vip.check1": "別荘・ホテル配車",
    "vip.check2": "免責額ゼロ",
    "search.location": "配車場所",
    "search.locAny": "すべての都市・空港",
    "search.dateFrom": "貸出日",
    "search.dateTo": "返却日",
    "search.category": "カテゴリー",
    "search.catAll": "すべてのカテゴリー",
    "search.btn": "車両を検索",
    "fleet.tag": "ラインナップ",
    "fleet.title": '純粋な感動を呼ぶ <span class="text-gradient">厳選された名車たち</span>',
    "fleet.subtitle": "次のビジネス出張、特別な週末、または記念イベントに最適なモデルをお選びください。",
    "filter.all": "すべてのモデル",
    "why.tag": "当社の強み",
    "why.title": '<span class="text-gold">ITERCARS</span> が選ばれる理由',
    "why.subtitle": "最高峰の自社保有フリートと5つ星のおもてなしを組み合わせ、レンタカーの概念を再定義します。",
    "why.box1Title": "どこへでも指定配車",
    "why.box1Desc": "専門スタッフがご滞在先のホテル、プライベートヴィラ、またはプライベートジェットのターミナルまで直接お車をお届けします。",
    "why.box2Title": "VIP安心フル補償",
    "why.box2Desc": "すべての車両に免責額ゼロの完全保険補償が適用され、絶対的な安心感とともにお旅をお楽しみいただけます。",
    "why.box3Title": "24時間コンシェルジュ",
    "why.box3Desc": "昼夜を問わず専属サポート。レストランのご予約、オーダーメイドの旅程提案、即時の技術サポートを提供します。",
    "why.box4Title": "確実なモデル確約",
    "why.box4Desc": "驚きはありません：ご予約時に指定されたブランド、モデル、エンジン仕様と全く同じ車両をお届けします。",
    "modal.name": "お名前 (フルネーム) *",
    "modal.phone": "お電話番号 / WhatsApp *",
    "modal.email": "メールアドレス *",
    "modal.days": "ご利用日数",
    "modal.extras": "追加サービス",
    "modal.extra0": "標準配車サービス (無料)",
    "modal.extra150": "ヴィラ・空港指定配車 (+€150)",
    "modal.extra300": "半日プライベート運転手 (+€300)",
    "modal.estimate": "お見積もり総額:",
    "modal.kaskoInc": "保険料込み",
    "modal.btnConfirm": "予約リクエストを送信",
    "footer.desc": "イタリアおよびヨーロッパにおける高級車、スポーツカー、希少車のレンタルをリードするマーケットプレイス。情熱とデザインによって駆動されています。",
    "footer.col1Title": "車両カテゴリー",
    "footer.col2Title": "お役立ちリンク",
    "footer.linkConditions": "レンタル利用規約",
    "footer.linkFaq": "よくある質問とサポート",
    "footer.linkPartner": "採用情報 / パートナー",
    "footer.col3Title": "主要拠点",
    "dynamic.cat": "カテゴリー",
    "dynamic.perDay": "/ 日 (保険込み)",
    "dynamic.book": "予約する",
    "dynamic.noVehicles": "条件に合う車両が見つかりません",
    "dynamic.tryChange": "検索条件やカテゴリーを変更してお試しください。",
    "lang.other": "その他の言語...",
    "lang.modalTitle": "言語を選択",
    "lang.modalSub": "ITERCARS マーケットプレイスの表示言語をお選びください。",
    "toast.lang": "日本語 🇯🇵 に設定しました",
    "toast.bookingSuccess": "✨ {car} の予約リクエストが正常に送信されました！コンシェルジュより間もなくご連絡いたします。"
  },
  pt: {
    "nav.home": "Início",
    "nav.fleet": "A Frota",
    "nav.why": "Por Que Nós",
    "nav.vip": "Serviços VIP",
    "nav.contacts": "Contato",
    "nav.area": "Área VIP",
    "hero.badge": '<i class="ri-vip-crown-fill"></i> #1 MARKETPLACE DE ALUGUEL DE CARROS PREMIUM',
    "hero.title": 'Conduzir a Excelência <br><span class="text-gradient">Não Tem Limites.</span>',
    "hero.subtitle": "Escolha entre os supercarros e sedans mais exclusivos do planeta. Entrega personalizada onde você estiver, seguro total e uma experiência inesquecível.",
    "hero.btnDiscover": "Descobrir Frota",
    "hero.btnQuote": "Orçamento Instantâneo",
    "hero.stat1": "Supercarros Exclusivos",
    "hero.stat2": "Concierge Dedicado",
    "hero.stat3": "Modelo Garantido",
    "vip.title": "Garantia VIP Seguro Total",
    "vip.subtitle": "100% de Cobertura Incluída",
    "vip.desc": "Cada aluguel inclui assistência 24/7 com helicóptero ou supercarro substituto em 60 minutos em toda a Europa.",
    "vip.check1": "Entrega em Villa",
    "vip.check2": "Franquia Zero",
    "search.location": "Local de Retirada",
    "search.locAny": "Qualquer Cidade / Aeroporto",
    "search.dateFrom": "Data Retirada",
    "search.dateTo": "Data Devolução",
    "search.category": "Categoria",
    "search.catAll": "Todas as Categorias",
    "search.btn": "Buscar Carros",
    "fleet.tag": "Nossa Frota",
    "fleet.title": 'Veículos Selecionados para <span class="text-gradient">Emoções Puras</span>',
    "fleet.subtitle": "Escolha o modelo perfeito para sua próxima viagem de negócios, fim de semana exclusivo ou evento especial.",
    "filter.all": "Todos os Modelos",
    "why.tag": "Nossas Vantagens",
    "why.title": 'Por Que Escolher a <span class="text-gold">ITERCARS</span>',
    "why.subtitle": "Redefinimos o aluguel de carros combinando uma frota própria de excelência com hospitalidade 5 estrelas.",
    "why.box1Title": "Entrega em Qualquer Lugar",
    "why.box1Desc": "Entregamos o veículo diretamente em seu hotel, villa privada ou terminal de jato privado com nossa equipe.",
    "why.box2Title": "Seguro VIP Total",
    "why.box2Desc": "Viaje com total tranquilidade com franquia zero e cobertura completa em todos os nossos veículos.",
    "why.box3Title": "Concierge 24/7",
    "why.box3Desc": "Assistência dedicada dia e noite. Reservas em restaurantes, itinerários sob medida e suporte técnico imediato.",
    "why.box4Title": "Modelo Garantido",
    "why.box4Desc": "Sem surpresas: você receberá exatamente a marca, modelo e motorização especificados ao reservar.",
    "modal.name": "Nome Completo *",
    "modal.phone": "Telefone / WhatsApp *",
    "modal.email": "E-mail *",
    "modal.days": "Dias de Aluguel",
    "modal.extras": "Serviços Adicionais",
    "modal.extra0": "Entrega Padrão (Incluída)",
    "modal.extra150": "Entrega Villa / Aeroporto (+€150)",
    "modal.extra300": "Motorista Privado meia diária (+€300)",
    "modal.estimate": "Estimativa Total do Orçamento:",
    "modal.kaskoInc": "Seguro Incluído",
    "modal.btnConfirm": "Confirmar Solicitação",
    "footer.desc": "O marketplace de referência para o aluguel de carros de luxo, esportivos e exclusivos na Itália e Europa. Movido pela paixão e design.",
    "footer.col1Title": "Categorias Frota",
    "footer.col2Title": "Links Úteis",
    "footer.linkConditions": "Condições de Aluguel",
    "footer.linkFaq": "FAQ & Suporte",
    "footer.linkPartner": "Trabalhe conosco / Parceiros",
    "footer.col3Title": "Sedes Principais",
    "dynamic.cat": "Categoria",
    "dynamic.perDay": "/ dia (Seguro inc.)",
    "dynamic.book": "Reservar",
    "dynamic.noVehicles": "Nenhum veículo encontrado",
    "dynamic.tryChange": "Tente alterar os filtros de busca ou categoria.",
    "lang.other": "Outras idiomas...",
    "lang.modalTitle": "Selecionar Idioma",
    "lang.modalSub": "Escolha o idioma de exibição preferido para o marketplace ITERCARS.",
    "toast.lang": "Idioma configurado para Português 🇵🇹",
    "toast.bookingSuccess": "✨ Solicitação enviada com sucesso para {car}! Um concierge entrará em contato em breve."
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
  if (flagEl) flagEl.innerText = langFlags[lang] || "🇮🇹";
  if (codeEl) codeEl.innerText = lang.toUpperCase();

  // Se è arabo, imposta la direzione RTL (Right-to-Left) per un effetto WOW autentico
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
  
  if (window.location.pathname.includes('fleet.html')) {
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

let fleetData = [
  // SUPERCAR (Luxury)
  { id: 29, name: "Audi R8 Performance", category: "Supercar", price: 0, rating: "5.0", specs: { speed: "331 KM/H", accel: "3.2s", hp: "620 CV" }, image: "audi-r8.webp", badge: "V10 5.2L FSI" },
  { id: 30, name: "Bentley Continental GT", category: "Supercar", price: 0, rating: "5.0", specs: { speed: "335 KM/H", accel: "3.6s", hp: "659 CV" }, image: "bentley-continental.webp", badge: "W12 6.0L Biturbo" },
  { id: 31, name: "Ferrari 296 GTS", category: "Supercar", price: 0, rating: "5.0", specs: { speed: "330 KM/H", accel: "2.9s", hp: "830 CV" }, image: "ferrari-296-gts.webp", badge: "V6 3.0L PHEV" },
  { id: 32, name: "Ferrari 812 GTS", category: "Supercar", price: 0, rating: "5.0", specs: { speed: "340 KM/H", accel: "3.0s", hp: "800 CV" }, image: "ferrari-812-gts.webp", badge: "V12 6.5L NA" },
  { id: 33, name: "Ferrari F8 Tributo", category: "Supercar", price: 0, rating: "5.0", specs: { speed: "340 KM/H", accel: "2.9s", hp: "720 CV" }, image: "ferrari-f8.webp", badge: "V8 3.9L Biturbo" },
  { id: 34, name: "Ferrari Portofino M", category: "Supercar", price: 0, rating: "4.9", specs: { speed: "320 KM/H", accel: "3.45s", hp: "620 CV" }, image: "ferrari-portofino.webp", badge: "V8 3.9L Biturbo" },
  { id: 35, name: "Ferrari Roma Spyder", category: "Supercar", price: 0, rating: "4.9", specs: { speed: "320 KM/H", accel: "3.4s", hp: "620 CV" }, image: "ferrari-roma.webp", badge: "V8 3.9L Biturbo" },
  { id: 36, name: "Ferrari SF90 Stradale", category: "Supercar", price: 0, rating: "5.0", specs: { speed: "340 KM/H", accel: "2.5s", hp: "1000 CV" }, image: "ferrari-sf90.webp", badge: "V8 4.0L PHEV" },
  { id: 37, name: "Lamborghini Aventador S", category: "Supercar", price: 0, rating: "5.0", specs: { speed: "350 KM/H", accel: "2.9s", hp: "740 CV" }, image: "lamborghini-aventador.webp", badge: "V12 6.5L NA" },
  { id: 38, name: "Lamborghini Huracán EVO Spyder", category: "Supercar", price: 0, rating: "4.9", specs: { speed: "325 KM/H", accel: "3.1s", hp: "640 CV" }, image: "lamborghini-huracan.webp", badge: "V10 5.2L NA" },
  { id: 39, name: "Lamborghini Revuelto", category: "Supercar", price: 0, rating: "5.0", specs: { speed: "350 KM/H", accel: "2.5s", hp: "1015 CV" }, image: "lamborghini-revuelto.webp", badge: "V12 6.5L PHEV" },
  { id: 40, name: "Maserati GranCabrio", category: "Supercar", price: 0, rating: "4.8", specs: { speed: "316 KM/H", accel: "3.6s", hp: "542 CV" }, image: "maserati-grancabrio.webp", badge: "V6 3.0L Nettuno" },
  { id: 41, name: "Maserati MC20", category: "Supercar", price: 0, rating: "5.0", specs: { speed: "325 KM/H", accel: "2.9s", hp: "630 CV" }, image: "maserati-mc20-new.webp", badge: "V6 3.0L Nettuno" },
  { id: 42, name: "Porsche 911 992 Cabriolet", category: "Supercar", price: 0, rating: "4.9", specs: { speed: "306 KM/H", accel: "3.9s", hp: "450 CV" }, image: "porsche-911-cab.webp", badge: "Boxer 3.0L Biturbo" },
  { id: 44, name: "Porsche 911 992 Turbo S Cabriolet", category: "Supercar", price: 0, rating: "5.0", specs: { speed: "330 KM/H", accel: "2.8s", hp: "650 CV" }, image: "porsche-911-turbo.webp", badge: "Boxer 3.8L Biturbo" },
  // SUV LUXURY
  { id: 5, name: "Audi Q8 S-Line", category: "SUV Luxury", price: 0, rating: "4.9", specs: { speed: "245 KM/H", accel: "6.3s", hp: "286 CV" }, image: "audi_q8_sline.webp", badge: "V6 3.0L TDI" },
  { id: 6, name: "Audi RSQ3 Sportback", category: "SUV Luxury", price: 0, rating: "4.9", specs: { speed: "280 KM/H", accel: "4.5s", hp: "400 CV" }, image: "audi_rsq3_sportback.webp", badge: "L5 2.5L TFSI" },
  { id: 7, name: "Audi RSQ8", category: "SUV Luxury", price: 0, rating: "5.0", specs: { speed: "305 KM/H", accel: "3.8s", hp: "600 CV" }, image: "audi_rsq8.webp", badge: "V8 4.0L TFSI" },
  { id: 8, name: "Ferrari Purosangue", category: "SUV Luxury", price: 0, rating: "5.0", specs: { speed: "310 KM/H", accel: "3.3s", hp: "725 CV" }, image: "ferrari_purosangue.webp", badge: "V12 6.5L NA" },
  { id: 17, name: "Lamborghini Urus S", category: "SUV Luxury", price: 0, rating: "5.0", specs: { speed: "305 KM/H", accel: "3.5s", hp: "666 CV" }, image: "lamborghini_urus.webp", badge: "V8 4.0L Biturbo" },
  { id: 18, name: "Maserati Levante GTS", category: "SUV Luxury", price: 0, rating: "4.9", specs: { speed: "292 KM/H", accel: "4.2s", hp: "530 CV" }, image: "maserati_levante.webp", badge: "V8 3.8L Biturbo" },
  { id: 19, name: "Mercedes G63 AMG", category: "SUV Luxury", price: 0, rating: "5.0", specs: { speed: "240 KM/H", accel: "4.5s", hp: "585 CV" }, image: "mercedes_g63.webp", badge: "V8 4.0L Biturbo" },
  { id: 20, name: "Porsche Cayenne Coupé Turbo GT", category: "SUV Luxury", price: 0, rating: "5.0", specs: { speed: "300 KM/H", accel: "3.3s", hp: "640 CV" }, image: "porsche_cayenne.webp", badge: "V8 4.0L Biturbo" },
  { id: 21, name: "Porsche Macan GTS", category: "SUV Luxury", price: 0, rating: "4.8", specs: { speed: "272 KM/H", accel: "4.5s", hp: "440 CV" }, image: "porsche_macan.webp", badge: "V6 2.9L Biturbo" },
  // PRESTIGE (Sportiva)
  { id: 22, name: "Audi A5 Avant", category: "Sportiva", price: 0, rating: "4.8", specs: { speed: "250 KM/H", accel: "5.0s", hp: "367 CV" }, image: "audi_a5_avant.webp", badge: "V6 3.0L TFSI" },
  { id: 23, name: "Audi RS3", category: "Sportiva", price: 0, rating: "4.9", specs: { speed: "290 KM/H", accel: "3.8s", hp: "400 CV" }, image: "audi_rs3.webp", badge: "L5 2.5L TFSI" },
  { id: 24, name: "Audi RS5 Avant", category: "Sportiva", price: 0, rating: "5.0", specs: { speed: "250 KM/H", accel: "3.9s", hp: "450 CV" }, image: "audi_rs5_avant.webp", badge: "V6 2.9L TFSI" },
  { id: 25, name: "Audi RS6 Performance", category: "Sportiva", price: 0, rating: "5.0", specs: { speed: "305 KM/H", accel: "3.4s", hp: "630 CV" }, image: "audi_rs6_performance.webp", badge: "V8 4.0L TFSI" },
  { id: 26, name: "BMW M4 Competition", category: "Sportiva", price: 0, rating: "5.0", specs: { speed: "290 KM/H", accel: "3.5s", hp: "530 CV" }, image: "bmw_m4_competition.webp", badge: "L6 3.0L M TwinPower" },
  { id: 27, name: "BMW M8 Competition Cabrio", category: "Sportiva", price: 0, rating: "4.9", specs: { speed: "305 KM/H", accel: "3.3s", hp: "625 CV" }, image: "bmw_m8_cabrio.webp", badge: "V8 4.4L M TwinPower" },
  { id: 28, name: "Porsche 718 Spyder", category: "Sportiva", price: 0, rating: "4.9", specs: { speed: "301 KM/H", accel: "4.4s", hp: "420 CV" }, image: "porsche_718_spyder.webp", badge: "Boxer 4.0L NA" },
  // CABRIO
  { id: 45, name: "BMW M8 Competition Cabrio", category: "Cabriolet", price: 0, rating: "5.0", specs: { speed: "305 KM/H", accel: "3.3s", hp: "625 CV" }, image: "bmw_m8_cabrio.webp", badge: "V8 4.4L M TwinPower" },
  { id: 46, name: "Ferrari 296 GTS", category: "Cabriolet", price: 0, rating: "5.0", specs: { speed: "330 KM/H", accel: "2.9s", hp: "830 CV" }, image: "ferrari-296-gts.webp", badge: "V6 3.0L PHEV" },
  { id: 47, name: "Ferrari 812 GTS", category: "Cabriolet", price: 0, rating: "5.0", specs: { speed: "340 KM/H", accel: "3.0s", hp: "800 CV" }, image: "ferrari-812-gts.webp", badge: "V12 6.5L NA" },
  { id: 48, name: "Ferrari Portofino M", category: "Cabriolet", price: 0, rating: "4.9", specs: { speed: "320 KM/H", accel: "3.45s", hp: "620 CV" }, image: "ferrari-portofino.webp", badge: "V8 3.9L Biturbo" },
  { id: 49, name: "Ferrari Roma Spyder", category: "Cabriolet", price: 0, rating: "4.9", specs: { speed: "320 KM/H", accel: "3.4s", hp: "620 CV" }, image: "ferrari-roma.webp", badge: "V8 3.9L Biturbo" },
  { id: 50, name: "Lamborghini Huracán EVO Spyder", category: "Cabriolet", price: 0, rating: "5.0", specs: { speed: "325 KM/H", accel: "3.1s", hp: "640 CV" }, image: "lamborghini-huracan.webp", badge: "V10 5.2L NA" },
  { id: 51, name: "Maserati GranCabrio", category: "Cabriolet", price: 0, rating: "4.8", specs: { speed: "316 KM/H", accel: "3.6s", hp: "542 CV" }, image: "maserati-grancabrio.webp", badge: "V6 3.0L Nettuno" },
  { id: 52, name: "Porsche 718 Spyder", category: "Cabriolet", price: 0, rating: "4.9", specs: { speed: "301 KM/H", accel: "4.4s", hp: "420 CV" }, image: "porsche_718_spyder.webp", badge: "Boxer 4.0L NA" },
  { id: 53, name: "Porsche 911 992 Cabriolet", category: "Cabriolet", price: 0, rating: "4.9", specs: { speed: "306 KM/H", accel: "3.9s", hp: "450 CV" }, image: "porsche-911-cab.webp", badge: "Boxer 3.0L Biturbo" },
  { id: 54, name: "Porsche 911 992 Turbo S Cabriolet", category: "Cabriolet", price: 0, rating: "5.0", specs: { speed: "330 KM/H", accel: "2.8s", hp: "650 CV" }, image: "porsche-911-turbo.webp", badge: "Boxer 3.8L Biturbo" }
];

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
  if (typeof loadFleetFromSupabase === 'function') loadFleetFromSupabase();
  
  const navBtn = document.getElementById("navAreaBtn");
  if (navBtn) {
    navBtn.addEventListener("click", (e) => {
      e.preventDefault();
      openAuthModal();
    });
  }
});

async function loadFleetFromSupabase() {
  // Caricamento da database disabilitato temporaneamente per mostrare solo i veicoli personalizzati
  console.log("ℹ️ Caricamento Supabase disabilitato: mostra solo i veicoli locali di ITERCARS.");
  
  // Forza il rendering della flotta basato sui dati locali configurati
  const activeBtn = document.querySelector(".pill-btn.active");
  let filterCat = "tutti";
  if (activeBtn) {
    const text = activeBtn.innerText;
    if (text.includes("Supercar")) filterCat = "Supercar";
    else if (text.includes("SUV")) filterCat = "SUV";
    else if (text.includes("Sportiv") || text.includes("Sport")) filterCat = "Sportiva";
    else if (text.includes("Elettr") || text.includes("Electr")) filterCat = "Elettrica";
  }
  
  if (window.location.pathname.includes('fleet.html')) {
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
  const categories = ["Supercar", "SUV Luxury", "Cabriolet", "Berline e Sportive"];
  let html = "";

  categories.forEach(cat => {
    const catCars = cars.filter(car => car.category === cat);
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
  const cleanBadge = (car.badge || '').replace(/[\u1F600-\u1F64F\u1F300-\u1F5FF\u1F680-\u1F6FF\u1F1E6-\u1F1FF\u2600-\u26FF\u2700-\u27BF]/g, '').trim();
  return `
    <div class="glass-card car-card">
      <a href="car-detail.html?v=4&car=${encodeURIComponent(car.name)}" style="display: block; position: relative;">
        <div class="car-image-container">
          <span class="car-badge">${cleanBadge}</span>
          <span class="car-rating"><i class="ri-star-fill"></i> ${car.rating}</span>
          <img src="${car.image}" alt="${car.name}" class="car-img" loading="lazy">
        </div>
      </a>
      
      <div class="car-info">
        <h3 class="car-title">${car.name}</h3>
        <span class="car-type"><i class="ri-steering-2-line"></i> ${dict["dynamic.cat"]} ${car.category}</span>
        
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
            <span class="price-amount">${car.price === 0 ? "Su Richiesta" : "€ " + car.price}</span>
            <span class="price-period">${car.price === 0 ? "" : dict["dynamic.perDay"]}</span>
          </div>
          
          <a href="car-detail.html?car=${encodeURIComponent(car.name)}" class="btn btn-primary" style="padding: 10px 20px; text-decoration: none; display: flex; gap: 8px; align-items: center;">
            <span>${dict["dynamic.book"]}</span> <i class="ri-arrow-right-up-line"></i>
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
    if (grid && !window.location.pathname.includes('fleet.html')) {
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
    totalDisplay.innerText = `€ ${total.toLocaleString('it-IT')}`;
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
      else console.log("✅ Prenotazione salvata con successo su Supabase!");
    } catch (err) {
      console.error("Errore connessione Supabase:", err);
    }
  }

  // Invia notifica email al gestore con i dettagli e il fornitore di flotta
  const recipient = "info@itercars.com";
  const payload = {
    _subject: `🚙 Nuova Richiesta Noleggio (Da Modal) — ${carName}`,
    _template: "table",
    _captcha: "false",
    "Veicolo Richiesto": carName,
    "Giorni di Noleggio": days,
    "Servizi Aggiuntivi": extraPrice > 0 ? `Selezionato (+€${extraPrice})` : "Nessuno",
    "Stima Preventivo": `€ ${total}`,
    "Nome Cliente": clientName,
    "Telefono Cliente": clientPhone,
    "Email Cliente": clientEmail,
    "Fornitore Flotta": `${providerInfo.name} (${providerInfo.phone}) — ${providerInfo.website}`
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
  if (mode === 'register') {
    if (loginBox) loginBox.style.display = "none";
    if (regBox) regBox.style.display = "block";
  } else {
    if (loginBox) loginBox.style.display = "block";
    if (regBox) regBox.style.display = "none";
  }
}

async function handleLogin(event) {
  event.preventDefault();
  if (!supabase) {
    showToast("⚠️ Connessione Supabase non attiva");
    return;
  }
  const email = document.getElementById("authLoginEmail").value;
  const password = document.getElementById("authLoginPassword").value;

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    showToast("❌ Errore Login: " + error.message);
  } else {
    showToast("✨ Accesso effettuato con successo!");
    closeAuthModal();
  }
}

async function handleRegister(event) {
  event.preventDefault();
  if (!supabase) {
    showToast("⚠️ Connessione Supabase non attiva");
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
    showToast("⚠️ Le due password non corrispondono!");
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
    showToast("❌ Errore Registrazione: " + error.message);
  } else {
    showToast("🎉 Registrazione VIP completata! Benvenuto in ITERCARS.");
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

    // Se l'utente è nuovo e non ha ancora noleggi nel DB, mostriamo storico VIP di esempio senza prezzi ed emoji
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
              <i class="ri-map-pin-line"></i> Paese: <strong style="color: #fff;">${cleanCountry}</strong> (${loc}) • ${b.rental_days || 1} giorni
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
    await supabase.auth.signOut();
  }
  closeVipDashboardModal();
  showToast("👋 Disconnessione effettuata");
}

// Rendiamo le funzioni globali sul window per garantire l'accesso dagli eventi onclick HTML
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.switchAuthMode = switchAuthMode;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.openVipDashboardModal = openVipDashboardModal;
window.closeVipDashboardModal = closeVipDashboardModal;
window.handleLogout = handleLogout;

function toggleMobileMenu() {
  const navLinks = document.querySelector('.nav-links');
  const icon = document.getElementById('mobileMenuIcon');
  if (navLinks) {
    navLinks.classList.toggle('mobile-open');
    if (icon) {
      if (navLinks.classList.contains('mobile-open')) {
        icon.className = 'ri-close-line';
      } else {
        icon.className = 'ri-menu-line';
      }
    }
  }
}
window.toggleMobileMenu = toggleMobileMenu;

document.addEventListener('DOMContentLoaded', () => {
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    link.addEventListener('click', () => {
      const navLinks = document.querySelector('.nav-links');
      const icon = document.getElementById('mobileMenuIcon');
      if (navLinks && navLinks.classList.contains('mobile-open')) {
        navLinks.classList.remove('mobile-open');
        if (icon) icon.className = 'ri-menu-line';
      }
    });
  });
});

/* ==========================================================================
   CONCIERGE BOT WINDOW LOGIC
   ========================================================================== */
function toggleConciergeBot() {
  const win = document.getElementById('conciergeBotWindow');
  if (win) {
    win.classList.toggle('active');
    if (win.classList.contains('active')) {
      const input = document.getElementById('botInputText');
      if (input) setTimeout(() => input.focus(), 300);
    }
  }
}
window.toggleConciergeBot = toggleConciergeBot;

function handleBotSendMessage(event) {
  event.preventDefault();
  const input = document.getElementById('botInputText');
  if (!input || !input.value.trim()) return;
  
  const text = encodeURIComponent(`Salve ITERCARS Concierge, vi contatto dal sito: ${input.value.trim()}`);
  window.open(`https://wa.me/393755942143?text=${text}`, '_blank');
  input.value = '';
  toggleConciergeBot();
}
window.handleBotSendMessage = handleBotSendMessage;

/* ==========================================================================
   SUPPLIER / PARTNER FLEET APPLICATION SUBMIT LOGIC (FormSubmit AJAX)
   ========================================================================== */
async function handlePartnerApplicationSubmit(event) {
  event.preventDefault();
  
  const company = document.getElementById('partCompany') ? document.getElementById('partCompany').value.trim() : '';
  const referent = document.getElementById('partReferent') ? document.getElementById('partReferent').value.trim() : '';
  const email = document.getElementById('partEmail') ? document.getElementById('partEmail').value.trim() : '';
  const phone = document.getElementById('partPhone') ? document.getElementById('partPhone').value.trim() : '';
  const fleetSize = document.getElementById('partFleetSize') ? document.getElementById('partFleetSize').value : '';
  const city = document.getElementById('partCity') ? document.getElementById('partCity').value.trim() : '';
  const models = document.getElementById('partModels') ? document.getElementById('partModels').value.trim() : '';

  if (!company || !referent || !email || !phone) {
    showToast("⚠️ Compila tutti i campi obbligatori contrassegnati con l'asterisco.");
    return;
  }

  const recipient = "alessiaconese@itercars.com";

  // Visualizza notifica di caricamento all'utente
  showToast("⏳ Invio automatico all'email di Alessia Conese in corso...");

  // Salva una copia nel database Supabase se attivo per mantenere lo storico
  if (typeof supabase !== 'undefined' && supabase) {
    try {
      supabase.from('supplier_applications').insert([{
        company_name: company,
        referent_name: referent,
        email: email,
        phone: phone,
        fleet_size: fleetSize,
        city: city,
        models: models,
        recipient_email: recipient,
        status: 'new'
      }]).then(({ error }) => {
        if (error) console.warn("Log Supabase info:", error.message);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  // Chiamata automatica AJAX a FormSubmit per inviare l'email in background
  const payload = {
    _subject: `💎 Candidatura Flotta Partner — ${company}`,
    _template: "table",
    _captcha: "false",
    "Azienda / Società": company,
    "Referente": referent,
    "Email di Contatto": email,
    "Telefono / WhatsApp": phone,
    "Dimensione Flotta": `${fleetSize} supercar`,
    "Sede / Città Principale": city,
    "Modelli Proposti / Note": models || "Nessuno specificato"
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

    const result = await response.json();

    if (response.ok || result.success === "true") {
      showToast("✨ Candidatura inviata con successo all'email alessiaconese@itercars.com!");
      if (event.target && typeof event.target.reset === 'function') {
        event.target.reset();
      }
    } else {
      throw new Error(result.message || "Errore invio formsubmit");
    }
  } catch (err) {
    console.warn("Chiamata AJAX offline o bloccata, fallback elegante su mailto:", err);
    showToast("✨ Candidatura pronta! Apertura client email per alessiaconese@itercars.com...");
    const subjectText = encodeURIComponent(`Candidatura Flotta Partner — ${company}`);
    const bodyText = encodeURIComponent(
      `Gentile Alessia Conese,\n\nCandidatura flotta per ITERCARS:\n\n• Azienda: ${company}\n• Referente: ${referent}\n• Email: ${email}\n• Telefono: ${phone}\n• Flotta: ${fleetSize} veicoli\n• Sede: ${city}\n• Modelli/Note: ${models}\n`
    );
    setTimeout(() => {
      window.location.href = `mailto:${recipient}?subject=${subjectText}&body=${bodyText}`;
    }, 1000);
  }
}
window.handlePartnerApplicationSubmit = handlePartnerApplicationSubmit;

/* ==========================================================================
   AVAILABILITY REQUEST (Consulta Disponibilità) LOGIC
   ========================================================================== */
async function openAvailabilityModal(event) {
  event.preventDefault();
  
  const loc = document.getElementById('searchLocation') ? document.getElementById('searchLocation').value : '';
  const dFrom = document.getElementById('searchDateFrom') ? document.getElementById('searchDateFrom').value : '';
  const dTo = document.getElementById('searchDateTo') ? document.getElementById('searchDateTo').value : '';
  const catSelect = document.getElementById('searchCategory');
  let cat = catSelect ? catSelect.options[catSelect.selectedIndex].text : '';

  if (catSelect && catSelect.value === 'Specifico') {
    const specificSelect = document.getElementById('searchSpecificModel');
    if (specificSelect && specificSelect.value) {
      cat = specificSelect.value;
    } else {
      cat = "Modello Specifico";
    }
  }

  const displayLoc = loc || 'Qualsiasi Città / Aeroporto';
  const displayDates = dFrom && dTo ? `${dFrom} al ${dTo}` : 'Date non specificate';

  if (document.getElementById('availLuogo')) document.getElementById('availLuogo').textContent = displayLoc;
  if (document.getElementById('availDate')) document.getElementById('availDate').textContent = displayDates;
  if (document.getElementById('availCategoria')) document.getElementById('availCategoria').textContent = cat || 'Tutte le Categorie';

  if (typeof supabase !== 'undefined' && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        const user = session.user;
        const nameInput = document.getElementById('availName');
        const emailInput = document.getElementById('availEmail');
        
        if (emailInput && user.email) {
          emailInput.value = user.email;
        }
        if (nameInput && user.user_metadata && user.user_metadata.full_name) {
          nameInput.value = user.user_metadata.full_name;
        }
      }
    } catch(e) {
      console.warn("Nessun utente loggato o errore:", e.message);
    }
  }

  const modal = document.getElementById('availabilityModal');
  if (modal) modal.classList.add('active');
}

function closeAvailabilityModal() {
  const modal = document.getElementById('availabilityModal');
  if (modal) modal.classList.remove('active');
}

async function handleAvailabilitySubmit(event) {
  event.preventDefault();
  
  const name = document.getElementById('availName') ? document.getElementById('availName').value.trim() : '';
  const phone = document.getElementById('availPhone').value.trim();
  const email = document.getElementById('availEmail').value.trim();
  const notes = document.getElementById('availNotes').value.trim();
  
  const luogo = document.getElementById('availLuogo').textContent;
  const dates = document.getElementById('availDate').textContent;
  const categoria = document.getElementById('availCategoria').textContent;

  // Cache user data locally
  cacheUserData(name, email, phone);

  if (!name || !phone || !email) {
    showToast("⚠️ Compila Nome, Telefono ed Email.");
    return;
  }

  showToast("⏳ Invio richiesta di disponibilità in corso...");

  const recipient = "info@itercars.com";

  if (typeof supabase !== 'undefined' && supabase) {
    try {
      supabase.from('availability_requests').insert([{
        name: name,
        phone: phone,
        email: email,
        notes: notes,
        location: luogo,
        dates: dates,
        category: categoria,
        status: 'new'
      }]).then(({ error }) => {
         if (error) console.warn("Supabase log:", error.message);
      });
    } catch(e) { console.warn(e); }
  }

  // Risolvi il fornitore in base alla categoria o nome selezionato
  let providerInfo = {
    name: "Stefano",
    phone: "+393206144070",
    website: "https://mfitalyluxuryrent.com/"
  };
  const matchingCar = fleetData.find(c => categoria.toLowerCase().includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(categoria.toLowerCase()));
  if (matchingCar && matchingCar.provider && typeof providersData !== 'undefined') {
    providerInfo = providersData[matchingCar.provider] || providerInfo;
  }

  const payload = {
    _subject: `🚙 Nuova Richiesta Disponibilità Auto — ${categoria}`,
    _template: "table",
    _captcha: "false",
    "Luogo di Ritiro": luogo,
    "Date Richieste": dates,
    "Categoria/Modello": categoria,
    "Nome Cliente": name,
    "Telefono Cliente": phone,
    "Email Cliente": email,
    "Note Aggiuntive": notes || "Nessuna nota",
    "Fornitore Flotta": `${providerInfo.name} (${providerInfo.phone}) — ${providerInfo.website}`
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

    const result = await response.json();

    if (response.ok || result.success === "true") {
      showToast("✅ Richiesta inviata con successo! Ti contatteremo a breve.");
      closeAvailabilityModal();
      event.target.reset();
    } else {
      throw new Error(result.message || "Errore invio formsubmit");
    }
  } catch (err) {
    console.warn("Fallback su mailto:", err);
    showToast("✅ Apertura client email in corso...");
    const subjectText = encodeURIComponent(`Richiesta Disponibilità — ${categoria}`);
    const bodyText = encodeURIComponent(
      `Richiesta disponibilità da ITERCARS:\n\n• Luogo: ${luogo}\n• Date: ${dates}\n• Categoria: ${categoria}\n• Telefono: ${phone}\n• Email: ${email}\n• Note: ${notes}\n`
    );
    setTimeout(() => {
      window.location.href = `mailto:${recipient}?subject=${subjectText}&body=${bodyText}`;
      closeAvailabilityModal();
      event.target.reset();
    }, 1000);
  }
}

window.openAvailabilityModal = openAvailabilityModal;
window.closeAvailabilityModal = closeAvailabilityModal;
window.handleAvailabilitySubmit = handleAvailabilitySubmit;

/* ==========================================================================
   SPECIFIC MODEL SEARCH LOGIC
   ========================================================================== */
function setupSpecificModels() {
  const specificModelSelect = document.getElementById('searchSpecificModel');
  if (specificModelSelect && typeof fleetData !== 'undefined') {
    specificModelSelect.innerHTML = '<option value="">Seleziona un modello...</option>';
    // Sort cars alphabetically avoiding duplicates
    const uniqueCars = [];
    const map = new Map();
    for (const item of fleetData) {
        if(!map.has(item.name)){
            map.set(item.name, true);
            uniqueCars.push({
                name: item.name
            });
        }
    }
    const sortedCars = uniqueCars.sort((a, b) => a.name.localeCompare(b.name));
    
    sortedCars.forEach(car => {
      const option = document.createElement('option');
      option.value = car.name;
      option.textContent = car.name;
      specificModelSelect.appendChild(option);
    });
  }
}

function handleCategoryChange() {
  const catSelect = document.getElementById('searchCategory');
  const specificContainer = document.getElementById('specificModelContainer');
  const searchGrid = document.querySelector('.search-grid');
  
  if (catSelect && specificContainer) {
    if (catSelect.value === 'Specifico') {
      specificContainer.style.display = 'block';
      if (searchGrid) searchGrid.classList.add('has-specific');
    } else {
      specificContainer.style.display = 'none';
      if (searchGrid) searchGrid.classList.remove('has-specific');
    }
  }
}

window.handleCategoryChange = handleCategoryChange;
document.addEventListener('DOMContentLoaded', setupSpecificModels);

/* ==========================================================================
   AUTOCOMPLETE INDIRIZZI GLOBALE (PHOTON API)
   ========================================================================== */
function setupAddressAutocomplete(inputId, suggestionsId) {
  const input = document.getElementById(inputId);
  const suggestionsBox = document.getElementById(suggestionsId);
  if (!input || !suggestionsBox) return;

  let timeoutId;

  input.addEventListener('input', function() {
    clearTimeout(timeoutId);
    const query = this.value.trim();
    
    if (query.length < 3) {
      suggestionsBox.style.display = 'none';
      return;
    }

    timeoutId = setTimeout(() => {
      fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`)
        .then(response => response.json())
        .then(data => {
          suggestionsBox.innerHTML = '';
          if (data.features && data.features.length > 0) {
            data.features.forEach(feature => {
              const props = feature.properties;
              const mainText = props.name || props.city || props.state;
              if (!mainText) return;
              
              const addressParts = [];
              if (props.city && props.city !== mainText) addressParts.push(props.city);
              if (props.state && props.state !== mainText) addressParts.push(props.state);
              if (props.country) addressParts.push(props.country);
              const secondaryText = addressParts.join(', ');

              const li = document.createElement('li');
              li.innerHTML = `<strong>${mainText}</strong>${secondaryText ? `<span class="suggestion-secondary">${secondaryText}</span>` : ''}`;
              
              li.addEventListener('click', () => {
                input.value = `${mainText}${secondaryText ? ', ' + secondaryText : ''}`;
                suggestionsBox.style.display = 'none';
              });
              
              suggestionsBox.appendChild(li);
            });
            suggestionsBox.style.display = 'block';
          } else {
            suggestionsBox.style.display = 'none';
          }
        })
        .catch(err => {
          console.error("Autocomplete error:", err);
          suggestionsBox.style.display = 'none';
        });
    }, 300); // debounce 300ms
  });

  // Chiudi i suggerimenti se si clicca fuori
  document.addEventListener('click', function(e) {
    if (e.target !== input && e.target !== suggestionsBox) {
      suggestionsBox.style.display = 'none';
    }
  });
}

/* ==========================================================================
   USER DATA AUTOFILL & CACHING
   ========================================================================== */
function cacheUserData(name, email, phone) {
  if (name) localStorage.setItem('itercars_user_name', name);
  if (email) localStorage.setItem('itercars_user_email', email);
  if (phone) localStorage.setItem('itercars_user_phone', phone);
}

async function prefillUserDataForms() {
  let userData = {
    name: localStorage.getItem('itercars_user_name') || '',
    email: localStorage.getItem('itercars_user_email') || '',
    phone: localStorage.getItem('itercars_user_phone') || ''
  };

  if (typeof supabase !== 'undefined' && supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        const user = session.user;
        if (user.email) userData.email = user.email;
        if (user.user_metadata && user.user_metadata.full_name) userData.name = user.user_metadata.full_name;
        if (user.phone || (user.user_metadata && user.user_metadata.phone)) userData.phone = user.phone || user.user_metadata.phone;
      }
    } catch(e) {}
  }

  const availName = document.getElementById('availName');
  const availEmail = document.getElementById('availEmail');
  const availPhone = document.getElementById('availPhone');
  if (availName && !availName.value) availName.value = userData.name;
  if (availEmail && !availEmail.value) availEmail.value = userData.email;
  if (availPhone && !availPhone.value) availPhone.value = userData.phone;

  const clientName = document.getElementById('clientNameInput');
  const clientEmail = document.getElementById('clientEmailInput');
  const clientPhone = document.getElementById('clientPhoneInput');
  if (clientName && !clientName.value) clientName.value = userData.name;
  if (clientEmail && !clientEmail.value) clientEmail.value = userData.email;
  if (clientPhone && !clientPhone.value) clientPhone.value = userData.phone;

  const detailName = document.getElementById('detailName');
  const detailEmail = document.getElementById('detailEmail');
  const detailPhone = document.getElementById('detailPhone');
  if (detailName && !detailName.value) detailName.value = userData.name;
  if (detailEmail && !detailEmail.value) detailEmail.value = userData.email;
  if (detailPhone && !detailPhone.value) detailPhone.value = userData.phone;
}

document.addEventListener('DOMContentLoaded', () => {
  setupAddressAutocomplete('searchLocation', 'searchLocationSuggestions');
  setupAddressAutocomplete('detailLocation', 'detailLocationSuggestions');
  
  prefillUserDataForms();

  // Handle Logo Animation Switch
  const logoContainer = document.getElementById("navbarLogoContainer");
  if (logoContainer) {
    setTimeout(() => {
      logoContainer.classList.remove("logo-animating");
      logoContainer.classList.add("logo-idle");
    }, 1200); // Wait for logoSlideIn animation to finish
  }

  // Inizializzazione per fleet.html
  if (window.location.pathname.includes('fleet.html')) {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category') || 'Tutti';
    filterFleetPage(category);
  }
});


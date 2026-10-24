(function() {
"use strict";

/* --- MOCK DATA --- */
/**
 * Mock Data for Padel Club Low-Fidelity Interactive Wireframe
 */

const CLUB_INFO = {
  name: "The Padel Club",
  tagline: "Your local community padel destination",
  address: "14 Padel Way, Riverside District, SW18 4XQ",
  phone: "+44 20 7946 0912",
  whatsapp: "+44 7700 900821",
  email: "hello@thepadelclub-wireframe.local",
  hours: [
    { days: "Monday – Friday", time: "07:00 – 23:00" },
    { days: "Saturday – Sunday", time: "07:30 – 22:30" },
    { days: "Public Holidays", time: "08:00 – 22:00" }
  ],
  pricingSummary: {
    offPeak60: 36,
    offPeak90: 50,
    peak60: 48,
    peak90: 68,
    racketRental: 4,
    ballsIncluded: "Free premium balls with court hire"
  }
};

const COURTS = [
  {
    id: "court-1",
    name: "Court 1 (Indoor Panoramic)",
    type: "Indoor",
    surface: "Mondo Supercourt XN (World Padel Tour Spec)",
    features: "Full climate control, 10m ceiling clearance, LED competition lighting",
    badge: "Air-Conditioned"
  },
  {
    id: "court-2",
    name: "Court 2 (Indoor Panoramic)",
    type: "Indoor",
    surface: "Mondo Supercourt XN (World Padel Tour Spec)",
    features: "Full climate control, video replay replay camera, LED lighting",
    badge: "Air-Conditioned"
  },
  {
    id: "court-3",
    name: "Court 3 (Canopy Covered)",
    type: "Outdoor Covered",
    surface: "All-weather anti-glare artificial turf",
    features: "High-arch translucent rain canopy, open-air fresh breeze, night lights",
    badge: "Weather-Protected"
  },
  {
    id: "court-4",
    name: "Court 4 (Canopy Covered)",
    type: "Outdoor Covered",
    surface: "All-weather anti-glare artificial turf",
    features: "High-arch translucent rain canopy, side wind break screens, night lights",
    badge: "Weather-Protected"
  }
];

// Generate next 7 days starting today
function getAvailableDates() {
  const dates = [];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    
    const dayName = i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-GB", { weekday: "short" });
    const formatted = d.toISOString().split("T")[0];
    const displayDate = d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    const fullDisplay = d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;

    dates.push({
      iso: formatted,
      dayName,
      displayDate,
      fullDisplay,
      isWeekend,
      dayIndex: i
    });
  }
  return dates;
}

// Generate realistic slot schedule for a given date and court
function generateSlotsForDate(dateIso, courtId = "all", durationMinutes = 60) {
  // Morning (07:00-12:00), Afternoon (12:00-17:00), Evening (17:00-22:30)
  const isWeekend = new Date(dateIso).getDay() === 0 || new Date(dateIso).getDay() === 6;

  const baseTimes = durationMinutes === 60 ? [
    { time: "07:00", period: "Morning", isPeak: false },
    { time: "08:00", period: "Morning", isPeak: false },
    { time: "09:00", period: "Morning", isPeak: false },
    { time: "10:00", period: "Morning", isPeak: false },
    { time: "11:00", period: "Morning", isPeak: false },
    { time: "12:00", period: "Afternoon", isPeak: false },
    { time: "13:00", period: "Afternoon", isPeak: false },
    { time: "14:00", period: "Afternoon", isPeak: false },
    { time: "15:00", period: "Afternoon", isPeak: false },
    { time: "16:00", period: "Afternoon", isPeak: false },
    { time: "17:00", period: "Evening", isPeak: true },
    { time: "18:00", period: "Evening", isPeak: true },
    { time: "19:00", period: "Evening", isPeak: true },
    { time: "20:00", period: "Evening", isPeak: true },
    { time: "21:00", period: "Evening", isPeak: true },
    { time: "22:00", period: "Evening", isPeak: false }
  ] : [
    { time: "07:30", period: "Morning", isPeak: false },
    { time: "09:00", period: "Morning", isPeak: false },
    { time: "10:30", period: "Morning", isPeak: false },
    { time: "12:00", period: "Afternoon", isPeak: false },
    { time: "13:30", period: "Afternoon", isPeak: false },
    { time: "15:00", period: "Afternoon", isPeak: false },
    { time: "16:30", period: "Afternoon", isPeak: true },
    { time: "18:00", period: "Evening", isPeak: true },
    { time: "19:30", period: "Evening", isPeak: true },
    { time: "21:00", period: "Evening", isPeak: true }
  ];

  return baseTimes.map((slot, index) => {
    // Deterministic mock booked status based on string hash
    const hash = (dateIso.charCodeAt(dateIso.length - 1) * (index + 3)) % 10;
    const isPeakTime = isWeekend || slot.isPeak;
    const price = durationMinutes === 60 
      ? (isPeakTime ? CLUB_INFO.pricingSummary.peak60 : CLUB_INFO.pricingSummary.offPeak60)
      : (isPeakTime ? CLUB_INFO.pricingSummary.peak90 : CLUB_INFO.pricingSummary.offPeak90);
    
    // Some popular evening/weekend slots are booked
    const isBooked = (isPeakTime && hash > 4) || hash === 1;

    return {
      id: `slot-${dateIso}-${slot.time.replace(":", "")}`,
      time: slot.time,
      period: slot.period,
      duration: durationMinutes,
      price,
      splitPrice: (price / 4).toFixed(2),
      isPeak: isPeakTime,
      isBooked,
      courtAssigned: courtId === "all" ? (index % 2 === 0 ? "Court 1 (Indoor)" : "Court 3 (Canopy)") : courtId
    };
  });
}

const OPEN_MATCHES = [
  {
    id: "match-101",
    host: "Marcus V.",
    hostLevel: "Intermediate (Rating 3.0)",
    dateDisplay: "Tomorrow, 18:30 - 20:00",
    courtName: "Court 1 (Indoor)",
    skillLevel: "Intermediate",
    levelRange: "Level 2.5 - 3.5",
    format: "Open Doubles Match (Friendly / Competitive)",
    currentPlayers: 2,
    maxPlayers: 4,
    costPerPlayer: 17,
    notes: "Regular rally pace. Looking for 2 more players to complete a friendly 4-player set.",
    status: "Looking for 2 players"
  },
  {
    id: "match-102",
    host: "Sara K.",
    hostLevel: "Beginner (Rating 1.5)",
    dateDisplay: "This Friday, 10:00 - 11:30",
    courtName: "Court 3 (Covered Canopy)",
    skillLevel: "Beginner",
    levelRange: "Level 1.0 - 2.0 (New & Casual)",
    format: "Beginner Practice Match",
    currentPlayers: 1,
    maxPlayers: 4,
    costPerPlayer: 12.50,
    notes: "I recently did the intro clinic! Looking for other beginners to practice serving and wall bounces.",
    status: "Looking for 3 players"
  },
  {
    id: "match-103",
    host: "Dave & Liam",
    hostLevel: "Advanced (Rating 4.5)",
    dateDisplay: "Saturday, 17:00 - 18:30",
    courtName: "Court 2 (Indoor)",
    skillLevel: "Advanced",
    levelRange: "Level 4.0 - 5.0 (High Pace)",
    format: "Competitive Doubles Match",
    currentPlayers: 3,
    maxPlayers: 4,
    costPerPlayer: 17,
    notes: "Need 1 strong player for fast-paced match with bandeja and vibora drills. 4th spot open!",
    status: "Only 1 spot remaining!"
  },
  {
    id: "match-104",
    host: "Elena R.",
    hostLevel: "Beginner / Intermediate (Rating 2.5)",
    dateDisplay: "Sunday, 11:30 - 13:00",
    courtName: "Court 4 (Covered Canopy)",
    skillLevel: "Beginner",
    levelRange: "Level 2.0 - 3.0",
    format: "Casual Mixed Doubles",
    currentPlayers: 2,
    maxPlayers: 4,
    costPerPlayer: 12.50,
    notes: "Relaxed Sunday game followed by coffee at the club lounge. All welcome!",
    status: "Looking for 2 players"
  }
];

const COACHING_CLASSES = [
  {
    id: "class-intro",
    title: "Intro to Padel Clinic",
    category: "Beginner Friendly",
    tagline: "The fastest way to learn padel rules, glass wall basics, and score keeping.",
    format: "Small Group (Max 4 players)",
    duration: "60 minutes",
    schedule: "Every Saturday 10:00 & Wednesday 18:00",
    price: 18,
    priceNote: "per person (Includes racket rental & coaching)",
    highlights: [
      "Master the underhand serve & court positioning",
      "How to read rebounds off the glass walls",
      "Basic forehand, backhand, and lob shots",
      "Guided 20-min mini-game at the end"
    ],
    idealFor: "First-timers, tennis/squash players new to padel, beginners"
  },
  {
    id: "class-group",
    title: "Tactical Group Drills & Play",
    category: "Intermediate",
    tagline: "Improve your bandeja, vibora, and court transitions with coached drills.",
    format: "Medium Group (4–6 players across 2 courts)",
    duration: "90 minutes",
    schedule: "Tuesday & Thursday 19:00 - 20:30",
    price: 24,
    priceNote: "per person",
    highlights: [
      "Defending the glass: deep balls and corner turns",
      "The Bandeja & Vibora: overhead shot selection",
      "Net transitions, volleys, and communication",
      "Conditioned points under coach feedback"
    ],
    idealFor: "Players with 10+ games who want tactical consistency"
  },
  {
    id: "class-private",
    title: "1-on-1 / 1-on-2 Private Coaching",
    category: "All Levels",
    tagline: "Personalized technical coaching tailored to your exact game needs.",
    format: "Private (1 player or 2 players sharing)",
    duration: "60 minutes",
    schedule: "Flexible booking (Mon–Sun upon inquiry)",
    price: 55,
    priceNote: "per session (or £65 for 2 players sharing)",
    highlights: [
      "High-speed video slow-motion analysis",
      "Custom technical adjustments (grip, footwork, follow-through)",
      "Targeted ball-machine & basket feeding drills",
      "Personalized development road-map"
    ],
    idealFor: "Players seeking accelerated improvement and technical refinement"
  },
  {
    id: "class-junior",
    title: "Junior Padel Academy",
    category: "Youth (Ages 7–16)",
    tagline: "Fun, engaging padel fundamentals, hand-eye coordination, and junior matches.",
    format: "Group divided by age bracket",
    duration: "75 minutes",
    schedule: "Sunday 09:30 - 10:45",
    price: 15,
    priceNote: "per junior (all equipment provided)",
    highlights: [
      "Agility, balance, and racquet coordination games",
      "Sportsmanship and doubles teamwork",
      "End-of-term friendly junior tournament",
      "Fully DBS certified, LTA accredited coaches"
    ],
    idealFor: "Kids and teens looking for an exciting new racket sport"
  }
];

const COACHES = [
  {
    id: "coach-carlos",
    name: "Carlos Mendez",
    role: "Head Padel Coach",
    credentials: "LTA Padel Level 3 Accredited / ex-Spanish FEP Pro",
    experience: "12 years coaching in Madrid & London",
    bio: "Passionate about building solid technical fundamentals from day one. Carlos has coached beginner players through to competitive tournament champions."
  },
  {
    id: "coach-emma",
    name: "Emma Davies",
    role: "Senior Coach & Beginner Lead",
    credentials: "LTA Padel Level 2 Coach / Racket Sports Science BSc",
    experience: "5 years dedicated padel coaching",
    bio: "Emma specializes in welcoming first-timers, teaching wall-play confidence, and leading our vibrant weekly social clinics."
  },
  {
    id: "coach-marco",
    name: "Marco Silva",
    role: "Youth & Fitness Specialist",
    credentials: "LTA Padel Level 2 / Youth Physical Development Coach",
    experience: "6 years junior coaching",
    bio: "Marco directs the Junior Academy and brings infectious energy, focus on movement mechanics, and tactical agility."
  }
];

const CLUB_FACILITIES = [
  {
    id: "fac-courts",
    name: "4 Panoramic Glass Courts",
    desc: "2 fully climate-controlled indoor courts with 10-meter clearance + 2 weather-canopy covered courts for year-round play."
  },
  {
    id: "fac-shop",
    name: "Pro Shop & Equipment Hire",
    desc: "Premium Bullpadel, Nox, and Babolat demo rackets available to test. Racket hire £4, new balls, grip replacement and accessories."
  },
  {
    id: "fac-lounge",
    name: "Social Cafe & Viewing Lounge",
    desc: "Barista specialty coffee, cold drinks, protein smoothies, craft beers, and court-side spectator viewing seating."
  },
  {
    id: "fac-amenities",
    name: "Modern Changing Rooms & Showers",
    desc: "Spacious individual showers, lockers, hair dryers, towels for hire, and accessible facilities."
  },
  {
    id: "fac-parking",
    name: "Free On-Site Parking & Bike Racks",
    desc: "28 dedicated complimentary parking bays with 2 EV charging points, plus secure covered bicycle parking."
  }
];


/* --- STATE --- */
/**
 * Application State Manager for Padel Club Wireframe Prototype
 */



const initialDates = getAvailableDates();

const state = {
  // Navigation
  currentPage: 'home', // 'home' | 'play' | 'find-player' | 'new-to-padel' | 'classes' | 'club'
  
  // UX Tools
  showAnnotations: true,
  deviceMode: 'desktop', // 'desktop' | 'mobile-preview'

  // Booking Flow State
  booking: {
    dates: initialDates,
    selectedDateIso: initialDates[0].iso,
    selectedCourtFilter: 'all', // 'all' | 'indoor' | 'canopy'
    selectedDuration: 60,       // 60 | 90
    selectedSlot: null,         // { id, time, price, courtAssigned, isPeak, duration }
    racketsHired: 0,            // 0 - 4 (£4 each)
    ballsTubes: 0,              // 0 - 2 (£3 each)
    guestDetails: {
      name: '',
      phone: '',
      email: '',
      playerCount: 4,
      notes: ''
    },
    confirmedBooking: null
  },

  // Find a Player State
  findPlayer: {
    activeTab: 'browse', // 'browse' | 'create'
    matches: [...OPEN_MATCHES],
    selectedMatchToJoin: null,
    myMatchRequest: null,
    simulatedStatus: 'pending' // 'pending' | 'matched' | 'refunded'
  },

  // Classes State
  classes: {
    selectedClass: null,
    inquirySubmitted: false
  },

  // Active Modal Dialog
  modal: null // null | 'booking-modal' | 'booking-success' | 'join-match-modal' | 'create-match-success' | 'class-inquiry-modal' | 'sitemap-modal'
};

// Simple event subscriber for state changes
const listeners = [];

function subscribe(callback) {
  listeners.push(callback);
}

function notify() {
  listeners.forEach(fn => fn(state));
}

function setPage(pageName) {
  state.currentPage = pageName;
  window.scrollTo({ top: 0, behavior: 'smooth' });
  notify();
}

function toggleAnnotations() {
  state.showAnnotations = !state.showAnnotations;
  document.body.classList.toggle('show-annotations', state.showAnnotations);
  notify();
}

function openModal(modalId) {
  state.modal = modalId;
  notify();
}

function closeModal() {
  state.modal = null;
  notify();
}

function resetPrototype() {
  state.currentPage = 'home';
  state.booking.selectedDateIso = initialDates[0].iso;
  state.booking.selectedCourtFilter = 'all';
  state.booking.selectedDuration = 60;
  state.booking.selectedSlot = null;
  state.booking.racketsHired = 0;
  state.booking.ballsTubes = 0;
  state.booking.confirmedBooking = null;
  state.findPlayer.matches = [...OPEN_MATCHES];
  state.findPlayer.selectedMatchToJoin = null;
  state.findPlayer.myMatchRequest = null;
  state.findPlayer.simulatedStatus = 'pending';
  state.classes.selectedClass = null;
  state.classes.inquirySubmitted = false;
  state.modal = null;
  notify();
}


/* --- APP LOGIC --- */
/**
 * Main Application Logic & Wireframe Prototype Controller
 */





// DOM Element references
const appContainer = document.getElementById('app-root');
const modalContainer = document.getElementById('modal-root');

/**
 * Main Render Dispatcher
 */
function render() {
  // Update review bar active page dropdown
  const pageSelect = document.getElementById('page-selector');
  if (pageSelect && pageSelect.value !== state.currentPage) {
    pageSelect.value = state.currentPage;
  }

  // Update navigation links
  document.querySelectorAll('.wf-nav-link').forEach(link => {
    const page = link.getAttribute('data-page');
    if (page === state.currentPage) {
      link.classList.add('is-active');
    } else {
      link.classList.remove('is-active');
    }
  });

  // Render current view
  let pageHtml = '';
  switch (state.currentPage) {
    case 'home':
      pageHtml = renderHomePage();
      break;
    case 'play':
      pageHtml = renderPlayPage();
      break;
    case 'find-player':
      pageHtml = renderFindPlayerPage();
      break;
    case 'new-to-padel':
      pageHtml = renderNewToPadelPage();
      break;
    case 'classes':
      pageHtml = renderClassesPage();
      break;
    case 'club':
      pageHtml = renderClubPage();
      break;
    default:
      pageHtml = renderHomePage();
  }

  appContainer.innerHTML = pageHtml;

  // Render Modal if any
  renderModal();

  // Attach dynamic event handlers for the newly rendered DOM
  attachPageEvents();
}

/**
 * HOMEPAGE VIEW
 */
function renderHomePage() {
  return `
    <!-- UX Annotation Note for Hero -->
    <div class="wf-container">
      <div class="wf-note-callout">
        <div class="wf-note-callout-title">
          <span>[UX Note: Homepage Structure & Conversion Goal]</span>
        </div>
        The homepage is designed to serve two primary audiences immediately: regular players who want to book a court in < 3 clicks, and beginners who need to understand padel before committing. No heavy signups or app downloads required.
      </div>
    </div>

    <!-- Hero Section -->
    <section class="wf-hero">
      <div class="wf-container">
        <div class="wf-hero-grid">
          <div>
            <div class="wf-hero-eyebrow">
              <span class="wf-badge wf-badge-dark">South West London</span>
              <span class="wf-badge">4 Panoramic Courts</span>
              <span class="wf-badge">Open 7 Days</span>
            </div>
            <h1 class="wf-hero-title">Experience the Joy of Padel in Your Community</h1>
            <p class="wf-hero-lead">
              London's friendliest local padel club. 4 panoramic glass courts, beginner intro clinics, gear rental, and match matching for solo players.
            </p>
            <div class="wf-hero-actions">
              <button class="wf-btn wf-btn-primary wf-btn-lg" data-action="go-page" data-target="play">
                Book a Court
                <span aria-hidden="true">→</span>
              </button>
              <button class="wf-btn wf-btn-secondary wf-btn-lg" data-action="go-page" data-target="find-player">
                Find a Player to Play With
              </button>
            </div>
            <div class="wf-hero-meta">
              <div class="wf-hero-meta-item">
                <strong>✓</strong> No membership required
              </div>
              <div class="wf-hero-meta-item">
                <strong>✓</strong> Racket hire at reception
              </div>
              <div class="wf-hero-meta-item">
                <strong>✓</strong> Free ball tubes included
              </div>
            </div>
          </div>
          <div>
            <div class="wf-img-box wf-ratio-4-3" style="min-height: 280px;">
              <div class="wf-img-box-content">
                [ Wireframe Illustration: Panoramic Glass Court with 4 Players in Action ]
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Booking Bar -->
    <section class="wf-container">
      <div class="wf-quick-book-box">
        <div class="wf-quick-book-title">
          <span>Quick Court Check</span>
          <span class="wf-badge wf-badge-outline">Instant Availability Preview</span>
        </div>
        <div class="wf-quick-book-grid">
          <div class="wf-form-group" style="margin-bottom: 0;">
            <label class="wf-label">Select Date</label>
            <select class="wf-select" id="quick-date-select">
              ${state.booking.dates.map(d => `
                <option value="${d.iso}" ${d.iso === state.booking.selectedDateIso ? 'selected' : ''}>
                  ${d.dayName} (${d.displayDate})
                </option>
              `).join('')}
            </select>
          </div>
          <div class="wf-form-group" style="margin-bottom: 0;">
            <label class="wf-label">Court Preference</label>
            <select class="wf-select" id="quick-court-select">
              <option value="all">Any Court (Indoor or Canopy)</option>
              <option value="indoor">Indoor (Air-Conditioned)</option>
              <option value="canopy">Covered Outdoor Canopy</option>
            </select>
          </div>
          <div class="wf-form-group" style="margin-bottom: 0;">
            <label class="wf-label">Duration</label>
            <select class="wf-select" id="quick-duration-select">
              <option value="60">60 Minutes</option>
              <option value="90">90 Minutes (Recommended for Doubles)</option>
            </select>
          </div>
          <div>
            <button class="wf-btn wf-btn-primary wf-btn-block" id="quick-book-submit-btn">
              Check Available Slots →
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Playing Options Overview -->
    <section class="wf-section">
      <div class="wf-container">
        <div class="wf-section-header">
          <div class="wf-section-tag">Play at The Club</div>
          <h2 class="wf-section-title">Three Ways to Get on Court</h2>
          <p class="wf-section-subtitle">
            Whether you have a full group of 4, you are flying solo, or you want to sharpen your technique, we have an option for you.
          </p>
        </div>

        <div class="wf-options-grid">
          <!-- Option 1: Court Booking -->
          <div class="wf-card wf-option-card">
            <div class="wf-img-box wf-ratio-16-9">
              <div class="wf-img-box-content">[ Wireframe: Court Hire ]</div>
            </div>
            <div class="wf-option-card-body">
              <div class="wf-badge wf-badge-dark" style="margin-bottom: 8px;">Most Popular</div>
              <h3 class="wf-option-card-title">Book a Court</h3>
              <p class="wf-option-card-desc">
                Rent one of our 4 tournament-grade courts for 60 or 90 minutes. Split the cost easily with your 3 playing partners.
              </p>
              <ul class="wf-option-features">
                <li><span>•</span> From £36 / hr (£9 per person)</li>
                <li><span>•</span> Choose Indoor AC or Covered Canopy</li>
                <li><span>•</span> Free cancellation up to 12h before</li>
              </ul>
            </div>
            <button class="wf-btn wf-btn-primary wf-btn-block" data-action="go-page" data-target="play">
              View Court Calendar →
            </button>
          </div>

          <!-- Option 2: Find a Player -->
          <div class="wf-card wf-option-card">
            <div class="wf-img-box wf-ratio-16-9">
              <div class="wf-img-box-content">[ Wireframe: Player Matchmaking ]</div>
            </div>
            <div class="wf-option-card-body">
              <div class="wf-badge" style="margin-bottom: 8px;">Solo & Pairs</div>
              <h3 class="wf-option-card-title">Find a Player</h3>
              <p class="wf-option-card-desc">
                Don't have enough players? Join an open match or post your own. Minimum 2 players to play, with guaranteed automatic refunds.
              </p>
              <ul class="wf-option-features">
                <li><span>•</span> Join open games by skill level</li>
                <li><span>•</span> Guaranteed refund if no match is formed</li>
                <li><span>•</span> Meet other local club players</li>
              </ul>
            </div>
            <button class="wf-btn wf-btn-secondary wf-btn-block" data-action="go-page" data-target="find-player">
              Browse Open Games →
            </button>
          </div>

          <!-- Option 3: Classes & Coaching -->
          <div class="wf-card wf-option-card">
            <div class="wf-img-box wf-ratio-16-9">
              <div class="wf-img-box-content">[ Wireframe: Coaching Clinic ]</div>
            </div>
            <div class="wf-option-card-body">
              <div class="wf-badge" style="margin-bottom: 8px;">All Skill Levels</div>
              <h3 class="wf-option-card-title">Classes & Coaching</h3>
              <p class="wf-option-card-desc">
                Learn wall defense, positioning, and overhead shots with LTA certified coaches in beginner clinics or private 1-on-1s.
              </p>
              <ul class="wf-option-features">
                <li><span>•</span> Beginner intro clinics from £18</li>
                <li><span>•</span> 1-on-1 private technical coaching</li>
                <li><span>•</span> Youth academy for kids & teens</li>
              </ul>
            </div>
            <button class="wf-btn wf-btn-secondary wf-btn-block" data-action="go-page" data-target="classes">
              Explore Coaching →
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Beginner Section Preview -->
    <section class="wf-section wf-section-muted">
      <div class="wf-container">
        <div class="wf-beginner-box">
          <div class="wf-section-tag">New to Padel?</div>
          <h2 class="wf-section-title">The World's Fastest Growing Sport is Easy to Learn</h2>
          <p class="wf-section-subtitle">
            Think tennis meets squash. It's played in doubles on an enclosed glass court, using solid rackets. You can pick up the fundamentals in your first 15 minutes.
          </p>

          <div class="wf-beginner-steps">
            <div class="wf-step-card">
              <div class="wf-step-num">Step 01</div>
              <h4 class="wf-step-title">No Equipment Needed</h4>
              <p class="wf-step-desc">
                Don't own a padel racket? Simply rent one for £4 at our pro desk. Balls are always provided complimentary.
              </p>
            </div>
            <div class="wf-step-card">
              <div class="wf-step-num">Step 02</div>
              <h4 class="wf-step-title">Join a Saturday Clinic</h4>
              <p class="wf-step-desc">
                Our 60-minute "Intro to Padel" group clinics walk you through rules, court etiquette, and glass wall rebounds.
              </p>
            </div>
            <div class="wf-step-card">
              <div class="wf-step-num">Step 03</div>
              <h4 class="wf-step-title">Start Playing Games</h4>
              <p class="wf-step-desc">
                Jump into beginner-friendly open matches or book an off-peak court with colleagues or friends.
              </p>
            </div>
          </div>

          <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
            <button class="wf-btn wf-btn-primary" data-action="go-page" data-target="new-to-padel">
              Read the Beginner's Guide →
            </button>
            <button class="wf-btn wf-btn-secondary" data-action="go-page" data-target="classes">
              Book Saturday Intro Clinic (£18)
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Facilities Preview -->
    <section class="wf-section">
      <div class="wf-container">
        <div class="wf-section-header">
          <div class="wf-section-tag">Facilities & Atmosphere</div>
          <h2 class="wf-section-title">Built for Great Games and Social Connection</h2>
          <p class="wf-section-subtitle">
            A welcoming community hub featuring high-spec courts, comfortable social lounge, and hassle-free parking.
          </p>
        </div>

        <div class="wf-facilities-grid">
          ${CLUB_FACILITIES.map(f => `
            <div class="wf-facility-item">
              <div class="wf-facility-name">✓ ${f.name}</div>
              <div class="wf-facility-desc">${f.desc}</div>
            </div>
          `).join('')}
        </div>

        <div style="margin-top: var(--space-6); text-align: center;">
          <button class="wf-btn wf-btn-outline" data-action="go-page" data-target="club">
            View Court Photos & Club Tour →
          </button>
        </div>
      </div>
    </section>

    <!-- Location & Contact Banner -->
    <section class="wf-section wf-section-muted">
      <div class="wf-container">
        <div class="wf-contact-banner">
          <div>
            <div class="wf-section-tag">Find & Contact Us</div>
            <h3 style="font-size: var(--text-xl); font-weight: 700; margin-bottom: var(--space-2);">
              ${CLUB_INFO.name}
            </h3>
            <p style="font-size: var(--text-sm); color: var(--wf-text-secondary); margin-bottom: var(--space-4);">
              📍 ${CLUB_INFO.address}<br>
              🕒 Open Daily from 07:00 – 23:00 (Floodlit until close)
            </p>
            <p style="font-size: var(--text-xs); color: var(--wf-text-muted); margin-bottom: var(--space-4);">
              Questions about private events, court hire, or racket demos? Chat with our team directly.
            </p>
            <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
              <a href="https://wa.me/447700900821" target="_blank" class="wf-btn wf-btn-primary wf-btn-sm">
                💬 WhatsApp Us (${CLUB_INFO.whatsapp})
              </a>
              <button class="wf-btn wf-btn-secondary wf-btn-sm" data-action="go-page" data-target="club">
                Directions & Parking Details
              </button>
            </div>
          </div>
          <div>
            <div class="wf-img-box wf-ratio-16-9">
              <div class="wf-img-box-content">
                [ Interactive Map Placeholder: Riverside District, 5-min walk from Tube ]
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

/**
 * PLAY / COURT BOOKING VIEW
 */
function renderPlayPage() {
  const selectedDate = state.booking.dates.find(d => d.iso === state.booking.selectedDateIso) || state.booking.dates[0];
  const allSlots = generateSlotsForDate(state.booking.selectedDateIso, state.booking.selectedCourtFilter, state.booking.selectedDuration);

  // Group slots by period
  const morningSlots = allSlots.filter(s => s.period === 'Morning');
  const afternoonSlots = allSlots.filter(s => s.period === 'Afternoon');
  const eveningSlots = allSlots.filter(s => s.period === 'Evening');

  // Selected slot & pricing
  const sel = state.booking.selectedSlot;
  const courtBasePrice = sel ? sel.price : (state.booking.selectedDuration === 60 ? 36 : 50);
  const racketCost = state.booking.racketsHired * 4;
  const ballCost = state.booking.ballsTubes * 3;
  const totalCost = sel ? (courtBasePrice + racketCost + ballCost) : 0;
  const splitCost = totalCost > 0 ? (totalCost / 4).toFixed(2) : '0.00';

  return `
    <div class="wf-container" style="padding-top: var(--space-6); padding-bottom: var(--space-12);">
      
      <!-- UX Annotation -->
      <div class="wf-note-callout">
        <div class="wf-note-callout-title">
          <span>[UX Note: Court Booking Architecture]</span>
        </div>
        1. Low-friction guest booking without password fatigue.<br>
        2. Real-time pricing clarity: total court hire + split-per-player indicator (£/person) solves the primary cognitive load of padel booking.<br>
        3. Clear distinction between Peak and Off-peak pricing.
      </div>

      <!-- Page Header -->
      <div style="margin-bottom: var(--space-6);">
        <div class="wf-badge wf-badge-dark" style="margin-bottom: var(--space-2);">Step 1 of 2: Select Date & Slot</div>
        <h1 class="wf-section-title">Book a Court</h1>
        <p class="wf-section-subtitle">
          Select your date and preferred court. You can add equipment hire before confirming.
        </p>
      </div>

      <!-- Horizontal Date Picker Strip -->
      <div class="wf-date-strip">
        ${state.booking.dates.map(d => `
          <div class="wf-date-pill ${d.iso === state.booking.selectedDateIso ? 'is-active' : ''}" 
               data-action="select-date" data-iso="${d.iso}">
            <div class="wf-date-pill-day">${d.dayName}</div>
            <div class="wf-date-pill-num">${d.displayDate}</div>
          </div>
        `).join('')}
      </div>

      <!-- Filters & Duration Controls -->
      <div class="wf-filters-bar">
        <div class="wf-filter-group">
          <span class="wf-filter-label">Court:</span>
          <div class="wf-toggle-group">
            <button class="wf-toggle-option ${state.booking.selectedCourtFilter === 'all' ? 'is-active' : ''}" 
                    data-action="filter-court" data-court="all">
              All Courts (4)
            </button>
            <button class="wf-toggle-option ${state.booking.selectedCourtFilter === 'indoor' ? 'is-active' : ''}" 
                    data-action="filter-court" data-court="indoor">
              Indoor AC (2)
            </button>
            <button class="wf-toggle-option ${state.booking.selectedCourtFilter === 'canopy' ? 'is-active' : ''}" 
                    data-action="filter-court" data-court="canopy">
              Covered Canopy (2)
            </button>
          </div>
        </div>

        <div class="wf-filter-group">
          <span class="wf-filter-label">Duration:</span>
          <div class="wf-toggle-group">
            <button class="wf-toggle-option ${state.booking.selectedDuration === 60 ? 'is-active' : ''}" 
                    data-action="filter-duration" data-duration="60">
              60 Min
            </button>
            <button class="wf-toggle-option ${state.booking.selectedDuration === 90 ? 'is-active' : ''}" 
                    data-action="filter-duration" data-duration="90">
              90 Min (Recommended)
            </button>
          </div>
        </div>
      </div>

      <!-- Main Layout: Slots Grid + Sticky Booking Summary -->
      <div class="wf-booking-layout">
        
        <!-- Slots Column -->
        <div>
          <!-- Morning -->
          <div class="wf-period-block">
            <div class="wf-period-header">
              <span class="wf-period-title">🌅 Morning (07:00 – 12:00)</span>
              <span class="wf-badge">Off-Peak Rates</span>
            </div>
            <div class="wf-slots-grid">
              ${renderSlotButtons(morningSlots)}
            </div>
          </div>

          <!-- Afternoon -->
          <div class="wf-period-block">
            <div class="wf-period-header">
              <span class="wf-period-title">☀️ Afternoon (12:00 – 17:00)</span>
              <span class="wf-badge">Standard Rates</span>
            </div>
            <div class="wf-slots-grid">
              ${renderSlotButtons(afternoonSlots)}
            </div>
          </div>

          <!-- Evening -->
          <div class="wf-period-block">
            <div class="wf-period-header">
              <span class="wf-period-title">🌙 Evening & Floodlights (17:00 – 22:30)</span>
              <span class="wf-badge wf-badge-dark">Peak Hours</span>
            </div>
            <div class="wf-slots-grid">
              ${renderSlotButtons(eveningSlots)}
            </div>
          </div>

          <!-- Legend & Notice -->
          <div class="wf-alert" style="margin-top: var(--space-6);">
            <span class="wf-alert-icon">ℹ️</span>
            <div>
              <strong>Booking Policy:</strong> Court booking covers up to 4 players. Free cancellation or reschedule up to 12 hours prior to start time. Rackets can be added at checkout or at reception upon arrival.
            </div>
          </div>
        </div>

        <!-- Sticky Summary Sidebar -->
        <div>
          <div class="wf-summary-card">
            <div class="wf-summary-header">
              <h3 style="font-size: var(--text-base); font-weight: 700;">Booking Summary</h3>
              <div style="font-size: var(--text-xs); color: var(--wf-text-muted);">
                ${selectedDate.fullDisplay}
              </div>
            </div>

            ${sel ? `
              <div class="wf-summary-row">
                <span class="wf-summary-row-label">Selected Time:</span>
                <span class="wf-summary-row-val">${sel.time} (${sel.duration} mins)</span>
              </div>
              <div class="wf-summary-row">
                <span class="wf-summary-row-label">Court:</span>
                <span class="wf-summary-row-val">${sel.courtAssigned}</span>
              </div>
              <div class="wf-summary-row">
                <span class="wf-summary-row-label">Court Hire:</span>
                <span class="wf-summary-row-val">£${sel.price}.00 ${sel.isPeak ? '(Peak)' : '(Off-Peak)'}</span>
              </div>

              <div class="wf-summary-divider"></div>

              <!-- Add-ons Selection -->
              <div style="margin-bottom: var(--space-4);">
                <label class="wf-label" style="font-size: var(--text-xs); margin-bottom: 6px;">Add-Ons & Equipment:</label>
                
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; font-size: var(--text-xs);">
                  <span>Racket Hire (£4/each):</span>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <button class="wf-btn wf-btn-secondary wf-btn-sm" style="padding: 2px 8px;" data-action="decrement-racket">-</button>
                    <span style="font-weight: 700; width: 16px; text-align: center;">${state.booking.racketsHired}</span>
                    <button class="wf-btn wf-btn-secondary wf-btn-sm" style="padding: 2px 8px;" data-action="increment-racket">+</button>
                  </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; font-size: var(--text-xs);">
                  <span>New Ball Tube (£3):</span>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <button class="wf-btn wf-btn-secondary wf-btn-sm" style="padding: 2px 8px;" data-action="decrement-ball">-</button>
                    <span style="font-weight: 700; width: 16px; text-align: center;">${state.booking.ballsTubes}</span>
                    <button class="wf-btn wf-btn-secondary wf-btn-sm" style="padding: 2px 8px;" data-action="increment-ball">+</button>
                  </div>
                </div>
              </div>

              <div class="wf-summary-divider"></div>

              <div class="wf-summary-total">
                <span class="wf-summary-total-label">Total to Pay:</span>
                <span class="wf-summary-total-price">£${totalCost}.00</span>
              </div>
              <div class="wf-summary-per-person">
                Equals approx. <strong>£${splitCost}</strong> per player (4 players)
              </div>

              <button class="wf-btn wf-btn-primary wf-btn-block wf-btn-lg" data-action="open-booking-modal">
                Continue to Reserve →
              </button>
            ` : `
              <div style="text-align: center; padding: var(--space-6) 0; color: var(--wf-text-muted);">
                <div style="font-size: 32px; margin-bottom: 8px;">⏳</div>
                <p style="font-size: var(--text-sm); font-weight: 600; color: var(--wf-text-primary);">
                  Select an available slot
                </p>
                <p style="font-size: var(--text-xs); margin-top: 4px;">
                  Click any available time slot on the left to review price and reserve.
                </p>
              </div>
            `}

            <div style="margin-top: var(--space-4); text-align: center;">
              <span style="font-size: 11px; color: var(--wf-text-muted);">
                🔒 No prepayment required for wireframe test
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

function renderSlotButtons(slots) {
  if (slots.length === 0) {
    return `<div style="font-size: var(--text-xs); color: var(--wf-text-muted);">No slots available for this filter.</div>`;
  }

  return slots.map(slot => {
    const isSelected = state.booking.selectedSlot && state.booking.selectedSlot.id === slot.id;
    if (slot.isBooked) {
      return `
        <button class="wf-slot-btn is-booked" disabled title="Slot already reserved">
          <div class="wf-slot-time">${slot.time}</div>
          <div class="wf-slot-court">${slot.courtAssigned}</div>
          <div class="wf-slot-price">Booked</div>
        </button>
      `;
    }

    return `
      <button class="wf-slot-btn ${isSelected ? 'is-selected' : ''}" 
              data-action="select-slot" 
              data-slot-id="${slot.id}"
              data-slot-time="${slot.time}"
              data-slot-price="${slot.price}"
              data-slot-duration="${slot.duration}"
              data-slot-court="${slot.courtAssigned}"
              data-slot-peak="${slot.isPeak}">
        <div class="wf-slot-time">${slot.time}</div>
        <div class="wf-slot-court">${slot.courtAssigned}</div>
        <div class="wf-slot-price">
          <span>£${slot.price}</span>
          <span style="font-size: 10px; font-weight: normal;">(£${slot.splitPrice}/ea)</span>
        </div>
      </button>
    `;
  }).join('');
}

/**
 * FIND A PLAYER VIEW
 */
function renderFindPlayerPage() {
  const isBrowse = state.findPlayer.activeTab === 'browse';

  return `
    <div class="wf-container" style="padding-top: var(--space-6); padding-bottom: var(--space-12);">
      
      <!-- UX Annotation -->
      <div class="wf-note-callout">
        <div class="wf-note-callout-title">
          <span>[UX Note: Solo Matchmaking & Refund Guarantee]</span>
        </div>
        Solves the #1 barrier in padel: wanting to play but lacking 3 friends. Strict rule enforced: At least 2 players must register for a session to proceed. If unmatched 2 hours prior, the system guarantees an immediate 100% automatic refund. Avoids complex social app bloat.
      </div>

      <!-- Hero Explainer Banner -->
      <div class="wf-match-hero-banner">
        <div class="wf-badge wf-badge-dark" style="margin-bottom: var(--space-2);">Solo & Partner Matching</div>
        <h1 class="wf-section-title">Find Other Players to Play With</h1>
        <p class="wf-section-subtitle">
          Want to play but don't have a 4-player group? Join an existing open game or request a match with players at your skill rating.
        </p>

        <!-- Mandatory Refund Guarantee Callout -->
        <div class="wf-refund-guarantee">
          <div style="font-weight: 700; margin-bottom: 2px; display: flex; align-items: center; gap: 6px;">
            <span>🛡️ Club Rule & Automatic Refund Guarantee:</span>
          </div>
          <p style="font-size: var(--text-xs); color: var(--wf-text-secondary); line-height: 1.5;">
            The club requires a <strong>minimum of 2 players</strong> for any match session to proceed. If a game cannot find enough players at least <strong>2 hours before the scheduled time</strong>, the court booking is automatically cancelled and every participant receives an <strong>immediate 100% refund</strong>.
          </p>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="wf-match-tabs">
        <button class="wf-match-tab ${isBrowse ? 'is-active' : ''}" data-action="switch-match-tab" data-tab="browse">
          Browse Open Games (${state.findPlayer.matches.length})
        </button>
        <button class="wf-match-tab ${!isBrowse ? 'is-active' : ''}" data-action="switch-match-tab" data-tab="create">
          + Request a Match as Solo / Pair
        </button>
      </div>

      <!-- Tab 1: Browse Open Matches -->
      ${isBrowse ? `
        <div class="wf-matches-list">
          ${state.findPlayer.matches.map(m => `
            <div class="wf-match-card">
              <div>
                <div style="display: flex; align-items: center; gap: var(--space-2); margin-bottom: 6px;">
                  <span class="wf-badge wf-badge-dark">${m.skillLevel}</span>
                  <span class="wf-badge">${m.levelRange}</span>
                  <span class="wf-badge wf-badge-outline">Host: ${m.host}</span>
                </div>
                <h3 style="font-size: var(--text-lg); font-weight: 700; margin-bottom: 4px;">
                  📅 ${m.dateDisplay} — ${m.courtName}
                </h3>
                <p style="font-size: var(--text-xs); color: var(--wf-text-secondary); margin-bottom: var(--space-3);">
                  "${m.notes}"
                </p>
                <div class="wf-player-spots">
                  <span style="font-size: var(--text-xs); font-weight: 600; margin-right: 4px;">Players (${m.currentPlayers}/${m.maxPlayers}):</span>
                  ${Array.from({ length: m.maxPlayers }).map((_, i) => `
                    <span class="wf-spot-circle ${i < m.currentPlayers ? 'wf-spot-filled' : 'wf-spot-empty'}">
                      ${i < m.currentPlayers ? '✓' : ''}
                    </span>
                  `).join('')}
                  <span style="font-size: 11px; color: var(--wf-text-muted); margin-left: 6px;">
                    ${m.status}
                  </span>
                </div>
              </div>

              <div style="text-align: right; min-width: 140px;">
                <div style="font-size: var(--text-xl); font-weight: 800; font-family: var(--font-mono);">
                  £${m.costPerPlayer.toFixed(2)}
                </div>
                <div style="font-size: 11px; color: var(--wf-text-muted); margin-bottom: var(--space-3);">
                  per player
                </div>
                <button class="wf-btn wf-btn-primary wf-btn-sm wf-btn-block" 
                        data-action="join-match-modal" 
                        data-match-id="${m.id}"
                        ${m.currentPlayers >= m.maxPlayers ? 'disabled' : ''}>
                  ${m.currentPlayers >= m.maxPlayers ? 'Match Full' : 'Join Game →'}
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      ` : `
        <!-- Tab 2: Create a Match Request -->
        <div class="wf-card" style="max-width: 680px;">
          <h3 style="font-size: var(--text-lg); font-weight: 700; margin-bottom: var(--space-2);">
            Post a Match Request
          </h3>
          <p style="font-size: var(--text-xs); color: var(--wf-text-secondary); margin-bottom: var(--space-5);">
            Tell us when you want to play. We'll hold a court and notify other players at your skill level.
          </p>

          <form id="post-match-form">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
              <div class="wf-form-group">
                <label class="wf-label">Preferred Date</label>
                <select class="wf-select" id="match-date-input" required>
                  ${state.booking.dates.map(d => `
                    <option value="${d.displayDate}">${d.dayName} (${d.displayDate})</option>
                  `).join('')}
                </select>
              </div>

              <div class="wf-form-group">
                <label class="wf-label">Time Window</label>
                <select class="wf-select" id="match-time-input" required>
                  <option value="Morning (08:00 - 11:00)">Morning (08:00 - 11:00)</option>
                  <option value="Afternoon (12:00 - 16:00)">Afternoon (12:00 - 16:00)</option>
                  <option value="Evening (18:00 - 21:00)">Evening (18:00 - 21:00)</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
              <div class="wf-form-group">
                <label class="wf-label">Your Playing Level</label>
                <select class="wf-select" id="match-level-input" required>
                  <option value="Beginner (Level 1.0 - 2.5)">Beginner (Level 1.0 - 2.5: Casual rally)</option>
                  <option value="Intermediate (Level 3.0 - 4.0)" selected>Intermediate (Level 3.0 - 4.0: Tactical play)</option>
                  <option value="Advanced (Level 4.5+)">Advanced (Level 4.5+: Fast competitive)</option>
                </select>
              </div>

              <div class="wf-form-group">
                <label class="wf-label">How Many Are You?</label>
                <select class="wf-select" id="match-players-input" required>
                  <option value="1">Solo Player (Need 3 more)</option>
                  <option value="2">Pair of Players (Need 2 more)</option>
                </select>
              </div>
            </div>

            <div class="wf-form-group">
              <label class="wf-label">Your Name</label>
              <input type="text" class="wf-input" id="match-name-input" placeholder="e.g. Sam Taylor" required />
            </div>

            <div class="wf-form-group">
              <label class="wf-label">WhatsApp or Phone Number</label>
              <input type="tel" class="wf-input" id="match-phone-input" placeholder="e.g. 07700 900123" required />
              <div class="wf-hint">Used only to send you the match confirmation and join link.</div>
            </div>

            <div class="wf-form-group">
              <label class="wf-label">Match Note / Preferences (Optional)</label>
              <textarea class="wf-input" id="match-notes-input" rows="2" placeholder="e.g. Friendly social doubles, up for a coffee after!"></textarea>
            </div>

            <div class="wf-alert" style="margin-bottom: var(--space-5);">
              <span class="wf-alert-icon">✓</span>
              <div style="font-size: var(--text-xs);">
                <strong>Automatic Refund Protection:</strong> You will only be charged £12.50 - £17.00 when the match reaches the minimum 2-player requirement. If no match is found 2 hours prior, the request expires with zero charge.
              </div>
            </div>

            <button type="submit" class="wf-btn wf-btn-primary wf-btn-lg">
              Submit Match Request →
            </button>
          </form>
        </div>
      `}

      <!-- Client UX Review: Interactive Match State Simulator -->
      <div class="wf-status-simulator">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-3);">
          <div>
            <strong style="font-size: var(--text-sm);">🧪 Prototype Tester: Simulate Match Progression States</strong>
            <div style="font-size: var(--text-xs); color: var(--wf-text-muted);">
              Test the UX states required in section 4.C of the brief:
            </div>
          </div>
          <div style="display: flex; gap: var(--space-2);">
            <button class="wf-btn wf-btn-sm ${state.findPlayer.simulatedStatus === 'pending' ? 'wf-btn-primary' : 'wf-btn-secondary'}" 
                    data-action="simulate-status" data-status="pending">
              State A: Pending
            </button>
            <button class="wf-btn wf-btn-sm ${state.findPlayer.simulatedStatus === 'matched' ? 'wf-btn-primary' : 'wf-btn-secondary'}" 
                    data-action="simulate-status" data-status="matched">
              State B: Match Confirmed
            </button>
            <button class="wf-btn wf-btn-sm ${state.findPlayer.simulatedStatus === 'refunded' ? 'wf-btn-primary' : 'wf-btn-secondary'}" 
                    data-action="simulate-status" data-status="refunded">
              State C: Expired & Refunded
            </button>
          </div>
        </div>

        <!-- Render Current Simulated State Box -->
        <div style="background: #ffffff; border: 1px solid var(--wf-border-default); padding: var(--space-4); border-radius: var(--radius-sm);">
          ${renderSimulatedMatchState()}
        </div>
      </div>

    </div>
  `;
}

function renderSimulatedMatchState() {
  const status = state.findPlayer.simulatedStatus;

  if (status === 'pending') {
    return `
      <div style="display: flex; align-items: flex-start; gap: var(--space-3);">
        <div style="font-size: 24px;">⏳</div>
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <strong style="font-size: var(--text-sm);">State A: Match Pending (1 of 4 spots filled)</strong>
            <span class="wf-badge">Searching Players</span>
          </div>
          <p style="font-size: var(--text-xs); color: var(--wf-text-secondary); margin-top: 4px;">
            Your request for <strong>Tomorrow 18:30 (Intermediate)</strong> is live. We've notified 8 registered players in your skill bracket. Need at least 1 more player (minimum 2 total) to lock the court.
          </p>
          <div style="font-size: 11px; color: var(--wf-text-muted); margin-top: 4px;">
            ⏰ Auto-refund countdown: Court auto-cancels with £0 charge if unmatched by 16:30 tomorrow.
          </div>
        </div>
      </div>
    `;
  }

  if (status === 'matched') {
    return `
      <div style="display: flex; align-items: flex-start; gap: var(--space-3);">
        <div style="font-size: 24px;">🎉</div>
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <strong style="font-size: var(--text-sm);">State B: Match Confirmed! (4 of 4 spots filled)</strong>
            <span class="wf-badge wf-badge-dark">Court Confirmed</span>
          </div>
          <p style="font-size: var(--text-xs); color: var(--wf-text-secondary); margin-top: 4px;">
            All 4 players joined: <strong>You, Marcus V., Dave T., and Sara K.</strong> Court 1 (Indoor Panoramic) is locked for Tomorrow 18:30.
          </p>
          <p style="font-size: 11px; color: var(--wf-text-muted); margin-top: 4px;">
            ✓ WhatsApp group invite sent to all players. Reception check-in reference: <strong>#MATCH-9921</strong>.
          </p>
        </div>
      </div>
    `;
  }

  return `
    <div style="display: flex; align-items: flex-start; gap: var(--space-3);">
      <div style="font-size: 24px;">💳</div>
      <div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <strong style="font-size: var(--text-sm);">State C: Match Expired & Full Refund Processed</strong>
          <span class="wf-badge" style="border-color: #ef4444; color: #b91c1c;">Refund Completed</span>
        </div>
        <p style="font-size: var(--text-xs); color: var(--wf-text-secondary); margin-top: 4px;">
          The match did not meet the 2-player minimum requirement 2 hours before start time. In accordance with our club policy, the court has been released and your card/account has been <strong>100% refunded (£17.00)</strong>.
        </p>
        <p style="font-size: 11px; color: var(--wf-text-muted); margin-top: 4px;">
          Refund reference: <strong>#RF-81920-PADEL</strong>. No cancellation fees apply.
        </p>
      </div>
    </div>
  `;
}

/**
 * NEW TO PADEL VIEW
 */
function renderNewToPadelPage() {
  return `
    <div class="wf-container" style="padding-top: var(--space-6); padding-bottom: var(--space-12);">
      
      <!-- UX Annotation -->
      <div class="wf-note-callout">
        <div class="wf-note-callout-title">
          <span>[UX Note: Beginner Onboarding Information Architecture]</span>
        </div>
        Designed to answer the 4 questions every newcomer asks before booking: (1) What are the basic rules? (2) What equipment do I need? (3) Do I need prior racket experience? (4) How do I start without embarrassing myself? Ends with 2 direct conversion actions.
      </div>

      <!-- Header -->
      <div style="max-width: 720px; margin-bottom: var(--space-8);">
        <div class="wf-badge wf-badge-dark" style="margin-bottom: var(--space-2);">Beginner Guide</div>
        <h1 class="wf-section-title">New to Padel? Here's Everything You Need to Know</h1>
        <p class="wf-section-subtitle">
          Padel is simple, social, and addictive. It is usually played in doubles on an enclosed court roughly a third the size of a tennis court.
        </p>
      </div>

      <!-- Court & Rules Breakdown -->
      <div class="wf-padel-diagram">
        <h3 style="font-size: var(--text-lg); font-weight: 700; margin-bottom: var(--space-2);">
          The Court & The Wall Rules (Explained Simply)
        </h3>
        <p style="font-size: var(--text-xs); color: var(--wf-text-secondary); margin-bottom: var(--space-4);">
          The biggest difference from tennis is the glass walls. The ball remains in play after bouncing off the glass!
        </p>

        <div class="wf-diagram-court-sketch">
          <div style="position: absolute; top: 12px; left: 16px; font-size: 11px; font-weight: 700; background: #fff; padding: 2px 6px; border: 1px solid #000;">
            Back Glass Wall (Ball can bounce here!)
          </div>
          <div style="position: absolute; bottom: 12px; right: 16px; font-size: 11px; font-weight: 700; background: #fff; padding: 2px 6px; border: 1px solid #000;">
            10m x 20m Enclosed Court
          </div>
          <div style="font-weight: 800; font-size: var(--text-sm); background: #ffffff; padding: 4px 12px; border: 1px dashed #334155;">
            [ Net: 88cm Centre Height ]
          </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: var(--space-4); margin-top: var(--space-4);">
          <div style="font-size: var(--text-xs);">
            <strong>1. Underhand Serve</strong><br>
            <span style="color: var(--wf-text-secondary);">No overhead tennis serves. You bounce the ball once behind the service line and strike it below waist level diagonally.</span>
          </div>
          <div style="font-size: var(--text-xs);">
            <strong>2. Wall Rebounds</strong><br>
            <span style="color: var(--wf-text-secondary);">The ball must bounce on the turf once before hitting the glass wall. Once it hits the wall, you can play it back over the net.</span>
          </div>
          <div style="font-size: var(--text-xs);">
            <strong>3. Tennis Scoring</strong><br>
            <span style="color: var(--wf-text-secondary);">Scoring is identical to tennis: 15, 30, 40, Game. Matches are played best of 3 sets.</span>
          </div>
        </div>
      </div>

      <!-- Equipment Checklist -->
      <div style="margin-bottom: var(--space-8);">
        <h3 style="font-size: var(--text-xl); font-weight: 700; margin-bottom: var(--space-2);">
          What Equipment Do You Need to Bring?
        </h3>
        <p style="font-size: var(--text-sm); color: var(--wf-text-secondary);">
          You don't need expensive gear to get started. You can rent everything at the club.
        </p>

        <div class="wf-equipment-grid">
          <div class="wf-equipment-card">
            <div class="wf-badge wf-badge-dark" style="margin-bottom: 8px;">Available for Hire (£4)</div>
            <h4 style="font-size: var(--text-base); font-weight: 700; margin-bottom: 4px;">Padel Racket</h4>
            <p style="font-size: var(--text-xs); color: var(--wf-text-secondary); line-height: 1.5;">
              Solid composite racket with perforated holes (no strings). Short handle makes hand-eye coordination much easier than tennis.
            </p>
          </div>

          <div class="wf-equipment-card">
            <div class="wf-badge" style="margin-bottom: 8px;">Free with Court Hire</div>
            <h4 style="font-size: var(--text-base); font-weight: 700; margin-bottom: 4px;">Padel Balls</h4>
            <p style="font-size: var(--text-xs); color: var(--wf-text-secondary); line-height: 1.5;">
              Look identical to tennis balls but have slightly lower internal pressure, ensuring controlled rallies and predictable bounces.
            </p>
          </div>

          <div class="wf-equipment-card">
            <div class="wf-badge" style="margin-bottom: 8px;">Wear Your Own</div>
            <h4 style="font-size: var(--text-base); font-weight: 700; margin-bottom: 4px;">Footwear</h4>
            <p style="font-size: var(--text-xs); color: var(--wf-text-secondary); line-height: 1.5;">
              Any clean tennis or indoor athletic trainers with good grip. Running shoes with thick soles are acceptable for beginners.
            </p>
          </div>
        </div>
      </div>

      <!-- How to Get Started CTA Box -->
      <div class="wf-card" style="background-color: var(--wf-bg-surface); border: 2px solid var(--wf-text-primary);">
        <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: var(--space-6); align-items: center;">
          <div>
            <div class="wf-section-tag">Ready to play your first game?</div>
            <h3 style="font-size: var(--text-xl); font-weight: 700; margin-bottom: var(--space-2);">
              Recommended Beginner Next Steps
            </h3>
            <p style="font-size: var(--text-xs); color: var(--wf-text-secondary); margin-bottom: var(--space-4); line-height: 1.6;">
              Option A: Join our popular <strong>Saturday 10:00 AM Beginner Clinic (£18)</strong> where a coach teaches you the basics in a friendly 4-person group.<br>
              Option B: Book an <strong>off-peak court (£9/player)</strong> with 3 friends and learn at your own pace.
            </p>
            <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
              <button class="wf-btn wf-btn-primary" data-action="go-page" data-target="classes">
                Join Saturday Intro Clinic (£18)
              </button>
              <button class="wf-btn wf-btn-secondary" data-action="go-page" data-target="play">
                Book a Beginner Court (£9/player)
              </button>
            </div>
          </div>
          <div>
            <div class="wf-img-box wf-ratio-4-3">
              <div class="wf-img-box-content">
                [ Wireframe: Coach Demonstrating Wall Technique ]
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `;
}

/**
 * CLASSES & COACHING VIEW
 */
function renderClassesPage() {
  return `
    <div class="wf-container" style="padding-top: var(--space-6); padding-bottom: var(--space-12);">
      
      <!-- UX Annotation -->
      <div class="wf-note-callout">
        <div class="wf-note-callout-title">
          <span>[UX Note: Coaching Inquiry Architecture]</span>
        </div>
        Small club constraint: No automated coach calendar booking sync needed. High-conversion card layout provides clear price expectations, coach credentials, and an instant WhatsApp or inquiry form handoff.
      </div>

      <!-- Header -->
      <div style="margin-bottom: var(--space-8);">
        <div class="wf-badge wf-badge-dark" style="margin-bottom: var(--space-2);">Coaching & Academies</div>
        <h1 class="wf-section-title">Padel Lessons & Coaching</h1>
        <p class="wf-section-subtitle">
          From first-time beginners to competitive tournament players, our LTA certified coaches help you develop confidence on the glass.
        </p>
      </div>

      <!-- Lesson Types Grid -->
      <div class="wf-classes-grid">
        ${COACHING_CLASSES.map(cls => `
          <div class="wf-card wf-class-card">
            <div>
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
                <span class="wf-badge wf-badge-dark">${cls.category}</span>
                <span style="font-size: var(--text-xs); color: var(--wf-text-muted); font-weight: 600;">${cls.duration}</span>
              </div>
              <h3 style="font-size: var(--text-lg); font-weight: 700; margin-bottom: 4px;">${cls.title}</h3>
              <p style="font-size: var(--text-xs); color: var(--wf-text-secondary); margin-bottom: var(--space-3); line-height: 1.4;">
                ${cls.tagline}
              </p>
              
              <div style="background: var(--wf-bg-muted); padding: var(--space-3); border-radius: var(--radius-sm); margin-bottom: var(--space-4); font-size: var(--text-xs);">
                <div><strong>Format:</strong> ${cls.format}</div>
                <div style="margin-top: 2px;"><strong>Schedule:</strong> ${cls.schedule}</div>
              </div>

              <div style="font-size: var(--text-xs); font-weight: 700; text-transform: uppercase; margin-bottom: 6px; color: var(--wf-text-muted);">
                What's Covered:
              </div>
              <ul style="list-style: none; font-size: var(--text-xs); color: var(--wf-text-secondary); margin-bottom: var(--space-5);">
                ${cls.highlights.map(h => `<li style="margin-bottom: 4px;">✓ ${h}</li>`).join('')}
              </ul>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid var(--wf-border-light); padding-top: var(--space-3); margin-bottom: var(--space-3);">
                <span style="font-size: var(--text-xs); color: var(--wf-text-muted);">${cls.priceNote}</span>
                <span style="font-size: var(--text-xl); font-weight: 800; font-family: var(--font-mono);">£${cls.price}</span>
              </div>
              <button class="wf-btn wf-btn-primary wf-btn-block" 
                      data-action="open-class-inquiry" 
                      data-class-id="${cls.id}"
                      data-class-title="${cls.title}">
                Inquire or Book Session →
              </button>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Coach Profiles Section -->
      <div style="margin-top: var(--space-12);">
        <div class="wf-section-header">
          <div class="wf-section-tag">Our Coaching Staff</div>
          <h2 class="wf-section-title">Meet the Coaches</h2>
          <p class="wf-section-subtitle">
            All coaches hold certified LTA or Spanish FEP qualifications with full DBS safety checks.
          </p>
        </div>

        <div class="wf-coaches-grid">
          ${COACHES.map(coach => `
            <div class="wf-coach-card">
              <div class="wf-img-box wf-ratio-1-1" style="max-height: 160px; margin-bottom: var(--space-4);">
                <div class="wf-img-box-content">[ Coach Photo: ${coach.name} ]</div>
              </div>
              <h4 style="font-size: var(--text-base); font-weight: 700;">${coach.name}</h4>
              <div style="font-size: var(--text-xs); font-weight: 600; color: var(--wf-text-primary); margin-bottom: 2px;">
                ${coach.role}
              </div>
              <div style="font-size: 11px; color: var(--wf-text-muted); margin-bottom: var(--space-3);">
                ${coach.credentials} • ${coach.experience}
              </div>
              <p style="font-size: var(--text-xs); color: var(--wf-text-secondary); line-height: 1.5;">
                "${coach.bio}"
              </p>
            </div>
          `).join('')}
        </div>
      </div>

    </div>
  `;
}

/**
 * THE CLUB VIEW
 */
function renderClubPage() {
  return `
    <div class="wf-container" style="padding-top: var(--space-6); padding-bottom: var(--space-12);">
      
      <!-- UX Annotation -->
      <div class="wf-note-callout">
        <div class="wf-note-callout-title">
          <span>[UX Note: Club & Facilities Information Architecture]</span>
        </div>
        Answers real player questions: Is it rain-proof? (2 covered canopy courts + 2 indoor AC). Is there parking? (28 free spots). What are the exact transit options? (Tube + bus walking directions). Provides one-tap direct WhatsApp inquiry.
      </div>

      <!-- Header -->
      <div style="max-width: 720px; margin-bottom: var(--space-8);">
        <div class="wf-badge wf-badge-dark" style="margin-bottom: var(--space-2);">The Facility</div>
        <h1 class="wf-section-title">About ${CLUB_INFO.name}</h1>
        <p class="wf-section-subtitle">
          Built by passionate padel players for the local community. A vibrant space where sport, wellness, and friendship meet.
        </p>
      </div>

      <div class="wf-club-grid">
        
        <!-- Left: Courts & Facilities -->
        <div>
          <h3 style="font-size: var(--text-lg); font-weight: 700; margin-bottom: var(--space-4);">
            Our 4 Tournament Courts
          </h3>
          <div class="wf-courts-list">
            ${COURTS.map(c => `
              <div class="wf-card">
                <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px;">
                  <h4 style="font-size: var(--text-base); font-weight: 700;">${c.name}</h4>
                  <span class="wf-badge wf-badge-dark">${c.badge}</span>
                </div>
                <div style="font-size: var(--text-xs); color: var(--wf-text-muted); margin-bottom: 6px;">
                  Surface: <strong>${c.surface}</strong>
                </div>
                <p style="font-size: var(--text-xs); color: var(--wf-text-secondary); line-height: 1.5;">
                  ${c.features}
                </p>
              </div>
            `).join('')}
          </div>

          <h3 style="font-size: var(--text-lg); font-weight: 700; margin-top: var(--space-8); margin-bottom: var(--space-4);">
            Club Amenities
          </h3>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4);">
            ${CLUB_FACILITIES.slice(1).map(f => `
              <div class="wf-card" style="padding: var(--space-4);">
                <div style="font-weight: 700; font-size: var(--text-sm); margin-bottom: 4px;">
                  ✓ ${f.name}
                </div>
                <div style="font-size: var(--text-xs); color: var(--wf-text-secondary); line-height: 1.4;">
                  ${f.desc}
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Right: Location, Hours, Contact Card -->
        <div>
          <div class="wf-card" style="border: 2px solid var(--wf-text-primary);">
            <h3 style="font-size: var(--text-base); font-weight: 700; margin-bottom: var(--space-3);">
              Club Hours
            </h3>
            <table class="wf-hours-table">
              ${CLUB_INFO.hours.map(h => `
                <tr>
                  <td>${h.days}</td>
                  <td>${h.time}</td>
                </tr>
              `).join('')}
            </table>

            <div class="wf-summary-divider"></div>

            <h3 style="font-size: var(--text-base); font-weight: 700; margin-bottom: var(--space-2);">
              Location & Transit
            </h3>
            <p style="font-size: var(--text-xs); color: var(--wf-text-secondary); margin-bottom: var(--space-3); line-height: 1.5;">
              📍 <strong>${CLUB_INFO.address}</strong><br>
              • 5-min walk from Riverside Station (District Line)<br>
              • Bus routes 28, 44, and 170 stop outside the gate<br>
              • 28 free customer parking bays on-site
            </p>

            <div class="wf-img-box wf-ratio-16-9" style="margin-bottom: var(--space-4);">
              <div class="wf-img-box-content">
                [ Map Placeholder: Parking Entrance & Club Reception ]
              </div>
            </div>

            <div class="wf-summary-divider"></div>

            <h3 style="font-size: var(--text-base); font-weight: 700; margin-bottom: var(--space-2);">
              Direct Contact
            </h3>
            <p style="font-size: var(--text-xs); color: var(--wf-text-secondary); margin-bottom: var(--space-3);">
              Phone: ${CLUB_INFO.phone}<br>
              WhatsApp: ${CLUB_INFO.whatsapp}<br>
              Email: ${CLUB_INFO.email}
            </p>

            <a href="https://wa.me/447700900821" target="_blank" class="wf-btn wf-btn-primary wf-btn-block">
              💬 Instant WhatsApp Chat
            </a>
          </div>
        </div>

      </div>
    </div>
  `;
}

/**
 * MODAL RENDERING
 */
function renderModal() {
  if (!state.modal) {
    modalContainer.innerHTML = '';
    return;
  }

  let modalContent = '';

  // 1. Booking Checkout / Details Modal
  if (state.modal === 'booking-modal') {
    const sel = state.booking.selectedSlot;
    const selectedDate = state.booking.dates.find(d => d.iso === state.booking.selectedDateIso);
    const courtCost = sel ? sel.price : 48;
    const racketCost = state.booking.racketsHired * 4;
    const ballCost = state.booking.ballsTubes * 3;
    const total = courtCost + racketCost + ballCost;

    modalContent = `
      <div class="wf-modal-dialog">
        <div class="wf-modal-header">
          <div class="wf-modal-title">Confirm Court Reservation</div>
          <button class="wf-modal-close" data-action="close-modal">&times;</button>
        </div>

        <div style="background: var(--wf-bg-muted); padding: var(--space-3); border-radius: var(--radius-sm); margin-bottom: var(--space-4); font-size: var(--text-xs);">
          <div><strong>Court:</strong> ${sel ? sel.courtAssigned : 'Court 1'}</div>
          <div><strong>When:</strong> ${selectedDate.fullDisplay} at ${sel ? sel.time : '18:00'} (${sel ? sel.duration : 60} mins)</div>
          <div><strong>Total Cost:</strong> £${total}.00 (includes ${state.booking.racketsHired} racket hires)</div>
        </div>

        <form id="booking-reserve-form">
          <div class="wf-form-group">
            <label class="wf-label">Lead Player Name</label>
            <input type="text" class="wf-input" id="book-name" placeholder="e.g. Alex Morgan" required />
          </div>

          <div class="wf-form-group">
            <label class="wf-label">WhatsApp or Mobile Number</label>
            <input type="tel" class="wf-input" id="book-phone" placeholder="e.g. 07700 900123" required />
            <div class="wf-hint">We send your court PIN and confirmation via WhatsApp/SMS.</div>
          </div>

          <div class="wf-form-group">
            <label class="wf-label">Email Address</label>
            <input type="email" class="wf-input" id="book-email" placeholder="alex@example.com" required />
          </div>

          <div class="wf-alert" style="margin-bottom: var(--space-4); font-size: var(--text-xs);">
            <span class="wf-alert-icon">ℹ️</span>
            <div>
              <strong>Cancellation Policy:</strong> Free cancellation up to 12 hours before play. Pay on arrival at club reception or via secure SMS link.
            </div>
          </div>

          <div style="display: flex; gap: var(--space-3); justify-content: flex-end;">
            <button type="button" class="wf-btn wf-btn-secondary" data-action="close-modal">Cancel</button>
            <button type="submit" class="wf-btn wf-btn-primary">Confirm Booking →</button>
          </div>
        </form>
      </div>
    `;
  }

  // 2. Booking Success Modal
  else if (state.modal === 'booking-success') {
    const booking = state.booking.confirmedBooking || {
      reference: '#PADEL-8419',
      name: 'Player',
      time: '18:00',
      court: 'Court 1'
    };

    modalContent = `
      <div class="wf-modal-dialog" style="text-align: center;">
        <div style="font-size: 48px; margin-bottom: var(--space-2);">🎉</div>
        <h3 class="wf-modal-title" style="margin-bottom: var(--space-2);">Court Reserved Successfully!</h3>
        <p style="font-size: var(--text-sm); color: var(--wf-text-secondary); margin-bottom: var(--space-4);">
          Booking reference: <strong>${booking.reference}</strong>
        </p>

        <div class="wf-card" style="text-align: left; font-size: var(--text-xs); margin-bottom: var(--space-5);">
          <div style="margin-bottom: 4px;"><strong>Lead Player:</strong> ${booking.name}</div>
          <div style="margin-bottom: 4px;"><strong>Court:</strong> ${booking.court}</div>
          <div style="margin-bottom: 4px;"><strong>Time:</strong> ${booking.time}</div>
          <div style="margin-bottom: 4px;"><strong>Status:</strong> Confirmed & Held</div>
          <div style="margin-top: 8px; color: var(--wf-text-muted);">
            📲 A confirmation message has been prepared for WhatsApp with gate access PIN: <strong>4912#</strong>.
          </div>
        </div>

        <div style="display: flex; gap: var(--space-3); justify-content: center;">
          <button class="wf-btn wf-btn-secondary" data-action="close-modal">Back to Home</button>
          <button class="wf-btn wf-btn-primary" data-action="go-page" data-target="find-player">
            Need Players? Post to Find a Player →
          </button>
        </div>
      </div>
    `;
  }

  // 3. Join Match Modal
  else if (state.modal === 'join-match-modal') {
    const m = state.findPlayer.selectedMatchToJoin;
    modalContent = `
      <div class="wf-modal-dialog">
        <div class="wf-modal-header">
          <div class="wf-modal-title">Join Open Match</div>
          <button class="wf-modal-close" data-action="close-modal">&times;</button>
        </div>

        ${m ? `
          <div style="background: var(--wf-bg-muted); padding: var(--space-3); border-radius: var(--radius-sm); margin-bottom: var(--space-4); font-size: var(--text-xs);">
            <div><strong>Match:</strong> ${m.dateDisplay} (${m.courtName})</div>
            <div><strong>Host:</strong> ${m.host} (${m.skillLevel})</div>
            <div><strong>Cost:</strong> £${m.costPerPlayer.toFixed(2)} per player</div>
          </div>

          <form id="join-match-form">
            <div class="wf-form-group">
              <label class="wf-label">Your Name</label>
              <input type="text" class="wf-input" id="join-name" placeholder="e.g. Jordan Lee" required />
            </div>

            <div class="wf-form-group">
              <label class="wf-label">WhatsApp Number</label>
              <input type="tel" class="wf-input" id="join-phone" placeholder="e.g. 07700 900555" required />
            </div>

            <div class="wf-form-group">
              <label class="wf-label">Confirm Your Skill Level</label>
              <select class="wf-select" id="join-level" required>
                <option value="Matches Host Level">I match this level (${m.skillLevel})</option>
                <option value="Beginner">Beginner (1.0 - 2.5)</option>
                <option value="Intermediate">Intermediate (3.0 - 4.0)</option>
                <option value="Advanced">Advanced (4.5+)</option>
              </select>
            </div>

            <div class="wf-alert" style="margin-bottom: var(--space-4); font-size: var(--text-xs);">
              <span class="wf-alert-icon">🛡️</span>
              <div>
                <strong>Refund Guarantee:</strong> You will only be charged when the 2-player minimum is fulfilled. If unmatched 2 hours prior, you are 100% refunded immediately.
              </div>
            </div>

            <div style="display: flex; gap: var(--space-3); justify-content: flex-end;">
              <button type="button" class="wf-btn wf-btn-secondary" data-action="close-modal">Cancel</button>
              <button type="submit" class="wf-btn wf-btn-primary">Reserve Spot (£${m.costPerPlayer.toFixed(2)}) →</button>
            </div>
          </form>
        ` : ''}
      </div>
    `;
  }

  // 4. Coaching Inquiry Modal
  else if (state.modal === 'class-inquiry-modal') {
    const cls = state.classes.selectedClass;
    modalContent = `
      <div class="wf-modal-dialog">
        <div class="wf-modal-header">
          <div class="wf-modal-title">Inquire About Coaching</div>
          <button class="wf-modal-close" data-action="close-modal">&times;</button>
        </div>

        <div style="background: var(--wf-bg-muted); padding: var(--space-3); border-radius: var(--radius-sm); margin-bottom: var(--space-4); font-size: var(--text-xs);">
          <div><strong>Lesson:</strong> ${cls ? cls.title : 'Coaching Session'}</div>
          <div><strong>Pricing:</strong> From £${cls ? cls.price : 18}</div>
        </div>

        <form id="class-inquiry-form">
          <div class="wf-form-group">
            <label class="wf-label">Your Name</label>
            <input type="text" class="wf-input" id="inq-name" placeholder="e.g. Taylor Smith" required />
          </div>

          <div class="wf-form-group">
            <label class="wf-label">WhatsApp or Phone</label>
            <input type="tel" class="wf-input" id="inq-phone" placeholder="e.g. 07700 900888" required />
          </div>

          <div class="wf-form-group">
            <label class="wf-label">Preferred Day / Time</label>
            <input type="text" class="wf-input" id="inq-time" placeholder="e.g. Saturday mornings or Tuesday evenings" required />
          </div>

          <div class="wf-form-group">
            <label class="wf-label">Your Goals or Questions</label>
            <textarea class="wf-input" id="inq-notes" rows="2" placeholder="e.g. New to padel, want to learn how to hit off the back wall."></textarea>
          </div>

          <div style="display: flex; gap: var(--space-3); justify-content: flex-end;">
            <button type="button" class="wf-btn wf-btn-secondary" data-action="close-modal">Close</button>
            <button type="submit" class="wf-btn wf-btn-primary">Send Inquiry to Coach →</button>
          </div>
        </form>
      </div>
    `;
  }

  // 5. Sitemap & Information Architecture Modal (For Client Review)
  else if (state.modal === 'sitemap-modal') {
    modalContent = `
      <div class="wf-modal-dialog" style="max-width: 640px;">
        <div class="wf-modal-header">
          <div class="wf-modal-title">Sitemap & Information Architecture</div>
          <button class="wf-modal-close" data-action="close-modal">&times;</button>
        </div>

        <div style="font-size: var(--text-xs); color: var(--wf-text-secondary); line-height: 1.6; margin-bottom: var(--space-4);">
          Structured specifically for a local, non-technical sports club with lean operational budget.
        </div>

        <div style="background: var(--wf-bg-muted); padding: var(--space-4); border-radius: var(--radius-sm); font-family: var(--font-mono); font-size: var(--text-xs); line-height: 1.8;">
          <div><strong>1. Primary Navigation</strong></div>
          <div style="padding-left: 16px;">
            ├── <strong>Play / Court Booking</strong> (/play)<br>
            │   ├── Date & Duration Filters (60 / 90 min)<br>
            │   ├── Court Assignment (Indoor AC vs Canopy Covered)<br>
            │   ├── Live Price & Per-Player Split Calculator<br>
            │   ├── Add-on Rackets & Balls Rental<br>
            │   └── Quick Guest Checkout & WhatsApp PIN Confirmation<br>
            ├── <strong>Find a Player</strong> (/find-player)<br>
            │   ├── Browse Open Matches (Live spot dots 2/4, 3/4)<br>
            │   ├── Post Match Request (Solo / Pair)<br>
            │   ├── Minimum 2-Player Rule Enforcement<br>
            │   └── Guaranteed 100% Automatic Refund Policy<br>
            ├── <strong>New to Padel</strong> (/new-to-padel)<br>
            │   ├── What is Padel (Court diagram & wall rules)<br>
            │   ├── Equipment Guide (Rental at desk)<br>
            │   └── 3 Beginner Pathways (Clinic vs Social Court)<br>
            ├── <strong>Classes & Coaching</strong> (/classes)<br>
            │   ├── Intro Clinic, Tactical Drills, Private 1-on-1, Juniors<br>
            │   ├── Coach Credentials & Experience<br>
            │   └── Lean WhatsApp / Inquiry Form Handoff<br>
            └── <strong>The Club</strong> (/club)<br>
                ├── Court Specs (Mondo Supercourt XN, 12mm glass)<br>
                ├── Club Amenities (Pro shop, cafe lounge, parking)<br>
                └── Opening Hours, Location Map & Directions
          </div>
        </div>

        <div style="margin-top: var(--space-4); text-align: right;">
          <button class="wf-btn wf-btn-primary" data-action="close-modal">Close Sitemap</button>
        </div>
      </div>
    `;
  }

  modalContainer.innerHTML = `
    <div class="wf-modal-backdrop is-open">
      ${modalContent}
    </div>
  `;

  // Attach modal form handlers
  attachModalEvents();
}

/**
 * Event Handlers for UI Interactions
 */
function attachPageEvents() {
  // Navigation / Page links
  document.querySelectorAll('[data-action="go-page"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const target = el.getAttribute('data-target');
      setPage(target);
    });
  });

  // Date selection in Play view
  document.querySelectorAll('[data-action="select-date"]').forEach(el => {
    el.addEventListener('click', () => {
      state.booking.selectedDateIso = el.getAttribute('data-iso');
      state.booking.selectedSlot = null; // reset slot selection on date change
      notify();
    });
  });

  // Court filter in Play view
  document.querySelectorAll('[data-action="filter-court"]').forEach(el => {
    el.addEventListener('click', () => {
      state.booking.selectedCourtFilter = el.getAttribute('data-court');
      state.booking.selectedSlot = null;
      notify();
    });
  });

  // Duration filter in Play view
  document.querySelectorAll('[data-action="filter-duration"]').forEach(el => {
    el.addEventListener('click', () => {
      state.booking.selectedDuration = parseInt(el.getAttribute('data-duration'), 10);
      state.booking.selectedSlot = null;
      notify();
    });
  });

  // Slot button selection
  document.querySelectorAll('[data-action="select-slot"]').forEach(el => {
    el.addEventListener('click', () => {
      state.booking.selectedSlot = {
        id: el.getAttribute('data-slot-id'),
        time: el.getAttribute('data-slot-time'),
        price: parseInt(el.getAttribute('data-slot-price'), 10),
        duration: parseInt(el.getAttribute('data-slot-duration'), 10),
        courtAssigned: el.getAttribute('data-slot-court'),
        isPeak: el.getAttribute('data-slot-peak') === 'true'
      };
      notify();
    });
  });

  // Add-on counters in Booking Summary
  const incRacket = document.querySelector('[data-action="increment-racket"]');
  if (incRacket) {
    incRacket.addEventListener('click', () => {
      if (state.booking.racketsHired < 4) {
        state.booking.racketsHired++;
        notify();
      }
    });
  }
  const decRacket = document.querySelector('[data-action="decrement-racket"]');
  if (decRacket) {
    decRacket.addEventListener('click', () => {
      if (state.booking.racketsHired > 0) {
        state.booking.racketsHired--;
        notify();
      }
    });
  }

  const incBall = document.querySelector('[data-action="increment-ball"]');
  if (incBall) {
    incBall.addEventListener('click', () => {
      if (state.booking.ballsTubes < 3) {
        state.booking.ballsTubes++;
        notify();
      }
    });
  }
  const decBall = document.querySelector('[data-action="decrement-ball"]');
  if (decBall) {
    decBall.addEventListener('click', () => {
      if (state.booking.ballsTubes > 0) {
        state.booking.ballsTubes--;
        notify();
      }
    });
  }

  // Open Booking Modal
  const openBookModalBtn = document.querySelector('[data-action="open-booking-modal"]');
  if (openBookModalBtn) {
    openBookModalBtn.addEventListener('click', () => {
      openModal('booking-modal');
    });
  }

  // Homepage Quick Book submit button
  const quickBookBtn = document.getElementById('quick-book-submit-btn');
  if (quickBookBtn) {
    quickBookBtn.addEventListener('click', () => {
      const qDate = document.getElementById('quick-date-select').value;
      const qCourt = document.getElementById('quick-court-select').value;
      const qDuration = parseInt(document.getElementById('quick-duration-select').value, 10);
      
      state.booking.selectedDateIso = qDate;
      state.booking.selectedCourtFilter = qCourt;
      state.booking.selectedDuration = qDuration;
      state.booking.selectedSlot = null;
      setPage('play');
    });
  }

  // Find a Player Tab Switcher
  document.querySelectorAll('[data-action="switch-match-tab"]').forEach(el => {
    el.addEventListener('click', () => {
      state.findPlayer.activeTab = el.getAttribute('data-tab');
      notify();
    });
  });

  // Join Match Modal Trigger
  document.querySelectorAll('[data-action="join-match-modal"]').forEach(el => {
    el.addEventListener('click', () => {
      const matchId = el.getAttribute('data-match-id');
      const foundMatch = state.findPlayer.matches.find(m => m.id === matchId);
      state.findPlayer.selectedMatchToJoin = foundMatch;
      openModal('join-match-modal');
    });
  });

  // Post Match Form in Tab 2
  const postMatchForm = document.getElementById('post-match-form');
  if (postMatchForm) {
    postMatchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dateVal = document.getElementById('match-date-input').value;
      const timeVal = document.getElementById('match-time-input').value;
      const levelVal = document.getElementById('match-level-input').value;
      const playersVal = parseInt(document.getElementById('match-players-input').value, 10);
      const nameVal = document.getElementById('match-name-input').value;
      const notesVal = document.getElementById('match-notes-input').value;

      // Add to matches list
      const newMatch = {
        id: `match-${Date.now()}`,
        host: nameVal,
        hostLevel: levelVal.split(' ')[0],
        dateDisplay: `${dateVal}, ${timeVal}`,
        courtName: 'Court 1 (Indoor)',
        skillLevel: levelVal.split(' ')[0],
        levelRange: levelVal,
        format: 'Open Doubles Match',
        currentPlayers: playersVal,
        maxPlayers: 4,
        costPerPlayer: 12.50,
        notes: notesVal || 'Friendly game open to all!',
        status: `Looking for ${4 - playersVal} players`
      };

      state.findPlayer.matches.unshift(newMatch);
      state.findPlayer.activeTab = 'browse';
      alert(`Success! Your match request has been posted for ${dateVal}. We'll notify other players.`);
      notify();
    });
  }

  // Interactive Match State Simulator buttons
  document.querySelectorAll('[data-action="simulate-status"]').forEach(el => {
    el.addEventListener('click', () => {
      state.findPlayer.simulatedStatus = el.getAttribute('data-status');
      notify();
    });
  });

  // Classes Inquiry Trigger
  document.querySelectorAll('[data-action="open-class-inquiry"]').forEach(el => {
    el.addEventListener('click', () => {
      const classId = el.getAttribute('data-class-id');
      const foundClass = COACHING_CLASSES.find(c => c.id === classId);
      state.classes.selectedClass = foundClass;
      openModal('class-inquiry-modal');
    });
  });

  // Open Sitemap Modal from footer or any link
  document.querySelectorAll('[data-action="open-sitemap"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal('sitemap-modal');
    });
  });
}

/**
 * Modal Form Submission Events
 */
function attachModalEvents() {
  // Close modal button
  document.querySelectorAll('[data-action="close-modal"]').forEach(el => {
    el.addEventListener('click', () => closeModal());
  });

  // Close when clicking outside dialog
  const backdrop = document.querySelector('.wf-modal-backdrop');
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeModal();
    });
  }

  // Booking Form Submission
  const reserveForm = document.getElementById('booking-reserve-form');
  if (reserveForm) {
    reserveForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('book-name').value;
      const phone = document.getElementById('book-phone').value;
      const email = document.getElementById('book-email').value;

      state.booking.confirmedBooking = {
        reference: `#PADEL-${Math.floor(1000 + Math.random() * 9000)}`,
        name,
        phone,
        email,
        court: state.booking.selectedSlot ? state.booking.selectedSlot.courtAssigned : 'Court 1',
        time: state.booking.selectedSlot ? state.booking.selectedSlot.time : '18:00'
      };

      openModal('booking-success');
    });
  }

  // Join Match Form Submission
  const joinMatchForm = document.getElementById('join-match-form');
  if (joinMatchForm) {
    joinMatchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const match = state.findPlayer.selectedMatchToJoin;
      if (match && match.currentPlayers < match.maxPlayers) {
        match.currentPlayers++;
        if (match.currentPlayers >= match.maxPlayers) {
          match.status = 'Match Full';
        } else {
          match.status = `Looking for ${match.maxPlayers - match.currentPlayers} players`;
        }
      }
      closeModal();
      alert(`Success! You have joined ${match.host}'s game for ${match.dateDisplay}. See you on court!`);
      notify();
    });
  }

  // Class Inquiry Form Submission
  const classInqForm = document.getElementById('class-inquiry-form');
  if (classInqForm) {
    classInqForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('inq-name').value;
      closeModal();
      alert(`Thank you ${name}! Your coaching inquiry has been sent. Coach Carlos will WhatsApp you within 2 hours.`);
    });
  }
}

/**
 * Initialize Client Review Toolbar
 */
function initReviewBar() {
  const pageSelector = document.getElementById('page-selector');
  if (pageSelector) {
    pageSelector.addEventListener('change', (e) => {
      setPage(e.target.value);
    });
  }

  const annotationsBtn = document.getElementById('toggle-annotations-btn');
  if (annotationsBtn) {
    annotationsBtn.addEventListener('click', () => {
      toggleAnnotations();
      annotationsBtn.classList.toggle('is-active', state.showAnnotations);
    });
  }

  const sitemapBtn = document.getElementById('view-sitemap-btn');
  if (sitemapBtn) {
    sitemapBtn.addEventListener('click', () => {
      openModal('sitemap-modal');
    });
  }

  const resetBtn = document.getElementById('reset-prototype-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      resetPrototype();
      alert('Prototype state has been reset to defaults.');
    });
  }

  // Mobile menu toggle
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const navLinks = document.querySelector('.wf-nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      const isVisible = navLinks.style.display === 'flex';
      navLinks.style.display = isVisible ? 'none' : 'flex';
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '68px';
      navLinks.style.left = '0';
      navLinks.style.right = '0';
      navLinks.style.backgroundColor = '#ffffff';
      navLinks.style.padding = '16px';
      navLinks.style.borderBottom = '2px solid #0f172a';
      navLinks.style.zIndex = '999';
    });
  }
}

// Global bootstrap
function bootstrap() {
  initReviewBar();

  // Listen to hash changes for deep linking
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (['home', 'play', 'find-player', 'new-to-padel', 'classes', 'club'].includes(hash)) {
      setPage(hash);
    }
  });

  const initialHash = window.location.hash.replace('#', '');
  if (['home', 'play', 'find-player', 'new-to-padel', 'classes', 'club'].includes(initialHash)) {
    state.currentPage = initialHash;
  }

  subscribe(render);
  render();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}

})();

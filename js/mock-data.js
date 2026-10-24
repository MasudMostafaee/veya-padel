/**
 * Mock Data for Padel Club Low-Fidelity Interactive Wireframe
 */

export const CLUB_INFO = {
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

export const COURTS = [
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
export function getAvailableDates() {
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
export function generateSlotsForDate(dateIso, courtId = "all", durationMinutes = 60) {
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

export const OPEN_MATCHES = [
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

export const COACHING_CLASSES = [
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

export const COACHES = [
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

export const CLUB_FACILITIES = [
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

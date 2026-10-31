# The Padel Club — UX Wireframing & Interactive Prototype

> **Senior UX/UI Design & Front-End Architecture Deliverable**  
> Complete low-fidelity interactive website wireframe designed specifically for a local community padel club transitioning from manual WhatsApp / phone inquiries to a streamlined digital experience.

---

## 1. Project & Business Context

- **Business Profile:** Small, community-oriented padel facility with 4 tournament courts (2 indoor air-conditioned + 2 canopy-covered).
- **Core Challenge:** High staff overhead handling court availability, booking inquiries, beginner questions, and solo player requests manually across WhatsApp, phone calls, and Instagram DMs.
- **Strategic UX Constraint:** Small, non-technical business with a lean operational budget. The interface avoids expensive custom booking infrastructure, mandatory user account creation, heavy passwords, or complex algorithms, using familiar web patterns with direct WhatsApp confirmation handoffs.

---

## 2. Target User Personas & Primary Goals

| User Persona | Context & Behavior | Primary UX Goal | Key Interface Feature |
| :--- | :--- | :--- | :--- |
| **1. The Regular Player** | Books 1–2 times per week; organizes a 4-player group | Fast booking in < 3 clicks; wants clear peak vs. off-peak pricing and transparent per-player cost splits | Date strip, slot status grid, live sticky summary with per-player split calculator |
| **2. The Beginner** | Intrigued by padel's popularity; uncertain about rules or gear | Answers: *"What is it?", "Do I need racket/shoes?", "How do I start?"* | Dedicated "New to Padel" guide, court geometry diagram, Saturday Intro Clinic CTA |
| **3. The Solo Player** | Wants to play but lacks 3 friends to make a four | Find partners at matching skill level without risk of losing money | "Find a Player" matchmaking hub with **guaranteed 100% refund** if minimum 2 players aren't met |
| **4. The Coaching Seeker** | Looking to sharpen wall play, overheads, or enroll kids | Compare clinics vs. 1-on-1 private coaching; review coach credentials | Lesson comparison cards, coach bios, and one-tap WhatsApp / inquiry form |

---

## 3. Information Architecture (Sitemap)

The site uses a strict, non-redundant 4-item primary navigation structure plus a persistent high-conversion header CTA:

```
[ THE PADEL CLUB ] (Logo / Brand Home)
├── 1. PLAY (/play)
│   ├── Quick Date Selector (Next 7 days)
│   ├── Court Filter (All Courts / Indoor AC / Covered Canopy)
│   ├── Duration Switcher (60 Min / 90 Min recommended for doubles)
│   ├── Time Slot Grid (Morning / Afternoon / Evening Peak)
│   ├── Live Booking Summary (Court price + Racket/Ball add-ons + Per-player split)
│   └── Guest Reservation Modal (Contact info, Cancellation policy, WhatsApp PIN confirmation)
│
├── 2. FIND A PLAYER (/find-player)
│   ├── Minimum-Player Rule Explainer (At least 2 players needed)
│   ├── 100% Automatic Refund Guarantee (2h cutoff protection)
│   ├── Tab A: Browse Open Games (Live spot tracker e.g. [●][●][○][○] 2/4 filled)
│   │   └── Join Game Modal (Skill verification, spot hold)
│   ├── Tab B: Post Match Request (Date, time window, skill level, format)
│   └── Interactive Match Status Simulator (Test Pending, Matched, and Refunded states)
│
├── 3. NEW TO PADEL (/new-to-padel)
│   ├── Visual Court Diagram & Glass Rebound Rules
│   ├── Equipment Checklist (Rackets £4 hire, Balls free, Footwear tips)
│   └── Getting Started Pathways (Saturday Intro Clinic £18 vs. Off-peak social court £9/ea)
│
├── 4. CLASSES (/classes)
│   ├── Lesson Catalog: Intro Clinic, Tactical Drills, 1-on-1 Private, Junior Academy
│   ├── Transparent Pricing Placeholders & Schedule Grid
│   ├── Certified Coach Profiles (Credentials, coaching focus, LTA certifications)
│   └── Direct Coaching Inquiry / WhatsApp Handoff Form
│
└── 5. THE CLUB (/club)
    ├── 4 Panoramic Court Specifications (Mondo Supercourt turf, 10m height, LED lighting)
    ├── Club Facilities (Pro shop, cafe lounge, changing rooms, free 28-bay parking)
    ├── Hours of Operation Table (Mon-Fri 07:00-23:00, Sat-Sun 07:30-22:30)
    └── Location Map, Transit Directions & Instant WhatsApp Contact
```

---

## 4. Key Interactive Flows & UX Logic

### Flow A: Court Booking & Cost-Splitting Journey
1. **Homepage Quick Book / Header CTA:** User clicks *"Book a Court"* or filters on the homepage quick-bar.
2. **Date & Slot Picking:** Horizontal date pill strip renders 7 active days. Slots reflect real peak (£48/hr or £68/90m) vs off-peak (£36/hr or £50/90m) pricing.
3. **Transparent Price Cognitive Aid:** Padel court booking is traditionally awkward because one person fronts the payment. The sticky summary dynamically calculates both the total and the **approx. cost per player** (£9.00 to £17.00).
4. **Equipment Add-ons:** Live increment/decrement counters for racket rental (£4/ea) and pressurized balls (£3/tube).
5. **Guest Checkout Modal:** Minimal form (Name, Phone/WhatsApp, Email). No passwords, accounts, or friction.
6. **Confirmation State:** Generates a unique booking code (`#PADEL-XXXX`), summarizes court details, and simulates WhatsApp confirmation with gate PIN.

### Flow B: Solo Player Matching & Refund Guarantee Flow
- **Business Rule:** Matches require at least **2 players** (or 4 for doubles).
- **Refund Policy:** If no match is found **2 hours before game time**, the reservation auto-cancels and triggers a **100% automatic refund**.
- **Interactive Browse & Join:** Users can view active requests with real-time player spot visualizers (`[●][●][○][○]`) and click *"Join Game"*.
- **Post a Request:** Fill in preferred date, time window, and skill rating (Beginner 1.0–2.5, Intermediate 3.0–4.0, Advanced 4.5+).
- **Client Review Simulator:** A built-in UX widget lets stakeholders preview all 3 required match states:
  - **State A (Pending):** Searching for matching players; shows auto-refund countdown.
  - **State B (Matched):** Minimum players reached; locks court and generates check-in reference.
  - **State C (Expired & Refunded):** Threshold not reached 2h prior; demonstrates automated £0 liability refund notification.

### Flow C: Coaching & Clinic Inquiry
- Explores 4 lesson formats from beginner intro clinics (£18) to private 1-on-1s (£55).
- Coach cards highlight real qualifications (LTA Level 3, Spanish FEP credentials, DBS checks).
- Click *"Inquire or Book Session"* to open a focused modal with feedback confirmation.

---

## 5. Low-Fidelity Wireframe Design System

The prototype strictly follows low-fidelity grayscale wireframing principles to focus client conversations on hierarchy, content, and usability:
- **Grayscale Palette:** High-contrast neutral tones (`#0f172a`, `#334155`, `#64748b`, `#cbd5e1`, `#f1f5f9`, `#ffffff`).
- **Placeholder Imagery:** Classic wireframe image boxes featuring diagonal crosslines (`X`) and clear descriptive labels (e.g. `[ Wireframe: Glass Court 1 Interior ]`).
- **Typography & Scale:** Clear heading-to-body ratios with monospace accents for dates, times, and pricing.
- **Client Review Bar:** Sticky top bar with quick page selector, interactive sitemap viewer, state reset button, and toggleable **UX Designer Rationale Notes** (`📝 UX Notes`).

---

## 6. How to Run Locally

The prototype is built with clean, zero-dependency semantic HTML5, CSS3, and ES modules. It runs in any modern browser.

### Option 1: Using Python's Built-in Server
```bash
python3 -m http.server 3000
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Using Node / npx serve
```bash
npm run serve
# or
npx serve -l 3000 .
```

### Option 3: Direct File Open
You can also open `index.html` directly in any web browser supporting ES modules.

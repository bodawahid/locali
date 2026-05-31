import { useState } from 'react';
import { useSEO } from '../lib/seo';
import SafeNextStep from '../components/SafeNextStep';
import { Zap, Calendar, Plane, CheckCircle2, ExternalLink, AlertTriangle, Clock, Shield, DollarSign, MapPin, Luggage } from 'lucide-react';

const BOOKING_STEPS = [
  { step: 'Pick your airport', detail: 'Hurghada (HRG) = most flights, easiest logistics, best all-inclusive choice. Sharm El Sheikh (SSH) = best Red Sea diving, free Sinai-only visa. Luxor (LXR) = direct for history. Cairo (CAI) = every airline, every connection.' },
  { step: 'Book flight first, then hotel', detail: 'Last-minute flights to Egypt often drop to €120–220 from EU cities. Book the flight first. Egyptian hotels rarely sell out outside peak season (November–January) — you have flexibility.' },
  { step: 'Get your visa sorted (easy)', detail: 'Most nationalities: visa on arrival at airport (€20–25 USD cash). Sinai-only visa (Sharm) is FREE. eVisa also available online in 24 hours. No embassy appointment needed.' },
  { step: 'Book just one night in advance', detail: 'Immigration may ask for hotel details. Pre-book your first night only — it\'s fine to stay somewhere cheap. After arrival you can move freely to the best option.' },
  { step: 'Download Careem before landing', detail: 'Egypt\'s most reliable ride-hailing app. Works in all tourist cities. Avoid taxi negotiation stress from minute one. Download it + set up payment before the flight.' },
  { step: 'Buy SIM card on arrival (city, not airport)', detail: 'Vodafone or Orange 15GB SIM: 115–130 EGP (€2.20–2.50) at official stores in town. Airport kiosks charge 380–450 EGP for the same SIM — skip them, connect to airport WiFi first.' },
  { step: 'Have $100–200 USD cash on arrival', detail: 'For visa on arrival ($25 USD), airport taxi (use the official desk inside), and anything before your EGP from the ATM. You can withdraw EGP from bank ATMs once in the city.' },
  { step: 'Install Google Maps offline BEFORE landing', detail: 'Download your destination city\'s map offline. This saves data, works without signal, and is essential for navigating markets, temples, and anywhere outside the resort strip.' },
];

const FLIGHT_SITES = [
  { name: 'Google Flights', url: 'https://flights.google.com', desc: 'Best for price calendar — see the cheapest 7-day window at a glance. Filter by "cheapest month."' },
  { name: 'Skyscanner', url: 'https://www.skyscanner.com', desc: 'Set price alerts for your route. "Everywhere" search finds the cheapest Egypt airport.' },
  { name: 'Kiwi.com', url: 'https://www.kiwi.com', desc: 'Best for unusual routing combinations. Finds connections other sites miss.' },
  { name: 'EasyJet', url: 'https://www.easyjet.com', desc: 'Budget flights from UK/EU to Sharm and Hurghada. Often under £150 return with baggage.' },
  { name: 'Wizz Air', url: 'https://wizzair.com', desc: 'Best budget option from Eastern Europe, Central Europe, and Middle East.' },
  { name: 'Ryanair', url: 'https://www.ryanair.com', desc: 'Expanding Egypt routes from EU cities. Hurghada most common. Check carry-on policy.' },
  { name: 'TUI / Jet2', url: 'https://www.tui.co.uk', desc: 'Package holiday specialists — often cheaper all-in than booking separately. Reliable operators.' },
];

const PACKING_LIST = [
  { item: 'Passport + visa printout (eVisa if used)', critical: true },
  { item: 'USD $100–200 cash for arrival', critical: true },
  { item: 'Prescription medication (hard to source in Egypt)', critical: true },
  { item: 'High-SPF sunscreen (very expensive in Egypt — bring from home)', critical: true },
  { item: 'Reef-safe sun cream (Red Sea dive sites)', critical: false },
  { item: 'Light scarf or shawl (mosques, temples, restaurants)', critical: false },
  { item: 'Power adaptor (Egypt = Type C, European round-pin)', critical: true },
  { item: 'Portable refillable water bottle', critical: false },
  { item: 'Antihistamine + anti-diarrhea tablets', critical: false },
  { item: 'Comfortable walking shoes (temple sites on sand/stone)', critical: true },
  { item: 'Light, loose-fitting clothing (heat + respectful coverage)', critical: true },
  { item: 'Swimwear + quick-dry towel (resorts charge for towels)', critical: false },
  { item: 'Small padlock (for budget accommodation/hostel lockers)', critical: false },
  { item: 'Downloaded travel guide apps (Maps.me, offline Google Maps)', critical: true },
  { item: 'Travel insurance documents (print + digital)', critical: true },
  { item: 'Emergency cash hidden separately from main wallet', critical: false },
];

const BEST_DEALS_PERIODS = [
  { period: 'Right Now — April 2026', discount: '20–35% off', note: 'Post-peak season. Perfect weather (24–30°C). Hotels still filling from winter. Genuine last-minute deals available.', flag: 'NOW' },
  { period: 'May–June 2026', discount: '30–50% off', note: 'Shoulder season. Hot but manageable. Excellent diving visibility. 30–40% fewer tourists at sites.', flag: null },
  { period: 'July–August', discount: '40–60% off', note: 'Cheapest flights and hotels of the year. Very hot (40°C+) but completely manageable at beach/pool resorts. Not for Luxor in July.', flag: null },
  { period: 'September–October', discount: '25–40% off', note: 'Post-summer. Temperatures dropping. Excellent value. Dive visibility excellent.', flag: null },
  { period: 'February–March', discount: '15–25% off', note: 'After peak season. Perfect 22–26°C. Quiet temples. Great all-round last-minute window.', flag: null },
];

const SAFE_CITY_PICKS = [
  {
    city: 'Hurghada',
    emoji: '🏖️',
    duration: '4–7 days',
    best: 'Beach + snorkeling + nightlife',
    why_safe: 'Resort zone is one of Egypt\'s most secure areas. 24h security at all-inclusive properties.',
    why_deals: 'Most flights = most competition = cheapest last-minute prices.',
    note: 'Easiest logistics for last-minute. Most hotel availability. Best charter flight deals from EU.',
    quickbook: 'Book HRG → filter 4-star all-inclusive → done in 10 minutes.',
  },
  {
    city: 'Sharm El Sheikh',
    emoji: '🤿',
    duration: '4–7 days',
    best: 'Diving + Red Sea + luxury',
    why_safe: 'Heavily secured. Heavy tourist police presence throughout Naama Bay.',
    why_deals: 'Sinai-only visa is FREE (save $25). Good last-minute resort availability.',
    note: 'Best for serious divers and snorkelers. Naama Bay is safe to walk at night.',
    quickbook: 'Book SSH → Naama Bay hotel → PADI dive center on arrival.',
  },
  {
    city: 'Luxor',
    emoji: '🏛️',
    duration: '2–4 days',
    best: 'Ancient history — best in world',
    why_safe: 'Tourist police at every site. Well-monitored East Bank Corniche.',
    why_deals: 'Often cheapest to fly into Cairo + overnight train to Luxor (adds genuine adventure).',
    note: 'Combine with Aswan (3h train). Best value of any world-heritage destination per day.',
    quickbook: 'Fly Cairo → train to Luxor → West Bank guesthouse. Budget under €50/day total.',
  },
  {
    city: 'Aswan',
    emoji: '⛵',
    duration: '2–3 days',
    best: 'Nile + Nubian culture + total relaxation',
    why_safe: 'Consistently rated Egypt\'s safest, most relaxed tourist city.',
    why_deals: 'Extremely affordable. $30–60/day all-in. Hotels with Nile view from €20/night.',
    note: 'Perfect add-on to Luxor. Abu Simbel day trip is a once-in-a-lifetime experience.',
    quickbook: 'Fly Cairo → overnight train to Aswan → Corniche hotel → done.',
  },
];

export default function LastMinuteEgypt() {
  const [checkedItems, setCheckedItems] = useState(new Set());

  useSEO({
    title: 'Last Minute Egypt 2026 — Best Deals, Safe Destinations, Quick Booking Guide',
    description: 'Everything you need to book a last-minute trip to Egypt in 2026. Cheapest periods, step-by-step booking guide, safe city picks, packing list, and visa info. Go in 48 hours.',
  });

  const toggle = (i) => setCheckedItems(prev => {
    const next = new Set(prev);
    if (next.has(i)) next.delete(i); else next.add(i);
    return next;
  });

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
          <Zap className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Last Minute Egypt — 2026</h1>
          <p className="text-sm text-muted-foreground">Best deals now · Safe destinations · Book in 48 hours</p>
        </div>
      </div>

      {/* Hero banner */}
      <div className="bg-success/10 border border-success/20 rounded-2xl p-5 mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5 text-success" />
          <span className="font-extrabold text-success">Safe to book now — March 2026</span>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          All major Egypt tourist cities are operating normally. Flights from UK, Germany, Poland, Italy operating as scheduled. Resort occupancy strong. Last-minute deals available — shoulder season pricing active right now.
        </p>
      </div>

      {/* Best deal periods */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-accent" />
        When to Find the Cheapest Egypt Deals
      </h2>
      <div className="space-y-3 mb-10">
        {BEST_DEALS_PERIODS.map((item, i) => (
          <div key={i} className={`bg-card rounded-2xl border p-4 ${item.flag ? 'border-accent/40' : 'border-border/50'}`}>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">{item.period}</h3>
                {item.flag && <span className="text-[9px] font-extrabold bg-accent text-accent-foreground px-1.5 py-0.5 rounded-full animate-pulse">{item.flag}</span>}
              </div>
              <span className="text-[10px] font-extrabold text-accent bg-accent/10 px-2 py-0.5 rounded-full">{item.discount}</span>
            </div>
            <p className="text-xs text-muted-foreground">{item.note}</p>
          </div>
        ))}
      </div>

      {/* Safe destinations */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-success" />
        Safe Destinations for Last-Minute Booking
      </h2>
      <div className="space-y-4 mb-10">
        {SAFE_CITY_PICKS.map((city, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <div className="px-5 py-3 border-b border-border/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{city.emoji}</span>
                <div>
                  <h3 className="font-extrabold">{city.city}</h3>
                  <p className="text-[10px] text-muted-foreground">{city.duration} · Best for: {city.best}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-[10px] font-bold bg-success text-success-foreground px-2 py-0.5 rounded-full">SAFE</span>
              </div>
            </div>
            <div className="p-4 space-y-2">
              <div className="flex items-start gap-2">
                <Shield className="w-3.5 h-3.5 text-success shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground"><strong>Safety:</strong> {city.why_safe}</p>
              </div>
              <div className="flex items-start gap-2">
                <DollarSign className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground"><strong>Deals:</strong> {city.why_deals}</p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">{city.note}</p>
              </div>
              <div className="bg-secondary/50 rounded-xl px-3 py-2 mt-1">
                <p className="text-xs font-bold">⚡ Quick book: <span className="font-normal text-muted-foreground">{city.quickbook}</span></p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Where to find flights */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
        <Plane className="w-5 h-5 text-accent" />
        Where to Find Last-Minute Flights to Egypt
      </h2>
      <div className="space-y-2 mb-10">
        {FLIGHT_SITES.map((site, i) => (
          <a key={i} href={site.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between bg-card rounded-2xl border border-border/50 p-4 hover:border-accent/30 transition-colors group">
            <div className="flex-1">
              <p className="font-bold text-sm group-hover:text-accent transition-colors">{site.name}</p>
              <p className="text-xs text-muted-foreground">{site.desc}</p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground shrink-0 ml-3" />
          </a>
        ))}
      </div>

      {/* Step-by-step booking guide */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-accent" />
        Step-by-Step Booking Guide — Go in 48 Hours
      </h2>
      <div className="space-y-3 mb-10">
        {BOOKING_STEPS.map((item, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-5 flex gap-4">
            <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground font-extrabold text-sm flex items-center justify-center shrink-0">{i + 1}</div>
            <div>
              <h3 className="font-bold text-sm mb-1">{item.step}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 48-hour packing checklist */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
        <Luggage className="w-5 h-5 text-accent" />
        48-Hour Packing Checklist
        <span className="text-xs font-normal text-muted-foreground ml-1">({checkedItems.size}/{PACKING_LIST.length} done)</span>
      </h2>
      <div className="bg-card rounded-2xl border border-border/50 p-5 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {PACKING_LIST.map((item, i) => (
            <button key={i} onClick={() => toggle(i)}
              className={`flex items-center gap-3 text-left rounded-xl px-3 py-2 transition-all ${checkedItems.has(i) ? 'bg-success/10' : 'hover:bg-secondary/50'}`}>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${checkedItems.has(i) ? 'border-success bg-success' : item.critical ? 'border-accent' : 'border-border'}`}>
                {checkedItems.has(i) && <CheckCircle2 className="w-3 h-3 text-white" />}
              </div>
              <p className={`text-xs leading-snug ${checkedItems.has(i) ? 'line-through text-muted-foreground' : item.critical ? 'font-semibold' : ''}`}>
                {item.critical && !checkedItems.has(i) && <span className="text-accent">★ </span>}
                {item.item}
              </p>
            </button>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-3">★ = critical item · Click to check off</p>
      </div>

      {/* Quick price guide */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-accent" />
        What to Budget — Quick Reference
      </h2>
      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-10">
        {[
          ['Visa on arrival', '$25 USD', 'Cash at airport. Free for Sharm (Sinai-only)'],
          ['SIM card 15GB (30 days)', '€2.50', 'Vodafone or Orange official store — NOT airport kiosk'],
          ['Budget hotel per night', '€20–45', 'Hurghada El Dahar or Luxor West Bank guesthouses'],
          ['Mid-range hotel per night', '€40–90', '3-star Naama Bay or Hurghada Marina area'],
          ['All-inclusive 4-star', '€60–120/night', 'Full board — all meals and drinks included'],
          ['Local restaurant meal', '€2–5', 'Koshary, ful, grilled chicken at El Dahar or West Bank'],
          ['Airport taxi (official desk)', '€3–6', 'To hotel in any tourist city from any airport'],
          ['Day trip (activity)', '€8–20', 'Desert safari, snorkeling, temple entry'],
          ['Full diving day (2 dives)', '€18–25', 'With certified PADI operator at marina'],
        ].map(([item, cost, note], i) => (
          <div key={i} className="flex flex-wrap items-start gap-2 px-4 py-3 border-b border-border/20 last:border-0">
            <span className="text-sm flex-1 min-w-0">{item}</span>
            <div className="text-right">
              <span className="text-sm font-bold text-accent">{cost}</span>
              <p className="text-[10px] text-muted-foreground">{note}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <SafeNextStep title="Is Egypt Safe Right Now?" description="Updated safety assessment — March 2026" to="/egypt-safe-now" />
        <SafeNextStep title="Before You Land Checklist" description="Full arrival preparation guide" to="/before-you-land" />
        <SafeNextStep title="Real Prices — Know Before You Go" description="What everything costs so there are no surprises" to="/price-checker" />
        <SafeNextStep title="Why Egypt vs Dubai Right Now" description="Full comparison — safety, cost, and experience" to="/egypt-vs-dubai" />
      </div>
    </div>
  );
}
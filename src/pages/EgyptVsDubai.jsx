import { useSEO, buildFAQSchema } from '../lib/seo';
import SafeNextStep from '../components/SafeNextStep';
import { CheckCircle2, DollarSign, Plane, Shield, Star, Sun, Thermometer, Clock, Wifi, AlertTriangle, XCircle } from 'lucide-react';

const DESTINATIONS = [
  { id: 'egypt',     flag: '🇪🇬', name: 'Egypt',     tagline: 'Best value. World-class reef. 7,000 years of history.',     badge: '⭐ BEST VALUE 2026',   badgeColor: 'bg-accent text-accent-foreground' },
  { id: 'dubai',     flag: '🇦🇪', name: 'Dubai',     tagline: '⚠️ US "Reconsider Travel" advisory — March 2026.',           badge: '⚠️ TRAVEL WARNING',   badgeColor: 'bg-red-500 text-white' },
  { id: 'turkey',    flag: '🇹🇷', name: 'Turkey',    tagline: 'Good value, strong culture, big flight network.',            badge: 'Good Alternative',     badgeColor: 'bg-secondary text-muted-foreground' },
  { id: 'vietnam',   flag: '🇻🇳', name: 'Vietnam',   tagline: '10–13h flight from Europe. No monsoon-free season.',         badge: 'Long-haul Budget',     badgeColor: 'bg-secondary text-muted-foreground' },
  { id: 'bali',      flag: '🇮🇩', name: 'Bali',      tagline: 'Beautiful but 16–22h flight. Overtourism issues.',           badge: 'Long-haul',            badgeColor: 'bg-secondary text-muted-foreground' },
  { id: 'singapore', flag: '🇸🇬', name: 'Singapore', tagline: 'City-state stopover. One of the world\'s most expensive.',   badge: 'Expensive Stopover',   badgeColor: 'bg-secondary text-muted-foreground' },
  { id: 'thailand',  flag: '🇹🇭', name: 'Thailand',  tagline: 'Affordable but 10–12h flight. Monsoon risks Apr–Oct.',       badge: 'Long-haul Budget',     badgeColor: 'bg-secondary text-muted-foreground' },
];

const COMPARISON = [
  {
    category: 'Daily Cost for Tourists',
    icon: DollarSign,
    egypt:     { score: 5, points: ['Budget meal: €2–4', 'Taxi: €1–3 per trip', 'Hotel 3★: €20–50/night', 'Diving/Desert: €8–20', 'SIM 15GB: €2.50'] },
    dubai:     { score: 1, points: ['Budget meal: €14–25', 'Taxi: €10–20 per trip', 'Hotel 3★: €90–200/night', 'Activity: €60–180', 'SIM: €14–22'] },
    turkey:    { score: 4, points: ['Budget meal: €4–9', 'Taxi: €3–8', 'Hotel 3★: €28–70/night', 'Activity: €15–40', 'SIM 15GB: €5–8'] },
    vietnam:   { score: 4, points: ['Budget meal: €2–5', 'Taxi: €1–4', 'Hotel 3★: €25–55/night', 'Activity: €10–25', 'SIM 15GB: €3–5'] },
    bali:      { score: 4, points: ['Budget meal: €3–7', 'Grab: €2–5', 'Hotel 3★: €30–70/night', 'Activity: €15–35', 'SIM 15GB: €4–6'] },
    singapore: { score: 1, points: ['Budget meal: €10–18', 'MRT/Taxi: €2–15', 'Hotel 3★: €110–220/night', 'Activity: €30–100', 'SIM: €8–15'] },
    thailand:  { score: 4, points: ['Budget meal: €2–5', 'Tuk-tuk: €1–5', 'Hotel 3★: €25–60/night', 'Activity: €10–30', 'SIM 15GB: €4–7'] },
    verdict: '🇪🇬 Egypt wins on value',
    note: 'Egypt is the only destination with world-class Red Sea diving at €8–20/day. Vietnam & Thailand match on price but need 10–22h flights. Singapore and Dubai are 4–6x more expensive.',
  },
  {
    category: 'Flight Distance & Price from Europe',
    icon: Plane,
    egypt:     { score: 5, points: ['4–5h flight from EU', 'Charter return: €130–280', 'Budget airlines: Ryanair, EasyJet, Wizz', 'Weekly charters from 20+ EU cities'] },
    dubai:     { score: 3, points: ['6–7h from EU', '⚠️ Reduced bookings (Iran conflict)', 'Return: €300–700', 'Emirates still operating'] },
    turkey:    { score: 5, points: ['3–4h from EU', 'Return: €90–230', 'Most EU cities connected', 'Budget options available'] },
    vietnam:   { score: 1, points: ['10–13h from EU (1+ stop)', 'Return: €450–900', 'No budget options from Europe', 'Long travel = shorter holiday'] },
    bali:      { score: 1, points: ['16–22h from EU (2 stops)', 'Return: €650–1,200', 'Exhausting travel', 'Jet lag 2–3 days lost'] },
    singapore: { score: 2, points: ['12–14h from EU (1 stop)', 'Return: €600–1,100', 'Stopover, not a beach trip', 'No beach — city only'] },
    thailand:  { score: 2, points: ['10–12h from EU (1 stop)', 'Return: €450–850', 'Monsoon risks Apr–Oct', 'No cheap EU charters'] },
    verdict: '🇪🇬 Egypt & 🇹🇷 Turkey win on proximity',
    note: 'Egypt and Turkey are 4h from Europe. Vietnam, Bali, Thailand, Singapore require 10–22h — meaning shorter holidays, jet lag, and 3x the flight cost.',
  },
  {
    category: 'Beach & Water Quality',
    icon: Sun,
    egypt:     { score: 5, points: ['Red Sea visibility: 20–40m', 'Water 22–28°C year-round', 'Top-10 coral reef globally', 'No jellyfish, no monsoon', 'Warm even in December'] },
    dubai:     { score: 2, points: ['Persian Gulf: murky, limited reef', 'Artificial islands (Palm Jumeirah)', 'Jellyfish common in summer', '40°C+ June–September'] },
    turkey:    { score: 4, points: ['Mediterranean/Aegean: clear blue', 'Good May–October only', 'Can be crowded at peak', 'No coral reef diving'] },
    vietnam:   { score: 3, points: ['Some good beaches (Da Nang, Phu Quoc)', 'Monsoon makes many unusable', 'Visibility: 5–15m (vs 20–40m in Egypt)', 'Jellyfish season May–Oct'] },
    bali:      { score: 3, points: ['Surf beaches (Kuta, Canggu)', 'Visibility 5–15m only', 'Rainy season Oct–Apr disrupts', 'Coral bleaching issues'] },
    singapore: { score: 1, points: ['Sentosa: artificial, murky', 'No snorkeling or diving', 'Sea is a shipping lane', 'Not a beach destination'] },
    thailand:  { score: 4, points: ['Phi Phi, Krabi, Phuket: beautiful', 'Monsoon Apr–Oct closes south islands', 'Visibility 5–20m in season', 'Mass tourism degraded some reefs'] },
    verdict: '🇪🇬 Egypt — best year-round beach, no contest',
    note: 'Egypt\'s Red Sea has 20–40m visibility year-round with zero monsoon risk. Vietnam and Bali are seasonal only. Singapore has no beach at all.',
  },
  {
    category: 'Safety Right Now — April 2026',
    icon: Shield,
    egypt:     { score: 4, points: ['UK FCO: Normal precautions only', 'Resort zones: 24h security', 'Tourist police at all major sites', '15.7M tourists safely in 2024', 'Not on any conflict warning list'] },
    dubai:     { score: 2, points: ['🚨 US State Dept: "RECONSIDER TRAVEL" Mar 2026', 'Iran targeted UAE-linked businesses', 'US/Israel strikes on Iran — UAE proximity', 'UK FCDO: Heightened vigilance', 'Travel insurance may be invalidated'] },
    turkey:    { score: 4, points: ['Stable — NATO member', 'Away from Iran conflict zone', 'Some protest risks in Istanbul', 'EU travel advisory: normal precautions'] },
    vietnam:   { score: 5, points: ['Very stable — no regional conflict', 'Far from any Middle East conflict', 'Low crime for tourists', 'No travel advisory from US or EU'] },
    bali:      { score: 5, points: ['Stable — far from conflict', 'Low crime in tourist areas', 'No major travel advisories', 'Natural disaster risk only (volcanoes)'] },
    singapore: { score: 5, points: ['One of safest cities globally', 'Zero conflict exposure', 'Strict law enforcement', 'No travel advisories'] },
    thailand:  { score: 4, points: ['Generally safe for tourists', 'Away from Middle East conflict', 'UK FCO: Normal precautions', 'Deep South: avoid'] },
    verdict: '⚠️ Dubai downgraded — Egypt & SE Asia safe',
    note: 'Dubai carries a US "Reconsider Travel" advisory (March 2, 2026) for the first time. Egypt\'s tourist areas are specifically listed as unaffected by regional tensions.',
  },
  {
    category: 'Historical & Cultural Depth',
    icon: Star,
    egypt:     { score: 5, points: ['7,000 years of civilization', 'Pyramids, Valley of Kings, Abu Simbel', 'Living Nubian culture in Aswan', 'Most concentrated ancient history on earth'] },
    dubai:     { score: 1, points: ['50-year-old city', 'Malls, skyscrapers, artificial islands', 'Very limited local culture', 'Highly international — little "local"'] },
    turkey:    { score: 5, points: ['Byzantine, Ottoman, Roman, Greek layers', 'Istanbul, Cappadocia, Ephesus', 'Rich and diverse food culture', 'Unique East-West blend'] },
    vietnam:   { score: 4, points: ['French colonial + Vietnamese history', 'Hue, Hoi An, Hanoi old towns', 'War history (USA, France)', 'Unique cuisine and culture'] },
    bali:      { score: 4, points: ['Unique Hindu culture in Muslim Indonesia', 'Temples, rice terraces, ceremonies', 'Art and craft traditions', 'Limited pre-colonial history'] },
    singapore: { score: 2, points: ['Modern city-state, founded 1965', 'Multicultural food culture', 'No ancient history', 'Financial hub, not cultural'] },
    thailand:  { score: 4, points: ['Buddhist temples and culture', 'Chiang Mai, Ayutthaya, Bangkok', 'Rich food culture globally', 'Royal history and tradition'] },
    verdict: '🇪🇬 Egypt — unmatched ancient history',
    note: 'Egypt has 7,000 years of traceable history. No destination competes with the density and scale of Egyptian civilization.',
  },
  {
    category: 'Visa & Entry Ease',
    icon: Clock,
    egypt:     { score: 5, points: ['Visa on arrival: $30', 'Free Sinai-only for most EU', 'No pre-approval needed', 'Book and fly in 24h'] },
    dubai:     { score: 4, points: ['Visa on arrival for most EU', '⚠️ Insurance may be invalidated', 'Some nationalities need pre-approval', 'Straightforward entry process'] },
    turkey:    { score: 5, points: ['Visa-free for EU citizens', 'eVisa for others', 'Quick online process', 'No issues at border'] },
    vietnam:   { score: 3, points: ['eVisa required: $25', '3–5 days processing time', 'eVisa-free for some EU (90 days)', 'Cannot book last-minute'] },
    bali:      { score: 4, points: ['Visa on arrival: $35', 'Easy at airport', 'Social media content risk', '30-day limit standard'] },
    singapore: { score: 5, points: ['Visa-free for most EU/US', '30–90 days standard', 'Simple arrival card', 'Strict customs (drugs)'] },
    thailand:  { score: 5, points: ['Visa-free 30–60 days most EU', 'Exemption extension available', 'Easy entry', 'Long-stay needs visa run'] },
    verdict: '🇪🇬 Egypt & 🇹🇷 Turkey — most last-minute friendly',
    note: 'Egypt can be booked and departed within 24h with no pre-approval needed. Vietnam needs 3–5 day eVisa processing.',
  },
  {
    category: 'Internet & Remote Work',
    icon: Wifi,
    egypt:     { score: 4, points: ['4G: Vodafone, Orange, Etisalat', '15GB SIM: €2.50', 'Full WhatsApp + VoIP', 'Good resort city coverage'] },
    dubai:     { score: 4, points: ['World-class 5G', '⚠️ VoIP calls restricted', 'SIM: €14–22', 'Fastest in region'] },
    turkey:    { score: 4, points: ['Good 4G coverage', 'Some social media throttling', 'SIM 15GB: €5–8', 'Good in major cities'] },
    vietnam:   { score: 4, points: ['Fast 4G, cheap SIM', 'SIM 20GB: €3–5', 'Some sites blocked intermittently', 'Good city coverage'] },
    bali:      { score: 3, points: ['Variable speeds', 'Good in Kuta/Canggu', 'Weaker outside tourist zones', 'SIM 10GB: €5–8'] },
    singapore: { score: 5, points: ['World-class 5G everywhere', 'Full internet freedom', 'SIM: €10–15', 'Best in Asia'] },
    thailand:  { score: 4, points: ['Good 4G coverage', 'Some restrictions', 'SIM 15GB: €4–7', 'Reliable in tourist areas'] },
    verdict: '🇪🇬 Egypt (value) / 🇸🇬 Singapore (speed)',
    note: 'Egypt offers the cheapest data (€2.50 for 15GB) with full VoIP. Dubai has fast speeds but restricts VoIP. Singapore is the best for remote work.',
  },
];

const SCORE_DOTS = (score) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <div key={i} className={`w-2 h-2 rounded-full ${i <= score ? 'bg-accent' : 'bg-border'}`} />
    ))}
  </div>
);

const BUDGET_TABLE = [
  ['Return flights (EU)', '€130–280', '€300–700', '€90–230', '€450–900', '€650–1,200', '€600–1,100', '€450–850'],
  ['Hotel 7 nights (3★)', '€140–350', '€630–1,400', '€196–490', '€175–385', '€210–490', '€770–1,540', '€175–420'],
  ['Food (7 days)', '€70–140', '€294–588', '€105–210', '€98–245', '€126–350', '€210–490', '€98–245'],
  ['Activities', '€80–180', '€280–560', '€120–280', '€70–175', '€105–245', '€210–420', '€105–280'],
  ['Local transport', '€20–40', '€80–160', '€30–70', '€35–70', '€35–70', '€70–140', '€35–70'],
  ['SIM card', '€3–5', '€14–22', '€5–10', '€3–5', '€4–6', '€10–15', '€4–7'],
  ['TOTAL 7 days/pp', '€440–995', '€1,600–3,430', '€550–1,290', '€830–1,820', '€1,130–2,355', '€1,870–3,705', '€870–1,872'],
];

const DUBAI_WARNING_SOURCES = [
  { source: 'US State Department', date: 'March 2, 2026', level: 'Level 3: Reconsider Travel', note: 'Threat of armed conflict due to Iran-US tensions' },
  { source: 'UK FCDO', date: 'March 2026', level: 'Heightened vigilance', note: 'Iranian regime stated intention to target US/Israel-linked businesses in UAE' },
  { source: 'US Embassy UAE', date: 'March 3, 2026', level: 'Emergency Alert', note: 'Reconsider travel due to threat of armed conflict and terrorism' },
];

const FLIGHT_STATUS = [
  { route: 'London → Hurghada / Sharm', airlines: 'EasyJet, Jet2, TUI, Thomas Cook' },
  { route: 'Berlin / Frankfurt → Hurghada', airlines: 'Condor, TUI fly, Ryanair' },
  { route: 'Warsaw / Krakow → Hurghada', airlines: 'Wizz Air, Enter Air, LOT' },
  { route: 'Moscow → Hurghada / Sharm', airlines: 'Ural Airlines, S7, Azur Air' },
  { route: 'Amsterdam → Sharm El Sheikh', airlines: 'TUI, Corendon, Transavia' },
  { route: 'Paris → Cairo / Hurghada', airlines: 'Air France, Transavia, Air Cairo' },
  { route: 'Rome / Milan → Hurghada', airlines: 'Neos, Blue Panorama, Alpitour' },
];

const FAQS = [
  { q: 'Is Dubai safe to visit in 2026?', a: 'The US State Department issued a Level 3 "Reconsider Travel" advisory for the UAE on March 2, 2026, citing the threat of armed conflict and terrorism related to the US-Iran tensions. The UK FCDO also advises heightened vigilance. Check current advisories before booking and verify your travel insurance covers the UAE under active advisories.' },
  { q: 'How does Egypt compare to Vietnam for a beach holiday from Europe?', a: 'Egypt wins for Europeans on: (1) flight time — 4–5h vs 10–13h, (2) Red Sea visibility 20–40m vs Vietnam\'s 5–15m, (3) no monsoon season, (4) flights 3x cheaper. Vietnam wins on unique SE Asian culture. For a beach holiday from Europe, Egypt is objectively better value per hour of travel.' },
  { q: 'Is Bali or Egypt better for European tourists in 2026?', a: 'Egypt is better for Europeans: 4–5h flight vs 16–22h for Bali, flights 3x cheaper, comparable daily costs, superior underwater visibility, no jet lag, and year-round warmth without monsoon. Bali excels for surfing culture and Hindu temple immersion.' },
  { q: 'Why choose Egypt over Singapore?', a: 'Singapore is a city-state transit hub, not a beach destination. It has no snorkeling or diving, minimal beaches (artificial), costs 4–6x more per day, and requires a 12–14h flight from Europe. Egypt offers real beaches, world-class Red Sea diving, ancient history, and a fraction of the cost.' },
  { q: 'Is Thailand cheaper than Egypt for a 7-day holiday from Europe?', a: 'When you include flights, Thailand is actually more expensive than Egypt for Europeans. Thailand flights from Europe cost €450–850 return vs Egypt\'s €130–280. Daily costs are similar, but Egypt\'s much cheaper flights make the total trip significantly cheaper. Egypt also has no monsoon disruption.' },
];

const COL_HEADERS = ['🇪🇬 Egypt', '🇦🇪 Dubai', '🇹🇷 Turkey', '🇻🇳 Vietnam', '🇮🇩 Bali', '🇸🇬 Singapore', '🇹🇭 Thailand'];

export default function EgyptVsDubai() {
  useSEO({
    title: 'Egypt vs Dubai vs Vietnam vs Bali vs Singapore vs Thailand 2026',
    description: 'Is Dubai safe in 2026? US advisory says "Reconsider Travel". How does Egypt compare to Vietnam, Bali, Singapore, Thailand, and Turkey? Full honest comparison on cost, safety, beaches, and flights.',
    jsonLd: buildFAQSchema(FAQS),
  });

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">

      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Egypt vs Dubai vs SE Asia 2026 — The Real Comparison</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Honest comparison across cost, safety, beaches, flights, and culture. No sponsorship. Data from UK FCDO, US State Dept, and real traveler reports — April 2026.
        </p>
      </div>

      {/* Dubai Warning */}
      <div className="bg-red-500/10 border-2 border-red-500/40 rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h2 className="font-extrabold text-base text-red-600 mb-2">🚨 Dubai / UAE — OFFICIAL TRAVEL WARNING — March 2026</h2>
            <p className="text-sm text-muted-foreground mb-3">
              The <strong>US State Department</strong> issued a <strong>Level 3 "Reconsider Travel"</strong> advisory for the UAE on <strong>March 2, 2026</strong>, following US-Israel military strikes on Iran. Iran stated intention to target US/Israel-linked businesses in UAE.
            </p>
            <div className="space-y-2 mb-3">
              {DUBAI_WARNING_SOURCES.map((s, i) => (
                <div key={i} className="bg-red-500/5 border border-red-500/20 rounded-xl px-3 py-2 flex items-start gap-2">
                  <XCircle className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold text-red-600">{s.source} — {s.date}: {s.level}</p>
                    <p className="text-[11px] text-muted-foreground">{s.note}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground"><strong>Bottom line:</strong> Travel insurance for UAE may be invalidated under current advisories. Egypt's tourist areas are <strong>completely unaffected</strong> by this conflict.</p>
          </div>
        </div>
      </div>

      {/* Egypt safe banner */}
      <div className="bg-success/10 border border-success/30 rounded-2xl p-4 mb-8 flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-sm text-success mb-1">Egypt Tourist Areas: No Travel Advisory — April 2026</p>
          <p className="text-xs text-muted-foreground">UK FCDO rates Sharm, Hurghada, Luxor, and Aswan as "normal precautions only." All European flights operating. 15.7M tourists visited safely in 2024.</p>
        </div>
      </div>

      {/* Destination overview */}
      <h2 className="text-xl font-extrabold mb-4">All Destinations — Quick Overview</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
        {DESTINATIONS.map((d) => (
          <div key={d.id} className={`border rounded-2xl p-3 text-center ${d.id === 'egypt' ? 'border-accent bg-accent/5' : d.id === 'dubai' ? 'border-red-500/40 bg-red-500/5' : 'border-border bg-card'}`}>
            <p className="text-2xl mb-1">{d.flag}</p>
            <p className="font-extrabold text-sm">{d.name}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{d.tagline}</p>
            <div className={`mt-2 text-[9px] font-bold rounded-full px-2 py-0.5 inline-block ${d.badgeColor}`}>{d.badge}</div>
          </div>
        ))}
      </div>

      {/* Flight status */}
      <h2 className="text-xl font-extrabold mb-4 flex items-center gap-2">
        <Plane className="w-5 h-5 text-accent" /> Egypt Flight Status — April 2026
      </h2>
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden mb-10">
        <div className="px-4 py-3 bg-success/10 border-b border-success/20 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs font-bold text-success">ALL MAJOR EGYPT ROUTES OPERATING NORMALLY</span>
        </div>
        <div className="divide-y divide-border/20">
          {FLIGHT_STATUS.map((f, i) => (
            <div key={i} className="px-4 py-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold">{f.route}</p>
                <p className="text-xs text-muted-foreground">{f.airlines}</p>
              </div>
              <span className="text-[10px] font-bold bg-success/10 text-success border border-success/20 px-2 py-0.5 rounded-full shrink-0">✅ Operating</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category comparisons */}
      <h2 className="text-xl font-extrabold mb-4">Category-by-Category — All 7 Destinations</h2>
      <div className="space-y-4 mb-10">
        {COMPARISON.map((cat, i) => {
          const Icon = cat.icon;
          const cols = [
            { label: '🇪🇬 Egypt', data: cat.egypt },
            { label: '🇦🇪 Dubai', data: cat.dubai },
            { label: '🇹🇷 Turkey', data: cat.turkey },
            { label: '🇻🇳 Vietnam', data: cat.vietnam },
            { label: '🇮🇩 Bali', data: cat.bali },
            { label: '🇸🇬 Singapore', data: cat.singapore },
            { label: '🇹🇭 Thailand', data: cat.thailand },
          ];
          return (
            <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              <div className="px-5 py-3 border-b border-border/30 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-accent" />
                  <h3 className="font-extrabold text-sm">{cat.category}</h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-accent-foreground">{cat.verdict}</span>
              </div>
              <div className="overflow-x-auto">
                <div className="flex divide-x divide-border/30 min-w-[700px]">
                  {cols.map(({ label, data }) => (
                    <div key={label} className={`p-3 flex-1 min-w-[100px] ${label.includes('Dubai') ? 'bg-red-500/5' : ''}`}>
                      <div className="flex items-center justify-between mb-2 gap-1">
                        <span className="text-[10px] font-bold">{label}</span>
                        {SCORE_DOTS(data.score)}
                      </div>
                      <ul className="space-y-0.5">
                        {data.points.map((p, j) => (
                          <li key={j} className={`text-[10px] flex gap-1 ${p.startsWith('⚠️') || p.startsWith('🚨') ? 'text-red-500 font-semibold' : 'text-muted-foreground'}`}>
                            {!p.startsWith('⚠️') && !p.startsWith('🚨') && <CheckCircle2 className="w-2.5 h-2.5 text-success shrink-0 mt-0.5" />}
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="px-5 py-2.5 bg-secondary/40 border-t border-border/30">
                <p className="text-xs text-muted-foreground italic">💡 {cat.note}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Budget table */}
      <h2 className="text-xl font-extrabold mb-4">7-Day All-In Budget — Per Person from Europe</h2>
      <div className="overflow-x-auto mb-10">
        <div className="bg-card rounded-2xl border border-border/50 overflow-hidden min-w-[640px]">
          <div className="grid border-b border-border/30 bg-secondary/50" style={{gridTemplateColumns: '1.5fr repeat(7, 1fr)'}}>
            <div className="p-3 text-xs font-bold text-muted-foreground">Expense</div>
            {COL_HEADERS.map((h, i) => (
              <div key={i} className={`p-2 text-[10px] font-bold border-l border-border/30 text-center ${i === 0 ? 'text-accent bg-accent/5' : i === 1 ? 'text-red-500' : ''}`}>{h}</div>
            ))}
          </div>
          {BUDGET_TABLE.map((row, i) => (
            <div key={i} className={`grid border-b border-border/20 last:border-0 ${i === BUDGET_TABLE.length - 1 ? 'bg-secondary/30 font-bold' : ''}`} style={{gridTemplateColumns: '1.5fr repeat(7, 1fr)'}}>
              <div className="p-3 text-xs text-muted-foreground">{row[0]}</div>
              {row.slice(1).map((val, j) => (
                <div key={j} className={`p-2 text-[10px] border-l border-border/30 text-center ${j === 0 ? 'font-bold text-accent bg-accent/5' : j === 1 ? 'text-red-500/80' : ''}`}>{val}</div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Why Egypt now */}
      <h2 className="text-xl font-extrabold mb-4">Why Egypt — Specifically Right Now</h2>
      <div className="space-y-2 mb-10">
        {[
          { emoji: '🚨', title: 'Dubai has a US "Reconsider Travel" warning — Egypt doesn\'t', desc: 'First time in modern history the UAE carries a Level 3 advisory. Egypt\'s tourist cities (Hurghada, Sharm, Luxor, Aswan) carry zero conflict-related travel warnings from any major government.' },
          { emoji: '💰', title: 'EGP devaluation = best value moment in 20 years', desc: 'The Egyptian pound devalued since 2022. Your euros and dollars buy 2–3x more than in 2019 — one of the best value windows in Egypt\'s modern tourist history.' },
          { emoji: '✈️', title: '4–5h flight — no jet lag, 3x cheaper than SE Asia flights', desc: 'Vietnam is 10–13h from Europe. Bali is 16–22h. Thailand is 10–12h. Egypt is 4–5h. That means 2–3 extra real holiday days and flights at a fraction of the price.' },
          { emoji: '🤿', title: 'Red Sea visibility: 20–40m — SE Asia: 5–15m', desc: 'The Red Sea has objectively better underwater visibility than Vietnam, Bali, or Thailand, with zero monsoon closures and warm water year-round. World top-10 dive sites from €8–20/day.' },
          { emoji: '🏛️', title: 'No other destination has 7,000 years of history', desc: 'Dubai is 50 years old. Singapore is 60. Vietnam, Bali, Thailand have fascinating cultures — but none rival the scale of Egyptian civilization: Pyramids, Luxor, Abu Simbel, Valley of Kings.' },
          { emoji: '🌡️', title: 'No monsoon. Warm in December. No typhoon risk.', desc: 'Thailand, Vietnam, and Bali all have monsoon seasons closing beaches and reducing visibility. Egypt\'s Red Sea coast has near-zero rainfall, operating at full capacity all 12 months.' },
        ].map((item, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4 flex gap-3">
            <span className="text-2xl shrink-0">{item.emoji}</span>
            <div>
              <p className="font-bold text-sm mb-1">{item.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <h2 className="text-xl font-extrabold mb-4">Common Questions — Answered</h2>
      <div className="space-y-3 mb-10">
        {FAQS.map((faq, i) => (
          <div key={i} className="bg-card border border-border/50 rounded-2xl p-4">
            <p className="font-bold text-sm mb-1.5">Q: {faq.q}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">A: {faq.a}</p>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 mb-8">
        <h2 className="font-extrabold text-lg mb-3">Honest Verdict — April 2026</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p><strong className="text-foreground">🇪🇬 Choose Egypt if:</strong> you want world-class diving, ancient history, warm Red Sea beaches, and 3–5x more value per euro — from a 4–5h flight with no travel advisory. Best value in the Mediterranean/Middle East right now.</p>
          <p><strong className="text-foreground">🇦🇪 Avoid Dubai right now:</strong> the US Level 3 advisory and FCDO heightened vigilance make UAE a risk destination for the first time. Verify insurance coverage before booking.</p>
          <p><strong className="text-foreground">🇹🇷 Turkey:</strong> great balance of culture, value, and beach with Europe's best flight connections.</p>
          <p><strong className="text-foreground">🇻🇳🇮🇩🇹🇭 SE Asia:</strong> worth it if you specifically want that culture. But for Europeans, Egypt wins on total value when you factor in flight cost and time.</p>
          <p><strong className="text-foreground">🇸🇬 Singapore:</strong> world-class city stopover — not a beach or leisure holiday destination.</p>
        </div>
      </div>

      <div className="bg-secondary/50 rounded-xl p-3 text-[10px] text-muted-foreground mb-8">
        <strong>Sources:</strong> US State Department Travel Advisory (March 2, 2026) · UK FCDO Egypt Travel Advice (April 2026) · Booking.com / Skyscanner price ranges · Egyptian Ministry of Tourism statistics · Locali Egypt community reports.
      </div>

      <div className="space-y-3">
        <SafeNextStep title="Is Egypt Safe Right Now?" description="Full current safety assessment for 2026" to="/egypt-safe-now" />
        <SafeNextStep title="Middle East Safety Map" description="Egypt's stability vs surrounding region" to="/middle-east-safety-map" />
        <SafeNextStep title="Last Minute Egypt — Book Fast" description="Best deals, booking guide, packing list" to="/last-minute-egypt" />
        <SafeNextStep title="Check Real Prices in Egypt" description="What everything actually costs in EGP" to="/price-checker" />
      </div>
    </div>
  );
}
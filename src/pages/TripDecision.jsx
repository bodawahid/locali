import { useState } from 'react';
import { useSEO } from '../lib/seo';
import { CheckCircle2, AlertTriangle, XCircle, ChevronRight, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeNextStep from '../components/SafeNextStep';

const CITIES = [
  { id: 'sharm-el-sheikh', label: 'Sharm El Sheikh', emoji: '🤿' },
  { id: 'hurghada', label: 'Hurghada', emoji: '🏖️' },
  { id: 'luxor', label: 'Luxor', emoji: '🏛️' },
  { id: 'aswan', label: 'Aswan', emoji: '⛵' },
];

const TRIP_TYPES = [
  { id: 'solo', label: 'Solo', emoji: '🧍' },
  { id: 'couple', label: 'Couple', emoji: '👫' },
  { id: 'family', label: 'Family with kids', emoji: '👨‍👩‍👧' },
  { id: 'group', label: 'Group of friends', emoji: '👥' },
];

const CONCERNS = [
  { id: 'low', label: 'I\'m flexible & adventurous', emoji: '😎' },
  { id: 'medium', label: 'Some concerns, want info', emoji: '🤔' },
  { id: 'high', label: 'Very concerned about safety', emoji: '😟' },
];

const DECISIONS = {
  'sharm-el-sheikh': {
    solo: {
      low: { verdict: 'GO', color: 'success', explanation: 'Sharm is one of the most solo-friendly destinations in the region. Naama Bay is lively and patrolled 24h. Dive community is excellent.', tips: ['Book a dive center on day 1 — instant community', 'Naama Bay strip is safe to walk at night', 'Use Careem for all transport'] },
      medium: { verdict: 'GO', color: 'success', explanation: 'Sharm El Sheikh is well set up for solo travelers. The main areas are tourist-focused with strong security. Main tip: use verified transport, stick to the main strip.', tips: ['Download this site\'s scam alerts before arrival', 'Tourist Police: 126 saved on your phone', 'Pre-book airport taxi via hotel'] },
      high: { verdict: 'GO WITH PREP', color: 'caution', explanation: 'Sharm is actually one of the safer Middle Eastern tourist destinations. Your concerns are understandable but the reality in resort zones is much calmer than media portrays.', tips: ['Book all-inclusive resort — everything handled', 'Your concerns about the region are valid for North Sinai — Sharm is 350km away', 'Travel insurance with medical evacuation recommended'] },
    },
    couple: {
      low: { verdict: 'GO', color: 'success', explanation: 'Sharm is a couple\'s paradise. Diving, sunsets, good restaurants, beach clubs. Very romantic setting.', tips: ['Naama Bay nightlife is easy and fun', 'Book a live-aboard diving trip for something special', 'Sunset from a felucca — ask at any marina'] },
      medium: { verdict: 'GO', color: 'success', explanation: 'Ideal for couples. Well-developed tourist infrastructure, good restaurants, and beach access. Plan activities in advance.', tips: ['Use verified dive centers only', 'Restaurant prices on the main strip are fair', 'Try Old Market for authentic local dinner'] },
      high: { verdict: 'GO', color: 'success', explanation: 'Couple travel in Sharm is very comfortable. Resort hotels are safe bubbles. You can stay almost entirely in the tourist zone if that helps.', tips: ['All-inclusive resorts give you complete control', 'Tourist police are visible everywhere in Naama Bay', 'No need to leave resort zone if uncomfortable'] },
    },
    family: {
      low: { verdict: 'GO', color: 'success', explanation: 'Excellent for families. Calm Red Sea, kid-friendly beaches, world-class snorkeling suitable for all ages.', tips: ['Naama Bay beach has lifeguards', 'Glass-bottom boat trips for kids who don\'t dive', 'Most resorts have kids clubs'] },
      medium: { verdict: 'GO', color: 'success', explanation: 'Sharm is very family-oriented. Resorts are designed around family tourism. The calm sea is ideal for children.', tips: ['Stick to PADI certified snorkel/dive operators', 'Use hotel-arranged transport for all excursions', 'Avoid Old Market in high heat midday with small kids'] },
      high: { verdict: 'GO', color: 'success', explanation: 'One of the most family-safe beach destinations in the region. Resort zones are extremely controlled environments.', tips: ['Book 4-5 star resort with kids club', 'All activities can be booked safely through the hotel', 'Thousands of European families visit every week'] },
    },
    group: {
      low: { verdict: 'GO', color: 'success', explanation: 'Sharm is great for groups — nightlife, diving, water sports, desert excursions. Plenty to do.', tips: ['Rent a private boat for a day at sea', 'Group quad biking in the desert', 'Book a table at Farsha Café for sunset'] },
      medium: { verdict: 'GO', color: 'success', explanation: 'Groups have a great time in Sharm. Pre-book activities to get group rates and avoid overcharging.', tips: ['Negotiate group rates directly with operators', 'Agree on transport in advance', 'Rotate between beach, desert, and Old Market'] },
      high: { verdict: 'GO', color: 'success', explanation: 'A group of travelers is one of the safest ways to visit. Strength in numbers — harassment and scams decrease significantly.', tips: ['Designate one price-negotiator per group', 'All tourist areas are safe for groups', 'Tourist Police: 126 if any issues'] },
    },
  },
  hurghada: {
    solo: {
      low: { verdict: 'GO', color: 'success', explanation: 'Hurghada has a large expat and long-stay traveler community. Easy to meet people. Excellent diving and kitesurfing.', tips: ['El Dahar old town has authentic local vibe', 'Marina area is the tourist social hub', 'Kite Beach for water sports community'] },
      medium: { verdict: 'GO', color: 'success', explanation: 'Hurghada is well-suited for solo travelers who do their research. Main tips: stick to well-reviewed restaurants, use Careem.', tips: ['Avoid unlicensed beach vendors', 'Use this site to check fair prices', 'Marina and Mamsha area is cleanest'] },
      high: { verdict: 'GO WITH PREP', color: 'caution', explanation: 'Hurghada is safe for solo travelers but has more vendor pressure than Sharm. The all-inclusive resort zone is the comfort option.', tips: ['All-inclusive Sahl Hasheesh resort zone = safe bubble', 'Scam awareness is important here — read the scam guide', 'Trust your gut and walk away from pressure'] },
    },
    couple: {
      low: { verdict: 'GO', color: 'success', explanation: 'Great for couples — more local character than Sharm, great diving, good restaurant scene.', tips: ['El Dahar for authentic dinner adventure', 'Dolphin House snorkel trip is a highlight', 'Marina sunset walk is genuinely lovely'] },
      medium: { verdict: 'GO', color: 'success', explanation: 'Solid choice for couples. More affordable than Sharm, slightly rawer but very rewarding.', tips: ['Book boat trips directly at marina', 'Restaurant recommendations on this site are vetted', 'Sahl Hasheesh area is most polished'] },
      high: { verdict: 'GO', color: 'success', explanation: 'All-inclusive Hurghada resorts are perfect for couples who want security without worrying.', tips: ['4-5 star all-inclusive = zero hassle', 'Full board means you barely leave the resort', 'Still easy day trips with guide'] },
    },
    family: {
      low: { verdict: 'GO', color: 'success', explanation: 'Good family destination. Calm sea, kid-friendly resorts, good snorkeling.', tips: ['Sahl Hasheesh resort zone is family-focused', 'Kids\' snorkel trips are safe and fun', 'Avoid El Dahar old town with young children in heat'] },
      medium: { verdict: 'GO', color: 'success', explanation: 'Hurghada works well for families staying in the resort zone. Plan activities through the hotel for simplicity.', tips: ['Hotel-arranged excursions safest for families', 'Parasailing and water park available', 'Check food options in advance for picky eaters'] },
      high: { verdict: 'GO', color: 'success', explanation: 'Resort-zone family travel in Hurghada is completely safe. Millions of European families do this every year.', tips: ['4-5 star all-inclusive is the right choice', 'Nanny and kids club services widely available', 'Medical clinic inside most major resorts'] },
    },
    group: {
      low: { verdict: 'GO', color: 'success', explanation: 'Hurghada has everything for groups — parties, diving, water sports, cheap and cheerful vibe.', tips: ['Marina nightlife is excellent for groups', 'Group dive trips can be arranged cheaply', 'Old Dahar for authentic street food crawl'] },
      medium: { verdict: 'GO', color: 'success', explanation: 'Groups find Hurghada very manageable. More budget-friendly than Sharm for the same experience level.', tips: ['Pre-negotiate group rates', 'Agree on daily budget in advance', 'Use Careem for all group transport'] },
      high: { verdict: 'GO', color: 'success', explanation: 'Groups are always the safest way to travel here. Lots of other tourist groups around creates a safe environment.', tips: ['Stay together in public areas', 'Tourist Police: 126 if needed', 'Security at all major resort entrances'] },
    },
  },
  luxor: {
    solo: {
      low: { verdict: 'GO', color: 'success', explanation: 'Luxor is one of the most rewarding solo travel destinations on earth. The history is overwhelming. Yes, vendors are pushy — it\'s manageable.', tips: ['"La shukran" is your shield', 'West Bank by bicycle is genuinely magical', 'Hire a guide for day 1, go independent after'] },
      medium: { verdict: 'GO WITH PREP', color: 'caution', explanation: 'Luxor is safe but has high vendor intensity. You need mental preparation and the phrase "La shukran." Read the scam guide before you go.', tips: ['Read Luxor scam alerts on this site', 'Tourist Police stationed at every major site', 'Pre-book hotel to avoid station touts'] },
      high: { verdict: 'WAIT / PREPARE', color: 'caution', explanation: 'Luxor may be overwhelming if you\'re already anxious. It\'s safe but relentless vendor attention can feel threatening when it\'s not. A guided tour makes it completely different.', tips: ['Consider a guided tour rather than fully independent', 'Guided travel eliminates almost all vendor pressure', 'Alternatively, try Aswan first — much calmer'] },
    },
    couple: {
      low: { verdict: 'GO', color: 'success', explanation: 'Couples in Luxor have a once-in-a-lifetime experience. Nile sunsets, temple walks, hot air balloon at dawn. Extraordinary.', tips: ['Hot air balloon at sunrise over Valley of Kings', 'Corniche walk at sunset is free and beautiful', 'Karnak light and sound show at night'] },
      medium: { verdict: 'GO', color: 'success', explanation: 'Great for couples who prepare. The vendor pressure is much lower with two people. Read the scam guide.', tips: ['Tourist Police at Karnak/Valley of Kings if needed', 'Pre-book balloon with certified operator only', 'Ferry to West Bank: 5 EGP — ignore anyone charging more'] },
      high: { verdict: 'GO WITH PREP', color: 'caution', explanation: 'Luxor is worth it but requires awareness. As a couple you\'re in a good position. Stay calm, use the Tourist Police, and it becomes amazing.', tips: ['Guided tour for temples reduces all friction', 'Choose Corniche hotel with good reviews', 'Keep tourist police number visible'] },
    },
    family: {
      low: { verdict: 'GO', color: 'success', explanation: 'Families with adventurous kids will love Luxor. Real archaeology, real history. An educational experience unlike anywhere.', tips: ['Kids love Valley of Kings — real tombs!', 'Felucca on the Nile is magical for children', 'Morning is much cooler for temple visits'] },
      medium: { verdict: 'GO WITH PREP', color: 'caution', explanation: 'Families do well in Luxor but need to manage heat (especially with young children) and vendor pressure near entrances.', tips: ['Visit temples before 10am', 'Guide recommended with young children', 'Carry water everywhere — dehydration is real'] },
      high: { verdict: 'CONSIDER ASWAN FIRST', color: 'caution', explanation: 'If you\'re very concerned, start with Aswan — it has great monuments but a far more relaxed atmosphere. Luxor is genuinely overwhelming for anxious families.', tips: ['Aswan is much calmer', 'You can do a day trip to Luxor from Aswan by train', 'Guided tour eliminates most anxiety factors'] },
    },
    group: {
      low: { verdict: 'GO', color: 'success', explanation: 'Groups in Luxor are powerful. Vendors back off quickly with confident groups. Incredible shared experience.', tips: ['One person handles all negotiations', 'Group guided tour excellent value', 'West Bank cycling together is unforgettable'] },
      medium: { verdict: 'GO', color: 'success', explanation: 'Groups have an easy time in Luxor. Safety in numbers, shared guide costs, and someone always knows where you are.', tips: ['Group guide at $60–80 total — worth every pound', 'Take the ferry together — vendors target loners', 'Split into pairs at market for safety'] },
      high: { verdict: 'GO', color: 'success', explanation: 'Groups are the ideal way to experience Luxor if you have concerns. The monuments are worth it and groups have an inherently easier time.', tips: ['Minimum 4 people for confident market experience', 'Group discount on official entry tickets', 'Tourist Police very visible around all sites'] },
    },
  },
  aswan: {
    solo: {
      low: { verdict: 'GO', color: 'success', explanation: 'Aswan is consistently rated the most relaxed city in Egypt. Nubian culture is warm and genuinely welcoming. Ideal for independent travel.', tips: ['Sit on the Corniche at sunset — magic', 'Take the ferry to Elephantine Island', 'Nubian villages are a highlight'] },
      medium: { verdict: 'GO', color: 'success', explanation: 'Aswan is the easiest introduction to independent Egyptian travel. Low pressure, beautiful scenery, friendly locals.', tips: ['Felucca captains: set price upfront, enjoy the rest', 'Abu Simbel convoy: book the night before', 'Philae Temple: boat included in ticket price'] },
      high: { verdict: 'GO', color: 'success', explanation: 'If you\'re anxious about visiting Egypt, start in Aswan. It\'s genuinely different — calm, less commercial, deeply welcoming. Solo women consistently rate it 9-10/10.', tips: ['Safest city in this guide for solo travelers', 'Nubian village home visits are safe and special', 'Corniche evening walk — completely relaxed'] },
    },
    couple: {
      low: { verdict: 'GO', color: 'success', explanation: 'One of the most romantic destinations in Egypt. Nile feluccas, ancient temples on islands, Nubian sunsets. Exceptional.', tips: ['Overnight felucca trip under the stars', 'Philae Temple at sunset by boat', 'Nubian restaurant on Elephantine Island'] },
      medium: { verdict: 'GO', color: 'success', explanation: 'Perfect for couples. Calm, beautiful, very manageable. Abu Simbel day trip is a life memory.', tips: ['Abu Simbel is worth every penny', 'Book Corniche-view hotel room', 'Afternoon tea at Old Cataract Hotel — iconic'] },
      high: { verdict: 'GO', color: 'success', explanation: 'Aswan is genuinely worry-free for couples. It\'s widely considered Egypt\'s most visitor-friendly city.', tips: ['Old Cataract Hotel has incredible security', 'All organized tours are very safe here', 'Evening Corniche walk is always relaxed'] },
    },
    family: {
      low: { verdict: 'GO', color: 'success', explanation: 'Aswan is ideal for families. Abu Simbel and Philae are accessible and incredibly impressive for children.', tips: ['Abu Simbel is genuinely mind-blowing for kids', 'Nubian village visits are safe and interactive', 'Felucca trips are short and manageable'] },
      medium: { verdict: 'GO', color: 'success', explanation: 'Best family city in Upper Egypt. Calm atmosphere, accessible monuments, helpful locals.', tips: ['Take the morning convoy to Abu Simbel (4am early start)', 'Bring hats and water — heat is intense', 'Most organized activities are family appropriate'] },
      high: { verdict: 'GO', color: 'success', explanation: 'Aswan is perfect for concerned families. The risks are minimal, the experience is extraordinary.', tips: ['Tour-based travel takes care of all logistics', 'Safe infrastructure throughout tourist areas', 'Medical facilities available in central Aswan'] },
    },
    group: {
      low: { verdict: 'GO', color: 'success', explanation: 'Groups love Aswan. Abu Simbel road trip at dawn, Nile felucca together, authentic Nubian dinner. Unforgettable collective experience.', tips: ['Private minibus to Abu Simbel for groups', 'Sunset felucca party on the Nile', 'Nubian home dinner: incredible group activity'] },
      medium: { verdict: 'GO', color: 'success', explanation: 'Straightforward and rewarding for groups. Book organized day trips and enjoy completely stress-free.', tips: ['Hire local guide for a day — excellent value', 'Group rate on felucca rental', 'Nubian restaurant reservations advised for groups'] },
      high: { verdict: 'GO', color: 'success', explanation: 'If any city can convert anxious travelers into Egypt fans, it\'s Aswan. Come as a group and you\'ll all leave wanting to return.', tips: ['Zero pressure in Aswan compared to Cairo or Luxor', 'Tourist police are friendly and accessible', 'Group safety is inherently higher throughout'] },
    },
  },
};

export default function TripDecision() {
  useSEO({
    title: 'Should I Visit Egypt? — Trip Decision Tool',
    description: 'Not sure if Egypt is right for you? Answer 3 questions and get a Go / Wait / Avoid verdict with personalized advice. Based on your city, trip type, and concern level.',
  });

  const [city, setCity] = useState(null);
  const [tripType, setTripType] = useState(null);
  const [concern, setConcern] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const reset = () => { setCity(null); setTripType(null); setConcern(null); setShowResult(false); };

  const result = city && tripType && concern
    ? DECISIONS[city]?.[tripType]?.[concern]
    : null;

  const VERDICT_CONFIG = {
    GO: { bg: 'bg-success/10 border-success', badge: 'bg-success text-success-foreground', icon: CheckCircle2, iconColor: 'text-success' },
    'GO WITH PREP': { bg: 'bg-amber-500/10 border-amber-500', badge: 'bg-amber-500 text-white', icon: AlertTriangle, iconColor: 'text-amber-500' },
    'WAIT / PREPARE': { bg: 'bg-amber-500/10 border-amber-500', badge: 'bg-amber-500 text-white', icon: AlertTriangle, iconColor: 'text-amber-500' },
    'CONSIDER ASWAN FIRST': { bg: 'bg-amber-500/10 border-amber-500', badge: 'bg-amber-500 text-white', icon: AlertTriangle, iconColor: 'text-amber-500' },
    AVOID: { bg: 'bg-red-500/10 border-red-500', badge: 'bg-red-500 text-white', icon: XCircle, iconColor: 'text-red-500' },
  };

  return (
    <div className="px-4 py-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Should I Go to Egypt?</h1>
          <p className="text-sm text-muted-foreground">3 questions → personalized verdict</p>
        </div>
      </div>

      {/* Step 1: City */}
      <div className="mb-6">
        <h2 className="text-base font-extrabold mb-3">1. Which city are you considering?</h2>
        <div className="grid grid-cols-2 gap-2">
          {CITIES.map(c => (
            <button key={c.id} onClick={() => { setCity(c.id); setShowResult(false); }}
              className={`p-4 rounded-2xl text-left transition-all border-2 ${city === c.id ? 'border-accent bg-accent/10' : 'border-border bg-card hover:border-accent/40'}`}>
              <span className="text-xl">{c.emoji}</span>
              <p className="font-bold text-sm mt-1">{c.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Trip type */}
      <div className="mb-6">
        <h2 className="text-base font-extrabold mb-3">2. Who are you traveling with?</h2>
        <div className="grid grid-cols-2 gap-2">
          {TRIP_TYPES.map(t => (
            <button key={t.id} onClick={() => { setTripType(t.id); setShowResult(false); }}
              className={`p-4 rounded-2xl text-left transition-all border-2 ${tripType === t.id ? 'border-accent bg-accent/10' : 'border-border bg-card hover:border-accent/40'}`}>
              <span className="text-xl">{t.emoji}</span>
              <p className="font-bold text-sm mt-1">{t.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Step 3: Concern level */}
      <div className="mb-6">
        <h2 className="text-base font-extrabold mb-3">3. How concerned are you about safety?</h2>
        <div className="space-y-2">
          {CONCERNS.map(c => (
            <button key={c.id} onClick={() => { setConcern(c.id); setShowResult(false); }}
              className={`w-full p-4 rounded-2xl text-left transition-all border-2 flex items-center gap-3 ${concern === c.id ? 'border-accent bg-accent/10' : 'border-border bg-card hover:border-accent/40'}`}>
              <span className="text-xl">{c.emoji}</span>
              <p className="font-bold text-sm">{c.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Get verdict button */}
      {city && tripType && concern && !showResult && (
        <button onClick={() => setShowResult(true)}
          className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground rounded-2xl py-4 font-bold text-base">
          Get My Verdict <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Result */}
      <AnimatePresence>
        {showResult && result && (() => {
          const config = VERDICT_CONFIG[result.verdict] || VERDICT_CONFIG['GO WITH PREP'];
          const Icon = config.icon;
          return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 rounded-2xl border-2 p-6 ${config.bg}`}>
              <div className="flex items-center gap-3 mb-4">
                <Icon className={`w-8 h-8 ${config.iconColor}`} />
                <div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${config.badge}`}>{result.verdict}</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {CITIES.find(c => c.id === city)?.label} · {TRIP_TYPES.find(t => t.id === tripType)?.label}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{result.explanation}</p>
              <div>
                <p className="text-xs font-bold mb-2">Key Tips for Your Trip:</p>
                <ul className="space-y-1.5">
                  {result.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className={`w-3 h-3 shrink-0 mt-0.5 ${config.iconColor}`} />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              <button onClick={reset} className="mt-5 flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
                <RotateCcw className="w-3.5 h-3.5" /> Start over
              </button>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      <div className="mt-8 space-y-3">
        <SafeNextStep title="Is Egypt Safe Right Now?" description="Full current safety assessment" to="/egypt-safe-now" />
        <SafeNextStep title="Before You Land Checklist" description="Prepare properly before arriving" to="/before-you-land" />
      </div>
    </div>
  );
}
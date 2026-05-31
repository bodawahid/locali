import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { CheckSquare, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeNextStep from '../components/SafeNextStep';

const UNIVERSAL_CHECKLIST = [
  { category: 'Before Departure — All Cities', items: [
    { id: 1, text: 'Check visa: most nationalities get visa on arrival ($25 USD cash). Sinai-only is free for Sharm El Sheikh.' },
    { id: 2, text: 'Download offline maps — Google Maps or Maps.me. Download your city map before landing.' },
    { id: 3, text: 'Notify your bank about Egypt travel to prevent card blocks. Critical.' },
    { id: 4, text: 'Get travel insurance. Medical coverage and trip cancellation. Not optional.' },
    { id: 5, text: 'Bring USD or EUR cash for arrival — visa fee, first taxi, and SIM card.' },
    { id: 6, text: 'Screenshot or print your hotel booking confirmation — may be asked at immigration.' },
    { id: 7, text: 'Download Careem app and set up payment method before landing.' },
    { id: 8, text: 'Save Tourist Police number: 126 (free, dedicated to tourists).' },
    { id: 9, text: 'Read the scam alerts for your specific city on this site.' },
    { id: 10, text: 'Pack high-SPF sunscreen — it\'s expensive in Egypt. Same for prescription medication.' },
  ]},
  { category: 'At the Airport', items: [
    { id: 11, text: 'IGNORE "helpers" offering to carry your bags — they demand 200–400 EGP aggressively.' },
    { id: 12, text: 'Buy SIM card ONLY at official Vodafone or Orange branded kiosk (not random vendors). 15GB = 250–350 EGP.' },
    { id: 13, text: 'Use official airport ATM inside the terminal — better than exchange counters.' },
    { id: 14, text: 'Use ONLY the official taxi desk INSIDE arrivals — NOT drivers approaching you outside.' },
    { id: 15, text: 'Have your hotel address and phone number accessible before exiting customs.' },
    { id: 16, text: 'Register SIM card with your passport immediately — required within 24 hours.' },
  ]},
  { category: 'First 24 Hours', items: [
    { id: 17, text: 'Learn these 3 phrases: "La shukran" (No thanks), "Bikam?" (How much?), "Ghali awi" (Too expensive).' },
    { id: 18, text: 'Check real prices on this site BEFORE agreeing to any service, taxi, or activity.' },
    { id: 19, text: 'Always agree on taxi or transport price BEFORE getting in the vehicle.' },
    { id: 20, text: 'Never accept anything "free" from a stranger — there is no free in tourist areas.' },
    { id: 21, text: 'Find the nearest bank ATM (not standalone) and withdraw enough EGP for 2–3 days.' },
    { id: 22, text: 'Note the location of the nearest hospital and tourist police station.' },
  ]},
];

const CITY_SPECIFIC = {
  'sharm-el-sheikh': {
    name: 'Sharm El Sheikh Specific',
    items: [
      { id: 101, text: 'You only need a Sinai-only entry visa (free) if staying in Sharm. Full Egypt visa ($25) if traveling elsewhere.' },
      { id: 102, text: 'Naama Bay is the main tourist area — well-lit, patrolled, safe at night.' },
      { id: 103, text: 'For diving: only book with PADI-certified centers. Ask to see certification.' },
      { id: 104, text: 'Know the hyperbaric center location in Naama Bay before diving.' },
      { id: 105, text: 'Airport taxi to Naama Bay: fair price is 200–300 EGP. Refuse anything above 500 EGP.' },
      { id: 106, text: 'Buy water at supermarkets (15–20 EGP), not beach vendors (50–80 EGP).' },
      { id: 107, text: 'Quad bikes and desert tours: only through certified operators with insurance.' },
    ],
  },
  hurghada: {
    name: 'Hurghada Specific',
    items: [
      { id: 201, text: 'Full Egypt visa required ($25 USD on arrival). eVisa also available in advance.' },
      { id: 202, text: 'Airport arrival: IGNORE ALL DRIVERS outside. Walk inside to official taxi desk.' },
      { id: 203, text: 'El Dahar old town has authentic Egyptian food at local prices. Worth the short trip.' },
      { id: 204, text: 'Marina area and Sahl Hasheesh have the most reliable restaurants and activities.' },
      { id: 205, text: 'Book all boat trips and dives at the marina directly — not through hotel reception.' },
      { id: 206, text: 'Careem is more reliable than Uber in Hurghada specifically.' },
      { id: 207, text: 'Local microbus runs along the main coastal road for 10–20 EGP. Useful for short hops.' },
    ],
  },
  luxor: {
    name: 'Luxor Specific',
    items: [
      { id: 301, text: 'Arrive at Luxor Airport or train station. Train from Cairo is 8–10 hours, overnight option available.' },
      { id: 302, text: 'Train station exit: ignore ALL hotel-commission touts approaching you. Pre-book hotel.' },
      { id: 303, text: 'Buy ALL temple tickets at official government booths. Never from individuals.' },
      { id: 304, text: 'Withdraw cash before crossing to the West Bank — NO reliable ATMs near the tombs.' },
      { id: 305, text: 'West Bank ferry: 10 EGP flat. Anyone quoting more is scamming you.' },
      { id: 306, text: 'For hot air balloon: ONLY book ECAA-certified operators. Ask for certificate number.' },
      { id: 307, text: 'Consider a licensed Egyptologist guide for at least day 1 — reduces harassment dramatically.' },
      { id: 308, text: 'Keep small bills (5, 10, 20 EGP) for tipping at temples — guards and guides expect it.' },
    ],
  },
  aswan: {
    name: 'Aswan Specific',
    items: [
      { id: 401, text: 'Arrive by train from Luxor (2–3 hours) or fly. Train station is central on the Corniche.' },
      { id: 402, text: 'Abu Simbel convoy leaves at 4am. Confirm your booking the evening before.' },
      { id: 403, text: 'Bring ALL cash needed for Abu Simbel day — NO ATMs at Abu Simbel. Minimum 2,000 EGP.' },
      { id: 404, text: 'Felucca price is for the WHOLE BOAT, not per person. Confirm this explicitly.' },
      { id: 405, text: 'Nubian villages are free to visit. "Entry fee" demands are scams.' },
      { id: 406, text: 'Philae Temple boat is included in the ticket price. Don\'t pay extra for the boat.' },
      { id: 407, text: 'Aswan is genuinely relaxed. You can slow down here — use the extra calm to absorb it.' },
    ],
  },
};

export default function BeforeYouLand() {
  const { lang } = useOutletContext();
  const [checked, setChecked] = useState(new Set());
  const [selectedCity, setSelectedCity] = useState(null);

  const toggle = (id) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allItems = [
    ...UNIVERSAL_CHECKLIST.flatMap(c => c.items),
    ...(selectedCity ? CITY_SPECIFIC[selectedCity]?.items || [] : []),
  ];
  const totalItems = allItems.length;
  const progress = totalItems > 0 ? Math.round((checked.size / totalItems) * 100) : 0;

  const CITY_BUTTONS = [
    { id: 'sharm-el-sheikh', label: 'Sharm El Sheikh' },
    { id: 'hurghada', label: 'Hurghada' },
    { id: 'luxor', label: 'Luxor' },
    { id: 'aswan', label: 'Aswan' },
  ];

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
          <CheckSquare className="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Before You Land</h1>
          <p className="text-sm text-muted-foreground">Complete arrival checklist — all 4 cities</p>
        </div>
      </div>

      {/* City selector */}
      <div className="bg-card rounded-2xl border border-border/50 p-4 mb-4">
        <p className="text-xs font-bold mb-2">Add city-specific checklist:</p>
        <div className="flex gap-2 flex-wrap">
          {CITY_BUTTONS.map(c => (
            <button key={c.id} onClick={() => setSelectedCity(selectedCity === c.id ? null : c.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${selectedCity === c.id ? 'bg-accent text-accent-foreground border-accent' : 'bg-secondary border-border'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      <div className="bg-card rounded-2xl border border-border/50 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold">{checked.size}/{totalItems} completed</span>
          <span className="text-xs font-bold text-accent">{progress}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <motion.div className="h-full bg-accent rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.4 }} />
        </div>
      </div>

      <div className="space-y-6">
        {UNIVERSAL_CHECKLIST.map((section) => (
          <div key={section.category}>
            <h2 className="text-lg font-extrabold mb-3">{section.category}</h2>
            <div className="space-y-2">
              {section.items.map((item) => (
                <button key={item.id} onClick={() => toggle(item.id)}
                  className={`w-full flex items-start gap-3 p-4 rounded-2xl text-left transition-all ${checked.has(item.id) ? 'bg-success/5 border border-success/20' : 'bg-card border border-border/50'}`}>
                  <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${checked.has(item.id) ? 'bg-success' : 'border-2 border-border'}`}>
                    <AnimatePresence>
                      {checked.has(item.id) && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Check className="w-3.5 h-3.5 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className={`text-sm leading-relaxed ${checked.has(item.id) ? 'text-muted-foreground line-through' : 'font-medium'}`}>{item.text}</span>
                </button>
              ))}
            </div>
          </div>
        ))}

        {selectedCity && CITY_SPECIFIC[selectedCity] && (
          <div>
            <h2 className="text-lg font-extrabold mb-3 text-accent">{CITY_SPECIFIC[selectedCity].name}</h2>
            <div className="space-y-2">
              {CITY_SPECIFIC[selectedCity].items.map((item) => (
                <button key={item.id} onClick={() => toggle(item.id)}
                  className={`w-full flex items-start gap-3 p-4 rounded-2xl text-left transition-all ${checked.has(item.id) ? 'bg-success/5 border border-success/20' : 'bg-card border border-accent/20'}`}>
                  <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${checked.has(item.id) ? 'bg-success' : 'border-2 border-accent/40'}`}>
                    <AnimatePresence>
                      {checked.has(item.id) && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                          <Check className="w-3.5 h-3.5 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span className={`text-sm leading-relaxed ${checked.has(item.id) ? 'text-muted-foreground line-through' : 'font-medium'}`}>{item.text}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 space-y-3">
        <SafeNextStep title="Check Real Prices" description="Know what everything costs before you arrive" to="/price-checker" />
        <SafeNextStep title="Scam Alerts by City" description="Know exactly what to watch for" to="/scam-map" />
      </div>
    </div>
  );
}
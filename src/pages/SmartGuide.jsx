import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Bot, Search, ChevronRight, MessageSquare } from 'lucide-react';

const QUESTIONS = [
  // Money
  { id: 1, cat: 'money', city: 'all', q: 'What is the best way to get Egyptian Pounds?', a: 'Use official bank ATMs inside branches (Banque Misr, CIB, HSBC). You\'ll get the official rate. Avoid street exchange offices near tourist sites — they often shortchange. Airport exchange counters are convenient but offer slightly worse rates.', links: [{ label: 'Currency Rates', to: '/currency-rates' }] },
  { id: 2, cat: 'money', city: 'all', q: 'Should I exchange money at the airport?', a: 'It\'s fine for a small emergency amount (e.g. $50 for taxi + SIM). But for larger amounts, use a city-center ATM or CIB bank branch for the best rate.', links: [{ label: 'Currency Rates', to: '/currency-rates' }] },
  { id: 3, cat: 'money', city: 'all', q: 'How much cash should I carry daily?', a: 'Budget traveler: 500–800 EGP/day. Mid-range: 1,200–2,000 EGP/day. Premium: 3,000+ EGP/day. Always carry small notes (20s, 50s) for tips and small purchases.', links: [{ label: 'Cost Calculator', to: '/cost-calculator' }] },
  { id: 4, cat: 'money', city: 'all', q: 'Do they accept euros/dollars in Egypt?', a: 'Many tourist businesses accept USD and EUR, but at poor rates. Always pay in EGP when possible. Never let someone calculate the price in dollars for you — do your own conversion first.', links: [] },

  // Transport
  { id: 5, cat: 'transport', city: 'all', q: 'Is Uber available in Egypt?', a: 'Yes, Uber operates in Cairo, Hurghada, and Sharm El Sheikh. In Hurghada, Careem is more reliable. In Luxor and Aswan, Careem has better coverage. Always use a ride-app over street taxis.', links: [{ label: 'Transport Guide', to: '/city/hurghada/transport' }] },
  { id: 6, cat: 'transport', city: 'all', q: 'How do I get from Hurghada airport to my hotel?', a: 'Best option: pre-book hotel shuttle (ask hotel in advance). Second: official airport taxi desk inside terminal (fair: 150–250 EGP to city center). Never go with drivers who approach you outside.', links: [{ label: 'Before You Land', to: '/before-you-land' }] },
  { id: 7, cat: 'transport', city: 'luxor', q: 'How do I get to the West Bank in Luxor?', a: 'Take the public ferry from Luxor Corniche to Gezira village (5 EGP — flat rate, do not pay more). Then hire a local driver or bicycle at fair prices. No tuk-tuks for the valley — hire a proper car.', links: [{ label: 'Luxor Transport', to: '/city/luxor/transport' }] },
  { id: 8, cat: 'transport', city: 'aswan', q: 'How do I get to Abu Simbel from Aswan?', a: 'Join an official convoy departing at 4am (by car) or fly (30 min, ~$100 USD one-way). The convoy takes 3.5 hours each way. Booking through a verified operator includes AC transport and English guide.', links: [{ label: 'Book Abu Simbel Tour', to: '/book' }] },

  // Safety
  { id: 9, cat: 'safety', city: 'all', q: 'Is it safe to walk alone at night in Hurghada?', a: 'Yes, in the main resort strip and Sahl Hasheesh area, it is safe at night. Tourist police patrol Sheraton Road regularly. Avoid unlit backstreets and beach areas past midnight without company.', links: [{ label: 'Safety Guide', to: '/safety-guide' }] },
  { id: 10, cat: 'safety', city: 'all', q: 'What should I do if I am scammed in Egypt?', a: 'Go to the nearest Tourist Police station or call 126 (free, English-speaking). Take a photo of the person if possible. Note the vehicle plate number for taxi scams. Tourist Police are specifically trained for these cases.', links: [{ label: 'Emergency', to: '/emergency' }, { label: 'Scam Map', to: '/scam-map' }] },
  { id: 11, cat: 'safety', city: 'all', q: 'Is the water safe to drink in Egypt?', a: 'No. Never drink tap water anywhere in Egypt. Bottled water is everywhere and very cheap (5–8 EGP for 1.5L at supermarkets). Always check the seal is intact. Stick to bottled water for brushing teeth too.', links: [] },

  // Activities
  { id: 12, cat: 'activities', city: 'hurghada', q: 'What are the best activities in Hurghada?', a: 'Top 5: (1) Snorkeling at Giftun Island — best coral in the area. (2) Glass-bottom boat tour. (3) Quad bike desert safari at sunset. (4) Submarine tour for non-divers. (5) Day trip to El Gouna for kitesurfing/lagoon.', links: [{ label: 'Book Activities', to: '/book?city=hurghada' }] },
  { id: 13, cat: 'activities', city: 'luxor', q: 'How many days do I need in Luxor?', a: 'Minimum 2 full days. Day 1: East Bank (Karnak Temple, Luxor Temple, Luxor Museum). Day 2: West Bank (Valley of Kings, Hatshepsut Temple, Colossi of Memnon). Add Day 3 for Dendera, Abydos, or deeper valley exploration.', links: [{ label: 'Things to Do in Luxor', to: '/city/luxor/things-to-do' }] },
  { id: 14, cat: 'activities', city: 'sharm-el-sheikh', q: 'Is diving in Sharm El Sheikh safe for beginners?', a: 'Yes. Sharm has excellent beginner dive sites: Jackson Reef and Naama Bay house reef are perfect for first-timers. PADI intro dives (Discover Scuba) can be done without any previous experience. Always book PADI-certified operators only.', links: [{ label: 'Book Sharm Diving', to: '/book?city=sharm-el-sheikh' }] },
  { id: 15, cat: 'activities', city: 'aswan', q: 'Is a Nile cruise worth it?', a: 'Yes — a 4-night Luxor–Aswan cruise is one of Egypt\'s iconic experiences. Average price: $600–900 USD/person all-inclusive for a good 5-star boat. This covers transport, accommodation, and all temple entry in one. Best booked 4–6 weeks in advance.', links: [] },

  // Practical
  { id: 16, cat: 'practical', city: 'all', q: 'What SIM card should I buy in Egypt?', a: 'Vodafone Egypt is the most reliable for tourists. Buy at the official Vodafone store (not airport kiosks). 15GB data: 130–160 EGP. Bring your passport for registration. Works perfectly in all resort cities.', links: [{ label: 'SIM Cards Guide', to: '/sim-cards' }] },
  { id: 17, cat: 'practical', city: 'all', q: 'Do I need a visa for Egypt?', a: 'Most nationalities get a visa on arrival ($25 USD cash). EU, UK, US, Russia, and most others qualify. Exception: Sharm El Sheikh (Sinai-only) is FREE for most nationalities. eVisa also available online at visa2egypt.gov.eg', links: [{ label: 'Visa & Entry Guide', to: '/visa-entry' }] },
  { id: 18, cat: 'practical', city: 'all', q: 'What language do people speak in Egyptian tourist areas?', a: 'In all major resort cities (Hurghada, Sharm, Luxor, Aswan), most people in tourist services speak English. Russian is widely spoken in Hurghada and Sharm. German understood in many hotels. Arabic phrases are still appreciated and open doors.', links: [{ label: 'Arabic Phrases', to: '/phrases' }] },
  { id: 19, cat: 'practical', city: 'all', q: 'What is the tipping culture in Egypt?', a: 'Tipping (baksheesh) is expected everywhere. Temple guards: 20–50 EGP. Restaurant: 10–15% of bill. Hotel housekeeper: 20–50 EGP/day. Taxi: round up. Bathroom attendant: 5–10 EGP. Always have small notes.', links: [] },
  { id: 20, cat: 'practical', city: 'all', q: 'Best time to visit Egypt?', a: 'October–April is ideal for all cities (22–30°C). Avoid June–August for Luxor and Aswan (40–45°C, brutal). Hurghada and Sharm are year-round destinations. Ramadan (check date each year) changes restaurant hours but adds cultural richness.', links: [] },
];

const CATEGORIES = [
  { id: 'all', label: '🌟 All Topics' },
  { id: 'money', label: '💰 Money & Currency' },
  { id: 'transport', label: '🚕 Transport' },
  { id: 'safety', label: '🛡️ Safety' },
  { id: 'activities', label: '🤿 Activities' },
  { id: 'practical', label: '📋 Practical Info' },
];

export default function LocaliAI() {
  const { lang } = useOutletContext();
  const [catFilter, setCatFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(null);

  const filtered = QUESTIONS.filter(q => {
    const matchCat = catFilter === 'all' || q.cat === catFilter;
    const matchSearch = !search || q.q.toLowerCase().includes(search.toLowerCase()) || q.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center shrink-0">
          <Bot className="w-6 h-6 text-violet-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Smart Tourist Guide</h1>
          <p className="text-sm text-muted-foreground">Real questions. Clear answers. Updated regularly.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search any question..."
          className="w-full pl-11 pr-4 py-3 bg-card border border-border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCatFilter(c.id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${catFilter === c.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
            {c.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mb-4">{filtered.length} answers found</p>

      {/* Questions */}
      <div className="space-y-2 mb-10">
        {filtered.map((item) => (
          <div key={item.id} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
            <button onClick={() => setOpen(open === item.id ? null : item.id)}
              className="w-full flex items-start justify-between gap-3 px-5 py-4 text-left">
              <div>
                {item.city !== 'all' && (
                  <span className="text-[10px] font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full capitalize mr-2">{item.city}</span>
                )}
                <span className="font-bold text-sm">{item.q}</span>
              </div>
              <ChevronRight className={`w-4 h-4 text-muted-foreground shrink-0 mt-0.5 transition-transform ${open === item.id ? 'rotate-90' : ''}`} />
            </button>
            {open === item.id && (
              <div className="px-5 pb-5">
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">{item.a}</p>
                {item.links.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.links.map((link, i) => (
                      <Link key={i} to={link.to} className="flex items-center gap-1 text-xs font-bold text-accent bg-accent/10 px-3 py-1.5 rounded-full hover:bg-accent/20 transition-colors">
                        {link.label} <ChevronRight className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA to AI */}
      <div className="bg-violet-500/10 border border-violet-500/20 rounded-2xl p-5 text-center">
        <Bot className="w-8 h-8 mx-auto mb-2 text-violet-500" />
        <p className="font-extrabold mb-1">Can't find your answer?</p>
        <p className="text-sm text-muted-foreground mb-3">Ask our AI guide — it knows Egypt inside out.</p>
        <Link to="/ai-assistant" className="inline-flex items-center gap-2 bg-violet-500 text-white px-6 py-3 rounded-xl font-bold text-sm">
          <MessageSquare className="w-4 h-4" />
          Ask the AI Guide
        </Link>
      </div>
    </div>
  );
}
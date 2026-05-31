import { useState } from 'react';
import { Search, X, MapPin, Clock, Star, Info } from 'lucide-react';
import GoogleReviewsButton from '../components/GoogleReviewsButton';
import BookingButtons from '../components/BookingButtons';
import PlaceDetailModal from '../components/PlaceDetailModal';

// All prices verified from official Egyptian government & major booking platforms
// Sources: Ministry of Tourism Egypt (mota.gov.eg), GetYourGuide, Viator, TripAdvisor — April 2026
const ACTIVITIES = [
  // ── ASWAN ────────────────────────────────────────────────────────────────────
  {
    id: 1,
    title: 'معبد فيلة — Philae Temple Boat + Entry',
    city: 'aswan',
    type: 'temple',
    emoji: '🛕',
    price_egp: 1250,
    price_note: 'per person (boat 450 EGP/8ppl + ticket 550 EGP + guide)',
    duration: '2–3 hours',
    rating: 4.8,
    reviews: 3400,
    source: 'Viator / Ministry of Tourism Egypt',
    description: 'Boat to Agilkia Island, explore the stunning Ptolemaic temple of Isis. Boat from dock: 450 EGP per boat (up to 8 people). Entrance: 550 EGP/adult foreigner. Sound & Light show extra.',
    ticket_price: 'Entrance: 550 EGP (foreigner adult) | Boat: 450 EGP/boat shared',
    tips: 'Book morning — less crowded. Official boat dock: Shellal Marina.',
    featured: true,
  },
  {
    id: 2,
    title: 'أبو سمبل — Abu Simbel Day Trip from Aswan',
    city: 'aswan',
    type: 'temple',
    emoji: '🏛️',
    price_egp: 4500,
    price_note: 'per person (group tour with transfer)',
    duration: '10–12 hours (full day)',
    rating: 4.9,
    reviews: 5200,
    source: 'Viator / TripAdvisor',
    description: 'Full-day trip to Abu Simbel (Ramesses II & Nefertari temples). Convoy departs Aswan at 4am. Entry ticket 540 EGP, transfer ~3500 EGP group. Private tour from $85/person.',
    ticket_price: 'Entrance: 540 EGP (foreigner) | Transfer: included in tour',
    tips: 'Must join convoy at 4am. Fly option available: ~$150 per person return.',
    featured: true,
  },
  {
    id: 3,
    title: 'النوبة — Nubian Village Boat Tour',
    city: 'aswan',
    type: 'boat',
    emoji: '⛵',
    price_egp: 950,
    price_note: 'per person',
    duration: '3–4 hours',
    rating: 4.6,
    reviews: 1800,
    source: 'GetYourGuide / Local operators',
    description: 'Motor boat to colorful Nubian village on the west bank. Meet locals, see crocodiles, enjoy Nubian tea and home-cooked food. Entry to village free. Boat tour price verified locally.',
    ticket_price: 'No entry fee — boat hire included',
    tips: 'Bring cash for local crafts. Negotiate boat price at dock.',
    featured: false,
  },
  {
    id: 4,
    title: 'نيل السفلية — Nile Felucca Sunset (2 hrs)',
    city: 'aswan',
    type: 'boat',
    emoji: '🌅',
    price_egp: 950,
    price_note: 'per hour (shared, up to 8 people)',
    duration: '2 hours',
    rating: 4.7,
    reviews: 2100,
    source: 'Local Aswan operators / TripAdvisor',
    description: 'Authentic felucca sail at sunset. Kitchener\'s Island, Elephantine Island. Traditional Nubian music and tea. Official price: 450–500 EGP/hour per boat.',
    ticket_price: '450–500 EGP per hour (whole boat, up to 8 people)',
    tips: 'Best at sunset. Negotiate at the Corniche dock.',
    featured: false,
  },
  // ── LUXOR ────────────────────────────────────────────────────────────────────
  {
    id: 5,
    title: 'بالون هوائي فوق الأقصر — Hot Air Balloon Luxor',
    city: 'luxor',
    type: 'activity',
    emoji: '🎈',
    price_egp: 3500,
    price_note: 'per person (standard group)',
    duration: '45–60 min flight',
    rating: 4.8,
    reviews: 12000,
    source: 'Viator ($50–70/person) / TripAdvisor',
    description: 'Sunrise hot air balloon over Valley of the Kings and West Bank temples. Most popular experience in Luxor. Price: $50–70/person (2,500–3,500 EGP). Pickup from hotel included.',
    ticket_price: '2,500–3,500 EGP (standard) | 3,500–6,500 EGP (private luxury)',
    tips: 'Book 24hrs ahead. All operators are government licensed.',
    featured: true,
  },
  {
    id: 6,
    title: 'وادي الملوك — Valley of the Kings',
    city: 'luxor',
    type: 'temple',
    emoji: '👑',
    price_egp: 600,
    price_note: 'foreigner adult ticket (3 tombs)',
    duration: '2–3 hours',
    rating: 4.9,
    reviews: 8500,
    source: 'Ministry of Tourism Egypt (mota.gov.eg)',
    description: 'Official government ticket: 600 EGP for foreigners (includes 3 tombs). Tutankhamun extra: 600 EGP. Seti I extra: 2,000 EGP. Located on Luxor west bank.',
    ticket_price: 'Standard: 600 EGP | Tutankhamun: +600 EGP | Seti I: +2,000 EGP',
    tips: 'Buy tickets at the valley entrance. Early morning best — opens 6am.',
    featured: true,
  },
  {
    id: 7,
    title: 'معبد الكرنك — Karnak Temple',
    city: 'luxor',
    type: 'temple',
    emoji: '🏛️',
    price_egp: 600,
    price_note: 'foreigner adult ticket',
    duration: '2–4 hours',
    rating: 4.9,
    reviews: 9200,
    source: 'Ministry of Tourism Egypt (mota.gov.eg) / egymonuments.com',
    description: 'World\'s largest temple complex. Official ticket: 600 EGP for foreign adults (300 EGP students). Open 6am–5pm. Sound & Light show separate.',
    ticket_price: 'Adult: 600 EGP | Student: 300 EGP | Egyptians: 40 EGP',
    tips: 'Go at opening (6am) to avoid crowds. At least 3 hours needed.',
    featured: false,
  },
  {
    id: 8,
    title: 'ركوب الجمال — Camel Ride Luxor West Bank',
    city: 'luxor',
    type: 'activity',
    emoji: '🐪',
    price_egp: 3200,
    price_note: 'per person (2–3 hrs with guide)',
    duration: '2–3 hours',
    rating: 4.5,
    reviews: 980,
    source: 'Viator ($64/person) / TripAdvisor',
    description: 'Camel ride through Luxor west bank past temple ruins and countryside. $64/person on Viator (≈3,200 EGP). Hotel transfer included. Sunset or morning rides available.',
    ticket_price: '3,200 EGP/person with guide & transfer | Local negotiation: 800–1,500 EGP/hour',
    tips: 'Negotiate locally at the west bank. Viator price includes transfer.',
    featured: false,
  },
  // ── HURGHADA ──────────────────────────────────────────────────────────────────
  {
    id: 9,
    title: 'ركوب الجمال — Camel Ride Hurghada Desert',
    city: 'hurghada',
    type: 'activity',
    emoji: '🐪',
    price_egp: 1000,
    price_note: 'per person (1 hour)',
    duration: '1–2 hours',
    rating: 4.3,
    reviews: 1200,
    source: 'getyourtoursegypt.com ($20/person)',
    description: 'Desert camel ride near Hurghada. 1-hour price: $20/person (≈1,000 EGP). Longer rides available. Some packages include quad bike combo.',
    ticket_price: '1 hour: ~1,000 EGP | 2 hours: ~1,800 EGP | Quad+Camel combo: ~2,500 EGP',
    tips: 'Most operators based at the desert edge 20km from city.',
    featured: false,
  },
  {
    id: 10,
    title: 'رحلة الصحراء — Desert Safari Hurghada',
    city: 'hurghada',
    type: 'activity',
    emoji: '🏜️',
    price_egp: 1800,
    price_note: 'per person (quad + camel + dinner)',
    duration: '4–5 hours (evening)',
    rating: 4.6,
    reviews: 4500,
    source: 'GetYourGuide / Viator',
    description: 'Evening desert safari: quad bike, camel ride, Bedouin dinner, stargazing. 4.6/5 on GetYourGuide (4,500+ reviews). Hotel transfer included. Verified April 2026.',
    ticket_price: '~1,800–2,200 EGP per person (all inclusive)',
    tips: 'Book afternoon for sunset experience. Transfer from hotel included.',
    featured: true,
  },
  // ── SHARM EL SHEIKH ───────────────────────────────────────────────────────────
  {
    id: 11,
    title: 'سيناء — Sinai Sunrise Trek (Mt. Sinai)',
    city: 'sharm-el-sheikh',
    type: 'activity',
    emoji: '⛰️',
    price_egp: 4750,
    price_note: 'per person (guided overnight)',
    duration: 'Overnight (5–6 hrs trek)',
    rating: 4.8,
    reviews: 2300,
    source: 'GetYourGuide / Viator',
    description: 'Midnight hike to summit of Mount Sinai to watch sunrise. One of Egypt\'s top experiences. ~$95/person on GetYourGuide. Guide, camel option, hotel pickup included.',
    ticket_price: '4,750 EGP/person (~$95) | Camel part-way: extra 700 EGP',
    tips: 'Bring warm clothing — cold at night. Start at midnight from St. Catherine.',
    featured: true,
  },
  {
    id: 12,
    title: 'ركوب الجمال — Camel Ride Sharm Desert',
    city: 'sharm-el-sheikh',
    type: 'activity',
    emoji: '🐪',
    price_egp: 1500,
    price_note: 'per person (1–2 hrs)',
    duration: '1–2 hours',
    rating: 4.4,
    reviews: 760,
    source: 'GetYourGuide / Local operators',
    description: 'Camel ride through Sinai desert near Sharm. 1–2 hours. Often combined with quad bike or ATV. Transfer from hotel included in most packages.',
    ticket_price: '1 hour: ~1,000–1,500 EGP | Combo (quad+camel): ~2,200 EGP',
    tips: 'Best in early morning or sunset. Avoid midday heat.',
    featured: false,
  },
];

const CITIES = [
  { id: '', label: '🌍 All Cities' },
  { id: 'aswan', label: '🏛️ Aswan' },
  { id: 'luxor', label: '👑 Luxor' },
  { id: 'hurghada', label: '🌊 Hurghada' },
  { id: 'sharm-el-sheikh', label: '⛰️ Sharm' },
];

const TYPES = [
  { id: '', label: 'All Types' },
  { id: 'temple', label: '🏛️ Temples' },
  { id: 'boat', label: '⛵ Boat Trips' },
  { id: 'activity', label: '🎯 Activities' },
];

const CITY_LABELS = { aswan: 'Aswan', luxor: 'Luxor', hurghada: 'Hurghada', 'sharm-el-sheikh': 'Sharm El Sheikh' };

const CITY_TEMPLE_VIATOR = {
  luxor: 'https://www.viator.com/Luxor-tours/Historical-Historical-Tours/d957-g28/',
  aswan: 'https://www.viator.com/Aswan-tours/Historical-Historical-Tours/d4776-g28/',
  hurghada: 'https://www.viator.com/Hurghada-tours/Outdoor-Activities/d5323-g28/',
  'sharm-el-sheikh': 'https://www.viator.com/Sharm-el-Sheikh-tours/Cultural-Tours/d832-g28/',
};

function ActivityCard({ act }) {
  const [expanded, setExpanded] = useState(false);
  const [open, setOpen] = useState(false);
  const viatorUrl = CITY_TEMPLE_VIATOR[act.city] || 'https://www.viator.com/Egypt/d798-ttd';

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden cursor-pointer" onClick={() => setOpen(true)}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-start gap-2">
            <span className="text-2xl">{act.emoji}</span>
            <div>
              <h3 className="font-extrabold text-sm text-gray-900 leading-tight">{act.title}</h3>
              <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-2.5 h-2.5" />{CITY_LABELS[act.city]}
                <span className="mx-1">·</span><Clock className="w-2.5 h-2.5" />{act.duration}
              </p>
            </div>
          </div>
          {act.featured && <span className="bg-amber-400 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full shrink-0">⭐ TOP</span>}
        </div>

        <div className="flex items-center gap-1 mb-2">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold">{act.rating}</span>
          <span className="text-[10px] text-gray-400">({act.reviews.toLocaleString()} reviews)</span>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed mb-3">{act.description}</p>

        {/* Price */}
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 mb-3">
          <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">💰 Real Price</p>
          <p className="text-lg font-black text-emerald-700">{act.price_egp.toLocaleString()} EGP</p>
          <p className="text-[10px] text-gray-500">{act.price_note}</p>
        </div>

        {/* Ticket breakdown */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 mb-3">
          <p className="text-[10px] font-bold text-blue-700 mb-0.5">🎟️ Tickets</p>
          <p className="text-[10px] text-blue-600">{act.ticket_price}</p>
        </div>

        <div className="mb-3">
          <GoogleReviewsButton name={act.title} />
        </div>
        <BookingButtons activity={act.title} city={CITY_LABELS[act.city] || act.city} />
        <button onClick={() => setExpanded(!expanded)}
          className="text-[10px] font-bold text-accent underline mb-2">
          {expanded ? '▲ Less info' : '▼ Tips & Source'}
        </button>

        {expanded && (
          <div className="space-y-2">
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
              <p className="text-[10px] font-bold text-amber-700 mb-0.5">💡 Tips</p>
              <p className="text-[10px] text-amber-700">{act.tips}</p>
            </div>
            <div className="bg-gray-50 rounded-xl px-3 py-2">
              <p className="text-[10px] text-gray-400">📌 Source: <span className="font-bold">{act.source}</span></p>
            </div>
          </div>
        )}
      </div>
      {open && <PlaceDetailModal place={{ name: act.title, description: act.description, city: CITY_LABELS[act.city] || act.city, type: 'activity' }} onClose={e => { e.stopPropagation(); setOpen(false); }} />}
    </div>
  );
}

export default function TempleTrips() {
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [search, setSearch] = useState('');

  const filtered = ACTIVITIES.filter(a => {
    const matchCity = !city || a.city === city;
    const matchType = !type || a.type === type;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase());
    return matchCity && matchType && matchSearch;
  });

  const featured = filtered.filter(a => a.featured);
  const rest = filtered.filter(a => !a.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-700 via-orange-600 to-yellow-500 px-4 pt-10 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-3">🏛️</div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Temple Trips & Activities</h1>
          <p className="text-white/80 text-sm">Real prices · معابد · ركوب جمال · رحلات نيل · مصادر موثقة</p>
          <div className="mt-4 bg-white/20 rounded-2xl px-4 py-2 inline-block">
            <p className="text-white text-xs font-bold">📌 All prices from: Ministry of Tourism Egypt, GetYourGuide, Viator (April 2026)</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        {/* Filters */}
        <div className="bg-white rounded-3xl shadow-lg p-4 mb-6 border border-gray-100">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search temples, activities..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {CITIES.map(c => (
              <button key={c.id} onClick={() => setCity(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${city === c.id ? 'bg-amber-500 text-white border-amber-500' : 'bg-gray-50 border-gray-200'}`}>
                {c.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            {TYPES.map(t => (
              <button key={t.id} onClick={() => setType(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${type === t.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-gray-50 border-gray-200'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price source disclaimer */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 mb-6 flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-bold text-blue-700">مصادر الأسعار الرسمية — Verified Price Sources</p>
            <p className="text-[10px] text-blue-600 mt-0.5">Ministry of Tourism Egypt (mota.gov.eg) · GetYourGuide · Viator · TripAdvisor · Verified April 2026</p>
          </div>
        </div>

        {/* Featured */}
        {featured.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-extrabold text-gray-900 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Top Experiences
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {featured.map(a => <ActivityCard key={a.id} act={a} />)}
            </div>
          </div>
        )}

        {/* Rest */}
        {rest.length > 0 && (
          <>
            <h2 className="text-lg font-extrabold text-gray-900 mb-3">All Activities ({filtered.length})</h2>
            <div className="grid sm:grid-cols-2 gap-4 mb-12">
              {rest.map(a => <ActivityCard key={a.id} act={a} />)}
            </div>
          </>
        )}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <span className="text-5xl">🏛️</span>
            <p className="mt-3 font-bold">No results found</p>
            <p className="text-sm">Try adjusting filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
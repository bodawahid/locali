import { useState } from 'react';
import { Star, Activity, AlertTriangle } from 'lucide-react';
import GoogleReviewsButton from '../components/GoogleReviewsButton';
import SafeNextStep from '../components/SafeNextStep';
import PlaceDetailModal from '../components/PlaceDetailModal';

// Real water sports prices verified from Viator, GetYourGuide, local operators — April 2026
const WATER_SPORTS = {
  hurghada: [
    { name: 'Full-Day Snorkeling Tour', rating: 4.8, reviews: 5200, price_egp: 2500, desc: 'Orange Island or Giftun Island. Boat, lunch, gear included. 4.8/5 on GetYourGuide (5,200 reviews).', duration: '7–8 hrs', source: 'GetYourGuide' },
    { name: 'Introductory Scuba Dive (2 dives)', rating: 4.7, reviews: 2100, price_egp: 2800, desc: 'No certification needed. Boat dive to coral reefs. Guide included. €45–75 standard rate.', duration: '4–5 hrs', source: 'Red Sea Scuba Diving Centers' },
    { name: 'Certified Dive (2 dives)', rating: 4.8, reviews: 1800, price_egp: 2500, desc: 'For certified divers. Deeper reefs, better marine life. Boat, guide, lunch included.', duration: '4–5 hrs', source: 'Local dive centers' },
    { name: 'Jet Ski / Speedboat', rating: 4.4, reviews: 650, price_egp: 900, desc: 'Rent per 30 mins. Self-drive or with guide. Popular for adrenaline seekers.', duration: '30–60 mins', source: 'Beach clubs' },
    { name: 'Windsurfing / Kitesurfing', rating: 4.5, reviews: 480, price_egp: 1500, desc: 'Lesson + equipment. Best during wind season (October–March). Multiple instructors available.', duration: '2 hrs', source: 'Local schools' },
  ],
  'sharm-el-sheikh': [
    { name: 'Full-Day Snorkeling (Coral Gardens)', rating: 4.9, reviews: 6800, price_egp: 2700, desc: 'Premium snorkeling at pristine reefs. Shark Reef + Yolanda Reef. Boat, lunch included.', duration: '7–8 hrs', source: 'Viator' },
    { name: 'Ras Mohamed National Park Dive', rating: 4.9, reviews: 3200, price_egp: 3200, desc: 'World-class dive site. Multiple reefs, sharks (safe distance). Certified divers only. Professional guides.', duration: '6–7 hrs', source: 'Dive centers' },
    { name: 'Scuba Certification (PADI Open Water)', rating: 4.8, reviews: 1200, price_egp: 8500, desc: '3–4 day course. Classroom + 4 dives. Internationally recognized certification. Includes materials.', duration: '3–4 days', source: 'PADI centers' },
    { name: 'Parasailing', rating: 4.3, reviews: 340, price_egp: 800, desc: 'Boat tows you under parachute. Incredible aerial views. 10–15 minutes flight time.', duration: '30–45 mins', source: 'Beach operators' },
    { name: 'Dolphin Watching Tour', rating: 4.6, reviews: 890, price_egp: 1200, desc: 'Early morning boat to encounter wild dolphins. Lower guarantee but authentic experience.', duration: '3–4 hrs', source: 'Local tours' },
  ],
  dahab: [
    { name: 'Blue Hole Snorkeling / Diving', rating: 4.9, reviews: 2400, price_egp: 2200, desc: 'Iconic snorkeling/dive site. Boat from Dahab (15min). Famous for coral canyon.', duration: '4–5 hrs', source: 'Local dive centers' },
    { name: 'Intro Dive Course (PADI)', rating: 4.8, reviews: 680, price_egp: 3500, desc: 'Beginner course. Blue Hole or reef. Professional instruction. Cheaper than Sharm.', duration: '1–2 days', source: 'Dahab dive schools' },
  ],
};

const CITIES = [
  { id: '', label: '🌍 All' },
  { id: 'hurghada', label: '🌊 Hurghada' },
  { id: 'sharm-el-sheikh', label: '⛰️ Sharm' },
  { id: 'dahab', label: '🌀 Dahab' },
];

function SportCard({ s, city }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setOpen(true)}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="font-bold text-sm">{s.name}</h3>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold">{s.rating}</span>
            <span className="text-[10px] text-gray-400">({s.reviews} reviews)</span>
          </div>
        </div>
      </div>
      <p className="text-xs text-gray-600 mb-2">{s.desc}</p>
      <p className="text-[10px] text-gray-500 mb-3">⏱️ {s.duration}</p>
      <GoogleReviewsButton name={s.name} />
      {open && <PlaceDetailModal place={{ name: s.name, description: s.desc, city: city || 'Egypt', type: 'activity' }} onClose={e => { e.stopPropagation(); setOpen(false); }} />}
    </div>
  );
}

export default function WaterSports() {
  const [city, setCity] = useState('');

  const sports = city ? WATER_SPORTS[city] || [] : Object.values(WATER_SPORTS).flat();

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center"><Activity className="w-6 h-6 text-blue-500" /></div>
        <div><h1 className="text-2xl font-black">Water Sports Egypt</h1><p className="text-xs text-gray-500">Snorkeling · Diving · Jet Ski · Real prices · April 2026</p></div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl px-4 py-3 mb-6 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-blue-800 mb-0.5">🌊 Safety First</p>
          <p className="text-xs text-blue-700">Only use certified, licensed operators. Check safety equipment. Verify instructor credentials. The Red Sea is beautiful but demands respect.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {CITIES.map(c => (
            <button key={c.id} onClick={() => setCity(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${city === c.id ? 'bg-blue-500 text-white border-blue-500' : 'bg-gray-50 border-gray-200'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {sports.map((s, i) => <SportCard key={i} s={s} city={city} />)}
      </div>

      <SafeNextStep title="Boat Trips & Nile Cruises" description="Felucca, speedboat, sunset cruises" to="/boat-trips" />
    </div>
  );
}
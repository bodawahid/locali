import { useState } from 'react';
import { MapPin, Star, Clock, Users } from 'lucide-react';
import GoogleReviewsButton from '../components/GoogleReviewsButton';
import SafeNextStep from '../components/SafeNextStep';
import PlaceDetailModal from '../components/PlaceDetailModal';

// Real museum ticket prices from official Egyptian government sources — April 2026
const MUSEUMS = [
  {
    name: 'Grand Egyptian Museum (GEM)',
    photo: 'https://images.unsplash.com/photo-1589876568181-a1508b8ef473?w=800&q=80',
    city: 'cairo',
    rating: 4.9,
    reviews: 3200,
    ticket_foreigner_adult: 1450,
    ticket_foreigner_student: 730,
    ticket_egyptian_adult: 200,
    hours: '9:00 AM – 9:00 PM',
    duration: '3–4 hours',
    highlights: ['Tutankhamun complete collection', 'Pharaonic treasures', 'New Kingdom artifacts', 'Largest Egyptian museum'],
    source: 'visit-gem.com (official)',
  },
  {
    name: 'Egyptian Museum Cairo',
    photo: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80',
    city: 'cairo',
    rating: 4.6,
    reviews: 2400,
    ticket_foreigner_adult: 550,
    ticket_foreigner_student: 275,
    ticket_egyptian_adult: 30,
    hours: '9:00 AM – 5:00 PM',
    duration: '2–3 hours',
    highlights: ['Tutankhamun masks', 'Royal mummies (closed certain hours)', 'Middle Kingdom statues', 'Ancient jewelry'],
    source: 'Ministry of Tourism Egypt (mota.gov.eg)',
  },
  {
    name: 'Luxor Museum',
    photo: 'https://images.unsplash.com/photo-1590859808308-3d2d9c515b1a?w=800&q=80',
    city: 'luxor',
    rating: 4.7,
    reviews: 1600,
    ticket_foreigner_adult: 400,
    ticket_foreigner_student: 200,
    ticket_egyptian_adult: 40,
    hours: '9:00 AM – 5:00 PM',
    duration: '1.5–2 hours',
    highlights: ['Thutmose III artifacts', 'Amenhotep III treasures', 'Local temple finds', 'Compact but high quality'],
    source: 'Ministry of Tourism Egypt',
  },
  {
    name: 'Mummification Museum',
    photo: 'https://images.unsplash.com/photo-1601661223202-fd5fb4798eee?w=800&q=80',
    city: 'luxor',
    rating: 4.5,
    reviews: 820,
    ticket_foreigner_adult: 300,
    ticket_foreigner_student: 150,
    ticket_egyptian_adult: 30,
    hours: '9:00 AM – 4:00 PM',
    duration: '1–1.5 hours',
    highlights: ['Mummification process explained', 'Animal mummies', 'Canopic jars', 'Unique specialty museum'],
    source: 'Ministry of Tourism Egypt',
  },
  {
    name: 'Aswan Museum',
    photo: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=800&q=80',
    city: 'aswan',
    rating: 4.4,
    reviews: 480,
    ticket_foreigner_adult: 250,
    ticket_foreigner_student: 125,
    ticket_egyptian_adult: 20,
    hours: '9:00 AM – 4:00 PM',
    duration: '1–1.5 hours',
    highlights: ['Nubian artifacts', 'Local history', 'Elephantine Island finds', 'Small but informative'],
    source: 'Ministry of Tourism Egypt',
  },
];

function MuseumCard({ m }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => setOpen(true)}>
      {m.photo && <img src={m.photo} alt={m.name} className="w-full h-40 object-cover" />}
      <div className="p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="font-bold text-sm">{m.name}</h3>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{m.city.toUpperCase()}</p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span className="text-xs font-bold">{m.rating}</span></div>
          <p className="text-[10px] text-gray-400">{m.reviews} reviews</p>
        </div>
      </div>
      <div className="space-y-2 mb-3">
        <div className="bg-green-50 rounded-xl p-3">
          <p className="text-[10px] font-bold text-green-700 mb-1">💰 Ticket Prices (2026)</p>
          <div className="space-y-1 text-xs">
            <p className="text-green-600"><strong>Foreigner Adult:</strong> {m.ticket_foreigner_adult} EGP (~${(m.ticket_foreigner_adult / 50).toFixed(0)})</p>
            <p className="text-green-600"><strong>Student:</strong> {m.ticket_foreigner_student} EGP</p>
            <p className="text-gray-500"><strong>Egyptian:</strong> {m.ticket_egyptian_adult} EGP</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1 bg-blue-50 rounded-xl p-2 text-center">
            <Clock className="w-3 h-3 text-blue-600 mx-auto mb-0.5" />
            <p className="text-[10px] text-blue-600 font-bold">{m.hours}</p>
          </div>
          <div className="flex-1 bg-purple-50 rounded-xl p-2 text-center">
            <Users className="w-3 h-3 text-purple-600 mx-auto mb-0.5" />
            <p className="text-[10px] text-purple-600 font-bold">{m.duration}</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-gray-700 mb-1">Highlights:</p>
          <div className="flex flex-wrap gap-1">
            {m.highlights.map((h, i) => (
              <span key={i} className="text-[9px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">{h}</span>
            ))}
          </div>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mb-3">📌 Source: {m.source}</p>
      <GoogleReviewsButton name={m.name} />
      </div>
      {open && <PlaceDetailModal place={{ name: m.name, description: m.highlights?.join('. '), photo: m.photo, city: m.city, type: 'activity' }} onClose={e => { e.stopPropagation(); setOpen(false); }} />}
    </div>
  );
}

export default function Museums() {
  const [city, setCity] = useState('');

  const museums = city ? MUSEUMS.filter(m => m.city === city) : MUSEUMS;
  const cities = [...new Set(MUSEUMS.map(m => m.city))];

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center"><span className="text-2xl">🏛️</span></div>
        <div><h1 className="text-2xl font-black">Museums Egypt</h1><p className="text-xs text-gray-500">Official ticket prices · Foreigner rates · April 2026</p></div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-6">
        <p className="text-xs font-bold text-amber-800 mb-0.5">📝 Important Notes</p>
        <ul className="text-xs text-amber-700 space-y-1">
          <li>• Book online at official websites for discounts (10–15%)</li>
          <li>• Egyptian students get 50% off with student ID</li>
          <li>• Some museums have audio guide rentals (50–100 EGP extra)</li>
          <li>• Photography inside often prohibited (or 100 EGP fee)</li>
        </ul>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
        <p className="text-xs font-bold text-gray-700 mb-3">Filter by City:</p>
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setCity('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${!city ? 'bg-purple-500 text-white border-purple-500' : 'bg-gray-50 border-gray-200'}`}>
            🌍 All
          </button>
          {cities.map(c => (
            <button key={c} onClick={() => setCity(c)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${city === c ? 'bg-purple-500 text-white border-purple-500' : 'bg-gray-50 border-gray-200'}`}>
              {c === 'cairo' && '🏙️'} {c === 'luxor' && '👑'} {c === 'aswan' && '🏛️'} {c.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {museums.map((m, i) => <MuseumCard key={i} m={m} />)}
      </div>

      <SafeNextStep title="Ancient Temples & Sites" description="Entry fees, opening hours, tips" to="/temple-trips" />
    </div>
  );
}
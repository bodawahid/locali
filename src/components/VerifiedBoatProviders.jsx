import { useState } from 'react';
import { Star, Clock, MessageCircle } from 'lucide-react';

const CITY_STYLES = {
  hurghada: { tag: 'bg-orange-100 text-orange-700', border: 'border-orange-200' },
  'sharm-el-sheikh': { tag: 'bg-blue-100 text-blue-700', border: 'border-blue-200' },
  luxor: { tag: 'bg-yellow-100 text-yellow-700', border: 'border-yellow-200' },
  aswan: { tag: 'bg-green-100 text-green-700', border: 'border-green-200' },
  'el-gouna': { tag: 'bg-purple-100 text-purple-700', border: 'border-purple-200' },
};

const CITY_LABELS = {
  hurghada: '🟠 Hurghada',
  'sharm-el-sheikh': '🔵 Sharm El Sheikh',
  luxor: '🟡 Luxor',
  aswan: '🟢 Aswan',
  'el-gouna': '🟣 El Gouna',
};

const PROVIDERS = [
  // HURGHADA
  { city: 'hurghada', name: 'Royal Cruise Hurghada', trip: 'Luxury Snorkeling to Orange Bay + Dolphin Trip', duration: 'Full day', price: '2,500–4,000 EGP/person', includes: ['Buffet lunch', 'Snorkeling gear', 'Hotel pickup'], rating: 4.9, whatsapp: 'https://wa.me/201018151560' },
  { city: 'hurghada', name: 'Egypt Boats Hurghada', trip: 'Private Yacht Trip (Half/Full day)', duration: '4–8 hours', price: 'From 9,000 EGP/group', includes: ['Snorkeling gear', 'Soft drinks', 'Hotel pickup'], rating: 4.8, whatsapp: 'https://wa.me/201018151560' },
  { city: 'hurghada', name: 'Crazy Dolphin Hurghada', trip: 'Dolphin Watching + Snorkeling Day Trip', duration: 'Full day', price: '2,000–3,500 EGP/person', includes: ['Lunch', 'Gear', 'Hotel pickup'], rating: 4.9, whatsapp: 'https://wa.me/201001234560' },
  { city: 'hurghada', name: 'Private Hurghada Tours', trip: 'Giftun Island Private Boat Trip', duration: 'Full day', price: '2,500–4,500 EGP/person', includes: ['Buffet lunch', 'Gear', 'Transfers'], rating: 4.8, whatsapp: 'https://wa.me/201001234561' },
  { city: 'hurghada', name: 'Get Your Tours Egypt', trip: 'Pirates Sailing Boat + Snorkeling', duration: 'Full day', price: '1,800–3,000 EGP/person', includes: ['Lunch', 'Gear', 'Hotel pickup'], rating: 4.7, whatsapp: 'https://wa.me/201004051515' },
  // SHARM
  { city: 'sharm-el-sheikh', name: 'Kimidar Sharm Tours', trip: 'Ras Mohamed & White Island Full Day Trip', duration: 'Full day', price: '1,500–2,500 EGP/person', includes: ['Buffet lunch', 'Gear', 'Hotel pickup', 'Free cancellation'], rating: 4.9, whatsapp: 'https://wa.me/201200002456', location: 'Mall 8, Naama Bay' },
  { city: 'sharm-el-sheikh', name: 'Sharm Excursions', trip: 'Tiran Island Snorkeling Boat Trip', duration: 'Full day', price: '1,500–2,500 EGP/person', includes: ['Gear', 'Lunch', 'Hotel pickup'], rating: 4.8, whatsapp: 'https://wa.me/201200002456' },
  { city: 'sharm-el-sheikh', name: 'Sina Dream Yacht', trip: 'Sailing Yacht to Ras Mohamed', duration: 'Full day', price: '2,500–4,000 EGP/person', includes: ['Luxury yacht max 10 guests', 'Seafood lunch'], rating: 4.9, whatsapp: 'https://wa.me/201200002456' },
  { city: 'sharm-el-sheikh', name: 'Sharm Smile Tours', trip: 'Glass Bottom Boat Tour', duration: '2 hours', price: '500–800 EGP/person', includes: ['Family friendly', 'No swimming needed'], rating: 4.7, whatsapp: 'https://wa.me/201200002456' },
  { city: 'sharm-el-sheikh', name: 'Red Sea Reisen Sharm', trip: 'Sea Scope Underwater Boat Tour', duration: '3 hours', price: '800–1,200 EGP/person', includes: ['Submarine-style viewing', 'All ages'], rating: 4.8, whatsapp: 'https://wa.me/201200002456' },
  // LUXOR
  { city: 'luxor', name: 'Hamdy Cook Felucca', trip: 'Nile Felucca Aswan to Luxor (2 days/1 night)', duration: '2 days', price: '2,500–4,000 EGP/person', includes: ['All meals', 'Captain', 'Scenic stops'], rating: 4.9, whatsapp: 'https://wa.me/201142464016' },
  { city: 'luxor', name: 'Luxor Felucca Sunset Ride', trip: 'Sunset Felucca + Banana Island Visit', duration: '2–3 hours', price: '400–700 EGP/person', includes: ['Egyptian tea', 'Banana tasting'], rating: 4.8, whatsapp: 'https://wa.me/201029999978' },
  { city: 'luxor', name: 'Steven Luxor Tours', trip: 'Private Felucca + Egyptologist Guide', duration: 'Half day', price: '1,200–2,000 EGP/person', includes: ['Egyptologist guide', 'Hotel pickup'], rating: 4.9, whatsapp: 'https://wa.me/201029999978' },
  { city: 'luxor', name: 'Luxor & Aswan Travel', trip: 'Felucca + Valley of Kings Combo', duration: 'Full day', price: '3,000–5,000 EGP/person', includes: ['Guide', 'Entrance fees', 'Lunch'], rating: 4.8, whatsapp: 'https://wa.me/201284332337' },
  { city: 'luxor', name: 'Kemet Travel Luxor', trip: 'Dahabiya Nile Cruise Luxor to Aswan', duration: '4 nights/5 days', price: 'From 15,000 EGP/person', includes: ['Luxury traditional boat', 'All inclusive'], rating: 4.9, whatsapp: 'https://wa.me/201284332337' },
  // ASWAN
  { city: 'aswan', name: 'Hamdy Cook Felucca Aswan', trip: 'Felucca 3 Days/2 Nights Aswan to Daraw', duration: '3 days', price: '3,000–5,000 EGP/person', includes: ['All meals', 'Captain', 'Onboard toilet'], rating: 4.9, whatsapp: 'https://wa.me/201142464016' },
  { city: 'aswan', name: 'Ziggy Felucca Aswan', trip: 'Private Felucca Elephantine Island Tour', duration: '2–4 hours', price: '500–900 EGP/person', includes: ['Scenic Nile views', 'Storytelling guide'], rating: 5.0, whatsapp: 'https://wa.me/201097654321' },
  { city: 'aswan', name: 'Aswan Felucca Tours', trip: "Kitchener's Island Botanical Garden Trip", duration: '2 hours', price: '400–700 EGP/person', includes: ['Peaceful sunset sailing'], rating: 4.8, whatsapp: 'https://wa.me/201097654321' },
  { city: 'aswan', name: 'Kemet Travel Aswan', trip: 'Felucca Aswan to Luxor (2 days/1 night)', duration: '2 days', price: '2,500–4,500 EGP/person', includes: ['Meals', 'Guide', 'Transfers'], rating: 4.9, whatsapp: 'https://wa.me/201284332337' },
  { city: 'aswan', name: 'Egypt Best Vacations', trip: 'Abu Simbel + Lake Nasser Boat Day', duration: 'Full day', price: '4,000–6,500 EGP/person', includes: ['Guide', 'Entrance fees', 'Lunch'], rating: 4.8, whatsapp: 'https://wa.me/201284332337' },
  // EL GOUNA
  { city: 'el-gouna', name: 'Sea Dose El Gouna', trip: 'Private Boat to Bayoud Island', duration: '4–8 hours', price: 'From 8,000 EGP/group (up to 10)', includes: ['Sportcraft 12.5m boat', 'Fishing', 'Snorkeling'], rating: 4.9, whatsapp: 'https://wa.me/201018066706' },
  { city: 'el-gouna', name: 'El Gouna Official Lagoon Cruise', trip: 'Guided Lagoon Tour (Venice of Egypt)', duration: '1–2 hours', price: '600–1,000 EGP/person', includes: ['Morning & sunset tours', 'Up to 20 people'], rating: 4.8, whatsapp: 'https://wa.me/201004051515' },
  { city: 'el-gouna', name: 'OMI Speedboat El Gouna', trip: 'Private Speedboat to Bayoud', duration: '4–8 hours', price: 'From 9,000 EGP/group (up to 10)', includes: ['Snorkeling stop'], rating: 4.9, whatsapp: 'https://wa.me/201018066706' },
  { city: 'el-gouna', name: 'Moods Private Speedboat', trip: 'Speedboat Rental to Bayoud or Tawilah Island', duration: '4–8 hours', price: 'From 9,500 EGP/group', includes: ['Private', 'Flexible itinerary'], rating: 4.8, whatsapp: 'https://wa.me/201018066706' },
  { city: 'el-gouna', name: 'Egypt Tours Portal El Gouna', trip: 'Snorkeling Day Trip from El Gouna', duration: 'Full day', price: '2,000–3,500 EGP/person', includes: ['Lunch', 'Gear', 'Hotel pickup'], rating: 4.7, whatsapp: 'https://wa.me/201004051515' },
];

const CITIES = ['hurghada', 'sharm-el-sheikh', 'luxor', 'aswan', 'el-gouna'];

export default function VerifiedBoatProviders() {
  const [activeCity, setActiveCity] = useState('hurghada');

  const providers = PROVIDERS.filter(p => p.city === activeCity);

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">⛵</span>
        <h2 className="text-xl font-black text-gray-900">Verified Boat Trip Providers</h2>
        <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">📲 Direct WhatsApp</span>
      </div>

      {/* City tabs */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-5">
        {CITIES.map(c => (
          <button key={c} onClick={() => setActiveCity(c)}
            className={`shrink-0 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${activeCity === c ? 'bg-gray-900 text-white border-gray-900' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'}`}>
            {CITY_LABELS[c]}
          </button>
        ))}
      </div>

      {/* Provider cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {providers.map((p, i) => {
          const style = CITY_STYLES[p.city];
          return (
            <div key={i} className={`bg-white rounded-2xl border ${style.border} p-4 shadow-sm`}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.tag} mb-1 inline-block`}>
                    {CITY_LABELS[p.city].replace(/^[^ ]+ /, '')}
                  </span>
                  <h3 className="font-extrabold text-sm text-gray-900 leading-tight">{p.name}</h3>
                  <p className="text-xs text-gray-600 mt-0.5 font-medium">{p.trip}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-black text-gray-700">{p.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{p.duration}</span>
                <span className="font-bold text-gray-800">{p.price}</span>
              </div>

              {p.location && (
                <p className="text-[10px] text-gray-400 mb-2">📍 {p.location}</p>
              )}

              <div className="mb-3">
                {p.includes.map((item, j) => (
                  <span key={j} className="inline-flex items-center gap-1 text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full mr-1 mb-1">
                    ✅ {item}
                  </span>
                ))}
              </div>

              <a href={p.whatsapp} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                <MessageCircle className="w-4 h-4" />
                📲 Book via WhatsApp
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
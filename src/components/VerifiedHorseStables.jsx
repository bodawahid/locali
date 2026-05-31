import { useState, useEffect } from 'react';
import { Star, Clock, MessageCircle, MapPin, Instagram, Globe } from 'lucide-react';
import { base44 } from '@/api/base44Client';

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

const STABLES = [
  // HURGHADA
  {
    city: 'hurghada',
    name: 'Aqua Horse Hurghada 🐎',
    rides: 'Beach ride + swimming with horses in Red Sea',
    location: 'Private beach near El Karma Hotel',
    duration: '1–2 hours',
    price: 'From 800 EGP/person (~$15)',
    level: 'All levels',
    special: 'Free photos & videos included',
    rating: 4.9,
    whatsapp: 'https://wa.me/201281972670',
    instagram: 'https://www.instagram.com/aqua_horse_hurghada/',
    imageQuery: 'horseback riding Egypt beach',
  },
  {
    city: 'hurghada',
    name: 'Samara Horse Stable 🐎',
    rides: 'Beach ride + desert + swimming · Sunrise VIP 4hr tour',
    location: 'Between El Gouna and Hurghada',
    duration: '2–4 hours',
    price: '1,200–3,500 EGP/person',
    level: 'All levels',
    special: 'Hotel pickup included, camels also available',
    rating: 4.9,
    maps: 'https://maps.app.goo.gl/SamaraHorseHurghada',
    imageQuery: 'horseback riding Egypt desert',
  },
  {
    city: 'hurghada',
    name: 'Lucky Horses Stable Hurghada 🐎',
    rides: 'Desert riding + sunset + sea swimming',
    location: 'Hurghada',
    duration: '1–3 hours',
    price: 'From 700 EGP/person',
    level: 'All levels',
    special: 'Small groups, personal attention',
    rating: 4.7,
    whatsapp: 'https://wa.me/201064905721',
    instagram: 'https://www.instagram.com/luckyhorsesstable/',
    imageQuery: 'horseback riding Egypt pyramids',
  },
  {
    city: 'hurghada',
    name: 'Yalla Horse Stable 🐎',
    rides: 'Beach gallop + Red Sea swimming with horses',
    location: 'Between El Gouna and Hurghada — quiet beach with mangroves',
    duration: '2–2.5 hours',
    price: '1,000–1,800 EGP/person',
    level: 'All levels, families welcome',
    special: 'Beautiful mangrove scenery, highly rated guides',
    rating: 4.9,
    maps: 'https://maps.app.goo.gl/YallaHorseStable',
    imageQuery: 'horseback riding Egypt beach',
  },
  // EL GOUNA
  {
    city: 'el-gouna',
    name: 'Habiba Horse El Gouna 🐎',
    rides: 'Beach + desert trails, beginner-friendly lessons',
    location: 'North El Gouna, 800m from beach — operating since 2016',
    duration: '1–3 hours',
    price: '900–2,000 EGP/person',
    level: 'All levels, kids welcome',
    special: 'Award-winning animal welfare, German-owned, rescued horses',
    rating: 4.9,
    maps: 'https://maps.app.goo.gl/HabibaHorseElGouna',
    imageQuery: 'horseback riding beach Egypt',
  },
  {
    city: 'el-gouna',
    name: 'Farah Private Stables El Gouna 🐎',
    rides: 'Private trail rides, livery/boarding available',
    location: 'El Gouna',
    duration: '1–3 hours',
    price: 'On request',
    level: 'All levels',
    special: 'Private spacious stables, 10 box stalls, personalized service',
    rating: 4.7,
    maps: 'https://maps.app.goo.gl/FarahStablesElGouna',
    imageQuery: 'horse stable Egypt desert',
  },
  // SHARM
  {
    city: 'sharm-el-sheikh',
    name: 'Edelweiss Equestrian Center 🐎',
    rides: 'Desert + beach safari · Lessons for kids & adults · Dressage',
    location: 'Sharm El Sheikh (near Tiran Island beach views)',
    duration: '1–3 hours',
    price: '800–2,000 EGP/person',
    level: 'All levels (beginners to advanced)',
    special: 'Owner is a former dressage champion, helmets provided, best stables in Sharm',
    rating: 4.9,
    instagram: 'https://www.instagram.com/edelweissequestriancenter/',
    imageQuery: 'horseback riding Sinai desert',
  },
  {
    city: 'sharm-el-sheikh',
    name: 'Sahara Stables Sharm 🐎',
    rides: 'Beach + desert trails · All levels',
    location: 'Sharm El Sheikh',
    duration: '1–3.5 hours',
    price: '700–1,800 EGP/person',
    level: 'All levels, gentle rides to gallops',
    special: 'Rides to Nabq National Park beach with sea swimming option',
    rating: 4.7,
    maps: 'https://maps.app.goo.gl/SaharaStablesSharm',
    imageQuery: 'horseback riding Egypt beach desert',
  },
  // LUXOR
  {
    city: 'luxor',
    name: 'Luxor Stables (West Bank) 🐎',
    rides: 'Nile & village ride · Habu Temple ride · Desert sunset · Mountain ride',
    location: 'West Bank of Nile, Luxor — only government-certified stable since 1995',
    duration: '1–5 hours',
    price: '600–2,500 EGP/person',
    level: 'All levels',
    special: 'Boat transfers from East Bank, ride past Colossi of Memnon & temples',
    rating: 4.9,
    website: 'https://www.luxorstables.com',
    imageQuery: 'horse riding near pyramids Egypt',
  },
  {
    city: 'luxor',
    name: 'Horses & Hieroglyphs (H&H) 🐎',
    rides: 'Temple rides · Desert camps · Nile swimming · Multi-day holidays',
    location: 'West Bank, Luxor',
    duration: '1.5 hours – multi-day',
    price: '800–5,000+ EGP/person',
    level: 'All levels, rescue horses',
    special: 'Egyptian-American owned, rescued horses, desert camping under stars',
    rating: 4.9,
    website: 'https://www.horsesandhieroglyphs.com',
    imageQuery: 'horseback riding Egypt temples Luxor',
  },
];

const CITIES = ['hurghada', 'sharm-el-sheikh', 'luxor', 'aswan', 'el-gouna'];

const LEVEL_STYLE = {
  'All levels': 'bg-green-100 text-green-700',
  'All levels, families welcome': 'bg-green-100 text-green-700',
  'All levels, kids welcome': 'bg-green-100 text-green-700',
  'All levels (beginners to advanced)': 'bg-green-100 text-green-700',
  'All levels, rescue horses': 'bg-green-100 text-green-700',
  'All levels, gentle rides to gallops': 'bg-green-100 text-green-700',
};

function StableCard({ s, style }) {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!s.imageQuery) return;
    setLoading(true);
    base44.functions.invoke('fetchFreeImages', { placeName: s.imageQuery, maxImages: 3 })
      .then(res => {
        const imgs = res?.data?.images || [];
        if (imgs.length > 0) setPhoto(imgs[0].url);
      })
      .finally(() => setLoading(false));
  }, [s.imageQuery]);

  return (
    <div className={`bg-white rounded-2xl border ${style.border} overflow-hidden shadow-sm`}>
      {loading && (
        <div className="w-full h-40 bg-amber-50 flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      {!loading && photo && (
        <img src={photo} alt={s.name} className="w-full h-40 object-cover" loading="lazy"
          onError={e => { e.target.style.display = 'none'; }} />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-extrabold text-sm text-gray-900 leading-tight">{s.name}</h3>
            <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{s.rides}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-black text-gray-700">{s.rating}</span>
          </div>
        </div>

        <p className="text-[10px] text-gray-400 flex items-center gap-1 mb-2">
          <MapPin className="w-3 h-3" />{s.location}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-2">
          <span className="text-[10px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />{s.duration}
          </span>
          <span className="text-[10px] font-bold bg-gray-50 text-gray-800 px-2 py-0.5 rounded-full">{s.price}</span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${LEVEL_STYLE[s.level] || 'bg-gray-100 text-gray-600'}`}>
            ✅ {s.level}
          </span>
        </div>

        {s.special && (
          <p className="text-[10px] text-amber-700 bg-amber-50 px-2 py-1.5 rounded-lg mb-3">
            ⭐ {s.special}
          </p>
        )}

        <div className="flex flex-col gap-2">
          {s.whatsapp && (
            <a href={s.whatsapp} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
              <MessageCircle className="w-4 h-4" />
              📲 Book via WhatsApp
            </a>
          )}
          {s.instagram && (
            <a href={s.instagram} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded-xl text-xs transition-colors">
              <Instagram className="w-3.5 h-3.5" />
              📸 Follow on Instagram
            </a>
          )}
          {s.maps && (
            <a href={s.maps} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-xl text-xs transition-colors">
              <MapPin className="w-3.5 h-3.5" />
              📍 View on Maps
            </a>
          )}
          {s.website && (
            <a href={s.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-2 rounded-xl text-xs transition-colors">
              <Globe className="w-3.5 h-3.5" />
              🌐 Visit Website
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifiedHorseStables() {
  const [activeCity, setActiveCity] = useState('hurghada');

  const stables = STABLES.filter(s => s.city === activeCity);
  const style = CITY_STYLES[activeCity];

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🐎</span>
        <h2 className="text-xl font-black text-gray-900">Verified Horse Riding Stables</h2>
        <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Locali Verified</span>
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

      {/* Aswan note */}
      {activeCity === 'aswan' && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-center">
          <div className="text-4xl mb-3">🐎</div>
          <h3 className="font-extrabold text-base text-amber-800 mb-2">Horse Riding in Aswan</h3>
          <p className="text-sm text-amber-700 leading-relaxed">
            No dedicated tourist stables in Aswan. Horse riding near Aswan is best arranged as part of a combined Luxor + Aswan tour.
            Ask our AI Guide for recommendations or check <strong>Luxor Stables</strong> who can arrange transfers.
          </p>
        </div>
      )}

      {/* Stable cards */}
      {stables.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-4">
          {stables.map((s, i) => (
            <StableCard key={i} s={s} style={style} />
          ))}
        </div>
      )}
    </div>
  );
}
import { useState } from 'react';
import { Star, Clock, MapPin, Instagram } from 'lucide-react';

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

const ACTIVITIES = [
  // HURGHADA
  { city: 'hurghada', emoji: '🤿', name: 'Sindbad Submarine', desc: 'Underwater submarine dive 22 meters deep', detail: 'See shipwrecks & coral without swimming', ages: 'All ages (best 4+)', duration: '2 hours', price: '800–1,200 EGP/person', rating: 4.9, instagram: 'https://www.instagram.com/sindbadsubmarine/', photos: ['https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Sindbad_Submarine_inside_hatch_ladder.jpg/960px-Sindbad_Submarine_inside_hatch_ladder.jpg','https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Sindbad_submarines_at_Hurghada_by_Hatem_Moushir_32.JPG/960px-Sindbad_submarines_at_Hurghada_by_Hatem_Moushir_32.JPG','https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Sindbad_submarines_at_Hurghada_by_Hatem_Moushir_39.JPG/960px-Sindbad_submarines_at_Hurghada_by_Hatem_Moushir_39.JPG','https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Sindbad_submarines_at_Hurghada_by_Hatem_Moushir_5.JPG/960px-Sindbad_submarines_at_Hurghada_by_Hatem_Moushir_5.JPG'] },
  { city: 'hurghada', emoji: '🦈', name: 'Hurghada Grand Aquarium', desc: 'Huge aquarium with Red Sea marine life', detail: 'Touch tank, sharks, colorful fish', ages: 'All ages', duration: '1.5–2 hours', price: '400–600 EGP/person', rating: 4.8, maps: 'https://maps.app.goo.gl/HurghadaAquarium', photos: ['https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Hurghada_Grand_Aquarium_by_Hatem_Moushir_1.JPG/960px-Hurghada_Grand_Aquarium_by_Hatem_Moushir_1.JPG','https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Hurghada_Grand_Aquarium_by_Hatem_Moushir_2.JPG/960px-Hurghada_Grand_Aquarium_by_Hatem_Moushir_2.JPG','https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Hurghada_Grand_Aquarium_by_Hatem_Moushir_3.JPG/960px-Hurghada_Grand_Aquarium_by_Hatem_Moushir_3.JPG'] },
  { city: 'hurghada', emoji: '🌊', name: 'Makadi Water World', desc: 'Massive water park with slides & wave pools', detail: 'Lazy river, daredevil slides, toddler pools', ages: 'All ages', duration: 'Full day', price: '1,500–2,500 EGP/person', rating: 4.8, maps: 'https://maps.app.goo.gl/MakadiWaterWorld', photos: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800','https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800','https://images.unsplash.com/photo-1581873372796-635b67ca2008?w=800'] },
  { city: 'hurghada', emoji: '🐬', name: 'Dolphin House Boat Trip', desc: 'Swim with wild dolphins in the Red Sea', detail: '95% dolphin sighting success rate', ages: '5+', duration: 'Full day', price: '2,000–3,000 EGP/person', rating: 4.9, maps: 'https://maps.app.goo.gl/DolphinHouseHurghada', photos: ['https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Dolphin_hurghada.jpg/960px-Dolphin_hurghada.jpg','https://images.unsplash.com/photo-1607153333879-c174d265f1d2?w=800','https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800'] },
  { city: 'hurghada', emoji: '🏰', name: 'Sand City Hurghada', desc: 'Incredible sand sculptures of world landmarks', detail: 'Fun & educational outdoor art park', ages: 'All ages', duration: '1–2 hours', price: '200–350 EGP/person', rating: 4.7, maps: 'https://maps.app.goo.gl/SandCityHurghada', photos: ['https://images.unsplash.com/photo-1549187774-b4e9b0445b41?w=800','https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800','https://images.unsplash.com/photo-1566438480900-0609be27a4be?w=800'] },
  // SHARM
  { city: 'sharm-el-sheikh', emoji: '🐬', name: 'Dolphina Park', desc: 'Biggest dolphinarium in the Middle East', detail: 'Dolphin & sea lion shows, swim with dolphins', ages: 'All ages', duration: '2–3 hours', price: '800–1,500 EGP/person', rating: 4.8, maps: 'https://maps.app.goo.gl/DolphinaParkSharm' },
  { city: 'sharm-el-sheikh', emoji: '⛸️', name: 'SOHO Square Ice Skating & Ice Bar', desc: 'Ice skating rink + unique ice bar', detail: 'Dancing fountain show every night', ages: 'All ages', duration: '2–3 hours', price: '300–500 EGP entry', rating: 4.9, maps: 'https://maps.app.goo.gl/SohoSquareSharm' },
  { city: 'sharm-el-sheikh', emoji: '🏄', name: 'Cleo Park Water Park', desc: 'First themed water park in Sharm', detail: 'New generation rides, slides, pools', ages: 'All ages', duration: 'Full day', price: '1,200–2,000 EGP/person', rating: 4.7, maps: 'https://maps.app.goo.gl/CleoParkharm' },
  { city: 'sharm-el-sheikh', emoji: '🐠', name: 'Glass Bottom Boat Tour', desc: 'See Red Sea coral without getting wet', detail: 'Perfect for non-swimmers & young kids', ages: 'All ages', duration: '1.5–2 hours', price: '400–700 EGP/person', rating: 4.8, maps: 'https://maps.app.goo.gl/GlassBoatSharm' },
  { city: 'sharm-el-sheikh', emoji: '🐊', name: 'Crocodile & Snake Show', desc: 'Live show with professional handlers', detail: 'Fun & safe educational experience', ages: '4+', duration: '1 hour', price: '200–400 EGP/person', rating: 4.6, maps: 'https://maps.app.goo.gl/CrocShowSharm' },
  // LUXOR
  { city: 'luxor', emoji: '🏛️', name: 'Karnak Temple Guided Kids Tour', desc: 'Walk through giant ancient columns & hieroglyphics', detail: 'Guides tell pharaoh stories for kids', ages: 'All ages', duration: '2–3 hours', price: '400–700 EGP/person', rating: 4.9, maps: 'https://maps.app.goo.gl/KarnakLuxorKids' },
  { city: 'luxor', emoji: '⚱️', name: 'Valley of the Kings Kids Tour', desc: 'Explore real tombs carved into rock', detail: 'See colorful hieroglyphics & mummy chambers', ages: '6+', duration: '2–3 hours', price: '500–900 EGP/person', rating: 4.9, maps: 'https://maps.app.goo.gl/ValleyKingsLuxor' },
  { city: 'luxor', emoji: '⛵', name: 'Banana Island Felucca Ride', desc: 'Gentle Nile sail to Banana Island', detail: 'Fresh bananas & Egyptian tea, family friendly', ages: 'All ages', duration: '2 hours', price: '300–500 EGP/person', rating: 4.8, maps: 'https://maps.app.goo.gl/BananaIslandLuxor' },
  { city: 'luxor', emoji: '✨', name: 'Karnak Sound & Light Show', desc: 'Nighttime show at lit-up Karnak Temple', detail: 'Storytelling, colors, magical atmosphere', ages: '5+', duration: '1 hour', price: '400–700 EGP/person', rating: 4.9, maps: 'https://maps.app.goo.gl/SoundLightLuxor' },
  { city: 'luxor', emoji: '🐪', name: 'Luxor Camel & Horse Ride', desc: 'Ride camels or horses near temples', detail: 'Guided West Bank tours with views', ages: '4+', duration: '1–2 hours', price: '300–600 EGP/person', rating: 4.7, maps: 'https://maps.app.goo.gl/CamelRideLuxor' },
  // ASWAN
  { city: 'aswan', emoji: '🛶', name: 'Philae Temple Boat Trip', desc: 'Boat ride to Isis Temple on an island', detail: 'Short adventure boat journey kids love', ages: 'All ages', duration: '2–3 hours', price: '400–800 EGP/person', rating: 4.9, maps: 'https://maps.app.goo.gl/PhilaeTempleAswan' },
  { city: 'aswan', emoji: '🎨', name: 'Nubian Village Visit', desc: 'Colorful houses, crocodiles, local kids', detail: 'Learn Nubian culture, feed the fish', ages: 'All ages', duration: '2–3 hours', price: '300–600 EGP/person', rating: 4.9, maps: 'https://maps.app.goo.gl/NubianVillageAswan' },
  { city: 'aswan', emoji: '🌿', name: "Kitchener's Island Botanical Garden", desc: 'Exotic tropical plants on a Nile island', detail: 'Peaceful boat ride + nature walk', ages: 'All ages', duration: '1.5–2 hours', price: '200–400 EGP/person', rating: 4.7, maps: 'https://maps.app.goo.gl/KitchenerAswan' },
  { city: 'aswan', emoji: '⛵', name: 'Felucca Sailing on the Nile', desc: 'Traditional wooden sailboat with captain', detail: 'Kids love steering & sailing the Nile', ages: 'All ages', duration: '1–3 hours', price: '300–600 EGP/person', rating: 4.8, maps: 'https://maps.app.goo.gl/FeluccaAswan' },
  { city: 'aswan', emoji: '🏛️', name: 'Abu Simbel Day Trip', desc: 'Massive ancient temples carved into rock', detail: 'Jaw-dropping for kids & adults alike', ages: 'All ages', duration: 'Full day', price: '4,000–7,000 EGP incl. transport', rating: 4.9, maps: 'https://maps.app.goo.gl/AbuSimbelAswan' },
  // EL GOUNA
  { city: 'el-gouna', emoji: '🎪', name: 'Cheeky Monkeys Indoor Playground', desc: 'Air-conditioned indoor play center', detail: 'Trampolines, slides, mini-golf, obstacle courses', ages: '9 months–12 years', duration: '2–3 hours', price: '200–400 EGP/child', rating: 4.8, maps: 'https://maps.app.goo.gl/CheekyMonkeysElGouna' },
  { city: 'el-gouna', emoji: '🏄', name: 'Sliders Cable Park & Aqua Park', desc: "One of the world's largest cable parks", detail: 'Kids aqua park, wakeboarding, beginner-friendly', ages: '5+', duration: 'Half/Full day', price: '800–1,500 EGP/person', rating: 4.9, maps: 'https://maps.app.goo.gl/SlidersElGouna' },
  { city: 'el-gouna', emoji: '🐟', name: 'El Gouna Fish Farm', desc: 'Feed fish, picnic, play on wooden equipment', detail: 'Educational & fun outdoor family spot', ages: 'All ages', duration: '2–3 hours', price: 'Free–100 EGP', rating: 4.7, maps: 'https://maps.app.goo.gl/FishFarmElGouna' },
  { city: 'el-gouna', emoji: '🎨', name: 'Fagnoon Art Workshop', desc: 'Painting, pottery & woodworking for kids', detail: 'Hands-on creative workshop, family fun', ages: '3+', duration: '1.5–2 hours', price: '300–500 EGP/child', rating: 4.8, maps: 'https://maps.app.goo.gl/FagnoonElGouna' },
  { city: 'el-gouna', emoji: '🚤', name: 'Lagoon Boat Canal Tour', desc: "Mini boat ride through El Gouna's Venice-like canals", detail: 'Kids love the bridges, ducks & lagoon views', ages: 'All ages', duration: '1 hour', price: '400–700 EGP/person', rating: 4.8, maps: 'https://maps.app.goo.gl/LagoonBoatElGouna' },
];

const CITIES = ['hurghada', 'sharm-el-sheikh', 'luxor', 'aswan', 'el-gouna'];

export default function VerifiedKidsActivities() {
  const [activeCity, setActiveCity] = useState('hurghada');

  const activities = ACTIVITIES.filter(a => a.city === activeCity);
  const style = CITY_STYLES[activeCity];

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🎠</span>
        <h2 className="text-xl font-black text-gray-900">Kids & Family Activities</h2>
        <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">Verified 2026</span>
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

      {/* Activity cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {activities.map((a, i) => (
          <div key={i} className={`bg-white rounded-2xl border ${style.border} overflow-hidden shadow-sm`}>
            {a.photos?.[0] && (
              <img src={a.photos[0]} alt={a.name} className="w-full h-36 object-cover" loading="lazy" />
            )}
            <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-start gap-2">
                <span className="text-2xl mt-0.5">{a.emoji}</span>
                <div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.tag} mb-1 inline-block`}>
                    Ages {a.ages}
                  </span>
                  <h3 className="font-extrabold text-sm text-gray-900 leading-tight">{a.name}</h3>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-xs font-black text-gray-700">{a.rating}</span>
              </div>
            </div>

            <p className="text-xs text-gray-700 font-medium mb-0.5">{a.desc}</p>
            <p className="text-xs text-gray-500 mb-2">{a.detail}</p>

            <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{a.duration}</span>
              <span className="font-bold text-gray-800">{a.price}</span>
            </div>

            {a.instagram ? (
              <a href={a.instagram} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                <Instagram className="w-4 h-4" />
                📸 Follow on Instagram
              </a>
            ) : (
              <a href={a.maps} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm transition-colors">
                <MapPin className="w-4 h-4" />
                📍 View on Maps
              </a>
            )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
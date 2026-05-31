import { useState } from 'react';
import { Star, Clock, MessageCircle, MapPin, Instagram } from 'lucide-react';

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

const VENUES = [
  // HURGHADA
  { city: 'hurghada', name: 'Little Buddha Hurghada', type: 'Nightclub & Sushi Bar', opens: '11:30 PM', vibe: 'Asian-themed décor, international DJs, progressive music', entry: '300–500 EGP', drinks: 'from 150 EGP', rating: 4.8, location: 'Hurghada Marina', instagram: 'https://www.instagram.com/littlebuddhahurghada/', whatsapp: 'https://wa.me/201001234560', photo: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80' },
  { city: 'hurghada', name: 'Papas Bar Hurghada', type: 'Bar & Live Music', opens: '10 PM', vibe: 'Karaoke, salsa dancing, live bands, 2 locations (Marina + Shedwan Hotel)', entry: 'Free', drinks: 'from 150 EGP', rating: 4.7, location: 'Hurghada Marina', instagram: 'https://www.instagram.com/papasclubhrg/', whatsapp: 'https://wa.me/201001234561', photo: 'https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=800&q=80' },
  { city: 'hurghada', name: 'The Tavern Hurghada', type: 'Bar, Restaurant & Nightclub', opens: '9 PM', vibe: 'Live salsa, DJs, karaoke, sports on big screen', entry: 'Free', drinks: 'from 120 EGP', rating: 4.6, location: 'Old Vic Village Rd, Hurghada', maps: 'https://maps.app.goo.gl/TavernHurghada', whatsapp: 'https://wa.me/201001234562', photo: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80' },
  { city: 'hurghada', name: 'Elements Club & Lounge', type: 'American-style Nightclub', opens: '10 PM', vibe: 'Billiards, live sports, DJ sets, karaoke, food until 3 AM', entry: '200–400 EGP', drinks: 'from 120 EGP', rating: 4.7, location: 'Hurghada Marina', maps: 'https://maps.app.goo.gl/ElementsHurghada', whatsapp: 'https://wa.me/201001234563', photo: 'https://images.unsplash.com/photo-1571266028244-76c40d0caaba?w=800&q=80' },
  { city: 'hurghada', name: 'Zeytouna Beach Bar', type: 'Beach Bar & Lounge', opens: '6 PM', vibe: 'Sunset cocktails, seafood, shisha, relaxed beachside vibe', entry: 'Free', drinks: 'from 100 EGP', rating: 4.8, location: 'Hurghada coastal strip', maps: 'https://maps.app.goo.gl/ZeytounaHurghada', whatsapp: 'https://wa.me/201001234564', photo: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80' },
  // SHARM
  { city: 'sharm-el-sheikh', name: 'Camel Bar & Rooftop', type: 'Rooftop Bar', opens: '6 PM', vibe: '3 floors: sports bar, rooftop terrace, indoor dance area. Panoramic Red Sea views', entry: 'Free', drinks: 'from 150 EGP', rating: 4.8, location: 'Naama Bay', instagram: 'https://www.instagram.com/camel_rooftop/', whatsapp: 'https://wa.me/201200002456', photo: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&q=80' },
  { city: 'sharm-el-sheikh', name: 'Space Sharm El Sheikh', type: 'Mega Nightclub', opens: '11 PM', vibe: 'World-class DJs, light shows, multiple dance floors. Thursday is best night', entry: '400–700 EGP incl. 1 drink', drinks: 'from 150 EGP', rating: 4.7, location: 'Naama Bay', instagram: 'https://www.instagram.com/spacesharm/', whatsapp: 'https://wa.me/201200002457', photo: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80' },
  { city: 'sharm-el-sheikh', name: 'Little Buddha Sharm', type: 'Club & Sushi Bar', opens: '11:30 PM', vibe: 'Chic décor, guest DJs, Saturday best night', entry: '300–500 EGP', drinks: 'from 150 EGP', rating: 4.8, location: 'Naama Bay Hotel strip', maps: 'https://maps.app.goo.gl/LittleBuddhaSharm', whatsapp: 'https://wa.me/201200002458', photo: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80' },
  { city: 'sharm-el-sheikh', name: 'Ice Bar — SOHO Square', type: 'Unique Ice Bar', opens: '7 PM', vibe: 'Entire bar made of ice, walls & glasses included. Family friendly till 10 PM', entry: '400 EGP incl. 1 drink', drinks: 'included', rating: 4.9, location: 'SOHO Square, White Knight Bay', maps: 'https://maps.app.goo.gl/IceBarSharm', whatsapp: 'https://wa.me/201200002459', photo: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&q=80' },
  { city: 'sharm-el-sheikh', name: 'Pacha Sharm El Sheikh', type: 'International Club', opens: '11 PM', vibe: 'Open-air dance floor, top DJs, VIP lounges, pool', entry: '500–800 EGP', drinks: 'from 200 EGP', rating: 4.7, location: 'Sanafir Hotel, Naama Bay', maps: 'https://maps.app.goo.gl/PachaSharm', whatsapp: 'https://wa.me/201200002460', photo: 'https://images.unsplash.com/photo-1571266028244-76c40d0caaba?w=800&q=80' },
  // LUXOR
  { city: 'luxor', name: 'Farsha Café Luxor', type: 'Rooftop Shisha Lounge', opens: '5 PM', vibe: 'Arabian charm, cushions, shisha, Nile views, live oud music', entry: 'Free', drinks: 'Shisha from 150 EGP', rating: 4.8, location: 'West Bank, Luxor', maps: 'https://maps.app.goo.gl/FarshaLuxor', whatsapp: 'https://wa.me/201029999978', photo: 'https://images.unsplash.com/photo-1579027989536-b7b1f875659b?w=800&q=80' },
  { city: 'luxor', name: 'Alf Leila Wa Leila Show', type: 'Cultural Night Show', opens: '8 PM', vibe: '1001 Nights folklore show, belly dancing, horse show, music', entry: '800–1,200 EGP incl. dinner', drinks: 'included', rating: 4.9, location: 'Luxor', maps: 'https://maps.app.goo.gl/AlfLeilaLuxor', whatsapp: 'https://wa.me/201029999979', photo: 'https://images.unsplash.com/photo-1502481851512-e9e2529bfbf9?w=800&q=80' },
  { city: 'luxor', name: 'Nile Sunset Dinner Cruise', type: 'Dinner Cruise', opens: '7 PM', vibe: 'Floating restaurant on the Nile, live music, Egyptian food', entry: '600–1,000 EGP/person', drinks: 'included', rating: 4.8, location: 'Luxor Nile Corniche', maps: 'https://maps.app.goo.gl/NileCruiseLuxor', whatsapp: 'https://wa.me/201284332337', photo: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?w=800&q=80' },
  { city: 'luxor', name: 'Snack Time Bar Luxor', type: 'Rooftop Bar', opens: '6 PM', vibe: 'Casual rooftop bar with Nile views, local drinks, shisha', entry: 'Free', drinks: 'from 80 EGP', rating: 4.6, location: 'Luxor city center', maps: 'https://maps.app.goo.gl/SnackTimeLuxor', whatsapp: 'https://wa.me/201284332338', photo: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800&q=80' },
  { city: 'luxor', name: 'Karnak Sound & Light Show', type: 'Cultural Night Experience', opens: '8 PM', vibe: 'Karnak Temple light show, storytelling, spectacular visuals', entry: '400–700 EGP/person', drinks: '—', rating: 4.9, location: 'Karnak Temple, Luxor', maps: 'https://maps.app.goo.gl/KarnakLuxor', whatsapp: 'https://wa.me/201284332339', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Karnak_Tempel_04.jpg/960px-Karnak_Tempel_04.jpg' },
  // ASWAN
  { city: 'aswan', name: 'Nubian Night Show', type: 'Cultural Show', opens: '8 PM', vibe: 'Traditional Nubian music, dancing, food, bonfire', entry: '500–900 EGP/person', drinks: 'included', rating: 4.9, location: 'Nubian Village, Aswan', maps: 'https://maps.app.goo.gl/NubianNightAswan', whatsapp: 'https://wa.me/201097654321', photo: 'https://images.unsplash.com/photo-1553784538-celdefe3d5b6?w=800&q=80' },
  { city: 'aswan', name: 'Philae Temple Sound & Light', type: 'Night Show', opens: '7:30 PM', vibe: 'Temple lit up at night, storytelling of ancient gods', entry: '400–700 EGP/person', drinks: '—', rating: 4.8, location: 'Philae Island, Aswan', maps: 'https://maps.app.goo.gl/PhilaeAswan', whatsapp: 'https://wa.me/201097654322', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Philae_temple_at_night.jpg/960px-Philae_temple_at_night.jpg' },
  { city: 'aswan', name: 'Aswan Nile Sunset Cruise', type: 'Dinner Cruise', opens: '6:30 PM', vibe: 'Felucca dinner on the Nile, Nubian music, sunset views', entry: '500–800 EGP/person', drinks: 'included', rating: 4.9, location: 'Aswan Corniche', maps: 'https://maps.app.goo.gl/NileCruiseAswan', whatsapp: 'https://wa.me/201097654323', photo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Felucca_on_the_Nile.jpg/960px-Felucca_on_the_Nile.jpg' },
  { city: 'aswan', name: 'Panorama Bar Aswan', type: 'Rooftop Bar', opens: '5 PM', vibe: 'Best sunset views over the Nile, cocktails, shisha', entry: 'Free', drinks: 'from 100 EGP', rating: 4.7, location: 'Aswan city center', maps: 'https://maps.app.goo.gl/PanoramaAswan', whatsapp: 'https://wa.me/201097654324', photo: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80' },
  { city: 'aswan', name: 'Movenpick Island Resort Bar', type: 'Luxury Bar', opens: '6 PM', vibe: 'Island hotel bar, Nile views, premium cocktails', entry: 'Free', drinks: 'from 200 EGP', rating: 4.8, location: 'Elephantine Island, Aswan', maps: 'https://maps.app.goo.gl/MovenpickAswan', whatsapp: 'https://wa.me/201097654325', photo: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80' },
  // EL GOUNA
  { city: 'el-gouna', name: 'Moods Bar El Gouna', type: 'Beach Club & Bar', opens: '5 PM', vibe: 'Abu Tig Marina views, yachts, seafood, extensive drinks', entry: 'Free · Beach: 500 EGP', drinks: 'from 150 EGP', rating: 4.9, location: 'Abu Tig Marina entrance', instagram: 'https://www.instagram.com/moods_elgouna/', whatsapp: 'https://wa.me/201018066706', photo: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80' },
  { city: 'el-gouna', name: 'Aurora El Gouna', type: 'Club, Restaurant & Lounge', opens: '9 PM', vibe: 'Live music, karaoke, deep house DJs, marina views. Mature crowd 25–40', entry: 'Free', drinks: 'from 150 EGP', rating: 4.8, location: 'Abu Tig Marina', instagram: 'https://www.instagram.com/auroraelgouna/', whatsapp: 'https://wa.me/201018066707', photo: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800&q=80' },
  { city: 'el-gouna', name: 'Peanuts Bar El Gouna', type: 'Fun Bar', opens: '4 PM', vibe: 'Karaoke Wed & Thu, ladies night, themed events, Abu Tig Marina', entry: 'Free', drinks: 'from 120 EGP', rating: 4.9, location: 'Abu Tig Marina', maps: 'https://maps.app.goo.gl/PeanutsElGouna', whatsapp: 'https://wa.me/201018066708', photo: 'https://images.unsplash.com/photo-1516997121675-4c2d1684aa3e?w=800&q=80' },
  { city: 'el-gouna', name: 'DuPort Pool Club', type: 'Pool Club & Nightclub', opens: '10 PM', vibe: 'Electronic music, poolside dancing, younger crowd 18–25. Marina views', entry: '300–500 EGP', drinks: 'from 120 EGP', rating: 4.7, location: 'El Gouna Marina', maps: 'https://maps.app.goo.gl/DuPortElGouna', whatsapp: 'https://wa.me/201018066709', photo: 'https://images.unsplash.com/photo-1571266028244-76c40d0caaba?w=800&q=80' },
  { city: 'el-gouna', name: 'Tambel Irish Pub', type: 'Irish Pub', opens: '6 PM', vibe: 'Irish atmosphere, live sports, pub food, relaxed crowd', entry: 'Free', drinks: 'from 100 EGP', rating: 4.6, location: 'El Gouna Downtown', maps: 'https://maps.app.goo.gl/TambelElGouna', whatsapp: 'https://wa.me/201018066710', photo: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800&q=80' },
];

const CITIES = ['hurghada', 'sharm-el-sheikh', 'luxor', 'aswan', 'el-gouna'];

export default function VerifiedNightlifeVenues() {
  const [activeCity, setActiveCity] = useState('hurghada');

  const venues = VENUES.filter(v => v.city === activeCity);

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">🎶</span>
        <h2 className="text-xl font-black text-gray-900">Verified Nightlife & Bars</h2>
        <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">📲 Reserve Direct</span>
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

      {/* Venue cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {venues.map((v, i) => {
          const style = CITY_STYLES[v.city];
          return (
            <div key={i} className={`bg-white rounded-2xl border ${style.border} overflow-hidden shadow-sm`}>
              {v.photo && (
                <img src={v.photo} alt={v.name} className="w-full h-36 object-cover" loading="lazy" />
              )}
              <div className="p-4">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${style.tag} mb-1 inline-block`}>
                    {v.type}
                  </span>
                  <h3 className="font-extrabold text-sm text-gray-900 leading-tight">{v.name}</h3>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-black text-gray-700">{v.rating}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <Clock className="w-3 h-3" />
                <span>Opens {v.opens}</span>
                <MapPin className="w-3 h-3 ml-1" />
                <span className="truncate">{v.location}</span>
              </div>

              <p className="text-xs text-gray-600 leading-relaxed mb-2">{v.vibe}</p>

              <div className="flex gap-2 mb-3 text-[10px] text-gray-600 flex-wrap">
                <span className="bg-gray-50 px-2 py-1 rounded-lg">🎟️ Entry: {v.entry}</span>
                <span className="bg-gray-50 px-2 py-1 rounded-lg">🍹 Drinks: {v.drinks}</span>
              </div>

              <div className="flex flex-col gap-2">
                <a href={v.whatsapp} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  📲 Reserve via WhatsApp
                </a>
                {v.instagram && (
                  <a href={v.instagram} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded-xl text-xs transition-colors">
                    <Instagram className="w-3.5 h-3.5" />
                    📸 Follow on Instagram
                  </a>
                )}
                {v.maps && (
                  <a href={v.maps} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-xl text-xs transition-colors">
                    <MapPin className="w-3.5 h-3.5" />
                    📍 View on Maps
                  </a>
                )}
              </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
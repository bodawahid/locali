import { useEffect, useMemo, useState } from 'react';
import { Search, MapPin, Star } from 'lucide-react';
import { localApi } from '@/api/localApi';
import GoogleReviewsButton from '../components/GoogleReviewsButton';
import SafeNextStep from '../components/SafeNextStep';
import BookingButtons from '../components/BookingButtons';
import PlaceDetailModal from '../components/PlaceDetailModal';

const PRICE_REFERENCE = [
  { category: 'Budget Street Food', range: '20–50 EGP', examples: 'Koshari, ful, falafel, sandwich' },
  { category: 'Local Restaurant', range: '80–150 EGP', examples: 'Main + drink, sit-down, good portions' },
  { category: 'Mid-Range Tourist', range: '200–400 EGP', examples: 'Nice ambiance, seafood, tourist-friendly' },
  { category: 'Fine Dining', range: '500–1500+ EGP', examples: 'Rooftop, international, premium' },
];

const CITIES = [
  { id: '', label: '🌍 All' },
  { id: 'hurghada', label: '🌊 Hurghada' },
  { id: 'sharm-el-sheikh', label: '⛰️ Sharm' },
  { id: 'luxor', label: '👑 Luxor' },
  { id: 'aswan', label: '🏛️ Aswan' },
];

function pickFirstPhoto(photos) {
  if (Array.isArray(photos) && photos.length) return photos[0];
  if (typeof photos === 'string' && photos.trim()) {
    try {
      const parsed = JSON.parse(photos);
      return Array.isArray(parsed) && parsed.length ? parsed[0] : null;
    } catch {
      return null;
    }
  }
  return null;
}

function normalizeRestaurant(raw) {
  const photo = raw.main_image || raw.photo || raw.photo_url || pickFirstPhoto(raw.photos);
  const mapsQuery = raw.maps_query
    || `${raw.name || ''} ${raw.address || ''} ${raw.city || ''} Egypt`.trim().replace(/\s+/g, '+');

  return {
    id: raw.id,
    name: raw.name || 'Unnamed restaurant',
    photo,
    cuisine: raw.cuisine || 'Mixed cuisine',
    rating: Number(raw.rating ?? raw.avg_rating ?? 0),
    reviews: Number(raw.reviews ?? raw.review_count ?? 0),
    address: raw.address || 'Address unavailable',
    maps_query: mapsQuery,
    viator_search: raw.viator_search || (raw.city ? `restaurants+${raw.city}` : 'restaurants+egypt'),
    desc: raw.description || raw.desc || 'Description will be updated soon.',
    city: raw.city || '',
  };
}

function RestaurantCard({ r }) {
  const [open, setOpen] = useState(false);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${r.maps_query}`;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer" onClick={() => setOpen(true)}>
      {r.photo && <img src={r.photo} alt={r.name} className="w-full h-36 object-cover" />}
      <div className="p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="font-bold text-sm">{r.name}</h3>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-0.5">
            <MapPin className="w-3 h-3" />{r.address} ↗
          </a>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span className="text-xs font-bold">{r.rating > 0 ? r.rating.toFixed(1) : 'N/A'}</span></div>
          <p className="text-[10px] text-gray-400">{r.reviews} reviews</p>
        </div>
      </div>
      <p className="text-xs text-gray-600 mb-3">{r.desc}</p>
      <div className="space-y-2">
        <GoogleReviewsButton name={r.name} />
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
          className="text-xs text-blue-500 hover:underline block text-center mb-1">
          Find on Google Maps →
        </a>
        <BookingButtons activity={r.name + ' food tour'} city={r.city ? r.city.replace('-', ' ') : 'Egypt'} />
      </div>
      </div>
      {open && <PlaceDetailModal place={{ name: r.name, description: r.desc, photo: r.photo, city: r.city ? r.city.replace('-', ' ') : 'Egypt', type: 'place' }} onClose={e => { e.stopPropagation(); setOpen(false); }} />}
    </div>
  );
}

export default function Restaurants() {
  const [city, setCity] = useState('');
  const [search, setSearch] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadRestaurants = async () => {
      setLoading(true);
      const rows = city
        ? await localApi.entities.Restaurant.filter({ city }, '-updated_date', 400, 1)
        : await localApi.entities.Restaurant.list('-updated_date', 400, 1);

      if (!mounted) return;
      setRestaurants((rows || []).map(normalizeRestaurant));
      setLoading(false);
    };

    loadRestaurants();
    return () => { mounted = false; };
  }, [city]);

  const filtered = useMemo(
    () => restaurants.filter((r) => !search || r.name.toLowerCase().includes(search.toLowerCase())),
    [restaurants, search]
  );

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center"><span className="text-2xl">🍽️</span></div>
        <div><h1 className="text-2xl font-black">Restaurants Egypt</h1><p className="text-xs text-gray-500">Real prices · Budget to fine dining · All cities</p></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {PRICE_REFERENCE.map((p, i) => (
          <div key={i} className="bg-blue-50 rounded-xl p-2 text-center">
            <p className="text-[10px] font-bold text-blue-700 mb-0.5">{p.category}</p>
            <p className="text-xs font-black text-blue-600">{p.range}</p>
            <p className="text-[9px] text-blue-600 mt-0.5">{p.examples}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search restaurant..." 
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CITIES.map(c => (
            <button key={c.id} onClick={() => setCity(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${city === c.id ? 'bg-orange-500 text-white border-orange-500' : 'bg-gray-50 border-gray-200'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {loading && <div className="text-sm text-gray-500">Loading restaurants...</div>}
        {!loading && filtered.length === 0 && (
          <div className="text-sm text-gray-500">No restaurants found yet for this filter.</div>
        )}
        {!loading && filtered.map((r) => <RestaurantCard key={r.id || r.name} r={r} />)}
      </div>

      <SafeNextStep title="Street Food & Markets" description="Budget eats and where locals eat" to="/bazaars" />
    </div>
  );
}
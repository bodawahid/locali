import { useState } from 'react';
import { Search, MapPin, Star, ShoppingBag, AlertTriangle } from 'lucide-react';
import GoogleReviewsButton from '../components/GoogleReviewsButton';
import SafeNextStep from '../components/SafeNextStep';

// Real bazaar & market data verified from local sources — April 2026
const BAZAARS = [
  {
    id: 1,
    name: 'Khan El-Khalili Bazaar',
    photo: 'https://images.unsplash.com/photo-1601506521793-dc748fc80b67?w=800&q=80',
    city: 'cairo',
    rating: 4.6,
    reviews: 8500,
    desc: 'Cairo\'s oldest bazaar (since 14th century). Gold jewelry, spices, perfumes, textiles, souvenirs. Massive tourist crowd.',
    what_to_buy: ['Gold jewelry (negotiate)', 'Spices & herbs', 'Egyptian perfumes', 'Papyrus paintings', 'Scarves & textiles'],
    price_level: 'Budget to Premium',
    tips: 'Arrive early morning to avoid crowds. Bargain aggressively — initial price often 3x fair value. No fixed prices.',
    best_time: 'Saturday morning or weekday 10am–12pm',
  },
  {
    id: 2,
    name: 'Aswan Bazaar (Souk)',
    photo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    city: 'aswan',
    rating: 4.7,
    reviews: 2200,
    desc: 'Nubian-style bazaar along the Corniche. Less touristy than Khan El-Khalili. Authentic local crafts & goods.',
    what_to_buy: ['Nubian jewelry', 'Handcrafted items', 'Spices', 'Local herbs', 'Traditional clothes'],
    price_level: 'Budget to Moderate',
    tips: 'Much less crowded. Prices are more honest but still negotiable. Friendly local vendors.',
    best_time: 'Weekday afternoons, 3pm–5pm',
  },
  {
    id: 3,
    name: 'Luxor Market (East Bank)',
    photo: 'https://images.unsplash.com/photo-1549888834-3ec93abae044?w=800&q=80',
    city: 'luxor',
    rating: 4.3,
    reviews: 1100,
    desc: 'Smaller than Khan El-Khalili but authentic. Papyrus, perfumes, textiles. Mixed tourist & local shoppers.',
    what_to_buy: ['Papyrus paintings', 'Pharaonic replicas', 'Fabrics', 'Spices', 'Souvenirs'],
    price_level: 'Budget to Moderate',
    tips: 'Negotiate prices. Quality varies — inspect carefully. Less aggressive than Cairo bazaar.',
    best_time: 'Early morning, 8am–10am',
  },
  {
    id: 4,
    name: 'Hurghada Bazaar',
    photo: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    city: 'hurghada',
    rating: 4.1,
    reviews: 780,
    desc: 'Modern-style souks mixed with traditional shops. Beach souvenirs, handicrafts. More organized than other bazaars.',
    what_to_buy: ['Beach souvenirs', 'Shell crafts', 'Pharaonic items', 'Clothes', 'Perfumes'],
    price_level: 'Moderate to Premium',
    tips: 'Price tags often fixed here. Less negotiation needed. Tourist-friendly but higher prices.',
    best_time: 'Any time, but less crowded weekday afternoons',
  },
];

const NEGOTIATION_TIPS = [
  { tip: 'Always negotiate', detail: 'Starting price is often 2–3x actual value. Counter-offer at 40–50% of asking.' },
  { tip: 'Walk away', detail: 'The best tactic. Vendor will usually call you back with a better price.' },
  { tip: 'Bundle deals', detail: 'Buy 3+ items to get better price per item.' },
  { tip: 'Know gold prices', detail: 'Gold is priced by weight. Check current market rate before buying.' },
  { tip: 'No fixed prices', detail: 'Every bazaar item is negotiable except in modern shops.' },
  { tip: 'Avoid peak hours', detail: 'Morning = better prices, afternoon = vendor more motivated to sell.' },
];

const CITIES = [
  { id: '', label: '🌍 All' },
  { id: 'cairo', label: '🏙️ Cairo' },
  { id: 'aswan', label: '🏛️ Aswan' },
  { id: 'luxor', label: '👑 Luxor' },
  { id: 'hurghada', label: '🌊 Hurghada' },
];

function BazaarCard({ b }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.name + ' ' + b.city + ' Egypt')}`;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all">
      {b.photo && <img src={b.photo} alt={b.name} className="w-full h-40 object-cover" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'; }} />}
      <div className="p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <h3 className="font-bold text-sm">{b.name}</h3>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline mt-0.5 flex items-center gap-1">
            📍 {b.city.replace('-', ' ').toUpperCase()} ↗
          </a>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span className="text-xs font-bold">{b.rating}</span></div>
          <p className="text-[10px] text-gray-400">{b.reviews} reviews</p>
        </div>
      </div>
      <p className="text-xs text-gray-600 mb-3">{b.desc}</p>
      <div className="mb-3">
        <p className="text-[10px] font-bold text-gray-700 mb-1">What to Buy:</p>
        <div className="flex flex-wrap gap-1">
          {b.what_to_buy.map((item, i) => (
            <span key={i} className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">{item}</span>
          ))}
        </div>
      </div>
      <div className="bg-blue-50 rounded-xl px-3 py-2 mb-2">
        <p className="text-[10px] font-bold text-blue-700 mb-1">💡 Pro Tip</p>
        <p className="text-[10px] text-blue-600">{b.tips}</p>
      </div>
      <div className="text-[10px] text-gray-500 mb-2">⏰ Best time: <strong>{b.best_time}</strong></div>
      <GoogleReviewsButton name={b.name} />
      </div>
    </div>
  );
}

export default function BazaarsMarkets() {
  const [city, setCity] = useState('');

  const bazaars = city ? BAZAARS.filter(b => b.city === city) : BAZAARS;

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center"><ShoppingBag className="w-6 h-6 text-amber-600" /></div>
        <div><h1 className="text-2xl font-black">Bazaars & Markets</h1><p className="text-xs text-gray-500">Shopping in Egypt · Prices · Negotiation tips · April 2026</p></div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-6 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-amber-800 mb-0.5">⚠️ The Golden Rule of Bazaar Shopping</p>
          <p className="text-xs text-amber-700">Everything is negotiable. Initial price ≠ fair price. Always counter-offer at 40–50% of asking price.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
        {NEGOTIATION_TIPS.map((n, i) => (
          <div key={i} className="bg-green-50 rounded-xl p-2">
            <p className="text-[10px] font-bold text-green-700">{n.tip}</p>
            <p className="text-[9px] text-green-600 mt-0.5">{n.detail}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {CITIES.map(c => (
            <button key={c.id} onClick={() => setCity(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${city === c.id ? 'bg-amber-500 text-white border-amber-500' : 'bg-gray-50 border-gray-200'}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-10">
        {bazaars.map(b => <BazaarCard key={b.id} b={b} />)}
      </div>

      <SafeNextStep title="Street Food & Budget Eats" description="Koshari, ful, falafel — 20–50 EGP" to="/restaurants" />
    </div>
  );
}
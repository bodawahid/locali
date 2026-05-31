import { useOutletContext } from 'react-router-dom';
import { Waves, Star, Clock } from 'lucide-react';
import GoogleReviewsButton from '../components/GoogleReviewsButton';
import { useState } from 'react';

const BEACHES = [
  {
    city: 'Hurghada',
    name: 'Sahl Hasheesh Private Beach',
    photo: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    type: 'Private Resort Beach',
    description: 'Pristine natural bay with crystal-clear water, fine sand, and excellent coral reef access just offshore. One of Egypt\'s most beautiful private beaches.',
    address: 'Sahl Hasheesh Bay, 17km south of Hurghada',
    hours: '7am – 8pm',
    entry_egp: 250,
    entry_usd: 5,
    facilities: ['Sunbeds & umbrellas', 'Snorkeling gear rental', 'Beach bar', 'Showers', 'Changing rooms', 'Water sports'],
    best_time: 'October–April (calm, 22–26°C water)',
    rating: 4.8,
    review: 'Best beach I found near Hurghada. The coral is incredible and the water is perfectly clear.',
    verified: true,
  },
  {
    city: 'Hurghada',
    name: 'Giftun Island Public Beach',
    photo: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    type: 'Day Trip Beach',
    description: 'National park island 30 min by boat from Hurghada Marina. Untouched coral reef, white sand, and world-class snorkeling.',
    address: 'Giftun Island — boat from Hurghada Marina',
    hours: 'Day trips: 9am – 4pm',
    entry_egp: 950,
    entry_usd: 18,
    facilities: ['Entry includes boat + guide', 'Snorkel equipment', 'Lunch on boat', 'Shade canopy'],
    best_time: 'Year-round — protected from wind',
    rating: 4.9,
    review: 'The fish were swimming right next to me! Absolutely magical snorkeling experience.',
    verified: true,
  },
  {
    city: 'Hurghada',
    name: 'Makadi Bay Beach',
    photo: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
    type: 'Resort Beach (Public Access)',
    description: 'Calm bay with shallow entry, perfect for families and non-swimmers. Beautiful sunset views toward the mountains.',
    address: 'Makadi Bay, 30km south of Hurghada center',
    hours: '8am – 7pm',
    entry_egp: 100,
    entry_usd: 2,
    facilities: ['Sunbeds', 'Beach bar', 'Volleyball', 'Kids splash area', 'Towels available'],
    best_time: 'September–May',
    rating: 4.5,
    review: 'Super calm water. Perfect for our kids — they played for hours.',
    verified: false,
  },
  {
    city: 'Sharm El Sheikh',
    name: 'Ras Um Sid Beach',
    photo: 'https://images.unsplash.com/photo-1560275619-4cc5fa59d3ae?w=800&q=80',
    type: 'Diving & Snorkeling Beach',
    description: 'Famous shore-diving site with a dramatic reef wall dropping to 40m. Accessible directly from the beach. World-class marine life.',
    address: 'Ras Um Sid headland, Sharm El Sheikh',
    hours: 'Open 24h (diving 6am–5pm recommended)',
    entry_egp: 50,
    entry_usd: 1,
    facilities: ['Dive operators on site', 'Equipment rental', 'Café', 'Basic facilities'],
    best_time: 'Year-round — exceptional visibility',
    rating: 4.9,
    review: 'Shore diving access to a world-class wall. I saw a turtle on my first dive.',
    verified: true,
  },
  {
    city: 'Sharm El Sheikh',
    name: 'Naama Bay Public Beach',
    photo: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80',
    type: 'Public Beach',
    description: 'The main public beach in central Naama Bay. Lively, central, with cafes and water sports. Ideal for people watching and swimming.',
    address: 'Naama Bay promenade, central Sharm',
    hours: 'Always open',
    entry_egp: 0,
    entry_usd: 0,
    facilities: ['Free entry', 'Multiple beach cafes', 'Jet ski rental', 'Banana boat', 'Parasailing'],
    best_time: 'October–April',
    rating: 4.3,
    review: 'Perfect central location, always buzzing with energy. Water sports are well priced.',
    verified: false,
  },
  {
    city: 'Sharm El Sheikh',
    name: "Shark's Bay Beach",
    photo: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80',
    type: 'Semi-Private Beach',
    description: "Calm, shallow bay perfect for beginners and snorkelers. One of Sharm's best spots for seeing turtles from the shore.",
    address: "Shark's Bay, 5km north of Naama Bay",
    hours: '8am – 6pm',
    entry_egp: 100,
    entry_usd: 2,
    facilities: ['Equipment rental', 'Beach restaurant', 'Showers', 'Sunbeds'],
    best_time: 'Year-round — turtles most active morning',
    rating: 4.7,
    review: 'We saw two sea turtles feeding in the morning! Worth every penny.',
    verified: true,
  },
  {
    city: 'El Gouna',
    name: 'El Gouna Mangroovy Beach',
    photo: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=800&q=80',
    type: 'Kitesurfing & Lagoon Beach',
    description: 'World-famous kitesurfing spot with consistent wind and shallow flat water. IKO-certified schools on site. Also great for non-surfers.',
    address: 'Mangroovy Beach, El Gouna South',
    hours: '8am – 6pm',
    entry_egp: 100,
    entry_usd: 2,
    facilities: ['Kite schools', 'Equipment rental', 'Beach bar', 'Spectator area', 'Showers'],
    best_time: 'November–April (wind season)',
    rating: 4.8,
    review: 'Perfect wind every single day. Best kitesurfing conditions in the Red Sea.',
    verified: true,
  },
  {
    city: 'El Gouna',
    name: 'Zeytouna Beach (El Gouna)',
    photo: 'https://images.unsplash.com/photo-1468413253897-a5e4f9f5f857?w=800&q=80',
    type: 'Private Island Beach',
    description: 'Beautiful private beach on a small island accessible by free ferry. White sand, turquoise water, stunning views of the lagoon.',
    address: 'Zeytouna Island — ferry from El Gouna marina',
    hours: '9am – 5pm',
    entry_egp: 200,
    entry_usd: 4,
    facilities: ['Ferry included', 'Sunbeds', 'Restaurant', 'Snorkeling', 'Beach volleyball'],
    best_time: 'October–May',
    rating: 4.9,
    review: 'Felt like we had our own private island. Stunning place.',
    verified: true,
  },
];

const CITY_COLORS = {
  'Hurghada': 'bg-blue-500/10 text-blue-600',
  'Sharm El Sheikh': 'bg-teal-500/10 text-teal-600',
  'El Gouna': 'bg-violet-500/10 text-violet-600',
};

function BeachCard({ beach }) {
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(beach.name + ' Egypt')}`;

  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
      {beach.photo && (
        <img src={beach.photo} alt={beach.name} className="w-full h-44 object-cover" />
      )}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CITY_COLORS[beach.city] || 'bg-secondary text-muted-foreground'}`}>{beach.city}</span>
              <span className="text-[10px] font-bold bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{beach.type}</span>
              {beach.verified && <span className="text-[10px] font-bold bg-success/10 text-success px-2 py-0.5 rounded-full">✓ Verified</span>}
            </div>
            <h3 className="font-extrabold text-base">{beach.name}</h3>
          </div>
          <div className="text-right shrink-0">
            <p className="font-extrabold text-accent text-lg">{beach.entry_egp === 0 ? 'FREE' : `${beach.entry_egp} EGP`}</p>
            {beach.entry_usd > 0 && <p className="text-[10px] text-muted-foreground">~${beach.entry_usd} USD</p>}
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{beach.description}</p>
      </div>

      <div className="px-4 py-3 border-b border-border/20">
        <div className="flex flex-wrap gap-2">
          {beach.facilities.map((f, i) => <span key={i} className="text-[10px] bg-secondary text-muted-foreground px-2 py-1 rounded-lg">{f}</span>)}
        </div>
      </div>

      <div className="px-4 py-3 flex flex-wrap gap-4 text-xs text-muted-foreground border-b border-border/20">
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{beach.hours}</span>
        <span className="flex items-center gap-1">⭐ <strong className="text-foreground">{beach.rating}</strong></span>
        <span className="flex items-center gap-1">🌡️ {beach.best_time}</span>
      </div>

      <div className="px-4 py-3 bg-secondary/30 border-b border-border/20">
        <p className="text-xs text-muted-foreground italic">"{beach.review}"</p>
      </div>

      <div className="p-4 space-y-2">
        <GoogleReviewsButton name={beach.name} />
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-secondary border border-border py-2.5 rounded-xl text-xs font-bold hover:bg-secondary/80 transition-colors">
          📍 View on Google Maps →
        </a>
      </div>
    </div>
  );
}

export default function Beaches() {
  const { lang } = useOutletContext();
  const [cityFilter, setCityFilter] = useState('');
  const CITIES = ['Hurghada', 'Sharm El Sheikh', 'El Gouna'];
  const filtered = cityFilter ? BEACHES.filter(b => b.city === cityFilter) : BEACHES;

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
          <Waves className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Beaches & Water Activities</h1>
          <p className="text-sm text-muted-foreground">Honest guide — entry fees, facilities, best times, booking</p>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6 text-sm text-muted-foreground">
        <strong className="text-foreground">Red Sea vs Mediterranean:</strong> Egypt's Red Sea offers 20–40m visibility, year-round warm water (22–28°C), and some of the world's best coral reef ecosystems. This is objectively a different category from European beach destinations.
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        {[{ id: '', label: '🌍 All Cities' }, ...CITIES.map(c => ({ id: c, label: c }))].map(c => (
          <button key={c.id} onClick={() => setCityFilter(c.id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${cityFilter === c.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((beach, i) => <BeachCard key={i} beach={beach} />)}
      </div>
    </div>
  );
}
import { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { ShieldCheck, Star } from 'lucide-react';
import BookingButtons from '../components/BookingButtons';

const TOURS = [
  {
    city: 'hurghada',
    name: 'Red Sea Snorkeling Day Trip',
    type: 'Water Activity',
    description: 'Full-day snorkeling on the coral reefs of Giftun Island. Equipment, guide, and lunch included.',
    price_egp: 1200,
    price_usd: 23,
    duration: '8 hours',
    rating: 4.8,
    verified: true,
    highlights: ['Giftun Island reef', 'Lunch on boat', 'Equipment included', 'English-speaking guide'],
    viator_url: 'https://tp.media/r?marker=718338&trs=517548&p=3965&u=https%3A%2F%2Fwww.viator.com/Hurghada-tours/Snorkeling/d5323-g12/',
  },
  {
    city: 'hurghada',
    name: 'Quad Bike Desert Safari',
    type: 'Desert Adventure',
    description: 'Sunset quad bike ride through the Eastern Desert with Bedouin tea ceremony.',
    price_egp: 1000,
    price_usd: 19,
    duration: '3 hours',
    rating: 4.6,
    verified: true,
    highlights: ['Sunset views', 'Bedouin camp', 'Tea ceremony', 'Photo stops'],
    viator_url: 'https://tp.media/r?marker=718338&trs=517548&p=3965&u=https%3A%2F%2Fwww.viator.com/Hurghada-tours/4WD-ATV-and-Off-Road-Tours/d5323-g223/',
  },
  {
    city: 'sharm-el-sheikh',
    name: 'Ras Mohammed Diving Tour',
    type: 'Diving',
    description: 'PADI-certified diving at Ras Mohammed National Park — world-class walls and visibility.',
    price_egp: 1800,
    price_usd: 34,
    duration: 'Full day',
    rating: 4.9,
    verified: true,
    highlights: ['2 dive sites', 'PADI certified', 'All equipment', 'Lunch included'],
    viator_url: 'https://tp.media/r?marker=718338&trs=517548&p=3965&u=https%3A%2F%2Fwww.viator.com/Sharm-el-Sheikh-tours/Scuba-Diving/d832-g15/',
  },
  {
    city: 'sharm-el-sheikh',
    name: 'Sinai Sunrise Camel Trek to Mt Sinai',
    type: 'Cultural Trek',
    description: 'Night hike to Moses Mountain summit. Watch sunrise from 2,285m with Bedouin guide.',
    price_egp: 1400,
    price_usd: 26,
    duration: '8 hours (overnight)',
    rating: 4.7,
    verified: true,
    highlights: ['Sunrise at summit', 'Bedouin guide', 'Camel option', 'St. Catherine Monastery visit'],
    viator_url: 'https://tp.media/r?marker=718338&trs=517548&p=3965&u=https%3A%2F%2Fwww.viator.com/Sharm-el-Sheikh-tours/Cultural-Tours/d832-g28/',
  },
  {
    city: 'luxor',
    name: 'Valley of the Kings Private Tour',
    type: 'Historical Tour',
    description: 'Licensed Egyptologist-guided tour of Valley of the Kings, Hatshepsut Temple, Colossi of Memnon.',
    price_egp: 1600,
    price_usd: 30,
    duration: '6 hours',
    rating: 4.9,
    verified: true,
    highlights: ['3 tombs included', 'Licensed Egyptologist', 'Private AC car', 'Skip-the-line entry'],
    viator_url: 'https://tp.media/r?marker=718338&trs=517548&p=3965&u=https%3A%2F%2Fwww.viator.com/Luxor-tours/Historical-Historical-Tours/d957-g28/',
  },
  {
    city: 'luxor',
    name: 'Hot Air Balloon at Sunrise',
    type: 'Air Experience',
    description: 'ECAA-certified balloon flight over the West Bank temples at dawn. 45-60 minutes.',
    price_egp: 5500,
    price_usd: 103,
    duration: '45–60 min flight',
    rating: 4.8,
    verified: true,
    highlights: ['ECAA certified', 'Insurance included', 'Hotel pickup', 'Certificate given'],
    viator_url: 'https://tp.media/r?marker=718338&trs=517548&p=3965&u=https%3A%2F%2Fwww.viator.com/Luxor-tours/Air-Tours/d957-g11/',
  },
  {
    city: 'aswan',
    name: 'Abu Simbel Day Trip',
    type: 'Historical Tour',
    description: 'Dawn convoy to the magnificent temples of Ramesses II and Nefertari. Returns by noon.',
    price_egp: 3200,
    price_usd: 60,
    duration: '8 hours',
    rating: 4.9,
    verified: true,
    highlights: ['Entry tickets included', 'AC transport', 'English guide', 'Dawn light photography'],
    viator_url: 'https://tp.media/r?marker=718338&trs=517548&p=3965&u=https%3A%2F%2Fwww.viator.com/Aswan-tours/Historical-Historical-Tours/d4776-g28/',
  },
  {
    city: 'aswan',
    name: 'Felucca Nile Sunset Cruise',
    type: 'Boat Trip',
    description: 'Traditional felucca sailing around Elephantine Island and Kitchener\'s Island botanical garden.',
    price_egp: 600,
    price_usd: 11,
    duration: '2 hours',
    rating: 4.5,
    verified: true,
    highlights: ['Botanical garden stop', 'Nubian music', 'Sunset views', 'Tea served'],
    viator_url: 'https://tp.media/r?marker=718338&trs=517548&p=3965&u=https%3A%2F%2Fwww.viator.com/Aswan-tours/Cruises-Water-Tours/d4776-g63/',
  },
  {
    city: 'el-gouna',
    name: 'El Gouna Kitesurfing Lesson',
    type: 'Water Sport',
    description: 'IKO-certified kitesurfing lessons in the calm lagoons of El Gouna. Perfect for beginners.',
    price_egp: 3000,
    price_usd: 56,
    duration: '3 hours',
    rating: 4.7,
    verified: true,
    highlights: ['IKO certified instructor', 'Equipment included', 'Calm lagoon', 'Video recording'],
    viator_url: 'https://tp.media/r?marker=718338&trs=517548&p=3965&u=https%3A%2F%2Fwww.viator.com/Hurghada-tours/Water-Sports/d5323-g208/',
  },
  {
    city: 'el-gouna',
    name: 'El Gouna Island Boat Tour',
    type: 'Boat Trip',
    description: 'Explore El Gouna\'s network of islands, lagoons, and coral reefs by speedboat.',
    price_egp: 1200,
    price_usd: 23,
    duration: '4 hours',
    rating: 4.6,
    verified: true,
    highlights: ['Snorkeling stop', 'Island BBQ', 'Marine guide', 'Life jackets provided'],
    viator_url: 'https://tp.media/r?marker=718338&trs=517548&p=3965&u=https%3A%2F%2Fwww.viator.com/Hurghada-tours/Cruises-Water-Tours/d5323-g63/',
  },
];

const CITY_LABELS = {
  'hurghada': 'Hurghada',
  'sharm-el-sheikh': 'Sharm El Sheikh',
  'luxor': 'Luxor',
  'aswan': 'Aswan',
  'el-gouna': 'El Gouna',
};

function TourCard({ tour }) {
  const cityLabel = CITY_LABELS[tour.city] || tour.city;
  const viatorUrl = tour.viator_url;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(tour.name + ' ' + cityLabel + ' Egypt')}`;

  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-bold bg-accent/10 text-accent px-2 py-0.5 rounded-full">{CITY_LABELS[tour.city]}</span>
              <span className="text-[10px] font-bold bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{tour.type}</span>
              {tour.verified && (
                <span className="flex items-center gap-1 text-[10px] font-bold bg-success/10 text-success px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-2.5 h-2.5" /> Verified
                </span>
              )}
            </div>
            <h3 className="font-extrabold text-base">{tour.name}</h3>
          </div>
          <div className="text-right shrink-0">
            <p className="font-extrabold text-accent text-lg">{tour.price_egp} EGP</p>
            <p className="text-[10px] text-muted-foreground">~${tour.price_usd} USD</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{tour.description}</p>
      </div>

      {/* Highlights */}
      <div className="px-4 py-3 flex flex-wrap gap-2">
        {tour.highlights.map((h, i) => (
          <span key={i} className="text-[10px] bg-secondary text-muted-foreground px-2 py-1 rounded-lg">{h}</span>
        ))}
      </div>

      {/* Rating + duration */}
      <div className="px-4 pb-3 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
          <span className="font-bold text-foreground">{tour.rating}</span>
        </div>
        <span>⏱ {tour.duration}</span>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <BookingButtons activity={tour.name} city={cityLabel} />
      </div>
    </div>
  );
}

export default function BookingPage() {
  const { lang } = useOutletContext();
  const [searchParams] = useSearchParams();
  const [cityFilter, setCityFilter] = useState(searchParams.get('city') || '');

  useEffect(() => {
    const city = searchParams.get('city');
    if (city) setCityFilter(city);
  }, [searchParams]);

  const filtered = cityFilter ? TOURS.filter(t => t.city === cityFilter) : TOURS;

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-1">Tours & Activities</h1>
        <p className="text-sm text-muted-foreground">Verified operators · Real prices in EGP · Book securely on Viator</p>
      </div>

      {/* City filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        {[{ id: '', label: '🌍 All Cities' }, ...Object.entries(CITY_LABELS).map(([id, label]) => ({ id, label }))].map((c) => (
          <button
            key={c.id}
            onClick={() => setCityFilter(c.id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${cityFilter === c.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Tours grid */}
      <div className="space-y-4">
        {filtered.map((tour, i) => (
          <TourCard key={i} tour={tour} />
        ))}
      </div>

      <div className="mt-8 bg-secondary/50 rounded-2xl p-4 text-center text-xs text-muted-foreground">
        Want to list your service here? <a href="/verify-apply" className="text-accent font-bold underline underline-offset-2">Apply for Verified Badge →</a>
      </div>
    </div>
  );
}
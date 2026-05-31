import { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import EditableImage from '../components/EditableImage';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Anchor, Clock, Users, Plus, X, ChevronDown, ChevronUp, Navigation, DollarSign } from 'lucide-react';

// ─── Experience Types (informational, no external booking links) ──────────────
const EXPERIENCE_CATALOG = [
  // ── Hurghada ──
  {
    id: 'hgd-glass',
    city: 'hurghada',
    cityLabel: 'Hurghada',
    name: 'Glass Bottom Boat',
    emoji: '🔭',
    tier: 'Budget',
    tierColor: 'bg-green-100 text-green-700 border-green-200',
    description: 'Observe colorful coral reefs and tropical fish through a large glass panel beneath the boat — no swimming required. Perfect for families and non-swimmers.',
    duration: '1 – 2 hours',
    priceRange: '$10 – $20 USD per person',
    priceEGP: '300 – 620 EGP',
    audience: 'Families, children, budget travelers',
    departure: 'Hurghada Marina or Sigala Beach area',
    highlights: ['No swimming needed', 'Safe for all ages', 'Clear reef views', 'Short trip'],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=85',
  },
  {
    id: 'hgd-semi',
    city: 'hurghada',
    cityLabel: 'Hurghada',
    name: 'Semi Submarine',
    emoji: '🤿',
    tier: 'Mid',
    tierColor: 'bg-blue-100 text-blue-700 border-blue-200',
    description: 'A boat with an underwater observation cabin. Passengers descend below the waterline through a staircase to view marine life through panoramic glass windows — much closer than a glass-bottom boat.',
    duration: '1.5 – 2.5 hours',
    priceRange: '$25 – $40 USD per person',
    priceEGP: '780 – 1,250 EGP',
    audience: 'Mid-range travelers, couples, teens',
    departure: 'Hurghada Marina',
    highlights: ['Underwater cabin', 'Panoramic windows', 'No diving needed', 'Better visibility than glass-bottom'],
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=85',
  },
  {
    id: 'hgd-sub',
    city: 'hurghada',
    cityLabel: 'Hurghada',
    name: 'Sindbad Submarine',
    emoji: '🚢',
    tier: 'Premium',
    tierColor: 'bg-purple-100 text-purple-700 border-purple-200',
    description: 'A real submarine experience descending up to 22 meters underwater. The Sindbad Submarine is the only certified tourist submarine in Egypt, offering a genuine deep-sea viewing experience with professional crew.',
    duration: 'Approx. 2 hours (includes transfer)',
    priceRange: '$40 – $60 USD per person',
    priceEGP: '1,250 – 1,900 EGP',
    audience: 'All ages, premium experience seekers',
    departure: 'Sindbad Beach Resort, Hurghada',
    highlights: ['Real submarine — goes 22m underwater', 'Only submarine in Egypt', 'Air-conditioned interior', 'Professional crew'],
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=85',
  },
  {
    id: 'hgd-cat',
    city: 'hurghada',
    cityLabel: 'Hurghada',
    name: 'Catamaran Day Cruise',
    emoji: '⛵',
    tier: 'Mid',
    tierColor: 'bg-blue-100 text-blue-700 border-blue-200',
    description: 'Full-day catamaran cruise to Orange Bay and Giftun Island. Includes snorkeling stops, sunbathing on deck, buffet lunch, and soft drinks.',
    duration: '7 – 8 hours',
    priceRange: '$35 – $55 USD per person',
    priceEGP: '1,100 – 1,700 EGP',
    audience: 'Groups, families, active travelers',
    departure: 'Hurghada Marina',
    highlights: ['Orange Bay snorkeling', 'Giftun Island stop', 'Buffet lunch included', 'Soft drinks included'],
    image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=85',
  },

  // ── Sharm El Sheikh ──
  {
    id: 'shm-glass',
    city: 'sharm-el-sheikh',
    cityLabel: 'Sharm El Sheikh',
    name: 'Glass Bottom Boat',
    emoji: '🔭',
    tier: 'Budget',
    tierColor: 'bg-green-100 text-green-700 border-green-200',
    description: 'Explore Sharm\'s famous coral reefs from the comfort of a glass-bottom boat. See parrotfish, clownfish, and coral gardens without getting wet.',
    duration: '1 – 2 hours',
    priceRange: '$10 – $20 USD per person',
    priceEGP: '300 – 620 EGP',
    audience: 'Families, children, budget travelers',
    departure: 'Naama Bay Beach or Old Market Marina',
    highlights: ['No swimming needed', 'Naama Bay coral reefs', 'Safe for all ages', 'Budget-friendly'],
    image: 'https://images.unsplash.com/photo-1607153333879-c174d265f1d2?w=800&q=85',
  },
  {
    id: 'shm-semi',
    city: 'sharm-el-sheikh',
    cityLabel: 'Sharm El Sheikh',
    name: 'Semi Submarine',
    emoji: '🤿',
    tier: 'Mid',
    tierColor: 'bg-blue-100 text-blue-700 border-blue-200',
    description: 'Experience Sharm\'s legendary marine life through the underwater cabin of a semi-submarine. The Strait of Tiran and Naama Bay reefs are among the most vibrant in the Red Sea.',
    duration: '1.5 – 2.5 hours',
    priceRange: '$25 – $40 USD per person',
    priceEGP: '780 – 1,250 EGP',
    audience: 'Mid-range travelers, couples, teens',
    departure: 'Naama Bay Marina',
    highlights: ['World-class coral views', 'No diving license needed', 'Panoramic underwater windows', 'Air-conditioned cabin'],
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=85',
  },
  {
    id: 'shm-cat',
    city: 'sharm-el-sheikh',
    cityLabel: 'Sharm El Sheikh',
    name: 'Ras Mohamed Catamaran',
    emoji: '⛵',
    tier: 'Mid',
    tierColor: 'bg-blue-100 text-blue-700 border-blue-200',
    description: 'Full-day catamaran to Ras Mohamed National Park — one of the world\'s top dive sites. Snorkel at Shark Reef and Yolanda Reef. Lunch and drinks included.',
    duration: '6 – 7 hours',
    priceRange: '$40 – $60 USD per person',
    priceEGP: '1,250 – 1,900 EGP',
    audience: 'Active travelers, snorkelers, nature lovers',
    departure: 'Naama Bay or Sharm Marina',
    highlights: ['Ras Mohamed National Park', 'Shark Reef snorkeling', 'Yolanda Reef stop', 'Lunch & drinks included'],
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=85',
  },
];

const TIERS = ['All', 'Budget', 'Mid', 'Premium'];
const CITIES = [
  { id: '', label: '🌍 All Cities' },
  { id: 'hurghada', label: '🌊 Hurghada' },
  { id: 'sharm-el-sheikh', label: '🤿 Sharm El Sheikh' },
];

const TIER_ICONS = { Budget: '💚', Mid: '💙', Premium: '💜' };

function ExperienceCard({ exp }) {
  const [expanded, setExpanded] = useState(false);

  const mapsQuery = encodeURIComponent(`${exp.name} boat ${exp.cityLabel} Egypt`);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <EditableImage
          src={exp.image}
          alt={exp.name}
          className="w-full h-full object-cover"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* City badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 text-gray-800 text-[10px] font-black px-2 py-1 rounded-full">
            📍 {exp.cityLabel}
          </span>
        </div>

        {/* Tier badge */}
        <div className="absolute top-3 right-3">
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${exp.tierColor}`}>
            {TIER_ICONS[exp.tier]} {exp.tier}
          </span>
        </div>

        {/* Name on image */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-white font-black text-lg leading-tight drop-shadow-sm">
            {exp.emoji} {exp.name}
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-sm text-gray-600 leading-relaxed mb-3">{exp.description}</p>

        {/* Key info row */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-gray-50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Duration</p>
            <p className="text-xs font-bold text-gray-800 flex items-center gap-1">
              <Clock className="w-3 h-3 text-teal-500" /> {exp.duration}
            </p>
          </div>
          <div className="bg-green-50 rounded-xl px-3 py-2">
            <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">Fair Price</p>
            <p className="text-xs font-bold text-green-700 flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> {exp.priceRange}
            </p>
          </div>
        </div>

        {/* Price in EGP */}
        <div className="bg-orange-50 border border-orange-100 rounded-xl px-3 py-2 mb-3">
          <p className="text-[10px] text-orange-600 font-bold uppercase mb-0.5">Approx. in EGP</p>
          <p className="text-sm font-black text-orange-700">{exp.priceEGP}</p>
        </div>

        {/* Expandable details */}
        <button
          onClick={() => setExpanded(e => !e)}
          className="w-full flex items-center justify-between text-xs font-bold text-teal-600 mb-2"
        >
          <span>More details</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && (
          <div className="space-y-2 mb-3">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Best For</p>
              <p className="text-xs text-gray-700">{exp.audience}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Departure Point</p>
              <p className="text-xs text-gray-700">{exp.departure}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">Highlights</p>
              <div className="flex flex-wrap gap-1">
                {exp.highlights.map((h, i) => (
                  <span key={i} className="text-[10px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full border border-teal-100">
                    ✓ {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Google Maps CTA only */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-bold transition-colors"
        >
          <Navigation className="w-3.5 h-3.5" /> Find on Google Maps
        </a>
      </div>
    </div>
  );
}

function SubmitForm({ onClose }) {
  const [form, setForm] = useState({
    boat_name: '', city: '', boat_type: '', price: '',
    price_type: 'per_trip', capacity: '', duration_hours: '',
    description: '', whatsapp: '', main_image: '',
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!form.boat_name || !form.city || !form.boat_type || !form.whatsapp) return;
    setLoading(true);
    await base44.entities.BoatTrip.create({
      ...form,
      price: parseFloat(form.price) || 0,
      capacity: parseInt(form.capacity) || 0,
      status: 'pending',
    });
    setLoading(false);
    setDone(true);
  };

  if (done) return (
    <div className="text-center py-8">
      <div className="text-5xl mb-4">✅</div>
      <h3 className="text-xl font-black mb-2">Submitted!</h3>
      <p className="text-sm text-gray-500 mb-4">Your listing is under review. We'll approve it within 24 hours.</p>
      <button onClick={onClose} className="bg-teal-500 text-white px-6 py-2 rounded-xl font-bold">Close</button>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-medium">
        ⚓ Submit your boat listing for review. Once approved it will be visible to tourists.
      </div>
      {[
        { label: 'Boat / Experience Name', key: 'boat_name' },
        { label: 'WhatsApp Number', key: 'whatsapp', placeholder: '201001234567' },
        { label: 'Price (EGP)', key: 'price', type: 'number' },
        { label: 'Capacity (people)', key: 'capacity', type: 'number' },
        { label: 'Duration (hours)', key: 'duration_hours', type: 'number' },
      ].map(f => (
        <div key={f.key}>
          <label className="text-xs font-bold text-gray-600 mb-1 block">{f.label}</label>
          <input type={f.type || 'text'} placeholder={f.placeholder || f.label}
            value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
      ))}
      <div>
        <label className="text-xs font-bold text-gray-600 mb-1 block">City</label>
        <select value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none">
          <option value="">Select city</option>
          <option value="hurghada">Hurghada</option>
          <option value="sharm-el-sheikh">Sharm El Sheikh</option>
          <option value="el-gouna">El Gouna</option>
          <option value="aswan">Aswan</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-bold text-gray-600 mb-1 block">Description</label>
        <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
          placeholder="Describe your boat trip experience..."
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none resize-none" />
      </div>
      <div>
        <label className="text-xs font-bold text-gray-600 mb-1 block">Main Photo (optional)</label>
        <ImageUpload value={form.main_image} onChange={url => setForm(p => ({ ...p, main_image: url || '' }))} label="Upload Boat Photo" />
      </div>
      <button onClick={submit} disabled={loading || !form.boat_name || !form.city || !form.whatsapp}
        className="w-full bg-teal-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-teal-600 transition-all disabled:opacity-50">
        {loading ? 'Submitting...' : 'Submit My Boat'}
      </button>
    </div>
  );
}

export default function BoatTrips() {
  const [cityFilter, setCityFilter] = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);

  // Also load any DB-submitted boats that got approved
  const { data: dbBoats = [] } = useQuery({
    queryKey: ['boattrips'],
    queryFn: () => base44.entities.BoatTrip.filter({ status: 'approved' }),
  });

  const filtered = EXPERIENCE_CATALOG.filter(exp => {
    const matchCity = !cityFilter || exp.city === cityFilter;
    const matchTier = tierFilter === 'All' || exp.tier === tierFilter;
    return matchCity && matchTier;
  });

  const tierCounts = { All: EXPERIENCE_CATALOG.length };
  EXPERIENCE_CATALOG.forEach(e => {
    tierCounts[e.tier] = (tierCounts[e.tier] || 0) + 1;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 px-4 pt-8 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-5xl block mb-3">⛵</span>
          <h1 className="text-3xl font-black text-white mb-2">Boat Experiences</h1>
          <p className="text-teal-100 text-sm mb-2">Red Sea Marine Life · Fair Prices · No Booking Fees</p>
          <p className="text-teal-200 text-xs">Compare experiences · Find fair prices · Contact locally</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-8">
        {/* Price comparison card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 mb-6">
          <h2 className="font-black text-gray-900 text-sm mb-3 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-teal-600" /> Fair Price Guide
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {[
              { tier: 'Budget', icon: '💚', name: 'Glass Bottom', price: '$10–$20' },
              { tier: 'Mid', icon: '💙', name: 'Semi Submarine', price: '$25–$40' },
              { tier: 'Premium', icon: '💜', name: 'Real Submarine', price: '$40–$60' },
            ].map(t => (
              <div key={t.tier} className="text-center bg-gray-50 rounded-xl p-2.5">
                <span className="text-lg block mb-1">{t.icon}</span>
                <p className="text-[10px] font-bold text-gray-500 mb-0.5">{t.name}</p>
                <p className="text-xs font-black text-gray-900">{t.price}</p>
                <p className="text-[9px] text-gray-400">per person</p>
              </div>
            ))}
          </div>
        </div>

        {/* City filter */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 mb-3">
          {CITIES.map(c => (
            <button key={c.id} onClick={() => setCityFilter(c.id)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                cityFilter === c.id ? 'bg-teal-600 text-white border-teal-600' : 'bg-white text-gray-600 border-gray-200'
              }`}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Tier filter */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 mb-5">
          {TIERS.map(t => (
            <button key={t} onClick={() => setTierFilter(t)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                tierFilter === t ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200'
              }`}>
              {t === 'All' ? '✨ All' : `${TIER_ICONS[t]} ${t}`}
              <span className="ml-1 opacity-60">({tierCounts[t] || 0})</span>
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-xs font-bold text-gray-500 mb-4">{filtered.length} experience{filtered.length !== 1 ? 's' : ''} found</p>

        {/* Experience grid */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {filtered.map(exp => <ExperienceCard key={exp.id} exp={exp} />)}
        </div>

        {/* DB-submitted boats */}
        {dbBoats.length > 0 && (
          <div className="mb-8">
            <h2 className="font-black text-gray-900 text-base mb-3 flex items-center gap-2">
              <Anchor className="w-4 h-4 text-teal-600" /> Community Listed Boats
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {dbBoats.map(b => (
                <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <h3 className="font-black text-gray-900 mb-1">{b.boat_name}</h3>
                  <p className="text-xs text-gray-500 mb-2">📍 {b.city} · ⏱ {b.duration_hours}h · 👥 Up to {b.capacity}</p>
                  {b.price > 0 && <p className="text-sm font-bold text-teal-600 mb-2">{b.price.toLocaleString()} EGP</p>}
                  {b.description && <p className="text-xs text-gray-600 mb-3">{b.description}</p>}
                  {b.whatsapp && (
                    <a href={`https://wa.me/${b.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-green-500 text-white py-2.5 rounded-xl text-xs font-bold">
                      WhatsApp Inquiry
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Owner CTA */}
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-6 text-center text-white mb-10">
          <h3 className="font-black text-lg mb-1">Own a Boat or Offer Tours?</h3>
          <p className="text-white/80 text-xs mb-4">List your experience free. Tourists contact you directly.</p>
          <button onClick={() => setShowForm(true)}
            className="bg-white text-teal-600 font-black px-6 py-2.5 rounded-xl text-sm hover:opacity-90">
            List My Boat →
          </button>
        </div>
      </div>

      {/* Submit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 p-1 text-gray-400">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black mb-4 text-gray-900">⛵ List Your Boat</h2>
            <SubmitForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
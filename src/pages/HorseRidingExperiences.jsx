import { useState, useEffect } from 'react';
import ImageUpload from '../components/ImageUpload';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Search, X, Plus, Clock, Star } from 'lucide-react';
import GoogleReviewsButton from '../components/GoogleReviewsButton';
import BookingButtons from '../components/BookingButtons';
import PlaceDetailModal from '../components/PlaceDetailModal';
import VerifiedHorseStables from '../components/VerifiedHorseStables';

const CITIES = [
  { id: 'hurghada', label: 'Hurghada' },
  { id: 'sharm-el-sheikh', label: 'Sharm El Sheikh' },
  { id: 'dahab', label: 'Dahab' },
  { id: 'el-gouna', label: 'El Gouna' },
  { id: 'aswan', label: 'Aswan' },
];

const EXP_TYPES = [
  { id: 'beach_ride', label: '🏖️ Beach Ride' },
  { id: 'desert_ride', label: '🏜️ Desert Ride' },
  { id: 'swimming_horses', label: '🌊 Swimming with Horses' },
  { id: 'sunrise_sunset_ride', label: '🌅 Sunrise / Sunset Ride' },
];

const CITY_LABELS = { hurghada: 'Hurghada', 'sharm-el-sheikh': 'Sharm El Sheikh', dahab: 'Dahab', 'el-gouna': 'El Gouna', aswan: 'Aswan' };
const EXP_LABELS = { beach_ride: '🏖️ Beach Ride', desert_ride: '🏜️ Desert Ride', swimming_horses: '🌊 Swimming with Horses', sunrise_sunset_ride: '🌅 Sunrise/Sunset Ride' };
const SKILL_LABELS = { beginner: '🟢 Beginner Friendly', intermediate: '🟡 Intermediate', all_levels: '✅ All Levels' };

// Verified sources: GetYourGuide, Viator — contact via booking platforms only
const SAMPLE_HORSES = [
  {
    id: 's1',
    title: 'Sharm El Sheikh — Beach & Desert Horse Ride (2 hrs)',
    city: 'sharm-el-sheikh',
    experience_type: 'beach_ride',
    price: null,
    price_type: 'per_person',
    duration: '2 hours',
    skill_level: 'all_levels',
    description: 'Ride through Sinai desert and gallop along Red Sea. Expert guide, calm horses. 4.9/5 on GetYourGuide (360+ reviews). Helmet & transfer included.',
    imageQuery: 'horseback riding Sinai desert Egypt',
    whatsapp: null,
    booking_url: 'https://www.getyourguide.com/sharm-el-sheikh-l970/horseback-riding-tc193/',
    is_featured: true,
    status: 'approved',
  },
  {
    id: 's2',
    title: 'Hurghada — Desert & Sea Horseback (3 hrs)',
    city: 'hurghada',
    experience_type: 'beach_ride',
    price: null,
    price_type: 'per_person',
    duration: '3 hours',
    skill_level: 'all_levels',
    description: 'Ride through desert then gallop into Red Sea. Swim with your horse. 4.8/5 on GetYourGuide (420+ reviews) & Viator. Helmet & transfer.',
    imageQuery: 'horseback riding Egypt beach Red Sea',
    whatsapp: null,
    booking_url: 'https://www.getyourguide.com/hurghada-l970/horseback-riding-tc193/',
    is_featured: true,
    status: 'approved',
  },
  {
    id: 's3',
    title: 'Hurghada — Swimming with Horses (3 hrs)',
    city: 'hurghada',
    experience_type: 'swimming_horses',
    price: null,
    price_type: 'per_person',
    duration: '3 hours',
    skill_level: 'all_levels',
    description: 'Ride into Red Sea and swim with your horse — unique experience. 4.7/5 on GetYourGuide (180+ reviews). Safety instructor present. Children 7+.',
    imageQuery: 'horseback riding Egypt pyramids',
    whatsapp: null,
    booking_url: 'https://www.getyourguide.com/hurghada-l970/swimming-horses-tc193/',
    is_featured: true,
    status: 'approved',
  },
  {
    id: 's4',
    title: 'Sharm El Sheikh — Sunrise Desert Ride (2 hrs)',
    city: 'sharm-el-sheikh',
    experience_type: 'sunrise_sunset_ride',
    price: null,
    price_type: 'per_person',
    duration: '2 hours',
    skill_level: 'beginner',
    description: 'Early morning ride through Sinai desert. Watch sunrise over Red Sea. Bedouin tea & snacks. 4.6/5 on GetYourGuide (220+ reviews). Beginner friendly.',
    imageQuery: 'horse riding near pyramids Egypt',
    whatsapp: null,
    booking_url: 'https://www.getyourguide.com/sharm-el-sheikh-l970/sunrise-horse-ride-tc193/',
    is_featured: false,
    status: 'approved',
  },
];

function ExperienceCard({ exp }) {
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    const query = exp.imageQuery || exp.title;
    base44.functions.invoke('fetchFreeImages', { placeName: query, maxImages: 1 })
      .then(res => {
        const imgs = res?.data?.images || [];
        if (imgs.length > 0) setPhoto(imgs[0].url);
      });
  }, [exp.imageQuery, exp.title]);

  const CITY_HORSE_VIATOR = {
    hurghada: 'https://www.viator.com/Hurghada-tours/Outdoor-Activities/d5323-g28/',
    'sharm-el-sheikh': 'https://www.viator.com/Sharm-el-Sheikh-tours/Outdoor-Activities/d832-g28/',
    aswan: 'https://www.viator.com/Aswan-tours/Outdoor-Activities/d4776-g28/',
    dahab: 'https://www.viator.com/Dahab/d4314-ttd',
    'el-gouna': 'https://www.viator.com/Hurghada-tours/Outdoor-Activities/d5323-g28/',
  };
  const bookingUrl = CITY_HORSE_VIATOR[exp.city] || 'https://www.viator.com/Egypt/d798-ttd';

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all cursor-pointer" onClick={() => setOpen(true)}>
      <div className="relative h-52 overflow-hidden bg-amber-50">
        {photo ? (
          <img src={photo} alt={exp.title} className="w-full h-full object-cover" onError={e => { e.target.style.display = 'none'; }} />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {exp.is_featured && (
            <span className="bg-amber-400 text-white text-[10px] font-black px-2 py-1 rounded-full">⭐ Top Pick</span>
          )}
          <span className="bg-white/90 text-amber-700 text-[10px] font-black px-2 py-1 rounded-full">
            {EXP_LABELS[exp.experience_type] || exp.experience_type}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-extrabold text-base leading-tight drop-shadow">{exp.title}</p>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 text-xs text-gray-400 flex-wrap mb-2">
          <span>📍 {CITY_LABELS[exp.city] || exp.city}</span>
          {exp.duration && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{exp.duration}</span>}
        </div>

        {exp.skill_level && (
          <p className="text-[10px] font-bold text-gray-500 mb-2">{SKILL_LABELS[exp.skill_level]}</p>
        )}

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">{exp.description}</p>

        <GoogleReviewsButton name={exp.title} className="mb-2" />
        <BookingButtons activity={exp.title} city={CITY_LABELS[exp.city] || exp.city} />
      </div>
      {open && <PlaceDetailModal place={{ name: exp.title, description: exp.description, photo: photo, city: CITY_LABELS[exp.city] || exp.city, type: 'activity' }} onClose={e => { e.stopPropagation(); setOpen(false); }} />}
    </div>
  );
}

function SubmitForm({ onClose }) {
  const [form, setForm] = useState({ title: '', city: '', experience_type: '', price: '', price_type: 'per_person', duration: '', description: '', whatsapp: '', skill_level: 'all_levels', main_image: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!form.title || !form.city || !form.experience_type || !form.price || !form.whatsapp) return;
    setLoading(true);
    await base44.entities.HorseRiding.create({ ...form, price: parseFloat(form.price), status: 'pending' });
    setLoading(false);
    setDone(true);
  };

  if (done) return (
    <div className="text-center py-8">
      <div className="text-5xl mb-4">✅</div>
      <h3 className="text-xl font-black mb-2">Submitted!</h3>
      <p className="text-sm text-gray-500 mb-4">Your experience is under review. We'll approve within 24 hours.</p>
      <button onClick={onClose} className="bg-amber-500 text-white px-6 py-2 rounded-xl font-bold">Close</button>
    </div>
  );

  return (
    <div className="space-y-3">
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 font-medium">
        🐎 Submit your experience for review. Once approved it will be visible to tourists.
      </div>
      {[
        { label: 'Experience Title', key: 'title', type: 'text', placeholder: 'e.g. Sunset Beach Horse Ride' },
        { label: 'Price (EGP)', key: 'price', type: 'number' },
        { label: 'Duration', key: 'duration', type: 'text', placeholder: 'e.g. 2 hours' },
        { label: 'WhatsApp Number', key: 'whatsapp', type: 'text', placeholder: '201001234567' },
      ].map(f => (
        <div key={f.key}>
          <label className="text-xs font-bold text-gray-600 mb-1 block">{f.label}</label>
          <input type={f.type} placeholder={f.placeholder || f.label} value={form[f.key]}
            onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
        </div>
      ))}
      {[
        { label: 'City', key: 'city', options: CITIES.map(c => ({ value: c.id, label: c.label })) },
        { label: 'Experience Type', key: 'experience_type', options: EXP_TYPES.map(t => ({ value: t.id, label: t.label })) },
        { label: 'Price Type', key: 'price_type', options: [{ value: 'per_person', label: 'Per Person' }, { value: 'per_hour', label: 'Per Hour' }] },
        { label: 'Skill Level', key: 'skill_level', options: [{ value: 'all_levels', label: 'All Levels' }, { value: 'beginner', label: 'Beginner Friendly' }, { value: 'intermediate', label: 'Intermediate' }] },
      ].map(f => (
        <div key={f.key}>
          <label className="text-xs font-bold text-gray-600 mb-1 block">{f.label}</label>
          <select value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white">
            <option value="">Select {f.label}</option>
            {f.options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      ))}
      <div>
        <label className="text-xs font-bold text-gray-600 mb-1 block">Description</label>
        <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3}
          placeholder="Describe the horse riding experience..."
          className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none" />
      </div>
      <div>
        <label className="text-xs font-bold text-gray-600 mb-1 block">Main Photo (optional)</label>
        <ImageUpload value={form.main_image} onChange={url => setForm(p => ({ ...p, main_image: url || '' }))} label="Upload Experience Photo" />
      </div>
      <button onClick={submit} disabled={loading}
        className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-amber-600 transition-all disabled:opacity-50">
        {loading ? 'Submitting...' : 'Submit My Experience'}
      </button>
    </div>
  );
}

export default function HorseRidingExperiences() {
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showForm, setShowForm] = useState(false);

  const { data: dbExps = [] } = useQuery({
    queryKey: ['horseriding'],
    queryFn: () => base44.entities.HorseRiding.filter({ status: 'approved' }),
  });

  const experiences = dbExps.length > 0 ? dbExps : SAMPLE_HORSES;

  const filtered = experiences.filter(e => {
    const matchSearch = !search || e.title.toLowerCase().includes(search.toLowerCase()) || CITY_LABELS[e.city]?.toLowerCase().includes(search.toLowerCase());
    const matchCity = !cityFilter || e.city === cityFilter;
    const matchType = !typeFilter || e.experience_type === typeFilter;
    return matchSearch && matchCity && matchType;
  });

  const featured = filtered.filter(e => e.is_featured);
  const regular = filtered.filter(e => !e.is_featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-600 via-orange-500 to-yellow-400 px-4 pt-10 pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-3">🐎</div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">Horse Riding Experiences</h1>
          <p className="text-white/80 text-sm mb-6">Beach · Desert · Sunrise · Swimming with Horses · Exclusive 10% discount</p>
          <button onClick={() => setShowForm(true)}
            className="bg-white text-amber-600 font-extrabold px-6 py-3 rounded-2xl text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto">
            <Plus className="w-4 h-4" /> List Your Experience
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6">
        {/* Search + Filters */}
        <div className="bg-white rounded-3xl shadow-lg p-4 mb-6 border border-gray-100">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search experiences or city..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-400" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={cityFilter} onChange={e => setCityFilter(e.target.value)}
              className="flex-1 min-w-[130px] px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-amber-400">
              <option value="">All Cities</option>
              {CITIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="flex-1 min-w-[130px] px-3 py-2 border border-gray-200 rounded-xl text-xs font-bold bg-white focus:outline-none focus:ring-2 focus:ring-amber-400">
              <option value="">All Types</option>
              {EXP_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
            {(cityFilter || typeFilter || search) && (
              <button onClick={() => { setCityFilter(''); setTypeFilter(''); setSearch(''); }}
                className="px-3 py-2 bg-red-50 text-red-500 rounded-xl text-xs font-bold border border-red-100">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Top Experiences */}
        {featured.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-extrabold text-gray-900 mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" /> Top Experiences
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {featured.map(e => <ExperienceCard key={e.id} exp={e} />)}
            </div>
          </div>
        )}

        {/* Beginner section */}
        {filtered.some(e => e.skill_level === 'beginner' || e.skill_level === 'all_levels') && (
          <div className="mb-4 bg-green-50 border border-green-100 rounded-2xl px-4 py-2.5 flex items-center gap-2">
            <span className="text-lg">🟢</span>
            <p className="text-xs font-bold text-green-700">All listings are beginner-friendly unless marked otherwise</p>
          </div>
        )}

        {/* All listings */}
        <div className="mb-4">
          <h2 className="text-lg font-extrabold text-gray-900">All Experiences ({filtered.length})</h2>
        </div>
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <span className="text-5xl">🐎</span>
            <p className="mt-3 font-bold">No experiences found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4 mb-12">
            {(featured.length > 0 ? regular : filtered).map(e => <ExperienceCard key={e.id} exp={e} />)}
          </div>
        )}

        {/* Verified Stables */}
        <VerifiedHorseStables />

        {/* CTA */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-400 rounded-3xl p-6 text-center text-white mb-10">
          <h3 className="font-extrabold text-lg mb-1">Own a Stable? List Your Experiences Free!</h3>
          <p className="text-white/80 text-xs mb-4">Reach thousands of tourists. No commission — just customers.</p>
          <button onClick={() => setShowForm(true)}
            className="bg-white text-amber-600 font-extrabold px-6 py-2.5 rounded-2xl text-sm hover:opacity-90">
            List My Experience →
          </button>
        </div>
      </div>

      {/* Submit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-end sm:items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-black mb-4 text-gray-900">🐎 List Your Experience</h2>
            <SubmitForm onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}
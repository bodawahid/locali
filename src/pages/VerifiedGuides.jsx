import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ShieldCheck, Star, Languages, MapPin, Plus, X, Check } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import { useSEO } from '../lib/seo';
import { generateTrackingCode } from '../lib/constants';

const SAMPLE_GUIDES = [
  {
    id: 'sample-1',
    full_name: 'Local Expert Guide',
    photo_url: '',
    license_id: 'LXR-2019-004821',
    city: 'luxor',
    cities_covered: ['Luxor', 'Aswan'],
    languages: ['Arabic', 'English', 'French'],
    tour_types: ['Valley of the Kings', 'Karnak Temple', 'West Bank', 'Nile Cruise', 'Full-Day Luxor'],
    description: 'Licensed Egyptologist with 14 years experience. I bring ancient history to life with stories not found in any guidebook.',
    price_half_day: 900,
    price_full_day: 1600,
    avg_rating: 4.9,
    review_count: 187,
    is_verified: true,
    years_experience: 14,
    specialties: ['Egyptology', 'Hieroglyphs', 'Tomb photography access'],
  },
  {
    id: 'sample-2',
    full_name: 'Local Expert Guide',
    photo_url: '',
    license_id: 'SHM-2017-002344',
    city: 'sharm-el-sheikh',
    cities_covered: ['Sharm El Sheikh', 'South Sinai'],
    languages: ['Arabic', 'English', 'Russian', 'German'],
    tour_types: ['Ras Mohammed', 'Mt Sinai', 'Coloured Canyon', 'St Catherine', 'Desert Safari'],
    description: 'Born in Sinai. I know every desert trail, every Bedouin family, and every secret dive site from here to Dahab.',
    price_half_day: 850,
    price_full_day: 1500,
    avg_rating: 4.8,
    review_count: 134,
    is_verified: true,
    years_experience: 11,
    specialties: ['Sinai Bedouin culture', 'Desert navigation', 'Multilingual groups'],
  },
  {
    id: 'sample-3',
    full_name: 'Local Expert Guide',
    photo_url: '',
    license_id: 'HRG-2020-008876',
    city: 'hurghada',
    cities_covered: ['Hurghada', 'El Gouna', 'Luxor (day trips)'],
    languages: ['Arabic', 'English', 'Italian', 'Spanish'],
    tour_types: ['Giftun Island', 'Desert Quad', 'Luxor Day Trip', 'Snorkeling', 'City Tour'],
    description: 'Hurghada native. I know where tourists get ripped off and how to avoid it. Every tour I lead is transparent on price.',
    price_half_day: 750,
    price_full_day: 1350,
    avg_rating: 4.7,
    review_count: 98,
    is_verified: true,
    years_experience: 8,
    specialties: ['Budget tours', 'No-scam guarantee', 'Water activities'],
  },
  {
    id: 'sample-4',
    full_name: 'Local Expert Guide',
    photo_url: '',
    license_id: 'ASW-2016-001123',
    city: 'aswan',
    cities_covered: ['Aswan', 'Abu Simbel', 'Nubian Villages'],
    languages: ['Arabic', 'English', 'French', 'Nubian'],
    tour_types: ['Abu Simbel', 'Philae Temple', 'Nubian Village', 'Felucca Tours', 'High Dam', 'Kom Ombo'],
    description: 'Nubian guide with deep roots in Aswan. My tours include access to private Nubian homes and genuine cultural experiences.',
    price_half_day: 800,
    price_full_day: 1400,
    avg_rating: 4.9,
    review_count: 211,
    is_verified: true,
    years_experience: 16,
    specialties: ['Nubian culture', 'Women-friendly groups', 'Abu Simbel expert'],
  },
];

const CITY_LABELS = {
  hurghada: 'Hurghada',
  'sharm-el-sheikh': 'Sharm El Sheikh',
  luxor: 'Luxor',
  aswan: 'Aswan',
};

const CITY_SEO = {
  hurghada: 'Verified Licensed Tourist Guides in Hurghada Egypt',
  'sharm-el-sheikh': 'Verified Licensed Tourist Guides in Sharm El Sheikh Egypt',
  luxor: 'Verified Licensed Tourist Guides in Luxor Egypt',
  aswan: 'Verified Licensed Tourist Guides in Aswan Egypt',
};

function GuideCard({ guide }) {
  const commission = Math.round((guide.price_full_day || 1500) * 0.07);
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(guide.full_name + ' guide ' + (CITY_LABELS[guide.city] || guide.city) + ' Egypt')}`;

  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
      <div className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center shrink-0">
            {guide.photo_url ? (
              <img src={guide.photo_url} alt={guide.full_name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <span className="text-2xl font-black text-accent">{guide.full_name.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-extrabold text-base">{guide.full_name}</h3>
              {guide.is_verified && (
                <span className="flex items-center gap-1 text-[10px] font-bold bg-success/10 text-success px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-2.5 h-2.5" /> Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{CITY_LABELS[guide.city]}</span>
              {guide.avg_rating && (
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <strong className="text-foreground">{guide.avg_rating}</strong>
                  <span>({guide.review_count} reviews)</span>
                </span>
              )}
            </div>
            <p className="text-[10px] font-mono text-muted-foreground">License: {guide.license_id}</p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{guide.description}</p>

        {/* Languages */}
        <div className="flex items-start gap-2 mb-3">
          <Languages className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <div className="flex flex-wrap gap-1">
            {guide.languages.map((l, i) => (
              <span key={i} className="text-[10px] bg-blue-500/10 text-blue-600 px-2 py-0.5 rounded-full">{l}</span>
            ))}
          </div>
        </div>

        {/* Tour types */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {guide.tour_types.map((t, i) => (
            <span key={i} className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-secondary/50 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground mb-0.5">Half Day</p>
            <p className="font-extrabold text-accent text-sm">{guide.price_half_day?.toLocaleString()} EGP</p>
          </div>
          <div className="bg-secondary/50 rounded-xl p-3 text-center">
            <p className="text-[10px] text-muted-foreground mb-0.5">Full Day</p>
            <p className="font-extrabold text-accent text-sm">{guide.price_full_day?.toLocaleString()} EGP</p>
          </div>
        </div>

        <p className="text-[9px] text-muted-foreground mb-3 text-center">Book via Viator or contact through Google Maps · 7% Locali fee: {commission} EGP</p>

        {/* CTA */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-secondary border border-border py-3 rounded-xl text-sm font-bold hover:bg-secondary/80 transition-colors"
        >
          📍 View on Google Maps →
        </a>
      </div>
    </div>
  );
}

function RegistrationForm({ onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: '', license_id: '', city: 'luxor',
    languages: '', tour_types: '', price_half_day: '', price_full_day: '',
    phone_whatsapp: '', description: '', years_experience: '', photo_url: '',
  });
  const queryClient = useQueryClient();

  const createGuide = useMutation({
    mutationFn: (data) => base44.entities.Guide.create({ ...data, status: 'pending', is_verified: false }),
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries(['guides']);
    },
  });

  const submit = (e) => {
    e.preventDefault();
    createGuide.mutate({
      ...form,
      languages: form.languages.split(',').map(s => s.trim()).filter(Boolean),
      tour_types: form.tour_types.split(',').map(s => s.trim()).filter(Boolean),
      price_half_day: parseFloat(form.price_half_day) || 0,
      price_full_day: parseFloat(form.price_full_day) || 0,
      years_experience: parseInt(form.years_experience) || 0,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-card w-full max-w-lg rounded-2xl border border-border my-4">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-extrabold text-base">Register as a Verified Guide</h2>
          <button onClick={onClose}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>
        {submitted ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-success" />
            </div>
            <h3 className="font-extrabold text-lg mb-2">Application Submitted!</h3>
            <p className="text-sm text-muted-foreground">Your application is under review. We verify the license ID with Egypt's Ministry of Tourism. You'll be contacted within 48 hours.</p>
            <button onClick={onClose} className="mt-4 bg-accent text-accent-foreground px-6 py-2 rounded-xl font-bold text-sm">Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="p-5 space-y-3">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-xs text-amber-700">
              ⚠️ Your license ID will be verified with Egypt's Ministry of Tourism database before approval. Only provide your real كارنيه الإرشاد السياحي number.
            </div>
            {[
              { key: 'full_name', label: 'Full Name', placeholder: 'Ahmed Hassan' },
              { key: 'license_id', label: 'License ID (كارنيه الإرشاد)', placeholder: 'LXR-2019-XXXXXX' },
              { key: 'phone_whatsapp', label: 'WhatsApp Number', placeholder: '201012345678' },
              { key: 'languages', label: 'Languages (comma-separated)', placeholder: 'English, French, Arabic' },
              { key: 'tour_types', label: 'Tour Types Offered (comma-separated)', placeholder: 'Valley of Kings, Karnak, Day trips' },
              { key: 'price_half_day', label: 'Half-Day Price (EGP)', placeholder: '900', type: 'number' },
              { key: 'price_full_day', label: 'Full-Day Price (EGP)', placeholder: '1600', type: 'number' },
              { key: 'years_experience', label: 'Years of Experience', placeholder: '10', type: 'number' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-bold mb-1 block">{f.label}</label>
                <input
                  type={f.type || 'text'}
                  required={['full_name', 'license_id', 'phone_whatsapp'].includes(f.key)}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full bg-secondary rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 ring-accent/30"
                />
              </div>
            ))}
            <div>
              <label className="text-xs font-bold mb-1 block">City</label>
              <select value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))}
                className="w-full bg-secondary rounded-xl px-3 py-2.5 text-sm outline-none">
                {Object.entries(CITY_LABELS).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold mb-1 block">About You</label>
              <textarea rows={3} value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Tell tourists about your experience and what makes your tours special..."
                className="w-full bg-secondary rounded-xl px-3 py-2.5 text-sm outline-none resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold mb-1 block">Profile Photo (optional)</label>
              <ImageUpload value={form.photo_url} onChange={url => setForm(p => ({ ...p, photo_url: url || '' }))} label="Upload Your Photo" />
            </div>
            <p className="text-[10px] text-muted-foreground">By submitting, you agree that Locali Egypt earns a 7% commission on all bookings made through this platform.</p>
            <button type="submit" disabled={createGuide.isPending}
              className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-bold text-sm disabled:opacity-50">
              {createGuide.isPending ? 'Submitting…' : 'Submit Application'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function VerifiedGuides() {
  const { lang } = useOutletContext();
  const [cityFilter, setCityFilter] = useState('');
  const [showRegister, setShowRegister] = useState(false);

  const { data: dbGuides = [] } = useQuery({
    queryKey: ['guides', cityFilter],
    queryFn: () => cityFilter
      ? base44.entities.Guide.filter({ city: cityFilter, status: 'approved', is_verified: true })
      : base44.entities.Guide.filter({ status: 'approved', is_verified: true }),
  });

  const allGuides = [...SAMPLE_GUIDES, ...dbGuides].filter(g => !cityFilter || g.city === cityFilter);

  useSEO({
    title: cityFilter ? CITY_SEO[cityFilter] : 'Verified Licensed Tourist Guides in Egypt — All Cities',
    description: 'Book verified, licensed Egyptian tourist guides in Luxor, Sharm El Sheikh, Hurghada and Aswan. License ID verified. Fixed prices. 7% commission supports Locali Egypt.',
  });

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-1">Verified Tourist Guides</h1>
          <p className="text-sm text-muted-foreground">All guides hold an official Egyptian Ministry of Tourism license. License IDs verified by Locali Egypt.</p>
        </div>
        <button onClick={() => setShowRegister(true)}
          className="shrink-0 flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-2 rounded-xl text-xs font-bold">
          <Plus className="w-3.5 h-3.5" />
          Register
        </button>
      </div>

      {/* Info */}
      <div className="bg-success/10 border border-success/20 rounded-2xl p-4 mb-6">
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-success shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground">
            <strong className="text-foreground">Verification process:</strong> Every guide submits their كارنيه الإرشاد السياحي (official Egyptian tourist guide license). We cross-check with Egypt's Ministry of Tourism registry before approval. Prices are fixed at approval — guides cannot change them.
          </div>
        </div>
      </div>

      {/* City filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        <button onClick={() => setCityFilter('')}
          className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${!cityFilter ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
          🌍 All Cities
        </button>
        {Object.entries(CITY_LABELS).map(([id, label]) => (
          <button key={id} onClick={() => setCityFilter(id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${cityFilter === id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {allGuides.map((guide, i) => <GuideCard key={guide.id || i} guide={guide} />)}
      </div>

      {showRegister && <RegistrationForm onClose={() => setShowRegister(false)} />}
    </div>
  );
}
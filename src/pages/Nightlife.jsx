import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useSEO } from '../lib/seo';
import { CITIES } from '../lib/constants';
import SafeNextStep from '../components/SafeNextStep';
import { Music, Shield, MapPin, Star, Plus } from 'lucide-react';
import GoogleReviewsButton from '../components/GoogleReviewsButton';
import ReviewSection from '../components/ReviewSection';
import AdminNightlifeForm from '../components/AdminNightlifeForm';
import { useAuth } from '@/lib/AuthContext';

const STATIC_VENUES = {
  'sharm-el-sheikh': [
    { name: 'Pacha Sharm', type: 'nightclub', location: 'Naama Bay', price_range: 'premium', safety_rating: 'safe', entry_fee: 300, desc: 'International nightclub brand. Friday and Saturday nights. Dress code enforced. The biggest club in Sharm.', tags: ['international djs', 'dress code', 'late night'] },
    { name: 'Hard Rock Cafe Sharm', type: 'bar', location: 'Naama Bay', price_range: 'premium', safety_rating: 'safe', entry_fee: 0, desc: 'American bar and restaurant with live music. Popular with British and European tourists. Safe mixed crowd.', tags: ['live music', 'international', 'food available'] },
    { name: 'Little Buddha', type: 'rooftop', location: 'Naama Bay', price_range: 'moderate', safety_rating: 'safe', entry_fee: 0, desc: 'Chic rooftop bar with Nile-inspired design. Cocktails, hookah, and Nile views. Great for groups.', tags: ['rooftop', 'shisha', 'cocktails'] },
    { name: 'Sultan Club Beach Party', type: 'beach_club', location: 'Sharks Bay', price_range: 'moderate', safety_rating: 'safe', entry_fee: 200, desc: 'Open-air beach party venue. Hosted events on weekends. Includes beach access.', tags: ['beach', 'outdoor', 'events'] },
    { name: 'Red Sea Yacht Club', type: 'yacht', location: 'Naama Bay Marina', price_range: 'luxury', safety_rating: 'safe', entry_fee: 0, desc: 'Private yacht rental for sunset cruises. Champagne service available. 4–10 person capacity.', tags: ['private', 'sunset', 'champagne'] },
  ],
  hurghada: [
    { name: 'Calypso Nightclub', type: 'nightclub', location: 'Sahl Hasheesh', price_range: 'moderate', safety_rating: 'safe', entry_fee: 200, desc: 'Largest nightclub in Hurghada. International and Arabic music. Security on door. Popular with European package tourists.', tags: ['large venue', 'mixed music', 'late night'] },
    { name: 'Hemingway\'s Bar', type: 'bar', location: 'Hurghada Marina', price_range: 'moderate', safety_rating: 'safe', entry_fee: 0, desc: 'Marina-side bar with sports screens and cold beer. Popular with expats and long-stay tourists. Relaxed vibe.', tags: ['marina', 'sports bar', 'expat friendly'] },
    { name: 'Roof Top Marina Bar', type: 'rooftop', location: 'Hurghada Marina', price_range: 'moderate', safety_rating: 'safe', entry_fee: 0, desc: 'Open rooftop bar overlooking the marina. Sundowners are spectacular. Cocktails, shisha, and light snacks.', tags: ['marina view', 'sunset', 'shisha'] },
    { name: 'VIP Limousine Yacht Trip', type: 'yacht', location: 'Hurghada Marina', price_range: 'luxury', safety_rating: 'safe', entry_fee: 0, desc: 'Private luxury yacht for groups. DJ service available. Corporate and private events. Full catering on board.', tags: ['private', 'events', 'dj service'] },
    { name: 'Sinbad Beach Club', type: 'beach_club', location: 'North Hurghada', price_range: 'moderate', safety_rating: 'safe', entry_fee: 150, desc: 'Day-to-night beach club with pool, bar, and regular events. Entry includes beach chair and first drink.', tags: ['beach', 'pool', 'day club'] },
  ],
};

const TYPE_LABELS = {
  bar: 'Bar', beach_club: 'Beach Club', nightclub: 'Nightclub',
  rooftop: 'Rooftop', yacht: 'Yacht', vip_lounge: 'VIP Lounge',
};

const PRICE_LABELS = { budget: '€', moderate: '€€', premium: '€€€', luxury: '€€€€' };

const SAFETY_STYLES = {
  safe: 'bg-success/10 text-success border-success/20',
  moderate: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
  use_caution: 'bg-red-500/10 text-red-500 border-red-500/20',
};

export default function Nightlife() {
  const [city, setCity] = useState('sharm-el-sheikh');
  const [typeFilter, setTypeFilter] = useState('all');
  const [expandedVenue, setExpandedVenue] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'admin';

  useSEO({
    title: 'Nightlife in Sharm El Sheikh & Hurghada 2025 — Bars, Beach Clubs & Yacht Trips',
    description: 'Complete nightlife guide for Sharm El Sheikh and Hurghada. Best bars, beach clubs, nightclubs, and yacht trips. Safety ratings and entry fees included.',
  });

  const { data: dbVenues = [] } = useQuery({
    queryKey: ['nightlife', city],
    queryFn: () => base44.entities.NightlifeVenue.filter({ city }, '-created_date', 30),
  });

  const staticVenues = STATIC_VENUES[city] || [];
  // Merge DB venues with static, avoiding duplicates by name
  const dbVenueNames = new Set(dbVenues.map(v => v.name?.toLowerCase()));
  const dedupedStatic = staticVenues.filter(v => !dbVenueNames.has(v.name?.toLowerCase()));
  const allVenues = [...dedupedStatic, ...dbVenues];
  const filtered = typeFilter === 'all' ? allVenues : allVenues.filter(v => v.type === typeFilter);

  const availableCities = ['sharm-el-sheikh', 'hurghada', 'luxor', 'aswan', 'el-gouna'];

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center shrink-0">
          <Music className="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">Nightlife & Luxury</h1>
            {isAdmin && (
              <button onClick={() => setShowForm(true)}
                className="flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-2 rounded-xl text-xs font-bold hover:opacity-90">
                <Plus className="w-3.5 h-3.5" /> Add Venue
              </button>
            )}
          </div>
          <p className="text-sm text-muted-foreground">Bars, beach clubs, yacht trips & VIP services</p>
        </div>
      </div>

      {/* Safety note */}
      <div className="bg-success/5 border border-success/20 rounded-2xl p-4 flex gap-3 mb-6">
        <Shield className="w-4 h-4 text-success shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">All venues listed here have been assessed for tourist safety. Egypt's resort nightlife is generally safe. Avoid drinking alcohol and then taking unmarked taxis. Use Careem at night.</p>
      </div>

      {/* City filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4">
        {availableCities.map(c => {
          const cityData = CITIES.find(x => x.id === c);
          return (
            <button key={c} onClick={() => setCity(c)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${city === c ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border text-muted-foreground hover:border-accent/30'}`}>
              {cityData?.name}
            </button>
          );
        })}
      </div>

      {/* Type filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-8">
        {['all', 'bar', 'beach_club', 'nightclub', 'rooftop', 'yacht'].map(t => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${typeFilter === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground'}`}>
            {t === 'all' ? 'All Types' : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {(showForm || editingRecord) && (
        <AdminNightlifeForm
          record={editingRecord}
          onSave={() => { setShowForm(false); setEditingRecord(null); queryClient.invalidateQueries(['nightlife']); }}
          onClose={() => { setShowForm(false); setEditingRecord(null); }}
        />
      )}

      {/* Venue listings */}
      <div className="space-y-4 mb-10">
        {filtered.map((venue, i) => {
          const key = venue.id || `${city}-${i}`;
          const isOpen = expandedVenue === key;
          const avgRating = venue.avg_rating;
          return (
            <div key={key} className="bg-card rounded-2xl border border-border/50 overflow-hidden">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{venue.name}</h3>
                      <span className="text-[10px] font-bold bg-secondary px-2 py-0.5 rounded-full">{TYPE_LABELS[venue.type]}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{venue.location}</span>
                      </div>
                      <span className="text-xs font-bold text-accent">{PRICE_LABELS[venue.price_range]}</span>
                      {avgRating > 0 && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-accent fill-accent" />
                          <span className="text-xs font-bold">{Number(avgRating).toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${SAFETY_STYLES[venue.safety_rating]}`}>
                      {venue.safety_rating === 'safe' ? '✓ Safe' : venue.safety_rating === 'moderate' ? '⚠ Moderate' : '! Caution'}
                    </span>
                    {venue.entry_fee > 0 && <span className="text-[10px] text-muted-foreground">Entry: {venue.entry_fee} EGP</span>}
                    {venue.entry_fee === 0 && <span className="text-[10px] text-success">Free entry</span>}
                    {isAdmin && venue.id && (
                      <button onClick={() => setEditingRecord(venue)}
                        className="text-[10px] font-bold bg-accent/10 text-accent px-2 py-0.5 rounded-full hover:bg-accent/20 transition-colors">
                        ✏️ Edit
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">{venue.desc || venue.description}</p>
                {venue.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {venue.tags.map((tag, j) => <span key={j} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full capitalize">{tag}</span>)}
                  </div>
                )}
                <div className="mt-3">
                  <GoogleReviewsButton name={venue.name} />
                </div>
                {venue.id && (
                  <button onClick={() => setExpandedVenue(isOpen ? null : key)}
                    className="text-xs font-bold text-accent hover:underline">
                    {isOpen ? '▲ Hide reviews' : '▼ Reviews & ratings'}
                  </button>
                )}
              </div>
              {isOpen && venue.id && (
                <div className="px-5 pb-5 border-t border-border/30 pt-4">
                  <ReviewSection entityId={venue.id} city={city} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* VIP & Yacht info */}
      <h2 className="text-xl font-extrabold mb-4">Yacht & VIP Experiences</h2>
      <div className="space-y-3 mb-10">
        {[
          { title: 'Private Sunset Yacht Cruise', price: '2,000–5,000 EGP/group', note: 'Typically 4–10 people. 2–3 hours. Catering optional. Book through marina offices, not beach touts.' },
          { title: 'VIP Table at Nightclub', price: '1,500–3,000 EGP (includes bottle)', note: 'Available at Pacha Sharm and Calypso Hurghada. Call to reserve 1 day in advance.' },
          { title: 'Private Beach Club Day', price: '500–1,500 EGP/person', note: 'Full-day private access, sun beds, drinks service. Several 5-star hotels offer this to non-guests.' },
        ].map((item, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-sm">{item.title}</h3>
              <span className="text-xs font-bold text-accent shrink-0">{item.price}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{item.note}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <SafeNextStep title="Safety Tips for Nighttime in Egypt" description="What to know before heading out" to="/women-safety" />
        <SafeNextStep title="Transport at Night — Avoid Scams" description="How to get back safely" to={`/city/${city}/transport`} />
      </div>
    </div>
  );
}
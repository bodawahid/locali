import { useState } from 'react';
import { useSEO } from '../lib/seo';
import { MapPin, Clock, CheckCircle2, ExternalLink, Search } from 'lucide-react';

const CONTACTS = [
  // ── MUSEUMS ──────────────────────────────────────────────────────────────
  { category: 'museums', city: 'hurghada', name: 'Hurghada Museum', hours: 'Daily 10am–1pm & 5pm–11pm', price: '200 EGP', website: 'https://egymonuments.gov.eg/en/museums/hurghada-museum/', query: 'Hurghada Museum Egypt', verified: true },
  { category: 'museums', city: 'sharm-el-sheikh', name: 'Sharm El Sheikh Museum', hours: 'Summer: 10am–12pm & 5pm–10pm', price: 'Ticket required', website: 'https://egymonuments.gov.eg/en/museums/sharm-al-sheikh-museum/', query: 'Sharm El Sheikh Museum Egypt', verified: true },
  { category: 'museums', city: 'luxor', name: 'Luxor Museum', hours: '9am–9pm daily', price: 'Ticket required', website: 'https://visitegypt.com/locations/luxor-museum/', query: 'Luxor Museum Egypt', verified: true },
  { category: 'museums', city: 'luxor', name: 'Karnak Temple', hours: '6am–8pm daily', price: '360 EGP', website: 'https://egymonuments.gov.eg/monuments/karnak-temple/', query: 'Karnak Temple Luxor Egypt', verified: true },
  { category: 'museums', city: 'luxor', name: 'Luxor Temple', hours: '6am–8pm daily', price: '500 EGP foreigners / 250 EGP Egyptians', website: 'https://egymonuments.gov.eg/monuments/luxor-temple/', query: 'Luxor Temple Egypt', verified: true },

  // ── PHARMACIES ────────────────────────────────────────────────────────────
  { category: 'pharmacy', city: 'hurghada', name: 'El Ezaby Pharmacy — Senzo Mall Hurghada', hours: 'Daily', price: '', website: 'https://elezabypharmacy.com', query: 'El Ezaby Pharmacy Senzo Mall Hurghada', verified: true },
  { category: 'pharmacy', city: 'sharm-el-sheikh', name: 'El Ezaby Pharmacy — Sharm El Sheikh', hours: 'Daily', price: '', website: 'https://elezabypharmacy.com', query: 'El Ezaby Pharmacy Sharm El Sheikh Egypt', verified: true },
  { category: 'pharmacy', city: 'hurghada', name: 'Seif Pharmacy — Hurghada', hours: '24/7', price: '', website: 'https://seif-online.com', query: 'Seif Pharmacy Hurghada Egypt', verified: true },
  { category: 'pharmacy', city: 'sharm-el-sheikh', name: 'Seif Pharmacy — Sharm El Sheikh', hours: '24/7', price: '', website: 'https://seif-online.com', query: 'Seif Pharmacy Sharm El Sheikh Egypt', verified: true },

  // ── RESTAURANTS ───────────────────────────────────────────────────────────
  { category: 'restaurant', city: 'hurghada', name: 'Gad Restaurant — Sakkala Hurghada', hours: '24 hours', price: 'Budget — 50–150 EGP', website: '', query: 'Gad Restaurant Sakkala Hurghada Egypt', verified: true },
  { category: 'restaurant', city: 'hurghada', name: 'Kan Zaman — El Gouna', hours: '8am–12am daily', price: 'Mid-range', website: 'https://www.facebook.com/KanZaman.elgouna/', query: 'Kan Zaman Restaurant El Gouna Egypt', verified: true },
  { category: 'restaurant', city: 'hurghada', name: 'Sofra Oriental Restaurant — Hurghada', hours: 'Daily', price: 'Mid-range', website: '', query: 'Sofra Oriental Restaurant Hurghada Egypt', verified: false },

  // ── EMERGENCY ─────────────────────────────────────────────────────────────
  { category: 'emergency', city: 'all', name: 'Tourist Police — Egypt', hours: '24/7', price: 'Free · Call 126', website: '', query: 'Tourist Police Egypt', verified: true, note: 'Call 126 from any Egyptian number — free, 24/7, English-speaking' },
  { category: 'emergency', city: 'all', name: 'Ambulance — Egypt', hours: '24/7', price: 'Free · Call 123', website: '', query: 'Ambulance Egypt emergency', verified: true, note: 'Call 123 from anywhere in Egypt — national emergency line' },
];

const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '📋' },
  { id: 'museums', label: 'Museums & Sites', emoji: '🏛️' },
  { id: 'pharmacy', label: 'Pharmacies', emoji: '💊' },
  { id: 'restaurant', label: 'Restaurants', emoji: '🍽️' },
  { id: 'emergency', label: 'Emergency', emoji: '🚨' },
];

const CITIES = [
  { id: 'all', label: 'All Cities' },
  { id: 'hurghada', label: 'Hurghada' },
  { id: 'sharm-el-sheikh', label: 'Sharm' },
  { id: 'luxor', label: 'Luxor' },
  { id: 'aswan', label: 'Aswan' },
];

function ContactCard({ c }) {
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(c.query)}`;

  return (
    <div className="bg-card rounded-2xl border border-border/50 p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-bold text-sm">{c.name}</h3>
            {c.verified ? (
              <span className="flex items-center gap-1 text-[9px] font-bold bg-success/10 text-success px-1.5 py-0.5 rounded-full">
                <CheckCircle2 className="w-2.5 h-2.5" /> Verified
              </span>
            ) : (
              <span className="text-[9px] font-bold bg-amber-500/10 text-amber-600 px-1.5 py-0.5 rounded-full">
                ⚠️ Unconfirmed
              </span>
            )}
          </div>
          {c.hours && (
            <p className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1">
              <Clock className="w-2.5 h-2.5 shrink-0" />{c.hours}
            </p>
          )}
          {c.price && <p className="text-[10px] text-accent font-bold mt-0.5">💰 {c.price}</p>}
          {c.note && <p className="text-[10px] text-muted-foreground italic mt-1">💡 {c.note}</p>}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-xl px-3 py-2 text-xs font-bold hover:bg-blue-500/20 transition-all">
          <MapPin className="w-3 h-3" /> 📍 Find on Google Maps →
        </a>
        {c.website && (
          <a href={c.website} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 bg-secondary rounded-xl px-3 py-2 text-xs font-bold text-muted-foreground hover:bg-secondary/80">
            <ExternalLink className="w-3 h-3" /> Official Site
          </a>
        )}
      </div>
    </div>
  );
}

export default function VerifiedContacts() {
  const [category, setCategory] = useState('all');
  const [city, setCity] = useState('all');
  const [search, setSearch] = useState('');

  useSEO({
    title: 'Verified Places — Museums, Pharmacies, Restaurants Egypt 2026',
    description: 'Find verified museums, pharmacies, restaurants and emergency services in Hurghada, Sharm El Sheikh, Luxor and Aswan. All linked to Google Maps.',
  });

  const filtered = CONTACTS.filter(c => {
    const matchCat = category === 'all' || c.category === category;
    const matchCity = city === 'all' || c.city === city || c.city === 'all';
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchCity && matchSearch;
  });

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
          <MapPin className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Verified Places — Egypt</h1>
          <p className="text-sm text-muted-foreground">All linked to Google Maps — no unverified phone numbers</p>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 mb-6 flex items-start gap-3">
        <MapPin className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-sm mb-1">Google Maps Links Only</p>
          <p className="text-xs text-muted-foreground">Every listing links to Google Maps so you get the current address, hours, photos, and reviews directly from the source.</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <input type="text" placeholder="Search places..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full bg-card border border-border/50 rounded-xl px-4 py-2.5 pl-10 text-sm outline-none focus:border-accent/50" />
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-3">
        {CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setCategory(cat.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${category === cat.id ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border text-muted-foreground'}`}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        {CITIES.map(c => (
          <button key={c.id} onClick={() => setCity(c.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${city === c.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground'}`}>
            {c.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mb-4">{filtered.length} places found</p>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" />
            <p>No results found</p>
          </div>
        ) : (
          filtered.map((c, i) => <ContactCard key={i} c={c} />)
        )}
      </div>
    </div>
  );
}
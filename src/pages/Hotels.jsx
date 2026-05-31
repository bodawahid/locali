import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { ShieldCheck, Star, Globe, ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';
import GoogleReviewsButton from '../components/GoogleReviewsButton';
import { HOTELS_BY_CITY } from '../lib/elGounaContent';
import PlaceDetailModal from '../components/PlaceDetailModal';
import WhereToStay from '../components/WhereToStay';

const CITY_LABELS = {
  hurghada: '🌊 Hurghada',
  'el-gouna': '⛵ El Gouna',
  'sharm-el-sheikh': '🤿 Sharm El Sheikh',
  luxor: '🏛️ Luxor',
  aswan: '🛶 Aswan',
};

const CITY_INTROS = {
  hurghada: 'Egypt\'s biggest Red Sea resort — massive all-inclusives, private bay resorts, and world-class diving.',
  'el-gouna': 'A private island city — upscale boutique hotels and international 5-star resorts across 13 islands.',
  'sharm-el-sheikh': 'From dive-focused boutique hotels to ultra-all-inclusive palace resorts on the Red Sea.',
  luxor: 'Sleep where Howard Carter planned the discovery of Tutankhamun — legendary history meets modern comfort.',
  aswan: 'Agatha Christie\'s Egypt — from authentic Nubian guesthouses to Nile island 5-star palaces.',
};

function FeaturePill({ label }) {
  return (
    <span className="text-[10px] bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{label}</span>
  );
}

function HotelCard({ hotel, city }) {
  const [open, setOpen] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const photos = hotel.photos || [];
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.name + ' ' + (city || '') + ' Egypt')}`;

  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => setOpen(true)}>
      {/* Photo gallery */}
      {photos.length > 0 && (
        <div className="relative h-48 overflow-hidden bg-muted" onClick={e => e.stopPropagation()}>
          <img src={photos[imgIdx]} alt={hotel.name} className="w-full h-full object-cover" loading="lazy" />
          {photos.length > 1 && (
            <>
              <button onClick={() => setImgIdx(i => (i - 1 + photos.length) % photos.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button onClick={() => setImgIdx(i => (i + 1) % photos.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70">
                <ChevronRight className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {photos.map((_, i) => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === imgIdx ? 'bg-white' : 'bg-white/50'}`} />)}
              </div>
            </>
          )}
        </div>
      )}
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-bold bg-secondary text-muted-foreground px-2 py-0.5 rounded-full">{hotel.type}</span>
              {hotel.verified && (
                <span className="flex items-center gap-1 text-[10px] font-bold bg-success/10 text-success px-2 py-0.5 rounded-full">
                  <ShieldCheck className="w-2.5 h-2.5" /> Verified
                </span>
              )}
            </div>
            <h3 className="font-extrabold text-base leading-tight">{hotel.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{hotel.area}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="font-extrabold text-accent text-lg">{hotel.price_egp_night.toLocaleString()} EGP</p>
            <p className="text-[10px] text-muted-foreground">~${hotel.price_usd_night}/night</p>
            {hotel.rating && (
              <div className="flex items-center gap-1 justify-end mt-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold">{hotel.rating}</span>
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{hotel.desc}</p>
      </div>

      {/* Check-in info */}
      <div className="px-4 py-2 flex items-center gap-4 text-xs text-muted-foreground border-b border-border/20">
        <span>✅ Check-in: {hotel.checkin}</span>
        <span>🚪 Check-out: {hotel.checkout}</span>
      </div>

      {/* Features */}
      <div className="px-4 py-3 flex flex-wrap gap-1.5">
        {hotel.features.map((f, i) => <FeaturePill key={i} label={f} />)}
      </div>

      {/* FAQ if present */}
      {hotel.faq?.length > 0 && (
        <div className="mx-4 mb-3 space-y-1">
          {hotel.faq.map((f, i) => (
            <div key={i} className="bg-secondary/40 rounded-xl px-3 py-2">
              <p className="text-[10px] font-bold mb-0.5">❓ {f.q}</p>
              <p className="text-[10px] text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      )}

      {/* CTAs */}
      <div className="px-4 pb-4 space-y-2">
        {hotel.website && (
          <a
            href={hotel.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-accent text-accent-foreground py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
            onClick={e => e.stopPropagation()}
          >
            <ExternalLink className="w-4 h-4" />
            Book on Official Website
          </a>
        )}
        <GoogleReviewsButton name={hotel.name} />
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full border border-border py-2.5 rounded-xl text-xs font-bold hover:bg-secondary transition-colors"
          onClick={e => e.stopPropagation()}
        >
          <Globe className="w-3.5 h-3.5" />
          Find on Google Maps
        </a>
      </div>
      {open && <PlaceDetailModal place={{ name: hotel.name, description: hotel.desc, city, type: 'hotel' }} onClose={e => { e.stopPropagation(); setOpen(false); }} />}
    </div>
  );
}

export default function Hotels() {
  const { lang } = useOutletContext();
  const [cityFilter, setCityFilter] = useState('hurghada');

  const hotels = HOTELS_BY_CITY[cityFilter] || [];

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-1">Hotels & Accommodation</h1>
        <p className="text-sm text-muted-foreground">Verified properties · Real prices in EGP · Book directly on official websites</p>
      </div>

      {/* City filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-2">
        {Object.entries(CITY_LABELS).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setCityFilter(id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${cityFilter === id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* City intro */}
      {cityFilter && (
        <div className="mb-5">
          <p className="text-xs text-muted-foreground italic">{CITY_INTROS[cityFilter]}</p>
        </div>
      )}

      {/* Hotels list */}
      <div className="space-y-4">
        {hotels.map((hotel, i) => (
          <HotelCard key={i} hotel={hotel} city={cityFilter} />
        ))}
      </div>

      <WhereToStay city={cityFilter} />

      {/* Traveler-type recommendation block */}
      <div className="mt-8 bg-card border border-border rounded-2xl p-5">
        <h3 className="font-black text-base mb-1">Not sure where to stay?</h3>
        <p className="text-xs text-muted-foreground mb-4">Pick your travel style and we'll point you in the right direction.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { emoji: '💎', label: 'Luxury Traveler', desc: 'World-class resorts & private beach access', cities: ['el-gouna', 'hurghada'], cityLabel: 'El Gouna · Hurghada' },
            { emoji: '🏛️', label: 'Culture & History', desc: 'Sleep near ancient temples & the Nile', cities: ['luxor', 'aswan'], cityLabel: 'Luxor · Aswan' },
            { emoji: '🤿', label: 'Beaches & Diving', desc: 'Best coral reefs & Red Sea water sports', cities: ['sharm-el-sheikh', 'hurghada'], cityLabel: 'Sharm El Sheikh · Hurghada' },
            { emoji: '🌴', label: 'Hidden Relaxation', desc: 'Boutique stays, Nile islands & peaceful escapes', cities: ['aswan', 'el-gouna'], cityLabel: 'Aswan · El Gouna' },
          ].map(rec => (
            <button
              key={rec.label}
              onClick={() => setCityFilter(rec.cities[0])}
              className="flex items-start gap-3 text-left p-3 rounded-xl border border-border hover:border-accent/40 hover:bg-accent/5 transition-all"
            >
              <span className="text-2xl shrink-0">{rec.emoji}</span>
              <div>
                <p className="font-bold text-sm">{rec.label}</p>
                <p className="text-xs text-muted-foreground">{rec.desc}</p>
                <p className="text-[11px] text-accent font-bold mt-1">{rec.cityLabel} →</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 bg-secondary/50 rounded-2xl p-4 text-center text-xs text-muted-foreground">
        Want to list your hotel here?{' '}
        <a href="/verify-apply" className="text-accent font-bold underline underline-offset-2">Apply for Verified Badge →</a>
      </div>
    </div>
  );
}
/**
 * ElGounaServices — Fetches and displays DB services linked to El Gouna,
 * grouped by category in Airbnb-style cards.
 */
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { MapPin, Star, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';

const CATEGORY_META = {
  restaurant:  { label: 'Restaurants',   emoji: '🍽️' },
  nightlife:   { label: 'Nightlife',      emoji: '🎉' },
  activities:  { label: 'Activities',     emoji: '🏄' },
  transport:   { label: 'Transport',      emoji: '🚗' },
  medical:     { label: 'Medical',        emoji: '💊' },
  kids_family: { label: 'Kids & Family',  emoji: '👨‍👩‍👧' },
  remote_work: { label: 'Remote Work',    emoji: '💻' },
  sim_internet:{ label: 'SIM & Internet', emoji: '📶' },
  long_stay:   { label: 'Long Stay',      emoji: '🏠' },
  other:       { label: 'Other',          emoji: '📌' },
};

function ServiceCard({ service }) {
  const img = service.main_image || service.photos?.[0];
  const cat = CATEGORY_META[service.category] || CATEGORY_META.other;

  return (
    <Link to={`/service/${service.id}`}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group block">
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-cyan-50 to-teal-100 overflow-hidden">
        {img ? (
          <img src={img} alt={service.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-60">
            {cat.emoji}
          </div>
        )}
        {service.is_verified && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <ShieldCheck className="w-2.5 h-2.5" /> Verified
          </div>
        )}
        <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-[9px] font-bold px-2 py-0.5 rounded-full text-cyan-700">
          {cat.emoji} {cat.label}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-bold text-sm text-gray-900 leading-snug line-clamp-1 mb-1">{service.name}</h3>
        {service.description && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2">{service.description}</p>
        )}
        <div className="flex items-center justify-between">
          {service.address ? (
            <div className="flex items-center gap-1 text-gray-400 text-[10px]">
              <MapPin className="w-2.5 h-2.5" />
              <span className="truncate max-w-[130px]">{service.address}</span>
            </div>
          ) : <div />}
          {service.avg_rating > 0 && (
            <div className="flex items-center gap-0.5 shrink-0">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-gray-700">{Number(service.avg_rating).toFixed(1)}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function ElGounaServices() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [tagging, setTagging] = useState(false);
  const [tagResult, setTagResult] = useState(null);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['services-el-gouna'],
    queryFn: () => base44.entities.Service.filter({ city: 'el-gouna' }, '-created_date', 100),
    staleTime: 60000,
  });

  const runAutoTag = async () => {
    setTagging(true);
    setTagResult(null);
    const res = await base44.functions.invoke('tagElGounaServices', {});
    setTagResult(res.data);
    setTagging(false);
    queryClient.invalidateQueries(['services-el-gouna']);
  };

  const isAdmin = user?.role === 'admin';

  if (isLoading) {
    return (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-2xl h-56 animate-pulse" />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground bg-cyan-50 rounded-2xl border border-cyan-100">
        <p className="text-3xl mb-2">🏖️</p>
        <p className="font-bold text-sm">No linked services yet</p>
        <p className="text-xs mt-1">Services tagged with "El Gouna" will appear here automatically.</p>
      </div>
    );
  }

  // Group by category
  const grouped = services.reduce((acc, s) => {
    const cat = s.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-muted-foreground font-semibold">
          {services.length} place{services.length !== 1 ? 's' : ''} linked to El Gouna
        </p>
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button onClick={runAutoTag} disabled={tagging}
              className="flex items-center gap-1.5 bg-cyan-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:opacity-90 disabled:opacity-50">
              {tagging ? <Loader2 className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
              Auto-tag from DB
            </button>
          )}
          <Link to="/services?city=el-gouna"
            className="text-xs font-bold text-cyan-600 hover:underline">
            View all in Services →
          </Link>
        </div>
      </div>

      {tagResult && (
        <div className="bg-cyan-50 border border-cyan-200 rounded-xl px-4 py-2.5 text-xs text-cyan-800">
          ✅ Scanned {tagResult.scanned} services — tagged {tagResult.tagged} as El Gouna.
        </div>
      )}

      {Object.entries(grouped).map(([cat, items]) => {
        const meta = CATEGORY_META[cat] || CATEGORY_META.other;
        return (
          <div key={cat}>
            <h3 className="font-extrabold text-base mb-3 flex items-center gap-2">
              <span>{meta.emoji}</span> {meta.label}
              <span className="text-xs font-normal text-muted-foreground">({items.length})</span>
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(s => <ServiceCard key={s.id} service={s} />)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
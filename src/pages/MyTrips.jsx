import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Sparkles, Trash2, MapPin, Calendar, DollarSign, Users, Copy, Check, Plus } from 'lucide-react';
import { useSEO } from '../lib/seo';

function ItineraryCard({ item, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(item.itinerary_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <h3 className="font-extrabold text-base">{item.city_label || item.city}</h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground flex-wrap">
              <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{item.days} days</span>
              <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{item.budget}</span>
              {item.travelers && <span className="flex items-center gap-1"><Users className="w-3 h-3" />{item.travelers} people</span>}
              {item.interests && <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{item.interests}</span>}
            </div>
          </div>
          <div className="flex gap-1 shrink-0">
            <button onClick={copy} className="p-2 rounded-xl hover:bg-secondary transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
            </button>
            <button onClick={() => onDelete(item.id)} className="p-2 rounded-xl hover:bg-red-500/10 transition-colors">
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
            </button>
          </div>
        </div>

        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-accent font-bold hover:underline"
        >
          {expanded ? 'Hide itinerary ↑' : 'Show full itinerary ↓'}
        </button>

        {expanded && (
          <div className="mt-3 pt-3 border-t border-border/30 text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
            {item.itinerary_text}
          </div>
        )}
      </div>

      <div className="px-4 pb-4 flex gap-2">
        <Link to={`/book?city=${item.city}`} className="flex-1 text-center bg-accent text-accent-foreground py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-opacity">
          Book Activities →
        </Link>
        <Link to={`/price-checker`} className="flex-1 text-center bg-secondary border border-border py-2 rounded-xl text-xs font-bold hover:bg-accent/10 transition-colors">
          Check Prices →
        </Link>
      </div>
    </div>
  );
}

export default function MyTrips() {
  useSEO({ title: 'My Saved Trips — Locali Egypt', nodate: true });

  const qc = useQueryClient();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  useState(() => {
    base44.auth.isAuthenticated().then(async (authed) => {
      if (authed) {
        const me = await base44.auth.me();
        setUser(me);
      }
      setAuthChecked(true);
    });
  });

  const { data: trips = [], isLoading } = useQuery({
    queryKey: ['my-trips', user?.email],
    queryFn: () => base44.entities.SavedItinerary.filter({ user_email: user.email }, '-created_date'),
    enabled: !!user,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SavedItinerary.delete(id),
    onSuccess: () => qc.invalidateQueries(['my-trips']),
  });

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-6 h-6 border-3 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="px-4 py-16 max-w-md mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-violet-500/10 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-violet-500" />
        </div>
        <h1 className="text-2xl font-black mb-2">My Saved Trips</h1>
        <p className="text-sm text-muted-foreground mb-6">Sign in to save your AI-generated itineraries and access them from any device.</p>
        <button
          onClick={() => base44.auth.redirectToLogin(window.location.href)}
          className="bg-accent text-accent-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
        >
          Sign In to View Your Trips
        </button>
        <p className="text-xs text-muted-foreground mt-4">
          Don't have an itinerary yet? <Link to="/trip-planner" className="text-accent font-bold">Create one →</Link>
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6 text-violet-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black">My Saved Trips</h1>
            <p className="text-sm text-muted-foreground">{trips.length} itinerary{trips.length !== 1 ? 'ies' : 'y'} saved</p>
          </div>
        </div>
        <Link
          to="/trip-planner"
          className="flex items-center gap-1.5 bg-accent text-accent-foreground px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> New Trip
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">✈️</p>
          <p className="font-bold text-lg mb-2">No saved trips yet</p>
          <p className="text-sm text-muted-foreground mb-6">Generate your first AI itinerary — takes 30 seconds.</p>
          <Link to="/trip-planner" className="bg-accent text-accent-foreground px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity">
            Plan My Egypt Trip →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => (
            <ItineraryCard key={trip.id} item={trip} onDelete={(id) => deleteMutation.mutate(id)} />
          ))}
        </div>
      )}
    </div>
  );
}
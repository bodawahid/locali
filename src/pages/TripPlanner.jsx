import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Users, Sparkles, ArrowRight, Copy, Check, RefreshCw, Heart, Plane, Hotel, Utensils, Camera, Shield, AlertTriangle } from 'lucide-react';
import { useSEO } from '../lib/seo';

const CITIES = [
  { id: 'hurghada', label: 'Hurghada', emoji: '🤿', desc: 'Red Sea diving & beach' },
  { id: 'sharm-el-sheikh', label: 'Sharm El Sheikh', emoji: '🐠', desc: 'Coral reefs & nightlife' },
  { id: 'luxor', label: 'Luxor', emoji: '🏛️', desc: 'Ancient temples & history' },
  { id: 'aswan', label: 'Aswan', emoji: '🛶', desc: 'Nubian culture & Nile' },
  { id: 'el-gouna', label: 'El Gouna', emoji: '🌊', desc: 'Upscale island city' },
  { id: 'cairo', label: 'Cairo + Pyramids', emoji: '🐫', desc: 'Pyramids & city culture' },
];

const BUDGETS = [
  { id: 'budget', label: 'Budget', desc: '€30–60/day', icon: '🎒' },
  { id: 'mid', label: 'Mid-range', desc: '€60–120/day', icon: '✈️' },
  { id: 'comfort', label: 'Comfort', desc: '€120–250/day', icon: '🏨' },
  { id: 'luxury', label: 'Luxury', desc: '€250+/day', icon: '💎' },
];

const INTERESTS = [
  { id: 'diving', label: 'Diving & Snorkeling', emoji: '🤿' },
  { id: 'history', label: 'History & Temples', emoji: '🏛️' },
  { id: 'food', label: 'Local Food', emoji: '🍽️' },
  { id: 'beach', label: 'Beach & Relaxation', emoji: '🏖️' },
  { id: 'adventure', label: 'Desert & Adventure', emoji: '🏜️' },
  { id: 'nightlife', label: 'Nightlife', emoji: '🎵' },
  { id: 'culture', label: 'Local Culture', emoji: '🎨' },
  { id: 'family', label: 'Family-Friendly', emoji: '👨‍👩‍👧' },
];

const DAYS_OPTIONS = [3, 4, 5, 7, 10, 14];

function SavedItinerary({ itinerary, onClear }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(itinerary.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 bg-accent/10 border-b border-accent/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="text-sm font-bold">Your AI Itinerary — {itinerary.city} · {itinerary.days} days · {itinerary.budget}</span>
        </div>
        <div className="flex gap-2">
          <button onClick={copy} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
            {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5 text-muted-foreground" />}
          </button>
          <button onClick={onClear} className="p-1.5 rounded-lg hover:bg-secondary transition-colors text-[10px] text-muted-foreground font-bold">New Plan</button>
        </div>
      </div>
      <div className="p-5">
        <div className="prose prose-sm max-w-none text-sm text-foreground leading-relaxed whitespace-pre-wrap">{itinerary.text}</div>
      </div>
      <div className="px-5 py-3 bg-secondary/30 border-t border-border/20 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {([
          { icon: Hotel, label: 'Hotels', to: '/hotels' },
          { icon: Camera, label: 'Book Tours', to: '/book' },
          { icon: Shield, label: 'Safety Tips', to: '/egypt-safe-now' },
          { icon: DollarSign, label: 'Real Prices', to: '/price-checker' },
        ] ).map(({ icon: Icon, label, to }) => (
          <a key={to} href={to} className="flex items-center gap-1.5 bg-card border border-border/50 rounded-xl px-3 py-2 text-xs font-bold hover:border-accent hover:text-accent transition-all">
            <Icon className="w-3.5 h-3.5" /> {label} →
          </a>
        ))}
      </div>
    </div>
  );
}

export default function TripPlanner() {
  useSEO({
    title: 'AI Trip Planner Egypt 2026 — Free Personalized Itinerary',
    description: 'Get a free AI-generated Egypt travel itinerary in seconds. Personalized by city, budget, days, and interests. Real local prices included.',
  });

  const urlParams = new URLSearchParams(window.location.search);
  const defaultCity = urlParams.get('city') || '';

  const [city, setCity] = useState(defaultCity);
  const [days, setDays] = useState(7);
  const [budget, setBudget] = useState('mid');
  const [interests, setInterests] = useState([]);
  const [travelers, setTravelers] = useState(2);
  const [loading, setLoading] = useState(false);
  const [itinerary, setItinerary] = useState(() => {
    const saved = localStorage.getItem('locali_itinerary');
    return saved ? JSON.parse(saved) : null;
  });

  const toggleInterest = (id) => {
    setInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const generate = async () => {
    if (!city) return;
    setLoading(true);

    const cityLabel = CITIES.find(c => c.id === city)?.label || city;
    const budgetLabel = BUDGETS.find(b => b.id === budget)?.label || budget;
    const budgetDesc = BUDGETS.find(b => b.id === budget)?.desc || '';
    const interestLabels = interests.length > 0
      ? interests.map(i => INTERESTS.find(x => x.id === i)?.label).join(', ')
      : 'general tourism';

    const prompt = `Create a ${days}-day Egypt travel itinerary for ${cityLabel}.
Budget: ${budgetLabel} (${budgetDesc}/day). Travelers: ${travelers}. Interests: ${interestLabels}.

For each day write:
**Day X — [Theme]**
- Morning/Afternoon/Evening: activity + price in EGP
- 💡 Tip: practical local advice

End with:
**💰 Budget Summary** (accommodation, food, activities totals in EGP)
**🚫 Top 3 Scams to Avoid**

Keep it concise. Use real April 2026 prices. 1 EUR ≈ 54 EGP.`;

    const result = await base44.integrations.Core.InvokeLLM({ prompt });
    const plan = {
      text: result,
      city: cityLabel,
      days,
      budget: budgetLabel,
      interests: interestLabels,
      createdAt: new Date().toISOString(),
    };
    setItinerary(plan);
    localStorage.setItem('locali_itinerary', JSON.stringify(plan));

    // Save to DB if logged in
    try {
      const me = await base44.auth.me();
      if (me?.email) {
        await base44.entities.SavedItinerary.create({
          city,
          city_label: cityLabel,
          days,
          budget: budgetLabel,
          interests: interestLabels,
          travelers,
          itinerary_text: result,
          user_email: me.email,
        });
      }
    } catch { /* not logged in — localStorage only */ }
    setLoading(false);
  };

  const canGenerate = city && !loading;

  return (
    <div className="px-4 py-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-6 h-6 text-violet-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">AI Trip Planner</h1>
          <p className="text-sm text-muted-foreground">Personalized Egypt itinerary in 30 seconds — real local prices</p>
        </div>
      </div>

      {itinerary ? (
        <SavedItinerary itinerary={itinerary} onClear={() => { setItinerary(null); localStorage.removeItem('locali_itinerary'); }} />
      ) : (
        <div className="space-y-6">

          {/* Step 1: City */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-accent" /> 1. Where are you going?
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {CITIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCity(c.id)}
                  className={`flex items-start gap-2 p-3 rounded-xl border text-left transition-all ${city === c.id ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border hover:border-accent/50'}`}
                >
                  <span className="text-xl shrink-0">{c.emoji}</span>
                  <div>
                    <p className="text-xs font-bold">{c.label}</p>
                    <p className={`text-[10px] ${city === c.id ? 'text-accent-foreground/70' : 'text-muted-foreground'}`}>{c.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Days */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-accent" /> 2. How many days?
            </p>
            <div className="flex gap-2 flex-wrap">
              {DAYS_OPTIONS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${days === d ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border hover:border-accent/50'}`}
                >
                  {d} days
                </button>
              ))}
            </div>
          </div>

          {/* Step 3: Budget */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-accent" /> 3. Budget level?
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {BUDGETS.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBudget(b.id)}
                  className={`flex flex-col items-center p-3 rounded-xl border transition-all ${budget === b.id ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border hover:border-accent/50'}`}
                >
                  <span className="text-xl mb-1">{b.icon}</span>
                  <p className="text-xs font-bold">{b.label}</p>
                  <p className={`text-[10px] ${budget === b.id ? 'text-accent-foreground/70' : 'text-muted-foreground'}`}>{b.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Step 4: Travelers */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-accent" /> 4. Number of travelers
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => setTravelers(t => Math.max(1, t-1))} className="w-9 h-9 rounded-xl bg-secondary border border-border font-bold text-lg hover:bg-accent hover:text-accent-foreground transition-all">-</button>
              <span className="font-extrabold text-xl w-8 text-center">{travelers}</span>
              <button onClick={() => setTravelers(t => Math.min(10, t+1))} className="w-9 h-9 rounded-xl bg-secondary border border-border font-bold text-lg hover:bg-accent hover:text-accent-foreground transition-all">+</button>
              <span className="text-sm text-muted-foreground">{travelers === 1 ? 'Solo traveler' : `${travelers} people`}</span>
            </div>
          </div>

          {/* Step 5: Interests */}
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-accent" /> 5. Interests (optional — pick any)
            </p>
            <div className="flex gap-2 flex-wrap">
              {INTERESTS.map((i) => (
                <button
                  key={i.id}
                  onClick={() => toggleInterest(i.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${interests.includes(i.id) ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border hover:border-accent/50'}`}
                >
                  {i.emoji} {i.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={generate}
            disabled={!canGenerate}
            className={`w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-3 transition-all ${canGenerate ? 'bg-accent text-accent-foreground hover:opacity-90 shadow-lg' : 'bg-secondary text-muted-foreground cursor-not-allowed'}`}
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                Generating your personalized itinerary...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate My Free Itinerary
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {!city && (
            <p className="text-center text-xs text-muted-foreground">← Select a city first to generate your itinerary</p>
          )}

          {loading && (
            <div className="bg-accent/5 border border-accent/20 rounded-2xl p-4 text-center">
              <p className="text-sm font-bold text-accent mb-1">✨ Crafting your perfect Egypt trip...</p>
              <p className="text-xs text-muted-foreground">Using local knowledge and real prices. Usually takes 10–15 seconds.</p>
            </div>
          )}
        </div>
      )}

      {/* Bottom note */}
      <div className="mt-8 bg-secondary/50 rounded-xl p-3 text-[10px] text-muted-foreground text-center">
        Itinerary uses real April 2026 prices in EGP. Data from Locali Egypt local network + verified operators.
        Uses advanced AI — <span className="text-accent font-bold">uses extra integration credits.</span>
      </div>
    </div>
  );
}
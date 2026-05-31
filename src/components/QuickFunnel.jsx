import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, ArrowRight, Sparkles } from 'lucide-react';

const CITIES = [
  { id: 'hurghada', label: 'Hurghada', emoji: '🤿' },
  { id: 'sharm-el-sheikh', label: 'Sharm', emoji: '🐠' },
  { id: 'luxor', label: 'Luxor', emoji: '🏛️' },
  { id: 'aswan', label: 'Aswan', emoji: '🛶' },
  { id: 'el-gouna', label: 'El Gouna', emoji: '🌊' },
];

const NEEDS = [
  { id: 'plan', label: 'Plan my trip', icon: '📋', path: '/trip-planner' },
  { id: 'prices', label: 'Check prices', icon: '💰', path: '/price-checker' },
  { id: 'safety', label: 'Is it safe?', icon: '🛡️', path: '/egypt-safe-now' },
  { id: 'scams', label: 'Avoid scams', icon: '⚠️', path: '/scam-map' },
  { id: 'book', label: 'Book a tour', icon: '🎯', path: '/book' },
  { id: 'stay', label: 'Find a place', icon: '🏨', path: '/hotels' },
];

export default function QuickFunnel({ lang }) {
  const [step, setStep] = useState(1);
  const [city, setCity] = useState('');
  const navigate = useNavigate();

  const handleCitySelect = (cityId) => {
    setCity(cityId);
    setStep(2);
  };

  const handleNeedSelect = (need) => {
    const path = need.id === 'plan'
      ? `/trip-planner?city=${city}`
      : need.id === 'prices'
      ? `/price-checker`
      : need.id === 'safety' || need.id === 'scams'
      ? need.path
      : `${need.path}${city ? `?city=${city}` : ''}`;
    navigate(path);
  };

  return (
    <div className="bg-card border-2 border-border/60 rounded-2xl overflow-hidden shadow-sm">
      {/* Progress */}
      <div className="flex border-b border-border/30">
        <div className={`flex-1 py-2.5 text-center text-xs font-bold transition-colors ${step >= 1 ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}`}>
          1. Where?
        </div>
        <div className={`flex-1 py-2.5 text-center text-xs font-bold transition-colors ${step >= 2 ? 'bg-accent text-accent-foreground' : 'bg-secondary text-muted-foreground'}`}>
          2. What do you need?
        </div>
      </div>

      <div className="p-4">
        {step === 1 && (
          <>
            <p className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Where are you going?
            </p>
            <div className="flex gap-2 flex-wrap">
              {CITIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleCitySelect(c.id)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-secondary hover:bg-accent hover:text-accent-foreground transition-all text-sm font-bold border border-border/40 hover:border-accent"
                >
                  {c.emoji} {c.label}
                </button>
              ))}
              <button
                onClick={() => setStep(2)}
                className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Not sure yet →
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                {city ? `${CITIES.find(c=>c.id===city)?.emoji} ${CITIES.find(c=>c.id===city)?.label} — ` : ''}What do you need?
              </p>
              <button onClick={() => setStep(1)} className="text-[10px] text-muted-foreground hover:text-foreground">← Back</button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {NEEDS.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNeedSelect(n)}
                  className="flex flex-col items-center gap-1 p-3 rounded-xl bg-secondary hover:bg-accent hover:text-accent-foreground transition-all border border-border/40 hover:border-accent group"
                >
                  <span className="text-xl">{n.icon}</span>
                  <span className="text-[10px] font-bold text-center leading-tight group-hover:text-accent-foreground">{n.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Calculator, Minus, Plus, Info, ExternalLink } from 'lucide-react';
import { t, CITIES } from '../lib/constants';
import { motion } from 'framer-motion';

// Prices updated April 2026 — sourced from Booking.com, TripAdvisor, Viator
const USD_TO_EGP = 50;
const EUR_TO_EGP = 54;

const BOOKING_LINKS = {
  'sharm-el-sheikh': 'https://www.booking.com/searchresults.html?ss=Sharm+El+Sheikh%2C+Egypt',
  'hurghada': 'https://www.booking.com/searchresults.html?ss=Hurghada%2C+Egypt',
  'luxor': 'https://www.booking.com/searchresults.html?ss=Luxor%2C+Egypt',
  'aswan': 'https://www.booking.com/searchresults.html?ss=Aswan%2C+Egypt',
};

const CITY_COSTS = {
  'sharm-el-sheikh': { name: 'Sharm El Sheikh', budget_daily: 2000, mid_daily: 7000, luxury_daily: 14000, meal_avg: 350, transport_avg: 280 },
  hurghada: { name: 'Hurghada', budget_daily: 1600, mid_daily: 5500, luxury_daily: 12000, meal_avg: 300, transport_avg: 250 },
  luxor: { name: 'Luxor', budget_daily: 1400, mid_daily: 4500, luxury_daily: 10000, meal_avg: 250, transport_avg: 200 },
  aswan: { name: 'Aswan', budget_daily: 1200, mid_daily: 4000, luxury_daily: 9000, meal_avg: 220, transport_avg: 180 },
};

// Nightly rates sourced from Booking.com April 2026 (converted at 54.5 EGP/USD)
const ACCOMMODATION_TIERS = [
  { label: 'Hostel / Guesthouse', costByCity: { 'sharm-el-sheikh': 1800, hurghada: 1400, luxor: 1200, aswan: 1000 } },
  { label: 'Budget Hotel (2–3 star)', costByCity: { 'sharm-el-sheikh': 4500, hurghada: 2800, luxor: 2200, aswan: 1900 } },
  { label: 'Mid-Range Hotel (3–4 star)', costByCity: { 'sharm-el-sheikh': 7500, hurghada: 5500, luxor: 4500, aswan: 4000 } },
  { label: 'Luxury Resort (5 star)', costByCity: { 'sharm-el-sheikh': 14000, hurghada: 12000, luxor: 10000, aswan: 9000 } },
];

// Activity prices sourced from Viator, GetYourGuide, local operators — April 2026
const ACTIVITIES_LIST = [
  { label: 'Diving – 2 dives (Sharm/Hurghada)', cost: 3500 },
  { label: 'Desert Safari / Quad (4 hours)', cost: 2000 },
  { label: 'Snorkeling day trip', cost: 2500 },
  { label: 'Hot Air Balloon – Luxor (certified)', cost: 5000 },
  { label: 'Valley of Kings entry (3 tombs)', cost: 500 },
  { label: 'Karnak Temple entry', cost: 450 },
  { label: 'Felucca (2 hours, whole boat)', cost: 400 },
  { label: 'Abu Simbel day trip (bus)', cost: 2800 },
  { label: 'Nubian Village boat trip', cost: 500 },
  { label: 'Quad biking (1 hour)', cost: 1500 },
  { label: 'Camel ride (30 min)', cost: 350 },
  { label: 'Giftun Island / Dolphin House trip', cost: 2500 },
];



const BUDGET_PROFILES = {
  'sharm-el-sheikh': [
    { profile: 'Budget Traveler', daily: '2,000–3,500 EGP', monthly: '60,000–105,000 EGP', includes: 'Guesthouse, local restaurants, shared transport, one activity every 3 days' },
    { profile: 'Mid-Range Tourist', daily: '6,000–10,000 EGP', monthly: '180,000–300,000 EGP', includes: '3-4 star hotel, mix of restaurants, Careem/taxi, activities every other day' },
    { profile: 'Luxury Traveler', daily: '14,000–25,000+ EGP', monthly: '420,000+ EGP', includes: '5-star resort, all meals in hotel, private transport, daily activities' },
  ],
  hurghada: [
    { profile: 'Budget Traveler', daily: '1,600–2,800 EGP', monthly: '48,000–84,000 EGP', includes: 'Hostel in El Dahar, local food, microbus transport, 2 dives per week' },
    { profile: 'Mid-Range Tourist', daily: '5,000–8,500 EGP', monthly: '150,000–255,000 EGP', includes: '3-star hotel Sahl Hasheesh, mix of restaurants, Careem, regular excursions' },
    { profile: 'All-Inclusive', daily: '12,000–20,000 EGP', monthly: '360,000–600,000 EGP', includes: 'All-inclusive 4–5 star resort with full board, activities included' },
  ],
  luxor: [
    { profile: 'Budget Traveler', daily: '1,400–2,200 EGP', monthly: '42,000–66,000 EGP', includes: 'West Bank guesthouse, local restaurants, bicycle, 2 temples per day' },
    { profile: 'Mid-Range Tourist', daily: '4,000–7,000 EGP', monthly: '120,000–210,000 EGP', includes: '3-star Corniche hotel, mix of food options, taxis, guided tours' },
    { profile: 'Luxury Traveler', daily: '10,000–18,000 EGP', monthly: '300,000+ EGP', includes: 'Nile-view hotel, private Egyptologist guide daily, private transport' },
  ],
  aswan: [
    { profile: 'Budget Traveler', daily: '1,200–2,000 EGP', monthly: '36,000–60,000 EGP', includes: 'Corniche guesthouse, local food, Nile boats, temples every other day' },
    { profile: 'Mid-Range Tourist', daily: '3,500–6,000 EGP', monthly: '105,000–180,000 EGP', includes: '3-star Corniche hotel, good restaurants, taxis, daily activities' },
    { profile: 'Luxury Traveler', daily: '9,000–16,000 EGP', monthly: '270,000+ EGP', includes: 'Sofitel Old Cataract, premium dining, private felucca, VIP Abu Simbel' },
  ],
};

export default function CostCalculator() {
  const { lang } = useOutletContext();
  const [days, setDays] = useState(7);
  const [selectedCity, setSelectedCity] = useState('hurghada');
  const [accommodation, setAccommodation] = useState(1);
  const [meals, setMeals] = useState(3);
  const [selectedActivities, setSelectedActivities] = useState([]);

  const cityData = CITY_COSTS[selectedCity];
  const accomCost = ACCOMMODATION_TIERS[accommodation].costByCity[selectedCity];
  const accomTotal = days * accomCost;
  const mealTotal = days * meals * cityData.meal_avg;
  const transportTotal = days * cityData.transport_avg;
  const activitiesTotal = selectedActivities.reduce((sum, idx) => sum + ACTIVITIES_LIST[idx].cost, 0);
  const total = accomTotal + mealTotal + transportTotal + activitiesTotal;
  const totalUSD = Math.round(total / USD_TO_EGP);
  const totalEUR = Math.round(total / EUR_TO_EGP);

  const toggleActivity = (idx) => {
    setSelectedActivities(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
          <Calculator className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">{t('cost_calculator', lang)}</h1>
          <p className="text-sm text-muted-foreground">Real costs updated April 2026 — sourced from Booking.com & Viator</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* City selector */}
        <div className="bg-card rounded-2xl border border-border/50 p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-bold">Which City?</label>
            <a href={BOOKING_LINKS[selectedCity]} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-bold text-accent hover:underline">
              <ExternalLink className="w-3 h-3" /> Check live prices on Booking.com
            </a>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {CITIES.map(c => (
              <button key={c.id} onClick={() => setSelectedCity(c.id)}
                className={`p-3 rounded-xl text-left transition-all ${selectedCity === c.id ? 'bg-accent text-accent-foreground ring-2 ring-accent' : 'bg-secondary hover:bg-secondary/80'}`}>
                <p className="text-xs font-bold">{c.name}</p>
                <p className="text-[10px] mt-0.5 opacity-70">{CITY_COSTS[c.id]?.budget_daily.toLocaleString()}–{CITY_COSTS[c.id]?.mid_daily.toLocaleString()} EGP/day</p>
              </button>
            ))}
          </div>
        </div>

        {/* Days */}
        <div className="bg-card rounded-2xl border border-border/50 p-5">
          <label className="text-sm font-bold mb-3 block">Number of Days</label>
          <div className="flex items-center justify-center gap-6">
            <button onClick={() => setDays(Math.max(1, days - 1))} className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80">
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-4xl font-black w-16 text-center">{days}</span>
            <button onClick={() => setDays(days + 1)} className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center hover:bg-secondary/80">
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Accommodation */}
        <div className="bg-card rounded-2xl border border-border/50 p-5">
          <label className="text-sm font-bold mb-3 block">Accommodation</label>
          <div className="grid grid-cols-2 gap-2">
            {ACCOMMODATION_TIERS.map((a, i) => (
              <button key={a.label} onClick={() => setAccommodation(i)}
                className={`p-3 rounded-xl text-left transition-all ${accommodation === i ? 'bg-accent text-accent-foreground ring-2 ring-accent' : 'bg-secondary hover:bg-secondary/80'}`}>
                <p className="text-xs font-bold">{a.label}</p>
                <p className="text-base font-extrabold mt-1">{a.costByCity[selectedCity]} <span className="text-xs font-normal">EGP/night</span></p>
              </button>
            ))}
          </div>
        </div>

        {/* Meals */}
        <div className="bg-card rounded-2xl border border-border/50 p-5">
          <label className="text-sm font-bold mb-3 block">Meals Per Day</label>
          <div className="flex items-center justify-center gap-6">
            <button onClick={() => setMeals(Math.max(0, meals - 1))} className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <Minus className="w-5 h-5" />
            </button>
            <span className="text-4xl font-black w-16 text-center">{meals}</span>
            <button onClick={() => setMeals(meals + 1)} className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-2">~{cityData.meal_avg} EGP avg per meal in {cityData.name}</p>
        </div>

        {/* Activities */}
        <div className="bg-card rounded-2xl border border-border/50 p-5">
          <label className="text-sm font-bold mb-3 block">Add Activities (fair prices)</label>
          <div className="grid grid-cols-2 gap-2">
            {ACTIVITIES_LIST.map((act, i) => (
              <button key={act.label} onClick={() => toggleActivity(i)}
                className={`p-3 rounded-xl text-left transition-all ${selectedActivities.includes(i) ? 'bg-accent text-accent-foreground ring-2 ring-accent' : 'bg-secondary hover:bg-secondary/80'}`}>
                <p className="text-[11px] font-bold leading-tight">{act.label}</p>
                <p className="text-sm font-extrabold mt-1">{act.cost} EGP</p>
              </button>
            ))}
          </div>
        </div>

        {/* Total */}
        <motion.div className="bg-primary text-primary-foreground rounded-2xl p-6"
          initial={{ scale: 0.95 }} animate={{ scale: 1 }} key={total} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
          <p className="text-xs font-bold opacity-60 mb-1">Estimated Total — {days} days in {cityData.name}</p>
          <p className="text-4xl font-black">{total.toLocaleString()} EGP</p>
          <div className="flex gap-4 mt-1">
            <p className="text-lg font-bold opacity-70">≈ ${totalUSD} USD</p>
            <p className="text-lg font-bold opacity-70">≈ €{totalEUR} EUR</p>
          </div>
          <div className="mt-4 space-y-1.5 text-xs opacity-70">
            <div className="flex justify-between"><span>Accommodation ({days} nights)</span><span>{accomTotal.toLocaleString()} EGP</span></div>
            <div className="flex justify-between"><span>Food ({meals} meals/day)</span><span>{mealTotal.toLocaleString()} EGP</span></div>
            <div className="flex justify-between"><span>Transport (est.)</span><span>{transportTotal.toLocaleString()} EGP</span></div>
            {activitiesTotal > 0 && <div className="flex justify-between"><span>Selected activities</span><span>{activitiesTotal.toLocaleString()} EGP</span></div>}
            <div className="border-t border-white/20 pt-1.5 flex justify-between font-bold">
              <span>Daily average</span><span>{Math.round(total / days).toLocaleString()} EGP/day</span>
            </div>
          </div>
          <p className="text-[9px] opacity-40 mt-3">Prices sourced from Booking.com & Viator · 2026–2027 · Rate: 1 USD ≈ {USD_TO_EGP} EGP</p>
        </motion.div>

        {/* Budget profiles */}
        <div className="bg-card rounded-2xl border border-border/50 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Info className="w-4 h-4 text-accent" />
            <h3 className="font-bold text-sm">Real Daily Budget Ranges — {cityData.name}</h3>
          </div>
          <div className="space-y-3">
            {(BUDGET_PROFILES[selectedCity] || []).map((profile, i) => (
              <div key={i} className="bg-secondary rounded-xl p-3">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-sm">{profile.profile}</span>
                  <span className="text-accent font-bold text-xs">{profile.daily}</span>
                </div>
                <p className="text-xs text-muted-foreground">{profile.includes}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
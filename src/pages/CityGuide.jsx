import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, ExternalLink, Utensils, Waves, Music, Baby, Globe, ShoppingBag, Coffee, ShoppingCart, Ship } from 'lucide-react';
import { CITY_GUIDE } from '../lib/cityGuideContent';

const TABS = [
  { id: 'beaches', label: 'Beaches', icon: Waves },
  { id: 'cafes', label: 'Cafes', icon: Coffee },
  { id: 'restaurants', label: 'Restaurants', icon: Utensils },
  { id: 'supermarkets', label: 'Supermarkets', icon: ShoppingCart },
  { id: 'malls', label: 'Shopping', icon: ShoppingBag },
  { id: 'water_sports', label: 'Water Sports', icon: Ship },
  { id: 'nightlife', label: 'Nightlife', icon: Music },
  { id: 'family', label: 'Family', icon: Baby },
  { id: 'day_trips', label: 'Day Trips', icon: Globe },
];

function PlaceCard({ place }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all">
      <div className="flex-1 min-w-0 mb-2">
        <h3 className="font-bold text-sm text-gray-900 leading-tight">{place.name}</h3>
        {place.cuisine && (
          <p className="text-[10px] font-bold text-accent mt-0.5">{place.cuisine} {place.price}</p>
        )}
        {place.free !== undefined && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${place.free ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
            {place.free ? '✅ Free' : '🎟️ Paid'}{place.note ? ` — ${place.note}` : ''}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-500 leading-relaxed mb-3">{place.description}</p>
      <div className="flex flex-wrap gap-2">
        <a href={place.maps} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 border border-blue-200 bg-blue-50 px-3 py-1.5 rounded-xl hover:bg-blue-100 transition-colors">
          <MapPin className="w-3 h-3" /> Google Maps
        </a>
        {place.booking && (
          <a href={place.booking} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs font-bold text-green-700 border border-green-200 bg-green-50 px-3 py-1.5 rounded-xl hover:bg-green-100 transition-colors">
            <ExternalLink className="w-3 h-3" /> Book Now
          </a>
        )}
      </div>
    </div>
  );
}

function TabContent({ city, activeTab }) {
  const items = city[activeTab];
  if (!items || items.length === 0) return (
    <div className="text-center py-12 text-gray-400">
      <p className="text-4xl mb-3">🔍</p>
      <p className="font-bold">Content coming soon for this section</p>
    </div>
  );

  const SECTION_INTROS = {
    beaches: `Best beaches in ${city.name}, Egypt — from Red Sea resorts to Nile riverside spots.`,
    cafes: `Best cafes in ${city.name} Egypt — beachfront, rooftop and specialty coffee shops.`,
    restaurants: `Best restaurants in ${city.name} Egypt — from street food to fine dining.`,
    supermarkets: `Supermarkets and grocery stores in ${city.name} Egypt — where locals and tourists shop.`,
    malls: `Shopping malls and bazaars in ${city.name} Egypt — souvenirs, fashion, and local crafts.`,
    water_sports: `Water sports and activities in ${city.name} Egypt — diving, snorkeling, kitesurfing and more.`,
    nightlife: `Nightlife and entertainment in ${city.name} Egypt — bars, clubs, and evening activities.`,
    family: `Family activities and things to do with kids in ${city.name} Egypt.`,
    day_trips: `Best day trips from ${city.name} Egypt — temples, islands, and excursions.`,
  };

  return (
    <div>
      <p className="text-xs text-gray-500 mb-4 italic">{SECTION_INTROS[activeTab]}</p>
      <div className="grid md:grid-cols-2 gap-3">
        {items.map((place, i) => <PlaceCard key={i} place={place} />)}
      </div>
    </div>
  );
}

export default function CityGuide() {
  const { cityId } = useParams();
  const city = CITY_GUIDE[cityId];
  const [activeTab, setActiveTab] = useState('beaches');

  if (!city) {
    return (
      <div className="text-center py-20 px-4">
        <p className="text-5xl mb-4">🗺️</p>
        <h1 className="text-xl font-black mb-2">City not found</h1>
        <p className="text-gray-500 text-sm">Available cities: hurghada, sharm, luxor, aswan, el-gouna</p>
      </div>
    );
  }

  const activeTabConfig = TABS.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img src={city.hero} alt={`${city.name} Egypt`} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-6 left-4 right-4 max-w-3xl mx-auto">
          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Egypt Travel Guide
          </p>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
            {city.emoji} {city.name}, Egypt
          </h1>
          <p className="text-white/80 text-sm mt-1">Things to do · Restaurants · Beaches · Activities · Day Trips</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Intro */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
          <h2 className="font-extrabold text-base text-gray-900 mb-2">About {city.name}, Egypt</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{city.intro}</p>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-5">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 shrink-0 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${activeTab === tab.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active tab header */}
        <div className="flex items-center gap-2 mb-4">
          {activeTabConfig && <activeTabConfig.icon className="w-5 h-5 text-accent" />}
          <h2 className="font-extrabold text-lg text-gray-900">
            {activeTabConfig?.label} in {city.name}, Egypt
          </h2>
        </div>

        {/* Tab content */}
        <TabContent city={city} activeTab={activeTab} />

        {/* SEO footer */}
        <div className="mt-10 bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="font-extrabold text-sm text-gray-900 mb-2">Complete Guide: Things To Do in {city.name} Egypt</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            This guide covers the best things to do in {city.name}, Egypt — including top beaches, best cafes in {city.name},
            recommended restaurants for every budget, water sports, nightlife, family activities, and day trips.
            All places include Google Maps links. Updated April 2026.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className="text-[10px] font-bold text-blue-600 hover:underline">
                {t.label} in {city.name} ·
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
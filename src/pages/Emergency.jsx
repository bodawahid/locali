import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Phone, Shield, Building2, AlertTriangle, Heart, MapPin } from 'lucide-react';
import { t } from '../lib/constants';
import SafeNextStep from '../components/SafeNextStep';

const NATIONAL_EMERGENCY = [
  { title: 'Tourist Police', number: '126', icon: Shield, desc: 'Free 24/7. Report scams, theft, and any incident against tourists. They exist specifically for this.', color: 'bg-blue-500' },
  { title: 'Ambulance', number: '123', icon: Heart, desc: 'Emergency medical services nationwide. Free call.', color: 'bg-red-500' },
  { title: 'Police (General)', number: '122', icon: Shield, desc: 'National emergency police line. 24/7.', color: 'bg-primary' },
  { title: 'Fire Department', number: '180', icon: AlertTriangle, desc: 'Fire emergencies. Free call.', color: 'bg-orange-500' },
];

const CITY_HOSPITALS = {
  'Sharm El Sheikh': [
    { name: 'Sharm International Hospital', type: 'General + Emergency', note: 'Main hospital. 24/7 emergency. English, Russian speaking.' },
    { name: 'South Sinai Hospital', type: 'General + Emergency', note: '24/7 emergency line. English-speaking staff.' },
    { name: 'Hyperbaric Medical Center Sharm', type: 'Diving Emergencies', note: 'Decompression chamber. Know this address before diving.' },
  ],
  'Hurghada': [
    { name: 'Hurghada General Hospital', type: 'General + Emergency', note: 'Main public hospital. 24/7.' },
    { name: 'The Egyptian Hospital Hurghada', type: 'Private + Emergency 24/7', note: 'El Kawthar area. Private hospital.' },
    { name: 'Hurghada Hyperbaric Center', type: 'Diving Emergencies', note: 'Specialist decompression chamber. 24/7 for dive emergencies.' },
  ],
  'Luxor': [
    { name: 'Luxor International Hospital', type: 'General + Emergency', note: '24/7 emergency. Accepts travel insurance. English staff.' },
    { name: 'Luxor German Hospital', type: 'Private Clinic', note: 'German-standard private clinic. English and German.' },
    { name: 'Nile Valley Medical Center', type: 'General Medicine', note: 'Private clinic. Faster service, reasonable fees.' },
  ],
  'Aswan': [
    { name: 'Aswan University Hospital', type: 'General + Emergency', note: 'Best-equipped hospital in southern Egypt. 24/7 emergency.' },
    { name: 'Ibn Sina Private Hospital', type: 'Private Hospital', note: 'English-speaking staff. Accepts international insurance.' },
    { name: 'Al Salam Hospital', type: 'General', note: 'Good private option. Central location near Corniche.' },
  ],
};

const CITY_TOURIST_POLICE = {
  'Sharm El Sheikh': { note: 'Large presence in Naama Bay. Very accessible. National line: 126' },
  'Hurghada': { note: 'Located between El Dahar and Marina. National line: 126' },
  'Luxor': { note: 'Staff at Valley of Kings, Karnak, and Luxor Temple daily. National line: 126' },
  'Aswan': { note: 'Friendly and accessible. Speak English. National line: 126' },
};

const EMBASSIES = [
  { country: '🇬🇧 UK Embassy Cairo', name: 'UK Embassy Cairo Egypt' },
  { country: '🇺🇸 US Embassy Cairo', name: 'US Embassy Cairo Egypt' },
  { country: '🇩🇪 German Embassy Cairo', name: 'German Embassy Cairo Egypt' },
  { country: '🇷🇺 Russian Embassy Cairo', name: 'Russian Embassy Cairo Egypt' },
  { country: '🇫🇷 French Embassy Cairo', name: 'French Embassy Cairo Egypt' },
  { country: '🇮🇹 Italian Embassy Cairo', name: 'Italian Embassy Cairo Egypt' },
  { country: '🇵🇱 Polish Embassy Cairo', name: 'Polish Embassy Cairo Egypt' },
  { country: '🇺🇦 Ukrainian Embassy Cairo', name: 'Ukrainian Embassy Cairo Egypt' },
];

const WHAT_TO_DO = [
  { situation: 'You were scammed or overcharged', steps: ['Call Tourist Police: 126', 'Note the location, time, and description of person', 'Request an official police report — needed for insurance', 'Save any receipts or messages as evidence'] },
  { situation: 'Medical emergency', steps: ['Call 123 for ambulance', 'Ask hotel to arrange transport — often fastest', 'Have your travel insurance number ready', 'Note: Hyperbaric centers in Sharm and Hurghada for diving injuries'] },
  { situation: 'Lost passport', steps: ['Report to local police (122) for a crime report', 'Contact your embassy immediately (find on Google Maps below)', 'Your embassy can issue emergency travel documents', 'Keep a photo of your passport ID page on your phone'] },
  { situation: 'Card lost or stolen', steps: ['Call your bank immediately to freeze the card', 'Report to Tourist Police (126) for documentation', 'Use Western Union or MoneyGram for emergency cash', 'Most embassies can assist with emergency funds'] },
];

function mapsUrl(name) {
  return `https://www.google.com/maps/search/${encodeURIComponent(name + ' Egypt')}`;
}

export default function Emergency() {
  const { lang } = useOutletContext();
  const [selectedCity, setSelectedCity] = useState('Sharm El Sheikh');

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-14 h-14 rounded-2xl bg-red-500 flex items-center justify-center shrink-0 animate-pulse-glow">
          <Phone className="w-7 h-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">{t('emergency', lang)}</h1>
          <p className="text-sm text-muted-foreground">Tap any number to call instantly</p>
        </div>
      </div>

      {/* National Emergency Numbers */}
      <h2 className="text-lg font-extrabold mb-3">National Emergency Numbers (Works Everywhere in Egypt)</h2>
      <div className="space-y-3 mb-8">
        {NATIONAL_EMERGENCY.map((contact) => {
          const Icon = contact.icon;
          return (
            <a key={contact.number} href={`tel:${contact.number}`}
              className="flex items-center gap-4 bg-card rounded-2xl border border-border/50 p-4 hover:shadow-lg transition-all active:scale-[0.98]">
              <div className={`w-14 h-14 rounded-xl ${contact.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{contact.title}</h3>
                <p className="text-xs text-muted-foreground">{contact.desc}</p>
              </div>
              <span className="text-2xl font-black text-accent">{contact.number}</span>
            </a>
          );
        })}
      </div>

      {/* City-specific hospitals */}
      <h2 className="text-lg font-extrabold mb-3">Hospitals & Medical Centers by City</h2>
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4">
        {Object.keys(CITY_HOSPITALS).map(city => (
          <button key={city} onClick={() => setSelectedCity(city)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${selectedCity === city ? 'bg-red-500 text-white' : 'bg-card border border-border'}`}>
            {city}
          </button>
        ))}
      </div>

      <div className="space-y-3 mb-6">
        {CITY_HOSPITALS[selectedCity]?.map((hosp, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-sm">{hosp.name}</h3>
              <span className="text-[10px] font-bold bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full shrink-0">{hosp.type}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{hosp.note}</p>
            <a href={mapsUrl(hosp.name)} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 font-bold text-xs hover:underline">
              <MapPin className="w-3.5 h-3.5" /> 📍 Find on Google Maps →
            </a>
          </div>
        ))}
      </div>

      {/* Tourist police by city */}
      <h2 className="text-lg font-extrabold mb-3">Tourist Police Offices by City</h2>
      <div className="space-y-3 mb-8">
        {Object.entries(CITY_TOURIST_POLICE).map(([city, info]) => (
          <div key={city} className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-bold text-sm">{city}</h3>
              <span className="text-xs font-bold text-blue-500">Call: 126 (free)</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3 italic">{info.note}</p>
            <a href={mapsUrl('Tourist Police ' + city)} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-blue-600 font-bold text-xs hover:underline">
              <MapPin className="w-3.5 h-3.5" /> 📍 Find on Google Maps →
            </a>
          </div>
        ))}
      </div>

      {/* What to do */}
      <h2 className="text-lg font-extrabold mb-3">What to Do in an Emergency</h2>
      <div className="space-y-3 mb-8">
        {WHAT_TO_DO.map((item, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
            <h3 className="font-bold text-sm mb-2">{item.situation}</h3>
            <ol className="space-y-1.5">
              {item.steps.map((step, j) => (
                <li key={j} className="flex gap-2 text-xs text-muted-foreground">
                  <span className="w-5 h-5 rounded-full bg-secondary font-bold text-[10px] flex items-center justify-center shrink-0">{j + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      {/* Embassies */}
      <h2 className="text-lg font-extrabold mb-3 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-muted-foreground" />
        Embassy Contacts (All in Cairo)
      </h2>
      <div className="space-y-2 mb-8">
        {EMBASSIES.map((em) => (
          <a key={em.country} href={mapsUrl(em.name)} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-between bg-card rounded-xl border border-border/50 p-4 hover:bg-secondary/50 transition-all">
            <span className="font-semibold text-sm">{em.country}</span>
            <span className="text-xs font-bold text-blue-600 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Find on Google Maps →
            </span>
          </a>
        ))}
      </div>

      <SafeNextStep title="Find Nearest Hospital" description="Verified medical services near you" to="/services?category=medical" />
    </div>
  );
}
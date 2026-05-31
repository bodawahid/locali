import { useState } from 'react';
import { useSEO } from '../lib/seo';
import { MapPin, Star, Waves, Phone, ExternalLink, ShieldCheck, DollarSign, Sun, Wifi, Baby, Search } from 'lucide-react';

const VILLAGES = [
  // ─── Hurghada Region ───────────────────────────────────────────────
  {
    id: 'el-gouna',
    name: 'El Gouna',
    nameAr: 'الجونة',
    city: 'hurghada',
    region: 'Red Sea',
    type: 'resort_town',
    typeLabel: 'Full Resort Town',
    description: 'Upscale self-contained resort town 22 km north of Hurghada. Designed by Abu Al-Einain with internal waterways, lakes, and a marina. Considered the best destination in Egypt for kite surfing and diving.',
    distance: '22 km north of Hurghada',
    address: 'Hurghada–Hurghada Road, Red Sea',
    google_maps: 'https://maps.google.com/?q=El+Gouna+Hurghada+Egypt',
    coords: { lat: 27.3867, lng: 33.6753 },
    rating: 4.9,
    price_range: 'premium',
    beach_quality: 5,
    diving: true,
    kite_surf: true,
    family_friendly: true,
    nightlife: true,
    remote_work: true,
    hotels: ['Sheraton Miramar', 'Steigenberger Golf Resort', 'Three Corners Rihana Inn', 'Movenpick Resort'],
    best_for: ['Kite Surfing', 'Diving', 'Nightlife', 'Remote Work', 'Families'],
    avg_hotel_egp: '3,000–15,000',
    highlights: [
      'Internal waterways & private lagoons',
      'Luxury marina with private yachts',
      'International hospital & premium services',
      'Private airport (GMB)',
      'Natural reserve — protected coral reefs',
    ],
    image_url: 'https://images.unsplash.com/photo-1578469550956-0e16b69c6a3d?w=600&q=80',
  },
  {
    id: 'sahl-hasheesh',
    name: 'Sahl Hasheesh',
    nameAr: 'سهل حشيش',
    city: 'hurghada',
    region: 'Red Sea',
    type: 'resort_village',
    typeLabel: 'Upscale Resort Village',
    description: 'Luxury resort village 18 km south of Hurghada. Stretches along a pristine natural sandy beach. Home to 5-star hotels, private villas, and a commercial promenade.',
    distance: '18 km south of Hurghada',
    address: 'Hurghada–South Hurghada Road, Red Sea',
    google_maps: 'https://maps.google.com/?q=Sahl+Hasheesh+Hurghada+Egypt',
    coords: { lat: 27.1167, lng: 33.9167 },
    rating: 4.8,
    price_range: 'luxury',
    beach_quality: 5,
    diving: true,
    kite_surf: false,
    family_friendly: true,
    nightlife: false,
    remote_work: false,
    hotels: ['Oberoi Sahl Hasheesh', 'Rixos Premium', 'Baron Palace', 'Jaz Grand Marsa'],
    best_for: ['Honeymoon', 'Relaxation', 'Diving', 'Families'],
    avg_hotel_egp: '4,000–18,000',
    highlights: [
      'Rare natural private sandy beach in the region',
      'Luxury villas with private swimming pools',
      'Internal commercial promenade',
      'Quieter and less crowded than Hurghada city',
    ],
    image_url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80',
  },
  {
    id: 'makadi-bay',
    name: 'Makadi Bay',
    nameAr: 'مكادي باي',
    city: 'hurghada',
    region: 'Red Sea',
    type: 'resort_village',
    typeLabel: 'Quiet Luxury Village',
    description: 'Quiet, upscale resort village 30 km south of Hurghada. Famous for total tranquility and stunning coral reefs directly accessible from the beach.',
    distance: '30 km south of Hurghada',
    address: 'Hurghada–South Hurghada Road, Red Sea',
    google_maps: 'https://maps.google.com/?q=Makadi+Bay+Hurghada+Egypt',
    coords: { lat: 26.9667, lng: 33.9833 },
    rating: 4.7,
    price_range: 'premium',
    beach_quality: 5,
    diving: true,
    kite_surf: false,
    family_friendly: true,
    nightlife: false,
    remote_work: false,
    hotels: ['Hyatt Ziva Makadi Bay', 'Iberotel Palace', 'Jaz Makadina', 'Aldiana Club Makadi'],
    best_for: ['Honeymoon', 'Relaxation', 'Shore Diving', 'Families'],
    avg_hotel_egp: '3,500–16,000',
    highlights: [
      'Coral reefs starting directly from the beach',
      'No noise — quiet and secluded',
      'Full water sports facilities',
      'Very suitable for couples',
    ],
    image_url: 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=600&q=80',
  },
  {
    id: 'soma-bay',
    name: 'Soma Bay',
    nameAr: 'سوما باي',
    city: 'hurghada',
    region: 'Red Sea',
    type: 'resort_village',
    typeLabel: 'Distinguished Resort Peninsula',
    description: 'Self-contained resort peninsula 45 km south of Hurghada. Spans 10 km² and features golf courses, a world-class spa, and water sports.',
    distance: '45 km south of Hurghada',
    address: 'Soma Bay, Red Sea',
    google_maps: 'https://maps.google.com/?q=Soma+Bay+Hurghada+Egypt',
    coords: { lat: 26.8667, lng: 34.0333 },
    rating: 4.8,
    price_range: 'luxury',
    beach_quality: 5,
    diving: true,
    kite_surf: true,
    family_friendly: true,
    nightlife: false,
    remote_work: false,
    hotels: ['Robinson Club', 'Breakers Soma Bay', 'Kempinski Hotel Soma Bay', 'Sheraton Soma Bay'],
    best_for: ['Golf', 'Spa & Wellness', 'Kite Surfing', 'Honeymoon'],
    avg_hotel_egp: '4,000–20,000',
    highlights: [
      '18-hole international golf course',
      '"The Cascades" Spa — best in Egypt',
      'Secluded peninsula — total privacy',
      'Official kite surfing center',
    ],
    image_url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80',
  },

  // ─── Marsa Alam Region ─────────────────────────────────────────────
  {
    id: 'marsa-alam',
    name: 'Marsa Alam',
    nameAr: 'مرسى علم',
    city: 'marsa-alam',
    region: 'South Red Sea',
    type: 'resort_town',
    typeLabel: 'Rising Resort Town',
    description: "Emerging tourist destination in southern Red Sea, 220 km south of Hurghada. Famous for Egypt's best diving spots and the world's most pristine coral reefs.",
    distance: '220 km south of Hurghada',
    address: 'Hurghada–Marsa Alam Road, Red Sea',
    google_maps: 'https://maps.google.com/?q=Marsa+Alam+Egypt',
    coords: { lat: 25.0667, lng: 34.8833 },
    rating: 4.8,
    price_range: 'moderate',
    beach_quality: 5,
    diving: true,
    kite_surf: false,
    family_friendly: false,
    nightlife: false,
    remote_work: false,
    hotels: ['Shams Alam Beach Resort', 'Brayka Bay Resort', 'Lahami Bay Resort', 'Desert Rose Resort'],
    best_for: ['World-class Diving', 'Dugong Watching', 'Nature & Quiet', 'Snorkel Safari'],
    avg_hotel_egp: '2,000–9,000',
    highlights: [
      'Best dugong watching sites in the world',
      'Virgin coral reefs untouched by mass tourism',
      'International airport (RMF)',
      'Clearer underwater visibility than Hurghada or Sharm',
    ],
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
  },
  {
    id: 'hamata',
    name: 'Hamata',
    nameAr: 'حماطة',
    city: 'marsa-alam',
    region: 'South Red Sea',
    type: 'eco_village',
    typeLabel: 'Quiet Eco Village',
    description: "Small eco village at the far south of Egypt's Red Sea coast. For experienced divers and lovers of unspoiled nature.",
    distance: '350 km south of Hurghada',
    address: 'Hamata, South Red Sea',
    google_maps: 'https://maps.google.com/?q=Hamata+Egypt',
    coords: { lat: 23.95, lng: 35.65 },
    rating: 4.7,
    price_range: 'budget',
    beach_quality: 5,
    diving: true,
    kite_surf: false,
    family_friendly: false,
    nightlife: false,
    remote_work: false,
    hotels: ['Hamata Diving Village', 'Lahami Bay (nearby)'],
    best_for: ['Virgin Diving', 'Seclusion & Quiet', 'Raw Nature'],
    avg_hotel_egp: '800–3,000',
    highlights: ['Incredible coral reefs', 'Almost no mass tourism', 'Nearby Dahlak Islands'],
    image_url: 'https://images.unsplash.com/photo-1682687218904-be316a0e6de3?w=600&q=80',
  },

  // ─── Sharm El Sheikh Region ────────────────────────────────────────
  {
    id: 'naama-bay',
    name: 'Naama Bay',
    nameAr: 'نعمة باي',
    city: 'sharm-el-sheikh',
    region: 'South Sinai',
    type: 'resort_district',
    typeLabel: 'Heart of Sharm El Sheikh',
    description: 'The most famous tourist district in Sharm El Sheikh. The main promenade has the largest concentration of restaurants, nightclubs, shops, and diving centers in Sinai.',
    distance: 'Sharm El Sheikh center',
    address: 'Naama Bay, Sharm El Sheikh, South Sinai',
    google_maps: 'https://maps.google.com/?q=Naama+Bay+Sharm+El+Sheikh+Egypt',
    coords: { lat: 27.9105, lng: 34.3295 },
    rating: 4.6,
    price_range: 'moderate',
    beach_quality: 4,
    diving: true,
    kite_surf: false,
    family_friendly: true,
    nightlife: true,
    remote_work: true,
    hotels: ['Hyatt Regency Sharm', 'Hilton Sharm Dreams', 'Le Méridien Villas', 'Ibis Styles'],
    best_for: ['Nightlife', 'Diving', 'Shopping', 'Diverse Dining'],
    avg_hotel_egp: '2,500–12,000',
    highlights: [
      'Most famous promenade in Sharm El Sheikh',
      'Dozens of certified diving centers',
      'Diverse international restaurants',
      'Active nightlife',
    ],
    image_url: 'https://images.unsplash.com/photo-1503917988258-f87a78e3c995?w=600&q=80',
  },
  {
    id: 'nabq',
    name: 'Nabq Bay',
    nameAr: 'نبق',
    city: 'sharm-el-sheikh',
    region: 'South Sinai',
    type: 'resort_village',
    typeLabel: 'Quiet Family Village',
    description: "Quiet resort village north of Sharm El Sheikh. Located next to Nabq Nature Reserve with private beaches and a calm family atmosphere away from Naama Bay's noise.",
    distance: '18 km north of Sharm El Sheikh',
    address: 'Nabq, Sharm El Sheikh, South Sinai',
    google_maps: 'https://maps.google.com/?q=Nabq+Bay+Sharm+El+Sheikh+Egypt',
    coords: { lat: 28.0333, lng: 34.4167 },
    rating: 4.5,
    price_range: 'moderate',
    beach_quality: 4,
    diving: true,
    kite_surf: false,
    family_friendly: true,
    nightlife: false,
    remote_work: false,
    hotels: ['Coral Sea Aqua Club', 'Maritim Jolie Ville', 'Tropitel Naama Bay', 'Blue Reef Resort'],
    best_for: ['Families', 'Peace & Quiet', 'Nature Walks', 'Snorkeling'],
    avg_hotel_egp: '2,000–8,000',
    highlights: [
      'Adjacent to Nabq Nature Reserve',
      'Beach with rare mangrove forests',
      'Lower prices than Naama Bay',
    ],
    image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
  },
  {
    id: 'sharks-bay',
    name: 'Sharks Bay',
    nameAr: 'خليج الحوت',
    city: 'sharm-el-sheikh',
    region: 'South Sinai',
    type: 'resort_village',
    typeLabel: 'Quiet Diving Bay',
    description: 'Small, quiet bay between Naama Bay and the airport. Popular among divers for its natural beauty and total tranquility. Ideal for those wanting peace while staying close to everything.',
    distance: '5 km south of Naama Bay',
    address: 'Sharks Bay, Sharm El Sheikh, South Sinai',
    google_maps: 'https://maps.google.com/?q=Sharks+Bay+Sharm+El+Sheikh+Egypt',
    coords: { lat: 27.8667, lng: 34.3 },
    rating: 4.6,
    price_range: 'moderate',
    beach_quality: 5,
    diving: true,
    kite_surf: false,
    family_friendly: false,
    nightlife: false,
    remote_work: false,
    hotels: ['Sharks Bay Umbi Diving Village', 'Sol Sharm Hotel'],
    best_for: ['Diving', 'Quiet Escape', 'Direct Shore Snorkeling'],
    avg_hotel_egp: '1,500–6,000',
    highlights: ['Coral reefs directly from the beach', 'Quiet and away from Naama Bay noise', 'Suitable for experienced divers'],
    image_url: 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=600&q=80',
  },
  {
    id: 'dahab',
    name: 'Dahab',
    nameAr: 'دهب',
    city: 'sharm-el-sheikh',
    region: 'South Sinai',
    type: 'beach_village',
    typeLabel: 'Casual Beach Village',
    description: 'Unique bohemian beach village 90 km north of Sharm El Sheikh. True paradise for divers, wind sports lovers, and those climbing Mount Sinai. Relaxed vibes and very affordable prices.',
    distance: '90 km north of Sharm El Sheikh',
    address: 'Dahab, South Sinai',
    google_maps: 'https://maps.google.com/?q=Dahab+Egypt',
    coords: { lat: 28.5, lng: 34.5167 },
    rating: 4.8,
    price_range: 'budget',
    beach_quality: 5,
    diving: true,
    kite_surf: true,
    family_friendly: false,
    nightlife: true,
    remote_work: true,
    hotels: ['Nesima Resort', 'Daniela Village', 'Local guesthouses'],
    best_for: ['Blue Hole Diving', 'Kite & Wind Surfing', 'Budget Travel', 'Sinai Desert Trips', 'Remote Work'],
    avg_hotel_egp: '400–4,000',
    highlights: [
      'The Blue Hole — most famous dive site in the world',
      'Canyon & Islands — exceptional dive spots',
      'European prices drop 60–80% here',
      'Seafront cafes & chill atmosphere',
      'Daily bus from Sharm for ~100 EGP',
    ],
    image_url: 'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=80',
  },

  // ─── North Coast ───────────────────────────────────────────────────
  {
    id: 'marina',
    name: 'Marina El Alamein',
    nameAr: 'مارينا العلمين',
    city: 'north-coast',
    region: 'North Coast',
    type: 'resort_village',
    typeLabel: 'Upscale Summer Village',
    description: "The most famous resort village on Egypt's North Coast, 120 km west of Alexandria. A summer haven for Egyptians with white sandy beaches and vibrant nightlife.",
    distance: '120 km west of Alexandria / 340 km west of Cairo',
    address: 'Marina, North Coast, Matrouh',
    google_maps: 'https://maps.google.com/?q=Marina+North+Coast+Egypt',
    coords: { lat: 30.8333, lng: 28.9667 },
    rating: 4.3,
    price_range: 'premium',
    beach_quality: 5,
    diving: false,
    kite_surf: false,
    family_friendly: true,
    nightlife: true,
    remote_work: false,
    hotels: ['Marassi Hotels', 'Hacienda Bay', 'Palm Hills North Coast'],
    best_for: ['Egyptian Summer', 'Families', 'Young Travelers', 'Summer Nightlife'],
    avg_hotel_egp: '3,000–15,000',
    highlights: [
      'Best sandy beaches in Egypt',
      'Turquoise Mediterranean waters',
      'Malls and full entertainment',
      'Peak season: June–August',
    ],
    image_url: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?w=600&q=80',
  },
  {
    id: 'ain-sokhna',
    name: 'Ain Sokhna',
    nameAr: 'العين السخنة',
    city: 'suez',
    region: 'Gulf of Suez',
    type: 'resort_area',
    typeLabel: 'Closest Resort to Cairo',
    description: 'The closest beach resort to Cairo — only 120 km away. Located on the Gulf of Suez with dozens of resort villages. Popular weekend getaway for Cairenes.',
    distance: '120 km southeast of Cairo',
    address: 'Ain Sokhna, Gulf of Suez, Suez Governorate',
    google_maps: 'https://maps.google.com/?q=Ain+Sokhna+Egypt',
    coords: { lat: 29.5667, lng: 32.3333 },
    rating: 4.2,
    price_range: 'moderate',
    beach_quality: 3,
    diving: false,
    kite_surf: false,
    family_friendly: true,
    nightlife: false,
    remote_work: false,
    hotels: ['Stella di Mare', 'Porto Sokhna', 'Pyramids Hills', 'La Sirena'],
    best_for: ['Close to Cairo', 'Families', 'Short Breaks', 'Relaxation'],
    avg_hotel_egp: '1,500–8,000',
    highlights: [
      'Very close to Cairo (1.5 hours)',
      'Dozens of diverse resort villages',
      'Warm Gulf of Suez waters',
      'Year-round season',
    ],
    image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
  },
];

const REGIONS = [
  { id: 'all', label: 'All' },
  { id: 'hurghada', label: '🌊 Hurghada' },
  { id: 'sharm-el-sheikh', label: '🤿 Sharm El Sheikh' },
  { id: 'marsa-alam', label: '🐠 Marsa Alam' },
  { id: 'north-coast', label: '🏖️ North Coast' },
  { id: 'suez', label: '🌅 Ain Sokhna' },
];

const PRICE_LABELS = { budget: 'Budget', moderate: 'Moderate', premium: 'Premium', luxury: 'Luxury' };
const PRICE_COLORS = { budget: 'bg-success/10 text-success', moderate: 'bg-blue-500/10 text-blue-600', premium: 'bg-amber-500/10 text-amber-700', luxury: 'bg-purple-500/10 text-purple-700' };

const FEATURE_ICONS = [
  { key: 'diving', label: 'Diving', icon: '🤿' },
  { key: 'kite_surf', label: 'Kite Surf', icon: '🪁' },
  { key: 'family_friendly', label: 'Family Friendly', icon: '👨‍👩‍👧' },
  { key: 'nightlife', label: 'Nightlife', icon: '🎉' },
  { key: 'remote_work', label: 'Remote Work', icon: '💻' },
];

function VillageCard({ v }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden hover:shadow-lg transition-all">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img src={v.image_url} alt={v.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-end justify-between">
            <div>
              <h3 className="text-white font-black text-lg leading-tight">{v.name}</h3>
              <p className="text-white/80 text-xs">{v.nameAr} · {v.region}</p>
            </div>
            <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm rounded-full px-2 py-0.5">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="text-white text-xs font-bold">{v.rating}</span>
            </div>
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${PRICE_COLORS[v.price_range]}`}>
            {PRICE_LABELS[v.price_range]}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="text-[10px] font-bold bg-black/40 text-white px-2 py-1 rounded-full backdrop-blur-sm">
            {v.typeLabel}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Distance + address */}
        <div className="flex items-start gap-1.5 mb-2">
          <MapPin className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold">{v.distance}</p>
            <p className="text-[10px] text-muted-foreground">{v.address}</p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{v.description}</p>

        {/* Features */}
        <div className="flex flex-wrap gap-1 mb-3">
          {FEATURE_ICONS.filter(f => v[f.key]).map((f, i) => (
            <span key={i} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full font-medium">
              {f.icon} {f.label}
            </span>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs text-muted-foreground">Avg. hotel:</span>
            <span className="text-xs font-bold text-accent">{v.avg_hotel_egp} EGP/night</span>
          </div>
        </div>

        {/* Expand/Collapse */}
        <button onClick={() => setExpanded(!expanded)}
          className="text-[11px] text-accent font-bold mb-2 hover:underline">
          {expanded ? '▲ Less details' : '▼ More details + Hotels'}
        </button>

        {expanded && (
          <div className="space-y-3 mt-2 border-t border-border/30 pt-3">
            {/* Highlights */}
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Highlights</p>
              <ul className="space-y-1">
                {v.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <span className="text-success mt-0.5">✓</span>{h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Best for */}
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Best For</p>
              <div className="flex flex-wrap gap-1">
                {v.best_for.map((b, i) => (
                  <span key={i} className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full">{b}</span>
                ))}
              </div>
            </div>

            {/* Hotels */}
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1.5">Notable Hotels</p>
              <div className="flex flex-wrap gap-1">
                {v.hotels.map((h, i) => (
                  <span key={i} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{h}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Google Maps */}
        <a href={v.google_maps} target="_blank" rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-2 w-full bg-success/10 border border-success/20 text-success rounded-xl py-2 text-xs font-bold hover:bg-success/20 transition-all">
          <MapPin className="w-3.5 h-3.5" />
          View on Google Maps
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}

export default function TouristVillages() {
  const [region, setRegion] = useState('all');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useSEO({
    title: 'Tourist Villages in Egypt 2026 — Hurghada, Sharm El Sheikh, Marsa Alam, North Coast',
    description: 'Complete guide to the best tourist villages and resorts in Egypt 2026. Full info, addresses, maps, hotels and prices.',
  });

  const filtered = VILLAGES.filter(v => {
    const matchRegion = region === 'all' || v.city === region;
    const matchSearch = !search || v.name.toLowerCase().includes(search.toLowerCase()) || v.region.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'all' ? true :
      filter === 'diving' ? v.diving :
      filter === 'kite' ? v.kite_surf :
      filter === 'family' ? v.family_friendly :
      filter === 'budget' ? ['budget', 'moderate'].includes(v.price_range) :
      filter === 'luxury' ? ['premium', 'luxury'].includes(v.price_range) : true;
    return matchRegion && matchSearch && matchFilter;
  });

  return (
    <div className="px-4 py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
          <Sun className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Tourist Villages in Egypt</h1>
          <p className="text-sm text-muted-foreground">Complete guide · {VILLAGES.length} destinations · Updated April 2026</p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { label: 'Villages & Resorts', value: VILLAGES.length, color: 'text-blue-500' },
          { label: 'Dive Sites', value: VILLAGES.filter(v => v.diving).length, color: 'text-cyan-500' },
          { label: 'Family Friendly', value: VILLAGES.filter(v => v.family_friendly).length, color: 'text-success' },
          { label: 'Kite Surfing', value: VILLAGES.filter(v => v.kite_surf).length, color: 'text-amber-500' },
        ].map((s, i) => (
          <div key={i} className="bg-card rounded-xl border border-border/50 p-3 text-center">
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute right-3 top-3 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search destinations..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-card border border-border/50 rounded-xl px-4 py-2.5 pr-10 text-sm outline-none focus:border-accent/50"
        />
      </div>

      {/* Region filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-4">
        {REGIONS.map(r => (
          <button key={r.id} onClick={() => setRegion(r.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${region === r.id ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border text-muted-foreground'}`}>
            {r.label}
          </button>
        ))}
      </div>

      {/* Feature filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        {[
          { id: 'all', label: 'All' },
          { id: 'diving', label: '🤿 Diving' },
          { id: 'kite', label: '🪁 Kite Surf' },
          { id: 'family', label: '👨‍👩‍👧 Family' },
          { id: 'budget', label: '💚 Budget' },
          { id: 'luxury', label: '⭐ Luxury' },
        ].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${filter === f.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p className="text-xs text-muted-foreground mb-4">
        Showing {filtered.length} of {VILLAGES.length} destinations
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Sun className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p>No results found</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map(v => <VillageCard key={v.id} v={v} />)}
        </div>
      )}

      {/* Tip */}
      <div className="mt-8 bg-accent/10 border border-accent/20 rounded-2xl p-4 text-center">
        <p className="text-sm font-bold mb-1">💡 Locali Egypt Tip</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Use code <strong>LOCALI</strong> when booking with any local guide or tour company for a 10% discount.
        </p>
      </div>
    </div>
  );
}
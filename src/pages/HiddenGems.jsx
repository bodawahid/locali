import { useState } from 'react';
import { MapPin, Sparkles, Star, ChevronRight } from 'lucide-react';
import EditableImage from '../components/EditableImage';
import { useQuery } from '@tanstack/react-query';

const TAG_STYLES = {
  Adventure: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  Chill: 'bg-sky-500/10 text-sky-600 border-sky-500/20',
  Cultural: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
  Luxury: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  Explorer: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  Nature: 'bg-green-500/10 text-green-700 border-green-500/20',
  Historic: 'bg-amber-500/10 text-amber-700 border-amber-500/20',
};

const REGIONS = ['All', 'Luxor', 'Aswan', 'Sinai', 'Red Sea', 'El Gouna'];

const GEMS = [
  // LUXOR
  {
    id: 1,
    name: 'Deir el-Medina',
    area: 'Luxor, West Bank',
    region: 'Luxor',
    tag: 'Cultural',
    desc: 'The ancient village where the workers who built the royal tombs actually lived.',
    why: 'Reveals real daily life of ancient Egypt — not kings and gods, but craftsmen and families from 3,200 years ago.',
    image: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=800&q=80',
    number: '01',
  },
  {
    id: 2,
    name: 'Valley of the Nobles',
    area: 'Luxor, West Bank',
    region: 'Luxor',
    tag: 'Cultural',
    desc: 'Over 400 tombs of high officials — same artistic quality as Valley of the Kings, without the queues.',
    why: 'You can stand alone before 3,500-year-old paintings in complete silence. Most tourists never come here.',
    image: 'https://images.unsplash.com/photo-1601591875309-b2f42b060bb3?w=800&q=80',
    number: '02',
  },
  {
    id: 3,
    name: 'Medinet Habu Temple',
    area: 'Luxor, West Bank',
    region: 'Luxor',
    tag: 'Cultural',
    desc: 'A massive, vibrant temple complex of Ramesses III — colors still vivid after 3,000 years.',
    why: 'Far less crowded than Karnak. You walk through it almost completely alone.',
    image: 'https://images.unsplash.com/photo-1706541266792-8c0475ba5b9e?w=800&q=80',
    number: '03',
  },
  {
    id: 4,
    name: 'The Ramesseum',
    area: 'Luxor, West Bank',
    region: 'Luxor',
    tag: 'Explorer',
    desc: 'Dramatic ruins with a fallen colossal statue of Ramesses II — inspiration for Shelley\'s Ozymandias.',
    why: 'Creates a cinematic, melancholic atmosphere unlike anything else in Egypt.',
    image: 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80',
    number: '04',
  },
  {
    id: 5,
    name: 'Banana Island',
    area: 'Luxor, Nile Islands',
    region: 'Luxor',
    tag: 'Chill',
    desc: 'A lush Nile island covered in banana and mango groves, reachable by short felucca ride.',
    why: 'Slow Nile drifting, fresh fruit picked off the tree, and zero tourist infrastructure.',
    image: 'https://images.unsplash.com/photo-1553342385-111fd9d0c46a?w=800&q=80',
    number: '05',
  },
  {
    id: 6,
    name: 'West Bank Traditional Villages',
    area: 'Luxor, West Bank',
    region: 'Luxor',
    tag: 'Cultural',
    desc: 'Ancient villages where locals still live above and around pharaonic tombs.',
    why: 'Mud-brick houses, donkeys, and children playing — life unchanged for centuries.',
    image: 'https://images.unsplash.com/photo-1594735981133-d68e0b6d9b5d?w=800&q=80',
    number: '06',
  },

  // ASWAN
  {
    id: 7,
    name: 'Elephantine Island',
    area: 'Aswan, Nile Islands',
    region: 'Aswan',
    tag: 'Cultural',
    desc: 'The original settlement of Aswan — one of the oldest inhabited places in Egypt with a Nubian village and ancient ruins.',
    why: 'History, calm local life, and Nile views that most visitors completely miss.',
    image: 'https://images.unsplash.com/photo-1600256697320-1d65df022f93?w=800&q=80',
    number: '07',
  },
  {
    id: 8,
    name: 'Seheil Island',
    area: 'Aswan, Nile South',
    region: 'Aswan',
    tag: 'Explorer',
    desc: 'A granite island covered in over 250 ancient inscriptions and petroglyphs spanning 4,000 years.',
    why: 'Pharaohs, traders, and soldiers all carved their marks here — it\'s an open-air historical archive.',
    image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?w=800&q=80',
    number: '08',
  },
  {
    id: 9,
    name: 'Kitchener\'s Island (Botanical Garden)',
    area: 'Aswan, Nile Islands',
    region: 'Aswan',
    tag: 'Nature',
    desc: 'A serene botanical garden island gifted to Lord Kitchener, now filled with exotic plants from Africa and Asia.',
    why: 'Shaded, peaceful and uncrowded — one of the most calming spots on the entire Nile.',
    image: 'https://images.unsplash.com/photo-1585150166695-7a5e36394d9c?w=800&q=80',
    number: '09',
  },
  {
    id: 10,
    name: 'Nubian Village (Gharb Sohail)',
    area: 'Aswan, West Bank',
    region: 'Aswan',
    tag: 'Cultural',
    desc: 'Authentic Nubian village with painted houses in turquoise, yellow, and indigo — untouched by mass tourism.',
    why: 'Walk through hand-painted alleyways and meet locals who invite strangers in for tea.',
    image: 'https://images.unsplash.com/photo-1541343672885-9be56236302a?w=800&q=80',
    number: '10',
  },
  {
    id: 11,
    name: 'Tombs of the Nobles (Qubbet el-Hawa)',
    area: 'Aswan, West Bank Cliffs',
    region: 'Aswan',
    tag: 'Explorer',
    desc: 'Rock-cut tombs of Aswan\'s ancient governors carved into desert cliffs overlooking the Nile.',
    why: 'The view from the cliff path — desert, Nile, and Elephantine below — is one of Egypt\'s best.',
    image: 'https://images.unsplash.com/photo-1559547776-b85ceed0c9a4?w=800&q=80',
    number: '11',
  },
  {
    id: 12,
    name: 'Kalabsha Temple Area',
    area: 'Aswan, Lake Nasser Shore',
    region: 'Aswan',
    tag: 'Adventure',
    desc: 'A relocated Nubian temple on Lake Nasser\'s shore — accessible only by boat, almost no visitors.',
    why: 'Standing alone before a complete ancient temple with nothing but lake and desert around you is unforgettable.',
    image: 'https://images.unsplash.com/photo-1539143428705-8e89617c0d5a?w=800&q=80',
    number: '12',
  },

  // SINAI
  {
    id: 13,
    name: 'Boho Camp',
    area: 'Ras Mohammed, South Sinai',
    region: 'Sinai',
    tag: 'Luxury',
    desc: 'Aesthetic eco beach camp inside a protected nature reserve.',
    why: 'A Bali-like vibe in Egypt — fire pits, hammocks, and the Red Sea at your feet.',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80',
    number: '13',
  },
  {
    id: 14,
    name: 'Wadi El Weshwash',
    area: 'Sinai Interior',
    region: 'Sinai',
    tag: 'Explorer',
    desc: 'A hidden desert valley with natural water pools in the mountains.',
    why: 'Most people have never heard of it. Those who go never stop talking about it.',
    image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800&q=80',
    number: '14',
  },
  {
    id: 15,
    name: 'Dar Catherine Eco-Lodge',
    area: 'St. Catherine, Sinai',
    region: 'Sinai',
    tag: 'Luxury',
    desc: 'A spiritual eco-lodge focused on silence, stars, and total disconnection.',
    why: 'No Wi-Fi by design. The night sky here is one of the clearest in Africa.',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
    number: '15',
  },
  {
    id: 16,
    name: 'Ras Abu Galum',
    area: 'Dahab, North Sinai Coast',
    region: 'Sinai',
    tag: 'Adventure',
    desc: 'Remote coastal area accessible only by camel or a 2-hour hike.',
    why: 'Zero infrastructure. Completely untouched. One of Egypt\'s last wild coastlines.',
    image: 'https://images.unsplash.com/photo-1542574621-e088a4464792?w=800&q=80',
    number: '16',
  },
  {
    id: 17,
    name: 'Nuweiba Tarabin Area',
    area: 'Nuweiba, South Sinai',
    region: 'Sinai',
    tag: 'Chill',
    desc: 'Simple beach huts, bonfires, and complete silence on the Gulf of Aqaba.',
    why: 'The most "off-grid" beach experience possible — no noise, no Wi-Fi, no agenda.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
    number: '17',
  },
  {
    id: 18,
    name: 'Colored Canyon',
    area: 'Nuweiba, Sinai Interior',
    region: 'Sinai',
    tag: 'Adventure',
    desc: 'Narrow rock formations with surreal natural colors and light effects.',
    why: 'Morning light turns the canyon walls into living art — oranges, reds, purples.',
    image: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?w=800&q=80',
    number: '18',
  },

  // RED SEA
  {
    id: 19,
    name: 'Wadi El Gemal',
    area: 'Marsa Alam, South Red Sea',
    region: 'Red Sea',
    tag: 'Nature',
    desc: 'Unique mix of desert, sea, mangroves, and wildlife in one nature reserve.',
    why: 'You can see sea turtles, flamingos, and desert foxes in a single afternoon.',
    image: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?w=800&q=80',
    number: '19',
  },
  {
    id: 20,
    name: 'Sharm El Luli',
    area: 'Marsa Alam, Red Sea',
    region: 'Red Sea',
    tag: 'Chill',
    desc: 'One of Egypt\'s most pristine beaches — no resorts, no umbrellas.',
    why: 'Crystal-clear water, white sand, and zero commercialization. Pure paradise.',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80',
    number: '20',
  },
  {
    id: 21,
    name: 'Qulaan Mangrove',
    area: 'Red Sea Coast, South',
    region: 'Red Sea',
    tag: 'Nature',
    desc: 'Shallow water mangrove area where you can literally walk through the sea.',
    why: 'One of the northernmost mangrove ecosystems on Earth — completely surreal.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    number: '21',
  },
  {
    id: 22,
    name: 'Abu Ramada Reef',
    area: 'Hurghada, Red Sea',
    region: 'Red Sea',
    tag: 'Adventure',
    desc: 'A natural "aquarium" reef perfect for easy snorkeling without a dive license.',
    why: 'Thousands of fish in every color — just put your head underwater.',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    number: '22',
  },
  {
    id: 23,
    name: 'Magawish Island',
    area: 'Hurghada, Red Sea',
    region: 'Red Sea',
    tag: 'Chill',
    desc: 'A quieter alternative to the crowded tourist islands near Hurghada.',
    why: 'Fewer day-trippers mean calmer water and better snorkeling visibility.',
    image: 'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?w=800&q=80',
    number: '23',
  },
  {
    id: 24,
    name: 'Wadi Belli',
    area: 'Hurghada, Eastern Desert',
    region: 'Red Sea',
    tag: 'Explorer',
    desc: 'A rare combination of desert landscapes and hidden sea lagoons.',
    why: 'Drive through golden mountains and suddenly arrive at a secret turquoise cove.',
    image: 'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=800&q=80',
    number: '24',
  },

  // EL GOUNA
  {
    id: 25,
    name: 'Fanadir Reef',
    area: 'El Gouna, Red Sea',
    region: 'El Gouna',
    tag: 'Nature',
    desc: 'A calm, clean reef ideal for relaxed snorkeling and marine life watching.',
    why: 'Untouched coral gardens with moray eels and reef sharks — totally calm.',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=800&q=80',
    number: '25',
  },
  {
    id: 26,
    name: 'Abu Tig Marina at Sunrise',
    area: 'El Gouna, Marina',
    region: 'El Gouna',
    tag: 'Luxury',
    desc: 'The marina at 6am is completely empty and cinematic.',
    why: 'Luxury yachts, still water, golden light — and you\'re the only one awake.',
    image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80',
    number: '26',
  },
  {
    id: 27,
    name: 'Mangroovy Hidden Spots',
    area: 'El Gouna, Lagoon Area',
    region: 'El Gouna',
    tag: 'Chill',
    desc: 'Secret quiet corners away from the main beach crowds at Mangroovy.',
    why: 'Walk past the kite school and find private lagoon pockets most people skip.',
    image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?w=800&q=80',
    number: '27',
  },
  {
    id: 28,
    name: 'Sliders Cable Park',
    area: 'El Gouna, Lagoon',
    region: 'El Gouna',
    tag: 'Adventure',
    desc: 'Energetic wakeboarding cable park with a strong local youth scene.',
    why: 'Not just a sport — it\'s a whole social world that most tourists never discover.',
    image: 'https://images.unsplash.com/photo-1530655638484-de9b8e49f8a2?w=800&q=80',
    number: '28',
  },
  {
    id: 29,
    name: 'Gouna Quiet Lagoons',
    area: 'El Gouna, Between Islands',
    region: 'El Gouna',
    tag: 'Luxury',
    desc: 'Private-feeling calm lagoon waters tucked between El Gouna\'s islands.',
    why: 'Paddle there by kayak and you\'ll have crystal water completely to yourself.',
    image: 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80',
    number: '29',
  },
  {
    id: 30,
    name: 'Desert Behind El Gouna',
    area: 'El Gouna, Eastern Desert',
    region: 'El Gouna',
    tag: 'Adventure',
    desc: 'Stunning mountain desert landscapes, especially dramatic at sunset.',
    why: 'Five minutes from a luxury resort, you\'re alone in a vast ancient silence.',
    image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80',
    number: '30',
  },
];

function GemCard({ gem }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative rounded-3xl overflow-hidden cursor-pointer flex-shrink-0 w-72 md:w-80 snap-start group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ height: '420px' }}
    >
      <EditableImage
        src={gem.image}
        alt={gem.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&q=80'; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 transition-all duration-300 group-hover:from-black/95 group-hover:via-black/50" />
      <div className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
        <span className="text-white text-xs font-black">{gem.number}</span>
      </div>
      <div className={`absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${TAG_STYLES[gem.tag] || 'bg-gray-500/10 text-white border-white/20'}`}>
        {gem.tag}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-center gap-1.5 mb-2">
          <MapPin className="w-3 h-3 text-white/60" />
          <span className="text-white/60 text-[10px] font-medium tracking-wide uppercase">{gem.area}</span>
        </div>
        <h3 className="text-white font-black text-lg leading-tight mb-2">{gem.name}</h3>
        <p className="text-white/75 text-xs leading-relaxed mb-3 line-clamp-2">{gem.desc}</p>

        <div className={`transition-all duration-300 overflow-hidden ${hovered ? 'max-h-24 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex items-start gap-2 bg-white/10 backdrop-blur-sm rounded-2xl px-3 py-2.5 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-white text-xs leading-relaxed font-medium">{gem.why}</p>
          </div>
        </div>
        {!hovered && (
          <div className="flex items-center gap-1.5 text-amber-400">
            <Sparkles className="w-3 h-3" />
            <span className="text-[10px] font-bold">Hover to reveal why it's special</span>
          </div>
        )}
      </div>
    </div>
  );
}

function GemCardMobile({ gem }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="relative rounded-3xl overflow-hidden flex-shrink-0 w-64 snap-start"
      style={{ height: '380px' }}
      onClick={() => setExpanded(e => !e)}
    >
      <EditableImage
        src={gem.image}
        alt={gem.name}
        className="absolute inset-0 w-full h-full object-cover"
        onError={e => { e.target.src = 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800&q=80'; }}
      />
      <div className={`absolute inset-0 bg-gradient-to-t transition-all duration-300 ${expanded ? 'from-black/95 via-black/60 to-black/20' : 'from-black/85 via-black/30 to-black/10'}`} />
      <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center">
        <span className="text-white text-[10px] font-black">{gem.number}</span>
      </div>
      <div className={`absolute top-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${TAG_STYLES[gem.tag] || 'bg-gray-500/10 text-white border-white/20'}`}>
        {gem.tag}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="flex items-center gap-1 mb-1">
          <MapPin className="w-2.5 h-2.5 text-white/50" />
          <span className="text-white/50 text-[9px] uppercase tracking-wide">{gem.area}</span>
        </div>
        <h3 className="text-white font-black text-base leading-tight mb-1.5">{gem.name}</h3>
        <p className="text-white/70 text-[11px] leading-relaxed mb-2 line-clamp-2">{gem.desc}</p>

        {expanded ? (
          <div className="flex items-start gap-1.5 bg-white/10 backdrop-blur-sm rounded-xl px-2.5 py-2 border border-white/10">
            <Sparkles className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-white text-[11px] leading-relaxed font-medium">{gem.why}</p>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-amber-400">
            <Sparkles className="w-2.5 h-2.5" />
            <span className="text-[9px] font-bold">Tap to reveal</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HiddenGems() {
  const [activeRegion, setActiveRegion] = useState('All');

  // 1. استدعاء الداتا الحية من الـ PHP API الجديد لجدول hidden_gem_place
  const { data: rawDbGems } = useQuery({
    queryKey: ['hidden-gem-places'],
    queryFn: async () => {
      const apiUrl = `${import.meta.env.VITE_API_BASE_URL}?entity=hidden_gem_place`;
      const res = await fetch(apiUrl);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
  });

  // 2. تأمين كامل لـ المصفوفة القادمة من قاعدة البيانات
  const dbGems = Array.isArray(rawDbGems) ? rawDbGems : [];

  // 3. عمل الماب من أعمدة جدول الـ MySQL لأشكال الكروت بثقة وثبات
  const mappedDbGems = dbGems.map(g => ({
    id: g.id || g.id_index,
    name: g.title,
    area: `${g.city}${g.area ? ', ' + g.area : ''}`,
    region: g.region,
    tag: g.tag,
    desc: g.description,
    why: g.why_special,
    image: g.main_image || (g.photos && typeof g.photos === 'string' ? JSON.parse(g.photos)[0] : '') || 'https://images.unsplash.com/photo-1568322445389-f64ac2515020?w=800&q=80',
    number: String(g.gem_number || '').padStart(2, '0'),
  }));

  const dbNames = new Set(mappedDbGems.map(g => g.name));
  const liveGems = [
    ...GEMS.filter(g => !dbNames.has(g.name)),
    ...mappedDbGems,
  ].sort((a, b) => parseInt(a.number || 0) - parseInt(b.number || 0));

  const filtered = activeRegion === 'All' ? liveGems : liveGems.filter(g => g.region === activeRegion);

  const grouped = activeRegion === 'All'
    ? REGIONS.slice(1).map(r => ({ region: r, gems: liveGems.filter(g => g.region === r) }))
    : [{ region: activeRegion, gems: filtered }];

  const regionEmojis = {
    Luxor: '🏛️',
    Aswan: '⛵',
    Sinai: '🏔️',
    'Red Sea': '🐠',
    'El Gouna': '🌊',
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1539768942893-daf53e448371?w=1600&q=85"
          alt="Hidden Egypt"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-[#0a0a0a]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-5">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-white text-xs font-bold tracking-widest uppercase">Secret Guide — Not for Everyone</span>
          </div>
          <h1 className="text-white font-black text-4xl md:text-6xl leading-tight mb-4">
            30 Hidden Gems<br />
            <span className="text-amber-400">You MUST Visit in Egypt</span>
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-xl leading-relaxed">
            Underrated, untouched, and unforgettable. These are the places locals know and guidebooks ignore.
          </p>
        </div>
      </div>

      {/* Sticky Region Filter */}
      <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/5 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar max-w-4xl mx-auto">
          {REGIONS.map(r => (
            <button
              key={r}
              onClick={() => setActiveRegion(r)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold border transition-all duration-200 ${
                activeRegion === r
                  ? 'bg-amber-400 text-black border-amber-400'
                  : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              {r !== 'All' && <span>{regionEmojis[r]}</span>}
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-12">
        {grouped.map(({ region, gems }) => (
          <div key={region} className="mb-16">
            {activeRegion === 'All' && (
              <div className="flex items-center gap-3 mb-6 px-2">
                <span className="text-3xl">{regionEmojis[region]}</span>
                <div>
                  <h2 className="text-white font-black text-2xl">{region}</h2>
                  <p className="text-white/40 text-xs">{gems.length} hidden gems</p>
                </div>
              </div>
            )}

            {/* Desktop horizontal scroll */}
            <div className="hidden md:flex gap-5 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4 pl-2">
              {gems.map(gem => <GemCard key={gem.id} gem={gem} />)}
            </div>

            {/* Mobile horizontal scroll */}
            <div className="flex md:hidden gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-4 pl-2">
              {gems.map(gem => <GemCardMobile key={gem.id} gem={gem} />)}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      <div className="border-t border-white/5 py-16 text-center px-6">
        <p className="text-white/30 text-xs tracking-widest uppercase mb-3">From the Locals</p>
        <h3 className="text-white font-black text-2xl md:text-3xl mb-4">Ready to go beyond the obvious?</h3>
        <p className="text-white/50 text-sm max-w-md mx-auto mb-6">
          Use Locali to plan your route, check safety, compare prices, and find the real Egypt.
        </p>
        <a href="/" className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-bold px-6 py-3 rounded-full text-sm transition-colors">
          Explore Egypt <ChevronRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
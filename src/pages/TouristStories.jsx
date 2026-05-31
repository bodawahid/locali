import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useSEO } from '../lib/seo';
import SafeNextStep from '../components/SafeNextStep';
import { BookOpen, Plus, ThumbsUp, Shield, AlertTriangle, Star, MapPin, Globe, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

const STORY_TYPES = {
  scam_avoided: { label: 'Scam Avoided', emoji: '🛡️', bg: 'bg-success/10 border-success/20', badge: 'bg-success text-success-foreground' },
  scam_happened: { label: 'Scam Happened', emoji: '⚠️', bg: 'bg-red-500/5 border-red-500/20', badge: 'bg-red-500 text-white' },
  great_experience: { label: 'Great Experience', emoji: '⭐', bg: 'bg-accent/5 border-accent/20', badge: 'bg-accent text-accent-foreground' },
  helpful_local: { label: 'Helpful Local', emoji: '🤝', bg: 'bg-blue-500/5 border-blue-500/20', badge: 'bg-blue-500 text-white' },
  safety_tip: { label: 'Safety Tip', emoji: '💡', bg: 'bg-amber-500/5 border-amber-500/20', badge: 'bg-amber-500 text-white' },
  unexpected_gem: { label: 'Hidden Gem', emoji: '💎', bg: 'bg-purple-500/5 border-purple-500/20', badge: 'bg-purple-500 text-white' },
};

const CITY_LABELS = {
  'sharm-el-sheikh': 'Sharm El Sheikh',
  hurghada: 'Hurghada',
  luxor: 'Luxor',
  aswan: 'Aswan',
  cairo: 'Cairo',
};

// Seed stories shown if DB is empty
const SAMPLE_STORIES = [
  {
    id: 's1', city: 'hurghada', tourist_nationality: '🇩🇪 German', story_type: 'scam_avoided', author_name: 'Klaus M.',
    title: 'Dolphin House fake ticket — avoided at the last second',
    what_happened: 'A man near the marina offered us "Dolphin House tickets" for 300 EGP each. He had a printed flyer with a boat logo. We were about to pay when another tourist who overheard told us he had the same ticket rejected at the dock.',
    how_handled: 'We walked past him to the official marina ticket office, 50m further along. Real tickets were 450 EGP — slightly more expensive — but included genuine boat and full day.',
    lesson_learned: 'Only buy any ticket from behind a desk with official signage. Never from someone approaching you on the street near the marina, even with printed flyers.',
    upvotes: 47,
    is_positive: true,
  },
  {
    id: 's2', city: 'luxor', tourist_nationality: '🇬🇧 British', story_type: 'scam_happened', author_name: 'Sophie T.',
    title: 'The carriage return price tripled — my fault for not agreeing upfront',
    what_happened: 'Hired a horse carriage from Luxor Temple to Karnak for 80 EGP agreed. On the return journey, the driver demanded 250 EGP and refused to move until I paid.',
    how_handled: 'I paid 150 EGP after 20 minutes of argument in the sun. Not ideal but I wanted to get back. Lesson: I should have specified the return price BEFORE leaving.',
    lesson_learned: 'Always agree on ROUND TRIP price before getting in any carriage, calèche, or taxi. Say "rayih w gai?" (round trip?) explicitly and confirm the number.',
    upvotes: 89,
    is_positive: false,
  },
  {
    id: 's3', city: 'aswan', tourist_nationality: '🇫🇷 French', story_type: 'great_experience', author_name: 'Marie L.',
    title: 'The Nubian family who refused to charge us for tea',
    what_happened: 'After visiting a Nubian village by felucca, a family invited us inside for tea. We stayed for 2 hours, met 3 generations, shared food, and learned some Nubian words. When we tried to pay, the grandmother looked almost insulted.',
    how_handled: 'We accepted gracefully, left some Egyptian sweets we had bought earlier as a gift, and exchanged WhatsApp contacts. We still message each other.',
    lesson_learned: 'Not everything in Egypt is a transaction. The Nubian people in Aswan have genuine warmth that\'s completely separate from the tourist economy. Walk gently, give time, and magical things happen.',
    upvotes: 121,
    is_positive: true,
  },
  {
    id: 's4', city: 'sharm-el-sheikh', tourist_nationality: '🇷🇺 Russian', story_type: 'safety_tip', author_name: 'Dmitri K.',
    title: 'How I found a working ATM at 11pm in Naama Bay',
    what_happened: 'Arrived late at night, needed EGP cash urgently. First 3 ATMs I tried were either empty or out of order. This is common during high season.',
    how_handled: 'Walked to the Banque Misr branch on Naama Bay main road (not the standalone ATM — the ATM inside the branch entrance). Machine was loaded, transaction worked first try. 3,000 EGP withdrawn.',
    lesson_learned: 'In Sharm: Banque Misr inside branch > CIB inside mall > standalone ATMs. Always withdraw more than you think you need before weekends — ATMs empty faster then.',
    upvotes: 63,
    is_positive: true,
  },
  {
    id: 's5', city: 'luxor', tourist_nationality: '🇺🇸 American', story_type: 'scam_avoided', author_name: 'Jordan H.',
    title: '"Tomb inspector" demanded I delete photos',
    what_happened: 'Inside the Valley of Kings, a man in a tan shirt (not an official uniform) approached and said I was photographing a restricted tomb and I needed to pay a "fine" of 500 EGP or he would confiscate my phone.',
    how_handled: 'I immediately walked to the nearest uniformed tourist police officer (there are many) and explained the situation. The "inspector" disappeared within 30 seconds.',
    lesson_learned: 'Photography rules in tombs are real (no flash, some tombs no photos). But FINES are ONLY paid at official exit booths, never to individuals in non-uniform clothing. Anyone approaching you for cash directly is scamming you.',
    upvotes: 98,
    is_positive: true,
  },
  {
    id: 's6', city: 'hurghada', tourist_nationality: '🇵🇱 Polish', story_type: 'great_experience', author_name: 'Ania W.',
    title: 'The dive center that gave us a full refund after bad weather',
    what_happened: 'Booked a 2-dive day with a PADI center at the Marina. On the morning, conditions turned bad — strong wind and low visibility. The dive center proactively called us, canceled the trip, and offered a full refund or reschedule.',
    how_handled: 'We rescheduled to the next day. The dives were outstanding — 15m visibility, turtles, and a moray. The center\'s safety-first policy was what made them stand out.',
    lesson_learned: 'Price alone isn\'t the right way to choose a dive center. Look for ones with public safety records and clear cancellation policies posted visibly. The cheapest dive of your life can also be your last.',
    upvotes: 77,
    is_positive: true,
  },
  {
    id: 's7', city: 'aswan', tourist_nationality: '🇩🇪 German', story_type: 'scam_happened', author_name: 'Thomas B.',
    title: 'Felucca "per person" vs "per boat" — the oldest trick in Aswan',
    what_happened: 'Agreed on 100 EGP for a 2-hour felucca ride. Assumed it was per boat for our group of 3. Got on, beautiful ride — then at the end, captain wanted 300 EGP (100 per person).',
    how_handled: 'Paid 100 EGP and left. Captain followed us shouting for 10 minutes. Uncomfortable but I was certain the per-boat price was agreed.',
    lesson_learned: 'In Aswan: ALWAYS say explicitly "miyya gineh lil markib kulla" — "100 pounds for the whole boat." Point at the whole boat. Make him repeat it back. This specific misunderstanding happens to nearly every tourist group at least once.',
    upvotes: 134,
    is_positive: false,
  },
  {
    id: 's8', city: 'sharm-el-sheikh', tourist_nationality: '🇬🇧 British', story_type: 'unexpected_gem', author_name: 'Emma R.',
    title: 'The best meal of the trip was at a place with no English menu',
    what_happened: 'Got lost near the Old Market looking for Fares Fish Restaurant. Ended up at a tiny place with no English sign, run by an older man who spoke no English. Sat down anyway and pointed at what the neighboring table was eating.',
    how_handled: 'He brought us a massive spread of mezze, grilled fish, and fresh bread. Total bill: 110 EGP for two. We went back every day for the rest of the week.',
    lesson_learned: 'The best food in Egyptian tourist cities is never on the tourist strip, never has an English menu, and is usually found by accident. Follow your nose, point at what looks good, and go where locals eat.',
    upvotes: 156,
    is_positive: true,
  },
  {
    id: 's9', city: 'luxor', tourist_nationality: '🇦🇺 Australian', story_type: 'helpful_local', author_name: 'Ben C.',
    title: 'The taxi driver who literally saved us from a scam',
    what_happened: 'A licensed driver we used (Mohamed, from Luxor) was taking us back from Karnak when we mentioned we\'d been approached about a special alabaster factory tour the next morning.',
    how_handled: 'He pulled over and spent 15 minutes explaining exactly how the scam worked — the "educational visit," the blocked exits, the pressure to buy. He wouldn\'t charge us for the detour. Refused to take a tip.',
    lesson_learned: 'Once you find a licensed, honest local contact, treat them like gold. Ask your driver or hotel host about any offer before accepting. Good local knowledge is worth far more than any guidebook.',
    upvotes: 203,
    is_positive: true,
  },
  {
    id: 's10', city: 'sharm-el-sheikh', tourist_nationality: '🇮🇹 Italian', story_type: 'scam_happened', author_name: 'Marco V.',
    title: 'Airport SIM card — same as city but 3x the price',
    what_happened: 'Bought a 15GB Vodafone SIM at the airport kiosk for 420 EGP because I was in a hurry and didn\'t want to think about it. Later found the same SIM was 130 EGP at the official Vodafone store in Naama Bay.',
    how_handled: 'Accepted the loss. Used the SIM for the whole trip. No practical problem — just 290 EGP overpaid.',
    lesson_learned: 'Airport kiosks are not official Vodafone/Orange stores. They\'re independent vendors with 2–3x markup. Use airport WiFi, load Careem, get your taxi, buy the SIM in town the same day. Save 200+ EGP.',
    upvotes: 82,
    is_positive: false,
  },
  {
    id: 's11', city: 'aswan', tourist_nationality: '🇨🇦 Canadian', story_type: 'unexpected_gem', author_name: 'Sarah M.',
    title: 'Abu Simbel at sunrise — worth the 4am alarm',
    what_happened: 'Nobody told me that Abu Simbel is best in the first hour after opening when the light is soft and the buses from Aswan haven\'t arrived yet in force.',
    how_handled: 'We joined the 4am convoy, arrived by 7am, and had about 40 minutes where we were nearly alone with the temples. Photos without crowds. Golden morning light. Ramesses III with nobody photobombing.',
    lesson_learned: 'If you do Abu Simbel, go on the earliest convoy. The additional 400 EGP for a private car to be there at opening is worth it for the first-light experience. By 10am the site is crowded and harsh light.',
    upvotes: 89,
    is_positive: true,
  },
  {
    id: 's12', city: 'hurghada', tourist_nationality: '🇺🇦 Ukrainian', story_type: 'safety_tip', author_name: 'Olena P.',
    title: 'How to get from airport without being scammed — the method that works',
    what_happened: 'Four different men approached me between the plane gate and the exit. Each claimed to be "official transfer." I almost followed the second one.',
    how_handled: 'Ignored all of them, walked to the far end of the arrivals hall (past baggage carousel), and found the clearly signed "Official Taxi Desk" with a list of fixed prices on the board. Paid the exact amount, got a receipt.',
    lesson_learned: 'At Hurghada airport: walk PAST the first line of men approaching you, PAST the small desks near the door, to the official counter with the posted price board. If you can\'t find it, ask a uniformed airport security officer. They\'re always around.',
    upvotes: 112,
    is_positive: true,
  },
  {
    id: 's13', city: 'luxor', tourist_nationality: '🇪🇸 Spanish', story_type: 'great_experience', author_name: 'Carlos R.',
    title: 'Hiring a licensed Egyptologist changed everything',
    what_happened: 'First day in Luxor: went to Karnak alone, got approached by 4 different "guides," felt overwhelmed, understood almost nothing. Second day: hired Mohamed Fathy (government badge) for 1,200 EGP.',
    how_handled: 'Mohamed guided us for 8 hours across Karnak, Luxor Temple, and the East Bank. Explained everything from the hieroglyphs to the political context. Not a single tout approached us. We understood everything.',
    lesson_learned: 'A licensed Egyptologist costs 1,000–1,500 EGP per day. It\'s the best money you\'ll spend in Luxor. They eliminate tout harassment, they unlock meaning, and they know every camera angle. Don\'t go to Luxor without one for at least your first day.',
    upvotes: 167,
    is_positive: true,
  },
  {
    id: 's14', city: 'sharm-el-sheikh', tourist_nationality: '🇧🇪 Belgian', story_type: 'scam_avoided', author_name: 'Pierre D.',
    title: '"Beware fake police fine" — it happened right in Naama Bay',
    what_happened: 'Two men in plain clothes stopped my wife and me, showed a laminated card claiming to be tourist police, and said we had violated a photography law. Demanded 800 EGP "fine" to be paid immediately.',
    how_handled: 'I said "Okay, please take us to the official tourist police station." The moment I said "station" they became much less interested and walked away.',
    lesson_learned: 'Real tourist police wear FULL UNIFORM — not plain clothes. Real fines are processed at police stations or official booths, never cash-in-hand on the street. If someone demands a cash fine, say you want to go to the station. Watch how fast they disappear.',
    upvotes: 145,
    is_positive: true,
  },
  {
    id: 's15', city: 'aswan', tourist_nationality: '🇸🇪 Swedish', story_type: 'great_experience', author_name: 'Lena H.',
    title: 'Aswan is what I wish more of Egypt was',
    what_happened: 'After 5 aggressive days in Luxor, I arrived in Aswan expecting the same. Instead: almost no touts at the train station, felucca captains who quoted real prices, a restaurant owner who told us honestly that the fish was not fresh today.',
    how_handled: 'Stayed 4 days instead of the planned 2. Took 3 felucca rides. Ate dinner at the same Nubian restaurant every night. Went to Philae twice. Barely spent any money.',
    lesson_learned: 'Aswan is genuinely Egypt\'s most relaxed tourist city. If Luxor feels overwhelming, the overnight train to Aswan is the best reset. Give it an extra day — you\'ll thank yourself.',
    upvotes: 178,
    is_positive: true,
  },
  {
    id: 's16', city: 'hurghada', tourist_nationality: '🇳🇱 Dutch', story_type: 'scam_happened', author_name: 'Joost V.',
    title: 'The "free perfume" that cost me 400 EGP and 30 minutes of my life',
    what_happened: 'Near the Marina, a man handed me a small bottle of perfume — said it was a gift from his shop to celebrate their opening. I took it (mistake). He then guided me into the shop and the door closed behind me.',
    how_handled: 'Sat through 30 minutes of pressure. Eventually bought one 80 EGP bottle for 400 EGP just to get out. The bottle was worth maybe 15 EGP.',
    lesson_learned: 'Never accept any item handed to you on the street near tourist markets in Egypt. Not perfume, not papyrus, not a flower. "Free" always means "I now own a piece of your time and attention." Hand it straight back and keep walking.',
    upvotes: 93,
    is_positive: false,
  },
  {
    id: 's17', city: 'luxor', tourist_nationality: '🇷🇺 Russian', story_type: 'safety_tip', author_name: 'Natasha P.',
    title: 'The West Bank ferry is genuinely 5 EGP — fight for it',
    what_happened: 'Walked to the public ferry dock for the West Bank crossing. A man stopped me before the gangway and said the ferry was 50 EGP for foreigners and he was selling advance tickets.',
    how_handled: 'Walked straight past him onto the ferry. A uniformed employee confirmed: 5 EGP, Egyptian and foreign tourist, same price. Fixed rate.',
    lesson_learned: 'The Luxor public ferry is government-operated, 5 EGP flat, for everyone. Anyone selling tickets for it before the gangway is scamming you. The ticket collector is on the boat.',
    upvotes: 116,
    is_positive: true,
  },
  {
    id: 's18', city: 'sharm-el-sheikh', tourist_nationality: '🇵🇱 Polish', story_type: 'helpful_local', author_name: 'Marek K.',
    title: 'Hotel receptionist who saved our whole trip',
    what_happened: 'On day 2, our group was approached by a "tour coordinator" offering us an "exclusive" Ras Mohammed trip for 2,200 EGP per person. We were about to book it.',
    how_handled: 'We mentioned it to our hotel receptionist that evening. She immediately told us it was 600 EGP at the marina ticket office and arranged the booking for us directly.',
    lesson_learned: 'Build a relationship with your hotel reception on day one. Ask them — not tour coordinators on the street — for activity prices. A good receptionist will always tell you the fair price and often book things for you without markup.',
    upvotes: 71,
    is_positive: true,
  },
  {
    id: 's19', city: 'aswan', tourist_nationality: '🇬🇧 British', story_type: 'safety_tip', author_name: 'James W.',
    title: 'Abu Simbel day: budget EVERYTHING in advance',
    what_happened: 'Did Abu Simbel on the 4am convoy. Forgot to budget properly. Temple ticket: 360 EGP. Convoy transport return: 400 EGP. Lunch at Abu Simbel (not cheap): 120 EGP. Tips at temples: 60 EGP. Water: 40 EGP. Total: 980 EGP.',
    how_handled: 'Fortunately had enough cash. Barely.',
    lesson_learned: 'Bring 1,200 EGP cash per person for an Abu Simbel day. There is NO ATM at Abu Simbel. The café has limited stock and charges tourist prices. Budget 360 (ticket) + 400 (transport) + 100 (food/water) + 100 (tips/misc) = minimum 1,000 EGP. Bring more.',
    upvotes: 88,
    is_positive: true,
  },
  {
    id: 's20', city: 'hurghada', tourist_nationality: '🇮🇹 Italian', story_type: 'unexpected_gem', author_name: 'Giulia F.',
    title: 'El Dahar — the Hurghada most tourists never see',
    what_happened: 'Our all-inclusive resort was fine but expensive for anything outside. A staff member (genuinely helpful, not for commission) told us to take a microbus (5 EGP) to El Dahar for dinner.',
    how_handled: 'Took the microbus, ate at a local koshary place for 35 EGP each, walked the market, got fresh juice for 20 EGP. Spent 100 EGP total for 2 people including transport, versus 300+ EGP at any resort restaurant.',
    lesson_learned: 'El Dahar old town is 20 minutes from the resort strip and feels like a completely different country. Local prices, real Egyptian food, friendly non-tourist atmosphere. Every Hurghada tourist should visit at least once.',
    upvotes: 134,
    is_positive: true,
  },
];

const EMPTY_FORM = {
  title: '', city: '', tourist_nationality: '', story_type: 'great_experience',
  what_happened: '', how_handled: '', lesson_learned: '', author_name: '', is_positive: true,
};

function StoryCard({ story }) {
  const [expanded, setExpanded] = useState(false);
  const typeInfo = STORY_TYPES[story.story_type] || { label: story.story_type, emoji: '📖', bg: 'bg-card border-border/50', badge: 'bg-secondary text-foreground' };

  return (
    <div className={`rounded-2xl border p-5 ${typeInfo.bg}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{typeInfo.emoji}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeInfo.badge}`}>{typeInfo.label}</span>
          </div>
          <h3 className="font-extrabold text-sm leading-snug">{story.title}</h3>
        </div>
      </div>

      <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
        {story.tourist_nationality && <span>{story.tourist_nationality}</span>}
        {story.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{CITY_LABELS[story.city] || story.city}</span>}
        {story.author_name && <span>by {story.author_name}</span>}
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-3">{story.what_happened}</p>

      {expanded && (
        <>
          {story.how_handled && (
            <div className="bg-background/50 rounded-xl p-3 mb-3">
              <p className="text-[10px] font-bold text-muted-foreground mb-1">HOW THEY HANDLED IT</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{story.how_handled}</p>
            </div>
          )}
          <div className="bg-background/50 rounded-xl p-3 mb-3">
            <p className="text-[10px] font-bold text-accent mb-1">💡 LESSON LEARNED</p>
            <p className="text-sm font-medium leading-relaxed">{story.lesson_learned}</p>
          </div>
        </>
      )}

      <div className="flex items-center justify-between pt-2">
        <button onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">
          {expanded ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</> : <><ChevronDown className="w-3.5 h-3.5" /> Read full story</>}
        </button>
        {story.upvotes > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{story.upvotes} found this helpful</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TouristStories() {
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const queryClient = useQueryClient();

  useSEO({
    title: 'Real Egypt Tourist Experiences 2026 — Scams, Tips & Honest Stories',
    description: 'Real stories from tourists in Hurghada, Sharm, Luxor, and Aswan. What happened, how they handled it, and what they learned. Honest — good and bad.',
  });

  const { data: dbStories = [], isLoading } = useQuery({
    queryKey: ['stories', selectedCity, selectedType],
    queryFn: () => {
      const filter = {};
      if (selectedCity) filter.city = selectedCity;
      if (selectedType) filter.story_type = selectedType;
      return base44.entities.TouristStory.filter(filter, '-upvotes', 100);
    },
  });

  const stories = dbStories.length > 0 ? dbStories : SAMPLE_STORIES.filter(s =>
    (!selectedCity || s.city === selectedCity) &&
    (!selectedType || s.story_type === selectedType)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await base44.entities.TouristStory.create({ ...form, upvotes: 0, is_verified: false });
    setSubmitting(false);
    setSubmitted(true);
    setShowForm(false);
    setForm(EMPTY_FORM);
    queryClient.invalidateQueries(['stories']);
  };

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const CITIES = [
    { id: '', label: 'All Cities' },
    { id: 'hurghada', label: 'Hurghada' },
    { id: 'sharm-el-sheikh', label: 'Sharm' },
    { id: 'luxor', label: 'Luxor' },
    { id: 'aswan', label: 'Aswan' },
    { id: 'cairo', label: 'Cairo' },
  ];

  const TYPE_FILTERS = [
    { id: '', label: 'All Stories' },
    { id: 'scam_avoided', label: '🛡️ Scam Avoided' },
    { id: 'scam_happened', label: '⚠️ Scam Happened' },
    { id: 'great_experience', label: '⭐ Great Experience' },
    { id: 'helpful_local', label: '🤝 Helpful Local' },
    { id: 'safety_tip', label: '💡 Safety Tip' },
    { id: 'unexpected_gem', label: '💎 Hidden Gem' },
  ];

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center shrink-0">
          <BookOpen className="w-6 h-6 text-amber-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Real Tourist Experiences</h1>
          <p className="text-sm text-muted-foreground">Honest stories — good and bad — from real visitors to Egypt</p>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl p-4 mb-6">
        <p className="text-sm text-muted-foreground leading-relaxed">
          These are real accounts from tourists who visited Egypt. We publish both positive and negative experiences — the good, the bad, and the lessons learned. No filtering for positivity. No sponsored content.
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-3">
        {CITIES.map(c => (
          <button key={c.id} onClick={() => setSelectedCity(c.id)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${selectedCity === c.id ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border'}`}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        {TYPE_FILTERS.map(t => (
          <button key={t.id} onClick={() => setSelectedType(t.id)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${selectedType === t.id ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Story count */}
      <p className="text-xs text-muted-foreground mb-4">{stories.length} stories {selectedCity || selectedType ? 'matching your filter' : 'in total'}</p>

      {isLoading ? (
        <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-border border-t-accent rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-4 mb-8">
          {stories.map((story, i) => <StoryCard key={story.id || i} story={story} />)}
        </div>
      )}

      {/* Submit your story */}
      {submitted && (
        <div className="bg-success/10 border border-success/20 rounded-2xl p-4 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-success" />
          <p className="text-sm font-bold text-success">Your story has been submitted! It will appear after review.</p>
        </div>
      )}

      <button onClick={() => setShowForm(!showForm)}
        className="w-full flex items-center justify-center gap-2 bg-accent text-accent-foreground rounded-2xl p-4 text-sm font-bold mb-4">
        <Plus className="w-4 h-4" />
        Share Your Own Experience
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border p-5 mb-8 space-y-3">
          <h3 className="font-bold text-base">Share Your Experience</h3>
          <p className="text-xs text-muted-foreground">All submissions are reviewed before publishing. Honest stories only — good and bad both welcome.</p>

          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1 block">Story Title *</label>
            <input value={form.title} onChange={e => update('title', e.target.value)} required placeholder="e.g. 'Taxi driver tried to charge me triple at the airport'" className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">City *</label>
              <select value={form.city} onChange={e => update('city', e.target.value)} required className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                <option value="">Select</option>
                {['hurghada', 'sharm-el-sheikh', 'luxor', 'aswan', 'cairo'].map(c => (
                  <option key={c} value={c}>{CITY_LABELS[c]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Story Type *</label>
              <select value={form.story_type} onChange={e => update('story_type', e.target.value)} required className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                {Object.entries(STORY_TYPES).map(([k, v]) => (
                  <option key={k} value={k}>{v.emoji} {v.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Your Nationality</label>
              <input value={form.tourist_nationality} onChange={e => update('tourist_nationality', e.target.value)} placeholder="e.g. 🇩🇪 German" className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground mb-1 block">Your Name (optional)</label>
              <input value={form.author_name} onChange={e => update('author_name', e.target.value)} placeholder="First name or alias" className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1 block">What Happened *</label>
            <textarea value={form.what_happened} onChange={e => update('what_happened', e.target.value)} required rows={3} placeholder="Describe what happened in detail..." className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1 block">How Did You Handle It?</label>
            <textarea value={form.how_handled} onChange={e => update('how_handled', e.target.value)} rows={2} placeholder="What did you do?" className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
          </div>

          <div>
            <label className="text-xs font-bold text-muted-foreground mb-1 block">Lesson Learned *</label>
            <textarea value={form.lesson_learned} onChange={e => update('lesson_learned', e.target.value)} required rows={2} placeholder="What would you tell another tourist?" className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 bg-secondary rounded-xl text-sm font-bold">Cancel</button>
            <button type="submit" disabled={submitting} className="flex-1 py-3 bg-accent text-accent-foreground rounded-xl text-sm font-bold disabled:opacity-50">
              {submitting ? 'Submitting...' : 'Submit Story'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        <SafeNextStep title="Trusted Local Contacts" description="Verified drivers, guides and translators" to="/featured-locals" />
        <SafeNextStep title="Scam Map by City" description="Where scams actually happen and what to watch for" to="/scam-map" />
      </div>
    </div>
  );
}
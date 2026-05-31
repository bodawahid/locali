import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';

const PHRASE_CATEGORIES = [
  { id: 'essential', label: '🌟 Essential' },
  { id: 'transport', label: '🚕 Transport' },
  { id: 'shopping', label: '🛒 Shopping' },
  { id: 'food', label: '🍽️ Food' },
  { id: 'emergency', label: '🚨 Emergency' },
  { id: 'social', label: '👋 Social' },
];

const PHRASES = [
  // Essential
  { cat: 'essential', en: 'No, thank you', arabic: 'لا شكراً', phonetic: 'La shukran', tip: 'Most useful phrase in Egypt. Say it firmly.' },
  { cat: 'essential', en: 'How much?', arabic: 'بكام؟', phonetic: 'Bikam?', tip: 'Always ask before accepting anything.' },
  { cat: 'essential', en: 'Yes', arabic: 'أيوا', phonetic: 'Aiwa', tip: 'Egyptian Arabic — not "na\'am" like formal Arabic.' },
  { cat: 'essential', en: 'No', arabic: 'لا', phonetic: 'La', tip: 'Short, firm. Eye contact not required.' },
  { cat: 'essential', en: 'Please', arabic: 'من فضلك', phonetic: 'Min fadlak (m) / Min fadlik (f)', tip: 'Gender-specific: fadlak for men, fadlik for women.' },
  { cat: 'essential', en: 'Thank you', arabic: 'شكراً', phonetic: 'Shukran', tip: 'Goes a long way with Egyptians.' },
  { cat: 'essential', en: 'Excuse me', arabic: 'لو سمحت', phonetic: 'Law samaht', tip: 'Use to get attention or pass through crowds.' },
  { cat: 'essential', en: "I don't understand", arabic: 'مش فاهم', phonetic: 'Mish fahem (m) / Mish fahma (f)', tip: 'Useful when things get confusing.' },
  { cat: 'essential', en: 'Where is...?', arabic: 'فين...؟', phonetic: 'Fein...?', tip: 'E.g. "Fein el-bank?" = Where is the bank?' },
  { cat: 'essential', en: "I don't want it", arabic: 'مش عايز', phonetic: 'Mish ayez (m) / Mish ayza (f)', tip: 'For persistent vendors. Works well with La shukran.' },
  { cat: 'essential', en: 'Go away / Leave me alone', arabic: 'سيبني', phonetic: 'Seebni', tip: 'Firm but not aggressive. Use when needed.' },
  { cat: 'essential', en: 'I already have a guide', arabic: 'معايا جاي', phonetic: "Ma'aya gay", tip: 'Use near temples to stop unsolicited guides.' },

  // Transport
  { cat: 'transport', en: 'Take me to...', arabic: 'وديني...', phonetic: 'Waddeeni...', tip: 'E.g. "Waddeeni Naama Bay"' },
  { cat: 'transport', en: 'Stop here', arabic: 'وقف هنا', phonetic: "Wa'af hena", tip: 'Important in taxis without meters.' },
  { cat: 'transport', en: 'Use the meter', arabic: 'شغّل العداد', phonetic: 'Shaghghal el-addad', tip: "Most will claim it's broken. Use Careem instead." },
  { cat: 'transport', en: 'How far is it?', arabic: 'بعيدة أوي؟', phonetic: "Ba'eeda awi?", tip: 'Useful before committing to a taxi.' },
  { cat: 'transport', en: 'How much to...?', arabic: 'بكام على...؟', phonetic: 'Bikam ala...?', tip: 'Always ask before getting in.' },
  { cat: 'transport', en: 'Wait for me here', arabic: 'استناني هنا', phonetic: 'Estannani hena', tip: 'Useful when making a quick stop.' },
  { cat: 'transport', en: 'I want to go to the airport', arabic: 'عايز أروح المطار', phonetic: 'Ayez arawwah el-matar', tip: 'Say at the start, not after getting in.' },
  { cat: 'transport', en: 'Is this the right bus?', arabic: 'ده الأتوبيس الصح؟', phonetic: 'Da el-otobees el-sahh?', tip: 'For microbus travel in cities.' },
  { cat: 'transport', en: 'Turn left / Turn right', arabic: 'شمال / يمين', phonetic: 'Shimal / Yimeen', tip: 'Essential for taxi navigation.' },
  { cat: 'transport', en: 'Round trip / return', arabic: 'رايح وجاي', phonetic: 'Rayeh w gay', tip: 'Critical for calèche and felucca prices.' },

  // Shopping
  { cat: 'shopping', en: 'Too expensive', arabic: 'غالي أوي', phonetic: 'Ghali awi', tip: 'Say with a smile. Opens negotiation.' },
  { cat: 'shopping', en: 'Can you do better?', arabic: 'ممكن أحسن من كده؟', phonetic: 'Mumkin ahsan min keda?', tip: 'Polite version of asking for discount.' },
  { cat: 'shopping', en: 'What is your final price?', arabic: 'آخر سعر إيه؟', phonetic: "Akher se'r eh?", tip: "Signals you're ready to buy at right price." },
  { cat: 'shopping', en: "I'm just looking", arabic: 'أنا بتفرج بس', phonetic: 'Ana batfarrag bas', tip: 'Use at shop entrances to avoid pressure.' },
  { cat: 'shopping', en: "I'll think about it", arabic: 'هفكر', phonetic: 'Hafakkar', tip: 'Allows exit without confrontation.' },
  { cat: 'shopping', en: 'Do you have something cheaper?', arabic: 'فيه أرخص؟', phonetic: 'Fi arkhass?', tip: 'Good for starting the price-finding process.' },
  { cat: 'shopping', en: 'I found it cheaper elsewhere', arabic: 'لقيته أرخص في مكان تاني', phonetic: 'La\'eetu arkhass fi makan tani', tip: 'Powerful negotiating tool, real or not.' },

  // Food
  { cat: 'food', en: 'The bill please', arabic: 'الحساب لو سمحت', phonetic: 'El-hesab law samaht', tip: 'Always check the bill carefully.' },
  { cat: 'food', en: 'Bottled water only', arabic: 'مية معدنية بس', phonetic: "Maya ma'adaniyya bas", tip: 'Never drink tap water in Egypt.' },
  { cat: 'food', en: 'No sugar', arabic: 'من غير سكر', phonetic: 'Min gheir sukkar', tip: 'Egyptian tea/coffee comes very sweet.' },
  { cat: 'food', en: 'Delicious!', arabic: 'ألذ من كده', phonetic: 'Laziz / Tamam', tip: 'Makes any restaurant owner happy.' },
  { cat: 'food', en: 'Is this price per person?', arabic: 'ده سعر الواحد؟', phonetic: "Da se'r el-wahid?", tip: 'Important — menus sometimes show per-dish prices.' },
  { cat: 'food', en: 'What do you recommend?', arabic: 'إيه اللي تنصح بيه؟', phonetic: 'Eh elli tensa7 bieh?', tip: 'Locals often know the best dish.' },
  { cat: 'food', en: 'Without meat (vegetarian)', arabic: 'من غير لحم', phonetic: 'Min gheir lahm', tip: 'Egypt has excellent vegetarian options.' },

  // Emergency
  { cat: 'emergency', en: 'Help!', arabic: 'الحقوني!', phonetic: "El-ha'ooni!", tip: 'Shout loudly in any public emergency.' },
  { cat: 'emergency', en: 'I need a doctor', arabic: 'محتاج دكتور', phonetic: 'Mehtag doctor', tip: 'Works in any city.' },
  { cat: 'emergency', en: 'Call the police', arabic: 'اتصل بالبوليس', phonetic: 'Ettesel bel-bolees', tip: 'Tourist Police: 126 (free).' },
  { cat: 'emergency', en: 'I was robbed / scammed', arabic: 'اتسرق مني', phonetic: "Etssara' minni", tip: 'For reporting to Tourist Police.' },
  { cat: 'emergency', en: 'I feel sick', arabic: 'أنا تعبان', phonetic: "Ana ta'aban", tip: 'For immediate medical help.' },
  { cat: 'emergency', en: 'Call an ambulance', arabic: 'اتصل بالإسعاف', phonetic: "Ettesel bel-is'af", tip: 'Ambulance number in Egypt: 123.' },

  // Social
  { cat: 'social', en: 'Hello / Good morning', arabic: 'أهلاً / صباح الخير', phonetic: 'Ahlan / Sabah el-kheir', tip: 'Greeting locals warmly opens doors.' },
  { cat: 'social', en: 'My name is...', arabic: 'اسمي...', phonetic: 'Esmi...', tip: 'Egyptians appreciate personal connection.' },
  { cat: 'social', en: 'I love Egypt', arabic: 'أنا بحب مصر', phonetic: 'Ana bahebb Masr', tip: 'Instantly makes Egyptians warm to you.' },
  { cat: 'social', en: 'Great / Very good', arabic: 'تمام / عظيم', phonetic: 'Tamam / Azeem', tip: '"Tamam" is one of the most used words in Egypt.' },
  { cat: 'social', en: "I don't speak Arabic", arabic: 'أنا مش بتكلم عربي', phonetic: 'Ana mish batkallim arabi', tip: 'Honest and appreciated.' },
  { cat: 'social', en: "Welcome / You're welcome", arabic: 'أهلاً وسهلاً', phonetic: 'Ahlan wa sahlan', tip: 'Egyptians say this constantly and mean it.' },
];

export default function Phrases() {
  const { lang } = useOutletContext();
  const [selectedCat, setSelectedCat] = useState('essential');
  const filtered = PHRASES.filter(p => p.cat === selectedCat);

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center">
          <MessageSquare className="w-6 h-6 text-teal-500" />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight">Arabic Survival Kit</h1>
          <p className="text-sm text-muted-foreground">Practical phrases that will genuinely help you in Egypt</p>
        </div>
      </div>

      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-4 mb-6">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>The single most important phrase:</strong> "La shukran" (No, thank you) — said firmly, without a smile, while walking away. Master this and you'll navigate Egypt like a pro.
        </p>
      </div>

      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        {PHRASE_CATEGORIES.map(cat => (
          <button key={cat.id} onClick={() => setSelectedCat(cat.id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCat === cat.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
            }`}>
            {cat.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((phrase, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
            <p className="text-sm font-bold mb-2">{phrase.en}</p>
            <div className="mb-2">
              <p className="text-2xl font-bold text-foreground" dir="rtl">{phrase.arabic}</p>
              <p className="text-base text-accent font-semibold mt-1">{phrase.phonetic}</p>
            </div>
            {phrase.tip && (
              <p className="text-[11px] text-muted-foreground bg-secondary/60 rounded-lg px-3 py-1.5 mt-2">
                💡 {phrase.tip}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
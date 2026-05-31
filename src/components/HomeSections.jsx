import { Link } from 'react-router-dom';
import {
  CheckSquare, ShieldCheck, ShieldAlert, AlertTriangle, Phone,
  Radio, Car, Hotel, Home, Waves, Utensils, Music, ShoppingBag,
  Anchor, Bot, MessageSquare, DollarSign, Wifi, Globe, Star,
  Users, Building2, Calendar, MapPin, Zap, Baby
} from 'lucide-react';

// ─── 8 Journey Sections ───────────────────────────────────────────────────────

const SECTIONS = [
  {
    id: 'before-land',
    group: '✈️ Before You Land',
    groupRu: '✈️ До прилёта',
    groupDe: '✈️ Vor der Ankunft',
    groupFr: '✈️ Avant d\'atterrir',
    groupAr: '✈️ قبل الوصول',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    desc: 'Prepare before you arrive',
    descRu: 'Подготовьтесь заранее',
    items: [
      { label: 'Visa & Entry', labelRu: 'Виза и въезд', labelDe: 'Visum', labelAr: 'التأشيرة', icon: CheckSquare, path: '/visa-entry', color: 'bg-sky-500/10 text-sky-600', action: 'Check Visa →' },
      { label: 'Airport Tips', labelRu: 'Аэропорт', labelDe: 'Flughafen', labelAr: 'المطار', icon: MapPin, path: '/airport-items', color: 'bg-blue-500/10 text-blue-600', action: 'Read →' },
      { label: 'SIM Cards', labelRu: 'SIM-карты', labelDe: 'SIM-Karten', labelAr: 'شريحة الاتصال', icon: Wifi, path: '/sim-cards', color: 'bg-teal-500/10 text-teal-600', action: 'Best Deals →' },
      { label: 'Currency Rates', labelRu: 'Курс валют', labelDe: 'Wechselkurs', labelAr: 'أسعار العملات', icon: DollarSign, path: '/currency-rates', color: 'bg-emerald-500/10 text-emerald-600', action: 'Live Rate →' },
      { label: 'Packing Guide', labelRu: 'Перед прилётом', labelDe: 'Checkliste', labelAr: 'قبل السفر', icon: CheckSquare, path: '/before-you-land', color: 'bg-indigo-500/10 text-indigo-500', action: 'Checklist →' },
    ],
  },
  {
    id: 'stay-safe',
    group: '🛑 Arrive & Stay Safe',
    groupRu: '🛑 Безопасность',
    groupDe: '🛑 Sicher ankommen',
    groupFr: '🛑 Sécurité',
    groupAr: '🛑 السلامة',
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-100',
    desc: 'Stay protected, avoid scams',
    descRu: 'Защита и безопасность',
    items: [
      { label: 'Safety Guide', labelRu: 'Гид по безопасности', labelDe: 'Sicherheit', labelAr: 'دليل الأمان', icon: ShieldCheck, path: '/safety-guide', color: 'bg-success/10 text-success', action: 'Read Guide →', highlight: true },
      { label: 'Scam Alerts', labelRu: 'Предупреждения', labelDe: 'Betrugswarnungen', labelAr: 'تحذيرات النصب', icon: AlertTriangle, path: '/scam-map', color: 'bg-orange-500/10 text-orange-600', action: 'See Alerts →' },
      { label: "Women's Safety", labelRu: 'Для женщин', labelDe: 'Frauensicherheit', labelAr: 'أمان المرأة', icon: ShieldAlert, path: '/women-safety', color: 'bg-pink-500/10 text-pink-600', action: 'Read →' },
      { label: 'Emergency SOS', labelRu: 'Экстренная помощь', labelDe: 'Notfall SOS', labelAr: 'الطوارئ', icon: Phone, path: '/emergency', color: 'bg-red-500/10 text-red-600', action: 'Get Help →', highlight: true },
      { label: 'Live Situation', labelRu: 'Живая ситуация', labelDe: 'Live-Lage', labelAr: 'الوضع الحالي', icon: Radio, path: '/live-situation', color: 'bg-emerald-500/10 text-emerald-600', action: 'Check Now →' },
    ],
  },
  {
    id: 'get-around',
    group: '🚕 Get Around',
    groupRu: '🚕 Транспорт',
    groupDe: '🚕 Fortbewegung',
    groupFr: '🚕 Se déplacer',
    groupAr: '🚕 التنقل',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    desc: 'Verified drivers & transport',
    descRu: 'Проверенные водители',
    items: [
      { label: 'Local Drivers', labelRu: 'Местные водители', labelDe: 'Lokale Fahrer', labelAr: 'سائقون محليون', icon: Car, path: '/drivers', color: 'bg-amber-500/10 text-amber-700', action: 'Book Driver →', highlight: true },
      { label: 'Price Checker', labelRu: 'Реальные цены', labelDe: 'Preise prüfen', labelAr: 'التحقق من الأسعار', icon: DollarSign, path: '/price-checker', color: 'bg-emerald-500/10 text-emerald-600', action: 'Check Price →' },
      { label: 'Ride Sharing', labelRu: 'Совместные поездки', labelDe: 'Mitfahren', labelAr: 'مشاركة الرحلات', icon: Users, path: '/featured-locals', color: 'bg-sky-500/10 text-sky-600', action: 'Find Ride →' },
    ],
  },
  {
    id: 'where-stay',
    group: '🏠 Where To Stay',
    groupRu: '🏠 Где остановиться',
    groupDe: '🏠 Unterkunft',
    groupFr: '🏠 Hébergement',
    groupAr: '🏠 أين تقيم',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    desc: 'Hotels, apartments & long stays',
    descRu: 'Отели, апартаменты',
    items: [
      { label: 'Hotels', labelRu: 'Отели', labelDe: 'Hotels', labelAr: 'الفنادق', icon: Hotel, path: '/hotels', color: 'bg-blue-500/10 text-blue-600', action: 'Browse →' },
      { label: 'Apartments', labelRu: 'Апартаменты', labelDe: 'Apartments', labelAr: 'شقق', icon: Home, path: '/apartments', color: 'bg-violet-500/10 text-violet-600', action: 'Browse →' },
      { label: 'Long Stay', labelRu: 'Долгосрочно', labelDe: 'Langzeitaufenthalt', labelAr: 'إقامة طويلة', icon: Home, path: '/long-stay', color: 'bg-indigo-500/10 text-indigo-600', action: 'Explore →' },
      { label: 'Tourist Villages', labelRu: 'Курорты', labelDe: 'Ferienorte', labelAr: 'قرى سياحية', icon: Waves, path: '/tourist-villages', color: 'bg-cyan-500/10 text-cyan-600', action: 'View All →' },
    ],
  },
  {
    id: 'things-to-do',
    group: '🎯 Things To Do',
    groupRu: '🎯 Что делать',
    groupDe: '🎯 Aktivitäten',
    groupFr: '🎯 À faire',
    groupAr: '🎯 ماذا تفعل',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
    desc: 'Local experiences & activities',
    descRu: 'Местные впечатления',
    items: [
      { label: 'Restaurants', labelRu: 'Рестораны', labelDe: 'Restaurants', labelAr: 'المطاعم', icon: Utensils, path: '/restaurants', color: 'bg-orange-500/10 text-orange-600', action: 'Find Food →' },
      { label: 'Beaches', labelRu: 'Пляжи', labelDe: 'Strände', labelAr: 'الشواطئ', icon: Waves, path: '/beaches', color: 'bg-cyan-500/10 text-cyan-600', action: 'Explore →' },
      { label: 'Activities', labelRu: 'Активности', labelDe: 'Aktivitäten', labelAr: 'الأنشطة', icon: Star, path: '/temple-trips', color: 'bg-amber-500/10 text-amber-700', action: 'Browse →' },
      { label: 'Water Sports', labelRu: 'Водный спорт', labelDe: 'Wassersport', labelAr: 'رياضات مائية', icon: Anchor, path: '/water-sports', color: 'bg-blue-500/10 text-blue-600', action: 'Book →' },
      { label: 'Boat Trips', labelRu: 'Морские прогулки', labelDe: 'Bootstouren', labelAr: 'رحلات بحرية', icon: Anchor, path: '/boat-trips', color: 'bg-sky-500/10 text-sky-700', action: 'Book →' },
      { label: 'Horse Riding', labelRu: 'Верховая езда', labelDe: 'Reiten', labelAr: 'ركوب الخيل', icon: Star, path: '/horse-riding', color: 'bg-amber-500/10 text-amber-600', action: 'Book →' },
      { label: 'Nightlife', labelRu: 'Ночная жизнь', labelDe: 'Nachtleben', labelAr: 'الحياة الليلية', icon: Music, path: '/nightlife', color: 'bg-purple-500/10 text-purple-600', action: 'Explore →' },
      { label: 'Shopping', labelRu: 'Шоппинг', labelDe: 'Shopping', labelAr: 'التسوق', icon: ShoppingBag, path: '/bazaars', color: 'bg-pink-500/10 text-pink-600', action: 'Browse →' },
      { label: 'Family & Kids', labelRu: 'Семья', labelDe: 'Familie', labelAr: 'العائلة', icon: Baby, path: '/services?category=kids_family', color: 'bg-yellow-500/10 text-yellow-600', action: 'Explore →' },
    ],
  },
  {
    id: 'book',
    group: '💰 Book & Trusted Services',
    groupRu: '💰 Бронирование',
    groupDe: '💰 Buchen',
    groupFr: '💰 Réserver',
    groupAr: '💰 احجز',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    desc: 'Commission-free verified providers',
    descRu: 'Проверенные провайдеры',
    items: [
      { label: 'Book a Tour', labelRu: 'Забронировать тур', labelDe: 'Tour buchen', labelAr: 'احجز جولة', icon: Calendar, path: '/book', color: 'bg-emerald-500/10 text-emerald-700', action: 'Book Now →', highlight: true },
      { label: 'Tour Operators', labelRu: 'Туроператоры', labelDe: 'Reiseveranstalter', labelAr: 'شركات السياحة', icon: Building2, path: '/tour-operators', color: 'bg-green-500/10 text-green-700', action: 'Browse →' },
      { label: 'Trusted Guides', labelRu: 'Гиды', labelDe: 'Reiseführer', labelAr: 'مرشدون', icon: Users, path: '/guides', color: 'bg-teal-500/10 text-teal-700', action: 'Find Guide →' },
      { label: 'Local Contacts', labelRu: 'Местные контакты', labelDe: 'Lokale Kontakte', labelAr: 'جهات محلية', icon: Globe, path: '/verified-contacts', color: 'bg-sky-500/10 text-sky-700', action: 'Browse →' },
      { label: 'Deals & Offers', labelRu: 'Предложения', labelDe: 'Angebote', labelAr: 'عروض', icon: Star, path: '/deals', color: 'bg-accent/10 text-accent', action: 'See Deals →' },
    ],
  },
  {
    id: 'smart-help',
    group: '🧠 Smart Help',
    groupRu: '🧠 Умная помощь',
    groupDe: '🧠 Smart Help',
    groupFr: '🧠 Aide intelligente',
    groupAr: '🧠 مساعدة ذكية',
    color: 'text-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-100',
    desc: 'AI planning + human local knowledge',
    descRu: 'AI-планирование',
    items: [
      { label: 'Locali AI', labelRu: 'Локали AI', labelDe: 'Locali AI', labelAr: 'مساعد الذكاء', icon: Bot, path: '/ai-assistant', color: 'bg-violet-500/10 text-violet-600', action: 'Ask AI →', highlight: true, isAI: true },
      { label: 'Trip Planner', labelRu: 'Планировщик', labelDe: 'Reiseplaner', labelAr: 'مخطط الرحلة', icon: Calendar, path: '/trip-planner', color: 'bg-indigo-500/10 text-indigo-600', action: 'Plan Trip →' },
      { label: 'Smart Guide', labelRu: 'Умный гид', labelDe: 'Smart Guide', labelAr: 'الدليل الذكي', icon: Zap, path: '/smart-guide', color: 'bg-amber-500/10 text-amber-600', action: 'Read →' },
      { label: 'Ask a Local', labelRu: 'Спросить местного', labelDe: 'Einheimischen fragen', labelAr: 'اسأل محلي', icon: MessageSquare, path: '/ask-a-local', color: 'bg-teal-500/10 text-teal-600', action: 'Ask Now →' },
      { label: 'Cost Calculator', labelRu: 'Калькулятор', labelDe: 'Kostenrechner', labelAr: 'حاسبة التكاليف', icon: DollarSign, path: '/cost-calculator', color: 'bg-emerald-500/10 text-emerald-600', action: 'Calculate →' },
    ],
  },
  {
    id: 'live-info',
    group: '📡 Live Info',
    groupRu: '📡 Актуально',
    groupDe: '📡 Live Info',
    groupFr: '📡 En direct',
    groupAr: '📡 معلومات حية',
    color: 'text-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-100',
    desc: 'Real-time city conditions',
    descRu: 'Актуальная ситуация',
    items: [
      { label: 'Live Situation', labelRu: 'Живая ситуация', labelDe: 'Live-Lage', labelAr: 'الوضع الحالي', icon: Radio, path: '/live-situation', color: 'bg-emerald-500/10 text-emerald-600', action: 'Check →', highlight: true },
      { label: 'Arabic Phrases', labelRu: 'Арабские фразы', labelDe: 'Phrasen', labelAr: 'عبارات عربية', icon: MessageSquare, path: '/phrases', color: 'bg-teal-500/10 text-teal-600', action: 'Learn →' },
      { label: 'By Nationality', labelRu: 'По национальности', labelDe: 'Nationalität', labelAr: 'حسب الجنسية', icon: Globe, path: '/nationality-guide', color: 'bg-indigo-500/10 text-indigo-600', action: 'Read →' },
    ],
  },
];

function getLabel(item, lang) {
  if (lang === 'ru') return item.labelRu || item.label;
  if (lang === 'de') return item.labelDe || item.label;
  if (lang === 'fr') return item.labelFr || item.label;
  if (lang === 'ar') return item.labelAr || item.label;
  return item.label;
}

function getGroupLabel(section, lang) {
  if (lang === 'ru') return section.groupRu || section.group;
  if (lang === 'de') return section.groupDe || section.group;
  if (lang === 'fr') return section.groupFr || section.group;
  if (lang === 'ar') return section.groupAr || section.group;
  return section.group;
}

function SectionCard({ section, lang }) {
  return (
    <div className={`rounded-2xl border ${section.border} ${section.bg} p-4`}>
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className={`text-sm font-extrabold ${section.color}`}>
            {getGroupLabel(section, lang)}
          </h2>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {lang === 'ru' ? section.descRu : section.desc}
          </p>
        </div>
      </div>

      {/* Action items */}
      <div className="flex flex-col gap-2">
        {section.items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path + item.label}
              to={item.path}
              className={`flex items-center gap-3 bg-white rounded-xl px-3 py-2.5 border transition-all duration-200 active:scale-98
                ${item.highlight ? 'border-current/20 shadow-sm' : 'border-gray-100 hover:border-gray-200'}
              `}
            >
              <div className={`w-8 h-8 rounded-xl ${item.color} flex items-center justify-center shrink-0 relative`}>
                <Icon className="w-4 h-4" strokeWidth={2.2} />
                {item.isAI && (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-violet-500 rounded-full flex items-center justify-center text-[7px] text-white font-black">✦</span>
                )}
              </div>
              <span className="text-sm font-semibold text-foreground flex-1 leading-tight">
                {getLabel(item, lang)}
              </span>
              <span className={`text-[10px] font-bold shrink-0 ${section.color} opacity-70`}>
                {item.action}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function HomeSections({ lang }) {
  return (
    <div className="space-y-4">
      {SECTIONS.map((section) => (
        <SectionCard key={section.id} section={section} lang={lang} />
      ))}
    </div>
  );
}
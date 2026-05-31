import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/seo';
import { ShieldCheck, DollarSign, AlertTriangle, Users, Utensils, MapPin, Phone, ChevronRight } from 'lucide-react';

const ARAB_COUNTRIES = [
  { name: 'المملكة العربية السعودية', flag: '🇸🇦', id: 'sa' },
  { name: 'الإمارات العربية المتحدة', flag: '🇦🇪', id: 'ae' },
  { name: 'الكويت', flag: '🇰🇼', id: 'kw' },
  { name: 'قطر', flag: '🇶🇦', id: 'qa' },
  { name: 'البحرين', flag: '🇧🇭', id: 'bh' },
  { name: 'سلطنة عُمان', flag: '🇴🇲', id: 'om' },
  { name: 'الأردن', flag: '🇯🇴', id: 'jo' },
  { name: 'لبنان', flag: '🇱🇧', id: 'lb' },
  { name: 'العراق', flag: '🇮🇶', id: 'iq' },
  { name: 'المغرب', flag: '🇲🇦', id: 'ma' },
  { name: 'تونس', flag: '🇹🇳', id: 'tn' },
  { name: 'الجزائر', flag: '🇩🇿', id: 'dz' },
  { name: 'ليبيا', flag: '🇱🇾', id: 'ly' },
  { name: 'السودان', flag: '🇸🇩', id: 'sd' },
  { name: 'اليمن', flag: '🇾🇪', id: 'ye' },
  { name: 'سوريا', flag: '🇸🇾', id: 'sy' },
];

const REAL_PRICES = [
  { item: 'وجبة في مطعم متوسط', price: '150–350 جنيه', usd: '$3–7' },
  { item: 'قهوة عربية / كوفي', price: '60–120 جنيه', usd: '$1.2–2.4' },
  { item: 'تاكسي قصير (5 كم)', price: '60–100 جنيه', usd: '$1.2–2' },
  { item: 'شريحة سيم 15 جيجا', price: '115–130 جنيه', usd: '$2.3' },
  { item: 'دخول موقع أثري', price: '150–500 جنيه', usd: '$3–10' },
  { item: 'ليلة في فندق 4 نجوم', price: '2,000–5,000 جنيه', usd: '$40–100' },
  { item: 'جولة بالفلوكة (ساعة)', price: '200–400 جنيه', usd: '$4–8' },
  { item: 'مياه معدنية (زجاجة)', price: '5–10 جنيه', usd: '$0.1' },
];

const HALAL_RESTAURANTS = [
  {
    city: 'الأقصر',
    name: 'مطعم سوفتيل ونتر بالاس',
    type: 'مطبخ مصري وعربي — حلال 100%',
    price: '300–600 جنيه للشخص',
    note: 'يُقدّم مأكولات مصرية أصيلة. الكحول موجود للآخرين لكن الطعام الحلال مضمون.',
  },
  {
    city: 'الغردقة',
    name: 'مطعم الكورنيش',
    type: 'مشاوي ومأكولات بحرية — حلال',
    price: '150–300 جنيه للشخص',
    note: 'الأنسب للعائلات العربية. لا كحول في القسم الرئيسي.',
  },
  {
    city: 'شرم الشيخ',
    name: 'مطعم الصياد (منطقة الشيخ علي)',
    type: 'مأكولات بحرية حلال',
    price: '200–450 جنيه للشخص',
    note: 'المنطقة المحيطة بها مطاعم عربية وإسلامية كثيرة.',
  },
  {
    city: 'أسوان',
    name: 'مطعم الكنوز النوبية',
    type: 'مطبخ نوبي أصيل — حلال',
    price: '100–200 جنيه للشخص',
    note: 'بجانب النيل. أجواء عائلية رائعة وطعام نوبي لا تجده في أي مكان آخر.',
  },
];

const FAMILY_PLACES = [
  { city: 'الغردقة', place: 'مدينة ألعاب مائية (الغردقة)', desc: 'مناسب للأطفال من 3 سنوات. أسعار مخفضة للأطفال.' },
  { city: 'شرم الشيخ', place: 'منطقة نعمة باي', desc: 'ممشى مناسب للعائلات. أغلب المطاعم تستقبل العائلات.' },
  { city: 'الأقصر', place: 'معبد الأقصر ليلاً', desc: 'جولة ليلية مذهلة مناسبة للأطفال. دخول 150 جنيه.' },
  { city: 'أسوان', place: 'القرية النوبية', desc: 'تجربة ثقافية فريدة. الوصول بالفلوكة. رائعة للأطفال.' },
  { city: 'الجونة', place: 'واجهة الجونة', desc: 'مدينة منظمة وآمنة ومناسبة جداً للعائلات العربية.' },
];

const SCAM_WARNINGS = [
  {
    title: 'احتيال سائقي التاكسي',
    desc: 'دائماً اتفق على السعر قبل الركوب. السعر العادل من المطار للفندق في الغردقة: 150–200 جنيه. إذا طلب أكثر من 500 جنيه فهو يحتال عليك.',
    severity: 'high',
  },
  {
    title: 'مرشدون سياحيون غير معتمدين',
    desc: 'أي شخص يقترب منك أمام المعبد ويعرض "جولة مجانية" — ابتعد. المرشدون المعتمدون لديهم كارنيه رسمي من وزارة السياحة المصرية.',
    severity: 'high',
  },
  {
    title: 'ورق البردي المزيف',
    desc: 'ما يُباع في أغلب البازارات هو ورق الموز وليس البردي الأصلي. الفرق: البردي الأصلي يمكن طيه دون تكسر.',
    severity: 'medium',
  },
  {
    title: 'صرافو الشارع',
    desc: 'لا تصرف مع أي شخص في الشارع حتى لو عرض سعراً أفضل. اذهب للبنوك أو محلات الصرافة الرسمية فقط.',
    severity: 'high',
  },
  {
    title: 'الدعوة لمحلات "الأصدقاء"',
    desc: 'إذا أخذك أي شخص لمحل يقول إنه لأخيه أو صديقه — الأسعار هناك أعلى بكثير والعمولة تذهب للشخص الذي أحضرك.',
    severity: 'medium',
  },
];

const SECTIONS = [
  { id: 'prices', label: 'أسعار حقيقية', icon: DollarSign },
  { id: 'halal', label: 'مطاعم حلال', icon: Utensils },
  { id: 'family', label: 'مناسب للعائلات', icon: Users },
  { id: 'scams', label: 'تحذيرات النصب', icon: AlertTriangle },
  { id: 'services', label: 'خدمات موثوقة', icon: ShieldCheck },
];

export default function ArabTourists() {
  const [section, setSection] = useState('prices');

  useSEO({
    title: 'دليل السياح العرب في مصر 2026 — أسعار حقيقية وخدمات موثوقة',
    description: 'دليل شامل للسياح العرب في مصر: أسعار حقيقية، مطاعم حلال، تحذيرات من النصب، وأماكن مناسبة للعائلات في الغردقة وشرم الشيخ والأقصر وأسوان.',
  });

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="mb-6 text-right">
        <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
          🇪🇬 دليل السياح العرب في مصر
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          دليلك الشامل والحقيقي لزيارة مصر. أسعار حقيقية، تحذيرات من النصب، مطاعم حلال، وأماكن مناسبة للعائلات العربية. كل المعلومات محدّثة لعام 2026.
        </p>
      </div>

      {/* Country flags */}
      <div className="bg-card border border-border/50 rounded-2xl p-4 mb-6">
        <p className="text-xs font-bold text-muted-foreground mb-3 text-right">هذا الدليل مُعدّ لمواطني:</p>
        <div className="flex flex-wrap gap-2 justify-end">
          {ARAB_COUNTRIES.map(c => (
            <div key={c.id} className="flex items-center gap-1 bg-secondary rounded-full px-2 py-1">
              <span className="text-xs font-medium">{c.name}</span>
              <span className="text-sm">{c.flag}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6 flex-row-reverse">
        {SECTIONS.map(s => {
          const Icon = s.icon;
          return (
            <button key={s.id} onClick={() => setSection(s.id)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${section === s.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'}`}>
              <Icon className="w-3 h-3" />
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Real Prices */}
      {section === 'prices' && (
        <div>
          <h2 className="text-xl font-extrabold mb-4 text-right">💰 أسعار حقيقية في مصر 2026</h2>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 mb-4 text-right">
            <p className="text-xs font-medium text-amber-700">
              📌 تذكر: 1 دولار أمريكي = ~50 جنيه مصري · 1 ريال سعودي = ~13 جنيه · 1 درهم إماراتي = ~13.6 جنيه
            </p>
          </div>
          <div className="bg-card border border-border/50 rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-border/30 bg-secondary/50 grid grid-cols-3 text-xs font-bold text-muted-foreground text-right">
              <span>الخدمة</span>
              <span className="text-center">السعر بالجنيه</span>
              <span className="text-left">بالدولار</span>
            </div>
            {REAL_PRICES.map((p, i) => (
              <div key={i} className="px-4 py-3 border-b border-border/20 last:border-0 grid grid-cols-3 items-center">
                <span className="text-sm font-medium text-right">{p.item}</span>
                <span className="text-sm font-bold text-accent text-center">{p.price}</span>
                <span className="text-xs text-muted-foreground text-left">{p.usd}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-success/10 border border-success/20 rounded-2xl p-4 text-right">
            <p className="text-xs text-success font-medium">
              ✅ هل السعر معقول؟ استخدم أداة <a href="/price-checker" className="underline font-bold">فحص الأسعار</a> للتأكد من أنك لا تدفع أكثر من اللازم.
            </p>
          </div>
        </div>
      )}

      {/* Halal Restaurants */}
      {section === 'halal' && (
        <div>
          <h2 className="text-xl font-extrabold mb-4 text-right">🥘 مطاعم حلال موثوقة</h2>
          <div className="bg-card border border-border/50 rounded-2xl p-4 mb-4 text-right">
            <p className="text-sm text-muted-foreground leading-relaxed">
              مصر دولة إسلامية وأغلب مطاعمها حلال. المطاعم في المنتجعات والفنادق الدولية قد تقدم الكحول — لكن الطعام نفسه حلال دائماً. إليك أفضل الخيارات:
            </p>
          </div>
          <div className="space-y-3">
            {HALAL_RESTAURANTS.map((r, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold bg-success/10 text-success px-2 py-0.5 rounded-full">✅ حلال</span>
                  <div className="text-right">
                    <h3 className="font-extrabold text-base">{r.name}</h3>
                    <p className="text-xs text-accent font-bold">{r.city}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground text-right mb-1">{r.type}</p>
                <p className="text-xs font-bold text-foreground text-right mb-2">{r.price}</p>
                <p className="text-xs text-muted-foreground text-right bg-secondary/50 rounded-lg p-2">{r.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Family */}
      {section === 'family' && (
        <div>
          <h2 className="text-xl font-extrabold mb-4 text-right">👨‍👩‍👧 أماكن مناسبة للعائلات</h2>
          <div className="space-y-3">
            {FAMILY_PLACES.map((p, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
                <div className="text-right">
                  <div className="flex items-center justify-end gap-2 mb-1">
                    <h3 className="font-extrabold text-sm">{p.place}</h3>
                    <span className="text-[10px] font-bold bg-accent/10 text-accent px-2 py-0.5 rounded-full">{p.city}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-right">
            <p className="text-xs text-blue-700 font-medium">
              💡 الجونة هي الأنسب للعائلات العربية — مدينة منظمة وهادئة ومعزولة عن الضجيج السياحي.
            </p>
          </div>
        </div>
      )}

      {/* Scam Warnings */}
      {section === 'scams' && (
        <div>
          <h2 className="text-xl font-extrabold mb-4 text-right">⚠️ تحذيرات النصب والاحتيال</h2>
          <div className="space-y-3">
            {SCAM_WARNINGS.map((s, i) => (
              <div key={i} className={`rounded-2xl border p-4 ${s.severity === 'high' ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.severity === 'high' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}`}>
                    {s.severity === 'high' ? 'خطر عالٍ' : 'تحذير'}
                  </span>
                  <h3 className="font-extrabold text-sm text-right">{s.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground text-right leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-right">
            <Link to="/scam-map" className="inline-flex items-center gap-2 text-accent font-bold text-sm">
              <ChevronRight className="w-4 h-4 rotate-180" />
              شاهد كل تقارير النصب على الخريطة
            </Link>
          </div>
        </div>
      )}

      {/* Verified Services */}
      {section === 'services' && (
        <div>
          <h2 className="text-xl font-extrabold mb-4 text-right">✅ خدمات موثوقة للسياح العرب</h2>
          <div className="space-y-3">
            {[
              { title: 'مرشدون سياحيون معتمدون', desc: 'احجز مرشداً يتحدث العربية من قائمتنا المعتمدة.', to: '/guides', cta: 'عرض المرشدين' },
              { title: 'سيارات خاصة بسائق', desc: 'أسعار ثابتة ومتفق عليها مسبقاً. لا مفاجآت.', to: '/services?category=transport', cta: 'حجز سيارة' },
              { title: 'فنادق موثوقة', desc: 'الفنادق التي اختبرناها وتناسب العائلات العربية.', to: '/hotels', cta: 'عرض الفنادق' },
              { title: 'جولات سياحية مُتحقق منها', desc: 'مشغّلو جولات يتكلمون العربية وأسعار ثابتة.', to: '/book', cta: 'احجز جولة' },
              { title: 'أداة فحص الأسعار', desc: 'تحقق إذا كانت الأسعار المطلوبة منك معقولة أم لا.', to: '/price-checker', cta: 'فحص الأسعار' },
            ].map((item, i) => (
              <Link key={i} to={item.to} className="bg-card rounded-2xl border border-border/50 p-4 flex items-center justify-between gap-3 hover:border-accent/50 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="text-accent font-bold text-sm">{item.cta} →</span>
                </div>
                <div className="text-right flex-1">
                  <h3 className="font-extrabold text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
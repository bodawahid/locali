import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useSEO } from '../lib/seo';
import { CITIES } from '../lib/constants';
import { useAuth } from '@/lib/AuthContext';
import AdminLongStayForm from '../components/AdminLongStayForm';
import SafeNextStep from '../components/SafeNextStep';
import {
  Home, CheckCircle2, Wifi, MapPin, ShieldCheck,
  Scale, Wrench, Building2, Car, BookOpen, GraduationCap,
  Heart, PawPrint, Dumbbell, ShoppingCart, Church, ChevronDown, ChevronRight,
  Users, Star, Clock, AlertTriangle, Plus, ArrowRight, Briefcase, ExternalLink
} from 'lucide-react';

const WORK_SOURCES = [
  {
    category: '📋 Official — Work Permit Application',
    items: [
      {
        title: 'GAFI — Obtain a Work Permit (Official Portal)',
        desc: 'Official Egyptian government portal. Submit work permit applications, check prerequisites, fees, and required documents.',
        url: 'https://www.gafi.gov.eg/English/eServices/Pages/DepartmentService.aspx?DSID=40',
        badge: '🏛️ Official Gov',
        badgeColor: 'bg-blue-500/10 text-blue-700 border-blue-200',
      },
      {
        title: 'Ministry of Manpower Egypt — Official Site',
        desc: 'Egyptian Ministry of Manpower — the authority that issues and approves all foreign work permits in Egypt.',
        url: 'https://www.manpower.gov.eg',
        badge: '🏛️ Official Gov',
        badgeColor: 'bg-blue-500/10 text-blue-700 border-blue-200',
      },
    ],
  },
  {
    category: '📰 Legal Updates — New Labor Law 2025',
    items: [
      {
        title: 'EY Tax Alert — Egypt New Labor Law No. 14 of 2025',
        desc: 'Ernst & Young official analysis: Labor Law No. 14 of 2025 effective September 1, 2025. Replaces Law No. 12 of 2003. Key changes for foreign employers.',
        url: 'https://www.ey.com/en_gl/technical/tax-alerts/egypt-enacts-new-labor-law-with-changes-affecting-employers-beginning-1-september-2025',
        badge: '⚖️ Legal Analysis',
        badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-200',
      },
      {
        title: 'Mondaq — Resolution 279/2025: Foreign Work Permit Rules',
        desc: 'Detailed breakdown of Ministry of Labour Resolution 279 of 2025. Conditions, controls, and new framework for foreign worker licensing.',
        url: 'https://www.mondaq.com/employee-rights-labour-relations/1735194/foreign-work-permits-in-egypt-%7C-legal-requirements-under-resolution-279-of-2025',
        badge: '⚖️ Legal Analysis',
        badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-200',
      },
      {
        title: 'Safeguard Global — Egypt 10% Foreign Worker Cap (Decree 279)',
        desc: 'Effective December 2025: Egypt caps foreign workers at 10% of workforce per company. Updated permit rules, fees, and employer reporting requirements.',
        url: 'https://www.safeguardglobal.com/resources/blog/egypt-279-decree-limits-foreign-workers/',
        badge: '⚠️ Key Change',
        badgeColor: 'bg-red-500/10 text-red-700 border-red-200',
      },
      {
        title: 'Sterling Lexicon — New Foreign Worker Law from Sept 2025',
        desc: 'Summary of the September 2025 law changes: waiver of reciprocal treatment, updated permit categories, and compliance timelines.',
        url: 'https://www.sterlinglexicon.com/immigration-blog/new-law-governing-foreign-workers-in-egypt-to-be-introduced-in-september-2025/',
        badge: '⚖️ Legal Summary',
        badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-200',
      },
      {
        title: 'Legal Way Law Firm — Work Permits for Foreign Nationals in Egypt',
        desc: 'Step-by-step guide: GAFI Labor Office submission, Ministry of Manpower approval, 3-week processing, annual validity. Requirements and documents checklist.',
        url: 'https://legalwayfirm.com/work-permits-for-foreign-nationals-in-egypt/',
        badge: '📋 How-To Guide',
        badgeColor: 'bg-green-500/10 text-green-700 border-green-200',
      },
    ],
  },
  {
    category: '💼 Job Boards — Find Work in Egypt',
    items: [
      {
        title: 'Wuzzuf — Remote Jobs in Egypt (3,000+ listings)',
        desc: "Egypt's #1 job platform. 3,000+ remote and on-site jobs updated daily. Filter by field, salary, and experience level.",
        url: 'https://wuzzuf.net/a/remote-Jobs-in-Egypt',
        badge: '🔍 Job Board',
        badgeColor: 'bg-violet-500/10 text-violet-700 border-violet-200',
      },
      {
        title: 'Bayt.com — Remote Jobs in Egypt',
        desc: "Middle East's leading job site. 330+ remote jobs in Egypt updated weekly. Strong for multinational company roles.",
        url: 'https://www.bayt.com/en/egypt/jobs/remote-jobs/',
        badge: '🔍 Job Board',
        badgeColor: 'bg-violet-500/10 text-violet-700 border-violet-200',
      },
      {
        title: 'LinkedIn — Remote Jobs in Egypt (1,000+ roles)',
        desc: '1,000+ remote jobs in Egypt on LinkedIn. Includes international companies hiring Egypt-based workers. Updated daily.',
        url: 'https://www.linkedin.com/jobs/remote-jobs-egypt',
        badge: '🔍 Job Board',
        badgeColor: 'bg-violet-500/10 text-violet-700 border-violet-200',
      },
      {
        title: 'Working Nomads — Remote Egypt Jobs',
        desc: 'Curated list of fully remote jobs open to Egypt-based workers. Tech, marketing, writing, and customer support roles.',
        url: 'https://www.workingnomads.com/remote-egypt-jobs',
        badge: '🌍 Nomad Board',
        badgeColor: 'bg-cyan-500/10 text-cyan-700 border-cyan-200',
      },
    ],
  },
];

// ─── Existing data (preserved) ───────────────────────────────────────────────
const STATIC_SERVICES = {
  'hurghada': [
    { name: 'El Gouna Apartments Direct', category: 'apartment', description: 'Furnished 1–3 bedroom apartments in El Gouna resort area. Monthly and weekly rates. Expat-popular. Full amenities.', price_info: '4,000–12,000 EGP/month', contact_phone: '+201001234567', is_verified: true, languages: ['English', 'Russian', 'German'] },
    { name: 'Clean & Go Hurghada', category: 'cleaning', description: 'Weekly and bi-weekly apartment cleaning service. Expat clients. English-speaking coordinator. Equipment supplied.', price_info: '250–400 EGP per visit', contact_phone: '+201112345678', is_verified: true, languages: ['English', 'Arabic'] },
    { name: 'Seoudi Supermarket Delivery', category: 'grocery_delivery', description: 'Full supermarket delivery to your address. App available. 2-3 hour delivery. Covers most Hurghada areas.', price_info: '25 EGP delivery fee', contact_phone: '+201234567890', is_verified: false, languages: ['Arabic', 'English'] },
    { name: 'Fix It Hurghada', category: 'maintenance', description: 'AC, plumbing, electrical repairs. English-speaking owner. Reliable for expat and long-term tourists. WhatsApp for bookings.', price_info: '200–500 EGP/visit + parts', contact_phone: '+201098765432', is_verified: true, languages: ['English', 'Arabic'] },
    { name: 'WE (Telecom Egypt) Fiber', category: 'internet', description: 'Home internet installation. 30–200 Mbps fiber plans. 1-month minimum contract. ID and lease required.', price_info: '200–600 EGP/month', contact_phone: '888', is_verified: true, languages: ['Arabic'] },
  ],
  'sharm-el-sheikh': [
    { name: 'Naama Bay Furnished Rentals', category: 'apartment', description: 'Monthly apartment rentals in Naama Bay and Hadaba. All utilities included option. Managed by English-speaking agency.', price_info: '5,000–15,000 EGP/month', contact_phone: '+201011122233', is_verified: true, languages: ['English', 'Russian'] },
    { name: 'Sharm Cleaning Services', category: 'cleaning', description: 'Professional cleaning for long-stay guests. Hotel-quality clean. References available. WhatsApp only.', price_info: '300–500 EGP per visit', contact_phone: '+201122233344', is_verified: false, languages: ['Arabic', 'Russian'] },
    { name: 'Carrefour Sharm Delivery', category: 'grocery_delivery', description: 'Carrefour delivers to most Sharm areas within 3–4 hours. Order via app or website. Good selection of imported items.', price_info: '30 EGP delivery fee', contact_phone: '+20800123456', is_verified: true, languages: ['Arabic', 'English'] },
    { name: 'Sharm Tech & Home Fix', category: 'maintenance', description: 'AC, internet, appliance repair. Same-day service available. Has English-speaking technician on staff.', price_info: '200–600 EGP/visit', contact_phone: '+201055566677', is_verified: true, languages: ['English', 'Arabic'] },
  ],
  'luxor': [
    { name: 'West Bank Long Stay Apartments', category: 'apartment', description: 'Traditional house apartments near the West Bank temples. Popular with archaeologists and long-stay tourists. No minimum stay.', price_info: '2,000–5,000 EGP/month', contact_phone: '+201099988877', is_verified: false, languages: ['English', 'Arabic'] },
    { name: 'Luxor Laundry Express', category: 'laundry', description: 'Pick up and deliver laundry service. 24–48 hours. Per kilo pricing. Serves tourist area hotels and apartments.', price_info: '20–30 EGP/kg', contact_phone: '+201088877766', is_verified: false, languages: ['Arabic', 'English'] },
  ],
  'aswan': [
    { name: 'Corniche Furnished Apartments', category: 'apartment', description: 'Nile-view furnished apartments on the Corniche. Very affordable. Local management. Month-to-month.', price_info: '1,500–4,000 EGP/month', contact_phone: '+201077766655', is_verified: false, languages: ['English', 'Arabic'] },
    { name: 'Aswan Grocery Delivery (Local)', category: 'grocery_delivery', description: 'Local grocery delivery WhatsApp service. Text your list, they deliver within 2 hours. Cash on delivery.', price_info: 'Free delivery over 200 EGP', contact_phone: '+201066655544', is_verified: false, languages: ['Arabic'] },
  ],
};

const CATEGORY_LABELS = { apartment: 'Apartment', cleaning: 'Cleaning', maintenance: 'Maintenance', grocery_delivery: 'Grocery Delivery', laundry: 'Laundry', internet: 'Internet', other: 'Other' };
const CATEGORY_ICONS = { apartment: '🏠', cleaning: '🧹', maintenance: '🔧', grocery_delivery: '🛒', laundry: '👕', internet: '📶', other: '📋' };

// ─── New data ─────────────────────────────────────────────────────────────────
const LAWYERS = [
  { name: 'Adv. Mohamed El-Sherif', city: 'hurghada', area: 'Sakkala', languages: ['English', 'Arabic', 'Russian'], specializations: ['Real estate contracts', 'Residency & visa', 'Property disputes'], fee_egp: 500, rating: 4.8, reviews: 34, is_verified: true, years: 15 },
  { name: 'Adv. Nadia Khalil', city: 'hurghada', area: 'Corniche', languages: ['English', 'German', 'Arabic'], specializations: ['Business setup', 'Marriage/divorce for foreigners', 'Real estate'], fee_egp: 600, rating: 4.9, reviews: 28, is_verified: true, years: 12 },
  { name: 'Adv. Youssef Ramadan', city: 'sharm-el-sheikh', area: 'Naama Bay', languages: ['English', 'Arabic', 'Russian'], specializations: ['Residency & visa', 'Criminal defense', 'Property disputes'], fee_egp: 550, rating: 4.7, reviews: 19, is_verified: true, years: 10 },
  { name: 'Adv. Sophie Mansour', city: 'luxor', area: 'Corniche', languages: ['English', 'French', 'Arabic'], specializations: ['Real estate', 'Business setup', 'Marriage/divorce for foreigners'], fee_egp: 400, rating: 4.8, reviews: 15, is_verified: true, years: 8 },
  { name: 'Adv. Ahmed Nasser', city: 'aswan', area: 'City Centre', languages: ['English', 'Arabic'], specializations: ['Real estate contracts', 'Residency & visa', 'Property disputes'], fee_egp: 350, rating: 4.6, reviews: 11, is_verified: false, years: 6 },
];

const HOUSEKEEPING = [
  { name: 'Expat Clean Hurghada', city: 'hurghada', services: ['Regular cleaning', 'Deep cleaning', 'Post-renovation', 'Laundry & ironing', 'Window cleaning'], price_egp: '300–600/visit', languages: ['English', 'Arabic'], rating: 4.8, reviews: 67, is_verified: true, bg_checked: true },
  { name: 'Marina Maids Sharm', city: 'sharm-el-sheikh', services: ['Regular cleaning', 'Deep cleaning', 'Pool cleaning', 'Laundry & ironing'], price_egp: '350–700/visit', languages: ['English', 'Russian', 'Arabic'], rating: 4.7, reviews: 44, is_verified: true, bg_checked: true },
  { name: 'Casa Pulita Hurghada', city: 'hurghada', services: ['Regular cleaning', 'Deep cleaning', 'Window cleaning', 'Laundry & ironing'], price_egp: '280–500/visit', languages: ['English', 'Italian', 'Arabic'], rating: 4.6, reviews: 28, is_verified: false, bg_checked: true },
];

const MAINTENANCE = [
  { name: 'ProFix Hurghada', city: 'hurghada', speciality: 'AC, Plumbing, Electrical', emergency: true, response: '< 2 hours', price_range: '200–800 EGP', languages: ['English', 'Arabic'], rating: 4.8, reviews: 92, is_verified: true, availability: '24/7' },
  { name: 'Sharm Home Tech', city: 'sharm-el-sheikh', speciality: 'AC, Internet & Satellite, Appliances', emergency: true, response: '< 3 hours', price_range: '250–700 EGP', languages: ['English', 'Russian', 'Arabic'], rating: 4.7, reviews: 58, is_verified: true, availability: '24/7' },
  { name: 'Nile Handyman Luxor', city: 'luxor', speciality: 'Plumbing, Carpentry, Painting', emergency: false, response: 'Same day', price_range: '150–500 EGP', languages: ['English', 'Arabic'], rating: 4.5, reviews: 31, is_verified: false, availability: '8:00–20:00' },
  { name: 'Aswan Fix All', city: 'aswan', speciality: 'General handyman, Electrical, AC', emergency: false, response: 'Same day', price_range: '150–450 EGP', languages: ['Arabic', 'English'], rating: 4.4, reviews: 19, is_verified: false, availability: '8:00–19:00' },
];

const REAL_ESTATE = [
  { name: 'Red Sea Properties', city: 'hurghada', years: 12, languages: ['English', 'German', 'Russian', 'Arabic'], areas: ['El Gouna', 'Sahl Hasheesh', 'Marina', 'Sakkala'], types: ['Studio', '1BR', '2BR', '3BR', 'Villa'], price_range: '3,000–30,000 EGP/mo', is_verified: true, rating: 4.8, reviews: 48 },
  { name: 'Naama Real Estate Sharm', city: 'sharm-el-sheikh', years: 8, languages: ['English', 'Russian', 'Arabic'], areas: ['Naama Bay', 'Hadaba', 'Sharks Bay', 'Nabq'], types: ['Studio', '1BR', '2BR'], price_range: '4,000–20,000 EGP/mo', is_verified: true, rating: 4.7, reviews: 33 },
  { name: 'Nile Valley Realty', city: 'luxor', years: 6, languages: ['English', 'French', 'Arabic'], areas: ['West Bank', 'Corniche', 'City Centre'], types: ['Studio', '1BR', '2BR'], price_range: '2,000–8,000 EGP/mo', is_verified: false, rating: 4.5, reviews: 16 },
];

const CAR_RENTALS = [
  { name: 'Expat Wheels Hurghada', city: 'hurghada', daily_egp: '400–900', monthly_egp: '7,000–15,000', with_driver: true, languages: ['English', 'Russian', 'Arabic'], is_verified: true },
  { name: 'Sharm Drive', city: 'sharm-el-sheikh', daily_egp: '450–1,000', monthly_egp: '8,000–18,000', with_driver: true, languages: ['English', 'Arabic'], is_verified: true },
];

const LANG_SCHOOLS = [
  { name: 'Arabic for Expats — Hurghada', city: 'hurghada', price_hour: '200–350 EGP', modes: ['In-person', 'Online'], instruction_langs: ['English', 'Russian', 'German'], is_verified: true },
  { name: 'Nour Arabic School — Sharm', city: 'sharm-el-sheikh', price_hour: '250–400 EGP', modes: ['In-person', 'Online'], instruction_langs: ['English', 'Russian'], is_verified: true },
  { name: 'Hurghada Language Centre', city: 'hurghada', price_hour: '180–300 EGP', modes: ['In-person'], instruction_langs: ['English', 'German', 'French'], is_verified: false },
];

const SERVICES_MORE = {
  banking: [
    { bank: 'Banque Misr', accepts_foreigners: true, docs: ['Passport', 'Visa', 'Address proof'], online: true, note: 'Most foreigner-friendly — English service available' },
    { bank: 'CIB Egypt', accepts_foreigners: true, docs: ['Passport', 'Residence permit or visa', 'Initial deposit 5,000 EGP'], online: true, note: 'Good English support, major international ATMs' },
    { bank: 'Al Ahly Bank (NBE)', accepts_foreigners: true, docs: ['Passport', 'Residence permit'], online: true, note: 'Largest bank in Egypt — branches everywhere' },
    { bank: 'HSBC Egypt', accepts_foreigners: true, docs: ['Passport', 'Visa', 'Proof of income'], online: true, note: 'International clients — English staff' },
  ],
  internet: [
    { provider: 'WE (Telecom Egypt)', speed: 'Up to 400 Mbps fiber', monthly: '200–700 EGP', setup: '3–5 days', docs: ['Passport', 'Lease agreement'], note: 'Best coverage countrywide' },
    { provider: 'Vodafone Home', speed: 'Up to 200 Mbps', monthly: '250–600 EGP', setup: '2–4 days', docs: ['Passport', 'Lease agreement'], note: 'Good in tourist cities' },
    { provider: 'Orange Home', speed: 'Up to 150 Mbps', monthly: '200–550 EGP', setup: '3–5 days', docs: ['Passport', 'Lease agreement'], note: 'Strong in Luxor and Aswan' },
  ],
  gyms: [
    { name: 'Gold\'s Gym Hurghada', city: 'hurghada', monthly_egp: '600–900', day_pass: 80, languages: ['English', 'Arabic'], is_verified: true },
    { name: 'Flex Fitness Sharm', city: 'sharm-el-sheikh', monthly_egp: '700–1,000', day_pass: 100, languages: ['English', 'Russian', 'Arabic'], is_verified: false },
    { name: 'Red Sea Yoga Studio', city: 'hurghada', monthly_egp: '500–800', day_pass: 70, languages: ['English', 'German', 'Russian'], is_verified: false },
  ],
  supermarkets: [
    { name: 'Carrefour Egypt', cities: ['hurghada', 'sharm-el-sheikh', 'cairo'], delivery: true, imported: true, note: 'Best selection of imported products' },
    { name: 'Seoudi Market', cities: ['hurghada'], delivery: true, imported: true, note: 'Popular with expats — European products' },
    { name: 'Spinneys', cities: ['hurghada', 'el-gouna'], delivery: true, imported: true, note: 'Premium imported goods, organic section' },
    { name: 'Metro Market', cities: ['hurghada', 'luxor', 'aswan'], delivery: false, imported: false, note: 'Good prices, basic imported selection' },
  ],
};

const RESIDENT_STEPS = [
  { step: 1, icon: '📱', title: 'Get Your SIM Card', desc: 'Buy a local SIM from Vodafone, Orange, or Etisalat. Bring your passport. Registered SIM required by law.', cost: '200–300 EGP (15GB)', time: '30 minutes', link: '/sim-cards' },
  { step: 2, icon: '🏦', title: 'Open Bank Account', desc: 'Choose CIB or Banque Misr. Bring passport + visa + 5,000 EGP initial deposit. English service available.', cost: '5,000 EGP deposit', time: '1–2 days', link: null },
  { step: 3, icon: '🏠', title: 'Find Accommodation', desc: 'Use Locali Egypt apartments or verified real estate agencies. Always get a written contract.', cost: '2,000–15,000 EGP/mo', time: '1–7 days', link: '/apartments' },
  { step: 4, icon: '🏛️', title: 'Register with Your Embassy', desc: 'Register online or in person. Especially important for stays over 3 months. Provides consular protection.', cost: 'Free', time: '1 day', link: null },
  { step: 5, icon: '📋', title: 'Get Residence Permit', desc: 'Apply at the local Immigration Office (مكتب الجوازات). Bring passport, photos, visa, and rental contract. Renewable annually.', cost: '1,500–3,000 EGP', time: '1–3 weeks', link: '/visa-entry' },
  { step: 6, icon: '⚡', title: 'Set Up Utilities', desc: 'Internet: WE or Vodafone Home (3–5 days). Electricity is in landlord\'s name usually. Gas from cylinder delivery service.', cost: '200–700 EGP/mo total', time: '3–7 days', link: null },
  { step: 7, icon: '🏥', title: 'Find a Doctor', desc: 'Register with a local clinic or hospital. Verify it accepts international patients. Keep emergency numbers saved.', cost: '200–500 EGP consultation', time: '1 day', link: '/emergency' },
  { step: 8, icon: '👥', title: 'Join Expat Community', desc: 'Facebook groups: "Hurghada Expats", "Sharm Foreigners", "Egypt Expats". Invaluable for recommendations and local tips.', cost: 'Free', time: 'Ongoing', link: null },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const LANG_FLAG = { English: '🇬🇧', Russian: '🇷🇺', German: '🇩🇪', French: '🇫🇷', Italian: '🇮🇹', Spanish: '🇪🇸', Arabic: '🇪🇬' };

function stars(r) {
  return Array.from({ length: 5 }, (_, i) => (
    <Star key={i} className={`w-3 h-3 ${i < Math.round(r) ? 'text-amber-400 fill-amber-400' : 'text-border'}`} />
  ));
}

function BookBtn({ label = 'Book Consultation', commission }) {
  const [booked, setBooked] = useState(false);
  return (
    <div>
      <button onClick={() => setBooked(true)} disabled={booked}
        className="flex items-center gap-1.5 bg-accent text-accent-foreground px-4 py-2 rounded-xl text-xs font-bold disabled:opacity-70">
        {booked ? <><CheckCircle2 className="w-3.5 h-3.5" /> Request Sent</> : <>{label}</>}
      </button>
      {commission && <p className="text-[9px] text-muted-foreground mt-0.5">Platform fee: {commission}</p>}
    </div>
  );
}

function Collapsible({ title, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-card rounded-2xl border border-border/50 overflow-hidden mb-3">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-3.5 text-left">
        <span className="font-bold text-sm">{title}</span>
        {open ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && <div className="border-t border-border/20 p-4">{children}</div>}
    </div>
  );
}

// ─── Tab content components ───────────────────────────────────────────────────
function OverviewTab({ city, setCity, category, setCategory, filtered, dbServices, isAdmin, onEdit }) {
  return (
    <>
      <div className="bg-accent/10 border border-accent/20 rounded-2xl p-5 mb-6">
        <h2 className="font-extrabold text-sm mb-3">Why Long-Stay in Egypt Makes Sense</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[{ label: 'Furnished apartment', value: '€80–250/mo' }, { label: 'Utilities (all)', value: '€20–50/mo' }, { label: 'Groceries (1 person)', value: '€100–200/mo' }, { label: 'Total living cost', value: '€300–600/mo' }].map((item, i) => (
            <div key={i} className="bg-background rounded-xl p-3 text-center">
              <p className="text-[10px] text-muted-foreground mb-0.5">{item.label}</p>
              <p className="font-extrabold text-accent text-sm">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-4">
        {CITIES.map(c => (
          <button key={c.id} onClick={() => setCity(c.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${city === c.id ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border text-muted-foreground hover:border-accent/30'}`}>
            {c.name}
          </button>
        ))}
      </div>
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6">
        {['all', 'apartment', 'cleaning', 'maintenance', 'grocery_delivery', 'laundry', 'internet'].map(cat => (
          <button key={cat} onClick={() => setCategory(cat)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${category === cat ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border text-muted-foreground'}`}>
            {cat === 'all' ? 'All Services' : `${CATEGORY_ICONS[cat]} ${CATEGORY_LABELS[cat]}`}
          </button>
        ))}
      </div>
      <div className="space-y-4 mb-8">
        {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground"><Home className="w-8 h-8 mx-auto mb-2 opacity-40" /><p className="text-sm">No services found for this selection.</p></div>
        ) : filtered.map((service, i) => (
        <div key={service.id || i} className="bg-card rounded-2xl border border-border/50 p-5">
          {service.main_image && (
            <div className="relative h-40 rounded-xl overflow-hidden mb-3">
              <img src={service.main_image} alt={service.name} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{CATEGORY_ICONS[service.category]}</span>
                <h3 className="font-bold">{service.name}</h3>
                {service.is_verified && <ShieldCheck className="w-4 h-4 text-success shrink-0" />}
              </div>
              <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full font-bold">{CATEGORY_LABELS[service.category]}</span>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              {service.price_info && <span className="text-sm font-extrabold text-accent">{service.price_info}</span>}
              {isAdmin && service.id && (
                <button onClick={() => onEdit(service)}
                  className="text-[10px] font-bold bg-accent/10 text-accent px-2 py-0.5 rounded-full hover:bg-accent/20 transition-colors">
                  ✏️ Edit
                </button>
              )}
            </div>
          </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{service.description}</p>
            <div className="flex items-center justify-between flex-wrap gap-3">
              {service.languages?.length > 0 && (
                <div className="flex gap-1">{service.languages.map((lang, j) => <span key={j} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{lang}</span>)}</div>
              )}
              <a href={`https://www.google.com/maps/search/${encodeURIComponent(service.name + ' Egypt')}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-secondary border border-border px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-secondary/80">
                📍 Find on Google Maps →
              </a>
            </div>
          </div>
        ))}
      </div>
      <h2 className="text-xl font-extrabold mb-4">Long Stay Practical Tips</h2>
      <div className="space-y-3 mb-6">
        {[
          { tip: 'For apartment rental: always get a written agreement, even informal. Photos of the apartment condition on arrival protect both parties.', icon: '📋' },
          { tip: 'Utilities are typically cheap (200–400 EGP/month) but AC in summer can spike your electricity bill significantly. Ask the landlord about summer bills.', icon: '⚡' },
          { tip: 'Vodafone Egypt home fiber is the most reliable internet option. Installation takes 3–5 days. Monthly rolling contracts available.', icon: '📶' },
          { tip: 'Facebook groups (Hurghada Expats, Sharm El Sheikh Expats) are the best source for apartment recommendations and service referrals from fellow long-stay residents.', icon: '👥' },
          { tip: 'Register your stay with your country\'s embassy if staying 3+ months. Some nationalities must register with local authorities for stays over 30 days.', icon: '🏛️' },
        ].map((item, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4 flex gap-3">
            <span className="text-lg">{item.icon}</span>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.tip}</p>
          </div>
        ))}
      </div>
    </>
  );
}

function LegalTab({ city }) {
  const lawyers = city ? LAWYERS.filter(l => l.city === city) : LAWYERS;
  return (
    <>
      <div className="bg-secondary/50 rounded-2xl p-4 mb-5 text-xs text-muted-foreground">
        <strong className="text-foreground">Platform only:</strong> All consultations booked and paid through Locali Egypt. No direct contact until booking confirmed. Lawyer subscription: $15/month.
      </div>
      {lawyers.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No lawyers listed for this city yet.</p>}
      <div className="space-y-4">
        {lawyers.map((l, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h3 className="font-extrabold">{l.name}</h3>
                  {l.is_verified && <span className="flex items-center gap-1 text-[9px] font-bold bg-success/10 text-success px-1.5 py-0.5 rounded-full"><ShieldCheck className="w-2.5 h-2.5" /> Licensed</span>}
                </div>
                <p className="text-xs text-muted-foreground">{l.area} · {l.years} years experience</p>
                <div className="flex gap-0.5 mt-1">{stars(l.rating)}<span className="text-[10px] text-muted-foreground ml-1">({l.reviews})</span></div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-extrabold text-accent">{l.fee_egp} EGP</p>
                <p className="text-[10px] text-muted-foreground">per consultation</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {l.specializations.map((s, j) => <span key={j} className="text-[10px] bg-blue-500/10 text-blue-700 px-2 py-0.5 rounded-full">{s}</span>)}
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {l.languages.map((lang, j) => <span key={j} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{LANG_FLAG[lang] || ''} {lang}</span>)}
            </div>
            <BookBtn label="Book Consultation" commission="Platform fee included in price" />
          </div>
        ))}
      </div>
      <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
        <p className="text-xs font-bold mb-2">⚠️ Property Buying Scam Alert</p>
        <p className="text-xs text-muted-foreground">Never sign a property contract without a licensed Egyptian lawyer reviewing it first. Foreign buyers have been defrauded by sellers with disputed titles. Always verify at the Real Estate Publicity Department (الشهر العقاري) before any payment.</p>
      </div>
    </>
  );
}

function HousekeepingTab({ city }) {
  const list = city ? HOUSEKEEPING.filter(h => h.city === city) : HOUSEKEEPING;
  return (
    <>
      <div className="bg-secondary/50 rounded-2xl p-4 mb-5 text-xs text-muted-foreground">
        Locali Egypt takes <strong className="text-foreground">10% commission</strong> per booking. All staff are background-checked. No cash to staff — pay through platform.
      </div>
      {list.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No housekeeping services for this city yet.</p>}
      <div className="space-y-4">
        {list.map((h, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-extrabold">{h.name}</h3>
                  {h.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-success" />}
                  {h.bg_checked && <span className="text-[9px] bg-blue-500/10 text-blue-700 px-1.5 py-0.5 rounded-full font-bold">BG Checked</span>}
                </div>
                <div className="flex gap-0.5">{stars(h.rating)}<span className="text-[10px] text-muted-foreground ml-1">({h.reviews})</span></div>
              </div>
              <p className="font-extrabold text-accent text-sm shrink-0">{h.price_egp}</p>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {h.services.map((s, j) => <span key={j} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{s}</span>)}
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {h.languages.map((lang, j) => <span key={j} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{LANG_FLAG[lang] || ''} {lang}</span>)}
            </div>
            <BookBtn label="Book Now" commission="10% platform fee added at checkout" />
          </div>
        ))}
      </div>
    </>
  );
}

function MaintenanceTab({ city }) {
  const list = city ? MAINTENANCE.filter(m => m.city === city) : MAINTENANCE;
  const emergency = list.filter(m => m.emergency);
  const regular = list.filter(m => !m.emergency);
  return (
    <>
      {emergency.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h3 className="font-extrabold text-sm text-red-600">🚨 Emergency — Available Now 24/7</h3>
          </div>
          <div className="space-y-3 mb-6">
            {emergency.map((m, i) => (
              <div key={i} className="bg-red-500/5 border border-red-500/20 rounded-2xl p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <div className="flex items-center gap-2"><h3 className="font-extrabold">{m.name}</h3>{m.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-success" />}</div>
                    <p className="text-xs text-muted-foreground">{m.speciality}</p>
                    <div className="flex items-center gap-1 mt-1"><Clock className="w-3 h-3 text-red-500" /><span className="text-xs font-bold text-red-600">Response: {m.response}</span></div>
                  </div>
                  <div className="text-right"><p className="font-extrabold text-accent text-sm">{m.price_range}</p><p className="text-[10px] text-muted-foreground">{m.availability}</p></div>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">{m.languages.map((l, j) => <span key={j} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{LANG_FLAG[l] || ''} {l}</span>)}</div>
                <div className="flex gap-0.5 mb-3">{stars(m.rating)}<span className="text-[10px] text-muted-foreground ml-1">({m.reviews})</span></div>
                <BookBtn label="Request Emergency Service" commission="10% platform fee" />
              </div>
            ))}
          </div>
        </>
      )}
      {regular.length > 0 && (
        <>
          <h3 className="font-extrabold text-sm mb-3">Scheduled Services</h3>
          <div className="space-y-3">
            {regular.map((m, i) => (
              <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <div className="flex items-center gap-2"><h3 className="font-extrabold">{m.name}</h3>{m.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-success" />}</div>
                    <p className="text-xs text-muted-foreground">{m.speciality}</p>
                    <p className="text-[10px] text-muted-foreground">⏱ {m.response} · {m.availability}</p>
                  </div>
                  <p className="font-extrabold text-accent text-sm shrink-0">{m.price_range}</p>
                </div>
                <div className="flex flex-wrap gap-1 mb-2">{m.languages.map((l, j) => <span key={j} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{LANG_FLAG[l] || ''} {l}</span>)}</div>
                <div className="flex gap-0.5 mb-3">{stars(m.rating)}<span className="text-[10px] text-muted-foreground ml-1">({m.reviews})</span></div>
                <BookBtn label="Request Service" commission="10% platform fee" />
              </div>
            ))}
          </div>
        </>
      )}
      {list.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No maintenance services for this city yet.</p>}
    </>
  );
}

function PropertyTab({ city }) {
  const agencies = city ? REAL_ESTATE.filter(r => r.city === city) : REAL_ESTATE;
  return (
    <>
      <div className="bg-secondary/50 rounded-2xl p-4 mb-5 text-xs text-muted-foreground">
        Locali Egypt earns <strong className="text-foreground">7% on first month's rent</strong> when arranged through the platform. All agencies hold official Egyptian real estate licenses.
      </div>
      {agencies.map((a, i) => (
        <div key={i} className="bg-card rounded-2xl border border-border/50 p-4 mb-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2"><h3 className="font-extrabold">{a.name}</h3>{a.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-success" />}</div>
              <p className="text-xs text-muted-foreground">{a.years} years in business</p>
              <div className="flex gap-0.5 mt-1">{stars(a.rating)}<span className="text-[10px] text-muted-foreground ml-1">({a.reviews} clients)</span></div>
            </div>
            <p className="font-extrabold text-accent text-sm shrink-0 text-right">{a.price_range}</p>
          </div>
          <div className="flex flex-wrap gap-1 mb-1">{a.types.map((t, j) => <span key={j} className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full">{t}</span>)}</div>
          <div className="flex flex-wrap gap-1 mb-1">{a.areas.map((ar, j) => <span key={j} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full flex items-center gap-0.5"><MapPin className="w-2 h-2" />{ar}</span>)}</div>
          <div className="flex flex-wrap gap-1 mb-3">{a.languages.map((l, j) => <span key={j} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{LANG_FLAG[l] || ''} {l}</span>)}</div>
          <BookBtn label="Contact Agency" commission="7% on first month rent" />
        </div>
      ))}
      {agencies.length === 0 && <p className="text-center text-muted-foreground text-sm py-8">No agencies listed for this city.</p>}
      <Collapsible title="📋 Required Documents for Renting as a Foreigner">
        <ul className="space-y-1.5 text-xs text-muted-foreground">
          {['Valid passport (copy + original)', 'Valid visa or residence permit', 'Written rental contract (عقد إيجار) — insist on this', 'Photos of apartment condition before move-in', '1–2 months deposit (standard)', 'Landlord national ID copy'].map((d, i) => (
            <li key={i} className="flex items-start gap-2"><CheckCircle2 className="w-3 h-3 text-success mt-0.5 shrink-0" />{d}</li>
          ))}
        </ul>
      </Collapsible>
      <Collapsible title="⚠️ Rental Scam Alerts for Foreigners">
        <div className="space-y-2 text-xs text-muted-foreground">
          {[
            { title: '"Owner" not present, sends "brother"', desc: 'Always insist on meeting the actual property owner and verifying their national ID matches the deed.' },
            { title: 'Rent in USD/EUR demanded', desc: 'Legal contracts are in EGP. Demanding hard currency is a red flag and may be illegal.' },
            { title: '"It was cheaper for someone else"', desc: 'Prices fluctuate. Always compare 3+ listings. Use Locali Egypt verified agencies only.' },
          ].map((s, i) => (
            <div key={i} className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-2">
              <p className="font-bold text-foreground mb-0.5">⚠️ {s.title}</p>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </Collapsible>
    </>
  );
}

function MoreServicesTab() {
  const [section, setSection] = useState('banking');
  const sections = [
    { id: 'banking', label: '🏦 Banking', icon: Building2 },
    { id: 'cars', label: '🚗 Car Rental', icon: Car },
    { id: 'arabic', label: '📚 Arabic School', icon: BookOpen },
    { id: 'internet', label: '📶 Internet', icon: Wifi },
    { id: 'gyms', label: '💪 Gyms', icon: Dumbbell },
    { id: 'supermarkets', label: '🛒 Supermarkets', icon: ShoppingCart },
    { id: 'religious', label: '⛪ Religious', icon: Church },
    { id: 'pets', label: '🐾 Pets', icon: PawPrint },
  ];
  return (
    <>
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-5">
        {sections.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${section === s.id ? 'bg-primary text-primary-foreground' : 'bg-card border-border text-muted-foreground'}`}>
            {s.label}
          </button>
        ))}
      </div>

      {section === 'banking' && (
        <div className="space-y-3">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3 mb-4 text-xs text-amber-700">⚠️ Never wire money to an unknown Egyptian account. Only use official bank branches for currency exchange.</div>
          {SERVICES_MORE.banking.map((b, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-extrabold">{b.bank}</h3>
                <span className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full font-bold">Accepts Foreigners</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2 italic">{b.note}</p>
              <div className="flex flex-wrap gap-1">
                {b.docs.map((d, j) => <span key={j} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{d}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {section === 'internet' && (
        <div className="space-y-3">
          {SERVICES_MORE.internet.map((p, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-extrabold">{p.provider}</h3>
                <span className="font-extrabold text-accent text-sm">{p.monthly}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{p.speed} · Setup: {p.setup}</p>
              <p className="text-xs italic text-muted-foreground mb-2">{p.note}</p>
              <div className="flex flex-wrap gap-1">{p.docs.map((d, j) => <span key={j} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{d}</span>)}</div>
            </div>
          ))}
        </div>
      )}

      {section === 'cars' && (
        <div className="space-y-3">
          <div className="bg-secondary/50 rounded-xl p-3 mb-3 text-xs text-muted-foreground">Required documents: <strong>Passport + International Driving Permit + valid credit/debit card</strong>. Commission: 10% per booking.</div>
          {CAR_RENTALS.map((c, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
              <div className="flex justify-between items-start mb-1">
                <div><h3 className="font-extrabold">{c.name}</h3>{c.is_verified && <span className="text-[10px] text-success font-bold">✓ Verified</span>}</div>
                <div className="text-right"><p className="text-xs font-bold text-accent">{c.daily_egp} EGP/day</p><p className="text-[10px] text-muted-foreground">{c.monthly_egp} EGP/mo</p></div>
              </div>
              {c.with_driver && <p className="text-xs text-muted-foreground mb-2">✓ With driver option available</p>}
              <div className="flex flex-wrap gap-1 mb-3">{c.languages.map((l, j) => <span key={j} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{LANG_FLAG[l] || ''} {l}</span>)}</div>
              <BookBtn label="Enquire Now" commission="10% platform fee" />
            </div>
          ))}
        </div>
      )}

      {section === 'arabic' && (
        <div className="space-y-3">
          {LANG_SCHOOLS.map((s, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
              <div className="flex justify-between items-start mb-1">
                <div><h3 className="font-extrabold">{s.name}</h3>{s.is_verified && <span className="text-[10px] text-success font-bold">✓ Verified</span>}</div>
                <p className="font-extrabold text-accent">{s.price_hour}/hr</p>
              </div>
              <div className="flex flex-wrap gap-1 mb-2">{s.modes.map((m, j) => <span key={j} className="text-[10px] bg-success/10 text-success px-2 py-0.5 rounded-full">{m}</span>)}</div>
              <div className="flex flex-wrap gap-1 mb-3">{s.instruction_langs.map((l, j) => <span key={j} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{LANG_FLAG[l] || ''} taught in {l}</span>)}</div>
              <BookBtn label="Enquire Now" commission="7% platform fee on enrollment" />
            </div>
          ))}
        </div>
      )}

      {section === 'gyms' && (
        <div className="space-y-3">
          {SERVICES_MORE.gyms.map((g, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-extrabold">{g.name}</h3>
                <div className="text-right"><p className="font-extrabold text-accent">{g.monthly_egp} EGP/mo</p><p className="text-[10px] text-muted-foreground">Day pass: {g.day_pass} EGP</p></div>
              </div>
              <div className="flex flex-wrap gap-1 mb-3">{g.languages.map((l, j) => <span key={j} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{LANG_FLAG[l] || ''} {l}</span>)}</div>
              <BookBtn label="Get Membership" commission="7% platform fee" />
            </div>
          ))}
        </div>
      )}

      {section === 'supermarkets' && (
        <div className="space-y-3">
          {SERVICES_MORE.supermarkets.map((s, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-extrabold">{s.name}</h3>
                <div className="flex gap-1">{s.delivery && <span className="text-[10px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full">🚚 Delivery</span>}{s.imported && <span className="text-[10px] bg-blue-500/10 text-blue-700 px-1.5 py-0.5 rounded-full">🌍 Imported</span>}</div>
              </div>
              <p className="text-xs text-muted-foreground mb-1 italic">{s.note}</p>
              <div className="flex flex-wrap gap-1">{s.cities.map((c, j) => <span key={j} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full capitalize">{c}</span>)}</div>
            </div>
          ))}
        </div>
      )}

      {section === 'religious' && (
        <div className="space-y-3">
          {[
            { name: 'St. Anthony\'s Catholic Church', city: 'Hurghada', lang: 'English, Arabic', schedule: 'Sunday Mass 10:00', type: 'Catholic' },
            { name: 'Orthodox Church of the Resurrection', city: 'Hurghada', lang: 'Coptic, Arabic, Russian', schedule: 'Sunday Liturgy 8:00', type: 'Coptic/Orthodox' },
            { name: 'International Christian Fellowship Sharm', city: 'Sharm El Sheikh', lang: 'English', schedule: 'Friday 6pm', type: 'Non-denominational' },
            { name: 'Masjid Al-Rahma', city: 'Hurghada', lang: 'Arabic, English', schedule: '5 daily prayers', type: 'Mosque' },
            { name: 'Masjid Al-Nour', city: 'Sharm El Sheikh', lang: 'Arabic', schedule: '5 daily prayers + Friday prayer', type: 'Mosque' },
          ].map((r, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-extrabold text-sm">{r.name}</h3>
                <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{r.type}</span>
              </div>
              <p className="text-xs text-muted-foreground">{r.city}</p>
              <p className="text-xs text-muted-foreground">{r.schedule}</p>
              <p className="text-xs text-muted-foreground">{r.lang}</p>
            </div>
          ))}
        </div>
      )}

      {section === 'pets' && (
        <div className="space-y-3">
          <div className="bg-secondary/50 rounded-xl p-3 mb-3 text-xs text-muted-foreground">
            <strong className="text-foreground">Pet import to Egypt:</strong> Requires health certificate (issued ≤10 days before travel), rabies vaccination, and permit from Egyptian Agriculture Ministry. Apply through your Egyptian embassy.
          </div>
          {[
            { name: 'Dr. Ahmed Pet Clinic', city: 'Hurghada', speciality: 'Dogs, cats, exotic pets. English spoken.', price: '200–500 EGP', verified: true },
            { name: 'Red Sea Vet Clinic', city: 'Hurghada', speciality: 'Small animals. Accepts foreign pets. English/Arabic.', price: '180–450 EGP', verified: true },
            { name: 'Sharm Animal Hospital', city: 'Sharm El Sheikh', speciality: 'All pets. English spoken. Emergency service.', price: '250–600 EGP', verified: false },
          ].map((v, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
              <div className="flex justify-between items-start mb-1">
                <div><h3 className="font-extrabold">{v.name}</h3>{v.verified && <span className="text-[10px] text-success font-bold">✓ Verified</span>}</div>
                <p className="font-extrabold text-accent">{v.price}</p>
              </div>
              <p className="text-xs text-muted-foreground">{v.city} · {v.speciality}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function ResidentGuideTab() {
  const [doneSteps, setDoneSteps] = useState(new Set());
  const toggle = (s) => setDoneSteps(prev => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n; });
  const pct = Math.round((doneSteps.size / RESIDENT_STEPS.length) * 100);
  return (
    <>
      <div className="bg-card rounded-2xl border border-border/50 p-4 mb-6">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-extrabold">New Resident Checklist</span>
          <span className={`font-extrabold ${pct === 100 ? 'text-success' : 'text-accent'}`}>{pct}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-success' : 'bg-accent'}`} style={{ width: `${pct}%` }} />
        </div>
        <p className="text-xs text-muted-foreground mt-1.5">{doneSteps.size}/{RESIDENT_STEPS.length} steps completed · Tap each step to mark done</p>
      </div>
      <div className="space-y-3">
        {RESIDENT_STEPS.map((s) => (
          <div key={s.step} onClick={() => toggle(s.step)}
            className={`bg-card rounded-2xl border p-4 cursor-pointer transition-all ${doneSteps.has(s.step) ? 'border-success/40 bg-success/5' : 'border-border/50 hover:border-accent/30'}`}>
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded-full font-bold">Step {s.step}</span>
                  {doneSteps.has(s.step) && <CheckCircle2 className="w-3.5 h-3.5 text-success" />}
                  <h3 className={`font-extrabold text-sm ${doneSteps.has(s.step) ? 'line-through text-muted-foreground' : ''}`}>{s.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">{s.desc}</p>
                <div className="flex flex-wrap gap-3 text-[10px]">
                  <span className="text-accent font-bold">💰 {s.cost}</span>
                  <span className="text-muted-foreground">⏱ {s.time}</span>
                  {s.link && <a href={s.link} onClick={e => e.stopPropagation()} className="text-accent underline">→ Locali guide</a>}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function WorkPermitsTab() {
  return (
    <>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 mb-6 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>New law in effect since September 2025 (Labor Law No. 14/2025) + Decree 279 (December 2025).</strong> Foreign worker rules have changed significantly. Always verify with official sources below before making any decisions.
        </p>
      </div>
      <p className="text-xs text-muted-foreground mb-6">All links below go directly to the issuing authorities or verified legal sources — updated by those sources themselves.</p>
      <div className="space-y-6">
        {WORK_SOURCES.map((section, si) => (
          <div key={si}>
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground mb-3">{section.category}</h3>
            <div className="space-y-3">
              {section.items.map((item, ii) => (
                <a key={ii} href={item.url} target="_blank" rel="noopener noreferrer"
                  className="group flex items-start gap-3 bg-card border border-border/50 rounded-2xl p-4 hover:border-accent/40 hover:shadow-sm transition-all">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="font-bold text-sm text-foreground group-hover:text-accent transition-colors">{item.title}</p>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.badgeColor}`}>{item.badge}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    <p className="text-[10px] text-muted-foreground/50 mt-1.5 truncate">{item.url}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-accent shrink-0 mt-0.5 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function CommunityTab() {
  return (
    <>
      <div className="space-y-3 mb-6">
        <h3 className="font-extrabold text-sm">Expat Facebook Groups by City</h3>
        {[
          { city: 'Hurghada', groups: ['Hurghada Expats', 'Hurghada Foreigners & Friends', 'Hurghada Property & Rentals', 'Hurghada Buy & Sell'] },
          { city: 'Sharm El Sheikh', groups: ['Sharm El Sheikh Expats', 'Sharm Foreigners', 'Living in Sharm', 'Sharm El Sheikh Marketplace'] },
          { city: 'Luxor', groups: ['Luxor Expats & Long-Stay', 'Living in Luxor Egypt'] },
          { city: 'Aswan', groups: ['Aswan Expats', 'Living in Aswan Egypt'] },
          { city: 'El Gouna', groups: ['El Gouna Residents', 'El Gouna Community'] },
        ].map((g, i) => (
          <div key={i} className="bg-card rounded-2xl border border-border/50 p-4">
            <h4 className="font-bold text-sm mb-2">{g.city}</h4>
            <div className="space-y-1">
              {g.groups.map((gr, j) => (
                <div key={j} className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="w-3 h-3 text-accent" />
                  <span>"{gr}" — search on Facebook</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mb-6">
        <h3 className="font-extrabold text-sm mb-3">Classifieds Board</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: '🛒 Items for Sale', desc: 'Furniture, electronics, bikes — from expats leaving Egypt' },
            { label: '🏠 Roommate Search', desc: 'Find flatmates for shared apartments' },
            { label: '💼 Jobs for Foreigners', desc: 'Remote-friendly jobs, diving instructors, teachers' },
            { label: '🔧 Services by Expats', desc: 'Tutoring, translations, IT, photography' },
          ].map((c, i) => (
            <div key={i} className="bg-card rounded-2xl border border-border/50 p-3 text-center">
              <p className="font-bold text-sm mb-1">{c.label}</p>
              <p className="text-[10px] text-muted-foreground">{c.desc}</p>
              <div className="mt-2 text-[10px] text-accent font-bold">Coming soon</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-success/10 border border-success/20 rounded-2xl p-4 text-xs text-muted-foreground">
        <strong className="text-foreground">Tip:</strong> The real expat community lives on Facebook, WhatsApp groups, and at certain cafes and beach clubs. Ask your building manager or the nearest expat-owned café for the best local contacts.
      </div>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'overview', label: '🏠 Overview', icon: Home },
  { id: 'legal', label: '⚖️ Lawyers', icon: Scale },
  { id: 'housekeeping', label: '🧹 Cleaning', icon: Wrench },
  { id: 'maintenance', label: '🔧 Repairs', icon: Wrench },
  { id: 'property', label: '🏢 Property', icon: Building2 },
  { id: 'work', label: '💼 Work Permits', icon: Briefcase },
  { id: 'more', label: '➕ More', icon: Plus },
  { id: 'guide', label: '📋 New Resident', icon: CheckCircle2 },
  { id: 'community', label: '👥 Community', icon: Users },
];

export default function LongStay() {
  const [city, setCity] = useState('hurghada');
  const [category, setCategory] = useState('all');
  const [tab, setTab] = useState('overview');
  const [showForm, setShowForm] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAdmin = user?.role === 'admin';

  useSEO({
    title: 'Long Stay Egypt 2026 — English Lawyers, Housekeeping, Maintenance, Real Estate for Expats | Hurghada Sharm Luxor Aswan',
    description: 'Complete long-stay guide for foreign residents in Egypt. English-speaking lawyers, verified housekeeping, 24/7 maintenance, real estate, banking, gyms, pets, car rental. Hurghada, Sharm El Sheikh, Luxor, Aswan.',
  });

  const { data: dbServices = [], refetch } = useQuery({
    queryKey: ['long-stay', city],
    queryFn: () => base44.entities.LongStayService.filter({ city }, '-created_date', 30),
  });

  const staticServices = STATIC_SERVICES[city] || [];
  const allServices = [...staticServices, ...dbServices];
  const filtered = category === 'all' ? allServices : allServices.filter(s => s.category === category);

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
          <Home className="w-6 h-6 text-emerald-600" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Long Stay in Egypt</h1>
          <p className="text-sm text-muted-foreground">Lawyers · Housekeeping · Maintenance · Property · Expat Life · 2026</p>
        </div>
        {isAdmin && (
          <button onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-accent text-accent-foreground px-3 py-2 rounded-xl text-xs font-bold hover:opacity-90 shrink-0">
            <Plus className="w-3.5 h-3.5" /> Add Service
          </button>
        )}
      </div>

      {(showForm || editingRecord) && (
        <AdminLongStayForm
          record={editingRecord}
          onSave={() => { setShowForm(false); setEditingRecord(null); queryClient.invalidateQueries(['long-stay']); }}
          onClose={() => { setShowForm(false); setEditingRecord(null); }}
        />
      )}

      {/* City selector (global) */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-5">
        {CITIES.map(c => (
          <button key={c.id} onClick={() => setCity(c.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${city === c.id ? 'bg-accent text-accent-foreground border-accent' : 'bg-card border-border text-muted-foreground hover:border-accent/30'}`}>
            {c.name}
          </button>
        ))}
      </div>

      {/* Tab nav */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2 mb-6">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all ${tab === t.id ? 'bg-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && <OverviewTab city={city} setCity={setCity} category={category} setCategory={setCategory} filtered={filtered} dbServices={dbServices} isAdmin={isAdmin} onEdit={(r) => setEditingRecord(r)} />}
      {tab === 'legal' && <LegalTab city={city} />}
      {tab === 'housekeeping' && <HousekeepingTab city={city} />}
      {tab === 'maintenance' && <MaintenanceTab city={city} />}
      {tab === 'property' && <PropertyTab city={city} />}
      {tab === 'work' && <WorkPermitsTab />}
      {tab === 'more' && <MoreServicesTab />}
      {tab === 'guide' && <ResidentGuideTab />}
      {tab === 'community' && <CommunityTab />}

      <div className="mt-8 space-y-3">
        <SafeNextStep title="Remote Work Spots in Egypt" description="Best cafes and coworking spaces for digital nomads" to="/remote-work" />
        <SafeNextStep title="Egypt Cost Calculator" description="Budget your full stay accurately" to="/cost-calculator" />
      </div>
    </div>
  );
}
import { useState } from 'react';
import { AlertTriangle, CheckCircle2, XCircle, Briefcase, Package } from 'lucide-react';
import SafeNextStep from '../components/SafeNextStep';

// Verified from TSA, EgyptAir, Egypt Customs Authority — April 2026
const ITEMS_GUIDE = [
  {
    category: 'Alcohol & Beverages',
    allowed: '✓ 1 liter max per person',
    details: 'Only 1L of alcoholic drinks allowed. Wine, beer OK. Duty-free available at airport. Liquor is expensive in Egypt — bring if you plan to drink.',
    icon: '🍷',
  },
  {
    category: 'Electronics',
    allowed: '✓ Laptops, phones, cameras (personal use)',
    details: 'No restrictions on personal electronics. Drones: ❌ STRICTLY FORBIDDEN (customs confiscate). GoPro/action cam OK.',
    icon: '📱',
  },
  {
    category: 'Medications',
    allowed: '✓ With prescription & original bottle',
    details: 'Bring original pharmacy bottles. Controlled substances need embassy letter. Declare if 3+ months supply.',
    icon: '💊',
  },
  {
    category: 'Cash',
    allowed: '✓ Declaration above 10,000 USD',
    details: 'No limit on amount, but must declare if >$10,000 or equivalent. Bring receipts if questioned.',
    icon: '💵',
  },
  {
    category: 'Food & Spices',
    allowed: '✓ Processed food; ❌ Fresh food',
    details: 'Canned goods, spices, chocolates OK. NO fresh fruit, meat, dairy. Egypt has plenty of fresh produce anyway.',
    icon: '🍫',
  },
  {
    category: 'Books & Religious Items',
    allowed: '✓ Most OK; ❌ Extremist materials',
    details: 'Bible, Quran OK for personal use. Avoid extremist literature. Books in Arabic scrutinized more.',
    icon: '📚',
  },
  {
    category: 'Clothing & Shoes',
    allowed: '✓ Personal use; ❌ Bulk items',
    details: 'A few outfits OK. 10+ of same item looks like commercial goods → customs may charge duty.',
    icon: '👕',
  },
  {
    category: 'Sports Equipment',
    allowed: '✓ Personal use',
    details: 'Snorkel gear, hiking boots, yoga mat OK. Guns, weapons: ❌ strictly forbidden.',
    icon: '⛸️',
  },
  {
    category: 'Toiletries',
    allowed: '✓ Personal quantities',
    details: '5L total of liquids/gels (100ml bottles for carry-on). Bring travel sizes to be safe.',
    icon: '🧴',
  },
  {
    category: 'Gifts',
    allowed: '✓ Reasonable value',
    details: 'Small gifts OK. High-value items may incur duty. Gifts for personal friends exempt.',
    icon: '🎁',
  },
];

const PROHIBITED = [
  '🚫 Drones (any size — confiscated immediately)',
  '🚫 Weapons, firearms, ammunition',
  '🚫 Explosives, flares, fireworks',
  '🚫 Fresh meat, dairy, eggs',
  '🚫 Large quantities of the same item (looks commercial)',
  '🚫 Pornography',
  '🚫 Extremist materials',
  '🚫 Counterfeit goods',
];

const AIRPORT_TIPS = [
  { tip: 'Know the duty-free allowance', detail: '1L alcohol, 200 cigarettes, reasonable personal goods. Anything extra = duty.' },
  { tip: 'Keep receipts', detail: 'If customs question your items, receipts prove personal use.' },
  { tip: 'Pack smartly', detail: 'Expensive electronics should be declared (prove you\'re taking them back).' },
  { tip: 'Declare cash above 10k USD', detail: 'Very important. Failing to declare can cause serious problems.' },
  { tip: 'Cairo Airport (CAI) is strictest', detail: 'Red Sea airports (HRG, SSH) more relaxed but still check.' },
];

export default function AirportItems() {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? ITEMS_GUIDE : filter === 'allowed' ? ITEMS_GUIDE.filter(i => i.allowed.includes('✓')) : ITEMS_GUIDE.filter(i => i.allowed.includes('❌'));

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center"><Package className="w-6 h-6 text-amber-600" /></div>
        <div><h1 className="text-2xl font-black">Airport Customs Guide</h1><p className="text-xs text-gray-500">What you can/cannot bring to Egypt — April 2026</p></div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 mb-6 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-red-800 mb-1">⚠️ Drones Are Strictly Forbidden</p>
          <p className="text-xs text-red-700">ANY drone (including small DJI) will be confiscated at customs. This is enforced 100%. Don't bring one.</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        <button onClick={() => setFilter('all')}
          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'bg-card border-border'}`}>
          📋 All Items
        </button>
        <button onClick={() => setFilter('allowed')}
          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${filter === 'allowed' ? 'bg-green-500 text-white border-green-500' : 'bg-card border-border'}`}>
          ✓ Allowed
        </button>
        <button onClick={() => setFilter('prohibited')}
          className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${filter === 'prohibited' ? 'bg-red-500 text-white border-red-500' : 'bg-card border-border'}`}>
          ✗ Prohibited
        </button>
      </div>

      <div className="space-y-3 mb-10">
        {filtered.map((item, i) => (
          <div key={i} className={`rounded-2xl border p-4 ${item.allowed.includes('✓') ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
            <div className="flex items-start gap-3 mb-2">
              <span className="text-2xl">{item.icon}</span>
              <div className="flex-1">
                <h3 className="font-bold text-sm">{item.category}</h3>
                <p className={`text-xs font-bold ${item.allowed.includes('✓') ? 'text-green-700' : 'text-red-700'}`}>{item.allowed}</p>
              </div>
            </div>
            <p className="text-xs text-gray-600 ml-11">{item.details}</p>
          </div>
        ))}
      </div>

      <div className="mb-8">
        <h2 className="font-extrabold text-sm mb-3">🚫 Strictly Prohibited</h2>
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <ul className="space-y-1">
            {PROHIBITED.map((item, i) => (
              <li key={i} className="text-xs text-red-700">{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-extrabold text-sm mb-3">💡 Pro Tips</h2>
        <div className="grid md:grid-cols-2 gap-3">
          {AIRPORT_TIPS.map((t, i) => (
            <div key={i} className="bg-blue-50 border border-blue-200 rounded-xl p-3">
              <p className="text-xs font-bold text-blue-800 mb-1">{t.tip}</p>
              <p className="text-xs text-blue-600">{t.detail}</p>
            </div>
          ))}
        </div>
      </div>

      <SafeNextStep title="Before You Land Checklist" description="Complete pre-arrival guide" to="/before-you-land" />
    </div>
  );
}
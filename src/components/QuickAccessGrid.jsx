import { Link } from 'react-router-dom';
import { DollarSign, AlertTriangle, Map, Calculator, CheckSquare, MessageSquare, ShieldAlert, Sparkles } from 'lucide-react';
import { t } from '../lib/constants';

const QUICK_ITEMS = [
  { key: 'price_checker', icon: DollarSign, path: '/price-checker', color: 'bg-accent/10 text-accent' },
  { key: 'scam_map', icon: AlertTriangle, path: '/scam-map', color: 'bg-red-500/10 text-red-500' },
  { key: 'services', icon: Map, path: '/services', color: 'bg-blue-500/10 text-blue-500' },
  { key: 'cost_calculator', icon: Calculator, path: '/cost-calculator', color: 'bg-emerald-500/10 text-emerald-600' },
  { key: 'before_you_land', icon: CheckSquare, path: '/before-you-land', color: 'bg-purple-500/10 text-purple-500' },
  { key: 'phrases', icon: MessageSquare, path: '/phrases', color: 'bg-teal-500/10 text-teal-500' },
  { key: 'women_safety', icon: ShieldAlert, path: '/women-safety', color: 'bg-pink-500/10 text-pink-500' },
  { key: 'deals', icon: Sparkles, path: '/deals', color: 'bg-amber-500/10 text-amber-600' },
];

export default function QuickAccessGrid({ lang }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {QUICK_ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.key}
            to={item.path}
            className="flex flex-col items-center gap-2 group"
          >
            <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}>
              <Icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-semibold text-center text-muted-foreground leading-tight">
              {t(item.key, lang)}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
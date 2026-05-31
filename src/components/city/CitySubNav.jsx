import { Link, useLocation } from 'react-router-dom';
import { DollarSign, AlertTriangle, UtensilsCrossed, Map, Car, CreditCard, Shield } from 'lucide-react';

const SUB_PAGES = [
  { slug: 'prices', label: 'Real Prices', icon: DollarSign },
  { slug: 'scams', label: 'Scams', icon: AlertTriangle },
  { slug: 'restaurants', label: 'Restaurants', icon: UtensilsCrossed },
  { slug: 'things-to-do', label: 'Things To Do', icon: Map },
  { slug: 'transport', label: 'Transport', icon: Car },
  { slug: 'atm-currency', label: 'ATMs & Money', icon: CreditCard },
  { slug: 'safety', label: 'Safety', icon: Shield },
];

export default function CitySubNav({ cityId }) {
  const location = useLocation();

  return (
    <div className="sticky top-[57px] z-30 bg-background/95 backdrop-blur-xl border-b border-border/50">
      <div className="flex overflow-x-auto hide-scrollbar max-w-7xl mx-auto">
        {SUB_PAGES.map(({ slug, label, icon: Icon }) => {
          const path = `/city/${cityId}/${slug}`;
          const isActive = location.pathname === path;
          return (
            <Link
              key={slug}
              to={path}
              className={`flex items-center gap-1.5 shrink-0 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
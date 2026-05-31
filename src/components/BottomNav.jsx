import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Grid3X3, BookmarkCheck, User } from 'lucide-react';

const NAV_ITEMS = [
  { icon: Home, label: 'Home', to: '/' },
  { icon: Search, label: 'Search', to: '/listings' },
  { icon: Grid3X3, label: 'Categories', to: '/services' },
  { icon: BookmarkCheck, label: 'Saved', to: '/my-trips' },
  { icon: User, label: 'Profile', to: '/about' },
];

export default function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg md:hidden">
      <div className="flex items-center justify-around py-2">
        {NAV_ITEMS.map(({ icon: Icon, label, to }) => {
          const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${
                active ? 'text-teal-600' : 'text-gray-400'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className={`text-[10px] font-bold ${active ? 'text-teal-600' : 'text-gray-400'}`}>
                {label}
              </span>
              {active && <div className="w-1 h-1 rounded-full bg-teal-500 mt-0.5" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
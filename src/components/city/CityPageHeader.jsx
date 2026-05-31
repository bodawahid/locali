import { Link } from 'react-router-dom';
import { MapPin, ArrowLeft } from 'lucide-react';
import { CITY_META } from '../../lib/cityContent';
import { CITIES } from '../../lib/constants';

export default function CityPageHeader({ cityId }) {
  const meta = CITY_META[cityId];
  const cityData = CITIES.find(c => c.id === cityId);

  return (
    <div className="relative h-48 md:h-64 overflow-hidden">
      {cityData?.image && (
        <img src={cityData.image} alt={meta?.name} className="absolute inset-0 w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute top-4 left-4">
        <Link to={`/city/${cityId}`} className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/50 transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-1.5 mb-1">
          <MapPin className="w-3 h-3 text-accent" />
          <span className="text-[10px] font-bold text-accent uppercase tracking-wider">{meta?.region}</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">{meta?.name}</h1>
      </div>
    </div>
  );
}
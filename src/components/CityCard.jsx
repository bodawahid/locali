import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { getCityName } from '../lib/constants';

export default function CityCard({ city, lang }) {
  return (
    <Link
      to={`/city/${city.id}`}
      className="group relative flex-shrink-0 w-[260px] md:w-auto md:flex-1 aspect-[3/4] md:aspect-[3/2] rounded-2xl overflow-hidden card-3d"
    >
      <img
        src={city.image}
        alt={getCityName(city, lang)}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <div className="flex items-center gap-1.5 mb-1">
          <MapPin className="w-3 h-3 text-accent" />
          <span className="text-[10px] font-bold text-accent uppercase tracking-wider">
            {city.region}
          </span>
        </div>
        <h3 className="text-xl font-extrabold text-white tracking-tight drop-shadow-[0_1px_4px_rgba(0,0,0,0.9)]">
          {getCityName(city, lang)}
        </h3>
      </div>
    </Link>
  );
}
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

const CITY_COORDS = {
  'hurghada': [27.2579, 33.8116],
  'sharm-el-sheikh': [27.9158, 34.3300],
  'luxor': [25.6872, 32.6396],
  'aswan': [24.0889, 32.8998],
};

const SEVERITY_COLOR = {
  high: '#ef4444',
  medium: '#f97316',
  low: '#eab308',
};

const SEVERITY_RADIUS = {
  high: 18,
  medium: 13,
  low: 9,
};

function jitter(coord, index) {
  // Slightly offset markers with same city so they don't all stack
  const seed = index * 0.003;
  return [coord[0] + Math.sin(index * 1.7) * seed, coord[1] + Math.cos(index * 1.3) * seed];
}

export default function ScamHeatMap({ reports }) {
  const mapped = reports
    .map((r, i) => {
      let pos;
      if (r.latitude && r.longitude) {
        pos = [r.latitude, r.longitude];
      } else if (CITY_COORDS[r.city]) {
        pos = jitter(CITY_COORDS[r.city], i);
      }
      return pos ? { ...r, pos } : null;
    })
    .filter(Boolean);

  const center = mapped.length > 0 ? mapped[0].pos : [26.8206, 30.8025];

  if (mapped.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
        <MapPin className="w-10 h-10 mb-3 opacity-30" />
        <p className="font-medium">No reports to display on map</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl overflow-hidden border border-border" style={{ height: 420 }}>
      <MapContainer center={center} zoom={6} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        {mapped.map((r) => (
          <CircleMarker
            key={r.id}
            center={r.pos}
            radius={SEVERITY_RADIUS[r.severity] || 10}
            pathOptions={{
              color: SEVERITY_COLOR[r.severity] || '#eab308',
              fillColor: SEVERITY_COLOR[r.severity] || '#eab308',
              fillOpacity: 0.65,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-xs space-y-1 min-w-[160px]">
                <p className="font-bold text-sm">{r.title}</p>
                <p className="capitalize text-gray-500">{r.category?.replace('_', ' ')}</p>
                {r.location_name && <p>📍 {r.location_name}</p>}
                <p className="capitalize">City: {r.city?.replace('-', ' ')}</p>
                <span
                  className="inline-block px-2 py-0.5 rounded-full text-white text-[10px] font-bold"
                  style={{ background: SEVERITY_COLOR[r.severity] || '#eab308' }}
                >
                  {r.severity?.toUpperCase()} RISK
                </span>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="flex items-center gap-4 px-4 py-2 bg-card border-t border-border text-xs font-semibold">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block" /> High Risk</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500 inline-block" /> Medium</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-400 inline-block" /> Low</span>
      </div>
    </div>
  );
}
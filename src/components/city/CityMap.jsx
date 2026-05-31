import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { CITY_META } from '../../lib/cityContent';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const TYPE_COLORS = {
  restaurant: '#D97706',
  activity: '#2D6A4F',
  transport: '#0A1A2F',
  medical: '#DC2626',
};

export default function CityMap({ cityId, markers = [] }) {
  const meta = CITY_META[cityId];
  if (!meta) return null;

  return (
    <div className="rounded-2xl overflow-hidden border border-border/50" style={{ height: 320 }}>
      <MapContainer
        center={[meta.lat, meta.lng]}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((m, i) => (
          <Marker key={i} position={[m.lat, m.lng]}>
            <Popup>
              <strong>{m.label}</strong>
              {m.type && <div style={{ color: TYPE_COLORS[m.type], fontSize: 11, marginTop: 2, textTransform: 'capitalize' }}>{m.type}</div>}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
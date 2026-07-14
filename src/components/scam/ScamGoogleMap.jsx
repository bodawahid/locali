import { useEffect, useRef, useState } from 'react';
import { AlertTriangle, ExternalLink, MapPin, Navigation } from 'lucide-react';
import { loadGoogleMaps, getGoogleMapsApiKey, googleMapsLink, googleMapsDirections } from '@/lib/googleMaps';
import { CITY_MAP_CENTER } from '@/data/scamHotspots';
import ScamHeatMap from '@/components/ScamHeatMap';

const SEVERITY_LABEL = { high: 'HIGH', medium: 'MEDIUM', low: 'LOW' };

export default function ScamGoogleMap({ markers = [], cityFilter = '', height, className = '' }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRefs = useRef([]);
  const [mapError, setMapError] = useState(null);
  const [selected, setSelected] = useState(null);
  const apiKey = getGoogleMapsApiKey();

  useEffect(() => {
    if (!apiKey || !mapRef.current || !markers.length) return;

    let cancelled = false;

    (async () => {
      try {
        const maps = await loadGoogleMaps();
        if (cancelled || !maps) return;

        const centerCfg = CITY_MAP_CENTER[cityFilter] || CITY_MAP_CENTER.all;

        if (!mapInstance.current) {
          mapInstance.current = new maps.Map(mapRef.current, {
            center: { lat: centerCfg.lat, lng: centerCfg.lng },
            zoom: centerCfg.zoom,
            mapId: 'locali-scam-map',
            disableDefaultUI: false,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
          });
        } else {
          mapInstance.current.setCenter({ lat: centerCfg.lat, lng: centerCfg.lng });
          mapInstance.current.setZoom(centerCfg.zoom);
        }

        markerRefs.current.forEach((m) => m.setMap(null));
        markerRefs.current = [];

        markers.forEach((spot) => {
          const marker = new maps.Marker({
            map: mapInstance.current,
            position: { lat: spot.lat, lng: spot.lng },
            title: spot.title,
            icon: {
              path: maps.SymbolPath.CIRCLE,
              scale: spot.severity === 'high' ? 14 : spot.severity === 'medium' ? 11 : 8,
              fillColor: spot.color || '#ef4444',
              fillOpacity: 0.9,
              strokeColor: '#fff',
              strokeWeight: 2,
            },
          });
          marker.addListener('click', () => setSelected(spot));
          markerRefs.current.push(marker);
        });
      } catch (err) {
        setMapError(err.message);
      }
    })();

    return () => { cancelled = true; };
  }, [apiKey, markers, cityFilter]);

  if (!apiKey) {
    return (
      <div className="space-y-3">
        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
          <p className="font-bold text-amber-800 mb-1">Google Maps API key required</p>
          <p className="text-xs text-amber-700">Add <code className="bg-amber-100 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> to your .env file. Showing OpenStreetMap fallback below.</p>
        </div>
        <ScamHeatMap reports={markers.map((m) => ({ ...m, id: m.id }))} />
      </div>
    );
  }

  if (mapError) {
    return <ScamHeatMap reports={markers.map((m) => ({ ...m, id: m.id }))} />;
  }

  if (!markers.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-muted-foreground rounded-2xl border border-border">
        <MapPin className="w-10 h-10 mb-3 opacity-30" />
        <p className="font-medium">No scam locations to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <div className={`rounded-2xl overflow-hidden border border-border relative ${className || ''}`} style={!className ? { height: height || 480 } : undefined}>
        <div ref={mapRef} className="w-full h-full min-h-[280px]" />

        {selected && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-sm rounded-2xl border border-border shadow-xl p-4 max-h-[45%] overflow-y-auto">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ background: selected.color || '#ef4444' }}
                >
                  {SEVERITY_LABEL[selected.severity] || 'ALERT'} RISK
                </span>
                <h3 className="font-bold text-sm mt-1.5">{selected.title}</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> {selected.location_name}
                </p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="text-muted-foreground text-lg leading-none">×</button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">{selected.description}</p>
            {selected.source && (
              <p className="text-[10px] text-muted-foreground mt-2">Source: {selected.source.replace(/_/g, ' ')}</p>
            )}
            <div className="flex gap-2 mt-3">
              <a
                href={googleMapsDirections(selected.lat, selected.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-bold bg-primary text-primary-foreground py-2 rounded-xl"
              >
                <Navigation className="w-3.5 h-3.5" /> Directions
              </a>
              <a
                href={googleMapsLink(selected.googleQuery || selected.location_name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 text-xs font-bold border border-border px-3 py-2 rounded-xl"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 px-1 py-2 text-xs font-semibold text-muted-foreground">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500" /> High Risk</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-500" /> Medium</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-400" /> Low</span>
        <span className="flex items-center gap-1.5 ml-auto">
          <AlertTriangle className="w-3 h-3" /> {markers.length} verified hotspots
        </span>
      </div>
    </div>
  );
}

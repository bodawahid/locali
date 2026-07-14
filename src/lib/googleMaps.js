let loadPromise = null;

export function getGoogleMapsApiKey() {
  return import.meta.env?.VITE_GOOGLE_MAPS_API_KEY || '';
}

export function loadGoogleMaps() {
  const apiKey = getGoogleMapsApiKey();
  if (!apiKey) return Promise.resolve(null);
  if (window.google?.maps) return Promise.resolve(window.google.maps);

  if (!loadPromise) {
    loadPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-locali-gmaps]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.google.maps));
        return;
      }
      const script = document.createElement('script');
      script.dataset.localiGmaps = '1';
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,marker&v=weekly`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve(window.google.maps);
      script.onerror = () => reject(new Error('Google Maps failed to load'));
      document.head.appendChild(script);
    });
  }
  return loadPromise;
}

export function googleMapsLink(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function googleMapsDirections(lat, lng) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}

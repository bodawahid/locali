import { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import AdminImageUploadOverlay from '../AdminImageUploadOverlay';

// Normalizes any place's image data into a flat array of URLs
export function getPlaceImages(place) {
  const imgs = [];

  // main_image is always first / cover
  if (place.main_image) imgs.push(place.main_image);

  // images can be array of strings OR array of {url} objects
  if (Array.isArray(place.images)) {
    for (const img of place.images) {
      const url = typeof img === 'string' ? img : img?.url;
      if (url && url !== place.main_image) imgs.push(url);
    }
  }

  return imgs.filter(Boolean);
}

// Full-screen gallery modal
function GalleryModal({ images, startIndex = 0, onClose }) {
  const [idx, setIdx] = useState(startIndex);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);
  const next = () => setIdx(i => (i + 1) % images.length);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex flex-col"
      onClick={onClose}
    >
      {/* Close */}
      <button
        className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
        onClick={onClose}
      >
        <X className="w-5 h-5 text-white" />
      </button>

      {/* Counter */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 text-white/70 text-sm font-medium">
        {idx + 1} / {images.length}
      </div>

      {/* Main image */}
      <div
        className="flex-1 flex items-center justify-center px-16 py-12"
        onClick={e => e.stopPropagation()}
      >
        <img
          src={images[idx]}
          alt={`Photo ${idx + 1}`}
          className="max-w-full max-h-full object-contain rounded-xl"
        />
      </div>

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors"
            onClick={e => { e.stopPropagation(); prev(); }}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </button>
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors"
            onClick={e => { e.stopPropagation(); next(); }}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
        </>
      )}

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto px-4 pb-4 justify-center"
          onClick={e => e.stopPropagation()}
        >
          {images.map((url, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className={`shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${i === idx ? 'border-white' : 'border-transparent opacity-50 hover:opacity-80'}`}
            >
              <img src={url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Airbnb-style image grid: 1 large + up to 4 smaller + "+X more" overlay
export default function PlaceImageGrid({ place, className = '', onMainImageUploaded }) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStart, setGalleryStart] = useState(0);

  const images = getPlaceImages(place);
  const CATEGORY_ICONS = { hotel: '🏨', apartment: '🏠', experience: '🎯', service: '🛎️' };

  const openGallery = (i = 0) => { setGalleryStart(i); setGalleryOpen(true); };

  // No images — placeholder
  if (images.length === 0) {
    return (
      <div className={`aspect-[4/3] bg-gradient-to-br from-rose-50 to-orange-50 flex items-center justify-center rounded-2xl ${className}`}>
        <span className="text-5xl">{CATEGORY_ICONS[place.category] || '🏠'}</span>
      </div>
    );
  }

  // Single image — simple display
  if (images.length === 1) {
    return (
      <>
        <AdminImageUploadOverlay
          entityName="Place"
          recordId={place.id}
          onUploaded={onMainImageUploaded}
          className={`relative aspect-[4/3] overflow-hidden rounded-2xl cursor-pointer group ${className}`}
        >
          <div onClick={() => openGallery(0)}>
            <img src={images[0]} alt={place.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          </div>
        </AdminImageUploadOverlay>
        {galleryOpen && <GalleryModal images={images} startIndex={galleryStart} onClose={() => setGalleryOpen(false)} />}
      </>
    );
  }

  // Multi-image — Airbnb grid
  const cover = images[0];
  const side = images.slice(1, 5); // up to 4 side images
  const extraCount = images.length - 5; // how many beyond 5

  return (
    <>
      <div className={`relative overflow-hidden rounded-2xl ${className}`}>
        <div className="grid grid-cols-2 gap-1 h-64 sm:h-80">
          {/* Cover — left half */}
          <AdminImageUploadOverlay
            entityName="Place"
            recordId={place.id}
            onUploaded={onMainImageUploaded}
            className="relative overflow-hidden cursor-pointer group row-span-2"
          >
            <div onClick={() => openGallery(0)}>
              <img src={cover} alt={place.title} className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-300" />
            </div>
          </AdminImageUploadOverlay>

          {/* Side images — right half, 2x2 grid */}
          <div className="grid grid-cols-2 gap-1 row-span-2">
            {[0, 1, 2, 3].map(i => {
              const url = side[i];
              const isLast = i === 3 && extraCount > 0;
              if (!url) return <div key={i} className="bg-gray-100" />;
              return (
                <div
                  key={i}
                  className="relative overflow-hidden cursor-pointer group"
                  onClick={() => openGallery(i + 1)}
                >
                  <img src={url} alt="" className="w-full h-full object-cover group-hover:brightness-90 transition-all duration-300" />
                  {isLast && (
                    <div
                      className="absolute inset-0 bg-black/55 flex flex-col items-center justify-center gap-1"
                      onClick={e => { e.stopPropagation(); openGallery(i + 1); }}
                    >
                      <Images className="w-5 h-5 text-white" />
                      <span className="text-white font-black text-sm">+{extraCount + 1} more</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* "Show all photos" button */}
        <button
          onClick={() => openGallery(0)}
          className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm hover:bg-white transition-colors flex items-center gap-1.5"
        >
          <Images className="w-3.5 h-3.5" />
          {images.length} photos
        </button>
      </div>

      {galleryOpen && (
        <GalleryModal images={images} startIndex={galleryStart} onClose={() => setGalleryOpen(false)} />
      )}
    </>
  );
}
import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// Fetch images from Wikimedia Commons by searching for a place
async function fetchWikimediaImages(placeName, maxImages = 5) {
  try {
    // Search Wikimedia Commons for the place
    const searchQuery = encodeURIComponent(placeName);
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${searchQuery}&srnamespace=6&srlimit=10&format=json&origin=*`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    const pages = searchData?.query?.search || [];
    if (!pages.length) return [];

    // Get image URLs from the results
    const imageUrls = [];
    for (const page of pages.slice(0, maxImages)) {
      const title = encodeURIComponent(page.title);
      const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${title}&prop=imageinfo&iiprop=url&iiurlwidth=800&format=json&origin=*`;
      const infoRes = await fetch(infoUrl);
      const infoData = await infoRes.json();
      const pages2 = Object.values(infoData?.query?.pages || {});
      for (const p of pages2) {
        const url = p?.imageinfo?.[0]?.thumburl || p?.imageinfo?.[0]?.url;
        const lower = url.toLowerCase();
        if (url && !lower.includes('.svg') && !lower.includes('.ogg') && !lower.includes('.pdf') && !lower.includes('page1-') && (lower.includes('.jpg') || lower.includes('.jpeg') || lower.includes('.png') || lower.includes('.webp'))) {
          imageUrls.push({ url, source: 'Wikimedia' });
        }
      }
      if (imageUrls.length >= maxImages) break;
    }
    return imageUrls.slice(0, maxImages);
  } catch {
    return [];
  }
}

// Fetch images from Unsplash (free tier, no key needed for basic search via source.unsplash.com)
async function fetchUnsplashImages(placeName, maxImages = 4) {
  // Use Unsplash source URL which is free and requires no API key
  const queries = [
    placeName,
    placeName.split(' ').slice(0, 3).join(' '),
  ];

  const images = [];
  const seen = new Set();

  for (const q of queries) {
    const encoded = encodeURIComponent(q);
    // Use Unsplash's collection search API (no auth needed for source URLs)
    for (let i = 1; i <= 3; i++) {
      const url = `https://source.unsplash.com/featured/800x600?${encoded}&sig=${i}`;
      if (!seen.has(url)) {
        seen.add(url);
        images.push({ url, source: 'Unsplash' });
      }
    }
    if (images.length >= maxImages) break;
  }

  return images.slice(0, maxImages);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json();
    const { placeName, city, maxImages = 5 } = body;

    if (!placeName) {
      return Response.json({ error: 'placeName is required' }, { status: 400 });
    }

    const fullQuery = city ? `${placeName} ${city}` : placeName;

    // 1. Try Wikimedia Commons first
    let images = await fetchWikimediaImages(fullQuery, maxImages);

    // If Wikimedia found < 2, try with just the place name
    if (images.length < 2) {
      const fallback = await fetchWikimediaImages(placeName, maxImages);
      // Merge unique results
      const existing = new Set(images.map(i => i.url));
      for (const img of fallback) {
        if (!existing.has(img.url)) {
          images.push(img);
          existing.add(img.url);
        }
      }
    }

    // 2. If still < 2 images, fall back to Unsplash
    let usedFallback = false;
    if (images.length < 2) {
      images = await fetchUnsplashImages(fullQuery, maxImages);
      usedFallback = true;
    }

    if (!images.length) {
      return Response.json({
        status: 'NO_IMAGES_FOUND',
        placeName,
        images: [],
      });
    }

    return Response.json({
      status: 'OK',
      placeName,
      source: usedFallback ? 'Unsplash (fallback)' : 'Wikimedia',
      count: images.length,
      images,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
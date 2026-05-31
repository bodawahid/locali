import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Unified data sync from Google Places API
// Replaces all separate manual entries with verified API data
// Runs daily automatically

const EGYPTIAN_CITIES = {
  cairo: { lat: 30.0444, lng: 31.2357 },
  giza: { lat: 30.0131, lng: 31.1974 },
  alexandria: { lat: 31.2001, lng: 29.9187 },
  hurghada: { lat: 27.2574, lng: 33.8129 },
  'sharm-el-sheikh': { lat: 27.9142, lng: 34.3376 },
  luxor: { lat: 25.2854, lng: 32.6421 },
  aswan: { lat: 24.0889, lng: 32.8872 },
  'el-gouna': { lat: 27.3569, lng: 33.7688 },
};

const CATEGORY_KEYWORDS = {
  hotel: ['hotel', 'resort', 'motel', 'guest house', 'hostel', 'airbnb', 'accommodation'],
  restaurant: ['restaurant', 'cafe', 'bar', 'bistro', 'pizzeria', 'seafood'],
  tour: ['tour', 'excursion', 'cruise', 'boat trip', 'sailing'],
  guide: ['tour guide', 'guide', 'local guide', 'tourism guide'],
  driver: ['driver', 'taxi', 'transportation', 'transfer', 'ride'],
  activity: ['activity', 'adventure', 'sports', 'recreation', 'water sports', 'diving'],
  attraction: ['museum', 'monument', 'temple', 'pyramid', 'historic', 'landmark'],
  company: ['agency', 'company', 'operator', 'service provider'],
  transportation: ['transportation', 'car rental', 'shuttle', 'bus'],
};

function categorizePlace(placeType, name) {
  const nameLower = name.toLowerCase();
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some(kw => nameLower.includes(kw))) {
      return category;
    }
  }
  
  return 'company'; // Default fallback
}

async function fetchGooglePlaces(city, keyword) {
  const apiKey = Deno.env.get('GOOGLE_PLACES_API_KEY');
  if (!apiKey) {
    throw new Error('GOOGLE_PLACES_API_KEY not configured');
  }

  const coords = EGYPTIAN_CITIES[city];
  if (!coords) {
    throw new Error(`City ${city} not found`);
  }

  try {
    // Using Google Places API Text Search
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(keyword + ' in ' + city)}&location=${coords.lat},${coords.lng}&radius=50000&key=${apiKey}`
    );

    const data = await response.json();
    
    if (data.status !== 'OK') {
      console.warn(`Google Places API status: ${data.status}`);
      return [];
    }

    return data.results || [];
  } catch (error) {
    console.error(`Error fetching from Google Places: ${error.message}`);
    return [];
  }
}

async function generateSEODescription(name, category, city) {
  // Use LLM to generate SEO-friendly description
  const base44 = createClientFromRequest(new Request('http://localhost'));
  
  try {
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Write a brief, SEO-friendly description (2-3 sentences) for a ${category} in ${city}, Egypt named "${name}". Focus on what makes it unique and appealing to tourists. Keep it under 150 characters.`,
      model: 'gemini_3_flash',
    });
    
    return response;
  } catch (error) {
    console.warn('Failed to generate SEO description:', error.message);
    return `Quality ${category} in ${city}, Egypt. Verified listing with real ratings and reviews.`;
  }
}

async function processPlace(placeData, city, base44) {
  const {
    name,
    rating,
    user_ratings_total,
    formatted_address,
    formatted_phone_number,
    place_id,
    geometry,
    photos,
    website,
  } = placeData;

  // Skip if rating below 4.0
  if (!rating || rating < 4.0) {
    return null;
  }

  // Generate WhatsApp from phone if possible (convert +20 format)
  let whatsapp = null;
  if (formatted_phone_number) {
    const phoneDigits = formatted_phone_number.replace(/\D/g, '');
    if (phoneDigits.length >= 10) {
      whatsapp = phoneDigits.startsWith('20') 
        ? phoneDigits 
        : '20' + phoneDigits.slice(-10);
    }
  }

  // Get image from Google Places photo reference
  let imageUrl = null;
  if (photos && photos.length > 0) {
    const photoRef = photos[0].photo_reference;
    imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${photoRef}&key=${Deno.env.get('GOOGLE_PLACES_API_KEY')}`;
  }

  // Categorize the place
  const category = categorizePlace(placeData.types?.join(',') || '', name);

  // Generate SEO description
  const description = await generateSEODescription(name, category, city);

  // Check if already exists (by place_id to avoid duplicates)
  const existing = await base44.entities.Listing.filter({
    google_place_id: place_id,
  });

  const listing = {
    name,
    category,
    city,
    rating,
    review_count: user_ratings_total || 0,
    address: formatted_address,
    phone: formatted_phone_number || null,
    whatsapp: whatsapp,
    google_maps_link: `https://maps.google.com/?q=place_id:${place_id}`,
    website: website || null,
    image: imageUrl,
    description,
    latitude: geometry.location.lat,
    longitude: geometry.location.lng,
    google_place_id: place_id,
    source: 'google_places',
    is_verified: true,
    last_synced: new Date().toISOString(),
  };

  if (existing.length > 0) {
    // Update existing listing
    await base44.entities.Listing.update(existing[0].id, listing);
    return { type: 'updated', name };
  } else {
    // Create new listing
    await base44.entities.Listing.create(listing);
    return { type: 'created', name };
  }
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const results = {
      created: [],
      updated: [],
      skipped: [],
      errors: [],
      timestamp: new Date().toISOString(),
    };

    // Sync each city with various keywords
    const keywords = [
      'hotel',
      'restaurant',
      'tour guide',
      'driver',
      'activity',
      'attraction',
      'cafe',
      'diving',
      'transportation',
    ];

    for (const [city] of Object.entries(EGYPTIAN_CITIES)) {
      for (const keyword of keywords) {
        try {
          const places = await fetchGooglePlaces(city, keyword);

          for (const place of places.slice(0, 20)) {
            // Limit to 20 per keyword to avoid API quota
            const result = await processPlace(place, city, base44);
            
            if (result) {
              if (result.type === 'created') {
                results.created.push(result.name);
              } else if (result.type === 'updated') {
                results.updated.push(result.name);
              }
            } else {
              results.skipped.push(`${place.name} (rating < 4.0)`);
            }
          }
        } catch (error) {
          results.errors.push(`${city}/${keyword}: ${error.message}`);
        }
      }
    }

    return Response.json({
      success: true,
      message: 'Unified listing sync completed',
      ...results,
      total_created: results.created.length,
      total_updated: results.updated.length,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
// City Guide Content — real places, SEO-optimized descriptions
// Google Maps links use search format for reliability

const maps = (query) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
const viator = (q) => `https://www.viator.com/search/${encodeURIComponent(q)}`;
const gyg = (q) => `https://www.getyourguide.com/s/?q=${encodeURIComponent(q)}`;

export const CITY_GUIDE = {
  hurghada: {
    id: 'hurghada',
    name: 'Hurghada',
    country: 'Egypt',
    emoji: '🌊',
    hero: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80',
    meta_title: 'Hurghada Egypt Travel Guide 2026 — Beaches, Restaurants, Activities & More',
    meta_description: 'Complete travel guide to Hurghada, Egypt. Best beaches, cafes, restaurants, water sports, day trips and things to do in Hurghada. Updated 2026.',
    intro: 'Hurghada is Egypt\'s premier Red Sea resort city, stretching along 40km of coastline with crystal-clear waters, world-class diving, and a vibrant international tourist scene. Whether you\'re here for diving, relaxing on the beach, or exploring the desert, Hurghada has something for every traveler.',

    beaches: [
      { name: 'Sahl Hasheesh Public Beach', description: 'One of the best free beaches near Hurghada, with calm turquoise water and a relaxed atmosphere. Popular with families and snorkelers. Part of the upscale Sahl Hasheesh resort area.', maps: maps('Sahl Hasheesh Beach Hurghada Egypt'), free: true },
      { name: 'Mahmya Island Beach', description: 'Protected coral island 45 minutes by boat from Hurghada. Voted one of the best beaches in Egypt — pristine white sand and snorkeling directly from shore.', maps: maps('Mahmya Island Hurghada Egypt'), free: false, note: 'Day trip ticket required' },
      { name: 'El Dahar Beach', description: 'Local beach in the old town area of Hurghada. Budget-friendly, authentic Egyptian seaside experience away from the tourist strip.', maps: maps('El Dahar Beach Hurghada Egypt'), free: true },
      { name: 'Makadi Bay Beach', description: 'Stunning bay south of Hurghada with sheltered, shallow waters. Excellent snorkeling and one of the calmest spots on the Red Sea coast.', maps: maps('Makadi Bay Beach Hurghada Egypt'), free: false, note: 'Beach club entry fee applies' },
      { name: 'Orange Bay Island', description: 'White sand island near Hurghada with vibrant coral reefs. One of the top catamaran trip destinations — crystal clear water and colorful fish.', maps: maps('Orange Bay Island Hurghada Egypt'), free: false, note: 'Boat trip required' },
    ],

    cafes: [
      { name: 'Illy Caffè Marina', description: 'International coffee chain with waterfront terrace overlooking Hurghada Marina. Perfect spot for morning coffee with yachts in view. One of the best cafes in Hurghada for ambiance.', maps: maps('Illy Caffe Marina Hurghada Egypt') },
      { name: 'Breakers Beach Cafe', description: 'Casual beachfront cafe on the marina strip. Great smoothies, fresh juices, and light bites. Popular with kitesurfers and beach lovers.', maps: maps('Breakers Beach Cafe Hurghada Egypt') },
      { name: 'Mocha Coffee Shop El Mamsha', description: 'Trendy local coffee shop on the famous El Mamsha (Marina Walk) promenade. Cold brews, shisha, and Egyptian pastries. Stays busy until midnight.', maps: maps('Mocha Coffee Shop El Mamsha Hurghada Egypt') },
      { name: 'Arabica Specialty Coffee Hurghada', description: 'Specialty coffee roastery with single-origin Egyptian and Ethiopian beans. Best espresso in Hurghada according to locals and expats.', maps: maps('Arabica Coffee Hurghada Egypt') },
      { name: 'Stars & Bars Marina', description: 'Rooftop bar-cafe overlooking the Red Sea. Great coffee during the day, cocktails at night. Known for spectacular sunset views over the water.', maps: maps('Stars and Bars Marina Hurghada Egypt') },
    ],

    restaurants: [
      { name: "Nino's Restaurant", cuisine: 'Italian / Seafood', price: '💰💰💰', description: 'Top-rated fine dining restaurant in Hurghada Marina. Authentic Italian food with fresh Red Sea seafood. Consistently rated 4.9/5 on Google. Perfect for special dinners.', maps: maps("Nino's Restaurant Marina Hurghada Egypt") },
      { name: 'Sofra Restaurant', cuisine: 'Egyptian / Middle Eastern', price: '💰', description: 'Best traditional Egyptian food in Hurghada. Serving koshari, ful medames, grilled meats, and fresh mezze. Beloved by locals and budget travelers alike.', maps: maps('Sofra Restaurant Hurghada Egypt') },
      { name: 'Kikis Restaurant & Bar', cuisine: 'International', price: '💰💰', description: 'Relaxed beach restaurant in Sahl Hasheesh serving international cuisine. Fresh fish, burgers, salads. Popular with families and expats living in Hurghada.', maps: maps('Kikis Restaurant Sahl Hasheesh Hurghada Egypt') },
      { name: 'Portofino Restaurant', cuisine: 'Italian / Mediterranean', price: '💰💰💰', description: 'Upscale marina restaurant famous for fresh pasta, wood-fired pizza and grilled seafood. Great spot for romantic dinners with views of Hurghada Harbor.', maps: maps('Portofino Restaurant Hurghada Marina Egypt') },
      { name: 'El Mina Seafood Restaurant', cuisine: 'Seafood / Egyptian', price: '💰💰', description: 'Local seafood restaurant serving the freshest daily catch. Choose your fish at the counter and have it grilled to order. An authentic Hurghada dining experience.', maps: maps('El Mina Seafood Hurghada Egypt') },
      { name: 'Hardees Hurghada', cuisine: 'Fast Food', price: '💰', description: 'Popular fast food chain convenient for quick meals. Located on the main tourist strip.', maps: maps('Hardees Hurghada Egypt') },
    ],

    supermarkets: [
      { name: 'Spinneys Hurghada', description: 'The best international supermarket in Hurghada with imported goods, fresh produce, and Western products. Located in Sahl Hasheesh.', maps: maps('Spinneys Hurghada Egypt') },
      { name: 'Carrefour Market Hurghada', description: 'Large hypermarket near the tourist strip with everything from groceries to electronics. Good selection of local and imported products.', maps: maps('Carrefour Hurghada Egypt') },
      { name: 'Metro Market Hurghada', description: 'Mid-size supermarket popular with locals and expats. Great bakery section and fresh produce. Several branches across Hurghada.', maps: maps('Metro Market Hurghada Egypt') },
      { name: 'El Dahar Market', description: 'Traditional Egyptian market in the old town. Buy fresh fruits, vegetables, spices, and local products at local prices.', maps: maps('El Dahar Market Hurghada Egypt') },
    ],

    malls: [
      { name: 'Senzo Mall', description: 'Hurghada\'s largest shopping mall with over 150 stores, cinema, food court, and entertainment. Home to international and Egyptian fashion brands.', maps: maps('Senzo Mall Hurghada Egypt') },
      { name: 'Marina Mall Hurghada', description: 'Waterfront shopping center in Hurghada Marina. Mix of boutiques, cafes, restaurants, and souvenir shops. Great evening stroll destination.', maps: maps('Marina Mall Hurghada Egypt') },
      { name: 'Sharia Sheraton Bazaar', description: 'The main tourist bazaar street in Hurghada with hundreds of stalls selling alabaster, papyrus, cotton, spices, and Red Sea souvenirs. Bargaining expected.', maps: maps('Sharia Sheraton Bazaar Hurghada Egypt') },
    ],

    water_sports: [
      { name: 'Diving — Emperor Divers Hurghada', description: 'Award-winning PADI dive center in Hurghada. Offers beginner courses, advanced dives, and liveaboard trips to Ras Mohammed and Brothers Islands.', maps: maps('Emperor Divers Hurghada Egypt'), booking: viator('diving hurghada egypt') },
      { name: 'Snorkeling Day Trip — Orange Bay', description: 'Half-day catamaran snorkeling trip from Hurghada marina. Visit 2–3 coral reef sites with equipment included. Rated #1 activity in Hurghada on GetYourGuide.', maps: maps('Hurghada Marina Egypt'), booking: gyg('snorkeling hurghada orange bay') },
      { name: 'Kitesurfing — El Gouna Kite School', description: 'Red Sea kitesurfing lessons and rentals near Hurghada. The consistent wind makes this one of the best kitesurfing spots in the world.', maps: maps('Kite School El Gouna Egypt'), booking: viator('kitesurfing hurghada egypt') },
      { name: 'Submarine Tour — Sindbad Submarine', description: 'Unique underwater experience for non-divers. Real submarine that descends 22 meters into the Red Sea coral reef. Great for families and kids.', maps: maps('Sindbad Submarine Hurghada Egypt'), booking: viator('submarine hurghada egypt') },
      { name: 'Glass-Bottom Boat Tour', description: 'Hour-long boat trip with glass bottom panels to view coral reefs and tropical fish without getting wet. Budget-friendly activity for all ages.', maps: maps('Glass Bottom Boat Hurghada Egypt'), booking: gyg('glass bottom boat hurghada') },
    ],

    nightlife: [
      { name: 'Little Buddha Beach Club', description: 'Upscale beach club and lounge in the Sahl Hasheesh area. DJ sets, cocktail bar, and dance floor. The most exclusive nightlife venue in Hurghada.', maps: maps('Little Buddha Beach Club Hurghada Egypt') },
      { name: 'Papas Bar Marina', description: 'Lively sports bar on the Marina promenade. Live music, international beers, and a mixed crowd of tourists and expats. Open until 3am.', maps: maps('Papas Bar Marina Hurghada Egypt') },
      { name: 'Stargate Disco Hurghada', description: 'Hurghada\'s legendary nightclub that has been operating for decades. Massive dance floor, light show, and international DJs on weekends.', maps: maps('Stargate Disco Hurghada Egypt') },
      { name: 'Marina Pub Strip', description: 'The main strip of bars and restaurants along Hurghada Marina. Walking distance between venues. Lively every evening with street performers and musicians.', maps: maps('Hurghada Marina Pub Strip Egypt') },
    ],

    family: [
      { name: 'Hurghada Grand Aquarium', description: 'One of the largest aquariums in Egypt with 1,200 marine species. Kids can see sharks, rays, and colorful Red Sea fish. Educational and entertaining for all ages.', maps: maps('Hurghada Grand Aquarium Egypt'), booking: viator('hurghada aquarium') },
      { name: 'Makadi Water World', description: 'Massive water park with 36 slides and attractions near Hurghada. One of the best water parks in Egypt. Full day family entertainment.', maps: maps('Makadi Water World Hurghada Egypt'), booking: viator('makadi water world hurghada') },
      { name: 'Hurghada Desert Safari (Kids)', description: 'Quad biking and camel riding for families in the Eastern Desert near Hurghada. Kids love the camel experience. Hotel transfer included in most packages.', maps: maps('Desert Safari Hurghada Egypt'), booking: gyg('desert safari hurghada family') },
      { name: 'Mini Egypt Hurghada', description: 'Fun outdoor attraction showcasing miniature replicas of Egypt\'s famous monuments — perfect for kids to learn about Egyptian history in a fun way.', maps: maps('Mini Egypt Hurghada Egypt') },
    ],

    day_trips: [
      { name: 'Luxor Day Trip from Hurghada', description: 'Full-day guided tour to Luxor from Hurghada (3.5 hrs by car). Visit Valley of the Kings, Karnak Temple, and Colossi of Memnon. One of Egypt\'s most popular day trips.', maps: maps('Luxor Valley of the Kings Egypt'), booking: viator('luxor day trip from hurghada') },
      { name: 'Cairo Day Trip from Hurghada', description: 'Fly to Cairo for the day and visit the Pyramids of Giza, Sphinx, and Egyptian Museum. Most operators offer flights + guided tour packages from Hurghada.', maps: maps('Pyramids of Giza Cairo Egypt'), booking: viator('cairo day trip from hurghada') },
      { name: 'Dolphin House Snorkeling', description: 'Boat trip to Dolphin House reef where wild spinner dolphins swim every morning. One of the most magical experiences available from Hurghada.', maps: maps('Dolphin House Reef Hurghada Egypt'), booking: gyg('dolphin house hurghada') },
      { name: 'Gouna & Lagoon Boat Trip', description: 'Day trip to El Gouna\'s famous lagoon system. Explore the canals, swim in the lagoon, and enjoy lunch at a marina restaurant.', maps: maps('El Gouna Lagoon Egypt'), booking: viator('el gouna day trip hurghada') },
    ],
  },

  sharm: {
    id: 'sharm',
    name: 'Sharm El Sheikh',
    country: 'Egypt',
    emoji: '⛰️',
    hero: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=1200&q=80',
    meta_title: 'Sharm El Sheikh Egypt Travel Guide 2026 — Beaches, Restaurants, Activities & More',
    meta_description: 'Complete travel guide to Sharm El Sheikh, Egypt. Best beaches, cafes, restaurants, diving, nightlife and things to do in Sharm El Sheikh. Updated 2026.',
    intro: 'Sharm El Sheikh is Egypt\'s most famous resort destination, sitting at the southern tip of Sinai Peninsula where the Red Sea meets the Gulf of Aqaba. World-renowned for its coral reefs, luxury resorts, and access to Mount Sinai, Sharm El Sheikh offers unmatched underwater beauty and Bedouin desert adventures.',

    beaches: [
      { name: 'Naama Bay Beach', description: 'The heart of Sharm El Sheikh — a crescent-shaped bay lined with hotels, restaurants, and beach clubs. The most popular and accessible beach in Sharm. Great for swimming and snorkeling.', maps: maps('Naama Bay Beach Sharm El Sheikh Egypt'), free: true },
      { name: 'Ras Um Sid Beach', description: 'Beautiful beach with excellent snorkeling right from shore. Home to the famous "Temple" dive site. One of the best beginner snorkel spots in Sharm El Sheikh.', maps: maps('Ras Um Sid Beach Sharm El Sheikh Egypt'), free: false },
      { name: 'Sharks Bay Beach', description: 'Calm, sheltered bay north of Naama Bay. More relaxed atmosphere than the main strip. Excellent snorkeling with sea turtles sometimes spotted in the bay.', maps: maps('Sharks Bay Sharm El Sheikh Egypt'), free: false },
      { name: 'Ras Mohammed National Park', description: 'Protected national park at the southernmost tip of Sinai. World-class diving and snorkeling at Shark Reef and Yolanda Reef. Stunning natural lagoons and sand rivers.', maps: maps('Ras Mohammed National Park Sharm El Sheikh Egypt'), free: false, note: 'Entry permit required' },
      { name: 'Coral Beach Nature Reserve', description: 'Small protected beach with incredibly rich shallow coral gardens. No boats — only snorkelers. One of the most pristine reef experiences accessible from Sharm.', maps: maps('Coral Beach Nature Reserve Sharm El Sheikh Egypt'), free: false },
    ],

    cafes: [
      { name: 'Caffe Nero Naama Bay', description: 'International coffee chain with a prime Naama Bay location. Air-conditioned interior and outdoor terrace. Best coffee in Naama Bay for chain quality.', maps: maps('Caffe Nero Naama Bay Sharm El Sheikh Egypt') },
      { name: 'Hard Rock Cafe Sharm', description: 'Iconic international venue in Naama Bay. Great coffee, cocktails, and live music. Landmark on the Sharm El Sheikh promenade.', maps: maps('Hard Rock Cafe Sharm El Sheikh Egypt') },
      { name: 'Koshary Sharm Cafe', description: 'Beloved local cafe in Old Sharm serving strong Egyptian tea, fresh coffee, and homemade pastries. Where locals go for the authentic experience.', maps: maps('Local Cafe Old Sharm El Sheikh Egypt') },
      { name: 'Naama Bay Beachfront Shisha Cafes', description: 'Row of traditional shisha cafes along the Naama Bay promenade. Enjoy mint tea, shisha, and sea breezes — a classic Sharm evening experience.', maps: maps('Shisha Cafe Naama Bay Sharm El Sheikh Egypt') },
      { name: 'Blue Hole Cafe Dahab', description: 'While technically in nearby Dahab (45 min), the legendary Blue Hole Cafe overlooks one of the world\'s most famous dive sites. Worth the trip for coffee with a view.', maps: maps('Blue Hole Cafe Dahab Egypt') },
    ],

    restaurants: [
      { name: "Fares Restaurant Naama Bay", cuisine: 'Egyptian / Seafood', price: '💰', description: 'Popular Egyptian restaurant in Naama Bay known for fresh grilled fish, koshari, and local mezze. Great value in a tourist area. Always busy — arrive early.', maps: maps("Fares Restaurant Naama Bay Sharm El Sheikh Egypt") },
      { name: 'Tam Tam Oriental', cuisine: 'Egyptian / Middle Eastern', price: '💰💰', description: 'One of Sharm\'s most beloved Egyptian restaurants. Famous for BBQ meats, tahini, and fresh pita bread. Floor seating, belly dancing on weekends.', maps: maps('Tam Tam Oriental Restaurant Sharm El Sheikh Egypt') },
      { name: 'La Luna Restaurant', cuisine: 'Italian / Mediterranean', price: '💰💰💰', description: 'Elegant Italian restaurant in the Hayatt Regency area. Homemade pasta, fresh seafood, and an impressive wine list. Romantic setting with sea views.', maps: maps('La Luna Restaurant Sharm El Sheikh Egypt') },
      { name: 'Pomodoro Restaurant', cuisine: 'Italian', price: '💰💰', description: 'Casual Italian restaurant popular with European tourists in Sharm. Good pizza, pasta, and salads at reasonable prices. Family-friendly atmosphere.', maps: maps('Pomodoro Restaurant Sharm El Sheikh Egypt') },
      { name: 'Koshary El Tahrir Sharm', cuisine: 'Egyptian Street Food', price: '💰', description: 'The best koshari in Sharm El Sheikh — cheap, filling Egyptian street food. Lentils, pasta, rice, tomato sauce and crispy onions. A must-try local dish.', maps: maps('Koshary Restaurant Sharm El Sheikh Egypt') },
    ],

    supermarkets: [
      { name: 'Dominos Supermarket Naama Bay', description: 'Well-stocked supermarket in the heart of Naama Bay. Good selection of imported goods, sunscreen, and tourist essentials.', maps: maps('Dominos Supermarket Naama Bay Sharm El Sheikh Egypt') },
      { name: 'Carrefour Sharm El Sheikh', description: 'Large Carrefour near the old town with full range of groceries, household items, and electronics.', maps: maps('Carrefour Sharm El Sheikh Egypt') },
      { name: 'El Masria Supermarket', description: 'Egyptian supermarket chain with branches throughout Sharm. Great for local products, fresh bread, and basic groceries at local prices.', maps: maps('El Masria Supermarket Sharm El Sheikh Egypt') },
    ],

    malls: [
      { name: 'Sharm El Sheikh Mall (Nabq)', description: 'The largest shopping mall in Sharm El Sheikh with fashion brands, electronics, food court and cinema. Located in the newer Nabq Bay area.', maps: maps('Sharm El Sheikh Mall Nabq Egypt') },
      { name: 'Naama Bay Promenade Shops', description: 'Open-air shopping strip along the Naama Bay waterfront. Mix of souvenir shops, dive shops, clothing stores, and restaurants.', maps: maps('Naama Bay Promenade Sharm El Sheikh Egypt') },
      { name: 'Old Market Sharm El Sheikh', description: 'The old bazaar district of Sharm with traditional shops selling papyrus, Bedouin jewelry, cotton clothing, and spices. Best souvenir shopping in Sharm.', maps: maps('Old Market Sharm El Sheikh Egypt') },
    ],

    water_sports: [
      { name: 'Diving — Camel Dive Club Sharm', description: 'One of Sharm El Sheikh\'s most respected PADI dive centers. Daily dives to Thistlegorm wreck, Ras Mohammed, and Dahab Blue Hole. Expert guides and top equipment.', maps: maps('Camel Dive Club Sharm El Sheikh Egypt'), booking: viator('diving sharm el sheikh') },
      { name: 'Snorkeling Ras Mohammed — Catamaran', description: 'Full-day catamaran to Ras Mohammed National Park. Snorkel the famous Shark Reef and Yolanda Reef — some of the world\'s best shallow reefs.', maps: maps('Ras Mohammed Sharm El Sheikh Egypt'), booking: viator('ras mohammed snorkeling sharm') },
      { name: 'Wakeboarding & Jet Ski Naama Bay', description: 'Naama Bay offers jet skiing, wakeboarding, parasailing, and banana boats right on the beach. Multiple operators on the waterfront. Great fun for beginners.', maps: maps('Naama Bay Watersports Sharm El Sheikh Egypt'), booking: gyg('jet ski sharm el sheikh') },
      { name: 'Windsurfing — Sharm El Sheikh', description: 'The Red Sea winds make Sharm excellent for windsurfing. Several schools in Naama Bay offer lessons and equipment rental for all levels.', maps: maps('Windsurfing School Sharm El Sheikh Egypt'), booking: viator('windsurfing sharm el sheikh') },
    ],

    nightlife: [
      { name: 'Pacha Sharm El Sheikh', description: 'Branch of the famous Ibiza nightclub brand in Sharm. International DJs, massive dance floor, and world-class production. The biggest nightlife venue in Sharm El Sheikh.', maps: maps('Pacha Sharm El Sheikh Egypt') },
      { name: 'Hard Rock Cafe Naama Bay', description: 'Famous international brand with nightly live music and a full cocktail bar. One of the liveliest venues in Naama Bay for evening entertainment.', maps: maps('Hard Rock Cafe Naama Bay Sharm El Sheikh Egypt') },
      { name: 'Bus Stop Bar Naama Bay', description: 'Legendary outdoor bar on the Naama Bay promenade. Meeting point for international travelers, affordable drinks, and a great party atmosphere.', maps: maps('Bus Stop Bar Naama Bay Sharm El Sheikh Egypt') },
      { name: 'Little Buddha Sharm', description: 'Upscale lounge and beach club with sophisticated cocktail menu, Asian-fusion food, and chill electronic music. Perfect for adults seeking a stylish night out.', maps: maps('Little Buddha Sharm El Sheikh Egypt') },
    ],

    family: [
      { name: 'Sharm El Sheikh Aqua Park', description: 'Large water park with slides, lazy river, wave pool, and children\'s areas. A full day of family fun in Sharm El Sheikh. Often included in resort packages.', maps: maps('Aqua Park Sharm El Sheikh Egypt'), booking: viator('aqua park sharm el sheikh') },
      { name: 'Ras Mohammed Snorkeling (Families)', description: 'Family-friendly catamaran trip to Ras Mohammed with shallow snorkel sites perfect for children. Guides are patient with beginners and first-time snorkelers.', maps: maps('Ras Mohammed Family Tour Sharm Egypt'), booking: gyg('family snorkeling sharm el sheikh') },
      { name: 'Camel Riding Sinai Desert', description: 'Short camel ride through Sinai desert landscape near Sharm. Gentle camels and experienced handlers. Great photos and a memorable experience for kids.', maps: maps('Camel Ride Sharm El Sheikh Egypt'), booking: viator('camel ride sharm el sheikh') },
      { name: 'Glass-Bottom Boat Naama Bay', description: 'Kid-friendly glass-bottom boat ride over the coral reefs of Naama Bay. No swimming required. Perfect introduction to the underwater world of the Red Sea.', maps: maps('Glass Bottom Boat Naama Bay Sharm El Sheikh Egypt'), booking: gyg('glass bottom boat sharm el sheikh') },
    ],

    day_trips: [
      { name: 'Mount Sinai Sunrise Trek', description: 'One of Egypt\'s most iconic experiences — midnight hike to the summit of Mount Sinai (2,285m) to watch the sunrise. Holy site for three religions. Guided tours depart nightly.', maps: maps('Mount Sinai Egypt'), booking: viator('mount sinai trek sharm el sheikh') },
      { name: 'Dahab Day Trip', description: 'Visit the chilled-out Bedouin beach town of Dahab (45 min from Sharm). World-famous Blue Hole dive site, Canyon snorkeling, and relaxed beach restaurants.', maps: maps('Dahab Blue Hole Egypt'), booking: viator('dahab day trip sharm el sheikh') },
      { name: 'Cairo Pyramids — Flying Day Trip', description: 'Fly from Sharm to Cairo for a day trip to the Great Pyramids of Giza, Sphinx, and Egyptian Museum. Return same day. Unforgettable experience.', maps: maps('Pyramids of Giza Egypt'), booking: viator('cairo day trip from sharm') },
      { name: 'St. Catherine Monastery', description: 'UNESCO World Heritage Site at the foot of Mount Sinai. One of the oldest Christian monasteries in the world (6th century). Combined with Sinai sunrise trek.', maps: maps('St Catherine Monastery Egypt'), booking: viator('st catherine monastery sharm') },
    ],
  },

  luxor: {
    id: 'luxor',
    name: 'Luxor',
    country: 'Egypt',
    emoji: '👑',
    hero: 'https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?w=1200&q=80',
    meta_title: 'Luxor Egypt Travel Guide 2026 — Temples, Tombs, Restaurants & Things To Do',
    meta_description: 'Complete travel guide to Luxor, Egypt. Valley of the Kings, Karnak Temple, hot air balloon, best restaurants and things to do in Luxor. Updated 2026.',
    intro: 'Luxor is often called the world\'s greatest open-air museum — an entire city built on the ruins of ancient Thebes, Egypt\'s most powerful New Kingdom capital. Home to the Valley of the Kings, Karnak Temple, and more ancient monuments per square kilometer than anywhere on Earth, Luxor is essential for any Egypt trip.',

    beaches: [
      { name: 'Nile Corniche Luxor (East Bank)', description: 'Luxor\'s famous riverside promenade along the Nile. Not a beach, but a beautiful walkway for sunrise strolls, horse carriage rides, and watching feluccas on the river. The social heart of Luxor.', maps: maps('Luxor Corniche East Bank Nile Egypt'), free: true },
      { name: 'Crocodile Island (Banana Island)', description: 'Small green island in the Nile accessible by rowboat. Quiet, lush, and peaceful. Popular spot for picnics and relaxing away from the crowds. Local kids swim here.', maps: maps('Banana Island Luxor Egypt'), free: true },
      { name: 'West Bank Nile Banks', description: 'The agricultural west bank of the Nile near Luxor offers quiet sandy riverbanks perfect for sunset watching. Accessible by the local ferry.', maps: maps('West Bank Nile Luxor Egypt'), free: true },
    ],

    cafes: [
      { name: 'Sofra Cafe Luxor', description: 'Beloved rooftop cafe in central Luxor with views over the city. Traditional Egyptian breakfast, strong coffee, and fresh juices. One of the best cafes in Luxor for atmosphere.', maps: maps('Sofra Cafe Luxor Egypt') },
      { name: 'Nile View Cafe West Bank', description: 'Small local cafe on the West Bank with stunning Nile views and cheap Egyptian tea. Popular with archaeologists and budget travelers who prefer the quiet side of Luxor.', maps: maps('Nile View Cafe West Bank Luxor Egypt') },
      { name: 'Al Sahaby Lane Cafe', description: 'Charming traditional cafe in a narrow alley near Luxor Temple. Old Egyptian decor, shisha, mint tea. A hidden gem for travelers seeking authentic Luxor character.', maps: maps('Al Sahaby Lane Cafe Luxor Egypt') },
      { name: 'Marsam Hotel Cafe (West Bank)', description: 'Relaxed cafe at the historic Marsam Hotel on the West Bank. Cold drinks, simple meals, and a wonderful garden. Popular with solo travelers and archaeologists working in Luxor.', maps: maps('Marsam Hotel Luxor West Bank Egypt') },
    ],

    restaurants: [
      { name: 'Sofra Restaurant Luxor', cuisine: 'Egyptian / Traditional', price: '💰', description: 'The most authentic Egyptian restaurant in Luxor. Located on a beautiful old street. Traditional Egyptian dishes, tagines, and mezze. A must-eat experience in Luxor.', maps: maps('Sofra Restaurant Luxor Egypt') },
      { name: 'Snack Time Restaurant', cuisine: 'Egyptian / International', price: '💰', description: 'Budget-friendly spot in central Luxor popular with backpackers. Good grilled chicken, kofta, and fresh juices. Open late and great value.', maps: maps('Snack Time Restaurant Luxor Egypt') },
      { name: 'Oasis Cafe & Restaurant', description: 'Relaxed restaurant near Luxor Temple serving Egyptian and international food. Good for post-temple lunches. The roof terrace faces the Nile.', cuisine: 'Egyptian / International', price: '💰💰', maps: maps('Oasis Restaurant Luxor Egypt') },
      { name: 'The Terrace — Winter Palace', cuisine: 'International / Fine Dining', price: '💰💰💰', description: 'Elegant Nile-view restaurant at the legendary Old Winter Palace Hotel. Colonial architecture, fine Egyptian cuisine, and an unforgettable setting. Best upscale dining in Luxor.', maps: maps('Winter Palace Hotel Luxor Egypt') },
      { name: 'Abu Hagag Restaurant', cuisine: 'Egyptian Street Food', price: '💰', description: 'Local favorite near Luxor Temple serving cheap, delicious Egyptian food. Ful, falafel, kofta, and fresh bread. Eat where the locals eat.', maps: maps('Abu Hagag Restaurant Luxor Egypt') },
    ],

    supermarkets: [
      { name: 'Lulu Hypermarket Luxor', description: 'Large supermarket in central Luxor with good range of local and imported products. Popular with both tourists and Luxor residents.', maps: maps('Lulu Hypermarket Luxor Egypt') },
      { name: 'Metro Supermarket Luxor', description: 'Reliable supermarket chain with branches on both the East and West banks. Good for groceries, bottled water, and daily essentials.', maps: maps('Metro Supermarket Luxor Egypt') },
      { name: 'Local Souq — Luxor Market', description: 'Traditional Egyptian market near the train station. Buy fresh fruit, vegetables, spices, and local products at genuinely local prices.', maps: maps('Luxor Market Souq Egypt') },
    ],

    malls: [
      { name: 'Luxor Mall', description: 'Main shopping center in Luxor city with clothing stores, electronics, and a food court. Located near the train station area.', maps: maps('Luxor Mall Egypt') },
      { name: 'Luxor Bazaar (Sharia El Souk)', description: 'The main tourist bazaar street running parallel to Luxor Temple. Alabaster workshops, papyrus galleries, cotton gallabiyyas, and genuine antiques. The best shopping in Luxor.', maps: maps('Sharia El Souk Luxor Egypt') },
      { name: 'Alabaster Factory Village', description: 'Workshop village on the West Bank near the Valley of the Kings. Watch craftsmen make alabaster vases and figurines from raw stone. Prices directly from the source.', maps: maps('Alabaster Factory Luxor West Bank Egypt') },
    ],

    water_sports: [
      { name: 'Felucca Sailing on the Nile', description: 'Traditional wooden sailboat ride on the Nile at sunset. One of the most iconic and romantic experiences in Luxor. Book directly at the Corniche for best prices.', maps: maps('Felucca Luxor Nile Egypt'), booking: gyg('felucca luxor nile') },
      { name: 'Hot Air Balloon over Luxor', description: 'The world\'s most famous hot air balloon experience — sunrise flight over the Valley of the Kings and West Bank temples. The #1 rated activity in Luxor. Book 24hrs ahead.', maps: maps('Hot Air Balloon Luxor Egypt'), booking: viator('hot air balloon luxor egypt') },
      { name: 'Nile Cruise Luxor to Aswan (4 days)', description: 'Classic Egypt Nile cruise between Luxor and Aswan visiting Esna, Edfu, Kom Ombo temples. The quintessential Egyptian travel experience. Best booked in advance.', maps: maps('Luxor Aswan Nile Cruise Egypt'), booking: viator('nile cruise luxor aswan') },
    ],

    nightlife: [
      { name: 'Luxor Temple Sound & Light Show', description: 'After-dark sound and light show at Luxor Temple — the temple columns are dramatically illuminated while narration tells ancient Egyptian history. Not to be missed.', maps: maps('Luxor Temple Sound Light Show Egypt') },
      { name: 'Karnak Sound & Light Show', description: 'The most spectacular sound and light show in Egypt — walk through the massive Karnak Temple complex illuminated after dark with dramatic narration.', maps: maps('Karnak Temple Sound Light Show Luxor Egypt') },
      { name: 'Nile-View Rooftop Bars', description: 'Several hotels along the Luxor Corniche offer rooftop bars with Nile views. The Hotel Mercure rooftop is particularly well-known for sunset drinks.', maps: maps('Rooftop Bar Luxor Corniche Egypt') },
      { name: 'Nubian Music & Cultural Shows', description: 'Traditional Nubian music and dance performances in restaurants on the West Bank. Authentic cultural entertainment unique to Upper Egypt.', maps: maps('Nubian Cultural Show Luxor Egypt') },
    ],

    family: [
      { name: 'Valley of the Kings (Kids)', description: 'Egypt\'s most famous archaeological site — the royal burial ground of the New Kingdom pharaohs including Tutankhamun. Kids love the descending tomb corridors and wall paintings.', maps: maps('Valley of the Kings Luxor Egypt'), booking: viator('valley of the kings guided tour luxor') },
      { name: 'Karnak Temple', description: 'The world\'s largest temple complex — a forest of giant columns, sphinxes, and obelisks. Scale is astonishing for adults and children alike. Best visited at opening (6am).', maps: maps('Karnak Temple Luxor Egypt'), booking: viator('karnak temple tour luxor') },
      { name: 'Horse Carriage Rides Luxor', description: 'Traditional horse-drawn carriage rides between Luxor Temple and Karnak Temple along the ancient Sphinx Avenue. Kids and adults love the experience.', maps: maps('Horse Carriage Luxor Temple Egypt'), booking: gyg('horse carriage luxor') },
      { name: 'Luxor Museum', description: 'Small but exceptional museum housing the finest artifacts from Luxor\'s excavations. Less crowded than Cairo museum. Perfect 2-hour family visit.', maps: maps('Luxor Museum Egypt'), booking: viator('luxor museum visit') },
    ],

    day_trips: [
      { name: 'Abydos Temple Day Trip', description: 'Ancient temple of Seti I at Abydos — one of Egypt\'s most beautifully preserved temples with stunning original paintwork. 160km north of Luxor. Full day excursion.', maps: maps('Abydos Temple Egypt'), booking: viator('abydos temple day trip luxor') },
      { name: 'Dendera Temple Day Trip', description: 'Remarkably well-preserved Ptolemaic temple dedicated to Hathor. Famous for the Dendera Zodiac and intact ceiling paintings. 60km north of Luxor.', maps: maps('Dendera Temple Egypt'), booking: viator('dendera temple day trip luxor') },
      { name: 'Aswan — Day Trip by Train', description: 'Take the scenic train from Luxor to Aswan (3.5 hrs). Visit the High Dam, Philae Temple, and Nubian Museum. Return same day or stay overnight.', maps: maps('Luxor to Aswan Train Egypt'), booking: viator('luxor aswan day trip') },
      { name: 'Medinat Habu & Deir el-Medina', description: 'The perfectly preserved mortuary temple of Ramesses III and the workers\' village that built the royal tombs. Often overlooked but stunning. Just 2km from Valley of the Kings.', maps: maps('Medinat Habu Luxor Egypt'), booking: gyg('medinat habu luxor tour') },
    ],
  },

  aswan: {
    id: 'aswan',
    name: 'Aswan',
    country: 'Egypt',
    emoji: '🏛️',
    hero: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=1200&q=80',
    meta_title: 'Aswan Egypt Travel Guide 2026 — Temples, Nile, Nubian Culture & Things To Do',
    meta_description: 'Complete travel guide to Aswan, Egypt. Philae Temple, Abu Simbel, Nubian village, best restaurants and things to do in Aswan. Updated 2026.',
    intro: 'Aswan is Egypt\'s southernmost major city — a tranquil Nile-side town where Nubian culture colors every aspect of life. Known for its warm, dry climate, the island temple of Philae, the Abu Simbel temples, and some of the most genuine Nubian hospitality in the country. Aswan moves at a gentler pace than Cairo or Luxor.',

    beaches: [
      { name: 'Elephantine Island', description: 'Large Nile island facing Aswan Corniche. The island has sandy banks perfect for swimming and relaxing. Home to Nubian villages, an ancient nilometer, and the Aswan Museum.', maps: maps('Elephantine Island Aswan Egypt'), free: true },
      { name: 'Nubian Village Sandy Banks', description: 'The colorfully painted Nubian villages on the west bank of the Nile have quiet, sandy banks ideal for relaxing by the river. Reached by local motor boat.', maps: maps('Nubian Village West Bank Aswan Egypt'), free: true },
      { name: 'Aswan Corniche Nile Walk', description: 'The beautiful tree-lined promenade along the Nile in Aswan. Not a beach but the best place to enjoy the river, watch feluccas, and see the famous Aswan sunsets.', maps: maps('Aswan Corniche Nile Egypt'), free: true },
    ],

    cafes: [
      { name: 'Al Masry Restaurant & Cafe', description: 'Traditional cafe on the Aswan Corniche popular with locals and travelers. Strong Egyptian coffee, mint tea, and a shaded terrace overlooking the Nile. Very affordable.', maps: maps('Al Masry Restaurant Cafe Aswan Egypt') },
      { name: 'Nubian Cafe Elephantine Island', description: 'Unique cafe inside a Nubian house on Elephantine Island. Colorful Nubian decor, homemade cakes, and fresh Karkade (hibiscus) tea. Access by short boat ride.', maps: maps('Nubian Cafe Elephantine Island Aswan Egypt') },
      { name: 'Panorama Restaurant & Cafe', description: 'Rooftop cafe at the southern end of the Aswan Corniche with a sweeping view of the First Cataract, Elephantine Island, and the desert hills. Best views in Aswan.', maps: maps('Panorama Restaurant Cafe Aswan Nile View Egypt') },
      { name: 'Old Cataract Hotel Garden Terrace', description: 'The legendary Sofitel Legend Old Cataract hotel offers afternoon tea on its famous Nile terrace. Where Agatha Christie wrote Death on the Nile. Expensive but unforgettable.', maps: maps('Old Cataract Hotel Aswan Egypt') },
    ],

    restaurants: [
      { name: 'Nubian House Restaurant', cuisine: 'Nubian / Egyptian', price: '💰💰', description: 'Authentic Nubian cuisine in a traditional painted house on the Corniche. Fresh Nile fish, Nubian stews, lentil soup, and homemade bread. One of the best restaurants in Aswan.', maps: maps('Nubian House Restaurant Aswan Corniche Egypt') },
      { name: 'Panorama Restaurant Aswan', cuisine: 'Egyptian / International', price: '💰💰', description: 'Rooftop restaurant with the best Nile view in Aswan. Grilled meats, fresh fish, and Egyptian classics. Excellent at sunset. Good quality for the price.', maps: maps('Panorama Restaurant Aswan Egypt') },
      { name: 'El Masry Restaurant', cuisine: 'Egyptian Street Food', price: '💰', description: 'Cheap, delicious Egyptian fast food near the souk. Best koshari, ful medames, and falafel in Aswan. Open for breakfast and lunch. Locals only.', maps: maps('El Masry Restaurant Aswan Egypt') },
      { name: '1902 Restaurant — Old Cataract', cuisine: 'Fine Dining / Egyptian', price: '💰💰💰💰', description: 'The most historic restaurant in Egypt — inside the Victorian Old Cataract Hotel where Agatha Christie and Winston Churchill dined. Special occasion dining with Nile views.', maps: maps('1902 Restaurant Old Cataract Hotel Aswan Egypt') },
      { name: 'Aswan Moon Restaurant', cuisine: 'Egyptian / Nile Fish', price: '💰💰', description: 'Floating Nile restaurant famous for fresh bolti (tilapia) and Nile perch grilled with spices. Lovely deck seating over the water. Very popular with local families.', maps: maps('Aswan Moon Restaurant Nile Egypt') },
    ],

    supermarkets: [
      { name: 'Aswan Souq — Central Market', description: 'The vibrant traditional market in central Aswan. Buy Nubian spices, dried hibiscus, fresh produce, and locally made crafts. One of the most authentic markets in Egypt.', maps: maps('Aswan Souq Central Market Egypt') },
      { name: 'Metro Supermarket Aswan', description: 'Reliable Egyptian supermarket chain in Aswan. Good for groceries, water, and basic supplies.', maps: maps('Metro Supermarket Aswan Egypt') },
      { name: 'Aswan Centre Mall Supermarket', description: 'Small shopping center with a supermarket and basic shops in central Aswan. Convenient for tourists staying near the Corniche.', maps: maps('Aswan Centre Mall Egypt') },
    ],

    malls: [
      { name: 'Aswan Souq — Nubian Crafts', description: 'The best place in Egypt to buy authentic Nubian crafts — handwoven baskets, Nubian jewelry, colorful fabrics, and spices. Prices are lower here than in Luxor or Cairo.', maps: maps('Aswan Souk Nubian Crafts Egypt') },
      { name: 'Elephantine Island Craft Shops', description: 'Local Nubian artisans sell handmade goods on Elephantine Island. Genuine Nubian craftsmanship at fair prices directly from the makers.', maps: maps('Elephantine Island Craft Shops Aswan Egypt') },
    ],

    water_sports: [
      { name: 'Felucca Sailing — First Cataract', description: 'Traditional felucca sail around Elephantine Island and the First Cataract of the Nile. The classic Aswan experience. Negotiate price directly at the Corniche dock.', maps: maps('Felucca Aswan Nile Corniche Egypt'), booking: gyg('felucca aswan nile') },
      { name: 'Motor Boat to Nubian Village', description: 'Short motorboat ride to the west bank Nubian villages. Most boats include a brief tour of the village, home visit, and tea with a local family.', maps: maps('Motor Boat Nubian Village Aswan Egypt'), booking: viator('nubian village boat trip aswan') },
      { name: 'Kayaking on the Nile — Aswan', description: 'Guided kayak tours among the islands and through the cataract rocks. A peaceful way to explore the Nile\'s unique character at Aswan. For all fitness levels.', maps: maps('Kayaking Nile Aswan Egypt'), booking: gyg('kayaking aswan nile') },
    ],

    nightlife: [
      { name: 'Aswan Sound & Light — Philae Temple', description: 'Evening sound and light show at the beautiful island temple of Philae. Arrive by motorboat after dark. The reflection of the illuminated temple in the water is magical.', maps: maps('Philae Temple Sound Light Show Aswan Egypt') },
      { name: 'Corniche Evening Walk', description: 'After dark, the Aswan Corniche comes alive with families, vendors, and street performers. The most pleasant evening stroll in Upper Egypt. Ice cream and fresh juice stalls everywhere.', maps: maps('Aswan Corniche Evening Egypt') },
      { name: 'Rooftop Bars on the Corniche', description: 'Several Corniche hotels have rooftop bars with Nile views. The Isis Hotel and Movenpick on Elephantine Island both have pleasant evening drinking options.', maps: maps('Rooftop Bar Aswan Corniche Hotel Egypt') },
    ],

    family: [
      { name: 'Philae Temple (Island of Isis)', description: 'The most beautiful temple in Egypt — a Ptolemaic temple complex on a Nile island. Reached by motorboat from the Shellal dock. Magical for adults and children alike.', maps: maps('Philae Temple Aswan Egypt'), booking: viator('philae temple aswan boat trip') },
      { name: 'Nubian Village Tour', description: 'Visit a traditional Nubian village by boat. Meet local families, see colorful painted houses, hold a crocodile, eat Nubian food. Wonderful family cultural experience.', maps: maps('Nubian Village Tour Aswan Egypt'), booking: viator('nubian village aswan tour') },
      { name: 'Aswan High Dam', description: 'One of the world\'s largest dams — the Aswan High Dam holds back Lake Nasser and generates much of Egypt\'s electricity. Impressive engineering feat. Free to visit the viewpoint.', maps: maps('Aswan High Dam Egypt') },
      { name: 'Aswan Botanical Garden', description: 'Beautiful tropical garden on Kitchener\'s Island in the Nile. Reached by rowboat. Over 400 plant species from Africa and Asia. A peaceful escape from the city.', maps: maps('Aswan Botanical Garden Kitchener Island Egypt') },
    ],

    day_trips: [
      { name: 'Abu Simbel — Day Trip from Aswan', description: 'The most dramatic temples in Egypt — two massive rock-cut temples of Ramesses II relocated when the High Dam was built. 280km from Aswan. Day trip by convoy, flight available.', maps: maps('Abu Simbel Temples Egypt'), booking: viator('abu simbel day trip aswan') },
      { name: 'Kom Ombo Temple', description: 'Unique double temple dedicated to both Sobek (crocodile god) and Horus (falcon god). 65km north of Aswan. Easy day trip by bus or taxi. Stunning Nile setting.', maps: maps('Kom Ombo Temple Aswan Egypt'), booking: viator('kom ombo temple tour aswan') },
      { name: 'Edfu Temple', description: 'The best-preserved ancient Egyptian temple — dedicated to Horus, built 237–57 BC. 115km north of Aswan. Usually combined with Kom Ombo on a full day trip.', maps: maps('Edfu Temple Aswan Egypt'), booking: viator('edfu temple day trip aswan') },
      { name: 'Lake Nasser Cruise', description: 'Multi-day luxury cruise on Lake Nasser stopping at Abu Simbel, Qasr Ibrim, and Nubian temples. The most exclusive and remote Nile experience available in Egypt.', maps: maps('Lake Nasser Cruise Aswan Egypt'), booking: viator('lake nasser cruise egypt') },
    ],
  },

  'el-gouna': {
    id: 'el-gouna',
    name: 'El Gouna',
    country: 'Egypt',
    emoji: '🏝️',
    hero: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1200&q=80',
    meta_title: 'El Gouna Egypt Travel Guide 2026 — Lagoons, Beaches, Restaurants & Things To Do',
    meta_description: 'Complete travel guide to El Gouna, Egypt. Best beaches, lagoons, restaurants, water sports, nightlife and things to do in El Gouna. Updated 2026.',
    intro: 'El Gouna is a privately developed resort town 25km north of Hurghada — a self-contained lagoon city with 13 islands connected by bridges and waterways. Designed like a Mediterranean village, El Gouna is famous for world-class kitesurfing, boutique hotels, clean streets, and a cosmopolitan beach lifestyle unlike anywhere else in Egypt.',

    beaches: [
      { name: 'Mangroovy Beach', description: 'El Gouna\'s most famous beach — a long stretch of white sand on the Red Sea with excellent kitesurfing and windsurfing conditions. International kitesurfing competition venue. One of the top beaches in Egypt.', maps: maps('Mangroovy Beach El Gouna Egypt'), free: false },
      { name: 'Downtown Beach El Gouna', description: 'The main public beach in El Gouna\'s downtown area. Calm, shallow water ideal for swimming. Sun loungers, beach bars, and watersports available.', maps: maps('Downtown Beach El Gouna Egypt'), free: false },
      { name: 'Zeytuna Beach', description: 'Beautiful island beach connected by wooden bridge. Shallow lagoon water safe for children. Popular with families staying in El Gouna.', maps: maps('Zeytuna Beach El Gouna Egypt'), free: false },
      { name: 'Turtle Beach', description: 'Remote beach on the northern tip of El Gouna accessible by boat. Named for the sea turtles that nest here. Excellent snorkeling with minimal crowds.', maps: maps('Turtle Beach El Gouna Egypt'), free: false },
      { name: 'Three Corners Fayrouz Beach', description: 'Hotel beach with good facilities, water sports, and a reef accessible from shore. Good option for non-hotel guests as day passes are available.', maps: maps('Three Corners Beach El Gouna Egypt'), free: false },
    ],

    cafes: [
      { name: 'Brisa Cafe El Gouna Downtown', description: 'Stylish downtown cafe with freshly brewed coffee, light breakfasts, and smoothie bowls. Very popular with expats and digital nomads living in El Gouna. Best coffee in town.', maps: maps('Brisa Cafe El Gouna Egypt') },
      { name: 'Moods Beach Lounge', description: 'Beachfront lounge cafe at Mangroovy Beach. Cold press coffee, cocktails, and healthy food. Perfect spot for watching kitesurfers while enjoying a cold brew.', maps: maps('Moods Beach Lounge El Gouna Egypt') },
      { name: 'Cafe Barrinha', description: 'Waterfront cafe at Abu Tig Marina in El Gouna. Breakfast all day, excellent coffee, and a scenic marina terrace surrounded by yachts. Classic El Gouna atmosphere.', maps: maps('Cafe Barrinha Abu Tig Marina El Gouna Egypt') },
      { name: 'El Gouna Golf Club Cafe', description: 'Cafe at the famous El Gouna Golf Club with views of the course and lagoon. Good for quiet morning coffees away from the beach crowds.', maps: maps('El Gouna Golf Club Cafe Egypt') },
    ],

    restaurants: [
      { name: 'Moby Dick Restaurant', cuisine: 'Seafood / International', price: '💰💰💰', description: 'El Gouna\'s most celebrated restaurant at Abu Tig Marina. Fresh Red Sea seafood, grilled fish, and international cuisine. Marina views and sophisticated atmosphere.', maps: maps('Moby Dick Restaurant Abu Tig Marina El Gouna Egypt') },
      { name: 'Kokoo Restaurant', cuisine: 'International', price: '💰💰', description: 'Popular downtown restaurant in El Gouna. International menu with good pasta, burgers, and salads. Lively terrace on the main square. Consistent quality.', maps: maps('Kokoo Restaurant El Gouna Egypt') },
      { name: 'El Gouna Fishermen\'s Village', cuisine: 'Egyptian Seafood', price: '💰', description: 'Local fishermen\'s area near El Gouna where you can buy fresh fish and have it grilled on the spot. The most authentic and affordable seafood experience near El Gouna.', maps: maps('Fishermens Village El Gouna Egypt') },
      { name: 'Arabesque Cafe & Restaurant', cuisine: 'Egyptian / Middle Eastern', price: '💰💰', description: 'Egyptian food in a beautiful traditional setting in El Gouna downtown. Tagines, grilled meats, and fresh mezze. Good vegetarian options.', maps: maps('Arabesque Restaurant El Gouna Egypt') },
      { name: 'The Kangaroo Bar & Grill', cuisine: 'International / Grill', price: '💰💰', description: 'Popular sports bar and grill in El Gouna with Australian steaks, burgers, and international beers. Great for watching sports and socializing with the expat crowd.', maps: maps('Kangaroo Bar Grill El Gouna Egypt') },
    ],

    supermarkets: [
      { name: 'El Gouna Supermarket (Downtown)', description: 'Main supermarket in El Gouna downtown with imported goods, fresh produce, and most daily needs. Prices slightly higher than Hurghada due to the private town model.', maps: maps('Supermarket El Gouna Downtown Egypt') },
      { name: 'Al Ain Supermarket El Gouna', description: 'Alternative supermarket near the Abu Tig Marina area. Decent range of international products and a good deli counter.', maps: maps('Al Ain Supermarket El Gouna Egypt') },
    ],

    malls: [
      { name: 'El Gouna Downtown Shops', description: 'Pedestrianized downtown shopping area with boutique clothing, dive gear, kitesurfing equipment, local crafts, and jewelry. Most shops are small independent businesses.', maps: maps('El Gouna Downtown Shopping Egypt') },
      { name: 'Abu Tig Marina Boutiques', description: 'Upscale boutiques and shops around the Abu Tig Marina. Beachwear, jewelry, and gift shops. Higher end than the downtown area.', maps: maps('Abu Tig Marina Shopping El Gouna Egypt') },
    ],

    water_sports: [
      { name: 'Kitesurfing — Mangroovy Kite School', description: 'Mangroovy Beach is one of the world\'s premier kitesurfing destinations. Multiple IKO-certified schools offer lessons and equipment rental. Consistent thermal winds April–October.', maps: maps('Mangroovy Kite School El Gouna Egypt'), booking: viator('kitesurfing el gouna egypt') },
      { name: 'Windsurfing El Gouna', description: 'El Gouna\'s lagoon system provides ideal learning conditions for windsurfing. Several schools around the lagoons offer beginner to advanced lessons.', maps: maps('Windsurfing School El Gouna Egypt'), booking: gyg('windsurfing el gouna') },
      { name: 'Diving — Sub Aqua El Gouna', description: 'PADI-certified dive center in El Gouna with access to excellent local reefs and liveaboard trips. Good for all levels from beginner to technical divers.', maps: maps('Sub Aqua Dive Center El Gouna Egypt'), booking: viator('diving el gouna egypt') },
      { name: 'Lagoon Boat Tour El Gouna', description: 'Guided speedboat tour of El Gouna\'s beautiful lagoon system, visiting remote beaches, islands, and snorkel sites accessible only by boat.', maps: maps('Lagoon Boat Tour El Gouna Egypt'), booking: gyg('lagoon boat tour el gouna') },
      { name: 'Stand Up Paddleboarding', description: 'SUP boarding on El Gouna\'s calm lagoons. Equipment rental widely available. Perfect for all ages on flat, sheltered water.', maps: maps('SUP Paddleboarding El Gouna Lagoon Egypt'), booking: gyg('sup el gouna egypt') },
    ],

    nightlife: [
      { name: 'Moods El Gouna', description: 'The main nightlife venue in El Gouna — beach club that transforms into a nightclub after dark. DJ sets, dancing, and cocktails on the beach. Most popular among El Gouna\'s young crowd.', maps: maps('Moods El Gouna Beach Club Egypt') },
      { name: 'Abu Tig Marina Bar Strip', description: 'The marina comes alive at night with a row of bars and restaurants. Great atmosphere for evening drinks watching the superyachts. Lively but not rowdy.', maps: maps('Abu Tig Marina Bars El Gouna Egypt') },
      { name: 'Club 10 El Gouna', description: 'Regular live music and DJ events in El Gouna\'s downtown. Indoor venue with good acoustics and a mixed international crowd.', maps: maps('Club 10 El Gouna Egypt') },
    ],

    family: [
      { name: 'El Gouna Aquarium', description: 'Small but well-presented aquarium in El Gouna showcasing Red Sea marine life. Good introduction for children before their first snorkeling experience.', maps: maps('El Gouna Aquarium Egypt') },
      { name: 'Lagoon Swimming for Kids', description: 'El Gouna\'s shallow lagoons are perfect for young children — flat, calm, warm water with no waves or currents. Many family-friendly beaches around the lagoon system.', maps: maps('El Gouna Lagoon Family Beach Egypt') },
      { name: 'Golf — El Gouna Golf Club', description: '18-hole championship golf course designed by Gene Bates. Family golf rounds available. One of the best golf courses in Africa with stunning desert and sea views.', maps: maps('El Gouna Golf Club Egypt'), booking: viator('golf el gouna egypt') },
      { name: 'Quad Biking Desert Tour', description: 'Family-friendly quad bike tours into the Eastern Desert around El Gouna. See the dramatic desert landscape away from the beach. Suitable for older children.', maps: maps('Quad Biking El Gouna Desert Egypt'), booking: gyg('quad bike el gouna desert') },
    ],

    day_trips: [
      { name: 'Hurghada Day Trip', description: 'El Gouna is just 25 minutes from Hurghada. Day trips to Hurghada\'s Grand Aquarium, Senzo Mall, or Mahmya Island boat trip are easily done.', maps: maps('Hurghada City Center Egypt'), booking: gyg('hurghada day trip el gouna') },
      { name: 'Red Sea Snorkeling Islands', description: 'Boat trips from El Gouna to the outer Red Sea reefs and islands — some of the most pristine coral gardens in the northern Red Sea, away from the Hurghada crowds.', maps: maps('Red Sea Islands Snorkeling El Gouna Egypt'), booking: viator('snorkeling el gouna red sea islands') },
      { name: 'Wadi El Gemal National Park', description: 'Remote nature reserve 200km south with pristine coral reefs, mangroves, and desert. Best snorkeling in the northern Red Sea region. Full day excursion.', maps: maps('Wadi El Gemal National Park Egypt'), booking: viator('wadi el gemal day trip') },
    ],
  },
};

export const CITY_GUIDE_LIST = Object.values(CITY_GUIDE);
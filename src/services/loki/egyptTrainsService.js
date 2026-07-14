// /**
//  * EgyptTrains.com Integration
//  * Fetches real-time train prices and schedules
//  */

// const EGYPT_TRAINS_API = 'https://egypttrains.com/api';

// export async function fetchTrainPrices(from, to, date = null) {
//     try {
//         const apiKey =
//             import.meta.env?.VITE_EGYPTTRAINS_API_KEY;
//         if (!apiKey) {
//             return {
//                 text: `🚂 **EgyptTrains Data** (Community prices):
// - Cairo → Luxor: 150–300 EGP (AC sleeper) | 50–100 EGP (2nd class)
// - Cairo → Aswan: 250–400 EGP (sleeper)
// - Hurghada → Safaga: Local ferry only
// [Book on EgyptTrains.com](https://egypttrains.com)`,
//                 source: 'Community data'
//             };
//         }

//         const params = new URLSearchParams({
//             from: from || 'cairo',
//             to: to || 'luxor',
//             date: date || new Date().toISOString().split('T')[0],
//         });

//         const res = await fetch(`${EGYPT_TRAINS_API}/prices?${params}`, {
//             headers: { 'Authorization': `Bearer ${apiKey}` }
//         });

//         if (!res.ok) throw new Error('API error');

//         const data = await res.json();
//         if (!data.trains?.length) return { text: '', source: 'no-data' };

//         const formatted = data.trains.slice(0, 5).map(t =>
//             `- **${t.departure} → ${t.arrival}**: ${t.price} EGP (${t.class})`
//         ).join('\n');

//         return {
//             text: `🚂 **Train Prices** (${data.date}):\n${formatted}\n[Book now](https://egypttrains.com)`,
//             source: 'EgyptTrains.com'
//         };
//     } catch (err) {
//         console.warn('[EgyptTrains API]', err.message);
//         return { text: '', source: 'error' };
//     }
// }

// export async function fetchTrainSchedules(cityId) {
//     const schedules = {
//         'cairo': ['Cairo → Luxor (10:00 PM)', 'Cairo → Aswan (7:00 PM)', 'Cairo → Alexandria (6:00 AM)'],
//         'hurghada': ['Limited sleeper to Safaga'],
//         'luxor': ['Luxor → Cairo (9:00 PM)', 'Luxor → Aswan (6:00 AM)'],
//         'aswan': ['Aswan → Cairo (6:00 PM)', 'Aswan → Luxor (7:00 PM)'],
//     };
//     return schedules[cityId] || [];
// }
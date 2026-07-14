# LOKI AI — Egypt Tourism Assistant

## Overview
LOKI is an intelligent AI-powered tourism guide for Egypt, built on **Gemini 2.5 Flash** and integrated with multiple data sources.

## Features

### ✅ Tourism-Only Scope
- **Trains**: EgyptTrains.com integration
- **Transport**: Taxi pricing, buses, ride-sharing (Careem, Uber)
- **Hotels**: Prices, locations, booking links
- **Restaurants**: Menus, prices, Google Maps links
- **Prices**: Fair vs scam pricing
- **Safety**: Scam detection, real-time alerts
- **Activities**: Tours, diving, museums

### 📊 Data Sources
1. **Telegram Groups** (847+ active members)
   - Sharm Expats
   - Sharm El Sheikh Live
   - Hurghada Chat
   - Idakvam Egypt
   - Dahab Chat

2. **Facebook Communities** (15+ groups)
   - Egypt Expat Living Groups
   - Egypt Hotels & Deals

3. **External APIs**
   - EgyptTrains.com (trains)
   - Numbeo (cost-of-living)
   - Google Maps (locations)
   - Careem / Uber (transport)

4. **Reddit** (r/Egypt, r/travel, r/solotravel, r/backpacking)

## Usage

### Quick Commands
```
🚂 Cairo → Luxor train
🚕 Fair taxi Hurghada
🍽️ Restaurants Sharm
🏨 Hotels El Gouna
💰 Currency rates
🛡️ Safety in Luxor
```

### Conversational
Just ask naturally:
- "How much should I pay for a taxi in Hurghada?"
- "Best restaurants in Sharm with prices?"
- "Is it safe to visit Aswan right now?"

## Architecture

```
LokiFloatingWidget (UI)
  └─ LokiChat (Main Chat Interface)
      └─ buildLokiContext (Data Aggregation)
          ├─ scamDataService
          ├─ numbeoService
          ├─ egyptTrainsService
          ├─ communityIntelligenceService
          ├─ communityDataService
          └─ contextCache (Smart Caching)

systemPrompt (Gemini Instructions)
  └─ Enforces tourism-only scope
  └─ Requires source attribution
  └─ Formats responses with links
```

## Configuration

### Environment Variables
```env
# .env file
VITE_GEMINI_API_KEY=your_key_here
VITE_NUMBEO_API_KEY=optional
VITE_SCAM_DETECTOR_API_KEY=optional
VITE_EGYPTTRAINS_API_KEY=optional
VITE_GOOGLE_MAPS_API_KEY=optional

# Telegram (for future integrations)
TELEGRAM_APP_ID=35537740
TELEGRAM_APP_HASH=819b27f0f66b595173d468a0db3f56a4

# LOKI Settings
VITE_LOKI_MODEL=gemini-2.5-flash
VITE_LOKI_MAX_TOKENS=900
VITE_LOKI_TEMPERATURE=0.3
VITE_LOKI_RESPONSE_TIMEOUT=8000
```

## Performance

### Caching Strategy
- **Default**: 5 minutes
- **Currency**: 1 hour (static data)
- **Community**: 3 minutes (real-time)
- **Max Cache Size**: 50 entries (LRU eviction)

### Optimizations
- Request deduplication
- Parallel data fetching
- Lazy loading
- Adaptive timeouts based on network speed
- Code splitting (Gemini, Markdown, LOKI chunks)

## Response Format

### Example Response
```
Fair taxi price from Hurghada airport to Marina: 150–200 EGP (Careem)
or 250–350 EGP (traditional taxi).

**Scam Alert:** Touts at the airport may quote 500+ EGP. 
**Better option:** Use Careem app or walk to main road.

**📚 Sources**:
• [Telegram: Hurghada Chat](https://t.me/HurghadaChat1/1) — 200+ locals
• [Careem App](https://www.careem.com) — Real-time pricing
• [Google Maps](https://maps.google.com) — Navigation & reviews
```

## Integration Points

### Add to Pages
```jsx
import { useOutletContext } from 'react-router-dom';

export default function MyPage() {
  const { openAIChat } = useOutletContext();
  
  return (
    <button onClick={openAIChat}>
      Ask LOKI
    </button>
  );
}
```

### Floating Widget (Global)
The LOKI widget appears on all pages automatically via `Layout.jsx`.

## Cities Supported
- Cairo
- Hurghada
- Sharm El Sheikh
- Luxor
- Aswan
- El Gouna
- Dahab

## Future Enhancements
- [ ] Live Telegram message parsing
- [ ] Real-time Facebook scraping
- [ ] Reddit API integration
- [ ] Multi-language responses
- [ ] Voice input/output
- [ ] Scam detector ML model
- [ ] Personalized recommendations

## Troubleshooting

### No response / timeout
- Check VITE_GEMINI_API_KEY is set
- Verify network connection
- Try again (API may be slow)

### Only generic answers
- Check if context data is loaded
- Verify city detection (ask with city name)
- Check system prompt in build logs

### Scam data not showing
- Ensure scamDataService is loaded
- Check localApi.entities.ScamReport access

## Support
- Report issues on GitHub
- Ask for manual updates in Telegram groups
- Feature requests welcome!

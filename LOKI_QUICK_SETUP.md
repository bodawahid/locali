# LOKI AI — Quick Setup Guide

## 🚀 Getting Started

### Step 1: Update `.env`
```env
# Required
VITE_GEMINI_API_KEY=your-api-key-from-https://aistudio.google.com/apikey

# Optional but recommended
VITE_NUMBEO_API_KEY=from-https://www.numbeo.com/common/api.jsp
VITE_EGYPTTRAINS_API_KEY=if-you-have-one

# Telegram (Already configured)
TELEGRAM_APP_ID=35537740
TELEGRAM_APP_HASH=819b27f0f66b595173d468a0db3f56a4

# LOKI Settings (Adjust for performance)
VITE_LOKI_MODEL=gemini-2.5-flash
VITE_LOKI_MAX_TOKENS=900
VITE_LOKI_TEMPERATURE=0.3
VITE_LOKI_RESPONSE_TIMEOUT=8000
```

### Step 2: Install Dependencies (if needed)
```bash
npm install @google/generative-ai react-markdown
```

### Step 3: Run Development Server
```bash
npm run dev
```

### Step 4: Test LOKI
- Click the **LOKI AI** button (bottom-right, fixed)
- Ask: "How much for train Cairo to Luxor?"
- Or: "Fair taxi price Hurghada airport?"

## 📱 Community Data Sources

### Telegram Groups (Real-Time)
- **Sharm Expats**: https://t.me/SharmExpats
- **Sharm El Sheikh Live**: https://t.me/Sharm_el_Sheikh_live
- **Hurghada Chat**: https://t.me/HurghadaChat1/1
- **Dahab Chat**: https://t.me/dahabchat/1
- **Idakvam Egypt**: https://t.me/idakvam_egypt

### Facebook Communities
- 15+ Egypt Expat Living Groups
- Hotels & Deals: https://www.facebook.com/share/1BE9D6fnRZ/

### External APIs
- **EgyptTrains**: https://egypttrains.com
- **Numbeo**: https://www.numbeo.com
- **Google Maps**: https://maps.google.com
- **Careem**: https://www.careem.com
- **Uber**: https://www.uber.com/en-EG/

## 🎯 Customization

### Add Custom Cities
Edit `src/lib/loki/queryIntent.js`:
```javascript
export function detectCity(text = '') {
  const t = text.toLowerCase();
  const map = {
    'cairo': 'cairo',
    'hurghada': 'hurghada',
    'my-city': 'my-city', // Add here
    // ...
  };
}
```

### Change Response Tone
Edit `src/lib/loki/systemPrompt.js` → LOKI personality section

### Adjust Response Length
Update `VITE_LOKI_MAX_TOKENS` in `.env` (lower = faster, higher = detailed)

### Modify Data Sources
See `src/lib/loki/dataSources.js` for comprehensive list

## 🐛 Debugging

### Enable Console Logs
```javascript
// In LokiChat.jsx
console.log('[LOKI Context]', { contextBlock, intent });
console.log('[LOKI Response]', full);
```

### Check Cache
```javascript
// Browser console
import { getCachedContext, CACHE } from '@/lib/loki/contextCache'
// Check what's cached
```

### Test APIs
```bash
# Test Numbeo
curl "https://www.numbeo.com/api/city_prices?api_key=YOUR_KEY&query=Hurghada,Egypt"

# Test EgyptTrains (if configured)
curl "https://egypttrains.com/api/prices..."
```

## 📊 Performance Tuning

### For Slow Networks
```env
VITE_LOKI_RESPONSE_TIMEOUT=3000  # Lower timeout
VITE_LOKI_MAX_TOKENS=500         # Shorter responses
```

### For Rich Responses
```env
VITE_LOKI_RESPONSE_TIMEOUT=8000  # More wait time
VITE_LOKI_MAX_TOKENS=1200        # More detailed
```

### For Mobile
```env
VITE_LOKI_TEMPERATURE=0.2        # More predictable
```

## ✅ Deployment Checklist

- [ ] Set `VITE_GEMINI_API_KEY` in production `.env`
- [ ] Enable `VITE_NUMBEO_API_KEY` if available
- [ ] Test on mobile (button should be fixed bottom-right)
- [ ] Verify all Telegram group links work
- [ ] Check scam data loads for all 5 cities
- [ ] Monitor API response times
- [ ] Set up error logging

## 🎨 Widget Customization

### Change Button Color
`src/components/loki/LokiFloatingWidget.jsx`:
```jsx
// Change gradient
className="bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-600"
// To your colors
```

### Change Position
```jsx
// From bottom-right to top-right:
className="fixed z-[9999] ... top-6 right-5"
```

### Hide on Mobile
```jsx
// Add hidden md:block to button
className="hidden md:block"
```

## 📞 Support

- Check logs in browser DevTools (F12 → Console)
- Verify all API keys are correct
- Test Telegram group access from your location
- Report issues with specific queries

## 🚀 What's Next

- [ ] Integrate live Telegram message parsing
- [ ] Add voice input
- [ ] Multi-language support
- [ ] Reddit live API sync
- [ ] Scam ML model
- [ ] User preferences (language, detail level)

---

**LOKI is ready! 🛡️ Enjoy helping travelers!**

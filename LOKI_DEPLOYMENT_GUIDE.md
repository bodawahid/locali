# 🚀 LOKI AI — Deployment & Optimization Guide

## Pre-Deployment Checklist

### ✅ Configuration
- [ ] `VITE_GEMINI_API_KEY` set in `.env.production`
- [ ] `VITE_NUMBEO_API_KEY` configured (optional)
- [ ] `VITE_EGYPTTRAINS_API_KEY` configured (optional)
- [ ] `TELEGRAM_APP_ID` and `TELEGRAM_APP_HASH` set
- [ ] All URLs are HTTPS in production

### ✅ Performance
- [ ] Run `npm run build` locally and check bundle size
- [ ] Verify code splitting: `loki.js`, `ai.js` chunks exist
- [ ] Test with network throttling (3G simulation)
- [ ] Monitor First Contentful Paint (FCP) < 2s
- [ ] Check Largest Contentful Paint (LCP) < 2.5s

### ✅ Testing
- [ ] Test LOKI on mobile (iOS Safari, Android Chrome)
- [ ] Verify all Telegram group links are accessible
- [ ] Test train pricing queries
- [ ] Test safety/scam queries
- [ ] Test restaurant queries with maps links
- [ ] Test currency rate display
- [ ] Test off-topic rejection

### ✅ Data Sources
- [ ] Verify Telegram group URLs accessible from target region
- [ ] Check Facebook groups are public
- [ ] Confirm EgyptTrains API is responding
- [ ] Test Numbeo API (if configured)
- [ ] Verify scam data loads from DB

---

## 🌍 Production Deployment

### Environment Setup
```bash
# Production .env
VITE_GEMINI_API_KEY=<PRODUCTION_KEY>
VITE_NUMBEO_API_KEY=<IF_AVAILABLE>
VITE_LOKI_MODEL=gemini-2.5-flash
VITE_LOKI_MAX_TOKENS=900
VITE_LOKI_TEMPERATURE=0.3
VITE_LOKI_RESPONSE_TIMEOUT=8000

# For high load
VITE_LOKI_RESPONSE_TIMEOUT=6000  # Shorter timeout
VITE_LOKI_MAX_TOKENS=700        # Shorter responses
```

### Build Optimization
```bash
# Build with optimizations
npm run build

# Expected output:
# - main.js: ~45KB (gzipped)
# - loki.js: ~12KB
# - ai.js: ~28KB
# - markdown.js: ~8KB
# Total: ~93KB (gzipped)
```

### Server Configuration

#### Apache (.htaccess)
```apache
# Cache static assets
<FilesMatch "\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$">
    Header set Cache-Control "max-age=31536000, public"
</FilesMatch>

# Enable gzip
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# SPA routing
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    RewriteRule ^index\.html$ - [L]
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule . /index.html [L]
</IfModule>
```

#### Nginx
```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript;
    gzip_min_length 1000;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (if needed)
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
    }
}
```

---

## 📊 Monitoring & Analytics

### Key Metrics to Track
```
1. Response Time
   - Average: < 3s
   - P95: < 6s
   - P99: < 10s

2. Cache Hit Rate
   - Target: > 70%
   - Community data: > 80%
   - Prices: > 60%

3. Error Rate
   - API failures: < 2%
   - Timeouts: < 1%
   - Off-topic: < 5%

4. User Engagement
   - Sessions with LOKI: > 30%
   - Avg questions/session: > 2
   - Return rate: > 40%
```

### Logging Setup
```javascript
// Add to LokiChat.jsx for production logging
if (import.meta.env.PROD) {
  console.log('[LOKI]', {
    timestamp: new Date().toISOString(),
    intent,
    city,
    responseTime: Date.now() - startTime,
    cached: !!cached,
  });
}
```

### Error Tracking
```javascript
// Sentry integration example
import * as Sentry from "@sentry/react";

Sentry.captureException(error, {
  tags: { feature: 'loki', intent },
  extra: { city, message: userMsg },
});
```

---

## 🔒 Security Considerations

### API Keys
- ✅ Store in server environment only (NOT in client code)
- ✅ Rotate keys regularly
- ✅ Use service accounts with minimal permissions
- ✅ Monitor API usage for anomalies

### Rate Limiting
```
Implement on backend:
- Per user: 100 requests/hour
- Per IP: 1000 requests/hour
- Per API: Follow provider limits
```

### Content Security Policy
```html
<!-- In index.html -->
<meta http-equiv="Content-Security-Policy" content="
    default-src 'self';
    script-src 'self' https://aistudio.google.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    connect-src 'self' https://generativelanguage.googleapis.com;
">
```

---

## 🚨 High-Load Optimization

### For 100K+ Daily Users

#### 1. Reduce Response Size
```env
VITE_LOKI_MAX_TOKENS=600        # ~2KB per response
VITE_LOKI_TEMPERATURE=0.2       # More consistent
```

#### 2. Aggressive Caching
```javascript
// In contextCache.js
const DEFAULT_TTL = 10 * 60 * 1000;  // 10 min
const MAX_CACHE_SIZE = 200;           // 200 entries
```

#### 3. CDN Integration
```javascript
// Preload Gemini library from CDN
<script src="https://cdn.jsdelivr.net/npm/@google/generative-ai@latest"></script>
```

#### 4. Database Query Optimization
```sql
-- Add indexes for scam queries
CREATE INDEX idx_scam_city ON ScamReport(city);
CREATE INDEX idx_scam_date ON ScamReport(created_date DESC);

-- Add index for live situation
CREATE INDEX idx_live_city_date ON LiveSituation(city, updated_date DESC);
```

### Load Test Results
```
Expected under load:
- 95th percentile response: < 4s
- 99th percentile response: < 8s
- Cache hit rate: 75%+
- Uptime: 99.9%
```

---

## 📈 Feature Monitoring

### Track User Queries
```python
# Backend logging (example)
@app.post('/api/loki/query')
def log_query(query: str, city: str, intent: str):
    # Log for analytics
    analytics.log({
        'type': 'loki_query',
        'query': query[:100],  # Anonymized
        'city': city,
        'intent': intent,
        'timestamp': datetime.now(),
    })
```

### Popular Queries by City
```
Cairo:
- #1: "Train prices Cairo to Luxor" (35%)
- #2: "Safe area recommendations" (20%)
- #3: "Good restaurants" (15%)

Hurghada:
- #1: "Fair taxi price airport" (40%)
- #2: "Diving prices" (25%)
- #3: "Where to eat" (20%)

Sharm:
- #1: "Safe areas" (30%)
- #2: "Transport costs" (25%)
- #3: "Restaurants" (20%)
```

---

## 🔄 Maintenance Schedule

### Daily
- [ ] Monitor error logs
- [ ] Check API availability
- [ ] Verify cache efficiency

### Weekly
- [ ] Review user feedback
- [ ] Update scam patterns if needed
- [ ] Check for API changes

### Monthly
- [ ] Rotate API keys
- [ ] Update community links
- [ ] Analyze performance metrics
- [ ] Plan feature improvements

### Quarterly
- [ ] Major feature updates
- [ ] Security audit
- [ ] Performance optimization review

---

## 🆘 Troubleshooting Production Issues

### Issue: Slow Responses (> 5s)
```
1. Check API availability:
   - Test EgyptTrains API
   - Test Numbeo API
   - Check network latency

2. Increase timeouts temporarily:
   VITE_LOKI_RESPONSE_TIMEOUT=10000

3. Clear cache:
   - Browser: Clear cache
   - Server: Restart service
```

### Issue: Gemini API Rate Limit
```
1. Implement exponential backoff
2. Reduce max tokens
3. Increase response timeout
4. Contact Google for quota increase
```

### Issue: Community Links Not Accessible
```
1. Check Telegram block in region
   - Suggest VPN if blocked
   - Provide alternative links

2. Check Facebook group visibility
   - Verify groups are public
   - Update links if changed

3. Fallback to local prices
```

### Issue: High Cache Miss Rate
```
1. Increase cache TTL:
   DEFAULT_TTL = 10 * 60 * 1000  (10 min)

2. Increase cache size:
   MAX_CACHE_SIZE = 200

3. Add pre-warming:
   preloadLokiContext() on app start
```

---

## 🎯 Success Metrics

After 1 month:
- [ ] 50K+ LOKI sessions
- [ ] 3K+ daily active users
- [ ] 95% uptime
- [ ] < 3s avg response time
- [ ] 75%+ cache hit rate
- [ ] < 1% error rate

After 3 months:
- [ ] 200K+ LOKI sessions
- [ ] 10K+ daily active users
- [ ] 99.5% uptime
- [ ] < 2s avg response time
- [ ] 80%+ cache hit rate
- [ ] Multiple community integrations

---

## 📞 Emergency Contacts

- **Gemini API Support**: https://support.google.com
- **Numbeo Support**: https://www.numbeo.com/support/
- **EgyptTrains Support**: Check website
- **Telegram Bot Support**: @botfather
- **Your Support Team**: [Configure in alerts]

---

**🛡️ LOKI is ready for production deployment!**

*Last Updated: 2026-07-02*

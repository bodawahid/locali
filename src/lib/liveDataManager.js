import { base44 } from '@/api/base44Client';

// Live Data Manager — handles real-time data with caching and fallbacks
// Ensures all displayed data is current and properly timestamped

const CACHE_DURATIONS = {
  currency_rates: 60 * 60 * 1000, // 1 hour
  service_prices: 6 * 60 * 60 * 1000, // 6 hours
  live_situation: 60 * 60 * 1000, // 1 hour
};

class LiveDataManager {
  constructor() {
    this.cache = new Map();
    this.lastFetchTime = new Map();
  }

  isCacheValid(key, duration) {
    const lastFetch = this.lastFetchTime.get(key);
    if (!lastFetch) return false;
    return Date.now() - lastFetch < duration;
  }

  async getCurrencyRates(forceRefresh = false) {
    const cacheKey = 'currency_rates';

    if (!forceRefresh && this.isCacheValid(cacheKey, CACHE_DURATIONS.currency_rates)) {
      return this.cache.get(cacheKey);
    }

    try {
      // Fetch latest rates from database (updated by automation)
      const rates = await base44.entities.CurrencyRate.list('-created_date', 1);
      
      if (rates.length === 0) {
        console.warn('No currency rates found in database');
        return this.getFallbackRates();
      }

      const latestRate = rates[0];

      // Check if data is stale (older than 2 hours)
      const lastUpdateTime = new Date(latestRate.created_date).getTime();
      const ageMinutes = (Date.now() - lastUpdateTime) / (1000 * 60);

      if (ageMinutes > 120) {
        console.warn(`Currency rates data is ${ageMinutes} minutes old — consider refreshing`);
      }

      const data = {
        ...latestRate,
        is_stale: ageMinutes > 120,
        age_minutes: Math.round(ageMinutes),
        last_updated: new Date(latestRate.created_date).toLocaleString(),
      };

      this.cache.set(cacheKey, data);
      this.lastFetchTime.set(cacheKey, Date.now());

      return data;
    } catch (error) {
      console.error('Error fetching currency rates:', error);
      return this.getFallbackRates();
    }
  }

  getFallbackRates() {
    // Emergency fallback rates (should rarely be used)
    return {
      usd: 50,
      eur: 55,
      gbp: 63,
      rub: 0.5,
      pln: 12.5,
      cad: 36,
      aud: 32,
      sar: 13.5,
      rate_date: new Date().toISOString().split('T')[0],
      source: 'fallback_emergency',
      is_stale: true,
      alert: '⚠️ Using emergency fallback rates — live data unavailable',
      last_updated: new Date().toLocaleString(),
    };
  }

  async getServicePrice(serviceName, city) {
    const cacheKey = `service_${serviceName}_${city}`;

    if (this.isCacheValid(cacheKey, CACHE_DURATIONS.service_prices)) {
      return this.cache.get(cacheKey);
    }

    try {
      const services = await base44.entities.Service.filter({
        name: serviceName,
        city: city,
      }, '-updated_date', 1);

      if (services.length === 0) {
        return null;
      }

      const service = services[0];
      const lastUpdateTime = new Date(service.updated_date).getTime();
      const ageHours = (Date.now() - lastUpdateTime) / (1000 * 60 * 60);

      const data = {
        ...service,
        is_stale: ageHours > 24,
        age_hours: Math.round(ageHours),
        last_updated: new Date(service.updated_date).toLocaleString(),
        data_freshness: ageHours < 6 ? 'fresh' : ageHours < 24 ? 'okay' : 'stale',
      };

      this.cache.set(cacheKey, data);
      this.lastFetchTime.set(cacheKey, Date.now());

      return data;
    } catch (error) {
      console.error(`Error fetching service ${serviceName}:`, error);
      return null;
    }
  }

  async getLiveSituation(city) {
    const cacheKey = `live_situation_${city}`;

    if (this.isCacheValid(cacheKey, CACHE_DURATIONS.live_situation)) {
      return this.cache.get(cacheKey);
    }

    try {
      const situations = await base44.entities.LiveSituation.filter({
        city: city,
      }, '-update_date', 1);

      if (situations.length === 0) {
        return null;
      }

      const situation = situations[0];
      const updateTime = new Date(situation.update_date).getTime();
      const ageHours = (Date.now() - updateTime) / (1000 * 60 * 60);

      const data = {
        ...situation,
        is_stale: ageHours > 24,
        age_hours: Math.round(ageHours),
        last_updated: new Date(situation.update_date).toLocaleString(),
      };

      this.cache.set(cacheKey, data);
      this.lastFetchTime.set(cacheKey, Date.now());

      return data;
    } catch (error) {
      console.error(`Error fetching live situation for ${city}:`, error);
      return null;
    }
  }

  clearCache() {
    this.cache.clear();
    this.lastFetchTime.clear();
  }

  getCacheStats() {
    return {
      cached_items: this.cache.size,
      cache_size_kb: new Blob([JSON.stringify(Array.from(this.cache))]).size / 1024,
      cached_keys: Array.from(this.cache.keys()),
    };
  }
}

// Export singleton instance
export const liveDataManager = new LiveDataManager();

// Auto-clear cache every 30 minutes to prevent memory buildup
setInterval(() => {
  liveDataManager.clearCache();
}, 30 * 60 * 1000);
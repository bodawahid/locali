// @ts-nocheck
/**
 * Base44 Client - API Communication Layer
 * UPDATED FOR LOCAL XAMPP PHP API
 * 
 * Base URL: http://localhost/locali-api/api.php
 * Database: locali_egypt (local XAMPP MySQL)
 * 
 * This client communicates directly with the PHP router instead of Node.js backend.
 */

import axios from 'axios';

// Point to local XAMPP PHP API instead of Node backend
const API_BASE = import.meta.env?.VITE_API_BASE_URL || 'http://localhost/locali-api/api.php';
const TOKEN_STORAGE_KEY = 'locali_auth_token';

const http = axios.create({ 
  baseURL: API_BASE, 
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor to add auth token
http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor to handle auth errors
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem('locali_auth_user');
      // Optionally redirect to login
    }
    return Promise.reject(error);
  }
);

function setAuthHeader(token) {
  if (token) {
    http.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    delete http.defaults.headers.common.Authorization;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

const savedToken = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
if (savedToken) setAuthHeader(savedToken);

function buildQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    query.append(key, value);
  });
  return query.toString() ? `?${query.toString()}` : '';
}

const ENTITY_MAP = {
  CurrencyRate: 'currency-rates',
  HomeContent: 'home-content',
  Service: 'services',
  Place: 'places',
  PriceEntry: 'price-entries',
  PriceGuide: 'price-entries',
  ScamReport: 'scam-reports',
  VerifiedDriver: 'verified-drivers',
  LiveSituation: 'live-situations',
  Listing: 'listings',
  Review: 'reviews',
  Guide: 'guides',
  BoatTrip: 'boat-trips',
  Apartment: 'apartments',
  HorseRiding: 'horse-ridings',
  LocalContact: 'local-contacts',
  RemoteWorkSpot: 'remote-work-spots',
  NightlifeVenue: 'nightlife-venues',
  LongStayService: 'long-stay-services',
  TourOperator: 'tour-operators',
  TouristDeal: 'tourist-deals',
  TouristStory: 'tourist-stories',
  SavedItinerary: 'saved-itineraries',
  HiddenGemPlace: 'hidden-gem-places',
  LocalQuestion: 'local-questions',
  RideShare: 'ride-shares',
  PriceEntry: 'price-entries',
  PriceInsight: 'price-insights',
};

function getEndpoint(entityName) {
  if (ENTITY_MAP[entityName]) return `/${ENTITY_MAP[entityName]}`;
  return `/${entityName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()}s`;
}

function makeEntity(entityName) {
  const base = getEndpoint(entityName);

  return {
    list: async (sort = '', limit = 100, page = 1) => {
      const query = buildQuery({ sort, limit, page });
      try {
        const res = await http.get(`${base}${query}`);
        return res.data || [];
      } catch (err) {
        console.error(`Error fetching ${base}:`, err);
        return [];
      }
    },

    filter: async (filters = {}, sort = '', limit = 100, page = 1) => {
      const query = buildQuery({ ...filters, sort, limit, page });
      try {
        const res = await http.get(`${base}${query}`);
        return res.data || [];
      } catch (err) {
        console.error(`Error filtering ${base}:`, err);
        return [];
      }
    },

    get: async (id) => {
      try {
        const res = await http.get(`${base}/${id}`);
        return res.data || null;
      } catch (err) {
        console.error(`Error getting ${base}/${id}:`, err);
        return null;
      }
    },

    create: async (payload) => {
      try {
        const res = await http.post(base, payload);
        return res.data;
      } catch (err) {
        console.error(`Error creating ${base}:`, err);
        throw err;
      }
    },

    update: async (id, payload) => {
      try {
        const res = await http.put(`${base}/${id}`, payload);
        return res.data;
      } catch (err) {
        console.error(`Error updating ${base}/${id}:`, err);
        throw err;
      }
    },

    delete: async (id) => {
      try {
        const res = await http.delete(`${base}/${id}`);
        return res.data;
      } catch (err) {
        console.error(`Error deleting ${base}/${id}:`, err);
        throw err;
      }
    },

    subscribe: () => {
      // Local backend does not currently support real-time subscriptions
      return () => {};
    },
  };
}

const auth = {
  me: async () => {
    try {
      const res = await http.get('/auth/me');
      return res.data;
    } catch (err) {
      throw err;
    }
  },

  login: async (email, password) => {
    try {
      const res = await http.post('/auth/login', { email, password });
      const token = res.data?.token;
      if (token) {
        setAuthHeader(token);
      }
      return res.data;
    } catch (err) {
      console.error('Login error:', err);
      throw err;
    }
  },

  register: async (name, email, password, role = 'traveler') => {
    try {
      const res = await http.post('/auth/register', { 
        name, 
        email, 
        password, 
        role 
      });
      const token = res.data?.token;
      if (token) {
        setAuthHeader(token);
      }
      return res.data;
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    }
  },

  logout: () => {
    setAuthHeader(null);
  },

  redirectToLogin: (redirectUrl) => {
    window.location.href = `/login?redirect=${encodeURIComponent(redirectUrl || '/')}`;
  },

  isAuthenticated: async () => {
    try {
      await auth.me();
      return true;
    } catch (err) {
      return false;
    }
  },
};

function functionPath(name) {
  return name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

const functions = {
  invoke: async (fnName, payload = {}) => {
    try {
      const res = await http.post(`/functions/${functionPath(fnName)}`, payload);
      return res.data;
    } catch (err) {
      console.error(`Error invoking function ${fnName}:`, err);
      throw err;
    }
  },
};

function makeLLMResponse(request = {}) {
  const prompt = request.prompt || request.input || 'No prompt provided.';
  const text = `Local backend LLM stub response. Prompt received: ${String(prompt).slice(0, 200)}`;
  const result = new String(text);
  result.data = { text, response: text };
  return result;
}

const integrations = {
  Core: {
    InvokeLLM: async (request = {}) => makeLLMResponse(request),
    UploadFile: async (request = {}) => ({
      success: true,
      file_url: request.file ? URL.createObjectURL(request.file) : null,
      url: request.file ? URL.createObjectURL(request.file) : null,
    }),
  },
};

const agents = {
  createConversation: async (options = {}) => ({
    id: `local-${Date.now()}`,
    created_at: new Date().toISOString(),
    ...options,
  }),
  addMessage: async (conversationId, message) => ({
    conversationId,
    message,
    id: `msg-${Date.now()}`,
    created_at: new Date().toISOString(),
  }),
  getConversation: async (conversationId) => ({
    id: conversationId,
    messages: [],
    created_at: new Date().toISOString(),
  }),
  listConversations: async () => [],
  subscribeToConversation: (conversationId, callback) => {
    const interval = setInterval(() => callback({
      type: 'heartbeat',
      conversationId,
      timestamp: new Date().toISOString(),
    }), 30000);
    return () => clearInterval(interval);
  },
};

export const base44 = {
  entities: new Proxy({}, {
    get(_, name) {
      return makeEntity(name.toString());
    },
  }),
  auth,
  functions,
  integrations,
  agents,
  http,
  API_BASE,
};

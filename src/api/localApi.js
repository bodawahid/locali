// @ts-nocheck
import axios from 'axios';

const API_BASE = import.meta.env?.VITE_API_BASE_URL || 'http://localhost/locali-api/api.php';
const TOKEN_STORAGE_KEY = 'locali_auth_token';

const http = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  if (token) config.headers.Authorization = 'Bearer ' + token;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      localStorage.removeItem('locali_auth_user');
    }
    return Promise.reject(error);
  }
);

function setAuthHeader(token) {
  if (token) {
    http.defaults.headers.common.Authorization = 'Bearer ' + token;
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    delete http.defaults.headers.common.Authorization;
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
}

const savedToken = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_STORAGE_KEY) : null;
if (savedToken) setAuthHeader(savedToken);

function normalizeValue(v) {
  if (v === undefined || v === null || v === '') return undefined;
  if (typeof v === 'boolean') return v ? 1 : 0;
  return v;
}

function asArray(data) {
  return Array.isArray(data) ? data : [];
}

function safeJsonParse(v) {
  if (typeof v !== 'string') return v;
  const t = v.trim();
  if (!t) return v;
  if ((t.startsWith('{') && t.endsWith('}')) || (t.startsWith('[') && t.endsWith(']'))) {
    try {
      return JSON.parse(t);
    } catch {
      return v;
    }
  }
  return v;
}

function parseRow(row) {
  if (!row || typeof row !== 'object') return row;
  const parsed = {};
  Object.entries(row).forEach(([k, v]) => {
    parsed[k] = safeJsonParse(v);
  });
  return parsed;
}

function filterClientSide(records, filters = {}) {
  const entries = Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== '');
  if (!entries.length) return records;
  return records.filter((item) =>
    entries.every(([key, value]) => String(item?.[key]) === String(value))
  );
}

function sortClientSide(records, sort = '') {
  if (!sort) return records;
  const desc = sort.startsWith('-');
  const field = sort.replace(/^[+-]/, '');
  if (!field) return records;

  return [...records].sort((a, b) => {
    const av = a?.[field];
    const bv = b?.[field];
    if (av === bv) return 0;

    const an = Number(av);
    const bn = Number(bv);
    if (!Number.isNaN(an) && !Number.isNaN(bn)) {
      return desc ? bn - an : an - bn;
    }

    const ad = Date.parse(av);
    const bd = Date.parse(bv);
    if (!Number.isNaN(ad) && !Number.isNaN(bd)) {
      return desc ? bd - ad : ad - bd;
    }

    const cmp = String(av ?? '').localeCompare(String(bv ?? ''));
    return desc ? -cmp : cmp;
  });
}

async function requestEntity(entity, method = 'GET', payload = null, params = {}) {
  const query = {
    entity,
    ...Object.fromEntries(
      Object.entries(params).map(([k, v]) => [k, normalizeValue(v)])
    ),
  };

  const res = await http.request({
    method,
    params: query,
    data: payload,
  });

  return res.data;
}

function makeEntity(entityName) {
  return {
    list: async (sort = '', limit = 100, page = 1) => {
      try {
        const raw = await requestEntity(entityName, 'GET', null, { sort, limit, page });
        return sortClientSide(asArray(raw).map(parseRow), sort);
      } catch (err) {
        console.error(`Error listing ${entityName}:`, err);
        return [];
      }
    },

    filter: async (filters = {}, sort = '', limit = 100, page = 1) => {
      try {
        const raw = await requestEntity(entityName, 'GET', null, { ...filters, sort, limit, page });
        const parsed = asArray(raw).map(parseRow);
        return sortClientSide(filterClientSide(parsed, filters), sort);
      } catch (err) {
        console.error(`Error filtering ${entityName}:`, err);
        return [];
      }
    },

    get: async (id) => {
      try {
        const withId = await requestEntity(entityName, 'GET', null, { id, limit: 1, page: 1 });
        const rows = asArray(withId).map(parseRow);
        if (rows.length > 0) return rows[0];

        const withIdIndex = await requestEntity(entityName, 'GET', null, { id_index: id, limit: 1, page: 1 });
        return asArray(withIdIndex).map(parseRow)[0] || null;
      } catch (err) {
        console.error(`Error getting ${entityName}/${id}:`, err);
        return null;
      }
    },

    create: async (payload) => {
      const res = await requestEntity(entityName, 'POST', payload);
      return res;
    },

    update: async (id, payload) => {
      const body = { action: 'update', id, ...payload };
      const res = await requestEntity(entityName, 'POST', body);
      return res;
    },

    delete: async (id) => {
      const body = { action: 'delete', id };
      const res = await requestEntity(entityName, 'POST', body);
      return res;
    },

    subscribe: () => () => {},
  };
}

const auth = {
  me: async () => {
    const res = await http.get('/auth/me');
    return res.data;
  },
  login: async (email, password) => {
    const res = await http.post('/auth/login', { email, password });
    const token = res.data?.token;
    if (token) setAuthHeader(token);
    return res.data;
  },
  register: async (name, email, password, role = 'traveler') => {
    const res = await http.post('/auth/register', { name, email, password, role });
    const token = res.data?.token;
    if (token) setAuthHeader(token);
    return res.data;
  },
  logout: () => setAuthHeader(null),
  redirectToLogin: (redirectUrl) => {
    window.location.href = `/login?redirect=${encodeURIComponent(redirectUrl || '/')}`;
  },
  isAuthenticated: async () => {
    try {
      await auth.me();
      return true;
    } catch {
      return false;
    }
  },
};

const functions = {
  invoke: async (fnName, payload = {}) => ({
    success: true,
    fnName,
    payload,
    source: 'local-fallback',
  }),
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

export const localApi = {
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

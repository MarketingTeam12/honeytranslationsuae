export const BACKEND_ENV_KEYS = [
  'CMS_API_ORIGIN',
  'CMS_API_BASE',
  'CMS_API_URL',
  'VITE_CMS_API_BASE',
  'VITE_CMS_API_ORIGIN',
  'VITE_API_BASE_URL',
  'VITE_API_URL',
  'API_BASE_URL',
  'API_URL',
];

const AUTO_DISCOVERY_CACHE = new Map();
const DISCOVERY_HINT_KEYS = ['CMS_API_FALLBACK_ORIGINS', 'CMS_FRONTEND_ORIGINS', 'CMS_FRONTEND_ORIGIN', 'CMS_CORS_ORIGIN'];

function parseCsv(raw) {
  if (!raw) return [];
  return String(raw)
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function normalizeAdminBase(value) {
  if (!value) return null;
  const raw = String(value).trim();
  if (!raw || !/^https?:\/\//i.test(raw)) return null;

  try {
    const parsed = new URL(raw);
    const pathname = parsed.pathname.replace(/\/+$/, '');

    if (pathname === '/api/admin') {
      return `${parsed.origin}${pathname}`;
    }

    if (pathname === '/api') {
      return `${parsed.origin}${pathname}/admin`;
    }

    if (!pathname || pathname === '/') {
      return `${parsed.origin}/api/admin`;
    }

    return `${parsed.origin}${pathname}/api/admin`;
  } catch {
    return null;
  }
}

function getConfiguredBackendBase(env) {
  for (const key of BACKEND_ENV_KEYS) {
    const value = env?.[key];
    if (value === undefined || value === null) continue;
    const normalized = String(value).trim();
    if (normalized) return normalized;
  }
  return '';
}

function getApexDomain(host) {
  if (!host) return '';
  if (host === 'localhost') return host;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return host;
  const parts = host.split('.').filter(Boolean);
  if (parts.length <= 2) return host;
  return parts.slice(-2).join('.');
}

function addCandidate(candidates, value) {
  if (!value) return;
  const trimmed = String(value).trim();
  if (!trimmed) return;
  candidates.add(trimmed);
}

function addHostCandidates(candidates, host) {
  if (!host) return;
  const cleanHost = String(host).trim().toLowerCase();
  if (!cleanHost) return;

  addCandidate(candidates, `https://${cleanHost}`);
  if (cleanHost.startsWith('www.')) {
    addCandidate(candidates, `https://${cleanHost.slice(4)}`);
  }

  const apex = getApexDomain(cleanHost);
  if (apex) {
    addCandidate(candidates, `https://${apex}`);
    addCandidate(candidates, `https://api.${apex}`);
    addCandidate(candidates, `https://backend.${apex}`);
    addCandidate(candidates, `https://cms-api.${apex}`);
  }
}

function buildDiscoveryCandidates(request, env) {
  const candidates = new Set();
  const hintedOrigins = parseCsv(env?.CMS_API_FALLBACK_ORIGINS || '');
  hintedOrigins.forEach((origin) => addCandidate(candidates, origin));

  for (const key of DISCOVERY_HINT_KEYS) {
    parseCsv(env?.[key] || '').forEach((origin) => {
      try {
        const url = new URL(origin);
        addHostCandidates(candidates, url.hostname);
      } catch {
        addCandidate(candidates, origin);
      }
    });
  }

  try {
    const requestUrl = new URL(request.url);
    addHostCandidates(candidates, requestUrl.hostname);
  } catch {
    // no-op
  }

  return Array.from(candidates)
    .map((candidate) => normalizeAdminBase(candidate))
    .filter(Boolean);
}

function getCacheKey(request, env) {
  let requestOrigin = 'unknown-origin';
  try {
    requestOrigin = new URL(request.url).origin;
  } catch {
    // no-op
  }

  const fingerprint = [
    requestOrigin,
    ...BACKEND_ENV_KEYS.map((key) => `${key}:${String(env?.[key] || '').trim()}`),
    `CMS_API_FALLBACK_ORIGINS:${String(env?.CMS_API_FALLBACK_ORIGINS || '').trim()}`,
  ].join('|');

  return fingerprint;
}

async function looksLikeAdminBackend(adminBase) {
  const loginUrl = `${adminBase}/auth/login`;

  try {
    const probe = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({}),
    });

    const contentType = (probe.headers.get('Content-Type') || '').toLowerCase();

    if (contentType.includes('application/json')) {
      return true;
    }

    if ([400, 401, 403, 405, 422].includes(probe.status)) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

async function discoverBackendAdminBase(request, env) {
  const cacheKey = getCacheKey(request, env);
  const cached = AUTO_DISCOVERY_CACHE.get(cacheKey);
  if (cached) return cached;

  const candidates = buildDiscoveryCandidates(request, env);
  for (const candidate of candidates) {
    // Probe candidate with the login route so we only accept real admin backends.
    if (await looksLikeAdminBackend(candidate)) {
      AUTO_DISCOVERY_CACHE.set(cacheKey, candidate);
      return candidate;
    }
  }

  return null;
}

export async function resolveBackendAdminBase(request, env) {
  const configured = normalizeAdminBase(getConfiguredBackendBase(env));
  if (configured) return configured;
  return discoverBackendAdminBase(request, env);
}


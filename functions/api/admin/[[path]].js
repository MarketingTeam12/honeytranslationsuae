const ALLOW_METHODS = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
const ALLOW_HEADERS = 'Content-Type, Authorization';
const BACKEND_ENV_KEYS = [
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

function parseAllowedOrigins(raw) {
  if (!raw) return [];
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function resolveOrigin(request, env) {
  const requestOrigin = request.headers.get('Origin');
  const configured = parseAllowedOrigins(env?.CMS_CORS_ORIGIN || '');

  if (!configured.length) {
    return requestOrigin || '*';
  }

  if (configured.includes('*')) {
    return '*';
  }

  if (!requestOrigin) {
    return configured[0];
  }

  return configured.includes(requestOrigin) ? requestOrigin : configured[0];
}

function corsHeaders(request, env) {
  return {
    'Access-Control-Allow-Origin': resolveOrigin(request, env),
    'Access-Control-Allow-Headers': ALLOW_HEADERS,
    'Access-Control-Allow-Methods': ALLOW_METHODS,
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function json(request, env, status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders(request, env),
    },
  });
}

function getPathSuffix(context) {
  const parts = context.params?.path;
  if (!parts) return '';
  if (Array.isArray(parts)) return parts.join('/');
  return String(parts);
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

function getBackendAdminBase(env) {
  const configured = getConfiguredBackendBase(env);
  if (!configured) return null;
  if (!/^https?:\/\//i.test(configured)) return null;

  try {
    const parsed = new URL(configured);
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

function getBackendUrl(context) {
  const base = getBackendAdminBase(context.env);
  if (!base) return null;
  const suffix = getPathSuffix(context);
  return suffix ? `${base}/${suffix}` : base;
}

export function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(context.request, context.env),
  });
}

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method === 'OPTIONS') {
    return onRequestOptions(context);
  }

  const backendUrl = getBackendUrl(context);
  if (!backendUrl) {
    return json(request, env, 500, {
      message: `CMS backend API origin is not configured. Set one of: ${BACKEND_ENV_KEYS.join(', ')}`,
    });
  }

  const headers = new Headers(request.headers);
  headers.set('Accept', 'application/json');
  headers.delete('host');

  const method = request.method.toUpperCase();
  const init = {
    method,
    headers,
  };

  if (method !== 'GET' && method !== 'HEAD') {
    init.body = request.body;
  }

  try {
    const upstream = await fetch(backendUrl, init);
    const responseText = await upstream.text();
    const contentType = upstream.headers.get('Content-Type') || 'application/json';
    return new Response(responseText, {
      status: upstream.status,
      headers: {
        'Content-Type': contentType,
        ...corsHeaders(request, env),
      },
    });
  } catch {
    return json(request, env, 502, { message: 'Unable to reach backend API service' });
  }
}

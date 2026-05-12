const ALLOW_METHODS = 'POST, OPTIONS';
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

function getBackendUrl(env) {
  const adminBase = getBackendAdminBase(env);
  if (!adminBase) return null;
  return `${adminBase}/auth/logout`;
}

export function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(context.request, context.env),
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const backendUrl = getBackendUrl(env);
  if (!backendUrl) {
    return json(request, env, 500, {
      message: `CMS backend API origin is not configured. Set one of: ${BACKEND_ENV_KEYS.join(', ')}`,
    });
  }

  try {
    const upstream = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: request.headers.get('Authorization') || '',
      },
    });

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
    return json(request, env, 502, {
      message: 'Unable to reach backend auth service',
    });
  }
}

export function onRequest(context) {
  return json(context.request, context.env, 405, { message: 'Method Not Allowed' });
}

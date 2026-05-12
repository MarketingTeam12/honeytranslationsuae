const ALLOW_METHODS = 'GET, POST, PUT, PATCH, DELETE, OPTIONS';
const ALLOW_HEADERS = 'Content-Type, Authorization';

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

function getBackendUrl(context) {
  const origin = (context.env?.CMS_API_ORIGIN || '').trim();
  if (!origin) return null;
  const suffix = getPathSuffix(context);
  const base = `${origin.replace(/\/$/, '')}/api/admin`;
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
    return json(request, env, 500, { message: 'CMS_API_ORIGIN is not configured' });
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

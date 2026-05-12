import { BACKEND_ENV_KEYS, resolveBackendAdminBase } from '../../../_utils/backend.js';
const ALLOW_METHODS = 'GET, OPTIONS';
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

function getBackendUrl(adminBase) {
  if (!adminBase) return null;
  return `${adminBase}/auth/me`;
}

export function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(context.request, context.env),
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const backendAdminBase = await resolveBackendAdminBase(request, env);
  const backendUrl = getBackendUrl(backendAdminBase);
  if (!backendUrl) {
    return json(request, env, 500, {
      message: `CMS backend API origin is not configured. Set one of: ${BACKEND_ENV_KEYS.join(', ')}`,
    });
  }

  try {
    const upstream = await fetch(backendUrl, {
      method: 'GET',
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

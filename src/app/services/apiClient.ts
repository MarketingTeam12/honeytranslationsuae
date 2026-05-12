const API_BASE =
  (import.meta as any).env?.VITE_CMS_API_BASE ||
  (import.meta as any).env?.VITE_CMS_API_ORIGIN ||
  (import.meta as any).env?.VITE_API_BASE_URL ||
  (import.meta as any).env?.VITE_API_URL ||
  '';

type RequestOptions = RequestInit & {
  token?: string | null;
};

const CMS_API_HELP =
  'Cannot reach the CMS API. For local setup run `npm run api:dev` and `npm run db:init`. For Cloudflare, set CMS_API_ORIGIN (or VITE_CMS_API_BASE) to your backend URL.';

async function request(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (options.token) {
    headers.set('Authorization', `Bearer ${options.token}`);
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      headers,
    });
  } catch (error) {
    if (path.startsWith('/api/admin')) {
      throw new Error(CMS_API_HELP);
    }
    throw error;
  }

  if (!response.ok) {
    let message = `Request failed: ${response.status}`;
    try {
      const errorBody = await response.json();
      if (errorBody?.message) {
        message = errorBody.message;
      }
      if (
        typeof message === 'string' &&
        message.includes('CMS backend API origin is not configured')
      ) {
        message =
          'Admin API is not connected. Set CMS_API_ORIGIN (or VITE_CMS_API_BASE) in Cloudflare Pages environment variables.';
      }
    } catch {
      if (response.status === 405 && path === '/api/admin/auth/login') {
        message = 'Login endpoint rejected this method. Ensure POST /api/admin/auth/login is deployed.';
      }
      if (response.status >= 500 && path.startsWith('/api/admin')) {
        message = CMS_API_HELP;
      }
    }
    throw new Error(message);
  }

  return response.json();
}

export const apiClient = { request };

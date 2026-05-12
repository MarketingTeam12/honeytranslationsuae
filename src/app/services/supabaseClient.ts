import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL?.toString().trim() || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY?.toString().trim() || '';

const missingConfigError =
  'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.';

const FALLBACK_URL = 'https://placeholder.supabase.co';
const FALLBACK_KEY = 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl || FALLBACK_URL, supabaseAnonKey || FALLBACK_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export function createSupabaseWithAccessToken(accessToken: string) {
  return createClient(supabaseUrl || FALLBACK_URL, supabaseAnonKey || FALLBACK_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

export function assertSupabaseConfigured() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(missingConfigError);
  }
}

export const SUPABASE_BLOG_IMAGE_BUCKET =
  (import.meta as any).env?.VITE_SUPABASE_BLOG_IMAGE_BUCKET?.toString().trim() || 'blog-images';

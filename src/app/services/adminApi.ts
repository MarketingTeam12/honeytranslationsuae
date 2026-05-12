import type { SupabaseClient } from '@supabase/supabase-js';
import type { AdminUser, BlogPost, Category, DashboardStats } from '../types/cms';
import {
  mapAdminProfileRow,
  mapBlogRow,
  mapCategoryRow,
  toCategoryInsert,
  type BlogRow,
  type CategoryRow,
} from './supabaseCms';
import {
  assertSupabaseConfigured,
  createSupabaseWithAccessToken,
  supabase,
  SUPABASE_BLOG_IMAGE_BUCKET,
} from './supabaseClient';

type LoginResponse = { token: string; user: AdminUser };

const ADMIN_PROFILE_SELECT = 'user_id,email,display_name,created_at';
const BLOG_SELECT =
  'id,title,slug,short_description,featured_image,read_time,status,publish_date,full_content,author,meta_title,meta_description,created_at,updated_at,category:categories(id,name,slug,created_at)';

type CreateOrUpdatePayload = {
  title: string;
  slug: string;
  short_description: string;
  category_id: number;
  read_time: string;
  publish_date: string | null;
  status: 'draft' | 'published';
  featured_image: string | null;
  full_content: string;
  author: string | null;
  meta_title: string | null;
  meta_description: string | null;
};

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function normalizeStatus(value: unknown): 'draft' | 'published' {
  return value === 'published' ? 'published' : 'draft';
}

function normalizeDate(value: unknown): string | null {
  const raw = (value || '').toString().trim();
  return raw || null;
}

function normalizeText(value: unknown, label: string) {
  const text = (value || '').toString().trim();
  if (!text) {
    throw new Error(`${label} is required`);
  }
  return text;
}

function parseCategoryId(value: unknown) {
  const parsed = Number.parseInt((value || '').toString(), 10);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error('Category is required');
  }
  return parsed;
}

function getTokenClient(token?: string | null): SupabaseClient | null {
  const accessToken = (token || '').trim();
  if (!accessToken) return null;
  return createSupabaseWithAccessToken(accessToken);
}

async function getCurrentSessionToken() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(error.message || 'Unable to verify session');
  }
  return data.session?.access_token || null;
}

async function getAdminProfile(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from('admin_users')
    .select(ADMIN_PROFILE_SELECT)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message || 'Unable to verify admin permissions');
  }
  if (!data) {
    throw new Error('Access denied. This account is not an admin.');
  }
  return mapAdminProfileRow(data);
}

async function requireAdminClient(token?: string | null) {
  assertSupabaseConfigured();
  const scoped = getTokenClient(token);
  const sessionToken = token || (await getCurrentSessionToken());
  if (!sessionToken) {
    throw new Error('Session expired. Please login again.');
  }

  const authClient = scoped || createSupabaseWithAccessToken(sessionToken);
  const { data, error } = await authClient.auth.getUser(sessionToken);
  if (error || !data.user) {
    throw new Error('Session expired. Please login again.');
  }

  const admin = await getAdminProfile(authClient, data.user.id);
  return { client: authClient, user: admin };
}

async function uploadFeaturedImage(client: SupabaseClient, file: File) {
  const fileExtension = file.name.includes('.') ? file.name.split('.').pop() : 'jpg';
  const safeExtension = (fileExtension || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
  const filePath = `blogs/${Date.now()}-${Math.random().toString(36).slice(2, 10)}.${safeExtension}`;
  const { error } = await client.storage.from(SUPABASE_BLOG_IMAGE_BUCKET).upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) {
    throw new Error(error.message || 'Failed to upload featured image');
  }

  const { data } = client.storage.from(SUPABASE_BLOG_IMAGE_BUCKET).getPublicUrl(filePath);
  return data.publicUrl;
}

async function buildBlogPayload(client: SupabaseClient, payload: FormData): Promise<CreateOrUpdatePayload> {
  const title = normalizeText(payload.get('title'), 'Title');
  const slugInput = (payload.get('slug') || '').toString().trim();
  const slug = slugInput || createSlug(title);
  const shortDescription = normalizeText(payload.get('shortDescription'), 'Short description');
  const categoryId = parseCategoryId(payload.get('categoryId'));
  const readTime = normalizeText(payload.get('readTime'), 'Read time');
  const fullContent = normalizeText(payload.get('fullContent'), 'Full content');
  const status = normalizeStatus(payload.get('status'));
  const featuredImage = (payload.get('featuredImage') || '').toString().trim();
  const authorInput = (payload.get('author') || '').toString().trim();
  const metaTitle = (payload.get('metaTitle') || '').toString().trim();
  const metaDescription = (payload.get('metaDescription') || '').toString().trim();
  const file = payload.get('featuredImageFile');
  const uploadedImageUrl =
    typeof File !== 'undefined' && file instanceof File && file.size > 0
      ? await uploadFeaturedImage(client, file)
      : null;

  return {
    title,
    slug,
    short_description: shortDescription,
    category_id: categoryId,
    read_time: readTime,
    publish_date: normalizeDate(payload.get('publishDate')),
    status,
    featured_image: uploadedImageUrl || featuredImage || null,
    full_content: fullContent,
    author: authorInput || null,
    meta_title: metaTitle || null,
    meta_description: metaDescription || null,
  };
}

export const adminApi = {
  async login(email: string, password: string) {
    assertSupabaseConfigured();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session || !data.user) {
      throw new Error(error?.message || 'Invalid credentials');
    }

    try {
      const client = createSupabaseWithAccessToken(data.session.access_token);
      const user = await getAdminProfile(client, data.user.id);
      return { token: data.session.access_token, user } as LoginResponse;
    } catch (error) {
      await supabase.auth.signOut();
      throw error;
    }
  },

  async me(token: string) {
    const { user } = await requireAdminClient(token);
    return { user };
  },

  async logout(_token?: string) {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message || 'Failed to logout');
    }
    return { success: true };
  },

  async getStats(token: string) {
    const { client } = await requireAdminClient(token);
    const [totalBlogsRes, publishedBlogsRes, draftBlogsRes, categoriesRes] = await Promise.all([
      client.from('blog_posts').select('id', { count: 'exact', head: true }),
      client.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
      client.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'draft'),
      client.from('categories').select('id', { count: 'exact', head: true }),
    ]);

    const firstError =
      totalBlogsRes.error || publishedBlogsRes.error || draftBlogsRes.error || categoriesRes.error;
    if (firstError) {
      throw new Error(firstError.message || 'Unable to fetch dashboard stats');
    }

    return {
      data: {
        totalBlogs: totalBlogsRes.count || 0,
        publishedBlogs: publishedBlogsRes.count || 0,
        draftBlogs: draftBlogsRes.count || 0,
        categoriesCount: categoriesRes.count || 0,
      } satisfies DashboardStats,
    };
  },

  async getCategories(token: string) {
    const { client } = await requireAdminClient(token);
    const { data, error } = await client.from('categories').select('*').order('name', { ascending: true });
    if (error) {
      throw new Error(error.message || 'Unable to fetch categories');
    }
    return { data: (data || []).map((row) => mapCategoryRow(row as CategoryRow)) as Category[] };
  },

  async createCategory(token: string, name: string) {
    const { client } = await requireAdminClient(token);
    const payload = toCategoryInsert(name);
    const { data, error } = await client.from('categories').insert(payload).select('*').single();
    if (error) {
      throw new Error(error.message || 'Unable to create category');
    }
    return { data: mapCategoryRow(data as CategoryRow) };
  },

  async getBlogs(token: string, params?: { search?: string; status?: string; categoryId?: number }) {
    const { client } = await requireAdminClient(token);
    let query = client.from('blog_posts').select(BLOG_SELECT).order('publish_date', { ascending: false });

    if (params?.status) {
      query = query.eq('status', params.status);
    }
    if (params?.categoryId) {
      query = query.eq('category_id', params.categoryId);
    }
    if (params?.search) {
      const safeSearch = params.search.replace(/[%_]/g, '').trim();
      if (safeSearch) {
        query = query.or(`title.ilike.%${safeSearch}%,short_description.ilike.%${safeSearch}%`);
      }
    }

    const { data, error } = await query;
    if (error) {
      throw new Error(error.message || 'Unable to fetch blogs');
    }
    return { data: (data || []).map((row) => mapBlogRow(row as BlogRow)) as BlogPost[] };
  },

  async getBlogById(token: string, id: number) {
    const { client } = await requireAdminClient(token);
    const { data, error } = await client.from('blog_posts').select(BLOG_SELECT).eq('id', id).single();
    if (error) {
      throw new Error(error.message || 'Unable to fetch blog');
    }
    return { data: mapBlogRow(data as BlogRow) };
  },

  async createBlog(token: string, payload: FormData) {
    const { client } = await requireAdminClient(token);
    const blogPayload = await buildBlogPayload(client, payload);
    const { data, error } = await client.from('blog_posts').insert(blogPayload).select(BLOG_SELECT).single();
    if (error) {
      throw new Error(error.message || 'Unable to create blog');
    }
    return { data: mapBlogRow(data as BlogRow) };
  },

  async updateBlog(token: string, id: number, payload: FormData) {
    const { client } = await requireAdminClient(token);
    const blogPayload = await buildBlogPayload(client, payload);
    const { data, error } = await client
      .from('blog_posts')
      .update(blogPayload)
      .eq('id', id)
      .select(BLOG_SELECT)
      .single();
    if (error) {
      throw new Error(error.message || 'Unable to update blog');
    }
    return { data: mapBlogRow(data as BlogRow) };
  },

  async deleteBlog(token: string, id: number) {
    const { client } = await requireAdminClient(token);
    const { error } = await client.from('blog_posts').delete().eq('id', id);
    if (error) {
      throw new Error(error.message || 'Unable to delete blog');
    }
    return { success: true };
  },

  async updateStatus(token: string, id: number, status: 'draft' | 'published') {
    const { client } = await requireAdminClient(token);
    const nextStatus = normalizeStatus(status);
    const nowDate = new Date().toISOString().slice(0, 10);
    const payload =
      nextStatus === 'published'
        ? { status: 'published', publish_date: nowDate }
        : { status: 'draft' as const };
    const { data, error } = await client
      .from('blog_posts')
      .update(payload)
      .eq('id', id)
      .select(BLOG_SELECT)
      .single();
    if (error) {
      throw new Error(error.message || 'Unable to update blog status');
    }
    return { data: mapBlogRow(data as BlogRow) };
  },
};

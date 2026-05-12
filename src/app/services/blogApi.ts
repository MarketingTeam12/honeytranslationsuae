import type { BlogPost, BlogSummary } from '../types/cms';
import { mapBlogRow, mapBlogSummaryRow, mapCategoryRow, type BlogRow, type CategoryRow } from './supabaseCms';
import { assertSupabaseConfigured, supabase } from './supabaseClient';

const BLOG_SELECT_PUBLIC =
  'id,title,slug,short_description,featured_image,read_time,status,publish_date,category:categories(id,name,slug,created_at)';
const BLOG_SELECT_DETAIL =
  'id,title,slug,short_description,featured_image,read_time,status,publish_date,full_content,author,meta_title,meta_description,created_at,updated_at,category:categories(id,name,slug,created_at)';

export async function fetchPublishedBlogs(params?: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  assertSupabaseConfigured();

  let query = supabase
    .from('blog_posts')
    .select(BLOG_SELECT_PUBLIC)
    .eq('status', 'published')
    .order('publish_date', { ascending: false });

  if (params?.category) {
    const { data: category, error: categoryError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', params.category.trim())
      .maybeSingle();

    if (categoryError) {
      throw new Error(categoryError.message || 'Unable to filter blogs');
    }
    if (!category?.id) {
      return { data: [] as BlogPost[] };
    }
    query = query.eq('category_id', category.id);
  }

  if (params?.search) {
    const safeSearch = params.search.replace(/[%_]/g, '').trim();
    if (safeSearch) {
      query = query.or(`title.ilike.%${safeSearch}%,short_description.ilike.%${safeSearch}%`);
    }
  }

  if (params?.page && params?.limit) {
    const start = Math.max(0, (params.page - 1) * params.limit);
    const end = start + params.limit - 1;
    query = query.range(start, end);
  } else if (params?.limit) {
    query = query.limit(params.limit);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message || 'Unable to fetch blogs');
  }

  return { data: (data || []).map((row) => mapBlogRow(row as BlogRow)) as BlogPost[] };
}

export async function fetchBlogBySlug(slug: string) {
  assertSupabaseConfigured();
  const normalizedSlug = slug.trim();
  const { data, error } = await supabase
    .from('blog_posts')
    .select(BLOG_SELECT_DETAIL)
    .eq('status', 'published')
    .eq('slug', normalizedSlug)
    .single();

  if (error) {
    throw new Error(error.message || 'Unable to fetch blog');
  }

  return { data: mapBlogRow(data as BlogRow) };
}

export async function fetchRelatedBlogs(slug: string, limit = 3) {
  assertSupabaseConfigured();
  const normalizedSlug = slug.trim();
  const { data: currentBlog, error: currentError } = await supabase
    .from('blog_posts')
    .select('id,category_id')
    .eq('status', 'published')
    .eq('slug', normalizedSlug)
    .maybeSingle();

  if (currentError) {
    throw new Error(currentError.message || 'Unable to fetch related blogs');
  }
  if (!currentBlog) {
    return { data: [] as BlogSummary[] };
  }

  let query = supabase
    .from('blog_posts')
    .select(BLOG_SELECT_PUBLIC)
    .eq('status', 'published')
    .neq('slug', normalizedSlug)
    .order('publish_date', { ascending: false })
    .limit(limit);

  if (currentBlog.category_id) {
    query = query.eq('category_id', currentBlog.category_id);
  }

  const { data, error } = await query;
  if (error) {
    throw new Error(error.message || 'Unable to fetch related blogs');
  }

  return { data: (data || []).map((row) => mapBlogSummaryRow(row as BlogRow)) as BlogSummary[] };
}

export async function fetchPublicCategories() {
  assertSupabaseConfigured();
  const { data, error } = await supabase.from('categories').select('*').order('name', { ascending: true });
  if (error) {
    throw new Error(error.message || 'Unable to fetch categories');
  }
  return { data: (data || []).map((row) => mapCategoryRow(row as CategoryRow)) };
}

import { apiClient } from './apiClient';
import type { BlogPost, BlogSummary } from '../types/cms';

export async function fetchPublishedBlogs(params?: { category?: string; search?: string; page?: number; limit?: number }) {
  const query = new URLSearchParams();
  query.set('status', 'published');
  if (params?.category) query.set('category', params.category);
  if (params?.search) query.set('search', params.search);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  return apiClient.request(`/api/blogs?${query.toString()}`) as Promise<{ data: BlogPost[] }>;
}

export async function fetchBlogBySlug(slug: string) {
  return apiClient.request(`/api/blogs/${slug}`) as Promise<{ data: BlogPost }>;
}

export async function fetchRelatedBlogs(slug: string, limit = 3) {
  return apiClient.request(`/api/blogs/${slug}/related?limit=${limit}`) as Promise<{ data: BlogSummary[] }>;
}

export async function fetchPublicCategories() {
  return apiClient.request('/api/categories') as Promise<{ data: Array<{ id: number; name: string; slug: string }> }>;
}

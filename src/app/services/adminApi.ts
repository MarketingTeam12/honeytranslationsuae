import { apiClient } from './apiClient';
import type { AdminUser, BlogPost, Category, DashboardStats } from '../types/cms';

type LoginResponse = { token: string; user: AdminUser };

export const adminApi = {
  login(email: string, password: string) {
    return apiClient.request('/api/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }) as Promise<LoginResponse>;
  },

  me(token: string) {
    return apiClient.request('/api/admin/auth/me', { token }) as Promise<{ user: AdminUser }>;
  },

  logout(token: string) {
    return apiClient.request('/api/admin/auth/logout', { method: 'POST', token }) as Promise<{ success: boolean }>;
  },

  getStats(token: string) {
    return apiClient.request('/api/admin/dashboard/stats', { token }) as Promise<{ data: DashboardStats }>;
  },

  getCategories(token: string) {
    return apiClient.request('/api/admin/categories', { token }) as Promise<{ data: Category[] }>;
  },

  createCategory(token: string, name: string) {
    return apiClient.request('/api/admin/categories', {
      method: 'POST',
      token,
      body: JSON.stringify({ name }),
    }) as Promise<{ data: Category }>;
  },

  getBlogs(token: string, params?: { search?: string; status?: string; categoryId?: number }) {
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.categoryId) query.set('categoryId', String(params.categoryId));
    return apiClient.request(`/api/admin/blogs?${query.toString()}`, { token }) as Promise<{ data: BlogPost[] }>;
  },

  getBlogById(token: string, id: number) {
    return apiClient.request(`/api/admin/blogs/${id}`, { token }) as Promise<{ data: BlogPost }>;
  },

  async createBlog(token: string, payload: FormData) {
    return apiClient.request('/api/admin/blogs', {
      method: 'POST',
      token,
      body: payload,
      headers: {},
    }) as Promise<{ data: BlogPost }>;
  },

  async updateBlog(token: string, id: number, payload: FormData) {
    return apiClient.request(`/api/admin/blogs/${id}`, {
      method: 'PUT',
      token,
      body: payload,
      headers: {},
    }) as Promise<{ data: BlogPost }>;
  },

  deleteBlog(token: string, id: number) {
    return apiClient.request(`/api/admin/blogs/${id}`, {
      method: 'DELETE',
      token,
    }) as Promise<{ success: boolean }>;
  },

  updateStatus(token: string, id: number, status: 'draft' | 'published') {
    return apiClient.request(`/api/admin/blogs/${id}/status`, {
      method: 'PATCH',
      token,
      body: JSON.stringify({ status }),
    }) as Promise<{ data: BlogPost }>;
  },
};

import type { AdminUser, BlogPost, BlogSummary, Category } from '../types/cms';

export type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  created_at?: string | null;
};

export type BlogRow = {
  id: number;
  title: string;
  slug: string;
  short_description: string;
  featured_image?: string | null;
  read_time: string;
  status?: 'draft' | 'published' | null;
  publish_date?: string | null;
  full_content?: string | null;
  author?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  category?: CategoryRow | CategoryRow[] | null;
  categories?: CategoryRow | CategoryRow[] | null;
};

type AdminProfileRow = {
  user_id: string;
  email: string;
  display_name?: string | null;
  created_at?: string | null;
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function toCategory(row: CategoryRow | null | undefined): Category {
  if (!row) {
    return { id: 0, name: 'General', slug: 'general' };
  }
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    created_at: row.created_at || undefined,
  };
}

function resolveCategory(row: BlogRow) {
  const nested = row.category ?? row.categories;
  if (Array.isArray(nested)) return nested[0] || null;
  return nested || null;
}

export function mapCategoryRow(row: CategoryRow): Category {
  return toCategory(row);
}

export function mapBlogRow(row: BlogRow): BlogPost {
  const category = toCategory(resolveCategory(row));
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortDescription: row.short_description,
    featuredImage: row.featured_image || undefined,
    category: {
      id: category.id,
      name: category.name,
      slug: category.slug,
    },
    publishDate: row.publish_date || undefined,
    readTime: row.read_time,
    status: row.status || 'draft',
    fullContent: row.full_content || '',
    author: row.author || undefined,
    metaTitle: row.meta_title || undefined,
    metaDescription: row.meta_description || undefined,
    createdAt: row.created_at || undefined,
    updatedAt: row.updated_at || undefined,
  };
}

export function mapBlogSummaryRow(row: BlogRow): BlogSummary {
  const full = mapBlogRow(row);
  return {
    id: full.id,
    title: full.title,
    slug: full.slug,
    shortDescription: full.shortDescription,
    featuredImage: full.featuredImage,
    category: full.category,
    publishDate: full.publishDate,
    readTime: full.readTime,
    status: full.status,
  };
}

export function sanitizeCategoryName(value: string) {
  const name = value.trim();
  if (!name) {
    throw new Error('Category name is required');
  }
  return name;
}

export function toCategoryInsert(name: string) {
  const normalizedName = sanitizeCategoryName(name);
  return {
    name: normalizedName,
    slug: toSlug(normalizedName),
  };
}

export function mapAdminProfileRow(row: AdminProfileRow): AdminUser {
  const fallbackName = row.email.split('@')[0] || 'admin';
  return {
    id: row.user_id,
    username: row.display_name || fallbackName,
    email: row.email,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

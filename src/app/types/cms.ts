export type BlogStatus = 'draft' | 'published';

export type Category = {
  id: number;
  name: string;
  slug: string;
  created_at?: string;
};

export type BlogSummary = {
  id?: number;
  title: string;
  slug: string;
  shortDescription: string;
  featuredImage?: string;
  category: {
    id?: number;
    name: string;
    slug?: string;
  };
  publishDate?: string;
  readTime: string;
  status?: BlogStatus;
};

export type BlogPost = BlogSummary & {
  fullContent: string;
  author?: string;
  metaTitle?: string;
  metaDescription?: string;
  aliases?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type DashboardStats = {
  totalBlogs: number;
  publishedBlogs: number;
  draftBlogs: number;
  categoriesCount: number;
};

export type AdminUser = {
  id: number;
  username: string;
  email: string;
  createdAt: string;
};

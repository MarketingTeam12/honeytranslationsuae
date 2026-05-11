import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { CheckCircle2, Edit3, Eye, EyeOff, Grid3X3, Plus, Search, Table2, Trash2, X } from 'lucide-react';
import { adminApi } from '../../services/adminApi';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import type { BlogPost, Category } from '../../types/cms';
import { RichTextEditor } from '../../components/admin/RichTextEditor';

type BlogFormState = {
  title: string;
  slug: string;
  shortDescription: string;
  categoryId: string;
  readTime: string;
  publishDate: string;
  status: 'draft' | 'published';
  featuredImage: string;
  featuredImageFile: File | null;
  fullContent: string;
};

const initialForm: BlogFormState = {
  title: '',
  slug: '',
  shortDescription: '',
  categoryId: '',
  readTime: '',
  publishDate: '',
  status: 'draft',
  featuredImage: '',
  featuredImageFile: null,
  fullContent: '',
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function formatDisplayDate(value?: string) {
  if (!value) return 'Draft';
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const date = new Date(`${value}T00:00:00`);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
  return value;
}

function extractParagraphsFromHtml(content: string) {
  const source = (content || '').trim();
  if (!source) return ['', '', ''] as [string, string, string];

  const paragraphs: string[] = [];
  const regex = /<p[^>]*>(.*?)<\/p>/gis;
  let match = regex.exec(source);
  while (match) {
    paragraphs.push(
      (match[1] || '')
        .replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&')
        .replace(/&lt;/gi, '<')
        .replace(/&gt;/gi, '>')
        .replace(/&quot;/gi, '"')
        .replace(/&#39;/gi, "'")
        .replace(/\s+/g, ' ')
        .trim(),
    );
    match = regex.exec(source);
  }

  if (paragraphs.length === 0) {
    const fallback = source
      .split(/\n{2,}/)
      .map((item) => item.replace(/\s+/g, ' ').trim())
      .filter(Boolean);
    paragraphs.push(...fallback);
  }

  return [
    paragraphs[0] || '',
    paragraphs[1] || '',
    paragraphs[2] || '',
  ] as [string, string, string];
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

function extractTextForValidation(content: string) {
  const source = (content || '').toString().trim();
  if (!source) return '';

  if (typeof DOMParser !== 'undefined') {
    try {
      const doc = new DOMParser().parseFromString(source, 'text/html');
      return (doc.body?.textContent || '').replace(/\u00A0/g, ' ').replace(/\s+/g, ' ').trim();
    } catch {
      // Fall back to regex stripping.
    }
  }

  return decodeHtmlEntities(source)
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeFullContentInput(content: string) {
  return (content || '').toString().trim();
}

export function AdminBlogs() {
  const { token } = useAdminAuth();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [form, setForm] = useState<BlogFormState>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  const loadData = async () => {
    if (!token) return;

    setLoading(true);
    setError('');

    try {
      const [blogsRes, categoriesRes] = await Promise.all([
        adminApi.getBlogs(token, {
          search: search || undefined,
          status: statusFilter || undefined,
          categoryId: categoryFilter ? Number(categoryFilter) : undefined,
        }),
        adminApi.getCategories(token),
      ]);

      setBlogs(blogsRes.data);
      setCategories(categoriesRes.data);
    } catch (err: any) {
      setError(err?.message || 'Failed to load blogs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token, search, statusFilter, categoryFilter]);

  const publishedCount = useMemo(() => blogs.filter((blog) => blog.status === 'published').length, [blogs]);
  const draftCount = useMemo(() => blogs.filter((blog) => blog.status === 'draft').length, [blogs]);

  const openCreate = () => {
    setEditingBlog(null);
    setForm(initialForm);
    setNewCategoryName('');
    setIsModalOpen(true);
  };

  const openEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    setForm({
      title: blog.title,
      slug: blog.slug,
      shortDescription: blog.shortDescription,
      categoryId: String(blog.category.id || ''),
      readTime: blog.readTime,
      publishDate: blog.publishDate ? blog.publishDate.slice(0, 10) : '',
      status: blog.status || 'draft',
      featuredImage: blog.featuredImage || '',
      featuredImageFile: null,
      fullContent: blog.fullContent || '',
    });
    setNewCategoryName('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (isSubmitting || isCreatingCategory) return;
    setIsModalOpen(false);
    setEditingBlog(null);
    setForm(initialForm);
    setNewCategoryName('');
  };

  const setField = <K extends keyof BlogFormState>(key: K, value: BlogFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const createCategory = async () => {
    if (!token) return;
    const name = newCategoryName.trim();
    if (!name) return;

    try {
      setIsCreatingCategory(true);
      const created = await adminApi.createCategory(token, name);
      setCategories((prev) => [...prev, created.data].sort((a, b) => a.name.localeCompare(b.name)));
      setField('categoryId', String(created.data.id));
      setNewCategoryName('');
    } catch (err: any) {
      setError(err?.message || 'Unable to create category');
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const submitBlog = async (event: FormEvent) => {
    event.preventDefault();
    if (!token) return;

    const normalizedFullContent = normalizeFullContentInput(form.fullContent);
    const contentText = extractTextForValidation(normalizedFullContent);

    if (!contentText) {
      setError('Full article content is required');
      return;
    }

    const validParagraphs = extractParagraphsFromHtml(normalizedFullContent)
      .map((value) => value.replace(/\s+/g, ' ').trim())
      .filter(Boolean);

    setIsSubmitting(true);
    setError('');

    try {
      const buildPayload = (withAuthorFallback = false) => {
        const payload = new FormData();
        payload.set('title', form.title);
        payload.set('slug', form.slug || slugify(form.title));
        payload.set('shortDescription', form.shortDescription);
        payload.set('categoryId', form.categoryId);
        payload.set('readTime', form.readTime);
        payload.set('publishDate', form.publishDate);
        payload.set('status', form.status);
        payload.set('featuredImage', form.featuredImage);
        payload.set('fullContent', normalizedFullContent);
        payload.set('contentParagraphs', JSON.stringify(validParagraphs));
        if (form.featuredImageFile) {
          payload.set('featuredImageFile', form.featuredImageFile);
        }
        if (withAuthorFallback) {
          payload.set('author', 'Honey Translations Team');
        }
        return payload;
      };

      const saveWithPayload = async (payload: FormData) => {
        if (editingBlog?.id) {
          await adminApi.updateBlog(token, editingBlog.id, payload);
        } else {
          await adminApi.createBlog(token, payload);
        }
      };

      try {
        await saveWithPayload(buildPayload(false));
      } catch (firstError: any) {
        const message = (firstError?.message || '').toString();
        if (/author\s*name\s*is\s*required/i.test(message) || /author\s*is\s*required/i.test(message)) {
          await saveWithPayload(buildPayload(true));
        } else {
          throw firstError;
        }
      }

      await loadData();
      closeModal();
    } catch (err: any) {
      const message = (err?.message || '').toString();
      if (/author\s*name\s*is\s*required/i.test(message) || /author\s*is\s*required/i.test(message)) {
        setError('Unable to save blog');
      } else {
        setError(message || 'Unable to save blog');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteBlog = async (blog: BlogPost) => {
    if (!token || !blog.id) return;
    if (!window.confirm(`Delete "${blog.title}"?`)) return;

    try {
      await adminApi.deleteBlog(token, blog.id);
      await loadData();
    } catch (err: any) {
      setError(err?.message || 'Unable to delete blog');
    }
  };

  const toggleStatus = async (blog: BlogPost) => {
    if (!token || !blog.id) return;
    const status = blog.status === 'published' ? 'draft' : 'published';

    try {
      await adminApi.updateStatus(token, blog.id, status);
      await loadData();
    } catch (err: any) {
      setError(err?.message || 'Unable to update status');
    }
  };

  const renderStatusBadge = (status?: string) => (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
        status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-700'
      }`}
    >
      {status === 'published' ? 'Published' : 'Draft'}
    </span>
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#151249]">Blog Management</h1>
          <p className="text-gray-600 mt-1">Create, edit, publish, and organize your blog content.</p>
        </div>

        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-yellow-500 text-[#151249] font-bold hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" /> Add Blog
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Total</p>
          <p className="text-2xl font-bold text-[#151249]">{blogs.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Published</p>
          <p className="text-2xl font-bold text-green-600">{publishedCount}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-500">Drafts</p>
          <p className="text-2xl font-bold text-gray-700">{draftCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 md:p-5 border border-gray-100 shadow-lg mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blogs..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>{category.name}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => setViewMode('table')} className={`p-2 rounded-lg border ${viewMode === 'table' ? 'bg-[#151249] text-white border-[#151249]' : 'border-gray-200 text-gray-500'}`}><Table2 className="w-4 h-4" /></button>
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg border ${viewMode === 'grid' ? 'bg-[#151249] text-white border-[#151249]' : 'border-gray-200 text-gray-500'}`}><Grid3X3 className="w-4 h-4" /></button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">{error}</div>
      )}

      {loading ? (
        <div className="text-center text-gray-600 py-12">Loading blogs...</div>
      ) : viewMode === 'table' ? (
        <div className="overflow-x-auto bg-white rounded-2xl border border-gray-100 shadow-lg">
          <table className="w-full min-w-[1000px] text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Blog</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Category</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Publish Date</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Read Time</th>
                <th className="text-left px-4 py-3 text-gray-600 font-semibold">Status</th>
                <th className="text-right px-4 py-3 text-gray-600 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id || blog.slug} className="border-b border-gray-100 last:border-b-0">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[#151249] max-w-xs truncate">{blog.title}</div>
                    <div className="text-gray-500 text-xs truncate">/{blog.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{blog.category.name}</td>
                  <td className="px-4 py-3 text-gray-700">{formatDisplayDate(blog.publishDate)}</td>
                  <td className="px-4 py-3 text-gray-700">{blog.readTime}</td>
                  <td className="px-4 py-3">{renderStatusBadge(blog.status)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => toggleStatus(blog)} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50" title="Toggle publish">
                        {blog.status === 'published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => openEdit(blog)} className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50" title="Edit">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteBlog(blog)} className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {blogs.map((blog) => (
            <div key={blog.id || blog.slug} className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-lg font-bold text-[#151249] leading-tight">{blog.title}</h3>
                {renderStatusBadge(blog.status)}
              </div>

              <p className="text-sm text-gray-500 mb-2">{blog.category.name}</p>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">{blog.shortDescription}</p>

              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>{formatDisplayDate(blog.publishDate)}</span>
                <span>{blog.readTime}</span>
              </div>

              <div className="flex gap-2">
                <button onClick={() => toggleStatus(blog)} className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">
                  {blog.status === 'published' ? 'Unpublish' : 'Publish'}
                </button>
                <button onClick={() => openEdit(blog)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm hover:bg-gray-50">
                  Edit
                </button>
                <button onClick={() => deleteBlog(blog)} className="px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm hover:bg-red-50">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[70] bg-[#151249]/55 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#151249]">{editingBlog ? 'Edit Blog' : 'Create Blog'}</h2>
              <button onClick={closeModal} className="p-2 rounded-lg hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={submitBlog} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-semibold text-[#151249]">Title</span>
                  <input value={form.title} onChange={(e) => { setField('title', e.target.value); if (!editingBlog) setField('slug', slugify(e.target.value)); }} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5" required />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-[#151249]">SEO Slug / URL</span>
                  <input value={form.slug} onChange={(e) => setField('slug', slugify(e.target.value))} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5" required />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-[#151249]">Short Description</span>
                <textarea value={form.shortDescription} onChange={(e) => setField('shortDescription', e.target.value)} rows={3} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5" required />
              </label>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="block">
                  <span className="text-sm font-semibold text-[#151249]">Category</span>
                  <select value={form.categoryId} onChange={(e) => setField('categoryId', e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5" required>
                    <option value="">Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-[#151249]">Read Time</span>
                  <input placeholder="e.g. 6 min read" value={form.readTime} onChange={(e) => setField('readTime', e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5" required />
                </label>

                <label className="block">
                  <span className="text-sm font-semibold text-[#151249]">Publish Date</span>
                  <input type="date" value={form.publishDate} onChange={(e) => setField('publishDate', e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5" />
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <label className="block md:col-span-2">
                  <span className="text-sm font-semibold text-[#151249]">Add New Category</span>
                  <input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Create category for future blogs"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5"
                  />
                </label>
                <button
                  type="button"
                  onClick={createCategory}
                  disabled={!newCategoryName.trim() || isCreatingCategory}
                  className="px-5 py-2.5 rounded-xl border border-[#151249]/20 text-[#151249] font-semibold hover:bg-[#151249]/5 disabled:opacity-60"
                >
                  {isCreatingCategory ? 'Adding...' : 'Add Category'}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="block">
                  <span className="text-sm font-semibold text-[#151249]">Status</span>
                  <select value={form.status} onChange={(e) => setField('status', e.target.value as 'draft' | 'published')} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>

                <label className="block md:col-span-2">
                  <span className="text-sm font-semibold text-[#151249]">Featured Image URL (optional)</span>
                  <input value={form.featuredImage} onChange={(e) => setField('featuredImage', e.target.value)} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5" />
                </label>
              </div>

              <label className="block">
                <span className="text-sm font-semibold text-[#151249]">Upload Featured Image</span>
                <input type="file" accept="image/*" onChange={(e) => setField('featuredImageFile', e.target.files?.[0] || null)} className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2.5" />
              </label>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-[#151249]">Full Article Content</p>
                <RichTextEditor
                  value={form.fullContent}
                  onChange={(value) => setField('fullContent', value)}
                  placeholder="Write the complete article content here..."
                />
              </div>

              {form.featuredImage && (
                <div className="rounded-2xl overflow-hidden border border-gray-100 max-w-md">
                  <img src={form.featuredImage} alt="Featured preview" className="w-full h-44 object-cover" />
                </div>
              )}

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#151249] to-[#1e1a5e] text-white font-semibold disabled:opacity-60">
                  <CheckCircle2 className="w-4 h-4" />
                  {isSubmitting ? 'Saving...' : editingBlog ? 'Update Blog' : 'Create Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

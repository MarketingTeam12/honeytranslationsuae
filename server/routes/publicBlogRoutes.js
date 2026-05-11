import { Router } from 'express';
import { dbAll, dbGet } from '../db/connection.js';

const router = Router();
const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

const baseBlogSelect = `
  SELECT
    b.id,
    b.title,
    b.slug,
    b.short_description,
    b.full_content,
    b.featured_image,
    b.author,
    b.read_time,
    b.publish_date,
    b.meta_title,
    b.meta_description,
    b.status,
    b.created_at,
    b.updated_at,
    c.id AS category_id,
    c.name AS category_name,
    c.slug AS category_slug
  FROM blogs b
  INNER JOIN categories c ON c.id = b.category_id
`;
const DEFAULT_AUTHOR = 'Honey Translations Team';

router.get('/categories', asyncHandler(async (_req, res) => {
  const categories = await dbAll(
    'SELECT id, name, slug, created_at FROM categories ORDER BY name ASC',
  );

  res.json({ data: categories });
}));

router.get('/blogs', asyncHandler(async (req, res) => {
  const status = (req.query.status || 'published').toString();
  const category = (req.query.category || '').toString().trim();
  const search = (req.query.search || '').toString().trim();
  const page = Math.max(1, Number(req.query.page || 1));
  const limit = Math.min(50, Math.max(1, Number(req.query.limit || 12)));
  const offset = (page - 1) * limit;

  const conditions = [];
  const params = [];

  if (status) {
    conditions.push('b.status = ?');
    params.push(status);
  }

  if (category) {
    conditions.push('(c.slug = ? OR c.name = ?)');
    params.push(category, category);
  }

  if (search) {
    conditions.push('(b.title LIKE ? OR b.short_description LIKE ? OR b.full_content LIKE ?)');
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countRow = await dbGet(
    `SELECT COUNT(*) as total FROM blogs b INNER JOIN categories c ON c.id = b.category_id ${where}`,
    params,
  );

  const rows = await dbAll(
    `${baseBlogSelect} ${where} ORDER BY COALESCE(b.publish_date, b.created_at) DESC LIMIT ? OFFSET ?`,
    [...params, limit, offset],
  );

  const data = rows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortDescription: row.short_description,
    fullContent: row.full_content,
    featuredImage: row.featured_image,
    category: {
      id: row.category_id,
      name: row.category_name,
      slug: row.category_slug,
    },
    author: row.author || DEFAULT_AUTHOR,
    readTime: row.read_time,
    publishDate: row.publish_date,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));

  res.json({
    data,
    pagination: {
      total: countRow?.total || 0,
      page,
      limit,
      totalPages: Math.ceil((countRow?.total || 0) / limit),
    },
  });
}));

router.get('/blogs/:slug', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const row = await dbGet(
    `${baseBlogSelect} WHERE b.slug = ? AND b.status = 'published'`,
    [slug],
  );

  let post = row;

  if (!post) {
    const aliasMatch = await dbGet(
      'SELECT blog_id FROM blog_slug_aliases WHERE slug = ?',
      [slug],
    );
    if (aliasMatch?.blog_id) {
      post = await dbGet(
        `${baseBlogSelect} WHERE b.id = ? AND b.status = 'published'`,
        [aliasMatch.blog_id],
      );
    }
  }

  if (!post) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  const aliases = (await dbAll(
    'SELECT slug FROM blog_slug_aliases WHERE blog_id = ? ORDER BY created_at ASC',
    [post.id],
  )).map((item) => item.slug);

  const response = {
    id: post.id,
    title: post.title,
    slug: post.slug,
    aliases,
    shortDescription: post.short_description,
    fullContent: post.full_content,
    featuredImage: post.featured_image,
    category: {
      id: post.category_id,
      name: post.category_name,
      slug: post.category_slug,
    },
    author: post.author || DEFAULT_AUTHOR,
    readTime: post.read_time,
    publishDate: post.publish_date,
    metaTitle: post.meta_title,
    metaDescription: post.meta_description,
    status: post.status,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
  };

  res.json({ data: response });
}));

router.get('/blogs/:slug/related', asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const limit = Math.min(12, Math.max(1, Number(req.query.limit || 3)));

  const current = await dbGet(
    `${baseBlogSelect} WHERE b.slug = ? AND b.status = 'published'`,
    [slug],
  );

  if (!current) {
    return res.json({ data: [] });
  }

  const relatedRows = await dbAll(
    `${baseBlogSelect}
       WHERE b.status = 'published' AND b.category_id = ? AND b.id <> ?
       ORDER BY COALESCE(b.publish_date, b.created_at) DESC
       LIMIT ?`,
    [current.category_id, current.id, limit],
  );

  const data = relatedRows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    shortDescription: row.short_description,
    featuredImage: row.featured_image,
    category: {
      id: row.category_id,
      name: row.category_name,
      slug: row.category_slug,
    },
    readTime: row.read_time,
    publishDate: row.publish_date,
  }));

  res.json({ data });
}));

export default router;

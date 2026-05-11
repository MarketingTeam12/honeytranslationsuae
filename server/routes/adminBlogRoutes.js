import { Router } from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { dbAll, dbGet, dbRun, isMySql } from '../db/connection.js';
import { requireAdminAuth } from '../middleware/auth.js';
import { slugify } from '../utils/slug.js';
import { UPLOAD_DIR } from '../config.js';

fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const base = path.basename(file.originalname || 'image', ext);
    cb(null, `${Date.now()}-${slugify(base || 'image')}${ext || '.jpg'}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image uploads are allowed'));
      return;
    }
    cb(null, true);
  },
});

const router = Router();
const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
router.use(requireAdminAuth);

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

const insertAliasSql = isMySql
  ? 'INSERT IGNORE INTO blog_slug_aliases (blog_id, slug) VALUES (?, ?)'
  : 'INSERT OR IGNORE INTO blog_slug_aliases (blog_id, slug) VALUES (?, ?)';

const publishDateWhenPublishedSql = isMySql ? 'CURDATE()' : 'DATE("now")';
const DEFAULT_AUTHOR = 'Honey Translations Team';

function mapBlogRow(row) {
  return {
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
  };
}

function decodeParagraphValue(value) {
  return value
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\u00A0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function encodeParagraphValue(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isLikelyHtml(value) {
  return /<\/?[a-z][\s\S]*>/i.test(value || '');
}

function extractMeaningfulText(content) {
  return decodeParagraphValue((content || '').toString());
}

function normalizeFullContentValue(content) {
  const source = (content || '').toString().trim();
  if (!source) return '';

  if (isLikelyHtml(source)) {
    return source;
  }

  const paragraphs = source
    .split(/\n{2,}/)
    .map((paragraph) => decodeParagraphValue(paragraph))
    .filter(Boolean);

  if (paragraphs.length === 0) return '';

  return paragraphs.map((paragraph) => `<p>${encodeParagraphValue(paragraph)}</p>`).join('\n');
}

function extractParagraphsFromHtmlOrText(content) {
  const source = (content || '').toString();
  if (!source.trim()) return [];

  const paragraphMatches = [];
  const regex = /<p[^>]*>(.*?)<\/p>/gis;
  let match = regex.exec(source);
  while (match) {
    paragraphMatches.push(decodeParagraphValue(match[1] || ''));
    match = regex.exec(source);
  }

  if (paragraphMatches.length > 0) {
    return paragraphMatches.filter(Boolean);
  }

  return source
    .split(/\n{2,}/)
    .map((paragraph) => decodeParagraphValue(paragraph))
    .filter(Boolean);
}

function parseContentParagraphs(raw, fallbackContent) {
  const input = raw?.contentParagraphs;
  let paragraphs = [];

  if (Array.isArray(input)) {
    paragraphs = input.map((item) => decodeParagraphValue((item || '').toString())).filter(Boolean);
  } else if (typeof input === 'string' && input.trim()) {
    const maybeJson = input.trim();
    if (maybeJson.startsWith('[')) {
      try {
        const parsed = JSON.parse(maybeJson);
        if (Array.isArray(parsed)) {
          paragraphs = parsed.map((item) => decodeParagraphValue((item || '').toString())).filter(Boolean);
        }
      } catch {
        paragraphs = maybeJson
          .split('\n')
          .map((item) => decodeParagraphValue(item))
          .filter(Boolean);
      }
    } else {
      paragraphs = maybeJson
        .split('\n')
        .map((item) => decodeParagraphValue(item))
        .filter(Boolean);
    }
  }

  if (paragraphs.length === 0) {
    paragraphs = extractParagraphsFromHtmlOrText(fallbackContent);
  }

  if (paragraphs.length === 0) {
    const text = extractMeaningfulText(fallbackContent || '');
    if (text) paragraphs = [text];
  }

  return paragraphs.slice(0, 3);
}

function parseBlogPayload(req, existing = null) {
  const raw = req.body || {};
  const title = (raw.title || existing?.title || '').toString().trim();
  const derivedSlug = slugify((raw.slug || '').toString().trim() || title);
  const shortDescription = (raw.shortDescription || existing?.shortDescription || '').toString().trim();
  const categoryId = Number(raw.categoryId || existing?.category?.id || 0);
  const authorInput = (raw.author ?? existing?.author ?? '').toString().trim();
  const readTime = (raw.readTime || existing?.readTime || '').toString().trim();
  const publishDate = raw.publishDate ? raw.publishDate.toString().trim() : (existing?.publishDate || null);
  const status = (raw.status || existing?.status || 'draft').toString().trim().toLowerCase();
  const aliases = Array.isArray(raw.aliases)
    ? raw.aliases
    : (raw.aliases || '')
      .toString()
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

  const featuredImage = req.file
    ? `/uploads/${req.file.filename}`
    : (raw.featuredImage || existing?.featuredImage || '').toString().trim();

  const rawFullContent = (raw.fullContent ?? existing?.fullContent ?? '').toString();
  const fullContentFromInput = normalizeFullContentValue(rawFullContent);
  const contentParagraphs = parseContentParagraphs(raw, fullContentFromInput || existing?.fullContent || '');
  const fullContent = fullContentFromInput || contentParagraphs
    .map((paragraph) => `<p>${encodeParagraphValue(paragraph)}</p>`)
    .join('\n');

  const metaTitle = (raw.metaTitle || title || existing?.metaTitle || '').toString().trim();
  const metaDescription = (raw.metaDescription || shortDescription || existing?.metaDescription || '').toString().trim();

  if (!title) throw new Error('Title is required');
  if (!derivedSlug) throw new Error('Slug is required');
  if (!shortDescription) throw new Error('Short description is required');
  if (!categoryId) throw new Error('Category is required');
  if (!readTime) throw new Error('Read time is required');
  if (!['draft', 'published'].includes(status)) throw new Error('Status must be draft or published');
  if (!extractMeaningfulText(fullContent)) {
    throw new Error('Full article content is required');
  }

  return {
    title,
    slug: derivedSlug,
    shortDescription,
    fullContent,
    contentParagraphs,
    featuredImage,
    categoryId,
    author: authorInput || DEFAULT_AUTHOR,
    readTime,
    publishDate: publishDate || null,
    metaTitle,
    metaDescription,
    status,
    aliases: aliases.map(slugify).filter(Boolean).filter((value) => value !== derivedSlug),
  };
}

router.get('/categories', asyncHandler(async (_req, res) => {
  const categories = await dbAll(
    'SELECT id, name, slug, created_at FROM categories ORDER BY name ASC',
  );

  res.json({ data: categories });
}));

router.post('/categories', asyncHandler(async (req, res) => {
  const name = (req.body?.name || '').toString().trim();
  if (!name) {
    return res.status(400).json({ message: 'Category name is required' });
  }

  const slug = slugify(name);
  try {
    const result = await dbRun(
      'INSERT INTO categories (name, slug) VALUES (?, ?)',
      [name, slug],
    );

    const category = await dbGet(
      'SELECT id, name, slug, created_at FROM categories WHERE id = ?',
      [result.lastInsertRowid],
    );
    res.status(201).json({ data: category });
  } catch {
    res.status(409).json({ message: 'Category already exists' });
  }
}));

router.get('/blogs', asyncHandler(async (req, res) => {
  const status = (req.query.status || '').toString().trim();
  const categoryId = Number(req.query.categoryId || 0);
  const search = (req.query.search || '').toString().trim();

  const conditions = [];
  const params = [];

  if (status) {
    conditions.push('b.status = ?');
    params.push(status);
  }

  if (categoryId) {
    conditions.push('b.category_id = ?');
    params.push(categoryId);
  }

  if (search) {
    conditions.push('(b.title LIKE ? OR b.short_description LIKE ? OR b.full_content LIKE ?)');
    const like = `%${search}%`;
    params.push(like, like, like);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const rows = await dbAll(
    `${baseBlogSelect} ${where} ORDER BY COALESCE(b.publish_date, b.created_at) DESC`,
    params,
  );

  const data = await Promise.all(
    rows.map(async (row) => {
      const mapped = mapBlogRow(row);
      mapped.aliases = (await dbAll(
        'SELECT slug FROM blog_slug_aliases WHERE blog_id = ? ORDER BY created_at ASC',
        [row.id],
      )).map((item) => item.slug);
      return mapped;
    }),
  );

  res.json({ data });
}));

router.get('/blogs/:id', asyncHandler(async (req, res) => {
  const row = await dbGet(`${baseBlogSelect} WHERE b.id = ?`, [Number(req.params.id)]);

  if (!row) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  const aliases = (await dbAll(
    'SELECT slug FROM blog_slug_aliases WHERE blog_id = ? ORDER BY created_at ASC',
    [row.id],
  )).map((item) => item.slug);

  const data = mapBlogRow(row);
  data.aliases = aliases;

  res.json({ data });
}));

router.post('/blogs', upload.single('featuredImageFile'), asyncHandler(async (req, res) => {
  try {
    const payload = parseBlogPayload(req);

    const category = await dbGet('SELECT id FROM categories WHERE id = ?', [payload.categoryId]);
    if (!category) {
      return res.status(400).json({ message: 'Invalid category selected' });
    }

    const result = await dbRun(
      `INSERT INTO blogs (
        title, slug, short_description, full_content, featured_image, category_id,
        author, read_time, publish_date, meta_title, meta_description, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        payload.title,
        payload.slug,
        payload.shortDescription,
        payload.fullContent,
        payload.featuredImage,
        payload.categoryId,
        payload.author,
        payload.readTime,
        payload.publishDate,
        payload.metaTitle,
        payload.metaDescription,
        payload.status,
      ],
    );

    if (payload.aliases.length) {
      for (const alias of payload.aliases) {
        await dbRun(insertAliasSql, [result.lastInsertRowid, alias]);
      }
    }

    const row = await dbGet(`${baseBlogSelect} WHERE b.id = ?`, [result.lastInsertRowid]);
    const data = mapBlogRow(row);
    data.aliases = payload.aliases;
    data.contentParagraphs = payload.contentParagraphs;

    return res.status(201).json({ data });
  } catch (error) {
    if (error.message?.includes('UNIQUE')) {
      return res.status(409).json({ message: 'A blog with this slug already exists' });
    }

    return res.status(400).json({ message: error.message || 'Unable to create blog' });
  }
}));

router.put('/blogs/:id', upload.single('featuredImageFile'), asyncHandler(async (req, res) => {
  const blogId = Number(req.params.id);
  const existingRow = await dbGet(`${baseBlogSelect} WHERE b.id = ?`, [blogId]);

  if (!existingRow) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  try {
    const existing = mapBlogRow(existingRow);
    const payload = parseBlogPayload(req, existing);

    await dbRun(
      `UPDATE blogs SET
        title = ?,
        slug = ?,
        short_description = ?,
        full_content = ?,
        featured_image = ?,
        category_id = ?,
        author = ?,
        read_time = ?,
        publish_date = ?,
        meta_title = ?,
        meta_description = ?,
        status = ?
      WHERE id = ?`,
      [
        payload.title,
        payload.slug,
        payload.shortDescription,
        payload.fullContent,
        payload.featuredImage,
        payload.categoryId,
        payload.author,
        payload.readTime,
        payload.publishDate,
        payload.metaTitle,
        payload.metaDescription,
        payload.status,
        blogId,
      ],
    );

    await dbRun('DELETE FROM blog_slug_aliases WHERE blog_id = ?', [blogId]);
    if (payload.aliases.length) {
      for (const alias of payload.aliases) {
        await dbRun(insertAliasSql, [blogId, alias]);
      }
    }

    const row = await dbGet(`${baseBlogSelect} WHERE b.id = ?`, [blogId]);
    const data = mapBlogRow(row);
    data.aliases = payload.aliases;
    data.contentParagraphs = payload.contentParagraphs;

    return res.json({ data });
  } catch (error) {
    if (error.message?.includes('UNIQUE')) {
      return res.status(409).json({ message: 'A blog with this slug already exists' });
    }

    return res.status(400).json({ message: error.message || 'Unable to update blog' });
  }
}));

router.patch('/blogs/:id/status', asyncHandler(async (req, res) => {
  const blogId = Number(req.params.id);
  const status = (req.body?.status || '').toString().toLowerCase();
  if (!['draft', 'published'].includes(status)) {
    return res.status(400).json({ message: 'Status must be draft or published' });
  }

  const result = await dbRun(
    `UPDATE blogs SET status = ?, publish_date = CASE WHEN ? = 'published' AND publish_date IS NULL THEN ${publishDateWhenPublishedSql} ELSE publish_date END WHERE id = ?`,
    [status, status, blogId],
  );

  if (!result.changes) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  const row = await dbGet(`${baseBlogSelect} WHERE b.id = ?`, [blogId]);
  res.json({ data: mapBlogRow(row) });
}));

router.delete('/blogs/:id', asyncHandler(async (req, res) => {
  const blogId = Number(req.params.id);
  const result = await dbRun('DELETE FROM blogs WHERE id = ?', [blogId]);

  if (!result.changes) {
    return res.status(404).json({ message: 'Blog not found' });
  }

  res.json({ success: true });
}));

export default router;

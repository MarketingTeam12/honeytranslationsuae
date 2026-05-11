import bcrypt from 'bcryptjs';
import {
  dbGet,
  dbRun,
  isMySql,
  withTransaction,
} from './connection.js';
import { runMigrations } from './migrate.js';
import {
  ADMIN_DEFAULT_EMAIL,
  ADMIN_DEFAULT_PASSWORD,
  ADMIN_DEFAULT_USERNAME,
} from '../config.js';
import { LEGACY_BLOGS, LEGACY_CATEGORIES } from '../data/legacyBlogsSeed.js';

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

const upsertBlogSql = isMySql
  ? `
  INSERT INTO blogs (
    title, slug, short_description, full_content, featured_image,
    category_id, author, read_time, publish_date, meta_title, meta_description, status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON DUPLICATE KEY UPDATE
    title=VALUES(title),
    short_description=VALUES(short_description),
    full_content=VALUES(full_content),
    featured_image=VALUES(featured_image),
    category_id=VALUES(category_id),
    author=VALUES(author),
    read_time=VALUES(read_time),
    publish_date=VALUES(publish_date),
    meta_title=VALUES(meta_title),
    meta_description=VALUES(meta_description),
    status=VALUES(status)
`
  : `
  INSERT INTO blogs (
    title, slug, short_description, full_content, featured_image,
    category_id, author, read_time, publish_date, meta_title, meta_description, status
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  ON CONFLICT(slug) DO UPDATE SET
    title=excluded.title,
    short_description=excluded.short_description,
    full_content=excluded.full_content,
    featured_image=excluded.featured_image,
    category_id=excluded.category_id,
    author=excluded.author,
    read_time=excluded.read_time,
    publish_date=excluded.publish_date,
    meta_title=excluded.meta_title,
    meta_description=excluded.meta_description,
    status=excluded.status
`;

const insertIgnoreAdminSql = isMySql
  ? 'INSERT IGNORE INTO admins (username, email, password) VALUES (?, ?, ?)'
  : 'INSERT OR IGNORE INTO admins (username, email, password) VALUES (?, ?, ?)';

const insertIgnoreCategorySql = isMySql
  ? 'INSERT IGNORE INTO categories (name, slug) VALUES (?, ?)'
  : 'INSERT OR IGNORE INTO categories (name, slug) VALUES (?, ?)';

const insertIgnoreAliasSql = isMySql
  ? 'INSERT IGNORE INTO blog_slug_aliases (blog_id, slug) VALUES (?, ?)'
  : 'INSERT OR IGNORE INTO blog_slug_aliases (blog_id, slug) VALUES (?, ?)';

async function seedDatabase() {
  await runMigrations();

  await withTransaction(async (tx) => {
    const passwordHash = bcrypt.hashSync(ADMIN_DEFAULT_PASSWORD, 10);
    await tx.run(insertIgnoreAdminSql, [ADMIN_DEFAULT_USERNAME, ADMIN_DEFAULT_EMAIL, passwordHash]);

    for (const categoryName of LEGACY_CATEGORIES) {
      await tx.run(insertIgnoreCategorySql, [categoryName, slugify(categoryName)]);
    }

    for (const post of LEGACY_BLOGS) {
      const categorySlug = slugify(post.category);
      const category = await tx.get('SELECT id FROM categories WHERE slug = ?', [categorySlug]);
      if (!category) {
        throw new Error(`Missing category for slug: ${categorySlug}`);
      }

      await tx.run(upsertBlogSql, [
        post.title,
        post.slug,
        post.short_description,
        post.full_content,
        post.featured_image,
        category.id,
        post.author,
        post.read_time,
        post.publish_date,
        post.meta_title || post.title,
        post.meta_description || post.short_description,
        post.status || 'draft',
      ]);

      const blog = await tx.get('SELECT id FROM blogs WHERE slug = ?', [post.slug]);
      if (blog && Array.isArray(post.aliases)) {
        for (const alias of post.aliases) {
          if (alias && alias !== post.slug) {
            await tx.run(insertIgnoreAliasSql, [blog.id, alias]);
          }
        }
      }
    }
  });

  console.log('Database seed complete.');
  console.log(`Admin login -> email: ${ADMIN_DEFAULT_EMAIL} password: ${ADMIN_DEFAULT_PASSWORD}`);
}

await seedDatabase();

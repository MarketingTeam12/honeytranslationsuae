import { Router } from 'express';
import { dbGet } from '../db/connection.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = Router();
const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
router.use(requireAdminAuth);

router.get('/stats', asyncHandler(async (_req, res) => {
  const totals = await dbGet(`
    SELECT
      COUNT(*) as totalBlogs,
      SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as publishedBlogs,
      SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draftBlogs
    FROM blogs
  `);

  const categories = await dbGet('SELECT COUNT(*) as categoriesCount FROM categories');

  res.json({
    data: {
      totalBlogs: totals?.totalBlogs || 0,
      publishedBlogs: totals?.publishedBlogs || 0,
      draftBlogs: totals?.draftBlogs || 0,
      categoriesCount: categories?.categoriesCount || 0,
    },
  });
}));

export default router;

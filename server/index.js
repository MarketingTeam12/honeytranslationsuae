import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PORT, ROOT_DIR, UPLOAD_DIR } from './config.js';
import { runMigrations } from './db/migrate.js';
import publicBlogRoutes from './routes/publicBlogRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import adminDashboardRoutes from './routes/adminDashboardRoutes.js';
import adminBlogRoutes from './routes/adminBlogRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

fs.mkdirSync(UPLOAD_DIR, { recursive: true });
await runMigrations();

const app = express();

const corsOrigins = (process.env.CMS_CORS_ORIGIN || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: corsOrigins.length ? corsOrigins : true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.resolve(ROOT_DIR, 'public', 'uploads')));
app.use('/api', publicBlogRoutes);
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/dashboard', adminDashboardRoutes);
app.use('/api/admin', adminBlogRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'blog-cms-api' });
});

app.use((error, _req, res, _next) => {
  const message = error?.message || 'Internal server error';
  const status = error?.status || 500;
  res.status(status).json({ message });
});

app.listen(PORT, () => {
  console.log(`CMS API running on port ${PORT}`);
  console.log(`Uploads directory: ${UPLOAD_DIR}`);
});

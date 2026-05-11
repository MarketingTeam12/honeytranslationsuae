import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT_DIR = path.resolve(__dirname, '..');
export const SERVER_DIR = __dirname;
export const PORT = Number(process.env.CMS_API_PORT || 8787);
export const DB_CLIENT = (process.env.CMS_DB_CLIENT || 'sqlite').toLowerCase() === 'mysql' ? 'mysql' : 'sqlite';
export const DB_PATH = process.env.CMS_DB_PATH || path.join(ROOT_DIR, 'server', 'db', 'cms.sqlite');
export const MYSQL_HOST = process.env.CMS_MYSQL_HOST || '127.0.0.1';
export const MYSQL_PORT = Number(process.env.CMS_MYSQL_PORT || 3306);
export const MYSQL_USER = process.env.CMS_MYSQL_USER || 'root';
export const MYSQL_PASSWORD = process.env.CMS_MYSQL_PASSWORD || '';
export const MYSQL_DATABASE = process.env.CMS_MYSQL_DATABASE || 'honeytranslations_cms';
export const JWT_SECRET = process.env.CMS_JWT_SECRET || 'change-me-in-production';
export const JWT_EXPIRES_IN = process.env.CMS_JWT_EXPIRES_IN || '12h';
export const UPLOAD_DIR = process.env.CMS_UPLOAD_DIR || path.join(ROOT_DIR, 'public', 'uploads');
export const ADMIN_DEFAULT_EMAIL = process.env.CMS_ADMIN_EMAIL || 'admin@honeytranslations.com';
export const ADMIN_DEFAULT_USERNAME = process.env.CMS_ADMIN_USERNAME || 'admin';
export const ADMIN_DEFAULT_PASSWORD = process.env.CMS_ADMIN_PASSWORD || 'Admin@12345';

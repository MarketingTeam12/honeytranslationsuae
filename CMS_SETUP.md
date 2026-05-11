# Admin Dashboard + Dynamic Blog CMS Setup

## 1) Install dependencies

```bash
npm install
```

If you want MySQL mode, also install:

```bash
npm install mysql2
```

## 2) Configure environment

Copy `.env.example` to `.env` and update values:

- `CMS_DB_CLIENT=sqlite` or `CMS_DB_CLIENT=mysql`
- `CMS_JWT_SECRET`
- `CMS_ADMIN_EMAIL`
- `CMS_ADMIN_PASSWORD`
- `VITE_CMS_API_BASE` (optional)

For MySQL mode, also set:

- `CMS_MYSQL_HOST`
- `CMS_MYSQL_PORT`
- `CMS_MYSQL_USER`
- `CMS_MYSQL_PASSWORD`
- `CMS_MYSQL_DATABASE`

## 3) Initialize database (migrate + seed existing blogs)

```bash
npm run db:init
```

This creates:

- `admins`
- `categories`
- `blogs`
- `blog_slug_aliases`

and seeds existing legacy blog entries so current blog content appears in admin.

## 4) Run backend API

```bash
npm run api:dev
```

API runs on `http://localhost:8787` by default.

## 5) Run frontend

```bash
npm run dev
```

`npm run dev` starts frontend and backend together.
If you prefer separate terminals, use:

- `npm run dev:frontend`
- `npm run api:dev`

## Admin Login

Use credentials from `.env`:

- Email: `CMS_ADMIN_EMAIL`
- Password: `CMS_ADMIN_PASSWORD`

## Blog Content Rule

Admin blog form now accepts only short article bodies:

- exactly 2 required short paragraphs
- optional 3rd paragraph

The public blog detail page renders this short content layout only (no long article sections).

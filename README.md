# honeytranslations.be (Copy)

This project now uses Supabase for:
- Admin authentication
- Blog/category storage
- Featured image storage

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Copy env template and fill your Supabase credentials:

```bash
cp .env.example .env
```

Required variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_BLOG_IMAGE_BUCKET` (optional, default: `blog-images`)

3. In Supabase SQL Editor, run:

`supabase/schema.sql`

4. Create your first admin user:
- Go to Supabase Auth, create a user with email/password.
- Insert that user into `public.admin_users` using the SQL shown at the bottom of `supabase/schema.sql`.

5. Start app:

```bash
npm run dev
```

## Admin routes

- Login: `/admin/login`
- Dashboard: `/admin`
- Blog management: `/admin/blogs`

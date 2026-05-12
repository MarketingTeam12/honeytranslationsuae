
  # honeytranslations.be (Copy)

  This is a code bundle for honeytranslations.be (Copy). The original project is available at https://www.figma.com/design/rF8oUZI8J3AS1cSWHJUoWL/honeytranslations.be--Copy-.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.

  ## Admin API in Production (Cloudflare Pages)

  This project uses frontend calls like `/api/admin/auth/login`.
  On Cloudflare Pages, those routes must be backed by Pages Functions.

  Added Functions:
  - `functions/api/admin/auth/login.js` (`POST`, `OPTIONS`)
  - `functions/api/admin/auth/me.js` (`GET`, `OPTIONS`)
  - `functions/api/admin/auth/logout.js` (`POST`, `OPTIONS`)

  Required Cloudflare environment variables:
  - `CMS_API_ORIGIN`: public origin of your backend API (example: `https://api.yourdomain.com`)
  - `CMS_CORS_ORIGIN`: comma-separated allowed origins (example: `https://honeytranslationsuae.pages.dev,https://yourdomain.com`)

  Notes:
  - Frontend login uses `POST /api/admin/auth/login` with JSON body `{ "email": "...", "password": "..." }`.
  - Functions proxy auth requests to `${CMS_API_ORIGIN}/api/admin/auth/*`.
  - If `CMS_API_ORIGIN` is missing, auth endpoints return JSON error responses.
  

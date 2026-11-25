# Royal Furniture demo

A production-shaped furniture catalogue built with React, Vite, Tailwind CSS and Supabase. It includes a premium responsive storefront, catalogue filters, product detail pages, enquiry flows, owner-only authentication, product/category CRUD, Supabase Storage uploads, PostgreSQL migrations with row-level security, seed data and Cloudflare Pages configuration.

All brand content, prices and products are clearly sample data. No real phone number, address, email, social account or customer claim has been invented.

## What is included

- Responsive cream, dark-green and walnut visual system
- Home, catalogue, product details, about, gallery and contact pages
- Search, category, stock and price sorting filters
- WhatsApp enquiry links configured from an environment variable
- Supabase email/password authentication for the owner
- Owner-only dashboard, product CRUD and category CRUD
- Multi-image uploads to a public-read, owner-write Storage bucket
- Public enquiry capture with owner-only read access in PostgreSQL
- RLS policies for every application table and Storage operation
- Eight local demo products, five categories and project-local artwork
- Cloudflare Pages SPA routing and build configuration
- Vitest checks and a GitHub Actions verification workflow

## Run the public demo locally

Requirements: Node.js 20 or newer and npm.

```bash
npm install
npm run dev
```

The public catalogue works immediately with the local demo data. The owner login remains securely unavailable until Supabase is configured.

## Connect Supabase

1. Create a free Supabase project.
2. Open **SQL Editor** and run `supabase/migrations/202611240001_initial_schema.sql`.
3. Run `supabase/seed.sql` to add the demo catalogue.
4. In **Authentication → Users**, create the owner's real login.
5. Copy `supabase/owner-bootstrap.sql.example`, replace the reserved example email with that exact login email, and run it in SQL Editor.
6. In **Project Settings → API**, copy the Project URL and the public anon key.
7. Copy `.env.example` to `.env.local` and add those two public values:

```dotenv
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
VITE_WHATSAPP_NUMBER=
```

8. Add the deployed Cloudflare URL to **Authentication → URL Configuration** as the Site URL. Keep the local URL in the allowed redirect list for development.
9. Restart `npm run dev`, then sign in at `/admin/login`.

The migration creates the `product-images` bucket. It allows public reads but requires an authenticated user listed in `owner_profiles` for writes. Never put the Supabase service-role key in this Vite project.

## Configure WhatsApp

Set `VITE_WHATSAPP_NUMBER` to the owner's verified WhatsApp number, using digits only and including the country code. Until it is set, enquiry buttons copy a prepared message instead of opening an invented number.

## Verify before publishing

```bash
npm test
npm run build
npm run preview
```

The production output is written to `dist/`. The file `public/_redirects` makes React Router URLs work when opened directly on Cloudflare Pages.

## Publish with GitHub and Cloudflare Pages

1. Create an empty GitHub repository and push this folder to it.
2. In Cloudflare, open **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository and use:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: `20`
4. Add `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` and, when verified, `VITE_WHATSAPP_NUMBER` under the Pages project's environment variables.
5. Deploy, open the generated Pages URL, and verify the public catalogue, a direct product URL, owner login and one image upload.
6. Add that exact Pages URL to Supabase Authentication URL Configuration.

`wrangler.jsonc` is also included for a future CLI-based Pages workflow. No deployment is claimed until the resulting Cloudflare URL has been opened and verified.

## Security model

- Visitors can read only published products.
- Visitors can submit a constrained enquiry but cannot list enquiries.
- Authenticated users do not automatically become owners.
- Only users explicitly inserted into `owner_profiles` can create, update or delete catalogue data or upload images.
- Owner checks are enforced in PostgreSQL RLS and Storage policies, not only in the React interface.
- The browser receives only Supabase's public anon key; privileged keys remain server-side in Supabase.

## Main project paths

- `src/pages` — public and owner experiences
- `src/services/catalog.ts` — catalogue and enquiry access
- `supabase/migrations` — schema, RLS and Storage policies
- `supabase/seed.sql` — repeatable demo content
- `public/assets` — local hero and product artwork
- `.github/workflows/ci.yml` — test/build verification for GitHub

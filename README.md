# Flight CMS: admin panel and API for a flight booking website

React + Tailwind admin panel, Node/Express + MongoDB API, Cloudinary images.
Built from the *Flight CMS* scope document (ASharp Infotech). Requires Node 18.11+ and MongoDB 5+.

## Run it

```bash
# 1. API  (http://localhost:5000)
cd server
cp .env.example .env        # set MONGODB_URI, JWT_SECRET, ADMIN_* and SITE_URL
npm install
npm run dev

# 2. Admin panel  (http://localhost:5173), in a second terminal
cd client
cp .env.example .env        # set the Cloudinary cloud name and unsigned upload preset
npm install
npm run dev
```

On first start the API creates the admin user from `ADMIN_*`, the email/SMS templates, the six travel guides,
the nine fixed pages (as drafts) and the main and footer menus. Sign in with that username and password.

## Structure

```
server/src
  config/ constants/   environment, statuses, public URL structure, settings defaults
  models/              one Mongoose model per content type (+ shared plugins: slug, publish, seo, audit)
  resources/           registry.js: every collection described once; importers.js: bulk upload
  controllers/ routes/ admin API (/api/admin), public API (/api/public), auth (/api/auth)
  services/            SEO tags, fares, related routes, mail, templates, home page, site bundle
  middleware/ seed/    auth + roles, cache, rate limits, first-run data
client/src
  resources/           one short file per area: routes, airlines, offers, settings... (fields, columns, filters)
  components/          forms (fields, image upload, repeater, SEO, publish), content (generic list and editor)
  features/            dashboard, reports, media library, auth, SEO duplicates, extra panels
  hooks/ services/     list and editor state, API client, Cloudinary upload
```

Admin screens are generated from the definitions in `client/src/resources`, and the API endpoints from
`server/src/resources/registry.js`. To add a field, edit the model and the matching resource file.

## Where each part of the scope document lives

| Scope section | Admin menu |
| --- | --- |
| Login, forgot/change password, auto logout, dashboard | Sign-in pages, Dashboard |
| Header / top bar, home page, search box | Website |
| Banners, announcement bar, popups, cookie consent | Website |
| Domestic/international routes (bulk upload, auto page), destinations, airlines, airports, deals, offers, special fares, trust badges | Flights |
| Blogs, travel guides, FAQs, testimonials, static pages, help center, contact page | Content |
| Menus, footer | Navigation |
| SEO settings, 301 redirects, duplicate content | SEO |
| Email/SMS templates, newsletter, enquiries, WhatsApp, mobile app links | Communication |
| Media library, reports | Tools |
| Users and roles, activity log, theme, settings, SMTP, backup, cache | Administration |

Admin can do everything. Editor can add and edit content but cannot delete, or change theme, settings, SMTP,
SEO settings, users or the backup/cache tools. Blocked users lose access immediately.

## Public API for the website (no login)

Every page-type response includes a computed `seo` object: `title`, `description`, `keywords`, `canonical`,
`robots`, `og`, `breadcrumbs` and `jsonLd` (page + BreadcrumbList + FAQPage).

| Endpoint | Purpose |
| --- | --- |
| `GET /site-config` | header, footer (with automatic popular links), menus, theme, search box, WhatsApp, cookie message, announcement bar, popups, tracking scripts |
| `GET /home` | enabled home sections in order, each with its data |
| `GET /routes`, `/routes/:slug` | route cards; full page with cheapest fare, related and nearby routes, FAQs, deals |
| `GET /destinations`, `/airlines`, `/offers`, `/blogs`, `/guides` (+ `/:slug`) | lists (`?page&limit&q`, filters like `?type=domestic`, `?offerType=bank`, `?sort=popular`) and detail pages |
| `GET /deals`, `/banners`, `/faqs`, `/testimonials`, `/trust-items`, `/cities`, `/menus` | lists with filters (`?showOn=home`, `?position=home`, `?showOn=route`) |
| `GET /pages/:key` | about, privacy, terms, disclaimer, payment-refund, student-fare, senior-citizen-fare, armed-forces-fare, doctors-nurses-fare |
| `GET /help-center`, `/contact-page` | page content with SEO |
| `POST /enquiries` | contact form (`name, email, phone, subject, message, captchaToken`) |
| `POST /newsletter/subscribe`, `/confirm`, `/unsubscribe` | subscribe, then `{ token }` from the email link |
| `POST /track` | `{ type: "view" \| "click", path, refType: "route" \| "banner" \| "offer" \| "blog", refId, label }` for the reports |
| `GET /sitemap.xml`, `/sitemap`, `/robots.txt` | sitemap and robots.txt |
| `GET /redirects`, `/redirects/resolve?path=` | 301/302 redirects to apply on the website |
| `GET /preview/:token` | draft preview (the admin "Preview" button opens `SITE_URL/<page>?preview=<token>`) |

All paths are under `/api/public`. Responses are cached for 60 seconds and the cache is cleared on every admin change.
Match the URL structure in `server/src/constants/paths.js` to your website routes.

## Things that need your input

- **Live fares:** set `FARE_API_URL` to an endpoint answering `GET ?from=DEL&to=BOM` with `{ "fare": 3499 }`. Without it, "automatic" fares fall back to the manual fare.
- **Email:** set SMTP in `SMTP settings` (or `.env`). Without it, emails are skipped and the API keeps working.
- **SMS:** templates are stored and returned, but sending needs an SMS gateway on the website side.
- **Captcha:** set `RECAPTCHA_SECRET` and the site key under Contact us page. Without the secret, the check is skipped outside production only.
- **Images:** Cloudinary unsigned upload preset (client). Set the `CLOUDINARY_*` API keys on the server to also delete files from Cloudinary when removed from the media library.
- **Reports:** the website must call `POST /track` for visits and clicks.
- **Maintenance mode:** returned in `/site-config` (`settings.maintenanceMode`); the website decides what to show.

import { env } from '../config/env.js';
import { PUBLIC_PATHS } from '../constants/paths.js';
import { Page } from '../models/Page.js';
import { Redirect } from '../models/Redirect.js';
import { PUBLIC_RESOURCES } from '../resources/registry.js';
import { publicFilterFor } from '../resources/publicQuery.js';
import { getConfig } from '../services/siteConfigService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { activeOnly, all, publishedNow } from '../utils/publicFilters.js';

const xmlEscape = (text) => String(text).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);

/** Every indexable public URL. Documents marked "no-index" are left out. */
async function collectSitemapEntries() {
  const [helpCenter, contactPage] = await Promise.all([getConfig('helpCenter'), getConfig('contactPage')]);
  const fixed = [
    ['/', true],
    [PUBLIC_PATHS.helpCenter(helpCenter), !helpCenter.seo?.noindex],
    [PUBLIC_PATHS.contactPage(contactPage), !contactPage.seo?.noindex],
  ];
  const entries = fixed.filter(([, indexable]) => indexable).map(([path]) => ({ loc: `${env.siteUrl}${path}` }));

  const pages = await Page.find(all(publishedNow(), { 'seo.noindex': { $ne: true } }));
  pages.forEach((page) => entries.push({ loc: `${env.siteUrl}${PUBLIC_PATHS.pages(page)}`, lastmod: page.updatedAt }));

  for (const resource of PUBLIC_RESOURCES.filter((item) => item.public.bySlug !== false && PUBLIC_PATHS[item.name])) {
    const docs = await resource.Model.find(all(publicFilterFor(resource), { 'seo.noindex': { $ne: true } })).select('slug type updatedAt');
    docs.forEach((doc) => entries.push({ loc: `${env.siteUrl}${PUBLIC_PATHS[resource.name](doc)}`, lastmod: doc.updatedAt }));
  }
  return entries;
}

export const getSitemapJson = asyncHandler(async (_req, res) => res.json(await collectSitemapEntries()));

export const getSitemapXml = asyncHandler(async (_req, res) => {
  const urls = (await collectSitemapEntries())
    .map(({ loc, lastmod }) => `<url><loc>${xmlEscape(loc)}</loc>${lastmod ? `<lastmod>${lastmod.toISOString()}</lastmod>` : ''}</url>`)
    .join('');
  res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
});

export const getRobotsTxt = asyncHandler(async (_req, res) => {
  const { robotsTxt } = await getConfig('seoSettings');
  const withSitemap = /sitemap:/i.test(robotsTxt) ? robotsTxt : `${robotsTxt}\n\nSitemap: ${env.siteUrl}/sitemap.xml`;
  res.type('text/plain').send(withSitemap);
});

export const listRedirects = asyncHandler(async (_req, res) => {
  const redirects = await Redirect.find(activeOnly());
  res.json(redirects.map(({ fromPath, toPath, statusCode }) => ({ fromPath, toPath, statusCode })));
});

/** Lets the website check a single path on each request: `?path=/old-url`. */
export const resolveRedirect = asyncHandler(async (req, res) => {
  const redirect = await Redirect.findOne(all(activeOnly(), { fromPath: String(req.query.path ?? '') }));
  res.json(redirect ? { toPath: redirect.toPath, statusCode: redirect.statusCode } : null);
});

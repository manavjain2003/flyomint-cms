import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { PAGES } from '../constants/paths.js';
import { Faq } from '../models/Faq.js';
import { Page } from '../models/Page.js';
import { RESOURCE_MAP } from '../resources/registry.js';
import { buildHomePage } from '../services/homeService.js';
import { toDetail } from '../services/publicSerializer.js';
import { buildSeo, toPublicJson } from '../services/seoService.js';
import { getSiteBundle } from '../services/siteBundleService.js';
import { getConfig } from '../services/siteConfigService.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { activeOnly, all, publishedNow } from '../utils/publicFilters.js';

/** Header, footer, menus, theme, search box, popups... everything shared by all pages. */
export const getSiteConfig = asyncHandler(async (_req, res) => res.json(await getSiteBundle()));

export const getHome = asyncHandler(async (_req, res) => res.json(await buildHomePage()));

const singletonPage = (key) =>
  asyncHandler(async (_req, res) => {
    const config = await getConfig(key);
    res.json({ ...config, seo: buildSeo(key, config) });
  });

/** Help topics written on the page plus the FAQs marked "show on Help Center". */
export const getHelpCenter = asyncHandler(async (_req, res) => {
  const [config, extraFaqs] = await Promise.all([
    getConfig('helpCenter'),
    Faq.find(all(activeOnly(), { showOn: 'help' })).sort({ order: 1 }),
  ]);
  const faqs = [...config.topics, ...extraFaqs].map(({ question, answer }) => ({ question, answer }));
  res.json({ ...config, faqs, seo: buildSeo('helpCenter', { ...config, faqs }) });
});
export const getContactPage = singletonPage('contactPage');

/** Static pages and special fare pages. */
export const getPage = asyncHandler(async (req, res) => {
  const page = await Page.findOne(all(publishedNow(), { key: req.params.key }));
  if (!page) throw new ApiError(404, 'Page not found');
  res.json({ ...toPublicJson('pages', page.toJSON()), kind: PAGES[page.key].kind });
});

/** Renders a draft for the admin's "Preview" button, using the token from the admin panel. */
export const getPreview = asyncHandler(async (req, res) => {
  let payload;
  try {
    payload = jwt.verify(req.params.token, env.jwtSecret);
  } catch {
    throw new ApiError(401, 'This preview link has expired');
  }

  if (payload.resource === 'pages') {
    const page = await Page.findById(payload.id);
    if (!page) throw new ApiError(404, 'Page not found');
    return res.json({ ...toPublicJson('pages', page.toJSON()), kind: PAGES[page.key].kind, preview: true });
  }

  const resource = RESOURCE_MAP[payload.resource];
  const doc = resource && (await resource.Model.findById(payload.id));
  if (!doc) throw new ApiError(404, 'Content not found');
  return res.json({ ...(await toDetail(resource, doc)), preview: true });
});

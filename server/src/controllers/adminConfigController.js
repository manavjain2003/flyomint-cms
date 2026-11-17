import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { PAGES, PUBLIC_PATHS } from '../constants/paths.js';
import { SITE_CONFIG } from '../constants/siteConfig.js';
import { ROLES } from '../constants/content.js';
import { Page } from '../models/Page.js';
import { logActivity } from '../services/activityService.js';
import { getConfig, saveConfig } from '../services/siteConfigService.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sanitizeBody } from '../utils/object.js';

// ---- singleton settings groups (header, footer, theme, SMTP...) ----
export const getSiteConfig = asyncHandler(async (req, res) => {
  res.json(await getConfig(req.params.key));
});

export const saveSiteConfig = asyncHandler(async (req, res) => {
  const { key } = req.params;
  if (SITE_CONFIG[key].adminOnly && req.user.role !== ROLES.ADMIN) {
    throw new ApiError(403, 'Only an admin can change these settings');
  }
  const saved = await saveConfig(key, sanitizeBody(req.body));
  logActivity(req, { action: 'updated settings', resource: 'settings', title: key });
  res.json(saved);
});

// ---- fixed pages (about, privacy, special fares...) ----
export const getPage = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const page = await Page.findOne({ key });
  res.json(page ?? { key, title: PAGES[key].title, status: 'draft', seo: {} });
});

export const savePage = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const page = await Page.findOneAndUpdate(
    { key },
    { ...sanitizeBody(req.body), key, updatedBy: req.user.username },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  );
  logActivity(req, { action: 'updated', resource: 'pages', doc: page, title: PAGES[key].title });
  res.json(page);
});

export const getPagePreviewLink = asyncHandler(async (req, res) => {
  const page = await Page.findOne({ key: req.params.key });
  if (!page) throw new ApiError(404, 'Save the page first to preview it');
  const token = jwt.sign({ resource: 'pages', id: page.id }, env.jwtSecret, { expiresIn: '30m' });
  res.json({ url: `${env.siteUrl}${PUBLIC_PATHS.pages(page)}?preview=${token}` });
});

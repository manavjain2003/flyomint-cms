import { Router } from 'express';
import { createPublicResourceController } from '../controllers/publicResourceController.js';
import { confirmSubscription, submitEnquiry, subscribe, trackEvent, unsubscribe } from '../controllers/publicFormsController.js';
import { getRobotsTxt, getSitemapJson, getSitemapXml, listRedirects, resolveRedirect } from '../controllers/publicSeoController.js';
import { getContactPage, getHelpCenter, getHome, getPage, getPreview, getSiteConfig } from '../controllers/publicSiteController.js';
import { publicCache } from '../middleware/cache.js';
import { formLimiter, trackLimiter } from '../middleware/rateLimiters.js';
import { validatePageKey } from '../middleware/validateKeys.js';
import { PUBLIC_RESOURCES } from '../resources/registry.js';

const router = Router();

// Never cached: drafts and per-request lookups
router.get('/preview/:token', getPreview);
router.get('/redirects/resolve', resolveRedirect);

// Forms and tracking
router.post('/enquiries', formLimiter, submitEnquiry);
router.post('/newsletter/subscribe', formLimiter, subscribe);
router.post('/newsletter/confirm', formLimiter, confirmSubscription);
router.post('/newsletter/unsubscribe', formLimiter, unsubscribe);
router.post('/track', trackLimiter, trackEvent);

// Cached content
router.use(publicCache);
router.get('/site-config', getSiteConfig);
router.get('/home', getHome);
router.get('/help-center', getHelpCenter);
router.get('/contact-page', getContactPage);
router.get('/pages/:key', validatePageKey, getPage);
router.get('/sitemap', getSitemapJson);
router.get('/sitemap.xml', getSitemapXml);
router.get('/robots.txt', getRobotsTxt);
router.get('/redirects', listRedirects);

PUBLIC_RESOURCES.forEach((resource) => {
  const controller = createPublicResourceController(resource);
  router.get(`/${resource.name}`, controller.list);
  if (resource.public.bySlug !== false) router.get(`/${resource.name}/:slug`, controller.getBySlug);
});

export default router;

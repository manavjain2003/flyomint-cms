import { Router } from 'express';
import { ROLES } from '../constants/content.js';
import { createAdminResourceController } from '../controllers/adminResourceController.js';
import { getPage, getPagePreviewLink, getSiteConfig, savePage, saveSiteConfig } from '../controllers/adminConfigController.js';
import { exportReport, getDashboard, getDuplicates, getReport } from '../controllers/adminInsightsController.js';
import { backupData, clearCache, sendCampaign, testTemplate } from '../controllers/adminToolsController.js';
import { authenticate, requireRole } from '../middleware/authenticate.js';
import { invalidateCacheOnWrite } from '../middleware/cache.js';
import { upload } from '../middleware/upload.js';
import { validateConfigKey, validatePageKey } from '../middleware/validateKeys.js';
import { RESOURCES } from '../resources/registry.js';

const router = Router();
const adminOnly = requireRole(ROLES.ADMIN);

router.use(authenticate, invalidateCacheOnWrite);

// Dashboard, reports and SEO tools
router.get('/dashboard', getDashboard);
router.get('/reports', getReport);
router.get('/reports/export', exportReport);
router.get('/seo/duplicates', getDuplicates);

// Settings groups and fixed pages
router.route('/site-config/:key').all(validateConfigKey).get(getSiteConfig).put(saveSiteConfig);
router.route('/pages/:key').all(validatePageKey).get(getPage).put(savePage);
router.get('/pages/:key/preview-link', validatePageKey, getPagePreviewLink);

// System tools (admin only)
router.get('/system/backup', adminOnly, backupData);
router.post('/system/clear-cache', adminOnly, clearCache);

// Resource-specific actions
router.post('/templates/:id/test', testTemplate);
router.post('/subscribers/send-campaign', sendCampaign);

/** Generates the standard endpoints for each registry resource. */
function mountResource(resource) {
  const controller = createAdminResourceController(resource);
  const routes = Router();
  const canWrite = !resource.readOnly;
  const isPreviewable = resource.public && resource.public.bySlug !== false;

  if (resource.exportColumns) routes.get('/export', controller.exportFile);
  if (resource.importer) {
    routes.get('/import-template', controller.importTemplate);
    routes.post('/import', upload.single('file'), controller.importFile);
  }

  routes.get('/', controller.list);
  if (canWrite && !resource.noCreate) routes.post('/', controller.create);
  routes.get('/:id', controller.get);
  if (canWrite) routes.put('/:id', controller.update);
  if (canWrite && resource.duplicable) routes.post('/:id/duplicate', controller.duplicate);
  if (isPreviewable) routes.get('/:id/preview-link', controller.previewLink);
  if (canWrite && !resource.noDelete) routes.delete('/:id', adminOnly, controller.remove); // editors cannot delete

  router.use(`/${resource.name}`, ...(resource.adminOnly ? [adminOnly] : []), routes);
}

RESOURCES.forEach(mountResource);

export default router;

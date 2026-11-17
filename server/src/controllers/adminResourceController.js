import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { PUBLIC_PATHS } from '../constants/paths.js';
import { buildAdminFilter } from '../resources/publicQuery.js';
import { logActivity } from '../services/activityService.js';
import { buildWorkbook, parseSpreadsheet, sendWorkbook } from '../services/importExportService.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { omit, sanitizeBody } from '../utils/object.js';

const MAX_PAGE_SIZE = 500;
const PREVIEW_LIFETIME = '30m';
const SAFE_SORT = /^-?\w+$/;

const formatCell = (value) => (value instanceof Date ? value.toISOString().slice(0, 10) : value ?? '');

/** Admin handlers (list, CRUD, duplicate, import/export, preview link) for one registry resource. */
export function createAdminResourceController(resource) {
  const { Model, name, titleField } = resource;
  const present = (doc) => omit(doc.toJSON(), resource.hiddenFields ?? []);
  const populate = resource.populate ?? [];

  const findOrFail = async (id) => {
    const doc = await Model.findById(id);
    if (!doc) throw new ApiError(404, 'Item not found');
    return doc;
  };

  /** A published document without a date gets today's date, so lists can show "publish date". */
  const stampPublishDate = (data, existing) => {
    const needsDate = data.status === 'published' && !data.publishAt && !existing?.publishAt;
    if (needsDate && Model.schema.path('publishAt')) data.publishAt = new Date();
  };

  const writableFields = (body) => {
    const data = sanitizeBody(body);
    if (!resource.editableFields) return data;
    return Object.fromEntries(Object.entries(data).filter(([field]) => resource.editableFields.includes(field)));
  };

  return {
    list: asyncHandler(async (req, res) => {
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Number(req.query.limit) || 20, MAX_PAGE_SIZE);
      const requestedSort = SAFE_SORT.test(req.query.sort ?? '') ? req.query.sort : null;
      const filter = buildAdminFilter(resource, req.query);

      const [docs, total] = await Promise.all([
        Model.find(filter).sort(requestedSort ?? resource.sort ?? '-createdAt')
          .skip((page - 1) * limit).limit(limit).populate(populate),
        Model.countDocuments(filter),
      ]);
      res.json({ items: docs.map(present), total, page, pages: Math.ceil(total / limit) });
    }),

    get: asyncHandler(async (req, res) => res.json(present(await findOrFail(req.params.id)))),

    create: asyncHandler(async (req, res) => {
      const data = writableFields(req.body);
      await resource.beforeSave?.(data, { isNew: true, req });
      stampPublishDate(data);

      const doc = await Model.create({ ...data, createdBy: req.user.username, updatedBy: req.user.username });
      logActivity(req, { action: 'created', resource: name, doc });
      res.status(201).json(present(doc));
    }),

    update: asyncHandler(async (req, res) => {
      const doc = await findOrFail(req.params.id);
      const data = writableFields(req.body);
      await resource.beforeSave?.(data, { isNew: false, req, id: req.params.id });
      stampPublishDate(data, doc);

      doc.set({ ...data, updatedBy: req.user.username });
      await doc.save();
      logActivity(req, { action: 'updated', resource: name, doc });
      res.json(present(doc));
    }),

    remove: asyncHandler(async (req, res) => {
      const doc = await findOrFail(req.params.id);
      await resource.beforeDelete?.(doc, req);
      await doc.deleteOne();
      logActivity(req, { action: 'deleted', resource: name, doc });
      res.status(204).end();
    }),

    /** Copies a document as a draft with a new slug, to create a similar page quickly. */
    duplicate: asyncHandler(async (req, res) => {
      const source = await findOrFail(req.params.id);
      const copy = sanitizeBody(source.toObject());

      copy[titleField] = `${copy[titleField]} (Copy)`;
      if (copy.slug) copy.slug = `${copy.slug}-copy-${Date.now().toString(36)}`;
      if (Model.schema.path('status')) copy.status = 'draft';

      const doc = await Model.create({ ...copy, createdBy: req.user.username, updatedBy: req.user.username });
      logActivity(req, { action: 'duplicated', resource: name, doc });
      res.status(201).json(present(doc));
    }),

    exportFile: asyncHandler(async (req, res) => {
      const docs = await Model.find(buildAdminFilter(resource, req.query)).sort('-createdAt').limit(50_000);
      const rows = docs.map((doc) => Object.fromEntries(resource.exportColumns.map(({ key }) => [key, formatCell(doc[key])])));
      sendWorkbook(res, name, await buildWorkbook([{ name, columns: resource.exportColumns, rows }]));
    }),

    importTemplate: asyncHandler(async (_req, res) => {
      const { columns, sample } = resource.importer;
      const sheet = { name: 'Template', columns: columns.map((key) => ({ header: key, key })), rows: sample };
      sendWorkbook(res, `${name}-template`, await buildWorkbook([sheet]));
    }),

    importFile: asyncHandler(async (req, res) => {
      if (!req.file) throw new ApiError(400, 'Please choose a .xlsx or .csv file');

      const importer = resource.importer;
      const rows = await parseSpreadsheet(req.file);
      const context = await importer.prepare?.();
      const result = { created: 0, failed: [] };

      for (const [index, row] of rows.entries()) {
        try {
          const data = importer.mapRow(row, context);
          await resource.beforeSave?.(data, { isNew: true, req });
          await Model.create({ ...data, createdBy: req.user.username, updatedBy: req.user.username });
          result.created += 1;
        } catch (error) {
          result.failed.push({ row: index + 2, error: error.message });
        }
      }
      logActivity(req, { action: 'bulk imported', resource: name, title: `${result.created} created, ${result.failed.length} failed` });
      res.json(result);
    }),

    /** Short-lived link that lets the website render a draft before it is published. */
    previewLink: asyncHandler(async (req, res) => {
      const doc = await findOrFail(req.params.id);
      const token = jwt.sign({ resource: name, id: doc.id }, env.jwtSecret, { expiresIn: PREVIEW_LIFETIME });
      res.json({ url: `${env.siteUrl}${PUBLIC_PATHS[name](doc)}?preview=${token}` });
    }),
  };
}

import { Airline } from '../models/Airline.js';
import { Blog } from '../models/Blog.js';
import { Destination } from '../models/Destination.js';
import { Enquiry } from '../models/Enquiry.js';
import { Guide } from '../models/Guide.js';
import { Offer } from '../models/Offer.js';
import { Page } from '../models/Page.js';
import { PageEvent } from '../models/PageEvent.js';
import { Route } from '../models/Route.js';
import { Subscriber } from '../models/Subscriber.js';
import { RESOURCES } from '../resources/registry.js';
import { buildWorkbook, sendWorkbook } from '../services/importExportService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// ------------------------------- dashboard -------------------------------
const RECENT_SOURCES = [
  { resource: 'routes', Model: Route, label: 'name' },
  { resource: 'destinations', Model: Destination, label: 'name' },
  { resource: 'airlines', Model: Airline, label: 'name' },
  { resource: 'offers', Model: Offer, label: 'title' },
  { resource: 'blogs', Model: Blog, label: 'title' },
  { resource: 'guides', Model: Guide, label: 'title' },
  { resource: 'pages', Model: Page, label: 'title' },
];
const RECENT_LIMIT = 8;

async function recentItems(sortField) {
  const groups = await Promise.all(
    RECENT_SOURCES.map(async ({ resource, Model, label }) => {
      const docs = await Model.find().sort({ [sortField]: -1 }).limit(RECENT_LIMIT);
      return docs.map((doc) => ({
        resource, id: doc.id, title: doc[label] || doc.key, kind: doc.type ?? doc.key,
        createdAt: doc.createdAt, updatedAt: doc.updatedAt, updatedBy: doc.updatedBy,
      }));
    }),
  );
  return groups.flat().sort((a, b) => b[sortField] - a[sortField]).slice(0, RECENT_LIMIT);
}

export const getDashboard = asyncHandler(async (_req, res) => {
  const [routes, airlines, offers, blogs, enquiries, subscribers, recentlyAdded, recentlyEdited, latestEnquiries, latestSubscribers] =
    await Promise.all([
      Route.countDocuments(), Airline.countDocuments(), Offer.countDocuments(), Blog.countDocuments(),
      Enquiry.countDocuments(), Subscriber.countDocuments({ status: 'active' }),
      recentItems('createdAt'), recentItems('updatedAt'),
      Enquiry.find().sort({ createdAt: -1 }).limit(5),
      Subscriber.find().sort({ createdAt: -1 }).limit(5),
    ]);

  res.json({
    counts: { routes, airlines, offers, blogs, enquiries, subscribers },
    recentlyAdded, recentlyEdited,
    latestEnquiries: latestEnquiries.map((doc) => doc.toJSON()),
    latestSubscribers: latestSubscribers.map((doc) => doc.toJSON()),
  });
});

// -------------------------------- reports --------------------------------
const DAY_MS = 86_400_000;
const UNITS = { daily: 'day', weekly: 'week', monthly: 'month' };

async function buildReport(query) {
  const from = query.from ? new Date(query.from) : new Date(Date.now() - 30 * DAY_MS);
  const to = query.to ? new Date(`${query.to}T23:59:59.999Z`) : new Date();
  const unit = UNITS[query.granularity] ?? 'day';
  const inRange = { createdAt: { $gte: from, $lte: to } };

  const topBy = (match) =>
    PageEvent.aggregate([
      { $match: { ...inRange, ...match } },
      { $group: { _id: '$label', count: { $sum: 1 } } },
      { $sort: { count: -1 } }, { $limit: 10 },
      { $project: { _id: 0, label: '$_id', count: 1 } },
    ]);

  const [visits, topRoutes, topBanners, topOffers, enquiries, subscribers] = await Promise.all([
    PageEvent.aggregate([
      { $match: { ...inRange, type: 'view' } },
      { $group: { _id: { $dateTrunc: { date: '$createdAt', unit } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, period: { $dateToString: { format: '%Y-%m-%d', date: '$_id' } }, count: 1 } },
    ]),
    topBy({ type: 'view', refType: 'route' }),
    topBy({ type: 'click', refType: 'banner' }),
    topBy({ type: 'click', refType: 'offer' }),
    Enquiry.countDocuments(inRange),
    Subscriber.countDocuments(inRange),
  ]);

  const totalVisits = visits.reduce((sum, row) => sum + row.count, 0);
  return { from, to, granularity: unit, totalVisits, visits, topRoutes, topBanners, topOffers, enquiries, subscribers };
}

export const getReport = asyncHandler(async (req, res) => res.json(await buildReport(req.query)));

export const exportReport = asyncHandler(async (req, res) => {
  const report = await buildReport(req.query);
  const labelColumns = [{ header: 'Name', key: 'label' }, { header: 'Count', key: 'count' }];

  const buffer = await buildWorkbook([
    {
      name: 'Summary',
      columns: [{ header: 'Metric', key: 'metric' }, { header: 'Value', key: 'value' }],
      rows: [
        { metric: 'Total page visits', value: report.totalVisits },
        { metric: 'Enquiries', value: report.enquiries },
        { metric: 'Newsletter subscribers', value: report.subscribers },
      ],
    },
    { name: 'Visits', columns: [{ header: 'Period', key: 'period' }, { header: 'Visits', key: 'count' }], rows: report.visits },
    { name: 'Top routes', columns: labelColumns, rows: report.topRoutes },
    { name: 'Top banners', columns: labelColumns, rows: report.topBanners },
    { name: 'Top offers', columns: labelColumns, rows: report.topOffers },
  ]);
  sendWorkbook(res, 'report', buffer);
});

// ---------------------------- duplicate content ---------------------------
const DUPLICATE_FIELDS = ['seo.metaTitle', 'seo.metaDescription'];

/** Finds pages that share the same meta title or description, which hurts search ranking. */
export const getDuplicates = asyncHandler(async (_req, res) => {
  const seoResources = [...RESOURCES, { name: 'pages', Model: Page, titleField: 'title' }].filter((resource) => resource.Model.schema.path('seo.metaTitle'));
  const found = [];

  for (const resource of seoResources) {
    for (const field of DUPLICATE_FIELDS) {
      const groups = await resource.Model.aggregate([
        { $match: { [field]: { $nin: [null, ''] } } },
        { $group: { _id: `$${field}`, count: { $sum: 1 }, items: { $push: { id: '$_id', title: { $ifNull: [`$${resource.titleField}`, '$key'] } } } } },
        { $match: { count: { $gt: 1 } } },
      ]);
      groups.forEach((group) =>
        found.push({ resource: resource.name, field: field.replace('seo.', ''), value: group._id, items: group.items }),
      );
    }
  }
  res.json(found);
});

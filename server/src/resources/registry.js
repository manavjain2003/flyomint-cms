import { env } from '../config/env.js';
import { PUBLIC_PATHS } from '../constants/paths.js';
import { ActivityLog } from '../models/ActivityLog.js';
import { AdminUser } from '../models/AdminUser.js';
import { Airline } from '../models/Airline.js';
import { Announcement } from '../models/Announcement.js';
import { Banner } from '../models/Banner.js';
import { Blog } from '../models/Blog.js';
import { City } from '../models/City.js';
import { Deal } from '../models/Deal.js';
import { Destination } from '../models/Destination.js';
import { Enquiry } from '../models/Enquiry.js';
import { Faq } from '../models/Faq.js';
import { Guide } from '../models/Guide.js';
import { Media } from '../models/Media.js';
import { Menu } from '../models/Menu.js';
import { Offer } from '../models/Offer.js';
import { Popup } from '../models/Popup.js';
import { Redirect } from '../models/Redirect.js';
import { Route } from '../models/Route.js';
import { Subscriber } from '../models/Subscriber.js';
import { Template } from '../models/Template.js';
import { Testimonial } from '../models/Testimonial.js';
import { TrustItem } from '../models/TrustItem.js';
import { resolveRouteFare } from '../services/fareService.js';
import { destroyImage } from '../services/cloudinaryService.js';
import { ROUTE_POPULATE, applyRouteDefaults, getRelatedRoutes, toDealCard, toRouteCards } from '../services/routeService.js';
import { hashPassword } from '../services/userService.js';
import { ApiError } from '../utils/ApiError.js';
import { activeOnly, all, liveWindowed, livePublishable, withinWindow } from '../utils/publicFilters.js';
import { cityImporter, routeImporter } from './importers.js';

const AIRLINE_BRIEF = { path: 'airlines', select: 'name slug code logo' };
const faqCards = (faqs) => faqs.map(({ question, answer }) => ({ question, answer }));
const globalFaqs = (placement) => Faq.find(all(activeOnly(), { showOn: placement })).sort({ order: 1 });

/**
 * Every editable collection, described once:
 *  - admin side:  search / filters / bulk import / export / hooks
 *  - public side: which documents are visible and how they are enriched (`public`)
 * Routes for both APIs are generated from this list.
 */
export const RESOURCES = [
  {
    name: 'cities', Model: City, titleField: 'name', sort: 'name',
    searchFields: ['name', 'code', 'country'], filterFields: ['type', 'isPopular', 'isActive'],
    importer: cityImporter,
    public: { mode: 'active', bySlug: false, sort: 'name', queryFilters: ['type', 'isPopular', 'country'], searchFields: ['name', 'code'] },
  },
  {
    name: 'airlines', Model: Airline, titleField: 'name', sort: 'name', duplicable: true,
    searchFields: ['name', 'code'], filterFields: ['type', 'isActive', 'isPopular'],
    public: {
      mode: 'active', sort: 'name', queryFilters: ['type', 'isPopular'], searchFields: ['name', 'code'],
      populate: [{ path: 'popularRoutes', populate: ROUTE_POPULATE }, { path: 'offers', select: 'title slug image couponCode validTill' }],
      async transform(doc) {
        const [popularRoutes, extraFaqs] = await Promise.all([toRouteCards(doc.popularRoutes), globalFaqs('airline')]);
        return { popularRoutes, faqs: [...faqCards(doc.toJSON().faqs ?? []), ...faqCards(extraFaqs)] };
      },
    },
  },
  {
    name: 'routes', Model: Route, titleField: 'name', duplicable: true, importer: routeImporter,
    searchFields: ['name'], filterFields: ['type', 'isActive', 'status', 'isFeatured'], populate: ROUTE_POPULATE,
    beforeSave: (data, { isNew }) => applyRouteDefaults(data, { isNew }),
    public: {
      mode: 'publishable', sort: 'name', queryFilters: ['type', 'isFeatured'], searchFields: ['name'],
      populate: [...ROUTE_POPULATE, AIRLINE_BRIEF],
      listMapper: (docs) => toRouteCards(docs),
      async transform(doc) {
        const [cheapestFare, related, extraFaqs, deals] = await Promise.all([
          resolveRouteFare(doc),
          getRelatedRoutes(doc),
          globalFaqs('route'),
          Deal.find(all(liveWindowed('startDate', 'endDate'), { showOn: 'route', route: doc.id }))
            .sort({ order: 1 }).populate({ path: 'route', populate: ROUTE_POPULATE }),
        ]);
        return {
          cheapestFare, ...related, deals: await Promise.all(deals.map(toDealCard)),
          faqs: [...faqCards(doc.toJSON().faqs ?? []), ...faqCards(extraFaqs)],
        };
      },
    },
  },
  {
    name: 'destinations', Model: Destination, titleField: 'name', duplicable: true,
    searchFields: ['name'], filterFields: ['kind', 'isActive', 'status', 'isPopular'],
    public: {
      mode: 'publishable', sort: 'name', queryFilters: ['kind', 'isPopular'], searchFields: ['name'],
      populate: [{ path: 'popularRoutes', populate: ROUTE_POPULATE }, AIRLINE_BRIEF, { path: 'cheapestFares.fromCity', select: 'name code' }],
      async transform(doc) {
        const popularRoutes = await toRouteCards(doc.popularRoutes);
        const derived = popularRoutes.filter((card) => card.fare !== null).map((card) => ({ fromCity: card.from, fare: card.fare }));
        return { popularRoutes, cheapestFares: doc.cheapestFares.length > 0 ? doc.toJSON().cheapestFares : derived };
      },
    },
  },
  {
    name: 'deals', Model: Deal, titleField: 'title', duplicable: true,
    searchFields: ['title'], filterFields: ['section', 'isActive'], populate: [{ path: 'route', select: 'name' }],
    public: {
      mode: 'windowed', window: ['startDate', 'endDate'], bySlug: false, sort: 'order', queryFilters: ['section', 'showOn'],
      populate: [{ path: 'route', populate: ROUTE_POPULATE }],
      listMapper: (docs) => Promise.all(docs.map(toDealCard)),
    },
  },
  {
    name: 'offers', Model: Offer, titleField: 'title', duplicable: true,
    searchFields: ['title', 'couponCode'], filterFields: ['offerType', 'isActive', 'status'],
    public: {
      mode: 'publishable', queryFilters: ['offerType'], searchFields: ['title'],
      extraFilter: () => withinWindow('validFrom', 'validTill'), // hidden automatically after the end date
    },
  },
  {
    name: 'banners', Model: Banner, titleField: 'title', duplicable: true,
    searchFields: ['title'], filterFields: ['position', 'isActive'],
    public: { mode: 'windowed', window: ['startDate', 'endDate'], bySlug: false, sort: 'order', queryFilters: ['position'] },
  },
  {
    name: 'announcements', Model: Announcement, titleField: 'message', searchFields: ['message'], filterFields: ['isActive'],
    public: { mode: 'windowed', window: ['startDate', 'endDate'], bySlug: false },
  },
  {
    name: 'popups', Model: Popup, titleField: 'name', searchFields: ['name'], filterFields: ['kind', 'isActive'],
    public: { mode: 'active', bySlug: false, queryFilters: ['kind'] },
  },
  {
    name: 'trust-items', Model: TrustItem, titleField: 'title', searchFields: ['title'], filterFields: ['kind', 'isActive'],
    public: { mode: 'active', bySlug: false, sort: 'order', queryFilters: ['kind'] },
  },
  {
    name: 'blogs', Model: Blog, titleField: 'title', duplicable: true,
    searchFields: ['title', 'author', 'category'], filterFields: ['category', 'status'],
    public: {
      mode: 'publishable', listSelect: '-content', queryFilters: ['category', 'tags', 'author'], searchFields: ['title', 'excerpt'],
      sorts: { popular: '-views', latest: '-createdAt' },
      async transform(doc) {
        const live = livePublishable();
        const [related, popular] = await Promise.all([
          Blog.find(all(live, { _id: { $ne: doc.id }, category: doc.category })).sort({ createdAt: -1 }).limit(4).select('-content'),
          Blog.find(live).sort({ views: -1 }).limit(5).select('title slug image views'),
        ]);
        const url = encodeURIComponent(`${env.siteUrl}${PUBLIC_PATHS.blogs(doc)}`);
        const text = encodeURIComponent(doc.title);
        return {
          relatedBlogs: related.map((blog) => blog.toJSON()),
          popularBlogs: popular.map((blog) => blog.toJSON()),
          shareLinks: {
            whatsapp: `https://wa.me/?text=${text}%20${url}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
            twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
          },
        };
      },
    },
  },
  {
    name: 'guides', Model: Guide, titleField: 'title', duplicable: true, sort: 'order',
    searchFields: ['title'], filterFields: ['status'],
    public: { mode: 'publishable', listSelect: '-content', sort: 'order', searchFields: ['title'] },
  },
  {
    name: 'faqs', Model: Faq, titleField: 'question', sort: 'order', duplicable: true,
    searchFields: ['question'], filterFields: ['category', 'isActive'],
    public: { mode: 'active', bySlug: false, sort: 'order', queryFilters: ['category', 'showOn'] },
  },
  {
    name: 'testimonials', Model: Testimonial, titleField: 'name', searchFields: ['name', 'city'], filterFields: ['isActive'],
    public: { mode: 'active', bySlug: false },
  },
  {
    name: 'menus', Model: Menu, titleField: 'name', noCreate: true, noDelete: true, sort: 'name',
    public: { mode: 'active', bySlug: false, sort: 'name' },
  },
  {
    name: 'templates', Model: Template, titleField: 'name', sort: 'key', noDelete: true,
    searchFields: ['name', 'key'], filterFields: ['channel', 'isActive'],
  },
  {
    name: 'subscribers', Model: Subscriber, titleField: 'email', noCreate: true, editableFields: ['status'],
    searchFields: ['email'], filterFields: ['status'],
    exportColumns: [{ header: 'Email', key: 'email' }, { header: 'Status', key: 'status' }, { header: 'Subscribed on', key: 'createdAt' }],
  },
  {
    name: 'enquiries', Model: Enquiry, titleField: 'name', noCreate: true, editableFields: ['status', 'notes'],
    searchFields: ['name', 'email', 'phone', 'subject'], filterFields: ['status'],
    exportColumns: [
      { header: 'Name', key: 'name' }, { header: 'Email', key: 'email' }, { header: 'Phone', key: 'phone' },
      { header: 'Subject', key: 'subject' }, { header: 'Message', key: 'message' },
      { header: 'Status', key: 'status' }, { header: 'Received on', key: 'createdAt' },
    ],
  },
  {
    name: 'media', Model: Media, titleField: 'name', searchFields: ['name', 'alt'], filterFields: ['folder'],
    beforeDelete: (doc) => destroyImage(doc.publicId),
  },
  {
    name: 'redirects', Model: Redirect, titleField: 'fromPath', searchFields: ['fromPath', 'toPath'], filterFields: ['isActive'],
    beforeSave(data) {
      [data.fromPath, data.toPath].forEach((path) => {
        if (path && !path.startsWith('/') && !/^https?:\/\//.test(path)) throw new ApiError(400, 'Paths must start with /');
      });
    },
  },
  {
    name: 'users', Model: AdminUser, titleField: 'username', adminOnly: true,
    hiddenFields: ['passwordHash', 'resetTokenHash', 'resetTokenExpires'],
    searchFields: ['name', 'username', 'email'], filterFields: ['role', 'isBlocked'],
    async beforeSave(data, { isNew, req, id }) {
      if (data.password) data.passwordHash = await hashPassword(data.password);
      else if (isNew) throw new ApiError(400, 'Password is required for a new user');
      delete data.password;

      const editingSelf = !isNew && id === req.user.id;
      if (editingSelf && (data.isBlocked || (data.role && data.role !== 'admin'))) {
        throw new ApiError(400, 'You cannot block yourself or remove your own admin role');
      }
    },
    beforeDelete(doc, req) {
      if (doc.id === req.user.id) throw new ApiError(400, 'You cannot delete your own account');
    },
  },
  {
    name: 'activity-logs', Model: ActivityLog, titleField: 'title', adminOnly: true, readOnly: true,
    searchFields: ['user', 'title', 'resource'], filterFields: ['user', 'action', 'resource'],
  },
];

export const RESOURCE_MAP = Object.fromEntries(RESOURCES.map((resource) => [resource.name, resource]));
export const PUBLIC_RESOURCES = RESOURCES.filter((resource) => resource.public);

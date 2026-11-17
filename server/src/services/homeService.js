import { Airline } from '../models/Airline.js';
import { Banner } from '../models/Banner.js';
import { Blog } from '../models/Blog.js';
import { Deal } from '../models/Deal.js';
import { Destination } from '../models/Destination.js';
import { Faq } from '../models/Faq.js';
import { Offer } from '../models/Offer.js';
import { Route } from '../models/Route.js';
import { Testimonial } from '../models/Testimonial.js';
import { all, activeOnly, liveWindowed, livePublishable, withinWindow } from '../utils/publicFilters.js';
import { ROUTE_POPULATE, toDealCard, toRouteCards } from './routeService.js';
import { buildSeo } from './seoService.js';
import { getConfig } from './siteConfigService.js';
import { getTrustGroups, resolveSearchBox } from './siteBundleService.js';

const featuredRoutes = (type, limit) =>
  Route.find(all(livePublishable(), { type, isFeatured: true })).limit(limit).populate(ROUTE_POPULATE).then(toRouteCards);

/** Loads the data behind each home page section. */
const sectionLoaders = {
  banners: () => Banner.find(all(liveWindowed('startDate', 'endDate'), { position: 'home' })).sort({ order: 1 }),
  searchBox: async () => resolveSearchBox(await getConfig('searchBox')),
  domesticRoutes: (section) => featuredRoutes('domestic', section.limit),
  internationalRoutes: (section) => featuredRoutes('international', section.limit),
  cheapestDeals: async (section) => {
    const deals = await Deal.find(all(liveWindowed('startDate', 'endDate'), { showOn: 'home' }))
      .sort({ order: 1 }).limit(section.limit)
      .populate({ path: 'route', populate: ROUTE_POPULATE });
    return Promise.all(deals.map(toDealCard));
  },
  offers: (section) => Offer.find(all(livePublishable(), withinWindow('validFrom', 'validTill'))).sort({ createdAt: -1 }).limit(section.limit),
  airlines: (section) => Airline.find(all(activeOnly(), { isPopular: true })).limit(section.limit),
  destinations: (section) => Destination.find(all(livePublishable(), { isPopular: true })).limit(section.limit),
  faqs: (section) => Faq.find(all(activeOnly(), { showOn: 'home' })).sort({ order: 1 }).limit(section.limit),
  trustBadges: getTrustGroups,
  testimonials: (section) => Testimonial.find(activeOnly()).sort({ createdAt: -1 }).limit(section.limit),
  blogs: (section) => Blog.find(livePublishable()).sort({ createdAt: -1 }).limit(section.limit),
  mobileApp: () => getConfig('mobileApp'),
};

const toJson = (data) => (Array.isArray(data) ? data.map(toJson) : data?.toJSON?.() ?? data);

export async function buildHomePage() {
  const config = await getConfig('home');

  const sections = await Promise.all(
    config.sections.filter((section) => section.enabled).map(async (section) => {
      const load = sectionLoaders[section.key];
      const data = section.key === 'whyChooseUs' ? config.whyChooseUs : load ? await load(section) : null;
      return { ...section, data: toJson(data) };
    }),
  );

  return { sections, seo: buildSeo('home', { ...config, title: config.seo?.metaTitle || 'Home' }) };
}

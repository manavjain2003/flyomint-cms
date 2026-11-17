import { SITE_CONFIG } from '../constants/siteConfig.js';
import { PUBLIC_PATHS } from '../constants/paths.js';
import { Airline } from '../models/Airline.js';
import { Announcement } from '../models/Announcement.js';
import { City } from '../models/City.js';
import { Destination } from '../models/Destination.js';
import { Menu } from '../models/Menu.js';
import { Popup } from '../models/Popup.js';
import { Route } from '../models/Route.js';
import { TrustItem } from '../models/TrustItem.js';
import { activeOnly, all, liveWindowed, livePublishable } from '../utils/publicFilters.js';
import { omit } from '../utils/object.js';
import { ROUTE_POPULATE, toRouteCard } from './routeService.js';
import { getConfig } from './siteConfigService.js';

const link = (label, url) => ({ label, url });
const sortByOrder = { order: 1, createdAt: 1 };

export async function getTrustGroups() {
  const items = await TrustItem.find(activeOnly()).sort(sortByOrder);
  const group = (...kinds) => items.filter((item) => kinds.includes(item.kind)).map((item) => item.toJSON());
  return {
    badges: group('badge'),
    airlinePartners: group('airline-partner'),
    paymentPartners: group('payment-partner'),
    certificates: group('certificate'),
    counters: group('counter'),
  };
}

async function popularRouteLinks(type, limit) {
  const routes = await Route.find(all(livePublishable(), { type, isFeatured: true })).limit(limit).populate(ROUTE_POPULATE);
  return routes.map((route) => link(route.name, toRouteCard(route).path));
}

/** Footer config plus the automatic "popular" link lists. */
async function resolveFooter(config) {
  const [domestic, international, airlines, destinations, trust] = await Promise.all([
    popularRouteLinks('domestic', config.popularDomesticCount),
    popularRouteLinks('international', config.popularInternationalCount),
    Airline.find(all(activeOnly(), { isPopular: true })).limit(config.popularAirlinesCount),
    Destination.find(all(livePublishable(), { isPopular: true })).limit(config.popularDestinationsCount),
    getTrustGroups(),
  ]);

  return {
    ...config,
    popularDomesticRoutes: domestic,
    popularInternationalRoutes: international,
    popularAirlines: airlines.map((a) => link(a.name, PUBLIC_PATHS.airlines(a))),
    popularDestinations: destinations.map((d) => link(d.name, PUBLIC_PATHS.destinations(d))),
    paymentPartners: config.showPaymentLogos ? trust.paymentPartners : [],
    certificates: config.showCertificates ? trust.certificates : [],
  };
}

export async function resolveSearchBox(config) {
  const ids = [config.defaultFrom, config.defaultTo, ...(config.popularCities ?? [])].filter(Boolean);
  const cities = await City.find({ _id: { $in: ids } }).select('name code country image');
  const byId = new Map(cities.map((city) => [city.id, city.toJSON()]));
  return {
    ...config,
    defaultFrom: byId.get(String(config.defaultFrom)) ?? null,
    defaultTo: byId.get(String(config.defaultTo)) ?? null,
    popularCities: (config.popularCities ?? []).map((id) => byId.get(String(id))).filter(Boolean),
  };
}

/** Site-wide data every page of the website needs (header, footer, menus, theme, popups...). */
export async function getSiteBundle() {
  const [header, theme, settings, whatsapp, mobileApp, searchBox, cookie, seoSettings, footer, menus, bars, popups] =
    await Promise.all([
      getConfig('header'), getConfig('theme'), getConfig('settings'), getConfig('whatsapp'), getConfig('mobileApp'),
      getConfig('searchBox'), getConfig('announcementSettings'), getConfig('seoSettings'), getConfig('footer'),
      Menu.find(),
      Announcement.find(liveWindowed('startDate', 'endDate')).sort({ createdAt: -1 }).limit(1),
      Popup.find(activeOnly()),
    ]);

  const menuByName = Object.fromEntries(menus.map((menu) => [menu.name, menu.items]));

  return {
    header, theme, whatsapp, mobileApp, cookieConsent: cookie,
    settings: omit(settings, SITE_CONFIG.settings.privateFields),
    searchBox: await resolveSearchBox(searchBox),
    footer: await resolveFooter(footer),
    menus: { main: menuByName.main ?? [], footer: menuByName.footer ?? [] },
    announcementBar: bars[0]?.toJSON() ?? null,
    popups: popups.map((popup) => popup.toJSON()),
    seo: omit(seoSettings, ['robotsTxt']),
  };
}

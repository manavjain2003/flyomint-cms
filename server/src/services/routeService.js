import { PUBLIC_PATHS } from '../constants/paths.js';
import { City } from '../models/City.js';
import { Route } from '../models/Route.js';
import { ApiError } from '../utils/ApiError.js';
import { all, livePublishable } from '../utils/publicFilters.js';
import { slugify } from '../utils/slugify.js';
import { resolveRouteFare } from './fareService.js';

export const ROUTE_POPULATE = [
  { path: 'fromCity', select: 'name code country' },
  { path: 'toCity', select: 'name code country' },
];

/**
 * Creates the default content of a route page, so a route is live as soon as two cities are chosen.
 * The admin can edit every generated value afterwards.
 */
export async function applyRouteDefaults(data, { isNew }) {
  if (!isNew && (!data.fromCity || !data.toCity)) return;

  const [from, to] = await Promise.all([City.findById(data.fromCity), City.findById(data.toCity)]);
  if (!from || !to) throw new ApiError(400, 'Please select valid From and To cities');
  if (from.id === to.id) throw new ApiError(400, 'From and To city cannot be same');

  data.name ||= `${from.name} to ${to.name} Flights`;
  data.heading ||= `${from.name} to ${to.name} Flights`;
  data.slug ||= slugify(data.name);
  data.description ||=
    `<p>Book ${from.name} (${from.code}) to ${to.name} (${to.code}) flights at the best fares. ` +
    'Compare airlines, check timings and book in minutes.</p>';
}

export function toRouteCard(route, fare = route.manualFare ?? null) {
  return {
    id: route.id,
    name: route.name,
    slug: route.slug,
    type: route.type,
    path: PUBLIC_PATHS.routes(route),
    from: { name: route.fromCity?.name, code: route.fromCity?.code },
    to: { name: route.toCity?.name, code: route.toCity?.code },
    fare,
  };
}

export const toRouteCards = (routes) =>
  Promise.all(routes.map(async (route) => toRouteCard(route, await resolveRouteFare(route))));

export function toDealCard(deal) {
  return deal.route
    ? resolveRouteFare(deal.route).then((routeFare) => ({
        id: deal.id,
        section: deal.section,
        title: deal.title,
        link: deal.link || PUBLIC_PATHS.routes(deal.route),
        fare: deal.fareMode === 'auto' ? routeFare : deal.manualFare ?? routeFare,
        route: toRouteCard(deal.route, routeFare),
      }))
    : Promise.resolve({
        id: deal.id, section: deal.section, title: deal.title, link: deal.link, fare: deal.manualFare ?? null, route: null,
      });
}

/** Reverse route, routes to the same destination, and featured routes from the same city. */
export async function getRelatedRoutes(route) {
  const live = (extra) => all(livePublishable(), { _id: { $ne: route.id }, type: route.type }, extra);
  const query = (filter) => Route.find(filter).limit(6).populate(ROUTE_POPULATE);

  const [reverse, sameDestination, sameOrigin] = await Promise.all([
    query(live({ fromCity: route.toCity?.id, toCity: route.fromCity?.id })),
    query(live({ toCity: route.toCity?.id })),
    query(live({ fromCity: route.fromCity?.id, isFeatured: true })),
  ]);

  return {
    relatedRoutes: await toRouteCards(reverse),
    nearbyRoutes: await toRouteCards(sameDestination),
    popularFromCity: await toRouteCards(sameOrigin),
  };
}

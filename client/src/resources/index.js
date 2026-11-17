import { activityLogs, enquiries, redirects, subscribers, templates, users } from './system.js';
import { announcements, banners, offers, popups, trustItems } from './marketing.js';
import { blogs, faqs, guides, menus, testimonials } from './content.js';
import { staticPages, specialFarePages } from './pages.js';
import * as settingsGroups from './settings.js';
import { airlines, cities, deals, destinations, domesticRoutes, internationalRoutes } from './travel.js';

/** Every CMS screen, in one list. Routes are generated from it. */
export const RESOURCES = [
  domesticRoutes, internationalRoutes, destinations, airlines, cities, deals,
  offers, banners, announcements, popups, trustItems,
  blogs, guides, faqs, testimonials, menus,
  enquiries, subscribers, templates, redirects, users, activityLogs,
  ...staticPages, ...specialFarePages,
  ...Object.values(settingsGroups),
];


export const PAGES = Object.freeze({
  about: { title: 'About us', path: '/about-us', kind: 'static' },
  privacy: { title: 'Privacy policy', path: '/privacy-policy', kind: 'static' },
  terms: { title: 'Terms and conditions', path: '/terms-and-conditions', kind: 'static' },
  disclaimer: { title: 'Disclaimer', path: '/disclaimer', kind: 'static' },
  'payment-refund': { title: 'Payment and refund policy', path: '/payment-and-refund-policy', kind: 'static' },
  'student-fare': { title: 'Student fare', path: '/student-fare', kind: 'special-fare' },
  'senior-citizen-fare': { title: 'Senior citizen fare', path: '/senior-citizen-fare', kind: 'special-fare' },
  'armed-forces-fare': { title: 'Armed forces fare', path: '/armed-forces-fare', kind: 'special-fare' },
  'doctors-nurses-fare': { title: 'Doctors and nurses fare', path: '/doctors-and-nurses-fare', kind: 'special-fare' },
});
export const PAGE_KEYS = Object.freeze(Object.keys(PAGES));

export const PUBLIC_PATHS = Object.freeze({
  routes: (doc) => `${doc.type === 'international' ? '/international-flights' : '/domestic-flights'}/${doc.slug}`,
  destinations: (doc) => `/destinations/${doc.slug}`,
  airlines: (doc) => `/airlines/${doc.slug}`,
  offers: (doc) => `/offers/${doc.slug}`,
  blogs: (doc) => `/blog/${doc.slug}`,
  guides: (doc) => `/guides/${doc.slug}`,
  pages: (doc) => doc.urlPath || PAGES[doc.key].path,
  helpCenter: (doc) => doc?.urlPath || '/help-center',
  contactPage: (doc) => doc?.urlPath || '/contact-us',
  home: () => '/',
});

/** Parent listing page shown in breadcrumbs. */
export const SECTION_CRUMBS = Object.freeze({
  routes: (doc) => (doc.type === 'international'
    ? { name: 'International Flights', url: '/international-flights' }
    : { name: 'Domestic Flights', url: '/domestic-flights' }),
  destinations: () => ({ name: 'Destinations', url: '/destinations' }),
  airlines: () => ({ name: 'Airlines', url: '/airlines' }),
  offers: () => ({ name: 'Offers', url: '/offers' }),
  blogs: () => ({ name: 'Blog', url: '/blog' }),
  guides: () => ({ name: 'Travel Guides', url: '/guides' }),
});

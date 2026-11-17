import { FAQS_FIELD } from './shared.js';

const page = (key, title, path, fields, description) => ({
  key: `page-${key}`, kind: 'page', api: key, path, title, description, publish: true, seo: true, fields,
});

const TITLE_FIELDS = [
  { name: 'urlPath', label: 'Page URL', type: 'text', help: 'Example: /about-us. Leave empty to use the default URL.' },
  { name: 'title', label: 'Page title', type: 'text' },
  { name: 'heading', label: 'Page heading (H1)', type: 'text' },
];

const staticPage = (key, title, path) =>
  page(key, title, path, [...TITLE_FIELDS, { name: 'content', label: 'Content', type: 'rich' }]);

const specialFarePage = (key, title, path) =>
  page(key, title, path, [
    ...TITLE_FIELDS,
    { name: 'banner', label: 'Page banner', type: 'image', folder: 'banners' },
    { name: 'content', label: 'Content', type: 'rich' },
    { name: 'eligibility', label: 'Eligibility', type: 'rich' },
    { name: 'requiredDocuments', label: 'Required documents', type: 'rich' },
    FAQS_FIELD,
  ]);

export const staticPages = [
  staticPage('about', 'About us', '/pages/about'),
  staticPage('privacy', 'Privacy policy', '/pages/privacy'),
  staticPage('terms', 'Terms and conditions', '/pages/terms'),
  staticPage('disclaimer', 'Disclaimer', '/pages/disclaimer'),
  staticPage('payment-refund', 'Payment and refund policy', '/pages/payment-refund'),
];

export const specialFarePages = [
  specialFarePage('student-fare', 'Student fare', '/special-fares/student-fare'),
  specialFarePage('senior-citizen-fare', 'Senior citizen fare', '/special-fares/senior-citizen-fare'),
  specialFarePage('armed-forces-fare', 'Armed forces fare', '/special-fares/armed-forces-fare'),
  specialFarePage('doctors-nurses-fare', 'Doctors and nurses fare', '/special-fares/doctors-nurses-fare'),
];

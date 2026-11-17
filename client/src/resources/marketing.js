import { ACTIVE_COLUMN, ACTIVE_FIELD, ACTIVE_FILTER, STATUS_COLUMN, STATUS_FILTER } from './shared.js';

const OFFER_TYPES = [{ value: 'flight', label: 'Flight offer' }, { value: 'bank', label: 'Bank offer' }, { value: 'airline', label: 'Airline offer' }, { value: 'festival', label: 'Festival offer' }];

export const offers = {
  key: 'offers', kind: 'collection', api: 'offers', path: '/offers',
  title: 'Flight offers', itemName: 'offer', slugSource: 'title',
  description: 'Offers are hidden on the website automatically after the "valid till" date.',
  defaultValues: { isActive: true, offerType: 'flight' }, publish: true, seo: true, duplicable: true,
  filters: [{ name: 'offerType', label: 'Type', options: OFFER_TYPES }, ACTIVE_FILTER, STATUS_FILTER],
  columns: [{ key: 'image', label: 'Image', type: 'image' }, { key: 'title', label: 'Title' }, { key: 'offerType', label: 'Type', type: 'badge' }, { key: 'couponCode', label: 'Coupon' }, { key: 'validTill', label: 'Valid till', type: 'date' }, ACTIVE_COLUMN, STATUS_COLUMN],
  fields: [
    { name: 'title', label: 'Offer title', type: 'text', required: true },
    { name: 'slug', label: 'Page URL slug', type: 'slug', required: true },
    { name: 'image', label: 'Offer image', type: 'image', folder: 'offers' },
    { name: 'description', label: 'Description', type: 'rich' },
    { name: 'offerType', label: 'Offer type', type: 'select', options: OFFER_TYPES },
    { name: 'couponCode', label: 'Coupon code', type: 'text' },
    { name: 'discount', label: 'Discount details', type: 'text' },
    { name: 'minBookingAmount', label: 'Minimum booking amount', type: 'number' },
    { name: 'terms', label: 'Terms and conditions', type: 'rich' },
    { name: 'validFrom', label: 'Valid from', type: 'date' },
    { name: 'validTill', label: 'Valid till', type: 'date' },
    ACTIVE_FIELD,
  ],
};

export const banners = {
  key: 'banners', kind: 'collection', api: 'banners', path: '/banners',
  title: 'Banners', itemName: 'banner', defaultValues: { isActive: true, position: 'home', order: 0 }, duplicable: true,
  filters: [{ name: 'position', label: 'Position', options: ['home', 'domestic', 'international', 'offers'] }, ACTIVE_FILTER],
  columns: [{ key: 'desktopImage', label: 'Image', type: 'image' }, { key: 'title', label: 'Title' }, { key: 'position', label: 'Position', type: 'badge' }, { key: 'order', label: 'Order' }, { key: 'startDate', label: 'Starts', type: 'date' }, { key: 'endDate', label: 'Ends', type: 'date' }, ACTIVE_COLUMN],
  fields: [
    { name: 'title', label: 'Banner title', type: 'text', required: true },
    { name: 'text', label: 'Short text', type: 'textarea' },
    { name: 'buttonLabel', label: 'Button text', type: 'text' },
    { name: 'buttonLink', label: 'Button link', type: 'text' },
    { name: 'desktopImage', label: 'Desktop image', type: 'image', folder: 'banners' },
    { name: 'mobileImage', label: 'Mobile image', type: 'image', folder: 'banners' },
    { name: 'position', label: 'Banner position', type: 'select', options: [{ value: 'home', label: 'Home' }, { value: 'domestic', label: 'Domestic flights' }, { value: 'international', label: 'International flights' }, { value: 'offers', label: 'Offers page' }] },
    { name: 'order', label: 'Display order', type: 'number' },
    { name: 'startDate', label: 'Start date', type: 'date' },
    { name: 'endDate', label: 'End date', type: 'date' },
    ACTIVE_FIELD,
  ],
};

export const announcements = {
  key: 'announcements', kind: 'collection', api: 'announcements', path: '/announcements',
  title: 'Announcement bar', itemName: 'announcement', defaultValues: { isActive: true },
  description: 'The message shown in the bar at the top of the website, for example "Festive sale live now".',
  columns: [{ key: 'message', label: 'Message' }, { key: 'startDate', label: 'Starts', type: 'date' }, { key: 'endDate', label: 'Ends', type: 'date' }, ACTIVE_COLUMN],
  fields: [
    { name: 'message', label: 'Message', type: 'text', required: true },
    { name: 'link', label: 'Link', type: 'text' },
    { name: 'startDate', label: 'Start date', type: 'date' },
    { name: 'endDate', label: 'End date', type: 'date' },
    ACTIVE_FIELD,
  ],
};

export const popups = {
  key: 'popups', kind: 'collection', api: 'popups', path: '/popups',
  title: 'Popups', itemName: 'popup', defaultValues: { isActive: true, kind: 'offer', trigger: 'after-delay', delaySeconds: 5, oncePerVisitor: true, showOnMobile: true },
  columns: [{ key: 'name', label: 'Popup' }, { key: 'kind', label: 'Type', type: 'badge' }, { key: 'trigger', label: 'Shown', type: 'badge' }, ACTIVE_COLUMN],
  fields: [
    { name: 'name', label: 'Internal name', type: 'text', required: true },
    { name: 'kind', label: 'Popup type', type: 'select', options: [{ value: 'offer', label: 'Offer popup' }, { value: 'newsletter', label: 'Newsletter / lead capture popup' }] },
    { name: 'title', label: 'Title', type: 'text' },
    { name: 'text', label: 'Text', type: 'textarea' },
    { name: 'image', label: 'Image', type: 'image', folder: 'offers' },
    { name: 'buttonLabel', label: 'Button text', type: 'text' },
    { name: 'buttonLink', label: 'Button link', type: 'text' },
    { name: 'trigger', label: 'Show the popup', type: 'select', options: [{ value: 'on-load', label: 'On page load' }, { value: 'after-delay', label: 'After some seconds' }, { value: 'on-exit', label: 'On exit intent' }] },
    { name: 'delaySeconds', label: 'Seconds to wait', type: 'number' },
    { name: 'oncePerVisitor', label: 'Show only once per visitor', type: 'checkbox' },
    { name: 'showOnMobile', label: 'Show on mobile', type: 'checkbox' },
    ACTIVE_FIELD,
  ],
};

export const trustItems = {
  key: 'trust-items', kind: 'collection', api: 'trust-items', path: '/trust-items',
  title: 'Trust badges and partner logos', itemName: 'item', defaultValues: { isActive: true, kind: 'badge', order: 0 },
  filters: [{ name: 'kind', label: 'Type', options: ['badge', 'airline-partner', 'payment-partner', 'certificate', 'counter'] }, ACTIVE_FILTER],
  columns: [{ key: 'image', label: 'Logo', type: 'image' }, { key: 'title', label: 'Title' }, { key: 'kind', label: 'Type', type: 'badge' }, { key: 'value', label: 'Counter value' }, { key: 'order', label: 'Order' }, ACTIVE_COLUMN],
  fields: [
    { name: 'kind', label: 'Type', type: 'select', options: [{ value: 'badge', label: 'Trust badge (IATA, SSL secure, Google rating, 24x7 support)' }, { value: 'airline-partner', label: 'Airline partner logo (home page)' }, { value: 'payment-partner', label: 'Payment partner logo (footer)' }, { value: 'certificate', label: 'IATA / certificate logo (footer)' }, { value: 'counter', label: 'Number counter (happy customers, routes, airlines)' }] },
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'image', label: 'Logo or icon', type: 'image', folder: 'general' },
    { name: 'value', label: 'Counter value (for counters), e.g. 10,000+', type: 'text' },
    { name: 'link', label: 'Link (optional)', type: 'text' },
    { name: 'order', label: 'Display order', type: 'number' },
    ACTIVE_FIELD,
  ],
};

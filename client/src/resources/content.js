import { ACTIVE_COLUMN, ACTIVE_FIELD, ACTIVE_FILTER, STATUS_COLUMN, STATUS_FILTER } from './shared.js';

const FAQ_CATEGORIES = [{ value: 'booking', label: 'Booking' }, { value: 'payment', label: 'Payment' }, { value: 'cancellation', label: 'Cancellation' }, { value: 'baggage', label: 'Baggage' }, { value: 'other', label: 'Other' }];

export const blogs = {
  key: 'blogs', kind: 'collection', api: 'blogs', path: '/blogs',
  title: 'Blogs', itemName: 'blog post', slugSource: 'title', publish: true, seo: true, duplicable: true,
  description: 'Related blogs, popular blogs and share buttons are added to each post automatically.',
  filters: [STATUS_FILTER],
  columns: [{ key: 'image', label: 'Image', type: 'image' }, { key: 'title', label: 'Title' }, { key: 'category', label: 'Category' }, { key: 'author', label: 'Author' }, { key: 'publishAt', label: 'Publish date', type: 'date' }, STATUS_COLUMN],
  fields: [
    { name: 'title', label: 'Blog title', type: 'text', required: true },
    { name: 'slug', label: 'Page URL slug', type: 'slug', required: true },
    { name: 'image', label: 'Blog image', type: 'image', folder: 'blogs' },
    { name: 'excerpt', label: 'Short summary', type: 'textarea' },
    { name: 'content', label: 'Content', type: 'rich' },
    { name: 'category', label: 'Category', type: 'text' },
    { name: 'tags', label: 'Tags', type: 'tags' },
    { name: 'author', label: 'Author name', type: 'text' },
  ],
};

export const guides = {
  key: 'guides', kind: 'collection', api: 'guides', path: '/guides',
  title: 'Travel guides and help pages', itemName: 'guide', slugSource: 'title', publish: true, seo: true, duplicable: true,
  description: 'How to book a flight, baggage, web check-in, refunds, rescheduling and travel documents. Add new guide pages when needed.',
  filters: [STATUS_FILTER],
  columns: [{ key: 'title', label: 'Guide' }, { key: 'slug', label: 'URL slug' }, { key: 'order', label: 'Order' }, STATUS_COLUMN],
  fields: [
    { name: 'title', label: 'Guide title', type: 'text', required: true },
    { name: 'slug', label: 'Page URL slug', type: 'slug', required: true },
    { name: 'order', label: 'Display order', type: 'number' },
    { name: 'content', label: 'Content', type: 'rich' },
  ],
};

export const faqs = {
  key: 'faqs', kind: 'collection', api: 'faqs', path: '/faqs',
  title: 'FAQs', itemName: 'FAQ', defaultValues: { isActive: true, category: 'booking', order: 0, showOn: ['help'] }, duplicable: true,
  filters: [{ name: 'category', label: 'Category', options: FAQ_CATEGORIES }, ACTIVE_FILTER],
  columns: [{ key: 'question', label: 'Question' }, { key: 'category', label: 'Category', type: 'badge' }, { key: 'order', label: 'Order' }, ACTIVE_COLUMN],
  fields: [
    { name: 'category', label: 'Category', type: 'select', options: FAQ_CATEGORIES },
    { name: 'question', label: 'Question', type: 'text', required: true },
    { name: 'answer', label: 'Answer', type: 'rich', required: true },
    { name: 'showOn', label: 'Show the FAQ on', type: 'checkboxGroup', options: [{ value: 'home', label: 'Home' }, { value: 'route', label: 'Route pages' }, { value: 'airline', label: 'Airline pages' }, { value: 'help', label: 'Help center' }] },
    { name: 'order', label: 'Display order', type: 'number' },
    ACTIVE_FIELD,
  ],
};

export const testimonials = {
  key: 'testimonials', kind: 'collection', api: 'testimonials', path: '/testimonials',
  title: 'Testimonials', itemName: 'review', defaultValues: { isActive: true, rating: 5 },
  columns: [{ key: 'photo', label: 'Photo', type: 'image' }, { key: 'name', label: 'Customer' }, { key: 'city', label: 'City' }, { key: 'rating', label: 'Rating' }, ACTIVE_COLUMN],
  fields: [
    { name: 'name', label: 'Customer name', type: 'text', required: true },
    { name: 'city', label: 'City', type: 'text' },
    { name: 'rating', label: 'Rating (1 to 5)', type: 'number', min: 1, max: 5 },
    { name: 'review', label: 'Review text', type: 'textarea', required: true },
    { name: 'photo', label: 'Customer photo (optional)', type: 'image', folder: 'general' },
    { name: 'isActive', label: 'Show the review on the website', type: 'checkbox' },
  ],
};

const MENU_ITEM_FIELDS = [
  { name: 'label', label: 'Label', type: 'text' },
  { name: 'url', label: 'Link', type: 'text' },
  { name: 'target', label: 'Open link in', type: 'select', options: [{ value: '_self', label: 'Same tab' }, { value: '_blank', label: 'New tab' }] },
  { name: 'isActive', label: 'Active', type: 'checkbox' },
];

export const menus = {
  key: 'menus', kind: 'collection', api: 'menus', path: '/menus',
  title: 'Menu management', itemName: 'menu', noCreate: true, noDelete: true,
  description: 'Edit the main menu and the footer menu. Sub menus are supported (for example Top Domestic Routes).',
  columns: [{ key: 'name', label: 'Menu', type: 'badge' }],
  fields: [
    { name: 'name', label: 'Menu', type: 'text', readOnly: true },
    {
      name: 'items', label: 'Menu items', type: 'repeater', itemName: 'menu item', itemLabel: 'label',
      fields: [
        ...MENU_ITEM_FIELDS,
        { name: 'children', label: 'Sub menu items', type: 'repeater', itemName: 'sub menu item', itemLabel: 'label', fields: MENU_ITEM_FIELDS },
      ],
    },
  ],
};

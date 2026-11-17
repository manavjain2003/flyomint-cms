/** Building blocks reused by many resource definitions. */
export const YES_NO = [{ value: 'true', label: 'Yes' }, { value: 'false', label: 'No' }];

export const ACTIVE_FIELD = { name: 'isActive', label: 'Active (visible on the website)', type: 'checkbox' };
export const ACTIVE_FILTER = { name: 'isActive', label: 'Active', options: [{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }] };
export const STATUS_FILTER = { name: 'status', label: 'Status', options: ['draft', 'published', 'unpublished', 'scheduled'] };
export const ACTIVE_COLUMN = { key: 'isActive', label: 'Active', type: 'boolean' };
export const STATUS_COLUMN = { key: 'status', label: 'Status', type: 'badge' };

export const LOCATION_TYPES = ['domestic', 'international'];
export const cityLabel = (city) => `${city.name} (${city.code})`;

export const FAQS_FIELD = {
  name: 'faqs', label: 'FAQs', type: 'repeater', itemName: 'FAQ', itemLabel: 'question',
  fields: [
    { name: 'question', label: 'Question', type: 'text' },
    { name: 'answer', label: 'Answer', type: 'textarea' },
  ],
};

export const FARE_MODE_FIELDS = [
  { name: 'fareMode', label: 'Fare shown', type: 'select', options: [{ value: 'auto', label: 'Automatically (live fare)' }, { value: 'manual', label: 'Manually entered' }] },
  { name: 'manualFare', label: 'Manual fare', type: 'number', help: 'Used when the fare is manual, or when no live fare is available.' },
];

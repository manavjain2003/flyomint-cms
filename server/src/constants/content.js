export const CONTENT_STATUS = Object.freeze({
  DRAFT: 'draft',
  PUBLISHED: 'published',
  UNPUBLISHED: 'unpublished',
  SCHEDULED: 'scheduled',
});

export const ROLES = Object.freeze({ ADMIN: 'admin', EDITOR: 'editor' });
export const ENQUIRY_STATUS = Object.freeze(['new', 'in-progress', 'closed']);
export const SUBSCRIBER_STATUS = Object.freeze(['pending', 'active', 'unsubscribed']);
export const LOCATION_TYPES = Object.freeze(['domestic', 'international']);
export const MEDIA_FOLDERS = Object.freeze(['banners', 'airlines', 'blogs', 'offers', 'general']);
export const FAQ_CATEGORIES = Object.freeze(['booking', 'payment', 'cancellation', 'baggage', 'other']);
export const FAQ_PLACEMENTS = Object.freeze(['home', 'route', 'airline', 'help']);
export const OFFER_TYPES = Object.freeze(['flight', 'bank', 'airline', 'festival']);
export const DEAL_SECTIONS = Object.freeze(['today', 'last-minute', 'weekend', 'city-cheapest', 'airline-wise']);
export const DEAL_PLACEMENTS = Object.freeze(['home', 'route', 'offers']);
export const BANNER_POSITIONS = Object.freeze(['home', 'domestic', 'international', 'offers']);
export const TRUST_KINDS = Object.freeze(['badge', 'airline-partner', 'payment-partner', 'certificate', 'counter']);
export const TEMPLATE_CHANNELS = Object.freeze(['email', 'sms']);

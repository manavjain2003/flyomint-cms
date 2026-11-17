import SeoLinksPanel from '../features/extras/SeoLinksPanel.jsx';
import SystemToolsPanel from '../features/extras/SystemToolsPanel.jsx';
import { cityLabel } from './shared.js';

const singleton = (key, title, path, config) => ({ key, kind: 'singleton', api: key, path, title, ...config });

const social = (prefix) => [
  { name: `${prefix}.facebook`, label: 'Facebook URL', type: 'url' },
  { name: `${prefix}.twitter`, label: 'Twitter / X URL', type: 'url' },
  { name: `${prefix}.instagram`, label: 'Instagram URL', type: 'url' },
  { name: `${prefix}.linkedin`, label: 'LinkedIn URL', type: 'url' },
  { name: `${prefix}.youtube`, label: 'YouTube URL', type: 'url' },
];

export const header = singleton('header', 'Header / top bar', '/header', {
  fields: [
    { name: 'logo', label: 'Website logo', type: 'image', folder: 'general' },
    { name: 'phone', label: 'Customer care phone number', type: 'text' },
    { name: 'email', label: 'Customer care email', type: 'email' },
    { name: 'showAuthButtons', label: 'Show Login / Sign up button', type: 'checkbox' },
    { name: 'showLanguageSelector', label: 'Show language selector', type: 'checkbox' },
    { name: 'showCurrencySelector', label: 'Show currency selector', type: 'checkbox' },
    { name: 'stickyHeader', label: 'Sticky (fixed) header', type: 'checkbox' },
    { name: 'showTopOfferStrip', label: 'Show top offer strip', type: 'checkbox' },
    { name: 'topOfferText', label: 'Top offer strip text', type: 'text' },
    { name: 'topOfferLink', label: 'Top offer strip link', type: 'text' },
  ],
});

export const home = singleton('home', 'Home page management', '/home-page', {
  seo: true,
  description: 'Show or hide each section, change its order with the arrows, and edit its heading and text.',
  fields: [
    {
      name: 'sections', label: 'Home page sections', type: 'repeater', fixed: true, itemLabel: 'label',
      fields: [
        { name: 'label', label: 'Section', type: 'text', readOnly: true },
        { name: 'enabled', label: 'Show this section', type: 'checkbox' },
        { name: 'heading', label: 'Heading', type: 'text' },
        { name: 'text', label: 'Text', type: 'text' },
        { name: 'limit', label: 'Number of items', type: 'number' },
      ],
    },
    {
      name: 'whyChooseUs', label: 'Why choose us (icons and text)', type: 'repeater', itemName: 'reason', itemLabel: 'title',
      fields: [
        { name: 'icon', label: 'Icon', type: 'image', folder: 'general' },
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'text', label: 'Text', type: 'textarea' },
      ],
    },
  ],
});

export const searchBox = singleton('searchBox', 'Flight search box settings', '/search-box', {
  fields: [
    { type: 'heading', label: 'Trip types' },
    { name: 'tripTypes.oneWay', label: 'One way', type: 'checkbox' },
    { name: 'tripTypes.roundTrip', label: 'Round trip', type: 'checkbox' },
    { name: 'tripTypes.multiCity', label: 'Multi city', type: 'checkbox' },
    { type: 'heading', label: 'Cities' },
    { name: 'defaultFrom', label: 'Default From city', type: 'relation', collection: 'cities', optionLabel: cityLabel },
    { name: 'defaultTo', label: 'Default To city', type: 'relation', collection: 'cities', optionLabel: cityLabel },
    { name: 'popularCities', label: 'Popular cities shown in the search suggestions', type: 'relationMulti', collection: 'cities', optionLabel: cityLabel },
    { type: 'heading', label: 'Travellers (maximum count)' },
    { name: 'maxAdults', label: 'Adults', type: 'number' },
    { name: 'maxChildren', label: 'Children', type: 'number' },
    { name: 'maxInfants', label: 'Infants', type: 'number' },
    { type: 'heading', label: 'Cabin class options' },
    { name: 'cabinClasses.economy', label: 'Economy', type: 'checkbox' },
    { name: 'cabinClasses.premiumEconomy', label: 'Premium Economy', type: 'checkbox' },
    { name: 'cabinClasses.business', label: 'Business', type: 'checkbox' },
    { name: 'cabinClasses.first', label: 'First', type: 'checkbox' },
    { type: 'heading', label: 'Special fare options' },
    { name: 'specialFares.student', label: 'Student', type: 'checkbox' },
    { name: 'specialFares.seniorCitizen', label: 'Senior citizen', type: 'checkbox' },
    { name: 'specialFares.armedForces', label: 'Armed forces', type: 'checkbox' },
    { name: 'specialFares.doctorsNurses', label: 'Doctors and nurses', type: 'checkbox' },
    { type: 'heading', label: 'Other options' },
    { name: 'directFlightsOption', label: 'Show "direct flights only" option', type: 'checkbox' },
    { name: 'maxAdvanceBookingDays', label: 'Maximum days allowed for advance booking', type: 'number' },
    { type: 'heading', label: 'Field text and placeholders' },
    { name: 'placeholders.from', label: 'From field', type: 'text' },
    { name: 'placeholders.to', label: 'To field', type: 'text' },
    { name: 'placeholders.departure', label: 'Departure date field', type: 'text' },
    { name: 'placeholders.return', label: 'Return date field', type: 'text' },
    { name: 'placeholders.travellers', label: 'Travellers field', type: 'text' },
    { type: 'heading', label: 'Error messages' },
    { name: 'errorMessages.sameCity', label: 'From and To city are the same', type: 'text' },
    { name: 'errorMessages.missingFrom', label: 'From city missing', type: 'text' },
    { name: 'errorMessages.missingTo', label: 'To city missing', type: 'text' },
    { name: 'errorMessages.missingDate', label: 'Date missing', type: 'text' },
  ],
});

export const footer = singleton('footer', 'Footer management', '/footer', {
  description: 'Popular routes, airlines and destinations are filled in automatically from the items marked as featured / popular.',
  fields: [
    { type: 'heading', label: 'Automatic link lists (how many links to show)' },
    { name: 'popularDomesticCount', label: 'Popular domestic routes', type: 'number' },
    { name: 'popularInternationalCount', label: 'Popular international routes', type: 'number' },
    { name: 'popularAirlinesCount', label: 'Popular airlines', type: 'number' },
    { name: 'popularDestinationsCount', label: 'Popular destinations', type: 'number' },
    {
      name: 'quickLinks', label: 'Quick links', type: 'repeater', itemName: 'link', itemLabel: 'label',
      fields: [{ name: 'label', label: 'Label', type: 'text' }, { name: 'url', label: 'Link', type: 'text' }],
    },
    { type: 'heading', label: 'Contact details' },
    { name: 'phone', label: 'Contact number', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'address', label: 'Address', type: 'textarea' },
    { type: 'heading', label: 'Social media links' },
    ...social('social'),
    { type: 'heading', label: 'Logos and buttons' },
    { name: 'showPaymentLogos', label: 'Show payment partner logos', type: 'checkbox' },
    { name: 'showCertificates', label: 'Show IATA / certificate logos', type: 'checkbox' },
    { name: 'showAppButtons', label: 'Show mobile app download buttons', type: 'checkbox' },
    { type: 'heading', label: 'Text' },
    { name: 'seoText', label: 'SEO text block (bottom of the footer)', type: 'rich' },
    { name: 'copyright', label: 'Copyright text', type: 'text' },
  ],
});

export const theme = singleton('theme', 'Theme and site settings', '/theme', {
  adminOnly: true,
  fields: [
    { name: 'siteName', label: 'Website name', type: 'text' },
    { name: 'logo', label: 'Logo', type: 'image', folder: 'general' },
    { name: 'favicon', label: 'Favicon', type: 'image', folder: 'general' },
    { name: 'primaryColor', label: 'Main color', type: 'color' },
    { name: 'secondaryColor', label: 'Secondary color', type: 'color' },
    { name: 'fontFamily', label: 'Font family', type: 'text', help: 'Example: Inter, sans-serif' },
    { type: 'heading', label: 'Fare display' },
    { name: 'currencySymbol', label: 'Currency symbol', type: 'text' },
    { name: 'fareFormat', label: 'Fare display format', type: 'text', help: 'Use {symbol} and {amount}, for example "{symbol} {amount}".' },
    { name: 'fareLabel', label: 'Fare label text', type: 'text', help: 'Example: Starting from' },
    { name: 'showFareOnRoutePages', label: 'Show fare on route pages', type: 'checkbox' },
    { name: 'fareDisclaimer', label: 'Fare disclaimer text', type: 'text' },
    { type: 'heading', label: 'Date and time' },
    { name: 'dateFormat', label: 'Date format', type: 'select', options: ['DD MMM YYYY', 'DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'] },
    { name: 'timeFormat', label: 'Time format', type: 'select', options: [{ value: '12h', label: '12 hour' }, { value: '24h', label: '24 hour' }] },
  ],
});

export const settings = singleton('settings', 'Settings', '/settings', {
  adminOnly: true,
  fields: [
    { type: 'heading', label: 'Contact details' },
    { name: 'phone', label: 'Contact number', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'address', label: 'Address', type: 'textarea' },
    { type: 'heading', label: 'Social media links' },
    ...social('social'),
    { type: 'heading', label: 'Google' },
    { name: 'googleAnalyticsId', label: 'Google Analytics ID', type: 'text' },
    { name: 'searchConsoleCode', label: 'Search Console verification code', type: 'text' },
    { type: 'heading', label: 'Enquiries' },
    { name: 'adminEmail', label: 'Admin email for receiving enquiries', type: 'email' },
    { type: 'heading', label: 'Maintenance mode' },
    { name: 'maintenanceMode', label: 'Turn on maintenance mode', type: 'checkbox' },
    { name: 'maintenanceMessage', label: 'Message shown to visitors', type: 'textarea' },
  ],
  Extras: SystemToolsPanel,
});

export const smtp = singleton('smtp', 'SMTP email settings', '/settings/smtp', {
  adminOnly: true,
  description: 'Used for enquiry emails, newsletters and template emails.',
  fields: [
    { name: 'host', label: 'SMTP host', type: 'text' },
    { name: 'port', label: 'Port', type: 'number' },
    { name: 'secure', label: 'Use SSL / TLS', type: 'checkbox' },
    { name: 'username', label: 'Username', type: 'text' },
    { name: 'password', label: 'Password', type: 'password' },
    { name: 'fromName', label: 'Sender name', type: 'text' },
    { name: 'fromEmail', label: 'Sender email', type: 'email' },
  ],
});

export const whatsapp = singleton('whatsapp', 'WhatsApp and chat settings', '/whatsapp', {
  fields: [
    { name: 'enabled', label: 'Show the WhatsApp chat button on all pages', type: 'checkbox' },
    { name: 'number', label: 'WhatsApp number (with country code)', type: 'text' },
    { name: 'defaultMessage', label: 'Default message', type: 'textarea' },
    { name: 'showCallButton', label: 'Show floating "Call now" button on mobile', type: 'checkbox' },
    { name: 'callNumber', label: 'Call now number', type: 'text' },
    { name: 'liveChatCode', label: 'Live chat code (third party script)', type: 'code' },
    { name: 'visibility', label: 'Show the buttons', type: 'select', options: [{ value: 'all', label: 'On all pages' }, { value: 'selected', label: 'Only on selected pages' }] },
    { name: 'selectedPaths', label: 'Selected pages (one URL per line)', type: 'textarea' },
  ],
});

export const mobileApp = singleton('mobileApp', 'Mobile app links', '/mobile-app', {
  fields: [
    { name: 'heading', label: 'Section heading', type: 'text' },
    { name: 'text', label: 'Section text', type: 'textarea' },
    { name: 'androidUrl', label: 'Google Play link', type: 'url' },
    { name: 'iosUrl', label: 'App Store link', type: 'url' },
    { name: 'qrImage', label: 'QR code image', type: 'image', folder: 'general' },
  ],
});

export const helpCenter = singleton('helpCenter', 'Help center / customer support page', '/help-center', {
  seo: true,
  fields: [
    { name: 'title', label: 'Page heading', type: 'text' },
    { name: 'urlPath', label: 'Page URL', type: 'text', help: 'Example: /about-us. Leave empty to use the default URL.' },
    { name: 'phones', label: 'Customer care phone numbers (one per line)', type: 'textarea' },
    { name: 'emails', label: 'Customer care emails (one per line)', type: 'textarea' },
    { name: 'supportTimings', label: 'Support timings', type: 'text', help: 'Example: 24x7' },
    { name: 'officeAddress', label: 'Office address', type: 'textarea' },
    {
      name: 'topics', label: 'Help topics', type: 'repeater', itemName: 'topic', itemLabel: 'question',
      fields: [{ name: 'question', label: 'Question', type: 'text' }, { name: 'answer', label: 'Answer', type: 'textarea' }],
    },
  ],
});

export const contactPage = singleton('contactPage', 'Contact us page', '/contact-page', {
  seo: true,
  description: 'The contact form (name, email, phone, subject, message) is protected by captcha. Submissions appear under Enquiries.',
  fields: [
    { name: 'title', label: 'Page heading', type: 'text' },
    { name: 'urlPath', label: 'Page URL', type: 'text', help: 'Example: /about-us. Leave empty to use the default URL.' },
    { name: 'intro', label: 'Intro text', type: 'textarea' },
    { name: 'officeName', label: 'Office name', type: 'text' },
    { name: 'address', label: 'Office address', type: 'textarea' },
    { name: 'phone', label: 'Phone', type: 'text' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'mapEmbedUrl', label: 'Google Map embed URL (office location)', type: 'url' },
    { name: 'submitLabel', label: 'Submit button text', type: 'text' },
    { name: 'thankYouMessage', label: 'Thank you message after submit', type: 'textarea' },
    { name: 'captchaSiteKey', label: 'reCAPTCHA site key', type: 'text' },
  ],
});

export const announcementSettings = singleton('announcementSettings', 'Cookie consent message', '/announcements/cookie-consent', {
  fields: [
    { name: 'cookieConsentEnabled', label: 'Show the cookie consent message', type: 'checkbox' },
    { name: 'cookieMessage', label: 'Message', type: 'textarea' },
    { name: 'cookieButtonText', label: 'Button text', type: 'text' },
    { name: 'cookiePolicyLink', label: 'Cookie / privacy policy link', type: 'text' },
  ],
});

export const seoSettings = singleton('seoSettings', 'SEO settings', '/seo/settings', {
  adminOnly: true,
  description: 'Sitemap generation, robots.txt, tracking scripts and the 404 page. Search Console code is under Settings.',
  fields: [
    { name: 'robotsTxt', label: 'robots.txt', type: 'code', rows: 8 },
    { name: 'headerScripts', label: 'Header scripts (Google Analytics, Tag Manager, Facebook Pixel)', type: 'code' },
    { name: 'footerScripts', label: 'Footer scripts', type: 'code' },
    { name: 'gtmId', label: 'Google Tag Manager ID', type: 'text' },
    { name: 'facebookPixelId', label: 'Facebook Pixel ID', type: 'text' },
    { type: 'heading', label: '404 page not found' },
    { name: 'notFound.title', label: 'Title', type: 'text' },
    { name: 'notFound.message', label: 'Message', type: 'textarea' },
    { name: 'notFound.buttonLabel', label: 'Button text', type: 'text' },
  ],
  Extras: SeoLinksPanel,
});

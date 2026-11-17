/**
 * Single-instance configuration documents ("singletons").
 *  - adminOnly: editors cannot change it
 *  - public:    exposed through the public API (private values are listed in `privateFields`)
 */
const section = (key, label, extra = {}) => ({ key, label, enabled: true, heading: '', text: '', ...extra });
const noImage = { url: '', alt: '' };

export const SITE_CONFIG = Object.freeze({
  header: {
    public: true,
    defaults: {
      logo: noImage, phone: '', email: '', showAuthButtons: true, showLanguageSelector: false,
      showCurrencySelector: false, stickyHeader: true, showTopOfferStrip: false, topOfferText: '', topOfferLink: '',
    },
  },
  home: {
    public: true,
    defaults: {
      sections: [
        section('banners', 'Banner slider'),
        section('searchBox', 'Flight search box'),
        section('domesticRoutes', 'Popular domestic routes', { limit: 8 }),
        section('internationalRoutes', 'Popular international routes', { limit: 8 }),
        section('cheapestDeals', 'Cheapest fare deals', { limit: 8 }),
        section('offers', 'Flight offers', { limit: 6 }),
        section('airlines', 'Popular airlines', { limit: 8 }),
        section('destinations', 'Popular destinations', { limit: 8 }),
        section('whyChooseUs', 'Why choose us'),
        section('trustBadges', 'Trust badges'),
        section('testimonials', 'Testimonials', { limit: 6 }),
        section('blogs', 'Blogs and travel tips', { limit: 3 }),
        section('faqs', 'Frequently asked questions', { limit: 8 }),
        section('newsletter', 'Newsletter subscribe box'),
        section('mobileApp', 'Mobile app download'),
      ],
      whyChooseUs: [],
      seo: {},
    },
  },
  searchBox: {
    public: true,
    defaults: {
      tripTypes: { oneWay: true, roundTrip: true, multiCity: true },
      defaultFrom: null, defaultTo: null, popularCities: [],
      maxAdults: 9, maxChildren: 6, maxInfants: 4,
      cabinClasses: { economy: true, premiumEconomy: true, business: true, first: false },
      specialFares: { student: true, seniorCitizen: true, armedForces: true, doctorsNurses: true },
      directFlightsOption: true, maxAdvanceBookingDays: 365,
      placeholders: { from: 'From city or airport', to: 'To city or airport', departure: 'Departure date', return: 'Return date', travellers: 'Travellers and class' },
      errorMessages: {
        sameCity: 'From and To city cannot be same', missingFrom: 'Please select a From city',
        missingTo: 'Please select a To city', missingDate: 'Please select a travel date',
      },
    },
  },
  footer: {
    public: true,
    defaults: {
      popularDomesticCount: 8, popularInternationalCount: 8, popularAirlinesCount: 8, popularDestinationsCount: 8,
      quickLinks: [
        { label: 'About us', url: '/about-us' }, { label: 'Privacy policy', url: '/privacy-policy' },
        { label: 'Terms and conditions', url: '/terms-and-conditions' }, { label: 'Disclaimer', url: '/disclaimer' },
        { label: 'Contact us', url: '/contact-us' },
      ],
      phone: '', email: '', address: '',
      social: { facebook: '', twitter: '', instagram: '', linkedin: '', youtube: '' },
      showPaymentLogos: true, showAppButtons: true, showCertificates: true, seoText: '', copyright: '',
    },
  },
  theme: {
    public: true, adminOnly: true,
    defaults: {
      siteName: '', logo: noImage, favicon: noImage, primaryColor: '#0f766e', secondaryColor: '#f97316',
      fontFamily: 'Inter, sans-serif', currencySymbol: 'Rs.', fareFormat: '{symbol} {amount}',
      dateFormat: 'DD MMM YYYY', timeFormat: '12h', fareLabel: 'Starting from', showFareOnRoutePages: true,
      fareDisclaimer: 'Fares are subject to change',
    },
  },
  settings: {
    public: true, adminOnly: true, privateFields: ['adminEmail'],
    defaults: {
      phone: '', email: '', address: '',
      social: { facebook: '', linkedin: '', twitter: '', instagram: '', youtube: '' },
      googleAnalyticsId: '', searchConsoleCode: '', adminEmail: '', maintenanceMode: false, maintenanceMessage: '',
    },
  },
  smtp: {
    public: false, adminOnly: true,
    defaults: { host: '', port: 587, secure: false, username: '', password: '', fromName: '', fromEmail: '' },
  },
  whatsapp: {
    public: true,
    defaults: {
      enabled: false, number: '', defaultMessage: 'Hello, I need help with my flight booking.',
      showCallButton: false, callNumber: '', liveChatCode: '', visibility: 'all', selectedPaths: '',
    },
  },
  mobileApp: {
    public: true,
    defaults: { heading: 'Download our app', text: '', androidUrl: '', iosUrl: '', qrImage: noImage },
  },
  helpCenter: {
    public: true,
    defaults: { title: 'Help Center', phones: '', emails: '', supportTimings: '24x7', officeAddress: '', topics: [], seo: {} },
  },
  contactPage: {
    public: true,
    defaults: {
      title: 'Contact us', intro: '', officeName: '', address: '', phone: '', email: '', mapEmbedUrl: '',
      submitLabel: 'Send enquiry', thankYouMessage: 'Thank you! We will get back to you shortly.', captchaSiteKey: '', seo: {},
    },
  },
  announcementSettings: {
    public: true,
    defaults: {
      cookieConsentEnabled: true, cookieMessage: 'We use cookies to improve your experience.',
      cookieButtonText: 'Accept', cookiePolicyLink: '/privacy-policy',
    },
  },
  seoSettings: {
    public: true, adminOnly: true,
    defaults: {
      robotsTxt: 'User-agent: *\nAllow: /', headerScripts: '', footerScripts: '', gtmId: '', facebookPixelId: '',
      notFound: { title: 'Page not found', message: 'The page you are looking for does not exist.', buttonLabel: 'Back to home' },
    },
  },
});
export const SITE_CONFIG_KEYS = Object.freeze(Object.keys(SITE_CONFIG));

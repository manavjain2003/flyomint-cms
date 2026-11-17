const item = (to, label, adminOnly = false) => ({ to, label, adminOnly });

/** Sidebar structure, following the admin panel menu of the project scope. */
export const NAV_GROUPS = [
  { items: [item('/', 'Dashboard')] },
  {
    title: 'Website',
    items: [
      item('/header', 'Header / top bar'), item('/home-page', 'Home page'), item('/search-box', 'Flight search box'),
      item('/banners', 'Banners'), item('/announcements', 'Announcement bar'),
      item('/announcements/cookie-consent', 'Cookie consent'), item('/popups', 'Popups'),
    ],
  },
  {
    title: 'Flights',
    items: [
      item('/routes/domestic', 'Domestic flight routes'), item('/routes/international', 'International flight routes'),
      item('/destinations', 'Destination pages'), item('/airlines', 'Airlines'), item('/cities', 'Airports / cities'),
      item('/deals', 'Flight deals'), item('/offers', 'Flight offers'),
      item('/special-fares/student-fare', 'Student fare'), item('/special-fares/senior-citizen-fare', 'Senior citizen fare'),
      item('/special-fares/armed-forces-fare', 'Armed forces fare'), item('/special-fares/doctors-nurses-fare', 'Doctors and nurses fare'),
      item('/trust-items', 'Trust badges and logos'),
    ],
  },
  {
    title: 'Content',
    items: [
      item('/blogs', 'Blogs'), item('/guides', 'Travel guides and help pages'), item('/faqs', 'FAQs'),
      item('/testimonials', 'Testimonials'), item('/pages/about', 'About us'), item('/pages/privacy', 'Privacy policy'),
      item('/pages/terms', 'Terms and conditions'), item('/pages/disclaimer', 'Disclaimer'),
      item('/pages/payment-refund', 'Payment and refund policy'), item('/help-center', 'Help center'),
      item('/contact-page', 'Contact us page'),
    ],
  },
  { title: 'Navigation', items: [item('/menus', 'Menu management'), item('/footer', 'Footer')] },
  { title: 'SEO', items: [item('/seo/settings', 'SEO settings', true), item('/seo/redirects', '301 redirections'), item('/seo/duplicates', 'Duplicate content')] },
  {
    title: 'Communication',
    items: [
      item('/templates', 'Email / SMS templates'), item('/subscribers', 'Newsletter'), item('/enquiries', 'Enquiries'),
      item('/whatsapp', 'WhatsApp and chat'), item('/mobile-app', 'Mobile app links'),
    ],
  },
  { title: 'Tools', items: [item('/media', 'Media library'), item('/reports', 'Reports')] },
  {
    title: 'Administration',
    items: [
      item('/users', 'Admin users', true), item('/activity-log', 'Activity log', true),
      item('/theme', 'Theme and site settings', true), item('/settings', 'Settings', true), item('/settings/smtp', 'SMTP email settings', true),
    ],
  },
];

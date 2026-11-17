/** Starter content created on first run. Existing records are never overwritten. */
const mail = (body) => `<p>${body.replace(/\n/g, '</p><p>')}</p>`;

// [key, channel, name, subject, body, placeholders]
export const TEMPLATES = [
  ['welcome', 'email', 'Welcome email after registration', 'Welcome to our travel site, {{customer_name}}!', mail('Hi {{customer_name}},\nThank you for registering. Start searching for the best flight fares today.'), ['customer_name']],
  ['forgot-password', 'email', 'Forgot password email', 'Reset your password', mail('Hi {{customer_name}},\nClick the link below to reset your password:\n{{link}}'), ['customer_name', 'link']],
  ['admin-password-reset', 'email', 'Admin panel password reset', 'Reset your admin password', mail('Hi {{customer_name}},\nUse this link to reset your CMS password (valid for 1 hour):\n{{link}}'), ['customer_name', 'link']],
  ['booking-confirmation', 'email', 'Booking confirmation and e-ticket', 'Booking confirmed: {{booking_number}}', mail('Hi {{customer_name}},\nYour booking {{booking_number}} for {{route}} on {{date}} is confirmed. Your e-ticket is attached.'), ['customer_name', 'booking_number', 'route', 'date']],
  ['payment-success', 'email', 'Payment success', 'Payment received for {{booking_number}}', mail('Hi {{customer_name}},\nWe received your payment of {{amount}} for booking {{booking_number}}.'), ['customer_name', 'booking_number', 'amount']],
  ['payment-success', 'sms', 'Payment success SMS', '', 'Payment of {{amount}} received for booking {{booking_number}}. Thank you!', ['booking_number', 'amount']],
  ['payment-failed', 'email', 'Payment failed', 'Payment failed for {{booking_number}}', mail('Hi {{customer_name}},\nYour payment for booking {{booking_number}} could not be completed. Please try again.'), ['customer_name', 'booking_number']],
  ['payment-failed', 'sms', 'Payment failed SMS', '', 'Payment failed for booking {{booking_number}}. Please try again.', ['booking_number']],
  ['cancellation-refund', 'email', 'Cancellation and refund', 'Cancellation confirmed: {{booking_number}}', mail('Hi {{customer_name}},\nBooking {{booking_number}} ({{route}}) has been cancelled. Your refund of {{amount}} will be processed shortly.'), ['customer_name', 'booking_number', 'route', 'amount']],
  ['cancellation-refund', 'sms', 'Cancellation and refund SMS', '', 'Booking {{booking_number}} cancelled. Refund of {{amount}} is being processed.', ['booking_number', 'amount']],
  ['flight-reminder', 'email', 'Flight reminder', 'Your flight {{route}} is on {{date}}', mail('Hi {{customer_name}},\nThis is a reminder for your flight {{route}} on {{date}}. Booking: {{booking_number}}.'), ['customer_name', 'route', 'date', 'booking_number']],
  ['flight-reminder', 'sms', 'Flight reminder SMS', '', 'Reminder: flight {{route}} on {{date}}. Booking {{booking_number}}.', ['route', 'date', 'booking_number']],
  ['enquiry-acknowledgment', 'email', 'Enquiry acknowledgment', 'We received your enquiry', mail('Hi {{customer_name}},\nThank you for contacting us. Our team will get back to you shortly.'), ['customer_name']],
  ['newsletter-confirmation', 'email', 'Newsletter subscription confirmation', 'Please confirm your subscription', mail('Hi {{customer_name}},\nConfirm your subscription to receive the best flight offers:\n{{link}}'), ['customer_name', 'link']],
];

export const GUIDES = [
  'How to book a flight', 'Baggage guide', 'Web check-in guide', 'Cancellation and refund policy',
  'Date change / reschedule guide', 'Travel documents guide (ID, passport)',
];

const menuItem = (label, url, children = []) => ({ label, url, target: '_self', isActive: true, children });

export const MENUS = {
  main: [
    menuItem('Home', '/'),
    menuItem('Domestic Flights', '/domestic-flights', [menuItem('Top Domestic Routes', '/domestic-flights')]),
    menuItem('International Flights', '/international-flights', [menuItem('Top International Routes', '/international-flights')]),
    menuItem('Offers', '/offers'), menuItem('Airlines', '/airlines'),
    menuItem('Destinations', '/destinations'), menuItem('Blog', '/blog'),
  ],
  footer: [
    menuItem('About us', '/about-us'), menuItem('Privacy policy', '/privacy-policy'),
    menuItem('Terms and conditions', '/terms-and-conditions'), menuItem('Contact us', '/contact-us'),
  ],
};

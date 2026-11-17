import { randomBytes } from 'node:crypto';
import { env } from '../config/env.js';
import { Blog } from '../models/Blog.js';
import { Enquiry } from '../models/Enquiry.js';
import { PageEvent } from '../models/PageEvent.js';
import { Subscriber } from '../models/Subscriber.js';
import { verifyCaptcha } from '../services/captchaService.js';
import { sendMail } from '../services/mailService.js';
import { getConfig } from '../services/siteConfigService.js';
import { sendTemplatedEmail } from '../services/templateService.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const escapeHtml = (text = '') => String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

// -------------------------------- enquiries --------------------------------
export const submitEnquiry = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message, city, captchaToken } = req.body;

  if (!name || !message || !EMAIL_PATTERN.test(email ?? '')) {
    throw new ApiError(400, 'Name, a valid email and a message are required');
  }
  if (!(await verifyCaptcha(captchaToken))) throw new ApiError(400, 'Captcha verification failed. Please try again');

  const enquiry = await Enquiry.create({ name, email, phone, subject, message, city });

  const [settings, contact] = await Promise.all([getConfig('settings'), getConfig('contactPage')]);
  const adminEmail = settings.adminEmail || env.seedAdmin.email;

  await Promise.all([
    sendMail({
      to: adminEmail,
      subject: `New enquiry from ${name}`,
      html: `<p><b>Name:</b> ${escapeHtml(name)}<br><b>Email:</b> ${escapeHtml(email)}<br><b>Phone:</b> ${escapeHtml(phone)}<br><b>Subject:</b> ${escapeHtml(subject)}</p><p>${escapeHtml(message)}</p>`,
    }),
    sendTemplatedEmail('enquiry-acknowledgment', email, { customer_name: name }),
  ]);

  res.status(201).json({ id: enquiry.id, message: contact.thankYouMessage });
});

// -------------------------------- newsletter -------------------------------
export const subscribe = asyncHandler(async (req, res) => {
  const email = String(req.body.email ?? '').trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email)) throw new ApiError(400, 'Please enter a valid email address');

  let subscriber = await Subscriber.findOne({ email });
  if (subscriber?.status === 'active') return res.json({ message: 'You are already subscribed.' });

  subscriber ??= new Subscriber({ email });
  subscriber.status = 'pending';
  subscriber.token ||= randomBytes(24).toString('hex');
  await subscriber.save();

  await sendTemplatedEmail('newsletter-confirmation', email, {
    customer_name: 'Traveller',
    link: `${env.siteUrl}/newsletter/confirm?token=${subscriber.token}`,
  });
  return res.status(201).json({ message: 'Please check your email to confirm your subscription.' });
});

const changeSubscription = (status, message) =>
  asyncHandler(async (req, res) => {
    const subscriber = await Subscriber.findOne({ token: String(req.body.token ?? '') });
    if (!subscriber) throw new ApiError(400, 'This link is invalid or has already been used');

    subscriber.status = status;
    if (status === 'active') subscriber.confirmedAt = new Date();
    await subscriber.save();
    res.json({ message });
  });

export const confirmSubscription = changeSubscription('active', 'Thank you! Your subscription is now active.');
export const unsubscribe = changeSubscription('unsubscribed', 'You have been unsubscribed.');

// --------------------------------- tracking --------------------------------
/** The website calls this for page views and banner/offer clicks; it feeds the reports. */
export const trackEvent = asyncHandler(async (req, res) => {
  const { type, path, refType, refId, label } = req.body;
  if (!['view', 'click'].includes(type)) throw new ApiError(400, 'Invalid event type');

  await PageEvent.create({ type, path, refType, refId, label });
  if (type === 'view' && refType === 'blog' && refId) await Blog.updateOne({ _id: refId }, { $inc: { views: 1 } });
  res.status(202).json({ ok: true });
});

import { env } from '../config/env.js';
import { Menu } from '../models/Menu.js';
import { Page } from '../models/Page.js';
import { SiteConfig } from '../models/SiteConfig.js';
import { Subscriber } from '../models/Subscriber.js';
import { Template } from '../models/Template.js';
import { RESOURCES } from '../resources/registry.js';
import { logActivity } from '../services/activityService.js';
import { cache } from '../services/cacheService.js';
import { sendMail } from '../services/mailService.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { fillPlaceholders } from '../utils/object.js';

const SAMPLE_VALUES = {
  customer_name: 'Test Customer', booking_number: 'BK123456', route: 'Delhi to Mumbai',
  date: '15 Dec 2026', amount: 'Rs. 3,499', link: env.siteUrl, name: 'Test User',
};
const CAMPAIGN_BATCH = 20;

/** Renders a template with sample data; sends it when the channel is email. */
export const testTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);
  if (!template) throw new ApiError(404, 'Template not found');

  const subject = fillPlaceholders(template.subject, SAMPLE_VALUES);
  const body = fillPlaceholders(template.body, SAMPLE_VALUES);
  if (template.channel === 'sms') return res.json({ sent: false, preview: body, reason: 'SMS preview only (no SMS gateway connected)' });

  if (!req.body.to) throw new ApiError(400, 'Enter an email address to send the test to');
  res.json({ ...(await sendMail({ to: req.body.to, subject: `[Test] ${subject}`, html: body })), preview: body });
});

/** Sends an offer email to every active subscriber, each with their own unsubscribe link. */
export const sendCampaign = asyncHandler(async (req, res) => {
  const { subject, html } = req.body;
  if (!subject || !html) throw new ApiError(400, 'Subject and message are required');

  const subscribers = await Subscriber.find({ status: 'active' });
  const result = { total: subscribers.length, sent: 0, failed: 0 };

  for (let start = 0; start < subscribers.length; start += CAMPAIGN_BATCH) {
    const batch = subscribers.slice(start, start + CAMPAIGN_BATCH);
    const outcomes = await Promise.all(
      batch.map((subscriber) => {
        const unsubscribe = `${env.siteUrl}/newsletter/unsubscribe?token=${subscriber.token}`;
        return sendMail({
          to: subscriber.email,
          subject,
          html: `${html}<p style="font-size:12px;color:#666"><a href="${unsubscribe}">Unsubscribe</a></p>`,
        });
      }),
    );
    outcomes.forEach((outcome) => (outcome.sent ? (result.sent += 1) : (result.failed += 1)));
  }
  logActivity(req, { action: 'sent newsletter', resource: 'subscribers', title: `${subject} (${result.sent} sent)` });
  res.json(result);
});

/** Downloads every content collection as one JSON file. Admin users and activity logs are left out. */
export const backupData = asyncHandler(async (_req, res) => {
  const skipped = ['users', 'activity-logs'];
  const collections = {};

  for (const { name, Model } of RESOURCES.filter((resource) => !skipped.includes(resource.name))) {
    collections[name] = await Model.find().lean();
  }
  collections.pages = await Page.find().lean();
  collections.menus = await Menu.find().lean();
  collections.siteConfig = await SiteConfig.find().lean();

  res.setHeader('Content-Disposition', `attachment; filename="cms-backup-${new Date().toISOString().slice(0, 10)}.json"`);
  res.json({ generatedAt: new Date().toISOString(), collections });
});

export const clearCache = (req, res) => {
  cache.clear();
  logActivity(req, { action: 'cleared cache', resource: 'system', title: 'Public API cache' });
  res.json({ message: 'Cache cleared' });
};

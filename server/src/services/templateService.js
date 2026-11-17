import { Template } from '../models/Template.js';
import { fillPlaceholders } from '../utils/object.js';
import { sendMail } from './mailService.js';

export async function renderTemplate(key, channel, values) {
  const template = await Template.findOne({ key, channel, isActive: true });
  if (!template) return null;
  return {
    subject: fillPlaceholders(template.subject, values),
    body: fillPlaceholders(template.body, values),
  };
}

export async function sendTemplatedEmail(key, to, values) {
  const rendered = await renderTemplate(key, 'email', values);
  if (!rendered) return { sent: false, reason: `No active email template "${key}"` };
  return sendMail({ to, subject: rendered.subject, html: rendered.body });
}

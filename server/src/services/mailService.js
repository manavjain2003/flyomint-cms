import nodemailer from 'nodemailer';
import { env } from '../config/env.js';
import { getConfig } from './siteConfigService.js';

/** SMTP details saved in the admin panel win over environment variables. */
async function createTransport() {
  const saved = await getConfig('smtp');
  const host = saved.host || env.smtp.host;
  if (!host) return null;

  const user = saved.username || env.smtp.user;
  const pass = saved.password || env.smtp.pass;
  const fromEmail = saved.fromEmail || env.smtp.from || user;

  return {
    from: saved.fromName ? `"${saved.fromName}" <${fromEmail}>` : fromEmail,
    transporter: nodemailer.createTransport({
      host,
      port: Number(saved.port) || env.smtp.port,
      secure: Boolean(saved.secure),
      auth: user ? { user, pass } : undefined,
    }),
  };
}

/** Sends an email. Returns { sent, reason } instead of throwing when SMTP is not configured. */
export async function sendMail({ to, subject, html }) {
  const transport = await createTransport();
  if (!transport) return { sent: false, reason: 'SMTP is not configured' };

  try {
    await transport.transporter.sendMail({ from: transport.from, to, subject, html });
    return { sent: true };
  } catch (error) {
    console.error('Email failed:', error.message);
    return { sent: false, reason: error.message };
  }
}

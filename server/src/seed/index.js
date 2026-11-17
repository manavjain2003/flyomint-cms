import { env } from '../config/env.js';
import { PAGES } from '../constants/paths.js';
import { AdminUser } from '../models/AdminUser.js';
import { Guide } from '../models/Guide.js';
import { Menu } from '../models/Menu.js';
import { Page } from '../models/Page.js';
import { Template } from '../models/Template.js';
import { hashPassword } from '../services/userService.js';
import { slugify } from '../utils/slugify.js';
import { GUIDES, MENUS, TEMPLATES } from './defaults.js';

async function seedAdmin() {
  if (await AdminUser.exists({})) return;
  const { username, email, password } = env.seedAdmin;
  await AdminUser.create({ name: 'Administrator', username, email, passwordHash: await hashPassword(password), role: 'admin' });
  console.log(`Created first admin user "${username}"`);
}

const seedTemplates = () =>
  Promise.all(TEMPLATES.map(([key, channel, name, subject, body, placeholders]) =>
    Template.updateOne({ key, channel }, { $setOnInsert: { key, channel, name, subject, body, placeholders } }, { upsert: true })));

const seedGuides = () =>
  Promise.all(GUIDES.map((title, order) =>
    Guide.updateOne({ slug: slugify(title) }, { $setOnInsert: { title, slug: slugify(title), order, status: 'draft' } }, { upsert: true })));

const seedPages = () =>
  Promise.all(Object.entries(PAGES).map(([key, { title }]) =>
    Page.updateOne({ key }, { $setOnInsert: { key, title, heading: title, status: 'draft' } }, { upsert: true })));

const seedMenus = () =>
  Promise.all(Object.entries(MENUS).map(([name, items]) =>
    Menu.updateOne({ name }, { $setOnInsert: { name, items } }, { upsert: true })));

export async function runSeeds() {
  await seedAdmin();
  await Promise.all([seedTemplates(), seedGuides(), seedPages(), seedMenus()]);
}

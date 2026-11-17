import { SITE_CONFIG } from '../constants/siteConfig.js';
import { SiteConfig } from '../models/SiteConfig.js';

/** Stored values layered over the defaults, so new settings always have a value. */
export async function getConfig(key) {
  const stored = await SiteConfig.findOne({ key });
  return { ...SITE_CONFIG[key].defaults, ...(stored?.data ?? {}) };
}

export async function saveConfig(key, data) {
  const doc = await SiteConfig.findOneAndUpdate({ key }, { data }, { new: true, upsert: true });
  return { ...SITE_CONFIG[key].defaults, ...doc.data };
}

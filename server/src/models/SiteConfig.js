import { SITE_CONFIG_KEYS } from '../constants/siteConfig.js';
import { defineModel } from './helpers/defineModel.js';

export const SiteConfig = defineModel('SiteConfig', {
  key: { type: String, required: true, unique: true, enum: SITE_CONFIG_KEYS },
  data: { type: Object, default: {} },
});

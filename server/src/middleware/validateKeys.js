import { SITE_CONFIG_KEYS } from '../constants/siteConfig.js';
import { PAGE_KEYS } from '../constants/paths.js';
import { ApiError } from '../utils/ApiError.js';

const validator = (allowed, message) => (req, _res, next) =>
  allowed.includes(req.params.key) ? next() : next(new ApiError(404, message));

export const validatePageKey = validator(PAGE_KEYS, 'Unknown page');
export const validateConfigKey = validator(SITE_CONFIG_KEYS, 'Unknown settings group');

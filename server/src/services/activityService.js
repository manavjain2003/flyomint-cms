import { ActivityLog } from '../models/ActivityLog.js';

/** Records who changed what. Failures are logged but never block the request. */
export function logActivity(req, { action, resource, doc, title }) {
  ActivityLog.create({
    user: req.user.username,
    action,
    resource,
    docId: doc?.id,
    title: title ?? doc?.title ?? doc?.name ?? doc?.key,
  }).catch((error) => console.error('Activity log failed:', error.message));
}

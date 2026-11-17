import { defineModel } from './helpers/defineModel.js';

export const ActivityLog = defineModel(
  'ActivityLog',
  {
    user: { type: String, required: true },
    action: { type: String, required: true },
    resource: { type: String, required: true },
    docId: String,
    title: String,
  },
  { indexes: [[{ createdAt: -1 }]] },
);

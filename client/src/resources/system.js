import CampaignPanel from '../features/extras/CampaignPanel.jsx';
import TemplateTestPanel from '../features/extras/TemplateTestPanel.jsx';
import { ACTIVE_COLUMN, ACTIVE_FIELD, ACTIVE_FILTER } from './shared.js';

const ENQUIRY_STATUSES = ['new', 'in-progress', 'closed'];

export const enquiries = {
  key: 'enquiries', kind: 'collection', api: 'enquiries', path: '/enquiries',
  title: 'Enquiries', itemName: 'enquiry', noCreate: true, noDelete: false, exportable: true, dateFilter: true,
  filters: [{ name: 'status', label: 'Status', options: ENQUIRY_STATUSES }],
  columns: [
    { key: 'createdAt', label: 'Received', type: 'datetime' }, { key: 'name', label: 'Name' }, { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' }, { key: 'subject', label: 'Subject' },
    { key: 'status', label: 'Status', type: 'inlineSelect', options: ENQUIRY_STATUSES },
  ],
  fields: [
    { name: 'name', label: 'Name', type: 'text', readOnly: true },
    { name: 'email', label: 'Email', type: 'text', readOnly: true },
    { name: 'phone', label: 'Phone', type: 'text', readOnly: true },
    { name: 'subject', label: 'Subject', type: 'text', readOnly: true },
    { name: 'message', label: 'Message', type: 'textarea', rows: 6, readOnly: true },
    { name: 'status', label: 'Status', type: 'select', options: ENQUIRY_STATUSES },
    { name: 'notes', label: 'Internal notes', type: 'textarea' },
  ],
};

export const subscribers = {
  key: 'subscribers', kind: 'collection', api: 'subscribers', path: '/subscribers',
  title: 'Newsletter subscribers', itemName: 'subscriber', noCreate: true, exportable: true, dateFilter: true,
  filters: [{ name: 'status', label: 'Status', options: ['pending', 'active', 'unsubscribed'] }],
  columns: [{ key: 'email', label: 'Email' }, { key: 'status', label: 'Status', type: 'inlineSelect', options: ['pending', 'active', 'unsubscribed'] }, { key: 'createdAt', label: 'Subscribed on', type: 'datetime' }],
  fields: [
    { name: 'email', label: 'Email', type: 'text', readOnly: true },
    { name: 'status', label: 'Status', type: 'select', options: ['pending', 'active', 'unsubscribed'] },
  ],
  ListExtras: CampaignPanel,
};

export const templates = {
  key: 'templates', kind: 'collection', api: 'templates', path: '/templates',
  title: 'Email / SMS templates', itemName: 'template', noDelete: true, defaultValues: { isActive: true, channel: 'email' },
  description: 'Use placeholders such as {{customer_name}}, {{booking_number}}, {{route}} and {{date}}.',
  filters: [{ name: 'channel', label: 'Channel', options: ['email', 'sms'] }, ACTIVE_FILTER],
  columns: [{ key: 'name', label: 'Template' }, { key: 'key', label: 'Key' }, { key: 'channel', label: 'Channel', type: 'badge' }, ACTIVE_COLUMN],
  fields: [
    { name: 'name', label: 'Template name', type: 'text', required: true },
    { name: 'key', label: 'Key (used by the website)', type: 'text', required: true },
    { name: 'channel', label: 'Channel', type: 'select', options: ['email', 'sms'] },
    { name: 'subject', label: 'Email subject', type: 'text' },
    { name: 'body', label: 'Message (HTML for email, plain text for SMS)', type: 'code', rows: 10, required: true },
    { name: 'placeholders', label: 'Available placeholders', type: 'tags' },
    ACTIVE_FIELD,
  ],
  Extras: TemplateTestPanel,
};

export const redirects = {
  key: 'redirects', kind: 'collection', api: 'redirects', path: '/seo/redirects',
  title: '301 redirections', itemName: 'redirect', defaultValues: { isActive: true, statusCode: '301' },
  columns: [{ key: 'fromPath', label: 'Old URL' }, { key: 'toPath', label: 'New URL' }, { key: 'statusCode', label: 'Type', type: 'badge' }, ACTIVE_COLUMN],
  fields: [
    { name: 'fromPath', label: 'Old URL (e.g. /old-page)', type: 'text', required: true },
    { name: 'toPath', label: 'New URL (e.g. /new-page)', type: 'text', required: true },
    { name: 'statusCode', label: 'Redirect type', type: 'select', options: [{ value: '301', label: '301 permanent' }, { value: '302', label: '302 temporary' }] },
    ACTIVE_FIELD,
  ],
};

export const users = {
  key: 'users', kind: 'collection', api: 'users', path: '/users', adminOnly: true,
  title: 'Admin users', itemName: 'user', defaultValues: { role: 'editor', isBlocked: false },
  description: 'Admin has full access. Editor can add and edit content but cannot delete or change settings.',
  filters: [{ name: 'role', label: 'Role', options: ['admin', 'editor'] }],
  columns: [{ key: 'name', label: 'Name' }, { key: 'username', label: 'Username' }, { key: 'role', label: 'Role', type: 'badge' }, { key: 'isBlocked', label: 'Blocked', type: 'boolean' }, { key: 'lastLoginAt', label: 'Last login', type: 'datetime' }],
  fields: [
    { name: 'name', label: 'Full name', type: 'text', required: true },
    { name: 'username', label: 'Username', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'role', label: 'Role', type: 'select', options: [{ value: 'admin', label: 'Admin' }, { value: 'editor', label: 'Editor' }] },
    { name: 'password', label: 'Password', type: 'password', requiredOnCreate: true, help: 'Minimum 8 characters. Leave empty to keep the current password.' },
    { name: 'isBlocked', label: 'Block this user', type: 'checkbox' },
  ],
};

export const activityLogs = {
  key: 'activity-logs', kind: 'collection', api: 'activity-logs', path: '/activity-log', adminOnly: true, readOnly: true,
  title: 'Activity log', description: 'Who added, edited or deleted which page, and when.', dateFilter: true,
  columns: [{ key: 'createdAt', label: 'When', type: 'datetime' }, { key: 'user', label: 'User' }, { key: 'action', label: 'Action', type: 'badge' }, { key: 'resource', label: 'Area' }, { key: 'title', label: 'Item' }],
  fields: [],
};

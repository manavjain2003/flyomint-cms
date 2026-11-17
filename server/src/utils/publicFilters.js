import { CONTENT_STATUS } from '../constants/content.js';

/** Midnight (UTC) of the current day, so an "end date" stays valid for the whole day. */
export function startOfToday() {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

/** Published, or scheduled and due. */
export const publishedNow = () => ({
  $or: [
    { status: CONTENT_STATUS.PUBLISHED },
    { status: CONTENT_STATUS.SCHEDULED, publishAt: { $lte: new Date() } },
  ],
});

export const activeOnly = () => ({ isActive: { $ne: false } });

/** Matches documents whose [startField, endField] window includes today (open-ended allowed). */
export const withinWindow = (startField, endField) => ({
  $and: [
    { $or: [{ [startField]: null }, { [startField]: { $lte: new Date() } }] },
    { $or: [{ [endField]: null }, { [endField]: { $gte: startOfToday() } }] },
  ],
});

/** Combines several Mongo filters with AND. */
export const all = (...filters) => ({ $and: filters });

/** Published (or scheduled and due) and active. */
export const livePublishable = () => all(publishedNow(), activeOnly());

/** Active and currently inside its start/end date window. */
export const liveWindowed = (startField, endField) => all(activeOnly(), withinWindow(startField, endField));

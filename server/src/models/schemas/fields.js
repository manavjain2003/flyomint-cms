import { Schema } from 'mongoose';

/** Image reference with alt text (the media library keeps the master record). */
export const imageField = { url: { type: String, trim: true }, alt: { type: String, trim: true } };

export const faqSchema = new Schema(
  { question: { type: String, required: true, trim: true }, answer: { type: String, required: true } },
  { _id: false },
);

export const seoSchema = new Schema(
  {
    metaTitle: { type: String, trim: true, maxlength: 70 },
    metaDescription: { type: String, trim: true, maxlength: 200 },
    keywords: { type: String, trim: true },
    canonicalUrl: { type: String, trim: true },
    ogImage: imageField,
    noindex: { type: Boolean, default: false },
  },
  { _id: false },
);

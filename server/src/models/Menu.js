import { Schema } from 'mongoose';
import { defineModel } from './helpers/defineModel.js';

const itemFields = {
  label: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
  target: { type: String, enum: ['_self', '_blank'], default: '_self' },
  isActive: { type: Boolean, default: true },
};

// Two levels: top-level items can have sub menu items.
const childSchema = new Schema(itemFields, { _id: false });
const itemSchema = new Schema({ ...itemFields, children: [childSchema] }, { _id: false });

export const Menu = defineModel('Menu', {
  name: { type: String, required: true, unique: true, enum: ['main', 'footer'] },
  items: [itemSchema],
});

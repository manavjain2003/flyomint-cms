/** Shared options: timestamps, and `id` instead of `_id` in JSON output. */
export const schemaOptions = {
  timestamps: true,
  toJSON: {
    versionKey: false,
    transform(_doc, ret) {
      ret.id = ret._id.toString();
      delete ret._id;
      return ret;
    },
  },
};

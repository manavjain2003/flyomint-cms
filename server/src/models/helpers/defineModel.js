import mongoose, { Schema } from 'mongoose';
import { schemaOptions } from '../schemaOptions.js';

/**
 * Creates a model from a field definition.
 * @param {string} name
 * @param {object} definition  Mongoose field definitions
 * @param {object} [options]
 * @param {Array}  [options.plugins]  plugin functions, or [plugin, options] pairs
 * @param {Array}  [options.indexes] [fields, options] pairs
 */
export function defineModel(name, definition, { plugins = [], indexes = [] } = {}) {
  const schema = new Schema(definition, schemaOptions);

  plugins.forEach((entry) => {
    const [plugin, pluginOptions] = Array.isArray(entry) ? entry : [entry];
    schema.plugin(plugin, pluginOptions);
  });
  indexes.forEach(([fields, options]) => schema.index(fields, options));

  return mongoose.model(name, schema);
}

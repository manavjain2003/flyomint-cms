import { City } from '../models/City.js';

const isYes = (value) => /^(yes|true|1|y)$/i.test(String(value).trim());
const toType = (value) => (String(value).toLowerCase() === 'international' ? 'international' : 'domestic');

/**
 * Bulk upload definitions. `columns` are the spreadsheet headers, `sample` fills the downloadable
 * template, `prepare` loads lookups once, and `mapRow` converts a row to a document (or throws).
 */
export const cityImporter = {
  columns: ['name', 'airportName', 'code', 'country', 'type', 'popular', 'terminal'],
  sample: [{ name: 'Delhi', airportName: 'Indira Gandhi International Airport', code: 'DEL', country: 'India', type: 'domestic', popular: 'yes', terminal: 'T3' }],
  mapRow: (row) => ({
    name: row.name, airportName: row.airportName, code: row.code, country: row.country,
    type: toType(row.type), isPopular: isYes(row.popular), terminal: row.terminal,
  }),
};

export const routeImporter = {
  columns: ['type', 'from', 'to', 'manualFare', 'duration', 'distance', 'featured'],
  sample: [{ type: 'domestic', from: 'DEL', to: 'BOM', manualFare: 3499, duration: '2h 10m', distance: '1138 km', featured: 'yes' }],
  async prepare() {
    const cities = await City.find();
    return new Map(cities.map((city) => [city.code, city]));
  },
  mapRow(row, citiesByCode) {
    const from = citiesByCode.get(String(row.from).trim().toUpperCase());
    const to = citiesByCode.get(String(row.to).trim().toUpperCase());
    if (!from) throw new Error(`Unknown From city code "${row.from}"`);
    if (!to) throw new Error(`Unknown To city code "${row.to}"`);

    return {
      type: toType(row.type), fromCity: from.id, toCity: to.id,
      manualFare: row.manualFare ? Number(row.manualFare) : undefined,
      duration: row.duration, distance: row.distance, isFeatured: isYes(row.featured),
      status: 'published',
    };
  },
};

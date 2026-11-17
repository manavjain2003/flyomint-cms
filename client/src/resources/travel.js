import { ACTIVE_COLUMN, ACTIVE_FIELD, ACTIVE_FILTER, FARE_MODE_FIELDS, FAQS_FIELD, LOCATION_TYPES, STATUS_COLUMN, STATUS_FILTER, YES_NO, cityLabel } from './shared.js';

const CITY_RELATION = { type: 'relation', collection: 'cities', optionLabel: cityLabel };

function createRouteResource(type) {
  const label = type === 'domestic' ? 'Domestic' : 'International';
  return {
    key: `${type}-routes`, kind: 'collection', api: 'routes', path: `/routes/${type}`,
    title: `${label} flight routes`, itemName: 'route',
    description: 'Choose the From and To city and the route page is created automatically with default content. Edit anything afterwards.',
    baseFilter: { type }, defaultValues: { type, isActive: true, fareMode: 'auto' },
    publish: true, seo: true, duplicable: true, importable: true,
    filters: [{ name: 'isFeatured', label: 'Featured', options: YES_NO }, ACTIVE_FILTER, STATUS_FILTER],
    columns: [
      { key: 'name', label: 'Route' }, { key: 'fromCity.code', label: 'From' }, { key: 'toCity.code', label: 'To' },
      { key: 'isFeatured', label: 'Featured', type: 'boolean' }, ACTIVE_COLUMN, STATUS_COLUMN,
    ],
    fields: [
      { ...CITY_RELATION, name: 'fromCity', label: 'From city', required: true },
      { ...CITY_RELATION, name: 'toCity', label: 'To city', required: true },
      { name: 'name', label: 'Route name', type: 'text', help: 'Example: Delhi to Mumbai Flights. Generated from the cities when empty.' },
      { name: 'slug', label: 'Page URL slug', type: 'slug', help: 'Generated from the route name when empty.' },
      { name: 'heading', label: 'Page heading', type: 'text' },
      { name: 'description', label: 'Page description', type: 'rich' },
      { name: 'bannerImage', label: 'Banner image', type: 'image', folder: 'banners' },
      { type: 'heading', label: 'Fare' },
      ...FARE_MODE_FIELDS,
      { type: 'heading', label: 'Flight information' },
      { name: 'airlines', label: 'Airlines on this route', type: 'relationMulti', collection: 'airlines' },
      { name: 'duration', label: 'Flight duration', type: 'text' },
      { name: 'distance', label: 'Distance', type: 'text' },
      { name: 'flightsPerDay', label: 'Flights per day', type: 'number' },
      { name: 'firstFlight', label: 'First flight timing', type: 'text' },
      { name: 'lastFlight', label: 'Last flight timing', type: 'text' },
      { name: 'bestTimeToBook', label: 'Best time to book tips', type: 'rich' },
      {
        name: 'popularFlights', label: 'Popular flights table', type: 'repeater', itemName: 'flight', itemLabel: 'flightNumber',
        fields: [
          { name: 'airline', label: 'Airline', type: 'text' }, { name: 'flightNumber', label: 'Flight number', type: 'text' },
          { name: 'departure', label: 'Departure', type: 'text' }, { name: 'arrival', label: 'Arrival', type: 'text' },
          { name: 'duration', label: 'Duration', type: 'text' }, { name: 'fare', label: 'Fare', type: 'number' },
        ],
      },
      FAQS_FIELD,
      { name: 'seoText', label: 'SEO text content (bottom of the page)', type: 'rich' },
      { name: 'isFeatured', label: 'Featured / popular route', type: 'checkbox' },
      ACTIVE_FIELD,
    ],
  };
}

export const domesticRoutes = createRouteResource('domestic');
export const internationalRoutes = createRouteResource('international');

export const destinations = {
  key: 'destinations', kind: 'collection', api: 'destinations', path: '/destinations',
  title: 'Destination pages', itemName: 'destination', slugSource: 'name',
  description: 'A page for a country or city, for example "Flights to Dubai" or "Flights to Goa".',
  defaultValues: { isActive: true, kind: 'city' }, publish: true, seo: true, duplicable: true,
  filters: [{ name: 'kind', label: 'Type', options: ['city', 'country'] }, ACTIVE_FILTER, STATUS_FILTER],
  columns: [{ key: 'name', label: 'Destination' }, { key: 'kind', label: 'Type', type: 'badge' }, { key: 'isPopular', label: 'Popular', type: 'boolean' }, ACTIVE_COLUMN, STATUS_COLUMN],
  fields: [
    { name: 'name', label: 'Destination name', type: 'text', required: true },
    { name: 'kind', label: 'Type', type: 'select', options: ['city', 'country'] },
    { name: 'slug', label: 'Page URL slug', type: 'slug', required: true },
    { name: 'heading', label: 'Heading', type: 'text' },
    { name: 'description', label: 'Description', type: 'rich' },
    { name: 'bannerImage', label: 'Banner image', type: 'image', folder: 'banners' },
    {
      name: 'cheapestFares', label: 'Cheapest fare from major cities', type: 'repeater', itemName: 'city fare',
      help: 'Leave empty to use the cheapest fares of the popular routes below.',
      fields: [{ ...CITY_RELATION, name: 'fromCity', label: 'From city' }, { name: 'fare', label: 'Fare', type: 'number' }],
    },
    { name: 'popularRoutes', label: 'Popular routes to this destination', type: 'relationMulti', collection: 'routes' },
    { name: 'airlines', label: 'Airlines flying to this destination', type: 'relationMulti', collection: 'airlines' },
    { name: 'bestTimeToVisit', label: 'Best time to visit', type: 'rich' },
    { name: 'travelTips', label: 'Travel tips', type: 'rich' },
    FAQS_FIELD,
    { name: 'isPopular', label: 'Popular destination (home page and footer)', type: 'checkbox' },
    ACTIVE_FIELD,
  ],
};

export const airlines = {
  key: 'airlines', kind: 'collection', api: 'airlines', path: '/airlines',
  title: 'Airlines', itemName: 'airline', slugSource: 'name', defaultValues: { isActive: true, type: 'domestic' },
  seo: true, duplicable: true,
  filters: [{ name: 'type', label: 'Type', options: LOCATION_TYPES }, ACTIVE_FILTER],
  columns: [{ key: 'logo', label: 'Logo', type: 'image' }, { key: 'name', label: 'Airline' }, { key: 'code', label: 'Code' }, { key: 'type', label: 'Type', type: 'badge' }, ACTIVE_COLUMN],
  fields: [
    { name: 'name', label: 'Airline name', type: 'text', required: true },
    { name: 'code', label: 'Airline code', type: 'text', required: true },
    { name: 'slug', label: 'Page URL slug', type: 'slug', required: true },
    { name: 'logo', label: 'Logo', type: 'image', folder: 'airlines' },
    { name: 'type', label: 'Domestic or international airline', type: 'select', options: LOCATION_TYPES },
    { name: 'about', label: 'About the airline', type: 'rich' },
    { type: 'heading', label: 'Baggage information' },
    { name: 'baggage.cabin', label: 'Cabin baggage', type: 'textarea' },
    { name: 'baggage.checkin', label: 'Check-in baggage', type: 'textarea' },
    { name: 'webCheckin', label: 'Web check-in information', type: 'rich' },
    { name: 'cancellationRefund', label: 'Cancellation and refund information', type: 'rich' },
    { type: 'heading', label: 'Customer care' },
    { name: 'customerCare.phone', label: 'Phone', type: 'text' },
    { name: 'customerCare.email', label: 'Email', type: 'email' },
    { name: 'customerCare.website', label: 'Website', type: 'url' },
    { name: 'popularRoutes', label: 'Popular routes of the airline', type: 'relationMulti', collection: 'routes' },
    { name: 'offers', label: 'Airline offers', type: 'relationMulti', collection: 'offers', optionLabel: (offer) => offer.title },
    FAQS_FIELD,
    { name: 'isPopular', label: 'Popular airline (home page and footer)', type: 'checkbox' },
    ACTIVE_FIELD,
  ],
};

export const cities = {
  key: 'cities', kind: 'collection', api: 'cities', path: '/cities',
  title: 'Airports / cities', itemName: 'city', defaultValues: { isActive: true, type: 'domestic' }, importable: true,
  filters: [{ name: 'type', label: 'Type', options: LOCATION_TYPES }, { name: 'isPopular', label: 'Popular', options: YES_NO }],
  columns: [{ key: 'name', label: 'City' }, { key: 'airportName', label: 'Airport' }, { key: 'code', label: 'IATA' }, { key: 'country', label: 'Country' }, { key: 'type', label: 'Type', type: 'badge' }, { key: 'isPopular', label: 'Popular', type: 'boolean' }],
  fields: [
    { name: 'name', label: 'City name', type: 'text', required: true },
    { name: 'airportName', label: 'Airport name', type: 'text' },
    { name: 'code', label: 'Airport code (IATA, 3 letters)', type: 'text', required: true },
    { name: 'country', label: 'Country', type: 'text', required: true },
    { name: 'type', label: 'Domestic or international', type: 'select', options: LOCATION_TYPES },
    { name: 'terminal', label: 'Airport terminal', type: 'text' },
    { name: 'address', label: 'Airport address', type: 'textarea' },
    { name: 'image', label: 'City image', type: 'image', folder: 'general' },
    { name: 'description', label: 'Short description', type: 'textarea' },
    { name: 'isPopular', label: 'Popular city', type: 'checkbox' },
    ACTIVE_FIELD,
  ],
};

export const deals = {
  key: 'deals', kind: 'collection', api: 'deals', path: '/deals',
  title: 'Flight deals', itemName: 'deal', defaultValues: { isActive: true, fareMode: 'auto', showOn: ['home'], section: 'today' }, duplicable: true,
  description: "Today's, last minute, weekend, cheapest-from-a-city and airline-wise deals.",
  filters: [{ name: 'section', label: 'Section', options: ['today', 'last-minute', 'weekend', 'city-cheapest', 'airline-wise'] }, ACTIVE_FILTER],
  columns: [{ key: 'title', label: 'Deal' }, { key: 'section', label: 'Section', type: 'badge' }, { key: 'route.name', label: 'Route' }, { key: 'startDate', label: 'Starts', type: 'date' }, { key: 'endDate', label: 'Ends', type: 'date' }, ACTIVE_COLUMN],
  fields: [
    { name: 'section', label: 'Deal section', type: 'select', options: [{ value: 'today', label: "Today's deals" }, { value: 'last-minute', label: 'Last minute deals' }, { value: 'weekend', label: 'Weekend deals' }, { value: 'city-cheapest', label: 'Cheapest flights from a city' }, { value: 'airline-wise', label: 'Airline wise deals' }] },
    { name: 'title', label: 'Deal title', type: 'text', required: true },
    { name: 'route', label: 'Route', type: 'relation', collection: 'routes' },
    { ...CITY_RELATION, name: 'fromCity', label: 'From city (for "cheapest flights from a city")' },
    { name: 'airline', label: 'Airline (for airline wise deals)', type: 'relation', collection: 'airlines' },
    ...FARE_MODE_FIELDS,
    { name: 'link', label: 'Link', type: 'text', help: 'Leave empty to link to the route page.' },
    { name: 'startDate', label: 'Start date', type: 'date' },
    { name: 'endDate', label: 'End date', type: 'date' },
    { name: 'showOn', label: 'Show the deal on', type: 'checkboxGroup', options: [{ value: 'home', label: 'Home page' }, { value: 'route', label: 'Route page' }, { value: 'offers', label: 'Offers page' }] },
    { name: 'order', label: 'Display order', type: 'number' },
    ACTIVE_FIELD,
  ],
};

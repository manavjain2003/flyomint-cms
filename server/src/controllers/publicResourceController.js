import { buildSearchFilter, pickFilters, publicFilterFor } from '../resources/publicQuery.js';
import { toDetail, toListItem } from '../services/publicSerializer.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { all } from '../utils/publicFilters.js';

const DEFAULT_PAGE_SIZE = 50;
const MAX_PAGE_SIZE = 200;

/** Read-only handlers for the live documents of one registry resource. */
export function createPublicResourceController(resource) {
  const { Model } = resource;
  const config = resource.public;

  const withPopulate = (query) => (config.populate ? query.populate(config.populate) : query);

  return {
    list: asyncHandler(async (req, res) => {
      const page = Math.max(Number(req.query.page) || 1, 1);
      const limit = Math.min(Number(req.query.limit) || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE);
      const filter = all(
        publicFilterFor(resource),
        pickFilters(config.queryFilters, req.query),
        buildSearchFilter(config.searchFields, req.query.q),
      );
      const sort = config.sorts?.[req.query.sort] ?? config.sort ?? '-createdAt';

      const query = Model.find(filter).sort(sort).skip((page - 1) * limit).limit(limit);
      if (config.listSelect) query.select(config.listSelect);

      const [docs, total] = await Promise.all([withPopulate(query), Model.countDocuments(filter)]);
      const items = config.listMapper ? await config.listMapper(docs) : docs.map(toListItem);
      res.json({ items, total, page, pages: Math.ceil(total / limit) });
    }),

    getBySlug: asyncHandler(async (req, res) => {
      const doc = await withPopulate(Model.findOne(all(publicFilterFor(resource), { slug: req.params.slug })));
      if (!doc) throw new ApiError(404, 'Not found');
      res.json(await toDetail(resource, doc));
    }),
  };
}

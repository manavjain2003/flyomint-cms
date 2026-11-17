import { ApiError } from '../utils/ApiError.js';

export const notFound = (_req, _res, next) => next(new ApiError(404, 'Route not found'));

// Express recognises error middleware by its four-argument signature.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  const respond = (status, message) => res.status(status).json({ error: message });

  if (err instanceof ApiError) return respond(err.status, err.message);
  if (err.name === 'ValidationError') {
    return respond(400, Object.values(err.errors).map((error) => error.message).join(', '));
  }
  if (err.name === 'CastError') return respond(404, 'Resource not found');
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern ?? {})[0] ?? 'value';
    return respond(409, `This ${field} is already in use`);
  }
  if (err.name === 'MulterError') return respond(400, err.message);

  console.error(err);
  return respond(500, 'Something went wrong on our side');
}

const AppError = require('../utils/AppError');
const { env } = require('../config/env');
function notFound(req, _res, next) { next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404, 'NOT_FOUND')); }
function errorHandler(error, req, res, _next) {
  const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
  if (statusCode >= 500) req.log.error({ err: error, requestId: req.id }, 'Unhandled request error');
  res.status(statusCode).json({ error: { code: error.code || 'INTERNAL_ERROR', message: error.isOperational ? error.message : 'Une erreur interne est survenue', requestId: req.id, ...(env.NODE_ENV === 'development' && !error.isOperational ? { details: error.message } : {}) } });
}
module.exports = { notFound, errorHandler };

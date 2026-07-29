const AppError = require('../utils/AppError');
module.exports = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) return next(new AppError(result.error.issues[0].message, 400, 'VALIDATION_ERROR'));
  
  // Express 5 rend req.query en lecture seule (getter/proxy).
  // On stocke les données validées et coercées dans req.validated[source].
  // Pour 'body', on remplace aussi req.body car il reste mutable.
  if (!req.validated) req.validated = {};
  req.validated[source] = result.data;
  if (source === 'body') req.body = result.data;
  
  return next();
};

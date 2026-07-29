const AppError = require('../utils/AppError');
module.exports = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) return next(new AppError(result.error.issues[0].message, 400, 'VALIDATION_ERROR'));
  req[source] = result.data; return next();
};

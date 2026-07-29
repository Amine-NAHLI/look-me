const AppError = require('../utils/AppError');
module.exports = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source]);
  if (!result.success) return next(new AppError(result.error.issues[0].message, 400, 'VALIDATION_ERROR'));
  
  // Dans Express 5, req.query est un getter et ne peut pas être réassigné avec `req.query = ...`
  // Nous devons donc vider l'objet existant et lui assigner les nouvelles propriétés (avec coercition Zod)
  for (const key of Object.keys(req[source])) {
    delete req[source][key];
  }
  Object.assign(req[source], result.data);
  
  return next();
};

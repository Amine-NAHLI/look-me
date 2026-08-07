const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');
const { env } = require('../config/env');
const AppError = require('../utils/AppError');
const asyncHandler = require('./asyncHandler');

const readAccessToken = (req) => req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
const protect = asyncHandler(async (req, _res, next) => {
  const token = readAccessToken(req); if (!token) throw new AppError('Authentification requise', 401, 'AUTH_REQUIRED');
  let payload;
  try { payload = jwt.verify(token, env.JWT_ACCESS_SECRET, { issuer: 'lookme-api', audience: 'lookme-client' }); }
  catch { throw new AppError('Session invalide', 401, 'INVALID_SESSION'); }
  const user = await prisma.user.findUnique({ where: { id: payload.sub } });
  if (!user || !user.isActive) throw new AppError('Session invalide', 401, 'INVALID_SESSION');
  req.user = user; next();
});
const optionalProtect = asyncHandler(async (req, _res, next) => {
  const token = readAccessToken(req); if (!token) return next();
  try { const payload = jwt.verify(token, env.JWT_ACCESS_SECRET, { issuer: 'lookme-api', audience: 'lookme-client' }); req.user = await prisma.user.findUnique({ where: { id: payload.sub } }); } catch (_error) { /* guest remains guest */ }
  next();
});
const admin = (req, _res, next) => { if (req.user?.role === 'admin') return next(); return next(new AppError('Privilèges administrateur requis', 403, 'FORBIDDEN')); };
module.exports = { protect, optionalProtect, admin };

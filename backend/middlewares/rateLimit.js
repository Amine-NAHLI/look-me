const rateLimit = require('express-rate-limit');
const { env } = require('../config/env');
const apiLimiter = rateLimit({ windowMs: env.RATE_LIMIT_WINDOW_MS, limit: env.RATE_LIMIT_MAX, standardHeaders: 'draft-8', legacyHeaders: false, message: { error: { code: 'RATE_LIMITED', message: 'Trop de requêtes, réessayez plus tard.' } } });
const authLimiter = rateLimit({ windowMs: env.RATE_LIMIT_WINDOW_MS, limit: env.AUTH_RATE_LIMIT_MAX, standardHeaders: 'draft-8', legacyHeaders: false, skipSuccessfulRequests: true, message: { error: { code: 'AUTH_RATE_LIMITED', message: 'Trop de tentatives, réessayez plus tard.' } } });
module.exports = { apiLimiter, authLimiter };

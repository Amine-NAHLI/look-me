const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const pinoHttp = require('pino-http');
const path = require('path');
const crypto = require('crypto');
const { prisma } = require('./config/db');
const { env } = require('./config/env');
const logger = require('./config/logger');
const AppError = require('./utils/AppError');
const { apiLimiter } = require('./middlewares/rateLimit');
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', env.TRUST_PROXY);
  app.use(pinoHttp({ logger, genReqId: (req) => req.headers['x-request-id'] || crypto.randomUUID() }));
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({
    origin(origin, callback) {
      if (!origin || env.CORS_ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new AppError('Origine non autorisée', 403, 'CORS_ORIGIN_DENIED'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  }));
  app.use(compression());
  app.use(express.json({ limit: env.JSON_BODY_LIMIT }));
  app.use(cookieParser());
  app.use(apiLimiter);

  app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
  app.get('/ready', async (_req, res) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      res.status(200).json({ status: 'ready' });
    } catch {
      res.status(503).json({ status: 'not_ready' });
    }
  });
  app.use('/uploads', express.static(path.resolve(env.UPLOAD_DIRECTORY), { maxAge: '7d', immutable: true }));
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/categories', require('./routes/categoryRoutes'));
  app.use('/api/products', require('./routes/productRoutes'));
  app.use('/api/orders', require('./routes/orderRoutes'));
  app.use('/api/uploads', require('./routes/uploadRoutes'));
  app.use('/api/ai', require('./routes/aiRoutes'));
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

module.exports = { createApp };

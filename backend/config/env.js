const path = require('path');
const { z } = require('zod');

const boolean = z.enum(['true', 'false']).transform((value) => value === 'true');
const raw = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  DATABASE_URL: z.string().url(),
  JWT_ACCESS_SECRET: z.string().min(32).refine((value) => !/generate|replace|changeme|secretpassword/i.test(value), 'must be a generated secret'),
  JWT_REFRESH_SECRET: z.string().min(32).refine((value) => !/generate|replace|changeme|secretpassword/i.test(value), 'must be a generated secret'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
  CLIENT_URL: z.string().url(),
  CORS_ALLOWED_ORIGINS: z.string().min(1),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']).default('info'),
  MAX_UPLOAD_SIZE: z.coerce.number().int().min(1024).max(10 * 1024 * 1024).default(5 * 1024 * 1024),
  UPLOAD_PROVIDER: z.enum(['local', 'cloudinary']).default('local'),
  UPLOAD_DIRECTORY: z.string().default(path.join(__dirname, '..', 'uploads')),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(200),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(10),
  COOKIE_DOMAIN: z.string().optional(),
  TRUST_PROXY: boolean.default(false),
  JSON_BODY_LIMIT: z.string().default('100kb'),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().optional(),
}).passthrough();

const parsed = raw.safeParse(process.env);
if (!parsed.success) {
  const details = parsed.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`).join('; ');
  throw new Error(`Invalid environment configuration: ${details}`);
}

if (Boolean(parsed.data.CLOUDINARY_CLOUD_NAME) !== Boolean(parsed.data.CLOUDINARY_API_KEY) || Boolean(parsed.data.CLOUDINARY_CLOUD_NAME) !== Boolean(parsed.data.CLOUDINARY_API_SECRET)) {
  throw new Error('Invalid environment configuration: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET must be configured together');
}
if (Boolean(parsed.data.SMTP_HOST) !== Boolean(parsed.data.SMTP_USER) || Boolean(parsed.data.SMTP_HOST) !== Boolean(parsed.data.SMTP_PASS)) {
  throw new Error('Invalid environment configuration: SMTP_HOST, SMTP_USER and SMTP_PASS must be configured together');
}

const env = { ...parsed.data, CORS_ALLOWED_ORIGINS: parsed.data.CORS_ALLOWED_ORIGINS.split(',').map((origin) => origin.trim()) };
module.exports = { env };

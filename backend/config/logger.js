const pino = require('pino');
const { env } = require('./env');
module.exports = pino({ level: env.LOG_LEVEL, redact: ['req.headers.authorization', 'req.headers.cookie', 'password', 'token', 'refreshToken', 'mailOptions', '*.password', '*.token'] });

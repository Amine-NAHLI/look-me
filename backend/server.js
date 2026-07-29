require('dotenv').config();

const { createApp } = require('./app');
const { env } = require('./config/env');
const { connectDatabase, disconnectDatabase } = require('./config/db');
const logger = require('./config/logger');

async function start() {
  await connectDatabase();
  const app = createApp();
  const server = app.listen(env.PORT, () => logger.info({ port: env.PORT }, 'API listening'));

  const shutdown = async (signal) => {
    logger.info({ signal }, 'Graceful shutdown started');
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

start().catch((error) => {
  logger.fatal({ err: error }, 'Unable to start API');
  process.exit(1);
});

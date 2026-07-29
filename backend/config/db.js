const { PrismaClient } = require('@prisma/client');
const logger = require('./logger');

const prisma = new PrismaClient();

async function connectDatabase() {
  await prisma.$connect();
  logger.info('Neon PostgreSQL connected via Prisma');
}

async function disconnectDatabase() {
  await prisma.$disconnect();
}

module.exports = { connectDatabase, disconnectDatabase, prisma };

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');
const { env } = require('../config/env');
const AppError = require('../utils/AppError');

const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');

const accessToken = (user) => jwt.sign({ role: user.role }, env.JWT_ACCESS_SECRET, { subject: user.id, expiresIn: env.JWT_ACCESS_EXPIRES_IN, issuer: 'lookme-api', audience: 'lookme-client' });

const refreshToken = (user, sessionId) => jwt.sign({ sid: sessionId }, env.JWT_REFRESH_SECRET, { subject: user.id, expiresIn: env.JWT_REFRESH_EXPIRES_IN, issuer: 'lookme-api', audience: 'lookme-client' });

function durationMilliseconds(value) {
  const match = /^(\d+)([mhd])$/.exec(value);
  if (!match) throw new Error('JWT_REFRESH_EXPIRES_IN must use m, h or d units');
  return Number(match[1]) * ({ m: 60_000, h: 3_600_000, d: 86_400_000 }[match[2]]);
}

async function createSession(user, metadata = {}) {
  const expiresAt = new Date(Date.now() + durationMilliseconds(env.JWT_REFRESH_EXPIRES_IN));
  const tokenHash = crypto.randomBytes(32).toString('hex');
  
  const session = await prisma.refreshSession.create({
    data: {
      userId: user.id,
      tokenHash,
      expiresAt,
      userAgent: metadata.userAgent,
      ip: metadata.ip
    }
  });
  
  const refresh = refreshToken(user, session.id); 
  await prisma.refreshSession.update({
    where: { id: session.id },
    data: { tokenHash: hash(refresh) }
  });
  
  return { accessToken: accessToken(user), refreshToken: refresh, expiresAt };
}

async function rotateSession(token, metadata) {
  let payload; 
  try { 
    payload = jwt.verify(token, env.JWT_REFRESH_SECRET, { issuer: 'lookme-api', audience: 'lookme-client' }); 
  } catch { 
    throw new AppError('Session expirée', 401, 'INVALID_REFRESH_TOKEN'); 
  }
  
  const session = await prisma.refreshSession.findUnique({ where: { id: payload.sid } }); 
  if (!session || session.revokedAt || session.expiresAt < new Date() || session.tokenHash !== hash(token)) {
    throw new AppError('Session expirée', 401, 'INVALID_REFRESH_TOKEN');
  }
  
  await prisma.refreshSession.update({ where: { id: payload.sid }, data: { revokedAt: new Date() } }); 
  const user = await prisma.user.findUnique({ where: { id: payload.sub } }); 
  
  if (!user || !user.isActive) throw new AppError('Session invalide', 401, 'INVALID_REFRESH_TOKEN');
  
  return createSession(user, metadata);
}

async function revokeSession(token) { 
  try { 
    const payload = jwt.verify(token, env.JWT_REFRESH_SECRET, { issuer: 'lookme-api', audience: 'lookme-client' }); 
    await prisma.refreshSession.update({ where: { id: payload.sid }, data: { revokedAt: new Date() } }); 
  } catch { /* logout stays idempotent */ } 
}

async function revokeUserSessions(userId) { 
  await prisma.refreshSession.updateMany({ 
    where: { userId, revokedAt: null }, 
    data: { revokedAt: new Date() } 
  }); 
}

module.exports = { createSession, rotateSession, revokeSession, revokeUserSessions, accessToken };

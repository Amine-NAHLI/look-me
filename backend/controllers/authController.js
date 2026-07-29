const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');
const { createSession, rotateSession, revokeSession, revokeUserSessions } = require('../services/authService');
const { sendPasswordResetEmail } = require('../services/emailService');

const cookieOptions = (expiresAt) => ({ httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', expires: expiresAt, path: '/api/auth', ...(process.env.COOKIE_DOMAIN ? { domain: process.env.COOKIE_DOMAIN } : {}) });
const publicUser = (user) => ({ id: user.id, firstName: user.firstName, email: user.email, phone: user.phone, role: user.role });
const metadata = (req) => ({ userAgent: req.get('user-agent'), ip: req.ip });

async function respondWithSession(res, user, req, status = 200) { 
  const session = await createSession(user, metadata(req)); 
  res.cookie('lookme_refresh', session.refreshToken, cookieOptions(session.expiresAt)); 
  return res.status(status).json({ user: publicUser(user), accessToken: session.accessToken }); 
}

exports.registerUser = async (req, res) => { 
  const exists = await prisma.user.findUnique({ where: { email: req.body.email } }); 
  if (exists) throw new AppError('Impossible de créer ce compte', 400, 'REGISTRATION_FAILED'); 
  
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const user = await prisma.user.create({ 
    data: {
      ...req.body,
      password: hashedPassword,
      passwordChangedAt: new Date()
    } 
  }); 
  return respondWithSession(res, user, req, 201); 
};

exports.loginUser = async (req, res) => { 
  const user = await prisma.user.findUnique({ where: { email: req.body.email } }); 
  if (!user || !user.isActive || !(await bcrypt.compare(req.body.password, user.password))) {
    throw new AppError('Email ou mot de passe incorrect', 401, 'INVALID_CREDENTIALS'); 
  }
  return respondWithSession(res, user, req); 
};

exports.refresh = async (req, res) => { 
  const current = req.cookies.lookme_refresh; 
  if (!current) throw new AppError('Session expirée', 401, 'INVALID_REFRESH_TOKEN'); 
  const session = await rotateSession(current, metadata(req)); 
  res.cookie('lookme_refresh', session.refreshToken, cookieOptions(session.expiresAt)); 
  res.json({ accessToken: session.accessToken }); 
};

exports.logout = async (req, res) => { 
  await revokeSession(req.cookies.lookme_refresh); 
  res.clearCookie('lookme_refresh', { path: '/api/auth' }); 
  res.status(204).end(); 
};

exports.getUserProfile = async (req, res) => res.json({ user: publicUser(req.user) });

exports.updateUserProfile = async (req, res) => { 
  const user = await prisma.user.update({
    where: { id: req.user.id },
    data: {
      firstName: req.body.firstName,
      phone: req.body.phone
    }
  });
  res.json({ user: publicUser(user) }); 
};

exports.updateUserPassword = async (req, res) => { 
  const user = await prisma.user.findUnique({ where: { id: req.user.id } }); 
  if (!(await bcrypt.compare(req.body.currentPassword, user.password))) {
    throw new AppError('Mot de passe actuel incorrect', 400, 'INVALID_PASSWORD'); 
  }
  
  const hashedPassword = await bcrypt.hash(req.body.newPassword, 12);
  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedPassword, passwordChangedAt: new Date() }
  });
  
  await revokeUserSessions(updatedUser.id); 
  return respondWithSession(res, updatedUser, req); 
};

exports.forgotPassword = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { email: req.body.email } });
  if (!user || !user.isActive) {
    // Return 200 even if user doesn't exist for security reasons
    return res.status(200).json({ message: 'Si l\'email existe, un lien de réinitialisation a été envoyé.' });
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

  await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPasswordToken: tokenHash,
      resetPasswordExpires: new Date(Date.now() + 60 * 60 * 1000) // 1 heure
    }
  });

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
  await sendPasswordResetEmail(user, resetUrl);

  res.status(200).json({ message: 'Si l\'email existe, un lien de réinitialisation a été envoyé.' });
};

exports.resetPassword = async (req, res) => {
  const tokenHash = crypto.createHash('sha256').update(req.body.token).digest('hex');

  const user = await prisma.user.findUnique({ where: { resetPasswordToken: tokenHash } });
  if (!user || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
    throw new AppError('Le lien de réinitialisation est invalide ou a expiré', 400, 'INVALID_TOKEN');
  }

  const hashedPassword = await bcrypt.hash(req.body.newPassword, 12);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { 
      password: hashedPassword, 
      passwordChangedAt: new Date(),
      resetPasswordToken: null,
      resetPasswordExpires: null
    }
  });

  await revokeUserSessions(updatedUser.id);
  return respondWithSession(res, updatedUser, req);
};

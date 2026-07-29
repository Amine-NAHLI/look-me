const nodemailer = require('nodemailer');
const { env } = require('../config/env');
const logger = require('../config/logger');

const createTransporter = () => {
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    logger.warn('SMTP configuration is missing. Emails will be logged instead of sent.');
    return null;
  }
  return nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS,
    },
  });
};

const transporter = createTransporter();

const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: env.SMTP_FROM || '"Look-Me Support" <support@look-me.local>',
    to,
    subject,
    html,
  };

  if (!transporter) {
    logger.info({ mailOptions }, 'Mock Email Sent (SMTP not configured)');
    return;
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info({ messageId: info.messageId }, 'Email sent successfully');
  } catch (error) {
    logger.error({ err: error }, 'Error sending email');
    throw error;
  }
};

const sendPasswordResetEmail = async (user, resetUrl) => {
  const subject = 'Réinitialisation de votre mot de passe - Look-Me';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2>Bonjour ${user.firstName},</h2>
      <p>Vous avez demandé la réinitialisation de votre mot de passe.</p>
      <p>Veuillez cliquer sur le bouton ci-dessous pour choisir un nouveau mot de passe. Ce lien est valide pendant 1 heure.</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Réinitialiser mon mot de passe</a>
      </div>
      <p>Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
      <p style="word-break: break-all; color: #666;">${resetUrl}</p>
      <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet e-mail en toute sécurité.</p>
      <br>
      <p>L'équipe Look-Me</p>
    </div>
  `;
  await sendEmail({ to: user.email, subject, html });
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
};

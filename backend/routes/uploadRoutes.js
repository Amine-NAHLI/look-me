const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const sharp = require('sharp');
const rateLimit = require('express-rate-limit');
const { env } = require('../config/env');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middlewares/asyncHandler');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();
fs.mkdirSync(path.resolve(env.UPLOAD_DIRECTORY), { recursive: true });
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: env.MAX_UPLOAD_SIZE, files: 1, fields: 10, fieldSize: 10_000 }, fileFilter: (_req, file, cb) => cb(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) });
const uploadLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false });
router.post('/', protect, admin, uploadLimiter, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('Image JPEG, PNG ou WebP requise', 400, 'INVALID_FILE');
  let metadata; try { metadata = await sharp(req.file.buffer, { limitInputPixels: 25_000_000 }).metadata(); } catch { throw new AppError('Image invalide', 400, 'INVALID_FILE'); }
  if (!['jpeg', 'png', 'webp'].includes(metadata.format)) throw new AppError('Format d’image invalide', 400, 'INVALID_FILE');
  const filename = `${crypto.randomUUID()}.webp`; const target = path.resolve(env.UPLOAD_DIRECTORY, filename);
  await sharp(req.file.buffer, { limitInputPixels: 25_000_000 }).rotate().resize({ width: 1600, height: 2000, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(target);
  res.status(201).json({ imageUrl: `/uploads/${filename}`, width: metadata.width, height: metadata.height });
}));
module.exports = router;

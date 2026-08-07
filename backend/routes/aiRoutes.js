const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const rateLimit = require('express-rate-limit');
const { env } = require('../config/env');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middlewares/asyncHandler');
const { protect, admin } = require('../middlewares/authMiddleware');
const { generateImage } = require('../services/aiService');

const router = express.Router();

const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { fileSize: env.MAX_UPLOAD_SIZE, files: 1 }, 
  fileFilter: (_req, file, cb) => cb(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) 
});

// Limite plus stricte pour l'IA pour éviter d'exploser le quota
const aiLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false });

router.post('/process-image', protect, admin, aiLimiter, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('Image requise', 400, 'INVALID_FILE');
  
  const presetKey = req.body.preset || 'studio';
  
  try {
    // Redimensionner et optimiser l'image pour FLUX
    // Flux travaille généralement très bien avec des images autour de 1024x1024
    const processedBuffer = await sharp(req.file.buffer)
      .resize({ width: 1024, height: 1024, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Convertir le Buffer en un simple Array d'entiers pour le JSON body
    const imageArray = Array.from(processedBuffer);

    // Appeler Cloudflare AI 2 fois en parallèle avec des seeds différentes
    // On génère des seeds aléatoires (de 1 à 100000) pour forcer 2 images différentes
    const seed1 = Math.floor(Math.random() * 100000) + 1;
    const seed2 = Math.floor(Math.random() * 100000) + 1;

    const [base64Image1, base64Image2] = await Promise.all([
      generateImage(imageArray, presetKey, seed1),
      generateImage(imageArray, presetKey, seed2)
    ]);

    // Renvoyer les images en JSON (base64)
    res.json({
      images: [
        `data:image/jpeg;base64,${base64Image1}`,
        `data:image/jpeg;base64,${base64Image2}`
      ]
    });
    
  } catch (err) {
    console.error('Error processing AI image:', err);
    throw new AppError(err.message || 'Erreur lors du traitement de l\'image par l\'IA', err.statusCode || 500, 'AI_ERROR');
  }
}));

module.exports = router;

const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const path = require('path');
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
    // Redimensionner et optimiser l'image en haute qualité pour l'E-commerce
    const processedBuffer = await sharp(req.file.buffer)
      .resize({ width: 1500, height: 1500, fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 90 })
      .toBuffer();

    // Convertir le Buffer en un simple Array d'entiers pour le JSON body
    const imageArray = Array.from(processedBuffer);

    // On génère 1 seule image (détourage parfait sur fond blanc)
    const base64Image = await generateImage(imageArray);
    
    // Convertir l'image base64 en buffer et la sauvegarder temporairement pour Cloudinary
    const buffer = Buffer.from(base64Image, 'base64');
    
    // Sauvegarder dans le dossier uploads
    const filename = `ai-${Date.now()}.jpg`;
    const tempPath = path.join(__dirname, '..', 'uploads', filename);
    await fs.promises.writeFile(tempPath, buffer);
    
    // Renvoyer les informations au frontend
    res.json({
      success: true,
      images: [
        {
          url: `/uploads/${filename}`,
          style: 'Fond blanc',
          tempPath: tempPath
        }
      ]
    });
    
  } catch (err) {
    console.error('Error processing AI image:', err);
    throw new AppError(err.message || 'Erreur lors du traitement de l\'image par l\'IA', err.statusCode || 500, 'AI_ERROR');
  }
}));

module.exports = router;

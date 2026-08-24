const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const rateLimit = require('express-rate-limit');
const stream = require('stream');
const cloudinary = require('cloudinary').v2;
const { env } = require('../config/env');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middlewares/asyncHandler');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();

if (env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
  });
}

const upload = multer({ 
  storage: multer.memoryStorage(), 
  limits: { fileSize: env.MAX_UPLOAD_SIZE, files: 1, fields: 10, fieldSize: 10_000 }, 
  fileFilter: (_req, file, cb) => cb(null, ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) 
});

const uploadLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-8', legacyHeaders: false });

const uploadToCloudinary = (buffer, filename) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'look-me-products', format: 'webp', public_id: filename },
      (error, result) => {
        if (error) return reject(new AppError('Erreur Cloudinary', 500, 'UPLOAD_ERROR'));
        resolve(result);
      }
    );
    const readable = new stream.PassThrough();
    readable.end(buffer);
    readable.pipe(uploadStream);
  });
};

router.post('/', protect, admin, uploadLimiter, upload.single('image'), asyncHandler(async (req, res) => {
  if (!req.file) throw new AppError('Image JPEG, PNG ou WebP requise', 400, 'INVALID_FILE');
  
  if (env.UPLOAD_PROVIDER !== 'local' && !env.CLOUDINARY_CLOUD_NAME) {
    throw new AppError('Le stockage Cloudinary n\'est pas configuré', 500, 'CONFIG_ERROR');
  }
  
  let metadata; 
  try { 
    metadata = await sharp(req.file.buffer).metadata(); 
  } catch { 
    throw new AppError('Image invalide', 400, 'INVALID_FILE'); 
  }
  
  if (!['jpeg', 'png', 'webp'].includes(metadata.format)) throw new AppError('Format d’image invalide', 400, 'INVALID_FILE');
  
  const processedBuffer = await sharp(req.file.buffer)
    .rotate()
    .resize({ width: 1600, height: 2000, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();

  const filename = `product-${Date.now()}`;
  let imageUrl;
  let width;
  let height;

  if (env.CLOUDINARY_CLOUD_NAME && env.UPLOAD_PROVIDER !== 'local') {
    const result = await uploadToCloudinary(processedBuffer, filename);
    imageUrl = result.secure_url;
    width = result.width;
    height = result.height;
  } else {
    // Local upload
    const fs = require('fs');
    const path = require('path');
    
    // Ensure upload directory exists
    if (!fs.existsSync(env.UPLOAD_DIRECTORY)) {
      fs.mkdirSync(env.UPLOAD_DIRECTORY, { recursive: true });
    }
    
    const fileExt = '.webp';
    const filePath = path.join(env.UPLOAD_DIRECTORY, filename + fileExt);
    await fs.promises.writeFile(filePath, processedBuffer);
    
    // Calculate final image dimensions
    const finalMetadata = await sharp(processedBuffer).metadata();
    width = finalMetadata.width;
    height = finalMetadata.height;
    
    imageUrl = `${env.CLIENT_URL.replace(/5173$/, '5000')}/uploads/${filename}${fileExt}`;
  }
  
  res.status(201).json({ imageUrl, width, height });
}));

module.exports = router;

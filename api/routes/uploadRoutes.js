const express = require('express');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const fs = require('fs');
const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  // Store uploaded files temporarily (sharp will process and save final file)
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Temp filename
    cb(null, 'temp-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Format non autorisé. JPG, PNG ou WebP uniquement.'));
    }
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'Aucun fichier uploadé' });
  }

  try {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const outputPath = path.join(uploadDir, `${unique}.webp`);

    // Process image with sharp
    await sharp(req.file.path)
      .resize(800, null, { withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);

    // Delete temp file
    fs.unlinkSync(req.file.path);

    res.json({ imageUrl: `/uploads/${unique}.webp` });
  } catch (error) {
    console.error("Erreur sharp", error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Erreur lors du traitement de l\'image' });
  }
});

module.exports = router;

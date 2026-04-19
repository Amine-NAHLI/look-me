const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

// Get all products (Public) with search and filters
router.get('/', async (req, res) => {
  try {
    const keyword = req.query.keyword ? {
      name: {
        $regex: req.query.keyword,
        $options: 'i'
      }
    } : {};

    const category = req.query.category ? { category: req.query.category } : {};

    const products = await Product.find({ ...keyword, ...category }).populate('category', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Get single product (Public)
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Produit non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Add a product with image upload (Admin only)
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { name, description, category, price, inStock } = req.body;
    
    // Si un fichier est reçu, on génère le lien local (ex: http://localhost:5000/uploads/image-123.jpg)
    // Sinon, on s'attend toujours à ce que req.body.image existe (pour rétrocompatibilité ou lien web fallback)
    const imagePath = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : req.body.image;

    if(!imagePath) {
        return res.status(400).json({ message: "Une image est requise."});
    }

    const product = new Product({ name, description, category, price, image: imagePath, inStock });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: "Échec de l'ajout du produit" });
  }
});

// Delete a product (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      await product.deleteOne();
      res.json({ message: 'Produit supprimé' });
    } else {
      res.status(404).json({ message: 'Produit non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;

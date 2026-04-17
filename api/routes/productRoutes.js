const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, admin } = require('../middlewares/authMiddleware');

// Get all products (Public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Add a product (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, category, price, image, inStock } = req.body;
    const product = new Product({ name, category, price, image, inStock });
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

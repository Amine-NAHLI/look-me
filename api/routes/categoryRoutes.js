const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { protect, admin } = require('../middlewares/authMiddleware');

// Get all categories (Public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Add a category (Admin only)
router.post('/', protect, admin, async (req, res) => {
  try {
    const { name } = req.body;
    
    // Check if exists
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Cette catégorie existe déjà" });

    const category = new Category({ name });
    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(500).json({ message: "Échec de l'ajout" });
  }
});

// Delete a category (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await category.deleteOne();
      res.json({ message: 'Catégorie supprimée' });
    } else {
      res.status(404).json({ message: 'Introuvable' });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;

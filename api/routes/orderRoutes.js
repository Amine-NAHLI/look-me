const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { protect, admin } = require('../middlewares/authMiddleware');

// Get all orders (Admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'firstName email');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des commandes" });
  }
});

// Create fake order (User or Public demo)
router.post('/', protect, async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice } = req.body;
    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: "Pas d'articles dans la commande" });
    }
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: "Erreur de création de commande" });
  }
});

module.exports = router;

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

// Create new order
router.post('/', async (req, res) => {
  try {
    const { orderItems, shippingAddress, totalPrice, deliveryFee, paymentMethod } = req.body;
    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: "Pas d'articles dans la commande" });
    }
    const order = new Order({
      orderItems,
      user: req.user ? req.user._id : null,
      shippingAddress,
      deliveryFee,
      totalPrice,
      paymentMethod,
    });
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: "Erreur de création de commande" });
  }
});

// Get user orders (Profile)
router.get('/my-orders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération commandes" });
  }
});

// Get order by ID
router.get('/my-orders/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      // Check if user is owner or admin
      if (order.user && order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
          return res.status(403).json({ message: "Accès refusé - cette commande ne vous appartient pas" });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: "Commande introuvable" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Update order status (Admin only)
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      const oldStatus = order.status;
      order.status = req.body.status || order.status;
      
      if (req.body.status && req.body.status !== oldStatus) {
        order.statusHistory.push({
          status: req.body.status,
          date: new Date(),
          note: req.body.note || `Statut mis à jour vers ${req.body.status}`
        });
      }

      if (req.body.status === 'delivered') {
          order.isPaid = true;
      }
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: "Commande introuvable" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur mise à jour statut" });
  }
});

module.exports = router;

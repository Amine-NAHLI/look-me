const express = require('express');
const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middlewares/asyncHandler');
const validate = require('../middlewares/validate');
const { protect, admin, optionalProtect } = require('../middlewares/authMiddleware');
const { createOrderSchema, statusSchema, orderParams } = require('../validators/order');
const { pagination } = require('../validators/common');
const { createOrder, changeOrderStatus, verifyGuestAccess } = require('../services/orderService');

const router = express.Router();

router.post('/', optionalProtect, validate(createOrderSchema), asyncHandler(async (req, res) => { 
  const result = await createOrder({ user: req.user, input: req.body }); 
  res.status(result.replayed ? 200 : 201).json({ order: result.order, ...(result.guestAccessToken ? { guestAccessToken: result.guestAccessToken } : {}) }); 
}));

router.get('/', protect, admin, validate(pagination, 'query'), asyncHandler(async (req, res) => { 
  const { page, limit } = req.query; 
  const [items, total] = await Promise.all([
    prisma.order.findMany({
      include: { user: { select: { firstName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.order.count()
  ]); 
  res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) }); 
}));

router.get('/mine', protect, validate(pagination, 'query'), asyncHandler(async (req, res) => { 
  const { page, limit } = req.query; 
  const filter = { userId: req.user.id }; 
  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    }), 
    prisma.order.count({ where: filter })
  ]); 
  res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) }); 
}));

router.get('/:id', optionalProtect, validate(orderParams, 'params'), asyncHandler(async (req, res) => { 
  const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { items: true, statusHistory: true } }); 
  if (!order) throw new AppError('Commande introuvable', 404, 'ORDER_NOT_FOUND'); 
  const guestToken = req.get('x-guest-order-token'); 
  const owner = req.user && (order.userId === req.user.id || req.user.role === 'admin'); 
  if (!owner && !(!order.userId && verifyGuestAccess(order, guestToken))) throw new AppError('Accès refusé', 403, 'FORBIDDEN'); 
  const { guestAccessTokenHash, ...object } = order; 
  res.json({ order: object }); 
}));

router.patch('/:id/status', protect, admin, validate(orderParams, 'params'), validate(statusSchema), asyncHandler(async (req, res) => { 
  const order = await changeOrderStatus({ orderId: req.params.id, ...req.body, actor: req.user }); 
  res.json({ order }); 
}));

module.exports = router;

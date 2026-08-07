const express = require('express');
const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middlewares/asyncHandler');
const validate = require('../middlewares/validate');
const { protect, admin, optionalProtect } = require('../middlewares/authMiddleware');
const { createOrderSchema, statusSchema, orderParams } = require('../validators/order');
const { pagination } = require('../validators/common');
const { createOrder, changeOrderStatus, verifyGuestAccess, publicOrder } = require('../services/orderService');
const PdfDocument = require('pdfkit-table');

const router = express.Router();

router.post('/', optionalProtect, validate(createOrderSchema), asyncHandler(async (req, res) => {
  const result = await createOrder({ user: req.user, input: req.body, guestAccessToken: req.get('x-guest-order-token') });
  res.status(result.replayed ? 200 : 201).json({ order: result.order, ...(result.guestAccessToken ? { guestAccessToken: result.guestAccessToken } : {}) }); 
}));

router.get('/', protect, admin, validate(pagination, 'query'), asyncHandler(async (req, res) => { 
  const { page, limit } = req.validated.query; 
  const [items, total] = await Promise.all([
    prisma.order.findMany({
      include: { user: { select: { firstName: true, email: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.order.count()
  ]); 
  res.json({ items: items.map(publicOrder), page, limit, total, totalPages: Math.ceil(total / limit) });
}));

router.get('/mine', protect, validate(pagination, 'query'), asyncHandler(async (req, res) => { 
  const { page, limit } = req.validated.query; 
  const filter = { userId: req.user.id }; 
  const [items, total] = await Promise.all([
    prisma.order.findMany({
      where: filter,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    }), 
    prisma.order.count({ where: filter })
  ]); 
  res.json({ items: items.map(publicOrder), page, limit, total, totalPages: Math.ceil(total / limit) });
}));

router.get('/export/monthly', protect, admin, asyncHandler(async (req, res) => {
  const now = new Date();
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  
  const orders = await prisma.order.findMany({
    where: { createdAt: { gte: firstDayLastMonth, lte: lastDayLastMonth } },
    orderBy: { createdAt: 'asc' }
  });

  const doc = new PdfDocument({ margin: 30, size: 'A4' });
  
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="bilan-lookme-${firstDayLastMonth.getFullYear()}-${String(firstDayLastMonth.getMonth() + 1).padStart(2, '0')}.pdf"`);
  
  doc.pipe(res);

  doc.fontSize(20).text(`Bilan Mensuel - LOOKME`, { align: 'center' });
  doc.fontSize(12).text(`Période : ${firstDayLastMonth.toLocaleDateString('fr-FR')} au ${lastDayLastMonth.toLocaleDateString('fr-FR')}`, { align: 'center' });
  doc.moveDown(2);

  const table = {
    headers: ['Numéro', 'Date', 'Client', 'Ville', 'Total (MAD)', 'Statut'],
    rows: orders.map(o => [
      o.orderNumber,
      o.createdAt.toLocaleDateString('fr-FR'),
      o.shippingFullName,
      o.shippingCity,
      o.total.toFixed(2),
      o.status
    ])
  };

  await doc.table(table, { 
    prepareHeader: () => doc.font('Helvetica-Bold').fontSize(10),
    prepareRow: () => doc.font('Helvetica').fontSize(10)
  });

  const totalRevenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0);
  doc.moveDown();
  doc.font('Helvetica-Bold').fontSize(12).text(`Total des commandes livrees : ${totalRevenue.toFixed(2)} MAD`, { align: 'right' });

  doc.end();
}));

router.get('/dashboard/stats', protect, admin, asyncHandler(async (req, res) => {
  const settings = await prisma.storeSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: { id: 'default' }
  });
  
  const [products, orders, allRecentOrders] = await Promise.all([
    prisma.product.findMany(),
    prisma.order.findMany({ where: { createdAt: { gte: settings.lastDashboardReset } } }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5 })
  ]);
  
  const revenue = orders.filter(o => o.status === 'delivered').reduce((sum, o) => sum + o.total, 0);
  
  res.json({
    revenue,
    periodOrdersCount: orders.length,
    totalProducts: products.length,
    lowStockCount: products.filter(p => p.stock <= 3).length,
    lastReset: settings.lastDashboardReset,
    recentOrders: allRecentOrders.map(publicOrder)
  });
}));

router.post('/dashboard/reset', protect, admin, asyncHandler(async (req, res) => {
  const settings = await prisma.storeSettings.upsert({
    where: { id: 'default' },
    update: { lastDashboardReset: new Date() },
    create: { id: 'default', lastDashboardReset: new Date() }
  });
  res.json({ success: true, lastReset: settings.lastDashboardReset });
}));

router.get('/:id', optionalProtect, validate(orderParams, 'params'), asyncHandler(async (req, res) => { 
  const order = await prisma.order.findUnique({ where: { id: req.params.id }, include: { items: true, statusHistory: true } }); 
  if (!order) throw new AppError('Commande introuvable', 404, 'ORDER_NOT_FOUND'); 
  const guestToken = req.get('x-guest-order-token'); 
  const owner = req.user && (order.userId === req.user.id || req.user.role === 'admin'); 
  if (!owner && !(!order.userId && verifyGuestAccess(order, guestToken))) throw new AppError('Accès refusé', 403, 'FORBIDDEN'); 
  res.json({ order: publicOrder(order) });
}));

router.patch('/:id/status', protect, admin, validate(orderParams, 'params'), validate(statusSchema), asyncHandler(async (req, res) => { 
  const order = await changeOrderStatus({ orderId: req.params.id, ...req.body, actor: req.user }); 
  res.json({ order }); 
}));

module.exports = router;

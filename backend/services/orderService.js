const crypto = require('crypto');
const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');

const normalizeCity = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
const deliveryFor = (city) => ['fes', 'fez'].includes(normalizeCity(city)) ? 0 : 30;
const publicNumber = () => `LM-${new Date().getFullYear()}-${crypto.randomBytes(5).toString('hex').toUpperCase()}`;
const hash = (value) => crypto.createHash('sha256').update(value).digest('hex');

async function createOrder({ user, input }) {
  const existing = await prisma.order.findUnique({ where: { idempotencyKey: input.idempotencyKey } });
  if (existing) {
    if ((user && existing.userId === user.id) || !user) {
      return { order: existing, guestAccessToken: undefined, replayed: true };
    }
    throw new AppError('Clé d’idempotence déjà utilisée', 409, 'IDEMPOTENCY_CONFLICT');
  }

  const guestAccessToken = user ? undefined : crypto.randomBytes(32).toString('base64url');
  
  const result = await prisma.$transaction(async (tx) => {
    const ids = input.items.map((item) => item.productId);
    const products = await tx.product.findMany({ where: { id: { in: ids }, status: 'active' } });
    if (products.length !== ids.length) throw new AppError('Un ou plusieurs produits ne sont plus disponibles', 409, 'PRODUCT_UNAVAILABLE');
    
    const byId = new Map(products.map((p) => [p.id, p]));
    const lines = [];
    
    for (const requested of input.items) {
      const product = byId.get(requested.productId);
      if (!product || requested.quantity > product.stock) throw new AppError('Stock insuffisant', 409, 'INSUFFICIENT_STOCK');
      
      const update = await tx.product.updateMany({
        where: { id: product.id, stock: { gte: requested.quantity }, status: 'active' },
        data: { stock: { decrement: requested.quantity } }
      });
      if (update.count !== 1) throw new AppError('Stock insuffisant', 409, 'INSUFFICIENT_STOCK');
      
      lines.push({ 
        productId: product.id, 
        name: product.name, 
        slug: product.slug, 
        image: product.images[0] || null, 
        sku: product.sku || null, 
        unitPrice: product.price, 
        discount: 0, 
        quantity: requested.quantity, 
        lineTotal: product.price * requested.quantity, 
        currency: product.currency 
      });
    }
    
    const subtotal = lines.reduce((total, line) => total + line.lineTotal, 0);
    const deliveryFee = deliveryFor(input.shippingAddress.city);
    const total = subtotal + deliveryFee;

    const order = await tx.order.create({
      data: {
        orderNumber: publicNumber(),
        userId: user?.id,
        guestAccessTokenHash: guestAccessToken ? hash(guestAccessToken) : undefined,
        currency: 'MAD',
        subtotal,
        discountTotal: 0,
        deliveryFee,
        taxTotal: 0,
        total,
        shippingFullName: input.shippingAddress.fullName,
        shippingPhone: input.shippingAddress.phone,
        shippingAddressLine1: input.shippingAddress.addressLine1,
        shippingCity: input.shippingAddress.city,
        shippingPostalCode: input.shippingAddress.postalCode,
        billingFullName: input.billingAddress?.fullName,
        billingPhone: input.billingAddress?.phone,
        billingAddressLine1: input.billingAddress?.addressLine1,
        billingCity: input.billingAddress?.city,
        billingPostalCode: input.billingAddress?.postalCode,
        idempotencyKey: input.idempotencyKey,
        status: 'pending',
        items: { create: lines },
        statusHistory: {
          create: [{ status: 'pending', note: 'Commande reçue', changedById: user?.id }]
        }
      }
    });

    return order;
  });

  return { order: result, guestAccessToken, replayed: false };
}

async function changeOrderStatus({ orderId, status, note, actor }) {
  const allowed = { pending: ['confirmed', 'cancelled'], confirmed: ['shipped', 'cancelled'], shipped: ['delivered'], delivered: [], cancelled: [] };
  
  return await prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true, statusHistory: true } }); 
    if (!order) throw new AppError('Commande introuvable', 404, 'ORDER_NOT_FOUND');
    if (!allowed[order.status].includes(status)) throw new AppError('Transition de statut interdite', 409, 'INVALID_STATUS_TRANSITION');
    
    if (status === 'cancelled') {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } }
        });
      }
    }

    const previousStatus = order.status;

    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status,
        statusHistory: {
          create: [{ status, note: note || undefined, changedById: actor.id }]
        }
      }
    });

    await tx.auditLog.create({
      data: {
        actorId: actor.id,
        action: 'order.status_changed',
        resourceType: 'order',
        resourceId: orderId,
        metadata: { from: previousStatus, to: status }
      }
    });

    return updatedOrder;
  });
}

function verifyGuestAccess(order, token) { return Boolean(token) && Boolean(order.guestAccessTokenHash) && crypto.timingSafeEqual(Buffer.from(hash(token)), Buffer.from(order.guestAccessTokenHash)); }

module.exports = { createOrder, changeOrderStatus, verifyGuestAccess };

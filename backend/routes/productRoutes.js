const express = require('express');
const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middlewares/asyncHandler');
const validate = require('../middlewares/validate');
const { protect, admin } = require('../middlewares/authMiddleware');
const { pagination, productSchema, idParams } = require('../validators/catalog');

const router = express.Router();
const toSlug = (name) => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

router.get('/', validate(pagination, 'query'), asyncHandler(async (req, res) => {
  const { page, limit, sort, category, q } = req.validated.query;
  const filter = { 
    ...(category ? { categoryId: category } : {}), 
    ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}) 
  };
  const sortMap = { newest: { createdAt: 'desc' }, price_asc: { price: 'asc' }, price_desc: { price: 'desc' } };
  
  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where: filter,
      include: { category: { select: { id: true, name: true, slug: true } }, variants: true },
      orderBy: sortMap[sort] || sortMap.newest,
      skip: (page - 1) * limit,
      take: limit
    }),
    prisma.product.count({ where: filter })
  ]);
  
  res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) });
}));

router.get('/admin/all', protect, admin, validate(pagination, 'query'), asyncHandler(async (req, res) => {
  const { page, limit, sort, category, q } = req.validated.query;
  const filter = {
    ...(category ? { categoryId: category } : {}),
    ...(q ? { name: { contains: q, mode: 'insensitive' } } : {}),
  };
  const sortMap = { newest: { createdAt: 'desc' }, price_asc: { price: 'asc' }, price_desc: { price: 'desc' } };
  const [items, total] = await Promise.all([
    prisma.product.findMany({ where: filter, include: { category: { select: { name: true, slug: true } }, variants: true }, orderBy: sortMap[sort] || sortMap.newest, skip: (page - 1) * limit, take: limit }),
    prisma.product.count({ where: filter }),
  ]);
  res.json({ items, page, limit, total, totalPages: Math.ceil(total / limit) });
}));

router.get('/admin/:id', protect, admin, validate(idParams, 'params'), asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { category: true, variants: true } });
  if (!product) throw new AppError('Produit introuvable', 404, 'PRODUCT_NOT_FOUND');
  res.json({ product });
}));

router.get('/:id', validate(idParams, 'params'), asyncHandler(async (req, res) => { 
  const product = await prisma.product.findFirst({ 
    where: { id: req.params.id }, 
    include: { category: { select: { id: true, name: true, slug: true } }, variants: true }
  }); 
  if (!product) throw new AppError('Produit introuvable', 404, 'PRODUCT_NOT_FOUND'); 
  res.json({ product }); 
}));

router.post('/', protect, admin, validate(productSchema), asyncHandler(async (req, res) => { 
  const category = await prisma.category.findFirst({ where: { id: req.body.category } }); 
  if (!category) throw new AppError('Catégorie introuvable', 400, 'INVALID_CATEGORY'); 
  
  const { category: categoryId, variants, ...productData } = req.body;
  const totalStock = variants?.length > 0 ? variants.reduce((sum, v) => sum + (v.stock || 0), 0) : productData.stock;
  try {
    const product = await prisma.product.create({ 
      data: { 
        ...productData, 
        stock: totalStock,
        slug: productData.slug || toSlug(productData.name),
        categoryId,
        variants: variants ? { create: variants } : undefined
      },
      include: { variants: true }
    }); 
    res.status(201).json({ product }); 
  } catch (error) {
    if (error.code === 'P2002') throw new AppError('Un produit avec ce nom ou SKU existe déjà.', 409, 'PRODUCT_EXISTS');
    throw error;
  }
}));

router.put('/:id', protect, admin, validate(idParams, 'params'), validate(productSchema.partial()), asyncHandler(async (req, res) => { 
  if (req.body.category) { 
    const category = await prisma.category.findFirst({ where: { id: req.body.category } }); 
    if (!category) throw new AppError('Catégorie introuvable', 400, 'INVALID_CATEGORY'); 
  } 
  
  const { category: categoryId, variants, ...productData } = req.body;
  const totalStock = variants?.length > 0 ? variants.reduce((sum, v) => sum + (v.stock || 0), 0) : productData.stock;
  
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: { 
        ...productData, 
        ...(totalStock !== undefined ? { stock: totalStock } : {}),
        ...(categoryId ? { categoryId } : {}),
        variants: variants ? {
          deleteMany: {},
          create: variants
        } : undefined
      },
      include: { variants: true }
    }); 
    res.json({ product });
  } catch (error) {
    if (error.code === 'P2025') throw new AppError('Produit introuvable', 404, 'PRODUCT_NOT_FOUND');
    throw error;
  }
}));

router.delete('/:id', protect, admin, validate(idParams, 'params'), asyncHandler(async (req, res) => { 
  try {
    await prisma.product.delete({ where: { id: req.params.id } }); 
    res.status(204).end(); 
  } catch (error) {
    if (error.code === 'P2025') throw new AppError('Produit introuvable', 404, 'PRODUCT_NOT_FOUND');
    if (error.code === 'P2003') throw new AppError("Ce produit fait partie d'une commande et ne peut pas être supprimé.", 409, 'PRODUCT_IN_USE');
    throw error;
  }
}));

module.exports = router;

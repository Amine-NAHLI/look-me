const express = require('express');
const { prisma } = require('../config/db');
const AppError = require('../utils/AppError');
const asyncHandler = require('../middlewares/asyncHandler');
const validate = require('../middlewares/validate');
const { protect, admin } = require('../middlewares/authMiddleware');
const { categorySchema, idParams } = require('../validators/catalog');

const router = express.Router();
const toSlug = (name) => name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

router.get('/', asyncHandler(async (_req, res) => {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });
  res.json({ items: categories });
}));

router.get('/admin/all', protect, admin, asyncHandler(async (_req, res) => {
  const items = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });
  res.json({ items });
}));

router.post('/', protect, admin, validate(categorySchema), asyncHandler(async (req, res) => { 
  const category = await prisma.category.create({ 
    data: { ...req.body, slug: req.body.slug || toSlug(req.body.name) } 
  }); 
  res.status(201).json({ category }); 
}));

router.put('/:id', protect, admin, validate(idParams, 'params'), validate(categorySchema.partial()), asyncHandler(async (req, res) => { 
  try {
    const category = await prisma.category.update({
      where: { id: req.params.id },
      data: { ...req.body, ...(req.body.name && !req.body.slug ? { slug: toSlug(req.body.name) } : {}) }
    }); 
    res.json({ category });
  } catch (error) {
    if (error.code === 'P2025') throw new AppError('Catégorie introuvable', 404, 'CATEGORY_NOT_FOUND');
    throw error;
  }
}));

router.delete('/:id', protect, admin, validate(idParams, 'params'), asyncHandler(async (req, res) => { 
  const used = await prisma.product.findFirst({ where: { categoryId: req.params.id, status: 'active' } }); 
  if (used) throw new AppError('Reclassez ou supprimez les produits de cette catégorie avant de la supprimer.', 409, 'CATEGORY_IN_USE'); 
  
  try {
    await prisma.category.delete({ where: { id: req.params.id } }); 
    res.status(204).end(); 
  } catch (error) {
    if (error.code === 'P2025') throw new AppError('Catégorie introuvable', 404, 'CATEGORY_NOT_FOUND');
    throw error;
  }
}));

module.exports = router;

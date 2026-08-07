process.env.NODE_ENV = 'test';
const request = require('supertest');
const { createApp } = require('../../app');
const { prisma, connectDatabase, disconnectDatabase } = require('../../config/db');
const hasDedicatedTestDatabase = /test/i.test(process.env.DATABASE_URL || '');
const integrationDescribe = hasDedicatedTestDatabase ? describe : describe.skip;

integrationDescribe('Flux E2E : Commande Cash On Delivery (COD)', () => {
  let app;
  let testCategory;
  let testProduct;
  let databaseReady = false;

  beforeAll(async () => {
    await connectDatabase();
    databaseReady = true;
    app = createApp();

    // Clean up before test
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});

    // Setup seed data
    testCategory = await prisma.category.create({
      data: { name: 'Test Category', slug: 'test-category' }
    });

    testProduct = await prisma.product.create({
      data: {
        name: 'Test Product',
        slug: 'test-product',
        description: 'A test product',
        price: 150,
        categoryId: testCategory.id,
        stock: 10
      }
    });
  }, 30000);

  afterAll(async () => {
    if (!databaseReady) return;
    await prisma.order.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await disconnectDatabase();
  }, 30000);

  it('devrait permettre à un visiteur de passer une commande COD', async () => {
    const crypto = require('crypto');
    const orderPayload = {
      items: [
        { productId: testProduct.id, quantity: 2 }
      ],
      shippingAddress: {
        fullName: 'John Doe',
        phone: '0600000000',
        addressLine1: '123 Rue de Test',
        city: 'Casablanca'
      },
      idempotencyKey: crypto.randomUUID()
    };

    const response = await request(app)
      .post('/api/orders')
      .send(orderPayload)
      .expect(201);

    expect(response.body).toHaveProperty('order');
    expect(response.body.order.orderNumber).toBeDefined();
    expect(response.body.order.paymentMethod).toBe('cash_on_delivery');
    expect(response.body.order.status).toBe('pending');
    expect(response.body.order.total).toBeGreaterThan(0);
    expect(response.body.guestAccessToken).toBeDefined();

    // Vérifier la déduction du stock
    const updatedProduct = await prisma.product.findUnique({ where: { id: testProduct.id } });
    expect(updatedProduct.stock).toBe(8); // 10 - 2 = 8
  });
});

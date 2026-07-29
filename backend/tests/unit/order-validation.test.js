const { createOrderSchema } = require('../../validators/order');

const valid = {
  items: [{ productId: 'b3f1f36a-02c5-4633-9499-3d71bc7f438a', quantity: 1 }],
  shippingAddress: { fullName: 'Sara El Amrani', phone: '+212600000000', addressLine1: '10 Rue Hassan II', city: 'Fès' },
  idempotencyKey: 'b3f1f36a-02c5-4633-9499-3d71bc7f438a',
};

describe('commande — frontière de confiance', () => {
  it('refuse les prix et totaux fournis par le navigateur', () => {
    const result = createOrderSchema.safeParse({ ...valid, total: 1, items: [{ ...valid.items[0], price: 1 }] });
    expect(result.success).toBe(false);
  });

  it('refuse quantité négative, nulle et hors limite', () => {
    for (const quantity of [-1, 0, 21]) expect(createOrderSchema.safeParse({ ...valid, items: [{ ...valid.items[0], quantity }] }).success).toBe(false);
  });

  it('accepte uniquement le minimum nécessaire au calcul serveur', () => {
    const parsed = createOrderSchema.parse(valid);
    expect(parsed.items[0]).toEqual({ productId: valid.items[0].productId, quantity: 1 });
  });
});

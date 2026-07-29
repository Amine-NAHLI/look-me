const crypto = require('crypto');
const { verifyGuestAccess } = require('../../services/orderService');

describe('commandes invitées', () => {
  it('exige le jeton haute entropie, et non le seul ObjectId', () => {
    const token = crypto.randomBytes(32).toString('base64url');
    const order = { guestAccessTokenHash: crypto.createHash('sha256').update(token).digest('hex') };
    expect(verifyGuestAccess(order, token)).toBe(true);
    expect(verifyGuestAccess(order, 'un-mauvais-jeton')).toBe(false);
    expect(verifyGuestAccess(order, undefined)).toBe(false);
  });
});

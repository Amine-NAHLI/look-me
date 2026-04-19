/**
 * Formate un prix en Dirham Marocain (MAD)
 * @param {number} price - Le prix à formater
 * @returns {string} - Le prix formaté (ex: 250 DH)
 */
export const formatPrice = (price) => {
  return `${Number(price).toLocaleString('fr-MA')} DH`;
};

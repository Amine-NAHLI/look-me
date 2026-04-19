export const isFesCityFree = (city) => {
  if (!city) return false;
  const normalized = city
    .toLowerCase()
    .trim()
    .normalize('NFD')                    // décompose les accents
    .replace(/[\u0300-\u036f]/g, '')     // supprime les accents
    .replace(/\s+/g, ' ');               // normalise les espaces
  return normalized === 'fes' || normalized === 'fez';
};

export const getDeliveryFee = (city) => {
  return isFesCityFree(city) ? 0 : 30;
};

export const formatDeliveryFee = (city) => {
  return isFesCityFree(city) ? 'Gratuite' : '30 DH';
};

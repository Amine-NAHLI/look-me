export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  // With Vite proxy, a relative path is sufficient
  return path.startsWith('/') ? path : `/${path}`;
};

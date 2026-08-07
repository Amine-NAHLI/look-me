import { create } from 'zustand';

const readJson = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
const CART_STORAGE_KEY = 'lookme_cart_v2';
const LEGACY_CART_STORAGE_KEY = 'lookme_cart';
const readCart = () => {
  const cart = readJson(CART_STORAGE_KEY, []);
  if (!Array.isArray(cart) || cart.some((item) => !item?.id || item._id)) {
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
    return [];
  }
  localStorage.removeItem(LEGACY_CART_STORAGE_KEY);
  return cart;
};
const persistCart = (cart) => localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
export const useUIStore = create((set, get) => ({
  isAuthModalOpen: false,
  user: readJson('lookme_user', null),
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => { localStorage.setItem('lookme_user', JSON.stringify(user)); set({ user }); },
  logout: () => { localStorage.removeItem('lookme_user'); set({ user: null, accessToken: null }); },
  openAuthModal: () => set({ isAuthModalOpen: true }), closeAuthModal: () => set({ isAuthModalOpen: false }),
  isCartOpen: false, cart: readCart(),
  openCart: () => set({ isCartOpen: true }), closeCart: () => set({ isCartOpen: false }), toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  addToCart: (product, quantity = 1) => { if (!product?.id || product.stock <= 0) return; const cart = get().cart; const existing = cart.find((item) => item.id === product.id); const max = product.stock; const next = existing ? cart.map((item) => item.id === product.id ? { ...item, qty: Math.min(item.qty + quantity, max) } : item) : [...cart, { ...product, qty: Math.min(quantity, max) }]; persistCart(next); set({ cart: next, isCartOpen: true }); },
  removeFromCart: (productId) => { const cart = get().cart.filter((item) => item.id !== productId); persistCart(cart); set({ cart }); },
  updateQuantity: (productId, qty) => { if (qty <= 0) return get().removeFromCart(productId); const cart = get().cart.map((item) => item.id === productId ? { ...item, qty: Math.min(qty, item.stock ?? 0) } : item); persistCart(cart); set({ cart }); },
  clearCart: () => { localStorage.removeItem(CART_STORAGE_KEY); localStorage.removeItem(LEGACY_CART_STORAGE_KEY); set({ cart: [] }); }, getCartTotal: () => get().cart.reduce((total, item) => total + item.price * item.qty, 0),
  searchQuery: '', setSearchQuery: (searchQuery) => set({ searchQuery }), selectedCategory: '', setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  guestOrderTokens: readJson('lookme_guest_orders', {}), setGuestOrderToken: (id, token) => { const guestOrderTokens = { ...get().guestOrderTokens, [id]: token }; localStorage.setItem('lookme_guest_orders', JSON.stringify(guestOrderTokens)); set({ guestOrderTokens }); },
}));

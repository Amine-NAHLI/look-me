import { create } from 'zustand';

const readJson = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
export const useUIStore = create((set, get) => ({
  isAuthModalOpen: false,
  user: readJson('lookme_user', null),
  accessToken: null,
  setAccessToken: (accessToken) => set({ accessToken }),
  setUser: (user) => { localStorage.setItem('lookme_user', JSON.stringify(user)); set({ user }); },
  logout: () => { localStorage.removeItem('lookme_user'); set({ user: null, accessToken: null }); },
  openAuthModal: () => set({ isAuthModalOpen: true }), closeAuthModal: () => set({ isAuthModalOpen: false }),
  isCartOpen: false, cart: readJson('lookme_cart', []),
  openCart: () => set({ isCartOpen: true }), closeCart: () => set({ isCartOpen: false }), toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
  addToCart: (product, quantity = 1) => { const cart = get().cart; const existing = cart.find((item) => item._id === product._id); const max = product.stock ?? 99; const next = existing ? cart.map((item) => item._id === product._id ? { ...item, qty: Math.min(item.qty + quantity, max) } : item) : [...cart, { ...product, qty: Math.min(quantity, max) }]; localStorage.setItem('lookme_cart', JSON.stringify(next)); set({ cart: next, isCartOpen: true }); },
  removeFromCart: (productId) => { const cart = get().cart.filter((item) => item._id !== productId); localStorage.setItem('lookme_cart', JSON.stringify(cart)); set({ cart }); },
  updateQuantity: (productId, qty) => { if (qty <= 0) return get().removeFromCart(productId); const cart = get().cart.map((item) => item._id === productId ? { ...item, qty: Math.min(qty, item.stock ?? 99) } : item); localStorage.setItem('lookme_cart', JSON.stringify(cart)); set({ cart }); },
  clearCart: () => { localStorage.removeItem('lookme_cart'); set({ cart: [] }); }, getCartTotal: () => get().cart.reduce((total, item) => total + item.price * item.qty, 0),
  searchQuery: '', setSearchQuery: (searchQuery) => set({ searchQuery }), selectedCategory: '', setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  guestOrderTokens: readJson('lookme_guest_orders', {}), setGuestOrderToken: (id, token) => { const guestOrderTokens = { ...get().guestOrderTokens, [id]: token }; localStorage.setItem('lookme_guest_orders', JSON.stringify(guestOrderTokens)); set({ guestOrderTokens }); },
}));

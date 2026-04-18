import { create } from 'zustand';

export const useUIStore = create((set, get) => ({
  // --- AUTHENTIFICATION ---
  isAuthModalOpen: false,
  user: localStorage.getItem('lookme_user') ? JSON.parse(localStorage.getItem('lookme_user')) : null,
  
  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  
  setUser: (userData) => {
    localStorage.setItem('lookme_user', JSON.stringify(userData));
    set({ user: userData });
  },
  
  logout: () => {
    localStorage.removeItem('lookme_user');
    localStorage.removeItem('lookme_token');
    set({ user: null });
  },

  // --- PANIER (CART) ---
  isCartOpen: false,
  cart: [],

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  addToCart: (product) => {
    const cart = get().cart;
    const existingItem = cart.find(item => item._id === product._id);
    
    if (existingItem) {
      set({
        cart: cart.map(item => 
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        )
      });
    } else {
      set({ cart: [...cart, { ...product, qty: 1 }] });
    }
    // Ouvre le panier automatiquement lors d'un ajout
    set({ isCartOpen: true });
  },

  removeFromCart: (productId) => {
    set({ cart: get().cart.filter(item => item._id !== productId) });
  },

  updateQuantity: (productId, qty) => {
    if (qty <= 0) {
      get().removeFromCart(productId);
      return;
    }
    set({
      cart: get().cart.map(item => 
        item._id === productId ? { ...item, qty } : item
      )
    });
  },

  clearCart: () => set({ cart: [] }),
  
  getCartTotal: () => {
    return get().cart.reduce((total, item) => total + (item.price * item.qty), 0);
  }
}));

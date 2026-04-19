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
  cart: localStorage.getItem('lookme_cart') ? JSON.parse(localStorage.getItem('lookme_cart')) : [],

  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

  addToCart: (product) => {
    const cart = get().cart;
    const existingItem = cart.find(item => item._id === product._id);
    let newCart;
    
    if (existingItem) {
      newCart = cart.map(item => 
        item._id === product._id ? { ...item, qty: item.qty + 1 } : item
      );
    } else {
      newCart = [...cart, { ...product, qty: 1 }];
    }
    
    localStorage.setItem('lookme_cart', JSON.stringify(newCart));
    set({ cart: newCart, isCartOpen: true });
  },

  removeFromCart: (productId) => {
    const newCart = get().cart.filter(item => item._id !== productId);
    localStorage.setItem('lookme_cart', JSON.stringify(newCart));
    set({ cart: newCart });
  },

  updateQuantity: (productId, qty) => {
    if (qty <= 0) {
      get().removeFromCart(productId);
      return;
    }
    const newCart = get().cart.map(item => 
      item._id === productId ? { ...item, qty } : item
    );
    localStorage.setItem('lookme_cart', JSON.stringify(newCart));
    set({ cart: newCart });
  },

  clearCart: () => {
    localStorage.removeItem('lookme_cart');
    set({ cart: [] });
  },
  
  getCartTotal: () => {
    return get().cart.reduce((total, item) => total + (item.price * item.qty), 0);
  },

  // --- RECHERCHE ET FILTRES ---
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectedCategory: '',
  setSelectedCategory: (catId) => set({ selectedCategory: catId }),
}));

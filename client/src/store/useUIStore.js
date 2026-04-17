import { create } from 'zustand';

export const useUIStore = create((set) => ({
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
  }
}));

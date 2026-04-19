import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import { getImageUrl } from '../utils/imageUrl';
import toast from 'react-hot-toast';
import { drawerVariants, overlayVariants, fadeInUp } from '../utils/animations';

export default function CartDrawer() {
  const navigate = useNavigate();
  const { isCartOpen, closeCart, cart, updateQuantity, removeFromCart, clearCart, getCartTotal } = useUIStore();

  const handleCheckout = () => {
    if (cart.length === 0) return;
    closeCart();
    navigate('/checkout');
  };

  const handleRemove = (id, name) => {
    if (window.confirm(`Retirer ${name} du panier ?`)) {
      removeFromCart(id);
      toast.success(`${name} retiré`);
    }
  };

  const cartItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 z-[998]"
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 bottom-0 w-full md:w-[420px] bg-white z-[999] flex flex-col shadow-lg"
          >
            {/* Header */}
            <div className="p-6 border-b border-[var(--border)] flex items-center justify-between bg-white">
              <h2 className="text-[20px] font-heading font-bold text-[var(--black)] flex items-center gap-2">
                Mon Panier <span className="text-[12px] font-body text-[var(--gray)] font-normal uppercase tracking-wider">({cartItemsCount})</span>
              </h2>
              <button 
                onClick={closeCart}
                className="text-[var(--dark)] hover:text-[#C2185B] transition-colors"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto p-6 no-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={48} className="text-[#C2185B] mb-6 opacity-40" strokeWidth={1} />
                  <h3 className="font-heading italic text-[24px] text-gray-400 mb-6 font-normal">Votre panier est vide</h3>
                  <button 
                    onClick={closeCart}
                    className="bg-[var(--dark)] text-white font-body font-semibold text-[11px] uppercase tracking-[2px] px-[32px] py-[14px] hover:bg-[#C2185B] transition-colors"
                  >
                    Découvrir la collection
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <motion.div 
                      layout
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      key={item._id}
                      className="flex gap-4 group"
                    >
                      <div className="h-[120px] w-[90px] bg-[#F5F5F5] overflow-hidden flex-shrink-0">
                        <img src={getImageUrl(item.image)} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-grow min-w-0 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-body font-medium text-[14px] text-[var(--dark)] truncate pr-4">{item.name}</h4>
                            <button 
                              onClick={() => handleRemove(item._id, item.name)}
                              className="text-[var(--gray)] hover:text-[#C2185B] transition-colors"
                            >
                              <Trash2 size={16} strokeWidth={1.5} />
                            </button>
                          </div>
                          <p className="font-body font-bold text-[14px] text-[#C2185B]">{formatPrice(item.price)}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center border border-[var(--border)]">
                            <button 
                              onClick={() => updateQuantity(item._id, Math.max(1, item.qty - 1))}
                              className="w-8 h-8 flex items-center justify-center text-[var(--dark)] hover:text-[#C2185B] transition-colors"
                            >
                              <Minus size={14} strokeWidth={1.5} />
                            </button>
                            <span className="w-8 text-center font-body font-medium text-[12px]">{item.qty}</span>
                            <button 
                              onClick={() => updateQuantity(item._id, item.qty + 1)}
                              className="w-8 h-8 flex items-center justify-center text-[var(--dark)] hover:text-[#C2185B] transition-colors"
                            >
                              <Plus size={14} strokeWidth={1.5} />
                            </button>
                          </div>
                          <p className="font-body font-medium text-[13px] text-[var(--dark)]">{formatPrice(item.price * item.qty)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[var(--border)] bg-white">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center font-body text-[12px] uppercase tracking-wider text-[var(--gray)]">
                    <span>Sous-total</span>
                    <span className="text-[var(--dark)]">{formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between items-center font-body text-[12px] uppercase tracking-wider text-[var(--gray)]">
                    <span>Livraison</span>
                    <span className="text-[#2E7D32]">Gratuite</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-[var(--border)]">
                    <span className="font-body font-medium text-[14px] uppercase tracking-wider text-[var(--dark)]">Total</span>
                    <span className="font-body font-bold text-[18px] text-[#C2185B]">{formatPrice(getCartTotal())}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={handleCheckout}
                    className="w-full bg-[#C2185B] text-white font-body font-semibold text-[12px] uppercase tracking-[2px] py-[16px] hover:bg-[#880E4F] transition-colors flex justify-center items-center gap-2 group"
                  >
                    Valider <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button 
                    onClick={() => {
                      if(window.confirm('Vider tout le panier ?')) {
                        clearCart();
                        toast.success('Panier vidé');
                      }
                    }}
                    className="w-full bg-transparent text-[var(--dark)] border border-[var(--dark)] font-body font-semibold text-[11px] uppercase tracking-[2px] py-[12px] hover:bg-[var(--dark)] hover:text-white transition-colors"
                  >
                    Vider le panier
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

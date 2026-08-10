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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[998]"
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed right-0 top-0 bottom-0 w-full md:w-[460px] bg-white/70 backdrop-blur-3xl z-[999] flex flex-col shadow-2xl border-l border-white/40 overflow-hidden"
          >
            {/* Aurora effect inside drawer */}
            <div className="absolute top-0 right-0 h-64 w-64 bg-[var(--primary)]/10 blur-[80px] pointer-events-none rounded-full" />
            <div className="absolute bottom-0 left-0 h-80 w-80 bg-[#d797a3]/10 blur-[100px] pointer-events-none rounded-full" />

            {/* Header */}
            <div className="p-6 pb-4 border-b border-white/40 flex items-center justify-between relative z-10">
              <h2 className="text-2xl font-heading font-bold text-[var(--dark)] flex items-center gap-2">
                Mon Panier <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-[11px] font-bold text-white shadow-md">{cartItemsCount}</span>
              </h2>
              <button 
                type="button"
                aria-label="Fermer le panier"
                onClick={closeCart}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/60 bg-white/50 text-[var(--dark)] shadow-sm backdrop-blur-md transition-all hover:scale-105 hover:bg-white"
              >
                <X size={20} strokeWidth={2} />
              </button>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto p-6 no-scrollbar relative z-10">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="grid h-24 w-24 place-items-center rounded-full border border-[var(--primary)]/20 bg-white/50 shadow-lg backdrop-blur-md mb-6">
                    <ShoppingBag size={40} className="text-[var(--primary)] opacity-80" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-heading text-2xl text-[var(--dark)] mb-3">Votre panier est vide</h3>
                  <p className="text-sm text-[var(--gray)] mb-8">Découvrez nos dernières nouveautés et trouvez l'inspiration.</p>
                  <button 
                    onClick={() => { navigate('/catalogue'); closeCart(); }}
                    className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest text-white shadow-lg transition-all hover:scale-105 hover:bg-[var(--primary-hover)]"
                  >
                    Découvrir la collection
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div 
                      layout
                      variants={fadeInUp}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      key={item.id}
                      className="group flex gap-4 rounded-[1.5rem] border border-white/60 bg-white/40 p-3 shadow-sm backdrop-blur-md transition-all hover:bg-white/60 hover:shadow-md"
                    >
                      <div className="h-28 w-24 overflow-hidden rounded-xl bg-black/5 flex-shrink-0">
                        {item.images?.[0] ? <img src={getImageUrl(item.images[0])} alt={item.name} className="h-full w-full object-cover" /> : <span className="grid h-full place-items-center text-xs text-[var(--gray)]">LOOKME</span>}
                      </div>
                      <div className="flex-grow min-w-0 flex flex-col justify-between py-1">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-heading font-bold text-lg text-[var(--dark)] truncate pr-4">{item.name}</h4>
                            <button 
                              type="button"
                              onClick={() => handleRemove(item.id, item.name)}
                              className="text-[var(--gray)] transition-colors hover:text-red-500"
                            >
                              <Trash2 size={16} strokeWidth={1.5} />
                            </button>
                          </div>
                          <p className="font-bold text-[15px] text-[var(--primary)]">{formatPrice(item.price)}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-auto">
                          <div className="flex items-center rounded-full border border-white/60 bg-white/50 backdrop-blur-md px-1 py-1">
                            <button 
                              type="button"
                              onClick={() => {
                                if (item.qty > 1) updateQuantity(item.id, item.qty - 1);
                                else handleRemove(item.id, item.name);
                              }}
                              className="grid h-7 w-7 place-items-center rounded-full text-[var(--dark)] hover:bg-white transition-colors"
                            >
                              <Minus size={14} strokeWidth={2} />
                            </button>
                            <span className="w-6 text-center font-bold text-[13px]">{item.qty}</span>
                            <button 
                              type="button"
                              onClick={() => {
                                if (item.qty < (item.stock ?? 99)) updateQuantity(item.id, item.qty + 1);
                                else toast.error("Stock maximum atteint");
                              }}
                              className="grid h-7 w-7 place-items-center rounded-full text-[var(--dark)] hover:bg-white transition-colors"
                            >
                              <Plus size={14} strokeWidth={2} />
                            </button>
                          </div>
                          <p className="font-bold text-sm text-[var(--dark)]">{formatPrice(item.price * item.qty)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/40 bg-white/40 backdrop-blur-md relative z-10">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[var(--gray)]">
                    <span>Sous-total</span>
                    <span className="text-[var(--dark)]">{formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-[var(--gray)]">
                    <span>Livraison</span>
                    <span className="opacity-80">Calculée au checkout</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-white/30">
                    <span className="text-sm font-bold uppercase tracking-wider text-[var(--dark)]">Total</span>
                    <span className="text-2xl font-bold text-[var(--primary)]">{formatPrice(getCartTotal())}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    type="button"
                    onClick={handleCheckout}
                    className="group flex w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_8px_20px_rgba(194,24,91,0.25)] transition-all hover:scale-[1.02] hover:bg-[var(--primary-hover)] hover:shadow-[0_12px_24px_rgba(194,24,91,0.35)]"
                  >
                    Valider la commande <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </button>
                  <button 
                    type="button"
                    onClick={() => {
                      if(window.confirm('Vider tout le panier ?')) {
                        clearCart();
                        toast.success('Panier vidé');
                      }
                    }}
                    className="w-full rounded-full border border-white/60 bg-white/40 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--dark)] backdrop-blur-md transition-colors hover:bg-white/80"
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

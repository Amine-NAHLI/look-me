import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, PackageOpen } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100]"
          />

          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-[450px] bg-white shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2 italic">
                  Panier <span className="text-pink-500 font-bold not-italic text-sm">({cartItemsCount} ARTICLES)</span>
                </h2>
              </div>
              <button 
                onClick={closeCart}
                className="p-3 hover:bg-gray-50 rounded-full transition-colors group"
              >
                <X className="group-hover:rotate-90 transition-transform" />
              </button>
            </div>

            {/* List */}
            <div className="flex-grow overflow-y-auto px-6 py-4 no-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="p-8 bg-pink-50 text-pink-500 rounded-full mb-6">
                    <PackageOpen size={64} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Votre panier est vide</h3>
                  <p className="text-gray-400 mb-8">Dénichez la pièce de vos rêves dans notre collection.</p>
                  <button 
                    onClick={closeCart}
                    className="btn-primary"
                  >
                    Aller à la boutique
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {cart.map((item) => (
                    <motion.div 
                      layout
                      key={item._id}
                      className="flex gap-4 p-4 rounded-[2rem] bg-gray-50/50 border border-gray-100 group"
                    >
                      <div className="h-24 w-24 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-gray-900 truncate pr-4">{item.name}</h4>
                          <button 
                            onClick={() => handleRemove(item._id, item.name)}
                            className="p-1 text-gray-400 hover:text-rose-500"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs font-bold text-pink-500 mb-4">{formatPrice(item.price)}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-white rounded-xl p-1 border border-gray-100">
                            <button 
                              onClick={() => updateQuantity(item._id, Math.max(1, item.qty - 1))}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-10 text-center font-bold text-sm">{item.qty}</span>
                            <button 
                              onClick={() => updateQuantity(item._id, item.qty + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 rounded-lg"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <p className="font-black text-gray-900">{formatPrice(item.price * item.qty)}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-8 border-t border-gray-100 bg-white">
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                    <span>Sous-total</span>
                    <span className="text-gray-900">{formatPrice(getCartTotal())}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                    <span>Livraison</span>
                    <span className="text-green-500">Gratuite</span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-xl font-black italic">Total</span>
                    <span className="text-2xl font-black text-pink-500 italic">{formatPrice(getCartTotal())}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={handleCheckout}
                    className="w-full h-16 bg-gray-900 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-200"
                  >
                    Valider la commande
                    <ArrowRight size={20} />
                  </button>
                  <button 
                    onClick={() => {
                      if(window.confirm('Vider tout le panier ?')) {
                        clearCart();
                        toast.success('Panier vidé');
                      }
                    }}
                    className="text-gray-400 font-bold text-xs uppercase hover:text-rose-500 py-2"
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

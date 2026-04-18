import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

export default function CartDrawer() {
  const { isCartOpen, closeCart, cart, updateQuantity, removeFromCart, getCartTotal } = useUIStore();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay (Fond noir flouté) */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
          />

          {/* Drawer (Le panneau sur le côté droit) */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[101] flex flex-col border-l border-pink-100"
          >
            {/* Header du Panier */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-pink-50/50">
              <div className="flex items-center gap-3 text-slate-800">
                <div className="p-2 bg-pink-100 text-pink-500 rounded-full">
                  <ShoppingBag size={20} />
                </div>
                <h2 className="text-xl font-extrabold tracking-tight">Mon Panier</h2>
              </div>
              <button 
                onClick={closeCart}
                className="p-2 text-slate-400 hover:text-pink-500 hover:bg-pink-50 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Liste des articles */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <ShoppingBag size={48} className="opacity-20" />
                  <p className="font-medium text-lg text-slate-500">Votre panier est vide</p>
                  <button 
                    onClick={closeCart}
                    className="text-pink-500 font-bold hover:underline"
                  >
                    Continuer vos achats
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={item._id} 
                    className="flex gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm"
                  >
                    {/* Limiter la taille de l'image pour éviter les débordements */}
                    <div className="w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-slate-100">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=300&auto=format&fit=crop';
                        }}
                      />
                    </div>
                    
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-800 leading-tight pr-4">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item._id)}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <p className="text-xs text-pink-500 font-bold uppercase mt-1">
                          {item.category?.name || item.category || 'Article'}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center bg-slate-50 rounded-lg border border-slate-200">
                          <button 
                            onClick={() => updateQuantity(item._id, item.qty - 1)}
                            className="p-1.5 text-slate-500 hover:text-pink-500 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-slate-700">
                            {item.qty}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.qty + 1)}
                            className="p-1.5 text-slate-500 hover:text-pink-500 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="font-extrabold text-slate-800">{item.price}€</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Pied du Panier (Total et Checkout) */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-slate-100 bg-white shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-slate-500 font-medium">Total Estimé</span>
                  <span className="text-2xl font-extrabold text-slate-800">{getCartTotal()}€</span>
                </div>
                <button className="w-full bg-pink-500 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-pink-200 hover:bg-pink-600 transition-colors transform active:scale-95">
                  Valider la Commande
                </button>
                <p className="text-center text-xs text-slate-400 mt-4 font-medium">
                  Les taxes et frais de livraison seront calculés à l'étape suivante.
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

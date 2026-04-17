import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useUIStore } from '../store/useUIStore';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useUIStore();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <AnimatePresence>
      {isAuthModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
          onClick={closeAuthModal}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden bg-white rounded-3xl shadow-2xl border border-pink-100"
          >
            {/* Bouton de Fermeture */}
            <button 
              onClick={closeAuthModal}
              className="absolute top-4 right-4 p-2 bg-pink-50 text-pink-500 rounded-full hover:bg-pink-100 transition-colors z-10"
            >
              <X size={20} />
            </button>

            {/* En-tête Rose Doux */}
            <div className="bg-pink-500 p-8 text-center text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
              <h2 className="text-3xl font-extrabold tracking-tight mb-2">
                {isLogin ? 'Bon Retour' : 'Créer un Compte'}
              </h2>
              <p className="text-pink-100 font-medium text-sm">
                {isLogin ? 'Connectez-vous pour voir vos favoris 💖' : 'Rejoignez le Club Rose pour des exclusivités ✨'}
              </p>
            </div>

            {/* Formulaire */}
            <div className="p-8">
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Prénom</label>
                    <input 
                      type="text" 
                      placeholder="Jane"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-pink-500 focus:bg-white outline-none transition-all text-slate-800"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Adresse E-mail</label>
                  <input 
                    type="email" 
                    placeholder="hello@exemple.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-pink-500 focus:bg-white outline-none transition-all text-slate-800"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-bold text-slate-700">Mot de Passe</label>
                    {isLogin && <a href="#" className="text-xs text-pink-500 font-bold hover:underline">Oublié ?</a>}
                  </div>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-pink-500 focus:bg-white outline-none transition-all text-slate-800"
                  />
                </div>

                <button className="w-full py-3 mt-4 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 transition-colors transform active:scale-95">
                  {isLogin ? 'Se Connecter' : "S'inscrire"}
                </button>
              </form>

              {/* Toggle Mode */}
              <div className="mt-8 text-center text-sm font-medium text-slate-500">
                {isLogin ? "Vous n'avez pas de compte ? " : "Vous possédez déjà un compte ? "}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-pink-500 font-bold hover:underline"
                >
                  {isLogin ? "Inscrivez-vous ici" : "Connectez-vous ici"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

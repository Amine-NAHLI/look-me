import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useUIStore } from '../store/useUIStore';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal } = useUIStore();
  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({ firstName: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Gérer la soumission au Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password } 
        : formData;
      
      // Appel à l'API Node.js/MongoDB sur le port 5000
      const { data } = await axios.post(`http://localhost:5000${endpoint}`, payload);
      
      // Sauvegarder le token et fermer
      localStorage.setItem('lookme_token', data.token);
      alert(isLogin ? "Connexion réussie ! 💖" : "Bienvenue dans le Club Rose ! ✨");
      
      // Reset form
      setFormData({ firstName: '', email: '', password: '' });
      closeAuthModal();
      
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur de connexion est survenue');
    } finally {
      setLoading(false);
    }
  };

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
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-500 text-sm font-bold rounded-xl text-center">
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSubmit}>
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Prénom</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Jane"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-pink-500 focus:bg-white outline-none transition-all text-slate-800"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Adresse E-mail</label>
                  <input 
                    type="email" 
                    required
                    placeholder="hello@exemple.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-pink-500 focus:bg-white outline-none transition-all text-slate-800"
                  />
                </div>

                <button 
                  disabled={loading}
                  className="w-full py-3 mt-4 flex justify-center items-center gap-2 bg-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-200 hover:bg-pink-600 transition-colors transform active:scale-95 disabled:opacity-70 disabled:active:scale-100"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  {isLogin ? 'Se Connecter' : "S'inscrire"}
                </button>
              </form>

              {/* Toggle Mode */}
              <div className="mt-8 text-center text-sm font-medium text-slate-500">
                {isLogin ? "Vous n'avez pas de compte ? " : "Vous possédez déjà un compte ? "}
                <button 
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError('');
                  }}
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

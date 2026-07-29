import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Sparkles, LogIn, Eye, EyeOff } from 'lucide-react';
import api from '../utils/axiosConfig';
import { useUIStore } from '../store/useUIStore';
import toast from 'react-hot-toast';

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, setUser } = useUIStore();
  const [isLogin, setIsLogin] = useState(true);
  
  const [formData, setFormData] = useState({ firstName: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Gérer la soumission au Backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const payload = isLogin 
        ? { email: formData.email, password: formData.password } 
        : formData;
      
      const { data } = await api.post(endpoint.replace('/api', ''), payload);
      
      useUIStore.getState().setAccessToken(data.accessToken);
      setUser(data.user);
      
      toast.success(isLogin ? "Heureux de vous revoir ! 💖" : "Bienvenue dans l'univers LookMe ! ✨");
      
      setFormData({ firstName: '', email: '', password: '', phone: '' });
      closeAuthModal();
      
    } catch (err) {
      toast.error(err.response?.data?.message || "Échec de l'authentification");
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
          className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4"
          onClick={closeAuthModal}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden bg-white rounded-[3rem] shadow-2xl border border-white"
          >
            {/* Close Button */}
            <button 
              onClick={closeAuthModal}
              className="absolute top-6 right-6 p-3 bg-white/20 text-white rounded-full hover:bg-white/40 transition-colors z-20"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="bg-gray-900 p-12 text-center text-white relative overflow-hidden">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl"
              ></motion.div>
              
              <div className="relative z-10">
                <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-pink-500/20 rotate-6">
                  {isLogin ? <LogIn size={32} /> : <Sparkles size={32} />}
                </div>
                <h2 className="text-3xl font-black tracking-tighter italic mb-2">
                  {isLogin ? 'Connexion' : 'Inscription'}
                </h2>
                <p className="text-gray-400 font-medium text-sm px-8">
                  {isLogin ? 'Accédez à votre univers mode personnalisé.' : 'Créez votre profil pour une expérience unique.'}
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="p-10">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {!isLogin && (
                  <>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Prénom</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Votre prénom"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-500 font-bold transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Téléphone</label>
                      <input 
                        type="tel" 
                        required
                        placeholder="06XXXXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-500 font-bold transition-all"
                      />
                    </div>
                  </>
                )}
                
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-2 ml-1">Adresse E-mail</label>
                  <input 
                    type="email" 
                    required
                    placeholder="exemple@mail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-500 font-bold transition-all"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2 ml-1">
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400">Mot de Passe</label>
                    {isLogin && (
                      <button 
                        type="button"
                        onClick={() => toast.success("Lien de réinitialisation envoyé à votre email")}
                        className="text-[10px] text-pink-500 font-bold uppercase tracking-wider hover:underline"
                      >
                        Oublié ?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"} 
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-500 font-bold transition-all pr-14"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full h-16 mt-4 flex justify-center items-center gap-3 bg-pink-500 text-white rounded-2xl font-black text-xl shadow-xl shadow-pink-100 hover:bg-pink-600 transition-all transform active:scale-95 disabled:bg-gray-200"
                >
                  {loading ? <Loader2 size={24} className="animate-spin" /> : (isLogin ? 'Se Connecter' : "S'inscrire")}
                </button>
              </form>

              {/* Toggle Mode */}
              <div className="mt-10 text-center text-sm font-bold text-gray-400">
                {isLogin ? "Nouveau client ? " : "Déjà membre ? "}
                <button 
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-pink-500 font-black uppercase tracking-widest text-xs ml-2 hover:underline"
                >
                  {isLogin ? "Créer un compte" : "Se connecter"}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

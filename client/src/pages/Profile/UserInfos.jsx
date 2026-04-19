import React, { useState } from 'react';
import { useUIStore } from '../../store/useUIStore';
import { User, Mail, Phone, Lock, Edit3, Save, X, Loader2, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const UserInfos = () => {
  const { user, setUser } = useUIStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const [passData, setPassData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    // Validations
    if (!formData.email.includes('@')) return toast.error("Email invalide");
    if (formData.phone && !/^(06|07)\d{8}$/.test(formData.phone)) {
        return toast.error("Le téléphone doit être un numéro marocain valide (10 chiffres)");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('lookme_token');
      const { data } = await axios.put('http://localhost:5000/api/users/me', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(data);
      toast.success("Profil mis à jour avec succès");
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passData.newPassword.length < 6) return toast.error("Le mot de passe doit faire au moins 6 caractères");
    if (passData.newPassword !== passData.confirmPassword) return toast.error("Les mots de passe ne correspondent pas");

    setLoading(true);
    try {
      const token = localStorage.getItem('lookme_token');
      await axios.put('http://localhost:5000/api/users/me/password', {
        oldPassword: passData.oldPassword,
        newPassword: passData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Mot de passe mis à jour");
      setIsChangingPassword(false);
      setPassData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors du changement");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-gray-50 border-none rounded-2xl px-6 py-4 font-body text-sm focus:ring-2 focus:ring-[#C2185B] transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Mes Informations</h1>
      <p className="text-gray-400 font-body mb-10">Gérez vos coordonnées et la sécurité de votre compte.</p>

      <div className="space-y-8">
        
        {/* Personal Details Card */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-pink-50 text-[#C2185B] rounded-2xl flex items-center justify-center">
                  <User size={20} strokeWidth={1.5} />
               </div>
               <h3 className="font-heading font-bold text-gray-900">Coordonnées</h3>
            </div>
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-[#C2185B] font-bold text-xs uppercase tracking-widest hover:bg-pink-50 px-4 py-2 rounded-xl transition-all"
              >
                <Edit3 size={16} /> Modifier
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => { setIsEditing(false); setFormData({ firstName: user.firstName, email: user.email, phone: user.phone }); }} className="p-2 text-gray-400 hover:bg-gray-50 rounded-xl"><X size={20} /></button>
              </div>
            )}
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-2">Prénom</label>
                <input 
                  type="text" 
                  value={formData.firstName}
                  onChange={e => setFormData({...formData, firstName: e.target.value})}
                  disabled={!isEditing}
                  className={inputClass}
                   placeholder="Votre prénom"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-2">Téléphone</label>
                <input 
                  type="tel" 
                  value={formData.phone || ''}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  disabled={!isEditing}
                  className={inputClass}
                  placeholder="06XXXXXXXX"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-2">Email</label>
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                disabled={!isEditing}
                className={inputClass}
                 placeholder="votre@email.com"
              />
            </div>

            <AnimatePresence>
              {isEditing && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="pt-6"
                >
                  <button 
                    disabled={loading}
                    className="w-full bg-[#0A0A0A] text-white py-4 rounded-2xl font-body font-bold text-xs uppercase tracking-[3px] hover:bg-[#C2185B] transition-all flex items-center justify-center gap-3"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <><Save size={18} /> Sauvegarder les modifications</>}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        {/* Password Security Card */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-10 shadow-sm">
           <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center">
                    <Lock size={20} strokeWidth={1.5} />
                 </div>
                 <h3 className="font-heading font-bold text-gray-900">Mot de passe</h3>
              </div>
              <button 
                 onClick={() => setIsChangingPassword(!isChangingPassword)}
                 className="text-gray-400 hover:text-[#C2185B] font-bold text-xs uppercase tracking-widest transition-all"
              >
                 {isChangingPassword ? 'Annuler' : 'Changer'}
              </button>
           </div>

           <AnimatePresence>
              {isChangingPassword && (
                 <motion.form 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    onSubmit={handleChangePassword}
                    className="space-y-6 overflow-hidden pr-1"
                 >
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-2">Ancien mot de passe</label>
                       <div className="relative">
                          <input 
                             type={showPass ? "text" : "password"}
                             value={passData.oldPassword}
                             onChange={e => setPassData({...passData, oldPassword: e.target.value})}
                             className={inputClass}
                             required
                          />
                          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C2185B]">
                             {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                       </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-2">Nouveau mot de passe</label>
                          <input 
                             type="password"
                             value={passData.newPassword}
                             onChange={e => setPassData({...passData, newPassword: e.target.value})}
                             className={inputClass}
                             required
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-[2px] text-gray-400 ml-2">Confirmation</label>
                          <input 
                             type="password"
                             value={passData.confirmPassword}
                             onChange={e => setPassData({...passData, confirmPassword: e.target.value})}
                             className={inputClass}
                             required
                          />
                       </div>
                    </div>
                    <button 
                       disabled={loading}
                       className="w-full bg-[#0A0A0A] text-white py-4 rounded-2xl font-body font-bold text-xs uppercase tracking-[3px] hover:bg-[#C2185B] transition-all flex items-center justify-center gap-3"
                    >
                       {loading ? <Loader2 className="animate-spin" size={18} /> : "Mettre à jour le mot de passe"}
                    </button>
                 </motion.form>
              )}
           </AnimatePresence>

           {!isChangingPassword && (
              <p className="text-sm font-body text-gray-400 italic">Modifier régulièrement votre mot de passe pour garantir la sécurité de votre compte.</p>
           )}
        </div>

      </div>
    </div>
  );
};

export default UserInfos;

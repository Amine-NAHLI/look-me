import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../store/useUIStore';
import { Package, Tags, ShoppingBag, LayoutDashboard, PlusCircle, Trash2, Loader2, CheckCircle2, TrendingUp, DollarSign, Users, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';
import { fadeInUp, staggerContainer } from '../utils/animations';

export default function AdminDashboard() {
  const { user, logout } = useUIStore();
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  
  // States
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [prodForm, setProdForm] = useState({ name: '', description: '', price: '', category: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Stats
  const revenue = orders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.totalPrice, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const formatStat = (value, isLoading, isErr) => {
    if (isLoading) return "...";
    if (isErr) return "--";
    return value;
  };

  const config = {
    headers: { Authorization: `Bearer ${localStorage.getItem('lookme_token')}` }
  };

  useEffect(() => {
    if (user?.role !== 'admin') {
      window.location.href = '/';
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setIsError(false);
    try {
      const [catRes, prodRes, orderRes] = await Promise.all([
        axios.get('http://localhost:5000/api/categories'),
        axios.get('http://localhost:5000/api/products'),
        axios.get('http://localhost:5000/api/orders', config)
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
      setOrders(orderRes.data);
    } catch (err) {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'stats', label: 'Tableau de bord', icon: <LayoutDashboard size={18} /> },
    { id: 'products', label: 'Produits', icon: <ShoppingBag size={18} /> },
    { id: 'orders', label: 'Commandes', icon: <Package size={18} /> },
    { id: 'categories', label: 'Catégories', icon: <Tags size={18} /> },
  ];

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status }, config);
      toast.success("Statut mis à jour");
      fetchData();
    } catch (e) { toast.error("Échec de la mise à jour"); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return toast.error("Max 5MB");
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (!imageFile) return toast.error("Image requise");
    const formData = new FormData();
    Object.keys(prodForm).forEach(key => formData.append(key, prodForm[key]));
    formData.append('image', imageFile);
    
    try {
      await axios.post('http://localhost:5000/api/products', formData, config);
      toast.success("Produit ajouté !");
      setProdForm({ name: '', description: '', price: '', category: '' });
      setImagePreview(null);
      fetchData();
    } catch (e) { toast.error("Erreur lors de l'ajout"); }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F5]">
      {/* Sidebar */}
      <motion.nav 
        initial={{ x: -240 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        className="w-[240px] bg-[#0A0A0A] fixed h-full flex flex-col z-[100] overflow-y-auto"
      >
        <div className="p-[24px] border-b border-[#2A2A2A]">
          <h2 className="text-[22px] text-white font-body font-extrabold tracking-[-0.5px]">
            LOOK<span className="text-[#C2185B]">ME</span>
          </h2>
          <span className="font-body text-[10px] text-[#6B6B6B] uppercase tracking-[2px]">Admin</span>
        </div>
        
        <div className="flex-1 py-6 flex flex-col gap-1">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3 px-[24px] py-[12px] font-body text-[13px] font-medium transition-colors relative ${
                activeTab === item.id ? 'text-white' : 'text-[#9E9E9E] hover:text-white hover:bg-[#1A1A1A]'
              }`}
            >
              {activeTab === item.id && (
                <motion.div layoutId="activeTab" className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#C2185B]" />
              )}
              {activeTab === item.id && <span className="absolute inset-0 bg-[#1A1A1A] -z-10" />}
              <span className="text-[inherit] opacity-80">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="ml-[240px] flex-1 min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-[#F5F5F5] border-b flex items-center justify-between border-[var(--border)] px-[40px] py-[24px] sticky top-0 z-[50]">
          <div>
            <div className="flex text-[11px] font-body uppercase tracking-[2px] text-[var(--gray)] mb-2 gap-2 items-center">
              <span>Administration</span>
              <ChevronRight size={12} />
              <span className="text-[var(--dark)]">{menuItems.find(m => m.id === activeTab)?.label}</span>
            </div>
            <h1 className="font-body font-semibold text-[20px] text-[var(--dark)]">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h1>
          </div>
          <button 
            onClick={() => {
              fetchData();
              toast.success("Données actualisées");
            }}
            className="w-10 h-10 flex items-center justify-center bg-white border border-[var(--border)] rounded-[var(--radius)] hover:bg-[#F5F5F5] transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </header>

        <main className="flex-1 p-[40px]">
          <AnimatePresence mode="wait">
            {activeTab === 'stats' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="stats">
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <StatCard icon={<TrendingUp />} label="Revenus (Livrés)" value={isError ? "--" : (loading ? "..." : formatPrice(revenue))} />
                  <StatCard icon={<ShoppingBag />} label="Commandes Totales" value={formatStat(orders.length, loading, isError)} />
                  <StatCard icon={<AlertCircle />} label="En attente" value={formatStat(pendingOrders, loading, isError)} />
                  <StatCard icon={<Package />} label="Articles catalogue" value={formatStat(products.length, loading, isError)} />
                </motion.div>
                <div className="bg-white p-[40px] rounded-[var(--radius)] shadow-[var(--shadow-sm)] border border-[var(--border)] text-center">
                  <TrendingUp size={48} className="mx-auto text-[var(--gray)] opacity-30 mb-4" strokeWidth={1} />
                  <h3 className="font-heading italic text-[24px] text-[var(--dark)] mb-4">Analyse des Ventes</h3>
                  <p className="font-body text-[14px] text-[var(--gray)] max-w-md mx-auto">
                    {isError 
                      ? "Démarrez le serveur pour voir les graphiques de ventes." 
                      : "L'interface d'analyse détaillée sera bientôt disponible ici."}
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="prod">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Add Product Form */}
                  <form onSubmit={addProduct} className="bg-white p-[24px] rounded-[var(--radius)] shadow-[var(--shadow-sm)] border border-[var(--border)] h-fit space-y-5">
                    <h3 className="font-body font-semibold text-[14px] text-[var(--dark)] mb-4 pb-4 border-b border-[var(--border)] uppercase tracking-wider">Nouveau Produit</h3>
                    <input required placeholder="Nom de l'article" className="w-full px-4 py-3 bg-white border border-[var(--border)] focus:outline-none focus:border-[#C2185B] rounded-[var(--radius-sm)] font-body text-[14px]" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} />
                    <textarea required placeholder="Description détaillée..." className="w-full px-4 py-3 bg-white border border-[var(--border)] focus:outline-none focus:border-[#C2185B] rounded-[var(--radius-sm)] font-body text-[14px] h-24" value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <input required type="number" placeholder="Prix (DH)" className="w-full px-4 py-3 bg-white border border-[var(--border)] focus:outline-none focus:border-[#C2185B] rounded-[var(--radius-sm)] font-body text-[14px]" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: e.target.value})} />
                      <select required className="w-full px-4 py-3 bg-white border border-[var(--border)] focus:outline-none focus:border-[#C2185B] rounded-[var(--radius-sm)] font-body text-[14px]" value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})}>
                        <option value="">Rayon</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                    {/* Image Upload */}
                    <div className="relative group">
                      <div className={`aspect-[4/3] rounded-[var(--radius-sm)] border-[1.5px] border-dashed flex items-center justify-center overflow-hidden transition-all ${imagePreview ? 'border-[#C2185B]' : 'border-[var(--border)] hover:border-[#1C1C1C]'}`}>
                        {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <PlusCircle className="text-[var(--gray)] opacity-60" size={32} strokeWidth={1} />}
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                      </div>
                      <p className="text-[10px] uppercase font-body tracking-[1px] text-center mt-3 text-[var(--gray)]">Cliquez pour téléverser (Max 5MB)</p>
                    </div>
                    <button className="w-full bg-[#1C1C1C] text-white font-body font-semibold text-[11px] uppercase tracking-[2px] py-[14px] rounded-[var(--radius-sm)] hover:bg-[#C2185B] transition-colors mt-4">Enregistrer</button>
                  </form>

                  {/* Products List */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-[var(--radius)] shadow-[var(--shadow-sm)] overflow-hidden border border-[var(--border)]">
                      <table className="w-full text-left">
                         <thead className="bg-[#F5F5F5] font-body font-semibold text-[11px] uppercase tracking-[1px] text-[var(--gray)] border-b border-[var(--border)]">
                           <tr>
                             <th className="px-6 py-4">Produit</th>
                             <th className="px-6 py-4">Prix</th>
                             <th className="px-6 py-4 text-right">Actions</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-[#F0F0F0]">
                           {products.map(p => (
                             <motion.tr variants={fadeInUp} key={p._id} className="hover:bg-[#FFF8FB] transition-colors">
                               <td className="px-6 py-4 flex items-center gap-4">
                                  <div className="w-[40px] h-[50px] overflow-hidden rounded-[var(--radius-sm)] bg-[#F5F5F5]">
                                    <img src={p.image} className="w-full h-full object-cover" />
                                  </div>
                                  <span className="font-body font-medium text-[13px] text-[var(--dark)]">{p.name}</span>
                               </td>
                               <td className="px-6 py-4 text-[13px] font-body font-semibold text-[#1C1C1C]">{formatPrice(p.price)}</td>
                               <td className="px-6 py-4 text-right">
                                  <button className="text-[11px] font-body uppercase tracking-[1px] text-[var(--gray)] hover:text-[#C2185B] px-3 py-1 transition-colors">Modifier</button>
                                  <button className="text-[11px] font-body uppercase tracking-[1px] text-[var(--error)] hover:text-[#880E4F] px-3 py-1 transition-colors">Supprimer</button>
                               </td>
                             </motion.tr>
                           ))}
                           {products.length === 0 && (
                             <tr><td colSpan="3" className="px-6 py-8 text-center text-[var(--gray)] font-body text-[13px]">Aucun produit trouvé</td></tr>
                           )}
                         </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="ord">
                <div className="bg-white rounded-[var(--radius)] shadow-[var(--shadow-sm)] overflow-hidden border border-[var(--border)]">
                  <table className="w-full text-left">
                    <thead className="bg-[#F5F5F5] font-body font-semibold text-[11px] uppercase tracking-[1px] text-[var(--gray)] border-b border-[var(--border)]">
                      <tr>
                        <th className="px-6 py-4">Commande</th>
                        <th className="px-6 py-4">Client</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Statut</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0F0F0]">
                      {orders.map(order => (
                        <motion.tr variants={fadeInUp} key={order._id} className="hover:bg-[#FFF8FB] transition-colors">
                          <td className="px-6 py-4 font-body font-medium text-[13px] text-[var(--gray)]">#{order._id.slice(-6).toUpperCase()}</td>
                          <td className="px-6 py-4">
                            <p className="font-body font-medium text-[13px] text-[var(--dark)]">{order.shippingAddress?.fullName}</p>
                            <p className="font-body text-[12px] text-[var(--gray)]">{order.shippingAddress?.phone}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-body font-bold text-[#1C1C1C] text-[13px]">{formatPrice(order.totalPrice)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-[10px] py-[4px] rounded-[4px] font-body font-medium text-[11px] uppercase ${
                              order.status === 'delivered' ? 'bg-[#F3E5F5] text-[#6A1B9A]' :
                              order.status === 'pending' ? 'bg-[#FFF3E0] text-[#E65100]' :
                              order.status === 'confirmed' ? 'bg-[#E8F5E9] text-[#2E7D32]' :
                              'bg-[#E3F2FD] text-[#1565C0]'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <select 
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              value={order.status}
                              className="bg-white border border-[var(--border)] rounded-[var(--radius-sm)] text-[12px] text-[var(--dark)] font-body py-1.5 px-3 focus:outline-none focus:border-[#C2185B] cursor-pointer"
                            >
                              <option value="pending">En attente</option>
                              <option value="confirmed">Confirmée</option>
                              <option value="shipped">Expédiée</option>
                              <option value="delivered">Livrée</option>
                              <option value="cancelled">Annulée</option>
                            </select>
                          </td>
                        </motion.tr>
                      ))}
                      {orders.length === 0 && (
                        <tr><td colSpan="5" className="px-6 py-8 text-center text-[var(--gray)] font-body text-[13px]">Aucune commande trouvée</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'categories' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="cat">
                <div className="bg-white p-[40px] rounded-[var(--radius)] shadow-[var(--shadow-sm)] border border-[var(--border)] text-center">
                  <Tags size={48} className="mx-auto text-[var(--gray)] opacity-30 mb-6" strokeWidth={1} />
                  <h3 className="font-heading italic text-[24px] text-[var(--dark)] mb-2">Gestion des Catégories</h3>
                  <p className="font-body text-[14px] text-[var(--gray)] mb-8">Ajoutez ou modifiez vos catégories de produits.</p>
                  
                  <div className="max-w-[400px] mx-auto space-y-6">
                    <div className="flex gap-2">
                       <input type="text" placeholder="Nouvelle catégorie..." className="flex-1 px-4 py-[12px] border border-[var(--border)] rounded-[var(--radius-sm)] focus:outline-none focus:border-[#C2185B] font-body text-[14px] bg-[#F5F5F5]" />
                       <button className="bg-[#1C1C1C] hover:bg-[#C2185B] text-white px-6 py-[12px] rounded-[var(--radius-sm)] font-body font-semibold text-[11px] uppercase tracking-[1.5px] transition-colors">Ajouter</button>
                    </div>
                    {categories.length > 0 ? (
                      <ul className="text-left divide-y divide-[#F0F0F0] border border-[var(--border)] rounded-[var(--radius-sm)] bg-white">
                        {categories.map(c => (
                          <li key={c._id} className="px-4 py-3 flex justify-between items-center hover:bg-[#FFF8FB] transition-colors">
                            <span className="font-body font-medium text-[13px] text-[var(--dark)]">{c.name}</span>
                            <button className="text-[11px] font-body uppercase tracking-[1px] text-[var(--error)] hover:text-[#880E4F] transition-colors">Supprimer</button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="font-body text-[13px] text-[var(--gray)] mt-4">Aucune catégorie disponible</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <motion.div variants={fadeInUp} className="bg-white p-[24px] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] flex flex-col items-start relative text-left">
      <div className="absolute top-[24px] right-[24px] text-[#C2185B]">
        {React.cloneElement(icon, { size: 24, strokeWidth: 1.5 })}
      </div>
      <div>
        <p className="font-body font-medium text-[11px] uppercase tracking-[1.5px] text-[var(--gray)] mb-3">{label}</p>
        <p className="font-body font-bold text-[32px] text-[var(--dark)] tracking-tight leading-none">{value}</p>
      </div>
    </motion.div>
  );
}

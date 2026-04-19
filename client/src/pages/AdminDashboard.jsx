import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../store/useUIStore';
import { Package, Tags, ShoppingBag, LayoutDashboard, PlusCircle, Trash2, Loader2, CheckCircle2, TrendingUp, DollarSign, Users, AlertCircle, RefreshCw, ChevronRight, Menu, X } from 'lucide-react';
import api from '../utils/axiosConfig';
import { getImageUrl } from '../utils/imageUrl';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';
import { fadeInUp, staggerContainer, drawerVariants, overlayVariants } from '../utils/animations';
import ImageUploader from '../components/ImageUploader';

export default function AdminDashboard() {
  const { user, logout } = useUIStore();
  const [activeTab, setActiveTab] = useState('stats');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar
  
  // States
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  
  // Forms
  const [newCatName, setNewCatName] = useState('');
  const [newCatImage, setNewCatImage] = useState(null);
  
  const [prodForm, setProdForm] = useState({ name: '', description: '', price: '', category: '', image: null });
  const [editingProd, setEditingProd] = useState(null);
  const [btnLoading, setBtnLoading] = useState(false);

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
        api.get('/categories'),
        api.get('/products'),
        api.get('/orders')
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
      await api.put(`/orders/${id}/status`, { status });
      toast.success("Statut mis à jour");
      fetchData();
    } catch (e) { toast.error("Échec de la mise à jour"); }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    if (!prodForm.image) return toast.error("Image requise");
    
    setBtnLoading(true);
    try {
      if (editingProd) {
        await api.put(`/products/${editingProd}`, prodForm);
        toast.success("Produit mis à jour !");
      } else {
        await api.post('/products', prodForm);
        toast.success("Produit ajouté !");
      }
      setProdForm({ name: '', description: '', price: '', category: '', image: null });
      setEditingProd(null);
      fetchData();
    } catch (e) { 
      toast.error(e.response?.data?.message || "Erreur"); 
    } finally {
      setBtnLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Supprimer ce produit ?")) return;
    try {
      await api.delete(`/products/${id}`);
      toast.success("Produit supprimé");
      fetchData();
    } catch (e) { toast.error("Erreur"); }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm("Supprimer cette catégorie ?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Catégorie supprimée");
      fetchData();
    } catch (e) { toast.error("Erreur"); }
  };

  const addCategory = async (e) => {
    e.preventDefault();
    if (!newCatName || !newCatImage) return toast.error("Nom et image requis");
    setBtnLoading(true);
    try {
      await api.post('/categories', { name: newCatName, image: newCatImage });
      toast.success("Catégorie ajoutée");
      setNewCatName('');
      setNewCatImage(null);
      fetchData();
    } catch(e) { toast.error("Erreur"); }
    finally { setBtnLoading(false); }
  };

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-[#2A2A2A] flex justify-between items-center">
        <div>
          <h2 className="text-[22px] text-white font-body font-extrabold tracking-[-0.5px]">
            LOOK<span className="text-[#C2185B]">ME</span>
          </h2>
          <span className="font-body text-[10px] text-[#6B6B6B] uppercase tracking-[2px]">Admin</span>
        </div>
        <button className="lg:hidden text-white" onClick={() => setIsSidebarOpen(false)}>
          <X size={24} />
        </button>
      </div>
      
      <div className="flex-1 py-6 flex flex-col gap-1 overflow-y-auto">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); }}
            className={`flex items-center gap-3 px-6 py-3 font-body text-[13px] font-medium transition-colors relative ${
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
    </>
  );

  return (
    <div className="flex min-h-screen bg-[#F5F5F5] w-full overflow-hidden">
      
      {/* Desktop Sidebar */}
      <nav className="w-[240px] bg-[#0A0A0A] hidden lg:flex flex-col h-screen sticky top-0 z-[100]">
        <SidebarContent />
      </nav>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
              className="fixed inset-0 bg-black/50 z-[90] lg:hidden" 
              onClick={() => setIsSidebarOpen(false)} 
            />
            <motion.nav 
              variants={drawerVariants} initial="hidden" animate="visible" exit="exit"
              className="w-[280px] bg-[#0A0A0A] fixed h-full flex flex-col z-[100] lg:hidden left-0 top-0"
              style={{ originX: 0 }}
            >
              <SidebarContent />
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 w-full min-h-screen flex flex-col overflow-x-hidden">
        {/* Header */}
        <header className="bg-white border-b flex items-center justify-between border-[var(--border)] px-4 md:px-10 py-4 md:py-6 sticky top-0 z-[50]">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-[var(--dark)]" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <div>
              <div className="hidden md:flex text-[11px] font-body uppercase tracking-[2px] text-[var(--gray)] mb-2 gap-2 items-center">
                <span>Administration</span>
                <ChevronRight size={12} />
                <span className="text-[var(--dark)]">{menuItems.find(m => m.id === activeTab)?.label}</span>
              </div>
              <h1 className="font-body font-semibold text-[18px] md:text-[20px] text-[var(--dark)]">
                {menuItems.find(m => m.id === activeTab)?.label}
              </h1>
            </div>
          </div>
          <button 
            onClick={() => {
              fetchData();
              toast.success("Données actualisées");
            }}
            className="w-10 h-10 flex items-center justify-center bg-[#F5F5F5] border border-[var(--border)] rounded-[var(--radius)] hover:bg-[var(--border)] transition-colors"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </header>

        <main className="flex-1 p-4 md:p-10 w-full">
          <AnimatePresence mode="wait">
            
            {activeTab === 'stats' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="stats">
                <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                  <StatCard icon={<TrendingUp />} label="Revenus net" value={isError ? "--" : (loading ? "..." : formatPrice(revenue))} />
                  <StatCard icon={<ShoppingBag />} label="Commandes" value={formatStat(orders.length, loading, isError)} />
                  <StatCard icon={<AlertCircle />} label="En attente" value={formatStat(pendingOrders, loading, isError)} />
                  <StatCard icon={<Package />} label="Catalogue" value={formatStat(products.length, loading, isError)} />
                </motion.div>
                <div className="bg-white p-6 md:p-10 rounded-[var(--radius)] shadow-[var(--shadow-sm)] border border-[var(--border)] text-center">
                  <TrendingUp size={48} className="mx-auto text-[var(--gray)] opacity-30 mb-4" strokeWidth={1} />
                  <h3 className="font-heading italic text-[24px] text-[var(--dark)] mb-4">Analyse des Ventes</h3>
                  <p className="font-body text-[14px] text-[var(--gray)] max-w-md mx-auto">
                    {isError 
                      ? "Démarrez le serveur pour voir les graphiques de ventes." 
                      : "L'interface graphique est en cours d'intégration."}
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="prod">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Add Product Form */}
                  <form onSubmit={addProduct} className="bg-white p-6 rounded-[var(--radius)] shadow-[var(--shadow-sm)] border border-[var(--border)] h-fit space-y-5">
                    <h3 className="font-body font-semibold text-[14px] text-[var(--dark)] mb-4 pb-4 border-b border-[var(--border)] uppercase tracking-wider">Nouveau Produit</h3>
                    
                    <ImageUploader onUploadComplete={(url) => setProdForm({...prodForm, image: url})} />

                    <input required placeholder="Nom de l'article" className="w-full px-4 py-3 bg-white border border-[var(--border)] focus:outline-none focus:border-[#C2185B] rounded-[var(--radius-sm)] font-body text-[14px]" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} />
                    <textarea required placeholder="Description détaillée..." className="w-full px-4 py-3 bg-white border border-[var(--border)] focus:outline-none focus:border-[#C2185B] rounded-[var(--radius-sm)] font-body text-[14px] h-24" value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <input required type="number" placeholder="Prix (DH)" className="w-full px-4 py-3 bg-white border border-[var(--border)] focus:outline-none focus:border-[#C2185B] rounded-[var(--radius-sm)] font-body text-[14px]" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: e.target.value})} />
                      <select required className="w-full px-4 py-3 bg-white border border-[var(--border)] focus:outline-none focus:border-[#C2185B] rounded-[var(--radius-sm)] font-body text-[14px]" value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})}>
                        <option value="">Rayon</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                    
                    <button 
                      disabled={btnLoading}
                      className="w-full bg-[#1C1C1C] text-white font-body font-semibold text-[11px] uppercase tracking-[2px] py-[14px] rounded-[var(--radius-sm)] hover:bg-[#C2185B] transition-colors mt-4 flex items-center justify-center gap-2"
                    >
                      {btnLoading ? <Loader2 size={16} className="animate-spin" /> : (editingProd ? 'Mettre à jour' : 'Enregistrer')}
                    </button>
                    {editingProd && (
                      <button 
                        type="button"
                        onClick={() => { setEditingProd(null); setProdForm({ name: '', description: '', price: '', category: '', image: null }); }}
                        className="w-full bg-gray-100 text-gray-500 font-body font-semibold text-[11px] uppercase tracking-[2px] py-[10px] rounded-[var(--radius-sm)] hover:bg-gray-200 transition-colors"
                      >
                        Annuler
                      </button>
                    )}
                  </form>

                  {/* Products List */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-[var(--radius)] shadow-[var(--shadow-sm)] border border-[var(--border)] overflow-x-auto">
                      <table className="w-full text-left min-w-[500px]">
                         <thead className="bg-[#F5F5F5] font-body font-semibold text-[10px] md:text-[11px] uppercase tracking-[1px] text-[var(--gray)] border-b border-[var(--border)]">
                           <tr>
                             <th className="px-4 md:px-6 py-4">Produit</th>
                             <th className="px-4 md:px-6 py-4">Prix</th>
                             <th className="px-4 md:px-6 py-4 text-right">Actions</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-[#F0F0F0]">
                           {products.map(p => (
                             <motion.tr variants={fadeInUp} key={p._id} className="hover:bg-[#FFF8FB] transition-colors">
                               <td className="px-4 md:px-6 py-4 flex items-center gap-3 md:gap-4">
                                  <div className="w-[36px] h-[48px] md:w-[40px] md:h-[50px] overflow-hidden rounded-[var(--radius-sm)] bg-[#F5F5F5] shrink-0">
                                    <img src={getImageUrl(p.image)} className="w-full h-full object-cover" />
                                  </div>
                                  <span className="font-body font-medium text-[12px] md:text-[13px] text-[var(--dark)] truncate max-w-[120px] md:max-w-xs">{p.name}</span>
                               </td>
                               <td className="px-4 md:px-6 py-4 text-[12px] md:text-[13px] font-body font-semibold text-[#1C1C1C]">{formatPrice(p.price)}</td>
                               <td className="px-4 md:px-6 py-4 text-right flex items-center justify-end gap-2">
                                  <button 
                                    onClick={() => {
                                      setEditingProd(p._id);
                                      setProdForm({ name: p.name, description: p.description, price: p.price, category: p.category?._id || p.category, image: p.image });
                                    }}
                                    className="text-[10px] md:text-[11px] font-body uppercase tracking-[1px] text-[var(--dark)] hover:text-[#C2185B] px-2 py-1 transition-colors"
                                  >
                                    Modifier
                                  </button>
                                  <button 
                                    onClick={() => deleteProduct(p._id)}
                                    className="text-[10px] md:text-[11px] font-body uppercase tracking-[1px] text-[var(--error)] hover:text-[#880E4F] px-2 md:px-3 py-1 transition-colors"
                                  >
                                    Supprimer
                                  </button>
                               </td>
                             </motion.tr>
                           ))}
                         </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Other tabs follow the exact same updated mobile-friendly patterns */}
            {activeTab === 'categories' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="cat">
                <div className="bg-white p-6 md:p-10 rounded-[var(--radius)] shadow-[var(--shadow-sm)] border border-[var(--border)] text-center w-full max-w-lg mx-auto">
                  <Tags size={48} className="mx-auto text-[var(--gray)] opacity-30 mb-6" strokeWidth={1} />
                  <h3 className="font-heading italic text-[24px] text-[var(--dark)] mb-2">Rayons</h3>
                  
                  <form onSubmit={addCategory} className="space-y-6 mt-8 text-left">
                    <ImageUploader onUploadComplete={setNewCatImage} />
                    <input required value={newCatName} onChange={e=>setNewCatName(e.target.value)} type="text" placeholder="Nom de la catégorie" className="w-full px-4 py-3 border border-[var(--border)] rounded-[var(--radius-sm)] focus:outline-none focus:border-[#C2185B] font-body text-[14px] bg-[#F5F5F5]" />
                    <button 
                      type="submit" 
                      disabled={btnLoading}
                      className="w-full bg-[#1C1C1C] hover:bg-[#C2185B] text-white px-6 py-3 rounded-[var(--radius-sm)] font-body font-semibold text-[11px] uppercase tracking-[1.5px] transition-colors flex justify-center items-center gap-2"
                    >
                      {btnLoading ? <Loader2 size={16} className="animate-spin" /> : 'Ajouter la catégorie'}
                    </button>
                  </form>

                  {categories.length > 0 && (
                    <ul className="mt-8 text-left divide-y divide-[#F0F0F0] border border-[var(--border)] rounded-[var(--radius-sm)] bg-white">
                      {categories.map(c => (
                        <li key={c._id} className="px-4 py-3 flex justify-between items-center hover:bg-[#FFF8FB] transition-colors">
                          <span className="font-body font-medium text-[13px] text-[var(--dark)] flex items-center gap-3">
                            <span className="w-8 h-8 bg-gray-100 rounded-full overflow-hidden shrink-0">
                               {c.image && <img src={getImageUrl(c.image)} alt="" className="w-full h-full object-cover" />}
                            </span>
                            {c.name}
                          </span>
                          <button 
                            onClick={() => deleteCategory(c._id)}
                            className="text-[11px] font-body uppercase tracking-[1px] text-[var(--error)] hover:text-[#880E4F] transition-colors"
                          >
                            Supprimer
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="ord">
                <div className="bg-white rounded-[var(--radius)] shadow-[var(--shadow-sm)] border border-[var(--border)] overflow-x-auto">
                  <table className="w-full text-left min-w-[700px]">
                    <thead className="bg-[#F5F5F5] font-body font-semibold text-[11px] uppercase tracking-[1px] text-[var(--gray)] border-b border-[var(--border)]">
                      <tr>
                        <th className="px-6 py-4">Client</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Statut</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0F0F0]">
                      {orders.map(order => (
                        <motion.tr variants={fadeInUp} key={order._id} className="hover:bg-[#FFF8FB] transition-colors">
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
                    </tbody>
                  </table>
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
    <motion.div variants={fadeInUp} className="bg-white p-4 md:p-[24px] rounded-[var(--radius-md)] shadow-[var(--shadow-sm)] flex flex-col items-start relative text-left">
      <div className="absolute top-4 md:top-[24px] right-4 md:right-[24px] text-[#C2185B]">
        {React.cloneElement(icon, { size: 20, strokeWidth: 1.5 })}
      </div>
      <div>
        <p className="font-body font-medium text-[10px] md:text-[11px] uppercase tracking-[1px] md:tracking-[1.5px] text-[var(--gray)] mb-2 md:mb-3">{label}</p>
        <p className="font-body font-bold text-[24px] md:text-[32px] text-[var(--dark)] tracking-tight leading-none">{value}</p>
      </div>
    </motion.div>
  );
}

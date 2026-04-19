import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '../store/useUIStore';
import { Package, Tags, ShoppingBag, LogOut, PlusCircle, Trash2, Loader2, CheckCircle2, TrendingUp, DollarSign, Users, AlertCircle, RefreshCw, ChevronDown } from 'lucide-react';
import axios from 'axios';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';

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
      toast.success("Données actualisées ✓");
    } catch (err) {
      setIsError(true);
      toast.error("Erreur de synchronisation des données");
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-gray-900">
              Admin<span className="text-pink-500 not-italic">Panel</span>
            </h1>
            <p className="text-gray-400 font-bold text-sm flex items-center gap-2 mt-2 uppercase tracking-widest">
              <CheckCircle2 size={16} className="text-green-500" /> Connecté en tant que Super Admin
            </p>
          </div>
          <button onClick={fetchData} className="p-4 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<TrendingUp />} label="Revenus (Livrés)" value={isError ? "--" : (loading ? "..." : formatPrice(revenue))} color="pink" />
          <StatCard icon={<ShoppingBag />} label="Commandes Totales" value={formatStat(orders.length, loading, isError)} color="blue" />
          <StatCard icon={<AlertCircle />} label="En attente" value={formatStat(pendingOrders, loading, isError)} color="yellow" />
          <StatCard icon={<Package />} label="Articles catalogue" value={formatStat(products.length, loading, isError)} color="green" />
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-8 border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'stats', label: 'Bilan', icon: <TrendingUp size={16} /> },
            { id: 'products', label: 'Produits', icon: <ShoppingBag size={16} /> },
            { id: 'orders', label: 'Commandes', icon: <Package size={16} /> },
            { id: 'categories', label: 'Rayons', icon: <Tags size={16} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 pb-4 font-medium text-[13px] uppercase tracking-wider transition-all border-b-2 ${
                activeTab === tab.id 
                  ? 'border-pink-500 text-pink-500' 
                  : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeTab === 'stats' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="stats">
                <div className="bg-white p-12 rounded-lg shadow-sm border border-gray-200 text-center">
                  <TrendingUp size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Bilan et Statistiques</h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    {isError 
                      ? "Démarrez le serveur pour voir les données réelles et les graphiques de ventes." 
                      : "Les statistiques s'affichent correctement. De futures intégrations graphiques apparaîtront ici."}
                  </p>
                </div>
              </motion.div>
            )}

            {activeTab === 'products' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="prod">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Add Product Form */}
                  <form onSubmit={addProduct} className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 h-fit space-y-5">
                    <h3 className="text-lg font-bold text-[#1A1A2E] mb-2 border-b pb-4">Ajouter un produit</h3>
                    <input required placeholder="Nom de l'article" className="w-full px-4 py-3 bg-gray-50 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-pink-500 text-sm" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} />
                    <textarea required placeholder="Description détaillée..." className="w-full px-4 py-3 bg-gray-50 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-pink-500 text-sm h-24" value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <input required type="number" placeholder="Prix (DH)" className="w-full px-4 py-3 bg-gray-50 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-pink-500 text-sm" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: e.target.value})} />
                      <select required className="w-full px-4 py-3 bg-gray-50 rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-pink-500 text-sm" value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})}>
                        <option value="">Rayon</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                    {/* Image Upload */}
                    <div className="relative group">
                      <div className={`aspect-[4/3] rounded-md border-2 border-dashed flex items-center justify-center overflow-hidden transition-all ${imagePreview ? 'border-pink-500' : 'border-gray-200 hover:border-pink-300'}`}>
                        {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <PlusCircle className="text-gray-300" size={32} />}
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                      </div>
                      <p className="text-[11px] uppercase tracking-wider text-center mt-2 text-gray-500">Cliquez pour téléverser (Max 5MB)</p>
                    </div>
                    <button className="w-full bg-[#1A1A2E] text-white hover:bg-pink-500 px-4 py-3 rounded-md text-sm font-semibold transition-colors">Enregistrer le produit</button>
                  </form>

                  {/* Products List */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                      <table className="w-full text-left">
                         <thead className="bg-gray-50 text-[11px] font-semibold uppercase tracking-wider text-gray-500 border-b border-gray-200">
                           <tr>
                             <th className="px-6 py-4">Produit</th>
                             <th className="px-6 py-4">Prix</th>
                             <th className="px-6 py-4 text-right">Actions</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-100">
                           {products.map(p => (
                             <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                               <td className="px-6 py-4 flex items-center gap-4">
                                  <img src={p.image} className="w-12 h-16 rounded-md object-cover border border-gray-200" />
                                  <span className="font-medium text-sm text-[#1A1A2E]">{p.name}</span>
                               </td>
                               <td className="px-6 py-4 text-sm font-semibold text-pink-600">{formatPrice(p.price)}</td>
                               <td className="px-6 py-4 text-right">
                                  <button className="text-[12px] text-gray-500 hover:text-pink-500 px-3 py-1 font-medium transition-colors">Modifier</button>
                                  <button className="text-[12px] text-rose-500 hover:text-rose-700 px-3 py-1 font-medium transition-colors">Supprimer</button>
                               </td>
                             </tr>
                           ))}
                           {products.length === 0 && (
                             <tr><td colSpan="3" className="px-6 py-8 text-center text-gray-500 text-sm">Aucun produit trouvé</td></tr>
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
                <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
                  <table className="w-full text-left">
                    <thead className="bg-[#1A1A2E] text-[11px] uppercase tracking-wider text-white">
                      <tr>
                        <th className="px-6 py-4">Commande</th>
                        <th className="px-6 py-4">Client</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Statut</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map(order => (
                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-xs text-gray-600">#{order._id.slice(-6).toUpperCase()}</td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-sm text-[#1A1A2E]">{order.shippingAddress?.fullName}</p>
                            <p className="text-[12px] text-gray-500">{order.shippingAddress?.phone}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-pink-600 text-sm">{formatPrice(order.totalPrice)}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-md text-[11px] font-semibold uppercase tracking-wider ${
                              order.status === 'delivered' ? 'bg-green-50 text-green-700 border border-green-200' :
                              order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                              'bg-indigo-50 text-indigo-700 border border-indigo-200'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <select 
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              value={order.status}
                              className="bg-white border border-gray-200 rounded-md text-[12px] text-gray-700 font-medium px-3 py-2 focus:ring-1 focus:ring-pink-500 outline-none"
                            >
                              <option value="pending">En attente</option>
                              <option value="confirmed">Confirmée</option>
                              <option value="shipped">Expédiée</option>
                              <option value="delivered">Livrée</option>
                              <option value="cancelled">Annulée</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-500 text-sm">Aucune commande trouvée</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'categories' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="cat">
                <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 text-center">
                  <Tags size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Gestion des Rayons (Catégories)</h3>
                  <p className="text-gray-500 mb-6">Ajoutez ou modifiez vos catégories ici.</p>
                  
                  <div className="max-w-md mx-auto space-y-4">
                    <div className="flex gap-2">
                       <input type="text" placeholder="Nouveau rayon..." className="flex-1 px-4 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-pink-500 outline-none text-sm" />
                       <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors">Ajouter</button>
                    </div>
                    {categories.length > 0 ? (
                      <ul className="text-left divide-y border rounded-md">
                        {categories.map(c => (
                          <li key={c._id} className="p-3 flex justify-between items-center bg-gray-50">
                            <span className="text-sm font-medium">{c.name}</span>
                            <button className="text-rose-500 hover:text-rose-700 text-xs">Supprimer</button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm text-gray-400 mt-4">Aucune catégorie disponible</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  const colors = {
    pink: "bg-pink-50 text-pink-600 border-pink-100",
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    yellow: "bg-yellow-50 text-yellow-600 border-yellow-100",
    green: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex items-center gap-5 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 border ${colors[color]}`}>
        {React.cloneElement(icon, { size: 22 })}
      </div>
      <div>
        <p className="text-[12px] font-medium uppercase tracking-wider text-gray-500 mb-1">{label}</p>
        <p className="text-xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );
}

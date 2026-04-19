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
          <StatCard icon={<TrendingUp />} label="Revenus (Livrés)" value={formatPrice(revenue)} color="pink" />
          <StatCard icon={<ShoppingBag />} label="Commandes Totales" value={orders.length} color="blue" />
          <StatCard icon={<AlertCircle />} label="En attente" value={pendingOrders} color="yellow" />
          <StatCard icon={<Package />} label="Articles catalogue" value={products.length} color="green" />
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 p-2 bg-white rounded-3xl shadow-sm border border-gray-100 mb-12 overflow-x-auto no-scrollbar">
          {[
            { id: 'stats', label: 'Bilan', icon: <TrendingUp size={18} /> },
            { id: 'products', label: 'Produits', icon: <ShoppingBag size={18} /> },
            { id: 'orders', label: 'Commandes', icon: <Package size={18} /> },
            { id: 'categories', label: 'Rayons', icon: <Tags size={18} /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-pink-500 text-white shadow-lg shadow-pink-200' : 'text-gray-400 hover:text-gray-900'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          <AnimatePresence mode="wait">
            {activeTab === 'products' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} key="prod">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Add Product Form */}
                  <form onSubmit={addProduct} className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50 h-fit space-y-6">
                    <h3 className="text-xl font-black italic mb-6">Ajouter une pièce</h3>
                    <input required placeholder="Nom de l'article" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-500 font-bold" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} />
                    <textarea required placeholder="Description détaillée..." className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-500 font-bold h-32" value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <input required type="number" placeholder="Prix (DH)" className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-500 font-bold" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: e.target.value})} />
                      <select required className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-pink-500 font-bold" value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})}>
                        <option value="">Rayon</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                    {/* Image Upload */}
                    <div className="relative group">
                      <div className={`aspect-[4/3] rounded-3xl border-2 border-dashed border-gray-100 flex items-center justify-center overflow-hidden transition-all ${imagePreview ? 'border-pink-500' : 'hover:border-pink-200'}`}>
                        {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" /> : <PlusCircle className="text-gray-200" size={48} />}
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-center mt-3 text-gray-400">Cliquez pour téléverser (JPG, PNG, WEBP)</p>
                    </div>
                    <button className="w-full btn-primary h-14">Publier l'article</button>
                  </form>

                  {/* Products List */}
                  <div className="lg:col-span-2 space-y-4">
                    {products.map(p => (
                      <div key={p._id} className="bg-white p-4 rounded-3xl shadow-md flex items-center gap-6 border border-gray-50 group">
                        <img src={p.image} className="w-20 h-24 rounded-2xl object-cover" />
                        <div className="flex-grow">
                          <h4 className="font-bold text-gray-900">{p.name}</h4>
                          <p className="text-xs font-bold text-pink-500 uppercase tracking-widest">{formatPrice(p.price)}</p>
                        </div>
                        <div className="flex gap-2">
                          <button className="p-3 bg-gray-50 text-gray-400 hover:text-pink-500 rounded-xl transition-all">Modifier</button>
                          <button className="p-3 bg-rose-50 text-rose-500 rounded-xl transition-all"><Trash2 size={20} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} key="ord">
                <div className="bg-white rounded-[3rem] shadow-xl overflow-hidden border border-gray-50">
                  <table className="w-full text-left">
                    <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                      <tr>
                        <th className="px-8 py-6">Commande</th>
                        <th className="px-8 py-6">Client</th>
                        <th className="px-8 py-6">Total</th>
                        <th className="px-8 py-6">Statut</th>
                        <th className="px-8 py-6">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {orders.map(order => (
                        <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-6 font-black text-xs">#{order._id.slice(-6).toUpperCase()}</td>
                          <td className="px-8 py-6">
                            <p className="font-bold text-gray-900">{order.shippingAddress?.fullName}</p>
                            <p className="text-[10px] text-gray-400 font-bold">{order.shippingAddress?.phone}</p>
                          </td>
                          <td className="px-8 py-6">
                            <p className="font-black text-pink-500">{formatPrice(order.totalPrice)}</p>
                          </td>
                          <td className="px-8 py-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                              order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-pink-100 text-pink-700'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <select 
                              onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                              value={order.status}
                              className="bg-gray-50 border-none rounded-xl text-[10px] font-black uppercase px-4 py-2 focus:ring-2 focus:ring-pink-500"
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
                    </tbody>
                  </table>
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
    pink: "bg-pink-50 text-pink-500 shadow-pink-50",
    blue: "bg-blue-50 text-blue-500 shadow-blue-50",
    yellow: "bg-yellow-50 text-yellow-500 shadow-yellow-50",
    green: "bg-emerald-50 text-emerald-500 shadow-emerald-50",
  };
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50 flex items-center gap-6 group hover:-translate-y-1 transition-transform">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110 ${colors[color]}`}>
        {React.cloneElement(icon, { size: 28 })}
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
        <p className="text-2xl font-black text-gray-900 tracking-tighter italic">{value}</p>
      </div>
    </div>
  );
}

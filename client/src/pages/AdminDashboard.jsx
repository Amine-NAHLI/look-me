import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '../store/useUIStore';
import { Package, Tags, ShoppingBag, LogOut, PlusCircle, Trash2, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { formatPrice } from '../utils/formatPrice';

export default function AdminDashboard() {
  const { user, logout } = useUIStore();
  const [activeTab, setActiveTab] = useState('categories');
  
  // States - Categories
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  
  // States - Products
  const [products, setProducts] = useState([]);
  const [prodForm, setProdForm] = useState({
    name: '', description: '', price: '', category: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // Status for Orders
  const [orders, setOrders] = useState([]);
  const [updatingOrders, setUpdatingOrders] = useState({});

  // UI States
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ text: '', type: '' });

  // Token config
  const token = localStorage.getItem('lookme_token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch Data on Load
  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/categories');
      setCategories(data);
    } catch(e) { console.error(e); }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/products');
      setProducts(data);
    } catch(e) { console.error(e); }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/orders', config);
      setOrders(data);
    } catch(e) { console.error(e); }
  };

  const updateOrderStatus = async (orderId, status) => {
    setUpdatingOrders(prev => ({ ...prev, [orderId]: true }));
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status }, config);
      setMsg({ text: 'Statut mis à jour', type: 'success' });
      fetchOrders();
    } catch(e) {
      setMsg({ text: 'Erreur lors de la mise à jour', type: 'error' });
    }
    setUpdatingOrders(prev => ({ ...prev, [orderId]: false }));
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  // Handlers - Category
  const addCategory = async (e) => {
    e.preventDefault();
    if(!newCatName) return;
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/categories', { name: newCatName }, config);
      setNewCatName('');
      setMsg({ text: 'Catégorie ajoutée', type: 'success' });
      fetchCategories();
    } catch(err) {
      setMsg({ text: err.response?.data?.message || 'Erreur', type: 'error' });
    }
    setLoading(false);
    setTimeout(() => setMsg({ text: '', type: '' }), 3000);
  };

  const deleteCategory = async (id) => {
    if(!window.confirm("Supprimer cette catégorie ?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/categories/${id}`, config);
      fetchCategories();
    } catch(e) { alert("Erreur réseau"); }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validation du format
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setMsg({ text: 'Format invalide (JPG, PNG, WEBP uniquement)', type: 'error' });
      e.target.value = '';
      return;
    }

    // Validation de la taille (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMsg({ text: 'Image trop lourde (max 5MB)', type: 'error' });
      e.target.value = '';
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Handlers - Product
  const addProduct = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      setMsg({ text: 'Veuillez choisir une image locale.', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', prodForm.name);
      formData.append('description', prodForm.description);
      formData.append('price', prodForm.price);
      formData.append('category', prodForm.category);
      formData.append('image', imageFile);

      await axios.post('http://localhost:5000/api/products', formData, config);
      
      setProdForm({ name: '', description: '', price: '', category: '' });
      setImagePreview(null);
      // Reset input file visually
      if(document.getElementById('file-upload')) {
        document.getElementById('file-upload').value = '';
      }

      setMsg({ text: 'Produit publié dans le catalogue !', type: 'success' });
      fetchProducts();
    } catch(err) {
      setMsg({ text: err.response?.data?.message || 'Erreur ajout', type: 'error' });
    }
    setLoading(false);
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  const deleteProduct = async (id) => {
    if(!window.confirm("Retirer ce produit du catalogue ?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, config);
      fetchProducts();
    } catch(e) { alert("Erreur réseau"); }
  };

  if (!user || user.role !== 'admin') {
    return <div className="p-8 text-center text-red-500 font-bold">Accès refusé.</div>;
  }

  return (
    <div className="flex-grow bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar Admin */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col min-h-[400px]">
        <div className="mb-10">
          <p className="text-xs text-pink-500 font-bold uppercase tracking-widest">Administration</p>
          <h2 className="text-xl font-extrabold text-slate-800">{user.firstName}</h2>
        </div>
        
        <nav className="flex-grow space-y-2">
          <button 
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'categories' ? 'bg-pink-50 text-pink-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Tags size={20} /> Rayons
          </button>
          
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'products' ? 'bg-pink-50 text-pink-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Package size={20} /> Catalogue
          </button>
          
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'orders' ? 'bg-pink-50 text-pink-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <ShoppingBag size={20} /> Ventes
          </button>
        </nav>

        <button onClick={logout} className="mt-10 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-500 transition-colors">
          <LogOut size={18} /> Déconnexion
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-8">
        {msg.text && (
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`mb-6 p-4 rounded-xl flex items-center gap-2 font-bold ${msg.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
            {msg.type === 'success' ? <CheckCircle2 /> : null} {msg.text}
          </motion.div>
        )}

        {/* ===================== TAB: CATEGORIES ===================== */}
        {activeTab === 'categories' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-extrabold text-slate-800 mb-6">Gestion des Rayons</h1>
            
            <form onSubmit={addCategory} className="flex gap-4 mb-10 max-w-lg">
              <input 
                type="text" 
                placeholder="Ex: Nouveautés, Robes..." 
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-grow px-4 py-3 rounded-xl border border-slate-200 focus:border-pink-500 outline-none"
                required
              />
              <button disabled={loading} className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-pink-200">
                {loading ? <Loader2 className="animate-spin" /> : <PlusCircle />} Ajouter
              </button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map(cat => (
                <div key={cat._id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center group">
                  <span className="font-bold text-slate-700">{cat.name}</span>
                  <button onClick={() => deleteCategory(cat._id)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              {categories.length === 0 && <p className="text-slate-500 col-span-4">Créez votre première catégorie (ex: Pantalons).</p>}
            </div>
          </motion.div>
        )}

        {/* ===================== TAB: PRODUCTS ===================== */}
        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-extrabold text-slate-800 mb-6">Ajouter au Catalogue</h1>
            
            {categories.length === 0 ? (
              <div className="bg-yellow-50 text-yellow-700 p-6 rounded-2xl border border-yellow-200 font-medium">
                ⚠️ Vous devez créer au moins un Rayon (Catégorie) avant d'ajouter des produits.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <form onSubmit={addProduct} className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nom du Vêtement</label>
                    <input required type="text" value={prodForm.name} onChange={(e) => setProdForm({...prodForm, name: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description Courte</label>
                    <textarea required value={prodForm.description} onChange={(e) => setProdForm({...prodForm, description: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border rounded-lg h-24" placeholder="Coton bio..."></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Prix (DH)</label>
                      <input required type="number" value={prodForm.price} onChange={(e) => setProdForm({...prodForm, price: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border rounded-lg" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rayon</label>
                      <select required value={prodForm.category} onChange={(e) => setProdForm({...prodForm, category: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border rounded-lg" >
                        <option value="">Choisir</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Image du Produit</label>
                    <div className="flex items-center gap-4">
                      {imagePreview && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-pink-200">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <input 
                        id="file-upload"
                        required 
                        type="file" 
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={handleImageChange} 
                        className="flex-grow px-4 py-2 bg-slate-50 border rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100" 
                      />
                    </div>
                  </div>
                  <button disabled={loading} className="w-full bg-slate-800 hover:bg-black text-white py-3 rounded-xl font-bold mt-4 shadow-lg shadow-slate-200">
                    {loading ? 'Publication...' : 'Publier le Produit'}
                  </button>
                </form>

                <div className="lg:col-span-2">
                  <h3 className="font-extrabold text-slate-800 mb-4">Inventaire Actuel ({products.length})</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map(p => (
                      <div key={p._id} className="bg-white rounded-xl border border-slate-100 overflow-hidden shadow-sm flex flex-col">
                        <div className="h-32 bg-slate-100 overflow-hidden">
                          <img src={p.image} className="w-full h-full object-cover" alt="img" />
                        </div>
                        <div className="p-3 flex-grow">
                          <h4 className="font-bold text-sm leading-tight text-slate-800">{p.name}</h4>
                          <p className="text-xs font-medium text-pink-500 my-1">{p.category?.name || 'Inconnu'}</p>
                          <p className="font-extrabold text-slate-600">{formatPrice(p.price)}</p>
                        </div>
                        <button onClick={() => deleteProduct(p._id)} className="bg-red-50 text-red-500 hover:bg-red-500 hover:text-white text-xs font-bold py-2 transition-colors">Supprimer</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* TAB: ORDERS */}
        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-extrabold text-slate-800 mb-6">Gestion des Ventes</h1>
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Commande</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Client</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Total</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Statut</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map(order => (
                      <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800">#{order._id.slice(-8).toUpperCase()}</p>
                          <p className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-slate-800">{order.user?.firstName}</p>
                          <p className="text-xs text-slate-500 capitalize">{order.shippingAddress?.city}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-extrabold text-pink-600">{formatPrice(order.totalPrice)}</p>
                          <p className="text-[10px] text-slate-400">CoD</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <select 
                            disabled={updatingOrders[order._id]}
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="text-xs font-bold bg-slate-100 border-none rounded-lg p-2 focus:ring-2 focus:ring-pink-500 outline-none cursor-pointer disabled:opacity-50"
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
                      <tr>
                        <td colSpan="5" className="px-6 py-12 text-center text-slate-400">Aucune commande enregistrée pour le moment.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '../store/useUIStore';
import { Package, Tags, ShoppingBag, LogOut, PlusCircle, Trash2, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

export default function AdminDashboard() {
  const { user, logout } = useUIStore();
  const [activeTab, setActiveTab] = useState('categories');
  
  // States - Categories
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  
  // States - Products
  const [products, setProducts] = useState([]);
  const [prodForm, setProdForm] = useState({
    name: '', description: '', price: '', category: '', image: ''
  });
  
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

  // Handlers - Product
  const addProduct = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/products', prodForm, config);
      setProdForm({ name: '', description: '', price: '', category: '', image: '' });
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
                      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Prix (€)</label>
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
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Lien Image (Web)</label>
                    <input required type="text" value={prodForm.image} onChange={(e) => setProdForm({...prodForm, image: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border rounded-lg" placeholder="https://..." />
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
                          <p className="font-extrabold text-slate-600">{p.price}€</p>
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
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">En attente de futures commandes...</div>
        )}
      </main>
    </div>
  );
}

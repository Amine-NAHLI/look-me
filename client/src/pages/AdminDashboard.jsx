import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useUIStore } from '../store/useUIStore';
import { Package, Users, LogOut, PlusCircle, ShoppingBag } from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useUIStore();
  const [activeTab, setActiveTab] = useState('products');

  // Si pas admin, on redirige virtuellement (dans uin vrai cas on utiliserait Navigate)
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex-grow flex items-center justify-center p-8 text-center text-red-500 font-bold">
        Accès refusé. Vous n'êtes pas administrateur.
      </div>
    );
  }

  return (
    <div className="flex-grow bg-slate-50 min-h-[80vh] flex flex-col md:flex-row">
      {/* Sidebar Admin */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
        <div className="mb-10 text-center md:text-left">
          <p className="text-xs text-pink-500 font-bold uppercase tracking-widest">Connecté en tant que</p>
          <h2 className="text-xl font-extrabold text-slate-800">{user.firstName}</h2>
        </div>
        
        <nav className="flex-grow space-y-2">
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'products' ? 'bg-pink-50 text-pink-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Package size={20} />
            Produits
          </button>
          
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'orders' ? 'bg-pink-50 text-pink-600' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <ShoppingBag size={20} />
            Commandes Clients
          </button>
        </nav>

        <button 
          onClick={logout}
          className="mt-10 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <LogOut size={18} />
          Déconnexion
        </button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-8">
        {activeTab === 'products' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-extrabold text-slate-800">Gestion des Produits</h1>
              <button className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-pink-200">
                <PlusCircle size={20} />
                Ajouter un Article
              </button>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
              <p>Aucun produit ajouté via la base de données pour le moment.</p>
              <p className="text-sm mt-2">Ici apparaîtra la liste des articles avec bouton Modifier/Supprimer.</p>
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-slate-800">Suivi des Commandes</h1>
              <p className="text-slate-500 mt-2">Visualisez les achats de vos clients en temps réel.</p>
            </div>
            
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500">
              <p>La boutique de démonstration n'a pas encore reçu de commande client.</p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

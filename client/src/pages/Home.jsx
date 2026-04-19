import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import { useUIStore } from '../store/useUIStore';
import { Search, SlidersHorizontal, X, Truck, CreditCard, ShieldCheck, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useUIStore();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:5000/api/categories');
      return data;
    }
  });

  const reassuranceFeatures = [
    { icon: <Truck size={32} />, title: "Livraison Rapide", desc: "Dans tout le Maroc" },
    { icon: <CreditCard size={32} />, title: "Cash on Delivery", desc: "Payez à la réception" },
    { icon: <ShieldCheck size={32} />, title: "Qualité Garantie", desc: "Produits sélectionnés" },
    { icon: <Headphones size={32} />, title: "Support 7j/7", desc: "À votre écoute" },
  ];

  return (
    <main className="flex-grow">
      <Hero />
      
      {/* Search and Filter Section */}
      <section className="bg-white py-12 border-b border-gray-100 sticky top-[72px] z-40 glass">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full lg:w-1/3 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Rechercher une pièce..." 
                className="w-full pl-12 pr-10 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all shadow-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-pink-500"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto no-scrollbar">
              <button
                onClick={() => setSelectedCategory('')}
                className={`flex-shrink-0 px-6 py-3 rounded-xl font-bold transition-all ${
                  selectedCategory === '' 
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-pink-500 hover:text-pink-500'
                }`}
              >
                Tout voir
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`flex-shrink-0 px-6 py-3 rounded-xl font-bold transition-all ${
                    selectedCategory === cat._id 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200' 
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-pink-500 hover:text-pink-500'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-2 text-gray-400 font-bold uppercase tracking-wider text-xs">
              <SlidersHorizontal size={18} />
              <span>Filtres avancés</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid Section */}
      <section id="catalogue" className="py-20 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">Catalogue</h2>
              <div className="h-1.5 w-20 bg-pink-500 rounded-full mt-4"></div>
            </div>
          </div>
          <ProductGrid />
        </div>
      </section>

      {/* Reassurance Banner */}
      <section className="bg-white py-24 border-y border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
            {reassuranceFeatures.map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center group">
                <div className="p-5 bg-pink-50 text-pink-500 rounded-2xl mb-6 group-hover:bg-pink-500 group-hover:text-white transition-all transform group-hover:-translate-y-2 duration-300 shadow-xl shadow-pink-50">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 font-medium">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}

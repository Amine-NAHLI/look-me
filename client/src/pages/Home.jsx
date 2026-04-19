import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import { useUIStore } from '../store/useUIStore';
import { Search, SlidersHorizontal, X } from 'lucide-react';
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

  return (
    <main className="flex-grow">
      <Hero />
      
      {/* Search and Filter Section */}
      <section className="bg-white py-12 border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-1/3 group">
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
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
              <button
                onClick={() => setSelectedCategory('')}
                className={`flex-shrink-0 px-6 py-3 rounded-xl font-bold transition-all ${
                  selectedCategory === '' 
                  ? 'bg-pink-500 text-white shadow-lg shadow-pink-200' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tout
              </button>
              {categories?.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => setSelectedCategory(cat._id)}
                  className={`flex-shrink-0 px-6 py-3 rounded-xl font-bold transition-all ${
                    selectedCategory === cat._id 
                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-2 text-gray-400 font-medium">
              <SlidersHorizontal size={20} />
              <span>Filtres</span>
            </div>
          </div>
          
          {searchQuery && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-gray-500 font-medium"
            >
              Résultats pour "<span className="text-pink-500 font-bold">{searchQuery}</span>"
            </motion.p>
          )}
        </div>
      </section>

      <ProductGrid />
    </main>
  )
}

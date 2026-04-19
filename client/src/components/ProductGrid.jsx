import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Search, FilterX } from 'lucide-react';
import axios from 'axios';
import { useUIStore } from '../store/useUIStore';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const addToCart = useUIStore((state) => state.addToCart);
  const searchQuery = useUIStore((state) => state.searchQuery);
  const selectedCategory = useUIStore((state) => state.selectedCategory);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products`, {
            params: {
              keyword: searchQuery,
              category: selectedCategory
            }
        });
        setProducts(data);
      } catch (err) {
        setError('Impossible de charger la collection.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery, selectedCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  if (loading) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-pink-500">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="font-bold">Chargement de la collection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-64 flex items-center justify-center text-red-500 font-bold">
        {error}
      </div>
    );
  }

  return (
    <section id="catalogue" className="container mx-auto px-4 py-16 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-end justify-between mb-12 border-b border-pink-100 pb-4"
      >
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-slate-800">Nos Favoris</h2>
          <p className="text-slate-500 text-sm">Une sélection affichée en direct de notre base de données</p>
        </div>
      </motion.div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center justify-center">
          <FilterX size={48} className="text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">Aucun résultat trouvé</h3>
          <p className="text-slate-500 font-medium mb-6">Essayez de modifier vos filtres ou votre recherche.</p>
          {(searchQuery || selectedCategory) && (
            <button 
              onClick={() => {
                useUIStore.getState().setSearchQuery('');
                useUIStore.getState().setSelectedCategory('');
              }}
              className="px-6 py-2 bg-pink-500 text-white rounded-full font-bold shadow-lg hover:bg-pink-600 transition-all"
            >
              Réinitialiser les filtres
            </button>
          )}
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 perspective-[1500px]"
        >
          {products.map((product) => (
            <motion.div 
              key={product._id} 
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05, 
                rotateY: 2, 
                rotateX: -2,
                z: 20,
                boxShadow: "0 25px 50px -12px rgba(236, 72, 153, 0.2)"
              }}
              className="group transform-style-3d bg-white rounded-2xl p-2 flex flex-col shadow-sm border border-slate-50"
            >
              <div className="relative aspect-[4/5] mb-4 overflow-hidden rounded-xl bg-pink-50 shadow-sm">
                <Link to={`/product/${product._id}`}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out cursor-pointer"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=2000&auto=format&fit=crop';
                    }}
                  />
                </Link>
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-md transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-pink-500 text-white py-3 rounded-full text-sm font-bold shadow-md hover:bg-pink-600 transition-transform active:scale-95"
                  >
                    Ajouter au Panier
                  </button>
                </div>
              </div>
              <Link to={`/product/${product._id}`} className="text-center sm:text-left px-2 flex-grow flex flex-col justify-end">
                <p className="text-xs text-pink-500 uppercase font-bold tracking-widest mb-1">
                  {product.category?.name || 'Vêtements'}
                </p>
                <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-pink-500 transition-colors">
                  {product.name}
                </h3>
                <p className="text-lg font-extrabold text-slate-600 mt-2">{formatPrice(product.price)}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Search, FilterX, ShoppingBag, Plus } from 'lucide-react';
import axios from 'axios';
import { useUIStore } from '../store/useUIStore';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import Skeleton from './Skeleton';
import toast from 'react-hot-toast';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { searchQuery, selectedCategory, addToCart } = useUIStore();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        let url = 'http://localhost:5000/api/products';
        const params = new URLSearchParams();
        if (searchQuery) params.append('keyword', searchQuery);
        if (selectedCategory) params.append('category', selectedCategory);
        
        if (params.toString()) url += `?${params.toString()}`;
        
        const { data } = await axios.get(url);
        setProducts(data);
      } catch (error) {
        console.error("Erreur chargement produits", error);
        toast.error("Échec de la connexion au serveur");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [searchQuery, selectedCategory]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success("Ajouté au panier !");
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="aspect-[3/4] rounded-3xl" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <div className="p-6 bg-pink-50 text-pink-500 rounded-full mb-6">
          <FilterX size={48} />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Aucun résultat</h3>
        <p className="text-gray-500">Essayez de modifier vos filtres ou votre recherche.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      <AnimatePresence>
        {products.map((product, index) => (
          <motion.div
            layout
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            className="group"
          >
            <Link to={`/product/${product._id}`} className="block relative">
              {/* Image Container */}
              <div className="relative aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-100 shadow-xl shadow-gray-200/50 mb-6">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8">
                  <button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-2xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-pink-500 hover:text-white"
                  >
                    <Plus size={18} />
                    Panier
                  </button>
                </div>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-900 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                    Nouveau
                  </span>
                  {!product.countInStock || product.countInStock === 0 ? (
                    <span className="px-3 py-1 bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                      Rupture
                    </span>
                  ) : null}
                </div>
              </div>

              {/* Info */}
              <div className="px-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500 mb-2">
                  {product.category?.name || 'Vêtement'}
                </p>
                <h3 className="text-lg font-bold text-gray-900 leading-tight mb-2 group-hover:text-pink-500 transition-colors">
                  {product.name}
                </h3>
                <p className="text-xl font-black text-gray-900 italic">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

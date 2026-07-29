import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FilterX } from 'lucide-react';
import api from '../utils/axiosConfig';
import { useUIStore } from '../store/useUIStore';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import { getImageUrl } from '../utils/imageUrl';
import Skeleton from './Skeleton';
import toast from 'react-hot-toast';
import { staggerContainer, scaleIn } from '../utils/animations';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { searchQuery, selectedCategory, addToCart } = useUIStore();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get('/products', { params: { q: searchQuery || undefined, category: selectedCategory || undefined, limit: 24 } });
        setProducts(data.items);
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
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <motion.div 
            key={i} 
            className="space-y-3"
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <div className="aspect-[4/5] bg-[#F0F0F0] rounded-[var(--radius)]" />
            <div className="h-4 bg-[#F0F0F0] rounded-[var(--radius)] w-1/3" />
            <div className="h-4 bg-[#F0F0F0] rounded-[var(--radius)] w-2/3" />
            <div className="h-4 bg-[#F0F0F0] rounded-[var(--radius)] w-1/4" />
          </motion.div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center">
        <FilterX size={48} className="text-[#C2185B] mb-6 opacity-40" strokeWidth={1} />
        <h3 className="font-heading italic text-[32px] text-gray-400 mb-2 font-normal">Aucun produit</h3>
      </div>
    );
  }

  return (
    <motion.div 
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 md:gap-x-6 gap-y-8 md:gap-y-12"
    >
      <AnimatePresence>
        {products.map((product) => (
          <motion.div
            layout
            variants={scaleIn}
            key={product._id}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
            className="group relative"
          >
            <Link to={`/product/${product._id}`} className="block">
              {/* Image Container */}
              <div className="relative aspect-[4/5] bg-[#F5F5F5] overflow-hidden mb-3">
                {product.image ? (
                  <motion.img 
                    src={getImageUrl(product.images?.[0] || product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.4 }}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-heading italic text-[32px] text-[#C2185B] opacity-40">
                      {product.name?.substring(0, 2).toUpperCase()}
                    </span>
                  </div>
                )}
                
                {/* Button slide-up */}
                <motion.button 
                  initial={{ y: '100%', opacity: 0 }}
                  // Framer motion uses standard CSS hover for triggering parent group changes 
                  // but we'll use CSS to handle the slide up consistently
                  onClick={(e) => handleAddToCart(e, product)}
                  className="absolute bottom-0 left-0 w-full h-[40px] bg-[#0A0A0A] text-white font-body font-semibold text-[11px] uppercase tracking-[2px] rounded-none opacity-0 translate-y-full group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 flex items-center justify-center z-10"
                >
                  Ajouter
                </motion.button>

                {/* Badges */}
                <motion.span 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="absolute top-0 left-0 px-2 py-1 bg-white border border-[var(--border)] text-[#1C1C1C] text-[10px] font-body font-medium uppercase tracking-wider"
                >
                  Nouveau
                </motion.span>
              </div>

              {/* Info */}
              <div className="flex flex-col">
                <p className="font-body font-normal text-[12px] uppercase text-[#6B6B6B] mb-1">
                  {product.category?.name || 'Vêtement'}
                </p>
                <h3 className="font-body font-medium text-[14px] text-[#1C1C1C] mb-1">
                  {product.name}
                </h3>
                <p className="font-body font-bold text-[16px] text-[#C2185B]">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { useUIStore } from '../store/useUIStore';

export default function ProductGrid() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const addToCart = useUIStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
      } catch (err) {
        setError('Impossible de charger la collection.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
          <p className="text-slate-500 font-medium">Le catalogue est actuellement vide.</p>
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
                rotateY: 5, 
                rotateX: -5,
                z: 50,
                boxShadow: "0 25px 50px -12px rgba(236, 72, 153, 0.25)"
              }}
              className="group transform-style-3d bg-white rounded-2xl p-2 flex flex-col"
            >
              <div className="relative aspect-[4/5] mb-4 overflow-hidden rounded-xl bg-pink-50 shadow-sm">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=2000&auto=format&fit=crop'; // Fallback
                  }}
                />
                <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-md transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full bg-pink-500 text-white py-3 rounded-full text-sm font-bold shadow-md hover:bg-pink-600 transition-transform active:scale-95"
                  >
                    Ajouter au Panier
                  </button>
                </div>
              </div>
              <div className="text-center sm:text-left px-2 flex-grow flex flex-col justify-end">
                <p className="text-xs text-pink-500 uppercase font-bold tracking-widest mb-1">
                  {product.category?.name || 'Robe'}
                </p>
                <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-pink-500 transition-colors">
                  {product.name}
                </h3>
                {product.description && (
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                )}
                <p className="text-lg font-extrabold text-slate-600 mt-2">{product.price}€</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}

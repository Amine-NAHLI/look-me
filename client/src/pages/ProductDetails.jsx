import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useUIStore } from '../store/useUIStore';
import { ShoppingBag, ChevronLeft, Star, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '../utils/formatPrice';

const ProductDetails = () => {
  const { id } = useParams();
  const addToCart = useUIStore((state) => state.addToCart);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
      return data;
    },
  });

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
    </div>
  );

  if (error) return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold text-red-500">Erreur lors du chargement du produit</h2>
      <button onClick={() => window.history.back()} className="mt-4 text-pink-500 underline flex items-center justify-center gap-2">
        <ChevronLeft size={20} /> Retour
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => window.history.back()} 
        className="mb-8 flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-colors"
      >
        <ChevronLeft size={20} /> Retour au catalogue
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative aspect-square rounded-3xl overflow-hidden bg-gray-100 shadow-xl"
        >
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-6">
            <span className="inline-block px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-sm font-medium mb-4">
              {product.category?.name || 'Vêtements'}
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill={i < Math.floor(product.rating || 4) ? 'currentColor' : 'none'} />
                ))}
              </div>
              <span className="text-gray-500 text-sm">({product.numReviews || 12} avis clients)</span>
            </div>
            <p className="text-3xl font-bold text-pink-600">{formatPrice(product.price)}</p>
          </div>

          <div className="prose prose-sm text-gray-600 mb-8">
            <p>{product.description}</p>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <div className={`h-3 w-3 rounded-full ${product.countInStock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className={`text-sm font-medium ${product.countInStock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.countInStock > 0 ? `En stock (${product.countInStock} restants)` : 'Rupture de stock'}
              </span>
            </div>
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={product.countInStock <= 0}
            className={`flex items-center justify-center gap-3 py-4 px-8 rounded-full text-white font-bold text-lg shadow-lg transform transition active:scale-95 ${
              product.countInStock > 0 
                ? 'bg-pink-500 hover:bg-pink-600 shadow-pink-200' 
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            <ShoppingBag size={24} />
            {product.countInStock > 0 ? 'Ajouter au panier' : 'Indisponible'}
          </button>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 border-t pt-8">
            <div className="flex flex-col items-center text-center">
              <Truck className="text-pink-500 mb-2" size={24} />
              <p className="text-xs font-semibold text-gray-900">Livraison Rapide</p>
              <p className="text-[10px] text-gray-500">2-4 jours ouvrés</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="text-pink-500 mb-2" size={24} />
              <p className="text-xs font-semibold text-gray-900">Paiement Sécurisé</p>
              <p className="text-[10px] text-gray-500">À la livraison (CoD)</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <RefreshCw className="text-pink-500 mb-2" size={24} />
              <p className="text-xs font-semibold text-gray-900">Retours Faciles</p>
              <p className="text-[10px] text-gray-500">Sous 14 jours</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;

import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useUIStore } from '../store/useUIStore';
import { ShoppingBag, Star, Truck, ShieldCheck, RefreshCw, ChevronRight, Package, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';
import { useState } from 'react';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useUIStore();
  const [activeTab, setActiveTab] = useState('description');
  const [qty, setQty] = useState(1);

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
      return data;
    }
  });

  const { data: similarProducts } = useQuery({
    queryKey: ['similar', product?.category?._id],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:5000/api/products?category=${product?.category?._id}`);
      return data.filter(p => p._id !== id).slice(0, 4);
    },
    enabled: !!product?.category?._id
  });

  const handleAddToCart = () => {
    addToCart({ ...product, qty });
    toast.success(`${product.name} ajouté au panier !`);
  };

  if (isLoading) return <div className="container mx-auto px-4 py-20 text-center font-bold text-gray-400">Chargement des détails...</div>;
  if (error) return <div className="container mx-auto px-4 py-20 text-center text-red-500 font-bold">Erreur lors du chargement du produit.</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
        {/* Left: Images */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-[4/5] rounded-[3rem] overflow-hidden bg-gray-100 shadow-2xl"
          >
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Mock Thumbnails */}
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`aspect-square rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${i === 0 ? 'border-pink-500 shadow-lg' : 'border-transparent hover:border-pink-200'}`}>
                <img src={product.image} alt="" className="w-full h-full object-cover opacity-60 hover:opacity-100" />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <p className="text-pink-500 font-black uppercase tracking-[0.3em] text-xs mb-4">
              {product.category?.name || 'Nouvelle Collection'}
            </p>
            <h1 className="text-5xl font-black text-gray-900 mb-6 leading-tight italic">{product.name}</h1>
            
            <div className="flex items-center gap-6 mb-8 group">
              <p className="text-4xl font-black text-gray-900">{formatPrice(product.price)}</p>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                <span className="text-gray-400 font-bold ml-2">(24 avis)</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mb-8">
              {product.countInStock > 0 ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-600 text-sm font-bold">
                  <Package size={18} /> En Stock
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 text-rose-600 text-sm font-bold">
                  <AlertCircle size={18} /> Rupture de stock
                </div>
              )}
            </div>

            <p className="text-gray-500 leading-relaxed text-lg mb-10">
              {product.description}
            </p>

            <div className="flex items-center gap-6 mb-12">
              <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-12 h-12 flex items-center justify-center font-bold text-xl hover:bg-white rounded-xl transition-all"
                >
                  -
                </button>
                <span className="w-12 text-center font-black text-lg">{qty}</span>
                <button 
                  onClick={() => setQty(qty + 1)}
                  className="w-12 h-12 flex items-center justify-center font-bold text-xl hover:bg-white rounded-xl transition-all"
                >
                  +
                </button>
              </div>
              <button 
                onClick={handleAddToCart}
                disabled={product.countInStock === 0}
                className="btn-primary flex-grow h-14 flex items-center justify-center gap-3 text-lg"
              >
                <ShoppingBag size={24} />
                Ajouter au panier
              </button>
            </div>

            {/* Reassurance */}
            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                <Truck className="text-pink-500" size={20} />
                Livraison DHL Express
              </div>
              <div className="flex items-center gap-3 text-gray-500 font-bold text-sm">
                <ShieldCheck className="text-pink-500" size={20} />
                Paiement à la livraison
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mb-24">
        <div className="flex gap-8 border-b border-gray-200 mb-8">
          {['description', 'caractéristiques', 'avis'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-pink-500' : 'text-gray-400 hove:text-gray-600'}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="tab-active" className="absolute bottom-0 left-0 right-0 h-1 bg-pink-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
        
        <div className="bg-gray-50 p-10 rounded-[2rem] min-h-[200px]">
          {activeTab === 'description' && (
            <p className="text-gray-600 leading-loose text-lg">{product.description}</p>
          )}
          {activeTab === 'caractéristiques' && (
            <ul className="space-y-4">
              <li className="flex justify-between border-b border-gray-200 pb-2"><span className="font-bold text-gray-400">Matière</span> <span>Coton Premium 100%</span></li>
              <li className="flex justify-between border-b border-gray-200 pb-2"><span className="font-bold text-gray-400">Coupe</span> <span>Ajustée</span></li>
              <li className="flex justify-between border-b border-gray-200 pb-2"><span className="font-bold text-gray-400">Origine</span> <span>Fabriqué au Maroc</span></li>
            </ul>
          )}
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts?.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black italic">Vous pourriez aussi aimer</h2>
            <Link to="/" className="text-pink-500 font-bold flex items-center gap-1">Voir tout <ChevronRight size={18} /></Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {similarProducts.map((p) => (
              <Link key={p._id} to={`/product/${p._id}`} className="group">
                <div className="aspect-[3/4] rounded-32 overflow-hidden bg-gray-100 mb-4 rounded-3xl">
                  <img src={p.image} alt="" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                </div>
                <h4 className="font-bold text-gray-900 truncate">{p.name}</h4>
                <p className="font-black text-pink-500 italic">{formatPrice(p.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;

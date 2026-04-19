import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useUIStore } from '../store/useUIStore';
import { ShoppingBag, ChevronRight, Package, AlertCircle, Plus, Minus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { slideInRight, fadeInUp, scaleIn } from '../utils/animations';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useUIStore();
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

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
    toast.success(`${product.name} ajouté au panier !`, { duration: 3000 });
  };

  if (isLoading) return (
    <div className="container mx-auto px-6 py-[120px] flex justify-center">
      <motion.div animate={{ opacity: [0.4, 0.8, 0.4] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-full max-w-[1000px] flex flex-col md:flex-row gap-12">
        <div className="w-full md:w-1/2 aspect-[4/5] bg-[#F5F5F5] rounded-[var(--radius)]" />
        <div className="w-full md:w-1/2 space-y-6 pt-8">
          <div className="h-4 bg-[#F5F5F5] w-1/4" />
          <div className="h-10 bg-[#F5F5F5] w-3/4" />
          <div className="h-8 bg-[#F5F5F5] w-1/3" />
        </div>
      </motion.div>
    </div>
  );
  if (error) return <div className="container mx-auto px-6 py-[120px] text-center font-body text-[#1C1C1C]">Erreur lors du chargement du produit.</div>;

  return (
    <div className="container mx-auto px-6 py-[60px] lg:py-[100px]">
      <div className="flex text-[11px] font-body uppercase tracking-[2px] text-[var(--gray)] mb-8 gap-2 items-center">
        <Link to="/" className="hover:text-[var(--dark)] transition-colors">Accueil</Link>
        <ChevronRight size={12} />
        <Link to="/" className="hover:text-[var(--dark)] transition-colors">Catalogue</Link>
        <ChevronRight size={12} />
        <span className="text-[var(--dark)]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-[120px] mb-[120px]">
        {/* Left: Images */}
        <div className="flex flex-col gap-4 relative">
          <motion.div 
            layoutId={`product-image-${product._id}`}
            className="aspect-[4/5] overflow-hidden bg-[#F5F5F5]"
          >
            {product.image ? (
               <img 
                 src={product.image} 
                 alt={product.name} 
                 className="w-full h-full object-cover"
               />
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-heading italic text-[48px] text-[#C2185B] opacity-40">
                    {product.name?.substring(0, 2).toUpperCase()}
                  </span>
                </div>
            )}
           
          </motion.div>
          
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <motion.button 
                key={i} 
                whileHover={{ scale: 1.05 }}
                onClick={() => setActiveImage(i)}
                className={`aspect-[4/5] bg-[#F5F5F5] overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-[#C2185B]' : 'border-transparent'}`}
              >
                {product.image ? <img src={product.image} alt="" className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" /> : <div/>}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <motion.div 
          variants={slideInRight}
          initial="hidden"
          animate="visible"
          className="flex flex-col justify-start pt-4 lg:pt-12"
        >
          <div className="mb-10 border-b border-[var(--border)] pb-10">
            <p className="text-[#C2185B] font-body font-medium uppercase tracking-[3px] text-[11px] mb-4">
              {product.category?.name || 'Nouvelle Collection'}
            </p>
            <h1 className="text-[32px] font-heading font-bold text-[var(--dark)] mb-4 leading-tight">{product.name}</h1>
            <p className="text-[24px] font-body font-bold text-[#C2185B]">{formatPrice(product.price)}</p>
          </div>

          <p className="text-[var(--gray)] font-body font-light leading-[1.8] text-[15px] mb-10 max-w-[480px]">
            {product.description}
          </p>

          <div className="mb-8">
            {product.countInStock > 0 ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius)] bg-[#E8F5E9] text-[#2E7D32] text-[11px] font-body font-medium uppercase">
                <Package size={14} /> En Stock
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[var(--radius)] bg-[#FFEBEE] text-[#C62828] text-[11px] font-body font-medium uppercase">
                <AlertCircle size={14} /> Rupture de stock
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-2">
            <div className="flex items-center border border-[var(--border)] w-full sm:w-auto">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-14 h-[50px] flex items-center justify-center text-[var(--dark)] hover:text-[#C2185B] transition-colors"
                disabled={product.countInStock === 0}
              >
                <Minus size={16} strokeWidth={1} />
              </button>
              <span className="w-12 text-center font-body text-[14px] font-medium">{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)}
                className="w-14 h-[50px] flex items-center justify-center text-[var(--dark)] hover:text-[#C2185B] transition-colors"
                disabled={product.countInStock === 0}
              >
                <Plus size={16} strokeWidth={1} />
              </button>
            </div>

            <motion.button 
              onClick={handleAddToCart}
              disabled={product.countInStock === 0}
              whileHover={{ scale: 1.01, backgroundColor: '#880E4F' }}
              whileTap={{ scale: 0.99 }}
              className="bg-[#C2185B] text-white font-body font-medium text-[12px] uppercase tracking-[2px] h-[50px] w-full flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              Ajouter au panier
              <ShoppingBag size={16} strokeWidth={1.5} />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Similar Products */}
      {similarProducts?.length > 0 && (
        <section className="pt-16 border-t border-[var(--border)]">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-[28px] font-heading font-semibold text-[var(--dark)]">Complétez votre look</h2>
            <Link to="/" className="text-[#C2185B] font-body font-medium text-[11px] uppercase tracking-[2px] flex items-center gap-2 hover:underline">
              Voir la collection
              <ArrowRight size={14} />
            </Link>
          </div>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {similarProducts.map((p) => (
              <motion.div variants={scaleIn} key={p._id}>
                <Link to={`/product/${p._id}`} className="group block">
                  <div className="aspect-[4/5] overflow-hidden bg-[#F5F5F5] mb-4">
                    {p.image ? (
                        <motion.img 
                            whileHover={{ scale: 1.04 }} 
                            transition={{ duration: 0.4 }} 
                            src={p.image} 
                            alt={p.name} 
                            className="w-full h-full object-cover" 
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="font-heading italic text-[24px] text-[#C2185B] opacity-40">
                                {p.name?.substring(0, 2).toUpperCase()}
                            </span>
                        </div>
                    )}
                    
                  </div>
                  <h4 className="font-body font-medium text-[14px] text-[var(--dark)] truncate pr-4">{p.name}</h4>
                  <p className="font-body font-bold text-[14px] text-[#C2185B] mt-1">{formatPrice(p.price)}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}
    </div>
  );
};

export default ProductDetails;

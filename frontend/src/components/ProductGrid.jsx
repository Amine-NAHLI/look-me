import { AnimatePresence, motion } from 'framer-motion';
import { FilterX } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';
import { formatPrice } from '../utils/formatPrice';
import { getImageUrl } from '../utils/imageUrl';
import { useUIStore } from '../store/useUIStore';
import { staggerContainer, scaleIn } from '../utils/animations';

export default function ProductGrid({ categoryId: categoryIdOverride, excludeProductId } = {}) {
  const { searchQuery, selectedCategory, addToCart } = useUIStore();
  const categoryId = categoryIdOverride ?? selectedCategory;
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products', searchQuery, categoryId],
    queryFn: () => api.get('/products', { params: { q: searchQuery || undefined, category: categoryId || undefined, limit: 24 } }).then(({ data: response }) => response),
    staleTime: 30_000,
  });
  const products = (data?.items || []).filter((product) => product.id !== excludeProductId);

  if (isLoading) return <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4" aria-busy="true">{Array.from({ length: 8 }, (_, index) => <div key={index} className="space-y-3 animate-pulse"><div className="aspect-[4/5] bg-[#F0F0F0]" /><div className="h-4 w-2/3 bg-[#F0F0F0]" /><div className="h-4 w-1/3 bg-[#F0F0F0]" /></div>)}</div>;
  if (isError) return <div className="py-20 text-center" role="alert"><h3 className="font-heading text-2xl">Impossible de charger le catalogue</h3><p className="mt-2 text-[var(--gray)]">Réessayez dans quelques instants.</p></div>;
  if (products.length === 0) return <div className="flex flex-col items-center justify-center py-20 text-center"><FilterX size={48} className="mb-6 text-[#C2185B] opacity-40" strokeWidth={1} /><h3 className="font-heading text-3xl italic text-gray-400">Aucun produit</h3></div>;

  const handleAddToCart = (event, product) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart(product);
    toast.success(`${product.name} ajouté au panier`);
  };

  return <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
    <AnimatePresence>
      {products.map((product) => {
        const image = product.images?.[0];
        return <motion.article layout variants={scaleIn} key={product.id} whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="group relative">
          <Link to={`/product/${product.id}`} className="block" aria-label={`Voir ${product.name}`}>
            <div className="relative mb-3 aspect-[4/5] overflow-hidden bg-[#F5F5F5] group">
              {image ? <motion.img src={getImageUrl(image)} alt={product.name} className="h-full w-full object-cover transition-opacity duration-500 group-hover:opacity-0" loading="lazy" /> : <div className="flex h-full w-full items-center justify-center"><span className="font-heading text-3xl italic text-[#C2185B] opacity-40">{product.name?.slice(0, 2).toUpperCase()}</span></div>}
              {/* Cinematic Video Hover Mock */}
              <video src="https://assets.mixkit.co/videos/preview/mixkit-girl-in-a-leather-jacket-walking-in-the-city-4322-large.mp4" loop muted playsInline className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" onMouseOver={(e) => e.target.play()} onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }} />
              {product.stock > 0 && <button type="button" onClick={(event) => handleAddToCart(event, product)} className="absolute bottom-3 left-3 right-3 hidden h-12 translate-y-8 items-center justify-center rounded-[var(--radius-sm)] border border-white/40 bg-white/40 text-[11px] font-bold uppercase tracking-[0.2em] text-[#1C1C1C] opacity-0 shadow-lg backdrop-blur-md transition-all duration-300 hover:bg-white/70 hover:scale-[1.02] group-hover:flex group-hover:translate-y-0 group-hover:opacity-100 md:flex z-10">Ajouter</button>}
              {product.featured && <span className="absolute left-3 top-3 rounded-full border border-white/40 bg-white/40 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-[#1C1C1C] backdrop-blur-md z-10">Sélection</span>}
              {product.stock <= 0 && <span className="absolute left-3 top-3 rounded-full bg-black/80 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white backdrop-blur-md z-10">Épuisé</span>}
            </div>
            <p className="mb-1 text-[12px] font-normal uppercase text-[#6B6B6B]">{product.category?.name || 'Collection'}</p>
            <h3 className="mb-1 text-[14px] font-medium text-[#1C1C1C]">{product.name}</h3>
            <p className="text-[16px] font-bold text-[#C2185B]">{formatPrice(product.price)}</p>
          </Link>
        </motion.article>;
      })}
    </AnimatePresence>
  </motion.div>;
}

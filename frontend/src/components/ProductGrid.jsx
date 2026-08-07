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
            <div className="relative mb-3 aspect-[4/5] overflow-hidden bg-[#F5F5F5]">
              {image ? <motion.img src={getImageUrl(image)} alt={product.name} className="h-full w-full object-cover" whileHover={{ scale: 1.04 }} transition={{ duration: 0.4 }} loading="lazy" /> : <div className="flex h-full w-full items-center justify-center"><span className="font-heading text-3xl italic text-[#C2185B] opacity-40">{product.name?.slice(0, 2).toUpperCase()}</span></div>}
              {product.stock > 0 && <button type="button" onClick={(event) => handleAddToCart(event, product)} className="absolute bottom-0 left-0 hidden h-11 w-full translate-y-full items-center justify-center bg-[#0A0A0A] text-[11px] font-semibold uppercase tracking-[2px] text-white transition-all hover:bg-[var(--primary)] group-hover:flex group-hover:translate-y-0 md:flex">Ajouter au panier</button>}
              {product.featured && <span className="absolute left-0 top-0 border border-[var(--border)] bg-white px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-[#1C1C1C]">Sélection</span>}
              {product.stock <= 0 && <span className="absolute left-0 top-0 bg-black/75 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white">Épuisé</span>}
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

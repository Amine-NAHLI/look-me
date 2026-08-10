import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, ChevronRight, Minus, Package, Plus, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';
import { useUIStore } from '../store/useUIStore';
import { formatPrice } from '../utils/formatPrice';
import { getImageUrl } from '../utils/imageUrl';
import ProductGrid from '../components/ProductGrid';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useUIStore();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { data, isLoading, isError } = useQuery({ queryKey: ['product', id], queryFn: () => api.get(`/products/${id}`).then(({ data: response }) => response.product), enabled: Boolean(id) });
  const product = data;
  const images = product?.images || [];

  if (isLoading) return <main className="container mx-auto grid min-h-[50vh] place-items-center px-6" aria-busy="true">Chargement du produit…</main>;
  if (isError || !product) return <main className="container mx-auto py-24 text-center" role="alert"><h1 className="font-heading text-3xl">Produit introuvable</h1><Link className="mt-6 inline-block underline" to="/catalogue">Retour au catalogue</Link></main>;

  const add = () => { addToCart(product, quantity); toast.success(`${product.name} ajouté au panier`); };
  const image = images[activeImage];

  return <main className="relative min-h-screen overflow-hidden bg-[var(--surface)]">
    {/* Aurora Background Effects */}
    <div className="pointer-events-none absolute -left-40 top-0 h-[600px] w-[600px] rounded-full bg-[#d797a3]/20 blur-[120px]" />
    <div className="pointer-events-none absolute right-0 top-40 h-[500px] w-[500px] rounded-full bg-[var(--primary)]/10 blur-[100px]" />
    
    <div className="relative mx-auto max-w-[var(--content-max)] px-4 py-10 md:px-6 lg:px-12 lg:py-16">
      <nav className="mb-10 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--gray)] opacity-60" aria-label="Fil d’Ariane"><Link to="/" className="hover:text-[var(--primary)]">Accueil</Link><ChevronRight size={14} aria-hidden="true" /><Link to="/catalogue" className="hover:text-[var(--primary)]">Catalogue</Link><ChevronRight size={14} aria-hidden="true" /><span className="truncate text-[var(--dark)]">{product.name}</span></nav>
      
      <section className="grid gap-6 lg:grid-cols-2 lg:gap-12">
        <div className="relative">
          <div className="aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/60 bg-white/40 shadow-2xl backdrop-blur-md">
            {image ? <img src={getImageUrl(image)} alt={product.name} className="h-full w-full object-cover mix-blend-multiply" /> : <div className="grid h-full place-items-center text-5xl text-[var(--gray)]">{product.name.slice(0, 2)}</div>}
          </div>
          {images.length > 1 && <div className="mt-6 grid grid-cols-5 gap-3">{images.map((item, index) => <button key={item} type="button" onClick={() => setActiveImage(index)} className={`aspect-[4/5] overflow-hidden rounded-xl border-2 transition-all duration-300 ${activeImage === index ? 'border-[var(--primary)] shadow-[0_4px_12px_rgba(194,24,91,0.2)]' : 'border-white/40 opacity-70 hover:opacity-100 hover:scale-105'}`} aria-label={`Voir l’image ${index + 1} de ${product.name}`}><img src={getImageUrl(item)} alt="" className="h-full w-full object-cover" /></button>)}</div>}
        </div>
        
        <div className="flex flex-col justify-center max-w-xl lg:py-8">
          <div className="rounded-[2.5rem] border border-white/60 bg-white/40 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.02)] backdrop-blur-xl sm:p-10">
            <p className="mb-4 inline-flex rounded-full border border-[var(--primary)]/20 bg-white/50 px-4 py-1.5 text-xs font-bold uppercase tracking-[.25em] text-[var(--primary)] backdrop-blur-md">{product.category?.name || 'Collection LOOKME'}</p>
            <h1 className="font-heading text-5xl leading-[1.05] md:text-6xl lg:text-7xl">{product.name}</h1>
            <p className="mt-6 text-3xl font-bold text-[var(--dark)]">{formatPrice(product.price)}</p>
            {product.compareAtPrice && product.compareAtPrice > product.price && <p className="mt-1 text-sm font-semibold text-[var(--gray)] line-through opacity-70">{formatPrice(product.compareAtPrice)}</p>}
            
            <p className="mt-8 text-sm leading-7 text-[var(--gray)]">{product.description}</p>
            
            <div className="mt-8">{product.stock > 0 ? <p className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-emerald-700 backdrop-blur-md"><Package size={14} aria-hidden="true" strokeWidth={2.5} /> En stock</p> : <p className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50/50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-700 backdrop-blur-md"><AlertCircle size={14} aria-hidden="true" strokeWidth={2.5} /> Rupture de stock</p>}</div>
            
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <div className="flex h-14 items-center rounded-full border border-[var(--border)] bg-white/50 px-2 backdrop-blur-md">
                <button type="button" className="grid h-full w-12 place-items-center rounded-l-full hover:bg-[var(--primary)]/5 transition-colors" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1 || product.stock <= 0} aria-label="Diminuer la quantité"><Minus size={17} /></button>
                <span className="grid w-10 place-items-center font-bold" aria-live="polite">{quantity}</span>
                <button type="button" className="grid h-full w-12 place-items-center rounded-r-full hover:bg-[var(--primary)]/5 transition-colors" onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))} disabled={quantity >= product.stock || product.stock <= 0} aria-label="Augmenter la quantité"><Plus size={17} /></button>
              </div>
              <button type="button" disabled={product.stock <= 0} onClick={add} className="inline-flex h-14 flex-1 items-center justify-center gap-3 rounded-full bg-[var(--primary)] px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_8px_20px_rgba(194,24,91,0.25)] transition-all hover:scale-[1.02] hover:bg-[var(--primary-hover)] hover:shadow-[0_12px_24px_rgba(194,24,91,0.35)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100">
                <ShoppingBag size={18} aria-hidden="true" /> Ajouter au panier
              </button>
            </div>
            
            <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-8 text-[11px] font-semibold uppercase tracking-widest text-[var(--gray)]">
              <div><dt className="opacity-60 mb-1">Référence</dt><dd className="text-[var(--dark)]">{product.sku || 'Non renseignée'}</dd></div>
              <div><dt className="opacity-60 mb-1">Livraison</dt><dd className="text-[var(--dark)]">Calculée au panier</dd></div>
            </dl>
          </div>
        </div>
      </section>
      {product.category?.id && <section className="mt-24 border-t border-[var(--border)] pt-16"><h2 className="mb-10 font-heading text-4xl text-center">Compléter votre look</h2><ProductGrid categoryId={product.category.id} excludeProductId={product.id} /></section>}
    </div>
  </main>;
}

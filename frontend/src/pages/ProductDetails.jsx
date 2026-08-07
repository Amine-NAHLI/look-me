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

  return <main className="container mx-auto px-4 py-10 md:px-6 lg:px-12 lg:py-16">
    <nav className="mb-8 flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--gray)]" aria-label="Fil d’Ariane"><Link to="/">Accueil</Link><ChevronRight size={14} aria-hidden="true" /><Link to="/catalogue">Catalogue</Link><ChevronRight size={14} aria-hidden="true" /><span className="truncate text-[var(--dark)]">{product.name}</span></nav>
    <section className="grid gap-10 lg:grid-cols-2 lg:gap-20">
      <div>
        <div className="aspect-[4/5] overflow-hidden bg-[#F5F5F5]">{image ? <img src={getImageUrl(image)} alt={product.name} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-5xl text-[var(--gray)]">{product.name.slice(0, 2)}</div>}</div>
        {images.length > 1 && <div className="mt-4 grid grid-cols-4 gap-3">{images.map((item, index) => <button key={item} type="button" onClick={() => setActiveImage(index)} className={`aspect-[4/5] overflow-hidden border-2 ${activeImage === index ? 'border-[var(--primary)]' : 'border-transparent'}`} aria-label={`Voir l’image ${index + 1} de ${product.name}`}><img src={getImageUrl(item)} alt="" className="h-full w-full object-cover" /></button>)}</div>}
      </div>
      <div className="max-w-xl lg:pt-8">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[.18em] text-[var(--primary)]">{product.category?.name || 'Collection LOOKME'}</p>
        <h1 className="font-heading text-4xl leading-tight md:text-5xl">{product.name}</h1>
        <p className="mt-5 text-2xl font-bold text-[var(--primary)]">{formatPrice(product.price)}</p>
        {product.compareAtPrice && product.compareAtPrice > product.price && <p className="mt-1 text-sm text-[var(--gray)] line-through">{formatPrice(product.compareAtPrice)}</p>}
        <p className="mt-8 leading-8 text-[var(--gray)]">{product.description}</p>
        <div className="mt-8">{product.stock > 0 ? <p className="inline-flex items-center gap-2 rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-800"><Package size={16} aria-hidden="true" /> En stock</p> : <p className="inline-flex items-center gap-2 rounded bg-red-50 px-3 py-2 text-sm text-red-800"><AlertCircle size={16} aria-hidden="true" /> Rupture de stock</p>}</div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row"><div className="flex h-12 items-center border border-[var(--border)]"><button type="button" className="grid h-full w-12 place-items-center" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1 || product.stock <= 0} aria-label="Diminuer la quantité"><Minus size={17} /></button><span className="grid w-10 place-items-center" aria-live="polite">{quantity}</span><button type="button" className="grid h-full w-12 place-items-center" onClick={() => setQuantity((value) => Math.min(product.stock, value + 1))} disabled={quantity >= product.stock || product.stock <= 0} aria-label="Augmenter la quantité"><Plus size={17} /></button></div><button type="button" disabled={product.stock <= 0} onClick={add} className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 bg-[var(--primary)] px-6 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"><ShoppingBag size={18} aria-hidden="true" /> Ajouter au panier</button></div>
        <dl className="mt-10 divide-y border-y border-[var(--border)] text-sm"><div className="flex justify-between py-4"><dt>Référence</dt><dd>{product.sku || 'Non renseignée'}</dd></div><div className="flex justify-between py-4"><dt>Livraison</dt><dd>Calculée à la commande</dd></div></dl>
      </div>
    </section>
    {product.category?.id && <section className="mt-20 border-t border-[var(--border)] pt-12"><h2 className="font-heading text-3xl">Découvrir la collection</h2><div className="mt-8"><ProductGrid categoryId={product.category.id} excludeProductId={product.id} /></div></section>}
  </main>;
}

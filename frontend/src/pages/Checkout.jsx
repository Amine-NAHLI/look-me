import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../utils/axiosConfig';
import { useUIStore } from '../store/useUIStore';
import { formatPrice } from '../utils/formatPrice';
import { getImageUrl } from '../utils/imageUrl';

const initialAddress = { fullName: '', phone: '', addressLine1: '', city: '', postalCode: '' };

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart, setGuestOrderToken } = useUIStore();
  const [address, setAddress] = useState(initialAddress);
  const [loading, setLoading] = useState(false);
  const idempotencyKey = useRef(crypto.randomUUID());

  if (!cart.length) return <main className="grid min-h-[60vh] place-items-center p-6 text-center"><div><ShoppingBag size={48} className="mx-auto mb-5 text-[var(--primary)]" /><h1 className="font-heading text-3xl">Votre panier est vide</h1><button type="button" onClick={() => navigate('/catalogue')} className="mt-6 bg-[var(--dark)] px-6 py-3 text-sm font-semibold text-white">Retour au catalogue</button></div></main>;

  const update = (event) => setAddress((current) => ({ ...current, [event.target.name]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/orders', { items: cart.map((item) => ({ productId: item.id, quantity: item.qty })), shippingAddress: { ...address, postalCode: address.postalCode || undefined }, idempotencyKey: idempotencyKey.current });
      if (data.guestAccessToken) setGuestOrderToken(data.order.id, data.guestAccessToken);
      clearCart();
      toast.success('Commande enregistrée');
      navigate(`/order-success/${data.order.id}`, { replace: true });
    } catch (error) {
      const message = error.response?.data?.error?.message || 'La commande n’a pas pu être enregistrée. Vérifiez votre panier et réessayez.';
      toast.error(message);
    } finally { setLoading(false); }
  };

  return <main className="container mx-auto px-4 py-10 md:px-6 lg:px-12 lg:py-16"><h1 className="font-heading text-4xl">Finaliser la commande</h1><p className="mt-3 text-[var(--gray)]">Paiement à la livraison. Les prix, frais et disponibilité sont confirmés par le serveur avant création.</p><div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]"><form onSubmit={submit} className="space-y-5 rounded border border-[var(--border)] bg-white p-6 md:p-8"><h2 className="font-heading text-2xl">Adresse de livraison</h2><div className="grid gap-5 md:grid-cols-2"><Field label="Nom complet" name="fullName" value={address.fullName} onChange={update} required /><Field label="Téléphone" name="phone" type="tel" value={address.phone} onChange={update} required /><Field label="Adresse" name="addressLine1" value={address.addressLine1} onChange={update} required className="md:col-span-2" /><Field label="Ville" name="city" value={address.city} onChange={update} required /><Field label="Code postal (facultatif)" name="postalCode" value={address.postalCode} onChange={update} /></div><button type="submit" disabled={loading} className="inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[var(--primary)] px-6 font-semibold text-white disabled:opacity-50">{loading ? <><Loader2 className="animate-spin" size={18} aria-hidden="true" /> Enregistrement…</> : 'Confirmer la commande'}</button></form><aside className="h-fit rounded border border-[var(--border)] bg-white p-6"><h2 className="font-heading text-2xl">Récapitulatif</h2><ul className="mt-5 divide-y divide-[var(--border)]">{cart.map((item) => <li key={item.id} className="flex gap-3 py-4"><div className="h-16 w-12 shrink-0 bg-[#F5F5F5]">{item.images?.[0] && <img src={getImageUrl(item.images[0])} alt="" className="h-full w-full object-cover" />}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium">{item.name}</p><p className="text-xs text-[var(--gray)]">Quantité : {item.qty}</p></div><span className="text-sm font-semibold">{formatPrice(item.price * item.qty)}</span></li>)}</ul><dl className="mt-5 space-y-3 border-t border-[var(--border)] pt-5 text-sm"><div className="flex justify-between"><dt>Sous-total</dt><dd>{formatPrice(getCartTotal())}</dd></div><div className="flex justify-between"><dt>Livraison</dt><dd>Calculée par le serveur</dd></div><div className="flex justify-between border-t border-[var(--border)] pt-4 text-base font-bold"><dt>Total à confirmer</dt><dd>{formatPrice(getCartTotal())} + livraison</dd></div></dl></aside></div></main>;
}

function Field({ label, name, type = 'text', className = '', ...props }) {
  const id = `checkout-${name}`;
  return <label className={`block text-sm font-medium ${className}`} htmlFor={id}>{label}<input id={id} name={name} type={type} {...props} className="mt-2 min-h-11 w-full rounded border border-[var(--border)] px-3 outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-light)]" /></label>;
}

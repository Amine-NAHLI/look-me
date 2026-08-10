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
  
  const getDeliveryFee = () => {
    if (!address.city) return null;
    const normalized = address.city.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    return ['fes', 'fez'].includes(normalized) ? 0 : 30;
  };
  const deliveryFee = getDeliveryFee();
  const total = getCartTotal() + (deliveryFee || 0);

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

  return (
    <main className="min-h-screen bg-[var(--surface)] relative overflow-hidden">
      {/* Background Aurora */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-[var(--primary)]/10 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-[#d797a3]/10 blur-[100px]" />

      <div className="container relative mx-auto px-4 py-12 md:px-6 lg:px-12 lg:py-20">
        <h1 className="font-heading text-4xl lg:text-5xl">Finaliser la commande</h1>
        <p className="mt-3 text-[var(--gray)] max-w-lg text-sm">Paiement à la livraison. Les prix, frais et disponibilité sont confirmés avant création.</p>
        
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.2fr_1fr] xl:grid-cols-[1.5fr_1fr]">
          <form onSubmit={submit} className="space-y-6">
            <div className="rounded-[2rem] border border-white/60 bg-white/40 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.03)] backdrop-blur-xl md:p-10">
              <h2 className="font-heading text-2xl mb-6">Adresse de livraison</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <Field label="Nom complet" name="fullName" value={address.fullName} onChange={update} required />
                <Field label="Téléphone" name="phone" type="tel" value={address.phone} onChange={update} required />
                <Field label="Adresse" name="addressLine1" value={address.addressLine1} onChange={update} required className="md:col-span-2" />
                <Field label="Ville" name="city" value={address.city} onChange={update} required />
                <Field label="Code postal (facultatif)" name="postalCode" value={address.postalCode} onChange={update} />
              </div>
            </div>
            
            <button 
              type="submit" 
              disabled={loading} 
              className="group inline-flex min-h-16 w-full items-center justify-center gap-3 rounded-[2rem] bg-[var(--primary)] px-8 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[0_8px_20px_rgba(194,24,91,0.25)] transition-all hover:scale-[1.01] hover:bg-[var(--primary-hover)] hover:shadow-[0_12px_24px_rgba(194,24,91,0.35)] disabled:opacity-70 disabled:hover:scale-100"
            >
              {loading ? (
                <><Loader2 className="animate-spin" size={20} aria-hidden="true" /> Traitement en cours…</>
              ) : (
                'Confirmer la commande'
              )}
            </button>
          </form>

          <aside className="h-fit rounded-[2rem] border border-white/60 bg-white/40 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.03)] backdrop-blur-xl md:p-10">
            <h2 className="font-heading text-2xl mb-6">Récapitulatif</h2>
            <ul className="divide-y divide-white/40 border-b border-white/40 pb-4 mb-4">
              {cart.map((item) => (
                <li key={item.id} className="flex gap-4 py-4 group">
                  <div className="h-20 w-16 shrink-0 overflow-hidden rounded-xl bg-black/5">
                    {item.images?.[0] && <img src={getImageUrl(item.images[0])} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />}
                  </div>
                  <div className="min-w-0 flex-1 flex flex-col justify-center">
                    <p className="truncate text-sm font-bold text-[var(--dark)]">{item.name}</p>
                    <p className="text-xs font-medium text-[var(--gray)] mt-1">Quantité : {item.qty}</p>
                  </div>
                  <span className="text-sm font-bold flex items-center">{formatPrice(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-4 text-sm font-medium text-[var(--gray)]">
              <div className="flex justify-between items-center"><dt className="uppercase tracking-wider text-xs">Sous-total</dt><dd className="text-[var(--dark)]">{formatPrice(getCartTotal())}</dd></div>
              <div className="flex justify-between items-center"><dt className="uppercase tracking-wider text-xs">Livraison</dt><dd className="text-[var(--dark)]">{deliveryFee === null ? 'Saisissez votre ville' : deliveryFee === 0 ? 'Gratuite' : formatPrice(deliveryFee)}</dd></div>
              <div className="flex justify-between items-center border-t border-white/40 pt-6 mt-4">
                <dt className="text-base font-bold uppercase tracking-wider text-[var(--dark)]">Total</dt>
                <dd className="text-2xl font-bold text-[var(--primary)]">{formatPrice(total)}</dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Field({ label, name, type = 'text', className = '', ...props }) {
  const id = `checkout-${name}`;
  return (
    <label className={`block ${className}`} htmlFor={id}>
      <span className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-[var(--gray)]">{label}</span>
      <input 
        id={id} 
        name={name} 
        type={type} 
        {...props} 
        className="min-h-12 w-full rounded-xl border border-white/60 bg-white/50 px-4 py-2 outline-none backdrop-blur-md transition-all focus:border-[var(--primary)] focus:bg-white focus:ring-4 focus:ring-[var(--primary)]/10" 
      />
    </label>
  );
}

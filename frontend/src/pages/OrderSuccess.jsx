import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Loader2, Package } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/axiosConfig';
import { useUIStore } from '../store/useUIStore';
import { formatPrice } from '../utils/formatPrice';

export default function OrderSuccess() {
  const { id } = useParams();
  const guestOrderToken = useUIStore((state) => state.guestOrderTokens[id]);
  const user = useUIStore((state) => state.user);
  const { data, isLoading, isError } = useQuery({ queryKey: ['order-success', id], queryFn: () => api.get(`/orders/${id}`, { headers: guestOrderToken ? { 'X-Guest-Order-Token': guestOrderToken } : {} }).then(({ data: response }) => response.order), enabled: Boolean(id), retry: false });

  if (isLoading) return <main className="grid min-h-[60vh] place-items-center" aria-busy="true"><Loader2 className="animate-spin text-[var(--primary)]" /></main>;
  if (isError || !data) return <main className="grid min-h-[60vh] place-items-center p-6 text-center"><div><h1 className="font-heading text-3xl">Commande introuvable</h1><p className="mt-3 text-[var(--gray)]">Pour une commande invitée, utilisez le même navigateur que lors de la confirmation.</p><Link to="/catalogue" className="mt-6 inline-block underline">Retour au catalogue</Link></div></main>;

  return <main className="container mx-auto max-w-3xl px-4 py-16 text-center"><CheckCircle className="mx-auto h-16 w-16 text-emerald-600" aria-hidden="true" /><h1 className="mt-6 font-heading text-4xl">Commande enregistrée</h1><p className="mt-4 text-[var(--gray)]">Votre référence est <strong className="text-[var(--dark)]">{data.orderNumber}</strong>. Le paiement sera effectué à la livraison.</p><section className="mt-10 rounded border border-[var(--border)] bg-white p-6 text-left"><div className="flex items-center gap-3"><Package className="text-[var(--primary)]" aria-hidden="true" /><h2 className="font-heading text-2xl">Récapitulatif</h2></div><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><dt>Statut</dt><dd className="capitalize">{data.status}</dd></div><div className="flex justify-between"><dt>Total</dt><dd className="font-semibold">{formatPrice(data.total)}</dd></div><div className="flex justify-between"><dt>Livraison</dt><dd>{formatPrice(data.deliveryFee)}</dd></div></dl></section><div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">{user && <Link to={`/profil/commandes/${data.id}`} className="bg-[var(--dark)] px-6 py-3 font-semibold text-white">Voir ma commande</Link>}<Link to="/catalogue" className="border border-[var(--dark)] px-6 py-3 font-semibold">Continuer mes achats</Link></div></main>;
}

import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Calendar, Package } from 'lucide-react';
import api from '../../utils/axiosConfig';
import { formatPrice } from '../../utils/formatPrice';

export default function OrdersList() {
  const { data, isLoading, isError } = useQuery({ queryKey: ['my-orders'], queryFn: () => api.get('/orders/mine').then(({ data: response }) => response) });
  if (isLoading) return <p aria-busy="true">Chargement des commandes…</p>;
  if (isError) return <p role="alert">Impossible de charger vos commandes.</p>;
  const orders = data?.items || [];
  if (!orders.length) return <section className="rounded border border-dashed border-[var(--border)] p-10 text-center"><h1 className="font-heading text-3xl">Aucune commande</h1><p className="mt-3 text-[var(--gray)]">Vos commandes apparaîtront ici après confirmation.</p><Link to="/catalogue" className="mt-6 inline-block underline">Découvrir le catalogue</Link></section>;
  return <section><h1 className="font-heading text-3xl">Mes commandes</h1><div className="mt-7 space-y-4">{orders.map((order) => { const count = order.items?.reduce((total, item) => total + item.quantity, 0) || 0; return <article key={order.id} className="flex flex-col gap-4 rounded border border-[var(--border)] bg-white p-5 sm:flex-row sm:items-center sm:justify-between"><div><p className="font-semibold">{order.orderNumber}</p><p className="mt-1 flex items-center gap-2 text-sm text-[var(--gray)]"><Calendar size={15} aria-hidden="true" />{new Intl.DateTimeFormat('fr-MA', { dateStyle: 'medium' }).format(new Date(order.createdAt))}</p><p className="mt-2 flex items-center gap-2 text-sm"><Package size={15} aria-hidden="true" />{count} article{count > 1 ? 's' : ''}</p></div><div className="flex items-center gap-5"><div><p className="font-semibold text-[var(--primary)]">{formatPrice(order.total)}</p><p className="text-xs capitalize text-[var(--gray)]">{order.status}</p></div><Link to={`/profil/commandes/${order.id}`} className="underline">Détail</Link></div></article>; })}</div></section>;
}

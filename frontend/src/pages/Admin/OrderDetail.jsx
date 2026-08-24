import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/axiosConfig';
import { formatPrice } from '../../utils/formatPrice';
import { getImageUrl } from '../../utils/imageUrl';

export default function AdminOrderDetail() {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery({ queryKey: ['admin-order', id], queryFn: () => api.get(`/orders/${id}`).then(({ data: response }) => response.order), enabled: Boolean(id) });
  
  if (isLoading) return <p className="p-8" aria-busy="true">Chargement de la commande…</p>;
  if (isError || !data) return <p className="p-8" role="alert">Commande introuvable.</p>;
  
  return <main className="mx-auto max-w-5xl p-5 md:p-8">
    <Link to="/admin/orders" className="text-sm font-semibold underline">&larr; Retour aux commandes</Link>
    <header className="mt-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-heading text-4xl">{data.orderNumber}</h1>
        <p className="mt-2 text-sm text-[var(--gray)]">Passée le {new Intl.DateTimeFormat('fr-MA', { dateStyle: 'long', timeStyle: 'short' }).format(new Date(data.createdAt))}</p>
      </div>
      <span className="rounded bg-[var(--primary-light)] px-4 py-2 text-sm font-bold uppercase tracking-[.1em] text-[var(--primary)]">{data.status}</span>
    </header>
    
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_350px]">
      <section className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white">
        <h2 className="border-b border-[var(--border)] p-6 font-heading text-2xl">Articles commandés</h2>
        <ul className="divide-y divide-[var(--border)]">
          {data.items.map((item) => (
            <li key={item.id} className="flex gap-4 p-6">
              <div className="h-24 w-20 shrink-0 bg-[#F5F5F5]">
                {item.image && <img src={getImageUrl(item.image)} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg">{item.name}</p>
                {item.size && <p className="text-sm text-[var(--gray)]">Taille : <span className="font-bold">{item.size}</span></p>}
                {item.sku && <p className="text-xs text-[var(--gray)] mt-1">SKU : {item.sku}</p>}
                <p className="mt-2 text-sm text-[var(--gray)]">Quantité : <span className="font-bold text-black">{item.quantity}</span> × {formatPrice(item.unitPrice)}</p>
              </div>
              <p className="font-bold text-lg">{formatPrice(item.lineTotal)}</p>
            </li>
          ))}
        </ul>
      </section>
      
      <aside className="space-y-6">
        <section className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white p-6">
          <h2 className="font-heading text-xl">Détails de Livraison</h2>
          <p className="mt-4 text-sm leading-relaxed">
            <span className="font-bold uppercase">{data.shippingFullName}</span><br />
            {data.shippingPhone}<br />
            {data.shippingAddressLine1}<br />
            {data.shippingCity}{data.shippingPostalCode ? `, ${data.shippingPostalCode}` : ''}
          </p>
        </section>
        
        <section className="rounded-[var(--radius-md)] bg-[var(--dark)] p-6 text-white">
          <h2 className="font-heading text-xl">Récapitulatif Financier</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="flex justify-between"><dt>Sous-total</dt><dd>{formatPrice(data.subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Livraison</dt><dd>{formatPrice(data.deliveryFee)}</dd></div>
            <div className="flex justify-between border-t border-white/20 pt-4 text-lg font-bold"><dt>Total</dt><dd>{formatPrice(data.total)}</dd></div>
            <div className="flex justify-between border-t border-white/10 pt-4"><dt>Méthode de paiement</dt><dd>{data.paymentMethod === 'cash_on_delivery' ? 'À la livraison' : data.paymentMethod}</dd></div>
          </dl>
        </section>
      </aside>
    </div>
    
    <section className="mt-8 rounded-[var(--radius-md)] border border-[var(--border)] bg-white p-6">
      <h2 className="font-heading text-xl">Historique des statuts</h2>
      <ol className="mt-5 space-y-4">
        {data.statusHistory.map((entry) => (
          <li key={entry.id} className="text-sm">
            <span className="font-bold capitalize">{entry.status}</span> <span className="text-[var(--gray)]">— {new Intl.DateTimeFormat('fr-MA', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(entry.changedAt))}</span>
            {entry.note && <p className="mt-2 text-[var(--gray)]">{entry.note}</p>}
          </li>
        ))}
      </ol>
    </section>
  </main>;
}

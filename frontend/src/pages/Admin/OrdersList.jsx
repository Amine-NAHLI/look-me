import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../../utils/axiosConfig'
import { formatPrice } from '../../utils/formatPrice'
import AdminPagination from './AdminPagination'

const labels = { pending: 'En attente', confirmed: 'Confirmée', shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée' }
const allowed = { pending: ['confirmed', 'cancelled'], confirmed: ['shipped', 'cancelled'], shipped: ['delivered'], delivered: [], cancelled: [] }

export default function OrdersList() {
  const [page, setPage] = useState(1)
  const client = useQueryClient()
  const orders = useQuery({ queryKey: ['admin-orders', page], queryFn: () => api.get('/orders', { params: { page, limit: 15 } }).then(({ data }) => data), placeholderData: (previous) => previous })
  const changeStatus = useMutation({ mutationFn: ({ id, status }) => api.patch(`/orders/${id}/status`, { status }), onSuccess: () => { client.invalidateQueries({ queryKey: ['admin-orders'] }); toast.success('Statut mis à jour') }, onError: (error) => toast.error(error.response?.data?.error?.message || 'Transition impossible') })
  const deleteOrder = useMutation({ mutationFn: (id) => api.delete(`/orders/${id}`), onSuccess: () => { client.invalidateQueries({ queryKey: ['admin-orders'] }); toast.success('Commande supprimée') }, onError: (error) => toast.error(error.response?.data?.error?.message || 'Erreur lors de la suppression') })
  
  const update = (order, status) => { if (status !== order.status && window.confirm(`Passer la commande ${order.orderNumber} à « ${labels[status]} » ?`)) changeStatus.mutate({ id: order.id, status }) }
  const handleDelete = (order) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement la commande ${order.orderNumber} ?\n\nSi la commande n'était pas annulée, les stocks des produits seront automatiquement restaurés.`)) deleteOrder.mutate(order.id);
  }
  return <main className="mx-auto max-w-7xl p-5 md:p-8"><header><p className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--primary)]">Ventes</p><h1 className="mt-2 font-heading text-4xl">Commandes</h1></header>
    {orders.isLoading ? <p className="mt-8" aria-busy="true">Chargement des commandes…</p> : orders.isError ? <p className="mt-8" role="alert">Impossible de charger les commandes.</p> : <><div className="mt-8 overflow-x-auto rounded-[var(--radius-md)] border border-[var(--border)] bg-white"><table className="w-full min-w-[850px] text-left text-sm"><thead className="border-b bg-black/[.025] text-xs uppercase tracking-[.12em] text-[var(--gray)]"><tr><th className="p-4">Commande</th><th className="p-4">Client</th><th className="p-4">Date</th><th className="p-4">Total</th><th className="p-4">Paiement</th><th className="p-4">Statut</th><th className="p-4 text-right">Action</th></tr></thead><tbody>{orders.data.items.map((order) => <tr key={order.id} className="border-b last:border-0"><td className="p-4 font-medium">{order.orderNumber}</td><td className="p-4"><span className="block">{order.shippingFullName}</span><span className="text-xs text-[var(--gray)]">{order.shippingCity}</span></td><td className="p-4 text-[var(--gray)]">{new Intl.DateTimeFormat('fr-MA', { dateStyle: 'medium' }).format(new Date(order.createdAt))}</td><td className="p-4 font-medium">{formatPrice(order.total)}</td><td className="p-4">{order.paymentMethod === 'cash_on_delivery' ? 'À la livraison' : order.paymentMethod}</td><td className="p-4"><label className="sr-only" htmlFor={`order-status-${order.id}`}>Statut de {order.orderNumber}</label><select id={`order-status-${order.id}`} value={order.status} disabled={changeStatus.isPending || allowed[order.status].length === 0} onChange={(event) => update(order, event.target.value)} className="rounded border border-[var(--border)] bg-white p-2 text-sm disabled:opacity-60"><option value={order.status}>{labels[order.status]}</option>{allowed[order.status].map((status) => <option key={status} value={status}>{labels[status]}</option>)}</select></td><td className="p-4 text-right"><div className="flex items-center justify-end gap-2"><Link to={`/admin/orders/${order.id}`} className="inline-flex h-8 items-center justify-center rounded bg-[var(--primary)] px-3 text-[10px] font-bold uppercase tracking-[.1em] text-white hover:bg-[var(--primary-hover)]">Voir</Link><button type="button" onClick={() => handleDelete(order)} disabled={deleteOrder.isPending} className="inline-flex h-8 w-8 items-center justify-center rounded border border-[var(--border)] text-[var(--gray)] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"><Trash2 size={15} /></button></div></td></tr>)}</tbody></table></div>{orders.data.items.length === 0 && <p className="mt-6 rounded border border-dashed p-8 text-center text-[var(--gray)]">Aucune commande pour le moment.</p>}<AdminPagination page={orders.data.page} totalPages={orders.data.totalPages} onChange={setPage} /></>}</main>
}

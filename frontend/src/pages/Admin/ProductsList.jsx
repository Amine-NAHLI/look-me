import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Edit3, Plus, Search, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import api from '../../utils/axiosConfig'
import { formatPrice } from '../../utils/formatPrice'
import { getImageUrl } from '../../utils/imageUrl'
import AdminPagination from './AdminPagination'

export default function ProductsList() {
  const [page, setPage] = useState(1)
  const [query, setQuery] = useState('')
  const client = useQueryClient()
  const products = useQuery({ queryKey: ['admin-products', page, query], queryFn: () => api.get('/products/admin/all', { params: { page, limit: 12, q: query || undefined } }).then(({ data }) => data), placeholderData: (previous) => previous })
  const archive = useMutation({ mutationFn: (id) => api.delete(`/products/${id}`), onSuccess: () => { client.invalidateQueries({ queryKey: ['admin-products'] }); toast.success('Produit supprimé') }, onError: (error) => toast.error(error.response?.data?.error?.message || 'Suppression impossible') })
  const remove = (product) => { if (window.confirm(`Supprimer définitivement « ${product.name} » ?`)) archive.mutate(product.id) }

  return <main className="mx-auto max-w-7xl p-5 md:p-8"><header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--primary)]">Catalogue</p><h1 className="mt-2 font-heading text-4xl">Produits</h1></div><Link to="/admin/products/new" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[var(--radius)] bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--primary-dark)]"><Plus size={17} /> Nouveau produit</Link></header>
    <label className="mt-8 flex max-w-md items-center gap-2 rounded-[var(--radius)] border border-[var(--border)] bg-white px-3"><Search size={18} aria-hidden="true" /><span className="sr-only">Rechercher un produit</span><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1) }} className="w-full border-0 bg-transparent py-3 text-sm outline-none" placeholder="Rechercher…" /></label>
    {products.isLoading ? <p className="mt-8" aria-busy="true">Chargement des produits…</p> : products.isError ? <p className="mt-8" role="alert">Impossible de charger les produits.</p> : <><div className="mt-6 overflow-x-auto rounded-[var(--radius-md)] border border-[var(--border)] bg-white"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b bg-black/[.025] text-xs uppercase tracking-[.12em] text-[var(--gray)]"><tr><th className="p-4">Produit</th><th className="p-4">Catégorie</th><th className="p-4">Prix</th><th className="p-4">Stock</th><th className="p-4"><span className="sr-only">Actions</span></th></tr></thead><tbody>{products.data.items.map((product) => <tr key={product.id} className="border-b last:border-0"><td className="p-4"><div className="flex items-center gap-3"><img className="h-11 w-9 rounded object-cover" src={getImageUrl(product.images?.[0])} alt="" /><span className="font-medium">{product.name}</span></div></td><td className="p-4 text-[var(--gray)]">{product.category?.name || '—'}</td><td className="p-4">{formatPrice(product.price)}</td><td className="p-4">{product.stock}</td><td className="p-4"><div className="flex gap-2"><Link aria-label={`Modifier ${product.name}`} className="rounded p-2 hover:bg-black/5" to={`/admin/products/${product.id}/edit`}><Edit3 size={17} /></Link><button type="button" aria-label={`Supprimer ${product.name}`} className="rounded p-2 text-red-700 hover:bg-red-50 disabled:opacity-50" disabled={archive.isPending} onClick={() => remove(product)}><Trash2 size={17} /></button></div></td></tr>)}</tbody></table></div>{products.data.items.length === 0 && <p className="mt-6 rounded border border-dashed p-8 text-center text-[var(--gray)]">Aucun produit ne correspond à cette recherche.</p>}<AdminPagination page={products.data.page} totalPages={products.data.totalPages} onChange={setPage} /></>}</main>
}

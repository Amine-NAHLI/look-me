import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../../utils/axiosConfig'
import ImageUploader from '../../components/ImageUploader'
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const defaultVariants = SIZES.map(size => ({ size, stock: 0 }));
const emptyProduct = { name: '', description: '', category: '', price: '', compareAtPrice: '', sku: '', featured: false, images: [], variants: defaultVariants }
const field = 'mt-1 w-full rounded-[var(--radius)] border border-[var(--border)] bg-white px-3 py-3 text-sm outline-none focus:border-[var(--primary)]'
const toForm = (product) => product ? { ...emptyProduct, ...product, price: String(product.price), compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : '', images: product.images || [], category: product.categoryId, variants: product.variants?.length ? product.variants : defaultVariants } : emptyProduct

export default function ProductForm() {
  const { id } = useParams()
  const editing = Boolean(id)
  const product = useQuery({ queryKey: ['admin-product', id], queryFn: () => api.get(`/products/admin/${id}`).then(({ data }) => data.product), enabled: editing })
  if (editing && product.isLoading) return <main className="p-8" aria-busy="true">Chargement du produit…</main>
  if (editing && product.isError) return <main className="p-8" role="alert">Produit introuvable ou accès refusé.</main>
  return <ProductEditor key={product.data?.id || 'new'} id={id} initialProduct={product.data} />
}

function ProductEditor({ id, initialProduct }) {
  const editing = Boolean(id)
  const navigate = useNavigate()
  const client = useQueryClient()
  const [form, setForm] = useState(() => toForm(initialProduct))
  const [imageUrl, setImageUrl] = useState('')
  const categories = useQuery({ queryKey: ['admin-categories'], queryFn: () => api.get('/categories/admin/all').then(({ data }) => data.items) })
  const save = useMutation({ mutationFn: (payload) => editing ? api.put(`/products/${id}`, payload) : api.post('/products', payload), onSuccess: () => { client.invalidateQueries({ queryKey: ['admin-products'] }); toast.success(editing ? 'Produit mis à jour' : 'Produit créé'); navigate('/admin/products') }, onError: (error) => toast.error(error.response?.data?.error?.message || 'Enregistrement impossible') })
  const change = (event) => { const { name, value, type, checked } = event.target; setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value })) }
  const addImage = (url = imageUrl) => { const normalized = url.trim(); if (!normalized) return; if (form.images.length >= 8) return toast.error('Maximum de 8 images'); setForm((current) => ({ ...current, images: [...current.images, normalized] })); setImageUrl('') }
  const submit = (event) => { event.preventDefault(); save.mutate({ ...form, price: Number(form.price), compareAtPrice: form.compareAtPrice === '' ? undefined : Number(form.compareAtPrice), variants: form.variants }) }
  return <main className="mx-auto max-w-5xl p-5 md:p-8"><header className="flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--primary)]">Catalogue</p><h1 className="mt-2 font-heading text-4xl">{editing ? 'Modifier le produit' : 'Nouveau produit'}</h1></div><Link className="text-sm font-semibold text-[var(--primary)] underline" to="/admin/products">Retour</Link></header>
    <form className="mt-8 space-y-8" onSubmit={submit}>      <section className="grid gap-5 rounded-[var(--radius-md)] border border-[var(--border)] bg-white p-5 md:grid-cols-2"><h2 className="col-span-full font-heading text-2xl">Informations</h2><label className="text-sm font-medium">Nom<input required name="name" value={form.name} onChange={change} className={field} /></label><label className="text-sm font-medium">Catégorie<select required name="category" value={form.category} onChange={change} className={field}><option value="">Sélectionner…</option>{categories.data?.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label><label className="col-span-full text-sm font-medium">Description<textarea required name="description" minLength="10" value={form.description} onChange={change} rows="6" className={field} /></label></section>
      <section className="grid gap-5 rounded-[var(--radius-md)] border border-[var(--border)] bg-white p-5 md:grid-cols-2"><h2 className="col-span-full font-heading text-2xl">Prix et visibilité</h2><label className="text-sm font-medium">Prix (MAD)<input required name="price" type="number" min="0" step="0.01" value={form.price} onChange={change} className={field} /></label><label className="text-sm font-medium">Ancien prix (facultatif)<input name="compareAtPrice" type="number" min="0" step="0.01" value={form.compareAtPrice} onChange={change} className={field} /></label><label className="text-sm font-medium">SKU<input name="sku" value={form.sku || ''} onChange={change} className={field} /></label><label className="flex items-center gap-3 self-end pb-3 text-sm font-medium"><input name="featured" type="checkbox" checked={form.featured} onChange={change} /> Mettre en avant</label></section>
      <section className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white p-5"><h2 className="font-heading text-2xl">Stocks par taille</h2><div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{form.variants.map((variant, index) => <label key={variant.size} className="text-sm font-medium">Taille {variant.size}<input type="number" min="0" step="1" className={field} value={variant.stock} onChange={(e) => { const newVariants = [...form.variants]; newVariants[index].stock = Number(e.target.value) || 0; setForm((current) => ({ ...current, variants: newVariants })); }} /></label>)}</div></section>
      <section className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white p-5"><h2 className="font-heading text-2xl">Images</h2><div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{form.images.map((image, index) => <div key={`${image}-${index}`} className="relative"><img src={image} alt="" className="aspect-[4/5] w-full rounded object-cover" /><button type="button" onClick={() => setForm((current) => ({ ...current, images: current.images.filter((_, imageIndex) => imageIndex !== index) }))} className="mt-2 text-sm text-red-700 underline">Retirer</button></div>)}
      <div className="flex flex-col gap-2">
        <ImageUploader onUploadComplete={(url) => addImage(url)} />
      </div>
      </div></section>
      <div className="flex justify-end gap-3"><Link className="rounded border border-[var(--border)] px-5 py-3 text-sm font-semibold" to="/admin/products">Annuler</Link><button type="submit" disabled={save.isPending || categories.isLoading} className="rounded bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{save.isPending ? 'Enregistrement…' : 'Enregistrer'}</button></div>
    </form>
  </main>
}

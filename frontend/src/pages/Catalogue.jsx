import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Filter, X } from 'lucide-react'
import ProductGrid from '../components/ProductGrid'
import { useUIStore } from '../store/useUIStore'
import api from '../utils/axiosConfig'

export default function Catalogue() {
  const { selectedCategory, setSelectedCategory } = useUIStore()
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(({ data: response }) => response),
    staleTime: 5 * 60 * 1000,
  })
  const categories = [{ id: '', name: 'Toutes les pièces' }, ...(data?.items || []).map((category) => ({ id: category.id, name: category.name }))]
  const choose = (id) => { setSelectedCategory(id); setIsFilterOpen(false) }

  return (
    <main className="min-h-screen bg-[var(--white)]">
      <section className="bg-[#1c1b1b] px-4 py-16 text-center text-white md:py-24">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[#df0e84]">LOOKME · Maroc</p>
        <h1 className="font-heading text-4xl italic md:text-6xl">Le Catalogue</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm text-white/80">Des pièces pensées pour une élégance contemporaine, au quotidien comme pour les moments qui comptent.</p>
      </section>

      <div className="sticky top-[68px] z-30 border-b border-[var(--border)] bg-[var(--white)]/95 py-3 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 md:px-6 lg:px-12">
          <button type="button" onClick={() => setIsFilterOpen(true)} className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--dark)]">
            <Filter size={16} aria-hidden="true" /> Filtrer
          </button>
          <div className="hidden items-center gap-6 overflow-x-auto md:flex">
            {categories.map((category) => <button type="button" key={category.id} onClick={() => choose(category.id)} className={`whitespace-nowrap text-xs uppercase tracking-[0.12em] ${selectedCategory === category.id ? 'font-bold text-[var(--primary)]' : 'text-[var(--gray)] hover:text-[var(--dark)]'}`}>{category.name}</button>)}
          </div>
          <span className="hidden text-xs text-[var(--gray)] sm:block">Livraison au Maroc</span>
        </div>
      </div>

      <section className="container mx-auto px-4 py-12 md:px-6 lg:px-12 md:py-16"><ProductGrid /></section>

      {isFilterOpen && <div className="fixed inset-0 z-50 bg-black/40" role="presentation" onClick={() => setIsFilterOpen(false)}>
        <aside className="ml-auto flex h-full w-[min(100%,360px)] flex-col bg-[var(--white)] p-6 shadow-lg" role="dialog" aria-modal="true" aria-label="Filtres du catalogue" onClick={(event) => event.stopPropagation()}>
          <div className="mb-8 flex items-center justify-between"><h2 className="font-heading text-2xl">Filtres</h2><button type="button" aria-label="Fermer les filtres" onClick={() => setIsFilterOpen(false)}><X aria-hidden="true" /></button></div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--gray)]">Catégories</p>
          <div className="flex flex-col gap-2">{categories.map((category) => <button type="button" key={category.id} onClick={() => choose(category.id)} className={`rounded-[var(--radius)] px-3 py-3 text-left ${selectedCategory === category.id ? 'bg-[var(--primary-light)] font-semibold text-[var(--primary)]' : 'hover:bg-black/5'}`}>{category.name}</button>)}</div>
          <button type="button" onClick={() => choose('')} className="mt-auto border border-[var(--border)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em]">Réinitialiser</button>
        </aside>
      </div>}
    </main>
  )
}

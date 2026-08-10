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
      <section className="relative overflow-hidden bg-[#050505] px-4 py-20 text-center text-white md:py-32">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[var(--primary)]/20 blur-[120px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
        
        <div className="relative z-10">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-[var(--primary-hover)]">LOOKME · Maroc</p>
          <h1 className="font-heading text-5xl md:text-7xl">Le Catalogue</h1>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-white/70">Des pièces pensées pour une élégance contemporaine, au quotidien comme pour les moments qui comptent.</p>
        </div>
      </section>
      <div className="sticky top-0 z-30 border-b border-white/20 bg-white/70 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.04)] backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 md:px-6 lg:px-12">
          <button type="button" onClick={() => setIsFilterOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-white/50 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--dark)] backdrop-blur-md transition-colors hover:bg-[var(--primary)] hover:text-white">
            <Filter size={14} aria-hidden="true" strokeWidth={2.5} /> Filtrer
          </button>
          <div className="hidden items-center gap-2 overflow-x-auto md:flex">
            {categories.map((category) => <button type="button" key={category.id} onClick={() => choose(category.id)} className={`whitespace-nowrap rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] transition-all ${selectedCategory === category.id ? 'bg-[var(--primary)] text-white shadow-md' : 'text-[var(--gray)] hover:bg-black/5 hover:text-[var(--dark)]'}`}>{category.name}</button>)}
          </div>
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gray)] opacity-60 sm:block">Livraison au Maroc</span>
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

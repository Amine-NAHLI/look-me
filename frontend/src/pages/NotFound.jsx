import { ArrowLeft, SearchX } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function NotFound() {
  return <main className="grid min-h-[70vh] place-items-center px-4"><div className="max-w-lg text-center"><SearchX className="mx-auto text-[var(--primary)]" size={50} strokeWidth={1.25} aria-hidden="true" /><p className="mt-7 text-xs font-bold uppercase tracking-[.18em] text-[var(--primary)]">Erreur 404</p><h1 className="mt-3 font-heading text-5xl">Cette page est introuvable.</h1><p className="mt-5 leading-7 text-[var(--gray)]">La page demandée n’existe pas ou n’est plus disponible dans le catalogue LOOKME.</p><Link to="/" className="mt-9 inline-flex min-h-12 items-center gap-3 bg-[var(--primary)] px-6 text-xs font-bold uppercase tracking-[.14em] text-white hover:bg-[var(--primary-hover)]"><ArrowLeft size={16} aria-hidden="true" />Retour à l’accueil</Link></div></main>
}

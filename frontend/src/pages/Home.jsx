import { ArrowRight, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'

export default function Home() {
  const navigate = useNavigate()

  return <>
    <section className="border-b border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto grid max-w-[var(--content-max)] gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.1fr_.9fr] md:items-end md:py-20 lg:px-8 lg:py-28">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .45 }}>
          <p className="mb-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--primary)]">LOOKME · Maroc</p>
          <h1 className="max-w-3xl font-heading text-5xl leading-[.96] text-[var(--black)] sm:text-6xl lg:text-8xl">Une élégance<br /><em className="font-normal text-[var(--primary)]">à votre image.</em></h1>
          <p className="mt-7 max-w-lg text-base leading-7 text-[var(--gray)]">Découvrez les pièces actuellement disponibles chez LOOKME, pensées pour composer un vestiaire féminin contemporain.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => navigate('/catalogue')} className="inline-flex min-h-12 items-center justify-center gap-3 bg-[var(--primary)] px-7 text-xs font-bold uppercase tracking-[.14em] text-white transition-colors hover:bg-[var(--primary-hover)]">Voir le catalogue <ArrowRight size={16} aria-hidden="true" /></button>
            <a href="#selection" className="inline-flex min-h-12 items-center justify-center border border-[var(--dark)] px-7 text-xs font-bold uppercase tracking-[.14em] text-[var(--dark)] transition-colors hover:bg-[var(--dark)] hover:text-white">Découvrir la sélection</a>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .55, delay: .1 }} className="relative min-h-[320px] overflow-hidden bg-[var(--surface-container)] sm:min-h-[420px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_24%,rgba(194,24,91,.22),transparent_35%),linear-gradient(135deg,#f0edec_5%,#e1bec4_100%)]" />
          <div className="absolute inset-x-7 bottom-7 border border-white/70 bg-[var(--surface)]/90 p-5 shadow-[var(--shadow-sm)] backdrop-blur-sm"><p className="text-[10px] font-bold uppercase tracking-[.18em] text-[var(--primary)]">Collection LOOKME</p><p className="mt-2 font-heading text-2xl">Style contemporain, ancré au Maroc.</p></div>
          <span aria-hidden="true" className="absolute right-[-.08em] top-[-.23em] font-heading text-[10rem] leading-none text-white/45 sm:text-[14rem]">L</span>
        </motion.div>
      </div>
    </section>
    <section className="border-b border-[var(--border)] bg-[var(--black)] px-4 py-5 text-white sm:px-6">
      <div className="mx-auto flex max-w-[var(--content-max)] items-center justify-center gap-3 text-center text-xs font-medium uppercase tracking-[.13em]"><ShoppingBag size={16} aria-hidden="true" /><span>Paiement à la livraison</span><span aria-hidden="true" className="text-[var(--primary-hover)]">•</span><span>Montants confirmés avant validation</span></div>
    </section>
    <section id="selection" className="mx-auto max-w-[var(--content-max)] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-14 sm:flex-row sm:items-end"><div><p className="text-[11px] font-bold uppercase tracking-[.2em] text-[var(--primary)]">La sélection LOOKME</p><h2 className="mt-3 font-heading text-4xl sm:text-5xl">À découvrir maintenant</h2></div><button type="button" onClick={() => navigate('/catalogue')} className="inline-flex items-center gap-2 self-start text-xs font-bold uppercase tracking-[.14em] text-[var(--dark)] underline decoration-[var(--primary)] underline-offset-8 hover:text-[var(--primary)] sm:self-auto">Tout le catalogue <ArrowRight size={15} aria-hidden="true" /></button></div>
      <ProductGrid />
    </section>
  </>
}

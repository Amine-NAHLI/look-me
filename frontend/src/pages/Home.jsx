import { ArrowRight, ShoppingBag } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'

export default function Home() {
  const navigate = useNavigate()

  return (
    <main className="overflow-hidden bg-[var(--surface)]">
      {/* 1. Hero Section (Bento Grid) */}
      <section className="relative min-h-[90vh] px-4 pb-14 pt-20 md:px-6 lg:px-8 lg:pb-20 lg:pt-28">
        {/* Background Aurora */}
        <div className="pointer-events-none absolute -left-20 top-0 h-[600px] w-[600px] rounded-full bg-[var(--primary)]/10 blur-[120px]" />
        
        <div className="mx-auto grid max-w-[var(--content-max)] gap-6 md:grid-cols-12 md:grid-rows-[auto_auto]">
          
          {/* Main Typographic Bento */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex flex-col justify-center overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/40 p-8 shadow-2xl backdrop-blur-xl md:col-span-8 md:row-span-2 lg:p-14"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent pointer-events-none" />
            <p className="mb-6 inline-flex self-start rounded-full border border-[var(--primary)]/20 bg-white/60 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--primary)] backdrop-blur-md">LOOKME · Maroc</p>
            <h1 className="font-heading text-5xl leading-[1.05] text-[var(--dark)] sm:text-6xl lg:text-7xl xl:text-8xl">
              Une élégance<br /><span className="italic text-[var(--primary)] text-opacity-80">à votre image.</span>
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-[var(--gray)] lg:text-base">
              Découvrez les pièces actuellement disponibles chez LOOKME, pensées pour composer un vestiaire féminin audacieux et contemporain.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <button type="button" onClick={() => navigate('/catalogue')} className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[var(--primary)] px-8 text-[11px] font-bold uppercase tracking-[.2em] text-white shadow-[0_8px_20px_rgba(194,24,91,0.25)] transition-all duration-300 hover:scale-[1.02] hover:bg-[var(--primary-hover)] hover:shadow-[0_12px_24px_rgba(194,24,91,0.35)]">
                Voir la collection <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </motion.div>

          {/* Secondary Bento 1 : Cinematic Image (Replaces Video) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="group relative aspect-square overflow-hidden rounded-[2.5rem] md:col-span-4"
          >
            <motion.img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop" 
              alt="Mode" 
              className="absolute inset-0 h-full w-full object-cover" 
              animate={{ scale: [1, 1.15, 1] }} 
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-transparent" />
            <div className="absolute inset-0 rounded-[2.5rem] border border-white/20" />
          </motion.div>

          {/* Secondary Bento 2 : Abstract Lettermark */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-[2.5rem] border border-white/60 bg-gradient-to-br from-white/40 to-white/10 p-6 shadow-xl backdrop-blur-md md:col-span-4"
          >
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-[#d797a3]/40 blur-[40px] transition-transform duration-700 group-hover:scale-150" />
            <span aria-hidden="true" className="absolute -right-4 -top-8 select-none font-heading text-[12rem] leading-none text-[var(--dark)]/5 mix-blend-multiply transition-transform duration-1000 group-hover:-translate-x-4">L</span>
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--dark)]">Livraison rapide</span>
              <div className="grid h-10 w-10 place-items-center rounded-full bg-white/60 shadow-sm backdrop-blur-md">
                <ShoppingBag size={14} className="text-[var(--primary)]" />
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* 2. Infinite Marquee */}
      <section className="overflow-hidden border-y border-[var(--border)] bg-white py-6">
        <div className="relative flex w-full flex-nowrap overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ repeat: Infinity, ease: 'linear', duration: 25 }}
          >
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--dark)]">
                <span className="mx-6 text-[var(--primary)]">✦</span>
                NOUVELLE COLLECTION
                <span className="mx-6 text-[var(--primary)]">✦</span>
                LOOKME MAROC
                <span className="mx-6 text-[var(--primary)]">✦</span>
                PAIEMENT À LA LIVRAISON
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. Section Sélection (Dark Aura) */}
      <section id="selection" className="relative overflow-hidden bg-[#050505] px-4 py-20 text-white sm:px-6 lg:px-8 lg:py-32">
        {/* Dark Mode Background Effects */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-[var(--primary)]/10 blur-[150px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

        <div className="relative z-10 mx-auto max-w-[var(--content-max)]">
          <div className="mb-14 flex flex-col items-center justify-between gap-6 text-center sm:mb-20 sm:flex-row sm:text-left">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.25em] text-[var(--primary-hover)]">La sélection LOOKME</p>
              <h2 className="mt-4 font-heading text-4xl sm:text-5xl lg:text-6xl">À découvrir maintenant</h2>
            </div>
            <button type="button" onClick={() => navigate('/catalogue')} className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-[10px] font-bold uppercase tracking-[.2em] text-white backdrop-blur-md transition-colors hover:bg-white/10 hover:text-[var(--primary-hover)]">
              Tout le catalogue <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          
          {/* We wrap ProductGrid in a dark mode context visually by the section background, 
              ProductGrid's glassmorphism will adapt to the dark background! */}
          <div className="dark-theme-wrapper">
            <ProductGrid />
          </div>
        </div>
      </section>
    </main>
  );
}

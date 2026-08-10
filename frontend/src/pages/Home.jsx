import { ArrowRight, ShoppingBag } from 'lucide-react'
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ProductGrid from '../components/ProductGrid'

export default function Home() {
  const navigate = useNavigate()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }) {
    let { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

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
        <motion.div 
          initial={{ opacity: 0, scale: .98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: .6, ease: [0.16, 1, 0.3, 1], delay: .1 }} 
          onMouseMove={handleMouseMove}
          className="group relative flex min-h-[380px] w-full flex-col justify-end overflow-hidden rounded-[2.5rem] border border-[var(--border)] bg-[#f9f8f8] p-8 shadow-2xl sm:min-h-[480px]"
        >
          {/* Spotlight Effect that follows mouse */}
          <motion.div 
            className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition duration-500 group-hover:opacity-100" 
            style={{ background: useMotionTemplate`radial-gradient(600px circle at ${mouseX}px ${mouseY}px, rgba(194,24,91,0.08), transparent 60%)` }} 
          />
          <motion.div 
            className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition duration-500 group-hover:opacity-100" 
            style={{ background: useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, rgba(255,255,255,0.8), transparent 40%)` }} 
          />

          {/* Grain texture overlay for premium film look */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

          {/* Animated decorative shapes */}
          <div className="absolute -left-12 top-12 h-64 w-64 rounded-full bg-[var(--primary)]/5 blur-[60px] transition-transform duration-1000 group-hover:translate-x-8 group-hover:scale-110" />
          <div className="absolute -bottom-20 -right-12 h-80 w-80 rounded-full bg-[#d797a3]/15 blur-[80px] transition-transform duration-1000 group-hover:-translate-y-8 group-hover:scale-110" />

          {/* Large Letter Mark */}
          <span aria-hidden="true" className="absolute -right-6 -top-12 select-none font-heading text-[18rem] leading-none text-[var(--dark)]/5 mix-blend-multiply transition-all duration-1000 group-hover:-translate-y-6 group-hover:translate-x-6 sm:text-[24rem]">L</span>

          {/* Content Card with extreme blur & precise borders */}
          <div className="relative z-10 w-full overflow-hidden rounded-[1.5rem] border border-white/60 bg-white/30 p-6 shadow-[0_8px_32px_rgba(0,0,0,0.02)] backdrop-blur-xl transition-all duration-500 group-hover:bg-white/40 group-hover:shadow-[0_8px_32px_rgba(194,24,91,0.06)] sm:p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/10 to-transparent pointer-events-none" />
            
            <div className="relative flex flex-col items-start gap-4">
              <div className="flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-white/50 px-3 py-1.5 backdrop-blur-md">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--primary)] opacity-75"></span>
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--primary)]"></span>
                </span>
                <p className="text-[9px] font-bold uppercase tracking-[.25em] text-[var(--primary)]">Nouveautés</p>
              </div>
              
              <div>
                <h3 className="font-heading text-4xl leading-[1.1] text-[var(--dark)] sm:text-5xl">Style contemporain,<br />ancré au Maroc.</h3>
                <p className="mt-3 text-sm text-[var(--gray)] opacity-80">Découvrez l'essence de l'élégance moderne.</p>
              </div>
            </div>
          </div>
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

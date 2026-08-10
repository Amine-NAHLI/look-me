import { Link } from 'react-router-dom'

const links = {
  Boutique: [{ to: '/catalogue', label: 'Catalogue' }, { to: '/nouveautes', label: 'Nouveautés' }, { to: '/livraison-retours', label: 'Livraison et retours' }],
  Informations: [{ to: '/cgv', label: 'Conditions générales de vente' }, { to: '/confidentialite', label: 'Confidentialité' }, { to: '/mentions-legales', label: 'Mentions légales' }],
}

export default function Footer() {
  return <footer className="relative overflow-hidden bg-[#050505] px-4 py-16 text-white sm:px-6 lg:px-8">
    <div className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />
    <span aria-hidden="true" className="pointer-events-none absolute -bottom-12 -left-12 select-none font-heading text-[12rem] leading-none text-white/[0.02] sm:text-[20rem]">L</span>
    <div className="relative z-10 mx-auto grid max-w-[var(--content-max)] gap-10 md:grid-cols-[1.45fr_1fr_1fr]">
      <div><Link to="/" className="font-heading text-4xl font-semibold tracking-[.12em]">LOOK<span className="text-[var(--primary-hover)]">ME</span></Link><p className="mt-5 max-w-sm text-sm leading-6 text-white/60">Mode marocaine contemporaine, pensée pour une élégance qui vous ressemble.</p></div>
      {Object.entries(links).map(([title, items]) => <div key={title}><h2 className="text-[11px] font-bold uppercase tracking-[.2em] text-white/50">{title}</h2><nav aria-label={title} className="mt-5 flex flex-col gap-3 text-sm text-white/80">{items.map((item) => <Link key={item.to} to={item.to} className="w-fit hover:text-white hover:underline hover:underline-offset-4">{item.label}</Link>)}</nav></div>)}
    </div>
    <p className="relative z-10 mx-auto mt-16 max-w-[var(--content-max)] border-t border-white/10 pt-6 text-xs leading-5 text-white/40">© {new Date().getFullYear()} LOOKME. Les contenus légaux et les coordonnées du vendeur doivent être validés avant publication.</p>
  </footer>
}

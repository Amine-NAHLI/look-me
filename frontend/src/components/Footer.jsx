import { Link } from 'react-router-dom'

const links = {
  Boutique: [{ to: '/catalogue', label: 'Catalogue' }, { to: '/nouveautes', label: 'Nouveautés' }, { to: '/livraison-retours', label: 'Livraison et retours' }],
  Informations: [{ to: '/cgv', label: 'Conditions générales de vente' }, { to: '/confidentialite', label: 'Confidentialité' }, { to: '/mentions-legales', label: 'Mentions légales' }],
}

export default function Footer() {
  return <footer className="bg-[var(--black)] px-4 py-14 text-white sm:px-6 lg:px-8">
    <div className="mx-auto grid max-w-[var(--content-max)] gap-10 md:grid-cols-[1.45fr_1fr_1fr]">
      <div><Link to="/" className="font-heading text-3xl font-semibold tracking-[.12em]">LOOK<span className="text-[var(--primary-hover)]">ME</span></Link><p className="mt-5 max-w-sm text-sm leading-6 text-white/70">Mode marocaine contemporaine, pensée pour une élégance qui vous ressemble.</p></div>
      {Object.entries(links).map(([title, items]) => <div key={title}><h2 className="text-[11px] font-bold uppercase tracking-[.16em]">{title}</h2><nav aria-label={title} className="mt-5 flex flex-col gap-3 text-sm text-white/70">{items.map((item) => <Link key={item.to} to={item.to} className="w-fit hover:text-white hover:underline hover:underline-offset-4">{item.label}</Link>)}</nav></div>)}
    </div>
    <p className="mx-auto mt-12 max-w-[var(--content-max)] border-t border-white/15 pt-6 text-xs leading-5 text-white/55">© {new Date().getFullYear()} LOOKME. Les contenus légaux et les coordonnées du vendeur doivent être validés avant publication.</p>
  </footer>
}

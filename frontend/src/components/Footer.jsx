import { Link } from 'react-router-dom'

export default function Footer() {
  return <footer className="bg-[#1c1b1b] px-6 py-14 text-white">
    <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
      <div><Link to="/" className="font-heading text-3xl tracking-[0.12em]">LOOKME</Link><p className="mt-4 max-w-sm text-sm leading-6 text-white/70">Mode marocaine contemporaine, pensée pour une élégance qui vous ressemble.</p></div>
      <div><h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">Boutique</h2><nav className="mt-4 flex flex-col gap-3 text-sm text-white/70"><Link to="/catalogue" className="hover:text-white">Catalogue</Link><Link to="/nouveautes" className="hover:text-white">Nouveautés</Link><Link to="/livraison-retours" className="hover:text-white">Livraison et retours</Link></nav></div>
      <div><h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">Informations</h2><nav className="mt-4 flex flex-col gap-3 text-sm text-white/70"><Link to="/cgv" className="hover:text-white">Conditions générales de vente</Link><Link to="/confidentialite" className="hover:text-white">Confidentialité</Link><Link to="/mentions-legales" className="hover:text-white">Mentions légales</Link></nav></div>
    </div>
    <p className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-6 text-xs text-white/50">© {new Date().getFullYear()} LOOKME. Les informations légales et de contact seront complétées avant publication.</p>
  </footer>
}

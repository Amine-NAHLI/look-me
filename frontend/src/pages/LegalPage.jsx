import { Link, useLocation } from 'react-router-dom'

const content = {
  '/mentions-legales': ['Mentions légales', 'Les informations du vendeur, de l’hébergeur et les coordonnées officielles doivent être complétées avant publication.'],
  '/confidentialite': ['Politique de confidentialité', 'Ce modèle doit être validé et complété selon les traitements réellement effectués, les durées de conservation et les droits applicables.'],
  '/cgv': ['Conditions générales de vente', 'Ce modèle doit préciser les prix, la livraison, les retours, le paiement à la livraison et le droit applicable avant mise en ligne.'],
  '/livraison-retours': ['Livraison et retours', 'Les zones, délais, frais et conditions de retour doivent être renseignés avec les engagements réels de LOOKME.'],
}

export default function LegalPage() {
  const [title, text] = content[useLocation().pathname] || ['Information', 'Cette page est en cours de préparation.']
  return <main className="mx-auto max-w-3xl px-5 py-16 md:py-24"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">LOOKME</p><h1 className="mt-3 font-heading text-4xl">{title}</h1><p className="mt-8 leading-8 text-[var(--gray)]">{text}</p><p className="mt-8 border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">Document modèle, à faire relire par un professionnel du droit avant publication.</p><Link className="mt-10 inline-block text-sm font-semibold text-[var(--primary)] underline underline-offset-4" to="/">Retour à la boutique</Link></main>
}

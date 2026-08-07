import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { Menu, Search, ShoppingBag, User, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useUIStore } from '../store/useUIStore'
import { drawerVariants, overlayVariants } from '../utils/animations'

const links = [
  { name: 'Accueil', path: '/' },
  { name: 'Catalogue', path: '/catalogue' },
  { name: 'Nouveautés', path: '/nouveautes' },
]

function Brand() {
  return <span className="font-heading text-[1.35rem] font-semibold tracking-[0.12em] text-[var(--black)] md:text-[1.5rem]">LOOK<span className="text-[var(--primary)]">ME</span></span>
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const closeButton = useRef(null)
  const navigate = useNavigate()
  const { cart, openCart, user, openAuthModal } = useUIStore()
  const { scrollY } = useScroll()
  const navShadow = useTransform(scrollY, [0, 80], ['none', '0 3px 20px rgba(10,10,10,0.08)'])
  const cartItemsCount = cart.reduce((total, item) => total + item.qty, 0)

  useEffect(() => {
    if (!isMenuOpen) return undefined
    closeButton.current?.focus()
    const onKeyDown = (event) => { if (event.key === 'Escape') setIsMenuOpen(false) }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isMenuOpen])

  const accountAction = () => user ? navigate('/profil') : openAuthModal()

  return <>
    <div className="bg-[var(--black)] px-4 py-2 text-center text-[10px] font-medium uppercase tracking-[0.16em] text-white sm:text-[11px]">
      Paiement à la livraison disponible
    </div>
    <motion.header style={{ boxShadow: navShadow }} className="sticky top-0 z-[1000] border-b border-[var(--border)] bg-[var(--surface)]">
      <nav aria-label="Navigation principale" className="mx-auto grid h-[72px] max-w-[var(--content-max)] grid-cols-3 items-center px-4 md:px-6">
        <div className="flex items-center">
          <button type="button" aria-label="Ouvrir le menu" aria-expanded={isMenuOpen} onClick={() => setIsMenuOpen(true)} className="grid h-11 w-11 place-items-center text-[var(--dark)] lg:hidden"><Menu size={23} strokeWidth={1.5} aria-hidden="true" /></button>
          <div className="hidden items-center gap-7 lg:flex">
            {links.map((link) => <Link key={link.path} to={link.path} className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--dark)] transition-colors hover:text-[var(--primary)]">{link.name}</Link>)}
            {user?.role === 'admin' && <Link to="/admin/dashboard" className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--dark)] transition-colors hover:text-[var(--primary)]">Administration</Link>}
          </div>
        </div>
        <Link to="/" aria-label="LOOKME, accueil" className="justify-self-center"><Brand /></Link>
        <div className="flex items-center justify-self-end gap-1 sm:gap-2">
          <button type="button" aria-label="Rechercher dans le catalogue" onClick={() => navigate('/catalogue')} className="hidden h-11 w-11 place-items-center text-[var(--dark)] transition-colors hover:text-[var(--primary)] sm:grid"><Search size={20} strokeWidth={1.5} aria-hidden="true" /></button>
          <button type="button" aria-label={user ? 'Accéder à mon compte' : 'Se connecter ou créer un compte'} onClick={accountAction} className="grid h-11 w-11 place-items-center text-[var(--dark)] transition-colors hover:text-[var(--primary)]"><User size={20} strokeWidth={1.5} aria-hidden="true" /></button>
          <button type="button" aria-label={`Ouvrir le panier, ${cartItemsCount} article${cartItemsCount > 1 ? 's' : ''}`} onClick={openCart} className="relative grid h-11 w-11 place-items-center text-[var(--dark)] transition-colors hover:text-[var(--primary)]"><ShoppingBag size={20} strokeWidth={1.5} aria-hidden="true" />{cartItemsCount > 0 && <span className="absolute right-0 top-0 grid min-h-4 min-w-4 place-items-center rounded-full bg-[var(--primary-hover)] px-1 text-[10px] font-bold text-white">{cartItemsCount}</span>}</button>
        </div>
      </nav>
    </motion.header>
    <AnimatePresence>{isMenuOpen && <>
      <motion.button type="button" aria-label="Fermer le menu" variants={overlayVariants} initial="hidden" animate="visible" exit="exit" onClick={() => setIsMenuOpen(false)} className="fixed inset-0 z-[1001] cursor-default bg-black/40" />
      <motion.aside variants={drawerVariants} initial="hidden" animate="visible" exit="exit" aria-label="Menu mobile" className="fixed inset-y-0 left-0 z-[1002] flex w-[min(88vw,360px)] flex-col bg-[var(--surface)] shadow-lg">
        <div className="flex items-center justify-between border-b border-[var(--border)] p-6"><Brand /><button ref={closeButton} type="button" aria-label="Fermer le menu" onClick={() => setIsMenuOpen(false)} className="grid h-11 w-11 place-items-center text-[var(--dark)]"><X size={22} strokeWidth={1.5} aria-hidden="true" /></button></div>
        <div className="flex flex-col p-6">
          {links.map((link) => <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)} className="border-b border-[var(--border)] py-5 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--dark)] hover:text-[var(--primary)]">{link.name}</Link>)}
          {user?.role === 'admin' && <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="border-b border-[var(--border)] py-5 text-sm font-semibold uppercase tracking-[0.14em] text-[var(--dark)] hover:text-[var(--primary)]">Administration</Link>}
        </div>
      </motion.aside>
    </>}</AnimatePresence>
  </>
}

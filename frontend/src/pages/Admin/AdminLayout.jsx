import { NavLink, Outlet } from 'react-router-dom'
import { LayoutDashboard, Package, Tags, ShoppingBag, Store } from 'lucide-react'

const entries = [
  { to: '/admin/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Produits', icon: Package },
  { to: '/admin/categories', label: 'Catégories', icon: Tags },
  { to: '/admin/orders', label: 'Commandes', icon: ShoppingBag },
]

export default function AdminLayout() {
  return <div className="min-h-screen bg-[#fcf8f8] text-[var(--dark)] lg:grid lg:grid-cols-[250px_minmax(0,1fr)]">
    <aside className="border-b border-black/10 bg-[#1c1b1b] px-5 py-5 text-white lg:min-h-screen lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between lg:block"><NavLink to="/admin/dashboard" className="font-heading text-2xl tracking-[0.14em]">LOOKME</NavLink><NavLink to="/" className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-white lg:mt-3"><Store size={14} /> Voir la boutique</NavLink></div>
      <nav aria-label="Administration" className="mt-6 flex gap-2 overflow-x-auto lg:flex-col">
        {entries.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `inline-flex shrink-0 items-center gap-3 rounded-[var(--radius)] px-3 py-3 text-sm transition ${isActive ? 'bg-[#9b0044] text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}><Icon size={18} aria-hidden="true" />{label}</NavLink>)}
      </nav>
    </aside>
    <section className="min-w-0"><Outlet /></section>
  </div>
}

import { Link } from 'react-router-dom'
import { AlertCircle, ArrowRight, Package, ShoppingBag, TrendingUp, Download, RefreshCw } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../utils/axiosConfig'
import { formatPrice } from '../utils/formatPrice'

function Stat({ label, value, icon }) { return <article className="rounded-[var(--radius-md)] border border-[var(--border)] bg-white p-5"><div className="flex items-center justify-between text-[var(--primary)]">{icon}<span className="text-xs font-semibold uppercase tracking-[.12em] text-[var(--gray)]">{label}</span></div><p className="mt-5 text-3xl font-semibold">{value}</p></article> }

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const dashboard = useQuery({ 
    queryKey: ['admin-dashboard'], 
    queryFn: async () => { const { data } = await api.get('/orders/dashboard/stats'); return data; }
  });

  const resetMutation = useMutation({
    mutationFn: () => api.post('/orders/dashboard/reset'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      toast.success('Le tableau de bord a été remis à zéro pour ce mois.');
    },
    onError: () => toast.error('Erreur lors de la remise à zéro.')
  });

  if (dashboard.isLoading) return <main className="p-8" aria-busy="true">Chargement de l’administration…</main>
  if (dashboard.isError) return <main className="p-8" role="alert">Impossible de charger l’administration.</main>
  
  const { revenue, periodOrdersCount, totalProducts, lowStockCount, recentOrders } = dashboard.data;
  
  const isStartOfMonth = new Date().getDate() <= 7;
  
  const handleReset = () => {
    if (window.confirm('Voulez-vous vraiment clôturer et remettre les compteurs à zéro ? Vos commandes ne seront pas supprimées.')) {
      resetMutation.mutate();
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get('/orders/export/monthly', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bilan-lookme-${new Date().getFullYear()}-${String(new Date().getMonth() || 12).padStart(2, '0')}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error('Erreur lors du téléchargement');
    }
  };

  return <main className="mx-auto max-w-7xl space-y-8 p-5 md:p-8">
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[.16em] text-[var(--primary)]">LOOKME / Administration</p>
        <h1 className="mt-2 font-heading text-4xl">Tableau de bord</h1>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button onClick={handleReset} disabled={resetMutation.isPending} className="inline-flex items-center gap-2 rounded border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-[var(--dark)] hover:bg-gray-50">
          <RefreshCw size={16} className={resetMutation.isPending ? 'animate-spin' : ''} />
          Remettre à zéro
        </button>
        <Link className="inline-flex items-center gap-2 rounded bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--primary-hover)]" to="/admin/products/new">Créer un produit <ArrowRight size={16} /></Link>
      </div>
    </header>

    {isStartOfMonth && (
      <div className="flex flex-col items-start justify-between gap-4 rounded-[var(--radius-md)] border border-blue-200 bg-blue-50 p-5 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-heading text-lg text-blue-900">Rapport mensuel disponible !</h3>
          <p className="mt-1 text-sm text-blue-700">Le mois vient de se terminer. Vous pouvez télécharger le récapitulatif complet des commandes.</p>
        </div>
        <button onClick={handleDownload} className="inline-flex shrink-0 items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
          <Download size={16} />
          Télécharger le PDF
        </button>
      </div>
    )}

    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat label="Revenus de la période" value={formatPrice(revenue)} icon={<TrendingUp aria-hidden="true" />} />
      <Stat label="Commandes (période)" value={periodOrdersCount} icon={<ShoppingBag aria-hidden="true" />} />
      <Stat label="Total Produits" value={totalProducts} icon={<Package aria-hidden="true" />} />
      <Stat label="Stock faible" value={lowStockCount} icon={<AlertCircle aria-hidden="true" />} />
    </section>

    <section className="overflow-x-auto rounded-[var(--radius-md)] border border-[var(--border)] bg-white">
      <div className="flex items-center justify-between p-5">
        <h2 className="font-heading text-2xl">Commandes récentes</h2>
        <Link className="text-sm font-semibold text-[var(--primary)] underline" to="/admin/orders">Toutes les commandes</Link>
      </div>
      <table className="w-full min-w-[650px] text-left text-sm">
        <thead className="border-y bg-black/[.025] text-xs uppercase tracking-[.12em] text-[var(--gray)]">
          <tr><th className="p-4">Commande</th><th className="p-4">Client</th><th className="p-4">Total</th><th className="p-4">Statut</th></tr>
        </thead>
        <tbody>
          {recentOrders.map((order) => <tr key={order.id} className="border-b last:border-0"><td className="p-4 font-medium">{order.orderNumber}</td><td className="p-4">{order.shippingFullName}</td><td className="p-4">{formatPrice(order.total)}</td><td className="p-4 capitalize">{order.status}</td></tr>)}
          {recentOrders.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-[var(--gray)]">Aucune commande récente.</td></tr>}
        </tbody>
      </table>
    </section>
  </main>
}

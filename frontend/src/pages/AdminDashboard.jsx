import { Link } from 'react-router-dom'
import { AlertCircle, ArrowRight, Package, ShoppingBag, TrendingUp, Download, RefreshCw, Trash2, Eye } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import api from '../utils/axiosConfig'
import { formatPrice } from '../utils/formatPrice'

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

  const deleteOrder = useMutation({
    mutationFn: (id) => api.delete(`/orders/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
      toast.success('Commande supprimée');
    },
    onError: (error) => toast.error(error.response?.data?.error?.message || 'Erreur lors de la suppression')
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

  const handleDelete = (order) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement la commande ${order.orderNumber} ?\n\nLes stocks des produits seront restaurés.`)) {
      deleteOrder.mutate(order.id);
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

  return (
    <main className="relative min-h-screen bg-[var(--surface)] p-5 md:p-8 overflow-hidden">
      {/* Background Aurora */}
      <div className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-[var(--primary)]/10 blur-[120px]" />
      
      <div className="mx-auto max-w-7xl relative z-10 space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between rounded-[2.5rem] border border-white/60 bg-white/40 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] backdrop-blur-xl">
          <div>
            <p className="inline-flex rounded-full border border-[var(--primary)]/20 bg-white/60 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--primary)] backdrop-blur-md">LOOKME / Administration</p>
            <h1 className="mt-4 font-heading text-4xl lg:text-5xl">Tableau de bord</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button onClick={handleReset} disabled={resetMutation.isPending} className="inline-flex items-center gap-2 rounded-full border border-[var(--primary)]/20 bg-white/60 px-6 py-3 text-[11px] font-bold uppercase tracking-widest text-[var(--dark)] backdrop-blur-md transition-all hover:bg-white hover:shadow-md disabled:opacity-50">
              <RefreshCw size={14} className={resetMutation.isPending ? 'animate-spin' : ''} />
              Remettre à zéro
            </button>
            <Link className="group inline-flex items-center gap-3 rounded-full bg-[var(--primary)] px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_8px_20px_rgba(194,24,91,0.25)] transition-all hover:scale-[1.02] hover:bg-[var(--primary-hover)] hover:shadow-[0_12px_24px_rgba(194,24,91,0.35)]" to="/admin/products/new">
              Créer un produit <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </header>

        {isStartOfMonth && (
          <div className="flex flex-col items-start justify-between gap-4 rounded-[2rem] border border-blue-200 bg-blue-50/50 p-6 backdrop-blur-xl sm:flex-row sm:items-center">
            <div>
              <h3 className="font-heading text-xl text-blue-900">Rapport mensuel disponible !</h3>
              <p className="mt-1 text-sm text-blue-700">Le mois vient de se terminer. Vous pouvez télécharger le récapitulatif complet des commandes.</p>
            </div>
            <button onClick={handleDownload} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-lg transition-all hover:scale-105 hover:bg-blue-700">
              <Download size={14} />
              Télécharger le PDF
            </button>
          </div>
        )}

        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Revenus de la période" value={formatPrice(revenue)} icon={<TrendingUp size={20} />} />
          <Stat label="Commandes (période)" value={periodOrdersCount} icon={<ShoppingBag size={20} />} />
          <Stat label="Total Produits" value={totalProducts} icon={<Package size={20} />} />
          <Stat label="Stock faible" value={lowStockCount} icon={<AlertCircle size={20} />} />
        </section>

        <section className="overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.03)] backdrop-blur-xl">
          <div className="flex items-center justify-between p-8 border-b border-white/40">
            <h2 className="font-heading text-3xl">Commandes récentes</h2>
            <Link className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/60 px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--dark)] backdrop-blur-md transition-all hover:bg-white hover:text-[var(--primary)]" to="/admin/orders">Toutes les commandes</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-black/5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gray)]">
                <tr><th className="p-6">Commande</th><th className="p-6">Client</th><th className="p-6">Total</th><th className="p-6">Statut</th><th className="p-6 text-right">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="transition-colors hover:bg-white/40">
                    <td className="p-6 font-bold text-[var(--dark)]">{order.orderNumber}</td>
                    <td className="p-6">{order.shippingFullName}</td>
                    <td className="p-6 font-bold text-[var(--primary)]">{formatPrice(order.total)}</td>
                    <td className="p-6 capitalize"><span className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-xs font-medium shadow-sm">{order.status}</span></td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link to={`/admin/orders/${order.id}`} className="inline-flex h-8 w-8 items-center justify-center rounded border border-[var(--primary)]/20 text-[var(--primary)] transition-colors hover:bg-[var(--primary)] hover:text-white" title="Voir les détails"><Eye size={15} /></Link>
                        <button type="button" onClick={() => handleDelete(order)} disabled={deleteOrder.isPending} className="inline-flex h-8 w-8 items-center justify-center rounded border border-[var(--border)] text-[var(--gray)] transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:opacity-50" title="Supprimer"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && <tr><td colSpan="5" className="p-10 text-center text-sm font-medium text-[var(--gray)]">Aucune commande récente.</td></tr>}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value, icon }) { 
  return (
    <article className="group relative overflow-hidden rounded-[2.5rem] border border-white/60 bg-white/40 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] backdrop-blur-xl transition-all hover:bg-white/60 hover:shadow-lg">
      <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-[var(--primary)]/10 blur-[30px] transition-transform duration-700 group-hover:scale-150" />
      <div className="relative z-10 flex items-center justify-between text-[var(--primary)]">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-white/60 shadow-sm backdrop-blur-md">
          {icon}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--gray)] group-hover:text-[var(--primary)] transition-colors">{label}</span>
      </div>
      <p className="relative z-10 mt-8 font-heading text-4xl text-[var(--dark)] lg:text-5xl">{value}</p>
    </article>
  );
}

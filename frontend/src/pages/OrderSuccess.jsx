import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Loader2, Package } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../utils/axiosConfig';
import { useUIStore } from '../store/useUIStore';
import { formatPrice } from '../utils/formatPrice';

export default function OrderSuccess() {
  const { id } = useParams();
  const guestOrderToken = useUIStore((state) => state.guestOrderTokens[id]);

  const { data, isLoading, isError } = useQuery({ queryKey: ['order-success', id], queryFn: () => api.get(`/orders/${id}`, { headers: guestOrderToken ? { 'X-Guest-Order-Token': guestOrderToken } : {} }).then(({ data: response }) => response.order), enabled: Boolean(id), retry: false });

  if (isLoading) return <main className="grid min-h-[60vh] place-items-center" aria-busy="true"><Loader2 className="animate-spin text-[var(--primary)]" /></main>;
  if (isError || !data) return <main className="grid min-h-[60vh] place-items-center p-6 text-center"><div><h1 className="font-heading text-3xl">Commande introuvable</h1><p className="mt-3 text-[var(--gray)]">Vérifiez que vous êtes bien connecté à votre compte.</p><Link to="/catalogue" className="mt-6 inline-block underline">Retour au catalogue</Link></div></main>;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Dark Mode Background Effects */}
      <div className="pointer-events-none absolute left-1/2 top-10 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[var(--primary)]/20 blur-[150px]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }} />

      <div className="container relative z-10 mx-auto max-w-3xl px-4 py-20 text-center lg:py-32">
        <CheckCircle className="mx-auto h-20 w-20 text-[var(--primary)] mb-8" aria-hidden="true" strokeWidth={1.5} />
        <h1 className="font-heading text-5xl lg:text-7xl">Commande confirmée</h1>
        <p className="mt-6 text-white/70 max-w-lg mx-auto text-lg">
          Votre référence est <strong className="text-white font-bold tracking-widest bg-white/10 px-2 py-1 rounded">{data.orderNumber}</strong>. Le paiement sera effectué à la livraison.
        </p>

        <section className="mx-auto mt-14 max-w-xl rounded-[2rem] border border-white/20 bg-white/5 p-8 text-left backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Package className="text-[var(--primary)]" aria-hidden="true" />
            <h2 className="font-heading text-2xl text-center">Récapitulatif de votre commande</h2>
          </div>
          
          <dl className="space-y-4 text-sm">
            <div className="flex justify-between items-center rounded-lg bg-white/5 px-4 py-3">
              <dt className="text-white/60 uppercase tracking-wider text-xs font-bold">Statut</dt>
              <dd className="capitalize font-medium flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[var(--primary)] inline-block"></span>{data.status}</dd>
            </div>
            <div className="flex justify-between items-center rounded-lg bg-white/5 px-4 py-3">
              <dt className="text-white/60 uppercase tracking-wider text-xs font-bold">Livraison</dt>
              <dd className="font-medium">{formatPrice(data.deliveryFee)}</dd>
            </div>
            <div className="flex justify-between items-center rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 px-4 py-4 mt-6">
              <dt className="text-[var(--primary)] uppercase tracking-wider text-sm font-bold">Total TTC</dt>
              <dd className="text-2xl font-bold">{formatPrice(data.total)}</dd>
            </div>
          </dl>
        </section>

        <div className="mt-14 flex flex-col justify-center gap-5 sm:flex-row">
          <Link to={`/profil/commandes/${data.id}`} className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-[var(--primary)] px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white shadow-[0_8px_20px_rgba(194,24,91,0.25)] transition-all hover:scale-[1.02] hover:bg-[var(--primary-hover)] hover:shadow-[0_12px_24px_rgba(194,24,91,0.35)]">
            Suivre ma commande dans mon profil
          </Link>
          <Link to="/catalogue" className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/20 bg-white/5 px-8 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md transition-all hover:bg-white/10 hover:text-[var(--primary)]">
            Continuer mes achats
          </Link>
        </div>
      </div>
    </main>
  );
}

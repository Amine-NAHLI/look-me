import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, Truck, ArrowRight, Home, CreditCard, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const OrderSuccess = () => {
  const { id } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order-success', id],
    queryFn: async () => {
      const { data } = await axios.get(`http://localhost:5000/api/orders/${id}`);
      return data;
    },
    enabled: !!id
  });

  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="inline-flex items-center justify-center p-8 rounded-[3rem] bg-pink-500 text-white mb-10 shadow-2xl shadow-pink-200 rotate-12"
      >
        <CheckCircle size={64} strokeWidth={3} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-5xl font-black text-gray-900 mb-6 italic tracking-tighter">
          Prête pour la <span className="text-pink-500 not-italic">Livraison !</span>
        </h1>
        {isLoading ? (
          <div className="flex justify-center mb-4"><Loader2 className="animate-spin text-pink-500" /></div>
        ) : (
          <p className="text-xl text-gray-500 max-w-lg mx-auto leading-relaxed mb-4 font-medium">
            Merci pour votre confiance. Votre commande <span className="font-black text-pink-500 select-all">#{order?.orderNumber || id?.slice(-8).toUpperCase()}</span> est en cours de préparation.
          </p>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 mb-20"
      >
        <SuccessCard 
          icon={<CreditCard />} 
          title="Mode de paiement" 
          desc="Cash à la livraison" 
        />
        <SuccessCard 
          icon={<Truck />} 
          title="Estimation" 
          desc="24h - 48h ouvrés" 
        />
        <SuccessCard 
          icon={<Package />} 
          title="Statut" 
          desc="En préparation" 
        />
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
        <Link 
          to={`/profil/commandes/${id}`} 
          className="w-full sm:w-auto px-10 h-16 bg-gray-900 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-200"
        >
          Voir ma commande <ArrowRight size={20} />
        </Link>
        <Link 
          to="/" 
          className="text-pink-500 font-black uppercase tracking-widest text-sm hover:underline flex items-center gap-2"
        >
          <Home size={18} /> Retour à la boutique
        </Link>
      </div>
    </div>
  );
};

function SuccessCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 text-center group hover:bg-pink-50 transition-colors">
      <div className="w-12 h-12 bg-pink-100 text-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 transition-transform group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">{title}</h3>
      <p className="font-bold text-gray-900 italic">{desc}</p>
    </div>
  );
}

export default OrderSuccess;

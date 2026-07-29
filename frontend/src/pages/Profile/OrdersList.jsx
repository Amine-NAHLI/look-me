import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/axiosConfig';
import { Link } from 'react-router-dom';
import { ShoppingBag, ChevronRight, Package, Calendar, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '../../utils/formatPrice';
import Skeleton from '../../components/Skeleton';

const OrdersList = () => {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: async () => {
      const { data } = await api.get('/orders/mine');
      return data.items;
    }
  });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'pending': return { bg: '#FFF3E0', text: '#E65100', label: 'EN ATTENTE' };
      case 'confirmed': return { bg: '#E3F2FD', text: '#1565C0', label: 'CONFIRMÉE' };
      case 'shipped': return { bg: '#F3E5F5', text: '#6A1B9A', label: 'EXPÉDIÉE' };
      case 'delivered': return { bg: '#E8F5E9', text: '#2E7D32', label: 'LIVRÉE' };
      case 'cancelled': return { bg: '#FFEBEE', text: '#C62828', label: 'ANNULÉE' };
      default: return { bg: '#F5F5F5', text: '#616161', label: status.toUpperCase() };
    }
  };

  if (isLoading) return (
    <div className="space-y-6">
      {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-50 animate-pulse rounded-3xl" />)}
    </div>
  );

  if (orders?.length === 0) return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-200"
    >
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingBag size={40} className="text-gray-300" strokeWidth={1} />
      </div>
      <h3 className="text-xl font-heading font-bold text-gray-900 mb-2">Vous n'avez pas encore passé de commande</h3>
      <p className="text-gray-400 font-body mb-10 max-w-xs mx-auto">Explorez notre collection et trouvez votre prochaine pièce préférée.</p>
      <Link 
        to="/catalogue" 
        className="inline-block bg-[#0A0A0A] text-white px-10 py-4 font-body font-bold text-xs uppercase tracking-[3px] hover:bg-[#C2185B] transition-colors rounded-full"
      >
        Découvrir le catalogue
      </Link>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-heading font-bold text-gray-900 mb-2">Mes Commandes</h1>
      <p className="text-gray-400 font-body mb-10">Retrouvez ici l'historique et le suivi de tous vos achats.</p>

      <div className="grid gap-4">
        {orders?.map((order, index) => {
          const style = getStatusStyle(order.status);
          const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);
          
          return (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-[2rem] border border-gray-100 p-6 md:p-8 hover:shadow-xl hover:shadow-gray-100 transition-all group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Left Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-bold text-gray-900">
                      #{order.orderNumber || `LM-${order._id.slice(-6).toUpperCase()}`}
                    </span>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                      <Calendar size={14} />
                      <span className="font-body">{new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-500 font-body text-sm">
                      <Package size={16} />
                      {itemCount} {itemCount > 1 ? 'articles' : 'article'}
                    </div>
                    <div className="font-heading font-black text-[#C2185B]">
                      {formatPrice(order.total)}
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-none pt-4 md:pt-0">
                  <span 
                    className="px-4 py-2 rounded-full text-[10px] font-bold tracking-widest"
                    style={{ backgroundColor: style.bg, color: style.text }}
                  >
                    {style.label}
                  </span>
                  
                  <Link 
                    to={`/profil/commandes/${order._id}`}
                    className="flex items-center gap-2 text-gray-400 hover:text-[#C2185B] transition-colors font-body text-sm font-bold group"
                  >
                    Voir détail
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>

              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default OrdersList;

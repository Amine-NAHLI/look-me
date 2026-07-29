import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/axiosConfig';
import { ArrowLeft, Check, Package, Truck, Home, CreditCard, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '../../utils/formatPrice';
import { getImageUrl } from '../../utils/imageUrl';
import Skeleton from '../../components/Skeleton';

const OrderDetail = () => {
  const { id } = useParams();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const { data } = await api.get(`/orders/${id}`);
      return data.order;
    }
  });

  const steps = [
    { id: 'pending', label: 'Commande reçue', icon: <Package size={16} /> },
    { id: 'confirmed', label: 'Confirmée', icon: <Check size={16} /> },
    { id: 'shipped', label: "En cours d'envoi", icon: <Truck size={16} /> },
    { id: 'delivered', label: 'Livrée', icon: <Home size={16} /> },
  ];

  const currentStatusIndex = steps.findIndex(step => step.id === order?.status);

  if (isLoading) return <Skeleton className="h-[600px] w-full rounded-3xl" />;

  return (
    <div className="max-w-4xl">
      
      {/* Back Link */}
      <Link 
        to="/profil/commandes" 
        className="inline-flex items-center gap-2 text-gray-400 hover:text-[#C2185B] transition-colors font-body text-sm font-bold mb-10 group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Retour à mes commandes
      </Link>

      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-black text-gray-900 mb-2 tracking-tighter italic">
              Commande #{order.orderNumber || order._id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-gray-400 font-body text-sm">
              Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} à {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <div className="bg-pink-500 text-white px-6 py-2 rounded-full text-[10px] font-bold tracking-[2px] uppercase">
             {order.status === 'delivered' ? 'Commande terminée' : 'En cours de traitement'}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 shadow-sm">
          <h3 className="text-xs font-bold font-body uppercase tracking-[3px] text-gray-400 mb-10">Suivi de votre colis</h3>
          
          <div className="relative">
            {/* Background Line */}
            <div className="absolute left-[15px] top-0 bottom-0 w-[2px] bg-gray-100 md:left-0 md:top-[15px] md:right-0 md:w-full md:h-[2px]" />
            
            <div className="flex flex-col md:flex-row md:justify-between items-start gap-10 md:gap-4 relative">
              {steps.map((step, index) => {
                const isCompleted = index <= currentStatusIndex;
                const historyEntry = order.statusHistory?.find(h => h.status === step.id);
                
                return (
                  <motion.div 
                    key={step.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex md:flex-col items-center gap-6 md:gap-4 text-center z-10"
                  >
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500 shadow-md ${
                        isCompleted ? 'bg-[#C2185B] text-white' : 'bg-white border-2 border-gray-100 text-gray-300'
                      }`}
                    >
                      {isCompleted ? <Check size={16} strokeWidth={3} /> : step.icon}
                    </div>
                    <div className="text-left md:text-center">
                      <p className={`text-xs font-bold uppercase tracking-widest ${isCompleted ? 'text-gray-900' : 'text-gray-300'}`}>
                        {step.label}
                      </p>
                      {historyEntry && (
                        <p className="text-[10px] text-gray-400 font-body mt-1">
                          {new Date(historyEntry.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} {new Date(historyEntry.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Items */}
          <div className="lg:col-span-12">
             <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                   <h3 className="font-heading font-bold text-gray-900">Articles commandés</h3>
                    <span className="text-xs font-body text-gray-400 uppercase tracking-widest">{order.items.length} articles</span>
                </div>
                <div className="divide-y divide-gray-50">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="p-6 md:p-8 flex items-center gap-6 group hover:bg-gray-50/40 transition-colors">
                         <div className="w-20 h-24 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0">
                            <img src={getImageUrl(item.image)} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                         </div>
                         <div className="flex-grow">
                            <h4 className="font-heading font-bold text-gray-900 mb-1">{item.name}</h4>
                             <p className="text-sm font-body text-gray-400">Quantité: {item.quantity} × {formatPrice(item.unitPrice)}</p>
                         </div>
                         <div className="font-heading font-bold text-gray-900">
                             {formatPrice(item.lineTotal)}
                         </div>
                      </div>
                   ))}
                </div>
             </div>
          </div>

          {/* Details (Shipping & Total) */}
          <div className="lg:col-span-7">
             <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm h-full">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400">
                      <Truck size={20} strokeWidth={1.5} />
                   </div>
                   <h3 className="font-heading font-bold text-gray-900">Adresse de livraison</h3>
                </div>
                <div className="space-y-4">
                   <div className="flex flex-col bg-gray-50/50 p-6 rounded-3xl">
                       <p className="font-heading font-bold text-gray-900 mb-1">{order.shippingAddress.fullName}</p>
                      <p className="font-body text-gray-500 text-sm leading-relaxed">
                          {order.shippingAddress.phone}<br />
                          {order.shippingAddress.addressLine1}<br />
                          {order.shippingAddress.city}
                      </p>
                   </div>
                   <div className="flex items-center gap-3 p-4 border border-gray-50 rounded-2xl">
                      <CreditCard size={18} className="text-gray-300" />
                      <p className="text-xs font-body text-gray-400 flex-grow uppercase tracking-wider">Mode de paiement: <span className="text-gray-900 font-bold ml-1">Paiement à la livraison</span></p>
                   </div>
                </div>
             </div>
          </div>

          <div className="lg:col-span-5">
             <div className="bg-[#0A0A0A] text-white rounded-[2.5rem] p-8 shadow-2xl h-full">
                <h3 className="font-heading font-bold mb-8 text-white">Récapitulatif</h3>
                <div className="space-y-5">
                   <div className="flex justify-between items-center text-sm font-body text-gray-400">
                      <span>Sous-total</span>
                       <span className="text-white font-bold">{formatPrice(order.subtotal)}</span>
                   </div>
                   <div className="flex justify-between items-center text-sm font-body text-gray-400">
                      <span>Livraison</span>
                      <span className={order.deliveryFee === 0 ? 'text-green-400 font-bold uppercase text-[10px] tracking-widest' : 'text-white'}>
                         {order.deliveryFee === 0 ? 'Gratuite' : formatPrice(order.deliveryFee)}
                      </span>
                   </div>
                   <div className="h-[1px] bg-white/10 my-6" />
                   <div className="flex justify-between items-center">
                      <span className="font-heading font-bold text-lg">Total</span>
                      <span className="text-2xl font-heading font-black text-[#C2185B]">
                          {formatPrice(order.total)}
                      </span>
                   </div>
                </div>
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderDetail;

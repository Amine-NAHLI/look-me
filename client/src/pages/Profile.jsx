import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useUIStore } from '../store/useUIStore';
import { Package, Clock, Truck, CheckCircle, XCircle, ChevronRight, User as UserIcon, LogOut, ShoppingBag, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '../utils/formatPrice';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, logout } = useUIStore();
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { data: orders, isLoading, error } = useQuery({
    queryKey: ['myorders'],
    queryFn: async () => {
      const token = localStorage.getItem('lookme_token');
      const { data } = await axios.get('http://localhost:5000/api/orders/myorders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    },
    enabled: !!user
  });

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return { label: 'En attente', color: 'bg-yellow-100 text-yellow-700', icon: <Clock size={14} /> };
      case 'confirmed':
        return { label: 'Confirmée', color: 'bg-blue-100 text-blue-700', icon: <CheckCircle size={14} /> };
      case 'shipped':
        return { label: 'Expédiée', color: 'bg-purple-100 text-purple-700', icon: <Truck size={14} /> };
      case 'delivered':
        return { label: 'Livrée', color: 'bg-green-100 text-green-700', icon: <Package size={14} /> };
      case 'cancelled':
        return { label: 'Annulée', color: 'bg-red-100 text-red-700', icon: <XCircle size={14} /> };
      default:
        return { label: status, color: 'bg-gray-100 text-gray-700', icon: null };
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Déconnexion réussie");
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <UserIcon size={64} className="mx-auto text-gray-200 mb-6" />
        <h2 className="text-3xl font-black mb-4">Espace Client</h2>
        <p className="text-gray-500 mb-8">Connectez-vous pour voir vos commandes</p>
        <button className="btn-primary" onClick={() => useUIStore.getState().openAuthModal()}>Connexion</button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Sidebar */}
        <div className="lg:col-span-4">
          <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50 sticky top-32">
            <div className="flex flex-col items-center text-center mb-10">
              <div className="w-24 h-24 bg-pink-100 text-pink-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-pink-50 rotate-3 transition-transform hover:rotate-0">
                <UserIcon size={48} />
              </div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-2 italic">
                Hello, {user.firstName}!
              </h1>
              <p className="text-gray-400 font-bold text-sm tracking-widest uppercase">{user.email}</p>
            </div>

            <div className="space-y-4">
              <button className="w-full h-14 bg-gray-50 hover:bg-white hover:shadow-md rounded-2xl flex items-center justify-between px-6 transition-all group border border-transparent hover:border-gray-100">
                <span className="font-bold text-gray-700">Paramètres du compte</span>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-pink-500 group-hover:translate-x-1 transition-all" />
              </button>
              <button 
                onClick={handleLogout}
                className="w-full h-14 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center gap-3 font-black transition-all"
              >
                <LogOut size={20} /> Déconnexion
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-8">
          <h2 className="text-4xl font-black mb-12 flex items-center gap-4 italic tracking-tighter">
            Historique des <span className="text-pink-500 not-italic">commandes</span>
          </h2>

          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-40 bg-gray-50 animate-pulse rounded-[2.5rem]" />
              ))}
            </div>
          ) : orders?.length === 0 ? (
            <div className="bg-white p-16 rounded-[3rem] text-center border-2 border-dashed border-gray-100">
              <ShoppingBag size={64} className="mx-auto text-gray-100 mb-6" />
              <p className="text-xl font-bold text-gray-400">Aucune commande pour le moment</p>
              <button className="mt-8 btn-primary" onClick={() => window.location.href = "/"}>Découvrir la collection</button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order._id} className="bg-white rounded-[2.5rem] shadow-lg border border-gray-50 hover:shadow-xl transition-shadow overflow-hidden">
                  <div className="p-8">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">ID: #{order._id.slice(-8).toUpperCase()}</p>
                        <p className="text-gray-900 font-bold">{new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${getStatusInfo(order.status).color}`}>
                        {getStatusInfo(order.status).icon}
                        {getStatusInfo(order.status).label}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex -space-x-4 overflow-hidden">
                        {order.orderItems.slice(0, 3).map((item, i) => (
                          <div key={i} className="inline-block h-16 w-16 rounded-2xl border-4 border-white bg-gray-50 overflow-hidden shadow-sm">
                            <img src={item.image} alt="" className="h-full w-full object-cover" />
                          </div>
                        ))}
                        {order.orderItems.length > 3 && (
                          <div className="inline-block h-16 w-16 rounded-2xl border-4 border-white bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                            +{order.orderItems.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="font-extrabold text-gray-900">{order.orderItems.length} articles</p>
                        <p className="text-xs font-bold text-pink-500 uppercase tracking-widest">Total: {formatPrice(order.totalPrice)}</p>
                      </div>
                      <button 
                        onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                        className={`p-3 rounded-2xl transition-all ${selectedOrder === order._id ? 'bg-pink-500 text-white rotate-90' : 'bg-gray-50 text-gray-400 hover:text-pink-500'}`}
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>

                  {/* Expanded View */}
                  <AnimatePresence>
                    {selectedOrder === order._id && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden bg-gray-50/50"
                      >
                        <div className="p-8 pt-0 space-y-8">
                          {/* Items List */}
                          <div className="space-y-4">
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Détail des articles</p>
                            {order.orderItems.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm font-bold bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                                <div className="flex gap-4 items-center">
                                  <div className="w-12 h-12 rounded-xl overflow-hidden shadow-sm">
                                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <p className="text-gray-900">{item.name}</p>
                                    <p className="text-xs text-gray-400 font-bold">{item.qty} x {formatPrice(item.price)}</p>
                                  </div>
                                </div>
                                <span className="text-pink-500 italic">{formatPrice(item.qty * item.price)}</span>
                              </div>
                            ))}
                          </div>

                          {/* Address Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-200">
                            <div>
                              <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Livraison</p>
                              <div className="flex gap-3 text-gray-900 font-bold">
                                <MapPin className="text-pink-500 flex-shrink-0" size={18} />
                                <div>
                                  <p>{order.shippingAddress?.fullName}</p>
                                  <p className="text-gray-500 text-xs font-medium leading-relaxed mt-1">
                                    {order.shippingAddress?.address}, {order.shippingAddress?.postalCode}<br />
                                    {order.shippingAddress?.city}, Maroc<br />
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Paiement</p>
                              <p className="text-sm font-bold bg-pink-500 text-white px-4 py-2 rounded-xl inline-block shadow-lg shadow-pink-100">Cash on Delivery</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

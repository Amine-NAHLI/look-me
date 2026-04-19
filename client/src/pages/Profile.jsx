import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useUIStore } from '../store/useUIStore';
import { Package, Clock, Truck, CheckCircle, XCircle, ChevronRight, User as UserIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '../utils/formatPrice';

const Profile = () => {
  const { user, logout } = useUIStore();

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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold"><Clock size={14} /> En attente</span>;
      case 'confirmed':
        return <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold"><CheckCircle size={14} /> Confirmée</span>;
      case 'shipped':
        return <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold"><Truck size={14} /> Expédiée</span>;
      case 'delivered':
        return <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold"><Package size={14} /> Livrée</span>;
      case 'cancelled':
        return <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold"><XCircle size={14} /> Annulée</span>;
      default:
        return status;
    }
  };

  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Connectez-vous pour voir votre profil.</h2>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* User Sidebar */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-center"
          >
            <div className="w-24 h-24 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserIcon size={48} />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-1">{user.firstName} {user.lastName || ''}</h2>
            <p className="text-gray-500 mb-8">{user.email}</p>
            
            <div className="space-y-3">
              <button className="w-full py-3 px-6 rounded-xl bg-gray-50 text-gray-700 font-bold hover:bg-gray-100 transition-colors flex items-center justify-between">
                <span>Modifier le profil</span>
                <ChevronRight size={18} />
              </button>
              <button 
                onClick={logout}
                className="w-full py-3 px-6 rounded-xl bg-rose-50 text-rose-600 font-bold hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
              >
                Déconnexion
              </button>
            </div>
          </motion.div>
        </div>

        {/* Orders List */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
            <Package className="text-pink-500" size={32} /> Mes Commandes
          </h2>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-100 rounded-3xl"></div>
              ))}
            </div>
          ) : orders?.length === 0 ? (
            <div className="bg-gray-50 p-12 rounded-3xl text-center border-2 border-dashed border-gray-200">
              <Package size={48} className="mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500 font-bold">Vous n'avez pas encore passé de commande.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div 
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div>
                      <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider font-bold">Commande #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div>
                      {getStatusBadge(order.status)}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex -space-x-3 overflow-hidden">
                      {order.orderItems.slice(0, 3).map((item, i) => (
                        <div key={i} className="inline-block h-12 w-12 rounded-xl border-2 border-white overflow-hidden bg-gray-100">
                          <img src={item.image} alt="" className="h-full w-full object-cover" />
                        </div>
                      ))}
                      {order.orderItems.length > 3 && (
                        <div className="inline-block h-12 w-12 rounded-xl border-2 border-white bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                          +{order.orderItems.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-900">
                        {order.orderItems.length} article{order.orderItems.length > 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-gray-500">{order.paymentMethod}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-pink-600">{formatPrice(order.totalPrice)}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-50 flex justify-end">
                    <button className="text-xs font-bold text-gray-500 hover:text-pink-500 flex items-center gap-1 transition-colors">
                      Détails de la commande <ChevronRight size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

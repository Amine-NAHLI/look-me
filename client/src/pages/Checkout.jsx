import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/useUIStore';
import axios from 'axios';
import { Truck, MapPin, Phone, CreditCard, ChevronRight, PackageCheck, UserCircle, ShoppingBag, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart, user } = useUIStore();
  const [step, setStep] = useState(1);
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);

  // Redirect if cart is empty
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-32 text-center">
        <ShoppingBag size={64} className="mx-auto text-gray-200 mb-6" />
        <h2 className="text-3xl font-black mb-4">Votre panier est vide</h2>
        <button onClick={() => navigate('/')} className="btn-primary">Retour à la boutique</button>
      </div>
    );
  }

  const handleSubmitOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        orderItems: cart.map(item => ({
          name: item.name,
          qty: item.qty,
          image: item.image,
          price: item.price,
          product: item._id
        })),
        shippingAddress,
        totalPrice: getCartTotal(),
        paymentMethod: 'Cash on Delivery'
      };

      const token = localStorage.getItem('lookme_token');
      const { data } = await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      clearCart();
      navigate(`/order-success/${data._id}`);
      toast.success("Commande enregistrée !");
    } catch (error) {
      toast.error("Erreur lors de la commande.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const steps = [
    { n: 1, name: 'Livraison', icon: <Truck size={20} /> },
    { n: 2, name: 'Résumé', icon: <PackageCheck size={20} /> },
  ];

  return (
    <div className="container mx-auto px-4 py-20 max-w-6xl">
      {/* Stepper */}
      <div className="flex justify-center mb-16 px-4">
        {steps.map((s, i) => (
          <div key={s.n} className="flex items-center">
            <div className={`flex flex-col items-center gap-2 relative`}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl ${step >= s.n ? 'bg-pink-500 text-white shadow-pink-200' : 'bg-white text-gray-300 border border-gray-100'}`}>
                {step > s.n ? <CheckCircle2 size={24} /> : s.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest absolute -bottom-8 whitespace-nowrap ${step >= s.n ? 'text-gray-900' : 'text-gray-300'}`}>
                {s.name}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-20 sm:w-32 h-1 mx-4 rounded-full bg-gray-100 overflow-hidden`}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: step > s.n ? '100%' : '0%' }}
                  className="h-full bg-pink-500"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50"
              >
                <h2 className="text-2xl font-black mb-10 flex items-center gap-3 italic">
                  <MapPin className="text-pink-500" /> Vos Coordonnées
                </h2>
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Nom complet</label>
                      <input required name="fullName" value={shippingAddress.fullName} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-500 font-bold" placeholder="Amine Nahli" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Téléphone</label>
                      <input required name="phone" value={shippingAddress.phone} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-500 font-bold" placeholder="06XXXXXXXX" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Adresse complète</label>
                    <input required name="address" value={shippingAddress.address} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-500 font-bold" placeholder="Rabat, Avenue Mohammed V..." />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Ville</label>
                      <input required name="city" value={shippingAddress.city} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-500 font-bold" placeholder="Casablanca" />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-widest text-gray-400 mb-3 ml-1">Code Postal (Optionnel)</label>
                      <input name="postalCode" value={shippingAddress.postalCode} onChange={handleInputChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-pink-500 font-bold" placeholder="20000" />
                    </div>
                  </div>
                  
                  <div className="pt-8 flex justify-end">
                    <button type="submit" className="btn-primary inline-flex items-center gap-3 h-16 px-12">
                      Continuer <ChevronRight size={20} />
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                {/* Shipping Review */}
                <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-black italic">Résumé de livraison</h2>
                    <button onClick={() => setStep(1)} className="text-pink-500 font-black text-xs uppercase underline">Modifier</button>
                  </div>
                  <div className="grid grid-cols-2 gap-8 text-sm">
                    <div>
                      <p className="text-gray-400 uppercase font-black tracking-widest text-[10px] mb-2">Destinataire</p>
                      <p className="font-bold text-lg">{shippingAddress.fullName}</p>
                      <p className="text-gray-500">{shippingAddress.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 uppercase font-black tracking-widest text-[10px] mb-2">Adresse</p>
                      <p className="font-bold text-lg leading-tight">{shippingAddress.address}</p>
                      <p className="text-gray-500">{shippingAddress.city}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Focus */}
                <div className="bg-gray-900 p-10 rounded-[3rem] shadow-2xl text-white">
                  <h3 className="text-2xl font-black mb-6 flex items-center gap-3">
                    <CreditCard className="text-pink-500" /> Paiement Sécurisé
                  </h3>
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-6">
                    <div className="w-16 h-16 bg-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Truck size={32} />
                    </div>
                    <div>
                      <p className="text-xl font-black italic mb-1">Paiement à la livraison (Cash)</p>
                      <p className="text-gray-400 text-sm">Préparez le montant exact à remettre au livreur le jour de la réception.</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleSubmitOrder}
                    disabled={loading}
                    className="w-full mt-10 h-16 bg-pink-500 text-white rounded-2xl font-black text-xl shadow-2xl shadow-pink-900/50 hover:bg-pink-600 active:scale-[0.98] transition-all disabled:bg-gray-700"
                  >
                    {loading ? 'Traitement...' : 'Confirmer la Commande'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 translate-y-2">
          <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100 sticky top-32">
            <h3 className="text-xl font-black italic mb-8 border-b border-gray-50 pb-4">Ma Commande</h3>
            <div className="space-y-6 mb-8 max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
              {cart.map((item) => (
                <div key={item._id} className="flex gap-4 items-center">
                  <div className="h-16 w-16 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm truncate">{item.name}</p>
                    <p className="text-gray-400 text-[10px] font-black">{item.qty} x {formatPrice(item.price)}</p>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{formatPrice(item.price * item.qty)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100">
              <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                <span>Total articles</span>
                <span className="text-gray-900">{formatPrice(getCartTotal())}</span>
              </div>
              <div className="flex justify-between text-xs font-black text-gray-400 uppercase tracking-widest">
                <span>Livraison</span>
                <span className="text-green-500">Gratuite</span>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                <span className="text-2xl font-black italic">Total</span>
                <span className="text-2xl font-black text-pink-500 italic">{formatPrice(getCartTotal())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/useUIStore';
import axios from 'axios';
import { Truck, MapPin, Phone, CreditCard, ChevronRight, PackageCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatPrice } from '../utils/formatPrice';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart, user } = useUIStore();
  
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
    setTimeout(() => navigate('/'), 2000);
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Votre panier est vide. Redirection vers la boutique...</h2>
      </div>
    );
  }

  // Redirect if not logged in
  if (!user) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold">Vous devez être connecté pour commander.</h2>
        <p className="text-gray-500 mt-2">Veuillez vous connecter via le menu en haut à droite.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      clearCart();
      navigate(`/order-success/${data._id}`);
    } catch (error) {
      console.error("Erreur commande:", error);
      alert("Une erreur est survenue lors de la commande.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-10 flex items-center gap-3">
        <PackageCheck className="text-pink-500" size={32} /> Finaliser la commande
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Formulaire de livraison */}
        <div className="lg:col-span-7">
          <motion.form 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
          >
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <MapPin className="text-pink-500" size={24} /> Informations de livraison
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nom complet</label>
                <input
                  required
                  type="text"
                  name="fullName"
                  placeholder="Ex: Amine Nahli"
                  value={shippingAddress.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse complète</label>
                <input
                  required
                  type="text"
                  name="address"
                  placeholder="Ex: 45 rue de la Paix"
                  value={shippingAddress.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all bg-gray-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Ville</label>
                  <input
                    required
                    type="text"
                    name="city"
                    placeholder="Ex: Casablanca"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Code Postal</label>
                  <input
                    required
                    type="text"
                    name="postalCode"
                    placeholder="Ex: 20000"
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Phone size={16} /> Numéro de téléphone
                </label>
                <input
                  required
                  type="tel"
                  name="phone"
                  placeholder="Ex: 06 12 34 56 78"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all bg-gray-50"
                />
              </div>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CreditCard className="text-pink-500" size={24} /> Mode de paiement
              </h2>
              <div className="p-4 rounded-2xl bg-pink-50 border-2 border-pink-200 flex items-center gap-4">
                <div className="p-3 bg-pink-500 text-white rounded-full">
                  <Truck size={24} />
                </div>
                <div>
                  <p className="font-bold text-pink-900">Paiement à la réception (Cash on Delivery)</p>
                  <p className="text-sm text-pink-700">Vous paierez directement au livreur lors de la remise de votre colis.</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-10 py-5 px-8 rounded-2xl text-white font-black text-xl shadow-2xl flex items-center justify-center gap-3 transform transition hover:scale-[1.02] active:scale-95 ${
                loading ? 'bg-gray-400' : 'bg-gradient-to-r from-pink-500 to-rose-600 shadow-pink-200'
              }`}
            >
              {loading ? 'Traitement...' : 'Confirmer ma commande'}
              <ChevronRight size={24} />
            </button>
          </motion.form>
        </div>

        {/* Récapitulatif */}
        <div className="lg:col-span-5">
          <div className="bg-gray-900 text-white p-8 rounded-3xl shadow-2xl sticky top-8">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-2 border-b border-gray-800 pb-4">
              Votre panier <span className="text-pink-500 ml-auto">{cart.length} articles</span>
            </h2>

            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.map((item) => (
                <div key={item._id} className="flex gap-4 items-center">
                  <div className="h-16 w-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-800">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm line-clamp-1">{item.name}</p>
                    <p className="text-gray-400 text-xs">{item.qty} x {formatPrice(item.price)}</p>
                  </div>
                  <p className="font-bold text-pink-500">{formatPrice(item.qty * item.price)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-800 text-gray-300">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{formatPrice(getCartTotal())}</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span className="text-green-400 font-semibold">Gratuite</span>
              </div>
              <div className="flex justify-between text-2xl font-black text-white pt-4 border-t border-gray-800">
                <span>Total</span>
                <span className="text-pink-500">{formatPrice(getCartTotal())}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

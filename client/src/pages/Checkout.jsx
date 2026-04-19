import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/useUIStore';
import api from '../utils/axiosConfig';
import { getImageUrl } from '../utils/imageUrl';
import { getDeliveryFee, formatDeliveryFee, isFesCityFree } from '../utils/delivery';
import { Truck, MapPin, CreditCard, ShoppingBag, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '../utils/formatPrice';
import toast from 'react-hot-toast';
import { fadeInUp, slideInRight } from '../utils/animations';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useUIStore();
  const [step, setStep] = useState(1);
  
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);

  const deliveryFee = getDeliveryFee(shippingAddress.city);
  const subtotal = getCartTotal();
  const total = subtotal + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F5F5F5]">
        <ShoppingBag size={48} className="text-[#C2185B] mb-6 opacity-40" strokeWidth={1} />
        <h2 className="font-heading italic text-[24px] text-[var(--dark)] mb-6 text-center">Votre panier est vide</h2>
        <button onClick={() => navigate('/')} className="bg-[var(--dark)] text-white font-body font-semibold text-[11px] uppercase tracking-[2px] px-[32px] py-[14px] hover:bg-[#C2185B] transition-colors">
          Retour à la boutique
        </button>
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
        customerName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        city: shippingAddress.city,
        subtotal: subtotal,
        deliveryFee,
        totalPrice: total,
        paymentMethod: 'cash_on_delivery'
      };

      const { data } = await api.post('/orders', orderData);

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

  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-12 py-[40px] md:py-[80px]">
      <div className="flex text-[11px] font-body uppercase tracking-[2px] text-[var(--gray)] mb-8 justify-center">
        <span>Validation de commande</span>
      </div>

      <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-8 lg:gap-16">
        
        {/* Form section (Left on Desktop, Bottom on Mobile because of flex-col-reverse but accordions logic in design) -> Actually Mobile order should be Form (Top), Review (Bottom) but sticky button. */}
        {/* Let's keep DOM order natural and use CSS to order or just standard flow. Mobile: Form -> Cart -> Sticky button */}
        <div className="lg:col-span-7 flex flex-col space-y-6">
          
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="bg-white border border-[var(--border)] p-6 lg:p-10">
            <h2 className="font-heading font-semibold text-[24px] text-[var(--dark)] mb-8 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1C1C1C] text-white text-[14px]">1</span> 
              Expédition
            </h2>
            
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.form 
                  key="step1"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6" 
                  onSubmit={(e) => { e.preventDefault(); setStep(2); }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-body font-semibold uppercase tracking-[1px] text-[var(--gray)] mb-2">Nom complet</label>
                      <input required name="fullName" value={shippingAddress.fullName} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#F5F5F5] border border-transparent focus:border-[#C2185B] focus:bg-white outline-none font-body text-[14px] transition-colors" placeholder="Nom Prénom" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-body font-semibold uppercase tracking-[1px] text-[var(--gray)] mb-2">Téléphone</label>
                      <input required name="phone" type="tel" value={shippingAddress.phone} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#F5F5F5] border border-transparent focus:border-[#C2185B] focus:bg-white outline-none font-body text-[14px] transition-colors" placeholder="06XXXXXXXX" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-body font-semibold uppercase tracking-[1px] text-[var(--gray)] mb-2">Adresse de livraison</label>
                    <input required name="address" value={shippingAddress.address} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#F5F5F5] border border-transparent focus:border-[#C2185B] focus:bg-white outline-none font-body text-[14px] transition-colors" placeholder="N°, Rue, Quartier" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-body font-semibold uppercase tracking-[1px] text-[var(--gray)] mb-2">Ville</label>
                      <input required name="city" value={shippingAddress.city} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#F5F5F5] border border-transparent focus:border-[#C2185B] focus:bg-white outline-none font-body text-[14px] transition-colors" placeholder="Votre ville" />
                      {shippingAddress.city.trim().length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`mt-2 text-[12px] font-body font-medium flex items-center gap-1.5 ${isFesCityFree(shippingAddress.city) ? 'text-[#2E7D32]' : 'text-[#E65100]'}`}
                        >
                          {isFesCityFree(shippingAddress.city) ? (
                            '✓ Livraison gratuite à Fès'
                          ) : (
                            'Livraison : 30 DH'
                          )}
                        </motion.div>
                      )}
                    </div>
                    <div>
                      <label className="block text-[10px] font-body font-semibold uppercase tracking-[1px] text-[var(--gray)] mb-2">Code Postal</label>
                      <input name="postalCode" value={shippingAddress.postalCode} onChange={handleInputChange} className="w-full px-4 py-3 bg-[#F5F5F5] border border-transparent focus:border-[#C2185B] focus:bg-white outline-none font-body text-[14px] transition-colors" placeholder="20000" />
                    </div>
                  </div>
                  
                  <div className="pt-6">
                    <button type="submit" className="w-full md:w-auto bg-[#1C1C1C] text-white font-body font-semibold text-[11px] uppercase tracking-[2px] px-[48px] py-[16px] hover:bg-[#C2185B] transition-colors">
                      Continuer
                    </button>
                  </div>
                </motion.form>
              ) : (
                <div className="flex justify-between items-center text-[13px] font-body text-[var(--gray)] px-2">
                  <span>{shippingAddress.fullName}, {shippingAddress.city}</span>
                  <button onClick={() => setStep(1)} className="text-[#C2185B] font-semibold uppercase tracking-[1px] text-[10px]">Modifier</button>
                </div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="bg-white border border-[var(--border)] p-6 lg:p-10">
            <h2 className="font-heading font-semibold text-[24px] text-[var(--gray)] mb-6 flex items-center gap-3">
              <span className={`flex items-center justify-center w-8 h-8 rounded-full text-white text-[14px] ${step === 2 ? 'bg-[#1C1C1C]' : 'bg-[var(--border)] text-[var(--gray)]'}`}>2</span> 
              Paiement
            </h2>
            
            <AnimatePresence>
              {step === 2 && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-6"
                >
                  <div className="p-4 border border-[#C2185B] bg-[#FFF8FB] flex items-center gap-4">
                    <div className="w-12 h-12 bg-white flex items-center justify-center shrink-0 border border-[var(--border)]">
                      <Truck size={20} className="text-[#C2185B]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-body font-semibold text-[14px] text-[var(--dark)] mb-1">Paiement à la livraison</p>
                      <p className="font-body text-[12px] text-[var(--gray)]">Le paiement s'effectue en espèces à la réception du colis.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Order Summary (Right on Desktop, Below form on Mobile) */}
        <div className="lg:col-span-5 relative mb-24 lg:mb-0">
          <motion.div variants={slideInRight} initial="hidden" animate="visible" className="bg-[#F9F9F9] border border-[var(--border)] p-6 lg:p-10 lg:sticky lg:top-32">
            <h3 className="font-body font-semibold text-[11px] uppercase tracking-[2px] text-[var(--dark)] mb-6 border-b border-[var(--border)] pb-4">Récapitulatif</h3>
            
            <div className="space-y-4 mb-6 pr-2">
              {cart.map((item) => (
                <div key={item._id} className="flex gap-4 items-center">
                  <div className="h-20 w-16 bg-white overflow-hidden shrink-0 border border-[var(--border)]">
                    <img src={getImageUrl(item.image)} alt={item.name} className="h-full w-full object-cover p-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-medium text-[13px] text-[var(--dark)] truncate">{item.name}</p>
                    <p className="font-body text-[11px] text-[var(--gray)] mt-1">Qté: {item.qty}</p>
                  </div>
                  <p className="font-body font-semibold text-[13px] text-[#C2185B]">{formatPrice(item.price * item.qty)}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-[var(--border)]">
              <div className="flex justify-between items-center font-body text-[11px] uppercase tracking-[1px] text-[var(--gray)]">
                <span>Sous-total</span>
                <span className="text-[var(--dark)]">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center font-body text-[11px] uppercase tracking-[1px] text-[var(--gray)]">
                <span>Livraison</span>
                <span className={`font-semibold ${isFesCityFree(shippingAddress.city) ? 'text-[#2E7D32]' : 'text-[var(--dark)]'}`}>
                  {shippingAddress.city.trim() === '' ? '—' : formatDeliveryFee(shippingAddress.city)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-[var(--dark)]">
                <span className="font-body font-semibold text-[14px] uppercase tracking-[1px] text-[var(--dark)]">Total TTC</span>
                <span className="font-body font-bold text-[20px] text-[#C2185B]">{formatPrice(total)}</span>
              </div>
              
              {isFesCityFree(shippingAddress.city) && shippingAddress.city.trim() !== '' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-3 p-3 bg-[#E8F5E9] rounded-[4px] text-[12px] text-[#2E7D32] font-body font-medium text-center"
                >
                  🎉 Vous bénéficiez de la livraison gratuite à Fès !
                </motion.div>
              )}
            </div>

            {/* Desktop Button */}
            <div className="hidden lg:block mt-8">
              <button 
                onClick={handleSubmitOrder}
                disabled={loading || step !== 2}
                className="w-full bg-[#1C1C1C] text-white font-body font-semibold text-[11px] uppercase tracking-[2px] py-[16px] hover:bg-[#C2185B] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 group"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : 'Confirmer l\'achat'} {!loading && <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Mobile Sticky Button */}
      {step === 2 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-[var(--border)] z-50">
           <button 
            onClick={handleSubmitOrder}
            disabled={loading}
            className="w-full bg-[#1C1C1C] text-white font-body font-semibold text-[11px] uppercase tracking-[2px] py-[16px] active:bg-[#C2185B] transition-colors flex justify-center items-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : `Confirmer • ${formatPrice(total)}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default Checkout;

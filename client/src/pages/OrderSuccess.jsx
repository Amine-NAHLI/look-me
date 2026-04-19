import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, Truck, ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="inline-flex items-center justify-center p-6 rounded-full bg-green-100 text-green-600 mb-8"
      >
        <CheckCircle size={64} />
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-4xl font-black text-gray-900 mb-4"
      >
        Merci pour votre commande !
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-xl text-gray-600 mb-8"
      >
        Votre commande <span className="font-bold text-pink-600 text-lg">#{id?.slice(-8).toUpperCase()}</span> a été reçue avec succès.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 text-left mb-12"
      >
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Truck className="text-pink-500" /> Informations importantes
        </h2>
        <div className="space-y-4">
          <div className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="h-10 w-10 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center flex-shrink-0">
              <span className="font-bold">1</span>
            </div>
            <div>
              <p className="font-bold">Paiement à la livraison</p>
              <p className="text-sm text-gray-500">Préparez le montant exact à remettre au livreur lors de la réception de votre colis.</p>
            </div>
          </div>
          <div className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="h-10 w-10 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center flex-shrink-0">
              <span className="font-bold">2</span>
            </div>
            <div>
              <p className="font-bold">Confirmation par SMS</p>
              <p className="text-sm text-gray-500">Un agent pourrait vous appeler pour confirmer votre adresse avant l'expédition.</p>
            </div>
          </div>
          <div className="flex gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
            <div className="h-10 w-10 rounded-full bg-pink-100 text-pink-500 flex items-center justify-center flex-shrink-0">
              <span className="font-bold">3</span>
            </div>
            <div>
              <p className="font-bold">Suivi</p>
              <p className="text-sm text-gray-500">Vous pouvez suivre l'état de votre commande dans votre profil.</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to="/profile" 
          className="flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-gray-900 text-white font-bold hover:bg-black transition-all"
        >
          <Package size={20} /> Voir mes commandes
        </Link>
        <Link 
          to="/" 
          className="flex items-center justify-center gap-2 py-4 px-8 rounded-2xl bg-pink-500 text-white font-bold hover:bg-pink-600 transition-all shadow-lg shadow-pink-200"
        >
          <Home size={20} /> Retour à l'accueil <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;

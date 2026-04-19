import { Link } from 'react-router-dom';
import { Ghost, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="p-6 bg-pink-100 text-pink-500 rounded-full animate-bounce">
            <Ghost size={64} />
          </div>
        </div>
        
        <h1 className="text-9xl font-black text-gray-200 mb-4">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Oups ! Page introuvable.</h2>
        <p className="text-gray-500 mb-10 max-w-md mx-auto">
          Il semble que la pièce que vous recherchez ne soit pas dans notre catalogue actuellement.
        </p>
        
        <Link 
          to="/" 
          className="btn-primary inline-flex items-center gap-2"
        >
          <Home size={20} />
          Retour à la boutique
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;

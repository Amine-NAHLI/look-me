import { Search, ShoppingBag, User, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useUIStore } from '../store/useUIStore';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const { openAuthModal, user } = useUIStore();

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-pink-500/10 shadow-sm"
    >
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        {/* Mobile Menu */}
        <button className="md:hidden p-2 text-slate-500 hover:text-pink-500 transition-colors">
          <Menu size={24} />
        </button>

        {/* Logo */}
        <motion.a 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          as={Link}
          to="/" 
          className="text-3xl font-extrabold tracking-tighter text-slate-800 hover:text-pink-500 transition-colors"
        >
          LOOK<span className="text-pink-500">ME</span>
        </motion.a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-600">
          {['Nouveautés', 'Robes', 'Tops', 'Accessoires'].map((item) => (
            <motion.a 
              key={item}
              whileHover={{ y: -2, color: '#ec4899' }}
              href="#" 
              className="transition-colors"
            >
              {item}
            </motion.a>
          ))}
          
          {user && user.role === 'admin' && (
            <Link to="/admin" className="px-4 py-2 bg-pink-100 text-pink-600 rounded-lg hover:bg-pink-500 hover:text-white transition-all shadow-sm">
              👑 Admin
            </Link>
          )}
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-1 sm:space-x-4">
          <motion.button whileHover={{ scale: 1.1, backgroundColor: '#fdf2f8' }} className="p-2 text-slate-500 hover:text-pink-500 rounded-full transition-colors">
            <Search size={22} />
          </motion.button>
          <motion.button 
            onClick={openAuthModal}
            whileHover={{ scale: 1.1, backgroundColor: '#fdf2f8' }} 
            className="p-2 text-slate-500 hover:text-pink-500 rounded-full transition-colors"
          >
            <User size={22} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1, backgroundColor: '#fdf2f8' }} className="p-2 text-slate-500 hover:text-pink-500 rounded-full transition-colors relative">
            <ShoppingBag size={22} />
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: "spring" }}
              className="absolute top-1 right-1 w-2.5 h-2.5 bg-pink-500 border-2 border-white rounded-full"
            />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, User, Menu, X, Rocket } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUIStore } from '../store/useUIStore';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { cart, openCart, user, openAuthModal } = useUIStore();

  const cartItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Catalogue', path: '/' }, // Linked to home sections or shop page
    { name: 'Nouveautés', path: '/' },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'glass py-3' : 'bg-transparent py-5'}`}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Mobile Toggle */}
        <button 
          className="lg:hidden p-2 text-gray-700" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pink-200 group-hover:rotate-12 transition-transform">
            <Rocket size={20} fill="white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-gray-900 uppercase">
            Look<span className="text-pink-500">Me</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-sm font-bold uppercase tracking-wider transition-colors hover:text-pink-500 ${
                location.pathname === link.path ? 'text-pink-500' : 'text-gray-600'
              }`}
            >
              {link.name}
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link to="/admin" className="text-sm font-bold uppercase tracking-wider text-rose-600 hover:text-rose-700">
              Admin
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button className="p-2 text-gray-500 hover:text-pink-500 transition-colors hidden sm:block">
            <Search size={22} />
          </button>
          
          <button 
            onClick={() => user ? window.location.href = '/profile' : openAuthModal()}
            className={`p-2 transition-colors rounded-full ${user ? 'text-pink-500 bg-pink-50' : 'text-gray-500 hover:text-pink-500 hover:bg-pink-50'}`}
          >
            <User size={22} />
          </button>

          <button 
            onClick={openCart}
            className="p-2 text-gray-500 hover:text-pink-500 relative transition-colors group"
          >
            <ShoppingBag size={22} />
            <AnimatePresence>
              {cartItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm"
                >
                  {cartItemsCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-lg font-bold ${
                    location.pathname === link.path ? 'text-pink-500' : 'text-gray-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

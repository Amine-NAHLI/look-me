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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 grid grid-cols-2 lg:grid-cols-3 items-center">
        
        {/* Mobile Toggle & Desktop Links (Left) */}
        <div className="flex items-center order-1lg:order-none">
          <button 
            className="lg:hidden p-2 -ml-2 text-gray-900 hover:text-pink-500 transition-colors" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative group text-[13px] font-bold uppercase tracking-widest transition-colors ${
                  location.pathname === link.path ? 'text-pink-500' : 'text-gray-900 hover:text-pink-500'
                }`}
              >
                {link.name}
                <span className={`absolute -bottom-1.5 left-0 h-[2px] bg-pink-500 transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            ))}
            {user?.role === 'admin' && (
              <Link to="/admin" className="relative group text-[13px] font-bold uppercase tracking-widest text-gray-900 hover:text-pink-500 transition-colors">
                Admin
                <span className="absolute -bottom-1.5 left-0 h-[2px] bg-pink-500 transition-all duration-300 w-0 group-hover:w-full"></span>
              </Link>
            )}
          </div>
        </div>

        {/* Center: Logo */}
        <div className="flex justify-start lg:justify-center items-center ml-4 lg:ml-0 order-2 lg:order-none hidden sm:flex">
          <Link to="/" className="flex items-center group">
            <span className="text-2xl font-black tracking-widest text-[#1A1A2E] uppercase">
              Look<span className="text-pink-500 group-hover:opacity-80 transition-opacity">Me</span>
            </span>
          </Link>
        </div>

        {/* Actions (Right) */}
        <div className="flex items-center justify-end gap-5 order-3 lg:order-none col-span-2 lg:col-span-1 mt-4 sm:mt-0 sm:col-span-1">
          <button className="text-[#1A1A2E] hover:text-pink-500 transition-colors hidden sm:block">
            <Search size={20} strokeWidth={1.5} />
          </button>
          
          <button 
            onClick={() => user ? window.location.href = '/profile' : openAuthModal()}
            className={`transition-colors ${user ? 'text-pink-500' : 'text-[#1A1A2E] hover:text-pink-500'}`}
          >
            <User size={20} strokeWidth={1.5} />
          </button>

          <button 
            onClick={openCart}
            className="text-[#1A1A2E] hover:text-pink-500 relative transition-colors group"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            <AnimatePresence>
              {cartItemsCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] bg-pink-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-sm"
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

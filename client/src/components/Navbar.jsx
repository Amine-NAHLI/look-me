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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 h-[72px] flex items-center ${isScrolled ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-white border-b border-gray-100'}`}>
      <div className="container mx-auto px-6 h-full flex items-center justify-between">
        
        {/* Mobile Toggle & Logo (Left) */}
        <div className="flex items-center gap-4">
          <button 
            className="lg:hidden p-2 -ml-2 text-gray-900 hover:text-pink-500 transition-colors" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
          </button>

          <Link to="/" className="flex items-center group">
            <span className="text-2xl font-black tracking-widest text-[#1A1A2E] uppercase">
              Look<span className="text-pink-500 group-hover:opacity-80 transition-opacity">Me</span>
            </span>
          </Link>
        </div>

        {/* Center: Desktop Links */}
        <div className="hidden lg:flex items-center justify-center absolute left-1/2 -translate-x-1/2 gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative group font-medium uppercase tracking-widest text-[13px] transition-colors ${
                location.pathname === link.path ? 'text-pink-500' : 'text-[#6B6B6B] hover:text-[#1A1A2E]'
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1.5 left-0 h-[2px] bg-pink-500 transition-all duration-300 ${location.pathname === link.path ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
            </Link>
          ))}
          {user?.role === 'admin' && (
            <Link to="/admin" className="relative group font-medium uppercase tracking-widest text-[13px] text-[#6B6B6B] hover:text-[#1A1A2E] transition-colors">
              Admin
              <span className="absolute -bottom-1.5 left-0 h-[2px] bg-pink-500 transition-all duration-300 w-0 group-hover:w-full"></span>
            </Link>
          )}
        </div>

        {/* Actions (Right) */}
        <div className="flex items-center justify-end gap-5">
          <button className="text-[#6B6B6B] hover:text-[#1A1A2E] transition-colors hidden sm:block">
            <Search size={22} strokeWidth={1.5} />
          </button>
          
          <button 
            onClick={() => user ? window.location.href = '/profile' : openAuthModal()}
            className={`transition-colors ${user ? 'text-pink-500' : 'text-[#6B6B6B] hover:text-[#1A1A2E]'}`}
          >
            <User size={22} strokeWidth={1.5} />
          </button>

          <button 
            onClick={openCart}
            className="text-[#6B6B6B] hover:text-[#1A1A2E] relative transition-colors group"
          >
            <ShoppingBag size={22} strokeWidth={1.5} />
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

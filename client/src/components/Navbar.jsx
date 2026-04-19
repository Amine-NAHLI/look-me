import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Search, ShoppingBag, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUIStore } from '../store/useUIStore';
import { drawerVariants, overlayVariants } from '../utils/animations';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, openCart, user, openAuthModal } = useUIStore();
  const { scrollY } = useScroll();

  const navShadow = useTransform(scrollY, [0, 80], ['none', '0 2px 20px rgba(0,0,0,0.08)']);

  const cartItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Catalogue', path: '/catalogue' },
    { name: 'Nouveautés', path: '/nouveautes' },
  ];

  return (
    <>
      <div className="bg-[#0A0A0A] text-white text-[11px] uppercase tracking-[2px] text-center py-2 font-body font-medium">
        Livraison disponible partout au Maroc — Paiement à la livraison
      </div>

      <motion.nav 
        initial={{ y: -80 }} 
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        style={{ boxShadow: navShadow }}
        className="sticky top-0 w-full z-[1000] bg-white border-b border-[var(--border)] h-[68px] flex items-center"
      >
        <div className="container mx-auto px-4 md:px-6 h-full grid grid-cols-3 items-center">
          
          <div className="flex items-center justify-start lg:hidden">
            <button 
              className="p-2 -ml-2 text-[var(--dark)] hover:text-[#C2185B] transition-colors" 
              onClick={() => setIsMenuOpen(true)}
            >
              <Menu size={24} strokeWidth={1.5} />
            </button>
          </div>

          <div className="hidden lg:flex items-center justify-start gap-8">
            {navLinks.map((link) => (
              <motion.div key={link.name}>
                <Link
                  to={link.path}
                  className="font-body font-medium text-[12px] uppercase tracking-[2px] text-[#1C1C1C] transition-colors hover:text-[#C2185B]"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
            {user?.role === 'admin' && (
              <Link 
                to="/admin" 
                className="font-body font-medium text-[12px] uppercase tracking-[2px] text-[#1C1C1C] transition-colors hover:text-[#C2185B]"
              >
                Admin
              </Link>
            )}
          </div>

          <Link to="/" className="flex justify-center items-center">
            <span className="text-[20px] md:text-[22px] text-[var(--black)] font-body font-extrabold tracking-[-0.5px]">
              LOOK<span className="text-[#C2185B]">ME</span>
            </span>
          </Link>

          <div className="flex items-center justify-end gap-4 md:gap-5">
            <motion.button 
              onClick={() => navigate('/catalogue')}
              className="text-[#1C1C1C] hidden sm:block"
              whileHover={{ scale: 1.1, color: '#C2185B' }}
              whileTap={{ scale: 0.95 }}
            >
              <Search size={20} strokeWidth={1.5} />
            </motion.button>
            
            <motion.button 
              onClick={() => user ? navigate('/profil') : openAuthModal()}
              className="text-[#1C1C1C]"
              whileHover={{ scale: 1.1, color: '#C2185B' }}
              whileTap={{ scale: 0.95 }}
            >
              <User size={20} strokeWidth={1.5} />
            </motion.button>

            <motion.button 
              onClick={openCart}
              className="text-[#1C1C1C] relative"
              whileHover={{ scale: 1.1, color: '#C2185B' }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              <AnimatePresence>
                {cartItemsCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute -top-1.5 -right-2 min-w-[16px] h-[16px] bg-[#C2185B] text-white text-[10px] font-bold font-body rounded-full flex items-center justify-center px-1"
                  >
                    {cartItemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="hidden" animate="visible" exit="exit"
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 z-[1001]"
            />
            <motion.div
              variants={drawerVariants}
              initial="hidden" animate="visible" exit="exit"
              className="fixed top-0 left-0 bottom-0 w-[300px] bg-white z-[1002] flex flex-col shadow-lg"
              style={{ originX: 0 }}
            >
              <div className="p-6 border-b border-[var(--border)] flex justify-between items-center">
                <span className="text-[18px] text-[var(--black)] font-body font-extrabold tracking-[-0.5px]">
                  LOOK<span className="text-[#C2185B]">ME</span>
                </span>
                <button onClick={() => setIsMenuOpen(false)} className="text-[#1C1C1C]">
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>
              <div className="flex flex-col p-6 gap-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.2 }}
                  >
                    <Link
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="font-body font-medium text-[14px] uppercase tracking-[2px] text-[#1C1C1C] block"
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

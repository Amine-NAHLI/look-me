import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { fadeInUp } from '../utils/animations';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] pt-24 pb-12">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={fadeInUp}
        className="container mx-auto px-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Column 1: À Propos */}
          <div className="flex flex-col gap-6">
            <h3 className="font-body font-semibold text-[11px] uppercase tracking-[2px] text-white">À Propos</h3>
            <div className="flex flex-col gap-4">
              <Link to="/" className="font-body text-[13px] text-[#9E9E9E] hover:text-white transition-colors duration-200">Notre histoire</Link>
              <Link to="/" className="font-body text-[13px] text-[#9E9E9E] hover:text-white transition-colors duration-200">Nos boutiques</Link>
              <Link to="/" className="font-body text-[13px] text-[#9E9E9E] hover:text-white transition-colors duration-200">Carrières</Link>
            </div>
            <div className="flex gap-4 mt-2">
              <motion.a whileHover={{ color: '#C2185B', scale: 1.1 }} href="#" className="text-white transition-colors">
                <FaFacebook size={18} />
              </motion.a>
              <motion.a whileHover={{ color: '#C2185B', scale: 1.1 }} href="#" className="text-white transition-colors">
                <FaInstagram size={18} />
              </motion.a>
              <motion.a whileHover={{ color: '#C2185B', scale: 1.1 }} href="#" className="text-white transition-colors">
                <FaTwitter size={18} />
              </motion.a>
              <motion.a whileHover={{ color: '#C2185B', scale: 1.1 }} href="#" className="text-white transition-colors">
                <FaWhatsapp size={18} />
              </motion.a>
            </div>
          </div>

          {/* Column 2: Catalogue */}
          <div className="flex flex-col gap-6">
            <h3 className="font-body font-semibold text-[11px] uppercase tracking-[2px] text-white">Catalogue</h3>
            <div className="flex flex-col gap-4">
              <Link to="/" className="font-body text-[13px] text-[#9E9E9E] hover:text-white transition-colors duration-200">Nouvelle Collection</Link>
              <Link to="/" className="font-body text-[13px] text-[#9E9E9E] hover:text-white transition-colors duration-200">Prêt-à-porter</Link>
              <Link to="/" className="font-body text-[13px] text-[#9E9E9E] hover:text-white transition-colors duration-200">Accessoires</Link>
              <Link to="/" className="font-body text-[13px] text-[#9E9E9E] hover:text-white transition-colors duration-200">Éditions limitées</Link>
            </div>
          </div>

          {/* Column 3: Aide */}
          <div className="flex flex-col gap-6">
            <h3 className="font-body font-semibold text-[11px] uppercase tracking-[2px] text-white">Aide</h3>
            <div className="flex flex-col gap-4">
              <Link to="/" className="font-body text-[13px] text-[#9E9E9E] hover:text-white transition-colors duration-200">Suivi de commande</Link>
              <Link to="/" className="font-body text-[13px] text-[#9E9E9E] hover:text-white transition-colors duration-200">Livraison & Retours</Link>
              <Link to="/" className="font-body text-[13px] text-[#9E9E9E] hover:text-white transition-colors duration-200">FAQ</Link>
              <Link to="/" className="font-body text-[13px] text-[#9E9E9E] hover:text-white transition-colors duration-200">Conditions Générales</Link>
            </div>
          </div>

          {/* Column 4: Contact */}
          <div className="flex flex-col gap-6">
            <h3 className="font-body font-semibold text-[11px] uppercase tracking-[2px] text-white">Contact</h3>
            <div className="flex flex-col gap-4">
              <span className="font-body text-[13px] text-[#9E9E9E]">contact@lookme.ma</span>
              <span className="font-body text-[13px] text-[#9E9E9E]">+212 6 00 00 00 00</span>
              <span className="font-body text-[13px] text-[#9E9E9E] mt-2">Du Lundi au Samedi<br/>9:00 - 20:00</span>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-[#1E1E1E] text-center">
          <p className="font-body text-[12px] text-[#6B6B6B]">
            © {new Date().getFullYear()} LOOKME. Tous droits réservés.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}

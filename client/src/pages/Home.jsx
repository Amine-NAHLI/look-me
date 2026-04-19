import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ProductGrid from '../components/ProductGrid';
import { Truck, CreditCard, ShieldCheck, Headphones, ArrowRight } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { fadeInUp, fadeIn, staggerContainer } from '../utils/animations';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const reassuranceRef = useRef(null);
  const isReassuranceInView = useInView(reassuranceRef, { once: true, margin: "-50px" });

  const reassuranceFeatures = [
    { icon: <Truck size={24} strokeWidth={1} />, title: "Livraison Rapide" },
    { icon: <CreditCard size={24} strokeWidth={1} />, title: "Paiement Livraison" },
    { icon: <ShieldCheck size={24} strokeWidth={1} />, title: "Retours 30J" },
    { icon: <Headphones size={24} strokeWidth={1} />, title: "Support 7J/7" },
  ];

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-[#0A0A0A] min-h-[100svh] flex items-center justify-center text-center px-4 md:px-6 lg:px-12 py-12">
        <div className="flex flex-col items-center">
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="font-body font-medium text-[12px] uppercase tracking-[3px] text-[#C2185B] mb-6"
          >
            — Nouvelle Collection 2024 —
          </motion.p>
          
          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="font-heading font-bold text-[40px] md:text-[56px] lg:text-[80px] text-white leading-[1.1] mb-6"
          >
            L'Élégance<br/>À Votre Portée
          </motion.h1>
          
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            className="font-body font-light text-[16px] text-[#9E9E9E] max-w-[480px] mb-10"
          >
            Découvrez notre sélection exclusive de pièces conçues pour sublimer chaque instant. L'alliance parfaite entre minimalisme et audace.
          </motion.p>
          
          <motion.button
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            onClick={() => navigate('/catalogue')}
            whileHover={{ scale: 1.02, backgroundColor: '#C2185B', color: '#fff' }}
            whileTap={{ scale: 0.98 }}
            transition={{ delay: 0.7, duration: 0.3 }}
            className="w-full md:w-auto bg-white text-black font-body font-semibold text-[12px] uppercase tracking-[2px] px-[48px] py-[16px] rounded-none transition-colors duration-300"
          >
            Explorer le Catalogue
          </motion.button>
          
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 60 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="h-[1px] bg-[#C2185B] mt-12"
          />
        </div>
      </section>

      {/* Reassurance Banner */}
      <motion.section 
        ref={reassuranceRef}
        initial="hidden"
        animate={isReassuranceInView ? "visible" : "hidden"}
        variants={fadeIn}
        className="bg-[#F5F5F5] border-y border-[var(--border)] py-[20px]"
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <div className="flex overflow-x-auto no-scrollbar md:grid md:grid-cols-4 gap-8 pb-4 md:pb-0">
            {reassuranceFeatures.map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-3 min-w-[140px] md:min-w-0 flex-shrink-0">
                <div className="text-[#1C1C1C]">
                  {f.icon}
                </div>
                <h3 className="font-body font-medium text-[11px] uppercase tracking-[1.5px] text-[#1C1C1C]">{f.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Products Section */}
      <section id="catalogue" className="py-12 md:py-16 lg:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <div className="flex flex-col items-center mb-10 md:mb-16 text-center">
            <span className="font-body font-medium text-[11px] uppercase tracking-[3px] text-[#C2185B] mb-4">
              Catalogue
            </span>
            <h2 className="font-heading font-semibold text-[36px] text-black mb-6 tracking-wide">
              Sélection du Moment
            </h2>
            <div className="h-[2px] w-[40px] bg-[#C2185B] mb-8" />
            <button 
              onClick={() => navigate('/catalogue')}
              className="font-body text-[11px] uppercase tracking-[2px] font-bold text-[var(--gray)] hover:text-[#C2185B] transition-colors flex items-center gap-2"
            >
              Voir tout le catalogue <ArrowRight size={14} />
            </button>
          </div>
          
          <ProductGrid />
        </div>
      </section>
    </main>
  );
}

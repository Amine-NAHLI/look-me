import React, { useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import { useUIStore } from '../store/useUIStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronRight, LayoutGrid, List } from 'lucide-react';
import { fadeInUp } from '../utils/animations';

export default function Catalogue() {
  const { selectedCategory, setSelectedCategory, setSearchQuery } = useUIStore();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categories = [
    { id: '', name: 'Toutes les pièces' },
    { id: 'robes', name: 'Robes' },
    { id: 'ensembles', name: 'Ensembles' },
    { id: 'accessoires', name: 'Accessoires' }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-[#0A0A0A] py-20 md:py-32 text-center text-white px-4">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           className="container mx-auto"
        >
          <h1 className="text-[40px] md:text-[64px] font-heading font-bold mb-6 tracking-tight italic">Le Catalogue</h1>
          <div className="flex items-center justify-center gap-3 text-[11px] uppercase tracking-[3px] text-[#C2185B] font-body font-medium">
            <span>LookMe</span>
            <ChevronRight size={12} />
            <span className="text-white">Collection 2024</span>
          </div>
        </motion.div>
      </section>

      {/* Toolbar */}
      <div className="sticky top-[68px] z-40 bg-white border-b border-[var(--border)] py-4">
        <div className="container mx-auto px-4 md:px-6 lg:px-12 flex justify-between items-center">
          <div className="flex gap-4">
             <button 
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 font-body text-[11px] uppercase tracking-[2px] font-semibold text-[var(--dark)] hover:text-[#C2185B] transition-colors"
             >
                <Filter size={16} strokeWidth={1.5} />
                Filtrer
             </button>
          </div>

          <div className="flex items-center gap-8 overflow-x-auto no-scrollbar hidden md:flex">
             {categories.map(cat => (
               <button
                 key={cat.id}
                 onClick={() => setSelectedCategory(cat.id)}
                 className={`font-body text-[11px] uppercase tracking-[2px] font-medium whitespace-nowrap transition-colors relative ${
                   selectedCategory === cat.id ? 'text-[#C2185B]' : 'text-[var(--gray)] hover:text-[var(--dark)]'
                 }`}
               >
                 {cat.name}
                 {selectedCategory === cat.id && (
                   <motion.div layoutId="catUnderline" className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#C2185B]" />
                 )}
               </button>
             ))}
          </div>

          <div className="text-[12px] font-body text-[var(--gray)]">
             <span className="font-bold text-[var(--dark)]">Premium</span> Selection
          </div>
        </div>
      </div>

      {/* Grid */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 md:px-6 lg:px-12">
          <ProductGrid />
        </div>
      </section>

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {isFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterOpen(false)}
              className="fixed inset-0 bg-black/40 z-[200] backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-[85%] max-w-[350px] bg-white z-[201] shadow-2xl p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10 pb-6 border-b">
                <h2 className="text-[20px] font-heading font-bold">Filtres</h2>
                <button onClick={() => setIsFilterOpen(false)}>
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex-grow space-y-10">
                <div>
                  <h3 className="text-[11px] uppercase tracking-[3px] font-bold text-[var(--gray)] mb-6">Catégories</h3>
                  <div className="flex flex-col gap-4">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        onClick={() => { setSelectedCategory(cat.id); setIsFilterOpen(false); }}
                        className={`text-left font-body text-[14px] transition-colors ${
                          selectedCategory === cat.id ? 'text-[#C2185B] font-bold' : 'text-[var(--dark)] hover:text-[#C2185B]'
                        }`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] uppercase tracking-[3px] font-bold text-[var(--gray)] mb-6">Prix</h3>
                  <div className="space-y-4">
                     <button 
                        onClick={() => toast.success("Filtre prix appliqué")}
                        className="w-full py-3 bg-[#F5F5F5] font-body text-[12px] uppercase tracking-[1px] hover:bg-[#C2185B] hover:text-white transition-colors"
                     >
                        Réinitialiser tout
                     </button>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-[#0A0A0A] text-white py-4 font-body font-bold text-[11px] uppercase tracking-[2px]"
              >
                Afficher les résultats
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

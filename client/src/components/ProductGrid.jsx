import { motion } from 'framer-motion';

export default function ProductGrid() {
  const products = [
    {
      id: 1,
      name: 'Robe Blanche Estivale',
      category: 'Robes',
      price: '89€',
      // Images stables
      image: 'https://images.unsplash.com/photo-1515347619362-e67425dd98d1?q=80&w=1953&auto=format&fit=crop',
    },
    {
      id: 2,
      name: 'Chemisier Rose Bonbon',
      category: 'Hauts',
      price: '65€',
      image: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?q=80&w=1887&auto=format&fit=crop',
    },
    {
      id: 3,
      name: 'Pantalon Fluide Épice',
      category: 'Pantalons',
      price: '75€',
      image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1976&auto=format&fit=crop',
    },
    {
      id: 4,
      name: 'Tailleur Rose Pâle',
      category: 'Vestes',
      price: '120€',
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1887&auto=format&fit=crop',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <section className="container mx-auto px-4 py-16 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex items-end justify-between mb-12 border-b border-pink-100 pb-4"
      >
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2 text-slate-800">Nos Favoris</h2>
          <p className="text-slate-500 text-sm">Des pièces délicates en blanc et rose</p>
        </div>
        <a href="#" className="hidden sm:inline-block text-pink-500 hover:text-pink-600 font-bold uppercase tracking-wider transition-colors border-b-2 border-pink-500 pb-1">
          Voir tout
        </a>
      </motion.div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 perspective-[1500px]"
      >
        {products.map((product) => (
          <motion.div 
            key={product.id} 
            variants={cardVariants}
            whileHover={{ 
              scale: 1.05, 
              rotateY: 5, 
              rotateX: -5,
              z: 50,
              boxShadow: "0 25px 50px -12px rgba(236, 72, 153, 0.25)"
            }}
            className="group cursor-pointer transform-style-3d bg-white rounded-2xl p-2"
          >
            <div className="relative aspect-[4/5] mb-4 overflow-hidden rounded-xl bg-pink-50 shadow-sm">
              <img 
                src={product.image} 
                alt={product.name}
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=2000&auto=format&fit=crop'; // Fallback
                }}
              />
              <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 bg-white/90 backdrop-blur-md transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                <button className="w-full bg-pink-500 text-white py-3 rounded-full text-sm font-bold shadow-md hover:bg-pink-600 transition-colors">
                  Ajouter au Panier
                </button>
              </div>
            </div>
            <div className="text-center sm:text-left px-2">
              <p className="text-xs text-pink-500 uppercase font-bold tracking-widest mb-1">{product.category}</p>
              <h3 className="text-lg font-bold text-slate-800 group-hover:text-pink-500 transition-colors">{product.name}</h3>
              <p className="text-md font-extrabold text-slate-600 mt-1">{product.price}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

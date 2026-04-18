import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="relative w-full min-h-[80vh] flex items-center mb-16 bg-white overflow-hidden">
      {/* Forme douce rose pâle en arrière-plan */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, x: 200 }}
        animate={{ opacity: 0.5, scale: 1, x: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-pink-50 rounded-l-full z-0"
      />
      
      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center">
        {/* Texte animé */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full md:w-1/2 py-12 md:py-24 pr-0 md:pr-8 text-center md:text-left"
        >
          <motion.span variants={itemVariants} className="text-pink-500 font-bold tracking-widest uppercase text-sm mb-4 block">
            Nouvelle Collection Été
          </motion.span>
          <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-slate-800">
            Douceur en <br/>
            <span className="text-pink-500">
              Rose & Blanc.
            </span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg text-slate-500 mb-10 leading-relaxed font-medium max-w-lg mx-auto md:mx-0">
            Découvrez notre sélection exclusive de vêtements. Une collection lumineuse et résolument féminine pour toutes les occasions.
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <motion.a 
              href="#catalogue"
              whileHover={{ scale: 1.05, boxShadow: "0 20px 25px -5px rgba(236, 72, 153, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center justify-center gap-2 bg-pink-500 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-pink-200"
            >
              Shopper maintenant
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ArrowRight size={18} />
              </motion.div>
            </motion.a>
            <motion.a 
              href="#catalogue"
              whileHover={{ scale: 1.05, backgroundColor: "#fdf2f8" }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 bg-white border-2 border-pink-500 text-pink-500 px-8 py-4 rounded-full font-bold"
            >
              Voir la galerie
            </motion.a>
          </motion.div>
        </motion.div>
        
        {/* Image 3D flottante */}
        <motion.div 
          initial={{ opacity: 0, opacity: 0 }}
          animate={{ opacity: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="w-full md:w-1/2 mt-12 md:mt-0 relative flex justify-center perspective-[1000px]"
        >
          <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[450px] md:h-[450px] bg-pink-300 rounded-full blur-3xl opacity-40 z-0" />
          
          <motion.img 
            animate={{ y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            whileHover={{ rotateY: 5, rotateX: 5, scale: 1.02, z: 50 }}
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop" 
            alt="Mode féminine en rose et blanc" 
            className="relative z-10 w-[90%] md:w-full max-w-md h-[400px] md:h-[550px] object-cover rounded-3xl shadow-2xl border-8 border-white transform-style-3d cursor-pointer"
          />
        </motion.div>
      </div>
    </section>
  );
}

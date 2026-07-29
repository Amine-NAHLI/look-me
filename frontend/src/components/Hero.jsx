import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, Star } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white">
      {/* Background Abstract Shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 rounded-l-[10rem] -z-10 hidden lg:block" />
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 1.5 }}
        className="absolute -top-20 -left-20 w-80 h-80 bg-pink-300 rounded-full blur-[100px] -z-10"
      />

      <div className="container mx-auto px-4 py-20 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-pink-50 text-pink-600 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-8 shadow-sm">
              <Star size={14} fill="currentColor" />
              Nouvelle Collection 2024
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-[0.9] tracking-tighter mb-8 italic">
              Visez <span className="text-pink-500 not-italic">l'Élégance</span> <br /> 
              À Chaque <span className="underline decoration-pink-200 underline-offset-8">Instant</span>.
            </h1>
            
            <p className="text-xl text-gray-500 max-w-lg leading-relaxed mb-12 font-medium">
              Découvrez des pièces uniques conçues pour sublimer votre quotidien. La mode marocaine moderne s'invite chez vous.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <button 
                onClick={() => document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-primary flex items-center gap-3 group px-10 h-16 text-lg"
              >
                Explorer le Catalogue
                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
              </button>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-black text-gray-900 italic">+2k Clients</p>
                  <div className="flex text-yellow-400">
                    {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10 aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl shadow-gray-200">
              <img 
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop" 
                alt="Fashion Model" 
                className="w-full h-full object-cover"
              />
              {/* Floating Badge */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-12 -right-6 lg:-right-12 bg-white p-6 rounded-[2rem] shadow-2xl border border-gray-50 max-w-[180px]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                    <ShoppingBag size={14} />
                  </div>
                  <span className="font-black text-[10px] uppercase tracking-widest text-gray-400">Dernier Achat</span>
                </div>
                <p className="font-bold text-gray-900 leading-tight">Robe Kimono Silk</p>
                <p className="text-pink-500 font-black italic mt-1 text-lg">450 DH</p>
              </motion.div>
            </div>
            
            {/* Decorative background circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-pink-100 rounded-full -scale-y-0 shadow-inner -z-0" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

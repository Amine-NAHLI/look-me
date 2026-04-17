import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative w-full h-[80vh] flex items-center mb-16 overflow-hidden bg-secondary">
      {/* Background visual (Placeholder gradient for luxury feel) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-background via-[#1a1a14] to-background z-0"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity z-0"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl">
          <span className="text-accent font-medium tracking-widest uppercase text-sm mb-4 block">
            Essence of Elegance
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            Redefine Your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-yellow-200">
              Signature Style.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-foreground/70 mb-10 max-w-lg leading-relaxed">
            Discover the new exclusive collection designed for those who appreciate the finer details. Experience uncompromising quality.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="group flex items-center justify-center gap-2 bg-accent hover:bg-yellow-500 text-primary-foreground px-8 py-4 rounded-sm font-medium transition-all duration-300">
              Shop Collection
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="flex items-center justify-center gap-2 bg-transparent border border-secondary hover:border-accent text-foreground px-8 py-4 rounded-sm font-medium transition-all duration-300">
              View Lookbook
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

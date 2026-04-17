import { Mail, Globe, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-pink-100 mt-24 bg-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <a href="/" className="text-3xl font-extrabold tracking-tighter text-slate-800 mb-6 block">
              LOOK<span className="text-pink-500">ME</span>
            </a>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
              Des collections pensées pour sublimer chaque femme au quotidien. L'élégance du rose et du blanc à fleur de peau.
            </p>
            <div className="flex space-x-4 text-pink-500">
              <a href="#" className="p-2 bg-pink-50 rounded-full hover:bg-pink-500 hover:text-white transition-all"><Mail size={20} /></a>
              <a href="#" className="p-2 bg-pink-50 rounded-full hover:bg-pink-500 hover:text-white transition-all"><MessageCircle size={20} /></a>
              <a href="#" className="p-2 bg-pink-50 rounded-full hover:bg-pink-500 hover:text-white transition-all"><Globe size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 mb-6 uppercase tracking-wider text-sm">Boutique</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li><a href="#" className="hover:text-pink-500 transition-colors">Nouveautés</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">Robes d'Été</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">Hauts & Basiques</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">Bons Plans</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-6 uppercase tracking-wider text-sm">Service Client</h4>
            <ul className="space-y-4 text-sm font-medium text-slate-500">
              <li><a href="#" className="hover:text-pink-500 transition-colors">Nous Contacter</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">Questions Fréquentes</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">Retours Simplifiés</a></li>
              <li><a href="#" className="hover:text-pink-500 transition-colors">Où est mmon colis ?</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-6 uppercase tracking-wider text-sm">Club Rose</h4>
            <p className="text-sm text-slate-500 mb-4 font-medium">Inscrivez-vous pour gagner des points, des surprises exclusives et découvrir nos nouveautés.</p>
            <form className="flex border-2 border-pink-100 focus-within:border-pink-500 transition-colors rounded-full overflow-hidden">
              <input 
                type="email" 
                placeholder="Votre email" 
                className="bg-white px-6 py-3 w-full text-sm outline-none placeholder:text-slate-400 text-slate-700"
              />
              <button 
                type="submit"
                className="bg-pink-500 px-6 text-sm font-bold hover:bg-pink-600 text-white transition-colors"
              >
                Go!
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-pink-100 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 font-medium">
          <p>© {new Date().getFullYear()} LOOKME. La perfection en rose.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-pink-500 transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-pink-500 transition-colors">CGV</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

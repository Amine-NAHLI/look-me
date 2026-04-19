import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Rocket } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center text-white">
                <Rocket size={20} fill="white" />
              </div>
              <span className="text-2xl font-black tracking-tighter uppercase italic">
                Look<span className="text-pink-500">Me</span>
              </span>
            </Link>
            <p className="text-gray-400 leading-relaxed">
              La destination préférée des femmes modernes au Maroc. Découvrez nos dernières collections de robes, tops et accessoires.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-pink-500 transition-colors">
                <FaFacebook size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-pink-500 transition-colors">
                <FaInstagram size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-pink-500 transition-colors">
                <FaTwitter size={18} />
              </a>
              <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-pink-500 transition-colors">
                <FaWhatsapp size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-8">Navigation</h3>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/" className="hover:text-pink-500 transition-colors">Accueil</Link></li>
              <li><Link to="/" className="hover:text-pink-500 transition-colors">Catalogue complet</Link></li>
              <li><Link to="/" className="hover:text-pink-500 transition-colors">Nouveautés</Link></li>
              <li><Link to="/" className="hover:text-pink-500 transition-colors">Meilleures ventes</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold mb-8">Support & Légal</h3>
            <ul className="space-y-4 text-gray-400">
              <li><Link to="/" className="hover:text-pink-500 transition-colors">Suivi de commande</Link></li>
              <li><Link to="/" className="hover:text-pink-500 transition-colors">Conditions Générales</Link></li>
              <li><Link to="/" className="hover:text-pink-500 transition-colors">Politique de retour</Link></li>
              <li><Link to="/" className="hover:text-pink-500 transition-colors">Contactez-nous</Link></li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-lg font-bold mb-8">Contact</h3>
            <ul className="space-y-6 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="text-pink-500 mt-1 flex-shrink-0" size={20} />
                <span>Rabat, Maroc - Zone Industrielle Maarif</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-pink-500 flex-shrink-0" size={20} />
                <span>+212 6 00 00 00 00</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-pink-500 flex-shrink-0" size={20} />
                <span>contact@lookme.ma</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} LOOKME Maroc. Tous droits réservés.</p>
          <div className="flex gap-4">
            <span>Paiement à la livraison sécurisé</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

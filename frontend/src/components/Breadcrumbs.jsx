import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="container mx-auto px-4 py-4 flex items-center text-sm text-gray-400">
      <Link to="/" className="flex items-center hover:text-pink-500 transition-colors">
        <Home size={16} className="mr-1" />
        <span>Accueil</span>
      </Link>
      
      {pathnames.map((value, index) => {
        const last = index === pathnames.length - 1;
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;

        // Map path segments to pretty names
        const nameMap = {
          'product': 'Produit',
          'checkout': 'Commande',
          'profile': 'Mon Compte',
          'admin': 'Administration',
          'order-success': 'Confirmation'
        };

        const displayName = nameMap[value] || value.charAt(0).toUpperCase() + value.slice(1);

        return (
          <div key={to} className="flex items-center">
            <ChevronRight size={16} className="mx-2" />
            {last ? (
              <span className="font-bold text-gray-800">{displayName}</span>
            ) : (
              <Link to={to} className="hover:text-pink-500 transition-colors">
                {displayName}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;

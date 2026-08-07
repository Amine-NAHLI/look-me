import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import ScrollToTop from './ScrollToTop';
import CartDrawer from './CartDrawer';
import AuthModal from './AuthModal';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');

  if (isAdmin) return <>{children}<AuthModal /></>;

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <a className="skip-link" href="#main-content">Aller au contenu principal</a>
      <Navbar />
      <div id="main-content" className="flex-grow" tabIndex={-1}>
        <Breadcrumbs />
        {children}
      </div>
      <Footer />
      <CartDrawer />
      <AuthModal />
    </div>
  );
};

export default Layout;

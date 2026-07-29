import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import ScrollToTop from './ScrollToTop';
import CartDrawer from './CartDrawer';
import AuthModal from './AuthModal';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <div className="flex-grow">
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

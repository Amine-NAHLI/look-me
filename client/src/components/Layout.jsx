import Navbar from './Navbar';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';
import ScrollToTop from './ScrollToTop';
import CartDrawer from './CartDrawer';
import AuthModal from './AuthModal';
import { Toaster } from 'react-hot-toast';

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
      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '16px',
            padding: '12px 24px',
            fontWeight: 'bold',
          },
        }}
      />
    </div>
  );
};

export default Layout;

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import ProductDetails from './pages/ProductDetails'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Catalogue from './pages/Catalogue'
import NotFound from './pages/NotFound'
import PageTransition from './components/PageTransition'
import ScrollToTop from './components/ScrollToTop'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { useUIStore } from './store/useUIStore'
import './index.css'

// Espace Client lazy-loading style (optional, but keep it structured)
import ProfileLayout from './pages/Profile/ProfileLayout'
import OrdersList from './pages/Profile/OrdersList'
import OrderDetail from './pages/Profile/OrderDetail'
import UserInfos from './pages/Profile/UserInfos'

const queryClient = new QueryClient()

const PrivateRoute = ({ children }) => {
  const { user } = useUIStore()
  return user ? children : <Navigate to="/" />
}

const AdminRoute = ({ children }) => {
  const { user } = useUIStore()
  return user && user.role === 'admin' ? children : <Navigate to="/" />
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'Outfit, sans-serif',
            fontSize: '13px',
            borderRadius: '0px',
            background: '#0A0A0A',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}
      />
      <Router>
        <ScrollToTop />
        <Layout>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/product/:id" element={<PageTransition><ProductDetails /></PageTransition>} />
              <Route path="/catalogue" element={<PageTransition><Catalogue /></PageTransition>} />
              <Route path="/nouveautes" element={<PageTransition><Catalogue /></PageTransition>} />
              <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
              <Route path="/order-success/:id" element={<PageTransition><OrderSuccess /></PageTransition>} />

              {/* Private Routes (Espace Client) */}
              <Route path="/profil" element={<PrivateRoute><PageTransition><ProfileLayout /></PageTransition></PrivateRoute>}>
                <Route index element={<Navigate to="commandes" />} />
                <Route path="commandes" element={<OrdersList />} />
                <Route path="commandes/:id" element={<OrderDetail />} />
                <Route path="informations" element={<UserInfos />} />
              </Route>

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute><PageTransition><AdminDashboard /></PageTransition></AdminRoute>} />
              
              <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </Layout>
      </Router>
    </QueryClientProvider>
  )
}

export default App

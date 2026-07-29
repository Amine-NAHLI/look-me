import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout'
import Home from './pages/Home'
import PageTransition from './components/PageTransition'
import ScrollToTop from './components/ScrollToTop'
import { AnimatePresence } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { useUIStore } from './store/useUIStore'
import SessionBootstrap from './components/SessionBootstrap'
import './index.css'

const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const ProductDetails = lazy(() => import('./pages/ProductDetails'))
const Checkout = lazy(() => import('./pages/Checkout'))
const OrderSuccess = lazy(() => import('./pages/OrderSuccess'))
const Catalogue = lazy(() => import('./pages/Catalogue'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ProfileLayout = lazy(() => import('./pages/Profile/ProfileLayout'))
const OrdersList = lazy(() => import('./pages/Profile/OrdersList'))
const OrderDetail = lazy(() => import('./pages/Profile/OrderDetail'))
const UserInfos = lazy(() => import('./pages/Profile/UserInfos'))
const LegalPage = lazy(() => import('./pages/LegalPage'))

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
      <SessionBootstrap />
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
          <Suspense fallback={<main className="grid min-h-[50vh] place-items-center" aria-busy="true">Chargement…</main>}>
          <AnimatePresence mode="wait">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PageTransition><Home /></PageTransition>} />
              <Route path="/product/:id" element={<PageTransition><ProductDetails /></PageTransition>} />
              <Route path="/catalogue" element={<PageTransition><Catalogue /></PageTransition>} />
              <Route path="/nouveautes" element={<PageTransition><Catalogue /></PageTransition>} />
              <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
              <Route path="/order-success/:id" element={<PageTransition><OrderSuccess /></PageTransition>} />
              <Route path="/mentions-legales" element={<PageTransition><LegalPage /></PageTransition>} />
              <Route path="/confidentialite" element={<PageTransition><LegalPage /></PageTransition>} />
              <Route path="/cgv" element={<PageTransition><LegalPage /></PageTransition>} />
              <Route path="/livraison-retours" element={<PageTransition><LegalPage /></PageTransition>} />

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
          </Suspense>
        </Layout>
      </Router>
    </QueryClientProvider>
  )
}

export default App

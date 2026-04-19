import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Layout from './components/Layout'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import ProductDetails from './pages/ProductDetails'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import './index.css'

// Création de l'instance QueryClient
const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  )
}

export default App

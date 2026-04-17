import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import Home from './pages/Home'
import AdminDashboard from './pages/AdminDashboard'
import './index.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-pink-500 selection:text-white">
        <Navbar />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>

        <Footer />
        <AuthModal />
      </div>
    </Router>
  )
}

export default App

import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ProductGrid from './components/ProductGrid'
import Footer from './components/Footer'
import AuthModal from './components/AuthModal'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-accent selection:text-primary-foreground">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        <ProductGrid />
      </main>

      <Footer />
      <AuthModal />
    </div>
  )
}

export default App

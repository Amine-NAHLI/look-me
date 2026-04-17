import { Mail, Globe, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-secondary mt-24 bg-[#030303] pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <a href="/" className="text-3xl font-bold tracking-tighter mb-6 block">
              LOOK<span className="text-accent">ME</span>.
            </a>
            <p className="text-foreground/60 text-sm leading-relaxed mb-6">
              Curating exceptional pieces for the modern aesthetic. Excellence in every detail, crafted for distinction.
            </p>
            <div className="flex space-x-4 text-foreground/60">
              <a href="#" className="hover:text-accent transition-colors"><Mail size={20} /></a>
              <a href="#" className="hover:text-accent transition-colors"><MessageCircle size={20} /></a>
              <a href="#" className="hover:text-accent transition-colors"><Globe size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-6 uppercase tracking-wider text-sm">Shop</h4>
            <ul className="space-y-4 text-sm text-foreground/60">
              <li><a href="#" className="hover:text-accent transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Accessories</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Sale</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 uppercase tracking-wider text-sm">Support</h4>
            <ul className="space-y-4 text-sm text-foreground/60">
              <li><a href="#" className="hover:text-accent transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">FAQs</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Shipping Returns</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Track Order</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 uppercase tracking-wider text-sm">Newsletter</h4>
            <p className="text-sm text-foreground/60 mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex border border-secondary focus-within:border-accent transition-colors rounded-sm overflow-hidden">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent px-4 py-3 w-full text-sm outline-none placeholder:text-foreground/40"
              />
              <button 
                type="submit"
                className="bg-secondary px-6 text-sm font-medium hover:bg-accent text-foreground hover:text-background transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-secondary pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-foreground/40">
          <p>© {new Date().getFullYear()} LOOKME. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

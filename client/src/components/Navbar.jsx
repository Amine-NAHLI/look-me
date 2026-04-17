import { Search, ShoppingBag, User, Menu } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-secondary bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Mobile Menu */}
        <button className="md:hidden p-2 text-foreground/80 hover:text-accent transition-colors">
          <Menu size={24} />
        </button>

        {/* Logo */}
        <a href="/" className="text-2xl font-bold tracking-tighter hover:text-accent transition-colors">
          LOOK<span className="text-accent">ME</span>.
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-8 text-sm font-medium">
          <a href="#" className="text-foreground/80 hover:text-accent transition-colors">New Arrivals</a>
          <a href="#" className="text-foreground/80 hover:text-accent transition-colors">Collections</a>
          <a href="#" className="text-foreground/80 hover:text-accent transition-colors">Accessories</a>
          <a href="#" className="text-foreground/80 hover:text-accent transition-colors">About</a>
        </div>

        {/* Icons */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-foreground/80 hover:text-accent transition-colors">
            <Search size={20} />
          </button>
          <button className="p-2 text-foreground/80 hover:text-accent transition-colors">
            <User size={20} />
          </button>
          <button className="p-2 text-foreground/80 hover:text-accent transition-colors relative">
            <ShoppingBag size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

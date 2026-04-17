export default function ProductGrid() {
  const products = [
    {
      id: 1,
      name: 'Midnight Chronograph',
      category: 'Watches',
      price: '$1,250',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop',
    },
    {
      id: 2,
      name: 'Obsidian Leather Tote',
      category: 'Accessories',
      price: '$890',
      image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1915&auto=format&fit=crop',
    },
    {
      id: 3,
      name: 'Onyx Sunglasses',
      category: 'Eyewear',
      price: '$340',
      image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=2080&auto=format&fit=crop',
    },
    {
      id: 4,
      name: 'Signature Silk Scarf',
      category: 'Accessories',
      price: '$180',
      image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?q=80&w=1974&auto=format&fit=crop',
    },
  ];

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">Curated Selection</h2>
          <p className="text-foreground/60 text-sm">Elevate your daily ensembles</p>
        </div>
        <a href="#" className="hidden sm:inline-block text-accent hover:text-yellow-400 text-sm font-medium uppercase tracking-wider transition-colors">
          View All Products
        </a>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="group cursor-pointer">
            <div className="relative aspect-[4/5] mb-4 overflow-hidden rounded-sm bg-secondary">
              <img 
                src={product.image} 
                alt={product.name}
                className="object-cover w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-out"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 border-t border-white/10 group-hover:opacity-100 bg-background/80 backdrop-blur-sm transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                <button className="w-full bg-foreground text-background py-2 text-sm font-medium hover:bg-accent transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs text-foreground/50 uppercase tracking-widest mb-1">{product.category}</p>
              <h3 className="text-lg font-medium tracking-tight group-hover:text-accent transition-colors">{product.name}</h3>
              <p className="text-md font-medium text-foreground/80 mt-1">{product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

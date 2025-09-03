import { useState, useEffect, useMemo } from 'react';
import { Product } from '@/types/product';
import { fetchProducts, getUniqueCategories } from '@/services/googleSheets';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import ProductFilters from '@/components/ProductFilters';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface Filters {
  categories: string[];
  priceRange: [number, number];
  inStock: boolean;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    priceRange: [0, 50000],
    inStock: false,
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
        
        // Set max price based on products
        const maxPrice = Math.max(...fetchedProducts.map(p => p.price));
        setFilters(prev => ({
          ...prev,
          priceRange: [0, maxPrice],
        }));
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  const categories = getUniqueCategories(products);
  const maxPrice = Math.max(...products.map(p => p.price), 50000);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search filter
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = filters.categories.length === 0 || 
                             filters.categories.includes(product.category);
      
      // Price filter
      const matchesPrice = product.price >= filters.priceRange[0] && 
                          product.price <= filters.priceRange[1];
      
      // Stock filter
      const matchesStock = !filters.inStock || product.stock > 0;
      
      return matchesSearch && matchesCategory && matchesPrice && matchesStock;
    });
  }, [products, searchTerm, filters]);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const FilterContent = () => (
    <ProductFilters
      categories={categories}
      filters={filters}
      onFiltersChange={setFilters}
      maxPrice={maxPrice}
    />
  );

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded-lg w-1/3" />
            <div className="flex gap-8">
              <div className="w-80 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-lg" />
                ))}
              </div>
              <div className="flex-1 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-96 bg-muted rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Collection</h1>
          <p className="text-xl text-muted-foreground">
            Discover our complete range of premium men's fashion
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 slide-up">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Mobile Filter Button */}
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex gap-8">
          {/* Desktop Filters */}
          <div className="hidden lg:block">
            <FilterContent />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    Showing {filteredProducts.length} of {products.length} products
                  </p>
                </div>
                
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product, index) => (
                    <div
                      key={product.id}
                      className="scale-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard
                        product={product}
                        onViewDetails={handleViewDetails}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Products;
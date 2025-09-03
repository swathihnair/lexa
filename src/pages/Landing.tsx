import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Star, Users, Award } from 'lucide-react';
import { Product } from '@/types/product';
import { fetchProducts } from '@/services/googleSheets';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';

const Landing = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const products = await fetchProducts();
        // Get first 6 products as featured
        setFeaturedProducts(products.slice(0, 6));
      } catch (error) {
        console.error('Failed to load products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
  };

  const stats = [
    { icon: Users, label: 'Happy Customers', value: '10,000+' },
    { icon: Award, label: 'Years Experience', value: '15+' },
    { icon: Star, label: 'Customer Rating', value: '4.9/5' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient relative py-20 px-4 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8 fade-in">
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Premium Men's
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Fashion
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover the finest collection of sophisticated menswear. 
              From casual elegance to formal excellence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/products">
                <Button className="btn-hero text-lg px-8 py-4">
                  Shop Collection
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" className="btn-ghost text-lg px-8 py-4">
                  Browse Categories
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6">
                  <stat.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Featured Collection
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Handpicked selection of our finest pieces. Quality, style, and comfort combined.
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-muted rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard
                    product={product}
                    onViewDetails={handleViewDetails}
                  />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/products">
              <Button className="btn-hero text-lg px-8 py-4">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="slide-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-8">
              Why Choose Luxe Men?
            </h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              We believe that every man deserves to look and feel his best. Our carefully curated 
              collection combines timeless style with modern comfort, ensuring you're dressed 
              for success in every situation.
            </p>
          </div>
        </div>
      </section>

      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

export default Landing;
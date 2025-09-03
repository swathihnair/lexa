import { useState } from 'react';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      addToCart(product);
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="product-card group cursor-pointer overflow-hidden">
      <div className="relative overflow-hidden rounded-lg">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/placeholder.svg';
          }}
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
          <Button
            variant="secondary"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart();
            }}
            disabled={isLoading || product.stock === 0}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
        {product.stock === 0 && (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Out of Stock
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              {product.category}
            </Badge>
            <span className="text-lg font-bold text-primary">
              ₹{product.price.toLocaleString()}
            </span>
          </div>
          
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-muted-foreground">
              Stock: {product.stock}
            </span>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={isLoading || product.stock === 0}
              className="btn-hero text-xs px-4 py-2"
            >
              {isLoading ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
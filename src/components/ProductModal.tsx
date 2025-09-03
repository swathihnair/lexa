import { useState } from 'react';
import { Product } from '@/types/product';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, ShoppingCart, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal = ({ product, isOpen, onClose }: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();

  if (!product) return null;

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      addToCart(product, quantity);
      toast.success(`${quantity}x ${product.name} added to cart!`);
      onClose();
      setQuantity(1);
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="md:hidden h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-lg">
              <img
                src={product.imageUrl}
                alt={product.name}
                loading="lazy"
                decoding="async"
                sizes="(max-width: 768px) 100vw, 50vw"
                draggable={false}
                className="w-full h-72 md:h-96 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/placeholder.svg';
                }}
              />
              {product.stock === 0 && (
                <Badge variant="destructive" className="absolute top-4 right-4">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="secondary">{product.category}</Badge>
                <span className="text-3xl font-bold text-primary">
                  ₹{product.price.toLocaleString()}
                </span>
              </div>
              
              <p className="text-muted-foreground text-lg leading-relaxed">
                {product.description}
              </p>
              
              <div className="flex items-center space-x-2 text-sm">
                <span className="text-muted-foreground">Stock:</span>
                <span className={product.stock > 0 ? 'text-green-500' : 'text-red-500'}>
                  {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                </span>
              </div>
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium">Quantity:</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="h-8 w-8"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={incrementQuantity}
                      disabled={quantity >= product.stock}
                      className="h-8 w-8"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-lg">
                    <span>Total:</span>
                    <span className="font-bold text-primary">
                      ₹{(product.price * quantity).toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={isLoading}
                  className="w-full btn-hero"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isLoading ? 'Adding to Cart...' : 'Add to Cart'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
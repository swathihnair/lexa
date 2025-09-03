import { useState } from 'react';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CartItem } from '@/types/product';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWhatsAppCheckout = () => {
    if (cartItems.length === 0) return;
    
    setIsProcessing(true);
    
    // Create WhatsApp message
    let message = "Hello, I would like to place an order for the following item:\n\n";
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name} * ${item.quantity}\n`;
    });
    
    message += `\nTotal: ₹${getCartTotal().toLocaleString()}`;
    
    // WhatsApp URL
    const phoneNumber = "918547732408";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Clear cart after successful order
    setTimeout(() => {
      clearCart();
      setIsProcessing(false);
    }, 1000);
  };

  const CartItemCard = ({ item }: { item: CartItem }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-20 h-20 object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder.svg';
            }}
          />
          
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromCart(item.id)}
                className="text-destructive hover:text-destructive/80"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  className="h-8 w-8"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  className="h-8 w-8"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  ₹{item.price.toLocaleString()} each
                </div>
                <div className="text-lg font-bold text-primary">
                  ₹{(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="fade-in">
            <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-muted-foreground" />
            <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Looks like you haven't added anything to your cart yet
            </p>
            <Link to="/products">
              <Button className="btn-hero">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shopping Cart</h1>
          <p className="text-xl text-muted-foreground">
            Review your items and proceed to checkout
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                Items ({cartItems.length})
              </h2>
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-destructive hover:text-destructive/80"
              >
                Clear Cart
              </Button>
            </div>
            
            {cartItems.map((item) => (
              <CartItemCard key={item.id} item={item} />
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8 scale-in">
              <CardHeader>
                <CardTitle className="text-2xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="truncate mr-2">
                        {item.name} × {item.quantity}
                      </span>
                      <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">₹{getCartTotal().toLocaleString()}</span>
                </div>
                
                <Button
                  onClick={handleWhatsAppCheckout}
                  disabled={isProcessing}
                  className="w-full btn-hero mt-6"
                >
                  {isProcessing ? 'Processing...' : 'Proceed to WhatsApp'}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center mt-4">
                  You'll be redirected to WhatsApp to complete your order
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
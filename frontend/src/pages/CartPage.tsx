import React from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { useRemoveFromCart } from '@/hooks/useQueries';
import { getProductImage } from '@/components/ProductCard';
import { toast } from 'sonner';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=200&h=250&fit=crop';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, total, itemCount, removeItem, updateQuantity } = useCart();
  const removeFromCartMutation = useRemoveFromCart();

  const handleRemove = async (productId: bigint, size: string, name: string) => {
    try {
      await removeFromCartMutation.mutateAsync({ productId, size });
      removeItem(productId, size);
      toast.success(`${name} removed from cart`);
    } catch {
      // Still remove locally even if backend fails
      removeItem(productId, size);
      toast.success(`${name} removed from cart`);
    }
  };

  const handleQuantityChange = (productId: bigint, size: string, newQty: number) => {
    updateQuantity(productId, size, newQty);
  };

  if (itemCount === 0) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">Your cart is empty</h2>
          <p className="font-body text-muted-foreground mb-8">
            Looks like you haven't added any kurtas yet. Explore our beautiful collection!
          </p>
          <Button
            size="lg"
            onClick={() => navigate({ to: '/' })}
            className="gap-2 font-body font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">
        Shopping Cart
        <span className="font-body text-base font-normal text-muted-foreground ml-3">
          ({itemCount} {itemCount === 1 ? 'item' : 'items'})
        </span>
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div
              key={`${item.productId}-${item.size}`}
              className="bg-card rounded-lg border border-border p-4 flex gap-4 shadow-xs"
            >
              {/* Image */}
              <div className="w-20 h-24 md:w-24 md:h-28 rounded-md overflow-hidden bg-muted shrink-0">
                <img
                  src={item.productImage && !item.productImage.includes('example.com') ? item.productImage : FALLBACK_IMAGE}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_IMAGE; }}
                />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-base font-semibold text-foreground mb-1 truncate">
                  {item.productName}
                </h3>
                <p className="font-body text-sm text-muted-foreground mb-2">Size: {item.size}</p>
                <p className="font-display text-lg font-bold text-primary">
                  ₹{Number(item.price).toLocaleString('en-IN')}
                </p>

                <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.size, item.quantity - 1)}
                      className="h-7 w-7 rounded-sm border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="font-body text-sm font-semibold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, item.size, item.quantity + 1)}
                      className="h-7 w-7 rounded-sm border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  {/* Subtotal & Remove */}
                  <div className="flex items-center gap-3">
                    <span className="font-body text-sm text-muted-foreground">
                      Subtotal:{' '}
                      <span className="font-semibold text-foreground">
                        ₹{Number(item.price * BigInt(item.quantity)).toLocaleString('en-IN')}
                      </span>
                    </span>
                    <button
                      onClick={() => handleRemove(item.productId, item.size, item.productName)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="ghost"
            onClick={() => navigate({ to: '/' })}
            className="gap-2 font-body text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border border-border p-6 shadow-card sticky top-24">
            <h2 className="font-display text-xl font-bold text-foreground mb-5">Order Summary</h2>

            <div className="space-y-3 mb-5">
              {items.map(item => (
                <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground truncate mr-2">
                    {item.productName} × {item.quantity}
                  </span>
                  <span className="text-foreground font-medium shrink-0">
                    ₹{Number(item.price * BigInt(item.quantity)).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="mb-4" />

            <div className="flex justify-between items-center mb-6">
              <span className="font-body font-semibold text-foreground">Total</span>
              <span className="font-display text-2xl font-bold text-primary">
                ₹{Number(total).toLocaleString('en-IN')}
              </span>
            </div>

            <Button
              size="lg"
              className="w-full gap-2 font-body font-medium"
              onClick={() => navigate({ to: '/checkout' })}
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Button>

            <p className="font-body text-xs text-muted-foreground text-center mt-3">
              Free shipping on orders above ₹999
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

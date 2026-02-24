import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowLeft, CheckCircle, MapPin, User, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { useCheckout, useClearCart } from '@/hooks/useQueries';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, total, itemCount, clearCart } = useCart();
  const checkoutMutation = useCheckout();
  const clearCartMutation = useClearCart();

  const [deliveryName, setDeliveryName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [errors, setErrors] = useState<{ name?: string; address?: string }>({});

  const validate = () => {
    const newErrors: { name?: string; address?: string } = {};
    if (!deliveryName.trim()) newErrors.name = 'Please enter your name';
    if (!deliveryAddress.trim()) newErrors.address = 'Please enter your delivery address';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validate()) return;
    if (itemCount === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      const orderId = await checkoutMutation.mutateAsync({
        deliveryName: deliveryName.trim(),
        deliveryAddress: deliveryAddress.trim(),
      });

      // Clear backend cart
      try {
        await clearCartMutation.mutateAsync();
      } catch {
        // Ignore if already cleared
      }

      // Clear local cart
      clearCart();

      // Navigate to confirmation
      navigate({
        to: '/order-confirmation',
        search: {
          orderId: orderId.toString(),
          total: total.toString(),
          name: deliveryName.trim(),
        },
      });
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    }
  };

  if (itemCount === 0) {
    return (
      <main className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-2xl font-bold text-foreground mb-3">Your cart is empty</h2>
          <p className="font-body text-muted-foreground mb-6">Add some kurtas before checking out!</p>
          <Button onClick={() => navigate({ to: '/' })} className="gap-2 font-body">
            <ArrowLeft className="h-4 w-4" /> Shop Now
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      <button
        onClick={() => navigate({ to: '/cart' })}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-body text-sm mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Cart
      </button>

      <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Delivery Form */}
        <div>
          <div className="bg-card rounded-lg border border-border p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Delivery Details
            </h2>

            <div className="space-y-5">
              <div>
                <Label htmlFor="name" className="font-body text-sm font-medium text-foreground mb-1.5 block">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={deliveryName}
                  onChange={e => {
                    setDeliveryName(e.target.value);
                    if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                  }}
                  className={`font-body ${errors.name ? 'border-destructive' : ''}`}
                />
                {errors.name && (
                  <p className="font-body text-xs text-destructive mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label htmlFor="address" className="font-body text-sm font-medium text-foreground mb-1.5 block">
                  Delivery Address *
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete delivery address including city, state, and PIN code"
                  value={deliveryAddress}
                  onChange={e => {
                    setDeliveryAddress(e.target.value);
                    if (errors.address) setErrors(prev => ({ ...prev, address: undefined }));
                  }}
                  rows={4}
                  className={`font-body resize-none ${errors.address ? 'border-destructive' : ''}`}
                />
                {errors.address && (
                  <p className="font-body text-xs text-destructive mt-1">{errors.address}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div className="bg-card rounded-lg border border-border p-6 shadow-card">
            <h2 className="font-display text-xl font-semibold text-foreground mb-5">Order Summary</h2>

            <div className="space-y-3 mb-5 max-h-64 overflow-y-auto">
              {items.map(item => (
                <div key={`${item.productId}-${item.size}`} className="flex justify-between items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm font-medium text-foreground truncate">{item.productName}</p>
                    <p className="font-body text-xs text-muted-foreground">
                      Size: {item.size} · Qty: {item.quantity}
                    </p>
                  </div>
                  <span className="font-body text-sm font-semibold text-foreground shrink-0">
                    ₹{Number(item.price * BigInt(item.quantity)).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

            <Separator className="mb-4" />

            <div className="space-y-2 mb-5">
              <div className="flex justify-between font-body text-sm">
                <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
                <span className="text-foreground">₹{Number(total).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-700 font-medium">
                  {Number(total) >= 999 ? 'Free' : '₹99'}
                </span>
              </div>
            </div>

            <Separator className="mb-4" />

            <div className="flex justify-between items-center mb-6">
              <span className="font-body font-bold text-foreground text-lg">Total</span>
              <span className="font-display text-2xl font-bold text-primary">
                ₹{(Number(total) >= 999 ? Number(total) : Number(total) + 99).toLocaleString('en-IN')}
              </span>
            </div>

            <Button
              size="lg"
              className="w-full gap-2 font-body font-medium"
              onClick={handlePlaceOrder}
              disabled={checkoutMutation.isPending}
            >
              {checkoutMutation.isPending ? (
                <>
                  <span className="h-4 w-4 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Place Order
                </>
              )}
            </Button>

            <p className="font-body text-xs text-muted-foreground text-center mt-3">
              By placing your order, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

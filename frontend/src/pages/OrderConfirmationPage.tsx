import React from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { CheckCircle, ShoppingBag, Home, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const search = useSearch({ from: '/order-confirmation' });
  const orderId = (search as any).orderId ?? 'N/A';
  const total = (search as any).total ?? '0';
  const name = (search as any).name ?? '';

  return (
    <main className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-lg mx-auto text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
          Order Confirmed!
        </h1>
        <p className="font-body text-muted-foreground text-lg mb-8">
          Thank you{name ? `, ${name}` : ''}! Your order has been placed successfully.
        </p>

        {/* Order Details Card */}
        <div className="bg-card rounded-lg border border-border p-6 shadow-card text-left mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Order Details</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between font-body text-sm">
              <span className="text-muted-foreground">Order ID</span>
              <span className="font-semibold text-foreground">#{orderId}</span>
            </div>
            <div className="flex justify-between font-body text-sm">
              <span className="text-muted-foreground">Order Total</span>
              <span className="font-semibold text-primary font-display text-base">
                ₹{Number(total).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between font-body text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-sm text-xs">
                Pending
              </span>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="bg-secondary rounded-md p-3">
            <p className="font-body text-sm text-muted-foreground">
              🎉 Your kurtas are being prepared with care. You'll receive your order soon!
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center flex-wrap">
          <Button
            size="lg"
            onClick={() => navigate({ to: '/' })}
            className="gap-2 font-body font-medium"
          >
            <Home className="h-4 w-4" />
            Continue Shopping
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate({ to: '/' })}
            className="gap-2 font-body font-medium"
          >
            <ShoppingBag className="h-4 w-4" />
            Browse More
          </Button>
        </div>
      </div>
    </main>
  );
}

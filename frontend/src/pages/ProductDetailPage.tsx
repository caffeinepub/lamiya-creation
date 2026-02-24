import React, { useState } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, ShoppingBag, Minus, Plus, Star, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useGetProductById, useAddToCart } from '@/hooks/useQueries';
import { useCart } from '@/context/CartContext';
import { getProductImage } from '@/components/ProductCard';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { id } = useParams({ from: '/product/$id' });
  const navigate = useNavigate();
  const productId = BigInt(id);

  const { data: product, isLoading, error } = useGetProductById(productId);
  const { addItem } = useCart();
  const addToCartMutation = useAddToCart();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const isOutOfStock = product ? product.stock === BigInt(0) : false;
  const maxQty = product ? Math.min(Number(product.stock), 10) : 10;

  const handleAddToCart = async () => {
    if (!product) return;
    const size = selectedSize || product.sizes[0];
    if (!size) {
      toast.error('Please select a size');
      return;
    }
    setIsAdding(true);
    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        size,
        quantity: BigInt(quantity),
      });
      addItem({
        productId: product.id,
        productName: product.name,
        productImage: product.imageUrl,
        price: product.price,
        size,
        quantity,
      });
      toast.success(`${product.name} added to cart!`, {
        description: `Size: ${size} · Qty: ${quantity}`,
        action: {
          label: 'View Cart',
          onClick: () => navigate({ to: '/cart' }),
        },
      });
    } catch (err) {
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <Skeleton className="aspect-[3/4] w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="font-display text-2xl text-foreground mb-4">Product not found</h2>
        <Button onClick={() => navigate({ to: '/' })} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Button>
      </div>
    );
  }

  const imageUrl = getProductImage(product);

  return (
    <main className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate({ to: '/' })}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-body text-sm mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Collections
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="relative">
          <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted shadow-card">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600&h=800&fit=crop';
              }}
            />
          </div>
          <div className="absolute top-4 left-4">
            <span className="bg-card/90 backdrop-blur-sm text-foreground text-xs font-body font-medium px-3 py-1.5 rounded-sm border border-border">
              {product.category}
            </span>
          </div>
          {isOutOfStock && (
            <div className="absolute top-4 right-4">
              <span className="bg-destructive text-destructive-foreground text-xs font-body font-semibold px-3 py-1.5 rounded-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <div className="mb-2">
            <span className="font-body text-xs text-primary font-medium tracking-widest uppercase">
              {product.category}
            </span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-4">
            <span className="font-display text-3xl font-bold text-primary">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Rating placeholder */}
          <div className="flex items-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} className={`h-4 w-4 ${s <= 4 ? 'fill-gold text-gold' : 'text-muted-foreground'}`} />
            ))}
            <span className="font-body text-sm text-muted-foreground ml-1">(4.0)</span>
          </div>

          <Separator className="mb-5" />

          <p className="font-body text-muted-foreground leading-relaxed mb-6">
            {product.description}
          </p>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-5">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span className={`font-body text-sm font-medium ${isOutOfStock ? 'text-destructive' : 'text-green-700'}`}>
              {isOutOfStock ? 'Out of Stock' : `${Number(product.stock)} in stock`}
            </span>
          </div>

          {/* Size Selector */}
          {product.sizes.length > 0 && (
            <div className="mb-6">
              <p className="font-body text-sm font-semibold text-foreground mb-3">
                Select Size
                {selectedSize && <span className="text-primary ml-2">— {selectedSize}</span>}
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`font-body text-sm px-4 py-2 rounded-sm border-2 transition-all duration-200 font-medium ${
                      selectedSize === size
                        ? 'border-primary bg-primary text-primary-foreground'
                        : 'border-border bg-card text-foreground hover:border-primary hover:text-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mb-6">
            <p className="font-body text-sm font-semibold text-foreground mb-3">Quantity</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="h-9 w-9 rounded-sm border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="font-body text-lg font-semibold w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(q => Math.min(maxQty, q + 1))}
                disabled={quantity >= maxQty}
                className="h-9 w-9 rounded-sm border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <div className="flex gap-3 flex-wrap">
            <Button
              size="lg"
              disabled={isOutOfStock || isAdding}
              onClick={handleAddToCart}
              className="flex-1 gap-2 font-body font-medium"
            >
              {isAdding ? (
                <>
                  <span className="h-4 w-4 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" />
                  Adding to Cart...
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate({ to: '/cart' })}
              className="font-body font-medium"
            >
              View Cart
            </Button>
          </div>

          <Separator className="my-6" />

          {/* Product Details */}
          <div className="space-y-2">
            <h3 className="font-display text-base font-semibold text-foreground">Product Details</h3>
            <div className="grid grid-cols-2 gap-2 text-sm font-body">
              <span className="text-muted-foreground">Category</span>
              <span className="text-foreground font-medium">{product.category}</span>
              <span className="text-muted-foreground">Available Sizes</span>
              <span className="text-foreground font-medium">{product.sizes.join(', ')}</span>
              <span className="text-muted-foreground">Product ID</span>
              <span className="text-foreground font-medium">#{product.id.toString()}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

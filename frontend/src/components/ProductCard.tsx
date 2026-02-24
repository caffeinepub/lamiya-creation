import React from 'react';
import { Link } from '@tanstack/react-router';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Product } from '../backend';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  isAdding?: boolean;
}

const SKY_BLUE_CHIKANKARI = '/assets/generated/sky-blue-chikankari-kurta.dim_600x800.png';

const FALLBACK_IMAGES: Record<string, string> = {
  'Casual': '/assets/generated/chikankari-mint.dim_600x800.png',
  'Festive': '/assets/generated/chikankari-coral.dim_600x800.png',
  'Embroidered': '/assets/generated/chikankari-lavender.dim_600x800.png',
  'Chikan Kari': SKY_BLUE_CHIKANKARI,
  'Ethnic Set': SKY_BLUE_CHIKANKARI,
  'Plazo': '/assets/generated/chikankari-peach.dim_600x800.png',
  'Anarkali': '/assets/generated/chikankari-pink.dim_600x800.png',
  'Suits': '/assets/generated/chikankari-yellow.dim_600x800.png',
  'Block Print': '/assets/generated/chikankari-white.dim_600x800.png',
  'Premium': SKY_BLUE_CHIKANKARI,
};

const DEFAULT_FALLBACK = SKY_BLUE_CHIKANKARI;

export function getProductImage(product: Product): string {
  if (product.imageUrl && !product.imageUrl.includes('example.com')) {
    return product.imageUrl;
  }
  return FALLBACK_IMAGES[product.category] || DEFAULT_FALLBACK;
}

export default function ProductCard({ product, onAddToCart, isAdding }: ProductCardProps) {
  const imageUrl = getProductImage(product);
  const isOutOfStock = product.stock === BigInt(0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      onAddToCart(product);
    }
  };

  return (
    <Link to="/product/$id" params={{ id: product.id.toString() }} className="group block">
      <div className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-border">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4] bg-muted">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = DEFAULT_FALLBACK;
            }}
          />
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-card/90 backdrop-blur-sm text-foreground text-xs font-body font-medium px-2 py-1 rounded-sm border border-border">
              {product.category}
            </span>
          </div>
          {isOutOfStock && (
            <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center">
              <span className="bg-card text-foreground text-sm font-body font-semibold px-4 py-2 rounded-sm">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display text-base font-semibold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="font-body text-xs text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>

          <div className="flex items-center justify-between">
            <span className="font-display text-lg font-bold text-primary">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            <Button
              size="sm"
              variant={isOutOfStock ? 'outline' : 'default'}
              disabled={isOutOfStock || isAdding}
              onClick={handleAddToCart}
              className="text-xs gap-1.5"
            >
              {isAdding ? (
                <span className="flex items-center gap-1">
                  <span className="h-3 w-3 border-2 border-primary-foreground/50 border-t-primary-foreground rounded-full animate-spin" />
                  Adding...
                </span>
              ) : (
                <>
                  <ShoppingBag className="h-3.5 w-3.5" />
                  {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
                </>
              )}
            </Button>
          </div>

          {/* Sizes preview */}
          {product.sizes.length > 0 && (
            <div className="flex gap-1 mt-3 flex-wrap">
              {product.sizes.slice(0, 4).map(size => (
                <span
                  key={size}
                  className="text-xs font-body text-muted-foreground border border-border rounded-sm px-1.5 py-0.5"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="text-xs font-body text-muted-foreground">+{product.sizes.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

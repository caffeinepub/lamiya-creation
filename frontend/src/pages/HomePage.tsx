import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { ArrowRight, Sparkles, Star, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/ProductCard';
import { useGetAllProducts } from '@/hooks/useQueries';
import { useActor } from '@/hooks/useActor';
import { useCart } from '@/context/CartContext';
import { useAddToCart } from '@/hooks/useQueries';
import { toast } from 'sonner';
import type { Product } from '../backend';

const SKY_BLUE_CHIKANKARI = '/assets/generated/sky-blue-chikankari-kurta.dim_600x800.png';

const CATEGORIES = [
  'All',
  'Chikan Kari',
  'Plazo',
  'Anarkali',
  'Festive',
  'Casual',
  'Embroidered',
  'Block Print',
  'Ethnic Set',
  'Suits',
  'Premium',
];

const COLLECTION_CARDS = [
  {
    title: 'Chikan Kari',
    desc: 'Exquisite hand-embroidered chikan work',
    emoji: '🌸',
    bg: 'bg-rose-50 dark:bg-rose-950/20',
    image: SKY_BLUE_CHIKANKARI,
  },
  {
    title: 'Plazo',
    desc: 'Flowy plazos for effortless style',
    emoji: '🌿',
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    image: '/assets/generated/chikankari-mint.dim_600x800.png',
  },
  {
    title: 'Anarkali',
    desc: 'Timeless anarkali silhouettes',
    emoji: '✨',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    image: '/assets/generated/chikankari-peach.dim_600x800.png',
  },
  {
    title: 'Festive',
    desc: 'Vibrant celebration wear',
    emoji: '🎉',
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    image: '/assets/generated/chikankari-coral.dim_600x800.png',
  },
  {
    title: 'Casual',
    desc: 'Comfortable everyday kurtas',
    emoji: '☀️',
    bg: 'bg-sky-50 dark:bg-sky-950/20',
    image: '/assets/generated/chikankari-yellow.dim_600x800.png',
  },
  {
    title: 'Premium',
    desc: 'Exclusive luxury edition pieces',
    emoji: '👑',
    bg: 'bg-yellow-50 dark:bg-yellow-950/20',
    image: SKY_BLUE_CHIKANKARI,
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const { isFetching: actorFetching } = useActor();
  const { data: products, isLoading, isFetching: productsFetching, error, refetch } = useGetAllProducts();
  const { addItem } = useCart();
  const addToCartMutation = useAddToCart();
  const [activeCategory, setActiveCategory] = useState('All');
  const [addingId, setAddingId] = useState<string | null>(null);

  // Show loading while actor is initializing OR products are loading
  const showLoading = actorFetching || isLoading || (productsFetching && !products);

  const filteredProducts = products?.filter(p =>
    activeCategory === 'All' ? true : p.category === activeCategory
  ) ?? [];

  const handleAddToCart = async (product: Product) => {
    const key = `${product.id}-${product.sizes[0] ?? 'M'}`;
    setAddingId(key);
    const defaultSize = product.sizes[0] ?? 'M';
    try {
      await addToCartMutation.mutateAsync({
        productId: product.id,
        size: defaultSize,
        quantity: BigInt(1),
      });
      addItem({
        productId: product.id,
        productName: product.name,
        productImage: product.imageUrl,
        price: product.price,
        size: defaultSize,
        quantity: 1,
      });
      toast.success(`${product.name} added to cart!`, {
        description: `Size: ${defaultSize}`,
        action: {
          label: 'View Cart',
          onClick: () => navigate({ to: '/cart' }),
        },
      });
    } catch (err) {
      toast.error('Failed to add to cart. Please try again.');
    } finally {
      setAddingId(null);
    }
  };

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="relative h-[420px] md:h-[520px] w-full">
          <img
            src="/assets/generated/hero-banner.dim_1440x500.png"
            alt="Lamiya Creation - Elegant Kurtas"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-warm-brown/85 via-warm-brown/50 to-transparent" />

          {/* Sky-blue chikankari kurta accent image on the right */}
          <div className="absolute right-0 top-0 h-full w-[260px] md:w-[340px] lg:w-[400px] hidden sm:block overflow-hidden">
            <img
              src={SKY_BLUE_CHIKANKARI}
              alt="Sky Blue Chikankari Kurta"
              className="h-full w-full object-cover object-top opacity-90"
              style={{ maskImage: 'linear-gradient(to left, rgba(0,0,0,0.85) 60%, transparent 100%)' }}
            />
          </div>

          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 md:px-8">
              <div className="max-w-xl animate-fade-in">
                {/* Decorative top line */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8 bg-gold/70" />
                  <p className="font-body text-gold text-xs font-medium tracking-[0.25em] uppercase">
                    New Collection 2026
                  </p>
                  <div className="h-px w-8 bg-gold/70" />
                </div>

                {/* Enhanced Brand Title */}
                <div className="mb-2">
                  <h1 className="lamiya-brand-title font-display leading-none mb-1">
                    Lamiya
                  </h1>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="lamiya-brand-title-creation font-display leading-none">
                      Creation
                    </h1>
                    <div className="flex gap-1 items-center">
                      <Star className="h-4 w-4 text-gold fill-gold opacity-80" />
                      <Star className="h-3 w-3 text-gold fill-gold opacity-60" />
                    </div>
                  </div>
                  {/* Decorative flourish */}
                  <div className="lamiya-flourish mt-2 mb-4">
                    <svg viewBox="0 0 220 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-48 md:w-56 h-auto">
                      <path d="M2 9 Q30 2 55 9 Q80 16 110 9 Q140 2 165 9 Q190 16 218 9" stroke="url(#flourishGrad)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                      <circle cx="110" cy="9" r="3" fill="url(#flourishGrad)" opacity="0.9"/>
                      <circle cx="55" cy="9" r="1.5" fill="url(#flourishGrad)" opacity="0.7"/>
                      <circle cx="165" cy="9" r="1.5" fill="url(#flourishGrad)" opacity="0.7"/>
                      <defs>
                        <linearGradient id="flourishGrad" x1="0" y1="0" x2="220" y2="0" gradientUnits="userSpaceOnUse">
                          <stop offset="0%" stopColor="#c0392b" stopOpacity="0.6"/>
                          <stop offset="40%" stopColor="#d4a017" stopOpacity="1"/>
                          <stop offset="70%" stopColor="#c0392b" stopOpacity="0.8"/>
                          <stop offset="100%" stopColor="#6b2d5e" stopOpacity="0.6"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>

                <h2 className="font-display text-2xl md:text-3xl font-semibold text-ivory/90 leading-tight mb-4">
                  Elegance in{' '}
                  <span className="text-gold italic">Every Thread</span>
                </h2>
                <p className="font-body text-ivory/75 text-sm md:text-base mb-8 leading-relaxed max-w-sm">
                  Discover handcrafted kurtas that blend tradition with contemporary style.
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-terracotta-dark text-primary-foreground font-body font-medium gap-2"
                    onClick={() => {
                      document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Shop Now <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-ivory/50 text-ivory hover:bg-ivory/10 font-body font-medium"
                    onClick={() => navigate({ to: '/cart' })}
                  >
                    View Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-secondary border-y border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { icon: '🧵', label: 'Handcrafted Quality' },
              { icon: '🚚', label: 'Free Shipping ₹999+' },
              { icon: '↩️', label: 'Easy Returns' },
              { icon: '⭐', label: 'Premium Fabrics' },
            ].map(f => (
              <div key={f.label} className="flex items-center justify-center gap-2 py-1">
                <span className="text-lg">{f.icon}</span>
                <span className="font-body text-xs md:text-sm font-medium text-foreground/70">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ramadan Special Offer Banner */}
      <section className="ramadan-banner-section relative overflow-hidden">
        <div className="relative min-h-[220px] md:min-h-[280px] w-full">
          {/* Background image */}
          <img
            src="/assets/generated/ramadan-banner.dim_1200x400.png"
            alt="Ramadan Special Offer"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 ramadan-overlay" />

          {/* Decorative crescent & stars */}
          <div className="absolute top-4 right-6 md:right-16 flex items-start gap-2 opacity-70 pointer-events-none select-none">
            <span className="text-3xl md:text-5xl" style={{ filter: 'drop-shadow(0 0 8px #d4a01788)' }}>☪️</span>
          </div>
          <div className="absolute top-3 left-6 opacity-40 pointer-events-none select-none hidden md:block">
            <Sparkles className="h-6 w-6 text-yellow-300" />
          </div>

          {/* Content */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-10 md:py-14 min-h-[220px] md:min-h-[280px]">
            {/* Top badge */}
            <div className="inline-flex items-center gap-2 ramadan-badge px-4 py-1.5 rounded-full mb-4">
              <span className="text-sm">✦</span>
              <span className="font-body text-xs font-semibold tracking-[0.2em] uppercase">Limited Time Offer</span>
              <span className="text-sm">✦</span>
            </div>

            {/* Heading */}
            <h2 className="ramadan-heading font-display text-3xl md:text-5xl font-bold mb-2 leading-tight">
              Ramadan Kareem
            </h2>
            <p className="ramadan-subheading font-display text-lg md:text-2xl italic mb-3">
              Celebrate with Grace & Style
            </p>

            {/* Offer text */}
            <div className="flex items-center gap-3 mb-6 flex-wrap justify-center">
              <div className="ramadan-offer-pill font-body font-bold text-xl md:text-3xl px-5 py-2 rounded-lg">
                Up to 30% Off
              </div>
              <p className="font-body text-sm md:text-base ramadan-offer-desc max-w-xs">
                on Festive Kurtas, Chikan Kari &amp; Premium Collections
              </p>
            </div>

            {/* CTA */}
            <button
              className="ramadan-cta-btn font-body font-semibold text-sm md:text-base px-8 py-3 rounded-full transition-all duration-300 flex items-center gap-2 group"
              onClick={() => {
                setActiveCategory('Festive');
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Shop Festive Collection
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </section>

      {/* Collections Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <p className="font-body text-primary text-sm font-medium tracking-widest uppercase mb-2">
            Our Collections
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Curated for Every Occasion
          </h2>
          <p className="font-body text-muted-foreground max-w-md mx-auto text-sm">
            From casual everyday wear to festive celebrations — explore 500+ styles of chikan kari, plazos, anarkalis, and more.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
          {COLLECTION_CARDS.map(cat => (
            <button
              key={cat.title}
              onClick={() => {
                setActiveCategory(cat.title);
                document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`rounded-lg overflow-hidden text-left border-2 transition-all duration-200 hover:shadow-card ${
                activeCategory === cat.title ? 'border-primary shadow-card' : 'border-transparent'
              }`}
            >
              {/* Collection image */}
              <div className="aspect-[3/4] w-full overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = SKY_BLUE_CHIKANKARI;
                  }}
                />
              </div>
              {/* Label */}
              <div className={`${cat.bg} p-3`}>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-base">{cat.emoji}</span>
                  <h3 className="font-display text-sm font-semibold text-foreground leading-tight">{cat.title}</h3>
                </div>
                <p className="font-body text-xs text-muted-foreground leading-snug">{cat.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section id="products" className="container mx-auto px-4 pb-16">
        <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground">
            {activeCategory === 'All' ? 'All Kurtas' : `${activeCategory} Kurtas`}
            {!showLoading && filteredProducts.length > 0 && (
              <span className="ml-2 font-body text-base font-normal text-muted-foreground">
                ({filteredProducts.length})
              </span>
            )}
          </h2>
          {/* Category filter tabs */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`font-body text-xs px-3 py-1.5 rounded-full border transition-all duration-150 ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-background text-foreground border-border hover:border-primary/50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {showLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden border border-border">
                <Skeleton className="aspect-[3/4] w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-8 w-full mt-2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!showLoading && error && (
          <div className="text-center py-16">
            <p className="font-body text-destructive text-sm mb-4">Failed to load products. Please try again.</p>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => refetch()}
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
          </div>
        )}

        {!showLoading && !error && filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="font-body text-muted-foreground text-sm">No products found in this category.</p>
            <Button variant="outline" className="mt-4" onClick={() => setActiveCategory('All')}>
              View All Products
            </Button>
          </div>
        )}

        {!showLoading && !error && filteredProducts.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id.toString()}
                product={product}
                onAddToCart={handleAddToCart}
                isAdding={addingId === `${product.id}-${product.sizes[0] ?? 'M'}`}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

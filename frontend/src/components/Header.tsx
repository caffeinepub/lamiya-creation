import React from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingBag, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Header() {
  const { itemCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Collections', to: '/' },
    { label: 'Cart', to: '/cart' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-xs">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/assets/generated/lamiya-logo.dim_400x120.png"
            alt="Lamiya Creation Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.to + link.label}
              to={link.to}
              className="font-body text-sm font-medium text-foreground/70 hover:text-primary transition-colors duration-200 tracking-wide uppercase"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Cart Icon */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => navigate({ to: '/cart' })}
            aria-label="Shopping cart"
          >
            <ShoppingBag className="h-5 w-5 text-foreground" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </Button>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-4 animate-fade-in">
          {navLinks.map(link => (
            <Link
              key={link.to + link.label}
              to={link.to}
              className="font-body text-sm font-medium text-foreground/70 hover:text-primary transition-colors uppercase tracking-wide"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

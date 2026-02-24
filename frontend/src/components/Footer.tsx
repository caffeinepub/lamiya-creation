import React from 'react';
import { Link } from '@tanstack/react-router';
import { Heart, Phone } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(typeof window !== 'undefined' ? window.location.hostname : 'lamiya-creation');

  return (
    <footer className="bg-warm-brown text-ivory mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl font-semibold text-gold mb-3">Lamiya Creation</h3>
            <p className="font-body text-sm text-ivory/70 leading-relaxed">
              Celebrating the art of Indian ethnic fashion. Handcrafted kurtas for every occasion.
            </p>
            <a
              href="tel:8130422230"
              className="inline-flex items-center gap-2 mt-4 font-body text-sm text-ivory/70 hover:text-gold transition-colors"
            >
              <Phone className="h-4 w-4" />
              8130422230
            </a>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-base font-semibold text-ivory mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { label: 'Home', to: '/' },
                { label: 'Cart', to: '/cart' },
                { label: 'Checkout', to: '/checkout' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="font-body text-sm text-ivory/60 hover:text-gold transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display text-base font-semibold text-ivory mb-3">Categories</h4>
            <ul className="space-y-2">
              {['Casual', 'Festive', 'Embroidered'].map(cat => (
                <li key={cat}>
                  <span className="font-body text-sm text-ivory/60">{cat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-ivory/10 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-ivory/50">
            © {year} Lamiya Creation. All rights reserved.
          </p>
          <p className="font-body text-xs text-ivory/50 flex items-center gap-1">
            Built with{' '}
            <Heart className="h-3 w-3 fill-terracotta text-terracotta" />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gold hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
